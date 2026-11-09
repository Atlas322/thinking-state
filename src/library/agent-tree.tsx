"use client";
import * as React from "react";

// Simple Icons brand paths (CC0): v16.37.0, OpenAI v14.0.0.
const providerPaths = {
  claude:
    "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  openai:
    "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  googlegemini:
    "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
};
function ProviderMark({ model = "" }: { model?: string }) {
  const brand = /GPT|OpenAI/i.test(model)
    ? "openai"
    : /Gemini/i.test(model)
      ? "googlegemini"
      : "claude";
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={
        brand === "claude"
          ? "#d97757"
          : brand === "googlegemini"
            ? "#4f65ff"
            : "currentColor"
      }
      style={{ width: "1em", height: "1em", display: "block", stroke: "none" }}
    >
      <path d={providerPaths[brand]} />
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
  queued: "Queued",
  running: "Running",
  waiting: "Needs you",
  done: "Done",
  failed: "Failed",
  stopped: "Stopped",
};
const sumCost = (node: TreeAgent): number =>
  Math.max(0, node.cost ?? 0) +
  (node.children ?? []).reduce((sum, child) => sum + sumCost(child), 0);
const flatten = (node: TreeAgent): TreeAgent[] => [
  node,
  ...(node.children ?? []).flatMap(flatten),
];
const dollars = (value: number) => `$${value.toFixed(2)}`;
function sampleTree(): TreeAgent {
  const now = Date.now();
  return {
    id: "lead",
    name: "Orchestrator",
    model: "Opus 5.5",
    task: "Launch the new pricing page by Friday",
    status: "running",
    cost: 0.42,
    started: now - 38000,
    children: [
      {
        id: "research",
        name: "Researcher",
        model: "Sonnet 5.5",
        task: "Compare the pricing of five competitors",
        status: "running",
        cost: 0.13,
        started: now - 32000,
        children: [
          {
            id: "scrape",
            name: "Scraper",
            model: "Gemini 3.8 Flash",
            task: "Read the pricing pages of Linear, Notion and three more",
            status: "done",
            cost: 0.03,
            started: now - 28000,
            ended: now - 6000,
          },
          {
            id: "analyst",
            name: "Analyst",
            model: "Sonnet 5.5",
            task: "Summarize 120 G2 reviews that mention price",
            status: "running",
            cost: 0.05,
            started: now - 18000,
          },
        ],
      },
      {
        id: "writer",
        name: "Writer",
        model: "Sonnet 5.5",
        task: "Write the copy for the three plans",
        status: "running",
        cost: 0.1,
        started: now - 27000,
      },
      {
        id: "coder",
        name: "Coder",
        model: "GPT-6 Sol",
        task: "Build the page and wire up checkout",
        status: "running",
        cost: 0.13,
        started: now - 22000,
        children: [
          {
            id: "tester",
            name: "Tester",
            model: "GPT-6 Mini",
            task: "Write and run the checkout tests",
            status: "running",
            cost: 0.02,
            started: now - 10000,
          },
        ],
      },
    ],
  };
}
function StatusIcon({ status }: { status: TreeAgent["status"] }) {
  return status === "running" ? (
    <i className="agt-spinner" />
  ) : status === "done" ? (
    <svg viewBox="0 0 16 16">
      <path d="m3 8 3 3 7-7" />
    </svg>
  ) : status === "failed" ? (
    <svg viewBox="0 0 16 16">
      <path d="m8 2 6 11H2Z M8 6v3m0 2v.1" />
    </svg>
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
  title = "Agents",
  className = "",
}: AgentTreeProps) {
  const [demo] = React.useState(sampleTree);
  const data = root ?? demo;
  const [localCollapsed, setLocalCollapsed] = React.useState(defaultCollapsed);
  const folded = collapsed ?? localCollapsed;
  const [clock, setClock] = React.useState(Date.now());
  const [dialog, setDialog] = React.useState<TreeAgent | null>(null);
  const [paths, setPaths] = React.useState<
    { id: string; d: string; muted: boolean }[]
  >([]);
  const canvas = React.useRef<HTMLDivElement>(null);
  const cards = React.useRef(new Map<string, HTMLDivElement>());
  const oldPositions = React.useRef(new Map<string, DOMRect>());
  const statusTrigger = React.useRef<HTMLButtonElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const all = flatten(data),
    running = all.filter((agent) => agent.status === "running").length;
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
            d = `M${x1},${y1} V${middle - 8} Q${x1},${middle} ${x1 + (x2 > x1 ? 8 : x2 < x1 ? -8 : 0)},${middle} H${x2 + (x2 > x1 ? -8 : x2 < x1 ? 8 : 0)} Q${x2},${middle} ${x2},${middle + 8} V${y2}`;
          } else {
            x1 = from.left + 18 - bounds.left;
            y1 = from.bottom - bounds.top;
            x2 = to.left - bounds.left;
            y2 = to.top + 20 - bounds.top;
            d = `M${x1},${y1} V${y2 - 8} Q${x1},${y2} ${x1 + 8},${y2} H${x2}`;
          }
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
    return () => observer.disconnect();
  }, [data, folded]);
  React.useEffect(() => {
    if (dialog)
      dialogRef.current
        ?.querySelector<HTMLButtonElement>("footer button")
        ?.focus();
  }, [dialog]);
  const toggle = (id: string) => {
    const next = folded.includes(id)
      ? folded.filter((value) => value !== id)
      : [...folded, id];
    setLocalCollapsed(next);
    onCollapsedChange?.(next);
  };
  const close = () => {
    setDialog(null);
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
          ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
          : `${seconds}s`;
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
          data-agent={agent.id}
        >
          <div className="agt-card-head">
            <Maker agent={agent} />
            <div className="agt-identity">
              {onSelect ? (
                <button className="agt-name" onClick={() => onSelect(agent)}>
                  {agent.name}
                </button>
              ) : (
                <strong>{agent.name}</strong>
              )}
              {agent.model && <small>{agent.model}</small>}
            </div>
            {agent.status === "waiting" || agent.status === "failed" ? (
              <button
                className={`agt-status ${agent.status}`}
                aria-expanded={dialog?.id === agent.id}
                aria-haspopup="dialog"
                onClick={(event) => {
                  statusTrigger.current = event.currentTarget;
                  setDialog(agent);
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
                aria-label={`${isFolded ? "Show" : "Hide"} ${children.length} sub-agents of ${agent.name}`}
                aria-expanded={!isFolded}
                onClick={() => toggle(agent.id)}
              >
                {isFolded
                  ? `${flatten(agent).length - 1} hidden`
                  : children.length}
                <svg
                  viewBox="0 0 16 16"
                  style={{ transform: isFolded ? "rotate(-90deg)" : undefined }}
                >
                  <path d="m5 6 3 3 3-3" />
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
          <span aria-hidden="true">✦</span>
          {title}
        </span>
        <div aria-live="polite">
          <span>{all.length} agents</span>
          {running > 0 && (
            <span className="agt-running-text">{running} running</span>
          )}
          {all.some((agent) => agent.status === "waiting") && (
            <span className="agt-waiting-text">
              {all.filter((agent) => agent.status === "waiting").length} need
              you
            </span>
          )}
          {all.some((agent) => agent.status === "failed") && (
            <span className="agt-failed-text">
              {all.filter((agent) => agent.status === "failed").length} failed
            </span>
          )}
          <strong>{formatCost(sumCost(data))}</strong>
        </div>
      </header>
      <div ref={canvas} className="agt-canvas">
        <svg className="agt-connectors" aria-hidden="true">
          {paths.map((path) => (
            <path
              key={path.id}
              d={path.d}
              className={path.muted ? "muted" : ""}
            />
          ))}
        </svg>
        <div role="tree" aria-label={title}>
          {renderNode(data, 0)}
        </div>
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
                className="agt-dialog-close"
                aria-label="Close details"
                onClick={close}
              >
                ×
              </button>
            </div>
            <p>
              {dialog.status === "waiting"
                ? (dialog.ask ??
                  "This agent needs your input before continuing.")
                : (dialog.error ?? "The agent could not complete this step.")}
            </p>
            <footer>
              {dialog.status === "waiting" ? (
                <>
                  <button
                    className="agt-primary"
                    onClick={() => resolve("approve")}
                  >
                    Approve
                  </button>
                  <button onClick={() => resolve("reject")}>Reject</button>
                </>
              ) : (
                <>
                  <button
                    className="agt-primary"
                    onClick={() => resolve("retry")}
                  >
                    Retry
                  </button>
                  <button onClick={() => resolve("dismiss")}>Dismiss</button>
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
.agt-tree{--agt-ink:#252525;--agt-muted:#888;--agt-card:#fff;--agt-edge:#e7e7e7;--agt-link:#82bcff;--agt-surface:#f8f8f8;width:100%;max-width:900px;font:400 13px/20px Inter,system-ui,sans-serif;color:var(--agt-ink);container-type:inline-size;position:relative;text-align:left;isolation:isolate}.agt-tree:where(.dark,[data-theme=dark]),:where(.dark,[data-theme=dark]) .agt-tree{--agt-ink:#eee;--agt-muted:#8d8d90;--agt-card:#202022;--agt-edge:#29292b;--agt-surface:#19191b;color-scheme:dark}.agt-tree *{box-sizing:border-box}.agt-tree button{font:inherit;color:inherit;cursor:pointer}.agt-tree button:focus-visible{outline:2px solid var(--agt-link);outline-offset:3px}.agt-tree svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round;flex:none}.agt-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 2px 20px;font-size:12px}.agt-title{display:flex;gap:10px;align-items:center;font-size:13px}.agt-title>span{color:#82bcff;font-size:16px}.agt-header>div{display:flex;align-items:center;gap:12px;color:var(--agt-muted);font-size:11px;flex-wrap:wrap;justify-content:flex-end}.agt-header strong{font-weight:400;color:var(--agt-ink)}.agt-header .agt-running-text{color:#83b6ed}.agt-header .agt-waiting-text{color:#cba764}.agt-header .agt-failed-text{color:#db7d84}.agt-canvas{position:relative;padding:0 0 4px;--agt-card-width:calc((100% - 48px)/3)}.agt-connectors{position:absolute;inset:0;width:100%!important;height:100%!important;overflow:visible;pointer-events:none;z-index:0;color:var(--agt-link)}.agt-connectors path{stroke-width:1.4;opacity:.85;animation:agt-link-in .45s ease-out both}.agt-connectors .muted{opacity:.2}.agt-branch{position:relative;min-width:0}.agt-depth-root>.agt-card{width:var(--agt-card-width);margin:0 auto}.agt-first-level{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:42px}.agt-first-level>.agt-branch:only-child{grid-column:2}.agt-first-level>.agt-branch:nth-last-child(2):first-child{grid-column:1}.agt-children:not(.agt-first-level){display:grid;gap:12px;margin-top:16px;margin-left:24px}.agt-card{min-width:0;width:100%;padding:10px 11px 8px;background:var(--agt-card);border:1px solid var(--agt-edge);border-radius:10px;box-shadow:0 1px 2px #00000007;position:relative;z-index:1;animation:agt-card-in .3s cubic-bezier(.22,1,.36,1) both}.agt-card.queued,.agt-card.stopped{opacity:.55}.agt-card-head{display:flex;align-items:flex-start;gap:8px}.agt-avatar{display:grid;place-items:center;width:18px;height:24px;flex:none;font-size:19px}.agt-avatar>svg,.agt-avatar>img{width:16px;height:16px}.agt-avatar.claude{color:#d6916f}.agt-avatar.gemini{color:#7eafff}.agt-avatar.openai{color:var(--agt-ink)}.agt-identity{min-width:0;flex:1}.agt-identity strong,.agt-name{display:block;font-size:13px;font-weight:500;line-height:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.agt-name{border:0;background:none;padding:0;text-align:left;max-width:100%}.agt-identity small{display:block;font-size:10px;color:var(--agt-muted);line-height:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.agt-status{display:inline-flex;align-items:center;gap:3px;border:0;white-space:nowrap;border-radius:4px;padding:0 4px;font-size:10px!important;line-height:18px;color:var(--agt-muted);background:var(--agt-surface);margin-left:auto}.agt-status.running{background:#458eda20;color:#82b5ee}.agt-status.done{background:#329b6e17;color:#65bf93}.agt-status.waiting{background:#c79a3f18;color:#cba764}.agt-status.failed{background:#d9747e18;color:#db7d84}.agt-status svg{width:10px;height:10px}.agt-spinner{display:inline-block;width:10px;height:10px;border:1px solid #82b5ee50;border-top-color:#82b5ee;border-radius:50%;animation:agt-spin 1s linear infinite}.agt-dot{width:5px;height:5px;border-radius:50%;background:currentColor}.agt-task{font-size:12px;color:var(--agt-muted);line-height:17px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:7px 0 9px;min-height:34px}.agt-tools{display:inline-flex;vertical-align:middle;margin-right:6px}.agt-tools>span{display:grid;place-items:center;width:14px;height:14px;border-radius:3px;background:var(--agt-surface);box-shadow:0 0 0 1px var(--agt-card);margin-right:-3px}.agt-tools svg,.agt-tools img{width:12px;height:12px}.agt-card-footer{display:flex;align-items:center;font-size:10px;gap:3px;font-variant-numeric:tabular-nums;min-height:18px}.agt-duration{color:var(--agt-muted)}.agt-card-footer button{display:flex;align-items:center;gap:3px;border:0;background:none;color:var(--agt-muted);font-size:10px;margin-left:auto;padding:0 0 0 4px}.agt-card-footer button svg{transition:transform .25s}.agt-live-cost{background:linear-gradient(100deg,var(--agt-muted),var(--agt-ink),var(--agt-muted));background-size:250% 100%;background-clip:text;color:transparent;animation:agt-shimmer 2.7s linear infinite}.agt-dialog-backdrop{position:absolute;inset:0;display:grid;place-items:center;background:#0002;z-index:20;border-radius:12px;padding:16px}.agt-dialog{width:320px;max-width:100%;background:var(--agt-card);border:1px solid var(--agt-edge);border-radius:12px;box-shadow:0 10px 45px #0003;padding:18px;animation:agt-card-in .2s both}.agt-dialog>div{display:flex;align-items:center;gap:8px}.agt-dialog strong{font-weight:500;font-size:13px}.agt-dialog p{font-size:12px;line-height:1.7;color:var(--agt-muted);margin:12px 0 18px}.agt-dialog-close{margin-left:auto;border:0;background:none;font-size:20px!important;color:var(--agt-muted)!important}.agt-dialog footer{display:flex;gap:7px}.agt-dialog footer button{border:1px solid var(--agt-edge);border-radius:6px;padding:5px 10px;background:none;font-size:11px}.agt-dialog footer button.agt-primary{background:var(--agt-ink);color:var(--agt-card);border-color:var(--agt-ink)}
@container(max-width:680px){.agt-card{padding:9px 8px}.agt-card-head{gap:5px}.agt-status{font-size:9px!important;padding:0 3px}.agt-identity strong,.agt-name{font-size:12px}.agt-task{font-size:11px}.agt-first-level{gap:16px}.agt-canvas{--agt-card-width:calc((100% - 32px)/3)}.agt-children:not(.agt-first-level){margin-left:16px}}
@container(max-width:559px){.agt-depth-root>.agt-card{width:100%}.agt-first-level{display:grid;grid-template-columns:1fr;gap:14px;margin:18px 0 0 28px}.agt-first-level>.agt-branch:only-child,.agt-first-level>.agt-branch:nth-last-child(2):first-child{grid-column:auto}.agt-children:not(.agt-first-level){margin-left:28px;margin-top:14px}.agt-identity strong,.agt-name{font-size:13px}.agt-task{min-height:0;font-size:12px}.agt-card{padding:11px}.agt-status{font-size:10px!important}.agt-header{align-items:flex-start}.agt-header>div{gap:6px;font-size:10px}.agt-card-head{gap:8px}}
@keyframes agt-spin{to{transform:rotate(360deg)}}@keyframes agt-card-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}@keyframes agt-link-in{from{opacity:0;stroke-dasharray:800;stroke-dashoffset:800}to{opacity:.85;stroke-dasharray:800;stroke-dashoffset:0}}@keyframes agt-shimmer{to{background-position:-250% 0}}@media(prefers-reduced-motion:reduce){.agt-tree *{animation:none!important;transition:none!important}.agt-live-cost{color:var(--agt-ink);background:none}}
`;
export default AgentTree;
