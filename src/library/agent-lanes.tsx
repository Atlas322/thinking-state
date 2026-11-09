"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type LaneAgent = {
  id: string;
  name: string;
  model?: string;
  avatar?: React.ReactNode;
};

export type LaneTool = "notion" | "slack" | "figma" | "github" | "stripe";

export type LaneTask = {
  id: string;
  agentId: string;
  title: string;
  status: "done" | "running" | "waiting" | "failed";
  start: number;
  end?: number;
  handoffTo?: string;
  ask?: string;
  summary?: string;
  tools?: LaneTool[];
};

export type AgentLanesProps = {
  agents?: LaneAgent[];
  tasks?: LaneTask[];
  /** Visible window in ms. */
  span?: number;
  now?: number;
  title?: string;
  className?: string;
  onApprove?: (task: LaneTask) => void;
  onReject?: (task: LaneTask) => void;
  onOpen?: (task: LaneTask) => void;
};

const MIN = 60_000;

const logo = {
  claude: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      {[0, 30, 60, 90, 120, 150].map((r) => (
        <rect key={r} x="7.3" y="1.5" width="1.4" height="13" rx=".7" fill="#d97757" transform={`rotate(${r} 8 8)`} />
      ))}
    </svg>
  ),
  openai: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <path key={r} d="M8 2.2a2.6 2.6 0 0 1 2.6 2.6v3.4" fill="none" stroke="currentColor" strokeWidth="1.15" transform={`rotate(${r} 8 8)`} />
      ))}
    </svg>
  ),
  gemini: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1c.5 3.6 3.4 6.5 7 7-3.6.5-6.5 3.4-7 7-.5-3.6-3.4-6.5-7-7 3.6-.5 6.5-3.4 7-7Z" fill="#3b82f6" />
    </svg>
  ),
};

const toolIcon: Record<LaneTool, React.ReactNode> = {
  notion: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="#fff" stroke="#111" strokeWidth="1.3" />
      <path d="M5.2 11.5v-7h1l3.6 7h1v-7" fill="none" stroke="#111" strokeWidth="1.3" />
    </svg>
  ),
  slack: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="6" width="6" height="2.6" rx="1.3" fill="#36c5f0" />
      <rect x="6" y="1" width="2.6" height="6" rx="1.3" fill="#2eb67d" />
      <rect x="9" y="7.4" width="6" height="2.6" rx="1.3" fill="#ecb22e" />
      <rect x="7.4" y="9" width="2.6" height="6" rx="1.3" fill="#e01e5a" />
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="4" y="1" width="4" height="4.6" rx="2" fill="#f24e1e" />
      <rect x="8" y="1" width="4" height="4.6" rx="2" fill="#ff7262" />
      <rect x="4" y="5.6" width="4" height="4.6" rx="2" fill="#a259ff" />
      <circle cx="10" cy="7.9" r="2" fill="#1abcfe" />
      <rect x="4" y="10.2" width="4" height="4.6" rx="2" fill="#0acf83" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 .8a7.2 7.2 0 0 0-2.3 14c.4.1.5-.2.5-.4v-1.3c-2 .4-2.4-.9-2.4-.9-.3-.8-.8-1-.8-1-.7-.5 0-.5 0-.5.7 0 1.1.8 1.1.8.6 1.1 1.7.8 2.1.6 0-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.8.3-1.4.7-1.9 0-.2-.3-.9.1-1.9 0 0 .6-.2 2 .7a7 7 0 0 1 3.6 0c1.4-.9 2-.7 2-.7.4 1 .1 1.7.1 1.9.5.5.7 1.1.7 1.9 0 2.8-1.7 3.4-3.3 3.6.3.2.5.7.5 1.3v2c0 .2.1.5.5.4A7.2 7.2 0 0 0 8 .8Z" />
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="#635bff" />
      <path d="M10.2 5.6c-.6-.3-1.3-.5-2-.5-.8 0-1.3.3-1.3.8 0 1.3 3.6.7 3.6 3.1 0 1.3-1.1 2-2.6 2-.8 0-1.6-.2-2.3-.6" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
};

