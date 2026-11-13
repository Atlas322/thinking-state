import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const defaultLabels$1 = {
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
  const L = { ...defaultLabels$1, ...labelsProp };
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
    /* @__PURE__ */ jsx("style", { children: css$1 }),
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
const css$1 = `
.ur{--ur-bg:var(--ts-surface,#fff);--ur-fg:var(--ts-fg,#18181b);--ur-muted:var(--ts-muted,#65656d);--ur-line:var(--ts-line,#ececef);--ur-soft:var(--ts-soft,#f4f4f5);--ur-accent:var(--ts-accent,#4f7cf0);--ur-accent-soft:var(--ts-accent-soft,#e8f1fe);--ur-green:var(--ts-green,#16a34a);--ur-green-soft:var(--ts-green-soft,#e9f8ee);--ur-amber:var(--ts-amber,#c2620a);--ur-amber-soft:var(--ts-amber-soft,#fff4e0);width:100%;max-width:560px;color:var(--ur-fg);background:var(--ur-bg);border:1px solid var(--ur-line);border-radius:12px;font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);box-sizing:border-box;overflow:hidden}
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
.ur-n,.ur-ref{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:var(--ur-accent-soft);color:var(--ur-accent);font-size:11px;font-weight:600;border:0}
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
.ur-btn.is-primary{border-color:var(--ur-accent);background:var(--ur-accent);color:#fff}
:where(.dark,[data-theme=dark]) .ur-btn.is-primary{color:#111}
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
const defaultLabels = {
  title: "Агентын алхмууд",
  running: "Ажиллаж байна",
  approval: "Батлалт",
  waiting: "Таны ээлж",
  failed: "Алдаатай",
  empty: "Алхам алга",
  untitled: "Нэргүй алхам"
};
const defaultSteps = [
  { id: "read", title: "Алдааны мэдээг уншсан", state: "done", duration: 8e3 },
  { id: "repro", title: "Гацалтыг давтан үүсгэсэн", state: "done", duration: 34e3 },
  {
    id: "patch",
    title: "Төлбөрийн маягтыг засах",
    state: "running",
    status: "Тестлэж байна",
    startedAt: -31e3,
    substeps: [
      { title: "Хоосон сагсны тохиолдлыг олсон", detail: "cart.ts:142" },
      { title: "Хамгаалалт ба 2 тест нэмсэн", detail: "+18 −3" },
      { title: "Тестүүдийг ажиллуулж байна", state: "running", detail: "182/214" }
    ]
  },
  { id: "note", title: "Хувилбарын тэмдэглэл бичих", state: "pending" },
  { id: "pr", title: "PR нээх", state: "pending", gate: true }
];
function formatDuration(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  const s = Math.max(0, Math.round(v / 1e3));
  if (s < 60) return `${s} с`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} мин ${s % 60} с`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} цаг ${m % 60} мин`;
  return `${Math.floor(h / 24)} өдөр ${h % 24} цаг`;
}
function Marker({ step }) {
  if (step.icon != null)
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `atr-mk${step.state === "done" ? " atr-mk-done" : step.state === "failed" ? " atr-mk-fail" : ""}`,
        "aria-hidden": "true",
        children: step.icon
      }
    );
  if (step.state === "done")
    return /* @__PURE__ */ jsx("span", { className: "atr-mk atr-mk-done", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m4.5 8.3 2.3 2.2 4.7-5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) }) });
  if (step.state === "running") return /* @__PURE__ */ jsx("span", { className: "atr-mk atr-mk-run" });
  if (step.state === "failed")
    return /* @__PURE__ */ jsx("span", { className: "atr-mk atr-mk-fail", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m5.5 5.5 5 5m0-5-5 5", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" }) }) });
  if (step.gate || step.state === "waiting") return /* @__PURE__ */ jsx("span", { className: "atr-mk atr-mk-gate" });
  return /* @__PURE__ */ jsx("span", { className: "atr-mk atr-mk-pend" });
}
function AgentTrail({
  title = "Төлбөрийн гацалтыг засах",
  steps = defaultSteps,
  expanded,
  onExpandedChange,
  labels: labelsIn,
  className = ""
}) {
  const labels = { ...defaultLabels, ...labelsIn };
  const [mountedAt] = React.useState(() => Date.now());
  const [now, setNow] = React.useState(() => Date.now());
  const hasRunning = steps.some((s) => s.state === "running" && s.startedAt != null);
  React.useEffect(() => {
    if (!hasRunning) return;
    const id = window.setInterval(() => setNow(Date.now()), 1e3);
    return () => window.clearInterval(id);
  }, [hasRunning]);
  const [openLocal, setOpenLocal] = React.useState(
    () => steps.filter((s) => s.state === "running").map((s) => s.id)
  );
  const open = expanded ?? openLocal;
  const toggle = (id) => {
    const next = open.includes(id) ? open.filter((x) => x !== id) : [...open, id];
    if (!expanded) setOpenLocal(next);
    onExpandedChange?.(next);
  };
  const doneCount = steps.filter((s) => s.state === "done").length;
  const started = (s) => s.startedAt == null ? void 0 : s.startedAt < 0 ? mountedAt + s.startedAt : s.startedAt;
  return /* @__PURE__ */ jsxs("section", { className: `atr ${className}`, "aria-label": title ?? labels.title, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    title && /* @__PURE__ */ jsxs("header", { className: "atr-head", children: [
      /* @__PURE__ */ jsx("span", { className: "atr-title", children: title }),
      /* @__PURE__ */ jsxs("span", { className: "atr-count", children: [
        doneCount,
        "/",
        steps.length
      ] })
    ] }),
    steps.length === 0 ? /* @__PURE__ */ jsx("p", { className: "atr-empty", children: labels.empty }) : /* @__PURE__ */ jsx("ol", { className: "atr-list", children: steps.map((s, i) => {
      const next = steps[i + 1];
      const subs = s.substeps ?? [];
      const isOpen = subs.length > 0 && open.includes(s.id);
      const t0 = started(s);
      const right = s.state === "done" ? formatDuration(s.duration) : s.state === "running" && t0 != null ? formatDuration(now - t0) : s.state === "running" ? formatDuration(s.duration) : "";
      const lineOn = s.state === "done" && next && next.state !== "pending";
      return /* @__PURE__ */ jsxs("li", { className: `atr-step atr-${s.state}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "atr-row", children: [
          /* @__PURE__ */ jsxs("span", { className: "atr-rail", children: [
            /* @__PURE__ */ jsx(Marker, { step: s }),
            next && /* @__PURE__ */ jsx("span", { className: `atr-line ${lineOn ? "on" : ""}` })
          ] }),
          subs.length > 0 ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "atr-name atr-btn",
              "aria-expanded": isOpen,
              onClick: () => toggle(s.id),
              children: s.title || labels.untitled
            }
          ) : /* @__PURE__ */ jsx("span", { className: "atr-name", children: s.title || labels.untitled }),
          s.state === "running" && /* @__PURE__ */ jsx("span", { className: "atr-status", children: s.status ?? labels.running }),
          s.state === "waiting" && /* @__PURE__ */ jsx("span", { className: "atr-pill atr-pill-wait", children: labels.waiting }),
          s.state === "pending" && s.gate && /* @__PURE__ */ jsx("span", { className: "atr-pill", children: labels.approval }),
          s.state === "failed" && /* @__PURE__ */ jsx("span", { className: "atr-failed", children: labels.failed }),
          right && /* @__PURE__ */ jsx("span", { className: "atr-time", children: right })
        ] }),
        isOpen && /* @__PURE__ */ jsx("ul", { className: "atr-subs", children: subs.map((sub, j) => /* @__PURE__ */ jsxs("li", { className: `atr-sub atr-sub-${sub.state ?? "done"}`, children: [
          /* @__PURE__ */ jsx("span", { className: "atr-dot" }),
          /* @__PURE__ */ jsx("span", { className: "atr-sub-t", children: sub.title }),
          sub.tag && /* @__PURE__ */ jsx("span", { className: `atr-tag is-c${sub.tagTone ?? 1}`, children: sub.tag }),
          sub.detail && /* @__PURE__ */ jsx("span", { className: "atr-sub-d", children: sub.detail })
        ] }, sub.id ?? j)) })
      ] }, s.id);
    }) })
  ] });
}
const css = `
.atr{--atr-bg:#fff;--atr-fg:#18181b;--atr-muted:#65656d;--atr-faint:#65656d;--atr-line:#ececef;--atr-accent:#0a84ff;--atr-amber:#e0a106;--atr-amber-bg:#fdf3c8;--atr-amber-fg:#8a6100;--atr-red:#e5484d;width:100%;max-width:360px;background:var(--atr-bg);color:var(--atr-fg);border:1px solid var(--atr-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;padding:14px 16px 12px;font:400 14px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .atr{--atr-bg:#1b1b1e;--atr-fg:#ececef;--atr-muted:#a1a1aa;--atr-faint:#9a9aa2;--atr-line:#2e2e33;--atr-accent:#4ea1ff;--atr-amber-bg:#3a2f0e;--atr-amber-fg:#f5c84b;color-scheme:dark}
.atr *{box-sizing:border-box}
.atr-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.atr-title{font-weight:500}.atr-count{font-size:13px;color:var(--atr-muted);font-variant-numeric:tabular-nums}
.atr-list{list-style:none;margin:0;padding:0}
.atr-row{display:flex;align-items:center;gap:10px;min-height:32px}
.atr-rail{position:relative;align-self:stretch;width:16px;display:flex;justify-content:center;align-items:center;flex:none}
.atr-line{position:absolute;left:7.5px;top:calc(50% + 9px);height:calc(100% - 18px + 0px);width:1.5px;background:var(--atr-line)}
.atr-line.on{background:var(--atr-accent)}
.atr-mk{display:grid;place-items:center;width:15px;height:15px;border-radius:50%;flex:none}
.atr-mk svg{width:13px;height:13px}
.atr-mk-done{background:color-mix(in srgb,var(--atr-accent) 14%,transparent);color:var(--atr-accent)}
.atr-mk-run{border:1.5px solid var(--atr-line);border-top-color:var(--atr-accent);animation:atr-spin 1s linear infinite}
.atr-mk-pend{border:1.5px solid var(--atr-line)}
.atr-mk-gate{border:1.5px dashed var(--atr-amber)}
.atr-mk-fail{background:color-mix(in srgb,var(--atr-red) 14%,transparent);color:var(--atr-red)}
.atr-name{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--atr-muted)}
.atr-running .atr-name{color:var(--atr-fg)}
.atr-btn{border:0;background:none;padding:0;font:inherit;text-align:left;cursor:pointer}
.atr-status{font-size:13px;color:var(--atr-accent);background:linear-gradient(90deg,var(--atr-accent) 40%,color-mix(in srgb,var(--atr-accent) 40%,transparent) 50%,var(--atr-accent) 60%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:atr-shim 2.2s linear infinite}
.atr-time{font-size:13px;color:var(--atr-faint);font-variant-numeric:tabular-nums;min-width:22px;text-align:right}
.atr-pill{font-size:12.5px;padding:1px 7px;border-radius:5px;background:var(--atr-amber-bg);color:var(--atr-amber-fg)}
.atr-failed{font-size:13px;color:var(--atr-red)}
.atr-subs{list-style:none;margin:0 0 4px;padding:0 0 0 13px;position:relative}
.atr-subs::before{content:"";position:absolute;left:21.5px;top:0;bottom:12px;width:1.5px;background:var(--atr-line);border-radius:1px}
.atr-sub{position:relative;display:flex;align-items:center;gap:8px;min-height:24px;padding-left:20px;font-size:12.5px;color:var(--atr-muted)}
.atr-dot{position:absolute;left:6.5px;width:5px;height:5px;border-radius:50%;background:var(--atr-faint)}
.atr-sub-running{color:var(--atr-fg)}.atr-sub-running .atr-dot{background:var(--atr-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--atr-accent) 18%,transparent)}
.atr-sub-pending .atr-dot{background:none;border:1px solid var(--atr-faint)}
.atr-sub-t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.atr-sub-d{font-size:11.5px;color:var(--atr-faint);font-variant-numeric:tabular-nums;max-width:45%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.atr-tag{flex:none;padding:0 6px;border-radius:4px;font-size:11.5px;line-height:18px;font-weight:500}
.atr-tag.is-c1{background:var(--ts-cat-1-bg,#fdf3c8);color:var(--ts-cat-1-fg,#7a5600)}
.atr-tag.is-c2{background:var(--ts-cat-2-bg,#e3eefd);color:var(--ts-cat-2-fg,#1d5fb8)}
.atr-tag.is-c3{background:var(--ts-cat-3-bg,#e1f3e6);color:var(--ts-cat-3-fg,#1d6b3a)}
.atr-tag.is-c4{background:var(--ts-cat-4-bg,#efe7fd);color:var(--ts-cat-4-fg,#5b35b5)}
:where(.dark,[data-theme=dark]) .atr-tag.is-c1{background:#3a2f0e;color:#f5c84b}
:where(.dark,[data-theme=dark]) .atr-tag.is-c2{background:#1d2b40;color:#93c5fd}
:where(.dark,[data-theme=dark]) .atr-tag.is-c3{background:#173a25;color:#86d6a0}
:where(.dark,[data-theme=dark]) .atr-tag.is-c4{background:#2c2347;color:#c4b5fd}
.atr-sub{animation:atr-sub-in var(--ts-motion-spring-settle-duration,.5s) var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both}
@keyframes atr-sub-in{from{opacity:0;transform:translateY(4px)}}
.atr-empty{margin:4px 0;color:var(--atr-muted);font-size:13px}
.atr :focus-visible{outline:2px solid var(--atr-accent);outline-offset:2px;border-radius:4px}
@keyframes atr-spin{to{transform:rotate(360deg)}}
@keyframes atr-shim{from{background-position:100% 0}to{background-position:-150% 0}}
@media(max-width:420px){.atr{padding:12px}.atr-sub-d{display:none}}
@media(prefers-reduced-motion:reduce){.atr *{animation:none!important;transition:none!important}}
`;
export {
  AgentTrail as A,
  UseCaseRun as U,
  useCaseRunDemo as u
};
//# sourceMappingURL=agent-trail-6kw5WsHN.js.map
