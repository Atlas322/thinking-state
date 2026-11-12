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
  it("contains all 107 distinct catalog entries and 23 MIT originals", () => {
    expect(catalog).toHaveLength(107);
    expect(new Set(catalog.map((x) => x.slug)).size).toBe(107);
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
        // Module entries (Компани) import their folder; everything else is one file.
        if (!("module" in entry)) expect(source).not.toMatch(/from\s+["'](?:\.|@\/)/);
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
      screen.getByRole("button", { name: /Харилцагчийн бүртгэлийг цэгцлэх/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Дахин оролдох/ }));
    expect(
      screen.getByRole("region", { name: "Ажиллаж байна" }).textContent,
    ).toContain("Харилцагчийн бүртгэлийг цэгцлэх");
    expect(
      screen.getByRole("region", { name: "Таны ээлж" }).textContent,
    ).not.toContain("Харилцагчийн бүртгэлийг цэгцлэх");
    fireEvent.click(screen.getByRole("radio", { name: "Жагсаалт" }));
    expect(
      screen.getByRole("radio", { name: "Жагсаалт" }).getAttribute("aria-checked"),
    ).toBe("true");
  });
  it("leaves task state to the consumer when an inbox callback is supplied", () => {
    const onApprove = vi.fn();
    render(<AgentInbox onRetry={onApprove} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Харилцагчийн бүртгэлийг цэгцлэх/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Дахин оролдох/ }));
    expect(onApprove).toHaveBeenCalledWith(
      expect.objectContaining({ id: "crm", status: "failed" }),
    );
    expect(
      screen.getByRole("region", { name: "Таны ээлж" }).textContent,
    ).toContain("Харилцагчийн бүртгэлийг цэгцлэх");
  });
  it("runs an editable plan in order and cleans up timers", () => {
    vi.useFakeTimers();
    const onAction = vi.fn();
    const { unmount } = render(<AgentPlan onAction={onAction} status="draft" />);
    fireEvent.change(screen.getByLabelText("Шинэ алхам"), {
      target: { value: "Check results" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Нэмэх" }));
    expect(screen.getByLabelText("Алхам 6")).toHaveProperty(
      "value",
      "Check results",
    );
    fireEvent.click(screen.getByRole("button", { name: "Төлөвлөгөө ажиллуулах" }));
    expect(onAction).toHaveBeenCalledWith("run");
    for (let i = 0; i < 6; i++) act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByText("✓ Төлөвлөгөө дууссан")).toBeTruthy();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("edits a table cell, calls its consumer, and supports undo", () => {
    const onChange = vi.fn();
    render(<DataTable onRowsChange={onChange} />);
    fireEvent.doubleClick(screen.getByText("Дизайны файл"));
    fireEvent.change(screen.getByLabelText("Дизайны файл Хэрэгсэл"), {
      target: { value: "Дизайны файл 2" },
    });
    fireEvent.keyDown(screen.getByLabelText("Дизайны файл Хэрэгсэл"), { key: "Enter" });
    expect(onChange.mock.calls.at(-1)?.[0][0].tool).toBe("Дизайны файл 2");
    fireEvent.click(screen.getByRole("button", { name: /Буцаах/ }));
    expect(screen.getByText("Дизайны файл")).toBeTruthy();
  });
  it("returns a custom decision to its consumer", () => {
    const onDecide = vi.fn();
    render(<DecisionCard onDecide={onDecide} />);
    fireEvent.change(screen.getByLabelText("Өөр хариулт"), {
      target: { value: "Use a staged release" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Хариулт илгээх" }));
    expect(onDecide).toHaveBeenCalledWith("weekly", {
      text: "Use a staged release",
    });
    expect(screen.getByText("Хариулт бүртгэгдлээ")).toBeTruthy();
  });
  it("keeps locked actions out of autonomous execution", () => {
    render(<AutonomyDial />);
    fireEvent.click(screen.getByRole("radio", { name: "Бүрэн автомат" }));
    expect(
      screen.getByRole("button", { name: "Мөнгө зарцуулах: түгжээ тайлах" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("region", { name: "Эхлээд танаас асууна" }).textContent,
    ).toContain("Мөнгө зарцуулах");
  });
  it("validates a stepper before returning completed data", () => {
    const onComplete = vi.fn();
    render(<StepperForm onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText("Орон зайн нэр"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Үргэлжлүүлэх" }));
    expect(screen.getAllByRole("alert")[0].textContent).toContain(
      "Орон зайдаа нэр",
    );
    fireEvent.change(screen.getByLabelText("Орон зайн нэр"), {
      target: { value: "Lumen" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Үргэлжлүүлэх" }));
    fireEvent.click(screen.getByRole("button", { name: "Алгасах" }));
    fireEvent.click(screen.getByRole("button", { name: "Үргэлжлүүлэх" }));
    fireEvent.click(screen.getByRole("button", { name: "Орон зай үүсгэх" }));
    expect(onComplete).toHaveBeenCalledWith({
      name: "Lumen",
      url: "lumen",
      invites: [],
      plan: "Pro",
    });
  });
});
