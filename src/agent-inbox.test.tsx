// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { AgentInbox, type AgentTask } from "./library/agent-inbox";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({ matches: true })),
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function task(overrides: Partial<AgentTask> = {}): AgentTask {
  return { id: "task", title: "Review changes", agent: "Sonnet", status: "waiting", ...overrides };
}
const toggle = () => screen.getByRole("button", { name: /Review changes/ });

describe("Agent Inbox documented integration", () => {
  it("accepts sparse tasks and ticks millisecond timestamps while finished durations stay fixed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    const { container, unmount } = render(<AgentInbox tasks={[
      task({ startedAt: Date.now() - 80_000, status: "running" }),
      task({ id: "done", title: "Published digest", status: "done", elapsed: 252_000, steps: [{ label: "Published" }] }),
    ]} />);
    expect(toggle().textContent).toContain("1m 20s");
    expect(screen.getByRole("button", { name: /Published digest/ }).textContent).toContain("4m 12s");
    fireEvent.click(toggle());
    expect(screen.getByText("Sonnet")).toBeTruthy();
    expect(container.querySelectorAll(".ai-inbox-count")).toHaveLength(0);
    expect(container.textContent).not.toMatch(/NaN|undefined/);
    act(() => vi.advanceTimersByTime(2_000));
    expect(toggle().textContent).toContain("1m 22s");
    expect(screen.getByRole("button", { name: /Published digest/ }).textContent).toContain("4m 12s");
    fireEvent.click(screen.getByRole("button", { name: /Published digest/ }));
    expect(screen.getByText("Published")).toBeTruthy();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("applies fallback actions to supplied tasks without mutating them and restarts retry clocks", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    const source = task({ startedAt: Date.now() - 80_000 });
    render(<AgentInbox tasks={[source]} />);
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));
    expect(toggle().textContent).toContain("Failed");
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole("button", { name: /Retry/ }));
    expect(within(screen.getByRole("region", { name: "Running" })).getByRole("button", { name: /Review changes/ }).textContent).toContain("0m 00s");
    act(() => vi.advanceTimersByTime(1_000));
    expect(toggle().textContent).toContain("0m 01s");
    expect(source.status).toBe("waiting");
    expect(source.startedAt).toBe(920_000);
  });

  it("keeps a task under consumer control when a callback is supplied", () => {
    const source = task();
    const onApprove = vi.fn();
    const view = render(<AgentInbox tasks={[source]} onApprove={onApprove} />);
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalledExactlyOnceWith(source);
    expect(screen.getByRole("region", { name: "Needs you" }).textContent).toContain(source.title);
    view.rerender(<AgentInbox tasks={[{ ...source, status: "running" }]} onApprove={onApprove} />);
    expect(screen.getByRole("region", { name: "Running" }).textContent).toContain(source.title);
  });

  it("allows the owner to replace a task after a fallback approval", () => {
    const source = task();
    const view = render(<AgentInbox tasks={[source]} />);
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(screen.getByRole("region", { name: "Running" }).textContent).toContain(source.title);
    view.rerender(<AgentInbox tasks={[{ ...source, status: "done", elapsed: 30_000 }]} />);
    expect(screen.getByRole("region", { name: "Done" }).textContent).toContain(source.title);
    expect(toggle().textContent).toContain("0m 30s");
  });

  it("offers Open only when connected and passes the original task", () => {
    const source = task({ status: "done" });
    const onOpen = vi.fn();
    const view = render(<AgentInbox tasks={[source]} />);
    fireEvent.click(toggle());
    expect(screen.queryByRole("button", { name: "Open task" })).toBeNull();
    view.rerender(<AgentInbox tasks={[source]} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button", { name: "Open task" }));
    expect(onOpen).toHaveBeenCalledExactlyOnceWith(source);
  });

  it("runs the header action without submitting a surrounding form", () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(<form onSubmit={onSubmit}><AgentInbox tasks={[task()]} action={{ label: "New task", onClick }} /></form>);
    fireEvent.click(screen.getByRole("button", { name: "New task" }));
    fireEvent.click(toggle());
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("closes a card with Escape and restores its focus even when its id contains punctuation", () => {
    render(<AgentInbox tasks={[task({ id: 'task["quoted"]' })]} />);
    fireEvent.click(toggle());
    const approve = screen.getByRole("button", { name: "Approve" });
    approve.focus();
    fireEvent.keyDown(approve, { key: "Escape" });
    expect(toggle().getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle());
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
  });

  it.each(["Approve", "Reject", "Retry"])("keeps keyboard focus on the task after fallback %s", (label) => {
    render(<AgentInbox tasks={[task({ status: label === "Retry" ? "failed" : "waiting" })]} />);
    fireEvent.click(toggle());
    const action = screen.getByRole("button", { name: new RegExp(label) });
    action.focus();
    fireEvent.click(action);
    expect(document.activeElement).toBe(toggle());
    expect(toggle().getAttribute("aria-expanded")).toBe("false");
  });

  it("supports keyboard layout selection and waits for controlled view updates", () => {
    const onViewChange = vi.fn();
    const view = render(<AgentInbox tasks={[]} view="board" onViewChange={onViewChange} />);
    fireEvent.keyDown(screen.getByRole("radio", { name: "Board" }), { key: "ArrowRight" });
    expect(onViewChange).toHaveBeenCalledExactlyOnceWith("list");
    expect(screen.getByRole("radio", { name: "Board" }).getAttribute("aria-checked")).toBe("true");
    view.rerender(<AgentInbox tasks={[]} view="list" onViewChange={onViewChange} />);
    expect(screen.getByRole("radio", { name: "List" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "List" }).tabIndex).toBe(0);
  });
});
