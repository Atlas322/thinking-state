"use client";

import * as React from "react";

/**
 * Decision Inbox · Chat — the compact version of the Decision Inbox for an
 * agent's chat. One card, a count, and one row per open decision: the
 * question, its project and due date, a short context line and the options
 * as buttons (the recommended one is marked). Choosing an option folds the
 * row to «Chosen: …» with an undo, and sends the answer back to the chat.
 * Original Thinking State chat widget. Colours follow tokens/tokens.json.
 * Data comes in as plain JSON props.
 * Motion: rows arrive one after another, a chosen row settles with a check;
 * all of it is off under prefers-reduced-motion.
 */

export type DecisionChatOption = {
  id: string;
  label: string;
  /** Marks the agent's recommendation. */
  recommended?: boolean;
};

export type DecisionChatItem = {
  id: string;
  title: string;
  context?: string;
  project?: string;
  due?: string;
  urgent?: boolean;
  options: DecisionChatOption[];
};

export type DecisionInboxChatData = {
  title?: string;
  decisions?: DecisionChatItem[];
};

export type DecisionInboxChatLabels = {
  title: string;
  open: string;
  allDone: string;
  chosen: string;
  undo: string;
  recommended: string;
  urgent: string;
  due: string;
};

export type DecisionInboxChatProps = DecisionInboxChatData & {
  /** Controlled answers by decision id; defaults to internal state. */
  chosen?: Record<string, string>;
  onDecide?: (decision: DecisionChatItem, option: DecisionChatOption | null) => void;
  labels?: Partial<DecisionInboxChatLabels>;
  className?: string;
};

const defaultLabels: DecisionInboxChatLabels = {
  title: "Decisions",
  open: "open",
  allDone: "All decided. The agent carries on.",
  chosen: "Chosen",
  undo: "Undo",
  recommended: "Recommended",
  urgent: "Today",
  due: "Due",
};

export const decisionInboxChatDemo: DecisionInboxChatData = {
  title: "Decisions for ac.me Box",
  decisions: [
    {
      id: "hero",
      title: "Which hero image leads the winter box page?",
      context: "Both tested well; the doorstep shot reads faster on phones.",
      project: "Winter box launch",
      due: "today",
      urgent: true,
      options: [
        { id: "doorstep", label: "Snowy doorstep", recommended: true },
        { id: "unboxing", label: "Unboxing close-up" },
      ],
    },
    {
      id: "pause",
      title: "Ship the pause flow before launch?",
      context: "One check still fails; the fix is small but needs review.",
      project: "Winter box launch",
      due: "Nov 14",
      options: [
        { id: "now", label: "Ship before launch", recommended: true },
        { id: "later", label: "Right after launch" },
      ],
    },
    {
      id: "darkhan",
      title: "Darkhan deliveries: weekly or every two weeks?",
      context: "Orders there are 18% of the waitlist.",
      project: "Operations",
      due: "Nov 18",
      options: [
        { id: "weekly", label: "Weekly" },
        { id: "biweekly", label: "Every two weeks", recommended: true },
        { id: "ask", label: "Ask customers first" },
      ],
    },
  ],
};

