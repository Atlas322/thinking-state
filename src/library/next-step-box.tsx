"use client";

import * as React from "react";

/**
 * Next-step box — the box an agent leaves at the end of a turn: a two- or
 * three-sentence recap of what is now true, and, when the next move is the
 * person's call, one short question with one or two answer buttons (the first
 * is the agent's pick, drawn as primary). `blocked` marks that the work waits
 * on the answer. Thinking State original; a visible chain-of-thought action.
 *
 * Scenario (demo, no props): wrapping up → recap → question → answered.
 * All motion is off under prefers-reduced-motion.
 */

export type NextStepAction = {
  id: string;
  label: string;
  /** "app" = an app action (commit, create PR …); "reply" = sends the label as the answer. */
  kind?: "app" | "reply";
};

export type NextStepState = "wrapping" | "ready" | "answered";

export type NextStepBoxLabels = {
  title: string;
  wrapping: string;
  blocked: string;
  waiting: string;
  answered: string;
  undo: string;
};

export type NextStepBoxProps = {
  recap?: string;
  ask?: string;
  actions?: NextStepAction[];
  blocked?: boolean;
  /** Controlled state. With no recap and no state the demo scenario plays. */
  state?: NextStepState;
  /** Id of the chosen action when answered. */
  chosen?: string;
  onAction?: (action: NextStepAction) => void;
  labels?: Partial<NextStepBoxLabels>;
  className?: string;
};

const defaultLabels: NextStepBoxLabels = {
  title: "Дараагийн алхам",
  wrapping: "Ажлаа дүгнэж байна…",
  blocked: "Таны хариуг хүлээж байна",
  waiting: "Хариу шаардлагагүй",
  answered: "Хариулсан",
  undo: "Буцаах",
};

