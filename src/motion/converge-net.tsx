/**
 * ConvergeNet (2026-11-17, screens.15): information streams in from the edges and the dots join
 * into one network. White geometric vector links on Electric (or Electric on a light surface).
 * Ported from web-builder's prototype (site-recipes motifs/converge-net.html, 2fb7204) for the
 * home v6 interlude hero. Canvas, deterministic seed, loops; prefers-reduced-motion and
 * `play="static"` show the final network; `t` (0..1.4) freezes one frame (Figma, screenshots).
 * Colours come from the tokens: --ts-on-electric on Electric, --ts-electric on cream.
 */
import * as React from "react";
import { convergeStagesLayout, drawConvergeStages, paraNetGroups, pickNoteNodes, type NetGroup, type NetNote } from "./converge-net-stages";
export { paraNetGroups, convergeStagesLayout, drawConvergeStages, pickNoteNodes, type NetGroup, type NetShape, type NetNote } from "./converge-net-stages";

export type ConvergeNetProps = {
  /** How many dots (default 72). */
  nodes?: number;
  /** Seed for the layout: the same seed draws the same network. */
  seed?: number;
  /** "electric": white links on Electric · "cream": Electric links on the page surface. */
  tone?: "electric" | "cream";
  /** "loop" (default) plays and repeats; "once" plays to the end and stays; "static" shows the end. */
  play?: "loop" | "once" | "static";
  /** One pass, ms (default 6000). */
  duration?: number;
  /** Freeze one frame (0 = start, 1.4 = the finished network). */
  t?: number;
  /**
   * Four-stage mode (screens.17): edges → local graph → groups → turning sphere with an axis.
   * A number 0..4 freezes that moment; "loop" plays 0→4 and repeats; "scroll" follows the page
   * scroll while the canvas crosses the viewport. Reduced motion shows stage 4.
   */
  stage?: number | "loop" | "scroll";
  /**
   * Stage 2 (local graph) with labels: the note in the centre and up to ~8 linked notes. Each is a
   * link; hover or focus lights its dot and shows the short preview. Drawn only while the graph
   * stands still at stage 1.5–2 (a number), so labels never chase moving dots.
   */
  center?: { label: string; href?: string };
  notes?: NetNote[];
  /** Stage 3–4 groups (label, shape, colour token). Default: PARA (paraNetGroups). */
  groups?: NetGroup[];
  /** Accessible description; the canvas is an image of it. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

type Node = { to: [number, number]; from: [number, number]; d: number; sz: number };

/** The network for a seed: same seed, same dots and links. */
export function convergeNetLayout(n: number, seed: number) {
  let s = Math.max(1, Math.floor(seed)) % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const nodes: Node[] = [];
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, r = Math.pow(rnd(), 0.6) * 0.36;
    const side = Math.floor(rnd() * 4), e = rnd();
    const from: [number, number] = side === 0 ? [e, -0.08] : side === 1 ? [1.08, e] : side === 2 ? [e, 1.08] : [-0.08, e];
    nodes.push({ to: [0.5 + Math.cos(a) * r * 1.25, 0.5 + Math.sin(a) * r], from, d: rnd() * 0.35, sz: 1.6 + rnd() * 2.6 });
  }
  const links: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const near = nodes.map((m, j) => [j, Math.hypot(m.to[0] - nodes[i].to[0], (m.to[1] - nodes[i].to[1]) * 0.8)] as [number, number]).filter((v) => v[0] !== i).sort((a, b) => a[1] - b[1]);
    for (const [j] of near.slice(0, 3)) if (!links.some((l) => l[0] === j && l[1] === i)) links.push([i, j, rnd() * 0.25]);
  }
  return { nodes, links };
}

const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

