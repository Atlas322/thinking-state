"use client";

import * as React from "react";

/**
 * Side Sessions — the panel beside a chat that lists the sessions this one
 * started, by state: Needs you, Running, Idle, Done. A finished session's
 * report is not proof, so each Done row carries the close-out chain
 * «check → update → archive»; a row can be archived only once checked.
 * Thinking State original; a visible chain-of-thought action.
 *
 * Scenario (demo, no props): a running session finishes, gets checked,
 * updated and archived. Motion is off under prefers-reduced-motion.
 */

export type SideSessionState = "needs" | "running" | "idle" | "done";
export type SideSessionStep = "check" | "update" | "archive";

export type SideSession = {
  id: string;
  title: string;
  state: SideSessionState;
  /** One line: its latest report, or what it waits on. */
  line?: string;
  branch?: string;
  pr?: number;
  /** Close-out steps already taken (Done rows). */
  steps?: SideSessionStep[];
};

export type SideSessionsLabels = {
  title: string;
  needs: string;
  running: string;
  idle: string;
  done: string;
  check: string;
  update: string;
  archive: string;
  archived: string;
  empty: string;
};

export type SideSessionsProps = {
  sessions?: SideSession[];
  onOpen?: (s: SideSession) => void;
  onStep?: (s: SideSession, step: SideSessionStep) => void;
  labels?: Partial<SideSessionsLabels>;
  className?: string;
};

const defaultLabels: SideSessionsLabels = {
  title: "Дэд сешнүүд",
  needs: "Таны ээлж",
  running: "Ажиллаж байна",
  idle: "Хүлээгдэж буй",
  done: "Дууссан",
  check: "Шалгах",
  update: "Шинэчлэх",
  archive: "Архивлах",
  archived: "архивласан",
  empty: "Дэд сешн алга",
};

const ORDER: SideSessionState[] = ["needs", "running", "idle", "done"];
const STEPS: SideSessionStep[] = ["check", "update", "archive"];

const demoSessions: SideSession[] = [
  { id: "contrast", title: "Харанхуй горимын тодрол", state: "needs", line: "Хоёр өнгөний аль нь вэ гэж асууж байна", branch: "fix/dark-contrast" },
  { id: "docs", title: "README-ийн нэршил", state: "running", line: "Нэршлийг «харагдах бодлын хэлхээ» болгож байна", branch: "docs/visible-chain" },
  { id: "tokens", title: "Төлөвийн өнгөнүүд", state: "idle", line: "Дизайны хувьсагчдыг хүлээж байна" },
  { id: "chat-gaps", title: "Чатын дутуу компонент", state: "done", line: "4 компонент нэмж PR нээсэн", pr: 65, steps: ["check"] },
];

export const sideSessionsDemo = { sessions: demoSessions };

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const icons: Record<SideSessionState, React.ReactNode> = {
  needs: <path d="M8 4.5v4M8 11h.01" />,
  running: <path d="M5.5 4.5l6 3.5-6 3.5z" />,
  idle: <path d="M6 5v6M10 5v6" />,
  done: <path d="M4 8.5l2.5 2.5 5.5-6" />,
};

