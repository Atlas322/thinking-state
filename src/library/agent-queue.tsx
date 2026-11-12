"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type QueueJobKind = "llm" | "tool" | "agent" | "human";

export type QueueJob = {
  id: string;
  name: string;
  kind: QueueJobKind;
  status: "queued" | "running" | "done" | "failed";
  enqueuedAt: number;
  priority?: "high" | "normal" | "low";
  startedAt?: number;
  endedAt?: number;
  worker?: string;
  /** 0–1 while running. */
  progress?: number;
  /** Expected run time in ms. */
  estimate?: number;
  attempt?: number;
};

/**
 * Queue threshold. A number keeps the classic look (amber count, dashed line
 * on the chart). `true` or `{ at, label }` also shows a needs-you warning in
 * the header once the queue is at or over `at` (default 12). `false` turns
 * the threshold off.
 */
export type QueueBackpressure = number | boolean | { at: number; label?: string };

/** What the chart's horizontal axis means: `time` = queue length over the last seconds (default), `order` = each waiting job's wait, first in line to last. */
export type QueueAxis = "time" | "order";

/** Header counter overrides; a missing key falls back to the computed value. */
export type QueueTotals = { done?: number; failed?: number; queued?: number };

export type QueueWorker = { id: string; name: string; icon?: "claude" | "openai" | "gemini" | React.ReactNode };

export type AgentQueueProps = {
  jobs?: QueueJob[];
  workers?: QueueWorker[];
  now?: number;
  rateLimits?: { from: number; until: number; label?: string }[];
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  onConcurrencyChange?: (workers: number) => void;
  minConcurrency?: number;
  maxConcurrency?: number;
  /** See {@link QueueBackpressure}. Default 12. */
  backpressure?: QueueBackpressure;
  window?: number;
  /** Override the computed done / failed / queued counters. */
  totals?: QueueTotals;
  /** A number: how many waiting jobs to list before a «+N» row (default 3, no «+N» row). An array: recent queue-depth samples, drawn as a small sparkline in the header. */
  depth?: number | number[];
  /** See {@link QueueAxis}. Default `time`. An array gives custom tick labels under the chart. */
  axis?: QueueAxis | string[];
  title?: string;
  name?: string;
  className?: string;
};

/* Neutral worker shapes, no vendor marks. Icon keys kept for API compatibility. */
const Claude = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="8" cy="8" r="5.5" fill="none" stroke="#d97757" strokeWidth="1.6" />
  </svg>
);
const OpenAI = (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2.8" y="2.8" width="10.4" height="10.4" rx="2" />
  </svg>
);
const Gemini = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 2.2 13.8 13H2.2Z" fill="none" stroke="#3b7cf6" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const workerIcon = (i: QueueWorker["icon"]) => (i === "openai" ? OpenAI : i === "gemini" ? Gemini : i === "claude" || !i ? Claude : i);

const kindIcon: Record<QueueJobKind, React.ReactNode> = {
  llm: (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="m4 12 6-6M9 4l.5-1.5L10 4l1.5.5L10 5l-.5 1.5L9 5l-1.5-.5ZM12.5 8.5l.3-.8.3.8.8.3-.8.3-.3.8-.3-.8-.8-.3Z" />
    </svg>
  ),
  tool: (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7" cy="7" r="3.5" />
      <path d="m10 10 3 3" />
    </svg>
  ),
  agent: (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <ellipse cx="8" cy="4.5" rx="4.5" ry="2" />
      <path d="M3.5 4.5v7c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-7M3.5 8c0 1.1 2 2 4.5 2s4.5-.9 4.5-2" />
    </svg>
  ),
  human: (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M3 13.5c.8-2.4 2.7-3.5 5-3.5s4.2 1.1 5 3.5" />
    </svg>
  ),
};

const defaultWorkers: QueueWorker[] = [
  { id: "w1", name: "Бичигч агент", icon: "claude" },
  { id: "w2", name: "Шалгагч агент", icon: "openai" },
  { id: "w3", name: "Судлаач агент", icon: "gemini" },
  { id: "w4", name: "Кодын агент", icon: "claude" },
];