/** Draws one frame `t` (0..1.4) of the network into a 2D context of W×H CSS px. */
export function drawConvergeNet(x: CanvasRenderingContext2D, W: number, H: number, t: number, net: ReturnType<typeof convergeNetLayout>, fg: string) {
  const { nodes, links } = net;
  x.clearRect(0, 0, W, H);
  const pos = nodes.map((n) => { const k = ease((t - n.d) / 0.45); return [(n.from[0] + (n.to[0] - n.from[0]) * k) * W, (n.from[1] + (n.to[1] - n.from[1]) * k) * H, k] as const; });
  x.fillStyle = fg; x.strokeStyle = fg; x.lineWidth = 1;
  nodes.forEach((n, i) => { const [px, py, k] = pos[i]; if (k <= 0 || k >= 1) return; x.globalAlpha = 0.35 * (1 - k); x.beginPath(); x.moveTo(n.from[0] * W, n.from[1] * H); x.lineTo(px, py); x.stroke(); });
  x.lineWidth = 1.2;
  links.forEach(([i, j, dl]) => {
    const k = ease((Math.min(pos[i][2], pos[j][2]) - 0.85 - dl * 0.4) / 0.15); if (k <= 0) return;
    const [ax, ay] = pos[i], [bx, by] = pos[j]; x.globalAlpha = 0.55 * k; x.beginPath(); x.moveTo(ax, ay); x.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k); x.stroke();
  });
  nodes.forEach((n, i) => {
    const [px, py, k] = pos[i]; if (k <= 0) return;
    x.globalAlpha = 0.4 + 0.6 * k; x.beginPath(); x.arc(px, py, n.sz * (k >= 1 ? 1.15 : 1), 0, 7); x.fill();
    if (k >= 1 && i % 7 === 0) { x.globalAlpha = 0.25; x.beginPath(); x.arc(px, py, n.sz + 6, 0, 7); x.stroke(); }
  });
  x.globalAlpha = 1;
}

