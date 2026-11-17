import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const defaultLabels = {
  title: "Дэд сешнүүд",
  needs: "Таны ээлж",
  running: "Ажиллаж байна",
  idle: "Хүлээгдэж буй",
  done: "Дууссан",
  check: "Шалгах",
  update: "Шинэчлэх",
  archive: "Архивлах",
  archived: "архивласан",
  empty: "Дэд сешн алга"
};
const ORDER = ["needs", "running", "idle", "done"];
const STEPS = ["check", "update", "archive"];
const demoSessions = [
  { id: "contrast", title: "Харанхуй горимын тодрол", state: "needs", line: "Хоёр өнгөний аль нь вэ гэж асууж байна", branch: "fix/dark-contrast" },
  { id: "docs", title: "README-ийн нэршил", state: "running", line: "Нэршлийг «харагдах бодлын хэлхээ» болгож байна", branch: "docs/visible-chain" },
  { id: "tokens", title: "Төлөвийн өнгөнүүд", state: "idle", line: "Дизайны хувьсагчдыг хүлээж байна" },
  { id: "chat-gaps", title: "Чатын дутуу компонент", state: "done", line: "4 компонент нэмж PR нээсэн", pr: 65, steps: ["check"] }
];
const sideSessionsDemo = { sessions: demoSessions };
const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const icons = {
  needs: /* @__PURE__ */ jsx("path", { d: "M8 4.5v4M8 11h.01" }),
  running: /* @__PURE__ */ jsx("path", { d: "M5.5 4.5l6 3.5-6 3.5z" }),
  idle: /* @__PURE__ */ jsx("path", { d: "M6 5v6M10 5v6" }),
  done: /* @__PURE__ */ jsx("path", { d: "M4 8.5l2.5 2.5 5.5-6" })
};
function SideSessions({ sessions: sessionsProp, onOpen, onStep, labels: labelsProp, className = "" }) {
  const L = { ...defaultLabels, ...labelsProp };
  const [own, setOwn] = React.useState(sessionsProp ?? demoSessions);
  const sessions = sessionsProp ?? own;
  const uid = React.useId();
  const step = (s, st) => {
    onStep?.(s, st);
    if (sessionsProp) return;
    setOwn((list) => list.map((x) => x.id === s.id ? { ...x, steps: [...x.steps ?? [], st] } : x));
  };
  React.useEffect(() => {
    if (sessionsProp || reducedMotion()) return;
    const set = (fn) => setOwn((l) => l.map((x) => x.id === "docs" ? fn(x) : x));
    const ts = [
      window.setTimeout(() => set((x) => ({ ...x, state: "done", line: "README засаад PR #64 нээсэн", pr: 64, steps: [] })), 2200),
      window.setTimeout(() => set((x) => ({ ...x, steps: ["check"] })), 3800),
      window.setTimeout(() => set((x) => ({ ...x, steps: ["check", "update"] })), 5200),
      window.setTimeout(() => set((x) => ({ ...x, steps: ["check", "update", "archive"] })), 6600),
      window.setTimeout(() => setOwn(demoSessions), 9600)
    ];
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [sessionsProp]);
  const label = { needs: L.needs, running: L.running, idle: L.idle, done: L.done };
  const groups = ORDER.map((st) => ({ st, list: sessions.filter((s) => s.state === st) })).filter((g) => g.list.length);
  return /* @__PURE__ */ jsxs("aside", { className: `ss ${className}`, "data-cw-root": "side-sessions", "aria-labelledby": `${uid}-t`, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "ss-head", children: [
      /* @__PURE__ */ jsx("h3", { id: `${uid}-t`, className: "ss-title", children: L.title }),
      /* @__PURE__ */ jsx("span", { className: "ss-count", children: sessions.filter((s) => !s.steps?.includes("archive")).length })
    ] }),
    groups.length === 0 && /* @__PURE__ */ jsx("p", { className: "ss-empty", children: L.empty }),
    groups.map(({ st, list }) => /* @__PURE__ */ jsxs("section", { className: `ss-group is-${st}`, "aria-label": label[st], children: [
      /* @__PURE__ */ jsxs("h4", { className: "ss-gh", children: [
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: icons[st] }),
        label[st],
        /* @__PURE__ */ jsx("span", { children: list.length })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "ss-list", children: list.map((s) => {
        const done = s.steps ?? [];
        const archived = done.includes("archive");
        const next = STEPS.find((x) => !done.includes(x));
        return /* @__PURE__ */ jsxs("li", { className: `ss-row is-${s.state}${archived ? " is-archived" : ""}`, children: [
          /* @__PURE__ */ jsxs("button", { type: "button", className: "ss-open", onClick: () => onOpen?.(s), "data-cw-prompt": `${s.title} сешнийг нээ`, children: [
            /* @__PURE__ */ jsx("span", { className: "ss-dot", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxs("span", { className: "ss-main", children: [
              /* @__PURE__ */ jsxs("span", { className: "ss-name", children: [
                s.title,
                archived && /* @__PURE__ */ jsxs("em", { children: [
                  " · ",
                  L.archived
                ] })
              ] }),
              s.line && /* @__PURE__ */ jsx("span", { className: "ss-line", children: s.line })
            ] }),
            (s.pr || s.branch) && /* @__PURE__ */ jsx("span", { className: "ss-ref", children: s.pr ? `#${s.pr}` : s.branch })
          ] }),
          s.state === "done" && /* @__PURE__ */ jsx("ol", { className: "ss-chain", "aria-label": `${L.check} → ${L.update} → ${L.archive}`, children: STEPS.map((x) => {
            const isDone = done.includes(x);
            const stepLabel = x === "check" ? L.check : x === "update" ? L.update : L.archive;
            return /* @__PURE__ */ jsx("li", { className: isDone ? "is-done" : x === next ? "is-next" : "", children: x === next ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => step(s, x), "data-cw-prompt": `${s.title}: ${stepLabel}`, children: stepLabel }) : /* @__PURE__ */ jsxs("span", { children: [
              isDone && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 8.5l2.5 2.5 5.5-6" }) }),
              stepLabel
            ] }) }, x);
          }) })
        ] }, s.id);
      }) })
    ] }, st))
  ] });
}
const css = `
.ss{--ss-bg:var(--ts-surface,#fff);--ss-fg:var(--ts-fg,#18181b);--ss-muted:var(--ts-muted,#65656d);--ss-line:var(--ts-line,#ececef);--ss-soft:var(--ts-soft,#f4f4f5);--ss-accent:var(--ts-accent,#1b5cff);--ss-needs:var(--ts-status-needs-you-fg,var(--ts-amber,#a85a12));--ss-running:var(--ts-status-running-fg,var(--ts-accent,#1b5cff));--ss-idle:var(--ts-status-idle-fg,var(--ts-muted,#65656d));--ss-done:var(--ts-status-done-fg,var(--ts-green,#3f5e41));width:100%;max-width:340px;box-sizing:border-box;display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--ss-line);border-radius:14px;background:var(--ss-bg);color:var(--ss-fg);font:400 13px/1.4 var(--ts-font,Inter,system-ui,sans-serif)}
:where(.dark,[data-theme=dark]) .ss{--ss-bg:var(--ts-surface,#1b1b1e);--ss-fg:var(--ts-fg,#ececef);--ss-muted:var(--ts-muted,#a1a1aa);--ss-line:var(--ts-line,#2e2e33);--ss-soft:var(--ts-soft,#26262a);--ss-accent:var(--ts-accent,#7c9cff);--ss-needs:var(--ts-status-needs-you-fg,var(--ts-amber,#eba659));--ss-running:var(--ts-status-running-fg,var(--ts-accent,#7c9cff));--ss-idle:var(--ts-status-idle-fg,var(--ts-muted,#a1a1aa));--ss-done:var(--ts-status-done-fg,var(--ts-green,#4ade80));color-scheme:dark}
.ss svg{width:13px;height:13px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.ss-head{display:flex;align-items:center;gap:8px}
.ss-title{margin:0;font-size:14px;font-weight:600}
.ss-count{margin-left:auto;min-width:22px;padding:1px 7px;border-radius:999px;background:var(--ss-soft);color:var(--ss-muted);font-size:12px;text-align:center;font-variant-numeric:tabular-nums}
.ss-empty{margin:0;color:var(--ss-muted)}
.ss-group{display:flex;flex-direction:column;gap:4px}
.ss-gh{margin:0;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--ss-c)}
.ss-gh span{color:var(--ss-muted);font-weight:400}
.ss-group.is-needs{--ss-c:var(--ss-needs)}.ss-group.is-running{--ss-c:var(--ss-running)}.ss-group.is-idle{--ss-c:var(--ss-idle)}.ss-group.is-done{--ss-c:var(--ss-done)}
.ss-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.ss-row{border-radius:10px;animation:ss-in .3s ease both;transition:opacity .3s}
.ss-row.is-archived{opacity:.5}
.ss-open{width:100%;display:flex;align-items:flex-start;gap:8px;padding:7px 8px;border:0;border-radius:10px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.ss-open:hover{background:var(--ss-soft)}
.ss-open:focus-visible,.ss-chain button:focus-visible{outline:2px solid var(--ss-accent);outline-offset:1px}
.ss-dot{width:8px;height:8px;margin-top:5px;border-radius:50%;background:var(--ss-c);flex:none}
.ss-row.is-running .ss-dot{animation:ss-pulse 1.2s ease-in-out infinite}
.ss-main{display:flex;flex-direction:column;min-width:0;flex:1}
.ss-name{font-weight:500}.ss-name em{font-style:normal;color:var(--ss-muted);font-weight:400}
.ss-line{color:var(--ss-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ss-ref{flex:none;padding:1px 6px;border-radius:6px;background:var(--ss-soft);color:var(--ss-muted);font-size:11px;font-variant-numeric:tabular-nums}
.ss-chain{list-style:none;margin:0 0 4px 24px;padding:0;display:flex;flex-wrap:wrap;align-items:center;gap:4px}
.ss-chain li{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--ss-muted)}
.ss-chain li+li::before{content:"→";color:var(--ss-line);margin-right:2px}
.ss-chain span{display:inline-flex;align-items:center;gap:3px;min-height:24px}
.ss-chain .is-done span{color:var(--ss-done)}
.ss-chain button{min-height:24px;padding:0 9px;border-radius:7px;border:1px solid var(--ss-accent);background:none;color:var(--ss-accent);font:inherit;font-weight:500;cursor:pointer}
.ss-chain button:hover{background:color-mix(in srgb,var(--ss-accent) 10%,transparent)}
@keyframes ss-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
@keyframes ss-pulse{50%{opacity:.35}}
@media(prefers-reduced-motion:reduce){.ss,.ss *{animation:none!important;transition:none!important}}
`;
export {
  SideSessions,
  sideSessionsDemo
};
//# sourceMappingURL=side-sessions-_9S4aUiC.js.map
