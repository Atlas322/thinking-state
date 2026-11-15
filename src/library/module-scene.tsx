"use client";

import * as React from "react";

/**
 * Module Scene — the ready-made solution as one scene: four departments
 * (sales, operations, finance, knowledge), each with its number, title, the
 * agent working there and what it is doing right now, and three example
 * figures — all wired to one brain at the top. Every card has the same build,
 * so they compare at a glance. Plays itself in ≤5 s (brain, wires, cards,
 * agents at work); reduced motion shows the final scene.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 */

export type ModuleSceneKpi = { value: string; label: string };
export type ModuleSceneModule = {
  id: string;
  title: string;
  agent: string;
  /** What the agent is doing now, one line. */
  job: string;
  kpis: ModuleSceneKpi[];
};

export type ModuleSceneData = {
  title?: string;
  /** Label on the brain. */
  core: string;
  modules: ModuleSceneModule[];
  /** Note under the figures, e.g. that they are examples. */
  note?: string;
};

export type ModuleSceneLabels = { working: string; picture: string };

export type ModuleSceneProps = Partial<ModuleSceneData> & {
  labels?: Partial<ModuleSceneLabels>;
  className?: string;
};

const defaultLabels: ModuleSceneLabels = { working: "Ажиллаж байна", picture: "Хэлтэс бүр нэг тархинд холбогдсон" };

export const moduleSceneDemo: ModuleSceneData = {
  title: "Хэлтэс бүрт агент, бүгд нэг тархинд",
  core: "Нэг тархи",
  note: "Жишээ · ac.me",
  modules: [
    {
      id: "sales",
      title: "Борлуулалт",
      agent: "Борлуулалтын агент",
      job: "Шинэ 12 сонирхогчийг ангилж, гуравт санал бэлдэв",
      kpis: [{ value: "4 мин", label: "анхны хариу" }, { value: "18", label: "санал" }, { value: "92%", label: "дагалт" }],
    },
    {
      id: "ops",
      title: "Үйл ажиллагаа",
      agent: "Үйл ажиллагааны агент",
      job: "Нөөцийн хоёр зөрүү олж, худалдан авалтад мэдэгдэв",
      kpis: [{ value: "−31%", label: "саатал" }, { value: "46", label: "хаасан ажил" }, { value: "9 цаг", label: "хэмнэлт" }],
    },
    {
      id: "finance",
      title: "Санхүү",
      agent: "Санхүүгийн агент",
      job: "Сарын 214 гүйлгээг тулгаж, гурван асуулт үлдээв",
      kpis: [{ value: "98%", label: "тулгалт" }, { value: "2 өдөр", label: "сарын хаалт" }, { value: "37", label: "нэхэмжлэл" }],
    },
    {
      id: "knowledge",
      title: "Мэдлэг",
      agent: "Мэдлэгийн агент",
      job: "Өнөөдрийн 9 уулзалтаас 21 санамж бичиж холбов",
      kpis: [{ value: "21", label: "шинэ санамж" }, { value: "64", label: "холбоо" }, { value: "100%", label: "эх сурвалжтай" }],
    },
  ],
};

/** Seeded sunflower of memory dots for the brain (same picture on server and client). */
function brainDots(n: number, r: number, cx: number, cy: number) {
  let s = 17;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: n }, (_, i) => {
    const rr = r * Math.sqrt((i + 0.5) / n);
    const a = i * 2.39996 + (rand() - 0.5) * 0.5;
    return { x: Math.round((cx + Math.cos(a) * rr * 1.5) * 10) / 10, y: Math.round((cy + Math.sin(a) * rr) * 10) / 10 };
  });
}

const STEPS = 14;

export function ModuleScene({ labels: labelsProp, className = "", ...data }: ModuleSceneProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const d: ModuleSceneData = { ...moduleSceneDemo, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) };
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
  // ticks: 1 brain · 2–3 wires · 3–6 cards · 7–10 agents at work · 11+ figures
  const wire = (i: number) => tick >= 2 + i * 0.5;
  const card = (i: number) => tick >= 3 + i;
  const working = (i: number) => tick >= 7 + i;
  const figures = (i: number) => tick >= 10 + i;
  const anchors4 = mods.map((_, i) => ((i + 0.5) / mods.length) * 800);

  return (
    <section className={`ms ${className}`} aria-labelledby={d.title ? `${uid}-h` : undefined} aria-label={d.title ? undefined : L.picture}>
      <style>{css}</style>
      {d.title && <h3 id={`${uid}-h`} className="ms-title">{d.title}</h3>}
      <div className="ms-brain">
        <svg className="ms-wires" viewBox="0 0 800 120" preserveAspectRatio="none" role="img" aria-label={L.picture}>
          {anchors4.map((x, i) => (
            <path key={i} pathLength={1} className="ms-wire is-wide" d={`M400 62 C400 96 ${x} 84 ${x} 120`} data-on={wire(i) || undefined} />
          ))}
          {mods.map((_, i) => {
            const x = i % 2 ? 600 : 200;
            return <path key={`n${i}`} pathLength={1} className="ms-wire is-narrow" d={`M400 62 C400 96 ${x} 84 ${x} 120`} data-on={wire(i) || undefined} />;
          })}
          <path pathLength={1} className="ms-wire is-one" d="M400 62 L400 120" data-on={wire(0) || undefined} />
        </svg>
        <svg className="ms-dots" viewBox="340 4 120 60" aria-hidden="true">
          {dots.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={1.8} data-on={tick >= 1 || undefined} style={{ transitionDelay: `${i * 12}ms` }} />
          ))}
        </svg>
        <span className="ms-core" data-on={tick >= 1 || undefined}>{d.core}</span>
      </div>
      <ol className="ms-grid">
        {mods.map((m, i) => (
          <li key={m.id} className="ms-card" data-on={card(i) || undefined}>
            <span className="ms-num">{String(i + 1).padStart(2, "0")}</span>
            <h4 className="ms-h">{m.title}</h4>
            <div className="ms-agent" data-working={working(i) || undefined}>
              <span className="ms-pulse" aria-hidden="true" />
              <span>
                <b>{m.agent}</b>
                <span className="ms-job">{working(i) ? m.job : L.working}</span>
              </span>
            </div>
            <dl className="ms-kpis" data-on={figures(i) || undefined}>
              {m.kpis.slice(0, 3).map((k) => (
                <div key={k.label}>
                  <dt>{k.label}</dt>
                  <dd>{k.value}</dd>
                </div>
              ))}
            </dl>
            {d.note && <p className="ms-note">{d.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

const css = `
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

export default ModuleScene;
