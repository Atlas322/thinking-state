import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { A as AppShell } from "./app-shell-C_3YLmbU.js";
const AppScreenView = React.lazy(() => Promise.all([import("./app-screens-4J_A8PaS.js"), import("./acme-C9Tp6pNJ.js")]).then(([m, a]) => ({ default: (p) => /* @__PURE__ */ jsx(m.AppScreen, { ...p, data: a.acmeDemo }) })));
const OverviewView = React.lazy(() => import("./ceo-daily-D_nptSDa.js").then((m) => ({ default: (p) => /* @__PURE__ */ jsx(m.CeoDailyScreen, { shell: p.shell, daily: m.ceoDailyDemo }) })));
const AreaView = React.lazy(() => import("./finance-report-D1-QQdVK.js").then((n) => n.a).then((m) => ({ default: () => /* @__PURE__ */ jsx(m.FinanceReport, { ...m.financeReportDemo }) })));
const CalendarView = React.lazy(() => import("./ceo-daily-D_nptSDa.js").then((m) => ({ default: () => /* @__PURE__ */ jsxs("section", { className: "sba-cal", "aria-label": "Өнөөдрийн хуваарь", children: [
  /* @__PURE__ */ jsx("style", { children: CAL_CSS }),
  /* @__PURE__ */ jsx("h2", { children: "Өнөөдөр" }),
  /* @__PURE__ */ jsx("p", { children: "ac.me · Лхагва, 11-р сарын 18" }),
  /* @__PURE__ */ jsx("ol", { children: m.ceoDailyDemo.day.map((d) => /* @__PURE__ */ jsxs("li", { "data-kind": d.kind, children: [
    /* @__PURE__ */ jsx("time", { dateTime: d.time, children: d.time }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("b", { children: d.title }),
      d.meta && /* @__PURE__ */ jsx("small", { children: d.meta })
    ] })
  ] }, d.id)) })
] }) })));
const BoardView = React.lazy(() => import("./overview-board-r7y15kh6.js").then((m) => ({ default: (p) => {
  const d = p.kind === "area" ? m.overviewBoardAreaDemo : m.overviewBoardProjectDemo;
  const [ask, primary] = d.actions ?? [];
  return /* @__PURE__ */ jsx(m.OverviewBoard, { ...d, still: p.still, actions: [{ ...ask, onClick: p.onAsk }, { ...primary, onClick: p.onPrimary }] });
} })));
const WaitingView = React.lazy(() => import("./decision-inbox-DAd_VZ99.js").then((m) => ({ default: () => /* @__PURE__ */ jsx(m.DecisionInbox, { ...m.decisionInboxDemo }) })));
const APP_VIEWS = ["overview", "inbox", "waiting", "project", "area", "resource", "agents", "calendar", "ask"];
const TO_SHELL = { overview: "ceo", inbox: "inbox", waiting: "waiting", project: "projects", area: "areas", resource: "resources", agents: "agents", calendar: "calendar", ask: "ask" };
const FROM_SHELL = { ceo: "overview", inbox: "inbox", today: "overview", waiting: "waiting", projects: "project", areas: "area", resources: "resource", archive: "resource", agents: "agents", calendar: "calendar", ask: "ask" };
const SCREEN = { inbox: "inbox", project: "project", resource: "note", agents: "team", ask: "chat" };
const FROM_SCREEN = { inbox: "inbox", project: "project", note: "resource", memory: "resource", team: "agents", chat: "ask" };
const TABS = {
  project: { label: "Төслийн харагдац", names: { overview: "Тойм", detail: "Ажил" } },
  area: { label: "Хүрээний харагдац", names: { overview: "Тойм", detail: "Сарын тайлан" } }
};
const company = { name: "ac.me", note: "Тархи · демо" };
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
function SecondBrainApp({ view: viewProp = "overview", onViewChange, tab: tabProp = "overview", onTabChange, still = false, height = 640, className = "" }) {
  const [own, setOwn] = React.useState(viewProp);
  React.useEffect(() => setOwn(viewProp), [viewProp]);
  const view = onViewChange ? viewProp : own;
  const go = (v) => onViewChange ? onViewChange(v) : setOwn(v);
  const [ownTab, setOwnTab] = React.useState(tabProp);
  React.useEffect(() => setOwnTab(tabProp), [tabProp]);
  const tab = onTabChange ? tabProp : ownTab;
  const setTab = (t) => onTabChange ? onTabChange(t) : setOwnTab(t);
  const tabset = TABS[view];
  const tabs = tabset && /* @__PURE__ */ jsxs("div", { className: "sba-tabs", role: "tablist", "aria-label": tabset.label, children: [
    /* @__PURE__ */ jsx("style", { children: TAB_CSS }),
    ["overview", "detail"].map((t) => /* @__PURE__ */ jsx("button", { type: "button", role: "tab", "aria-selected": tab === t, onClick: () => setTab(t), children: tabset.names[t] }, t))
  ] });
  const board = (kind) => /* @__PURE__ */ jsx(React.Suspense, { fallback: null, children: /* @__PURE__ */ jsx(BoardView, { kind, still, onAsk: () => go("ask"), onPrimary: () => kind === "area" ? setTab("detail") : go("waiting") }) });
  const fromShell = (v) => {
    const id = FROM_SHELL[v];
    if (id) go(id);
  };
  const shell = { company, counts, height, className, onNavigate: fromShell, onAsk: () => go("ask") };
  const screen = SCREEN[view];
  if (view === "project" && tab === "overview") {
    return /* @__PURE__ */ jsx("div", { "data-view": view, "data-tab": tab, children: /* @__PURE__ */ jsxs(AppShell, { ...shell, active: "projects", children: [
      tabs,
      board("project")
    ] }) });
  }
  if (screen) {
    return /* @__PURE__ */ jsx("div", { style: { height: height + 38 }, "data-view": view, "data-tab": tabset ? tab : void 0, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(AppShell, { ...shell, active: TO_SHELL[view] }), children: /* @__PURE__ */ jsx(AppScreenView, { screen, still, lead: tabs, onSelect: (k) => go(FROM_SCREEN[k]), shell: { ...shell, active: TO_SHELL[view] } }) }) });
  }
  if (view === "overview") return /* @__PURE__ */ jsx("div", { "data-view": view, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(AppShell, { ...shell, active: "ceo" }), children: /* @__PURE__ */ jsx(OverviewView, { shell: { ...shell, active: "ceo" } }) }) });
  return /* @__PURE__ */ jsx("div", { "data-view": view, "data-tab": tabset ? tab : void 0, children: /* @__PURE__ */ jsxs(AppShell, { ...shell, active: TO_SHELL[view], children: [
    view === "area" && tabs,
    /* @__PURE__ */ jsxs(React.Suspense, { fallback: null, children: [
      view === "waiting" && /* @__PURE__ */ jsx(WaitingView, {}),
      view === "area" && tab === "detail" && /* @__PURE__ */ jsx(AreaView, {})
    ] }),
    view === "area" && tab === "overview" && board("area"),
    view === "calendar" && /* @__PURE__ */ jsx(React.Suspense, { fallback: null, children: /* @__PURE__ */ jsx(CalendarView, {}) })
  ] }) });
}
const secondBrainAppDemo = { view: "project" };
export {
  APP_VIEWS as A,
  SecondBrainApp as S,
  secondBrainAppDemo as s
};
//# sourceMappingURL=second-brain-app-B71S5gAJ.js.map
