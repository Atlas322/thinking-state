// @vitest-environment jsdom
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { AgentHandoff, type Handoff } from "./library/agent-handoff";

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

const agents = [{ id: "a", name: "Researcher" }, { id: "b", name: "Writer" }];
const tasks = [{ id: "task", title: "Launch post", status: "working" as const, agent: "a" }];
const handoffs: Handoff[] = [{
  id: "older", from: "a", to: "b", task: "Launch post",
  items: [{ id: "quote", label: "Quote", lost: true, why: "Context limit" }],
}];

it("places appended handoffs first without mutating the consumer array", () => {
  const entries = [...handoffs, { ...handoffs[0], id: "newest", task: "Pricing copy" }];
  const { rerender } = render(<AgentHandoff agents={agents} tasks={tasks} handoffs={handoffs} />);
  rerender(<AgentHandoff agents={agents} tasks={tasks} handoffs={entries} />);
  const list = screen.getByRole("list", { name: "Researcher → Writer дамжуулалт" });
  expect(within(list).getAllByRole("listitem")[0].textContent).toContain("Pricing copy");
  expect(entries.map((entry) => entry.id)).toEqual(["older", "newest"]);
});

it("returns keyboard focus to the picked card after Escape or Cancel", () => {
  const onAssign = vi.fn();
  render(<AgentHandoff agents={agents} tasks={tasks} handoffs={handoffs} onAssign={onAssign} />);
  const card = screen.getByRole("button", { name: /Launch post.*орхигдсон/ });
  fireEvent.click(card);
  fireEvent.click(screen.getByRole("button", { name: "Даалгаврыг агентад шилжүүлэх →" }));
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Launch post: Writer-д оноох" }));
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  expect(document.activeElement).toBe(card);
  expect(card.getAttribute("aria-expanded")).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Даалгаврыг агентад шилжүүлэх →" }));
  fireEvent.click(screen.getByRole("button", { name: "Болих" }));
  expect(document.activeElement).toBe(card);
  expect(onAssign).not.toHaveBeenCalled();
});

it("does not submit an enclosing form and keeps focus when a nested loss closes", () => {
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const onRestore = vi.fn();
  render(<form onSubmit={onSubmit}><AgentHandoff agents={agents} tasks={tasks} handoffs={handoffs} onRestore={onRestore} /></form>);
  const card = screen.getByRole("button", { name: /Launch post.*орхигдсон/ });
  fireEvent.click(card);
  fireEvent.click(screen.getByRole("button", { name: "Quote Орхигдсон" }));
  const restore = screen.getByRole("button", { name: "Буцааж нэмэх" });
  fireEvent.click(restore);
  expect(onRestore).toHaveBeenCalledWith(handoffs[0], handoffs[0].items[0]);
  expect(onSubmit).not.toHaveBeenCalled();
  restore.focus();
  fireEvent.keyDown(restore, { key: "Escape" });
  expect(document.activeElement).toBe(card);
  expect(card.getAttribute("aria-expanded")).toBe("false");
});

it("sends one incoming and outgoing pulse for a new handoff without replaying updates", () => {
  vi.useFakeTimers();
  const { container, rerender } = render(<AgentHandoff agents={agents} tasks={tasks} handoffs={handoffs} />);
  expect(container.querySelectorAll("[data-handoff-pulse]").length).toBe(0);
  const next = [...handoffs, { ...handoffs[0], id: "new" }];
  rerender(<AgentHandoff agents={agents} tasks={tasks} handoffs={next} />);
  expect(container.querySelectorAll('[data-handoff-pulse="new"]').length).toBe(2);
  act(() => vi.advanceTimersByTime(2100));
  expect(container.querySelectorAll("[data-handoff-pulse]").length).toBe(0);
  rerender(<AgentHandoff agents={agents} tasks={tasks} handoffs={next.map((handoff) => ({ ...handoff }))} />);
  expect(container.querySelectorAll("[data-handoff-pulse]").length).toBe(0);
});
