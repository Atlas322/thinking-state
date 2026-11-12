import { describe, expect, it } from "vitest";
import pkg from "../package.json";

// Sources as text (no Node types in the app tsconfig): keyed "./company/x.tsx".
const sources = import.meta.glob<string>(["./**/*.ts", "./**/*.tsx", "!./**/*.test.*"], {
  query: "?raw",
  import: "default",
  eager: true,
});

const join = (dir: string, rel: string) => {
  const parts = dir.split("/");
  for (const seg of rel.split("/")) {
    if (seg === "..") parts.pop();
    else if (seg !== ".") parts.push(seg);
  }
  return parts.join("/");
};

/** Every module reachable from a package entry, following relative imports. */
function reachable(entry: string, seen = new Set<string>()) {
  const file = [entry, `${entry}.ts`, `${entry}.tsx`].find((f) => f in sources);
  if (!file || seen.has(file)) return seen;
  seen.add(file);
  const dir = file.slice(0, file.lastIndexOf("/"));
  for (const m of sources[file].matchAll(/(?:from|import\()\s*["'](\.{1,2}\/[^"']+)["']/g)) reachable(join(dir, m[1]), seen);
  return seen;
}

describe("@inai/thinking-state package", () => {
  it("is named and exported for git installs", () => {
    expect(pkg.name).toBe("@inai/thinking-state");
    expect(Object.keys(pkg.exports)).toEqual([".", "./chat", "./tokens.css", "./site.css", "./package.json"]);
    expect(pkg.files).toContain("lib");
    expect(pkg.peerDependencies.react).toMatch(/\^19/);
    expect((pkg.dependencies as Record<string, string>).react).toBeUndefined();
    expect((pkg.scripts as Record<string, string>).prepare).toBeUndefined(); // tags carry lib/, nothing builds on install
  });

  it("never reaches fixtures from a package entry", () => {
    const files = [...reachable("./lib/index"), ...reachable("./lib/chat")];
    expect(files.length).toBeGreaterThan(10);
    expect(files.filter((f) => /fixtures|company-preview|catalog|registry/.test(f))).toEqual([]);
  });

  it("themes every company and chat widget style through --ts tokens", () => {
    for (const f of ["./company/company-view.tsx", "./library/project-report.tsx", "./library/pr-deploy-status.tsx", "./library/decision-inbox-chat.tsx", "./library/session-board.tsx"]) {
      expect(sources[f], f).toContain("var(--ts-surface,");
      expect(sources[f], f).toContain("var(--ts-font,");
    }
    // tokens.css itself is checked by scripts/build-lib.mjs (Vitest returns CSS imports empty).
  });

  it("ships cream (Чиглэл 1) and dark (Чиглэл 2, TH.Dark) with a view / manage accent", async () => {
    const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
    const css = fs.readFileSync("src/lib/tokens.css", "utf8");
    for (const need of ['[data-ts-theme="cream"]', '[data-ts-theme="dark"]', '[data-ts-theme="manage"]', '[data-ts-mode="manage"]', '[data-ts-mode="view"]'])
      expect(css).toContain(need);
    for (const v of ["--ts-page: #0b0b0c;", "--ts-surface: #17171a;", "--ts-line: #26262a;", "--ts-electric: #4d7fff;", "--ts-electric-soft: #16224a;", "--ts-fg: #edebe6;"])
      expect(css).toContain(v);
    expect(css).not.toContain("Spectral"); // one heading font on both themes (itge.e 11-12)
    expect(css).toContain('--ts-font-head: "Inter"');
    expect(css.match(/--ts-font-display: var\(--ts-font-head\);/g)).toHaveLength(2);
    for (const c of ["#f5a524", "#0c8ce9", "#22c55e", "#a855f7"]) expect(css.match(new RegExp(`--ts-cat-\\d: ${c};`, "g"))).toHaveLength(2); // vivid on both
    expect(css).not.toMatch(/Alegreya|Onest|#17130f/i); // Theme А withdrawn
  });
});
