// Writes src/lib/site.css from src/lib/tokens.css (see src/lib/site-css.ts).
// Node ≥ 22.18 / 23.6 strips the TypeScript types on its own.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteCss } from "../src/lib/site-css.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokens = fs.readFileSync(path.join(root, "src/lib/tokens.css"), "utf8");
fs.writeFileSync(path.join(root, "src/lib/site.css"), siteCss(tokens));
console.log("src/lib/site.css written");
