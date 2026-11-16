// @vitest-environment jsdom
// Every library component rendered twice on one page must not repeat an element id
// (a repeated id breaks aria-labelledby / aria-describedby / htmlFor and radio groups).
import * as React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";

// jsdom lacks these browser APIs; the components only need them to exist.
class Noop { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
const g = globalThis as unknown as Record<string, unknown>;
g.ResizeObserver ??= Noop;
g.IntersectionObserver ??= Noop;
if (!window.matchMedia) window.matchMedia = ((q: string) => ({ matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false })) as unknown as typeof window.matchMedia;
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
if (!Element.prototype.scrollTo) Element.prototype.scrollTo = () => {};

const modules = import.meta.glob<{ default?: React.ComponentType }>("./library/*.tsx", { eager: true });
afterEach(cleanup);

// SVG paint servers (gradients, clip paths) are decorative; a repeat only reuses the same paint.
const decorative = (el: Element) => el.closest("defs, linearGradient, radialGradient, clipPath, mask, pattern, filter") !== null;

describe("no repeated ids when a component appears twice", () => {
  for (const [path, mod] of Object.entries(modules)) {
    const C = mod.default;
    if (!C) continue;
    const name = path.replace("./library/", "").replace(".tsx", "");
    it(name, () => {
      const { container } = render(<><C /><C /></>);
      const ids = [...container.querySelectorAll("[id]")].filter((el) => !decorative(el)).map((el) => el.id);
      const repeated = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
      expect(repeated).toEqual([]);
    });
  }
});
