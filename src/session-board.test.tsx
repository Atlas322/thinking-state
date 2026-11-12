// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { SessionBoard, type SessionBoardSession } from "./library/session-board";

const mockMotion = (reduce: boolean) =>
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: reduce && q.includes("reduce"),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });

afterEach(cleanup);

const sessions: SessionBoardSession[] = [
  { id: "child", title: "Child task", state: "done", group: "projects", parent: "root" },
  { id: "root", title: "Root task", state: "running", group: "projects", pr: { number: 7, state: "open" } },
  { id: "loose", title: "Loose task", state: "idle" },
  { id: "elsewhere", title: "Unknown group", state: "waiting", group: "nope" },
];

describe("SessionBoard", () => {
  it("orders children under their parent and collects ungrouped sessions", () => {
    mockMotion(true);
    render(<SessionBoard sessions={sessions} />);
    const projects = screen.getByRole("region", { name: /Projects/ });
    const titles = within(projects).getAllByRole("button").slice(1).map((b) => b.textContent);
    expect(titles[0]).toContain("Root task");
    expect(titles[1]).toContain("Child task");
    expect(within(projects).getByText("#7")).toBeTruthy();
    const ungrouped = screen.getByRole("region", { name: /Ungrouped/ });
    expect(ungrouped.textContent).toContain("Loose task");
    expect(ungrouped.textContent).toContain("Unknown group");
    expect(screen.getByRole("button", { name: /^Ungrouped\W*2 sessions$/ })).toBeTruthy();
  });

  it("collapses a group and makes its rows inert", () => {
    mockMotion(true);
    render(<SessionBoard sessions={sessions} />);
    const head = screen.getByRole("button", { name: /^Projects/ });
    expect(head.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(head);
    expect(head.getAttribute("aria-expanded")).toBe("false");
    const body = document.getElementById(head.getAttribute("aria-controls")!)!;
    expect(body.hasAttribute("inert")).toBe(true);
  });

  it("reports clicks and marks the selected row", () => {
    mockMotion(true);
    const onSessionClick = vi.fn();
    render(<SessionBoard sessions={sessions} onSessionClick={onSessionClick} />);
    const row = screen.getByRole("button", { name: /Root task/ });
    fireEvent.click(row);
    expect(onSessionClick).toHaveBeenCalledWith(expect.objectContaining({ id: "root" }));
    expect(row.getAttribute("aria-current")).toBe("true");
  });

  it("moves focus between rows with arrow keys", () => {
    mockMotion(true);
    render(<SessionBoard sessions={sessions} />);
    const root = screen.getByRole("button", { name: /Root task/ });
    root.focus();
    fireEvent.keyDown(root, { key: "ArrowDown" });
    expect(document.activeElement?.textContent).toContain("Child task");
  });

  it("shows final counters at once under reduced motion", () => {
    mockMotion(true);
    render(<SessionBoard project={{ name: "Demo", stats: { tasks: 12, decisions: 4, pages: 38, prs: 3 } }} sessions={[]} />);
    const stats = document.querySelectorAll(".sb-stat dd [aria-hidden]");
    expect(Array.from(stats).map((n) => n.textContent)).toEqual(["12", "4", "38", "3"]);
    expect(screen.getAllByText("No sessions")).toHaveLength(4);
  });
});
