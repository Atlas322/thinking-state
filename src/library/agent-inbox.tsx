"use client";

import * as React from "react";

/** Independently implemented from the public preview. No affectUI Pro source. */
export type AgentTask = {
  id: string;
  title: string;
  description?: string;
  agent: string;
  status: "waiting" | "running" | "done" | "failed";
  /** Unix timestamp in milliseconds; running and waiting clocks tick from it. */
  startedAt?: number;
  /** Finished duration in milliseconds. */
  elapsed?: number;
  /** @deprecated Use startedAt or elapsed. Retained for existing consumers. */
  elapsedSeconds?: number;
  sources?: number;
  tools?: number;
  steps?: { label: string; time?: string }[];
};
export type AgentInboxView = "board" | "list";
export type AgentInboxProps = {
  tasks?: AgentTask[];
  title?: string;
  action?: { label: string; onClick: () => void };
  view?: AgentInboxView;
  defaultView?: AgentInboxView;
  onViewChange?: (view: AgentInboxView) => void;
  onApprove?: (task: AgentTask) => void;
  onReject?: (task: AgentTask) => void;
  onRetry?: (task: AgentTask) => void;
  onOpen?: (task: AgentTask) => void;
  className?: string;
};

const sampleTasks: AgentTask[] = [
  {
    id: "migrate",
    title: "Migrate users table",
    description:
      "Split users into accounts and profiles on Postgres 17. The dry run on staging passed.",
    agent: "Opus 5.5",
    status: "waiting",
    elapsedSeconds: 372,
    sources: 9,
    tools: 14,
    steps: [
      { label: "Wrote migration 0042_split_users", time: "4m ago" },
      { label: "Dry run on staging — no errors", time: "2m ago" },
      { label: "Wants to run it on production", time: "1m ago" },
    ],
  },
  {
    id: "crm",
    title: "Clean up CRM contacts",
    description:
      "Matched 1,312 likely duplicates, then the merge hit the API rate limit.",
    agent: "Haiku 5.5",
    status: "failed",
    elapsedSeconds: 420,
    sources: 2,
    tools: 6,
    steps: [
      { label: "Loaded 18,240 contacts", time: "9m ago" },
      { label: "Matched 1,312 likely duplicates", time: "8m ago" },
      { label: "Merge stopped — API rate limit (429)", time: "7m ago" },
    ],
  },
  {
    id: "review",
    title: "Review PR #482",
    description:
      "Billing webhooks: reading the diff and the test run, writing comments.",
    agent: "Sonnet 5.5",
    status: "running",
    elapsedSeconds: 220,
    sources: 12,
    tools: 21,
    steps: [
      { label: "Read 12 changed files", time: "2m ago" },
      { label: "Test run: 214 passed", time: "1m ago" },
      { label: "Writing review comments", time: "now" },
    ],
  },
  {
    id: "notes",
    title: "Release notes v2.4",
    description: "Grouping 23 merged pull requests into features and fixes.",
    agent: "Sonnet 5.5",
    status: "running",
    elapsedSeconds: 78,
    sources: 23,
    tools: 5,
    steps: [
      { label: "Collected 23 merged pull requests", time: "1m ago" },
      { label: "Drafting the highlights", time: "now" },
    ],
  },
  {
    id: "digest",
    title: "Weekly metrics digest",
    description:
      "Pulled numbers from three dashboards and posted the summary to #metrics.",
    agent: "Haiku 5.5",
    status: "done",
    elapsedSeconds: 252,
    sources: 3,
    tools: 8,
    steps: [
      { label: "Read three dashboards", time: "5m ago" },
      { label: "Posted the summary to #metrics", time: "4m ago" },
    ],
  },
];

