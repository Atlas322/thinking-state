"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type FleetStatus = "queued" | "running" | "waiting" | "done" | "failed" | "stopped";
export type FleetTool = "github" | "notion" | "slack" | "figma" | "linear" | "zendesk";
export type FleetStep = { title: string; status?: FleetStatus; tool?: FleetTool; took?: string };

export type FleetAgent = {
  id: string;
  name: string;
  task: string;
  model?: string;
  avatar?: "anthropic" | "openai" | "gemini" | React.ReactNode;
  tools?: FleetTool[];
  status: FleetStatus;
  steps?: FleetStep[];
  cost?: number;
  /** Elapsed seconds. */
  took?: number;
  ask?: string;
  error?: string;
  children?: FleetAgent[];
};

export type AgentFleetProps = {
  agents?: FleetAgent[];
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (id: string | null) => void;
  onResolve?: (agent: FleetAgent, action: "approve" | "reject" | "retry" | "dismiss") => void;
  onSelect?: (agent: FleetAgent) => void;
  title?: string;
  className?: string;
};

const steps3: FleetStep[] = [{ title: "a" }, { title: "b" }, { title: "c" }];

const defaultAgents: FleetAgent[] = [
  {
    id: "launch", name: "Launch lead", model: "Opus 5.5", avatar: "anthropic", tools: ["slack", "notion", "github"],
    status: "running", task: "Launch the new pricing page by Friday", took: 850,
    children: [
      { id: "l1", name: "Copy", model: "Sonnet 5.5", avatar: "anthropic", tools: ["notion"], status: "running", task: "Write the pricing page copy", cost: 0.42, took: 380, steps: steps3 },
      { id: "l2", name: "Design", model: "Opus 5.5", avatar: "anthropic", tools: ["figma"], status: "waiting", task: "Pick the hero layout", cost: 0.88, took: 420, ask: "Which hero layout?" },
      { id: "l3", name: "Build", model: "Sonnet 5.5", avatar: "anthropic", tools: ["github"], status: "running", task: "Ship the page behind a flag", cost: 0.75, took: 600 },
    ],
  },
  {
    id: "support", name: "Support lead", model: "Sonnet 5.5", avatar: "anthropic", tools: ["zendesk", "slack"],
    status: "running", task: "Answer the 48 open tickets in the queue", took: 1570,
    children: [
      { id: "s1", name: "Billing", model: "Sonnet 5.5", avatar: "anthropic", status: "running", task: "Billing tickets", cost: 0.3, took: 600 },
      { id: "s2", name: "Bugs", model: "Sonnet 5.5", avatar: "anthropic", status: "running", task: "Bug reports", cost: 0.33, took: 700 },
      { id: "s3", name: "Access", model: "Sonnet 5.5", avatar: "anthropic", status: "done", task: "Access requests", cost: 0.2, took: 300 },
      { id: "s4", name: "Refunds", model: "Sonnet 5.5", avatar: "anthropic", status: "done", task: "Refunds", cost: 0.3, took: 400 },
    ],
  },
  {
    id: "release", name: "Release manager", model: "GPT-6 Sol", avatar: "openai", tools: ["github", "slack"],
    status: "running", task: "Ship version 2.4 to the App Store", cost: 0.33, took: 2290,
    children: [
      { id: "r1", name: "Changelog", model: "Sonnet 5.5", avatar: "anthropic", tools: ["github", "notion"], status: "done", task: "Write the release notes from 42 commits", cost: 0.09, took: 240, steps: steps3 },
      { id: "r2", name: "iOS build", model: "GPT-6 Mini", avatar: "openai", tools: ["github"], status: "failed", task: "Sign and upload the iOS build", cost: 0.06, took: 180, error: "Signing certificate expired" },
      { id: "r3", name: "Screenshots", model: "Gemini 3.8 Flash", avatar: "gemini", tools: ["figma"], status: "done", task: "Render the store screenshots in 8 languages", cost: 0.15, took: 480, steps: steps3 },
    ],
  },
  {
    id: "market", name: "Market analyst", model: "Gemini 3.8 Pro", avatar: "gemini", tools: ["notion", "slack"],
    status: "done", task: "Write the weekly competitor report", took: 2520,
    children: [
      { id: "m1", name: "Collect", status: "done", task: "Collect", cost: 0.3, avatar: "gemini" },
      { id: "m2", name: "Compare", status: "done", task: "Compare", cost: 0.3, avatar: "gemini" },
      { id: "m3", name: "Write", status: "done", task: "Write", cost: 0.22, avatar: "gemini" },
      { id: "m4", name: "Chart", status: "done", task: "Chart", cost: 0, avatar: "gemini" },
    ],
  },
];

