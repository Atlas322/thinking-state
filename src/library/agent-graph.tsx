"use client";
import * as React from "react";

/** Independent implementation of the public contract; no affectUI Pro source. */
export type GraphNode = {
  id: string;
  name: string;
  kind: "agent" | "tool" | "user";
  short?: string;
  icon?: React.ReactNode;
  detail?: string;
  doing?: string;
  status?: "idle" | "working" | "waiting" | "error" | "done";
  cost?: number;
  lead?: boolean;
  /** Optional normalized canvas position for a fixed composition (0–1). */
  position?: { x: number; y: number };
};
export type GraphCall = {
  id: string;
  from: string;
  to: string;
  at: number;
  status?: "pending" | "ok" | "error";
  label?: string;
  ms?: number;
};
export type AgentGraphProps = {
  nodes?: GraphNode[];
  calls?: GraphCall[];
  edges?: [string, string][];
  now?: number;
  heatWindow?: number;
  onSelect?: (node: GraphNode | null) => void;
  height?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
};
type Point = { x: number; y: number };
type Pulse = {
  id: string;
  from: string;
  to: string;
  start: number;
  answer: boolean;
  error: boolean;
  user: boolean;
};
const emptyNodes: GraphNode[] = [],
  emptyCalls: GraphCall[] = [],
  emptyEdges: [string, string][] = [];
const money = (value: number) => `$${value.toFixed(2)}`;
const pair = (a: string, b: string) => JSON.stringify([a, b].sort());
const statusLabel = (status: GraphNode["status"]) =>
  ({
    idle: "Idle",
    working: "Working",
    waiting: "Needs you",
    error: "Failed",
    done: "Done",
  })[status ?? "idle"];

function layout(
  nodes: GraphNode[],
  links: [string, string][],
  width: number,
  height: number,
) {
  const points: Record<string, Point> = {};
  const cx = width / 2,
    cy = height * 0.47;
  const lead =
    nodes.find((n) => n.kind === "agent" && n.lead) ??
    nodes.find((n) => n.kind === "agent");
  if (lead) points[lead.id] = { x: cx, y: cy };
  const agents = nodes.filter((n) => n.kind === "agent" && n.id !== lead?.id);
  agents.forEach((node, i) => {
    const a = -Math.PI * 0.75 + (i * Math.PI * 2) / agents.length;
    points[node.id] = {
      x: cx + Math.cos(a) * width * 0.17,
      y: cy + Math.sin(a) * height * 0.18,
    };
  });
  const outer = nodes
    .filter((n) => n.kind !== "agent")
    .map((node) => {
      const peers = links
        .filter(([a, b]) => a === node.id || b === node.id)
        .map(([a, b]) => points[a === node.id ? b : a])
        .filter(Boolean);
      const p = peers.reduce(
        (sum, point) => ({ x: sum.x + point.x - cx, y: sum.y + point.y - cy }),
        { x: 0, y: 0 },
      );
      return { node, angle: Math.atan2(p.y, p.x) };
    })
    .sort((a, b) => a.angle - b.angle || a.node.id.localeCompare(b.node.id));
  outer.forEach(({ node }, i) => {
    const a =
      (outer[0]?.angle ?? -Math.PI / 2) + (i * Math.PI * 2) / outer.length;
    points[node.id] = {
      x: cx + Math.cos(a) * Math.max(60, cx - (width < 520 ? 44 : 56)),
      y: cy + Math.sin(a) * Math.max(70, height / 2 - 58),
    };
  });
  for (const node of nodes) {
    if (node.position)
      points[node.id] = {
        x: Math.min(width - 36, Math.max(36, node.position.x * width)),
        y: Math.min(height - 68, Math.max(48, node.position.y * height)),
      };
  }
  return points;
}

function graphRoute(from: Point, to: Point): Point[] {
  if (Math.abs(from.x - to.x) < 1 || Math.abs(from.y - to.y) < 1)
    return [from, to];
  const middle = (from.x + to.x) / 2;
  return [from, { x: middle, y: from.y }, { x: middle, y: to.y }, to];
}
function roundedPath(points: Point[]) {
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const previous = points[i - 1],
      corner = points[i],
      next = points[i + 1];
    const before = Math.hypot(corner.x - previous.x, corner.y - previous.y);
    const after = Math.hypot(next.x - corner.x, next.y - corner.y);
    if (!before || !after) continue;
    const r = Math.min(8, before / 2, after / 2);
    path += ` L${corner.x + ((previous.x - corner.x) * r) / before},${corner.y + ((previous.y - corner.y) * r) / before}`;
    path += ` Q${corner.x},${corner.y} ${corner.x + ((next.x - corner.x) * r) / after},${corner.y + ((next.y - corner.y) * r) / after}`;
  }
  return path + ` L${points.at(-1)!.x},${points.at(-1)!.y}`;
}

