// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "@testing-library/react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AskWindow, askWindowDemo } from "./screens/ask-window";
afterEach(cleanup);

describe("AskWindow (lightweight)", () => {
  it("the side is the brain's menu and its chats, not the sources", () => {
    render(<AskWindow {...askWindowDemo} />);
    const nav = screen.getByRole("navigation").textContent ?? "";
    for (const t of ["Inbox", "Өнөөдөр", "Төслүүд", "Хүрээ", "Нөөц", "Агентууд", "Тархины чатууд", "Үнийн бодлого"]) expect(nav).toContain(t);
    expect(nav).not.toContain("Эх сурвалж");
    expect(screen.getByRole("button", { name: "Үнийн бодлого", current: true })).toBeTruthy();
  });
  it("shows the question as a sent message, the source chips and the cited answer", () => {
    render(<AskWindow {...askWindowDemo} play="static" />);
    expect(screen.getByText(askWindowDemo.question)).toBeTruthy();
    fireEvent.click([...document.querySelectorAll(".sp-chip")].find((b) => b.textContent?.includes("Багийн уулзалт"))!);
    expect(screen.getByRole("dialog", { name: "Багийн уулзалт · 10-р сар" })).toBeTruthy();
    expect(document.querySelector(".ca")?.getAttribute("data-theme")).toBe("light");
  });
  it("asks from the composer", () => {
    const onAsk = vi.fn();
    render(<AskWindow {...askWindowDemo} onAsk={onAsk} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Дараагийн алхам?" } });
    fireEvent.click(screen.getByRole("button", { name: "Асуух" }));
    expect(onAsk).toHaveBeenCalledWith("Дараагийн алхам?");
  });
  it("dark theme reaches the window and the answer", () => {
    render(<AskWindow {...askWindowDemo} theme="dark" play="static" />);
    expect(document.querySelector(".aw")?.getAttribute("data-ts-theme")).toBe("dark");
    expect(document.querySelector(".ca")?.getAttribute("data-theme")).toBe("dark");
  });
});

describe("AskWindow run (Thinking State)", () => {
  it("plays ask → think → sources → answer → done, step by step, and reports each phase", () => {
    vi.useFakeTimers();
    const phases: string[] = [];
    render(<AskWindow {...askWindowDemo} onPhase={(p) => phases.push(p)} />);
    expect(document.querySelector(".ca")).toBeNull(); // no answer yet
    expect(document.querySelectorAll(".sp-chip").length).toBe(0);
    for (let i = 0; i < 40; i++) act(() => { vi.advanceTimersByTime(250); });
    expect([...new Set(phases)]).toEqual(["ask", "think", "sources", "answer", "done"]);
    expect(document.querySelectorAll(".sp-chip").length).toBe(askWindowDemo.sources.length);
    expect(screen.getByText(askWindowDemo.question)).toBeTruthy();
    vi.useRealTimers();
  });
  it("static shows the finished run at once (reduced motion behaves the same)", () => {
    const phases: string[] = [];
    render(<AskWindow {...askWindowDemo} play="static" onPhase={(p) => phases.push(p)} />);
    expect(phases).toEqual(["done"]);
    expect(document.querySelector(".ca")).toBeTruthy();
  });
});
