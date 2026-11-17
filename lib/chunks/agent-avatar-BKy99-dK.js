import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import "react";
const AGENT_ROLES = ["agent", "planner", "writer", "designer", "coder", "support", "research", "ops", "finance", "sales"];
const agentAvatarLabelsMn = {
  roles: { agent: "Агент", planner: "Төлөвлөгч агент", writer: "Бичигч агент", designer: "Дизайны агент", coder: "Кодын агент", support: "Тусламжийн агент", research: "Судлаач агент", ops: "Үйл ажиллагааны агент", finance: "Санхүүгийн агент", sales: "Борлуулалтын агент" },
  status: { running: "ажиллаж байна", "needs-you": "таныг хүлээж байна", error: "алдаатай", done: "дууссан", idle: "зогссон" }
};
const ICON = {
  agent: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M12 8V4H8" }),
    /* @__PURE__ */ jsx("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M2 14h2" }),
    /* @__PURE__ */ jsx("path", { d: "M20 14h2" }),
    /* @__PURE__ */ jsx("path", { d: "M15 13v2" }),
    /* @__PURE__ */ jsx("path", { d: "M9 13v2" })
  ] }),
  planner: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "m3 17 2 2 4-4" }),
    /* @__PURE__ */ jsx("path", { d: "m3 7 2 2 4-4" }),
    /* @__PURE__ */ jsx("path", { d: "M13 6h8" }),
    /* @__PURE__ */ jsx("path", { d: "M13 12h8" }),
    /* @__PURE__ */ jsx("path", { d: "M13 18h8" })
  ] }),
  writer: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M12 20h9" }),
    /* @__PURE__ */ jsx("path", { d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" })
  ] }),
  designer: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M22 6H2" }),
    /* @__PURE__ */ jsx("path", { d: "M22 18H2" }),
    /* @__PURE__ */ jsx("path", { d: "M6 2v20" }),
    /* @__PURE__ */ jsx("path", { d: "M18 2v20" })
  ] }),
  coder: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "m16 18 6-6-6-6" }),
    /* @__PURE__ */ jsx("path", { d: "m8 6-6 6 6 6" })
  ] }),
  support: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "m4.93 4.93 4.24 4.24" }),
    /* @__PURE__ */ jsx("path", { d: "m14.83 9.17 4.24-4.24" }),
    /* @__PURE__ */ jsx("path", { d: "m14.83 14.83 4.24 4.24" }),
    /* @__PURE__ */ jsx("path", { d: "m9.17 14.83-4.24 4.24" })
  ] }),
  research: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
  ] }),
  ops: /* @__PURE__ */ jsx("path", { d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" }),
  finance: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M6 12h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M18 12h.01" })
  ] }),
  sales: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M22 7 13.5 15.5l-5-5L2 17" }),
    /* @__PURE__ */ jsx("path", { d: "M16 7h6v6" })
  ] })
};
const SHAPE = { running: "circle", "needs-you": "diamond", error: "square", done: "check", idle: "ring" };
const CSS = `
.aav{position:relative;display:inline-grid;place-items:center;flex:none;width:var(--aav-size,26px);height:var(--aav-size,26px);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:var(--ts-fg);vertical-align:middle}
.aav[data-bare]{border:0;background:none;color:inherit}
.aav-icon{width:60%;height:60%;fill:none;stroke:currentColor;stroke-width:var(--ts-icon-stroke,1.5);stroke-linecap:round;stroke-linejoin:round}
.aav-dot{position:absolute;right:-3px;bottom:-3px;display:grid;place-items:center;width:10px;height:10px;box-sizing:border-box;border:1.5px solid var(--ts-surface);background:var(--aav-mark);color:var(--ts-surface)}
.aav-dot[data-shape="circle"]{border-radius:50%}
.aav-dot[data-shape="diamond"]{transform:rotate(45deg);border-radius:1px}
.aav-dot[data-shape="square"]{border-radius:1px}
.aav-dot[data-shape="check"]{border-radius:50%}
.aav-dot[data-shape="check"] svg{width:6px;height:6px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.aav-dot[data-shape="ring"]{border-radius:50%;background:var(--ts-surface);box-shadow:inset 0 0 0 1.5px var(--aav-mark)}
.aav[data-status="running"]{--aav-mark:var(--ts-status-running-fg)}
.aav[data-status="needs-you"]{--aav-mark:var(--ts-status-needs-you-fg)}
.aav[data-status="error"]{--aav-mark:var(--ts-status-error-fg)}
.aav[data-status="done"]{--aav-mark:var(--ts-status-done-fg)}
.aav[data-status="idle"]{--aav-mark:var(--ts-muted)}
.aav[data-status="running"] .aav-dot{animation:aav-pulse var(--ts-motion-loop-period,2.4s) var(--ts-motion-ease-loop,ease-in-out) infinite}
@keyframes aav-pulse{50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){.aav[data-status="running"] .aav-dot{animation:none}}
`;
function AgentAvatar({ role = "agent", status, size, decorative = false, bare = false, labels = agentAvatarLabelsMn, className = "" }) {
  const name = labels.roles[role] + (status ? ` · ${labels.status[status]}` : "");
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `aav ${className}`.trim(),
      "data-role": role,
      "data-status": status,
      "data-bare": bare ? "" : void 0,
      style: size ? { "--aav-size": `${size}px` } : void 0,
      ...decorative ? { "aria-hidden": true } : { role: "img", "aria-label": name, title: name },
      children: [
        /* @__PURE__ */ jsx("style", { children: CSS }),
        /* @__PURE__ */ jsx("svg", { className: "aav-icon", viewBox: "0 0 24 24", "aria-hidden": "true", children: ICON[role] }),
        status && /* @__PURE__ */ jsx("span", { className: "aav-dot", "data-shape": SHAPE[status], children: status === "done" && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 8 8", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M1.5 4.2 3.3 6l3.2-3.8" }) }) })
      ]
    }
  );
}
const ROLE_WORDS = [
  [/төлөвлө/i, "planner"],
  [/бичигч|бичвэр|контент/i, "writer"],
  [/дизайн/i, "designer"],
  [/код|хөгжүүл|вэб/i, "coder"],
  [/тусламж|харилцагч/i, "support"],
  [/судлаач|судалгаа|шинжээч/i, "research"],
  [/үйл ажиллагаа|хувилбар/i, "ops"],
  [/санхүү|үнийн|тооцоо|нягтлан/i, "finance"],
  [/борлуулалт|маркетинг/i, "sales"],
  [/шалгагч|хянагч/i, "research"]
];
function agentRoleFrom(label) {
  if (!label) return "agent";
  for (const [re, role] of ROLE_WORDS) if (re.test(label)) return role;
  return "agent";
}
function agentStatusFrom(status) {
  if (status === "running") return "running";
  if (status === "waiting" || status === "needs-you") return "needs-you";
  if (status === "failed" || status === "error") return "error";
  if (status === "done") return "done";
  return "idle";
}
const agentAvatarDemo = { role: "writer", status: "running" };
export {
  AgentAvatar as A,
  agentStatusFrom as a,
  agentRoleFrom as b,
  agentAvatarLabelsMn as c,
  AGENT_ROLES as d,
  agentAvatarDemo as e
};
//# sourceMappingURL=agent-avatar-BKy99-dK.js.map
