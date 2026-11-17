import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const defaultLabels = {
  input: "Оролт",
  memory: "Санах ойгоос олсон",
  method: "Арга зүй",
  steps: "Thinking State",
  approval: "Хүн батлах",
  artifact: "Үр дүн",
  approve: "Батлах",
  revise: "Засуулах",
  approved: "Батлагдсан",
  draft: "Ноорог",
  saved: "Vault-д хадгалагдсан",
  revising: "Агент засаж байна",
  undo: "Буцаах"
};
const useCaseRunDemo = {
  title: "Бүх сувгийн асуултад эх сурвалжтай хариу",
  segment: "Хэрэглэгчийн туслалцаа",
  company: "ac.me Хайрцаг (зохиомол)",
  agent: "Туслалцааны агент",
  input: { channel: "Вэбийн чат", text: "Захиалгаа нэг сар түр зогсоож болох уу? Хөнгөлөлт маань хэвээр үлдэх үү?" },
  method: "Туслалцааны хариултын загвар",
  sources: [
    { id: "s1", label: "Захиалгын нөхцөл", where: "Санах ой · Туслалцаа", quote: "Захиалгыг 1–2 сар түр зогсоож болно; төлбөр тэр хугацаанд тооцогдохгүй." },
    { id: "s2", label: "Хөнгөлөлтийн журам", where: "Санах ой · Борлуулалт", quote: "Түр зогсоолт хөнгөлөлтийг цуцлахгүй." },
    { id: "s3", label: "Өмнөх ижил асуултууд", where: "Ирсэн асуултууд · 11-р сар" }
  ],
  steps: [
    { id: "a", label: "Асуултыг хоёр сэдэвт хуваав: түр зогсоолт, хөнгөлөлт", state: "done" },
    { id: "b", label: "Нөхцөл, журмаас хариу олов", uses: ["s1", "s2"], state: "done" },
    { id: "c", label: "Өмнөх хариултын өнгө аясаар ноорог бичив", uses: ["s3"], state: "done" },
    { id: "d", label: "Түр зогсоох товчийг хавсаргахаар хүлээж байна", state: "active" }
  ],
  approval: { question: "Хариуг илгээж, асуултыг FAQ-д нэмэх үү?", who: "Ахлах зөвлөх" },
  artifact: {
    kind: "Хариу + FAQ мөр",
    title: "Захиалга түр зогсоох ба хөнгөлөлт",
    path: "FAQ · Захиалга",
    lines: ["Захиалгыг 1–2 сар түр зогсоож болно, тэр хугацаанд төлбөр тооцогдохгүй.", "Хөнгөлөлт тань хэвээр үлдэнэ."]
  }
};
function UseCaseRun({
  status: statusProp,
  onDecide,
  labels: labelsProp,
  className = "",
  ...data
}) {
  const L = { ...defaultLabels, ...labelsProp };
  const d = { ...useCaseRunDemo, ...data.title ? data : {} };
  const uid = React.useId();
  const [own, setOwn] = React.useState("pending");
  const status = statusProp ?? own;
  const [hot, setHot] = React.useState(null);
  const decide = (s) => {
    setOwn(s);
    onDecide?.(s);
  };
  const srcById = (id) => d.sources.find((s) => s.id === id);
  return /* @__PURE__ */ jsxs("section", { className: `ur ${className}`, "data-status": status, "aria-labelledby": `${uid}-h`, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "ur-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "ur-meta", children: [
        d.segment && /* @__PURE__ */ jsx("span", { className: "ur-seg", children: d.segment }),
        d.company && /* @__PURE__ */ jsx("span", { children: d.company }),
        d.agent && /* @__PURE__ */ jsx("span", { children: d.agent })
      ] }),
      /* @__PURE__ */ jsx("h3", { id: `${uid}-h`, className: "ur-title", children: d.title })
    ] }),
    /* @__PURE__ */ jsxs("ol", { className: "ur-flow", children: [
      /* @__PURE__ */ jsxs("li", { className: "ur-stage", style: { "--i": 0 }, children: [
        /* @__PURE__ */ jsxs("span", { className: "ur-k", children: [
          L.input,
          d.input.channel ? ` · ${d.input.channel}` : ""
        ] }),
        /* @__PURE__ */ jsx("p", { className: "ur-input", children: d.input.text })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "ur-stage", style: { "--i": 1 }, children: [
        /* @__PURE__ */ jsx("span", { className: "ur-k", children: L.memory }),
        /* @__PURE__ */ jsx("ul", { className: "ur-chips", children: d.sources.map((s, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "ur-chip",
            "aria-pressed": hot === s.id,
            "data-hot": hot === s.id || void 0,
            onClick: () => setHot(hot === s.id ? null : s.id),
            children: [
              /* @__PURE__ */ jsx("span", { className: "ur-n", children: i + 1 }),
              s.label
            ]
          }
        ) }, s.id)) }),
        hot && srcById(hot) && /* @__PURE__ */ jsxs("div", { className: "ur-quote", role: "note", children: [
          srcById(hot).quote && /* @__PURE__ */ jsxs("p", { children: [
            "«",
            srcById(hot).quote,
            "»"
          ] }),
          srcById(hot).where && /* @__PURE__ */ jsx("code", { children: srcById(hot).where })
        ] })
      ] }),
      d.method && /* @__PURE__ */ jsxs("li", { className: "ur-stage", style: { "--i": 2 }, children: [
        /* @__PURE__ */ jsx("span", { className: "ur-k", children: L.method }),
        /* @__PURE__ */ jsx("p", { className: "ur-method", children: d.method })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "ur-stage", style: { "--i": 3 }, children: [
        /* @__PURE__ */ jsx("span", { className: "ur-k", children: L.steps }),
        /* @__PURE__ */ jsx("ul", { className: "ur-steps", children: d.steps.map((st) => {
          const state = status === "approved" ? "done" : st.state ?? "done";
          return /* @__PURE__ */ jsxs("li", { className: `ur-step is-${state}`, children: [
            /* @__PURE__ */ jsx("span", { className: "ur-dot", "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("span", { className: "ur-step-l", children: st.label }),
            st.uses?.map((u) => {
              const n = d.sources.findIndex((s) => s.id === u) + 1;
              return n ? /* @__PURE__ */ jsx("button", { type: "button", className: "ur-ref", "aria-label": `${L.memory} ${n}`, onClick: () => setHot(u), children: n }, u) : null;
            })
          ] }, st.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "ur-stage ur-gate", style: { "--i": 4 }, children: [
        /* @__PURE__ */ jsxs("span", { className: "ur-k", children: [
          L.approval,
          d.approval.who ? ` · ${d.approval.who}` : ""
        ] }),
        status === "pending" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { className: "ur-q", children: d.approval.question }),
          /* @__PURE__ */ jsxs("div", { className: "ur-acts", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "ur-btn is-primary", onClick: () => decide("approved"), children: L.approve }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "ur-btn", onClick: () => decide("revise"), children: L.revise })
          ] })
        ] }) : /* @__PURE__ */ jsxs("p", { className: "ur-done", role: "status", children: [
          status === "approved" ? L.approved : L.revising,
          /* @__PURE__ */ jsx("button", { type: "button", className: "ur-undo", onClick: () => decide("pending"), children: L.undo })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "ur-stage ur-art", style: { "--i": 5 }, children: [
        /* @__PURE__ */ jsxs("span", { className: "ur-k", children: [
          L.artifact,
          " · ",
          d.artifact.kind,
          /* @__PURE__ */ jsx("span", { className: `ur-badge${status === "approved" ? " is-saved" : ""}`, children: status === "approved" ? L.saved : L.draft })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "ur-art-t", children: d.artifact.title }),
        d.artifact.lines?.map((l, i) => /* @__PURE__ */ jsx("p", { className: "ur-art-l", children: l }, i)),
        d.artifact.path && /* @__PURE__ */ jsx("code", { className: "ur-path", children: d.artifact.path })
      ] })
    ] })
  ] });
}
const css = `
.ur{--ur-bg:var(--ts-surface,#fff);--ur-fg:var(--ts-fg,#18181b);--ur-muted:var(--ts-muted,#65656d);--ur-line:var(--ts-line,#ececef);--ur-soft:var(--ts-soft,#f4f4f5);--ur-accent:var(--ts-accent,#1b5cff);--ur-strong:var(--ts-accent-strong,#1b5cff);--ur-accent-soft:var(--ts-accent-soft,#e8f1fe);--ur-green:var(--ts-green,#16a34a);--ur-green-soft:var(--ts-green-soft,#e9f8ee);--ur-amber:var(--ts-amber,#c2620a);--ur-amber-soft:var(--ts-amber-soft,#fff4e0);width:100%;max-width:560px;color:var(--ur-fg);background:var(--ur-bg);border:1px solid var(--ur-line);border-radius:12px;font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);box-sizing:border-box;overflow:hidden}
:where(.dark,[data-theme=dark]) .ur{--ur-bg:var(--ts-surface,#1b1b1e);--ur-fg:var(--ts-fg,#ececef);--ur-muted:var(--ts-muted,#a1a1aa);--ur-line:var(--ts-line,#2e2e33);--ur-soft:var(--ts-soft,#26262a);--ur-accent:var(--ts-accent,#7c9cff);--ur-accent-soft:var(--ts-accent-soft,#1b2a44);--ur-green:var(--ts-green,#4ade80);--ur-green-soft:var(--ts-green-soft,#16301f);--ur-amber:var(--ts-amber,#eba659);--ur-amber-soft:var(--ts-amber-soft,#3a2a12);color-scheme:dark}
.ur *{box-sizing:border-box}
:where(.ur) button{font:inherit;color:inherit;cursor:pointer}
.ur-head{padding:12px 14px;border-bottom:1px solid var(--ur-line)}
.ur-meta{display:flex;flex-wrap:wrap;gap:0 8px;font-size:12px;color:var(--ur-muted)}
.ur-meta>span+span::before{content:"·";margin-right:8px}
.ur-seg{color:var(--ur-accent);font-weight:500}
.ur-title{margin:3px 0 0;font:600 15px/1.3 var(--ts-font-display,inherit)}
.ur-flow{margin:0;padding:6px 14px 12px;list-style:none}
.ur-stage{position:relative;padding:9px 0 9px 18px;animation:ur-in .4s cubic-bezier(.05,.7,.1,1) both;animation-delay:calc(var(--i,0) * 110ms)}
.ur-stage::before{content:"";position:absolute;left:4px;top:15px;bottom:-9px;width:1px;background:var(--ur-line)}
.ur-stage:last-child::before{display:none}
.ur-stage::after{content:"";position:absolute;left:0;top:11px;width:9px;height:9px;border-radius:50%;background:var(--ur-bg);border:2px solid var(--ur-accent)}
.ur-k{display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:600;letter-spacing:.02em;color:var(--ur-muted);text-transform:uppercase}
.ur-input{margin:5px 0 0;padding:8px 10px;border-radius:10px 10px 10px 3px;background:var(--ur-soft)}
.ur-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 0;padding:0;list-style:none}
.ur-chip{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:3px 9px 3px 4px;border:1px solid var(--ur-line);border-radius:14px;background:var(--ur-bg);font-size:12.5px;font-weight:500;transition:background .15s,border-color .15s}
.ur-chip:hover,.ur-chip[data-hot]{border-color:color-mix(in srgb,var(--ur-accent) 45%,var(--ur-line));background:var(--ur-accent-soft)}
.ur-n,.ur-ref{display:inline-grid;place-items:center;min-width:24px;height:24px;padding:0 6px;border-radius:12px;background:var(--ur-accent-soft);color:color-mix(in srgb,var(--ur-accent) 78%,var(--ur-fg));font-size:11px;font-weight:600;border:0}
.ur-ref{margin-left:4px;flex:none}
.ur-quote{margin-top:6px;padding:7px 10px;border-left:2px solid var(--ur-accent);background:var(--ur-soft);border-radius:0 8px 8px 0;font-size:13px;animation:ur-in .25s ease both}
.ur-quote p{margin:0 0 3px}
.ur-quote code,.ur-path{font:500 11.5px/1.4 ui-monospace,monospace;color:var(--ur-muted);overflow-wrap:anywhere}
.ur-method{margin:4px 0 0;font-size:13px}
.ur-steps{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:5px}
.ur-step{display:flex;align-items:flex-start;gap:8px;font-size:13px}
.ur-step-l{flex:1;min-width:0}
.ur-dot{flex:none;width:8px;height:8px;margin-top:6px;border-radius:50%;background:var(--ur-green)}
.ur-step.is-active .ur-dot{background:var(--ur-amber);animation:ur-pulse 1.4s ease-in-out infinite}
.ur-step.is-next{color:var(--ur-muted)}.ur-step.is-next .ur-dot{background:var(--ur-line)}
.ur-gate::after{border-color:var(--ur-amber)}
.ur[data-status=approved] .ur-gate::after,.ur[data-status=approved] .ur-art::after{border-color:var(--ur-green);background:var(--ur-green)}
.ur-q{margin:5px 0 0;font-weight:500}
.ur-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.ur-btn{min-height:32px;padding:5px 12px;border:1px solid var(--ur-line);border-radius:8px;background:var(--ur-bg);font-size:13px;font-weight:500;transition:background .15s,transform .12s}
.ur-btn:hover{background:var(--ur-soft)}.ur-btn:active{transform:scale(.97)}
.ur-btn.is-primary{border-color:var(--ur-strong);background:var(--ur-strong);color:#fff}

.ur-done{display:flex;align-items:center;gap:8px;margin:5px 0 0;font-weight:500;color:color-mix(in srgb,var(--ur-green) 70%,var(--ur-fg))}
.ur[data-status=revise] .ur-done{color:color-mix(in srgb,var(--ur-amber) 80%,var(--ur-fg))}
.ur-undo{height:24px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--ur-muted);font-size:12.5px;font-weight:400}
.ur-undo:hover{background:var(--ur-soft)}
.ur-badge{margin-left:auto;padding:1px 8px;border-radius:10px;background:var(--ur-amber-soft);color:color-mix(in srgb,var(--ur-amber) 82%,var(--ur-fg));font-size:11px;letter-spacing:0;text-transform:none}
.ur-badge.is-saved{background:var(--ur-green-soft);color:color-mix(in srgb,var(--ur-green) 70%,var(--ur-fg))}
.ur-art-t{margin:5px 0 2px;font-weight:600}
.ur-art-l{margin:0 0 2px;font-size:13px;color:var(--ur-muted)}
.ur-path{display:block;margin-top:4px}
.ur :focus-visible{outline:2px solid var(--ur-accent);outline-offset:1px}
@keyframes ur-in{from{opacity:0;transform:translateY(6px)}}
@keyframes ur-pulse{50%{opacity:.35}}
@media(prefers-reduced-motion:reduce){.ur,.ur *{animation:none!important;transition:none!important}}
`;
export {
  UseCaseRun as U,
  useCaseRunDemo as u
};
//# sourceMappingURL=usecase-run-CgbHa9TB.js.map
