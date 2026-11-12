// Spacing check (2026-11-12): under every control — segmented control,
// tab row, radiogroup — the next content must start at least --ts-gap-control
// (16 px) below. Opens each catalog preview in headless Chrome at 1440 and 390
// and lists the controls with less room. Warns; --strict exits 1.
//
//   npm run dev     (another terminal; or pass --url)
//   node scripts/check-spacing.mjs [--url http://127.0.0.1:5173] [--min 16] [--only slug,slug] [--strict]
//
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const base = arg("url", "http://127.0.0.1:5173");
const cpu = Number(arg("cpu", "4"));
const seconds = Number(arg("seconds", "6"));
const width = Number(arg("width", "390"));
const chrome =
  process.env.CHROME ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => fs.existsSync(p));
if (!chrome) throw new Error("Chrome not found; set CHROME=/path/to/chrome");

const port = 9300 + Math.floor(Math.random() * 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ts-motion-"));
const proc = spawn(chrome, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--disable-background-timer-throttling",
  "--disable-renderer-backgrounding",
  ...(process.argv.includes("--gpu") ? ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=default"] : []),
  "about:blank",
]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
for (let i = 0; i < 50 && !target; i++) {
  await wait(200);
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
  } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m), pending.delete(m.id);
  else if (m.method === "Tracing.dataCollected") traceEvents.push(...m.params.value);
  else if (m.method === "Tracing.tracingComplete") traceDone?.();
});
const traceEvents = [];
let traceDone;
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const n = ++id;
    pending.set(n, resolve);
    ws.send(JSON.stringify({ id: n, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
  return r.result?.result?.value;
};

const min = Number(arg("min", "16"));
const only = arg("only", "");
const catalog = JSON.parse(fs.readFileSync(new URL("../src/catalog.json", import.meta.url), "utf8"));
const slugs = catalog.map((e) => e.slug).filter((s) => !only || only.split(",").includes(s));
const PROBE = (min) => `(() => {
  const stage = document.querySelector(".preview-stage") || document.body;
  const sel = '[role="radiogroup"], [role="tablist"], .ui-segc, .cv-seg, .cv-tabs, .cl-tabs';
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.opacity !== "0"; };
  const controls = [...stage.querySelectorAll(sel)].filter((c) => visible(c) && !c.parentElement.closest(sel));
  const leaves = [...stage.querySelectorAll("*")].filter((el) => visible(el) && ((el.childElementCount === 0 && el.textContent.trim()) || /^(IMG|SVG|INPUT|TEXTAREA|BUTTON|CANVAS)$/i.test(el.tagName)));
  const out = [];
  for (const c of controls) {
    const r = c.getBoundingClientRect();
    let best = null;
    for (const el of leaves) {
      if (c.contains(el) || el.contains(c)) continue;
      if (el.closest(sel)) continue; // a neighbouring control in the same toolbar (control → control) is not content
      const e = el.getBoundingClientRect();
      if (e.top < r.bottom - 1) continue;
      if (e.right <= r.left || e.left >= r.right) continue;
      if (!best || e.top < best.top) best = { top: e.top, text: (el.textContent || el.tagName).trim().slice(0, 40) };
    }
    if (best && best.top - r.bottom < ${min}) out.push({ control: (c.getAttribute("aria-label") || c.className || c.getAttribute("role") || "").toString().slice(0, 40), gap: Math.round((best.top - r.bottom) * 10) / 10, next: best.text });
  }
  return out;
})()`;
const report = [];
for (const [w, h] of [[1440, 1000], [390, 1200]]) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.enable");
  for (const slug of slugs) {
    await send("Page.navigate", { url: `${base}/#/${slug}` });
    await wait(1600);
    const hits = (await evaluate(PROBE(min))) ?? [];
    for (const x of hits) report.push({ width: w, slug, ...x });
  }
}
for (const r of report) console.log(`${r.width}	${r.slug}	${r.gap}px	${r.control}	→ ${r.next}`);
console.log(report.length ? `${report.length} control(s) with < ${min}px below.` : `All controls have ≥ ${min}px below.`);
if (report.length && process.argv.includes("--strict")) process.exitCode = 1;
ws.close();
proc.kill();
await wait(300);
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
