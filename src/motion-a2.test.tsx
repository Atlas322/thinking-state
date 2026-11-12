// @vitest-environment jsdom
// A2: the CompanyView board plays its story (tab → dashboard, task through GTD),
// stats count up, and touching the board pauses the story.
import * as React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CompanyPreview, BOARD_STORY } from "./company/company-preview";
import { CountUp } from "./company/ui";

type IOCallback = (entries: { target: Element; isIntersecting: boolean; intersectionRatio: number }[]) => void;
let ioCallbacks: IOCallback[] = [];
let reduced = false;
beforeEach(() => {
  vi.useFakeTimers();
  ioCallbacks = [];
  reduced = false;
  vi.stubGlobal("IntersectionObserver", class {
    constructor(cb: IOCallback) { ioCallbacks.push(cb); }
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") ? reduced : false, addEventListener() {}, removeEventListener() {} }));
  HTMLElement.prototype.scrollTo = vi.fn();
  HTMLElement.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const show = () =>
  act(() => {
    for (const el of document.querySelectorAll("[data-ts-loop]"))
      for (const cb of ioCallbacks) cb([{ target: el, isIntersecting: true, intersectionRatio: 1 }]);
  });
const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const selectedTab = () => document.querySelector('[role="tab"][aria-selected="true"]')?.textContent ?? "";

describe("A2 · CompanyView board story", () => {
  it("moves from the model tab to the dashboard by itself", () => {
    render(<CompanyPreview template="workspace" />);
    show();
    const first = selectedTab();
    tick(BOARD_STORY[0].hold + 50);
    expect(selectedTab()).not.toBe(first);
    expect(document.querySelector("[data-ts-step]")?.getAttribute("data-ts-step")).toBe("1");
  });
  it("pauses when the user touches the board", () => {
    const { container } = render(<CompanyPreview template="workspace" />);
    show();
    tick(BOARD_STORY[0].hold + 50);
    fireEvent.pointerDown(container.querySelector('[role="tab"]')!);
    const step = document.querySelector("[data-ts-step]")?.getAttribute("data-ts-step");
    tick(10_000);
    expect(document.querySelector("[data-ts-step]")?.getAttribute("data-ts-step")).toBe(step);
  });
});

describe("A2 · CountUp", () => {
  it("counts up to the value", () => {
    const { container } = render(<CountUp value={12} ms={300} />);
    expect(container.textContent).toBe("0");
    tick(400);
    expect(container.textContent).toBe("12");
    expect(container.querySelector("[aria-label]")?.getAttribute("aria-label")).toBe("12");
  });
  it("shows text values and reduced motion as is", () => {
    expect(render(<CountUp value="212/438" />).container.textContent).toBe("212/438");
    cleanup();
    reduced = true;
    expect(render(<CountUp value={7} />).container.textContent).toBe("7");
  });
});
