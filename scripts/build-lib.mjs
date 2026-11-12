import { createHash } from "node:crypto";
// Builds the @inai/thinking-state package into lib/:
//   1. vite library build (ESM, React external) → lib/index.js, lib/chat.js
//   2. TypeScript declarations → lib/types
//   3. tokens.css, site.css → lib/ (site.css is generated: npm run tokens:site)
//   4. guard: no fixtures or vault data may end up in the package
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd) => execSync(cmd, { cwd: root, stdio: "inherit" });

run("npx vite build -c vite.lib.config.ts --logLevel warn");
run("npx tsc -p tsconfig.lib.json");
fs.copyFileSync(path.join(root, "src/lib/tokens.css"), path.join(root, "lib/tokens.css"));
fs.copyFileSync(path.join(root, "src/lib/site.css"), path.join(root, "lib/site.css"));
fs.copyFileSync(path.join(root, "src/lib/ts.css"), path.join(root, "lib/ts.css"));
const tokens = fs.readFileSync(path.join(root, "lib/tokens.css"), "utf8");
for (const need of ['[data-ts-theme="cream"]', '[data-ts-theme="dark"]', '[data-ts-theme="manage"]', '--ts-status-needs-you-fg', "--ts-surface", '"Inter"', '--ts-font-head', '--ts-selected'])
  if (!tokens.includes(need)) {
    console.error(`tokens.css is missing ${need}`);
    process.exit(1);
  }

// Guard: fixture and vault data never ship. Real names are checked by hash
// (src/real-names.json), so this file names no one.
const banned = [
  "02-Projects/", "03-Areas/", "04-Resources/", "01-GTD/",
  "PMBOK төсөл", "studioCollections", "companyFixtures",
];
const realNames = new Set(JSON.parse(fs.readFileSync(path.join(root, "src/real-names.json"), "utf8")).hashes);
const nameHash = (w) => createHash("sha256").update(w).digest("hex").slice(0, 16);
const hits = [];
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(js|css|d\.ts|map)$/.test(name)) {
      const text = fs.readFileSync(p, "utf8");
      for (const b of banned) if (text.includes(b)) hits.push(`${path.relative(root, p)}: ${b}`);
      for (const w of new Set(text.toLowerCase().normalize("NFC").match(/[\p{L}\p{N}]+/gu) ?? []))
        if (realNames.has(nameHash(w))) hits.push(`${path.relative(root, p)}: a listed real name`);
    }
  }
};
walk(path.join(root, "lib"));
if (hits.length) {
  console.error("Package guard failed — fixture or vault data in lib/:\n" + hits.join("\n"));
  process.exit(1);
}
const size = (f) => (fs.statSync(path.join(root, "lib", f)).size / 1024).toFixed(1);
console.log(`lib/ ready: index.js ${size("index.js")} KB, chat.js ${size("chat.js")} KB, studio.js ${size("studio.js")} KB, tokens.css ${size("tokens.css")} KB; guard clean.`);
