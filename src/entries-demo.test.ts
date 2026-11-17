// Each per-component entry carries its own demo, so a host that mounts one component with demo
// data does not pull the studio bundle (screens.18; project agent: «props-гүй mount studio-г бүтнээр ачаалж байна»).
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";

const dir = "src/lib/entries";
const entries = readdirSync(dir).filter((f) => f.endsWith(".ts"));

describe("per-component entries", () => {
  it.each(entries)("%s exports a *Demo and never imports the studio or demos.ts", async (f) => {
    const mod = await import(`./lib/entries/${f.replace(/\.ts$/, "")}`);
    expect(Object.keys(mod).filter((k) => /Demo$/.test(k)).length, f).toBeGreaterThan(0);
    const src = readFileSync(`${dir}/${f}`, "utf8");
    expect(src).not.toMatch(/studio|lib\/demos|\.\.\/demos/);
  }, 30_000);
});
