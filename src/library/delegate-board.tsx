"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type DelegateAgent = {
  id: string;
  name: string;
  model?: string;
  avatar?: React.ReactNode;
  /** Minutes left on the task it runs now. */
  current?: number;
  /** Cost per minute of work. */
  rate?: number;
};

export type DelegateTask = {
  id: string;
  title: string;
  /** Minutes. */
  estimate: number;
  tools?: React.ReactNode[];
  agentId?: string | null;
};

export type DelegateMode = "auto" | "manual";

export type DelegateBoardProps = {
  title?: string;
  agents?: DelegateAgent[];
  tasks?: DelegateTask[];
  onAssign?: (taskId: string, agentId: string | null) => void;
  mode?: DelegateMode;
  defaultMode?: DelegateMode;
  onModeChange?: (mode: DelegateMode) => void;
  suggestion?: { taskId: string; agentId: string } | null;
  now?: number;
  formatCost?: (amount: number) => string;
  className?: string;
};

/** Neutral system glyphs (no vendor logos). */
const glyph = (d: string, color: string) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d={d} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const tool = {
  crm: glyph("M2.5 3.5h11v9h-11ZM6 7.2a1.3 1.3 0 1 0 0-.01M4 11c.4-1 1.1-1.5 2-1.5s1.6.5 2 1.5M9.5 6.5h2.5M9.5 9h2", "#f97316"),
  chat: glyph("M3 3.5h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7l-3 2.5v-2.5H3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z", "#a855f7"),
  docs: glyph("M4 1.8h5l3 3v9.4H4ZM9 1.8v3h3M6 8.5h4M6 11h3", "currentColor"),
  code: glyph("M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5M9 3 7 13", "currentColor"),
  design: glyph("M2.5 13.5 4 10l7-7 2 2-7 7ZM9.5 4.5l2 2", "#ec4899"),
};

const defaultAgents: DelegateAgent[] = [
  { id: "researcher", name: "Судлаач", model: "Судлаач агент", current: 7, rate: 0.08 },
  { id: "writer", name: "Бичигч", model: "Бичигч агент", current: 14, rate: 0.03 },
  { id: "coder", name: "Кодчин", model: "Кодын агент", current: 21, rate: 0.06 },
  { id: "ops", name: "Үйл ажиллагаа", model: "Үйл ажиллагааны агент", current: 8, rate: 0.01 },
];

const defaultTasks: DelegateTask[] = [
  { id: "crm", title: "Харилцагчийн давхардал цэвэрлэх", estimate: 18, tools: [tool.crm], agentId: null },
  { id: "scan", title: "Өрсөлдөгчийн тойм", estimate: 23, agentId: "researcher" },
  { id: "churn", title: "Цуцлалтын ярианы хураангуй", estimate: 16, tools: [tool.chat, tool.docs], agentId: "researcher" },
  { id: "notes", title: "Хувилбарын тэмдэглэл бичих", estimate: 14, agentId: "writer" },
  { id: "auth", title: "Нэвтрэлтийн кодыг сайжруулах", estimate: 21, agentId: "coder" },
  { id: "flaky", title: "Тогтворгүй төлбөрийн тестийг засах", estimate: 15, tools: [tool.code], agentId: "coder" },
  { id: "stripe", title: "Төлбөрийн системийн сан шинэчлэх", estimate: 8, agentId: "ops" },
  { id: "pricing", title: "Багцын хуудсыг шинэчлэх", estimate: 12, tools: [tool.design], agentId: "ops" },
];

