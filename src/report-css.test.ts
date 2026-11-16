import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("report.css", () => {
  const css = fs.readFileSync("src/lib/report.css", "utf8");
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
