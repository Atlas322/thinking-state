import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const defaultLabels = {
  owner: "Хариуцагч",
  updated: "Шинэчилсэн",
  progress: "Явц",
  phases: "Үе шат",
  waiting: "Таныг хүлээж байна",
  nothingWaiting: "Одоогоор таныг хүлээж буй зүйл алга.",
  view: "Харагдац",
  status: "Төлөв",
  cards: "Карт",
  scope: "Харах",
  all: "Бүгд",
  mine: "Минийх",
  sharedWith: "Хуваалцсан:",
  done: "Дууссан",
  active: "Хийгдэж байна",
  blocked: "Түгжигдсэн",
  next: "Дараагийн"
};
const projectReportDemo = {
  project: {
    name: "ac.me хайрцаг · Өвлийн хайрцгийн нээлт",
    icon: "Х",
    status: { label: "Төлөвлөгөөний дагуу", tone: "green" },
    owner: "Ану",
    sharedWith: ["Бат", "Цэцэг", "Төслийн агент"],
    updated: "11-р сарын 12, 14:20",
    summary: "Нүүр хуудас ба түр зогсоох урсгал хянагдаж байна; үндсэн орчинд байршуулах нь нэг тохиргоог хүлээж байна."
  },
  me: "Ану",
  kpis: [
    { label: "Дууссан даалгавар", value: 34, unit: "/52", note: "+6 энэ долоо хоногт", tone: "green" },
    { label: "Нээлттэй PR", value: 3, note: "1 шалгалт унасан", tone: "amber" },
    { label: "Шийдвэр", value: 2, note: "таныг хүлээж байна", tone: "amber" },
    { label: "Нээлт хүртэл хоног", value: 9, tone: "blue" }
  ],
  progress: {
    value: 65,
    label: "Бүтээх үе, 3/4 долоо хоног",
    milestones: [
      { at: 20, label: "Бриф" },
      { at: 45, label: "Дизайн" },
      { at: 80, label: "Урьдчилсан" },
      { at: 100, label: "Нээлт" }
    ]
  },
  phases: [
    { id: "research", title: "Хэрэглэгчийн судалгаа", state: "done", line: "27 ярилцлага, 4 сэдэв", date: "10-р сарын 6", owner: "Цэцэг" },
    { id: "design", title: "Хайрцаг ба нүүр хуудасны дизайн", state: "done", line: "Хянаад батлагдсан", date: "10-р сарын 24", owner: "Ану", sharedWith: ["Цэцэг"] },
    { id: "build", title: "Нүүр хуудас ба түр зогсоох урсгал", state: "active", line: "2/3 PR ногоон", date: "11-р сарын 14", progress: 70, owner: "Бат", sharedWith: ["Ану"] },
    { id: "deploy", title: "Үндсэн орчинд байршуулах", state: "blocked", line: "Дутуу нэг тохиргоог хүлээж байна", date: "11-р сарын 15", owner: "Бат" },
    { id: "launch", title: "Нээлт ба анхны хүргэлт", state: "next", line: "Дархан ба Улаанбаатар", date: "11-р сарын 21", owner: "Ану" }
  ],
  waiting: [
    { id: "copy", title: "Нүүр хуудасны бичвэрийг батлах", line: "Гурван гарчгийн хувилбар, нэгийг санал болгосон", action: "Хянах", owner: "Ану" },
    { id: "promote", title: "Урьдчилсан хувилбарыг үндсэн орчинд гаргах", line: "Тохиргоо нэмэгдмэгц шууд ажиллана", action: "Батлах", tone: "amber", owner: "Ану", sharedWith: ["Бат"] }
  ]
};
const PHASE_STATES = ["done", "active", "blocked", "next"];
function toPhaseState(value) {
  const v = (value ?? "").toLowerCase().replace(/[\s_]+/g, "-");
  if (PHASE_STATES.includes(v)) return v;
  if (["completed", "complete", "cancelled", "canceled"].includes(v)) return "done";
  if (["in-progress", "running", "doing"].includes(v)) return "active";
  if (["waiting", "waiting-on", "stuck", "failed"].includes(v)) return "blocked";
  return "next";
}
const isMine = (x, me) => !!me && (x.owner === me || (x.sharedWith ?? []).includes(me));
const initials = (name) => name.trim().split(/\s+/).map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase();
function Who({ x, label }) {
  if (!x.owner && !x.sharedWith?.length) return null;
  const more = x.sharedWith?.length ?? 0;
  const text = [x.owner, more ? `${label} ${x.sharedWith.join(", ")}` : ""].filter(Boolean).join(" · ");
  return /* @__PURE__ */ jsxs("span", { className: "rp-who", title: text, children: [
    x.owner && /* @__PURE__ */ jsx("span", { className: "rp-ava", "aria-hidden": "true", children: initials(x.owner) }),
    more > 0 && /* @__PURE__ */ jsxs("span", { className: "rp-more", "aria-hidden": "true", children: [
      "+",
      more
    ] }),
    /* @__PURE__ */ jsx("span", { className: "rp-sr", children: text })
  ] });
}
const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
function useCountUp(target, delay) {
  const [value, setValue] = React.useState(target);
  const shown = React.useRef(0);
  useIsoLayoutEffect(() => {
    if (reducedMotion() || typeof requestAnimationFrame === "undefined") {
      shown.current = target;
      setValue(target);
      return;
    }
    const from = shown.current;
    setValue(from);
    let raf = 0;
    let start = 0;
    const duration = from === 0 ? 900 : 400;
    const wait = from === 0 ? delay : 0;
    const tick = (t) => {
      if (!start) start = t + wait;
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      shown.current = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      setValue(shown.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delay]);
  return value;
}
function Kpi({ k, index }) {
  const shown = useCountUp(k.value, index * 90);
  return /* @__PURE__ */ jsxs("div", { className: `rp-kpi rp-kt-${k.tone ?? "gray"}`, style: { "--i": index }, children: [
    /* @__PURE__ */ jsx("dt", { children: k.label }),
    /* @__PURE__ */ jsxs("dd", { children: [
      /* @__PURE__ */ jsxs("span", { className: "rp-num", children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", "data-cw-count": k.value, "data-cw-delay": index * 90, children: shown }),
        /* @__PURE__ */ jsx("span", { className: "rp-sr", children: k.value }),
        k.unit && /* @__PURE__ */ jsx("span", { className: "rp-unit", children: k.unit })
      ] }),
      k.note && /* @__PURE__ */ jsx("span", { className: "rp-note", children: k.note })
    ] })
  ] });
}
const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? Number(n) : 0));
function Marker({ state }) {
  return /* @__PURE__ */ jsxs("span", { className: "rp-mark", "data-s": state, "aria-hidden": "true", children: [
    state === "done" && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "m4.5 8.2 2.3 2.3 4.7-4.9", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) }),
    state === "blocked" && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M8 4.5v4.2M8 11.2v.1", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }) })
  ] });
}
function ProjectReport({
  project = projectReportDemo.project,
  kpis = projectReportDemo.kpis,
  progress = projectReportDemo.progress,
  phases = projectReportDemo.phases,
  waiting = projectReportDemo.waiting,
  me: meProp,
  view: viewProp,
  defaultView = "status",
  onViewChange,
  scope: scopeProp,
  defaultScope = "all",
  onScopeChange,
  onWaitingAction,
  labels: labelsProp,
  className = ""
}) {
  const L = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const [viewOwn, setViewOwn] = React.useState(defaultView);
  const view = viewProp ?? viewOwn;
  const setView = (v) => {
    setViewOwn(v);
    onViewChange?.(v);
  };
  const refs = React.useRef([]);
  const views = ["status", "cards"];
  const icon = project.icon ?? project.name.trim().charAt(0).toUpperCase();
  const pct = clamp(progress?.value);
  const phaseList = (phases ?? []).map((p) => ({
    ...p,
    state: p.state ?? toPhaseState(p.status),
    date: p.date ?? p.due
  }));
  const waitList = waiting ?? [];
  const me = meProp ?? (phases === projectReportDemo.phases ? projectReportDemo.me : void 0);
  const [scopeOwn, setScopeOwn] = React.useState(defaultScope);
  const scope = me ? scopeProp ?? scopeOwn : "all";
  const setScope = (v) => {
    setScopeOwn(v);
    onScopeChange?.(v);
  };
  const other = (x) => me && !isMine(x, me) ? "" : void 0;
  const stateLabel = (s) => L[s];
  const phaseProgress = (p) => p.state === "done" ? 100 : p.state === "next" ? 0 : clamp(p.progress);
  return /* @__PURE__ */ jsxs("div", { className: `rp ${className}`, "data-cw-root": "project-report", "data-cw-views": "", "data-scope": scope, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("section", { className: "rp-head", "aria-labelledby": `${uid}-name`, children: [
      /* @__PURE__ */ jsxs("div", { className: "rp-id", children: [
        /* @__PURE__ */ jsx("span", { className: "rp-icon", "aria-hidden": "true", children: icon }),
        /* @__PURE__ */ jsxs("div", { className: "rp-titles", children: [
          /* @__PURE__ */ jsx("h2", { id: `${uid}-name`, className: "rp-name", children: project.name }),
          (project.owner || project.updated || !!project.sharedWith?.length) && /* @__PURE__ */ jsxs("p", { className: "rp-meta", children: [
            project.owner && /* @__PURE__ */ jsxs("span", { children: [
              L.owner,
              " · ",
              project.owner
            ] }),
            project.updated && /* @__PURE__ */ jsxs("span", { children: [
              L.updated,
              " ",
              project.updated
            ] }),
            project.sharedWith && project.sharedWith.length > 0 && /* @__PURE__ */ jsxs("span", { title: project.sharedWith.join(", "), children: [
              L.sharedWith,
              " ",
              project.sharedWith.length
            ] })
          ] })
        ] }),
        project.status && /* @__PURE__ */ jsx("span", { className: `rp-status rp-tone-${project.status.tone ?? "gray"}`, children: project.status.label })
      ] }),
      project.summary && /* @__PURE__ */ jsx("p", { className: "rp-summary", children: project.summary }),
      kpis && kpis.length > 0 && /* @__PURE__ */ jsx("dl", { className: "rp-kpis", children: kpis.map((k, i) => /* @__PURE__ */ jsx(Kpi, { k, index: i }, k.label + i)) }),
      progress && /* @__PURE__ */ jsxs("div", { className: "rp-progress", children: [
        /* @__PURE__ */ jsxs("div", { className: "rp-progress-top", children: [
          /* @__PURE__ */ jsx("span", { className: "rp-progress-label", children: progress.label ?? L.progress }),
          /* @__PURE__ */ jsxs("span", { className: "rp-progress-pct", children: [
            Math.round(pct),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rp-track",
            role: "progressbar",
            "aria-label": L.progress,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": Math.round(pct),
            children: [
              /* @__PURE__ */ jsx("span", { className: "rp-fill", style: { width: `${pct}%` } }),
              (progress.milestones ?? []).map((m) => /* @__PURE__ */ jsx("i", { className: `rp-tick${clamp(m.at) <= pct ? " is-past" : ""}`, style: { left: `${clamp(m.at)}%` } }, m.label + m.at))
            ]
          }
        ),
        progress.milestones && progress.milestones.length > 0 && /* @__PURE__ */ jsx("ol", { className: "rp-miles", "aria-label": L.progress, children: progress.milestones.map((m) => /* @__PURE__ */ jsx(
          "li",
          {
            className: clamp(m.at) <= pct ? "is-past" : "",
            style: { left: `${clamp(m.at)}%` },
            "data-edge": clamp(m.at) < 8 ? "start" : clamp(m.at) > 92 ? "end" : void 0,
            children: m.label
          },
          m.label + m.at
        )) })
      ] })
    ] }),
    phaseList.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rp-bar", children: [
      /* @__PURE__ */ jsx("h3", { className: "rp-h", children: L.phases }),
      me && /* @__PURE__ */ jsx("div", { className: "rp-seg rp-scope", role: "group", "aria-label": L.scope, children: ["all", "mine"].map((v) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-pressed": scope === v,
          className: "rp-seg-opt",
          "data-active": scope === v || void 0,
          "data-cw-scope-btn": v,
          onClick: () => setScope(v),
          children: v === "all" ? L.all : L.mine
        },
        v
      )) }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "rp-seg",
          role: "radiogroup",
          "aria-label": L.view,
          onKeyDown: (e) => {
            const k = e.key;
            if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(k)) return;
            e.preventDefault();
            const at = views.indexOf(view);
            const n = (at + (k === "ArrowRight" || k === "ArrowDown" ? 1 : -1) + views.length) % views.length;
            setView(views[n]);
            refs.current[n]?.focus();
          },
          children: views.map((v, i) => /* @__PURE__ */ jsx(
            "button",
            {
              ref: (el) => {
                refs.current[i] = el;
              },
              type: "button",
              role: "radio",
              "aria-checked": view === v,
              tabIndex: view === v ? 0 : -1,
              className: "rp-seg-opt",
              "data-active": view === v || void 0,
              "data-cw-view-btn": v,
              onClick: () => setView(v),
              children: v === "status" ? L.status : L.cards
            },
            v
          ))
        }
      )
    ] }),
    phaseList.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("ol", { className: "rp-phases rp-view", "data-cw-view-panel": "status", hidden: view !== "status", children: phaseList.map((p, i) => /* @__PURE__ */ jsxs("li", { className: `rp-phase is-${p.state}`, style: { "--i": i }, "data-cw-other": other(p), children: [
        /* @__PURE__ */ jsx(Marker, { state: p.state }),
        /* @__PURE__ */ jsxs("div", { className: "rp-ptext", children: [
          /* @__PURE__ */ jsx("span", { className: "rp-ptitle", children: p.title }),
          p.line && /* @__PURE__ */ jsx("span", { className: "rp-pline", children: p.line }),
          p.state === "active" && /* @__PURE__ */ jsx("span", { className: "rp-mini", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { style: { width: `${phaseProgress(p)}%` } }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rp-pside", children: [
          /* @__PURE__ */ jsxs("span", { className: "rp-pside-top", children: [
            /* @__PURE__ */ jsx(Who, { x: p, label: L.sharedWith }),
            /* @__PURE__ */ jsx("span", { className: "rp-ptag", children: stateLabel(p.state) })
          ] }),
          p.date && /* @__PURE__ */ jsx("span", { className: "rp-pdate", children: p.date })
        ] })
      ] }, p.id)) }),
      /* @__PURE__ */ jsx("ul", { className: "rp-cards rp-view", "data-cw-view-panel": "cards", hidden: view !== "cards", children: phaseList.map((p, i) => /* @__PURE__ */ jsxs("li", { className: `rp-card is-${p.state}`, style: { "--i": i }, "data-cw-other": other(p), children: [
        /* @__PURE__ */ jsxs("span", { className: "rp-card-top", children: [
          /* @__PURE__ */ jsx(Marker, { state: p.state }),
          /* @__PURE__ */ jsx("span", { className: "rp-ptag", children: stateLabel(p.state) }),
          p.date && /* @__PURE__ */ jsx("span", { className: "rp-pdate", children: p.date })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "rp-ptitle", children: p.title }),
        p.line && /* @__PURE__ */ jsx("span", { className: "rp-pline", children: p.line }),
        /* @__PURE__ */ jsx(Who, { x: p, label: L.sharedWith }),
        /* @__PURE__ */ jsx("span", { className: "rp-mini", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { style: { width: `${phaseProgress(p)}%` } }) })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: `rp-wait${waitList.length ? "" : " is-empty"}`, "aria-labelledby": `${uid}-wait`, children: [
      /* @__PURE__ */ jsxs("h3", { id: `${uid}-wait`, className: "rp-wait-h", children: [
        /* @__PURE__ */ jsx("span", { className: "rp-wait-dot", "aria-hidden": "true" }),
        L.waiting,
        waitList.length > 0 && /* @__PURE__ */ jsx("span", { className: "rp-wait-count", children: waitList.length })
      ] }),
      waitList.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rp-wait-empty", children: L.nothingWaiting }) : /* @__PURE__ */ jsx("ul", { className: "rp-wait-list", children: waitList.map((w, i) => /* @__PURE__ */ jsxs("li", { className: `rp-witem rp-wt-${w.tone ?? "blue"}`, style: { "--i": i }, "data-cw-other": other(w), children: [
        /* @__PURE__ */ jsxs("span", { className: "rp-wtext", children: [
          /* @__PURE__ */ jsx("span", { className: "rp-wtitle", children: w.title }),
          w.line && /* @__PURE__ */ jsx("span", { className: "rp-wline", children: w.line })
        ] }),
        w.action && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "rp-wbtn",
            "data-cw-prompt": `${w.action}: ${w.title}`,
            onClick: () => onWaitingAction?.(w),
            children: w.action
          }
        )
      ] }, w.id)) })
    ] })
  ] });
}
const css = `
.rp{--rp-bg:var(--ts-surface,#fff);--rp-fg:var(--ts-fg,#18181b);--rp-muted:var(--ts-muted,#65656d);--rp-faint:var(--ts-faint,#65656d);--rp-line:var(--ts-line,#ececef);--rp-soft:var(--ts-soft,#f4f4f5);--rp-accent:var(--ts-accent,#4f7cf0);--rp-accent-soft:var(--ts-accent-soft,#e8f1fe);--rp-green:var(--ts-green,#16a34a);--rp-green-soft:var(--ts-green-soft,#e9f8ee);--rp-amber:var(--ts-amber,#c2620a);--rp-amber-soft:var(--ts-amber-soft,#fff4e0);--rp-red:var(--ts-red,#dc2626);--rp-red-soft:var(--ts-red-soft,#fdecec);--rp-seg-on:var(--ts-seg-on,#fff);position:relative;width:100%;max-width:640px;display:flex;flex-direction:column;gap:12px;color:var(--rp-fg);font:400 14px/1.4 var(--ts-font,Inter,system-ui,sans-serif);container:rp/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .rp{--rp-bg:var(--ts-surface,#1b1b1e);--rp-fg:var(--ts-fg,#ececef);--rp-muted:var(--ts-muted,#a1a1aa);--rp-faint:var(--ts-faint,#9a9aa2);--rp-line:var(--ts-line,#2e2e33);--rp-soft:var(--ts-soft,#26262a);--rp-accent:var(--ts-accent,#7c9cff);--rp-accent-soft:var(--ts-accent-soft,#1b2a44);--rp-green:var(--ts-green,#4ade80);--rp-green-soft:var(--ts-green-soft,#16301f);--rp-amber:var(--ts-amber,#eba659);--rp-amber-soft:var(--ts-amber-soft,#3a2a12);--rp-red:var(--ts-red,#f87171);--rp-red-soft:var(--ts-red-soft,#3a1d1f);--rp-seg-on:var(--ts-seg-on,#3a3a40);color-scheme:dark}
.rp *{box-sizing:border-box}
.rp-name{font-family:var(--ts-font-display,inherit)}:where(.rp) button{font:inherit;color:inherit;cursor:pointer}
.rp [hidden]{display:none!important}
.rp-head,.rp-phases,.rp-wait,.rp-card{background:var(--rp-bg);border:1px solid var(--rp-line);border-radius:12px;box-shadow:0 1px 2px #0000000a}
.rp-head{padding:14px;animation:rp-in .36s cubic-bezier(.2,.8,.3,1) both}
.rp-id{display:flex;align-items:center;gap:10px;min-width:0}
.rp-icon{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:9px;background:var(--rp-fg);color:var(--rp-bg);font-size:16px;font-weight:600;line-height:1}
.rp-titles{flex:1;min-width:0}
.rp-name{margin:0;font-size:15px;font-weight:600;line-height:1.3;letter-spacing:-.005em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rp-meta{display:flex;flex-wrap:wrap;gap:0 10px;margin:1px 0 0;font-size:12.5px;color:var(--rp-muted)}
.rp-status{flex:none;display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 8px;border-radius:6px;font-size:12px;font-weight:500;white-space:nowrap}
.rp-status::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.rp-tone-green{background:var(--rp-green-soft);color:color-mix(in srgb,var(--rp-green) 78%,var(--rp-fg))}
.rp-tone-amber{background:var(--rp-amber-soft);color:color-mix(in srgb,var(--rp-amber) 82%,var(--rp-fg))}
.rp-tone-blue{background:var(--rp-accent-soft);color:color-mix(in srgb,var(--rp-accent) 72%,var(--rp-fg))}
.rp-tone-red{background:var(--rp-red-soft);color:color-mix(in srgb,var(--rp-red) 82%,var(--rp-fg))}
.rp-tone-gray{background:var(--rp-soft);color:var(--rp-muted)}
.rp-summary{margin:10px 0 0;color:var(--rp-fg);font-size:13.5px;line-height:1.45}
.rp-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:12px 0 0;padding:0}
.rp-kpi{display:flex;flex-direction:column-reverse;justify-content:flex-end;gap:1px;padding:8px 10px;border-radius:8px;background:var(--rp-soft);animation:rp-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms + 80ms)}
.rp-kpi dt{font-size:12px;color:var(--rp-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rp-kpi dd{margin:0;display:flex;flex-direction:column}
.rp-num{font-size:20px;font-weight:600;line-height:1.2;letter-spacing:-.01em;font-variant-numeric:tabular-nums;white-space:nowrap}
.rp-unit{margin-left:1px;font-size:13px;font-weight:500;color:var(--rp-muted)}
.rp-note{order:2;font-size:11.5px;color:var(--rp-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rp-kt-green .rp-note{color:color-mix(in srgb,var(--rp-green) 75%,var(--rp-fg))}
.rp-kt-amber .rp-note{color:color-mix(in srgb,var(--rp-amber) 82%,var(--rp-fg))}
.rp-kt-red .rp-note{color:color-mix(in srgb,var(--rp-red) 82%,var(--rp-fg))}
.rp-kt-blue .rp-note{color:color-mix(in srgb,var(--rp-accent) 72%,var(--rp-fg))}
.rp-progress{margin-top:14px}
.rp-progress-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:6px;font-size:12.5px}
.rp-progress-label{color:var(--rp-muted);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rp-progress-pct{font-weight:600;font-variant-numeric:tabular-nums}
.rp-track{position:relative;height:8px;border-radius:4px;background:var(--rp-soft)}
.rp-fill{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--rp-accent);transform-origin:left;animation:rp-grow .9s cubic-bezier(.2,.8,.3,1) .15s both}
.rp-fill::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(90deg,transparent,#ffffff59,transparent);background-size:40% 100%;background-repeat:no-repeat;animation:rp-sheen 2.4s ease-in-out 1.2s infinite}
.rp-tick{position:absolute;top:-3px;width:2px;height:14px;margin-left:-1px;border-radius:1px;background:var(--rp-line)}
.rp-tick.is-past{background:color-mix(in srgb,var(--rp-accent) 55%,var(--rp-bg))}
.rp-tick:last-child{margin-left:-2px}
.rp-miles{position:relative;height:18px;margin:6px 0 0;padding:0;list-style:none;font-size:11.5px;color:var(--rp-faint)}
.rp-miles li{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
.rp-miles li[data-edge=start]{transform:none}.rp-miles li[data-edge=end]{transform:translateX(-100%)}
.rp-miles li.is-past{color:var(--rp-muted)}
.rp-bar{display:flex;align-items:center;gap:8px;min-width:0;padding:0 2px}
.rp-bar .rp-h{margin-right:auto}
.rp[data-scope=mine] [data-cw-other]{display:none!important}
.rp-pside-top{display:flex;align-items:center;gap:6px}
.rp-who{display:inline-flex;align-items:center;gap:3px;flex:none}
.rp-ava{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--rp-soft);border:1px solid var(--rp-line);color:var(--rp-muted);font-size:9.5px;font-weight:600;letter-spacing:.02em}
.rp-more{font-size:11px;color:var(--rp-faint);font-variant-numeric:tabular-nums}
.rp-card .rp-who{margin:2px 0 6px}
.rp-h{margin:0;font-size:13px;font-weight:600;color:var(--rp-muted)}
.rp-seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:var(--rp-soft)}
.rp-seg-opt{height:28px;padding:0 10px;border:0;border-radius:6px;background:none;color:var(--rp-muted);font-size:13px;font-weight:500;white-space:nowrap;transition:color .09s,background .15s,box-shadow .15s}
.rp-seg-opt:hover{color:var(--rp-fg)}
.rp-seg-opt[data-active]{background:var(--rp-seg-on);color:var(--rp-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
.rp-view{animation:rp-fade .22s ease both}
.rp-phases{margin:0;padding:6px 4px;list-style:none}
.rp-phase{position:relative;display:flex;align-items:flex-start;gap:10px;padding:8px 10px 8px 8px;border-radius:8px;animation:rp-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms + 120ms)}
.rp-phase:not(:last-child)::after{content:"";position:absolute;left:17px;top:30px;bottom:-8px;width:2px;border-radius:1px;background:var(--rp-line)}
.rp-phase.is-done:not(:last-child)::after{background:color-mix(in srgb,var(--rp-green) 45%,var(--rp-line))}
.rp-phase.is-active{background:color-mix(in srgb,var(--rp-accent-soft) 70%,transparent)}
.rp-phase.is-blocked{background:color-mix(in srgb,var(--rp-red-soft) 70%,transparent)}
.rp-mark{position:relative;z-index:1;display:grid;place-items:center;flex:none;width:20px;height:20px;margin-top:1px;border-radius:50%;border:1.5px solid var(--rp-faint);background:var(--rp-bg);color:#fff}
.rp-mark svg{width:14px;height:14px}
.rp-mark[data-s=done]{border-color:var(--rp-green);background:var(--rp-green)}
:where(.dark,[data-theme=dark]) .rp-mark[data-s=done],:where(.dark,[data-theme=dark]) .rp-mark[data-s=blocked]{color:#111}
.rp-mark[data-s=active]{border-color:var(--rp-accent);background:var(--rp-bg)}
.rp-mark[data-s=active]::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--rp-accent)}
.rp-mark[data-s=active]::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px solid var(--rp-accent);opacity:0;animation:rp-pulse 1.6s ease-out infinite}
.rp-mark[data-s=blocked]{border-color:var(--rp-red);background:var(--rp-red)}
.rp-ptext{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
.rp-ptitle{font-weight:500;line-height:1.35}
.is-next .rp-ptitle{color:var(--rp-muted);font-weight:400}
.rp-pline{font-size:12.5px;color:var(--rp-muted)}
.rp-pside{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.rp-ptag{display:inline-flex;align-items:center;height:20px;padding:0 6px;border-radius:5px;border:1px solid var(--rp-line);color:var(--rp-muted);font-size:11.5px;font-weight:500;white-space:nowrap}
.is-done .rp-ptag{border-color:transparent;background:var(--rp-green-soft);color:color-mix(in srgb,var(--rp-green) 78%,var(--rp-fg))}
.is-active .rp-ptag{border-color:transparent;background:var(--rp-accent-soft);color:color-mix(in srgb,var(--rp-accent) 72%,var(--rp-fg))}
.is-blocked .rp-ptag{border-color:transparent;background:var(--rp-red-soft);color:color-mix(in srgb,var(--rp-red) 82%,var(--rp-fg))}
.rp-pdate{font-size:12px;color:var(--rp-faint);font-variant-numeric:tabular-nums;white-space:nowrap}
.rp-mini{display:block;position:relative;height:4px;margin-top:6px;border-radius:2px;background:color-mix(in srgb,var(--rp-fg) 8%,transparent);overflow:hidden}
.rp-mini>span{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--rp-accent);transform-origin:left;animation:rp-grow .8s cubic-bezier(.2,.8,.3,1) .3s both}
.is-done .rp-mini>span{background:var(--rp-green)}.is-blocked .rp-mini>span{background:var(--rp-red)}
.rp-phase .rp-mini{max-width:220px}
.rp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin:0;padding:0;list-style:none}
.rp-card{display:flex;flex-direction:column;gap:4px;padding:12px;animation:rp-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms + 60ms)}
.rp-card-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.rp-card-top .rp-mark{margin:0}
.rp-card-top .rp-pdate{margin-left:auto}
.rp-card .rp-ptitle{font-weight:600}
.rp-card.is-blocked{border-color:color-mix(in srgb,var(--rp-red) 35%,var(--rp-line))}
.rp-card.is-active{border-color:color-mix(in srgb,var(--rp-accent) 35%,var(--rp-line))}
.rp-card .rp-mini{margin-top:auto;padding-top:0}
.rp-card .rp-pline{margin-bottom:8px}
.rp-wait{padding:12px;border-color:color-mix(in srgb,var(--rp-amber) 30%,var(--rp-line));background:color-mix(in srgb,var(--rp-amber-soft) 45%,var(--rp-bg));animation:rp-in .36s cubic-bezier(.2,.8,.3,1) .2s both}
.rp-wait.is-empty{border-color:var(--rp-line);background:var(--rp-bg)}
.rp-wait-h{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:13.5px;font-weight:600}
.rp-wait.is-empty .rp-wait-h{margin:0}
.rp-wait-dot{width:8px;height:8px;border-radius:50%;background:var(--rp-amber);box-shadow:0 0 0 3px color-mix(in srgb,var(--rp-amber) 22%,transparent)}
.rp-wait.is-empty .rp-wait-dot{background:var(--rp-green);box-shadow:none}
.rp-wait-count{min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:var(--rp-amber-soft);color:color-mix(in srgb,var(--rp-amber) 82%,var(--rp-fg));font-size:12px;line-height:20px;text-align:center;font-variant-numeric:tabular-nums}
.rp-wait-empty{margin:4px 0 0 16px;color:var(--rp-muted);font-size:13px}
.rp-wait-list{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}
.rp-witem{display:flex;align-items:center;gap:10px;padding:9px 10px 9px 12px;border-radius:9px;background:var(--rp-bg);border:1px solid var(--rp-line);animation:rp-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 60ms + 280ms)}
.rp-wtext{flex:1;min-width:0;display:flex;flex-direction:column}
.rp-wtitle{font-weight:500}
.rp-wline{font-size:12.5px;color:var(--rp-muted)}
.rp-wbtn{flex:none;height:30px;padding:0 12px;border:0;border-radius:7px;background:var(--rp-fg);color:var(--rp-bg)!important;font-size:13px;font-weight:500;transition:transform .12s,opacity .15s}
.rp-wbtn:hover{opacity:.88}.rp-wbtn:active{transform:scale(.97)}
.rp-wt-amber .rp-wbtn{background:var(--rp-amber);color:#fff!important}
:where(.dark,[data-theme=dark]) .rp-wt-amber .rp-wbtn{color:#1b1b1e!important}
.rp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rp :focus-visible{outline:2px solid var(--rp-accent);outline-offset:1px}
@keyframes rp-in{from{opacity:0;transform:translateY(6px)}}
@keyframes rp-fade{from{opacity:0}}
@keyframes rp-grow{from{transform:scaleX(0)}}
@keyframes rp-sheen{0%{background-position:-60% 0}60%,100%{background-position:160% 0}}
@keyframes rp-pulse{0%{opacity:.7;transform:scale(.7)}100%{opacity:0;transform:scale(1.45)}}
@container rp (max-width:520px){.rp-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container rp (max-width:400px){.rp-id{align-items:flex-start}.rp-name{white-space:normal}.rp-pside .rp-ptag{display:none}.rp-witem{flex-wrap:wrap}.rp-wbtn{margin-left:auto}.rp-miles li:not(.is-past):not(:last-child){visibility:hidden}}
@media(prefers-reduced-motion:reduce){.rp *,.rp{animation:none!important;transition:none!important}}
`;
export {
  ProjectReport,
  projectReportDemo,
  toPhaseState
};
//# sourceMappingURL=project-report-Cn3Ef0gw.js.map