function Glyph({ name, className = "" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    spark: (
      <path
        d="M8 1.5 9.8 6.2 14.5 8l-4.7 1.8L8 14.5 6.2 9.8 1.5 8l4.7-1.8Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    search: (
      <>
        <circle cx="6.5" cy="6.5" r="3.8" />
        <path d="m9.3 9.3 3.5 3.5" />
      </>
    ),
    tool: (
      <path d="m9.2 2 .1 3.2 2.3 1.6 2-1.4a4.3 4.3 0 0 1-5.7 5l-4 4-1.6-1.6 4-4A4.3 4.3 0 0 1 9.2 2Z" />
    ),
    board: (
      <>
        <rect x="2" y="3" width="4" height="10" rx="1" />
        <rect x="10" y="3" width="4" height="7" rx="1" />
      </>
    ),
    list: <path d="M3 4h10M3 8h10M3 12h10" />,
    down: <path d="m5 6 3 3 3-3" />,
    warning: (
      <>
        <path d="m8 2 6 11H2Z" />
        <path d="M8 6v3m0 2v.2" />
      </>
    ),
    error: (
      <>
        <circle cx="8" cy="8" r="5" />
        <path d="M8 5v3m0 2v.2" />
      </>
    ),
    check: <path d="m3 8 3 3 7-7" />,
    open: (
      <>
        <path d="M9 2h5v5m0-5-8 8M6 3H2v11h11v-4" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function elapsed(seconds: number) {
  seconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

function durationMs(task: AgentTask, now: number, mountedAt: number) {
  const active = task.status === "running" || task.status === "waiting";
  if (active && task.startedAt != null) return Math.max(0, now - task.startedAt);
  if (task.elapsed != null) return task.elapsed;
  return (task.elapsedSeconds ?? 0) * 1000 +
    (active && task.elapsedSeconds != null ? Math.max(0, now - mountedAt) : 0);
}

export function AgentInbox({
  tasks,
  title = "Agent inbox",
  action,
  view,
  defaultView = "board",
  onViewChange,
  onApprove,
  onReject,
  onRetry,
  onOpen,
  className = "",
}: AgentInboxProps) {
  const [overrides, setOverrides] = React.useState<
    Map<string, { source: AgentTask; task: AgentTask }>
  >(() => new Map());
  const [localView, setLocalView] = React.useState(defaultView);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [mountedAt] = React.useState(Date.now);
  const [now, setNow] = React.useState(Date.now);
  const [notice, setNotice] = React.useState("");
  const sourceRows = tasks ?? sampleTasks;
  const rows = React.useMemo(() => sourceRows.map((task) => {
      const override = overrides.get(task.id);
      // A new task object from the owner supersedes any local demonstration action.
      return override?.source === task ? override.task : task;
    }), [sourceRows, overrides]);
  const hasClock = rows.some((task) =>
    (task.status === "running" || task.status === "waiting") &&
    (task.startedAt != null || task.elapsedSeconds != null),
  );
  const mode = view ?? localView;
  const root = React.useRef<HTMLElement>(null);
  const previousRects = React.useRef(new Map<string, DOMRect>());
  const id = React.useId();
  React.useEffect(() => {
    if (!hasClock) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [hasClock]);
  React.useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const next = new Map<string, DOMRect>();
    root.current?.querySelectorAll<HTMLElement>("[data-task]").forEach((el) => {
      const key = el.dataset.task!;
      const rect = el.getBoundingClientRect();
      const old = previousRects.current.get(key);
      next.set(key, rect);
      if (old && !reduced && (old.x !== rect.x || old.y !== rect.y))
        el.animate?.(
          [
            {
              transform: `translate(${old.x - rect.x}px, ${old.y - rect.y}px)`,
            },
            { transform: "translate(0,0)" },
          ],
          { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
    });
    previousRects.current = next;
  }, [rows, mode, expanded]);
  const changeView = (next: "board" | "list") => {
    setLocalView(next);
    onViewChange?.(next);
  };
  const act = (
    task: AgentTask,
    action: "approve" | "reject" | "retry" | "open",
  ) => {
    const handler = {
      approve: onApprove,
      reject: onReject,
      retry: onRetry,
      open: onOpen,
    }[action];
    if (handler) {
      handler(task);
      return;
    }
    if (action === "open") return;
    const timestamp = Date.now();
    const source = sourceRows.find((row) => row.id === task.id)!;
    const next: AgentTask = action === "reject"
      ? { ...task, status: "failed", elapsed: durationMs(task, timestamp, mountedAt) }
      : {
          ...task,
          status: "running",
          startedAt: action === "retry"
            ? timestamp
            : task.startedAt ?? timestamp - durationMs(task, timestamp, mountedAt),
          elapsed: undefined,
          elapsedSeconds: undefined,
        };
    setNow(timestamp);
    setOverrides((old) => new Map(old).set(task.id, { source, task: next }));
    setExpanded(null);
    setNotice(
      `${task.title}: ${action === "reject" ? "rejected" : action === "retry" ? "retrying" : "approved"}.`,
    );
  };
  const groups = [
    {
      name: "Needs you",
      key: "needs",
      tasks: rows.filter(
        (t) => t.status === "waiting" || t.status === "failed",
      ),
    },
    {
      name: "Running",
      key: "running",
      tasks: rows.filter((t) => t.status === "running"),
    },
    {
      name: "Done",
      key: "done",
      tasks: rows.filter((t) => t.status === "done"),
    },
  ];
  function card(task: AgentTask) {
    const open = expanded === task.id;
    const detailId = `${id}-${task.id}`;
    const duration = elapsed(durationMs(task, now, mountedAt) / 1000);
    return (
      <article
        className={`ai-inbox-card ${task.status} ${open ? "expanded" : ""}`}
        key={task.id}
        data-task={task.id}
      >
        <button
          type="button"
          className="ai-inbox-toggle"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setExpanded(open ? null : task.id)}
        >
          <span className="ai-inbox-title">
            <Glyph name="spark" />
            <strong>{task.title}</strong>
            <Glyph name="down" className="ai-inbox-chevron" />
          </span>
          {task.description && <span className="ai-inbox-description">{task.description}</span>}
          <span className="ai-inbox-meta">
            <span className="ai-inbox-status">
              {task.status === "waiting" ? (
                <Glyph name="warning" />
              ) : task.status === "failed" ? (
                <Glyph name="error" />
              ) : (
                <i
                  className={
                    task.status === "running"
                      ? "ai-inbox-spinner"
                      : "ai-inbox-dot"
                  }
                />
              )}
              {task.status === "waiting"
                ? `Waiting for you · ${duration}`
                : task.status === "failed"
                  ? "Failed"
                  : duration}
            </span>
            {task.sources != null && <span className="ai-inbox-count" title={`${task.sources} sources`}>
              <Glyph name="search" />
              {task.sources}
            </span>}
            {task.tools != null && <span className="ai-inbox-count" title={`${task.tools} tool calls`}>
              <Glyph name="tool" />
              {task.tools}
            </span>}
          </span>
        </button>
        {open && (
          <div id={detailId} className="ai-inbox-details">
            <span className="ai-inbox-agent">
              <Glyph name="spark" />
              {task.agent}
            </span>
            {!!task.steps?.length && <ol>
              {task.steps.map((step, index) => (
                <li key={index}>
                  <span>{step.label}</span>
                  {step.time && <time>{step.time}</time>}
                </li>
              ))}
            </ol>}
            <div className="ai-inbox-actions">
              {task.status === "waiting" ? (
                <>
                  <button
                    type="button"
                    className="ai-inbox-primary"
                    onClick={() => act(task, "approve")}
                  >
                    <Glyph name="check" />
                    Approve
                  </button>
                  <button type="button" onClick={() => act(task, "reject")}>Reject</button>
                </>
              ) : task.status === "failed" ? (
                <button
                  type="button"
                  className="ai-inbox-primary"
                  onClick={() => act(task, "retry")}
                >
                  ↻ Retry
                </button>
              ) : onOpen ? (
                <button type="button" onClick={() => act(task, "open")}>
                  <Glyph name="open" />
                  Open task
                </button>
              ) : null}
            </div>
          </div>
        )}
      </article>
    );
  }
  return (
    <section
      ref={root}
      className={`ai-inbox ${className}`}
      aria-label={title}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          Array.from(root.current?.querySelectorAll<HTMLElement>("[data-task]") ?? [])
            .find((element) => element.dataset.task === expanded)
            ?.querySelector<HTMLElement>(".ai-inbox-toggle")
            ?.focus();
          setExpanded(null);
          event.stopPropagation();
        }
      }}
    >
      <style>{css}</style>
      <header className="ai-inbox-header">
        <span>
          <span>Agents</span>
          <b>/</b>
          <strong>{title}</strong>
        </span>
        <div className="ai-inbox-header-actions">
        {action && <button className="ai-inbox-header-action" type="button" onClick={action.onClick}>{action.label}</button>}
        <div
          className="ai-inbox-switch"
          role="radiogroup"
          aria-label="Inbox view"
        >
          {(["board", "list"] as const).map((v) => (
            <button
              type="button"
              key={v}
              role="radio"
              aria-checked={mode === v}
              tabIndex={mode === v ? 0 : -1}
              onClick={() => changeView(v)}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? "board" : event.key === "End" ? "list" : v === "board" ? "list" : "board";
                changeView(next);
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next === "board" ? 0 : 1]?.focus();
              }}
            >
              <Glyph name={v} />
              {v === "board" ? "Board" : "List"}
            </button>
          ))}
        </div>
        </div>
      </header>
      <div className={`ai-inbox-groups ai-inbox-${mode}`}>
        {groups.map((group) => (
          <section
            className="ai-inbox-group"
            key={group.key}
            aria-label={group.name}
          >
            <header>
              <Glyph name="spark" />
              <span>{group.name}</span>
              <small>{group.tasks.length}</small>
            </header>
            <div className="ai-inbox-cards">
              {group.tasks.map(card)}
              {!group.tasks.length && (
                <p className="ai-inbox-empty">No tasks</p>
              )}
            </div>
          </section>
        ))}
      </div>
      <footer className="ai-inbox-footer">
        <span aria-live="polite">
          {groups[0].tasks.length} need you <b>·</b> {groups[1].tasks.length}{" "}
          running
        </span>
        <span>{rows.length} tasks</span>
      </footer>
      <p className="ai-inbox-notice" role="status" aria-live="polite">
        {notice}
      </p>
    </section>
  );
}

