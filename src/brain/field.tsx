"use client";

import * as React from "react";

/**
 * Brain field — the shared base of Brain Map and Brain Growth: a seeded
 * layout (clusters of memory dots, links inside and between clusters) and one
 * SVG renderer driven by a single `progress` value (0–1). Every dot and link
 * has its own threshold, so the same picture can be scrubbed by scroll or
 * played by itself. The layout is a pure function of the seed: server and
 * client draw the same picture.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 */

export type BrainTone = "core" | "branch" | "leaf";

export type BrainCluster = {
  id: string;
  /** Centre in the 400-wide view box. */
  x: number;
  y: number;
  /** Radius the dots spread over. */
  r: number;
  /** Number of memory dots (1 = a single marker dot). */
  n: number;
  tone?: BrainTone;
  /** Progress at which the first dot shows… */
  at?: number;
  /** …and how long until the last one does. */
  span?: number;
};

export type BrainLink = {
  from: string;
  to: string;
  /** Progress at which the link shows. */
  at?: number;
  /** Strands drawn dot to dot; 0 draws one line edge to edge. */
  strands?: number;
};

/** `g` = the branch a dot or a link belongs to (the cluster id before «:»); the core is its own group. */
type Dot = { key: string; x: number; y: number; at: number; tone: BrainTone; g: string };
type Line = { key: string; x1: number; y1: number; x2: number; y2: number; at: number; cross: boolean; g: string };

/** Small deterministic PRNG (mulberry32). */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (v: number) => Math.round(v * 10) / 10;

/** Dots and links for a set of clusters — pure, seeded, SSR-stable. */
export function layoutBrain(clusters: BrainCluster[], links: BrainLink[], seed = 7) {
  const rand = seeded(seed);
  const dots: Dot[] = [];
  const lines: Line[] = [];
  const byCluster = new Map<string, Dot[]>();
  for (const c of clusters) {
    const at = c.at ?? 0;
    const span = c.span ?? 0.2;
    const tone = c.tone ?? "branch";
    const g = c.id.split(":")[0];
    const list: Dot[] = [];
    for (let i = 0; i < c.n; i++) {
      // sunflower spread with a little jitter: even density, no overlaps
      const rr = c.n === 1 ? 0 : c.r * Math.sqrt((i + 0.5) / c.n);
      const a = i * 2.39996 + (rand() - 0.5) * 0.5;
      const j = c.n === 1 ? 0 : (rand() - 0.5) * c.r * 0.12;
      list.push({ key: `${c.id}-${i}`, x: r2(c.x + Math.cos(a) * rr + j), y: r2(c.y + Math.sin(a) * rr + j), at: at + (span * i) / Math.max(1, c.n), tone, g });
    }
    // links inside a cluster: sunflower neighbours differ by Fibonacci steps
    const steps = c.n > 20 ? [8, 13] : c.n > 6 ? [3, 5] : [1];
    list.forEach((d, i) =>
      steps.forEach((s) => {
        const e = list[i + s];
        if (e) lines.push({ key: `${d.key}~${e.key}`, x1: d.x, y1: d.y, x2: e.x, y2: e.y, at: Math.max(d.at, e.at) + 0.04, cross: false, g });
      }),
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
    // strands: from dots on the facing side of each cluster
    const facing = (list: Dot[], tx: number, ty: number) => [...list].sort((p, q) => Math.hypot(p.x - tx, p.y - ty) - Math.hypot(q.x - tx, q.y - ty)).slice(0, Math.max(3, l.strands! * 2));
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

/**
 * Progress from outside (scroll, 0–1) or, when none is given, a short
 * self-played run: `steps` ticks within `duration` ms (≤5 s), then it rests
 * at 1. Reduced motion: the final state at once.
 */
export function useBrainProgress(progress: number | undefined, duration = 4200, steps = 14) {
  const [tick, setTick] = React.useState(0);
  const external = progress !== undefined;
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
    }, Math.min(duration, 5000) / steps);
    return () => window.clearInterval(id);
  }, [external, duration, steps]);
  return external ? Math.min(1, Math.max(0, progress!)) : tick / steps;
}

export type BrainFieldProps = {
  clusters: BrainCluster[];
  links: BrainLink[];
  progress: number;
  seed?: number;
  /** View box height (width is 400). */
  height?: number;
  /** Accessible description of the picture. */
  label: string;
  className?: string;
  /** A branch id: its dots and links stay bright, the rest steps back. The core always stays. */
  active?: string | null;
  /** Idle life once the picture is drawn: dots breathe, pulses travel the links from the core out. Off under reduced motion. */
  alive?: boolean;
};

/** The SVG: links under dots; each element shows once progress reaches it. */
export function BrainField({ clusters, links, progress, seed = 7, height = 320, label, className = "", active = null, alive = false }: BrainFieldProps) {
  const hot = (g: string) => (active && (g === active || g === "core") ? "" : undefined);
  const { dots, lines } = React.useMemo(() => layoutBrain(clusters, links, seed), [clusters, links, seed]);
  return (
    <svg className={`bf ${className}`} viewBox={`0 0 400 ${height}`} role="img" aria-label={label} data-active={active ? "" : undefined} data-alive={alive ? "" : undefined}>
      <g className="bf-lines">
        {lines.map((l) => (
          <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className={l.cross ? "bf-cross" : "bf-in"} data-on={progress >= l.at || undefined} data-hot={hot(l.g)} />
        ))}
      </g>
      {alive && (
        <g className="bf-pulses" aria-hidden="true">
          {lines.filter((l) => l.cross && progress >= l.at).map((l, i) => (
            <circle key={l.key} cx={l.x1} cy={l.y1} r={1.8} className="bf-pulse" data-hot={hot(l.g)} style={{ ["--dx" as string]: `${l.x2 - l.x1}px`, ["--dy" as string]: `${l.y2 - l.y1}px`, ["--i" as string]: i } as React.CSSProperties} />
          ))}
        </g>
      )}
      <g className="bf-dots">
        {dots.map((d) => (
          <circle key={d.key} cx={d.x} cy={d.y} r={d.tone === "leaf" ? 4 : d.tone === "core" ? 2.4 : 2} className={`bf-${d.tone}`} data-on={progress >= d.at || undefined} data-hot={hot(d.g)} style={{ ["--i" as string]: d.key.length + Math.round(d.x) } as React.CSSProperties} />
        ))}
      </g>
    </svg>
  );
}

/** Counts of what is visible — «санамж» (dots) and «холбоо» (links). */
export function brainCounts(clusters: BrainCluster[], links: BrainLink[], progress: number, seed = 7) {
  const { dots, lines } = layoutBrain(clusters, links, seed);
  return { memories: dots.filter((d) => progress >= d.at).length, links: lines.filter((l) => progress >= l.at).length };
}

export const brainFieldCss = `
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