const avatars: Record<string, React.ReactNode> = {
  anthropic: (
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2M4.6 2.2l6.8 11.6M11.4 2.2 4.6 13.8M2.2 4.6l11.6 6.8M13.8 4.6 2.2 11.4" stroke="#d97757" strokeWidth="1.1" strokeLinecap="round" /></svg>
  ),
  openai: (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="8" cy="8" r="5.6" /><path d="M8 2.4v4.2l3.6 2.1M13.6 8l-3.6 2.1-3.6-2.1M8 13.6V9.4L4.4 7.3M2.4 8l3.6-2.1L9.6 8" /></svg>
  ),
  gemini: (
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1c.6 3.6 3.4 6.4 7 7-3.6.6-6.4 3.4-7 7-.6-3.6-3.4-6.4-7-7 3.6-.6 6.4-3.4 7-7Z" fill="#3b7bf6" /></svg>
  ),
};

const toolMarks: Record<FleetTool, React.ReactNode> = {
  github: <svg viewBox="0 0 16 16"><path d="M8 1.3a6.7 6.7 0 0 0-2.1 13c.3 0 .5-.2.5-.4v-1.3c-1.9.4-2.3-.8-2.3-.8-.3-.8-.8-1-.8-1-.6-.4 0-.4 0-.4.7 0 1 .7 1 .7.6 1 1.6.7 2 .5 0-.4.2-.7.4-.9-1.5-.2-3-.7-3-3.3 0-.7.2-1.3.7-1.8-.1-.2-.3-.9 0-1.8 0 0 .6-.2 1.9.7a6.4 6.4 0 0 1 3.4 0c1.3-.9 1.8-.7 1.8-.7.4.9.2 1.6.1 1.8.4.5.7 1.1.7 1.8 0 2.6-1.6 3.1-3 3.3.2.2.4.6.4 1.2v1.8c0 .2.2.4.5.4A6.7 6.7 0 0 0 8 1.3Z" fill="currentColor" /></svg>,
  notion: <svg viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2" fill="#fff" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 11V5h1l3.5 6h.5V5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>,
  slack: <svg viewBox="0 0 16 16"><rect x="1" y="6" width="7" height="2.6" rx="1.3" fill="#36c5f0" /><rect x="8" y="1" width="2.6" height="7" rx="1.3" fill="#2eb67d" /><rect x="8" y="8" width="7" height="2.6" rx="1.3" fill="#ecb22e" /><rect x="5.4" y="8" width="2.6" height="7" rx="1.3" fill="#e01e5a" /></svg>,
  figma: <svg viewBox="0 0 16 16"><circle cx="10" cy="8" r="2.3" fill="#1abcfe" /><path d="M5.7 1.5h2.3v4.6H5.7a2.3 2.3 0 0 1 0-4.6Z" fill="#f24e1e" /><path d="M8 1.5h2.3a2.3 2.3 0 0 1 0 4.6H8Z" fill="#ff7262" /><path d="M5.7 5.7H8v4.6H5.7a2.3 2.3 0 0 1 0-4.6Z" fill="#a259ff" /><path d="M5.7 10.3H8v2.3a2.3 2.3 0 1 1-2.3-2.3Z" fill="#0acf83" /></svg>,
  linear: <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#5e6ad2" /></svg>,
  zendesk: <svg viewBox="0 0 16 16"><path d="M2 3h6L2 12Zm6 0a3 3 0 0 1-6 0M14 13H8l6-9Zm-6 0a3 3 0 0 1 6 0" fill="#e2593e" /></svg>,
};

