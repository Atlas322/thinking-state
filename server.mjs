// Production server: serves the Vite build from ./dist and exposes a Railway
// deployment webhook that forwards status changes to email via Resend.
import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import handler from "serve-handler";

const PORT = Number(process.env.PORT) || 3000;
const WEBHOOK_PATH = "/api/railway-webhook";
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_TO = (process.env.NOTIFY_EMAIL_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
const EMAIL_FROM = process.env.NOTIFY_EMAIL_FROM || "Railway Deploys <onboarding@resend.dev>";
const STATUSES = new Set(
  (process.env.NOTIFY_STATUSES || "SUCCESS,FAILED,CRASHED")
    .split(",").map((s) => s.trim().toUpperCase()).filter(Boolean),
);

const safeEqual = (a, b) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

const readJson = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on("end", () => { try { resolve(JSON.parse(body || "{}")); } catch (e) { reject(e); } });
    req.on("error", reject);
  });

// Railway payload: { type: "Deployment.success", details: {...}, resource: {...}, timestamp }
// Older shape: { type: "DEPLOY", status, project, environment, service, deployment, timestamp }
const summarize = (p) => {
  const d = p.details || p.deployment?.meta || {};
  const r = p.resource || {};
  const fromType = typeof p.type === "string" && p.type.includes(".") ? p.type.split(".").pop() : "";
  const status = String(d.status || p.status || fromType || "UNKNOWN").toUpperCase();
  return {
    status,
    project: r.project?.name || p.project?.name || "",
    environment: r.environment?.name || p.environment?.name || "",
    service: r.service?.name || p.service?.name || "",
    branch: d.branch || "",
    commit: (d.commitHash || "").slice(0, 7),
    author: d.commitAuthor || "",
    message: d.commitMessage || "",
    deploymentId: r.deployment?.id || p.deployment?.id || d.id || "",
    timestamp: p.timestamp || new Date().toISOString(),
  };
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const sendEmail = async (s, raw, idempotencyKey) => {
  const emoji = s.status === "SUCCESS" ? "✅" : s.status === "FAILED" ? "❌" : s.status === "CRASHED" ? "💥" : s.status === "TEST" ? "🔔" : "ℹ️";
  const subject = `${emoji} ${s.service || "service"} deploy ${s.status}${s.commit ? ` (${s.commit})` : ""}`;
  const rows = [
    ["Project", s.project], ["Environment", s.environment], ["Service", s.service],
    ["Status", s.status], ["Branch", s.branch], ["Commit", s.commit],
    ["Author", s.author], ["Message", s.message], ["URL", s.url], ["Deployment", s.deploymentId], ["Time", s.timestamp],
  ].filter(([, v]) => v);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<h2>${esc(subject)}</h2><table>${rows
    .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>
    <details><summary>Raw payload</summary><pre>${esc(JSON.stringify(raw, null, 2))}</pre></details>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify({ from: EMAIL_FROM, to: EMAIL_TO, subject, text, html }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Resend ${res.status}: ${body}`);
  return body;
};

const json = (res, code, obj) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); };

const TEST_PATH = "/api/notify-test";
const TEST_COOLDOWN_MS = Number(process.env.NOTIFY_TEST_COOLDOWN_MS) || 30_000;
let lastTestAt = 0;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === TEST_PATH) {
    if (req.method !== "POST") return json(res, 405, { error: "method not allowed" });
    if (!RESEND_API_KEY || EMAIL_TO.length === 0) return json(res, 503, { ok: false, error: "email not configured" });
    const wait = lastTestAt + TEST_COOLDOWN_MS - Date.now();
    if (wait > 0) return json(res, 429, { ok: false, error: `try again in ${Math.ceil(wait / 1000)}s` });
    lastTestAt = Date.now();
    const e = process.env;
    const s = {
      status: "TEST",
      project: e.RAILWAY_PROJECT_NAME || "", environment: e.RAILWAY_ENVIRONMENT_NAME || "",
      service: e.RAILWAY_SERVICE_NAME || "", branch: e.RAILWAY_GIT_BRANCH || "",
      commit: (e.RAILWAY_GIT_COMMIT_SHA || "").slice(0, 7), author: e.RAILWAY_GIT_AUTHOR || "",
      message: "Manual test from the website notification button",
      deploymentId: e.RAILWAY_DEPLOYMENT_ID || "", timestamp: new Date().toISOString(),
      url: e.RAILWAY_PUBLIC_DOMAIN ? `https://${e.RAILWAY_PUBLIC_DOMAIN}` : "",
    };
    const meta = { ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress, userAgent: req.headers["user-agent"] };
    try {
      const out = await sendEmail(s, { source: "notify-test", request: meta }, null);
      console.log("[notify-test] email sent", out);
      return json(res, 200, { ok: true, to: EMAIL_TO, id: JSON.parse(out).id });
    } catch (err) {
      console.error("[notify-test] email failed", err.message);
      return json(res, 502, { ok: false, error: err.message });
    }
  }
  if (url.pathname === WEBHOOK_PATH) {
    if (req.method !== "POST") return json(res, 405, { error: "method not allowed" });
    const auth = req.headers.authorization || "";
    const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const provided = bearer || req.headers["x-webhook-secret"] || url.searchParams.get("token") || "";
    if (!WEBHOOK_TOKEN || !safeEqual(provided, WEBHOOK_TOKEN)) return json(res, 401, { error: "unauthorized" });
    let payload;
    try { payload = await readJson(req); } catch { return json(res, 400, { error: "invalid json" }); }
    const s = summarize(payload);
    if (!STATUSES.has(s.status)) return json(res, 200, { ok: true, skipped: `status ${s.status} not in NOTIFY_STATUSES` });
    if (!RESEND_API_KEY || EMAIL_TO.length === 0) {
      console.log("[webhook] email skipped (RESEND_API_KEY / NOTIFY_EMAIL_TO missing)", s);
      return json(res, 200, { ok: true, skipped: "email not configured", summary: s });
    }
    try {
      const out = await sendEmail(s, payload);
      console.log("[webhook] email sent", s.status, s.commit, out);
      return json(res, 200, { ok: true, sent: true, summary: s });
    } catch (e) {
      console.error("[webhook] email failed", e.message);
      return json(res, 502, { ok: false, error: e.message });
    }
  }
  return handler(req, res, { public: "dist", rewrites: [{ source: "**", destination: "/index.html" }] });
});

