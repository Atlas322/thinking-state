// Quality bars for every catalog preview (itge.e 2026-11-12):
//   --motion  the component plays a scenario by itself (the DOM changes with
//             no input within the window) — the original 90's standard; also
//             counts running animations
//   --icons   category-like elements (tabs, radios, toggles, chips, pills,
//             tags, badges, filters) carry an icon
// Known gaps live in scripts/quality-baseline.json; anything new fails
// (exit 1). --update-baseline rewrites it.
//
//   npm run dev     (another terminal; or pass --url)
//   node scripts/check-quality.mjs --motion --icons [--url http://127.0.0.1:5173] [--only a,b] [--update-baseline]
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

const doMotion = process.argv.includes("--motion");
const doIcons = process.argv.includes("--icons");
const only = arg("only", "");
const windowMs = Number(arg("window", "6500"));
const catalog = JSON.parse(fs.readFileSync(new URL("../src/catalog.json", import.meta.url), "utf8"));
const slugs = catalog.map((e) => e.slug).filter((s) => !only || only.split(",").includes(s));
const baselinePath = new URL("./quality-baseline.json", import.meta.url);
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, "utf8")) : { motion: [], icons: {} };

const PROBE = (ms) => `new Promise((done) => {
  const stage = document.querySelector(".preview-stage .ts-replay-body") || document.querySelector(".preview-stage") || document.body;
  let mutations = 0;
  const mo = new MutationObserver((list) => { for (const m of list) if (!(m.target.closest && m.target.closest("style"))) mutations++; });
  mo.observe(stage, { subtree: true, childList: true, attributes: true, characterData: true });
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  // category-like: tabs, radios, toggles, and elements whose class token is a chip / pill / tag / badge (not their containers: "chips", "tags")
  const hasIcon = (el) => !!el.querySelector('svg, img, [class*="icon"], [class*="glyph"]') || /\\p{Extended_Pictographic}/u.test(el.textContent || "");
  const isCat = (el) => el.matches('[role="tab"], [role="radio"], button[aria-pressed]') || [...el.classList].some((c) => /(^|[-_])(chip|pill|tag|badge)$/.test(c));
  const all = [...stage.querySelectorAll("*")].filter((el) => el instanceof HTMLElement && !(el instanceof HTMLInputElement) && isCat(el));
  const cats = all.filter((el) => visible(el) && (el.textContent || "").trim().length > 1 && !all.some((o) => o !== el && el.contains(o))); // innermost
  const noIcon = cats.filter((el) => !hasIcon(el)).map((el) => (el.textContent || "").trim().slice(0, 24));
  setTimeout(() => {
    mo.disconnect();
    const anims = document.getAnimations().filter((a) => a.effect && a.effect.target && stage.contains(a.effect.target) && a.playState === "running").length;
    // a ScenarioRegion resting between cycles is still a scenario
    done({ mutations, anims, scenarioRegion: !!stage.querySelector("[data-ts-step]"), categories: cats.length, noIcon });
  }, ${ms});
})`;

const results = [];
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send("Page.enable");
for (const slug of slugs) {
  await send("Page.navigate", { url: `${base}/#/${slug}` });
  await wait(1500);
  await evaluate(`document.querySelector(".preview-stage")?.scrollIntoView({ block: "start" })`);
  const r = (await evaluate(PROBE(windowMs))) ?? { mutations: 0, anims: 0, categories: 0, noIcon: [] };
  if (process.argv.includes("--verbose")) console.log(slug, JSON.stringify(r));
  results.push({ slug, ...r });
}

const fails = [];
const newBaseline = { motion: [], icons: {} };
for (const r of results) {
  const scenario = r.mutations > 0 || r.scenarioRegion;
  if (doMotion && !scenario) {
    newBaseline.motion.push(r.slug);
    if (!baseline.motion.includes(r.slug)) fails.push(`motion  ${r.slug}: no scenario (DOM idle for ${windowMs} ms, ${r.anims} animations)`);
  }
  if (doIcons && r.noIcon.length) {
    newBaseline.icons[r.slug] = r.noIcon.length;
    if (r.noIcon.length > (baseline.icons[r.slug] ?? 0)) fails.push(`icons   ${r.slug}: ${r.noIcon.length} without icon (${r.noIcon.slice(0, 4).join(" · ")})`);
  }
}
const pass = (k) => results.filter((r) => (k === "m" ? r.mutations > 0 || r.scenarioRegion : !r.noIcon.length)).length;
if (doMotion) console.log(`motion: ${pass("m")}/${results.length} play a scenario; baseline gaps ${baseline.motion.length}`);
if (doIcons) console.log(`icons:  ${pass("i")}/${results.length} have icons on every category element; baseline gaps ${Object.keys(baseline.icons).length}`);
for (const f of fails) console.log("NEW  " + f);
if (process.argv.includes("--update-baseline")) {
  const merged = { motion: doMotion ? newBaseline.motion : baseline.motion, icons: doIcons ? newBaseline.icons : baseline.icons };
  fs.writeFileSync(baselinePath, JSON.stringify(merged, null, 2) + "\n");
  console.log("baseline written");
} else if (fails.length) process.exitCode = 1;
ws.close();
proc.kill();
await wait(300);
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
