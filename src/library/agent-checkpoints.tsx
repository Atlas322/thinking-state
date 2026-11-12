"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type Checkpoint = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  parent?: string;
  status?: "running" | "done" | "failed" | "stopped";
  /** ms since the run began */
  at?: number;
  files?: number;
  cost?: number;
};

export type AgentCheckpointsProps = {
  checkpoints?: Checkpoint[];
  head?: string;
  onRewind?: (checkpoint: Checkpoint) => void;
  task?: string;
  formatTime?: (ms: number) => string;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
};

const ico = (c: React.ReactNode) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    {c}
  </svg>
);
/** Neutral glyphs, no brand marks. Keys kept for API compatibility. */
export const checkpointIcons = {
  slack: ico(<path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />),
  github: ico(
    <>
      <circle cx="4.5" cy="3.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.5" cy="12.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11.5" cy="6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 5v6M11.5 7.5c0 2-2 2.6-6 3.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </>,
  ),
  notion: ico(
    <>
      <path d="M3.5 1.8h6l3 3v9.4h-9Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5.5 8h5M5.5 10.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>,
  ),
  figma: ico(
    <>
      <rect x="2" y="2" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 6h12M6 6v8" stroke="currentColor" strokeWidth="1.2" />
    </>,
  ),
  stripe: ico(
    <>
      <rect x="1.8" y="3.5" width="12.4" height="9" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.8 6.5h12.4M4.5 10h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>,
  ),
};

/** `cost` here is spend in thousands of tokens. */
const defaultCheckpoints: Checkpoint[] = [
  { id: "c1", title: "Даалгаврыг уншсан", icon: checkpointIcons.slack, at: 9000, cost: 2 },
  { id: "c2", title: "Тарифын хуудасны суурийг үүсгэсэн", icon: checkpointIcons.github, parent: "c1", at: 30000, files: 4, cost: 6 },
  { id: "c3", title: "Багцын тайлбарыг бичсэн", icon: checkpointIcons.notion, parent: "c2", at: 47000, files: 1, cost: 5 },
  { id: "c4", title: "Тарифын хүснэгтийг хийсэн", icon: checkpointIcons.figma, parent: "c3", at: 81000, files: 3, cost: 11 },
  { id: "c5", title: "Төлбөрийн системийг холбосон", icon: checkpointIcons.stripe, parent: "c4", at: 122000, files: 5, cost: 12 },
  { id: "c6", title: "Тест унасан – 12-оос 4", icon: checkpointIcons.github, parent: "c5", at: 148000, status: "failed", cost: 4 },
  { id: "c7", title: "Төлбөрийн маягтыг сольсон", icon: checkpointIcons.stripe, parent: "c4", at: 186000, files: 3, cost: 14 },
  { id: "c8", title: "Тест амжилттай – 12-оос 12", icon: checkpointIcons.github, parent: "c7", at: 210000, cost: 4 },
];

const ROW = 30;
const LANE = 14;
const X0 = 8;

const defTime = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const defCost = (n: number) => `${Math.round(n)}k токен`;
const statusLabel: Record<NonNullable<Checkpoint["status"]>, string> = {
  running: "Ажиллаж байна",
  done: "Дууссан",
  failed: "Алдаатай",
  stopped: "Зогссон",
};

