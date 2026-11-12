// @vitest-environment jsdom
// check:content — no vendor or model names and no prices in anything a
// catalog preview shows (text, aria-label, title, alt, placeholder, value).
import { cleanup, render } from "@testing-library/react";
import type { ComponentType } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { catalog, hasClassic } from "./registry";
import { contentHits, readableText } from "./content-rules";

const modules = import.meta.glob<{ default: ComponentType }>("./library/*.tsx");

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })),
  });
  class Noop { observe() {} unobserve() {} disconnect() {} }
  vi.stubGlobal("ResizeObserver", Noop);
  vi.stubGlobal("IntersectionObserver", Noop);
  HTMLElement.prototype.animate = vi.fn().mockReturnValue({ cancel: vi.fn(), finished: Promise.resolve(), addEventListener: vi.fn() });
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLElement.prototype.scrollTo = vi.fn();
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("catalog content: no vendor or model names, no prices", () => {
  for (const entry of catalog)
    for (const style of hasClassic(entry) ? ["clean", "classic"] : ["clean"])
      it(`${entry.slug} (${style})`, async () => {
        vi.useFakeTimers();
        const { default: Preview } = await modules[`./library/${entry.slug}${style === "classic" ? "-classic" : ""}.tsx`]();
        const { container } = render(<Preview />);
        const hits = readableText(container).flatMap(contentHits);
        expect(hits.map((h) => `${h.rule}: «${h.match}» in “${h.text.trim()}”`)).toEqual([]);
      });
});
