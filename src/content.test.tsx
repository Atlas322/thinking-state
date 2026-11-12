// @vitest-environment jsdom
// check:content — no vendor or model names and no prices in anything a
// catalog preview shows (text, aria-label, title, alt, placeholder, value).
import { cleanup, render } from "@testing-library/react";
import type { ComponentType } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { catalog, hasClassic } from "./registry";
import { contentHits, englishWords, readableText } from "./content-rules";

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

describe("catalog content: UI labels are Mongolian", () => {
  for (const entry of catalog)
    for (const style of hasClassic(entry) ? ["clean", "classic"] : ["clean"])
      it(`${entry.slug} (${style})`, async () => {
        vi.useFakeTimers();
        const { default: Preview } = await modules[`./library/${entry.slug}${style === "classic" ? "-classic" : ""}.tsx`]();
        const { container } = render(<Preview />);
        const english = readableText(container).filter((t) => englishWords(t).length).map((t) => `«${englishWords(t).join(" ")}» in “${t.trim().slice(0, 60)}”`);
        expect(english).toEqual([]);
      });
});

// Real people never go in the repo: fixtures and demo data are fictional
// (2026-11-12, the repo is public). src/real-names.json holds hashes of the
// names, handles and past employers to keep out, so the list names no one.
import realNames from "./real-names.json";

const tracked = import.meta.glob<string>(
  ["./**/*.{ts,tsx,css,json}", "../scripts/*.mjs", "../posts/*.{ts,tsx}", "../*.md", "../*.html"],
  { query: "?raw", import: "default", eager: true },
);

describe("no real people in source, fixtures or docs", () => {
  it("no word in a source file hashes to a listed real name", async () => {
    const banned = new Set(realNames.hashes);
    const hex = async (w: string) =>
      [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(w)))].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
    const hits: string[] = [];
    for (const [file, text] of Object.entries(tracked)) {
      if (file.endsWith("real-names.json")) continue;
      for (const w of new Set(text.toLowerCase().normalize("NFC").match(/[\p{L}\p{N}]+/gu) ?? []))
        if (banned.has(await hex(w))) hits.push(`${file}: ${w}`);
    }
    expect(Object.keys(tracked).length).toBeGreaterThan(200);
    expect(hits).toEqual([]);
  }, 120_000);
});
