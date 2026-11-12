// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LOOPS,
  LoopRegion,
  MotionProvider,
  SPRINGS,
  animateSpring,
  dampingRatio,
  motionCss,
  motionTokensCss,
  springAt,
  springDuration,
  springEasing,
  springKeyframes,
  useInViewLoop,
} from "./motion";
import { syncAnimation } from "./motion/use-in-view-loop";
import * as pkg from "./lib/index";

describe("spring physics", () => {
  it("starts at 0 and settles at 1", () => {
    for (const s of Object.values(SPRINGS)) {
      expect(springAt(s, 0)).toBeCloseTo(0, 6);
      expect(springAt(s, springDuration(s) / 1000)).toBeCloseTo(1, 2);
    }
  });

  it("overshoots only when underdamped", () => {
    expect(springEasing({ stiffness: 100, damping: 20 }).overshoot).toBe(0); // ζ = 1
    expect(springEasing({ stiffness: 100, damping: 40 }).overshoot).toBe(0); // ζ = 2
    expect(springEasing(SPRINGS.bouncy).overshoot).toBeGreaterThan(0.1);
    expect(dampingRatio(SPRINGS.wobble)).toBeLessThan(0.4);
  });

  it("honours initial velocity", () => {
    const flick = { stiffness: 200, damping: 30, velocity: 20 };
    expect(springAt(flick, 0.02)).toBeGreaterThan(springAt({ ...flick, velocity: 0 }, 0.02));
  });

  it("renders a compact CSS linear() easing", () => {
    const e = springEasing(SPRINGS.bouncy);
    expect(e.easing).toMatch(/^linear\(0, .*, 1\)$/);
    expect(e.easing.length).toBeLessThan(600);
    expect(e.fallback).toMatch(/^cubic-bezier/);
  });

  it("samples keyframes for motion that crosses rest", () => {
    const k = springKeyframes(SPRINGS.wobble, 16, 0, 20);
    expect(k[0]).toEqual({ offset: 0, value: 16 });
    expect(k.at(-1)).toEqual({ offset: 1, value: 0 });
    expect(k.some((f) => f.value < 0)).toBe(true);
  });
});

