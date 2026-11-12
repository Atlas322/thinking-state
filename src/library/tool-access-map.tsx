"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type ToolCall = {
  id: string;
  status: "running" | "done" | "failed";
  input: unknown;
  output?: unknown;
  error?: string;
  /** ms since the run started */
  at?: number;
  duration?: number;
  replay?: boolean;
};
export type AccessTool = { id: string; name: string; icon?: React.ReactNode; description?: string };
export type AgentTool = { id: string; calls?: ToolCall[] };
export type MapAgent = {
  id: string;
  name: string;
  model?: string;
  avatar?: React.ReactNode;
  status: "queued" | "running" | "waiting" | "done" | "failed";
  task?: string;
  tools: AgentTool[];
};

export type ToolAccessMapProps = {
  agents?: MapAgent[];
  tools?: AccessTool[];
  agent?: string;
  defaultAgent?: string;
  onAgentChange?: (id: string) => void;
  onReplay?: (call: ToolCall, input: unknown, tool: AccessTool, agent: MapAgent) => void;
  formatTime?: (ms: number) => string;
  title?: string;
  className?: string;
};

const ico = (children: React.ReactNode) => <svg viewBox="0 0 16 16" aria-hidden="true">{children}</svg>;

// Neutral role marks for the demo agents (no vendor logos).
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const logos = {
  research: ico(
    <g {...stroke}>
      <circle cx="7" cy="7" r="4" />
      <path d="m10 10 3.5 3.5" />
    </g>,
  ),
  code: ico(<path {...stroke} d="m5.5 4.5-3.5 3.5 3.5 3.5M10.5 4.5l3.5 3.5-3.5 3.5" />),
  write: ico(<path {...stroke} d="M3 13h3l7-7-3-3-7 7Z" />),
  analyze: ico(<path {...stroke} d="M2.5 13.5h11M4.5 11V8M8 11V4.5M11.5 11V6.5" />),
};

const toolIcons: Record<string, React.ReactNode> = {
  vcs: ico(
    <g {...stroke}>
      <circle cx="5" cy="3.5" r="1.6" />
      <circle cx="5" cy="12.5" r="1.6" />
      <circle cx="11" cy="6" r="1.6" />
      <path d="M5 5.1v5.8M11 7.6c0 2-2 2.4-6 3.3" />
    </g>,
  ),
  terminal: ico(
    <>
      <rect x="2" y="3" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="m5 6.5 1.8 1.5L5 9.5M8.5 10h2.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>,
  ),
  payments: ico(
    <g {...stroke}>
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.8" />
      <path d="M1.5 6.5h13M4 10h3" />
    </g>,
  ),
  design: ico(
    <g {...stroke}>
      <rect x="2" y="2" width="12" height="12" rx="2" />
      <path d="M2 6h12M6 6v8" />
    </g>,
  ),
  database: ico(
    <g fill="none" stroke="#14b8a6" strokeWidth="1.2">
      <ellipse cx="8" cy="4" rx="4.5" ry="1.8" />
      <path d="M3.5 4v8c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8V4M3.5 8c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8" />
    </g>,
  ),
  web: ico(
    <>
      <circle cx="7" cy="7" r="4" fill="none" stroke="#3b82f6" strokeWidth="1.3" />
      <path d="m10 10 3.5 3.5" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" />
    </>,
  ),
  docs: ico(<path {...stroke} d="M4 1.8h5.5L12.5 5v9.2H4ZM6 8h4.5M6 10.5h4.5" />),
  chat: ico(<path {...stroke} d="M2.5 3h11v8H6.5L3 13.5V11h-.5Z" />),
  crm: ico(
    <g {...stroke}>
      <circle cx="6" cy="5.5" r="2.3" />
      <path d="M2 13c.4-2.4 2-3.6 4-3.6s3.6 1.2 4 3.6M10.5 3.6a2.2 2.2 0 0 1 0 4M12 9.6c1.2.5 1.9 1.6 2.1 3.4" />
    </g>,
  ),
};

const defaultTools: AccessTool[] = [
  { id: "vcs", name: "Хувилбарын хяналт" },
  { id: "terminal", name: "Терминал" },
  { id: "payments", name: "Төлбөрийн систем" },
  { id: "design", name: "Дизайны файл" },
  { id: "database", name: "Өгөгдлийн сан" },
  { id: "web", name: "Вэб хайлт" },
  { id: "docs", name: "Баримтын сан" },
  { id: "chat", name: "Багийн чат" },
  { id: "crm", name: "Харилцагчийн бүртгэл" },
];

