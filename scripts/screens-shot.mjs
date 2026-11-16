// Still screenshots of the Second Brain app screens (screens.html), every screen × theme × variant.
// usage: PLAYWRIGHT_CORE=<path> node scripts/screens-shot.mjs <outDir> [--base http://127.0.0.1:5391] [--only chat,inbox]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const outDir = args[0];
if (!outDir) { console.error("usage: screens-shot.mjs <outDir> [--base URL] [--only a,b]"); process.exit(1); }
const BASE = opt("base", "http://127.0.0.1:5391");
const only = opt("only", "inbox,note,project,chat,memory,team").split(",");
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_CORE || "playwright-core");
const E = process.env;
const exe = [
  path.join(E.ProgramFiles || "", "Google/Chrome/Application/chrome.exe"),
  path.join(E.LOCALAPPDATA || "", "Google/Chrome/Application/chrome.exe"),
  path.join(E["ProgramFiles(x86)"] || "", "Microsoft/Edge/Application/msedge.exe"),
].find((p) => fs.existsSync(p));
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await browser.newPage({ viewport: { width: 1352, height: 872 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
for (const s of only) for (const theme of ["day", "night"]) for (const v of ["tabs", "sidebar"]) {
  await page.goto(`${BASE}/screens.html?s=${s}&theme=${theme}&v=${v}&still=1`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);
  const f = path.join(outDir, `${s}-${theme}-${v === "tabs" ? "A" : "B"}.png`);
  await page.screenshot({ path: f });
  console.log(f);
}
await browser.close();