export function ConvergeNet({ stage, center, notes, groups = paraNetGroups, nodes = 72, seed = 7, tone = "electric", play = "loop", duration = 6000, t, label = "Мэдээллийн урсгал захаас орж ирж, цэгүүд нэг сүлжээ болно", className = "", style }: ConvergeNetProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const net = React.useMemo(() => convergeNetLayout(nodes, seed), [nodes, seed]);
  const net4 = React.useMemo(() => (stage === undefined ? null : convergeStagesLayout(nodes, seed, groups.length)), [stage === undefined, nodes, seed, groups.length]);
  React.useEffect(() => {
    if (!net4) return;
    const cv = ref.current;
    const x = cv?.getContext?.("2d");
    if (!cv || !x) return;
    const cs = getComputedStyle(cv);
    const tok = (n: string) => cs.getPropertyValue(n).trim() || cs.color;
    const colors = groups.map((g) => tok(g.color));
    const accent = cs.color, ink = tok("--ts-fg");
    let W = 0, H = 0, raf = 0;
    const size = () => { const D = window.devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.max(1, W * D); cv.height = Math.max(1, H * D); x.setTransform(D, 0, 0, D, 0, 0); };
    const draw = (tt: number) => drawConvergeStages(x, W, H, tt, net4, groups, colors, accent, ink);
    size();
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = typeof stage === "number" ? Math.min(Math.max(stage, 0), 4) : reduce ? 4 : undefined;
    const scrollT = () => { const r = cv.getBoundingClientRect(); const vh = window.innerHeight || 1; return Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1) * 4; };
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => { size(); draw(still ?? (stage === "scroll" ? scrollT() : 4)); }) : null;
    ro?.observe(cv);
    let onScroll: (() => void) | null = null;
    if (still !== undefined) draw(still);
    else if (stage === "scroll") { onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => draw(scrollT())); }; window.addEventListener("scroll", onScroll, { passive: true }); draw(scrollT()); }
    else { const T0 = performance.now(); const loop = (now: number) => { /* 0→4, then hold one fifth of the cycle */ draw(Math.min((((now - T0) / duration) * 5) % 5, 4)); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); }
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); if (onScroll) window.removeEventListener("scroll", onScroll); };
  }, [net4, stage, groups, duration, tone]);
  React.useEffect(() => {
    if (net4) return;
    const cv = ref.current;
    const x = cv?.getContext?.("2d");
    if (!cv || !x) return;
    const fg = getComputedStyle(cv).color || "white";
    let W = 0, H = 0, raf = 0;
    const size = () => {
      const D = window.devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.max(1, W * D); cv.height = Math.max(1, H * D); x.setTransform(D, 0, 0, D, 0, 0);
    };
    size();
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = t !== undefined ? t : play === "static" || reduce ? 1.4 : undefined;
    const draw = (tt: number) => drawConvergeNet(x, W, H, tt, net, fg);
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => { size(); if (still !== undefined) draw(still); }) : null;
    ro?.observe(cv);
    if (still !== undefined) draw(still);
    else {
      const T0 = performance.now();
      const loop = (now: number) => {
        const p = (now - T0) / duration;
        const tt = play === "once" ? Math.min(p * 1.4, 1.4) : (p % 1.25) * 1.4;
        draw(tt);
        if (play === "loop" || p * 1.4 < 1.4) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => { cancelAnimationFrame(raf); ro?.disconnect(); };
  }, [net, net4, tone, play, duration, t]);
  const color = tone === "cream" ? "var(--ts-electric,#1b5cff)" : "var(--ts-on-electric,#fff)";
  const bg = tone === "cream" ? "var(--ts-page,#f0ede4)" : "var(--ts-electric,#1b5cff)";
  const labelled = net4 && typeof stage === "number" && stage >= 1.5 && stage <= 2 && (center || notes?.length);
  const picks = React.useMemo(() => (labelled && net4 ? pickNoteNodes(net4, notes?.length ?? 0) : []), [labelled, net4, notes?.length]);
  const canvas = (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      data-tone={tone}
      data-stage={stage === undefined ? undefined : String(stage)}
      className={`ts-converge-net ${className}`}
      style={{ display: "block", width: "100%", height: "100%", minHeight: 240, color, background: bg, ...(labelled ? {} : style) }}
    />
  );
  if (!labelled || !net4) return canvas;
  const at = (i: number) => ({ left: `${net4.nodes[i].graph[0] * 100}%`, top: `${net4.nodes[i].graph[1] * 100}%` });
  /** Label toward the inside: left of the dot on the left half, except near the edge where it turns inward. */
  const side = (x: number) => (x < 0.25 ? "r" : x < 0.5 ? "l" : x > 0.75 ? "l" : "r");
  const tag = (n: { label: string; href?: string; preview?: string }, i: number, key: string, main = false) => {
    const body = <><i aria-hidden="true" /><b>{n.label}</b>{(n.preview || !main) && <span role="tooltip"><em>{n.label}</em>{n.preview}</span>}</>;
    return (
      <li key={key} className={`cnl-n${main ? " is-center" : ""}`} style={at(i)} data-side={side(net4.nodes[i].graph[0])} data-half={net4.nodes[i].graph[0] < 0.5 ? "l" : "r"}>
        {n.href ? <a href={n.href}>{body}</a> : <span tabIndex={0}>{body}</span>}
      </li>
    );
  };
  return (
    <div className={`cnl ${className}`} data-tone={tone} style={{ position: "relative", ...style }}>
      <style>{CNL_CSS}</style>
      {canvas}
      <ul aria-label={label}>
        {center && tag(center, 0, "c", true)}
        {notes?.map((n, k) => picks[k] !== undefined && tag(n, picks[k], `n${k}`))}
      </ul>
    </div>
  );
}

