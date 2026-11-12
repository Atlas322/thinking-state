// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { Replay, withReplay } from "./replay/replay";

afterEach(cleanup);

function Counter({ onMount }: { onMount: () => void }) {
  const [n, setN] = React.useState(0);
  React.useEffect(onMount, [onMount]);
  return (
    <button type="button" onClick={() => setN((x) => x + 1)}>
      clicks {n}
    </button>
  );
}

describe("Replay", () => {
  it("re-mounts the child so its state and entry start over", () => {
    const onMount = vi.fn();
    const onReplay = vi.fn();
    render(
      <Replay onReplay={onReplay}>
        <Counter onMount={onMount} />
      </Replay>,
    );
    fireEvent.click(screen.getByRole("button", { name: /clicks/ }));
    expect(screen.getByRole("button", { name: /clicks/ }).textContent).toBe("clicks 1");
    const replay = screen.getByRole("button", { name: "Дахин тоглуулах" });
    expect(replay.getAttribute("type")).toBe("button");
    fireEvent.click(replay);
    expect(screen.getByRole("button", { name: /clicks/ }).textContent).toBe("clicks 0");
    expect(onMount).toHaveBeenCalledTimes(2);
    expect(onReplay).toHaveBeenCalledTimes(1);
  });

  it("works as a HOC and can hide its button", () => {
    const Wrapped = withReplay(Counter);
    const { rerender } = render(<Wrapped onMount={() => {}} />);
    expect(screen.getByRole("button", { name: "Дахин тоглуулах" })).toBeTruthy();
    rerender(
      <Replay showButton={false}>
        <span>x</span>
      </Replay>,
    );
    expect(screen.queryByRole("button", { name: "Дахин тоглуулах" })).toBeNull();
  });

  it("keeps the button under reduced motion and switches the child's motion off", () => {
    const { container } = render(
      <Replay>
        <span>x</span>
      </Replay>,
    );
    const css = container.querySelector("style")!.textContent!;
    expect(css).toMatch(/prefers-reduced-motion: reduce\)\{[^}]*\.ts-replay-body \*/);
    expect(css).not.toMatch(/prefers-reduced-motion[^@]*\.ts-replay-btn\{[^}]*display:\s*none/);
    expect(css).toContain("var(--ts-surface,");
  });
});
