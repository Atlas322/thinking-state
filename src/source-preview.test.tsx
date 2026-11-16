// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(cleanup);
import { SourcePreview } from "./library/source-preview";

const src = { id: "a", title: "Тайлан", kind: "document" as const, date: "2026-11-02", quote: "Нийт 62% өссөн", highlight: "62%" };

describe("SourcePreview", () => {
  it("opens from the chip and shows title, kind, date and the marked quote", () => {
    render(<SourcePreview source={src} />);
    const chip = screen.getByRole("button", { name: "Тайлан" });
    expect(chip.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(chip);
    expect(screen.getByRole("dialog", { name: "Тайлан" })).toBeTruthy();
    expect(screen.getByText(/Баримт · 2026-11-02/)).toBeTruthy();
    expect(document.querySelector("mark")?.textContent).toBe("62%");
  });
  it("closes on Escape and returns focus to the chip", () => {
    render(<SourcePreview source={src} defaultOpen />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Тайлан" }));
  });
  it("calls onOpenInApp and hides the button without it", () => {
    const fn = vi.fn();
    const { rerender } = render(<SourcePreview source={src} defaultOpen onOpenInApp={fn} />);
    fireEvent.click(screen.getByRole("button", { name: /Апп-д нээх/ }));
    expect(fn).toHaveBeenCalledWith(src);
    rerender(<SourcePreview source={src} defaultOpen />);
    expect(screen.queryByRole("button", { name: /Апп-д нээх/ })).toBeNull();
  });
  it("falls back to the document line icon when a brand has no logo", () => {
    render(<SourcePreview source={{ id: "b", title: "Ноорог", kind: "brand", brandName: "Самбар" }} defaultOpen />);
    expect(screen.getByText("Апп")).toBeTruthy();
    expect(document.querySelector(".sp-letter")).toBeNull();
    expect(document.querySelectorAll(".sp-tile svg").length).toBeGreaterThan(0);
  });
});

import { CitedAnswer } from "./library/cited-answer";
describe("CitedAnswer theme", () => {
  it("passes theme to data-theme so a light card can sit in a dark page", () => {
    const { container } = render(<div className="dark"><CitedAnswer theme="light" /></div>);
    expect(container.querySelector(".ca")?.getAttribute("data-theme")).toBe("light");
  });
});

import { BRAND_MARK, SourceIcon } from "./library/source-preview";
describe("SourceIcon brand marks", () => {
  it("draws an allowed brand's mark, and the kind icon for any other brand", () => {
    expect(Object.keys(BRAND_MARK).sort()).toEqual(["figma", "github", "linear"]);
    const { container, rerender } = render(<SourceIcon kind="document" brand="figma" tile={false} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBe("figma");
    expect(container.querySelector("svg")?.getAttribute("fill")).toBe("currentColor");
    rerender(<SourceIcon kind="message" brand="slack" tile={false} />);
    expect(container.querySelector("svg")?.getAttribute("aria-label")).toBeNull();
  });
});

describe("SourceIcon logo size", () => {
  it("a brand logo stays inside the icon size (a big SVG does not blow up the chip)", () => {
    const { container } = render(<SourceIcon kind="brand" size={12} tile={false} logo={<svg viewBox="0 0 2000 2000" />} />);
    const box = container.querySelector(".sp-letter") as HTMLElement;
    expect(box.style.width).toBe("12px");
    expect(box.style.height).toBe("12px");
  });
});
