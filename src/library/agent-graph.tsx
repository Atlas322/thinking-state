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
    idle: "Сул",
    working: "Ажиллаж байна",
    waiting: "Таны ээлж",
    error: "Алдаатай",
    done: "Дууссан",
  })[status ?? "idle"];
const kindLabel = (kind: GraphNode["kind"]) => ({ agent: "агент", tool: "хэрэгсэл", user: "хэрэглэгч" })[kind] ?? kind;
const callStatusLabel = (status: GraphCall["status"]) => ({ pending: "хүлээж байна", ok: "амжилттай", error: "алдаа" })[status ?? "ok"];

function layout(
  nodes: GraphNode[],
  links: [string, string][],
  width: number,
  height: number,
) {
  const points: Record<string, Point> = {};
  const cx = width / 2,
    cy = height * 0.5;
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
        y: Math.min(height - 48, Math.max(48, node.position.y * height)),
      };
  }
  return points;
}

// Pick one orthogonal bend, avoiding intervening tiles where possible.
function graphRoute(from: Point, to: Point, obstacles: Point[] = []): Point[] {
  if (Math.abs(from.x - to.x) < 1 || Math.abs(from.y - to.y) < 1) return [from, to];
  const candidates = [{ x: from.x, y: to.y }, { x: to.x, y: from.y }];
  const hits = (corner: Point) => obstacles.filter(p => {
    if (Math.hypot(p.x - from.x, p.y - from.y) < 1 || Math.hypot(p.x - to.x, p.y - to.y) < 1) return false;
    return [[from, corner], [corner, to]].some(([a,b]) => {
      const dx=b.x-a.x, dy=b.y-a.y, length=dx*dx+dy*dy;
      const t=length ? Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/length)) : 0;
      return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)<30;
    });
  }).length;
  return [from, hits(candidates[0]) <= hits(candidates[1]) ? candidates[0] : candidates[1], to];
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
  title = "Агентын сүлжээ",
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
    height ?? (width < 520 ? 600 : Math.min(520, Math.max(360, width * 0.6)) + 32),
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
    if (typeof ResizeObserver === "undefined") return;
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
  // Clean links remain uniformly 1.5px; heatWindow is retained for API compatibility.
  void heatWindow;
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
  const routes = new Map(links.map(([a, b]) => [
    pair(a, b), graphRoute(position(a), position(b), unique.map(n => position(n.id))),
  ]));
  type Port = { key: string; end: 0 | 1; other: number; vertical: boolean; offset: number };
  const ports = new Map<string, Port[]>();
  const routePorts = new Map<string, Port[]>();
  links.forEach(([a, b]) => {
    const key = pair(a, b), route = routes.get(key)!;
    const ends = [a, b].map((node, end) => {
      const p = route[end ? route.length - 1 : 0];
      const near = route[end ? route.length - 2 : 1];
      const vertical = Math.abs(p.x - near.x) < 1;
      const side = vertical ? (near.y > p.y ? "bottom" : "top") : (near.x > p.x ? "right" : "left");
      const port: Port = {
        key, end: end as 0 | 1, vertical, offset: 0,
        other: vertical ? position(end ? a : b).x : position(end ? a : b).y,
      };
      const group = node + ":" + side;
      const list = ports.get(group) ?? [];
      list.push(port);
      ports.set(group, list);
      return port;
    });
    routePorts.set(key, ends);
  });
  ports.forEach(list => {
    list.sort((a, b) => a.other - b.other || a.key.localeCompare(b.key));
    list.forEach((port, i) => {
      port.offset = (i - (list.length - 1) / 2) * (width < 520 ? 6 : 8);
    });
  });
  // Compute both attachments from the original route together. Mutating the
  // corner while assigning ports can misclassify the opposite attachment.
  routes.forEach((route, key) => {
    const [startPort, endPort] = routePorts.get(key)!;
    const shift = (p: Point, port: Port): Point => port.vertical
      ? { x: p.x + port.offset, y: p.y }
      : { x: p.x, y: p.y + port.offset };
    const from = shift(route[0], startPort);
    const to = shift(route[route.length - 1], endPort);
    if (route.length > 2) {
      routes.set(key, [from, startPort.vertical ? { x: from.x, y: to.y } : { x: to.x, y: from.y }, to]);
    } else if (startPort.vertical ? from.x === to.x : from.y === to.y) {
      routes.set(key, [from, to]);
    } else {
      // Different port offsets on an otherwise straight link need two short
      // orthogonal turns; connecting the shifted ends directly would be diagonal.
      const middle = startPort.vertical ? (from.y + to.y) / 2 : (from.x + to.x) / 2;
      routes.set(key, startPort.vertical
        ? [from, { x: from.x, y: middle }, { x: to.x, y: middle }, to]
        : [from, { x: middle, y: from.y }, { x: middle, y: to.y }, to]);
    }
  });
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
            {unique.filter((node) => node.kind === "agent").length} агент
          </span>
          <span>
            {unique.filter((node) => node.kind === "tool").length} хэрэгсэл
          </span>
          <span>{recent.length} дуудлага/мин</span>
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
      <div className="agg-canvas" style={{ height: h + 26 }}>
        <svg
          className="agg-links"
          viewBox={`0 0 ${width} ${h}`}
          width="100%"
          height={h}
          aria-hidden="true"
          onClick={close}
        >
          <defs>
            {!reduced && pulses.current.map((pulse, index) => {
              const from = position(pulse.from), to = position(pulse.to);
              if (!from || !to) return null;
              const color = pulse.error ? "var(--agg-red)" : pulse.user
                ? "var(--agg-amber)" : pulse.answer ? "var(--agg-answer)" : "var(--agg-pulse)";
              return (
                <linearGradient
                  id={`${id}-pulse-${index}`}
                  key={pulse.id}
                  gradientUnits="userSpaceOnUse"
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                >
                  <stop offset="0%" stopColor={color} stopOpacity=".08" />
                  <stop offset="100%" stopColor={color} />
                </linearGradient>
              );
            })}
          </defs>
          {links.map(([a, b]) => {
            const from = position(a),
              to = position(b);
            if (!from || !to) return null;
            const route = routes.get(pair(a,b))!,
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
                strokeWidth={1.5}
                style={{
                  opacity:
                    active && active !== a && active !== b ? 0.15 : undefined,
                }}
              />
            );
          })}
          {!reduced &&
            pulses.current.map((pulse, index) => {
              const t = (frame - pulse.start) / 900,
                from = position(pulse.from),
                to = position(pulse.to);
              if (!from || !to || t < 0 || t > 1) return null;
              const [a, b] = [pulse.from, pulse.to].sort();
              const route = routes.get(pair(a,b));
              if (!route) return null;
              const points = [...route];
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
                  stroke={`url(#${id}-pulse-${index})`}
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
              style={{
                left: p.x,
                top: p.y,
                // Centered labels must also fit when a fixed node is near an edge.
                "--agg-label-room": `${Math.max(0, Math.min(p.x, width - p.x) * 2 - 16)}px`,
              } as React.CSSProperties}
              aria-label={`${node.name}, ${kindLabel(node.kind)}, ${statusLabel(node.status)}${node.doing ? `, ${node.doing}` : ""}, сүүлийн минутад ${recent.filter((call) => call.from === node.id || call.to === node.id).length} дуудлага`}
              aria-haspopup="dialog"
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
        {!unique.length && <p className="agg-empty">Холбогдсон агент алга</p>}
        {current && (
          <div
            id={`${id}-card`}
            className="agg-card"
            style={width >= 520 ? {left: position(current.id).x > width/2 ? Math.max(14,position(current.id).x-302) : Math.min(width-274,position(current.id).x+42), top:Math.max(14,Math.min(h-239,position(current.id).y-112.5)),right:'auto',bottom:'auto'} : undefined}
            role="dialog"
            aria-label={`${current.name}: дэлгэрэнгүй`}
          >
            <div className="agg-card-heading">
              <span className="agg-card-icon">{current.icon ?? current.name.slice(0,2)}</span>
              <div className="agg-card-who"><strong>{current.name}</strong><small>{current.detail ?? kindLabel(current.kind)}</small></div>
              <span className="agg-card-pill" data-status={current.status}>{statusLabel(current.status)}</span>
              <button ref={closeButton} type="button" onClick={close} aria-label={`${current.name}: дэлгэрэнгүйг хаах`}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M18 6 6 18"/></svg>
              </button>
            </div>
            {current.doing && <p>{current.doing}</p>}
            <ul aria-label="Сүүлийн дуудлагууд">
              {[...validCalls].filter(call => call.from === current.id || call.to === current.id).sort((a,b)=>b.at-a.at).slice(0,4).map(call => {
                const outgoing=call.from===current.id;
                const other=unique.find(n=>n.id===(outgoing?call.to:call.from));
                return <li key={call.id}>
                  <span className="agg-call-direction" aria-label={outgoing?'Илгээсэн':'Ирсэн'}>{outgoing?'↗':'↙'}</span>
                  <span className="agg-call-icon">{other?.icon ?? other?.name.slice(0,2)}</span>
                  <span className="agg-call-text"><b>{other?.name}</b>{call.label && ` · ${call.label}`}</span>
                  <small>{call.status==='pending' ? <span className="agg-call-spin" aria-label="Хүлээж байна"/> : call.ms===undefined ? callStatusLabel(call.status) : call.ms<1000 ? `${call.ms}ms` : `${(call.ms/1000).toFixed(1)}s`}</small>
                </li>;
              })}
            </ul>
            <div className="agg-card-meta"><strong>{formatCost(current.cost ?? 0)}</strong><span>Сүүлийн минутад {recent.filter(call => call.from === current.id || call.to === current.id).length} дуудлага</span></div>
          </div>
        )}
      <footer className="agg-footer" aria-label="Дуудлагын тайлбар">
        <span>
          <i style={{ "--color": "var(--agg-pulse)" } as React.CSSProperties} />
          Дуудлага
        </span>
        <span>
          <i
            style={{ "--color": "var(--agg-answer)" } as React.CSSProperties}
          />
          Хариу
        </span>
        <span>
          <i style={{ "--color": "var(--agg-amber)" } as React.CSSProperties} />
          Таны ээлж
        </span>
        <span>
          <i style={{ "--color": "var(--agg-red)" } as React.CSSProperties} />
          Алдаатай
        </span>
      </footer>
      </div>
      <ul className="agg-sr" aria-label="Сүлжээний тайлбар">
        {unique.map((node) => (
          <li key={node.id}>
            {node.name}, {kindLabel(node.kind)}, {statusLabel(node.status)},{" "}
            {formatCost(node.cost ?? 0)}.{" "}
            {unique
              .filter((other) =>
                recent.some(
                  (call) => call.from === node.id && call.to === other.id,
                ),
              )
              .map(
                (other) =>
                  `${other.name}: сүүлийн минутад ${recent.filter((call) => call.from === node.id && call.to === other.id).length} удаа дуудсан.`,
              )
              .join(" ")}
          </li>
        ))}
      </ul>

    </section>
  );
}

const css = `
.agg-root{--agg-bg:#fff;--agg-canvas:#fff;--agg-node-bg:#fff;--agg-fg:#000;--agg-muted:rgba(0,0,0,.6);--agg-edge:rgba(0,0,0,.075);--agg-soft:#f5f5f6;--agg-link:rgba(0,0,0,.07);--agg-pulse:#6db5fa;--agg-icon:#3b82f6;--agg-answer:#34ca82;--agg-amber:#e49b5b;--agg-red:#e76c79;position:relative;width:100%;max-width:100%;min-width:0;color:var(--agg-fg);font:13px/20px Inter,system-ui,sans-serif;container:agg/inline-size;isolation:isolate}
:where(.dark,[data-theme=dark]) .agg-root{--agg-bg:#202022;--agg-canvas:#1c1c1f;--agg-node-bg:#232326;--agg-fg:#fff;--agg-muted:rgba(255,255,255,.6);--agg-icon:#6db5fa;--agg-edge:#303033;--agg-soft:#242426;--agg-link:rgba(255,255,255,.08);color-scheme:dark}.agg-root *{box-sizing:border-box}.agg-root button{font:inherit;cursor:pointer;color:inherit}.agg-root :focus-visible{outline:2px solid var(--agg-pulse);outline-offset:5px}.agg-header{display:flex;align-items:center;justify-content:space-between;gap:4px 8px;padding:0 0 16px;min-height:36px}.agg-header>div{display:flex;gap:8px;align-items:center}.agg-header h3{font-size:13px;font-weight:500;margin:0}.agg-header svg{width:17px;height:17px;color:var(--agg-icon)}.agg-stats{color:var(--agg-muted);font-size:12px;gap:12px!important;white-space:nowrap;font-variant-numeric:tabular-nums}.agg-stats strong{font-weight:500;color:var(--agg-fg);margin-left:0}.agg-alerts{position:absolute;top:54px;left:12px;right:12px;display:flex;gap:6px;flex-wrap:wrap;z-index:2;pointer-events:none}.agg-alerts button{pointer-events:auto;border:1px solid color-mix(in srgb,var(--agg-amber) 18%,transparent);color:var(--agg-amber);background:color-mix(in srgb,var(--agg-amber) 6%,var(--agg-bg));padding:3px 7px;border-radius:5px;font-size:9px}.agg-alerts button[data-status=error]{color:var(--agg-red);border-color:color-mix(in srgb,var(--agg-red) 18%,transparent)}.agg-canvas{position:relative;background:var(--agg-canvas);border:0;border-radius:10px;overflow:hidden;box-shadow:0 0 0 .5px #0000000f,0 1px 1px -1px #0000001a,0 1px 2px #0000000d}.agg-links{position:absolute;inset:0;overflow:visible}.agg-link{stroke:var(--agg-link);fill:none;stroke-linecap:round;opacity:.9;transition:stroke-width .7s,opacity .2s}.agg-link[data-lit=true]{opacity:1}.agg-link[data-error=true]{stroke:color-mix(in srgb,var(--agg-red) 40%,var(--agg-link))}.agg-pulse{fill:none;stroke-width:1.8;stroke-linecap:round}.agg-node{--agg-size:34px;position:absolute;transform:translate(-50%,-50%);border:0;background:none;padding:0;width:var(--agg-size);height:var(--agg-size);z-index:1;transition:opacity .2s}.agg-node[data-kind=agent]{--agg-size:46px}.agg-node[data-lead=true]{--agg-size:56px}.agg-node[data-dimmed=true]{opacity:.4}.agg-node-icon{display:grid;place-items:center;position:relative;width:100%;height:100%;border:0;border-radius:calc(var(--agg-size)*.27);background:var(--agg-node-bg);box-shadow:0 0 0 .5px #00000014,0 1px 2px #0000000f,0 4px 12px -4px #0000001f;font-size:14px;font-weight:500;isolation:isolate}.agg-node-icon>svg,.agg-node-icon>img{width:18px;height:18px;object-fit:contain}.agg-node[data-kind=agent] .agg-node-icon{border-radius:calc(var(--agg-size)*.27)}.agg-node[data-kind=agent] .agg-node-icon>svg{width:23px;height:23px}.agg-node[data-lead=true] .agg-node-icon{border-radius:calc(var(--agg-size)*.27)}.agg-node[data-lead=true] .agg-node-icon>svg{width:29px;height:29px}.agg-node[data-kind=user] .agg-node-icon{background:rgba(0,0,0,.88);color:#fcfcfc;border-color:transparent;box-shadow:inset 0 1px 2px #0002}.agg-node[data-status=working] .agg-node-icon:before,.agg-node[data-status=waiting] .agg-node-icon:before{content:'';position:absolute;inset:-7px;border:6px solid color-mix(in srgb,var(--agg-pulse) 15%,transparent);border-radius:22px;z-index:-1;animation:agg-breathe 2.8s ease-in-out infinite}.agg-node[data-lead=true] .agg-node-icon:before{inset:-9px;border-width:8px;border-radius:27px}.agg-node[data-status=waiting] .agg-node-icon:before{border-color:color-mix(in srgb,var(--agg-amber) 18%,transparent);animation-duration:1.9s}.agg-node:nth-of-type(2n) .agg-node-icon:before{animation-delay:-1.3s}.agg-node-icon i{position:absolute;right:-3px;bottom:-1px;display:grid;place-items:center;width:15px;height:15px;border-radius:50%;font:10px/1 Inter,system-ui;background:var(--agg-node-bg);color:var(--agg-amber);border:1px solid var(--agg-edge)}.agg-node[data-status=error] .agg-node-icon i{color:var(--agg-red)}.agg-node strong,.agg-node small{position:absolute;left:50%;transform:translateX(-50%);display:block;width:max-content;max-width:min(120px,var(--agg-label-room));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--agg-canvas);border-radius:3px;padding:0 5px;pointer-events:none;box-shadow:0 0 6px 2px var(--agg-canvas)}.agg-node strong{top:calc(100% + 6px);font-size:11px;line-height:14px;font-weight:400;color:var(--agg-muted)}.agg-node[data-kind=agent] strong{font-size:12px;line-height:16px;font-weight:500;color:var(--agg-fg);top:calc(100% + 6px)}.agg-node small{top:calc(100% + 22px);font-size:11px;line-height:14px;color:var(--agg-muted)}.agg-node[data-label-above=true] strong{top:auto;bottom:calc(100% + 6px)}.agg-node-status{color:var(--agg-amber)!important}.agg-node[data-status=error] .agg-node-status{color:var(--agg-red)!important}.agg-node[aria-expanded=true] .agg-node-icon{outline:1px solid var(--agg-pulse);outline-offset:4px}.agg-card{position:absolute;right:14px;bottom:42px;width:260px;max-width:calc(100% - 28px);z-index:4;background:var(--agg-node-bg);border:1px solid var(--agg-edge);border-radius:11px;padding:12px;box-shadow:0 8px 35px #0002;animation:agg-enter .18s ease-out}.agg-card-heading{display:flex;gap:10px;justify-content:space-between;align-items:center;font-size:12px;font-weight:500}.agg-card-heading button{border:0;background:var(--agg-soft);border-radius:5px;width:24px;height:24px;font-size:17px;padding:0}.agg-card small{font-size:10px;color:var(--agg-muted)}.agg-card p{font-size:11px;margin:12px 0}.agg-card-meta{display:flex;justify-content:space-between;margin:12px 0 4px;font-size:10px}.agg-card-meta span{color:var(--agg-muted)}.agg-card-meta strong{font-weight:500}.agg-card ul{list-style:none;margin:0;padding:0;max-height:140px;overflow:auto}.agg-card li{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:10px;padding:7px 0;border-top:1px solid var(--agg-edge)}.agg-card li>span{overflow-wrap:anywhere}.agg-card li small{white-space:nowrap;font-size:9px}.agg-footer{position:absolute;bottom:0;left:0;right:0;padding:0 10px 10px;line-height:16px;display:flex;justify-content:center;gap:4px 14px;color:var(--agg-muted);font-size:11px;pointer-events:none}.agg-footer span{display:flex;align-items:center;gap:7px}.agg-footer i{width:17px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--color,var(--agg-pulse)))}.agg-empty{position:absolute;inset:0;display:grid;place-items:center;color:var(--agg-muted)}.agg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.agg-root[data-paused=true] *{animation-play-state:paused!important}@container agg(max-width:519px){.agg-header{gap:4px 8px;padding-bottom:16px;flex-wrap:wrap}.agg-header h3{font-size:13px;line-height:22px}.agg-stats{width:100%;gap:8px!important;font-size:12px;line-height:16px}.agg-node{--agg-size:28px}.agg-node[data-kind=agent]{--agg-size:34px}.agg-node[data-lead=true]{--agg-size:42px}.agg-node-icon>svg{width:16px;height:16px}.agg-node[data-kind=agent] .agg-node-icon>svg{width:20px;height:20px}.agg-node[data-lead=true] .agg-node-icon>svg{width:25px;height:25px}.agg-node strong{font-size:11px;max-width:min(84px,var(--agg-label-room))}.agg-node[data-kind=agent] strong{font-size:12px}.agg-node small{font-size:11px;max-width:min(92px,var(--agg-label-room))}.agg-node-icon:before{inset:-5px!important;border-width:4px!important;border-radius:calc(var(--agg-size)*.27 + 5px)!important}.agg-card{left:12px;right:12px;bottom:32px;width:auto;max-width:none}.agg-footer{gap:4px 14px;font-size:11px}.agg-footer i{width:17px}.agg-alerts{top:68px}}
:where(.dark,[data-theme=dark]) .agg-canvas{box-shadow:0 0 0 .5px #ffffff1a,0 1px 2px #0006}
:where(.dark,[data-theme=dark]) .agg-node-icon{box-shadow:0 0 0 .5px #ffffff24,0 1px 2px #0006,0 4px 12px -4px #0008}
:where(.dark,[data-theme=dark]) .agg-node[data-kind=user] .agg-node-icon{background:#fcfcfc;color:rgba(0,0,0,.88)}

.agg-card{border:0;border-radius:10px;padding:10px;box-shadow:0 0 0 .5px #00000014,0 12px 28px -10px #0000002e,0 1px 2px #0000000d}.agg-card-heading{gap:8px;font-size:13px;line-height:16px}.agg-card-icon{display:grid;place-items:center;flex:0 0 28px;height:28px;border-radius:8px;background:var(--agg-soft)}.agg-card-icon svg{width:20px;height:20px}.agg-card-who{flex:1;min-width:0}.agg-card-who strong{display:block;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.agg-card small{font-size:11px;line-height:14px}.agg-card-pill{font-size:11px;font-weight:500;line-height:18px;padding:0 6px;border-radius:4px;background:var(--agg-soft);white-space:nowrap}.agg-card-pill[data-status=working]{color:#006dcb;background:#0088ff12}.agg-card-pill[data-status=waiting]{color:var(--agg-amber)}.agg-card-pill[data-status=error]{color:var(--agg-red)}.agg-card-heading button{flex:0 0 24px;display:grid;place-items:center;background:none}.agg-card p{font-size:12px;line-height:16px;margin:10px 0;color:var(--agg-muted)}.agg-card li{height:28px;padding:0;gap:6px;font-size:12px;line-height:16px}.agg-call-direction{flex:0 0 12px;color:var(--agg-muted)}.agg-call-icon{flex:0 0 16px;height:16px;display:grid;place-items:center}.agg-call-icon svg{width:16px;height:16px}.agg-call-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;color:var(--agg-muted)}.agg-call-text b{font-weight:500;color:var(--agg-fg)}.agg-card li small{font-size:11px}.agg-card-meta{gap:8px;justify-content:flex-start;margin:10px 0 0;font-size:12px;line-height:16px}.agg-call-spin{display:block;width:12px;height:12px;border:1.5px solid var(--agg-pulse);border-right-color:transparent;border-radius:50%;animation:agg-spin .9s linear infinite}@keyframes agg-spin{to{transform:rotate(360deg)}}
@keyframes agg-breathe{0%,100%{opacity:.35}50%{opacity:1}}@keyframes agg-enter{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.agg-root *{animation:none!important;transition:none!important}}
@media(max-width:480px){.agg-card{left:8px!important;right:8px!important;width:auto!important;max-width:none}}
.agg-header{flex-wrap:wrap;row-gap:8px}.agg-stats{flex-wrap:wrap;min-width:0}
`;

// Neutral glyphs (no vendor marks). Keys kept for API compatibility.
const graphBrandPaths = {
  claude: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 3.2a5.8 5.8 0 1 1 0 11.6 5.8 5.8 0 0 1 0-11.6Z",
  openai: "M3.5 3.5h17v17h-17Zm3.2 3.2v10.6h10.6V6.7Z",
  googlegemini: "M12 2.5 22 20.5H2Zm0 6.3-4.6 8.5h9.2Z",
  stripe: "M2 5h20v14H2Zm2.2 5.6v6.2h15.6v-6.2Zm0-3.4v1.4h15.6V7.2Z",
  notion: "M5 2h10l4 4v16H5Zm2.2 2.2v15.6h9.6V7.2h-3V4.2Z",
  github: "M6 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0 14a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm12-11a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM5 7.5h2v9H5Zm3 7.2c3.4-.8 8.4-1.6 9-4.2h2c-.6 4-6.3 5.2-11 6.2Z",
  hubspot: "M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5Z",
};
export function GraphBrandIcon({
  brand,
}: {
  brand: keyof typeof graphBrandPaths | "slack" | "search" | "database" | "you";
}) {
  if (brand === "slack")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
        <path d="M3.5 5h17v11h-9l-4.5 3.5V16h-3.5Z" />
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
  const color =
    brand === "claude"
      ? "#d97757"
      : brand === "googlegemini"
        ? "#4f65ff"
        : "currentColor";
  return (
    <svg viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d={graphBrandPaths[brand]} fillRule="evenodd" />
    </svg>
  );
}

export default function Demo() {
  const nodes: GraphNode[] = React.useMemo(
    () => [
      {
        id: "lead",
        name: "Зохицуулагч",
        kind: "agent",
        detail: "Төлөвлөгч агент",
        lead: true,
        status: "working",
        doing: "Нээлтийн төлөвлөгөө бэлтгэж байна",
        cost: 5.8,
        icon: <GraphBrandIcon brand="claude" />,
        short: "Ахлагч",
        position: { x: 0.5, y: 0.5 },
      },
      {
        id: "writer",
        name: "Бичигч",
        kind: "agent",
        detail: "Бичигч агент",
        status: "working",
        doing: "Нээлтийн бичвэр ноороглож байна",
        cost: 3,
        icon: <GraphBrandIcon brand="claude" />,
        position: { x: 0.378125, y: 0.36226 },
      },
      {
        id: "research",
        name: "Судлаач",
        kind: "agent",
        detail: "Судлаач агент",
        status: "working",
        doing: "Өрсөлдөгчийн тарифыг харьцуулж байна",
        cost: 3.2,
        icon: <GraphBrandIcon brand="claude" />,
        short: "Судалгаа",
        position: { x: 0.621875, y: 0.36226 },
      },
      {
        id: "analyst",
        name: "Шинжээч",
        kind: "agent",
        detail: "Шинжээч агент",
        status: "working",
        doing: "Харилцагчийн бүлгүүдийг шинжилж байна",
        cost: 2.2,
        icon: <GraphBrandIcon brand="googlegemini" />,
        position: { x: 0.621875, y: 0.63774 },
      },
      {
        id: "coder",
        name: "Кодлогч",
        kind: "agent",
        detail: "Кодын агент",
        status: "working",
        doing: "Тарифын хуудсыг хийж байна",
        cost: 3.8,
        icon: <GraphBrandIcon brand="openai" />,
        position: { x: 0.378125, y: 0.63774 },
      },
      {
        id: "you",
        name: "Та",
        kind: "user",
        icon: <GraphBrandIcon brand="you" />,
        position: { x: 0.3434375, y: 0.179567 },
      },
      {
        id: "notion",
        name: "Баримтын сан",
        kind: "tool",
        icon: <GraphBrandIcon brand="notion" />,
        position: { x: 0.591875, y: 0.160817 },
      },
      {
        id: "web",
        name: "Вэб хайлт",
        short: "Хайлт",
        kind: "tool",
        icon: <GraphBrandIcon brand="search" />,
        position: { x: 0.823125, y: 0.36226 },
      },
      {
        id: "hubspot",
        name: "Харилцагчийн бүртгэл",
        kind: "tool",
        icon: <GraphBrandIcon brand="hubspot" />,
        position: { x: 0.86875, y: 0.63774 },
      },
      {
        id: "database",
        name: "Өгөгдлийн сан",
        kind: "tool",
        icon: <GraphBrandIcon brand="database" />,
        short: "Сан",
        position: { x: 0.6565625, y: 0.820433 },
      },
      {
        id: "github",
        name: "Хувилбарын хяналт",
        kind: "tool",
        icon: <GraphBrandIcon brand="github" />,
        position: { x: 0.408125, y: 0.839183 },
      },
      {
        id: "stripe",
        name: "Төлбөрийн систем",
        kind: "tool",
        icon: <GraphBrandIcon brand="stripe" />,
        position: { x: 0.176875, y: 0.63774 },
      },
      {
        id: "slack",
        name: "Багийн чат",
        kind: "tool",
        icon: <GraphBrandIcon brand="slack" />,
        position: { x: 0.13125, y: 0.36226 },
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
        label: "Сүүлийн өөрчлөлтийг унших",
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
            "Сүүлийн өөрчлөлтийг унших",
            "Ноорогийг хянах",
            "Тарифыг шалгах",
            "Шалгалтуудыг ажиллуулах",
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
        `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}k токен`
      }
    />
  );
}
