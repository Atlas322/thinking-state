// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { ApprovalCard } from "./library/approval-card";
import { AgentLedger, type LedgerEntry } from "./library/agent-ledger";
import { Dropzone, type UploadItem } from "./library/dropzone";
import { PromptLibrary } from "./library/prompt-library";
import {
  AgentGraph,
  type GraphNode,
  type GraphCall,
} from "./library/agent-graph";

beforeAll(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
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
  vi.restoreAllMocks();
});

describe("Approval Card requests", () => {
  it("handles a rejected approval without resolving and allows a retry", async () => {
    const onApprove = vi
      .fn()
      .mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValueOnce(undefined);
    render(<ApprovalCard title="Deploy" onApprove={onApprove} />);
    fireEvent.click(screen.getByRole("checkbox"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Approve/ }));
    });
    expect(screen.getByRole("alert").textContent).toBe("Offline");
    expect(onApprove).toHaveBeenCalledWith({ always: true });
    const button = screen.getByRole("button", { name: /Approve/ });
    button.focus();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.queryByRole("button", { name: /Approve/ })).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("Approved: Deploy");
    expect(document.activeElement?.className).toBe("apv-resolved");
  });
  it("locks duplicate clicks until the promise finishes", async () => {
    let resolve!: () => void;
    const onApprove = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    render(<ApprovalCard onApprove={onApprove} />);
    fireEvent.click(screen.getByRole("button", { name: /Approve/ }));
    fireEvent.click(screen.getByRole("button", { name: "Approving…" }));
    fireEvent.keyDown(screen.getByRole("group"), { key: "Escape" });
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("group").getAttribute("aria-busy")).toBe("true");
    await act(async () => resolve());
    expect(screen.getByRole("status").textContent).toContain("Approved");
  });
  it("pauses expiration while hovered and expires once with the correct reason", () => {
    vi.useFakeTimers();
    const onDeny = vi.fn(),
      onExpire = vi.fn();
    render(
      <ApprovalCard
        title="Send"
        expiresIn={2}
        onDeny={onDeny}
        onExpire={onExpire}
      />,
    );
    fireEvent.mouseEnter(screen.getByRole("group"));
    act(() => vi.advanceTimersByTime(5000));
    expect(onDeny).not.toHaveBeenCalled();
    fireEvent.mouseLeave(screen.getByRole("group"));
    act(() => vi.advanceTimersByTime(2000));
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(onDeny).toHaveBeenCalledExactlyOnceWith({ reason: "timeout" });
    act(() => vi.advanceTimersByTime(5000));
    expect(onDeny).toHaveBeenCalledTimes(1);
  });
  it("keeps a controlled decision pending until its owner updates it", async () => {
    const onApprove = vi.fn();
    const view = render(
      <ApprovalCard status="pending" onApprove={onApprove} />,
    );
    await act(async () => {
      fireEvent.keyDown(screen.getByRole("group"), {
        key: "Enter",
        ctrlKey: true,
      });
    });
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Approve/ })).toBeTruthy();
    view.rerender(<ApprovalCard status="approved" />);
    expect(screen.getByRole("status").textContent).toContain("Approved");
  });
});

describe("Ledger dependencies", () => {
  const entries: LedgerEntry[] = [
    { id: "unrelated", action: "Rename a file", system: "Git", at: 4000 },
    {
      id: "email",
      action: "Send email",
      system: "Mail",
      at: 3000,
      dependsOn: ["price"],
      reversible: false,
    },
    {
      id: "deals",
      action: "Update deals",
      system: "CRM",
      at: 2000,
      dependsOn: ["price"],
    },
    { id: "price", action: "Change price", system: "Billing", at: 1000 },
  ];
  it("undoes real dependents while preserving unrelated and irreversible changes", async () => {
    const onUndo = vi.fn(),
      onRedo = vi.fn();
    render(
      <AgentLedger
        entries={entries}
        now={5000}
        onUndo={onUndo}
        onRedo={onRedo}
      />,
    );
    const trigger = screen.getByRole("button", {
      name: "Undo Change price and 1 dependent changes",
    });
    fireEvent.focus(trigger);
    expect(screen.getByText("Also undone")).toBeTruthy();
    expect(screen.getByText("Can't undo")).toBeTruthy();
    await act(async () => fireEvent.click(trigger));
    expect(onUndo).toHaveBeenCalledExactlyOnceWith(["deals", "price"]);
    expect(
      screen.getByRole("button", { name: "Undo Rename a file" }),
    ).toBeTruthy();
    const redoChild = screen.getByRole("button", { name: "Redo Update deals" });
    expect(redoChild.getAttribute("aria-disabled")).toBe("true");
    await act(async () => fireEvent.click(redoChild));
    expect(onRedo).not.toHaveBeenCalled();
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: "Redo Change price" }),
      ),
    );
    expect(onRedo).toHaveBeenCalledExactlyOnceWith(["deals", "price"]);
  });
  it("reports backend failure without falsely marking a change undone", async () => {
    render(
      <AgentLedger
        entries={entries}
        onUndo={() => Promise.reject(new Error("Cannot revert"))}
      />,
    );
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: "Undo Rename a file" }),
      ),
    );
    expect(screen.getByRole("alert").textContent).toBe("Cannot revert");
    expect(
      screen.queryByRole("button", { name: "Redo Rename a file" }),
    ).toBeNull();
  });
  it("terminates cyclic dependencies and respects controlled state", async () => {
    const onUndo = vi.fn();
    const cycle = [
      { ...entries[0], id: "a", dependsOn: ["b"] },
      { ...entries[2], id: "b", dependsOn: ["a"] },
    ];
    render(<AgentLedger entries={cycle} undone={[]} onUndo={onUndo} />);
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: /Undo Rename a file/ }),
      ),
    );
    expect(onUndo).toHaveBeenCalledExactlyOnceWith(["a", "b"]);
    expect(screen.queryByRole("button", { name: /Redo/ })).toBeNull();
  });
});