export function AgentCheckpoints({
  checkpoints,
  head,
  onRewind,
  task = "Тарифын хуудсыг нийтлэх",
  formatTime = defTime,
  formatCost = defCost,
  title = "Хяналтын цэгүүд",
  className = "",
}: AgentCheckpointsProps) {
  const [inner, setInner] = React.useState(defaultCheckpoints);
  const [innerHead, setInnerHead] = React.useState<string | undefined>();
  const list = checkpoints ?? inner;
  const headId = head ?? innerHead ?? list[list.length - 1]?.id;
  const [focus, setFocus] = React.useState(list.length - 1);
  const rows = React.useRef<(HTMLLIElement | null)[]>([]);

  // lanes and attempts from parent links
  const { lane, attempt, lanes } = React.useMemo(() => {
    const lane: Record<string, number> = {};
    const attempt: Record<string, number> = {};
    const firstChild: Record<string, string> = {};
    let max = 0;
    for (const c of list) {
      if (!c.parent || lane[c.parent] == null) {
        lane[c.id] = 0;
        attempt[c.id] = 1;
      } else if (!firstChild[c.parent]) {
        firstChild[c.parent] = c.id;
        lane[c.id] = lane[c.parent];
        attempt[c.id] = attempt[c.parent];
      } else {
        max += 1;
        lane[c.id] = max;
        attempt[c.id] = max + 1;
      }
    }
    return { lane, attempt, lanes: max + 1 };
  }, [list]);

  const onPath = React.useMemo(() => {
    const s = new Set<string>();
    let id: string | undefined = headId;
    while (id) {
      s.add(id);
      id = list.find((c) => c.id === id)?.parent;
    }
    return s;
  }, [list, headId]);

  const index = (id: string) => list.findIndex((c) => c.id === id);
  const total = list.reduce((n, c) => n + (c.cost ?? 0), 0);
  const width = X0 * 2 + (lanes - 1) * LANE;

  const rewind = (c: Checkpoint) => {
    if (onRewind) return onRewind(c);
    // uncontrolled demo: mark the work in progress as stopped and branch a new attempt
    const id = `r${Date.now()}`;
    const last = list[list.length - 1];
    const at = (last?.at ?? 0) + 18000;
    setInner((l) => [
      ...l.map((x) => (x.status === "running" ? { ...x, status: "stopped" as const } : x)),
      { id, title: `Дахин оролдох: ${c.title}`, icon: c.icon, parent: c.id, at, status: "running", cost: 3 },
    ]);
    setInnerHead(id);
    window.setTimeout(() => {
      setInner((l) => l.map((x) => (x.id === id && x.status === "running" ? { ...x, status: "done" } : x)));
    }, 1600);
  };

  React.useEffect(() => {
    setFocus(list.length - 1);
  }, [list.length]);

  const move = (i: number) => {
    const n = Math.max(0, Math.min(list.length - 1, i));
    setFocus(n);
    rows.current[n]?.focus();
  };

  const attempts = lanes;

  return (
    <section className={`ackc ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="ackc-bar">
        <svg viewBox="0 0 16 16" className="ackc-mark" aria-hidden="true">
          <circle cx="4.5" cy="3.5" r="1.6" fill="currentColor" />
          <circle cx="4.5" cy="12.5" r="1.6" fill="currentColor" />
          <circle cx="11.5" cy="9" r="1.6" fill="currentColor" />
          <path d="M4.5 5v6M4.5 6.5c0 2 3 2.5 5.4 2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <strong>{title}</strong>
        {task && <span className="ackc-task">{task}</span>}
        <span className="ackc-sum" aria-live="polite">
          {list.length} хяналтын цэг · {attempts} оролдлого · {formatCost(total)}
        </span>
      </header>
      <div className="ackc-body">
        <svg className="ackc-rail" width={width} height={list.length * ROW} aria-hidden="true">
          {list.map((c, i) => {
            if (!c.parent) return null;
            const p = index(c.parent);
            if (p < 0) return null;
            const x1 = X0 + lane[c.parent] * LANE;
            const x2 = X0 + lane[c.id] * LANE;
            const y1 = p * ROW + ROW / 2;
            const y2 = i * ROW + ROW / 2;
            const d =
              x1 === x2
                ? `M${x1} ${y1}V${y2}`
                : `M${x1} ${y1}C${x1} ${y1 + 14},${x2} ${y1 + 8},${x2} ${y1 + 22}V${y2}`;
            const on = onPath.has(c.id);
            return <path key={c.id} d={d} className={on ? "is-on" : "is-off"} />;
          })}
          {list.map((c, i) => {
            const x = X0 + lane[c.id] * LANE;
            const y = i * ROW + ROW / 2;
            const isHead = c.id === headId;
            const on = onPath.has(c.id);
            return isHead ? (
              <circle key={c.id} cx={x} cy={y} r={3.6} className="ackc-head" />
            ) : on ? (
              <circle key={c.id} cx={x} cy={y} r={2.4} className="ackc-dot" />
            ) : (
              <circle key={c.id} cx={x} cy={y} r={3} className="ackc-ring" />
            );
          })}
        </svg>
        <ol className="ackc-list" aria-label={title}>
          {list.map((c, i) => {
            const isHead = c.id === headId;
            const left = !onPath.has(c.id);
            const status = c.status ?? "done";
            const att = attempt[c.id];
            const firstOfAttempt = att > 1 && list.find((x) => attempt[x.id] === att)?.id === c.id;
            return (
              <li
                key={c.id}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                className={`ackc-row ${left ? "is-left" : ""} ${status === "running" ? "is-running" : ""}`}
                tabIndex={focus === i ? 0 : -1}
                aria-current={isHead ? "step" : undefined}
                aria-label={`${c.title}, оролдлого ${att}, ${statusLabel[status]}${isHead ? ", одоогийн" : left ? ", орхигдсон" : ""}`}
                onFocus={() => setFocus(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") (e.preventDefault(), move(i + 1));
                  else if (e.key === "ArrowUp") (e.preventDefault(), move(i - 1));
                  else if (e.key === "Home") (e.preventDefault(), move(0));
                  else if (e.key === "End") (e.preventDefault(), move(list.length - 1));
                  else if (e.key === "Enter" || e.key === " ") (e.preventDefault(), rewind(c));
                }}
              >
                <span className="ackc-ico">{c.icon}</span>
                <span className="ackc-title">{c.title}</span>
                {status === "failed" && <span className="ackc-tag is-fail">{statusLabel.failed}</span>}
                {status === "stopped" && <span className="ackc-tag">{statusLabel.stopped}</span>}
                {firstOfAttempt && <span className="ackc-tag">Оролдлого {att}</span>}
                <span className="ackc-meta">
                  {c.files != null && (
                    <span className="ackc-files">
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M1.5 4.5a1 1 0 0 1 1-1h3.2l1.3 1.3h6.5a1 1 0 0 1 1 1v6.7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1Z" fill="currentColor" />
                      </svg>
                      {c.files} файл
                    </span>
                  )}
                  <span className="ackc-time">{c.at != null ? formatTime(c.at) : ""}</span>
                </span>
                {!isHead && (
                  <button
                    type="button"
                    className="ackc-rewind"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      rewind(c);
                    }}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8a5 5 0 1 0 1.5-3.6M3 2.5V5h2.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Буцаах
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const css = `
.ackc{--ui-ackc-link:#82bcff;--ackc-bg:#fff;--ackc-fg:#18181b;--ackc-muted:#65656d;--ackc-faint:#65656d;--ackc-line:#ececef;--ackc-chip:#f1f1f3;--ackc-head:#2563eb;width:100%;max-width:480px;background:var(--ackc-bg);color:var(--ackc-fg);border:1px solid var(--ackc-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums}
:where(.dark,[data-theme=dark]) .ackc{--ackc-bg:#1b1b1e;--ackc-fg:#ececef;--ackc-muted:#a1a1aa;--ackc-faint:#9a9aa2;--ackc-line:#2e2e33;--ackc-chip:#2a2a2f;--ackc-head:#5b9bff;color-scheme:dark}
.ackc *{box-sizing:border-box}.ackc button{font:inherit;color:inherit;cursor:pointer}
.ackc-bar{display:flex;flex-wrap:wrap;align-items:center;gap:2px 8px;padding:12px 16px 6px 16px;font-size:13px;white-space:nowrap}
.ackc-mark{width:14px;height:14px;color:var(--ackc-muted);flex:none}
.ackc-bar strong{font-weight:500;font-size:14px}
.ackc-task{color:var(--ackc-muted);overflow:hidden;text-overflow:ellipsis;min-width:0}
.ackc-sum{margin-left:auto;padding-left:12px;white-space:normal;font-size:12px;color:var(--ackc-muted)}
.ackc-body{display:flex;gap:10px;padding:0 14px 10px 16px;max-height:${14 * ROW + 10}px;overflow:auto}
.ackc-rail{flex:none;overflow:visible}
.ackc-rail path{fill:none;stroke-width:1.5}
.ackc-rail .is-on{stroke:var(--ui-ackc-link)}.ackc-rail .is-off{stroke:var(--ackc-line);stroke-width:1.4}
.ackc-dot{fill:var(--ui-ackc-link)}.ackc-head{fill:var(--ackc-head);animation:ackc-pop .35s both}
.ackc-ring{fill:var(--ackc-bg);stroke:#d4d4d8;stroke-width:1.2}
.ackc-list{list-style:none;margin:0;padding:0;flex:1;min-width:0}
.ackc-row{position:relative;display:flex;align-items:center;gap:8px;height:${ROW}px;padding:0 2px;border-radius:6px;outline:none;animation:ackc-in .3s both}
.ackc-row:focus-visible{box-shadow:0 0 0 2px var(--ui-ackc-link)}
.ackc-row.is-left{--ackc-fg:var(--ackc-muted);color:var(--ackc-muted)}
.ackc-ico{display:grid;place-items:center;width:16px;height:16px;flex:none}.ackc-ico svg{width:14px;height:14px}
.ackc-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.is-running .ackc-title{background:linear-gradient(90deg,var(--ackc-fg) 30%,var(--ackc-faint) 50%,var(--ackc-fg) 70%) 0/200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ackc-shim 1.4s linear infinite}
.ackc-tag{flex:none;padding:1px 6px;border-radius:4px;background:var(--ackc-chip);font-size:12px;color:var(--ackc-muted)}
.ackc-tag.is-fail{background:#fdecec;color:#c62828}
:where(.dark,[data-theme=dark]) .ackc-tag.is-fail{background:#3a1717;color:#fca5a5}
.ackc-meta{display:flex;align-items:center;gap:20px;margin-left:auto;padding-left:8px;flex:none;font-size:12px}
.ackc-files{display:inline-flex;align-items:center;gap:5px;color:var(--ackc-faint)}.ackc-files svg{width:11px;height:11px}
.ackc-time{min-width:28px;text-align:right;color:var(--ackc-muted)}
.ackc-rewind{position:absolute;right:0;top:50%;transform:translateY(-50%);display:none;align-items:center;gap:5px;height:24px;padding:0 9px;border:0;border-radius:6px;background:var(--ackc-bg);box-shadow:0 0 0 1px var(--ackc-line),0 1px 2px #0000000f;font-size:12px;font-weight:500}
.ackc-rewind svg{width:12px;height:12px}
.ackc-row:hover .ackc-rewind,.ackc-row:focus-visible .ackc-rewind{display:inline-flex}
.ackc-row:hover .ackc-meta,.ackc-row:focus-visible .ackc-meta{visibility:hidden}
@keyframes ackc-in{from{opacity:0;transform:translateY(4px)}}
@keyframes ackc-pop{0%{r:0}70%{r:5px}}
@keyframes ackc-shim{to{background-position:-200% 0}}
@media(max-width:480px){.ackc-task,.ackc-files{display:none}}
@media(prefers-reduced-motion:reduce){.ackc *{animation:none!important;transition:none!important}}
.ackc-row{animation-duration:.5s;animation-timing-function:var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}.ackc-row:nth-child(1){animation-delay:0ms}.ackc-row:nth-child(2){animation-delay:110ms}.ackc-row:nth-child(3){animation-delay:220ms}.ackc-row:nth-child(4){animation-delay:330ms}.ackc-row:nth-child(5){animation-delay:440ms}.ackc-row:nth-child(6){animation-delay:550ms}.ackc-row:nth-child(7){animation-delay:660ms}.ackc-row:nth-child(8){animation-delay:770ms}.ackc-row:nth-child(9){animation-delay:880ms}.ackc-row:nth-child(10){animation-delay:990ms}.ackc-row:nth-child(11){animation-delay:1100ms}.ackc-row:nth-child(12){animation-delay:1210ms}
`;

export default AgentCheckpoints;
