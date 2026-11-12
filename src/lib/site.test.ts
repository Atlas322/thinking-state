import { describe, expect, it } from "vitest";
import { SITE_ALIASES, siteCss } from "./site-css";

// Vitest blanks CSS imports, so read the files (no Node types in the app tsconfig).
const read = async (p: string) => {
  const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
  return fs.readFileSync(p, "utf8");
};

describe("site.css", () => {
  it("is generated from tokens.css (run `npm run tokens:site` after editing tokens)", async () => {
    const tokens = await read("src/lib/tokens.css");
    expect((await read("src/lib/site.css")).replace(/\r\n/g, "\n")).toBe(siteCss(tokens.replace(/\r\n/g, "\n")));
  });

  it("themes the whole page without a wrapper and exposes stable aliases", async () => {
    const css = await read("src/lib/site.css");
    expect(css).toContain(':where(:root, .ts-theme-cream, [data-ts-theme="cream"])');
    expect(css).toContain(':root[data-theme="dark"]');
    for (const [alias, token] of Object.entries(SITE_ALIASES)) {
      expect(css).toContain(`${alias}: var(${token});`);
      expect(css, token).toContain(`${token}:`); // every alias points at a real token
    }
    expect(css).toContain("--ts-font-heading: var(--ts-font-display);");
  });
});
