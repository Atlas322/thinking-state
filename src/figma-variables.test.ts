import { describe, expect, it } from "vitest";
import catalog from "./catalog.json";

const fs = async () => (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };

describe("Figma export (npm run tokens:figma)", () => {
  it("figma-variables.json has cream and dark values for the semantic colours", async () => {
    const v = JSON.parse((await fs()).readFileSync("tokens/figma-variables.json", "utf8"));
    const get = (n: string) => v.variables.find((x: { name: string }) => x.name === n);
    expect(v.$meta.modes).toEqual(["cream", "dark"]);
    expect(get("color/page").values).toEqual({ cream: "#f0ede4", dark: "#262624" });
    expect(get("color/accent-strong").values).toEqual({ cream: "#1b5cff", dark: "#1b5cff" });
    expect(get("space/space-4").values.cream).toBe(16);
    expect(get("radius/tile").type).toBe("FLOAT");
    expect(get("color/status-needs-you-fg").type).toBe("COLOR");
    // fresh: every colour in tokens.css's cream block is exported
    const css = (await fs()).readFileSync("src/lib/tokens.css", "utf8");
    for (const m of css.matchAll(/^\s+(--ts-status-[a-z-]+): (#[0-9a-f]{6});/gm))
      expect(v.variables.some((x: { token: string }) => x.token === m[1]), m[1]).toBe(true);
  });

  it("figma-catalog.json lists every catalog component", async () => {
    const c = JSON.parse((await fs()).readFileSync("tokens/figma-catalog.json", "utf8"));
    expect(c.components.map((x: { slug: string }) => x.slug)).toEqual(catalog.map((x) => x.slug));
  });
});
