// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThinkingState, type ThinkingStep } from "./thinking-state";

const steps: ThinkingStep[] = [
  {
    kind: "search",
    label: "Searching",
    sources: [{ label: "Visible source", href: "https://example.com" }],
    moreSources: [{ label: "Extra source", href: "https://example.org" }],
  },
  { kind: "step", label: "Reading sources" },
  { kind: "step", label: "Drafting answer" },
];

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers({
    toFake: [
      "setInterval",
      "clearInterval",
      "setTimeout",
      "clearTimeout",
      "Date",
      "performance",
    ],
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("ThinkingState", () => {
  it("reveals steps in order, updates elapsed time, and completes only once", () => {
    const onDone = vi.fn();
    render(<ThinkingState steps={steps} stepMs={1000} onDone={onDone} />);

    expect(screen.getByText("Searching")).toBeTruthy();
    expect(screen.queryByText("Reading sources")).toBeNull();
    expect(screen.getByRole("button", { name: "Thinking 0s" })).toBeTruthy();

    advance(1000);
    expect(screen.getByText("Searched")).toBeTruthy();
    expect(screen.getByText("Reading sources")).toBeTruthy();
    expect(screen.queryByText("Drafting answer")).toBeNull();
    expect(screen.getByRole("button", { name: "Thinking 1s" })).toBeTruthy();

    advance(1000);
    expect(screen.getByText("Drafting answer")).toBeTruthy();
    expect(screen.queryByText("Finished thinking")).toBeNull();

    advance(1000);
    expect(screen.getByText("Finished thinking")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Worked for 3s" })).toBeTruthy();
    expect(onDone).toHaveBeenCalledExactlyOnceWith(3);
    advance(10_000);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Worked for 3s" })).toBeTruthy();
  });

  it("keeps elapsed progress when a parent rerenders inline data and callbacks", () => {
    const firstCallback = vi.fn();
    const latestCallback = vi.fn();
    const { rerender } = render(
      <ThinkingState
        steps={[...steps]}
        stepMs={1000}
        onDone={(seconds) => firstCallback(seconds)}
      />,
    );
    advance(1500);

    rerender(
      <ThinkingState
        steps={[...steps]}
        stepMs={1000}
        onDone={(seconds) => latestCallback(seconds)}
      />,
    );
    expect(screen.getByText("Reading sources")).toBeTruthy();
    advance(1500);

    expect(screen.getByRole("button", { name: "Worked for 3s" })).toBeTruthy();
    expect(firstCallback).not.toHaveBeenCalled();
    expect(latestCallback).toHaveBeenCalledExactlyOnceWith(3);
  });

  it("makes collapsed content inert and hidden from assistive technology without pausing work", () => {
    render(<ThinkingState steps={steps} stepMs={1000} />);
    const header = screen.getByRole("button", { name: "Thinking 0s" });
    const body = document.getElementById(header.getAttribute("aria-controls")!);
    expect(body).not.toBeNull();

    fireEvent.click(header);
    expect(header.getAttribute("aria-expanded")).toBe("false");
    expect(body!.getAttribute("aria-hidden")).toBe("true");
    expect(body!.hasAttribute("inert")).toBe(true);
    expect(screen.queryByRole("link")).toBeNull();

    advance(3000);
    expect(screen.getByRole("button", { name: "Worked for 3s" })).toBeTruthy();
    fireEvent.click(header);
    expect(header.getAttribute("aria-expanded")).toBe("true");
    expect(body!.hasAttribute("inert")).toBe(false);
    expect(screen.getByRole("link", { name: /Visible source/ })).toBeTruthy();
  });

  it("expands extra source links and restores the collapsed source set", () => {
    render(<ThinkingState steps={steps} />);
    expect(screen.queryByRole("link", { name: /Extra source/ })).toBeNull();

    const more = screen.getByRole("button", { name: "+1 more" });
    const extra = document.getElementById(more.getAttribute("aria-controls")!);
    expect(extra!.hidden).toBe(true);
    fireEvent.click(more);

    const link = screen.getByRole("link", { name: /Extra source/ });
    expect(link.getAttribute("href")).toBe("https://example.org");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(more.getAttribute("aria-expanded")).toBe("true");
    expect(extra!.hidden).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Show less" }));
    expect(screen.queryByRole("link", { name: /Extra source/ })).toBeNull();
    expect(screen.getByRole("button", { name: "+1 more" })).toBeTruthy();
  });

  it("auto-collapses on completion and loops into a fresh expanded run", () => {
    const onDone = vi.fn();
    render(
      <ThinkingState
        steps={steps}
        stepMs={1000}
        loop
        collapseOnDone
        onDone={onDone}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "+1 more" }));
    advance(3000);
    expect(onDone).toHaveBeenCalledExactlyOnceWith(3);
    expect(
      screen
        .getByRole("button", { name: "Worked for 3s" })
        .getAttribute("aria-expanded"),
    ).toBe("false");

    advance(2550);
    expect(screen.getByRole("button", { name: "Worked for 3s" })).toBeTruthy();
    advance(50);
    expect(
      screen
        .getByRole("button", { name: "Thinking 0s" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    expect(screen.queryByText("Reading sources")).toBeNull();
    expect(screen.queryByText("Finished thinking")).toBeNull();
    expect(screen.getByRole("button", { name: "+1 more" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Extra source/ })).toBeNull();

    advance(3000);
    expect(onDone).toHaveBeenCalledTimes(2);
    expect(onDone).toHaveBeenLastCalledWith(3);
  });

  it("removes the timer on unmount and never completes an abandoned run", () => {
    const onDone = vi.fn();
    const { unmount } = render(
      <ThinkingState steps={steps} stepMs={1000} onDone={onDone} />,
    );
    advance(500);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    advance(10_000);
    expect(onDone).not.toHaveBeenCalled();
  });

  it("completes an empty sequence without an active step or repeated loops", () => {
    const onDone = vi.fn();
    render(
      <StrictMode>
        <ThinkingState
          steps={[]}
          loop
          doneLabel="Nothing to process"
          onDone={onDone}
        />
      </StrictMode>,
    );
    advance(0);
    expect(screen.getByText("Nothing to process")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Worked for 0s" })).toBeTruthy();
    expect(onDone).toHaveBeenCalledExactlyOnceWith(0);
    advance(10_000);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