const defaultAgents: LaneAgent[] = [
  { id: "researcher", name: "Researcher", model: "Opus 5.5", avatar: logo.claude },
  { id: "writer", name: "Writer", model: "Sonnet 5.5", avatar: logo.claude },
  { id: "reviewer", name: "Reviewer", model: "GPT-6 Sol", avatar: logo.openai },
  { id: "ops", name: "Ops", model: "Gemini 3.8 Flash", avatar: logo.gemini },
];

const demoTasks = (t: number): LaneTask[] => [
  { id: "t1", agentId: "researcher", title: "Competitor pricing", status: "done", start: t - 31.6 * MIN, end: t - 21.5 * MIN, handoffTo: "t3", summary: "Pricing pages of 6 competitors, compared per seat." },
  { id: "t2", agentId: "researcher", title: "Customer interviews", status: "running", start: t - 14 * MIN, tools: ["notion", "slack"], summary: "Tagging quotes from 18 interviews." },
  { id: "t3", agentId: "writer", title: "Draft pricing page", status: "done", start: t - 20 * MIN, end: t - 1.6 * MIN, handoffTo: "t5", tools: ["figma", "notion"], summary: "Three tiers, copy and layout in Figma." },
  { id: "t4", agentId: "reviewer", title: "PR #482 billing", status: "done", start: t - 31.2 * MIN, end: t - 24 * MIN, summary: "Approved with two comments." },
  { id: "t5", agentId: "reviewer", title: "Review pricing copy", status: "running", start: t - 0.8 * MIN, tools: ["figma"], summary: "Checking tone and numbers." },
  { id: "t6", agentId: "ops", title: "Sync CRM", status: "failed", start: t - 30.6 * MIN, end: t - 26 * MIN, summary: "HubSpot token expired." },
  { id: "t7", agentId: "ops", title: "Rotate API keys", status: "waiting", start: t - 17 * MIN, tools: ["stripe", "github"], ask: "Rotate the live Stripe key and update the GitHub secret?" },
];

const ago = (ms: number) => {
  const m = Math.round(ms / MIN);
  return m <= 0 ? "just now" : `${m} min ago`;
};

