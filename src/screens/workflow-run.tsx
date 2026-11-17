/**
 * WorkflowRun (2026-11-17, screens.23): one real piece of work followed from the brain to its outputs,
 * live — which folders it reads, which agents think, what each work app holds (ready, missing, waiting),
 * which outputs wait for a person, and how the result goes back into the brain.
 * Owner: «бүх зүйл апп-ууд руу орж юу болж байгааг, аль алхам бэлэн, аль нь дутуу байгааг харуулж амьдруул».
 *
 *   <WorkflowRun {...workflowRunDemo} />        // ac.me Retail · the spring campaign
 *
 * Four stages on a wide container (sources → agents → apps → outputs) and a return line under them;
 * a vertical stepper on a narrow one. The story plays step by step while in view (pause and replay
 * from the controls); reduced motion shows the finished state. Every state is a word and a mark's
 * shape as well as a colour. Brand logos come from the library's set (SourceIcon). Demo data is ac.me,
 * a made-up company.
 */
import * as React from "react";
import { ScenarioRegion, motionVar } from "../motion";
import type { ScenarioStep } from "../motion/scenario";
import { SourceIcon, brandTrademarkNoteMn } from "../library/source-preview";

export type RunAppState = "ready" | "missing" | "waiting";
export type RunOutputState = "approve" | "your-turn" | "waiting";
export type RunSource = { id: string; folder: string; name: string };
export type RunAgentRow = { id: string; name: string; line: string };
export type RunApp = { id: string; brand: string; name: string; line: string; state: RunAppState };
export type RunOutput = { id: string; label: string; line: string; state: RunOutputState };

export type WorkflowRunLabels = {
  sources: string; agents: string; apps: string; outputs: string;
  app: Record<RunAppState, string>;
  output: Record<RunOutputState, string>;
  summary: (ready: number, total: number, missing: number, waiting: number) => string;
  reading: string; idle: string;
};
export const workflowRunLabelsMn: WorkflowRunLabels = {
  sources: "Тархи", agents: "Thinking State", apps: "Ажлын апп", outputs: "Гаралт",
  app: { ready: "Бэлэн", missing: "Дутуу", waiting: "Хүлээгдэж буй" },
  output: { approve: "Батлах хүлээж байна", "your-turn": "Хүний ээлж", waiting: "Хүлээгдэж буй" },
  summary: (r, t, m, w) => `${t} алхмын ${r} бэлэн · ${m} дутуу · ${w} хүлээгдэж буй`,
  reading: "уншиж байна", idle: "хүлээж байна",
};

export type WorkflowRunProps = {
  /** What is being made: «Хаврын хямдралын кампанит ажил». */
  title: string;
  /** Whose demo this is; say plainly that it is a demo. */
  note?: string;
  sources: RunSource[];
  /** One line under the agents: «агент бодно, хүн батална». */
  agentsLine?: string;
  agents: RunAgentRow[];
  apps: RunApp[];
  outputs: RunOutput[];
  /** The loop closing: what changed in the brain once the outputs are in. */
  back: string;
  /** Show the trademark note under the apps (default true: the logos belong to their owners). */
  trademark?: boolean;
  /** The finished state, no story (screenshots). Reduced motion does the same. */
  still?: boolean;
  labels?: Partial<WorkflowRunLabels>;
  className?: string;
};

type Beat = { src: boolean; agent: 0 | 1 | 2; apps: number; outs: number; back: boolean };

const SHAPE: Record<RunAppState | RunOutputState, string> = { ready: "check", approve: "circle", missing: "diamond", "your-turn": "diamond", waiting: "ring" };
const TONE: Record<RunAppState | RunOutputState, string> = { ready: "done", approve: "running", missing: "needs-you", "your-turn": "needs-you", waiting: "idle" };

function Mark({ state }: { state: RunAppState | RunOutputState }) {
  return (
    <span className="wr-mark" data-shape={SHAPE[state]} aria-hidden="true">
      {state === "ready" && <svg viewBox="0 0 8 8"><path d="M1.5 4.2 3.3 6l3.2-3.8" /></svg>}
    </span>
  );
}
const folderIcon = (
  <svg className="wr-fold" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
);

