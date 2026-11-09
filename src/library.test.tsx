// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { ComponentType } from "react";
import {
  catalog,
  buildPrompt,
  sourceFor,
  usageFor,
  hasClassic,
} from "./registry";
import { AgentPlan } from "./library/agent-plan";
import { DataTable } from "./library/data-table";
import { DecisionCard } from "./library/decision-card";
import { AutonomyDial } from "./library/autonomy-dial";
import { StepperForm } from "./library/stepper-form";
import { AgentInbox } from "./library/agent-inbox";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi
      .fn()
      .mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  HTMLElement.prototype.animate = vi
    .fn()
    .mockReturnValue({
      cancel: vi.fn(),
      finished: Promise.resolve(),
      addEventListener: vi.fn(),
    });
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLElement.prototype.scrollTo = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
const modules = import.meta.glob<{ default: ComponentType }>("./library/*.tsx");

describe("Complete reusable catalog", () => {
  it("contains all 90 distinct catalog entries and 23 MIT originals", () => {
    expect(catalog).toHaveLength(90);
    expect(new Set(catalog.map((x) => x.slug)).size).toBe(90);
    expect(catalog.filter((x) => !x.pro)).toHaveLength(23);
  });
  for (const entry of catalog) {
    for (const style of hasClassic(entry) ? ["clean", "classic"] : ["clean"]) {
      it(`${entry.slug} (${style}) renders and exports self-contained source`, async () => {
        vi.useFakeTimers();
        const suffix = style === "classic" ? "-classic" : "";
        const { default: Preview } =
          await modules[`./library/${entry.slug}${suffix}.tsx`]();
        const { container } = render(<Preview />);
        expect(container.textContent?.trim().length).toBeGreaterThan(0);
        const source = await sourceFor(entry, style);
        expect(source).toContain(`export function ${entry.exportName}`);
        expect(source).not.toMatch(/from\s+["'](?:\.|@\/)/);
        expect(source).not.toMatch(/import\s+["'].*\.css/);
        const prompt = buildPrompt(entry, style, source);
        expect(prompt).toContain(source);
        expect(prompt).toContain(usageFor(entry, style));
        expect(prompt).not.toContain("github.com/Bold322");
        if (!entry.pro)
          expect(source).toContain("Copyright (c) 2026 Florian Höller");
      });
    }
  }
});
describe("Library behavior", () => {
  it("moves an approved inbox task into Running and switches layouts", () => {
    render(<AgentInbox />);
    fireEvent.click(
      screen.getByRole("button", { name: /Migrate users table/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(
      screen.getByRole("region", { name: "Running" }).textContent,
    ).toContain("Migrate users table");
    expect(
      screen.getByRole("region", { name: "Needs you" }).textContent,
    ).not.toContain("Migrate users table");
    fireEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(
      screen.getByRole("radio", { name: "List" }).getAttribute("aria-checked"),
    ).toBe("true");
  });
  it("leaves task state to the consumer when an inbox callback is supplied", () => {
    const onApprove = vi.fn();
    render(<AgentInbox onApprove={onApprove} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Migrate users table/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalledWith(
      expect.objectContaining({ id: "migrate", status: "waiting" }),
    );
    expect(
      screen.getByRole("region", { name: "Needs you" }).textContent,
    ).toContain("Migrate users table");
  });
  it("runs an editable plan in order and cleans up timers", () => {
    vi.useFakeTimers();
    const onAction = vi.fn();
    const { unmount } = render(<AgentPlan onAction={onAction} />);
    fireEvent.change(screen.getByLabelText("New step"), {
      target: { value: "Check results" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByLabelText("Step 5")).toHaveProperty(
      "value",
      "Check results",
    );
    fireEvent.click(screen.getByRole("button", { name: "Run plan" }));
    expect(onAction).toHaveBeenCalledWith("run");
    for (let i = 0; i < 5; i++) act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByText("✓ Plan complete")).toBeTruthy();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("edits a table cell, calls its consumer, and supports undo", () => {
    const onChange = vi.fn();
    render(<DataTable onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Maya Chen name"), {
      target: { value: "Maya Updated" },
    });
    expect(onChange.mock.calls.at(-1)?.[0][0].name).toBe("Maya Updated");
    fireEvent.click(screen.getByRole("button", { name: /Undo/ }));
    expect(screen.getByLabelText("Maya Chen name")).toHaveProperty(
      "value",
      "Maya Chen",
    );
  });
  it("returns a custom decision to its consumer", () => {
    const onAction = vi.fn();
    render(<DecisionCard onAction={onAction} />);
    fireEvent.change(screen.getByLabelText("Or write your own"), {
      target: { value: "Use a staged release" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Answer" }));
    expect(onAction).toHaveBeenCalledWith("answer", {
      id: "custom",
      title: "Use a staged release",
    });
    expect(screen.getByText("Answer recorded")).toBeTruthy();
  });
  it("keeps locked actions out of autonomous execution", () => {
    render(<AutonomyDial />);
    fireEvent.change(screen.getByLabelText("Autonomy level"), {
      target: { value: "2" },
    });
    expect(
      screen.getByRole("button", { name: "Unlock Spend money" }),
    ).toBeTruthy();
    expect(screen.getByText("ASKS YOU FIRST")).toBeTruthy();
  });
  it("validates a stepper before returning completed data", () => {
    const onComplete = vi.fn();
    render(<StepperForm onComplete={onComplete} />);
    fireEvent.click(screen.getByRole("button", { name: "Continue →" }));
    expect(screen.getByRole("alert").textContent).toContain(
      "Give your workspace",
    );
    fireEvent.change(screen.getByLabelText("Workspace name"), {
      target: { value: "Lumen" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Continue →" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue →" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue →" }));
    fireEvent.click(screen.getByRole("button", { name: "Create workspace" }));
    expect(onComplete).toHaveBeenCalledWith({
      name: "Lumen",
      email: "",
      plan: "Pro",
    });
  });
});
