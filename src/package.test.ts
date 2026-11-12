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

  it("ships Theme А: cream / night surfaces, view / manage accent, Alegreya · Onest · JetBrains Mono", async () => {
    const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
    const css = fs.readFileSync("src/lib/tokens.css", "utf8");
    for (const need of ['[data-ts-theme="cream"]', '[data-ts-theme="night"]', '[data-ts-theme="manage"]', '[data-ts-mode="manage"]', '[data-ts-mode="view"]'])
      expect(css).toContain(need);
    expect(css).toContain("--ts-surface: #231d17;"); // warm night surface-1
    expect(css).toContain("--ts-electric: #1b5cff;");
    expect(css).toContain("--ts-indigo: #6e80d0;");
    expect(css).toMatch(/"Alegreya"[\s\S]*"Onest"|"Onest"[\s\S]*"Alegreya"/);
    expect(css).not.toContain("Spectral");
  });
});
