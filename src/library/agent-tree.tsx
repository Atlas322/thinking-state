"use client";
import * as React from "react";

// Neutral maker mark: the first letter of the agent's model label, no brand logos.
function ProviderMark({ model = "" }: { model?: string }) {
  return (
    <span aria-hidden="true" style={{ display: "block", fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>
      {(model.trim()[0] ?? "А").toUpperCase()}
    </span>
  );
}

// Neutral demo tool glyphs (generic systems, no vendor marks).
type DemoToolKind = "chat" | "docs" | "code" | "design" | "payments" | "crm";
const toolGlyph: Record<DemoToolKind, React.ReactNode> = {
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  docs: <path d="M6 3h9l4 4v14H6z" />,
  code: <path d="M9 6 3 12l6 6 1.4-1.4L5.8 12l4.6-4.6zM15 6l-1.4 1.4 4.6 4.6-4.6 4.6L15 18l6-6z" />,
  design: (
    <>
      <path d="M3 3h9v9H3z" />
      <circle cx="16.5" cy="16.5" r="4.5" />
    </>
  ),
  payments: <path fillRule="evenodd" d="M3 6h18v12H3zM3 9h18v2H3z" />,
  crm: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 7 0 0 1 16 0z" />
    </>
  ),
};
function DemoTool({ kind }: { kind: DemoToolKind }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {toolGlyph[kind]}
    </svg>
  );
}

export type TreeAgent = {
  id: string;
  name: string;
  task: string;
  model?: string;
  avatar?: React.ReactNode;
  tools?: React.ReactNode[];
  status: "queued" | "running" | "waiting" | "done" | "failed" | "stopped";
  ask?: string;
  error?: string;
  cost?: number;
  started?: number;
  ended?: number;
  children?: TreeAgent[];
};
export type AgentTreeProps = {
  root?: TreeAgent;
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (collapsed: string[]) => void;
  onResolve?: (
    agent: TreeAgent,
    action: "approve" | "reject" | "retry" | "dismiss",
  ) => void;
  onSelect?: (agent: TreeAgent) => void;
  now?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
};
const labels = {
  queued: "Дараалалд",
  running: "Ажиллаж байна",
  waiting: "Таны ээлж",
  done: "Дууссан",
  failed: "Алдаатай",
  stopped: "Зогсоосон",
};
const sumCost = (node: TreeAgent): number =>
  Math.max(0, node.cost ?? 0) +
  (node.children ?? []).reduce((sum, child) => sum + sumCost(child), 0);
const flatten = (node: TreeAgent): TreeAgent[] => [
  node,
  ...(node.children ?? []).flatMap(flatten),
];
const treeDepth = (node: TreeAgent): number =>
  Math.max(0, ...(node.children ?? []).map((child) => 1 + treeDepth(child)));
