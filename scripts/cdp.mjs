// Headless Chrome over the DevTools protocol, shared by the catalog checks
// (check-contrast.mjs, check-overflow.mjs). No dependencies.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : fallback;
};
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch() {
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
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ts-check-"));
  const proc = spawn(chrome, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "about:blank"]);
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
  const viewport = (width, height = 1000) =>
    send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await send("Page.enable");
  const close = async () => {
    ws.close();
    proc.kill();
    await wait(300);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  };
  return { send, evaluate, viewport, close };
}

/** Catalog slugs, optionally filtered by --only a,b */
export function slugs() {
  const only = arg("only", "");
  const catalog = JSON.parse(fs.readFileSync(new URL("../src/catalog.json", import.meta.url), "utf8"));
  return catalog.map((e) => e.slug).filter((s) => !only || only.split(",").includes(s));
}

/** Stores the theme the catalog reads on load. */
export async function setTheme({ send, evaluate }, base, theme) {
  await send("Page.navigate", { url: `${base}/` });
  await wait(800);
  await evaluate(`localStorage.setItem("studio-theme", ${JSON.stringify(JSON.stringify(theme))}); localStorage.setItem("studio-theme-raw", ${JSON.stringify(theme)}); 1`);
}

/** Opens a catalog entry and waits until its scenario has settled. */
export async function openSlug({ send, evaluate }, base, slug, theme) {
  await send("Page.navigate", { url: `${base}/#/${slug}` });
  await wait(1200);
  for (let i = 0; i < 20 && (await evaluate(`!!document.querySelector(".preview-loading")`)); i++) await wait(250);
  const applied = await evaluate(`document.documentElement.dataset.theme`);
  if (applied !== theme) await evaluate(`document.querySelector('[aria-label^="Switch to ${theme}"]')?.click(); 1`), await wait(300);
  await wait(2500); // let scenarios reach a resting state
}
