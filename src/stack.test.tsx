// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GAPS, SPACE, Stack, gapVar } from "./layout/stack";

afterEach(cleanup);

describe("spacing", () => {
  it("Stack spaces children with a token gap, not margins", () => {
    const { container } = render(
      <Stack gap="control">
        <div role="radiogroup" />
        <p>caption</p>
      </Stack>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.display).toBe("flex");
    expect(el.style.flexDirection).toBe("column");
    expect(el.style.gap).toBe("var(--ts-gap-control, 16px)");
  });

  it("matches tokens.css", async () => {
    const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
    const css = fs.readFileSync("src/lib/tokens.css", "utf8");
    SPACE.forEach((px, i) => expect(css).toContain(`--ts-space-${i + 1}: ${px}px;`));
    expect(GAPS.control).toBeGreaterThanOrEqual(16);
    expect(GAPS.section).toBe(72);
    expect(css).toContain("--ts-gap-section: var(--ts-space-9);");
    expect(gapVar(3)).toBe("var(--ts-space-3, 12px)");
  });
});
