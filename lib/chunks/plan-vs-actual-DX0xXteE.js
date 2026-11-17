import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const S = 1e3;
const demoSteps = [
  { id: "brief", title: "Даалгавар унших", plan: 20 * S, start: 0, end: 16 * S },
  { id: "copy", title: "Бичвэрийн ноорог", plan: 40 * S, deps: ["brief"], start: 16 * S, end: 68 * S },
  { id: "layout", title: "Хуудасны бүтэц", plan: 60 * S, deps: ["brief"], start: 16 * S, end: 101 * S },
  { id: "tests", title: "Тест бичих", plan: 30 * S, deps: ["copy"], start: 69 * S, end: 97 * S },
  { id: "payments", title: "Төлбөрийн систем холбох", plan: 45 * S, deps: ["layout"], start: 101 * S },
  { id: "fix", title: "Тест ажиллуулж засах", plan: 35 * S, deps: ["tests", "payments"] },
  { id: "pr", title: "Өөрчлөлтийг хянуулахаар илгээх", plan: 15 * S, deps: ["fix"] }
];
const clock = (ms) => {
  const s = Math.max(0, Math.round(ms / 1e3));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const signed = (ms) => {
  const s = Math.round(ms / 1e3);
  return s === 0 ? "±0 с" : `${s > 0 ? "+" : "−"}${Math.abs(s)} с`;
};
const handoff = 1e3;
function layout(steps, now) {
  const byId = /* @__PURE__ */ new Map();
  const rows = steps.map((step) => {
    const deps = (step.deps ?? []).map((d) => byId.get(d)).filter(Boolean);
    const planStart = deps.length ? Math.max(...deps.map((d) => d.planEnd)) : 0;
    const planEnd = planStart + step.plan;
    let row;
    if (step.start != null && step.end != null)
      row = { step, state: "done", planStart, planEnd, start: step.start, end: step.end, cursor: step.end };
    else if (step.start != null)
      row = {
        step,
        state: "running",
        planStart,
        planEnd,
        start: step.start,
        end: Math.max(now, step.start + step.plan),
        cursor: Math.max(step.start, now)
      };
    else {
      const start = Math.max(now, deps.length ? Math.max(...deps.map((d) => d.end)) + handoff : 0);
      row = { step, state: "waiting", planStart, planEnd, start, end: start + step.plan, cursor: start };
    }
    byId.set(step.id, row);
    return row;
  });
  return rows;
}
function StatusIcon({ state }) {
  if (state === "done")
    return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: "pva-st done", children: /* @__PURE__ */ jsx("path", { d: "m3.5 8.5 3 3 6-7" }) });
  if (state === "running") return /* @__PURE__ */ jsx("i", { className: "pva-spin", "aria-hidden": "true" });
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: "pva-st wait", children: /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5", strokeDasharray: "2 2.2" }) });
}
function PlanVsActual({
  steps = demoSteps,
  now: nowProp,
  task = "Багцуудын хуудсыг гаргах",
  title = "Төлөвлөгөө ба бодит",
  cost,
  formatTime = clock,
  className = ""
}) {
  const demo = nowProp == null && steps === demoSteps;
  const [tick, setTick] = React.useState(110 * S);
  React.useEffect(() => {
    if (!demo) return;
    const id = window.setInterval(() => setTick((t) => t >= 160 * S ? t : t + S), 1e3);
    return () => window.clearInterval(id);
  }, [demo]);
  const now = nowProp ?? (demo ? tick : 0);
  const [hover, setHover] = React.useState(null);
  const rows = React.useMemo(() => layout(steps, now), [steps, now]);
  const planTotal = Math.max(0, ...rows.map((r) => r.planEnd));
  const eta = Math.max(planTotal ? 0 : 0, ...rows.map((r) => r.end));
  const behind = eta - planTotal;
  const domain = Math.max(60 * S, Math.max(eta, planTotal) * 1.4);
  const tickStep = domain > 10 * 60 * S ? 120 * S : domain > 5 * 60 * S ? 60 * S : 30 * S;
  const ticks = [];
  for (let t = tickStep; t < domain - tickStep / 2; t += tickStep) ticks.push(t);
  const pct = (ms) => `${Math.min(ms, domain) / domain * 100}%`;
  const spent = cost ?? (demo ? [Math.min(1.03, now * 77e-7), 1.03] : void 0);
  const related = (id) => {
    if (!hover) return false;
    const h = steps.find((s) => s.id === hover);
    return id === hover || !!h?.deps?.includes(id) || !!steps.find((s) => s.id === id)?.deps?.includes(hover);
  };
  return /* @__PURE__ */ jsxs("section", { className: `pva-root ${className}`, "aria-label": `${title}: ${task}`, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "pva-head", children: [
      /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: "pva-logo", children: [
        /* @__PURE__ */ jsx("rect", { x: "1.5", y: "3", width: "6", height: "2.6", rx: "1.3", fill: "#3d7be8" }),
        /* @__PURE__ */ jsx("rect", { x: "5", y: "6.8", width: "8", height: "2.6", rx: "1.3", fill: "#9db8f2" }),
        /* @__PURE__ */ jsx("rect", { x: "9", y: "10.6", width: "5.5", height: "2.6", rx: "1.3", fill: "#c9d8f8" })
      ] }),
      /* @__PURE__ */ jsx("strong", { children: title }),
      /* @__PURE__ */ jsx("span", { className: "pva-task", children: task }),
      /* @__PURE__ */ jsxs("span", { className: "pva-stats", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Хугацаа ",
          /* @__PURE__ */ jsx("b", { children: formatTime(now) }),
          " / ",
          formatTime(planTotal)
        ] }),
        spent && /* @__PURE__ */ jsxs("span", { children: [
          "Зардал ",
          /* @__PURE__ */ jsxs("b", { children: [
            "$",
            spent[0].toFixed(2)
          ] }),
          " / $",
          spent[1].toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("span", { className: `pva-chip ${behind > 0 ? "late" : "early"}`, children: behind > 0 ? `${signed(behind)} хоцорсон` : behind < 0 ? `${Math.round(-behind / 1e3)} с түрүүлсэн` : "Төлөвлөгөөний дагуу" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pva-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "pva-axis", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("span", { className: "pva-name", children: "Алхам" }),
        /* @__PURE__ */ jsx("span", { className: "pva-track", children: ticks.map((t, i) => /* @__PURE__ */ jsx("span", { className: `pva-tick ${i % 2 ? "odd" : ""}`, style: { left: pct(t) }, children: formatTime(t) }, t)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pva-chart", children: [
        /* @__PURE__ */ jsxs("div", { className: "pva-overlay", "aria-hidden": "true", children: [
          ticks.map((t) => /* @__PURE__ */ jsx("i", { className: "pva-grid", style: { left: pct(t) } }, t)),
          eta > planTotal && /* @__PURE__ */ jsx("i", { className: "pva-gap", style: { left: pct(planTotal), width: `calc(${pct(eta)} - ${pct(planTotal)})` } }),
          /* @__PURE__ */ jsx("i", { className: "pva-planline", style: { left: pct(planTotal) } }),
          eta > planTotal && /* @__PURE__ */ jsx("i", { className: "pva-etaline", style: { left: pct(eta) } }),
          now > 0 && now < eta && /* @__PURE__ */ jsx("i", { className: "pva-now", style: { left: pct(now) } })
        ] }),
        /* @__PURE__ */ jsx("ol", { className: "pva-rows", children: rows.map((r) => {
          const actual = r.state === "waiting" ? 0 : r.cursor - r.start;
          const over = r.state !== "waiting" ? Math.max(0, actual - r.step.plan) : 0;
          const delta = r.state === "done" ? r.end - r.start - r.step.plan : 0;
          const labelAt = Math.max(r.planEnd, r.state === "running" ? r.end : r.state === "done" ? r.end : r.end);
          const words = r.state === "done" ? `${formatTime(r.end - r.start)} зарцуулсан, төлөвлөсөн ${formatTime(r.step.plan)}, ${delta > 0 ? `${Math.round(delta / 1e3)} с хоцорсон` : delta < 0 ? `${Math.round(-delta / 1e3)} с эрт` : "төлөвлөгөөний дагуу"}` : r.state === "running" ? `${formatTime(actual)} ажиллаж байна, төлөвлөсөн ${formatTime(r.step.plan)}` : `эхлэх хугацаа ${formatTime(r.start)}, төлөвлөсөн ${formatTime(r.step.plan)}`;
          const dim = hover && !related(r.step.id);
          return /* @__PURE__ */ jsxs(
            "li",
            {
              tabIndex: 0,
              className: `pva-row ${r.state} ${dim ? "dim" : ""} ${hover === r.step.id ? "hot" : ""}`,
              "aria-label": `${r.step.title}: ${words}`,
              onMouseEnter: () => setHover(r.step.id),
              onMouseLeave: () => setHover(null),
              onFocus: () => setHover(r.step.id),
              onBlur: () => setHover(null),
              children: [
                /* @__PURE__ */ jsxs("span", { className: "pva-name", children: [
                  r.step.icon ?? /* @__PURE__ */ jsx(StatusIcon, { state: r.state }),
                  /* @__PURE__ */ jsx("span", { children: r.step.title })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "pva-track", "aria-hidden": "true", children: [
                  /* @__PURE__ */ jsx("i", { className: "pva-ghost", style: { left: pct(r.planStart), width: `calc(${pct(r.planEnd)} - ${pct(r.planStart)})` } }),
                  r.state === "waiting" ? /* @__PURE__ */ jsx("i", { className: "pva-future", style: { left: pct(r.start), width: `calc(${pct(r.end)} - ${pct(r.start)})` } }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    r.state === "running" && /* @__PURE__ */ jsx("i", { className: "pva-future", style: { left: pct(r.start), width: `calc(${pct(r.end)} - ${pct(r.start)})` } }),
                    /* @__PURE__ */ jsx(
                      "i",
                      {
                        className: `pva-bar ${r.state}`,
                        style: { left: pct(r.start), width: `calc(${pct(r.start + actual - over)} - ${pct(r.start)})` }
                      }
                    ),
                    over > 0 && /* @__PURE__ */ jsx(
                      "i",
                      {
                        className: "pva-over",
                        style: { left: pct(r.start + r.step.plan), width: `calc(${pct(r.cursor)} - ${pct(r.start + r.step.plan)})` }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: `pva-label ${r.state}`, style: { left: `calc(${pct(labelAt)} + 6px)` }, children: [
                    r.state === "waiting" ? formatTime(r.step.plan) : formatTime(actual),
                    r.state === "done" && /* @__PURE__ */ jsx("em", { className: delta > 0 ? "late" : "early", children: signed(delta) })
                  ] })
                ] })
              ]
            },
            r.step.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs("footer", { className: "pva-foot", children: [
        /* @__PURE__ */ jsxs("span", { className: "pva-key", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("i", { className: "k-plan" }),
            "Төлөвлөгөө"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("i", { className: "k-actual" }),
            "Бодит"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("i", { className: "k-over" }),
            "Хэтэрсэн"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "pva-track", children: [
          /* @__PURE__ */ jsxs("span", { className: "pva-flag plan", style: { left: pct(planTotal) }, children: [
            "Төлөвлөгөө ",
            formatTime(planTotal)
          ] }),
          eta > planTotal && /* @__PURE__ */ jsxs("span", { className: "pva-flag eta", style: { left: pct(eta) }, children: [
            "Дуусах ",
            formatTime(eta)
          ] })
        ] })
      ] })
    ] })
  ] });
}
const css = `
.pva-root{--pva-fg:#1f1f1f;--pva-muted:#65656d;--pva-card:#fff;--pva-line:#eeeeee;--pva-soft:#f4f4f4;--pva-bar:#e6e6fb;--pva-bar-edge:#c5c5ef;--pva-amber:#9a3412;--pva-amber-bg:#fdecd6;--pva-green:#166534;--pva-green-bg:#dff3e6;--pva-blue:#3d7be8;--pva-name:200px;width:100%;max-width:760px;margin:0 auto;background:var(--pva-card);border:1px solid var(--pva-line);border-radius:12px;color:var(--pva-fg);font:400 13px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;text-align:left;box-shadow:0 1px 2px #00000008;overflow:hidden}
:where(.dark,[data-theme=dark]) .pva-root{--pva-fg:#ececec;--pva-muted:#9a9aa2;--pva-card:#1b1b1e;--pva-line:#2b2b30;--pva-soft:#25252a;--pva-bar:#34345a;--pva-bar-edge:#4c4c86;--pva-amber:#f0a35a;--pva-amber-bg:#f0a35a26;--pva-green:#5bd08c;--pva-green-bg:#5bd08c22;color-scheme:dark}
.pva-root *{box-sizing:border-box}
.pva-head{display:flex;align-items:center;gap:8px;padding:12px 14px 12px 16px;border-bottom:1px solid var(--pva-line);flex-wrap:wrap}
.pva-logo{width:15px;height:15px;flex:none}
.pva-head strong{font-weight:500;font-size:13px}
.pva-task{color:var(--pva-muted)}
.pva-stats{margin-left:auto;display:flex;align-items:center;gap:14px;color:var(--pva-muted);font-size:12px;font-variant-numeric:tabular-nums}
.pva-stats b{font-weight:500;color:var(--pva-fg)}
.pva-chip{font-size:12px;border-radius:5px;padding:1px 8px;line-height:20px}
.pva-chip.late{background:var(--pva-amber-bg);color:var(--pva-amber)}
.pva-chip.early{background:var(--pva-green-bg);color:var(--pva-green)}
.pva-body{position:relative}
.pva-axis,.pva-row,.pva-foot{display:grid;grid-template-columns:var(--pva-name) 1fr;align-items:center}
.pva-axis{height:30px;border-bottom:1px solid var(--pva-line);font-size:12px;color:var(--pva-muted)}
.pva-axis .pva-name{padding-left:16px;font-size:10px;letter-spacing:.06em;text-transform:uppercase}
.pva-track{position:relative;height:100%;margin-right:16px}
.pva-tick{position:absolute;top:50%;transform:translateY(-50%);padding-left:6px;white-space:nowrap}
.pva-chart{position:relative}
.pva-overlay{position:absolute;top:0;bottom:0;left:var(--pva-name);right:16px;pointer-events:none}
.pva-grid{position:absolute;top:-30px;bottom:0;width:1px;background:var(--pva-line)}
.pva-gap{position:absolute;top:0;bottom:0;background:color-mix(in srgb,var(--pva-amber-bg) 55%,transparent);transition:width .4s,left .4s}
.pva-planline{position:absolute;top:0;bottom:-40px;border-left:1px dashed color-mix(in srgb,var(--pva-amber) 45%,transparent)}
.pva-etaline{position:absolute;top:0;bottom:-40px;width:1px;background:color-mix(in srgb,var(--pva-amber) 55%,transparent);transition:left .4s}
.pva-now{position:absolute;top:0;bottom:0;width:1px;background:color-mix(in srgb,var(--pva-fg) 45%,transparent);transition:left 1s linear}
.pva-now::before{content:"";position:absolute;top:-3px;left:-2.5px;width:6px;height:6px;border-radius:50%;background:var(--pva-blue)}
.pva-rows{list-style:none;margin:0;padding:4px 0 6px;position:relative}
.pva-row{height:32px;outline:none;transition:opacity .2s}
.pva-row:focus-visible .pva-name span{outline:2px solid var(--pva-blue);outline-offset:2px;border-radius:3px}
.pva-row.dim{opacity:.45}
.pva-row .pva-name{display:flex;align-items:center;gap:10px;padding-left:18px;min-width:0}
.pva-row .pva-name span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pva-row.waiting .pva-name{color:color-mix(in srgb,var(--pva-fg) 75%,transparent)}
.pva-st{width:12px;height:12px;flex:none;fill:none;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.pva-st.done{stroke:var(--pva-muted)}
.pva-st.wait{stroke:color-mix(in srgb,var(--pva-muted) 70%,transparent);stroke-width:1.1}
.pva-spin{width:11px;height:11px;flex:none;border-radius:50%;border:1.4px solid color-mix(in srgb,var(--pva-blue) 22%,transparent);border-top-color:var(--pva-blue);animation:pva-spin 1s linear infinite}
.pva-track i{position:absolute;top:50%;height:13px;transform:translateY(-50%);border-radius:3px}
.pva-ghost{border:1px dashed color-mix(in srgb,var(--pva-muted) 70%,transparent);background:transparent;z-index:3}
.pva-bar{background:var(--pva-bar);border:1px solid var(--pva-bar-edge);z-index:2;transition:width 1s linear}
.pva-bar.running{border-right:2px solid var(--pva-blue);background-image:linear-gradient(90deg,transparent,#ffffff99,transparent);background-size:60% 100%;background-repeat:no-repeat;animation:pva-sheen 2s linear infinite}
.pva-over{background:var(--pva-amber-bg);border:1px solid color-mix(in srgb,var(--pva-amber) 40%,transparent);border-left:0;border-radius:0 3px 3px 0!important;z-index:2}
.pva-future{background:var(--pva-soft);z-index:0;transition:left .4s,width .4s}
.pva-label{position:absolute;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:6px;white-space:nowrap;font-size:12px;font-variant-numeric:tabular-nums;z-index:3;transition:left .4s}
.pva-label.waiting{color:color-mix(in srgb,var(--pva-muted) 70%,transparent)}
.pva-label em{font-style:normal;border-radius:4px;padding:0 4px;line-height:17px}
.pva-label em.late{background:var(--pva-amber-bg);color:var(--pva-amber)}
.pva-label em.early{background:var(--pva-green-bg);color:var(--pva-green)}
.pva-foot{height:38px;border-top:1px solid var(--pva-line);font-size:12px;color:var(--pva-muted)}
.pva-key{display:flex;gap:14px;padding-left:16px;white-space:nowrap}
.pva-key span{display:flex;align-items:center;gap:6px}
.pva-key i{width:13px;height:7px;border-radius:2px}
.k-plan{border:1px dashed var(--pva-muted)}.k-actual{background:var(--pva-bar);border:1px solid var(--pva-bar-edge)}.k-over{background:var(--pva-amber-bg);border:1px solid color-mix(in srgb,var(--pva-amber) 40%,transparent)}
.pva-flag{position:absolute;top:50%;transform:translate(-100%,-50%);padding:1px 6px;border-radius:4px;white-space:nowrap;line-height:18px;font-variant-numeric:tabular-nums;transition:left .4s}
.pva-flag.plan{background:var(--pva-soft);color:var(--pva-fg);margin-left:-4px}
.pva-flag.eta{transform:translate(0,-50%);background:var(--pva-amber-bg);color:var(--pva-amber)}
@keyframes pva-spin{to{transform:rotate(360deg)}}
@keyframes pva-sheen{from{background-position:-100% 0}to{background-position:200% 0}}
@media (prefers-reduced-motion:reduce){.pva-root *{animation:none!important;transition:none!important}}
@media (max-width:560px){.pva-root{--pva-name:130px}.pva-task,.pva-key,.pva-st,.pva-spin{display:none}.pva-tick.odd{display:none}.pva-stats{gap:8px}.pva-foot{grid-template-columns:minmax(0,1fr);height:auto;padding:8px 16px}.pva-foot .pva-track{display:flex;flex-wrap:wrap;gap:6px;margin:0}.pva-foot .pva-flag{position:static;transform:none;margin:0}}
.pva-chip{white-space:nowrap}
`;
export {
  PlanVsActual as P
};
//# sourceMappingURL=plan-vs-actual-DX0xXteE.js.map
