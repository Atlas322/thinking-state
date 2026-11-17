// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { OverviewBoard, overviewBoardAreaDemo, overviewBoardProjectDemo, overviewBoardMarketingDemo, overviewBoardLogisticsDemo } from "./library/overview-board";
import { SecondBrainApp } from "./screens/second-brain-app";
import { financeReportDemo } from "./screens/finance-report";

afterEach(cleanup);
vi.setConfig({ testTimeout: 30_000 });

const demos = { area: overviewBoardAreaDemo, project: overviewBoardProjectDemo, marketing: overviewBoardMarketingDemo, logistics: overviewBoardLogisticsDemo };

describe("OverviewBoard (screens.22)", () => {
  it.each(Object.entries(demos))("%s: one sentence, at most two actions, four numbers, two lists", (_, d) => {
    const { container } = render(<OverviewBoard {...d} still />);
    expect(container.querySelectorAll(".ob-lede")).toHaveLength(1);
    expect(container.querySelectorAll(".ob-btn").length).toBeLessThanOrEqual(2);
    expect(container.querySelectorAll(".ob-kpi")).toHaveLength(4);
    expect(container.querySelectorAll(".ob-list")).toHaveLength(2);
    expect(d.eyebrow).toMatch(/демо/);
  });
  it("the status bar is told in words and numbers, and each state has its own shape", () => {
    const { container } = render(<OverviewBoard {...overviewBoardLogisticsDemo} still />);
    const legend = [...container.querySelectorAll(".ob-legend li")];
    expect(legend.map((li) => li.textContent)).toEqual(["6 Дууссан", "2 Явж байна", "1 Таныг хүлээж байна", "1 Саатсан", "1 Эхлээгүй"]);
    expect(new Set(legend.map((li) => li.querySelector(".ob-mark")?.getAttribute("data-shape"))).size).toBe(5);
    expect(container.querySelector(".ob-h small")?.textContent).toBe("нийт 11");
  });
  it("the timeline is a list first: every row names its owner, dates and state as text", () => {
    const { container } = render(<OverviewBoard {...overviewBoardProjectDemo} still />);
    const rows = [...container.querySelectorAll(".ob-tl-row")];
    expect(rows).toHaveLength(5);
    expect(rows[2].textContent).toContain("Гурван түвшний хүснэгтийн ноорог");
    expect(rows[2].textContent).toContain("Үнийн агент · 11/12 – 11/19 · Явж байна");
    for (const r of rows) expect(r.querySelector(".ob-tl-track")?.getAttribute("aria-hidden")).toBe("true");
    for (const r of overviewBoardProjectDemo.timeline!.rows) expect(r.end).toBeLessThanOrEqual(overviewBoardProjectDemo.timeline!.ticks.length);
  });
  it("the status counts add up to what the sentence and the numbers say", () => {
    const sum = (d: typeof overviewBoardProjectDemo) => d.status!.reduce((n, s) => n + s.value, 0);
    expect(sum(overviewBoardProjectDemo)).toBe(9);
    expect(overviewBoardProjectDemo.kpis![0].value).toBe("5/9");
    expect(sum(overviewBoardLogisticsDemo)).toBe(11);
    expect(sum(overviewBoardMarketingDemo)).toBe(12);
  });
  it("the finance area board shows the same four numbers as the monthly report", () => {
    expect(overviewBoardAreaDemo.kpis!.map((k) => [k.label, k.value])).toEqual(financeReportDemo.kpis.map((k) => [k.label, k.value]));
  });
});

describe("SecondBrainApp · Тойм tabs (screens.22)", () => {
  it("project opens on the board and the second tab shows the tasks, in the one shell", async () => {
    const { container } = render(<SecondBrainApp view="project" still />);
    expect(await screen.findByRole("heading", { name: "Үнийн шинэчлэл", level: 2 })).toBeTruthy();
    expect(container.querySelector("[data-view]")?.getAttribute("data-tab")).toBe("overview");
    fireEvent.click(screen.getByRole("tab", { name: "Ажил" }));
    expect(await screen.findByRole("heading", { name: "Үнийн шинэчлэл", level: 1 })).toBeTruthy();
    expect(container.querySelectorAll(".ash-win")).toHaveLength(1);
    expect(screen.getByRole("tab", { name: "Ажил" }).getAttribute("aria-selected")).toBe("true");
  });
  it("area opens on the board; its primary action opens the monthly report", async () => {
    const { container } = render(<SecondBrainApp view="area" still />);
    fireEvent.click(await screen.findByRole("button", { name: "Сарын тайлан" }));
    expect(screen.getByRole("tab", { name: "Сарын тайлан" }).getAttribute("aria-selected")).toBe("true");
    await waitFor(() => expect(container.querySelector(".fr")).toBeTruthy(), { timeout: 15000 });
  });
  it("tab=detail opens the working view directly", async () => {
    const { container } = render(<SecondBrainApp view="area" tab="detail" still />);
    expect(container.querySelector("[data-view]")?.getAttribute("data-tab")).toBe("detail");
    await waitFor(() => expect(container.querySelector(".fr")).toBeTruthy(), { timeout: 15000 });
  });
});
