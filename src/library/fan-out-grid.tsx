"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type FanoutStatus = "queued" | "running" | "retrying" | "done" | "failed";

export type FanoutTask = {
  id: string;
  label: string;
  status: FanoutStatus;
  worker?: string;
  start?: number;
  end?: number;
  cost?: number;
  attempts?: number;
  result?: string;
  error?: string;
};

export type FanoutGridProps = {
  tasks?: FanoutTask[];
  job?: string;
  workers?: number;
  now?: number;
  onRetry?: (ids: string[]) => void;
  onSelect?: (task: FanoutTask | null) => void;
  formatCost?: (amount: number) => string;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
};

const dollars = (n: number) => `$${n.toFixed(2)}`;

const companies = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Vandelay", "Stark", "Wayne", "Wonka", "Soylent", "Cyberdyne", "Tyrell"];

/** Demo job: 240 leads, 14 workers, each task ~1.6s. Deterministic. */
function demoTasks(now: number): FanoutTask[] {
  const out: FanoutTask[] = [];
  const workers = 14;
  const lanes = new Array(workers).fill(0);
  for (let i = 0; i < 240; i++) {
    const r = ((i * 9301 + 49297) % 233280) / 233280;
    const dur = 1100 + r * 1400;
    let lane = 0;
    for (let w = 1; w < workers; w++) if (lanes[w] < lanes[lane]) lane = w;
    const start = lanes[lane];
    const retry = i === 118 || i === 124;
    const fail = i === 61;
    const end = start + dur * (retry ? 2 : 1);
    lanes[lane] = end;
    let status: FanoutStatus = "queued";
    if (now >= end) status = fail ? "failed" : "done";
    else if (now >= start) status = retry && now > start + dur ? "retrying" : "running";
    out.push({
      id: `lead-${i + 1}`,
      label: `${companies[i % companies.length]} lead #${i + 1}`,
      status,
      worker: `worker-${lane + 1}`,
      start,
      end: status === "done" || status === "failed" ? end : undefined,
      cost: status === "done" ? 0.012 + r * 0.004 : status === "failed" ? 0.004 : undefined,
      attempts: retry && now > start + dur ? 2 : 1,
      result: status === "done" ? `${3 + Math.round(r * 5)} fields filled` : undefined,
      error: status === "failed" ? "Domain not found" : undefined,
    });
  }
  return out;
}

const fmtLeft = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return s < 60 ? `~${s}s left` : `~${Math.floor(s / 60)}m ${s % 60}s left`;
};

