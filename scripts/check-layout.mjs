// Layout bars for every catalog preview (2026-11-13), measured in headless Chrome
// with scripts/audit-layout.js at 1440 and 390 px wide:
//   --overflow    text in buttons / chips stays on one line and is not clipped,
//                 nothing sticks out of the preview, controls sharing a row are
//                 the same height, icons sit on the text's axis
//   --typography  button / chip text is never larger than its card's heading
// Known gaps live in scripts/layout-baseline.json; a new gap, or a known one
// growing by more than half (mid-animation counts wobble), fails (exit 1).
// --update-baseline rewrites it. --shots <dir> saves a PNG per slug × width × theme.
//
//   npm run dev     (another terminal; or pass --url)
//   node scripts/check-layout.mjs --overflow --typography [--skip a,b] [--url http://127.0.0.1:5173] [--only a,b] [--themes light,dark] [--shots dir] [--update-baseline]
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const base = arg("url", "http://127.0.0.1:5173");
const widths = arg("widths", "1440,390").split(",").map(Number);
const themes = arg("themes", "light").split(",");
const shots = arg("shots", "");
const only = arg("only", "");
const doOverflow = process.argv.includes("--overflow");
const doType = process.argv.includes("--typography");
const chrome =
  process.env.CHROME ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((p) => fs.existsSync(p));
if (!chrome) throw new Error("Chrome not found; set CHROME=/path/to/chrome");

const port = 9800 + Math.floor(Math.random() * 150);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ts-layout-"));
const proc = spawn(chrome, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--hide-scrollbars",
  "--force-prefers-reduced-motion",
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
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const n = ++id;
    pending.set(n, resolve);
    ws.send(JSON.stringify({ id: n, method, params }));
  });
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  return r.result?.result?.value;
};

const AUDIT = fs.readFileSync(new URL("./audit-layout.js", import.meta.url), "utf8");
const catalog = JSON.parse(fs.readFileSync(new URL("../src/catalog.json", import.meta.url), "utf8"));
// scenario-chat, agent-consent, company-* and site-* are reworked in the ts-v2 line; gate them once it lands.
const skip = new Set(arg("skip", "scenario-chat,agent-consent").split(","));
const slugs = catalog.map((e) => e.slug).filter((s) => (!only || only.split(",").includes(s)) && !skip.has(s));
const baselinePath = new URL("./layout-baseline.json", import.meta.url);
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, "utf8")) : {};
if (shots) fs.mkdirSync(shots, { recursive: true });

await send("Page.enable");
const found = {}; // key "slug@width" -> { kind: count }
for (const theme of themes) {
  await send("Page.navigate", { url: base });
  await wait(800);
  await evaluate(`localStorage.setItem("studio-theme", ${JSON.stringify(theme)})`);
  for (const width of widths) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
    for (const slug of slugs) {
      await send("Page.navigate", { url: `${base}/#/${slug}` });
      await wait(1400);
      await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}; document.querySelector(".preview-stage")?.scrollIntoView({ block: "start" })`);
      await wait(250);
      const r = (await evaluate(AUDIT)) ?? {};
      const key = `${slug}@${width}`;
      const counts = (found[key] ??= {});
      const kinds = [...(doOverflow ? ["wraps", "overflow", "rows", "align"] : []), ...(doType ? ["scale"] : [])];
      for (const k of kinds) if (r[k]?.length) counts[k] = Math.max(counts[k] ?? 0, r[k].length);
      if (process.argv.includes("--verbose")) for (const k of kinds) for (const v of r[k] ?? []) console.log(`${key} ${theme} ${k}: ${v}`);
      if (shots) {
        const shot = await send("Page.captureScreenshot", { format: "png" });
        if (shot.result?.data) fs.writeFileSync(path.join(shots, `${slug}-${width}-${theme}.png`), Buffer.from(shot.result.data, "base64"));
      }
    }
  }
}

const fails = [];
const next = {};
for (const [key, counts] of Object.entries(found)) {
  if (!Object.keys(counts).length) continue;
  next[key] = counts;
  for (const [k, n] of Object.entries(counts)) if (n > Math.ceil((baseline[key]?.[k] ?? 0) * 1.5)) fails.push(`${k.padEnd(8)} ${key}: ${n} (baseline ${baseline[key]?.[k] ?? 0})`);
}
const clean = Object.keys(found).length - Object.keys(next).length;
console.log(`layout: ${clean}/${Object.keys(found).length} slug×width clean; baseline gaps ${Object.keys(baseline).length}`);
for (const f of fails) console.log("NEW  " + f);
if (process.argv.includes("--update-baseline")) {
  const merged = only ? { ...baseline, ...Object.fromEntries(Object.keys(found).map((k) => [k, next[k]])) } : next;
  for (const k of Object.keys(merged)) if (!merged[k]) delete merged[k];
  fs.writeFileSync(baselinePath, JSON.stringify(Object.fromEntries(Object.entries(merged).sort()), null, 2) + "\n");
  console.log("baseline written");
} else if (fails.length) process.exitCode = 1;
ws.close();
proc.kill();
await wait(300);
try {
  fs.rmSync(profile, { recursive: true, force: true });
} catch {}
