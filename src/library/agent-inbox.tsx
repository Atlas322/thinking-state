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
    title: "Хэрэглэгчийн хүснэгтийг шилжүүлэх",
    description:
      "Өгөгдлийн санд хэрэглэгчдийг данс, профайл гэж хуваана. Туршилтын орчинд хуурай ажиллуулалт амжилттай.",
    agent: "Кодын агент",
    status: "waiting",
    elapsedSeconds: 372,
    sources: 9,
    tools: 14,
    steps: [
      { label: "0042_split_users шилжүүлгийг бичсэн", time: "4 мин өмнө" },
      { label: "Туршилтын орчинд хуурай ажиллуулалт — алдаагүй", time: "2 мин өмнө" },
      { label: "Үндсэн орчинд ажиллуулах зөвшөөрөл хүсэж байна", time: "1 мин өмнө" },
    ],
  },
  {
    id: "crm",
    title: "Харилцагчийн бүртгэлийг цэгцлэх",
    description:
      "1,312 давхардал байж болзошгүйг олсон ч нэгтгэх үед API-ийн хязгаарт хүрсэн.",
    agent: "Үйл ажиллагааны агент",
    status: "failed",
    elapsedSeconds: 420,
    sources: 2,
    tools: 6,
    steps: [
      { label: "18,240 харилцагч ачаалсан", time: "9 мин өмнө" },
      { label: "1,312 давхардал байж болзошгүйг олсон", time: "8 мин өмнө" },
      { label: "Нэгтгэл зогссон — API-ийн хязгаар (429)", time: "7 мин өмнө" },
    ],
  },
  {
    id: "review",
    title: "#482 өөрчлөлтийг хянах",
    description:
      "Төлбөрийн вэбхүүк: өөрчлөлт ба тестийн үр дүнг уншиж, сэтгэгдэл бичиж байна.",
    agent: "Шалгагч агент",
    status: "running",
    elapsedSeconds: 220,
    sources: 12,
    tools: 21,
    steps: [
      { label: "Өөрчлөгдсөн 12 файл уншсан", time: "2 мин өмнө" },
      { label: "Тест: 214 амжилттай", time: "1 мин өмнө" },
      { label: "Хяналтын сэтгэгдэл бичиж байна", time: "одоо" },
    ],
  },
  {
    id: "notes",
    title: "v2.4 хувилбарын тэмдэглэл",
    description: "Нэгтгэсэн 23 өөрчлөлтийг шинэ боломж, засвар гэж бүлэглэж байна.",
    agent: "Бичигч агент",
    status: "running",
    elapsedSeconds: 78,
    sources: 23,
    tools: 5,
    steps: [
      { label: "Нэгтгэсэн 23 өөрчлөлтийг цуглуулсан", time: "1 мин өмнө" },
      { label: "Онцлох зүйлсийг ноороглож байна", time: "одоо" },
    ],
  },
  {
    id: "digest",
    title: "Долоо хоногийн үзүүлэлтийн тойм",
    description:
      "Гурван самбараас тоо татаж, товчоог багийн чатын #metrics сувагт нийтэлсэн.",
    agent: "Судлаач агент",
    status: "done",
    elapsedSeconds: 252,
    sources: 3,
    tools: 8,
    steps: [
      { label: "Гурван самбар уншсан", time: "5 мин өмнө" },
      { label: "Товчоог #metrics сувагт нийтэлсэн", time: "4 мин өмнө" },
    ],
  },
];