export function DecisionInboxChat({
  title,
  decisions = decisionInboxChatDemo.decisions,
  chosen: chosenProp,
  onDecide,
  labels: labelsProp,
  className = "",
}: DecisionInboxChatProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const list = decisions ?? [];
  const [own, setOwn] = React.useState<Record<string, string>>({});
  const chosen = chosenProp ?? own;
  const left = list.filter((d) => !chosen[d.id]).length;
  const heading = title ?? (decisions === decisionInboxChatDemo.decisions ? decisionInboxChatDemo.title : undefined) ?? L.title;

  const choose = (d: DecisionChatItem, o: DecisionChatOption | null) => {
    setOwn((c) => {
      const next = { ...c };
      if (o) next[d.id] = o.id;
      else delete next[d.id];
      return next;
    });
    onDecide?.(d, o);
  };

  return (
    <section className={`di ${className}`} data-cw-root="decision-inbox-chat" aria-labelledby={`${uid}-h`}>
      <style>{css}</style>
      <header className="di-head">
        <h3 id={`${uid}-h`} className="di-title">
          {heading}
        </h3>
        <span className={`di-left${left ? "" : " is-zero"}`} data-cw-left="">
          <span data-cw-left-n="">{left}</span> {L.open}
        </span>
      </header>
      <p className="di-done" data-cw-all-done="" hidden={left > 0}>
        <span className="di-done-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="m4.5 8.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {L.allDone}
      </p>
      <ul className="di-list">
        {list.map((d, i) => {
          const pick = d.options.find((o) => o.id === chosen[d.id]);
          return (
            <li
              key={d.id}
              className={`di-item${d.urgent ? " is-urgent" : ""}`}
              data-cw-item=""
              data-chosen={pick ? "" : undefined}
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="di-q">
                <span className="di-qtitle">{d.title}</span>
                {(d.project || d.due) && (
                  <span className="di-meta">
                    {d.urgent && <span className="di-urgent">{L.urgent}</span>}
                    {d.project && <span>{d.project}</span>}
                    {d.due && !d.urgent && (
                      <span>
                        {L.due} {d.due}
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="di-open">
                {d.context && <p className="di-ctx">{d.context}</p>}
                <div className="di-opts" role="group" aria-label={d.title}>
                  {d.options.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className={`di-opt${o.recommended ? " is-rec" : ""}`}
                      data-cw-choose={o.label}
                      data-cw-prompt={`${d.title} → ${o.label}`}
                      onClick={() => choose(d, o)}
                    >
                      {o.label}
                      {o.recommended && (
                        <span className="di-rec">
                          <span aria-hidden="true">★</span>
                          <span className="di-sr">, {L.recommended}</span>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="di-picked" role="status">
                <span className="di-check" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="m4.5 8.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="di-picked-text">
                  {L.chosen}: <strong data-cw-chosen-text="">{pick?.label ?? ""}</strong>
                </span>
                <button type="button" className="di-undo" data-cw-undo="" onClick={() => choose(d, null)}>
                  {L.undo}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const css = `
.di{--di-bg:#fff;--di-fg:#18181b;--di-muted:#71717a;--di-faint:#a1a1aa;--di-line:#ececef;--di-soft:#f4f4f5;--di-accent:#4f7cf0;--di-accent-soft:#e8f1fe;--di-green:#16a34a;--di-green-soft:#e9f8ee;--di-amber:#c2620a;--di-amber-soft:#fff4e0;position:relative;width:100%;max-width:560px;color:var(--di-fg);background:var(--di-bg);border:1px solid var(--di-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;container:di/inline-size;box-sizing:border-box;overflow:hidden;animation:di-in .34s cubic-bezier(.2,.8,.3,1) both}
:where(.dark,[data-theme=dark]) .di{--di-bg:#1b1b1e;--di-fg:#ececef;--di-muted:#a1a1aa;--di-faint:#71717a;--di-line:#2e2e33;--di-soft:#26262a;--di-accent:#7c9cff;--di-accent-soft:#1b2a44;--di-green:#4ade80;--di-green-soft:#16301f;--di-amber:#eba659;--di-amber-soft:#3a2a12;color-scheme:dark}
.di *{box-sizing:border-box}:where(.di) button{font:inherit;color:inherit;cursor:pointer}
.di [hidden]{display:none!important}
.di-head{display:flex;align-items:center;gap:10px;padding:11px 12px;border-bottom:1px solid var(--di-line)}
.di-title{flex:1;min-width:0;margin:0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.di-left{flex:none;height:22px;padding:0 8px;border-radius:11px;background:var(--di-amber-soft);color:color-mix(in srgb,var(--di-amber) 82%,var(--di-fg));font-size:12px;font-weight:500;line-height:22px;font-variant-numeric:tabular-nums;transition:background .2s,color .2s}
.di-left.is-zero{background:var(--di-green-soft);color:color-mix(in srgb,var(--di-green) 78%,var(--di-fg))}
.di-done{display:flex;align-items:center;gap:8px;margin:0;padding:10px 12px;border-bottom:1px solid var(--di-line);background:var(--di-green-soft);color:color-mix(in srgb,var(--di-green) 70%,var(--di-fg));font-size:13px;font-weight:500;animation:di-fade .25s ease both}
.di-done-mark,.di-check{display:grid;place-items:center;flex:none;width:18px;height:18px;border-radius:50%;background:var(--di-green);color:#fff}
:where(.dark,[data-theme=dark]) .di-done-mark,:where(.dark,[data-theme=dark]) .di-check{color:#111}
.di-done-mark svg,.di-check svg{width:12px;height:12px}
.di-list{margin:0;padding:0;list-style:none}
.di-item{position:relative;padding:11px 12px 12px;animation:di-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 55ms + 90ms)}
.di-item+.di-item{border-top:1px solid var(--di-line)}
.di-item.is-urgent::before{content:"";position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:0 2px 2px 0;background:var(--di-amber)}
.di-q{display:flex;flex-direction:column;gap:2px}
.di-qtitle{font-weight:500;line-height:1.35}
.di-meta{display:flex;flex-wrap:wrap;align-items:center;gap:0 8px;font-size:12px;color:var(--di-muted)}
.di-meta>span+span::before{content:"·";margin-right:8px;color:var(--di-faint)}
.di-urgent{color:color-mix(in srgb,var(--di-amber) 82%,var(--di-fg));font-weight:500}
.di-ctx{margin:6px 0 0;font-size:13px;color:var(--di-muted)}
.di-opts{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.di-opt{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:5px 11px;border:1px solid var(--di-line);border-radius:8px;background:var(--di-bg);font-size:13px;font-weight:500;text-align:left;transition:background .15s,border-color .15s,transform .12s}
.di-opt:hover{background:var(--di-soft);border-color:color-mix(in srgb,var(--di-line) 50%,var(--di-faint))}
.di-opt:active{transform:scale(.97)}
.di-opt.is-rec{border-color:color-mix(in srgb,var(--di-accent) 45%,var(--di-line));background:var(--di-accent-soft);color:color-mix(in srgb,var(--di-accent) 60%,var(--di-fg))}
.di-opt.is-rec:hover{background:color-mix(in srgb,var(--di-accent-soft) 70%,var(--di-accent) 12%)}
.di-rec{font-size:11px;color:var(--di-accent)}
.di-picked{display:none;align-items:center;gap:8px;margin-top:8px;font-size:13px;color:var(--di-muted)}
.di-picked strong{color:var(--di-fg);font-weight:500}
.di-picked-text{flex:1;min-width:0}
.di-item[data-chosen] .di-open{display:none}
.di-item[data-chosen] .di-picked{display:flex;animation:di-in .26s cubic-bezier(.2,.8,.3,1) both}
.di-item[data-chosen] .di-check{animation:di-pop .3s cubic-bezier(.2,.8,.3,1.5) both}
.di-item[data-chosen] .di-qtitle{color:var(--di-muted)}
.di-item[data-chosen].is-urgent::before{background:var(--di-green)}
.di-undo{flex:none;height:26px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--di-muted);font-size:12.5px;transition:background .15s,color .15s}
.di-undo:hover{background:var(--di-soft);color:var(--di-fg)}
.di-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.di :focus-visible{outline:2px solid var(--di-accent);outline-offset:1px}
@keyframes di-in{from{opacity:0;transform:translateY(6px)}}
@keyframes di-fade{from{opacity:0}}
@keyframes di-pop{from{transform:scale(.3)}}
@container di (max-width:380px){.di-opts{flex-direction:column;align-items:stretch}.di-opt{justify-content:space-between}}
@media(prefers-reduced-motion:reduce){.di *,.di{animation:none!important;transition:none!important}}
`;

export default DecisionInboxChat;