describe("File upload lifecycle", () => {
  const drop = (files: File[]) =>
    fireEvent.drop(
      screen.getByRole("button", { name: /Drop your files here/ }),
      { dataTransfer: { files } },
    );
  it("validates extensions and size before calling the upload handler", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined),
      onChange = vi.fn();
    render(
      <Dropzone
        accept={[".pdf"]}
        maxSize={3}
        onUpload={onUpload}
        onChange={onChange}
      />,
    );
    const good = new File(["ok"], "good.PDF"),
      big = new File(["12345"], "big.pdf"),
      bad = new File(["x"], "bad.exe");
    await act(async () => drop([good, big, bad]));
    expect(onUpload).toHaveBeenCalledTimes(1);
    expect(onUpload.mock.calls[0][0]).toBe(good);
    const list = onChange.mock.lastCall![0] as UploadItem[];
    expect(list.map((item) => [item.name, item.status, item.error])).toEqual([
      ["good.PDF", "done", undefined],
      ["big.pdf", "error", "Too large"],
      ["bad.exe", "error", "File type not accepted"],
    ]);
    expect(screen.queryByRole("button", { name: "Retry bad.exe" })).toBeNull();
  });
  it("reports progress, retries a failure, and notifies removals", async () => {
    const onChange = vi.fn();
    const onUpload = vi
      .fn()
      .mockImplementationOnce((_file, progress) => {
        progress(0.4);
        return Promise.reject(new Error("Offline"));
      })
      .mockImplementationOnce((_file, progress) => {
        progress(0.8);
        return Promise.resolve();
      });
    render(<Dropzone onUpload={onUpload} onChange={onChange} />);
    await act(async () => drop([new File(["data"], "report.pdf")]));
    expect(
      screen
        .getByRole("progressbar", { name: "Upload report.pdf" })
        .getAttribute("aria-valuenow"),
    ).toBe("40");
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Retry report.pdf" })),
    );
    expect(onUpload).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "100",
    );
    fireEvent.click(screen.getByRole("button", { name: "Remove report.pdf" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
  it("ignores completion and progress after a file has been removed", async () => {
    let finish!: () => void, progress!: (value: number) => void;
    const onChange = vi.fn();
    render(
      <Dropzone
        onChange={onChange}
        onUpload={(_file, callback) => {
          progress = callback;
          return new Promise((resolve) => {
            finish = resolve;
          });
        }}
      />,
    );
    await act(async () => drop([new File(["data"], "remove.pdf")]));
    fireEvent.click(screen.getByRole("button", { name: "Remove remove.pdf" }));
    const count = onChange.mock.calls.length;
    await act(async () => {
      progress(0.9);
      finish();
    });
    expect(onChange).toHaveBeenCalledTimes(count);
    expect(screen.queryByRole("progressbar")).toBeNull();
  });
  it("clears simulated uploads when unmounted", () => {
    vi.useFakeTimers({
      toFake: ["setInterval", "clearInterval", "setTimeout", "clearTimeout"],
    });
    const { unmount } = render(<Dropzone />);
    drop([new File(["data"], "demo.txt")]);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("Reusable prompt templates", () => {
  const templates = [
    {
      id: "one",
      title: "First",
      body: "Write for {audience} in {length}. Again: {audience}.",
      variables: { length: { default: "50 words" } },
    },
    { id: "two", title: "Second", body: "Help {audience}." },
  ];
  it("blocks incomplete prompts, deduplicates variables, and preserves values per template", () => {
    const onUse = vi.fn();
    render(<PromptLibrary templates={templates} onUse={onUse} />);
    expect(screen.getAllByRole("textbox", { name: "audience" })).toHaveLength(
      1,
    );
    fireEvent.click(screen.getByRole("button", { name: "Use prompt" }));
    expect(onUse).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("textbox", { name: "audience" }), {
      target: { value: "designers" },
    });
    fireEvent.click(screen.getByRole("option", { name: "Second" }));
    expect(
      (screen.getByRole("textbox", { name: "audience" }) as HTMLInputElement)
        .value,
    ).toBe("");
    fireEvent.change(screen.getByRole("textbox", { name: "audience" }), {
      target: { value: "engineers" },
    });
    fireEvent.click(screen.getByRole("option", { name: "First" }));
    fireEvent.click(screen.getByRole("button", { name: "Use prompt" }));
    expect(onUse).toHaveBeenCalledExactlyOnceWith(
      "Write for designers in 50 words. Again: designers.",
      templates[0],
      { audience: "designers", length: "50 words" },
    );
  });
  it("does not report a successful copy when clipboard permission fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
    });
    const onCopy = vi.fn();
    render(<PromptLibrary templates={templates} onCopy={onCopy} />);
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Copy prompt" })),
    );
    expect(onCopy).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toContain("Select and copy");
  });
  it("navigates templates by keyboard and keeps controlled selection with its owner", () => {
    const onSelect = vi.fn();
    render(
      <PromptLibrary templates={templates} value="one" onSelect={onSelect} />,
    );
    fireEvent.keyDown(screen.getByRole("option", { name: "First" }), {
      key: "End",
    });
    expect(onSelect).toHaveBeenCalledWith("two");
    expect(
      screen
        .getByRole("option", { name: "First" })
        .getAttribute("aria-selected"),
    ).toBe("true");
  });
});

