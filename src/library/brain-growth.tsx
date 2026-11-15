"use client";

import * as React from "react";
import { BrainField, brainCounts, brainFieldCss, useBrainProgress, type BrainCluster, type BrainLink } from "../brain/field";

/**
 * Brain Growth — memories link up and the brain grows: a personal brain
 * (one cluster), then a team brain (clusters joined), then the organisation
 * brain (departments joined). Dots never get bigger; links get more.
 * Pass `progress` (0–1) from the page's scroll to scrub it; without it the
 * picture plays itself in ≤5 s. Reduced motion shows the final state. The
 * layout is seeded, so server and client draw the same picture.
 * Built on the shared brain field (src/brain), same as Brain Map.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 */

export type BrainGrowthStage = { id: string; label: string; caption: string };

export type BrainGrowthData = {
  title?: string;
  /** Exactly three stages: personal, team, organisation. */
  stages: [BrainGrowthStage, BrainGrowthStage, BrainGrowthStage];
};

export type BrainGrowthLabels = { memories: string; links: string; picture: string };

export type BrainGrowthProps = Partial<BrainGrowthData> & {
  /** 0–1 from outside (scroll progress); omit to let it play by itself. */
  progress?: number;
  seed?: number;
  labels?: Partial<BrainGrowthLabels>;
  className?: string;
};

const defaultLabels: BrainGrowthLabels = { memories: "санамж", links: "холбоо", picture: "Санамжууд холбогдож тархи өсөж байна" };

export const brainGrowthDemo: BrainGrowthData = {
  title: "Тархи томроод биш, холбоогоороо өсдөг",
  stages: [
    { id: "personal", label: "Хувийн тархи", caption: "Таны санамжууд хоорондоо холбогдоно." },
    { id: "team", label: "Багийн тархи", caption: "Багийн гишүүдийн тархи нэг сүлжээ болно." },
    { id: "org", label: "Байгууллагын тархи", caption: "Хэлтэс бүр нэг тархинаас уншиж, нэмнэ." },
  ],
};

/** Stage thresholds on the 0–1 progress line. */
export const brainGrowthStops = [0, 0.34, 0.67] as const;

const CX = 200;
const CY = 165;

function geometry() {
  const clusters: BrainCluster[] = [{ id: "me", x: CX, y: CY, r: 32, n: 26, tone: "core", at: 0, span: 0.22 }];
  const links: BrainLink[] = [];
  const ring = (count: number, rx: number, ry: number, rot: number) =>
    Array.from({ length: count }, (_, i) => {
      const a = ((rot + (360 / count) * i) * Math.PI) / 180;
      return { x: Math.round(CX + Math.cos(a) * rx), y: Math.round(CY + Math.sin(a) * ry) };
    });
  ring(4, 108, 86, 45).forEach((p, i) => {
    const id = `t${i}`;
    clusters.push({ id, ...p, r: 20, n: 13, tone: "branch", at: 0.34 + i * 0.04, span: 0.12 });
    links.push({ from: "me", to: id, at: 0.44 + i * 0.03, strands: 2 });
    links.push({ from: id, to: `t${(i + 1) % 4}`, at: 0.56 + i * 0.02, strands: 1 });
  });
  ring(6, 172, 136, 0).forEach((p, i) => {
    const id = `o${i}`;
    clusters.push({ id, ...p, r: 14, n: 9, tone: "branch", at: 0.67 + i * 0.025, span: 0.1 });
    // each department joins its two nearest team clusters
    const near = [0, 1, 2, 3].sort((a, b) => {
      const ta = clusters[1 + a];
      const tb = clusters[1 + b];
      return Math.hypot(ta.x - p.x, ta.y - p.y) - Math.hypot(tb.x - p.x, tb.y - p.y);
    });
    links.push({ from: `t${near[0]}`, to: id, at: 0.8 + i * 0.02, strands: 2 });
    links.push({ from: `t${near[1]}`, to: id, at: 0.86 + i * 0.02, strands: 1 });
    links.push({ from: id, to: `o${(i + 1) % 6}`, at: 0.9 + i * 0.015, strands: 1 });
  });
  return { clusters, links };
}

