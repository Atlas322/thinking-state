// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AgentTree, type TreeAgent } from "./library/agent-tree";
import {
  AgentHandoff,
  type HandoffAgent,
  type HandoffTask,
  type Handoff,
} from "./library/agent-handoff";
import { ContextMap, type ContextBlock } from "./library/context-map";
import { TraceWaterfall, type TraceSpan } from "./library/trace-waterfall";
beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn(() => ({ matches: true })),
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Agent Tree reference contracts", () => {
  const root: TreeAgent = {
    id: "lead",
    name: "Lead",
    task: "Ship the release",
    status: "running",
    cost: 0.1,
    started: 0,
    children: [
      {
        id: "build",
        name: "Builder",
        task: "Build",
        status: "waiting",
        ask: "Deploy the result?",
        cost: 0.2,
        started: 1000,
        children: [
          {
            id: "test",
            name: "Tester",
            task: "Test",
            status: "done",
            cost: 0.3,
            started: 2000,
            ended: 5000,
          },
        ],
      },
    ],
  };
  it("rolls costs up without losing children and respects controlled folding", () => {
    const onCollapsedChange = vi.fn();
    const { rerender } = render(
      <AgentTree
        root={root}
        now={10000}
        collapsed={[]}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    expect(screen.getAllByText("$0.60").length).toBeGreaterThan(0);
    fireEvent.click(
      screen.getByRole("button", { name: "Builder: 1 дэд агентыг нуух" }),
    );
    expect(onCollapsedChange).toHaveBeenCalledWith(["build"]);
    expect(screen.getByRole("treeitem", { name: "Tester, Дууссан" })).toBeTruthy();
    rerender(
      <AgentTree
        root={root}
        now={10000}
        collapsed={["build"]}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    expect(screen.queryByRole("treeitem", { name: "Tester, Дууссан" })).toBeNull();
    expect(
      screen.getByRole("button", { name: "Builder: 1 дэд агентыг харуулах" }),
    ).toBeTruthy();
    expect(screen.getAllByText("$0.60").length).toBeGreaterThan(0);
  });
  it("focuses the first answer and reports the specific approval action", () => {
    const onResolve = vi.fn();
    render(<AgentTree root={root} now={10000} onResolve={onResolve} />);
    fireEvent.click(screen.getByRole("button", { name: "Таны ээлж" }));
    expect(
      screen.getByRole("dialog", { name: "Builder: Таны ээлж" }),
    ).toBeTruthy();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Батлах" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Батлах" }));
    expect(onResolve).toHaveBeenCalledWith(root.children![0], "approve");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Таны ээлж" }),
    );
  });
  it("selects the actual agent for the consumer", () => {
    const onSelect = vi.fn();
    render(<AgentTree root={root} now={10000} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "Tester" }));
    expect(onSelect).toHaveBeenCalledWith(root.children![0].children![0]);
  });
});

describe("Context Map reference contracts", () => {
  const before: ContextBlock[] = [
    { id: "chat", label: "Earlier chat", kind: "chat", tokens: 80 },
    { id: "system", label: "System", kind: "system", tokens: 10 },
  ];
  const after: ContextBlock[] = [
    { id: "summary", label: "Session summary", kind: "summary", tokens: 20 },
    { id: "system", label: "System", kind: "system", tokens: 10 },
  ];
  it("switches between real before and after token sets and maintains free space", () => {
    const onViewChange = vi.fn();
    render(
      <ContextMap
        blocks={after}
        limit={100}
        compaction={{
          before,
          summarized: ["chat"],
          summary: "Session summary",
        }}
        onViewChange={onViewChange}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Сул зай, чөлөөтэй, 70 токен" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Өмнө" }));
    expect(onViewChange).toHaveBeenCalledWith("before");
    expect(
      screen.getByRole("button", { name: "Earlier chat, Яриа, 80 токен" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Сул зай, чөлөөтэй, 10 токен" }),
    ).toBeTruthy();
  });
  it("pins details, releases removed blocks, and reports free-space selection", () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <ContextMap blocks={before} limit={100} onSelect={onSelect} />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Earlier chat, Яриа, 80 токен" }),
    );
    expect(onSelect).toHaveBeenCalledWith(before[0]);
    expect(screen.getByRole("dialog")).toBeTruthy();
    rerender(<ContextMap blocks={after} limit={100} onSelect={onSelect} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: "Сул зай, чөлөөтэй, 70 токен" }),
    );
    expect(onSelect).toHaveBeenLastCalledWith(null);
    fireEvent.keyDown(screen.getByRole("region", { name: "Контекст" }), {
      key: "Escape",
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("uses the selected agent capacity and does not invent negative free space", () => {
    const onAgentChange = vi.fn();
    render(
      <ContextMap
        blocks={before}
        agents={[
          { id: "small", name: "Small", limit: 50 },
          { id: "large", name: "Large", limit: 200 },
        ]}
        agent="small"
        onAgentChange={onAgentChange}
      />,
    );
    expect(screen.queryByRole("button", { name: /Сул зай/ })).toBeNull();
    expect(screen.getByText("180%")).toBeTruthy();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Контекстийн агент сонгох" }),
      { target: { value: "large" } },
    );
    expect(onAgentChange).toHaveBeenCalledWith("large");
  });
});