const names: [string, QueueJobKind][] = [
  ["Нэхэмжлэлийн талбар задлах #2215", "llm"],
  ["Баримт хайх: буцаалт", "tool"],
  ["240 баримтыг индексжүүлэх", "agent"],
  ["Тусламжийн имэйл ангилах", "llm"],
  ["Хувилбарын хяналтын шинэ асуудал ангилах", "llm"],
  ["Үнэлгээний тест ажиллуулах", "agent"],
  ["Боломжит харилцагч үнэлэх – Тэнгэр", "llm"],
  ["Хариу ноороглох – Од", "llm"],
  ["#4964 хүсэлтийг товчлох", "llm"],
  ["Харилцагчийн бүртгэл хайх: Хангай", "tool"],
  ["Хязгаараас давсан буцаалт шалгах", "human"],
];

/** Demo depth curve (96 samples, one per second). */
const seedDepth = Array.from({ length: 96 }, (_, i) => {
  const base = 6 + 5 * Math.sin(i / 6) + 3 * Math.sin(i / 2.3);
  const bump = i > 60 && i < 75 ? (i - 60) * 1.2 : i >= 75 && i < 85 ? (85 - i) * 1.6 : 0;
  return Math.max(0, Math.round(base + bump));
});

function useDemo(enabled: boolean, workers: QueueWorker[], concurrency: number, paused: boolean) {
  const seq = React.useRef(0);
  const make = (status: QueueJob["status"], t: number, extra: Partial<QueueJob> = {}): QueueJob => {
    const [n, k] = names[seq.current % names.length];
    seq.current++;
    return { id: `j${seq.current}`, name: n, kind: k, status, enqueuedAt: t, estimate: 4000 + ((seq.current * 1300) % 5000), ...extra };
  };
  const [state, setState] = React.useState(() => {
    const t = Date.now();
    const jobs: QueueJob[] = [];
    for (let i = 0; i < 12; i++) jobs.push(make("queued", t - 6000 + i * 400));
    workers.slice(0, concurrency).forEach((w, i) =>
      jobs.push({ ...make("running", t - 9000), name: names[6 + i][0], kind: "llm", worker: w.id, startedAt: t - 3000, progress: 0.15 + i * 0.12 }),
    );
    return { jobs, done: 137, failed: 3, depth: seedDepth, limitedUntil: t + 3000, t };
  });

  React.useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      setState((s) => {
        const t = Date.now();
        const limited = t < s.limitedUntil;
        let { done, failed } = s;
        let jobs = s.jobs.map((j) => {
          if (j.status !== "running" || limited || paused) return j;
          const p = Math.min(1, (j.progress ?? 0) + 250 / (j.estimate ?? 5000));
          return { ...j, progress: p };
        });
        jobs = jobs.filter((j) => {
          if (j.status === "running" && (j.progress ?? 0) >= 1) {
            if (Math.random() < 0.04) failed++;
            else done++;
            return false;
          }
          return true;
        });
        if (!limited && !paused) {
          const active = workers.slice(0, concurrency);
          for (const w of active) {
            if (!jobs.some((j) => j.status === "running" && j.worker === w.id)) {
              const next = jobs.find((j) => j.status === "queued");
              if (next) jobs = jobs.map((j) => (j === next ? { ...j, status: "running", worker: w.id, startedAt: t, progress: 0 } : j));
            }
          }
        }
        const waitingN = jobs.filter((j) => j.status === "queued").length;
        if (Math.random() < (waitingN > 14 ? 0.03 : 0.1)) jobs = [...jobs, make("queued", t)];
        let limitedUntil = s.limitedUntil;
        if (t - s.limitedUntil > 22000) limitedUntil = t + 6000;
        const tick = t - s.t >= 1000;
        const depth = tick ? [...s.depth.slice(1), jobs.filter((j) => j.status === "queued").length] : s.depth;
        return { jobs, done, failed, depth, limitedUntil, t: tick ? t : s.t };
      });
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, concurrency, paused]);
  return state;
}