export function AgentLanes({
  agents = defaultAgents,
  tasks: tasksProp,
  span = 30 * MIN,
  now: nowProp,
  title = "Agents",
  className = "",
  onApprove,
  onReject,
  onOpen,
}: AgentLanesProps) {
  const [mountedAt] = React.useState(() => Date.now());
  const [clock, setClock] = React.useState(mountedAt);
  React.useEffect(() => {
    if (nowProp !== undefined) return;
    const id = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [nowProp]);
  const now = nowProp ?? clock;

  const [local, setLocal] = React.useState<LaneTask[]>(() => tasksProp ?? demoTasks(mountedAt));
  React.useEffect(() => {
    if (tasksProp) setLocal(tasksProp);
  }, [tasksProp]);
  const tasks = local;

  const [openId, setOpenId] = React.useState<string | null>(null);
  const blockRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const from = now - span;
  const x = (t: number) => ((t - from) / span) * 100;
  const endOf = (t: LaneTask) => (t.end === undefined || t.status === "running" || t.status === "waiting" ? now : t.end);

  const running = tasks.filter((t) => t.status === "running").length;
  const waiting = tasks.filter((t) => t.status === "waiting").length;
  const laneIndex = (id: string) => agents.findIndex((a) => a.id === id);
  const ticks = [25, 20, 15, 10, 5].map((m) => m * MIN).filter((m) => m < span);
  const ROW = 50;

  const decide = (task: LaneTask, ok: boolean) => {
    if (ok) onApprove?.(task);
    else onReject?.(task);
    if (!(ok ? onApprove : onReject)) {
      setLocal((ts) =>
        ts.map((t) => (t.id === task.id ? { ...t, status: ok ? "running" : "failed", end: ok ? undefined : now } : t)),
      );
    }
    setOpenId(null);
    blockRefs.current[task.id]?.focus();
  };

  const curves = tasks
    .filter((t) => t.handoffTo)
    .map((t) => {
      const to = tasks.find((n) => n.id === t.handoffTo);
      if (!to) return null;
      const a = laneIndex(t.agentId);
      const b = laneIndex(to.agentId);
      if (a < 0 || b < 0) return null;
      const x1 = x(endOf(t));
      const x2 = x(to.start);
      const y1 = a * ROW + ROW / 2;
      const y2 = b * ROW + ROW / 2;
      const live = to.status === "running";
      return { id: t.id, d: `M${x1} ${y1} C${x1 + 1.5} ${y1}, ${x2 - 1.5} ${y2}, ${x2} ${y2}`, live };
    })
    .filter(Boolean) as { id: string; d: string; live: boolean }[];

  return (
    <section className={`al ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="al-bar">
        <svg className="al-spark" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6.5 2c.4 2.6 1.9 4.1 4.5 4.5-2.6.4-4.1 1.9-4.5 4.5C6.1 8.4 4.6 6.9 2 6.5 4.6 6.1 6.1 4.6 6.5 2Z" fill="currentColor" />
          <circle cx="12.5" cy="12.5" r="1.2" fill="currentColor" opacity=".6" />
        </svg>
        <strong>{title}</strong>
        <span className="al-stat"><i className="al-dot run" />{running} running</span>
        {waiting > 0 && (
          <span className="al-stat warn"><i className="al-dot warn" />{waiting} needs you</span>
        )}
        <span className="al-span">Last {Math.round(span / MIN)}m</span>
      </header>

      <div className="al-grid">
        <div className="al-names">
          {agents.map((a) => {
            const mine = tasks.filter((t) => t.agentId === a.id);
            const needs = mine.some((t) => t.status === "waiting");
            const busy = mine.some((t) => t.status === "running");
            return (
              <div className="al-agent" key={a.id}>
                <span className="al-avatar">
                  {a.avatar ?? a.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <span className="al-who">
                  <span className="al-name">
                    {a.name}
                    {needs ? <span className="al-tag warn">Needs you</span> : !busy ? <span className="al-tag">Idle</span> : null}
                  </span>
                  {a.model && <span className="al-model">{a.model}</span>}
                </span>
              </div>
            );
          })}
        </div>

        <div className="al-track">
          <div className="al-ticks" aria-hidden="true">
            {ticks.map((m) => (
              <span key={m} style={{ left: `${100 - (m / span) * 100}%` }}>−{Math.round(m / MIN)}m</span>
            ))}
            <span className="al-now">now</span>
          </div>
          <div className="al-lanes" style={{ height: agents.length * ROW }}>
            {ticks.map((m) => (
              <i key={m} className="al-vline" style={{ left: `${100 - (m / span) * 100}%` }} />
            ))}
            <svg className="al-curves" viewBox={`0 0 100 ${agents.length * ROW}`} preserveAspectRatio="none" aria-hidden="true">
              {curves.map((c) => (
                <path key={c.id} d={c.d} className={c.live ? "live" : ""} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {agents.map((a, i) => (
              <ul className="al-lane" key={a.id} aria-label={a.name} style={{ top: i * ROW, height: ROW }}>
                {tasks
                  .filter((t) => t.agentId === a.id && endOf(t) > from)
                  .map((t) => {
                    const left = x(t.start);
                    const right = x(endOf(t));
                    const open = openId === t.id;
                    return (
                      <li key={t.id} className="al-li" style={{ left: `${left}%`, width: `${Math.max(1.4, right - left)}%` }}>
                        <button
                          type="button"
                          ref={(el) => {
                            blockRefs.current[t.id] = el;
                          }}
                          className={`al-block ${t.status} ${left < 0 ? "clip" : ""}`}
                          aria-label={`${a.name}: ${t.title}, ${t.status === "waiting" ? "needs you" : t.status}, started ${ago(now - t.start)}`}
                          aria-expanded={t.status === "waiting" ? open : undefined}
                          onClick={() => setOpenId(open ? null : t.id)}
                        >
                          {t.tools?.map((tool) => (
                            <span key={tool} className="al-tool">{toolIcon[tool]}</span>
                          ))}
                          <span className="al-title">{t.title}</span>
                          {t.status === "waiting" && (
                            <span className="al-flag">
                              <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5 11 10.5H1Z" fill="currentColor" /></svg>
                              Needs you
                            </span>
                          )}
                        </button>
                        {open && (
                          <div
                            className={`al-pop ${i >= agents.length - 2 ? "up" : ""}`}
                            role={t.status === "waiting" ? "dialog" : "tooltip"}
                            aria-label={t.title}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setOpenId(null);
                                blockRefs.current[t.id]?.focus();
                              }
                            }}
                          >
                            <strong>{t.title}</strong>
                            <p>{t.status === "waiting" ? t.ask ?? "Approve this step?" : t.summary ?? t.status}</p>
                            {t.status === "waiting" ? (
                              <div className="al-pop-actions">
                                <button type="button" className="al-btn" onClick={() => decide(t, false)}>Reject</button>
                                <button type="button" className="al-btn primary" autoFocus onClick={() => decide(t, true)}>Approve</button>
                              </div>
                            ) : (
                              onOpen && (
                                <button type="button" className="al-link" onClick={() => onOpen(t)}>Open</button>
                              )
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <p className="al-sr" aria-live="polite">{waiting} task{waiting === 1 ? "" : "s"} need you</p>
    </section>
  );
}

const css = `
.al{--al-bg:#fff;--al-fg:#18181b;--al-muted:#71717a;--al-faint:#a1a1aa;--al-line:#ececef;--al-chip:#f0f0f2;--al-done:#efefef;--al-blue:#3b82f6;--al-blue-bg:#e3effd;--al-blue-fg:#4a8fe0;--al-warn:#d9480f;--al-warn-bg:#fdebd6;--al-red-bg:#fde4e4;--al-red:#e5484d;width:100%;max-width:760px;background:var(--al-bg);color:var(--al-fg);border:1px solid var(--al-line);border-radius:12px;box-shadow:0 1px 3px #0000000d;font:400 13px/1.4 Inter,system-ui,sans-serif;position:relative}
:where(.dark,[data-theme=dark]) .al{--al-bg:#1b1b1e;--al-fg:#ececef;--al-muted:#a1a1aa;--al-faint:#71717a;--al-line:#2e2e33;--al-chip:#2a2a2f;--al-done:#2a2a2e;--al-blue-bg:#1d2b40;--al-blue-fg:#7fb0f5;--al-warn:#f0883e;--al-warn-bg:#3a2717;--al-red-bg:#3a1e20;color-scheme:dark}
.al *{box-sizing:border-box}.al button{font:inherit;color:inherit;cursor:pointer}
.al-bar{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--al-line)}
.al-spark{width:16px;height:16px;color:var(--al-blue);margin-right:2px}
.al-bar strong{font-size:14px;font-weight:500}
.al-stat{display:inline-flex;align-items:center;gap:6px;color:var(--al-muted);font-size:13px;margin-left:2px}.al-stat.warn{color:var(--al-warn)}
.al-dot{width:6px;height:6px;border-radius:50%;background:var(--al-blue)}.al-dot.warn{background:var(--al-warn)}
.al-dot.run{animation:al-pulse 1.8s ease-in-out infinite}
.al-span{margin-left:auto;padding:2px 9px;border-radius:6px;background:var(--al-chip);font-size:12px;color:var(--al-fg)}
.al-grid{display:grid;grid-template-columns:176px minmax(0,1fr);padding:8px 16px 12px}
.al-names{padding-top:26px}
.al-agent{display:flex;align-items:center;gap:10px;height:50px}
.al-avatar{display:grid;place-items:center;width:26px;height:26px;flex:none;border-radius:7px;background:#fff;border:1px solid var(--al-line);box-shadow:0 1px 2px #0000000f;color:#111;font-size:11px;font-weight:600}
.al-avatar svg{width:15px;height:15px}
.al-who{display:flex;flex-direction:column;min-width:0}
.al-name{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:450;white-space:nowrap}
.al-model{color:var(--al-muted);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.al-tag{padding:0 5px;border-radius:4px;background:var(--al-chip);color:var(--al-muted);font-size:11px;line-height:17px;font-weight:400}
.al-tag.warn{background:var(--al-warn-bg);color:var(--al-warn)}
.al-track{position:relative;min-width:0}
.al-ticks{position:relative;height:26px;font-size:11px;color:var(--al-faint)}
.al-ticks span{position:absolute;top:4px;transform:translateX(-50%);white-space:nowrap}
.al-ticks .al-now{right:0;left:auto;transform:none;top:2px;padding:0 5px;border-radius:4px;background:var(--al-blue-bg);color:var(--al-blue);font-weight:500;line-height:16px}
.al-lanes{position:relative;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 22px);mask-image:linear-gradient(90deg,transparent,#000 22px)}
.al-vline{position:absolute;top:0;bottom:0;border-left:1px dashed var(--al-line)}
.al-lane{position:absolute;left:0;right:0;margin:0;padding:0;list-style:none;border-bottom:1px solid var(--al-line)}
.al-lane:first-of-type{border-bottom-color:transparent}
.al-li{position:absolute;top:10px;height:30px;transition:left 1s linear,width 1s linear}
.al-block{display:flex;align-items:center;gap:6px;width:100%;height:100%;padding:0 8px;border:0;border-radius:6px;background:var(--al-done);color:var(--al-muted);font-size:13px;text-align:left;overflow:hidden;white-space:nowrap;transition:filter .15s}
.al-block:hover{filter:brightness(.97)}
.al-block.running{background:linear-gradient(90deg,color-mix(in srgb,var(--al-blue-bg) 60%,var(--al-bg)),var(--al-blue-bg));color:var(--al-blue-fg);box-shadow:inset -2px 0 0 var(--al-blue);background-size:200% 100%;animation:al-shimmer 2.4s linear infinite}
.al-block.waiting{background:var(--al-warn-bg);color:var(--al-warn)}
.al-block.failed{background:var(--al-red-bg);color:var(--al-red)}
.al-title{overflow:hidden;text-overflow:ellipsis;flex:0 1 auto}
.al-tool{display:grid;place-items:center;width:14px;height:14px;flex:none;color:var(--al-fg)}.al-tool svg{width:13px;height:13px}
.al-flag{display:inline-flex;align-items:center;gap:5px;margin-left:auto;margin-right:-4px;padding:0 7px;height:22px;border-radius:5px;background:var(--al-bg);font-size:12px;color:var(--al-warn);box-shadow:0 1px 2px #0000000f}
.al-flag svg{width:10px;height:10px;animation:al-pulse 1.6s ease-in-out infinite}
.al-curves{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.al-curves path{fill:none;stroke:var(--al-faint);stroke-width:1;stroke-dasharray:3 3}
.al-curves path.live{stroke:var(--al-blue);animation:al-flow 1s linear infinite}
.al-pop{position:absolute;z-index:3;top:36px;right:0;width:250px;padding:12px;border:1px solid var(--al-line);border-radius:10px;background:var(--al-bg);box-shadow:0 8px 28px #0000001f;color:var(--al-fg);white-space:normal;animation:al-in .16s ease-out}
.al-pop.up{top:auto;bottom:36px}
.al-pop strong{font-weight:500}.al-pop p{margin:4px 0 10px;color:var(--al-muted)}
.al-pop-actions{display:flex;justify-content:flex-end;gap:6px}
.al-btn{height:28px;padding:0 11px;border-radius:7px;border:1px solid var(--al-line);background:var(--al-bg);font-weight:500}
.al-btn.primary{background:var(--al-fg);color:var(--al-bg)!important;border-color:var(--al-fg)}
.al-link{border:0;background:none;padding:0;color:var(--al-blue)!important}
.al-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0}
.al :focus-visible{outline:2px solid var(--al-blue);outline-offset:2px}
.al-lanes:has(:focus-visible){-webkit-mask-image:none;mask-image:none}
@keyframes al-pulse{50%{opacity:.35}}
@keyframes al-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}
@keyframes al-flow{to{stroke-dashoffset:-6}}
@keyframes al-in{from{opacity:0;transform:translateY(-3px)}}
@media(max-width:520px){.al-grid{grid-template-columns:40px minmax(0,1fr);padding:8px 10px 10px}.al-who{display:none}.al-bar{flex-wrap:wrap}}
@media(prefers-reduced-motion:reduce){.al *{animation:none!important;transition:none!important}}
`;

export default AgentLanes;
