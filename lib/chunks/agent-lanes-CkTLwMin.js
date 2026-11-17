import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const agentLanesLabelsMn = {
  title: "Агентууд",
  running: (n) => `${n} ажиллаж байна`,
  needsYou: (n) => `Таны ээлж: ${n}`,
  lastSpan: (m) => `Сүүлийн ${m} мин`,
  now: "одоо",
  tick: (m) => `−${m} мин`,
  idle: "Сул",
  status: { done: "Дууссан", running: "Ажиллаж байна", waiting: "Таны ээлж", failed: "Алдаатай" },
  approve: "Батлах",
  reject: "Татгалзах",
  open: "Нээх",
  defaultAsk: "Энэ алхмыг батлах уу?",
  popoverFallback: (status) => status,
  srWaiting: (n) => `Таны ээлжийг хүлээж буй даалгавар: ${n}`,
  ago: (m) => m <= 0 ? "саяхан" : `${m} мин өмнө`,
  blockLabel: (agent, title, status, ago) => `${agent}: ${title}, ${status}, эхэлсэн: ${ago}`
};
const MIN = 6e4;
const logo = {
  claude: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.6", fill: "none", stroke: "#d97757", strokeWidth: "1.6" }) }),
  openai: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("rect", { x: "2.6", y: "2.6", width: "10.8", height: "10.8", rx: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }) }),
  gemini: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 2 14 13.5H2Z", fill: "none", stroke: "#3b82f6", strokeWidth: "1.5", strokeLinejoin: "round" }) })
};
const legacyIcon = {
  notion: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { d: "M3.5 1.8h6l3 3v9.4h-9Z", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M5.5 8h5M5.5 10.5h5", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" })
  ] }),
  slack: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2Z", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" }) }),
  figma: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "12", height: "12", rx: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("path", { d: "M2 6h12M6 6v8", stroke: "currentColor", strokeWidth: "1.3" })
  ] }),
  github: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "4.5", cy: "3.5", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("circle", { cx: "4.5", cy: "12.5", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("circle", { cx: "11.5", cy: "6", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("path", { d: "M4.5 5v6M11.5 7.5c0 2-2 2.6-6 3.4", fill: "none", stroke: "currentColor", strokeWidth: "1.3" })
  ] }),
  stripe: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("rect", { x: "1.8", y: "3.5", width: "12.4", height: "9", rx: "1.6", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("path", { d: "M1.8 6.5h12.4M4.5 10h2.5", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" })
  ] })
};
const toolIcon = {
  ...legacyIcon,
  docs: legacyIcon.notion,
  chat: legacyIcon.slack,
  design: legacyIcon.figma,
  code: legacyIcon.github,
  payments: legacyIcon.stripe
};
const defaultAgents = [
  { id: "researcher", name: "Судлаач", model: "Судлаач агент", avatar: logo.claude },
  { id: "writer", name: "Бичигч", model: "Бичигч агент", avatar: logo.claude },
  { id: "reviewer", name: "Шалгагч", model: "Шалгагч агент", avatar: logo.openai },
  { id: "ops", name: "Үйл ажиллагаа", model: "Үйл ажиллагааны агент", avatar: logo.gemini }
];
const demoTasks = (t) => [
  { id: "t1", agentId: "researcher", title: "Өрсөлдөгчийн тариф", status: "done", start: t - 31.6 * MIN, end: t - 21.5 * MIN, handoffTo: "t3", summary: "6 өрсөлдөгчийн тарифын хуудсыг хэрэглэгч тус бүрээр харьцуулсан." },
  { id: "t2", agentId: "researcher", title: "Хэрэглэгчийн ярилцлага", status: "running", start: t - 14 * MIN, tools: ["docs", "chat"], summary: "18 ярилцлагаас ишлэлүүдийг ангилж байна." },
  { id: "t3", agentId: "writer", title: "Тарифын хуудасны ноорог", status: "done", start: t - 20 * MIN, end: t - 1.6 * MIN, handoffTo: "t5", tools: ["design", "docs"], summary: "Гурван багц, бичвэр ба загвар дизайны файлд." },
  { id: "t4", agentId: "reviewer", title: "#482 төлбөрийн засвар", status: "done", start: t - 31.2 * MIN, end: t - 24 * MIN, summary: "Хоёр сэтгэгдэлтэйгээр баталсан." },
  { id: "t5", agentId: "reviewer", title: "Тарифын бичвэр шалгах", status: "running", start: t - 0.8 * MIN, tools: ["design"], summary: "Өнгө аяс, тоонуудыг шалгаж байна." },
  { id: "t6", agentId: "ops", title: "Харилцагчийн бүртгэл синк", status: "failed", start: t - 30.6 * MIN, end: t - 26 * MIN, summary: "Харилцагчийн бүртгэлийн токен хүчингүй болсон." },
  { id: "t7", agentId: "ops", title: "API түлхүүр солих", status: "waiting", start: t - 17 * MIN, tools: ["payments", "code"], ask: "Төлбөрийн системийн идэвхтэй түлхүүрийг сольж, хувилбарын хяналтын нууц утгыг шинэчлэх үү?" }
];
function AgentLanes({
  agents = defaultAgents,
  tasks: tasksProp,
  span = 30 * MIN,
  now: nowProp,
  title: titleProp,
  labels,
  className = "",
  onApprove,
  onReject,
  onOpen
}) {
  const L = { ...agentLanesLabelsMn, ...labels };
  const title = titleProp ?? L.title;
  const ago = (ms) => L.ago(Math.round(ms / MIN));
  const [mountedAt] = React.useState(() => Date.now());
  const [clock, setClock] = React.useState(mountedAt);
  React.useEffect(() => {
    if (nowProp !== void 0) return;
    const id = window.setInterval(() => setClock(Date.now()), 1e3);
    return () => window.clearInterval(id);
  }, [nowProp]);
  const now = nowProp ?? clock;
  const [local, setLocal] = React.useState(() => tasksProp ?? demoTasks(mountedAt));
  React.useEffect(() => {
    if (tasksProp) setLocal(tasksProp);
  }, [tasksProp]);
  const tasks = local;
  const [openId, setOpenId] = React.useState(null);
  const blockRefs = React.useRef({});
  const from = now - span;
  const x = (t) => (t - from) / span * 100;
  const endOf = (t) => t.end === void 0 || t.status === "running" || t.status === "waiting" ? now : t.end;
  const running = tasks.filter((t) => t.status === "running").length;
  const waiting = tasks.filter((t) => t.status === "waiting").length;
  const laneIndex = (id) => agents.findIndex((a) => a.id === id);
  const ticks = [25, 20, 15, 10, 5].map((m) => m * MIN).filter((m) => m < span);
  const ROW = 50;
  const decide = (task, ok) => {
    if (ok) onApprove?.(task);
    else onReject?.(task);
    if (!(ok ? onApprove : onReject)) {
      setLocal(
        (ts) => ts.map((t) => t.id === task.id ? { ...t, status: ok ? "running" : "failed", end: ok ? void 0 : now } : t)
      );
    }
    setOpenId(null);
    blockRefs.current[task.id]?.focus();
  };
  const curves = tasks.filter((t) => t.handoffTo).map((t) => {
    const to = tasks.find((n) => n.id === t.handoffTo);
    if (!to) return null;
    const a = laneIndex(t.agentId);
    const b = laneIndex(to.agentId);
    if (a < 0 || b < 0) return null;
    const x1 = x(endOf(t));
    const x2 = x(to.start);
    const y1 = a * ROW + ROW / 2;
    const y2 = b * ROW + ROW / 2;
    const live = to.status === "running";
    return { id: t.id, d: `M${x1} ${y1} C${x1 + 1.5} ${y1}, ${x2 - 1.5} ${y2}, ${x2} ${y2}`, live };
  }).filter(Boolean);
  return /* @__PURE__ */ jsxs("section", { className: `al ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "al-bar", children: [
      /* @__PURE__ */ jsxs("svg", { className: "al-spark", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("path", { d: "M6.5 2c.4 2.6 1.9 4.1 4.5 4.5-2.6.4-4.1 1.9-4.5 4.5C6.1 8.4 4.6 6.9 2 6.5 4.6 6.1 6.1 4.6 6.5 2Z", fill: "currentColor" }),
        /* @__PURE__ */ jsx("circle", { cx: "12.5", cy: "12.5", r: "1.2", fill: "currentColor", opacity: ".6" })
      ] }),
      /* @__PURE__ */ jsx("strong", { children: title }),
      /* @__PURE__ */ jsxs("span", { className: "al-stat", children: [
        /* @__PURE__ */ jsx("i", { className: "al-dot run" }),
        L.running(running)
      ] }),
      waiting > 0 && /* @__PURE__ */ jsxs("span", { className: "al-stat warn", children: [
        /* @__PURE__ */ jsx("i", { className: "al-dot warn" }),
        L.needsYou(waiting)
      ] }),
      /* @__PURE__ */ jsx("span", { className: "al-span", children: L.lastSpan(Math.round(span / MIN)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "al-grid", children: [
      /* @__PURE__ */ jsx("div", { className: "al-names", children: agents.map((a) => {
        const mine = tasks.filter((t) => t.agentId === a.id);
        const needs = mine.some((t) => t.status === "waiting");
        const busy = mine.some((t) => t.status === "running");
        return /* @__PURE__ */ jsxs("div", { className: "al-agent", children: [
          /* @__PURE__ */ jsx("span", { className: "al-avatar", children: a.avatar ?? a.name.split(" ").map((w) => w[0]).join("").slice(0, 2) }),
          /* @__PURE__ */ jsxs("span", { className: "al-who", children: [
            /* @__PURE__ */ jsxs("span", { className: "al-name", children: [
              a.name,
              needs ? /* @__PURE__ */ jsx("span", { className: "al-tag warn", children: L.status.waiting }) : !busy ? /* @__PURE__ */ jsx("span", { className: "al-tag", children: L.idle }) : null
            ] }),
            a.model && /* @__PURE__ */ jsx("span", { className: "al-model", children: a.model })
          ] })
        ] }, a.id);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "al-track", children: [
        /* @__PURE__ */ jsxs("div", { className: "al-ticks", "aria-hidden": "true", children: [
          ticks.map((m) => /* @__PURE__ */ jsx("span", { style: { left: `${100 - m / span * 100}%` }, children: L.tick(Math.round(m / MIN)) }, m)),
          /* @__PURE__ */ jsx("span", { className: "al-now", children: L.now })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "al-lanes", style: { height: agents.length * ROW }, children: [
          ticks.map((m) => /* @__PURE__ */ jsx("i", { className: "al-vline", style: { left: `${100 - m / span * 100}%` } }, m)),
          /* @__PURE__ */ jsx("svg", { className: "al-curves", viewBox: `0 0 100 ${agents.length * ROW}`, preserveAspectRatio: "none", "aria-hidden": "true", children: curves.map((c) => /* @__PURE__ */ jsx("path", { d: c.d, className: c.live ? "live" : "", vectorEffect: "non-scaling-stroke" }, c.id)) }),
          agents.map((a, i) => /* @__PURE__ */ jsx("ul", { className: "al-lane", "aria-label": a.name, style: { top: i * ROW, height: ROW }, children: tasks.filter((t) => t.agentId === a.id && endOf(t) > from).map((t) => {
            const left = x(t.start);
            const right = x(endOf(t));
            const open = openId === t.id;
            return /* @__PURE__ */ jsxs("li", { className: "al-li", style: { left: `${left}%`, width: `${Math.max(1.4, right - left)}%` }, children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  ref: (el) => {
                    blockRefs.current[t.id] = el;
                  },
                  className: `al-block ${t.status} ${left < 0 ? "clip" : ""}`,
                  "aria-label": L.blockLabel(a.name, t.title, L.status[t.status], ago(now - t.start)),
                  "aria-expanded": t.status === "waiting" ? open : void 0,
                  onClick: () => setOpenId(open ? null : t.id),
                  children: [
                    t.tools?.map((tool) => /* @__PURE__ */ jsx("span", { className: "al-tool", children: toolIcon[tool] }, tool)),
                    /* @__PURE__ */ jsx("span", { className: "al-title", children: t.title }),
                    t.status === "waiting" && /* @__PURE__ */ jsxs("span", { className: "al-flag", children: [
                      /* @__PURE__ */ jsx("svg", { viewBox: "0 0 12 12", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 1.5 11 10.5H1Z", fill: "currentColor" }) }),
                      L.status.waiting
                    ] })
                  ]
                }
              ),
              open && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `al-pop ${i >= agents.length - 2 ? "up" : ""}`,
                  role: t.status === "waiting" ? "dialog" : "tooltip",
                  "aria-label": t.title,
                  onKeyDown: (e) => {
                    if (e.key === "Escape") {
                      setOpenId(null);
                      blockRefs.current[t.id]?.focus();
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsx("strong", { children: t.title }),
                    /* @__PURE__ */ jsx("p", { children: t.status === "waiting" ? t.ask ?? L.defaultAsk : t.summary ?? L.popoverFallback(L.status[t.status]) }),
                    t.status === "waiting" ? /* @__PURE__ */ jsxs("div", { className: "al-pop-actions", children: [
                      /* @__PURE__ */ jsx("button", { type: "button", className: "al-btn", onClick: () => decide(t, false), children: L.reject }),
                      /* @__PURE__ */ jsx("button", { type: "button", className: "al-btn primary", autoFocus: true, onClick: () => decide(t, true), children: L.approve })
                    ] }) : onOpen && /* @__PURE__ */ jsx("button", { type: "button", className: "al-link", onClick: () => onOpen(t), children: L.open })
                  ]
                }
              )
            ] }, t.id);
          }) }, a.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "al-list", "aria-hidden": "true", children: agents.map((a) => {
      const cur = tasks.filter((t) => t.agentId === a.id).sort((p, q) => q.start - p.start)[0];
      if (!cur) return null;
      return /* @__PURE__ */ jsxs("li", { className: "al-row", children: [
        /* @__PURE__ */ jsx("span", { className: "al-avatar", children: a.avatar ?? a.name.split(" ").map((w) => w[0]).join("").slice(0, 2) }),
        /* @__PURE__ */ jsxs("span", { className: "al-row-text", children: [
          /* @__PURE__ */ jsx("span", { className: "al-row-who", children: a.name }),
          /* @__PURE__ */ jsx("span", { className: "al-row-title", children: cur.title })
        ] }),
        /* @__PURE__ */ jsx("span", { className: `al-row-state ${cur.status}`, children: L.status[cur.status] })
      ] }, a.id);
    }) }),
    /* @__PURE__ */ jsx("p", { className: "al-sr", "aria-live": "polite", children: L.srWaiting(waiting) })
  ] });
}
const css = `
.al{--al-bg:#fff;--al-fg:#18181b;--al-muted:#65656d;--al-faint:#65656d;--al-line:#ececef;--al-chip:#f0f0f2;--al-done:#efefef;--al-blue:#3b82f6;--al-blue-bg:#e3effd;--al-blue-fg:#4a8fe0;--al-warn:#b93c0b;--al-warn-bg:#fdebd6;--al-red-bg:#fde4e4;--al-red:#c0262b;width:100%;max-width:760px;container-type:inline-size;background:var(--al-bg);color:var(--al-fg);border:1px solid var(--al-line);border-radius:12px;box-shadow:0 1px 3px #0000000d;font:400 13px/1.4 Inter,system-ui,sans-serif;position:relative}
:where(.dark,[data-theme=dark]) .al{--al-bg:#1b1b1e;--al-fg:#ececef;--al-muted:#a1a1aa;--al-faint:#9a9aa2;--al-line:#2e2e33;--al-chip:#2a2a2f;--al-done:#2a2a2e;--al-blue-bg:#1d2b40;--al-blue-fg:#7fb0f5;--al-warn:#f0883e;--al-warn-bg:#3a2717;--al-red-bg:#3a1e20;--al-red:#f47b7f;color-scheme:dark}
.al *{box-sizing:border-box}.al button{font:inherit;color:inherit;cursor:pointer}
.al-bar{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--al-line)}
.al-spark{width:16px;height:16px;color:var(--al-blue);margin-right:2px}
.al-bar strong{font-size:14px;font-weight:500}
.al-stat{display:inline-flex;align-items:center;gap:6px;color:var(--al-muted);font-size:13px;margin-left:2px}.al-stat.warn{color:var(--al-warn)}
.al-dot{width:6px;height:6px;border-radius:50%;background:var(--al-blue)}.al-dot.warn{background:var(--al-warn)}
.al-dot.run{animation:al-pulse 1.8s ease-in-out infinite}
.al-span{margin-left:auto;padding:2px 9px;border-radius:6px;background:var(--al-chip);font-size:12px;color:var(--al-fg)}
.al-grid{display:grid;grid-template-columns:176px minmax(0,1fr);padding:8px 16px 12px}
.al-names{padding-top:26px}
.al-agent{display:flex;align-items:center;gap:10px;height:50px}
.al-avatar{display:grid;place-items:center;width:26px;height:26px;flex:none;border-radius:7px;background:#fff;border:1px solid var(--al-line);box-shadow:0 1px 2px #0000000f;color:#111;font-size:11px;font-weight:600}
.al-avatar svg{width:15px;height:15px}
/* dark: the avatar sits on the lane's chip, not a white square */
:where(.dark,[data-theme=dark]) .al-avatar{background:var(--al-chip);color:var(--al-fg);box-shadow:none}
.al-who{display:flex;flex-direction:column;min-width:0}
.al-name{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:450;white-space:nowrap}
.al-model{color:var(--al-muted);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.al-tag{padding:0 5px;border-radius:4px;background:var(--al-chip);color:var(--al-muted);font-size:11px;line-height:17px;font-weight:400}
.al-tag.warn{background:var(--al-warn-bg);color:var(--al-warn)}
.al-track{position:relative;min-width:0}
.al-ticks{position:relative;height:26px;font-size:11px;color:var(--al-faint)}
.al-ticks span{position:absolute;top:4px;transform:translateX(-50%);white-space:nowrap}
.al-ticks .al-now{right:0;left:auto;transform:none;top:2px;padding:0 5px;border-radius:4px;background:var(--al-blue-bg);color:var(--ts-status-running-fg,#1d5fb8);font-weight:500;line-height:16px}
:where(.dark,[data-theme=dark]) .al-ticks .al-now{color:var(--ts-status-running-fg,#7fb0f5)}
.al-lanes{position:relative;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 22px);mask-image:linear-gradient(90deg,transparent,#000 22px)}
.al-vline{position:absolute;top:0;bottom:0;border-left:1px dashed var(--al-line)}
.al-lane{position:absolute;left:0;right:0;margin:0;padding:0;list-style:none;border-bottom:1px solid var(--al-line)}
.al-lane:first-of-type{border-bottom-color:transparent}
.al-li{position:absolute;top:10px;height:30px;transition:left 1s linear,width 1s linear}
.al-block{display:flex;align-items:center;gap:6px;width:100%;height:100%;padding:0 8px;border:0;border-radius:6px;background:var(--al-done);color:var(--al-muted);font-size:13px;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:filter .15s}
.al-block:hover{filter:brightness(.97)}
.al-block.running{background:linear-gradient(90deg,color-mix(in srgb,var(--al-blue-bg) 60%,var(--al-bg)),var(--al-blue-bg));color:var(--al-blue-fg);box-shadow:inset -2px 0 0 var(--al-blue);background-size:200% 100%;animation:al-shimmer 2.4s linear infinite}
.al-block.waiting{background:var(--al-warn-bg);color:var(--al-warn)}
.al-block.failed{background:var(--al-red-bg);color:var(--al-red)}
.al-title{overflow:hidden;text-overflow:ellipsis;flex:0 1 auto}
.al-tool{display:grid;place-items:center;width:14px;height:14px;flex:none;color:var(--al-fg)}.al-tool svg{width:13px;height:13px}
.al-flag{display:inline-flex;align-items:center;gap:5px;margin-left:auto;margin-right:-4px;padding:0 7px;height:22px;border-radius:5px;background:var(--al-bg);font-size:12px;color:var(--al-warn);box-shadow:0 1px 2px #0000000f}
.al-flag svg{width:10px;height:10px;animation:al-pulse 1.6s ease-in-out infinite}
.al-curves{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.al-curves path{fill:none;stroke:var(--al-muted);stroke-width:1;stroke-dasharray:3 3}
.al-curves path.live{stroke:var(--al-blue);animation:al-flow 1s linear infinite}
.al-pop{position:absolute;z-index:3;top:36px;right:0;width:250px;padding:12px;border:1px solid var(--al-line);border-radius:10px;background:var(--al-bg);box-shadow:0 8px 28px #0000001f;color:var(--al-fg);white-space:normal;animation:al-in .16s ease-out}
.al-pop.up{top:auto;bottom:36px}
.al-pop strong{font-weight:500}.al-pop p{margin:4px 0 10px;color:var(--al-muted)}
.al-pop-actions{display:flex;justify-content:flex-end;gap:6px}
.al-btn{height:28px;padding:0 11px;border-radius:7px;border:1px solid var(--al-line);background:var(--al-bg);font-weight:500}
.al-btn.primary{background:var(--al-fg);color:var(--al-bg)!important;border-color:var(--al-fg)}
.al-link{border:0;background:none;padding:0;color:var(--al-blue)!important}
.al-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0}
.al :focus-visible{outline:2px solid var(--al-blue);outline-offset:2px}
.al-lanes:has(:focus-visible){-webkit-mask-image:none;mask-image:none}
@keyframes al-pulse{50%{opacity:.35}}
@keyframes al-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}
@keyframes al-flow{to{stroke-dashoffset:-6}}
@keyframes al-in{from{opacity:0;transform:translateY(-3px)}}
.al-list{display:none}
@container (max-width:520px){.al-block .al-flag{display:none}.al-grid{grid-template-columns:40px minmax(0,1fr);padding:8px 10px 10px}.al-who{display:none}.al-bar{flex-wrap:wrap}.al-lanes{-webkit-mask-image:linear-gradient(90deg,transparent,#000 10px);mask-image:linear-gradient(90deg,transparent,#000 10px)}.al-list{display:grid;gap:2px;margin:0;padding:4px 10px 12px;list-style:none;border-top:1px solid var(--al-line)}.al-row{display:flex;align-items:center;gap:10px;min-height:44px}.al-row-text{display:flex;flex-direction:column;min-width:0;flex:1;line-height:1.3}.al-row-who{font-size:12px;color:var(--al-muted)}.al-row-title{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.al-row-state{flex:none;padding:0 6px;border-radius:4px;font-size:11px;line-height:18px;background:var(--al-chip);color:var(--al-muted)}.al-row-state.running{background:var(--al-blue-bg);color:var(--ts-status-running-fg,#1d5fb8)}.al-row-state.waiting{background:var(--al-warn-bg);color:var(--al-warn)}.al-row-state.failed{background:var(--al-red-bg);color:var(--ts-status-error-fg,#c4262b)}}
:where(.dark,[data-theme=dark]) .al-row-state.running{color:var(--ts-status-running-fg,#7fb0f5)}
@media(prefers-reduced-motion:reduce){.al *{animation:none!important;transition:none!important}}
`;
export {
  AgentLanes as A,
  agentLanesLabelsMn as a
};
//# sourceMappingURL=agent-lanes-CkTLwMin.js.map