export function FanoutGrid({
  tasks: tasksIn,
  job = "Enrich 240 leads",
  workers,
  now: nowIn,
  onRetry,
  onSelect,
  formatCost = dollars,
  title = "Fan-out",
  icon,
  className = "",
}: FanoutGridProps) {
  // Self-running demo when no tasks are given.
  const demo = !tasksIn;
  const [clock, setClock] = React.useState(12800);
  const [retried, setRetried] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (!demo) return;
    const id = window.setInterval(() => setClock((c) => (c > 30000 ? 12800 : c + 250)), 250);
    return () => window.clearInterval(id);
  }, [demo]);
  const now = nowIn ?? (demo ? clock : 0);
  const tasks = React.useMemo(() => {
    const list = tasksIn ?? demoTasks(clock);
    return list.map((t) => (retried.includes(t.id) && t.status === "failed" ? { ...t, status: "retrying" as const } : t));
  }, [tasksIn, clock, retried]);

  const [hover, setHover] = React.useState<string | null>(null);
  const [picked, setPicked] = React.useState<string | null>(null);
  const shown = tasks.find((t) => t.id === (hover ?? picked));

  const count = (s: FanoutStatus) => tasks.filter((t) => t.status === s).length;
  const done = count("done");
  const running = count("running");
  const retrying = count("retrying");
  const failed = tasks.filter((t) => t.status === "failed");
  const cost = tasks.reduce((n, t) => n + (t.cost ?? 0), 0);
  const finished = tasks.filter((t) => t.status === "done" && t.start != null && t.end != null);
  const avg = finished.length ? finished.reduce((n, t) => n + (t.end! - t.start!), 0) / finished.length : 0;
  const par = workers ?? Math.max(1, running + retrying);
  const remaining = tasks.length - done - failed.length;
  const left = avg ? (remaining * avg) / par : 0;
  const complete = remaining === 0;

  const pick = (t: FanoutTask) => {
    const next = picked === t.id ? null : t.id;
    setPicked(next);
    onSelect?.(next ? t : null);
  };

  return (
    <section className={`fo ${className}`} aria-label={`${title}: ${job}`}>
      <style>{css}</style>
      <header className="fo-bar">
        <span className="fo-ico">
          {icon ?? (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="3" cy="8" r="1.8" fill="currentColor" />
              <path d="M4.8 8h3.5M8.3 8 11 3.5M8.3 8l2.7 4.5M8.3 8H11" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="12.5" cy="3.5" r="1.4" fill="currentColor" />
              <circle cx="12.5" cy="8" r="1.4" fill="currentColor" />
              <circle cx="12.5" cy="12.5" r="1.4" fill="currentColor" />
            </svg>
          )}
        </span>
        <strong>{title}</strong>
        <span className="fo-job">{job}</span>
        <span className="fo-meta">
          <span>
            <b>{done}</b> / {tasks.length}
          </span>
          <b>{formatCost(cost)}</b>
          <span>{complete ? "Done" : left ? fmtLeft(left) : "Starting…"}</span>
        </span>
      </header>
      <div className="fo-card">
        <div className="fo-grid" role="grid" aria-label="Tasks" onMouseLeave={() => setHover(null)}>
          {tasks.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`fo-cell fo-${t.status} ${picked === t.id ? "on" : ""}`}
              aria-label={`${t.label}: ${t.status}`}
              aria-pressed={picked === t.id}
              onMouseEnter={() => setHover(t.id)}
              onFocus={() => setHover(t.id)}
              onBlur={() => setHover(null)}
              onClick={() => pick(t)}
            />
          ))}
        </div>
        <div className="fo-foot">
          {shown ? (
            <div className="fo-tip">
              <span className={`fo-sw fo-${shown.status}`} />
              <b>{shown.label}</b>
              <span>{shown.status}</span>
              {shown.worker && <span>{shown.worker}</span>}
              {shown.start != null && (
                <span>{(((shown.end ?? now) - shown.start) / 1000).toFixed(1)}s</span>
              )}
              {shown.cost != null && <span>{formatCost(shown.cost)}</span>}
              {(shown.attempts ?? 1) > 1 && <span>attempt {shown.attempts}</span>}
              {shown.result && <span>{shown.result}</span>}
              {shown.error && <span className="fo-err">{shown.error}</span>}
            </div>
          ) : (
            <div className="fo-legend">
              <span><i className="fo-sw fo-done" /><b>{done}</b> done</span>
              <span><i className="fo-sw fo-running" /><b>{running}</b> running</span>
              <span><i className="fo-sw fo-retrying" /><b>{retrying}</b> retrying</span>
              <span><i className="fo-sw fo-failed" /><b>{failed.length}</b> failed</span>
            </div>
          )}
          {failed.length > 0 && (onRetry || demo) && (
            <button
              type="button"
              className="fo-retry"
              onClick={() => {
                const ids = failed.map((t) => t.id);
                if (demo) setRetried((r) => [...r, ...ids]);
                onRetry?.(ids);
              }}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Retry failed
            </button>
          )}
        </div>
      </div>
      <p className="fo-sr" aria-live="polite">
        {done} of {tasks.length} done{failed.length ? `, ${failed.length} failed` : ""}.
      </p>
    </section>
  );
}

