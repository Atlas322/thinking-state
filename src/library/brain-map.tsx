"use client";

import * as React from "react";
import { BrainField, brainFieldCss, useBrainProgress, type BrainCluster, type BrainLink } from "../brain/field";

/**
 * Brain Map — the hero picture: one brain in the middle, its branches
 * (memory · agents · thought) around it, and on each branch the agents with
 * the work they do written next to them. One idea, large and clean.
 * Built on the shared brain field (src/brain): the same seeded layout and
 * renderer as Brain Growth. Plays itself in ≤5 s (brain, then branches, then
 * agents); reduced motion shows the final picture.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 */

export type BrainMapAgent = { id: string; name: string; job: string };
export type BrainMapBranch = { id: string; label: string; agents: BrainMapAgent[] };

export type BrainMapData = {
  title?: string;
  caption?: string;
  /** Label on the centre cluster. */
  core: string;
  /** 2–4 branches; three reads best. */
  branches: BrainMapBranch[];
};

export type BrainMapLabels = { picture: string };

export type BrainMapProps = Partial<BrainMapData> & {
  /** 0–1 from outside (scroll); omit to let it play by itself. */
  progress?: number;
  seed?: number;
  labels?: Partial<BrainMapLabels>;
  className?: string;
};

const defaultLabels: BrainMapLabels = { picture: "Нэг тархи, түүнээс салбарласан хэсгүүд ба агентууд" };

export const brainMapDemo: BrainMapData = {
  title: "Танай компанийн нэг тархи",
  caption: "Санамж бүр нэг газар, агент бүр түүнээс уншиж, бодлоо ил гаргана.",
  core: "Тархи",
  branches: [
    {
      id: "memory",
      label: "Санах ой",
      agents: [
        { id: "m1", name: "Тэмдэглэгч", job: "Уулзалт бүрээс санамж бичнэ" },
        { id: "m2", name: "Холбогч", job: "Шинэ санамжийг хуучинтай холбоно" },
      ],
    },
    {
      id: "agents",
      label: "Агентууд",
      agents: [
        { id: "a1", name: "Борлуулалтын агент", job: "Сонирхогчдод санал бэлдэнэ" },
        { id: "a2", name: "Санхүүгийн агент", job: "Гүйлгээг сар бүр тулгана" },
      ],
    },
    {
      id: "thought",
      label: "Бодол",
      agents: [
        { id: "t1", name: "Тайлбарлагч", job: "Хариу бүрт эх сурвалжаа заана" },
        { id: "t2", name: "Шалгагч", job: "Шийдвэрийг хүнд батлуулна" },
      ],
    },
  ],
};

const CX = 200;
const CY = 158;

/** Branch and agent positions around the core, evenly spaced. */
function geometry(branches: BrainMapBranch[]) {
  const n = branches.length;
  const start = -90 - 180 / n;
  const clusters: BrainCluster[] = [{ id: "core", x: CX, y: CY, r: 46, n: 48, tone: "core", at: 0, span: 0.26 }];
  const links: BrainLink[] = [];
  const places: { id: string; x: number; y: number; at: number; agents: { id: string; at: number }[] }[] = [];
  branches.forEach((b, i) => {
    const ang = ((start + (360 / n) * i) * Math.PI) / 180;
    const x = Math.round(CX + Math.cos(ang) * 128);
    const y = Math.round(CY + Math.sin(ang) * 108);
    const at = 0.3 + i * 0.09;
    clusters.push({ id: b.id, x, y, r: 22, n: 15, tone: "branch", at, span: 0.12 });
    links.push({ from: "core", to: b.id, at: at - 0.02, strands: 3 });
    const agents = b.agents.slice(0, 3).map((a, k, all) => {
      const off = ((k - (all.length - 1) / 2) * 38 * Math.PI) / 180;
      const aat = 0.64 + i * 0.08 + k * 0.04;
      const id = `${b.id}:${a.id}`;
      clusters.push({ id, x: Math.round(x + Math.cos(ang + off) * 44), y: Math.round(y + Math.sin(ang + off) * 40), r: 0, n: 1, tone: "leaf", at: aat, span: 0 });
      links.push({ from: b.id, to: id, at: aat - 0.02 });
      return { id: a.id, at: aat };
    });
    // the label sits on the inward side, so the branch dots and agents stay visible
    places.push({ id: b.id, x: Math.round(x - Math.cos(ang) * 36), y: Math.round(y - Math.sin(ang) * 32), at, agents });
  });
  return { clusters, links, places };
}

export function BrainMap({ progress: progressProp, seed = 11, labels: labelsProp, className = "", ...data }: BrainMapProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const d: BrainMapData = { ...brainMapDemo, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) };
  const uid = React.useId();
  const geo = React.useMemo(() => geometry(d.branches), [d.branches]);
  const p = useBrainProgress(progressProp);

  return (
    <section className={`bm ${className}`} aria-labelledby={d.title ? `${uid}-h` : undefined} aria-label={d.title ? undefined : L.picture}>
      <style>{brainFieldCss + css}</style>
      {(d.title || d.caption) && (
        <header className="bm-head">
          {d.title && <h3 id={`${uid}-h`} className="bm-title">{d.title}</h3>}
          {d.caption && <p className="bm-cap">{d.caption}</p>}
        </header>
      )}
      <div className="bm-stage">
        <BrainField clusters={geo.clusters} links={geo.links} progress={p} seed={seed} label={L.picture} />
        <span className="bm-mark is-core" style={{ left: `${(CX / 400) * 100}%`, top: `${(CY / 320) * 100}%` }} data-on>
          {d.core}
        </span>
        {geo.places.map((pl, i) => (
          <span key={pl.id} className="bm-mark" style={{ left: `${(pl.x / 400) * 100}%`, top: `${(pl.y / 320) * 100}%` }} data-on={p >= pl.at + 0.06 || undefined}>
            {d.branches[i].label}
          </span>
        ))}
      </div>
      <ul className="bm-legend">
        {d.branches.map((b, i) => (
          <li key={b.id} className="bm-col" data-on={p >= geo.places[i].at + 0.06 || undefined}>
            <span className="bm-col-h">
              <span className="bm-n">{String(i + 1).padStart(2, "0")}</span>
              {b.label}
            </span>
            <ul className="bm-agents">
              {b.agents.slice(0, 3).map((a, k) => (
                <li key={a.id} className="bm-agent" data-on={p >= geo.places[i].agents[k].at || undefined}>
                  <span className="bm-dot" aria-hidden="true" />
                  <span>
                    <b>{a.name}</b>
                    <span className="bm-job">{a.job}</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
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
.bm-mark.is-core{padding:5px 14px;border-color:color-mix(in srgb,var(--bm-accent) 40%,var(--bm-line));color:var(--bm-accent-text);font-size:15px}
.bm-legend{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px 20px;margin:16px 0 0;padding:0;list-style:none}
.bm-col{padding-top:10px;border-top:1px solid var(--bm-line);opacity:0;transition:opacity .4s}
.bm-col[data-on]{opacity:1}
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

export default BrainMap;
