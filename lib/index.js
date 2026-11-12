import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { DecisionInboxChat } from "./chunks/decision-inbox-chat-qo4ENRbQ.js";
import { SessionBoard, toSessionState } from "./chunks/session-board-XzMujImm.js";
import { toPhaseState, ProjectReport } from "./chunks/project-report-CB_GtFpd.js";
import { createPortal } from "react-dom";
import { PrDeployStatus } from "./chunks/pr-deploy-status-Cu82Ij7x.js";
import { A as AgentTrail } from "./chunks/agent-trail-DlMWaLsH.js";
const PM_PHASES = ["initiating", "planning", "executing", "monitoring", "closing"];
const PM_AREAS = ["integration", "scope", "schedule", "cost", "quality", "resource", "communications", "risk", "procurement", "stakeholder"];
const METHODOLOGIES = ["bmc", "pmbok", "okr", "lean-canvas"];
const LEVELS = ["institution", "company", "team"];
const kindsOf = {
  institution: ["institution"],
  company: ["company"],
  team: ["team", "department", "stream"]
};
function subtreeIds(units, rootId) {
  const out = /* @__PURE__ */ new Set([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const u of units)
      if (u.parentId && out.has(u.parentId) && !out.has(u.id)) {
        out.add(u.id);
        grew = true;
      }
  }
  return out;
}
function scopeCompany(c, rootId) {
  if (!rootId || !c.units.some((u) => u.id === rootId)) return c;
  const ids = subtreeIds(c.units, rootId);
  return {
    ...c,
    units: c.units.filter((u) => ids.has(u.id)),
    people: c.people.filter((p) => ids.has(p.unitId)),
    agents: c.agents.filter((a) => ids.has(a.unitId)),
    workflows: c.workflows.filter((w) => ids.has(w.unitId)),
    projects: c.projects.filter((p) => ids.has(p.unitId)),
    okrs: c.okrs?.filter((o) => !o.ownerId || [...c.people, ...c.agents].some((x) => x.id === o.ownerId && ids.has(x.unitId))),
    notes: c.notes?.filter((n) => !n.projectId || c.projects.some((p) => p.id === n.projectId && ids.has(p.unitId)))
  };
}
function rootsOf(units) {
  const ids = new Set(units.map((u) => u.id));
  return units.filter((u) => !u.parentId || !ids.has(u.parentId));
}
function actorOf(c, id) {
  const p = c.people.find((x) => x.id === id);
  if (p) return { id: p.id, name: p.name, role: p.role, kind: "person" };
  const a = c.agents.find((x) => x.id === id);
  if (a) return { id: a.id, name: a.name, role: a.role, kind: "agent" };
  return { id: id ?? "", name: id ?? "Тодорхойгүй", role: "", kind: "unknown" };
}
function modelLines(f) {
  if (f == null) return [];
  if (typeof f === "string") return f.trim() ? [{ text: f }] : [];
  return f.map(
    (x) => typeof x === "string" ? { text: x } : { text: x.stream, share: x.share }
  );
}
function raciOf(p, id) {
  const r = p.raci;
  if (!r) return [];
  const out = [];
  if (r.responsible?.includes(id)) out.push("R");
  if (r.accountable === id) out.push("A");
  if (r.consulted?.includes(id)) out.push("C");
  if (r.informed?.includes(id)) out.push("I");
  return out;
}
function toPmPhase(v) {
  const k = (v ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (k.startsWith("init")) return "initiating";
  if (k.startsWith("plan")) return "planning";
  if (k.startsWith("exec")) return "executing";
  if (k.startsWith("monit") || k.startsWith("control")) return "monitoring";
  if (k.startsWith("clos")) return "closing";
  return null;
}
function toPmArea(v) {
  const k = (v ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (!k) return null;
  if (k.startsWith("communic")) return "communications";
  if (k.startsWith("stakeholder")) return "stakeholder";
  return PM_AREAS.find((a) => k.startsWith(a)) ?? null;
}
function taskIndex(c) {
  const out = /* @__PURE__ */ new Map();
  const add = (ref) => {
    const ids = [ref.task.id];
    if (ref.project) ids.push(`${ref.project.id}-${ref.task.id}`, `${ref.project.id}:${ref.task.id}`);
    for (const id of ids) if (!out.has(id)) out.set(id, ref);
  };
  for (const p of c.projects) for (const t of p.tasks) add({ project: p, task: t });
  for (const t of c.tasks ?? []) add({ project: c.projects.find((p) => p.id === t.projectId), task: t });
  return out;
}
function dependenciesOf(c, project, task, index = taskIndex(c)) {
  const local = (id) => project ? project.tasks.find((t) => t.id === id) : void 0;
  const waitsOn = [];
  for (const id of task.dependsOn ?? []) {
    const own = local(id);
    const ref = own ? { project, task: own } : index.get(id);
    if (ref && ref.task !== task && !waitsOn.some((w) => w.task === ref.task)) waitsOn.push(ref);
  }
  const blocks = [];
  for (const ref of new Set(index.values())) {
    if (ref.task === task) continue;
    const deps = ref.task.dependsOn ?? [];
    const hit = deps.some((d) => {
      const own = ref.project?.tasks.find((t) => t.id === d);
      return own ? own === task : index.get(d)?.task === task;
    });
    if (hit && !blocks.some((b) => b.task === ref.task)) blocks.push(ref);
  }
  return { waitsOn, blocks };
}
const initials = (name) => name.replace(/[^\p{L}\p{N}\s.]/gu, "").trim().split(/[\s.]+/).filter(Boolean).map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase() || "?";
const phaseTone = { done: "green", active: "blue", blocked: "amber", next: "gray" };
const phaseLabel = { done: "Дууссан", active: "Явж байна", blocked: "Хүлээгдэж байна", next: "Төлөвлөж буй" };
function Avatar({ actor, size = 22 }) {
  return /* @__PURE__ */ jsx("span", { className: `cv-ava is-${actor.kind}`, style: { "--s": `${size}px` }, "aria-hidden": "true", children: actor.kind === "agent" ? "✦" : initials(actor.name) });
}
function Lines({ f, empty = "Бөглөөгүй" }) {
  const lines = modelLines(f);
  if (!lines.length) return /* @__PURE__ */ jsx("p", { className: "cv-model-text cv-none", children: empty });
  if (lines.length === 1 && lines[0].share == null) return /* @__PURE__ */ jsx("p", { className: "cv-model-text", children: lines[0].text });
  return /* @__PURE__ */ jsx("ul", { className: "cv-model-list", children: lines.map((l, i) => /* @__PURE__ */ jsxs("li", { style: { "--i": i }, children: [
    /* @__PURE__ */ jsx("span", { children: l.text }),
    l.share != null && /* @__PURE__ */ jsxs("span", { className: "cv-share", children: [
      /* @__PURE__ */ jsx("span", { className: "cv-share-bar", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { style: { width: `${Math.round(Math.max(0, Math.min(1, l.share)) * 100)}%` } }) }),
      /* @__PURE__ */ jsxs("span", { className: "cv-share-n", children: [
        Math.round(l.share * 100),
        "%"
      ] })
    ] })
  ] }, l.text + i)) });
}
function CountUp({ value, ms = 900 }) {
  const target = typeof value === "number" ? value : /^\d+$/.test(value) ? Number(value) : null;
  const reduced = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = React.useState(target == null || reduced ? target : 0);
  const from = React.useRef(0);
  React.useEffect(() => {
    if (target == null || reduced || typeof requestAnimationFrame === "undefined") return setShown(target);
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      const v = Math.round(a + (target - a) * e);
      setShown(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced, ms]);
  if (target == null) return /* @__PURE__ */ jsx(Fragment, { children: value });
  return /* @__PURE__ */ jsx("span", { className: "cv-countup", "aria-label": String(target), children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: shown }) });
}
const SHAPES$1 = {
  // vault types
  folder: ["M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"],
  circle: ["c:12,12,10"],
  "circle-check": ["c:12,12,10", "m9 12 2 2 4-4"],
  "git-branch": ["M6 3v12", "c:18,6,3", "c:6,18,3", "M18 9a9 9 0 0 1-9 9"],
  atom: [
    "c:12,12,1",
    "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",
    "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"
  ],
  user: ["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "c:12,7,4"],
  users: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "c:9,7,4", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  "layout-grid": ["r:3,3,7,7,1", "r:14,3,7,7,1", "r:14,14,7,7,1", "r:3,14,7,7,1"],
  sparkles: [
    "M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z",
    "M20 3v4",
    "M22 5h-4",
    "M4 17v2",
    "M5 18H3"
  ],
  calendar: ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18"],
  "calendar-days": ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18", "M8 14h.01", "M12 14h.01", "M16 14h.01", "M8 18h.01", "M12 18h.01", "M16 18h.01"],
  sun: ["c:12,12,4", "M12 2v2", "M12 20v2", "m4.93 4.93 1.41 1.41", "m17.66 17.66 1.41 1.41", "M2 12h2", "M20 12h2", "m6.34 17.66-1.41 1.41", "m19.07 4.93-1.41 1.41"],
  "file-text": ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4", "M10 9H8", "M16 13H8", "M16 17H8"],
  pencil: ["M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z", "m15 5 4 4"],
  bookmark: ["m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"],
  "users-round": ["M18 21a8 8 0 0 0-16 0", "c:10,8,5", "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"],
  flag: ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  "circle-help": ["c:12,12,10", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"],
  "triangle-alert": ["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", "M12 9v4", "M12 17h.01"],
  "book-open": ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
  box: ["M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", "m3.3 7 8.7 5 8.7-5", "M12 22V12"],
  tag: ["M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z", "c:7.5,7.5,.5"],
  "git-commit-horizontal": ["c:12,12,3", "M3 12h6", "M15 12h6"],
  type: ["M4 7V4h16v3", "M9 20h6", "M12 4v16"],
  asterisk: ["M12 6v12", "M17.2 9 6.8 15", "m6.8 9 10.4 6"],
  "arrow-up-right": ["M7 7h10v10", "M7 17 17 7"],
  hash: ["M4 9h16", "M4 15h16", "M10 3 8 21", "M16 3l-2 18"],
  "square-check": ["r:3,3,18,18,2", "m9 12 2 2 4-4"],
  "chart-pie": ["M21 12c.55 0 1-.45.95-1A10 10 0 0 0 13 2.05c-.55-.05-1 .4-1 .95v8a1 1 0 0 0 1 1z", "M21.21 15.89A10 10 0 1 1 8 2.83"],
  "circle-dot": ["c:12,12,10", "c:12,12,1"],
  "panel-right": ["r:3,3,18,18,2", "M15 3v18"],
  "calendar-x": ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18", "m14 14-4 4", "m10 14 4 4"],
  "rotate-ccw": ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"],
  // units
  landmark: ["M3 22h18", "M6 18v-7", "M10 18v-7", "M14 18v-7", "M18 18v-7", "p:12,2 20,7 4,7"],
  "building-2": ["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", "M10 6h4", "M10 10h4", "M10 14h4", "M10 18h4"],
  briefcase: ["M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", "r:2,6,20,14,2"],
  bot: ["M12 8V4H8", "r:4,8,16,12,2", "M2 14h2", "M20 14h2", "M15 13v2", "M9 13v2"],
  // tabs
  "layout-template": ["r:3,3,18,7,1", "r:3,14,9,7,1", "r:16,14,5,7,1"],
  "layout-dashboard": ["r:3,3,7,9,1", "r:14,3,7,5,1", "r:14,12,7,9,1", "r:3,16,7,5,1"],
  network: ["r:16,16,6,6,1", "r:2,16,6,6,1", "r:9,2,6,6,1", "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", "M12 12V8"],
  workflow: ["r:3,3,8,8,2", "M7 11v4a2 2 0 0 0 2 2h4", "r:13,13,8,8,2"],
  "grid-3x3": ["r:3,3,18,18,2", "M3 9h18", "M3 15h18", "M9 3v18", "M15 3v18"],
  database: ["e:12,5,9,3", "M3 5V19A9 3 0 0 0 21 19V5", "M3 12A9 3 0 0 0 21 12"],
  // status groups
  inbox: ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"],
  play: ["p:6,3 20,12 6,21"],
  pause: ["M8 5v14", "M16 5v14"],
  "arrow-right": ["M5 12h14", "m12 5 7 7-7 7"],
  hourglass: ["M5 22h14", "M5 2h14", "M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22", "M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"],
  "message-circle": ["M7.9 20A9 9 0 1 0 4 16.1L2 22Z"],
  check: ["M20 6 9 17l-5-5"],
  x: ["M18 6 6 18", "m6 6 12 12"],
  archive: ["r:2,3,20,5,1", "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", "M10 12h4"],
  // views and actions
  table: ["M12 3v18", "r:3,3,18,18,2", "M3 9h18", "M3 15h18"],
  list: ["M3 12h.01", "M3 18h.01", "M3 6h.01", "M8 12h13", "M8 18h13", "M8 6h13"],
  kanban: ["M6 5v11", "M12 5v6", "M18 5v14"],
  "gantt-chart": ["M3 3v16a2 2 0 0 0 2 2h16", "M7 11h8", "M7 16h12", "M7 6h3"],
  "circle-user": ["c:12,12,10", "c:12,10,3", "M7 20.66V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.66"],
  "signal-high": ["M2 20h.01", "M7 20v-4", "M12 20v-8", "M17 20V8"],
  "signal-medium": ["M2 20h.01", "M7 20v-4", "M12 20v-8"],
  "signal-low": ["M2 20h.01", "M7 20v-4"],
  filter: ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  layers: [
    "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
    "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",
    "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
  ],
  link: ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
  clock: ["c:12,12,10", "M12 6v6l4 2"],
  "search-x": ["c:11,11,8", "m21 21-4.3-4.3", "m13.5 8.5-5 5", "m8.5 8.5 5 5"],
  "chevron-right": ["m9 18 6-6-6-6"],
  "chevron-left": ["m15 18-6-6 6-6"],
  // site + consent (Lucide, ISC)
  menu: ["M4 12h16", "M4 6h16", "M4 18h16"],
  "chevron-down": ["m6 9 6 6 6-6"],
  "shield-check": [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12 2 2 4-4"
  ],
  "key-round": [
    "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
    "c:16.5,7.5,.5"
  ],
  mail: ["r:2,4,20,16,2", "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"],
  search: ["c:11,11,8", "m21 21-4.3-4.3"],
  "user-check": ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "c:9,7,4", "m16 11 2 2 4-4"],
  ellipsis: ["c:12,12,1", "c:19,12,1", "c:5,12,1"]
};
function shape(s, i) {
  const [kind, rest] = s.length > 2 && s[1] === ":" ? [s[0], s.slice(2)] : ["d", s];
  if (kind === "c") {
    const [cx2, cy, r] = rest.split(",");
    return /* @__PURE__ */ jsx("circle", { cx: cx2, cy, r }, i);
  }
  if (kind === "r") {
    const [x, y, w, h, rx] = rest.split(",");
    return /* @__PURE__ */ jsx("rect", { x, y, width: w, height: h, rx }, i);
  }
  if (kind === "e") {
    const [cx2, cy, rx, ry] = rest.split(",");
    return /* @__PURE__ */ jsx("ellipse", { cx: cx2, cy, rx, ry }, i);
  }
  if (kind === "p") return /* @__PURE__ */ jsx("polygon", { points: rest }, i);
  return /* @__PURE__ */ jsx("path", { d: rest }, i);
}
const FILLED = {
  folder: () => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M2.5 6.2A2.2 2.2 0 0 1 4.7 4h3.6c.6 0 1.2.25 1.6.7l1.2 1.3h8.2a2.2 2.2 0 0 1 2.2 2.2v9.6a2.2 2.2 0 0 1-2.2 2.2H4.7a2.2 2.2 0 0 1-2.2-2.2Z",
        fill: "var(--ts-folder,#e8b931)"
      }
    ),
    /* @__PURE__ */ jsx("path", { d: "M2.5 9.2h19v8.6a2.2 2.2 0 0 1-2.2 2.2H4.7a2.2 2.2 0 0 1-2.2-2.2Z", fill: "var(--ts-folder,#e8b931)" }),
    /* @__PURE__ */ jsx("path", { d: "M2.5 9.2h19", stroke: "color-mix(in srgb,var(--ts-folder,#e8b931) 70%,#000)", strokeOpacity: ".35", strokeWidth: "1", fill: "none" })
  ] })
};
function Icon({
  name,
  size = 16,
  className = "",
  label,
  variant = "line",
  animate = false
}) {
  const filled = variant === "filled" ? FILLED[name] : void 0;
  const anim = animate ? { "data-anim": ANIM_OF[name] ?? "pop", "data-anim-on": animate === "once" ? "once" : "hover" } : void 0;
  const animStyle = animate ? /* @__PURE__ */ jsx("style", { href: "ts-icon-anim", precedence: "default", children: ICON_ANIM_CSS }) : null;
  if (filled)
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      animStyle,
      /* @__PURE__ */ jsx(
        "svg",
        {
          ...anim,
          className: `cv-icon is-filled ${className}`,
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          role: label ? "img" : void 0,
          "aria-label": label,
          "aria-hidden": label ? void 0 : true,
          focusable: "false",
          children: filled(size)
        }
      )
    ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    animStyle,
    /* @__PURE__ */ jsx(
      "svg",
      {
        ...anim,
        className: `cv-icon ${className}`,
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: size < 16 ? 1.75 : 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        role: label ? "img" : void 0,
        "aria-label": label,
        "aria-hidden": label ? void 0 : true,
        focusable: "false",
        children: SHAPES$1[name].map(shape)
      }
    )
  ] });
}
const ANIM_OF = {
  check: "draw",
  "circle-check": "draw",
  "square-check": "draw",
  "shield-check": "draw",
  "user-check": "draw",
  "arrow-right": "nudge",
  "arrow-up-right": "nudge-up",
  "chevron-right": "nudge",
  "chevron-left": "nudge",
  "chevron-down": "nudge-down",
  "rotate-ccw": "spin-back",
  sun: "spin",
  sparkles: "pop",
  atom: "spin",
  bot: "bob",
  play: "nudge",
  mail: "bob",
  "message-circle": "swing",
  "triangle-alert": "swing",
  flag: "swing",
  calendar: "swing",
  "calendar-days": "swing",
  hourglass: "spin",
  search: "swing",
  link: "swing",
  folder: "bob",
  workflow: "bob",
  "key-round": "swing"
};
const ICON_ANIM_CSS = `
@keyframes ts-ia-nudge{40%{transform:translateX(3px)}}
@keyframes ts-ia-nudge-up{40%{transform:translate(2px,-2px)}}
@keyframes ts-ia-nudge-down{40%{transform:translateY(2px)}}
@keyframes ts-ia-spin{to{transform:rotate(180deg)}}
@keyframes ts-ia-spin-back{to{transform:rotate(-360deg)}}
@keyframes ts-ia-bob{40%{transform:translateY(-2px)}}
@keyframes ts-ia-swing{25%{transform:rotate(-12deg)}75%{transform:rotate(10deg)}}
@keyframes ts-ia-pop{40%{transform:scale(1.18)}}
.cv-icon[data-anim]{transform-box:fill-box;transform-origin:center}
:is(a,button,[role=button],[role=tab],[role=radio],[role=menuitem]):is(:hover,:focus-visible) .cv-icon[data-anim-on=hover],.cv-icon[data-anim-on=hover]:hover,.cv-icon[data-anim-on=once]{animation:var(--ts-ia) var(--ts-motion-spring-soft-duration,600ms) var(--ts-motion-spring-soft,cubic-bezier(.2,.8,.3,1)) both}
.cv-icon[data-anim=draw]{--ts-ia:ts-ia-pop}
.cv-icon[data-anim=nudge]{--ts-ia:ts-ia-nudge}.cv-icon[data-anim=nudge-up]{--ts-ia:ts-ia-nudge-up}.cv-icon[data-anim=nudge-down]{--ts-ia:ts-ia-nudge-down}
.cv-icon[data-anim=spin]{--ts-ia:ts-ia-spin}.cv-icon[data-anim=spin-back]{--ts-ia:ts-ia-spin-back}
.cv-icon[data-anim=bob]{--ts-ia:ts-ia-bob}.cv-icon[data-anim=swing]{--ts-ia:ts-ia-swing}.cv-icon[data-anim=pop]{--ts-ia:ts-ia-pop}
@media (prefers-reduced-motion:reduce){.cv-icon[data-anim]{animation:none!important}}
`;
const TYPE_ICON = {
  project: "folder",
  task: "circle",
  "session-decision": "git-branch",
  decision: "git-branch",
  atomic: "atom",
  person: "user",
  area: "layout-grid",
  skill: "sparkles",
  event: "calendar",
  daily: "sun",
  note: "pencil",
  reference: "book-open",
  resource: "book-open",
  glossary: "book-open",
  agent: "bot",
  "ai-worker": "bot",
  workflow: "sparkles",
  meeting: "users-round",
  milestone: "flag",
  ask: "circle-help",
  risk: "triangle-alert",
  product: "box",
  release: "tag",
  commit: "git-commit-horizontal",
  output: "file-text",
  company: "building-2",
  inbox: "inbox"
};
const TYPE_LABEL = {
  project: "Төсөл",
  task: "Даалгавар",
  "session-decision": "Шийдвэр",
  decision: "Шийдвэр",
  atomic: "Атом",
  person: "Хүн",
  area: "Чиглэл",
  skill: "Ур чадвар",
  event: "Үйл явдал",
  daily: "Өдрийн тэмдэглэл",
  note: "Нот",
  reference: "Лавлагаа",
  resource: "Лавлагаа",
  agent: "Агент",
  "ai-worker": "AI ажилтан",
  workflow: "Ажлын урсгал",
  meeting: "Уулзалт",
  milestone: "Чухал үе",
  ask: "Асуулт",
  risk: "Эрсдэл",
  glossary: "Нэр томьёо",
  product: "Бүтээгдэхүүн",
  release: "Хувилбар",
  commit: "Коммит",
  output: "Гаралт",
  company: "Компани",
  inbox: "Ирсэн"
};
const TYPE_TONE = {
  project: "blue",
  task: "green",
  "session-decision": "violet",
  decision: "violet",
  atomic: "teal",
  person: "violet",
  area: "gray",
  skill: "amber",
  event: "red",
  meeting: "red",
  daily: "yellow",
  note: "gray",
  reference: "gray",
  resource: "gray",
  glossary: "gray",
  agent: "blue",
  "ai-worker": "blue",
  milestone: "red",
  risk: "red",
  product: "teal",
  company: "blue"
};
const typeIcon = (type) => TYPE_ICON[type] ?? "file-text";
const typeLabel = (type) => TYPE_LABEL[type] ?? type;
const UNIT_ICON = {
  institution: "landmark",
  company: "building-2",
  department: "briefcase",
  team: "users",
  area: "layout-grid",
  stream: "workflow"
};
const STATUS_ORDER = ["inbox", "planning", "active", "waiting", "someday", "done", "canceled", "archived"];
const STATUS = {
  inbox: { label: "Ирсэн", icon: "inbox", tone: "gray" },
  planning: { label: "Төлөвлөж буй", icon: "hourglass", tone: "gray" },
  active: { label: "Идэвхтэй", icon: "arrow-right", tone: "yellow" },
  waiting: { label: "Хүлээгдэж буй", icon: "hourglass", tone: "blue" },
  someday: { label: "Хэзээ нэгэн цагт", icon: "message-circle", tone: "gray" },
  done: { label: "Дууссан", icon: "check", tone: "green" },
  canceled: { label: "Цуцалсан", icon: "x", tone: "red" },
  archived: { label: "Архив", icon: "archive", tone: "gray" }
};
function statusGroup(value) {
  if (value == null || value === "") return null;
  const v = String(value).toLowerCase().trim().replace(/[\s_]+/g, "-");
  if (["inbox", "new", "todo", "to-do", "not-started"].includes(v)) return "inbox";
  if (["planning", "plan", "next-action", "next", "backlog", "idea"].includes(v)) return "planning";
  if (["in-progress", "active", "doing", "running", "ongoing", "started", "wip"].includes(v)) return "active";
  if (["waiting", "waiting-on", "blocked", "stuck", "on-hold", "paused", "review"].includes(v)) return "waiting";
  if (["someday", "maybe", "someday-maybe", "someday-/-maybe"].includes(v)) return "someday";
  if (["done", "completed", "complete", "finished", "merged", "closed"].includes(v)) return "done";
  if (["canceled", "cancelled", "dropped", "abandoned"].includes(v)) return "canceled";
  if (["archived", "archive"].includes(v)) return "archived";
  return null;
}
const PRIORITY = {
  high: { label: "Өндөр", icon: "signal-high", tone: "red" },
  medium: { label: "Дунд", icon: "signal-medium", tone: "yellow" },
  low: { label: "Бага", icon: "signal-low", tone: "gray" }
};
function priorityOf(value) {
  const v = String(value ?? "").toLowerCase().trim();
  if (["high", "h", "p1", "urgent", "өндөр"].includes(v)) return "high";
  if (["medium", "med", "m", "p2", "normal", "дунд"].includes(v)) return "medium";
  if (["low", "l", "p3", "бага"].includes(v)) return "low";
  return null;
}
const FIELD_ICON = {
  title: "type",
  text: "type",
  status: "asterisk",
  date: "calendar-days",
  relation: "arrow-up-right",
  priority: "signal-medium",
  select: "circle-dot",
  multi: "tag",
  number: "hash",
  checkbox: "square-check",
  url: "link",
  progress: "chart-pie"
};
const VIEW_META = {
  table: { label: "Хүснэгт", icon: "table" },
  board: { label: "Самбар", icon: "kanban" },
  calendar: { label: "Хуанли", icon: "calendar-days" },
  timeline: { label: "Цагийн хэлхээс", icon: "gantt-chart" },
  list: { label: "Жагсаалт", icon: "list" }
};
const VIEWS = ["table", "board", "calendar", "timeline", "list"];
const FIELD_LABEL = {
  status: "Төлөв",
  priority: "Ач холбогдол",
  area: "Чиглэл",
  subArea: "Дэд чиглэл",
  project: "Төсөл",
  owner: "Эзэн",
  due: "Хугацаа",
  date: "Огноо",
  start: "Эхлэх",
  end: "Дуусах",
  role: "Үүрэг",
  unit: "Нэгж",
  company: "Компани",
  tasks: "Даалгавар",
  projects: "Төсөл",
  up: "Харьяа",
  mood: "Сэтгэл санаа",
  assignee: "Гүйцэтгэгч",
  deadline: "Эцсийн хугацаа",
  people: "Хүмүүс",
  agent: "Агент",
  manager: "Менежер",
  related: "Холбоотой",
  author: "Зохиогч",
  phase: "Үе шат",
  tags: "Шошго",
  updated: "Шинэчилсэн",
  created: "Үүсгэсэн",
  confidence: "Итгэл"
};
const VALUE_LABEL = { stated: "Хэлсэн", observed: "Ажигласан", inferred: "Дүгнэсэн", active: "Идэвхтэй" };
const valueLabel = (v) => VALUE_LABEL[v] ?? v;
const DATE_NAMES = ["due", "date", "start", "end", "deadline", "created", "updated", "day"];
const RELATION_NAMES = ["area", "subarea", "project", "company", "unit", "owner", "assignee", "person", "people", "up", "related", "agent", "manager"];
const ISO = /^\d{4}-\d{2}-\d{2}/;
const DAY$1 = 864e5;
function resolveFields(c) {
  const out = [];
  for (const f of c.fields) {
    const name = typeof f === "string" ? f : f.name;
    if (!name || name === "title" || name === "path" || out.some((x) => x.name === name)) continue;
    const declared = typeof f === "string" ? void 0 : f.kind;
    const valid = ["text", "number", "date", "select", "multi", "status", "priority", "relation", "checkbox", "url", "progress"].includes(declared ?? "");
    const kind = valid ? (declared === "text" || declared === "select") && RELATION_NAMES.includes(name.toLowerCase()) ? "relation" : declared : inferKind(name, c.items.map((i) => i.props[name]));
    out.push({ name, kind, label: typeof f !== "string" && f.label || FIELD_LABEL[name] || name });
  }
  return out;
}
function inferKind(name, values) {
  const n = name.toLowerCase();
  const vals = values.filter((v) => v != null && v !== "");
  if (n === "status" || n === "state") return "status";
  if (n === "priority") return "priority";
  if (vals.length && vals.every((v) => typeof v === "boolean")) return "checkbox";
  if (vals.some((v) => Array.isArray(v))) return RELATION_NAMES.includes(n) ? "relation" : "multi";
  if (DATE_NAMES.includes(n) || vals.length && vals.every((v) => typeof v === "string" && ISO.test(v))) return "date";
  if (vals.length && vals.every((v) => typeof v === "string" && /^\d+\s*\/\s*\d+$/.test(v))) return "progress";
  if (vals.length && vals.every((v) => typeof v === "number")) return "number";
  if (vals.length && vals.every((v) => typeof v === "string" && /^https?:\/\//.test(v))) return "url";
  if (RELATION_NAMES.includes(n) || vals.some((v) => typeof v === "string" && v.startsWith("[["))) return "relation";
  const distinct = new Set(vals.map(String));
  return vals.length >= 3 && distinct.size <= Math.max(2, Math.min(8, vals.length / 2)) ? "select" : "text";
}
const linkLabel = (v) => {
  const inner = v.replace(/^\[\[|\]\]$/g, "");
  const alias = inner.split("|")[1];
  return (alias ?? inner.split("/").pop() ?? inner).replace(/\.md$/, "");
};
const asList = (v) => v == null || v === "" ? [] : Array.isArray(v) ? v.map(String) : [String(v)];
const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const parseDay = (v) => {
  if (typeof v !== "string" || !ISO.test(v)) return null;
  const t = Date.parse(`${v.slice(0, 10)}T00:00:00`);
  return Number.isFinite(t) ? t : null;
};
function relativeDay(v, today) {
  const t = parseDay(v);
  if (t == null) return null;
  const days = Math.round((t - dayStart(today)) / DAY$1);
  if (days === 0) return "өнөөдөр";
  if (days === -1) return "өчигдөр";
  if (days === 1) return "маргааш";
  return days < 0 ? `${-days} хоногийн өмнө` : `${days} хоногийн дараа`;
}
const fmtDay = (t) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const PERSON_NAMES = ["owner", "assignee", "person", "people", "manager", "author"];
const fieldIcon = (f) => f.kind === "relation" && PERSON_NAMES.includes(f.name.toLowerCase()) ? "user" : FIELD_ICON[f.kind] ?? "type";
function rangeText(a, b, today) {
  const s = parseDay(a);
  const e = parseDay(b);
  if (s == null || e == null || s === e) return null;
  const f = (t) => {
    const d = new Date(t);
    return `${d.getFullYear() !== today.getFullYear() ? `${d.getFullYear()}.` : ""}${d.getMonth() + 1}/${d.getDate()}`;
  };
  return `${f(s)} → ${f(e)}`;
}
const catOf = (v) => {
  let h = 0;
  for (let i = 0; i < v.length; i++) h = h * 31 + v.charCodeAt(i) >>> 0;
  return h % 4 + 1;
};
function frontmatterOf(item) {
  const val = (v) => Array.isArray(v) ? `[${v.join(", ")}]` : typeof v === "string" && /[:#\[\]{}]/.test(v) ? JSON.stringify(v) : String(v);
  const lines = [`title: ${val(item.title)}`];
  for (const [k, v] of Object.entries(item.props)) if (v != null && v !== "" && !(Array.isArray(v) && !v.length)) lines.push(`${k}: ${val(v)}`);
  return ["---", ...lines, "---"].join("\n");
}
function StatusPill({ value }) {
  const g = statusGroup(value);
  if (!g) return value == null || value === "" ? null : /* @__PURE__ */ jsx("span", { className: "cl-pill is-gray", children: String(value) });
  const s = STATUS[g];
  return /* @__PURE__ */ jsxs("span", { className: `cl-pill is-${s.tone}`, title: s.label, children: [
    /* @__PURE__ */ jsx(Icon, { name: s.icon, size: 14 }),
    s.label
  ] });
}
function PriorityBadge({ value }) {
  const p = priorityOf(value);
  if (!p) return null;
  const m = PRIORITY[p];
  return /* @__PURE__ */ jsxs("span", { className: `cl-prio is-${m.tone}`, title: `Ач холбогдол: ${m.label}`, children: [
    /* @__PURE__ */ jsx(Icon, { name: m.icon, size: 14 }),
    m.label
  ] });
}
function RelationChip({ rel }) {
  if (rel.plain) return /* @__PURE__ */ jsx("span", { className: "cl-text", children: rel.label });
  const body = /* @__PURE__ */ jsxs(Fragment, { children: [
    rel.icon && /* @__PURE__ */ jsx(Icon, { name: rel.icon, size: 14 }),
    /* @__PURE__ */ jsx("span", { children: rel.label })
  ] });
  return rel.onClick ? /* @__PURE__ */ jsx("button", { type: "button", className: "cl-rel", onClick: rel.onClick, children: body }) : /* @__PURE__ */ jsx("span", { className: "cl-rel", children: body });
}
function ProgressNM({ value }) {
  const m = typeof value === "string" ? value.match(/^(\d+)\s*\/\s*(\d+)$/) : null;
  if (!m) return null;
  const [done, total] = [Number(m[1]), Number(m[2])];
  const pct = total ? Math.min(1, done / total) : 0;
  const C = 2 * Math.PI * 5.5;
  return /* @__PURE__ */ jsxs("span", { className: `cl-nm${pct >= 1 ? " is-full" : ""}`, title: `${done}/${total} даалгавар дууссан`, children: [
    /* @__PURE__ */ jsxs("svg", { className: "cl-ring", viewBox: "0 0 14 14", width: "14", height: "14", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "5.5", className: "cl-ring-bg" }),
      pct > 0 && pct < 1 && /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "5.5", className: "cl-ring-arc", strokeDasharray: `${pct * C} ${C}`, transform: "rotate(-90 7 7)" }),
      pct >= 1 && /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "6", className: "cl-ring-full" })
    ] }),
    done,
    "/",
    total
  ] });
}
function RelDate({ value, today, overdue }) {
  const rel = relativeDay(value, today);
  if (!rel) return null;
  return /* @__PURE__ */ jsxs("time", { className: `cl-date${overdue ? " is-overdue" : ""}`, dateTime: String(value).slice(0, 10), title: String(value).slice(0, 10), children: [
    /* @__PURE__ */ jsx(Icon, { name: overdue ? "clock" : "calendar", size: 14 }),
    rel
  ] });
}
function Empty({ text, icon = "search-x" }) {
  return /* @__PURE__ */ jsxs("div", { className: "cv-empty", children: [
    /* @__PURE__ */ jsx(Icon, { name: icon, size: 20 }),
    /* @__PURE__ */ jsx("span", { children: text })
  ] });
}
function TypeBadge({ type, size = 20 }) {
  return /* @__PURE__ */ jsx("span", { className: `cl-tbadge is-${TYPE_TONE[type] ?? "gray"}`, style: { "--b": `${size}px` }, "aria-hidden": "true", children: /* @__PURE__ */ jsx(Icon, { name: typeIcon(type), size: Math.round(size * 0.7) }) });
}
function CollectionView({ collection, today = /* @__PURE__ */ new Date(), resolve, defaultView, siblings = [], nested = false, onOpenInVault, onAskAgent }) {
  const fields = React.useMemo(() => resolveFields(collection), [collection]);
  const status = fields.find((f) => f.kind === "status");
  const priority = fields.find((f) => f.kind === "priority");
  const progress = fields.find((f) => f.kind === "progress");
  const dates = fields.filter((f) => f.kind === "date");
  const dateField = DATE_NAMES.map((n) => dates.find((f) => f.name.toLowerCase() === n)).find(Boolean) ?? dates[0];
  const startField = dates.find((f) => f.name.toLowerCase() === "start");
  const endField = dates.find((f) => ["end", "due", "deadline"].includes(f.name.toLowerCase()));
  const relations = fields.filter((f) => f.kind === "relation");
  const groupable = fields.filter((f) => ["status", "priority", "select", "relation", "checkbox", "multi", "date"].includes(f.kind));
  const presets = collection.type === "task" && dateField ? [
    { id: "month", label: "Энэ сар", icon: "calendar", view: "list", range: "month" },
    { id: "recent", label: "Сүүлийн", icon: "clock", view: "list", range: "recent" },
    { id: "week", label: "7 хоногийн хуанли", icon: "calendar-days", view: "calendar", calendar: "week" }
  ] : [];
  const initialView = defaultView ?? (["event", "daily"].includes(collection.type) && dateField ? "calendar" : collection.type === "project" && status ? "table" : status ? "list" : "table");
  const [view, setView] = React.useState(initialView);
  const [tab, setTab] = React.useState("all");
  const [preset, setPreset] = React.useState(null);
  const [filterField, setFilterField] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [groupBy, setGroupBy] = React.useState("");
  const [calMode, setCalMode] = React.useState("month");
  const [cursor, setCursor] = React.useState(() => dayStart(today));
  const [moreTabs, setMoreTabs] = React.useState(false);
  const [folded, setFolded] = React.useState({});
  const [scale, setScale] = React.useState("month");
  const [peek, setPeek] = React.useState(null);
  const rootRef = React.useRef(null);
  const isDone = (i) => {
    const g = status ? statusGroup(i.props[status.name]) : null;
    return g === "done" || g === "canceled" || g === "archived";
  };
  const overdueOf = (i) => {
    if (!endField || isDone(i)) return false;
    const t = parseDay(i.props[endField.name]);
    return t != null && t < dayStart(today);
  };
  const counts = /* @__PURE__ */ new Map();
  if (status) for (const i of collection.items) {
    const g = statusGroup(i.props[status.name]);
    if (g) counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  const groupsPresent = STATUS_ORDER.filter((g) => counts.get(g));
  const visibleTabs = moreTabs ? groupsPresent : groupsPresent.slice(0, 4);
  const active = presets.find((p) => p.id === preset) ?? null;
  const items = collection.items.filter((i) => {
    if (status && tab !== "all" && statusGroup(i.props[status.name]) !== tab) return false;
    if (filterField && filterValue && !asList(i.props[filterField]).includes(filterValue)) return false;
    if (active?.range && dateField) {
      const t = parseDay(i.props[dateField.name]);
      if (t == null) return false;
      const now = new Date(dayStart(today));
      if (active.range === "month" && (new Date(t).getMonth() !== now.getMonth() || new Date(t).getFullYear() !== now.getFullYear())) return false;
      if (active.range === "recent" && (t > now.getTime() || now.getTime() - t > 14 * DAY$1)) return false;
    }
    return true;
  });
  if (active?.range === "recent" && dateField) items.sort((a, b) => (parseDay(b.props[dateField.name]) ?? 0) - (parseDay(a.props[dateField.name]) ?? 0));
  const rels = (i, only) => relations.filter((f) => !only || f.name === only).flatMap((f) => asList(i.props[f.name]).map((v) => resolve?.(f.name, v) ?? { label: linkLabel(v), icon: f.name.toLowerCase().includes("area") ? "layout-grid" : "link" }));
  const itemIcon = (i) => collection.type === "task" && isDone(i) ? "circle-check" : typeIcon(collection.type);
  const pickPreset = (p) => {
    setPreset(p?.id ?? null);
    if (p) {
      setView(p.view);
      if (p.calendar) setCalMode(p.calendar);
    }
  };
  const cell = (i, f) => {
    const v = i.props[f.name];
    switch (f.kind) {
      case "status":
        return /* @__PURE__ */ jsx(StatusPill, { value: v });
      case "priority":
        return /* @__PURE__ */ jsx(PriorityBadge, { value: v });
      case "progress":
        return /* @__PURE__ */ jsx(ProgressNM, { value: v });
      case "date":
        return /* @__PURE__ */ jsx(RelDate, { value: v, today, overdue: f.name === endField?.name && overdueOf(i) });
      case "relation":
        return /* @__PURE__ */ jsx("span", { className: "cl-rels", children: rels(i, f.name).map((r, k) => /* @__PURE__ */ jsx(RelationChip, { rel: r }, r.label + k)) });
      case "multi":
        return /* @__PURE__ */ jsx("span", { className: "cl-rels", children: asList(v).map((t) => /* @__PURE__ */ jsx("span", { className: "cl-tag", children: t }, t)) });
      case "checkbox":
        return v ? /* @__PURE__ */ jsx(Icon, { name: "check", size: 14, label: "тийм" }) : null;
      case "url":
        return typeof v === "string" ? /* @__PURE__ */ jsxs("a", { className: "cl-url", href: v, target: "_blank", rel: "noreferrer noopener", children: [
          /* @__PURE__ */ jsx(Icon, { name: "link", size: 14 }),
          v.replace(/^https?:\/\//, "").slice(0, 32)
        ] }) : null;
      case "select":
        return v == null || v === "" ? null : /* @__PURE__ */ jsx("span", { className: `cl-tag is-cat-${catOf(String(v))}`, children: valueLabel(String(v)) });
      default:
        return v == null || v === "" ? null : /* @__PURE__ */ jsx("span", { className: "cl-text", children: Array.isArray(v) ? v.join(", ") : String(v) });
    }
  };
  const title = (i) => /* @__PURE__ */ jsxs("span", { className: "cl-title", children: [
    /* @__PURE__ */ jsx(Icon, { name: itemIcon(i), size: 16, className: collection.type === "task" && isDone(i) ? "is-done" : "" }),
    nested ? /* @__PURE__ */ jsx("span", { className: "cl-title-t", title: i.path ?? i.title, children: i.title }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "cl-title-t", title: i.path ?? i.title, onClick: () => setPeek(i.id), children: i.title }),
      /* @__PURE__ */ jsxs("button", { type: "button", className: "cl-open", onClick: () => setPeek(i.id), "aria-label": `${i.title} — нээх`, tabIndex: -1, children: [
        /* @__PURE__ */ jsx(Icon, { name: "panel-right", size: 14 }),
        "Нээх"
      ] })
    ] })
  ] });
  const dateOf = (i) => {
    const range = startField && endField ? rangeText(i.props[startField.name], i.props[endField.name], today) : null;
    if (range)
      return /* @__PURE__ */ jsxs("span", { className: `cl-date${overdueOf(i) ? " is-overdue" : ""}`, children: [
        /* @__PURE__ */ jsx(Icon, { name: "calendar", size: 14 }),
        range
      ] });
    return dateField ? /* @__PURE__ */ jsx(RelDate, { value: i.props[(endField ?? dateField).name] ?? i.props[dateField.name], today, overdue: overdueOf(i) }) : null;
  };
  const groupKey = (i, f) => {
    if (f.kind === "status") return statusGroup(i.props[f.name]) ?? "";
    if (f.kind === "priority") return priorityOf(i.props[f.name]) ?? "";
    if (f.kind === "date") {
      const t = parseDay(i.props[f.name]);
      return t == null ? "" : fmtDay(t).slice(0, 7);
    }
    const list2 = asList(i.props[f.name]);
    return list2[0] ?? "";
  };
  const groupLabel = (f, key) => {
    if (!key) return "Хоосон";
    if (f.kind === "status") return STATUS[key]?.label ?? key;
    if (f.kind === "priority") return PRIORITY[key]?.label ?? key;
    if (f.kind === "relation") return resolve?.(f.name, key)?.label ?? linkLabel(key);
    if (f.kind === "date") return `${key.slice(0, 4)} оны ${Number(key.slice(5, 7))}-р сар`;
    return valueLabel(key);
  };
  const groupsOf = (f, list2) => {
    const keys = [];
    for (const i of list2) {
      const k = groupKey(i, f);
      if (!keys.includes(k)) keys.push(k);
    }
    if (f.kind === "status") keys.sort((a, b) => STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b));
    if (f.kind === "priority") keys.sort((a, b) => ["high", "medium", "low", ""].indexOf(a) - ["high", "medium", "low", ""].indexOf(b));
    if (f.kind === "date") keys.sort((a, b) => !a ? 1 : !b ? -1 : a.localeCompare(b));
    return keys.map((k) => ({ key: k, items: list2.filter((i) => groupKey(i, f) === k) }));
  };
  const groupHead = (f, key, n, id) => /* @__PURE__ */ jsxs("button", { type: "button", className: "cl-group-h", "aria-expanded": !folded[id], onClick: () => setFolded((s) => ({ ...s, [id]: !s[id] })), children: [
    /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 14, className: "cl-chev" }),
    f.kind === "status" && key ? /* @__PURE__ */ jsx(StatusPill, { value: key }) : f.kind === "priority" && key ? /* @__PURE__ */ jsx(PriorityBadge, { value: key }) : /* @__PURE__ */ jsxs("span", { className: "cl-group-t", children: [
      /* @__PURE__ */ jsx(Icon, { name: fieldIcon(f), size: 14 }),
      groupLabel(f, key)
    ] }),
    /* @__PURE__ */ jsx("span", { className: "cl-count", children: n })
  ] });
  const shown = fields.filter((f) => f.kind !== "text" || fields.length <= 6).slice(0, 8);
  const table = (list2) => /* @__PURE__ */ jsx("div", { className: "cl-table-wrap", tabIndex: 0, role: "region", "aria-label": `${typeLabel(collection.type)} хүснэгт`, children: /* @__PURE__ */ jsxs("table", { className: "cl-table", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsxs("th", { scope: "col", children: [
        /* @__PURE__ */ jsx(Icon, { name: "type", size: 14 }),
        " Нэр"
      ] }),
      shown.map((f) => /* @__PURE__ */ jsxs("th", { scope: "col", children: [
        /* @__PURE__ */ jsx(Icon, { name: fieldIcon(f), size: 14 }),
        " ",
        f.label
      ] }, f.name))
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: list2.map((i, k) => /* @__PURE__ */ jsxs("tr", { style: { "--i": k }, children: [
      /* @__PURE__ */ jsx("th", { scope: "row", children: title(i) }),
      shown.map((f) => /* @__PURE__ */ jsx("td", { "data-label": f.label, children: cell(i, f) }, f.name))
    ] }, i.id)) }),
    /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: shown.length + 1, children: [
      /* @__PURE__ */ jsx("span", { className: "cl-foot", children: "Тоо" }),
      " ",
      list2.length
    ] }) }) })
  ] }) });
  const row = (i, k) => /* @__PURE__ */ jsxs("li", { className: "cl-row", style: { "--i": k }, children: [
    status && /* @__PURE__ */ jsx(StatusPill, { value: i.props[status.name] }),
    title(i),
    /* @__PURE__ */ jsxs("span", { className: "cl-row-meta", children: [
      rels(i).map((r, j) => /* @__PURE__ */ jsx(RelationChip, { rel: r }, r.label + j)),
      priority && /* @__PURE__ */ jsx(PriorityBadge, { value: i.props[priority.name] }),
      progress && /* @__PURE__ */ jsx(ProgressNM, { value: i.props[progress.name] }),
      dateOf(i)
    ] })
  ] }, i.id);
  const list = (l) => /* @__PURE__ */ jsx("ul", { className: "cl-list", children: l.map(row) });
  const grouped = (render) => {
    const f = fields.find((x) => x.name === groupBy);
    if (!f) return render(items);
    return /* @__PURE__ */ jsx("div", { className: "cl-groups", children: groupsOf(f, items).map((g) => {
      const id = `${f.name}:${g.key}`;
      return /* @__PURE__ */ jsxs("section", { className: "cl-group", "aria-label": groupLabel(f, g.key), children: [
        groupHead(f, g.key, g.items.length, id),
        !folded[id] && render(g.items)
      ] }, id);
    }) });
  };
  const board = () => {
    const f = fields.find((x) => x.name === groupBy) ?? status ?? groupable[0];
    if (!f) return /* @__PURE__ */ jsx(Empty, { text: "Самбарт бүлэглэх талбар алга.", icon: "kanban" });
    return /* @__PURE__ */ jsx("div", { className: "cl-board", role: "list", children: groupsOf(f, items).map((g) => /* @__PURE__ */ jsxs(
      "section",
      {
        className: `cl-col${f.kind === "status" && g.key ? ` is-${STATUS[g.key]?.tone ?? "gray"}` : ""}`,
        role: "listitem",
        "aria-label": groupLabel(f, g.key),
        children: [
          /* @__PURE__ */ jsxs("header", { className: "cl-col-h", children: [
            f.kind === "status" && g.key ? /* @__PURE__ */ jsx(StatusPill, { value: g.key }) : /* @__PURE__ */ jsx("span", { className: "cl-group-t", children: groupLabel(f, g.key) }),
            /* @__PURE__ */ jsx("span", { className: "cl-count", children: g.items.length })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "cl-cards", children: g.items.map((i, k) => /* @__PURE__ */ jsxs("li", { className: "cl-card", style: { "--i": k }, children: [
            title(i),
            /* @__PURE__ */ jsx("span", { className: "cl-row-meta", children: rels(i).map((r, j) => /* @__PURE__ */ jsx(RelationChip, { rel: r }, r.label + j)) }),
            /* @__PURE__ */ jsxs("span", { className: "cl-row-meta", children: [
              priority && /* @__PURE__ */ jsx(PriorityBadge, { value: i.props[priority.name] }),
              progress && /* @__PURE__ */ jsx(ProgressNM, { value: i.props[progress.name] }),
              dateOf(i)
            ] })
          ] }, i.id)) })
        ]
      },
      g.key
    )) });
  };
  const undated = dateField ? items.filter((i) => parseDay(i.props[(startField ?? dateField).name]) == null && (!endField || parseDay(i.props[endField.name]) == null)).length : 0;
  const calendar = () => {
    if (!dateField) return /* @__PURE__ */ jsx(Empty, { text: "Огнооны талбар алга.", icon: "calendar" });
    const c = new Date(cursor);
    const start = calMode === "week" ? cursor - (c.getDay() + 6) % 7 * DAY$1 : (() => {
      const first = new Date(c.getFullYear(), c.getMonth(), 1);
      return first.getTime() - (first.getDay() + 6) % 7 * DAY$1;
    })();
    const days = calMode === "week" ? 7 : 42;
    const cells = Array.from({ length: days }, (_, k) => dayStart(new Date(start + k * DAY$1 + 36e5)));
    const byDay = /* @__PURE__ */ new Map();
    for (const i of items) {
      const t = parseDay(i.props[dateField.name]);
      if (t != null) byDay.set(t, [...byDay.get(t) ?? [], i]);
    }
    const shift = (n) => {
      const d = new Date(cursor);
      if (calMode === "week") setCursor(dayStart(new Date(cursor + n * 7 * DAY$1 + 36e5)));
      else setCursor(new Date(d.getFullYear(), d.getMonth() + n, 1).getTime());
    };
    const title2 = calMode === "week" ? `${fmtDay(cells[0])} – ${fmtDay(cells[6])}` : `${c.getFullYear()} оны ${c.getMonth() + 1}-р сар`;
    return /* @__PURE__ */ jsxs("div", { className: "cl-cal", children: [
      /* @__PURE__ */ jsxs("div", { className: "cl-cal-bar", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => shift(-1), "aria-label": "Өмнөх", children: /* @__PURE__ */ jsx(Icon, { name: "chevron-left", size: 16 }) }),
        /* @__PURE__ */ jsx("strong", { children: title2 }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => shift(1), "aria-label": "Дараах", children: /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 16 }) }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "cl-today", onClick: () => setCursor(dayStart(today)), children: "Өнөөдөр" }),
        undated > 0 && /* @__PURE__ */ jsxs("span", { className: "cl-undated", children: [
          /* @__PURE__ */ jsx(Icon, { name: "calendar-x", size: 14 }),
          "Огноогүй (",
          undated,
          ")"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "cl-seg", role: "radiogroup", "aria-label": "Хуанлийн хүрээ", children: ["month", "week"].map((m) => /* @__PURE__ */ jsx("button", { type: "button", role: "radio", "aria-checked": calMode === m, "data-active": calMode === m || void 0, onClick: () => setCalMode(m), children: m === "month" ? "Сар" : "7 хоног" }, m)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `cl-cal-grid is-${calMode}`, role: "grid", "aria-label": title2, children: [
        ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"].map((d) => /* @__PURE__ */ jsx("span", { className: "cl-cal-dow", role: "columnheader", children: d }, d)),
        cells.map((t) => {
          const list2 = byDay.get(t) ?? [];
          const inMonth = calMode === "week" || new Date(t).getMonth() === c.getMonth();
          return /* @__PURE__ */ jsxs("div", { role: "gridcell", className: `cl-cal-cell${inMonth ? "" : " is-out"}${t === dayStart(today) ? " is-today" : ""}`, "aria-label": `${fmtDay(t)}, ${list2.length}`, children: [
            /* @__PURE__ */ jsx("span", { className: "cl-cal-n", children: new Date(t).getDate() }),
            list2.slice(0, calMode === "week" ? 8 : 3).map((i) => /* @__PURE__ */ jsxs("span", { className: `cl-cal-item${status ? ` is-${STATUS[statusGroup(i.props[status.name]) ?? "inbox"].tone}` : ""}`, title: i.title, children: [
              /* @__PURE__ */ jsx(Icon, { name: itemIcon(i), size: 14 }),
              i.title
            ] }, i.id)),
            list2.length > (calMode === "week" ? 8 : 3) && /* @__PURE__ */ jsxs("span", { className: "cl-cal-more", children: [
              "+",
              list2.length - (calMode === "week" ? 8 : 3)
            ] })
          ] }, t);
        })
      ] })
    ] });
  };
  const timeline = () => {
    const from = startField ?? dateField;
    if (!from) return /* @__PURE__ */ jsx(Empty, { text: "Огнооны талбар алга.", icon: "gantt-chart" });
    const rows = items.map((i) => {
      const s = parseDay(i.props[from.name]);
      const e = endField ? parseDay(i.props[endField.name]) : null;
      return s != null ? { i, s, e: Math.max(s + DAY$1, e ?? s + DAY$1) } : e != null ? { i, s: e - DAY$1, e } : null;
    }).filter((x) => !!x).sort((a, b) => a.s - b.s);
    if (!rows.length) return /* @__PURE__ */ jsx(Empty, { text: "Эхлэх эсвэл дуусах огноотой мөр алга.", icon: "gantt-chart" });
    const lo = Math.min(...rows.map((r) => r.s));
    const hi = Math.max(...rows.map((r) => r.e));
    const span = Math.max(DAY$1, hi - lo);
    const pct = (t) => (t - lo) / span * 100;
    const months = [];
    if (scale === "month" && span < 62 * DAY$1) {
      const w = new Date(lo);
      w.setDate(w.getDate() + ((8 - w.getDay()) % 7 || 7));
      for (let g = 0; w.getTime() < hi && g < 12; g++) {
        months.push({ at: pct(dayStart(w)), label: `${w.getMonth() + 1}/${w.getDate()}` });
        w.setDate(w.getDate() + 7);
      }
    }
    const d = new Date(lo);
    d.setDate(1);
    d.setMonth(d.getMonth() + (scale === "year" ? 3 - d.getMonth() % 3 : 1));
    for (let g = 0; !(scale === "month" && span < 62 * DAY$1) && d.getTime() < hi && g < 48; g++) {
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const label2 = scale === "year" ? d.getMonth() === 0 ? String(d.getFullYear()) : `${d.getMonth() / 3 + 1}-р улирал` : d.getMonth() === 0 || !months.length ? `${d.getFullYear()}.${m}` : m;
      months.push({ at: pct(d.getTime()), label: label2 });
      d.setMonth(d.getMonth() + (scale === "year" ? 3 : 1));
    }
    const now = dayStart(today);
    return /* @__PURE__ */ jsxs("div", { className: "cl-tl", children: [
      /* @__PURE__ */ jsxs("div", { className: "cl-tl-bar-top", children: [
        undated > 0 && /* @__PURE__ */ jsxs("span", { className: "cl-undated", children: [
          /* @__PURE__ */ jsx(Icon, { name: "calendar-x", size: 14 }),
          "Огноогүй (",
          undated,
          ")"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "cl-seg", role: "radiogroup", "aria-label": "Масштаб", children: ["month", "year"].map((m) => /* @__PURE__ */ jsx("button", { type: "button", role: "radio", "aria-checked": scale === m, "data-active": scale === m || void 0, onClick: () => setScale(m), children: m === "month" ? "Сар" : "Жил" }, m)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "cl-tl-scale", "aria-hidden": "true", children: months.map((m) => /* @__PURE__ */ jsx("span", { style: { left: `${m.at}%` }, children: m.label }, m.label + m.at)) }),
      /* @__PURE__ */ jsx("ol", { className: "cl-tl-rows", children: rows.map(({ i, s, e }, k) => {
        const g = status ? statusGroup(i.props[status.name]) : null;
        return /* @__PURE__ */ jsx("li", { style: { "--i": k }, children: /* @__PURE__ */ jsxs("span", { className: "cl-tl-track", children: [
          months.map((m) => /* @__PURE__ */ jsx("i", { className: "cl-tl-grid", style: { left: `${m.at}%` } }, m.label + m.at)),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `cl-tl-bar is-${g ? STATUS[g].tone : "gray"}${overdueOf(i) ? " is-overdue" : ""}`,
              style: { left: `${pct(s)}%`, width: `${Math.max(1.2, pct(e) - pct(s))}%` },
              title: `${fmtDay(s)} → ${fmtDay(e)}`
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: `cl-tl-label${pct(s) > 55 ? " is-end" : ""}`, style: pct(s) > 55 ? { right: `${Math.max(0, 100 - pct(e))}%` } : { left: `${pct(s)}%` }, children: [
            title(i),
            status && /* @__PURE__ */ jsx(StatusPill, { value: i.props[status.name] })
          ] }),
          now >= lo && now <= hi && /* @__PURE__ */ jsx("i", { className: "cl-tl-today", style: { left: `${pct(now)}%` } })
        ] }) }, i.id);
      }) })
    ] });
  };
  const peekItem = collection.items.find((i) => i.id === peek) ?? null;
  const filterValues = filterField ? Array.from(new Set(collection.items.flatMap((i) => asList(i.props[filterField])))).sort() : [];
  const label = collection.label ?? typeLabel(collection.type);
  return /* @__PURE__ */ jsxs("div", { className: "cl", "data-type": collection.type, ref: rootRef, children: [
    !nested && status && groupsPresent.length > 0 && /* @__PURE__ */ jsxs("div", { className: "cl-tabs", role: "tablist", "aria-label": `${label} — төлөв`, children: [
      /* @__PURE__ */ jsxs("button", { type: "button", role: "tab", "aria-selected": tab === "all", onClick: () => setTab("all"), children: [
        /* @__PURE__ */ jsx(Icon, { name: "list", size: 14 }),
        "Бүгд ",
        /* @__PURE__ */ jsx("span", { className: "cl-count", children: collection.items.length })
      ] }),
      visibleTabs.map((g) => /* @__PURE__ */ jsxs("button", { type: "button", role: "tab", "aria-selected": tab === g, onClick: () => setTab(g), className: `is-${STATUS[g].tone}`, children: [
        /* @__PURE__ */ jsx(Icon, { name: STATUS[g].icon, size: 14 }),
        STATUS[g].label,
        " ",
        /* @__PURE__ */ jsx("span", { className: "cl-count", children: counts.get(g) })
      ] }, g)),
      groupsPresent.length > 4 && /* @__PURE__ */ jsxs("button", { type: "button", className: "cl-more", "aria-expanded": moreTabs, onClick: () => setMoreTabs((m) => !m), children: [
        /* @__PURE__ */ jsx(Icon, { name: "ellipsis", size: 14 }),
        moreTabs ? "Цөөн" : `Бас ${groupsPresent.length - 4}`
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cl-bar", children: [
      /* @__PURE__ */ jsx("span", { className: "cl-seg cl-views", role: "radiogroup", "aria-label": "Харагдац", children: VIEWS.map((v) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          role: "radio",
          "aria-checked": view === v,
          "data-active": view === v || void 0,
          title: VIEW_META[v].label,
          onClick: () => {
            setView(v);
            setPreset(null);
          },
          children: [
            /* @__PURE__ */ jsx(Icon, { name: VIEW_META[v].icon, size: 16 }),
            /* @__PURE__ */ jsx("span", { className: "cl-vlabel", children: VIEW_META[v].label })
          ]
        },
        v
      )) }),
      presets.length > 0 && /* @__PURE__ */ jsx("span", { className: "cl-presets", role: "group", "aria-label": "Бэлэн харагдац", children: presets.map((p) => /* @__PURE__ */ jsxs("button", { type: "button", "aria-pressed": preset === p.id, onClick: () => pickPreset(preset === p.id ? null : p), children: [
        /* @__PURE__ */ jsx(Icon, { name: p.icon, size: 14 }),
        p.label
      ] }, p.id)) }),
      /* @__PURE__ */ jsxs("span", { className: "cl-tools", children: [
        /* @__PURE__ */ jsxs("label", { className: "cl-select", children: [
          /* @__PURE__ */ jsx(Icon, { name: "filter", size: 14 }),
          /* @__PURE__ */ jsx("span", { className: "cv-sr", children: "Шүүх талбар" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filterField,
              onChange: (e) => {
                setFilterField(e.target.value);
                setFilterValue("");
              },
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Шүүлтгүй" }),
                fields.filter((f) => f.kind !== "text" && f.kind !== "url").map((f) => /* @__PURE__ */ jsx("option", { value: f.name, children: f.label }, f.name))
              ]
            }
          )
        ] }),
        filterField && /* @__PURE__ */ jsxs("label", { className: "cl-select", children: [
          /* @__PURE__ */ jsx("span", { className: "cv-sr", children: "Шүүх утга" }),
          /* @__PURE__ */ jsxs("select", { value: filterValue, onChange: (e) => setFilterValue(e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Бүгд" }),
            filterValues.map((v) => /* @__PURE__ */ jsx("option", { value: v, children: valueLabel(linkLabel(v)) }, v))
          ] })
        ] }),
        (view === "table" || view === "list" || view === "board") && /* @__PURE__ */ jsxs("label", { className: "cl-select", children: [
          /* @__PURE__ */ jsx(Icon, { name: "layers", size: 14 }),
          /* @__PURE__ */ jsx("span", { className: "cv-sr", children: "Бүлэглэх" }),
          /* @__PURE__ */ jsxs("select", { value: groupBy, onChange: (e) => setGroupBy(e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: view === "board" ? "Төлвөөр" : "Бүлэглэлгүй" }),
            groupable.map((f) => /* @__PURE__ */ jsx("option", { value: f.name, children: f.label }, f.name))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "cl-body", children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "cl-empty", children: [
      /* @__PURE__ */ jsx(Empty, { text: "Энэ харагдацад мөр алга." }),
      (tab !== "all" || filterValue || preset) && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "cl-clear",
          onClick: () => {
            setTab("all");
            setFilterField("");
            setFilterValue("");
            setPreset(null);
          },
          children: [
            /* @__PURE__ */ jsx(Icon, { name: "filter", size: 14 }),
            "Шүүлт цэвэрлэх"
          ]
        }
      )
    ] }) : view === "table" ? grouped(table) : view === "list" ? grouped(list) : view === "board" ? board() : view === "calendar" ? calendar() : timeline() }, `${view}-${tab}-${preset}`),
    !nested && peekItem && /* @__PURE__ */ jsx(
      Peek,
      {
        item: peekItem,
        collection,
        fields,
        cell,
        icon: itemIcon(peekItem),
        status,
        siblings,
        today,
        onClose: () => setPeek(null),
        dark: !!rootRef.current?.closest(".dark,[data-theme=dark]"),
        onOpenInVault,
        onAskAgent
      }
    )
  ] });
}
function relatedTo(item, self, siblings) {
  const keys = /* @__PURE__ */ new Set([item.id, item.title, item.title.toLowerCase()]);
  const hits = (v) => asList(v).some((x) => keys.has(x) || keys.has(linkLabel(x)) || keys.has(linkLabel(x).toLowerCase()));
  return siblings.filter((c) => c !== self && c.type !== self.type).map((c) => ({ collection: c, items: c.items.filter((i) => Object.values(i.props).some(hits)) })).filter((g) => g.items.length > 0);
}
function Peek({
  item,
  collection,
  fields,
  cell,
  icon,
  status,
  siblings,
  today,
  onClose,
  dark,
  onOpenInVault,
  onAskAgent
}) {
  const [more, setMore] = React.useState(false);
  const related = relatedTo(item, collection, siblings);
  const [tab, setTab] = React.useState(0);
  const closeRef = React.useRef(null);
  React.useEffect(() => {
    const back = document.activeElement;
    closeRef.current?.focus();
    const key = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      back?.focus?.();
    };
  }, [onClose]);
  const filled = fields.filter((f) => f !== status && f.kind !== "relation" && !(item.props[f.name] == null || item.props[f.name] === "" || Array.isArray(item.props[f.name]) && !item.props[f.name].length));
  const shownProps = more ? filled : filled.slice(0, 8);
  const rels = fields.filter((f) => f.kind === "relation" && asList(item.props[f.name]).length);
  const group = related[Math.min(tab, related.length - 1)];
  const sheet = /* @__PURE__ */ jsx("div", { className: "cv-sheet-wrap", onMouseDown: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ jsxs("section", { className: "cv-sheet cl-peek", role: "dialog", "aria-modal": "true", "aria-labelledby": "cl-peek-title", children: [
    /* @__PURE__ */ jsxs("header", { className: "cl-peek-head", children: [
      /* @__PURE__ */ jsxs("span", { className: "cl-peek-type", children: [
        /* @__PURE__ */ jsx(TypeBadge, { type: collection.type, size: 20 }),
        collection.label ?? typeLabel(collection.type)
      ] }),
      /* @__PURE__ */ jsx("button", { ref: closeRef, type: "button", className: "cv-sheet-close", onClick: onClose, "aria-label": "Хаах", children: "×" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cv-sheet-body", children: [
      /* @__PURE__ */ jsxs("h3", { id: "cl-peek-title", className: "cl-peek-title", children: [
        /* @__PURE__ */ jsx(Icon, { name: icon, size: 20 }),
        item.title
      ] }),
      status && /* @__PURE__ */ jsx(StatusPill, { value: item.props[status.name] }),
      item.path && /* @__PURE__ */ jsx("code", { className: "cl-peek-path", children: item.path }),
      filled.length > 0 && /* @__PURE__ */ jsx("dl", { className: "cl-props", children: shownProps.map((f) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("dt", { children: [
          /* @__PURE__ */ jsx(Icon, { name: fieldIcon(f), size: 14 }),
          f.label
        ] }),
        /* @__PURE__ */ jsx("dd", { children: cell(item, f) })
      ] }, f.name)) }),
      filled.length > 8 && /* @__PURE__ */ jsxs("button", { type: "button", className: "cl-more-props", onClick: () => setMore((m) => !m), "aria-expanded": more, children: [
        /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 14, className: "cl-chev" }),
        more ? "Цөөн харуулах" : `Бас ${filled.length - 8}`
      ] }),
      rels.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Холбоос" }),
        /* @__PURE__ */ jsx("dl", { className: "cl-props", children: rels.map((f) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("dt", { children: [
            /* @__PURE__ */ jsx(Icon, { name: fieldIcon(f), size: 14 }),
            f.label
          ] }),
          /* @__PURE__ */ jsx("dd", { children: cell(item, f) })
        ] }, f.name)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Мета өгөгдөл" }),
        /* @__PURE__ */ jsxs("pre", { className: "cl-fm", "aria-label": "Мета өгөгдөл", children: [
          item.path ? `# ${item.path}
` : "",
          frontmatterOf(item)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Холбоотой" }),
        related.length === 0 ? /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Холбоотой мөр алга." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "cl-tabs", role: "tablist", "aria-label": "Холбоотой төрөл", children: related.map((g, k) => /* @__PURE__ */ jsxs("button", { type: "button", role: "tab", "aria-selected": group === g, onClick: () => setTab(k), children: [
            /* @__PURE__ */ jsx(Icon, { name: typeIcon(g.collection.type), size: 14 }),
            g.collection.label ?? typeLabel(g.collection.type),
            " ",
            /* @__PURE__ */ jsx("span", { className: "cl-count", children: g.items.length })
          ] }, g.collection.type)) }),
          /* @__PURE__ */ jsx(
            CollectionView,
            {
              collection: { ...group.collection, items: group.items },
              today,
              nested: true,
              defaultView: group.collection.type === "task" ? "list" : void 0
            },
            group.collection.type
          )
        ] })
      ] })
    ] }),
    (onOpenInVault || onAskAgent) && /* @__PURE__ */ jsxs("footer", { className: "cl-peek-actions", children: [
      onOpenInVault && /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onOpenInVault(item, collection), children: [
        /* @__PURE__ */ jsx(Icon, { name: "book-open", size: 16 }),
        "Тэмдэглэлийн санд нээх"
      ] }),
      onAskAgent && /* @__PURE__ */ jsxs("button", { type: "button", className: "is-primary", onClick: () => onAskAgent(item, collection), children: [
        /* @__PURE__ */ jsx(Icon, { name: "bot", size: 16 }),
        "Агентаас асуух"
      ] })
    ] })
  ] }) });
  if (typeof document === "undefined") return sheet;
  return createPortal(/* @__PURE__ */ jsx("div", { className: `cv cv-layer${dark ? " dark" : ""}`, children: sheet }), document.body);
}
const collectionCss = `
.cv-empty{display:flex;flex-direction:column;align-items:center;gap:8px}
.cv-empty .cv-icon{color:var(--cv-faint)}
.cv-icon{flex:none;vertical-align:-3px}
.cl{display:flex;flex-direction:column;gap:var(--ts-gap-control,16px);min-width:0}
.cl-tabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid var(--cv-line)}
.cl-tabs::-webkit-scrollbar{display:none}
.cl-tabs button{position:relative;flex:none;display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 10px;border:0;background:none;color:var(--cv-muted);font-size:13px;font-weight:500;white-space:nowrap}
.cl-tabs button:hover{color:var(--cv-fg)}
.cl-tabs button[aria-selected=true]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff);border-radius:6px}
.cl-tabs button[aria-selected=true] :is(span,.cv-icon){color:currentColor}
/* count on the selected tab: a white chip with the selection colour as text (5.7:1); white on a translucent white was 3.3:1 */
.cl-tabs button[aria-selected=true] .cl-count{background:var(--ts-on-selected,#fff);color:var(--ts-selected-strong,#0a6ab0)}
.cl-tabs button[aria-selected=true]::after{content:none}
.cl-count{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--cv-soft);color:var(--cv-muted);font-size:11.5px;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
.cl-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.cl-seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:var(--cv-soft)}
.cl-seg button{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:0;border-radius:6px;background:none;color:var(--cv-muted);font-size:12.5px;font-weight:500;white-space:nowrap}
.cl-seg button[data-active]{background:var(--cv-seg-on);color:var(--cv-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
.cl-presets{display:inline-flex;flex-wrap:wrap;gap:4px}
.cl-presets button{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 9px;border:1px solid var(--cv-line);border-radius:14px;background:var(--cv-bg);color:var(--cv-muted);font-size:12.5px}
.cl-presets button[aria-pressed=true]{border-color:transparent;background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}
.cl-tools{display:inline-flex;flex-wrap:wrap;gap:6px;margin-left:auto}
.cl-select{display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 4px 0 8px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);color:var(--cv-muted)}
.cl-select select{height:28px;max-width:150px;border:0;background:none;color:var(--cv-fg);font:inherit;font-size:12.5px}
.cl-body{animation:cv-fade .2s ease both}
.cl-pill{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 7px 0 5px;border-radius:11px;font-size:12px;font-weight:500;white-space:nowrap}
.cl-pill.is-gray{background:var(--cv-soft);color:var(--cv-muted)}
.cl-pill.is-yellow{background:var(--cv-yellow-soft);color:color-mix(in srgb,var(--cv-yellow) 68%,var(--cv-fg))}
.cl-pill.is-blue{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 72%,var(--cv-fg))}
.cl-pill.is-green{background:var(--cv-green-soft);color:color-mix(in srgb,var(--cv-green) 78%,var(--cv-fg))}
.cl-pill.is-red{background:var(--cv-red-soft);color:color-mix(in srgb,var(--cv-red) 82%,var(--cv-fg))}
.cl-prio{display:inline-flex;align-items:center;gap:3px;height:22px;padding:0 7px 0 5px;border-radius:6px;font-size:12px;font-weight:500;white-space:nowrap}
.cl-prio.is-red{background:var(--ts-prio-high-bg,var(--cv-red-soft));color:var(--ts-prio-high,color-mix(in srgb,var(--cv-red) 82%,var(--cv-fg)))}
.cl-prio.is-yellow{background:var(--ts-prio-medium-bg,var(--cv-yellow-soft));color:var(--ts-prio-medium,color-mix(in srgb,var(--cv-yellow) 68%,var(--cv-fg)))}
.cl-prio.is-gray{background:var(--ts-prio-low-bg,var(--cv-soft));color:var(--ts-prio-low,var(--cv-muted))}
.cl-tag.is-cat-1{background:var(--ts-cat-1-bg,var(--cv-accent-soft));color:color-mix(in srgb,var(--ts-cat-1,var(--cv-accent)) 62%,var(--cv-fg))}
.cl-tag.is-cat-2{background:var(--ts-cat-2-bg,var(--cv-green-soft));color:color-mix(in srgb,var(--ts-cat-2,var(--cv-green)) 62%,var(--cv-fg))}
.cl-tag.is-cat-3{background:var(--ts-cat-3-bg,var(--cv-amber-soft));color:color-mix(in srgb,var(--ts-cat-3,var(--cv-amber)) 62%,var(--cv-fg))}
.cl-tag.is-cat-4{background:var(--ts-cat-4-bg,var(--cv-violet-soft));color:color-mix(in srgb,var(--ts-cat-4,var(--cv-violet)) 62%,var(--cv-fg))}
.cl-fm{margin:0;padding:12px 14px;border-radius:10px;background:var(--ts-ink,#262522);color:var(--ts-ink-muted,#65656d);font:12px/1.65 var(--ts-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);white-space:pre-wrap;word-break:break-word}
.cl-peek-actions{display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--cv-line);background:var(--cv-soft)}
.cl-peek-actions button{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;border:1px solid var(--cv-line);border-radius:9px;background:var(--cv-bg);font-size:13.5px;font-weight:500}
.cl-peek-actions button.is-primary{border-color:transparent;background:var(--ts-ink,#262522);color:#f0ede4}
.cl-rels{display:inline-flex;flex-wrap:wrap;gap:4px}
.cl-rel{display:inline-flex;align-items:center;gap:4px;max-width:200px;height:22px;padding:0 7px 0 5px;border:0;border-radius:6px;background:none;color:var(--cv-fg);font-size:12.5px;text-decoration:underline;text-decoration-color:var(--cv-line);text-underline-offset:3px;white-space:nowrap}
.cl-rel span{overflow:hidden;text-overflow:ellipsis}
.cl-rel .cv-icon{color:var(--cv-muted)}
button.cl-rel:hover{background:var(--cv-soft);text-decoration-color:var(--cv-faint)}
.cl-tag{display:inline-flex;align-items:center;height:20px;padding:0 6px;border-radius:5px;background:var(--cv-soft);font-size:12px;white-space:nowrap}
.cl-nm{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--cv-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.cl-ring{flex:none}
.cl-ring-bg{fill:none;stroke:var(--cv-line);stroke-width:2}
.cl-ring-arc{fill:none;stroke:var(--cv-green);stroke-width:2;stroke-linecap:round}
.cl-ring-full{fill:var(--cv-green)}
.cl-nm.is-full{color:color-mix(in srgb,var(--cv-green) 78%,var(--cv-fg))}
.cl-date{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--cv-muted);white-space:nowrap}
.cl-date.is-overdue{color:color-mix(in srgb,var(--cv-red) 85%,var(--cv-fg));font-weight:500}
.cl-url{display:inline-flex;align-items:center;gap:4px;color:var(--ts-link,var(--cv-accent));font-size:12.5px;text-decoration:none}
.cl-text{font-size:13px;color:var(--cv-fg)}
.cl-title{display:inline-flex;align-items:center;gap:8px;min-width:0}
.cl-title .cv-icon{color:var(--cv-muted)}
.cl-title .cv-icon.is-done{color:var(--cv-green)}
.cl-title-t{min-width:0;padding:0;border:0;background:none;color:inherit;font:inherit;font-weight:500;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}
button.cl-title-t:hover{text-decoration:underline;text-decoration-color:var(--cv-faint);text-underline-offset:3px}
.cl-open{display:none;align-items:center;gap:3px;height:22px;padding:0 6px;border:1px solid var(--cv-line);border-radius:6px;background:var(--cv-bg);color:var(--cv-muted);font-size:11px;font-weight:600;letter-spacing:.03em}
.cl-row:hover .cl-open,.cl-table tr:hover .cl-open,.cl-card:hover .cl-open{display:inline-flex}
.cl-table thead th .cv-icon{color:var(--cv-faint)}
.cl-table tfoot td{padding:8px 10px;font-size:12px;color:var(--cv-muted);border-top:1px solid var(--cv-line)}
.cl-foot{margin-right:6px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--cv-faint)}
.cl-group-t{display:inline-flex;align-items:center;gap:6px}
.cl-group-t .cv-icon{color:var(--cv-faint)}
.cl-col.is-yellow{background:color-mix(in srgb,var(--cv-yellow-soft) 70%,var(--cv-soft))}
.cl-col.is-blue{background:color-mix(in srgb,var(--cv-accent-soft) 70%,var(--cv-soft))}
.cl-col.is-green{background:color-mix(in srgb,var(--cv-green-soft) 70%,var(--cv-soft))}
.cl-col.is-red{background:color-mix(in srgb,var(--cv-red-soft) 70%,var(--cv-soft))}
.cl-undated{display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 9px;border-radius:13px;background:var(--cv-soft);color:var(--cv-muted);font-size:12px}
.cl-tl-bar-top{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.cl-empty{display:flex;flex-direction:column;align-items:center;gap:8px}
.cl-empty .cv-empty{width:100%}
.cl-clear{display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 12px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);font-size:13px}
.cl-peek-head{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--cv-line)}
.cl-peek-type{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--cv-muted)}
.cl-peek .cv-sheet-body{gap:14px}
.cl-peek .cv-sheet-body>.cl-pill{align-self:flex-start}
.cl-peek-title{display:flex;align-items:flex-start;gap:8px;margin:0;font-size:20px;font-weight:650;line-height:1.3;letter-spacing:-.01em}
.cl-peek-title .cv-icon{margin-top:3px;color:var(--cv-muted)}
.cl-peek-path{align-self:flex-start;padding:2px 6px;border-radius:5px;background:var(--cv-soft);color:var(--cv-muted);font-size:11.5px;word-break:break-all}
.cl-props{flex:none;display:flex;flex-direction:column;margin:0;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);overflow:hidden}
.cl-peek .cv-sheet-body>*{flex-shrink:0}
.cl-props>div{display:grid;grid-template-columns:140px minmax(0,1fr);align-items:center;gap:8px;min-height:40px;padding:10px 16px;border-bottom:1px solid var(--cv-line)}
.cl-props>div:last-child{border-bottom:0}
.cl-props>div:hover{background:var(--cv-soft)}
.cl-props dt{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--cv-muted)}
.cl-props dt .cv-icon{color:var(--cv-faint)}
.cl-props dd{margin:0;min-width:0}
.cl-more-props{display:inline-flex;align-items:center;gap:4px;align-self:flex-start;height:28px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--cv-muted);font-size:13px}
.cl-more-props[aria-expanded=true] .cl-chev{transform:rotate(90deg)}
.cl-peek .cl .cl{margin-top:8px}
.cl-peek .cl-tabs+.cl{margin-top:8px}
.cl-tbadge{display:inline-grid;place-items:center;flex:none;width:var(--b,20px);height:var(--b,20px);border-radius:calc(var(--b,20px) * .27);color:#fff}
.cl-tbadge .cv-icon{stroke-width:2.25}
.cl-tbadge.is-blue{background:#3b82f6}.cl-tbadge.is-green{background:#22a35a}.cl-tbadge.is-red{background:var(--ts-red,#c2362f);color:var(--ts-on-red,#fff)}
.cl-tbadge.is-violet{background:#8b5cf6}.cl-tbadge.is-teal{background:#14a3a3}.cl-tbadge.is-amber{background:#e08a1e}
.cl-tbadge.is-yellow{background:#d4a017}.cl-tbadge.is-gray{background:#5f5f67}
/* glyph contrast (Figma check, 2026-11-12): light fills take the dark on-cat glyph */
.cl-tbadge.is-amber,.cl-tbadge.is-yellow{color:var(--ts-on-cat-1,#14130f)}
.cl-tbadge.is-green,.cl-tbadge.is-teal{color:var(--ts-on-cat-3,#0b2414)}
.cl-table-wrap{overflow-x:auto;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cl-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}
.cl-table th,.cl-table td{padding:8px 10px;border-bottom:1px solid var(--cv-line);text-align:left;vertical-align:middle;white-space:nowrap}
.cl-table tbody tr:last-child>*{border-bottom:0}
.cl-table thead th{font-size:12px;font-weight:500;color:var(--cv-muted)}
.cl-table th[scope=row]{position:sticky;left:0;z-index:1;max-width:280px;background:var(--cv-bg);font-weight:400;border-right:1px solid var(--cv-line)}
.cl-table tbody tr{animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 25ms)}
.cl-table tbody tr:hover>*{background:color-mix(in srgb,var(--cv-soft) 60%,var(--cv-bg))}
/* phones: each row becomes a card — title on top, the fields as label · value lines; no sideways scroll */
@media (max-width:600px){
.cl-table-wrap{overflow:visible;border:0;background:none}
.cl-table,.cl-table tbody,.cl-table tr,.cl-table th[scope=row],.cl-table td{display:block}
.cl-table thead{display:none}
.cl-table tbody{display:grid;gap:8px}
.cl-table tbody tr{border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg);overflow:hidden}
.cl-table th[scope=row]{position:static;max-width:none;border-right:0;padding:10px 12px;font-weight:500;white-space:normal}
.cl-table td{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 12px;white-space:normal;border-bottom:0;border-top:1px solid var(--cv-line)}
.cl-table td::before{content:attr(data-label);flex:none;font-size:12px;color:var(--cv-muted)}
.cl-table td:empty{display:none}
.cl-table tfoot,.cl-table tfoot tr,.cl-table tfoot td{display:block}
.cl-table tfoot td{border:0;padding:4px 2px}
}
.cl-list,.cl-cards{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}
.cl-row{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:8px 10px;border-radius:9px;animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 25ms)}
.cl-row:hover{background:var(--cv-soft)}
.cl-row .cl-title{flex:1 1 200px}
.cl-row-meta{display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px}
.cl-groups{display:flex;flex-direction:column;gap:10px}
.cl-group-h{display:flex;align-items:center;gap:8px;width:100%;height:34px;padding:0 6px;border:0;border-bottom:1px solid var(--cv-line);background:none;text-align:left}
.cl-chev{color:var(--cv-faint);transform:rotate(90deg);transition:transform .2s}
.cl-group-h[aria-expanded=false] .cl-chev{transform:none}
.cl-group-t{font-weight:600;font-size:13px}
.cl-group>.cl-table-wrap,.cl-group>.cl-list{margin-top:6px}
.cl-board{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:10px;overflow-x:auto;padding-bottom:4px}
.cl-col{display:flex;flex-direction:column;gap:8px;min-width:0;padding:8px;border-radius:12px;background:var(--cv-soft)}
.cl-col-h{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 2px 0}
.cl-col .cl-count{background:var(--cv-bg)}
.cl-cards{gap:6px}
.cl-card{display:flex;flex-direction:column;gap:6px;padding:10px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 35ms)}
.cl-card .cl-row-meta:empty{display:none}
.cl-cal{display:flex;flex-direction:column;gap:8px}
.cl-cal-bar{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.cl-cal-bar>button{display:inline-grid;place-items:center;height:30px;min-width:30px;padding:0 8px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);font-size:12.5px}
.cl-cal-bar strong{min-width:150px;text-align:center;font-size:14px}
.cl-cal-bar .cl-seg{margin-left:auto}
.cl-cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border:1px solid var(--cv-line);border-radius:12px;overflow:hidden;background:var(--cv-line);gap:1px}
.cl-cal-dow{padding:6px 8px;background:var(--cv-bg);font-size:11.5px;font-weight:600;color:var(--cv-muted)}
.cl-cal-cell{display:flex;flex-direction:column;gap:3px;min-height:92px;min-width:0;padding:6px;background:var(--cv-bg)}
.cl-cal-grid.is-week .cl-cal-cell{min-height:180px}
.cl-cal-cell.is-out{background:var(--cv-page);color:var(--cv-faint)}
.cl-cal-n{font-size:12px;font-weight:500;color:var(--cv-muted)}
.cl-cal-cell.is-today .cl-cal-n{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--cv-red);color:var(--ts-on-red,#fff)}
.cl-cal-item{display:flex;align-items:center;gap:4px;min-width:0;padding:2px 5px;border-radius:5px;background:var(--cv-soft);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cl-cal-item .cv-icon{color:var(--cv-muted)}
.cl-cal-item.is-yellow{background:var(--cv-yellow-soft)}.cl-cal-item.is-blue{background:var(--cv-accent-soft)}.cl-cal-item.is-green{background:var(--cv-green-soft)}.cl-cal-item.is-red{background:var(--cv-red-soft)}
.cl-cal-more{font-size:11.5px;color:var(--cv-muted)}
.cl-tl{display:flex;flex-direction:column;gap:6px;padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cl-tl-scale{position:relative;height:16px;font-size:11px;color:var(--cv-faint)}
.cl-tl-scale span{position:absolute;transform:translateX(-50%);white-space:nowrap}
.cl-tl-rows{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.cl-tl-rows li{display:block;min-height:34px;animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 30ms)}
.cl-tl-track{position:relative;display:block;height:34px}
.cl-tl-label{position:absolute;top:5px;display:inline-flex;align-items:center;gap:6px;max-width:calc(100% - 4px);padding:0 6px 0 4px;font-size:12.5px;white-space:nowrap}
.cl-tl-label .cl-title{min-width:0}
.cl-tl-label.is-end{flex-direction:row-reverse}
.cl-tl-label .cl-pill{height:20px;font-size:11.5px}
.cl-tl-grid{position:absolute;top:-4px;bottom:-4px;width:1px;background:var(--cv-line)}
.cl-tl-bar{position:absolute;top:3px;height:28px;border-radius:7px;opacity:.28;transform-origin:left;animation:cv-grow .5s cubic-bezier(.2,.8,.3,1) .1s both}
.cl-tl-bar.is-gray{background:color-mix(in srgb,var(--cv-faint) 60%,var(--cv-bg))}
.cl-tl-bar.is-yellow{background:var(--cv-yellow)}.cl-tl-bar.is-blue{background:var(--cv-accent)}.cl-tl-bar.is-green{background:var(--cv-green)}.cl-tl-bar.is-red{background:var(--cv-red)}
.cl-tl-bar.is-overdue{opacity:.4;box-shadow:inset 0 0 0 1.5px var(--cv-red)}
.cl-tl-today{position:absolute;top:-5px;bottom:-5px;width:2px;margin-left:-1px;background:var(--cv-red);opacity:.75}
@container cv (max-width:700px){.cl-vlabel{display:none}.cl-tools{margin-left:0}}
@container cv (max-width:560px){.cl-cal-cell{min-height:64px;padding:4px}.cl-cal-item{font-size:0;padding:3px}.cl-cal-item .cv-icon{width:12px;height:12px}.cl-cal-grid.is-week .cl-cal-item{font-size:11px}.cl-props>div{grid-template-columns:110px minmax(0,1fr)}.cl-board{grid-auto-columns:minmax(220px,85%)}}
`;
function dependencyText(c, p, t, index = taskIndex(c)) {
  const { waitsOn, blocks } = dependenciesOf(c, p, t, index);
  const parts = [];
  if (waitsOn.length)
    parts.push(`⛓ хүлээж буй: ${waitsOn.map((w) => (w.project && w.project !== p ? `${w.project.name} › ` : "") + w.task.title).join(", ")}`);
  if (blocks.length) parts.push(`→ ${blocks.length} даалгавар хүлээж байна`);
  return parts.join(" · ");
}
const areaLabel = (c, v) => {
  const t = v?.trim();
  if (!t) return "";
  return c.units.find((u) => u.id === t)?.name ?? t;
};
function isHeld(c, p, t, index = taskIndex(c)) {
  return dependenciesOf(c, p, t, index).waitsOn.some((w) => toPhaseState(w.task.status) !== "done");
}
const NO_AREA = "__none";
const DAY = 864e5;
const sbLabels = {
  owner: "Эзэн",
  tasks: "Нээлттэй даалгавар",
  decisions: "Шийдвэр",
  pages: "Хуудас",
  prs: "PR",
  ungrouped: "Дэд чиглэлгүй",
  sessions: "мөр",
  session: "мөр",
  empty: "Тохирох мөр алга",
  running: "Явж байна",
  waiting: "Хүлээж байна",
  done: "Дууссан",
  idle: "Эхлээгүй",
  view: "Харагдац",
  groupsView: "Дэд чиглэл",
  statusView: "Төлвөөр",
  cardsView: "Карт",
  subItem: "даалгавар",
  subItems: "даалгавар",
  collapseKids: "Даалгавар нуух",
  expandKids: "Даалгавар харуулах",
  inParent: "төсөл:"
};
const parse = (d) => {
  if (!d) return null;
  const t = Date.parse(d.length === 10 ? `${d}T00:00:00` : d);
  return Number.isFinite(t) ? t : null;
};
function dueBucket(due, done, today) {
  const t = parse(due);
  if (t == null) return "none";
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (t < start) return done ? "later" : "overdue";
  return t <= start + 14 * DAY ? "soon" : "later";
}
function ProjectReportFor({ c, p, decisionsLabel = "Шийдвэр" }) {
  const index = taskIndex(c);
  const unit = c.units.find((u) => u.id === p.unitId);
  const states = p.tasks.map((t) => toPhaseState(t.status));
  const done = states.filter((s) => s === "done").length;
  const active = states.filter((s) => s === "active").length;
  const state = toPhaseState(p.status);
  const accountable = p.raci?.accountable ? actorOf(c, p.raci.accountable).name : void 0;
  const phases = p.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    due: t.due,
    owner: t.ownerId ? actorOf(c, t.ownerId).name : void 0,
    line: [t.ownerId ? actorOf(c, t.ownerId).role : "", dependencyText(c, p, t, index)].filter(Boolean).join(" · ") || void 0
  }));
  return /* @__PURE__ */ jsx(
    ProjectReport,
    {
      project: {
        name: p.name,
        icon: initials(p.name).charAt(0),
        status: { label: phaseLabel[state], tone: phaseTone[state] },
        owner: accountable ?? unit?.name,
        updated: p.due,
        summary: [areaLabel(c, p.area), areaLabel(c, p.subArea)].filter(Boolean).join(" › ") || unit?.name
      },
      kpis: [
        { label: "Даалгавар", value: p.tasks.length },
        { label: "Дууссан", value: done, tone: "green" },
        { label: "Явж байна", value: active, tone: "blue" },
        { label: decisionsLabel, value: p.decisions.length }
      ],
      progress: { value: p.tasks.length ? done / p.tasks.length * 100 : 0, label: "Явц" },
      phases,
      waiting: p.tasks.filter((t) => toPhaseState(t.status) === "blocked" || toPhaseState(t.status) !== "done" && isHeld(c, p, t, index)).map((t) => ({
        id: t.id,
        title: t.title,
        line: [t.ownerId ? actorOf(c, t.ownerId).name : "", dependenciesOf(c, p, t, index).waitsOn.length ? dependencyText(c, p, t, index).split(" · ")[0] : ""].filter(Boolean).join(" · ") || void 0,
        tone: "amber"
      })),
      labels: {
        owner: "Хариуцагч",
        updated: "Хугацаа",
        progress: "Явц",
        phases: "Даалгавар",
        waiting: "Хүлээгдэж буй",
        nothingWaiting: "Хүлээгдэж буй зүйл алга.",
        view: "Харагдац",
        status: "Жагсаалт",
        cards: "Карт",
        done: "Дууссан",
        active: "Явж байна",
        blocked: "Хүлээгдэж байна",
        next: "Дараа",
        sharedWith: "Хамт"
      }
    }
  );
}
function Dashboard({ c, scoped, today = /* @__PURE__ */ new Date(), empty }) {
  const index = taskIndex(c);
  const [status, setStatus] = React.useState("all");
  const [owner, setOwner] = React.useState("all");
  const [due, setDue] = React.useState("all");
  const [pick, setPick] = React.useState(null);
  const uid = React.useId();
  const taskDue = (p, t) => t.due ?? p.due;
  const isDone = (s) => toSessionState(s) === "done";
  const passes = (p, t) => (status === "all" || toSessionState(t.status) === status) && (owner === "all" || t.ownerId === owner) && (due === "all" || dueBucket(taskDue(p, t), isDone(t.status), today) === due);
  const filtering = status !== "all" || owner !== "all" || due !== "all";
  const owners = Array.from(new Set(scoped.projects.flatMap((p) => p.tasks.map((t) => t.ownerId).filter(Boolean)))).map((id) => actorOf(c, id)).sort((a, b) => a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "person" ? -1 : 1);
  const allTasks = scoped.projects.flatMap((p) => p.tasks.map((t) => ({ p, t })));
  const summary = [
    { k: "Төсөл", v: scoped.projects.length },
    { k: "Нээлттэй даалгавар", v: allTasks.filter(({ t }) => !isDone(t.status)).length },
    { k: "Хугацаа хэтэрсэн", v: allTasks.filter(({ p, t }) => dueBucket(taskDue(p, t), isDone(t.status), today) === "overdue").length, tone: "amber" },
    { k: "14 хоногт", v: allTasks.filter(({ p, t }) => dueBucket(taskDue(p, t), isDone(t.status), today) === "soon").length }
  ];
  const areas = /* @__PURE__ */ new Map();
  for (const p of scoped.projects) {
    const key = areaLabel(c, p.area) || NO_AREA;
    areas.set(key, [...areas.get(key) ?? [], p]);
  }
  const picked = scoped.projects.find((p) => p.id === pick) ?? null;
  if (!scoped.projects.length) return /* @__PURE__ */ jsx(Empty, { text: empty, icon: "folder" });
  return /* @__PURE__ */ jsxs("div", { className: "cv-dash", children: [
    /* @__PURE__ */ jsx("dl", { className: "cv-stats cv-dash-stats", children: summary.map((s, i) => /* @__PURE__ */ jsxs("div", { className: `cv-stat${s.tone ? ` is-${s.tone}` : ""}`, style: { "--i": i }, children: [
      /* @__PURE__ */ jsx("dt", { children: s.k }),
      /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(CountUp, { value: s.v }) })
    ] }, s.k)) }),
    owners.some((o) => o.kind === "person") && /* @__PURE__ */ jsx("div", { className: "cv-people", role: "group", "aria-label": "Хүнээр шүүх", children: owners.filter((o) => o.kind === "person").map((o) => /* @__PURE__ */ jsxs("button", { type: "button", "aria-pressed": owner === o.id, onClick: () => setOwner(owner === o.id ? "all" : o.id), children: [
      /* @__PURE__ */ jsx("span", { className: "cv-ava is-person", style: { "--s": "20px" }, "aria-hidden": "true", children: initials(o.name) }),
      o.name
    ] }, o.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "cv-filters", role: "group", "aria-label": "Шүүлт", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Төлөв" }),
        /* @__PURE__ */ jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), id: `${uid}-st`, children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Бүгд" }),
          /* @__PURE__ */ jsx("option", { value: "running", children: "Явж байна" }),
          /* @__PURE__ */ jsx("option", { value: "waiting", children: "Хүлээж байна" }),
          /* @__PURE__ */ jsx("option", { value: "idle", children: "Эхлээгүй" }),
          /* @__PURE__ */ jsx("option", { value: "done", children: "Дууссан" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Эзэн" }),
        /* @__PURE__ */ jsxs("select", { value: owner, onChange: (e) => setOwner(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Бүгд" }),
          owners.map((o) => /* @__PURE__ */ jsxs("option", { value: o.id, children: [
            o.kind === "agent" ? "✦ " : "",
            o.name
          ] }, o.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Хугацаа" }),
        /* @__PURE__ */ jsxs("select", { value: due, onChange: (e) => setDue(e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Бүгд" }),
          /* @__PURE__ */ jsx("option", { value: "overdue", children: "Хэтэрсэн" }),
          /* @__PURE__ */ jsx("option", { value: "soon", children: "14 хоногт" }),
          /* @__PURE__ */ jsx("option", { value: "none", children: "Хугацаагүй" })
        ] })
      ] }),
      filtering && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "cv-clear",
          onClick: () => {
            setStatus("all");
            setOwner("all");
            setDue("all");
          },
          children: "Цэвэрлэх"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `cv-dash-body${picked ? " has-pick" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: "cv-areas", children: [...areas.entries()].map(([area, projects]) => {
        const sessions = [];
        const subs = /* @__PURE__ */ new Map();
        for (const p of projects) {
          const tasks = p.tasks.filter((t) => passes(p, t));
          if (filtering && !tasks.length) continue;
          const sub = areaLabel(c, p.subArea);
          if (sub) subs.set(sub, sub);
          const done = p.tasks.filter((t) => isDone(t.status)).length;
          const acc = p.raci?.accountable ? actorOf(c, p.raci.accountable) : null;
          sessions.push({
            id: p.id,
            title: p.name,
            status: p.status,
            group: sub || void 0,
            owner: acc?.name,
            line: [`${done}/${p.tasks.length} даалгавар`, p.due ? `хугацаа ${p.due}` : ""].filter(Boolean).join(" · ")
          });
          for (const t of tasks) {
            const o = t.ownerId ? actorOf(c, t.ownerId) : null;
            const d = taskDue(p, t);
            const bucket = dueBucket(d, isDone(t.status), today);
            sessions.push({
              id: `${p.id}:${t.id}`,
              title: t.title,
              status: t.status,
              group: sub || void 0,
              parent: p.id,
              owner: o?.name,
              line: [o?.name, d ? `${bucket === "overdue" ? "⚠ хэтэрсэн " : ""}${d}` : "", dependencyText(c, p, t, index)].filter(Boolean).join(" · ") || void 0
            });
          }
        }
        const projectRows = sessions.filter((s) => !s.parent);
        return /* @__PURE__ */ jsxs("section", { className: "cv-area", "aria-label": area === NO_AREA ? "Чиглэлгүй" : area, children: [
          /* @__PURE__ */ jsxs("h4", { className: "cv-area-h", children: [
            /* @__PURE__ */ jsx("span", { className: "cv-area-mark", "aria-hidden": "true" }),
            area === NO_AREA ? "Чиглэлгүй" : area,
            /* @__PURE__ */ jsx("span", { className: "cv-count", children: projectRows.length })
          ] }),
          projectRows.length === 0 ? /* @__PURE__ */ jsx(Empty, { text: "Шүүлтэд тохирох зүйл алга.", icon: "filter" }) : /* @__PURE__ */ jsx(
            SessionBoard,
            {
              project: {
                name: area === NO_AREA ? "Чиглэлгүй" : area,
                icon: area === NO_AREA ? "·" : initials(area).charAt(0),
                stats: { tasks: sessions.filter((s) => s.parent && toSessionState(s.status) !== "done").length }
              },
              groups: [...subs.keys()].map((s) => ({ id: s, label: s })),
              sessions,
              labels: sbLabels,
              selectedId: pick,
              onSessionClick: (s) => setPick(s.parent ?? s.id)
            }
          )
        ] }, area);
      }) }),
      picked && /* @__PURE__ */ jsxs("aside", { className: "cv-pick", "aria-label": picked.name, children: [
        /* @__PURE__ */ jsxs("div", { className: "cv-pick-bar", children: [
          /* @__PURE__ */ jsx("span", { children: "Сонгосон төсөл" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setPick(null), "aria-label": "Хаах", children: "×" })
        ] }),
        /* @__PURE__ */ jsx(ProjectReportFor, { c, p: picked }, picked.id)
      ] })
    ] })
  ] });
}
const dashboardCss = `
.cv-dash{display:flex;flex-direction:column;gap:12px}
.cv-dash-stats{grid-template-columns:repeat(4,minmax(0,1fr))}
.cv-stat.is-amber dd{color:color-mix(in srgb,var(--cv-amber) 85%,var(--cv-fg))}
.cv-people{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:1px}
.cv-people button{flex:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px 0 4px;border:1px solid var(--cv-line);border-radius:15px;background:var(--cv-bg);font-size:13px;white-space:nowrap}
.cv-people button[aria-pressed=true]{border-color:transparent;background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff);font-weight:500}
.cv-filters{display:flex;flex-wrap:wrap;align-items:flex-end;gap:8px}
.cv-filters label{display:flex;flex-direction:column;gap:3px;font-size:11.5px;font-weight:500;color:var(--cv-muted)}
.cv-filters select{height:32px;min-width:140px;padding:0 28px 0 10px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);color:var(--cv-fg);font:inherit;font-size:13px}
.cv-clear{height:32px;padding:0 12px;border:0;border-radius:8px;background:var(--cv-soft);color:var(--cv-fg);font-size:13px}
.cv-dash-body{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:start}
.cv-dash-body.has-pick{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}
.cv-areas{display:flex;flex-direction:column;gap:16px;min-width:0}
.cv-area-h{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:14px;font-weight:600}
.cv-area-mark{width:10px;height:10px;border-radius:3px;background:var(--cv-accent)}
.cv-area .sb,.cv-pick .rp{max-width:none}
.cv-empty-sm{padding:12px;font-size:13px}
.cv-pick{position:sticky;top:8px;display:flex;flex-direction:column;gap:8px;min-width:0;animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both}
.cv-pick-bar{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--cv-muted)}
.cv-pick-bar button{width:28px;height:28px;border:0;border-radius:7px;background:var(--cv-soft);font-size:16px;line-height:1}
@container cv (max-width:1000px){.cv-dash-body.has-pick{grid-template-columns:minmax(0,1fr)}.cv-pick{position:static;order:-1}}
@container cv (max-width:560px){.cv-dash-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.cv-filters label{flex:1 1 40%}.cv-filters select{min-width:0;width:100%}}
`;
const methodologyName = {
  bmc: "Бизнес загварын канвас",
  "lean-canvas": "Lean Canvas",
  okr: "OKR",
  pmbok: "PMBOK"
};
const methodologyShort = { bmc: "BMC", "lean-canvas": "Lean Canvas", okr: "OKR", pmbok: "PMBOK" };
const BMC = [
  { key: "partners", area: "kp", title: "Гол түнш", hint: "Хэнтэй хамтрах вэ" },
  { key: "activities", area: "ka", title: "Гол үйл ажиллагаа", hint: "Юу хийх вэ" },
  { key: "resources", area: "kr", title: "Гол нөөц", hint: "Юу хэрэгтэй вэ" },
  { key: "value", area: "vp", title: "Үнэ цэнийн санал", hint: "Ямар үнэ цэнэ өгөх вэ" },
  { key: "relationships", area: "cr", title: "Харилцагчтай харилцаа", hint: "Хэрхэн харилцах вэ" },
  { key: "channels", area: "ch", title: "Суваг", hint: "Хэрхэн хүрэх вэ" },
  { key: "customers", area: "cs", title: "Үйлчлүүлэгчийн сегмент", hint: "Хэнд зориулах вэ" },
  { key: "costs", area: "co", title: "Зардлын бүтэц", hint: "Юунд зарцуулах вэ" },
  { key: "revenue", area: "rv", title: "Орлогын урсгал", hint: "Юугаар орлого олох вэ" }
];
const LEAN = [
  { key: "problem", area: "kp", title: "Асуудал", hint: "Ямар асуудал вэ" },
  { key: "solution", area: "ka", title: "Шийдэл", hint: "Хэрхэн шийдэх вэ" },
  { key: "metrics", area: "kr", title: "Гол хэмжүүр", hint: "Юугаар хэмжих вэ" },
  { key: "value", area: "vp", title: "Өвөрмөц санал", hint: "Яагаад биднийг сонгох вэ" },
  { key: "advantage", area: "cr", title: "Өрсөлдөхүйц давуу тал", hint: "Юугаар давуу вэ" },
  { key: "channels", area: "ch", title: "Суваг", hint: "Хэрхэн хүрэх вэ" },
  { key: "customers", area: "cs", title: "Үйлчлүүлэгчийн сегмент", hint: "Хэнд зориулах вэ" },
  { key: "costs", area: "co", title: "Зардлын бүтэц", hint: "Юунд зарцуулах вэ" },
  { key: "revenue", area: "rv", title: "Орлогын урсгал", hint: "Юугаар орлого олох вэ" }
];
function Canvas({ c, blocks, label, hideEmpty = false }) {
  const shown = blocks.filter((b) => c.model[b.key] !== null && (!hideEmpty || modelLines(c.model[b.key]).length > 0));
  const flow = shown.length < blocks.length;
  if (!shown.length) return null;
  return /* @__PURE__ */ jsx("div", { className: `cv-bmc${flow ? " is-flow" : ""}`, role: "group", "aria-label": label, children: shown.map((b, i) => /* @__PURE__ */ jsxs("section", { className: `cv-bmc-cell is-${b.area}`, style: { gridArea: flow ? void 0 : b.area, "--i": i }, "aria-label": b.title, children: [
    /* @__PURE__ */ jsxs("h4", { children: [
      b.title,
      /* @__PURE__ */ jsx("small", { children: b.hint })
    ] }),
    /* @__PURE__ */ jsx(Lines, { f: c.model[b.key], empty: "Бөглөөгүй" })
  ] }, b.key)) });
}
const GTD = {
  inbox: { label: "Ирсэн", icon: "inbox", tone: "idle" },
  next: { label: "Дараагийн алхам", icon: "arrow-right", tone: "idle" },
  progress: { label: "Хийж байна", icon: "play", tone: "running" },
  waiting: { label: "Хүлээж байна", icon: "hourglass", tone: "needs-you" },
  completed: { label: "Дууссан", icon: "circle-check", tone: "done" },
  cancelled: { label: "Цуцалсан", icon: "x", tone: "idle" }
};
function gtdOf(status) {
  const v = String(status ?? "").toLowerCase().replace(/[\s_]+/g, "-");
  if (["completed", "complete", "done", "finished"].includes(v)) return GTD.completed;
  if (["cancelled", "canceled", "dropped"].includes(v)) return GTD.cancelled;
  if (["waiting", "waiting-on", "blocked", "on-hold"].includes(v)) return GTD.waiting;
  if (["in-progress", "active", "doing", "running", "ongoing"].includes(v)) return GTD.progress;
  if (["next-action", "next", "planning", "todo"].includes(v)) return GTD.next;
  return GTD.inbox;
}
function Due({ due, today }) {
  const t = parseDay(due);
  if (t == null) return null;
  const days = Math.round((t - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 864e5);
  const text = days < 0 ? `${-days} хоног хэтэрсэн` : days === 0 ? "өнөөдөр" : days === 1 ? "маргааш" : `${days} хоногийн дараа`;
  const tone = days < 0 ? " is-over" : days <= 7 ? " is-soon" : "";
  return /* @__PURE__ */ jsxs("time", { className: `cl-date cv-due${tone}`, dateTime: due.slice(0, 10), title: due.slice(0, 10), children: [
    /* @__PURE__ */ jsx(Icon, { name: days < 0 ? "clock" : "calendar", size: 14 }),
    text
  ] });
}
function TaskRow({ c, t, today }) {
  const g = gtdOf(t.status);
  const closed = g === GTD.completed || g === GTD.cancelled;
  const owner = t.ownerId ? actorOf(c, t.ownerId) : null;
  return /* @__PURE__ */ jsxs("li", { className: `cv-trow${closed ? " is-closed" : ""}`, children: [
    /* @__PURE__ */ jsxs("span", { className: `cl-pill cv-gtd is-${g.tone}`, title: g.label, children: [
      /* @__PURE__ */ jsx(Icon, { name: g.icon, size: 14 }),
      /* @__PURE__ */ jsx("span", { className: "cv-gtd-l", children: g.label })
    ] }, g.label),
    /* @__PURE__ */ jsx("span", { className: "cv-trow-t", children: t.title }),
    /* @__PURE__ */ jsxs("span", { className: "cv-trow-meta", children: [
      !closed && /* @__PURE__ */ jsx(PriorityBadge, { value: t.priority }),
      !closed && /* @__PURE__ */ jsx(Due, { due: t.due, today }),
      owner && /* @__PURE__ */ jsxs("span", { className: "cl-rel cv-trow-owner", title: owner.name, children: [
        /* @__PURE__ */ jsx(Avatar, { actor: owner, size: 16 }),
        /* @__PURE__ */ jsx("span", { children: owner.name })
      ] })
    ] })
  ] });
}
function BmcView({ c, scoped, hideEmpty = false, today = /* @__PURE__ */ new Date() }) {
  const notes = scoped.notes ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "cv-method", children: [
    /* @__PURE__ */ jsx(Canvas, { c, blocks: BMC, label: "Бизнес загварын канвас", hideEmpty }),
    /* @__PURE__ */ jsxs("div", { className: "cv-below", children: [
      /* @__PURE__ */ jsxs("section", { className: "cv-below-col", "aria-label": "Төсөл ба даалгавар", children: [
        /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Төсөл → даалгавар" }),
        scoped.projects.length ? /* @__PURE__ */ jsx("ul", { className: "cv-plist", children: scoped.projects.map((p) => {
          const done = p.tasks.filter((t) => toPhaseState(t.status) === "done").length;
          return /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsxs("span", { className: "cv-plist-top", children: [
              /* @__PURE__ */ jsx("i", { className: `cv-dot is-${toPhaseState(p.status)}`, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("strong", { children: p.name }),
              p.tasks.length > 0 && /* @__PURE__ */ jsx(ProgressNM, { value: `${done}/${p.tasks.length}` })
            ] }),
            p.tasks.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "cv-tlist", children: p.tasks.map((t) => /* @__PURE__ */ jsx(TaskRow, { c, t, today }, t.id)) }) : /* @__PURE__ */ jsxs("p", { className: "cv-tnone", children: [
              /* @__PURE__ */ jsx(Icon, { name: "square-check", size: 14 }),
              " Даалгавар алга"
            ] })
          ] }, p.id);
        }) }) : /* @__PURE__ */ jsx(Empty, { text: "Төсөл алга.", icon: "folder" })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "cv-below-col", "aria-label": "Нот", children: [
        /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Нот" }),
        notes.length ? /* @__PURE__ */ jsx("ul", { className: "cv-notes", children: notes.map((n) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: "cv-note-title", children: n.title }),
          /* @__PURE__ */ jsx("span", { className: "cv-note-meta", children: [n.projectId ? c.projects.find((p) => p.id === n.projectId)?.name : null, n.date].filter(Boolean).join(" · ") })
        ] }, n.id)) }) : /* @__PURE__ */ jsx(Empty, { text: "Нот алга.", icon: "file-text" })
      ] })
    ] })
  ] });
}
function OkrView({ c, scoped }) {
  const okrs = scoped.okrs ?? [];
  if (!okrs.length) return /* @__PURE__ */ jsx(Empty, { text: "OKR бүртгэгдээгүй.", icon: "layout-template" });
  return /* @__PURE__ */ jsx("div", { className: "cv-okrs", children: okrs.map((o, i) => {
    const avg = o.keyResults.length ? Math.round(o.keyResults.reduce((n, k) => n + Math.max(0, Math.min(100, k.progress)), 0) / o.keyResults.length) : 0;
    const owner = o.ownerId ? actorOf(c, o.ownerId) : null;
    return /* @__PURE__ */ jsxs("article", { className: "cv-okr", style: { "--i": i }, "aria-label": o.title, children: [
      /* @__PURE__ */ jsxs("header", { children: [
        /* @__PURE__ */ jsxs("span", { className: "cv-okr-o", children: [
          "O",
          i + 1
        ] }),
        /* @__PURE__ */ jsx("strong", { children: o.title }),
        /* @__PURE__ */ jsxs("span", { className: "cv-okr-pct", children: [
          avg,
          "%"
        ] })
      ] }),
      owner && /* @__PURE__ */ jsxs("span", { className: "cv-okr-owner", children: [
        /* @__PURE__ */ jsx(Avatar, { actor: owner, size: 18 }),
        " ",
        owner.name
      ] }),
      /* @__PURE__ */ jsx("ul", { children: o.keyResults.map((k, j) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsxs("span", { className: "cv-kr-t", children: [
          /* @__PURE__ */ jsxs("span", { className: "cv-okr-k", children: [
            "KR",
            j + 1
          ] }),
          k.title
        ] }),
        /* @__PURE__ */ jsx("span", { className: "cv-kr-bar", role: "progressbar", "aria-label": k.title, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(k.progress), children: /* @__PURE__ */ jsx("span", { style: { width: `${Math.max(0, Math.min(100, k.progress))}%` } }) }),
        /* @__PURE__ */ jsxs("span", { className: "cv-kr-n", children: [
          Math.round(k.progress),
          "%"
        ] })
      ] }, k.id)) })
    ] }, o.id);
  }) });
}
const PHASE_NAME = {
  initiating: "Эхлүүлэх",
  planning: "Төлөвлөх",
  executing: "Гүйцэтгэх",
  monitoring: "Хянах",
  closing: "Хаах"
};
const AREA_NAME = {
  integration: "Нэгтгэл",
  scope: "Хамрах хүрээ",
  schedule: "Хуваарь",
  cost: "Зардал",
  quality: "Чанар",
  resource: "Нөөц",
  communications: "Харилцаа",
  risk: "Эрсдэл",
  procurement: "Худалдан авалт",
  stakeholder: "Оролцогч"
};
const ts = (d) => {
  if (!d) return null;
  const n = Date.parse(d.length === 10 ? `${d}T00:00:00` : d);
  return Number.isFinite(n) ? n : null;
};
function PmbokView({ c, scoped, today }) {
  const [cell, setCell] = React.useState(null);
  const items = scoped.projects.flatMap(
    (p) => p.tasks.map((t) => ({
      p,
      t,
      phase: toPmPhase(t.phase ?? p.phase),
      area: toPmArea(t.knowledgeArea ?? p.knowledgeArea),
      start: ts(t.start ?? p.start),
      end: ts(t.end ?? t.due ?? p.end)
    }))
  );
  const at = (ph, ar) => items.filter((x) => x.phase === ph && x.area === ar);
  const max = Math.max(1, ...PM_PHASES.flatMap((ph) => PM_AREAS.map((ar) => at(ph, ar).length)));
  const picked = cell ? items.filter((x) => `${x.phase}|${x.area}` === cell) : [];
  const done = items.filter((x) => toPhaseState(x.t.status) === "done").length;
  const live = PM_PHASES.map((ph) => ({ ph, n: items.filter((x) => x.phase === ph && toPhaseState(x.t.status) === "active").length })).sort((a, b) => b.n - a.n)[0];
  const starts = items.map((x) => x.start).filter((n) => n != null);
  const ends = items.map((x) => x.end).filter((n) => n != null);
  const fmt = (n) => {
    const d = new Date(n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const facts = [
    { label: "Даалгавар", value: String(items.length) },
    { label: "Гүйцэтгэл", value: items.length ? `${Math.round(done / items.length * 100)}%` : "0%" },
    { label: "Идэвхтэй бүлэг", value: live && live.n ? PHASE_NAME[live.ph] : "Алга" },
    { label: "Хугацаа", value: starts.length && ends.length ? `${fmt(Math.min(...starts))} → ${fmt(Math.max(...ends))}` : "Тодорхойгүй" },
    { label: "Шийдвэр", value: String(scoped.projects.reduce((n, p) => n + p.decisions.length, 0)) },
    ...c.facts ?? []
  ];
  const dated = items.filter((x) => x.start != null && x.end != null).sort((a, b) => a.start - b.start);
  const lo = dated.length ? Math.min(...dated.map((x) => x.start)) : 0;
  const hi = dated.length ? Math.max(...dated.map((x) => x.end)) : 1;
  const span = Math.max(1, hi - lo);
  const pct = (n) => (n - lo) / span * 100;
  const months = [];
  if (dated.length) {
    const d = new Date(lo);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    for (let guard = 0; d.getTime() < hi && guard < 36; guard++) {
      const m = String(d.getMonth() + 1).padStart(2, "0");
      months.push({ at: pct(d.getTime()), label: d.getMonth() === 0 || !months.length ? `${d.getFullYear()}.${m}` : m });
      d.setMonth(d.getMonth() + 1);
    }
  }
  const now = today.getTime();
  return /* @__PURE__ */ jsxs("div", { className: "cv-method", children: [
    /* @__PURE__ */ jsxs("section", { className: "cv-facts", "aria-label": "Баримтын төв", children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Баримтын төв" }),
      /* @__PURE__ */ jsx("dl", { children: facts.map((f, i) => /* @__PURE__ */ jsxs("div", { style: { "--i": i }, children: [
        /* @__PURE__ */ jsx("dt", { children: f.label }),
        /* @__PURE__ */ jsx("dd", { children: f.value })
      ] }, f.label + i)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-label": "Процессын бүлэг × мэдлэгийн чиглэл", children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "5 процессын бүлэг × 10 мэдлэгийн чиглэл" }),
      /* @__PURE__ */ jsx("div", { className: "cv-pm-scroll", tabIndex: 0, role: "region", "aria-label": "PMBOK матриц", children: /* @__PURE__ */ jsxs("table", { className: "cv-pm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { scope: "col" }),
          PM_PHASES.map((ph) => /* @__PURE__ */ jsx("th", { scope: "col", children: PHASE_NAME[ph] }, ph))
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: PM_AREAS.map((ar) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { scope: "row", children: AREA_NAME[ar] }),
          PM_PHASES.map((ph) => {
            const list = at(ph, ar);
            const key = `${ph}|${ar}`;
            const finished = list.filter((x) => toPhaseState(x.t.status) === "done").length;
            return /* @__PURE__ */ jsx("td", { children: list.length ? /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "cv-pm-cell",
                "aria-pressed": cell === key,
                style: { "--a": list.length / max, "--d": finished / list.length },
                onClick: () => setCell(cell === key ? null : key),
                title: list.map((x) => x.t.title).join("\n"),
                children: [
                  list.length,
                  /* @__PURE__ */ jsxs("span", { className: "cv-sr", children: [
                    " ",
                    "даалгавар, ",
                    AREA_NAME[ar],
                    " · ",
                    PHASE_NAME[ph]
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsx("span", { className: "cv-raci-dot", "aria-hidden": "true" }) }, ph);
          })
        ] }, ar)) })
      ] }) }),
      picked.length > 0 && /* @__PURE__ */ jsx("ul", { className: "cv-pm-picked", children: picked.map((x) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("i", { className: `cv-dot is-${toPhaseState(x.t.status)}`, "aria-hidden": "true" }),
        x.t.title,
        x.t.ownerId && /* @__PURE__ */ jsx("small", { children: actorOf(c, x.t.ownerId).name })
      ] }, x.p.id + x.t.id)) }),
      items.length > 0 && items.every((x) => !x.phase || !x.area) && /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Даалгавруудад үе шат, мэдлэгийн чиглэл бүртгэгдээгүй." })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-label": "Гант график", children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Гант график" }),
      dated.length ? /* @__PURE__ */ jsxs("div", { className: "cv-gantt", children: [
        /* @__PURE__ */ jsx("div", { className: "cv-gantt-scale", "aria-hidden": "true", children: months.map((m) => /* @__PURE__ */ jsx("span", { style: { left: `${m.at}%` }, children: m.label }, m.label)) }),
        /* @__PURE__ */ jsx("ol", { className: "cv-gantt-rows", children: dated.map((x, i) => {
          const s = toPhaseState(x.t.status);
          return /* @__PURE__ */ jsxs("li", { style: { "--i": i }, children: [
            /* @__PURE__ */ jsx("span", { className: "cv-gantt-label", children: x.t.title }),
            /* @__PURE__ */ jsxs("span", { className: "cv-gantt-track", children: [
              months.map((m) => /* @__PURE__ */ jsx("i", { className: "cv-gantt-grid", style: { left: `${m.at}%` } }, m.label)),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `cv-gantt-bar is-${s}`,
                  style: { left: `${pct(x.start)}%`, width: `${Math.max(1.2, pct(x.end) - pct(x.start))}%` },
                  title: `${fmt(x.start)} → ${fmt(x.end)}`
                }
              ),
              now >= lo && now <= hi && /* @__PURE__ */ jsx("i", { className: "cv-gantt-today", style: { left: `${pct(now)}%` } })
            ] })
          ] }, x.p.id + x.t.id);
        }) }),
        /* @__PURE__ */ jsxs("p", { className: "cv-legend", children: [
          /* @__PURE__ */ jsx("span", { className: "cv-gantt-key is-done" }),
          " Дууссан ",
          /* @__PURE__ */ jsx("span", { className: "cv-gantt-key is-active" }),
          " Явж байна ",
          /* @__PURE__ */ jsx("span", { className: "cv-gantt-key is-blocked" }),
          " Хүлээгдэж байна",
          " ",
          /* @__PURE__ */ jsx("span", { className: "cv-gantt-key is-next" }),
          " Дараа ",
          /* @__PURE__ */ jsx("span", { className: "cv-gantt-key is-today" }),
          " Өнөөдөр"
        ] })
      ] }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Эхлэх, дуусах огноотой даалгавар алга." })
    ] })
  ] });
}
function MethodologyView({
  c,
  scoped,
  methodology,
  today = /* @__PURE__ */ new Date(),
  hideEmpty = false
}) {
  if (methodology === "pmbok") return /* @__PURE__ */ jsx(PmbokView, { c, scoped, today });
  if (methodology === "okr") return /* @__PURE__ */ jsx(OkrView, { c, scoped });
  if (methodology === "lean-canvas")
    return /* @__PURE__ */ jsx("div", { className: "cv-method", children: /* @__PURE__ */ jsx(Canvas, { c, blocks: LEAN, label: "Lean Canvas", hideEmpty }) });
  return /* @__PURE__ */ jsx(BmcView, { c, scoped, hideEmpty, today });
}
const methodologyCss = `
.cv-method{display:flex;flex-direction:column;gap:18px;container:cv/inline-size}
.cv-bmc{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-areas:"kp ka vp cr cs" "kp kr vp ch cs" "co co co rv rv";gap:6px}
.cv-bmc.is-flow{grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));grid-template-areas:none}
.cv-bmc-cell{min-width:0;padding:12px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 40ms)}
.cv-bmc-cell h4{display:flex;flex-direction:column;gap:1px;margin:0 0 8px;font:600 11px/1.3 var(--ts-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-bmc-cell h4 small{font-size:10.5px;font-weight:400;letter-spacing:.03em;color:var(--cv-faint)}
.cv-bmc-cell .cv-model-text{font-size:15px;font-weight:500}
.cv-bmc-cell .cv-model-list{gap:0}
.cv-bmc-cell .cv-model-list li{padding:7px 0;font-size:15px;font-weight:500;line-height:1.35;border-bottom:1px solid var(--cv-line)}
.cv-bmc-cell .cv-model-list li:last-child{border-bottom:0}
.cv-bmc-cell.is-vp{background:linear-gradient(160deg,var(--cv-accent-soft),var(--cv-bg) 75%);border-color:color-mix(in srgb,var(--cv-accent) 35%,var(--cv-line))}
.cv-bmc-cell.is-vp .cv-model-text{font-family:var(--ts-font-display,inherit);font-size:19px;font-weight:500;line-height:1.4}
.cv-none.cv-model-text{color:var(--cv-faint);font-size:13px}
.cv-below{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:12px}
.cv-below-col{min-width:0;padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cv-below-h{margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-plist,.cv-notes{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.cv-plist-top{display:flex;align-items:center;gap:8px}
.cv-plist-top strong{flex:1;min-width:0;font-weight:600}
.cv-tlist{container-type:inline-size;display:flex;flex-direction:column;gap:2px;margin:6px 0 0 15px;padding:0 0 0 12px;border-left:1.5px solid var(--cv-line);list-style:none;font-size:13px}
/* task row: GTD pill · title · priority, due, owner (the Collection row parts) */
.cv-trow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:4px 8px;min-height:30px;padding:3px 0;color:var(--cv-fg)}
.cv-trow-t{min-width:0}
.cv-trow-meta{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:6px}
.cv-trow.is-closed .cv-trow-t{color:var(--cv-muted)}
.cv-trow-owner{max-width:160px}.cv-trow-owner>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-gtd{flex:none;animation:cv-gtd-in var(--ts-motion-dur-base,.32s) var(--ts-motion-ease-spring,cubic-bezier(.34,1.56,.64,1)) both}
.cv-gtd.is-idle{background:var(--ts-status-idle-bg,#f0eee8);color:var(--ts-status-idle-fg,#45433f)}
.cv-gtd.is-running{background:var(--ts-status-running-bg,#e6f0fd);color:var(--ts-status-running-fg,#1d5fb8)}
.cv-gtd.is-needs-you{background:var(--ts-status-needs-you-bg,#fdf0e1);color:var(--ts-status-needs-you-fg,#a33e0b)}
.cv-gtd.is-done{background:var(--ts-status-done-bg,#e5f4ea);color:var(--ts-status-done-fg,#1d6b3a)}
:where(.dark,[data-theme=dark]) .cv-gtd.is-idle{background:var(--ts-status-idle-bg,#34332f);color:var(--ts-status-idle-fg,#d3d0c8)}
:where(.dark,[data-theme=dark]) .cv-gtd.is-running{background:var(--ts-status-running-bg,#1d2b40);color:var(--ts-status-running-fg,#93c5fd)}
:where(.dark,[data-theme=dark]) .cv-gtd.is-needs-you{background:var(--ts-status-needs-you-bg,#3a2717);color:var(--ts-status-needs-you-fg,#f0a46a)}
:where(.dark,[data-theme=dark]) .cv-gtd.is-done{background:var(--ts-status-done-bg,#173a25);color:var(--ts-status-done-fg,#86d6a0)}
@keyframes cv-gtd-in{from{opacity:0;transform:scale(.88)}}
.cv-due.is-soon{color:var(--ts-status-needs-you-fg,#a33e0b)}
.cv-due.is-over{color:var(--ts-status-error-fg,#b42318)}
:where(.dark,[data-theme=dark]) .cv-due.is-soon{color:var(--ts-status-needs-you-fg,#f0a46a)}
:where(.dark,[data-theme=dark]) .cv-due.is-over{color:var(--ts-status-error-fg,#f47b7f)}
.cv-tnone{display:flex;align-items:center;gap:6px;margin:6px 0 0 27px;color:var(--cv-muted);font-size:13px}
/* narrow column or phone: meta goes under the title */
@container (max-width:520px){.cv-trow{grid-template-columns:auto minmax(0,1fr)}.cv-trow-meta{grid-column:2;justify-content:flex-start}}
/* phone: the pill keeps its icon and colour, its word stays for screen readers; meta takes the full width */
@container (max-width:420px){.cv-gtd{padding-inline:5px}.cv-gtd-l{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.cv-trow-meta{grid-column:1/-1;padding-left:30px}}
@media (prefers-reduced-motion:reduce){.cv-gtd{animation:none}}
.cv-notes li{display:flex;flex-direction:column;padding:8px 10px;border-radius:8px;background:var(--cv-soft)}
.cv-note-title{font-size:13.5px}
.cv-note-meta{font-size:12px;color:var(--cv-muted)}
.cv-okrs{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}
.cv-okr{display:flex;flex-direction:column;gap:8px;padding:14px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 60ms)}
.cv-okr header{display:flex;align-items:flex-start;gap:8px}
.cv-okr header strong{flex:1;font-weight:600;line-height:1.35}
.cv-okr-o{flex:none;padding:2px 6px;border-radius:5px;background:var(--cv-violet-soft);color:color-mix(in srgb,var(--cv-violet) 80%,var(--cv-fg));font-size:11.5px;font-weight:700}
.cv-okr-pct{font-weight:650;font-variant-numeric:tabular-nums}
.cv-okr-owner{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--cv-muted)}
.cv-okr ul{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.cv-okr li{display:grid;grid-template-columns:minmax(0,1fr) 80px 36px;align-items:center;gap:8px;font-size:13px}
.cv-kr-t{min-width:0}
.cv-okr-k{margin-right:6px;font-size:11px;font-weight:600;color:var(--cv-faint)}
.cv-kr-bar{position:relative;height:6px;border-radius:3px;background:var(--cv-soft);overflow:hidden}
.cv-kr-bar span{position:absolute;inset:0 auto 0 0;border-radius:3px;background:var(--cv-accent);transform-origin:left;animation:cv-grow .8s cubic-bezier(.2,.8,.3,1) .2s both}
.cv-kr-n{text-align:right;font-variant-numeric:tabular-nums;color:var(--cv-muted)}
.cv-facts dl{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px;margin:0}
.cv-facts dl>div{display:flex;flex-direction:column-reverse;padding:10px 12px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);animation:cv-in .3s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 40ms)}
.cv-facts dt{font-size:12px;color:var(--cv-muted)}
.cv-facts dd{margin:0;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}
.cv-pm-scroll{overflow-x:auto;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cv-pm{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px}
.cv-pm th,.cv-pm td{padding:6px 8px;border-bottom:1px solid var(--cv-line);text-align:center}
.cv-pm tbody tr:last-child>*{border-bottom:0}
.cv-pm thead th{font-size:11.5px;font-weight:600;color:var(--cv-muted);white-space:nowrap}
.cv-pm th[scope=row]{position:sticky;left:0;background:var(--cv-bg);text-align:left;font-weight:600;white-space:nowrap;border-right:1px solid var(--cv-line)}
.cv-pm-cell{position:relative;min-width:34px;height:30px;padding:0 8px;border:1px solid color-mix(in srgb,var(--cv-accent) 30%,var(--cv-line));border-radius:7px;background:color-mix(in srgb,var(--cv-accent) calc(var(--a,0) * 32%),var(--cv-bg));font-weight:650;font-variant-numeric:tabular-nums;overflow:hidden}
.cv-pm-cell::after{content:"";position:absolute;left:0;bottom:0;height:3px;width:calc(var(--d,0) * 100%);background:var(--cv-green)}
.cv-pm-cell[aria-pressed=true]{outline:2px solid var(--cv-accent);outline-offset:1px}
.cv-pm-picked{display:flex;flex-direction:column;gap:4px;margin:8px 0 0;padding:0;list-style:none}
.cv-pm-picked li{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:8px;background:var(--cv-soft);font-size:13px}
.cv-pm-picked small{margin-left:auto;color:var(--cv-muted)}
.cv-gantt{display:flex;flex-direction:column;gap:6px;padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cv-gantt-scale{position:relative;height:16px;margin-left:var(--gl,200px);font-size:11px;color:var(--cv-faint)}
.cv-gantt-scale span{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
.cv-gantt-rows{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.cv-gantt-rows li{display:grid;grid-template-columns:var(--gl,200px) minmax(0,1fr);align-items:center;min-height:26px;animation:cv-in .3s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 30ms)}
.cv-gantt-label{padding-right:10px;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-gantt-track{position:relative;height:20px}
.cv-gantt-grid{position:absolute;top:-3px;bottom:-3px;width:1px;background:var(--cv-line)}
.cv-gantt-bar{position:absolute;top:4px;height:12px;border-radius:4px;background:var(--cv-faint);transform-origin:left;animation:cv-grow .6s cubic-bezier(.2,.8,.3,1) .1s both}
.cv-gantt-bar.is-done,.cv-gantt-key.is-done{background:var(--cv-green)}
.cv-gantt-bar.is-active,.cv-gantt-key.is-active{background:var(--cv-accent)}
.cv-gantt-bar.is-blocked,.cv-gantt-key.is-blocked{background:var(--cv-amber)}
.cv-gantt-bar.is-next,.cv-gantt-key.is-next{background:color-mix(in srgb,var(--cv-faint) 55%,var(--cv-bg))}
.cv-gantt-today{position:absolute;top:-4px;bottom:-4px;width:2px;margin-left:-1px;background:var(--cv-red,#dc2626);opacity:.75}
.cv-gantt-key{display:inline-block;width:12px;height:8px;margin-left:6px;border-radius:2px}
.cv-gantt-key.is-today{width:2px;height:12px;background:var(--cv-red,#dc2626)}
@container cv (max-width:900px){.cv-bmc{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-areas:"vp vp" "cs cr" "ch ka" "kr kp" "rv co"}.cv-below{grid-template-columns:minmax(0,1fr)}}
@container cv (max-width:560px){.cv-bmc{grid-template-columns:minmax(0,1fr);grid-template-areas:"vp" "cs" "cr" "ch" "ka" "kr" "kp" "rv" "co"}.cv-gantt{--gl:0px}.cv-gantt-rows li{grid-template-columns:minmax(0,1fr)}.cv-gantt-label{padding:4px 0 0}.cv-okr li{grid-template-columns:minmax(0,1fr) 60px 34px}}
`;
const companyMiniLabelsMn = {
  overview: "Тойм",
  projects: "Төсөл",
  agents: "Агент",
  statProjects: "Төсөл",
  statActive: "Хийж байна",
  statWaiting: "Таны ээлж",
  noTasks: "Даалгавар алга",
  noProjects: "Төсөл алга",
  noAgents: "Агент алга",
  updated: "Шинэчлэгдсэн",
  pause: "Түр зогсоох",
  play: "Үргэлжлүүлэх",
  replay: "Дахин тоглуулах",
  tabs: "Харагдац"
};
const TABS = [
  { key: "overview", icon: "layout-dashboard" },
  { key: "projects", icon: "folder" },
  { key: "agents", icon: "bot" }
];
const STORY$1 = [
  { tab: "overview", status: "next-action", hold: 2200 },
  { tab: "overview", status: "in-progress", hold: 2400 },
  { tab: "projects", status: "in-progress", hold: 2600 },
  { tab: "agents", status: "waiting", hold: 2600 },
  { tab: "overview", status: "waiting", hold: 2e3 },
  { tab: "overview", status: "completed", hold: 2800 }
];
const IDLE_MS$1 = 8e3;
function pickTasks(c, n) {
  const rank = (t) => {
    const g = gtdOf(t.status).tone;
    return g === "running" ? 0 : g === "needs-you" ? 1 : g === "idle" ? 2 : 3;
  };
  return c.projects.flatMap((p) => p.tasks.map((t) => ({ t, key: `${p.id}:${t.id}` }))).sort((a, b) => rank(a.t) - rank(b.t) || (parseDay(a.t.due) ?? Infinity) - (parseDay(b.t.due) ?? Infinity)).slice(0, n);
}
function CompanyMini({
  company,
  today = /* @__PURE__ */ new Date(),
  labels,
  story = true,
  badge
}) {
  const L = { ...companyMiniLabelsMn, ...labels };
  const uid = React.useId();
  const reduced = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [step, setStep] = React.useState(0);
  const [tab, setTab] = React.useState("overview");
  const [paused, setPaused] = React.useState(false);
  const [busyUntil, setBusyUntil] = React.useState(0);
  const [, tick] = React.useState(0);
  const [cycles, setCycles] = React.useState(0);
  const rested = cycles >= 3;
  const playing = story && !reduced && !paused && !rested && Date.now() >= busyUntil;
  React.useEffect(() => {
    if (!playing) return;
    const last = step === STORY$1.length - 1;
    if (last && cycles >= 2) {
      const t2 = window.setTimeout(() => setCycles(3), STORY$1[step].hold);
      return () => window.clearTimeout(t2);
    }
    const t = window.setTimeout(() => {
      const next = last ? 0 : step + 1;
      if (last) setCycles((n) => n + 1);
      setStep(next);
      setTab(STORY$1[next].tab);
    }, STORY$1[step].hold + (last ? 4e3 : 0));
    return () => window.clearTimeout(t);
  }, [playing, step, cycles]);
  React.useEffect(() => {
    if (!busyUntil) return;
    const t = window.setTimeout(() => tick((n) => n + 1), Math.max(0, busyUntil - Date.now()) + 20);
    return () => window.clearTimeout(t);
  }, [busyUntil]);
  const touch = () => setBusyUntil(Date.now() + IDLE_MS$1);
  const pickTab = (k) => {
    touch();
    setTab(k);
  };
  const replay = () => {
    setPaused(false);
    setBusyUntil(0);
    setCycles(0);
    setStep(0);
    setTab(STORY$1[0].tab);
  };
  const mover = company.projects[0]?.tasks.find((t) => !["completed", "done", "cancelled"].includes(t.status)) ?? null;
  const c = story && mover && !reduced ? { ...company, projects: company.projects.map((p, i) => i ? p : { ...p, tasks: p.tasks.map((t) => t === mover ? { ...t, status: STORY$1[step].status } : t) }) } : company;
  const tasks = c.projects.flatMap((p) => p.tasks);
  const active = tasks.filter((t) => gtdOf(t.status).tone === "running").length;
  const waiting = tasks.filter((t) => gtdOf(t.status).tone === "needs-you").length;
  const stats = [
    { k: L.statProjects, v: c.projects.length, icon: "folder", tone: "" },
    { k: L.statActive, v: active, icon: "play", tone: "is-running" },
    { k: L.statWaiting, v: waiting, icon: "hourglass", tone: waiting ? "is-needs-you" : "" }
  ];
  const label = (k) => L[k];
  return /* @__PURE__ */ jsxs("div", { className: "cv-mini", onPointerDown: touch, onKeyDown: touch, onWheel: touch, children: [
    /* @__PURE__ */ jsxs("header", { className: "cv-mini-h", children: [
      /* @__PURE__ */ jsx(TypeBadge, { type: "company", size: 24 }),
      /* @__PURE__ */ jsx("strong", { className: "cv-mini-name", children: company.name }),
      badge && /* @__PURE__ */ jsx("span", { className: "cv-tag", children: badge }),
      company.exportedAt && /* @__PURE__ */ jsxs("span", { className: "cv-mini-asof", title: `${L.updated}: ${company.exportedAt.slice(0, 10)}`, children: [
        /* @__PURE__ */ jsx(Icon, { name: "clock", size: 12 }),
        /* @__PURE__ */ jsx("time", { dateTime: company.exportedAt, children: company.exportedAt.slice(0, 10) })
      ] }),
      story && !reduced && /* @__PURE__ */ jsxs("span", { className: "cv-mini-ctl", children: [
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": paused ? L.play : L.pause, "aria-pressed": paused, onClick: () => setPaused((p) => !p), children: /* @__PURE__ */ jsx(Icon, { name: paused ? "play" : "pause", size: 12 }) }),
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": L.replay, onClick: replay, children: /* @__PURE__ */ jsx(Icon, { name: "rotate-ccw", size: 12 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "cv-mini-tabs", role: "tablist", "aria-label": L.tabs, children: TABS.map(({ key, icon }) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        role: "tab",
        id: `${uid}-${key}`,
        "aria-selected": tab === key,
        "aria-controls": `${uid}-panel`,
        tabIndex: tab === key ? 0 : -1,
        onClick: () => pickTab(key),
        onKeyDown: (e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          const i = TABS.findIndex((x) => x.key === tab);
          const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length].key;
          pickTab(next);
          e.currentTarget.parentElement?.querySelector(`#${CSS.escape(`${uid}-${next}`)}`)?.focus();
        },
        children: [
          /* @__PURE__ */ jsx(Icon, { name: icon, size: 14 }),
          label(key)
        ]
      },
      key
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "cv-mini-panel", role: "tabpanel", id: `${uid}-panel`, "aria-labelledby": `${uid}-${tab}`, children: [
      tab === "overview" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("dl", { className: "cv-mini-stats", children: stats.map((s) => /* @__PURE__ */ jsxs("div", { className: `cv-mini-stat ${s.tone}`, children: [
          /* @__PURE__ */ jsxs("dt", { children: [
            /* @__PURE__ */ jsx(Icon, { name: s.icon, size: 12 }),
            s.k
          ] }),
          /* @__PURE__ */ jsx("dd", { children: s.v })
        ] }, s.k)) }),
        tasks.length ? /* @__PURE__ */ jsx("ul", { className: "cv-tlist cv-mini-tasks", children: pickTasks(c, 4).map(({ t, key }) => /* @__PURE__ */ jsx(TaskRow, { c, t, today }, key)) }) : /* @__PURE__ */ jsx(Empty, { text: L.noTasks, icon: "square-check" })
      ] }),
      tab === "projects" && (c.projects.length ? /* @__PURE__ */ jsx("ul", { className: "cv-mini-list", children: c.projects.slice(0, 4).map((p) => {
        const done = p.tasks.filter((t) => gtdOf(t.status).tone === "done").length;
        const g = gtdOf(p.status);
        return /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: `cl-pill cv-gtd is-${g.tone}`, title: g.label, children: /* @__PURE__ */ jsx(Icon, { name: g.icon, size: 12 }) }),
          /* @__PURE__ */ jsx("span", { className: "cv-mini-t", children: p.name }),
          p.tasks.length > 0 && /* @__PURE__ */ jsx(ProgressNM, { value: `${done}/${p.tasks.length}` })
        ] }, p.id);
      }) }) : /* @__PURE__ */ jsx(Empty, { text: L.noProjects, icon: "folder" })),
      tab === "agents" && (c.agents.length ? /* @__PURE__ */ jsx("ul", { className: "cv-mini-list", children: c.agents.slice(0, 4).map((a) => {
        const owner = a.ownerId ? actorOf(c, a.ownerId) : null;
        const busy = tasks.find((t) => t.ownerId === a.id && gtdOf(t.status).tone === "running");
        return /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx(Avatar, { actor: { name: a.name, kind: "agent" }, size: 20 }),
          /* @__PURE__ */ jsxs("span", { className: "cv-mini-t", children: [
            a.name,
            /* @__PURE__ */ jsx("small", { children: busy ? busy.title : a.role })
          ] }),
          owner && /* @__PURE__ */ jsxs("span", { className: "cl-rel", title: owner.name, children: [
            /* @__PURE__ */ jsx(Avatar, { actor: owner, size: 16 }),
            /* @__PURE__ */ jsx("span", { children: owner.name })
          ] })
        ] }, a.id);
      }) }) : /* @__PURE__ */ jsx(Empty, { text: L.noAgents, icon: "bot" }))
    ] }, tab)
  ] });
}
const companyMiniCss = `
.cv-mini{display:flex;flex-direction:column;gap:8px;min-height:340px;max-height:380px;padding:12px;border:1px solid var(--cv-line);border-radius:14px;background:var(--cv-bg);font-size:13px;line-height:1.35;overflow:hidden}
.cv-mini-h{display:flex;align-items:center;gap:8px;min-width:0}
.cv-mini-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:600}
.cv-mini-asof{display:inline-flex;align-items:center;gap:4px;margin-left:auto;color:var(--cv-muted);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}
.cv-mini-ctl{display:inline-flex;gap:2px}
.cv-mini-ctl button{display:grid;place-items:center;width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--cv-muted);cursor:pointer}
.cv-mini-ctl button:hover{background:var(--cv-soft);color:var(--cv-fg)}
.cv-mini-tabs{display:flex;gap:4px;padding:3px;border-radius:10px;background:var(--cv-soft)}
.cv-mini-tabs button{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--cv-muted);font:inherit;font-size:12px;font-weight:500;cursor:pointer;transition:background .2s,color .2s}
.cv-mini-tabs button[aria-selected=true]{background:var(--cv-bg);color:var(--cv-fg);box-shadow:0 1px 2px #0000001a}
.cv-mini-tabs button:focus-visible,.cv-mini-ctl button:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:1px}
.cv-mini-panel{display:flex;flex-direction:column;gap:8px;min-height:0;animation:cv-mini-in var(--ts-motion-dur-base,.32s) var(--ts-motion-ease-out,ease-out) both}
@keyframes cv-mini-in{from{opacity:0;transform:translateY(4px)}}
.cv-mini-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0}
.cv-mini-stat{display:flex;flex-direction:column-reverse;gap:2px;padding:7px 9px;border:1px solid var(--cv-line);border-radius:9px}
.cv-mini-stat dt{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--cv-muted)}
.cv-mini-stat dd{margin:0;font-size:18px;font-weight:600;font-variant-numeric:tabular-nums}
.cv-mini-stat.is-running dd{color:var(--ts-status-running-fg,#1d5fb8)}
.cv-mini-stat.is-needs-you dd{color:var(--ts-status-needs-you-fg,#a33e0b)}
:where(.dark,[data-theme=dark]) .cv-mini-stat.is-running dd{color:var(--ts-status-running-fg,#93c5fd)}
:where(.dark,[data-theme=dark]) .cv-mini-stat.is-needs-you dd{color:var(--ts-status-needs-you-fg,#f0a46a)}
.cv-mini-tasks{margin:0;padding:0;border:0;font-size:12.5px}
.cv-mini-tasks .cv-trow{min-height:26px;padding:1px 0}
.cv-mini-list{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.cv-mini-list li{display:flex;align-items:center;gap:8px;min-height:36px;padding:4px 6px;border-radius:8px}
.cv-mini-list li:hover{background:var(--cv-soft)}
.cv-mini-list .cv-gtd{padding-inline:5px}
.cv-mini-t{display:flex;flex-direction:column;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-mini-t small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--cv-muted);font-size:12px}
.cv-mini .cv-empty{padding:16px}
@media (prefers-reduced-motion:reduce){.cv-mini-panel{animation:none}}
`;
const lettersIn = (r, id) => {
  if (!r) return [];
  const out = [];
  if (r.responsible?.includes(id)) out.push("R");
  if (r.accountable === id) out.push("A");
  if (r.consulted?.includes(id)) out.push("C");
  if (r.informed?.includes(id)) out.push("I");
  return out;
};
function taskRaciOf(p, id) {
  const own = raciOf(p, id);
  const seen = /* @__PURE__ */ new Set();
  for (const t of p.tasks) for (const l of lettersIn(t.raci, id)) if (!own.includes(l)) seen.add(l);
  return ["R", "A", "C", "I"].filter((l) => seen.has(l));
}
const LETTER = { R: "Гүйцэтгэгч", A: "Хариуцагч", C: "Зөвлөх", I: "Мэдээлэгдэх" };
function RaciView({ c, scoped, onPerson, empty }) {
  const projects = scoped.projects;
  const ids = /* @__PURE__ */ new Set();
  const collect = (r) => {
    if (!r) return;
    [...r.responsible ?? [], r.accountable, ...r.consulted ?? [], ...r.informed ?? []].forEach((id) => id && ids.add(id));
  };
  for (const p of projects) {
    collect(p.raci);
    for (const t of p.tasks) collect(t.raci);
  }
  if (!ids.size) return /* @__PURE__ */ jsx(Empty, { text: empty, icon: "grid-3x3" });
  const actors = [...ids].map((id) => actorOf(c, id)).sort((a, b) => a.kind === b.kind ? 0 : a.kind === "person" ? -1 : 1);
  return /* @__PURE__ */ jsxs("div", { className: "cv-raci", children: [
    /* @__PURE__ */ jsx("div", { className: "cv-raci-scroll", tabIndex: 0, role: "region", "aria-label": "RACI", children: /* @__PURE__ */ jsxs("table", { className: "cv-raci-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "cv-raci-corner", children: "Хүн / агент" }),
        projects.map((p) => /* @__PURE__ */ jsx("th", { scope: "col", className: p.raci || p.tasks.some((t) => t.raci) ? "" : "is-none", children: /* @__PURE__ */ jsx("span", { children: p.name }) }, p.id))
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: actors.map((a, i) => /* @__PURE__ */ jsxs("tr", { style: { "--i": i }, children: [
        /* @__PURE__ */ jsx("th", { scope: "row", children: a.kind === "person" ? /* @__PURE__ */ jsxs("button", { type: "button", className: "cv-raci-who", onClick: () => onPerson(a.id), children: [
          /* @__PURE__ */ jsx(Avatar, { actor: a, size: 24 }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: a.name }),
            /* @__PURE__ */ jsx("small", { children: a.role })
          ] })
        ] }) : /* @__PURE__ */ jsxs("span", { className: "cv-raci-who is-agent", children: [
          /* @__PURE__ */ jsx(Avatar, { actor: a, size: 24 }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: a.name }),
            /* @__PURE__ */ jsx("small", { children: a.role || "агент" })
          ] })
        ] }) }),
        projects.map((p) => {
          const roles = raciOf(p, a.id);
          const viaTask = taskRaciOf(p, a.id);
          const label = [...roles.map((r) => LETTER[r]), ...viaTask.map((r) => `${LETTER[r]} (даалгавараар)`)].join(", ");
          return /* @__PURE__ */ jsx("td", { title: label || void 0, children: roles.length || viaTask.length ? /* @__PURE__ */ jsxs("span", { className: "cv-raci-cell", children: [
            roles.map((r) => /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r}`, children: r }, r)),
            viaTask.map((r) => /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r} is-task`, children: r }, `t${r}`)),
            /* @__PURE__ */ jsx("span", { className: "cv-sr", children: label })
          ] }) : /* @__PURE__ */ jsx("span", { className: "cv-raci-dot", "aria-hidden": "true" }) }, p.id);
        })
      ] }, a.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("p", { className: "cv-legend", children: [
      ["R", "A", "C", "I"].map((r) => /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r}`, children: r }),
        " ",
        LETTER[r]
      ] }, r)),
      projects.some((p) => p.tasks.some((t) => t.raci)) && /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("span", { className: "cv-raci-l is-R is-task", children: "R" }),
        " даалгавараар"
      ] }),
      projects.some((p) => !p.raci && !p.tasks.some((t) => t.raci)) && /* @__PURE__ */ jsx("span", { className: "cv-raci-note", children: "Саарал багана = RACI бүртгэгдээгүй төсөл" })
    ] })
  ] });
}
function PersonProfile({ c, person, onClose, themeClass = "" }) {
  const closeRef = React.useRef(null);
  React.useEffect(() => {
    const back = document.activeElement;
    closeRef.current?.focus();
    const key = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      back?.focus?.();
    };
  }, [onClose]);
  const unit = c.units.find((u) => u.id === person.unitId);
  const responsible = c.projects.map((p) => ({ p, roles: raciOf(p, person.id) })).filter((x) => x.roles.includes("R") || x.roles.includes("A"));
  const respTasks = c.projects.flatMap(
    (p) => p.tasks.map((t) => ({ p, t, roles: lettersIn(t.raci, person.id) })).filter((x) => x.roles.includes("R") || x.roles.includes("A"))
  );
  const owned = c.agents.filter((a) => a.ownerId === person.id);
  const coworkers = c.agents.filter(
    (a) => a.ownerId !== person.id && c.workflows.some((w) => w.steps.some((s) => s.actorId === person.id) && w.steps.some((s) => s.actorId === a.id))
  );
  const agents = [...owned.map((a) => ({ a, how: "эзэмшдэг" })), ...coworkers.map((a) => ({ a, how: "ажлын урсгалд хамт" }))];
  const sheet = /* @__PURE__ */ jsx("div", { className: "cv-sheet-wrap", onMouseDown: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ jsxs("section", { className: "cv-sheet", role: "dialog", "aria-modal": "true", "aria-labelledby": "cv-profile-name", children: [
    /* @__PURE__ */ jsxs("header", { className: "cv-sheet-head", children: [
      /* @__PURE__ */ jsx("span", { className: "cv-sheet-ava", "aria-hidden": "true", children: initials(person.name) }),
      /* @__PURE__ */ jsxs("div", { className: "cv-sheet-id", children: [
        /* @__PURE__ */ jsx("h3", { id: "cv-profile-name", children: person.name }),
        /* @__PURE__ */ jsxs("p", { children: [
          person.role,
          unit ? ` · ${unit.name}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { ref: closeRef, type: "button", className: "cv-sheet-close", onClick: onClose, "aria-label": "Профайл хаах", children: "×" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cv-sheet-body", children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Тухай" }),
        person.about ? /* @__PURE__ */ jsx("p", { className: "cv-about", children: person.about }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Тухай мэдээлэл бүртгэгдээгүй." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Карьер" }),
        person.cv?.length ? /* @__PURE__ */ jsx("ol", { className: "cv-cv", children: person.cv.map((e, i) => /* @__PURE__ */ jsxs("li", { style: { "--i": i }, children: [
          /* @__PURE__ */ jsx("span", { className: "cv-cv-period", children: e.period }),
          /* @__PURE__ */ jsx("span", { className: "cv-cv-title", children: e.title }),
          e.org && /* @__PURE__ */ jsx("span", { className: "cv-cv-org", children: e.org })
        ] }, e.period + e.title + i)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "CV бүртгэгдээгүй." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Холбоос" }),
        person.links?.length ? /* @__PURE__ */ jsx("ul", { className: "cv-links", children: person.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: l.url, target: "_blank", rel: "noreferrer noopener", children: [
          l.label,
          " ↗"
        ] }) }, l.url)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Нийтийн холбоос алга." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Хариуцсан төсөл" }),
        responsible.length ? /* @__PURE__ */ jsx("ul", { className: "cv-resp", children: responsible.map(({ p, roles }) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { children: p.name }),
          /* @__PURE__ */ jsx("span", { className: "cv-raci-cell", children: roles.map((r) => /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r}`, title: LETTER[r], children: r }, r)) })
        ] }, p.id)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "R эсвэл A үүрэгтэй төсөл алга." })
      ] }),
      respTasks.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Хариуцсан даалгавар" }),
        /* @__PURE__ */ jsx("ul", { className: "cv-resp", children: respTasks.map(({ p, t, roles }) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsxs("span", { children: [
            t.title,
            /* @__PURE__ */ jsx("small", { className: "cv-resp-sub", children: p.name })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "cv-raci-cell", children: roles.map((r) => /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r}`, title: LETTER[r], children: r }, r)) })
        ] }, p.id + t.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Хамтран ажилладаг агент" }),
        agents.length ? /* @__PURE__ */ jsx("ul", { className: "cv-resp", children: agents.map(({ a, how }) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsxs("span", { className: "cv-resp-agent", children: [
            /* @__PURE__ */ jsx(Avatar, { actor: { name: a.name, kind: "agent" }, size: 22 }),
            a.name
          ] }),
          /* @__PURE__ */ jsx("small", { children: how })
        ] }, a.id)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Холбоотой агент алга." })
      ] })
    ] })
  ] }) });
  if (typeof document === "undefined") return sheet;
  return createPortal(/* @__PURE__ */ jsx("div", { className: `cv cv-layer ${themeClass}`, children: sheet }), document.body);
}
const raciCss = `
.cv-raci{display:flex;flex-direction:column;gap:10px}
.cv-raci-scroll{max-width:100%;overflow-x:auto;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cv-raci-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}
.cv-raci-table th,.cv-raci-table td{padding:8px 10px;border-bottom:1px solid var(--cv-line);text-align:center;vertical-align:middle}
.cv-raci-table tbody tr:last-child>*{border-bottom:0}
.cv-raci-table thead th{position:sticky;top:0;background:var(--cv-bg);font-size:12px;font-weight:600;color:var(--cv-muted);white-space:nowrap}
.cv-raci-table thead th span{display:inline-block;max-width:150px;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom}
.cv-raci-table thead th.is-none{color:var(--cv-faint);font-weight:400}
.cv-raci-table th[scope=row],.cv-raci-corner{position:sticky;left:0;z-index:1;background:var(--cv-bg);text-align:left;border-right:1px solid var(--cv-line)}
.cv-raci-corner{z-index:2}
.cv-raci-table tbody tr{animation:cv-in .3s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 35ms)}
.cv-raci-who{display:flex;align-items:center;gap:8px;min-width:150px;max-width:220px;padding:2px 4px;border:0;border-radius:7px;background:none;text-align:left}
button.cv-raci-who:hover{background:var(--cv-soft)}
.cv-raci-who>span:last-child{display:flex;flex-direction:column;min-width:0}
.cv-raci-who strong{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-raci-who small{font-size:11.5px;color:var(--cv-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-raci-cell{display:inline-flex;gap:3px}
.cv-raci-l{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:6px;font-size:12px;font-weight:700}
.cv-raci-l.is-R{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 75%,var(--cv-fg))}
.cv-raci-l.is-A{background:var(--cv-fg);color:var(--cv-bg)}
.cv-raci-l.is-C{background:var(--cv-teal-soft);color:color-mix(in srgb,var(--cv-teal) 75%,var(--cv-fg))}
.cv-raci-l.is-I{background:var(--cv-soft);color:var(--cv-muted)}
.cv-raci-l.is-task{outline:1px dashed currentColor;outline-offset:-1px;background:none}.cv-raci-l.is-A.is-task{color:var(--cv-fg)}
.cv-resp-sub{display:block;font-size:11.5px;color:var(--cv-muted)}
.cv-raci-dot{display:inline-block;width:4px;height:4px;border-radius:50%;background:var(--cv-line)}
.cv-raci-note{color:var(--cv-faint)}
.cv-none{margin:0;color:var(--cv-faint);font-size:13px}
.cv-layer{position:static;width:0;height:0}
.cv-sheet-wrap{position:fixed;inset:0;z-index:50;display:flex;justify-content:flex-end;background:#0000002e;animation:cv-fade .18s ease both}
.cv-sheet{display:flex;flex-direction:column;width:min(440px,100%);height:100%;background:var(--cv-bg);color:var(--cv-fg);border-left:1px solid var(--cv-line);box-shadow:-12px 0 40px #00000024;animation:cv-slide .28s cubic-bezier(.2,.8,.3,1) both;overflow:hidden}
.cv-sheet-head{display:flex;align-items:center;gap:12px;padding:18px 18px 14px;border-bottom:1px solid var(--cv-line)}
.cv-sheet-ava{display:grid;place-items:center;flex:none;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--cv-accent),var(--cv-violet));color:#fff;font-size:17px;font-weight:700}
.cv-sheet-id{flex:1;min-width:0}
.cv-sheet-id h3{margin:0;font-size:18px;font-weight:650;letter-spacing:-.01em}
.cv-sheet-id p{margin:2px 0 0;font-size:13px;color:var(--cv-muted)}
.cv-sheet-close{flex:none;width:32px;height:32px;border:0;border-radius:8px;background:var(--cv-soft);font-size:18px;line-height:1}
.cv-sheet-body{flex:1;overflow-y:auto;padding:16px 18px 24px;display:flex;flex-direction:column;gap:18px}
.cv-sheet-body h4{margin:0 0 8px;font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-about{margin:0;font-size:14px;line-height:1.55}
.cv-cv{position:relative;margin:0;padding:0 0 0 18px;list-style:none;border-left:2px solid var(--cv-line)}
.cv-cv li{position:relative;display:flex;flex-direction:column;padding:0 0 12px;animation:cv-in .3s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms + 80ms)}
.cv-cv li::before{content:"";position:absolute;left:-24px;top:4px;width:10px;height:10px;border-radius:50%;background:var(--cv-bg);border:2px solid var(--cv-accent)}
.cv-cv li:first-child::before{background:var(--cv-accent)}
.cv-cv-period{font-size:12px;color:var(--cv-muted);font-variant-numeric:tabular-nums}
.cv-cv-title{font-weight:600}
.cv-cv-org{font-size:13px;color:var(--cv-muted)}
.cv-links{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.cv-links a{display:inline-flex;align-items:center;height:28px;padding:0 10px;border:1px solid var(--cv-line);border-radius:14px;color:var(--cv-fg);font-size:13px;text-decoration:none}
.cv-links a:hover{background:var(--cv-soft)}
.cv-resp{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.cv-resp li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 10px;border-radius:8px;background:var(--cv-soft);font-size:13.5px}
.cv-resp small{color:var(--cv-muted);font-size:12px}
.cv-resp-agent{display:inline-flex;align-items:center;gap:8px}
@keyframes cv-slide{from{transform:translateX(30px);opacity:0}}
@container cv (max-width:560px){.cv-raci-who{min-width:120px}.cv-raci-table th,.cv-raci-table td{padding:7px 8px}}
`;
const COMPANY_VIEWS = ["method", "dashboard", "structure", "agents", "workflows", "raci", "decisions"];
const companyLabelsMn = {
  method: "Арга зүй",
  model: "Бизнес загвар",
  dashboard: "Самбар",
  raci: "RACI",
  structure: "Процесс",
  agents: "Хүн ба агент",
  workflows: "Ажлын урсгал",
  decisions: "Шийдвэр",
  institution: "Институц",
  company: "Компани",
  team: "Баг",
  department: "Хэлтэс",
  stream: "Чиглэл",
  exportedAt: "Шинэчлэгдсэн",
  area: "Чиглэл",
  types: "Төрлүүд",
  customers: "Үйлчлүүлэгч",
  value: "Үнэ цэнэ",
  channels: "Суваг",
  revenue: "Орлогын урсгал",
  units: "Нэгж",
  people: "Хүн",
  agents_n: "Агент",
  workflows_n: "Ажлын урсгал",
  projects_n: "Төсөл",
  level: "Түвшин",
  views: "Харагдац",
  layout: "Харагдац",
  methodology: "Арга зүй",
  workspace: "Ажлын орчин",
  brief: "Тайлан",
  noOwner: "Нэгжийн агент",
  ownedBy: "Эзэн",
  memory: "санах ой",
  trigger: "Эхлэх нөхцөл",
  approval: "хүний батламж",
  sequence: "дараалал",
  allProjects: "Бүгд",
  empty: "Энэ түвшинд мэдээлэл алга.",
  person: "Хүн",
  agent: "Агент",
  source: { acme: "ac.me ертөнц", vault: "Тэмдэглэлийн сан", visitor: "Зочин" },
  segment: { personal: "Хувь", team: "Баг", company: "Компани", institutional: "Институц" }
};
const levelOfKind = (k) => k === "institution" ? "institution" : k === "company" ? "company" : "team";
const TAB_ICON = {
  method: "layout-template",
  dashboard: "layout-dashboard",
  structure: "network",
  agents: "bot",
  workflows: "workflow",
  raci: "grid-3x3",
  decisions: "git-branch"
};
function asOfText(iso) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function ModelView({ c, scoped, L }) {
  const stats = [
    { k: L.units, v: scoped.units.length },
    { k: L.people, v: scoped.people.length },
    { k: L.agents_n, v: scoped.agents.length },
    { k: L.workflows_n, v: scoped.workflows.length },
    { k: L.projects_n, v: scoped.projects.length }
  ];
  const cells = [
    [L.customers, c.model.customers],
    [L.value, c.model.value],
    [L.channels, c.model.channels],
    [L.revenue, c.model.revenue]
  ].filter((x) => x[1] !== null);
  return /* @__PURE__ */ jsxs("div", { className: "cv-model", children: [
    /* @__PURE__ */ jsx("dl", { className: "cv-stats", children: stats.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "cv-stat", style: { "--i": i }, children: [
      /* @__PURE__ */ jsx("dt", { children: s.k }),
      /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(CountUp, { value: s.v }) })
    ] }, s.k)) }),
    /* @__PURE__ */ jsx("div", { className: "cv-canvas", children: cells.map(([k, f], i) => /* @__PURE__ */ jsxs("section", { className: `cv-cell cv-cell-${i}`, style: { "--i": i }, children: [
      /* @__PURE__ */ jsx("h4", { children: k }),
      /* @__PURE__ */ jsx(Lines, { f })
    ] }, k)) })
  ] });
}
function StructureView({ scoped, L, onPick, onPerson, current }) {
  const kids = (id) => scoped.units.filter((u) => u.parentId === id && u.id !== id);
  let order = 0;
  const node = (u, depth, seen2) => {
    if (seen2.has(u.id)) return null;
    seen2.add(u.id);
    const people = scoped.people.filter((p) => p.unitId === u.id);
    const agents = scoped.agents.filter((a) => a.unitId === u.id);
    const flows = scoped.workflows.filter((w) => w.unitId === u.id).length;
    const ch = kids(u.id);
    const i = order++;
    return /* @__PURE__ */ jsxs("li", { className: `cv-node is-${u.kind}`, style: { "--i": i, "--d": depth }, children: [
      /* @__PURE__ */ jsxs("div", { className: "cv-node-card", "aria-current": current === u.id ? "true" : void 0, children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "cv-node-pick", onClick: () => onPick(u), children: /* @__PURE__ */ jsxs("span", { className: "cv-node-top", children: [
          /* @__PURE__ */ jsx("span", { className: `cv-kind is-${u.kind}`, children: L[u.kind] }),
          /* @__PURE__ */ jsx("span", { className: "cv-node-name", children: u.name })
        ] }) }),
        /* @__PURE__ */ jsxs("span", { className: "cv-node-meta", children: [
          /* @__PURE__ */ jsxs("span", { className: "cv-faces", role: "group", "aria-label": `${people.length} ${L.people}`, children: [
            people.slice(0, 4).map((p) => /* @__PURE__ */ jsx("button", { type: "button", className: "cv-face", onClick: () => onPerson(p.id), "aria-label": `${p.name} — профайл`, title: p.name, children: /* @__PURE__ */ jsx(Avatar, { actor: { name: p.name, kind: "person" }, size: 20 }) }, p.id)),
            people.length > 4 && /* @__PURE__ */ jsxs("span", { className: "cv-more", children: [
              "+",
              people.length - 4
            ] })
          ] }),
          agents.length > 0 && /* @__PURE__ */ jsxs("span", { className: "cv-pill", children: [
            "✦ ",
            agents.length,
            " ",
            L.agents_n.toLowerCase()
          ] }),
          flows > 0 && /* @__PURE__ */ jsxs("span", { className: "cv-pill", children: [
            "↻ ",
            flows,
            " ",
            L.workflows_n.toLowerCase()
          ] })
        ] })
      ] }),
      ch.length > 0 && /* @__PURE__ */ jsx("ul", { className: "cv-tree", children: ch.map((k) => node(k, depth + 1, seen2)) })
    ] }, u.id);
  };
  const seen = /* @__PURE__ */ new Set();
  const roots = rootsOf(scoped.units);
  if (!roots.length) return /* @__PURE__ */ jsx(Empty, { text: L.empty, icon: "network" });
  return /* @__PURE__ */ jsx("ul", { className: "cv-tree cv-tree-root", children: roots.map((r) => node(r, 0, seen)) });
}
function AgentCard({ a, c, L, showOwner, focus }) {
  const owner = a.ownerId ? actorOf(c, a.ownerId) : null;
  return /* @__PURE__ */ jsxs("li", { className: `cv-agent${focus ? " is-focus" : ""}`, "data-agent": a.id, children: [
    /* @__PURE__ */ jsxs("span", { className: "cv-agent-top", children: [
      /* @__PURE__ */ jsx(Avatar, { actor: { name: a.name, kind: "agent" }, size: 26 }),
      /* @__PURE__ */ jsxs("span", { className: "cv-agent-id", children: [
        /* @__PURE__ */ jsx("strong", { children: a.name }),
        /* @__PURE__ */ jsx("span", { children: a.role })
      ] })
    ] }),
    a.skills.length > 0 && /* @__PURE__ */ jsx("span", { className: "cv-skills", children: a.skills.map((s) => /* @__PURE__ */ jsx("span", { className: "cv-skill", children: s }, s)) }),
    /* @__PURE__ */ jsxs("span", { className: "cv-agent-foot", children: [
      showOwner && owner && /* @__PURE__ */ jsxs("span", { children: [
        L.ownedBy,
        ": ",
        owner.name
      ] }),
      a.memory.length > 0 ? /* @__PURE__ */ jsxs("details", { className: "cv-mem", children: [
        /* @__PURE__ */ jsxs("summary", { children: [
          a.memory.length,
          " ",
          L.memory
        ] }),
        /* @__PURE__ */ jsx("ul", { children: a.memory.map((m) => /* @__PURE__ */ jsx("li", { children: m }, m)) })
      ] }) : /* @__PURE__ */ jsxs("span", { className: "cv-mem-none", children: [
        "0 ",
        L.memory
      ] })
    ] })
  ] });
}
function AgentsView({ c, scoped, L, onPerson, focus }) {
  const inScope = new Set(scoped.people.map((p) => p.id));
  const sections = scoped.units.map((u) => {
    const people = scoped.people.filter((p) => p.unitId === u.id).map((p) => ({ p, agents: scoped.agents.filter((a) => a.ownerId === p.id) }));
    const loose = scoped.agents.filter((a) => a.unitId === u.id && !(a.ownerId && inScope.has(a.ownerId)));
    return { u, people, loose };
  }).filter((s) => s.people.length || s.loose.length);
  if (!sections.length) return /* @__PURE__ */ jsx(Empty, { text: L.empty, icon: "bot" });
  return /* @__PURE__ */ jsx("div", { className: "cv-agents", children: sections.map(({ u, people, loose }, i) => /* @__PURE__ */ jsxs("section", { className: "cv-unit-block", style: { "--i": i }, "aria-label": u.name, children: [
    /* @__PURE__ */ jsxs("h4", { className: "cv-unit-h", children: [
      /* @__PURE__ */ jsx("span", { className: `cv-kind is-${u.kind}`, children: L[u.kind] }),
      u.name
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "cv-pairs", children: [
      people.map(({ p, agents }) => /* @__PURE__ */ jsxs("li", { className: "cv-pair", children: [
        /* @__PURE__ */ jsxs("button", { type: "button", className: "cv-person", onClick: () => onPerson(p.id), "aria-label": `${p.name}, ${p.role} — профайл`, children: [
          /* @__PURE__ */ jsx(Avatar, { actor: { name: p.name, kind: "person" }, size: 30 }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: p.name }),
            /* @__PURE__ */ jsx("span", { children: p.role })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: `cv-link${agents.length ? "" : " is-none"}`, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("ul", { className: "cv-agent-list", children: agents.map((a) => /* @__PURE__ */ jsx(AgentCard, { a, c, L, focus: focus === a.id }, a.id)) })
      ] }, p.id)),
      loose.length > 0 && /* @__PURE__ */ jsxs("li", { className: "cv-pair is-loose", children: [
        /* @__PURE__ */ jsxs("span", { className: "cv-person is-unit", children: [
          /* @__PURE__ */ jsx("span", { className: "cv-ava is-unit", style: { "--s": "30px" }, "aria-hidden": "true", children: "◇" }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: L.noOwner }),
            /* @__PURE__ */ jsx("span", { children: u.name })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "cv-link", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("ul", { className: "cv-agent-list", children: loose.map((a) => /* @__PURE__ */ jsx(AgentCard, { a, c, L, showOwner: true, focus: focus === a.id }, a.id)) })
      ] })
    ] })
  ] }, u.id)) });
}
function WorkflowView({ c, scoped, L }) {
  if (!scoped.workflows.length) return /* @__PURE__ */ jsx(Empty, { text: L.empty, icon: "workflow" });
  return /* @__PURE__ */ jsxs("div", { className: "cv-flows", children: [
    scoped.workflows.map((w, i) => {
      const unit = c.units.find((u) => u.id === w.unitId);
      return /* @__PURE__ */ jsxs("article", { className: "cv-flow", style: { "--i": i }, "aria-label": w.name, children: [
        /* @__PURE__ */ jsxs("header", { className: "cv-flow-head", children: [
          /* @__PURE__ */ jsx("strong", { children: w.name }),
          unit && /* @__PURE__ */ jsx("span", { className: "cv-flow-unit", children: unit.name }),
          /* @__PURE__ */ jsxs("span", { className: "cv-trigger", title: L.trigger, children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "⚡" }),
            " ",
            w.trigger
          ] })
        ] }),
        /* @__PURE__ */ jsx("ol", { className: "cv-steps", style: { "--n": w.steps.length }, children: w.steps.map((s, j) => {
          const actor = actorOf(c, s.actorId);
          const next = w.steps[j + 1];
          const gate = next && actorOf(c, next.actorId).kind === "person";
          return /* @__PURE__ */ jsxs("li", { className: `cv-step is-${actor.kind}${gate ? " gate-next" : ""}`, style: { "--j": j }, children: [
            /* @__PURE__ */ jsx("span", { className: "cv-step-n", children: String(j + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx("span", { className: "cv-step-label", children: s.label }),
            /* @__PURE__ */ jsxs("span", { className: "cv-step-actor", children: [
              /* @__PURE__ */ jsx(Avatar, { actor, size: 20 }),
              /* @__PURE__ */ jsx("span", { children: actor.name }),
              /* @__PURE__ */ jsxs("span", { className: "cv-sr", children: [
                ", ",
                actor.kind === "agent" ? L.agent : L.person
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "cv-step-out", children: [
              "↳ ",
              s.output
            ] })
          ] }, s.id);
        }) })
      ] }, w.id);
    }),
    /* @__PURE__ */ jsxs("p", { className: "cv-legend", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("span", { className: "cv-legend-line" }),
      " ",
      L.sequence,
      /* @__PURE__ */ jsx("span", { className: "cv-legend-line is-gate" }),
      " ",
      L.approval,
      /* @__PURE__ */ jsx("span", { className: "cv-ava is-person", style: { "--s": "16px" }, children: "А" }),
      " ",
      L.person,
      /* @__PURE__ */ jsx("span", { className: "cv-ava is-agent", style: { "--s": "16px" }, children: "✦" }),
      " ",
      L.agent
    ] })
  ] });
}
function DecisionsView({ scoped, L }) {
  const decisions = scoped.projects.flatMap((p) => p.decisions.map((d) => ({ id: `${p.id}:${d.id}`, title: d.title, project: p.name, due: d.date, options: [{ id: "made", label: "Шийдсэн" }] }))).sort((a, b) => (b.due ?? "").localeCompare(a.due ?? ""));
  if (!decisions.length) return /* @__PURE__ */ jsx(Empty, { text: L.empty, icon: "git-branch" });
  return /* @__PURE__ */ jsx("div", { className: "cv-decisions", children: /* @__PURE__ */ jsx(
    DecisionInboxChat,
    {
      title: `${L.decisions} · ${decisions.length}`,
      decisions,
      chosen: Object.fromEntries(decisions.map((d) => [d.id, "made"])),
      labels: { open: "нээлттэй", allDone: "Бүх шийдвэр бүртгэгдсэн.", chosen: "Төлөв", due: "Огноо", urgent: "Өнөөдөр", undo: "" }
    }
  ) });
}
function CompanyView({
  company,
  layout: layoutProp,
  defaultLayout = "workspace",
  onLayoutChange,
  showLayoutSwitch = true,
  methodology: methodologyProp,
  onMethodologyChange,
  showMethodologySwitch = true,
  today,
  showTree = true,
  hideEmptyBlocks = false,
  collection: collectionProp,
  onCollectionChange,
  onOpenInVault,
  onAskAgent,
  defaultLevel,
  defaultUnitId,
  defaultView = "method",
  view: viewProp,
  onScopeChange,
  labels: labelsProp,
  className = "",
  density = "full",
  previewLabels
}) {
  const L = { ...companyLabelsMn, ...labelsProp };
  const uid = React.useId();
  const available = LEVELS.filter((lv) => company.units.some((u) => kindsOf[lv].includes(u.kind)));
  const firstUnit = (lv) => company.units.find((u) => kindsOf[lv].includes(u.kind)) ?? null;
  const initial = (() => {
    const u = company.units.find((x) => x.id === defaultUnitId);
    if (u) return { level: levelOfKind(u.kind), unitId: u.id };
    const lv = defaultLevel && available.includes(defaultLevel) ? defaultLevel : available[0] ?? "company";
    return { level: lv, unitId: firstUnit(lv)?.id ?? null };
  })();
  const [scope, setScopeState] = React.useState(initial);
  const [view, setView] = React.useState(viewProp ?? defaultView);
  React.useEffect(() => {
    if (viewProp) setView(viewProp);
  }, [viewProp]);
  const [layoutOwn, setLayoutOwn] = React.useState(defaultLayout);
  const layout = layoutProp ?? layoutOwn;
  const [methodOwn, setMethodOwn] = React.useState(company.methodology ?? "bmc");
  const methodology = methodologyProp ?? methodOwn;
  const [personId, setPersonId] = React.useState(null);
  const [collectionOwn, setCollectionOwn] = React.useState(null);
  const collectionType = collectionProp !== void 0 ? collectionProp : collectionOwn;
  const setCollectionType = (t) => {
    setCollectionOwn(t);
    if (t !== collectionType) onCollectionChange?.(t);
  };
  const [focusAgent, setFocusAgent] = React.useState(null);
  const rootRef = React.useRef(null);
  const tabsRef = React.useRef([]);
  const firstView = React.useRef(true);
  React.useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    const tab = tabsRef.current[COMPANY_VIEWS.indexOf(view)];
    const strip = tab?.parentElement;
    if (tab && strip) strip.scrollTo?.({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [view]);
  React.useEffect(() => {
    setScopeState(initial);
    setMethodOwn(company.methodology ?? "bmc");
    setPersonId(null);
    setCollectionType(null);
  }, [company.id]);
  const setScope = (next) => {
    setScopeState(next);
    onScopeChange?.(next);
  };
  const pickLevel = (lv) => {
    if (!available.includes(lv)) return;
    const kinds = kindsOf[lv];
    const byId = (id) => company.units.find((u) => u.id === id);
    let up = byId(scope.unitId ?? void 0);
    for (let guard = 0; up && guard < 50 && !kinds.includes(up.kind); guard++) up = byId(up.parentId);
    const down = scopeCompany(company, scope.unitId).units.find((u) => kinds.includes(u.kind));
    setScope({ level: lv, unitId: (up && kinds.includes(up.kind) ? up : down ?? firstUnit(lv))?.id ?? null });
  };
  const pickUnit = (u) => {
    setCollectionType(null);
    setScope({ level: u.kind === "area" ? scope.level : levelOfKind(u.kind), unitId: u.id });
  };
  const setLayout = (l) => {
    setLayoutOwn(l);
    onLayoutChange?.(l);
  };
  const setMethodology = (m) => {
    setMethodOwn(m);
    onMethodologyChange?.(m);
  };
  const closeProfile = React.useCallback(() => setPersonId(null), []);
  React.useEffect(() => {
    if (scope.unitId && !company.units.some((u) => u.id === scope.unitId)) setScopeState(initial);
  }, [company.units, scope.unitId]);
  const scoped = scopeCompany(company, scope.unitId);
  const unit = company.units.find((u) => u.id === scope.unitId) ?? null;
  const path = [];
  for (let u = unit, guard = 0; u && guard < 20; u = company.units.find((x) => x.id === u.parentId) ?? null, guard++) path.unshift(u);
  const levelUnits = company.units.filter((u) => kindsOf[scope.level].includes(u.kind));
  const counts = {
    method: null,
    dashboard: scoped.projects.length,
    structure: scoped.units.length,
    agents: scoped.agents.length,
    workflows: scoped.workflows.length,
    raci: scoped.projects.filter((p) => p.raci).length,
    decisions: scoped.projects.reduce((n, p) => n + p.decisions.length, 0)
  };
  const tabLabel = (v) => v === "method" ? methodologyShort[methodology] : L[v];
  const person = company.people.find((p) => p.id === personId) ?? null;
  const collections = company.collections ?? [];
  const collection = collections.find((c) => c.type === collectionType) ?? null;
  const resolve = (field, raw) => {
    const v = raw.replace(/^\[\[|\]\]$/g, "").split("|")[0].split("/").pop()?.replace(/\.md$/, "") ?? raw;
    const lc = v.trim().toLowerCase();
    const f = field.toLowerCase();
    const unitHit = company.units.find((u) => u.id === raw || u.name === v);
    if (unitHit)
      return { label: unitHit.name, icon: UNIT_ICON[unitHit.kind] ?? "layout-grid", onClick: () => pickUnit(unitHit) };
    const agentById = company.agents.find((x) => x.id.toLowerCase() === lc || x.role.toLowerCase() === lc);
    if (agentById) return { label: agentById.name, icon: "bot", onClick: () => openAgent(agentById.id) };
    const personHit = company.people.find((x) => x.id === raw || x.name === v || x.name.toLowerCase() === lc);
    if (personHit) return { label: personHit.name, icon: "user", onClick: () => setPersonId(personHit.id) };
    const agentByName = company.agents.find((x) => x.name.toLowerCase() === lc);
    if (agentByName) return { label: agentByName.name, icon: "bot", onClick: () => openAgent(agentByName.id) };
    const projectHit = company.projects.find((x) => x.id === raw || x.name === v);
    if (projectHit) return { label: projectHit.name, icon: "folder" };
    if (f === "company") return { label: v, icon: "building-2" };
    if (f.includes("area")) return { label: v, icon: "layout-grid" };
    if (["owner", "assignee", "person", "people", "manager", "author", "agent"].includes(f)) return { label: v, plain: true };
    return null;
  };
  const segmentText = company.segmentLabel ?? L.segment[company.segment] ?? company.segment;
  function openAgent(id) {
    const a = company.agents.find((x) => x.id === id);
    const u = a && company.units.find((x) => x.id === a.unitId);
    if (u) pickUnit(u);
    else setCollectionType(null);
    setView("agents");
    setFocusAgent(id);
  }
  React.useEffect(() => {
    if (!focusAgent || view !== "agents" || collectionType) return;
    const el = rootRef.current?.querySelector(`[data-agent="${typeof CSS !== "undefined" && CSS.escape ? CSS.escape(focusAgent) : focusAgent}"]`);
    el?.scrollIntoView?.({ block: "center", behavior: "smooth" });
    const t = setTimeout(() => setFocusAgent(null), 2400);
    return () => clearTimeout(t);
  }, [focusAgent, view, collectionType]);
  const scopeName = unit?.name ?? company.name;
  const render = (v) => v === "method" ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MethodologyView, { c: company, scoped, methodology, today, hideEmpty: hideEmptyBlocks }),
    methodology === "okr" && /* @__PURE__ */ jsxs("section", { className: "cv-sub", "aria-label": L.model, children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: L.model }),
      /* @__PURE__ */ jsx(ModelView, { c: company, scoped, L })
    ] })
  ] }) : v === "dashboard" ? /* @__PURE__ */ jsx(Dashboard, { c: company, scoped, today, empty: L.empty }, scope.unitId ?? "all") : v === "structure" ? /* @__PURE__ */ jsx(StructureView, { scoped, L, onPick: pickUnit, onPerson: setPersonId, current: scope.unitId }) : v === "agents" ? /* @__PURE__ */ jsx(AgentsView, { c: company, scoped, L, onPerson: setPersonId, focus: focusAgent }) : v === "workflows" ? /* @__PURE__ */ jsx(WorkflowView, { c: company, scoped, L }) : v === "raci" ? /* @__PURE__ */ jsx(RaciView, { c: company, scoped, onPerson: setPersonId, empty: "RACI бүртгэгдээгүй." }) : /* @__PURE__ */ jsx(DecisionsView, { scoped, L });
  const levelSwitch = /* @__PURE__ */ jsx("div", { className: "cv-seg", role: "radiogroup", "aria-label": L.level, children: LEVELS.map((lv) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      role: "radio",
      "aria-checked": scope.level === lv,
      disabled: !available.includes(lv),
      "data-active": scope.level === lv || void 0,
      onClick: () => pickLevel(lv),
      children: L[lv]
    },
    lv
  )) });
  const methodSwitch = showMethodologySwitch && /* @__PURE__ */ jsx("div", { className: "cv-seg cv-method-switch", role: "radiogroup", "aria-label": L.methodology, children: METHODOLOGIES.map((m) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      role: "radio",
      "aria-checked": methodology === m,
      "data-active": methodology === m || void 0,
      title: methodologyName[m],
      onClick: () => setMethodology(m),
      children: methodologyShort[m]
    },
    m
  )) });
  const layoutSwitch = showLayoutSwitch && /* @__PURE__ */ jsx("div", { className: "cv-seg cv-tpl", role: "radiogroup", "aria-label": L.layout, children: ["workspace", "brief"].map((t) => /* @__PURE__ */ jsx("button", { type: "button", role: "radio", "aria-checked": layout === t, "data-active": layout === t || void 0, onClick: () => setLayout(t), children: L[t] }, t)) });
  const switches = /* @__PURE__ */ jsxs("span", { className: "cv-switches", children: [
    methodSwitch,
    layoutSwitch
  ] });
  const profile = person && /* @__PURE__ */ jsx(
    PersonProfile,
    {
      c: company,
      person,
      onClose: closeProfile,
      themeClass: rootRef.current?.closest(".dark,[data-theme=dark]") ? "dark" : ""
    }
  );
  const unitChips = /* @__PURE__ */ jsx("div", { className: "cv-chips cv-unit-chips", role: "group", "aria-label": L[scope.level], children: levelUnits.map((u) => /* @__PURE__ */ jsx("button", { type: "button", "aria-pressed": u.id === scope.unitId, onClick: () => pickUnit(u), children: u.name }, u.id)) });
  const tags = /* @__PURE__ */ jsxs("span", { className: "cv-tags", children: [
    unit && /* @__PURE__ */ jsxs("span", { className: `cv-kind is-${unit.kind}`, children: [
      /* @__PURE__ */ jsx(Icon, { name: UNIT_ICON[unit.kind] ?? "building-2", size: 14 }),
      L[unit.kind]
    ] }),
    segmentText !== (unit ? L[unit.kind] : "") && /* @__PURE__ */ jsx("span", { className: "cv-tag", children: segmentText }),
    /* @__PURE__ */ jsx("span", { className: "cv-tag is-src", children: L.source[company.source] ?? company.source })
  ] });
  const asOf = company.exportedAt ? /* @__PURE__ */ jsxs("p", { className: "cv-asof", children: [
    /* @__PURE__ */ jsx(Icon, { name: "clock", size: 14 }),
    L.exportedAt,
    ": ",
    /* @__PURE__ */ jsx("time", { dateTime: company.exportedAt, children: asOfText(company.exportedAt) })
  ] }) : null;
  if (density === "preview")
    return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `cv ${className}`, "data-density": "preview", children: [
      /* @__PURE__ */ jsx("style", { children: css$2 + companyMiniCss }),
      /* @__PURE__ */ jsx(CompanyMini, { company, today, labels: previewLabels, badge: segmentText })
    ] });
  if (layout === "brief") {
    return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `cv ${className}`, "data-template": "brief", "data-methodology": methodology, children: [
      /* @__PURE__ */ jsx("style", { children: css$2 }),
      /* @__PURE__ */ jsxs("div", { className: "cv-brief", children: [
        /* @__PURE__ */ jsxs("header", { className: "cv-hero", children: [
          /* @__PURE__ */ jsxs("div", { className: "cv-hero-top", children: [
            /* @__PURE__ */ jsxs("span", { className: "cv-eyebrow", children: [
              company.name,
              path.length > 1 && ` / ${path.slice(1).map((u) => u.name).join(" / ")}`
            ] }),
            switches
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "cv-hero-title", children: scopeName }),
          tags,
          /* @__PURE__ */ jsx("p", { className: "cv-hero-line", children: modelLines(company.model.value)[0]?.text }),
          asOf,
          /* @__PURE__ */ jsxs("div", { className: "cv-hero-bar", children: [
            levelSwitch,
            unitChips
          ] })
        ] }),
        COMPANY_VIEWS.map((v, i) => /* @__PURE__ */ jsxs("section", { className: "cv-section", "aria-labelledby": `${uid}-${v}`, style: { "--i": i }, children: [
          /* @__PURE__ */ jsxs("h3", { id: `${uid}-${v}`, className: "cv-section-h", children: [
            /* @__PURE__ */ jsx("span", { className: "cv-num", children: String(i + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx(Icon, { name: TAB_ICON[v], size: 20 }),
            v === "method" ? methodologyName[methodology] : L[v],
            counts[v] != null && /* @__PURE__ */ jsx("span", { className: "cv-count", children: counts[v] })
          ] }),
          render(v)
        ] }, v)),
        collections.length > 0 && /* @__PURE__ */ jsxs("section", { className: "cv-section", "aria-labelledby": `${uid}-types`, children: [
          /* @__PURE__ */ jsxs("h3", { id: `${uid}-types`, className: "cv-section-h", children: [
            /* @__PURE__ */ jsx("span", { className: "cv-num", children: String(COMPANY_VIEWS.length + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx(Icon, { name: "database", size: 20 }),
            L.types,
            /* @__PURE__ */ jsx("span", { className: "cv-count", children: collections.length })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "cv-chips cv-type-chips", role: "group", "aria-label": L.types, children: collections.map((c) => /* @__PURE__ */ jsxs("button", { type: "button", "aria-pressed": (collection ?? collections[0]).type === c.type, onClick: () => setCollectionType(c.type), children: [
            /* @__PURE__ */ jsx(Icon, { name: typeIcon(c.type), size: 14 }),
            c.label ?? typeLabel(c.type),
            " ",
            /* @__PURE__ */ jsx("span", { children: c.items.length })
          ] }, c.type)) }),
          /* @__PURE__ */ jsx(CollectionView, { collection: collection ?? collections[0], today, resolve, siblings: collections, onOpenInVault, onAskAgent }, (collection ?? collections[0]).type)
        ] })
      ] }),
      profile
    ] });
  }
  const roots = rootsOf(company.units);
  const tree = (parent, depth, seen = /* @__PURE__ */ new Set()) => {
    const list = (parent ? company.units.filter((u) => u.parentId === parent) : roots).filter((u) => !seen.has(u.id));
    if (!list.length) return null;
    return /* @__PURE__ */ jsx("ul", { className: "cv-nav-list", children: list.map((u) => {
      seen.add(u.id);
      const inScope = scoped.units.some((x) => x.id === u.id);
      return /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "cv-nav-item",
            style: { "--d": depth },
            "aria-current": u.id === scope.unitId && !collection ? "true" : void 0,
            "data-in": inScope || void 0,
            onClick: () => pickUnit(u),
            children: [
              /* @__PURE__ */ jsx("span", { className: `cv-nav-glyph is-${u.kind}`, children: /* @__PURE__ */ jsx(Icon, { name: UNIT_ICON[u.kind] ?? "building-2", size: 16 }) }),
              /* @__PURE__ */ jsx("span", { className: "cv-nav-name", children: u.name })
            ]
          }
        ),
        tree(u.id, depth + 1, seen)
      ] }, u.id);
    }) });
  };
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `cv ${className}`, "data-template": "workspace", "data-methodology": methodology, children: [
    /* @__PURE__ */ jsx("style", { children: css$2 }),
    /* @__PURE__ */ jsxs("div", { className: `cv-ws${showTree ? "" : " no-tree"}`, children: [
      showTree && /* @__PURE__ */ jsxs("aside", { className: "cv-side", "aria-label": company.name, children: [
        /* @__PURE__ */ jsxs("div", { className: "cv-brand", children: [
          /* @__PURE__ */ jsx("span", { className: "cv-brand-mark", "aria-hidden": "true", children: initials(company.name).charAt(0) }),
          /* @__PURE__ */ jsxs("span", { className: "cv-brand-text", children: [
            /* @__PURE__ */ jsx("strong", { children: company.name }),
            /* @__PURE__ */ jsxs("small", { children: [
              segmentText,
              " · ",
              L.source[company.source] ?? company.source
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cv-side-level", children: levelSwitch }),
        /* @__PURE__ */ jsx("nav", { className: "cv-nav", "aria-label": L.units, children: tree(void 0, 0) }),
        /* @__PURE__ */ jsx("div", { className: "cv-side-chips", children: unitChips }),
        collections.length > 0 && /* @__PURE__ */ jsxs("nav", { className: "cv-types", "aria-label": L.types, children: [
          /* @__PURE__ */ jsxs("h4", { className: "cv-types-h", children: [
            /* @__PURE__ */ jsx(Icon, { name: "database", size: 14 }),
            L.types
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "cv-nav-list", children: collections.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "cv-nav-item",
              "aria-current": collectionType === c.type ? "true" : void 0,
              onClick: () => setCollectionType(c.type),
              children: [
                /* @__PURE__ */ jsx(TypeBadge, { type: c.type, size: 18 }),
                /* @__PURE__ */ jsx("span", { className: "cv-nav-name", children: c.label ?? typeLabel(c.type) }),
                /* @__PURE__ */ jsx("span", { className: "cv-nav-count", children: c.items.length })
              ]
            }
          ) }, c.type)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "cv-main", children: [
        /* @__PURE__ */ jsxs("header", { className: "cv-head", children: [
          /* @__PURE__ */ jsxs("div", { className: "cv-head-top", children: [
            /* @__PURE__ */ jsxs("nav", { className: "cv-crumbs", "aria-label": L.level, children: [
              path.map((u, i) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
                i > 0 && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => pickUnit(u), "aria-current": i === path.length - 1 && !collection ? "page" : void 0, children: u.name })
              ] }, u.id)),
              collection && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
                /* @__PURE__ */ jsx("span", { children: L.types }),
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
                /* @__PURE__ */ jsx("span", { "aria-current": "page", children: collection.label ?? typeLabel(collection.type) })
              ] })
            ] }),
            switches
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "cv-title", children: collection ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(TypeBadge, { type: collection.type, size: 24 }),
            collection.label ?? typeLabel(collection.type),
            /* @__PURE__ */ jsx("span", { className: "cv-title-n", children: collection.items.length })
          ] }) : scopeName }),
          !collection && tags,
          asOf,
          !showTree && /* @__PURE__ */ jsxs("div", { className: "cv-head-scope", children: [
            levelSwitch,
            unitChips
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "cv-tabs",
              role: "tablist",
              "aria-label": L.views,
              onKeyDown: (e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const at = COMPANY_VIEWS.indexOf(view);
                const n = (at + (e.key === "ArrowRight" ? 1 : -1) + COMPANY_VIEWS.length) % COMPANY_VIEWS.length;
                setView(COMPANY_VIEWS[n]);
                tabsRef.current[n]?.focus();
              },
              children: COMPANY_VIEWS.map((v, i) => /* @__PURE__ */ jsxs(
                "button",
                {
                  ref: (el) => {
                    tabsRef.current[i] = el;
                  },
                  type: "button",
                  role: "tab",
                  id: `${uid}-tab-${v}`,
                  "aria-selected": view === v && !collection,
                  "aria-controls": `${uid}-panel`,
                  tabIndex: view === v ? 0 : -1,
                  onClick: () => {
                    setView(v);
                    setCollectionType(null);
                  },
                  children: [
                    /* @__PURE__ */ jsx(Icon, { name: TAB_ICON[v], size: 16 }),
                    tabLabel(v),
                    counts[v] != null && /* @__PURE__ */ jsx("span", { children: counts[v] })
                  ]
                },
                v
              ))
            }
          )
        ] }),
        collection ? /* @__PURE__ */ jsx("section", { className: "cv-panel", "aria-label": collection.label ?? typeLabel(collection.type), children: /* @__PURE__ */ jsx(CollectionView, { collection, today, resolve, siblings: collections, onOpenInVault, onAskAgent }) }, `collection-${collection.type}`) : /* @__PURE__ */ jsx("section", { id: `${uid}-panel`, role: "tabpanel", "aria-labelledby": `${uid}-tab-${view}`, className: "cv-panel", children: render(view) }, `${view}-${scope.unitId}`)
      ] })
    ] }),
    profile
  ] });
}
const baseCss = `
.cv{--cv-bg:var(--ts-surface,#fff);--cv-page:var(--ts-page,#f7f7f8);--cv-fg:var(--ts-fg,#18181b);--cv-muted:var(--ts-muted,#65656d);--cv-faint:var(--ts-faint,#65656d);--cv-line:var(--ts-line,#ececef);--cv-soft:var(--ts-soft,#f4f4f5);--cv-accent:var(--ts-accent,#4f7cf0);--cv-accent-fg:var(--ts-accent-fg,#2f5fd8);--cv-accent-soft:var(--ts-accent-soft,#e8f1fe);--cv-green:var(--ts-green,#16a34a);--cv-green-soft:var(--ts-green-soft,#e9f8ee);--cv-amber:var(--ts-amber,#c2620a);--cv-amber-soft:var(--ts-amber-soft,#fff4e0);--cv-violet:var(--ts-violet,#7c3aed);--cv-violet-soft:var(--ts-violet-soft,#f1ebfd);--cv-teal:var(--ts-teal,#0f8a7e);--cv-teal-soft:var(--ts-teal-soft,#e2f6f3);--cv-yellow:var(--ts-yellow,#b58105);--cv-yellow-soft:var(--ts-yellow-soft,#fdf6dc);--cv-red:var(--ts-red,#dc2626);--cv-red-soft:var(--ts-red-soft,#fdecec);--cv-seg-on:var(--ts-seg-on,#fff);position:relative;width:100%;color:var(--cv-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);container:cv/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .cv{--cv-bg:var(--ts-surface,#1b1b1e);--cv-page:var(--ts-page,#141416);--cv-fg:var(--ts-fg,#ececef);--cv-muted:var(--ts-muted,#a1a1aa);--cv-faint:var(--ts-faint,#9a9aa2);--cv-line:var(--ts-line,#2e2e33);--cv-soft:var(--ts-soft,#26262a);--cv-accent:var(--ts-accent,#7c9cff);--cv-accent-fg:var(--ts-accent-fg,var(--cv-accent));--cv-accent-soft:var(--ts-accent-soft,#1b2a44);--cv-green:var(--ts-green,#4ade80);--cv-green-soft:var(--ts-green-soft,#16301f);--cv-amber:var(--ts-amber,#eba659);--cv-amber-soft:var(--ts-amber-soft,#3a2a12);--cv-violet:var(--ts-violet,#a78bfa);--cv-violet-soft:var(--ts-violet-soft,#2a2140);--cv-teal:var(--ts-teal,#5eead4);--cv-teal-soft:var(--ts-teal-soft,#123330);--cv-yellow:var(--ts-yellow,#e8c25a);--cv-yellow-soft:var(--ts-yellow-soft,#352c10);--cv-red:var(--ts-red,#f87171);--cv-red-soft:var(--ts-red-soft,#3a1d1f);--cv-seg-on:var(--ts-seg-on,#3a3a40);color-scheme:dark}
.cv *{box-sizing:border-box}
.cv-title,.cv-hero-title,.cv-section-h,.cv-sheet-id h3,.cl-peek-title,.cv-name{font-family:var(--ts-font-display,inherit)}
.cv-num,.cv-step-n,.cl-peek-path{font-family:var(--ts-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace)}:where(.cv) button{font:inherit;color:inherit;cursor:pointer}
.cv :focus-visible{outline:2px solid var(--cv-accent);outline-offset:1px}
.cv-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* shared bits */
.cv-seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:var(--cv-soft);max-width:100%;overflow-x:auto;scrollbar-width:none}
.cv-seg button{flex:none;height:28px;padding:0 10px;border:0;border-radius:6px;background:none;color:var(--cv-muted);font-size:13px;font-weight:500;white-space:nowrap;transition:color .1s,background .15s,box-shadow .15s}
.cv-seg button:hover:not(:disabled){color:var(--cv-fg)}
.cv-seg button[data-active]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff);box-shadow:none}
.cv-seg button:disabled{opacity:.4;cursor:not-allowed}
.cv-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:1px}
.cv-chips::-webkit-scrollbar{display:none}
.cv-chips button{flex:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px;border:1px solid var(--cv-line);border-radius:15px;background:var(--cv-bg);font-size:13px;white-space:nowrap;transition:background .15s,border-color .15s}
.cv-chips button:hover{background:var(--cv-soft)}
.cv-chips button[aria-pressed=true]{border-color:transparent;background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff);font-weight:500}
.cv-chips button span{color:var(--cv-muted);font-size:12px}.cv-chips button[aria-pressed=true] span{color:inherit}
.cv-dot{width:7px;height:7px;border-radius:50%;background:var(--cv-faint)}
.cv-dot.is-done{background:var(--cv-green)}.cv-dot.is-active{background:var(--cv-accent)}.cv-dot.is-blocked{background:var(--cv-amber)}
.cv-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.cv-tag,.cv-kind{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:5px;font-size:11.5px;font-weight:500;white-space:nowrap;background:var(--cv-soft);color:var(--cv-muted)}
.cv-tag.is-src{background:none;border:1px solid var(--cv-line)}
.cv-kind.is-institution{background:var(--cv-violet-soft);color:color-mix(in srgb,var(--cv-violet) 80%,var(--cv-fg))}
.cv-kind.is-company{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 70%,var(--cv-fg))}
.cv-kind.is-department{background:var(--cv-teal-soft);color:color-mix(in srgb,var(--cv-teal) 75%,var(--cv-fg))}
.cv-kind.is-team{background:var(--cv-amber-soft);color:color-mix(in srgb,var(--cv-amber) 82%,var(--cv-fg))}
.cv-ava{display:inline-grid;place-items:center;flex:none;width:var(--s,22px);height:var(--s,22px);border-radius:50%;background:var(--cv-soft);border:1px solid var(--cv-line);color:var(--cv-muted);font-size:calc(var(--s,22px) * .42);font-weight:600;line-height:1}
.cv-ava.is-agent{border-radius:28%;background:var(--cv-accent-soft);border-color:color-mix(in srgb,var(--cv-accent) 35%,var(--cv-line));color:var(--cv-accent-fg)}
.cv-ava.is-unit{border-style:dashed;background:none}
.cv-ava.is-unknown{border-style:dashed}
.cv-empty{margin:0;padding:24px;border:1px dashed var(--cv-line);border-radius:12px;color:var(--cv-muted);text-align:center}
.cv-pill{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:10px;background:var(--cv-soft);color:var(--cv-muted);font-size:11.5px;white-space:nowrap}
.cv-more{margin-left:4px;font-size:11.5px;color:var(--cv-faint)}
/* model */
.cv-model{display:flex;flex-direction:column;gap:12px}
.cv-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:0}
.cv-stat{display:flex;flex-direction:column-reverse;padding:10px 12px;border-radius:10px;background:var(--cv-bg);border:1px solid var(--cv-line);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 45ms)}
.cv-stat dt{font-size:12px;color:var(--cv-muted)}
.cv-stat dd{margin:0;font-size:22px;font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.cv-canvas{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}
.cv-cell{padding:14px;border-radius:12px;background:var(--cv-bg);border:1px solid var(--cv-line);animation:cv-in .36s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 60ms + 120ms)}
.cv-cell h4{margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--cv-muted)}
.cv-cell-1{background:linear-gradient(160deg,var(--cv-accent-soft),var(--cv-bg) 70%)}
.cv-model-text{margin:0;font-size:15px;line-height:1.5}
.cv-model-list{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}
.cv-model-list li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid var(--cv-line)}
.cv-model-list li:last-child{border-bottom:0}
.cv-share{display:inline-flex;align-items:center;gap:8px;flex:none}
.cv-share-bar{position:relative;width:72px;height:6px;border-radius:3px;background:var(--cv-soft);overflow:hidden}
.cv-share-bar span{position:absolute;inset:0 auto 0 0;border-radius:3px;background:var(--cv-accent);transform-origin:left;animation:cv-grow .8s cubic-bezier(.2,.8,.3,1) .3s both}
.cv-share-n{min-width:34px;text-align:right;font-weight:600;font-variant-numeric:tabular-nums}
/* structure */
.cv-tree{position:relative;margin:0;padding:0;list-style:none}
.cv-tree .cv-tree{margin-left:18px;padding-left:16px;border-left:1.5px solid var(--cv-line)}
.cv-node{position:relative;padding-top:8px;animation:cv-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 40ms)}
.cv-tree .cv-tree>.cv-node::before{content:"";position:absolute;left:-16px;top:30px;width:14px;height:1.5px;background:var(--cv-line)}
.cv-node-card{display:flex;flex-direction:column;gap:6px;width:min(100%,520px);padding:10px 12px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);text-align:left;transition:border-color .15s,box-shadow .15s}
.cv-node-pick{display:block;width:100%;padding:0;border:0;background:none;text-align:left}
.cv-face{display:inline-flex;padding:0;border:0;border-radius:50%;background:none}
.cv-face:hover .cv-ava{border-color:var(--cv-accent);color:var(--cv-fg)}
.cv-faces .cv-face+.cv-face{margin-left:-6px}
button.cv-person{width:100%;border:0;text-align:left;color:inherit;transition:background .15s}
button.cv-person:hover{background:color-mix(in srgb,var(--cv-accent-soft) 60%,var(--cv-soft))}
.cv-switches{display:inline-flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}
.cv-sub{margin-top:18px}
.cv-node-card:hover{border-color:color-mix(in srgb,var(--cv-accent) 40%,var(--cv-line))}
.cv-node-card[aria-current=true]{border-color:var(--cv-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--cv-accent) 18%,transparent)}
.cv-node-top{display:flex;align-items:center;gap:8px;min-width:0}
.cv-node-name{font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-node-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.cv-faces{display:inline-flex;align-items:center}
.cv-faces .cv-ava+.cv-ava,.cv-faces .cv-face+.cv-face{margin-left:-6px}
.cv-faces .cv-ava{box-shadow:0 0 0 2px var(--cv-bg)}
/* agents */
.cv-agents{display:flex;flex-direction:column;gap:10px}
.cv-unit-block{padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms)}
.cv-unit-h{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:14px;font-weight:600}
.cv-pairs{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.cv-pair{display:grid;grid-template-columns:minmax(150px,220px) 28px minmax(0,1fr);align-items:start;gap:0}
.cv-person{display:flex;align-items:center;gap:9px;min-width:0;padding:8px 10px;border-radius:10px;background:var(--cv-soft)}
.cv-person>span:last-child{display:flex;flex-direction:column;min-width:0}
.cv-person strong{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-person span span{font-size:12px;color:var(--cv-muted)}
.cv-person.is-unit{background:none;border:1px dashed var(--cv-line)}
.cv-link{position:relative;height:46px}
.cv-link::before{content:"";position:absolute;left:2px;right:4px;top:50%;height:1.5px;background:color-mix(in srgb,var(--cv-accent) 55%,var(--cv-line))}
.cv-link::after{content:"";position:absolute;right:2px;top:calc(50% - 3.5px);border:4px solid transparent;border-left:6px solid color-mix(in srgb,var(--cv-accent) 55%,var(--cv-line));border-right:0}
.cv-link.is-none::before,.cv-link.is-none::after{opacity:0}
.cv-agent-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px;margin:0;padding:0;list-style:none}
.cv-agent{display:flex;flex-direction:column;gap:6px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--cv-accent) 22%,var(--cv-line));border-radius:10px;background:var(--cv-bg)}
.cv-agent.is-focus{border-color:var(--cv-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--cv-accent) 22%,transparent);animation:cv-focus 1.2s ease 2}
@keyframes cv-focus{50%{box-shadow:0 0 0 6px color-mix(in srgb,var(--cv-accent) 12%,transparent)}}
.cv-agent-top{display:flex;align-items:center;gap:8px;min-width:0}
.cv-agent-id{display:flex;flex-direction:column;min-width:0}
.cv-agent-id strong{font-weight:600}
.cv-agent-id span{font-size:12px;color:var(--cv-muted)}
.cv-skills{display:flex;flex-wrap:wrap;gap:4px}
.cv-skill{height:20px;padding:0 6px;border-radius:5px;background:var(--cv-soft);font-size:11.5px;line-height:20px;color:var(--cv-fg)}
.cv-agent-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px;font-size:12px;color:var(--cv-muted)}
.cv-mem[open]{flex-basis:100%}
.cv-mem summary{cursor:pointer;color:var(--cv-accent-fg);list-style:none}
.cv-mem summary::-webkit-details-marker{display:none}
.cv-mem summary::before{content:"◆ ";font-size:9px}
.cv-mem ul{margin:4px 0 0;padding-left:16px;color:var(--cv-fg)}
.cv-mem-none{color:var(--cv-faint)}
/* workflows */
.cv-flows{display:flex;flex-direction:column;gap:10px}
.cv-flow{padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 60ms)}
.cv-flow-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-bottom:12px}
.cv-flow-head strong{font-size:14.5px;font-weight:600}
.cv-flow-unit{font-size:12.5px;color:var(--cv-muted)}
.cv-trigger{margin-left:auto;display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 9px;border-radius:12px;background:var(--cv-amber-soft);color:color-mix(in srgb,var(--cv-amber) 82%,var(--cv-fg));font-size:12px;font-weight:500}
.cv-steps{display:grid;grid-template-columns:repeat(var(--n,4),minmax(118px,1fr));gap:26px;margin:0;padding:2px 2px 4px;list-style:none;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}
.cv-step{position:relative;display:flex;flex-direction:column;gap:6px;padding:10px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-page);animation:cv-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--j,0) * 90ms + 120ms)}
.cv-step.is-person{border-color:color-mix(in srgb,var(--cv-amber) 35%,var(--cv-line))}
.cv-step:not(:last-child)::after{content:"";position:absolute;right:-24px;top:22px;width:22px;height:1.5px;background:var(--cv-faint)}
.cv-step:not(:last-child)::before{content:"";position:absolute;right:-25px;top:18.5px;border:4px solid transparent;border-left:6px solid var(--cv-faint);border-right:0}
.cv-step.gate-next::after{background:var(--cv-amber)}.cv-step.gate-next::before{border-left-color:var(--cv-amber)}
.cv-step-n{font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--cv-faint)}
.cv-step-label{font-weight:600;line-height:1.3}
.cv-step-actor{display:flex;align-items:center;gap:6px;font-size:12.5px;min-width:0}
.cv-step-actor>span:nth-child(2){white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-step-out{font-size:12px;color:var(--cv-muted)}
.cv-legend{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:0;font-size:12px;color:var(--cv-muted)}
.cv-legend-line{display:inline-block;width:22px;height:1.5px;margin-left:8px;background:var(--cv-faint)}
.cv-legend-line:first-child{margin-left:0}
.cv-legend-line.is-gate{background:var(--cv-amber)}
.cv-legend .cv-ava{margin-left:8px}
/* projects + decisions reuse widgets */
.cv-projects{display:flex;flex-direction:column;gap:10px}
.cv-projects .sb,.cv-projects .rp{max-width:none}
.cv-decisions .di{max-width:none}
.cv-decisions .di-undo{display:none}
/* workspace template */
.cv-ws{display:grid;grid-template-columns:260px minmax(0,1fr);min-height:560px;border:1px solid var(--cv-line);border-radius:14px;background:var(--cv-page);overflow:hidden}
.cv-side{display:flex;flex-direction:column;gap:var(--ts-gap-control,16px);padding:14px 10px;border-right:1px solid var(--cv-line);background:var(--cv-bg)}
.cv-brand{display:flex;align-items:center;gap:10px;padding:0 4px}
.cv-brand-mark{display:grid;place-items:center;flex:none;width:32px;height:32px;border-radius:9px;background:var(--cv-accent);color:#fff;font-weight:700}
.cv-brand-text{display:flex;flex-direction:column;min-width:0}
.cv-brand-text strong{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-brand-text small{font-size:12px;color:var(--cv-muted)}
.cv-side-level .cv-seg{display:flex}.cv-side-level .cv-seg button{flex:1 0 auto}
.cv-nav-list{margin:0;padding:0;list-style:none}
.cv-nav-item{display:flex;align-items:center;gap:8px;width:100%;min-height:32px;padding:4px 8px 4px calc(8px + var(--d,0) * 14px);border:0;border-radius:7px;background:none;color:var(--cv-muted);text-align:left;font-size:13px;transition:background .15s,color .15s}
.cv-nav-item:hover{background:var(--cv-soft);color:var(--cv-fg)}
.cv-nav-item[data-in]{color:var(--cv-fg)}
.cv-nav-item[aria-current=true]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff);font-weight:500}
.cv-nav-glyph{display:inline-flex;flex:none;color:var(--cv-faint)}
.cv-nav-item[data-in] .cv-nav-glyph,.cv-nav-item[aria-current=true] .cv-nav-glyph{color:currentColor}
.cv-nav-count{margin-left:auto;font-size:11.5px;color:var(--cv-faint);font-variant-numeric:tabular-nums}.cv-nav-item[aria-current=true] .cv-nav-count{color:inherit}
.cv-types{margin-top:4px;padding-top:10px;border-top:1px solid var(--cv-line)}
.cv-types-h{display:flex;align-items:center;gap:6px;margin:0 0 4px;padding:0 8px;font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-title{display:flex;align-items:center;gap:8px}
.cv-title .cv-icon{color:var(--cv-muted)}
.cv-title-n{font-size:14px;font-weight:500;color:var(--cv-muted)}
.cv-tabs button .cv-icon{color:var(--cv-faint)}
.cv-tabs button[aria-selected=true] .cv-icon{color:currentColor}
.cv-section-h .cv-icon{align-self:center;color:var(--cv-muted)}
.cv-kind .cv-icon{margin-right:3px}
.cv-kind.is-area{background:var(--cv-soft);color:var(--cv-muted)}
.cv-type-chips{margin-bottom:10px}
.cv-nav-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-side-chips{display:none}
.cv-ws.no-tree{grid-template-columns:minmax(0,1fr)}
.cv-head-scope{display:flex;flex-wrap:wrap;align-items:center;gap:var(--ts-gap-control,16px) 8px;margin-top:12px;min-width:0}
.cv-head-scope .cv-unit-chips{flex:1;min-width:0}
.cv-main{min-width:0;display:flex;flex-direction:column}
.cv-head{padding:16px 20px 0;background:var(--cv-bg);border-bottom:1px solid var(--cv-line)}
.cv-head-top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 10px;min-width:0}
.cv-crumbs{display:flex;align-items:center;gap:6px;min-width:0;overflow-x:auto;scrollbar-width:none;font-size:12.5px;color:var(--cv-faint)}
.cv-crumbs button{flex:none;padding:0;border:0;background:none;color:var(--cv-muted);font-size:12.5px;white-space:nowrap}
.cv-crumbs button:hover{color:var(--cv-fg)}
.cv-crumbs button[aria-current=page]{color:var(--cv-fg)}
.cv-title{margin:var(--ts-gap-control,16px) 0 0;font-size:22px;font-weight:600;letter-spacing:-.015em;line-height:1.2}
.cv-tabs{position:relative;display:flex;gap:2px;margin-top:14px;overflow-x:auto;scrollbar-width:none}
.cv-tabs::-webkit-scrollbar{display:none}
.cv-tabs button{position:relative;flex:none;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 10px;border:0;background:none;color:var(--cv-muted);font-size:13.5px;font-weight:500;white-space:nowrap}
.cv-tabs button span{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--cv-soft);font-size:11.5px;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
.cv-tabs button:hover{color:var(--cv-fg)}
.cv-tabs button[aria-selected=true]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff);border-radius:6px}
.cv-tabs button[aria-selected=true] span{background:var(--ts-on-selected-soft,rgb(255 255 255 / .2));color:var(--ts-on-selected,#fff)}
.cv-tabs button[aria-selected=true]::after{content:none}
.cv-panel{padding:18px 20px 22px;animation:cv-fade .22s ease both}
/* brief template */
.cv-brief{display:flex;flex-direction:column;gap:22px}
.cv-asof{display:flex;align-items:center;gap:6px;margin:6px 0 0;font:500 12px/1.3 var(--ts-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);color:var(--cv-faint)}
.cv-hero{padding:22px;border-radius:16px;background:radial-gradient(120% 140% at 100% 0%,var(--cv-accent-soft),transparent 55%),var(--cv-bg);border:1px solid var(--cv-line);animation:cv-in .4s cubic-bezier(.2,.8,.3,1) both}
.cv-hero-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.cv-eyebrow{min-width:0;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--cv-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-hero-title{margin:var(--ts-gap-control,16px) 0 0;font-size:34px;font-weight:650;letter-spacing:-.025em;line-height:1.1}
.cv-hero-line{max-width:62ch;margin:12px 0 0;font-size:16px;line-height:1.5;color:color-mix(in srgb,var(--cv-fg) 82%,var(--cv-muted))}
.cv-hero-bar{display:flex;flex-wrap:wrap;align-items:center;gap:var(--ts-gap-control,16px) 10px;margin-top:18px}
.cv-hero-bar .cv-unit-chips{flex:1;min-width:0}
.cv-section{animation:cv-in .4s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 70ms + 100ms)}
.cv-section-h{display:flex;align-items:baseline;gap:10px;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--cv-line);font-size:19px;font-weight:600;letter-spacing:-.01em}
.cv-num{font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--cv-accent-fg)}
.cv-count{margin-left:auto;font-size:13px;font-weight:500;color:var(--cv-muted);font-variant-numeric:tabular-nums}
@keyframes cv-in{from{opacity:0;transform:translateY(6px)}}
@keyframes cv-fade{from{opacity:0}}
@keyframes cv-grow{from{transform:scaleX(0)}}
@container cv (max-width:820px){
.cv-types{width:100%;margin-top:0;padding-top:8px}
.cv-types-h{display:none}
.cv-types .cv-nav-list{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}
.cv-types .cv-nav-item{width:auto;min-height:30px;padding:0 10px;border:1px solid var(--cv-line);border-radius:15px;white-space:nowrap}
.cv-types .cv-nav-count{margin-left:2px}
.cv-ws{grid-template-columns:minmax(0,1fr)}
.cv-side{flex-direction:row;flex-wrap:wrap;align-items:center;gap:var(--ts-gap-control,16px) 10px;border-right:0;border-bottom:1px solid var(--cv-line)}
.cv-nav{display:none}
.cv-side-chips{display:block;width:100%;min-width:0}
.cv-side-level{margin-left:auto}
.cv-stats{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container cv (max-width:560px){
.cv-head{padding:14px 14px 0}.cv-panel{padding:14px}
.cv-side{padding:12px}
.cv-side-level{margin-left:0;width:100%}
.cv-tpl button{padding:0 8px;font-size:12.5px}
.cv-hero-bar .cv-unit-chips{flex-basis:100%}
.cv-hero-top{align-items:flex-start}
.cv-canvas{grid-template-columns:minmax(0,1fr)}
.cv-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
.cv-model .cv-stat:last-child{grid-column:1/-1}
.cv-pair{grid-template-columns:minmax(0,1fr)}
.cv-link{height:18px;width:2px;margin-left:24px}
.cv-link::before{left:0;right:auto;top:2px;bottom:4px;width:1.5px;height:auto}
.cv-link::after{left:-3.25px;right:auto;top:auto;bottom:0;border:4px solid transparent;border-top:6px solid color-mix(in srgb,var(--cv-accent) 55%,var(--cv-line));border-bottom:0}
.cv-link.is-none{display:none}
.cv-steps{grid-template-columns:minmax(0,1fr);gap:18px;overflow:visible}
.cv-step:not(:last-child)::after{right:auto;left:22px;top:auto;bottom:-17px;width:1.5px;height:15px}
.cv-step:not(:last-child)::before{right:auto;left:18.5px;top:auto;bottom:-19px;border:4px solid transparent;border-top:6px solid var(--cv-faint);border-bottom:0}
.cv-step.gate-next::before{border-top-color:var(--cv-amber);border-left-color:transparent}
.cv-trigger{margin-left:0}
.cv-hero{padding:16px}.cv-hero-title{font-size:26px}
.cv-tree .cv-tree{margin-left:10px;padding-left:12px}
.cv-tree .cv-tree>.cv-node::before{left:-12px;width:10px}
}
@media(prefers-reduced-motion:reduce){.cv *,.cv{animation:none!important;transition:none!important}}
`;
const css$2 = baseCss + dashboardCss + raciCss + methodologyCss + collectionCss;
function CollectionPanel({ className = "", ...props }) {
  return /* @__PURE__ */ jsxs("div", { className: `cv cv-standalone ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css$2 }),
    /* @__PURE__ */ jsx(CollectionView, { ...props })
  ] });
}
function Replay({ children, label = "Дахин тоглуулах", onReplay, showButton = true, placement = "inside", className = "", style }) {
  const [run, setRun] = React.useState(0);
  return /* @__PURE__ */ jsxs("div", { className: `ts-replay ${className}`, style, "data-run": run, "data-placement": showButton ? placement : void 0, children: [
    /* @__PURE__ */ jsx("style", { children: css$1 }),
    showButton && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "ts-replay-btn",
        "aria-label": label,
        title: label,
        onClick: () => {
          setRun((n) => n + 1);
          onReplay?.();
        },
        children: /* @__PURE__ */ jsx(Icon, { name: "rotate-ccw", size: 16 })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "ts-replay-body", children }, run)
  ] });
}
function withReplay(Component, options = {}) {
  const Wrapped = (props) => /* @__PURE__ */ jsx(Replay, { ...options, children: /* @__PURE__ */ jsx(Component, { ...props }) });
  Wrapped.displayName = `withReplay(${Component.displayName ?? Component.name ?? "Component"})`;
  return Wrapped;
}
const css$1 = `
.ts-replay{position:relative;width:100%;min-width:0}
.ts-replay-body{min-width:0}
.ts-replay[data-placement=outside]{padding-top:38px}
.ts-replay[data-placement=outside]>.ts-replay-btn{top:0}
.ts-replay-btn{position:absolute;top:8px;right:8px;z-index:3;display:grid;place-items:center;width:30px;height:30px;padding:0;border:1px solid var(--ts-line,#e4e4e7);border-radius:8px;background:var(--ts-surface,#fff);color:var(--ts-muted,#65656d);box-shadow:0 1px 2px #0000000f;cursor:pointer;opacity:.82;transition:opacity .15s,color .15s,background .15s,transform .2s}
.ts-replay-btn:hover{opacity:1;color:var(--ts-fg,#18181b);background:var(--ts-soft,#f4f4f5)}
.ts-replay-btn:active .cv-icon{transform:rotate(-120deg)}
.ts-replay-btn .cv-icon{transition:transform .35s cubic-bezier(.2,.8,.3,1)}
.ts-replay-btn:focus-visible{outline:2px solid var(--ts-accent,#4f7cf0);outline-offset:2px;opacity:1}
:where(.dark,[data-theme=dark]) .ts-replay-btn{border-color:var(--ts-line,#2e2e33);background:var(--ts-surface,#1b1b1e);color:var(--ts-muted,#a1a1aa)}
:where(.dark,[data-theme=dark]) .ts-replay-btn:hover{color:var(--ts-fg,#ececef);background:var(--ts-soft,#26262a)}
@media (prefers-reduced-motion: reduce){
.ts-replay-body *,.ts-replay-body *::before,.ts-replay-body *::after{animation:none!important;transition:none!important}
.ts-replay-btn,.ts-replay-btn .cv-icon{transition:none}
}
`;
function dampingRatio({ stiffness, damping, mass = 1 }) {
  return damping / (2 * Math.sqrt(stiffness * mass));
}
function springAt(spring2, t) {
  const { stiffness: k, damping: c, mass: m = 1, velocity = 0 } = spring2;
  const w0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(k * m));
  const x0 = -1;
  const v0 = velocity;
  let d;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    d = Math.exp(-zeta * w0 * t) * (x0 * Math.cos(wd * t) + (v0 + zeta * w0 * x0) / wd * Math.sin(wd * t));
  } else if (zeta === 1) {
    d = Math.exp(-w0 * t) * (x0 + (v0 + w0 * x0) * t);
  } else {
    const s = w0 * Math.sqrt(zeta * zeta - 1);
    const r12 = -zeta * w0 + s;
    const r2 = -zeta * w0 - s;
    const b = (v0 - r12 * x0) / (r2 - r12);
    const a = x0 - b;
    d = a * Math.exp(r12 * t) + b * Math.exp(r2 * t);
  }
  return 1 + d;
}
function springDuration(spring2, rest = 1e-3) {
  const step = 1 / 1e3;
  let settledSince = -1;
  for (let i = 0; i <= 1e4; i++) {
    const t = i * step;
    if (Math.abs(springAt(spring2, t) - 1) < rest) {
      if (settledSince < 0) settledSince = i;
      if (i - settledSince >= 50) return Math.max(1, settledSince);
    } else settledSince = -1;
  }
  return 1e4;
}
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [t, x] = points[i];
    const expected = a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0] || 1);
    const err = Math.abs(x - expected);
    if (err > worst) {
      worst = err;
      index = i;
    }
  }
  if (worst <= tolerance) return [a, b];
  const left = simplify(points.slice(0, index + 1), tolerance);
  const right = simplify(points.slice(index), tolerance);
  return [...left.slice(0, -1), ...right];
}
const round = (n, digits) => {
  const p = 10 ** digits;
  const r = Math.round(n * p) / p;
  return Object.is(r, -0) ? 0 : r;
};
function springEasing(spring2, tolerance = 4e-3) {
  const duration = springDuration(spring2);
  const samples = 200;
  const points = [];
  let peak = 1;
  for (let i = 0; i <= samples; i++) {
    const p = i / samples;
    const x = i === samples ? 1 : springAt(spring2, p * duration / 1e3);
    peak = Math.max(peak, x);
    points.push([p, x]);
  }
  const kept = simplify(points, tolerance);
  const stops = kept.map(
    ([p, x], i) => i === 0 || i === kept.length - 1 ? `${round(x, 3)}` : `${round(x, 3)} ${round(p * 100, 1)}%`
  );
  const zeta = dampingRatio(spring2);
  const fallback = zeta >= 0.95 ? "cubic-bezier(0.22, 1, 0.36, 1)" : zeta > 0.6 ? "cubic-bezier(0.25, 1.2, 0.5, 1)" : "cubic-bezier(0.34, 1.56, 0.64, 1)";
  return { easing: `linear(${stops.join(", ")})`, duration, fallback, overshoot: round(peak - 1, 3) };
}
function springKeyframes(spring2, from, to, frames = 24) {
  const duration = springDuration(spring2);
  return Array.from({ length: frames + 1 }, (_, i) => {
    const offset = i / frames;
    const x = i === frames ? 1 : springAt(spring2, offset * duration / 1e3);
    return { offset, value: round(from + (to - from) * x, 4) };
  });
}
const SPRINGS = {
  soft: { stiffness: 170, damping: 26, mass: 1 },
  settle: { stiffness: 120, damping: 18, mass: 1 },
  heavy: { stiffness: 90, damping: 20, mass: 1.6 }
};
const DURATIONS = {
  xs: 120,
  sm: 200,
  md: 320,
  lg: 560,
  xl: 900
};
const LOOP = { move: 1200, rest: 4e3, count: 3, stagger: 100 };
const EASINGS = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  /** Enter: decelerates to rest. */
  enter: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  /** Exit: accelerates away. */
  exit: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  /** Icon loops — an even breath. */
  loop: "cubic-bezier(0.45, 0, 0.55, 1)"
};
const cache = /* @__PURE__ */ new Map();
function spring(name) {
  let e = cache.get(name);
  if (!e) cache.set(name, e = springEasing(SPRINGS[name]));
  return e;
}
const motionVar = {
  duration: (n) => `var(--ts-motion-dur-${n}, ${DURATIONS[n]}ms)`,
  easing: (n) => `var(--ts-motion-ease-${n}, ${EASINGS[n]})`,
  spring: (n) => `var(--ts-motion-spring-${n}, ${spring(n).fallback})`,
  springDuration: (n) => `var(--ts-motion-spring-${n}-duration, ${spring(n).duration}ms)`
};
function motionTokensCss() {
  const lines = [];
  for (const [n, v] of Object.entries(DURATIONS)) lines.push(`  --ts-motion-dur-${n}: ${v}ms;`);
  lines.push(`  --ts-motion-loop-move: ${LOOP.move}ms;`, `  --ts-motion-loop-rest: ${LOOP.rest}ms;`, `  --ts-motion-loop-period: ${LOOP.move + LOOP.rest}ms;`, `  --ts-motion-loop-count: ${LOOP.count};`, `  --ts-motion-stagger: ${LOOP.stagger}ms;`);
  for (const [n, v] of Object.entries(EASINGS)) lines.push(`  --ts-motion-ease-${n}: ${v};`);
  for (const n of Object.keys(SPRINGS)) {
    const e = spring(n);
    lines.push(`  --ts-motion-spring-${n}: ${e.easing};`);
    lines.push(`  --ts-motion-spring-${n}-duration: ${e.duration}ms;`);
  }
  return lines.join("\n");
}
const LOOPS = [
  "bob",
  "swing",
  "breathe",
  "float",
  "spin",
  "pulse",
  "nudge",
  "pop",
  "shake"
];
const LOOP_NOTES = {
  bob: "Дээш хөөрөөд зөөлөн буцаж тогтоно (ирэх, хүлээн авах)",
  swing: "Бага зэрэг хазайгаад тэнцвэрээ олно (тэмдэг, шошго)",
  breathe: "Тэгш амьсгал, 1 → 1.06 (амьд, бодож байна)",
  float: "Аажуу хөөрч буцна (санаа, хүлээгдэж буй)",
  spin: "Нэг эргээд зөөлөн зогсоно (шинэчлэх, тохиргоо)",
  pulse: "Долгион тэлж бүдгэрнэ (шууд, идэвхтэй)",
  nudge: "Урагш түлхэгдээд буцна (дараагийн алхам)",
  pop: "Дарагдаад сэргэнэ (баталгаа, дуусгах)",
  shake: "Хүнд юм зөөлөн доргиод тогтоно (анхааруулга)"
};
const LINEAR = (n) => spring(n).easing;
const FALLBACK = (n) => spring(n).fallback;
const r1 = (n) => Math.round(n * 10) / 10;
const kickSettle = (rest, peak, kick, def) => ({
  spring: def,
  natural: (s) => kick + spring(s).duration,
  frames: (t, at, s) => [
    `0% { transform: ${rest}; animation-timing-function: ${EASINGS.enter}; }`,
    `${at(kick)}% { transform: ${peak}; animation-timing-function: ${t(s)}; }`,
    `${at(kick + spring(s).duration)}%, 100% { transform: ${rest}; }`
  ]
});
const sampled = (value, amplitude, kick, def) => ({
  spring: def,
  natural: (s) => kick + spring(s).duration,
  frames: (_t, at, s) => {
    const dur = spring(s).duration;
    return [
      `0% { transform: ${value(0)}; animation-timing-function: ${EASINGS.enter}; }`,
      ...springKeyframes(SPRINGS[s], amplitude, 0, 28).map((f) => `${at(kick + f.offset * dur)}% { transform: ${value(f.value)}; }`),
      `${at(kick + dur)}%, 100% { transform: ${value(0)}; }`
    ];
  }
});
const harmonic = (rest, peak) => ({
  spring: "soft",
  natural: () => 2e3,
  frames: (_t, at) => [
    `0% { transform: ${rest}; animation-timing-function: ${EASINGS.loop}; }`,
    `${at(1e3)}% { transform: ${peak}; animation-timing-function: ${EASINGS.loop}; }`,
    `${at(2e3)}%, 100% { transform: ${rest}; }`
  ]
});
const SHAPES = {
  bob: kickSettle("translateY(0)", "translateY(-14%)", 180, "settle"),
  swing: sampled((v) => `rotate(${v}deg)`, 14, 200, "settle"),
  breathe: harmonic("scale(1)", "scale(1.06)"),
  float: harmonic("translateY(0)", "translateY(-8%)"),
  spin: {
    spring: "soft",
    natural: (s) => spring(s).duration * 1.6,
    frames: (t, at, s) => [
      `0% { transform: rotate(0deg); animation-timing-function: ${t(s)}; }`,
      `${at(spring(s).duration * 1.6)}%, 100% { transform: rotate(360deg); }`
    ]
  },
  pulse: {
    spring: "soft",
    natural: () => 1400,
    frames: (_t, at) => [
      `0% { transform: scale(0.7); opacity: 0.55; animation-timing-function: ${EASINGS.enter}; }`,
      `${at(1400)}%, 100% { transform: scale(1.7); opacity: 0; }`
    ]
  },
  nudge: kickSettle("translateX(0)", "translateX(20%)", 200, "settle"),
  pop: kickSettle("scale(1)", "scale(0.88)", 140, "settle"),
  shake: sampled((v) => `translateX(${v}%)`, 10, 120, "heavy")
};
const cacheAnim = /* @__PURE__ */ new Map();
function loopAnimation(loop, rhythm = {}) {
  const move = rhythm.move ?? LOOP.move;
  const rest = rhythm.rest ?? LOOP.rest;
  const shape2 = SHAPES[loop];
  const s = rhythm.spring ?? shape2.spring;
  const isDefault = move === LOOP.move && rest === LOOP.rest && s === shape2.spring;
  const name = isDefault ? `ts-loop-${loop}` : `ts-loop-${loop}-${move}-${rest}-${s}`;
  const hit = cacheAnim.get(name);
  if (hit) return hit;
  const period = move + rest;
  const scale = move / shape2.natural(s);
  const at = (ms) => Math.min(100, r1(ms * scale / period * 100));
  const block = (t) => `@keyframes ${name} {
  ${shape2.frames(t, at, s).join("\n  ")}
}`;
  const usesSpring = shape2.frames(LINEAR, at, s).join() !== shape2.frames(FALLBACK, at, s).join();
  const css2 = usesSpring ? `${block(FALLBACK)}
@supports (animation-timing-function: linear(0, 1)) {
${block(LINEAR)}
}` : block(FALLBACK);
  const out = { name, period, css: css2 };
  cacheAnim.set(name, out);
  return out;
}
let css;
function motionCss() {
  if (css) return css;
  const keyframes = [
    ...LOOPS.map((n) => loopAnimation(n).css),
    `@keyframes ts-enter {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
}`
  ];
  const loops = LOOPS.map((n) => `.ts-loop-${n} { animation-name: ts-loop-${n}; }`).join("\n");
  css = `${keyframes.join("\n")}
.ts-loop {
  animation-duration: var(--ts-loop-period, var(--ts-motion-loop-period, ${LOOP.move + LOOP.rest}ms));
  animation-delay: var(--ts-loop-delay, 0ms);
  animation-iteration-count: var(--ts-loop-count, var(--ts-motion-loop-count, ${LOOP.count}));
  animation-timing-function: linear;
  transform-box: fill-box;
  transform-origin: var(--ts-loop-origin, 50% 50%);
}
.ts-loop-pulse { animation-fill-mode: both; }
.ts-once { animation-iteration-count: 1; }
${loops}
.ts-enter {
  animation: ts-enter var(--ts-motion-spring-soft-duration, ${spring("soft").duration}ms) var(--ts-motion-spring-soft, ${spring("soft").fallback}) both;
  animation-delay: var(--ts-enter-delay, 0ms);
}
[data-ts-loop="offscreen"] :is(.ts-loop, .ts-enter),
[data-ts-loop="hidden"] :is(.ts-loop, .ts-enter) { animation-play-state: paused; }
[data-ts-loop="paused"] :is(.ts-loop, .ts-enter),
[data-ts-loop="reduced"] :is(.ts-loop, .ts-enter),
[data-ts-motion="off"] :is(.ts-loop, .ts-enter) { animation: none; }
@media (prefers-reduced-motion: reduce) {
  .ts-loop, .ts-enter { animation: none !important; }
}`;
  return css;
}
const MotionContext = React.createContext({ paused: false, setPaused: () => {
} });
function MotionProvider({
  children,
  paused: controlled,
  onPausedChange,
  defaultPaused = false
}) {
  const [own, setOwn] = React.useState(defaultPaused);
  const paused = controlled ?? own;
  const value = React.useMemo(
    () => ({
      paused,
      setPaused: (p) => {
        if (controlled === void 0) setOwn(p);
        onPausedChange?.(p);
      }
    }),
    [paused, controlled, onPausedChange]
  );
  return React.createElement(MotionContext.Provider, { value }, children);
}
const useMotion = () => React.useContext(MotionContext);
const REDUCED = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof matchMedia !== "function") return () => {
      };
      const mq = matchMedia(REDUCED);
      mq.addEventListener?.("change", cb);
      return () => mq.removeEventListener?.("change", cb);
    },
    () => typeof matchMedia === "function" ? matchMedia(REDUCED).matches : false,
    () => false
  );
}
function usePageVisible() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof document === "undefined") return () => {
      };
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => typeof document === "undefined" ? true : document.visibilityState !== "hidden",
    () => true
  );
}
const observers = /* @__PURE__ */ new Map();
function observe(el, rootMargin, threshold, cb) {
  if (typeof IntersectionObserver === "undefined") {
    cb(true);
    return () => {
    };
  }
  const key = `${rootMargin}|${threshold}`;
  let entry = observers.get(key);
  if (!entry) {
    const watchers = /* @__PURE__ */ new Map();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          const screenful = r.rootBounds ? r.intersectionRect.height >= r.rootBounds.height * 0.5 : false;
          const visible = r.isIntersecting && (r.intersectionRatio >= Math.min(threshold, 0.999) || screenful);
          for (const w of watchers.get(r.target) ?? []) w(visible);
        }
      },
      { rootMargin, threshold: [.../* @__PURE__ */ new Set([0, 0.02, 0.05, 0.1, threshold, 0.25, 0.5])].sort((a, b) => a - b) }
    );
    entry = { io, watchers };
    observers.set(key, entry);
  }
  let set = entry.watchers.get(el);
  if (!set) entry.watchers.set(el, set = /* @__PURE__ */ new Set());
  else entry.io.unobserve(el);
  set.add(cb);
  entry.io.observe(el);
  const e = entry;
  return () => {
    const ws = e.watchers.get(el);
    ws?.delete(cb);
    if (ws && ws.size) return;
    e.io.unobserve(el);
    e.watchers.delete(el);
    if (!e.watchers.size) {
      e.io.disconnect();
      observers.delete(key);
    }
  };
}
function isScripted(a) {
  if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) return false;
  if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) return false;
  return true;
}
function syncAnimation(a, state) {
  if (state === "running") a.play();
  else if (state === "paused" || state === "reduced") {
    const end = a.effect?.getComputedTiming().endTime;
    if (typeof end === "number" && Number.isFinite(end)) a.finish();
    else a.cancel();
  } else a.pause();
}
function regionState(el) {
  return el.closest("[data-ts-loop]")?.getAttribute("data-ts-loop") ?? null;
}
function useInViewLoop(options = {}) {
  const { threshold = 0.15, rootMargin = "0px", defaultPaused = false } = options;
  const [el, setEl] = React.useState(null);
  const [inView, setInView] = React.useState(false);
  const [own, setOwn] = React.useState(defaultPaused ? true : null);
  const [epoch, setEpoch] = React.useState(0);
  const page = useMotion();
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisible();
  const pagePaused = page.paused;
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setOwn(null);
  }, [pagePaused]);
  React.useEffect(() => {
    if (!el) return;
    return observe(el, rootMargin, threshold, setInView);
  }, [el, rootMargin, threshold]);
  const paused = own ?? pagePaused;
  const state = reduced ? "reduced" : paused ? "paused" : !visible ? "hidden" : inView ? "running" : "offscreen";
  React.useEffect(() => {
    const node = el;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true })) if (isScripted(a)) syncAnimation(a, state);
  }, [el, state]);
  const wake = React.useCallback(() => {
    const node = el;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true }))
      if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation && a.playState === "finished") a.currentTime = 0;
  }, [el]);
  const prev = React.useRef(state);
  React.useEffect(() => {
    if (state === "running" && (prev.current === "offscreen" || prev.current === "hidden")) wake();
    prev.current = state;
  }, [state, wake]);
  const replay = React.useCallback(() => {
    if (paused) {
      setOwn(false);
      return;
    }
    const node = el;
    if (node?.getAnimations) {
      for (const a of node.getAnimations({ subtree: true })) {
        if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) continue;
        a.currentTime = 0;
        if (isScripted(a)) a.play();
      }
      return;
    }
    setEpoch((n) => n + 1);
  }, [el, paused]);
  return {
    ref: setEl,
    state,
    playing: state === "running",
    paused,
    setPaused: (p) => setOwn(p),
    togglePaused: () => setOwn(!paused),
    replay,
    wake,
    epoch,
    attrs: { "data-ts-loop": state }
  };
}
let styles;
function MotionStyles() {
  if (!styles) {
    const css2 = motionCss() + REPLAY_CSS;
    let h = 0;
    for (let i = 0; i < css2.length; i++) h = Math.imul(h, 31) + css2.charCodeAt(i) | 0;
    styles = { css: css2, href: `ts-motion-${(h >>> 0).toString(36)}` };
  }
  return /* @__PURE__ */ jsx("style", { href: styles.href, precedence: "default", children: styles.css });
}
function useLoop(loop, rhythm = {}, style) {
  const a = loopAnimation(loop, rhythm);
  return {
    keyframes: /* @__PURE__ */ jsx("style", { href: a.name, precedence: "default", children: a.css }),
    props: {
      className: `ts-loop ts-loop-${loop}`,
      style: { animationName: a.name, animationDuration: `${a.period}ms`, ...style }
    }
  };
}
const motionControlLabelsMn = {
  replay: "Дахин тоглуулах",
  pause: "Хөдөлгөөнийг зогсоох",
  play: "Хөдөлгөөнийг үргэлжлүүлэх"
};
const glyph = (d) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: d.map((p) => /* @__PURE__ */ jsx("path", { d: p }, p)) });
const ROTATE = ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"];
const PAUSE = ["M14 4h4v16h-4z", "M6 4h4v16H6z"];
const PLAY = ["M6 3l14 9-14 9z"];
function MotionControls({ onReplay, paused, onTogglePause, showPause = true, labels, className = "" }) {
  const l = { ...motionControlLabelsMn, ...labels };
  return /* @__PURE__ */ jsxs("div", { className: `ts-motion-ctl ${className}`, role: "group", "aria-label": l.replay, children: [
    /* @__PURE__ */ jsx("button", { type: "button", className: "ts-motion-ctl-btn", onClick: onReplay, "aria-label": l.replay, title: l.replay, children: glyph(ROTATE) }),
    showPause && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "ts-motion-ctl-btn",
        onClick: onTogglePause,
        "aria-label": paused ? l.play : l.pause,
        "aria-pressed": paused,
        title: paused ? l.play : l.pause,
        children: glyph(paused ? PLAY : PAUSE)
      }
    )
  ] });
}
function LoopRegion({
  children,
  controls = "none",
  labels,
  className = "",
  style,
  as: Tag = "div",
  onStateChange,
  ...options
}) {
  const loop = useInViewLoop(options);
  React.useEffect(() => onStateChange?.(loop.state), [loop.state, onStateChange]);
  return /* @__PURE__ */ jsxs(
    Tag,
    {
      ref: loop.ref,
      className: `ts-loop-region ${className}`,
      style: controls === "none" ? { "--ts-motion-loop-count": 1, ...style } : style,
      ...loop.attrs,
      "data-controls": controls,
      onPointerEnter: loop.wake,
      children: [
        /* @__PURE__ */ jsx(MotionStyles, {}),
        /* @__PURE__ */ jsx(React.Fragment, { children }, loop.epoch),
        controls !== "none" && loop.state !== "reduced" && /* @__PURE__ */ jsx(MotionControls, { onReplay: loop.replay, paused: loop.paused, onTogglePause: loop.togglePaused, labels })
      ]
    }
  );
}
const REPLAY_CSS = `
.ts-loop-region { position: relative; --ts-ctl-bg: var(--ts-surface, #f7f5ee); --ts-ctl-line: var(--ts-line, #d8d3c6); --ts-ctl-fg: var(--ts-muted, #5e5a52); --ts-ctl-hover: var(--ts-soft, #efebe1); --ts-ctl-strong: var(--ts-fg, #080808); }
:where(.dark, [data-theme=dark]) .ts-loop-region { --ts-ctl-bg: var(--ts-surface, #141416); --ts-ctl-line: var(--ts-line, #2b2b30); --ts-ctl-fg: var(--ts-muted, #a1a1aa); --ts-ctl-hover: var(--ts-soft, #1e1e21); --ts-ctl-strong: var(--ts-fg, #ececef); }
.ts-motion-ctl {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  display: inline-flex; gap: 2px; padding: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ts-ctl-bg) 88%, transparent);
  border: 1px solid var(--ts-ctl-line);
  color: var(--ts-ctl-fg);
  backdrop-filter: blur(6px);
  transition: opacity var(--ts-motion-dur-xs, 120ms) var(--ts-motion-ease-standard, ease);
}
.ts-motion-ctl-btn {
  all: unset; box-sizing: border-box; cursor: pointer;
  display: grid; place-items: center; width: 24px; height: 24px; border-radius: 999px;
}
.ts-motion-ctl-btn:hover { background: var(--ts-ctl-hover); color: var(--ts-ctl-strong); }
.ts-motion-ctl-btn:focus-visible { outline: 2px solid var(--ts-link, #1b5cff); outline-offset: 1px; }
.ts-motion-ctl-btn:active svg { transform: scale(0.88); }
.ts-motion-ctl-btn svg { transition: transform var(--ts-motion-dur-sm, 200ms) var(--ts-motion-ease-standard, ease-out); }
.ts-loop-region[data-controls="hover"] > .ts-motion-ctl { opacity: 0; }
.ts-loop-region[data-controls="hover"]:is(:hover, :focus-within) > .ts-motion-ctl,
.ts-loop-region[data-controls="hover"][data-ts-loop="paused"] > .ts-motion-ctl { opacity: 1; }
/* Inside a <Replay> wrapper (catalog, inai.sh) its ↺ owns the corner: sit beside it. */
.ts-replay-body .ts-loop-region > .ts-motion-ctl { right: 46px; }
.ts-scenario-steps { position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%); display: inline-flex; gap: 4px; pointer-events: none; }
.ts-scenario-steps i { width: 6px; height: 6px; border-radius: 3px; background: var(--ts-ctl-line); transition: width var(--ts-motion-dur-sm, 200ms) var(--ts-motion-ease-standard, ease), background var(--ts-motion-dur-sm, 200ms); }
.ts-scenario-steps i[data-on] { width: 16px; background: var(--ts-selected, #0c8ce9); }
@media (hover: none) { .ts-loop-region[data-controls="hover"] > .ts-motion-ctl { opacity: 1; } }
`;
const supportsLinear = () => typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("animation-timing-function", "linear(0, 1)");
function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function animateSpring(el, keyframes, name = "soft", options = {}) {
  const last = keyframes[keyframes.length - 1] ?? {};
  const target = el;
  const region = regionState(el);
  if (prefersReducedMotion() || region === "reduced" || typeof target.animate !== "function") {
    for (const [k, v] of Object.entries(last)) if (k !== "offset" && v != null) target.style.setProperty(k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`), String(v));
    return null;
  }
  const e = spring(name);
  const a = target.animate(keyframes, {
    duration: e.duration,
    easing: supportsLinear() ? e.easing : e.fallback,
    delay: options.delay ?? 0,
    fill: options.fill ?? "both"
  });
  if (region && region !== "running") syncAnimation(a, region);
  return a;
}
const UNCONTROLLED_MAX_MS = 5e3;
function useScenario(steps, options = {}) {
  const { rest = LOOP.rest, loops = LOOP.count, maxMs, ...view } = options;
  const loop = useInViewLoop(view);
  const last = Math.max(0, steps.length - 1);
  const [index, setIndex] = React.useState(0);
  const [cycle, setCycle] = React.useState(0);
  const stepsRef = React.useRef(steps);
  stepsRef.current = steps;
  const reduced = loop.state === "reduced";
  const running = loop.state === "running";
  const prev = React.useRef(loop.state);
  React.useEffect(() => {
    if (running && (prev.current === "offscreen" || prev.current === "hidden") && cycle >= loops) {
      setIndex(0);
      setCycle(0);
    }
    prev.current = loop.state;
  }, [loop.state, running, cycle, loops]);
  React.useEffect(() => {
    if (!running || last < 1 || cycle >= loops) return;
    const atEnd = index >= last;
    const wait = (stepsRef.current[index]?.hold ?? 1e3) + (atEnd ? rest : 0);
    const t = setTimeout(() => {
      if (!atEnd) setIndex(index + 1);
      else if (cycle + 1 < loops) {
        setIndex(0);
        setCycle(cycle + 1);
      } else setCycle(loops);
    }, wait);
    return () => clearTimeout(t);
  }, [running, index, cycle, loops, last, rest]);
  const playedRef = React.useRef(0);
  React.useEffect(() => {
    if (!running || maxMs == null || cycle >= loops) return;
    const started = Date.now();
    const t = setTimeout(() => {
      setIndex(last);
      setCycle(loops);
    }, Math.max(0, maxMs - playedRef.current));
    return () => {
      clearTimeout(t);
      playedRef.current += Date.now() - started;
    };
  }, [running, maxMs, cycle, loops, last]);
  const shown = reduced ? last : Math.min(index, last);
  const replay = React.useCallback(() => {
    setIndex(0);
    setCycle(0);
    playedRef.current = 0;
    loop.replay();
  }, [loop]);
  return {
    state: steps[shown]?.state,
    index: shown,
    total: steps.length,
    cycle,
    loopState: loop.state,
    playing: running && cycle < loops,
    paused: loop.paused,
    togglePaused: loop.togglePaused,
    replay,
    ref: loop.ref,
    attrs: { "data-ts-loop": loop.state, "data-ts-step": shown }
  };
}
function ScenarioRegion({
  steps,
  children,
  controls = "none",
  labels,
  className = "",
  style,
  as: Tag = "div",
  showSteps = false,
  ...options
}) {
  const free = controls === "none";
  const sc = useScenario(steps, {
    ...options,
    loops: options.loops ?? (free ? 1 : void 0),
    maxMs: options.maxMs ?? (free ? UNCONTROLLED_MAX_MS : void 0)
  });
  return /* @__PURE__ */ jsxs(Tag, { ref: sc.ref, className: `ts-loop-region ts-scenario ${className}`, style, ...sc.attrs, "data-controls": controls, children: [
    /* @__PURE__ */ jsx(MotionStyles, {}),
    children(sc.state, sc),
    controls !== "none" && sc.loopState !== "reduced" && /* @__PURE__ */ jsx(MotionControls, { onReplay: sc.replay, paused: sc.paused, onTogglePause: sc.togglePaused, labels }),
    showSteps && /* @__PURE__ */ jsx("span", { className: "ts-scenario-steps", "aria-hidden": "true", children: steps.map((_, i) => /* @__PURE__ */ jsx("i", { "data-on": i === sc.index || void 0 }, i)) })
  ] });
}
const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 72, 96];
const GAPS = { "stack-sm": 8, "stack-md": 16, "stack-lg": 24, control: 16, section: 72 };
function gapVar(gap) {
  return typeof gap === "number" ? `var(--ts-space-${gap}, ${SPACE[gap - 1]}px)` : `var(--ts-gap-${gap}, ${GAPS[gap]}px)`;
}
function Stack({ gap = "stack-md", direction = "column", align, justify, wrap = false, as: Tag = "div", style, className = "", ...rest }) {
  return /* @__PURE__ */ jsx(
    Tag,
    {
      ...rest,
      className: `ts-stack ${className}`.trim(),
      "data-gap": gap,
      style: {
        display: "flex",
        flexDirection: direction,
        gap: gapVar(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : void 0,
        minWidth: 0,
        ...style
      }
    }
  );
}
const SEL = "var(--ts-selected,#0c8ce9)";
const ON = "var(--ts-on-selected,#fff)";
const ACC = "var(--ts-accent,#1b5cff)";
const STATUSES = ["running", "needs-you", "error", "done", "idle"];
const PRIMITIVES_CSS = `
.ts-btn,.ts-cta,.ts-pill,.ts-tab{-webkit-tap-highlight-color:transparent;font-family:var(--ts-font,Inter,system-ui,sans-serif)}
.ts-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;box-sizing:border-box;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);font-weight:500;line-height:1;text-decoration:none;cursor:pointer;white-space:nowrap;transition:background var(--ts-motion-dur-xs,120ms),border-color var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-btn.is-sm{height:30px;padding:0 12px;font-size:13px}
.ts-btn.is-md{height:36px;padding:0 14px;font-size:14px}
.ts-btn.is-lg{height:48px;padding:0 22px;font-size:15px}
.ts-btn.is-block{display:flex;width:100%}
.ts-btn.is-primary{background:var(--ts-accent-strong,#1b5cff);color:#fff;font-weight:600}
.ts-btn.is-primary:hover{background:color-mix(in srgb,var(--ts-accent-strong,#1b5cff) 88%,#000)}
.ts-btn.is-secondary{background:var(--ts-btn-bg,#fbfaf6);border-color:var(--ts-btn-line,#a8a296);color:var(--ts-btn-fg,#14130f);font-weight:600;box-shadow:0 1px 2px rgb(0 0 0 / .12)}
.ts-btn.is-secondary:hover{background:color-mix(in srgb,var(--ts-btn-bg,#fbfaf6) 92%,var(--ts-btn-fg,#14130f))}
.ts-btn.is-ghost{background:transparent;border-color:var(--ts-btn-line,#a8a296);color:var(--ts-btn-fg,#14130f);font-weight:600}
.ts-btn.is-ghost:hover{background:var(--ts-soft,#efebe1)}
.ts-btn:active{transform:scale(.97)}
.ts-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.ts-btn:focus-visible,.ts-cta:focus-visible,.ts-pill:focus-visible,.ts-tab:focus-visible,.ts-card.is-interactive:focus-visible{outline:2px solid ${SEL};outline-offset:2px}

.ts-cta{display:inline-flex;align-items:stretch;width:fit-content;max-width:100%;height:34px;padding:0;border:0;border-radius:var(--ts-radius-block,0);background:none;font-size:13px;font-weight:500;line-height:1;text-decoration:none;cursor:pointer}
.ts-cta-label{display:inline-flex;align-items:center;padding:9px 14px;background:var(--ts-accent-strong,#1b5cff);color:#fff;white-space:nowrap}
.ts-cta-arrow{display:inline-grid;place-items:center;width:34px;flex:none;background:var(--ts-cta-arrow,#1550e0);color:#fff;transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-cta:hover .ts-cta-arrow svg{transform:translate(2px,-2px)}
.ts-cta-arrow svg{transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-cta.is-ghost .ts-cta-label,.ts-cta.is-ghost .ts-cta-arrow{background:transparent;color:var(--ts-fg,#080808);border:1px solid var(--ts-line,#d8d3c6)}
.ts-cta.is-ghost .ts-cta-arrow{border-left:0}

.ts-pill{display:inline-flex;align-items:center;gap:6px;box-sizing:border-box;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-pill,999px);background:var(--ts-surface,#f7f5ee);color:var(--ts-fg,#080808);font-weight:500;white-space:nowrap;line-height:1}
.ts-pill.is-sm{height:24px;padding:0 9px;font-size:12px}
.ts-pill.is-md{height:30px;padding:0 12px;font-size:13px}
.ts-pill.is-interactive{cursor:pointer}
.ts-pill.is-interactive:hover:not(.is-selected){background:var(--ts-soft,#efebe1)}
.ts-pill.is-selected,.ts-tab.is-selected{border-color:transparent;background:var(--ts-selected-bg,#0a7acb);color:${ON}}
.ts-pill-n{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:9px;background:var(--ts-soft,#efebe1);color:var(--ts-muted,#5e5a52);font-size:11px;font-variant-numeric:tabular-nums}
.is-selected>.ts-pill-n{background:rgb(0 0 0 / .14);color:${ON}}

.ts-tabs{display:flex;gap:2px;max-width:100%;overflow-x:auto;scrollbar-width:none}
.ts-tabs.is-segmented{display:inline-flex;padding:4px;border-radius:calc(var(--ts-radius-control,8px) + 2px);background:var(--ts-soft,#efebe1)}
.ts-tabs.is-tabs{border-bottom:1px solid var(--ts-line,#d8d3c6);padding:4px}
.ts-tab:focus-visible{outline-offset:1px}
.ts-tab{display:inline-flex;align-items:center;gap:6px;flex:none;box-sizing:border-box;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted,#5e5a52);font-weight:500;white-space:nowrap;cursor:pointer;transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms)}
.ts-tabs.is-md .ts-tab{height:32px;padding:0 12px;font-size:13.5px}
.ts-tabs.is-sm .ts-tab{height:26px;padding:0 9px;font-size:12.5px}
.ts-tab:hover:not(.is-selected):not(:disabled){color:var(--ts-fg,#080808);background:var(--ts-soft,#efebe1)}
.ts-tabs.is-segmented .ts-tab:hover:not(.is-selected):not(:disabled){background:var(--ts-surface,#f7f5ee)}
.ts-tab:disabled{opacity:.4;cursor:not-allowed}

.ts-badge{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;box-sizing:border-box;border-radius:6px;font-size:12px;font-weight:500;line-height:1;white-space:nowrap;background:var(--ts-soft,#efebe1);color:var(--ts-muted,#5e5a52)}
.ts-badge.is-blue{background:var(--ts-accent-soft,#dce5ff);color:var(--ts-on-accent-soft,#0f3fb8)}
.ts-badge.is-green{background:var(--ts-green-soft,#e3eadf);color:color-mix(in srgb,var(--ts-green,#5e7a5f) 75%,var(--ts-fg,#080808))}
.ts-badge.is-amber{background:var(--ts-amber-soft,#f2e3cc);color:color-mix(in srgb,var(--ts-amber,#a85a12) 75%,var(--ts-fg,#080808))}
.ts-badge.is-red{background:var(--ts-red-soft,#f4dad6);color:var(--ts-red,#c2362f)}
.ts-badge.is-violet{background:var(--ts-violet-soft,#e5ddf3);color:var(--ts-violet,#6b47c9)}
${[1, 2, 3, 4].map((i) => `.ts-badge.is-cat-${i}{background:var(--ts-cat-${i}-bg,var(--ts-soft,#efebe1));color:var(--ts-cat-${i}-fg,color-mix(in srgb,var(--ts-cat-${i},#888) 62%,var(--ts-fg,#080808)))}`).join("\n")}
${STATUSES.map((st) => `.ts-badge.is-${st}{background:var(--ts-status-${st}-bg);box-shadow:inset 0 0 0 1px var(--ts-status-${st}-border);color:var(--ts-status-${st}-fg)}`).join("\n")}

.ts-tile{display:inline-grid;place-items:center;flex:none;box-sizing:border-box;width:var(--ts-tile-size);height:var(--ts-tile-size);border-radius:var(--ts-radius-tile,6px);background:var(--ts-soft,#efebe1);color:var(--ts-fg,#080808)}
${[1, 2, 3, 4].map((i) => `.ts-tile.is-cat-${i}{background:var(--ts-cat-${i});color:var(--ts-on-cat-${i},#fff)}`).join("\n")}
.ts-tile:is(.is-accent,.is-electric){background:var(--ts-accent-strong,#1b5cff);color:#fff}
${STATUSES.map((st) => `.ts-tile.is-${st}{background:var(--ts-status-${st}-bg);box-shadow:inset 0 0 0 1px var(--ts-status-${st}-border);color:var(--ts-status-${st}-fg)}`).join("\n")}
.ts-tile.is-folder{background:transparent}

.ts-card{display:block;box-sizing:border-box;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee);color:var(--ts-fg,#080808);box-shadow:var(--ts-elevation,none);text-decoration:none;min-width:0}
.ts-card.is-pad-sm{padding:12px}
.ts-card.is-pad-md{padding:16px}
.ts-card.is-pad-lg{padding:24px}
.ts-card.is-block{border-radius:var(--ts-radius-block,0)}
.ts-card.is-interactive{cursor:pointer;transition:border-color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-card.is-interactive:hover{border-color:color-mix(in srgb,var(--ts-fg,#080808) 25%,var(--ts-line,#d8d3c6));transform:translateY(-1px)}
.ts-card.is-selected{border-color:${SEL};box-shadow:0 0 0 1px ${SEL}}

.ts-text{margin:0;color:var(--ts-fg,#080808)}
.ts-text:is(.is-display,.is-h1,.is-h2,.is-h3){font-family:var(--ts-font-head,var(--ts-font-display,Inter,system-ui,sans-serif));font-weight:var(--ts-head-weight,600);letter-spacing:var(--ts-head-tracking,-.02em);text-wrap:balance}
.ts-text.is-display{font-size:clamp(36px,6vw,var(--ts-type-display,59px));line-height:1.05}
.ts-text.is-h1{font-size:clamp(28px,4.5vw,var(--ts-type-h1,36px));line-height:1.1}
.ts-text.is-h2{font-size:clamp(24px,4vw,var(--ts-type-h2,33px));line-height:1.15}
.ts-text.is-h3{font-size:var(--ts-type-h3,20px);line-height:1.25}
.ts-text:is(.is-body-lg,.is-body,.is-small){font-family:var(--ts-font,Inter,system-ui,sans-serif);text-wrap:pretty}
.ts-text.is-body-lg{font-size:18px;line-height:1.55}
.ts-text.is-body{font-size:15px;line-height:1.55}
.ts-text.is-small{font-size:13px;line-height:1.45}
.ts-text:is(.is-label,.is-mono,.is-caption){font-family:var(--ts-font-mono,"IBM Plex Mono",ui-monospace,monospace)}
.ts-text.is-label{font-size:12px;line-height:1.3;letter-spacing:.05em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-text.is-mono{font-size:13px;line-height:1.4}
.ts-text.is-caption{font-size:11px;line-height:1.3;color:var(--ts-faint,#8f8a80)}
.ts-text.is-muted{color:var(--ts-muted,#5e5a52)}
.ts-text.is-faint{color:var(--ts-faint,#8f8a80)}
.ts-text.is-accent{color:var(--ts-accent-fg,${ACC})}

@media (prefers-reduced-motion:reduce){.ts-btn,.ts-card,.ts-cta-arrow,.ts-cta-arrow svg,.ts-tab{transition:none}.ts-btn:active{transform:none}}
`;
const cx$1 = (...c) => c.filter(Boolean).join(" ");
function Button({ variant = "primary", size = "md", icon, iconEnd, href: href2, block, className, children, type, ...rest }) {
  const cls = cx$1("ts-btn", `is-${variant}`, `is-${size}`, block && "is-block", className);
  const iconSize = size === "sm" ? 14 : 16;
  const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    icon && /* @__PURE__ */ jsx(Icon, { name: icon, size: iconSize }),
    children != null && /* @__PURE__ */ jsx("span", { className: "ts-btn-label", children }),
    iconEnd && /* @__PURE__ */ jsx(Icon, { name: iconEnd, size: iconSize })
  ] });
  return href2 ? /* @__PURE__ */ jsx("a", { href: href2, className: cls, ...rest, children: inner }) : /* @__PURE__ */ jsx("button", { type: type ?? "button", className: cls, ...rest, children: inner });
}
function SplitCTA({ children, href: href2, onClick, variant = "primary", icon = "arrow-up-right", className }) {
  const body = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    /* @__PURE__ */ jsx("span", { className: "ts-cta-label", children }),
    /* @__PURE__ */ jsx("span", { className: "ts-cta-arrow", "aria-hidden": "true", children: /* @__PURE__ */ jsx(Icon, { name: icon, size: 16 }) })
  ] });
  const cls = cx$1("ts-cta", `is-${variant}`, className);
  return href2 ? /* @__PURE__ */ jsx("a", { href: href2, className: cls, onClick, children: body }) : /* @__PURE__ */ jsx("button", { type: "button", className: cls, onClick, children: body });
}
function Pill({ children, selected = false, count, icon, onClick, size = "md", className, title }) {
  const cls = cx$1("ts-pill", `is-${size}`, selected && "is-selected", onClick && "is-interactive", className);
  const inner = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    icon && /* @__PURE__ */ jsx(Icon, { name: icon, size: 14 }),
    /* @__PURE__ */ jsx("span", { children }),
    count != null && /* @__PURE__ */ jsx("span", { className: "ts-pill-n", children: count })
  ] });
  return onClick ? /* @__PURE__ */ jsx("button", { type: "button", className: cls, "aria-pressed": selected, onClick, title, children: inner }) : /* @__PURE__ */ jsx("span", { className: cls, title, children: inner });
}
function Tabs({ items, value, onChange, variant = "tabs", label, className, size = "md" }) {
  const refs = React.useRef([]);
  const enabled = items.map((it, i) => it.disabled ? -1 : i).filter((i) => i >= 0);
  const move = (from, dir) => {
    const pos = enabled.indexOf(from);
    const next = dir === "first" ? enabled[0] : dir === "last" ? enabled[enabled.length - 1] : enabled[(pos + dir + enabled.length) % enabled.length];
    if (next == null) return;
    onChange(items[next].value);
    refs.current[next]?.focus();
  };
  const seg = variant === "segmented";
  const current = items.findIndex((it) => it.value === value && !it.disabled);
  const tabbable = current >= 0 ? current : enabled[0] ?? -1;
  return /* @__PURE__ */ jsxs("div", { className: cx$1("ts-tabs", `is-${variant}`, `is-${size}`, className), role: seg ? "radiogroup" : "tablist", "aria-label": label, children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    items.map((it, i) => {
      const on = it.value === value;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          ref: (el) => {
            refs.current[i] = el;
          },
          type: "button",
          role: seg ? "radio" : "tab",
          "aria-checked": seg ? on : void 0,
          "aria-selected": seg ? void 0 : on,
          tabIndex: i === tabbable ? 0 : -1,
          disabled: it.disabled,
          className: cx$1("ts-tab", on && "is-selected"),
          onClick: () => onChange(it.value),
          onKeyDown: (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") e.preventDefault(), move(i, 1);
            else if (e.key === "ArrowLeft" || e.key === "ArrowUp") e.preventDefault(), move(i, -1);
            else if (e.key === "Home") e.preventDefault(), move(i, "first");
            else if (e.key === "End") e.preventDefault(), move(i, "last");
          },
          children: [
            it.icon && /* @__PURE__ */ jsx(Icon, { name: it.icon, size: 14 }),
            /* @__PURE__ */ jsx("span", { children: it.label }),
            it.count != null && /* @__PURE__ */ jsx("span", { className: "ts-pill-n", children: it.count })
          ]
        },
        it.value
      );
    })
  ] });
}
const STATUS_ICON = {
  running: "play",
  "needs-you": "circle-help",
  error: "x",
  done: "check",
  idle: "hourglass"
};
function Badge({ children, tone = "neutral", icon, className }) {
  const glyph2 = icon ?? (tone in STATUS_ICON ? STATUS_ICON[tone] : void 0);
  return /* @__PURE__ */ jsxs("span", { className: cx$1("ts-badge", `is-${tone}`, className), children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    glyph2 && /* @__PURE__ */ jsx(Icon, { name: glyph2, size: 14 }),
    children
  ] });
}
const TILE = { S: [22, 14], M: [32, 18], L: [48, 26], 16: [16, 11], 20: [20, 13], 24: [24, 15], 32: [32, 18] };
function IconTile({
  icon,
  tone = "neutral",
  size = 24,
  label,
  className
}) {
  const folder = tone === "folder";
  const [px, glyph2] = TILE[String(size)] ?? TILE.M;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: cx$1("ts-tile", `is-${tone}`, className),
      style: { ["--ts-tile-size"]: `${px}px` },
      role: label ? "img" : void 0,
      "aria-label": label,
      "aria-hidden": label ? void 0 : true,
      children: [
        /* @__PURE__ */ jsx(PrimitiveStyles, {}),
        /* @__PURE__ */ jsx(Icon, { name: folder ? "folder" : icon, variant: folder ? "filled" : "line", size: folder ? px : glyph2 })
      ]
    }
  );
}
function Card({ as: Tag = "div", padding = "md", interactive, selected, block, className, children, ...rest }) {
  return /* @__PURE__ */ jsxs(
    Tag,
    {
      ...rest,
      className: cx$1("ts-card", `is-pad-${padding}`, interactive && "is-interactive", selected && "is-selected", block && "is-block", className),
      children: [
        /* @__PURE__ */ jsx(PrimitiveStyles, {}),
        children
      ]
    }
  );
}
const TEXT_TAG = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  "body-lg": "p",
  body: "p",
  small: "p",
  label: "span",
  mono: "code",
  caption: "span"
};
function Text({
  variant = "body",
  as,
  tone,
  className,
  children,
  ...rest
}) {
  const Tag = as ?? TEXT_TAG[variant];
  return /* @__PURE__ */ jsxs(Tag, { ...rest, className: cx$1("ts-text", `is-${variant}`, tone && tone !== "default" && `is-${tone}`, className), children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    children
  ] });
}
let href$1;
function PrimitiveStyles() {
  if (!href$1) {
    let h = 0;
    for (let i = 0; i < PRIMITIVES_CSS.length; i++) h = Math.imul(h, 31) + PRIMITIVES_CSS.charCodeAt(i) | 0;
    href$1 = `ts-ui-${(h >>> 0).toString(36)}`;
  }
  return /* @__PURE__ */ jsx("style", { href: href$1, precedence: "default", children: PRIMITIVES_CSS });
}
const cx = (...c) => c.filter(Boolean).join(" ");
function Wordmark({ href: href2 = "index.html", label = "INAI — Нүүр", size = 22, className }) {
  const body = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SiteStyles, {}),
    "inai",
    /* @__PURE__ */ jsx("span", { className: "ts-wm-dot", children: "." })
  ] });
  return href2 ? /* @__PURE__ */ jsx("a", { className: cx("ts-wordmark", className), href: href2, "aria-label": label, style: { fontSize: size }, children: body }) : /* @__PURE__ */ jsx("span", { className: cx("ts-wordmark", className), "aria-label": label, role: "img", style: { fontSize: size }, children: body });
}
const MEGA_CLOSE_DELAY = 280;
const featuredOf = (item) => item.featured ?? (item.feature ? { icon: item.feature.icon, eyebrow: item.feature.kicker, title: item.feature.title, body: item.feature.text, cta: item.feature.cta, href: item.feature.href } : null);
const navBarLabelsMn = { main: "Үндсэн цэс", mobile: "Гар утасны цэс", open: "Цэс нээх", close: "Цэс хаах" };
function NavRow({ l, current, onClick }) {
  return /* @__PURE__ */ jsxs("a", { className: "ts-nav-row", href: l.href, "aria-current": current === l.href ? "page" : void 0, onClick, children: [
    /* @__PURE__ */ jsx("span", { className: "ts-nav-ico", children: /* @__PURE__ */ jsx(Icon, { name: l.icon, size: 16, animate: true }) }),
    /* @__PURE__ */ jsxs("span", { className: "ts-nav-txt", children: [
      /* @__PURE__ */ jsx("b", { children: l.label }),
      l.note && /* @__PURE__ */ jsx("small", { children: l.note })
    ] })
  ] });
}
function NavBar({ items, current, brand, inside, actions, openMenu, onOpenMenuChange, labels, sticky = true, className }) {
  const L = { ...navBarLabelsMn, ...labels };
  const [own, setOwn] = React.useState(null);
  const menu = openMenu !== void 0 ? openMenu : own;
  const setMenu = (id) => (openMenu === void 0 && setOwn(id), onOpenMenuChange?.(id));
  const [pinned, setPinned] = React.useState(false);
  const closeTimer = React.useRef(void 0);
  const cancelClose = () => window.clearTimeout(closeTimer.current);
  React.useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  const headerRef = React.useRef(null);
  const triggers = React.useRef({});
  const close = (focusTrigger = false) => {
    cancelClose();
    const was = menu;
    setPinned(false);
    setMenu(null);
    if (focusTrigger && was) triggers.current[was]?.focus();
  };
  const hoverOpen = (e, id) => {
    if (e.pointerType !== "mouse" || pinned) return;
    cancelClose();
    setMenu(id);
  };
  const hoverLeave = (e) => {
    if (e.pointerType !== "mouse" || pinned || !menu) return;
    cancelClose();
    closeTimer.current = window.setTimeout(() => setMenu(null), MEGA_CLOSE_DELAY);
  };
  const clickTrigger = (id) => {
    cancelClose();
    if (menu === id && pinned) return close();
    setPinned(true);
    setMenu(id);
  };
  React.useEffect(() => {
    if (!menu || !pinned) return;
    const onDown = (e) => {
      if (!headerRef.current?.contains(e.target)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });
  const [phone, setPhone] = React.useState(false);
  const owner = items.find((i) => i.kind === "menu" && i.groups.some((g) => g.links.some((l) => l.href === current)));
  const [section, setSection] = React.useState(owner && owner.kind === "menu" ? owner.id : null);
  const toggle = React.useRef(null);
  const uid = React.useId();
  React.useEffect(() => {
    if (!phone && !menu) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (menu) return close(true);
      setPhone(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });
  return /* @__PURE__ */ jsxs("header", { ref: headerRef, className: cx("ts-navbar", sticky && "is-sticky", className), children: [
    /* @__PURE__ */ jsx(SiteStyles, {}),
    /* @__PURE__ */ jsxs("div", { className: "ts-nav-inner", children: [
      /* @__PURE__ */ jsx("span", { className: "ts-nav-brand", children: brand ?? /* @__PURE__ */ jsx(Wordmark, {}) }),
      /* @__PURE__ */ jsxs("nav", { className: "ts-nav-desktop", "aria-label": L.main, onPointerLeave: hoverLeave, onPointerEnter: (e) => e.pointerType === "mouse" && menu && cancelClose(), children: [
        items.map(
          (item) => item.kind === "link" ? /* @__PURE__ */ jsxs("a", { className: "ts-nav-link", href: item.href, "aria-current": item.href === current || item.match?.includes(current ?? "") ? "page" : void 0, children: [
            item.icon && /* @__PURE__ */ jsx(Icon, { name: item.icon, size: 14 }),
            item.label
          ] }, item.href) : /* @__PURE__ */ jsxs("div", { className: "ts-mega", onPointerEnter: (e) => hoverOpen(e, item.id), children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                ref: (el) => {
                  triggers.current[item.id] = el;
                },
                className: cx("ts-mega-trigger", owner === item && "is-here", menu === item.id && pinned && "is-pinned"),
                "aria-expanded": menu === item.id,
                "aria-controls": `${uid}-mega-${item.id}`,
                onClick: () => clickTrigger(item.id),
                onKeyDown: (e) => {
                  if (e.key !== "ArrowDown") return;
                  e.preventDefault();
                  setPinned(true);
                  setMenu(item.id);
                  window.setTimeout(() => document.getElementById(`${uid}-mega-${item.id}`)?.querySelector("a")?.focus(), 0);
                },
                children: [
                  item.label,
                  " ",
                  /* @__PURE__ */ jsx(Icon, { name: "chevron-down", size: 14 })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { id: `${uid}-mega-${item.id}`, className: "ts-mega-panel", hidden: menu !== item.id, children: [
              /* @__PURE__ */ jsx("div", { className: "ts-mega-groups", children: item.groups.map((g, gi) => /* @__PURE__ */ jsxs("div", { className: "ts-mega-group", style: { ["--g"]: gi }, children: [
                /* @__PURE__ */ jsx("span", { className: "ts-mega-h", children: g.label }),
                g.links.map((l) => /* @__PURE__ */ jsx(NavRow, { l, current, onClick: () => close() }, l.href))
              ] }, g.label)) }),
              (() => {
                const f = featuredOf(item);
                return f && /* @__PURE__ */ jsxs("a", { className: "ts-mega-feature", href: f.href, onClick: () => close(), style: { ["--g"]: item.groups.length }, children: [
                  /* @__PURE__ */ jsx("span", { className: "ts-nav-ico is-accent", children: /* @__PURE__ */ jsx(Icon, { name: f.icon, size: 18 }) }),
                  /* @__PURE__ */ jsx("span", { className: "ts-mega-k", children: f.eyebrow }),
                  /* @__PURE__ */ jsx("b", { children: f.title }),
                  /* @__PURE__ */ jsx("small", { children: f.body }),
                  /* @__PURE__ */ jsxs("span", { className: "ts-mega-cta", children: [
                    f.cta,
                    " ",
                    /* @__PURE__ */ jsx(Icon, { name: "arrow-right", size: 14, animate: true })
                  ] })
                ] });
              })()
            ] })
          ] }, item.id)
        ),
        inside && /* @__PURE__ */ jsxs("a", { className: "ts-nav-link is-inside", href: inside.href, children: [
          inside.label,
          " ",
          /* @__PURE__ */ jsx(Icon, { name: "arrow-up-right", size: 14, animate: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ts-nav-actions", children: [
        actions,
        /* @__PURE__ */ jsx(
          "button",
          {
            ref: toggle,
            type: "button",
            className: "ts-nav-toggle",
            "aria-expanded": phone,
            "aria-controls": `${uid}-mobile`,
            "aria-label": phone ? L.close : L.open,
            onClick: () => setPhone(!phone),
            children: /* @__PURE__ */ jsx(Icon, { name: phone ? "x" : "menu", size: 20 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { id: `${uid}-mobile`, className: "ts-nav-mobile", "aria-label": L.mobile, hidden: !phone, children: [
      inside && /* @__PURE__ */ jsxs("a", { className: "ts-nav-link is-inside", href: inside.href, onClick: () => setPhone(false), children: [
        inside.label,
        " ",
        /* @__PURE__ */ jsx(Icon, { name: "arrow-up-right", size: 16 })
      ] }),
      items.map(
        (item) => item.kind === "link" ? /* @__PURE__ */ jsx("a", { className: "ts-mobile-h", href: item.href, onClick: () => setPhone(false), children: item.label }, item.href) : /* @__PURE__ */ jsxs("div", { className: "ts-mobile-col", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "ts-mobile-h",
              "aria-expanded": section === item.id,
              "aria-controls": `${uid}-mobile-${item.id}`,
              onClick: () => setSection(section === item.id ? null : item.id),
              children: [
                item.label,
                " ",
                /* @__PURE__ */ jsx(Icon, { name: "chevron-down", size: 18 })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { id: `${uid}-mobile-${item.id}`, className: "ts-mobile-body", hidden: section !== item.id, children: item.groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "ts-mega-group", children: [
            item.groups.length > 1 && /* @__PURE__ */ jsx("span", { className: "ts-mega-h", children: g.label }),
            g.links.map((l) => /* @__PURE__ */ jsx(NavRow, { l, current, onClick: () => setPhone(false) }, l.href))
          ] }, g.label)) })
        ] }, item.id)
      )
    ] })
  ] });
}
function Footer({ brand, tagline, cta, email, columns, owner, source, legal = [], end, current, className }) {
  return /* @__PURE__ */ jsxs("footer", { className: cx("ts-footer", className), children: [
    /* @__PURE__ */ jsx(SiteStyles, {}),
    /* @__PURE__ */ jsxs("div", { className: "ts-footer-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "ts-footer-brand", children: [
        brand ?? /* @__PURE__ */ jsx(Wordmark, {}),
        tagline && /* @__PURE__ */ jsx("p", { children: tagline }),
        cta,
        email && /* @__PURE__ */ jsxs("a", { className: "ts-footer-mail", href: `mailto:${email}`, children: [
          /* @__PURE__ */ jsx(Icon, { name: "mail", size: 14, animate: true }),
          email
        ] })
      ] }),
      columns.map((col) => /* @__PURE__ */ jsxs("nav", { className: "ts-footer-col", "aria-label": col.label, children: [
        /* @__PURE__ */ jsx("span", { className: "ts-footer-h", children: col.label }),
        col.groups.map(
          (g) => g.links.length ? /* @__PURE__ */ jsxs("div", { className: "ts-footer-group", children: [
            col.groups.length > 1 && /* @__PURE__ */ jsx("span", { className: "ts-footer-sub", children: g.label }),
            g.links.map((l) => /* @__PURE__ */ jsxs("a", { href: l.href, "aria-current": l.href === current ? "page" : void 0, className: l.icon ? "has-icon" : void 0, children: [
              l.icon && /* @__PURE__ */ jsx(Icon, { name: l.icon, size: 16, animate: true }),
              l.label
            ] }, l.href))
          ] }, g.label) : null
        )
      ] }, col.id))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ts-footer-bottom", children: [
      /* @__PURE__ */ jsx("span", { children: owner }),
      source && /* @__PURE__ */ jsxs("span", { className: "ts-footer-source", children: [
        /* @__PURE__ */ jsx(Icon, { name: "database", size: 13 }),
        source.label,
        source.updated && /* @__PURE__ */ jsxs("time", { dateTime: source.updated, children: [
          " · шинэчлэгдсэн ",
          source.updated
        ] })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "ts-footer-legal", children: [
        legal.map((l) => /* @__PURE__ */ jsx("a", { href: l.href, children: l.label }, l.href)),
        end && /* @__PURE__ */ jsx("span", { className: "ts-footer-end", children: end })
      ] })
    ] })
  ] });
}
const SITE_CSS = `
.ts-wordmark{display:inline-flex;align-items:baseline;font:600 1em/1 var(--ts-font-head,Inter,system-ui,sans-serif);letter-spacing:-.03em;color:var(--ts-fg,#080808);text-decoration:none}
.ts-wm-dot{color:var(--ts-red,#c2362f)}
.ts-navbar{position:relative;z-index:40;background:color-mix(in srgb,var(--ts-page,#f0ede4) 88%,transparent);border-bottom:1px solid var(--ts-line,#d8d3c6);backdrop-filter:blur(10px);font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg,#080808)}
.ts-navbar.is-sticky{position:sticky;top:0}
.ts-nav-inner{position:relative;display:flex;align-items:center;gap:var(--ts-space-5,24px);min-height:60px;max-width:var(--ts-page-max,1200px);margin:0 auto;padding:0 var(--ts-space-5,24px)}
.ts-nav-brand{flex:none}
.ts-nav-desktop{display:flex;align-items:center;align-self:stretch;gap:2px;flex:1;min-width:0}
.ts-nav-link,.ts-mega-trigger{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border:0;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted,#5e5a52);font:500 14px var(--ts-font,Inter,system-ui,sans-serif);text-decoration:none;white-space:nowrap;cursor:pointer;transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms)}
.ts-nav-link:hover,.ts-mega-trigger:hover,.ts-mega-trigger[aria-expanded=true],.ts-mega-trigger.is-here{background:var(--ts-soft,#efebe1);color:var(--ts-fg,#080808)}
.ts-nav-link[aria-current=page]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}
.ts-nav-link.is-inside{margin-left:auto;color:color-mix(in srgb,var(--ts-accent-fg,#1b5cff) 88%,var(--ts-fg,#080808))}
.ts-mega-trigger .cv-icon{transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-standard,ease)}
.ts-mega-trigger[aria-expanded=true] .cv-icon{transform:rotate(180deg)}
.ts-mega{position:static;display:flex;align-items:center;align-self:stretch}
.ts-footer-col a.has-icon{display:inline-flex;align-items:center;gap:8px}
.ts-mega-panel{position:absolute;top:100%;left:0;right:0;z-index:50;display:flex;align-items:stretch;border:1px solid var(--ts-line,#d8d3c6);border-top:0;border-radius:0 0 var(--ts-radius-card,12px) var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee);box-shadow:0 24px 48px -24px rgb(0 0 0 / .3);animation:ts-mega-in var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out) both}
.ts-mega-panel[hidden]{display:none}
.ts-mega-panel::before{content:"";position:absolute;left:0;right:0;top:-12px;height:12px}
.ts-mega-trigger.is-pinned{box-shadow:inset 0 -2px 0 var(--ts-selected,#0c8ce9)}
@keyframes ts-mega-in{from{opacity:0;transform:translateY(-6px)}}
/* the menu reads in order: each group's heading and rows come in one by one (spring), the feature card last */
.ts-nav-desktop .ts-mega-group>*,.ts-nav-desktop .ts-mega-feature{animation:ts-mega-item var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out) both;animation-delay:calc((var(--g,0) * 3 + var(--n,0)) * 90ms)}
.ts-mega-group>:nth-child(2){--n:1}.ts-mega-group>:nth-child(3){--n:2}.ts-mega-group>:nth-child(4){--n:3}.ts-mega-group>:nth-child(5){--n:4}.ts-mega-group>:nth-child(n+6){--n:5}
@keyframes ts-mega-item{from{opacity:0;transform:translateY(4px)}}
.ts-mega-groups{flex:1;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);padding:20px 8px 20px 16px;min-width:0}
.ts-mega-group{display:grid;align-content:start;gap:2px;min-width:0;padding:0 16px}
.ts-mega-group+.ts-mega-group{border-left:1px solid var(--ts-line,#d8d3c6)}
.ts-mega-h{display:block;margin:0 0 6px;padding:0 8px 8px;border-bottom:1px solid var(--ts-line,#d8d3c6);font:600 11px/1.3 var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-fg,#080808)}
.ts-nav-row{display:grid;grid-template-columns:32px minmax(0,1fr);gap:12px;align-items:center;padding:8px;border-radius:var(--ts-radius-control,8px);color:var(--ts-fg,#080808);text-decoration:none;transition:background var(--ts-motion-dur-xs,120ms)}
.ts-nav-ico{display:grid;place-items:center;width:32px;height:32px;border-radius:var(--ts-radius-tile,6px);background:var(--ts-soft,#efebe1);color:var(--ts-muted,#5e5a52);transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-nav-ico.is-accent{background:var(--ts-accent-strong,#1b5cff);color:#fff}
.ts-nav-txt{display:grid;gap:2px;min-width:0}
.ts-nav-txt b{font-size:14px;font-weight:600;line-height:1.3}
.ts-nav-txt small{font-size:13px;line-height:1.35;color:var(--ts-muted,#5e5a52)}
.ts-nav-row:hover,.ts-nav-row[aria-current=page]{background:var(--ts-soft,#efebe1)}
.ts-nav-row:hover .ts-nav-ico{transform:scale(1.06)}
.ts-nav-row[aria-current=page] .ts-nav-ico{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}
.ts-mega-feature{display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:300px;flex:none;padding:24px;border-left:1px solid var(--ts-line,#d8d3c6);background:var(--ts-page,#f0ede4);color:var(--ts-fg,#080808);text-decoration:none;border-radius:0 0 var(--ts-radius-card,12px) 0}
.ts-mega-feature .ts-nav-ico{width:40px;height:40px;margin-bottom:8px}
.ts-mega-k{font-size:12px;font-weight:600;color:var(--ts-accent-fg,#1b5cff)}
.ts-mega-feature b{font-size:16px;line-height:1.3}
.ts-mega-feature small{font-size:13px;line-height:1.5;color:var(--ts-muted,#5e5a52)}
.ts-mega-cta{display:inline-flex;align-items:center;gap:6px;margin-top:auto;padding-top:12px;font-size:14px;font-weight:600}
.ts-mega-feature:hover .ts-mega-cta .cv-icon{transform:translateX(2px)}
.ts-mega-cta .cv-icon{transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-nav-actions{display:flex;align-items:center;gap:8px;flex:none;margin-left:auto}
.ts-nav-toggle{display:none;place-items:center;width:40px;height:40px;border:0;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-fg,#080808);cursor:pointer}
.ts-nav-toggle:hover{background:var(--ts-soft,#efebe1)}
.ts-nav-mobile{padding:0 var(--ts-space-4,16px) var(--ts-space-4,16px);max-height:calc(100dvh - 60px);overflow-y:auto;overscroll-behavior:contain}
.ts-nav-mobile[hidden]{display:none}
.ts-mobile-col{border-top:1px solid var(--ts-line,#d8d3c6)}
.ts-mobile-h{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:0 4px;border:0;background:none;color:var(--ts-fg,#080808);font:600 16px var(--ts-font,Inter,system-ui,sans-serif);text-align:left;text-decoration:none;cursor:pointer}
.ts-mobile-h .cv-icon{color:var(--ts-muted,#5e5a52);transition:transform var(--ts-motion-dur-sm,200ms)}
.ts-mobile-h[aria-expanded=true] .cv-icon{transform:rotate(180deg)}
.ts-mobile-body{display:grid;gap:8px;padding-bottom:12px}
.ts-mobile-body[hidden]{display:none}
.ts-nav-mobile .ts-mega-group{padding:0}
.ts-nav-mobile .ts-mega-group+.ts-mega-group{border-left:0}
.ts-nav-mobile .ts-nav-link.is-inside{margin:8px 0}
.ts-nav-link:focus-visible,.ts-mega-trigger:focus-visible,.ts-nav-row:focus-visible,.ts-mega-feature:focus-visible,.ts-nav-toggle:focus-visible,.ts-mobile-h:focus-visible,.ts-footer a:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:2px}
@media (max-width:1080px){.ts-mega-feature{display:none}}
@media (max-width:860px){.ts-nav-desktop{display:none}.ts-nav-toggle{display:grid}.ts-nav-inner{padding:0 var(--ts-space-4,16px)}}

.ts-footer{border-top:1px solid var(--ts-line,#d8d3c6);background:var(--ts-page,#f0ede4);color:var(--ts-fg,#080808);font-family:var(--ts-font,Inter,system-ui,sans-serif)}
.ts-footer-grid{display:grid;grid-template-columns:minmax(0,1.4fr) repeat(auto-fit,minmax(140px,1fr));gap:40px 0;max-width:var(--ts-page-max,1200px);margin:0 auto;padding:var(--ts-space-7,48px) var(--ts-space-5,24px) 0}
.ts-footer-brand{display:grid;align-content:start;justify-items:start;gap:var(--ts-space-4,16px);padding-right:24px}
.ts-footer-brand p{margin:0;max-width:260px;font-size:14px;line-height:1.6;color:var(--ts-muted,#5e5a52)}
.ts-footer-mail{display:inline-flex;align-items:center;gap:6px;font-size:14px;color:color-mix(in srgb,var(--ts-accent-fg,#1b5cff) 88%,var(--ts-fg,#080808));text-decoration:none}
.ts-footer-col{display:grid;align-content:start;gap:12px;padding:0 24px;border-left:1px solid var(--ts-line,#d8d3c6)}
.ts-footer-h{padding-bottom:10px;border-bottom:1px solid var(--ts-line,#d8d3c6);font-size:14px;font-weight:600}
.ts-footer-group{display:grid;justify-items:start}
.ts-footer-sub{padding:10px 0 6px;font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase}
.ts-footer-group a,.ts-footer-legal a{display:inline-flex;align-items:center;min-height:32px;font-size:14px;color:var(--ts-muted,#5e5a52);text-decoration:none}
.ts-footer-group a:hover,.ts-footer-legal a:hover{color:var(--ts-fg,#080808);text-decoration:underline;text-underline-offset:3px}
.ts-footer-group a{position:relative;transition:color var(--ts-motion-dur-sm,200ms),padding var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out)}
.ts-footer-group a[aria-current=page]{padding-left:12px;color:var(--ts-fg,#080808);font-weight:600}
.ts-footer-group a[aria-current=page]::before{content:"";position:absolute;left:0;top:50%;width:4px;height:4px;margin-top:-2px;border-radius:2px;background:var(--ts-selected,#0c8ce9)}
.ts-footer-bottom{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 24px;max-width:var(--ts-page-max,1200px);margin:var(--ts-space-7,48px) auto 0;padding:16px var(--ts-space-5,24px) 24px;border-top:1px solid var(--ts-line,#d8d3c6);font-size:13px;color:var(--ts-muted,#5e5a52)}
.ts-footer-source{display:inline-flex;align-items:center;gap:6px;font-family:var(--ts-font-mono,"IBM Plex Mono",monospace);font-size:12px}
.ts-footer-legal{display:flex;flex-wrap:wrap;align-items:center;gap:4px 20px}
.ts-footer-legal a{font-size:13px}
.ts-footer-end{display:inline-flex;align-items:center;gap:8px;padding-left:20px;border-left:1px solid var(--ts-line,#d8d3c6)}
@media (max-width:1000px){.ts-footer-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.ts-footer-brand{grid-column:1/-1}.ts-footer-col:nth-of-type(3n+1){padding-left:0;border-left:0}}
@media (max-width:640px){.ts-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 0;padding:var(--ts-space-6,32px) var(--ts-space-4,16px) 0}.ts-footer-col{padding:0 16px}.ts-footer-col:nth-of-type(2n+1){padding-left:0;border-left:0}.ts-footer-bottom{flex-direction:column;align-items:flex-start;padding:16px var(--ts-space-4,16px) 24px}.ts-footer-end{padding-left:0;border-left:0}}
@media (pointer:coarse){.ts-footer-group a,.ts-footer-legal a{min-height:44px}}
@media (prefers-reduced-motion:reduce){.ts-mega-panel,.ts-nav-desktop .ts-mega-group>*,.ts-nav-desktop .ts-mega-feature{animation:none}.ts-nav-ico,.ts-mega-cta .cv-icon,.ts-mega-trigger .cv-icon{transition:none}}
`;
let href;
function SiteStyles() {
  if (!href) {
    let h = 0;
    for (let i = 0; i < SITE_CSS.length; i++) h = Math.imul(h, 31) + SITE_CSS.charCodeAt(i) | 0;
    href = `ts-site-${(h >>> 0).toString(36)}`;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    /* @__PURE__ */ jsx("style", { href, precedence: "default", children: SITE_CSS })
  ] });
}
const scenarioChatLabelsMn = {
  list: "Асуултууд",
  more: (n) => `Бусад асуулт (${n})`,
  less: "Хураах",
  sources: "Санах ойгоос хайв",
  steps: "Алхам",
  doubt: "Эргэлзээ",
  understand: "Асуултыг задлав",
  thinking: "Бодож байна",
  trail: "Хариулт бэлдэж байна",
  trailDone: "Хариулт бэлэн",
  sourceTypes: { document: "Баримт", register: "Бүртгэл", decision: "Шийдвэр", note: "Нот" },
  approval: "Хүний батлалт",
  close: "Хаах",
  guards: {
    "human-approval": { label: "Хүн батална", pending: "Хүний батлалт хүлээж байна", human: true },
    "role-access": { label: "Таны эрхээр л нээгдэх өгөгдлөөс", pending: "Эрхийг шалгаж байна", human: false }
  }
};
const SOURCE = {
  document: { icon: "file-text", tone: "cat-2", cat: 2 },
  register: { icon: "table", tone: "cat-3", cat: 3 },
  decision: { icon: "git-branch", tone: "cat-4", cat: 4 },
  note: { icon: "pencil", tone: "cat-1", cat: 1 }
};
const sourceMeta = (type) => SOURCE[type] ?? { icon: "file-text", tone: "neutral", cat: 2 };
function phasesOf(s) {
  const out = [{ state: { at: "question", n: 0 }, hold: 900 }];
  (s.sources ?? []).forEach((_, i) => out.push({ state: { at: "source", n: i + 1 }, hold: 520 }));
  (s.steps ?? []).forEach((_, i) => out.push({ state: { at: "step", n: i + 1 }, hold: 640 }));
  if (s.answer) out.push({ state: { at: "answer", n: 0 }, hold: Math.max(1400, words(s.answer).length * WORD_MS + 400) });
  if (s.guard) out.push({ state: { at: "guard", n: 0 }, hold: 900 });
  out.push({ state: { at: "done", n: 0 }, hold: 400 });
  return out;
}
const ORDER = ["question", "source", "step", "answer", "guard", "done"];
const WORD_MS = 70;
const words = (t) => t.split(/(\s+)/).filter(Boolean);
const IDLE_MS = 8e3;
const past = (p, at) => ORDER.indexOf(p.at) > ORDER.indexOf(at);
function ScenarioChat({ scenarios, people = [], autoplay = true, loops = 3, defaultIndex = 0, onSelect, labels, className = "" }) {
  const L = { ...scenarioChatLabelsMn, ...labels, guards: { ...scenarioChatLabelsMn.guards, ...labels?.guards } };
  const [pick, setPick] = React.useState(Math.min(defaultIndex, Math.max(0, scenarios.length - 1)));
  const [played, setPlayed] = React.useState(0);
  const [manual, setManual] = React.useState(!autoplay);
  const [listOpen, setListOpen] = React.useState(false);
  const listId = React.useId();
  const cur = scenarios[pick];
  const steps = React.useMemo(() => cur ? phasesOf(cur) : [{ state: { at: "done", n: 0 }, hold: 1e3 }], [cur]);
  const sc = useScenario(steps, { loops: 1, rest: 2600 });
  const finished = sc.cycle >= 1;
  React.useEffect(() => {
    if (!finished || manual || scenarios.length < 2 || played + 1 >= loops) return;
    setPlayed((n) => n + 1);
    setPick((i) => (i + 1) % scenarios.length);
    sc.replay();
  }, [finished]);
  const phase = manual ? { at: "done", n: 0 } : sc.state;
  const phaseKey = `${cur?.id}:${phase.at}:${phase.n}`;
  const began = React.useRef({});
  if (!began.current[phaseKey]) {
    for (const k of Object.keys(began.current)) if (!k.startsWith(`${cur?.id}:`)) delete began.current[k];
    began.current[phaseKey] = Date.now();
  }
  const [wordsShown, setWordsShown] = React.useState(0);
  React.useEffect(() => {
    if (phase.at !== "answer" || !cur?.answer) return;
    setWordsShown(0);
    const total = words(cur.answer).length;
    let n = 0;
    const t = window.setInterval(() => {
      n += 1;
      setWordsShown(n);
      if (n >= total) window.clearInterval(t);
    }, WORD_MS);
    return () => window.clearInterval(t);
  }, [phase.at, cur?.id]);
  const took = React.useRef(false);
  const idle = React.useRef(void 0);
  React.useEffect(() => () => window.clearTimeout(idle.current), []);
  const latest = React.useRef(sc);
  latest.current = sc;
  const touch = () => {
    if (manual) return;
    if (!latest.current.paused) {
      took.current = true;
      latest.current.togglePaused();
    }
    if (!took.current) return;
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => {
      if (took.current && latest.current.paused) latest.current.togglePaused();
      took.current = false;
      setPeek(null);
    }, IDLE_MS);
  };
  const [peek, setPeek] = React.useState(null);
  const [opened, setOpened] = React.useState(null);
  const choose = (i) => {
    setManual(true);
    setPick(i);
    setListOpen(false);
    onSelect?.(scenarios[i]);
  };
  const replay = () => {
    setManual(false);
    setPlayed(0);
    sc.replay();
  };
  if (!cur) return null;
  const person = cur.personId ? people.find((p) => p.id === cur.personId) : void 0;
  const guard = cur.guard ? L.guards[cur.guard] : void 0;
  const srcShown = phase.at === "source" ? phase.n : past(phase, "source") ? cur.sources?.length ?? 0 : 0;
  const answerShown = phase.at === "answer" || past(phase, "answer");
  const guardShown = phase.at === "guard" || past(phase, "guard");
  const guardOk = past(phase, "guard");
  const answerWords = cur.answer ? words(cur.answer) : [];
  const answerText = phase.at === "answer" ? answerWords.slice(0, wordsShown).join("") : answerWords.join("");
  const runAt = (key) => began.current[`${cur.id}:${key}`];
  const srcN = cur.sources?.length ?? 0;
  const searching = phase.at === "source";
  const searchDone = past(phase, "source") || srcN === 0 && past(phase, "question");
  const trail = [
    {
      id: "understand",
      title: L.understand,
      state: phase.at === "question" ? "running" : "done",
      status: L.thinking,
      startedAt: phase.at === "question" ? runAt("question:0") : void 0,
      duration: 900
    }
  ];
  if (srcN)
    trail.push({
      id: "search",
      title: L.sources,
      state: searching ? "running" : searchDone ? "done" : "pending",
      status: `${srcShown}/${srcN}`,
      startedAt: searching ? runAt("source:1") : void 0,
      duration: srcN * 520,
      substeps: (cur.sources ?? []).slice(0, searching ? srcShown : searchDone ? srcN : 0).map((src, i, arr) => ({
        id: `${src.title}-${i}`,
        title: src.title,
        state: searching && i === arr.length - 1 ? "running" : "done",
        tag: L.sourceTypes[src.type] ?? src.type,
        tagTone: sourceMeta(src.type).cat,
        detail: [src.size, src.date].filter(Boolean).join(" · ") || void 0
      }))
    });
  (cur.steps ?? []).forEach((st, i) => {
    const running = phase.at === "step" && phase.n === i + 1;
    const done = past(phase, "step") || phase.at === "step" && phase.n > i + 1;
    trail.push({
      id: `step-${i}`,
      title: st,
      state: running ? "running" : done ? "done" : "pending",
      startedAt: running ? runAt(`step:${i + 1}`) : void 0,
      duration: 640
    });
  });
  if (guard?.human)
    trail.push({ id: "gate", title: L.approval, state: guardOk ? "done" : guardShown ? "waiting" : "pending", gate: true, duration: guardOk ? 900 : void 0 });
  const autoOpen = trail.filter((t) => t.state === "running" && t.substeps?.length).map((t) => t.id);
  const doneSearch = [];
  return /* @__PURE__ */ jsxs("div", { ref: sc.ref, className: `ts-loop-region ts-sc ${className}`, ...sc.attrs, "data-controls": "hover", onKeyDown: touch, children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    /* @__PURE__ */ jsx(MotionStyles, {}),
    /* @__PURE__ */ jsx("style", { href: "ts-scenario-chat", precedence: "default", children: CSS$2 }),
    /* @__PURE__ */ jsxs("div", { className: "ts-sc-side", children: [
      /* @__PURE__ */ jsx("ol", { className: "ts-sc-list", id: listId, "aria-label": L.list, "data-open": listOpen || void 0, children: scenarios.map((s, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { type: "button", className: "ts-sc-q", "aria-pressed": i === pick, onClick: () => choose(i), children: [
        /* @__PURE__ */ jsx(Icon, { name: "message-circle", size: 14 }),
        /* @__PURE__ */ jsxs("span", { children: [
          s.group && /* @__PURE__ */ jsx("small", { children: s.group }),
          s.question
        ] })
      ] }) }, s.id)) }),
      scenarios.length > 1 && /* @__PURE__ */ jsxs("button", { type: "button", className: "ts-sc-more", "aria-expanded": listOpen, "aria-controls": listId, onClick: () => setListOpen(!listOpen), children: [
        /* @__PURE__ */ jsx(Icon, { name: "chevron-down", size: 14 }),
        listOpen ? L.less : L.more(scenarios.length - 1)
      ] })
    ] }),
    /* @__PURE__ */ jsxs("article", { className: "ts-sc-answer", "aria-live": "polite", children: [
      /* @__PURE__ */ jsxs("p", { className: "ts-sc-asker", children: [
        /* @__PURE__ */ jsx(Icon, { name: "user", size: 14 }),
        cur.role,
        person ? ` · ${person.name}` : ""
      ] }),
      /* @__PURE__ */ jsx("p", { className: "ts-sc-question ts-enter", children: cur.question }),
      cur.doubt && /* @__PURE__ */ jsxs("p", { className: "ts-sc-doubt", children: [
        /* @__PURE__ */ jsx(Icon, { name: "circle-help", size: 14 }),
        L.doubt,
        ": ",
        cur.doubt
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ts-sc-trail", onClick: touch, children: /* @__PURE__ */ jsx(
        AgentTrail,
        {
          title: answerShown ? L.trailDone : L.trail,
          steps: trail,
          expanded: opened ?? (manual ? doneSearch : autoOpen),
          onExpandedChange: (ids) => {
            touch();
            setOpened(ids);
          }
        }
      ) }),
      !!cur.sources?.length && /* @__PURE__ */ jsxs("section", { className: "ts-sc-block", "data-on": searchDone || void 0, children: [
        /* @__PURE__ */ jsxs("span", { className: "ts-sc-h", children: [
          /* @__PURE__ */ jsx(Icon, { name: "search", size: 13 }),
          L.sources
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "ts-sc-sources", children: cur.sources.map((src, i) => {
          const t = sourceMeta(src.type);
          const open = peek === i;
          return /* @__PURE__ */ jsxs("li", { "data-on": searchDone || void 0, style: { "--i": i }, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "ts-sc-chip",
                "aria-expanded": open,
                onClick: () => {
                  touch();
                  setPeek(open ? null : i);
                },
                children: [
                  /* @__PURE__ */ jsx(IconTile, { icon: t.icon, tone: t.tone, size: "S" }),
                  /* @__PURE__ */ jsx("span", { className: "ts-sc-chip-t", children: src.title }),
                  (src.date || src.size) && /* @__PURE__ */ jsx("small", { children: [src.size, src.date].filter(Boolean).join(" · ") })
                ]
              }
            ),
            open && /* @__PURE__ */ jsxs("div", { className: "ts-sc-pop", role: "dialog", "aria-label": src.title, children: [
              /* @__PURE__ */ jsx(IconTile, { icon: t.icon, tone: t.tone, size: "M" }),
              /* @__PURE__ */ jsx("b", { children: src.title }),
              /* @__PURE__ */ jsxs("dl", { children: [
                /* @__PURE__ */ jsx("dt", { children: L.sources }),
                /* @__PURE__ */ jsx("dd", { children: L.sourceTypes[src.type] ?? src.type }),
                src.date && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("dt", { children: "Огноо" }),
                  /* @__PURE__ */ jsx("dd", { children: src.date })
                ] }),
                src.size && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("dt", { children: "Уншсан" }),
                  /* @__PURE__ */ jsx("dd", { children: src.size })
                ] })
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", className: "ts-sc-pop-x", "aria-label": L.close, onClick: () => setPeek(null), children: /* @__PURE__ */ jsx(Icon, { name: "x", size: 14 }) })
            ] })
          ] }, `${src.title}-${i}`);
        }) })
      ] }),
      cur.answer && /* @__PURE__ */ jsxs("p", { className: "ts-sc-text", "data-on": answerShown || void 0, "aria-label": cur.answer, children: [
        /* @__PURE__ */ jsx(Icon, { name: "sparkles", size: 15 }),
        /* @__PURE__ */ jsxs("span", { "aria-hidden": "true", children: [
          answerText,
          phase.at === "answer" && wordsShown < answerWords.length && /* @__PURE__ */ jsx("i", { className: "ts-sc-caret" })
        ] })
      ] }),
      guard && /* @__PURE__ */ jsxs("p", { className: `ts-sc-guard${guard.human ? " is-human" : ""}`, "data-on": guardShown || void 0, "data-ok": guardOk || void 0, children: [
        /* @__PURE__ */ jsx(Icon, { name: guard.human ? "user-check" : "shield-check", size: 15 }),
        guardOk ? guard.label : guard.pending
      ] }),
      L.fiction && /* @__PURE__ */ jsx("p", { className: "ts-sc-fiction", children: L.fiction })
    ] }, cur.id),
    sc.loopState !== "reduced" && /* @__PURE__ */ jsx(MotionControls, { onReplay: replay, paused: sc.paused, onTogglePause: sc.togglePaused })
  ] });
}
const CSS$2 = `
.ts-sc{display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);gap:var(--ts-space-5,24px);font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg,#080808)}
.ts-sc-side{display:grid;gap:4px;align-content:start;min-width:0}
.ts-sc-list{display:grid;gap:4px;align-content:start;margin:0;padding:0;list-style:none}
.ts-sc-more{display:none;align-items:center;gap:6px;justify-self:start;height:32px;padding:0 10px;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-pill,999px);background:var(--ts-surface,#f7f5ee);color:var(--ts-fg,#080808);font:500 13px var(--ts-font,Inter,system-ui,sans-serif);cursor:pointer}
.ts-sc-more .cv-icon{transition:transform var(--ts-motion-dur-sm,200ms)}
.ts-sc-more[aria-expanded=true] .cv-icon{transform:rotate(180deg)}
.ts-sc-more:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:2px}
.ts-sc-q{display:flex;gap:10px;width:100%;padding:10px 12px;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted,#5e5a52);font:500 14px/1.4 var(--ts-font,Inter,system-ui,sans-serif);text-align:left;cursor:pointer;transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms)}
.ts-sc-q .cv-icon{flex:none;margin-top:2px}
.ts-sc-q small{display:block;margin-bottom:2px;font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.04em;text-transform:uppercase;opacity:.8}
.ts-sc-q:hover{background:var(--ts-soft,#efebe1);color:var(--ts-fg,#080808)}
.ts-sc-q[aria-pressed=true]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}.ts-sc-q[aria-pressed=true] small{opacity:1}
.ts-sc-q:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:2px}
.ts-sc-answer{display:grid;gap:var(--ts-space-4,16px);align-content:start;min-width:0;padding:var(--ts-space-5,24px);border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee)}
.ts-sc-asker,.ts-sc-doubt,.ts-sc-guard,.ts-sc-h{display:inline-flex;align-items:center;gap:6px;margin:0}
.ts-sc-asker{font:500 12px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-muted,#5e5a52)}
.ts-sc-question{margin:0;font:var(--ts-head-weight,600) 20px/1.3 var(--ts-font-head,Inter,system-ui,sans-serif);letter-spacing:var(--ts-head-tracking,-.02em)}
.ts-sc-doubt{font-size:13px;color:var(--ts-muted,#5e5a52)}
.ts-sc-block{display:grid;gap:8px}
.ts-sc-block:not([data-on]){display:none}
.ts-sc-h{font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-sc-sources{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.ts-sc-sources li{display:inline-flex;align-items:center;gap:8px;padding:4px 10px 4px 4px;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-pill,999px);background:var(--ts-page,#f0ede4);font-size:13px;opacity:0;transform:translateY(6px) scale(.97);transition:opacity var(--ts-motion-dur-sm,200ms),transform var(--ts-motion-spring-settle-duration,790ms) var(--ts-motion-spring-settle,ease-out)}
.ts-sc-sources li[data-on]{opacity:1;transform:none;transition-delay:calc(var(--i,0) * 120ms)}
.ts-sc-sources time{font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-muted,#5e5a52);white-space:nowrap}
.ts-sc-steps{display:grid;gap:6px;margin:0;padding:0;list-style:none}
.ts-sc-steps li{display:flex;gap:8px;align-items:flex-start;font-size:14px;line-height:1.45;color:var(--ts-muted,#5e5a52);transition:color var(--ts-motion-dur-sm,200ms)}
.ts-sc-steps li .cv-icon{flex:none;margin-top:2px;transition:transform var(--ts-motion-spring-settle-duration,790ms) var(--ts-motion-spring-settle,ease-out)}
.ts-sc-steps li[data-done]{color:var(--ts-fg,#080808)}
.ts-sc-steps li[data-done] .cv-icon{color:var(--ts-status-done-fg,#3f5e41);transform:scale(1.08)}
.ts-sc-text{display:flex;gap:8px;margin:0;font-size:15px;line-height:1.6;opacity:0;transform:translateY(6px);transition:opacity var(--ts-motion-dur-md,320ms),transform var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out)}
.ts-sc-text .cv-icon{flex:none;margin-top:4px;color:var(--ts-accent-fg,#1b5cff)}
.ts-sc-text[data-on]{opacity:1;transform:none}
.ts-sc-guard{justify-self:start;padding:6px 10px;border-radius:var(--ts-radius-pill,999px);font-size:13px;font-weight:500;background:var(--ts-status-idle-bg,#efebe1);color:var(--ts-status-idle-fg,#45433f);box-shadow:inset 0 0 0 1px var(--ts-status-idle-border,#d8d3c6);opacity:0;transform:scale(.96);transition:opacity var(--ts-motion-dur-sm,200ms),transform var(--ts-motion-spring-settle-duration,790ms) var(--ts-motion-spring-settle,ease-out),background var(--ts-motion-dur-md,320ms),color var(--ts-motion-dur-md,320ms)}
.ts-sc-guard[data-on]{opacity:1;transform:none}
.ts-sc-guard.is-human:not([data-ok]){background:var(--ts-status-needs-you-bg,#fdebd6);color:var(--ts-status-needs-you-fg,#a33e0b);box-shadow:inset 0 0 0 1px var(--ts-status-needs-you-border,#f2c597)}
.ts-sc-guard[data-ok]{background:var(--ts-status-done-bg,#e3eadf);color:var(--ts-status-done-fg,#3f5e41);box-shadow:inset 0 0 0 1px var(--ts-status-done-border,#bfd2bb)}
/* the trail: AgentTrail on the Thinking State tokens, full width, no card of its own */
.ts-sc-trail .atr{max-width:none;padding:0;border:0;box-shadow:none;background:none;--atr-bg:transparent;--atr-fg:var(--ts-fg,#080808);--atr-muted:var(--ts-muted,#5e5a52);--atr-faint:var(--ts-muted,#5e5a52);--atr-line:var(--ts-line,#d8d3c6);--atr-accent:var(--ts-accent-fg,#1b5cff);font-family:inherit}
.ts-sc-trail .atr-title{font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-sc-trail .atr-step{animation:ts-sc-row .42s var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both}
.ts-sc-trail .atr-pending .atr-name{opacity:.55}
@keyframes ts-sc-row{from{opacity:0;transform:translateY(4px)}}
.ts-sc-chip{display:inline-flex;align-items:center;gap:8px;padding:4px 10px 4px 4px;border:0;border-radius:inherit;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.ts-sc-chip small{font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-muted,#5e5a52);white-space:nowrap}
.ts-sc-chip:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:2px}
.ts-sc-sources li{position:relative;padding:0}
.ts-sc-sources li:has(.ts-sc-chip[aria-expanded=true]){border-color:var(--ts-selected,#0c8ce9)}
.ts-sc-pop{position:absolute;z-index:5;top:calc(100% + 6px);left:0;display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:center;width:max-content;max-width:280px;padding:12px 32px 12px 12px;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee);box-shadow:0 12px 32px -12px rgb(0 0 0 / .3);animation:ts-sc-row .32s var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both}
.ts-sc-pop b{font-size:14px}
.ts-sc-pop dl{grid-column:1/-1;display:grid;grid-template-columns:auto 1fr;gap:2px 12px;margin:0;font-size:12.5px}
.ts-sc-pop dt{color:var(--ts-muted,#5e5a52)}.ts-sc-pop dd{margin:0}
.ts-sc-pop-x{position:absolute;top:6px;right:6px;display:grid;place-items:center;width:24px;height:24px;border:0;border-radius:6px;background:none;color:var(--ts-muted,#5e5a52);cursor:pointer}
.ts-sc-caret{display:inline-block;width:2px;height:1em;margin-left:2px;vertical-align:-2px;background:var(--ts-accent-fg,#1b5cff);animation:ts-sc-blink 1s steps(2) infinite}
@keyframes ts-sc-blink{50%{opacity:0}}
.ts-sc-guard[data-ok]{animation:ts-sc-pulse .9s var(--ts-motion-ease-out,ease-out) 1}
@keyframes ts-sc-pulse{0%{box-shadow:inset 0 0 0 1px var(--ts-status-done-border,#bfd2bb),0 0 0 0 color-mix(in srgb,var(--ts-status-done-fg,#3f5e41) 35%,transparent)}100%{box-shadow:inset 0 0 0 1px var(--ts-status-done-border,#bfd2bb),0 0 0 10px transparent}}
.ts-sc-fiction{margin:0;font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-faint,#8f8a80)}
@media (max-width:720px){.ts-sc{grid-template-columns:minmax(0,1fr);gap:var(--ts-space-4,16px)}.ts-sc-more{display:inline-flex}.ts-sc-list:not([data-open]) li:not(:has(.ts-sc-q[aria-pressed=true])){display:none}.ts-sc-answer{padding:var(--ts-space-4,16px)}}
@media (prefers-reduced-motion:reduce){.ts-sc *{transition:none!important}}
`;
const agentConsentLabelsMn = {
  title: "Эрхийн хүсэлт",
  preview: "Юу харагдах вэ",
  reason: "Яагаад",
  allow: (s, d) => s === "once" ? "Нэг удаа зөвшөөрөх" : s === "timed" ? `${d} зөвшөөрөх` : "Үргэлж зөвшөөрөх",
  deny: "Татгалзах",
  change: "Өөрчлөх",
  allowed: "Зөвшөөрлөө",
  denied: "Татгалзлаа",
  waiting: "Таны шийдвэрийг хүлээж байна",
  scopes: { once: "Нэг удаа", timed: "Хугацаатай", always: "Үргэлж" },
  risk: { safe: "Аюулгүй", risky: "Эрсдэлтэй", destructive: "Буцаахгүй" },
  scopeLabel: "Хамрах хүрээ",
  trail: { title: "Агентын явц", started: "Ажлыг эхлүүлсэн", scoped: "Хэрэгцээт эрхийг тодорхойлов", decide: "Таны шийдвэр", reading: "Шалгаж байна" }
};
const RISK_TONE = { safe: "done", risky: "needs-you", destructive: "error" };
const STORY = [
  { state: "request", hold: 1400 },
  { state: "scope", hold: 1200 },
  { state: "waiting", hold: 1300 },
  { state: "decided", hold: 2200 }
];
function AgentConsent({
  agent,
  action,
  target,
  targetIcon = "key-round",
  risk = "risky",
  reason,
  preview = [],
  scopes = ["once", "timed", "always"],
  duration = 60,
  decision: decisionIn,
  defaultDecision = null,
  onDecide,
  demo,
  labels,
  className = ""
}) {
  const L = { ...agentConsentLabelsMn, ...labels };
  const avail = risk === "destructive" ? scopes.filter((s) => s !== "always") : scopes;
  const [scopeOwn, setScope] = React.useState(avail[0] ?? "once");
  const [own, setOwn] = React.useState(defaultDecision);
  const [touched, setTouched] = React.useState(false);
  const sc = useScenario(demo ? STORY : [{ state: "request", hold: 1e3 }], { rest: 2600 });
  const playing = !!demo && !touched;
  const stage = playing ? sc.state : "request";
  const durationLabel = duration % 60 === 0 ? `${duration / 60} цаг` : `${duration} мин`;
  const scope = playing && stage !== "request" ? avail.includes(demo.scope) ? demo.scope : avail[0] : scopeOwn;
  const decision = playing ? stage === "decided" ? { allow: demo.allow, scope } : null : decisionIn !== void 0 ? decisionIn : own;
  const decide = (d) => {
    setTouched(true);
    if (decisionIn === void 0) setOwn(d);
    onDecide?.(d);
  };
  const scopeName = (s) => s === "timed" ? durationLabel : L.scopes[s];
  const began = React.useRef({});
  if (!began.current[stage]) began.current[stage] = Date.now();
  const reading = playing && stage === "request";
  const trail = [
    { id: "start", title: L.trail.started, state: "done", duration: 4e3 },
    {
      id: "scope",
      title: L.trail.scoped,
      state: reading ? "running" : "done",
      status: L.trail.reading,
      startedAt: reading ? began.current.request : void 0,
      duration: 1400,
      substeps: preview.map((p, i) => ({
        id: `${p.label}-${i}`,
        title: p.label,
        tag: L.scopes[scope],
        tagTone: risk === "destructive" ? 4 : risk === "risky" ? 1 : 3,
        detail: p.meta
      }))
    },
    {
      id: "decide",
      title: L.trail.decide,
      state: decision ? "done" : stage === "waiting" || !playing ? "waiting" : "pending",
      gate: true
    }
  ];
  return /* @__PURE__ */ jsxs("section", { ref: sc.ref, className: `ts-loop-region ts-consent ${className}`, ...sc.attrs, "data-controls": "hover", "data-stage": stage, "aria-label": L.title, children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    /* @__PURE__ */ jsx(MotionStyles, {}),
    /* @__PURE__ */ jsx("style", { href: "ts-agent-consent", precedence: "default", children: CSS$1 }),
    decision ? /* @__PURE__ */ jsxs("div", { className: `ts-consent-folded ts-enter ${decision.allow ? "is-ok" : "is-no"}`, children: [
      /* @__PURE__ */ jsx(IconTile, { icon: decision.allow ? "check" : "x", tone: decision.allow ? "done" : "error", size: "M" }),
      /* @__PURE__ */ jsxs("span", { className: "ts-consent-ftext", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("strong", { children: decision.allow ? L.allowed : L.denied }),
          /* @__PURE__ */ jsxs("span", { className: "ts-consent-muted", children: [
            " · ",
            action
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "ts-consent-muted ts-consent-small", children: [
          agent.name,
          decision.allow ? ` · ${scopeName(decision.scope)}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", icon: "pencil", onClick: () => decide(null), children: L.change })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "ts-consent-card", children: [
      /* @__PURE__ */ jsxs("header", { className: "ts-consent-head", children: [
        /* @__PURE__ */ jsx(IconTile, { icon: agent.icon ?? "bot", tone: "electric", size: "M" }),
        /* @__PURE__ */ jsxs("span", { className: "ts-consent-who", children: [
          /* @__PURE__ */ jsx("b", { children: agent.name }),
          /* @__PURE__ */ jsxs("span", { className: "ts-consent-muted", children: [
            action,
            " · ",
            /* @__PURE__ */ jsx(Icon, { name: targetIcon, size: 13 }),
            " ",
            target
          ] })
        ] }),
        /* @__PURE__ */ jsx(Badge, { tone: RISK_TONE[risk], children: L.risk[risk] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ts-consent-trail", children: /* @__PURE__ */ jsx(AgentTrail, { title: L.trail.title, steps: trail, expanded: reading || !playing ? ["scope"] : [] }) }),
      reason && /* @__PURE__ */ jsxs("p", { className: "ts-consent-reason", children: [
        /* @__PURE__ */ jsx(Icon, { name: "circle-help", size: 14 }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsxs("b", { children: [
            L.reason,
            ":"
          ] }),
          " ",
          reason
        ] })
      ] }),
      preview.length > 0 && /* @__PURE__ */ jsxs("div", { className: "ts-consent-preview", children: [
        /* @__PURE__ */ jsxs("span", { className: "ts-consent-h", children: [
          /* @__PURE__ */ jsx(Icon, { name: "search", size: 13 }),
          L.preview
        ] }),
        /* @__PURE__ */ jsx("ul", { children: preview.map((p, i) => /* @__PURE__ */ jsxs("li", { style: { "--i": i }, children: [
          /* @__PURE__ */ jsx(Icon, { name: p.icon ?? "file-text", size: 14 }),
          /* @__PURE__ */ jsx("span", { children: p.label }),
          p.meta && /* @__PURE__ */ jsx("small", { children: p.meta })
        ] }, `${p.label}-${i}`)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ts-consent-scope", "data-on": stage !== "request" || void 0, children: /* @__PURE__ */ jsx(
        Tabs,
        {
          variant: "segmented",
          size: "sm",
          label: L.scopeLabel,
          value: scope,
          onChange: (v) => (setTouched(true), setScope(v)),
          items: avail.map((s) => ({ value: s, label: scopeName(s), icon: s === "once" ? "circle-dot" : s === "timed" ? "clock" : "shield-check" }))
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "ts-consent-actions", children: [
        stage === "waiting" && /* @__PURE__ */ jsxs("span", { className: "ts-consent-wait", role: "status", children: [
          /* @__PURE__ */ jsx("span", { className: "ts-loop ts-loop-breathe", children: /* @__PURE__ */ jsx(Icon, { name: "hourglass", size: 14 }) }),
          L.waiting
        ] }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", icon: "x", onClick: () => decide({ allow: false, scope: "once" }), children: L.deny }),
        /* @__PURE__ */ jsx(Button, { size: "sm", icon: "check", className: stage === "waiting" ? "ts-consent-pulse" : void 0, onClick: () => decide({ allow: true, scope }), children: L.allow(scope, durationLabel) })
      ] })
    ] }),
    demo && sc.loopState !== "reduced" && /* @__PURE__ */ jsx(
      MotionControls,
      {
        onReplay: () => (setTouched(false), setOwn(null), sc.replay()),
        paused: sc.paused,
        onTogglePause: sc.togglePaused
      }
    )
  ] });
}
const CSS$1 = `
.ts-consent-trail .atr{max-width:none;padding:0;border:0;box-shadow:none;background:none;--atr-bg:transparent;--atr-fg:var(--ts-fg,#080808);--atr-muted:var(--ts-muted,#5e5a52);--atr-faint:var(--ts-muted,#5e5a52);--atr-line:var(--ts-line,#d8d3c6);--atr-accent:var(--ts-accent-fg,#1b5cff);font-family:inherit;font-size:13.5px}
.ts-consent-trail .atr-title{font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-consent-trail .atr-step{animation:ts-consent-row .42s var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both}
.ts-consent-trail .atr-step:nth-child(2){animation-delay:.12s}.ts-consent-trail .atr-step:nth-child(3){animation-delay:.24s}
.ts-consent-trail .atr-pending .atr-name{opacity:.55}
.ts-consent-preview li{animation:ts-consent-row .42s var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both;animation-delay:calc(var(--i,0) * 120ms + .3s)}
@keyframes ts-consent-row{from{opacity:0;transform:translateY(4px)}}
@media (prefers-reduced-motion:reduce){.ts-consent-trail .atr-step,.ts-consent-preview li{animation:none}}
.ts-consent{max-width:520px;font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg,#080808)}
.ts-consent-card,.ts-consent-folded{border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee);box-shadow:var(--ts-elevation,none)}
.ts-consent-card{display:grid;gap:var(--ts-space-4,16px);padding:var(--ts-space-4,16px)}
.ts-consent[data-stage=request] .ts-consent-card{animation:ts-enter var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out) both}
.ts-consent-head{display:flex;align-items:center;gap:12px;min-width:0}
.ts-consent-who{display:grid;gap:2px;min-width:0;flex:1}
.ts-consent-who b{font-size:14px}
.ts-consent-who .ts-consent-muted{display:inline-flex;align-items:center;gap:4px;flex-wrap:wrap}
.ts-consent-muted{color:var(--ts-muted,#5e5a52);font-size:13px}
.ts-consent-small{font-size:12px}
.ts-consent-reason{display:flex;gap:8px;margin:0;font-size:13.5px;line-height:1.5;color:var(--ts-muted,#5e5a52)}
.ts-consent-reason .cv-icon{flex:none;margin-top:3px}
.ts-consent-reason b{color:var(--ts-fg,#080808);font-weight:600}
.ts-consent-preview{display:grid;gap:6px;padding:12px;border-radius:var(--ts-radius-control,8px);background:var(--ts-soft,#efebe1)}
.ts-consent-h{display:inline-flex;align-items:center;gap:6px;font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-consent-preview ul{display:grid;gap:4px;margin:0;padding:0;list-style:none}
.ts-consent-preview li{display:flex;align-items:center;gap:8px;font-size:13px}
.ts-consent-preview small{margin-left:auto;font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-muted,#5e5a52)}
.ts-consent-scope{transition:opacity var(--ts-motion-dur-sm,200ms)}
.ts-consent-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px}
.ts-consent-wait{display:inline-flex;align-items:center;gap:6px;margin-right:auto;font-size:12.5px;color:var(--ts-status-needs-you-fg,#a33e0b)}
.ts-consent-pulse{box-shadow:0 0 0 0 color-mix(in srgb,var(--ts-accent-strong,#1b5cff) 45%,transparent);animation:ts-consent-pulse 1.6s var(--ts-motion-ease-loop,ease-in-out) infinite}
@keyframes ts-consent-pulse{70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}
.ts-consent-folded{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 14px}
.ts-consent-ftext{display:grid;gap:2px;flex:1;min-width:0;font-size:14px}
@media (max-width:480px){.ts-consent-actions{justify-content:stretch}.ts-consent-actions .ts-btn{flex:1}.ts-consent-wait{flex-basis:100%}}
@media (prefers-reduced-motion:reduce){.ts-consent-pulse,.ts-consent[data-stage=request] .ts-consent-card{animation:none}}
`;
export {
  AgentConsent,
  Badge,
  Button,
  COMPANY_VIEWS,
  Card,
  CollectionPanel,
  CollectionView,
  CompanyMini,
  CompanyView,
  DURATIONS,
  Dashboard,
  DecisionInboxChat,
  EASINGS,
  Empty,
  FIELD_ICON,
  Footer,
  GAPS,
  Icon,
  IconTile,
  LEVELS,
  LOOP,
  LOOPS,
  LOOP_NOTES,
  LoopRegion,
  MEGA_CLOSE_DELAY,
  METHODOLOGIES,
  MethodologyView,
  MotionContext,
  MotionControls,
  MotionProvider,
  MotionStyles,
  NavBar,
  PM_AREAS,
  PM_PHASES,
  PRIMITIVES_CSS,
  PRIORITY,
  PersonProfile,
  Pill,
  PrDeployStatus,
  PrimitiveStyles,
  PriorityBadge,
  ProgressNM,
  ProjectReport,
  ProjectReportFor,
  RaciView,
  RelDate,
  RelationChip,
  Replay,
  SPACE,
  SPRINGS,
  STATUS,
  STATUSES,
  STATUS_ICON,
  STATUS_ORDER,
  ScenarioChat,
  ScenarioRegion,
  SessionBoard,
  SplitCTA,
  Stack,
  StatusPill,
  TYPE_ICON,
  TYPE_LABEL,
  TYPE_TONE,
  Tabs,
  Text,
  TypeBadge,
  UNCONTROLLED_MAX_MS,
  UNIT_ICON,
  Wordmark,
  actorOf,
  agentConsentLabelsMn,
  animateSpring,
  companyLabelsMn,
  companyMiniLabelsMn,
  dampingRatio,
  dependenciesOf,
  dependencyText,
  dueBucket,
  fieldIcon,
  gapVar,
  inferKind,
  isHeld,
  kindsOf,
  linkLabel,
  loopAnimation,
  methodologyName,
  methodologyShort,
  modelLines,
  motionControlLabelsMn,
  motionCss,
  motionTokensCss,
  motionVar,
  navBarLabelsMn,
  prefersReducedMotion,
  priorityOf,
  raciOf,
  rangeText,
  relatedTo,
  relativeDay,
  resolveFields,
  rootsOf,
  scenarioChatLabelsMn,
  scopeCompany,
  spring,
  springAt,
  springDuration,
  springEasing,
  springKeyframes,
  statusGroup,
  subtreeIds,
  taskIndex,
  taskRaciOf,
  toPhaseState,
  toPmArea,
  toPmPhase,
  toSessionState,
  typeIcon,
  typeLabel,
  useInViewLoop,
  useLoop,
  useMotion,
  usePrefersReducedMotion,
  useScenario,
  withReplay
};
//# sourceMappingURL=index.js.map
