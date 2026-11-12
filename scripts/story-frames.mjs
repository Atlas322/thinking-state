// Frames of a catalog preview's story over time (2026-11-13: the motion
// standard is checked side by side with the original components, e.g.
// ThinkingState vs ScenarioChat). Motion is ON here (unlike the other checks).
//
//   npm run dev     (another terminal; or pass --url)
//   node scripts/story-frames.mjs --only thinking-state,scenario-chat [--frames 6] [--every 900] [--width 1440] [--theme light] [--out review/motion]
// Writes <out>/<slug>-<theme>-<n>.png (the preview stage only) and prints the
// region's step (data-ts-step) per frame, so a story that shows everything at
// once is visible at a glance.
import fs from "node:fs";
import path from "node:path";
import { arg, launch, setTheme, slugs, wait } from "./cdp.mjs";

const base = arg("url", "http://127.0.0.1:5173");
const frames = Number(arg("frames", "6"));
const every = Number(arg("every", "900"));
const width = Number(arg("width", "1440"));
const theme = arg("theme", "light");
const out = arg("out", "review/motion");
fs.mkdirSync(out, { recursive: true });

const cdp = await launch();
await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
await cdp.viewport(width, 1000);
await setTheme(cdp, base, theme);
for (const slug of slugs()) {
  await cdp.send("Page.navigate", { url: `${base}/#/${slug}` });
  await wait(1200);
  for (let i = 0; i < 20 && (await cdp.evaluate(`!!document.querySelector(".preview-loading")`)); i++) await wait(250);
  await cdp.evaluate(`document.querySelector(".preview-stage")?.scrollIntoView({ block: "start" }); 1`);
  await wait(150);
  const log = [];
  for (let n = 0; n < frames; n++) {
    const box = await cdp.evaluate(`(() => { const r = document.querySelector(".preview-stage").getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: Math.min(r.height, 900) }; })()`);
    const shot = await cdp.send("Page.captureScreenshot", { format: "png", clip: { ...box, scale: 1 } });
    fs.writeFileSync(path.join(out, `${slug}-${theme}-${n}.png`), Buffer.from(shot.result.data, "base64"));
    log.push(await cdp.evaluate(`[...document.querySelectorAll(".preview-stage [data-ts-step]")].map((e) => e.getAttribute("data-ts-step")).join(",") || "-"`));
    await wait(every);
  }
  console.log(`${slug.padEnd(22)} steps over ${frames} frames: ${log.join(" → ")}`);
}
await cdp.close();
