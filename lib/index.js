import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { DecisionInboxChat } from "./chunks/decision-inbox-chat-CWyKOuE6.js";
import { SessionBoard, toSessionState } from "./chunks/session-board-DU-qWWHe.js";
import { toPhaseState, ProjectReport } from "./chunks/project-report-CQJedPCy.js";
import { createPortal } from "react-dom";
import { PrDeployStatus } from "./chunks/pr-deploy-status-ImdJ0vvy.js";
const PM_PHASES = ["initiating", "planning", "executing", "monitoring", "closing"];
const PM_AREAS = ["integration", "scope", "schedule", "cost", "quality", "resource", "communications", "risk", "procurement", "stakeholder"];
const METHODOLOGIES = ["bmc", "pmbok", "okr", "lean-canvas"];
const LEVELS = ["institution", "company", "team"];
const kindsOf = {
  institution: ["institution"],
  company: ["company"],
  team: ["team", "department"]
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
  return { id: id ?? "", name: id ?? "—", role: "", kind: "unknown" };
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
function Lines({ f, empty = "—" }) {
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
const SHAPES = {
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
  ellipsis: ["c:12,12,1", "c:19,12,1", "c:5,12,1"]
};
function shape(s, i) {
  const [kind, rest] = s.length > 2 && s[1] === ":" ? [s[0], s.slice(2)] : ["d", s];
  if (kind === "c") {
    const [cx, cy, r] = rest.split(",");
    return /* @__PURE__ */ jsx("circle", { cx, cy, r }, i);
  }
  if (kind === "r") {
    const [x, y, w, h, rx] = rest.split(",");
    return /* @__PURE__ */ jsx("rect", { x, y, width: w, height: h, rx }, i);
  }
  if (kind === "e") {
    const [cx, cy, rx, ry] = rest.split(",");
    return /* @__PURE__ */ jsx("ellipse", { cx, cy, rx, ry }, i);
  }
  if (kind === "p") return /* @__PURE__ */ jsx("polygon", { points: rest }, i);
  return /* @__PURE__ */ jsx("path", { d: rest }, i);
}
function Icon({ name, size = 16, className = "", label }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
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
      children: SHAPES[name].map(shape)
    }
  );
}
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
  task: "Task",
  "session-decision": "Шийдвэр",
  decision: "Шийдвэр",
  atomic: "Атом",
  person: "Хүн",
  area: "Area",
  skill: "Skill",
  event: "Үйл явдал",
  daily: "Өдрийн тэмдэглэл",
  note: "Нот",
  reference: "Лавлагаа",
  resource: "Лавлагаа",
  agent: "Агент",
  "ai-worker": "AI ажилтан",
  workflow: "Workflow",
  meeting: "Уулзалт",
  milestone: "Чухал үе",
  ask: "Асуулт",
  risk: "Эрсдэл",
  glossary: "Нэр томьёо",
  product: "Бүтээгдэхүүн",
  release: "Хувилбар",
  commit: "Commit",
  output: "Гаралт",
  company: "Компани",
  inbox: "Inbox"
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
  area: "layout-grid"
};
const STATUS_ORDER = ["inbox", "planning", "active", "waiting", "someday", "done", "canceled", "archived"];
const STATUS = {
  inbox: { label: "Inbox", icon: "inbox", tone: "gray" },
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
  timeline: { label: "Timeline", icon: "gantt-chart" },
  list: { label: "Жагсаалт", icon: "list" }
};
const VIEWS = ["table", "board", "calendar", "timeline", "list"];
const FIELD_LABEL = {
  status: "Төлөв",
  priority: "Priority",
  area: "Area",
  subArea: "Дэд area",
  project: "Төсөл",
  owner: "Эзэн",
  due: "Хугацаа",
  date: "Огноо",
  start: "Эхлэх",
  end: "Дуусах",
  role: "Үүрэг",
  unit: "Нэгж",
  company: "Компани",
  tasks: "Task",
  tags: "Шошго",
  updated: "Шинэчилсэн",
  created: "Үүсгэсэн",
  confidence: "Итгэл"
};
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
  return /* @__PURE__ */ jsxs("span", { className: `cl-pill is-${s.tone}`, title: String(value), children: [
    /* @__PURE__ */ jsx(Icon, { name: s.icon, size: 14 }),
    s.label
  ] });
}
function PriorityBadge({ value }) {
  const p = priorityOf(value);
  if (!p) return null;
  const m = PRIORITY[p];
  return /* @__PURE__ */ jsxs("span", { className: `cl-prio is-${m.tone}`, title: `Priority: ${m.label}`, children: [
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
  return /* @__PURE__ */ jsxs("span", { className: `cl-nm${pct >= 1 ? " is-full" : ""}`, title: `${done}/${total} task дууссан`, children: [
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
        return v == null || v === "" ? null : /* @__PURE__ */ jsx("span", { className: `cl-tag is-cat-${catOf(String(v))}`, children: String(v) });
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
    return key;
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
      shown.map((f) => /* @__PURE__ */ jsx("td", { children: cell(i, f) }, f.name))
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
        moreTabs ? "Цөөн" : `${groupsPresent.length - 4} more`
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
            filterValues.map((v) => /* @__PURE__ */ jsx("option", { value: v, children: linkLabel(v) }, v))
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
        more ? "Цөөн харуулах" : `${filled.length - 8} more`
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
        /* @__PURE__ */ jsx("h4", { children: "Frontmatter" }),
        /* @__PURE__ */ jsxs("pre", { className: "cl-fm", "aria-label": "Frontmatter", children: [
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
        "Vault-д нээх"
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
.cl{display:flex;flex-direction:column;gap:10px;min-width:0}
.cl-tabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid var(--cv-line)}
.cl-tabs::-webkit-scrollbar{display:none}
.cl-tabs button{position:relative;flex:none;display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 10px;border:0;background:none;color:var(--cv-muted);font-size:13px;font-weight:500;white-space:nowrap}
.cl-tabs button:hover{color:var(--cv-fg)}
.cl-tabs button[aria-selected=true]{color:var(--cv-fg)}
.cl-tabs button[aria-selected=true]::after{content:"";position:absolute;left:8px;right:8px;bottom:-1px;height:2px;border-radius:1px;background:var(--cv-fg)}
.cl-count{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--cv-soft);color:var(--cv-muted);font-size:11.5px;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
.cl-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.cl-seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:var(--cv-soft)}
.cl-seg button{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:0;border-radius:6px;background:none;color:var(--cv-muted);font-size:12.5px;font-weight:500;white-space:nowrap}
.cl-seg button[data-active]{background:var(--cv-seg-on);color:var(--cv-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
.cl-presets{display:inline-flex;flex-wrap:wrap;gap:4px}
.cl-presets button{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 9px;border:1px solid var(--cv-line);border-radius:14px;background:var(--cv-bg);color:var(--cv-muted);font-size:12.5px}
.cl-presets button[aria-pressed=true]{border-color:var(--cv-fg);color:var(--cv-fg)}
.cl-tools{display:inline-flex;flex-wrap:wrap;gap:6px;margin-left:auto}
.cl-select{display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 4px 0 8px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);color:var(--cv-muted)}
.cl-select select{height:28px;max-width:150px;border:0;background:none;color:var(--cv-fg);font:inherit;font-size:12.5px}
.cl-body{animation:cv-fade .2s ease both}
.cl-pill{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 7px 0 5px;border-radius:11px;font-size:12px;font-weight:500;white-space:nowrap}
.cl-pill.is-gray{background:var(--cv-soft);color:var(--cv-muted)}
.cl-pill.is-yellow{background:var(--cv-yellow-soft);color:color-mix(in srgb,var(--cv-yellow) 80%,var(--cv-fg))}
.cl-pill.is-blue{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 72%,var(--cv-fg))}
.cl-pill.is-green{background:var(--cv-green-soft);color:color-mix(in srgb,var(--cv-green) 78%,var(--cv-fg))}
.cl-pill.is-red{background:var(--cv-red-soft);color:color-mix(in srgb,var(--cv-red) 82%,var(--cv-fg))}
.cl-prio{display:inline-flex;align-items:center;gap:3px;height:22px;padding:0 7px 0 5px;border-radius:6px;font-size:12px;font-weight:500;white-space:nowrap}
.cl-prio.is-red{background:var(--ts-prio-high-bg,var(--cv-red-soft));color:var(--ts-prio-high,color-mix(in srgb,var(--cv-red) 82%,var(--cv-fg)))}
.cl-prio.is-yellow{background:var(--ts-prio-medium-bg,var(--cv-yellow-soft));color:var(--ts-prio-medium,color-mix(in srgb,var(--cv-yellow) 80%,var(--cv-fg)))}
.cl-prio.is-gray{background:var(--ts-prio-low-bg,var(--cv-soft));color:var(--ts-prio-low,var(--cv-muted))}
.cl-tag.is-cat-1{background:var(--ts-cat-1-bg,var(--cv-accent-soft));color:var(--ts-cat-1,color-mix(in srgb,var(--cv-accent) 72%,var(--cv-fg)))}
.cl-tag.is-cat-2{background:var(--ts-cat-2-bg,var(--cv-green-soft));color:var(--ts-cat-2,color-mix(in srgb,var(--cv-green) 75%,var(--cv-fg)))}
.cl-tag.is-cat-3{background:var(--ts-cat-3-bg,var(--cv-amber-soft));color:var(--ts-cat-3,color-mix(in srgb,var(--cv-amber) 80%,var(--cv-fg)))}
.cl-tag.is-cat-4{background:var(--ts-cat-4-bg,var(--cv-violet-soft));color:var(--ts-cat-4,color-mix(in srgb,var(--cv-violet) 80%,var(--cv-fg)))}
.cl-fm{margin:0;padding:12px 14px;border-radius:10px;background:var(--ts-ink,#262522);color:var(--ts-ink-muted,#a3a099);font:12px/1.65 var(--ts-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);white-space:pre-wrap;word-break:break-word}
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
.cl-tbadge.is-blue{background:#3b82f6}.cl-tbadge.is-green{background:#22a35a}.cl-tbadge.is-red{background:#e5484d}
.cl-tbadge.is-violet{background:#8b5cf6}.cl-tbadge.is-teal{background:#14a3a3}.cl-tbadge.is-amber{background:#e08a1e}
.cl-tbadge.is-yellow{background:#d4a017}.cl-tbadge.is-gray{background:#71717a}
.cl-table-wrap{overflow-x:auto;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cl-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}
.cl-table th,.cl-table td{padding:8px 10px;border-bottom:1px solid var(--cv-line);text-align:left;vertical-align:middle;white-space:nowrap}
.cl-table tbody tr:last-child>*{border-bottom:0}
.cl-table thead th{font-size:12px;font-weight:500;color:var(--cv-muted)}
.cl-table th[scope=row]{position:sticky;left:0;z-index:1;max-width:280px;background:var(--cv-bg);font-weight:400;border-right:1px solid var(--cv-line)}
.cl-table tbody tr{animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 25ms)}
.cl-table tbody tr:hover>*{background:color-mix(in srgb,var(--cv-soft) 60%,var(--cv-bg))}
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
.cl-cal-cell.is-today .cl-cal-n{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--cv-red);color:#fff}
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
  if (blocks.length) parts.push(`→ ${blocks.length} task хүлээж байна`);
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
  tasks: "Нээлттэй task",
  decisions: "Шийдвэр",
  pages: "Хуудас",
  prs: "PR",
  ungrouped: "Дэд area-гүй",
  sessions: "мөр",
  session: "мөр",
  empty: "Тохирох мөр алга",
  running: "Явж байна",
  waiting: "Хүлээж байна",
  done: "Дууссан",
  idle: "Эхлээгүй",
  view: "Харагдац",
  groupsView: "Дэд area",
  statusView: "Төлвөөр",
  cardsView: "Карт",
  subItem: "task",
  subItems: "task",
  collapseKids: "Task нуух",
  expandKids: "Task харуулах",
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
        { label: "Task", value: p.tasks.length },
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
        phases: "Task",
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
    { k: "Нээлттэй task", v: allTasks.filter(({ t }) => !isDone(t.status)).length },
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
      /* @__PURE__ */ jsx("dd", { children: s.v })
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
            line: [`${done}/${p.tasks.length} task`, p.due ? `хугацаа ${p.due}` : ""].filter(Boolean).join(" · ")
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
        return /* @__PURE__ */ jsxs("section", { className: "cv-area", "aria-label": area === NO_AREA ? "Area-гүй" : area, children: [
          /* @__PURE__ */ jsxs("h4", { className: "cv-area-h", children: [
            /* @__PURE__ */ jsx("span", { className: "cv-area-mark", "aria-hidden": "true" }),
            area === NO_AREA ? "Area-гүй" : area,
            /* @__PURE__ */ jsx("span", { className: "cv-count", children: projectRows.length })
          ] }),
          projectRows.length === 0 ? /* @__PURE__ */ jsx(Empty, { text: "Шүүлтэд тохирох зүйл алга.", icon: "filter" }) : /* @__PURE__ */ jsx(
            SessionBoard,
            {
              project: {
                name: area === NO_AREA ? "Area-гүй" : area,
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
.cv-people button[aria-pressed=true]{border-color:var(--cv-accent);background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 70%,var(--cv-fg));font-weight:500}
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
  bmc: "Business Model Canvas",
  "lean-canvas": "Lean Canvas",
  okr: "OKR",
  pmbok: "PMBOK"
};
const methodologyShort = { bmc: "BMC", "lean-canvas": "Lean", okr: "OKR", pmbok: "PMBOK" };
const BMC = [
  { key: "partners", area: "kp", title: "Гол түнш", hint: "Key Partners" },
  { key: "activities", area: "ka", title: "Гол үйл ажиллагаа", hint: "Key Activities" },
  { key: "resources", area: "kr", title: "Гол нөөц", hint: "Key Resources" },
  { key: "value", area: "vp", title: "Үнэ цэнийн санал", hint: "Value Propositions" },
  { key: "relationships", area: "cr", title: "Харилцагчтай харилцаа", hint: "Customer Relationships" },
  { key: "channels", area: "ch", title: "Суваг", hint: "Channels" },
  { key: "customers", area: "cs", title: "Үйлчлүүлэгчийн сегмент", hint: "Customer Segments" },
  { key: "costs", area: "co", title: "Зардлын бүтэц", hint: "Cost Structure" },
  { key: "revenue", area: "rv", title: "Орлогын урсгал", hint: "Revenue Streams" }
];
const LEAN = [
  { key: "problem", area: "kp", title: "Асуудал", hint: "Problem" },
  { key: "solution", area: "ka", title: "Шийдэл", hint: "Solution" },
  { key: "metrics", area: "kr", title: "Гол хэмжүүр", hint: "Key Metrics" },
  { key: "value", area: "vp", title: "Өвөрмөц санал", hint: "Unique Value Proposition" },
  { key: "advantage", area: "cr", title: "Өрсөлдөхүйц давуу тал", hint: "Unfair Advantage" },
  { key: "channels", area: "ch", title: "Суваг", hint: "Channels" },
  { key: "customers", area: "cs", title: "Үйлчлүүлэгчийн сегмент", hint: "Customer Segments" },
  { key: "costs", area: "co", title: "Зардлын бүтэц", hint: "Cost Structure" },
  { key: "revenue", area: "rv", title: "Орлогын урсгал", hint: "Revenue Streams" }
];
function Canvas({ c, blocks, label }) {
  return /* @__PURE__ */ jsx("div", { className: "cv-bmc", role: "group", "aria-label": label, children: blocks.map((b, i) => /* @__PURE__ */ jsxs("section", { className: `cv-bmc-cell is-${b.area}`, style: { gridArea: b.area, "--i": i }, "aria-label": b.title, children: [
    /* @__PURE__ */ jsxs("h4", { children: [
      b.title,
      /* @__PURE__ */ jsx("small", { children: b.hint })
    ] }),
    /* @__PURE__ */ jsx(Lines, { f: c.model[b.key], empty: "Бөглөөгүй" })
  ] }, b.key)) });
}
function BmcView({ c, scoped }) {
  const notes = scoped.notes ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "cv-method", children: [
    /* @__PURE__ */ jsx(Canvas, { c, blocks: BMC, label: "Business Model Canvas" }),
    /* @__PURE__ */ jsxs("div", { className: "cv-below", children: [
      /* @__PURE__ */ jsxs("section", { className: "cv-below-col", "aria-label": "Төсөл ба task", children: [
        /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Төсөл → task" }),
        scoped.projects.length ? /* @__PURE__ */ jsx("ul", { className: "cv-plist", children: scoped.projects.map((p) => {
          const done = p.tasks.filter((t) => toPhaseState(t.status) === "done").length;
          return /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsxs("span", { className: "cv-plist-top", children: [
              /* @__PURE__ */ jsx("i", { className: `cv-dot is-${toPhaseState(p.status)}`, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("strong", { children: p.name }),
              /* @__PURE__ */ jsxs("span", { className: "cv-plist-n", children: [
                done,
                "/",
                p.tasks.length
              ] })
            ] }),
            p.tasks.length > 0 && /* @__PURE__ */ jsx("ul", { className: "cv-tlist", children: p.tasks.map((t) => /* @__PURE__ */ jsx("li", { className: `is-${toPhaseState(t.status)}`, children: t.title }, t.id)) })
          ] }, p.id);
        }) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Төсөл алга." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "cv-below-col", "aria-label": "Нот", children: [
        /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Нот" }),
        notes.length ? /* @__PURE__ */ jsx("ul", { className: "cv-notes", children: notes.map((n) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: "cv-note-title", children: n.title }),
          /* @__PURE__ */ jsx("span", { className: "cv-note-meta", children: [n.projectId ? c.projects.find((p) => p.id === n.projectId)?.name : null, n.date].filter(Boolean).join(" · ") })
        ] }, n.id)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Нот алга." })
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
  initiating: "Initiating",
  planning: "Planning",
  executing: "Executing",
  monitoring: "Monitoring & Controlling",
  closing: "Closing"
};
const AREA_NAME = {
  integration: "Integration",
  scope: "Scope",
  schedule: "Schedule",
  cost: "Cost",
  quality: "Quality",
  resource: "Resource",
  communications: "Communications",
  risk: "Risk",
  procurement: "Procurement",
  stakeholder: "Stakeholder"
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
    { label: "Task", value: String(items.length) },
    { label: "Гүйцэтгэл", value: items.length ? `${Math.round(done / items.length * 100)}%` : "—" },
    { label: "Идэвхтэй бүлэг", value: live && live.n ? PHASE_NAME[live.ph] : "—" },
    { label: "Хугацаа", value: starts.length && ends.length ? `${fmt(Math.min(...starts))} → ${fmt(Math.max(...ends))}` : "—" },
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
    /* @__PURE__ */ jsxs("section", { className: "cv-facts", "aria-label": "Facts hub", children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Facts hub" }),
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
                    "task, ",
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
      items.length > 0 && items.every((x) => !x.phase || !x.area) && /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Task-уудад phase, knowledgeArea бүртгэгдээгүй." })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-label": "Gantt", children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Gantt" }),
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
      ] }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Эхлэх, дуусах огноотой task алга." })
    ] })
  ] });
}
function MethodologyView({ c, scoped, methodology, today = /* @__PURE__ */ new Date() }) {
  if (methodology === "pmbok") return /* @__PURE__ */ jsx(PmbokView, { c, scoped, today });
  if (methodology === "okr") return /* @__PURE__ */ jsx(OkrView, { c, scoped });
  if (methodology === "lean-canvas")
    return /* @__PURE__ */ jsx("div", { className: "cv-method", children: /* @__PURE__ */ jsx(Canvas, { c, blocks: LEAN, label: "Lean Canvas" }) });
  return /* @__PURE__ */ jsx(BmcView, { c, scoped });
}
const methodologyCss = `
.cv-method{display:flex;flex-direction:column;gap:18px}
.cv-bmc{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-areas:"kp ka vp cr cs" "kp kr vp ch cs" "co co co rv rv";gap:6px}
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
.cv-plist-n{font-size:12px;color:var(--cv-muted);font-variant-numeric:tabular-nums}
.cv-tlist{margin:4px 0 0 15px;padding:0 0 0 12px;border-left:1.5px solid var(--cv-line);list-style:none;font-size:13px;color:var(--cv-muted)}
.cv-tlist li{padding:2px 0}
.cv-tlist li.is-done{text-decoration:line-through;text-decoration-color:var(--cv-faint)}
.cv-tlist li.is-active{color:var(--cv-fg)}
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
          const label = [...roles.map((r) => LETTER[r]), ...viaTask.map((r) => `${LETTER[r]} (task-аар)`)].join(", ");
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
        " task-аар"
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
  const agents = [...owned.map((a) => ({ a, how: "эзэмшдэг" })), ...coworkers.map((a) => ({ a, how: "workflow-д хамт" }))];
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
        /* @__PURE__ */ jsx("h4", { children: "Хариуцсан task" }),
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
.cv-raci-l.is-task{opacity:.55;box-shadow:inset 0 0 0 1px currentColor;background:none}
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
  workflows: "Workflow",
  decisions: "Шийдвэр",
  institution: "Институц",
  company: "Компани",
  team: "Баг",
  department: "Хэлтэс",
  area: "Area",
  types: "Төрлүүд",
  customers: "Үйлчлүүлэгч",
  value: "Үнэ цэнэ",
  channels: "Суваг",
  revenue: "Орлогын урсгал",
  units: "Нэгж",
  people: "Хүн",
  agents_n: "Агент",
  workflows_n: "Workflow",
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
  ];
  return /* @__PURE__ */ jsxs("div", { className: "cv-model", children: [
    /* @__PURE__ */ jsx("dl", { className: "cv-stats", children: stats.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "cv-stat", style: { "--i": i }, children: [
      /* @__PURE__ */ jsx("dt", { children: s.k }),
      /* @__PURE__ */ jsx("dd", { children: s.v })
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
            L.workflows_n
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
  collection: collectionProp,
  onCollectionChange,
  onOpenInVault,
  onAskAgent,
  defaultLevel,
  defaultUnitId,
  defaultView = "method",
  onScopeChange,
  labels: labelsProp,
  className = ""
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
  const [view, setView] = React.useState(defaultView);
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
    /* @__PURE__ */ jsx(MethodologyView, { c: company, scoped, methodology, today }),
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
  if (layout === "brief") {
    return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `cv ${className}`, "data-template": "brief", "data-methodology": methodology, children: [
      /* @__PURE__ */ jsx("style", { children: css$1 }),
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
    /* @__PURE__ */ jsx("style", { children: css$1 }),
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
.cv{--cv-bg:var(--ts-surface,#fff);--cv-page:var(--ts-page,#f7f7f8);--cv-fg:var(--ts-fg,#18181b);--cv-muted:var(--ts-muted,#71717a);--cv-faint:var(--ts-faint,#a1a1aa);--cv-line:var(--ts-line,#ececef);--cv-soft:var(--ts-soft,#f4f4f5);--cv-accent:var(--ts-accent,#4f7cf0);--cv-accent-soft:var(--ts-accent-soft,#e8f1fe);--cv-green:var(--ts-green,#16a34a);--cv-green-soft:var(--ts-green-soft,#e9f8ee);--cv-amber:var(--ts-amber,#c2620a);--cv-amber-soft:var(--ts-amber-soft,#fff4e0);--cv-violet:var(--ts-violet,#7c3aed);--cv-violet-soft:var(--ts-violet-soft,#f1ebfd);--cv-teal:var(--ts-teal,#0f8a7e);--cv-teal-soft:var(--ts-teal-soft,#e2f6f3);--cv-yellow:var(--ts-yellow,#b58105);--cv-yellow-soft:var(--ts-yellow-soft,#fdf6dc);--cv-red:var(--ts-red,#dc2626);--cv-red-soft:var(--ts-red-soft,#fdecec);--cv-seg-on:var(--ts-seg-on,#fff);position:relative;width:100%;color:var(--cv-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);container:cv/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .cv{--cv-bg:var(--ts-surface,#1b1b1e);--cv-page:var(--ts-page,#141416);--cv-fg:var(--ts-fg,#ececef);--cv-muted:var(--ts-muted,#a1a1aa);--cv-faint:var(--ts-faint,#71717a);--cv-line:var(--ts-line,#2e2e33);--cv-soft:var(--ts-soft,#26262a);--cv-accent:var(--ts-accent,#7c9cff);--cv-accent-soft:var(--ts-accent-soft,#1b2a44);--cv-green:var(--ts-green,#4ade80);--cv-green-soft:var(--ts-green-soft,#16301f);--cv-amber:var(--ts-amber,#eba659);--cv-amber-soft:var(--ts-amber-soft,#3a2a12);--cv-violet:var(--ts-violet,#a78bfa);--cv-violet-soft:var(--ts-violet-soft,#2a2140);--cv-teal:var(--ts-teal,#5eead4);--cv-teal-soft:var(--ts-teal-soft,#123330);--cv-yellow:var(--ts-yellow,#e8c25a);--cv-yellow-soft:var(--ts-yellow-soft,#352c10);--cv-red:var(--ts-red,#f87171);--cv-red-soft:var(--ts-red-soft,#3a1d1f);--cv-seg-on:var(--ts-seg-on,#3a3a40);color-scheme:dark}
.cv *{box-sizing:border-box}
.cv-title,.cv-hero-title,.cv-section-h,.cv-sheet-id h3,.cl-peek-title,.cv-name{font-family:var(--ts-font-display,inherit)}
.cv-num,.cv-step-n,.cl-peek-path{font-family:var(--ts-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace)}:where(.cv) button{font:inherit;color:inherit;cursor:pointer}
.cv :focus-visible{outline:2px solid var(--cv-accent);outline-offset:1px}
.cv-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* shared bits */
.cv-seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:var(--cv-soft);max-width:100%;overflow-x:auto;scrollbar-width:none}
.cv-seg button{flex:none;height:28px;padding:0 10px;border:0;border-radius:6px;background:none;color:var(--cv-muted);font-size:13px;font-weight:500;white-space:nowrap;transition:color .1s,background .15s,box-shadow .15s}
.cv-seg button:hover:not(:disabled){color:var(--cv-fg)}
.cv-seg button[data-active]{background:var(--cv-seg-on);color:var(--cv-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
.cv-seg button:disabled{opacity:.4;cursor:not-allowed}
.cv-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:1px}
.cv-chips::-webkit-scrollbar{display:none}
.cv-chips button{flex:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px;border:1px solid var(--cv-line);border-radius:15px;background:var(--cv-bg);font-size:13px;white-space:nowrap;transition:background .15s,border-color .15s}
.cv-chips button:hover{background:var(--cv-soft)}
.cv-chips button[aria-pressed=true]{border-color:color-mix(in srgb,var(--cv-accent) 50%,var(--cv-line));background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 65%,var(--cv-fg));font-weight:500}
.cv-chips button span{color:var(--cv-muted);font-size:12px}
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
.cv-ava.is-agent{border-radius:28%;background:var(--cv-accent-soft);border-color:color-mix(in srgb,var(--cv-accent) 35%,var(--cv-line));color:var(--cv-accent)}
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
.cv-mem summary{cursor:pointer;color:var(--cv-accent);list-style:none}
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
.cv-side{display:flex;flex-direction:column;gap:12px;padding:14px 10px;border-right:1px solid var(--cv-line);background:var(--cv-bg)}
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
.cv-nav-item[aria-current=true]{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 60%,var(--cv-fg));font-weight:500}
.cv-nav-glyph{display:inline-flex;flex:none;color:var(--cv-faint)}
.cv-nav-item[data-in] .cv-nav-glyph,.cv-nav-item[aria-current=true] .cv-nav-glyph{color:currentColor}
.cv-nav-count{margin-left:auto;font-size:11.5px;color:var(--cv-faint);font-variant-numeric:tabular-nums}
.cv-types{margin-top:4px;padding-top:10px;border-top:1px solid var(--cv-line)}
.cv-types-h{display:flex;align-items:center;gap:6px;margin:0 0 4px;padding:0 8px;font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-title{display:flex;align-items:center;gap:8px}
.cv-title .cv-icon{color:var(--cv-muted)}
.cv-title-n{font-size:14px;font-weight:500;color:var(--cv-muted)}
.cv-tabs button .cv-icon{color:var(--cv-faint)}
.cv-tabs button[aria-selected=true] .cv-icon{color:var(--cv-fg)}
.cv-section-h .cv-icon{align-self:center;color:var(--cv-muted)}
.cv-kind .cv-icon{margin-right:3px}
.cv-kind.is-area{background:var(--cv-soft);color:var(--cv-muted)}
.cv-type-chips{margin-bottom:10px}
.cv-nav-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-side-chips{display:none}
.cv-ws.no-tree{grid-template-columns:minmax(0,1fr)}
.cv-head-scope{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:12px;min-width:0}
.cv-head-scope .cv-unit-chips{flex:1;min-width:0}
.cv-main{min-width:0;display:flex;flex-direction:column}
.cv-head{padding:16px 20px 0;background:var(--cv-bg);border-bottom:1px solid var(--cv-line)}
.cv-head-top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 10px;min-width:0}
.cv-crumbs{display:flex;align-items:center;gap:6px;min-width:0;overflow-x:auto;scrollbar-width:none;font-size:12.5px;color:var(--cv-faint)}
.cv-crumbs button{flex:none;padding:0;border:0;background:none;color:var(--cv-muted);font-size:12.5px;white-space:nowrap}
.cv-crumbs button:hover{color:var(--cv-fg)}
.cv-crumbs button[aria-current=page]{color:var(--cv-fg)}
.cv-title{margin:8px 0 0;font-size:22px;font-weight:600;letter-spacing:-.015em;line-height:1.2}
.cv-tabs{position:relative;display:flex;gap:2px;margin-top:14px;overflow-x:auto;scrollbar-width:none}
.cv-tabs::-webkit-scrollbar{display:none}
.cv-tabs button{position:relative;flex:none;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 10px;border:0;background:none;color:var(--cv-muted);font-size:13.5px;font-weight:500;white-space:nowrap}
.cv-tabs button span{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--cv-soft);font-size:11.5px;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
.cv-tabs button:hover{color:var(--cv-fg)}
.cv-tabs button[aria-selected=true]{color:var(--cv-fg)}
.cv-tabs button[aria-selected=true]::after{content:"";position:absolute;left:8px;right:8px;bottom:-1px;height:2px;border-radius:1px;background:var(--cv-accent);animation:cv-grow .25s ease both}
.cv-panel{padding:18px 20px 22px;animation:cv-fade .22s ease both}
/* brief template */
.cv-brief{display:flex;flex-direction:column;gap:22px}
.cv-hero{padding:22px;border-radius:16px;background:radial-gradient(120% 140% at 100% 0%,var(--cv-accent-soft),transparent 55%),var(--cv-bg);border:1px solid var(--cv-line);animation:cv-in .4s cubic-bezier(.2,.8,.3,1) both}
.cv-hero-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.cv-eyebrow{min-width:0;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--cv-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-hero-title{margin:12px 0 0;font-size:34px;font-weight:650;letter-spacing:-.025em;line-height:1.1}
.cv-hero-line{max-width:62ch;margin:12px 0 0;font-size:16px;line-height:1.5;color:color-mix(in srgb,var(--cv-fg) 82%,var(--cv-muted))}
.cv-hero-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:18px}
.cv-hero-bar .cv-unit-chips{flex:1;min-width:0}
.cv-section{animation:cv-in .4s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 70ms + 100ms)}
.cv-section-h{display:flex;align-items:baseline;gap:10px;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--cv-line);font-size:19px;font-weight:600;letter-spacing:-.01em}
.cv-num{font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--cv-accent)}
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
.cv-side{flex-direction:row;flex-wrap:wrap;align-items:center;gap:10px;border-right:0;border-bottom:1px solid var(--cv-line)}
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
const css$1 = baseCss + dashboardCss + raciCss + methodologyCss + collectionCss;
function CollectionPanel({ className = "", ...props }) {
  return /* @__PURE__ */ jsxs("div", { className: `cv cv-standalone ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css$1 }),
    /* @__PURE__ */ jsx(CollectionView, { ...props })
  ] });
}
function Replay({ children, label = "Дахин тоглуулах", onReplay, showButton = true, className = "", style }) {
  const [run, setRun] = React.useState(0);
  return /* @__PURE__ */ jsxs("div", { className: `ts-replay ${className}`, style, "data-run": run, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
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
const css = `
.ts-replay{position:relative;width:100%;min-width:0}
.ts-replay-body{min-width:0}
.ts-replay-btn{position:absolute;top:8px;right:8px;z-index:3;display:grid;place-items:center;width:30px;height:30px;padding:0;border:1px solid var(--ts-line,#e4e4e7);border-radius:8px;background:var(--ts-surface,#fff);color:var(--ts-muted,#71717a);box-shadow:0 1px 2px #0000000f;cursor:pointer;opacity:.82;transition:opacity .15s,color .15s,background .15s,transform .2s}
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
export {
  COMPANY_VIEWS,
  CollectionPanel,
  CollectionView,
  CompanyView,
  Dashboard,
  DecisionInboxChat,
  Empty,
  FIELD_ICON,
  Icon,
  LEVELS,
  METHODOLOGIES,
  MethodologyView,
  PM_AREAS,
  PM_PHASES,
  PRIORITY,
  PersonProfile,
  PrDeployStatus,
  PriorityBadge,
  ProgressNM,
  ProjectReport,
  ProjectReportFor,
  RaciView,
  RelDate,
  RelationChip,
  Replay,
  STATUS,
  STATUS_ORDER,
  SessionBoard,
  StatusPill,
  TYPE_ICON,
  TYPE_LABEL,
  TYPE_TONE,
  TypeBadge,
  UNIT_ICON,
  actorOf,
  companyLabelsMn,
  dependenciesOf,
  dependencyText,
  dueBucket,
  fieldIcon,
  inferKind,
  isHeld,
  kindsOf,
  linkLabel,
  methodologyName,
  methodologyShort,
  modelLines,
  priorityOf,
  raciOf,
  rangeText,
  relatedTo,
  relativeDay,
  resolveFields,
  rootsOf,
  scopeCompany,
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
  withReplay
};
//# sourceMappingURL=index.js.map