function Glyph({ name, className = "" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    spark: <><path d="M7 1.2c.4 2.9 1.9 4.4 4.8 4.8-2.9.4-4.4 1.9-4.8 4.8C6.6 7.9 5.1 6.4 2.2 6 5.1 5.6 6.6 4.1 7 1.2Z" fill="currentColor" stroke="none" /><circle cx="11.6" cy="11.4" r="1.1" fill="currentColor" stroke="none" opacity=".55" /></>,
    search: <><circle cx="5.2" cy="5.2" r="3.3" /><path d="m7.7 7.7 2.6 2.6" /></>,
    tool: <path d="M7.6 1.6a2.6 2.6 0 0 0-2.4 3.5L1.7 8.6a1.1 1.1 0 0 0 1.6 1.6l3.5-3.5a2.6 2.6 0 0 0 3.5-2.4l-1.5 1.1-1.5-.4-.4-1.5 1.1-1.5c-.1 0-.3-.4-.4-.4Z" />,
    board: <><rect x="1.8" y="2.2" width="3.2" height="9.6" rx="1" /><rect x="8.9" y="2.2" width="3.2" height="6.4" rx="1" /></>,
    list: <path d="M2.2 3.6h9.6M2.2 7h9.6M2.2 10.4h9.6" />,
    warning: <><path d="m8 2 6 11H2Z" /><path d="M8 6v3m0 2v.2" /></>,
    error: <><circle cx="6" cy="6" r="4.8" fill="currentColor" stroke="none" /><path d="M6 3.6v2.8M6 8.3v.1" stroke="#fff" strokeWidth="1.5" /></>,
    spinner: <><circle cx="6" cy="6" r="4.6" strokeOpacity=".25" strokeWidth="1.6" /><path d="M6 1.4a4.6 4.6 0 0 1 4.6 4.6" strokeWidth="1.6" /></>,
    dot: <circle cx="6" cy="6" r="3.4" fill="currentColor" stroke="none" />,
    check: <path d="m3 8 3 3 7-7" />,
  };
  const size = ["search", "tool", "error", "spinner", "dot"].includes(name) ? 12 : name === "warning" || name === "check" ? 16 : 14;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
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
  return `${Math.floor(seconds / 60)} мин ${String(seconds % 60).padStart(2, "0")} с`;
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
  title = "Агентын ирсэн",
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
  const focusAfterAction = React.useRef<string | null>(null);
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
    if (focusAfterAction.current) {
      Array.from(root.current?.querySelectorAll<HTMLElement>("[data-task]") ?? [])
        .find((element) => element.dataset.task === focusAfterAction.current)
        ?.querySelector<HTMLButtonElement>(".ai-inbox-toggle")?.focus();
      focusAfterAction.current = null;
    }
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
    if (root.current?.contains(document.activeElement)) focusAfterAction.current = task.id;
    setNow(timestamp);
    setOverrides((old) => new Map(old).set(task.id, { source, task: next }));
    setExpanded(null);
    setNotice(
      `${task.title}: ${action === "reject" ? "татгалзсан" : action === "retry" ? "дахин оролдож байна" : "батлагдсан"}.`,
    );
  };
  const groups = [
    {
      name: "Таны ээлж",
      key: "needs",
      tasks: rows.filter(
        (t) => t.status === "waiting" || t.status === "failed",
      ),
    },
    {
      name: "Ажиллаж байна",
      key: "running",
      tasks: rows.filter((t) => t.status === "running"),
    },
    {
      name: "Дууссан",
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
            <span className="ai-inbox-mark"><Glyph name="spark" /></span>
            <strong dir="auto" title={task.title}>{task.title}</strong>
          </span>
          {task.description && <span className="ai-inbox-description">{task.description}</span>}
          <span className="ai-inbox-meta">
            <span className="ai-inbox-status">
              {task.status === "waiting" ? (
                <Glyph name="warning" />
              ) : task.status === "failed" ? (
                <Glyph name="error" />
              ) : (
                <Glyph name={task.status === "running" ? "spinner" : "dot"} className={task.status === "running" ? "ai-inbox-spinner" : "ai-inbox-dot"} />
              )}
              {task.status === "waiting"
                ? `Таныг хүлээж байна · ${duration}`
                : task.status === "failed"
                  ? "Алдаатай"
                  : duration}
            </span>
            <span className="ai-inbox-counters">
            {task.sources != null && <span className="ai-inbox-count" title={`${task.sources} эх сурвалж`}>
              <Glyph name="search" />
              {task.sources}
            </span>}
            {task.tools != null && <span className="ai-inbox-count" title={`${task.tools} дуудлага`}>
              <Glyph name="tool" />
              {task.tools}
            </span>}
            </span>
          </span>
        </button>
        {open && (
          <div id={detailId} className="ai-inbox-details">
            <span className="ai-inbox-agent">
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
                    Батлах
                  </button>
                  <button type="button" onClick={() => act(task, "reject")}>Татгалзах</button>
                </>
              ) : task.status === "failed" ? (
                <button
                  type="button"
                  className="ai-inbox-primary"
                  onClick={() => act(task, "retry")}
                >
                  Дахин оролдох
                </button>
              ) : onOpen ? (
                <button type="button" aria-label="Даалгаврыг нээх" onClick={() => act(task, "open")}>
                  Нээх
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
          <span>Агентууд</span>
          <b aria-hidden="true">/</b>
          <strong>{title}</strong>
        </span>
        <div className="ai-inbox-header-actions">
        {action && <button className="ai-inbox-header-action" type="button" onClick={action.onClick}>{action.label}</button>}
        <div
          className="ai-inbox-switch"
          role="radiogroup"
          aria-label="Харагдац"
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
              {v === "board" ? "Самбар" : "Жагсаалт"}
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
                <p className="ai-inbox-empty">Даалгавар алга</p>
              )}
            </div>
          </section>
        ))}
      </div>
      <footer className="ai-inbox-footer">
        <span aria-live="polite">
          {groups[0].tasks.length} таны ээлж <b>·</b> {groups[1].tasks.length}{" "}
          ажиллаж байна
        </span>
        <span>{rows.length} даалгавар</span>
      </footer>
      <p className="ai-inbox-notice" role="status" aria-live="polite">
        {notice}
      </p>
    </section>
  );
}

