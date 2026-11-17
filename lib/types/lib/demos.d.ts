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
import type { ApprovalCard } from "../library/approval-card";
import type { DataTable } from "../library/data-table";
import type { KPIChart } from "../library/kpi-chart";
import type { CostWaterfall } from "../library/cost-waterfall";
import type { DecisionInbox } from "../library/decision-inbox";
import type { BreakdownChart } from "../library/breakdown-chart";
import type { ProgressTracker } from "../library/progress-tracker";
import type { AgentPlan } from "../library/agent-plan";
import type { ApprovalGates } from "../library/approval-gates";
import type { FallbackChain } from "../library/fallback-chain";
import type { AgentHandoff } from "../library/agent-handoff";
import type { AgentQueue } from "../library/agent-queue";
import type { AutonomyDial } from "../library/autonomy-dial";
import type { RunningNow } from "../library/running-now";
import type { MemoryPanel } from "../library/memory-panel";
import type { CollectionPanel } from "../company/company-view";
import type { CompanyMini } from "../company/company-mini";
import type { Dashboard } from "../company/dashboard";
import type { RaciView } from "../company/raci";
import { askWindowDemo } from "../screens/ask-window";
type P<C extends (props: any) => React.ReactNode> = ComponentProps<C>;
export declare const approvalCardDemo: P<typeof ApprovalCard>;
export declare const decisionInboxDemo: P<typeof DecisionInbox>;
export declare const approvalGatesDemo: P<typeof ApprovalGates>;
export declare const autonomyDialDemo: P<typeof AutonomyDial>;
export declare const dataTableDemo: P<typeof DataTable>;
export declare const kPIChartDemo: P<typeof KPIChart>;
/** Same object under the name a host derives from the slug «kpi-chart». */
export declare const kpiChartDemo: import("./studio").KPIChartProps;
export declare const costWaterfallDemo: P<typeof CostWaterfall>;
export declare const breakdownChartDemo: P<typeof BreakdownChart>;
export declare const progressTrackerDemo: P<typeof ProgressTracker>;
export declare const agentPlanDemo: P<typeof AgentPlan>;
export declare const fallbackChainDemo: P<typeof FallbackChain>;
export declare const agentHandoffDemo: P<typeof AgentHandoff>;
export declare const agentQueueDemo: P<typeof AgentQueue>;
export declare const runningNowDemo: P<typeof RunningNow>;
export declare const memoryPanelDemo: P<typeof MemoryPanel>;
export declare const companyCollectionDemo: P<typeof CollectionPanel>;
export declare const companyMiniDemo: P<typeof CompanyMini>;
export declare const dashboardDemo: P<typeof Dashboard>;
export declare const raciDemo: P<typeof RaciView>;
export { roleDashboardDemo } from "../company/role-dashboard-demo";
export { askWindowDemo };
export { citedAnswerDemo, sourcePreviewDemo, thinkingStateDemo } from "../screens/ask-demo-data";
export { ceoDailyDemo, ceoDailyLogisticsDemo, appShellDemo, appShellLogisticsDemo, ceoDailyScreenDemo } from "../screens/ceo-daily";
export { buildWizardDemo } from "../screens/build-wizard";
export { convergeNetDemo, convergeNetStagesDemo, convergeNetGraphDemo } from "../motion/converge-net";
export { contentPipelineDemo } from "../screens/content-pipeline";
