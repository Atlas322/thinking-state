/**
 * Demo props for hosts (2026-11-17, screens.14): one props object per component, named
 * `<camelName>Demo`, so a page can mount a live component with no data of its own:
 *   <ApprovalCard {...approvalCardDemo} />
 * ac.me data, made up; copy without possessive pronouns. Exported from the studio entry
 * (@inai/thinking-state/studio) because the company demos carry fixture data, which the main
 * entry must not ship. Where a component's own defaults are already an ac.me-neutral demo, the
 * object only sets the title or task, so the page shows the same story as the catalog.
 */
import type * as React from "react";
import type { ComponentProps } from "react";
import { acmeGroup } from "../company/acme-group";
import type { Collection } from "../company/types";
import type { DataTable } from "../library/data-table";
import type { KPIChart } from "../library/kpi-chart";
import type { CostWaterfall } from "../library/cost-waterfall";
import type { BreakdownChart } from "../library/breakdown-chart";
import type { ProgressTracker } from "../library/progress-tracker";
import type { ApprovalGates } from "../library/approval-gates";
import type { FallbackChain } from "../library/fallback-chain";
import type { AgentQueue } from "../library/agent-queue";
import type { AutonomyDial } from "../library/autonomy-dial";
import type { RunningNow } from "../library/running-now";
import type { MemoryPanel } from "../library/memory-panel";
import type { CollectionPanel } from "../company/company-view";
import type { CompanyMini } from "../company/company-mini";
import type { Dashboard } from "../company/dashboard";
import type { RaciView } from "../company/raci";
import { financeReportDemo } from "../screens/finance-report";
import { askWindowDemo } from "../screens/ask-window";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type P<C extends (props: any) => React.ReactNode> = ComponentProps<C>;
const TODAY = new Date("2026-11-17T09:00:00+08:00");
const fin = financeReportDemo;
const nameOf = (id?: string) => [...acmeGroup.people, ...acmeGroup.agents].find((x) => x.id === id)?.name ?? "";
/** ac.me групп's project tasks as a collection (type, fields, items) for CompanyCollection. */
const acmeTasks: Collection = {
  type: "task",
  label: "Ажил",
  fields: ["status", "project", "owner", "due"],
  items: acmeGroup.projects.flatMap((p) =>
    (p.tasks ?? []).map((t) => ({ id: `${p.id}-${t.id}`, title: t.title, props: { status: t.status, project: p.name, owner: nameOf(t.ownerId), due: t.due ?? null } })),
  ),
};
const acmeCollections: Collection[] = [acmeTasks];

// ── Шийдвэр ба батлалт (ac.me Retail) ──
export const approvalGatesDemo: P<typeof ApprovalGates> = { task: "ac.me Retail · үнийн шинэчлэлийн мэдэгдэл харилцагчдад илгээх" };
export const autonomyDialDemo: P<typeof AutonomyDial> = {};

// ── Тооцоо ба тайлан (ac.me Cargo) ──
export const dataTableDemo: P<typeof DataTable> = {
  title: "Ашиг, алдагдлын тайлан · 10-р сар, сая ₮",
  columns: [
    { key: "line", label: "Мөр", type: "title" },
    { key: "now", label: "10-р сар", type: "number" },
    { key: "prev", label: "Өмнөх сар", type: "number" },
    { key: "cite", label: "Эх", type: "tag" },
  ],
  rows: fin.pnl.map((l) => ({ id: l.id, line: l.line, now: l.now, prev: l.prev, cite: l.cite })),
  tagTones: Object.fromEntries(fin.pnl.map((l) => [l.cite, "blue" as const])),
  editable: false,
};
export const kPIChartDemo: P<typeof KPIChart> = {
  title: "Мөнгөн урсгал · ac.me Cargo",
  value: fin.cash.value,
  delta: fin.cash.delta,
  labels: fin.cash.labels,
  tooltipLabels: fin.cash.labels.map((l) => `${l} сар`),
  series: fin.cash.series,
  footer: "Орох ба гарах мөнгө, сүүлийн 6 сар, сая ₮",
};
/** Same object under the name a host derives from the slug «kpi-chart». */
export const kpiChartDemo = kPIChartDemo;
export const costWaterfallDemo: P<typeof CostWaterfall> = {
  title: "Агент тайланг хэрхэн бэлдсэн",
  task: `ac.me Cargo · санхүүгийн тайлан · ${fin.period}`,
  steps: fin.steps,
  status: "done",
  defaultCollapsed: [],
  formatCost: (n: number) => `${new Intl.NumberFormat("en-US").format(n).replace(/,/g, " ")} ₮`,
};
export const breakdownChartDemo: P<typeof BreakdownChart> = {
  title: "Зардлын бүтэц · ac.me Cargo",
  records: fin.pnl.filter((l) => !l.total && l.now < 0).map((l) => ({ line: l.line, month: "10-р сар", amount: -l.now })),
  dimensions: [{ key: "line", label: "Зардал", values: fin.pnl.filter((l) => !l.total && l.now < 0).map((l) => l.line) }, { key: "month", label: "Сар", values: ["10-р сар"] }],
  measures: [{ key: "amount", label: "Дүн", unit: "сая ₮", field: "amount" }],
};

