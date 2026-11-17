import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { DecisionInboxChat } from "./chunks/decision-inbox-chat-D-7dji-J.js";
import { SessionBoard, toSessionState } from "./chunks/session-board-BBgSh5Vx.js";
import { toPhaseState, ProjectReport } from "./chunks/project-report-CB_GtFpd.js";
import { createPortal } from "react-dom";
import { f as findPerson, R as RoleDashboard } from "./chunks/role-dashboard-CShmXzYY.js";
import { r, a } from "./chunks/role-dashboard-CShmXzYY.js";
import { PrDeployStatus } from "./chunks/pr-deploy-status-Dn8kJKFa.js";
import { A as AgentTrail, R as RunningNow, D as DecisionCard, M as MemoryPanel } from "./chunks/memory-panel-Bw6VHcJR.js";
import { a as a2, U, m, u } from "./chunks/memory-panel-Bw6VHcJR.js";
import { r as regionState, s as syncAnimation, u as useScenario, M as MotionStyles, f as MotionControls, g as MotionProvider } from "./chunks/ask-window-BRnvqkTT.js";
import { A, L, h, i, j, S, U as U2, a as a3, b, c, d, e, l, m as m2, k, n, o, p, q } from "./chunks/ask-window-BRnvqkTT.js";
import { s as spring, A as AppShell, p as paraBaseMn } from "./chunks/app-shell-CHp_ZidI.js";
import { D, E, L as L2, P, S as S2, a as a4, b as b2, c as c2, d as d2, f, g, m as m3, h as h2, i as i2, j as j2, e as e2 } from "./chunks/app-shell-CHp_ZidI.js";
import { A as AgentPlan } from "./chunks/agent-plan-b0kdvPzG.js";
import { C as CitedAnswer } from "./chunks/cited-answer-C590RzNP.js";
import { B, a as a5, b as b3, S as S3, c as c3, d as d3, e as e3, s } from "./chunks/source-preview-BedfD0w3.js";
import { F, f as f2 } from "./chunks/finance-report-BU_vXJ-w.js";
import { C, c as c4 } from "./chunks/cash-river-C9XN9BMF.js";
import { C as C2, a as a6, b as b4, c as c5, d as d4, e as e4 } from "./chunks/ceo-daily-oZngq-Z_.js";
import { M, m as m4, a as a7, s as s2 } from "./chunks/method-quiz-DoleOjiN.js";
import { B as B2, S as S4, b as b5, a as a8, c as c6, s as s3, t } from "./chunks/build-wizard-DPQhzsOL.js";
import { C as C3, c as c7, a as a9, b as b6, d as d5, e as e5, f as f3, g as g2, p as p2, h as h3 } from "./chunks/converge-net-CaAlaYUR.js";
import { C as C4, c as c8 } from "./chunks/content-pipeline-Bq0QLG5Y.js";
const supportsLinear = () => typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("animation-timing-function", "linear(0, 1)");
function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function animateSpring(el, keyframes, name = "soft", options = {}) {
  const last = keyframes[keyframes.length - 1] ?? {};
  const target = el;
  const region = regionState(el);
  if (prefersReducedMotion() || region === "reduced" || typeof target.animate !== "function") {
    for (const [k2, v] of Object.entries(last)) if (k2 !== "offset" && v != null) target.style.setProperty(k2.replace(/[A-Z]/g, (c9) => `-${c9.toLowerCase()}`), String(v));
    return null;
  }
  const e6 = spring(name);
  const a10 = target.animate(keyframes, {
    duration: e6.duration,
    easing: supportsLinear() ? e6.easing : e6.fallback,
    delay: options.delay ?? 0,
    fill: options.fill ?? "both"
  });
  if (region && region !== "running") syncAnimation(a10, region);
  return a10;
}
const textOf = (el) => (el.textContent || "").replace(/\s+/g, " ").trim();
function find(root, t2) {
  const { sel: sel2, text, nth = 0 } = typeof t2 === "string" ? { sel: t2 } : t2;
  const all = [...root.querySelectorAll(sel2)].filter((e6) => !text || textOf(e6).includes(text));
  const outside = all.length || typeof document === "undefined" ? all : [...document.querySelectorAll(sel2)].filter((e6) => !text || textOf(e6).includes(text));
  return outside[nth] ?? null;
}
function setValue(el, value) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
const hoverEvents = (el, on) => ["pointerover", "pointerenter", "mouseover", "mouseenter", "pointermove"].forEach(
  (type) => el.dispatchEvent(new MouseEvent(type, { bubbles: type !== "pointerenter" && type !== "mouseenter" && type !== "pointerleave" && type !== "mouseleave" }))
);
function perform(root, step, typing) {
  if (step.hide) root.querySelectorAll(step.hide).forEach((el) => el.setAttribute("data-ts-hide", ""));
  if (step.show) {
    const hidden = [...root.querySelectorAll(step.show.sel)].filter((el) => el.hasAttribute("data-ts-hide"));
    hidden.slice(0, step.show.count ?? 1).forEach((el) => {
      el.setAttribute("data-ts-shown", "");
      el.removeAttribute("data-ts-hide");
    });
  }
  if (step.hover) {
    const el = find(root, step.hover);
    if (el) hoverEvents(el);
  }
  if (step.click) find(root, step.click)?.click();
  if (step.key) {
    const el = step.key.target ? find(root, step.key.target) : document.activeElement;
    el?.dispatchEvent(new KeyboardEvent("keydown", { key: step.key.key, bubbles: true }));
  }
  if (step.pick) {
    const el = find(root, step.pick.target);
    const value = el?.options[step.pick.index]?.value;
    if (el && value != null) {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set?.call(el, value);
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
  if (step.type) {
    const el = find(root, step.type.target);
    if (el) {
      el.focus({ preventScroll: true });
      const chars = [...step.type.text];
      const gap = Math.max(40, Math.min(110, step.wait * 0.7 / Math.max(1, chars.length)));
      chars.forEach((_, i3) => typing.current.push(window.setTimeout(() => setValue(el, chars.slice(0, i3 + 1).join("")), gap * (i3 + 1))));
    }
  }
}
function Autoplay({ script, children }) {
  const steps = React.useMemo(() => script.map((s4, i3) => ({ state: i3, hold: s4.wait })), [script]);
  const sc = useScenario(steps, { loops: 1, rest: 0 });
  const root = React.useRef(null);
  const done = React.useRef(-1);
  const typing = React.useRef([]);
  const ref = React.useCallback(
    (node) => {
      root.current = node;
      sc.ref(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sc.ref]
  );
  React.useEffect(() => {
    if (!sc.playing || !root.current || done.current >= sc.index) return;
    done.current = sc.index;
    perform(root.current, script[sc.index], typing);
  }, [sc.playing, sc.index, script]);
  React.useEffect(() => () => typing.current.forEach(clearTimeout), []);
  return /* @__PURE__ */ jsxs("div", { ref, className: "ts-autoplay", ...sc.attrs, style: { width: "100%", minWidth: 0 }, children: [
    /* @__PURE__ */ jsx("style", { children: css$4 }),
    children
  ] });
}
const css$4 = `
.ts-autoplay [data-ts-hide]{opacity:0;transform:translateY(8px);pointer-events:none}
.ts-autoplay [data-ts-hide],.ts-autoplay [data-ts-shown]{transition:opacity var(--ts-motion-dur-md,320ms) var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)),transform var(--ts-motion-spring-soft-duration,560ms) var(--ts-motion-spring-soft,cubic-bezier(.2,0,0,1))}
@media (prefers-reduced-motion:reduce){.ts-autoplay [data-ts-hide],.ts-autoplay [data-ts-shown]{transition:none}}
`;
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
    for (const u2 of units)
      if (u2.parentId && out.has(u2.parentId) && !out.has(u2.id)) {
        out.add(u2.id);
        grew = true;
      }
  }
  return out;
}
function scopeCompany(c9, rootId) {
  if (!rootId || !c9.units.some((u2) => u2.id === rootId)) return c9;
  const ids = subtreeIds(c9.units, rootId);
  return {
    ...c9,
    units: c9.units.filter((u2) => ids.has(u2.id)),
    people: c9.people.filter((p3) => ids.has(p3.unitId)),
    agents: c9.agents.filter((a10) => ids.has(a10.unitId)),
    workflows: c9.workflows.filter((w) => ids.has(w.unitId)),
    projects: c9.projects.filter((p3) => ids.has(p3.unitId)),
    okrs: c9.okrs?.filter((o2) => !o2.ownerId || [...c9.people, ...c9.agents].some((x) => x.id === o2.ownerId && ids.has(x.unitId))),
    notes: c9.notes?.filter((n2) => !n2.projectId || c9.projects.some((p3) => p3.id === n2.projectId && ids.has(p3.unitId)))
  };
}
function rootsOf(units) {
  const ids = new Set(units.map((u2) => u2.id));
  return units.filter((u2) => !u2.parentId || !ids.has(u2.parentId));
}
function actorOf(c9, id) {
  const p3 = c9.people.find((x) => x.id === id);
  if (p3) return { id: p3.id, name: p3.name, role: p3.role, kind: "person" };
  const a10 = c9.agents.find((x) => x.id === id);
  if (a10) return { id: a10.id, name: a10.name, role: a10.role, kind: "agent" };
  return { id: id ?? "", name: id ?? "Тодорхойгүй", role: "", kind: "unknown" };
}
function modelLines(f4) {
  if (f4 == null) return [];
  if (typeof f4 === "string") return f4.trim() ? [{ text: f4 }] : [];
  return f4.map(
    (x) => typeof x === "string" ? { text: x } : { text: x.stream, share: x.share }
  );
}
function raciOf(p3, id) {
  const r3 = p3.raci;
  if (!r3) return [];
  const out = [];
  if (r3.responsible?.includes(id)) out.push("R");
  if (r3.accountable === id) out.push("A");
  if (r3.consulted?.includes(id)) out.push("C");
  if (r3.informed?.includes(id)) out.push("I");
  return out;
}
function toPmPhase(v) {
  const k2 = (v ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (k2.startsWith("init")) return "initiating";
  if (k2.startsWith("plan")) return "planning";
  if (k2.startsWith("exec")) return "executing";
  if (k2.startsWith("monit") || k2.startsWith("control")) return "monitoring";
  if (k2.startsWith("clos")) return "closing";
  return null;
}
function toPmArea(v) {
  const k2 = (v ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (!k2) return null;
  if (k2.startsWith("communic")) return "communications";
  if (k2.startsWith("stakeholder")) return "stakeholder";
  return PM_AREAS.find((a10) => k2.startsWith(a10)) ?? null;
}
function taskIndex(c9) {
  const out = /* @__PURE__ */ new Map();
  const add = (ref) => {
    const ids = [ref.task.id];
    if (ref.project) ids.push(`${ref.project.id}-${ref.task.id}`, `${ref.project.id}:${ref.task.id}`);
    for (const id of ids) if (!out.has(id)) out.set(id, ref);
  };
  for (const p3 of c9.projects) for (const t2 of p3.tasks) add({ project: p3, task: t2 });
  for (const t2 of c9.tasks ?? []) add({ project: c9.projects.find((p3) => p3.id === t2.projectId), task: t2 });
  return out;
}
function dependenciesOf(c9, project, task, index = taskIndex(c9)) {
  const local = (id) => project ? project.tasks.find((t2) => t2.id === id) : void 0;
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
    const hit = deps.some((d6) => {
      const own = ref.project?.tasks.find((t2) => t2.id === d6);
      return own ? own === task : index.get(d6)?.task === task;
    });
    if (hit && !blocks.some((b7) => b7.task === ref.task)) blocks.push(ref);
  }
  return { waitsOn, blocks };
}
const initials = (name) => name.replace(/[^\p{L}\p{N}\s.]/gu, "").trim().split(/[\s.]+/).filter(Boolean).map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase() || "?";
const phaseTone = { done: "green", active: "blue", blocked: "amber", next: "gray" };
const phaseLabel = { done: "Дууссан", active: "Явж байна", blocked: "Хүлээгдэж байна", next: "Төлөвлөж буй" };
function Avatar({ actor, size = 22 }) {
  return /* @__PURE__ */ jsx("span", { className: `cv-ava is-${actor.kind}`, style: { "--s": `${size}px` }, "aria-hidden": "true", children: actor.kind === "agent" ? "✦" : initials(actor.name) });
}
function Lines({ f: f4, empty = "Бөглөөгүй" }) {
  const lines = modelLines(f4);
  if (!lines.length) return /* @__PURE__ */ jsx("p", { className: "cv-model-text cv-none", children: empty });
  if (lines.length === 1 && lines[0].share == null) return /* @__PURE__ */ jsx("p", { className: "cv-model-text", children: lines[0].text });
  return /* @__PURE__ */ jsx("ul", { className: "cv-model-list", children: lines.map((l2, i3) => /* @__PURE__ */ jsxs("li", { style: { "--i": i3 }, children: [
    /* @__PURE__ */ jsx("span", { children: l2.text }),
    l2.share != null && /* @__PURE__ */ jsxs("span", { className: "cv-share", children: [
      /* @__PURE__ */ jsx("span", { className: "cv-share-bar", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { style: { width: `${Math.round(Math.max(0, Math.min(1, l2.share)) * 100)}%` } }) }),
      /* @__PURE__ */ jsxs("span", { className: "cv-share-n", children: [
        Math.round(l2.share * 100),
        "%"
      ] })
    ] })
  ] }, l2.text + i3)) });
}
function CountUp({ value, ms = 900 }) {
  const target = typeof value === "number" ? value : /^\d+$/.test(value) ? Number(value) : null;
  const reduced2 = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = React.useState(target == null || reduced2 ? target : 0);
  const from = React.useRef(0);
  React.useEffect(() => {
    if (target == null || reduced2 || typeof requestAnimationFrame === "undefined") return setShown(target);
    const start = performance.now();
    const a10 = from.current;
    let raf = 0;
    const tick = (now) => {
      const p3 = Math.min(1, (now - start) / ms);
      const e6 = 1 - Math.pow(1 - p3, 3);
      const v = Math.round(a10 + (target - a10) * e6);
      setShown(v);
      from.current = v;
      if (p3 < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced2, ms]);
  if (target == null) return /* @__PURE__ */ jsx(Fragment, { children: value });
  return /* @__PURE__ */ jsx("span", { className: "cv-countup", "aria-label": String(target), children: /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: shown }) });
}
const BRAIN_L = "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z";
const BRAIN_R = "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z";
const THOUGHT_L = "M9.2 6.8C7 8 8.6 10.4 7 11.6S6.4 15.4 8.6 16.4";
const THOUGHT_R = "M14.8 6.8C17 8 15.4 10.4 17 11.6S17.6 15.4 15.4 16.4";
const LOOP_SHAPES = {
  brain: [
    BRAIN_L,
    BRAIN_R,
    "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",
    "M17.599 6.5a3 3 0 0 0 .399-1.375",
    "M6.003 5.125A3 3 0 0 0 6.401 6.5",
    "M3.477 10.896a4 4 0 0 1 .585-.396",
    "M19.938 10.5a4 4 0 0 1 .585.396",
    "M6 18a4 4 0 0 1-1.967-.516",
    "M19.967 17.484A4 4 0 0 1 18 18"
  ],
  "flask-conical": [
    "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
    "M6.453 15h11.094",
    "M8.5 2h7"
  ],
  "code-xml": ["m18 16 4-4-4-4", "m6 8-4 4 4 4", "m14.5 4-5 16"],
  file: ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4"],
  // Lucide megaphone (ISC), for «Маркетинг ба контент» (2026-11-17)
  megaphone: ["m3 11 18-5v12L3 14v-3z", "M11.6 16.8a3 3 0 1 1-5.8-1.6"]
};
const L3 = (dur, ...rules) => ({ dur, rules });
const draw = (dur, ...kids) => L3(dur, [kids, "draw"]);
const seq = (dur, kf, kids, step = 0.25) => L3(dur, ...kids.map((k2, i3) => [[k2], kf, i3 * step]));
const ICON_LOOP = {
  // what the menu shows first
  brain: { dur: 3.2, rules: [[[3], "pulse"]], overlay: [{ kind: "dot-run", path: THOUGHT_L }, { kind: "dot-run", path: THOUGHT_R }] },
  // a thought runs through both halves
  "file-text": seq(3.2, "draw", [3, 4, 5], 0.35),
  // lines write themselves
  file: L3(3, [["*"], "bob"]),
  megaphone: { dur: 2.8, rules: [[["*"], "swing", 0, "--ts-il-r:-6deg;transform-origin:20% 60%"]], overlay: [{ kind: "waves" }] },
  // the horn tilts and sound waves go out
  bot: L3(3.4, [[5, 6], "blink"], [[1], "pulse", 0.6]),
  // eyes blink, antenna glows
  "flask-conical": { dur: 2.8, rules: [[[2], "pulse"]], overlay: [{ kind: "bubbles" }] },
  // bubbles rise
  workflow: seq(3, "pulse", [1, 2, 3], 0.45),
  // nodes connect in turn
  check: draw(2.6, 1),
  "circle-check": draw(2.8, 2),
  "square-check": draw(2.8, 2),
  "shield-check": draw(3, 2),
  "user-check": draw(2.8, 3),
  "code-xml": L3(2.4, [[3], "cursor"], [[1], "nudge", 0.2], [[2], "nudge", 0.2, "--ts-il-x:-1px"]),
  // the slash blinks like a cursor
  search: L3(3.2, [["*"], "orbit"]),
  // the lens scans around
  "search-x": L3(3.2, [["*"], "orbit"], [[3, 4], "pulse"]),
  calendar: { dur: 3.6, rules: [], overlay: [{ kind: "day" }] },
  // the day moves on
  "calendar-days": seq(3.6, "pulse", [5, 6, 7, 8, 9, 10], 0.3),
  "calendar-x": L3(3, [[5, 6], "draw"]),
  // vault and work
  folder: L3(3, [["*"], "bob"]),
  "folder-filled": L3(3, [["*"], "bob"]),
  // <Icon name="folder" variant="filled" animate="loop">
  circle: L3(3, [["*"], "breathe"]),
  "git-branch": L3(3, [[4], "draw"], [[2, 3], "pulse", 0.4]),
  atom: L3(3.6, [[2, 3], "spin-slow"], [[1], "pulse"]),
  user: L3(3.2, [[2], "bob"]),
  users: L3(3.2, [[2], "bob"], [[4, 3], "bob", 0.4]),
  "users-round": L3(3.2, [[2], "bob"], [[3], "bob", 0.4]),
  "circle-user": L3(3.2, [[2, 3], "bob"]),
  "layout-grid": seq(3.2, "pulse", [1, 2, 3, 4], 0.4),
  "layout-template": seq(3, "pulse", [1, 2, 3], 0.4),
  "layout-dashboard": seq(3.2, "pulse", [1, 2, 3, 4], 0.4),
  sparkles: L3(2.8, [[1], "breathe"], [[2, 3, 4, 5], "pulse", 0.5]),
  sun: L3(3.6, [[2, 3, 4, 5, 6, 7, 8, 9], "pulse"], [[1], "breathe"]),
  pencil: L3(2.8, [["*"], "wave"]),
  // writes back and forth
  bookmark: L3(3, [["*"], "nudge-down"]),
  flag: L3(3, [[1], "swing"]),
  "circle-help": L3(3, [[3], "blink"], [[2], "pulse", 0.5]),
  "triangle-alert": L3(2.6, [[2, 3], "pulse"]),
  "book-open": L3(3.4, [[1], "swing", 0, "--ts-il-r:-4deg;transform-origin:right center"], [[2], "swing", 0.3, "--ts-il-r:4deg;transform-origin:left center"]),
  box: L3(3, [["*"], "hop"]),
  tag: L3(3, [["*"], "swing"]),
  "git-commit-horizontal": L3(2.8, [[1], "breathe"], [[2, 3], "draw", 0.3]),
  type: L3(3, [[3], "draw"], [[1], "pulse", 0.4]),
  asterisk: L3(3.6, [["*"], "spin-slow"]),
  "arrow-up-right": L3(2.4, [["*"], "nudge-up"]),
  hash: seq(3, "draw", [1, 2, 3, 4], 0.25),
  "chart-pie": L3(3, [[1], "hop"], [[2], "draw", 0.3]),
  "circle-dot": L3(2.8, [[2], "breathe"], [[1], "pulse", 0.6]),
  "panel-right": L3(3, [[2], "slide"]),
  "rotate-ccw": L3(3, [["*"], "turn", 0, "animation-direction:reverse"]),
  // a full turn, so the arrow never snaps back
  landmark: seq(3.2, "grow", [2, 3, 4, 5], 0.25),
  "building-2": seq(3.2, "pulse", [4, 5, 6, 7], 0.35),
  briefcase: L3(3, [["*"], "hop"]),
  network: L3(3.2, [[4, 5], "draw"], [[1, 2, 3], "pulse", 0.4]),
  "grid-3x3": seq(3.2, "draw", [2, 4, 3, 5], 0.3),
  database: seq(3, "pulse", [1, 3, 2], 0.4),
  inbox: L3(3, [[1], "nudge-down"]),
  play: L3(2.4, [["*"], "nudge"]),
  pause: seq(2.4, "pulse", [1, 2], 0.4),
  "arrow-right": L3(2.4, [["*"], "nudge"]),
  hourglass: L3(3.6, [["*"], "spin-slow"]),
  "message-circle": L3(3, [["*"], "bob"]),
  x: draw(2.8, 1, 2),
  archive: L3(3, [[1], "hop"], [[3], "pulse", 0.4]),
  table: seq(3, "draw", [3, 4, 1], 0.3),
  list: seq(3.2, "draw", [6, 4, 5], 0.35),
  kanban: seq(3, "grow", [1, 2, 3], 0.3),
  "gantt-chart": seq(3.2, "draw", [4, 2, 3], 0.35),
  "signal-high": seq(2.8, "pulse", [2, 3, 4], 0.25),
  "signal-medium": seq(2.8, "pulse", [2, 3], 0.25),
  "signal-low": seq(2.8, "pulse", [2], 0.25),
  filter: L3(3, [["*"], "nudge-down"]),
  layers: seq(3, "hop", [1, 2, 3], 0.3),
  link: L3(3, [[1], "nudge", 0, "--ts-il-x:1px"], [[2], "nudge", 0, "--ts-il-x:-1px"]),
  clock: L3(3.6, [[2], "spin", 0, "transform-box:view-box;transform-origin:12px 12px"]),
  "chevron-right": L3(2.4, [["*"], "nudge"]),
  "chevron-left": L3(2.4, [["*"], "nudge", 0, "--ts-il-x:-2px"]),
  "chevron-down": L3(2.4, [["*"], "nudge-down"]),
  menu: seq(3, "draw", [2, 1, 3], 0.25),
  "key-round": L3(3, [["*"], "swing"]),
  mail: L3(3, [[2], "nudge-down"], [[1], "bob", 0.3]),
  ellipsis: seq(2.4, "pulse", [3, 1, 2], 0.25)
};
const KEYFRAMES = `
@keyframes ts-il-draw{0%{stroke-dashoffset:1}40%,78%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}
@keyframes ts-il-blink{0%,42%,50%,100%{transform:scaleY(1)}46%{transform:scaleY(.1)}}
@keyframes ts-il-pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes ts-il-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}
@keyframes ts-il-hop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-1.5px)}}
@keyframes ts-il-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(var(--ts-il-x,2px))}}
@keyframes ts-il-nudge-up{0%,100%{transform:translate(0)}50%{transform:translate(1.5px,-1.5px)}}
@keyframes ts-il-nudge-down{0%,100%{transform:translateY(0)}50%{transform:translateY(1.5px)}}
@keyframes ts-il-spin{to{transform:rotate(360deg)}}
@keyframes ts-il-spin-slow{0%{transform:rotate(0)}40%,100%{transform:rotate(180deg)}}
@keyframes ts-il-turn{0%{transform:rotate(0)}45%,100%{transform:rotate(360deg)}}
@keyframes ts-il-swing{0%,100%{transform:rotate(0)}30%{transform:rotate(var(--ts-il-r,-8deg))}70%{transform:rotate(calc(var(--ts-il-r,-8deg) * -.7))}}
@keyframes ts-il-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes ts-il-grow{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.6)}}
@keyframes ts-il-slide{0%,100%{transform:translateX(0)}50%{transform:translateX(-2px)}}
@keyframes ts-il-wave{0%,100%{transform:translate(0) rotate(0)}50%{transform:translate(-1.5px,1px) rotate(-6deg)}}
@keyframes ts-il-orbit{0%,100%{transform:translate(0,0)}25%{transform:translate(1.2px,-.8px)}50%{transform:translate(0,-1.6px)}75%{transform:translate(-1.2px,-.8px)}}
@keyframes ts-il-cursor{0%,49%{opacity:1}50%,100%{opacity:.15}}
@keyframes ts-il-run{0%{offset-distance:0%;opacity:0}10%,85%{opacity:1}100%{offset-distance:100%;opacity:0}}
@keyframes ts-il-rise{0%{transform:translateY(0);opacity:0}25%{opacity:1}100%{transform:translateY(-6px);opacity:0}}
@keyframes ts-il-wave-out{0%{opacity:0;transform:translateX(-1px) scale(.8)}30%{opacity:1}100%{opacity:0;transform:translateX(2px) scale(1.15)}}
@keyframes ts-il-day{0%,22%{transform:translate(0,0)}25%,47%{transform:translate(4.5px,0)}50%,72%{transform:translate(9px,0)}75%,97%{transform:translate(0,4.5px)}100%{transform:translate(0,0)}}
`;
const sel = (name, c9) => c9 === "*" ? `.cv-icon[data-loop="${name}"]` : typeof c9 === "number" ? `.cv-icon[data-loop="${name}"]>:nth-child(${c9})` : `.cv-icon[data-loop="${name}"]>.ts-il-${c9}`;
function iconLoopCss() {
  let css2 = KEYFRAMES;
  css2 += `.cv-icon[data-loop],.cv-icon[data-loop]>*{transform-box:fill-box;transform-origin:center}
`;
  for (const [name, loop] of Object.entries(ICON_LOOP)) {
    for (const [kids, kf, delay = 0, extra = ""] of loop.rules) {
      const dash = kf === "draw" ? "stroke-dasharray:1;" : "";
      const timing = kf === "spin" || kf === "run" ? "linear" : "ease-in-out";
      css2 += `${kids.map((k2) => sel(name, k2)).join(",")}{${dash}animation:ts-il-${kf} ${loop.dur}s ${timing} calc(var(--ts-il-phase,0s) + ${delay}s) infinite;${extra}}
`;
    }
    (loop.overlay ?? []).forEach((o2, i3) => {
      const s4 = sel(name, `o${i3 + 1}`);
      if (o2.kind === "dot-run") css2 += `${s4}{offset-path:path("${o2.path}");offset-rotate:0deg;animation:ts-il-run ${loop.dur}s linear calc(var(--ts-il-phase,0s) + ${i3 * (loop.dur / 2)}s) infinite}
`;
      if (o2.kind === "bubbles") css2 += `${s4} circle{animation:ts-il-rise ${loop.dur}s ease-out calc(var(--ts-il-phase,0s)) infinite}${s4} circle+circle{animation-delay:calc(var(--ts-il-phase,0s) + ${loop.dur / 2}s)}
`;
      if (o2.kind === "waves") css2 += `${s4} path{transform-box:fill-box;transform-origin:left center;animation:ts-il-wave-out ${loop.dur}s ease-out calc(var(--ts-il-phase,0s)) infinite}${s4} path+path{animation-delay:calc(var(--ts-il-phase,0s) + ${loop.dur / 3}s)}
`;
      if (o2.kind === "day") css2 += `${s4}{transform-box:view-box;transform-origin:0 0;animation:ts-il-day ${loop.dur}s steps(1,end) var(--ts-il-phase,0s) infinite}
`;
    });
  }
  css2 += `@media (prefers-reduced-motion:reduce){.cv-icon[data-loop],.cv-icon[data-loop] *{animation:none!important}.cv-icon[data-loop] [data-moving]{display:none}}
`;
  css2 += `@supports not (offset-path:path("M0 0")){.cv-icon[data-loop] [data-run]{display:none}}`;
  return css2;
}
function loopPhase(name) {
  let h4 = 0;
  for (const ch of name) h4 = h4 * 31 + ch.charCodeAt(0) >>> 0;
  const dur = ICON_LOOP[name]?.dur ?? 3;
  return `${-(h4 % 97 / 97) * dur}s`;
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
  ellipsis: ["c:12,12,1", "c:19,12,1", "c:5,12,1"],
  // brain, flask-conical, code-xml, file (2026-11-17, for the meaning loops)
  ...LOOP_SHAPES
};
function shape(s4, i3, loop = false) {
  const pl = loop ? { pathLength: 1 } : {};
  const [kind, rest] = s4.length > 2 && s4[1] === ":" ? [s4[0], s4.slice(2)] : ["d", s4];
  if (kind === "c") {
    const [cx2, cy, r3] = rest.split(",");
    return /* @__PURE__ */ jsx("circle", { cx: cx2, cy, r: r3, ...pl }, i3);
  }
  if (kind === "r") {
    const [x, y, w, h4, rx] = rest.split(",");
    return /* @__PURE__ */ jsx("rect", { x, y, width: w, height: h4, rx, ...pl }, i3);
  }
  if (kind === "e") {
    const [cx2, cy, rx, ry] = rest.split(",");
    return /* @__PURE__ */ jsx("ellipse", { cx: cx2, cy, rx, ry, ...pl }, i3);
  }
  if (kind === "p") return /* @__PURE__ */ jsx("polygon", { points: rest, ...pl }, i3);
  return /* @__PURE__ */ jsx("path", { d: rest, ...pl }, i3);
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
  if (animate === "loop" && !filled) return /* @__PURE__ */ jsx(LoopIcon, { name, size, className, label });
  const anim = animate ? { "data-anim": ANIM_OF[name] ?? "pop", "data-anim-on": animate === "once" ? "once" : "hover" } : void 0;
  const animStyle = animate ? /* @__PURE__ */ jsx("style", { href: "ts-icon-anim", precedence: "default", children: ICON_ANIM_CSS }) : null;
  if (filled && animate === "loop")
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("style", { href: "ts-icon-loop", precedence: "default", children: LOOP_CSS }),
      /* @__PURE__ */ jsx("svg", { "data-loop": `${name}-filled`, className: `cv-icon is-filled ${className}`, style: { ["--ts-il-phase"]: loopPhase(name) }, width: size, height: size, viewBox: "0 0 24 24", role: label ? "img" : void 0, "aria-label": label, "aria-hidden": label ? void 0 : true, focusable: "false", children: filled(size) })
    ] });
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
        children: SHAPES[name].map((s4, i3) => shape(s4, i3))
      }
    )
  ] });
}
const LOOP_CSS = iconLoopCss();
function LoopIcon({ name, size, className, label }) {
  const loop = ICON_LOOP[name];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { href: "ts-icon-loop", precedence: "default", children: LOOP_CSS }),
    /* @__PURE__ */ jsxs(
      "svg",
      {
        "data-loop": name,
        className: `cv-icon ${className}`,
        style: { ["--ts-il-phase"]: loopPhase(name) },
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
        children: [
          SHAPES[name].map((s4, i3) => shape(s4, i3, true)),
          (loop?.overlay ?? []).map(
            (o2, i3) => o2.kind === "dot-run" ? /* @__PURE__ */ jsx("circle", { className: `ts-il-o${i3 + 1}`, "data-moving": "", "data-run": "", r: "1.5", fill: "var(--ts-electric-fg,currentColor)", stroke: "none" }, `o${i3}`) : o2.kind === "bubbles" ? /* @__PURE__ */ jsxs("g", { className: `ts-il-o${i3 + 1}`, "data-moving": "", fill: "currentColor", stroke: "none", children: [
              /* @__PURE__ */ jsx("circle", { cx: "10.5", cy: "19", r: "1.1" }),
              /* @__PURE__ */ jsx("circle", { cx: "13.5", cy: "18.5", r: ".9" })
            ] }, `o${i3}`) : o2.kind === "waves" ? /* @__PURE__ */ jsxs("g", { className: `ts-il-o${i3 + 1}`, "data-moving": "", fill: "none", stroke: "currentColor", children: [
              /* @__PURE__ */ jsx("path", { d: "M21.5 9.5c.8.7.8 3.3 0 4" }),
              /* @__PURE__ */ jsx("path", { d: "M23 8c1.5 1.5 1.5 6.5 0 8" })
            ] }, `o${i3}`) : /* @__PURE__ */ jsx("rect", { className: `ts-il-o${i3 + 1}`, x: "6.5", y: "12.5", width: "3", height: "3", rx: ".6", fill: "currentColor", stroke: "none" }, `o${i3}`)
          )
        ]
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
function resolveFields(c9) {
  const out = [];
  for (const f4 of c9.fields) {
    const name = typeof f4 === "string" ? f4 : f4.name;
    if (!name || name === "title" || name === "path" || out.some((x) => x.name === name)) continue;
    const declared = typeof f4 === "string" ? void 0 : f4.kind;
    const valid = ["text", "number", "date", "select", "multi", "status", "priority", "relation", "checkbox", "url", "progress"].includes(declared ?? "");
    const kind = valid ? (declared === "text" || declared === "select") && RELATION_NAMES.includes(name.toLowerCase()) ? "relation" : declared : inferKind(name, c9.items.map((i3) => i3.props[name]));
    out.push({ name, kind, label: typeof f4 !== "string" && f4.label || FIELD_LABEL[name] || name });
  }
  return out;
}
function inferKind(name, values) {
  const n2 = name.toLowerCase();
  const vals = values.filter((v) => v != null && v !== "");
  if (n2 === "status" || n2 === "state") return "status";
  if (n2 === "priority") return "priority";
  if (vals.length && vals.every((v) => typeof v === "boolean")) return "checkbox";
  if (vals.some((v) => Array.isArray(v))) return RELATION_NAMES.includes(n2) ? "relation" : "multi";
  if (DATE_NAMES.includes(n2) || vals.length && vals.every((v) => typeof v === "string" && ISO.test(v))) return "date";
  if (vals.length && vals.every((v) => typeof v === "string" && /^\d+\s*\/\s*\d+$/.test(v))) return "progress";
  if (vals.length && vals.every((v) => typeof v === "number")) return "number";
  if (vals.length && vals.every((v) => typeof v === "string" && /^https?:\/\//.test(v))) return "url";
  if (RELATION_NAMES.includes(n2) || vals.some((v) => typeof v === "string" && v.startsWith("[["))) return "relation";
  const distinct = new Set(vals.map(String));
  return vals.length >= 3 && distinct.size <= Math.max(2, Math.min(8, vals.length / 2)) ? "select" : "text";
}
const linkLabel = (v) => {
  const inner = v.replace(/^\[\[|\]\]$/g, "");
  const alias = inner.split("|")[1];
  return (alias ?? inner.split("/").pop() ?? inner).replace(/\.md$/, "");
};
const asList = (v) => v == null || v === "" ? [] : Array.isArray(v) ? v.map(String) : [String(v)];
const dayStart = (d6) => new Date(d6.getFullYear(), d6.getMonth(), d6.getDate()).getTime();
const parseDay = (v) => {
  if (typeof v !== "string" || !ISO.test(v)) return null;
  const t2 = Date.parse(`${v.slice(0, 10)}T00:00:00`);
  return Number.isFinite(t2) ? t2 : null;
};
function relativeDay(v, today) {
  const t2 = parseDay(v);
  if (t2 == null) return null;
  const days = Math.round((t2 - dayStart(today)) / DAY$1);
  if (days === 0) return "өнөөдөр";
  if (days === -1) return "өчигдөр";
  if (days === 1) return "маргааш";
  return days < 0 ? `${-days} хоногийн өмнө` : `${days} хоногийн дараа`;
}
const fmtDay = (t2) => {
  const d6 = new Date(t2);
  return `${d6.getFullYear()}-${String(d6.getMonth() + 1).padStart(2, "0")}-${String(d6.getDate()).padStart(2, "0")}`;
};
const PERSON_NAMES = ["owner", "assignee", "person", "people", "manager", "author"];
const fieldIcon = (f4) => f4.kind === "relation" && PERSON_NAMES.includes(f4.name.toLowerCase()) ? "user" : FIELD_ICON[f4.kind] ?? "type";
function rangeText(a10, b7, today) {
  const s4 = parseDay(a10);
  const e6 = parseDay(b7);
  if (s4 == null || e6 == null || s4 === e6) return null;
  const f4 = (t2) => {
    const d6 = new Date(t2);
    return `${d6.getFullYear() !== today.getFullYear() ? `${d6.getFullYear()}.` : ""}${d6.getMonth() + 1}/${d6.getDate()}`;
  };
  return `${f4(s4)} → ${f4(e6)}`;
}
const catOf = (v) => {
  let h4 = 0;
  for (let i3 = 0; i3 < v.length; i3++) h4 = h4 * 31 + v.charCodeAt(i3) >>> 0;
  return h4 % 4 + 1;
};
function frontmatterOf(item) {
  const val = (v) => Array.isArray(v) ? `[${v.join(", ")}]` : typeof v === "string" && /[:#\[\]{}]/.test(v) ? JSON.stringify(v) : String(v);
  const lines = [`title: ${val(item.title)}`];
  for (const [k2, v] of Object.entries(item.props)) if (v != null && v !== "" && !(Array.isArray(v) && !v.length)) lines.push(`${k2}: ${val(v)}`);
  return ["---", ...lines, "---"].join("\n");
}
function StatusPill({ value }) {
  const g3 = statusGroup(value);
  if (!g3) return value == null || value === "" ? null : /* @__PURE__ */ jsx("span", { className: "cl-pill is-gray", children: String(value) });
  const s4 = STATUS[g3];
  return /* @__PURE__ */ jsxs("span", { className: `cl-pill is-${s4.tone}`, title: s4.label, children: [
    /* @__PURE__ */ jsx(Icon, { name: s4.icon, size: 14 }),
    s4.label
  ] });
}
function PriorityBadge({ value }) {
  const p3 = priorityOf(value);
  if (!p3) return null;
  const m5 = PRIORITY[p3];
  return /* @__PURE__ */ jsxs("span", { className: `cl-prio is-${m5.tone}`, title: `Ач холбогдол: ${m5.label}`, children: [
    /* @__PURE__ */ jsx(Icon, { name: m5.icon, size: 14 }),
    m5.label
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
  const m5 = typeof value === "string" ? value.match(/^(\d+)\s*\/\s*(\d+)$/) : null;
  if (!m5) return null;
  const [done, total] = [Number(m5[1]), Number(m5[2])];
  const pct = total ? Math.min(1, done / total) : 0;
  const C5 = 2 * Math.PI * 5.5;
  return /* @__PURE__ */ jsxs("span", { className: `cl-nm${pct >= 1 ? " is-full" : ""}`, title: `${done}/${total} даалгавар дууссан`, children: [
    /* @__PURE__ */ jsxs("svg", { className: "cl-ring", viewBox: "0 0 14 14", width: "14", height: "14", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "5.5", className: "cl-ring-bg" }),
      pct > 0 && pct < 1 && /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "5.5", className: "cl-ring-arc", strokeDasharray: `${pct * C5} ${C5}`, transform: "rotate(-90 7 7)" }),
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
  const status = fields.find((f4) => f4.kind === "status");
  const priority = fields.find((f4) => f4.kind === "priority");
  const progress = fields.find((f4) => f4.kind === "progress");
  const dates = fields.filter((f4) => f4.kind === "date");
  const dateField = DATE_NAMES.map((n2) => dates.find((f4) => f4.name.toLowerCase() === n2)).find(Boolean) ?? dates[0];
  const startField = dates.find((f4) => f4.name.toLowerCase() === "start");
  const endField = dates.find((f4) => ["end", "due", "deadline"].includes(f4.name.toLowerCase()));
  const relations = fields.filter((f4) => f4.kind === "relation");
  const groupable = fields.filter((f4) => ["status", "priority", "select", "relation", "checkbox", "multi", "date"].includes(f4.kind));
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
  const isDone = (i3) => {
    const g3 = status ? statusGroup(i3.props[status.name]) : null;
    return g3 === "done" || g3 === "canceled" || g3 === "archived";
  };
  const overdueOf = (i3) => {
    if (!endField || isDone(i3)) return false;
    const t2 = parseDay(i3.props[endField.name]);
    return t2 != null && t2 < dayStart(today);
  };
  const counts = /* @__PURE__ */ new Map();
  if (status) for (const i3 of collection.items) {
    const g3 = statusGroup(i3.props[status.name]);
    if (g3) counts.set(g3, (counts.get(g3) ?? 0) + 1);
  }
  const groupsPresent = STATUS_ORDER.filter((g3) => counts.get(g3));
  const visibleTabs = moreTabs ? groupsPresent : groupsPresent.slice(0, 4);
  const active = presets.find((p3) => p3.id === preset) ?? null;
  const items = collection.items.filter((i3) => {
    if (status && tab !== "all" && statusGroup(i3.props[status.name]) !== tab) return false;
    if (filterField && filterValue && !asList(i3.props[filterField]).includes(filterValue)) return false;
    if (active?.range && dateField) {
      const t2 = parseDay(i3.props[dateField.name]);
      if (t2 == null) return false;
      const now = new Date(dayStart(today));
      if (active.range === "month" && (new Date(t2).getMonth() !== now.getMonth() || new Date(t2).getFullYear() !== now.getFullYear())) return false;
      if (active.range === "recent" && (t2 > now.getTime() || now.getTime() - t2 > 14 * DAY$1)) return false;
    }
    return true;
  });
  if (active?.range === "recent" && dateField) items.sort((a10, b7) => (parseDay(b7.props[dateField.name]) ?? 0) - (parseDay(a10.props[dateField.name]) ?? 0));
  const rels = (i3, only) => relations.filter((f4) => !only || f4.name === only).flatMap((f4) => asList(i3.props[f4.name]).map((v) => resolve?.(f4.name, v) ?? { label: linkLabel(v), icon: f4.name.toLowerCase().includes("area") ? "layout-grid" : "link" }));
  const itemIcon = (i3) => collection.type === "task" && isDone(i3) ? "circle-check" : typeIcon(collection.type);
  const pickPreset = (p3) => {
    setPreset(p3?.id ?? null);
    if (p3) {
      setView(p3.view);
      if (p3.calendar) setCalMode(p3.calendar);
    }
  };
  const cell = (i3, f4) => {
    const v = i3.props[f4.name];
    switch (f4.kind) {
      case "status":
        return /* @__PURE__ */ jsx(StatusPill, { value: v });
      case "priority":
        return /* @__PURE__ */ jsx(PriorityBadge, { value: v });
      case "progress":
        return /* @__PURE__ */ jsx(ProgressNM, { value: v });
      case "date":
        return /* @__PURE__ */ jsx(RelDate, { value: v, today, overdue: f4.name === endField?.name && overdueOf(i3) });
      case "relation":
        return /* @__PURE__ */ jsx("span", { className: "cl-rels", children: rels(i3, f4.name).map((r3, k2) => /* @__PURE__ */ jsx(RelationChip, { rel: r3 }, r3.label + k2)) });
      case "multi":
        return /* @__PURE__ */ jsx("span", { className: "cl-rels", children: asList(v).map((t2) => /* @__PURE__ */ jsx("span", { className: "cl-tag", children: t2 }, t2)) });
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
  const title = (i3) => /* @__PURE__ */ jsxs("span", { className: "cl-title", children: [
    /* @__PURE__ */ jsx(Icon, { name: itemIcon(i3), size: 16, className: collection.type === "task" && isDone(i3) ? "is-done" : "" }),
    nested ? /* @__PURE__ */ jsx("span", { className: "cl-title-t", title: i3.path ?? i3.title, children: i3.title }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "cl-title-t", title: i3.path ?? i3.title, onClick: () => setPeek(i3.id), children: i3.title }),
      /* @__PURE__ */ jsxs("button", { type: "button", className: "cl-open", onClick: () => setPeek(i3.id), "aria-label": `${i3.title} — нээх`, tabIndex: -1, children: [
        /* @__PURE__ */ jsx(Icon, { name: "panel-right", size: 14 }),
        "Нээх"
      ] })
    ] })
  ] });
  const dateOf = (i3) => {
    const range = startField && endField ? rangeText(i3.props[startField.name], i3.props[endField.name], today) : null;
    if (range)
      return /* @__PURE__ */ jsxs("span", { className: `cl-date${overdueOf(i3) ? " is-overdue" : ""}`, children: [
        /* @__PURE__ */ jsx(Icon, { name: "calendar", size: 14 }),
        range
      ] });
    return dateField ? /* @__PURE__ */ jsx(RelDate, { value: i3.props[(endField ?? dateField).name] ?? i3.props[dateField.name], today, overdue: overdueOf(i3) }) : null;
  };
  const groupKey = (i3, f4) => {
    if (f4.kind === "status") return statusGroup(i3.props[f4.name]) ?? "";
    if (f4.kind === "priority") return priorityOf(i3.props[f4.name]) ?? "";
    if (f4.kind === "date") {
      const t2 = parseDay(i3.props[f4.name]);
      return t2 == null ? "" : fmtDay(t2).slice(0, 7);
    }
    const list2 = asList(i3.props[f4.name]);
    return list2[0] ?? "";
  };
  const groupLabel = (f4, key) => {
    if (!key) return "Хоосон";
    if (f4.kind === "status") return STATUS[key]?.label ?? key;
    if (f4.kind === "priority") return PRIORITY[key]?.label ?? key;
    if (f4.kind === "relation") return resolve?.(f4.name, key)?.label ?? linkLabel(key);
    if (f4.kind === "date") return `${key.slice(0, 4)} оны ${Number(key.slice(5, 7))}-р сар`;
    return valueLabel(key);
  };
  const groupsOf = (f4, list2) => {
    const keys = [];
    for (const i3 of list2) {
      const k2 = groupKey(i3, f4);
      if (!keys.includes(k2)) keys.push(k2);
    }
    if (f4.kind === "status") keys.sort((a10, b7) => STATUS_ORDER.indexOf(a10) - STATUS_ORDER.indexOf(b7));
    if (f4.kind === "priority") keys.sort((a10, b7) => ["high", "medium", "low", ""].indexOf(a10) - ["high", "medium", "low", ""].indexOf(b7));
    if (f4.kind === "date") keys.sort((a10, b7) => !a10 ? 1 : !b7 ? -1 : a10.localeCompare(b7));
    return keys.map((k2) => ({ key: k2, items: list2.filter((i3) => groupKey(i3, f4) === k2) }));
  };
  const groupHead = (f4, key, n2, id) => /* @__PURE__ */ jsxs("button", { type: "button", className: "cl-group-h", "aria-expanded": !folded[id], onClick: () => setFolded((s4) => ({ ...s4, [id]: !s4[id] })), children: [
    /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 14, className: "cl-chev" }),
    f4.kind === "status" && key ? /* @__PURE__ */ jsx(StatusPill, { value: key }) : f4.kind === "priority" && key ? /* @__PURE__ */ jsx(PriorityBadge, { value: key }) : /* @__PURE__ */ jsxs("span", { className: "cl-group-t", children: [
      /* @__PURE__ */ jsx(Icon, { name: fieldIcon(f4), size: 14 }),
      groupLabel(f4, key)
    ] }),
    /* @__PURE__ */ jsx("span", { className: "cl-count", children: n2 })
  ] });
  const shown = fields.filter((f4) => f4.kind !== "text" || fields.length <= 6).slice(0, 8);
  const table = (list2) => /* @__PURE__ */ jsx("div", { className: "cl-table-wrap", tabIndex: 0, role: "region", "aria-label": `${typeLabel(collection.type)} хүснэгт`, children: /* @__PURE__ */ jsxs("table", { className: "cl-table", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsxs("th", { scope: "col", children: [
        /* @__PURE__ */ jsx(Icon, { name: "type", size: 14 }),
        " Нэр"
      ] }),
      shown.map((f4) => /* @__PURE__ */ jsxs("th", { scope: "col", children: [
        /* @__PURE__ */ jsx(Icon, { name: fieldIcon(f4), size: 14 }),
        " ",
        f4.label
      ] }, f4.name))
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: list2.map((i3, k2) => /* @__PURE__ */ jsxs("tr", { style: { "--i": k2 }, children: [
      /* @__PURE__ */ jsx("th", { scope: "row", children: title(i3) }),
      shown.map((f4) => /* @__PURE__ */ jsx("td", { "data-label": f4.label, children: cell(i3, f4) }, f4.name))
    ] }, i3.id)) }),
    /* @__PURE__ */ jsx("tfoot", { children: /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: shown.length + 1, children: [
      /* @__PURE__ */ jsx("span", { className: "cl-foot", children: "Тоо" }),
      " ",
      list2.length
    ] }) }) })
  ] }) });
  const row = (i3, k2) => /* @__PURE__ */ jsxs("li", { className: "cl-row", style: { "--i": k2 }, children: [
    status && /* @__PURE__ */ jsx(StatusPill, { value: i3.props[status.name] }),
    title(i3),
    /* @__PURE__ */ jsxs("span", { className: "cl-row-meta", children: [
      rels(i3).map((r3, j3) => /* @__PURE__ */ jsx(RelationChip, { rel: r3 }, r3.label + j3)),
      priority && /* @__PURE__ */ jsx(PriorityBadge, { value: i3.props[priority.name] }),
      progress && /* @__PURE__ */ jsx(ProgressNM, { value: i3.props[progress.name] }),
      dateOf(i3)
    ] })
  ] }, i3.id);
  const list = (l2) => /* @__PURE__ */ jsx("ul", { className: "cl-list", children: l2.map(row) });
  const grouped = (render) => {
    const f4 = fields.find((x) => x.name === groupBy);
    if (!f4) return render(items);
    return /* @__PURE__ */ jsx("div", { className: "cl-groups", children: groupsOf(f4, items).map((g3) => {
      const id = `${f4.name}:${g3.key}`;
      return /* @__PURE__ */ jsxs("section", { className: "cl-group", "aria-label": groupLabel(f4, g3.key), children: [
        groupHead(f4, g3.key, g3.items.length, id),
        !folded[id] && render(g3.items)
      ] }, id);
    }) });
  };
  const board = () => {
    const f4 = fields.find((x) => x.name === groupBy) ?? status ?? groupable[0];
    if (!f4) return /* @__PURE__ */ jsx(Empty, { text: "Самбарт бүлэглэх талбар алга.", icon: "kanban" });
    return /* @__PURE__ */ jsx("div", { className: "cl-board", role: "list", children: groupsOf(f4, items).map((g3) => /* @__PURE__ */ jsxs(
      "section",
      {
        className: `cl-col${f4.kind === "status" && g3.key ? ` is-${STATUS[g3.key]?.tone ?? "gray"}` : ""}`,
        role: "listitem",
        "aria-label": groupLabel(f4, g3.key),
        children: [
          /* @__PURE__ */ jsxs("header", { className: "cl-col-h", children: [
            f4.kind === "status" && g3.key ? /* @__PURE__ */ jsx(StatusPill, { value: g3.key }) : /* @__PURE__ */ jsx("span", { className: "cl-group-t", children: groupLabel(f4, g3.key) }),
            /* @__PURE__ */ jsx("span", { className: "cl-count", children: g3.items.length })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "cl-cards", children: g3.items.map((i3, k2) => /* @__PURE__ */ jsxs("li", { className: "cl-card", style: { "--i": k2 }, children: [
            title(i3),
            /* @__PURE__ */ jsx("span", { className: "cl-row-meta", children: rels(i3).map((r3, j3) => /* @__PURE__ */ jsx(RelationChip, { rel: r3 }, r3.label + j3)) }),
            /* @__PURE__ */ jsxs("span", { className: "cl-row-meta", children: [
              priority && /* @__PURE__ */ jsx(PriorityBadge, { value: i3.props[priority.name] }),
              progress && /* @__PURE__ */ jsx(ProgressNM, { value: i3.props[progress.name] }),
              dateOf(i3)
            ] })
          ] }, i3.id)) })
        ]
      },
      g3.key
    )) });
  };
  const undated = dateField ? items.filter((i3) => parseDay(i3.props[(startField ?? dateField).name]) == null && (!endField || parseDay(i3.props[endField.name]) == null)).length : 0;
  const calendar = () => {
    if (!dateField) return /* @__PURE__ */ jsx(Empty, { text: "Огнооны талбар алга.", icon: "calendar" });
    const c9 = new Date(cursor);
    const start = calMode === "week" ? cursor - (c9.getDay() + 6) % 7 * DAY$1 : (() => {
      const first = new Date(c9.getFullYear(), c9.getMonth(), 1);
      return first.getTime() - (first.getDay() + 6) % 7 * DAY$1;
    })();
    const days = calMode === "week" ? 7 : 42;
    const cells = Array.from({ length: days }, (_, k2) => dayStart(new Date(start + k2 * DAY$1 + 36e5)));
    const byDay = /* @__PURE__ */ new Map();
    for (const i3 of items) {
      const t2 = parseDay(i3.props[dateField.name]);
      if (t2 != null) byDay.set(t2, [...byDay.get(t2) ?? [], i3]);
    }
    const shift = (n2) => {
      const d6 = new Date(cursor);
      if (calMode === "week") setCursor(dayStart(new Date(cursor + n2 * 7 * DAY$1 + 36e5)));
      else setCursor(new Date(d6.getFullYear(), d6.getMonth() + n2, 1).getTime());
    };
    const title2 = calMode === "week" ? `${fmtDay(cells[0])} – ${fmtDay(cells[6])}` : `${c9.getFullYear()} оны ${c9.getMonth() + 1}-р сар`;
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
        /* @__PURE__ */ jsx("span", { className: "cl-seg", role: "radiogroup", "aria-label": "Хуанлийн хүрээ", children: ["month", "week"].map((m5) => /* @__PURE__ */ jsx("button", { type: "button", role: "radio", "aria-checked": calMode === m5, "data-active": calMode === m5 || void 0, onClick: () => setCalMode(m5), children: m5 === "month" ? "Сар" : "7 хоног" }, m5)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `cl-cal-grid is-${calMode}`, role: "grid", "aria-label": title2, children: [
        ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"].map((d6) => /* @__PURE__ */ jsx("span", { className: "cl-cal-dow", role: "columnheader", children: d6 }, d6)),
        cells.map((t2) => {
          const list2 = byDay.get(t2) ?? [];
          const inMonth = calMode === "week" || new Date(t2).getMonth() === c9.getMonth();
          return /* @__PURE__ */ jsxs("div", { role: "gridcell", className: `cl-cal-cell${inMonth ? "" : " is-out"}${t2 === dayStart(today) ? " is-today" : ""}`, "aria-label": `${fmtDay(t2)}, ${list2.length}`, children: [
            /* @__PURE__ */ jsx("span", { className: "cl-cal-n", children: new Date(t2).getDate() }),
            list2.slice(0, calMode === "week" ? 8 : 3).map((i3) => /* @__PURE__ */ jsxs("span", { className: `cl-cal-item${status ? ` is-${STATUS[statusGroup(i3.props[status.name]) ?? "inbox"].tone}` : ""}`, title: i3.title, children: [
              /* @__PURE__ */ jsx(Icon, { name: itemIcon(i3), size: 14 }),
              i3.title
            ] }, i3.id)),
            list2.length > (calMode === "week" ? 8 : 3) && /* @__PURE__ */ jsxs("span", { className: "cl-cal-more", children: [
              "+",
              list2.length - (calMode === "week" ? 8 : 3)
            ] })
          ] }, t2);
        })
      ] })
    ] });
  };
  const timeline = () => {
    const from = startField ?? dateField;
    if (!from) return /* @__PURE__ */ jsx(Empty, { text: "Огнооны талбар алга.", icon: "gantt-chart" });
    const rows = items.map((i3) => {
      const s4 = parseDay(i3.props[from.name]);
      const e6 = endField ? parseDay(i3.props[endField.name]) : null;
      return s4 != null ? { i: i3, s: s4, e: Math.max(s4 + DAY$1, e6 ?? s4 + DAY$1) } : e6 != null ? { i: i3, s: e6 - DAY$1, e: e6 } : null;
    }).filter((x) => !!x).sort((a10, b7) => a10.s - b7.s);
    if (!rows.length) return /* @__PURE__ */ jsx(Empty, { text: "Эхлэх эсвэл дуусах огноотой мөр алга.", icon: "gantt-chart" });
    const lo = Math.min(...rows.map((r3) => r3.s));
    const hi = Math.max(...rows.map((r3) => r3.e));
    const span = Math.max(DAY$1, hi - lo);
    const pct = (t2) => (t2 - lo) / span * 100;
    const months = [];
    if (scale === "month" && span < 62 * DAY$1) {
      const w = new Date(lo);
      w.setDate(w.getDate() + ((8 - w.getDay()) % 7 || 7));
      for (let g3 = 0; w.getTime() < hi && g3 < 12; g3++) {
        months.push({ at: pct(dayStart(w)), label: `${w.getMonth() + 1}/${w.getDate()}` });
        w.setDate(w.getDate() + 7);
      }
    }
    const d6 = new Date(lo);
    d6.setDate(1);
    d6.setMonth(d6.getMonth() + (scale === "year" ? 3 - d6.getMonth() % 3 : 1));
    for (let g3 = 0; !(scale === "month" && span < 62 * DAY$1) && d6.getTime() < hi && g3 < 48; g3++) {
      const m5 = String(d6.getMonth() + 1).padStart(2, "0");
      const label2 = scale === "year" ? d6.getMonth() === 0 ? String(d6.getFullYear()) : `${d6.getMonth() / 3 + 1}-р улирал` : d6.getMonth() === 0 || !months.length ? `${d6.getFullYear()}.${m5}` : m5;
      months.push({ at: pct(d6.getTime()), label: label2 });
      d6.setMonth(d6.getMonth() + (scale === "year" ? 3 : 1));
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
        /* @__PURE__ */ jsx("span", { className: "cl-seg", role: "radiogroup", "aria-label": "Масштаб", children: ["month", "year"].map((m5) => /* @__PURE__ */ jsx("button", { type: "button", role: "radio", "aria-checked": scale === m5, "data-active": scale === m5 || void 0, onClick: () => setScale(m5), children: m5 === "month" ? "Сар" : "Жил" }, m5)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "cl-tl-scale", "aria-hidden": "true", children: months.map((m5) => /* @__PURE__ */ jsx("span", { style: { left: `${m5.at}%` }, children: m5.label }, m5.label + m5.at)) }),
      /* @__PURE__ */ jsx("ol", { className: "cl-tl-rows", children: rows.map(({ i: i3, s: s4, e: e6 }, k2) => {
        const g3 = status ? statusGroup(i3.props[status.name]) : null;
        return /* @__PURE__ */ jsx("li", { style: { "--i": k2 }, children: /* @__PURE__ */ jsxs("span", { className: "cl-tl-track", children: [
          months.map((m5) => /* @__PURE__ */ jsx("i", { className: "cl-tl-grid", style: { left: `${m5.at}%` } }, m5.label + m5.at)),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `cl-tl-bar is-${g3 ? STATUS[g3].tone : "gray"}${overdueOf(i3) ? " is-overdue" : ""}`,
              style: { left: `${pct(s4)}%`, width: `${Math.max(1.2, pct(e6) - pct(s4))}%` },
              title: `${fmtDay(s4)} → ${fmtDay(e6)}`
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: `cl-tl-label${pct(s4) > 55 ? " is-end" : ""}`, style: pct(s4) > 55 ? { right: `${Math.max(0, 100 - pct(e6))}%` } : { left: `${pct(s4)}%` }, children: [
            title(i3),
            status && /* @__PURE__ */ jsx(StatusPill, { value: i3.props[status.name] })
          ] }),
          now >= lo && now <= hi && /* @__PURE__ */ jsx("i", { className: "cl-tl-today", style: { left: `${pct(now)}%` } })
        ] }) }, i3.id);
      }) })
    ] });
  };
  const peekItem = collection.items.find((i3) => i3.id === peek) ?? null;
  const filterValues = filterField ? Array.from(new Set(collection.items.flatMap((i3) => asList(i3.props[filterField])))).sort() : [];
  const label = collection.label ?? typeLabel(collection.type);
  return /* @__PURE__ */ jsxs("div", { className: "cl", "data-type": collection.type, ref: rootRef, children: [
    !nested && status && groupsPresent.length > 0 && /* @__PURE__ */ jsxs("div", { className: "cl-tabs", role: "tablist", "aria-label": `${label} — төлөв`, children: [
      /* @__PURE__ */ jsxs("button", { type: "button", role: "tab", "aria-selected": tab === "all", onClick: () => setTab("all"), children: [
        /* @__PURE__ */ jsx(Icon, { name: "list", size: 14 }),
        "Бүгд ",
        /* @__PURE__ */ jsx("span", { className: "cl-count", children: collection.items.length })
      ] }),
      visibleTabs.map((g3) => /* @__PURE__ */ jsxs("button", { type: "button", role: "tab", "aria-selected": tab === g3, onClick: () => setTab(g3), className: `is-${STATUS[g3].tone}`, children: [
        /* @__PURE__ */ jsx(Icon, { name: STATUS[g3].icon, size: 14 }),
        STATUS[g3].label,
        " ",
        /* @__PURE__ */ jsx("span", { className: "cl-count", children: counts.get(g3) })
      ] }, g3)),
      groupsPresent.length > 4 && /* @__PURE__ */ jsxs("button", { type: "button", className: "cl-more", "aria-expanded": moreTabs, onClick: () => setMoreTabs((m5) => !m5), children: [
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
      presets.length > 0 && /* @__PURE__ */ jsx("span", { className: "cl-presets", role: "group", "aria-label": "Бэлэн харагдац", children: presets.map((p3) => /* @__PURE__ */ jsxs("button", { type: "button", "aria-pressed": preset === p3.id, onClick: () => pickPreset(preset === p3.id ? null : p3), children: [
        /* @__PURE__ */ jsx(Icon, { name: p3.icon, size: 14 }),
        p3.label
      ] }, p3.id)) }),
      /* @__PURE__ */ jsxs("span", { className: "cl-tools", children: [
        /* @__PURE__ */ jsxs("label", { className: "cl-select", children: [
          /* @__PURE__ */ jsx(Icon, { name: "filter", size: 14 }),
          /* @__PURE__ */ jsx("span", { className: "cv-sr", children: "Шүүх талбар" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filterField,
              onChange: (e6) => {
                setFilterField(e6.target.value);
                setFilterValue("");
              },
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Шүүлтгүй" }),
                fields.filter((f4) => f4.kind !== "text" && f4.kind !== "url").map((f4) => /* @__PURE__ */ jsx("option", { value: f4.name, children: f4.label }, f4.name))
              ]
            }
          )
        ] }),
        filterField && /* @__PURE__ */ jsxs("label", { className: "cl-select", children: [
          /* @__PURE__ */ jsx("span", { className: "cv-sr", children: "Шүүх утга" }),
          /* @__PURE__ */ jsxs("select", { value: filterValue, onChange: (e6) => setFilterValue(e6.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Бүгд" }),
            filterValues.map((v) => /* @__PURE__ */ jsx("option", { value: v, children: valueLabel(linkLabel(v)) }, v))
          ] })
        ] }),
        (view === "table" || view === "list" || view === "board") && /* @__PURE__ */ jsxs("label", { className: "cl-select", children: [
          /* @__PURE__ */ jsx(Icon, { name: "layers", size: 14 }),
          /* @__PURE__ */ jsx("span", { className: "cv-sr", children: "Бүлэглэх" }),
          /* @__PURE__ */ jsxs("select", { value: groupBy, onChange: (e6) => setGroupBy(e6.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "", children: view === "board" ? "Төлвөөр" : "Бүлэглэлгүй" }),
            groupable.map((f4) => /* @__PURE__ */ jsx("option", { value: f4.name, children: f4.label }, f4.name))
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
  return siblings.filter((c9) => c9 !== self && c9.type !== self.type).map((c9) => ({ collection: c9, items: c9.items.filter((i3) => Object.values(i3.props).some(hits)) })).filter((g3) => g3.items.length > 0);
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
    const key = (e6) => e6.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      back?.focus?.();
    };
  }, [onClose]);
  const filled = fields.filter((f4) => f4 !== status && f4.kind !== "relation" && !(item.props[f4.name] == null || item.props[f4.name] === "" || Array.isArray(item.props[f4.name]) && !item.props[f4.name].length));
  const shownProps = more ? filled : filled.slice(0, 8);
  const rels = fields.filter((f4) => f4.kind === "relation" && asList(item.props[f4.name]).length);
  const group = related[Math.min(tab, related.length - 1)];
  const sheet = /* @__PURE__ */ jsx("div", { className: "cv-sheet-wrap", onMouseDown: (e6) => e6.target === e6.currentTarget && onClose(), children: /* @__PURE__ */ jsxs("section", { className: "cv-sheet cl-peek", role: "dialog", "aria-modal": "true", "aria-labelledby": "cl-peek-title", children: [
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
      filled.length > 0 && /* @__PURE__ */ jsx("dl", { className: "cl-props", children: shownProps.map((f4) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("dt", { children: [
          /* @__PURE__ */ jsx(Icon, { name: fieldIcon(f4), size: 14 }),
          f4.label
        ] }),
        /* @__PURE__ */ jsx("dd", { children: cell(item, f4) })
      ] }, f4.name)) }),
      filled.length > 8 && /* @__PURE__ */ jsxs("button", { type: "button", className: "cl-more-props", onClick: () => setMore((m5) => !m5), "aria-expanded": more, children: [
        /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 14, className: "cl-chev" }),
        more ? "Цөөн харуулах" : `Бас ${filled.length - 8}`
      ] }),
      rels.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Холбоос" }),
        /* @__PURE__ */ jsx("dl", { className: "cl-props", children: rels.map((f4) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("dt", { children: [
            /* @__PURE__ */ jsx(Icon, { name: fieldIcon(f4), size: 14 }),
            f4.label
          ] }),
          /* @__PURE__ */ jsx("dd", { children: cell(item, f4) })
        ] }, f4.name)) })
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
          /* @__PURE__ */ jsx("div", { className: "cl-tabs", role: "tablist", "aria-label": "Холбоотой төрөл", children: related.map((g3, k2) => /* @__PURE__ */ jsxs("button", { type: "button", role: "tab", "aria-selected": group === g3, onClick: () => setTab(k2), children: [
            /* @__PURE__ */ jsx(Icon, { name: typeIcon(g3.collection.type), size: 14 }),
            g3.collection.label ?? typeLabel(g3.collection.type),
            " ",
            /* @__PURE__ */ jsx("span", { className: "cl-count", children: g3.items.length })
          ] }, g3.collection.type)) }),
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
function dependencyText(c9, p3, t2, index = taskIndex(c9)) {
  const { waitsOn, blocks } = dependenciesOf(c9, p3, t2, index);
  const parts = [];
  if (waitsOn.length)
    parts.push(`⛓ хүлээж буй: ${waitsOn.map((w) => (w.project && w.project !== p3 ? `${w.project.name} › ` : "") + w.task.title).join(", ")}`);
  if (blocks.length) parts.push(`→ ${blocks.length} даалгавар хүлээж байна`);
  return parts.join(" · ");
}
const areaLabel = (c9, v) => {
  const t2 = v?.trim();
  if (!t2) return "";
  return c9.units.find((u2) => u2.id === t2)?.name ?? t2;
};
function isHeld(c9, p3, t2, index = taskIndex(c9)) {
  return dependenciesOf(c9, p3, t2, index).waitsOn.some((w) => toPhaseState(w.task.status) !== "done");
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
const parse = (d6) => {
  if (!d6) return null;
  const t2 = Date.parse(d6.length === 10 ? `${d6}T00:00:00` : d6);
  return Number.isFinite(t2) ? t2 : null;
};
function dueBucket(due, done, today) {
  const t2 = parse(due);
  if (t2 == null) return "none";
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (t2 < start) return done ? "later" : "overdue";
  return t2 <= start + 14 * DAY ? "soon" : "later";
}
function ProjectReportFor({ c: c9, p: p3, decisionsLabel = "Шийдвэр" }) {
  const index = taskIndex(c9);
  const unit = c9.units.find((u2) => u2.id === p3.unitId);
  const states = p3.tasks.map((t2) => toPhaseState(t2.status));
  const done = states.filter((s4) => s4 === "done").length;
  const active = states.filter((s4) => s4 === "active").length;
  const state = toPhaseState(p3.status);
  const accountable = p3.raci?.accountable ? actorOf(c9, p3.raci.accountable).name : void 0;
  const phases = p3.tasks.map((t2) => ({
    id: t2.id,
    title: t2.title,
    status: t2.status,
    due: t2.due,
    owner: t2.ownerId ? actorOf(c9, t2.ownerId).name : void 0,
    line: [t2.ownerId ? actorOf(c9, t2.ownerId).role : "", dependencyText(c9, p3, t2, index)].filter(Boolean).join(" · ") || void 0
  }));
  return /* @__PURE__ */ jsx(
    ProjectReport,
    {
      project: {
        name: p3.name,
        icon: initials(p3.name).charAt(0),
        status: { label: phaseLabel[state], tone: phaseTone[state] },
        owner: accountable ?? unit?.name,
        updated: p3.due,
        summary: [areaLabel(c9, p3.area), areaLabel(c9, p3.subArea)].filter(Boolean).join(" › ") || unit?.name
      },
      kpis: [
        { label: "Даалгавар", value: p3.tasks.length },
        { label: "Дууссан", value: done, tone: "green" },
        { label: "Явж байна", value: active, tone: "blue" },
        { label: decisionsLabel, value: p3.decisions.length }
      ],
      progress: { value: p3.tasks.length ? done / p3.tasks.length * 100 : 0, label: "Явц" },
      phases,
      waiting: p3.tasks.filter((t2) => toPhaseState(t2.status) === "blocked" || toPhaseState(t2.status) !== "done" && isHeld(c9, p3, t2, index)).map((t2) => ({
        id: t2.id,
        title: t2.title,
        line: [t2.ownerId ? actorOf(c9, t2.ownerId).name : "", dependenciesOf(c9, p3, t2, index).waitsOn.length ? dependencyText(c9, p3, t2, index).split(" · ")[0] : ""].filter(Boolean).join(" · ") || void 0,
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
function Dashboard({ c: c9, scoped, today = /* @__PURE__ */ new Date(), empty }) {
  const index = taskIndex(c9);
  const [status, setStatus] = React.useState("all");
  const [owner, setOwner] = React.useState("all");
  const [due, setDue] = React.useState("all");
  const [pick, setPick] = React.useState(null);
  const uid = React.useId();
  const taskDue = (p3, t2) => t2.due ?? p3.due;
  const isDone = (s4) => toSessionState(s4) === "done";
  const passes = (p3, t2) => (status === "all" || toSessionState(t2.status) === status) && (owner === "all" || t2.ownerId === owner) && (due === "all" || dueBucket(taskDue(p3, t2), isDone(t2.status), today) === due);
  const filtering = status !== "all" || owner !== "all" || due !== "all";
  const owners = Array.from(new Set(scoped.projects.flatMap((p3) => p3.tasks.map((t2) => t2.ownerId).filter(Boolean)))).map((id) => actorOf(c9, id)).sort((a10, b7) => a10.kind === b7.kind ? a10.name.localeCompare(b7.name) : a10.kind === "person" ? -1 : 1);
  const allTasks = scoped.projects.flatMap((p3) => p3.tasks.map((t2) => ({ p: p3, t: t2 })));
  const summary = [
    { k: "Төсөл", v: scoped.projects.length },
    { k: "Нээлттэй даалгавар", v: allTasks.filter(({ t: t2 }) => !isDone(t2.status)).length },
    { k: "Хугацаа хэтэрсэн", v: allTasks.filter(({ p: p3, t: t2 }) => dueBucket(taskDue(p3, t2), isDone(t2.status), today) === "overdue").length, tone: "amber" },
    { k: "14 хоногт", v: allTasks.filter(({ p: p3, t: t2 }) => dueBucket(taskDue(p3, t2), isDone(t2.status), today) === "soon").length }
  ];
  const areas = /* @__PURE__ */ new Map();
  for (const p3 of scoped.projects) {
    const key = areaLabel(c9, p3.area) || NO_AREA;
    areas.set(key, [...areas.get(key) ?? [], p3]);
  }
  const picked = scoped.projects.find((p3) => p3.id === pick) ?? null;
  if (!scoped.projects.length) return /* @__PURE__ */ jsx(Empty, { text: empty, icon: "folder" });
  return /* @__PURE__ */ jsxs("div", { className: "cv-dash", children: [
    /* @__PURE__ */ jsx("dl", { className: "cv-stats cv-dash-stats", children: summary.map((s4, i3) => /* @__PURE__ */ jsxs("div", { className: `cv-stat${s4.tone ? ` is-${s4.tone}` : ""}`, style: { "--i": i3 }, children: [
      /* @__PURE__ */ jsx("dt", { children: s4.k }),
      /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(CountUp, { value: s4.v }) })
    ] }, s4.k)) }),
    owners.some((o2) => o2.kind === "person") && /* @__PURE__ */ jsx("div", { className: "cv-people", role: "group", "aria-label": "Хүнээр шүүх", children: owners.filter((o2) => o2.kind === "person").map((o2) => /* @__PURE__ */ jsxs("button", { type: "button", "aria-pressed": owner === o2.id, onClick: () => setOwner(owner === o2.id ? "all" : o2.id), children: [
      /* @__PURE__ */ jsx("span", { className: "cv-ava is-person", style: { "--s": "20px" }, "aria-hidden": "true", children: initials(o2.name) }),
      o2.name
    ] }, o2.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "cv-filters", role: "group", "aria-label": "Шүүлт", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Төлөв" }),
        /* @__PURE__ */ jsxs("select", { value: status, onChange: (e6) => setStatus(e6.target.value), id: `${uid}-st`, children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Бүгд" }),
          /* @__PURE__ */ jsx("option", { value: "running", children: "Явж байна" }),
          /* @__PURE__ */ jsx("option", { value: "waiting", children: "Хүлээж байна" }),
          /* @__PURE__ */ jsx("option", { value: "idle", children: "Эхлээгүй" }),
          /* @__PURE__ */ jsx("option", { value: "done", children: "Дууссан" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Эзэн" }),
        /* @__PURE__ */ jsxs("select", { value: owner, onChange: (e6) => setOwner(e6.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "all", children: "Бүгд" }),
          owners.map((o2) => /* @__PURE__ */ jsxs("option", { value: o2.id, children: [
            o2.kind === "agent" ? "✦ " : "",
            o2.name
          ] }, o2.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { children: [
        /* @__PURE__ */ jsx("span", { children: "Хугацаа" }),
        /* @__PURE__ */ jsxs("select", { value: due, onChange: (e6) => setDue(e6.target.value), children: [
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
        for (const p3 of projects) {
          const tasks = p3.tasks.filter((t2) => passes(p3, t2));
          if (filtering && !tasks.length) continue;
          const sub = areaLabel(c9, p3.subArea);
          if (sub) subs.set(sub, sub);
          const done = p3.tasks.filter((t2) => isDone(t2.status)).length;
          const acc = p3.raci?.accountable ? actorOf(c9, p3.raci.accountable) : null;
          sessions.push({
            id: p3.id,
            title: p3.name,
            status: p3.status,
            group: sub || void 0,
            owner: acc?.name,
            line: [`${done}/${p3.tasks.length} даалгавар`, p3.due ? `хугацаа ${p3.due}` : ""].filter(Boolean).join(" · ")
          });
          for (const t2 of tasks) {
            const o2 = t2.ownerId ? actorOf(c9, t2.ownerId) : null;
            const d6 = taskDue(p3, t2);
            const bucket = dueBucket(d6, isDone(t2.status), today);
            sessions.push({
              id: `${p3.id}:${t2.id}`,
              title: t2.title,
              status: t2.status,
              group: sub || void 0,
              parent: p3.id,
              owner: o2?.name,
              line: [o2?.name, d6 ? `${bucket === "overdue" ? "⚠ хэтэрсэн " : ""}${d6}` : "", dependencyText(c9, p3, t2, index)].filter(Boolean).join(" · ") || void 0
            });
          }
        }
        const projectRows = sessions.filter((s4) => !s4.parent);
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
                stats: { tasks: sessions.filter((s4) => s4.parent && toSessionState(s4.status) !== "done").length }
              },
              groups: [...subs.keys()].map((s4) => ({ id: s4, label: s4 })),
              sessions,
              labels: sbLabels,
              selectedId: pick,
              onSessionClick: (s4) => setPick(s4.parent ?? s4.id)
            }
          )
        ] }, area);
      }) }),
      picked && /* @__PURE__ */ jsxs("aside", { className: "cv-pick", "aria-label": picked.name, children: [
        /* @__PURE__ */ jsxs("div", { className: "cv-pick-bar", children: [
          /* @__PURE__ */ jsx("span", { children: "Сонгосон төсөл" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setPick(null), "aria-label": "Хаах", children: "×" })
        ] }),
        /* @__PURE__ */ jsx(ProjectReportFor, { c: c9, p: picked }, picked.id)
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
function Canvas({ c: c9, blocks, label, hideEmpty = false }) {
  const shown = blocks.filter((b7) => c9.model[b7.key] !== null && (!hideEmpty || modelLines(c9.model[b7.key]).length > 0));
  const flow = shown.length < blocks.length;
  if (!shown.length) return null;
  return /* @__PURE__ */ jsx("div", { className: `cv-bmc${flow ? " is-flow" : ""}`, role: "group", "aria-label": label, children: shown.map((b7, i3) => /* @__PURE__ */ jsxs("section", { className: `cv-bmc-cell is-${b7.area}`, style: { gridArea: flow ? void 0 : b7.area, "--i": i3 }, "aria-label": b7.title, children: [
    /* @__PURE__ */ jsxs("h4", { children: [
      b7.title,
      /* @__PURE__ */ jsx("small", { children: b7.hint })
    ] }),
    /* @__PURE__ */ jsx(Lines, { f: c9.model[b7.key], empty: "Бөглөөгүй" })
  ] }, b7.key)) });
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
  const t2 = parseDay(due);
  if (t2 == null) return null;
  const days = Math.round((t2 - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 864e5);
  const text = days < 0 ? `${-days} хоног хэтэрсэн` : days === 0 ? "өнөөдөр" : days === 1 ? "маргааш" : `${days} хоногийн дараа`;
  const tone = days < 0 ? " is-over" : days <= 7 ? " is-soon" : "";
  return /* @__PURE__ */ jsxs("time", { className: `cl-date cv-due${tone}`, dateTime: due.slice(0, 10), title: due.slice(0, 10), children: [
    /* @__PURE__ */ jsx(Icon, { name: days < 0 ? "clock" : "calendar", size: 14 }),
    text
  ] });
}
function TaskRow({ c: c9, t: t2, today }) {
  const g3 = gtdOf(t2.status);
  const closed = g3 === GTD.completed || g3 === GTD.cancelled;
  const owner = t2.ownerId ? actorOf(c9, t2.ownerId) : null;
  return /* @__PURE__ */ jsxs("li", { className: `cv-trow${closed ? " is-closed" : ""}`, children: [
    /* @__PURE__ */ jsxs("span", { className: `cl-pill cv-gtd is-${g3.tone}`, title: g3.label, children: [
      /* @__PURE__ */ jsx(Icon, { name: g3.icon, size: 14 }),
      /* @__PURE__ */ jsx("span", { className: "cv-gtd-l", children: g3.label })
    ] }, g3.label),
    /* @__PURE__ */ jsx("span", { className: "cv-trow-t", children: t2.title }),
    /* @__PURE__ */ jsxs("span", { className: "cv-trow-meta", children: [
      !closed && /* @__PURE__ */ jsx(PriorityBadge, { value: t2.priority }),
      !closed && /* @__PURE__ */ jsx(Due, { due: t2.due, today }),
      owner && /* @__PURE__ */ jsxs("span", { className: "cl-rel cv-trow-owner", title: owner.name, children: [
        /* @__PURE__ */ jsx(Avatar, { actor: owner, size: 16 }),
        /* @__PURE__ */ jsx("span", { children: owner.name })
      ] })
    ] })
  ] });
}
function BmcView({ c: c9, scoped, hideEmpty = false, today = /* @__PURE__ */ new Date() }) {
  const notes = scoped.notes ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "cv-method", children: [
    /* @__PURE__ */ jsx(Canvas, { c: c9, blocks: BMC, label: "Бизнес загварын канвас", hideEmpty }),
    /* @__PURE__ */ jsxs("div", { className: "cv-below", children: [
      /* @__PURE__ */ jsxs("section", { className: "cv-below-col", "aria-label": "Төсөл ба даалгавар", children: [
        /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Төсөл → даалгавар" }),
        scoped.projects.length ? /* @__PURE__ */ jsx("ul", { className: "cv-plist", children: scoped.projects.map((p3) => {
          const done = p3.tasks.filter((t2) => toPhaseState(t2.status) === "done").length;
          return /* @__PURE__ */ jsxs("li", { children: [
            /* @__PURE__ */ jsxs("span", { className: "cv-plist-top", children: [
              /* @__PURE__ */ jsx("i", { className: `cv-dot is-${toPhaseState(p3.status)}`, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("strong", { children: p3.name }),
              p3.tasks.length > 0 && /* @__PURE__ */ jsx(ProgressNM, { value: `${done}/${p3.tasks.length}` })
            ] }),
            p3.tasks.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "cv-tlist", children: p3.tasks.map((t2) => /* @__PURE__ */ jsx(TaskRow, { c: c9, t: t2, today }, t2.id)) }) : /* @__PURE__ */ jsxs("p", { className: "cv-tnone", children: [
              /* @__PURE__ */ jsx(Icon, { name: "square-check", size: 14 }),
              " Даалгавар алга"
            ] })
          ] }, p3.id);
        }) }) : /* @__PURE__ */ jsx(Empty, { text: "Төсөл алга.", icon: "folder" })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "cv-below-col", "aria-label": "Нот", children: [
        /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Нот" }),
        notes.length ? /* @__PURE__ */ jsx("ul", { className: "cv-notes", children: notes.map((n2) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: "cv-note-title", children: n2.title }),
          /* @__PURE__ */ jsx("span", { className: "cv-note-meta", children: [n2.projectId ? c9.projects.find((p3) => p3.id === n2.projectId)?.name : null, n2.date].filter(Boolean).join(" · ") })
        ] }, n2.id)) }) : /* @__PURE__ */ jsx(Empty, { text: "Нот алга.", icon: "file-text" })
      ] })
    ] })
  ] });
}
function OkrView({ c: c9, scoped }) {
  const okrs = scoped.okrs ?? [];
  if (!okrs.length) return /* @__PURE__ */ jsx(Empty, { text: "OKR бүртгэгдээгүй.", icon: "layout-template" });
  return /* @__PURE__ */ jsx("div", { className: "cv-okrs", children: okrs.map((o2, i3) => {
    const known = o2.keyResults.filter((k2) => Number.isFinite(k2.progress));
    const avg = known.length ? Math.round(known.reduce((n2, k2) => n2 + Math.max(0, Math.min(100, k2.progress)), 0) / known.length) : null;
    const owner = o2.ownerId ? actorOf(c9, o2.ownerId) : null;
    return /* @__PURE__ */ jsxs("article", { className: "cv-okr", style: { "--i": i3 }, "aria-label": o2.title, children: [
      /* @__PURE__ */ jsxs("header", { children: [
        /* @__PURE__ */ jsxs("span", { className: "cv-okr-o", children: [
          "O",
          i3 + 1
        ] }),
        /* @__PURE__ */ jsx("strong", { children: o2.title }),
        /* @__PURE__ */ jsx("span", { className: "cv-okr-pct", children: avg === null ? "—" : `${avg}%` })
      ] }),
      owner && /* @__PURE__ */ jsxs("span", { className: "cv-okr-owner", children: [
        /* @__PURE__ */ jsx(Avatar, { actor: owner, size: 18 }),
        " ",
        owner.name
      ] }),
      /* @__PURE__ */ jsx("ul", { children: o2.keyResults.map((k2, j3) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsxs("span", { className: "cv-kr-t", children: [
          /* @__PURE__ */ jsxs("span", { className: "cv-okr-k", children: [
            "KR",
            j3 + 1
          ] }),
          k2.title
        ] }),
        /* @__PURE__ */ jsx("span", { className: "cv-kr-bar", role: "progressbar", "aria-label": k2.title, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Number.isFinite(k2.progress) ? Math.round(k2.progress) : void 0, children: /* @__PURE__ */ jsx("span", { style: { width: `${Number.isFinite(k2.progress) ? Math.max(0, Math.min(100, k2.progress)) : 0}%` } }) }),
        /* @__PURE__ */ jsx("span", { className: "cv-kr-n", children: Number.isFinite(k2.progress) ? `${Math.round(k2.progress)}%` : "—" })
      ] }, k2.id)) })
    ] }, o2.id);
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
const ts = (d6) => {
  if (!d6) return null;
  const n2 = Date.parse(d6.length === 10 ? `${d6}T00:00:00` : d6);
  return Number.isFinite(n2) ? n2 : null;
};
function PmbokView({ c: c9, scoped, today }) {
  const [cell, setCell] = React.useState(null);
  const items = scoped.projects.flatMap(
    (p3) => p3.tasks.map((t2) => ({
      p: p3,
      t: t2,
      phase: toPmPhase(t2.phase ?? p3.phase),
      area: toPmArea(t2.knowledgeArea ?? p3.knowledgeArea),
      start: ts(t2.start ?? p3.start),
      end: ts(t2.end ?? t2.due ?? p3.end)
    }))
  );
  const at = (ph, ar) => items.filter((x) => x.phase === ph && x.area === ar);
  const max = Math.max(1, ...PM_PHASES.flatMap((ph) => PM_AREAS.map((ar) => at(ph, ar).length)));
  const picked = cell ? items.filter((x) => `${x.phase}|${x.area}` === cell) : [];
  const done = items.filter((x) => toPhaseState(x.t.status) === "done").length;
  const live = PM_PHASES.map((ph) => ({ ph, n: items.filter((x) => x.phase === ph && toPhaseState(x.t.status) === "active").length })).sort((a10, b7) => b7.n - a10.n)[0];
  const starts = items.map((x) => x.start).filter((n2) => n2 != null);
  const ends = items.map((x) => x.end).filter((n2) => n2 != null);
  const fmt = (n2) => {
    const d6 = new Date(n2);
    return `${d6.getFullYear()}-${String(d6.getMonth() + 1).padStart(2, "0")}-${String(d6.getDate()).padStart(2, "0")}`;
  };
  const facts = [
    { label: "Даалгавар", value: String(items.length) },
    { label: "Гүйцэтгэл", value: items.length ? `${Math.round(done / items.length * 100)}%` : "0%" },
    { label: "Идэвхтэй бүлэг", value: live && live.n ? PHASE_NAME[live.ph] : "Алга" },
    { label: "Хугацаа", value: starts.length && ends.length ? `${fmt(Math.min(...starts))} → ${fmt(Math.max(...ends))}` : "Тодорхойгүй" },
    { label: "Шийдвэр", value: String(scoped.projects.reduce((n2, p3) => n2 + p3.decisions.length, 0)) },
    ...c9.facts ?? []
  ];
  const dated = items.filter((x) => x.start != null && x.end != null).sort((a10, b7) => a10.start - b7.start);
  const lo = dated.length ? Math.min(...dated.map((x) => x.start)) : 0;
  const hi = dated.length ? Math.max(...dated.map((x) => x.end)) : 1;
  const span = Math.max(1, hi - lo);
  const pct = (n2) => (n2 - lo) / span * 100;
  const months = [];
  if (dated.length) {
    const d6 = new Date(lo);
    d6.setDate(1);
    d6.setMonth(d6.getMonth() + 1);
    for (let guard = 0; d6.getTime() < hi && guard < 36; guard++) {
      const m5 = String(d6.getMonth() + 1).padStart(2, "0");
      months.push({ at: pct(d6.getTime()), label: d6.getMonth() === 0 || !months.length ? `${d6.getFullYear()}.${m5}` : m5 });
      d6.setMonth(d6.getMonth() + 1);
    }
  }
  const now = today.getTime();
  return /* @__PURE__ */ jsxs("div", { className: "cv-method", children: [
    /* @__PURE__ */ jsxs("section", { className: "cv-facts", "aria-label": "Баримтын төв", children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Баримтын төв" }),
      /* @__PURE__ */ jsx("dl", { children: facts.map((f4, i3) => /* @__PURE__ */ jsxs("div", { style: { "--i": i3 }, children: [
        /* @__PURE__ */ jsx("dt", { children: f4.label }),
        /* @__PURE__ */ jsx("dd", { children: f4.value })
      ] }, f4.label + i3)) })
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
        x.t.ownerId && /* @__PURE__ */ jsx("small", { children: actorOf(c9, x.t.ownerId).name })
      ] }, x.p.id + x.t.id)) }),
      items.length > 0 && items.every((x) => !x.phase || !x.area) && /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Даалгавруудад үе шат, мэдлэгийн чиглэл бүртгэгдээгүй." })
    ] }),
    /* @__PURE__ */ jsxs("section", { "aria-label": "Гант график", children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: "Гант график" }),
      dated.length ? /* @__PURE__ */ jsxs("div", { className: "cv-gantt", children: [
        /* @__PURE__ */ jsx("div", { className: "cv-gantt-scale", "aria-hidden": "true", children: months.map((m5) => /* @__PURE__ */ jsx("span", { style: { left: `${m5.at}%` }, children: m5.label }, m5.label)) }),
        /* @__PURE__ */ jsx("ol", { className: "cv-gantt-rows", children: dated.map((x, i3) => {
          const s4 = toPhaseState(x.t.status);
          return /* @__PURE__ */ jsxs("li", { style: { "--i": i3 }, children: [
            /* @__PURE__ */ jsx("span", { className: "cv-gantt-label", children: x.t.title }),
            /* @__PURE__ */ jsxs("span", { className: "cv-gantt-track", children: [
              months.map((m5) => /* @__PURE__ */ jsx("i", { className: "cv-gantt-grid", style: { left: `${m5.at}%` } }, m5.label)),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `cv-gantt-bar is-${s4}`,
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
  c: c9,
  scoped,
  methodology,
  today = /* @__PURE__ */ new Date(),
  hideEmpty = false
}) {
  if (methodology === "pmbok") return /* @__PURE__ */ jsx(PmbokView, { c: c9, scoped, today });
  if (methodology === "okr") return /* @__PURE__ */ jsx(OkrView, { c: c9, scoped });
  if (methodology === "lean-canvas")
    return /* @__PURE__ */ jsx("div", { className: "cv-method", children: /* @__PURE__ */ jsx(Canvas, { c: c9, blocks: LEAN, label: "Lean Canvas", hideEmpty }) });
  return /* @__PURE__ */ jsx(BmcView, { c: c9, scoped, hideEmpty, today });
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
function pickTasks(c9, n2) {
  const rank = (t2) => {
    const g3 = gtdOf(t2.status).tone;
    return g3 === "running" ? 0 : g3 === "needs-you" ? 1 : g3 === "idle" ? 2 : 3;
  };
  return c9.projects.flatMap((p3) => p3.tasks.map((t2) => ({ t: t2, key: `${p3.id}:${t2.id}` }))).sort((a10, b7) => rank(a10.t) - rank(b7.t) || (parseDay(a10.t.due) ?? Infinity) - (parseDay(b7.t.due) ?? Infinity)).slice(0, n2);
}
function CompanyMini({
  company,
  today = /* @__PURE__ */ new Date(),
  labels,
  story = true,
  badge
}) {
  const L4 = { ...companyMiniLabelsMn, ...labels };
  const uid = React.useId();
  const reduced2 = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [step, setStep] = React.useState(0);
  const [tab, setTab] = React.useState("overview");
  const [paused, setPaused] = React.useState(false);
  const [busyUntil, setBusyUntil] = React.useState(0);
  const [, tick] = React.useState(0);
  const [cycles, setCycles] = React.useState(0);
  const rested = cycles >= 3;
  const playing = story && !reduced2 && !paused && !rested && Date.now() >= busyUntil;
  React.useEffect(() => {
    if (!playing) return;
    const last = step === STORY$1.length - 1;
    if (last && cycles >= 2) {
      const t22 = window.setTimeout(() => setCycles(3), STORY$1[step].hold);
      return () => window.clearTimeout(t22);
    }
    const t2 = window.setTimeout(() => {
      const next = last ? 0 : step + 1;
      if (last) setCycles((n2) => n2 + 1);
      setStep(next);
      setTab(STORY$1[next].tab);
    }, STORY$1[step].hold + (last ? 4e3 : 0));
    return () => window.clearTimeout(t2);
  }, [playing, step, cycles]);
  React.useEffect(() => {
    if (!busyUntil) return;
    const t2 = window.setTimeout(() => tick((n2) => n2 + 1), Math.max(0, busyUntil - Date.now()) + 20);
    return () => window.clearTimeout(t2);
  }, [busyUntil]);
  const touch = () => setBusyUntil(Date.now() + IDLE_MS$1);
  const pickTab = (k2) => {
    touch();
    setTab(k2);
  };
  const replay = () => {
    setPaused(false);
    setBusyUntil(0);
    setCycles(0);
    setStep(0);
    setTab(STORY$1[0].tab);
  };
  const mover = company.projects[0]?.tasks.find((t2) => !["completed", "done", "cancelled"].includes(t2.status)) ?? null;
  const c9 = story && mover && !reduced2 ? { ...company, projects: company.projects.map((p3, i3) => i3 ? p3 : { ...p3, tasks: p3.tasks.map((t2) => t2 === mover ? { ...t2, status: STORY$1[step].status } : t2) }) } : company;
  const tasks = c9.projects.flatMap((p3) => p3.tasks);
  const active = tasks.filter((t2) => gtdOf(t2.status).tone === "running").length;
  const waiting = tasks.filter((t2) => gtdOf(t2.status).tone === "needs-you").length;
  const stats = [
    { k: L4.statProjects, v: c9.projects.length, icon: "folder", tone: "" },
    { k: L4.statActive, v: active, icon: "play", tone: "is-running" },
    { k: L4.statWaiting, v: waiting, icon: "hourglass", tone: waiting ? "is-needs-you" : "" }
  ];
  const label = (k2) => L4[k2];
  return /* @__PURE__ */ jsxs("div", { className: "cv-mini", onPointerDown: touch, onKeyDown: touch, onWheel: touch, children: [
    /* @__PURE__ */ jsxs("header", { className: "cv-mini-h", children: [
      /* @__PURE__ */ jsx(TypeBadge, { type: "company", size: 24 }),
      /* @__PURE__ */ jsx("strong", { className: "cv-mini-name", children: company.name }),
      badge && /* @__PURE__ */ jsx("span", { className: "cv-tag", children: badge }),
      company.exportedAt && /* @__PURE__ */ jsxs("span", { className: "cv-mini-asof", title: `${L4.updated}: ${company.exportedAt.slice(0, 10)}`, children: [
        /* @__PURE__ */ jsx(Icon, { name: "clock", size: 12 }),
        /* @__PURE__ */ jsx("time", { dateTime: company.exportedAt, children: company.exportedAt.slice(0, 10) })
      ] }),
      story && !reduced2 && /* @__PURE__ */ jsxs("span", { className: "cv-mini-ctl", children: [
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": paused ? L4.play : L4.pause, "aria-pressed": paused, onClick: () => setPaused((p3) => !p3), children: /* @__PURE__ */ jsx(Icon, { name: paused ? "play" : "pause", size: 12 }) }),
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": L4.replay, onClick: replay, children: /* @__PURE__ */ jsx(Icon, { name: "rotate-ccw", size: 12 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "cv-mini-tabs", role: "tablist", "aria-label": L4.tabs, children: TABS.map(({ key, icon }) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        role: "tab",
        id: `${uid}-${key}`,
        "aria-selected": tab === key,
        "aria-controls": `${uid}-panel`,
        tabIndex: tab === key ? 0 : -1,
        onClick: () => pickTab(key),
        onKeyDown: (e6) => {
          if (e6.key !== "ArrowRight" && e6.key !== "ArrowLeft") return;
          const i3 = TABS.findIndex((x) => x.key === tab);
          const next = TABS[(i3 + (e6.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length].key;
          pickTab(next);
          e6.currentTarget.parentElement?.querySelector(`#${CSS.escape(`${uid}-${next}`)}`)?.focus();
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
        /* @__PURE__ */ jsx("dl", { className: "cv-mini-stats", children: stats.map((s4) => /* @__PURE__ */ jsxs("div", { className: `cv-mini-stat ${s4.tone}`, children: [
          /* @__PURE__ */ jsxs("dt", { children: [
            /* @__PURE__ */ jsx(Icon, { name: s4.icon, size: 12 }),
            s4.k
          ] }),
          /* @__PURE__ */ jsx("dd", { children: s4.v })
        ] }, s4.k)) }),
        tasks.length ? /* @__PURE__ */ jsx("ul", { className: "cv-tlist cv-mini-tasks", children: pickTasks(c9, 4).map(({ t: t2, key }) => /* @__PURE__ */ jsx(TaskRow, { c: c9, t: t2, today }, key)) }) : /* @__PURE__ */ jsx(Empty, { text: L4.noTasks, icon: "square-check" })
      ] }),
      tab === "projects" && (c9.projects.length ? /* @__PURE__ */ jsx("ul", { className: "cv-mini-list", children: c9.projects.slice(0, 4).map((p3) => {
        const done = p3.tasks.filter((t2) => gtdOf(t2.status).tone === "done").length;
        const g3 = gtdOf(p3.status);
        return /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { className: `cl-pill cv-gtd is-${g3.tone}`, title: g3.label, children: /* @__PURE__ */ jsx(Icon, { name: g3.icon, size: 12 }) }),
          /* @__PURE__ */ jsx("span", { className: "cv-mini-t", children: p3.name }),
          p3.tasks.length > 0 && /* @__PURE__ */ jsx(ProgressNM, { value: `${done}/${p3.tasks.length}` })
        ] }, p3.id);
      }) }) : /* @__PURE__ */ jsx(Empty, { text: L4.noProjects, icon: "folder" })),
      tab === "agents" && (c9.agents.length ? /* @__PURE__ */ jsx("ul", { className: "cv-mini-list", children: c9.agents.slice(0, 4).map((a10) => {
        const owner = a10.ownerId ? actorOf(c9, a10.ownerId) : null;
        const busy = tasks.find((t2) => t2.ownerId === a10.id && gtdOf(t2.status).tone === "running");
        return /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx(Avatar, { actor: { name: a10.name, kind: "agent" }, size: 20 }),
          /* @__PURE__ */ jsxs("span", { className: "cv-mini-t", children: [
            a10.name,
            /* @__PURE__ */ jsx("small", { children: busy ? busy.title : a10.role })
          ] }),
          owner && /* @__PURE__ */ jsxs("span", { className: "cl-rel", title: owner.name, children: [
            /* @__PURE__ */ jsx(Avatar, { actor: owner, size: 16 }),
            /* @__PURE__ */ jsx("span", { children: owner.name })
          ] })
        ] }, a10.id);
      }) }) : /* @__PURE__ */ jsx(Empty, { text: L4.noAgents, icon: "bot" }))
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
.cv-mini-tasks .cv-trow{animation:cvmtrow .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.cv-mini-tasks .cv-trow:nth-child(1){animation-delay:200ms}.cv-mini-tasks .cv-trow:nth-child(2){animation-delay:310ms}.cv-mini-tasks .cv-trow:nth-child(3){animation-delay:420ms}.cv-mini-tasks .cv-trow:nth-child(4){animation-delay:530ms}.cv-mini-tasks .cv-trow:nth-child(5){animation-delay:640ms}.cv-mini-tasks .cv-trow:nth-child(6){animation-delay:750ms}.cv-mini-tasks .cv-trow:nth-child(7){animation-delay:860ms}.cv-mini-tasks .cv-trow:nth-child(8){animation-delay:970ms}@keyframes cvmtrow{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.cv-mini-tasks .cv-trow{animation:none}}
`;
const lettersIn = (r3, id) => {
  if (!r3) return [];
  const out = [];
  if (r3.responsible?.includes(id)) out.push("R");
  if (r3.accountable === id) out.push("A");
  if (r3.consulted?.includes(id)) out.push("C");
  if (r3.informed?.includes(id)) out.push("I");
  return out;
};
function taskRaciOf(p3, id) {
  const own = raciOf(p3, id);
  const seen = /* @__PURE__ */ new Set();
  for (const t2 of p3.tasks) for (const l2 of lettersIn(t2.raci, id)) if (!own.includes(l2)) seen.add(l2);
  return ["R", "A", "C", "I"].filter((l2) => seen.has(l2));
}
const LETTER = { R: "Гүйцэтгэгч", A: "Хариуцагч", C: "Зөвлөх", I: "Мэдээлэгдэх" };
function RaciView({ c: c9, scoped, onPerson, empty }) {
  const projects = scoped.projects;
  const ids = /* @__PURE__ */ new Set();
  const collect = (r3) => {
    if (!r3) return;
    [...r3.responsible ?? [], r3.accountable, ...r3.consulted ?? [], ...r3.informed ?? []].forEach((id) => id && ids.add(id));
  };
  for (const p3 of projects) {
    collect(p3.raci);
    for (const t2 of p3.tasks) collect(t2.raci);
  }
  if (!ids.size) return /* @__PURE__ */ jsx(Empty, { text: empty, icon: "grid-3x3" });
  const actors = [...ids].map((id) => actorOf(c9, id)).sort((a10, b7) => a10.kind === b7.kind ? 0 : a10.kind === "person" ? -1 : 1);
  return /* @__PURE__ */ jsxs("div", { className: "cv-raci", children: [
    /* @__PURE__ */ jsx("div", { className: "cv-raci-scroll", tabIndex: 0, role: "region", "aria-label": "RACI", children: /* @__PURE__ */ jsxs("table", { className: "cv-raci-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "cv-raci-corner", children: "Хүн / агент" }),
        projects.map((p3) => /* @__PURE__ */ jsx("th", { scope: "col", className: p3.raci || p3.tasks.some((t2) => t2.raci) ? "" : "is-none", children: /* @__PURE__ */ jsx("span", { children: p3.name }) }, p3.id))
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: actors.map((a10, i3) => /* @__PURE__ */ jsxs("tr", { style: { "--i": i3 }, children: [
        /* @__PURE__ */ jsx("th", { scope: "row", children: a10.kind === "person" ? /* @__PURE__ */ jsxs("button", { type: "button", className: "cv-raci-who", onClick: () => onPerson(a10.id), children: [
          /* @__PURE__ */ jsx(Avatar, { actor: a10, size: 24 }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: a10.name }),
            /* @__PURE__ */ jsx("small", { children: a10.role })
          ] })
        ] }) : /* @__PURE__ */ jsxs("span", { className: "cv-raci-who is-agent", children: [
          /* @__PURE__ */ jsx(Avatar, { actor: a10, size: 24 }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: a10.name }),
            /* @__PURE__ */ jsx("small", { children: a10.role || "агент" })
          ] })
        ] }) }),
        projects.map((p3) => {
          const roles = raciOf(p3, a10.id);
          const viaTask = taskRaciOf(p3, a10.id);
          const label = [...roles.map((r3) => LETTER[r3]), ...viaTask.map((r3) => `${LETTER[r3]} (даалгавараар)`)].join(", ");
          return /* @__PURE__ */ jsx("td", { title: label || void 0, children: roles.length || viaTask.length ? /* @__PURE__ */ jsxs("span", { className: "cv-raci-cell", children: [
            roles.map((r3) => /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r3}`, children: r3 }, r3)),
            viaTask.map((r3) => /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r3} is-task`, children: r3 }, `t${r3}`)),
            /* @__PURE__ */ jsx("span", { className: "cv-sr", children: label })
          ] }) : /* @__PURE__ */ jsx("span", { className: "cv-raci-dot", "aria-hidden": "true" }) }, p3.id);
        })
      ] }, a10.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("p", { className: "cv-legend", children: [
      ["R", "A", "C", "I"].map((r3) => /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r3}`, children: r3 }),
        " ",
        LETTER[r3]
      ] }, r3)),
      projects.some((p3) => p3.tasks.some((t2) => t2.raci)) && /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("span", { className: "cv-raci-l is-R is-task", children: "R" }),
        " даалгавараар"
      ] }),
      projects.some((p3) => !p3.raci && !p3.tasks.some((t2) => t2.raci)) && /* @__PURE__ */ jsx("span", { className: "cv-raci-note", children: "Саарал багана = RACI бүртгэгдээгүй төсөл" })
    ] })
  ] });
}
function PersonProfile({ c: c9, person, onClose, themeClass = "" }) {
  const closeRef = React.useRef(null);
  React.useEffect(() => {
    const back = document.activeElement;
    closeRef.current?.focus();
    const key = (e6) => e6.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      back?.focus?.();
    };
  }, [onClose]);
  const unit = c9.units.find((u2) => u2.id === person.unitId);
  const responsible = c9.projects.map((p3) => ({ p: p3, roles: raciOf(p3, person.id) })).filter((x) => x.roles.includes("R") || x.roles.includes("A"));
  const respTasks = c9.projects.flatMap(
    (p3) => p3.tasks.map((t2) => ({ p: p3, t: t2, roles: lettersIn(t2.raci, person.id) })).filter((x) => x.roles.includes("R") || x.roles.includes("A"))
  );
  const owned = c9.agents.filter((a10) => a10.ownerId === person.id);
  const coworkers = c9.agents.filter(
    (a10) => a10.ownerId !== person.id && c9.workflows.some((w) => w.steps.some((s4) => s4.actorId === person.id) && w.steps.some((s4) => s4.actorId === a10.id))
  );
  const agents = [...owned.map((a10) => ({ a: a10, how: "эзэмшдэг" })), ...coworkers.map((a10) => ({ a: a10, how: "ажлын урсгалд хамт" }))];
  const sheet = /* @__PURE__ */ jsx("div", { className: "cv-sheet-wrap", onMouseDown: (e6) => e6.target === e6.currentTarget && onClose(), children: /* @__PURE__ */ jsxs("section", { className: "cv-sheet", role: "dialog", "aria-modal": "true", "aria-labelledby": "cv-profile-name", children: [
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
        person.cv?.length ? /* @__PURE__ */ jsx("ol", { className: "cv-cv", children: person.cv.map((e6, i3) => /* @__PURE__ */ jsxs("li", { style: { "--i": i3 }, children: [
          /* @__PURE__ */ jsx("span", { className: "cv-cv-period", children: e6.period }),
          /* @__PURE__ */ jsx("span", { className: "cv-cv-title", children: e6.title }),
          e6.org && /* @__PURE__ */ jsx("span", { className: "cv-cv-org", children: e6.org })
        ] }, e6.period + e6.title + i3)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "CV бүртгэгдээгүй." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Холбоос" }),
        person.links?.length ? /* @__PURE__ */ jsx("ul", { className: "cv-links", children: person.links.map((l2) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: l2.url, target: "_blank", rel: "noreferrer noopener", children: [
          l2.label,
          " ↗"
        ] }) }, l2.url)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Нийтийн холбоос алга." })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Хариуцсан төсөл" }),
        responsible.length ? /* @__PURE__ */ jsx("ul", { className: "cv-resp", children: responsible.map(({ p: p3, roles }) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { children: p3.name }),
          /* @__PURE__ */ jsx("span", { className: "cv-raci-cell", children: roles.map((r3) => /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r3}`, title: LETTER[r3], children: r3 }, r3)) })
        ] }, p3.id)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "R эсвэл A үүрэгтэй төсөл алга." })
      ] }),
      respTasks.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Хариуцсан даалгавар" }),
        /* @__PURE__ */ jsx("ul", { className: "cv-resp", children: respTasks.map(({ p: p3, t: t2, roles }) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsxs("span", { children: [
            t2.title,
            /* @__PURE__ */ jsx("small", { className: "cv-resp-sub", children: p3.name })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "cv-raci-cell", children: roles.map((r3) => /* @__PURE__ */ jsx("span", { className: `cv-raci-l is-${r3}`, title: LETTER[r3], children: r3 }, r3)) })
        ] }, p3.id + t2.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h4", { children: "Хамтран ажилладаг агент" }),
        agents.length ? /* @__PURE__ */ jsx("ul", { className: "cv-resp", children: agents.map(({ a: a10, how }) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsxs("span", { className: "cv-resp-agent", children: [
            /* @__PURE__ */ jsx(Avatar, { actor: { name: a10.name, kind: "agent" }, size: 22 }),
            a10.name
          ] }),
          /* @__PURE__ */ jsx("small", { children: how })
        ] }, a10.id)) }) : /* @__PURE__ */ jsx("p", { className: "cv-none", children: "Холбоотой агент алга." })
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
const COMPANY_VIEWS = ["method", "dashboard", "roles", "structure", "agents", "workflows", "raci", "decisions"];
const companyLabelsMn = {
  method: "Арга зүй",
  model: "Бизнес загвар",
  dashboard: "Самбар",
  raci: "RACI",
  structure: "Процесс",
  agents: "Хүн ба агент",
  workflows: "Ажлын урсгал",
  decisions: "Шийдвэр",
  roles: "Албан тушаалаар",
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
const levelOfKind = (k2) => k2 === "institution" ? "institution" : k2 === "company" ? "company" : "team";
const TAB_ICON = {
  method: "layout-template",
  dashboard: "layout-dashboard",
  structure: "network",
  agents: "bot",
  workflows: "workflow",
  raci: "grid-3x3",
  decisions: "git-branch",
  roles: "users-round"
};
function asOfText(iso) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d6 = new Date(iso);
  if (Number.isNaN(d6.getTime())) return iso;
  const p3 = (n2) => String(n2).padStart(2, "0");
  return `${d6.getFullYear()}-${p3(d6.getMonth() + 1)}-${p3(d6.getDate())} ${p3(d6.getHours())}:${p3(d6.getMinutes())}`;
}
function ModelView({ c: c9, scoped, L: L4 }) {
  const stats = [
    { k: L4.units, v: scoped.units.length },
    { k: L4.people, v: scoped.people.length },
    { k: L4.agents_n, v: scoped.agents.length },
    { k: L4.workflows_n, v: scoped.workflows.length },
    { k: L4.projects_n, v: scoped.projects.length }
  ];
  const cells = [
    [L4.customers, c9.model.customers],
    [L4.value, c9.model.value],
    [L4.channels, c9.model.channels],
    [L4.revenue, c9.model.revenue]
  ].filter((x) => x[1] !== null);
  return /* @__PURE__ */ jsxs("div", { className: "cv-model", children: [
    /* @__PURE__ */ jsx("dl", { className: "cv-stats", children: stats.map((s4, i3) => /* @__PURE__ */ jsxs("div", { className: "cv-stat", style: { "--i": i3 }, children: [
      /* @__PURE__ */ jsx("dt", { children: s4.k }),
      /* @__PURE__ */ jsx("dd", { children: /* @__PURE__ */ jsx(CountUp, { value: s4.v }) })
    ] }, s4.k)) }),
    /* @__PURE__ */ jsx("div", { className: "cv-canvas", children: cells.map(([k2, f4], i3) => /* @__PURE__ */ jsxs("section", { className: `cv-cell cv-cell-${i3}`, style: { "--i": i3 }, children: [
      /* @__PURE__ */ jsx("h4", { children: k2 }),
      /* @__PURE__ */ jsx(Lines, { f: f4 })
    ] }, k2)) })
  ] });
}
function StructureView({ scoped, L: L4, onPick, onPerson, current }) {
  const kids = (id) => scoped.units.filter((u2) => u2.parentId === id && u2.id !== id);
  let order = 0;
  const node = (u2, depth, seen2) => {
    if (seen2.has(u2.id)) return null;
    seen2.add(u2.id);
    const people = scoped.people.filter((p3) => p3.unitId === u2.id);
    const agents = scoped.agents.filter((a10) => a10.unitId === u2.id);
    const flows = scoped.workflows.filter((w) => w.unitId === u2.id).length;
    const ch = kids(u2.id);
    const i3 = order++;
    return /* @__PURE__ */ jsxs("li", { className: `cv-node is-${u2.kind}`, style: { "--i": i3, "--d": depth }, children: [
      /* @__PURE__ */ jsxs("div", { className: "cv-node-card", "aria-current": current === u2.id ? "true" : void 0, children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "cv-node-pick", onClick: () => onPick(u2), children: /* @__PURE__ */ jsxs("span", { className: "cv-node-top", children: [
          /* @__PURE__ */ jsx("span", { className: `cv-kind is-${u2.kind}`, children: L4[u2.kind] }),
          /* @__PURE__ */ jsx("span", { className: "cv-node-name", children: u2.name })
        ] }) }),
        /* @__PURE__ */ jsxs("span", { className: "cv-node-meta", children: [
          /* @__PURE__ */ jsxs("span", { className: "cv-faces", role: "group", "aria-label": `${people.length} ${L4.people}`, children: [
            people.slice(0, 4).map((p3) => /* @__PURE__ */ jsx("button", { type: "button", className: "cv-face", onClick: () => onPerson(p3.id), "aria-label": `${p3.name} — профайл`, title: p3.name, children: /* @__PURE__ */ jsx(Avatar, { actor: { name: p3.name, kind: "person" }, size: 20 }) }, p3.id)),
            people.length > 4 && /* @__PURE__ */ jsxs("span", { className: "cv-more", children: [
              "+",
              people.length - 4
            ] })
          ] }),
          agents.length > 0 && /* @__PURE__ */ jsxs("span", { className: "cv-pill", children: [
            "✦ ",
            agents.length,
            " ",
            L4.agents_n.toLowerCase()
          ] }),
          flows > 0 && /* @__PURE__ */ jsxs("span", { className: "cv-pill", children: [
            "↻ ",
            flows,
            " ",
            L4.workflows_n.toLowerCase()
          ] })
        ] })
      ] }),
      ch.length > 0 && /* @__PURE__ */ jsx("ul", { className: "cv-tree", children: ch.map((k2) => node(k2, depth + 1, seen2)) })
    ] }, u2.id);
  };
  const seen = /* @__PURE__ */ new Set();
  const roots = rootsOf(scoped.units);
  if (!roots.length) return /* @__PURE__ */ jsx(Empty, { text: L4.empty, icon: "network" });
  return /* @__PURE__ */ jsx("ul", { className: "cv-tree cv-tree-root", children: roots.map((r3) => node(r3, 0, seen)) });
}
function AgentCard({ a: a10, c: c9, L: L4, showOwner, focus }) {
  const owner = a10.ownerId ? actorOf(c9, a10.ownerId) : null;
  return /* @__PURE__ */ jsxs("li", { className: `cv-agent${focus ? " is-focus" : ""}`, "data-agent": a10.id, children: [
    /* @__PURE__ */ jsxs("span", { className: "cv-agent-top", children: [
      /* @__PURE__ */ jsx(Avatar, { actor: { name: a10.name, kind: "agent" }, size: 26 }),
      /* @__PURE__ */ jsxs("span", { className: "cv-agent-id", children: [
        /* @__PURE__ */ jsx("strong", { children: a10.name }),
        /* @__PURE__ */ jsx("span", { children: a10.role })
      ] })
    ] }),
    a10.skills.length > 0 && /* @__PURE__ */ jsx("span", { className: "cv-skills", children: a10.skills.map((s4) => /* @__PURE__ */ jsx("span", { className: "cv-skill", children: s4 }, s4)) }),
    /* @__PURE__ */ jsxs("span", { className: "cv-agent-foot", children: [
      showOwner && owner && /* @__PURE__ */ jsxs("span", { children: [
        L4.ownedBy,
        ": ",
        owner.name
      ] }),
      a10.memory.length > 0 ? /* @__PURE__ */ jsxs("details", { className: "cv-mem", children: [
        /* @__PURE__ */ jsxs("summary", { children: [
          a10.memory.length,
          " ",
          L4.memory
        ] }),
        /* @__PURE__ */ jsx("ul", { children: a10.memory.map((m5) => /* @__PURE__ */ jsx("li", { children: m5 }, m5)) })
      ] }) : /* @__PURE__ */ jsxs("span", { className: "cv-mem-none", children: [
        "0 ",
        L4.memory
      ] })
    ] })
  ] });
}
function AgentsView({ c: c9, scoped, L: L4, onPerson, focus }) {
  const inScope = new Set(scoped.people.map((p3) => p3.id));
  const sections = scoped.units.map((u2) => {
    const people = scoped.people.filter((p3) => p3.unitId === u2.id).map((p3) => ({ p: p3, agents: scoped.agents.filter((a10) => a10.ownerId === p3.id) }));
    const loose = scoped.agents.filter((a10) => a10.unitId === u2.id && !(a10.ownerId && inScope.has(a10.ownerId)));
    return { u: u2, people, loose };
  }).filter((s4) => s4.people.length || s4.loose.length);
  if (!sections.length) return /* @__PURE__ */ jsx(Empty, { text: L4.empty, icon: "bot" });
  return /* @__PURE__ */ jsx("div", { className: "cv-agents", children: sections.map(({ u: u2, people, loose }, i3) => /* @__PURE__ */ jsxs("section", { className: "cv-unit-block", style: { "--i": i3 }, "aria-label": u2.name, children: [
    /* @__PURE__ */ jsxs("h4", { className: "cv-unit-h", children: [
      /* @__PURE__ */ jsx("span", { className: `cv-kind is-${u2.kind}`, children: L4[u2.kind] }),
      u2.name
    ] }),
    /* @__PURE__ */ jsxs("ul", { className: "cv-pairs", children: [
      people.map(({ p: p3, agents }) => /* @__PURE__ */ jsxs("li", { className: "cv-pair", children: [
        /* @__PURE__ */ jsxs("button", { type: "button", className: "cv-person", onClick: () => onPerson(p3.id), "aria-label": `${p3.name}, ${p3.role} — профайл`, children: [
          /* @__PURE__ */ jsx(Avatar, { actor: { name: p3.name, kind: "person" }, size: 30 }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: p3.name }),
            /* @__PURE__ */ jsx("span", { children: p3.role })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: `cv-link${agents.length ? "" : " is-none"}`, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("ul", { className: "cv-agent-list", children: agents.map((a10) => /* @__PURE__ */ jsx(AgentCard, { a: a10, c: c9, L: L4, focus: focus === a10.id }, a10.id)) })
      ] }, p3.id)),
      loose.length > 0 && /* @__PURE__ */ jsxs("li", { className: "cv-pair is-loose", children: [
        /* @__PURE__ */ jsxs("span", { className: "cv-person is-unit", children: [
          /* @__PURE__ */ jsx("span", { className: "cv-ava is-unit", style: { "--s": "30px" }, "aria-hidden": "true", children: "◇" }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: L4.noOwner }),
            /* @__PURE__ */ jsx("span", { children: u2.name })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "cv-link", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("ul", { className: "cv-agent-list", children: loose.map((a10) => /* @__PURE__ */ jsx(AgentCard, { a: a10, c: c9, L: L4, showOwner: true, focus: focus === a10.id }, a10.id)) })
      ] })
    ] })
  ] }, u2.id)) });
}
function WorkflowView({ c: c9, scoped, L: L4 }) {
  if (!scoped.workflows.length) return /* @__PURE__ */ jsx(Empty, { text: L4.empty, icon: "workflow" });
  return /* @__PURE__ */ jsxs("div", { className: "cv-flows", children: [
    scoped.workflows.map((w, i3) => {
      const unit = c9.units.find((u2) => u2.id === w.unitId);
      return /* @__PURE__ */ jsxs("article", { className: "cv-flow", style: { "--i": i3 }, "aria-label": w.name, children: [
        /* @__PURE__ */ jsxs("header", { className: "cv-flow-head", children: [
          /* @__PURE__ */ jsx("strong", { children: w.name }),
          unit && /* @__PURE__ */ jsx("span", { className: "cv-flow-unit", children: unit.name }),
          /* @__PURE__ */ jsxs("span", { className: "cv-trigger", title: L4.trigger, children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "⚡" }),
            " ",
            w.trigger
          ] })
        ] }),
        /* @__PURE__ */ jsx("ol", { className: "cv-steps", style: { "--n": w.steps.length }, children: w.steps.map((s4, j3) => {
          const actor = actorOf(c9, s4.actorId);
          const next = w.steps[j3 + 1];
          const gate = next && actorOf(c9, next.actorId).kind === "person";
          return /* @__PURE__ */ jsxs("li", { className: `cv-step is-${actor.kind}${gate ? " gate-next" : ""}`, style: { "--j": j3 }, children: [
            /* @__PURE__ */ jsx("span", { className: "cv-step-n", children: String(j3 + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx("span", { className: "cv-step-label", children: s4.label }),
            /* @__PURE__ */ jsxs("span", { className: "cv-step-actor", children: [
              /* @__PURE__ */ jsx(Avatar, { actor, size: 20 }),
              /* @__PURE__ */ jsx("span", { children: actor.name }),
              /* @__PURE__ */ jsxs("span", { className: "cv-sr", children: [
                ", ",
                actor.kind === "agent" ? L4.agent : L4.person
              ] })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "cv-step-out", children: [
              "↳ ",
              s4.output
            ] })
          ] }, s4.id);
        }) })
      ] }, w.id);
    }),
    /* @__PURE__ */ jsxs("p", { className: "cv-legend", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("span", { className: "cv-legend-line" }),
      " ",
      L4.sequence,
      /* @__PURE__ */ jsx("span", { className: "cv-legend-line is-gate" }),
      " ",
      L4.approval,
      /* @__PURE__ */ jsx("span", { className: "cv-ava is-person", style: { "--s": "16px" }, children: "А" }),
      " ",
      L4.person,
      /* @__PURE__ */ jsx("span", { className: "cv-ava is-agent", style: { "--s": "16px" }, children: "✦" }),
      " ",
      L4.agent
    ] })
  ] });
}
function DecisionsView({ scoped, L: L4 }) {
  const decisions = scoped.projects.flatMap((p3) => p3.decisions.map((d6) => ({ id: `${p3.id}:${d6.id}`, title: d6.title, project: p3.name, due: d6.date, options: [{ id: "made", label: "Шийдсэн" }] }))).sort((a10, b7) => (b7.due ?? "").localeCompare(a10.due ?? ""));
  if (!decisions.length) return /* @__PURE__ */ jsx(Empty, { text: L4.empty, icon: "git-branch" });
  return /* @__PURE__ */ jsx("div", { className: "cv-decisions", children: /* @__PURE__ */ jsx(
    DecisionInboxChat,
    {
      title: `${L4.decisions} · ${decisions.length}`,
      decisions,
      chosen: Object.fromEntries(decisions.map((d6) => [d6.id, "made"])),
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
  views,
  role: roleProp,
  onRoleChange,
  onScopeChange,
  labels: labelsProp,
  className = "",
  density = "full",
  previewLabels
}) {
  const L4 = { ...companyLabelsMn, ...labelsProp };
  const uid = React.useId();
  const available = LEVELS.filter((lv) => company.units.some((u2) => kindsOf[lv].includes(u2.kind)));
  const firstUnit = (lv) => company.units.find((u2) => kindsOf[lv].includes(u2.kind)) ?? null;
  const initial = (() => {
    const u2 = company.units.find((x) => x.id === defaultUnitId);
    if (u2) return { level: levelOfKind(u2.kind), unitId: u2.id };
    const lv = defaultLevel && available.includes(defaultLevel) ? defaultLevel : available[0] ?? "company";
    return { level: lv, unitId: firstUnit(lv)?.id ?? null };
  })();
  const [scope, setScopeState] = React.useState(initial);
  const shownViews = React.useMemo(() => {
    const list = (views ?? COMPANY_VIEWS).filter((v, i3, a10) => COMPANY_VIEWS.includes(v) && a10.indexOf(v) === i3);
    return list.length ? list : COMPANY_VIEWS;
  }, [views]);
  const [viewRaw, setView] = React.useState(viewProp ?? (roleProp ? "roles" : defaultView));
  const [roleId, setRoleId] = React.useState(() => findPerson(company, roleProp)?.id);
  React.useEffect(() => {
    const p3 = findPerson(company, roleProp);
    if (p3) setRoleId(p3.id);
  }, [company, roleProp]);
  const view = shownViews.includes(viewRaw) ? viewRaw : shownViews[0];
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
  const setCollectionType = (t2) => {
    setCollectionOwn(t2);
    if (t2 !== collectionType) onCollectionChange?.(t2);
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
    const tab = tabsRef.current[shownViews.indexOf(view)];
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
    const byId = (id) => company.units.find((u2) => u2.id === id);
    let up = byId(scope.unitId ?? void 0);
    for (let guard = 0; up && guard < 50 && !kinds.includes(up.kind); guard++) up = byId(up.parentId);
    const down = scopeCompany(company, scope.unitId).units.find((u2) => kinds.includes(u2.kind));
    setScope({ level: lv, unitId: (up && kinds.includes(up.kind) ? up : down ?? firstUnit(lv))?.id ?? null });
  };
  const pickUnit = (u2) => {
    setCollectionType(null);
    setScope({ level: u2.kind === "area" ? scope.level : levelOfKind(u2.kind), unitId: u2.id });
  };
  const setLayout = (l2) => {
    setLayoutOwn(l2);
    onLayoutChange?.(l2);
  };
  const setMethodology = (m5) => {
    setMethodOwn(m5);
    onMethodologyChange?.(m5);
  };
  const closeProfile = React.useCallback(() => setPersonId(null), []);
  React.useEffect(() => {
    if (scope.unitId && !company.units.some((u2) => u2.id === scope.unitId)) setScopeState(initial);
  }, [company.units, scope.unitId]);
  const scoped = scopeCompany(company, scope.unitId);
  const unit = company.units.find((u2) => u2.id === scope.unitId) ?? null;
  const path = [];
  for (let u2 = unit, guard = 0; u2 && guard < 20; u2 = company.units.find((x) => x.id === u2.parentId) ?? null, guard++) path.unshift(u2);
  const levelUnits = company.units.filter((u2) => kindsOf[scope.level].includes(u2.kind));
  const counts = {
    method: null,
    dashboard: scoped.projects.length,
    structure: scoped.units.length,
    agents: scoped.agents.length,
    workflows: scoped.workflows.length,
    raci: scoped.projects.filter((p3) => p3.raci).length,
    decisions: scoped.projects.reduce((n2, p3) => n2 + p3.decisions.length, 0),
    roles: company.people.length
  };
  const tabLabel = (v) => v === "method" ? methodologyShort[methodology] : L4[v];
  const person = company.people.find((p3) => p3.id === personId) ?? null;
  const collections = company.collections ?? [];
  const collection = collections.find((c9) => c9.type === collectionType) ?? null;
  const resolve = (field, raw) => {
    const v = raw.replace(/^\[\[|\]\]$/g, "").split("|")[0].split("/").pop()?.replace(/\.md$/, "") ?? raw;
    const lc = v.trim().toLowerCase();
    const f4 = field.toLowerCase();
    const unitHit = company.units.find((u2) => u2.id === raw || u2.name === v);
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
    if (f4 === "company") return { label: v, icon: "building-2" };
    if (f4.includes("area")) return { label: v, icon: "layout-grid" };
    if (["owner", "assignee", "person", "people", "manager", "author", "agent"].includes(f4)) return { label: v, plain: true };
    return null;
  };
  const segmentText = company.segmentLabel ?? L4.segment[company.segment] ?? company.segment;
  function openAgent(id) {
    const a10 = company.agents.find((x) => x.id === id);
    const u2 = a10 && company.units.find((x) => x.id === a10.unitId);
    if (u2) pickUnit(u2);
    else setCollectionType(null);
    setView("agents");
    setFocusAgent(id);
  }
  React.useEffect(() => {
    if (!focusAgent || view !== "agents" || collectionType) return;
    const el = rootRef.current?.querySelector(`[data-agent="${typeof CSS !== "undefined" && CSS.escape ? CSS.escape(focusAgent) : focusAgent}"]`);
    el?.scrollIntoView?.({ block: "center", behavior: "smooth" });
    const t2 = setTimeout(() => setFocusAgent(null), 2400);
    return () => clearTimeout(t2);
  }, [focusAgent, view, collectionType]);
  const scopeName = unit?.name ?? company.name;
  const render = (v) => v === "method" ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MethodologyView, { c: company, scoped, methodology, today, hideEmpty: hideEmptyBlocks }),
    methodology === "okr" && /* @__PURE__ */ jsxs("section", { className: "cv-sub", "aria-label": L4.model, children: [
      /* @__PURE__ */ jsx("h4", { className: "cv-below-h", children: L4.model }),
      /* @__PURE__ */ jsx(ModelView, { c: company, scoped, L: L4 })
    ] })
  ] }) : v === "dashboard" ? /* @__PURE__ */ jsx(Dashboard, { c: company, scoped, today, empty: L4.empty }, scope.unitId ?? "all") : v === "structure" ? /* @__PURE__ */ jsx(StructureView, { scoped, L: L4, onPick: pickUnit, onPerson: setPersonId, current: scope.unitId }) : v === "agents" ? /* @__PURE__ */ jsx(AgentsView, { c: company, scoped, L: L4, onPerson: setPersonId, focus: focusAgent }) : v === "workflows" ? /* @__PURE__ */ jsx(WorkflowView, { c: company, scoped, L: L4 }) : v === "raci" ? /* @__PURE__ */ jsx(RaciView, { c: company, scoped, onPerson: setPersonId, empty: "RACI бүртгэгдээгүй." }) : v === "roles" ? company.people.length ? /* @__PURE__ */ jsx(
    RoleDashboard,
    {
      company,
      personId: roleId ?? company.people[0].id,
      onPersonChange: (id) => {
        setRoleId(id);
        onRoleChange?.(id);
      },
      today,
      bare: true
    }
  ) : /* @__PURE__ */ jsx(Empty, { text: "Албан тушаал бүртгэгдээгүй.", icon: "users-round" }) : /* @__PURE__ */ jsx(DecisionsView, { scoped, L: L4 });
  const levelSwitch = /* @__PURE__ */ jsx("div", { className: "cv-seg", role: "radiogroup", "aria-label": L4.level, children: LEVELS.map((lv) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      role: "radio",
      "aria-checked": scope.level === lv,
      disabled: !available.includes(lv),
      "data-active": scope.level === lv || void 0,
      onClick: () => pickLevel(lv),
      children: L4[lv]
    },
    lv
  )) });
  const methodSwitch = showMethodologySwitch && /* @__PURE__ */ jsx("div", { className: "cv-seg cv-method-switch", role: "radiogroup", "aria-label": L4.methodology, children: METHODOLOGIES.map((m5) => /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      role: "radio",
      "aria-checked": methodology === m5,
      "data-active": methodology === m5 || void 0,
      title: methodologyName[m5],
      onClick: () => setMethodology(m5),
      children: methodologyShort[m5]
    },
    m5
  )) });
  const layoutSwitch = showLayoutSwitch && /* @__PURE__ */ jsx("div", { className: "cv-seg cv-tpl", role: "radiogroup", "aria-label": L4.layout, children: ["workspace", "brief"].map((t2) => /* @__PURE__ */ jsx("button", { type: "button", role: "radio", "aria-checked": layout === t2, "data-active": layout === t2 || void 0, onClick: () => setLayout(t2), children: L4[t2] }, t2)) });
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
  const unitChips = /* @__PURE__ */ jsx("div", { className: "cv-chips cv-unit-chips", role: "group", "aria-label": L4[scope.level], children: levelUnits.map((u2) => /* @__PURE__ */ jsx("button", { type: "button", "aria-pressed": u2.id === scope.unitId, onClick: () => pickUnit(u2), children: u2.name }, u2.id)) });
  const tags = /* @__PURE__ */ jsxs("span", { className: "cv-tags", children: [
    unit && /* @__PURE__ */ jsxs("span", { className: `cv-kind is-${unit.kind}`, children: [
      /* @__PURE__ */ jsx(Icon, { name: UNIT_ICON[unit.kind] ?? "building-2", size: 14 }),
      L4[unit.kind]
    ] }),
    segmentText !== (unit ? L4[unit.kind] : "") && /* @__PURE__ */ jsx("span", { className: "cv-tag", children: segmentText }),
    /* @__PURE__ */ jsx("span", { className: "cv-tag is-src", children: L4.source[company.source] ?? company.source })
  ] });
  const asOf = company.exportedAt ? /* @__PURE__ */ jsxs("p", { className: "cv-asof", children: [
    /* @__PURE__ */ jsx(Icon, { name: "clock", size: 14 }),
    L4.exportedAt,
    ": ",
    /* @__PURE__ */ jsx("time", { dateTime: company.exportedAt, children: asOfText(company.exportedAt) })
  ] }) : null;
  if (density === "preview")
    return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `cv ${className}`, "data-density": "preview", children: [
      /* @__PURE__ */ jsx("style", { children: css$3 + companyMiniCss }),
      /* @__PURE__ */ jsx(CompanyMini, { company, today, labels: previewLabels, badge: segmentText })
    ] });
  if (layout === "brief") {
    return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `cv ${className}`, "data-template": "brief", "data-methodology": methodology, children: [
      /* @__PURE__ */ jsx("style", { children: css$3 }),
      /* @__PURE__ */ jsxs("div", { className: "cv-brief", children: [
        /* @__PURE__ */ jsxs("header", { className: "cv-hero", children: [
          /* @__PURE__ */ jsxs("div", { className: "cv-hero-top", children: [
            /* @__PURE__ */ jsxs("span", { className: "cv-eyebrow", children: [
              company.name,
              path.length > 1 && ` / ${path.slice(1).map((u2) => u2.name).join(" / ")}`
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
        shownViews.map((v, i3) => /* @__PURE__ */ jsxs("section", { className: "cv-section", "aria-labelledby": `${uid}-${v}`, style: { "--i": i3 }, children: [
          /* @__PURE__ */ jsxs("h3", { id: `${uid}-${v}`, className: "cv-section-h", children: [
            /* @__PURE__ */ jsx("span", { className: "cv-num", children: String(i3 + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx(Icon, { name: TAB_ICON[v], size: 20 }),
            v === "method" ? methodologyName[methodology] : L4[v],
            counts[v] != null && /* @__PURE__ */ jsx("span", { className: "cv-count", children: counts[v] })
          ] }),
          render(v)
        ] }, v)),
        collections.length > 0 && /* @__PURE__ */ jsxs("section", { className: "cv-section", "aria-labelledby": `${uid}-types`, children: [
          /* @__PURE__ */ jsxs("h3", { id: `${uid}-types`, className: "cv-section-h", children: [
            /* @__PURE__ */ jsx("span", { className: "cv-num", children: String(shownViews.length + 1).padStart(2, "0") }),
            /* @__PURE__ */ jsx(Icon, { name: "database", size: 20 }),
            L4.types,
            /* @__PURE__ */ jsx("span", { className: "cv-count", children: collections.length })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "cv-chips cv-type-chips", role: "group", "aria-label": L4.types, children: collections.map((c9) => /* @__PURE__ */ jsxs("button", { type: "button", "aria-pressed": (collection ?? collections[0]).type === c9.type, onClick: () => setCollectionType(c9.type), children: [
            /* @__PURE__ */ jsx(Icon, { name: typeIcon(c9.type), size: 14 }),
            c9.label ?? typeLabel(c9.type),
            " ",
            /* @__PURE__ */ jsx("span", { children: c9.items.length })
          ] }, c9.type)) }),
          /* @__PURE__ */ jsx(CollectionView, { collection: collection ?? collections[0], today, resolve, siblings: collections, onOpenInVault, onAskAgent }, (collection ?? collections[0]).type)
        ] })
      ] }),
      profile
    ] });
  }
  const roots = rootsOf(company.units);
  const tree = (parent, depth, seen = /* @__PURE__ */ new Set()) => {
    const list = (parent ? company.units.filter((u2) => u2.parentId === parent) : roots).filter((u2) => !seen.has(u2.id));
    if (!list.length) return null;
    return /* @__PURE__ */ jsx("ul", { className: "cv-nav-list", children: list.map((u2) => {
      seen.add(u2.id);
      const inScope = scoped.units.some((x) => x.id === u2.id);
      return /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "cv-nav-item",
            style: { "--d": depth },
            "aria-current": u2.id === scope.unitId && !collection ? "true" : void 0,
            "data-in": inScope || void 0,
            onClick: () => pickUnit(u2),
            children: [
              /* @__PURE__ */ jsx("span", { className: `cv-nav-glyph is-${u2.kind}`, children: /* @__PURE__ */ jsx(Icon, { name: UNIT_ICON[u2.kind] ?? "building-2", size: 16 }) }),
              /* @__PURE__ */ jsx("span", { className: "cv-nav-name", children: u2.name })
            ]
          }
        ),
        tree(u2.id, depth + 1, seen)
      ] }, u2.id);
    }) });
  };
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `cv ${className}`, "data-template": "workspace", "data-methodology": methodology, children: [
    /* @__PURE__ */ jsx("style", { children: css$3 }),
    /* @__PURE__ */ jsxs("div", { className: `cv-ws${showTree ? "" : " no-tree"}`, children: [
      showTree && /* @__PURE__ */ jsxs("aside", { className: "cv-side", "aria-label": company.name, children: [
        /* @__PURE__ */ jsxs("div", { className: "cv-brand", children: [
          /* @__PURE__ */ jsx("span", { className: "cv-brand-mark", "aria-hidden": "true", children: initials(company.name).charAt(0) }),
          /* @__PURE__ */ jsxs("span", { className: "cv-brand-text", children: [
            /* @__PURE__ */ jsx("strong", { children: company.name }),
            /* @__PURE__ */ jsxs("small", { children: [
              segmentText,
              " · ",
              L4.source[company.source] ?? company.source
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "cv-side-level", children: levelSwitch }),
        /* @__PURE__ */ jsx("nav", { className: "cv-nav", "aria-label": L4.units, children: tree(void 0, 0) }),
        /* @__PURE__ */ jsx("div", { className: "cv-side-chips", children: unitChips }),
        collections.length > 0 && /* @__PURE__ */ jsxs("nav", { className: "cv-types", "aria-label": L4.types, children: [
          /* @__PURE__ */ jsxs("h4", { className: "cv-types-h", children: [
            /* @__PURE__ */ jsx(Icon, { name: "database", size: 14 }),
            L4.types
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "cv-nav-list", children: collections.map((c9) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "cv-nav-item",
              "aria-current": collectionType === c9.type ? "true" : void 0,
              onClick: () => setCollectionType(c9.type),
              children: [
                /* @__PURE__ */ jsx(TypeBadge, { type: c9.type, size: 18 }),
                /* @__PURE__ */ jsx("span", { className: "cv-nav-name", children: c9.label ?? typeLabel(c9.type) }),
                /* @__PURE__ */ jsx("span", { className: "cv-nav-count", children: c9.items.length })
              ]
            }
          ) }, c9.type)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "cv-main", children: [
        /* @__PURE__ */ jsxs("header", { className: "cv-head", children: [
          /* @__PURE__ */ jsxs("div", { className: "cv-head-top", children: [
            /* @__PURE__ */ jsxs("nav", { className: "cv-crumbs", "aria-label": L4.level, children: [
              path.map((u2, i3) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
                i3 > 0 && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
                /* @__PURE__ */ jsx("button", { type: "button", onClick: () => pickUnit(u2), "aria-current": i3 === path.length - 1 && !collection ? "page" : void 0, children: u2.name })
              ] }, u2.id)),
              collection && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "/" }),
                /* @__PURE__ */ jsx("span", { children: L4.types }),
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
              "aria-label": L4.views,
              onKeyDown: (e6) => {
                if (e6.key !== "ArrowRight" && e6.key !== "ArrowLeft") return;
                e6.preventDefault();
                const at = shownViews.indexOf(view);
                const n2 = (at + (e6.key === "ArrowRight" ? 1 : -1) + shownViews.length) % shownViews.length;
                setView(shownViews[n2]);
                tabsRef.current[n2]?.focus();
              },
              children: shownViews.map((v, i3) => /* @__PURE__ */ jsxs(
                "button",
                {
                  ref: (el) => {
                    tabsRef.current[i3] = el;
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
const css$3 = baseCss + dashboardCss + raciCss + methodologyCss + collectionCss;
function CollectionPanel({ className = "", ...props }) {
  return /* @__PURE__ */ jsxs("div", { className: `cv cv-standalone ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css$3 }),
    /* @__PURE__ */ jsx(CollectionView, { ...props })
  ] });
}
function Replay({ children, label = "Дахин тоглуулах", onReplay, showButton = true, placement = "inside", className = "", style }) {
  const [run, setRun] = React.useState(0);
  return /* @__PURE__ */ jsxs("div", { className: `ts-replay ${className}`, style, "data-run": run, "data-placement": showButton ? placement : void 0, children: [
    /* @__PURE__ */ jsx("style", { children: css$2 }),
    showButton && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "ts-replay-btn",
        "aria-label": label,
        title: label,
        onClick: () => {
          setRun((n2) => n2 + 1);
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
const css$2 = `
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
function seeded(seed) {
  let a10 = seed >>> 0;
  return () => {
    a10 = a10 + 1831565813 >>> 0;
    let t2 = a10;
    t2 = Math.imul(t2 ^ t2 >>> 15, t2 | 1);
    t2 ^= t2 + Math.imul(t2 ^ t2 >>> 7, t2 | 61);
    return ((t2 ^ t2 >>> 14) >>> 0) / 4294967296;
  };
}
const r2 = (v) => Math.round(v * 10) / 10;
function layoutBrain(clusters, links, seed = 7) {
  const rand = seeded(seed);
  const dots = [];
  const lines = [];
  const byCluster = /* @__PURE__ */ new Map();
  for (const c9 of clusters) {
    const at = c9.at ?? 0;
    const span = c9.span ?? 0.2;
    const tone = c9.tone ?? "branch";
    const list = [];
    for (let i3 = 0; i3 < c9.n; i3++) {
      const rr = c9.n === 1 ? 0 : c9.r * Math.sqrt((i3 + 0.5) / c9.n);
      const a10 = i3 * 2.39996 + (rand() - 0.5) * 0.5;
      const j3 = c9.n === 1 ? 0 : (rand() - 0.5) * c9.r * 0.12;
      list.push({ key: `${c9.id}-${i3}`, x: r2(c9.x + Math.cos(a10) * rr + j3), y: r2(c9.y + Math.sin(a10) * rr + j3), at: at + span * i3 / Math.max(1, c9.n), tone });
    }
    const steps = c9.n > 20 ? [8, 13] : c9.n > 6 ? [3, 5] : [1];
    list.forEach(
      (d6, i3) => steps.forEach((s4) => {
        const e6 = list[i3 + s4];
        if (e6) lines.push({ key: `${d6.key}~${e6.key}`, x1: d6.x, y1: d6.y, x2: e6.x, y2: e6.y, at: Math.max(d6.at, e6.at) + 0.04, cross: false });
      })
    );
    dots.push(...list);
    byCluster.set(c9.id, list);
  }
  const centre = new Map(clusters.map((c9) => [c9.id, c9]));
  for (const l2 of links) {
    const a10 = centre.get(l2.from);
    const b7 = centre.get(l2.to);
    const da = byCluster.get(l2.from);
    const db = byCluster.get(l2.to);
    if (!a10 || !b7 || !da || !db) continue;
    const at = l2.at ?? 0;
    if (!l2.strands) {
      const len = Math.hypot(b7.x - a10.x, b7.y - a10.y) || 1;
      const ux = (b7.x - a10.x) / len;
      const uy = (b7.y - a10.y) / len;
      lines.push({ key: `${l2.from}=${l2.to}`, x1: r2(a10.x + ux * (a10.r + 4)), y1: r2(a10.y + uy * (a10.r + 4)), x2: r2(b7.x - ux * (b7.r + 4)), y2: r2(b7.y - uy * (b7.r + 4)), at, cross: true });
      continue;
    }
    const facing = (list, tx, ty) => [...list].sort((p3, q2) => Math.hypot(p3.x - tx, p3.y - ty) - Math.hypot(q2.x - tx, q2.y - ty)).slice(0, Math.max(3, l2.strands * 2));
    const fa = facing(da, b7.x, b7.y);
    const fb = facing(db, a10.x, a10.y);
    for (let s4 = 0; s4 < l2.strands; s4++) {
      const p3 = fa[Math.floor(rand() * fa.length)];
      const q2 = fb[Math.floor(rand() * fb.length)];
      lines.push({ key: `${l2.from}=${l2.to}-${s4}`, x1: p3.x, y1: p3.y, x2: q2.x, y2: q2.y, at: at + s4 * 0.025, cross: true });
    }
  }
  return { dots, lines };
}
const reduced = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function useBrainProgress(progress, duration = 4200, steps = 14) {
  const [tick, setTick] = React.useState(0);
  const external = progress !== void 0;
  React.useEffect(() => {
    if (external) return;
    if (reduced()) {
      setTick(steps);
      return;
    }
    let n2 = 0;
    const id = window.setInterval(() => {
      n2 += 1;
      setTick(n2);
      if (n2 >= steps) window.clearInterval(id);
    }, Math.min(duration, 5e3) / steps);
    return () => window.clearInterval(id);
  }, [external, duration, steps]);
  return external ? Math.min(1, Math.max(0, progress)) : tick / steps;
}
function BrainField({ clusters, links, progress, seed = 7, height = 320, label, className = "" }) {
  const { dots, lines } = React.useMemo(() => layoutBrain(clusters, links, seed), [clusters, links, seed]);
  return /* @__PURE__ */ jsxs("svg", { className: `bf ${className}`, viewBox: `0 0 400 ${height}`, role: "img", "aria-label": label, children: [
    /* @__PURE__ */ jsx("g", { className: "bf-lines", children: lines.map((l2) => /* @__PURE__ */ jsx("line", { x1: l2.x1, y1: l2.y1, x2: l2.x2, y2: l2.y2, className: l2.cross ? "bf-cross" : "bf-in", "data-on": progress >= l2.at || void 0 }, l2.key)) }),
    /* @__PURE__ */ jsx("g", { className: "bf-dots", children: dots.map((d6) => /* @__PURE__ */ jsx("circle", { cx: d6.x, cy: d6.y, r: d6.tone === "leaf" ? 4 : d6.tone === "core" ? 2.4 : 2, className: `bf-${d6.tone}`, "data-on": progress >= d6.at || void 0 }, d6.key)) })
  ] });
}
function brainCounts(clusters, links, progress, seed = 7) {
  const { dots, lines } = layoutBrain(clusters, links, seed);
  return { memories: dots.filter((d6) => progress >= d6.at).length, links: lines.filter((l2) => progress >= l2.at).length };
}
const brainFieldCss = `
.bf{display:block;width:100%;height:auto;overflow:visible}
.bf line{stroke-width:1;vector-effect:non-scaling-stroke;opacity:0;transition:opacity .5s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.bf .bf-in{stroke:var(--bf-link,var(--ts-muted,#65656d))}
.bf .bf-cross{stroke:var(--bf-cross,var(--ts-accent,#4f7cf0))}
.bf line[data-on]{opacity:.32}
.bf .bf-cross[data-on]{opacity:.6}
.bf circle{opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.4);transition:opacity .45s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)),transform .45s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.bf circle[data-on]{opacity:1;transform:none}
.bf .bf-core{fill:var(--bf-core,var(--ts-accent,#4f7cf0))}
.bf .bf-branch{fill:var(--bf-branch,var(--ts-fg,#18181b))}
.bf .bf-branch[data-on]{opacity:.7}
.bf .bf-leaf{fill:var(--bf-surface,var(--ts-surface,#fff));stroke:var(--bf-core,var(--ts-accent,#4f7cf0));stroke-width:2;vector-effect:non-scaling-stroke}
@media(prefers-reduced-motion:reduce){.bf line,.bf circle{transition:none}}
`;
const defaultLabels$1 = { picture: "Нэг тархи, түүнээс салбарласан хэсгүүд ба агентууд" };
const brainMapDemo = {
  title: "Танай компанийн нэг тархи",
  caption: "Санамж бүр нэг газар, агент бүр түүнээс уншиж, бодлоо ил гаргана.",
  core: "Тархи",
  branches: [
    {
      id: "memory",
      label: "Санах ой",
      agents: [
        { id: "m1", name: "Тэмдэглэгч", job: "Уулзалт бүрээс санамж бичнэ" },
        { id: "m2", name: "Холбогч", job: "Шинэ санамжийг хуучинтай холбоно" }
      ]
    },
    {
      id: "agents",
      label: "Агентууд",
      agents: [
        { id: "a1", name: "Борлуулалтын агент", job: "Сонирхогчдод санал бэлдэнэ" },
        { id: "a2", name: "Санхүүгийн агент", job: "Гүйлгээг сар бүр тулгана" }
      ]
    },
    {
      id: "thought",
      label: "Бодол",
      agents: [
        { id: "t1", name: "Тайлбарлагч", job: "Хариу бүрт эх сурвалжаа заана" },
        { id: "t2", name: "Шалгагч", job: "Шийдвэрийг хүнд батлуулна" }
      ]
    }
  ]
};
const CX$1 = 200;
const CY$1 = 158;
function geometry$1(branches) {
  const n2 = branches.length;
  const start = -90 - 180 / n2;
  const clusters = [{ id: "core", x: CX$1, y: CY$1, r: 46, n: 48, tone: "core", at: 0, span: 0.26 }];
  const links = [];
  const places = [];
  branches.forEach((b7, i3) => {
    const ang = (start + 360 / n2 * i3) * Math.PI / 180;
    const x = Math.round(CX$1 + Math.cos(ang) * 128);
    const y = Math.round(CY$1 + Math.sin(ang) * 108);
    const at = 0.3 + i3 * 0.09;
    clusters.push({ id: b7.id, x, y, r: 22, n: 15, tone: "branch", at, span: 0.12 });
    links.push({ from: "core", to: b7.id, at: at - 0.02, strands: 3 });
    const agents = b7.agents.slice(0, 3).map((a10, k2, all) => {
      const off = (k2 - (all.length - 1) / 2) * 38 * Math.PI / 180;
      const aat = 0.64 + i3 * 0.08 + k2 * 0.04;
      const id = `${b7.id}:${a10.id}`;
      clusters.push({ id, x: Math.round(x + Math.cos(ang + off) * 44), y: Math.round(y + Math.sin(ang + off) * 40), r: 0, n: 1, tone: "leaf", at: aat, span: 0 });
      links.push({ from: b7.id, to: id, at: aat - 0.02 });
      return { id: a10.id, at: aat };
    });
    places.push({ id: b7.id, x: Math.round(x - Math.cos(ang) * 36), y: Math.round(y - Math.sin(ang) * 32), at, agents });
  });
  return { clusters, links, places };
}
function BrainMap({ progress: progressProp, seed = 11, labels: labelsProp, className = "", ...data }) {
  const L4 = { ...defaultLabels$1, ...labelsProp };
  const d6 = { ...brainMapDemo, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== void 0)) };
  const uid = React.useId();
  const geo = React.useMemo(() => geometry$1(d6.branches), [d6.branches]);
  const p3 = useBrainProgress(progressProp);
  return /* @__PURE__ */ jsxs("section", { className: `bm ${className}`, "aria-labelledby": d6.title ? `${uid}-h` : void 0, "aria-label": d6.title ? void 0 : L4.picture, children: [
    /* @__PURE__ */ jsx("style", { children: brainFieldCss + css$1 }),
    (d6.title || d6.caption) && /* @__PURE__ */ jsxs("header", { className: "bm-head", children: [
      d6.title && /* @__PURE__ */ jsx("h3", { id: `${uid}-h`, className: "bm-title", children: d6.title }),
      d6.caption && /* @__PURE__ */ jsx("p", { className: "bm-cap", children: d6.caption })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bm-stage", children: [
      /* @__PURE__ */ jsx(BrainField, { clusters: geo.clusters, links: geo.links, progress: p3, seed, label: L4.picture }),
      /* @__PURE__ */ jsx("span", { className: "bm-mark is-core", style: { left: `${CX$1 / 400 * 100}%`, top: `${CY$1 / 320 * 100}%` }, "data-on": true, children: d6.core }),
      geo.places.map((pl, i3) => /* @__PURE__ */ jsx("span", { className: "bm-mark", style: { left: `${pl.x / 400 * 100}%`, top: `${pl.y / 320 * 100}%` }, "data-on": p3 >= pl.at + 0.06 || void 0, children: d6.branches[i3].label }, pl.id))
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "bm-legend", children: d6.branches.map((b7, i3) => /* @__PURE__ */ jsxs("li", { className: "bm-col", "data-on": p3 >= geo.places[i3].at + 0.06 || void 0, children: [
      /* @__PURE__ */ jsxs("span", { className: "bm-col-h", children: [
        /* @__PURE__ */ jsx("span", { className: "bm-n", children: String(i3 + 1).padStart(2, "0") }),
        b7.label
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "bm-agents", children: b7.agents.slice(0, 3).map((a10, k2) => /* @__PURE__ */ jsxs("li", { className: "bm-agent", "data-on": p3 >= geo.places[i3].agents[k2].at || void 0, children: [
        /* @__PURE__ */ jsx("span", { className: "bm-dot", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("b", { children: a10.name }),
          /* @__PURE__ */ jsx("span", { className: "bm-job", children: a10.job })
        ] })
      ] }, a10.id)) })
    ] }, b7.id)) })
  ] });
}
const css$1 = `
.bm{--bm-fg:var(--ts-fg,#18181b);--bm-muted:var(--ts-muted,#65656d);--bm-line:var(--ts-line,#ececef);--bm-surface:var(--ts-surface,#fff);--bm-accent:var(--ts-accent,#4f7cf0);--bm-accent-soft:var(--ts-accent-soft,#e8f1fe);--bm-accent-text:var(--ts-accent-strong,#1b5cff);width:100%;max-width:880px;margin:0 auto;color:var(--bm-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);box-sizing:border-box;container-type:inline-size}
:where(.dark,[data-theme=dark]) .bm{--bm-fg:var(--ts-fg,#ececef);--bm-muted:var(--ts-muted,#a1a1aa);--bm-line:var(--ts-line,#2e2e33);--bm-surface:var(--ts-surface,#1b1b1e);--bm-accent:var(--ts-accent,#7c9cff);--bm-accent-soft:var(--ts-accent-soft,#1b2a44);--bm-accent-text:var(--ts-accent,#7c9cff);color-scheme:dark}
.bm *{box-sizing:border-box}
.bm .bf{--bf-surface:var(--bm-surface);--bf-branch:var(--bm-fg)}
.bm-head{text-align:center;max-width:560px;margin:0 auto 8px}
.bm-title{margin:0;font:var(--ts-head-weight,600) clamp(22px,5.2cqi,36px)/1.15 var(--ts-font-display,inherit);letter-spacing:var(--ts-head-tracking,-.01em)}
.bm-cap{margin:8px 0 0;color:var(--bm-muted);font-size:15px}
.bm-stage{position:relative;max-width:640px;margin:0 auto}
.bm-mark{position:absolute;transform:translate(-50%,-50%) scale(.92);padding:3px 10px;border:1px solid var(--bm-line);border-radius:var(--ts-radius-pill,999px);background:var(--bm-surface);font-size:13px;font-weight:600;white-space:nowrap;opacity:0;transition:opacity .4s,transform .4s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.bm-mark[data-on]{opacity:1;transform:translate(-50%,-50%)}
.bm-mark.is-core{padding:5px 14px;border-color:color-mix(in srgb,var(--bm-accent) 40%,var(--bm-line));color:var(--bm-accent-text);font-size:15px}
.bm-legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px 20px;margin:16px 0 0;padding:0;list-style:none}
.bm-col{padding-top:10px;border-top:1px solid var(--bm-line);opacity:0;transition:opacity .4s}
.bm-col[data-on]{opacity:1}
.bm-col-h{display:flex;align-items:center;gap:8px;font-weight:600}
.bm-n{font:500 12px/1 var(--ts-font-mono,ui-monospace,monospace);color:var(--bm-muted)}
.bm-agents{display:grid;gap:6px;margin:8px 0 0;padding:0;list-style:none}
.bm-agent{display:flex;gap:8px;align-items:flex-start;font-size:13px;opacity:0;transform:translateY(4px);transition:opacity .4s,transform .4s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.bm-agent[data-on]{opacity:1;transform:none}
.bm-agent b{display:block;font-weight:600}
.bm-job{display:block;color:var(--bm-muted)}
.bm-dot{flex:none;width:8px;height:8px;margin-top:6px;border-radius:50%;border:2px solid var(--bm-accent)}
@media(prefers-reduced-motion:reduce){.bm *{transition:none!important}}
`;
const defaultLabels = { memories: "санамж", links: "холбоо", picture: "Санамжууд холбогдож тархи өсөж байна" };
const brainGrowthDemo = {
  title: "Тархи томроод биш, холбоогоороо өсдөг",
  stages: [
    { id: "personal", label: "Хувийн тархи", caption: "Таны санамжууд хоорондоо холбогдоно." },
    { id: "team", label: "Багийн тархи", caption: "Багийн гишүүдийн тархи нэг сүлжээ болно." },
    { id: "org", label: "Байгууллагын тархи", caption: "Хэлтэс бүр нэг тархинаас уншиж, нэмнэ." }
  ]
};
const brainGrowthStops = [0, 0.34, 0.67];
const CX = 200;
const CY = 165;
function geometry() {
  const clusters = [{ id: "me", x: CX, y: CY, r: 32, n: 26, tone: "core", at: 0, span: 0.22 }];
  const links = [];
  const ring = (count, rx, ry, rot) => Array.from({ length: count }, (_, i3) => {
    const a10 = (rot + 360 / count * i3) * Math.PI / 180;
    return { x: Math.round(CX + Math.cos(a10) * rx), y: Math.round(CY + Math.sin(a10) * ry) };
  });
  ring(4, 108, 86, 45).forEach((p3, i3) => {
    const id = `t${i3}`;
    clusters.push({ id, ...p3, r: 20, n: 13, tone: "branch", at: 0.34 + i3 * 0.04, span: 0.12 });
    links.push({ from: "me", to: id, at: 0.44 + i3 * 0.03, strands: 2 });
    links.push({ from: id, to: `t${(i3 + 1) % 4}`, at: 0.56 + i3 * 0.02, strands: 1 });
  });
  ring(6, 172, 136, 0).forEach((p3, i3) => {
    const id = `o${i3}`;
    clusters.push({ id, ...p3, r: 14, n: 9, tone: "branch", at: 0.67 + i3 * 0.025, span: 0.1 });
    const near = [0, 1, 2, 3].sort((a10, b7) => {
      const ta = clusters[1 + a10];
      const tb = clusters[1 + b7];
      return Math.hypot(ta.x - p3.x, ta.y - p3.y) - Math.hypot(tb.x - p3.x, tb.y - p3.y);
    });
    links.push({ from: `t${near[0]}`, to: id, at: 0.8 + i3 * 0.02, strands: 2 });
    links.push({ from: `t${near[1]}`, to: id, at: 0.86 + i3 * 0.02, strands: 1 });
    links.push({ from: id, to: `o${(i3 + 1) % 6}`, at: 0.9 + i3 * 0.015, strands: 1 });
  });
  return { clusters, links };
}
function BrainGrowth({ progress: progressProp, seed = 23, labels: labelsProp, className = "", ...data }) {
  const L4 = { ...defaultLabels, ...labelsProp };
  const d6 = { ...brainGrowthDemo, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== void 0)) };
  const uid = React.useId();
  const geo = React.useMemo(geometry, []);
  const p3 = useBrainProgress(progressProp, 4500, 15);
  const stage = p3 >= brainGrowthStops[2] ? 2 : p3 >= brainGrowthStops[1] ? 1 : 0;
  const counts = React.useMemo(() => brainCounts(geo.clusters, geo.links, p3, seed), [geo, p3, seed]);
  return /* @__PURE__ */ jsxs("section", { className: `bg ${className}`, "data-stage": d6.stages[stage].id, "aria-labelledby": d6.title ? `${uid}-h` : void 0, "aria-label": d6.title ? void 0 : L4.picture, children: [
    /* @__PURE__ */ jsx("style", { children: brainFieldCss + css }),
    d6.title && /* @__PURE__ */ jsx("h3", { id: `${uid}-h`, className: "bg-title", children: d6.title }),
    /* @__PURE__ */ jsx("div", { className: "bg-stage", children: /* @__PURE__ */ jsx(BrainField, { clusters: geo.clusters, links: geo.links, progress: p3, seed, height: 330, label: L4.picture }) }),
    /* @__PURE__ */ jsxs("p", { className: "bg-count", "aria-live": "polite", children: [
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("b", { children: counts.memories }),
        " ",
        L4.memories
      ] }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("b", { children: counts.links }),
        " ",
        L4.links
      ] })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "bg-steps", children: d6.stages.map((s4, i3) => /* @__PURE__ */ jsxs("li", { className: "bg-step", "aria-current": i3 === stage ? "step" : void 0, "data-past": i3 < stage || void 0, children: [
      /* @__PURE__ */ jsx("span", { className: "bg-n", children: i3 + 1 }),
      /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("b", { children: s4.label }),
        /* @__PURE__ */ jsx("span", { className: "bg-cap", children: s4.caption })
      ] })
    ] }, s4.id)) })
  ] });
}
const css = `
.bg{--bg-fg:var(--ts-fg,#18181b);--bg-muted:var(--ts-muted,#65656d);--bg-line:var(--ts-line,#ececef);--bg-surface:var(--ts-surface,#fff);--bg-accent:var(--ts-accent,#4f7cf0);--bg-accent-soft:var(--ts-accent-soft,#e8f1fe);--bg-accent-text:var(--ts-accent-strong,#1b5cff);width:100%;max-width:720px;margin:0 auto;color:var(--bg-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);box-sizing:border-box}
:where(.dark,[data-theme=dark]) .bg{--bg-fg:var(--ts-fg,#ececef);--bg-muted:var(--ts-muted,#a1a1aa);--bg-line:var(--ts-line,#2e2e33);--bg-surface:var(--ts-surface,#1b1b1e);--bg-accent:var(--ts-accent,#7c9cff);--bg-accent-soft:var(--ts-accent-soft,#1b2a44);--bg-accent-text:var(--ts-accent,#7c9cff);color-scheme:dark}
.bg *{box-sizing:border-box}
.bg .bf{--bf-surface:var(--bg-surface);--bf-branch:var(--bg-fg)}
.bg-title{margin:0 0 8px;text-align:center;font:var(--ts-head-weight,600) clamp(20px,4vw,30px)/1.2 var(--ts-font-display,inherit);letter-spacing:var(--ts-head-tracking,-.01em)}
.bg-stage{max-width:560px;margin:0 auto}
.bg-count{display:flex;justify-content:center;gap:16px;margin:6px 0 0;color:var(--bg-muted);font-size:13px;font-variant-numeric:tabular-nums}
.bg-count b{color:var(--bg-fg);font-weight:600}
.bg-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin:14px 0 0;padding:0;list-style:none}
.bg-step{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--bg-line);border-radius:var(--ts-radius-tile,10px);color:var(--bg-muted);transition:border-color .3s,background .3s,color .3s}
.bg-step b{display:block;font-weight:600}
.bg-cap{display:block;font-size:13px}
.bg-step[data-past]{color:var(--bg-fg)}
.bg-step[aria-current]{border-color:color-mix(in srgb,var(--bg-accent) 45%,var(--bg-line));background:var(--bg-accent-soft);color:var(--bg-fg)}
.bg-n{flex:none;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;border:1px solid currentColor;font-size:12px;font-weight:600}
.bg-step[aria-current] .bg-n{border-color:var(--bg-accent);color:var(--bg-accent-text)}
@media(prefers-reduced-motion:reduce){.bg *{transition:none!important}}
`;
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
.ts-btn:focus-visible,.ts-cta:focus-visible,.ts-pill:focus-visible,.ts-tab:focus-visible,.ts-card.is-interactive:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface,#fff),0 0 0 2px ${SEL}}

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
${[1, 2, 3, 4].map((i3) => `.ts-badge.is-cat-${i3}{background:var(--ts-cat-${i3}-bg,var(--ts-soft,#efebe1));color:var(--ts-cat-${i3}-fg,color-mix(in srgb,var(--ts-cat-${i3},#888) 62%,var(--ts-fg,#080808)))}`).join("\n")}
${STATUSES.map((st) => `.ts-badge.is-${st}{background:var(--ts-status-${st}-bg);box-shadow:inset 0 0 0 1px var(--ts-status-${st}-border);color:var(--ts-status-${st}-fg)}`).join("\n")}

.ts-tile{display:inline-grid;place-items:center;flex:none;box-sizing:border-box;width:var(--ts-tile-size);height:var(--ts-tile-size);border-radius:var(--ts-radius-tile,6px);background:var(--ts-soft,#efebe1);color:var(--ts-fg,#080808)}
${[1, 2, 3, 4].map((i3) => `.ts-tile.is-cat-${i3}{background:var(--ts-cat-${i3});color:var(--ts-on-cat-${i3},#fff)}`).join("\n")}
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
/* The focus ring adds to a control's own shadow instead of replacing it (elevation, selected ring). */
.ts-btn.is-secondary:focus-visible{box-shadow:0 0 0 1px var(--ts-surface,#fff),0 0 0 2px ${SEL},0 1px 2px rgb(0 0 0 / .12)}
.ts-card.is-interactive:focus-visible{box-shadow:0 0 0 1px var(--ts-surface,#fff),0 0 0 2px ${SEL},var(--ts-elevation,0 0 #0000)}
.ts-card.is-interactive.is-selected:focus-visible{box-shadow:0 0 0 1px ${SEL},0 0 0 3px var(--ts-surface,#fff),0 0 0 4px ${SEL}}

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
const cx$1 = (...c9) => c9.filter(Boolean).join(" ");
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
  const enabled = items.map((it, i3) => it.disabled ? -1 : i3).filter((i3) => i3 >= 0);
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
    items.map((it, i3) => {
      const on = it.value === value;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          ref: (el) => {
            refs.current[i3] = el;
          },
          type: "button",
          role: seg ? "radio" : "tab",
          "aria-checked": seg ? on : void 0,
          "aria-selected": seg ? void 0 : on,
          tabIndex: i3 === tabbable ? 0 : -1,
          disabled: it.disabled,
          className: cx$1("ts-tab", on && "is-selected"),
          onClick: () => onChange(it.value),
          onKeyDown: (e6) => {
            if (e6.key === "ArrowRight" || e6.key === "ArrowDown") e6.preventDefault(), move(i3, 1);
            else if (e6.key === "ArrowLeft" || e6.key === "ArrowUp") e6.preventDefault(), move(i3, -1);
            else if (e6.key === "Home") e6.preventDefault(), move(i3, "first");
            else if (e6.key === "End") e6.preventDefault(), move(i3, "last");
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
  const glyph = icon ?? (tone in STATUS_ICON ? STATUS_ICON[tone] : void 0);
  return /* @__PURE__ */ jsxs("span", { className: cx$1("ts-badge", `is-${tone}`, className), children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    glyph && /* @__PURE__ */ jsx(Icon, { name: glyph, size: 14 }),
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
  const [px, glyph] = TILE[String(size)] ?? TILE.M;
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
        /* @__PURE__ */ jsx(Icon, { name: folder ? "folder" : icon, variant: folder ? "filled" : "line", size: folder ? px : glyph })
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
    let h4 = 0;
    for (let i3 = 0; i3 < PRIMITIVES_CSS.length; i3++) h4 = Math.imul(h4, 31) + PRIMITIVES_CSS.charCodeAt(i3) | 0;
    href$1 = `ts-ui-${(h4 >>> 0).toString(36)}`;
  }
  return /* @__PURE__ */ jsx("style", { href: href$1, precedence: "default", children: PRIMITIVES_CSS });
}
const cx = (...c9) => c9.filter(Boolean).join(" ");
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
function NavRow({ l: l2, current, onClick }) {
  return /* @__PURE__ */ jsxs("a", { className: "ts-nav-row", href: l2.href, "aria-current": current === l2.href ? "page" : void 0, onClick, children: [
    /* @__PURE__ */ jsx("span", { className: "ts-nav-ico", children: /* @__PURE__ */ jsx(Icon, { name: l2.icon, size: 16, animate: true }) }),
    /* @__PURE__ */ jsxs("span", { className: "ts-nav-txt", children: [
      /* @__PURE__ */ jsx("b", { children: l2.label }),
      l2.note && /* @__PURE__ */ jsx("small", { children: l2.note })
    ] })
  ] });
}
function NavBar({ items, current, brand, inside, actions, openMenu, onOpenMenuChange, labels, sticky = true, className }) {
  const L4 = { ...navBarLabelsMn, ...labels };
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
  const hoverOpen = (e6, id) => {
    if (e6.pointerType !== "mouse" || pinned) return;
    cancelClose();
    setMenu(id);
  };
  const hoverLeave = (e6) => {
    if (e6.pointerType !== "mouse" || pinned || !menu) return;
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
    const onDown = (e6) => {
      if (!headerRef.current?.contains(e6.target)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });
  const [phone, setPhone] = React.useState(false);
  const owner = items.find((i3) => i3.kind === "menu" && i3.groups.some((g3) => g3.links.some((l2) => l2.href === current)));
  const [section, setSection] = React.useState(owner && owner.kind === "menu" ? owner.id : null);
  const toggle = React.useRef(null);
  const uid = React.useId();
  React.useEffect(() => {
    if (!phone && !menu) return;
    const onKey = (e6) => {
      if (e6.key !== "Escape") return;
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
      /* @__PURE__ */ jsxs("nav", { className: "ts-nav-desktop", "aria-label": L4.main, onPointerLeave: hoverLeave, onPointerEnter: (e6) => e6.pointerType === "mouse" && menu && cancelClose(), children: [
        items.map(
          (item) => item.kind === "link" ? /* @__PURE__ */ jsxs("a", { className: "ts-nav-link", href: item.href, "aria-current": item.href === current || item.match?.includes(current ?? "") ? "page" : void 0, children: [
            item.icon && /* @__PURE__ */ jsx(Icon, { name: item.icon, size: 14 }),
            item.label
          ] }, item.href) : /* @__PURE__ */ jsxs("div", { className: "ts-mega", onPointerEnter: (e6) => hoverOpen(e6, item.id), children: [
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
                onKeyDown: (e6) => {
                  if (e6.key !== "ArrowDown") return;
                  e6.preventDefault();
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
              /* @__PURE__ */ jsx("div", { className: "ts-mega-groups", children: item.groups.map((g3, gi) => /* @__PURE__ */ jsxs("div", { className: "ts-mega-group", style: { ["--g"]: gi }, children: [
                /* @__PURE__ */ jsx("span", { className: "ts-mega-h", children: g3.label }),
                g3.links.map((l2) => /* @__PURE__ */ jsx(NavRow, { l: l2, current, onClick: () => close() }, l2.href))
              ] }, g3.label)) }),
              (() => {
                const f4 = featuredOf(item);
                return f4 && /* @__PURE__ */ jsxs("a", { className: "ts-mega-feature", href: f4.href, onClick: () => close(), style: { ["--g"]: item.groups.length }, children: [
                  /* @__PURE__ */ jsx("span", { className: "ts-nav-ico is-accent", children: /* @__PURE__ */ jsx(Icon, { name: f4.icon, size: 18 }) }),
                  /* @__PURE__ */ jsx("span", { className: "ts-mega-k", children: f4.eyebrow }),
                  /* @__PURE__ */ jsx("b", { children: f4.title }),
                  /* @__PURE__ */ jsx("small", { children: f4.body }),
                  /* @__PURE__ */ jsxs("span", { className: "ts-mega-cta", children: [
                    f4.cta,
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
            "aria-label": phone ? L4.close : L4.open,
            onClick: () => setPhone(!phone),
            children: /* @__PURE__ */ jsx(Icon, { name: phone ? "x" : "menu", size: 20 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { id: `${uid}-mobile`, className: "ts-nav-mobile", "aria-label": L4.mobile, hidden: !phone, children: [
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
          /* @__PURE__ */ jsx("div", { id: `${uid}-mobile-${item.id}`, className: "ts-mobile-body", hidden: section !== item.id, children: item.groups.map((g3) => /* @__PURE__ */ jsxs("div", { className: "ts-mega-group", children: [
            item.groups.length > 1 && /* @__PURE__ */ jsx("span", { className: "ts-mega-h", children: g3.label }),
            g3.links.map((l2) => /* @__PURE__ */ jsx(NavRow, { l: l2, current, onClick: () => setPhone(false) }, l2.href))
          ] }, g3.label)) })
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
          (g3) => g3.links.length ? /* @__PURE__ */ jsxs("div", { className: "ts-footer-group", children: [
            col.groups.length > 1 && /* @__PURE__ */ jsx("span", { className: "ts-footer-sub", children: g3.label }),
            g3.links.map((l2) => /* @__PURE__ */ jsxs("a", { href: l2.href, "aria-current": l2.href === current ? "page" : void 0, className: l2.icon ? "has-icon" : void 0, children: [
              l2.icon && /* @__PURE__ */ jsx(Icon, { name: l2.icon, size: 16, animate: true }),
              l2.label
            ] }, l2.href))
          ] }, g3.label) : null
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
        legal.map((l2) => /* @__PURE__ */ jsx("a", { href: l2.href, children: l2.label }, l2.href)),
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
    let h4 = 0;
    for (let i3 = 0; i3 < SITE_CSS.length; i3++) h4 = Math.imul(h4, 31) + SITE_CSS.charCodeAt(i3) | 0;
    href = `ts-site-${(h4 >>> 0).toString(36)}`;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    /* @__PURE__ */ jsx("style", { href, precedence: "default", children: SITE_CSS })
  ] });
}
const scenarioChatLabelsMn = {
  list: "Асуултууд",
  more: (n2) => `Бусад асуулт (${n2})`,
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
function phasesOf(s4) {
  const out = [{ state: { at: "question", n: 0 }, hold: 900 }];
  (s4.sources ?? []).forEach((_, i3) => out.push({ state: { at: "source", n: i3 + 1 }, hold: 520 }));
  (s4.steps ?? []).forEach((_, i3) => out.push({ state: { at: "step", n: i3 + 1 }, hold: 640 }));
  if (s4.answer) out.push({ state: { at: "answer", n: 0 }, hold: Math.max(1400, words(s4.answer).length * WORD_MS + 400) });
  if (s4.guard) out.push({ state: { at: "guard", n: 0 }, hold: 900 });
  out.push({ state: { at: "done", n: 0 }, hold: 400 });
  return out;
}
const ORDER = ["question", "source", "step", "answer", "guard", "done"];
const WORD_MS = 70;
const words = (t2) => t2.split(/(\s+)/).filter(Boolean);
const IDLE_MS = 8e3;
const past = (p3, at) => ORDER.indexOf(p3.at) > ORDER.indexOf(at);
function ScenarioChat({ scenarios, people = [], autoplay = true, loops = 3, defaultIndex = 0, onSelect, labels, className = "" }) {
  const L4 = { ...scenarioChatLabelsMn, ...labels, guards: { ...scenarioChatLabelsMn.guards, ...labels?.guards } };
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
    setPlayed((n2) => n2 + 1);
    setPick((i3) => (i3 + 1) % scenarios.length);
    sc.replay();
  }, [finished]);
  const phase = manual ? { at: "done", n: 0 } : sc.state;
  const phaseKey = `${cur?.id}:${phase.at}:${phase.n}`;
  const began = React.useRef({});
  if (!began.current[phaseKey]) {
    for (const k2 of Object.keys(began.current)) if (!k2.startsWith(`${cur?.id}:`)) delete began.current[k2];
    began.current[phaseKey] = Date.now();
  }
  const [wordsShown, setWordsShown] = React.useState(0);
  React.useEffect(() => {
    if (phase.at !== "answer" || !cur?.answer) return;
    setWordsShown(0);
    const total = words(cur.answer).length;
    let n2 = 0;
    const t2 = window.setInterval(() => {
      n2 += 1;
      setWordsShown(n2);
      if (n2 >= total) window.clearInterval(t2);
    }, WORD_MS);
    return () => window.clearInterval(t2);
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
  const choose = (i3) => {
    setManual(true);
    setPick(i3);
    setListOpen(false);
    onSelect?.(scenarios[i3]);
  };
  const replay = () => {
    setManual(false);
    setPlayed(0);
    sc.replay();
  };
  if (!cur) return null;
  const person = cur.personId ? people.find((p3) => p3.id === cur.personId) : void 0;
  const guard = cur.guard ? L4.guards[cur.guard] : void 0;
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
      title: L4.understand,
      state: phase.at === "question" ? "running" : "done",
      status: L4.thinking,
      startedAt: phase.at === "question" ? runAt("question:0") : void 0,
      duration: 900
    }
  ];
  if (srcN)
    trail.push({
      id: "search",
      title: L4.sources,
      state: searching ? "running" : searchDone ? "done" : "pending",
      status: `${srcShown}/${srcN}`,
      startedAt: searching ? runAt("source:1") : void 0,
      duration: srcN * 520,
      substeps: (cur.sources ?? []).slice(0, searching ? srcShown : searchDone ? srcN : 0).map((src, i3, arr) => ({
        id: `${src.title}-${i3}`,
        title: src.title,
        state: searching && i3 === arr.length - 1 ? "running" : "done",
        tag: L4.sourceTypes[src.type] ?? src.type,
        tagTone: sourceMeta(src.type).cat,
        detail: [src.size, src.date].filter(Boolean).join(" · ") || void 0
      }))
    });
  (cur.steps ?? []).forEach((st, i3) => {
    const running = phase.at === "step" && phase.n === i3 + 1;
    const done = past(phase, "step") || phase.at === "step" && phase.n > i3 + 1;
    trail.push({
      id: `step-${i3}`,
      title: st,
      state: running ? "running" : done ? "done" : "pending",
      startedAt: running ? runAt(`step:${i3 + 1}`) : void 0,
      duration: 640
    });
  });
  if (guard?.human)
    trail.push({ id: "gate", title: L4.approval, state: guardOk ? "done" : guardShown ? "waiting" : "pending", gate: true, duration: guardOk ? 900 : void 0 });
  const autoOpen = trail.filter((t2) => t2.state === "running" && t2.substeps?.length).map((t2) => t2.id);
  const doneSearch = [];
  return /* @__PURE__ */ jsxs("div", { ref: sc.ref, className: `ts-loop-region ts-sc ${className}`, ...sc.attrs, "data-controls": "hover", onKeyDown: touch, children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    /* @__PURE__ */ jsx(MotionStyles, {}),
    /* @__PURE__ */ jsx("style", { href: "ts-scenario-chat", precedence: "default", children: CSS$3 }),
    /* @__PURE__ */ jsxs("div", { className: "ts-sc-side", children: [
      /* @__PURE__ */ jsx("ol", { className: "ts-sc-list", id: listId, "aria-label": L4.list, "data-open": listOpen || void 0, children: scenarios.map((s4, i3) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { type: "button", className: "ts-sc-q", "aria-pressed": i3 === pick, onClick: () => choose(i3), children: [
        /* @__PURE__ */ jsx(Icon, { name: "message-circle", size: 14 }),
        /* @__PURE__ */ jsxs("span", { children: [
          s4.group && /* @__PURE__ */ jsx("small", { children: s4.group }),
          s4.question
        ] })
      ] }) }, s4.id)) }),
      scenarios.length > 1 && /* @__PURE__ */ jsxs("button", { type: "button", className: "ts-sc-more", "aria-expanded": listOpen, "aria-controls": listId, onClick: () => setListOpen(!listOpen), children: [
        /* @__PURE__ */ jsx(Icon, { name: "chevron-down", size: 14 }),
        listOpen ? L4.less : L4.more(scenarios.length - 1)
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
        L4.doubt,
        ": ",
        cur.doubt
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ts-sc-trail", onClick: touch, children: /* @__PURE__ */ jsx(
        AgentTrail,
        {
          title: answerShown ? L4.trailDone : L4.trail,
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
          L4.sources
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "ts-sc-sources", children: cur.sources.map((src, i3) => {
          const t2 = sourceMeta(src.type);
          const open = peek === i3;
          return /* @__PURE__ */ jsxs("li", { "data-on": searchDone || void 0, style: { "--i": i3 }, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "ts-sc-chip",
                "aria-expanded": open,
                onClick: () => {
                  touch();
                  setPeek(open ? null : i3);
                },
                children: [
                  /* @__PURE__ */ jsx(IconTile, { icon: t2.icon, tone: t2.tone, size: "S" }),
                  /* @__PURE__ */ jsx("span", { className: "ts-sc-chip-t", children: src.title }),
                  (src.date || src.size) && /* @__PURE__ */ jsx("small", { children: [src.size, src.date].filter(Boolean).join(" · ") })
                ]
              }
            ),
            open && /* @__PURE__ */ jsxs("div", { className: "ts-sc-pop", role: "dialog", "aria-label": src.title, children: [
              /* @__PURE__ */ jsx(IconTile, { icon: t2.icon, tone: t2.tone, size: "M" }),
              /* @__PURE__ */ jsx("b", { children: src.title }),
              /* @__PURE__ */ jsxs("dl", { children: [
                /* @__PURE__ */ jsx("dt", { children: L4.sources }),
                /* @__PURE__ */ jsx("dd", { children: L4.sourceTypes[src.type] ?? src.type }),
                src.date && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("dt", { children: "Огноо" }),
                  /* @__PURE__ */ jsx("dd", { children: src.date })
                ] }),
                src.size && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("dt", { children: "Уншсан" }),
                  /* @__PURE__ */ jsx("dd", { children: src.size })
                ] })
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", className: "ts-sc-pop-x", "aria-label": L4.close, onClick: () => setPeek(null), children: /* @__PURE__ */ jsx(Icon, { name: "x", size: 14 }) })
            ] })
          ] }, `${src.title}-${i3}`);
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
      L4.fiction && /* @__PURE__ */ jsx("p", { className: "ts-sc-fiction", children: L4.fiction })
    ] }, cur.id),
    sc.loopState !== "reduced" && /* @__PURE__ */ jsx(MotionControls, { onReplay: replay, paused: sc.paused, onTogglePause: sc.togglePaused })
  ] });
}
const CSS$3 = `
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
.ts-sc-trail .atr-pending .atr-name{color:var(--ts-muted)}
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
  allow: (s4, d6) => s4 === "once" ? "Нэг удаа зөвшөөрөх" : s4 === "timed" ? `${d6} зөвшөөрөх` : "Үргэлж зөвшөөрөх",
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
  const L4 = { ...agentConsentLabelsMn, ...labels };
  const avail = risk === "destructive" ? scopes.filter((s4) => s4 !== "always") : scopes;
  const [scopeOwn, setScope] = React.useState(avail[0] ?? "once");
  const [own, setOwn] = React.useState(defaultDecision);
  const [touched, setTouched] = React.useState(false);
  const sc = useScenario(demo ? STORY : [{ state: "request", hold: 1e3 }], { rest: 2600 });
  const playing = !!demo && !touched;
  const stage = playing ? sc.state : "request";
  const durationLabel = duration % 60 === 0 ? `${duration / 60} цаг` : `${duration} мин`;
  const scope = playing && stage !== "request" ? avail.includes(demo.scope) ? demo.scope : avail[0] : scopeOwn;
  const decision = playing ? stage === "decided" ? { allow: demo.allow, scope } : null : decisionIn !== void 0 ? decisionIn : own;
  const decide = (d6) => {
    setTouched(true);
    if (decisionIn === void 0) setOwn(d6);
    onDecide?.(d6);
  };
  const scopeName = (s4) => s4 === "timed" ? durationLabel : L4.scopes[s4];
  const began = React.useRef({});
  if (!began.current[stage]) began.current[stage] = Date.now();
  const reading = playing && stage === "request";
  const trail = [
    { id: "start", title: L4.trail.started, state: "done", duration: 4e3 },
    {
      id: "scope",
      title: L4.trail.scoped,
      state: reading ? "running" : "done",
      status: L4.trail.reading,
      startedAt: reading ? began.current.request : void 0,
      duration: 1400,
      substeps: preview.map((p3, i3) => ({
        id: `${p3.label}-${i3}`,
        title: p3.label,
        tag: L4.scopes[scope],
        tagTone: risk === "destructive" ? 4 : risk === "risky" ? 1 : 3,
        detail: p3.meta
      }))
    },
    {
      id: "decide",
      title: L4.trail.decide,
      state: decision ? "done" : stage === "waiting" || !playing ? "waiting" : "pending",
      gate: true
    }
  ];
  return /* @__PURE__ */ jsxs("section", { ref: sc.ref, className: `ts-loop-region ts-consent ${className}`, ...sc.attrs, "data-controls": "hover", "data-stage": stage, "aria-label": L4.title, children: [
    /* @__PURE__ */ jsx(PrimitiveStyles, {}),
    /* @__PURE__ */ jsx(MotionStyles, {}),
    /* @__PURE__ */ jsx("style", { href: "ts-agent-consent", precedence: "default", children: CSS$2 }),
    decision ? /* @__PURE__ */ jsxs("div", { className: `ts-consent-folded ts-enter ${decision.allow ? "is-ok" : "is-no"}`, children: [
      /* @__PURE__ */ jsx(IconTile, { icon: decision.allow ? "check" : "x", tone: decision.allow ? "done" : "error", size: "M" }),
      /* @__PURE__ */ jsxs("span", { className: "ts-consent-ftext", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("strong", { children: decision.allow ? L4.allowed : L4.denied }),
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
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", icon: "pencil", onClick: () => decide(null), children: L4.change })
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
        /* @__PURE__ */ jsx(Badge, { tone: RISK_TONE[risk], children: L4.risk[risk] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ts-consent-trail", children: /* @__PURE__ */ jsx(AgentTrail, { title: L4.trail.title, steps: trail, expanded: reading || !playing ? ["scope"] : [] }) }),
      reason && /* @__PURE__ */ jsxs("p", { className: "ts-consent-reason", children: [
        /* @__PURE__ */ jsx(Icon, { name: "circle-help", size: 14 }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsxs("b", { children: [
            L4.reason,
            ":"
          ] }),
          " ",
          reason
        ] })
      ] }),
      preview.length > 0 && /* @__PURE__ */ jsxs("div", { className: "ts-consent-preview", children: [
        /* @__PURE__ */ jsxs("span", { className: "ts-consent-h", children: [
          /* @__PURE__ */ jsx(Icon, { name: "search", size: 13 }),
          L4.preview
        ] }),
        /* @__PURE__ */ jsx("ul", { children: preview.map((p3, i3) => /* @__PURE__ */ jsxs("li", { style: { "--i": i3 }, children: [
          /* @__PURE__ */ jsx(Icon, { name: p3.icon ?? "file-text", size: 14 }),
          /* @__PURE__ */ jsx("span", { children: p3.label }),
          p3.meta && /* @__PURE__ */ jsx("small", { children: p3.meta })
        ] }, `${p3.label}-${i3}`)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ts-consent-scope", "data-on": stage !== "request" || void 0, children: /* @__PURE__ */ jsx(
        Tabs,
        {
          variant: "segmented",
          size: "sm",
          label: L4.scopeLabel,
          value: scope,
          onChange: (v) => (setTouched(true), setScope(v)),
          items: avail.map((s4) => ({ value: s4, label: scopeName(s4), icon: s4 === "once" ? "circle-dot" : s4 === "timed" ? "clock" : "shield-check" }))
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "ts-consent-actions", children: [
        stage === "waiting" && /* @__PURE__ */ jsxs("span", { className: "ts-consent-wait", role: "status", children: [
          /* @__PURE__ */ jsx("span", { className: "ts-loop ts-loop-breathe", children: /* @__PURE__ */ jsx(Icon, { name: "hourglass", size: 14 }) }),
          L4.waiting
        ] }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", icon: "x", onClick: () => decide({ allow: false, scope: "once" }), children: L4.deny }),
        /* @__PURE__ */ jsx(Button, { size: "sm", icon: "check", className: stage === "waiting" ? "ts-consent-pulse" : void 0, onClick: () => decide({ allow: true, scope }), children: L4.allow(scope, durationLabel) })
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
const CSS$2 = `
.ts-consent-trail .atr{max-width:none;padding:0;border:0;box-shadow:none;background:none;--atr-bg:transparent;--atr-fg:var(--ts-fg,#080808);--atr-muted:var(--ts-muted,#5e5a52);--atr-faint:var(--ts-muted,#5e5a52);--atr-line:var(--ts-line,#d8d3c6);--atr-accent:var(--ts-accent-fg,#1b5cff);font-family:inherit;font-size:13.5px}
.ts-consent-trail .atr-title{font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-consent-trail .atr-step{animation:ts-consent-row .42s var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both}
.ts-consent-trail .atr-step:nth-child(2){animation-delay:.12s}.ts-consent-trail .atr-step:nth-child(3){animation-delay:.24s}
.ts-consent-trail .atr-pending .atr-name{color:var(--ts-muted)}
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
const appScreenLabelsMn = {
  inbox: "Inbox",
  note: "Тэмдэглэл",
  project: "Төсөл",
  chat: "Чат",
  memory: "Санах ой",
  team: "Баг",
  brand: "Second Brain",
  search: "Хайх эсвэл асуух…",
  next: "NEXT ACTION"
};
const SCREENS = ["inbox", "note", "project", "chat", "memory", "team"];
const I = (d6, size = 16) => /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: d6 });
const icons = {
  inbox: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M2 9h3.5l1 2h3l1-2H14" }),
    /* @__PURE__ */ jsx("path", { d: "M3.5 3h9L14 9v4H2V9Z" })
  ] })),
  note: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M4 2h6l3 3v9H4Z" }),
    /* @__PURE__ */ jsx("path", { d: "M10 2v3h3M6 8h5M6 11h4" })
  ] })),
  project: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "3", width: "12", height: "10", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M2 6.5h12M6 3v3.5" })
  ] })),
  chat: I(/* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("path", { d: "M3 3h10v7H8l-3 3v-3H3Z" }) })),
  memory: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "M8 5v3l2 1.5" })
  ] })),
  team: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "5.5", cy: "6", r: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "6.5", r: "1.6" }),
    /* @__PURE__ */ jsx("path", { d: "M2 13c.5-2 2-3 3.5-3S8.5 11 9 13M9.5 13c.3-1.4 1.2-2.2 2.3-2.2 1 0 1.8.8 2.2 2.2" })
  ] })),
  link: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M7 9a2.5 2.5 0 0 0 3.5 0l2-2A2.5 2.5 0 0 0 9 3.5L8.4 4" }),
    /* @__PURE__ */ jsx("path", { d: "M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5l.6-.5" })
  ] })),
  voice: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "6", y: "2", width: "4", height: "7.5", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M3.5 8a4.5 4.5 0 0 0 9 0M8 12.5V14" })
  ] })),
  idea: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M5.5 10.5a4 4 0 1 1 5 0V12h-5Z" }),
    /* @__PURE__ */ jsx("path", { d: "M6.5 14h3" })
  ] })),
  file: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M4 2h5.5L12 4.5V14H4Z" }),
    /* @__PURE__ */ jsx("path", { d: "M6 9h4M6 11.5h3" })
  ] })),
  mail: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "3.5", width: "12", height: "9", rx: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "m2.5 4.5 5.5 4 5.5-4" })
  ] })),
  search: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "m10 10 3 3" })
  ] })),
  arrow: I(/* @__PURE__ */ jsx("path", { d: "M3 8h10M9 4l4 4-4 4" })),
  check: I(/* @__PURE__ */ jsx("path", { d: "m3.5 8.5 3 3 6-7" })),
  spark: I(/* @__PURE__ */ jsx("path", { d: "M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2" }))
};
const CSS$1 = `
.aps-root{--ts-radius:6px;--aps-r:var(--ts-radius);--aps-r-shell:var(--ts-radius);--aps-sans:Inter,system-ui,sans-serif;--aps-serif:Spectral,Georgia,serif;--aps-mono:"IBM Plex Mono",monospace;
 --aps-h2:24px;--aps-h3:18px;--aps-lead:16px;--aps-body:16px;--aps-small:14px;--aps-label:12px;--aps-btn:44px;--aps-icon:16px;--aps-stroke:1.5}
.aps-stage{height:100%;font-family:var(--aps-sans);color:var(--ts-fg)}
.aps-count{margin-left:auto;font:500 var(--aps-label) var(--aps-mono);color:var(--ts-faint)}
.aps-win{height:100%}.aps-win .ash{min-height:0}.aps-win .ash-main{padding:28px 32px}
.aps-h1{font:400 var(--aps-h2)/1.08 var(--aps-serif);letter-spacing:-.01em;margin:0 0 8px}
.aps-sub{color:var(--ts-muted);font:italic 400 var(--aps-lead)/1.5 var(--aps-serif);margin:0 0 24px}
.aps-label{font:500 var(--aps-label) var(--aps-mono);letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint)}
.aps-card{background:color-mix(in srgb,var(--ts-surface,#f7f5ee) 82%,transparent);border:1px solid color-mix(in srgb,var(--ts-line,#d8d3c6) 80%,transparent);border-radius:var(--aps-r)}
.aps-next{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:var(--aps-r);background:#ff7a1a;color:#1a0d00;font:600 var(--aps-label) var(--aps-mono);letter-spacing:.04em}
.aps-next span{font:500 12px var(--aps-sans);letter-spacing:0}
.aps-chip{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 10px;border-radius:var(--aps-r);font-size:var(--aps-small);color:var(--ts-muted);background:var(--ts-soft,#efebe1)}
.aps-chip.e{color:var(--ts-on-accent-soft,#0f3fb8);background:var(--ts-electric-soft,#dce5ff)}
.aps-capture{display:flex;align-items:center;gap:10px;padding:14px 16px;margin-bottom:18px}
.aps-capture input{flex:1;border:0;background:none;font:15px var(--aps-sans);color:var(--ts-fg);outline:0}
.aps-key{font:500 var(--aps-label) var(--aps-mono);color:var(--ts-faint);border:1px solid var(--ts-line);border-radius:var(--aps-r);padding:2px 6px}
.aps-list{display:flex;flex-direction:column}
.aps-row{display:grid;grid-template-columns:40px 1fr auto;gap:14px;align-items:center;padding:18px 20px;border-top:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent)}
.aps-row:first-child{border-top:0}
/* A filed item steps back by colour, not opacity, so its text keeps 4.5:1. */
.aps-row.done b,.aps-row.done .aps-meta,.aps-row.done .aps-chip{color:var(--ts-muted)}.aps-row.done b{font-weight:400}
.aps-ico{width:40px;height:40px;align-self:start;border-radius:var(--aps-r);display:grid;place-items:center;background:var(--ts-soft);color:var(--ts-muted)}
.aps-row b{font-weight:500;font-size:var(--aps-body);display:block;margin-bottom:3px}
.aps-meta{font-size:var(--aps-small);color:var(--ts-faint);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.aps-row .aps-next{margin-top:8px}
.aps-grid{display:grid;grid-template-columns:1fr 300px;gap:22px;align-items:start}
.aps-note{padding:26px 28px}
.aps-note p{font-size:var(--aps-body);line-height:1.65;margin:0 0 12px}
.aps-note h2{font:400 var(--aps-h2)/1.08 var(--aps-serif);letter-spacing:-.01em;line-height:1.2;margin:10px 0 16px}
.aps-src{margin-top:18px;padding-top:14px;border-top:1px dashed var(--ts-line);font-size:var(--aps-body);color:var(--ts-muted)}
.aps-link{display:flex;gap:12px;padding:14px 16px;border-top:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent)}
.aps-link:first-of-type{border-top:0}
.aps-dot{position:relative;z-index:1;width:12px;height:12px;border-radius:50%;margin-top:5px;flex:none;box-shadow:0 0 0 4px var(--ts-surface)}
.aps-link b{font-weight:500;font-size:var(--aps-body);display:block}
.aps-link small{font-size:var(--aps-small);color:var(--ts-faint)}
.aps-progress{height:6px;border-radius:var(--aps-r);background:var(--ts-soft-2,#e8e3d6);overflow:hidden;margin:10px 0 4px}
.aps-progress i{display:block;height:100%;background:#1b5cff;border-radius:var(--aps-r)}
.aps-nextcard{padding:18px 20px;margin:18px 0;border-color:#ff7a1a;background:color-mix(in srgb,#ff7a1a 9%,var(--ts-surface))}
.aps-nextcard h3{font:400 var(--aps-h3)/1.2 var(--aps-serif);margin:10px 0 6px}
.aps-task{display:grid;grid-template-columns:18px 1fr auto auto;gap:12px;align-items:center;padding:14px 18px;border-top:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);font-size:var(--aps-body)}
.aps-task:first-child{border-top:0}
.aps-st{width:14px;height:14px;border-radius:50%;border:1.5px solid var(--ts-faint)}
.aps-st.done{background:var(--ts-green,#5e7a5f);border-color:var(--ts-green)}
.aps-st.doing{border-color:#1b5cff;border-right-color:transparent}
.aps-st.waiting{border-color:#ff7a1a;border-style:dashed}
.aps-task.done span:nth-child(2){text-decoration:line-through;color:var(--ts-faint)}
.aps-truth{padding:16px 18px}.aps-truth li{font-size:var(--aps-body);margin:8px 0;color:var(--ts-muted)}.aps-truth ul{padding-left:18px;margin:8px 0 0}
.aps-chatgrid{display:grid;grid-template-columns:1fr 400px;gap:24px;align-items:start}
.aps-chat{min-width:0;display:flex;flex-direction:column;gap:16px}
.aps-q{align-self:flex-end;max-width:80%;padding:14px 18px;border-radius:var(--aps-r);background:#1b5cff;color:#fff;font-size:var(--aps-body);line-height:1.45}
.aps-composer{display:flex;align-items:center;gap:10px;padding:12px 14px;margin-top:4px}
.aps-composer>span:not(.aps-send){flex:1;color:var(--ts-faint);font-size:var(--aps-body)}
.aps-send{width:32px;height:32px;border-radius:var(--aps-r);background:#1b5cff;color:#fff;display:grid;place-items:center}
.aps-head{display:flex;align-items:center;justify-content:space-between;gap:16px}
.aps-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:var(--aps-btn);padding:0 16px;border-radius:var(--aps-r);font:500 var(--aps-body) var(--aps-sans);cursor:pointer;border:1px solid transparent;transition:background var(--ts-motion-dur-xs,120ms),border-color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-xs,120ms);white-space:nowrap}
.aps-btn:focus-visible,.aps-field:focus-within{outline:2px solid #1b5cff;outline-offset:2px}
.aps-btn:active{transform:translateY(1px)}
.aps-btn:disabled{opacity:.45;cursor:not-allowed}
.aps-btn.primary{background:#1b5cff;color:#fff}.aps-btn.primary:hover{background:#2a69ff}.aps-btn.primary:active{background:#1449cc}
.aps-btn.secondary{background:transparent;color:var(--ts-fg);border:1.5px solid var(--ts-fg)}.aps-btn.secondary:hover{border-color:var(--ts-faint)}
.aps-btn.ghost{background:none;color:var(--ts-fg);text-decoration:underline;text-decoration-color:var(--ts-line);text-underline-offset:4px}.aps-btn.ghost:hover{color:var(--ts-electric-fg);text-decoration-color:currentColor}
.aps-actions{display:flex;gap:8px;align-items:center}
.aps-btn.split{padding:0 0 0 16px;gap:0;align-items:stretch}.aps-btn.split>em{font-style:normal;display:flex;align-items:center}
.aps-cell{display:grid;place-items:center;width:var(--aps-btn);margin-left:16px;border-left:1.5px solid currentColor;opacity:.9;transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-standard,ease)}
.aps-btn.primary .aps-cell{border-left-color:rgb(255 255 255/.4)}.aps-btn.split:hover .aps-cell svg{transform:translateX(2px)}
.aps-btn.icon{padding:0;width:var(--aps-btn)}
.aps-fieldwrap{margin-bottom:22px}
.aps-fieldwrap label{display:block;font:500 var(--aps-body) var(--aps-sans);margin:0 0 8px}
.aps-field{display:flex;align-items:center;gap:10px;padding:8px 8px 8px 16px;border-radius:var(--aps-r);background:var(--ts-surface);border:1.5px solid var(--ts-line)}
.aps-field input{flex:1;min-width:0;border:0;background:none;font:var(--aps-body) var(--aps-sans);color:var(--ts-fg);outline:0;min-height:38px}
.aps-field input::placeholder{color:var(--ts-faint)}
.aps-help{font-size:var(--aps-small);color:var(--ts-faint);margin:8px 2px 0}
.aps-path{display:flex;align-items:center;font-size:var(--aps-small)}
.aps-path i{width:8px;height:8px;border-radius:50%;background:var(--ts-faint);flex:none}
.aps-path i.to{background:#1b5cff;box-shadow:0 0 0 3px var(--ts-electric-soft)}
.aps-path s{width:26px;height:1.5px;background:linear-gradient(90deg,var(--ts-faint),#1b5cff);margin:0 6px}
.aps-path b{color:var(--ts-electric-fg);font-weight:500;font-size:var(--aps-small);margin:0 0 0 8px;display:inline}
.aps-spine{position:relative}
.aps-spine::before{content:"";position:absolute;left:21px;top:26px;bottom:26px;width:1.5px;background:var(--ts-line)}
.aps-grid>*,.aps-chatgrid>*{min-width:0}
@container (max-width:980px){.aps-grid,.aps-chatgrid{grid-template-columns:minmax(0,1fr)}.aps-win .ash-main{padding:20px}}
@container (max-width:560px){.aps-win .ash-main{padding:14px}.aps-task{grid-template-columns:18px minmax(0,1fr) auto}.aps-task>:nth-child(3){display:none}}
.aps-still *,.aps-still *::before,.aps-still *::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}
`;
const SCREEN_VIEW = { inbox: "inbox", note: "resources", project: "projects", chat: "ask", memory: "resources", team: "agents" };
const VIEW_SCREEN = { inbox: "inbox", resources: "note", projects: "project", ask: "chat", agents: "team" };
function AppWindow({ screen, company = "ACME", counts = {}, onSelect, children }) {
  return /* @__PURE__ */ jsx(
    AppShell,
    {
      className: "aps-win",
      company: { name: company, note: "Тархи · демо" },
      vocab: { resources: { label: screen === "memory" ? "Санах ой" : "Нөөц", line: paraBaseMn.resources.line } },
      counts: { inbox: counts.inbox, projects: counts.project, resources: counts.memory },
      active: SCREEN_VIEW[screen],
      onNavigate: (v) => {
        const k2 = VIEW_SCREEN[v];
        if (k2) onSelect?.(k2);
      },
      onAsk: () => onSelect?.("chat"),
      children
    }
  );
}
const linkColor = { decision: "#1b5cff", knowledge: "#5e7a5f", project: "#ff7a1a", source: "#6b47c9" };
const linkKind = { decision: "Шийдвэр", knowledge: "Мэдлэг", project: "Төсөл", source: "Эх сурвалж" };
const statusLabel = { todo: "Хийх", doing: "Хийж байна", waiting: "Хүлээгдэж", done: "Дууссан" };
function InboxScreen({ data, labels = appScreenLabelsMn }) {
  const open = data.inbox.filter((i3) => !i3.processed).length;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { className: "aps-h1", children: labels.inbox }),
    /* @__PURE__ */ jsxs("p", { className: "aps-sub", children: [
      open,
      " шинэ зүйл. Агент газрыг нь санал болгосон — хүн батална."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "aps-fieldwrap", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "aps-capture", children: "Цуглуулах" }),
      /* @__PURE__ */ jsxs("div", { className: "aps-field", children: [
        icons.spark,
        /* @__PURE__ */ jsx("input", { id: "aps-capture", readOnly: true, value: "", placeholder: "Санаа, холбоос, файл…" }),
        /* @__PURE__ */ jsx("span", { className: "aps-key", children: "⌘⇧Space" }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "aps-btn primary split", children: [
          /* @__PURE__ */ jsx("em", { children: "Хадгалах" }),
          /* @__PURE__ */ jsx("span", { className: "aps-cell", children: icons.arrow })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "aps-help", children: "Агент Inbox дотор орсон зүйлийг ангилж, газрыг нь санал болгоно." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "aps-card aps-list", children: data.inbox.map((i3) => /* @__PURE__ */ jsxs("div", { className: "aps-row" + (i3.processed ? " done" : ""), children: [
      /* @__PURE__ */ jsx("span", { className: "aps-ico", children: icons[i3.kind] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("b", { children: i3.title }),
        /* @__PURE__ */ jsx("div", { className: "aps-meta", children: i3.meta }),
        /* @__PURE__ */ jsxs("div", { className: "aps-path", style: { marginTop: 8 }, children: [
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("s", {}),
          /* @__PURE__ */ jsx("i", { className: "to" }),
          /* @__PURE__ */ jsx("b", { children: i3.suggest })
        ] }),
        i3.next && /* @__PURE__ */ jsxs("div", { className: "aps-next", children: [
          labels.next,
          " ",
          /* @__PURE__ */ jsx("span", { children: i3.next })
        ] })
      ] }),
      i3.processed ? /* @__PURE__ */ jsxs("span", { className: "aps-chip", children: [
        icons.check,
        "Ангилсан"
      ] }) : /* @__PURE__ */ jsxs("div", { className: "aps-actions", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "aps-btn ghost", children: "Өөрчлөх" }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "aps-btn secondary split", children: [
          /* @__PURE__ */ jsx("em", { children: "Батлах" }),
          /* @__PURE__ */ jsx("span", { className: "aps-cell", children: icons.check })
        ] })
      ] })
    ] }, i3.id)) })
  ] });
}
function NoteScreen({ data }) {
  const n2 = data.note;
  return /* @__PURE__ */ jsxs("div", { className: "aps-grid", children: [
    /* @__PURE__ */ jsxs("article", { className: "aps-card aps-note", children: [
      /* @__PURE__ */ jsxs("div", { className: "aps-meta", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-chip e", children: n2.kind }),
        n2.date,
        n2.tags.map((t2) => /* @__PURE__ */ jsxs("span", { children: [
          "#",
          t2
        ] }, t2))
      ] }),
      /* @__PURE__ */ jsx("h2", { children: n2.title }),
      n2.body.map((p3, i3) => /* @__PURE__ */ jsx("p", { children: p3 }, i3)),
      /* @__PURE__ */ jsxs("div", { className: "aps-src", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-label", children: "Эх сурвалж" }),
        /* @__PURE__ */ jsx("br", {}),
        n2.source
      ] })
    ] }),
    /* @__PURE__ */ jsxs("aside", { children: [
      /* @__PURE__ */ jsx("div", { className: "aps-label", style: { margin: "4px 2px 8px" }, children: "Холбоос · яагаад" }),
      /* @__PURE__ */ jsx("div", { className: "aps-card aps-spine", children: n2.links.map((l2) => /* @__PURE__ */ jsxs("div", { className: "aps-link", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-dot", style: { background: linkColor[l2.kind] } }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("b", { children: l2.title }),
          /* @__PURE__ */ jsxs("small", { children: [
            linkKind[l2.kind],
            " · ",
            l2.why
          ] })
        ] })
      ] }, l2.id)) }),
      /* @__PURE__ */ jsxs("p", { className: "aps-meta", style: { margin: "12px 2px" }, children: [
        "← ",
        n2.backlinks,
        " тэмдэглэл энд холбогдсон"
      ] })
    ] })
  ] });
}
function ProjectScreen({ data, labels = appScreenLabelsMn }) {
  const p3 = data.project;
  return /* @__PURE__ */ jsxs("div", { className: "aps-grid", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "aps-meta", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-chip", children: p3.area }),
        p3.done,
        "/",
        p3.total,
        " алхам"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "aps-h1", style: { marginTop: 8 }, children: p3.name }),
      /* @__PURE__ */ jsx("p", { className: "aps-sub", style: { marginBottom: 0 }, children: p3.why }),
      /* @__PURE__ */ jsx("div", { className: "aps-progress", children: /* @__PURE__ */ jsx("i", { style: { width: `${p3.done / p3.total * 100}%` } }) }),
      /* @__PURE__ */ jsxs("div", { className: "aps-card aps-nextcard", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-next", children: labels.next }),
        /* @__PURE__ */ jsx("h3", { children: p3.next.title }),
        /* @__PURE__ */ jsxs("div", { className: "aps-meta", style: { justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxs("span", { children: [
            p3.next.context,
            " · ",
            p3.next.owner
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "aps-actions", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "aps-btn ghost", children: "Хойшлуулах" }),
            /* @__PURE__ */ jsxs("button", { type: "button", className: "aps-btn primary split", children: [
              /* @__PURE__ */ jsx("em", { children: "Эхлэх" }),
              /* @__PURE__ */ jsx("span", { className: "aps-cell", children: icons.arrow })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "aps-card", children: p3.tasks.map((t2) => /* @__PURE__ */ jsxs("div", { className: "aps-task " + t2.status, children: [
        /* @__PURE__ */ jsx("span", { className: "aps-st " + t2.status }),
        /* @__PURE__ */ jsx("span", { children: t2.title }),
        /* @__PURE__ */ jsx("span", { className: "aps-meta", children: t2.owner }),
        /* @__PURE__ */ jsx("span", { className: "aps-chip", children: t2.due ?? statusLabel[t2.status] })
      ] }, t2.id)) })
    ] }),
    /* @__PURE__ */ jsxs("aside", { className: "aps-card aps-truth", children: [
      /* @__PURE__ */ jsx("span", { className: "aps-label", children: "Одоогийн үнэн" }),
      /* @__PURE__ */ jsx("ul", { children: p3.truth.map((t2) => /* @__PURE__ */ jsx("li", { children: t2 }, t2)) })
    ] })
  ] });
}
function ChatScreen({ data }) {
  const c9 = data.chat;
  return /* @__PURE__ */ jsxs("div", { className: "aps-chatgrid", children: [
    /* @__PURE__ */ jsxs("div", { className: "aps-chat", children: [
      /* @__PURE__ */ jsx("div", { className: "aps-q", children: c9.question }),
      /* @__PURE__ */ jsx(CitedAnswer, { segments: c9.segments, sources: c9.sources, pagesRead: 3 }),
      /* @__PURE__ */ jsxs("div", { className: "aps-field", children: [
        icons.spark,
        /* @__PURE__ */ jsx("input", { readOnly: true, value: "", placeholder: "Дараагийн асуултаа бич…", "aria-label": "Асуулт" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "aps-btn primary icon", "aria-label": "Илгээх", children: icons.arrow })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("aside", { className: "aps-chat", children: [
      /* @__PURE__ */ jsxs("div", { className: "aps-head", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-label", children: "Thinking State" }),
        /* @__PURE__ */ jsx(RunningNow, { tasks: c9.running, brand: null, align: "end" })
      ] }),
      /* @__PURE__ */ jsx(AgentPlan, { title: "Хариулахаас өмнөх төлөвлөгөө", defaultSteps: c9.plan, status: "done", estimate: "~5 с" }),
      /* @__PURE__ */ jsx(DecisionCard, { decisions: c9.decisions, host: true })
    ] })
  ] });
}
function MemoryScreen({ data }) {
  return /* @__PURE__ */ jsxs("div", { style: { maxWidth: 760, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("h1", { className: "aps-h1", children: "Санах ой" }),
    /* @__PURE__ */ jsx("p", { className: "aps-sub", children: "Агент юуг санаж байгааг хүн харж, засаж, мартуулна. Бүгд эх сурвалжтай." }),
    /* @__PURE__ */ jsx(MemoryPanel, { memories: data.memories, categories: data.memoryCategories, title: `${data.company}-ийн санах ой`, maxHeight: 520 })
  ] });
}
function TeamScreen({ data }) {
  const t2 = data.team;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { className: "aps-h1", children: "Нэг тархитай баг" }),
    /* @__PURE__ */ jsx("p", { className: "aps-sub", children: "Хүн бүр, агент бүр нэг санах ойгоос уншиж, нэг самбар дээр ажиллана." }),
    /* @__PURE__ */ jsx(SessionBoard, { project: t2.project, groups: t2.groups, sessions: t2.sessions, me: t2.me })
  ] });
}
function AppScreen({ screen, data, theme = "day", variant = "tabs", still = false, labels = appScreenLabelsMn, onSelect, className = "" }) {
  const dark = theme === "night";
  const body = {
    inbox: /* @__PURE__ */ jsx(InboxScreen, { data, labels }),
    note: /* @__PURE__ */ jsx(NoteScreen, { data }),
    project: /* @__PURE__ */ jsx(ProjectScreen, { data, labels }),
    chat: /* @__PURE__ */ jsx(ChatScreen, { data }),
    memory: /* @__PURE__ */ jsx(MemoryScreen, { data }),
    team: /* @__PURE__ */ jsx(TeamScreen, { data })
  }[screen];
  const counts = { inbox: data.inbox.filter((i3) => !i3.processed).length, project: data.project.total - data.project.done, memory: data.memories.length };
  return /* @__PURE__ */ jsx(MotionProvider, { paused: still, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `aps-root ${dark ? "dark " : ""}${still ? "aps-still " : ""}${className}`,
      "data-ts-theme": dark ? "dark" : "cream",
      "data-theme": dark ? "dark" : "light",
      style: { height: "100%" },
      children: [
        /* @__PURE__ */ jsx("style", { children: CSS$1 }),
        /* @__PURE__ */ jsx("div", { className: "aps-stage", children: /* @__PURE__ */ jsx(AppWindow, { screen, variant, labels, counts, onSelect, company: data.company, children: body }) })
      ]
    }
  ) });
}
const acmeDemo = {
  company: "ACME",
  inbox: [
    { id: "i1", kind: "voice", title: "Үнийн шинэ багцыг 3 түвшинтэй болгох санаа", meta: "Дуут тэмдэглэл · 08:40", suggest: "Төсөл · Үнийн шинэчлэл", next: "Гурван түвшний хүснэгтийн ноорог гаргах" },
    { id: "i2", kind: "link", title: "Харилцагчийн хадгалалтын тайлан 2026", meta: "Холбоос · 09:12", suggest: "Нөөц · Судалгаа" },
    { id: "i3", kind: "mail", title: "Нийлүүлэгч: 12-р сарын нийлүүлэлт 5 хоног хоцорно", meta: "Имэйл · 09:30", suggest: "Төсөл · Агуулахын шилжилт", next: "Борлуулалтад хоцролтыг мэдэгдэх" },
    { id: "i4", kind: "idea", title: "Шинэ ажилтны чиглүүлгийг нэг хуудас болгох", meta: "Санаа · 10:05", suggest: "Хариуцлагын хүрээ · Баг" },
    { id: "i5", kind: "file", title: "3-р улирлын борлуулалт.xlsx", meta: "Файл · 10:21", suggest: "Төсөл · Улирлын тайлан", processed: true },
    { id: "i6", kind: "link", title: "Өрсөлдөгчийн үнийн хуудас", meta: "Холбоос · Өчигдөр", suggest: "Нөөц · Зах зээл", processed: true }
  ],
  note: {
    title: "Үнийн багцыг гурван түвшинтэй болгоно",
    kind: "Шийдвэр",
    date: "2026-11-14",
    body: [
      "ACME компанийн шинэ харилцагчдын 62% нь хамгийн хямд багцыг сонгоод, гурван сарын дотор дээд багц руу шилждэг.",
      "Тиймээс дунд түвшин нэмж, шилжих алхмыг богиносгоно. Дээд багцын үнэ хэвээр."
    ],
    source: "Харилцагчийн хадгалалтын тайлан 2026 · 3-р улирлын борлуулалт",
    tags: ["үнэ", "борлуулалт", "шийдвэр"],
    links: [
      { id: "l1", title: "Харилцагч гурван сард багцаа ахиулдаг", kind: "knowledge", why: "Шийдвэрийн үндэслэл" },
      { id: "l2", title: "Үнийн шинэчлэл", kind: "project", why: "Энэ шийдвэрийг хэрэгжүүлэх төсөл" },
      { id: "l3", title: "Өрсөлдөгчийн үнийн хуудас", kind: "source", why: "Зах зээлийн харьцуулалт" },
      { id: "l4", title: "Хямдралыг жилийн төлбөрт л өгнө", kind: "decision", why: "Хамааралтай өмнөх шийдвэр" }
    ],
    backlinks: 7
  },
  project: {
    name: "Үнийн шинэчлэл",
    area: "Борлуулалт",
    why: "Шинэ харилцагч дээд багц руу хурдан шилжиж, сарын давтагдах орлого өснө.",
    done: 5,
    total: 9,
    next: { title: "Гурван түвшний хүснэгтийн ноорог гаргах", context: "@компьютер · 30 мин", owner: "Үнийн агент" },
    tasks: [
      { id: "t1", title: "Одоогийн багцын хэрэглээг задлах", status: "done", owner: "Судлаач агент" },
      { id: "t2", title: "Өрсөлдөгчийн үнийг харьцуулах", status: "done", owner: "Судлаач агент" },
      { id: "t3", title: "Гурван түвшний хүснэгтийн ноорог", status: "doing", owner: "Үнийн агент", due: "11/19" },
      { id: "t4", title: "Санхүүгийн нөлөөллийн тооцоо", status: "waiting", owner: "Санхүү", due: "11/21" },
      { id: "t5", title: "Үнийн хуудсыг сайтад шинэчлэх", status: "todo", owner: "Вэб агент", due: "11/26" }
    ],
    truth: ["Дунд түвшин нэмэхээр шийдсэн (11/14)", "Дээд багцын үнэ хэвээр", "Санхүүгийн тооцоог хүлээж байна"]
  },
  chat: {
    question: "Шинэ үнийн багц орлогод яаж нөлөөлөх вэ? Эх сурвалжтайгаар.",
    plan: [
      { id: "p1", title: "Санах ойгоос үнийн шийдвэрүүдийг татах", tool: "memory.search", status: "done", duration: 0.8 },
      { id: "p2", title: "3-р улирлын борлуулалтыг уншиж задлах", tool: "files.read", status: "done", duration: 1.4 },
      { id: "p3", title: "Хадгалалтын тайлантай тулгах", tool: "notes.link", status: "done", duration: 1.1 },
      { id: "p4", title: "Гурван хувилбарын орлогыг тооцох", tool: "sheet.model", status: "done", duration: 1.6 }
    ],
    segments: [
      { text: "Дунд түвшин нэмбэл сарын давтагдах орлого эхний улиралд ойролцоогоор 8–11% өснө.", cite: ["sales"] },
      { text: " Учир нь шинэ харилцагчдын 62% нь хямд багцаас гурван сарын дотор ахиулдаг бөгөөд дунд шат энэ алхмыг богиносгоно.", cite: ["retention"] },
      { text: "Эрсдэл: дээд багцын зарим харилцагч дунд түвшин рүү буух магадлалтай.", cite: ["decision"], paragraph: true }
    ],
    sources: [
      { id: "sales", title: "3-р улирлын борлуулалт", site: "Файл · Тэмдэглэл", date: "2026-10-31", quote: "Хямд багц 58%, дээд багц 31%, жилийн төлбөр 11%.", highlight: "Хямд багц 58%" },
      { id: "retention", title: "Харилцагчийн хадгалалтын тайлан 2026", site: "Нөөц · Судалгаа", date: "2026-11-02", quote: "Шинэ харилцагчдын 62% нь гурван сарын дотор багцаа ахиулсан.", highlight: "62%" },
      { id: "decision", title: "Үнийн багцыг гурван түвшинтэй болгоно", site: "Атом · Шийдвэр", date: "2026-11-14", quote: "Дунд түвшин нэмж, шилжих алхмыг богиносгоно.", highlight: "Дунд түвшин" }
    ],
    decisions: [
      {
        id: "d1",
        question: "Дунд түвшний үнийг аль хувилбараар тавих вэ?",
        task: "Үнийн шинэчлэл",
        kind: "decision",
        options: [
          { id: "a", title: "Дээд багцын 60%", summary: "Орлого +11%, буух эрсдэл дунд", recommended: true },
          { id: "b", title: "Дээд багцын 75%", summary: "Орлого +8%, буух эрсдэл бага" }
        ]
      }
    ],
    running: [
      { id: "r1", title: "Үнийн хүснэгтийн ноорог", step: "Хувилбаруудыг харьцуулж байна", done: 3, total: 5, state: "running" },
      { id: "r2", title: "Нийлүүлэлтийн хоцролт", step: "Шийдвэр хэрэгтэй", done: 2, total: 4, state: "needs-you" },
      { id: "r3", title: "Долоо хоногийн тойм", step: "Бэлэн", done: 4, total: 4, state: "done" }
    ]
  },
  memories: [
    { id: "m1", text: "Хямдралыг зөвхөн жилийн төлбөрт өгнө", category: "Шийдвэр", source: "Атомаас", date: "11/02" },
    { id: "m2", text: "Үнийн өөрчлөлтийг сарын 1-нд л зарлана", category: "Шийдвэр", source: "Чатаас", date: "11/10" },
    { id: "m3", text: "Дунд түвшин нэмэхээр шийдсэн", category: "Шийдвэр", source: "Атомаас", date: "11/14" },
    { id: "m4", text: "Баасан гараг бүр борлуулалтын тойм гаргана", category: "Хэмнэл", source: "Гараар нэмсэн", date: "10/28" },
    { id: "m5", text: "Тайланг эхлээд нэг өгүүлбэрээр, дараа нь задална", category: "Хэв маяг", source: "Чатаас", date: "10/30" },
    { id: "m6", text: "Санхүүгийн тооцоог Санхүүгийн агент баталгаажуулна", category: "Баг", source: "Багийн самбараас", date: "11/05" },
    { id: "m7", text: "Нийлүүлэгчийн хоцролтыг 24 цагт мэдэгдэнэ", category: "Хэмнэл", source: "Имэйлээс", date: "11/17", paused: true }
  ],
  memoryCategories: ["Шийдвэр", "Хэмнэл", "Хэв маяг", "Баг"],
  team: {
    project: { name: "ACME · Нэг тархи", icon: "A", status: { label: "6 агент ажиллаж байна" }, owner: "Борлуулалт", stats: { tasks: 18, decisions: 7, pages: 42 } },
    groups: [
      { id: "projects", label: "Төслүүд" },
      { id: "areas", label: "Хариуцлагын хүрээ" }
    ],
    sessions: [
      { id: "price", title: "Үнийн шинэчлэл", line: "Гурван түвшний хүснэгтийг харьцуулж байна", state: "running", group: "projects", owner: "Борлуулалт", sharedWith: ["Санхүү"] },
      { id: "price-fin", title: "Санхүүгийн нөлөөлөл", line: "Шийдвэр хүлээж байна: дунд түвшний үнэ", state: "waiting", group: "projects", parent: "price", owner: "Санхүү" },
      { id: "price-web", title: "Үнийн хуудас", line: "Ноорог бэлэн, нийтлэхээс өмнө зөвшөөрөл", state: "done", group: "projects", parent: "price", owner: "Вэб" },
      { id: "stock", title: "Агуулахын шилжилт", line: "Нийлүүлэлтийн хоцролтыг төлөвлөгөөнд оруулж байна", state: "running", group: "projects", owner: "Үйл ажиллагаа" },
      { id: "onb", title: "Шинэ ажилтны чиглүүлэг", line: "Нэг хуудсын ноорог хүлээгдэж байна", state: "idle", group: "areas", owner: "Хүний нөөц" },
      { id: "weekly", title: "Долоо хоногийн тойм", line: "14 зүйл ангилж, 3 даалгавар үүсгэлээ", state: "done", group: "areas", owner: "Борлуулалт" }
    ],
    me: "Борлуулалт"
  }
};
export {
  AgentConsent,
  AppScreen,
  AppShell,
  AppWindow,
  A as AskWindow,
  Autoplay,
  B as BRAND_LOGO,
  a5 as BRAND_MARK,
  b3 as BRAND_NAME,
  Badge,
  BrainField,
  BrainGrowth,
  BrainMap,
  B2 as BuildWizard,
  Button,
  COMPANY_VIEWS,
  Card,
  C as CashRiver,
  C2 as CeoDaily,
  a6 as CeoDailyScreen,
  b4 as CeoMeetingOverview,
  ChatScreen,
  CitedAnswer,
  CollectionPanel,
  CollectionView,
  CompanyMini,
  CompanyView,
  C4 as ContentPipeline,
  C3 as ConvergeNet,
  D as DURATIONS,
  Dashboard,
  DecisionInboxChat,
  E as EASINGS,
  Empty,
  FIELD_ICON,
  F as FinanceReport,
  Footer,
  GAPS,
  Icon,
  IconTile,
  InboxScreen,
  LEVELS,
  L2 as LOOP,
  L as LOOPS,
  h as LOOP_NOTES,
  i as LoopRegion,
  MEGA_CLOSE_DELAY,
  METHODOLOGIES,
  MemoryScreen,
  M as MethodQuiz,
  MethodologyView,
  a2 as ModuleScene,
  j as MotionContext,
  MotionControls,
  MotionProvider,
  MotionStyles,
  NavBar,
  NoteScreen,
  P as PARA_KEYS,
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
  ProjectScreen,
  RaciView,
  RelDate,
  RelationChip,
  Replay,
  RoleDashboard,
  SCREENS,
  S4 as SEGMENT_ALIASES,
  S3 as SOURCE_ICON,
  SPACE,
  S2 as SPRINGS,
  STATUS,
  STATUSES,
  STATUS_ICON,
  STATUS_ORDER,
  ScenarioChat,
  S as ScenarioRegion,
  SessionBoard,
  c3 as SourceIcon,
  d3 as SourcePreview,
  SplitCTA,
  Stack,
  StatusPill,
  TYPE_ICON,
  TYPE_LABEL,
  TYPE_TONE,
  Tabs,
  TeamScreen,
  Text,
  TypeBadge,
  U2 as UNCONTROLLED_MAX_MS,
  UNIT_ICON,
  U as UseCaseRun,
  Wordmark,
  acmeDemo,
  a4 as acmeParaVocab,
  actorOf,
  agentConsentLabelsMn,
  animateSpring,
  appScreenLabelsMn,
  b2 as appShellDemo,
  c2 as appShellLabelsMn,
  d2 as appShellLogisticsDemo,
  a3 as askNavMn,
  b as askWindowDemo,
  c as askWindowDemoNote,
  d as askWindowLabelsMn,
  e as askWindowMicroMn,
  brainGrowthDemo,
  brainGrowthStops,
  brainMapDemo,
  e3 as brandTrademarkNoteMn,
  b5 as buildWizardDemo,
  a8 as buildWizardLabelsMn,
  c4 as cashRiverDemo,
  c5 as ceoDailyDemo,
  d4 as ceoDailyLogisticsDemo,
  e4 as ceoDailyScreenDemo,
  companyLabelsMn,
  companyMiniLabelsMn,
  c8 as contentPipelineDemo,
  c7 as convergeNetDemo,
  a9 as convergeNetGraphDemo,
  b6 as convergeNetLayout,
  d5 as convergeNetStagesDemo,
  e5 as convergeStagesLayout,
  f as dampingRatio,
  dependenciesOf,
  dependencyText,
  f3 as drawConvergeNet,
  g2 as drawConvergeStages,
  dueBucket,
  fieldIcon,
  f2 as financeReportDemo,
  findPerson,
  gapVar,
  inferKind,
  isHeld,
  kindsOf,
  layoutBrain,
  linkLabel,
  l as loopAnimation,
  m4 as methodQuizDemo,
  a7 as methodQuizLabelsMn,
  methodologyName,
  methodologyShort,
  modelLines,
  m as moduleSceneDemo,
  m2 as motionControlLabelsMn,
  k as motionCss,
  g as motionTokensCss,
  m3 as motionVar,
  navBarLabelsMn,
  paraBaseMn,
  p2 as paraNetGroups,
  h3 as pickNoteNodes,
  prefersReducedMotion,
  priorityOf,
  raciOf,
  rangeText,
  relatedTo,
  relativeDay,
  resolveFields,
  c6 as resolveSegment,
  r as roleDashboardLabelsMn,
  a as roleView,
  rootsOf,
  scenarioChatLabelsMn,
  scopeCompany,
  s2 as scoreMethods,
  s3 as segmentFromSearch,
  s as sourcePreviewLabelsMn,
  spring,
  h2 as springAt,
  i2 as springDuration,
  j2 as springEasing,
  e2 as springKeyframes,
  statusGroup,
  subtreeIds,
  taskIndex,
  taskRaciOf,
  t as toDraftCompany,
  toPhaseState,
  toPmArea,
  toPmPhase,
  toSessionState,
  typeIcon,
  typeLabel,
  useBrainProgress,
  u as useCaseRunDemo,
  n as useInViewLoop,
  o as useLoop,
  p as useMotion,
  q as usePrefersReducedMotion,
  useScenario,
  withReplay
};
//# sourceMappingURL=index.js.map