const c = (id: string, at: number, duration: number, input: unknown, output: unknown, status: ToolCall["status"] = "done"): ToolCall => ({
  id,
  status,
  at,
  duration,
  input,
  output,
});

const defaultAgents: MapAgent[] = [
  {
    id: "researcher", name: "Судлаач агент", model: "Том загвар", avatar: logos.research, status: "done",
    task: "Өрсөлдөгчдийн тарифын хуудсыг харьцуулах",
    tools: [
      { id: "web", calls: [c("r1", 4000, 2100, { q: "тарифын хуудас 2026" }, { results: 10 }), c("r2", 9000, 1800, { q: "хэрэглэгчээр ба хэрэглээгээр тооцох" }, { results: 8 })] },
      { id: "docs", calls: [c("r3", 15000, 900, { page: "Тарифын судалгаа" }, { saved: true })] },
    ],
  },
  {
    id: "coder", name: "Кодын агент", model: "Дунд загвар", avatar: logos.code, status: "running",
    task: "Тарифын хуудсыг бүтээж, төлбөрийн урсгалыг холбох",
    tools: [
      { id: "vcs", calls: [c("g1", 12000, 5200, { action: "create_branch", name: "pricing-page" }, { ok: true }), c("g2", 31000, 4800, { action: "commit", files: 4 }, { sha: "8f2c1a" }), c("g3", 52000, 5200, { action: "open_pr", title: "Тарифын хуудас" }, { pr: 482 })] },
      { id: "terminal", calls: [c("t1", 20000, 9000, { cmd: "pnpm test" }, { passed: 128 }), c("t2", 45000, 10000, { cmd: "pnpm build" }, { ok: true })] },
      { id: "payments", calls: [c("s1", 38000, 730, { action: "create_plan", seats: 5 }, { id: "plan_1Q" })] },
      { id: "design", calls: [c("f1", 8000, 1200, { file: "Тариф v3", frame: "Компьютер" }, { nodes: 42 })] },
      { id: "database", calls: [c("d1", 41000, 280, { sql: "select * from plans" }, { rows: 3 })] },
      { id: "web" },
    ],
  },
  {
    id: "writer", name: "Бичигч агент", model: "Дунд загвар", avatar: logos.write, status: "waiting",
    task: "Тарифын хуудасны текст бичих",
    tools: [
      { id: "docs", calls: [c("w1", 22000, 1100, { page: "Тарифын текст" }, { words: 640 })] },
      { id: "design", calls: [c("w2", 30000, 1500, { file: "Тариф v3" }, { nodes: 42 })] },
      { id: "chat" },
    ],
  },
  {
    id: "analyst", name: "Шинжээч агент", model: "Хурдан загвар", avatar: logos.analyze, status: "queued",
    task: "Шинэ багцуудын хэрэглэгчийн өсөлтийг таамаглах",
    tools: [{ id: "database" }, { id: "payments" }, { id: "crm" }],
  },
];

const fmtDur = (ms?: number) => (ms == null ? "" : ms < 1000 ? `${ms}ms` : `${+(ms / 1000).toFixed(1)} с`);
const defaultFormatTime = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;
const STATUS_LABEL: Record<string, string> = { queued: "Дараалалд", running: "Ажиллаж байна", waiting: "Таны ээлж", done: "Дууссан", failed: "Алдаатай" };
const pretty = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v, null, 2));

// geometry
const W = 680;
const CARD_W = 130;
const CARD_H = 46;
const PITCH = 58;
const BUS_L = 185;
const AG_X = 240;
const AG_W = 200;
const BUS_R = AG_X + AG_W + 55;
const R = 7;

