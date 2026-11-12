// render-post.mjs — explainer-carousel пост → слайд бүрийн PNG (static) + MP4 (хөдөлгөөнт).
// Хэрэглээ: node scripts/render-post.mjs <page.html> <slides> <outDir> [--sec 5] [--fps 30] [--w 1080] [--h 1350] [--prefix NN]
// Студи (npm run dev, 127.0.0.1:5182) ажиллаж байх ёстой. Детерминист: CSS animation-уудыг pause хийж
// кадр бүрт document.getAnimations()-ийн currentTime-ийг тавина (count-up нь @property тул мөн seek-лэгдэнэ).
// playwright-core: FMOS browse хэрэгслийнхийг ашиглана (шинэ суулгалтгүй). ffmpeg PATH-д байх ёстой.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const [page, count, outDir] = args;
if (!page || !count || !outDir) {
  console.error("usage: render-post.mjs <page.html> <slides> <outDir> [--sec 5] [--fps 30]");
  process.exit(1);
}
const SEC = +opt("sec", 5), FPS = +opt("fps", 30), W = +opt("w", 1080), H = +opt("h", 1350);
const BASE = opt("base", "http://127.0.0.1:5182");
const only = opt("only", "");

const req = createRequire(import.meta.url);
const pwPath = process.env.PLAYWRIGHT_CORE || "D:/CodeBase/founder-matrix-os/plugins/fm/tools/browse/node_modules/playwright-core";
const { chromium } = req(pwPath);
const E = process.env;
const exe = [
  path.join(E.ProgramFiles || "", "Google/Chrome/Application/chrome.exe"),
  path.join(E.LOCALAPPDATA || "", "Google/Chrome/Application/chrome.exe"),
  path.join(E["ProgramFiles(x86)"] || "", "Microsoft/Edge/Application/msedge.exe"),
].find((p) => fs.existsSync(p));

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const pg = await ctx.newPage();

for (let s = 1; s <= +count; s++) {
  if (only && !only.split(",").includes(String(s))) continue;
  const nn = String(s).padStart(2, "0");
  // static PNG
  await pg.goto(`${BASE}/${page}?s=${s}&static=1`);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(600);
  await pg.screenshot({ path: path.join(outDir, `${nn}.png`), clip: { x: 0, y: 0, width: W, height: H } });
  // motion frames
  const fdir = path.join(outDir, `_frames${nn}`);
  fs.rmSync(fdir, { recursive: true, force: true });
  fs.mkdirSync(fdir, { recursive: true });
  await pg.goto(`${BASE}/${page}?s=${s}`);
  await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(() => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = 0; }));
  await pg.waitForTimeout(300);
  const N = Math.round(SEC * FPS);
  for (let f = 0; f < N; f++) {
    const t = (f * 1000) / FPS;
    await pg.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), t);
    await pg.screenshot({ path: path.join(fdir, `${String(f).padStart(4, "0")}.png`), clip: { x: 0, y: 0, width: W, height: H } });
  }
  const mp4 = path.join(outDir, `${nn}.mp4`);
  const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(fdir, "%04d.png"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow", "-movflags", "+faststart", mp4], { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`ffmpeg failed slide ${s}`);
  fs.rmSync(fdir, { recursive: true, force: true });
  console.log("ok", nn, ".png .mp4");
}
await browser.close();