export function SideSessions({ sessions: sessionsProp, onOpen, onStep, labels: labelsProp, className = "" }: SideSessionsProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const [own, setOwn] = React.useState<SideSession[]>(sessionsProp ?? demoSessions);
  const sessions = sessionsProp ?? own;
  const uid = React.useId();

  const step = (s: SideSession, st: SideSessionStep) => {
    onStep?.(s, st);
    if (sessionsProp) return;
    setOwn((list) => list.map((x) => (x.id === s.id ? { ...x, steps: [...(x.steps ?? []), st] } : x)));
  };

  // Demo: the running session finishes, then is checked, updated, archived.
  React.useEffect(() => {
    if (sessionsProp || reducedMotion()) return;
    const set = (fn: (x: SideSession) => SideSession) => setOwn((l) => l.map((x) => (x.id === "docs" ? fn(x) : x)));
    const ts = [
      window.setTimeout(() => set((x) => ({ ...x, state: "done", line: "README засаад PR #64 нээсэн", pr: 64, steps: [] })), 2200),
      window.setTimeout(() => set((x) => ({ ...x, steps: ["check"] })), 3800),
      window.setTimeout(() => set((x) => ({ ...x, steps: ["check", "update"] })), 5200),
      window.setTimeout(() => set((x) => ({ ...x, steps: ["check", "update", "archive"] })), 6600),
      window.setTimeout(() => setOwn(demoSessions), 9600),
    ];
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [sessionsProp]);

  const label: Record<SideSessionState, string> = { needs: L.needs, running: L.running, idle: L.idle, done: L.done };
  const groups = ORDER.map((st) => ({ st, list: sessions.filter((s) => s.state === st) })).filter((g) => g.list.length);

  return (
    <aside className={`ss ${className}`} data-cw-root="side-sessions" aria-labelledby={`${uid}-t`}>
      <style>{css}</style>
      <header className="ss-head">
        <h3 id={`${uid}-t`} className="ss-title">{L.title}</h3>
        <span className="ss-count">{sessions.filter((s) => !s.steps?.includes("archive")).length}</span>
      </header>
      {groups.length === 0 && <p className="ss-empty">{L.empty}</p>}
      {groups.map(({ st, list }) => (
        <section key={st} className={`ss-group is-${st}`} aria-label={label[st]}>
          <h4 className="ss-gh">
            <svg viewBox="0 0 16 16" aria-hidden="true">{icons[st]}</svg>
            {label[st]}
            <span>{list.length}</span>
          </h4>
          <ul className="ss-list">
            {list.map((s) => {
              const done = s.steps ?? [];
              const archived = done.includes("archive");
              const next = STEPS.find((x) => !done.includes(x));
              return (
                <li key={s.id} className={`ss-row is-${s.state}${archived ? " is-archived" : ""}`}>
                  <button type="button" className="ss-open" onClick={() => onOpen?.(s)} data-cw-prompt={`${s.title} сешнийг нээ`}>
                    <span className="ss-dot" aria-hidden="true" />
                    <span className="ss-main">
                      <span className="ss-name">{s.title}{archived && <em> · {L.archived}</em>}</span>
                      {s.line && <span className="ss-line">{s.line}</span>}
                    </span>
                    {(s.pr || s.branch) && <span className="ss-ref">{s.pr ? `#${s.pr}` : s.branch}</span>}
                  </button>
                  {s.state === "done" && (
                    <ol className="ss-chain" aria-label={`${L.check} → ${L.update} → ${L.archive}`}>
                      {STEPS.map((x) => {
                        const isDone = done.includes(x);
                        const stepLabel = x === "check" ? L.check : x === "update" ? L.update : L.archive;
                        return (
                          <li key={x} className={isDone ? "is-done" : x === next ? "is-next" : ""}>
                            {x === next ? (
                              <button type="button" onClick={() => step(s, x)} data-cw-prompt={`${s.title}: ${stepLabel}`}>{stepLabel}</button>
                            ) : (
                              <span>
                                {isDone && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 8.5l2.5 2.5 5.5-6" /></svg>}
                                {stepLabel}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </aside>
  );
}

const css = `
.ss{--ss-bg:var(--ts-surface,#fff);--ss-fg:var(--ts-fg,#18181b);--ss-muted:var(--ts-muted,#65656d);--ss-line:var(--ts-line,#ececef);--ss-soft:var(--ts-soft,#f4f4f5);--ss-accent:var(--ts-accent,#1b5cff);--ss-needs:var(--ts-status-waiting,var(--ts-amber,#c2620a));--ss-running:var(--ts-status-running,var(--ts-accent,#1b5cff));--ss-idle:var(--ts-status-idle,var(--ts-muted,#65656d));--ss-done:var(--ts-status-done,var(--ts-green,#16a34a));width:100%;max-width:340px;box-sizing:border-box;display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--ss-line);border-radius:14px;background:var(--ss-bg);color:var(--ss-fg);font:400 13px/1.4 var(--ts-font,Inter,system-ui,sans-serif)}
:where(.dark,[data-theme=dark]) .ss{--ss-bg:var(--ts-surface,#1b1b1e);--ss-fg:var(--ts-fg,#ececef);--ss-muted:var(--ts-muted,#a1a1aa);--ss-line:var(--ts-line,#2e2e33);--ss-soft:var(--ts-soft,#26262a);--ss-accent:var(--ts-accent,#7c9cff);--ss-needs:var(--ts-status-waiting,var(--ts-amber,#eba659));--ss-running:var(--ts-status-running,var(--ts-accent,#7c9cff));--ss-idle:var(--ts-status-idle,var(--ts-muted,#a1a1aa));--ss-done:var(--ts-status-done,var(--ts-green,#4ade80));color-scheme:dark}
.ss svg{width:13px;height:13px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.ss-head{display:flex;align-items:center;gap:8px}
.ss-title{margin:0;font-size:14px;font-weight:600}
.ss-count{margin-left:auto;min-width:22px;padding:1px 7px;border-radius:999px;background:var(--ss-soft);color:var(--ss-muted);font-size:12px;text-align:center;font-variant-numeric:tabular-nums}
.ss-empty{margin:0;color:var(--ss-muted)}
.ss-group{display:flex;flex-direction:column;gap:4px}
.ss-gh{margin:0;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--ss-c)}
.ss-gh span{color:var(--ss-muted);font-weight:400}
.ss-group.is-needs{--ss-c:var(--ss-needs)}.ss-group.is-running{--ss-c:var(--ss-running)}.ss-group.is-idle{--ss-c:var(--ss-idle)}.ss-group.is-done{--ss-c:var(--ss-done)}
.ss-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.ss-row{border-radius:10px;animation:ss-in .3s ease both;transition:opacity .3s}
.ss-row.is-archived{opacity:.5}
.ss-open{width:100%;display:flex;align-items:flex-start;gap:8px;padding:7px 8px;border:0;border-radius:10px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.ss-open:hover{background:var(--ss-soft)}
.ss-open:focus-visible,.ss-chain button:focus-visible{outline:2px solid var(--ss-accent);outline-offset:1px}
.ss-dot{width:8px;height:8px;margin-top:5px;border-radius:50%;background:var(--ss-c);flex:none}
.ss-row.is-running .ss-dot{animation:ss-pulse 1.2s ease-in-out infinite}
.ss-main{display:flex;flex-direction:column;min-width:0;flex:1}
.ss-name{font-weight:500}.ss-name em{font-style:normal;color:var(--ss-muted);font-weight:400}
.ss-line{color:var(--ss-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ss-ref{flex:none;padding:1px 6px;border-radius:6px;background:var(--ss-soft);color:var(--ss-muted);font-size:11px;font-variant-numeric:tabular-nums}
.ss-chain{list-style:none;margin:0 0 4px 24px;padding:0;display:flex;flex-wrap:wrap;align-items:center;gap:4px}
.ss-chain li{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--ss-muted)}
.ss-chain li+li::before{content:"→";color:var(--ss-line);margin-right:2px}
.ss-chain span{display:inline-flex;align-items:center;gap:3px;min-height:24px}
.ss-chain .is-done span{color:var(--ss-done)}
.ss-chain button{min-height:24px;padding:0 9px;border-radius:7px;border:1px solid var(--ss-accent);background:none;color:var(--ss-accent);font:inherit;font-weight:500;cursor:pointer}
.ss-chain button:hover{background:color-mix(in srgb,var(--ss-accent) 10%,transparent)}
@keyframes ss-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
@keyframes ss-pulse{50%{opacity:.35}}
@media(prefers-reduced-motion:reduce){.ss,.ss *{animation:none!important;transition:none!important}}
`;

export default SideSessions;