// ── Агент ба ажлын урсгал (ac.me) ──
export const progressTrackerDemo: P<typeof ProgressTracker> = {
  title: "ac.me Retail · шинэ салбарын нээлт",
  steps: [
    { id: "lease", label: "Түрээсийн гэрээ байгуулсан", done: true },
    { id: "staff", label: "4 ажилтан сонгосон", done: true },
    { id: "stock", label: "Анхны нөөц захиалсан", done: true },
    { id: "pos", label: "Кассын систем суулгах" },
    { id: "open", label: "Нээлтийн өдрийн мэдэгдэл" },
  ],
};
export const fallbackChainDemo: P<typeof FallbackChain> = { title: "ac.me Cargo · ачааны байршлын мэдээлэл", route: "GPS → тээвэрлэгчийн систем → жолоочид асуух" };
export const agentQueueDemo: P<typeof AgentQueue> = {};
export const runningNowDemo: P<typeof RunningNow> = {};
export const memoryPanelDemo: P<typeof MemoryPanel> = {};

// ── Компани (ac.me групп) ──
export const companyCollectionDemo: P<typeof CollectionPanel> = {
  collection: acmeCollections[0],
  siblings: acmeCollections,
  today: TODAY,
};
export const companyMiniDemo: P<typeof CompanyMini> = { company: acmeGroup, today: TODAY };
export const dashboardDemo: P<typeof Dashboard> = { c: acmeGroup, scoped: acmeGroup, today: TODAY, empty: "Энэ шүүлтүүрт ажил алга" };
export const raciDemo: P<typeof RaciView> = { c: acmeGroup, scoped: acmeGroup, onPerson: () => {}, empty: "RACI тохируулаагүй байна" };
export { roleDashboardDemo } from "../company/role-dashboard-demo";
export { askWindowDemo };
export { entityMentionDemo } from "../library/entity-mention";
export { askWindowMentionsDemo } from "../screens/ask-demo-data";
export { secondBrainAppDemo } from "../screens/second-brain-app";
export { decisionInboxDemo } from "../library/decision-inbox";
export { brainCoverDemo } from "../motion/brain-cover";
export { approvalCardDemo } from "../library/approval-card";
export { agentPlanDemo } from "../library/agent-plan";
export { agentHandoffDemo } from "../library/agent-handoff";
export { agentFleetDemo } from "../library/agent-fleet";
export { integrationPickerDemo } from "../library/integration-picker";
export { citedAnswerDemo, sourcePreviewDemo, thinkingStateDemo } from "../screens/ask-demo-data";
export { ceoDailyDemo, ceoDailyLogisticsDemo, appShellDemo, appShellLogisticsDemo, ceoDailyScreenDemo } from "../screens/ceo-daily";
export { buildWizardDemo } from "../screens/build-wizard";
export { convergeNetDemo, convergeNetStagesDemo, convergeNetGraphDemo } from "../motion/converge-net";
export { contentPipelineDemo } from "../screens/content-pipeline";
