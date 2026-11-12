// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThinkingState, type ThinkingStep } from "./library/thinking-state";

// Live mode (Second Brain app, 2026-11-10): a real agent run owns the progress — the host passes the steps that
// have happened so far, the elapsed seconds and whether the run is done. The demo timer must not run.
const steps: ThinkingStep[] = [
  { kind: "step", label: "файл уншиж байна" },
  { kind: "step", label: "хайж байна" },
];

describe("ThinkingState live mode", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("shows every step at once, the last one active, with host seconds and labels", () => {
    const { container } = render(
      <ThinkingState
        steps={steps}
        live={{ done: false, seconds: 42 }}
        labels={{ thinking: "Ажиллаж байна", worked: (s) => `${s}с ажиллав` }}
      />,
    );
    expect(container.querySelectorAll(".thinking-item")).toHaveLength(2);
    expect(
      container.querySelectorAll(".thinking-item")[1].getAttribute("data-active"),
    ).toBe("true");
    expect(screen.getByText("Ажиллаж байна")).toBeTruthy();
    expect(screen.getByText("42s")).toBeTruthy();
  });

  it("never finishes on its own timer", () => {
    const { container } = render(
      <ThinkingState steps={steps} live={{ done: false, seconds: 1 }} />,
    );
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(
      container.querySelector(".thinking-state")?.getAttribute("data-done"),
    ).toBe("false");
    expect(container.querySelector(".thinking-finished")).toBeNull();
  });

  it("finishes when the host says so, with the host's labels", () => {
    const onDone = vi.fn();
    const { container, rerender } = render(
      <ThinkingState
        steps={steps}
        live={{ done: false, seconds: 5 }}
        onDone={onDone}
      />,
    );
    rerender(
      <ThinkingState
        steps={steps}
        live={{ done: true, seconds: 7 }}
        doneLabel="Дууссан"
        labels={{ worked: (s) => `${s}с ажиллав` }}
        onDone={onDone}
      />,
    );
    expect(
      container.querySelector(".thinking-state")?.getAttribute("data-done"),
    ).toBe("true");
    expect(screen.getByText("7с ажиллав")).toBeTruthy();
    expect(screen.getByText("Дууссан")).toBeTruthy();
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(onDone).toHaveBeenCalledWith(7);
  });

  it("lets the host format the running time and swap the finished icon (a failed run is not a check mark)", () => {
    const { container } = render(
      <ThinkingState
        steps={steps}
        live={{ done: true, seconds: 65 }}
        doneLabel="Алдаа гарлаа"
        doneIcon={<i data-testid="x" />}
        labels={{ time: (s) => `${Math.floor(s / 60)}м ${s % 60}с` }}
      />,
    );
    expect(screen.getByTestId("x")).toBeTruthy();
    expect(container.querySelector(".thinking-check")).toBeNull();
    cleanup();
    render(
      <ThinkingState
        steps={steps}
        live={{ done: false, seconds: 65 }}
        labels={{ time: (s) => `${Math.floor(s / 60)}м ${s % 60}с` }}
      />,
    );
    expect(screen.getByText("1м 5с")).toBeTruthy();
  });

  it("a run that is already done when it mounts starts folded (chat history)", () => {
    const { container } = render(
      <ThinkingState steps={steps} live={{ done: true, seconds: 9 }} collapseOnDone />,
    );
    expect(
      container.querySelector(".thinking-header")?.getAttribute("aria-expanded"),
    ).toBe("false");
  });
});
