/**
 * ScenarioChat — a role's own questions answered from the company's data,
 * with sources (owner 2026-11-12: «гол нь бүтэцлэгдсэн байдал ба эх
 * сурвалж»). Data is the Company contract's `scenarios` (inai-sh #48):
 * question, sources (type · title · date), steps, answer, guard — passed
 * as props; the ac.me scenario text stays in inai-sh.
 *
 * Story per question (the Thinking State scenario standard): the question
 * → sources found one by one («Санах ойгоос хайв») → steps ticked → the
 * answer → who guards it (human approval / role access) → rest → the next
 * question. Plays in view only, at most `loops` questions, ↺ / ⏸, reduced
 * motion shows the whole answer. Picking a question stops the autoplay and
 * shows that answer in full.
 */
import * as React from "react";
import { Icon, type IconName } from "../company/icons";
import { useScenario, MotionControls, MotionStyles, type ScenarioStep } from "../motion";
import { IconTile, PrimitiveStyles, type IconTileTone } from "./primitives";

export type ChatSourceType = "document" | "register" | "decision" | "note";
export type ChatScenario = {
  id: string;
  role: string;
  personId?: string;
  function?: string;
  group?: string;
  question: string;
  doubt?: string;
  sources?: { type: ChatSourceType | string; title: string; date?: string }[];
  steps?: string[];
  answer?: string;
  guard?: "role-access" | "human-approval" | string;
};

export type ScenarioChatLabels = {
  list: string;
  /** Narrow screens: the button that unfolds the other questions. */
  more: (n: number) => string;
  less: string;
  sources: string;
  steps: string;
  doubt: string;
  guards: Record<string, { label: string; pending: string; human: boolean }>;
  fiction?: string;
};
export const scenarioChatLabelsMn: ScenarioChatLabels = {
  list: "Асуултууд",
  more: (n) => `Бусад асуулт (${n})`,
  less: "Хураах",
  sources: "Санах ойгоос хайв",
  steps: "Алхам",
  doubt: "Эргэлзээ",
  guards: {
    "human-approval": { label: "Хүн батална", pending: "Хүний батлалт хүлээж байна", human: true },
    "role-access": { label: "Таны эрхээр л нээгдэх өгөгдлөөс", pending: "Эрхийг шалгаж байна", human: false },
  },
};

const SOURCE: Record<string, { icon: IconName; tone: IconTileTone }> = {
  document: { icon: "file-text", tone: "cat-2" },
  register: { icon: "table", tone: "cat-3" },
  decision: { icon: "git-branch", tone: "cat-4" },
  note: { icon: "pencil", tone: "cat-1" },
};

/** Phases of one answer, in order. */
type Phase = { at: "question" | "source" | "step" | "answer" | "guard" | "done"; n: number };

function phasesOf(s: ChatScenario): ScenarioStep<Phase>[] {
  const out: ScenarioStep<Phase>[] = [{ state: { at: "question", n: 0 }, hold: 900 }];
  (s.sources ?? []).forEach((_, i) => out.push({ state: { at: "source", n: i + 1 }, hold: 520 }));
  (s.steps ?? []).forEach((_, i) => out.push({ state: { at: "step", n: i + 1 }, hold: 640 }));
  if (s.answer) out.push({ state: { at: "answer", n: 0 }, hold: 1400 });
  if (s.guard) out.push({ state: { at: "guard", n: 0 }, hold: 900 });
  out.push({ state: { at: "done", n: 0 }, hold: 400 });
  return out;
}
const ORDER: Phase["at"][] = ["question", "source", "step", "answer", "guard", "done"];
const past = (p: Phase, at: Phase["at"]) => ORDER.indexOf(p.at) > ORDER.indexOf(at);

export type ScenarioChatProps = {
  scenarios: ChatScenario[];
  /** Names for scenario.personId («Санхүүч · Б. Номин»). */
  people?: { id: string; name: string }[];
  /** Play the questions one after another. Default true. */
  autoplay?: boolean;
  /** Questions played before it rests on the last answer. Default 3. */
  loops?: number;
  defaultIndex?: number;
  onSelect?: (scenario: ChatScenario) => void;
  labels?: Partial<ScenarioChatLabels>;
  className?: string;
};