const dollars = (value: number) => `$${value.toFixed(2)}`;
function sampleTree(): TreeAgent {
  const now = Date.now();
  return {
    id: "lead",
    name: "Зохицуулагч агент",
    tools: [<DemoTool key="chat" kind="chat" />, <DemoTool key="docs" kind="docs" />, <DemoTool key="code" kind="code" />],
    model: "Гүн загвар",
    task: "Баасан гариг гэхэд шинэ үнийн хуудсыг нээх",
    status: "running",
    cost: 42,
    started: now - 38000,
    children: [
      {
        id: "research",
        name: "Судлаач агент",
    tools: [<DemoTool key="docs" kind="docs" />, <DemoTool key="chat" kind="chat" />],
        model: "Дунд загвар",
        task: "Таван өрсөлдөгчийн үнийн бодлогыг харьцуулах",
        status: "running",
        cost: 13,
        started: now - 32000,
        children: [
          {
            id: "scrape",
            name: "Уншигч агент",
    tools: [<DemoTool key="docs" kind="docs" />],
            model: "Хурдан загвар",
            task: "Таван өрсөлдөгчийн үнийн хуудсыг унших",
            status: "done",
            cost: 3,
            started: now - 28000,
            ended: now - 6000,
          },
          {
            id: "analyst",
            name: "Шинжээч агент",
    tools: [<DemoTool key="crm" kind="crm" />, <DemoTool key="docs" kind="docs" />],
            model: "Дунд загвар",
            task: "Үнийн тухай 120 сэтгэгдлийг нэгтгэх",
            status: "running",
            cost: 5,
            started: now - 18000,
          },
        ],
      },
      {
        id: "writer",
        name: "Бичигч агент",
    tools: [<DemoTool key="docs" kind="docs" />, <DemoTool key="design" kind="design" />],
        model: "Дунд загвар",
        task: "Гурван багцын тайлбар бичих",
        status: "running",
        cost: 10,
        started: now - 27000,
      },
      {
        id: "coder",
        name: "Кодын агент",
    tools: [<DemoTool key="code" kind="code" />, <DemoTool key="payments" kind="payments" />, <DemoTool key="design" kind="design" />],
        model: "Кодын загвар",
        task: "Хуудсыг угсарч, төлбөрийн системтэй холбох",
        status: "running",
        cost: 13,
        started: now - 22000,
        children: [
          {
            id: "tester",
            name: "Шалгагч агент",
    tools: [<DemoTool key="code" kind="code" />],
            model: "Жижиг загвар",
            task: "Төлбөрийн тестүүдийг бичиж ажиллуулах",
            status: "running",
            cost: 2,
            started: now - 10000,
          },
        ],
      },
    ],
  };
}
// Chevron and warning icon: Hugeicons Free (MIT).
function StatusIcon({ status }: { status: TreeAgent["status"] }) {
  return status === "running" ? (
    <svg className="agt-spinner" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" strokeOpacity="0.25" strokeWidth="2.5"/><path d="M12 3.5A8.5 8.5 0 0 1 20.5 12" strokeWidth="2.5"/></svg>
  ) : status === "done" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 14L8.5 17.5L19 6.5" strokeWidth="2.4" />
    </svg>
  ) : status === "failed" ? (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13.9248 21H10.0752C5.44476 21 3.12955 21 2.27636 19.4939C1.42317 17.9879 2.60736 15.9914 4.97574 11.9985L6.90057 8.75333C9.17559 4.91778 10.3131 3 12 3C13.6869 3 14.8244 4.91777 17.0994 8.75332L19.0243 11.9985C21.3926 15.9914 22.5768 17.9879 21.7236 19.4939C20.8704 21 18.5552 21 13.9248 21Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M12 9V13" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" strokeLinejoin="round"></path><path d="M12 16.8V17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6"></path></svg>
  ) : status === "waiting" ? (
    <svg viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="5" />
      <path d="M8 5v3l2 1" />
    </svg>
  ) : (
    <i className="agt-dot" />
  );
}
function Maker({ agent }: { agent: TreeAgent }) {
  if (agent.avatar) return <span className="agt-avatar">{agent.avatar}</span>;
  const model = agent.model ?? "";
  return (
    <span
      className={`agt-avatar ${model.startsWith("GPT") ? "openai" : model.startsWith("Gemini") ? "gemini" : "claude"}`}
      aria-hidden="true"
    >
      <ProviderMark model={model} />
    </span>
  );
}