describe("Trace Waterfall reference contracts", () => {
  const root: TraceSpan = {
    id: "run",
    name: "Run",
    kind: "agent",
    status: "done",
    start: 0,
    end: 10000,
    cost: 0.01,
    children: [
      {
        id: "llm",
        name: "Plan",
        kind: "llm",
        status: "done",
        start: 100,
        end: 3100,
        cost: 0.02,
        tokensIn: 100,
        tokensOut: 50,
      },
      {
        id: "tools",
        name: "Research",
        kind: "subagent",
        status: "done",
        start: 3200,
        end: 9000,
        children: [
          {
            id: "search",
            name: "Search",
            kind: "tool",
            status: "done",
            start: 3500,
            end: 8500,
            cost: 0.03,
            input: "pricing",
            output: "Three sources",
          },
        ],
      },
    ],
  };
  it("marks the slowest finished call and sums own plus descendant costs", () => {
    render(<TraceWaterfall root={root} />);
    expect(screen.getAllByText("$0.06").length).toBeGreaterThan(0);
    expect(
      screen
        .getByText("Хамгийн удаан")
        .closest("[role=treeitem]")
        ?.getAttribute("aria-label"),
    ).toContain("Search");
  });
  it("supports roving focus, folding, span details and Escape focus restoration", () => {
    const onOpenChange = vi.fn(),
      onCollapsedChange = vi.fn();
    render(
      <TraceWaterfall
        root={root}
        onOpenChange={onOpenChange}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    const first = screen.getByRole("treeitem", { name: /^Run,/ });
    first.focus();
    fireEvent.keyDown(first, { key: "End" });
    const last = screen.getByRole("treeitem", { name: /^Search,/ });
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(last, { key: "Enter" });
    expect(onOpenChange).toHaveBeenCalledWith(
      "search",
      root.children![1].children![0],
    );
    const dialog = screen.getByRole("dialog", { name: "Search" });
    expect(dialog.textContent).toContain("Three sources");
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(last, { key: "ArrowLeft" });
    const parent = screen.getByRole("treeitem", { name: /^Research,/ });
    expect(document.activeElement).toBe(parent);
    fireEvent.keyDown(parent, { key: "ArrowLeft" });
    expect(onCollapsedChange).toHaveBeenCalledWith(["tools"]);
    expect(screen.queryByRole("treeitem", { name: /^Search,/ })).toBeNull();
    fireEvent.keyDown(parent, { key: "ArrowRight" });
    expect(screen.getByRole("treeitem", { name: /^Search,/ })).toBeTruthy();
  });
  it("renders running spans using the supplied clock", () => {
    render(
      <TraceWaterfall
        root={{
          id: "run",
          name: "Live run",
          kind: "agent",
          status: "running",
          start: 0,
        }}
        now={5000}
      />,
    );
    expect(
      screen.getByRole("treeitem", {
        name: "Live run, агент, ажиллаж байна, 5 с, $0.000",
      }),
    ).toBeTruthy();
  });
});

describe("Agent Handoff reference contracts", () => {
  const agents: HandoffAgent[] = [
    { id: "research", name: "Researcher" },
    { id: "writer", name: "Writer" },
    { id: "review", name: "Reviewer" },
  ];
  const tasks: HandoffTask[] = [
    { id: "launch", title: "Launch post", status: "working", agent: "writer" },
  ];
  const handoffs: Handoff[] = [
    {
      id: "one",
      from: "research",
      to: "writer",
      task: "Launch post",
      items: [
        { id: "brief", label: "Brief", kind: "file" },
        { id: "quote", label: "User quote", lost: true, why: "Context limit" },
      ],
    },
  ];
  it("exposes what was lost and sends restoration to the consumer", () => {
    const onRestore = vi.fn();
    render(
      <AgentHandoff
        agents={agents}
        tasks={tasks}
        handoffs={handoffs}
        onRestore={onRestore}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /Launch post Brief 1 зүйл орхигдсон/,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /User quote Орхигдсон/ }),
    );
    expect(screen.getByText("Context limit")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Буцааж нэмэх" }));
    expect(onRestore).toHaveBeenCalledWith(handoffs[0], handoffs[0].items[1]);
  });
  it("assigns forward without dragging and prevents backward assignment", () => {
    const onAssign = vi.fn();
    render(
      <AgentHandoff
        agents={agents}
        tasks={tasks}
        handoffs={handoffs}
        onAssign={onAssign}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /Launch post Brief 1 зүйл орхигдсон/,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Даалгаврыг агентад шилжүүлэх →" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Launch post: Researcher-д оноох" }),
    );
    expect(onAssign).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "Launch post: Reviewer-д оноох" }),
    );
    expect(onAssign).toHaveBeenCalledWith(tasks[0], agents[2]);
  });
});