// Values measured from the public Clean preview; independently authored styles.
const css = `
.ai-inbox{--in-fg:#1c1c1f;--in-text:#55555c;--in-muted:#65656d;--in-slash:#65656d;--in-card:#fff;--in-group:#f4f4f5;--in-line:#e9e9ec;--in-count:#1010180f;--in-blue:#2f6bff;--in-green:#22a05a;--in-amber:#d97706;--in-red:#e5484d;color:var(--in-text);font:400 13px/20px Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;width:100%;max-width:720px;container-type:inline-size;isolation:isolate;text-align:left}
:where(.dark,[data-theme=dark]) .ai-inbox{--in-fg:#ededed;--in-text:#b6b6bd;--in-muted:#9a9aa2;--in-card:#1e1e21;--in-group:#161618;--in-line:#2c2c31;--in-count:#ffffff12;--in-slash:#9a9aa2;--in-blue:#5b8cff;--in-green:#3ecf8e;--in-amber:#e7ab50;--in-red:#ff6b66;color-scheme:dark}
.ai-inbox *{box-sizing:border-box}.ai-inbox button{font:inherit;color:inherit;cursor:pointer}.ai-inbox button:focus-visible{outline:2px solid var(--in-blue);outline-offset:3px}.ai-inbox svg{width:14px;height:14px;flex:none}
.ai-inbox-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 12px;padding:0 2px;min-height:32px}.ai-inbox-header>span{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:500;color:var(--in-fg);min-width:0}.ai-inbox-header>span>span{color:var(--in-muted);font-weight:400}.ai-inbox-header b{font-weight:500;color:var(--in-slash)}.ai-inbox-header strong{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ai-inbox-header-actions{display:flex;align-items:center;gap:8px}.ai-inbox-header-action{border:0;background:var(--in-card);box-shadow:inset 0 0 0 1px var(--in-line);border-radius:8px;padding:0 12px;height:28px;white-space:nowrap}
.ai-inbox-switch{display:flex;gap:2px;background:var(--in-group);padding:3px;border-radius:10px}.ai-inbox-switch button{border:0;border-radius:7px;background:none;color:var(--in-muted);padding:0 10px;height:26px;display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500}.ai-inbox-switch svg{width:13px;height:13px}.ai-inbox-switch [aria-checked=true]{background:var(--in-card);color:var(--in-fg);box-shadow:0 1px 2px #10101814,0 0 0 1px #1010180a}
.ai-inbox-groups{display:grid;gap:8px;align-items:start}.ai-inbox-board{grid-template-columns:repeat(3,minmax(0,1fr))}.ai-inbox-list{grid-template-columns:1fr}.ai-inbox-group{min-width:0;background:var(--in-group);padding:4px;border-radius:14px}.ai-inbox-group>header{display:grid;grid-template-columns:20px 1fr auto;align-items:center;height:34px;padding:0 8px 0 10px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.55px;color:var(--in-muted)}.ai-inbox-group>header>svg{color:var(--in-blue);width:14px;height:14px}.ai-inbox-group>header small{display:grid;place-items:center;font-size:11px;font-weight:500;line-height:20px;min-width:20px;height:18px;padding:0 5px;border-radius:6px;background:var(--in-count);color:var(--in-text);letter-spacing:0}
.ai-inbox-cards{display:grid;gap:6px}.ai-inbox-card{position:relative;border:0;border-radius:10px;background:var(--in-card);overflow:hidden;min-width:0;transition:box-shadow .18s;box-shadow:0 0 0 1px var(--in-line),0 1px 2px #1010180a}.ai-inbox-card:hover,.ai-inbox-card.expanded{box-shadow:0 0 0 1px color-mix(in srgb,var(--in-muted) 22%,var(--in-line)),0 6px 18px -8px #0004}.ai-inbox-toggle{width:100%;display:grid;gap:6px;text-align:left;padding:12px 14px 12px 12px;border:0;border-radius:10px;background:none}.ai-inbox-title{display:flex;align-items:center;gap:10px;min-width:0}.ai-inbox-title strong{font-size:14px;line-height:20px;font-weight:500;color:var(--in-fg);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ai-inbox-mark{display:grid;place-items:center;width:16px;height:20px;flex:none;color:var(--in-blue)}.ai-inbox-card.waiting .ai-inbox-mark{color:var(--in-amber)}.ai-inbox-card.failed .ai-inbox-mark{color:var(--in-red)}.ai-inbox-card.done .ai-inbox-mark{color:var(--in-green)}

.ai-inbox-description{font-size:13px;line-height:19px;color:var(--in-text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:0}.ai-inbox-meta{display:flex;flex-wrap:wrap;align-items:center;gap:2px 10px;margin:4px 0 0;font-size:12.5px;line-height:20px;color:var(--in-text);font-variant-numeric:tabular-nums}.ai-inbox-status{display:flex;align-items:center;gap:8px;min-width:0}.ai-inbox-status>svg{width:12px;height:12px;color:var(--in-amber)}.ai-inbox-card.failed .ai-inbox-status>svg{color:var(--in-red)}.ai-inbox-counters{display:flex;margin-left:auto;color:var(--in-muted);font-size:12px}.ai-inbox-count{display:flex;align-items:center;gap:5px;padding:0 9px;white-space:nowrap}.ai-inbox-count:last-child{padding-right:0}.ai-inbox-count svg{width:12px;height:12px}.ai-inbox-count+.ai-inbox-count{border-left:1px solid var(--in-line)}.ai-inbox-status>.ai-inbox-spinner{color:var(--in-blue);animation:in-spin .9s linear infinite}.ai-inbox-status>.ai-inbox-dot{color:var(--in-green)}

.ai-inbox-details{margin:0 14px 0 12px;padding:10px 0 12px;border-top:1px solid var(--in-line);animation:in-open .2s ease-out}.ai-inbox-agent{display:block;color:var(--in-muted);font-size:12px;line-height:20px}.ai-inbox-details ol{list-style:none;display:grid;gap:5px;margin:6px 0 0;padding:0 0 0 12px;position:relative}.ai-inbox-details li{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:10px;font-size:12.5px;line-height:18px}.ai-inbox-details li:before{content:'';position:absolute;left:-12px;top:7px;width:4px;height:4px;border-radius:50%;background:var(--in-muted)}.ai-inbox-details li:not(:last-child):after{content:'';position:absolute;left:-10.5px;top:13px;bottom:-4px;border-left:1px solid var(--in-line)}.ai-inbox-details time{font-size:12.5px;color:var(--in-muted);white-space:nowrap}.ai-inbox-actions{display:flex;gap:6px;margin:10px 0 0}.ai-inbox-actions button{display:flex;align-items:center;justify-content:center;gap:4px;border:0;box-shadow:inset 0 0 0 1px var(--in-line);background:var(--in-card);color:var(--in-fg);border-radius:8px;padding:0 12px;height:28px;font-size:12.5px;font-weight:500;transition:opacity .15s}.ai-inbox-actions button:hover{opacity:.7}.ai-inbox-actions button.ai-inbox-primary{background:var(--in-fg);box-shadow:none;color:var(--in-card)}.ai-inbox-empty{font-size:12px;padding:14px;text-align:center;color:var(--in-muted);margin:0}
.ai-inbox-footer,.ai-inbox-notice{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0;padding:0}.ai-inbox-notice:empty{display:none}
.ai-inbox-list .ai-inbox-description,.ai-inbox-list .ai-inbox-meta{padding-left:26px}.ai-inbox-list .ai-inbox-meta{gap:10px}.ai-inbox-list .ai-inbox-group>header{grid-template-columns:20px auto 1fr;gap:4px}.ai-inbox-list .ai-inbox-group>header small{justify-self:end}
@container(max-width:619px){.ai-inbox-board{grid-template-columns:1fr}.ai-inbox-switch{display:none}.ai-inbox-group>header{grid-template-columns:20px auto 1fr;gap:4px}.ai-inbox-group>header small{justify-self:end}.ai-inbox-header{min-height:20px}.ai-inbox .ai-inbox-description,.ai-inbox .ai-inbox-meta{padding-left:0}.ai-inbox-meta{gap:2px 10px}}
@keyframes in-spin{to{transform:rotate(360deg)}}@keyframes in-open{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.ai-inbox *{animation:none!important;transition:none!important}}
`;

export default AgentInbox;
