import { describe, expect, it } from "vitest";
import catalog from "./catalog.json";

describe("scripts/quality-baseline.json", () => {
  it("only lists catalog components, and the Thinking State primitives meet both bars", async () => {
    const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
    const b = JSON.parse(fs.readFileSync("scripts/quality-baseline.json", "utf8")) as { motion: string[]; icons: Record<string, number> };
    const slugs = new Set(catalog.map((e) => e.slug));
    for (const s of [...b.motion, ...Object.keys(b.icons)]) expect(slugs.has(s), s).toBe(true);
    // new work is held to the bar: no new entries for these
    for (const s of ["ts-primitives", "company-workspace", "company-brief", "company-collection"]) {
      expect(b.motion).not.toContain(s);
      if (s === "ts-primitives") expect(b.icons[s]).toBeUndefined();
    }
  });
});
