import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const defaultLabels = {
  title: "Арын даалгаврууд",
  running: "ажиллаж байна",
  needsYou: "хүний ээлж",
  needsYouOne: "хүний ээлж",
  needsYouBadge: "Хүний ээлж",
  paused: "Түр зогссон",
  pausedCount: "түр зогссон",
  done: "Дууссан",
  pause: "Түр зогсоох",
  resume: "Үргэлжлүүлэх",
  open: "Нээх",
  openAll: "Бүх даалгаврыг нээх",
  empty: "Ажиллаж буй зүйл алга",
  idle: "Ажиллаж буй даалгавар алга"
};
const defaultTasks = [
  { id: "ingest", title: "Өгөгдөл оруулах урсгал", step: "Хэсгүүдийг вектор болгож байна", done: 2, total: 4, state: "running" },
  { id: "refund", title: "Буцаалтын хяналт", step: "Буцаалт батлахыг хүлээж байна", done: 3, total: 5, state: "needs-you" },
  { id: "seo", title: "SEO шалгалт", step: "214 хуудас уншиж байна", done: 1, total: 6, state: "running" },
  { id: "digest", title: "Долоо хоногийн тойм", step: "Хураангуйн ноорог бичиж байна", done: 2, total: 5, state: "running" }
];
const ringColor = (t) => {
  if (t.state === "done") return "var(--rn-blue)";
  const p = t.done / Math.max(1, t.total);
  return p < 0.34 ? "var(--rn-orange)" : p < 0.67 ? "var(--rn-amber)" : "var(--rn-teal)";
};
function Ring({ task }) {
  const p = task.state === "done" ? 1 : task.done / Math.max(1, task.total);
  const r = 5;
  const c = 2 * Math.PI * r;
  return /* @__PURE__ */ jsxs("svg", { className: "rn-ring", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "6.5", fill: "none", stroke: "var(--rn-line)", strokeWidth: "1" }),
    /* @__PURE__ */ jsx(
      "circle",
      {
        cx: "8",
        cy: "8",
        r,
        fill: "none",
        stroke: ringColor(task),
        strokeWidth: "3",
        strokeDasharray: `${c * p} ${c}`,
        transform: "rotate(-90 8 8)",
        style: { transition: "stroke-dasharray .5s, stroke .5s" }
      }
    )
  ] });
}
function RunningNow({
  tasks: tasksProp,
  onPause,
  onResume,
  onOpen,
  onOpenAll,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  align = "end",
  labels: labelsProp,
  brand,
  className = ""
}) {
  const L = { ...defaultLabels, ...labelsProp };
  const [own, setOwn] = React.useState(tasksProp ?? defaultTasks);
  const tasks = tasksProp ?? own;
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp ?? openState;
  const [announce, setAnnounce] = React.useState("");
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const rowRefs = React.useRef([]);
  const popId = React.useId();
  const setOpen = (v) => {
    setOpenState(v);
    onOpenChange?.(v);
  };
  React.useEffect(() => {
    if (tasksProp) return;
    const id = window.setInterval(() => {
      setOwn(
        (ts) => ts.map((t) => {
          if (t.state !== "running") return t;
          const done = t.done + 1;
          if (done >= t.total) {
            setAnnounce(`${t.title} дууслаа`);
            return { ...t, done: t.total, state: "done", step: "Дууссан" };
          }
          return { ...t, done };
        })
      );
    }, 7e3);
    return () => window.clearInterval(id);
  }, [tasksProp]);
  React.useEffect(() => {
    if (!open) return;
    const down = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [open]);
  const running = tasks.filter((t) => t.state === "running").length;
  const waiting = tasks.filter((t) => t.state === "needs-you").length;
  const paused = tasks.filter((t) => t.state === "paused").length;
  const summary = running || waiting ? [running && `${running} ${L.running}`, waiting && `${waiting} ${waiting === 1 ? L.needsYouOne : L.needsYou}`].filter(Boolean).join(", ") : paused ? `${paused} ${L.pausedCount}` : L.idle;
  const setState = (id, state) => {
    if (!tasksProp) setOwn((ts) => ts.map((t) => t.id === id ? { ...t, state } : t));
  };
  const focusRow = (i) => rowRefs.current[(i + tasks.length) % tasks.length]?.focus();
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `rn ${brand === null ? "rn-bare" : ""} ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    brand !== null && /* @__PURE__ */ jsx("div", { className: "rn-brand", children: brand ?? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { className: "rn-logo", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
        /* @__PURE__ */ jsx("rect", { x: "1", y: "1", width: "14", height: "14", rx: "3", fill: "currentColor" }),
        /* @__PURE__ */ jsx("path", { d: "M5 5h4v2H7v4H5Z", fill: "var(--rn-bg)" }),
        /* @__PURE__ */ jsx("rect", { x: "8", y: "8", width: "3", height: "3", fill: "var(--rn-bg)" })
      ] }) }),
      /* @__PURE__ */ jsx("span", { className: "rn-crumb", children: "Thinking State" }),
      /* @__PURE__ */ jsx("span", { className: "rn-sep", children: "/" }),
      /* @__PURE__ */ jsx("span", { children: "Агентууд" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "rn-anchor", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          ref: triggerRef,
          type: "button",
          className: "rn-pill",
          "aria-haspopup": "dialog",
          "aria-expanded": open,
          "aria-controls": popId,
          "aria-label": `${L.title}: ${summary}`,
          onClick: () => {
            setOpen(!open);
            if (!open) window.setTimeout(() => focusRow(0), 0);
          },
          onKeyDown: (e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setOpen(true);
              window.setTimeout(() => focusRow(e.key === "ArrowDown" ? 0 : -1), 0);
            }
          },
          children: [
            running || waiting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              running > 0 && /* @__PURE__ */ jsxs("span", { className: "rn-part", children: [
                /* @__PURE__ */ jsx("i", { className: "rn-live" }),
                /* @__PURE__ */ jsx("b", { children: running }, running),
                " ",
                L.running
              ] }),
              running > 0 && waiting > 0 && /* @__PURE__ */ jsx("span", { className: "rn-dot", children: "·" }),
              waiting > 0 && /* @__PURE__ */ jsxs("span", { className: "rn-part", children: [
                /* @__PURE__ */ jsx("i", { className: "rn-wait" }),
                /* @__PURE__ */ jsx("b", { children: waiting }, waiting),
                " ",
                waiting === 1 ? L.needsYouOne : L.needsYou
              ] })
            ] }) : /* @__PURE__ */ jsx("span", { className: "rn-part", children: summary }),
            /* @__PURE__ */ jsx("svg", { className: "rn-chev", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m5 6.5 3 3 3-3", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }) })
          ]
        }
      ),
      open && /* @__PURE__ */ jsxs(
        "div",
        {
          id: popId,
          role: "dialog",
          "aria-label": L.title,
          className: `rn-pop rn-${align}`,
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              setOpen(false);
              triggerRef.current?.focus();
            }
          },
          onBlur: (e) => {
            if (!rootRef.current?.contains(e.relatedTarget) && e.relatedTarget) setOpen(false);
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "rn-ph", children: [
              /* @__PURE__ */ jsx("span", { children: L.title }),
              /* @__PURE__ */ jsx("span", { className: "rn-pc", children: summary })
            ] }),
            tasks.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rn-empty", children: L.empty }) : /* @__PURE__ */ jsx("ul", { className: "rn-list", children: tasks.map((t, i) => /* @__PURE__ */ jsxs("li", { className: `rn-row is-${t.state}`, children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  ref: (el) => {
                    rowRefs.current[i] = el;
                  },
                  type: "button",
                  className: "rn-main",
                  "aria-label": `${t.title} – ${t.state === "needs-you" ? L.needsYouBadge.toLowerCase() : t.state === "running" ? L.running : t.state === "paused" ? L.pausedCount : L.done.toLowerCase()}. ${t.step}. ${t.done}/${t.total} алхам`,
                  onClick: () => onOpen?.(t.id),
                  onKeyDown: (e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      focusRow(i + 1);
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      focusRow(i - 1);
                    }
                    if (e.key === "Home") {
                      e.preventDefault();
                      focusRow(0);
                    }
                    if (e.key === "End") {
                      e.preventDefault();
                      focusRow(-1);
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsx(Ring, { task: t }),
                    /* @__PURE__ */ jsxs("span", { className: "rn-text", children: [
                      /* @__PURE__ */ jsxs("span", { className: "rn-title", children: [
                        t.title,
                        t.state === "needs-you" && /* @__PURE__ */ jsx("span", { className: "rn-badge", children: L.needsYouBadge }),
                        t.state === "paused" && /* @__PURE__ */ jsx("span", { className: "rn-badge rn-muted", children: L.paused })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "rn-step", children: t.state === "done" ? L.done : t.step }, t.step)
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "rn-count", children: [
                      t.done,
                      "/",
                      t.total
                    ] })
                  ]
                }
              ),
              t.state === "running" && /* @__PURE__ */ jsx("button", { type: "button", className: "rn-act", "aria-label": `${t.title}: ${L.pause.toLowerCase()}`, onClick: () => {
                setState(t.id, "paused");
                onPause?.(t.id);
              }, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M6 4v8M10 4v8", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }) }),
              t.state === "paused" && /* @__PURE__ */ jsx("button", { type: "button", className: "rn-act", "aria-label": `${t.title}: ${L.resume.toLowerCase()}`, onClick: () => {
                setState(t.id, "running");
                onResume?.(t.id);
              }, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M5.5 4v8l6.5-4Z", fill: "currentColor" }) }) }),
              t.state === "needs-you" && /* @__PURE__ */ jsx("button", { type: "button", className: "rn-open", "aria-label": `${t.title}: ${L.open.toLowerCase()} – ${L.needsYouBadge.toLowerCase()}`, onClick: () => onOpen?.(t.id), children: L.open })
            ] }, t.id)) }),
            onOpenAll && /* @__PURE__ */ jsxs("button", { type: "button", className: "rn-all", onClick: onOpenAll, children: [
              L.openAll,
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3.5 8h9M9 4.5 12.5 8 9 11.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }) })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("span", { role: "status", className: "rn-sr", children: announce })
  ] });
}
const css = `
.rn{--rn-bg:#fff;--rn-fg:#18181b;--rn-muted:#65656d;--rn-faint:#65656d;--rn-line:#ececef;--rn-soft:#f6f6f7;--rn-teal:#14b8a6;--rn-amber:#eab308;--rn-orange:#f97316;--rn-blue:#3b82f6;--rn-wait:#e5a000;position:relative;display:flex;align-items:center;gap:12px;width:100%;max-width:722px;height:50px;padding:0 9px 0 14px;background:var(--rn-bg);color:var(--rn-fg);border:1px solid var(--rn-line);border-radius:var(--ts-radius,10px);box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .rn{--rn-bg:#1b1b1e;--rn-fg:#ececef;--rn-muted:#a1a1aa;--rn-faint:#9a9aa2;--rn-line:#2c2c31;--rn-soft:#24242a;--rn-wait:#facc15;color-scheme:dark}
.rn.rn-bare{display:inline-flex;width:auto;height:auto;padding:0;border:0;box-shadow:none;background:none}
.rn *{box-sizing:border-box}.rn button{font:inherit;color:inherit;cursor:pointer}
.rn-brand{display:flex;align-items:center;gap:6px;min-width:0}
.rn-logo{display:grid;place-items:center;width:16px;height:16px;margin-right:4px;color:var(--rn-fg)}.rn-logo svg{width:16px;height:16px}
.rn-crumb{color:var(--rn-muted)}.rn-sep{color:var(--rn-faint);margin:0 -2px}
.rn-anchor{position:relative;margin-left:auto}
.rn-pill{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 9px 0 10px;border:1px solid var(--rn-line);border-radius:var(--ts-radius,7px);background:var(--rn-bg);font-size:12.5px;color:var(--rn-muted);transition:background .15s}
.rn-pill:hover,.rn-pill[aria-expanded=true]{background:var(--rn-soft)}
.rn-part{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.rn-part b{font-weight:500;color:var(--rn-fg);display:inline-block;animation:rn-roll .3s both}
.rn-part i{width:7px;height:7px;margin-right:5px;border-radius:50%}
.rn-live{border:1.5px solid var(--rn-teal)}
.rn-wait{background:var(--rn-wait)}
.rn-dot{color:var(--rn-faint);margin:0 1px}
.rn-chev{width:13px;height:13px;color:var(--rn-faint);transition:transform .2s}.rn-pill[aria-expanded=true] .rn-chev{transform:rotate(180deg)}
.rn-pop{position:absolute;z-index:20;top:calc(100% + 8px);width:340px;background:var(--rn-bg);border:1px solid var(--rn-line);border-radius:var(--ts-radius,11px);box-shadow:0 12px 32px #00000018,0 2px 6px #0000000a;overflow:hidden;animation:rn-pop .18s cubic-bezier(.2,.8,.3,1) both}
.rn-end{right:0;transform-origin:top right}.rn-start{left:0;transform-origin:top left}
.rn-ph{display:flex;justify-content:space-between;align-items:baseline;padding:11px 14px 9px;border-bottom:1px solid var(--rn-line);font-weight:500}
.rn-pc{font-size:12.5px;font-weight:400;color:var(--rn-muted)}
.rn-list{list-style:none;margin:0;padding:4px}
.rn-row{display:flex;align-items:center;gap:4px;border-radius:var(--ts-radius,7px)}
.rn-row:hover{background:var(--rn-soft)}
.rn-main{flex:1;min-width:0;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 9px;border:0;background:none;text-align:left;border-radius:var(--ts-radius,7px)}
.rn-ring{width:16px;height:16px;flex:none}
.rn-text{flex:1;min-width:0;display:flex;flex-direction:column}
.rn-title{display:flex;align-items:center;gap:6px;white-space:nowrap}
.rn-badge{padding:0 6px;border-radius:var(--ts-radius,4px);background:color-mix(in srgb,var(--rn-wait) 16%,transparent);color:color-mix(in srgb,var(--rn-wait) 70%,var(--rn-fg));font-size:11.5px;line-height:18px}
.rn-badge.rn-muted{background:var(--rn-soft);color:var(--rn-muted)}
.rn-step{font-size:12.5px;color:var(--rn-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;animation:rn-roll .3s both}
.rn-row.is-paused .rn-title,.rn-row.is-paused .rn-step{color:var(--rn-faint)}
.rn-count{font-size:12px;color:var(--rn-faint);font-variant-numeric:tabular-nums}
.rn-act{display:grid;place-items:center;width:28px;height:28px;margin-right:4px;border:0;border-radius:var(--ts-radius,6px);background:none;color:var(--rn-muted)}
.rn-act:hover{background:var(--rn-bg);color:var(--rn-fg)}.rn-act svg{width:14px;height:14px}
.rn-open{height:26px;margin-right:5px;padding:0 9px;border:1px solid var(--rn-line);border-radius:var(--ts-radius,6px);background:var(--rn-bg);font-size:12.5px}
.rn-open:hover{background:var(--rn-soft)}
.rn-empty{margin:0;padding:16px 14px;color:var(--rn-muted)}
.rn-all{display:flex;align-items:center;justify-content:space-between;width:100%;padding:10px 14px;border:0;border-top:1px solid var(--rn-line);background:none;text-align:left}
.rn-all:hover{background:var(--rn-soft)}.rn-all svg{width:14px;height:14px;color:var(--rn-muted)}
.rn-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rn :focus-visible{outline:2px solid var(--rn-blue);outline-offset:1px}
@keyframes rn-pop{from{opacity:0;transform:scale(.96) translateY(-4px)}}
@keyframes rn-roll{from{opacity:0;transform:translateY(4px)}}
@media(max-width:480px){.rn-pop{width:calc(100vw - 32px);max-width:340px}.rn-crumb,.rn-sep{display:none}}
@media(prefers-reduced-motion:reduce){.rn *{animation:none!important;transition:none!important}}
.rn-pill{max-width:100%;min-width:0;gap:6px;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rn-brand{animation:rnbrand .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.rn-brand:nth-child(1){animation-delay:0ms}@keyframes rnbrand{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.rn-brand{animation:none}}.rn-anchor{animation:rnanchor .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.rn-anchor:nth-child(1){animation-delay:160ms}@keyframes rnanchor{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.rn-anchor{animation:none}}
`;
export {
  RunningNow as R
};
//# sourceMappingURL=running-now-DdYOBK_M.js.map
