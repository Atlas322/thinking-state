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
import { AppShell, type AppShellProps, type AppShellView } from "./app-shell";
import type { ScreenKey } from "./app-screens";

// Each view loads on demand, so the entry stays light: a page pays only for the view it opens.
const AppScreenView = React.lazy(() => Promise.all([import("./app-screens"), import("./acme")]).then(([m, a]) => ({ default: (p: Omit<React.ComponentProps<typeof m.AppScreen>, "data">) => <m.AppScreen {...p} data={a.acmeDemo} /> })));
const OverviewView = React.lazy(() => import("./ceo-daily").then((m) => ({ default: (p: { shell: Omit<AppShellProps, "children" | "aside"> }) => <m.CeoDailyScreen shell={p.shell} daily={m.ceoDailyDemo} /> })));
const AreaView = React.lazy(() => import("./finance-report").then((m) => ({ default: () => <m.FinanceReport {...m.financeReportDemo} /> })));
const CalendarView = React.lazy(() => import("./ceo-daily").then((m) => ({ default: () => (
  <section className="sba-cal" aria-label="Өнөөдрийн хуваарь">
    <style>{CAL_CSS}</style>
    <h2>Өнөөдөр</h2>
    <p>ac.me · Лхагва, 11-р сарын 18</p>
    <ol>{m.ceoDailyDemo.day.map((d) => <li key={d.id} data-kind={d.kind}><time dateTime={d.time}>{d.time}</time><div><b>{d.title}</b>{d.meta && <small>{d.meta}</small>}</div></li>)}</ol>
  </section>
) })));
const BoardView = React.lazy(() => import("../library/overview-board").then((m) => ({ default: (p: { kind: "area" | "project"; still?: boolean; onAsk: () => void; onPrimary: () => void }) => {
  const d = p.kind === "area" ? m.overviewBoardAreaDemo : m.overviewBoardProjectDemo;
  const [ask, primary] = d.actions ?? [];
  return <m.OverviewBoard {...d} still={p.still} actions={[{ ...ask, onClick: p.onAsk }, { ...primary, onClick: p.onPrimary }]} />;
} })));
const WaitingView = React.lazy(() => import("../library/decision-inbox").then((m) => ({ default: () => <m.DecisionInbox {...m.decisionInboxDemo} /> })));

export type AppViewId = "overview" | "inbox" | "waiting" | "project" | "area" | "resource" | "agents" | "calendar" | "ask";
export const APP_VIEWS: AppViewId[] = ["overview", "inbox", "waiting", "project", "area", "resource", "agents", "calendar", "ask"];

const TO_SHELL: Record<AppViewId, AppShellView> = { overview: "ceo", inbox: "inbox", waiting: "waiting", project: "projects", area: "areas", resource: "resources", agents: "agents", calendar: "calendar", ask: "ask" };
const FROM_SHELL: Partial<Record<AppShellView, AppViewId>> = { ceo: "overview", inbox: "inbox", today: "overview", waiting: "waiting", projects: "project", areas: "area", resources: "resource", archive: "resource", agents: "agents", calendar: "calendar", ask: "ask" };
const SCREEN: Partial<Record<AppViewId, ScreenKey>> = { inbox: "inbox", project: "project", resource: "note", agents: "team", ask: "chat" };
const FROM_SCREEN: Record<ScreenKey, AppViewId> = { inbox: "inbox", project: "project", note: "resource", memory: "resource", team: "agents", chat: "ask" };

export type AppTab = "overview" | "detail";
const TABS: Partial<Record<AppViewId, { label: string; names: Record<AppTab, string> }>> = {
  project: { label: "Төслийн харагдац", names: { overview: "Тойм", detail: "Ажил" } },
  area: { label: "Хүрээний харагдац", names: { overview: "Тойм", detail: "Сарын тайлан" } },
};

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

const company: AppShellProps["company"] = { name: "ac.me", note: "Тархи · демо" };
const counts = { inbox: 5, waiting: 3, projects: 4 };

const TAB_CSS = `
.sba-tabs{display:inline-flex;gap:2px;margin:0 0 16px;padding:2px;border-radius:var(--ts-radius-control,8px);background:var(--ts-soft)}
.sba-tabs button{min-height:32px;padding:0 14px;border:0;border-radius:6px;background:none;color:var(--ts-muted);font:500 13px/1 var(--ts-font);cursor:pointer;transition:background var(--ts-motion-dur-xs),color var(--ts-motion-dur-xs)}
.sba-tabs button:hover{color:var(--ts-fg)}
.sba-tabs button[aria-selected=true]{background:var(--ts-seg-on,var(--ts-surface));color:var(--ts-fg);box-shadow:0 0 0 1px var(--ts-line),0 1px 2px rgb(0 0 0 / .06)}
.sba-tabs button:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
@media (prefers-reduced-motion:reduce){.sba-tabs button{transition:none}}
`;

