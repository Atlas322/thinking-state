"use client";
import * as React from "react";

// Neutral agent shapes (no vendor marks): circle, square, triangle.
function ProviderMark({ model = "" }: { model?: string }) {
  const shape = /GPT|OpenAI/i.test(model) ? "square" : /Gemini/i.test(model) ? "triangle" : "circle";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={shape === "circle" ? "#d97757" : shape === "triangle" ? "#1C69FF" : "currentColor"} strokeWidth="2.4" strokeLinejoin="round" style={{ display: "block" }}>
      {shape === "circle" && <circle cx="12" cy="12" r="8.5" />}
      {shape === "square" && <rect x="4" y="4" width="16" height="16" rx="3" />}
      {shape === "triangle" && <path d="M12 3.5 21 20H3Z" />}
    </svg>
  );
}

// Small UI marks reconstructed from the visible preview. Hugeicons Free (MIT).
function HandoffIcon({ kind = "note" }: { kind?: HandoffItem["kind"] | "arrow" | "lost" }) {
  const paths = {
    file: "M7 1.5H3.5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V4Zm0 0V4h2.5",
    source: "M5 7a1.8 1.8 0 0 0 2.6 0l1.4-1.4a1.8 1.8 0 0 0-2.6-2.6l-.4.4M7 5a1.8 1.8 0 0 0-2.6 0L3 6.4A1.8 1.8 0 0 0 5.6 9l.4-.4",
    fact: "M2.5 9.5v-3M5 9.5v-6M7.5 9.5V5M10 9.5V2.5",
    decision: "m3 6.2 2 2L9.2 4",
    note: "M2.5 3h7M2.5 6h7M2.5 9h4",
    arrow: "M2 6h7M7 3.5 9.5 6 7 8.5",
    lost: "m3.2 8.8 5.6-5.6",
  };
  return <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "lost" && <circle cx="6" cy="6" r="4" />}
    <path d={paths[kind]} />
  </svg>;
}

function HandoffSpinner() {
  return <svg className="ho-spinner" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.5" />
    <path d="M6 1.75A4.25 4.25 0 0 1 10.25 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
}


// Neutral system glyphs (no brand marks): version control, document, chat.
function TaskBrandMark({ brand }: { brand: "github" | "notion" | "slack" }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (brand === "github") return <svg {...common}><circle cx="7" cy="5" r="2.3" /><circle cx="7" cy="19" r="2.3" /><circle cx="17" cy="9" r="2.3" /><path d="M7 7.3v9.4M17 11.3c0 3-3 4-10 5.3" /></svg>;
  if (brand === "notion") return <svg {...common}><path d="M5.5 2.5h9l4 4v15h-13Z" /><path d="M8.5 12h7M8.5 16h7" /></svg>;
  if (brand === "slack") return <svg {...common}><path d="M3.5 5h17v11h-9l-4.5 3.5V16h-3.5Z" /></svg>;
  return null;
}

