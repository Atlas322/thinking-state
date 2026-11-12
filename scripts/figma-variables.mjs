// Exports the Thinking State tokens for Figma Variables and the component list
// for the design session (TENET: the Thinking State library is the source).
//   tokens/figma-variables.json — one collection, modes cream / dark:
//     color/* (semantic colours), space/*, gap/*, radius/*, font/*, type/*
//   tokens/figma-catalog.json   — every catalog component: slug, name,
//     category, export, variants (clean / classic), module
// Generated from src/lib/tokens.css and src/catalog.json (npm run tokens:figma);
// src/figma-variables.test.ts checks both are fresh.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function blocks(css) {
  css = css.replace(/\r\n/g, "\n").replace(/\/\*[\s\S]*?\*\//g, "");
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selector = m[1].trim();
    const vars = {};
    for (const d of m[2].matchAll(/(--ts-[a-z0-9-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
    if (Object.keys(vars).length) out.push({ selector, vars });
  }
  return out;
}

export function figmaVariables(css) {
  const all = blocks(css);
  const cream = Object.assign({}, ...all.filter((b) => b.selector.includes('[data-ts-theme="cream"]')).map((b) => b.vars));
  const dark = Object.assign({}, ...all.filter((b) => b.selector.includes('[data-ts-theme="dark"]')).map((b) => b.vars));
  // theme-independent blocks (:root), excluding @supports / media overrides and motion
  const shared = Object.assign(
    {},
    ...all.filter((b) => /^:where\(:root(, \[data-ts-theme\])?\)$/.test(b.selector)).map((b) => b.vars),
  );
  const resolve = (v, scope, depth = 0) =>
    depth > 6 ? v : v.replace(/var\((--ts-[a-z0-9-]+)(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_, name, fb) => {
      const hit = scope[name] ?? shared[name];
      return hit != null ? resolve(hit, scope, depth + 1) : (fb ?? _);
    });
  // color-mix(in srgb, #a p%, #b) → hex, so Figma gets a colour
  const hex = (h) => (h.length === 4 ? [1, 2, 3].map((i) => parseInt(h[i] + h[i], 16)) : [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
  const mix = (v) =>
    v.replace(/color-mix\(in srgb,\s*(#[0-9a-f]{3,6})\s+(\d+(?:\.\d+)?)%,\s*(#[0-9a-f]{3,6})\)/gi, (_, a, p, b) => {
      const [x, y, w] = [hex(a), hex(b), Number(p) / 100];
      return "#" + x.map((c, i) => Math.round(c * w + y[i] * (1 - w)).toString(16).padStart(2, "0")).join("");
    });
  const type = (v) => (/^#[0-9a-f]{3,8}$/i.test(v) ? "COLOR" : /^-?\d+(\.\d+)?px$|^0$/.test(v) ? "FLOAT" : /^-?\d+(\.\d+)?$/.test(v) ? "FLOAT" : "STRING");
  const num = (v) => (v === "0" ? 0 : parseFloat(v));
  const group = (name) => {
    const n = name.replace(/^--ts-/, "");
    if (/^(space|gap)-/.test(n)) return `space/${n}`;
    if (/^radius-/.test(n)) return `radius/${n.replace(/^radius-/, "")}`;
    if (/^font/.test(n)) return `font/${n.replace(/^font-?/, "") || "text"}`;
    if (/^(type|head)-/.test(n)) return `type/${n}`;
    if (/^motion-/.test(n)) return null;
    return `color/${n}`;
  };
  const names = [...new Set([...Object.keys(cream), ...Object.keys(dark), ...Object.keys(shared)])].sort();
  const variables = [];
  for (const name of names) {
    const g = group(name);
    if (!g) continue;
    const vc = mix(resolve(cream[name] ?? shared[name] ?? "", cream));
    const vd = mix(resolve(dark[name] ?? shared[name] ?? cream[name] ?? "", dark));
    if (!vc && !vd) continue;
    const t = type(vc || vd) === type(vd || vc) ? type(vc || vd) : "STRING";
    const val = (v) => (t === "FLOAT" ? num(v) : v);
    variables.push({ name: g, token: name, type: t, values: { cream: val(vc), dark: val(vd) } });
  }
  return {
    $meta: {
      source: "src/lib/tokens.css (npm run tokens:figma)",
      collection: "Thinking State",
      modes: ["cream", "dark"],
      note: "COLOR = hex; FLOAT = px; STRING = CSS values Figma has no type for (color-mix, shadows, font stacks). Shared (:root) tokens repeat the same value in both modes.",
    },
    variables,
  };
}

export function figmaCatalog(catalog) {
  return {
    $meta: { source: "src/catalog.json (npm run tokens:figma)", count: catalog.length },
    components: catalog.map((e) => ({
      slug: e.slug,
      name: e.name,
      category: e.category,
      export: e.exportName,
      variants: !e.pro || e.slug === "thinking-state" ? ["clean", "classic"] : ["clean"],
      module: e.module ?? null,
      origin: e.origin ?? (e.pro ? "affectUI recreation" : "affectUI (MIT)"),
    })),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const css = fs.readFileSync(path.join(root, "src/lib/tokens.css"), "utf8");
  const catalog = JSON.parse(fs.readFileSync(path.join(root, "src/catalog.json"), "utf8"));
  fs.writeFileSync(path.join(root, "tokens/figma-variables.json"), JSON.stringify(figmaVariables(css), null, 2) + "\n");
  fs.writeFileSync(path.join(root, "tokens/figma-catalog.json"), JSON.stringify(figmaCatalog(catalog), null, 2) + "\n");
  console.log("tokens/figma-variables.json, tokens/figma-catalog.json written");
}
