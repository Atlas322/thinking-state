import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const defaultLabels$1 = { working: "Ажиллаж байна", picture: "Хэлтэс бүр нэг тархинд холбогдсон" };
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
  const L = { ...defaultLabels$1, ...labelsProp };
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
    /* @__PURE__ */ jsx("style", { children: css$1 }),
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
const css$1 = `
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
  ModuleScene as M,
  moduleSceneDemo as m
};
//# sourceMappingURL=agent-trail-yBPyhEQ3.js.map