export type HandoffAgent = {
  id: string;
  name: string;
  model?: string;
  avatar?: React.ReactNode;
  description?: string;
  cost?: number;
};
export type HandoffItem = {
  id: string;
  label: string;
  kind?: "file" | "source" | "fact" | "decision" | "note";
  lost?: boolean;
  why?: string;
};
export type Handoff = {
  id: string;
  from: string;
  to: string;
  task: string;
  items: HandoffItem[];
};
export type HandoffTask = {
  id: string;
  title: string;
  logo?: React.ReactNode;
  status: "todo" | "working" | "done" | "warning";
  agent?: string;
  note?: string;
};
export type AgentHandoffProps = {
  agents?: HandoffAgent[];
  handoffs?: Handoff[];
  tasks?: HandoffTask[];
  onAssign?: (task: HandoffTask, agent: HandoffAgent) => void;
  onRestore?: (handoff: Handoff, item: HandoffItem) => void;
  className?: string;
};
/** `cost` is spend in thousands of tokens. */
const defaultAgents: HandoffAgent[] = [
  {
    id: "research",
    name: "Судлаач",
    model: "Судлаач агент",
    avatar: "С",
    description: "Эх сурвалж олж, баримт татаж, өнцгөө шийднэ.",
    cost: 131,
  },
  {
    id: "writer",
    name: "Бичигч",
    model: "Бичигч агент",
    avatar: "Б",
    description: "Товч даалгаврыг багийн хэв маягаар анхны ноорог болгоно.",
    cost: 57,
  },
  {
    id: "review",
    name: "Шалгагч",
    model: "Шалгагч агент",
    avatar: "Ш",
    description: "Нийтлэхээс өмнө баримт бүрийг эх сурвалжтай нь тулгана.",
    cost: 30,
  },
];
const defaultTasks: HandoffTask[] = [
  {
    id: "churn",
    logo: <TaskBrandMark brand="slack" />,
    title: "Гарсан багт хариу бичих",
    status: "working",
    agent: "research",
    note: "Сүүлийн яриануудыг уншиж байна",
  },
  {
    id: "refunds",
    logo: <TaskBrandMark brand="slack" />,
    title: "Буцаалтын бэлэн хариу",
    status: "done",
    agent: "review",
    note: "Зүгээр байна",
  },
  {
    id: "api",
    logo: <TaskBrandMark brand="github" />,
    title: "API хувилбарын тэмдэглэл",
    status: "done",
    agent: "review",
    note: "Зүгээр байна",
  },
  {
    id: "onboarding",
    logo: <TaskBrandMark brand="notion" />,
    title: "Танилцуулах имэйл",
    status: "warning",
    agent: "writer",
    note: "Хэрэглэгчийн ишлэл орхигдсон",
  },
  { id: "pricing", logo: <TaskBrandMark brand="notion" />, title: "Тарифын хуудасны бичвэр", status: "todo" },
];
const defaultHandoffs: Handoff[] = ([
  {
    id: "refunds-rw",
    from: "research",
    to: "writer",
    task: "Буцаалтын бэлэн хариу",
    items: [
      { id: "examples", label: "50 сайн хариулт", kind: "source" },
      { id: "policy", label: "refund-policy.md", kind: "file" },
    ],
  },
  {
    id: "api-rw",
    from: "research",
    to: "writer",
    task: "API хувилбарын тэмдэглэл",
    items: [
      { id: "endpoints", label: "endpoints.yaml", kind: "file" },
      { id: "examples", label: "3 жишээ", kind: "note" },
      { id: "voice", label: "Бичих заавар", kind: "file" },
    ],
  },
  {
    id: "onboard-rw",
    from: "research",
    to: "writer",
    task: "Танилцуулах имэйл",
    items: [
      { id: "brief", label: "Нээлтийн товч", kind: "file" },
      {
        id: "quote",
        label: "Хэрэглэгчийн ишлэл",
        kind: "note",
        lost: true,
        why: "Ишлэл бичигчийн контекстийн хязгаараас гадуур байсан.",
      },
    ],
  },
  {
    id: "refunds-wv",
    from: "writer",
    to: "review",
    task: "Буцаалтын бэлэн хариу",
    items: [
      { id: "draft", label: "Хариуны ноорог", kind: "file" },
      { id: "tone", label: "Өнгө аяс: дулаан", kind: "decision" },
    ],
  },
  {
    id: "api-wv",
    from: "writer",
    to: "review",
    task: "API хувилбарын тэмдэглэл",
    items: [
      { id: "draft", label: "Ноорог v2", kind: "file" },
      { id: "examples", label: "3 жишээ", kind: "note" },
    ],
  },
  {
    id: "onboard-wv",
    from: "writer",
    to: "review",
    task: "Танилцуулах имэйл",
    items: [
      { id: "draft", label: "Имэйлийн ноорог", kind: "file" },
      {
        id: "quote",
        label: "Хэрэглэгчийн ишлэл",
        kind: "note",
        lost: true,
        why: "Ирсэн контекстэд ороогүй.",
      },
    ],
  },
] satisfies Handoff[]).reverse();
function Avatar({ agent }: { agent: HandoffAgent }) {
  return (
    <span
      className={`ho-avatar ${agent.model?.startsWith("GPT") ? "openai" : agent.model?.startsWith("Gemini") ? "gemini" : "claude"}`}
    >
      {agent.avatar ?? (
        <span aria-hidden="true">
          <ProviderMark model={agent.model} />
        </span>
      )}
    </span>
  );
}
export function AgentHandoff({
  agents = defaultAgents,
  handoffs = defaultHandoffs,
  tasks = defaultTasks,
  onAssign,
  onRestore,
  className = "",
}: AgentHandoffProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null),
    [lost, setLost] = React.useState<string | null>(null),
    [agentOpen, setAgentOpen] = React.useState<string | null>(null),
    [picked, setPicked] = React.useState<{
      task: HandoffTask;
      minimum: number;
    } | null>(null),
    [notice, setNotice] = React.useState("");
  const root = React.useRef<HTMLDivElement>(null),
    agentRefs = React.useRef(new Map<string, HTMLButtonElement>()),
    cardRefs = React.useRef(new Map<string, HTMLButtonElement>()),
    pickupOrigin = React.useRef<HTMLButtonElement | null>(null),
    columnRefs = React.useRef(new Map<string, HTMLDivElement>());
  const seenHandoffs = React.useRef(new Set(handoffs.map((handoff) => handoff.id)));
  const [pulses, setPulses] = React.useState<{ id: string; from: string }[]>([]);
  React.useEffect(() => {
    const added = handoffs.filter((handoff) => !seenHandoffs.current.has(handoff.id) && agents.some((agent, index) => agent.id === handoff.from && agents[index + 1]?.id === handoff.to));
    handoffs.forEach((handoff) => seenHandoffs.current.add(handoff.id));
    if (added.length) setPulses((old) => [...old, ...added.map(({ id, from }) => ({ id, from }))]);
  }, [agents, handoffs]);
  React.useEffect(() => {
    if (!pulses.length) return;
    const timer = setTimeout(() => setPulses([]), 2100);
    return () => clearTimeout(timer);
  }, [pulses]);
  const [paths, setPaths] = React.useState<{
    id: string;
    d: string;
    start: [number, number];
    end: [number, number];
  }[]>([]);
  const transitions = agents.slice(0, -1).map((from, index) => ({
    from,
    to: agents[index + 1],
    items: handoffs.filter(
      (handoff) =>
        handoff.from === from.id && handoff.to === agents[index + 1].id,
    ).reverse(),
    index,
  }));
  React.useLayoutEffect(() => {
    const measure = () => {
      if (!root.current) return;
      const rect = root.current.getBoundingClientRect(),
        narrow = rect.width < 620,
        next: typeof paths = [];
      transitions.forEach((group) => {
        const a = agentRefs.current.get(group.from.id)?.getBoundingClientRect(),
          b = agentRefs.current.get(group.to.id)?.getBoundingClientRect(),
          c = columnRefs.current.get(group.from.id)?.getBoundingClientRect();
        if (!a || !b || !c) return;
        const x1 = a.left + a.width / 2 - rect.left,
          y1 = a.bottom - rect.top,
          x2 = b.left + b.width / 2 - rect.left,
          y2 = b.bottom - rect.top,
          cx = c.left + c.width / 2 - rect.left,
          cy = c.top - rect.top;
        if (narrow) {
          next.push(
            { id: group.from.id + "in", d: `M${x1},${y1} V${cy}`, start: [x1, y1], end: [x1, cy] },
            {
              id: group.from.id + "out",
              d: `M${cx},${c.bottom - rect.top} V${b.top - rect.top}`,
              start: [cx, c.bottom - rect.top],
              end: [cx, b.top - rect.top],
            },
          );
        } else {
          const middle = y1 + (cy - y1) / 2;
          const path = (x: number, y: number, end: number) =>
            `M${x},${y} V${middle - 10} Q${x},${middle} ${x + (end > x ? 10 : -10)},${middle} H${end + (end > x ? -10 : 10)} Q${end},${middle} ${end},${middle + 10} V${cy}`;
          next.push(
            { id: group.from.id + "in", d: path(x1, y1, cx - 14), start: [x1, y1], end: [cx - 14, cy] },
            {
              id: group.from.id + "out",
              d: `M${cx + 14},${cy} V${middle + 10} Q${cx + 14},${middle} ${cx + 24},${middle} H${x2 - 10} Q${x2},${middle} ${x2},${middle - 10} V${y2}`,
              start: [cx + 14, cy], end: [x2, y2],
            },
          );
        }
      });
      setPaths(next);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    agentRefs.current.forEach((element) => observer.observe(element));
    columnRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [agents, handoffs, expanded, agentOpen]);
  const pickup = (handoff: Handoff, index: number) => {
    const task = tasks.find((item) => item.title === handoff.task);
    if (!task) return;
    pickupOrigin.current = cardRefs.current.get(handoff.id) ?? null;
    setPicked({ task, minimum: index + 1 });
    setNotice(`${task.title}: ${agents[index].name}-ийн дараах агентыг сонгоно уу.`);
    agentRefs.current.get(agents[index + 1]?.id)?.focus();
  };
  const cancelPickup = () => {
    setPicked(null);
    setNotice("Даалгавар шилжүүлэхийг цуцаллаа.");
    pickupOrigin.current?.focus();
    pickupOrigin.current = null;
  };
  const assign = (agent: HandoffAgent, index: number) => {
    if (!picked || index < picked.minimum) return;
    onAssign?.(picked.task, agent);
    setNotice(`${picked.task.title}: ${agent.name}-д оноолоо`);
    setPicked(null);
  };
  const taskFor = (agent: HandoffAgent) =>
    tasks.find((task) => task.agent === agent.id && task.status === "working");
  return (
    <section
      ref={root}
      className={`ho-root ${className}`}
      aria-label="Агентуудын дамжуулалт"
      style={
        { "--ho-count": Math.max(1, agents.length) } as React.CSSProperties
      }
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          if (picked) {
            cancelPickup();
            return;
          }
          if (expanded) cardRefs.current.get(expanded)?.focus();
          else if (agentOpen) agentRefs.current.get(agentOpen)?.focus();
          setExpanded(null);
          setLost(null);
          setAgentOpen(null);
        }
      }}
    >
      <style>{css}</style>
      <svg className="ho-lines" aria-hidden="true">
        {paths.map((path) => (
          <g key={path.id}>
            <path className="ho-connector" d={path.d} />
            {pulses.filter((pulse) => path.id === pulse.from + "in" || path.id === pulse.from + "out").map((pulse) => (
              <g key={pulse.id} className="ho-light" data-handoff-pulse={pulse.id}>
                {Array.from({ length: 16 }, (_, index) => (
                  <path key={index} d={path.d} className="ho-pulse" style={{
                    "--length": `${Math.abs(path.end[0] - path.start[0]) + Math.abs(path.end[1] - path.start[1])}px`,
                    "--shift": `${index * 3}px`,
                    "--peak": Math.max(.06, 1 - Math.abs(index - 7.5) / 7.5),
                    animationDelay: path.id.endsWith("out") ? "1s" : "0s",
                  } as React.CSSProperties} />
                ))}
              </g>
            ))}
          </g>
        ))}
      </svg>
      <svg className="ho-lines ho-dots" aria-hidden="true">
        {paths.map((path) => <g key={path.id}>
          <circle cx={path.start[0]} cy={path.start[1]} r="3.25" />
          <circle cx={path.end[0]} cy={path.end[1]} r="3.25" />
        </g>)}
      </svg>
      <div className="ho-layout">
        <div className="ho-stages">
          {agents.map((agent, index) => {
            const task = taskFor(agent),
              next =
                index === 0
                  ? tasks.find((item) => item.status === "todo")
                  : undefined,
              eligible = Boolean(picked && index >= picked.minimum);
            return (
              <div
                className="ho-stage"
                key={agent.id}
                style={{ order: index * 2 }}
              >
                <button
                  ref={(element) => {
                    if (element) agentRefs.current.set(agent.id, element);
                    else agentRefs.current.delete(agent.id);
                  }}
                  type="button"
                  className={`ho-agent ${eligible ? "eligible" : ""} ${picked && !eligible ? "passed" : ""}`}
                  aria-label={
                    picked
                      ? `${picked.task.title}: ${agent.name}-д оноох`
                      : agent.name
                  }
                  aria-disabled={picked && !eligible ? true : undefined}
                  aria-expanded={!picked ? agentOpen === agent.id : undefined}
                  onClick={() =>
                    picked
                      ? assign(agent, index)
                      : setAgentOpen(agentOpen === agent.id ? null : agent.id)
                  }
                  onDragOver={(event) => {
                    if (eligible) {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    assign(agent, index);
                  }}
                >
                  <span className="ho-agent-head">
                    <Avatar agent={agent} />
                    <span className="ho-identity">
                      <strong>{agent.name}</strong>
                      <small>{agent.model}</small>
                    </span>
                    {agent.cost !== undefined && (
                      <span className="ho-cost">{Math.round(agent.cost)}k токен</span>
                    )}
                    <span className={`ho-agent-state ${task ? "working" : ""}`}>
                      {task && <HandoffSpinner />}
                      {task ? "Ажиллаж байна" : "Сул"}
                    </span>
                  </span>
                  <span className="ho-description">
                    {agent.description ??
                      "Энэ дамжуулалтын дараагийн даалгаврыг гүйцэтгэнэ."}
                  </span>
                  <span className="ho-current-task">
                    {task ? (
                      <>
                        <span className="ho-task-logo">{task.logo ?? (
                          <span className="ho-task-icon" aria-hidden="true">
                            <HandoffIcon kind="file" />
                          </span>
                        )}</span>
                        <strong>{task.title}</strong>
                        <span>{task.note ?? "Ажиллаж байна…"}</span>
                      </>
                    ) : next ? (
                      <>
                        <small>Дараагийнх</small>
                        <strong>{next.title}</strong>
                      </>
                    ) : (
                      <span>Даалгавар авахад бэлэн</span>
                    )}
                  </span>
                </button>
                {agentOpen === agent.id && (
                  <div className="ho-agent-detail">
                    <strong>{task?.title ?? next?.title ?? agent.name}</strong>
                    <p>
                      {task?.note ??
                        agent.description ??
                        "Дараагийн дамжуулалтад бэлэн."}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="ho-columns">
          {transitions.map((group) => (
            <div
              key={group.from.id}
              ref={(element) => {
                if (element) columnRefs.current.set(group.from.id, element);
                else columnRefs.current.delete(group.from.id);
              }}
              className="ho-column"
              style={{ order: group.index * 2 + 1 }}
            >
              <header>
                <Avatar agent={group.from} />
                <span>{group.from.name}</span>
                <span className="ho-arrow" aria-hidden="true"><HandoffIcon kind="arrow" /></span>
                <Avatar agent={group.to} />
                <span>{group.to.name}</span>
                <small>{group.items.length}</small>
              </header>
              <div
                role="list"
                aria-label={`${group.from.name} → ${group.to.name} дамжуулалт`}
                className="ho-cards"
              >
                {group.items.map((handoff) => {
                  const task = tasks.find(
                      (item) => item.title === handoff.task,
                    ),
                    losses = handoff.items.filter((item) => item.lost),
                    open = expanded === handoff.id;
                  return (
                    <article
                      key={handoff.id}
                      role="listitem"
                      className={`ho-card ${picked?.task.id === task?.id ? "picked" : ""}`}
                      draggable={Boolean(onAssign && task)}
                      onDragStart={(event) => {
                        if (task && onAssign) {
                          pickupOrigin.current = cardRefs.current.get(handoff.id) ?? null;
                          event.dataTransfer.setData("text/plain", task.id);
                          event.dataTransfer.effectAllowed = "move";
                          setPicked({ task, minimum: group.index + 1 });
                        }
                      }}
                      onDragEnd={() => setPicked(null)}
                      onDoubleClick={() => {
                        if (onAssign) pickup(handoff, group.index);
                      }}
                    >
                      <button
                        type="button"
                        ref={(element) => {
                          if (element) cardRefs.current.set(handoff.id, element);
                          else cardRefs.current.delete(handoff.id);
                        }}
                        className="ho-card-toggle"
                        aria-expanded={open}
                        onClick={() => setExpanded(open ? null : handoff.id)}
                      >
                        <span className="ho-card-title">
                          <span className="ho-task-logo">{task?.logo ?? (
                            <span className="ho-task-icon" aria-hidden="true">
                              <HandoffIcon kind="file" />
                            </span>
                          )}</span>
                          <strong>{handoff.task}</strong>
                        </span>
                        <span className="ho-card-summary">
                          {handoff.items
                            .filter((item) => !item.lost)
                            .map((item) => item.label)
                            .join(", ")}
                        </span>
                        <span
                          className={`ho-card-state ${losses.length ? "warning" : ""}`}
                        >
                          <i />
                          {losses.length
                            ? `${losses.length} зүйл орхигдсон`
                            : "Зүгээр"}
                        </span>
                      </button>
                      {open && (
                        <div className="ho-expanded">
                          <ul aria-label={`${handoff.task}: зүйлс`}>
                            {handoff.items.map((item) => (
                              <li
                                key={item.id}
                                className={item.lost ? "lost" : ""}
                              >
                                {item.lost ? (
                                  <>
                                    <button
                                      type="button"
                                      className="ho-lost-button"
                                      title={item.why}
                                      aria-expanded={
                                        lost === handoff.id + item.id
                                      }
                                      onClick={() =>
                                        setLost(
                                          lost === handoff.id + item.id
                                            ? null
                                            : handoff.id + item.id,
                                        )
                                      }
                                    >
                                      <HandoffIcon kind="lost" /><span>{item.label}</span>
                                      <small>Орхигдсон</small>
                                    </button>
                                    {lost === handoff.id + item.id && (
                                      <div className="ho-loss-detail">
                                        <p>
                                          {item.why ??
                                            "Энэ зүйлийг дамжуулалтад оруулаагүй."}
                                        </p>
                                        {onRestore && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              onRestore(handoff, item)
                                            }
                                          >
                                            Буцааж нэмэх
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <span className="ho-item">
<HandoffIcon kind={item.kind} />
                                    {item.label}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                          {onAssign && task && (
                            <button
                              type="button"
                              className="ho-move"
                              onClick={() => pickup(handoff, group.index)}
                            >
                              Даалгаврыг агентад шилжүүлэх →
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
                {!group.items.length && (
                  <p className="ho-empty">Одоогоор юу ч дамжуулаагүй</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="ho-live" role="status" aria-live="polite">
        {notice}
      </p>
      {picked && (
        <div className="ho-pick-notice">
          “{picked.task.title}” даалгаврыг баруун талын агентад өгнө үү
          <button type="button" onClick={cancelPickup}>Болих</button>
        </div>
      )}
    </section>
  );
}
const css = `
.ho-root{--ho-ink:rgba(0,0,0,.61);--ho-muted:rgba(0,0,0,.45);--ho-card:#fff;--ho-panel:#f4f4f5;--ho-line:#efeeee;--ho-link:#0060e2;--ho-strong:#000;--ho-title:#1c1c1f;--ho-summary:#55555c;--ho-soft:rgba(0,0,0,.024);--ho-face-shadow:0 0 0 .5px #0000000f,0 1px 1px -1px #0000001a,0 1px 2px #0000000d;--ho-agent-shadow:0 0 0 1px #efeeee,0 10px 6px #00000005,0 5px 5px #00000008,0 1px 2px #0000000a;width:100%;max-width:1000px;padding-top:8px;color:var(--ho-ink);font:400 13px/20px Inter,system-ui,sans-serif;container:handoff / inline-size;position:relative;text-align:left;isolation:isolate}:where(.dark,[data-theme=dark]) .ho-root{--ho-ink:rgba(255,255,255,.62);--ho-muted:rgba(255,255,255,.45);--ho-strong:#fff;--ho-title:#ededed;--ho-summary:#b6b6bd;--ho-card:#1c1c1f;--ho-panel:#161618;--ho-line:#2c2c31;--ho-link:#5b9aff;--ho-soft:rgba(255,255,255,.04);--ho-face-shadow:0 0 0 .5px #ffffff1a,0 1px 2px #0006;--ho-agent-shadow:0 0 0 1px #ffffff14,0 10px 16px -6px rgba(0,0,0,.5);color-scheme:dark}.ho-root *{box-sizing:border-box}.ho-root button{font:inherit;cursor:pointer;color:inherit}.ho-root :focus-visible{outline:2px solid var(--ho-link);outline-offset:3px}.ho-root svg{width:14px;height:14px;flex:none}.ho-root .ho-spinner{width:12px;height:12px;animation:ho-spin .9s linear infinite}.ho-avatar.openai{color:var(--ho-strong)}.ho-arrow{display:grid;place-items:center;margin:0 2px;color:var(--ho-muted)}.ho-arrow svg,.ho-item svg,.ho-lost-button svg{width:12px;height:12px}.ho-lost-button>span{flex:1}.ho-item,.ho-lost-button{background:var(--ho-soft)!important}.ho-stages{display:grid;grid-template-columns:repeat(var(--ho-count),minmax(0,1fr));gap:16px;padding:0 8px;position:relative;z-index:1}.ho-stage{position:relative;min-width:0}.ho-agent{display:grid;gap:10px;width:100%;padding:14px 14px 12px;border-radius:14px;background:var(--ho-card);border:0;box-shadow:var(--ho-agent-shadow);text-align:left;transition:transform .2s,border-color .2s,opacity .2s}.ho-agent.eligible{border-color:var(--ho-link);box-shadow:0 0 0 2px color-mix(in srgb,var(--ho-link) 15%,transparent);transform:translateY(-3px)}.ho-agent.passed{opacity:.35;cursor:not-allowed}.ho-agent-head{display:flex;align-items:center;gap:8px;min-width:0}.ho-avatar{width:26px;height:26px;border-radius:7px;background:var(--ho-card);box-shadow:var(--ho-face-shadow);display:grid;place-items:center;flex:none;font-size:11px;font-weight:500;color:var(--ho-title)}.ho-avatar svg,.ho-avatar img{width:16px;height:16px}.ho-identity{min-width:0;flex:1}.ho-identity strong{color:var(--ho-strong);font-size:13px;font-weight:500;display:block;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ho-identity small{font-size:11px;line-height:14px;display:block;color:var(--ho-muted)}.ho-cost{color:var(--ho-muted);font-size:11px}.ho-agent-state{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:500;color:var(--ho-muted);padding:0 6px;height:18px;line-height:18px;border-radius:4px;background:var(--ho-soft);white-space:nowrap}.ho-agent-state.working{color:var(--ho-link);background:color-mix(in srgb,var(--ho-link) 8%,transparent)}.ho-agent-state i{display:none;width:8px;height:8px;border:1px solid #81b4e944;border-top-color:#81b4e9;border-radius:50%;animation:ho-spin 1s linear infinite}.ho-agent-state.working i{display:block}.ho-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12.5px;line-height:18px;color:var(--ho-ink);height:36px;margin:0}.ho-current-task{display:flex;align-items:center;gap:6px;border-radius:8px;background:var(--ho-panel);padding:0 9px;height:32px;color:var(--ho-ink);font-size:12px;min-width:0}.ho-current-task strong{font-size:12px;font-weight:500;color:var(--ho-strong);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.ho-current-task>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.ho-current-task>small{font-size:12px;white-space:nowrap}.ho-task-logo{width:14px;height:18px;display:grid;place-items:center;flex:none;color:var(--ho-strong)}.ho-task-logo svg{width:14px;height:14px}.ho-task-icon{font-size:13px;color:#75b7b8;flex:none}.ho-agent-detail{position:absolute;top:calc(100% + 6px);left:0;right:0;border-radius:9px;padding:12px;background:var(--ho-card);border:1px solid var(--ho-line);box-shadow:0 5px 20px #0002;z-index:10}.ho-agent-detail strong{font-weight:500;font-size:12px}.ho-agent-detail p{font-size:11px;line-height:1.7;color:var(--ho-muted);margin:6px 0 0}.ho-lines{position:absolute;inset:0;width:100%!important;height:100%!important;overflow:visible;pointer-events:none;z-index:0;fill:none;stroke:var(--ho-link);stroke-width:1.5;opacity:.85}.ho-lines.ho-dots{z-index:2;opacity:1}.ho-lines circle{fill:var(--ho-card)}.ho-connector{stroke-dasharray:none}.ho-light{filter:drop-shadow(0 0 1.5px color-mix(in srgb,var(--ho-link) 45%,transparent))}.ho-pulse{stroke-width:2;stroke-linecap:round;stroke-dasharray:3.4px calc(var(--length) + 96px);opacity:0;animation:ho-pulse 1s cubic-bezier(.45,0,.55,1) both}.ho-columns{display:grid;grid-template-columns:repeat(calc(var(--ho-count) - 1),minmax(0,1fr));gap:16px;margin:72px calc(8px + 100%/var(--ho-count)/2) 0;align-items:start;position:relative;z-index:1}.ho-column{border-radius:14px;background:var(--ho-panel);padding:4px;min-width:0;height:228px}.ho-column>header{display:flex;align-items:center;gap:5px;height:30px;padding:0 6px 0 8px;color:var(--ho-muted);font-size:11.5px;font-weight:500;white-space:nowrap;overflow:hidden}.ho-column>header .ho-avatar{font-size:9px;width:16px;height:16px;border-radius:4px}.ho-column>header .ho-avatar svg,.ho-column>header .ho-avatar img{width:11px;height:11px}.ho-column>header small{margin-left:auto;font-size:11px;min-width:20px;height:18px;padding:0 5px;border-radius:6px;background:#1010180f;display:grid;place-items:center}.ho-cards{display:grid;gap:4px;max-height:190px;overflow:auto;padding:0 0 22px;scrollbar-width:thin;scrollbar-color:var(--ho-line) transparent;mask-image:linear-gradient(to bottom,#000 88%,transparent)}.ho-card{border:0;box-shadow:0 0 0 1px var(--ho-line),0 1px 2px #1010180a;border-radius:10px;background:var(--ho-card);overflow:hidden;animation:ho-arrive .42s cubic-bezier(.32,.72,.24,1) both}.ho-card.picked{outline:1px solid var(--ho-link);opacity:.6}.ho-card[draggable=true]{cursor:grab}.ho-card-toggle{display:grid;gap:3px;width:100%;padding:9px 12px 9px 10px;border-radius:10px;border:0;background:none;text-align:left}.ho-card-title{display:flex;align-items:center;gap:8px;height:18px;min-width:0}.ho-card-title strong{font-weight:500;font-size:13px;line-height:18px;color:var(--ho-title);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ho-card-summary{font-size:12px;line-height:17px;color:var(--ho-summary);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0;padding-left:22px}.ho-card-state{display:flex;align-items:center;gap:6px;font-size:12px;line-height:20px;height:23px;color:var(--ho-summary);margin:0;padding:3px 0 0 22px}.ho-card-state>i{width:6px;height:6px;border-radius:50%;background:#60b391}.ho-card-state.warning>i{background:#c4a166}.ho-expanded{border-top:.5px solid var(--ho-line);margin:0 10px 10px;padding:8px 0 0}.ho-expanded ul{list-style:none;margin:0;padding:0;display:grid;gap:4px}.ho-item{display:flex;gap:6px;align-items:center;font-size:12px;font-weight:500;color:var(--ho-strong);line-height:20px;padding:0 8px;height:24px;border-radius:6px;background:var(--ho-panel)}.ho-lost-button{display:flex;align-items:center;justify-content:space-between;gap:7px;border:0;background:none;padding:0 8px;height:24px;border-radius:6px;text-align:left;width:100%;font-size:12px!important;color:var(--ho-muted)!important}.ho-lost-button>span{text-decoration:line-through}.ho-lost-button small{font-size:9px;color:#b99966}.ho-loss-detail{margin-top:4px;display:grid;gap:8px;border-radius:8px;padding:9px 10px;background:#fafafa;color:#111113;font-size:12px;line-height:17px}.ho-loss-detail p{font-size:12px;color:inherit;line-height:17px;margin:0}.ho-loss-detail button{justify-self:start!important;padding:0 9px!important;height:24px!important;background:#00000014!important;color:#111113!important;border:0!important;font-size:12px!important;font-weight:500!important;border-radius:6px!important}.ho-loss-detail button,.ho-move{padding:4px 7px;border-radius:5px;border:1px solid var(--ho-line);background:var(--ho-card);font-size:10px!important}.ho-move{margin-top:12px;width:100%}.ho-empty{font-size:10px;color:var(--ho-muted);padding:15px;text-align:center;margin:0}.ho-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.ho-pick-notice{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px;color:var(--ho-muted);margin-top:12px;padding:8px 10px;border-radius:6px;border:1px solid var(--ho-line)}.ho-pick-notice button{border:0;background:none;color:var(--ho-ink);font-size:11px}
@container handoff (max-width:760px){.ho-agent-state{font-size:0;padding:0;width:20px;justify-content:center}.ho-agent-state:not(.working){display:none}}
@container handoff (max-width:619px){.ho-lines{display:none}.ho-layout{display:flex;flex-direction:column;gap:12px}.ho-stages,.ho-columns{display:contents}.ho-stage{margin:0}.ho-column{margin:0 16px;height:220px}.ho-cards{max-height:182px}.ho-pick-notice{order:999}}
@keyframes ho-pulse{0%{stroke-dashoffset:var(--shift);opacity:0}10%,85%{opacity:var(--peak)}100%{stroke-dashoffset:calc(-1 * var(--length) + var(--shift));opacity:0}}@keyframes ho-spin{to{transform:rotate(360deg)}}@keyframes ho-flow{from{stroke-dashoffset:1000;opacity:0}to{stroke-dashoffset:0;opacity:.85}}@keyframes ho-arrive{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.ho-root *{animation:none!important;transition:none!important}.ho-light{display:none}}
`;
export default function Demo() {
  const [tasks, setTasks] = React.useState(defaultTasks);
  const [handoffs, setHandoffs] = React.useState(defaultHandoffs);
  return (
    <AgentHandoff
      tasks={tasks}
      handoffs={handoffs}
      onAssign={(task, agent) =>
        setTasks((old) =>
          old.map((item) =>
            item.id === task.id
              ? {
                  ...item,
                  agent: agent.id,
                  status: "working",
                  note: "Энэ даалгавар дээр ажиллаж байна",
                }
              : item,
          ),
        )
      }
      onRestore={(handoff, item) =>
        setHandoffs((old) =>
          old.map((entry) =>
            entry.id === handoff.id
              ? {
                  ...entry,
                  items: entry.items.map((value) =>
                    value.id === item.id ? { ...value, lost: false } : value,
                  ),
                }
              : entry,
          ),
        )
      }
    />
  );
}