// Self-report: a fresh container with a RAILWAY_DEPLOYMENT_ID means a deploy just
// succeeded. Resend's Idempotency-Key (deployment id) stops duplicates on restarts.
const notifyStartup = async () => {
  const e = process.env;
  if (e.NOTIFY_ON_START === "false" || !e.RAILWAY_DEPLOYMENT_ID) return;
  if (!STATUSES.has("SUCCESS") || !RESEND_API_KEY || EMAIL_TO.length === 0) return;
  const s = {
    status: "SUCCESS",
    project: e.RAILWAY_PROJECT_NAME || "",
    environment: e.RAILWAY_ENVIRONMENT_NAME || "",
    service: e.RAILWAY_SERVICE_NAME || "",
    branch: e.RAILWAY_GIT_BRANCH || "",
    commit: (e.RAILWAY_GIT_COMMIT_SHA || "").slice(0, 7),
    author: e.RAILWAY_GIT_AUTHOR || "",
    message: e.RAILWAY_GIT_COMMIT_MESSAGE || "",
    deploymentId: e.RAILWAY_DEPLOYMENT_ID,
    timestamp: new Date().toISOString(),
    url: e.RAILWAY_PUBLIC_DOMAIN ? `https://${e.RAILWAY_PUBLIC_DOMAIN}` : "",
  };
  try {
    const out = await sendEmail(s, { source: "startup", env: s }, `deploy-${e.RAILWAY_DEPLOYMENT_ID}`);
    console.log("[startup] deploy email sent", s.commit, out);
  } catch (err) {
    console.error("[startup] deploy email failed", err.message);
  }
};

server.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on ${PORT}, webhook at ${WEBHOOK_PATH}`);
  setTimeout(notifyStartup, 3000);
});
