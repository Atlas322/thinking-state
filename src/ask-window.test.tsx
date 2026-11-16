// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AskWindow, askWindowDemo } from "./screens/ask-window";
afterEach(cleanup);

describe("AskWindow", () => {
  it("renders the question, sidebar sources, chips and the cited answer", () => {
    render(<AskWindow {...askWindowDemo} />);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(askWindowDemo.question);
    expect(screen.getByRole("navigation").textContent).toContain("Уулзалт");
    expect(screen.getByRole("button", { name: "Багийн уулзалт · 10-р сар" })).toBeTruthy();
    expect(document.querySelector(".ca")?.getAttribute("data-theme")).toBe("light");
  });
  it("opens a chip's preview from the sidebar and calls onAsk on submit", () => {
    const onAsk = vi.fn();
    render(<AskWindow {...askWindowDemo} onAsk={onAsk} />);
    fireEvent.click(screen.getAllByRole("button", { name: /Уулзалт/ })[0]);
    expect(screen.getByRole("dialog", { name: "Багийн уулзалт · 10-р сар" })).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Дараагийн алхам?" } });
    fireEvent.click(screen.getByRole("button", { name: "Асуух" }));
    expect(onAsk).toHaveBeenCalledWith("Дараагийн алхам?");
  });
  it("dark theme reaches the window and the answer", () => {
    render(<AskWindow {...askWindowDemo} theme="dark" />);
    expect(document.querySelector(".aw")?.getAttribute("data-ts-theme")).toBe("dark");
    expect(document.querySelector(".ca")?.getAttribute("data-theme")).toBe("dark");
  });
});