export function AgentQueue({
  jobs: jobsProp,
  workers = defaultWorkers,
  now,
  rateLimits,
  paused: pausedProp,
  onPausedChange,
  onConcurrencyChange,
  minConcurrency = 1,
  maxConcurrency = 8,
  backpressure = 12,
  totals,
  depth: depthProp,
  axis = "time",
  title = "Дараалал",
  name = "агентын ажлууд",
  className = "",
}: AgentQueueProps) {
  const [pausedState, setPaused] = React.useState(false);
  const paused = pausedProp ?? pausedState;
  const [concurrency, setConcurrency] = React.useState(Math.min(workers.length, 4));
  const demo = useDemo(jobsProp === undefined, workers, concurrency, paused);
  const [clock, setClock] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => setClock(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  const t = now ?? clock;
  const jobs = jobsProp ?? demo.jobs;
  const queued = jobs.filter((j) => j.status === "queued").sort((a, b) => (a.priority === "high" ? -1 : 0) - (b.priority === "high" ? -1 : 0) || a.enqueuedAt - b.enqueuedAt);
  const running = jobs.filter((j) => j.status === "running");
  const done = totals?.done ?? (jobsProp ? jobs.filter((j) => j.status === "done").length : demo.done);
  const failed = totals?.failed ?? (jobsProp ? jobs.filter((j) => j.status === "failed").length : demo.failed);
  const activeLimit = jobsProp ? rateLimits?.find((r) => t >= r.from && t < r.until) : t < demo.limitedUntil ? { until: demo.limitedUntil, from: 0 } : undefined;
  const limited = !!activeLimit;
  const p95 = Math.max(0, ...queued.map((j) => t - j.enqueuedAt)) / 1000;
  const queuedN = totals?.queued ?? queued.length;
  const depthN = typeof depthProp === "number" ? depthProp : undefined;
  const spark = Array.isArray(depthProp) ? depthProp.filter((v) => Number.isFinite(v)) : [];
  const shown = Math.max(0, depthN ?? 3);
  const bpAt = typeof backpressure === "number" ? backpressure : typeof backpressure === "object" ? backpressure.at : 12;
  const bpOn = backpressure !== false;
  const bpWarn = (backpressure === true || typeof backpressure === "object") && queuedN >= bpAt;
  const bpLabel = (typeof backpressure === "object" && backpressure.label) || "Дараалал дүүрч байна";
  const byOrder = axis === "order";
  const waits = queued.map((j) => Math.max(0, Math.round((t - j.enqueuedAt) / 1000)));
  const depth = byOrder ? (waits.length ? waits : [0]) : jobsProp ? [queued.length] : demo.depth;
  const max = Math.max(24, Math.ceil(Math.max(...depth) / 12) * 12);
  const slots = workers.slice(0, concurrency);

  const W = 700;
  const H = 112;
  const step = depth.length > 1 ? W / (depth.length - 1) : W;
  const pts = depth.map((d, i) => [i * step, H - (d / max) * H] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const area = `${line}L${W} ${H}L0 ${H}Z`;
  const limitBands = jobsProp ? [] : [[16, 26], [52, 70], [88, 96]];

  const setP = (p: boolean) => {
    setPaused(p);
    onPausedChange?.(p);
  };
  const setC = (n: number) => {
    const v = Math.max(minConcurrency, Math.min(maxConcurrency, Math.min(workers.length, n)));
    setConcurrency(v);
    onConcurrencyChange?.(v);
  };

  return (
    <section className={`ui-agqc agq ${className}`}>
      <style>{css}</style>
      <header className="agq-bar">
        <svg className="agq-logo" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <strong>{title}</strong>
        <span className="agq-muted">{name}</span>
        {spark.length > 1 && (() => {
          const hi = Math.max(1, ...spark);
          const d = spark.map((v, i) => `${i ? "L" : "M"}${((i / (spark.length - 1)) * 48).toFixed(1)} ${(14 - (Math.max(0, v) / hi) * 12).toFixed(1)}`).join("");
          return (
            <svg className="agq-spark" viewBox="0 0 48 16" role="img" aria-label={`Дарааллын урт: сүүлд ${spark[spark.length - 1]}, оргил ${Math.max(...spark)}`}>
              <path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          );
        })()}
        {limited && (
          <span className="agq-limit" role="status">
            <i />
            Хурдны хязгаар · {Math.max(0, Math.ceil((activeLimit!.until - t) / 1000))} с
          </span>
        )}
        {paused && !limited && <span className="agq-limit agq-paused-pill">Түр зогссон</span>}
        {bpWarn && (
          <span className="agq-limit agq-bp-warn" role="status">
            <i />
            {bpLabel} · {queuedN}
          </span>
        )}
        <span className="agq-ctl">
          <button type="button" className="agq-pause" aria-pressed={paused} onClick={() => setP(!paused)}>
            {paused ? (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="3" width="3" height="10" rx=".8" fill="none" stroke="currentColor" strokeWidth="1.3" /><rect x="9.5" y="3" width="3" height="10" rx=".8" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
            )}
            {paused ? "Үргэлжлүүлэх" : "Түр зогсоох"}
          </button>
          <span className="agq-step">
            <button type="button" aria-label="Гүйцэтгэгч хасах" onClick={() => setC(concurrency - 1)}>
              <svg viewBox="0 0 16 16"><path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
            <output aria-live="polite">{concurrency}</output>
            <button type="button" aria-label="Гүйцэтгэгч нэмэх" onClick={() => setC(concurrency + 1)}>
              <svg viewBox="0 0 16 16"><path d="M3.5 8h9M8 3.5v9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          </span>
        </span>
      </header>

      <div className="agq-stats">
        <div className={bpOn && queuedN > bpAt ? "is-warn" : ""}>
          <span>Хүлээж байна</span>
          <b>{queuedN}</b>
        </div>
        <div>
          <span>Ажиллаж байна</span>
          <b>
            {running.length}
            <small>/{concurrency}</small>
          </b>
        </div>
        <div>
          <span>Хурд</span>
          <b>
            {limited || paused ? 0 : 74}
            <small>/мин</small>
          </b>
        </div>
        <div>
          <span>Хүлээлт p95</span>
          <b>
            {Math.round(Math.max(p95, 1))}
            <small> с</small>
          </b>
        </div>
      </div>

      <div className="agq-flow">
        <div className="agq-col agq-q">
          <div className="agq-h">
            Дараалал <b>{queuedN}</b>
          </div>
          <ol className="agq-list">
            {queued.slice(0, shown).map((j) => (
              <li key={j.id} className={`agq-job agq-${j.kind}`}>
                <span className="agq-kind">{kindIcon[j.kind]}</span>
                <span className="agq-jn">{j.name}</span>
                <span className="agq-age">{Math.max(0, (t - j.enqueuedAt) / 1000).toFixed(1)} с</span>
              </li>
            ))}
            {depthN !== undefined && queuedN > shown && <li className="agq-more">+{queuedN - shown}</li>}
          </ol>
          <div className="agq-rest" aria-label={`Өөр ${Math.max(0, queuedN - shown)} хүлээж байна`}>
            {queued.slice(shown).map((j) => (
              <i key={j.id} className={`agq-${j.kind}`} />
            ))}
          </div>
        </div>

        <div className="agq-col agq-w">
          <div className="agq-h">
            Гүйцэтгэгч{" "}
            <b>
              {running.length}/{concurrency}
            </b>
          </div>
          {slots.map((w) => {
            const j = running.find((r) => r.worker === w.id);
            return (
              <div key={w.id} className="agq-worker">
                <span className="agq-wi">{workerIcon(w.icon)}</span>
                <span className="agq-wn">{w.name}</span>
                <span className={`agq-rail ${limited || paused ? "is-held" : ""}`}>
                  {j && (
                    <span className={`agq-run agq-${j.kind}`}>
                      <span className="agq-fill" style={{ width: `${Math.round((j.progress ?? 0) * 100)}%` }} />
                      <span className="agq-kind">{kindIcon[j.kind]}</span>
                      <span className="agq-jn">{j.name}</span>
                      <span className="agq-age">
                        {limited || paused ? "Түр зогссон" : `${Math.max(0, (t - (j.startedAt ?? t)) / 1000).toFixed(1)} с`}
                      </span>
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <div className="agq-col agq-out">
          <div className="agq-box">
            <span className="agq-bh">
              <i className="agq-ok">
                <svg viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </i>
              Дууссан
            </span>
            <b>{done}</b>
          </div>
          <div className="agq-box">
            <span className="agq-bh">
              <i className="agq-bad">
                <svg viewBox="0 0 16 16"><path d="m5 5 6 6M11 5l-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </i>
              Алдаатай
            </span>
            <b className="agq-red">{failed}</b>
          </div>
        </div>
      </div>

      <div className="agq-chart">
        <div className="agq-h">{byOrder ? "Хүлээлт, дарааллаар" : "Дарааллын урт"}</div>
        <div className="agq-plot">
          <span className="agq-y" style={{ top: 0 }}>{max}</span>
          <span className="agq-y" style={{ top: "50%" }}>{max / 2}</span>
          <span className="agq-y" style={{ top: "100%" }}>0</span>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={byOrder ? `Хүлээлт дарааллаар: ${queued.length} ажил, хамгийн урт ${Math.max(...depth)} с` : `Дарааллын урт: одоо ${queued.length} хүлээж байна, оргил ${Math.max(...depth)}`}>
            {limitBands.map(([a, b]) => (
              <rect key={a} x={a * step} width={(b - a) * step} y="0" height={H} className="agq-band" />
            ))}
            {bpOn && !byOrder && <line x1="0" x2={W} y1={H - (bpAt / max) * H} y2={H - (bpAt / max) * H} className="agq-bp" />}
            <path d={area} className="agq-area" />
            <path d={line} className="agq-line" vectorEffect="non-scaling-stroke" />
          </svg>
          <i className="agq-head" style={{ top: `${(pts[pts.length - 1][1] / H) * 100}%` }} />
        </div>
        <div className="agq-axis">
          {Array.isArray(axis) ? (
            axis.map((l, i) => <span key={i}>{l}</span>)
          ) : byOrder ? (
            <>
              <span>Эхэнд</span>
              <span>Сүүлд</span>
            </>
          ) : (
            <>
              <span>{Math.round(depth.length)} с өмнө</span>
              <span>одоо</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

const css = `
.agq{--agq-bg:#fff;--agq-fg:#18181b;--agq-muted:#65656d;--agq-faint:#65656d;--agq-line:#ececef;--agq-soft:#fafafa;--agq-llm-bg:#eef0ff;--agq-llm-edge:#c9cdfb;--agq-llm:#6366f1;--agq-tool-bg:#e9f8f5;--agq-tool:#0f9f8a;--agq-agent-bg:#eff1f4;--agq-agent:#64748b;--agq-human-bg:#eaf2ff;--agq-human:#3b82f6;--agq-amber:#c2410c;--agq-amber-bg:#fff4e5;--agq-red:#dc2626;--agq-green:#15803d;container-type:inline-size;width:100%;max-width:760px;background:var(--agq-bg);color:var(--agq-fg);border:1px solid var(--agq-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .agq{--agq-bg:#1b1b1e;--agq-fg:#ececef;--agq-muted:#a1a1aa;--agq-faint:#9a9aa2;--agq-line:#2c2c31;--agq-soft:#202024;--agq-llm-bg:#26264a;--agq-llm-edge:#3d3f7a;--agq-llm:#a5b4fc;--agq-tool-bg:#16332e;--agq-tool:#5eead4;--agq-agent-bg:#262a31;--agq-agent:#94a3b8;--agq-human-bg:#1c2a44;--agq-human:#93c5fd;--agq-amber:#fdba74;--agq-amber-bg:#3a2a14;--agq-red:#f87171;--agq-green:#4ade80;color-scheme:dark}
.agq *{box-sizing:border-box}.agq button{font:inherit;color:inherit;cursor:pointer}
.agq-bar{display:flex;align-items:center;gap:8px;padding:11px 12px 11px 16px;border-bottom:1px solid var(--agq-line);flex-wrap:wrap}
.agq-logo{width:15px;height:15px;color:#3b82f6}.agq-spark{width:48px;height:16px;color:var(--agq-muted);flex:none}.agq-bar strong{font-weight:500}.agq-muted{color:var(--agq-muted)}
.agq-limit{display:inline-flex;align-items:center;gap:6px;margin-left:4px;padding:1px 7px;border-radius:5px;background:var(--agq-amber-bg);color:var(--agq-amber);font-size:12.5px;font-variant-numeric:tabular-nums}
.agq-limit i{width:5px;height:5px;border-radius:50%;background:currentColor}
.agq-bp-warn{background:var(--ts-status-needs-you-bg,#fdebd6);color:var(--ts-status-needs-you-fg,#a33e0b);box-shadow:inset 0 0 0 1px var(--ts-status-needs-you-border,#f2c597)}
.agq-more{display:flex;align-items:center;height:24px;padding:0 8px;font-size:12.5px;color:var(--agq-muted);font-variant-numeric:tabular-nums}
.agq-ctl{margin-left:auto;display:flex;gap:6px}
.agq-pause{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 10px;border:1px solid var(--agq-line);border-radius:7px;background:var(--agq-bg)}
.agq-pause svg{width:14px;height:14px}.agq-pause:hover{background:var(--agq-soft)}
.agq-step{display:inline-flex;align-items:center;height:30px;border:1px solid var(--agq-line);border-radius:7px}
.agq-step button{display:grid;place-items:center;width:28px;height:28px;border:0;background:none;color:var(--agq-muted)}.agq-step button:hover{color:var(--agq-fg)}
.agq-step svg{width:14px;height:14px}.agq-step output{min-width:16px;text-align:center;font-variant-numeric:tabular-nums}
.agq-stats{display:grid;grid-template-columns:repeat(4,1fr);padding:14px 0 13px;border-bottom:1px solid var(--agq-line)}
.agq-stats div{padding:0 22px;display:flex;flex-direction:column;gap:3px}.agq-stats div+div{border-left:1px solid var(--agq-line)}
.agq-stats span{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--agq-muted)}
.agq-stats b{font-weight:400;font-size:16px;font-variant-numeric:tabular-nums}.agq-stats small{font-size:14px;color:var(--agq-muted)}
.agq-stats .is-warn b{color:var(--agq-amber)}
.agq-flow{display:grid;grid-template-columns:198px minmax(0,1fr) 120px;gap:22px;padding:14px 16px 16px;border-bottom:1px solid var(--agq-line)}
.agq-h{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--agq-muted);margin-bottom:9px}.agq-h b{margin-left:4px;font-size:13px;letter-spacing:0;color:var(--agq-fg);font-weight:500}
.agq-list{list-style:none;margin:0 0 4px;padding:0;display:flex;flex-direction:column;gap:4px}
.agq-job{display:flex;align-items:center;gap:7px;height:28px;padding:0 8px 0 5px;border:1px solid var(--agq-line);border-radius:6px;background:var(--agq-bg);font-size:12.5px;animation:agq-drop .35s both}
.agq-kind{display:grid;place-items:center;width:18px;height:18px;border-radius:4px;flex:none}.agq-kind svg{width:12px;height:12px}
.agq-llm .agq-kind{background:var(--agq-llm-bg);color:var(--agq-llm)}.agq-tool .agq-kind{background:var(--agq-tool-bg);color:var(--agq-tool)}.agq-agent .agq-kind{background:var(--agq-agent-bg);color:var(--agq-agent)}.agq-human .agq-kind{background:var(--agq-human-bg);color:var(--agq-human)}
.agq-jn{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.agq-age{color:var(--agq-muted);font-size:12.5px;font-variant-numeric:tabular-nums}
.agq-rest{display:flex;flex-wrap:wrap;align-content:flex-start;gap:4px;min-height:80px;padding:10px;border:1px solid var(--agq-line);border-radius:6px;background:var(--agq-soft)}
.agq-rest i{width:12px;height:12px;border-radius:3px;background:var(--agq-llm-edge);opacity:.8}.agq-rest i.agq-tool{background:color-mix(in srgb,var(--agq-tool) 40%,transparent)}.agq-rest i.agq-agent{background:color-mix(in srgb,var(--agq-agent) 35%,transparent)}.agq-rest i.agq-human{background:color-mix(in srgb,var(--agq-human) 40%,transparent)}
.agq-w{display:flex;flex-direction:column;gap:0}
.agq-worker{display:grid;grid-template-columns:18px 104px minmax(0,1fr);align-items:center;gap:8px;height:42px;padding:0 4px 0 10px;margin-bottom:4px;border:1px solid var(--agq-line);border-radius:7px;background:var(--agq-soft)}
.agq-wi{display:grid;place-items:center}.agq-wi svg{width:14px;height:14px}.agq-wn{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.agq-rail{position:relative;height:32px;min-width:0}
.agq-run{position:absolute;inset:0;display:flex;align-items:center;gap:7px;padding:0 8px 0 7px;border:1px solid var(--agq-line);border-radius:6px;background:var(--agq-bg);font-size:12.5px;overflow:hidden;animation:agq-in .35s both}
.agq-fill{position:absolute;inset:0 auto 0 0;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--agq-llm-bg) 90%,transparent));box-shadow:inset -2px 0 0 color-mix(in srgb,var(--agq-llm-edge) 70%,transparent);transition:width .25s linear}
.agq-run>*:not(.agq-fill){position:relative}
.agq-rail.is-held .agq-fill{background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--agq-amber-bg) 90%,transparent));box-shadow:inset -2px 0 0 color-mix(in srgb,var(--agq-amber) 35%,transparent)}
.agq-out{display:flex;flex-direction:column;gap:8px}
.agq-box{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:12px 12px 10px;border:1px solid var(--agq-line);border-radius:7px;background:var(--agq-soft)}
.agq-bh{display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--agq-muted)}
.agq-bh i{display:grid;place-items:center;width:18px;height:18px;border-radius:4px}.agq-bh svg{width:12px;height:12px}
.agq-ok{background:color-mix(in srgb,var(--agq-green) 14%,transparent);color:var(--agq-green)}.agq-bad{background:color-mix(in srgb,var(--agq-red) 12%,transparent);color:var(--agq-red)}
.agq-box b{font-weight:400;font-size:20px;font-variant-numeric:tabular-nums}.agq-red{color:var(--agq-red)}
.agq-chart{padding:14px 16px 12px}
.agq-plot{position:relative;height:112px;margin-left:26px}
.agq-plot svg{display:block;width:100%;height:100%;overflow:visible}
.agq-y{position:absolute;left:-26px;transform:translateY(-50%);font-size:12px;color:var(--agq-muted)}
.agq-band{fill:color-mix(in srgb,var(--agq-amber) 7%,transparent)}
.agq-bp{stroke:var(--agq-faint);stroke-dasharray:3 3;stroke-width:1;vector-effect:non-scaling-stroke}
.agq-area{fill:color-mix(in srgb,var(--agq-llm) 12%,transparent)}
.agq-line{fill:none;stroke:var(--agq-llm);stroke-width:1.2}
.agq-head{position:absolute;right:-3px;width:6px;height:6px;margin-top:-3px;border-radius:50%;background:var(--agq-llm);transition:top .3s}
.agq-axis{display:flex;justify-content:space-between;margin:6px 0 0 26px;font-size:12px;color:var(--agq-muted)}
.agq :focus-visible{outline:2px solid #3b82f6;outline-offset:2px}
@keyframes agq-drop{from{opacity:0;transform:translateY(-6px)}}
@keyframes agq-in{from{opacity:0;transform:translateX(-8px)}}
@container (max-width:600px){.agq-flow{grid-template-columns:1fr}.agq-out{flex-direction:row}.agq-worker{grid-template-columns:20px minmax(0,1fr)}.agq-wn{display:none}.agq-stats{grid-template-columns:repeat(2,1fr);row-gap:12px}.agq-stats div:nth-child(3){border-left:0}}
@container (max-width:440px){.agq-ctl{margin-left:0;width:100%}}
@media(prefers-reduced-motion:reduce){.agq *{animation:none!important;transition:none!important}}
`;

export default AgentQueue;
