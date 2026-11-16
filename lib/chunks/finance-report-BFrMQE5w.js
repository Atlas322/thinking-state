import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useId, useRef, useEffect } from "react";
const defaultLabels$3 = {
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
  const L = { ...defaultLabels$3, ...labelsProp };
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
    /* @__PURE__ */ jsx("style", { children: css$c }),
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
const css$c = `
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
.ur-n,.ur-ref{display:inline-grid;place-items:center;min-width:24px;height:24px;padding:0 6px;border-radius:12px;background:var(--ur-accent-soft);color:var(--ur-accent);font-size:11px;font-weight:600;border:0}
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
const defaultLabels$2 = { working: "Ажиллаж байна", picture: "Хэлтэс бүр нэг тархинд холбогдсон" };
const moduleSceneDemo = {
  title: "Хэлтэс бүрт агент, бүгд нэг тархинд",
  core: "Нэг тархи",
  note: "Жишээ · ac.me",
  modules: [
    {
      id: "sales",
      title: "Борлуулалт",
      agent: "Борлуулалтын агент",
      job: "Шинэ 12 сонирхогчийг ангилж, гуравт санал бэлдэв",
      kpis: [{ value: "4 мин", label: "анхны хариу" }, { value: "18", label: "санал" }, { value: "92%", label: "дагалт" }]
    },
    {
      id: "ops",
      title: "Үйл ажиллагаа",
      agent: "Үйл ажиллагааны агент",
      job: "Нөөцийн хоёр зөрүү олж, худалдан авалтад мэдэгдэв",
      kpis: [{ value: "−31%", label: "саатал" }, { value: "46", label: "хаасан ажил" }, { value: "9 цаг", label: "хэмнэлт" }]
    },
    {
      id: "finance",
      title: "Санхүү",
      agent: "Санхүүгийн агент",
      job: "Сарын 214 гүйлгээг тулгаж, гурван асуулт үлдээв",
      kpis: [{ value: "98%", label: "тулгалт" }, { value: "2 өдөр", label: "сарын хаалт" }, { value: "37", label: "нэхэмжлэл" }]
    },
    {
      id: "knowledge",
      title: "Мэдлэг",
      agent: "Мэдлэгийн агент",
      job: "Өнөөдрийн 9 уулзалтаас 21 санамж бичиж холбов",
      kpis: [{ value: "21", label: "шинэ санамж" }, { value: "64", label: "холбоо" }, { value: "100%", label: "эх сурвалжтай" }]
    }
  ]
};
function brainDots(n, r, cx, cy) {
  let s = 17;
  const rand = () => ((s = s * 16807 % 2147483647) - 1) / 2147483646;
  return Array.from({ length: n }, (_, i) => {
    const rr = r * Math.sqrt((i + 0.5) / n);
    const a = i * 2.39996 + (rand() - 0.5) * 0.5;
    return { x: Math.round((cx + Math.cos(a) * rr * 1.5) * 10) / 10, y: Math.round((cy + Math.sin(a) * rr) * 10) / 10 };
  });
}
const STEPS = 14;
function ModuleScene({ labels: labelsProp, className = "", ...data }) {
  const L = { ...defaultLabels$2, ...labelsProp };
  const d = { ...moduleSceneDemo, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== void 0)) };
  const uid = React.useId();
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTick(STEPS);
      return;
    }
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTick(n);
      if (n >= STEPS) window.clearInterval(id);
    }, 300);
    return () => window.clearInterval(id);
  }, []);
  const mods = d.modules.slice(0, 4);
  const dots = React.useMemo(() => brainDots(34, 22, 400, 34), []);
  const wire = (i) => tick >= 2 + i * 0.5;
  const card = (i) => tick >= 3 + i;
  const working = (i) => tick >= 7 + i;
  const figures = (i) => tick >= 10 + i;
  const anchors4 = mods.map((_, i) => (i + 0.5) / mods.length * 800);
  return /* @__PURE__ */ jsxs("section", { className: `ms ${className}`, "aria-labelledby": d.title ? `${uid}-h` : void 0, "aria-label": d.title ? void 0 : L.picture, children: [
    /* @__PURE__ */ jsx("style", { children: css$b }),
    d.title && /* @__PURE__ */ jsx("h3", { id: `${uid}-h`, className: "ms-title", children: d.title }),
    /* @__PURE__ */ jsxs("div", { className: "ms-brain", children: [
      /* @__PURE__ */ jsxs("svg", { className: "ms-wires", viewBox: "0 0 800 120", preserveAspectRatio: "none", role: "img", "aria-label": L.picture, children: [
        anchors4.map((x, i) => /* @__PURE__ */ jsx("path", { pathLength: 1, className: "ms-wire is-wide", d: `M400 62 C400 96 ${x} 84 ${x} 120`, "data-on": wire(i) || void 0 }, i)),
        mods.map((_, i) => {
          const x = i % 2 ? 600 : 200;
          return /* @__PURE__ */ jsx("path", { pathLength: 1, className: "ms-wire is-narrow", d: `M400 62 C400 96 ${x} 84 ${x} 120`, "data-on": wire(i) || void 0 }, `n${i}`);
        }),
        /* @__PURE__ */ jsx("path", { pathLength: 1, className: "ms-wire is-one", d: "M400 62 L400 120", "data-on": wire(0) || void 0 })
      ] }),
      /* @__PURE__ */ jsx("svg", { className: "ms-dots", viewBox: "340 4 120 60", "aria-hidden": "true", children: dots.map((p, i) => /* @__PURE__ */ jsx("circle", { cx: p.x, cy: p.y, r: 1.8, "data-on": tick >= 1 || void 0, style: { transitionDelay: `${i * 12}ms` } }, i)) }),
      /* @__PURE__ */ jsx("span", { className: "ms-core", "data-on": tick >= 1 || void 0, children: d.core })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "ms-grid", children: mods.map((m, i) => /* @__PURE__ */ jsxs("li", { className: "ms-card", "data-on": card(i) || void 0, children: [
      /* @__PURE__ */ jsx("span", { className: "ms-num", children: String(i + 1).padStart(2, "0") }),
      /* @__PURE__ */ jsx("h4", { className: "ms-h", children: m.title }),
      /* @__PURE__ */ jsxs("div", { className: "ms-agent", "data-working": working(i) || void 0, children: [
        /* @__PURE__ */ jsx("span", { className: "ms-pulse", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("b", { children: m.agent }),
          /* @__PURE__ */ jsx("span", { className: "ms-job", children: working(i) ? m.job : L.working })
        ] })
      ] }),
      /* @__PURE__ */ jsx("dl", { className: "ms-kpis", "data-on": figures(i) || void 0, children: m.kpis.slice(0, 3).map((k) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: k.label }),
        /* @__PURE__ */ jsx("dd", { children: k.value })
      ] }, k.label)) }),
      d.note && /* @__PURE__ */ jsx("p", { className: "ms-note", children: d.note })
    ] }, m.id)) })
  ] });
}
const css$b = `
.ms{--ms-fg:var(--ts-fg,#18181b);--ms-muted:var(--ts-muted,#65656d);--ms-line:var(--ts-line,#ececef);--ms-surface:var(--ts-surface,#fff);--ms-soft:var(--ts-soft,#f4f4f5);--ms-accent:var(--ts-accent,#4f7cf0);--ms-accent-soft:var(--ts-accent-soft,#e8f1fe);--ms-green:var(--ts-green,#16a34a);--ms-accent-text:var(--ts-accent-strong,#1b5cff);width:100%;max-width:1040px;margin:0 auto;color:var(--ms-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);box-sizing:border-box;container-type:inline-size}
:where(.dark,[data-theme=dark]) .ms{--ms-fg:var(--ts-fg,#ececef);--ms-muted:var(--ts-muted,#a1a1aa);--ms-line:var(--ts-line,#2e2e33);--ms-surface:var(--ts-surface,#1b1b1e);--ms-soft:var(--ts-soft,#26262a);--ms-accent:var(--ts-accent,#7c9cff);--ms-accent-soft:var(--ts-accent-soft,#1b2a44);--ms-green:var(--ts-green,#4ade80);--ms-accent-text:var(--ts-accent,#7c9cff);color-scheme:dark}
.ms *{box-sizing:border-box}
.ms-title{margin:0 0 4px;text-align:center;font:var(--ts-head-weight,600) clamp(20px,4cqi,30px)/1.2 var(--ts-font-display,inherit);letter-spacing:var(--ts-head-tracking,-.01em)}
.ms-brain{position:relative;height:120px}
.ms-wires{position:absolute;inset:0;width:100%;height:100%}
.ms-wire{fill:none;stroke:var(--ms-accent);stroke-width:1.5;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;opacity:.55;transition:stroke-dashoffset .6s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.ms-wire[data-on]{stroke-dashoffset:0}
.ms-wire.is-narrow,.ms-wire.is-one{display:none}
.ms-dots{position:absolute;left:50%;top:0;width:160px;height:80px;transform:translateX(-50%)}
.ms-dots circle{fill:var(--ms-accent);opacity:0;transition:opacity .4s}
.ms-dots circle[data-on]{opacity:1}
.ms-core{position:absolute;left:50%;top:40px;transform:translate(-50%,-50%);padding:3px 12px;border:1px solid color-mix(in srgb,var(--ms-accent) 40%,var(--ms-line));border-radius:var(--ts-radius-pill,999px);background:var(--ms-surface);color:var(--ms-accent-text);font-size:13px;font-weight:600;white-space:nowrap;opacity:0;transition:opacity .4s}
.ms-core[data-on]{opacity:1}
.ms-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none}
.ms-card{display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid var(--ms-line);border-radius:var(--ts-radius-card,12px);background:var(--ms-surface);opacity:0;transform:translateY(8px);transition:opacity .45s,transform .45s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.ms-card[data-on]{opacity:1;transform:none}
.ms-num{font:500 12px/1 var(--ts-font-mono,ui-monospace,monospace);color:var(--ms-muted)}
.ms-h{margin:-4px 0 0;font:600 17px/1.25 var(--ts-font-display,inherit)}
.ms-agent{display:flex;gap:8px;align-items:flex-start;padding:8px 10px;border-radius:var(--ts-radius-tile,10px);background:var(--ms-soft);font-size:13px;min-height:62px}
.ms-agent b{display:block;font-weight:600}
.ms-job{display:block;color:var(--ms-muted)}
.ms-pulse{flex:none;width:8px;height:8px;margin-top:6px;border-radius:50%;background:var(--ms-line)}
.ms-agent[data-working] .ms-pulse{background:var(--ms-green);animation:ms-pulse 1.6s ease-in-out 2}
.ms-kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0;opacity:0;transition:opacity .45s}
.ms-kpis[data-on]{opacity:1}
.ms-kpis div{min-width:0}
.ms-kpis dt{order:2;font-size:12px;color:var(--ms-muted);overflow-wrap:anywhere}
.ms-kpis dd{margin:0;font:600 17px/1.2 var(--ts-font-display,inherit);font-variant-numeric:tabular-nums;white-space:nowrap}
.ms-kpis div{display:flex;flex-direction:column}
.ms-kpis dd{order:1}
.ms-note{margin:auto 0 0;font-size:12px;color:var(--ms-muted)}
@container (max-width:760px){.ms-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ms-wire.is-wide{display:none}.ms-wire.is-narrow{display:inline}}
@container (max-width:440px){.ms-grid{grid-template-columns:minmax(0,1fr)}.ms-wire.is-narrow{display:none}.ms-wire.is-one{display:inline}}
@keyframes ms-pulse{50%{opacity:.35}}
@media(prefers-reduced-motion:reduce){.ms *{transition:none!important;animation:none!important}}
`;
function dampingRatio({ stiffness, damping, mass = 1 }) {
  return damping / (2 * Math.sqrt(stiffness * mass));
}
function springAt(spring2, t) {
  const { stiffness: k, damping: c, mass: m = 1, velocity = 0 } = spring2;
  const w0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(k * m));
  const x0 = -1;
  const v0 = velocity;
  let d;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    d = Math.exp(-zeta * w0 * t) * (x0 * Math.cos(wd * t) + (v0 + zeta * w0 * x0) / wd * Math.sin(wd * t));
  } else if (zeta === 1) {
    d = Math.exp(-w0 * t) * (x0 + (v0 + w0 * x0) * t);
  } else {
    const s = w0 * Math.sqrt(zeta * zeta - 1);
    const r12 = -zeta * w0 + s;
    const r2 = -zeta * w0 - s;
    const b = (v0 - r12 * x0) / (r2 - r12);
    const a = x0 - b;
    d = a * Math.exp(r12 * t) + b * Math.exp(r2 * t);
  }
  return 1 + d;
}
function springDuration(spring2, rest = 1e-3) {
  const step = 1 / 1e3;
  let settledSince = -1;
  for (let i = 0; i <= 1e4; i++) {
    const t = i * step;
    if (Math.abs(springAt(spring2, t) - 1) < rest) {
      if (settledSince < 0) settledSince = i;
      if (i - settledSince >= 50) return Math.max(1, settledSince);
    } else settledSince = -1;
  }
  return 1e4;
}
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [t, x] = points[i];
    const expected = a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0] || 1);
    const err = Math.abs(x - expected);
    if (err > worst) {
      worst = err;
      index = i;
    }
  }
  if (worst <= tolerance) return [a, b];
  const left = simplify(points.slice(0, index + 1), tolerance);
  const right = simplify(points.slice(index), tolerance);
  return [...left.slice(0, -1), ...right];
}
const round = (n, digits) => {
  const p = 10 ** digits;
  const r = Math.round(n * p) / p;
  return Object.is(r, -0) ? 0 : r;
};
function springEasing(spring2, tolerance = 4e-3) {
  const duration = springDuration(spring2);
  const samples = 200;
  const points = [];
  let peak = 1;
  for (let i = 0; i <= samples; i++) {
    const p = i / samples;
    const x = i === samples ? 1 : springAt(spring2, p * duration / 1e3);
    peak = Math.max(peak, x);
    points.push([p, x]);
  }
  const kept = simplify(points, tolerance);
  const stops = kept.map(
    ([p, x], i) => i === 0 || i === kept.length - 1 ? `${round(x, 3)}` : `${round(x, 3)} ${round(p * 100, 1)}%`
  );
  const zeta = dampingRatio(spring2);
  const fallback = zeta >= 0.95 ? "cubic-bezier(0.22, 1, 0.36, 1)" : zeta > 0.6 ? "cubic-bezier(0.25, 1.2, 0.5, 1)" : "cubic-bezier(0.34, 1.56, 0.64, 1)";
  return { easing: `linear(${stops.join(", ")})`, duration, fallback, overshoot: round(peak - 1, 3) };
}
function springKeyframes(spring2, from, to, frames = 24) {
  const duration = springDuration(spring2);
  return Array.from({ length: frames + 1 }, (_, i) => {
    const offset = i / frames;
    const x = i === frames ? 1 : springAt(spring2, offset * duration / 1e3);
    return { offset, value: round(from + (to - from) * x, 4) };
  });
}
const SPRINGS = {
  soft: { stiffness: 170, damping: 26, mass: 1 },
  settle: { stiffness: 120, damping: 18, mass: 1 },
  heavy: { stiffness: 90, damping: 20, mass: 1.6 }
};
const DURATIONS = {
  xs: 120,
  sm: 200,
  md: 320,
  lg: 560,
  xl: 900
};
const LOOP = { move: 1200, rest: 4e3, count: 3, stagger: 100 };
const EASINGS = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  /** Enter: decelerates to rest. */
  enter: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  /** Exit: accelerates away. */
  exit: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  /** Icon loops — an even breath. */
  loop: "cubic-bezier(0.45, 0, 0.55, 1)"
};
const cache = /* @__PURE__ */ new Map();
function spring(name) {
  let e = cache.get(name);
  if (!e) cache.set(name, e = springEasing(SPRINGS[name]));
  return e;
}
const motionVar = {
  duration: (n) => `var(--ts-motion-dur-${n}, ${DURATIONS[n]}ms)`,
  easing: (n) => `var(--ts-motion-ease-${n}, ${EASINGS[n]})`,
  spring: (n) => `var(--ts-motion-spring-${n}, ${spring(n).fallback})`,
  springDuration: (n) => `var(--ts-motion-spring-${n}-duration, ${spring(n).duration}ms)`
};
function motionTokensCss() {
  const lines = [];
  for (const [n, v] of Object.entries(DURATIONS)) lines.push(`  --ts-motion-dur-${n}: ${v}ms;`);
  lines.push(`  --ts-motion-loop-move: ${LOOP.move}ms;`, `  --ts-motion-loop-rest: ${LOOP.rest}ms;`, `  --ts-motion-loop-period: ${LOOP.move + LOOP.rest}ms;`, `  --ts-motion-loop-count: ${LOOP.count};`, `  --ts-motion-stagger: ${LOOP.stagger}ms;`);
  for (const [n, v] of Object.entries(EASINGS)) lines.push(`  --ts-motion-ease-${n}: ${v};`);
  for (const n of Object.keys(SPRINGS)) {
    const e = spring(n);
    lines.push(`  --ts-motion-spring-${n}: ${e.easing};`);
    lines.push(`  --ts-motion-spring-${n}-duration: ${e.duration}ms;`);
  }
  return lines.join("\n");
}
const LOOPS = [
  "bob",
  "swing",
  "breathe",
  "float",
  "spin",
  "pulse",
  "nudge",
  "pop",
  "shake"
];
const LOOP_NOTES = {
  bob: "Дээш хөөрөөд зөөлөн буцаж тогтоно (ирэх, хүлээн авах)",
  swing: "Бага зэрэг хазайгаад тэнцвэрээ олно (тэмдэг, шошго)",
  breathe: "Тэгш амьсгал, 1 → 1.06 (амьд, бодож байна)",
  float: "Аажуу хөөрч буцна (санаа, хүлээгдэж буй)",
  spin: "Нэг эргээд зөөлөн зогсоно (шинэчлэх, тохиргоо)",
  pulse: "Долгион тэлж бүдгэрнэ (шууд, идэвхтэй)",
  nudge: "Урагш түлхэгдээд буцна (дараагийн алхам)",
  pop: "Дарагдаад сэргэнэ (баталгаа, дуусгах)",
  shake: "Хүнд юм зөөлөн доргиод тогтоно (анхааруулга)"
};
const LINEAR = (n) => spring(n).easing;
const FALLBACK = (n) => spring(n).fallback;
const r1 = (n) => Math.round(n * 10) / 10;
const kickSettle = (rest, peak, kick, def) => ({
  spring: def,
  natural: (s) => kick + spring(s).duration,
  frames: (t, at, s) => [
    `0% { transform: ${rest}; animation-timing-function: ${EASINGS.enter}; }`,
    `${at(kick)}% { transform: ${peak}; animation-timing-function: ${t(s)}; }`,
    `${at(kick + spring(s).duration)}%, 100% { transform: ${rest}; }`
  ]
});
const sampled = (value, amplitude, kick, def) => ({
  spring: def,
  natural: (s) => kick + spring(s).duration,
  frames: (_t, at, s) => {
    const dur = spring(s).duration;
    return [
      `0% { transform: ${value(0)}; animation-timing-function: ${EASINGS.enter}; }`,
      ...springKeyframes(SPRINGS[s], amplitude, 0, 28).map((f) => `${at(kick + f.offset * dur)}% { transform: ${value(f.value)}; }`),
      `${at(kick + dur)}%, 100% { transform: ${value(0)}; }`
    ];
  }
});
const harmonic = (rest, peak) => ({
  spring: "soft",
  natural: () => 2e3,
  frames: (_t, at) => [
    `0% { transform: ${rest}; animation-timing-function: ${EASINGS.loop}; }`,
    `${at(1e3)}% { transform: ${peak}; animation-timing-function: ${EASINGS.loop}; }`,
    `${at(2e3)}%, 100% { transform: ${rest}; }`
  ]
});
const SHAPES = {
  bob: kickSettle("translateY(0)", "translateY(-14%)", 180, "settle"),
  swing: sampled((v) => `rotate(${v}deg)`, 14, 200, "settle"),
  breathe: harmonic("scale(1)", "scale(1.06)"),
  float: harmonic("translateY(0)", "translateY(-8%)"),
  spin: {
    spring: "soft",
    natural: (s) => spring(s).duration * 1.6,
    frames: (t, at, s) => [
      `0% { transform: rotate(0deg); animation-timing-function: ${t(s)}; }`,
      `${at(spring(s).duration * 1.6)}%, 100% { transform: rotate(360deg); }`
    ]
  },
  pulse: {
    spring: "soft",
    natural: () => 1400,
    frames: (_t, at) => [
      `0% { transform: scale(0.7); opacity: 0.55; animation-timing-function: ${EASINGS.enter}; }`,
      `${at(1400)}%, 100% { transform: scale(1.7); opacity: 0; }`
    ]
  },
  nudge: kickSettle("translateX(0)", "translateX(20%)", 200, "settle"),
  pop: kickSettle("scale(1)", "scale(0.88)", 140, "settle"),
  shake: sampled((v) => `translateX(${v}%)`, 10, 120, "heavy")
};
const cacheAnim = /* @__PURE__ */ new Map();
function loopAnimation(loop, rhythm = {}) {
  const move = rhythm.move ?? LOOP.move;
  const rest = rhythm.rest ?? LOOP.rest;
  const shape = SHAPES[loop];
  const s = rhythm.spring ?? shape.spring;
  const isDefault = move === LOOP.move && rest === LOOP.rest && s === shape.spring;
  const name = isDefault ? `ts-loop-${loop}` : `ts-loop-${loop}-${move}-${rest}-${s}`;
  const hit = cacheAnim.get(name);
  if (hit) return hit;
  const period = move + rest;
  const scale = move / shape.natural(s);
  const at = (ms) => Math.min(100, r1(ms * scale / period * 100));
  const block = (t) => `@keyframes ${name} {
  ${shape.frames(t, at, s).join("\n  ")}
}`;
  const usesSpring = shape.frames(LINEAR, at, s).join() !== shape.frames(FALLBACK, at, s).join();
  const css2 = usesSpring ? `${block(FALLBACK)}
@supports (animation-timing-function: linear(0, 1)) {
${block(LINEAR)}
}` : block(FALLBACK);
  const out = { name, period, css: css2 };
  cacheAnim.set(name, out);
  return out;
}
let css$a;
function motionCss() {
  if (css$a) return css$a;
  const keyframes = [
    ...LOOPS.map((n) => loopAnimation(n).css),
    `@keyframes ts-enter {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
}`
  ];
  const loops = LOOPS.map((n) => `.ts-loop-${n} { animation-name: ts-loop-${n}; }`).join("\n");
  css$a = `${keyframes.join("\n")}
.ts-loop {
  animation-duration: var(--ts-loop-period, var(--ts-motion-loop-period, ${LOOP.move + LOOP.rest}ms));
  animation-delay: var(--ts-loop-delay, 0ms);
  animation-iteration-count: var(--ts-loop-count, var(--ts-motion-loop-count, ${LOOP.count}));
  animation-timing-function: linear;
  transform-box: fill-box;
  transform-origin: var(--ts-loop-origin, 50% 50%);
}
.ts-loop-pulse { animation-fill-mode: both; }
.ts-once { animation-iteration-count: 1; }
${loops}
.ts-enter {
  animation: ts-enter var(--ts-motion-spring-soft-duration, ${spring("soft").duration}ms) var(--ts-motion-spring-soft, ${spring("soft").fallback}) both;
  animation-delay: var(--ts-enter-delay, 0ms);
}
[data-ts-loop="offscreen"] :is(.ts-loop, .ts-enter),
[data-ts-loop="hidden"] :is(.ts-loop, .ts-enter) { animation-play-state: paused; }
[data-ts-loop="paused"] :is(.ts-loop, .ts-enter),
[data-ts-loop="reduced"] :is(.ts-loop, .ts-enter),
[data-ts-motion="off"] :is(.ts-loop, .ts-enter) { animation: none; }
@media (prefers-reduced-motion: reduce) {
  .ts-loop, .ts-enter { animation: none !important; }
}`;
  return css$a;
}
const MotionContext = React.createContext({ paused: false, setPaused: () => {
} });
function MotionProvider({
  children,
  paused: controlled,
  onPausedChange,
  defaultPaused = false
}) {
  const [own, setOwn] = React.useState(defaultPaused);
  const paused = controlled ?? own;
  const value = React.useMemo(
    () => ({
      paused,
      setPaused: (p) => {
        if (controlled === void 0) setOwn(p);
        onPausedChange?.(p);
      }
    }),
    [paused, controlled, onPausedChange]
  );
  return React.createElement(MotionContext.Provider, { value }, children);
}
const useMotion = () => React.useContext(MotionContext);
const REDUCED = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof matchMedia !== "function") return () => {
      };
      const mq = matchMedia(REDUCED);
      mq.addEventListener?.("change", cb);
      return () => mq.removeEventListener?.("change", cb);
    },
    () => typeof matchMedia === "function" ? matchMedia(REDUCED).matches : false,
    () => false
  );
}
function usePageVisible() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof document === "undefined") return () => {
      };
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => typeof document === "undefined" ? true : document.visibilityState !== "hidden",
    () => true
  );
}
const observers = /* @__PURE__ */ new Map();
function observe(el, rootMargin, threshold, cb) {
  if (typeof IntersectionObserver === "undefined") {
    cb(true);
    return () => {
    };
  }
  const key = `${rootMargin}|${threshold}`;
  let entry = observers.get(key);
  if (!entry) {
    const watchers = /* @__PURE__ */ new Map();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          const screenful = r.rootBounds ? r.intersectionRect.height >= r.rootBounds.height * 0.5 : false;
          const visible = r.isIntersecting && (r.intersectionRatio >= Math.min(threshold, 0.999) || screenful);
          for (const w of watchers.get(r.target) ?? []) w(visible);
        }
      },
      { rootMargin, threshold: [.../* @__PURE__ */ new Set([0, 0.02, 0.05, 0.1, threshold, 0.25, 0.5])].sort((a, b) => a - b) }
    );
    entry = { io, watchers };
    observers.set(key, entry);
  }
  let set = entry.watchers.get(el);
  if (!set) entry.watchers.set(el, set = /* @__PURE__ */ new Set());
  else entry.io.unobserve(el);
  set.add(cb);
  entry.io.observe(el);
  const e = entry;
  return () => {
    const ws = e.watchers.get(el);
    ws?.delete(cb);
    if (ws && ws.size) return;
    e.io.unobserve(el);
    e.watchers.delete(el);
    if (!e.watchers.size) {
      e.io.disconnect();
      observers.delete(key);
    }
  };
}
function isScripted(a) {
  if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) return false;
  if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) return false;
  return true;
}
function syncAnimation(a, state) {
  if (state === "running") a.play();
  else if (state === "paused" || state === "reduced") {
    const end = a.effect?.getComputedTiming().endTime;
    if (typeof end === "number" && Number.isFinite(end)) a.finish();
    else a.cancel();
  } else a.pause();
}
function regionState(el) {
  return el.closest("[data-ts-loop]")?.getAttribute("data-ts-loop") ?? null;
}
function useInViewLoop(options = {}) {
  const { threshold = 0.15, rootMargin = "0px", defaultPaused = false } = options;
  const [el, setEl] = React.useState(null);
  const [inView, setInView] = React.useState(false);
  const [own, setOwn] = React.useState(defaultPaused ? true : null);
  const [epoch, setEpoch] = React.useState(0);
  const page = useMotion();
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisible();
  const pagePaused = page.paused;
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setOwn(null);
  }, [pagePaused]);
  React.useEffect(() => {
    if (!el) return;
    return observe(el, rootMargin, threshold, setInView);
  }, [el, rootMargin, threshold]);
  const paused = own ?? pagePaused;
  const state = reduced ? "reduced" : paused ? "paused" : !visible ? "hidden" : inView ? "running" : "offscreen";
  React.useEffect(() => {
    const node = el;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true })) if (isScripted(a)) syncAnimation(a, state);
  }, [el, state]);
  const wake = React.useCallback(() => {
    const node = el;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true }))
      if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation && a.playState === "finished") a.currentTime = 0;
  }, [el]);
  const prev = React.useRef(state);
  React.useEffect(() => {
    if (state === "running" && (prev.current === "offscreen" || prev.current === "hidden")) wake();
    prev.current = state;
  }, [state, wake]);
  const replay = React.useCallback(() => {
    if (paused) {
      setOwn(false);
      return;
    }
    const node = el;
    if (node?.getAnimations) {
      for (const a of node.getAnimations({ subtree: true })) {
        if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) continue;
        a.currentTime = 0;
        if (isScripted(a)) a.play();
      }
      return;
    }
    setEpoch((n) => n + 1);
  }, [el, paused]);
  return {
    ref: setEl,
    state,
    playing: state === "running",
    paused,
    setPaused: (p) => setOwn(p),
    togglePaused: () => setOwn(!paused),
    replay,
    wake,
    epoch,
    attrs: { "data-ts-loop": state }
  };
}
let styles;
function MotionStyles() {
  if (!styles) {
    const css2 = motionCss() + REPLAY_CSS;
    let h = 0;
    for (let i = 0; i < css2.length; i++) h = Math.imul(h, 31) + css2.charCodeAt(i) | 0;
    styles = { css: css2, href: `ts-motion-${(h >>> 0).toString(36)}` };
  }
  return /* @__PURE__ */ jsx("style", { href: styles.href, precedence: "default", children: styles.css });
}
function useLoop(loop, rhythm = {}, style) {
  const a = loopAnimation(loop, rhythm);
  return {
    keyframes: /* @__PURE__ */ jsx("style", { href: a.name, precedence: "default", children: a.css }),
    props: {
      className: `ts-loop ts-loop-${loop}`,
      style: { animationName: a.name, animationDuration: `${a.period}ms`, ...style }
    }
  };
}
const motionControlLabelsMn = {
  replay: "Дахин тоглуулах",
  pause: "Хөдөлгөөнийг зогсоох",
  play: "Хөдөлгөөнийг үргэлжлүүлэх"
};
const glyph$1 = (d) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: d.map((p) => /* @__PURE__ */ jsx("path", { d: p }, p)) });
const ROTATE = ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"];
const PAUSE = ["M14 4h4v16h-4z", "M6 4h4v16H6z"];
const PLAY = ["M6 3l14 9-14 9z"];
function MotionControls({ onReplay, paused, onTogglePause, showPause = true, labels, className = "" }) {
  const l = { ...motionControlLabelsMn, ...labels };
  return /* @__PURE__ */ jsxs("div", { className: `ts-motion-ctl ${className}`, role: "group", "aria-label": l.replay, children: [
    /* @__PURE__ */ jsx("button", { type: "button", className: "ts-motion-ctl-btn", onClick: onReplay, "aria-label": l.replay, title: l.replay, children: glyph$1(ROTATE) }),
    showPause && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "ts-motion-ctl-btn",
        onClick: onTogglePause,
        "aria-label": paused ? l.play : l.pause,
        "aria-pressed": paused,
        title: paused ? l.play : l.pause,
        children: glyph$1(paused ? PLAY : PAUSE)
      }
    )
  ] });
}
function LoopRegion({
  children,
  controls = "none",
  labels,
  className = "",
  style,
  as: Tag = "div",
  onStateChange,
  ...options
}) {
  const loop = useInViewLoop(options);
  React.useEffect(() => onStateChange?.(loop.state), [loop.state, onStateChange]);
  return /* @__PURE__ */ jsxs(
    Tag,
    {
      ref: loop.ref,
      className: `ts-loop-region ${className}`,
      style: controls === "none" ? { "--ts-motion-loop-count": 1, ...style } : style,
      ...loop.attrs,
      "data-controls": controls,
      onPointerEnter: loop.wake,
      children: [
        /* @__PURE__ */ jsx(MotionStyles, {}),
        /* @__PURE__ */ jsx(React.Fragment, { children }, loop.epoch),
        controls !== "none" && loop.state !== "reduced" && /* @__PURE__ */ jsx(MotionControls, { onReplay: loop.replay, paused: loop.paused, onTogglePause: loop.togglePaused, labels })
      ]
    }
  );
}
const REPLAY_CSS = `
.ts-loop-region { position: relative; --ts-ctl-bg: var(--ts-surface, #f7f5ee); --ts-ctl-line: var(--ts-line, #d8d3c6); --ts-ctl-fg: var(--ts-muted, #5e5a52); --ts-ctl-hover: var(--ts-soft, #efebe1); --ts-ctl-strong: var(--ts-fg, #080808); }
:where(.dark, [data-theme=dark]) .ts-loop-region { --ts-ctl-bg: var(--ts-surface, #141416); --ts-ctl-line: var(--ts-line, #2b2b30); --ts-ctl-fg: var(--ts-muted, #a1a1aa); --ts-ctl-hover: var(--ts-soft, #1e1e21); --ts-ctl-strong: var(--ts-fg, #ececef); }
.ts-motion-ctl {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  display: inline-flex; gap: 2px; padding: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ts-ctl-bg) 88%, transparent);
  border: 1px solid var(--ts-ctl-line);
  color: var(--ts-ctl-fg);
  backdrop-filter: blur(6px);
  transition: opacity var(--ts-motion-dur-xs, 120ms) var(--ts-motion-ease-standard, ease);
}
.ts-motion-ctl-btn {
  all: unset; box-sizing: border-box; cursor: pointer;
  display: grid; place-items: center; width: 24px; height: 24px; border-radius: 999px;
}
.ts-motion-ctl-btn:hover { background: var(--ts-ctl-hover); color: var(--ts-ctl-strong); }
.ts-motion-ctl-btn:focus-visible { outline: 2px solid var(--ts-link, #1b5cff); outline-offset: 1px; }
.ts-motion-ctl-btn:active svg { transform: scale(0.88); }
.ts-motion-ctl-btn svg { transition: transform var(--ts-motion-dur-sm, 200ms) var(--ts-motion-ease-standard, ease-out); }
.ts-loop-region[data-controls="hover"] > .ts-motion-ctl { opacity: 0; }
.ts-loop-region[data-controls="hover"]:is(:hover, :focus-within) > .ts-motion-ctl,
.ts-loop-region[data-controls="hover"][data-ts-loop="paused"] > .ts-motion-ctl { opacity: 1; }
/* Inside a <Replay> wrapper (catalog, inai.sh) its ↺ owns the corner: sit beside it. */
.ts-replay-body .ts-loop-region > .ts-motion-ctl { right: 46px; }
.ts-scenario-steps { position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%); display: inline-flex; gap: 4px; pointer-events: none; }
.ts-scenario-steps i { width: 6px; height: 6px; border-radius: 3px; background: var(--ts-ctl-line); transition: width var(--ts-motion-dur-sm, 200ms) var(--ts-motion-ease-standard, ease), background var(--ts-motion-dur-sm, 200ms); }
.ts-scenario-steps i[data-on] { width: 16px; background: var(--ts-selected, #0c8ce9); }
@media (hover: none) { .ts-loop-region[data-controls="hover"] > .ts-motion-ctl { opacity: 1; } }
`;
const UNCONTROLLED_MAX_MS = 5e3;
function useScenario(steps, options = {}) {
  const { rest = LOOP.rest, loops = LOOP.count, maxMs, ...view } = options;
  const loop = useInViewLoop(view);
  const last = Math.max(0, steps.length - 1);
  const [index, setIndex] = React.useState(0);
  const [cycle, setCycle] = React.useState(0);
  const stepsRef = React.useRef(steps);
  stepsRef.current = steps;
  const reduced = loop.state === "reduced";
  const running = loop.state === "running";
  const prev = React.useRef(loop.state);
  React.useEffect(() => {
    if (running && (prev.current === "offscreen" || prev.current === "hidden") && cycle >= loops) {
      setIndex(0);
      setCycle(0);
    }
    prev.current = loop.state;
  }, [loop.state, running, cycle, loops]);
  React.useEffect(() => {
    if (!running || last < 1 || cycle >= loops) return;
    const atEnd = index >= last;
    const wait = (stepsRef.current[index]?.hold ?? 1e3) + (atEnd ? rest : 0);
    const t = setTimeout(() => {
      if (!atEnd) setIndex(index + 1);
      else if (cycle + 1 < loops) {
        setIndex(0);
        setCycle(cycle + 1);
      } else setCycle(loops);
    }, wait);
    return () => clearTimeout(t);
  }, [running, index, cycle, loops, last, rest]);
  const playedRef = React.useRef(0);
  React.useEffect(() => {
    if (!running || maxMs == null || cycle >= loops) return;
    const started = Date.now();
    const t = setTimeout(() => {
      setIndex(last);
      setCycle(loops);
    }, Math.max(0, maxMs - playedRef.current));
    return () => {
      clearTimeout(t);
      playedRef.current += Date.now() - started;
    };
  }, [running, maxMs, cycle, loops, last]);
  const shown = reduced ? last : Math.min(index, last);
  const replay = React.useCallback(() => {
    setIndex(0);
    setCycle(0);
    playedRef.current = 0;
    loop.replay();
  }, [loop]);
  return {
    state: steps[shown]?.state,
    index: shown,
    total: steps.length,
    cycle,
    loopState: loop.state,
    playing: running && cycle < loops,
    paused: loop.paused,
    togglePaused: loop.togglePaused,
    replay,
    ref: loop.ref,
    attrs: { "data-ts-loop": loop.state, "data-ts-step": shown }
  };
}
function ScenarioRegion({
  steps,
  children,
  controls = "none",
  labels,
  className = "",
  style,
  as: Tag = "div",
  showSteps = false,
  ...options
}) {
  const free = controls === "none";
  const sc = useScenario(steps, {
    ...options,
    loops: options.loops ?? (free ? 1 : void 0),
    maxMs: options.maxMs ?? (free ? UNCONTROLLED_MAX_MS : void 0)
  });
  return /* @__PURE__ */ jsxs(Tag, { ref: sc.ref, className: `ts-loop-region ts-scenario ${className}`, style, ...sc.attrs, "data-controls": controls, children: [
    /* @__PURE__ */ jsx(MotionStyles, {}),
    children(sc.state, sc),
    controls !== "none" && sc.loopState !== "reduced" && /* @__PURE__ */ jsx(MotionControls, { onReplay: sc.replay, paused: sc.paused, onTogglePause: sc.togglePaused, labels }),
    showSteps && /* @__PURE__ */ jsx("span", { className: "ts-scenario-steps", "aria-hidden": "true", children: steps.map((_, i) => /* @__PURE__ */ jsx("i", { "data-on": i === sc.index || void 0 }, i)) })
  ] });
}
const defaultLabels$1 = {
  title: "Агентын алхмууд",
  running: "Ажиллаж байна",
  approval: "Батлалт",
  waiting: "Таны ээлж",
  failed: "Алдаатай",
  empty: "Алхам алга",
  untitled: "Нэргүй алхам"
};
const defaultSteps$1 = [
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
  steps = defaultSteps$1,
  expanded,
  onExpandedChange,
  labels: labelsIn,
  className = ""
}) {
  const labels = { ...defaultLabels$1, ...labelsIn };
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
    /* @__PURE__ */ jsx("style", { children: css$9 }),
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
const css$9 = `
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
const demoSteps = [
  { id: "pull", title: "3-р улирлын орлого, жилийн давтагдах орлогыг татах", detail: "Сарын орлого, давтагдах орлого, цэвэр хадгалалт", tool: "payments.query", status: "done", duration: 1.3 },
  { id: "launches", title: "Бүтээгдэхүүний нээлтүүдийг товчлох", detail: "Гарсан төслүүд ба хэрэглээ", tool: "issues.search", status: "done", duration: 1.1 },
  { id: "memo", title: "ТУЗ-ийн танилцуулга ноороглох", detail: "Нэг хуудас: амжилт, эрсдэл, хүсэлт", tool: "docs.write", status: "done", duration: 1.3 },
  { id: "slides", title: "Гол үзүүлэлтийн слайд бэлтгэх", detail: "ТУЗ-ийн загварт зургаан график", tool: "slides.create", status: "failed", error: "Слайдын API 30 секундэд хариу өгсөнгүй" },
  { id: "send", title: "Ноорогийг Сараад хянуулахаар илгээх", tool: "mail.draft", status: "pending" }
];
function AgentPlan({
  title = "ТУЗ-д 3-р улирлын тайлан бэлтгэх",
  steps: stepsProp,
  defaultSteps: defaultSteps2 = demoSteps,
  status,
  estimate = "~2 мин",
  stepMs = 1500,
  onChange,
  onRun,
  onCancel,
  onRetry,
  onAction,
  className = ""
}) {
  const initialPhase = status ?? (defaultSteps2.some((s) => s.status === "failed") ? "stopped" : "draft");
  const [phase, setPhase] = React.useState(initialPhase);
  const [inner, setInner] = React.useState(
    () => initialPhase === "draft" ? defaultSteps2.map((s) => ({ ...s, status: "pending", error: void 0, duration: void 0 })) : defaultSteps2
  );
  const steps = stepsProp ?? inner;
  const [draft, setDraft] = React.useState("");
  const [elapsed, setElapsed] = React.useState(0);
  const [note, setNote] = React.useState("");
  const dragId = React.useRef(null);
  React.useEffect(() => {
    if (status) setPhase(status);
  }, [status]);
  const update = (next) => {
    if (!stepsProp) setInner(next);
    onChange?.(next);
  };
  const activeIndex = steps.findIndex((s) => s.status === "active");
  React.useEffect(() => {
    if (phase !== "running") return;
    const idx = activeIndex >= 0 ? activeIndex : steps.findIndex((s) => s.status !== "done");
    if (idx < 0) {
      setPhase("done");
      setNote(`Төлөвлөгөө ${Math.round(elapsed)} с-д дууслаа`);
      return;
    }
    if (activeIndex < 0) {
      update(steps.map((s, i) => i === idx ? { ...s, status: "active" } : s));
      return;
    }
    const id = window.setTimeout(() => {
      const secs = Math.round(stepMs / 1e3 * 10) / 10;
      update(steps.map((s, i) => i === idx ? { ...s, status: "done", duration: secs } : s));
      setElapsed((e) => e + secs);
      setNote(`Дууссан: ${steps[idx].title}`);
    }, stepMs);
    return () => window.clearTimeout(id);
  }, [phase, steps, stepMs]);
  const editing = phase === "draft";
  const doneCount = steps.filter((s) => s.status === "done").length;
  const failed = steps.findIndex((s) => s.status === "failed");
  const move = (from, to) => {
    if (to < 0 || to >= steps.length || from === to) return;
    const next = [...steps];
    const [s] = next.splice(from, 1);
    next.splice(to, 0, s);
    update(next);
    setNote(`«${s.title}» алхмыг ${to + 1}/${steps.length} байрлалд зөөлөө`);
  };
  const remove = (i) => {
    const s = steps[i];
    update(steps.filter((_, j) => j !== i));
    setNote(`«${s.title}» алхмыг хаслаа`);
    onAction?.("remove", s.id);
  };
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    update([...steps, { id: `step-${Date.now()}`, title: t, status: "pending" }]);
    setDraft("");
    setNote(`«${t}» алхмыг нэмлээ`);
    onAction?.("add", t);
  };
  const run = () => {
    const fresh = steps.map((s) => ({ ...s, status: "pending", error: void 0, duration: void 0 }));
    update(fresh);
    setElapsed(0);
    setPhase("running");
    onRun?.(fresh);
    onAction?.("run");
  };
  const retry = (i) => {
    update(steps.map((s, j) => j >= i ? { ...s, status: "pending", error: void 0, duration: void 0 } : s));
    setPhase("running");
    onRetry?.(steps[i].id);
    onAction?.("retry", steps[i].id);
  };
  return /* @__PURE__ */ jsxs("section", { className: `apl ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css$8 }),
    /* @__PURE__ */ jsxs("header", { className: "apl-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "apl-meta", children: [
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M2.5 4h1M2.5 8h1M2.5 12h1M6 4h7.5M6 8h7.5M6 12h7.5", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" }) }),
        "Төлөвлөгөө · ",
        steps.length,
        " алхам",
        editing && estimate && /* @__PURE__ */ jsxs("span", { children: [
          " · ",
          estimate
        ] })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "apl-title", children: title })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "apl-list", "aria-label": title, children: steps.map((s, i) => {
      const st = editing ? "pending" : s.status ?? "pending";
      const lineDone = st === "done" && steps[i + 1]?.status !== void 0;
      return /* @__PURE__ */ jsxs(
        "li",
        {
          className: `apl-step is-${st}`,
          "aria-current": st === "active" ? "step" : void 0,
          draggable: editing,
          onDragStart: () => dragId.current = s.id,
          onDragOver: (e) => {
            if (!editing || !dragId.current) return;
            e.preventDefault();
            const from = steps.findIndex((x) => x.id === dragId.current);
            if (from !== i) move(from, i);
          },
          onDragEnd: () => dragId.current = null,
          children: [
            /* @__PURE__ */ jsxs("span", { className: "apl-rail", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("span", { className: "apl-dot", children: st === "done" ? /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { className: "apl-check", d: "m4.5 8.3 2.3 2.3 4.7-5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) }) : st === "failed" ? "!" : st === "active" ? /* @__PURE__ */ jsx("svg", { className: "apl-spin", viewBox: "0 0 16 16", children: Array.from({ length: 8 }, (_, k) => /* @__PURE__ */ jsx("rect", { x: "7.3", y: "1.5", width: "1.4", height: "3.5", rx: ".7", fill: "currentColor", opacity: 0.25 + k * 0.1, transform: `rotate(${k * 45} 8 8)` }, k)) }) : i + 1 }),
              i < steps.length - 1 && /* @__PURE__ */ jsx("span", { className: `apl-line${lineDone ? " is-done" : ""}` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "apl-main", children: [
              /* @__PURE__ */ jsxs("div", { className: "apl-row", children: [
                editing ? /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "apl-name",
                    "aria-label": `Алхам ${i + 1}`,
                    value: s.title,
                    onChange: (e) => update(steps.map((x, j) => j === i ? { ...x, title: e.target.value } : x)),
                    onKeyDown: (e) => {
                      if (e.altKey && e.key === "ArrowUp") {
                        e.preventDefault();
                        move(i, i - 1);
                      }
                      if (e.altKey && e.key === "ArrowDown") {
                        e.preventDefault();
                        move(i, i + 1);
                      }
                    }
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "apl-name", children: s.title }),
                /* @__PURE__ */ jsxs("span", { className: "apl-sr", children: [
                  ", ",
                  st === "done" ? "Дууссан" : st === "failed" ? "Алдаатай" : st === "active" ? "Ажиллаж байна" : "Хүлээж байна"
                ] }),
                !editing && s.duration !== void 0 && st === "done" && /* @__PURE__ */ jsxs("span", { className: "apl-time", children: [
                  /* @__PURE__ */ jsx("span", { className: "apl-sr", children: "зарцуулсан: " }),
                  s.duration,
                  " с"
                ] }),
                editing && /* @__PURE__ */ jsx("button", { type: "button", className: "apl-x", "aria-label": `Хасах: ${s.title}`, onClick: () => remove(i), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "m4.5 4.5 7 7m0-7-7 7", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }) })
              ] }),
              (s.detail || s.tool) && /* @__PURE__ */ jsxs("div", { className: "apl-detail", children: [
                s.detail && /* @__PURE__ */ jsx("span", { children: s.detail }),
                s.tool && /* @__PURE__ */ jsx("code", { children: s.tool })
              ] }),
              !editing && st === "failed" && /* @__PURE__ */ jsxs(Fragment, { children: [
                s.error && /* @__PURE__ */ jsx("div", { className: "apl-err", children: s.error }),
                /* @__PURE__ */ jsxs("button", { type: "button", className: "apl-retry", onClick: () => retry(i), children: [
                  /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }),
                  "Эндээс дахин оролдох"
                ] })
              ] })
            ] })
          ]
        },
        s.id
      );
    }) }),
    editing && /* @__PURE__ */ jsxs("div", { className: "apl-add", children: [
      /* @__PURE__ */ jsx("span", { className: "apl-plus", "aria-hidden": "true", children: "+" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          "aria-label": "Шинэ алхам",
          placeholder: "Алхам нэмэх",
          value: draft,
          onChange: (e) => setDraft(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && add()
        }
      ),
      draft && /* @__PURE__ */ jsx("button", { type: "button", className: "apl-btn", onClick: add, children: "Нэмэх" })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: `apl-foot is-${phase}`, children: [
      phase === "draft" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "apl-hint", children: "Чирж дарааллыг солино" }),
        onCancel && /* @__PURE__ */ jsx("button", { type: "button", className: "apl-btn", onClick: () => {
          onCancel();
          onAction?.("cancel");
        }, children: "Болих" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "apl-btn is-dark", onClick: run, children: "Төлөвлөгөө ажиллуулах" })
      ] }),
      phase === "running" && /* @__PURE__ */ jsxs("span", { className: "apl-shimmer", children: [
        "Ажиллаж байна · ",
        Math.min(doneCount + 1, steps.length),
        "/",
        steps.length
      ] }),
      phase === "done" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "apl-ok", children: "✓ Төлөвлөгөө дууссан" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "apl-btn", onClick: run, children: "Дахин ажиллуулах" })
      ] }),
      phase === "stopped" && /* @__PURE__ */ jsxs("span", { className: "apl-stop", children: [
        /* @__PURE__ */ jsx("span", { className: "apl-dot is-mini", children: "!" }),
        "Зогссон · ",
        failed + 1,
        "-р алхам алдаатай"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "apl-sr", "aria-live": "polite", children: phase === "stopped" && failed >= 0 ? `${failed + 1}-р алхам алдаатай: ${steps[failed].title}. ${steps[failed].error ?? ""}` : note })
  ] });
}
const css$8 = `
.apl{--apl-bg:#fff;--apl-fg:#18181b;--apl-muted:#65656d;--apl-faint:#65656d;--apl-line:#ececef;--apl-chip:#f1f1f3;--apl-blue:#3b82f6;--apl-red:#c62828;--apl-red-soft:#fdecec;width:100%;max-width:440px;background:var(--apl-bg);color:var(--apl-fg);border:1px solid var(--apl-line);border-radius:var(--ts-radius,12px);box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .apl{--apl-bg:#1b1b1e;--apl-fg:#ececef;--apl-muted:#a1a1aa;--apl-faint:#9a9aa2;--apl-line:#2e2e33;--apl-chip:#2a2a2f;--apl-blue:#3b82f6;--apl-red:#ff6b6f;--apl-red-soft:#3a1d1f;color-scheme:dark}
.apl *{box-sizing:border-box}.apl button,.apl input{font:inherit;color:inherit}.apl button{cursor:pointer}
.apl-head{padding:16px 16px 6px}
.apl-meta{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--apl-muted)}.apl-meta svg{width:14px;height:14px}
.apl-title{margin:4px 0 0;font-size:15px;font-weight:500;letter-spacing:-.005em}
.apl-list{list-style:none;margin:0;padding:8px 16px 4px}
.apl-step{position:relative;display:flex;gap:10px;animation:apl-in .25s both}
.apl-step[draggable=true]{cursor:grab}
.apl-rail{position:relative;display:flex;flex-direction:column;align-items:center;flex:none;width:20px;padding-top:2px}
.apl-dot{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;border:1px solid var(--apl-line);font-size:11px;color:var(--apl-muted);background:var(--apl-bg);flex:none;transition:background .2s,border-color .2s}
.apl-dot svg{width:14px;height:14px}
.is-done>.apl-rail .apl-dot{background:var(--apl-blue);border-color:var(--apl-blue);color:#fff}
.is-failed>.apl-rail .apl-dot,.apl-dot.is-mini{background:var(--apl-red-soft);border-color:transparent;color:var(--apl-red);font-weight:600}
.is-active>.apl-rail .apl-dot{border-color:transparent;color:var(--apl-blue)}
.apl-check{stroke-dasharray:12;animation:apl-draw .3s ease-out both}
.apl-spin{animation:apl-rot 1s steps(8) infinite}
.apl-line{flex:1;width:1.5px;margin:2px 0;background:var(--apl-line);min-height:12px}
.apl-line.is-done{background:var(--apl-blue)}
.apl-main{flex:1;min-width:0;padding-bottom:14px}
.apl-row{display:flex;align-items:center;gap:8px;min-height:22px}
.apl-name{flex:1;min-width:0;font-size:14px;font-weight:400;color:var(--apl-fg)}
input.apl-name{border:0;padding:0;margin:0;background:none;outline:none;border-radius:var(--ts-radius,4px)}
input.apl-name:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb,var(--apl-blue) 35%,transparent)}
.is-pending .apl-name{color:color-mix(in srgb,var(--apl-fg) 85%,transparent)}
.apl-time{font-size:12px;color:var(--apl-muted);font-variant-numeric:tabular-nums}
.apl-x{display:grid;place-items:center;width:22px;height:22px;padding:0;border:0;border-radius:var(--ts-radius,5px);background:none;color:var(--apl-faint);opacity:0;transition:opacity .15s}
.apl-step:hover .apl-x,.apl-x:focus-visible{opacity:1}.apl-x:hover{background:var(--apl-chip);color:var(--apl-fg)}.apl-x svg{width:13px;height:13px}
@media(hover:none){.apl-x{opacity:1}}
.apl-detail{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:2px;font-size:12px;color:var(--apl-muted)}
.apl-detail code{padding:1px 5px;border-radius:var(--ts-radius,4px);background:var(--apl-chip);font:400 11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:color-mix(in srgb,var(--apl-fg) 75%,transparent);white-space:nowrap}
.apl-err{margin-top:8px;font-size:12px;color:var(--apl-red)}
.apl-retry{display:inline-flex;align-items:center;gap:6px;margin-top:10px;height:30px;padding:0 10px;border:1px solid var(--apl-line);border-radius:var(--ts-radius,7px);background:var(--apl-bg);font-size:13px}
.apl-retry:hover{background:var(--apl-chip)}.apl-retry svg{width:13px;height:13px;color:var(--apl-muted)}
.apl-add{display:flex;align-items:center;gap:10px;margin:0 16px 10px;padding:6px 0}
.apl-plus{display:grid;place-items:center;width:20px;height:20px;border:1px dashed var(--apl-faint);border-radius:50%;color:var(--apl-muted);font-size:13px;line-height:1}
.apl-add input{flex:1;min-width:0;border:0;background:none;outline:none;font-size:14px}.apl-add input::placeholder{color:var(--apl-faint)}
.apl-foot{display:flex;align-items:center;gap:8px;min-height:48px;padding:8px 16px;border-top:1px solid var(--apl-line);font-size:13px}
.apl-hint{flex:1;color:var(--apl-faint);font-size:12px}
.apl-btn{height:30px;padding:0 12px;border:1px solid var(--apl-line);border-radius:var(--ts-radius,7px);background:var(--apl-bg);font-size:13px}
.apl-btn.is-dark{background:var(--apl-fg);border-color:var(--apl-fg);color:var(--apl-bg)}
.is-done .apl-ok,.apl-foot.is-done .apl-ok{flex:1;color:var(--apl-muted)}
.apl-stop{display:flex;align-items:center;gap:8px;color:var(--apl-red)}.apl-dot.is-mini{width:16px;height:16px;font-size:10px}
.apl-shimmer{color:var(--apl-muted);background:linear-gradient(90deg,var(--apl-muted) 30%,var(--apl-fg) 50%,var(--apl-muted) 70%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:apl-sh 1.6s linear infinite}
.apl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.apl :focus-visible{outline:2px solid var(--apl-blue);outline-offset:2px}
@keyframes apl-in{from{opacity:0;transform:translateY(4px)}}
@keyframes apl-draw{from{stroke-dashoffset:12}to{stroke-dashoffset:0}}
@keyframes apl-rot{to{transform:rotate(360deg)}}
@keyframes apl-sh{from{background-position:100% 0}to{background-position:-100% 0}}
@media(max-width:400px){.apl-hint{display:none}}
@media(max-width:340px){.apl-head,.apl-list{padding-left:12px;padding-right:12px}.apl-foot{padding:8px 12px}}
@media(prefers-reduced-motion:reduce){.apl *{animation:none!important;transition:none!important}}
.apl-step{animation:aplsteprise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.apl-step:nth-child(1){animation-delay:0ms}.apl-step:nth-child(2){animation-delay:130ms}.apl-step:nth-child(3){animation-delay:260ms}.apl-step:nth-child(4){animation-delay:390ms}.apl-step:nth-child(5){animation-delay:520ms}.apl-step:nth-child(6){animation-delay:650ms}.apl-step:nth-child(7){animation-delay:780ms}.apl-step:nth-child(8){animation-delay:910ms}.apl-step:nth-child(9){animation-delay:1040ms}.apl-step:nth-child(10){animation-delay:1170ms}.apl-step:nth-child(11){animation-delay:1300ms}.apl-step:nth-child(12){animation-delay:1430ms}@keyframes aplsteprise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.apl-step{animation:none}}
`;
const defaultSources = [
  {
    id: "tokenwise",
    title: "Промпт кэшлэх нь юу вэ",
    site: "tokenwise.dev",
    date: "2026-07-18",
    url: "https://example.com/tokenwise",
    quote: "Үйлчилгээ үзүүлэгч промптын боловсруулсан эхлэлийг дахин ашигладаг. 10 000-аас дээш токентой промпт дээр эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог.",
    highlight: "эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог"
  },
  {
    id: "latency",
    title: "Кэшэд ээлтэй промпт зохиох",
    site: "latencynotes.io",
    date: "2026-08-02",
    url: "https://example.com/latency",
    quote: "Тогтвортой хэсгийг – системийн промпт, хэрэгслийн тодорхойлолт, урт баримт бичгийг – хамгийн эхэнд байрлуулж, хүсэлт бүрт өөрчлөгддөг зүйлийг ард нь тавь. Эхэнд нэг тэмдэгт өөрчлөгдөхөд араас нь бүх зүйл хүчингүй болно.",
    highlight: "хамгийн эхэнд"
  },
  {
    id: "weekly",
    title: "Үйлдвэрлэлийн орчин дахь утгын кэш",
    site: "inferenceweekly.com",
    date: "2026-09-09",
    url: "https://example.com/weekly",
    quote: "Ойролцоо асуултад кэшээс 40 ms орчимд хариулж, түгээмэл асуултын урсгалын бараг гуравны нэгийг хамарсан.",
    highlight: "40 ms орчимд"
  }
];
const defaultSegments = [
  {
    text: "Хамгийн том хожил бол промпт кэшлэх: үйлчилгээ үзүүлэгч промптын боловсруулсан эхлэлийг дахин ашигладаг тул урт системийн промптыг дуудлага бүрт дахин тооцоолохгүй.",
    cite: ["tokenwise"]
  },
  { text: " 10 000-аас дээш токентой промпт дээр энэ нь эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог.", cite: ["tokenwise"] },
  {
    text: " Энэ нь эхлэл нь ижил байх үед л ажилладаг тул системийн промпт, хэрэгсэл, урт баримт бичгийг эхэнд, хүсэлт бүрт өөрчлөгддөг зүйлийг төгсгөлд нь тавь.",
    cite: ["latency", "tokenwise"]
  },
  {
    text: "Давтагддаг асуултад загварын өмнө утгын кэш нэм: ойролцоо асуултад хадгалсан хариултыг 40 ms орчимд өгнө,",
    cite: ["weekly"],
    paragraph: true
  },
  { text: " энэ нь нэг үйлдвэрлэлийн орчинд түгээмэл асуултын урсгалын бараг гуравны нэгийг хамарсан.", cite: ["weekly"] },
  { text: " Үлдсэнийг урсгалаар дамжуул, ингэснээр хариулт бичигдэж байх үед хүмүүс эхний үгсийг харна." }
];
function Mark({ quote, highlight }) {
  const i = highlight ? quote.indexOf(highlight) : -1;
  if (!highlight || i < 0) return /* @__PURE__ */ jsx(Fragment, { children: quote });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    quote.slice(0, i),
    /* @__PURE__ */ jsx("mark", { children: highlight }),
    quote.slice(i + highlight.length)
  ] });
}
function CitedAnswer({
  segments = defaultSegments,
  sources = defaultSources,
  pagesRead = 12,
  defaultOpen,
  onOpenSource,
  onPreviewChange,
  action = { label: "Үргэлжлүүлэн асуух", onClick: () => {
  } },
  theme,
  className = ""
}) {
  const [hover, setHover] = React.useState(null);
  const [open, setOpen] = React.useState(defaultOpen ?? null);
  const [copied, setCopied] = React.useState(false);
  const active = hover ?? open;
  const idx = (id) => sources.findIndex((s) => s.id === id);
  const openSrc = sources.find((s) => s.id === open);
  const activeSrc = sources.find((s) => s.id === active);
  const citedIn = (id) => segments.filter((s) => s.cite?.[0] === id || s.cite?.includes(id)).length;
  const toggle = (id) => {
    const next = open === id ? null : id;
    setOpen(next);
    onPreviewChange?.(next);
  };
  const paragraphs = [];
  segments.forEach((s, i) => {
    if (i === 0 || s.paragraph) paragraphs.push([]);
    paragraphs[paragraphs.length - 1].push(s);
  });
  const Badge = ({ id, size = "s" }) => {
    const n = idx(id);
    const src = sources[n];
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `ca-badge ca-badge-${size}`,
        "aria-hidden": "true",
        children: src?.icon ?? (src ? initial(src) : "?")
      }
    );
  };
  const initial = (s) => s.site.charAt(0).toUpperCase();
  return /* @__PURE__ */ jsxs("section", { className: `ca ${active ? "ca-focus" : ""} ${className}`, "data-theme": theme, children: [
    /* @__PURE__ */ jsx("style", { children: css$7 }),
    /* @__PURE__ */ jsxs("div", { className: "ca-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "ca-head", children: [
        /* @__PURE__ */ jsx("span", { className: "ca-stack", children: sources.map((s) => /* @__PURE__ */ jsx("span", { className: "ca-badge ca-badge-s", children: s.icon ?? initial(s) }, s.id)) }),
        sources.length,
        " эх сурвалж",
        pagesRead ? ` · ${pagesRead} хуудас уншсан` : ""
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ca-prose", children: paragraphs.map((p, i) => /* @__PURE__ */ jsx("p", { children: p.map((s, j) => {
        const lit = !!active && !!s.cite?.includes(active);
        const lead = s.text.match(/^\s*/)?.[0] ?? "";
        const body = s.text.slice(lead.length);
        return /* @__PURE__ */ jsxs(React.Fragment, { children: [
          lead,
          /* @__PURE__ */ jsx("span", { className: `ca-seg ${lit ? "lit" : ""}`, children: body }),
          s.cite?.map((c) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `ca-num ${active === c ? "on" : ""}`,
              "aria-label": `Эх сурвалж ${idx(c) + 1}: ${sources[idx(c)]?.title ?? c}`,
              onMouseEnter: () => setHover(c),
              onMouseLeave: () => setHover(null),
              onFocus: () => setHover(c),
              onBlur: () => setHover(null),
              onClick: () => toggle(c),
              children: idx(c) + 1
            },
            c
          ))
        ] }, j);
      }) }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "ca-chips", children: sources.map((s, n) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: `ca-chip ${active === s.id ? "on" : ""}`,
          "aria-expanded": open === s.id,
          onMouseEnter: () => setHover(s.id),
          onMouseLeave: () => setHover(null),
          onFocus: () => setHover(s.id),
          onBlur: () => setHover(null),
          onClick: () => toggle(s.id),
          children: [
            /* @__PURE__ */ jsx("span", { className: "ca-badge ca-badge-s", children: s.icon ?? initial(s) }),
            s.site,
            /* @__PURE__ */ jsx("span", { className: "ca-chip-n", children: n + 1 })
          ]
        },
        s.id
      )) }),
      openSrc && /* @__PURE__ */ jsxs("div", { className: "ca-preview", role: "region", "aria-label": openSrc.title, children: [
        /* @__PURE__ */ jsxs("div", { className: "ca-pv-meta", children: [
          /* @__PURE__ */ jsx(Badge, { id: openSrc.id }),
          /* @__PURE__ */ jsx("span", { children: openSrc.site }),
          openSrc.date && /* @__PURE__ */ jsxs("span", { className: "ca-faint", children: [
            "· ",
            openSrc.date
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ca-pv-n", children: idx(openSrc.id) + 1 })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ca-pv-title", children: openSrc.title }),
        openSrc.quote && /* @__PURE__ */ jsx("p", { className: "ca-pv-quote", children: /* @__PURE__ */ jsx(Mark, { quote: openSrc.quote, highlight: openSrc.highlight }) }),
        /* @__PURE__ */ jsxs("div", { className: "ca-pv-actions", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: openSrc.url ?? "#",
              target: "_blank",
              rel: "noreferrer",
              onClick: (e) => {
                if (onOpenSource) {
                  e.preventDefault();
                  onOpenSource(openSrc);
                }
              },
              children: [
                "Эх сурвалжийг нээх",
                /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 3.5h6.5V10M12.5 3.5 4 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                navigator.clipboard?.writeText(openSrc.quote ?? "").catch(() => {
                });
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1400);
              },
              children: copied ? "Хуулсан" : "Ишлэл хуулах"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "ca-foot", children: [
      /* @__PURE__ */ jsx("span", { className: "ca-foot-l", children: activeSrc ? /* @__PURE__ */ jsxs(Fragment, { children: [
        activeSrc.site,
        /* @__PURE__ */ jsxs("span", { className: "ca-faint", children: [
          " · ",
          citedIn(activeSrc.id),
          " өгүүлбэрт иш татсан"
        ] })
      ] }) : /* @__PURE__ */ jsx("span", { className: "ca-faint", children: "Эх сурвалжийг харах бол дугаар дээр очно уу" }) }),
      action && /* @__PURE__ */ jsxs("button", { type: "button", className: "ca-action", onClick: action.onClick, children: [
        action.label,
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 8h10m-4-4 4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ] })
    ] })
  ] });
}
const css$7 = `
.ca{--ca-bg:#fff;--ca-fg:#18181b;--ca-muted:#65656d;--ca-faint:#65656d;--ca-line:#ececef;--ca-chip:#f4f4f5;--ca-lit:#e8f1fd;--ca-accent:#3b82f6;--ca-mark:#fdf0b8;width:100%;max-width:442px;background:var(--ca-bg);color:var(--ca-fg);border:1px solid var(--ca-line);border-radius:var(--ts-radius,12px);box-shadow:0 1px 2px #0000000a;font:400 14px/1.57 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .ca,.ca[data-theme=dark]{--ca-bg:#1b1b1e;--ca-fg:#ececef;--ca-muted:#a1a1aa;--ca-faint:#9a9aa2;--ca-line:#2e2e33;--ca-chip:#2a2a2f;--ca-lit:#1d3150;--ca-accent:#6aa3ff;--ca-mark:#5a4a12;color-scheme:dark}
/* theme="light" (or a [data-theme=light] wrapper) keeps the card light inside a dark page */
:where(.dark,[data-theme=dark]) :where([data-theme=light]) .ca,.ca[data-theme=light]{--ca-bg:#fff;--ca-fg:#18181b;--ca-muted:#65656d;--ca-faint:#65656d;--ca-line:#ececef;--ca-chip:#f4f4f5;--ca-lit:#e8f1fd;--ca-accent:#3b82f6;--ca-mark:#fdf0b8;color-scheme:light}
.ca *{box-sizing:border-box}.ca button{font:inherit;color:inherit;cursor:pointer}
.ca-body{padding:14px 20px 16px}
.ca-head{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ca-muted);margin-bottom:12px}
.ca-stack{display:flex}.ca-stack .ca-badge{margin-right:-2px;box-shadow:0 0 0 1.5px var(--ca-bg)}
.ca-badge{display:inline-grid;place-items:center;width:20px;height:20px;box-sizing:border-box;border:1px solid var(--ca-faint);border-radius:var(--ts-radius,6px);background:var(--ca-chip);color:var(--ca-fg);font-size:11px;font-weight:600;flex:none}
.ca-badge svg{width:12px;height:12px;stroke-width:1.75}
.ca-prose p{margin:0 0 10px}.ca-prose p:last-child{margin:0}
.ca-seg{transition:color .2s,background .2s;border-radius:var(--ts-radius,3px)}
.ca-focus .ca-seg{color:var(--ca-faint)}
.ca-focus .ca-seg.lit{color:var(--ca-fg);background:var(--ca-lit);box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:1px 2px;margin:0 -2px}
.ca-num{display:inline-grid;place-items:center;min-width:15px;height:15px;margin:0 2px 0 3px;padding:0 3px;vertical-align:1px;border:0;border-radius:var(--ts-radius,3px);background:var(--ca-chip);font-size:10px!important;line-height:1;color:var(--ca-muted)!important;transition:background .15s}
.ca-num:hover,.ca-num.on{background:color-mix(in srgb,var(--ca-fg) 16%,transparent);color:var(--ca-fg)!important}
.ca-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:16px;margin-left:-6px}
.ca-chip{display:inline-flex;align-items:center;gap:7px;flex:none;white-space:nowrap;height:28px;padding:0 8px 0 6px;border:1px solid transparent;border-radius:var(--ts-radius,6px);background:none;font-size:12.5px!important;color:var(--ca-muted)!important;transition:background .15s,border-color .15s,color .15s}
.ca-focus .ca-chip{color:var(--ca-faint)!important}
.ca-chip:hover,.ca-chip.on,.ca-focus .ca-chip.on{background:var(--ca-chip);border-color:var(--ca-line);color:var(--ca-fg)!important}
.ca-chip-n{font-size:10.5px;color:var(--ca-faint)}
.ca-preview{margin-top:10px;padding:12px 14px;border:1px solid var(--ca-line);border-radius:var(--ts-radius,10px);background:color-mix(in srgb,var(--ca-chip) 45%,var(--ca-bg));animation:ca-in .2s both}
.ca-pv-meta{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ca-muted)}
.ca-pv-n{margin-left:auto;font-size:11px;color:var(--ca-faint)}
.ca-pv-title{font-weight:500;margin:6px 0 4px}
.ca-pv-quote{margin:0;font-size:13px;color:var(--ca-muted);line-height:1.55}
.ca-pv-quote mark{background:var(--ca-mark);color:var(--ca-fg);border-radius:var(--ts-radius,2px);padding:0 1px}
.ca-pv-actions{display:flex;gap:6px;margin-top:10px}
.ca-pv-actions a,.ca-pv-actions button{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;border:1px solid var(--ca-line);border-radius:var(--ts-radius,6px);background:var(--ca-bg);font-size:12px;color:var(--ca-fg);text-decoration:none}
.ca-pv-actions svg{width:12px;height:12px}
.ca-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 8px 8px 20px;border-top:1px solid var(--ca-line);font-size:12.5px}
.ca-foot-l{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ca-faint{color:var(--ca-faint)}
.ca-action{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 10px;border:1px solid var(--ca-line);border-radius:var(--ts-radius,7px);background:var(--ca-bg);font-size:13.5px!important;font-weight:500;box-shadow:0 1px 1px #00000008}
.ca-action:hover{background:var(--ca-chip)}.ca-action svg{width:14px;height:14px;color:var(--ca-muted)}
.ca :focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ca-bg),0 0 0 2px var(--ca-accent)}.ca-stack .ca-badge:focus-visible{box-shadow:0 0 0 1.5px var(--ca-bg),0 0 0 2.5px var(--ca-accent)}
@keyframes ca-in{from{opacity:0;transform:translateY(-3px)}}
@media(max-width:480px){.ca-body{padding:12px 16px 14px}.ca-foot{padding-left:16px}}
@media(prefers-reduced-motion:reduce){.ca *{animation:none!important;transition:none!important}}
.ca-action{white-space:nowrap;font-size:13px!important}
`;
const baseLabels = {
  needsYou: "Таны ээлж",
  later: "Дараа",
  show: "Харах",
  recommended: "Санал болгосон",
  approve: "Батлах",
  decline: "Татгалзах",
  own: "Өөр хариулт…",
  waiting: (n) => `${n} шийдвэр хүлээж байна`,
  of: (i, n) => `${i}/${n}`,
  close: "Хаах",
  closeReason: "Яагаад хаах вэ? (заавал биш)",
  confirmClose: "Хаах",
  cancel: "Болих"
};
const defaultDecisions = [
  {
    id: "weekly",
    kind: "approval",
    task: "Долоо хоногийн тайлан",
    question: "Долоо хоногийн тайланг Хойд салхи ХХК руу илгээх үү?",
    facts: [
      { label: "Хэнд", value: "Дулмаа Рэнцэн, Хойд салхи ХХК" },
      { label: "Гарчиг", value: "45-р долоо хоног: өгөгдөл татах ажил эхэлсэн, самбар хянагдаж байна" },
      { label: "Агуулга", value: "Өгөгдөл татах үйлчилгээ туршилтын орчинд ажиллаж, мягмар гарагийн оргил ачааллыг нэг ч үйл явдал алдалгүй даалаа. Самбарыг Дулмаагийн баг хянаж байна." }
    ]
  }
];
function DecisionCard({
  decisions = defaultDecisions,
  onDecide,
  onLater,
  defaultFolded = false,
  reveal,
  labels: labelsProp,
  className = "",
  host = false,
  busy = false,
  error,
  meta,
  onClose
}) {
  const L = { ...baseLabels, ...labelsProp };
  const [answered, setAnswered] = React.useState([]);
  const open = decisions.filter((d2) => !answered.includes(d2.id));
  const [page, setPage] = React.useState(0);
  const [folded, setFolded] = React.useState(defaultFolded);
  const [focus, setFocus] = React.useState(0);
  const [text2, setText] = React.useState("");
  const [said, setSaid] = React.useState("");
  const [pulse, setPulse] = React.useState(0);
  const [closing, setClosing] = React.useState(false);
  const rowsRef = React.useRef([]);
  const fieldRef = React.useRef(null);
  const showRef = React.useRef(null);
  const qid = React.useId();
  const idx = Math.min(page, Math.max(0, open.length - 1));
  const d = open[idx];
  React.useEffect(() => {
    if (reveal === void 0) return;
    setFolded(false);
    setPulse((p) => p + 1);
    window.setTimeout(() => rowsRef.current[focus]?.focus(), 30);
  }, [reveal]);
  const rows = !d ? [] : d.kind === "approval" ? [
    { key: "approve", title: L.approve, answer: "approve" },
    { key: "decline", title: L.decline, answer: "decline" }
  ] : (d.options ?? []).map((o) => ({ key: o.id, title: o.title, summary: o.summary, recommended: o.recommended, answer: { option: o.id } }));
  const answer = (a) => {
    if (!d || busy) return;
    if (host) {
      setText("");
      onDecide?.(d.id, a);
      return;
    }
    const left = open.length - 1;
    const what = a === "approve" ? L.approve : a === "decline" ? L.decline : "text" in a ? a.text : rows.find((r) => typeof r.answer === "object" && "option" in r.answer && r.answer.option === a.option)?.title;
    setAnswered((s) => [...s, d.id]);
    setText("");
    setFocus(0);
    setSaid(left ? `Хариулт бүртгэгдлээ: ${what}. ${L.waiting(left)}.` : "Хариулт бүртгэгдлээ");
    onDecide?.(d.id, a);
    window.setTimeout(() => left ? rowsRef.current[0]?.focus() : void 0, 30);
  };
  const later = () => {
    if (!d) return;
    setFolded(true);
    setSaid(`${L.later}. ${L.waiting(open.length)}.`);
    onLater?.(d.id);
    window.setTimeout(() => showRef.current?.focus(), 30);
  };
  const n = rows.length;
  const move = (to) => {
    const t = Math.max(0, Math.min(n, to));
    setFocus(t);
    (t === n ? fieldRef.current : rowsRef.current[t])?.focus();
  };
  const onKey = (e) => {
    const inField = e.target === fieldRef.current;
    if (e.key === "Escape") {
      e.preventDefault();
      later();
      return;
    }
    if (!inField && /^[1-5]$/.test(e.key)) {
      const k = Number(e.key) - 1;
      if (k < n) answer(rows[k].answer);
      else if (k === n) move(n);
      e.preventDefault();
      return;
    }
    if (inField) {
      if (e.key === "ArrowUp" && !text2) {
        e.preventDefault();
        move(n - 1);
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowRight") e.preventDefault(), move(focus + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") e.preventDefault(), move(focus - 1);
    else if (e.key === "Home") e.preventDefault(), move(0);
    else if (e.key === "End") e.preventDefault(), move(n - 1);
    else if ((e.key === "Enter" || e.key === " ") && focus < n) e.preventDefault(), answer(rows[focus].answer);
  };
  if (!open.length)
    return /* @__PURE__ */ jsxs("div", { className: `dc dc-gone ${className}`, children: [
      /* @__PURE__ */ jsx("style", { children: css$6 }),
      /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", className: "dc-sr", children: said })
    ] });
  if (folded)
    return /* @__PURE__ */ jsxs("div", { className: `dc ${className}`, children: [
      /* @__PURE__ */ jsx("style", { children: css$6 }),
      /* @__PURE__ */ jsxs("div", { className: "dc-folded", children: [
        /* @__PURE__ */ jsx("span", { className: "dc-pill", children: L.needsYou }),
        /* @__PURE__ */ jsx("span", { children: L.waiting(open.length) }),
        /* @__PURE__ */ jsx("span", { className: "dc-dot", children: "·" }),
        /* @__PURE__ */ jsx("button", { ref: showRef, type: "button", className: "dc-link", onClick: () => {
          setFolded(false);
          window.setTimeout(() => rowsRef.current[0]?.focus(), 30);
        }, children: L.show })
      ] }),
      /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", className: "dc-sr", children: said })
    ] });
  const isPick = d.kind === "pick";
  return /* @__PURE__ */ jsxs("div", { className: `dc ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css$6 }),
    /* @__PURE__ */ jsxs("section", { className: "dc-card", "data-pulse": pulse > 0, role: "group", "aria-labelledby": qid, onKeyDown: onKey, children: [
      /* @__PURE__ */ jsxs("header", { className: "dc-head", children: [
        /* @__PURE__ */ jsx("span", { className: "dc-pill", children: L.needsYou }),
        d.task && /* @__PURE__ */ jsx("span", { className: "dc-task", children: d.task }),
        /* @__PURE__ */ jsx("span", { className: "dc-spacer" }),
        open.length > 1 && /* @__PURE__ */ jsxs("span", { className: "dc-pager", children: [
          /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Өмнөх шийдвэр", disabled: idx === 0, onClick: () => setPage(idx - 1), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m10 4-4 4 4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }) }),
          L.of(idx + 1, open.length),
          /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Дараах шийдвэр", disabled: idx === open.length - 1, onClick: () => setPage(idx + 1), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m6 4 4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }) })
        ] }),
        onClose && !closing && /* @__PURE__ */ jsx("button", { type: "button", className: "dc-later", disabled: busy, onClick: () => {
          setClosing(true);
          window.setTimeout(() => fieldRef.current?.focus(), 30);
        }, children: L.close }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "dc-later", "aria-keyshortcuts": "Escape", disabled: busy, onClick: later, children: L.later })
      ] }),
      /* @__PURE__ */ jsx("h3", { id: qid, className: "dc-q", "data-full": host || void 0, children: d.question }),
      meta && /* @__PURE__ */ jsx("div", { className: "dc-meta", children: meta }),
      d.facts && /* @__PURE__ */ jsx("dl", { className: "dc-facts", children: d.facts.map((f) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsx("dt", { children: f.label }),
        /* @__PURE__ */ jsx("dd", { children: f.value })
      ] }, f.label)) }),
      /* @__PURE__ */ jsx("div", { className: isPick ? "dc-tiles" : "dc-rows", role: "listbox", "aria-labelledby": qid, children: rows.map((r, i) => {
        const opt = d.options?.find((o) => o.id === r.key);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            ref: (el) => {
              rowsRef.current[i] = el;
            },
            role: "option",
            "aria-selected": focus === i,
            "aria-keyshortcuts": String(i + 1),
            tabIndex: focus === i ? 0 : -1,
            "aria-disabled": busy || void 0,
            className: isPick ? "dc-tile" : "dc-row",
            onFocus: () => setFocus(i),
            onClick: () => answer(r.answer),
            children: [
              isPick && opt?.preview && /* @__PURE__ */ jsx("div", { className: "dc-preview", children: opt.preview }),
              /* @__PURE__ */ jsx("span", { className: "dc-num", "aria-hidden": "true", children: i + 1 }),
              /* @__PURE__ */ jsxs("span", { className: "dc-body", children: [
                /* @__PURE__ */ jsxs("span", { className: "dc-title", children: [
                  r.title,
                  r.recommended && /* @__PURE__ */ jsx("span", { className: "dc-rec", children: L.recommended })
                ] }),
                r.summary && /* @__PURE__ */ jsx("span", { className: "dc-sum", children: r.summary })
              ] })
            ]
          },
          r.key
        );
      }) }),
      /* @__PURE__ */ jsxs("label", { className: "dc-row dc-own", children: [
        /* @__PURE__ */ jsx("span", { className: "dc-num", "aria-hidden": "true", children: n + 1 }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fieldRef,
            value: text2,
            "aria-label": L.own.replace("…", ""),
            "aria-keyshortcuts": String(n + 1),
            placeholder: closing ? L.closeReason : L.own,
            onFocus: () => setFocus(n),
            onChange: (e) => setText(e.target.value),
            onKeyDown: (e) => {
              if (e.key !== "Enter") return;
              if (closing) {
                e.preventDefault();
                if (!busy && d) onClose?.(d.id, text2.trim());
              } else if (text2.trim()) {
                e.preventDefault();
                answer({ text: text2.trim() });
              }
            }
          }
        ),
        !closing && text2.trim() && /* @__PURE__ */ jsx("button", { type: "button", className: "dc-send", "aria-label": "Хариулт илгээх", onClick: () => answer({ text: text2.trim() }), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 13V3.5M4 7.5l4-4 4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
      ] }),
      closing && /* @__PURE__ */ jsxs("div", { className: "dc-closebar", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "dc-danger", disabled: busy, onClick: () => d && onClose?.(d.id, text2.trim()), children: L.confirmClose }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "dc-later", onClick: () => setClosing(false), children: L.cancel })
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "dc-error", role: "alert", children: error })
    ] }, `${d.id}-${pulse}`),
    /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", className: "dc-sr", children: said })
  ] });
}
const css$6 = `
.dc,.dc-demo{--dc-bg:#fff;--dc-fg:#18181b;--dc-muted:#65656d;--dc-faint:#65656d;--dc-line:#ececef;--dc-soft:#f4f4f5;--dc-hl:#f6f6f7;--dc-accent:#4f7cf0;--dc-amber:#9a4f0c;--dc-amber-bg:#fdefdc;--dc-red:#dc2626;font:400 12.5px/1.45 Inter,system-ui,sans-serif;color:var(--dc-fg)}
:where(.dark,[data-theme=dark]) :is(.dc,.dc-demo){--dc-bg:#1b1b1e;--dc-fg:#ececef;--dc-muted:#a1a1aa;--dc-faint:#9a9aa2;--dc-line:#2c2c31;--dc-soft:#28282d;--dc-hl:#232327;--dc-accent:#7c9cff;--dc-amber:#eba659;--dc-amber-bg:#3a2a16;--dc-red:#f87171;color-scheme:dark}
.dc{width:100%}.dc *,.dc-demo *{box-sizing:border-box}.dc button{font:inherit;color:inherit;cursor:pointer}
.dc-card{background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:var(--ts-radius,12px);box-shadow:0 1px 2px #0000000a,0 4px 14px -6px #0000001a;padding:10px 12px 10px;animation:dc-in .25s both}
.dc-card[data-pulse=true]{animation:dc-pulse .7s both}
.dc-head{display:flex;align-items:center;gap:8px;font-size:12px}
.dc-pill{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:var(--ts-radius,5px);background:var(--dc-amber-bg);color:var(--dc-amber);font-size:11px;font-weight:500;white-space:nowrap}
.dc-task{color:var(--dc-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dc-spacer{flex:1}
.dc-later{border:0;background:none;padding:2px 4px;border-radius:var(--ts-radius,5px);font-size:12px}.dc-later:hover{background:var(--dc-hl)}
.dc-pager{display:inline-flex;align-items:center;gap:2px;color:var(--dc-muted);font-size:12px}
.dc-pager button{display:grid;place-items:center;width:22px;height:22px;border:0;border-radius:var(--ts-radius,5px);background:none}.dc-pager button:hover:not(:disabled){background:var(--dc-hl)}.dc-pager button:disabled{opacity:.35;cursor:default}.dc-pager svg{width:13px;height:13px}
.dc-q{margin:12px 0 8px;font-size:14px;font-weight:500;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dc-q[data-full=true]{display:block;-webkit-line-clamp:none;overflow:visible;white-space:pre-wrap}
.dc-meta{display:flex;flex-wrap:wrap;align-items:center;gap:2px 10px;margin:-2px 0 8px;color:var(--dc-muted);font-size:11.5px}.dc-meta a,.dc-meta button{color:var(--dc-accent);border:0;background:none;padding:0;text-decoration:none}.dc-meta a:hover,.dc-meta button:hover{text-decoration:underline}
.dc-closebar{display:flex;align-items:center;gap:8px;margin-top:6px}
.dc-danger{border:0;border-radius:var(--ts-radius,6px);padding:3px 10px;background:var(--dc-red);color:#fff!important;font-size:12px;font-weight:500}
.dc-error{margin:6px 0 0;color:var(--dc-red);font-size:12px}
.dc [aria-disabled=true],.dc button:disabled{opacity:.5;cursor:default}
.dc-facts{display:grid;grid-template-columns:auto 1fr;gap:3px 20px;margin:0 0 8px}
.dc-facts dt{color:var(--dc-muted)}.dc-facts dd{margin:0;min-width:0;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
.dc-rows{display:flex;flex-direction:column;margin:0 -6px}
.dc-row{display:flex;align-items:center;gap:10px;min-height:36px;padding:4px 6px;border-radius:var(--ts-radius,8px);cursor:pointer;outline:none;transition:background .12s}
.dc-rows .dc-row:hover,.dc-rows .dc-row:focus-visible{background:var(--dc-hl)}
.dc-rows .dc-row:focus-visible{box-shadow:inset 0 0 0 1.5px var(--dc-accent)}
.dc-num{display:grid;place-items:center;flex:none;width:22px;height:22px;border-radius:var(--ts-radius,5px);background:var(--dc-soft);color:var(--dc-muted);font-size:11.5px;font-variant-numeric:tabular-nums}
.dc-body{display:flex;flex-direction:column;min-width:0}
.dc-title{display:flex;align-items:center;gap:8px}
.dc-rec{height:17px;padding:0 5px;border-radius:var(--ts-radius,4px);background:color-mix(in srgb,var(--dc-accent) 12%,transparent);color:color-mix(in srgb,var(--dc-accent) 65%,var(--dc-fg));font-size:10.5px;font-weight:500;line-height:17px}
.dc-sum{color:var(--dc-muted);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dc-own{margin:4px -6px 0;cursor:text}
.dc-own input{flex:1;min-width:0;height:28px;border:0;background:none;outline:none;color:var(--dc-fg);font:inherit;border-bottom:1px solid transparent}
.dc-own input::placeholder{color:var(--dc-faint)}.dc-own input:focus{border-bottom-color:var(--dc-line)}
.dc-send{display:grid;place-items:center;width:26px;height:26px;border:0;border-radius:var(--ts-radius,7px);background:var(--dc-fg);color:var(--dc-bg)!important}.dc-send svg{width:13px;height:13px}
.dc-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.dc-tile{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;padding:8px;border:1px solid var(--dc-line);border-radius:var(--ts-radius,9px);cursor:pointer;outline:none}
.dc-tile:hover,.dc-tile:focus-visible{border-color:var(--dc-accent)}
.dc-preview{grid-column:1/-1;aspect-ratio:16/10;border-radius:var(--ts-radius,6px);background:var(--dc-soft);overflow:hidden}
.dc-folded{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:var(--ts-radius,12px);color:var(--dc-muted);font-size:12.5px;animation:dc-in .2s both}
.dc-dot{color:var(--dc-faint)}.dc-link{border:0;background:none;padding:0;color:var(--dc-fg)!important;font-weight:500}
.dc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.dc :focus-visible{outline:2px solid var(--dc-accent);outline-offset:2px}.dc .dc-row:focus-visible{outline:none}
.dc-demo{width:100%;max-width:600px;display:flex;flex-direction:column;gap:8px}
.dc-status{display:flex;align-items:center;gap:8px;margin:0 0 4px 12px;color:var(--dc-muted)}.dc-status svg{width:18px;height:18px}
.dc-composer{background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:var(--ts-radius,12px);padding:14px 10px 10px 14px}
.dc-ph{color:var(--dc-faint);height:40px}
.dc-tools{display:flex;align-items:center;gap:12px;color:var(--dc-muted)}.dc-tools svg{width:15px;height:15px;display:block}
.dc-req,.dc-auto{display:inline-flex;align-items:center;gap:6px}.dc-auto{color:var(--dc-fg)}.dc-auto svg{width:12px;height:12px;color:var(--dc-faint)}
.dc-sendbox{display:grid;place-items:center;width:28px;height:28px;border-radius:var(--ts-radius,7px);background:var(--dc-soft);color:var(--dc-faint)}
@keyframes dc-in{from{opacity:0;transform:translateY(4px)}}
@keyframes dc-pulse{0%{background:var(--dc-soft)}100%{background:var(--dc-bg)}}
@media(max-width:420px){.dc-tiles{grid-template-columns:minmax(0,1fr)}.dc-preview{display:none}}
@media(hover:none){.dc-row{min-height:44px}}
@media(prefers-reduced-motion:reduce){.dc *,.dc-card{animation:none!important;transition:none!important}}
`;
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
    /* @__PURE__ */ jsx("style", { children: css$5 }),
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
const css$5 = `
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
const defaultMemories = [
  { id: "m1", text: "Эхлээд товч хариулт, дэлгэрэнгүйг асуухад нь өгнө", category: "Шийдвэр", source: "Чатаас", date: "10/12" },
  { id: "m2", text: "Шинэ хувилбарыг зөвхөн Мягмар гарагт гаргана", category: "Шийдвэр", source: "Гараар нэмсэн", date: "10/2", paused: true },
  { id: "m3", text: "Дизайнд 4px-ийн торон систем ашиглана", category: "Шийдвэр", source: "Дизайны файлаас", date: "10/7" },
  { id: "m4", text: "Баасан гараг бүр харилцагчдад шинэчлэлийн тойм илгээх", category: "Даалгавар", source: "Чатаас", date: "10/9" },
  { id: "m5", text: "Бүртгэлийн урсгалыг 10/24-нөөс өмнө шинэчлэх", category: "Даалгавар", source: "Чатаас", date: "10/11" },
  { id: "m6", text: "Сараа бүтээгдэхүүний дизайныг хариуцдаг", category: "Хүмүүс", source: "Чатаас", date: "9/28" },
  { id: "m7", text: "Болд урьдчилан мэдэгдсэн уулзалтыг илүүд үздэг", category: "Хүмүүс", source: "Багийн чатаас", date: "10/3" },
  { id: "m8", text: "Дизайны токенуудын тухай нийтлэлийг дуусгах", category: "Унших", source: "Чатаас", date: "10/5" }
];
const ALL_LABEL = "Бүгд";
const glyph = (d, cls) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", className: cls, "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", children: d });
const catPaths = {
  All: /* @__PURE__ */ jsx("path", { d: "M8 2.5 14 5.5 8 8.5 2 5.5ZM2 8.5l6 3 6-3M2 11l6 3 6-3" }),
  Шийдвэр: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "m5.6 8.2 1.7 1.7 3.2-3.4" })
  ] }),
  Даалгавар: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "2.8", y: "2.8", width: "10.4", height: "10.4", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M5.5 6h5M5.5 8.5h5M5.5 11h3" })
  ] }),
  Хүмүүс: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "6", cy: "5.8", r: "2.3" }),
    /* @__PURE__ */ jsx("path", { d: "M2.2 13c.4-2.2 1.9-3.4 3.8-3.4s3.4 1.2 3.8 3.4M10.6 3.8a2.2 2.2 0 0 1 0 4.2M11.6 9.8c1.2.4 2 1.4 2.2 3.2" })
  ] }),
  Унших: /* @__PURE__ */ jsx("path", { d: "M2.5 3.5c2 0 4 .5 5.5 1.8v8c-1.5-1.3-3.5-1.8-5.5-1.8ZM13.5 3.5c-2 0-4 .5-5.5 1.8v8c1.5-1.3 3.5-1.8 5.5-1.8Z" })
};
const tagPath = /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M2.5 8.2V3.2a.7.7 0 0 1 .7-.7h5l5.3 5.3a.9.9 0 0 1 0 1.3l-4 4a.9.9 0 0 1-1.3 0Z" }),
  /* @__PURE__ */ jsx("circle", { cx: "5.4", cy: "5.4", r: ".9" })
] });
const catIcon = (c, cls) => glyph(catPaths[c] ?? tagPath, cls);
const memoryIcon = glyph(/* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M8 13.5V7" }),
  /* @__PURE__ */ jsx("path", { d: "M8 7c0-2.5 1.5-4.2 4-4.5.2 2.6-1.4 4.4-4 4.5ZM8 9C8 7 6.7 5.6 4.5 5.4 4.3 7.5 5.7 8.9 8 9Z" })
] }), "mp-count-icon");
const chipLabel = (c) => c === "All" ? ALL_LABEL : c;
const short = (t) => t.length > 24 ? `${t.slice(0, 24)}…` : t;
const Ico$1 = {
  edit: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M10.5 3 13 5.5 6 12.5H3.5V10Z", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }) }),
  pause: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M5.5 3.5v9M10.5 3.5v9", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }),
  play: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M5 3.5v9l7-4.5Z", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }) }),
  trash: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  plus: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }) }),
  search: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "4.3", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
    /* @__PURE__ */ jsx("path", { d: "m10.2 10.2 3.3 3.3", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })
  ] })
};
function MemoryPanel({
  memories: memoriesProp,
  onChange,
  onAdd,
  onEdit,
  onPause,
  onForget,
  onRestore,
  enabled: enabledProp,
  defaultEnabled = true,
  onEnabledChange,
  categories: categoriesProp,
  title = "Санах ой",
  maxHeight = 360,
  undoFor = 5e3,
  addedSource = "Гараар нэмсэн",
  action,
  className = ""
}) {
  const [own, setOwn] = React.useState(memoriesProp ?? defaultMemories);
  const list = onChange && memoriesProp ? memoriesProp : own;
  const [enabledState, setEnabledState] = React.useState(defaultEnabled);
  const enabled = enabledProp ?? enabledState;
  const [filter, setFilter] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const [newCat, setNewCat] = React.useState("");
  const [undo, setUndo] = React.useState(null);
  const chipRefs = React.useRef([]);
  const noteId = React.useId();
  const categories = React.useMemo(() => {
    const seen = categoriesProp ? [...categoriesProp] : [];
    list.forEach((m) => !seen.includes(m.category) && seen.push(m.category));
    return seen;
  }, [list, categoriesProp]);
  React.useEffect(() => {
    if (!undo) return;
    const id = window.setTimeout(() => setUndo(null), undoFor);
    return () => window.clearTimeout(id);
  }, [undo, undoFor]);
  const commit = (next) => {
    if (!(onChange && memoriesProp)) setOwn(next);
    onChange?.(next);
  };
  const setEnabled = (v) => {
    setEnabledState(v);
    onEnabledChange?.(v);
  };
  const q = query.trim().toLowerCase();
  const matches = (m) => (filter === "All" || m.category === filter) && (!q || m.text.toLowerCase().includes(q));
  const paused = list.filter((m) => m.paused).length;
  const chips = ["All", ...categories];
  const count = (c) => c === "All" ? list.length : list.filter((m) => m.category === c).length;
  const saveEdit = (m) => {
    const text2 = draft.trim();
    if (text2 && text2 !== m.text) {
      commit(list.map((x) => x.id === m.id ? { ...x, text: text2 } : x));
      onEdit?.(m.id, text2);
    }
    setEditing(null);
  };
  const saveNew = () => {
    const text2 = draft.trim();
    if (!text2) return;
    const memory = {
      id: `m${Date.now()}`,
      text: text2,
      category: newCat || (filter !== "All" ? filter : categories[0] ?? "Ерөнхий"),
      source: addedSource,
      date: `${(/* @__PURE__ */ new Date()).getMonth() + 1}/${(/* @__PURE__ */ new Date()).getDate()}`
    };
    commit([...list, memory]);
    onAdd?.(memory);
    setAdding(false);
    setDraft("");
  };
  const forget = (m) => {
    const index = list.findIndex((x) => x.id === m.id);
    commit(list.filter((x) => x.id !== m.id));
    setUndo({ memory: m, index });
    onForget?.(m.id);
  };
  const restore = () => {
    if (!undo) return;
    const next = [...list];
    next.splice(Math.min(undo.index, next.length), 0, undo.memory);
    commit(next);
    onRestore?.(undo.memory);
    setUndo(null);
  };
  return /* @__PURE__ */ jsxs("section", { className: `mp ${enabled ? "" : "is-off"} ${className}`, role: "group", "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css$4 }),
    /* @__PURE__ */ jsxs("header", { className: "mp-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "mp-top", children: [
        /* @__PURE__ */ jsx("h3", { children: title }),
        /* @__PURE__ */ jsxs("span", { className: "mp-count", children: [
          memoryIcon,
          list.length
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "mp-use", children: [
          "Санах ой ашиглах",
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": enabled,
              "aria-controls": noteId,
              className: "mp-switch",
              onClick: () => setEnabled(!enabled),
              children: /* @__PURE__ */ jsx("i", {})
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mp-note", id: noteId, "data-open": !enabled, children: /* @__PURE__ */ jsx("p", { children: "Туслах шинэ чатад санах ойг ашиглахгүй, хадгалахгүй. Энд байгаа зүйл устахгүй." }) }),
      /* @__PURE__ */ jsxs("div", { className: "mp-filters", children: [
        searching ? /* @__PURE__ */ jsx(
          "input",
          {
            className: "mp-search",
            autoFocus: true,
            placeholder: "Санах ойгоос хайх",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Escape") {
                setQuery("");
                setSearching(false);
              }
            }
          }
        ) : /* @__PURE__ */ jsx("div", { className: "mp-chips", role: "radiogroup", "aria-label": "Ангилал", children: chips.map((c, i) => /* @__PURE__ */ jsxs(
          "button",
          {
            ref: (el) => {
              chipRefs.current[i] = el;
            },
            type: "button",
            role: "radio",
            "aria-checked": filter === c,
            tabIndex: filter === c ? 0 : -1,
            className: "mp-chip",
            onClick: () => setFilter(c),
            onKeyDown: (e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const n = (i + (e.key === "ArrowRight" ? 1 : -1) + chips.length) % chips.length;
              setFilter(chips[n]);
              chipRefs.current[n]?.focus();
            },
            children: [
              catIcon(c, "mp-chip-icon"),
              chipLabel(c),
              /* @__PURE__ */ jsx("span", { children: count(c) })
            ]
          },
          c
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "mp-icon",
            "aria-label": searching ? "Хайлт хаах" : "Санах ойгоос хайх",
            onClick: () => {
              setSearching(!searching);
              setQuery("");
            },
            children: searching ? /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "m4.5 4.5 7 7m0-7-7 7", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }) }) : Ico$1.search
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mp-list", style: { maxHeight }, children: [
      categories.map((cat) => {
        const rows = list.filter((m) => m.category === cat);
        const visible = rows.filter(matches);
        return /* @__PURE__ */ jsxs("section", { className: "mp-group", "data-hidden": visible.length === 0, "aria-label": cat, inert: visible.length === 0 ? true : void 0, children: [
          /* @__PURE__ */ jsxs("div", { className: "mp-gh", children: [
            catIcon(cat, "mp-gh-icon"),
            cat
          ] }),
          rows.map((m) => {
            const show = matches(m);
            return /* @__PURE__ */ jsx("div", { className: `mp-row ${m.paused ? "is-paused" : ""}`, "data-hidden": !show, inert: !show ? true : void 0, children: /* @__PURE__ */ jsxs("div", { className: "mp-inner", children: [
              catIcon(m.category, "mp-row-icon"),
              editing === m.id ? /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "mp-edit",
                  autoFocus: true,
                  value: draft,
                  rows: 2,
                  onChange: (e) => setDraft(e.target.value),
                  onBlur: () => saveEdit(m),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      saveEdit(m);
                    }
                    if (e.key === "Escape") setEditing(null);
                  }
                }
              ) : /* @__PURE__ */ jsx("p", { className: "mp-text", children: m.text }),
              /* @__PURE__ */ jsxs("div", { className: "mp-meta", children: [
                m.source,
                m.source && m.date && " · ",
                m.date,
                m.paused && /* @__PURE__ */ jsx("span", { className: "mp-tag", children: "Түр зогссон" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mp-acts", children: [
                /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `Засах “${short(m.text)}”`, onClick: () => {
                  setEditing(m.id);
                  setDraft(m.text);
                }, children: Ico$1.edit }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": `${m.paused ? "Үргэлжлүүлэх" : "Түр зогсоох"} “${short(m.text)}”`,
                    onClick: () => {
                      commit(list.map((x) => x.id === m.id ? { ...x, paused: !x.paused } : x));
                      onPause?.(m.id, !m.paused);
                    },
                    children: m.paused ? Ico$1.play : Ico$1.pause
                  }
                ),
                /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `Мартах “${short(m.text)}”`, onClick: () => forget(m), children: Ico$1.trash })
              ] })
            ] }) }, m.id);
          })
        ] }, cat);
      }),
      list.filter(matches).length === 0 && /* @__PURE__ */ jsx("p", { className: "mp-empty", children: "Энд санах ой алга" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mp-new", children: adding ? /* @__PURE__ */ jsxs("div", { className: "mp-editor", children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          autoFocus: true,
          rows: 2,
          placeholder: "Туслахын санах ёстой зүйл",
          value: draft,
          onChange: (e) => setDraft(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              saveNew();
            }
            if (e.key === "Escape") setAdding(false);
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mp-ed-row", children: [
        /* @__PURE__ */ jsx("div", { className: "mp-chips", role: "radiogroup", "aria-label": "Шинэ санах ойн ангилал", children: categories.map((c) => {
          const cur = newCat || (filter !== "All" ? filter : categories[0]);
          return /* @__PURE__ */ jsxs("button", { type: "button", role: "radio", "aria-checked": cur === c, className: "mp-chip", onClick: () => setNewCat(c), children: [
            catIcon(c, "mp-chip-icon"),
            c
          ] }, c);
        }) }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "mp-btn", onClick: () => setAdding(false), children: "Болих" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "mp-btn mp-primary", disabled: !draft.trim(), onClick: saveNew, children: "Хадгалах" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("button", { type: "button", className: "mp-add", onClick: () => {
      setAdding(true);
      setDraft("");
      setNewCat("");
    }, children: [
      Ico$1.plus,
      "Шинэ санах ой"
    ] }) }),
    /* @__PURE__ */ jsxs("footer", { className: "mp-foot", children: [
      /* @__PURE__ */ jsx("span", { role: "status", className: "mp-status", children: undo ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Мартсан: “",
        short(undo.memory.text),
        "”"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        memoryIcon,
        /* @__PURE__ */ jsx("b", { children: list.length }),
        " санах ой",
        paused > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          " · ",
          paused,
          " түр зогссон"
        ] })
      ] }) }, undo ? "undo" : "count"),
      undo ? /* @__PURE__ */ jsx("button", { type: "button", className: "mp-btn", onClick: restore, children: "Буцаах" }) : action && /* @__PURE__ */ jsx("button", { type: "button", className: "mp-btn", onClick: action.onClick, children: action.label })
    ] })
  ] });
}
const css$4 = `
.mp{--mp-bg:#fff;--mp-fg:#18181b;--mp-muted:#65656d;--mp-faint:#65656d;--mp-line:#ececef;--mp-soft:#f4f4f5;--mp-chip:#ededef;--mp-accent:#3b82f6;width:100%;max-width:400px;background:var(--mp-bg);color:var(--mp-fg);border:1px solid var(--mp-line);border-radius:var(--ts-radius,12px);box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .mp{--mp-bg:#1b1b1e;--mp-fg:#ececef;--mp-muted:#a1a1aa;--mp-faint:#9a9aa2;--mp-line:#2c2c31;--mp-soft:#232328;--mp-chip:#2c2c32;--mp-accent:#7aa2ff;color-scheme:dark}
.mp *{box-sizing:border-box}.mp button,.mp input,.mp textarea{font:inherit;color:inherit}.mp button{cursor:pointer}
.mp-head{padding:15px 15px 12px;border-bottom:1px solid var(--mp-line)}
.mp-top{display:flex;align-items:center;gap:8px}
.mp-top h3{margin:0;font-size:16px;font-weight:500;letter-spacing:-.01em}
.mp-count{display:inline-flex;align-items:center;gap:4px;padding:0 6px;border-radius:var(--ts-radius,4px);background:var(--mp-chip);font-size:11.5px;line-height:17px;color:var(--mp-muted)}
.mp-use{margin-left:auto;display:inline-flex;align-items:center;gap:8px;font-size:14px;color:var(--mp-muted)}
.mp-switch{position:relative;width:26px;height:16px;padding:0;border:0;border-radius:var(--ts-radius,9px);background:var(--mp-faint);transition:background .2s}
.mp-switch[aria-checked=true]{background:var(--mp-accent)}
.mp-switch i{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:var(--ts-radius,6px);background:#fff;transition:transform .2s cubic-bezier(.3,1.3,.5,1)}
.mp-switch[aria-checked=true] i{transform:translateX(10px);width:10px;border-radius:var(--ts-radius,3px)}
.mp-note{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s}
.mp-note[data-open=true]{grid-template-rows:1fr}
.mp-note p{overflow:hidden;margin:0;font-size:12.5px;color:var(--mp-muted)}.mp-note[data-open=true] p{padding-top:8px}
.mp-filters{display:flex;align-items:center;gap:6px;margin-top:12px}
.mp-chips{display:flex;gap:4px;flex-wrap:wrap;flex:1;min-width:0}
.mp-chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:1px solid var(--mp-line);border-radius:var(--ts-radius,5px);background:var(--mp-bg);font-size:14px;transition:background .15s}
.mp-chip span{font-size:12px;color:var(--mp-muted)}
.mp-count-icon,.mp-chip-icon,.mp-gh-icon,.mp-row-icon{flex:none;width:13px;height:13px;color:var(--mp-muted)}
.mp-status{display:inline-flex;align-items:center;gap:5px}
.mp-gh{display:flex;align-items:center;gap:6px}
.mp-chip:hover{background:var(--mp-soft)}
.mp-chip[aria-checked=true]{background:var(--mp-chip);border-color:var(--mp-chip)}
.mp-icon{display:grid;place-items:center;width:28px;height:28px;margin-left:auto;border:0;border-radius:var(--ts-radius,6px);background:none;color:var(--mp-muted)}
.mp-icon:hover{background:var(--mp-soft);color:var(--mp-fg)}.mp-icon svg{width:15px;height:15px}
.mp-search{flex:1;height:28px;padding:0 9px;border:1px solid var(--mp-line);border-radius:var(--ts-radius,6px);background:var(--mp-bg);outline:0}
.mp-search:focus{border-color:var(--mp-accent)}
.mp-list{overflow-y:auto;padding:4px 0 6px;transition:opacity .25s}
.mp.is-off .mp-list{opacity:.45}
.mp-group{display:grid;grid-template-rows:1fr;transition:opacity .25s}
.mp-group[data-hidden=true]{display:none}
.mp-gh{padding:12px 15px 2px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mp-muted)}
.mp-row{display:grid;grid-template-rows:1fr;transition:grid-template-rows .3s,opacity .3s}
.mp-row[data-hidden=true]{grid-template-rows:0fr;opacity:0}
.mp-inner{position:relative;overflow:hidden;padding:8px 15px 7px 37px;min-height:0}
.mp-row-icon{position:absolute;left:15px;top:11px;width:14px;height:14px}
.mp-row.is-paused .mp-row-icon{color:var(--mp-faint)}
.mp-row[data-hidden=true] .mp-inner{padding-top:0;padding-bottom:0}
.mp-row[data-hidden=true] .mp-row-icon{top:3px}
.mp-inner:hover,.mp-inner:focus-within{background:var(--mp-soft)}
.mp-text{margin:0;padding-right:4px}
.mp-row.is-paused .mp-text{color:var(--mp-faint)}
.mp-meta{display:flex;align-items:center;gap:4px;margin-top:2px;font-size:12.5px;color:var(--mp-muted);white-space:pre}
.mp-tag{margin-left:6px;padding:0 6px;border-radius:var(--ts-radius,4px);background:var(--mp-chip);font-size:11.5px;animation:mp-fade .25s both}
.mp-acts{position:absolute;right:10px;bottom:5px;display:flex;gap:1px;padding:2px;border-radius:var(--ts-radius,7px);background:var(--mp-bg);border:1px solid var(--mp-line);opacity:0;transition:opacity .15s}
.mp-inner:hover .mp-acts,.mp-inner:focus-within .mp-acts{opacity:1}
.mp-acts button{display:grid;place-items:center;width:24px;height:22px;border:0;border-radius:var(--ts-radius,5px);background:none;color:var(--mp-muted)}
.mp-acts button:hover{background:var(--mp-soft);color:var(--mp-fg)}.mp-acts svg{width:13px;height:13px}
.mp-edit,.mp-editor textarea{display:block;width:100%;resize:none;padding:6px 8px;border:1px solid var(--mp-accent);border-radius:var(--ts-radius,6px);background:var(--mp-bg);outline:0}
.mp-empty{margin:0;padding:18px 15px;color:var(--mp-muted);font-size:13px}
.mp-new{border-top:1px solid var(--mp-line)}
.mp-add{display:flex;align-items:center;gap:9px;width:100%;height:44px;padding:0 15px;border:0;background:none;text-align:left}
.mp-add svg{width:14px;height:14px;color:var(--mp-muted)}.mp-add:hover{background:var(--mp-soft)}
.mp-editor{padding:10px 15px;animation:mp-fade .2s both}
.mp-ed-row{display:flex;align-items:center;gap:6px;margin-top:8px}
.mp-ed-row .mp-chip{height:24px;font-size:12.5px;padding:0 7px}
.mp-btn{height:28px;padding:0 10px;border:1px solid var(--mp-line);border-radius:var(--ts-radius,6px);background:var(--mp-bg);font-size:13px!important}
.mp-btn:hover{background:var(--mp-soft)}.mp-btn:disabled{opacity:.5;cursor:default}
.mp-primary{background:var(--mp-fg);border-color:var(--mp-fg);color:var(--mp-bg)!important}.mp-primary:hover{background:var(--mp-fg);opacity:.9}
.mp-foot{display:flex;align-items:center;justify-content:space-between;min-height:43px;padding:6px 10px 6px 15px;border-top:1px solid var(--mp-line);font-size:12.5px;color:var(--mp-muted)}
.mp-foot b{font-weight:500;color:var(--mp-fg)}
.mp-status{animation:mp-fade .25s both}
.mp :focus-visible{outline:2px solid var(--mp-accent);outline-offset:1px}
@keyframes mp-fade{from{opacity:0}}
@media(max-width:420px){.mp-chip span{display:none}.mp-use{font-size:0;gap:0}}
@media(prefers-reduced-motion:reduce){.mp *{animation:none!important;transition:none!important}}
.mp-group{animation:mpgrouprise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.mp-group:nth-child(1){animation-delay:0ms}.mp-group:nth-child(2){animation-delay:110ms}.mp-group:nth-child(3){animation-delay:220ms}.mp-group:nth-child(4){animation-delay:330ms}.mp-group:nth-child(5){animation-delay:440ms}.mp-group:nth-child(6){animation-delay:550ms}.mp-group:nth-child(7){animation-delay:660ms}.mp-group:nth-child(8){animation-delay:770ms}.mp-group:nth-child(9){animation-delay:880ms}.mp-group:nth-child(10){animation-delay:990ms}.mp-group:nth-child(11){animation-delay:1100ms}.mp-group:nth-child(12){animation-delay:1210ms}@keyframes mpgrouprise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.mp-group{animation:none}}
`;
const sourcePreviewLabelsMn = {
  open: "Апп-д нээх",
  close: "Хаах",
  kinds: { document: "Баримт", calendar: "Календарь", message: "Мессеж", decision: "Шийдвэр", meeting: "Уулзалт", note: "Тэмдэглэл", link: "Холбоос", brand: "Апп" }
};
const demoSource = {
  id: "retention",
  title: "Харилцагчийн хадгалалтын тайлан 2026",
  kind: "document",
  kindLabel: "Баримт · Судалгаа",
  date: "2026-11-02",
  quote: "Шинэ харилцагчдын 62% нь гурван сарын дотор багцаа ахиулсан. Ахиулалт ихэвчлэн хоёр дахь сард болдог.",
  highlight: "62% нь гурван сарын дотор"
};
const SOURCE_ICON = {
  document: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }),
    /* @__PURE__ */ jsx("path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }),
    /* @__PURE__ */ jsx("path", { d: "M10 9H8" }),
    /* @__PURE__ */ jsx("path", { d: "M16 13H8" }),
    /* @__PURE__ */ jsx("path", { d: "M16 17H8" })
  ] }),
  calendar: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M8 2v4" }),
    /* @__PURE__ */ jsx("path", { d: "M16 2v4" }),
    /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M3 10h18" }),
    /* @__PURE__ */ jsx("path", { d: "M8 14h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M12 14h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M16 14h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M8 18h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M12 18h.01" }),
    /* @__PURE__ */ jsx("path", { d: "M16 18h.01" })
  ] }),
  message: /* @__PURE__ */ jsx("path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }),
  decision: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M6 3v12" }),
    /* @__PURE__ */ jsx("circle", { cx: "18", cy: "6", r: "3" }),
    /* @__PURE__ */ jsx("circle", { cx: "6", cy: "18", r: "3" }),
    /* @__PURE__ */ jsx("path", { d: "M18 9a9 9 0 0 1-9 9" })
  ] }),
  meeting: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M18 21a8 8 0 0 0-16 0" }),
    /* @__PURE__ */ jsx("circle", { cx: "10", cy: "8", r: "5" }),
    /* @__PURE__ */ jsx("path", { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" })
  ] }),
  note: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" }),
    /* @__PURE__ */ jsx("path", { d: "m15 5 4 4" })
  ] }),
  link: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
    /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
  ] })
};
const BRAND_LOGO = {
  "slack": { light: "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNDQ3LjYgMjQ1Mi41IiB2aWV3Qm94PSIwIDAgMjQ0Ny42IDI0NTIuNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiA+PGcgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im04OTcuNCAwYy0xMzUuMy4xLTI0NC44IDEwOS45LTI0NC43IDI0NS4yLS4xIDEzNS4zIDEwOS41IDI0NS4xIDI0NC44IDI0NS4yaDI0NC44di0yNDUuMWMuMS0xMzUuMy0xMDkuNS0yNDUuMS0yNDQuOS0yNDUuMy4xIDAgLjEgMCAwIDBtMCA2NTRoLTY1Mi42Yy0xMzUuMy4xLTI0NC45IDEwOS45LTI0NC44IDI0NS4yLS4yIDEzNS4zIDEwOS40IDI0NS4xIDI0NC43IDI0NS4zaDY1Mi43YzEzNS4zLS4xIDI0NC45LTEwOS45IDI0NC44LTI0NS4yLjEtMTM1LjQtMTA5LjUtMjQ1LjItMjQ0LjgtMjQ1LjN6IiBmaWxsPSIjMzZjNWYwIiAvPjxwYXRoIGQ9Im0yNDQ3LjYgODk5LjJjLjEtMTM1LjMtMTA5LjUtMjQ1LjEtMjQ0LjgtMjQ1LjItMTM1LjMuMS0yNDQuOSAxMDkuOS0yNDQuOCAyNDUuMnYyNDUuM2gyNDQuOGMxMzUuMy0uMSAyNDQuOS0xMDkuOSAyNDQuOC0yNDUuM3ptLTY1Mi43IDB2LTY1NGMuMS0xMzUuMi0xMDkuNC0yNDUtMjQ0LjctMjQ1LjItMTM1LjMuMS0yNDQuOSAxMDkuOS0yNDQuOCAyNDUuMnY2NTRjLS4yIDEzNS4zIDEwOS40IDI0NS4xIDI0NC43IDI0NS4zIDEzNS4zLS4xIDI0NC45LTEwOS45IDI0NC44LTI0NS4zeiIgZmlsbD0iIzJlYjY3ZCIgLz48cGF0aCBkPSJtMTU1MC4xIDI0NTIuNWMxMzUuMy0uMSAyNDQuOS0xMDkuOSAyNDQuOC0yNDUuMi4xLTEzNS4zLTEwOS41LTI0NS4xLTI0NC44LTI0NS4yaC0yNDQuOHYyNDUuMmMtLjEgMTM1LjIgMTA5LjUgMjQ1IDI0NC44IDI0NS4yem0wLTY1NC4xaDY1Mi43YzEzNS4zLS4xIDI0NC45LTEwOS45IDI0NC44LTI0NS4yLjItMTM1LjMtMTA5LjQtMjQ1LjEtMjQ0LjctMjQ1LjNoLTY1Mi43Yy0xMzUuMy4xLTI0NC45IDEwOS45LTI0NC44IDI0NS4yLS4xIDEzNS40IDEwOS40IDI0NS4yIDI0NC43IDI0NS4zeiIgZmlsbD0iI2VjYjIyZSIgLz48cGF0aCBkPSJtMCAxNTUzLjJjLS4xIDEzNS4zIDEwOS41IDI0NS4xIDI0NC44IDI0NS4yIDEzNS4zLS4xIDI0NC45LTEwOS45IDI0NC44LTI0NS4ydi0yNDUuMmgtMjQ0LjhjLTEzNS4zLjEtMjQ0LjkgMTA5LjktMjQ0LjggMjQ1LjJ6bTY1Mi43IDB2NjU0Yy0uMiAxMzUuMyAxMDkuNCAyNDUuMSAyNDQuNyAyNDUuMyAxMzUuMy0uMSAyNDQuOS0xMDkuOSAyNDQuOC0yNDUuMnYtNjUzLjljLjItMTM1LjMtMTA5LjQtMjQ1LjEtMjQ0LjctMjQ1LjMtMTM1LjQgMC0yNDQuOSAxMDkuOC0yNDQuOCAyNDUuMSAwIDAgMCAuMSAwIDAiIGZpbGw9IiNlMDFlNWEiIC8+PC9nPjwvc3ZnPg==" },
  "notion": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjY4IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgdmlld0JveD0iMCAwIDI1NiAyNjgiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xNi4wOTIgMTEuNTM4IDE2NC4wOS42MDhjMTguMTc5LTEuNTYgMjIuODUtLjUwOCAzNC4yOCA3LjgwMWw0Ny4yNDMgMzMuMjgyQzI1My40MDYgNDcuNDE0IDI1NiA0OC45NzUgMjU2IDU1LjIwN3YxODIuNTI3YzAgMTEuNDM5LTQuMTU1IDE4LjIwNS0xOC42OTYgMTkuMjRMNjUuNDQgMjY3LjM3OGMtMTAuOTEzLjUxNy0xNi4xMS0xLjA0My0yMS44MjUtOC4zMjdMOC44MjYgMjEzLjgxNEMyLjU4NiAyMDUuNDg3IDAgMTk5LjI1NCAwIDE5MS45N1YyOS43MjZjMC05LjM1MiA0LjE1NS0xNy4xNTMgMTYuMDkyLTE4LjE4OFoiLz48cGF0aCBkPSJNMTY0LjA5LjYwOCAxNi4wOTIgMTEuNTM4QzQuMTU1IDEyLjU3MyAwIDIwLjM3NCAwIDI5LjcyNnYxNjIuMjQ1YzAgNy4yODQgMi41ODUgMTMuNTE2IDguODI2IDIxLjg0M2wzNC43ODkgNDUuMjM3YzUuNzE1IDcuMjg0IDEwLjkxMiA4Ljg0NCAyMS44MjUgOC4zMjdsMTcxLjg2NC0xMC40MDRjMTQuNTMyLTEuMDM1IDE4LjY5Ni03LjgwMSAxOC42OTYtMTkuMjRWNTUuMjA3YzAtNS45MTEtMi4zMzYtNy42MTQtOS4yMS0xMi42NmwtMS4xODUtLjg1NkwxOTguMzcgOC40MDlDMTg2Ljk0LjEgMTgyLjI3LS45NTIgMTY0LjA5LjYwOFpNNjkuMzI3IDUyLjIyYy0xNC4wMzMuOTQ1LTE3LjIxNiAxLjE1OS0yNS4xODYtNS4zMjNMMjMuODc2IDMwLjc3OGMtMi4wNi0yLjA4Ni0xLjAyNi00LjY5IDQuMTYzLTUuMjA3bDE0Mi4yNzQtMTAuMzk1YzExLjk0Ny0xLjA0MyAxOC4xNyAzLjEyIDIyLjg0MiA2Ljc1OGwyNC40MDEgMTcuNjhjMS4wNDMuNTI1IDMuNjM4IDMuNjM3LjUxNyAzLjYzN0w3MS4xNDYgNTIuMDk1bC0xLjgxOS4xMjVabS0xNi4zNiAxODMuOTU0VjgxLjIyMmMwLTYuNzY3IDIuMDc3LTkuODg3IDguMy0xMC40MTNMMjMwLjAyIDYwLjkzYzUuNzI0LS41MTcgOC4zMSAzLjEyIDguMzEgOS44Nzl2MTUzLjkxN2MwIDYuNzY3LTEuMDQ0IDEyLjQ5LTEwLjM4NyAxMy4wMDhsLTE2MS40ODcgOS4zNjFjLTkuMzQzLjUxNy0xMy40ODktMi41OTQtMTMuNDg5LTEwLjkyMVpNMjEyLjM3NyA4OS41M2MxLjAzNCA0LjY4MSAwIDkuMzYyLTQuNjgxIDkuODk3bC03Ljc4MyAxLjU0MnYxMTQuNDA0Yy02Ljc1OCAzLjYzNy0xMi45ODEgNS43MTUtMTguMTggNS43MTUtOC4zMDggMC0xMC4zODYtMi42MDQtMTYuNjA5LTEwLjM5NmwtNTAuODk4LTgwLjA3OXY3Ny40NzZsMTYuMSAzLjY0NnMwIDkuMzYyLTEyLjk4OSA5LjM2MmwtMzUuODE0IDIuMDc3Yy0xLjA0My0yLjA4NiAwLTcuMjg0IDMuNjMtOC4zMThsOS4zNTEtMi41OTVWMTA5LjgyM2wtMTIuOTgtMS4wNTJjLTEuMDQ0LTQuNjggMS41NS0xMS40MzkgOC44MjYtMTEuOTY1bDM4LjQyNi0yLjU4NSA1Mi45NTggODEuMTEzdi03MS43NmwtMTMuNDk4LTEuNTUyYy0xLjA0My01LjczMyAzLjExMS05Ljg5NiA4LjMtMTAuNDA0bDM1Ljg0LTIuMDg3WiIvPjwvc3ZnPg==" },
  "google-calendar": { light: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzUwNzJfMzc2NikiPjxwYXRoIGQ9Ik0zOTAuNzM2IDEyMS4yNjRIMTIxLjI2NFYzOTAuNzM2SDM5MC43MzZWMTIxLjI2NFoiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTM5MC43MzYgNTEyTDUxMiAzOTAuNzM2TDQ1MS4zNjggMzgwLjM5MkwzOTAuNzM2IDM5MC43MzZMMzc5LjY3IDQ0Ni4xOTZMMzkwLjczNiA1MTJaIiBmaWxsPSIjRUE0MzM1Ii8+PHBhdGggZD0iTTAgMzkwLjczNlY0NzEuNTc4QzAgNDkzLjkxMiAxOC4wODggNTEyIDQwLjQyIDUxMkgxMjEuMjY0TDEzMy43MTQgNDUxLjM2OEwxMjEuMjY0IDM5MC43MzZMNTUuMTk4IDM4MC4zOTJMMCAzOTAuNzM2WiIgZmlsbD0iIzE4ODAzOCIvPjxwYXRoIGQ9Ik01MTIgMTIxLjI2NFY0MC40MkM1MTIgMTguMDg4IDQ5My45MTIgMCA0NzEuNTggMEgzOTAuNzM2QzM4My4zNiAzMC4wNzIgMzc5LjY3MSA1Mi4yMDI3IDM3OS42NyA2Ni4zOTJDMzc5LjY3IDgwLjU4IDM4My4zNTkgOTguODcwNyAzOTAuNzM2IDEyMS4yNjRDNDE3LjU1NiAxMjguOTQ0IDQzNy43NjcgMTMyLjc4NCA0NTEuMzY4IDEzMi43ODRDNDY0Ljk2OSAxMzIuNzg0IDQ4NS4xOCAxMjguOTQ1IDUxMiAxMjEuMjY0WiIgZmlsbD0iIzE5NjdEMiIvPjxwYXRoIGQ9Ik01MTIgMTIxLjI2NEgzOTAuNzM2VjM5MC43MzZINTEyVjEyMS4yNjRaIiBmaWxsPSIjRkJCQzA0Ii8+PHBhdGggZD0iTTM5MC43MzYgMzkwLjczNkgxMjEuMjY0VjUxMkgzOTAuNzM2VjM5MC43MzZaIiBmaWxsPSIjMzRBODUzIi8+PHBhdGggZD0iTTM5MC43MzYgMEg0MC40MjJDMTguMDg4IDAgMCAxOC4wODggMCA0MC40MlYzOTAuNzM2SDEyMS4yNjRWMTIxLjI2NEgzOTAuNzM2VjBaIiBmaWxsPSIjNDI4NUY0Ii8+PHBhdGggZD0iTTE3Ni41NCAzMzAuMzA4QzE2Ni40NjggMzIzLjUwNCAxNTkuNDk0IDMxMy41NjggMTU1LjY4OCAzMDAuNDI4TDE3OS4wNjYgMjkwLjc5NkMxODEuMTg2IDI5OC44OCAxODQuODkxIDMwNS4xNDUgMTkwLjE4MiAzMDkuNTkyQzE5NS40MzYgMzE0LjAzOCAyMDEuODM2IDMxNi4yMjggMjA5LjMxNCAzMTYuMjI4QzIxNi45NTkgMzE2LjIyOCAyMjMuNTI3IDMxMy45MDMgMjI5LjAxOCAzMDkuMjU0QzIzNC41MSAzMDQuNjA2IDIzNy4yNzIgMjk4LjY3OCAyMzcuMjcyIDI5MS41MDRDMjM3LjI3MiAyODQuMTYgMjM0LjM3NSAyNzguMTY0IDIyOC41ODIgMjczLjUxNkMyMjIuNzg4IDI2OC44NjggMjE1LjUxMiAyNjYuNTQ0IDIwNi44MjIgMjY2LjU0NEgxOTMuMzE0VjI0My40MDRIMjA1LjQ0QzIxMi45MTcgMjQzLjQwNCAyMTkuMjE2IDI0MS4zODIgMjI0LjMzNiAyMzcuMzM4QzIyOS40NTYgMjMzLjI5OCAyMzIuMDE2IDIyNy43NzIgMjMyLjAxNiAyMjAuNzMyQzIzMi4wMTYgMjE0LjQ2OCAyMjkuNzI2IDIwOS40ODIgMjI1LjE0NiAyMDUuNzQ0QzIyMC41NjYgMjAyLjAwNCAyMTQuNzcgMjAwLjExOCAyMDcuNzMgMjAwLjExOEMyMDAuODU4IDIwMC4xMTggMTk1LjQwMiAyMDEuOTM4IDE5MS4zNiAyMDUuNjA4QzE4Ny4zMTkgMjA5LjI4OSAxODQuMjgyIDIxMy45MzcgMTgyLjUzNCAyMTkuMTE2TDE1OS4zOTQgMjA5LjQ4MkMxNjIuNDU4IDIwMC43OTIgMTY4LjA4NCAxOTMuMTEyIDE3Ni4zMzYgMTg2LjQ3NkMxODQuNTg4IDE3OS44NCAxOTUuMTMyIDE3Ni41MDYgMjA3LjkzMiAxNzYuNTA2QzIxNy4zOTggMTc2LjUwNiAyMjUuOTIgMTc4LjMyNiAyMzMuNDY2IDE4MS45OTZDMjQxLjAxIDE4NS42NjggMjQ2LjkzOCAxOTAuNzU0IDI1MS4yMTYgMTk3LjIyMkMyNTUuNDk2IDIwMy43MjIgMjU3LjYxNiAyMTAuOTk4IDI1Ny42MTYgMjE5LjA4MkMyNTcuNjE2IDIyNy4zMzQgMjU1LjYzIDIzNC4zMDggMjUxLjY1NiAyNDAuMDM0QzI0Ny42ODIgMjQ1Ljc2IDI0Mi43OTYgMjUwLjEzOCAyMzcuMDAyIDI1My4yMDRWMjU0LjU4NEMyNDQuNDgzIDI1Ny42NjkgMjUwLjk4MiAyNjIuNzM1IDI1NS43OTggMjY5LjIzOEMyNjAuNjgyIDI3NS44MDYgMjYzLjE0MiAyODMuNjU0IDI2My4xNDIgMjkyLjgxOEMyNjMuMTQyIDMwMS45NzggMjYwLjgxNiAzMTAuMTY0IDI1Ni4xNjggMzE3LjMzOEMyNTEuNTIgMzI0LjUxNCAyNDUuMDg4IDMzMC4xNzIgMjM2LjkzNCAzMzQuMjgyQzIyOC43NSAzMzguMzkyIDIxOS41NTQgMzQwLjQ4MiAyMDkuMzQ4IDM0MC40ODJDMTk3LjUyNCAzNDAuNTE0IDE4Ni42MTIgMzM3LjExMiAxNzYuNTQgMzMwLjMwOFpNMzIwLjEzMiAyMTQuMjk4TDI5NC40NjYgMjMyLjg1OEwyODEuNjMyIDIxMy4zOUwzMjcuNjc4IDE4MC4xNzZIMzQ1LjMyOFYzMzYuODQySDMyMC4xMzJWMjE0LjI5OFoiIGZpbGw9IiM0Mjg1RjQiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMF81MDcyXzM3NjYiPjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSJ3aGl0ZSIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==" },
  "gmail": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgNDkuNCA1MTIgMzk5LjQyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbD0iIzQyODVmNCIgZD0iTTM0LjkxIDQ0OC44MThoODEuNDU0VjI1MUwwIDE2My43MjdWNDEzLjkxYzAgMTkuMjg3IDE1LjYyMiAzNC45MSAzNC45MSAzNC45MXoiLz48cGF0aCBmaWxsPSIjMzRhODUzIiBkPSJNMzk1LjYzNiA0NDguODE4aDgxLjQ1NWMxOS4yODcgMCAzNC45MDktMTUuNjIyIDM0LjkwOS0zNC45MDlWMTYzLjcyN0wzOTUuNjM2IDI1MXoiLz48cGF0aCBmaWxsPSIjZmJiYzA0IiBkPSJNMzk1LjYzNiA5OS43MjdWMjUxTDUxMiAxNjMuNzI3di00Ni41NDVjMC00My4xNDItNDkuMjUtNjcuNzgyLTgzLjc4Mi00MS44OTF6Ii8+PC9nPjxwYXRoIGZpbGw9IiNlYTQzMzUiIGQ9Ik0xMTYuMzY0IDI1MVY5OS43MjdMMjU2IDIwNC40NTUgMzk1LjYzNiA5OS43MjdWMjUxTDI1NiAzNTUuNzI3eiIvPjxwYXRoIGZpbGw9IiNjNTIyMWYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTAgMTE3LjE4MnY0Ni41NDVMMTE2LjM2NCAyNTFWOTkuNzI3TDgzLjc4MiA3NS4yOTFDNDkuMjUgNDkuNCAwIDc0LjA0IDAgMTE3LjE4eiIvPjwvZz48L3N2Zz4=" },
  "google-drive": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4Ny4zIDc4Ij48cGF0aCBmaWxsPSIjMDA2NmRhIiBkPSJtNi42IDY2Ljg1IDMuODUgNi42NWMuOCAxLjQgMS45NSAyLjUgMy4zIDMuM0wyNy41IDUzSDBjMCAxLjU1LjQgMy4xIDEuMiA0LjV6Ii8+PHBhdGggZmlsbD0iIzAwYWM0NyIgZD0iTTQzLjY1IDI1IDI5LjkgMS4yYy0xLjM1LjgtMi41IDEuOS0zLjMgMy4zbC0yNS40IDQ0QTkuMDYgOS4wNiAwIDAgMCAwIDUzaDI3LjV6Ii8+PHBhdGggZmlsbD0iI2VhNDMzNSIgZD0iTTczLjU1IDc2LjhjMS4zNS0uOCAyLjUtMS45IDMuMy0zLjNsMS42LTIuNzVMODYuMSA1Ny41Yy44LTEuNCAxLjItMi45NSAxLjItNC41SDU5Ljc5OGw1Ljg1MiAxMS41eiIvPjxwYXRoIGZpbGw9IiMwMDgzMmQiIGQ9Ik00My42NSAyNSA1Ny40IDEuMkM1Ni4wNS40IDU0LjUgMCA1Mi45IDBIMzQuNGMtMS42IDAtMy4xNS40NS00LjUgMS4yeiIvPjxwYXRoIGZpbGw9IiMyNjg0ZmMiIGQ9Ik01OS44IDUzSDI3LjVMMTMuNzUgNzYuOGMxLjM1LjggMi45IDEuMiA0LjUgMS4yaDUwLjhjMS42IDAgMy4xNS0uNDUgNC41LTEuMnoiLz48cGF0aCBmaWxsPSIjZmZiYTAwIiBkPSJtNzMuNCAyNi41LTEyLjctMjJjLS44LTEuNC0xLjk1LTIuNS0zLjMtMy4zTDQzLjY1IDI1IDU5LjggNTNoMjcuNDVjMC0xLjU1LS40LTMuMS0xLjItNC41eiIvPjwvc3ZnPg==" },
  "obsidian": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMzMyIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgdmlld0JveD0iMCAwIDI1NiAzMzIiPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjcyLjgxOSUiIGN5PSI5Ni45MzQlIiByPSIxNjMuNzkzJSIgZng9IjcyLjgxOSUiIGZ5PSI5Ni45MzQlIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC0xMDQgMTExNDEuMzIyIDApIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii40Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImIiIGN4PSI1Mi45MTclIiBjeT0iOTAuNjMyJSIgcj0iMTkwLjM2MSUiIGZ4PSI1Mi45MTclIiBmeT0iOTAuNjMyJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtODIgMTA3NDYuNzUgMCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjEiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjMxLjE3NCUiIGN5PSI5Ny4xMzglIiByPSIxNzguNzE0JSIgZng9IjMxLjE3NCUiIGZ5PSI5Ny4xMzglIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC03NyAxMDcyNC42MDYgMCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjgiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjQiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZCIgY3g9IjcxLjgxMyUiIGN5PSI5OS45OTQlIiByPSI5Mi4wODYlIiBmeD0iNzEuODEzJSIgZnk9Ijk5Ljk5NCUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAyMjI1MTgzOS42NTgpIHNrZXdZKC05MCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3Atb3BhY2l0eT0iLjMiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZSIgY3g9IjExNy4wMTMlIiBjeT0iMzQuNzY5JSIgcj0iMzI4LjcyOSUiIGZ4PSIxMTcuMDEzJSIgZnk9IjM0Ljc2OSUiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoMTAyIC0xMDA0LjQ0MyAwKSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4yIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImYiIGN4PSItOS40MzElIiBjeT0iOC43MTIlIiByPSIxNTMuNDkyJSIgZng9Ii05LjQzMSUiIGZ5PSI4LjcxMiUiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoNDUgMTY3NC4zOTcgMCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjQiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZyIgY3g9IjEwMy45MDIlIiBjeT0iLTIyLjE3MiUiIHI9IjM5NC43NzElIiBmeD0iMTAzLjkwMiUiIGZ5PSItMjIuMTcyJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg4MCAzNzU3LjUyMiAwKSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuMyIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJoIiBjeD0iOTkuMzQ4JSIgY3k9Ijg5LjE5MyUiIHI9IjIwMy44MjQlIiBmeD0iOTkuMzQ4JSIgZnk9Ijg5LjE5MyUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMzg3ODMyNDYuNTQ4KSBza2V3WSgtOTApIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4yIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjMiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsLW9wYWNpdHk9Ii4zIiBkPSJNMjA5LjA1NiAzMDguMzA1Yy0yLjA0MyAxNC45My0xNi43MzggMjYuNjM4LTMxLjQzMiAyMi41NTItMjAuODIzLTUuNjU4LTQ0Ljk0Ni0xNC42MTYtNjYuNjM0LTE2LjI2NmwtMzMuMzE3LTIuNTE1YTIyLjAwMiAyMi4wMDIgMCAwIDEtMTQuMTQ0LTYuNTIyTDYuMTY3IDI0Ni43NzhhMjEuNzY2IDIxLjc2NiAwIDAgMS00LjI0NC0yNC4xMjRzMzUuMzYtNzcuNDc4IDM2Ljc3NS04MS40ODVjMS4yNTctNC4wMDggNi4xMy0zOS4yMTEgOC45NTgtNTguMDdhMjIuMDAyIDIyLjAwMiAwIDAgMSA3LjA3Mi0xMi45NjVMMTIyLjQ2MiA5LjQ3YTIyLjAwMiAyMi4wMDIgMCAwIDEgMzEuOTAzIDIuNjcybDU3LjA0OCA3MS45NzhhMjMuMTggMjMuMTggMCAwIDEgNC44NzIgMTQuMzhjMCAxMy41OTQgMS4xNzkgNDEuNjQ2IDguOCA1OS43MmEyMzYuNzU2IDIzNi43NTYgMCAwIDAgMjcuOTc0IDQ1LjczMiAxMS4wMDEgMTEuMDAxIDAgMCAxIC43ODYgMTIuMjU4Yy00Ljk1IDguNDA4LTE0Ljg1MSAyNC41OTUtMjguNzYgNDUuMjZhMTExLjczOCAxMTEuNzM4IDAgMCAwLTE2LjEwOCA0Ni44MzRoLjA3OVoiLz48cGF0aCBmaWxsPSIjNkMzMUUzIiBkPSJNMjA5LjYwNiAzMDUuNzljLTIuMDQzIDE1LjAwOS0xNi43MzcgMjYuNzE3LTMxLjQzMiAyMi43MS0yMC43NDQtNS43MzctNDQuNzktMTQuNjk1LTY2LjU1NS0xNi4zNDVMNzguMzggMzA5LjY0YTIxLjkyMyAyMS45MjMgMCAwIDEtMTQuMTQ0LTYuNkw2Ljg3NCAyNDQuMTA2YTIxLjkyMyAyMS45MjMgMCAwIDEtNC4yNDMtMjQuMzZzMzUuNDM4LTc3Ljc5MiAzNi43NzQtODEuODc4YzEuMzM2LTQuMDA3IDYuMTMtMzkuMjg5IDguOTU4LTU4LjMwNWEyMi4wMDIgMjIuMDAyIDAgMCAxIDcuMDcyLTEzLjA0NEwxMjMuMTcgNS42MjFhMjIuMDAyIDIyLjAwMiAwIDAgMSAzMS45MDIgMi43NWw1Ni45NyA3Mi4yOTJhMjMuMzM4IDIzLjMzOCAwIDAgMSA0Ljg3MSAxNC4zOGMwIDEzLjY3MyAxLjE4IDQxLjgwNCA4LjcyMyA1OS45NTVhMjM4LjA5MiAyMzguMDkyIDAgMCAwIDI3Ljk3NCA0NS45NjkgMTEuMDAxIDExLjAwMSAwIDAgMSAuODY0IDEyLjMzNmMtNS4wMyA4LjQ4Ny0xNC44NTEgMjQuNjc0LTI4LjgzOCA0NS40OTdhMTEyLjYwMyAxMTIuNjAzIDAgMCAwLTE2LjAzIDQ2Ljk5WiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik03MC4zNjUgMzA3LjQ0YzI2LjYzOC01My45ODMgMjUuOTMtOTIuNzIyIDE0LjUzNy0xMjAuMjI1LTEwLjM3Mi0yNS40NTktMjkuNzgxLTQxLjQ4OS00NS4wMjUtNTEuNDY4YTE5LjIzMyAxOS4yMzMgMCAwIDEtMS40MTUgNC4yNDNMMi42MzEgMjE5Ljc0N2EyMS45MjMgMjEuOTIzIDAgMCAwIDQuMzIxIDI0LjM2bDU3LjI4NCA1OC45MzNhMjMuNzYyIDIzLjc2MiAwIDAgMCA2LjEyOSA0LjRaIi8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTE0Mi44MTQgMTk3LjkwMmE4Ni4wMjUgODYuMDI1IDAgMCAxIDIxLjA2IDQuNzkzYzIxLjg0NCA4LjE3MiA0MS43MjQgMjYuNTYgNTguMTQ3IDYxLjk5OSAxLjE3OS0yLjA0MyAyLjM1Ny00LjAwOCAzLjYxNS01Ljg5NGE5NjAuMjI2IDk2MC4yMjYgMCAwIDAgMjguODM4LTQ1LjQ5NyAxMS4wMDEgMTEuMDAxIDAgMCAwLS43ODYtMTIuMzM2IDIzOC4wOTIgMjM4LjA5MiAwIDAgMS0yOC4wNTItNDUuOTY5Yy03LjU0NC0xOC4wNzMtOC42NDQtNDYuMjgyLTguNzIzLTU5Ljk1NSAwLTUuMTg2LTEuNjUtMTAuMjk0LTQuODcxLTE0LjM4bC01Ni45Ny03Mi4yOTItLjk0My0xLjE3OGM0LjE2NSAxMy43NSAzLjkzIDI0Ljc1MiAxLjMzNiAzNC43MzEtMi4zNTcgOS4yNzItNi43NTcgMTcuNjgtMTEuMzk0IDI2LjU2LTEuNTcxIDIuOTg2LTMuMTQzIDYuMDUtNC42MzYgOS4xOTNhMTEwLjAxIDExMC4wMSAwIDAgMC0xMi40MTUgNDUuNTc2Yy0uNzg2IDE5LjAxNiAzLjA2NCA0Mi44MjUgMTUuNzE2IDc0LjY1aC4wNzhaIi8+PHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTE0Mi43MzYgMTk3LjkwMmMtMTIuNjUyLTMxLjgyNC0xNi41MDItNTUuNjMzLTE1LjcxNi03NC42NS43ODYtMTguODU4IDYuMjg2LTMzLjAwMiAxMi40MTUtNDUuNTc1bDQuNzE1LTkuMTkzYzQuNTU4LTguODggOC44OC0xNy4yODggMTEuMzE1LTI2LjU2YTYxLjY4NCA2MS42ODQgMCAwIDAtMS4zMzYtMzQuNzMxYy04LjEzNi04Ljk0LTIxLjk2LTkuNjQyLTMwLjk2LTEuNTcyTDU1LjQzNiA2Ni41MTlhMjIuMDAyIDIyLjAwMiAwIDAgMC03LjA3MiAxMy4wNDRsLTguMjUgNTQuNjljMCAuNTUtLjE1OCAxLjAyMi0uMjM2IDEuNTcyIDE1LjI0NCA5LjkwMSAzNC41NzQgMjUuOTMxIDQ1LjAyNSA1MS4zMTIgMi4wNDMgNS4wMjkgMy43NzIgMTAuMjk0IDUuMDI5IDE2LjAzYTE1Ny4xNTcgMTU3LjE1NyAwIDAgMSA1Mi44MDUtNS4zNDN2LjA3OFoiLz48cGF0aCBmaWxsPSJ1cmwoI2QpIiBkPSJNMTc4LjI1MyAzMjguNWMxNC42MTYgNC4wMDcgMjkuMzEtNy43MDEgMzEuMzUzLTIyLjc4OWExMjAuMjI1IDEyMC4yMjUgMCAwIDEgMTIuNDk0LTQxLjAxN2MtMTYuNTAyLTM1LjQ0LTM2LjM4Mi01My44MjctNTguMTQ4LTYxLjk5OS0yMy4xOC04LjY0My00OC40MDQtNS43MzYtNzQuMDIxLjQ3MiA1LjczNiAyNi4wMSAyLjM1NyA2MC4wMzQtMTkuNDg3IDEwNC4yNzMgMi40MzYgMS4yNTcgNS4xODYgMS45NjUgNy45MzYgMi4ybDM0LjQ5NiAyLjU5M2MxOC43MDEgMS4zMzYgNDYuNTk3IDExLjAwMSA2NS4zNzcgMTYuMjY2WiIvPjxwYXRoIGZpbGw9InVybCgjZSkiIGQ9Ik0xMjcuMTc3IDEyMi4wNzRjLS44NjQgMTguODU5IDEuNDkzIDQwLjM5IDE0LjE0NCA3Mi4xMzVsLTMuOTI5LS4zOTNjLTExLjM5NC0zMy4wODEtMTMuOTA4LTUwLjA1NC0xMy4wNDQtNjkuMTQ5Ljc4Ni0xOS4wOTQgNi45OTQtMzMuNzg5IDEzLjEyMy00Ni4zNjEgMS41NzEtMy4xNDMgNS4xODYtOS4wMzcgNi43NTgtMTIuMDIzIDQuNTU3LTguODc5IDcuNjIyLTEzLjUxNSAxMC4yMTUtMjEuNjA5IDMuNzcyLTExLjMxNSAyLjk4Ni0xNi42NTggMi41MTQtMjIuMDAxIDIuOTA4IDE5LjI1MS04LjE3MiAzNS45ODgtMTYuNTAxIDUzLjA0YTExMy45MzkgMTEzLjkzOSAwIDAgMC0xMy4zNTggNDYuMzYxaC4wNzhaIi8+PHBhdGggZmlsbD0idXJsKCNmKSIgZD0iTTg4LjY3NCAxODguNTUxYzEuNTcxIDMuNDU4IDIuOTA3IDYuMjg3IDMuODUgMTAuNjA4bC0zLjM3OS43ODZjLTEuMzM2LTUuMDI5LTIuMzU3LTguNjQzLTQuMzIyLTEyLjk2NS0xMS40NzItMjYuOTUzLTI5Ljg2LTQwLjg2MS00NC43OS01MS4wNzYgMTguMDc0IDkuNzQ0IDM2LjY5NyAyNS4wNjYgNDguNjQgNTIuNjQ3WiIvPjxwYXRoIGZpbGw9InVybCgjZykiIGQ9Ik05Mi42ODEgMjAyLjYxN2M2LjI4NiAyOS40NjctLjc4NiA2Ni45NDgtMjEuNjA5IDEwMy40MDkgMTcuNDQ1LTM2LjE0NiAyNS45MzEtNzAuOCAxOC44NTktMTAyLjkzOGwyLjc1LS41NXYuMDc5WiIvPjxwYXRoIGZpbGw9InVybCgjaCkiIGQ9Ik0xNjQuNjU5IDE5OS44NjdjMzQuMTgxIDEyLjgwOCA0Ny4zODMgNDAuODYgNTcuMjA1IDY0LjM1NS0xMi4xOC0yNC41MTYtMjkuMDc0LTUxLjYyNi01OC40NjItNjEuNjg0LTIyLjMxNy03LjctNDEuMTc1LTYuNzU4LTczLjQ3MS41NWwtLjcwNy0zLjE0M2MzNC4yNi03Ljg1OCA1Mi4xNzYtOC44IDc1LjQzNSAwdi0uMDc4WiIvPjwvc3ZnPg==" },
  "figma": { light: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA1NCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfOTEyXzMpIj48cGF0aCBkPSJNMTMuMzMzMyA4MC4wMDAyQzIwLjY5MzMgODAuMDAwMiAyNi42NjY3IDc0LjAyNjggMjYuNjY2NyA2Ni42NjY4VjUzLjMzMzVIMTMuMzMzM0M1Ljk3MzMzIDUzLjMzMzUgMCA1OS4zMDY4IDAgNjYuNjY2OEMwIDc0LjAyNjggNS45NzMzMyA4MC4wMDAyIDEzLjMzMzMgODAuMDAwMloiIGZpbGw9IiMwQUNGODMiLz48cGF0aCBkPSJNMCAzOS45OTk4QzAgMzIuNjM5OCA1Ljk3MzMzIDI2LjY2NjUgMTMuMzMzMyAyNi42NjY1SDI2LjY2NjdWNTMuMzMzMkgxMy4zMzMzQzUuOTczMzMgNTMuMzMzMiAwIDQ3LjM1OTggMCAzOS45OTk4WiIgZmlsbD0iI0EyNTlGRiIvPjxwYXRoIGQ9Ik0wIDEzLjMzMzNDMCA1Ljk3MzMzIDUuOTczMzMgMCAxMy4zMzMzIDBIMjYuNjY2N1YyNi42NjY3SDEzLjMzMzNDNS45NzMzMyAyNi42NjY3IDAgMjAuNjkzMyAwIDEzLjMzMzNaIiBmaWxsPSIjRjI0RTFFIi8+PHBhdGggZD0iTTI2LjY2NjcgMEg0MC4wMDAxQzQ3LjM2MDEgMCA1My4zMzM0IDUuOTczMzMgNTMuMzMzNCAxMy4zMzMzQzUzLjMzMzQgMjAuNjkzMyA0Ny4zNjAxIDI2LjY2NjcgNDAuMDAwMSAyNi42NjY3SDI2LjY2NjdWMFoiIGZpbGw9IiNGRjcyNjIiLz48cGF0aCBkPSJNNTMuMzMzNCAzOS45OTk4QzUzLjMzMzQgNDcuMzU5OCA0Ny4zNjAxIDUzLjMzMzIgNDAuMDAwMSA1My4zMzMyQzMyLjY0MDEgNTMuMzMzMiAyNi42NjY3IDQ3LjM1OTggMjYuNjY2NyAzOS45OTk4QzI2LjY2NjcgMzIuNjM5OCAzMi42NDAxIDI2LjY2NjUgNDAuMDAwMSAyNi42NjY1QzQ3LjM2MDEgMjYuNjY2NSA1My4zMzM0IDMyLjYzOTggNTMuMzMzNCAzOS45OTk4WiIgZmlsbD0iIzFBQkNGRSIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImNsaXAwXzkxMl8zIj48cmVjdCB3aWR0aD0iNTMuMzMzMyIgaGVpZ2h0PSI4MCIgZmlsbD0id2hpdGUiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=" },
  "github": { light: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9Im5vbmUiPjxwYXRoIGZpbGw9IiMxYjFmMjMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUxMiAwQzIyOS4xMiAwIDAgMjI5LjEyIDAgNTEyYzAgMjI2LjU2IDE0Ni41NiA0MTcuOTIgMzUwLjA4IDQ4NS43NiAyNS42IDQuNDggMzUuMi0xMC44OCAzNS4yLTI0LjMyIDAtMTIuMTYtLjY0LTUyLjQ4LS42NC05NS4zNi0xMjguNjQgMjMuNjgtMTYxLjkyLTMxLjM2LTE3Mi4xNi02MC4xNi01Ljc2LTE0LjcyLTMwLjcyLTYwLjE2LTUyLjQ4LTcyLjMyLTE3LjkyLTkuNi00My41Mi0zMy4yOC0uNjQtMzMuOTIgNDAuMzItLjY0IDY5LjEyIDM3LjEyIDc4LjcyIDUyLjQ4IDQ2LjA4IDc3LjQ0IDExOS42OCA1NS42OCAxNDkuMTIgNDIuMjQgNC40OC0zMy4yOCAxNy45Mi01NS42OCAzMi42NC02OC40OC0xMTMuOTItMTIuOC0yMzIuOTYtNTYuOTYtMjMyLjk2LTI1Mi44IDAtNTUuNjggMTkuODQtMTAxLjc2IDUyLjQ4LTEzNy42LTUuMTItMTIuOC0yMy4wNC02NS4yOCA1LjEyLTEzNS42OCAwIDAgNDIuODgtMTMuNDQgMTQwLjggNTIuNDggNDAuOTYtMTEuNTIgODQuNDgtMTcuMjggMTI4LTE3LjI4czg3LjA0IDUuNzYgMTI4IDE3LjI4Yzk3LjkyLTY2LjU2IDE0MC44LTUyLjQ4IDE0MC44LTUyLjQ4IDI4LjE2IDcwLjQgMTAuMjQgMTIyLjg4IDUuMTIgMTM1LjY4IDMyLjY0IDM1Ljg0IDUyLjQ4IDgxLjI4IDUyLjQ4IDEzNy42IDAgMTk2LjQ4LTExOS42OCAyNDAtMjMzLjYgMjUyLjggMTguNTYgMTYgMzQuNTYgNDYuNzIgMzQuNTYgOTQuNzIgMCA2OC40OC0uNjQgMTIzLjUyLS42NCAxNDAuOCAwIDEzLjQ0IDkuNiAyOS40NCAzNS4yIDI0LjMyQzg3Ny40NCA5MjkuOTIgMTAyNCA3MzcuOTIgMTAyNCA1MTIgMTAyNCAyMjkuMTIgNzk0Ljg4IDAgNTEyIDAiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==", dark: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOCAwQzMuNTggMCAwIDMuNTggMCA4QzAgMTEuNTQgMi4yOSAxNC41MyA1LjQ3IDE1LjU5QzUuODcgMTUuNjYgNi4wMiAxNS40MiA2LjAyIDE1LjIxQzYuMDIgMTUuMDIgNi4wMSAxNC4zOSA2LjAxIDEzLjcyQzQgMTQuMDkgMy40OCAxMy4yMyAzLjMyIDEyLjc4QzMuMjMgMTIuNTUgMi44NCAxMS44NCAyLjUgMTEuNjVDMi4yMiAxMS41IDEuODIgMTEuMTMgMi40OSAxMS4xMkMzLjEyIDExLjExIDMuNTcgMTEuNyAzLjcyIDExLjk0QzQuNDQgMTMuMTUgNS41OSAxMi44MSA2LjA1IDEyLjZDNi4xMiAxMi4wOCA2LjMzIDExLjczIDYuNTYgMTEuNTNDNC43OCAxMS4zMyAyLjkyIDEwLjY0IDIuOTIgNy41OEMyLjkyIDYuNzEgMy4yMyA1Ljk5IDMuNzQgNS40M0MzLjY2IDUuMjMgMy4zOCA0LjQxIDMuODIgMy4zMUMzLjgyIDMuMzEgNC40OSAzLjEgNi4wMiA0LjEzQzYuNjYgMy45NSA3LjM0IDMuODYgOC4wMiAzLjg2QzguNyAzLjg2IDkuMzggMy45NSAxMC4wMiA0LjEzQzExLjU1IDMuMDkgMTIuMjIgMy4zMSAxMi4yMiAzLjMxQzEyLjY2IDQuNDEgMTIuMzggNS4yMyAxMi4zIDUuNDNDMTIuODEgNS45OSAxMy4xMiA2LjcgMTMuMTIgNy41OEMxMy4xMiAxMC42NSAxMS4yNSAxMS4zMyA5LjQ3IDExLjUzQzkuNzYgMTEuNzggMTAuMDEgMTIuMjYgMTAuMDEgMTMuMDFDMTAuMDEgMTQuMDggMTAgMTQuOTQgMTAgMTUuMjFDMTAgMTUuNDIgMTAuMTUgMTUuNjcgMTAuNTUgMTUuNTlDMTMuNzEgMTQuNTMgMTYgMTEuNTMgMTYgOEMxNiAzLjU4IDEyLjQyIDAgOCAwWiIgdHJhbnNmb3JtPSJzY2FsZSg2NCkiIGZpbGw9IiNmZmZmIi8+PC9zdmc+" },
  "linear": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0iIzVFNkFEMiIgZD0iTTEuMjI1IDYxLjUyM2MtLjIyMi0uOTQ5LjkwOC0xLjU0NiAxLjU5Ny0uODU3bDM2LjUxMiAzNi41MTJjLjY5LjY5LjA5MiAxLjgyLS44NTcgMS41OTctMTguNDI1LTQuMzIzLTMyLjkzLTE4LjgyNy0zNy4yNTItMzcuMjUyWk0uMDAyIDQ2Ljg4OWEuOTkuOTkgMCAwIDAgLjI5Ljc2TDUyLjM1IDk5LjcxYy4yMDEuMi40NzguMzA3Ljc2LjI5IDIuMzctLjE0OSA0LjY5NS0uNDYgNi45NjMtLjkyNy43NjUtLjE1NyAxLjAzLTEuMDk2LjQ3OC0xLjY0OEwyLjU3NiAzOS40NDhjLS41NTItLjU1MS0xLjQ5MS0uMjg2LTEuNjQ4LjQ3OWE1MC4wNjcgNTAuMDY3IDAgMCAwLS45MjYgNi45NjJaTTQuMjEgMjkuNzA1YS45ODguOTg4IDAgMCAwIC4yMDggMS4xbDY0Ljc3NiA2NC43NzZjLjI4OS4yOS43MjYuMzc1IDEuMS4yMDhhNDkuOTA4IDQ5LjkwOCAwIDAgMCA1LjE4NS0yLjY4NC45ODEuOTgxIDAgMCAwIC4xODMtMS41NEw4LjQzNiAyNC4zMzZhLjk4MS45ODEgMCAwIDAtMS41NDEuMTgzIDQ5Ljg5NiA0OS44OTYgMCAwIDAtMi42ODQgNS4xODVabTguNDQ4LTExLjYzMWEuOTg2Ljk4NiAwIDAgMS0uMDQ1LTEuMzU0QzIxLjc4IDYuNDYgMzUuMTExIDAgNDkuOTUyIDAgNzcuNTkyIDAgMTAwIDIyLjQwNyAxMDAgNTAuMDQ4YzAgMTQuODQtNi40NiAyOC4xNzItMTYuNzIgMzcuMzM4YS45ODYuOTg2IDAgMCAxLTEuMzU0LS4wNDVMMTIuNjU5IDE4LjA3NFoiLz48L3N2Zz4=" },
  "microsoft-word": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0i0KHQu9C+0LkgMSIgdmlld0JveD0iMCAwIDQ4NiA1MDAiPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9Ii02ODkuMzQiIGN5PSI3NTMuOTMiIHI9IjEzLjg5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIiIGZ4PSItNjg5LjM0IiBmeT0iNzUzLjkzIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDQ3LjU2IDAgMCAtMjAuMTUgMzMyNjAuNjMgMTU2OTEuMTgpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMTgiIHN0b3AtY29sb3I9IiMxNjU3ZjQiLz48c3RvcCBvZmZzZXQ9Ii41NyIgc3RvcC1jb2xvcj0iIzAwMzZjNCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJjIiBjeD0iLTczMC45NyIgY3k9IjgwNi40IiByPSIxMy44OSIgZGF0YS1uYW1lPSLQkdC10LfRi9C80Y/QvdC90YvQuSDQs9GA0LDQtNC40LXQvdGCIDMiIGZ4PSItNzMwLjk3IiBmeT0iODA2LjQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTIwLjIyNDk1IDIxLjI4Mjg4IDUyLjQwNjQ3IDQ5LjgyMjY3IC01NjU1OS4xMiAtMjQ0OTguMzYpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMTQiIHN0b3AtY29sb3I9IiNkNDcxZmYiLz48c3RvcCBvZmZzZXQ9Ii44MyIgc3RvcC1jb2xvcj0iIzUwOWRmNSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImQiIGN4PSItNjgyLjIxIiBjeT0iODAxLjg2IiByPSIxMy44OSIgZGF0YS1uYW1lPSLQkdC10LfRi9C80Y/QvdC90YvQuSDQs9GA0LDQtNC40LXQvdGCIDQiIGZ4PSItNjgyLjIxIiBmeT0iODAxLjg2IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMTguNjIgMTAxLjYyIDAgLTgxMDYzLjA4IDEzMDIyLjMyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjI4IiBzdG9wLWNvbG9yPSIjNGYwMDZmIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0ZjAwNmYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZiIgY3g9Ii03NDkuNTgiIGN5PSI3OTguNzQiIHI9IjEzLjg5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgNiIgZng9Ii03NDkuNTgiIGZ5PSI3OTguNzQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTI4LjcxNjcgNi43MDkwMSAxNi4wNjU2NyA2OC43ODg4NCAtMzM4NjcuNjkgLTQ5OTExLjM3KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjA2IiBzdG9wLWNvbG9yPSIjZTRhN2ZlIi8+PHN0b3Agb2Zmc2V0PSIuNTQiIHN0b3AtY29sb3I9IiNlNGE3ZmUiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJnIiBjeD0iLTY3NS42NCIgY3k9Ijc5Ny40OCIgcj0iMTMuODkiIGRhdGEtbmFtZT0i0JHQtdC30YvQvNGP0L3QvdGL0Lkg0LPRgNCw0LTQuNC10L3RgiA3IiBmeD0iLTY3NS42NCIgZnk9Ijc5Ny40OCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxNS45OTE5NiAxNS45OTc1NSAxNS45OTQ3NiAtMTUuOTk0NzYgLTE5NDkgMjM4MDUuOTgpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMDgiIHN0b3AtY29sb3I9IiMzNjdhZjIiLz48c3RvcCBvZmZzZXQ9Ii44NyIgc3RvcC1jb2xvcj0iIzAwMWE4ZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJoIiBjeD0iLTY1Ny42MiIgY3k9Ijg1NC42NSIgcj0iMTMuODkiIGRhdGEtbmFtZT0i0JHQtdC30YvQvNGP0L3QvdGL0Lkg0LPRgNCw0LTQuNC10L3RgiA4IiBmeD0iLTY1Ny42MiIgZnk9Ijg1NC42NSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIDExLjIgMTIuNzYgMCAtMTA3OTYuMDkgNzczNC44KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjU5IiBzdG9wLWNvbG9yPSIjMjc2M2U1IiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii45NyIgc3RvcC1jb2xvcj0iIzU4YWFmZSIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iNjkuNDMiIHgyPSIzODguNDUiIHkxPSIyMzguMTEiIHkyPSIyMzguMTEiIGRhdGEtbmFtZT0i0JHQtdC30YvQvNGP0L3QvdGL0Lkg0LPRgNCw0LTQuNC10L3RgiAyIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTAyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzY2YzBmZiIvPjxzdG9wIG9mZnNldD0iLjI2IiBzdG9wLWNvbG9yPSIjMDA5NGYwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImUiIHgxPSI2OS40OCIgeDI9IjQ4NS45NCIgeTE9IjM4MC4wNCIgeTI9IjM3My4xNiIgZGF0YS1uYW1lPSLQkdC10LfRi9C80Y/QvdC90YvQuSDQs9GA0LDQtNC40LXQvdGCIDUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA1MDIpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjOWRlYWZmIi8+PHN0b3Agb2Zmc2V0PSIuMiIgc3RvcC1jb2xvcj0iIzNiZDVmZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Im02OS40MyAzNzYuMjUgMTk0LjQtMjM3LjM2TDQ4NiAyOTMuMTN2MTU4LjI2YzAgMjYuODUtMjEuNzYgNDguNjEtNDguNiA0OC42MUgxNTIuNzRjLTQ2LjAxIDAtODMuMzEtMzcuMzEtODMuMzEtODMuMzN2LTQwLjQyWiIgc3R5bGU9ImZpbGw6dXJsKCNhKSIvPjxwYXRoIGQ9Ik02OS40MyAyMDguODdjMC0zNC41MiAyNy45OC02Mi41IDYyLjQ5LTYyLjVoMjgzLjExTDQ4NiAxMTEuMTF2MTczLjYxYzAgMjYuODUtMjEuNzYgNDguNjEtNDguNiA0OC42MUgxNTIuNzRjLTQ2LjAxIDAtODMuMzEgMzcuMzEtODMuMzEgODMuMzN2LTIwNy44WiIgc3R5bGU9ImZpbGw6dXJsKCNiKSIvPjxwYXRoIGQ9Ik02OS40MyAyMDguODdjMC0zNC41MiAyNy45OC02Mi41IDYyLjQ5LTYyLjVoMjgzLjExTDQ4NiAxMTEuMTF2MTczLjYxYzAgMjYuODUtMjEuNzYgNDguNjEtNDguNiA0OC42MUgxNTIuNzRjLTQ2LjAxIDAtODMuMzEgMzcuMzEtODMuMzEgODMuMzN2LTIwNy44WiIgc3R5bGU9ImZpbGw6dXJsKCNjKTtmaWxsLW9wYWNpdHk6LjYiLz48cGF0aCBkPSJNNjkuNDMgMjA4Ljg3YzAtMzQuNTIgMjcuOTgtNjIuNSA2Mi40OS02Mi41aDI4My4xMUw0ODYgMTExLjExdjE3My42MWMwIDI2Ljg1LTIxLjc2IDQ4LjYxLTQ4LjYgNDguNjFIMTUyLjc0Yy00Ni4wMSAwLTgzLjMxIDM3LjMxLTgzLjMxIDgzLjMzdi0yMDcuOFoiIHN0eWxlPSJmaWxsOnVybCgjZCk7ZmlsbC1vcGFjaXR5Oi4xIi8+PHBhdGggZD0iTTY5LjQzIDgzLjMzQzY5LjQzIDM3LjMxIDEwNi43MyAwIDE1Mi43NCAwSDQzNy40QzQ2NC4yNCAwIDQ4NiAyMS43NiA0ODYgNDguNjF2NjkuNDRjMCAyNi44NS0yMS43NiA0OC42MS00OC42IDQ4LjYxSDE1Mi43NGMtNDYuMDEgMC04My4zMSAzNy4zMS04My4zMSA4My4zM1Y4My4zM1oiIHN0eWxlPSJmaWxsOnVybCgjZSkiLz48cGF0aCBkPSJNNjkuNDMgODMuMzNDNjkuNDMgMzcuMzEgMTA2LjczIDAgMTUyLjc0IDBINDM3LjRDNDY0LjI0IDAgNDg2IDIxLjc2IDQ4NiA0OC42MXY2OS40NGMwIDI2Ljg1LTIxLjc2IDQ4LjYxLTQ4LjYgNDguNjFIMTUyLjc0Yy00Ni4wMSAwLTgzLjMxIDM3LjMxLTgzLjMxIDgzLjMzVjgzLjMzWiIgc3R5bGU9ImZpbGw6dXJsKCNmKTtmaWxsLW9wYWNpdHk6LjgiLz48cmVjdCB3aWR0aD0iMjIyLjE3IiBoZWlnaHQ9IjIyMi4yMiIgeT0iMjM2LjExIiByeD0iNDUuMTMiIHJ5PSI0NS4xMyIgc3R5bGU9ImZpbGw6dXJsKCNnKSIvPjxyZWN0IHdpZHRoPSIyMjIuMTciIGhlaWdodD0iMjIyLjIyIiB5PSIyMzYuMTEiIHJ4PSI0NS4xMyIgcnk9IjQ1LjEzIiBzdHlsZT0iZmlsbDp1cmwoI2gpO2ZpbGwtb3BhY2l0eTouNjUiLz48cGF0aCBkPSJNMTg3LjI2IDI4My43MyAxNTkuOTIgNDEwLjdsLTMyLjY5LjAyLTE2LjE0LTc2LjE5LTE2LjkgNzYuMTloLTMzTDM0LjkxIDI4My43NWgyNi45NWwxNi4yMSA4My43OSAxNi4xMS04My43OWgzMy4wNGwxNi44NyA4My43OSAxNS44Mi04My43OSAyNy4zNC0uMDJaIiBzdHlsZT0iZmlsbDojZmZmIi8+PC9zdmc+" },
  "microsoft-excel": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0i0KHQu9C+0LkgMSIgdmlld0JveD0iMCAwIDQ4NiA1MDAiPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9Ii03NDYuNjYiIGN5PSI3ODEuNDQiIHI9IjEzLjg5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIiIGZ4PSItNzQ2LjY2IiBmeT0iNzgxLjQ0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0yOC4zMjU5NiAtMjkuODA3NjMgLTIzLjExOTE2IDIxLjk3OTg2IC0yNTk2LjM5IC0zODkwMC4zMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4wNiIgc3RvcC1jb2xvcj0iIzM3OTUzOSIvPjxzdG9wIG9mZnNldD0iLjQyIiBzdG9wLWNvbG9yPSIjMjk3YzJkIi8+PHN0b3Agb2Zmc2V0PSIuNyIgc3RvcC1jb2xvcj0iIzE1NTYxYyIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJiIiBjeD0iLTc3My4xOSIgY3k9Ijc3MS4yNSIgcj0iMTMuODkiIGRhdGEtbmFtZT0i0JHQtdC30YvQvNGP0L3QvdGL0Lkg0LPRgNCw0LTQuNC10L3RgiAyIiBmeD0iLTc3My4xOSIgZnk9Ijc3MS4yNSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgtMTEuOTc2MTIgLTExLjU4MTM3IC04Ljk1ODUzIDkuMjY4MDYgLTIxNTUuMTIgLTE1ODU4Ljg4KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzA3M2IxMCIvPjxzdG9wIG9mZnNldD0iLjk5IiBzdG9wLWNvbG9yPSIjMDg0YTEzIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZiIgY3g9Ii04MjQuMTEiIGN5PSI4MTAuOTkiIHI9IjEzLjg5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgNiIgZng9Ii04MjQuMTEiIGZ5PSI4MTAuOTkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTkuMDIgMCAwIDE5LjA5IC03MTIwLjQgLTE1Mzc4LjY5KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjI5IiBzdG9wLWNvbG9yPSIjNGViNDNiIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzJjYzYxIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaCIgY3g9Ii03NjkuMTQiIGN5PSI4MDguOSIgcj0iMTMuODkiIGRhdGEtbmFtZT0i0JHQtdC30YvQvNGP0L3QvdGL0Lkg0LPRgNCw0LTQuNC10L3RgiA4IiBmeD0iLTc2OS4xNCIgZnk9IjgwOC45IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0xNi45MDc3IC0xMy42ODE4MiAxMy42NDExMiAtMTYuODYzNDUgLTIzNTIzLjM3IDMzMDkuNzEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuNDQiIHN0b3AtY29sb3I9IiM3OWU5NmQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkMGViNzYiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaSIgY3g9Ii02NzUuNjQiIGN5PSI3OTMuMjgiIHI9IjEzLjg5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgOSIgZng9Ii02NzUuNjQiIGZ5PSI3OTMuMjgiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTUuOTkxOTYgMTUuOTk3NTUgNDUuNTQxNTMgLTQ1LjU0Nzk3IC0yNTMxNS44NSA0NzE3OC4xOCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyMGE4NWUiLz48c3RvcCBvZmZzZXQ9Ii45NCIgc3RvcC1jb2xvcj0iIzA5NDQyYSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJqIiBjeD0iLTY1Ny42MiIgY3k9Ijg1My45OSIgcj0iMTMuODkiIGRhdGEtbmFtZT0i0JHQtdC30YvQvNGP0L3QvdGL0Lkg0LPRgNCw0LTQuNC10L3RgiAxMCIgZng9Ii02NTcuNjIiIGZ5PSI4NTMuOTkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAxMS4yIDEyLjkgMCAtMTA5MDIuODUgNzczNC44KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjU4IiBzdG9wLWNvbG9yPSIjMzNhNjYyIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9Ii45NyIgc3RvcC1jb2xvcj0iIzk4ZjBiMCIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iNjkuNDMiIHgyPSIyNjAuODQiIHkxPSIyMTAuMzMiIHkyPSIyMTAuMzMiIGRhdGEtbmFtZT0i0JHQtdC30YvQvNGP0L3QvdGL0Lkg0LPRgNCw0LTQuNC10L3RgiAzIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgNTAyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzUyZDE3YyIvPjxzdG9wIG9mZnNldD0iLjMzIiBzdG9wLWNvbG9yPSIjNGFhNjQ3Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImQiIHgxPSIxOTQuNCIgeDI9IjE5NC40IiB5MT0iMzM1LjMzIiB5Mj0iMTYxLjY4IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgNCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMyOTg1MmYiLz48c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjNGFhNjQ3IiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZSIgeDE9IjgwLjQ5IiB4Mj0iMzExLjQ1IiB5MT0iMjk3LjIyIiB5Mj0iNDk3LjU0IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgNSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2NmQwNTIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NWU5NzIiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjE4Mi4xMSIgeDI9IjY5LjQzIiB5MT0iMzc3IiB5Mj0iMzc3IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgNyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDUwMikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4xOCIgc3RvcC1jb2xvcj0iI2MwZTA3NSIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZDFlYjk1Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTY5LjQzIDE1OS43MmMwLTM0LjUyIDI3Ljk4LTYyLjUgNjIuNDktNjIuNWgzNTQuMDl2MzYxLjExYzAgMjMuMDEtMTguNjUgNDEuNjctNDEuNjYgNDEuNjdIMTUyLjc0Yy00Ni4wMSAwLTgzLjMxLTM3LjMxLTgzLjMxLTgzLjMzVjE1OS43MloiIHN0eWxlPSJmaWxsOnVybCgjYSkiLz48cGF0aCBkPSJNNjkuNDMgMTU5LjcyYzAtMzQuNTIgMjcuOTgtNjIuNSA2Mi40OS02Mi41aDM1NC4wOXYzNjEuMTFjMCAyMy4wMS0xOC42NSA0MS42Ny00MS42NiA0MS42N0gxNTIuNzRjLTQ2LjAxIDAtODMuMzEtMzcuMzEtODMuMzEtODMuMzNWMTU5LjcyWiIgc3R5bGU9ImZpbGw6dXJsKCNiKTtmaWxsLW9wYWNpdHk6LjciLz48cGF0aCBkPSJNNjkuNDMgMjI5LjE3YzAtMzQuNTIgMjcuOTgtNjIuNSA2Mi40OS02Mi41aDE4Ny40NmMtMjMuMDEgMC00MS42NiAxOC42Ni00MS42NiA0MS42N3Y4My4zM2MwIDIzLjAxLTE4LjY1IDQxLjY3LTQxLjY2IDQxLjY3aC04My4zMWMtNDYuMDEgMC04My4zMSAzNy4zMS04My4zMSA4My4zM3YtMTg3LjVaIiBzdHlsZT0iZmlsbDp1cmwoI2MpIi8+PHBhdGggZD0iTTY5LjQzIDIyOS4xN2MwLTM0LjUyIDI3Ljk4LTYyLjUgNjIuNDktNjIuNWgxODcuNDZjLTIzLjAxIDAtNDEuNjYgMTguNjYtNDEuNjYgNDEuNjd2ODMuMzNjMCAyMy4wMS0xOC42NSA0MS42Ny00MS42NiA0MS42N2gtODMuMzFjLTQ2LjAxIDAtODMuMzEgMzcuMzEtODMuMzEgODMuMzN2LTE4Ny41WiIgc3R5bGU9ImZpbGw6dXJsKCNkKTtmaWxsLW9wYWNpdHk6LjMiLz48cGF0aCBkPSJNNjkuNDMgODMuMzNDNjkuNDMgMzcuMzEgMTA2LjczIDAgMTUyLjc0IDBoMTY2LjYzdjE2Ni42N0gxNTIuNzRjLTQ2LjAxIDAtODMuMzEgMzcuMzEtODMuMzEgODMuMzNWODMuMzNaIiBzdHlsZT0iZmlsbDp1cmwoI2UpIi8+PHBhdGggZD0iTTY5LjQzIDgzLjMzQzY5LjQzIDM3LjMxIDEwNi43MyAwIDE1Mi43NCAwaDE2Ni42M3YxNjYuNjdIMTUyLjc0Yy00Ni4wMSAwLTgzLjMxIDM3LjMxLTgzLjMxIDgzLjMzVjgzLjMzWiIgc3R5bGU9ImZpbGw6dXJsKCNmKSIvPjxwYXRoIGQ9Ik02OS40MyA4My4zM0M2OS40MyAzNy4zMSAxMDYuNzMgMCAxNTIuNzQgMGgxNjYuNjN2MTY2LjY3SDE1Mi43NGMtNDYuMDEgMC04My4zMSAzNy4zMS04My4zMSA4My4zM1Y4My4zM1oiIHN0eWxlPSJmaWxsOnVybCgjZykiLz48cmVjdCB3aWR0aD0iMjA4LjI5IiBoZWlnaHQ9IjE2Ni42NyIgeD0iMjc3LjcxIiByeD0iNDEuNjYiIHJ5PSI0MS42NiIgc3R5bGU9ImZpbGw6dXJsKCNoKSIvPjxyZWN0IHdpZHRoPSIyMjIuMTciIGhlaWdodD0iMjIyLjIyIiB5PSIyMzYuMTEiIHJ4PSI0NS4xMyIgcnk9IjQ1LjEzIiBzdHlsZT0iZmlsbDp1cmwoI2kpIi8+PHJlY3Qgd2lkdGg9IjIyMi4xNyIgaGVpZ2h0PSIyMjIuMjIiIHk9IjIzNi4xMSIgcng9IjQ1LjEzIiByeT0iNDUuMTMiIHN0eWxlPSJmaWxsLW9wYWNpdHk6LjM7ZmlsbDp1cmwoI2opIi8+PHBhdGggZD0iTTE2OS40OCA0MTAuNzFoLTM0LjI1bC0yMS41LTQwLjQ3Yy0uNzctMS40Mi0xLjM2LTIuNTQtMS43Ny0zLjM3LS4zNS0uODgtLjc0LTEuODktMS4xNS0zLjAxaC0uMzVjLS41MyAxLjQyLTEuMDMgMi41Ny0xLjUgMy40NS0uNDcuODktMS4wMyAxLjk4LTEuNjggMy4yOGwtMjIuMyA0MC4xMWgtMzIuM2wzOC43Ni02My41OC0zNi4xLTYzLjRoMzMuOGwxOS4xMSAzNi4xM2MuNzcgMS40OCAxLjQyIDIuNzggMS45NSAzLjkuNTkgMS4wNiAxLjE4IDIuMzMgMS43NyAzLjgxaC4zNWwxLjk1LTQuMDdjLjUzLTEgMS4yNC0yLjMzIDIuMTItMy45OGwxOS44Mi0zNS43N2gzMi4yMWwtMzYuNjMgNjIuNDMgMzcuNyA2NC41NVoiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4=" },
  "microsoft-powerpoint": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjYwIDc4Ljc1IDU4MS4yNSA1NjIuNSI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJiIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGZ4PSIwIiBmeT0iMCIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxMzUgMTg1LjQ1OSAyMTguNTU3KSBzY2FsZSg1NjQuNjc5NTMgOTUwLjQzMTQ4KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjE1MiIgc3R5bGU9InN0b3AtY29sb3I6I2FhMWQyZDtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjM4MSIgc3R5bGU9InN0b3AtY29sb3I6I2QxMmIxODtzdG9wLW9wYWNpdHk6LjQzOTIxNiIvPjxzdG9wIG9mZnNldD0iLjYwMiIgc3R5bGU9InN0b3AtY29sb3I6I2ZmM2MwMDtzdG9wLW9wYWNpdHk6MCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJjIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGZ4PSIwIiBmeT0iMCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCg0ODQuMDEyMDcgLTIyOC42MTc4NCA0MTQuMTc0NDcgODc2Ljg1ODI1IC0xOS40MSA1ODguNjE4KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjQwNyIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNjZmYjtzdG9wLW9wYWNpdHk6LjUwMTk2MSIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I2VhM2QwMTtzdG9wLW9wYWNpdHk6MCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJlIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGZ4PSIwIiBmeT0iMCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgzNTUuODU3NiA3NC41Njg3OCAtNzEuMDg5NyAzMzkuMjU0NzEgMzEyLjc1NiAzOTMuNjMxKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjc4NiIgc3R5bGU9InN0b3AtY29sb3I6I2ZmYTA1YztzdG9wLW9wYWNpdHk6MCIvPjxzdG9wIG9mZnNldD0iLjkwNSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmY2U4NDtzdG9wLW9wYWNpdHk6MSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJmIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGZ4PSIwIiBmeT0iMCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgzMDcuMjExNDQgLTIwMS4wMTU5MyAxOTIuMjMzODMgMjkzLjc4OTgxIDM2OS43OTUgMzU1Ljc4KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjI5NSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmOTllOTtzdG9wLW9wYWNpdHk6LjgiLz48c3RvcCBvZmZzZXQ9Ii43MjgiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjk5ZTk7c3RvcC1vcGFjaXR5OjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZyIgY3g9IjAiIGN5PSIwIiByPSIxIiBmeD0iMCIgZnk9IjAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMjU3LjE0MzE2IC0yOTQuMzk1MTEgMjY4Ljg2NDQ2IDIzNC44NDMwOCAzMjguNTY3IDM5OC43MTgpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojZmQ2ZWY5O3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIuNjM3IiBzdHlsZT0ic3RvcC1jb2xvcjojZjk0O3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIuODUyIiBzdHlsZT0ic3RvcC1jb2xvcjojZmNjNDc5O3N0b3Atb3BhY2l0eToxIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImgiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZng9IjAiIGZ5PSIwIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0yOS4wNDU4NCAxOTYuODE5MyAtNDQ0LjgxNDg0IC02NS42NDQwNiAzMDIuOTg1IDExNS45MikiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4xNDQiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjhkMTM7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9Ii41MzciIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjdmMjk7c3RvcC1vcGFjaXR5OjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaSIgY3g9IjAiIGN5PSIwIiByPSIxIiBmeD0iMCIgZnk9IjAiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoNDUgLTM4Ni40NjYgMjQ0Ljg5MSkgc2NhbGUoMzM5LjQxMDk5KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I2Y4MTkzZTtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjkzOSIgc3R5bGU9InN0b3AtY29sb3I6IzkyMDYxNjtzdG9wLW9wYWNpdHk6MSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJqIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGZ4PSIwIiBmeT0iMCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIDE2OCAtMTkxLjI1IDAgMTc5Ljk3IDQ4OSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii41NzYiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmIwNTU7c3RvcC1vcGFjaXR5OjAiLz48c3RvcCBvZmZzZXQ9Ii45NzQiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmYyYmU7c3RvcC1vcGFjaXR5Oi4zMDE5NjEiLz48L3JhZGlhbEdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjIyLjA5NiIgeDI9Ii0uODc2IiB5MT0iNC4wNTYiIHkyPSIyNi4wMzMiIGdyYWRpZW50VHJhbnNmb3JtPSJzY2FsZSgxNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4wNTgiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjdmNDg7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNlNTQ5NWI7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZCIgeDE9IjI3LjU0OSIgeDI9IjQ3LjcyOSIgeTE9IjI4LjE3MiIgeTI9IjEzLjIxNiIgZ3JhZGllbnRUcmFuc2Zvcm09InNjYWxlKDE1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjMxMSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNmUzMDtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjYzNSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmYTA1YztzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Ik02NDEuMiAzNjBjMC0xNTUuMzMyLTEyNS45MDctMjgxLjI1LTI4MS4yMjMtMjgxLjI1QzIwNC42NiA3OC43NSA3OC43NSAyMDQuNjY4IDc4Ljc1IDM2MHMxMjUuOTEgMjgxLjI1IDI4MS4yMjcgMjgxLjI1YzE1NS4zMTYgMCAyODEuMjIyLTEyNS45MTggMjgxLjIyMi0yODEuMjVabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNhKSIvPjxwYXRoIGQ9Ik02NDEuMiAzNjBjMC0xNTUuMzMyLTEyNS45MDctMjgxLjI1LTI4MS4yMjMtMjgxLjI1QzIwNC42NiA3OC43NSA3OC43NSAyMDQuNjY4IDc4Ljc1IDM2MHMxMjUuOTEgMjgxLjI1IDI4MS4yMjcgMjgxLjI1YzE1NS4zMTYgMCAyODEuMjIyLTEyNS45MTggMjgxLjIyMi0yODEuMjVabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNiKSIvPjxwYXRoIGQ9Ik02NDEuMiAzNjBjMC0xNTUuMzMyLTEyNS45MDctMjgxLjI1LTI4MS4yMjMtMjgxLjI1QzIwNC42NiA3OC43NSA3OC43NSAyMDQuNjY4IDc4Ljc1IDM2MHMxMjUuOTEgMjgxLjI1IDI4MS4yMjcgMjgxLjI1YzE1NS4zMTYgMCAyODEuMjIyLTEyNS45MTggMjgxLjIyMi0yODEuMjVabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNjKSIvPjxwYXRoIGQ9Ik0zNjAuMDE2IDc4Ljc1YzE1NS4zMTIuMDA0IDI4MS4yMTggMTI1LjkyMiAyODEuMjE4IDI4MS4yNSAwIDUxLjY3Mi0xMy45NiAxMDAuMDctMzguMjczIDE0MS42OGw0LjU3LTEwLjEyMWMyNy44MzItNjEuNzk3LTE3LjQwNi0xMzEuNzI3LTg1LjE4My0xMzEuNjc2bC0xMTEuOTMuMDg2Yy0yNy44MjQuMDIzLTUwLjQwMi0yMi41MzUtNTAuNDAyLTUwLjM2VjE5Ny40NzdjLS4wMDQtNjcuODA1LTcwLjAxMi0xMTIuOTkzLTEzMS43OTMtODUuMDY3bC04Ljk5NiA0LjA3NGM0MS40MDYtMjMuOTkyIDg5LjQ5Mi0zNy43MzQgMTQwLjc4OS0zNy43MzRabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNkKSIvPjxwYXRoIGQ9Ik0zNjAuMDE2IDc4Ljc1YzE1NS4zMTIuMDA0IDI4MS4yMTggMTI1LjkyMiAyODEuMjE4IDI4MS4yNSAwIDUxLjY3Mi0xMy45NiAxMDAuMDctMzguMjczIDE0MS42OGw0LjU3LTEwLjEyMWMyNy44MzItNjEuNzk3LTE3LjQwNi0xMzEuNzI3LTg1LjE4My0xMzEuNjc2bC0xMTEuOTMuMDg2Yy0yNy44MjQuMDIzLTUwLjQwMi0yMi41MzUtNTAuNDAyLTUwLjM2VjE5Ny40NzdjLS4wMDQtNjcuODA1LTcwLjAxMi0xMTIuOTkzLTEzMS43OTMtODUuMDY3bC04Ljk5NiA0LjA3NGM0MS40MDYtMjMuOTkyIDg5LjQ5Mi0zNy43MzQgMTQwLjc4OS0zNy43MzRabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNlKSIvPjxwYXRoIGQ9Ik0zNjAuMDE2IDc4Ljc1YzE1NS4zMTIuMDA0IDI4MS4yMTggMTI1LjkyMiAyODEuMjE4IDI4MS4yNSAwIDUxLjY3Mi0xMy45NiAxMDAuMDctMzguMjczIDE0MS42OGw0LjU3LTEwLjEyMWMyNy44MzItNjEuNzk3LTE3LjQwNi0xMzEuNzI3LTg1LjE4My0xMzEuNjc2bC0xMTEuOTMuMDg2Yy0yNy44MjQuMDIzLTUwLjQwMi0yMi41MzUtNTAuNDAyLTUwLjM2VjE5Ny40NzdjLS4wMDQtNjcuODA1LTcwLjAxMi0xMTIuOTkzLTEzMS43OTMtODUuMDY3bC04Ljk5NiA0LjA3NGM0MS40MDYtMjMuOTkyIDg5LjQ5Mi0zNy43MzQgMTQwLjc4OS0zNy43MzRabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNmKSIvPjxwYXRoIGQ9Ik0zNjAuMDE2IDc4Ljc1YzE1NS4zMTIuMDA0IDI4MS4yMTggMTI1LjkyMiAyODEuMjE4IDI4MS4yNSAwIDUxLjY3Mi0xMy45NiAxMDAuMDctMzguMjczIDE0MS42OGw0LjU3LTEwLjEyMWMyNy44MzItNjEuNzk3LTE3LjQwNi0xMzEuNzI3LTg1LjE4My0xMzEuNjc2bC0xMTEuOTMuMDg2Yy0yNy44MjQuMDIzLTUwLjQwMi0yMi41MzUtNTAuNDAyLTUwLjM2VjE5Ny40NzdjLS4wMDQtNjcuODA1LTcwLjAxMi0xMTIuOTkzLTEzMS43OTMtODUuMDY3bC04Ljk5NiA0LjA3NGM0MS40MDYtMjMuOTkyIDg5LjQ5Mi0zNy43MzQgMTQwLjc4OS0zNy43MzRabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNnKSIvPjxwYXRoIGQ9Ik0zNjAuMDE2IDc4Ljc1YzE1NS4zMTIuMDA0IDI4MS4yMTggMTI1LjkyMiAyODEuMjE4IDI4MS4yNSAwIDUxLjY3Mi0xMy45NiAxMDAuMDctMzguMjczIDE0MS42OGw0LjU3LTEwLjEyMWMyNy44MzItNjEuNzk3LTE3LjQwNi0xMzEuNzI3LTg1LjE4My0xMzEuNjc2bC0xMTEuOTMuMDg2Yy0yNy44MjQuMDIzLTUwLjQwMi0yMi41MzUtNTAuNDAyLTUwLjM2VjE5Ny40NzdjLS4wMDQtNjcuODA1LTcwLjAxMi0xMTIuOTkzLTEzMS43OTMtODUuMDY3bC04Ljk5NiA0LjA3NGM0MS40MDYtMjMuOTkyIDg5LjQ5Mi0zNy43MzQgMTQwLjc4OS0zNy43MzRabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNoKSIvPjxwYXRoIGQ9Ik0xMDguNzUgMzQ1aDE0Mi41YzI2LjkyNiAwIDQ4Ljc1IDIxLjgyNCA0OC43NSA0OC43NXYxNDIuNWMwIDI2LjkyNi0yMS44MjQgNDguNzUtNDguNzUgNDguNzVoLTE0Mi41QzgxLjgyNCA1ODUgNjAgNTYzLjE3NiA2MCA1MzYuMjV2LTE0Mi41QzYwIDM2Ni44MjQgODEuODI0IDM0NSAxMDguNzUgMzQ1Wm0wIDAiIHN0eWxlPSJzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOnVybCgjaSkiLz48cGF0aCBkPSJNMTA4Ljc1IDM0NWgxNDIuNWMyNi45MjYgMCA0OC43NSAyMS44MjQgNDguNzUgNDguNzV2MTQyLjVjMCAyNi45MjYtMjEuODI0IDQ4Ljc1LTQ4Ljc1IDQ4Ljc1aC0xNDIuNUM4MS44MjQgNTg1IDYwIDU2My4xNzYgNjAgNTM2LjI1di0xNDIuNUM2MCAzNjYuODI0IDgxLjgyNCAzNDUgMTA4Ljc1IDM0NVptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDp1cmwoI2opIi8+PHBhdGggZD0iTTE2OC4yOTMgNDg4LjkwNnY0NC42NjRoLTMwLjg3NVYzOTYuNDI2aDQ3LjdjMTcuMDc3IDAgMzAuMDc3IDMuNzMgMzkgMTEuMTkxIDguOTg3IDcuNDU3IDEzLjQ4IDE4LjUyIDEzLjQ4IDMzLjE4NCAwIDE1LjExMy01LjAzNiAyNi45MDYtMTUuMTA2IDM1LjM4Ny0xMC4wMDQgOC40OC0yMy40NTMgMTIuNzE4LTQwLjM0IDEyLjcxOFptMC02OC43NjF2NDUuMDQzaDEyLjkwNmM3LjY0NSAwIDEzLjU0My0yLjAwNCAxNy42ODQtNi4wMjQgNC4xNC00LjAxNiA2LjIxNS05Ljc4NSA2LjIxNS0xNy4zMDkgMC02Ljk0OS0yLjA0My0xMi4zMDQtNi4xMjEtMTYuMDctNC4wMTYtMy43NjItOS43ODItNS42NC0xNy4zMDEtNS42NFptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDojZmZmO2ZpbGwtb3BhY2l0eToxIi8+PC9zdmc+" },
  "microsoft-outlook": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjYwIDkwLjQgNTcwLjAyIDUzOS42NyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iOS45ODkiIHgyPSIzMC45MzIiIHkxPSIyMi4zNjUiIHkyPSI5LjM3NSIgZ3JhZGllbnRUcmFuc2Zvcm09InNjYWxlKDE1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzIwYTdmYTtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjQiIHN0eWxlPSJzdG9wLWNvbG9yOiMzYmQ1ZmY7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNjNGIwZmY7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjE3LjE5NyIgeDI9IjI4Ljg1NiIgeTE9IjI2Ljc5NCIgeTI9IjguMTI2IiBncmFkaWVudFRyYW5zZm9ybT0ic2NhbGUoMTUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMTY1YWQ5O3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIuNTAxIiBzdHlsZT0ic3RvcC1jb2xvcjojMTg4MGU1O3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojODU4N2ZmO3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSIyNS43MDEiIHgyPSIxMi43NTYiIHkxPSIyNy4wNDgiIHkyPSIxNi41MDEiIGdyYWRpZW50VHJhbnNmb3JtPSJzY2FsZSgxNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4yMzciIHN0eWxlPSJzdG9wLWNvbG9yOiM0NDhhZmY7c3RvcC1vcGFjaXR5OjAiLz48c3RvcCBvZmZzZXQ9Ii43OTIiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDMyYjE7c3RvcC1vcGFjaXR5Oi4yIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImQiIHgxPSIyNC4wNTMiIHgyPSI0NC41MSIgeTE9IjMxLjExIiB5Mj0iMTguMDE4IiBncmFkaWVudFRyYW5zZm9ybT0ic2NhbGUoMTUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMWE0M2E2O3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIuNDkyIiBzdHlsZT0ic3RvcC1jb2xvcjojMjA1MmNiO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojNWYyMGNiO3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImUiIHgxPSIyOS44MjgiIHgyPSIxNy4zOTciIHkxPSIzMC4zMjciIHkyPSIxOS41NzEiIGdyYWRpZW50VHJhbnNmb3JtPSJzY2FsZSgxNSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDQ1Yjk7c3RvcC1vcGFjaXR5OjAiLz48c3RvcCBvZmZzZXQ9Ii42NyIgc3R5bGU9InN0b3AtY29sb3I6IzBkMWY2OTtzdG9wLW9wYWNpdHk6LjIiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjQxLjk5OCIgeDI9IjIzLjg1MiIgeTE9IjI5Ljk0MyIgeTI9IjI5Ljk0MyIgZ3JhZGllbnRUcmFuc2Zvcm09InNjYWxlKDE1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzRkYzRmZjtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjE5NiIgc3R5bGU9InN0b3AtY29sb3I6IzBmYWZmZjtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJrIiB4MT0iMy40NTgiIHgyPSIyMC45MjkiIHkxPSIzNy44NzIiIHkyPSIzNy44NiIgZ3JhZGllbnRUcmFuc2Zvcm09InNjYWxlKDE1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjIwNiIgc3R5bGU9InN0b3AtY29sb3I6IzZjZTBmZjtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjUzNSIgc3R5bGU9InN0b3AtY29sb3I6IzUwZDVmZjtzdG9wLW9wYWNpdHk6MCIvPjwvbGluZWFyR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJmIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGZ4PSIwIiBmeT0iMCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIC00MDUuMDQwNTEgNDM4LjM5MyAwIDM2MC4wMjcgMTAyLjI2OCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii41NjgiIHN0eWxlPSJzdG9wLWNvbG9yOiMyNzVmZjA7c3RvcC1vcGFjaXR5OjAiLz48c3RvcCBvZmZzZXQ9Ii45OTIiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDIxNzc7c3RvcC1vcGFjaXR5OjEiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaCIgY3g9IjAiIGN5PSIwIiByPSIxIiBmeD0iMCIgZnk9IjAiIGdyYWRpZW50VHJhbnNmb3JtPSJzY2FsZSgxNzMuNTgpIHJvdGF0ZSgtNDUgNS4xNjggLTEuMjkyKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjI1OSIgc3R5bGU9InN0b3AtY29sb3I6IzAwNjBkMTtzdG9wLW9wYWNpdHk6LjQiLz48c3RvcCBvZmZzZXQ9Ii45MDgiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMzgzZjE7c3RvcC1vcGFjaXR5OjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaSIgY3g9IjAiIGN5PSIwIiByPSIxIiBmeD0iMCIgZnk9IjAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMzU3LjQwNzAyIC00NjguNDQ1OTMgNDIzLjU5NDU3IDMyMy4xODcwOSAxNTkuNDcxIDY5Ny4wOCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii43MzIiIHN0eWxlPSJzdG9wLWNvbG9yOiNmNGE3Zjc7c3RvcC1vcGFjaXR5OjAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNmNGE3Zjc7c3RvcC1vcGFjaXR5Oi41MDE5NjEiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iaiIgY3g9IjAiIGN5PSIwIiByPSIxIiBmeD0iMCIgZnk9IjAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTE3MC44NjA4NyAyNTkuNzI1NCAtNjc0LjAxODEzIC00NDMuNDA0MTUgMjc4LjU2MiA0MTIuOTc5KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzQ5ZGVmZjtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjcyNCIgc3R5bGU9InN0b3AtY29sb3I6IzI5YzNmZjtzdG9wLW9wYWNpdHk6MSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJsIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGZ4PSIwIiBmeT0iMCIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg0Ni45MjQgLTM3OC41MDQgMjQ1LjI1KSBzY2FsZSgzMTUuOTI3KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjAzOSIgc3R5bGU9InN0b3AtY29sb3I6IzAwOTFmZjtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iLjkxOSIgc3R5bGU9InN0b3AtY29sb3I6IzE4M2RhZDtzdG9wLW9wYWNpdHk6MSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJtIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGZ4PSIwIiBmeT0iMCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwIDE2OCAtMTkzLjc4MiAwIDE4MCA0OTEuMTU5KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjU1OCIgc3R5bGU9InN0b3AtY29sb3I6IzBmYTVmNztzdG9wLW9wYWNpdHk6MCIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6Izc0YzZmZjtzdG9wLW9wYWNpdHk6LjUwMTk2MSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxwYXRoIGQ9Im00NjMuOTg0IDE0MC4xNDUtMzQ0LjM0NyAyMTguMjctMjkuNjE0LTQ2Ljcydi00MC4yNTdhNDMuMjYgNDMuMjYgMCAwIDEgMTkuNzItMzYuMjkzTDMwOS45MSAxMDUuMjU4YzMwLjQ5Ni0xOS43OSA2OS43NzctMTkuNzkzIDEwMC4yNzctLjAwOFptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDp1cmwoI2EpIi8+PHBhdGggZD0iTTQwNy4xMDIgMTAzLjM0YTkxLjI5MyA5MS4yOTMgMCAwIDEgMy4wODIgMS45MTRsMTU2LjIxNCAxMDEuMzMyLTM4Ny4zMzYgMjQ1LjUyLTU5LjQzNy05My43N0w0MDMuODk1IDE3Ny44YzI2LjkyNS0xNy4xMDIgMjguMTA1LTU1LjU3IDMuMjA3LTc0LjQ2MVptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDp1cmwoI2IpIi8+PHBhdGggZD0iTTQwNy4xMDIgMTAzLjM0YTkxLjI5MyA5MS4yOTMgMCAwIDEgMy4wODIgMS45MTRsMTU2LjIxNCAxMDEuMzMyLTM4Ny4zMzYgMjQ1LjUyLTU5LjQzNy05My43N0w0MDMuODk1IDE3Ny44YzI2LjkyNS0xNy4xMDIgMjguMTA1LTU1LjU3IDMuMjA3LTc0LjQ2MVptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDp1cmwoI2MpIi8+PHBhdGggZD0iTTMzMy42MDIgNDk4Ljk4OCAxNzkuMDY2IDQ1Mi4xMSA1MDcuNjMgMjQzLjgzNmMyNy42NzItMTcuNTQgMjcuNjAxLTU3LjkzOC0uMTMzLTc1LjM3OWwtMS40OC0uOTMgNC4yNjEgMi42NDkgOTkuOTk2IDY0Ljg2N2E0My4yNjMgNDMuMjYzIDAgMCAxIDE5LjcyMyAzNi4zdjM4Ljk2MlptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDp1cmwoI2QpIi8+PHBhdGggZD0iTTMzMy42MDIgNDk4Ljk4OCAxNzkuMDY2IDQ1Mi4xMSA1MDcuNjMgMjQzLjgzNmMyNy42NzItMTcuNTQgMjcuNjAxLTU3LjkzOC0uMTMzLTc1LjM3OWwtMS40OC0uOTMgNC4yNjEgMi42NDkgOTkuOTk2IDY0Ljg2N2E0My4yNjMgNDMuMjYzIDAgMCAxIDE5LjcyMyAzNi4zdjM4Ljk2MlptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDp1cmwoI2UpIi8+PHBhdGggZD0iTTQxMC4xODggMTA1LjI1Yy0zMC41LTE5Ljc4NS02OS43ODItMTkuNzgxLTEwMC4yODIuMDA4TDEwOS43NDIgMjM1LjE0NWE0My4yNiA0My4yNiAwIDAgMC0xOS43MTkgMzYuMjkydjEuOTdhNDQuNDc5IDQ0LjQ3OSAwIDAgMCAyMC43MzUgMzYuMTZsMjQ4Ljg4NyAxNTYuOTFMNjA5LjE2IDMwOS44MDVhNDQuNDY4IDQ0LjQ2OCAwIDAgMCAyMC44MjQtMzcuNjY0djM4LjE2OGwuMDA4LTM4Ljk2NWMwLTE0LjY2LTcuNDI2LTI4LjMyLTE5LjcyMi0zNi4zMDFabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNmKSIvPjxwYXRoIGQ9Ik0zMTUuNzcgNjMwLjA1aDIyMC40NDljNTEuNzc3IDAgOTMuNzUtNDEuOTcyIDkzLjc1LTkzLjc1VjI3Mi4xNGMwIDE1LjMwMS03Ljg2NCAyOS41MjgtMjAuODIgMzcuNjY1bC0zMjcuOTA3IDIwNS44OWE2MC43MTIgNjAuNzEyIDAgMCAwLTI4LjQyMiA1MS40MTRjLjAwNCAzNC43NjIgMjguMTg0IDYyLjk0MiA2Mi45NSA2Mi45NDJabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNnKSIvPjxwYXRoIGQ9Ik0zMTUuNzcgNjMwLjA1aDIyMC40NDljNTEuNzc3IDAgOTMuNzUtNDEuOTcyIDkzLjc1LTkzLjc1VjI3Mi4xNGMwIDE1LjMwMS03Ljg2NCAyOS41MjgtMjAuODIgMzcuNjY1bC0zMjcuOTA3IDIwNS44OWE2MC43MTIgNjAuNzEyIDAgMCAwLTI4LjQyMiA1MS40MTRjLjAwNCAzNC43NjIgMjguMTg0IDYyLjk0MiA2Mi45NSA2Mi45NDJabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNoKSIvPjxwYXRoIGQ9Ik0zMTUuNzcgNjMwLjA1aDIyMC40NDljNTEuNzc3IDAgOTMuNzUtNDEuOTcyIDkzLjc1LTkzLjc1VjI3Mi4xNGMwIDE1LjMwMS03Ljg2NCAyOS41MjgtMjAuODIgMzcuNjY1bC0zMjcuOTA3IDIwNS44OWE2MC43MTIgNjAuNzEyIDAgMCAwLTI4LjQyMiA1MS40MTRjLjAwNCAzNC43NjIgMjguMTg0IDYyLjk0MiA2Mi45NSA2Mi45NDJabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNpKSIvPjxwYXRoIGQ9Ik00MDUuNDAyIDYzMC4wMzVIMTgzLjczOGMtNTEuNzc3IDAtOTMuNzUtNDEuOTcyLTkzLjc1LTkzLjc1di0yNjQuMzRhNDQuNDczIDQ0LjQ3MyAwIDAgMCAyMC43NTQgMzcuNjIxbDMyNy41ODIgMjA2LjUyYTYxLjczNyA2MS43MzcgMCAwIDEgMjguODA5IDUyLjIyNmMtLjAwNCAzNC4wOS0yNy42NCA2MS43MjMtNjEuNzMgNjEuNzIzWm0wIDAiIHN0eWxlPSJzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOnVybCgjaikiLz48cGF0aCBkPSJNNDA1LjQwMiA2MzAuMDM1SDE4My43MzhjLTUxLjc3NyAwLTkzLjc1LTQxLjk3Mi05My43NS05My43NXYtMjY0LjM0YTQ0LjQ3MyA0NC40NzMgMCAwIDAgMjAuNzU0IDM3LjYyMWwzMjcuNTgyIDIwNi41MmE2MS43MzcgNjEuNzM3IDAgMCAxIDI4LjgwOSA1Mi4yMjZjLS4wMDQgMzQuMDktMjcuNjQgNjEuNzIzLTYxLjczIDYxLjcyM1ptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDp1cmwoI2spIi8+PHBhdGggZD0iTTEwOC43NSAzNDVoMTQyLjVjMjYuOTI2IDAgNDguNzUgMjEuODI0IDQ4Ljc1IDQ4Ljc1djE0Mi41YzAgMjYuOTI2LTIxLjgyNCA0OC43NS00OC43NSA0OC43NWgtMTQyLjVDODEuODI0IDU4NSA2MCA1NjMuMTc2IDYwIDUzNi4yNXYtMTQyLjVDNjAgMzY2LjgyNCA4MS44MjQgMzQ1IDEwOC43NSAzNDVabTAgMCIgc3R5bGU9InN0cm9rZTpub25lO2ZpbGwtcnVsZTpub256ZXJvO2ZpbGw6dXJsKCNsKSIvPjxwYXRoIGQ9Ik0xMDguNzUgMzQ1aDE0Mi41YzI2LjkyNiAwIDQ4Ljc1IDIxLjgyNCA0OC43NSA0OC43NXYxNDIuNWMwIDI2LjkyNi0yMS44MjQgNDguNzUtNDguNzUgNDguNzVoLTE0Mi41QzgxLjgyNCA1ODUgNjAgNTYzLjE3NiA2MCA1MzYuMjV2LTE0Mi41QzYwIDM2Ni44MjQgODEuODI0IDM0NSAxMDguNzUgMzQ1Wm0wIDAiIHN0eWxlPSJzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOnVybCgjbSkiLz48cGF0aCBkPSJNMTc5LjM4NyA1MzRjLTE5Ljg0OCAwLTM2LjEzNy02LjIxLTQ4Ljg3NS0xOC42MjUtMTIuNzM5LTEyLjQxNC0xOS4xMS0yOC42MTctMTkuMTEtNDguNjA1IDAtMjEuMTEgNi40NjUtMzguMTggMTkuMzk1LTUxLjIyQzE0My43MyA0MDIuNTE3IDE2MC42NiAzOTYgMTgxLjU5NCAzOTZjMTkuNzgxIDAgMzUuODc5IDYuMjM4IDQ4LjI5NyAxOC43MTUgMTIuNDg0IDEyLjQ3NiAxOC43MjYgMjguOTMgMTguNzI2IDQ5LjM1MSAwIDIwLjk4NS02LjQ2OSAzNy44OTktMTkuMzk4IDUwLjc1QzIxNi4zNTIgNTI3LjYwNiAxOTkuNzQyIDUzNCAxNzkuMzg3IDUzNFptLjU3NC0yNi4zNTJjMTAuODE2IDAgMTkuNTIzLTMuNjk1IDI2LjExNy0xMS4wODIgNi41OTQtNy4zODYgOS44OS0xNy42NjQgOS44OS0zMC44MjQgMC0xMy43MTktMy4yMDItMjQuMzk0LTkuNi0zMi4wMzEtNi40MDMtNy42MzctMTQuOTUtMTEuNDUzLTI1LjYzOC0xMS40NTMtMTEuMDExIDAtMTkuODc4IDMuOTQxLTI2LjU5NyAxMS44MjQtNi43MjMgNy44MjQtMTAuMDgyIDE4LjE5MS0xMC4wODIgMzEuMTAyIDAgMTMuMTAxIDMuMzYgMjMuNDY4IDEwLjA4MiAzMS4xMDEgNi43MTkgNy41NzQgMTUuMzI4IDExLjM2MyAyNS44MjggMTEuMzYzWm0wIDAiIHN0eWxlPSJzdHJva2U6bm9uZTtmaWxsLXJ1bGU6bm9uemVybztmaWxsOiNmZmY7ZmlsbC1vcGFjaXR5OjEiLz48cGF0aCBkPSJNMTc5LjMzMiA1MzUuODQ4Yy0xOS43NyAwLTM2LTYuMzc1LTQ4LjY5MS0xOS4xMy0xMi42ODgtMTIuNzUzLTE5LjAzNi0yOS4zOTgtMTkuMDM2LTQ5LjkyOSAwLTIxLjY4NCA2LjQ0Mi0zOS4yMTkgMTkuMzI1LTUyLjYxIDEyLjg4Mi0xMy4zOTQgMjkuNzUtMjAuMDkgNTAuNjAxLTIwLjA5IDE5LjcwMyAwIDM1Ljc0MiA2LjQxMSA0OC4xMTQgMTkuMjI3IDEyLjQzNyAxMi44MiAxOC42NTIgMjkuNzIgMTguNjUyIDUwLjcgMCAyMS41NS02LjQ0MiAzOC45My0xOS4zMiA1Mi4xMjktMTIuODIgMTMuMTM2LTI5LjM2OCAxOS43MDMtNDkuNjQ1IDE5LjcwM1ptLjU3LTI3LjA2N2MxMC43NzggMCAxOS40NTMtMy43OTcgMjYuMDItMTEuMzgzIDYuNTctNy41OSA5Ljg1MS0xOC4xNDQgOS44NTEtMzEuNjY0IDAtMTQuMDkzLTMuMTg3LTI1LjA1OC05LjU2Mi0zMi45MDItNi4zNzktNy44NDQtMTQuODktMTEuNzY2LTI1LjU0LTExLjc2Ni0xMC45NzIgMC0xOS44MDQgNC4wNDctMjYuNSAxMi4xNDktNi42OTQgOC4wMzEtMTAuMDQyIDE4LjY4My0xMC4wNDIgMzEuOTQ1IDAgMTMuNDU3IDMuMzQ4IDI0LjEwNiAxMC4wNDMgMzEuOTUgNi42OTUgNy43OCAxNS4yNzMgMTEuNjcxIDI1LjczIDExLjY3MVptMCAwIiBzdHlsZT0ic3Ryb2tlOm5vbmU7ZmlsbC1ydWxlOm5vbnplcm87ZmlsbDojZmZmO2ZpbGwtb3BhY2l0eToxIi8+PC9zdmc+" },
  "microsoft-teams": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjQgNCAzNiAzOCI+PHBhdGggZmlsbD0idXJsKCNhKSIgZD0iTTIyIDIwaDEyYTYgNiAwIDAgMSA2IDZ2MTBhNiA2IDAgMCAxLTEyIDBWMjZhNiA2IDAgMCAwLTYtNloiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNOCAyNGE2IDYgMCAwIDEgNi02aDhhNiA2IDAgMCAxIDYgNnYxMmE2IDYgMCAwIDAgNiA2SDE4Yy01LjUyMyAwLTEwLTQuNDc3LTEwLTEwdi04WiIvPjxwYXRoIGZpbGw9InVybCgjYykiIGZpbGwtb3BhY2l0eT0iLjciIGQ9Ik04IDI0YTYgNiAwIDAgMSA2LTZoOGE2IDYgMCAwIDEgNiA2djEyYTYgNiAwIDAgMCA2IDZIMThjLTUuNTIzIDAtMTAtNC40NzctMTAtMTB2LThaIi8+PHBhdGggZmlsbD0idXJsKCNkKSIgZmlsbC1vcGFjaXR5PSIuNyIgZD0iTTggMjRhNiA2IDAgMCAxIDYtNmg4YTYgNiAwIDAgMSA2IDZ2MTJhNiA2IDAgMCAwIDYgNkgxOGMtNS41MjMgMC0xMC00LjQ3Ny0xMC0xMHYtOFoiLz48cGF0aCBmaWxsPSJ1cmwoI2UpIiBkPSJNMzMgMThhNSA1IDAgMSAwIDAtMTAgNSA1IDAgMCAwIDAgMTBaIi8+PHBhdGggZmlsbD0idXJsKCNmKSIgZmlsbC1vcGFjaXR5PSIuNDYiIGQ9Ik0zMyAxOGE1IDUgMCAxIDAgMC0xMCA1IDUgMCAwIDAgMCAxMFoiLz48cGF0aCBmaWxsPSJ1cmwoI2cpIiBmaWxsLW9wYWNpdHk9Ii40IiBkPSJNMzMgMThhNSA1IDAgMSAwIDAtMTAgNSA1IDAgMCAwIDAgMTBaIi8+PHBhdGggZmlsbD0idXJsKCNoKSIgZD0iTTE4IDE2YTYgNiAwIDEgMCAwLTEyIDYgNiAwIDAgMCAwIDEyWiIvPjxwYXRoIGZpbGw9InVybCgjaSkiIGZpbGwtb3BhY2l0eT0iLjYiIGQ9Ik0xOCAxNmE2IDYgMCAxIDAgMC0xMiA2IDYgMCAwIDAgMCAxMloiLz48cGF0aCBmaWxsPSJ1cmwoI2opIiBmaWxsLW9wYWNpdHk9Ii41IiBkPSJNMTggMTZhNiA2IDAgMSAwIDAtMTIgNiA2IDAgMCAwIDAgMTJaIi8+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB4PSI0IiB5PSIyMyIgZmlsbD0idXJsKCNrKSIgcng9IjMuMjUiLz48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHg9IjQiIHk9IjIzIiBmaWxsPSJ1cmwoI2wpIiBmaWxsLW9wYWNpdHk9Ii43IiByeD0iMy4yNSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xNS40OCAyOC4xMDVoLTIuNDQ4djcuNDY2aC0yLjA2NXYtNy40NjZIOC41MlYyNi40M2g2Ljk2djEuNjc2WiIvPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEzLjQ3ODQgMCAwIDMzLjI2OTQgMzkuNzk3IDIyLjE3NCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjQTk4QUZGIi8+PHN0b3Agb2Zmc2V0PSIuMTQiIHN0b3AtY29sb3I9IiM4Qzc1RkYiLz48c3RvcCBvZmZzZXQ9Ii41NjUiIHN0b3AtY29sb3I9IiM1RjUwRTIiLz48c3RvcCBvZmZzZXQ9Ii45IiBzdG9wLWNvbG9yPSIjM0MyQ0I4Ii8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImIiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxMi4xODc1IDMwLjM5OTk3IC0zMC43NDQ0MiAxMi4zMjU2IDguODEyIDE2LjQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzg1QzJGRiIvPjxzdG9wIG9mZnNldD0iLjY5IiBzdG9wLWNvbG9yPSIjNzU4OEZGIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjQ1OUZFIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImQiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgxMTMuMzI2IDguMDkzIDE3LjY0NSkgc2NhbGUoMTkuMjE4NiAxNS40MjczKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNCRDk2RkYiLz48c3RvcCBvZmZzZXQ9Ii42ODciIHN0b3AtY29sb3I9IiNCRDk2RkYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJlIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAtMTAgMTIuNjIxNiAwIDMzIDExLjU3MSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4yNjgiIHN0b3AtY29sb3I9IiM2ODY4RjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzOTIzQjEiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDUuNDcwMjQgNC41OTg0NyAtNi42NTExNyA3LjkxMjA4IDI4Ljg2NyAxMC41NDQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMjcxIiBzdG9wLWNvbG9yPSIjQTFEM0ZGIi8+PHN0b3Agb2Zmc2V0PSIuODEzIiBzdG9wLWNvbG9yPSIjQTFEM0ZGIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZyIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC00MS42NTggMzIuMTE4IC00My40Mikgc2NhbGUoOC41MTI3NSAyMC44ODI0KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNFM0FDRkQiLz48c3RvcCBvZmZzZXQ9Ii44MTYiIHN0b3AtY29sb3I9IiM5RkEyRkYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJoIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAtMTIgMTUuMTQ2IDAgMTggOC4yODYpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMjY4IiBzdG9wLWNvbG9yPSIjODI4MkZGIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzkyM0IxIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg0MC4wNTIgLTMuMTU1IDIxLjQxNikgc2NhbGUoOC41NzU1NCAxMi40MDM1KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjI3MSIgc3RvcC1jb2xvcj0iI0ExRDNGRiIvPjxzdG9wIG9mZnNldD0iLjgxMyIgc3RvcC1jb2xvcj0iI0ExRDNGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImoiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtNDEuNjU4IDIwLjM4MiAtMjYuNTE2KSBzY2FsZSgxMC4yMTUzIDI1LjA1ODkpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0UzQUNGRCIvPjxzdG9wIG9mZnNldD0iLjgxNiIgc3RvcC1jb2xvcj0iIzlGQTJGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImsiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg0NSAtMjUuNzYzIDE2LjMyOCkgc2NhbGUoMjIuNjI3NCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii4wNDciIHN0b3AtY29sb3I9IiM2ODhFRkYiLz48c3RvcCBvZmZzZXQ9Ii45NDciIHN0b3AtY29sb3I9IiMyMzBGOTQiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0ibCIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgMTEuMiAtMTMuMDcwMiAwIDEyIDMyLjYpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuNTcxIiBzdG9wLWNvbG9yPSIjNjk2NUY2IiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4RjhGRkYiLz48L3JhZGlhbEdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYyIgeDE9IjIwLjU5NCIgeDI9IjIwLjU5NCIgeTE9IjE4IiB5Mj0iNDIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9Ii44MDEiIHN0b3AtY29sb3I9IiM2ODY0RjYiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzUxNDlERSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==" },
  "microsoft-onedrive": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0i0KHQu9C+0LkgMSIgdmlld0JveD0iMCAwIDEwMDAgNjE1Ij48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSItNDQ2LjIzIiBjeT0iODUwLjI0IiByPSI2Ljk5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIiIGZ4PSItNDQ2LjIzIiBmeT0iODUwLjI0IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDI4Ljg3OTc1IDMyLjAwNjc1IDUzLjY5NjQ2IC00OC4zOTk3NSAtMzI3NTAuNzcgNTU1NjQuNykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0ODk0ZmUiLz48c3RvcCBvZmZzZXQ9Ii43IiBzdG9wLWNvbG9yPSIjMDkzNGIzIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImIiIGN4PSItNDYzLjcxIiBjeT0iODU1LjA5IiByPSI2Ljk5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgMiIgZng9Ii00NjMuNzEiIGZ5PSI4NTUuMDkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTEyNi45Mzc1NCAxMzUuNDU4NzQgMTAxLjIzNzA0IDk0Ljc3OTggLTE0NDU2MS44MyAtMTg0NDQuMjQpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIuMTciIHN0b3AtY29sb3I9IiMyM2MwZmUiLz48c3RvcCBvZmZzZXQ9Ii41MyIgc3RvcC1jb2xvcj0iIzFjOTFmZiIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJjIiBjeD0iLTQ3OC42NyIgY3k9Ijg0Ny4xMiIgcj0iNi45OSIgZGF0YS1uYW1lPSLQkdC10LfRi9C80Y/QvdC90YvQuSDQs9GA0LDQtNC40LXQvdGCIDMiIGZ4PSItNDc4LjY3IiBmeT0iODQ3LjEyIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC0zMC4xNzk1NiAtMjMuNDM0OTggLTUyLjgwMTcyIDY3LjkzMjc4IDMwNTA5LjkxIC02ODYyMC44OCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9Ii42NiIgc3RvcC1jb2xvcj0iI2FkYzBmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImQiIGN4PSItNDg0Ljg5IiBjeT0iODQ3LjMxIiByPSI2Ljk5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgNCIgZng9Ii00ODQuODkiIGZ5PSI4NDcuMzEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTMzLjkwMDcyIC0yNi41MzM4MiAtMzkuNjkxODggNTAuNjYzMjUgMTc3MTQuNDkgLTU1MzQ4LjI2KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAzM2FjYyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzM2OGVmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImUiIGN4PSItNDU0LjQyIiBjeT0iODUzLjE4IiByPSI2Ljk5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgNSIgZng9Ii00NTQuNDIiIGZ5PSI4NTMuMTgiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMzguNzQyMTMgODIuNzA1NiA5NC4wMzg3MyAtNDQuMDE1NzYgLTYyNDE2LjUxIDc1MTE0Ljk3KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iLjU5IiBzdG9wLWNvbG9yPSIjMzQ2NGUzIiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMzNhY2MiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZiIgY3g9Ii00NjUuMyIgY3k9Ijg1Mi42MyIgcj0iNi45OSIgZGF0YS1uYW1lPSLQkdC10LfRi9C80Y/QvdC90YvQuSDQs9GA0LDQtNC40LXQvdGCIDYiIGZ4PSItNDY1LjMiIGZ5PSI4NTIuNjMiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTEwMS4zNTUxOSA5My43NTc0IDE0Ni41MTYyIDE1OC4yNDc0MyAtMTcxMjMyLjUzIC05MTQ0NC4xMykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0YmZkZTgiLz48c3RvcCBvZmZzZXQ9Ii41NCIgc3RvcC1jb2xvcj0iIzRiZmRlOCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImgiIGN4PSItNDQ1LjQyIiBjeT0iODQ3LjM1IiByPSI2Ljk5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgOCIgZng9Ii00NDUuNDIiIGZ5PSI4NDcuMzUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoNjAuMzc3NyAyMi4xNDI5MSAzOS41OTY4OCAtMTA3Ljg3MjEzIC02MjY0LjkyIDEwMTUwOC43OSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9Ii43OSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImkiIGN4PSItNDY4LjY3IiBjeT0iODYxLjM5IiByPSI2Ljk5IiBkYXRhLW5hbWU9ItCR0LXQt9GL0LzRj9C90L3Ri9C5INCz0YDQsNC00LjQtdC90YIgOSIgZng9Ii00NjguNjciIGZ5PSI4NjEuMzkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTY3LjQ1OTMzIDUzLjc3NTAxIDUzLjIxODE2IDY2LjY4ODMyIC03NjQ2OC40NSAtMzIwODMuNzgpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjNGJmZGU4Ii8+PHN0b3Agb2Zmc2V0PSIuNTgiIHN0b3AtY29sb3I9IiM0YmZkZTgiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iNjM4LjY3IiB4Mj0iNjM4LjY3IiB5MT0iMi40NCIgeTI9IjQyMS43NiIgZGF0YS1uYW1lPSLQkdC10LfRi9C80Y/QvdC90YvQuSDQs9GA0LDQtNC40LXQvdGCIDciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCA2MTcuMDEpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMDA4NmZmIi8+PHN0b3Agb2Zmc2V0PSIuNDkiIHN0b3AtY29sb3I9IiMwYmYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMjc2LjM2IDk0LjA4QzEyMy40OCA5NC4wOCA5LjIxIDIwOS44NC42IDMzOC43OWM1LjMzIDI3Ljc5IDIyLjgzIDgyLjY1IDUwLjI0IDc5Ljg0IDM0LjI2LTMuNTIgMTIwLjU2IDAgMTk0LjE3LTEyMy4yNiA1My43Ny05MC4wNCAxNjQuMzctMjAxLjI5IDMxLjM1LTIwMS4yOVoiIHN0eWxlPSJmaWxsOnVybCgjYSkiLz48cGF0aCBkPSJNMjQwLjk5IDE0Mi4xOWMtNTEuMzkgNzUuMjYtMTIwLjU2IDE4My4xLTE0My45MSAyMTcuMDMtMjcuNzUgNDAuMzQtMTAxLjI1IDIzLjItOTUuMTYtMzQuNjJhMjM3LjQgMjM3LjQgMCAwIDAtMS4zOCAxNC4xOUMtOS41MSA0ODkuMjIgMTE5LjQzIDYxNC4xNCAyNzkuODggNjE0LjE0YzE3Ni44NCAwIDU5OC41OC0yMDMuODEgNTU1LjktNDA4LjAyQzc5MC44IDg2LjEgNjY0LjM2IDAgNTIxLjA3IDBTMjg1Ljk0IDc2LjM2IDI0MSAxNDIuMTlaIiBzdHlsZT0iZmlsbDp1cmwoI2IpIi8+PHBhdGggZD0iTTI0MC45OSAxNDIuMTljLTUxLjM5IDc1LjI2LTEyMC41NiAxODMuMS0xNDMuOTEgMjE3LjAzLTI3Ljc1IDQwLjM0LTEwMS4yNSAyMy4yLTk1LjE2LTM0LjYyYTIzNy40IDIzNy40IDAgMCAwLTEuMzggMTQuMTlDLTkuNTEgNDg5LjIyIDExOS40MyA2MTQuMTQgMjc5Ljg4IDYxNC4xNGMxNzYuODQgMCA1OTguNTgtMjAzLjgxIDU1NS45LTQwOC4wMkM3OTAuOCA4Ni4xIDY2NC4zNiAwIDUyMS4wNyAwUzI4NS45NCA3Ni4zNiAyNDEgMTQyLjE5WiIgc3R5bGU9ImZpbGwtb3BhY2l0eTouNDtmaWxsOnVybCgjYykiLz48cGF0aCBkPSJNMjQwLjk5IDE0Mi4xOWMtNTEuMzkgNzUuMjYtMTIwLjU2IDE4My4xLTE0My45MSAyMTcuMDMtMjcuNzUgNDAuMzQtMTAxLjI1IDIzLjItOTUuMTYtMzQuNjJhMjM3LjQgMjM3LjQgMCAwIDAtMS4zOCAxNC4xOUMtOS41MSA0ODkuMjIgMTE5LjQzIDYxNC4xNCAyNzkuODggNjE0LjE0YzE3Ni44NCAwIDU5OC41OC0yMDMuODEgNTU1LjktNDA4LjAyQzc5MC44IDg2LjEgNjY0LjM2IDAgNTIxLjA3IDBTMjg1Ljk0IDc2LjM2IDI0MSAxNDIuMTlaIiBzdHlsZT0iZmlsbDp1cmwoI2QpIi8+PHBhdGggZD0iTTI0MC45OSAxNDIuMTljLTUxLjM5IDc1LjI2LTEyMC41NiAxODMuMS0xNDMuOTEgMjE3LjAzLTI3Ljc1IDQwLjM0LTEwMS4yNSAyMy4yLTk1LjE2LTM0LjYyYTIzNy40IDIzNy40IDAgMCAwLTEuMzggMTQuMTlDLTkuNTEgNDg5LjIyIDExOS40MyA2MTQuMTQgMjc5Ljg4IDYxNC4xNGMxNzYuODQgMCA1OTguNTgtMjAzLjgxIDU1NS45LTQwOC4wMkM3OTAuOCA4Ni4xIDY2NC4zNiAwIDUyMS4wNyAwUzI4NS45NCA3Ni4zNiAyNDEgMTQyLjE5WiIgc3R5bGU9ImZpbGw6dXJsKCNlKTtmaWxsLW9wYWNpdHk6LjYiLz48cGF0aCBkPSJNMjQwLjk5IDE0Mi4xOWMtNTEuMzkgNzUuMjYtMTIwLjU2IDE4My4xLTE0My45MSAyMTcuMDMtMjcuNzUgNDAuMzQtMTAxLjI1IDIzLjItOTUuMTYtMzQuNjJhMjM3LjQgMjM3LjQgMCAwIDAtMS4zOCAxNC4xOUMtOS41MSA0ODkuMjIgMTE5LjQzIDYxNC4xNCAyNzkuODggNjE0LjE0YzE3Ni44NCAwIDU5OC41OC0yMDMuODEgNTU1LjktNDA4LjAyQzc5MC44IDg2LjEgNjY0LjM2IDAgNTIxLjA3IDBTMjg1Ljk0IDc2LjM2IDI0MSAxNDIuMTlaIiBzdHlsZT0iZmlsbC1vcGFjaXR5Oi45O2ZpbGw6dXJsKCNmKSIvPjxwYXRoIGQ9Ik0yNzcuMzQgNjE0LjIzczQyMi4yNC43NyA0OTMuODYuNzdjMTI5Ljk3IDAgMjI4LjgtOTguMTYgMjI4LjgtMjEyLjY5cy0xMDAuOC0yMTIuMS0yMjguOC0yMTIuMS0yMDEuNyA4OC41Ny0yNTcuMDYgMTg1LjI1Yy02NC44NyAxMTMuMjktMTQ3LjYyIDIzNy40MS0yMzYuOCAyMzguNzdaIiBzdHlsZT0iZmlsbDp1cmwoI2cpIi8+PHBhdGggZD0iTTI3Ny4zNCA2MTQuMjNzNDIyLjI0Ljc3IDQ5My44Ni43N2MxMjkuOTcgMCAyMjguOC05OC4xNiAyMjguOC0yMTIuNjlzLTEwMC44LTIxMi4xLTIyOC44LTIxMi4xLTIwMS43IDg4LjU3LTI1Ny4wNiAxODUuMjVjLTY0Ljg3IDExMy4yOS0xNDcuNjIgMjM3LjQxLTIzNi44IDIzOC43N1oiIHN0eWxlPSJmaWxsOnVybCgjaCk7ZmlsbC1vcGFjaXR5Oi40Ii8+PHBhdGggZD0iTTI3Ny4zNCA2MTQuMjNzNDIyLjI0Ljc3IDQ5My44Ni43N2MxMjkuOTcgMCAyMjguOC05OC4xNiAyMjguOC0yMTIuNjlzLTEwMC44LTIxMi4xLTIyOC44LTIxMi4xLTIwMS43IDg4LjU3LTI1Ny4wNiAxODUuMjVjLTY0Ljg3IDExMy4yOS0xNDcuNjIgMjM3LjQxLTIzNi44IDIzOC43N1oiIHN0eWxlPSJmaWxsOnVybCgjaSk7ZmlsbC1vcGFjaXR5Oi45Ii8+PC9zdmc+" },
  "google-sheets": { light: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzQiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgNzQgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxtYXNrIGlkPSJtYXNrMF8xOjUyIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIxIiB5PSIxIiB3aWR0aD0iNzEiIGhlaWdodD0iOTgiPjxwYXRoIGQ9Ik00NS4zOTggMS40MzAzNkg3Ljg2Njg4QzQuMjI0MTUgMS40MzAzNiAxLjI0Mzc0IDQuNDEwNzcgMS4yNDM3NCA4LjA1MzVWOTEuOTQ2NUMxLjI0Mzc0IDk1LjU4OTMgNC4yMjQxNSA5OC41Njk3IDcuODY2ODggOTguNTY5N0g2NS4yNjc0QzY4LjkxMDEgOTguNTY5NyA3MS44OTA1IDk1LjU4OTMgNzEuODkwNSA5MS45NDY1VjI3LjkyMjlMNDUuMzk4IDEuNDMwMzZaIiBmaWxsPSJ3aGl0ZSIvPjwvbWFzaz48ZyBtYXNrPSJ1cmwoI21hc2swXzE6NTIpIj48cGF0aCBkPSJNNDUuMzk4IDEuNDMwMzZINy44NjY4OEM0LjIyNDE1IDEuNDMwMzYgMS4yNDM3NCA0LjQxMDc3IDEuMjQzNzQgOC4wNTM1VjkxLjk0NjVDMS4yNDM3NCA5NS41ODkzIDQuMjI0MTUgOTguNTY5NyA3Ljg2Njg4IDk4LjU2OTdINjUuMjY3NEM2OC45MTAxIDk4LjU2OTcgNzEuODkwNSA5NS41ODkzIDcxLjg5MDUgOTEuOTQ2NVYyNy45MjI5TDU2LjQzNjUgMTYuODg0M0w0NS4zOTggMS40MzAzNloiIGZpbGw9IiMwRjlENTgiLz48L2c+PG1hc2sgaWQ9Im1hc2sxXzE6NTIiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjEiIHk9IjEiIHdpZHRoPSI3MSIgaGVpZ2h0PSI5OCI+PHBhdGggZD0iTTQ1LjM5OCAxLjQzMDM2SDcuODY2ODhDNC4yMjQxNSAxLjQzMDM2IDEuMjQzNzQgNC40MTA3NyAxLjI0Mzc0IDguMDUzNVY5MS45NDY1QzEuMjQzNzQgOTUuNTg5MyA0LjIyNDE1IDk4LjU2OTcgNy44NjY4OCA5OC41Njk3SDY1LjI2NzRDNjguOTEwMSA5OC41Njk3IDcxLjg5MDUgOTUuNTg5MyA3MS44OTA1IDkxLjk0NjVWMjcuOTIyOUw0NS4zOTggMS40MzAzNloiIGZpbGw9IndoaXRlIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjbWFzazFfMTo1MikiPjxwYXRoIGQ9Ik0xOC45MDU0IDQ4Ljg5NjJWODAuOTA4SDU0LjIyODhWNDguODk2MkgxOC45MDU0Wk0zNC4zNTk0IDc2LjQ5MjZIMjMuMzIwOVY3MC45NzMzSDM0LjM1OTRWNzYuNDkyNlpNMzQuMzU5NCA2Ny42NjE3SDIzLjMyMDlWNjIuMTQyNEgzNC4zNTk0VjY3LjY2MTdaTTM0LjM1OTQgNTguODMwOUgyMy4zMjA5VjUzLjMxMTZIMzQuMzU5NFY1OC44MzA5Wk00OS44MTM0IDc2LjQ5MjZIMzguNzc0OFY3MC45NzMzSDQ5LjgxMzRWNzYuNDkyNlpNNDkuODEzNCA2Ny42NjE3SDM4Ljc3NDhWNjIuMTQyNEg0OS44MTM0VjY3LjY2MTdaTTQ5LjgxMzQgNTguODMwOUgzOC43NzQ4VjUzLjMxMTZINDkuODEzNFY1OC44MzA5WiIgZmlsbD0iI0YxRjFGMSIvPjwvZz48bWFzayBpZD0ibWFzazJfMTo1MiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMSIgeT0iMSIgd2lkdGg9IjcxIiBoZWlnaHQ9Ijk4Ij48cGF0aCBkPSJNNDUuMzk4IDEuNDMwMzZINy44NjY4OEM0LjIyNDE1IDEuNDMwMzYgMS4yNDM3NCA0LjQxMDc3IDEuMjQzNzQgOC4wNTM1VjkxLjk0NjVDMS4yNDM3NCA5NS41ODkzIDQuMjI0MTUgOTguNTY5NyA3Ljg2Njg4IDk4LjU2OTdINjUuMjY3NEM2OC45MTAxIDk4LjU2OTcgNzEuODkwNSA5NS41ODkzIDcxLjg5MDUgOTEuOTQ2NVYyNy45MjI5TDQ1LjM5OCAxLjQzMDM2WiIgZmlsbD0id2hpdGUiLz48L21hc2s+PGcgbWFzaz0idXJsKCNtYXNrMl8xOjUyKSI+PHBhdGggZD0iTTQ3LjMzNTIgMjUuOTg1Nkw3MS44OTA1IDUwLjUzNTRWMjcuOTIyOUw0Ny4zMzUyIDI1Ljk4NTZaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMTo1MikiLz48L2c+PG1hc2sgaWQ9Im1hc2szXzE6NTIiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjEiIHk9IjEiIHdpZHRoPSI3MSIgaGVpZ2h0PSI5OCI+PHBhdGggZD0iTTQ1LjM5OCAxLjQzMDM2SDcuODY2ODhDNC4yMjQxNSAxLjQzMDM2IDEuMjQzNzQgNC40MTA3NyAxLjI0Mzc0IDguMDUzNVY5MS45NDY1QzEuMjQzNzQgOTUuNTg5MyA0LjIyNDE1IDk4LjU2OTcgNy44NjY4OCA5OC41Njk3SDY1LjI2NzRDNjguOTEwMSA5OC41Njk3IDcxLjg5MDUgOTUuNTg5MyA3MS44OTA1IDkxLjk0NjVWMjcuOTIyOUw0NS4zOTggMS40MzAzNloiIGZpbGw9IndoaXRlIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjbWFzazNfMTo1MikiPjxwYXRoIGQ9Ik00NS4zOTggMS40MzAzNlYyMS4yOTk4QzQ1LjM5OCAyNC45NTkgNDguMzYxOCAyNy45MjI5IDUyLjAyMTEgMjcuOTIyOUg3MS44OTA1TDQ1LjM5OCAxLjQzMDM2WiIgZmlsbD0iIzg3Q0VBQyIvPjwvZz48bWFzayBpZD0ibWFzazRfMTo1MiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMSIgeT0iMSIgd2lkdGg9IjcxIiBoZWlnaHQ9Ijk4Ij48cGF0aCBkPSJNNDUuMzk4IDEuNDMwMzZINy44NjY4OEM0LjIyNDE1IDEuNDMwMzYgMS4yNDM3NCA0LjQxMDc3IDEuMjQzNzQgOC4wNTM1VjkxLjk0NjVDMS4yNDM3NCA5NS41ODkzIDQuMjI0MTUgOTguNTY5NyA3Ljg2Njg4IDk4LjU2OTdINjUuMjY3NEM2OC45MTAxIDk4LjU2OTcgNzEuODkwNSA5NS41ODkzIDcxLjg5MDUgOTEuOTQ2NVYyNy45MjI5TDQ1LjM5OCAxLjQzMDM2WiIgZmlsbD0id2hpdGUiLz48L21hc2s+PGcgbWFzaz0idXJsKCNtYXNrNF8xOjUyKSI+PHBhdGggZD0iTTcuODY2ODggMS40MzAzNkM0LjIyNDE1IDEuNDMwMzYgMS4yNDM3NCA0LjQxMDc3IDEuMjQzNzQgOC4wNTM1VjguNjA1NDJDMS4yNDM3NCA0Ljk2MjcgNC4yMjQxNSAxLjk4MjI5IDcuODY2ODggMS45ODIyOUg0NS4zOThWMS40MzAzNkg3Ljg2Njg4WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9nPjxtYXNrIGlkPSJtYXNrNV8xOjUyIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIxIiB5PSIxIiB3aWR0aD0iNzEiIGhlaWdodD0iOTgiPjxwYXRoIGQ9Ik00NS4zOTggMS40MzAzNkg3Ljg2Njg4QzQuMjI0MTUgMS40MzAzNiAxLjI0Mzc0IDQuNDEwNzcgMS4yNDM3NCA4LjA1MzVWOTEuOTQ2NUMxLjI0Mzc0IDk1LjU4OTMgNC4yMjQxNSA5OC41Njk3IDcuODY2ODggOTguNTY5N0g2NS4yNjc0QzY4LjkxMDEgOTguNTY5NyA3MS44OTA1IDk1LjU4OTMgNzEuODkwNSA5MS45NDY1VjI3LjkyMjlMNDUuMzk4IDEuNDMwMzZaIiBmaWxsPSJ3aGl0ZSIvPjwvbWFzaz48ZyBtYXNrPSJ1cmwoI21hc2s1XzE6NTIpIj48cGF0aCBkPSJNNjUuMjY3NCA5OC4wMTc3SDcuODY2ODhDNC4yMjQxNSA5OC4wMTc3IDEuMjQzNzQgOTUuMDM3MyAxLjI0Mzc0IDkxLjM5NDZWOTEuOTQ2NUMxLjI0Mzc0IDk1LjU4OTMgNC4yMjQxNSA5OC41Njk3IDcuODY2ODggOTguNTY5N0g2NS4yNjc0QzY4LjkxMDEgOTguNTY5NyA3MS44OTA1IDk1LjU4OTMgNzEuODkwNSA5MS45NDY1VjkxLjM5NDZDNzEuODkwNSA5NS4wMzczIDY4LjkxMDEgOTguMDE3NyA2NS4yNjc0IDk4LjAxNzdaIiBmaWxsPSIjMjYzMjM4IiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvZz48bWFzayBpZD0ibWFzazZfMTo1MiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMSIgeT0iMSIgd2lkdGg9IjcxIiBoZWlnaHQ9Ijk4Ij48cGF0aCBkPSJNNDUuMzk4IDEuNDMwMzZINy44NjY4OEM0LjIyNDE1IDEuNDMwMzYgMS4yNDM3NCA0LjQxMDc3IDEuMjQzNzQgOC4wNTM1VjkxLjk0NjVDMS4yNDM3NCA5NS41ODkzIDQuMjI0MTUgOTguNTY5NyA3Ljg2Njg4IDk4LjU2OTdINjUuMjY3NEM2OC45MTAxIDk4LjU2OTcgNzEuODkwNSA5NS41ODkzIDcxLjg5MDUgOTEuOTQ2NVYyNy45MjI5TDQ1LjM5OCAxLjQzMDM2WiIgZmlsbD0id2hpdGUiLz48L21hc2s+PGcgbWFzaz0idXJsKCNtYXNrNl8xOjUyKSI+PHBhdGggZD0iTTUyLjAyMTEgMjcuOTIyOUM0OC4zNjE4IDI3LjkyMjkgNDUuMzk4IDI0Ljk1OSA0NS4zOTggMjEuMjk5OFYyMS44NTE3QzQ1LjM5OCAyNS41MTEgNDguMzYxOCAyOC40NzQ4IDUyLjAyMTEgMjguNDc0OEg3MS44OTA1VjI3LjkyMjlINTIuMDIxMVoiIGZpbGw9IiMyNjMyMzgiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjxwYXRoIGQ9Ik00NS4zOTggMS40MzAzNkg3Ljg2Njg4QzQuMjI0MTUgMS40MzAzNiAxLjI0Mzc0IDQuNDEwNzcgMS4yNDM3NCA4LjA1MzVWOTEuOTQ2NUMxLjI0Mzc0IDk1LjU4OTMgNC4yMjQxNSA5OC41Njk3IDcuODY2ODggOTguNTY5N0g2NS4yNjc0QzY4LjkxMDEgOTguNTY5NyA3MS44OTA1IDk1LjU4OTMgNzEuODkwNSA5MS45NDY1VjI3LjkyMjlMNDUuMzk4IDEuNDMwMzZaIiBmaWxsPSJ1cmwoI3BhaW50MV9yYWRpYWxfMTo1MikiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTo1MiIgeDE9IjU5LjYxNDIiIHkxPSIyOC4wOTM1IiB4Mj0iNTkuNjE0MiIgeTI9IjUwLjUzODgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjMjYzMjM4IiBzdG9wLW9wYWNpdHk9IjAuMiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzI2MzIzOCIgc3RvcC1vcGFjaXR5PSIwLjAyIi8+PC9saW5lYXJHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MV9yYWRpYWxfMTo1MiIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgzLjQ4MTg3IDMuMzYxMjEpIHNjYWxlKDExMy45MTcpIj48c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4=" },
  "google-slides": { light: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzMiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgNzMgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxtYXNrIGlkPSJtYXNrMF8xOjIiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSI3MiIgaGVpZ2h0PSI5OSI+PHBhdGggZD0iTTQ0LjgyMzIgMEg2LjcyMzQ4QzMuMDI1NTcgMCAwIDMuMDI1NTcgMCA2LjcyMzQ4VjkxLjg4NzZDMCA5NS41ODU1IDMuMDI1NTcgOTguNjExMSA2LjcyMzQ4IDk4LjYxMTFINjQuOTkzN0M2OC42OTE2IDk4LjYxMTEgNzEuNzE3MiA5NS41ODU1IDcxLjcxNzIgOTEuODg3NlYyNi44OTM5TDQ0LjgyMzIgMFoiIGZpbGw9IndoaXRlIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjbWFzazBfMToyKSI+PHBhdGggZD0iTTQ0LjgyMzIgMEg2LjcyMzQ4QzMuMDI1NTcgMCAwIDMuMDI1NTcgMCA2LjcyMzQ4VjkxLjg4NzZDMCA5NS41ODU1IDMuMDI1NTcgOTguNjExMSA2LjcyMzQ4IDk4LjYxMTFINjQuOTkzN0M2OC42OTE2IDk4LjYxMTEgNzEuNzE3MiA5NS41ODU1IDcxLjcxNzIgOTEuODg3NlYyNi44OTM5TDU2LjAyOSAxNS42ODgxTDQ0LjgyMzIgMFoiIGZpbGw9IiNGNEI0MDAiLz48L2c+PG1hc2sgaWQ9Im1hc2sxXzE6MiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjcyIiBoZWlnaHQ9Ijk5Ij48cGF0aCBkPSJNNDQuODIzMiAwSDYuNzIzNDhDMy4wMjU1NyAwIDAgMy4wMjU1NyAwIDYuNzIzNDhWOTEuODg3NkMwIDk1LjU4NTUgMy4wMjU1NyA5OC42MTExIDYuNzIzNDggOTguNjExMUg2NC45OTM3QzY4LjY5MTYgOTguNjExMSA3MS43MTcyIDk1LjU4NTUgNzEuNzE3MiA5MS44ODc2VjI2Ljg5MzlMNDQuODIzMiAwWiIgZmlsbD0id2hpdGUiLz48L21hc2s+PGcgbWFzaz0idXJsKCNtYXNrMV8xOjIpIj48cGF0aCBkPSJNNTAuNDI2MSA0NC44MjMySDIxLjI5MUMxOS40NDIxIDQ0LjgyMzIgMTcuOTI5MyA0Ni4zMzYgMTcuOTI5MyA0OC4xODVWNzcuMzIwMUMxNy45MjkzIDc5LjE2OSAxOS40NDIxIDgwLjY4MTggMjEuMjkxIDgwLjY4MThINTAuNDI2MUM1Mi4yNzUxIDgwLjY4MTggNTMuNzg3OSA3OS4xNjkgNTMuNzg3OSA3Ny4zMjAxVjQ4LjE4NUM1My43ODc5IDQ2LjMzNiA1Mi4yNzUxIDQ0LjgyMzIgNTAuNDI2MSA0NC44MjMyWk00OS4zMDU2IDcwLjU5NjZIMjIuNDExNlY1NC45MDg1SDQ5LjMwNTZWNzAuNTk2NloiIGZpbGw9IiNGMUYxRjEiLz48L2c+PG1hc2sgaWQ9Im1hc2syXzE6MiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjcyIiBoZWlnaHQ9Ijk5Ij48cGF0aCBkPSJNNDQuODIzMiAwSDYuNzIzNDhDMy4wMjU1NyAwIDAgMy4wMjU1NyAwIDYuNzIzNDhWOTEuODg3NkMwIDk1LjU4NTUgMy4wMjU1NyA5OC42MTExIDYuNzIzNDggOTguNjExMUg2NC45OTM3QzY4LjY5MTYgOTguNjExMSA3MS43MTcyIDk1LjU4NTUgNzEuNzE3MiA5MS44ODc2VjI2Ljg5MzlMNDQuODIzMiAwWiIgZmlsbD0id2hpdGUiLz48L21hc2s+PGcgbWFzaz0idXJsKCNtYXNrMl8xOjIpIj48cGF0aCBkPSJNNDYuNzg5OSAyNC45MjczTDcxLjcxNzIgNDkuODQ5VjI2Ljg5MzlMNDYuNzg5OSAyNC45MjczWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzE6MikiLz48L2c+PG1hc2sgaWQ9Im1hc2szXzE6MiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjcyIiBoZWlnaHQ9Ijk5Ij48cGF0aCBkPSJNNDQuODIzMiAwSDYuNzIzNDhDMy4wMjU1NyAwIDAgMy4wMjU1NyAwIDYuNzIzNDhWOTEuODg3NkMwIDk1LjU4NTUgMy4wMjU1NyA5OC42MTExIDYuNzIzNDggOTguNjExMUg2NC45OTM3QzY4LjY5MTYgOTguNjExMSA3MS43MTcyIDk1LjU4NTUgNzEuNzE3MiA5MS44ODc2VjI2Ljg5MzlMNDQuODIzMiAwWiIgZmlsbD0id2hpdGUiLz48L21hc2s+PGcgbWFzaz0idXJsKCNtYXNrM18xOjIpIj48cGF0aCBkPSJNNDQuODIzMiAwVjIwLjE3MDVDNDQuODIzMiAyMy44ODUyIDQ3LjgzMiAyNi44OTM5IDUxLjU0NjcgMjYuODkzOUg3MS43MTcyTDQ0LjgyMzIgMFoiIGZpbGw9IiNGQURBODAiLz48L2c+PG1hc2sgaWQ9Im1hc2s0XzE6MiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjcyIiBoZWlnaHQ9Ijk5Ij48cGF0aCBkPSJNNDQuODIzMiAwSDYuNzIzNDhDMy4wMjU1NyAwIDAgMy4wMjU1NyAwIDYuNzIzNDhWOTEuODg3NkMwIDk1LjU4NTUgMy4wMjU1NyA5OC42MTExIDYuNzIzNDggOTguNjExMUg2NC45OTM3QzY4LjY5MTYgOTguNjExMSA3MS43MTcyIDk1LjU4NTUgNzEuNzE3MiA5MS44ODc2VjI2Ljg5MzlMNDQuODIzMiAwWiIgZmlsbD0id2hpdGUiLz48L21hc2s+PGcgbWFzaz0idXJsKCNtYXNrNF8xOjIpIj48cGF0aCBkPSJNNDQuODIzMiAwVjAuNTYwMjlMNzEuMTU2OSAyNi44OTM5SDcxLjcxNzJMNDQuODIzMiAwWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjxtYXNrIGlkPSJtYXNrNV8xOjIiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSI3MiIgaGVpZ2h0PSI5OSI+PHBhdGggZD0iTTQ0LjgyMzIgMEg2LjcyMzQ4QzMuMDI1NTcgMCAwIDMuMDI1NTcgMCA2LjcyMzQ4VjkxLjg4NzZDMCA5NS41ODU1IDMuMDI1NTcgOTguNjExMSA2LjcyMzQ4IDk4LjYxMTFINjQuOTkzN0M2OC42OTE2IDk4LjYxMTEgNzEuNzE3MiA5NS41ODU1IDcxLjcxNzIgOTEuODg3NlYyNi44OTM5TDQ0LjgyMzIgMFoiIGZpbGw9IndoaXRlIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjbWFzazVfMToyKSI+PHBhdGggZD0iTTYuNzIzNDggMEMzLjAyNTU3IDAgMCAzLjAyNTU3IDAgNi43MjM0OFY3LjI4Mzc3QzAgMy41ODU4NiAzLjAyNTU3IDAuNTYwMjkgNi43MjM0OCAwLjU2MDI5SDQ0LjgyMzJWMEg2LjcyMzQ4WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9nPjxtYXNrIGlkPSJtYXNrNl8xOjIiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSI3MiIgaGVpZ2h0PSI5OSI+PHBhdGggZD0iTTQ0LjgyMzIgMEg2LjcyMzQ4QzMuMDI1NTcgMCAwIDMuMDI1NTcgMCA2LjcyMzQ4VjkxLjg4NzZDMCA5NS41ODU1IDMuMDI1NTcgOTguNjExMSA2LjcyMzQ4IDk4LjYxMTFINjQuOTkzN0M2OC42OTE2IDk4LjYxMTEgNzEuNzE3MiA5NS41ODU1IDcxLjcxNzIgOTEuODg3NlYyNi44OTM5TDQ0LjgyMzIgMFoiIGZpbGw9IndoaXRlIi8+PC9tYXNrPjxnIG1hc2s9InVybCgjbWFzazZfMToyKSI+PHBhdGggZD0iTTY0Ljk5MzcgOTguMDUwOEg2LjcyMzQ4QzMuMDI1NTcgOTguMDUwOCAwIDk1LjAyNTMgMCA5MS4zMjczVjkxLjg4NzZDMCA5NS41ODU1IDMuMDI1NTcgOTguNjExMSA2LjcyMzQ4IDk4LjYxMTFINjQuOTkzN0M2OC42OTE2IDk4LjYxMTEgNzEuNzE3MiA5NS41ODU1IDcxLjcxNzIgOTEuODg3NlY5MS4zMjczQzcxLjcxNzIgOTUuMDI1MyA2OC42OTE2IDk4LjA1MDggNjQuOTkzNyA5OC4wNTA4WiIgZmlsbD0iI0JGMzYwQyIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L2c+PG1hc2sgaWQ9Im1hc2s3XzE6MiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjcyIiBoZWlnaHQ9Ijk5Ij48cGF0aCBkPSJNNDQuODIzMiAwSDYuNzIzNDhDMy4wMjU1NyAwIDAgMy4wMjU1NyAwIDYuNzIzNDhWOTEuODg3NkMwIDk1LjU4NTUgMy4wMjU1NyA5OC42MTExIDYuNzIzNDggOTguNjExMUg2NC45OTM3QzY4LjY5MTYgOTguNjExMSA3MS43MTcyIDk1LjU4NTUgNzEuNzE3MiA5MS44ODc2VjI2Ljg5MzlMNDQuODIzMiAwWiIgZmlsbD0id2hpdGUiLz48L21hc2s+PGcgbWFzaz0idXJsKCNtYXNrN18xOjIpIj48cGF0aCBkPSJNNTEuNTQ2NyAyNi44OTM5QzQ3LjgzMiAyNi44OTM5IDQ0LjgyMzIgMjMuODg1MiA0NC44MjMyIDIwLjE3MDVWMjAuNzMwN0M0NC44MjMyIDI0LjQ0NTUgNDcuODMyIDI3LjQ1NDIgNTEuNTQ2NyAyNy40NTQySDcxLjcxNzJWMjYuODkzOUg1MS41NDY3WiIgZmlsbD0iI0JGMzYwQyIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L2c+PHBhdGggZD0iTTQ0LjgyMzIgMEg2LjcyMzQ4QzMuMDI1NTcgMCAwIDMuMDI1NTcgMCA2LjcyMzQ4VjkxLjg4NzZDMCA5NS41ODU1IDMuMDI1NTcgOTguNjExMSA2LjcyMzQ4IDk4LjYxMTFINjQuOTkzN0M2OC42OTE2IDk4LjYxMTEgNzEuNzE3MiA5NS41ODU1IDcxLjcxNzIgOTEuODg3NlYyNi44OTM5TDQ0LjgyMzIgMFoiIGZpbGw9InVybCgjcGFpbnQxX3JhZGlhbF8xOjIpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE6MiIgeDE9IjU5LjI1NDkiIHkxPSIyNy4wNjcxIiB4Mj0iNTkuMjU0OSIgeTI9IjQ5Ljg1MjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjQkYzNjBDIiBzdG9wLW9wYWNpdHk9IjAuMiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0JGMzYwQyIgc3RvcC1vcGFjaXR5PSIwLjAyIi8+PC9saW5lYXJHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MV9yYWRpYWxfMToyIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDIuMjcyMDQgMS45NjAxKSBzY2FsZSgxMTUuNjQzKSI+PHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMC4xIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PC9zdmc+" },
  "google-meet": { light: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjIyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDYyMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzUwNzJfMzc3NSkiPjxwYXRoIGQ9Ik0zNTEuNDE5IDI1NS41NjhMNDExLjk3OCAzMjQuNzlMNDkzLjQxOCAzNzYuODI3TDUwNy41ODQgMjU2LjAwNUw0OTMuNDE4IDEzNy45MDhMNDEwLjQxOCAxODMuNjIxTDM1MS40MTkgMjU1LjU2OFoiIGZpbGw9IiMwMDgzMkQiLz48cGF0aCBkPSJNMC4wMDI4MzA1MSAzNjUuNTgzVjQ2OC41NDFDMC4wMDI4MzA1MSA0OTIuMDQ5IDE5LjA4NTEgNTExLjEzNiA0Mi41OTgzIDUxMS4xMzZIMTQ1LjU1NkwxNjYuODc2IDQzMy4zNDRMMTQ1LjU1NiAzNjUuNTgzTDc0LjkxOTggMzQ0LjI2M0wwLjAwMjgzMDUxIDM2NS41ODNaIiBmaWxsPSIjMDA2NkRBIi8+PHBhdGggZD0iTTE0NS41NTYgLTcuNjI5MzllLTA2TDAuMDAyODMwNTEgMTQ1LjU1NEw3NC45MjQ3IDE2Ni44MjJMMTQ1LjU1NiAxNDUuNTU0TDE2Ni40ODggNzguNzE0NUwxNDUuNTU2IC03LjYyOTM5ZS0wNloiIGZpbGw9IiNFOTQyMzUiLz48cGF0aCBkPSJNMC4wMDUyNjA0NyAzNjUuNjI5SDE0NS41NTZWMTQ1LjU1MUgwLjAwNTI2MDQ3VjM2NS42MjlaIiBmaWxsPSIjMjY4NEZDIi8+PHBhdGggZD0iTTU4Ni4zOTggNjEuNjI5M0w0OTMuNDE2IDEzNy45MVYzNzYuODI3TDU4Ni43ODIgNDUzLjQwNEM2MDAuNzU4IDQ2NC4zNTIgNjIxLjIwNCA0NTQuMzc0IDYyMS4yMDQgNDM2LjYwN1Y3OC4wODYxQzYyMS4yMDQgNjAuMTIyNCA2MDAuMjcxIDUwLjE5MyA1ODYuMzk2IDYxLjYzMTciIGZpbGw9IiMwMEFDNDciLz48cGF0aCBkPSJNMzUxLjQxOSAyNTUuNTY4VjM2NS41ODNIMTQ1LjU1NlY1MTEuMTM2SDQ1MC44MjVDNDc0LjMzOCA1MTEuMTM2IDQ5My40MTggNDkyLjA0OSA0OTMuNDE4IDQ2OC41NDFWMzc2LjgyN0wzNTEuNDE5IDI1NS41NjhaIiBmaWxsPSIjMDBBQzQ3Ii8+PHBhdGggZD0iTTQ1MC44MjUgLTcuNjI5MzllLTA2SDE0NS41NTZWMTQ1LjU1NEgzNTEuNDE5VjI1NS41NjhMNDkzLjQyIDEzNy45MDVWNDIuNTk3OUM0OTMuNDIgMTkuMDg0NyA0NzQuMzM4IDAuMDAyNDE4OTEgNDUwLjgyNSAwLjAwMjQxODkxIiBmaWxsPSIjRkZCQTAwIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDBfNTA3Ml8zNzc1Ij48cmVjdCB3aWR0aD0iNjIxLjIiIGhlaWdodD0iNTEyIiBmaWxsPSJ3aGl0ZSIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==" }
};
const BRAND_NAME = { slack: "Slack", notion: "Notion", "google-calendar": "Google Calendar", gmail: "Gmail", "google-drive": "Google Drive", obsidian: "Obsidian", figma: "Figma", github: "GitHub", linear: "Linear", "microsoft-word": "Microsoft Word", "microsoft-excel": "Microsoft Excel", "microsoft-powerpoint": "Microsoft PowerPoint", "microsoft-outlook": "Microsoft Outlook", "microsoft-teams": "Microsoft Teams", "microsoft-onedrive": "Microsoft OneDrive", "google-sheets": "Google Sheets", "google-slides": "Google Slides", "google-meet": "Google Meet" };
const BRAND_MARK = BRAND_LOGO;
const brandTrademarkNoteMn = "Slack, Notion, Google Calendar, Gmail, Google Drive, Google Sheets, Google Slides, Google Meet, Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Microsoft Outlook, Microsoft Teams, Microsoft OneDrive, Obsidian, Figma, GitHub, Linear нь эзэмшигчдийнхээ бүртгэлтэй барааны тэмдэг. Лого нь зөвхөн мэдээллийн эх сурвалжийг заана; түншлэл, дэмжлэгийг илэрхийлэхгүй.";
const BRAND_THEME_CSS = `.ts-brand-swap .ts-brand-d{display:none!important}:where(.dark,[data-theme=dark]) .ts-brand-swap .ts-brand-l{display:none!important}:where(.dark,[data-theme=dark]) .ts-brand-swap .ts-brand-d{display:block!important}:where(.dark,[data-theme=dark]) :where([data-theme=light]) .ts-brand-swap .ts-brand-l{display:block!important}:where(.dark,[data-theme=dark]) :where([data-theme=light]) .ts-brand-swap .ts-brand-d{display:none!important}`;
function SourceIcon({ kind, size = 16, tile = true, logo, brand }) {
  const brandKey = brand ? brand.toLowerCase().replace(/\s+/g, "-") : "";
  const found = brandKey ? BRAND_LOGO[brandKey] : void 0;
  if (found) {
    const img = (src, cls) => /* @__PURE__ */ jsx("img", { className: cls, src, alt: "", width: size, height: size, style: { width: size, height: size, objectFit: "contain", flex: "none" } });
    const logo2 = /* @__PURE__ */ jsxs("span", { className: found.dark ? "ts-brand ts-brand-swap" : "ts-brand", role: "img", "aria-label": BRAND_NAME[brandKey] ?? brand, style: { display: "inline-grid", placeItems: "center", width: size, height: size, flex: "none" }, children: [
      found.dark && /* @__PURE__ */ jsx("style", { children: BRAND_THEME_CSS }),
      img(found.light, "ts-brand-l"),
      found.dark && img(found.dark, "ts-brand-d")
    ] });
    if (!tile) return logo2;
    return /* @__PURE__ */ jsx("span", { className: "sp-tile", style: { display: "inline-grid", placeItems: "center", flex: "none", boxSizing: "border-box", width: size + 12, height: size + 12, border: "1px solid var(--ts-faint)", borderRadius: "var(--ts-radius, 6px)", background: "var(--ts-soft)" }, children: logo2 });
  }
  const glyph2 = kind === "brand" && logo ? /* @__PURE__ */ jsx("span", { className: "sp-letter", style: { display: "grid", placeItems: "center", width: size, height: size, flex: "none", overflow: "hidden" }, children: logo }) : /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", style: { strokeWidth: "var(--ts-icon-stroke,1.25)" }, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: SOURCE_ICON[kind === "brand" ? "document" : kind] });
  if (!tile) return glyph2;
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "sp-tile",
      style: { display: "inline-grid", placeItems: "center", flex: "none", boxSizing: "border-box", width: size + 12, height: size + 12, border: "1px solid var(--ts-faint)", borderRadius: "var(--ts-radius, 6px)", background: "var(--ts-soft)", color: "var(--ts-fg)" },
      "aria-hidden": "true",
      children: glyph2
    }
  );
}
function KindIcon({ source, size = 16 }) {
  return /* @__PURE__ */ jsx(SourceIcon, { kind: source.kind, size, tile: false, logo: source.logo, brand: source.brand });
}
function Marked({ text: text2, mark: mark2 }) {
  const i = mark2 ? text2.indexOf(mark2) : -1;
  if (!mark2 || i < 0) return /* @__PURE__ */ jsx(Fragment, { children: text2 });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    text2.slice(0, i),
    /* @__PURE__ */ jsx("mark", { children: mark2 }),
    text2.slice(i + mark2.length)
  ] });
}
const CSS$3 = `
.sp{position:relative;display:inline-block;font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg)}
.sp-chip{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:inherit;font-weight:500;font-size:14px;line-height:1;cursor:pointer;max-width:280px}
.sp-chip>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sp-chip:hover{border-color:var(--ts-faint)}
.sp-chip[aria-expanded="true"]{border-color:var(--ts-electric);color:var(--ts-electric-fg)}
/* Rings are box-shadows so they follow --ts-radius in every browser (older Safari draws outlines square); 1px line, keyboard only. The transparent outline stays for forced-colors mode. */
.sp-chip:focus-visible,.sp-open:focus-visible,.sp-x:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.sp-pop{position:absolute;left:0;z-index:20;width:340px;max-width:calc(100vw - 32px);padding:16px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);box-shadow:var(--ts-elevation);animation:sp-in .16s ease-out both}
.sp-pop[data-placement="bottom"]{top:calc(100% + 8px)}.sp-pop[data-placement="top"]{bottom:calc(100% + 8px)}
@keyframes sp-in{from{opacity:0;transform:translateY(4px)}}
/* Phones: the popover opens as a sheet along the bottom of the screen, full width with a 16px gutter,
   instead of hanging off the chip past the edge of a narrow column (catalog check, 390 px). */
@media (max-width:480px){.sp-pop,.sp-pop[data-placement]{position:fixed;left:16px;right:16px;bottom:16px;top:auto;width:auto;max-width:none;max-height:70vh;overflow:auto}}
@media (prefers-reduced-motion:reduce){.sp-pop{animation:none}}
.sp-head{display:grid;grid-template-columns:30px 1fr auto;gap:12px;align-items:start}
.sp-tile{display:inline-grid;place-items:center;flex:none;box-sizing:border-box;border:1px solid var(--ts-faint);border-radius:var(--ts-radius,6px);background:var(--ts-soft);color:var(--ts-fg)}
.sp-letter{display:grid;place-items:center;width:100%;height:100%;font-weight:600;font-size:12px;line-height:1}
.sp-letter img,.sp-letter svg{width:100%;height:100%;object-fit:contain}
.sp-title{font-weight:600;font-size:16px;line-height:1.3;margin:0}
.sp-meta{font:400 12px/1.4 var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint);margin-top:4px}
.sp-x{width:28px;height:28px;display:grid;place-items:center;border:0;border-radius:var(--ts-radius,6px);background:none;color:var(--ts-muted);cursor:pointer}
.sp-x:hover{background:var(--ts-soft)}
.sp-quote{margin:14px 0 0;padding:0 0 0 12px;border-left:2px solid var(--ts-line);font-weight:400;font-size:14px;line-height:1.55;color:var(--ts-muted)}
.sp-quote mark{background:var(--ts-electric-soft);color:var(--ts-fg);padding:0 2px;border-radius:2px}
.sp-foot{display:flex;justify-content:flex-end;margin-top:14px}
.sp-open{display:inline-flex;align-items:stretch;min-height:44px;border:0;border-radius:var(--ts-radius,6px);background:var(--ts-electric);color:var(--ts-on-electric);font-weight:500;font-size:14px;line-height:1;cursor:pointer;padding:0 0 0 16px}
.sp-open>em{font-style:normal;display:flex;align-items:center}
.sp-open>span{display:grid;place-items:center;width:44px;margin-left:16px;border-left:1.5px solid color-mix(in srgb,var(--ts-on-electric) 40%,transparent)}
.sp-open:hover{background:color-mix(in srgb,var(--ts-electric) 88%,var(--ts-on-electric))}
`;
function SourcePreview({
  source = demoSource,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onOpenInApp,
  placement = "bottom",
  labels: labelsIn,
  className = ""
}) {
  const labels = { ...sourcePreviewLabelsMn, ...labelsIn, kinds: { ...sourcePreviewLabelsMn.kinds, ...labelsIn?.kinds } };
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const setOpen = (v) => {
    if (openProp === void 0) setInner(v);
    onOpenChange?.(v);
  };
  const root = React.useRef(null);
  const chip = React.useRef(null);
  const popId = React.useId();
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        chip.current?.focus();
      }
    };
    const onDown = (e) => {
      if (root.current && !root.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, openProp, onOpenChange]);
  const kindText = source.kindLabel ?? labels.kinds[source.kind];
  return /* @__PURE__ */ jsxs("div", { ref: root, className: `sp ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: CSS$3 }),
    /* @__PURE__ */ jsxs("button", { ref: chip, type: "button", className: "sp-chip", "aria-expanded": open, "aria-controls": popId, onClick: () => setOpen(!open), children: [
      /* @__PURE__ */ jsx(KindIcon, { source, size: 14 }),
      /* @__PURE__ */ jsx("span", { children: source.title })
    ] }),
    open && /* @__PURE__ */ jsxs("div", { id: popId, className: "sp-pop", role: "dialog", "aria-label": source.title, "data-placement": placement, children: [
      /* @__PURE__ */ jsxs("div", { className: "sp-head", children: [
        /* @__PURE__ */ jsx(SourceIcon, { kind: source.kind, size: 18, logo: source.logo, brand: source.brand }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "sp-title", children: source.title }),
          /* @__PURE__ */ jsxs("div", { className: "sp-meta", children: [
            kindText,
            source.date ? ` · ${source.date}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "sp-x", "aria-label": labels.close, onClick: () => {
          setOpen(false);
          chip.current?.focus();
        }, children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m4 4 8 8M12 4l-8 8" }) }) })
      ] }),
      source.quote && /* @__PURE__ */ jsx("blockquote", { className: "sp-quote", children: /* @__PURE__ */ jsx(Marked, { text: source.quote, mark: source.highlight }) }),
      onOpenInApp && /* @__PURE__ */ jsx("div", { className: "sp-foot", children: /* @__PURE__ */ jsxs("button", { type: "button", className: "sp-open", onClick: () => onOpenInApp(source), children: [
        /* @__PURE__ */ jsx("em", { children: labels.open }),
        /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 8h10M9 4l4 4-4 4" }) }) })
      ] }) })
    ] })
  ] });
}
function SearchIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M12 21a9 9 0 1 1 9-9M3.5 8h17M3 13h9M12 3c-4 4-4 12 0 18M12 3c2 2 3 4 3 7" }),
        /* @__PURE__ */ jsx("circle", { cx: "17", cy: "17", r: "4" }),
        /* @__PURE__ */ jsx("path", { d: "m20 20 3 3" })
      ]
    }
  );
}
function CheckIcon() {
  return /* @__PURE__ */ jsxs("svg", { className: "thinking-check", viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "7", fill: "currentColor" }),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "m4.8 8.1 2.1 2.1 4.3-4.3",
        fill: "none",
        stroke: "white",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] });
}
function Chevron() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsx("path", { d: "m4.5 6.25 3.5 3.5 3.5-3.5" })
    }
  );
}
function SourceChip({
  source,
  index
}) {
  const tooltipId = useId();
  const tip = source.tooltip ?? source.href?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    source.icon && /* @__PURE__ */ jsx("span", { className: "thinking-source-icon", "aria-hidden": "true", children: source.icon }),
    /* @__PURE__ */ jsx("span", { className: "thinking-source-label", dir: "auto", children: source.label }),
    tip && /* @__PURE__ */ jsx("span", { id: tooltipId, role: "tooltip", className: "thinking-tooltip", children: tip })
  ] });
  const props = {
    className: "thinking-source",
    "aria-label": source.label,
    style: { "--chip-delay": `${120 + index * 160}ms` },
    "aria-describedby": tip ? tooltipId : void 0
  };
  return source.href ? /* @__PURE__ */ jsx("a", { ...props, href: source.href, target: "_blank", rel: "noopener noreferrer", children: content }) : /* @__PURE__ */ jsx("span", { ...props, tabIndex: tip ? 0 : void 0, children: content });
}
function Sources({ step }) {
  const [expanded, setExpanded] = useState(false);
  const extraId = useId();
  const sources = step.sources ?? [];
  const extra = step.moreSources ?? [];
  if (!sources.length && !extra.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "thinking-sources", children: [
    sources.map((source, i) => /* @__PURE__ */ jsx(SourceChip, { source, index: i }, `${source.label}-${i}`)),
    extra.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          id: extraId,
          className: "thinking-extra-sources",
          hidden: !expanded,
          children: expanded && extra.map((source, i) => /* @__PURE__ */ jsx(
            SourceChip,
            {
              source,
              index: i
            },
            `${source.label}-${i}`
          ))
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "thinking-source thinking-more",
          "aria-expanded": expanded,
          "aria-controls": extraId,
          style: {
            "--chip-delay": `${120 + sources.length * 160}ms`
          },
          onClick: () => setExpanded((value) => !value),
          children: expanded ? "Хураах" : `+${extra.length} бусад`
        }
      )
    ] })
  ] });
}
function ThinkingState({
  steps: steps2,
  doneLabel = "Бодож дууссан",
  stepMs = 1300,
  loop = false,
  collapseOnDone = false,
  onDone,
  workedLabel,
  className = "",
  variant = "clean",
  live,
  labels,
  doneIcon
}) {
  const isLive = live !== void 0;
  const liveDone = live?.done ?? false;
  const liveSeconds = live?.seconds ?? 0;
  const [timed, setProgress] = useState({
    visible: Math.min(1, steps2.length),
    seconds: 0,
    ms: 0,
    done: steps2.length === 0,
    cycle: 0
  });
  const [expanded, setExpanded] = useState(
    () => !(live?.done && collapseOnDone)
  );
  const bodyId = useId();
  const doneCallback = useRef(onDone);
  const autoCollapse = useRef(collapseOnDone);
  useEffect(() => {
    doneCallback.current = onDone;
    autoCollapse.current = collapseOnDone;
  }, [onDone, collapseOnDone]);
  const duration = Number.isFinite(stepMs) ? Math.max(1, stepMs) : 1300;
  useEffect(() => {
    if (isLive) return;
    let started = performance.now();
    let completedAt = null;
    let cycle = 0;
    let lastVisible = -1;
    let lastSeconds = -1;
    const tick = () => {
      const now = performance.now();
      if (completedAt !== null) {
        if (!loop || steps2.length === 0 || now - completedAt < 2600) return;
        cycle += 1;
        started = now;
        completedAt = null;
        lastVisible = -1;
        lastSeconds = -1;
        setExpanded(true);
      }
      const elapsed = now - started;
      const seconds = Math.floor(elapsed / 1e3);
      const visible = Math.min(
        steps2.length,
        Math.floor(elapsed / duration) + 1
      );
      const done = elapsed >= steps2.length * duration;
      if (visible !== lastVisible || seconds !== lastSeconds || done) {
        setProgress({ visible, seconds, ms: elapsed, done, cycle });
        lastVisible = visible;
        lastSeconds = seconds;
      }
      if (done) {
        completedAt = now;
        if (!loop || steps2.length === 0) window.clearInterval(timer);
        if (autoCollapse.current) setExpanded(false);
        doneCallback.current?.(seconds);
      }
    };
    const timer = window.setInterval(tick, 50);
    const initialTick = window.setTimeout(tick, 0);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, [steps2.length, duration, loop, isLive]);
  useEffect(() => {
    if (!isLive || !liveDone) return;
    if (autoCollapse.current) setExpanded(false);
    doneCallback.current?.(liveSeconds);
  }, [isLive, liveDone]);
  const progress = isLive ? {
    visible: steps2.length,
    seconds: liveSeconds,
    ms: liveSeconds * 1e3,
    done: liveDone,
    cycle: 0
  } : timed;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `thinking-state ${className}`.trim(),
      "data-variant": variant,
      "data-done": progress.done,
      children: [
        /* @__PURE__ */ jsx("style", { children: ".thinking-state {\n  --thinking-fg: rgb(0 0 0 / 88%);\n  --thinking-muted: rgb(0 0 0 / 61%);\n  --thinking-line: rgb(0 0 0 / 8%);\n  --thinking-dot: rgb(0 0 0 / 25%);\n  --thinking-blue: #4d80ed;\n  --thinking-chip: #fff;\n  --thinking-hover: #f4f4f5;\n  --thinking-tip: #fff;\n  --thinking-shadow: 0 0 0 .5px rgb(0 0 0 / 6%), 0 1px 1px -1px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 5%);\n  width: 100%; max-width: 440px; color: var(--thinking-fg);\n  font: 400 13px/20px Inter, InterVariable, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;\n  -webkit-font-smoothing: antialiased;\n}\n:where(.dark, [data-theme='dark']) .thinking-state,\n.thinking-state:where(.dark, [data-theme='dark']) {\n  --thinking-fg: rgb(255 255 255 / 90%);\n  --thinking-muted: rgb(255 255 255 / 62%);\n  --thinking-line: rgb(255 255 255 / 8%);\n  --thinking-dot: rgb(255 255 255 / 30%);\n  --thinking-blue: #608df4;\n  --thinking-chip: #1c1c1e;\n  --thinking-hover: #29292c;\n  --thinking-tip: #232326;\n  --thinking-shadow: 0 0 0 .5px rgb(255 255 255 / 7%), 0 1px 2px rgb(0 0 0 / 15%);\n}\n/* A light island (data-theme=light, e.g. a light AskWindow) inside a dark page keeps light colours. */\n:where(.dark, [data-theme='dark']) :where([data-theme='light'], .light) .thinking-state,\n.thinking-state:where([data-theme='light'], .light) {\n  --thinking-fg: rgb(0 0 0 / 88%);\n  --thinking-muted: rgb(0 0 0 / 61%);\n  --thinking-line: rgb(0 0 0 / 8%);\n  --thinking-dot: rgb(0 0 0 / 25%);\n  --thinking-blue: #4d80ed;\n  --thinking-chip: #fff;\n  --thinking-hover: #f4f4f5;\n  --thinking-tip: #fff;\n  --thinking-shadow: 0 0 0 .5px rgb(0 0 0 / 6%), 0 1px 1px -1px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 5%);\n}\n.thinking-state *, .thinking-state *::before, .thinking-state *::after { box-sizing: border-box; }\n.thinking-state button { font: inherit; cursor: pointer; }\n.thinking-header { display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 0 8px; border: 0; border-radius: 8px; background: none; color: inherit; text-align: start; }\n.thinking-heading { display: flex; align-items: baseline; gap: 8px; font-weight: 500; }\n.thinking-time { color: var(--thinking-muted); font-variant-numeric: tabular-nums; font-weight: 400; }\n.thinking-mark { width: 16px; height: 16px; display: grid; grid-template: repeat(3, 1fr) / repeat(3, 1fr); gap: 1.5px; padding: 1.5px; flex: none; }\n.thinking-mark i { background: var(--thinking-blue); border-radius: .5px; animation: thinking-twinkle 1.4s ease-in-out infinite; }\n[data-done='true'] .thinking-mark i { animation: none; opacity: .75; }\n.thinking-chevron { display: grid; width: 16px; height: 16px; margin-left: -4px; color: var(--thinking-muted); opacity: 0; transition: opacity .15s, transform .25s; }\n.thinking-header:hover .thinking-chevron, .thinking-header:focus-visible .thinking-chevron { opacity: 1; }\n.thinking-header[aria-expanded='false'] .thinking-chevron { transform: rotate(-90deg); }\n.thinking-body { display: grid; grid-template-rows: 1fr; transition: grid-template-rows .32s cubic-bezier(.22,1,.36,1), opacity .2s; }\n.thinking-body[data-open='false'] { grid-template-rows: 0fr; opacity: 0; }\n.thinking-clip { min-height: 0; }\n.thinking-body[data-open='false'] .thinking-clip { overflow: hidden; }\n.thinking-list { list-style: none; margin: 0; padding: 8px 8px 0; }\n.thinking-item { position: relative; display: grid; grid-template-columns: 16px minmax(0,1fr); column-gap: 10px; padding: 0 0 12px; animation: thinking-enter .52s cubic-bezier(.22,1,.36,1) both; }\n.thinking-item:not(:last-child)::before { content: ''; position: absolute; top: 22px; bottom: 2px; left: 7px; width: 2px; background: var(--thinking-line); transform-origin: top; animation: thinking-line .45s ease-out both; }\n.thinking-item[data-kind='step']::before { background: repeating-linear-gradient(to bottom, var(--thinking-line) 0 5px, transparent 5px 9px); }\n.thinking-node { display: grid; place-items: center; width: 16px; height: 20px; color: var(--thinking-muted); }\n.thinking-node svg { display: block; width: 16px; height: 16px; }\n.thinking-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--thinking-dot); }\n.thinking-item[data-active='true'] .thinking-dot { width: 6px; height: 6px; border-radius: 1px; background: var(--thinking-blue); animation: thinking-pulse 1.3s ease-in-out infinite; }\n.thinking-content { min-width: 0; }\n.thinking-label { color: var(--thinking-muted); overflow-wrap: anywhere; }\n.thinking-shimmer { background: linear-gradient(100deg,var(--thinking-muted) 20%,var(--thinking-fg) 45%,var(--thinking-muted) 70%); background-size: 250% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; animation: thinking-shimmer 2.3s linear infinite; }\n.thinking-sources { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; padding: 1px 0 2px; }\n.thinking-source { position: relative; display: inline-flex; align-items: center; gap: 6px; max-width: 100%; min-height: 26px; padding: 0 8px 0 6px; border: 0; border-radius: 6px; color: var(--thinking-fg); background: var(--thinking-chip); box-shadow: var(--thinking-shadow); font: 400 12px/16px Inter, InterVariable, ui-sans-serif, system-ui, sans-serif; text-decoration: none; animation: thinking-chip .42s cubic-bezier(.22,1,.36,1) var(--chip-delay,0ms) both; transition: background .15s; }\n.thinking-source:hover, .thinking-source:focus-visible { background: var(--thinking-hover); z-index: 2; }\n.thinking-source-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.thinking-source-icon { display: grid; place-items: center; width: 14px; height: 14px; border-radius: 4px; overflow: hidden; flex: none; }\n.thinking-source-icon svg, .thinking-source-icon img { width: 100%; height: 100%; display: block; }\n.thinking-tooltip { position: absolute; bottom: calc(100% + 8px); left: 0; z-index: 5; max-width: min(300px,75vw); width: max-content; padding: 4px 8px; border-radius: 6px; box-shadow: var(--thinking-shadow), 0 4px 16px rgb(0 0 0 / 8%); background: var(--thinking-tip); color: var(--thinking-muted); opacity: 0; visibility: hidden; transform: translateY(3px); transition: .15s; pointer-events: none; overflow-wrap: anywhere; }\n.thinking-source:hover .thinking-tooltip, .thinking-source:focus-visible .thinking-tooltip { opacity: 1; visibility: visible; transform: translateY(0); }\n.thinking-state .thinking-more { background: transparent; box-shadow: inset 0 0 0 .5px var(--thinking-line); color: var(--thinking-muted); font-size: 12px; line-height: 16px; padding: 0 8px; }\n.thinking-state .thinking-more:hover, .thinking-state .thinking-more[aria-expanded='true'] { background: var(--thinking-line); color: var(--thinking-fg); }\n.thinking-extra-sources { display: contents; }\n.thinking-extra-sources[hidden] { display: none; }\n.thinking-finished { color: var(--thinking-fg); }\n.thinking-node .thinking-check { color: var(--thinking-blue); animation: thinking-check-in .46s cubic-bezier(.34,1.56,.64,1) both; }\n.thinking-check path { stroke-dasharray: 10; stroke-dashoffset: 10; animation: thinking-tick .3s .18s ease-out forwards; }\n.thinking-state :focus-visible { outline: 2px solid var(--thinking-blue); outline-offset: 3px; }\n.thinking-state[data-variant='classic'] { font-size: 14px; }\n[data-variant='classic'] .thinking-mark { display: none; }\n[data-variant='classic'] .thinking-chevron { order: -1; margin: 0; opacity: 1; }\n[data-variant='classic'] .thinking-heading { font-weight: 400; color: var(--thinking-muted); }\n[data-variant='classic'] .thinking-item { column-gap: 14px; }\n[data-variant='classic'] .thinking-dot { width: 7px; height: 7px; }\n[data-variant='classic'] .thinking-source { font-size: 13px; min-height: 28px; background: var(--thinking-line); box-shadow: none; }\n[data-variant='classic'] .thinking-more { background: transparent; }\n[data-variant='classic'] .thinking-item[data-kind='step']::before { background: var(--thinking-line); }\n@keyframes thinking-enter { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }\n@keyframes thinking-chip { from { opacity: 0; transform: translateY(4px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }\n@keyframes thinking-twinkle { 0%,100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1); } }\n@keyframes thinking-pulse { 0%,100% { opacity: .45; box-shadow: 0 0 0 0 transparent; } 50% { opacity: 1; box-shadow: 0 0 0 3px color-mix(in srgb,var(--thinking-blue) 12%,transparent); } }\n@keyframes thinking-shimmer { from { background-position: 180% 0; } to { background-position: -80% 0; } }\n@keyframes thinking-line { from { transform: scaleY(0); } to { transform: scaleY(1); } }\n@keyframes thinking-check-in { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }\n@keyframes thinking-tick { to { stroke-dashoffset: 0; } }\n@media (pointer: coarse) { .thinking-header { min-height: 44px; } .thinking-source { min-height: 32px; } }\n@media (prefers-reduced-motion: reduce) {\n  .thinking-state *, .thinking-state *::before { animation: none !important; transition: none !important; }\n  .thinking-shimmer { background: none; color: var(--thinking-muted); }\n  .thinking-check path { stroke-dashoffset: 0; }\n}\n" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "thinking-header",
            "aria-expanded": expanded,
            "aria-controls": bodyId,
            onClick: () => setExpanded((value) => !value),
            children: [
              /* @__PURE__ */ jsx("span", { className: "thinking-mark", "aria-hidden": "true", children: Array.from({ length: 9 }, (_, i) => /* @__PURE__ */ jsx(
                "i",
                {
                  style: {
                    animationDelay: `${(Math.floor(i / 3) + i % 3) * 120}ms`
                  }
                },
                i
              )) }),
              /* @__PURE__ */ jsx("span", { className: "thinking-heading", children: progress.done ? (typeof workedLabel === "function" ? workedLabel(progress.ms) : workedLabel) ?? labels?.worked?.(progress.seconds) ?? `${progress.seconds} с ажилласан` : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "thinking-shimmer", children: labels?.thinking ?? "Бодож байна" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "thinking-time", children: labels?.time?.(progress.seconds) ?? `${progress.seconds} с` })
              ] }) }),
              /* @__PURE__ */ jsx("span", { className: "thinking-chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx(Chevron, {}) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            id: bodyId,
            className: "thinking-body",
            "data-open": expanded,
            inert: !expanded,
            "aria-hidden": !expanded,
            children: /* @__PURE__ */ jsx("div", { className: "thinking-clip", children: /* @__PURE__ */ jsxs(
              "ol",
              {
                className: "thinking-list",
                "aria-live": "polite",
                "aria-relevant": "additions text",
                children: [
                  steps2.slice(0, progress.visible).map((step, i) => {
                    const active = !progress.done && i === progress.visible - 1;
                    const label = !active ? step.completedLabel ?? (step.kind === "search" && (step.label === "Searching" || step.label === "Хайж байна") ? "Хайсан" : step.label) : step.label;
                    return /* @__PURE__ */ jsxs(
                      "li",
                      {
                        className: "thinking-item",
                        "data-active": active,
                        "data-kind": step.kind,
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "thinking-node", "aria-hidden": "true", children: step.kind === "search" ? /* @__PURE__ */ jsx(SearchIcon, {}) : /* @__PURE__ */ jsx("span", { className: "thinking-dot" }) }),
                          /* @__PURE__ */ jsxs("div", { className: "thinking-content", children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `thinking-label${active ? " thinking-shimmer" : ""}`,
                                dir: "auto",
                                children: label
                              }
                            ),
                            /* @__PURE__ */ jsx(Sources, { step })
                          ] })
                        ]
                      },
                      i
                    );
                  }),
                  progress.done && /* @__PURE__ */ jsxs("li", { className: "thinking-item thinking-finished", children: [
                    /* @__PURE__ */ jsx("span", { className: "thinking-node", "aria-hidden": "true", children: doneIcon ?? /* @__PURE__ */ jsx(CheckIcon, {}) }),
                    /* @__PURE__ */ jsx("span", { children: doneLabel })
                  ] })
                ]
              },
              progress.cycle
            ) })
          }
        )
      ]
    }
  );
}
const askWindowLabelsMn = {
  title: "Second Brain",
  send: "Асуух",
  placeholder: "Тархинаасаа асуу…",
  chats: "Тархины чатууд",
  newChat: "Шинэ чат",
  brain: "Тархи",
  pagesRead: (n) => `${n} хуудас уншсан`
};
const askNavMn = [
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "today", label: "Өнөөдөр", icon: "today" },
  { id: "projects", label: "Төслүүд", icon: "projects" },
  { id: "areas", label: "Хүрээ", icon: "areas" },
  { id: "resources", label: "Нөөц", icon: "resources" },
  { id: "agents", label: "Агентууд", icon: "agents" }
];
const I = (d, size) => /* @__PURE__ */ jsx("svg", { width: size ?? 14, height: size ?? 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { width: size ?? "var(--ts-icon-size,14px)", height: size ?? "var(--ts-icon-size,14px)", strokeWidth: "var(--ts-icon-stroke,1.25)" }, children: d });
const NAV_ICON = {
  inbox: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M22 12h-6l-2 3h-4l-2-3H2" }),
    /* @__PURE__ */ jsx("path", { d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" })
  ] })),
  today: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" })
  ] })),
  projects: I(/* @__PURE__ */ jsx("path", { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" })),
  areas: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "1" })
  ] })),
  resources: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M12 7v14" }),
    /* @__PURE__ */ jsx("path", { d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" })
  ] })),
  agents: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M12 8V4H8" }),
    /* @__PURE__ */ jsx("rect", { x: "4", y: "8", width: "16", height: "12", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M2 14h2M20 14h2M15 13v2M9 13v2" })
  ] }))
};
const chatIcon = I(/* @__PURE__ */ jsx("path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }), 14);
const newIcon = I(/* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
  /* @__PURE__ */ jsx("path", { d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" })
] }), 14);
const upIcon = I(/* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "m5 12 7-7 7 7" }),
  /* @__PURE__ */ jsx("path", { d: "M12 19V5" })
] }), 16);
const CSS$2 = `
.aw{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;line-height:1.5;font-weight:400;background:var(--ts-surface);color:var(--ts-fg);border:1px solid color-mix(in srgb,var(--ts-line) 80%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);box-shadow:0 1px 2px rgb(8 12 40/.06),0 24px 56px -24px rgb(8 12 40/.45);overflow:hidden;container-type:inline-size;max-width:720px}
.aw *{box-sizing:border-box}
.aw-bar{display:flex;align-items:center;gap:10px;height:28px;padding:0 10px;border-bottom:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);background:var(--ts-soft)}
.aw-dots{display:flex;gap:5px}.aw-dots i{width:8px;height:8px;border-radius:50%;background:color-mix(in srgb,var(--ts-faint) 35%,transparent)}
.aw-title{flex:1;text-align:center;font-weight:500;font-size:12px;color:var(--ts-faint);margin-right:34px}
.aw-split{display:flex;height:400px}
.aw-side{width:164px;flex:none;border-right:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);background:var(--ts-soft);padding:var(--ts-space-2,8px);display:flex;flex-direction:column;gap:1px;overflow:hidden}
.aw-ws{display:flex;align-items:center;gap:var(--ts-space-2,8px);padding:2px 0 var(--ts-space-2,8px)}
.aw-ws b{width:22px;height:22px;border-radius:var(--ts-radius,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:11px;font-weight:600;flex:none}
.aw-ws span{display:flex;flex-direction:column;line-height:1.25;min-width:0}
.aw-ws strong{font-weight:500;font-size:13px}
.aw-ws small{font-size:11px;color:var(--ts-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aw-item{position:relative;display:flex;align-items:center;gap:6px;height:26px;padding:0 6px;border:0;border-radius:var(--ts-radius,6px);background:none;font:inherit;font-size:13px;color:var(--ts-muted);text-align:left;cursor:pointer;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aw-item svg{flex:none;color:var(--ts-faint)}
.aw-item:hover{background:color-mix(in srgb,var(--ts-fg) 6%,transparent);color:var(--ts-fg)}
.aw-item[aria-current="true"]{background:color-mix(in srgb,var(--ts-fg) 8%,transparent);color:var(--ts-fg);font-weight:500}
.aw-item[aria-current="true"] svg{color:var(--ts-electric-fg)}
.aw-item small{margin-left:auto;font-size:11px;color:var(--ts-faint)}
.aw-item>span{overflow:hidden;text-overflow:ellipsis}
.aw-side h6{font-weight:500;font-size:11px;color:var(--ts-faint);margin:var(--ts-space-3,12px) 6px 2px}
.aw-new{color:var(--ts-fg)}
/* Compact controls keep a 44px hit area through an invisible halo. */
.aw-item::after,.aw-send::after,.aw .sp-chip::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}
.aw-main{flex:1;min-width:0;display:flex;flex-direction:column}
.aw-thread{flex:1;min-height:0;overflow:auto;padding:18px 28px 8px;display:flex;flex-direction:column;gap:14px}
.aw-q{align-self:flex-end;max-width:82%;padding:7px 12px;border-radius:calc(var(--ts-radius,6px) + 4px);background:color-mix(in srgb,var(--ts-fg) 6%,transparent);font-size:13px}
.aw-chips{position:relative;display:flex;flex-wrap:wrap;gap:6px}
.aw .sp-chip{position:relative;min-height:24px;height:24px;padding:0 8px;font-size:12px;border-color:color-mix(in srgb,var(--ts-line) 80%,transparent);background:transparent}
.aw .sp-chip svg{width:12px;height:12px}
.aw .sp-pop{width:280px;padding:12px}.aw .sp-title{font-size:13px}.aw .sp-quote{margin-top:10px;font-size:13px}.aw .sp-foot{margin-top:10px}
.aw .sp-open{position:relative;min-height:30px;font-size:12px}.aw .sp-open>span{width:30px}
.aw .sp-open::after,.aw .sp-x::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}.aw .sp-x{position:relative}
.aw .ca{max-width:none;border:0;box-shadow:none;background:transparent;font:400 15px/1.6 var(--ts-font,Inter,system-ui,sans-serif)}
.aw .ca-body{padding:0}
.aw .ca-head{font:400 11px var(--ts-font,Inter,sans-serif);color:var(--ts-faint);margin-bottom:6px}
.aw .ca-chips,.aw .ca-foot{display:none}
.aw-compose{margin:8px 20px 16px;display:flex;align-items:flex-end;gap:8px;padding:8px 8px 8px 12px;border:1px solid color-mix(in srgb,var(--ts-line) 90%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);background:var(--ts-page);box-shadow:0 1px 2px rgb(8 12 40/.05)}
.aw-compose:focus-within{border-color:var(--ts-faint)}
.aw-compose input{flex:1;min-width:0;height:26px;border:0;background:none;outline:0;font:inherit;font-size:13px;color:var(--ts-fg)}
.aw-compose input::placeholder{color:var(--ts-faint)}
.aw-send{position:relative;display:grid;place-items:center;flex:none;width:26px;height:26px;border:0;border-radius:var(--ts-radius,6px);background:var(--ts-electric);color:var(--ts-on-electric);cursor:pointer}
.aw-send:focus-visible,.aw-item:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.aw .ts-think,.aw [class*="thinking"]{font-size:13px}
.aw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.aw-in{animation:aw-in ${motionVar.duration("md")} ${motionVar.easing("enter")} both}
.aw-chips .aw-in{animation-delay:calc(var(--i,0) * ${LOOP.stagger}ms)}
@keyframes aw-in{from{opacity:0;transform:translateY(4px)}}
.aw-q.aw-typing::after{content:"";display:inline-block;width:1px;height:1em;margin-left:2px;vertical-align:-2px;background:currentColor;animation:aw-caret 1s steps(1) infinite}
@keyframes aw-caret{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.aw-in,.aw-q.aw-typing::after{animation:none}}
@container (max-width:560px){.aw-side{display:none}.aw-thread{padding:14px 14px 6px}.aw-compose{margin:6px 10px 10px}.aw .sp{position:static}.aw .sp-pop{left:0;right:0;width:auto;max-width:none}}
`;
function AskWindow({
  question,
  answer,
  sources,
  workspace,
  nav = askNavMn,
  chats = [],
  activeChat,
  theme = "light",
  openSource,
  sidebar = true,
  onAsk,
  onOpenSource,
  onNavigate,
  thinking = [],
  play = "auto",
  phase,
  onPhase,
  labels: labelsIn,
  className = ""
}) {
  const labels = { ...askWindowLabelsMn, ...labelsIn };
  const [text2, setText] = React.useState("");
  const [focus, setFocus] = React.useState(openSource ?? null);
  const frames = React.useMemo(() => {
    const out = [];
    const T = thinking.length, C = sources.length, A = answer.length;
    out.push({ state: { phase: "ask", typed: 0.45, steps: 0, chips: 0, segs: 0 }, hold: 260 });
    out.push({ state: { phase: "ask", typed: 1, steps: 0, chips: 0, segs: 0 }, hold: 420 });
    for (let i = 1; i <= T; i++) out.push({ state: { phase: "think", typed: 1, steps: i, chips: 0, segs: 0 }, hold: 650 });
    out.push({ state: { phase: "sources", typed: 1, steps: T, chips: C, segs: 0 }, hold: 300 + C * 140 });
    for (let i = 1; i <= A; i++) out.push({ state: { phase: "answer", typed: 1, steps: T, chips: C, segs: i }, hold: 480 });
    out.push({ state: { phase: "done", typed: 1, steps: T, chips: C, segs: A }, hold: 1e3 });
    return out;
  }, [thinking.length, sources.length, answer.length]);
  const run = useScenario(frames, { loops: 1, rest: 0 });
  const finished = React.useRef(false);
  const finishedFor = React.useRef(frames);
  if (finishedFor.current !== frames) {
    finishedFor.current = frames;
    finished.current = false;
  }
  const last = frames[frames.length - 1].state;
  if (run.state?.phase === "done") finished.current = true;
  const frozen = phase ? [...frames].reverse().find((x) => x.state.phase === phase)?.state : void 0;
  const f = frozen ?? (play === "static" || run.loopState === "paused" || finished.current ? last : run.state ?? last);
  const animate = f !== last || run.playing;
  const onPhaseRef = React.useRef(onPhase);
  onPhaseRef.current = onPhase;
  React.useEffect(() => {
    onPhaseRef.current?.(f.phase);
  }, [f.phase]);
  const shownQuestion = f.typed >= 1 ? question : question.slice(0, Math.ceil(question.length * f.typed));
  const [current, setCurrent] = React.useState(activeChat ?? chats[0]?.id);
  const dark = theme === "dark";
  const cited = sources.map((s) => ({ id: s.id, title: s.title, site: s.label, date: s.date, quote: s.quote, highlight: s.highlight, icon: /* @__PURE__ */ jsx(SourceIcon, { kind: s.kind, size: 12, tile: false, logo: s.logo, brand: s.brand }) }));
  const preview = (s) => ({ id: s.id, title: s.title, kind: s.kind, kindLabel: s.label, date: s.date, quote: s.quote, highlight: s.highlight, logo: s.logo, brand: s.brand });
  const submit = (e) => {
    e.preventDefault();
    if (text2.trim()) {
      onAsk?.(text2.trim());
      setText("");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `aw ${dark ? "dark" : ""} ${className}`, "data-ts-theme": dark ? "dark" : "cream", "data-theme": dark ? "dark" : "light", children: [
    /* @__PURE__ */ jsx("style", { children: CSS$2 }),
    /* @__PURE__ */ jsxs("div", { className: "aw-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "aw-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {})
      ] }),
      /* @__PURE__ */ jsx("span", { className: "aw-title", children: labels.title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "aw-split", children: [
      sidebar && /* @__PURE__ */ jsxs("nav", { className: "aw-side", "aria-label": labels.title, children: [
        workspace && /* @__PURE__ */ jsxs("div", { className: "aw-ws", children: [
          /* @__PURE__ */ jsx("b", { "aria-hidden": "true", children: workspace.name.slice(0, 1) }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: workspace.name }),
            /* @__PURE__ */ jsx("small", { children: workspace.note ? `${labels.brain} · ${workspace.note}` : labels.brain })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "aw-item aw-new", onClick: () => onNavigate?.("new"), children: [
          newIcon,
          /* @__PURE__ */ jsx("span", { children: labels.newChat })
        ] }),
        nav.map((n) => /* @__PURE__ */ jsxs("button", { type: "button", className: "aw-item", onClick: () => onNavigate?.(n.id), children: [
          NAV_ICON[n.icon],
          /* @__PURE__ */ jsx("span", { children: n.label }),
          n.count != null && /* @__PURE__ */ jsx("small", { children: n.count })
        ] }, n.id)),
        chats.length > 0 && /* @__PURE__ */ jsx("h6", { children: labels.chats }),
        chats.map((c) => /* @__PURE__ */ jsxs("button", { type: "button", className: "aw-item", "aria-current": current === c.id, onClick: () => {
          setCurrent(c.id);
          onNavigate?.(`chat:${c.id}`);
        }, children: [
          chatIcon,
          /* @__PURE__ */ jsx("span", { children: c.title })
        ] }, c.id))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "aw-main", children: [
        /* @__PURE__ */ jsxs("div", { className: "aw-thread", ref: run.ref, ...run.attrs, "data-phase": f.phase, children: [
          /* @__PURE__ */ jsxs("div", { className: `aw-q ${f.typed < 1 ? "aw-typing" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": f.typed < 1, children: shownQuestion }),
            f.typed < 1 && /* @__PURE__ */ jsx("span", { className: "aw-sr", children: question })
          ] }),
          thinking.length > 0 && f.steps > 0 && /* @__PURE__ */ jsx("div", { className: animate ? "aw-in" : void 0, children: /* @__PURE__ */ jsx(ThinkingState, { steps: thinking.slice(0, f.steps), live: { done: f.phase !== "think", seconds: f.steps }, collapseOnDone: true, workedLabel: (ms) => `Бодсон ${Math.max(1, Math.round(ms / 1e3))} с` }) }),
          f.chips > 0 && /* @__PURE__ */ jsx("div", { className: "aw-chips", children: sources.slice(0, f.chips).map((s, i) => /* @__PURE__ */ jsx("span", { className: animate ? "aw-in" : void 0, style: { ["--i"]: i }, children: /* @__PURE__ */ jsx(
            SourcePreview,
            {
              source: preview(s),
              open: focus === s.id,
              onOpenChange: (o) => setFocus(o ? s.id : null),
              onOpenInApp: onOpenSource ? () => onOpenSource(s) : void 0
            }
          ) }, s.id)) }),
          f.segs > 0 && /* @__PURE__ */ jsx("div", { "aria-live": "polite", "aria-busy": f.phase !== "done", children: /* @__PURE__ */ jsx(CitedAnswer, { theme, segments: answer.slice(0, f.segs), sources: cited, pagesRead: sources.length }) })
        ] }),
        /* @__PURE__ */ jsxs("form", { className: "aw-compose", onSubmit: submit, children: [
          /* @__PURE__ */ jsx("input", { value: text2, onChange: (e) => setText(e.target.value), placeholder: labels.placeholder, "aria-label": labels.placeholder }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "aw-send", "aria-label": labels.send, children: upIcon })
        ] })
      ] })
    ] })
  ] });
}
const askWindowDemoNote = "ac.me — жишээ өгөгдөл, бодит харилцагч биш";
const askWindowMicroMn = [
  "санах ой хайж байна…",
  "шийдвэр олдлоо · Үнийн бодлого",
  "уулзалтын тэмдэглэл · 10-р сар",
  "Slack · хэлэлцүүлэг холбогдлоо",
  "эх сурвалж нэгтгэж байна…",
  "хариу бэлэн"
];
const askWindowDemo = {
  question: "Өнгөрсөн сард үнийн талаар ямар шийдвэр гаргасан бэ?",
  workspace: { name: "ACME", note: "демо" },
  nav: askNavMn.map((n) => n.id === "inbox" ? { ...n, count: 4 } : n),
  chats: [
    { id: "price", title: "Үнийн бодлого" },
    { id: "stock", title: "Нийлүүлэлтийн хоцролт" },
    { id: "onb", title: "Шинэ ажилтны чиглүүлэг" }
  ],
  activeChat: "price",
  thinking: [
    { kind: "search", label: "санах ой хайж байна…", completedLabel: "3 эх сурвалж", sources: [{ label: "Шийдвэр" }, { label: "Уулзалт" }, { label: "Slack" }] },
    { kind: "step", label: "эх сурвалж нэгтгэж байна…", completedLabel: "хариу бэлэн" }
  ],
  answer: [
    { text: "Үнийн шинэчлэлийг 10-р сарын багийн уулзалтаар шийдсэн.", cite: ["m"] },
    { text: " Шалтгааныг Slack дээрх хэлэлцүүлэгт,", cite: ["s"] },
    { text: " эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичсэн.", cite: ["d"] }
  ],
  sources: [
    { id: "d", kind: "decision", brand: "notion", title: "Үнийн бодлого", label: "Шийдвэр", date: "2026.10", quote: "Үнийг шинэчлэхээр шийдэв. Шалтгаан: зардал өссөн, өрсөлдөгчдийн үнэ өөрчлөгдсөн. Хэрэгжүүлэх: дараагийн улирлаас. Эзэн: борлуулалтын баг.", highlight: "Үнийг шинэчлэхээр шийдэв." },
    { id: "m", kind: "meeting", brand: "google-calendar", title: "Багийн уулзалт · 10-р сар", label: "Уулзалтын тэмдэглэл", date: "2026.10", quote: "Үнийн хоёр хувилбарыг харьцуулав. Харилцагчдад урьдчилан мэдэгдэхээр тохирлоо. Эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичнэ.", highlight: "урьдчилан мэдэгдэхээр" },
    { id: "s", kind: "message", brand: "slack", title: "#sales · үнийн хэлэлцүүлэг", label: "Slack thread", date: "2026.10", quote: "Зардал өссөнийг санхүүгийн баг мэдэгдэв. Борлуулалтын баг харилцагчийн хариуг хуваалцав. Уулзалтаар шийдэхээр тохирлоо.", highlight: "Зардал өссөнийг" }
  ]
};
const ico = (d) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: "dt-ico", children: /* @__PURE__ */ jsx("path", { d }) });
const defaultColumns = [
  { key: "tool", label: "Хэрэгсэл", type: "title", icon: ico("M3 4.5h10M3 8h10M3 11.5h6"), width: "34%" },
  {
    key: "category",
    label: "Ангилал",
    type: "tag",
    icon: ico("M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z"),
    options: ["Дизайн", "Ажил хянах", "Байршуулалт", "Вэб сайт", "Видео"],
    width: "25%"
  },
  {
    key: "website",
    label: "Холбоос",
    type: "link",
    icon: ico("M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1"),
    width: "20%"
  },
  { key: "renews", label: "Сунгах", type: "text", icon: ico("M3 4.5h10v8.5H3zM3 7h10M6 3v2.5M10 3v2.5") }
];
const mark = (ch, fill) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("rect", { x: "1", y: "1", width: "14", height: "14", rx: "4", fill }),
  /* @__PURE__ */ jsx("text", { x: "8", y: "11.5", textAnchor: "middle", fontSize: "9.5", fontWeight: "600", fill: "#fff", fontFamily: "Inter,system-ui,sans-serif", children: ch })
] });
const defaultRows = [
  { id: "design", logo: mark("Д", "#8b5cf6"), tool: "Дизайны файл", category: "Дизайн", website: "design.example.mn", renews: "2026.03.12" },
  { id: "tasks", logo: mark("А", "#5e6ad2"), tool: "Ажлын самбар", category: "Ажил хянах", website: "tasks.example.mn", renews: "2026.01.04" },
  { id: "cloud", logo: mark("Ү", "#52525b"), tool: "Үүлэн сервер", category: "Байршуулалт", website: "cloud.example.mn", renews: "2026.08.21" },
  { id: "site", logo: mark("В", "#db2777"), tool: "Вэб бүтээгч", category: "Вэб сайт", website: "site.example.mn", renews: "2026.05.02" },
  { id: "video", logo: mark("Б", "#16a34a"), tool: "Бичлэгийн сан", category: "Видео", website: "video.example.mn", renews: "2026.11.18" }
];
const defaultTones = {
  Дизайн: "violet",
  "Ажил хянах": "blue",
  Байршуулалт: "gray",
  "Вэб сайт": "pink",
  Видео: "green"
};
const numberFormat = (n) => new Intl.NumberFormat("en-US").format(n).replace("-", "−");
const text = (v) => v == null ? "" : String(v);
function DataTable({
  title = "Багийн хэрэгслүүд",
  icon,
  columns = defaultColumns,
  rows: initialRows = defaultRows,
  tagTones = defaultTones,
  editable = true,
  onRowsChange,
  onSelectionChange,
  className = ""
}) {
  const [rows, setRows] = React.useState(initialRows);
  const [past, setPast] = React.useState([]);
  const [future, setFuture] = React.useState([]);
  const [checked, setChecked] = React.useState([]);
  const [active, setActive] = React.useState(null);
  const [anchor, setAnchor] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [sort, setSort] = React.useState(null);
  const grid = React.useRef(null);
  const counter = React.useRef(0);
  const view = React.useMemo(() => {
    if (!sort) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return text(x).localeCompare(text(y), void 0, { numeric: true }) * dir;
    });
  }, [rows, sort]);
  const commit = (next) => {
    setPast((p) => [...p.slice(-99), rows]);
    setFuture([]);
    setRows(next);
    onRowsChange?.(next);
  };
  const undo = () => {
    const prev = past.at(-1);
    if (!prev) return;
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [rows, ...f]);
    setRows(prev);
    onRowsChange?.(prev);
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, rows]);
    setRows(next);
    onRowsChange?.(next);
  };
  const setCells = (cells) => {
    if (!editable) return;
    const byId = new Map(rows.map((row) => [row.id, { ...row }]));
    for (const { r, c, value } of cells) {
      const row = view[r], col = columns[c];
      if (!row || !col || col.editable === false) continue;
      const target = byId.get(row.id);
      target[col.key] = col.type === "number" && value.trim() !== "" && !isNaN(+value.replace(/[,−]/g, (m) => m === "−" ? "-" : "")) ? +value.replace(/[,−]/g, (m) => m === "−" ? "-" : "") : value;
    }
    commit(rows.map((row) => byId.get(row.id)));
  };
  const range = React.useMemo(() => {
    if (!active) return null;
    const a = anchor ?? active;
    return {
      r0: Math.min(a.r, active.r),
      r1: Math.max(a.r, active.r),
      c0: Math.min(a.c, active.c),
      c1: Math.max(a.c, active.c)
    };
  }, [active, anchor]);
  const inRange = (r, c) => !!range && r >= range.r0 && r <= range.r1 && c >= range.c0 && c <= range.c1;
  const toggleRow = (id) => {
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
    setChecked(next);
    onSelectionChange?.(next);
  };
  const toggleAll = () => {
    const next = checked.length === rows.length ? [] : rows.map((r) => r.id);
    setChecked(next);
    onSelectionChange?.(next);
  };
  const startEdit = (pos, value) => {
    const col = columns[pos.c];
    if (!editable || col.editable === false) return;
    setEditing({ pos, value: value ?? text(view[pos.r]?.[col.key]) });
  };
  const finishEdit = (save, move = 0) => {
    if (!editing) return;
    if (save) setCells([{ ...editing.pos, value: editing.value }]);
    const pos = { r: Math.min(view.length - 1, editing.pos.r + move), c: editing.pos.c };
    setEditing(null);
    setActive(pos);
    setAnchor(null);
    requestAnimationFrame(() => grid.current?.focus());
  };
  const addRow = () => {
    counter.current += 1;
    const row = { id: `row-${Date.now()}-${counter.current}` };
    columns.forEach((c) => row[c.key] = "");
    commit([...rows, row]);
    const pos = { r: view.length, c: 0 };
    setActive(pos);
    setAnchor(null);
    setSort(null);
    setTimeout(() => setEditing({ pos, value: "" }));
  };
  const selectionText = () => {
    if (!range) return "";
    const lines = [];
    for (let r = range.r0; r <= range.r1; r++) {
      const cells = [];
      for (let c = range.c0; c <= range.c1; c++) cells.push(text(view[r]?.[columns[c].key]));
      lines.push(cells.join("	"));
    }
    return lines.join("\n");
  };
  const clearRange = () => {
    if (!range) return;
    const cells = [];
    for (let r = range.r0; r <= range.r1; r++)
      for (let c = range.c0; c <= range.c1; c++) cells.push({ r, c, value: "" });
    setCells(cells);
  };
  const onKey = (e) => {
    if (editing) return;
    const mod = e.metaKey || e.ctrlKey;
    const lastR = view.length - 1, lastC = columns.length - 1;
    if (mod && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && e.key.toLowerCase() === "a") {
      e.preventDefault();
      setAnchor({ r: 0, c: 0 });
      setActive({ r: lastR, c: lastC });
      return;
    }
    if (!active) {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        setActive({ r: 0, c: 0 });
      }
      return;
    }
    const move = (r, c) => {
      const next = { r: Math.max(0, Math.min(lastR, r)), c: Math.max(0, Math.min(lastC, c)) };
      if (e.shiftKey) setAnchor((a) => a ?? active);
      else setAnchor(null);
      setActive(next);
    };
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        return move(mod ? 0 : active.r - 1, active.c);
      case "ArrowDown":
        e.preventDefault();
        return move(mod ? lastR : active.r + 1, active.c);
      case "ArrowLeft":
        e.preventDefault();
        return move(active.r, mod ? 0 : active.c - 1);
      case "ArrowRight":
        e.preventDefault();
        return move(active.r, mod ? lastC : active.c + 1);
      case "Tab": {
        e.preventDefault();
        setAnchor(null);
        const i = active.r * columns.length + active.c + (e.shiftKey ? -1 : 1);
        const clamped = Math.max(0, Math.min(view.length * columns.length - 1, i));
        setActive({ r: Math.floor(clamped / columns.length), c: clamped % columns.length });
        return;
      }
      case "Enter":
      case "F2":
        e.preventDefault();
        return startEdit(active);
      case "Escape":
        return setAnchor(null);
      case "Delete":
      case "Backspace":
        e.preventDefault();
        return clearRange();
    }
    if (e.key.length === 1 && !mod && !e.altKey) {
      e.preventDefault();
      startEdit(active, e.key);
    }
  };
  const onCopy = (e, cut = false) => {
    if (editing || !range) return;
    e.preventDefault();
    e.clipboardData.setData("text/plain", selectionText());
    if (cut) clearRange();
  };
  const onPaste = (e) => {
    if (editing || !active || !editable) return;
    e.preventDefault();
    const data = e.clipboardData.getData("text/plain").replace(/\r/g, "").replace(/\n$/, "");
    const cells = [];
    data.split("\n").forEach(
      (line, dr) => line.split("	").forEach((value, dc) => cells.push({ r: active.r + dr, c: active.c + dc, value }))
    );
    setCells(cells);
  };
  const header = (col) => {
    const dir = sort?.key === col.key ? sort.dir : null;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "dt-sort",
        "aria-label": `Эрэмбэлэх: ${col.label}${dir ? `, ${dir === "asc" ? "өсөхөөр" : "буурахаар"} эрэмбэлсэн` : ""}`,
        onClick: () => setSort(dir === null ? { key: col.key, dir: "asc" } : dir === "asc" ? { key: col.key, dir: "desc" } : null),
        children: [
          col.icon,
          col.label,
          dir && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: `dt-arrow ${dir}`, children: /* @__PURE__ */ jsx("path", { d: "M8 3.5v9M4.5 9 8 12.5 11.5 9" }) })
        ]
      }
    );
  };
  const cellContent = (row, col) => {
    const value = row[col.key];
    if (col.type === "title")
      return /* @__PURE__ */ jsxs("span", { className: "dt-title", children: [
        row.logo && /* @__PURE__ */ jsx("span", { className: "dt-logo", children: row.logo }),
        text(value)
      ] });
    if (col.type === "tag")
      return value ? /* @__PURE__ */ jsx("span", { className: `dt-tag ${tagTones[text(value)] ?? "gray"}`, children: text(value) }) : null;
    if (col.type === "link")
      return value ? /* @__PURE__ */ jsx("a", { className: "dt-link", href: `https://${text(value)}`, target: "_blank", rel: "noreferrer", tabIndex: -1, children: text(value) }) : null;
    if (col.type === "number" && typeof value === "number")
      return /* @__PURE__ */ jsx("span", { className: "dt-num", children: (col.format ?? numberFormat)(value) });
    return text(value);
  };
  const allChecked = rows.length > 0 && checked.length === rows.length;
  const someChecked = checked.length > 0 && !allChecked;
  const template = `36px ${columns.map((c) => c.width ? typeof c.width === "number" ? `${c.width}px` : `minmax(0,${c.width})` : "minmax(0,1fr)").join(" ")}`;
  return /* @__PURE__ */ jsxs("section", { className: `dt-root ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css$3 }),
    /* @__PURE__ */ jsxs("header", { className: "dt-head", children: [
      /* @__PURE__ */ jsx("span", { className: "dt-head-icon", children: icon ?? /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("rect", { x: "1.5", y: "1.5", width: "13", height: "13", rx: "3", fill: "#2f6fed" }),
        /* @__PURE__ */ jsx("path", { d: "M4.8 5.5h6.4M4.8 8h6.4M4.8 10.5h4", stroke: "#fff", strokeWidth: "1.3", strokeLinecap: "round" })
      ] }) }),
      /* @__PURE__ */ jsx("h3", { children: title }),
      /* @__PURE__ */ jsxs("div", { className: "dt-history", children: [
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Буцаах", disabled: !past.length, onClick: undo, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 4 3 7l3 3M3 7h6.5a3.5 3.5 0 0 1 0 7H8" }) }) }),
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Дахин хийх", disabled: !future.length, onClick: redo, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m10 4 3 3-3 3m3-3H6.5a3.5 3.5 0 0 0 0 7H8" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "dt-scroll", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "dt-grid",
        role: "grid",
        "aria-label": title,
        "aria-multiselectable": "true",
        "aria-rowcount": view.length + 1,
        tabIndex: 0,
        ref: grid,
        onKeyDown: onKey,
        onCopy: (e) => onCopy(e),
        onCut: (e) => onCopy(e, true),
        onPaste,
        onFocus: (e) => {
          if (e.target === grid.current && !active && view.length) setActive({ r: 0, c: 0 });
        },
        style: { ["--dt-cols"]: template },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "dt-row dt-hrow", role: "row", children: [
            /* @__PURE__ */ jsx("span", { className: "dt-check", role: "columnheader", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                value: "",
                "aria-label": "Бүх мөрийг сонгох",
                checked: allChecked,
                ref: (el) => {
                  if (el) el.indeterminate = someChecked;
                },
                onChange: toggleAll
              }
            ) }),
            columns.map((col) => /* @__PURE__ */ jsx(
              "span",
              {
                role: "columnheader",
                className: "dt-th",
                "aria-sort": sort?.key === col.key ? sort.dir === "asc" ? "ascending" : "descending" : "none",
                children: header(col)
              },
              col.key
            ))
          ] }),
          view.map((row, r) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `dt-row ${checked.includes(row.id) ? "checked" : ""}`,
              role: "row",
              "aria-selected": checked.includes(row.id),
              children: [
                /* @__PURE__ */ jsx("span", { className: "dt-check", role: "gridcell", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    value: "",
                    "aria-label": `Сонгох: ${text(row[columns[0].key]) || "мөр"}`,
                    checked: checked.includes(row.id),
                    onChange: () => toggleRow(row.id)
                  }
                ) }),
                columns.map((col, c) => {
                  const isActive = active?.r === r && active?.c === c;
                  const isEditing = editing?.pos.r === r && editing.pos.c === c;
                  const label = `${text(row[columns[0].key]) || "Шинэ мөр"} ${col.label}`;
                  return /* @__PURE__ */ jsx(
                    "span",
                    {
                      role: "gridcell",
                      "aria-selected": inRange(r, c),
                      className: `dt-td ${inRange(r, c) ? "in-range" : ""} ${isActive ? "active" : ""} ${col.type ?? "text"}`,
                      onMouseDown: (e) => {
                        if (isEditing) return;
                        e.preventDefault();
                        grid.current?.focus();
                        if (e.shiftKey && active) setAnchor((a) => a ?? active);
                        else setAnchor(null);
                        setActive({ r, c });
                        setEditing(null);
                      },
                      onMouseEnter: (e) => {
                        if (e.buttons === 1 && active && !editing) {
                          setAnchor((a) => a ?? active);
                          setActive({ r, c });
                        }
                      },
                      onDoubleClick: () => startEdit({ r, c }),
                      children: isEditing ? col.type === "tag" && col.options ? /* @__PURE__ */ jsx("span", { className: "dt-picker", role: "listbox", "aria-label": label, children: col.options.map((o) => /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          role: "option",
                          "aria-selected": editing.value === o,
                          autoFocus: editing.value === o,
                          onMouseDown: (e) => e.stopPropagation(),
                          onKeyDown: (e) => {
                            if (e.key === "Escape") finishEdit(false);
                          },
                          onClick: () => {
                            setCells([{ r, c, value: o }]);
                            setEditing(null);
                            grid.current?.focus();
                          },
                          children: /* @__PURE__ */ jsx("span", { className: `dt-tag ${tagTones[o] ?? "gray"}`, children: o })
                        },
                        o
                      )) }) : /* @__PURE__ */ jsx(
                        "input",
                        {
                          className: "dt-input",
                          "aria-label": label,
                          autoFocus: true,
                          value: editing.value,
                          onMouseDown: (e) => e.stopPropagation(),
                          onChange: (e) => setEditing({ ...editing, value: e.target.value }),
                          onBlur: () => finishEdit(true),
                          onKeyDown: (e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") finishEdit(true, 1);
                            if (e.key === "Escape") finishEdit(false);
                            if (e.key === "Tab") {
                              e.preventDefault();
                              finishEdit(true);
                            }
                          }
                        }
                      ) : cellContent(row, col)
                    },
                    col.key
                  );
                })
              ]
            },
            row.id
          ))
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("footer", { className: "dt-foot", children: [
      editable && /* @__PURE__ */ jsxs("button", { type: "button", className: "dt-add", onClick: addRow, children: [
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 3.5v9M3.5 8h9" }) }),
        "Мөр нэмэх"
      ] }),
      /* @__PURE__ */ jsx("span", { children: checked.length ? `${checked.length} сонгосон` : editable ? "Засах бол нүдэн дээр давхар дарна уу" : "" })
    ] })
  ] });
}
const css$3 = `
.dt-root{--dt-fg:#1f1f1f;--dt-muted:#65656d;--dt-card:#fff;--dt-line:#ededed;--dt-soft:#f6f6f6;--dt-blue:#2f6fed;--dt-sel:#2f6fed14;width:100%;max-width:720px;margin:0 auto;background:var(--dt-card);border:1px solid var(--dt-line);border-radius:12px;color:var(--dt-fg);font:400 13px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;text-align:left;box-shadow:0 1px 2px #00000008;overflow:hidden}
:where(.dark,[data-theme=dark]) .dt-root{--dt-fg:#ececec;--dt-muted:#9a9aa2;--dt-card:#1b1b1e;--dt-line:#2b2b30;--dt-soft:#242428;--dt-blue:#5b8cff;--dt-sel:#5b8cff22;color-scheme:dark}
.dt-root *{box-sizing:border-box}
.dt-root :where(button){font:inherit;color:inherit;cursor:pointer}
.dt-root button:focus-visible{outline:2px solid var(--dt-blue);outline-offset:1px;border-radius:4px}
.dt-ico{width:12px;height:12px;flex:none;fill:none;stroke:currentColor;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
.dt-head{display:flex;align-items:center;gap:10px;padding:14px 16px 13px 18px;border-bottom:1px solid var(--dt-line)}
.dt-head-icon{display:grid;place-items:center}
.dt-head-icon svg{width:15px;height:15px}
.dt-head h3{margin:0;font-size:15px;font-weight:500;letter-spacing:-.005em}
.dt-history{margin-left:auto;display:flex;gap:6px}
.dt-history button{width:24px;height:24px;display:grid;place-items:center;border:0;background:none;border-radius:6px;color:var(--dt-fg)}
.dt-history button:hover:not(:disabled){background:var(--dt-soft)}
.dt-history button:disabled{color:var(--dt-muted);opacity:.45;cursor:default}
.dt-history svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.dt-scroll{overflow-x:auto}
.dt-grid{min-width:560px;outline:none}
.dt-row{display:grid;grid-template-columns:var(--dt-cols);align-items:center;min-height:40px;border-bottom:1px solid var(--dt-line)}
.dt-hrow{min-height:36px}
.dt-row.checked{background:var(--dt-sel)}
.dt-check{display:grid;place-items:center;padding-left:6px;height:100%}
.dt-check input{appearance:none;width:14px;height:14px;margin:0;border:1px solid #d4d4d4;border-radius:4px;background:var(--dt-card);display:grid;place-items:center;cursor:pointer;transition:transform .15s}
.dt-check input:checked,.dt-check input:indeterminate{background:var(--dt-blue);border-color:var(--dt-blue)}
.dt-check input:checked::after{content:"";width:7px;height:4px;border:1.5px solid #fff;border-top:0;border-right:0;transform:rotate(-45deg) translate(1px,-1px)}
.dt-check input:indeterminate::after{content:"";width:7px;height:1.5px;background:#fff}
.dt-check input:active{transform:scale(.88)}
.dt-check input:focus-visible{outline:2px solid var(--dt-blue);outline-offset:2px}
.dt-th{min-width:0}
.dt-sort{display:flex;align-items:center;gap:7px;border:0;background:none;padding:0 12px;height:36px;width:100%;font-size:12px!important;color:color-mix(in srgb,var(--dt-fg) 75%,transparent)!important;text-align:left}
.dt-sort .dt-ico{color:var(--dt-muted)}
.dt-sort:hover{color:var(--dt-fg)!important}
.dt-arrow{width:11px;height:11px;fill:none;stroke:var(--dt-blue);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;transition:transform .2s}
.dt-arrow.asc{transform:rotate(180deg)}
.dt-td{position:relative;display:flex;align-items:center;height:100%;min-height:40px;padding:0 12px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:default;user-select:none;font-size:13px}
.dt-td.in-range{background:var(--dt-sel)}
.dt-td.active{box-shadow:inset 0 0 0 1.5px var(--dt-blue);border-radius:2px;overflow:visible}
.dt-td.text{color:color-mix(in srgb,var(--dt-fg) 82%,transparent)}
.dt-title{display:flex;align-items:center;gap:9px;font-weight:450;min-width:0}
.dt-logo{display:grid;place-items:center;width:16px;height:16px;flex:none}
.dt-logo svg{width:15px;height:15px}
.dt-tag{display:inline-block;font-size:12px;line-height:19px;padding:0 6px;border-radius:4px;white-space:nowrap}
.dt-tag.blue{background:#2f6fed14;color:#2563d8}.dt-tag.violet{background:#8b5cf618;color:#7c3aed}.dt-tag.pink{background:#ec489914;color:#be185d}.dt-tag.green{background:#16a34a14;color:#15803d}.dt-tag.amber{background:#f59e0b18;color:#b45309}.dt-tag.gray{background:#0000000d;color:#555}
:where(.dark,[data-theme=dark]) .dt-tag.gray{background:#ffffff12;color:#bbb}
:where(.dark,[data-theme=dark]) .dt-tag.blue{color:#7cb4ff}:where(.dark,[data-theme=dark]) .dt-tag.violet{color:#b9a2ff}:where(.dark,[data-theme=dark]) .dt-tag.pink{color:#f472b6}:where(.dark,[data-theme=dark]) .dt-tag.green{color:#4ade80}:where(.dark,[data-theme=dark]) .dt-tag.amber{color:#fbbf24}
.dt-link{color:color-mix(in srgb,var(--dt-fg) 82%,transparent);text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--dt-fg) 30%,transparent);text-underline-offset:3px}
.dt-link:hover{color:var(--dt-blue)}
.dt-num{margin-left:auto;font-variant-numeric:tabular-nums}
.dt-input{width:100%;border:0;outline:0;background:none;color:inherit;font:inherit;padding:0}
.dt-picker{position:absolute;z-index:5;left:6px;top:6px;display:grid;gap:2px;padding:4px;background:var(--dt-card);border:1px solid var(--dt-line);border-radius:8px;box-shadow:0 8px 24px #0000001f;animation:dt-drop .16s ease-out}
.dt-picker button{display:flex;border:0;background:none;padding:4px 6px;border-radius:5px;text-align:left}
.dt-picker button:hover,.dt-picker [aria-selected=true]{background:var(--dt-soft)}
.dt-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 16px 0 14px;height:44px;font-size:12px;color:var(--dt-muted)}
.dt-add{display:flex;align-items:center;gap:8px;border:0;background:none;padding:4px;border-radius:6px;font-size:13px!important;color:color-mix(in srgb,var(--dt-fg) 85%,transparent)!important}
.dt-add:hover{background:var(--dt-soft)}
.dt-add svg{width:13px;height:13px;fill:none;stroke:var(--dt-muted);stroke-width:1.3;stroke-linecap:round}
@keyframes dt-drop{from{opacity:0;transform:translateY(-4px)}}
@media (prefers-reduced-motion:reduce){.dt-root *{animation:none!important;transition:none!important}}
@media (pointer:coarse){.dt-check input{width:18px;height:18px}.dt-check{min-width:36px;min-height:36px}}
@media (max-width:560px){.dt-head{padding:12px 14px}.dt-foot span{display:none}}
.dt-row{animation:dtrowrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.dt-row:nth-child(1){animation-delay:0ms}.dt-row:nth-child(2){animation-delay:70ms}.dt-row:nth-child(3){animation-delay:140ms}.dt-row:nth-child(4){animation-delay:210ms}.dt-row:nth-child(5){animation-delay:280ms}.dt-row:nth-child(6){animation-delay:350ms}.dt-row:nth-child(7){animation-delay:420ms}.dt-row:nth-child(8){animation-delay:490ms}.dt-row:nth-child(9){animation-delay:560ms}.dt-row:nth-child(10){animation-delay:630ms}.dt-row:nth-child(11){animation-delay:700ms}.dt-row:nth-child(12){animation-delay:770ms}@keyframes dtrowrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.dt-row{animation:none}}
`;
const compact = (n) => {
  const a = Math.abs(n);
  const s = a >= 1e6 ? `${+(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `${+(a / 1e3).toFixed(1)}k` : `${Math.round(a)}`;
  return `${n < 0 ? "-" : ""}${s}`;
};
const days = ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"];
const weekdays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"];
const defaultSeries = [
  { label: "Хайлт", color: "#3b82f6", values: [4200, 4600, 3900, 4500, 5100, 4900, 5800] },
  { label: "Зар сурталчилгаа", color: "#ec4899", values: [3600, 3300, 4300, 4600, 3900, 4300, 4100] },
  { label: "Санал болголт", color: "#8b5cf6", values: [1800, 2300, 2e3, 1500, 2400, 2200, 2700] },
  { label: "Имэйл", color: "#10b981", values: [1200, 1100, 1700, 2100, 1600, 1300, 1500] },
  { label: "Шууд", color: "#a1a1aa", values: [600, 900, 700, 800, 1e3, 1400, 1100] }
];
const niceMax = (v) => {
  if (v <= 0) return 1;
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  const m = [1, 1.5, 2, 3, 4, 5, 6, 8, 10].find((k) => k * step >= v) ?? 10;
  return m * step;
};
function KPIChart({
  title = "Зочилсон хүн",
  value = "96.4k",
  delta = 7900,
  labels = days,
  tooltipLabels = days.map((d, i) => `${weekdays[i]}, ${d}`),
  series = defaultSeries,
  format = compact,
  footer = "Шилдэг 5 суваг",
  defaultIndex,
  emptyText = "Одоогоор өгөгдөл алга",
  className = ""
}) {
  const [hover, setHover] = React.useState(null);
  const svgRef = React.useRef(null);
  const idx = hover ?? defaultIndex ?? null;
  const W2 = 400;
  const H2 = 140;
  const n = labels.length;
  const all = series.flatMap((s) => s.values);
  const empty = !all.length || all.every((v) => !v);
  const max = niceMax(Math.max(0, ...all));
  const x = (i) => n <= 1 ? W2 / 2 : i / (n - 1) * W2;
  const y = (v) => H2 - v / max * H2;
  const ticks = [max, max / 2, 0];
  const path = (vals) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const pick = (clientX) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r || n < 1) return;
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setHover(Math.round(p * (n - 1)));
  };
  const axisIdx = n > 2 ? [0, Math.floor((n - 1) / 2), n - 1] : labels.map((_, i) => i);
  const sortedAt = (i) => [...series].sort((a, b) => (b.values[i] ?? 0) - (a.values[i] ?? 0));
  return /* @__PURE__ */ jsxs("section", { className: `kpc ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css$2 }),
    /* @__PURE__ */ jsxs("div", { className: "kpc-body", children: [
      /* @__PURE__ */ jsx("div", { className: "kpc-title", children: title }),
      /* @__PURE__ */ jsxs("div", { className: "kpc-value", children: [
        /* @__PURE__ */ jsx("span", { children: value }),
        delta !== void 0 && /* @__PURE__ */ jsxs("span", { className: `kpc-delta${delta < 0 ? " is-down" : ""}`, children: [
          delta < 0 ? "" : "+",
          format(delta)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "kpc-chart", children: [
        /* @__PURE__ */ jsx("div", { className: "kpc-y", "aria-hidden": "true", children: ticks.map((t) => /* @__PURE__ */ jsx("span", { children: format(t) }, t)) }),
        /* @__PURE__ */ jsxs("div", { className: "kpc-plot", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              ref: svgRef,
              viewBox: `0 0 ${W2} ${H2}`,
              preserveAspectRatio: "none",
              role: "img",
              "aria-label": `${title}, сувгаар: ${series.map((s) => s.label).join(", ")}`,
              tabIndex: 0,
              onMouseMove: (e) => pick(e.clientX),
              onMouseLeave: () => setHover(null),
              onKeyDown: (e) => {
                if (e.key === "ArrowRight") setHover(Math.min(n - 1, (idx ?? -1) + 1));
                if (e.key === "ArrowLeft") setHover(Math.max(0, (idx ?? n) - 1));
                if (e.key === "Escape") setHover(null);
              },
              onBlur: () => setHover(null),
              children: [
                ticks.map((t) => /* @__PURE__ */ jsx("line", { className: "kpc-grid", x1: "0", x2: W2, y1: y(t), y2: y(t), vectorEffect: "non-scaling-stroke" }, t)),
                !empty && series.map((s) => /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: path(s.values),
                    fill: "none",
                    stroke: s.color,
                    strokeWidth: "1.5",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke",
                    className: `kpc-line${idx !== null ? " is-active" : ""}`
                  },
                  s.label
                )),
                idx !== null && !empty && /* @__PURE__ */ jsx("line", { className: "kpc-cross", x1: x(idx), x2: x(idx), y1: "0", y2: H2, vectorEffect: "non-scaling-stroke" })
              ]
            }
          ),
          idx !== null && !empty && series.map((s) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "kpc-dot",
              style: { left: `${x(idx) / W2 * 100}%`, top: `${y(s.values[idx] ?? 0) / H2 * 100}%`, background: s.color }
            },
            s.label
          )),
          empty && /* @__PURE__ */ jsx("div", { className: "kpc-empty", children: emptyText }),
          idx !== null && !empty && /* @__PURE__ */ jsxs(
            "div",
            {
              className: `kpc-tip${idx > (n - 1) / 2 ? " is-left" : ""}`,
              style: { left: `${x(idx) / W2 * 100}%` },
              role: "status",
              children: [
                /* @__PURE__ */ jsx("div", { className: "kpc-tip-h", children: tooltipLabels[idx] ?? labels[idx] }),
                sortedAt(idx).map((s) => /* @__PURE__ */ jsxs("div", { className: "kpc-tip-row", children: [
                  /* @__PURE__ */ jsx("i", { style: { background: s.color } }),
                  /* @__PURE__ */ jsx("span", { children: s.label }),
                  /* @__PURE__ */ jsx("b", { children: format(s.values[idx] ?? 0) })
                ] }, s.label))
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "kpc-x", "aria-hidden": "true", children: axisIdx.map((i) => /* @__PURE__ */ jsx("span", { style: { left: `${x(i) / W2 * 100}%` }, className: i === 0 ? "is-first" : i === n - 1 ? "is-last" : "", children: labels[i] }, i)) })
        ] })
      ] })
    ] }),
    footer && /* @__PURE__ */ jsx("footer", { className: "kpc-foot", children: footer })
  ] });
}
const css$2 = `
.kpc{--kpc-bg:#fff;--kpc-fg:#18181b;--kpc-muted:#65656d;--kpc-faint:#65656d;--kpc-line:#ececef;--kpc-grid:#f0f0f2;--kpc-up:#15803d;--kpc-up-bg:#e9f8ee;--kpc-down:#c62828;--kpc-down-bg:#fdecec;width:100%;max-width:440px;background:var(--kpc-bg);color:var(--kpc-fg);border:1px solid var(--kpc-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:visible}
:where(.dark,[data-theme=dark]) .kpc{--kpc-bg:#1b1b1e;--kpc-fg:#ececef;--kpc-muted:#a1a1aa;--kpc-faint:#9a9aa2;--kpc-line:#2e2e33;--kpc-grid:#26262b;--kpc-up:#4ade80;--kpc-up-bg:#16301f;--kpc-down:#f87171;--kpc-down-bg:#3a1d1f;color-scheme:dark}
.kpc *{box-sizing:border-box}
.kpc-body{padding:16px 16px 12px}
.kpc-title{font-size:15px;font-weight:500}
.kpc-value{display:flex;align-items:center;gap:8px;margin-top:4px}
.kpc-value>span:first-child{font-size:24px;font-weight:500;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.kpc-delta{height:20px;padding:0 5px;border-radius:5px;background:var(--kpc-up-bg);color:var(--kpc-up);font-size:12px;font-weight:500;line-height:20px}
.kpc-delta.is-down{background:var(--kpc-down-bg);color:var(--kpc-down)}
.kpc-chart{display:flex;gap:10px;margin-top:14px}
.kpc-y{display:flex;flex-direction:column;justify-content:space-between;height:140px;margin:-7px 0 0;font-size:11px;color:var(--kpc-muted);text-align:right;font-variant-numeric:tabular-nums}
.kpc-y span{line-height:14px}
.kpc-plot{position:relative;flex:1;min-width:0}
.kpc-plot svg{display:block;width:100%;height:140px;overflow:visible;outline:none;cursor:crosshair}
.kpc-plot svg:focus-visible{box-shadow:0 0 0 2px #3b82f655;border-radius:4px}
.kpc-grid{stroke:var(--kpc-grid);stroke-width:1}
.kpc-line{transition:opacity .15s}
.kpc-cross{stroke:var(--kpc-faint);stroke-width:1;stroke-dasharray:3 3}
.kpc-dot{position:absolute;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;border:1.5px solid var(--kpc-bg);box-shadow:0 0 0 .5px #0002;pointer-events:none}
.kpc-x{position:relative;height:16px;margin-top:6px;font-size:11px;color:var(--kpc-muted)}
.kpc-x span{position:absolute;transform:translateX(-50%);white-space:nowrap}.kpc-x .is-first{transform:none}.kpc-x .is-last{transform:translateX(-100%)}
.kpc-empty{position:absolute;inset:0 0 22px;display:grid;place-items:center;font-size:13px;color:var(--kpc-faint)}
.kpc-tip{position:absolute;top:-6px;z-index:3;min-width:150px;margin-left:12px;padding:8px 10px;border:1px solid var(--kpc-line);border-radius:8px;background:var(--kpc-bg);box-shadow:0 6px 20px #0000001a;font-size:12px;pointer-events:none;animation:kpc-in .15s both}
.kpc-tip.is-left{transform:translateX(calc(-100% - 24px))}
.kpc-tip-h{margin-bottom:4px;color:var(--kpc-muted)}
.kpc-tip-row{display:flex;align-items:center;gap:7px;line-height:20px}.kpc-tip-row i{width:8px;height:2px;border-radius:1px}
.kpc-tip-row span{flex:1}.kpc-tip-row b{font-weight:500;font-variant-numeric:tabular-nums}
.kpc-foot{padding:10px 16px;border-top:1px solid var(--kpc-line);font-size:12px;color:var(--kpc-muted)}
@keyframes kpc-in{from{opacity:0}}
@media(max-width:360px){.kpc-body{padding:14px 12px 10px}.kpc-tip{min-width:130px}}
@media(prefers-reduced-motion:reduce){.kpc *{animation:none!important;transition:none!important}}
.kpc-line{animation:kpc-in .8s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.kpc-line:nth-of-type(2){animation-delay:.2s}.kpc-line:nth-of-type(3){animation-delay:.4s}@keyframes kpc-in{from{opacity:0;transform:translateY(6px)}}@media(prefers-reduced-motion:reduce){.kpc-line{animation:none}}
`;
const defaultSteps = [
  { id: "plan", name: "Тайлангийн төлөвлөгөө", kind: "llm", status: "done", model: "Төлөвлөгч агент", tokensIn: 4100, tokensOut: 960, cost: 0.04, duration: 3e3, input: "2026 оны зах зээлийн тойм тайланг төлөвлө.", output: "1. Эх сурвалж цуглуулах 2. Харьцуулах 3. Бичих" },
  {
    id: "research",
    name: "Судлаач",
    kind: "agent",
    status: "done",
    model: "Судлаач агент",
    duration: 8500,
    children: [
      { id: "ws1", name: "web_search", kind: "tool", status: "done", detail: "зах зээл 2026", cost: 0.01, duration: 1300 },
      { id: "ws2", name: "web_search", kind: "tool", status: "done", detail: "өрсөлдөгчид", cost: 0.01, duration: 1100 },
      { id: "fp", name: "fetch_pages", kind: "tool", status: "done", detail: "9 хуудас", duration: 2100 },
      { id: "sum", name: "Эх сурвалж нэгтгэх", kind: "llm", status: "done", model: "Судлаач агент", tokensIn: 38400, tokensOut: 1300, cost: 0.01, duration: 3600 }
    ]
  },
  { id: "write", name: "Тайлан бичих", kind: "llm", status: "done", model: "Бичигч агент", tokensIn: 21800, tokensOut: 5600, cost: 0.25, duration: 7500 },
  {
    id: "review",
    name: "Шалгагч",
    kind: "agent",
    status: "done",
    model: "Шалгагч агент",
    duration: 3300,
    children: [
      { id: "facts", name: "Баримт шалгах", kind: "llm", status: "done", model: "Шалгагч агент", tokensIn: 26e3, tokensOut: 700, cost: 0.03, duration: 2e3 },
      { id: "links", name: "check_links", kind: "tool", status: "failed", detail: "31 холбоос", duration: 1100, error: "3 холбоос 404 буцаалаа" }
    ]
  },
  { id: "apply", name: "Засвар оруулах", kind: "llm", status: "done", model: "Бичигч агент", tokensIn: 24500, tokensOut: 1900, cost: 0.1, duration: 2800 },
  { id: "save", name: "Тайлан хадгалах", kind: "tool", status: "running", detail: "баримтын сан", duration: 438 }
];
const sum = (s) => s.children?.length ? s.children.reduce(
  (a, c) => {
    const t = sum(c);
    return { cost: a.cost + t.cost, tin: a.tin + t.tin, tout: a.tout + t.tout };
  },
  { cost: 0, tin: 0, tout: 0 }
) : { cost: s.cost ?? 0, tin: s.tokensIn ?? 0, tout: s.tokensOut ?? 0 };
const fmtTok = (n) => n >= 1e4 ? `${(n / 1e3).toFixed(1)}k` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : `${n}`;
const fmtTokShort = (n) => n >= 1e5 ? `${Math.round(n / 1e3)}k` : fmtTok(n);
const fmtTime = (ms) => ms == null ? "–" : ms < 1e3 ? `${Math.round(ms)}ms` : `${(ms / 1e3).toFixed(1)} с`;
const dollars = (n) => `${n.toFixed(2)} кр`;
const Ico = {
  agent: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.2", children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "1.6", fill: "currentColor", stroke: "none" })
  ] }) }),
  globe: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "#3b82f6", strokeWidth: "1.2", children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "M2.5 8h11M8 2.5c-2.4 3-2.4 8 0 11M8 2.5c2.4 3 2.4 8 0 11" })
  ] }) }),
  doc: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 2h5l3 3v9H4Z M9 2v3h3", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }) }),
  tool: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M10 2.5a3 3 0 0 0-2.8 4L2.8 11a1.2 1.2 0 0 0 1.7 1.7L9 8.3a3 3 0 0 0 4-3.6l-1.8 1.7-1.6-.4-.4-1.6Z", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }) })
};
function iconFor(s) {
  if (s.icon) return s.icon;
  const m = (s.model ?? s.detail ?? "").toLowerCase();
  if (/агент|agent/.test(m)) return Ico.agent;
  if (/сан|doc/.test(m)) return Ico.doc;
  if (/search|fetch|link/.test(s.name)) return Ico.globe;
  return Ico.tool;
}
function CostWaterfall({
  steps = defaultSteps,
  task = "2026 оны зах зээлийн тойм тайлан",
  title = "Ажиллагааны зардал",
  status,
  mode: modeIn,
  defaultMode = "cost",
  onModeChange,
  collapsed: collapsedIn,
  defaultCollapsed = ["research"],
  onCollapsedChange,
  openId: openIn,
  defaultOpenId = null,
  onOpenChange,
  maxHeight,
  formatCost = dollars,
  className = ""
}) {
  const [modeLocal, setModeLocal] = React.useState(defaultMode);
  const mode = modeIn ?? modeLocal;
  const [colLocal, setColLocal] = React.useState(defaultCollapsed);
  const collapsed = collapsedIn ?? colLocal;
  const [openLocal, setOpenLocal] = React.useState(defaultOpenId);
  const openId = openIn !== void 0 ? openIn : openLocal;
  const setMode = (m) => {
    if (modeIn === void 0) setModeLocal(m);
    onModeChange?.(m);
  };
  const toggleCol = (id) => {
    const next = collapsed.includes(id) ? collapsed.filter((x) => x !== id) : [...collapsed, id];
    if (collapsedIn === void 0) setColLocal(next);
    onCollapsedChange?.(next);
  };
  const toggleOpen = (s) => {
    const next = openId === s.id ? null : s.id;
    if (openIn === void 0) setOpenLocal(next);
    onOpenChange?.(next, next ? s : void 0);
  };
  const total = steps.reduce(
    (a, s) => {
      const t = sum(s);
      return { cost: a.cost + t.cost, tin: a.tin + t.tin, tout: a.tout + t.tout };
    },
    { cost: 0, tin: 0, tout: 0 }
  );
  const running = status ? status === "running" : JSON.stringify(steps).includes('"running"');
  const failedRun = status === "failed";
  const top = steps.reduce((best, s) => !best || sum(s).cost > sum(best).cost ? s : best, null);
  const val = (t) => mode === "cost" ? t.cost : t.tin + t.tout;
  const grand = mode === "cost" ? total.cost : total.tin + total.tout;
  const stepSize = mode === "cost" ? 0.2 : 5e4;
  const axisMax = Math.max(stepSize, Math.ceil(grand * 1.08 / stepSize) * stepSize);
  const ticks = Array.from({ length: Math.round(axisMax / stepSize) }, (_, i) => i * stepSize);
  const rows = [];
  let acc = 0;
  const walk = (list, depth) => {
    for (const s of list) {
      const t = sum(s);
      const start = acc;
      rows.push({ s, depth, start, t });
      if (s.children?.length) {
        if (collapsed.includes(s.id)) acc += val(t);
        else walk(s.children, depth + 1);
      } else acc += val(t);
    }
  };
  walk(steps, 0);
  const pct = (v) => `${v / axisMax * 100}%`;
  return /* @__PURE__ */ jsxs("section", { className: `cw ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css$1 }),
    /* @__PURE__ */ jsxs("header", { className: "cw-bar", children: [
      /* @__PURE__ */ jsx("svg", { className: "cw-spark", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 1.5 7.2 5 10.5 6 7.2 7 6 10.5 4.8 7 1.5 6 4.8 5ZM12 9l.7 1.8 1.8.7-1.8.7L12 14l-.7-1.8-1.8-.7 1.8-.7Z", fill: "currentColor" }) }),
      /* @__PURE__ */ jsx("strong", { children: title }),
      /* @__PURE__ */ jsx("span", { className: "cw-task", children: task }),
      /* @__PURE__ */ jsx("div", { className: "cw-seg", role: "tablist", "aria-label": "Хэмжүүр", children: ["cost", "tokens"].map((m) => /* @__PURE__ */ jsx("button", { type: "button", role: "tab", "aria-selected": mode === m, onClick: () => setMode(m), children: m === "cost" ? "Зардал" : "Токен" }, m)) }),
      /* @__PURE__ */ jsxs("span", { className: `cw-state ${running ? "live" : failedRun ? "fail" : "done"}`, children: [
        /* @__PURE__ */ jsx("i", {}),
        running ? "Шууд" : failedRun ? "Алдаатай" : "Дууссан"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cw-stats", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "cw-k", children: "Нийт зардал" }),
        /* @__PURE__ */ jsx("span", { className: "cw-v", children: formatCost(total.cost) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "cw-k", children: "Нийт токен" }),
        /* @__PURE__ */ jsxs("span", { className: "cw-v", children: [
          fmtTokShort(total.tin + total.tout),
          /* @__PURE__ */ jsxs("small", { children: [
            fmtTokShort(total.tin),
            " оролт · ",
            fmtTok(total.tout),
            " гаралт"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "cw-k", children: "Хамгийн их зардал" }),
        /* @__PURE__ */ jsxs("span", { className: "cw-v cw-v-name", children: [
          top?.name,
          /* @__PURE__ */ jsx("small", { children: top ? formatCost(sum(top).cost) : "" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cw-table", style: maxHeight ? { maxHeight, overflowY: "auto" } : void 0, children: [
      /* @__PURE__ */ jsxs("div", { className: "cw-row cw-th", children: [
        /* @__PURE__ */ jsx("span", { className: "cw-name", children: "Алхам" }),
        /* @__PURE__ */ jsx("span", { className: "cw-chart", children: ticks.map((t) => /* @__PURE__ */ jsx("span", { className: "cw-tick", style: { left: pct(t) }, children: mode === "cost" ? t === 0 ? "0" : t.toFixed(2) : t === 0 ? "0" : `${t / 1e3}k` }, t)) }),
        /* @__PURE__ */ jsx("span", { className: "cw-num", children: "Оролт" }),
        /* @__PURE__ */ jsx("span", { className: "cw-num", children: "Гаралт" }),
        /* @__PURE__ */ jsx("span", { className: "cw-num", children: "Зардал" }),
        /* @__PURE__ */ jsx("span", { className: "cw-num", children: "Хугацаа" })
      ] }),
      rows.map(({ s, depth, start, t }) => {
        const hasKids = !!s.children?.length;
        const folded = hasKids && collapsed.includes(s.id);
        const own = val(t);
        const isTop = top?.id === s.id;
        const open = openId === s.id;
        return /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: `cw-row cw-${s.status} ${hasKids ? "cw-parent" : ""} ${open ? "open" : ""}`, children: [
            /* @__PURE__ */ jsxs("span", { className: "cw-name", style: { paddingLeft: 14 + depth * 14 }, children: [
              hasKids ? /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "cw-caret",
                  "aria-expanded": !folded,
                  "aria-label": `${s.name}: ${folded ? "нээх" : "хураах"}`,
                  onClick: () => toggleCol(s.id),
                  children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", style: { transform: folded ? "none" : "rotate(90deg)" }, children: /* @__PURE__ */ jsx("path", { d: "m6 4 4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) })
                }
              ) : /* @__PURE__ */ jsx("span", { className: "cw-caret" }),
              /* @__PURE__ */ jsx("span", { className: "cw-ico", children: iconFor(s) }),
              /* @__PURE__ */ jsxs("button", { type: "button", className: "cw-label", "aria-expanded": open, onClick: () => toggleOpen(s), children: [
                /* @__PURE__ */ jsx("span", { className: "cw-n", children: s.name }),
                /* @__PURE__ */ jsx("span", { className: "cw-m", children: s.model ?? s.detail })
              ] }),
              folded && /* @__PURE__ */ jsxs("span", { className: "cw-tag", children: [
                "+",
                s.children.length
              ] }),
              isTop && /* @__PURE__ */ jsx("span", { className: "cw-tag cw-top", children: "TOP" }),
              s.status === "failed" && /* @__PURE__ */ jsxs("svg", { className: "cw-warn", viewBox: "0 0 16 16", "aria-label": "Алдаатай", children: [
                /* @__PURE__ */ jsx("path", { d: "M8 2.5 14 13H2Z", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" }),
                /* @__PURE__ */ jsx("path", { d: "M8 6.5v3M8 11.2v.1", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" })
              ] }),
              s.status === "running" && /* @__PURE__ */ jsx("span", { className: "cw-spin", "aria-label": "Ажиллаж байна" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "cw-chart", children: [
              ticks.map((tk) => /* @__PURE__ */ jsx("span", { className: "cw-grid", style: { left: pct(tk) } }, tk)),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `cw-b ${own === 0 ? "zero" : ""} ${hasKids && !folded ? "group" : ""}`,
                  style: { left: pct(start), width: own === 0 ? 1 : `max(4px, ${pct(own)})` }
                }
              )
            ] }),
            /* @__PURE__ */ jsx("span", { className: "cw-num", children: t.tin ? fmtTok(t.tin) : "–" }),
            /* @__PURE__ */ jsx("span", { className: "cw-num", children: t.tout ? fmtTok(t.tout) : "–" }),
            /* @__PURE__ */ jsx("span", { className: "cw-num cw-cost", children: t.cost ? formatCost(t.cost) : "–" }),
            /* @__PURE__ */ jsx("span", { className: "cw-num cw-time", children: fmtTime(s.duration) })
          ] }),
          open && /* @__PURE__ */ jsxs("div", { className: "cw-detail", children: [
            s.error && /* @__PURE__ */ jsx("p", { className: "cw-err", children: s.error }),
            s.input && /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("b", { children: "Оролт" }),
              " ",
              s.input
            ] }),
            s.output && /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("b", { children: "Гаралт" }),
              " ",
              s.output
            ] }),
            !s.error && !s.input && !s.output && /* @__PURE__ */ jsx("p", { className: "cw-faint", children: "Дэлгэрэнгүй бичигдээгүй." })
          ] })
        ] }, s.id);
      })
    ] })
  ] });
}
const css$1 = `
.cw{--cw-bg:#fff;--cw-fg:#18181b;--cw-muted:#65656d;--cw-faint:#65656d;--cw-line:#ececef;--cw-soft:#f4f4f5;--cw-bar:#ecebfa;--cw-bar-b:#c9c6ee;--cw-accent:#1d4ed8;--cw-red:#c62828;--cw-top-bg:#fdf0d5;--cw-top-fg:#9a4f0c;width:100%;max-width:758px;background:var(--cw-bg);color:var(--cw-fg);border:1px solid var(--cw-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 13.5px/1.4 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .cw{--cw-bg:#1b1b1e;--cw-fg:#ececef;--cw-muted:#a1a1aa;--cw-faint:#9a9aa2;--cw-line:#2e2e33;--cw-soft:#26262b;--cw-bar:#2c2a4a;--cw-bar-b:#5a55a0;--cw-accent:#6aa3ff;--cw-top-bg:#3d2a10;--cw-top-fg:#f2a54a;--cw-red:#f87171;color-scheme:dark}
.cw *{box-sizing:border-box}.cw button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;padding:0}
.cw-bar{display:flex;align-items:center;gap:8px;padding:10px 12px 10px 18px;border-bottom:1px solid var(--cw-line)}
.cw-spark{width:14px;height:14px;color:var(--cw-accent);flex:none}
.cw-bar strong{font-weight:500;font-size:14px}
.cw-task{flex:1;min-width:0;color:var(--cw-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
.cw-seg{display:flex;padding:2px;border-radius:8px;background:var(--cw-soft)}
.cw-seg button{height:24px;padding:0 10px;border-radius:6px;font-size:13px;color:var(--cw-muted)}
.cw-seg button[aria-selected=true]{background:var(--cw-bg);color:var(--cw-fg);box-shadow:0 0 0 1px var(--cw-line),0 1px 2px #0000000d}
.cw-state{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 7px;border-radius:5px;font-size:12.5px}
.cw-state i{width:5px;height:5px;border-radius:50%;background:currentColor}
.cw-state.live{background:color-mix(in srgb,var(--cw-accent) 12%,transparent);color:var(--cw-accent)}
.cw-state.live i{animation:cw-pulse 1.4s ease-in-out infinite}
.cw-state.done{background:var(--cw-soft);color:var(--cw-muted)}.cw-state.fail{background:color-mix(in srgb,var(--cw-red) 12%,transparent);color:var(--cw-red)}
.cw-stats{display:grid;grid-template-columns:1fr 1fr 1.4fr;border-bottom:1px solid var(--cw-line)}
.cw-stats>div{display:flex;flex-direction:column;gap:6px;padding:12px 22px 14px}
.cw-stats>div+div{border-left:1px solid var(--cw-line)}
.cw-k{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--cw-muted)}
.cw-v{font-size:15px;font-weight:500;font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:8px;white-space:nowrap}
.cw-v small{font-size:12px;font-weight:400;color:var(--cw-muted)}
.cw-row{display:grid;grid-template-columns:250px minmax(120px,1fr) 52px 48px 58px 58px;align-items:center;height:32px}
.cw-th{height:30px;border-bottom:1px solid var(--cw-line);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--cw-muted)}
.cw-th .cw-name{padding-left:16px}
.cw-th .cw-chart{text-transform:none;letter-spacing:0;font-size:12.5px}
.cw-tick{position:absolute;top:50%;transform:translateY(-50%);padding-left:6px;border-left:1px solid var(--cw-line);height:30px;line-height:30px}
.cw-name{display:flex;align-items:center;gap:6px;min-width:0;padding-right:10px;height:100%;border-right:1px solid var(--cw-line)}
.cw-th .cw-name{border-right:0}
.cw-caret{display:grid;place-items:center;width:12px;height:12px;flex:none;color:var(--cw-faint)}
.cw-caret svg{width:12px;height:12px;transition:transform .15s}
.cw-ico{display:grid;place-items:center;width:14px;height:14px;flex:none}.cw-ico svg{width:14px;height:14px}
.cw-label{display:flex;align-items:center;min-height:18px;gap:6px;min-width:0;text-align:left}
.cw-n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;font-weight:400;color:var(--cw-fg)}
.cw-m{font-size:12.5px;color:var(--cw-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.cw-tag{flex:none;display:inline-flex;align-items:center;height:18px;font-size:10.5px;padding:0 4px;border-radius:4px;background:var(--cw-soft);color:var(--cw-muted)}
.cw-top{background:var(--cw-top-bg);color:var(--cw-top-fg);letter-spacing:.02em}
.cw-warn{width:13px;height:13px;color:var(--cw-red);margin-left:auto;flex:none}
.cw-spin{margin-left:auto;width:10px;height:10px;border-radius:50%;border:1.5px solid var(--cw-line);border-top-color:var(--cw-accent);animation:cw-spin .8s linear infinite;flex:none}
.cw-chart{position:relative;height:100%}
.cw-grid{position:absolute;top:0;bottom:0;width:1px;background:var(--cw-line)}
.cw-b{position:absolute;top:50%;height:12px;transform:translateY(-50%);border-radius:3px;background:var(--cw-bar);border:1px solid var(--cw-bar-b);transition:left .3s,width .3s}
.cw-b.group{background:var(--cw-soft);border-color:var(--cw-line)}
.cw-b.zero{background:none;border:0;border-left:1px solid var(--cw-faint);border-radius:0}
.cw-failed .cw-b.zero{border-left-color:var(--cw-red)}
.cw-running .cw-b{animation:cw-pulse 1.4s ease-in-out infinite}
.cw-num{text-align:right;padding-right:16px;font-variant-numeric:tabular-nums;color:var(--cw-muted);white-space:nowrap}
.cw-th .cw-num{padding-right:16px}
.cw-cost{color:var(--cw-fg)}.cw-th .cw-cost{color:var(--cw-muted)}
.cw-failed .cw-time{color:var(--cw-red)}
.cw-row:not(.cw-th):hover{background:color-mix(in srgb,var(--cw-soft) 60%,transparent)}
.cw-row.open{background:var(--cw-soft)}
.cw-detail{padding:8px 18px 12px 44px;border-top:1px solid var(--cw-line);border-bottom:1px solid var(--cw-line);font-size:12.5px;color:var(--cw-muted);animation:cw-in .18s both}
.cw-detail p{margin:4px 0}.cw-detail b{font-weight:500;color:var(--cw-fg);margin-right:6px}
.cw-err{color:var(--cw-red)}.cw-faint{color:var(--cw-faint)}
.cw :focus-visible{outline:2px solid var(--cw-accent);outline-offset:2px;border-radius:4px}
@keyframes cw-spin{to{transform:rotate(360deg)}}
@keyframes cw-pulse{50%{opacity:.45}}
@keyframes cw-in{from{opacity:0}}
@media(max-width:700px){.cw-row{grid-template-columns:minmax(0,1fr) 84px 54px 62px}.cw-row>.cw-num:nth-child(3),.cw-row>.cw-num:nth-child(4){display:none}.cw-stats{grid-template-columns:1fr 1fr}.cw-stats>div:nth-child(3){display:none}.cw-task{display:none}.cw-bar{flex-wrap:wrap;row-gap:6px}.cw-stats>div{padding:12px 14px 14px}.cw-v{flex-direction:column;align-items:flex-start;gap:2px;white-space:normal}}
@media(prefers-reduced-motion:reduce){.cw *{animation:none!important;transition:none!important}}
.cw-row{animation:cwrowrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.cw-row:nth-child(1){animation-delay:0ms}.cw-row:nth-child(2){animation-delay:80ms}.cw-row:nth-child(3){animation-delay:160ms}.cw-row:nth-child(4){animation-delay:240ms}.cw-row:nth-child(5){animation-delay:320ms}.cw-row:nth-child(6){animation-delay:400ms}.cw-row:nth-child(7){animation-delay:480ms}.cw-row:nth-child(8){animation-delay:560ms}.cw-row:nth-child(9){animation-delay:640ms}.cw-row:nth-child(10){animation-delay:720ms}.cw-row:nth-child(11){animation-delay:800ms}.cw-row:nth-child(12){animation-delay:880ms}@keyframes cwrowrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.cw-row{animation:none}}
`;
const shieldIcon = /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 1.8 13 3.6v4c0 3-2.1 5.4-5 6.6-2.9-1.2-5-3.6-5-6.6v-4Z" }) });
const riskLabel = { low: "Бага", medium: "Дунд", high: "Өндөр" };
function ApprovalCard({
  title = "Кампанит имэйл илгээх",
  description = "10-р сарын бүтээгдэхүүний шинэчлэл · Мэдээллийн товхимол",
  risk,
  icon = shieldIcon,
  details,
  preview,
  children,
  status,
  defaultStatus = "pending",
  onApprove,
  onDeny,
  onEdit,
  expiresIn,
  onExpire,
  allowAlways = true,
  alwaysLabel = "Энэ үйлдлийг үргэлж зөвшөөрөх",
  approveLabel = "Батлах",
  denyLabel = "Татгалзах",
  editLabel = "Засах",
  shortcuts = true,
  label,
  actions = "card",
  className = ""
}) {
  const [internal, setInternal] = React.useState(defaultStatus);
  const state = status ?? internal;
  const [always, setAlways] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [remaining, setRemaining] = React.useState(expiresIn);
  const locked = React.useRef(false);
  const expired = React.useRef(false);
  const mounted = React.useRef(true);
  const root = React.useRef(null);
  const resolved = React.useRef(null);
  const hadFocus = React.useRef(false);
  const id = React.useId();
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  React.useEffect(() => {
    setRemaining(expiresIn);
    expired.current = false;
    if (state === "pending") {
      setError("");
      setAlways(false);
    } else if (hadFocus.current || root.current?.contains(document.activeElement))
      resolved.current?.focus();
    hadFocus.current = false;
  }, [state, expiresIn]);
  React.useEffect(() => {
    if (state !== "pending" || expiresIn == null || hovered || focused || busy || expired.current)
      return;
    const timer = window.setInterval(
      () => setRemaining((value) => Math.max(0, (value ?? expiresIn) - 1)),
      1e3
    );
    return () => window.clearInterval(timer);
  }, [state, expiresIn, hovered, focused, busy]);
  const finish = (next) => {
    hadFocus.current = !!root.current?.contains(document.activeElement);
    if (status === void 0) setInternal(next);
  };
  const deny = (reason) => {
    if (locked.current || state !== "pending") return;
    try {
      if (reason === "timeout") onExpire?.();
      onDeny?.({ reason });
      finish("denied");
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Хүсэлтээс татгалзаж чадсангүй. Дахин оролдоно уу."
      );
    }
  };
  const denyRef = React.useRef(deny);
  denyRef.current = deny;
  React.useEffect(() => {
    if (state === "pending" && remaining === 0 && !expired.current && !busy) {
      expired.current = true;
      denyRef.current("timeout");
    }
  }, [remaining, state, busy]);
  const approve = async () => {
    if (locked.current || state !== "pending") return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      await onApprove?.({ always });
      if (mounted.current) finish("approved");
    } catch (failure) {
      if (mounted.current)
        setError(
          failure instanceof Error ? failure.message : "Баталж чадсангүй. Дахин оролдоно уу."
        );
    } finally {
      locked.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const kbdApprove = "⌘↵";
  const buttons = /* @__PURE__ */ jsxs("div", { className: "apv-actions", children: [
    onEdit && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "apv-btn apv-ghost",
        "aria-disabled": busy,
        onClick: () => {
          if (!busy) onEdit();
        },
        children: editLabel
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "apv-btn apv-ghost",
        "aria-disabled": busy,
        "aria-keyshortcuts": "Escape",
        onClick: () => deny("user"),
        children: [
          denyLabel,
          shortcuts && /* @__PURE__ */ jsx("kbd", { className: "apv-kbd", "aria-hidden": "true", children: "ESC" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "apv-btn apv-primary",
        "aria-disabled": busy,
        "aria-keyshortcuts": "Meta+Enter Control+Enter",
        onClick: () => void approve(),
        children: [
          busy ? "Баталж байна…" : approveLabel,
          busy ? /* @__PURE__ */ jsx("span", { className: "apv-spin", "aria-hidden": "true" }) : shortcuts && /* @__PURE__ */ jsx("kbd", { className: "apv-kbd", "aria-hidden": "true", children: kbdApprove })
        ]
      }
    )
  ] });
  const expiry = remaining != null ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("span", { id: `${id}-expiry`, className: "apv-hidden", children: [
      "Батлахгүй бол ",
      remaining,
      " секундийн дараа хугацаа дуусна. Заагч дээр нь байх эсвэл фокустай үед түр зогсоно."
    ] }),
    /* @__PURE__ */ jsxs("span", { className: `apv-expiry ${remaining <= 10 ? "warn" : ""}`, "aria-hidden": "true", children: [
      Math.floor(remaining / 60),
      ":",
      String(remaining % 60).padStart(2, "0"),
      " үлдсэн"
    ] })
  ] }) : null;
  const tray = actions === "tray" || !!label;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: root,
      className: `apv ${tray ? "apv-has-tray" : ""} ${className}`,
      role: "group",
      "aria-labelledby": `${id}-title`,
      "aria-describedby": `${id}-description${remaining == null ? "" : ` ${id}-expiry`}`,
      "aria-busy": busy,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      },
      onKeyDown: (event) => {
        if (state !== "pending") return;
        if (event.key === "Escape") {
          event.preventDefault();
          deny("user");
        }
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          void approve();
        }
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: css }),
        label && /* @__PURE__ */ jsx("div", { className: "apv-label", children: label }),
        state === "pending" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "apv-card", children: [
            /* @__PURE__ */ jsxs("div", { className: "apv-head", children: [
              /* @__PURE__ */ jsx("span", { className: "apv-icon", children: icon }),
              /* @__PURE__ */ jsxs("div", { className: "apv-titles", children: [
                /* @__PURE__ */ jsx("h3", { id: `${id}-title`, children: title }),
                /* @__PURE__ */ jsx("div", { id: `${id}-description`, className: "apv-desc", children: description })
              ] }),
              risk && /* @__PURE__ */ jsxs("span", { className: `apv-risk ${risk}`, children: [
                riskLabel[risk],
                /* @__PURE__ */ jsx("span", { className: "apv-risk-word", children: " эрсдэл" })
              ] })
            ] }),
            ((preview ?? children) || !!details?.length) && /* @__PURE__ */ jsxs("div", { className: "apv-body", children: [
              (preview ?? children) && /* @__PURE__ */ jsx("div", { className: "apv-preview", children: preview ?? children }),
              !!details?.length && /* @__PURE__ */ jsx("dl", { className: "apv-details", children: details.map((detail, index) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { children: detail.label }),
                /* @__PURE__ */ jsx("dd", { children: detail.value })
              ] }, `${detail.label}-${index}`)) })
            ] }),
            error && /* @__PURE__ */ jsx("p", { role: "alert", className: "apv-error", children: error }),
            /* @__PURE__ */ jsxs("div", { className: "apv-foot", children: [
              allowAlways && /* @__PURE__ */ jsxs("label", { className: "apv-check", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    value: "1",
                    checked: always,
                    "aria-disabled": busy,
                    onChange: (event) => {
                      if (!busy) setAlways(event.target.checked);
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "apv-box", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 12 12", children: /* @__PURE__ */ jsx("path", { d: "m2.5 6.2 2.3 2.3 4.7-5" }) }) }),
                alwaysLabel
              ] }),
              !tray && expiry,
              !tray && buttons
            ] })
          ] }),
          tray && /* @__PURE__ */ jsxs("div", { className: "apv-tray", children: [
            expiry,
            buttons
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { ref: resolved, tabIndex: -1, className: "apv-resolved", children: [
          /* @__PURE__ */ jsx("span", { className: `apv-mark ${state}`, "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: state === "approved" ? /* @__PURE__ */ jsx("path", { d: "m3.5 8.4 3 3 6-6.6" }) : /* @__PURE__ */ jsx("path", { d: "m4.5 4.5 7 7m0-7-7 7" }) }) }),
          /* @__PURE__ */ jsx("strong", { id: `${id}-title`, children: title }),
          /* @__PURE__ */ jsx("span", { id: `${id}-description`, className: "apv-state", children: state === "approved" ? "Батлагдсан" : "Татгалзсан" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "apv-hidden", role: "status", children: state !== "pending" ? `${state === "approved" ? "Батлагдсан" : "Татгалзсан"}: ${title}` : "" })
      ]
    }
  );
}
const css = `
.apv{--apv-bg:#fff;--apv-fg:#18181b;--apv-muted:#65656d;--apv-faint:#65656d;--apv-line:#ececef;--apv-soft:#f4f4f5;--apv-amber:#92400e;--apv-amber-bg:#fdf3d7;--apv-red:#c2410c;--apv-red-bg:#fde8e3;--apv-green:#16a34a;--apv-accent:#4f7cf0;width:100%;max-width:420px;color:var(--apv-fg);font:400 14px/1.45 Inter,system-ui,sans-serif;container:apv/inline-size}
:where(.dark,[data-theme=dark]) .apv{--apv-bg:#1b1b1e;--apv-fg:#ececef;--apv-muted:#a1a1aa;--apv-faint:#9a9aa2;--apv-line:#2e2e33;--apv-soft:#242428;--apv-amber:#fbbf24;--apv-amber-bg:#3a2f12;--apv-red:#fb923c;--apv-red-bg:#3a1e18;color-scheme:dark}
.apv *{box-sizing:border-box}.apv button{font:inherit;cursor:pointer}
.apv.apv-has-tray{background:var(--apv-soft);border-radius:16px;padding:4px}
.apv-label{padding:6px 10px 8px;font-size:12px;color:var(--apv-muted)}
.apv-card{background:var(--apv-bg);border:1px solid var(--apv-line);border-radius:14px;box-shadow:0 1px 3px #0000000a;padding:16px 15px 15px;animation:apv-in .25s ease-out}
.apv-head{display:flex;align-items:flex-start;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--apv-line)}
.apv-icon{display:grid;place-items:center;width:32px;height:32px;flex:none;border:1px solid var(--apv-line);border-radius:8px;color:var(--apv-fg)}
.apv-icon svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.apv-titles{flex:1;min-width:0}
.apv-titles h3{margin:0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.apv-desc{color:var(--apv-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.apv-risk{flex:none;padding:0 7px;border-radius:5px;font-size:12.5px;line-height:21px;background:var(--apv-soft);color:var(--apv-muted)}
.apv-risk.medium{background:var(--apv-amber-bg);color:var(--apv-amber)}.apv-risk.high{background:var(--apv-red-bg);color:var(--apv-red)}
.apv-body{padding:14px 0;border-bottom:1px solid var(--apv-line);display:grid;gap:10px}
.apv-details{margin:0;display:grid;gap:6px}
.apv-details>div{display:grid;grid-template-columns:62px minmax(0,1fr);gap:0}
.apv-details dt{color:var(--apv-muted)}.apv-details dd{margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.apv-error{margin:10px 0 0;color:var(--apv-red);font-size:13px}
.apv-foot{display:flex;align-items:center;gap:10px;padding-top:14px}
.apv-check{position:relative;display:flex;font-size:13.5px;align-items:center;gap:8px;color:var(--apv-faint);cursor:pointer;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:auto}
.apv-check input{position:absolute;opacity:0;width:16px;height:16px;margin:0;cursor:pointer}
.apv-box{display:grid;place-items:center;width:16px;height:16px;flex:none;border:1px solid var(--apv-line);border-radius:4px;background:var(--apv-bg);transition:background .15s,border-color .15s}
.apv-box svg{width:11px;height:11px;fill:none;stroke:var(--apv-bg);stroke-width:1.8;stroke-linecap:round;transform:scale(0);transition:transform .15s}
.apv-check input:checked+.apv-box{background:var(--apv-fg);border-color:var(--apv-fg)}.apv-check input:checked+.apv-box svg{transform:scale(1)}
.apv-check input:checked~*{color:var(--apv-fg)}
.apv-check input:focus-visible+.apv-box{outline:2px solid var(--apv-accent);outline-offset:2px}
.apv-expiry{font-size:13px;color:var(--apv-faint);white-space:nowrap;font-variant-numeric:tabular-nums}.apv-expiry.warn{color:var(--apv-amber)}
.apv-actions{display:flex;align-items:center;gap:4px;flex:none}
.apv-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:34px;padding:0 11px;border-radius:8px;border:0;font-weight:500;transition:transform .12s,background .15s}
.apv-btn:active{transform:scale(.97)}.apv-btn[aria-disabled=true]{cursor:wait;opacity:.75}
.apv-ghost{background:none;color:var(--apv-muted)}.apv-ghost:hover{background:var(--apv-soft);color:var(--apv-fg)}
.apv-primary{background:var(--apv-fg);color:var(--apv-bg)}.apv-primary:hover{filter:brightness(1.15)}
.apv-kbd{font:500 10px/1 Inter,system-ui,sans-serif;padding:3px 5px;border-radius:4px;background:var(--apv-soft);color:var(--apv-faint)}
.apv-primary .apv-kbd{background:color-mix(in srgb,var(--apv-bg) 16%,transparent);color:color-mix(in srgb,var(--apv-bg) 70%,transparent)}
.apv-spin{width:13px;height:13px;border:1.6px solid currentColor;border-right-color:transparent;border-radius:50%;animation:apv-spin .8s linear infinite}
.apv-tray{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:8px 6px 4px 10px}
.apv-tray .apv-expiry{margin-right:auto}
.apv-resolved{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--apv-bg);border:1px solid var(--apv-line);border-radius:12px;outline:none;animation:apv-in .3s ease-out}
.apv-resolved strong{font-weight:500;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.apv-mark{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:color-mix(in srgb,var(--apv-green) 14%,transparent);color:var(--apv-green)}
.apv-mark.denied{background:var(--apv-soft);color:var(--apv-muted)}
.apv-mark svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:20;animation:apv-draw .4s ease-out}
.apv-state{color:var(--apv-muted);font-size:13px}
.apv-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.apv-people{display:flex;align-items:center;gap:8px;min-width:0}
.apv-avs{display:flex}.apv-avs span{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;border:2px solid var(--apv-bg);margin-left:-6px;font-size:10px;font-weight:600;color:#3f3f46}.apv-avs span:first-child{margin-left:0}
.apv-people em{font-style:normal;color:var(--apv-muted)}
.apv :focus-visible{outline:2px solid var(--apv-accent);outline-offset:2px}
@keyframes apv-in{from{opacity:0;filter:blur(2px);transform:translateY(3px)}}
@keyframes apv-spin{to{transform:rotate(360deg)}}
@keyframes apv-draw{from{stroke-dashoffset:20}}
@container apv (max-width:400px){.apv-foot{flex-wrap:wrap}.apv-actions{width:100%}.apv-actions .apv-btn{flex:1}.apv-kbd{display:none}}
@container apv (max-width:340px){.apv-risk-word{display:none}}
@media(pointer:coarse){.apv-kbd{display:none}}
@media(prefers-reduced-motion:reduce){.apv *{animation:none!important;transition:none!important}.apv-spin{animation:apv-spin 2s linear infinite!important}}
`;
const fmt = (n) => new Intl.NumberFormat("en-US").format(Math.round(Math.abs(n))).replace(/,/g, " ");
function balances(opening, days2, events) {
  const out = [];
  let b = opening;
  for (let d = 1; d <= days2; d++) {
    for (const e of events) if (e.day === d) b += e.amount;
    out.push(b);
  }
  return out;
}
const W = 960, H = 320, MID = 160, PAD = 24, HALF = 64;
function riverPath(vals, max) {
  const n = vals.length;
  const x = (i) => PAD + i * (W - 2 * PAD) / (n - 1);
  const half = (v) => Math.max(3, Math.max(v, 0) / max * HALF);
  const top = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${(MID - half(v)).toFixed(1)}`).join(" ");
  const bottom = vals.map((_, i) => `L${x(n - 1 - i).toFixed(1)} ${(MID + half(vals[n - 1 - i])).toFixed(1)}`).join(" ");
  return { d: `${top} ${bottom} Z`, x, half };
}
const CSS$1 = `
.cr{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-surface);border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);padding:var(--ts-space-4,16px);display:grid;gap:var(--ts-space-3,12px);min-width:0}
.cr-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px}
.cr-head h3{margin:0;font:var(--ts-head-weight,600) 16px/1.3 var(--ts-font-head,var(--ts-font))}
.cr-head p{margin:0;font-size:12px;color:var(--ts-muted)}
.cr-body{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--ts-space-4,16px)}
.cr-body.has-side{grid-template-columns:minmax(0,1fr) 260px}
.cr svg{display:block;width:100%;height:auto;overflow:visible}
.cr-band{fill:color-mix(in srgb,var(--ts-series-3) 55%,var(--ts-surface))}
.cr-was{fill:none;stroke:var(--ts-muted);stroke-width:1.2;stroke-dasharray:4 4}
.cr-mid{stroke:color-mix(in srgb,var(--ts-surface) 60%,transparent);stroke-width:1}
.cr-danger{fill:var(--ts-status-error-fg)}
.cr-today{stroke:var(--ts-electric);stroke-width:1.5}
.cr-pin{stroke:var(--ts-muted);stroke-width:1}
.cr-dot{fill:var(--ts-fg)}
.cr-lbl{font-size:11px;fill:var(--ts-fg)}.cr-amt{font-size:10.5px;fill:var(--ts-muted);font-variant-numeric:tabular-nums}
.cr-day{font-size:10px;fill:var(--ts-faint);font-variant-numeric:tabular-nums}
.cr-side{display:grid;gap:10px;align-content:start;font-size:13px}
.cr-tog{color:inherit;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-control,8px);background:var(--ts-page);cursor:pointer;text-align:left;width:100%}
.cr-tog[aria-pressed=true]{border-color:var(--ts-status-needs-you-border);background:var(--ts-status-needs-you-bg)}
.cr-tog small{display:block;color:var(--ts-muted);font-size:11.5px}
.cr-tog i{flex:none;width:30px;height:18px;border-radius:9px;background:var(--ts-soft-2);position:relative}
.cr-tog i::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--ts-surface);box-shadow:0 0 0 1px var(--ts-line);transition:left var(--ts-motion-dur-xs,120ms)}
.cr-tog[aria-pressed=true] i{background:var(--ts-status-needs-you-fg)}.cr-tog[aria-pressed=true] i::after{left:14px}
.cr-tog:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.cr-out{display:grid;gap:2px;padding:10px 12px;border-radius:var(--ts-radius-control,8px);background:var(--ts-soft)}
.cr-out b{font-variant-numeric:tabular-nums}.cr-out .is-bad{color:var(--ts-status-error-fg)}
.cr-agent{padding:10px 12px;border-radius:var(--ts-radius-control,8px);border:1px solid var(--ts-status-done-border);background:var(--ts-status-done-bg);color:var(--ts-fg);font-size:12.5px;line-height:1.5}
.cr-agent small{display:block;font:500 10.5px/1.4 var(--ts-font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-status-done-fg)}
@media (max-width:760px){.cr-body.has-side{grid-template-columns:minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){.cr *{transition:none!important}}
`;
function CashRiver({ title = "Мөнгөний гол", opening, days: days2 = 31, today, floor, events, scenario, suggestion, unit = "сая ₮", className = "" }) {
  const [on, setOn] = React.useState(() => Object.fromEntries((scenario ?? []).map((t) => [t.id, !!t.on])));
  const base = balances(opening, days2, events);
  const extra = (scenario ?? []).filter((t) => on[t.id]).map((t) => ({ day: t.day, amount: t.amount }));
  const vals = scenario ? balances(opening, days2, [...events, ...extra]) : base;
  const max = Math.max(...base, ...vals, floor) * 1.05;
  const river = riverPath(vals, max);
  const was = scenario && extra.length ? riverPath(base, max) : null;
  const danger = vals.map((v, i) => v < floor ? i : -1).filter((i) => i >= 0);
  const minIdx = vals.indexOf(Math.min(...vals));
  const dangerDays = danger.length;
  const baseDanger = base.filter((v) => v < floor).length;
  const x = river.x;
  const pins = [...events.map((e) => ({ ...e, scen: false })), ...(scenario ?? []).filter((t) => on[t.id]).map((t) => ({ id: t.id, day: t.day, label: t.label, amount: t.amount, pending: true, scen: true }))];
  let up = 0, down = 0;
  return /* @__PURE__ */ jsxs("section", { className: `cr ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: CSS$1 }),
    /* @__PURE__ */ jsxs("header", { className: "cr-head", children: [
      /* @__PURE__ */ jsx("h3", { children: title }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Голын өргөн = дансны үлдэгдэл · дээрээс орлого, доошоо зарлага · ",
        unit
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `cr-body ${scenario ? "has-side" : ""}`, children: [
      /* @__PURE__ */ jsxs("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${title}: эхэнд ${fmt(opening)}, хамгийн бага ${fmt(vals[minIdx])} (${minIdx + 1}-нд), аюулгүйн хязгаар ${fmt(floor)} ${unit}${dangerDays ? `, ${dangerDays} өдөр хязгаараас доош` : ""}`, children: [
        /* @__PURE__ */ jsx("path", { className: "cr-band", d: river.d }),
        was && /* @__PURE__ */ jsx("path", { className: "cr-was", d: was.d }),
        /* @__PURE__ */ jsx("line", { className: "cr-mid", x1: PAD, x2: W - PAD, y1: MID, y2: MID }),
        danger.map((i) => /* @__PURE__ */ jsx("rect", { className: "cr-danger", x: x(i) - 4, y: MID - river.half(vals[i]) - 2, width: 8, height: river.half(vals[i]) * 2 + 4, rx: 2 }, i)),
        today && /* @__PURE__ */ jsx("line", { className: "cr-today", x1: x(today - 1), x2: x(today - 1), y1: MID - HALF - 6, y2: MID + HALF + 6 }),
        today && /* @__PURE__ */ jsx("text", { className: "cr-day", x: x(today - 1), y: H - 18, textAnchor: "middle", style: { fill: "var(--ts-electric-fg)" }, children: "Өнөөдөр" }),
        pins.map((p) => {
          const above = p.amount > 0;
          const slot = above ? up++ : down++;
          const px = x(p.day - 1);
          const edge = above ? MID - river.half(vals[p.day - 1]) : MID + river.half(vals[p.day - 1]);
          const ty = above ? 16 + slot % 3 * 24 : MID + HALF + 22 + slot % 3 * 24;
          return /* @__PURE__ */ jsxs("g", { children: [
            /* @__PURE__ */ jsx("line", { className: "cr-pin", x1: px, x2: px, y1: edge, y2: above ? ty + 14 : ty - 11, strokeDasharray: p.pending ? "2 2" : void 0 }),
            /* @__PURE__ */ jsx("circle", { className: "cr-dot", cx: px, cy: edge, r: 2.5 }),
            /* @__PURE__ */ jsxs("text", { className: "cr-lbl", x: px + 4, y: above ? ty : ty, children: [
              p.label,
              p.pending ? " ?" : ""
            ] }),
            /* @__PURE__ */ jsxs("text", { className: "cr-amt", x: px + 4, y: above ? ty + 12 : ty + 12, children: [
              p.amount > 0 ? "+" : "−",
              fmt(p.amount)
            ] })
          ] }, p.id);
        }),
        Array.from({ length: days2 }, (_, i) => (i + 1) % 5 === 1 || i + 1 === days2 ? /* @__PURE__ */ jsx("text", { className: "cr-day", x: x(i), y: H - 2, textAnchor: "middle", children: i + 1 }, i) : null)
      ] }),
      scenario && /* @__PURE__ */ jsxs("aside", { className: "cr-side", "aria-label": "Хэрэв… горим", children: [
        /* @__PURE__ */ jsx("small", { style: { font: "500 10.5px/1.4 var(--ts-font-mono)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ts-faint)" }, children: "Хэрэв…" }),
        scenario.map((t) => /* @__PURE__ */ jsxs("button", { type: "button", className: "cr-tog", "aria-pressed": !!on[t.id], onClick: () => setOn((o) => ({ ...o, [t.id]: !o[t.id] })), children: [
          /* @__PURE__ */ jsxs("span", { children: [
            t.label,
            /* @__PURE__ */ jsx("small", { children: t.detail ?? `${t.day}-нд · ${t.amount > 0 ? "+" : "−"}${fmt(t.amount)} ${unit}` })
          ] }),
          /* @__PURE__ */ jsx("i", { "aria-hidden": "true" })
        ] }, t.id)),
        /* @__PURE__ */ jsxs("div", { className: "cr-out", "aria-live": "polite", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Хамгийн бага үлдэгдэл: ",
            /* @__PURE__ */ jsxs("b", { className: vals[minIdx] < floor ? "is-bad" : void 0, children: [
              fmt(vals[minIdx]),
              " ",
              unit
            ] }),
            " (",
            minIdx + 1,
            "-нд)"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Аюултай өдөр: ",
            /* @__PURE__ */ jsxs("b", { className: dangerDays ? "is-bad" : void 0, children: [
              baseDanger,
              " → ",
              dangerDays
            ] })
          ] })
        ] }),
        suggestion && /* @__PURE__ */ jsxs("p", { className: "cr-agent", children: [
          /* @__PURE__ */ jsx("small", { children: "Агентын санал" }),
          suggestion
        ] })
      ] })
    ] })
  ] });
}
const cashRiverDemo = {
  opening: 1385,
  today: 7,
  floor: 900,
  events: [
    { id: "dom", day: 1, label: "Домэйн ба хэрэгсэл", amount: -40 },
    { id: "c3", day: 5, label: "Харилцагч №3", amount: 420 },
    { id: "pay", day: 10, label: "Цалин", amount: -285 },
    { id: "inv4", day: 12, label: "Нэхэмжлэх №4", amount: 310 },
    { id: "fuel", day: 15, label: "Түлш", amount: -312 },
    { id: "rep", day: 20, label: "Их засвар", amount: -96, pending: true },
    { id: "way", day: 22, label: "Нэхэмжлэх · Way", amount: 260 },
    { id: "rent", day: 25, label: "Агуулахын түрээс", amount: -60 },
    { id: "lease", day: 24, label: "Лизинг", amount: -380 },
    { id: "big", day: 26, label: "Гэрээт тээвэр", amount: 250 }
  ],
  scenario: [
    { id: "truck", label: "Шинэ машины урьдчилгаа", day: 23, amount: -420, on: true },
    { id: "store", label: "Хоёр дахь агуулахын барьцаа", day: 28, amount: -90 }
  ],
  suggestion: "Урьдчилгааг 26-нд гэрээт тээврийн орлого орсны дараа, 27-нд төлбөл үлдэгдэл аюулгүйн хязгаараас дээш үлдэнэ."
};
const mn = (n) => new Intl.NumberFormat("en-US").format(Math.abs(n)).replace(/,/g, " ");
const signed = (n) => n > 0 ? `+${mn(n)}` : n < 0 ? `−${mn(n)}` : "0";
const doc = (size = 12) => /* @__PURE__ */ jsx(SourceIcon, { kind: "document", size, tile: false });
const financeReportDemo = {
  company: "ac.me Cargo",
  period: "2026 оны 10-р сар",
  unit: "сая ₮",
  kpis: [
    { label: "Орлого", value: "1 240", delta: "+60 өмнөх сараас", trend: "up", good: true, cite: "2" },
    { label: "Зардал", value: "800", delta: "+86 өмнөх сараас", trend: "up", good: false, cite: "1" },
    { label: "Цэвэр ашиг", value: "440", delta: "−26 өмнөх сараас", trend: "down", good: false, cite: "1" },
    { label: "Мөнгөн үлдэгдэл", value: "1 615", delta: "+230 өмнөх сараас", trend: "up", good: true, cite: "2" }
  ],
  pnl: [
    { id: "rev", line: "Тээврийн орлого", now: 1240, prev: 1180, cite: "[2]" },
    { id: "fuel", line: "Түлш", now: -312, prev: -268, cite: "[4]" },
    { id: "pay", line: "Цалин", now: -285, prev: -280, cite: "[1]" },
    { id: "rep", line: "Засвар үйлчилгээ", now: -96, prev: -54, cite: "[3]" },
    { id: "rent", line: "Агуулахын түрээс", now: -60, prev: -60, cite: "[1]" },
    { id: "oth", line: "Бусад зардал", now: -47, prev: -52, cite: "[1]" },
    { id: "net", line: "Цэвэр ашиг", now: 440, prev: 466, cite: "[1]", total: true }
  ],
  cash: {
    labels: ["5-р", "6-р", "7-р", "8-р", "9-р", "10-р"],
    series: [
      { label: "Орох мөнгө", color: "var(--ts-series-1)", values: [980, 1040, 1110, 1150, 1180, 1240] },
      { label: "Гарах мөнгө", color: "var(--ts-series-2)", values: [760, 780, 820, 850, 890, 1010] }
    ],
    value: "1 615 сая",
    delta: 230
  },
  variance: [
    { text: "Цэвэр ашиг 440 сая төгрөг болж, өмнөх сараас 26 саяар буурсан.", cite: ["1"] },
    { text: " Хоёр ачааны машины их засвар зардлыг 42 саяар нэмсэн.", cite: ["3"] },
    { text: " Түлшний зардал 44 саяар өссөн: литрийн үнэ 4%, маршрутын тоо 6% нэмэгдсэн.", cite: ["4"] },
    { text: " Орлогын 60 саяын өсөлт банкны хуулгатай таарч байна.", cite: ["2"] }
  ],
  sources: [
    { id: "1", title: "Ерөнхий журнал · 10-р сар", site: "Нягтлан бодох бүртгэл", date: "2026.10", quote: "1 284 гүйлгээ, 10-р сарын хаалт. Зардлын нийт дүн 800 сая төгрөг.", highlight: "800 сая", icon: doc() },
    { id: "2", title: "Банкны хуулга · 10-р сар", site: "Банк", date: "2026.10", quote: "Орсон гүйлгээ 1 240 сая, гарсан 1 010 сая; сарын эцсийн үлдэгдэл 1 615 сая.", highlight: "1 240 сая", icon: doc() },
    { id: "3", title: "Засварын нэхэмжлэх №2026-118", site: "Нийлүүлэгч", date: "2026.10.21", quote: "Хоёр ачааны машины хөдөлгүүрийн их засвар, нийт 42 сая төгрөг.", highlight: "их засвар", icon: doc() },
    { id: "4", title: "Түлшний картын тайлан", site: "Түлшний карт", date: "2026.10", quote: "Литрийн дундаж үнэ 4% өссөн, маршрутын тоо 6% нэмэгдсэн.", highlight: "4% өссөн", icon: doc() }
  ],
  steps: [
    { id: "read", tokensIn: 18400, tokensOut: 620, name: "Ерөнхий журнал уншив", kind: "tool", status: "done", detail: "1 284 гүйлгээ", duration: 6200, cost: 420 },
    { id: "bank", tokensIn: 9200, tokensOut: 310, name: "Банкны хуулгатай тулгав", kind: "tool", status: "done", detail: "зөрүү 0", duration: 3400, cost: 260 },
    {
      id: "var",
      tokensIn: 14800,
      tokensOut: 1900,
      name: "Зөрүүг тайлбарлав",
      kind: "agent",
      status: "done",
      detail: "4 эх сурвалж",
      duration: 8100,
      cost: 910,
      children: [
        { id: "inv", tokensIn: 2600, tokensOut: 180, name: "Засварын нэхэмжлэх олов", kind: "tool", status: "done", duration: 1600, cost: 120 },
        { id: "fuelc", tokensIn: 3900, tokensOut: 240, name: "Түлшний картын тайлан уншив", kind: "tool", status: "done", duration: 2200, cost: 150 }
      ]
    },
    { id: "draft", tokensIn: 6100, tokensOut: 2400, name: "Тайлангийн ноорог бичив", kind: "agent", status: "done", detail: "батлалтад илгээв", duration: 4500, cost: 380 }
  ],
  approval: {
    title: "10-р сарын тайланг батлах",
    description: "Агент бэлдсэн — менежер батална",
    details: [
      { label: "Цэвэр ашиг", value: "440 сая ₮" },
      { label: "Өмнөх сараас", value: "−26 сая ₮ (−5.6%)" },
      { label: "Эх сурвалж", value: "4 баримт, бүгд тулгагдсан" }
    ]
  },
  note: "ac.me — жишээ өгөгдөл, бодит харилцагч биш"
};
const CSS = `
.fr{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);display:grid;gap:var(--ts-space-4,16px)}
.fr-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:var(--ts-space-2,8px)}
.fr-head h2{margin:0;font:var(--ts-head-weight,600) 22px/1.2 var(--ts-font-head,var(--ts-font));letter-spacing:-.02em}
.fr-head p{margin:0;color:var(--ts-muted);font-size:13px}
.fr-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--ts-space-3,12px)}
.fr-kpi{background:var(--ts-surface);border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);padding:var(--ts-space-3,12px) var(--ts-space-4,16px);display:grid;gap:4px}
.fr-kpi small{font:500 11px/1.3 var(--ts-font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.fr-kpi b{font:var(--ts-head-weight,600) 28px/1.1 var(--ts-font-head,var(--ts-font));font-variant-numeric:tabular-nums}
.fr-kpi span{font-size:12px;color:var(--ts-muted);font-variant-numeric:tabular-nums}
.fr-kpi span[data-good=true]{color:var(--ts-status-done-fg)}.fr-kpi span[data-good=false]{color:var(--ts-status-error-fg)}
.fr-kpi sup{font-size:10px;color:var(--ts-electric-fg);margin-left:2px}
.fr-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:var(--ts-space-4,16px);align-items:start}
.fr-row>*{min-width:0;max-width:none}
.fr-wide{min-width:0}
.fr-note{margin:0;font:500 11px/1.4 var(--ts-font-mono);color:var(--ts-faint)}
@media (max-width:860px){.fr-row{grid-template-columns:minmax(0,1fr)}}
`;
function FinanceReport({ theme, className = "", ...data }) {
  const d = { ...financeReportDemo, ...data };
  const dark = theme === "dark";
  const columns = [
    { key: "line", label: "Мөр", type: "title" },
    { key: "now", label: `${d.period.replace(/^\d+ оны /, "")}, ${d.unit}`, type: "number", format: signed },
    { key: "prev", label: "Өмнөх сар", type: "number", format: signed },
    { key: "diff", label: "Зөрүү", type: "number", format: signed },
    { key: "cite", label: "Эх", type: "tag" }
  ];
  const rows = d.pnl.map((l) => ({ id: l.id, line: l.line, now: l.now, prev: l.prev, diff: l.now - l.prev, cite: l.cite }));
  const tagTones = Object.fromEntries(d.pnl.map((l) => [l.cite, "blue"]));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `fr ${dark ? "dark" : ""} ${className}`,
      "data-ts-theme": theme ? dark ? "dark" : "cream" : void 0,
      "data-theme": theme,
      children: [
        /* @__PURE__ */ jsx("style", { children: CSS }),
        /* @__PURE__ */ jsxs("header", { className: "fr-head", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h2", { children: [
              "Санхүүгийн тайлан · ",
              d.period
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              d.company,
              " · Агент эх өгөгдлөөс бэлдсэн, тоо бүр эх сурвалжтай"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "fr-note", children: d.note })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "fr-kpis", "aria-label": "Гол үзүүлэлт", children: d.kpis.map((k) => /* @__PURE__ */ jsxs("div", { className: "fr-kpi", children: [
          /* @__PURE__ */ jsxs("small", { children: [
            k.label,
            ", ",
            d.unit
          ] }),
          /* @__PURE__ */ jsxs("b", { children: [
            k.value,
            k.cite && /* @__PURE__ */ jsxs("sup", { children: [
              "[",
              k.cite,
              "]"
            ] })
          ] }),
          k.delta && /* @__PURE__ */ jsxs("span", { "data-trend": k.trend, "data-good": k.good === void 0 ? void 0 : String(k.good), children: [
            k.trend === "up" ? "▲ " : k.trend === "down" ? "▼ " : "",
            k.delta
          ] })
        ] }, k.label)) }),
        /* @__PURE__ */ jsxs("div", { className: "fr-row", children: [
          /* @__PURE__ */ jsx(DataTable, { title: "Ашиг, алдагдлын тайлан", columns, rows, tagTones, editable: false }),
          /* @__PURE__ */ jsx(CitedAnswer, { segments: d.variance, sources: d.sources, theme })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "fr-row", children: [
          /* @__PURE__ */ jsx(KPIChart, { title: "Мөнгөн урсгал · үлдэгдэл", value: d.cash.value, delta: d.cash.delta, labels: d.cash.labels, tooltipLabels: d.cash.labels.map((l) => `${l} сар`), series: d.cash.series, format: (n) => mn(n), footer: "Орох ба гарах мөнгө, сүүлийн 6 сар, сая ₮" }),
          /* @__PURE__ */ jsx(ApprovalCard, { title: d.approval.title, description: d.approval.description, risk: "medium", details: d.approval.details })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "fr-wide", children: /* @__PURE__ */ jsx(CashRiver, { ...cashRiverDemo, title: "Мөнгөний гол · 10-р сар" }) }),
        /* @__PURE__ */ jsx("div", { className: "fr-wide", children: /* @__PURE__ */ jsx(CostWaterfall, { title: "Агент тайланг хэрхэн бэлдсэн", task: `Санхүүгийн тайлан · ${d.period}`, steps: d.steps, status: "done", defaultCollapsed: [], formatCost: (n) => `${mn(n)} ₮` }) })
      ]
    }
  );
}
export {
  springKeyframes as $,
  AgentTrail as A,
  BRAND_LOGO as B,
  CitedAnswer as C,
  DecisionCard as D,
  EASINGS as E,
  FinanceReport as F,
  askWindowLabelsMn as G,
  askWindowMicroMn as H,
  brandTrademarkNoteMn as I,
  cashRiverDemo as J,
  dampingRatio as K,
  LOOP as L,
  MotionStyles as M,
  financeReportDemo as N,
  loopAnimation as O,
  moduleSceneDemo as P,
  motionControlLabelsMn as Q,
  RunningNow as R,
  SOURCE_ICON as S,
  motionCss as T,
  UNCONTROLLED_MAX_MS as U,
  motionTokensCss as V,
  motionVar as W,
  sourcePreviewLabelsMn as X,
  springAt as Y,
  springDuration as Z,
  springEasing as _,
  syncAnimation as a,
  useCaseRunDemo as a0,
  useInViewLoop as a1,
  useLoop as a2,
  useMotion as a3,
  usePrefersReducedMotion as a4,
  ApprovalCard as a5,
  CostWaterfall as a6,
  DataTable as a7,
  KPIChart as a8,
  ThinkingState as a9,
  MotionControls as b,
  MotionProvider as c,
  AgentPlan as d,
  MemoryPanel as e,
  AskWindow as f,
  BRAND_MARK as g,
  BRAND_NAME as h,
  CashRiver as i,
  DURATIONS as j,
  LOOPS as k,
  LOOP_NOTES as l,
  LoopRegion as m,
  ModuleScene as n,
  MotionContext as o,
  SPRINGS as p,
  ScenarioRegion as q,
  regionState as r,
  spring as s,
  SourceIcon as t,
  useScenario as u,
  SourcePreview as v,
  UseCaseRun as w,
  askNavMn as x,
  askWindowDemo as y,
  askWindowDemoNote as z
};
//# sourceMappingURL=finance-report-BFrMQE5w.js.map
