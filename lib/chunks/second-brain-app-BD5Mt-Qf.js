import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { A as AppShell } from "./app-shell-PtI0jYWr.js";
const AppScreenView = React.lazy(() => Promise.all([import("./app-screens-suL3S4BR.js"), import("./acme-C9Tp6pNJ.js")]).then(([m, a]) => ({ default: (p) => /* @__PURE__ */ jsx(m.AppScreen, { ...p, data: a.acmeDemo }) })));
const OverviewView = React.lazy(() => import("./ceo-daily-DmahpCHM.js").then((m) => ({ default: (p) => /* @__PURE__ */ jsx(m.CeoDailyScreen, { shell: p.shell, daily: m.ceoDailyDemo }) })));
const AreaView = React.lazy(() => import("./finance-report-CtTpO078.js").then((n) => n.a).then((m) => ({ default: () => /* @__PURE__ */ jsx(m.FinanceReport, { ...m.financeReportDemo }) })));
const CalendarView = React.lazy(() => import("./ceo-daily-DmahpCHM.js").then((m) => ({ default: () => /* @__PURE__ */ jsxs("section", { className: "sba-cal", "aria-label": "Өнөөдрийн хуваарь", children: [
  /* @__PURE__ */ jsx("style", { children: CAL_CSS }),
  /* @__PURE__ */ jsx("h2", { children: "Өнөөдөр" }),
  /* @__PURE__ */ jsx("p", { children: "ac.me · Лхагва, 11-р сарын 18" }),
  /* @__PURE__ */ jsx("ol", { children: m.ceoDailyDemo.day.map((d) => /* @__PURE__ */ jsxs("li", { "data-kind": d.kind, children: [
    /* @__PURE__ */ jsx("time", { children: d.time }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("b", { children: d.title }),
      d.meta && /* @__PURE__ */ jsx("small", { children: d.meta })
    ] })
  ] }, d.id)) })
] }) })));
const WaitingView = React.lazy(() => import("./decision-inbox-DAd_VZ99.js").then((m) => ({ default: () => /* @__PURE__ */ jsx(m.DecisionInbox, { ...m.decisionInboxDemo }) })));
const APP_VIEWS = ["overview", "inbox", "waiting", "project", "area", "resource", "agents", "calendar", "ask"];
const TO_SHELL = { overview: "ceo", inbox: "inbox", waiting: "waiting", project: "projects", area: "areas", resource: "resources", agents: "agents", calendar: "calendar", ask: "ask" };
const FROM_SHELL = { ceo: "overview", inbox: "inbox", today: "overview", waiting: "waiting", projects: "project", areas: "area", resources: "resource", archive: "resource", agents: "agents", calendar: "calendar", ask: "ask" };
const SCREEN = { inbox: "inbox", project: "project", resource: "note", agents: "team", ask: "chat" };
const FROM_SCREEN = { inbox: "inbox", project: "project", note: "resource", memory: "resource", team: "agents", chat: "ask" };
const company = { name: "ac.me", note: "Тархи · демо" };
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
function SecondBrainApp({ view: viewProp = "overview", onViewChange, still = false, height = 640, className = "" }) {
  const [own, setOwn] = React.useState(viewProp);
  React.useEffect(() => setOwn(viewProp), [viewProp]);
  const view = onViewChange ? viewProp : own;
  const go = (v) => onViewChange ? onViewChange(v) : setOwn(v);
  const fromShell = (v) => {
    const id = FROM_SHELL[v];
    if (id) go(id);
  };
  const shell = { company, counts, height, className, onNavigate: fromShell, onAsk: () => go("ask") };
  const screen = SCREEN[view];
  if (screen) {
    return /* @__PURE__ */ jsx("div", { style: { height: height + 38 }, "data-view": view, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(AppShell, { ...shell, active: TO_SHELL[view] }), children: /* @__PURE__ */ jsx(AppScreenView, { screen, still, onSelect: (k) => go(FROM_SCREEN[k]), shell: { ...shell, active: TO_SHELL[view] } }) }) });
  }
  if (view === "overview") return /* @__PURE__ */ jsx("div", { "data-view": view, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(AppShell, { ...shell, active: "ceo" }), children: /* @__PURE__ */ jsx(OverviewView, { shell: { ...shell, active: "ceo" } }) }) });
  return /* @__PURE__ */ jsx("div", { "data-view": view, children: /* @__PURE__ */ jsxs(AppShell, { ...shell, active: TO_SHELL[view], children: [
    /* @__PURE__ */ jsxs(React.Suspense, { fallback: null, children: [
      view === "waiting" && /* @__PURE__ */ jsx(WaitingView, {}),
      view === "area" && /* @__PURE__ */ jsx(AreaView, {})
    ] }),
    view === "calendar" && /* @__PURE__ */ jsx(React.Suspense, { fallback: null, children: /* @__PURE__ */ jsx(CalendarView, {}) })
  ] }) });
}
const secondBrainAppDemo = { view: "project" };
export {
  APP_VIEWS as A,
  SecondBrainApp as S,
  secondBrainAppDemo as s
};
//# sourceMappingURL=second-brain-app-BD5Mt-Qf.js.map
