// Frame-rate check for the motion foundation (Thinking State v2, step 1).
// Opens the catalog's «Хөдөлгөөн · Суурь» stress test (96 loops) in headless
// Chrome at 390×844 @3x, optionally with CPU throttling, and reports
// requestAnimationFrame timing plus long animation frames.
//
//   npm run dev            (another terminal; or pass --url)
//   node scripts/measure-motion.mjs [--url http://127.0.0.1:5173] [--cpu 4] [--seconds 6] [--width 390] [--gpu]
//
// Needs Chrome or Edge installed (CHROME=path to override). No npm packages.
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

await send("Emulation.setDeviceMetricsOverride", { width, height: 844, deviceScaleFactor: width < 768 ? 3 : 1, mobile: width < 768 });
await send("Emulation.setCPUThrottlingRate", { rate: cpu });
await send("Page.enable");
await send("Page.navigate", { url: `${base}/#/motion-foundation` });
await wait(4000);

const METER = (ms) => `new Promise((done) => {
  const deltas = []; const loaf = [];
  let po; try { po = new PerformanceObserver((l) => loaf.push(...l.getEntries().map((e) => Math.round(e.duration)))); po.observe({ type: "long-animation-frame" }); } catch {}
  let last = performance.now(); const end = last + ${ms};
  const tick = (now) => { deltas.push(now - last); last = now; if (now < end) requestAnimationFrame(tick); else { po?.disconnect();
    deltas.shift(); const total = deltas.reduce((a, b) => a + b, 0); const sorted = [...deltas].sort((a, b) => a - b);
    done({ fps: +(deltas.length / total * 1000).toFixed(1), p95: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1), worst: +sorted.at(-1).toFixed(1), over25ms: deltas.filter((d) => d > 25).length, frames: deltas.length, longFrames: loaf.length,
      running: document.getAnimations().filter((a) => a.playState === "running").length }); } };
  requestAnimationFrame(tick);
})`;
/**
 * Compositor frames from a Chrome trace — what the screen actually showed,
 * without a rAF loop waking the main thread. Counts presented frames and
 * frames Chrome itself marks as dropped.
 */
async function traceFrames(ms) {
  traceEvents.length = 0;
  await send("Tracing.start", {
    traceConfig: { includedCategories: ["disabled-by-default-devtools.timeline.frame", "devtools.timeline", "benchmark", "cc"] },
    transferMode: "ReportEvents",
  });
  await wait(ms);
  const done = new Promise((r) => (traceDone = r));
  await send("Tracing.end");
  await done;
  const named = (n) => traceEvents.filter((e) => e.name === n);
  const draws = named("DrawFrame").map((e) => e.ts / 1000).sort((a, b) => a - b);
  const gaps = draws.slice(1).map((t, i) => t - draws[i]);
  const sorted = [...gaps].sort((a, b) => a - b);
  const span = draws.length > 1 ? draws.at(-1) - draws[0] : 0;
  const pipeline = named("PipelineReporter").filter((e) => e.ph === "b" || e.ph === "B");
  const state = (e) => e.args?.chrome_frame_reporter?.state;
  return {
    drawnFps: span ? +((gaps.length / span) * 1000).toFixed(1) : 0,
    p95GapMs: sorted.length ? +sorted[Math.floor(sorted.length * 0.95)].toFixed(1) : 0,
    worstGapMs: sorted.length ? +sorted.at(-1).toFixed(1) : 0,
    gapsOver25ms: gaps.filter((g) => g > 25).length,
    drawn: draws.length,
    droppedFrames: named("DroppedFrame").length + pipeline.filter((e) => /DROPPED/.test(state(e) ?? "")).length,
    presented: pipeline.filter((e) => /PRESENTED_ALL|PRESENTED_PARTIAL/.test(state(e) ?? "")).length,
  };
}

const click = (text) =>
  evaluate(`(() => { const b = [...document.querySelectorAll(".mf-btn")].find((b) => b.textContent.includes(${JSON.stringify(text)})); b?.click(); return !!b; })()`);

const inject = arg("inject", "");
if (inject) await evaluate(`(() => { const s = document.createElement("style"); s.textContent = ${JSON.stringify(inject)}; document.head.append(s); })()`);
await click("Стресс");
await wait(500);
await evaluate(`document.querySelector(".mf-stress")?.scrollIntoView({ block: "center" })`);
await wait(1500);
const results = {};
await click("Бүх"); // page-wide pause → baseline
await wait(800);
results.paused = await evaluate(METER(seconds * 1000));
results.pausedTrace = await traceFrames(seconds * 1000);
await click("Бүх"); // resume
await wait(800);
results.running = await evaluate(METER(seconds * 1000));
await wait(300);
results.runningTrace = await traceFrames(seconds * 1000);
await evaluate(`document.querySelector(".mf-curves")?.scrollIntoView({ block: "start" })`);
await wait(800);
results.gpu = await evaluate(`(() => { const c = document.createElement("canvas").getContext("webgl"); const d = c?.getExtension("WEBGL_debug_renderer_info"); return d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : "none"; })()`);
results.scrolledAway = await evaluate(`[...document.querySelectorAll("[data-ts-loop]")].map((e) => e.dataset.tsLoop).join(",")`);

console.log(JSON.stringify({ width, cpuThrottle: cpu, seconds, ...results }, null, 2));
ws.close();
proc.kill();
await wait(300);
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