const css = `
.fo{--fo-bg:#fff;--fo-fg:#18181b;--fo-muted:#71717a;--fo-faint:#a1a1aa;--fo-line:#ececef;--fo-q:#f4f4f5;--fo-q-b:#ececef;--fo-d:#d3f0db;--fo-d-b:#a9dfb8;--fo-r:#e3eefc;--fo-r-b:#b9d3f6;--fo-y:#fdecc8;--fo-y-b:#f4cf86;--fo-x:#fbd9d9;--fo-x-b:#f0a7a7;--fo-red:#e5484d;--fo-accent:#3b82f6;width:100%;max-width:758px;color:var(--fo-fg);font:400 13.5px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .fo{--fo-bg:#1b1b1e;--fo-fg:#ececef;--fo-muted:#a1a1aa;--fo-faint:#71717a;--fo-line:#2e2e33;--fo-q:#26262b;--fo-q-b:#303036;--fo-d:#183a24;--fo-d-b:#2c6a42;--fo-r:#1a2c47;--fo-r-b:#2f5590;--fo-y:#3d2f10;--fo-y-b:#7a5c1c;--fo-x:#43191b;--fo-x-b:#8a3236;--fo-accent:#6aa3ff;color-scheme:dark}
.fo *{box-sizing:border-box}.fo button{font:inherit;color:inherit;cursor:pointer}
.fo-bar{display:flex;align-items:center;gap:8px;padding:0 0 12px}
.fo-ico{display:grid;place-items:center;width:16px;height:16px;color:var(--fo-accent)}.fo-ico svg{width:16px;height:16px}
.fo-bar strong{font-weight:500;font-size:14px}
.fo-job{flex:1;min-width:0;color:var(--fo-muted);font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fo-meta{display:flex;gap:14px;color:var(--fo-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.fo-meta b{font-weight:500;color:var(--fo-fg)}
.fo-card{background:var(--fo-bg);border:1px solid var(--fo-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;padding:14px 16px 12px}
.fo-grid{display:grid;grid-template-columns:repeat(auto-fill,13px);gap:3.2px;justify-content:space-between}
.fo-cell{width:13px;height:13px;padding:0;border-radius:2.5px;border:1px solid var(--fo-q-b);background:var(--fo-q);transition:background .3s,border-color .3s,transform .12s}
.fo-cell:hover,.fo-cell.on{transform:scale(1.25);position:relative;z-index:1;box-shadow:0 0 0 1.5px var(--fo-fg)}
.fo-done{background:var(--fo-d);border-color:var(--fo-d-b)}
.fo-running{background:var(--fo-r);border-color:var(--fo-r-b);background-image:linear-gradient(110deg,transparent 30%,#ffffffb0 50%,transparent 70%);background-size:250% 100%;animation:fo-shine 1.4s linear infinite}
.fo-retrying{background:var(--fo-y);border-color:var(--fo-y-b)}
.fo-failed{background:var(--fo-x);border-color:var(--fo-x-b)}
.fo-queued{background:var(--fo-q);border-color:var(--fo-q-b)}
.fo-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;min-height:22px;font-size:12.5px;color:var(--fo-muted)}
.fo-legend,.fo-tip{display:flex;flex-wrap:wrap;align-items:center;gap:14px;min-width:0}
.fo-legend span{display:inline-flex;align-items:center;gap:6px}
.fo-legend b,.fo-tip b{font-weight:500;color:var(--fo-fg)}
.fo-tip{gap:10px}.fo-err{color:var(--fo-red)}
.fo-sw{display:inline-block;width:8px;height:8px;border-radius:2px;border:1px solid;animation:none!important;background-image:none!important}
.fo-retry{display:inline-flex;align-items:center;gap:5px;border:0;background:none;padding:2px 0;color:var(--fo-red)!important;font-size:12.5px;white-space:nowrap}
.fo-retry svg{width:13px;height:13px}.fo-retry:hover{text-decoration:underline}
.fo-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.fo :focus-visible{outline:2px solid var(--fo-accent);outline-offset:2px}
@keyframes fo-shine{from{background-position:120% 0}to{background-position:-120% 0}}
@media(max-width:560px){.fo-bar{flex-wrap:wrap}.fo-meta{width:100%;gap:10px}.fo-card{padding:12px}}
@media(prefers-reduced-motion:reduce){.fo *{animation:none!important;transition:none!important}}
`;

export { FanoutGrid as FanOutGrid };
export default FanoutGrid;
