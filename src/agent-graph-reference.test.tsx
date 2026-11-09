// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AgentGraph, type GraphCall, type GraphNode } from "./library/agent-graph";

let frameTime = 100;
let nextFrame = 0;
let frames: Map<number, FrameRequestCallback>;
let intersection: IntersectionObserverCallback;
let reducedMotion = false;

beforeEach(() => {
  frameTime = 100;
  nextFrame = 0;
  frames = new Map();
  reducedMotion = false;
  vi.spyOn(performance, "now").mockImplementation(() => frameTime);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe() {}
    disconnect() {}
  });
  vi.stubGlobal("matchMedia", () => ({ matches: reducedMotion }));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function advanceFrame(time: number) {
  frameTime = time;
  act(() => {
    const scheduled = [...frames.values()];
    frames.clear();
    scheduled.forEach((callback) => callback(time));
  });
}

const nodes: GraphNode[] = [
  { id: "top", name: "Top", kind: "agent", position: { x: 0.5, y: 0.2 } },
  { id: "bottom", name: "Bottom", kind: "tool", position: { x: 0.5, y: 0.8 } },
];
const pending: GraphCall[] = [{ id: "request", from: "top", to: "bottom", at: 9000, status: "pending" }];

describe("Agent Graph pulse direction and lifecycle", () => {
  it("orients a vertical request gradient downward and its answer upward on the same connector", () => {
    const view = render(<AgentGraph nodes={nodes} calls={pending} now={10000} />);
    advanceFrame(200);
    const request = view.container.querySelector<SVGPathElement>('.agg-pulse[data-answer="false"]')!;
    const requestGradient = view.container.querySelector<SVGLinearGradientElement>(`[id="${request.getAttribute("stroke")!.slice(5, -1)}"]`)!;
    expect(requestGradient.getAttribute("x1")).toBe(requestGradient.getAttribute("x2"));
    expect(Number(requestGradient.getAttribute("y1"))).toBeLessThan(Number(requestGradient.getAttribute("y2")));

    view.rerender(<AgentGraph nodes={nodes} calls={[{ ...pending[0], status: "ok" }]} now={10000} />);
    advanceFrame(300);
    const answer = view.container.querySelector<SVGPathElement>('.agg-pulse[data-answer="true"]')!;
    const answerGradient = view.container.querySelector<SVGLinearGradientElement>(`[id="${answer.getAttribute("stroke")!.slice(5, -1)}"]`)!;
    expect(answerGradient.getAttribute("x1")).toBe(answerGradient.getAttribute("x2"));
    expect(Number(answerGradient.getAttribute("y1"))).toBeGreaterThan(Number(answerGradient.getAttribute("y2")));
    const requestPoints = request.getAttribute("d")!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const answerPoints = answer.getAttribute("d")!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    expect(answerPoints).toEqual([...requestPoints.slice(2), ...requestPoints.slice(0, 2)]);
  });

  it("does not replay calls on clock updates and stops scheduling frames after their pulses expire", () => {
    const view = render(<AgentGraph nodes={nodes} calls={pending} now={10000} />);
    advanceFrame(200);
    expect(view.container.querySelectorAll(".agg-pulse")).toHaveLength(1);
    view.rerender(<AgentGraph nodes={nodes} calls={pending} now={11000} />);
    expect(view.container.querySelectorAll(".agg-pulse")).toHaveLength(1);
    advanceFrame(1300);
    expect(view.container.querySelectorAll(".agg-pulse")).toHaveLength(0);
    expect(frames.size).toBe(0);
    view.rerender(<AgentGraph nodes={nodes} calls={pending} now={12000} />);
    expect(frames.size).toBe(0);
    expect(view.container.querySelectorAll(".agg-pulse")).toHaveLength(0);
  });

  it("cancels animation off screen, resumes it on return, and leaves reduced-motion calls stationary", () => {
    const view = render(<AgentGraph nodes={nodes} calls={pending} now={10000} />);
    expect(frames.size).toBeGreaterThan(0);
    act(() => intersection([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(frames.size).toBe(0);
    expect(view.container.querySelector(".agg-root")?.getAttribute("data-paused")).toBe("true");
    act(() => intersection([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(frames.size).toBeGreaterThan(0);
    view.unmount();

    reducedMotion = true;
    const quiet = render(<AgentGraph nodes={nodes} calls={pending} now={10000} />);
    expect(quiet.container.querySelectorAll(".agg-pulse")).toHaveLength(0);
    expect(quiet.container.querySelector(".agg-link")?.getAttribute("data-lit")).toBe("true");
    advanceFrame(1300);
    expect(quiet.container.querySelector(".agg-link")?.getAttribute("data-lit")).toBe("false");
    expect(frames.size).toBe(0);
  });
});

it.each([320, 640])("reserves label room inside both panel edges at %ipx without moving fixed-position nodes", (width) => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width } as DOMRect);
  reducedMotion = true;
  const view = render(<AgentGraph now={10000} nodes={[
    { id: "left", name: "A long tool name at the left edge", kind: "tool", position: { x: 0, y: 0.5 } },
    { id: "right", name: "A long tool name at the right edge", kind: "tool", position: { x: 1, y: 0.5 } },
  ]} />);
  for (const button of view.container.querySelectorAll<HTMLElement>(".agg-node")) {
    const x = Number.parseFloat(button.style.left);
    const labelRoom = Number.parseFloat(button.style.getPropertyValue("--agg-label-room"));
    expect(labelRoom).toBeGreaterThan(0);
    expect(x - labelRoom / 2).toBeGreaterThanOrEqual(8);
    expect(x + labelRoom / 2).toBeLessThanOrEqual(width - 8);
    expect(button.getAttribute("aria-label")).toContain("A long tool name");
  }
});
