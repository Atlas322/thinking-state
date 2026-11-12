// Render a Thinking State chat widget from JSON to one-file HTML.
//
//   npm run chat:html -- <slug> [props.json|-] [--out file.html] [--fragment] [--theme auto|light|dark]
//
// Without a props file the widget's demo data is used; "-" reads JSON from stdin.
// --fragment drops doctype/html/head/body for hosts that inject markup.
// Slugs: project-report, pr-deploy-status, decision-inbox-chat, session-board.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const out = flag("--out");
const theme = flag("--theme") ?? "auto";
const fragment = args.includes("--fragment");
const rest = args.filter((a) => a !== "--fragment");
const [slug, propsPath] = rest;
if (!slug) {
  console.error("Usage: npm run chat:html -- <slug> [props.json|-] [--out file.html] [--fragment] [--theme auto|light|dark]");
  process.exit(2);
}
const readProps = () => {
  if (!propsPath) return undefined;
  const text = propsPath === "-" ? fs.readFileSync(0, "utf8") : fs.readFileSync(path.resolve(propsPath), "utf8");
  return JSON.parse(text);
};

const server = await createServer({
  root,
  logLevel: "error",
  configFile: path.join(root, "vite.config.ts"),
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const { renderChatHtml } = await server.ssrLoadModule("/src/chat/export.tsx");
  const html = await renderChatHtml(slug, readProps(), { fragment, theme });
  if (out) {
    fs.writeFileSync(path.resolve(out), html);
    console.error(`${path.resolve(out)} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
  } else process.stdout.write(html);
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
} finally {
  await server.close();
}
