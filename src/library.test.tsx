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
import { EmailDraft } from "./library/email-draft";
import { EmailDraft as EmailDraftClassic } from "./library/email-draft-classic";
import { FallbackChain } from "./library/fallback-chain";
import { DelegateBoard } from "./library/delegate-board";
import { AgentQueue, type QueueJob } from "./library/agent-queue";
import { AgentRecap } from "./library/agent-recap";
import { ThinkingState } from "./library/thinking-state";
import { WritingAssistant } from "./library/writing-assistant";
import { AgentTrail } from "./library/agent-trail";

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
  it("contains all 108 distinct catalog entries and 23 MIT originals", () => {
    expect(catalog).toHaveLength(108);
    expect(new Set(catalog.map((x) => x.slug)).size).toBe(108);
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

describe("studio props: email-draft", () => {
  it.each([
    ["clean", EmailDraft],
    ["classic", EmailDraftClassic],
  ])("status shows the draft state with its label and tone (%s)", (_, Draft) => {
    render(<Draft status="failed" />);
    const chip = screen.getByText("Амжилтгүй");
    expect(chip.getAttribute("data-status")).toBe("failed");
    cleanup();
    render(<Draft status="Чөлөөт бичвэр" />);
    expect(screen.getByText("Чөлөөт бичвэр").hasAttribute("data-status")).toBe(false);
  });

  it("link={null} hides the link row", () => {
    render(<EmailDraft link={null} />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("sendDelay sets the window before onSend, and a hidden link stays out of the body", () => {
    vi.useFakeTimers();
    const onSend = vi.fn();
    render(<EmailDraft sendDelay={3000} link={null} onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: "Имэйл илгээх" }));
    act(() => vi.advanceTimersByTime(2999));
    expect(onSend).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend.mock.calls[0][0].body).not.toContain("Санал харах");
  });
});

describe("studio props: fallback-chain", () => {
  const attempt = {
    id: "x1",
    model: "Загвар А",
    status: "answered" as const,
    tokens: 10,
  };

  it("name replaces the generated model name", () => {
    render(<FallbackChain attempts={[{ ...attempt, name: "Үндсэн туслах" }]} />);
    expect(screen.getByText("Үндсэн туслах")).toBeTruthy();
    expect(screen.queryByText("Загвар А")).toBeNull();
  });

  it("note shows a muted line under the attempt", () => {
    render(<FallbackChain attempts={[{ ...attempt, note: "Нөөцөөс авсан хариу" }]} />);
    expect(screen.getByText("Нөөцөөс авсан хариу").className).toBe("fc-note");
  });
});

describe("studio props: thinking-state", () => {
  const twoSteps = [
    { kind: "step" as const, label: "Нэгдүгээр алхам" },
    { kind: "step" as const, label: "Хоёрдугаар алхам" },
  ];

  it("stepMs sets the pace of the built-in run", () => {
    vi.useFakeTimers();
    render(<ThinkingState steps={twoSteps} stepMs={5000} />);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText("Хоёрдугаар алхам")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText("Хоёрдугаар алхам")).toBeTruthy();
  });

  it("workedLabel renders the finished header from milliseconds", () => {
    vi.useFakeTimers();
    render(
      <ThinkingState
        steps={twoSteps}
        stepMs={3000}
        workedLabel={(ms) => `Бодсон ${Math.round(ms / 1000)} с`}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(6500);
    });
    expect(screen.getByText("Бодсон 6 с")).toBeTruthy();
  });

  it("onDone fires once when the run finishes", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<ThinkingState steps={twoSteps} stepMs={100} onDone={onDone} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe("studio props: writing-assistant", () => {
  it("initialMessages starts from a ready conversation", () => {
    render(
      <WritingAssistant
        initialMessages={[
          { id: 1, role: "user", text: "Захидлаа богиносгоод өгөөч" },
          { id: 2, role: "assistant", text: "Товч хувилбарыг бэлдлээ." },
        ]}
      />,
    );
    expect(screen.getByText("Захидлаа богиносгоод өгөөч")).toBeTruthy();
    expect(screen.getByText("Товч хувилбарыг бэлдлээ.")).toBeTruthy();
    expect(screen.queryByText("Юу бичих вэ?")).toBeNull();
  });
});

describe("studio props: agent-trail", () => {
  it("icon replaces the step glyph and the default stays when absent", () => {
    const { container } = render(
      <AgentTrail
        steps={[
          { id: "a", title: "Дүрстэй алхам", state: "done", icon: <svg data-testid="step-icon" /> },
          { id: "b", title: "Энгийн алхам", state: "done" },
        ]}
      />,
    );
    const markers = container.querySelectorAll(".atr-mk");
    expect(markers[0].querySelector("[data-testid='step-icon']")).not.toBeNull();
    expect(markers[1].querySelector("path")).not.toBeNull();
  });
});

describe("studio props: delegate-board", () => {
  it("shows an agent role under the name", () => {
    render(<DelegateBoard mode="manual" agents={[{ id: "a", name: "Агент А", role: "Судалгааны үүрэг" }]} tasks={[]} />);
    expect(screen.getByText("Судалгааны үүрэг")).toBeTruthy();
  });
  it("renders nothing for a missing estimate and keeps totals numeric", () => {
    const { container } = render(
      <DelegateBoard
        mode="manual"
        agents={[{ id: "a", name: "Агент А", rate: 1 }]}
        tasks={[{ id: "t", title: "Хугацаагүй даалгавар", agentId: null }, { id: "u", title: "Нөгөө", agentId: "a" }]}
      />,
    );
    expect(screen.getByLabelText("Хугацаагүй даалгавар").textContent).not.toContain("мин");
    expect(container.textContent).not.toContain("NaN");
    expect(container.textContent).toContain("Дараалалд 0.00 кр");
  });
});

describe("studio props: agent-queue", () => {
  const t = 1_000_000;
  const jobs: QueueJob[] = Array.from({ length: 5 }, (_, i) => ({ id: `q${i}`, name: `Ажил ${i + 1}`, kind: "llm", status: "queued", enqueuedAt: t - (i + 1) * 1000 }));
  it("depth lists that many jobs before +N", () => {
    const { container } = render(<AgentQueue jobs={jobs} now={t} depth={2} />);
    expect(container.querySelectorAll(".agq-job").length).toBe(2);
    expect(container.querySelector(".agq-more")?.textContent).toBe("+3");
  });
  it("backpressure object shows a needs-you warning at the threshold", () => {
    const { container } = render(<AgentQueue jobs={jobs} now={t} backpressure={{ at: 5, label: "Ачаалал их" }} />);
    expect(container.querySelector(".agq-bp-warn")?.textContent).toContain("Ачаалал их");
    cleanup();
    const below = render(<AgentQueue jobs={jobs} now={t} backpressure={{ at: 6 }} />);
    expect(below.container.querySelector(".agq-bp-warn")).toBeNull();
  });
  it("axis order relabels the chart ends", () => {
    render(<AgentQueue jobs={jobs} now={t} axis="order" />);
    expect(screen.getByText("Эхэнд")).toBeTruthy();
    expect(screen.getByText("Сүүлд")).toBeTruthy();
  });
  it("totals.queued overrides the waiting counter", () => {
    const { container } = render(<AgentQueue jobs={jobs} now={t} totals={{ queued: 40, done: 7 }} />);
    expect(container.querySelector(".agq-stats b")?.textContent).toBe("40");
    expect(container.querySelector(".agq-box b")?.textContent).toBe("7");
  });
});

describe("studio props: agent-recap", () => {
  const events = [
    { id: "in", at: new Date(2026, 0, 14, 20, 0), kind: "done" as const, title: "Цонхон доторх" },
    { id: "out", at: new Date(2026, 0, 13, 9, 0), kind: "done" as const, title: "Цонхны гадна" },
  ];
  const since = new Date(2026, 0, 14, 18, 0);
  const until = new Date(2026, 0, 15, 8, 0);
  it("axis overrides the time-axis labels", () => {
    render(<AgentRecap events={events} since={since} until={until} axis={{ start: "Өчигдөр орой", end: "Өнөө өглөө" }} />);
    expect(screen.getByText("Өчигдөр орой")).toBeTruthy();
    expect(screen.getByText("Өнөө өглөө")).toBeTruthy();
  });
  it("since/until with clip limit events to the window", () => {
    render(<AgentRecap events={events} since={since} until={until} clip />);
    expect(screen.getByText("Цонхон доторх")).toBeTruthy();
    expect(screen.queryByText("Цонхны гадна")).toBeNull();
    cleanup();
    render(<AgentRecap events={events} since={since} until={until} />);
    expect(screen.getByText("Цонхны гадна")).toBeTruthy();
  });
});