export function BrainGrowth({ progress: progressProp, seed = 23, labels: labelsProp, className = "", ...data }: BrainGrowthProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const d: BrainGrowthData = { ...brainGrowthDemo, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) };
  const uid = React.useId();
  const geo = React.useMemo(geometry, []);
  const p = useBrainProgress(progressProp, 4500, 15);
  const stage = p >= brainGrowthStops[2] ? 2 : p >= brainGrowthStops[1] ? 1 : 0;
  const counts = React.useMemo(() => brainCounts(geo.clusters, geo.links, p, seed), [geo, p, seed]);

  return (
    <section className={`bg ${className}`} data-stage={d.stages[stage].id} aria-labelledby={d.title ? `${uid}-h` : undefined} aria-label={d.title ? undefined : L.picture}>
      <style>{brainFieldCss + css}</style>
      {d.title && <h3 id={`${uid}-h`} className="bg-title">{d.title}</h3>}
      <div className="bg-stage">
        <BrainField clusters={geo.clusters} links={geo.links} progress={p} seed={seed} height={330} label={L.picture} />
      </div>
      <p className="bg-count" aria-live="polite">
        <span><b>{counts.memories}</b> {L.memories}</span>
        <span><b>{counts.links}</b> {L.links}</span>
      </p>
      <ol className="bg-steps">
        {d.stages.map((s, i) => (
          <li key={s.id} className="bg-step" aria-current={i === stage ? "step" : undefined} data-past={i < stage || undefined}>
            <span className="bg-n">{i + 1}</span>
            <span>
              <b>{s.label}</b>
              <span className="bg-cap">{s.caption}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const css = `
.bg{--bg-fg:var(--ts-fg,#18181b);--bg-muted:var(--ts-muted,#65656d);--bg-line:var(--ts-line,#ececef);--bg-surface:var(--ts-surface,#fff);--bg-accent:var(--ts-accent,#4f7cf0);--bg-accent-soft:var(--ts-accent-soft,#e8f1fe);--bg-accent-text:var(--ts-accent-strong,#1b5cff);width:100%;max-width:720px;margin:0 auto;color:var(--bg-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);box-sizing:border-box}
:where(.dark,[data-theme=dark]) .bg{--bg-fg:var(--ts-fg,#ececef);--bg-muted:var(--ts-muted,#a1a1aa);--bg-line:var(--ts-line,#2e2e33);--bg-surface:var(--ts-surface,#1b1b1e);--bg-accent:var(--ts-accent,#7c9cff);--bg-accent-soft:var(--ts-accent-soft,#1b2a44);--bg-accent-text:var(--ts-accent,#7c9cff);color-scheme:dark}
.bg *{box-sizing:border-box}
.bg .bf{--bf-surface:var(--bg-surface);--bf-branch:var(--bg-fg)}
.bg-title{margin:0 0 8px;text-align:center;font:var(--ts-head-weight,600) clamp(20px,4vw,30px)/1.2 var(--ts-font-display,inherit);letter-spacing:var(--ts-head-tracking,-.01em)}
.bg-stage{max-width:560px;margin:0 auto}
.bg-count{display:flex;justify-content:center;gap:16px;margin:6px 0 0;color:var(--bg-muted);font-size:13px;font-variant-numeric:tabular-nums}
.bg-count b{color:var(--bg-fg);font-weight:600}
.bg-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin:14px 0 0;padding:0;list-style:none}
.bg-step{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--bg-line);border-radius:var(--ts-radius-tile,10px);color:var(--bg-muted);transition:border-color .3s,background .3s,color .3s}
.bg-step b{display:block;font-weight:600}
.bg-cap{display:block;font-size:13px}
.bg-step[data-past]{color:var(--bg-fg)}
.bg-step[aria-current]{border-color:color-mix(in srgb,var(--bg-accent) 45%,var(--bg-line));background:var(--bg-accent-soft);color:var(--bg-fg)}
.bg-n{flex:none;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;border:1px solid currentColor;font-size:12px;font-weight:600}
.bg-step[aria-current] .bg-n{border-color:var(--bg-accent);color:var(--bg-accent-text)}
@media(prefers-reduced-motion:reduce){.bg *{transition:none!important}}
`;

export default BrainGrowth;