const css = `
.ai-inbox-header-actions{display:flex;align-items:center;gap:8px}.ai-inbox-header-action{border:1px solid var(--in-line);background:var(--in-card);border-radius:7px;padding:5px 9px;white-space:nowrap}.ai-inbox-header-action:hover{border-color:var(--in-muted)}.ai-inbox-title+.ai-inbox-meta{margin-top:12px}
.ai-inbox{--in-fg:#242424;--in-muted:#888;--in-card:#fff;--in-group:#f0f0f0;--in-line:#e5e5e5;--in-blue:#788fdb;--in-green:#6abc96;--in-amber:#c69e5b;--in-red:#d66c72;color:var(--in-fg);font:400 13px/1.5 Inter,system-ui,sans-serif;width:100%;max-width:720px;container-type:inline-size;isolation:isolate;text-align:left}
:where(.dark,[data-theme=dark]) .ai-inbox{--in-fg:#e9e9e9;--in-muted:#929292;--in-card:#202022;--in-group:#19191b;--in-line:#303033;color-scheme:dark}
.ai-inbox *{box-sizing:border-box}.ai-inbox button{font:inherit;color:inherit;cursor:pointer}.ai-inbox button:focus-visible{outline:2px solid var(--in-blue);outline-offset:3px}.ai-inbox svg{width:13px;height:13px;flex:none}.ai-inbox-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 12px;padding:0 2px;min-height:32px}.ai-inbox-header>span{display:flex;align-items:center;gap:12px}.ai-inbox-header>span>span{color:var(--in-muted)}.ai-inbox-header b{font-weight:400;opacity:.35}.ai-inbox-header strong{font-weight:500}.ai-inbox-switch{display:flex;background:var(--in-group);padding:3px;border-radius:9px;border:1px solid var(--in-line)}.ai-inbox-switch button{border:0;border-radius:5px;background:none;color:var(--in-muted);padding:3px 8px;display:flex;align-items:center;gap:5px;font-size:12px}.ai-inbox-switch [aria-checked=true]{background:var(--in-card);color:var(--in-fg);box-shadow:0 1px 3px #0002}.ai-inbox-groups{display:grid;gap:9px;align-items:start}.ai-inbox-board{grid-template-columns:repeat(3,minmax(0,1fr))}.ai-inbox-list{grid-template-columns:1fr}.ai-inbox-group{min-width:0;background:var(--in-group);padding:3px;border-radius:13px}.ai-inbox-group>header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--in-muted)}.ai-inbox-group>header>svg{color:var(--in-blue);width:12px;height:12px}.ai-inbox-group>header small{font-size:10px;line-height:17px;min-width:19px;text-align:center;border-radius:4px;background:var(--in-line);letter-spacing:0}.ai-inbox-cards{display:grid;gap:4px}.ai-inbox-card{border:1px solid var(--in-line);border-radius:10px;background:var(--in-card);overflow:hidden;min-width:0;transition:border-color .18s;box-shadow:0 1px 2px #00000004}.ai-inbox-card:hover{border-color:color-mix(in srgb,var(--in-muted) 45%,var(--in-line))}.ai-inbox-toggle{width:100%;display:block;text-align:left;padding:11px 12px 12px;border:0;background:none}.ai-inbox-title{display:flex;align-items:center;gap:8px}.ai-inbox-title strong{font-size:13px;line-height:20px;font-weight:500;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ai-inbox-title>svg:first-child{width:12px;height:12px;color:var(--in-blue)}.ai-inbox-card.waiting .ai-inbox-title>svg:first-child{color:var(--in-amber)}.ai-inbox-card.failed .ai-inbox-title>svg:first-child{color:var(--in-red)}.ai-inbox-card.done .ai-inbox-title>svg:first-child{color:var(--in-green)}.ai-inbox-chevron{margin-left:auto;color:var(--in-muted);opacity:0;transition:transform .2s,opacity .2s}.ai-inbox-card:hover .ai-inbox-chevron,.ai-inbox-toggle:focus-visible .ai-inbox-chevron,.ai-inbox-card.expanded .ai-inbox-chevron{opacity:1}.ai-inbox-card.expanded .ai-inbox-chevron{transform:rotate(180deg)}.ai-inbox-description{font-size:13px;line-height:19px;color:var(--in-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:5px 0 12px}.ai-inbox-meta{display:flex;align-items:center;gap:8px;font-size:10px;color:var(--in-muted);font-variant-numeric:tabular-nums}.ai-inbox-status{display:flex;align-items:center;gap:6px;margin-right:auto;min-width:0}.ai-inbox-status>svg{width:12px;height:12px;color:var(--in-amber)}.ai-inbox-card.failed .ai-inbox-status>svg{color:var(--in-red)}.ai-inbox-count{display:flex;align-items:center;gap:4px;font-size:10px;white-space:nowrap}.ai-inbox-count svg{width:12px;height:12px;opacity:.8}.ai-inbox-count+.ai-inbox-count{padding-left:7px;border-left:1px solid var(--in-line)}.ai-inbox-spinner{width:8px;height:8px;border:1.5px solid color-mix(in srgb,var(--in-blue) 25%,transparent);border-top-color:var(--in-blue);border-radius:50%;animation:in-spin 1s linear infinite;flex:none}.ai-inbox-dot{width:6px;height:6px;border-radius:50%;background:var(--in-green);flex:none}.ai-inbox-details{padding:0 12px 12px;animation:in-open .2s ease-out}.ai-inbox-agent{display:flex;align-items:center;gap:6px;color:var(--in-muted);font-size:10px;border-top:1px solid var(--in-line);padding-top:12px}.ai-inbox-details ol{list-style:none;margin:14px 0;padding:0}.ai-inbox-details li{position:relative;display:flex;flex-direction:column;gap:2px;padding:0 0 12px 14px;margin-left:3px;border-left:1px solid var(--in-line);font-size:11px;line-height:17px}.ai-inbox-details li:last-child{border-color:transparent;padding-bottom:0}.ai-inbox-details li:before{content:'';position:absolute;left:-3px;top:6px;width:5px;height:5px;border-radius:50%;background:var(--in-muted);box-shadow:0 0 0 3px var(--in-card)}.ai-inbox-details time{font-size:10px;color:var(--in-muted)}.ai-inbox-actions{display:flex;gap:6px}.ai-inbox-actions button{display:flex;align-items:center;justify-content:center;gap:4px;border:1px solid var(--in-line);background:none;border-radius:5px;padding:5px 9px;font-size:11px;transition:opacity .15s}.ai-inbox-actions button:hover{opacity:.7}.ai-inbox-actions button.ai-inbox-primary{background:var(--in-fg);border-color:var(--in-fg);color:var(--in-card)}.ai-inbox-empty{font-size:11px;padding:14px;text-align:center;color:var(--in-muted);margin:0}.ai-inbox-footer{display:flex;justify-content:space-between;gap:12px;color:var(--in-muted);font-size:10px;padding:12px 3px 0}.ai-inbox-footer b{font-weight:400;padding:0 5px;opacity:.6}.ai-inbox-notice{font-size:11px;line-height:18px;color:var(--in-muted);margin:10px 3px 0}.ai-inbox-notice:empty{display:none}.ai-inbox-list .ai-inbox-title strong{font-size:13px}.ai-inbox-list .ai-inbox-description{-webkit-line-clamp:1;margin-left:20px}.ai-inbox-list .ai-inbox-details li{flex-direction:row;justify-content:space-between}.ai-inbox-list .ai-inbox-meta{margin-left:20px}.ai-inbox-list .ai-inbox-chevron{opacity:1}.ai-inbox-list .ai-inbox-group>header{justify-content:flex-start}.ai-inbox-list .ai-inbox-group>header small{margin-left:auto}.ai-inbox-list .ai-inbox-description{margin-bottom:8px}
@container(max-width:619px){.ai-inbox-board{grid-template-columns:1fr}.ai-inbox-switch{display:none}.ai-inbox-description{-webkit-line-clamp:2}.ai-inbox-group>header{justify-content:flex-start}.ai-inbox-group>header small{margin-left:auto}.ai-inbox-chevron{opacity:1}.ai-inbox-details li{flex-direction:row;justify-content:space-between;gap:12px}.ai-inbox-details time{white-space:nowrap}}
@keyframes in-spin{to{transform:rotate(360deg)}}@keyframes in-open{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.ai-inbox *{animation:none!important;transition:none!important}}
`;

export default AgentInbox;