const CSS = `
.wr{--wr-bg:var(--ts-surface,#fff);--wr-fg:var(--ts-fg,#18181b);--wr-muted:var(--ts-muted,#52525b);--wr-faint:var(--ts-faint,#5c5c66);--wr-line:var(--ts-line,#e4e4e7);--wr-soft:var(--ts-soft,#f4f4f5);--wr-accent:var(--ts-accent-strong,#1b5cff);
container:wr / inline-size;position:relative;display:grid;gap:14px;width:100%;box-sizing:border-box;color:var(--wr-fg);font:400 13px/1.45 var(--ts-font,Inter,system-ui,sans-serif);text-align:left}
:where(.dark,[data-theme=dark]) .wr{--wr-bg:var(--ts-surface,#1b1b1e);--wr-fg:var(--ts-fg,#ececef);--wr-muted:var(--ts-muted,#a1a1aa);--wr-faint:var(--ts-faint,#9a9aa2);--wr-line:var(--ts-line,#303036);--wr-soft:var(--ts-soft,#26262a)}
.wr *{box-sizing:border-box}
.wr-top{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 16px;padding-right:68px}/* room for the replay and pause controls, which are always there (touch has no hover) */
.wr-title{margin:0;font-size:15px;font-weight:600}
.wr-sum{margin:0;font-size:12.5px;color:var(--wr-muted);font-variant-numeric:tabular-nums}
.wr-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,.9fr) minmax(0,1.5fr) minmax(0,1.1fr);gap:28px;align-items:start}
.wr-col{position:relative;display:grid;gap:6px;min-width:0;align-content:start}
.wr-h{margin:0 0 2px;font:500 11px/1.4 var(--ts-font-mono,ui-monospace,monospace);letter-spacing:.04em;text-transform:uppercase;color:var(--wr-faint)}
.wr-card{display:grid;grid-template-columns:auto minmax(0,1fr);gap:2px 8px;align-items:center;align-content:start;min-height:44px;padding:7px 10px;border:1px solid var(--wr-line);border-radius:var(--ts-radius-control,8px);background:var(--wr-bg);min-width:0;transition:opacity ${motionVar.duration("md")} ${motionVar.easing("enter")},transform ${motionVar.duration("md")} ${motionVar.easing("enter")},border-color ${motionVar.duration("sm")},box-shadow ${motionVar.duration("sm")}}
.wr-card b{font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wr-card small{grid-column:2;font-size:12px;color:var(--wr-muted);line-height:1.35}
.wr-card .wr-state{grid-column:2;justify-self:start;margin-top:3px}
.wr-card[data-on="false"]{opacity:.38}
.wr-card[data-hide="true"]{opacity:0;transform:translateY(6px)}
.wr-card[data-lit="true"]{border-color:var(--wr-accent);box-shadow:0 0 0 1px var(--wr-accent)}
.wr-fold{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:var(--ts-icon-stroke,1.5);stroke-linejoin:round;color:var(--ts-folder,#b98a10)}
.wr-apps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.wr-state{display:inline-flex;align-items:center;gap:5px;padding:1px 7px;border:1px solid var(--c-l);border-radius:999px;background:var(--c-b);color:var(--c);font-size:11.5px;font-weight:500;white-space:nowrap}
.wr-mark{position:relative;display:inline-grid;place-items:center;flex:none;width:9px;height:9px;background:var(--c);color:var(--c-b)}
.wr-mark[data-shape=circle],.wr-mark[data-shape=check]{border-radius:50%}
.wr-mark[data-shape=diamond]{width:8px;height:8px;transform:rotate(45deg);border-radius:1px}
.wr-mark[data-shape=ring]{border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px var(--c)}
.wr-mark svg{width:6px;height:6px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.wr [data-tone=done]{--c:var(--ts-status-done-fg,#3f5e41);--c-b:var(--ts-status-done-bg,#e3eadf);--c-l:var(--ts-status-done-border,#bfd2bb)}
.wr [data-tone=running]{--c:var(--ts-status-running-fg,#1d5fb8);--c-b:var(--ts-status-running-bg,#e3effd);--c-l:var(--ts-status-running-border,#b8d3f6)}
.wr [data-tone=needs-you]{--c:var(--ts-status-needs-you-fg,#a33e0b);--c-b:var(--ts-status-needs-you-bg,#fdebd6);--c-l:var(--ts-status-needs-you-border,#f2c597)}
.wr [data-tone=idle]{--c:var(--ts-status-idle-fg,#45433f);--c-b:var(--ts-status-idle-bg,#efebe1);--c-l:var(--ts-status-idle-border,#d8d3c6)}
:where(.dark,[data-theme=dark]) .wr [data-tone=done]{--c:var(--ts-status-done-fg,#8fcf96);--c-b:var(--ts-status-done-bg,#1f2d22);--c-l:var(--ts-status-done-border,#355238)}
:where(.dark,[data-theme=dark]) .wr [data-tone=running]{--c:var(--ts-status-running-fg,#7fb0f5);--c-b:var(--ts-status-running-bg,#1d2b40);--c-l:var(--ts-status-running-border,#2c4a72)}
:where(.dark,[data-theme=dark]) .wr [data-tone=needs-you]{--c:var(--ts-status-needs-you-fg,#f0883e);--c-b:var(--ts-status-needs-you-bg,#3a2717);--c-l:var(--ts-status-needs-you-border,#6b4220)}
:where(.dark,[data-theme=dark]) .wr [data-tone=idle]{--c:var(--ts-status-idle-fg,#a1a1aa);--c-b:var(--ts-status-idle-bg,#26262a);--c-l:var(--ts-status-idle-border,#4e4d49)}
.wr-agent{grid-template-columns:minmax(0,1fr) auto}
.wr-agent small,.wr-agent .wr-state{grid-column:1/-1}
.wr-agent b{grid-column:1/-1;white-space:normal}
.wr-ag b{grid-column:1}
.wr-live{font-size:11.5px;color:var(--wr-faint)}
.wr-live[data-live=true]{color:var(--wr-accent)}
.wr-agline{margin:2px 0 0;font-size:12px;color:var(--wr-faint)}
/* the wire to the next stage: a line that fills when the work has passed through, and a pulse while it does */
.wr-col:not(:last-child)::after{content:"";position:absolute;top:34px;right:-28px;width:28px;height:1.5px;background:var(--wr-line);transition:background ${motionVar.duration("md")}}
.wr-col[data-passed=true]:not(:last-child)::after{background:var(--wr-accent)}
.wr-col[data-pulse=true]:not(:last-child)::before{content:"";position:absolute;top:31px;right:-28px;width:7px;height:7px;border-radius:50%;background:var(--wr-accent);animation:wr-run ${motionVar.duration("xl")} ${motionVar.easing("standard")} infinite}
@keyframes wr-run{from{transform:translateX(-28px);opacity:0}30%{opacity:1}to{transform:translateX(0);opacity:0}}
.wr-back{display:flex;align-items:center;gap:10px;margin:0;padding:9px 12px;border:1px dashed var(--wr-line);border-radius:var(--ts-radius-control,8px);color:var(--wr-faint);font-size:12.5px;transition:border-color ${motionVar.duration("md")},color ${motionVar.duration("md")},background ${motionVar.duration("md")}}
.wr-back svg{width:15px;height:15px;flex:none;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.wr-back[data-on=true]{border-color:var(--wr-accent);border-style:solid;color:var(--wr-fg);background:color-mix(in srgb,var(--wr-accent) 6%,var(--wr-bg))}
.wr-back[data-on=true] svg{color:var(--wr-accent)}
.wr-foot{margin:0;font-size:11.5px;color:var(--wr-faint);line-height:1.5}
.wr-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (prefers-reduced-motion:reduce){.wr-card,.wr-back,.wr-col::after{transition:none}.wr-col::before{animation:none!important;display:none}}
@container wr (max-width:900px){.wr-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px 28px}.wr-col:nth-child(2)::after,.wr-col:nth-child(2)::before{display:none}}
@container wr (max-width:560px){.wr-grid{grid-template-columns:minmax(0,1fr);gap:26px;padding-left:18px}.wr-apps{grid-template-columns:minmax(0,1fr)}
.wr-col:not(:last-child)::after{top:auto;bottom:-26px;right:auto;left:-12px;width:1.5px;height:calc(100% + 26px)}
.wr-col:last-child::after{content:"";position:absolute;left:-12px;top:0;width:1.5px;height:100%;background:var(--wr-line)}
.wr-col:not(:last-child)::before,.wr-col[data-pulse=true]:not(:last-child)::before{display:none}
.wr-h::before{content:"";position:absolute;left:-15.5px;width:8.5px;height:8.5px;margin-top:3px;border-radius:50%;background:var(--wr-line)}
.wr-col[data-passed=true] .wr-h::before{background:var(--wr-accent)}}
`;

