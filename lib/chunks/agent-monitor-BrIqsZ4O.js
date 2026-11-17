import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const ico = (c) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: c });
const monitorIcons = {
  claude: ico(/* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.6", fill: "none", stroke: "#d97757", strokeWidth: "1.6" })),
  notion: ico(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { d: "M3.5 1.8h6l3 3v9.4h-9Z", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M5.5 8h5M5.5 10.5h5", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })
    ] })
  ),
  github: ico(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("circle", { cx: "4.5", cy: "3.5", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
      /* @__PURE__ */ jsx("circle", { cx: "4.5", cy: "12.5", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
      /* @__PURE__ */ jsx("circle", { cx: "11.5", cy: "6", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
      /* @__PURE__ */ jsx("path", { d: "M4.5 5v6M11.5 7.5c0 2-2 2.6-6 3.4", fill: "none", stroke: "currentColor", strokeWidth: "1.2" })
    ] })
  ),
  linear: ico(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("path", { d: "M5.5 4h8M5.5 8h8M5.5 12h8", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }),
      /* @__PURE__ */ jsx("circle", { cx: "2.6", cy: "4", r: ".9", fill: "currentColor" }),
      /* @__PURE__ */ jsx("circle", { cx: "2.6", cy: "8", r: ".9", fill: "currentColor" }),
      /* @__PURE__ */ jsx("circle", { cx: "2.6", cy: "12", r: ".9", fill: "currentColor" })
    ] })
  ),
  terminal: ico(
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("rect", { x: "1.5", y: "2.5", width: "13", height: "11", rx: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
      /* @__PURE__ */ jsx("path", { d: "m4.5 6 2 2-2 2M8 10.5h3", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })
    ] })
  )
};
const defaultSteps = [
  { id: "s1", label: "14 асуудал цуглуулсан", icon: monitorIcons.linear, state: "done", took: 1700, tool: "Асуудлын бүртгэл", detail: "v3.1-ээс хойш хаагдсан бүх асуудлыг татсан.", output: "project = WEB AND closed > v3.1" },
  { id: "s2", label: "38 коммит харьцуулсан", icon: monitorIcons.github, state: "done", took: 2400, tool: "Хувилбарын хяналт", detail: "Үндсэн салбарыг сүүлийн хувилбарын шошготой харьцуулсан.", output: "git log v3.1.0..main --oneline" },
  { id: "s3", label: "Хувилбарын тэмдэглэл ноороглосон", icon: monitorIcons.notion, state: "done", took: 2800, tool: "Баримтын сан", detail: "Өөрчлөлтүүдийг шинэ боломж, засвар гэж бүлэглэсэн.", output: "Хувилбарууд / v3.2" },
  { id: "s4", label: "Урьдчилсан хувилбар бүтээж байна", icon: monitorIcons.terminal, kind: "run", state: "running", tool: "Терминал", output: "pnpm build --filter web" },
  { id: "s5", label: "Утааны тест ажиллуулах", state: "queued" },
  { id: "s6", label: "Хувилбарыг нийтлэх", state: "queued" }
];
const clock = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1e3));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const secs = (ms) => `${(ms / 1e3).toFixed(1)} с`;
const tags = {
  idle: "Сул",
  running: "Ажиллаж байна",
  waiting: "Таны ээлж",
  paused: "Түр зогссон",
  finished: "Дууссан",
  failed: "Алдаатай",
  cancelled: "Цуцлагдсан"
};
function AgentMonitor({
  state: stateProp,
  agent = { name: "Хувилбарын агент", role: "Үйл ажиллагааны агент · вэб апп v3.2", mark: monitorIcons.claude },
  steps = defaultSteps,
  current,
  since,
  until,
  pausedFor = 0,
  cost = 5.5,
  ask,
  outcome,
  error,
  onAllow,
  onDecline,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onOpenLog = () => {
  },
  defaultFolded = false,
  className = ""
}) {
  const [innerState, setInnerState] = React.useState("running");
  const state = stateProp ?? innerState;
  const [folded, setFolded] = React.useState(defaultFolded);
  const [open, setOpen] = React.useState(null);
  const [hot, setHot] = React.useState(null);
  const startRef = React.useRef(since ?? Date.now() - 9e3);
  const [now, setNow] = React.useState(() => Date.now());
  const live = state === "running" || state === "waiting";
  React.useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setNow(Date.now()), 1e3);
    return () => window.clearInterval(id);
  }, [live]);
  const pausedAt = React.useRef(null);
  if (state === "paused" && pausedAt.current == null) pausedAt.current = now;
  if (state !== "paused") pausedAt.current = null;
  const elapsed = (until ?? pausedAt.current ?? now) - (since ?? startRef.current) - pausedFor;
  const done = steps.filter((s) => s.state === "done" || s.state === "failed");
  const running = steps.find((s) => s.state === "running");
  const well = current ?? running;
  const count = `${done.length + (running ? 1 : 0)}/${steps.length}`;
  const totalTook = done.reduce((n, s) => n + (s.took ?? 0), 0) || 1;
  const recent = done.slice().reverse();
  const openStep = steps.find((s) => s.id === open);
  const pause = () => onPause ? onPause() : setInnerState("paused");
  const resume = () => onResume ? onResume() : setInnerState("running");
  const cancel = () => onCancel ? onCancel() : setInnerState("cancelled");
  const label = `${agent.name}, ${tags[state]}${well ? `, ${well.label}` : ""}`;
  if (folded) {
    const tools = done.filter((s) => s.icon);
    return /* @__PURE__ */ jsxs("button", { type: "button", className: `am am-folded ${className}`, "aria-label": label, onClick: () => setFolded(false), children: [
      /* @__PURE__ */ jsx("style", { children: css }),
      /* @__PURE__ */ jsx("span", { className: "am-mark", children: agent.mark ?? agent.name[0] }),
      /* @__PURE__ */ jsx("span", { className: "am-stack", children: tools.map((s) => /* @__PURE__ */ jsx("span", { className: "am-stack-i", title: `${s.label} · ${secs(s.took ?? 0)}`, children: s.icon }, s.id)) }),
      /* @__PURE__ */ jsx("span", { className: `am-clock ${live ? "is-live" : ""}`, children: clock(elapsed) }),
      /* @__PURE__ */ jsx("span", { className: `am-tag am-${state}`, children: tags[state] })
    ] });
  }
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: `am ${className}`,
      "aria-label": label,
      tabIndex: -1,
      onKeyDown: (e) => {
        if (state !== "waiting") return;
        if (e.key === "Enter") onAllow?.();
        if (e.key === "Escape") onDecline?.();
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: css }),
        /* @__PURE__ */ jsxs("header", { className: "am-head", children: [
          /* @__PURE__ */ jsx("span", { className: "am-mark", children: agent.mark ?? agent.name[0] }),
          /* @__PURE__ */ jsxs("div", { className: "am-who", children: [
            /* @__PURE__ */ jsx("strong", { children: agent.name }),
            agent.role && /* @__PURE__ */ jsx("span", { children: agent.role })
          ] }),
          cost != null && /* @__PURE__ */ jsxs("span", { className: `am-cost ${live ? "is-live" : ""}`, "aria-label": `Одоогоор ${cost.toFixed(1)}k токен`, children: [
            cost.toFixed(1),
            "k",
            /* @__PURE__ */ jsx("span", { className: "am-cur", children: " токен" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: `am-tag am-${state}`, children: [
            /* @__PURE__ */ jsx("i", {}),
            tags[state]
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "am-fold", "aria-label": "Хураах", onClick: () => setFolded(true), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "m5 6 3-3 3 3M5 10l3 3 3-3", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
        ] }),
        state === "waiting" && ask ? /* @__PURE__ */ jsxs("div", { className: "am-ask", children: [
          /* @__PURE__ */ jsxs("div", { className: "am-ask-t", children: [
            /* @__PURE__ */ jsx("span", { className: "am-ico", children: ask.icon ?? monitorIcons.terminal }),
            ask.title
          ] }),
          ask.command && /* @__PURE__ */ jsx("code", { children: ask.command })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "am-well", children: [
          /* @__PURE__ */ jsx("span", { className: "am-well-i", children: well?.icon ?? monitorIcons.terminal }),
          /* @__PURE__ */ jsx("span", { className: `am-well-l ${state === "running" ? "is-live" : ""}`, children: state === "finished" ? `${Math.round(elapsed / 1e3)} с-д дууссан${outcome?.note ? ` · ${outcome.note}` : ""}` : state === "failed" ? error ?? "Алдаатай" : state === "cancelled" ? "Цуцлагдсан" : well?.label ?? "Эхлэхийг хүлээж байна" }),
          /* @__PURE__ */ jsx("span", { className: "am-well-c", children: clock(elapsed) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "am-strip", role: "img", "aria-label": done.map((s) => `${s.label} ${secs(s.took ?? 0)}`).join(", "), children: [
          done.map((s) => /* @__PURE__ */ jsx(
            "span",
            {
              className: `${hot === s.id || open === s.id ? "is-hot" : ""} ${hot && hot !== s.id ? "is-dim" : ""} ${s.state === "failed" ? "is-fail" : ""}`,
              style: { flexGrow: (s.took ?? 0) / totalTook },
              onMouseEnter: () => setHot(s.id),
              onMouseLeave: () => setHot(null),
              onClick: () => setOpen(open === s.id ? null : s.id)
            },
            s.id
          )),
          running && /* @__PURE__ */ jsx("span", { className: `am-run ${state === "paused" ? "is-paused" : ""}`, style: { flexGrow: 0.42 } })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "am-list", children: recent.map((s) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              "aria-expanded": open === s.id,
              className: `${hot === s.id || open === s.id ? "is-hot" : ""} ${hot && hot !== s.id ? "is-dim" : ""}`,
              onMouseEnter: () => setHot(s.id),
              onMouseLeave: () => setHot(null),
              onClick: () => setOpen(open === s.id ? null : s.id),
              children: [
                /* @__PURE__ */ jsx("span", { className: "am-ico", children: s.icon }),
                /* @__PURE__ */ jsx("span", { className: "am-l", children: s.label }),
                /* @__PURE__ */ jsx("span", { className: "am-t", children: secs(s.took ?? 0) })
              ]
            }
          ),
          open === s.id && openStep && /* @__PURE__ */ jsxs("div", { className: "am-info", role: "dialog", "aria-label": s.label, children: [
            /* @__PURE__ */ jsxs("div", { className: "am-info-h", children: [
              s.tool && /* @__PURE__ */ jsx("strong", { children: s.tool }),
              /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Хаах", onClick: () => setOpen(null), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "m4.5 4.5 7 7m0-7-7 7", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" }) }) })
            ] }),
            s.detail && /* @__PURE__ */ jsx("p", { children: s.detail }),
            s.output && /* @__PURE__ */ jsx("code", { children: s.output })
          ] })
        ] }, s.id)) }),
        /* @__PURE__ */ jsxs("footer", { className: "am-foot", children: [
          state === "waiting" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("button", { type: "button", className: "am-btn", onClick: onDecline, children: [
              "Татгалзах ",
              /* @__PURE__ */ jsx("kbd", { children: "Esc" })
            ] }),
            /* @__PURE__ */ jsxs("button", { type: "button", className: "am-btn is-primary", onClick: onAllow, children: [
              "Зөвшөөрөх ",
              /* @__PURE__ */ jsx("kbd", { children: "⏎" })
            ] })
          ] }) : state === "running" || state === "paused" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("button", { type: "button", className: "am-btn", onClick: state === "paused" ? resume : pause, children: [
              state === "paused" ? /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M5 3.5v9l7-4.5Z", fill: "currentColor" }) }) : /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 4v8M10 4v8", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }),
              state === "paused" ? "Үргэлжлүүлэх" : "Түр зогсоох"
            ] }),
            /* @__PURE__ */ jsxs("button", { type: "button", className: "am-btn", onClick: cancel, children: [
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m5 5 6 6m0-6-6 6", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }),
              "Болих"
            ] })
          ] }) : state === "failed" && onRetry ? /* @__PURE__ */ jsx("button", { type: "button", className: "am-btn", onClick: onRetry, children: "Дахин оролдох" }) : stateProp == null && state === "cancelled" ? /* @__PURE__ */ jsx("button", { type: "button", className: "am-btn", onClick: () => setInnerState("running"), children: "Дахин эхлүүлэх" }) : null,
          /* @__PURE__ */ jsx("span", { className: "am-count", children: count }),
          onOpenLog && /* @__PURE__ */ jsxs("button", { type: "button", className: "am-log", onClick: onOpenLog, children: [
            "Бүртгэл",
            /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M5.5 10.5 10.5 5.5M6.5 5.5h4v4", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" }) })
          ] })
        ] })
      ]
    }
  );
}
const css = `
.am{--am-bg:#fff;--am-fg:#18181b;--am-muted:#65656d;--am-faint:#65656d;--am-line:#ececef;--am-well:#f4f4f5;--am-bar:#e4e4e7;--am-blue:#2563eb;--am-blue-soft:#e8f0fe;width:100%;max-width:340px;background:var(--am-bg);color:var(--am-fg);border:1px solid var(--am-line);border-radius:12px;box-shadow:0 1px 3px #0000000f;font:400 13px/1.4 Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums;outline:none}
:where(.dark,[data-theme=dark]) .am{--am-bg:#1b1b1e;--am-fg:#ececef;--am-muted:#a1a1aa;--am-faint:#9a9aa2;--am-line:#2e2e33;--am-well:#26262a;--am-bar:#3a3a40;--am-blue:#5b9bff;--am-blue-soft:#1d2a44;color-scheme:dark}
.am *{box-sizing:border-box}.am button{font:inherit;color:inherit;cursor:pointer}
.am-head{display:grid;grid-template-columns:28px auto minmax(0,1fr) 20px;align-items:center;gap:6px 8px;padding:12px 12px 0 12px}.am-head>.am-who{grid-column:2/4}.am-head>.am-fold{grid-column:4;grid-row:1}.am-head>.am-cost{grid-column:2;grid-row:2}.am-head>.am-tag{grid-column:3;grid-row:2;justify-self:start}
.am-mark{display:grid;place-items:center;width:28px;height:28px;flex:none;border:1px solid var(--am-line);border-radius:8px}.am-mark svg{width:15px;height:15px}
.am-who{display:flex;flex-direction:column;min-width:0;flex:1}
.am-who strong{font-size:14px;font-weight:500;line-height:1.25}
.am-who span{font-size:11px;color:var(--am-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.am-cost{font-size:11px;flex:none}.am-cur{color:var(--am-faint)}
.am-cost.is-live,.am-clock.is-live,.am-well-l.is-live{background:linear-gradient(90deg,currentColor 35%,var(--am-faint) 50%,currentColor 65%) 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:am-shim 1.8s linear infinite}
.am-tag{display:inline-flex;align-items:center;gap:5px;flex:none;height:18px;padding:0 6px;border-radius:4px;font-size:11px;font-weight:500;background:var(--am-well);color:var(--am-muted)}
.am-tag i{width:5px;height:5px;border-radius:1.5px;background:currentColor}
.am-running{background:var(--am-blue-soft);color:var(--am-blue)}
.am-waiting{background:#fdf1d6;color:#b45309}.am-finished{background:#dcfce7;color:#15803d}.am-failed{background:#fde2e2;color:#b91c1c}
.am-fold{display:grid;place-items:center;width:20px;height:20px;flex:none;border:0;border-radius:5px;background:none;color:var(--am-faint)}
.am-fold:hover{background:var(--am-well);color:var(--am-fg)}.am-fold svg{width:12px;height:12px}
.am-well{display:flex;align-items:center;gap:10px;margin:10px 12px 0;padding:0 10px;height:34px;border-radius:8px;background:var(--am-well)}
.am-well-i{display:grid;place-items:center;width:16px;height:16px;color:var(--am-muted)}.am-well-i svg{width:14px;height:14px}
.am-well-l{font-size:12px;flex:1;min-width:0;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--am-fg)}
.am-well-c{font-size:12px;color:var(--am-muted)}
.am-ask{margin:10px 12px 0;padding:9px 10px;border-radius:8px;background:#fdf6e7}
.am-ask-t{display:flex;align-items:center;gap:8px;font-weight:500}
.am-ask code,.am-info code{display:block;margin-top:6px;padding:5px 7px;border-radius:5px;background:var(--am-bg);font:11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.am-strip{display:flex;gap:2px;height:5px;margin:14px 12px 0}
.am-strip span{min-width:10px;border-radius:2px;background:var(--am-bar);cursor:pointer;transition:background .15s,opacity .15s}
.am-strip span.is-hot{background:#a1a1aa}.am-strip span.is-dim{opacity:.5}.am-strip span.is-fail{background:#f3a6a6}
.am-strip .am-run{background:linear-gradient(90deg,#93c5fd,#bfdbfe 60%,#e0ecff) 0/200% 100%;animation:am-shim 1.6s linear infinite;cursor:default}
.am-strip .am-run.is-paused{animation:none}
.am-list{list-style:none;margin:10px 0 0;padding:0 6px;max-height:84px;overflow:auto}
.am-list li>button{display:flex;align-items:center;gap:10px;width:100%;height:26px;padding:0 6px;border:0;border-radius:6px;background:none;text-align:left;transition:opacity .15s,background .15s}
.am-list li>button.is-hot{background:var(--am-well)}.am-list li>button.is-dim{opacity:.55}
.am-ico{display:grid;place-items:center;width:14px;height:14px;flex:none}.am-ico svg{width:13px;height:13px}
.am-l{font-size:12px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--am-fg)}
.am-t{font-size:12px;color:var(--am-faint)}
.am-info{margin:2px 6px 6px;padding:8px 10px;border:1px solid var(--am-line);border-radius:8px;background:var(--am-bg);box-shadow:0 6px 18px #00000014;animation:am-drop .18s both}
.am-info-h{display:flex;align-items:center;justify-content:space-between}.am-info-h strong{font-weight:500}
.am-info-h button{display:grid;place-items:center;width:20px;height:20px;border:0;border-radius:5px;background:none;color:var(--am-muted)}.am-info-h svg{width:12px;height:12px}
.am-info p{margin:4px 0 0;color:var(--am-muted)}
.am-foot{display:flex;align-items:center;gap:6px;padding:10px 12px 12px}
.am-btn{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 8px;border:0;border-radius:6px;background:var(--am-well);font-size:12px;font-weight:500}
.am-btn svg{width:10px;height:10px;color:var(--am-faint)}
.am-btn kbd{font:inherit;font-size:10px;color:var(--am-faint)}
.am-btn.is-primary{background:var(--am-fg);color:var(--am-bg)}
.am-count{margin-left:auto;font-size:12px;color:var(--am-faint)}
.am-log{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 4px;border:0;background:none;font-size:13px;color:var(--am-muted)}.am-log svg{width:11px;height:11px}
.am-folded{display:inline-flex;align-items:center;gap:8px;width:auto;max-width:none;padding:6px 8px 6px 6px}
.am-folded .am-mark{width:22px;height:22px}
.am-stack{display:flex}.am-stack-i{display:grid;place-items:center;width:20px;height:20px;margin-left:-5px;border-radius:50%;background:var(--am-bg);box-shadow:0 0 0 1px var(--am-line);opacity:.55}
.am-stack-i:last-child{opacity:1}.am-stack-i svg{width:12px;height:12px}
.am-clock{font-size:12px}
.am :focus-visible,.am:focus-visible{outline:2px solid var(--am-blue);outline-offset:2px}
@keyframes am-shim{to{background-position:-250% 0}}
@keyframes am-drop{from{opacity:0;transform:translateY(-4px)}}
@media(max-width:360px){.am-who span{display:none}}
@media(prefers-reduced-motion:reduce){.am *{animation:none!important;transition:none!important}}
`;
export {
  AgentMonitor as A,
  monitorIcons as m
};
//# sourceMappingURL=agent-monitor-BrIqsZ4O.js.map