describe("motion tokens and loops", () => {
  it("tokens.css carries the generated --ts-motion-* block", async () => {
    // Vitest blanks CSS imports, so read the file (no Node types in the app tsconfig).
    const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
    const css = fs.readFileSync("src/lib/tokens.css", "utf8"); // vitest runs from the repo root
    expect(css).toContain("--ts-surface");
    for (const line of motionTokensCss().split("\n")) expect(css, line).toContain(line.trim());
    expect(css).toContain("@supports (animation-timing-function: linear(0, 1))");
  });

  it("animates transform and opacity only", () => {
    const css = motionCss();
    for (const n of LOOPS) expect(css).toContain(`@keyframes ts-loop-${n}`);
    const props = [...css.matchAll(/@keyframes[^{]+\{([\s\S]*?)\n\}/g)]
      .flatMap((m) => [...m[1].matchAll(/([a-z-]+):/g)].map((p) => p[1]))
      .filter((p) => p !== "animation-timing-function");
    expect(new Set(props)).toEqual(new Set(["transform", "opacity"]));
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("is exported from the package", () => {
    expect(pkg.LoopRegion).toBe(LoopRegion);
    expect(typeof pkg.useInViewLoop).toBe("function");
  });
});

// ── playback ────────────────────────────────────────────────────────────────
type IOCallback = (entries: { target: Element; isIntersecting: boolean; intersectionRatio: number }[]) => void;
let ioCallbacks: IOCallback[] = [];
let reduced = false;

beforeEach(() => {
  ioCallbacks = [];
  reduced = false;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IOCallback) {
        ioCallbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: q.includes("reduce") ? reduced : false,
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const showAll = (visible: boolean) =>
  act(() => {
    for (const el of document.querySelectorAll("[data-ts-loop]"))
      for (const cb of ioCallbacks) cb([{ target: el, isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]);
  });

function Probe() {
  const loop = useInViewLoop();
  return <div ref={loop.ref} {...loop.attrs} data-testid="probe" />;
}

describe("useInViewLoop", () => {
  it("plays only in view", () => {
    render(<Probe />);
    const el = screen.getByTestId("probe");
    expect(el.dataset.tsLoop).toBe("offscreen");
    showAll(true);
    expect(el.dataset.tsLoop).toBe("running");
    showAll(false);
    expect(el.dataset.tsLoop).toBe("offscreen");
  });

  it("holds the final state under prefers-reduced-motion", () => {
    reduced = true;
    render(<Probe />);
    showAll(true);
    expect(screen.getByTestId("probe").dataset.tsLoop).toBe("reduced");
  });

  it("follows the page-wide pause", () => {
    render(
      <MotionProvider defaultPaused>
        <Probe />
      </MotionProvider>,
    );
    showAll(true);
    expect(screen.getByTestId("probe").dataset.tsLoop).toBe("paused");
  });
});

describe("<LoopRegion> and <MotionControls>", () => {
  it("pauses, resumes and replays (WCAG 2.2.2)", () => {
    const { container } = render(
      <LoopRegion controls="always">
        <span className="ts-loop ts-loop-bob">●</span>
      </LoopRegion>,
    );
    const region = container.querySelector(".ts-loop-region") as HTMLElement;
    showAll(true);
    expect(region.dataset.tsLoop).toBe("running");
    fireEvent.click(screen.getByRole("button", { name: "Хөдөлгөөнийг зогсоох" }));
    expect(region.dataset.tsLoop).toBe("paused");
    fireEvent.click(screen.getByRole("button", { name: "Дахин тоглуулах" }));
    expect(region.dataset.tsLoop).toBe("running");
    fireEvent.click(screen.getByRole("button", { name: "Дахин тоглуулах" })); // remount path (no getAnimations in jsdom)
    expect(container.querySelector(".ts-loop-bob")).not.toBeNull();
  });

  it("hides controls when motion is reduced", () => {
    reduced = true;
    render(
      <LoopRegion controls="always">
        <span className="ts-loop ts-loop-bob">●</span>
      </LoopRegion>,
    );
    expect(screen.queryByRole("button", { name: "Дахин тоглуулах" })).toBeNull();
  });
});

describe("review fixes", () => {
  it("resuming one region keeps the page-wide pause for the others", () => {
    render(
      <MotionProvider defaultPaused>
        <LoopRegion controls="always">
          <span>a</span>
        </LoopRegion>
        <Probe />
      </MotionProvider>,
    );
    showAll(true);
    fireEvent.click(screen.getByRole("button", { name: "Хөдөлгөөнийг үргэлжлүүлэх" }));
    const [region, probe] = [...document.querySelectorAll<HTMLElement>("[data-ts-loop]")];
    expect(region.dataset.tsLoop).toBe("running");
    expect(probe.dataset.tsLoop).toBe("paused");
  });

  it("two hooks on one element both see it", () => {
    function Twice() {
      const a = useInViewLoop();
      const b = useInViewLoop();
      const ref = (n: HTMLDivElement | null) => {
        a.ref(n);
        b.ref(n);
      };
      return <div ref={ref} data-ts-loop={a.state} data-b={b.state} />;
    }
    const { container } = render(<Twice />);
    showAll(true);
    const el = container.firstElementChild as HTMLElement;
    expect([el.dataset.tsLoop, el.dataset.b]).toEqual(["running", "running"]);
  });

  it("cancels infinite WAAPI loops instead of finish() (which throws)", () => {
    const calls: string[] = [];
    const fake = (endTime: number) =>
      ({
        effect: { getComputedTiming: () => ({ endTime }) },
        finish: () => {
          if (!Number.isFinite(endTime)) throw new Error("InvalidStateError");
          calls.push("finish");
        },
        cancel: () => calls.push("cancel"),
        play: () => calls.push("play"),
        pause: () => calls.push("pause"),
      }) as unknown as Animation;
    syncAnimation(fake(Infinity), "paused");
    syncAnimation(fake(400), "reduced");
    syncAnimation(fake(Infinity), "offscreen");
    expect(calls).toEqual(["cancel", "finish", "pause"]);
  });
});

describe("animateSpring", () => {
  it("jumps to the last keyframe without WAAPI", () => {
    const el = document.createElement("div");
    expect(animateSpring(el, [{ opacity: 0 }, { opacity: 1, transform: "none" }])).toBeNull();
    expect(el.style.opacity).toBe("1");
    expect(el.style.transform).toBe("none");
  });
});