const CAL_CSS = `
.sba-cal h2{margin:0 0 4px;font:600 20px/1.2 var(--ts-font-head,var(--ts-font))}.sba-cal p{margin:0 0 16px;font-size:13px;color:var(--ts-faint)}
.sba-cal ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.sba-cal li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:12px;align-items:start}
.sba-cal time{font:500 12px/1.6 var(--ts-font-mono);color:var(--ts-faint)}
.sba-cal div{padding:10px 12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-control,8px);background:var(--ts-surface)}
.sba-cal b{display:block;font-size:13.5px;font-weight:500}.sba-cal small{font-size:12px;color:var(--ts-faint)}
.sba-cal li[data-kind=meeting] div{border-left:3px solid var(--ts-electric)}
`;

export function SecondBrainApp({ view: viewProp = "overview", onViewChange, tab: tabProp = "overview", onTabChange, still = false, height = 640, className = "" }: SecondBrainAppProps) {
  const [own, setOwn] = React.useState<AppViewId>(viewProp);
  React.useEffect(() => setOwn(viewProp), [viewProp]);
  const view = onViewChange ? viewProp : own;
  const go = (v: AppViewId) => (onViewChange ? onViewChange(v) : setOwn(v));
  const [ownTab, setOwnTab] = React.useState<AppTab>(tabProp);
  React.useEffect(() => setOwnTab(tabProp), [tabProp]);
  const tab = onTabChange ? tabProp : ownTab;
  const setTab = (t: AppTab) => (onTabChange ? onTabChange(t) : setOwnTab(t));
  const tabset = TABS[view];
  const tabs = tabset && (
    <div className="sba-tabs" role="tablist" aria-label={tabset.label}>
      <style>{TAB_CSS}</style>
      {(["overview", "detail"] as AppTab[]).map((t) => (
        <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>{tabset.names[t]}</button>
      ))}
    </div>
  );
  const board = (kind: "area" | "project") => (
    <React.Suspense fallback={null}><BoardView kind={kind} still={still} onAsk={() => go("ask")} onPrimary={() => (kind === "area" ? setTab("detail") : go("waiting"))} /></React.Suspense>
  );
  const fromShell = (v: AppShellView) => { const id = FROM_SHELL[v]; if (id) go(id); };
  const shell = { company, counts, height, className, onNavigate: fromShell, onAsk: () => go("ask") } satisfies Partial<AppShellProps>;

  const screen = SCREEN[view];
  if (view === "project" && tab === "overview") {
    return <div data-view={view} data-tab={tab}><AppShell {...shell} active="projects">{tabs}{board("project")}</AppShell></div>;
  }
  if (screen) {
    return (
      <div style={{ height: height + 38 }} data-view={view} data-tab={tabset ? tab : undefined}>
        <React.Suspense fallback={<AppShell {...shell} active={TO_SHELL[view]} />}><AppScreenView screen={screen} still={still} lead={tabs} onSelect={(k) => go(FROM_SCREEN[k])} shell={{ ...shell, active: TO_SHELL[view] }} /></React.Suspense>
      </div>
    );
  }
  if (view === "overview") return <div data-view={view}><React.Suspense fallback={<AppShell {...shell} active="ceo" />}><OverviewView shell={{ ...shell, active: "ceo" }} /></React.Suspense></div>;
  return (
    <div data-view={view} data-tab={tabset ? tab : undefined}>
      <AppShell {...shell} active={TO_SHELL[view]}>
        {view === "area" && tabs}
        <React.Suspense fallback={null}>
          {view === "waiting" && <WaitingView />}
          {view === "area" && tab === "detail" && <AreaView />}
        </React.Suspense>
        {view === "area" && tab === "overview" && board("area")}
        {view === "calendar" && <React.Suspense fallback={null}><CalendarView /></React.Suspense>}
      </AppShell>
    </div>
  );
}

/** Opens on the project view; the visitor can click through every place. */
export const secondBrainAppDemo: SecondBrainAppProps = { view: "project" };

export default SecondBrainApp;