describe("Graph data and inspection", () => {
  const nodes: GraphNode[] = [
    { id: "lead", name: "Lead", kind: "agent", lead: true, cost: 0.2 },
    {
      id: "research",
      name: "Researcher",
      kind: "agent",
      status: "waiting",
      cost: 0.1,
    },
    { id: "search", name: "Search", kind: "tool" },
    { id: "you", name: "You", kind: "user" },
  ];
  const calls: GraphCall[] = [
    {
      id: "call",
      from: "research",
      to: "search",
      at: 9000,
      label: "Find pricing",
      status: "ok",
      ms: 120,
    },
  ];
  it("derives links and recent counts from data without inventing calls on selection", () => {
    const onSelect = vi.fn();
    const view = render(
      <AgentGraph
        nodes={nodes}
        calls={calls}
        edges={[
          ["lead", "research"],
          ["missing", "lead"],
        ]}
        now={10000}
        onSelect={onSelect}
      />,
    );
    expect(view.container.querySelectorAll("[data-graph-link]")).toHaveLength(
      2,
    );
    expect(screen.getByText("1 calls/min")).toBeTruthy();
    expect(screen.getByText("$0.30")).toBeTruthy();
    const node = screen.getByRole("button", {
      name: "Researcher, agent, Needs you, 1 calls in the last minute",
    });
    fireEvent.click(node);
    expect(onSelect).toHaveBeenCalledWith(nodes[1]);
    expect(
      within(screen.getByRole("dialog")).getByText("Find pricing"),
    ).toBeTruthy();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Close Researcher details" }),
    );
    expect(screen.getByText("1 calls/min")).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onSelect).toHaveBeenLastCalledWith(null);
    expect(document.activeElement).toBe(node);
  });
  it("puts the lead in the center, avoids the five-node overlap, and updates removed nodes", () => {
    const many = [
      ...nodes,
      ...Array.from({ length: 5 }, (_, i): GraphNode => ({
        id: `tool-${i}`,
        name: `Tool ${i}`,
        kind: "tool",
      })),
    ];
    const onSelect = vi.fn();
    const view = render(
      <AgentGraph nodes={many} calls={calls} now={10000} onSelect={onSelect} />,
    );
    const positions = Array.from(
      view.container.querySelectorAll<HTMLElement>(".agg-node"),
    ).map((node) => `${node.style.left}:${node.style.top}`);
    expect(new Set(positions).size).toBe(many.length);
    expect(
      view.container.querySelector<HTMLElement>('[data-node-id="lead"]')!.style
        .left,
    ).toBe("320px");
    fireEvent.click(screen.getByRole("button", { name: /Search, tool/ }));
    view.rerender(
      <AgentGraph
        nodes={many.filter((node) => node.id !== "search")}
        calls={calls}
        now={10000}
        onSelect={onSelect}
      />,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(onSelect).toHaveBeenLastCalledWith(null);
    expect(view.container.querySelectorAll("[data-graph-link]")).toHaveLength(
      0,
    );
  });
  it("expires link heat and keeps an empty graph usable", () => {
    const view = render(<AgentGraph nodes={nodes} calls={calls} now={10000} />);
    expect(
      Number(
        view.container.querySelector(".agg-link")!.getAttribute("stroke-width"),
      ),
    ).toBeGreaterThan(1.25);
    view.rerender(<AgentGraph nodes={nodes} calls={calls} now={100000} />);
    expect(
      view.container.querySelector(".agg-link")!.getAttribute("stroke-width"),
    ).toBe("1.25");
    expect(screen.getByText("0 calls/min")).toBeTruthy();
    view.rerender(<AgentGraph nodes={[]} calls={calls} now={100000} />);
    expect(screen.getByText("No agents connected")).toBeTruthy();
  });
});