const clock = (ms: number) => {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export function DelegateBoard({
  title = "Ажил хуваарилах",
  agents = defaultAgents,
  tasks: tasksProp = defaultTasks,
  onAssign,
  mode: modeProp,
  defaultMode = "auto",
  onModeChange,
  suggestion,
  now: nowProp,
  formatCost = (n) => `${n.toFixed(2)} кр`,
  className = "",
}: DelegateBoardProps) {
  const [tasks, setTasks] = React.useState(tasksProp);
  React.useEffect(() => setTasks(tasksProp), [tasksProp]);
  const [modeState, setMode] = React.useState<DelegateMode>(defaultMode);
  const mode = modeProp ?? modeState;
  const [now] = React.useState(() => nowProp ?? new Date().setHours(17, 34, 0, 0));
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<string | null>(null);
  const [picking, setPicking] = React.useState<{ task: string; agent: number } | null>(null);
  const [announce, setAnnounce] = React.useState("");

  const queue = (id: string | null) => tasks.filter((t) => (t.agentId ?? null) === id);
  const minutesFor = (a: DelegateAgent) => {
    const q = queue(a.id);
    return q.reduce((n, t, i) => n + (i === 0 && a.current !== undefined ? a.current : t.estimate), 0);
  };
  const busyUntil = (a: DelegateAgent, extra = 0) => clock(now + (minutesFor(a) + extra) * 60000);
  const totalCost = agents.reduce((n, a) => n + minutesFor(a) * (a.rate ?? 0), 0);

  const assign = React.useCallback(
    (taskId: string, agentId: string | null) => {
      const t = tasks.find((x) => x.id === taskId);
      const a = agents.find((x) => x.id === agentId);
      if (onAssign) onAssign(taskId, agentId);
      else setTasks((list) => list.map((x) => (x.id === taskId ? { ...x, agentId } : x)));
      setAnnounce(`${t?.title} → ${a?.name ?? "Unassigned"}`);
    },
    [tasks, agents, onAssign],
  );

  // Auto mode: about one hand-off a second to the least busy agent
  // tasks that were already waiting when the board opened stay for a person to drag
  const seen = React.useRef(new Set(tasksProp.filter((t) => !t.agentId).map((t) => t.id)));
  const unassigned = queue(null);
  React.useEffect(() => {
    const fresh = unassigned.filter((t) => !seen.current.has(t.id));
    if (mode !== "auto" || !fresh.length || !agents.length) return;
    const id = window.setTimeout(() => {
      const free = [...agents].sort((a, b) => minutesFor(a) - minutesFor(b))[0];
      seen.current.add(fresh[0].id);
      assign(fresh[0].id, free.id);
    }, 1400);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, tasks]);

  const preview = (a: DelegateAgent) => {
    const tid = dragging ?? picking?.task ?? (suggestion?.agentId === a.id ? suggestion.taskId : null);
    const active = dragging ? over === a.id : picking ? agents[picking.agent]?.id === a.id : suggestion?.agentId === a.id;
    const t = tasks.find((x) => x.id === tid);
    return active && t && t.agentId !== a.id ? t : null;
  };

  return (
    <section className={`dlb ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="dlb-bar">
        <svg className="dlb-spark" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 1.5 7.2 5 10.5 6 7.2 7 6 10.5 4.8 7 1.5 6 4.8 5ZM12 9l.7 1.8 1.8.7-1.8.7L12 14l-.7-1.8-1.8-.7 1.8-.7Z" fill="currentColor" />
        </svg>
        <strong>{title}</strong>
        <span className="dlb-hint">{mode === "auto" ? "New tasks go to whoever is free first" : "Drag a task onto an agent"}</span>
        <label className="dlb-switch">
          Auto
          <input
            type="checkbox"
            role="switch"
            checked={mode === "auto"}
            onChange={(e) => {
              const m: DelegateMode = e.target.checked ? "auto" : "manual";
              setMode(m);
              onModeChange?.(m);
            }}
          />
          <span aria-hidden="true" />
        </label>
      </header>
      <div className="dlb-body">
        <div
          className={`dlb-pool${over === "pool" ? " is-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setOver("pool");
          }}
          onDragLeave={() => setOver(null)}
          onDrop={() => {
            if (dragging) {
              seen.current.add(dragging);
              assign(dragging, null);
            }
            setDragging(null);
            setOver(null);
          }}
        >
          <div className="dlb-pool-h">
            Unassigned <span className="dlb-n">{unassigned.length}</span>
          </div>
          {unassigned.map((t) => (
            <div
              key={t.id}
              className={`dlb-task${suggestion?.taskId === t.id ? " is-suggested" : ""}${picking?.task === t.id ? " is-picking" : ""}`}
              draggable
              tabIndex={0}
              aria-label={`${t.title}, about ${t.estimate} minutes`}
              onDragStart={() => setDragging(t.id)}
              onDragEnd={() => {
                setDragging(null);
                setOver(null);
              }}
              onKeyDown={(e) => {
                const k = e.key;
                if (/^[1-9]$/.test(k) && agents[+k - 1]) {
                  assign(t.id, agents[+k - 1].id);
                  setPicking(null);
                } else if (k === "Enter" || k === " ") {
                  e.preventDefault();
                  if (picking?.task === t.id) {
                    assign(t.id, agents[picking.agent].id);
                    setPicking(null);
                  } else setPicking({ task: t.id, agent: 0 });
                } else if (picking && (k === "ArrowDown" || k === "ArrowUp")) {
                  e.preventDefault();
                  const d = k === "ArrowDown" ? 1 : -1;
                  setPicking({ ...picking, agent: (picking.agent + d + agents.length) % agents.length });
                } else if (k === "Escape") setPicking(null);
              }}
            >
              <span className="dlb-grip" aria-hidden="true">
                <svg viewBox="0 0 8 12">{[2, 6, 10].flatMap((y) => [2, 6].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="currentColor" />))}</svg>
              </span>
              <div>
                <div className="dlb-task-t">{t.title}</div>
                <div className="dlb-task-m">
                  {t.tools?.map((ic, i) => <span key={i} className="dlb-ico">{ic}</span>)}~{t.estimate} min
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="dlb-agents">
          <div className="dlb-agents-h">
            <span>Agents</span>
            <span>{formatCost(totalCost)} in queues</span>
          </div>
          {agents.map((a) => {
            const q = queue(a.id);
            const p = preview(a);
            return (
              <div
                key={a.id}
                className={`dlb-agent${p ? " is-target" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(a.id);
                }}
                onDragLeave={() => setOver((o) => (o === a.id ? null : o))}
                onDrop={() => {
                  if (dragging) assign(dragging, a.id);
                  setDragging(null);
                  setOver(null);
                }}
              >
                <span className="dlb-av">{a.avatar ?? a.name[0]}</span>
                <div className="dlb-agent-main">
                  <div className="dlb-agent-top">
                    <div>
                      <div className="dlb-agent-n">{a.name}</div>
                      <div className="dlb-agent-m">
                        {a.model}
                        {a.rate !== undefined && <span> {formatCost(a.rate)}/min</span>}
                      </div>
                    </div>
                    <span className={`dlb-until${p ? " is-preview" : ""}`}>
                      Busy until {p ? busyUntil(a, p.estimate) : busyUntil(a)}
                      {p && a.rate !== undefined && <em> +{formatCost(p.estimate * a.rate)}</em>}
                    </span>
                  </div>
                  <div className="dlb-queue">
                    {q.slice(0, 3).map((t, i) => (
                      <span key={t.id} className={`dlb-chip${i === 0 ? " is-running" : ""}`}>
                        {i === 0 ? <span className="dlb-ring" aria-hidden="true" /> : t.tools?.map((ic, k) => <span key={k} className="dlb-ico">{ic}</span>)}
                        {t.title}
                      </span>
                    ))}
                    {q.length > 3 && (
                      <span className="dlb-chip is-more" tabIndex={0} title={q.slice(3).map((t) => t.title).join("\n")}>
                        +{q.length - 3}
                      </span>
                    )}
                    {p && <span className="dlb-chip is-ghost">{p.title}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="dlb-sr" aria-live="polite">
        Drag onto an agent, or press Enter, choose with the arrow keys and press Enter again. Number keys hand it over at once.
        {announce && ` ${announce}`}
      </div>
    </section>
  );
}

const css = `
.dlb{--dlb-bg:#fff;--dlb-fg:#18181b;--dlb-muted:#71717a;--dlb-faint:#a1a1aa;--dlb-line:#ececef;--dlb-soft:#f4f4f5;--dlb-chip:#f1f1f3;--dlb-blue:#3b82f6;--dlb-blue-soft:#e8f1fe;--dlb-blue-fg:#1d6fe0;width:100%;max-width:760px;background:var(--dlb-bg);color:var(--dlb-fg);border:1px solid var(--dlb-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .dlb{--dlb-bg:#1b1b1e;--dlb-fg:#ececef;--dlb-muted:#a1a1aa;--dlb-faint:#71717a;--dlb-line:#2e2e33;--dlb-soft:#232327;--dlb-chip:#2a2a2f;--dlb-blue:#5b9cff;--dlb-blue-soft:#1b2a44;--dlb-blue-fg:#8ab8ff;color-scheme:dark}
.dlb *{box-sizing:border-box}
.dlb-bar{display:flex;align-items:center;gap:10px;height:56px;padding:0 16px 0 20px;border-bottom:1px solid var(--dlb-line)}
.dlb-spark{width:14px;height:14px;color:var(--dlb-blue)}.dlb-bar strong{font-weight:500}
.dlb-hint{flex:1;min-width:0;font-size:13px;color:var(--dlb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dlb-switch{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:500;cursor:pointer}
.dlb-switch input{position:absolute;opacity:0;width:1px;height:1px}
.dlb-switch span{position:relative;width:30px;height:18px;border-radius:9px;background:var(--dlb-line);transition:background .2s}
.dlb-switch span::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0003;transition:transform .2s}
.dlb-switch input:checked+span{background:var(--dlb-blue)}.dlb-switch input:checked+span::after{transform:translateX(12px)}
.dlb-switch input:focus-visible+span{outline:2px solid var(--dlb-blue);outline-offset:2px}
.dlb-body{display:grid;grid-template-columns:236px 1fr;gap:16px;padding:14px 16px 14px 14px}
.dlb-pool{min-height:380px;padding:8px 6px;border-radius:10px;background:var(--dlb-soft);transition:box-shadow .15s}
.dlb-pool.is-over{box-shadow:inset 0 0 0 1.5px var(--dlb-blue)}
.dlb-pool-h{display:flex;align-items:center;gap:6px;padding:0 6px 8px;font-size:13px;color:var(--dlb-muted)}
.dlb-n{display:inline-grid;place-items:center;min-width:17px;height:17px;padding:0 4px;border:1px solid var(--dlb-line);border-radius:5px;background:var(--dlb-bg);font-size:11px;color:var(--dlb-fg)}
.dlb-task{display:flex;gap:8px;padding:9px 10px;margin-bottom:6px;border-radius:7px;background:var(--dlb-bg);box-shadow:0 1px 2px #0000000f,0 0 0 1px #0000000a;cursor:grab;animation:dlb-in .25s both;outline:none}
.dlb-task:focus-visible,.dlb-task.is-picking{box-shadow:0 0 0 2px var(--dlb-blue)}
.dlb-task.is-suggested{box-shadow:0 0 0 1.5px var(--dlb-blue)}
.dlb-grip{width:8px;padding-top:4px;color:var(--dlb-faint)}.dlb-grip svg{width:6px;height:10px}
.dlb-task-t{font-size:14px;font-weight:500}
.dlb-task-m{display:flex;align-items:center;gap:4px;margin-top:2px;font-size:13px;color:var(--dlb-muted)}
.dlb-ico{display:inline-grid;place-items:center;width:14px;height:14px;color:var(--dlb-fg)}.dlb-ico svg{width:13px;height:13px}
.dlb-agents-h{display:flex;justify-content:space-between;padding:0 4px 10px;font-size:13px;color:var(--dlb-muted)}
.dlb-agent{display:flex;gap:12px;padding:6px 4px 10px;border-radius:9px;transition:background .15s}
.dlb-agent.is-target{background:color-mix(in srgb,var(--dlb-blue-soft) 60%,transparent)}
.dlb-av{display:grid;place-items:center;flex:none;width:30px;height:30px;border-radius:50%;background:var(--dlb-bg);box-shadow:0 1px 3px #00000014,0 0 0 1px #0000000a}.dlb-av svg{width:16px;height:16px}
.dlb-agent-main{flex:1;min-width:0}
.dlb-agent-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
.dlb-agent-n{font-size:14px;font-weight:500}
.dlb-agent-m{font-size:13px;color:var(--dlb-muted)}.dlb-agent-m span{color:var(--dlb-faint);margin-left:4px}
.dlb-until{flex:none;height:20px;padding:0 6px;border-radius:5px;background:var(--dlb-chip);font-size:12px;line-height:20px;color:var(--dlb-muted);font-variant-numeric:tabular-nums;transition:background .15s,color .15s}
.dlb-until.is-preview{background:var(--dlb-blue-soft);color:var(--dlb-blue-fg)}.dlb-until em{font-style:normal}
.dlb-queue{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}
.dlb-chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 8px;border-radius:6px;background:var(--dlb-bg);box-shadow:0 0 0 1px var(--dlb-line),0 1px 2px #0000000a;font-size:13px;white-space:nowrap;animation:dlb-in .25s both}
.dlb-chip.is-running{background:var(--dlb-blue-soft);box-shadow:none;color:var(--dlb-blue-fg);font-weight:500}
.dlb-chip.is-ghost{box-shadow:0 0 0 1px dashed var(--dlb-blue);border:1px dashed var(--dlb-blue);color:var(--dlb-blue-fg);background:none}
.dlb-chip.is-more{color:var(--dlb-muted);cursor:default}
.dlb-ring{width:10px;height:10px;border-radius:50%;border:1.5px solid color-mix(in srgb,var(--dlb-blue) 30%,transparent);border-top-color:var(--dlb-blue);animation:dlb-rot .9s linear infinite}
.dlb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@keyframes dlb-in{from{opacity:0;transform:translateY(3px)}}
@keyframes dlb-rot{to{transform:rotate(360deg)}}
@media(max-width:620px){.dlb-body{grid-template-columns:1fr}.dlb-pool{min-height:0}.dlb-hint{display:none}}
@media(prefers-reduced-motion:reduce){.dlb *{animation:none!important;transition:none!important}}
`;

export default DelegateBoard;
