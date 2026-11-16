import { beforeAll, describe, expect, it } from "vitest";
// node:fs by dynamic import, as the other file-reading tests: the build's tsc has no Node types.
const nodeFs = async () => (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
let read: (p: string) => string = () => "";
beforeAll(async () => { const fs = await nodeFs(); read = (p) => fs.readFileSync(p, "utf8"); }); // vitest runs from the repo root


describe("report.css", () => {
  let css = "";
  beforeAll(() => { css = read("src/lib/report.css"); });
  it("imports tokens.css and adds no colours of its own outside print", () => {
    expect(css).toMatch(/@import url\("\.\/tokens\.css"\)/);
    const screen = css.split("@media print")[0];
    expect(screen.match(/#[0-9a-f]{3,6}\b/gi) ?? []).toEqual(["#fff"]); // on-electric fallback only
  });
  it("has the 4-column grid, the phone rule and a print mode", () => {
    expect(css).toMatch(/--rp-cols: 4/);
    expect(css).toMatch(/@media \(max-width: 860px\)/);
    expect(css).toMatch(/@media print/);
    expect(css).toMatch(/@page/);
  });
});
