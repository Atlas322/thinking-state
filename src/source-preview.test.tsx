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

import { BRAND_LOGO, BRAND_NAME, SourceIcon, brandTrademarkNoteMn } from "./library/source-preview";
describe("SourceIcon app logos (svgl)", () => {
  it("has the apps the chips cite, and no Microsoft or Adobe marks", () => {
    for (const k of ["slack", "notion", "google-calendar", "gmail", "google-drive", "google-sheets", "google-slides", "google-meet", "microsoft-word", "microsoft-excel", "microsoft-powerpoint", "microsoft-outlook", "microsoft-teams", "microsoft-onedrive", "obsidian", "figma", "github", "linear"]) expect(BRAND_LOGO[k], k).toBeTruthy();
    expect(Object.keys(BRAND_LOGO).some((k) => /adobe|photoshop/.test(k))).toBe(false); // Adobe still waits for a decision
    for (const k of Object.keys(BRAND_LOGO)) expect(BRAND_NAME[k], k).toBeTruthy();
    for (const k of Object.keys(BRAND_LOGO)) expect(brandTrademarkNoteMn).toContain(BRAND_NAME[k]);
  });
  it("draws the logo unmodified as an image at the icon size; GitHub swaps for dark", () => {
    const { container, rerender } = render(<SourceIcon kind="message" brand="Slack" size={12} tile={false} />);
    const img = container.querySelector("img.ts-brand-l") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe(BRAND_LOGO.slack.light);
    expect(img.style.width).toBe("12px");
    expect(container.querySelector("[role=img]")?.getAttribute("aria-label")).toBe("Slack");
    rerender(<SourceIcon kind="document" brand="github" size={12} tile={false} />);
    expect(container.querySelector("img.ts-brand-d")).toBeTruthy();
    rerender(<SourceIcon kind="document" brand="photoshop" size={12} tile={false} />);
    expect(container.querySelector("img")).toBeNull();
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

describe("SourceIcon theme swap scope", () => {
  it("only a logo with a dark variant takes part in the swap", () => {
    const { container } = render(<><SourceIcon kind="document" brand="github" tile={false} /><SourceIcon kind="message" brand="slack" tile={false} /></>);
    const spans = container.querySelectorAll(".ts-brand");
    expect(spans[0].classList.contains("ts-brand-swap")).toBe(true);
    expect(spans[1].classList.contains("ts-brand-swap")).toBe(false);
  });
});
