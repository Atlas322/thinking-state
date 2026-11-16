// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { FinanceReport, financeReportDemo } from "./screens/finance-report";

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});
afterEach(cleanup);
// Renders six library components at once; the first render (module transform) can pass 5 s.
vi.setConfig({ testTimeout: 30_000 });

describe("FinanceReport", () => {
  it("shows the P&L, cash flow, the variance with numbered sources and the human sign-off", () => {
    render(<FinanceReport />);
    expect(screen.getByRole("heading", { name: /Санхүүгийн тайлан · 2026 оны 10-р сар/ })).toBeTruthy();
    expect(screen.getByText("Ашиг, алдагдлын тайлан")).toBeTruthy();
    expect(screen.getByText("Засвар үйлчилгээ")).toBeTruthy();
    expect(screen.getByText("Мөнгөн урсгал · үлдэгдэл")).toBeTruthy();
    expect(screen.getByText(/их засвар зардлыг 42 саяар/)).toBeTruthy();
    expect(screen.getByText("10-р сарын тайланг батлах")).toBeTruthy();
    expect(screen.getByText(/Агент бэлдсэн — менежер батална/)).toBeTruthy();
  });
  it("every P&L line and every variance sentence cites a source that exists", () => {
    const ids = new Set(financeReportDemo.sources.map((s) => s.id));
    for (const l of financeReportDemo.pnl) expect(ids.has(l.cite.replace(/\D/g, "")), l.line).toBe(true);
    for (const s of financeReportDemo.variance) for (const c of s.cite ?? []) expect(ids.has(c), s.text).toBe(true);
  });
  it("the P&L adds up: net = revenue + costs, both months", () => {
    const net = financeReportDemo.pnl.find((l) => l.total)!;
    const lines = financeReportDemo.pnl.filter((l) => !l.total);
    expect(lines.reduce((a, l) => a + l.now, 0)).toBe(net.now);
    expect(lines.reduce((a, l) => a + l.prev, 0)).toBe(net.prev);
  });
  it("no second-person address and no mixed-script words in the demo copy", () => {
    const text = JSON.stringify(financeReportDemo);
    expect(text).not.toMatch(/(^|[^А-Яа-яӨөҮү])(та|танай|таны|танд)([^А-Яа-яӨөҮү]|$)/i);
    expect(text).not.toMatch(/[A-Za-z]-?[А-Яа-яӨөҮү]|[А-Яа-яӨөҮү]-?[A-Za-z]/);
  });
});