export function AgentTree({
  root,
  collapsed,
  defaultCollapsed = [],
  onCollapsedChange,
  onResolve,
  onSelect,
  now,
  formatCost = dollars,
  title = "Агентууд",
  className = "",
}: AgentTreeProps) {
  const [demo] = React.useState(sampleTree);
  const data = root ?? demo;
  const [localCollapsed, setLocalCollapsed] = React.useState(defaultCollapsed);
  const folded = collapsed ?? localCollapsed;
  const [clock, setClock] = React.useState(Date.now());
  const [dialogId, setDialogId] = React.useState<string | null>(null);
  const [paths, setPaths] = React.useState<
    { id: string; d: string; muted: boolean }[]
  >([]);
  const [dots, setDots] = React.useState<{ id: string; x: number; y: number }[]>([]);
  const canvas = React.useRef<HTMLDivElement>(null);
  const cards = React.useRef(new Map<string, HTMLDivElement>());
  const oldPositions = React.useRef(new Map<string, DOMRect>());
  const statusTrigger = React.useRef<HTMLButtonElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const all = flatten(data),
    running = all.filter((agent) => agent.status === "running").length;
  const dialog = all.find(
    (agent) =>
      agent.id === dialogId &&
      (agent.status === "waiting" || agent.status === "failed"),
  );
  const currentTime = now ?? clock;
  React.useEffect(() => {
    if (now !== undefined || !running) return;
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [now, running]);
  React.useLayoutEffect(() => {
    const measure = () => {
      const parent = canvas.current;
      if (!parent) return;
      const bounds = parent.getBoundingClientRect();
      const narrow = bounds.width < 560;
      const links: { id: string; d: string; muted: boolean }[] = [];
      const origins: { id: string; x: number; y: number }[] = [];
      const connect = (node: TreeAgent, depth: number) => {
        const from = cards.current.get(node.id)?.getBoundingClientRect();
        if (!from || folded.includes(node.id)) return;
        for (const child of node.children ?? []) {
          const to = cards.current.get(child.id)?.getBoundingClientRect();
          if (!to) continue;
          let x1: number, y1: number, x2: number, y2: number, d: string;
          if (depth === 0 && !narrow) {
            x1 = from.left + from.width / 2 - bounds.left;
            y1 = from.bottom - bounds.top;
            x2 = to.left + to.width / 2 - bounds.left;
            y2 = to.top - bounds.top;
            const middle = y1 + (y2 - y1) / 2;
            d = x1 === x2
              ? `M${x1},${y1} V${y2}`
              : `M${x1},${y1} V${middle - 8} Q${x1},${middle} ${x1 + (x2 > x1 ? 8 : -8)},${middle} H${x2 + (x2 > x1 ? -8 : 8)} Q${x2},${middle} ${x2},${middle + 8} V${y2}`;
          } else {
            x1 = from.left + 21 - bounds.left;
            y1 = from.bottom - bounds.top;
            x2 = to.left - bounds.left;
            y2 = to.top + 20 - bounds.top;
            const radius = Math.max(0, Math.min(8, (x2 - x1) / 2));
            d = `M${x1},${y1} V${y2 - radius} Q${x1},${y2} ${x1 + radius},${y2} H${x2}`;
          }
          if (!origins.some((origin) => origin.id === node.id))
            origins.push({ id: node.id, x: x1, y: y1 });
          links.push({
            id: child.id,
            d,
            muted: ["queued", "stopped"].includes(child.status),
          });
          connect(child, depth + 1);
        }
      };
      connect(data, 0);
      setPaths(links);
      setDots(origins);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (canvas.current) observer.observe(canvas.current);
    cards.current.forEach((card) => observer.observe(card));
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const next = new Map<string, DOMRect>();
    cards.current.forEach((element, id) => {
      const rect = element.getBoundingClientRect(),
        old = oldPositions.current.get(id);
      next.set(id, rect);
      if (old && !reduced && (old.x !== rect.x || old.y !== rect.y))
        element.animate?.(
          [
            { transform: `translate(${old.x - rect.x}px,${old.y - rect.y}px)` },
            { transform: "translate(0,0)" },
          ],
          { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" },
        );
    });
    oldPositions.current = next;
    let frame = 0;
    const began = performance.now();
    const followMotion = (time: number) => {
      measure();
      if (time - began < 560) frame = window.requestAnimationFrame(followMotion);
    };
    if (!reduced && typeof window.requestAnimationFrame === "function")
      frame = window.requestAnimationFrame(followMotion);
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [data, folded]);
  React.useEffect(() => {
    if (dialog)
      dialogRef.current
        ?.querySelector<HTMLButtonElement>("footer button")
        ?.focus();
  }, [dialog?.id]);
  React.useEffect(() => {
    if (dialogId && !dialog) {
      setDialogId(null);
      statusTrigger.current?.focus();
    }
  }, [dialogId, dialog]);
  const toggle = (id: string) => {
    const next = folded.includes(id)
      ? folded.filter((value) => value !== id)
      : [...folded, id];
    setLocalCollapsed(next);
    onCollapsedChange?.(next);
  };
  const close = () => {
    setDialogId(null);
    statusTrigger.current?.focus();
  };
  const resolve = (action: "approve" | "reject" | "retry" | "dismiss") => {
    if (dialog) onResolve?.(dialog, action);
    close();
  };
  const renderNode = (agent: TreeAgent, depth: number): React.ReactNode => {
    const children = agent.children ?? [],
      isFolded = folded.includes(agent.id),
      hasRunning = flatten(agent).some((node) => node.status === "running");
    const seconds =
      agent.started === undefined
        ? undefined
        : Math.max(
            0,
            Math.floor(((agent.ended ?? currentTime) - agent.started) / 1000),
          );
    const duration =
      seconds === undefined
        ? ""
        : seconds >= 60
          ? `${Math.floor(seconds / 60)} мин ${String(seconds % 60).padStart(2, "0")} с`
          : `${seconds} с`;
    return (
      <div
        className={`agt-branch agt-depth-${depth === 0 ? "root" : depth === 1 ? "first" : "deep"}`}
        key={agent.id}
        role="treeitem"
        aria-label={`${agent.name}, ${labels[agent.status]}`}
        aria-level={depth + 1}
        aria-expanded={children.length ? !isFolded : undefined}
        style={{ "--agt-depth": depth } as React.CSSProperties}
      >
        <div
          ref={(element) => {
            if (element) cards.current.set(agent.id, element);
            else cards.current.delete(agent.id);
          }}
          className={`agt-card ${agent.status}`}
          style={{ animationDelay: depth === 0 ? "0ms" : "160ms" }}
          data-agent={agent.id}
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          aria-label={onSelect ? agent.name : undefined}
          onClick={(event) => {
            if (!(event.target as Element).closest("button")) onSelect?.(agent);
          }}
          onKeyDown={(event) => {
            if (event.target === event.currentTarget && event.key === "Enter") {
              event.preventDefault();
              onSelect?.(agent);
            }
          }}
        >
          <div className="agt-card-head">
            <Maker agent={agent} />
            <div className="agt-identity">
              <strong>{agent.name}</strong>
              {agent.model && <small>{agent.model}</small>}
            </div>
            {agent.status === "waiting" || agent.status === "failed" ? (
              <button
                type="button"
                className={`agt-status ${agent.status}`}
                aria-expanded={dialog?.id === agent.id}
                aria-haspopup="dialog"
                onClick={(event) => {
                  statusTrigger.current = event.currentTarget;
                  setDialogId(agent.id);
                }}
              >
                <StatusIcon status={agent.status} />
                {labels[agent.status]}
              </button>
            ) : (
              <span className={`agt-status ${agent.status}`}>
                <StatusIcon status={agent.status} />
                {labels[agent.status]}
              </span>
            )}
          </div>
          <p className="agt-task">
            {agent.tools?.length ? (
              <span className="agt-tools">
                {agent.tools.slice(0, 3).map((tool, index) => (
                  <span key={index}>{tool}</span>
                ))}
              </span>
            ) : null}
            {agent.task}
          </p>
          <div className="agt-card-footer">
            <span className={hasRunning ? "agt-live-cost" : ""}>
              {formatCost(sumCost(agent))}
            </span>
            {duration && <span className="agt-duration">· {duration}</span>}
            {children.length > 0 && (
              <button
                type="button"
                aria-label={`${agent.name}: ${children.length} дэд агентыг ${isFolded ? "харуулах" : "нуух"}`}
                aria-expanded={!isFolded}
                onClick={() => toggle(agent.id)}
              >
                {isFolded
                  ? `${flatten(agent).length - 1} нуусан`
                  : children.length}
                <svg
                  viewBox="0 0 24 24"
                  style={{ transform: isFolded ? "rotate(-90deg)" : undefined }}
                >
                  <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" strokeWidth="1.8" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {children.length > 0 && !isFolded && (
          <div
            className={`agt-children ${depth === 0 ? "agt-first-level" : ""}`}
            role="group"
          >
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  return (
    <section className={`agt-tree ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="agt-header">
        <span className="agt-title">
          <span aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1.2c.4 2.9 1.9 4.4 4.8 4.8-2.9.4-4.4 1.9-4.8 4.8C6.6 7.9 5.1 6.4 2.2 6 5.1 5.6 6.6 4.1 7 1.2Z" fill="currentColor"></path><circle cx="11.6" cy="11.4" r="1.1" fill="currentColor" opacity="0.55"></circle></svg></span>
          {title}
        </span>
        <div aria-live="polite">
          <span>{all.length} агент</span>
          {running > 0 && (
            <span className="agt-running-text">{running} ажиллаж байна</span>
          )}
          {all.some((agent) => agent.status === "waiting") && (
            <span className="agt-waiting-text">
              {all.filter((agent) => agent.status === "waiting").length} таны
              ээлж
            </span>
          )}
          {all.some((agent) => agent.status === "failed") && (
            <span className="agt-failed-text">
              {all.filter((agent) => agent.status === "failed").length} алдаатай
            </span>
          )}
          <strong className={running > 0 ? "agt-live-cost" : undefined}>
            {formatCost(sumCost(data))}
          </strong>
        </div>
      </header>
      <div ref={canvas} className="agt-canvas" style={{
        "--agt-columns": Math.max(1, data.children?.length ?? 0),
        "--agt-max-depth": treeDepth(data),
        "--agt-deep-indent": `${Math.max(0, treeDepth(data) - 1) * 32}px`,
      } as React.CSSProperties}>
        <svg className="agt-connectors" aria-hidden="true">
          {paths.map((path) => (
            <path
              key={path.id}
              d={path.d}
              pathLength="1"
              className={path.muted ? "muted" : ""}
            />
          ))}
        </svg>
        <div role="tree" aria-label={title}>
          {renderNode(data, 0)}
        </div>
        <svg className="agt-connectors agt-origin-dots" aria-hidden="true">
          {dots.map((dot) => <circle key={dot.id} cx={dot.x} cy={dot.y} r="3.25" />)}
        </svg>
      </div>
      {dialog && (
        <div
          className="agt-dialog-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            className="agt-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${dialog.name}: ${labels[dialog.status]}`}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                close();
              }
              if (event.key === "Tab") {
                const buttons = Array.from(
                  event.currentTarget.querySelectorAll<HTMLButtonElement>(
                    "button",
                  ),
                );
                const first = buttons[0],
                  last = buttons.at(-1);
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div>
              <Maker agent={dialog} />
              <strong>{dialog.name}</strong>
              <button
                type="button"
                className="agt-dialog-close"
                aria-label="Дэлгэрэнгүйг хаах"
                onClick={close}
              >
                ×
              </button>
            </div>
            <p>
              {dialog.status === "waiting"
                ? (dialog.ask ??
                  "Үргэлжлүүлэхийн өмнө энэ агентад таны хариу хэрэгтэй.")
                : (dialog.error ?? "Агент энэ алхмыг гүйцээж чадсангүй.")}
            </p>
            <footer>
              {dialog.status === "waiting" ? (
                <>
                  <button
                type="button"
                    className="agt-primary"
                    onClick={() => resolve("approve")}
                  >
                    Батлах
                  </button>
                  <button type="button" onClick={() => resolve("reject")}>Татгалзах</button>
                </>
              ) : (
                <>
                  <button
                type="button"
                    className="agt-primary"
                    onClick={() => resolve("retry")}
                  >
                    Дахин оролдох
                  </button>
                  <button type="button" onClick={() => resolve("dismiss")}>Хаах</button>
                </>
              )}
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
const css = `
.agt-tree{--agt-ink:#000;--agt-muted:rgba(0,0,0,.7);--agt-subtle:rgba(0,0,0,.6);--agt-cost:rgba(0,0,0,.88);--agt-spark:rgba(0,96,226,.765);--agt-card:#fff;--agt-edge:#00000014;--agt-link:#4f8fdb;--agt-surface:#f8f8f8;--agt-shadow:0 0 0 .5px rgba(0,0,0,.06),0 1px 1px -1px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.05);--agt-run:#0a6ac0;--agt-run-bg:#0088ff1a;--agt-done:#157a3c;--agt-done-bg:rgba(0,164,51,.098);--agt-wait:#a87500;--agt-wait-bg:#ffa6001a;--agt-fail:rgba(215,36,0,.855);--agt-fail-bg:rgba(245,43,0,.094);width:100%;max-width:900px;font:400 13px/20px Inter,InterVariable,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--agt-muted);container-type:inline-size;position:relative;text-align:left;isolation:isolate}
.agt-tree:where(.dark,[data-theme=dark]),:where(.dark,[data-theme=dark]) .agt-tree{--agt-ink:#fff;--agt-cost:rgba(255,255,255,.9);--agt-spark:#5b9aff;--agt-muted:#ffffffb3;--agt-subtle:#ffffff99;--agt-card:#1c1c1f;--agt-edge:#ffffff1a;--agt-link:#4f8fdb;--agt-surface:#19191b;--agt-shadow:0 0 0 .5px #ffffff1a,0 1px 2px #0006;--agt-run:#70b8ff;--agt-run-bg:#0077ff3a;--agt-done:#3dd68c;--agt-done-bg:rgba(0,240,74,.12);--agt-wait:#ffcd73;--agt-wait-bg:#ffb30026;--agt-fail:#ff977d;--agt-fail-bg:#ff35232b;color-scheme:dark}
.agt-tree *{box-sizing:border-box}.agt-tree button{font:inherit;color:inherit;cursor:pointer}.agt-tree button:focus-visible,.agt-card[role=button]:focus-visible{outline:2px solid var(--agt-link);outline-offset:3px}.agt-tree svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round;flex:none}
.agt-header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 16px;font-size:13px;min-height:20px}.agt-title{display:flex;gap:8px;align-items:center;font-size:13px;font-weight:500;color:var(--agt-ink)}.agt-title>span{display:grid;place-items:center;width:16px;height:14px;color:var(--agt-spark);font-size:16px}.agt-title>span svg{width:14px;height:14px;stroke:none}.agt-header>div{display:flex;align-items:center;gap:4px 10px;color:var(--agt-subtle);font-size:12px;line-height:16px;flex-wrap:wrap;justify-content:flex-end}.agt-header strong{font-weight:500;color:var(--agt-cost)}.agt-header .agt-running-text{color:var(--agt-run)}.agt-header .agt-waiting-text{color:var(--agt-wait)}.agt-header .agt-failed-text{color:var(--agt-fail)}
.agt-canvas{position:relative;--agt-card-width:calc((100% - (var(--agt-columns) - 1)*8px)/var(--agt-columns) - var(--agt-deep-indent))}.agt-connectors{position:absolute;inset:0;width:100%!important;height:100%!important;overflow:visible;pointer-events:none;z-index:0;color:var(--agt-link)}.agt-connectors path{stroke-width:1.5;animation:agt-link-in .42s cubic-bezier(.32,.72,.24,1) both}.agt-connectors .muted{opacity:.2}.agt-origin-dots{z-index:2}.agt-origin-dots circle{fill:var(--agt-card);stroke:var(--agt-link);stroke-width:1.5}.agt-branch{position:relative;min-width:0}.agt-card{width:var(--agt-card-width)}.agt-depth-root>.agt-card{margin:0 auto;left:calc(var(--agt-deep-indent)/-2)}.agt-first-level{display:grid;grid-template-columns:repeat(var(--agt-columns),minmax(0,1fr));gap:8px;margin-top:40px}.agt-first-level .agt-card{width:calc(100% - var(--agt-deep-indent))}.agt-children:not(.agt-first-level){display:grid;gap:12px;margin-top:12px;margin-left:32px}.agt-children:not(.agt-first-level) .agt-card{width:calc(100% - var(--agt-deep-indent) + var(--agt-depth)*32px - 32px)}
.agt-card{min-width:0;padding:10px 10px 8px;background:var(--agt-card);border:0;border-radius:8px;box-shadow:var(--agt-shadow);position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr);gap:6px;animation:agt-card-in .36s cubic-bezier(.32,.72,.24,1) both}.agt-card[role=button]{cursor:pointer}.agt-card.queued,.agt-card.stopped{--agt-opacity:.55;opacity:.55}.agt-card-head{display:flex;align-items:center;gap:8px;min-height:30px}.agt-avatar{display:grid;place-items:center;width:22px;height:22px;border-radius:6px;background:var(--agt-card);box-shadow:var(--agt-shadow);flex:none;font-size:16px}.agt-avatar>svg,.agt-avatar>img{width:16px;height:16px}.agt-avatar.claude{color:#d6916f}.agt-avatar.gemini{color:#7eafff}.agt-avatar.openai{color:var(--agt-ink)}.agt-identity{min-width:0;flex:1}.agt-identity strong{display:block;font-size:13px;font-weight:500;line-height:16px;color:var(--agt-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.agt-identity small{display:block;font-size:11px;color:var(--agt-subtle);line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.agt-status{display:inline-flex;align-items:center;gap:4px;border:0;white-space:nowrap;border-radius:4px;padding:0 6px 0 4px;font-size:11px!important;font-weight:500;line-height:16px;height:18px;color:var(--agt-subtle);background:var(--agt-surface);margin-left:auto}.agt-status.running{background:var(--agt-run-bg);color:var(--agt-run)}.agt-status.done{background:var(--agt-done-bg);color:var(--agt-done)}.agt-status.waiting{background:var(--agt-wait-bg);color:var(--agt-wait)}.agt-status.failed{background:var(--agt-fail-bg);color:var(--agt-fail)}.agt-status svg{width:12px;height:12px}.agt-spinner{display:block;width:12px;height:12px;animation:agt-spin .9s linear infinite}.agt-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
.agt-task{font-size:12px;color:var(--agt-muted);line-height:16px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:-2px -2px -3px;padding:2px 2px 3px}.agt-tools{display:inline-flex;vertical-align:top;margin-right:6px}.agt-tools>span{display:grid;place-items:center;width:16px;height:16px;border-radius:4px;background:var(--agt-card);box-shadow:var(--agt-shadow);margin-right:-4px}.agt-tools>span:last-child{margin-right:0}.agt-tools svg,.agt-tools img{width:12px;height:12px}.agt-tools svg{stroke:none;fill:currentColor;color:var(--agt-ink)}.agt-card-footer{display:flex;align-items:center;font-size:11px;line-height:16px;font-weight:500;gap:6px;font-variant-numeric:tabular-nums;min-height:20px;color:var(--agt-cost)}.agt-duration{color:var(--agt-subtle);font-weight:400}.agt-card-footer button{display:flex;align-items:center;gap:2px;border:0;border-radius:5px;background:none;color:var(--agt-subtle);font-size:11px;font-weight:500;line-height:20px;margin-left:auto;padding:0 4px 0 6px}.agt-card-footer button svg{transition:transform .25s}.agt-tree .agt-live-cost{background:linear-gradient(100deg,var(--agt-muted),var(--agt-ink),var(--agt-muted));background-size:250% 100%;background-clip:text;color:transparent;animation:agt-shimmer 2.7s linear infinite}
.agt-dialog-backdrop{position:absolute;inset:0;display:grid;place-items:center;background:#0002;z-index:20;border-radius:12px;padding:16px}.agt-dialog{width:320px;max-width:100%;background:var(--agt-card);border:1px solid var(--agt-edge);border-radius:12px;box-shadow:0 10px 45px #0003;padding:18px;animation:agt-card-in .2s both}.agt-dialog>div{display:flex;align-items:center;gap:8px}.agt-dialog strong{font-weight:500;font-size:13px}.agt-dialog p{font-size:12px;line-height:1.7;color:var(--agt-muted);margin:12px 0 18px}.agt-dialog-close{margin-left:auto;border:0;background:none;font-size:20px!important;color:var(--agt-muted)!important}.agt-dialog footer{display:flex;gap:7px}.agt-dialog footer button{border:1px solid var(--agt-edge);border-radius:6px;padding:5px 10px;background:none;font-size:11px}.agt-dialog footer button.agt-primary{background:var(--agt-ink);color:var(--agt-card);border-color:var(--agt-ink)}
@container(max-width:559px){.agt-canvas{--agt-card-width:calc(100% - var(--agt-max-depth)*32px)}.agt-depth-root>.agt-card{margin:0;left:0;width:var(--agt-card-width)}.agt-first-level{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin:12px 0 0 32px}.agt-first-level .agt-card{width:calc(100% - (var(--agt-max-depth) - 1)*32px)}.agt-children:not(.agt-first-level) .agt-card{width:calc(100% - (var(--agt-max-depth) - var(--agt-depth))*32px)}.agt-header{flex-wrap:wrap}.agt-title{width:100%}.agt-header>div{margin-left:auto;gap:4px 10px}}
@keyframes agt-spin{to{transform:rotate(360deg)}}@keyframes agt-card-in{from{opacity:0;transform:translateY(5px)}to{opacity:var(--agt-opacity,1);transform:translateY(0)}}@keyframes agt-link-in{from{stroke-dasharray:1;stroke-dashoffset:1}to{stroke-dasharray:1;stroke-dashoffset:0}}@keyframes agt-shimmer{to{background-position:-250% 0}}@media(prefers-reduced-motion:reduce){.agt-tree *{animation:none!important;transition:none!important}.agt-tree .agt-live-cost{color:var(--agt-ink);background:none}}
`;
/** Catalog preview: demo costs are token counts (thousands), never money. */
const demoTokens = (value: number) => `${Math.round(value)}k токен`;
export default function AgentTreePreview() {
  return <AgentTree formatCost={demoTokens} />;
}