export function ToolAccessMap({
  agents = defaultAgents,
  tools: toolsProp,
  agent: agentProp,
  defaultAgent,
  onAgentChange,
  onReplay,
  formatTime = defaultFormatTime,
  title = "Хэрэгслийн эрх",
  className = "",
}: ToolAccessMapProps) {
  const tools = React.useMemo(() => {
    if (toolsProp) return toolsProp;
    const ids = Array.from(new Set(agents.flatMap((a) => a.tools.map((t) => t.id))));
    const known = defaultTools.filter((t) => ids.includes(t.id));
    return [...known, ...ids.filter((i) => !known.some((k) => k.id === i)).map((i) => ({ id: i, name: i }))];
  }, [toolsProp, agents]);
  const [innerAgent, setInnerAgent] = React.useState(defaultAgent ?? agents[0]?.id);
  const agentId = agentProp ?? innerAgent;
  const agent = agents.find((a) => a.id === agentId) ?? agents[0];
  const [openTool, setOpenTool] = React.useState<string | null>(null);
  const [callIdx, setCallIdx] = React.useState(0);
  const [draft, setDraft] = React.useState("");
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const toolRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const listRef = React.useRef<HTMLUListElement>(null);
  const id = React.useId();

  const pickAgent = (a: string) => {
    if (agentProp === undefined) setInnerAgent(a);
    onAgentChange?.(a);
    setOpenTool(null);
  };

  const access = (tid: string) => agent?.tools.find((t) => t.id === tid);
  const used = agent?.tools.length ?? 0;
  const callsTotal = agent?.tools.reduce((n, t) => n + (t.calls?.length ?? 0), 0) ?? 0;
  const running = agent?.tools.reduce((n, t) => n + (t.calls?.filter((x) => x.status === "running").length ?? 0), 0) ?? 0;

  const half = Math.ceil(tools.length / 2);
  const left = tools.slice(0, half);
  const right = tools.slice(half);
  const H = Math.max(left.length, right.length) * PITCH - (PITCH - CARD_H);
  const midY = H / 2;
  const colY = (i: number, n: number) => (H - (n * PITCH - (PITCH - CARD_H))) / 2 + i * PITCH;

  const wire = (y: number, side: "l" | "r") => {
    const d = y - midY;
    const s = Math.sign(d);
    const r = Math.min(R, Math.abs(d) / 2);
    if (side === "l") {
      if (!s) return `M${CARD_W} ${y}H${AG_X}`;
      return `M${CARD_W} ${y}H${BUS_L - r}Q${BUS_L} ${y} ${BUS_L} ${y - s * r}V${midY + s * r}Q${BUS_L} ${midY} ${BUS_L + r} ${midY}H${AG_X}`;
    }
    const x0 = AG_X + AG_W;
    const x1 = W - CARD_W;
    if (!s) return `M${x0} ${midY}H${x1}`;
    return `M${x0} ${midY}H${BUS_R - r}Q${BUS_R} ${midY} ${BUS_R} ${midY + s * r}V${y - s * r}Q${BUS_R} ${y} ${BUS_R + r} ${y}H${x1}`;
  };

  const tool = tools.find((t) => t.id === openTool);
  const calls = (openTool && access(openTool)?.calls) || [];
  const call = calls[callIdx];

  React.useEffect(() => {
    if (call) setDraft(pretty(call.input));
  }, [openTool, callIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (openTool) listRef.current?.focus();
  }, [openTool]);

  const closeCalls = () => {
    const t = openTool;
    setOpenTool(null);
    if (t) window.setTimeout(() => toolRefs.current[t]?.focus(), 0);
  };

  const replay = () => {
    if (!call || !tool || !agent) return;
    let input: unknown = draft;
    if (typeof call.input !== "string") {
      try {
        input = JSON.parse(draft);
      } catch {
        input = draft;
      }
    }
    onReplay?.(call, input, tool, agent);
  };

  const card = (t: AccessTool, x: number, y: number) => {
    const a = access(t.id);
    const n = a?.calls?.length ?? 0;
    const last = a?.calls?.[n - 1];
    const isRunning = last?.status === "running";
    const failed = last?.status === "failed";
    const state = !a ? "Эрхгүй" : !n ? "Хараахан ашиглаагүй" : isRunning ? "Ажиллаж байна" : failed ? "Алдаатай" : `Сүүлд ${fmtDur(last?.duration)}`;
    return (
      <button
        key={t.id}
        type="button"
        ref={(el) => {
          toolRefs.current[t.id] = el;
        }}
        className={`tam-tool ${!a ? "off" : ""} ${isRunning ? "run" : ""} ${failed ? "fail" : ""}`}
        style={{ left: x, top: y }}
        aria-disabled={!a || !n || undefined}
        aria-label={`${t.name}: ${state}${n ? `, ${n} дуудлага` : ""}`}
        onClick={() => {
          if (!a || !n) return;
          setCallIdx(n - 1);
          setOpenTool(t.id);
        }}
      >
        <span className="tam-t1">
          <span className="tam-ico">{t.icon ?? toolIcons[t.id] ?? t.name[0]}</span>
          <span className="tam-name">{t.name}</span>
          {n > 0 && <span className="tam-n">{n}×</span>}
        </span>
        <span className={`tam-t2 ${failed ? "fail" : isRunning ? "run" : ""}`}>{state}</span>
      </button>
    );
  };

  return (
    <section className={`tam ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="tam-bar">
        <svg className="tam-logo" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="2.2" fill="currentColor" />
          <circle cx="2.5" cy="8" r="1.2" fill="currentColor" opacity=".55" />
          <circle cx="13.5" cy="8" r="1.2" fill="currentColor" opacity=".55" />
          <path d="M3.7 8h2.1m4.4 0h2.1" stroke="currentColor" strokeWidth="1" opacity=".55" />
        </svg>
        <strong>{title}</strong>
        <span className="tam-stats" aria-live="polite">
          {running > 0 && <span className="tam-runtag">{running} ажиллаж байна</span>}
          <span>{used}/{tools.length} хэрэгсэл</span>
          <span>· {callsTotal} дуудлага</span>
        </span>
      </header>

      <div
        className="tam-tabs"
        role="tablist"
        aria-label="Агентууд"
        ref={tabsRef}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          const i = agents.findIndex((a) => a.id === agent?.id);
          const n = agents[(i + (e.key === "ArrowRight" ? 1 : agents.length - 1)) % agents.length];
          pickAgent(n.id);
          window.setTimeout(() => tabsRef.current?.querySelector<HTMLButtonElement>(`[data-agent="${n.id}"]`)?.focus(), 0);
        }}
      >
        {agents.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            data-agent={a.id}
            id={`${id}-tab-${a.id}`}
            aria-selected={a.id === agent?.id}
            aria-controls={`${id}-panel`}
            tabIndex={a.id === agent?.id ? 0 : -1}
            className="tam-tab"
            onClick={() => pickAgent(a.id)}
          >
            <span className="tam-ico">{a.avatar ?? a.name[0]}</span>
            {a.name}
          </button>
        ))}
      </div>

      {agent && (
        <div className="tam-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${agent.id}`}>
          <div className="tam-map" style={{ height: H }} inert={!!openTool || undefined}>
            <svg className="tam-wires" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              {left.map((t, i) => {
                const y = colY(i, left.length) + CARD_H / 2;
                const a = access(t.id);
                const run = a?.calls?.some((x) => x.status === "running");
                return (
                  <g key={t.id}>
                    <path d={wire(y, "l")} className={a ? "on" : "off"} />
                    {a && <path key={agent.id} d={wire(y, "l")} className="draw" pathLength={1} />}
                    {run && <path d={wire(y, "l")} className="glint" pathLength={1} />}
                  </g>
                );
              })}
              {right.map((t, i) => {
                const y = colY(i, right.length) + CARD_H / 2;
                const a = access(t.id);
                const run = a?.calls?.some((x) => x.status === "running");
                return (
                  <g key={t.id}>
                    <path d={wire(y, "r")} className={a ? "on" : "off"} />
                    {a && <path key={agent.id} d={wire(y, "r")} className="draw" pathLength={1} />}
                    {run && <path d={wire(y, "r")} className="glint" pathLength={1} />}
                  </g>
                );
              })}
              <circle cx={AG_X} cy={midY} r="3" className="tam-port" />
              <circle cx={AG_X + AG_W} cy={midY} r="3" className="tam-port" />
            </svg>
            {left.map((t, i) => card(t, 0, colY(i, left.length)))}
            {right.map((t, i) => card(t, W - CARD_W, colY(i, right.length)))}
            <div className="tam-agent" style={{ left: AG_X, top: midY }} key={agent.id}>
              <div className="tam-a1">
                <span className="tam-ico lg">{agent.avatar ?? agent.name[0]}</span>
                <span className="tam-who">
                  <strong>{agent.name}</strong>
                  {agent.model && <span>{agent.model}</span>}
                </span>
                <span className={`tam-badge ${agent.status}`}>
                  {agent.status === "running" && <i className="tam-spin" aria-hidden="true" />}
                  {STATUS_LABEL[agent.status] ?? agent.status}
                </span>
              </div>
              {agent.task && <p className="tam-task">{agent.task}</p>}
            </div>
          </div>

          {tool && call && (
            <div
              className="tam-calls"
              role="dialog"
              aria-label={`${tool.name}: дуудлагууд`}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  closeCalls();
                }
              }}
            >
              <div className="tam-calls-head">
                <button type="button" className="tam-back" aria-label="Зураглал руу буцах" onClick={closeCalls}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 4-4 4 4 4" /></svg>
                </button>
                <span className="tam-ico">{("icon" in tool ? (tool as { icon?: React.ReactNode }).icon : undefined) ?? toolIcons[tool.id]}</span>
                <strong>{tool.name}</strong>
                <span className="tam-muted">{agent.name}: {calls.length} дуудлага</span>
              </div>
              <div className="tam-calls-body">
                <ul
                  ref={listRef}
                  className="tam-list"
                  role="listbox"
                  tabIndex={0}
                  aria-label="Дуудлагууд"
                  aria-activedescendant={`${id}-call-${callIdx}`}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setCallIdx((i) => Math.min(calls.length - 1, i + 1));
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setCallIdx((i) => Math.max(0, i - 1));
                    }
                  }}
                >
                  {calls.map((x, i) => (
                    <li
                      key={x.id}
                      id={`${id}-call-${i}`}
                      role="option"
                      aria-selected={i === callIdx}
                      className={i === callIdx ? "on" : ""}
                      onClick={() => setCallIdx(i)}
                    >
                      <i className={`tam-dot ${x.status}`} />
                      <span>#{i + 1}{x.replay ? " · дахин" : ""}</span>
                      <span className="tam-muted">{x.at != null ? formatTime(x.at) : ""}</span>
                      <span className="tam-muted tam-dur">{fmtDur(x.duration)}</span>
                    </li>
                  ))}
                </ul>
                <div className="tam-call">
                  <label className="tam-lbl" htmlFor={`${id}-input`}>Оролт</label>
                  <textarea
                    id={`${id}-input`}
                    value={draft}
                    spellCheck={false}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        replay();
                      }
                    }}
                  />
                  <div className="tam-lbl">{call.error ? "Алдаа" : "Гаралт"}</div>
                  <pre className={call.error ? "err" : ""}>{call.error ?? (call.output !== undefined ? pretty(call.output) : "…")}</pre>
                  <div className="tam-call-foot">
                    <button type="button" className="tam-replay" onClick={replay}>
                      Дахин тоглуулах
                      <kbd>⌘↵</kbd>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

