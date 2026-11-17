import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
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
    const r1 = -zeta * w0 + s;
    const r2 = -zeta * w0 - s;
    const b = (v0 - r1 * x0) / (r2 - r1);
    const a = x0 - b;
    d = a * Math.exp(r1 * t) + b * Math.exp(r2 * t);
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
const PARA_KEYS = ["inbox", "today", "waiting", "projects", "areas", "resources", "archive"];
const paraBaseMn = {
  inbox: { label: "Inbox", line: "Ирсэн бүхэн нэг хаалгаар орж ангилагдана" },
  today: { label: "Өнөөдөр", line: "Өнөөдөр хийх дараагийн алхмууд" },
  waiting: { label: "Хүлээгдэж буй", line: "Хэн нэгний хариу, батламж хүлээж буй ажил" },
  projects: { label: "Төсөл", line: "Дуусах хугацаатай ажил" },
  areas: { label: "Хүрээ", line: "Тогтмол хариуцдаг чиглэл" },
  resources: { label: "Нөөц", line: "Дахин ашиглах материал" },
  archive: { label: "Архив", line: "Дууссан, хадгалах зүйл" }
};
const appShellLabelsMn = { ceo: "Удирдлагын тойм", gtd: "GTD", para: "PARA", views: "Харагдац", calendar: "Хуанли", agents: "Агентууд", nav: "Апп-ын цэс", title: "Second Brain", ask: "Тархинаасаа асуу" };
const CSS = `
.ash-win{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-page);border:1px solid color-mix(in srgb,var(--ts-line) 80%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size;display:flex;flex-direction:column;min-width:0}
.ash-win *,.ash-win *::before{box-sizing:border-box}
.ash-bar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;height:36px;padding:0 10px;border-bottom:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);background:var(--ts-soft);flex:none}
.ash-dots{display:flex;gap:5px}.ash-dots i{width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--ts-faint) 35%,transparent)}
.ash-title{font-weight:500;font-size:12px;color:var(--ts-faint);white-space:nowrap}
.ash-ask{justify-self:end;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 6px 0 10px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:var(--ts-muted);font:inherit;font-size:12px;cursor:pointer;white-space:nowrap;min-width:0}
.ash-ask kbd{font:500 10.5px/1 var(--ts-font-mono);padding:3px 5px;border-radius:4px;background:var(--ts-soft-2);color:var(--ts-muted)}
.ash-ask:hover,.ash-ask[aria-pressed="true"]{border-color:var(--ts-electric);color:var(--ts-electric-fg,var(--ts-electric))}
.ash-ask:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 2px var(--ts-electric)}
.ash *,.ash *::before{box-sizing:border-box}
.ash{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-page);display:grid;grid-template-columns:220px minmax(0,1fr);min-height:560px;min-width:0;flex:1}
.ash.no-nav{grid-template-columns:minmax(0,1fr)}
.ash.is-bare{border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);overflow:hidden;container-type:inline-size}
.ash.has-aside{grid-template-columns:220px minmax(0,1fr) 300px}
.ash-nav{background:var(--ts-soft);padding:14px 8px;display:flex;flex-direction:column;gap:2px;min-width:0;border-right:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);overflow:auto;scrollbar-width:none}
.ash-ws{display:flex;align-items:center;gap:10px;padding:0 8px 12px}
.ash-ws b{width:28px;height:28px;border-radius:var(--ts-radius-tile,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:13px;font-weight:600;flex:none}
.ash-ws span{display:grid;line-height:1.25;min-width:0}.ash-ws strong{font-weight:500;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ash-ws small{font-size:11px;color:var(--ts-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ash-h{font:500 10.5px/1 var(--ts-font-mono);letter-spacing:.06em;color:var(--ts-faint);margin:12px 10px 6px}
.ash-it{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 8px;width:100%;padding:6px 10px;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;min-height:40px}
.ash-it:hover{background:color-mix(in srgb,var(--ts-fg) 5%,transparent)}
.ash-it[aria-current="page"]{background:var(--ts-surface);border-color:var(--ts-line)}
.ash-it span{font-size:13px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-it[aria-current="page"] span{font-weight:600}
.ash-it small{grid-column:1;font-size:10.5px;color:var(--ts-faint);line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-it em{grid-row:1/span 2;grid-column:2;font-style:normal;font-size:11px;color:var(--ts-faint);font-variant-numeric:tabular-nums}
.ash-it[aria-current="page"] em{color:var(--ts-muted)}
.ash-it.is-ceo span{font-weight:600}.ash-it.is-ceo em{color:var(--ts-muted);font:500 10px/1 var(--ts-font-mono)}
.ash-it:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-soft),0 0 0 2px var(--ts-electric)}
.ash-extra{margin-top:8px;min-width:0}
.ash-main{min-width:0;min-height:0;padding:24px 28px;overflow:auto}
.ash-view{animation:ash-view-in ${motionVar.duration("md")} ${motionVar.easing("enter")} both}
@keyframes ash-view-in{from{opacity:0;transform:translateY(6px)}}
@media (prefers-reduced-motion:reduce){.ash-view{animation:none}}
.ash-aside{border-left:1px solid var(--ts-line);background:var(--ts-surface);padding:20px;min-width:0}
@container (max-width:1100px){.ash.has-aside{grid-template-columns:200px minmax(0,1fr)}.ash-aside{grid-column:2;border-left:0;border-top:1px solid var(--ts-line)}}
@container (max-width:860px){.ash,.ash.has-aside{grid-template-columns:168px minmax(0,1fr)}.ash.no-nav{grid-template-columns:minmax(0,1fr)}.ash-it small{display:none}.ash-it{min-height:34px}.ash-main{padding:18px 20px}}
@container (max-width:600px){.ash,.ash.has-aside{grid-template-columns:minmax(0,1fr)}.ash-aside{grid-column:1}
.ash-nav{flex-direction:row;overflow-x:auto;gap:4px;padding:8px;border-right:0;border-bottom:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent)}
.ash-ws,.ash-h,.ash-it small,.ash-extra{display:none}.ash-it{width:auto;flex:none;min-height:36px}
.ash-main{padding:14px}.ash-title{display:none}.ash-bar{grid-template-columns:auto 1fr}}
`;
function AppShell({ company, vocab, counts = {}, active = "ceo", onNavigate, aside, children, labels: labelsIn, className = "", frame = true, title, onAsk, navExtra, nav = true, height }) {
  const L = { ...appShellLabelsMn, ...labelsIn };
  const [own, setOwn] = React.useState(active);
  React.useEffect(() => setOwn(active), [active]);
  const current = onNavigate ? active : own;
  const go = (v) => onNavigate ? onNavigate(v) : setOwn(v);
  const word = (k) => ({ ...paraBaseMn[k], ...vocab?.[k] });
  const item = (v, label, base, count, cls = "") => /* @__PURE__ */ jsxs("button", { type: "button", className: `ash-it ${cls}`, "aria-current": current === v ? "page" : void 0, onClick: () => go(v), title: base && base !== label ? `${label} · ${base}` : label, children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    base && base !== label && /* @__PURE__ */ jsx("small", { children: base }),
    count ? /* @__PURE__ */ jsx("em", { "aria-label": `${count} зүйл`, children: count }) : cls === "is-ceo" ? /* @__PURE__ */ jsx("em", { children: "CEO" }) : null
  ] }, v);
  const shell = /* @__PURE__ */ jsxs("div", { className: `ash ${aside ? "has-aside" : ""} ${nav ? "" : "no-nav"} ${frame ? "" : `is-bare ${className}`}`, style: height ? { height, minHeight: 0 } : void 0, children: [
    /* @__PURE__ */ jsx("style", { children: CSS }),
    nav && /* @__PURE__ */ jsxs("nav", { className: "ash-nav", "aria-label": L.nav, children: [
      /* @__PURE__ */ jsxs("div", { className: "ash-ws", children: [
        /* @__PURE__ */ jsx("b", { "aria-hidden": "true", children: company.initial ?? company.name.replace(/^ac\.me\s*/i, "").slice(0, 1).toUpperCase() }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("strong", { children: company.name }),
          company.note && /* @__PURE__ */ jsx("small", { children: company.note })
        ] })
      ] }),
      item("ceo", L.ceo, void 0, void 0, "is-ceo"),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.gtd }),
      ["inbox", "today", "waiting"].map((k) => item(k, word(k).label, paraBaseMn[k].label, counts[k])),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.para }),
      ["projects", "areas", "resources", "archive"].map((k) => item(k, word(k).label, paraBaseMn[k].label, counts[k])),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.views }),
      item("calendar", L.calendar),
      item("agents", L.agents),
      navExtra && /* @__PURE__ */ jsx("div", { className: "ash-extra", children: navExtra })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "ash-main", children: /* @__PURE__ */ jsx("div", { className: "ash-view", children }, current) }),
    aside && /* @__PURE__ */ jsx("aside", { className: "ash-aside", children: aside })
  ] });
  if (!frame) return shell;
  return /* @__PURE__ */ jsxs("div", { className: `ash-win ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "ash-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "ash-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {})
      ] }),
      /* @__PURE__ */ jsx("span", { className: "ash-title", children: title ?? L.title }),
      /* @__PURE__ */ jsxs("button", { type: "button", className: "ash-ask", "aria-pressed": current === "ask", onClick: () => onAsk ? onAsk() : go("ask"), children: [
        L.ask,
        /* @__PURE__ */ jsx("kbd", { children: "⌘K" })
      ] })
    ] }),
    shell
  ] });
}
const acmeParaVocab = {
  marketing: {
    inbox: { label: "Бриф, санаа", line: "Ирсэн бриф, контентын санаа, comment" },
    today: { label: "Өнөөдрийн пост", line: "Өнөөдөр нийтлэх, хариулах зүйл" },
    waiting: { label: "Батламж хүлээж", line: "Брэнд, хууль, харилцагчийн батламж" },
    projects: { label: "Кампанит ажил", line: "Хугацаатай кампанит ажил, influencer гэрээ" },
    areas: { label: "Брэнд ба суваг", line: "Брэнд, social суваг, CRM" },
    resources: { label: "Контентын сан", line: "Судалгаа, загвар, зураг, өмнөх пост" },
    archive: { label: "Дууссан кампанит ажил", line: "Хаагдсан кампанит ажил, гэрээ" }
  },
  logistics: {
    inbox: { label: "Ачааны хүсэлт", line: "Охин компани, гадны харилцагчаас ирсэн тээврийн захиалга" },
    today: { label: "Өнөөдрийн ачилт", line: "Өнөөдөр гарах вагон, машин, жолооч" },
    waiting: { label: "Гааль, хил дээр", line: "Зөвшөөрөл, бичиг баримт хүлээж буй ачаа" },
    projects: { label: "Маршрут, гэрээ", line: "Шинэ маршрут нээх, тарифын гэрээ" },
    areas: { label: "Парк ба агуулах", line: "Төмөр зам, авто парк, агуулахын тогтмол хариуцлага" },
    resources: { label: "Тариф, журам", line: "Тарифын хүснэгт, аюулгүй байдлын журам" },
    archive: { label: "Хүргэгдсэн ачаа", line: "Хаагдсан тээвэр, баримт" }
  }
};
const appShellDemo = {
  company: { name: "ac.me Маркетинг", note: "Маркетингийн баг" },
  vocab: acmeParaVocab.marketing,
  counts: { inbox: 7, waiting: 3 },
  active: "ceo"
};
const appShellLogisticsDemo = {
  company: { name: "ac.me Логистик", note: "Логистикийн компани" },
  vocab: acmeParaVocab.logistics,
  counts: { inbox: 9, waiting: 4 },
  active: "ceo"
};
export {
  AppShell as A,
  DURATIONS as D,
  EASINGS as E,
  LOOP as L,
  PARA_KEYS as P,
  SPRINGS as S,
  acmeParaVocab as a,
  appShellDemo as b,
  appShellLabelsMn as c,
  appShellLogisticsDemo as d,
  springKeyframes as e,
  dampingRatio as f,
  motionTokensCss as g,
  springAt as h,
  springDuration as i,
  springEasing as j,
  motionVar as m,
  paraBaseMn as p,
  spring as s
};
//# sourceMappingURL=app-shell-CHp_ZidI.js.map
