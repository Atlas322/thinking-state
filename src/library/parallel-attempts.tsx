"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type Attempt = {
  id: string;
  name: string;
  approach: string;
  model?: string;
  icon?: React.ReactNode;
  status: "running" | "done" | "failed";
  progress?: number;
  step?: string;
  score?: number;
  note?: string;
  took?: string;
  cost?: number;
};

export type ParallelAttemptsProps = {
  attempts?: Attempt[];
  task?: string;
  picked?: string | null;
  onPick?: (attempt: Attempt) => void;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
};

const icons = {
  claude: (
    <svg viewBox="0 0 16 16"><g stroke="#d97757" strokeWidth="1.5" strokeLinecap="round"><path d="M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2" /></g></svg>
  ),
  openai: (
    <svg viewBox="0 0 16 16"><g fill="none" stroke="currentColor" strokeWidth="1.1"><path d="M8 2.2a3 3 0 0 1 5 2.9 3 3 0 0 1-.6 5 3 3 0 0 1-4.4 3.7 3 3 0 0 1-5-2.9 3 3 0 0 1 .6-5A3 3 0 0 1 8 2.2Z" /><path d="M6 4.5v5L8 10.7l2-1.2V6.5L8 5.3 6 6.5" /></g></svg>
  ),
  gemini: <svg viewBox="0 0 16 16"><path d="M8 1c.5 3.6 3.4 6.5 7 7-3.6.5-6.5 3.4-7 7-.5-3.6-3.4-6.5-7-7 3.6-.5 6.5-3.4 7-7Z" fill="#3b82f6" /></svg>,
};

const finalAttempts: Attempt[] = [
  { id: "opus", name: "Opus 5.5", approach: "Add a retry with backoff", icon: icons.claude, status: "done", progress: 1, score: 78, note: "20/20 runs green · adds 1.4s per test", took: "2m 36s", cost: 0.31 },
  { id: "gpt", name: "GPT-6 Sol", approach: "Mock the payment API", icon: icons.openai, status: "done", progress: 1, score: 94, note: "20/20 runs green · suite 30% faster", took: "2m 06s", cost: 0.27 },
  { id: "gemini", name: "Gemini 3.8 Pro", approach: "Wait for the network to settle", icon: icons.gemini, status: "failed", progress: 0.62, note: "Still flaky – 3 of 20 runs failed", took: "1m 44s", cost: 0.18 },
];
const demoSteps = ["Reading the test", "Running the suite", "Scoring 20 runs"];
const demoSpeed = [1, 0.82, 0.68];

