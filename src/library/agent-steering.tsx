"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type SteerNote = { id: string; text: string; picked?: "next" | "now" };
export type SteerStep = {
  id: string;
  title: React.ReactNode;
  status?: "done" | "active" | "pending";
  /** Seconds, or a preformatted label. */
  duration?: number | string;
  startedAt?: number | Date;
  notes?: SteerNote[];
};

export type AgentSteeringProps = {
  title?: string;
  agent?: string;
  steps?: SteerStep[];
  queue?: SteerNote[];
  status?: "running" | "paused" | "done";
  startedAt?: number | Date;
  onQueue?: (text: string) => void;
  onInterrupt?: (text: string, queuedId?: string) => void;
  onRemove?: (id: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  draft?: string;
  onDraftChange?: (text: string) => void;
  placeholder?: string;
  className?: string;
};

const defaultSteps: SteerStep[] = [
  { id: "s1", title: "Read schema and 14 migrations", status: "done", duration: 1.4 },
  { id: "s2", title: "Plan the split into accounts and profiles", status: "done", duration: 4.6 },
  {
    id: "s3",
    title: (
      <>
        Write migration 0042 for <span className="as-dim">Postgres 16</span>
      </>
    ),
    status: "active",
    duration: 2.0,
    notes: [
      { id: "n1", text: "Use Postgres 16 syntax – prod isn't on 17 yet", picked: "next" },
      { id: "n2", text: "Keep the old users view for a week", picked: "now" },
    ],
  },
  { id: "s4", title: "Dry run on staging", status: "pending" },
  { id: "s5", title: "Open a pull request for review", status: "pending" },
];

const fmtClock = (s: number) => `${Math.floor(s / 60)}m ${String(Math.floor(s % 60)).padStart(2, "0")}s`;
const fmtDur = (d?: number | string) => (d == null ? "" : typeof d === "string" ? d : `${d.toFixed(1)}s`);

const Check = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="7" fill="currentColor" />
    <path d="m5 8.2 2 2 4-4.2" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Spin = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="as-spin">
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="1.6" />
    <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const Pending = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2.2" />
  </svg>
);
const Hook = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 3v5a2 2 0 0 0 2 2h6m-2.5-2.5L12 10l-2.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Enter = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M12.5 4v3.5a1.5 1.5 0 0 1-1.5 1.5H4m2.5-2.5L4 9l2.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function AgentSteering({
  title = "Migrate users table",
  agent = "Opus 5.5",
  steps: stepsProp,
  queue: queueProp,
  status: statusProp = "running",
  startedAt,
  onQueue,
  onInterrupt,
  onRemove,
  onPause,
  onResume,
  draft: draftProp,
  onDraftChange,
  placeholder = "Steer the agent…",
  className = "",
}: AgentSteeringProps) {
  const [ownSteps, setOwnSteps] = React.useState<SteerStep[]>(defaultSteps);
  const [ownQueue, setOwnQueue] = React.useState<SteerNote[]>([]);
  const [ownStatus, setOwnStatus] = React.useState(statusProp);
  const [ownDraft, setOwnDraft] = React.useState("");
  const [announce, setAnnounce] = React.useState("");
  const [fresh, setFresh] = React.useState<string | null>(null);
  const steps = stepsProp ?? ownSteps;
  const queue = queueProp ?? ownQueue;
  const status = statusProp !== "running" ? statusProp : ownStatus;
  const draft = draftProp ?? ownDraft;
  const setDraft = (t: string) => {
    if (draftProp === undefined) setOwnDraft(t);
    onDraftChange?.(t);
  };

  const t0 = React.useMemo(
    () => (startedAt ? new Date(startedAt).getTime() : Date.now() - 136_000),
    [startedAt],
  );
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const activeIdx = steps.findIndex((s) => s.status === "active");
  const stepNo = activeIdx >= 0 ? activeIdx + 1 : steps.filter((s) => s.status === "done").length;

  // Demo behaviour when uncontrolled: the agent picks a queued note up after a moment.
  React.useEffect(() => {
    if (queueProp || stepsProp || !ownQueue.length || status !== "running") return;
    const note = ownQueue[0];
    const id = window.setTimeout(() => pick(note, "next"), 2200);
    return () => window.clearTimeout(id);
  });

  function pick(note: SteerNote, how: "next" | "now") {
    setOwnQueue((q) => q.filter((n) => n.id !== note.id));
    setOwnSteps((ss) =>
      ss.map((s) => (s.status === "active" ? { ...s, notes: [...(s.notes ?? []), { ...note, picked: how }] } : s)),
    );
    setFresh(note.id);
    setAnnounce(`${agent} picked up: ${note.text}`);
  }

  const submit = (interrupt: boolean) => {
    const text = draft.trim();
    if (!text) return;
    const note = { id: `q${Date.now()}`, text };
    if (interrupt) {
      onInterrupt?.(text);
      if (!stepsProp) pick(note, "now");
    } else {
      onQueue?.(text);
      if (!queueProp) setOwnQueue((q) => [...q, note]);
      setAnnounce(`Queued for the next step: ${text}`);
    }
    setDraft("");
  };

  const paused = status === "paused";
  const done = status === "done";

  return (
    <section className={`as ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="as-head">
        <svg className="as-spark" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 1.5 9.3 6.7 14.5 8 9.3 9.3 8 14.5 6.7 9.3 1.5 8 6.7 6.7Z" fill="currentColor" />
        </svg>
        <div className="as-ttl">
          <strong>{title}</strong>
          <span>
            {agent}
            <i>·</i>Step {stepNo} of {steps.length}
          </span>
        </div>
        <span className={`as-state as-${status}`}>
          <b />
          {done ? "Done" : paused ? "Paused" : "Running"} · {fmtClock(Math.max(0, (now - t0) / 1000))}
        </span>
        {!done && (
          <button
            type="button"
            className="as-pause"
            aria-label={paused ? "Resume" : "Pause"}
            onClick={() => {
              if (paused) {
                setOwnStatus("running");
                onResume?.();
              } else {
                setOwnStatus("paused");
                onPause?.();
              }
            }}
          >
            {paused ? (
              <svg viewBox="0 0 16 16"><path d="M5 3.5v9l7.5-4.5Z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 16 16"><rect x="4.5" y="4" width="2.2" height="8" rx=".6" fill="currentColor" /><rect x="9.3" y="4" width="2.2" height="8" rx=".6" fill="currentColor" /></svg>
            )}
          </button>
        )}
      </header>

      <ol className="as-plan" aria-label="Plan">
        {steps.map((s, i) => {
          const st = s.status ?? "pending";
          return (
            <li key={s.id} className={`as-step as-${st}`} aria-current={st === "active" ? "step" : undefined}>
              <span className="as-ico">{st === "done" ? <Check /> : st === "active" ? <Spin /> : <Pending />}</span>
              {i < steps.length - 1 && <span className="as-rail" />}
              <div className="as-main">
                <div className="as-row">
                  <span className={`as-title ${st === "active" && !paused ? "as-shimmer" : ""}`}>{s.title}</span>
                  <span className="as-dur">{fmtDur(s.duration)}</span>
                </div>
                {s.notes?.map((n) => (
                  <div key={n.id} className={`as-note ${fresh === n.id ? "as-landed" : ""}`}>
                    <Hook />
                    <span className="as-note-t">{n.text}</span>
                    <span className="as-picked">
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                      {n.picked === "now" ? "Interrupted" : "Picked up"}
                    </span>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ol>

      {!done && (
        <footer className="as-foot">
          {queue.length > 0 && (
            <ul className="as-queue" aria-label="Queued notes">
              {queue.map((n) => (
                <li key={n.id}>
                  <span className="as-qdot" />
                  <span className="as-note-t">{n.text}</span>
                  <button
                    type="button"
                    className="as-now"
                    onClick={() => {
                      onInterrupt?.(n.text, n.id);
                      if (!queueProp) pick(n, "now");
                    }}
                  >
                    Now
                  </button>
                  <button
                    type="button"
                    className="as-x"
                    aria-label={`Remove “${n.text}”`}
                    onClick={() => {
                      onRemove?.(n.id);
                      if (!queueProp) setOwnQueue((q) => q.filter((x) => x.id !== n.id));
                    }}
                  >
                    <svg viewBox="0 0 16 16"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="as-field">
            <textarea
              rows={1}
              value={draft}
              placeholder={placeholder}
              aria-label="Steer the agent"
              aria-describedby="as-hint"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setDraft("");
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(e.metaKey || e.ctrlKey);
                }
              }}
            />
            <button type="button" className="as-send" aria-label="Queue for the next step" disabled={!draft.trim()} onClick={() => submit(false)}>
              <svg viewBox="0 0 16 16"><path d="M8 12.5v-9M4 7.5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <div className="as-hint" id="as-hint">
            <kbd><Enter /></kbd>next step
            <kbd>⌘</kbd><kbd><Enter /></kbd>interrupt now
          </div>
        </footer>
      )}
      <div className="as-sr" aria-live="polite">{announce}</div>
    </section>
  );
}

const css = `
.as{--as-bg:#fff;--as-fg:#18181b;--as-muted:#71717a;--as-faint:#a1a1aa;--as-line:#ececef;--as-soft:#f6f6f7;--as-accent:#3b82f6;width:100%;max-width:460px;background:var(--as-bg);color:var(--as-fg);border:1px solid var(--as-line);border-radius:12px;box-shadow:0 1px 3px #0000000d;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .as{--as-bg:#1b1b1e;--as-fg:#ececef;--as-muted:#a1a1aa;--as-faint:#71717a;--as-line:#2e2e33;--as-soft:#242428;--as-accent:#60a5fa;color-scheme:dark}
.as *{box-sizing:border-box}.as button{font:inherit;color:inherit;cursor:pointer}
.as-head{display:flex;align-items:center;gap:12px;padding:14px 14px 14px 16px;border-bottom:1px solid var(--as-line)}
.as-spark{width:14px;height:14px;color:var(--as-accent);flex:none}
.as-ttl{display:flex;flex-direction:column;min-width:0;flex:1}.as-ttl strong{font-weight:500}
.as-ttl span{font-size:13px;color:var(--as-muted)}.as-ttl i{font-style:normal;margin:0 6px;color:var(--as-faint)}
.as-state{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--as-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.as-state b{width:12px;height:12px;border-radius:50%;background:color-mix(in srgb,var(--as-accent) 20%,transparent);display:grid;place-items:center}
.as-state b::after{content:"";width:6px;height:6px;border-radius:50%;background:var(--as-accent)}
.as-paused b{background:#f59e0b33}.as-paused b::after{background:#f59e0b}.as-done b{background:#22c55e33}.as-done b::after{background:#22c55e}
.as-pause{display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--as-line);border-radius:8px;background:var(--as-bg);color:var(--as-muted);box-shadow:0 1px 2px #0000000a}
.as-pause:hover{color:var(--as-fg)}.as-pause svg{width:14px;height:14px}
.as-plan{list-style:none;margin:0;padding:14px 14px 10px 16px}
.as-step{position:relative;display:flex;gap:12px;padding-bottom:12px}
.as-ico{flex:none;width:16px;height:20px;display:grid;place-items:center;color:var(--as-accent);z-index:1;background:var(--as-bg)}
.as-ico svg{width:15px;height:15px}.as-pending .as-ico{color:var(--as-faint)}
.as-done .as-ico svg{animation:as-pop .3s both}
.as-rail{position:absolute;left:7.5px;top:21px;bottom:1px;width:1px;background:var(--as-line)}
.as-main{flex:1;min-width:0}
.as-row{display:flex;align-items:baseline;gap:10px}
.as-title{flex:1;min-width:0;color:var(--as-muted)}.as-active .as-title{color:var(--as-fg)}.as-pending .as-title{color:var(--as-muted)}
.as-done .as-title{color:var(--as-muted)}
.as-dim{color:var(--as-muted)}
.as-dur{font-size:13px;color:var(--as-faint);font-variant-numeric:tabular-nums}
.as-shimmer{background:linear-gradient(90deg,var(--as-fg) 40%,var(--as-faint) 50%,var(--as-fg) 60%) 0/250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent!important;animation:as-sh 2.4s linear infinite}
.as-shimmer .as-dim{color:transparent}
.as-note{display:flex;align-items:center;gap:8px;margin-top:6px;padding:4px 8px;border:1px solid var(--as-line);border-radius:6px;background:var(--as-soft);font-size:13px}
.as-note>svg{width:13px;height:13px;color:var(--as-muted);flex:none}
.as-note-t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.as-picked{display:inline-flex;align-items:center;gap:4px;color:var(--as-accent);white-space:nowrap}.as-picked svg{width:12px;height:12px}
.as-landed{animation:as-glide .62s cubic-bezier(.2,.8,.2,1) both,as-glow 1.4s .62s both}
.as-foot{padding:12px 14px 12px;border-top:1px solid var(--as-line)}
.as-queue{list-style:none;margin:0 0 8px;padding:0;display:grid;gap:6px}
.as-queue li{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 10px;border:1px dashed var(--as-line);border-radius:8px;font-size:13px;animation:as-in .2s both}
.as-qdot{width:6px;height:6px;border-radius:50%;background:var(--as-faint);flex:none}
.as-now{border:1px solid var(--as-line);background:var(--as-bg);border-radius:6px;padding:1px 8px;font-size:12px!important}
.as-x{display:grid;place-items:center;width:22px;height:22px;border:0;background:none;color:var(--as-muted);border-radius:5px}.as-x svg{width:12px;height:12px}
.as-field{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 12px;border:1px solid var(--as-line);border-radius:8px;background:var(--as-soft)}
.as-field textarea{flex:1;border:0;background:none;resize:none;font:inherit;color:inherit;outline:none;padding:5px 0;line-height:20px}
.as-field textarea::placeholder{color:var(--as-muted)}
.as-send{display:grid;place-items:center;width:30px;height:30px;border:0;border-radius:6px;background:var(--as-fg);color:var(--as-bg)!important}
.as-send:disabled{background:color-mix(in srgb,var(--as-fg) 15%,transparent);color:var(--as-bg)!important;cursor:default}.as-send svg{width:14px;height:14px}
.as-hint{display:flex;align-items:center;gap:5px;margin-top:8px;font-size:13px;color:var(--as-muted)}
.as-hint kbd{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 3px;border:1px solid var(--as-line);border-radius:4px;font:inherit;font-size:11px;color:var(--as-muted)}
.as-hint kbd svg{width:11px;height:11px}.as-hint kbd+kbd{margin-left:-2px}.as-hint kbd:nth-of-type(2){margin-left:12px}
.as-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.as :focus-visible{outline:2px solid var(--as-accent);outline-offset:2px}
.as-spin{animation:as-rot .9s linear infinite}
@keyframes as-rot{to{transform:rotate(360deg)}}
@keyframes as-sh{to{background-position:-150% 0}}
@keyframes as-pop{from{transform:scale(.4);opacity:0}}
@keyframes as-in{from{opacity:0;transform:translateY(4px)}}
@keyframes as-glide{from{opacity:0;transform:translateY(60px)}}
@keyframes as-glow{0%{box-shadow:0 0 0 3px color-mix(in srgb,var(--as-accent) 25%,transparent)}100%{box-shadow:none}}
@media(max-width:380px){.as-head{padding:12px}.as-plan{padding:12px}.as-foot{padding:10px 12px}}
@media(pointer:coarse){.as-pause,.as-send{width:36px;height:36px}.as-x{width:30px;height:30px}}
@media(prefers-reduced-motion:reduce){.as *{animation:none!important;transition:none!important}.as-shimmer{color:var(--as-fg)!important;background:none}}
`;

export default AgentSteering;