export function WorkflowRun({ title, note, sources, agentsLine, agents, apps, outputs, back, trademark = true, still = false, labels: labelsIn, className = "" }: WorkflowRunProps) {
  const L = { ...workflowRunLabelsMn, ...labelsIn };
  // The story, in the order the work really travels. The last beat is the finished state.
  const steps = React.useMemo<ScenarioStep<Beat>[]>(() => {
    const out: ScenarioStep<Beat>[] = [{ state: { src: false, agent: 0, apps: 0, outs: 0, back: false }, hold: 700 }];
    out.push({ state: { src: true, agent: 0, apps: 0, outs: 0, back: false }, hold: 1100 });
    out.push({ state: { src: true, agent: 1, apps: 0, outs: 0, back: false }, hold: 1500 });
    for (let i = 1; i <= apps.length; i++) out.push({ state: { src: true, agent: 2, apps: i, outs: 0, back: false }, hold: 620 });
    for (let i = 1; i <= outputs.length; i++) out.push({ state: { src: true, agent: 2, apps: apps.length, outs: i, back: false }, hold: 800 });
    out.push({ state: { src: true, agent: 2, apps: apps.length, outs: outputs.length, back: true }, hold: 2600 });
    return out;
  }, [apps.length, outputs.length]);
  const last = steps[steps.length - 1].state;
  const count = (s: RunAppState) => apps.filter((a) => a.state === s).length;

  const body = (b: Beat) => (
    <>
      <div className="wr-top">
        <h3 className="wr-title">{title}</h3>
        <p className="wr-sum" aria-live="polite">{b.apps >= apps.length ? L.summary(count("ready"), apps.length, count("missing"), count("waiting")) : note}</p>
      </div>
      <div className="wr-grid">
        <div className="wr-col" data-passed={b.agent > 0} data-pulse={b.src && b.agent === 0}>
          <p className="wr-h">{L.sources}</p>
          {sources.map((s) => (
            <div key={s.id} className="wr-card" data-on={b.src} data-lit={b.src && b.agent === 0}>
              {folderIcon}
              <b>{s.name}</b>
              <small>{s.folder}</small>
            </div>
          ))}
        </div>
        <div className="wr-col" data-passed={b.apps > 0} data-pulse={b.agent === 1 || (b.agent === 2 && b.apps < apps.length)}>
          <p className="wr-h">{L.agents}</p>
          {agents.map((a) => (
            <div key={a.id} className="wr-card wr-agent wr-ag" data-on={b.agent > 0} data-lit={b.agent === 1}>
              <b>{a.name}</b>
              <span className="wr-live" data-live={b.agent === 1}>{b.agent === 1 ? L.reading : b.agent === 0 ? L.idle : ""}</span>
              <small>{a.line}</small>
            </div>
          ))}
          {agentsLine && <p className="wr-agline">{agentsLine}</p>}
        </div>
        <div className="wr-col" data-passed={b.outs > 0} data-pulse={b.apps >= apps.length && b.outs < outputs.length}>
          <p className="wr-h">{L.apps}</p>
          <div className="wr-apps">
            {apps.map((a, i) => (
              <div key={a.id} className="wr-card" data-tone={TONE[a.state]} data-hide={i >= b.apps} aria-hidden={i >= b.apps}>
                <SourceIcon kind="document" brand={a.brand} size={16} tile={false} />
                <b>{a.name}</b>
                <small>{a.line}</small>
                <span className="wr-state"><Mark state={a.state} />{L.app[a.state]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="wr-col" data-passed={b.back}>
          <p className="wr-h">{L.outputs}</p>
          {outputs.map((o, i) => (
            <div key={o.id} className="wr-card wr-agent" data-tone={TONE[o.state]} data-hide={i >= b.outs} aria-hidden={i >= b.outs} data-lit={o.state === "your-turn" && b.outs >= outputs.length}>
              <b>{o.label}</b>
              <small>{o.line}</small>
              <span className="wr-state"><Mark state={o.state} />{L.output[o.state]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="wr-back" data-on={b.back}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
        <span>{back}</span>
      </p>
      {(note || trademark) && <p className="wr-foot">{note}{note && trademark ? " " : ""}{trademark ? brandTrademarkNoteMn : ""}</p>}
    </>
  );

  if (still) return <section className={`wr ${className}`.trim()} aria-label={title}><style>{CSS}</style>{body(last)}</section>;
  return (
    <ScenarioRegion<Beat> as="section" steps={steps} controls="always" rest={2400} className={`wr ${className}`.trim()}>
      {(b) => <><style>{CSS}</style>{body(b ?? last)}</>}
    </ScenarioRegion>
  );
}

/** Demo · ac.me Retail (a made-up company): the spring campaign, followed from the brain to its outputs. */
export const workflowRunDemo: WorkflowRunProps = {
  title: "Хаврын хямдрал 20% ба үнэнч харилцагчийн урамшуулал",
  note: "ac.me Retail · демо өгөгдөл, бодит харилцагч биш.",
  sources: [
    { id: "p", folder: "Төсөл", name: "Хаврын кампанит ажил" },
    { id: "a", folder: "Хүрээ", name: "Маркетинг" },
    { id: "r", folder: "Нөөц", name: "Брэндийн гарын авлага" },
    { id: "s", folder: "Судалгаа", name: "Өрсөлдөгчийн үнэ" },
  ],
  agentsLine: "Агент бодно, хүн батална.",
  agents: [
    { id: "plan", name: "Төлөвлөгч агент", line: "Алхмыг хуваарилна" },
    { id: "calc", name: "Тооцооны агент", line: "Хямдралын хувь, төсөв" },
    { id: "write", name: "Бичигч агент", line: "Нийтлэл, имэйл, тайлбар" },
    { id: "design", name: "Дизайны агент", line: "Баннер, reel-ийн кадр" },
  ],
  apps: [
    { id: "sheets", brand: "google-sheets", name: "Google Sheets", line: "Хямдрал 20% · тооцоо", state: "ready" },
    { id: "figma", brand: "figma", name: "Figma", line: "Баннер, гурван хэмжээ", state: "ready" },
    { id: "meta", brand: "meta", name: "Meta", line: "Зарын төсөв, үзэгчид", state: "ready" },
    { id: "voice", brand: "elevenlabs", name: "ElevenLabs", line: "Reel-ийн дуу хоолой", state: "ready" },
    { id: "slack", brand: "slack", name: "Slack", line: "Багт мэдэгдсэн", state: "ready" },
    { id: "premiere", brand: "adobe-premiere", name: "Premiere Pro", line: "Reel-ийн эвлүүлэг", state: "waiting" },
    { id: "notion", brand: "notion", name: "Notion", line: "Үнэнч харилцагчийн жагсаалт", state: "missing" },
  ],
  outputs: [
    { id: "ads", label: "Баннер ба зар", line: "Маркетингийн менежер батална", state: "approve" },
    { id: "calc", label: "Хямдралын тооцоо", line: "Санхүү батална", state: "approve" },
    { id: "reel", label: "Reel", line: "Эвлүүлэг дуусахыг хүлээж байна", state: "waiting" },
    { id: "mail", label: "Имэйл: үнэнч харилцагчид", line: "Жагсаалт дутуу: хэнд илгээхээ сонгоно", state: "your-turn" },
  ],
  back: "Маркетинг хүрээний «Одоогийн үнэн» шинэчлэгдлээ: кампанит ажлын 7 алхмын 5 нь бэлэн.",
};

export default WorkflowRun;
