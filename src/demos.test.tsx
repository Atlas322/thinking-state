// @vitest-environment jsdom
// Every host demo mounts its component with no other data (page-builder contract: <Name {...nameDemo} />).
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import * as React from "react";
import * as studio from "./lib/studio";
import { CollectionPanel } from "./company/company-view";
import { CompanyMini } from "./company/company-mini";
import { Dashboard } from "./company/dashboard";
import { RaciView } from "./company/raci";
import { RoleDashboard } from "./company/role-dashboard";
import { AskWindow } from "./screens/ask-window";

beforeAll(() => {
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
  Object.defineProperty(window, "matchMedia", { writable: true, value: (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }) });
  HTMLElement.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);
vi.setConfig({ testTimeout: 30_000 });

const S = studio as unknown as Record<string, unknown>;
// slug → [component, demo export name]
const CASES: [string, React.ComponentType<never>, string][] = [
  ["company-collection", CollectionPanel as never, "companyCollectionDemo"],
  ["company-mini", CompanyMini as never, "companyMiniDemo"],
  ["dashboard", Dashboard as never, "dashboardDemo"],
  ["raci", RaciView as never, "raciDemo"],
  ["role-dashboard", RoleDashboard as never, "roleDashboardDemo"],
  ["ask-window", AskWindow as never, "askWindowDemo"],
  ...(["agent-handoff:AgentHandoff", "agent-plan:AgentPlan", "progress-tracker:ProgressTracker", "agent-queue:AgentQueue", "autonomy-dial:AutonomyDial", "fallback-chain:FallbackChain", "approval-card:ApprovalCard", "approval-gates:ApprovalGates", "decision-inbox:DecisionInbox", "breakdown-chart:BreakdownChart", "cost-waterfall:CostWaterfall", "data-table:DataTable", "kpi-chart:KPIChart", "running-now:RunningNow", "cited-answer:CitedAnswer", "memory-panel:MemoryPanel"].map((x) => {
    const [slug, name] = x.split(":");
    return [slug, S[name] as React.ComponentType<never>, name[0].toLowerCase() + name.slice(1) + "Demo"] as [string, React.ComponentType<never>, string];
  })),
];

describe("host demos (<camelName>Demo)", () => {
  it("there are 22, one per requested slug", () => expect(CASES.length).toBe(22));
  for (const [slug, C, demo] of CASES)
    it(`${slug}: ${demo} mounts its component`, () => {
      expect(S[demo], `${demo} is exported from the studio entry`).toBeTruthy();
      expect(C, slug).toBeTruthy();
      const { container } = render(React.createElement(C, S[demo] as never));
      expect(container.textContent?.length ?? 0).toBeGreaterThan(10);
    });
  it("demo copy has no second-person address", () => {
    const text = JSON.stringify(CASES.map(([, , d]) => S[d]), (_k, v) => (typeof v === "function" ? undefined : v));
    expect(text).not.toMatch(/(^|[^А-Яа-яӨөҮү])(та|танай|таны|танд)([^А-Яа-яӨөҮү]|$)/i);
  });
});
