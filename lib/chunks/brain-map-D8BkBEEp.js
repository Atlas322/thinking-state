import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const r2 = (v) => Math.round(v * 10) / 10;
function layoutBrain(clusters, links, seed = 7) {
  const rand = seeded(seed);
  const dots = [];
  const lines = [];
  const byCluster = /* @__PURE__ */ new Map();
  for (const c of clusters) {
    const at = c.at ?? 0;
    const span = c.span ?? 0.2;
    const tone = c.tone ?? "branch";
    const g = c.id.split(":")[0];
    const list = [];
    for (let i = 0; i < c.n; i++) {
      const rr = c.n === 1 ? 0 : c.r * Math.sqrt((i + 0.5) / c.n);
      const a = i * 2.39996 + (rand() - 0.5) * 0.5;
      const j = c.n === 1 ? 0 : (rand() - 0.5) * c.r * 0.12;
      list.push({ key: `${c.id}-${i}`, x: r2(c.x + Math.cos(a) * rr + j), y: r2(c.y + Math.sin(a) * rr + j), at: at + span * i / Math.max(1, c.n), tone, g });
    }
    const steps = c.n > 20 ? [8, 13] : c.n > 6 ? [3, 5] : [1];
    list.forEach(
      (d, i) => steps.forEach((s) => {
        const e = list[i + s];
        if (e) lines.push({ key: `${d.key}~${e.key}`, x1: d.x, y1: d.y, x2: e.x, y2: e.y, at: Math.max(d.at, e.at) + 0.04, cross: false, g });
      })
    );
    dots.push(...list);
    byCluster.set(c.id, list);
  }
  const centre = new Map(clusters.map((c) => [c.id, c]));
  for (const l of links) {
    const a = centre.get(l.from);
    const b = centre.get(l.to);
    const da = byCluster.get(l.from);
    const db = byCluster.get(l.to);
    if (!a || !b || !da || !db) continue;
    const at = l.at ?? 0;
    const g = l.to.split(":")[0];
    if (!l.strands) {
      const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const ux = (b.x - a.x) / len;
      const uy = (b.y - a.y) / len;
      lines.push({ key: `${l.from}=${l.to}`, x1: r2(a.x + ux * (a.r + 4)), y1: r2(a.y + uy * (a.r + 4)), x2: r2(b.x - ux * (b.r + 4)), y2: r2(b.y - uy * (b.r + 4)), at, cross: true, g });
      continue;
    }
    const facing = (list, tx, ty) => [...list].sort((p, q) => Math.hypot(p.x - tx, p.y - ty) - Math.hypot(q.x - tx, q.y - ty)).slice(0, Math.max(3, l.strands * 2));
    const fa = facing(da, b.x, b.y);
    const fb = facing(db, a.x, a.y);
    for (let s = 0; s < l.strands; s++) {
      const p = fa[Math.floor(rand() * fa.length)];
      const q = fb[Math.floor(rand() * fb.length)];
      lines.push({ key: `${l.from}=${l.to}-${s}`, x1: p.x, y1: p.y, x2: q.x, y2: q.y, at: at + s * 0.025, cross: true, g });
    }
  }
  return { dots, lines };
}
const reduced = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function useBrainProgress(progress, duration = 4200, steps = 14) {
  const [tick, setTick] = React.useState(0);
  const external = progress !== void 0;
  React.useEffect(() => {
    if (external) return;
    if (reduced()) {
      setTick(steps);
      return;
    }
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTick(n);
      if (n >= steps) window.clearInterval(id);
    }, Math.min(duration, 5e3) / steps);
    return () => window.clearInterval(id);
  }, [external, duration, steps]);
  return external ? Math.min(1, Math.max(0, progress)) : tick / steps;
}
function BrainField({ clusters, links, progress, seed = 7, height = 320, label, className = "", active = null, alive = false }) {
  const hot = (g) => active && (g === active || g === "core") ? "" : void 0;
  const { dots, lines } = React.useMemo(() => layoutBrain(clusters, links, seed), [clusters, links, seed]);
  return /* @__PURE__ */ jsxs("svg", { className: `bf ${className}`, viewBox: `0 0 400 ${height}`, role: "img", "aria-label": label, "data-active": active ? "" : void 0, "data-alive": alive ? "" : void 0, children: [
    /* @__PURE__ */ jsx("g", { className: "bf-lines", children: lines.map((l) => /* @__PURE__ */ jsx("line", { x1: l.x1, y1: l.y1, x2: l.x2, y2: l.y2, className: l.cross ? "bf-cross" : "bf-in", "data-on": progress >= l.at || void 0, "data-hot": hot(l.g) }, l.key)) }),
    alive && /* @__PURE__ */ jsx("g", { className: "bf-pulses", "aria-hidden": "true", children: lines.filter((l) => l.cross && progress >= l.at).map((l, i) => /* @__PURE__ */ jsx("circle", { cx: l.x1, cy: l.y1, r: 1.8, className: "bf-pulse", "data-hot": hot(l.g), style: { ["--dx"]: `${l.x2 - l.x1}px`, ["--dy"]: `${l.y2 - l.y1}px`, ["--i"]: i } }, l.key)) }),
    /* @__PURE__ */ jsx("g", { className: "bf-dots", children: dots.map((d) => /* @__PURE__ */ jsx("circle", { cx: d.x, cy: d.y, r: d.tone === "leaf" ? 4 : d.tone === "core" ? 2.4 : 2, className: `bf-${d.tone}`, "data-on": progress >= d.at || void 0, "data-hot": hot(d.g), style: { ["--i"]: d.key.length + Math.round(d.x) } }, d.key)) })
  ] });
}
function brainCounts(clusters, links, progress, seed = 7) {
  const { dots, lines } = layoutBrain(clusters, links, seed);
  return { memories: dots.filter((d) => progress >= d.at).length, links: lines.filter((l) => progress >= l.at).length };
}
const brainFieldCss = `
.bf{display:block;width:100%;height:auto;overflow:visible}
.bf line{stroke-width:1;vector-effect:non-scaling-stroke;opacity:0;transition:opacity .5s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.bf .bf-in{stroke:var(--bf-link,var(--ts-muted,#65656d))}
.bf .bf-cross{stroke:var(--bf-cross,var(--ts-accent,#4f7cf0))}
.bf line[data-on]{opacity:.32}
.bf .bf-cross[data-on]{opacity:.6}
.bf circle{opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.4);transition:opacity .45s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)),transform .45s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.bf circle[data-on]{opacity:1;transform:none}
.bf .bf-core{fill:var(--bf-core,var(--ts-accent,#4f7cf0))}
.bf .bf-branch{fill:var(--bf-branch,var(--ts-fg,#18181b))}
.bf .bf-branch[data-on]{opacity:.7}
.bf .bf-leaf{fill:var(--bf-surface,var(--ts-surface,#fff));stroke:var(--bf-core,var(--ts-accent,#4f7cf0));stroke-width:2;vector-effect:non-scaling-stroke}
.bf[data-active] line:not([data-hot]){opacity:.1}
.bf[data-active] circle:not([data-hot]){opacity:.22}
.bf[data-active] .bf-cross[data-hot]{opacity:1;stroke-width:1.6}
.bf[data-alive] circle[data-on]:not(.bf-pulse){animation:bf-breathe var(--ts-motion-loop-period,5200ms) var(--ts-motion-ease-loop,ease-in-out) infinite;animation-delay:calc(var(--i,0) * -173ms)}
.bf .bf-pulse{fill:var(--bf-cross,var(--ts-accent,#4f7cf0));opacity:0;transform:none;animation:bf-travel calc(var(--ts-motion-loop-move,1200ms) * 2) var(--ts-motion-ease-standard,ease-in-out) infinite;animation-delay:calc(var(--i,0) * 310ms)}
.bf[data-active] .bf-pulse:not([data-hot]){animation:none;opacity:0}
@keyframes bf-breathe{50%{transform:scale(1.22)}}
@keyframes bf-travel{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}70%{opacity:.9}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
@media(prefers-reduced-motion:reduce){.bf line,.bf circle{transition:none}.bf[data-alive] circle,.bf .bf-pulse{animation:none!important}.bf .bf-pulse{display:none}}
`;
const defaultLabels = { picture: "Нэг тархи, түүнээс салбарласан хэсгүүд ба агентууд" };
const brainMapDemo = {
  title: "Танай компанийн нэг тархи",
  caption: "Санамж бүр нэг газар, агент бүр түүнээс уншиж, бодлоо ил гаргана.",
  core: "Тархи",
  branches: [
    {
      id: "memory",
      label: "Санах ой",
      agents: [
        { id: "m1", name: "Тэмдэглэгч", job: "Уулзалт бүрээс санамж бичнэ" },
        { id: "m2", name: "Холбогч", job: "Шинэ санамжийг хуучинтай холбоно" }
      ]
    },
    {
      id: "agents",
      label: "Агентууд",
      agents: [
        { id: "a1", name: "Борлуулалтын агент", job: "Сонирхогчдод санал бэлдэнэ" },
        { id: "a2", name: "Санхүүгийн агент", job: "Гүйлгээг сар бүр тулгана" }
      ]
    },
    {
      id: "thought",
      label: "Бодол",
      agents: [
        { id: "t1", name: "Тайлбарлагч", job: "Хариу бүрт эх сурвалжаа заана" },
        { id: "t2", name: "Шалгагч", job: "Шийдвэрийг хүнд батлуулна" }
      ]
    }
  ]
};
const CX = 200;
const CY = 158;
function geometry(branches) {
  const n = branches.length;
  const start = -90 - 180 / n;
  const clusters = [{ id: "core", x: CX, y: CY, r: 46, n: 48, tone: "core", at: 0, span: 0.26 }];
  const links = [];
  const places = [];
  branches.forEach((b, i) => {
    const ang = (start + 360 / n * i) * Math.PI / 180;
    const x = Math.round(CX + Math.cos(ang) * 128);
    const y = Math.round(CY + Math.sin(ang) * 108);
    const at = 0.3 + i * 0.09;
    clusters.push({ id: b.id, x, y, r: 22, n: 15, tone: "branch", at, span: 0.12 });
    links.push({ from: "core", to: b.id, at: at - 0.02, strands: 3 });
    const agents = b.agents.slice(0, 3).map((a, k, all) => {
      const off = (k - (all.length - 1) / 2) * 38 * Math.PI / 180;
      const aat = 0.64 + i * 0.08 + k * 0.04;
      const id = `${b.id}:${a.id}`;
      clusters.push({ id, x: Math.round(x + Math.cos(ang + off) * 44), y: Math.round(y + Math.sin(ang + off) * 40), r: 0, n: 1, tone: "leaf", at: aat, span: 0 });
      links.push({ from: b.id, to: id, at: aat - 0.02 });
      return { id: a.id, at: aat };
    });
    places.push({ id: b.id, x: Math.round(x - Math.cos(ang) * 36), y: Math.round(y - Math.sin(ang) * 32), at, agents });
  });
  return { clusters, links, places };
}
function BrainMap({ progress: progressProp, seed = 11, labels: labelsProp, className = "", ...data }) {
  const L = { ...defaultLabels, ...labelsProp };
  const d = { ...brainMapDemo, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== void 0)) };
  const uid = React.useId();
  const geo = React.useMemo(() => geometry(d.branches), [d.branches]);
  const p = useBrainProgress(progressProp);
  const [hover, setHover] = React.useState(null);
  const [pinned, setPinned] = React.useState(null);
  const active = hover ?? pinned;
  const over = (id) => ({ onPointerEnter: () => setHover(id), onPointerLeave: () => setHover(null), onFocus: () => setHover(id), onBlur: () => setHover(null) });
  const pin = (id) => setPinned((x) => x === id ? null : id);
  const stage = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = stage.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "0px 0px -5% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: `bm ${className}`, "data-active": active ? "" : void 0, "aria-labelledby": d.title ? `${uid}-h` : void 0, "aria-label": d.title ? void 0 : L.picture, children: [
    /* @__PURE__ */ jsx("style", { children: brainFieldCss + css }),
    (d.title || d.caption) && /* @__PURE__ */ jsxs("header", { className: "bm-head", children: [
      d.title && /* @__PURE__ */ jsx("h3", { id: `${uid}-h`, className: "bm-title", children: d.title }),
      d.caption && /* @__PURE__ */ jsx("p", { className: "bm-cap", children: d.caption })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bm-stage", ref: stage, children: [
      /* @__PURE__ */ jsx(BrainField, { clusters: geo.clusters, links: geo.links, progress: p, seed, label: L.picture, active, alive: p >= 1 && inView }),
      /* @__PURE__ */ jsx("span", { className: "bm-mark is-core", style: { left: `${CX / 400 * 100}%`, top: `${CY / 320 * 100}%` }, "data-on": true, children: d.core }),
      geo.places.map((pl, i) => /* @__PURE__ */ jsx("button", { type: "button", className: "bm-mark", style: { left: `${pl.x / 400 * 100}%`, top: `${pl.y / 320 * 100}%` }, "data-on": p >= pl.at + 0.06 || void 0, "data-hot": active === pl.id || void 0, "aria-pressed": pinned === pl.id, onClick: () => pin(pl.id), ...over(pl.id), children: d.branches[i].label }, pl.id))
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "bm-legend", children: d.branches.map((b, i) => /* @__PURE__ */ jsxs("li", { className: "bm-col", "data-on": p >= geo.places[i].at + 0.06 || void 0, "data-hot": active === b.id || void 0, ...over(b.id), children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: "bm-col-h", "aria-pressed": pinned === b.id, onClick: () => pin(b.id), children: [
        /* @__PURE__ */ jsx("span", { className: "bm-n", children: String(i + 1).padStart(2, "0") }),
        b.label
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "bm-agents", children: b.agents.slice(0, 3).map((a, k) => /* @__PURE__ */ jsxs("li", { className: "bm-agent", "data-on": p >= geo.places[i].agents[k].at || void 0, children: [
        /* @__PURE__ */ jsx("span", { className: "bm-dot", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("b", { children: a.name }),
          /* @__PURE__ */ jsx("span", { className: "bm-job", children: a.job })
        ] })
      ] }, a.id)) })
    ] }, b.id)) })
  ] });
}
const css = `
.bm{--bm-fg:var(--ts-fg,#18181b);--bm-muted:var(--ts-muted,#65656d);--bm-line:var(--ts-line,#ececef);--bm-surface:var(--ts-surface,#fff);--bm-accent:var(--ts-accent,#4f7cf0);--bm-accent-soft:var(--ts-accent-soft,#e8f1fe);--bm-accent-text:var(--ts-accent-strong,#1b5cff);width:100%;max-width:880px;margin:0 auto;color:var(--bm-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);box-sizing:border-box;container-type:inline-size}
:where(.dark,[data-theme=dark]) .bm{--bm-fg:var(--ts-fg,#ececef);--bm-muted:var(--ts-muted,#a1a1aa);--bm-line:var(--ts-line,#2e2e33);--bm-surface:var(--ts-surface,#1b1b1e);--bm-accent:var(--ts-accent,#7c9cff);--bm-accent-soft:var(--ts-accent-soft,#1b2a44);--bm-accent-text:var(--ts-accent,#7c9cff);color-scheme:dark}
.bm *{box-sizing:border-box}
.bm .bf{--bf-surface:var(--bm-surface);--bf-branch:var(--bm-fg)}
.bm-head{text-align:center;max-width:560px;margin:0 auto 8px}
.bm-title{margin:0;font:var(--ts-head-weight,600) clamp(22px,5.2cqi,36px)/1.15 var(--ts-font-display,inherit);letter-spacing:var(--ts-head-tracking,-.01em)}
.bm-cap{margin:8px 0 0;color:var(--bm-muted);font-size:15px}
.bm-stage{position:relative;max-width:640px;margin:0 auto}
.bm-mark{position:absolute;transform:translate(-50%,-50%) scale(.92);padding:3px 10px;border:1px solid var(--bm-line);border-radius:var(--ts-radius-pill,999px);background:var(--bm-surface);font-size:13px;font-weight:600;white-space:nowrap;opacity:0;transition:opacity .4s,transform .4s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.bm-mark[data-on]{opacity:1;transform:translate(-50%,-50%)}
button.bm-mark{font-family:inherit;color:inherit;cursor:pointer;min-height:28px}
button.bm-mark:hover,.bm-mark[data-hot]{border-color:var(--bm-accent-text);color:var(--bm-accent-text);background:var(--bm-accent-soft)}
.bm[data-active] button.bm-mark[data-on]:not([data-hot]){opacity:.5}
.bm :focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--bm-surface),0 0 0 2px var(--bm-accent-text)}
.bm-mark.is-core{padding:5px 14px;border-color:color-mix(in srgb,var(--bm-accent) 40%,var(--bm-line));color:var(--bm-accent-text);font-size:15px}
.bm-legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px 20px;margin:16px 0 0;padding:0;list-style:none}
.bm-col{padding-top:10px;border-top:1px solid var(--bm-line);opacity:0;transition:opacity .4s}
.bm-col[data-on]{opacity:1}
.bm[data-active] .bm-col[data-on]:not([data-hot]){opacity:.45}
.bm-col[data-hot]{border-top-color:var(--bm-accent-text)}
.bm-col[data-hot] .bm-col-h,.bm-col[data-hot] .bm-n{color:var(--bm-accent-text)}
button.bm-col-h{padding:0;border:0;background:none;font:inherit;font-weight:600;color:inherit;cursor:pointer;min-height:28px;border-radius:4px}
.bm-col-h{display:flex;align-items:center;gap:8px;font-weight:600}
.bm-n{font:500 12px/1 var(--ts-font-mono,ui-monospace,monospace);color:var(--bm-muted)}
.bm-agents{display:grid;gap:6px;margin:8px 0 0;padding:0;list-style:none}
.bm-agent{display:flex;gap:8px;align-items:flex-start;font-size:13px;opacity:0;transform:translateY(4px);transition:opacity .4s,transform .4s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}
.bm-agent[data-on]{opacity:1;transform:none}
.bm-agent b{display:block;font-weight:600}
.bm-job{display:block;color:var(--bm-muted)}
.bm-dot{flex:none;width:8px;height:8px;margin-top:6px;border-radius:50%;border:2px solid var(--bm-accent)}
@media(prefers-reduced-motion:reduce){.bm *{transition:none!important}}
`;
export {
  BrainMap as B,
  brainCounts as a,
  brainMapDemo as b,
  brainFieldCss as c,
  BrainField as d,
  layoutBrain as l,
  useBrainProgress as u
};
//# sourceMappingURL=brain-map-D8BkBEEp.js.map
