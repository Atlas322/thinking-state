// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SecondBrainApp, APP_VIEWS } from "./screens/second-brain-app";

afterEach(cleanup);
vi.setConfig({ testTimeout: 30_000 });

describe("SecondBrainApp — one app, many angles (screens.21)", () => {
  it.each(APP_VIEWS)("view=%s opens in the one AppShell with its menu place current", async (v) => {
    const { container } = render(<SecondBrainApp view={v} still />);
    expect(await screen.findAllByRole("navigation", { name: "Апп-ын цэс" })).toHaveLength(1);
    expect(container.querySelectorAll(".ash-win")).toHaveLength(1);
    expect(container.querySelector("[data-view]")?.getAttribute("data-view")).toBe(v);
  });
  it("a visitor clicks through the menu and ⌘K", async () => {
    const { container } = render(<SecondBrainApp view="project" still />);
    fireEvent.click(await screen.findByRole("button", { name: /Хүлээгдэж буй/ }));
    expect(container.querySelector("[data-view]")?.getAttribute("data-view")).toBe("waiting");
    fireEvent.click(screen.getByRole("button", { name: /Тархинаасаа асуу/ }));
    expect(container.querySelector("[data-view]")?.getAttribute("data-view")).toBe("ask");
  });
});