export function ScenarioChat({ scenarios, people = [], autoplay = true, loops = 3, defaultIndex = 0, onSelect, labels, className = "" }: ScenarioChatProps) {
  const L = { ...scenarioChatLabelsMn, ...labels, guards: { ...scenarioChatLabelsMn.guards, ...labels?.guards } };
  const [pick, setPick] = React.useState(Math.min(defaultIndex, Math.max(0, scenarios.length - 1)));
  const [played, setPlayed] = React.useState(0);
  const [manual, setManual] = React.useState(!autoplay);
  // narrow screens fold the list to the current question (accordion)
  const [listOpen, setListOpen] = React.useState(false);
  const listId = React.useId();
  const cur = scenarios[pick];
  const steps = React.useMemo(() => (cur ? phasesOf(cur) : [{ state: { at: "done", n: 0 } as Phase, hold: 1000 }]), [cur]);
  const sc = useScenario<Phase, HTMLDivElement>(steps, { loops: 1, rest: 2600 });
  // the story of one question ended: on to the next, up to `loops` questions
  const finished = sc.cycle >= 1;
  React.useEffect(() => {
    if (!finished || manual || scenarios.length < 2 || played + 1 >= loops) return;
    setPlayed((n) => n + 1);
    setPick((i) => (i + 1) % scenarios.length);
    sc.replay();
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps
  const phase: Phase = manual ? { at: "done", n: 0 } : sc.state;
  const choose = (i: number) => {
    setManual(true);
    setPick(i);
    setListOpen(false);
    onSelect?.(scenarios[i]);
  };
  const replay = () => {
    setManual(false);
    setPlayed(0);
    sc.replay();
  };
  if (!cur) return null;
  const person = cur.personId ? people.find((p) => p.id === cur.personId) : undefined;
  const guard = cur.guard ? L.guards[cur.guard] : undefined;
  const srcShown = phase.at === "source" ? phase.n : past(phase, "source") ? (cur.sources?.length ?? 0) : 0;
  const stepsDone = phase.at === "step" ? phase.n : past(phase, "step") ? (cur.steps?.length ?? 0) : 0;
  const answerShown = phase.at === "answer" || past(phase, "answer");
  const guardShown = phase.at === "guard" || past(phase, "guard");
  const guardOk = past(phase, "guard");

  return (
    <div ref={sc.ref} className={`ts-loop-region ts-sc ${className}`} {...sc.attrs} data-controls="hover">
      <PrimitiveStyles />
      <MotionStyles />
      <style href="ts-scenario-chat" precedence="default">
        {CSS}
      </style>
      <div className="ts-sc-side">
      <ol className="ts-sc-list" id={listId} aria-label={L.list} data-open={listOpen || undefined}>
        {scenarios.map((s, i) => (
          <li key={s.id}>
            <button type="button" className="ts-sc-q" aria-pressed={i === pick} onClick={() => choose(i)}>
              <Icon name="message-circle" size={14} />
              <span>
                {s.group && <small>{s.group}</small>}
                {s.question}
              </span>
            </button>
          </li>
        ))}
      </ol>
      {scenarios.length > 1 && (
        <button type="button" className="ts-sc-more" aria-expanded={listOpen} aria-controls={listId} onClick={() => setListOpen(!listOpen)}>
          <Icon name="chevron-down" size={14} />
          {listOpen ? L.less : L.more(scenarios.length - 1)}
        </button>
      )}
      </div>
      <article className="ts-sc-answer" aria-live="polite" key={cur.id}>
        <p className="ts-sc-asker">
          <Icon name="user" size={14} />
          {cur.role}
          {person ? ` · ${person.name}` : ""}
        </p>
        <p className="ts-sc-question ts-enter">{cur.question}</p>
        {cur.doubt && (
          <p className="ts-sc-doubt">
            <Icon name="circle-help" size={14} />
            {L.doubt}: {cur.doubt}
          </p>
        )}
        {!!cur.sources?.length && (
          <section className="ts-sc-block" data-on={srcShown > 0 || undefined}>
            <span className="ts-sc-h">
              <Icon name="search" size={13} />
              {L.sources}
            </span>
            <ul className="ts-sc-sources">
              {cur.sources.map((src, i) => {
                const t = SOURCE[src.type] ?? { icon: "file-text" as IconName, tone: "neutral" as IconTileTone };
                return (
                  <li key={`${src.title}-${i}`} data-on={i < srcShown || undefined}>
                    <IconTile icon={t.icon} tone={t.tone} size="S" />
                    <span>{src.title}</span>
                    {src.date && <time dateTime={src.date}>{src.date}</time>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        {!!cur.steps?.length && (
          <section className="ts-sc-block" data-on={stepsDone > 0 || undefined}>
            <span className="ts-sc-h">
              <Icon name="list" size={13} />
              {L.steps}
            </span>
            <ol className="ts-sc-steps">
              {cur.steps.map((st, i) => (
                <li key={st} data-done={i < stepsDone || undefined}>
                  <Icon name={i < stepsDone ? "circle-check" : "circle"} size={15} />
                  <span>{st}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
        {cur.answer && (
          <p className="ts-sc-text" data-on={answerShown || undefined}>
            <Icon name="sparkles" size={15} />
            <span>{cur.answer}</span>
          </p>
        )}
        {guard && (
          <p className={`ts-sc-guard${guard.human ? " is-human" : ""}`} data-on={guardShown || undefined} data-ok={guardOk || undefined}>
            <Icon name={guard.human ? "user-check" : "shield-check"} size={15} />
            {guardOk ? guard.label : guard.pending}
          </p>
        )}
        {L.fiction && <p className="ts-sc-fiction">{L.fiction}</p>}
      </article>
      {sc.loopState !== "reduced" && <MotionControls onReplay={replay} paused={sc.paused} onTogglePause={sc.togglePaused} />}
    </div>
  );
}

const CSS = `
.ts-sc{display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);gap:var(--ts-space-5,24px);font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg,#080808)}
.ts-sc-side{display:grid;gap:4px;align-content:start;min-width:0}
.ts-sc-list{display:grid;gap:4px;align-content:start;margin:0;padding:0;list-style:none}
.ts-sc-more{display:none;align-items:center;gap:6px;justify-self:start;height:32px;padding:0 10px;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-pill,999px);background:var(--ts-surface,#f7f5ee);color:var(--ts-fg,#080808);font:500 13px var(--ts-font,Inter,system-ui,sans-serif);cursor:pointer}
.ts-sc-more .cv-icon{transition:transform var(--ts-motion-dur-sm,200ms)}
.ts-sc-more[aria-expanded=true] .cv-icon{transform:rotate(180deg)}
.ts-sc-more:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:2px}
.ts-sc-q{display:flex;gap:10px;width:100%;padding:10px 12px;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted,#5e5a52);font:500 14px/1.4 var(--ts-font,Inter,system-ui,sans-serif);text-align:left;cursor:pointer;transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms)}
.ts-sc-q .cv-icon{flex:none;margin-top:2px}
.ts-sc-q small{display:block;margin-bottom:2px;font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.04em;text-transform:uppercase;opacity:.8}
.ts-sc-q:hover{background:var(--ts-soft,#efebe1);color:var(--ts-fg,#080808)}
.ts-sc-q[aria-pressed=true]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}
.ts-sc-q:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:2px}
.ts-sc-answer{display:grid;gap:var(--ts-space-4,16px);align-content:start;min-width:0;padding:var(--ts-space-5,24px);border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee)}
.ts-sc-asker,.ts-sc-doubt,.ts-sc-guard,.ts-sc-h{display:inline-flex;align-items:center;gap:6px;margin:0}
.ts-sc-asker{font:500 12px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-muted,#5e5a52)}
.ts-sc-question{margin:0;font:var(--ts-head-weight,600) 20px/1.3 var(--ts-font-head,Inter,system-ui,sans-serif);letter-spacing:var(--ts-head-tracking,-.02em)}
.ts-sc-doubt{font-size:13px;color:var(--ts-muted,#5e5a52)}
.ts-sc-block{display:grid;gap:8px;opacity:.35;transition:opacity var(--ts-motion-dur-md,320ms) var(--ts-motion-ease-standard,ease)}
.ts-sc-block[data-on]{opacity:1}
.ts-sc-h{font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-sc-sources{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.ts-sc-sources li{display:inline-flex;align-items:center;gap:8px;padding:4px 10px 4px 4px;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-pill,999px);background:var(--ts-page,#f0ede4);font-size:13px;opacity:0;transform:translateY(6px) scale(.97);transition:opacity var(--ts-motion-dur-sm,200ms),transform var(--ts-motion-spring-settle-duration,790ms) var(--ts-motion-spring-settle,ease-out)}
.ts-sc-sources li[data-on]{opacity:1;transform:none}
.ts-sc-sources time{font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-muted,#5e5a52);white-space:nowrap}
.ts-sc-steps{display:grid;gap:6px;margin:0;padding:0;list-style:none}
.ts-sc-steps li{display:flex;gap:8px;align-items:flex-start;font-size:14px;line-height:1.45;color:var(--ts-muted,#5e5a52);transition:color var(--ts-motion-dur-sm,200ms)}
.ts-sc-steps li .cv-icon{flex:none;margin-top:2px;transition:transform var(--ts-motion-spring-settle-duration,790ms) var(--ts-motion-spring-settle,ease-out)}
.ts-sc-steps li[data-done]{color:var(--ts-fg,#080808)}
.ts-sc-steps li[data-done] .cv-icon{color:var(--ts-status-done-fg,#3f5e41);transform:scale(1.08)}
.ts-sc-text{display:flex;gap:8px;margin:0;font-size:15px;line-height:1.6;opacity:0;transform:translateY(6px);transition:opacity var(--ts-motion-dur-md,320ms),transform var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out)}
.ts-sc-text .cv-icon{flex:none;margin-top:4px;color:var(--ts-accent-fg,#1b5cff)}
.ts-sc-text[data-on]{opacity:1;transform:none}
.ts-sc-guard{justify-self:start;padding:6px 10px;border-radius:var(--ts-radius-pill,999px);font-size:13px;font-weight:500;background:var(--ts-status-idle-bg,#efebe1);color:var(--ts-status-idle-fg,#45433f);box-shadow:inset 0 0 0 1px var(--ts-status-idle-border,#d8d3c6);opacity:0;transform:scale(.96);transition:opacity var(--ts-motion-dur-sm,200ms),transform var(--ts-motion-spring-settle-duration,790ms) var(--ts-motion-spring-settle,ease-out),background var(--ts-motion-dur-md,320ms),color var(--ts-motion-dur-md,320ms)}
.ts-sc-guard[data-on]{opacity:1;transform:none}
.ts-sc-guard.is-human:not([data-ok]){background:var(--ts-status-needs-you-bg,#fdebd6);color:var(--ts-status-needs-you-fg,#a33e0b);box-shadow:inset 0 0 0 1px var(--ts-status-needs-you-border,#f2c597)}
.ts-sc-guard[data-ok]{background:var(--ts-status-done-bg,#e3eadf);color:var(--ts-status-done-fg,#3f5e41);box-shadow:inset 0 0 0 1px var(--ts-status-done-border,#bfd2bb)}
.ts-sc-fiction{margin:0;font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-faint,#8f8a80)}
@media (max-width:720px){.ts-sc{grid-template-columns:minmax(0,1fr);gap:var(--ts-space-4,16px)}.ts-sc-more{display:inline-flex}.ts-sc-list:not([data-open]) li:not(:has(.ts-sc-q[aria-pressed=true])){display:none}.ts-sc-answer{padding:var(--ts-space-4,16px)}}
@media (prefers-reduced-motion:reduce){.ts-sc *{transition:none!important}}
`;
