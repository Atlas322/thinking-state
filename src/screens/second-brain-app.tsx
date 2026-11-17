/**
 * SecondBrainApp (2026-11-17, screens.21): the whole Second Brain app as one live demo — the one
 * AppShell (CONTEXT v15) with a real view behind every menu place. The home shows it from many
 * angles: `<SecondBrainApp view="project" />`, `view="waiting"` … and a visitor can click through.
 *
 * Views (menu id → what it shows):
 *   overview  → CEO daily (Удирдлагын тойм)        inbox    → Inbox (AppScreen)
 *   waiting   → decisions waiting for a person      project  → a project (AppScreen)
 *   area      → the finance area's monthly report   resource → a note in Нөөц (AppScreen)
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
    <ol>{m.ceoDailyDemo.day.map((d) => <li key={d.id} data-kind={d.kind}><time>{d.time}</time><div><b>{d.title}</b>{d.meta && <small>{d.meta}</small>}</div></li>)}</ol>
  </section>
) })));
const WaitingView = React.lazy(() => import("../library/decision-inbox").then((m) => ({ default: () => <m.DecisionInbox {...m.decisionInboxDemo} /> })));

export type AppViewId = "overview" | "inbox" | "waiting" | "project" | "area" | "resource" | "agents" | "calendar" | "ask";
export const APP_VIEWS: AppViewId[] = ["overview", "inbox", "waiting", "project", "area", "resource", "agents", "calendar", "ask"];

const TO_SHELL: Record<AppViewId, AppShellView> = { overview: "ceo", inbox: "inbox", waiting: "waiting", project: "projects", area: "areas", resource: "resources", agents: "agents", calendar: "calendar", ask: "ask" };
const FROM_SHELL: Partial<Record<AppShellView, AppViewId>> = { ceo: "overview", inbox: "inbox", today: "overview", waiting: "waiting", projects: "project", areas: "area", resources: "resource", archive: "resource", agents: "agents", calendar: "calendar", ask: "ask" };
const SCREEN: Partial<Record<AppViewId, ScreenKey>> = { inbox: "inbox", project: "project", resource: "note", agents: "team", ask: "chat" };
const FROM_SCREEN: Record<ScreenKey, AppViewId> = { inbox: "inbox", project: "project", note: "resource", memory: "resource", team: "agents", chat: "ask" };

export type SecondBrainAppProps = {
  /** The place to open on (default "overview"). */
  view?: AppViewId;
  /** Called when the visitor moves to another place; without it the app keeps its own state. */
  onViewChange?: (view: AppViewId) => void;
  /** Stop the views' own motion (screenshots, reduced motion). */
  still?: boolean;
  /** Body height in px (default 640). */
  height?: number;
  className?: string;
};

const company: AppShellProps["company"] = { name: "ac.me", note: "Тархи · демо" };
const counts = { inbox: 5, waiting: 3, projects: 4 };

const CAL_CSS = `
.sba-cal h2{margin:0 0 4px;font:600 20px/1.2 var(--ts-font-head,var(--ts-font))}.sba-cal p{margin:0 0 16px;font-size:13px;color:var(--ts-faint)}
.sba-cal ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.sba-cal li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:12px;align-items:start}
.sba-cal time{font:500 12px/1.6 var(--ts-font-mono);color:var(--ts-faint)}
.sba-cal div{padding:10px 12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-control,8px);background:var(--ts-surface)}
.sba-cal b{display:block;font-size:13.5px;font-weight:500}.sba-cal small{font-size:12px;color:var(--ts-faint)}
.sba-cal li[data-kind=meeting] div{border-left:3px solid var(--ts-electric)}
`;

export function SecondBrainApp({ view: viewProp = "overview", onViewChange, still = false, height = 640, className = "" }: SecondBrainAppProps) {
  const [own, setOwn] = React.useState<AppViewId>(viewProp);
  React.useEffect(() => setOwn(viewProp), [viewProp]);
  const view = onViewChange ? viewProp : own;
  const go = (v: AppViewId) => (onViewChange ? onViewChange(v) : setOwn(v));
  const fromShell = (v: AppShellView) => { const id = FROM_SHELL[v]; if (id) go(id); };
  const shell = { company, counts, height, className, onNavigate: fromShell, onAsk: () => go("ask") } satisfies Partial<AppShellProps>;

  const screen = SCREEN[view];
  if (screen) {
    return (
      <div style={{ height: height + 38 }} data-view={view}>
        <React.Suspense fallback={<AppShell {...shell} active={TO_SHELL[view]} />}><AppScreenView screen={screen} still={still} onSelect={(k) => go(FROM_SCREEN[k])} shell={{ ...shell, active: TO_SHELL[view] }} /></React.Suspense>
      </div>
    );
  }
  if (view === "overview") return <div data-view={view}><React.Suspense fallback={<AppShell {...shell} active="ceo" />}><OverviewView shell={{ ...shell, active: "ceo" }} /></React.Suspense></div>;
  return (
    <div data-view={view}>
      <AppShell {...shell} active={TO_SHELL[view]}>
        <React.Suspense fallback={null}>
          {view === "waiting" && <WaitingView />}
          {view === "area" && <AreaView />}
        </React.Suspense>
        {view === "calendar" && <React.Suspense fallback={null}><CalendarView /></React.Suspense>}
      </AppShell>
    </div>
  );
}

/** Opens on the project view; the visitor can click through every place. */
export const secondBrainAppDemo: SecondBrainAppProps = { view: "project" };

export default SecondBrainApp;
