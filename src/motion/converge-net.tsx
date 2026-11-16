/**
 * ConvergeNet (2026-11-17, screens.15): information streams in from the edges and the dots join
 * into one network. White geometric vector links on Electric (or Electric on a light surface).
 * Ported from web-builder's prototype (site-recipes motifs/converge-net.html, 2fb7204) for the
 * home v6 interlude hero. Canvas, deterministic seed, loops; prefers-reduced-motion and
 * `play="static"` show the final network; `t` (0..1.4) freezes one frame (Figma, screenshots).
 * Colours come from the tokens: --ts-on-electric on Electric, --ts-electric on cream.
 */
import * as React from "react";
import { convergeStagesLayout, drawConvergeStages, paraNetGroups, type NetGroup } from "./converge-net-stages";
export { paraNetGroups, convergeStagesLayout, drawConvergeStages, type NetGroup, type NetShape } from "./converge-net-stages";

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

export function ConvergeNet({ stage, groups = paraNetGroups, nodes = 72, seed = 7, tone = "electric", play = "loop", duration = 6000, t, label = "Мэдээллийн урсгал захаас орж ирж, цэгүүд нэг сүлжээ болно", className = "", style }: ConvergeNetProps) {
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
  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={label}
      data-tone={tone}
      data-stage={stage === undefined ? undefined : String(stage)}
      className={`ts-converge-net ${className}`}
      style={{ display: "block", width: "100%", height: "100%", minHeight: 240, color, background: bg, ...style }}
    />
  );
}

/** Four stages, PARA groups, on the page surface (home v6 interlude). */
export const convergeNetStagesDemo: ConvergeNetProps = { stage: "loop", nodes: 64, seed: 11, tone: "cream", duration: 12000, label: "Мэдээлэл захаас орж ирж, нэг note-ийн эргэн тойронд сүлжээ болж, PARA-гийн дөрвөн бүлэгт хуваагдан, тэнхлэгээ тойрон эргэх бөмбөрцөг болно" };

export const convergeNetDemo: ConvergeNetProps = { nodes: 72, seed: 7, tone: "electric", play: "loop", duration: 6000 };

export default ConvergeNet;
