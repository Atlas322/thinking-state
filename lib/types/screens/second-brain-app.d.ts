/**
 * SecondBrainApp (2026-11-17, screens.21): the whole Second Brain app as one live demo — the one
 * AppShell (CONTEXT v15) with a real view behind every menu place. The home shows it from many
 * angles: `<SecondBrainApp view="project" />`, `view="waiting"` … and a visitor can click through.
 *
 * Views (menu id → what it shows):
 *   overview  → CEO daily (Удирдлагын тойм)        inbox    → Inbox (AppScreen)
 *   waiting   → decisions waiting for a person      project  → a project (AppScreen)
 *   area      → the finance area's monthly report   resource → a note in Нөөц (AppScreen)
 *   project and area open on a «Тойм» tab (OverviewBoard: one sentence, four numbers, status, plan);
 *   the second tab is the working view (the project's tasks, the area's monthly report). `tab` picks it.
 *   agents    → the agents (AppScreen · Баг)         calendar → today's agenda
 *   ask       → ⌘K ask (AppScreen · Чат)
 * One company (ac.me), one menu, one view transition (AppShell). ac.me is a made-up company.
 */
import * as React from "react";
export type AppViewId = "overview" | "inbox" | "waiting" | "project" | "area" | "resource" | "agents" | "calendar" | "ask";
export declare const APP_VIEWS: AppViewId[];
export type AppTab = "overview" | "detail";
export type SecondBrainAppProps = {
    /** The place to open on (default "overview"). */
    view?: AppViewId;
    /** Called when the visitor moves to another place; without it the app keeps its own state. */
    onViewChange?: (view: AppViewId) => void;
    /** Project and area have two tabs: "overview" (the board, default) and "detail" (tasks, the monthly report). */
    tab?: AppTab;
    onTabChange?: (tab: AppTab) => void;
    /** Stop the views' own motion (screenshots, reduced motion). */
    still?: boolean;
    /** Body height in px (default 640). */
    height?: number;
    className?: string;
};
export declare function SecondBrainApp({ view: viewProp, onViewChange, tab: tabProp, onTabChange, still, height, className }: SecondBrainAppProps): React.JSX.Element;
/** Opens on the project view; the visitor can click through every place. */
export declare const secondBrainAppDemo: SecondBrainAppProps;
export default SecondBrainApp;