const fmtTime = (s = 0) => `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, "0")}s`;
const fmtCost = (n: number) => `$${n.toFixed(2)}`;
const branchCost = (a: FleetAgent): number => (a.cost ?? 0) + (a.children ?? []).reduce((n, c) => n + branchCost(c), 0);

function Pill({ status }: { status: FleetStatus }) {
  const label = { queued: "Queued", running: "Running", waiting: "Needs you", done: "Done", failed: "Failed", stopped: "Stopped" }[status];
  return (
    <span className={`af-pill af-${status}`}>
      {status === "running" && <span className="af-spin" aria-hidden="true" />}
      {status === "done" && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>}
      {status === "failed" && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5 14 13H2Z M8 6.5v3 M8 11.3v.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" /></svg>}
      {label}
    </span>
  );
}

function Head({ a }: { a: FleetAgent }) {
  const av = typeof a.avatar === "string" || !a.avatar ? avatars[(a.avatar as string) ?? "anthropic"] : a.avatar;
  return (
    <div className="af-head">
      <span className="af-av">{av}</span>
      <span className="af-name">
        <strong>{a.name}</strong>
        {a.model && <small>{a.model}</small>}
      </span>
      <Pill status={a.status} />
    </div>
  );
}

function Task({ a }: { a: FleetAgent }) {
  return (
    <div className="af-task">
      {a.tools && a.tools.length > 0 && (
        <span className="af-tools">{a.tools.map((t) => <span key={t} className="af-tool">{toolMarks[t]}</span>)}</span>
      )}
      <span className="af-task-t">{a.task}</span>
    </div>
  );
}

function summary(a: FleetAgent) {
  const c = a.children ?? [];
  const waiting = c.filter((x) => x.status === "waiting").length;
  const failed = c.filter((x) => x.status === "failed").length;
  const running = c.filter((x) => x.status === "running").length;
  if (waiting) return { kind: "wait", text: `${waiting} needs you` };
  if (failed) return { kind: "fail", text: `${failed} failed` };
  if (running) return { kind: "run", text: `${running}/${c.length} running` };
  return { kind: "done", text: `All ${c.filter((x) => x.cost).length} done` };
}

export function AgentFleet({
  agents = defaultAgents,
  open,
  defaultOpen,
  onOpenChange,
  onResolve,
  onSelect,
  title = "Fleet",
  className = "",
}: AgentFleetProps) {
  const [inner, setInner] = React.useState<string | null>(defaultOpen === undefined ? agents.find((a) => a.id === "release")?.id ?? agents[0]?.id ?? null : defaultOpen);
  const openId = open !== undefined ? open : inner;
  const setOpen = (id: string | null) => {
    if (open === undefined) setInner(id);
    onOpenChange?.(id);
  };
  const opened = agents.find((a) => a.id === openId) ?? null;
  const subs = agents.reduce((n, a) => n + (a.children?.length ?? 0), 0);
  const all = agents.flatMap((a) => [a, ...(a.children ?? [])]);
  const running = all.filter((a) => a.status === "running").length;
  const needs = all.filter((a) => a.status === "waiting").length;
  const total = agents.reduce((n, a) => n + branchCost(a), 0);
  const kids = opened?.children ?? [];

  return (
    <section className={`af ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="af-bar">
        <span className="af-title">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 1.5 7.2 5 10.5 6 7.2 7 6 10.5 4.8 7 1.5 6 4.8 5ZM12 9l.7 1.8 1.8.7-1.8.7L12 14l-.7-1.8-1.8-.7 1.8-.7Z" fill="currentColor" /></svg>
          {title}
        </span>
        <span className="af-stats">
          <span>{agents.length} agents / {subs} sub-agents</span>
          <span>{running} running</span>
          {needs > 0 && <span>{needs} needs you</span>}
          <strong>{fmtCost(total)}</strong>
        </span>
      </header>
      <div className="af-grid">
        <div className="af-col">
          {agents.map((a) => {
            const s = summary(a);
            const isOpen = a.id === openId;
            return (
              <button
                key={a.id}
                type="button"
                className={`af-card${isOpen ? " is-open" : opened ? " is-dim" : ""}`}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : a.id)}
              >
                <Head a={a} />
                <Task a={a} />
                <div className="af-foot">
                  <span className={`af-sum af-sum-${s.kind}`}>
                    <span className="af-dot" aria-hidden="true" />
                    {s.text}
                  </span>
                  <span className="af-meta"><strong>{fmtCost(branchCost(a))}</strong> · {fmtTime(a.took)}</span>
                </div>
              </button>
            );
          })}
        </div>
        {opened && kids.length > 0 && (
          <div className="af-tree" style={{ marginTop: Math.max(0, agents.indexOf(opened) * 96 + 44 - (kids.length * 96 - 8) / 2) }}>
            <div className="af-kids">
              {kids.map((k) => (
                <div
                  key={k.id}
                  className={`af-card af-kid af-k-${k.status}`}
                  role={onSelect ? "button" : undefined}
                  tabIndex={onSelect ? 0 : undefined}
                  onClick={() => onSelect?.(k)}
                >
                  <Head a={k} />
                  <Task a={k} />
                  <div className="af-foot">
                    <span className="af-meta"><strong>{fmtCost(k.cost ?? 0)}</strong> · {fmtTime(k.took)}</span>
                    {k.status === "failed" || k.status === "waiting" ? (
                      <button
                        type="button"
                        className="af-resolve"
                        onClick={(e) => { e.stopPropagation(); onResolve?.(k, k.status === "failed" ? "retry" : "approve"); }}
                      >
                        {k.status === "failed" ? "Resolve" : "Answer"}
                      </button>
                    ) : k.steps?.length ? (
                      <span className="af-tasks">{k.steps.length} tasks</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const css = `
.af{--af-bg:#fff;--af-fg:#18181b;--af-muted:#71717a;--af-faint:#a1a1aa;--af-line:#ececef;--af-chip:#f4f4f5;--af-blue:#3b82f6;--af-blue-bg:#eaf2ff;--af-green:#16a34a;--af-green-bg:#e9f8ee;--af-red:#e5484d;--af-red-bg:#fdecec;--af-amber:#d97706;--af-amber-bg:#fff4e0;--af-conn:#93b8f5;width:100%;max-width:590px;color:var(--af-fg);font:400 13px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .af{--af-bg:#1b1b1e;--af-fg:#ececef;--af-muted:#a1a1aa;--af-faint:#71717a;--af-line:#2e2e33;--af-chip:#2a2a2f;--af-blue-bg:#1d2a44;--af-green-bg:#16301f;--af-red-bg:#3a1c1e;--af-amber-bg:#3a2a12;--af-conn:#3f5f99;color-scheme:dark}
.af *{box-sizing:border-box}.af button{font:inherit;color:inherit;cursor:pointer}
.af-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 4px 12px}
.af-title{display:flex;align-items:center;gap:8px;font-weight:500;font-size:14px}.af-title svg{width:14px;height:14px;color:var(--af-blue)}
.af-stats{display:flex;gap:10px;align-items:center;color:var(--af-muted);font-size:12.5px}.af-stats strong{color:var(--af-fg);font-weight:500;margin-left:10px}
.af-grid{display:flex;align-items:flex-start}
.af-col{display:flex;flex-direction:column;gap:8px;width:290px;flex:none}
.af-card{display:block;width:100%;text-align:left;background:var(--af-bg);border:1px solid var(--af-line);border-radius:8px;padding:9px 10px 8px;box-shadow:0 1px 2px #0000000a;transition:opacity .2s,border-color .15s}
.af-card:hover{border-color:color-mix(in srgb,var(--af-fg) 18%,transparent)}
.af-card.is-dim{opacity:.45}.af-card.is-dim:hover{opacity:.8}
.af-head{display:flex;align-items:flex-start;gap:8px}
.af-av{display:grid;place-items:center;width:22px;height:22px;flex:none;margin-top:3px;color:var(--af-fg)}.af-av svg{width:15px;height:15px}
.af-name{display:flex;flex-direction:column;min-width:0;flex:1}.af-name strong{font-weight:500;font-size:13px}.af-name small{font-size:11px;color:var(--af-faint)}
.af-pill{display:inline-flex;align-items:center;gap:4px;height:18px;padding:0 6px;border-radius:4px;font-size:11px;font-weight:500;flex:none}
.af-pill svg{width:10px;height:10px}
.af-running{color:var(--af-blue);background:var(--af-blue-bg)}.af-done{color:var(--af-green);background:var(--af-green-bg)}.af-failed{color:var(--af-red);background:var(--af-red-bg)}.af-waiting{color:var(--af-amber);background:var(--af-amber-bg)}.af-queued,.af-stopped{color:var(--af-muted);background:var(--af-chip)}
.af-spin{width:8px;height:8px;border-radius:50%;border:1.5px solid currentColor;border-right-color:transparent;animation:af-spin 1s linear infinite}
.af-task{display:flex;align-items:center;gap:7px;margin:5px 0 7px;min-width:0;font-size:12.5px}
.af-tools{display:flex;flex:none}.af-tool{display:grid;place-items:center;width:13px;height:13px;margin-right:-2px}.af-tool svg{width:12px;height:12px;color:var(--af-fg)}
.af-task-t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--af-fg)}
.af-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11.5px;color:var(--af-muted);min-height:20px}
.af-sum{display:flex;align-items:center;gap:6px}
.af-dot{width:9px;height:9px;border-radius:50%;border:1.5px solid var(--af-faint)}
.af-sum-fail .af-dot{background:var(--af-faint);border-color:var(--af-faint)}.af-sum-done .af-dot{background:var(--af-faint)}
.af-meta strong{color:var(--af-fg);font-weight:500}
.af-tasks{color:var(--af-muted)}
.af-resolve{height:20px;padding:0 8px;border:1px solid var(--af-line);border-radius:5px;background:var(--af-bg);font-size:11px!important;font-weight:500}
.af-resolve:hover{background:var(--af-chip)}
.af-tree{position:relative;flex:none;width:294px;padding-left:54px;animation:af-in .25s both}
.af-kids{position:relative;display:flex;flex-direction:column;gap:8px}
.af-kids::before{content:"";position:absolute;left:-26px;top:22px;bottom:22px;border-left:1.5px solid var(--af-conn)}
.af-kid{position:relative}
.af-kid::before{content:"";position:absolute;left:-27px;top:21px;width:27px;border-top:1.5px solid var(--af-conn)}
.af-tree::before{content:"";position:absolute;left:0;top:var(--af-y,50%);width:28px;border-top:1.5px solid var(--af-conn)}
.af-tree::after{content:"";position:absolute;left:-4px;top:calc(50% - 4px);width:7px;height:7px;border-radius:50%;background:var(--af-bg);border:1.5px solid var(--af-conn)}
.af-kid .af-task{margin:5px 0 7px}
.af-kid.af-k-queued,.af-kid.af-k-stopped{opacity:.55}
.af :focus-visible{outline:2px solid var(--af-blue);outline-offset:2px}
@keyframes af-spin{to{transform:rotate(360deg)}}
@keyframes af-in{from{opacity:0;transform:translateX(-6px)}}
@media(max-width:640px){.af-grid{flex-direction:column}.af-col{width:100%}.af-tree{margin:12px 0 0;padding-left:28px;width:100%}.af-tree::before,.af-tree::after{display:none}.af-stats span:nth-child(2),.af-stats span:nth-child(3){display:none}}
@media(prefers-reduced-motion:reduce){.af *,.af *::before{animation:none!important;transition:none!important}}
`;

export default AgentFleet;