export function AgentGraph({
  nodes = emptyNodes,
  calls = emptyCalls,
  edges = emptyEdges,
  now,
  heatWindow = 20000,
  onSelect,
  height,
  formatCost = money,
  title = "Agent graph",
  className = "",
}: AgentGraphProps) {
  const root = React.useRef<HTMLElement>(null),
    closeButton = React.useRef<HTMLButtonElement>(null);
  const buttons = React.useRef(new Map<string, HTMLButtonElement>());
  const [width, setWidth] = React.useState(640),
    [clock, setClock] = React.useState(Date.now);
  const [selected, setSelected] = React.useState<string | null>(null),
    [hovered, setHovered] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState(true),
    [pageVisible, setPageVisible] = React.useState(true),
    [reduced, setReduced] = React.useState(false);
  const [frame, setFrame] = React.useState(0);
  const motion = React.useRef<
    Record<string, Point & { vx: number; vy: number }>
  >({});
  const pulses = React.useRef<Pulse[]>([]),
    seen = React.useRef(new Map<string, GraphCall["status"]>());
  const id = React.useId(),
    timestamp = now ?? clock,
    active = selected ?? hovered;
  const h = Math.max(
    160,
    height ?? Math.min(520, Math.max(360, width * (width < 520 ? 1.2 : 0.7))),
  );
  const unique = React.useMemo(
    () => [...new Map(nodes.map((node) => [node.id, node])).values()],
    [nodes],
  );
  const ids = React.useMemo(
    () => new Set(unique.map((node) => node.id)),
    [unique],
  );
  const validCalls = React.useMemo(
    () =>
      calls.filter(
        (call) =>
          ids.has(call.from) && ids.has(call.to) && call.from !== call.to,
      ),
    [calls, ids],
  );
  const links = React.useMemo(() => {
    const values = new Map<string, [string, string]>();
    [
      ...edges,
      ...validCalls.map((call) => [call.from, call.to] as [string, string]),
    ].forEach(([a, b]) => {
      if (a !== b && ids.has(a) && ids.has(b))
        values.set(pair(a, b), [a, b].sort() as [string, string]);
    });
    return [...values.values()];
  }, [edges, validCalls, ids]);
  const targets = React.useMemo(
    () => layout(unique, links, width, h),
    [unique, links, width, h],
  );
  const targetRef = React.useRef(targets);
  targetRef.current = targets;
  React.useLayoutEffect(() => {
    if (!root.current) return;
    const measure = () => {
      const w = root.current?.getBoundingClientRect().width;
      if (w) setWidth(w);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => setReduced(media.matches);
    changed();
    media.addEventListener?.("change", changed);
    const visibility = () => setPageVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined" && root.current) {
      observer = new IntersectionObserver((entries) =>
        setVisible(entries.some((entry) => entry.isIntersecting)),
      );
      observer.observe(root.current);
    }
    return () => {
      media.removeEventListener?.("change", changed);
      document.removeEventListener("visibilitychange", visibility);
      observer?.disconnect();
    };
  }, []);
  React.useEffect(() => {
    if (now !== undefined || !visible || !pageVisible) return;
    setClock(Date.now());
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [now, visible, pageVisible]);
  React.useEffect(() => {
    const start = performance.now();
    validCalls.forEach((call) => {
      const isNew = !seen.current.has(call.id),
        previous = seen.current.get(call.id);
      const recent = timestamp - call.at >= 0 && timestamp - call.at <= 4000;
      const user = unique.find((node) => node.id === call.to)?.kind === "user";
      if (isNew && recent)
        pulses.current.push({
          id: `${call.id}-request-${start}`,
          from: call.from,
          to: call.to,
          start,
          answer: false,
          error: false,
          user,
        });
      if (
        ((isNew && recent) || (!isNew && previous !== call.status)) &&
        (call.status === "ok" || call.status === "error")
      )
        pulses.current.push({
          id: `${call.id}-answer-${start}`,
          from: call.to,
          to: call.from,
          start: start + (isNew ? 900 : 0),
          answer: true,
          error: call.status === "error",
          user,
        });
      seen.current.set(call.id, call.status);
    });
    for (const key of seen.current.keys())
      if (!validCalls.some((call) => call.id === key)) seen.current.delete(key);
    setFrame(start);
  }, [validCalls, unique, timestamp]);
  React.useEffect(() => {
    if (!visible || !pageVisible) return;
    let animation = 0,
      previous = performance.now();
    const tick = (time: number) => {
      const dt = Math.min(2, Math.max(0.01, (time - previous) / 16.667));
      previous = time;
      let moving = false;
      Object.entries(targetRef.current).forEach(([key, target]) => {
        const p = motion.current[key] ?? { ...target, vx: 0, vy: 0 };
        if (reduced) {
          p.x = target.x;
          p.y = target.y;
          p.vx = p.vy = 0;
        } else {
          p.vx = (p.vx + (target.x - p.x) * 0.085 * dt) * Math.pow(0.64, dt);
          p.vy = (p.vy + (target.y - p.y) * 0.085 * dt) * Math.pow(0.64, dt);
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        if (Math.abs(target.x - p.x) + Math.abs(target.y - p.y) > 0.05)
          moving = true;
        else {
          p.x = target.x;
          p.y = target.y;
          p.vx = p.vy = 0;
        }
        motion.current[key] = p;
      });
      for (const key of Object.keys(motion.current))
        if (!targetRef.current[key]) delete motion.current[key];
      pulses.current = pulses.current.filter(
        (pulse) => time - pulse.start < 1100,
      );
      setFrame(time);
      if (moving || pulses.current.length)
        animation = window.requestAnimationFrame(tick);
    };
    animation = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animation);
  }, [visible, pageVisible, reduced, targets, validCalls]);
  React.useEffect(() => {
    if (selected) closeButton.current?.focus();
  }, [selected]);
  React.useEffect(() => {
    if (selected && !ids.has(selected)) {
      setSelected(null);
      onSelect?.(null);
    }
  }, [selected, ids, onSelect]);
  const choose = (node: GraphNode) => {
    const next = selected === node.id ? null : node.id;
    setSelected(next);
    onSelect?.(next ? node : null);
  };
  const close = () => {
    if (!selected) return;
    const old = selected;
    setSelected(null);
    onSelect?.(null);
    buttons.current.get(old)?.focus();
  };
  const current = unique.find((node) => node.id === selected),
    lead =
      unique.find((node) => node.kind === "agent" && node.lead) ??
      unique.find((node) => node.kind === "agent");
  const recent = validCalls.filter(
    (call) => timestamp >= call.at && timestamp - call.at <= 60000,
  );
  const heat = new Map(
    links.map(([a, b]) => [
      pair(a, b),
      validCalls.filter(
        (call) =>
          pair(call.from, call.to) === pair(a, b) &&
          timestamp >= call.at &&
          timestamp - call.at <= Math.max(1, heatWindow),
      ).length,
    ]),
  );
  const neighbours = new Set(
    active
      ? [
          active,
          ...links.filter(([a, b]) => a === active || b === active).flat(),
        ]
      : [],
  );
  const position = (nodeId: string) =>
    reduced ? targets[nodeId] : (motion.current[nodeId] ?? targets[nodeId]);
  return (
    <section
      ref={root}
      className={`agg-root ${className}`}
      aria-labelledby={`${id}-title`}
      data-paused={!visible || !pageVisible}
      onKeyDown={(event) => {
        if (event.key === "Escape" && selected) {
          event.preventDefault();
          close();
        }
      }}
    >
      <style>{css}</style>
      <header className="agg-header">
        <div>
          <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
            <path
              d="m4 4 6 6 7-6M10 10l6 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="4" cy="4" r="2" />
            <circle cx="10" cy="10" r="3" />
            <circle cx="17" cy="4" r="2" />
            <circle cx="16" cy="17" r="2" />
          </svg>
          <h3 id={`${id}-title`}>{title}</h3>
        </div>
        <div className="agg-stats">
          <span>
            {unique.filter((node) => node.kind === "agent").length} agents
          </span>
          <span>
            {unique.filter((node) => node.kind === "tool").length} tools
          </span>
          <span>{recent.length} calls/min</span>
          <strong>
            {formatCost(
              unique.reduce(
                (sum, node) =>
                  sum + (Number.isFinite(node.cost) ? (node.cost ?? 0) : 0),
                0,
              ),
            )}
          </strong>
        </div>
      </header>
      <div className="agg-alerts" aria-live="polite">
        {unique
          .filter(
            (node) => node.status === "waiting" || node.status === "error",
          )
          .map((node) => (
            <button
              type="button"
              key={node.id}
              data-status={node.status}
              onClick={() => choose(node)}
            >
              {node.name} · {statusLabel(node.status)}
            </button>
          ))}
      </div>
      <div className="agg-canvas" style={{ height: h }}>
        <svg
          className="agg-links"
          viewBox={`0 0 ${width} ${h}`}
          width="100%"
          height="100%"
          aria-hidden="true"
          onClick={close}
        >
          <defs>
            {[
              ["call", "var(--agg-pulse)"],
              ["answer", "var(--agg-answer)"],
              ["user", "var(--agg-amber)"],
              ["error", "var(--agg-red)"],
            ].map(([name, color]) => (
              <linearGradient
                id={`${id}-${name}`}
                key={name}
                gradientUnits="userSpaceOnUse"
                x1={0}
                x2={width}
              >
                <stop offset="0%" stopColor={color} stopOpacity=".08" />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            ))}
          </defs>
          {links.map(([a, b]) => {
            const from = position(a),
              to = position(b);
            if (!from || !to) return null;
            const route = graphRoute(from, to),
              flashing = pulses.current.filter(
                (p) =>
                  pair(p.from, p.to) === pair(a, b) &&
                  frame >= p.start &&
                  frame - p.start <= 1100,
              );
            return (
              <path
                key={pair(a, b)}
                data-graph-link={pair(a, b)}
                className="agg-link"
                data-lit={!!flashing.length || active === a || active === b}
                data-error={flashing.some((p) => p.error)}
                d={roundedPath(route)}
                strokeWidth={
                  1.25 + 1.25 * Math.min(1, (heat.get(pair(a, b)) ?? 0) / 10)
                }
                style={{
                  opacity:
                    active && active !== a && active !== b ? 0.15 : undefined,
                }}
              />
            );
          })}
          {!reduced &&
            pulses.current.map((pulse) => {
              const t = (frame - pulse.start) / 900,
                from = position(pulse.from),
                to = position(pulse.to);
              if (!from || !to || t < 0 || t > 1) return null;
              const [a, b] = [pulse.from, pulse.to].sort();
              const points = graphRoute(position(a), position(b));
              if (pulse.from !== a) points.reverse();
              return (
                <path
                  key={pulse.id}
                  className="agg-pulse"
                  data-answer={pulse.answer}
                  data-error={pulse.error}
                  data-user={pulse.user}
                  d={roundedPath(points)}
                  pathLength={100}
                  strokeDasharray="7 100"
                  strokeDashoffset={-t * 100}
                  stroke={`url(#${id}-${pulse.error ? "error" : pulse.user ? "user" : pulse.answer ? "answer" : "call"})`}
                />
              );
            })}
        </svg>
        {unique.map((node) => {
          const p = position(node.id);
          if (!p) return null;
          return (
            <button
              type="button"
              key={node.id}
              ref={(element) => {
                if (element) buttons.current.set(node.id, element);
                else buttons.current.delete(node.id);
              }}
              className="agg-node"
              data-node-id={node.id}
              data-kind={node.kind}
              data-label-above={node.kind !== "agent" && p.y < h * 0.25}
              data-status={node.status ?? "idle"}
              data-lead={lead?.id === node.id}
              data-dimmed={!!active && !neighbours.has(node.id)}
              style={{ left: p.x, top: p.y }}
              aria-label={`${node.name}, ${node.kind}, ${statusLabel(node.status)}${node.doing ? `, ${node.doing}` : ""}, ${recent.filter((call) => call.from === node.id).length} calls in the last minute`}
              aria-expanded={selected === node.id}
              aria-controls={selected === node.id ? `${id}-card` : undefined}
              onClick={() => choose(node)}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
            >
              <span className="agg-node-icon">
                {node.icon ??
                  (node.kind === "user" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M5 21v-3a7 7 0 0 1 14 0v3" />
                    </svg>
                  ) : (
                    node.name
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                  ))}
                {(node.status === "waiting" || node.status === "error") && (
                  <i>{node.status === "error" ? "!" : "◷"}</i>
                )}
              </span>
              <strong>
                {width < 520 ? (node.short ?? node.name) : node.name}
              </strong>
              {node.status === "waiting" || node.status === "error" ? (
                <small className="agg-node-status">
                  {statusLabel(node.status)}
                </small>
              ) : node.kind === "agent" && width >= 520 && node.detail ? (
                <small>{node.detail}</small>
              ) : null}
            </button>
          );
        })}
        {!unique.length && <p className="agg-empty">No agents connected</p>}
        {current && (
          <div
            id={`${id}-card`}
            className="agg-card"
            role="dialog"
            aria-label={`${current.name} details`}
          >
            <div className="agg-card-heading">
              <span>{current.name}</span>
              <button
                ref={closeButton}
                type="button"
                onClick={close}
                aria-label={`Close ${current.name} details`}
              >
                ×
              </button>
            </div>
            <small>
              {current.detail ?? current.kind} · {statusLabel(current.status)}
            </small>
            {current.doing && <p>{current.doing}</p>}
            <div className="agg-card-meta">
              <span>
                {
                  recent.filter(
                    (call) =>
                      call.from === current.id || call.to === current.id,
                  ).length
                }{" "}
                recent calls
              </span>
              <strong>{formatCost(current.cost ?? 0)}</strong>
            </div>
            <ul>
              {[...validCalls]
                .filter(
                  (call) => call.from === current.id || call.to === current.id,
                )
                .sort((a, b) => b.at - a.at)
                .slice(0, 5)
                .map((call) => (
                  <li key={call.id}>
                    <span>
                      {call.label ??
                        `${unique.find((node) => node.id === call.from)?.name} → ${unique.find((node) => node.id === call.to)?.name}`}
                    </span>
                    <small>
                      {call.status ?? "pending"}
                      {call.ms === undefined ? "" : ` · ${call.ms} ms`}
                    </small>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      <ul className="agg-sr" aria-label="Network description">
        {unique.map((node) => (
          <li key={node.id}>
            {node.name}, {node.kind}, {statusLabel(node.status)},{" "}
            {formatCost(node.cost ?? 0)}.{" "}
            {unique
              .filter((other) =>
                recent.some(
                  (call) => call.from === node.id && call.to === other.id,
                ),
              )
              .map(
                (other) =>
                  `Called ${other.name} ${recent.filter((call) => call.from === node.id && call.to === other.id).length} times in the last minute.`,
              )
              .join(" ")}
          </li>
        ))}
      </ul>
      <footer className="agg-footer" aria-label="Call legend">
        <span>
          <i style={{ "--color": "var(--agg-pulse)" } as React.CSSProperties} />
          Call
        </span>
        <span>
          <i
            style={{ "--color": "var(--agg-answer)" } as React.CSSProperties}
          />
          Answer
        </span>
        <span>
          <i style={{ "--color": "var(--agg-amber)" } as React.CSSProperties} />
          Needs you
        </span>
        <span>
          <i style={{ "--color": "var(--agg-red)" } as React.CSSProperties} />
          Failed
        </span>
      </footer>
    </section>
  );
}

const css = `
.agg-root{--agg-bg:#fff;--agg-canvas:#fafafa;--agg-node-bg:#fff;--agg-fg:#323236;--agg-muted:#96969b;--agg-edge:rgba(0,0,0,.075);--agg-soft:#f5f5f6;--agg-link:#e1e2e6;--agg-pulse:#6db5fa;--agg-answer:#34ca82;--agg-amber:#e49b5b;--agg-red:#e76c79;position:relative;width:100%;max-width:720px;min-width:0;color:var(--agg-fg);font:13px/1.5 Inter,system-ui,sans-serif;container:agg/inline-size;isolation:isolate}
:where(.dark,[data-theme=dark]) .agg-root{--agg-bg:#202022;--agg-canvas:#1d1d1f;--agg-node-bg:#242426;--agg-fg:#ededee;--agg-muted:#89898d;--agg-edge:#303033;--agg-soft:#242426;--agg-link:#343437;color-scheme:dark}.agg-root *{box-sizing:border-box}.agg-root button{font:inherit;cursor:pointer;color:inherit}.agg-root :focus-visible{outline:2px solid var(--agg-pulse);outline-offset:5px}.agg-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 0 18px;min-height:42px}.agg-header>div{display:flex;gap:10px;align-items:center}.agg-header h3{font-size:14px;font-weight:500;margin:0}.agg-header svg{width:17px;height:17px;color:var(--agg-pulse)}.agg-stats{color:var(--agg-muted);font-size:12px;gap:12px!important;white-space:nowrap;font-variant-numeric:tabular-nums}.agg-stats strong{font-weight:400;color:var(--agg-fg);margin-left:14px}.agg-alerts{position:absolute;top:54px;left:12px;right:12px;display:flex;gap:6px;flex-wrap:wrap;z-index:2;pointer-events:none}.agg-alerts button{pointer-events:auto;border:1px solid color-mix(in srgb,var(--agg-amber) 18%,transparent);color:var(--agg-amber);background:color-mix(in srgb,var(--agg-amber) 6%,var(--agg-bg));padding:3px 7px;border-radius:5px;font-size:9px}.agg-alerts button[data-status=error]{color:var(--agg-red);border-color:color-mix(in srgb,var(--agg-red) 18%,transparent)}.agg-canvas{position:relative;background:var(--agg-canvas);border:1px solid var(--agg-edge);border-radius:12px;overflow:hidden}.agg-links{position:absolute;inset:0;overflow:visible}.agg-link{stroke:var(--agg-link);fill:none;stroke-linecap:round;opacity:.9;transition:stroke-width .7s,opacity .2s}.agg-link[data-lit=true]{opacity:1}.agg-link[data-error=true]{stroke:color-mix(in srgb,var(--agg-red) 40%,var(--agg-link))}.agg-pulse{fill:none;stroke-width:1.8;stroke-linecap:round}.agg-node{--agg-size:36px;position:absolute;transform:translate(-50%,-50%);border:0;background:none;padding:0;width:var(--agg-size);height:var(--agg-size);z-index:1;transition:opacity .2s}.agg-node[data-kind=agent]{--agg-size:48px}.agg-node[data-lead=true]{--agg-size:58px}.agg-node[data-dimmed=true]{opacity:.4}.agg-node-icon{display:grid;place-items:center;position:relative;width:100%;height:100%;border:1px solid var(--agg-edge);border-radius:11px;background:var(--agg-node-bg);box-shadow:0 2px 2px #00000008;font-size:14px;font-weight:500;isolation:isolate}.agg-node-icon>svg,.agg-node-icon>img{width:18px;height:18px;object-fit:contain}.agg-node[data-kind=agent] .agg-node-icon{border-radius:15px}.agg-node[data-kind=agent] .agg-node-icon>svg{width:23px;height:23px}.agg-node[data-lead=true] .agg-node-icon{border-radius:18px}.agg-node[data-lead=true] .agg-node-icon>svg{width:29px;height:29px}.agg-node[data-kind=user] .agg-node-icon{background:#ececec;color:#151516;border-color:#d4d4d4;box-shadow:inset 0 1px 2px #0002}.agg-node[data-status=working] .agg-node-icon:before,.agg-node[data-status=waiting] .agg-node-icon:before{content:'';position:absolute;inset:-7px;border:6px solid color-mix(in srgb,var(--agg-pulse) 15%,transparent);border-radius:22px;z-index:-1;animation:agg-breathe 2.8s ease-in-out infinite}.agg-node[data-lead=true] .agg-node-icon:before{inset:-9px;border-width:8px;border-radius:27px}.agg-node[data-status=waiting] .agg-node-icon:before{border-color:color-mix(in srgb,var(--agg-amber) 18%,transparent);animation-duration:1.9s}.agg-node:nth-of-type(2n) .agg-node-icon:before{animation-delay:-1.3s}.agg-node-icon i{position:absolute;right:-3px;bottom:-1px;display:grid;place-items:center;width:15px;height:15px;border-radius:50%;font:10px/1 Inter,system-ui;background:var(--agg-node-bg);color:var(--agg-amber);border:1px solid var(--agg-edge)}.agg-node[data-status=error] .agg-node-icon i{color:var(--agg-red)}.agg-node strong,.agg-node small{position:absolute;left:50%;transform:translateX(-50%);display:block;width:max-content;max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--agg-canvas);border-radius:3px;padding:0 2px;pointer-events:none}.agg-node strong{top:calc(100% + 5px);font-size:12px;font-weight:400;color:var(--agg-muted)}.agg-node[data-kind=agent] strong{font-size:13px;font-weight:500;color:var(--agg-fg);top:calc(100% + 5px)}.agg-node small{top:calc(100% + 23px);font-size:11px;color:var(--agg-muted)}.agg-node[data-label-above=true] strong{top:auto;bottom:calc(100% + 6px)}.agg-node-status{color:var(--agg-amber)!important}.agg-node[data-status=error] .agg-node-status{color:var(--agg-red)!important}.agg-node[aria-expanded=true] .agg-node-icon{outline:1px solid var(--agg-pulse);outline-offset:4px}.agg-card{position:absolute;right:14px;bottom:42px;width:260px;max-width:calc(100% - 28px);z-index:4;background:var(--agg-node-bg);border:1px solid var(--agg-edge);border-radius:11px;padding:12px;box-shadow:0 8px 35px #0002;animation:agg-enter .18s ease-out}.agg-card-heading{display:flex;gap:10px;justify-content:space-between;align-items:center;font-size:12px;font-weight:500}.agg-card-heading button{border:0;background:var(--agg-soft);border-radius:5px;width:24px;height:24px;font-size:17px;padding:0}.agg-card small{font-size:10px;color:var(--agg-muted)}.agg-card p{font-size:11px;margin:12px 0}.agg-card-meta{display:flex;justify-content:space-between;margin:12px 0 4px;font-size:10px}.agg-card-meta span{color:var(--agg-muted)}.agg-card-meta strong{font-weight:500}.agg-card ul{list-style:none;margin:0;padding:0;max-height:140px;overflow:auto}.agg-card li{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:10px;padding:7px 0;border-top:1px solid var(--agg-edge)}.agg-card li>span{overflow-wrap:anywhere}.agg-card li small{white-space:nowrap;font-size:9px}.agg-footer{position:absolute;bottom:12px;left:0;right:0;display:flex;justify-content:center;gap:18px;color:var(--agg-muted);font-size:11px;pointer-events:none}.agg-footer span{display:flex;align-items:center;gap:7px}.agg-footer i{width:17px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--color,var(--agg-pulse)))}.agg-empty{position:absolute;inset:0;display:grid;place-items:center;color:var(--agg-muted)}.agg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.agg-root[data-paused=true] *{animation-play-state:paused!important}@container agg(max-width:520px){.agg-header{gap:8px;padding-bottom:14px}.agg-stats{gap:7px!important;font-size:10px}.agg-stats>span:first-child{display:none}.agg-stats strong{margin-left:3px}.agg-node{--agg-size:30px}.agg-node[data-kind=agent]{--agg-size:38px}.agg-node[data-lead=true]{--agg-size:46px}.agg-node[data-kind=agent] .agg-node-icon{border-radius:12px}.agg-node[data-kind=agent] .agg-node-icon>svg{width:20px;height:20px}.agg-node[data-lead=true] .agg-node-icon>svg{width:25px;height:25px}.agg-node strong{font-size:10px;max-width:84px}.agg-node[data-kind=agent] strong{font-size:10px}.agg-node small{font-size:9px;max-width:92px}.agg-node-icon:before{inset:-5px!important;border-width:4px!important;border-radius:17px!important}.agg-card{left:12px;right:12px;bottom:40px;width:auto;max-width:none}.agg-footer{gap:11px;font-size:9px;bottom:11px}.agg-footer i{width:12px}.agg-alerts{top:48px}.agg-header h3{font-size:12px}}
@keyframes agg-breathe{0%,100%{opacity:.35}50%{opacity:1}}@keyframes agg-enter{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.agg-root *{animation:none!important;transition:none!important}}
`;

// Brand paths: Simple Icons (CC0), v16.37.0; OpenAI v14.0.0. Brand names remain their owners' trademarks.
const graphBrandPaths = {
  claude:
    "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  openai:
    "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  googlegemini:
    "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  stripe:
    "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z",
  notion:
    "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  hubspot:
    "M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z",
};
export function GraphBrandIcon({
  brand,
}: {
  brand: keyof typeof graphBrandPaths | "slack" | "search" | "database" | "you";
}) {
  if (brand === "slack")
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="1" y="5" width="7" height="3" rx="1.5" fill="#36c5f0" />
        <circle cx="6.5" cy="2.5" r="1.5" fill="#36c5f0" />
        <rect x="8" y="1" width="3" height="7" rx="1.5" fill="#2eb67d" />
        <circle cx="13.5" cy="6.5" r="1.5" fill="#2eb67d" />
        <rect x="8" y="8" width="7" height="3" rx="1.5" fill="#ecb22e" />
        <circle cx="9.5" cy="13.5" r="1.5" fill="#ecb22e" />
        <rect x="5" y="8" width="3" height="7" rx="1.5" fill="#e01e5a" />
        <circle cx="2.5" cy="9.5" r="1.5" fill="#e01e5a" />
      </svg>
    );
  if (brand === "search")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#326dff"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <path d="m16 16 5 5" />
      </svg>
    );
  if (brand === "database")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0fa899"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v14c0 4 14 4 14 0V5M5 12c0 4 14 4 14 0" />
      </svg>
    );
  if (brand === "you")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9 3h12v12h-6V9H9ZM3 9h6v6h6v6H3Z" />
      </svg>
    );
  if (brand === "stripe")
    return (
      <svg viewBox="0 0 30 30" aria-hidden="true">
        <rect width="30" height="30" rx="7" fill="#635bff" />
        <path
          d={graphBrandPaths.stripe}
          transform="translate(6 6) scale(.75)"
          fill="#fff"
        />
      </svg>
    );
  const color =
    brand === "claude"
      ? "#d97757"
      : brand === "googlegemini"
        ? "#4f65ff"
        : brand === "hubspot"
          ? "#ff7a59"
          : "currentColor";
  return (
    <svg viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d={graphBrandPaths[brand]} />
    </svg>
  );
}

export default function Demo() {
  const nodes: GraphNode[] = React.useMemo(
    () => [
      {
        id: "lead",
        name: "Orchestrator",
        kind: "agent",
        detail: "Opus 5.5",
        lead: true,
        status: "working",
        doing: "Preparing the launch plan",
        cost: 5.8,
        icon: <GraphBrandIcon brand="claude" />,
        position: { x: 0.5, y: 0.47 },
      },
      {
        id: "writer",
        name: "Writer",
        kind: "agent",
        detail: "Sonnet 5.5",
        status: "working",
        doing: "Drafting launch copy",
        cost: 3,
        icon: <GraphBrandIcon brand="claude" />,
        position: { x: 0.38, y: 0.344 },
      },
      {
        id: "research",
        name: "Researcher",
        kind: "agent",
        detail: "Sonnet 5.5",
        status: "working",
        doing: "Comparing competitor pricing",
        cost: 3.2,
        icon: <GraphBrandIcon brand="claude" />,
        position: { x: 0.62, y: 0.344 },
      },
      {
        id: "analyst",
        name: "Analyst",
        kind: "agent",
        detail: "Gemini 3.8 Pro",
        status: "working",
        doing: "Analyzing customer segments",
        cost: 2.2,
        icon: <GraphBrandIcon brand="googlegemini" />,
        position: { x: 0.62, y: 0.595 },
      },
      {
        id: "coder",
        name: "Coder",
        kind: "agent",
        detail: "GPT-6 Sol",
        status: "working",
        doing: "Building the pricing page",
        cost: 3.8,
        icon: <GraphBrandIcon brand="openai" />,
        position: { x: 0.38, y: 0.595 },
      },
      {
        id: "you",
        name: "You",
        kind: "user",
        icon: <GraphBrandIcon brand="you" />,
        position: { x: 0.346, y: 0.178 },
      },
      {
        id: "notion",
        name: "Notion",
        kind: "tool",
        icon: <GraphBrandIcon brand="notion" />,
        position: { x: 0.591, y: 0.16 },
      },
      {
        id: "web",
        name: "Web search",
        short: "Search",
        kind: "tool",
        icon: <GraphBrandIcon brand="search" />,
        position: { x: 0.817, y: 0.344 },
      },
      {
        id: "hubspot",
        name: "HubSpot",
        kind: "tool",
        icon: <GraphBrandIcon brand="hubspot" />,
        position: { x: 0.862, y: 0.595 },
      },
      {
        id: "database",
        name: "Database",
        kind: "tool",
        icon: <GraphBrandIcon brand="database" />,
        position: { x: 0.653, y: 0.763 },
      },
      {
        id: "github",
        name: "GitHub",
        kind: "tool",
        icon: <GraphBrandIcon brand="github" />,
        position: { x: 0.409, y: 0.779 },
      },
      {
        id: "stripe",
        name: "Stripe",
        kind: "tool",
        icon: <GraphBrandIcon brand="stripe" />,
        position: { x: 0.184, y: 0.595 },
      },
      {
        id: "slack",
        name: "Slack",
        kind: "tool",
        icon: <GraphBrandIcon brand="slack" />,
        position: { x: 0.138, y: 0.344 },
      },
    ],
    [],
  );
  const edges: [string, string][] = React.useMemo(
    () => [
      ["you", "lead"],
      ["lead", "research"],
      ["lead", "writer"],
      ["lead", "coder"],
      ["lead", "analyst"],
      ["research", "web"],
      ["research", "notion"],
      ["writer", "notion"],
      ["coder", "github"],
      ["coder", "stripe"],
      ["writer", "slack"],
      ["writer", "you"],
      ["analyst", "database"],
      ["analyst", "hubspot"],
    ],
    [],
  );
  const [calls, setCalls] = React.useState<GraphCall[]>(() =>
    Array.from({ length: 168 }, (_, i) => {
      const [from, to] = edges[i % edges.length];
      return {
        id: `past-${i}`,
        from,
        to,
        at: Date.now() - 60000 + i * 357,
        status: "ok",
        ms: 820,
        label: "Read latest changes",
      };
    }),
  );
  const counter = React.useRef(0);
  React.useEffect(() => {
    const responses = new Set<number>();
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const index = counter.current++,
        [from, to] = edges[index % edges.length],
        callId = `demo-${index}`;
      setCalls((current) => [
        ...current.slice(-199),
        {
          id: callId,
          from,
          to,
          at: Date.now(),
          status: "pending",
          label: [
            "Read latest changes",
            "Review the draft",
            "Check pricing",
            "Run the checks",
          ][index % 4],
        },
      ]);
      const response = window.setTimeout(() => {
        responses.delete(response);
        setCalls((current) =>
          current.map((call) =>
            call.id === callId ? { ...call, status: "ok", ms: 1200 } : call,
          ),
        );
      }, 1200);
      responses.add(response);
    }, 357);
    return () => {
      window.clearInterval(timer);
      responses.forEach((response) => window.clearTimeout(response));
    };
  }, [edges]);
  return (
    <AgentGraph
      nodes={nodes}
      calls={calls}
      edges={edges}
      formatCost={(value) =>
        `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      }
    />
  );
}
