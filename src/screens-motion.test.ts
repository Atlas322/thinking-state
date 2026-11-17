// One motion source (screens.20, CONTEXT v15 «animation хүртэл нэг»): every app screen times its
// animations and transitions with the src/motion tokens (motionVar or --ts-motion-*), never a raw number.
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";

const files = readdirSync("src/screens").filter((f) => f.endsWith(".tsx") && f !== "contrast-cases.tsx" && f !== "main.tsx");

describe("app screens use the motion tokens", () => {
  it.each(files)("%s has no raw durations in animation/transition", (f) => {
    const src = readFileSync(`src/screens/${f}`, "utf8").replace(/var\(--ts-motion-[^)]*\)/g, "TOKEN").replace(/\$\{motionVar\.[^}]*\}/g, "TOKEN");
    const raw = [...src.matchAll(/(?:animation|transition):([^;}"`]*)/g)].map((m) => m[1]).filter((v) => !/^\s*none/.test(v) && /(?<![\w-])\d*\.?\d+m?s\b/.test(v));
    expect(raw, f).toEqual([]);
  });
});