const CNL_CSS = `
.cnl{container-type:inline-size}
.cnl ul{list-style:none;margin:0;padding:0;position:absolute;inset:0;pointer-events:none}
.cnl-n{position:absolute;transform:translate(-5px,-50%);pointer-events:auto}
.cnl-n[data-side=l]{transform:translate(calc(-100% + 5px),-50%)}
.cnl-n>a,.cnl-n>span{position:relative;display:flex;align-items:center;gap:8px;min-height:32px;padding:0 6px;border-radius:var(--ts-radius,6px);color:var(--ts-fg);text-decoration:none;font:500 13px/1.2 var(--ts-font,Inter,system-ui,sans-serif);outline:none}
.cnl-n[data-side=l]>a,.cnl-n[data-side=l]>span{flex-direction:row-reverse}
.cnl-n i{width:10px;height:10px;border-radius:50%;background:var(--ts-electric);box-shadow:0 0 0 3px var(--ts-page);flex:none;transition:transform .15s}
.cnl-n b{font-weight:500;white-space:nowrap;background:color-mix(in srgb,var(--ts-page) 86%,transparent);padding:2px 4px;border-radius:4px}
.cnl-n.is-center{transform:translate(-50%,-50%)}.cnl-n.is-center>*{flex-direction:column;gap:6px}
.cnl-n.is-center i{width:18px;height:18px}.cnl-n.is-center b{font-weight:600;font-size:14px}
.cnl-n>*:hover i,.cnl-n>*:focus-visible i{transform:scale(1.5)}
.cnl-n>*:hover b,.cnl-n>*:focus-visible b{color:var(--ts-electric-fg,var(--ts-electric))}
.cnl-n>*:focus-visible{box-shadow:0 0 0 2px var(--ts-electric)}
.cnl-n [role=tooltip]{position:absolute;top:calc(100% + 6px);left:0;z-index:2;width:220px;padding:10px 12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:var(--ts-muted);font-weight:400;font-size:12px;line-height:1.45;white-space:normal;box-shadow:var(--ts-elevation);opacity:0;visibility:hidden;transform:translateY(-4px);transition:opacity .15s,transform .15s,visibility .15s}
.cnl-n[data-half=r] [role=tooltip]{left:auto;right:0}
.cnl-n [role=tooltip] em{display:none;font-style:normal;font-weight:600;color:var(--ts-fg);margin-bottom:2px}
.cnl-n>*:hover [role=tooltip],.cnl-n>*:focus-visible [role=tooltip]{opacity:1;visibility:visible;transform:none}
@container (max-width:560px){.cnl-n:not(.is-center) b{display:none}.cnl-n [role=tooltip] em{display:block}.cnl-n [role=tooltip]{width:46cqw}}
@media (prefers-reduced-motion:reduce){.cnl-n i,.cnl-n [role=tooltip]{transition:none}}
`;

/** Four stages, PARA groups, on the page surface (home v6 interlude). */
export const convergeNetStagesDemo: ConvergeNetProps = { stage: "loop", nodes: 64, seed: 11, tone: "cream", duration: 12000, label: "Мэдээлэл захаас орж ирж, нэг note-ийн эргэн тойронд сүлжээ болж, PARA-гийн дөрвөн бүлэгт хуваагдан, тэнхлэгээ тойрон эргэх бөмбөрцөг болно" };

/** Stage 2 with labels: the home interlude's local graph (web-builder, t≈1.9 of converge-net-4). */
export const convergeNetGraphDemo: ConvergeNetProps = {
  stage: 2, nodes: 64, seed: 11, tone: "cream",
  label: "Нэг тэмдэглэлийн эргэн тойронд холбогдсон тэмдэглэлүүд",
  center: { label: "Үнийн бодлого" },
  notes: [
    { label: "Багийн уулзалт · 10-р сар", preview: "Үнийн хоёр хувилбарыг харьцуулав." },
    { label: "#sales хэлэлцүүлэг", preview: "Зардал өссөнийг санхүүгийн баг мэдэгдэв." },
    { label: "Зардлын тайлан", preview: "Түүхий эдийн үнэ 12% өсөв." },
    { label: "Харилцагчийн санал", preview: "Дунд багцыг тодорхой болгохыг хүссэн." },
    { label: "Өрсөлдөгчийн үнэ", preview: "Гурван өрсөлдөгчийн үнийг харьцуулав." },
    { label: "Санхүүгийн зорилт", preview: "Сарын давтагдах орлого +8%." },
    { label: "Үнийн хуудас", preview: "Сайтын үнийн хуудсыг 11/26-нд шинэчилнэ." },
  ],
};

export const convergeNetDemo: ConvergeNetProps = { nodes: 72, seed: 7, tone: "electric", play: "loop", duration: 6000 };

export default ConvergeNet;
