// @vitest-environment jsdom
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoopRegion, ScenarioRegion, UNCONTROLLED_MAX_MS } from "./motion";

type IOCallback = (entries: { target: Element; isIntersecting: boolean; intersectionRatio: number }[]) => void;
let ioCallbacks: IOCallback[] = [];
let reduced = false;

beforeEach(() => {
  vi.useFakeTimers();
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
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const show = (visible: boolean) =>
  act(() => {
    for (const el of document.querySelectorAll("[data-ts-loop]"))
      for (const cb of ioCallbacks) cb([{ target: el, isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]);
  });
const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

const STEPS = [
  { state: "request", hold: 1000 },
  { state: "waiting", hold: 1500 },
  { state: "approved", hold: 1000 },
];

function Demo(props: { loops?: number }) {
  return (
    <ScenarioRegion steps={STEPS} rest={2000} controls="always" {...props}>
      {(s) => <p data-testid="s">{s}</p>}
    </ScenarioRegion>
  );
}

const state = () => screen.getByTestId("s").textContent;

describe("useScenario", () => {
  it("waits for the viewport, then steps through, rests and loops", () => {
    render(<Demo />);
    tick(5000);
    expect(state()).toBe("request"); // offscreen: no timers
    show(true);
    tick(1000);
    expect(state()).toBe("waiting");
    tick(1500);
    expect(state()).toBe("approved");
    tick(1000 + 1999);
    expect(state()).toBe("approved"); // resting
    tick(1);
    expect(state()).toBe("request"); // next cycle
  });

  it("stops on the final state after `loops` cycles and restarts on re-entry", () => {
    render(<Demo loops={2} />);
    show(true);
    for (let i = 0; i < 2; i++) [1000, 1500, 1000 + 2000].forEach(tick); // two cycles, step by step
    expect(state()).toBe("approved");
    for (let i = 0; i < 6; i++) tick(5000);
    expect(state()).toBe("approved");
    show(false);
    show(true);
    expect(state()).toBe("request");
  });

  it("⏸ freezes, ↺ starts over", () => {
    render(<Demo />);
    show(true);
    tick(1000);
    fireEvent.click(screen.getByRole("button", { name: "Хөдөлгөөнийг зогсоох" }));
    tick(10000);
    expect(state()).toBe("waiting");
    fireEvent.click(screen.getByRole("button", { name: "Дахин тоглуулах" }));
    expect(state()).toBe("request");
    tick(1000);
    expect(state()).toBe("waiting");
  });

  it("reduced motion shows the final state with no timers", () => {
    reduced = true;
    render(<Demo />);
    show(true);
    expect(state()).toBe("approved");
    expect(document.querySelector("[data-ts-step]")?.getAttribute("data-ts-step")).toBe("2");
  });
});

describe("useScenario with inline steps", () => {
  it("parent re-renders do not restart the hold timer", () => {
    function Parent() {
      const [n, setN] = React.useState(0);
      React.useEffect(() => {
        const t = setInterval(() => setN((x) => x + 1), 300);
        return () => clearInterval(t);
      }, []);
      return (
        <ScenarioRegion steps={[{ state: `a${n >= 0 ? "" : ""}`, hold: 1000 }, { state: "b", hold: 1000 }]} controls="none">
          {(st) => <p data-testid="s">{st}</p>}
        </ScenarioRegion>
      );
    }
    render(<Parent />);
    show(true);
    for (let i = 0; i < 4; i++) tick(300);
    expect(state()).toBe("b");
  });
});

describe("web blocks without controls (WCAG 2.2.2)", () => {
  const LONG = [
    { state: "one", hold: 2000 },
    { state: "two", hold: 2000 },
    { state: "three", hold: 2000 },
    { state: "four", hold: 2000 },
  ];
  it("default has no ↺ / ⏸, plays once and settles on the final state within 5 s", () => {
    render(
      <ScenarioRegion steps={LONG}>
        {(s) => <p data-testid="s">{s}</p>}
      </ScenarioRegion>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    show(true);
    tick(2000);
    expect(state()).toBe("two");
    tick(UNCONTROLLED_MAX_MS - 2000);
    expect(state()).toBe("four"); // cut short at 5 s on the final state
    tick(60_000);
    expect(state()).toBe("four"); // and it never starts again by itself
  });
  it("a short story still plays its single cycle in full", () => {
    render(
      <ScenarioRegion steps={STEPS}>
        {(s) => <p data-testid="s">{s}</p>}
      </ScenarioRegion>,
    );
    show(true);
    tick(1000);
    expect(state()).toBe("waiting");
    tick(1500);
    expect(state()).toBe("approved");
    tick(30_000);
    expect(state()).toBe("approved");
  });
  it("LoopRegion without controls runs its CSS loops once", () => {
    const { container } = render(<LoopRegion>x</LoopRegion>);
    const el = container.querySelector(".ts-loop-region") as HTMLElement;
    expect(el.dataset.controls).toBe("none");
    expect(el.style.getPropertyValue("--ts-motion-loop-count")).toBe("1");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
