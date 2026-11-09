// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AgentTree, type TreeAgent } from "./library/agent-tree";

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const tree: TreeAgent = {
  id: "lead", name: "Lead", task: "Ship the release", status: "running",
  children: [{ id: "review", name: "Reviewer", task: "Review the release", status: "waiting", ask: "Ship version one?" }],
};

describe("Agent Tree selection and live resolution", () => {
  it("keeps embedded tree controls from submitting a host form", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(<form onSubmit={onSubmit}><AgentTree root={tree} now={0} /></form>);
    fireEvent.click(screen.getByRole("button", { name: "Needs you" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    fireEvent.click(screen.getByRole("button", { name: "Hide 1 sub-agents of Lead" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("selects from the card body or Enter without selecting when child controls are used", () => {
    const onSelect = vi.fn();
    render(<AgentTree root={tree} now={0} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Ship the release"));
    expect(onSelect).toHaveBeenLastCalledWith(tree);
    fireEvent.keyDown(screen.getByRole("button", { name: "Reviewer" }), { key: "Enter" });
    expect(onSelect).toHaveBeenLastCalledWith(tree.children![0]);
    onSelect.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Needs you" }));
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Hide 1 sub-agents of Lead" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("updates an open question and resolves the latest agent without resetting focus", () => {
    const onResolve = vi.fn();
    const { rerender } = render(<AgentTree root={tree} now={0} onResolve={onResolve} />);
    fireEvent.click(screen.getByRole("button", { name: "Needs you" }));
    const reject = screen.getByRole("button", { name: "Reject" });
    reject.focus();
    const revised = { ...tree, children: [{ ...tree.children![0], ask: "Ship version two?" }] };
    rerender(<AgentTree root={revised} now={0} onResolve={onResolve} />);
    expect(screen.getByText("Ship version two?")).toBeTruthy();
    expect(screen.queryByText("Ship version one?")).toBeNull();
    expect(document.activeElement).toBe(reject);
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onResolve).toHaveBeenCalledWith(revised.children[0], "approve");
  });

  it("removes a stale question when that agent finishes or leaves the tree", () => {
    const { rerender } = render(<AgentTree root={tree} now={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Needs you" }));
    rerender(<AgentTree root={{ ...tree, children: [{ ...tree.children![0], status: "done" }] }} now={0} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    rerender(<AgentTree root={tree} now={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Needs you" }));
    rerender(<AgentTree root={{ ...tree, children: [] }} now={0} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