const css = `
.tam{--tam-bg:#fff;--tam-fg:#18181b;--tam-muted:#71717a;--tam-faint:#a1a1aa;--tam-line:#ececef;--tam-chip:#ededef;--tam-blue:#3b82f6;--tam-blue-bg:#e3eefd;--ui-tamc-used:#4f86d6;--ui-tamc-off:#8a8a93;--ui-tamc-glint:#2563eb;--ui-tamc-dim:.5;--tam-red:#dc2626;--tam-amber:#b45309;--tam-amber-bg:#fdf3d7;width:100%;max-width:680px;container-type:inline-size;color:var(--tam-fg);font:400 13px/1.4 Inter,system-ui,sans-serif;position:relative}
:where(.dark,[data-theme=dark]) .tam{--tam-bg:#1f1f23;--tam-fg:#ececef;--tam-muted:#a1a1aa;--tam-faint:#71717a;--tam-line:#303036;--tam-chip:#2a2a2f;--tam-blue-bg:#1c2a40;--ui-tamc-used:#5b8fe0;--ui-tamc-off:#7a7a83;--ui-tamc-glint:#93c5fd;--tam-amber:#fbbf24;--tam-amber-bg:#3a2f12;color-scheme:dark}
.tam *{box-sizing:border-box}.tam button{font:inherit;color:inherit;cursor:pointer}
.tam-bar{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.tam-logo{width:16px;height:16px;color:var(--tam-muted)}
.tam-bar strong{font-size:14px;font-weight:500}
.tam-stats{display:flex;align-items:center;gap:8px;margin-left:auto;color:var(--tam-muted);font-variant-numeric:tabular-nums}
.tam-stats>span:not(.tam-runtag){min-width:4.6em;text-align:right}
.tam-runtag{padding:0 6px;border-radius:4px;background:var(--tam-blue-bg);color:var(--tam-blue);font-size:12px;line-height:18px}
.tam-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.tam-tab{display:inline-flex;align-items:center;gap:8px;height:28px;padding:0 9px 0 4px;border:1px solid transparent;border-radius:7px;background:var(--tam-chip);color:var(--tam-muted)!important;font-size:13px}
.tam-tab:hover{color:var(--tam-fg)!important}
.tam-tab[aria-selected=true]{background:var(--tam-bg);border-color:var(--tam-line);color:var(--tam-fg)!important;box-shadow:0 1px 2px #0000000d}
.tam-ico{display:grid;place-items:center;width:20px;height:20px;flex:none;border-radius:5px;background:var(--tam-bg);border:1px solid var(--tam-line);color:var(--tam-fg);font-size:10px;font-weight:600}
.tam-ico svg{width:12px;height:12px}
.tam-tab .tam-ico{border:0;box-shadow:0 0 0 1px var(--tam-line)}
.tam-ico.lg{width:24px;height:24px;border-radius:6px}.tam-ico.lg svg{width:15px;height:15px}
.tam-panel{position:relative}
.tam-map{position:relative;width:100%}
.tam-wires{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.tam-wires path{fill:none;stroke-width:1.5}
.tam-wires path.on{stroke:var(--ui-tamc-used)}
.tam-wires path.off{stroke:var(--ui-tamc-off);stroke-width:1.2;stroke-dasharray:2 3}
.tam-wires path.draw{stroke:var(--ui-tamc-used);stroke-dasharray:1;stroke-dashoffset:1;animation:tam-draw .5s ease-out forwards}
.tam-wires path.glint{stroke:var(--ui-tamc-glint);stroke-width:2;stroke-dasharray:.12 .88;animation:tam-glint 1.2s linear infinite}
.tam-port{fill:var(--tam-bg);stroke:var(--ui-tamc-used);stroke-width:1.2}
.tam-tool{position:absolute;width:${CARD_W}px;height:${CARD_H}px;display:flex;flex-direction:column;justify-content:center;gap:1px;padding:0 10px;border:1px solid var(--tam-line);border-radius:8px;background:var(--tam-bg);box-shadow:0 1px 2px #0000000a;text-align:left;transition:opacity .25s,border-color .15s,box-shadow .15s}
.tam-tool:not(.off):not([aria-disabled]):hover{border-color:color-mix(in srgb,var(--tam-fg) 20%,var(--tam-line));box-shadow:0 2px 8px #0000000f}
.tam-tool[aria-disabled]{cursor:default}
.tam-tool.off{opacity:var(--ui-tamc-dim);box-shadow:none;background:transparent}
.tam-tool.run{border-color:color-mix(in srgb,var(--tam-blue) 45%,var(--tam-line))}
.tam-tool .tam-ico{width:16px;height:16px;border:0;background:none}
.tam-tool .tam-ico svg{width:13px;height:13px}
.tam-t1{display:flex;align-items:center;gap:6px;min-width:0}
.tam-name{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tam-n{margin-left:auto;color:var(--tam-faint);font-size:11.5px}
.tam-t2{padding-left:22px;font-size:11.5px;color:var(--tam-muted);white-space:nowrap}
.tam-t2.run{color:var(--tam-blue)}.tam-t2.fail{color:var(--tam-red)}
.tam-agent{position:absolute;width:${AG_W}px;transform:translateY(-50%);padding:10px;border:1px solid var(--tam-line);border-radius:10px;background:var(--tam-bg);box-shadow:0 2px 10px #0000000d;animation:tam-up .3s ease-out}
.tam-a1{display:flex;align-items:flex-start;gap:8px}
.tam-who{display:flex;flex-direction:column;min-width:0;flex:1;line-height:1.25}
.tam-who strong{font-size:14px;font-weight:500}.tam-who span{font-size:11.5px;color:var(--tam-muted)}
.tam-badge{display:inline-flex;align-items:center;gap:5px;padding:0 5px;border-radius:4px;font-size:11.5px;line-height:17px;background:var(--tam-chip);color:var(--tam-muted)}
.tam-badge.running{background:var(--tam-blue-bg);color:var(--tam-blue)}
.tam-badge.waiting{background:var(--tam-amber-bg);color:var(--tam-amber)}
.tam-badge.failed{background:#fde8e8;color:var(--tam-red)}
.tam-spin{width:8px;height:8px;border:1.3px solid currentColor;border-right-color:transparent;border-radius:50%;animation:tam-spin 1s linear infinite}
.tam-task{margin:8px 0 0;font-size:12.5px;line-height:1.4;color:var(--tam-fg);opacity:.85}
.tam-calls{position:absolute;inset:-4px 0 auto;min-height:calc(100% + 8px);border:1px solid var(--tam-line);border-radius:12px;background:var(--tam-bg);box-shadow:0 10px 30px #00000014;animation:tam-in .22s ease-out;display:flex;flex-direction:column}
.tam-calls-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--tam-line)}
.tam-calls-head strong{font-weight:500;font-size:14px}
.tam-back{display:grid;place-items:center;width:24px;height:24px;padding:0;border:0;border-radius:6px;background:none;color:var(--tam-muted)}.tam-back:hover{background:var(--tam-chip)}
.tam-back svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.tam-muted{color:var(--tam-muted)}
.tam-calls-body{display:grid;grid-template-columns:200px minmax(0,1fr);flex:1;min-height:0}
.tam-list{list-style:none;margin:0;padding:6px;border-right:1px solid var(--tam-line);outline:none}
.tam-list li{display:flex;align-items:center;gap:8px;height:30px;padding:0 8px;border-radius:6px;cursor:pointer}
.tam-list li.on{background:var(--tam-chip)}
.tam-list:focus-visible li.on{box-shadow:inset 0 0 0 2px var(--tam-blue)}
.tam-dur{margin-left:auto}
.tam-dot{width:6px;height:6px;border-radius:50%;background:#22c55e}.tam-dot.running{background:var(--tam-blue)}.tam-dot.failed{background:var(--tam-red)}
.tam-call{padding:10px 12px 12px;min-width:0;display:flex;flex-direction:column}
.tam-lbl{display:block;margin:2px 0 4px;font-size:11px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:var(--tam-muted)}
.tam-call textarea,.tam-call pre{width:100%;margin:0 0 10px;padding:8px 10px;border:1px solid var(--tam-line);border-radius:7px;background:color-mix(in srgb,var(--tam-chip) 45%,var(--tam-bg));color:var(--tam-fg);font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-word}
.tam-call textarea{min-height:96px;resize:vertical}
.tam-call pre.err{color:var(--tam-red)}
.tam-call-foot{display:flex;justify-content:flex-end;margin-top:auto}
.tam-replay{display:inline-flex;align-items:center;gap:8px;height:28px;padding:0 10px;border:0;border-radius:7px;background:var(--tam-fg);color:var(--tam-bg)!important;font-weight:500}
.tam-replay kbd{font:inherit;font-size:10px;opacity:.6}
.tam :focus-visible{outline:2px solid var(--tam-blue);outline-offset:2px}
@keyframes tam-draw{to{stroke-dashoffset:0}}
@keyframes tam-glint{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes tam-spin{to{transform:rotate(360deg)}}
@keyframes tam-up{from{opacity:0;transform:translateY(calc(-50% + 6px))}}
@keyframes tam-in{from{opacity:0;transform:translateY(6px)}}
@container (max-width:600px){.tam-map{height:auto!important;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tam-wires{display:none}.tam-tool,.tam-agent{position:relative;left:auto!important;top:auto!important;width:auto;transform:none}.tam-agent{grid-column:1/-1;order:-1;animation:none}.tam-calls-body{grid-template-columns:1fr}.tam-list{border-right:0;border-bottom:1px solid var(--tam-line)}.tam-tool .tam-t2{white-space:normal}.tam-stats>span:not(.tam-runtag){min-width:0}.tam-bar{flex-wrap:wrap}}
@media(prefers-reduced-motion:reduce){.tam *{animation:none!important;transition:none!important}.tam-wires path.glint{display:none}}
`;

export function Demo() {
  return <ToolAccessMap defaultAgent="coder" />;
}

export default Demo;
