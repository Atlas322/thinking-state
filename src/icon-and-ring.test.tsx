// @vitest-environment jsdom
// Locks two visual rules (owner decision, 2026-11-17):
// 1. Brand logos in source chips stay as on journal/b2: the official colour mark, 14 px, unmodified.
//    The thin line-icon tokens (--ts-icon-size, --ts-icon-stroke) apply to Lucide line icons only.
// 2. Focus and selected rings on chips, buttons and tabs follow the corner radius and are 1 px:
//    a box-shadow ring, never a 2 px outline (older Safari draws outlines square).
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { BRAND_LOGO, SourceIcon, SourcePreview } from "./library/source-preview";

afterEach(cleanup);
// node:fs by dynamic import, as the other file-reading tests: the build's tsc has no Node types.
const nodeFs = async () => (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
let read: (p: string) => string = () => "";
beforeAll(async () => { const fs = await nodeFs(); read = (p) => fs.readFileSync(p, "utf8"); }); // vitest runs from the repo root

describe("brand logo standard", () => {
  it("a source chip shows the brand mark at 14 px, unmodified, with no line-icon stroke", () => {
    render(<SourcePreview source={{ id: "s", title: "#sales", kind: "brand", brand: "slack" }} />);
    const img = document.querySelector(".sp-chip img.ts-brand-l") as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toBe(BRAND_LOGO.slack.light);
    expect(img.width).toBe(14);
    expect(img.style.filter).toBe("");
    expect(document.querySelector(".sp-chip .ts-brand")?.innerHTML).not.toContain("--ts-icon-stroke");
  });
  it("line icons take the stroke token, brand logos never do", () => {
    const { container } = render(<><SourceIcon kind="document" size={14} tile={false} /><SourceIcon kind="brand" brand="notion" size={14} tile={false} /></>);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("style")).toContain("var(--ts-icon-stroke");
    expect(container.querySelector(".ts-brand svg")).toBeNull();
  });
  it("tokens.css defines the line-icon tokens", () => {
    const css = read("src/lib/tokens.css");
    expect(css).toMatch(/--ts-icon-size:\s*14px/);
    expect(css).toMatch(/--ts-icon-stroke:\s*1\.25/);
  });
});

describe("rounded 1 px rings", () => {
  const files = ["src/library/source-preview.tsx", "src/screens/ask-window.tsx", "src/library/cited-answer.tsx", "src/lib/ts.css"];
  for (const f of files) {
    it(`${f}: focus-visible rings are 1 px box-shadows, not 2 px outlines`, () => {
      const rules = read(f).match(/[^{}]*:focus-visible[^{}]*\{[^}]*\}/g) ?? [];
      expect(rules.length).toBeGreaterThan(0);
      for (const r of rules) {
        expect(r, r).not.toMatch(/outline:\s*2px/);
        expect(r, r).toMatch(/box-shadow:0 0 0 [0-9.]+px [^;}]+,0 0 0 [0-9.]+px/);
      }
    });
  }
  it("the chip keeps the radius token and a 1 px selected border", () => {
    const css = read("src/library/source-preview.tsx");
    expect(css).toMatch(/\.sp-chip\{[^}]*border:1px solid[^}]*border-radius:var\(--ts-radius/);
    expect(css).toMatch(/\.sp-chip\[aria-expanded="true"\]\{border-color:/);
  });
});

// Ratchet (2026-11-17): 140 older focus rules across the library still use a 2 px outline. The
// count may only go down: new or edited components use the 1 px box-shadow ring. Lower
// OUTLINE_BASELINE when you convert some; the test fails if one is added.
const OUTLINE_BASELINE = 140;
describe("focus outline ratchet", () => {
  it(`no more than ${OUTLINE_BASELINE} :focus-visible rules with a 2 px outline`, async () => {
    const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as unknown as {
      readdirSync: (p: string, o: { withFileTypes: true }) => { name: string; isDirectory: () => boolean }[];
      readFileSync: (p: string, e: string) => string;
    };
    let n = 0;
    const walk = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = `${d}/${e.name}`;
        if (e.isDirectory()) walk(p);
        else if (/\.(tsx?|css)$/.test(e.name) && !/test/.test(e.name)) n += (fs.readFileSync(p, "utf8").match(/:focus-visible[^{}]*\{[^}]*outline:\s*2px/g) ?? []).length;
      }
    };
    walk("src");
    expect(n).toBeLessThanOrEqual(OUTLINE_BASELINE);
  });
});
