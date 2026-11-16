// @vitest-environment jsdom
// Every icon has a meaning loop (owner decision 2026-11-17): a new icon without one fails here.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Icon, type IconName } from "./company/icons";
import { ICON_LOOP, LOOP_SHAPES, iconLoopCss, loopPhase } from "./company/icon-loops";

afterEach(cleanup);

// IconName comes from SHAPES; read the names back through a render-free path.
const NAMES = Object.keys(ICON_LOOP).filter((n) => !n.endsWith("-filled")) as IconName[];

describe("icon meaning loops", () => {
  it("every icon in the set has a loop, and every loop names a real icon", () => {
    const { container } = render(<>{NAMES.map((n) => <Icon key={n} name={n} animate="loop" />)}</>);
    // a loop for an unknown name renders an svg with no shapes
    for (const svg of container.querySelectorAll("svg[data-loop]")) expect(svg.querySelectorAll("path,circle,rect,ellipse,polygon").length, svg.getAttribute("data-loop")!).toBeGreaterThan(0);
  });
  it("the icon set and the loop table list the same names", async () => {
    const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
    const src = fs.readFileSync("src/company/icons.tsx", "utf8");
    const block = src.slice(src.indexOf("const SHAPES"), src.indexOf("} as const"));
    const names = [...block.matchAll(/^\s{2}"?([a-z0-9-]+)"?:\s*\[/gm)].map((m) => m[1]).concat(Object.keys(LOOP_SHAPES));
    const missing = names.filter((n) => !ICON_LOOP[n]);
    expect(missing, `icons without a meaning loop: ${missing.join(", ")}`).toEqual([]);
    const extra = Object.keys(ICON_LOOP).filter((n) => !names.includes(n) && !n.endsWith("-filled"));
    expect(extra, `loops for icons that do not exist: ${extra.join(", ")}`).toEqual([]);
  });
  it("loops are calm and child positions exist", () => {
    for (const [name, loop] of Object.entries(ICON_LOOP)) {
      expect(loop.dur, name).toBeGreaterThanOrEqual(2.4);
      expect(loop.dur, name).toBeLessThanOrEqual(3.6);
      expect(loop.rules.length + (loop.overlay?.length ?? 0), name).toBeGreaterThan(0);
    }
    const { container } = render(<>{NAMES.map((n) => <Icon key={n} name={n} animate="loop" />)}</>);
    for (const [name, loop] of Object.entries(ICON_LOOP).filter(([n]) => !n.endsWith("-filled"))) {
      const svg = container.querySelector(`svg[data-loop="${name}"]`)!;
      const shapes = svg.querySelectorAll(":scope > :not([class^=ts-il-])").length;
      for (const [kids] of loop.rules) for (const k of kids) if (typeof k === "number") expect(k, `${name} child ${k}`).toBeLessThanOrEqual(shapes);
    }
  });
  it("neighbours start on different phases and reduced motion stops everything", () => {
    const phases = new Set(["brain", "file-text", "bot", "flask-conical", "workflow", "check", "code-xml"].map(loopPhase));
    expect(phases.size).toBeGreaterThanOrEqual(6);
    expect(iconLoopCss()).toMatch(/prefers-reduced-motion:reduce\)\{\.cv-icon\[data-loop\],\.cv-icon\[data-loop\] \*\{animation:none!important\}/);
  });
  it("follow-ups from the screens.10 review", () => {
    // a filled icon loops too (the yellow folder bobs)
    const { container } = render(<Icon name="folder" variant="filled" animate="loop" />);
    expect(container.querySelector('svg[data-loop="folder-filled"].is-filled')).toBeTruthy();
    const css = iconLoopCss();
    // rotate-ccw turns a full circle, so it never snaps back
    expect(css).toMatch(/\[data-loop="rotate-ccw"\]\{animation:ts-il-turn /);
    // running dots hide where offset-path on SVG is unsupported (Safari < 16)
    expect(css).toContain('@supports not (offset-path:path("M0 0")){.cv-icon[data-loop] [data-run]{display:none}}');
  });
});
