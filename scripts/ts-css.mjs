// Writes src/lib/ts.css — the one stylesheet a site imports
// (@inai/thinking-state/ts.css): site.css (tokens on :root + stable aliases)
// + the primitives (src/ui/primitives.tsx) + the motion loops (src/motion).
// Bundles those modules with esbuild in memory, so it runs on plain Node.
// src/ts-css.test.ts checks the file is fresh.
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = await build({
  stdin: {
    contents: 'export { PRIMITIVES_CSS } from "./src/ui/primitives-css"; export { motionCss } from "./src/motion/loops";',
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "esm",
  write: false,
  platform: "node",
  logLevel: "error",
});
const mod = await import("data:text/javascript;base64," + Buffer.from(out.outputFiles[0].text).toString("base64"));
const site = fs.readFileSync(path.join(root, "src/lib/site.css"), "utf8").replace(/\r\n/g, "\n");
fs.writeFileSync(path.join(root, "src/lib/ts.css"), tsCss(site, mod.PRIMITIVES_CSS, mod.motionCss()));
console.log("src/lib/ts.css written");

export function tsCss(site, primitives, motion) {
  return `/* @inai/thinking-state/ts.css — GENERATED (npm run tokens:site). Tokens + primitives + motion. */\n${site}\n/* ── primitives (src/ui) ── */\n${primitives.trim()}\n\n/* ── motion (src/motion) ── */\n${motion.trim()}\n`;
}