export function ParallelAttempts({
  attempts: attemptsProp,
  task = "Fix the flaky checkout test",
  picked: pickedProp,
  onPick,
  formatCost = (n) => `$${n.toFixed(2)}`,
  title,
  className = "",
}: ParallelAttemptsProps) {
  // Uncontrolled demo: the three attempts race, then settle.
  const [t, setT] = React.useState(attemptsProp ? 1.6 : 0);
  React.useEffect(() => {
    if (attemptsProp) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setT(1.6);
    const start = performance.now();
    const id = window.setInterval(() => {
      const v = Math.min(1.6, (performance.now() - start) / 1500);
      setT(v);
      if (v >= 1.6) window.clearInterval(id);
    }, 50);
    return () => window.clearInterval(id);
  }, [attemptsProp]);

  const attempts: Attempt[] =
    attemptsProp ??
    finalAttempts.map((a, i) => {
      const p = Math.min(1, t * demoSpeed[i]);
      const end = a.status === "failed" ? a.progress! : 1;
      if (p < end) return { ...a, status: "running", progress: p, step: demoSteps[Math.min(2, Math.floor(p * 3))], score: undefined };
      return a;
    });

  const finished = attempts.filter((a) => a.status !== "running");
  const best = attempts
    .filter((a) => a.status === "done" && a.score != null)
    .reduce<Attempt | null>((b, a) => (!b || a.score! > b.score! ? a : b), null);
  const [ownPick, setOwnPick] = React.useState<string | null>(null);
  const picked = pickedProp !== undefined ? pickedProp : ownPick ?? best?.id ?? null;
  const total = attempts.reduce((s, a) => s + (a.cost ?? 0), 0);
  const heading = title ?? `Best of ${attempts.length}`;

  return (
    <section className={`pa ${className}`}>
      <style>{css}</style>
      <header className="pa-head">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4h8M2.5 8h11M2.5 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        <strong>{heading}</strong>
        <span className="pa-task">{task}</span>
        <span className="pa-count">
          {finished.length} <span>of {attempts.length} done</span>
        </span>
        <span className="pa-total">{formatCost(total)}</span>
      </header>
      <div className="pa-rows" role="radiogroup" aria-label={heading}>
        {attempts.map((a, i) => {
          const isPicked = picked === a.id;
          const dim = picked != null && !isPicked && a.status !== "running";
          return (
            <div
              key={a.id}
              className={`pa-row pa-${a.status} ${isPicked ? "pa-picked" : ""} ${dim ? "pa-dim" : ""}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="pa-ico">{a.icon ?? a.name[0]}</span>
              <div className="pa-who">
                <div className="pa-line1">
                  <span className="pa-name">{a.name}</span>
                  <span className="pa-sep">·</span>
                  <span className="pa-appr">{a.approach}</span>
                </div>
                <div className="pa-note">
                  {a.status === "running" ? <span className="pa-faint">{a.model ?? "Working…"}</span> : a.note}
                </div>
              </div>
              <div className="pa-bar" aria-hidden="true">
                <span style={{ width: `${Math.round((a.progress ?? (a.status === "running" ? 0 : 1)) * 100)}%` }} />
              </div>
              <div className="pa-side">
                <div className="pa-top">
                  {a.status === "running" ? (
                    <span className="pa-step">{a.step ?? `${Math.round((a.progress ?? 0) * 100)}%`}</span>
                  ) : a.status === "failed" ? (
                    <span className="pa-fail">Failed</span>
                  ) : (
                    <>
                      {best?.id === a.id && <span className="pa-best">Best</span>}
                      <span className="pa-score">{a.score}</span>
                    </>
                  )}
                </div>
                <div className="pa-bottom">
                  {isPicked ? (
                    <span className="pa-inuse" role="radio" aria-checked="true" aria-label={`${a.name}, score ${a.score ?? "–"}`}>
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                      In use
                    </span>
                  ) : (
                    <>
                      <span className="pa-meta">
                        {a.status !== "running" && a.took}
                        {a.status !== "running" && a.cost != null && ` · ${formatCost(a.cost)}`}
                      </span>
                      {a.status === "done" && (
                        <button
                          type="button"
                          className="pa-use"
                          role="radio"
                          aria-checked="false"
                          aria-label={`Use ${a.name}, score ${a.score ?? "–"}`}
                          onClick={() => {
                            if (pickedProp === undefined) setOwnPick(a.id);
                            onPick?.(a);
                          }}
                        >
                          Use this one
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const css = `
.pa{--pa-bg:#fff;--pa-fg:#18181b;--pa-muted:#71717a;--pa-faint:#a1a1aa;--pa-line:#ececef;--pa-track:#f1f1f3;--pa-ok:#15803d;--pa-okbar:#7fc497;--pa-okwash:#f3fbf5;--pa-okline:#9fd3b0;--pa-bad:#ef4444;--pa-badbar:#f5c4c4;--pa-run:#3b82f6;container-type:inline-size;width:100%;max-width:720px;color:var(--pa-fg);font:400 13px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .pa{--pa-bg:#1b1b1e;--pa-fg:#ececef;--pa-muted:#a1a1aa;--pa-faint:#71717a;--pa-line:#2e2e33;--pa-track:#2a2a2f;--pa-ok:#4ade80;--pa-okbar:#2f8a52;--pa-okwash:#16261c;--pa-okline:#24563a;--pa-bad:#f87171;--pa-badbar:#6b2c2c;--pa-run:#60a5fa;color-scheme:dark}
.pa *{box-sizing:border-box}.pa button{font:inherit;cursor:pointer}
.pa-head{display:flex;align-items:center;gap:8px;padding:0 2px 16px}
.pa-head svg{width:14px;height:14px;color:var(--pa-run);flex:none}
.pa-head strong{font-size:14px;font-weight:500}
.pa-task{flex:1;min-width:0;font-size:14px;color:var(--pa-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pa-count{font-variant-numeric:tabular-nums}.pa-count span{color:var(--pa-muted)}
.pa-total{margin-left:6px;font-weight:500;font-variant-numeric:tabular-nums}
.pa-rows{display:grid;gap:8px}
.pa-row{display:grid;grid-template-columns:30px minmax(0,1fr) minmax(0,.85fr) 120px;align-items:center;gap:12px;height:62px;padding:0 16px 0 10px;border:1px solid var(--pa-line);border-radius:8px;background:var(--pa-bg);transition:opacity .25s,background .25s,border-color .25s;animation:pa-in .35s both}
.pa-dim{opacity:.55}.pa-dim:hover,.pa-dim:focus-within{opacity:1}
.pa-picked{border-color:var(--pa-okline);background:var(--pa-okwash);box-shadow:0 0 0 1px color-mix(in srgb,var(--pa-ok) 12%,transparent)}
.pa-ico{display:grid;place-items:center;width:30px;height:30px;border-radius:7px;border:1px solid var(--pa-line);background:var(--pa-bg);font-weight:600;color:var(--pa-fg)}.pa-ico svg{width:15px;height:15px}
.pa-who{min-width:0}
.pa-line1{display:flex;align-items:baseline;gap:6px;white-space:nowrap;min-width:0;font-size:13.5px}
.pa-name{font-weight:500;overflow:hidden;text-overflow:ellipsis;flex:none;max-width:60%}
.pa-sep{color:var(--pa-faint)}
.pa-appr{color:var(--pa-muted);overflow:hidden;text-overflow:ellipsis}
.pa-note{font-size:12.5px;color:var(--pa-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.pa-failed .pa-note{color:var(--pa-bad)}.pa-faint{color:var(--pa-faint)}
.pa-bar{position:relative;height:7px;border-radius:99px;background:var(--pa-track);overflow:hidden}
.pa-bar span{position:absolute;inset:0 auto 0 0;border-radius:inherit;background:var(--pa-okbar);transition:width .2s linear,background .3s}
.pa-running .pa-bar span{background:linear-gradient(90deg,var(--pa-run),color-mix(in srgb,var(--pa-run) 60%,#fff),var(--pa-run)) 0/200% 100%;animation:pa-shine 1.2s linear infinite;box-shadow:0 0 8px var(--pa-run)}
.pa-failed .pa-bar span{background:var(--pa-badbar)}
.pa-side{text-align:right;font-variant-numeric:tabular-nums}
.pa-top{display:flex;justify-content:flex-end;align-items:center;gap:8px;height:20px}
.pa-score{font-size:14px;font-weight:500}
.pa-best{padding:0 5px;border-radius:4px;background:color-mix(in srgb,var(--pa-ok) 14%,transparent);color:var(--pa-ok);font-size:11px;line-height:17px}
.pa-fail{color:var(--pa-bad);font-size:13.5px}
.pa-step{color:var(--pa-run);font-size:12.5px;white-space:nowrap}
.pa-bottom{position:relative;height:18px;display:flex;justify-content:flex-end;align-items:center}
.pa-meta{font-size:12.5px;color:var(--pa-faint);white-space:nowrap;transition:opacity .15s}
.pa-inuse{display:inline-flex;align-items:center;gap:4px;color:var(--pa-ok);font-size:12.5px}.pa-inuse svg{width:12px;height:12px}
.pa-use{position:absolute;right:-6px;top:-2px;padding:1px 7px;border:1px solid var(--pa-line);border-radius:6px;background:var(--pa-bg);color:var(--pa-fg);font-size:12px!important;opacity:0;transition:opacity .15s}
.pa-row:hover .pa-use,.pa-use:focus-visible{opacity:1}.pa-row:hover .pa-use~*,.pa-row:hover .pa-meta{opacity:0}
.pa :focus-visible{outline:2px solid var(--pa-run);outline-offset:2px}
@keyframes pa-in{from{opacity:0;transform:translateY(4px)}}
@keyframes pa-shine{to{background-position:-200% 0}}
@container (max-width:560px){.pa-row{grid-template-columns:30px minmax(0,1fr) 92px;grid-template-rows:auto auto;height:auto;padding:10px 12px 10px 10px;row-gap:8px}.pa-sep,.pa-appr{display:none}.pa-bar{grid-column:2/4;grid-row:2}.pa-ico{grid-row:1/3}}
@media(pointer:coarse){.pa-use{opacity:1;position:static}.pa-row .pa-meta{display:none}}
@media(prefers-reduced-motion:reduce){.pa *{animation:none!important;transition:none!important}}
`;

export default ParallelAttempts;
