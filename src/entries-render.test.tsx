// @vitest-environment jsdom
// A host mounts an entry as <Component {...componentDemo} /> (site-recipes). Every entry must draw
// something readable that way: an entry whose component needs props it does not ship is an empty box.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { readdirSync } from "node:fs";
import catalog from "./catalog.json";

afterEach(cleanup);
vi.setConfig({ testTimeout: 30_000 });
Element.prototype.scrollIntoView = vi.fn();
Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo; // jsdom has neither
if (!("ResizeObserver" in globalThis)) (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
const bySlug = new Map((catalog as { slug: string; exportName: string }[]).map((c) => [c.slug, c.exportName]));
const entries = readdirSync("src/lib/entries").map((f) => f.replace(/\.ts$/, "")).filter((s) => bySlug.has(s));

describe("entries draw with their own demo", () => {
  it.each(entries)("%s", async (slug) => {
    const mod = await import(`./lib/entries/${slug}.ts`);
    const name = bySlug.get(slug)!;
    const C = mod[name];
    expect(C, `${slug} exports ${name}`).toBeTruthy();
    const demo = mod[name[0].toLowerCase() + name.slice(1) + "Demo"];
    expect(demo, `${slug} exports its demo`).toBeTruthy();
    const { container } = render(<C {...demo} />);
    expect((container.textContent ?? "").trim().length, slug).toBeGreaterThan(20);
    expect(/[А-Яа-яӨөҮү]/.test(container.textContent ?? ""), `${slug} speaks Mongolian`).toBe(true);
  });
});