export const nextStepBoxDemo = {
  recap:
    "Дөрвөн шинэ чатын компонент catalog-д нэмэгдэж, тест ба tsc давлаа. PR нээгдсэн, merge хийгээгүй. Харанхуй горимыг апп дотор нүдээр шалгаагүй.",
  ask: "PR-ыг шалгуулахаар илгээх үү?",
  actions: [
    { id: "review", label: "Шалгуулах", kind: "app" },
    { id: "later", label: "Дараа", kind: "reply" },
  ] as NextStepAction[],
  blocked: true,
};

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function NextStepBox({
  recap: recapProp,
  ask = nextStepBoxDemo.ask,
  actions = nextStepBoxDemo.actions,
  blocked = nextStepBoxDemo.blocked,
  state: stateProp,
  chosen: chosenProp,
  onAction,
  labels: labelsProp,
  className = "",
}: NextStepBoxProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const recap = recapProp ?? nextStepBoxDemo.recap;
  const demo = recapProp === undefined && stateProp === undefined;
  const [own, setOwn] = React.useState<NextStepState>(stateProp ?? "ready");
  const [ownChosen, setOwnChosen] = React.useState<string | undefined>(chosenProp);
  const state = stateProp ?? own;
  const chosen = chosenProp ?? ownChosen;
  const uid = React.useId();

  // Demo scenario: only when nothing is controlled.
  React.useEffect(() => {
    if (!demo || reducedMotion()) return;
    const timers: number[] = [];
    setOwn("wrapping");
    timers.push(window.setTimeout(() => setOwn("ready"), 1400));
    timers.push(window.setTimeout(() => { setOwnChosen(actions[0]?.id); setOwn("answered"); }, 5200));
    timers.push(window.setTimeout(() => { setOwnChosen(undefined); setOwn("ready"); }, 8200));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [demo, actions]);

  const pick = (a: NextStepAction) => {
    setOwnChosen(a.id);
    setOwn("answered");
    onAction?.(a);
  };
  const picked = actions.find((a) => a.id === chosen);
  const hasAsk = !!ask && actions.length > 0;

  return (
    <section
      className={`nsb is-${state}${blocked && hasAsk && state !== "answered" ? " is-blocked" : ""} ${className}`}
      data-cw-root="next-step-box"
      aria-labelledby={`${uid}-t`}
      aria-busy={state === "wrapping"}
    >
      <style>{css}</style>
      <header className="nsb-head">
        <span className="nsb-dot" aria-hidden="true" />
        <h3 id={`${uid}-t`} className="nsb-title">{L.title}</h3>
        {hasAsk && state !== "wrapping" && (
          <span className="nsb-tag">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d={state === "answered" ? "M3.5 8.5l3 3 6-7" : "M8 4.5v4l2.5 1.5"} /><circle cx="8" cy="8" r="6.5" opacity={state === "answered" ? 0 : 1} /></svg>
            {state === "answered" ? L.answered : blocked ? L.blocked : L.waiting}
          </span>
        )}
      </header>
      {state === "wrapping" ? (
        <div className="nsb-skel" role="status">
          <span className="nsb-sr">{L.wrapping}</span>
          <i /><i /><i />
        </div>
      ) : (
        <>
          <p className="nsb-recap">{recap}</p>
          {hasAsk && (
            <div className="nsb-ask" data-cw-item="">
              <p className="nsb-q">{ask}</p>
              {state === "answered" && picked ? (
                <p className="nsb-chosen" role="status">
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
                  {picked.label}
                </p>
              ) : (
                <div className="nsb-actions">
                  {actions.slice(0, 2).map((a, i) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`nsb-btn${i === 0 ? " is-primary" : ""}`}
                      onClick={() => pick(a)}
                      data-cw-choose={a.label}
                      data-cw-prompt={a.label}
                    >
                      {a.kind === "app" && (
                        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8h8M9 5l3 3-3 3" /></svg>
                      )}
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

const css = `
.nsb{--nsb-bg:var(--ts-surface,#fff);--nsb-fg:var(--ts-fg,#18181b);--nsb-muted:var(--ts-muted,#65656d);--nsb-line:var(--ts-line,#ececef);--nsb-soft:var(--ts-soft,#f4f4f5);--nsb-accent:var(--ts-accent,#1b5cff);--nsb-accent-soft:var(--ts-accent-soft,#e8f1fe);--nsb-amber:var(--ts-amber,#c2620a);--nsb-amber-soft:var(--ts-amber-soft,#fff4e0);--nsb-green:var(--ts-green,#16a34a);--nsb-green-soft:var(--ts-green-soft,#e9f8ee);width:100%;max-width:560px;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--nsb-line);border-radius:14px;background:var(--nsb-bg);color:var(--nsb-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);animation:nsb-in .35s ease both}
:where(.dark,[data-theme=dark]) .nsb{--nsb-bg:var(--ts-surface,#1b1b1e);--nsb-fg:var(--ts-fg,#ececef);--nsb-muted:var(--ts-muted,#a1a1aa);--nsb-line:var(--ts-line,#2e2e33);--nsb-soft:var(--ts-soft,#26262a);--nsb-accent:var(--ts-accent,#7c9cff);--nsb-accent-soft:var(--ts-accent-soft,#1b2a44);--nsb-amber:var(--ts-amber,#eba659);--nsb-amber-soft:var(--ts-amber-soft,#3a2a12);--nsb-green:var(--ts-green,#4ade80);--nsb-green-soft:var(--ts-green-soft,#16301f);color-scheme:dark}
.nsb.is-blocked{border-color:color-mix(in srgb,var(--nsb-amber) 45%,var(--nsb-line))}
.nsb svg{width:14px;height:14px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.nsb-head{display:flex;align-items:center;gap:8px;min-height:24px}
.nsb-dot{width:8px;height:8px;border-radius:50%;background:var(--nsb-green);flex:none}
.nsb.is-wrapping .nsb-dot{background:var(--nsb-accent);animation:nsb-pulse 1.1s ease-in-out infinite}
.nsb.is-blocked .nsb-dot{background:var(--nsb-amber)}
.nsb-title{margin:0;font-size:13px;font-weight:600;color:var(--nsb-muted);letter-spacing:.01em}
.nsb-tag{margin-left:auto;display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;font-size:12px;background:var(--nsb-soft);color:var(--nsb-muted)}
.nsb.is-blocked .nsb-tag{background:var(--nsb-amber-soft);color:var(--nsb-amber)}
.nsb.is-answered .nsb-tag{background:var(--nsb-green-soft);color:var(--nsb-green)}
.nsb-recap{margin:0;animation:nsb-in .4s ease both}
.nsb-ask{display:flex;flex-direction:column;gap:10px;padding-top:10px;border-top:1px solid var(--nsb-line);animation:nsb-in .4s .15s ease both}
.nsb-q{margin:0;font-weight:600}
.nsb-actions{display:flex;flex-wrap:wrap;gap:8px}
.nsb-btn{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 14px;border-radius:10px;border:1px solid var(--nsb-line);background:var(--nsb-bg);color:var(--nsb-fg);font:inherit;font-weight:500;cursor:pointer;transition:background .15s,border-color .15s}
.nsb-btn:hover{background:var(--nsb-soft)}
.nsb-btn.is-primary{background:var(--nsb-accent);border-color:var(--nsb-accent);color:#fff}
.nsb-btn.is-primary:hover{background:color-mix(in srgb,var(--nsb-accent) 88%,#000)}
.nsb-btn:focus-visible{outline:2px solid var(--nsb-accent);outline-offset:2px}
.nsb-chosen{margin:0;display:inline-flex;align-items:center;gap:6px;color:var(--nsb-green);font-weight:500}
.nsb-skel{display:flex;flex-direction:column;gap:7px}
.nsb-skel i{display:block;height:10px;border-radius:5px;background:var(--nsb-soft);animation:nsb-pulse 1.2s ease-in-out infinite}
.nsb-skel i:nth-child(3){width:92%}.nsb-skel i:nth-child(4){width:60%}
.nsb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@keyframes nsb-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes nsb-pulse{50%{opacity:.45}}
@media(prefers-reduced-motion:reduce){.nsb,.nsb *{animation:none!important;transition:none!important}}
`;

export default NextStepBox;
