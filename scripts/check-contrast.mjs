// Contrast for every catalog preview, both themes (itge.e 2026-11-12):
// text 4.5:1 (large text 3:1), icon glyphs 3:1, against the composited
// background under them. Gradients and images are skipped (not measurable).
//
//   npm run dev     (another terminal; or pass --url)
//   node scripts/check-contrast.mjs [--url http://127.0.0.1:5173] [--only a,b] [--width 1440] [--shell]
// --shell also scans the catalog chrome (sidebar, header) once per theme.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const base = arg("url", "http://127.0.0.1:5173");
const width = Number(arg("width", "1440"));
const only = arg("only", "");
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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ts-contrast-"));
const proc = spawn(chrome, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "about:blank"]);
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
  if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
  return r.result?.result?.value;
};

const SCAN = (selector) => `(() => {
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const rgba = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = (a) => { const c = a.slice(0, 3).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const mix = (top, bot) => [0, 1, 2].map((i) => top[i] * top[3] + bot[i] * (1 - top[3])).concat(1);
  const bgOf = (el) => {
    const stack = [];
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage && s.backgroundImage !== "none") return null;
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) { stack.push(c); if (c[3] >= 0.99) break; }
    }
    let b = rgba(getComputedStyle(document.body).backgroundColor);
    if (b[3] < 1) b = [255, 255, 255, 1];
    for (let i = stack.length - 1; i >= 0; i--) b = mix(stack[i], b);
    return b;
  };
  const opacityOf = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
  const hex = (a) => "#" + a.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const ratio = (fg, bg) => { const x = lum(fg), y = lum(bg); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const root = document.querySelector(${JSON.stringify(selector)});
  if (!root) return [];
  const out = new Set();
  for (const el of root.querySelectorAll("*")) {
    if (el.closest("[aria-hidden=true]:not(svg)") && el.tagName !== "svg") continue;
    const isSvg = el.tagName === "svg";
    const text = isSvg ? "" : [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(" ");
    if (!isSvg && !text) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none") continue;
    if (isSvg) {
      // only glyphs painted with currentColor carry the element colour
      const painted = [...el.querySelectorAll("path,circle,rect,line,polyline,polygon")].some((p) => { const ps = getComputedStyle(p); return ps.stroke === s.color || ps.fill === s.color; });
      if (!painted) continue;
    }
    const op = opacityOf(el);
    if (op < 0.35) continue; // deliberately faded (disabled, ghost): not measured
    const bg = bgOf(el);
    if (!bg) continue;
    let fg = rgba(s.color);
    if (fg[3] < 1) fg = mix(fg, bg);
    if (op < 0.99) fg = mix([...fg.slice(0, 3), op], bg);
    const size = parseFloat(s.fontSize), weight = +s.fontWeight;
    const need = isSvg ? 3 : size >= 24 || (weight >= 700 && size >= 18.66) ? 3 : 4.5;
    const got = ratio(fg, bg);
    if (got < need - 0.005) out.add(got.toFixed(2) + " " + hex(fg) + "/" + hex(bg) + " " + (isSvg ? "glyph" : "text") + " " + el.tagName.toLowerCase() + "." + String(el.className.baseVal ?? el.className).split(" ")[0] + (text ? " «" + text.slice(0, 32) + "»" : ""));
  }
  return [...out];
})()`;

const catalog = JSON.parse(fs.readFileSync(new URL("../src/catalog.json", import.meta.url), "utf8"));
const slugs = catalog.map((e) => e.slug).filter((s) => !only || only.split(",").includes(s));
await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.enable");
let total = 0;
for (const theme of ["light", "dark"]) {
  await send("Page.navigate", { url: `${base}/` });
  await wait(800);
  await evaluate(`localStorage.setItem("studio-theme", ${JSON.stringify(JSON.stringify(theme))}); localStorage.setItem("studio-theme-raw", ${JSON.stringify(theme)}); 1`);
  for (const slug of slugs) {
    await send("Page.navigate", { url: `${base}/#/${slug}` });
    await wait(1200);
    for (let i = 0; i < 20 && (await evaluate(`!!document.querySelector(".preview-loading")`)); i++) await wait(250);
    const applied = await evaluate(`document.documentElement.dataset.theme`);
    if (applied !== theme) await evaluate(`document.querySelector('[aria-label^="Switch to ${theme}"]')?.click(); 1`), await wait(300);
    await wait(2500); // let scenarios reach a resting state
    const hits = (await evaluate(SCAN(".preview-stage"))) ?? [];
    if (process.argv.includes("--shell") && slug === slugs[0]) hits.push(...((await evaluate(SCAN("body"))) ?? []).map((h) => "shell " + h));
    if (hits.length) {
      total += hits.length;
      console.log(`${theme.padEnd(5)} ${slug}`);
      for (const h of hits) console.log("      " + h);
    }
  }
}
console.log(`contrast: ${total} below the bar`);
if (total) process.exitCode = 1;
ws.close();
proc.kill();
await wait(300);
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
