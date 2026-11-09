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
const defaultAgents: HandoffAgent[] = [
  {
    id: "research",
    name: "Researcher",
    model: "Opus 5.5",
    description: "Finds the sources, pulls the facts and decides the angle.",
    cost: 1.31,
  },
  {
    id: "writer",
    name: "Writer",
    model: "GPT-5",
    description: "Turns the brief into a first draft in the team’s voice.",
    cost: 0.57,
  },
  {
    id: "review",
    name: "Reviewer",
    model: "Gemini Pro",
    description: "Checks every claim against its source before it ships.",
    cost: 0.3,
  },
];
const defaultTasks: HandoffTask[] = [
  {
    id: "churn",
    title: "Reply to churned accounts",
    status: "working",
    agent: "research",
    note: "Reading the last conversations",
  },
  {
    id: "refunds",
    title: "Support macro for refunds",
    status: "done",
    agent: "review",
    note: "Looks good",
  },
  {
    id: "api",
    title: "API release notes",
    status: "done",
    agent: "review",
    note: "Looks good",
  },
  {
    id: "onboarding",
    title: "Onboarding email",
    status: "warning",
    agent: "writer",
    note: "A user quote was left behind",
  },
  { id: "pricing", title: "Pricing page copy", status: "todo" },
];
const defaultHandoffs: Handoff[] = [
  {
    id: "refunds-rw",
    from: "research",
    to: "writer",
    task: "Support macro for refunds",
    items: [
      { id: "examples", label: "50 good replies", kind: "source" },
      { id: "policy", label: "refund-policy.md", kind: "file" },
    ],
  },
  {
    id: "api-rw",
    from: "research",
    to: "writer",
    task: "API release notes",
    items: [
      { id: "endpoints", label: "endpoints.yaml", kind: "file" },
      { id: "examples", label: "3 examples", kind: "note" },
      { id: "voice", label: "Writing guidelines", kind: "file" },
    ],
  },
  {
    id: "onboard-rw",
    from: "research",
    to: "writer",
    task: "Onboarding email",
    items: [
      { id: "brief", label: "Launch brief", kind: "file" },
      {
        id: "quote",
        label: "A user quote",
        kind: "note",
        lost: true,
        why: "The quote was outside the writer’s context budget.",
      },
    ],
  },
  {
    id: "refunds-wv",
    from: "writer",
    to: "review",
    task: "Support macro for refunds",
    items: [
      { id: "draft", label: "Macro draft", kind: "file" },
      { id: "tone", label: "Tone: warm", kind: "decision" },
    ],
  },
  {
    id: "api-wv",
    from: "writer",
    to: "review",
    task: "API release notes",
    items: [
      { id: "draft", label: "Draft v2", kind: "file" },
      { id: "examples", label: "3 examples", kind: "note" },
    ],
  },
  {
    id: "onboard-wv",
    from: "writer",
    to: "review",
    task: "Onboarding email",
    items: [
      { id: "draft", label: "Email draft", kind: "file" },
      {
        id: "quote",
        label: "A user quote",
        kind: "note",
        lost: true,
        why: "Not included in the incoming context.",
      },
    ],
  },
];
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
    columnRefs = React.useRef(new Map<string, HTMLDivElement>());
  const [paths, setPaths] = React.useState<{ id: string; d: string }[]>([]);
  const transitions = agents.slice(0, -1).map((from, index) => ({
    from,
    to: agents[index + 1],
    items: handoffs.filter(
      (handoff) =>
        handoff.from === from.id && handoff.to === agents[index + 1].id,
    ),
    index,
  }));
  React.useLayoutEffect(() => {
    const measure = () => {
      if (!root.current) return;
      const rect = root.current.getBoundingClientRect(),
        narrow = rect.width < 620,
        next: { id: string; d: string }[] = [];
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
            { id: group.from.id + "in", d: `M${x1},${y1} V${cy}` },
            {
              id: group.from.id + "out",
              d: `M${cx},${c.bottom - rect.top} V${b.top - rect.top}`,
            },
          );
        } else {
          const middle = y1 + (cy - y1) / 2;
          const path = (x: number, y: number, end: number) =>
            `M${x},${y} V${middle - 10} Q${x},${middle} ${x + (end > x ? 10 : -10)},${middle} H${end + (end > x ? -10 : 10)} Q${end},${middle} ${end},${middle + 10} V${cy}`;
          next.push(
            { id: group.from.id + "in", d: path(x1, y1, cx - 12) },
            { id: group.from.id + "out", d: path(x2, y2, cx + 12) },
          );
        }
      });
      setPaths(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    agentRefs.current.forEach((element) => observer.observe(element));
    columnRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [agents, handoffs, expanded, agentOpen]);
  const pickup = (handoff: Handoff, index: number) => {
    const task = tasks.find((item) => item.title === handoff.task);
    if (!task) return;
    setPicked({ task, minimum: index + 1 });
    setNotice(`Choose an agent after ${agents[index].name} for ${task.title}.`);
    agentRefs.current.get(agents[index + 1]?.id)?.focus();
  };
  const assign = (agent: HandoffAgent, index: number) => {
    if (!picked || index < picked.minimum) return;
    onAssign?.(picked.task, agent);
    setNotice(`${picked.task.title} assigned to ${agent.name}`);
    setPicked(null);
  };
  const taskFor = (agent: HandoffAgent) =>
    tasks.find((task) => task.agent === agent.id && task.status === "working");
  return (
    <section
      ref={root}
      className={`ho-root ${className}`}
      aria-label="Agent handoff relay"
      style={
        { "--ho-count": Math.max(1, agents.length) } as React.CSSProperties
      }
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setPicked(null);
          setExpanded(null);
          setLost(null);
          setAgentOpen(null);
        }
      }}
    >
      <style>{css}</style>
      <svg className="ho-lines" aria-hidden="true">
        {paths.map((path) => (
          <path key={path.id} d={path.d} />
        ))}
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
                      ? `Assign ${picked.task.title} to ${agent.name}`
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
                      <span className="ho-cost">${agent.cost.toFixed(2)}</span>
                    )}
                    <span className={`ho-agent-state ${task ? "working" : ""}`}>
                      <i />
                      {task ? "Working" : "Idle"}
                    </span>
                  </span>
                  <span className="ho-description">
                    {agent.description ??
                      "Works on the next task in this relay."}
                  </span>
                  <span className="ho-current-task">
                    {task ? (
                      <>
                        {task.logo ?? (
                          <span className="ho-task-icon" aria-hidden="true">
                            ✦
                          </span>
                        )}
                        <strong>{task.title}</strong>
                        <span>{task.note ?? "Working…"}</span>
                      </>
                    ) : next ? (
                      <>
                        <small>Up next</small>
                        <strong>{next.title}</strong>
                      </>
                    ) : (
                      <span>Ready for a task</span>
                    )}
                  </span>
                </button>
                {agentOpen === agent.id && (
                  <div className="ho-agent-detail">
                    <strong>{task?.title ?? next?.title ?? agent.name}</strong>
                    <p>
                      {task?.note ??
                        agent.description ??
                        "Ready for the next handoff."}
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
                <span aria-hidden="true">→</span>
                <Avatar agent={group.to} />
                <span>{group.to.name}</span>
                <small>{group.items.length}</small>
              </header>
              <div
                role="list"
                aria-label={`${group.from.name} to ${group.to.name} handoffs`}
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
                        className="ho-card-toggle"
                        aria-expanded={open}
                        onClick={() => setExpanded(open ? null : handoff.id)}
                      >
                        <span className="ho-card-title">
                          {task?.logo ?? (
                            <span className="ho-task-icon" aria-hidden="true">
                              ✦
                            </span>
                          )}
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
                            ? `${losses.length} ${losses.length === 1 ? "item" : "items"} left behind`
                            : "Looks good"}
                        </span>
                      </button>
                      {open && (
                        <div className="ho-expanded">
                          <ul aria-label={`Items for ${handoff.task}`}>
                            {handoff.items.map((item) => (
                              <li
                                key={item.id}
                                className={item.lost ? "lost" : ""}
                              >
                                {item.lost ? (
                                  <>
                                    <button
                                      className="ho-lost-button"
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
                                      <span>{item.label}</span>
                                      <small>Left behind</small>
                                    </button>
                                    {lost === handoff.id + item.id && (
                                      <div className="ho-loss-detail">
                                        <p>
                                          {item.why ??
                                            "This item was not included in the handoff."}
                                        </p>
                                        {onRestore && (
                                          <button
                                            onClick={() =>
                                              onRestore(handoff, item)
                                            }
                                          >
                                            Add back
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <span className="ho-item">
                                    <span aria-hidden="true">
                                      {item.kind === "file"
                                        ? "▤"
                                        : item.kind === "source"
                                          ? "↗"
                                          : "·"}
                                    </span>
                                    {item.label}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                          {onAssign && task && (
                            <button
                              className="ho-move"
                              onClick={() => pickup(handoff, group.index)}
                            >
                              Move task to an agent →
                            </button>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
                {!group.items.length && (
                  <p className="ho-empty">Nothing handed over yet</p>
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
          Choose an agent to the right for “{picked.task.title}”
          <button onClick={() => setPicked(null)}>Cancel</button>
        </div>
      )}
    </section>
  );
}
const css = `
.ho-root{--ho-ink:#27272a;--ho-muted:#85858a;--ho-card:#fff;--ho-panel:#f6f6f7;--ho-line:#e5e5e8;--ho-link:#82bcff;width:100%;max-width:1000px;color:var(--ho-ink);font:400 13px/20px Inter,system-ui,sans-serif;container:handoff / inline-size;position:relative;text-align:left;isolation:isolate}:where(.dark,[data-theme=dark]) .ho-root{--ho-ink:#e8e8eb;--ho-muted:#929297;--ho-card:#202022;--ho-panel:#19191b;--ho-line:#2e2e31;color-scheme:dark}.ho-root *{box-sizing:border-box}.ho-root button{font:inherit;cursor:pointer;color:inherit}.ho-root :focus-visible{outline:2px solid var(--ho-link);outline-offset:3px}.ho-root svg{width:14px;height:14px}.ho-stages{display:grid;grid-template-columns:repeat(var(--ho-count),minmax(0,1fr));gap:16px;position:relative;z-index:1}.ho-stage{position:relative;min-width:0}.ho-agent{display:block;width:100%;padding:15px;border-radius:13px;background:var(--ho-card);border:1px solid var(--ho-line);box-shadow:0 1px 3px #00000008;text-align:left;transition:transform .2s,border-color .2s,opacity .2s}.ho-agent.eligible{border-color:var(--ho-link);box-shadow:0 0 0 2px color-mix(in srgb,var(--ho-link) 15%,transparent);transform:translateY(-3px)}.ho-agent.passed{opacity:.35;cursor:not-allowed}.ho-agent-head{display:flex;align-items:center;gap:8px;min-width:0}.ho-avatar{width:18px;height:20px;display:grid;place-items:center;flex:none;font-size:19px}.ho-avatar svg,.ho-avatar img{width:16px;height:16px}.ho-avatar.claude{color:#d69576}.ho-avatar.gemini{color:#8aafff}.ho-identity{min-width:0;flex:1}.ho-identity strong{font-size:13px;font-weight:500;display:block;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ho-identity small{font-size:10px;line-height:15px;display:block;color:var(--ho-muted)}.ho-cost{color:var(--ho-muted);font-size:11px}.ho-agent-state{display:flex;align-items:center;gap:4px;font-size:10px;color:var(--ho-muted);padding:0 5px;line-height:18px;border-radius:4px;background:var(--ho-panel);white-space:nowrap}.ho-agent-state.working{color:#81b4e9;background:#4d94d51e}.ho-agent-state i{display:none;width:8px;height:8px;border:1px solid #81b4e944;border-top-color:#81b4e9;border-radius:50%;animation:ho-spin 1s linear infinite}.ho-agent-state.working i{display:block}.ho-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;line-height:19px;color:var(--ho-muted);min-height:38px;margin:10px 0}.ho-current-task{display:flex;align-items:center;gap:6px;border-radius:6px;background:var(--ho-panel);padding:7px 9px;min-height:31px;color:var(--ho-muted);font-size:11px;min-width:0}.ho-current-task strong{font-size:11px;font-weight:400;color:var(--ho-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.ho-current-task>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.ho-current-task>small{font-size:9px;white-space:nowrap}.ho-task-icon{font-size:13px;color:#75b7b8;flex:none}.ho-agent-detail{position:absolute;top:calc(100% + 6px);left:0;right:0;border-radius:9px;padding:12px;background:var(--ho-card);border:1px solid var(--ho-line);box-shadow:0 5px 20px #0002;z-index:10}.ho-agent-detail strong{font-weight:500;font-size:12px}.ho-agent-detail p{font-size:11px;line-height:1.7;color:var(--ho-muted);margin:6px 0 0}.ho-lines{position:absolute;inset:0;width:100%!important;height:100%!important;overflow:visible;pointer-events:none;z-index:0;fill:none;stroke:var(--ho-link);stroke-width:1.3;opacity:.85}.ho-lines path{stroke-dasharray:1000;stroke-dashoffset:0;animation:ho-flow .6s ease-out both}.ho-columns{display:grid;grid-template-columns:repeat(calc(var(--ho-count) - 1),minmax(0,1fr));gap:16px;margin:68px calc((100% + 16px)/var(--ho-count)/2) 0;align-items:start;position:relative;z-index:1}.ho-column{border-radius:12px;background:var(--ho-panel);padding:3px;min-width:0}.ho-column>header{display:flex;align-items:center;gap:5px;padding:7px 8px;color:var(--ho-muted);font-size:10px;white-space:nowrap;overflow:hidden}.ho-column>header .ho-avatar{font-size:13px;width:12px;height:14px}.ho-column>header .ho-avatar svg,.ho-column>header .ho-avatar img{width:11px;height:11px}.ho-column>header small{margin-left:auto;font-size:10px;padding-left:5px}.ho-cards{display:grid;gap:3px;max-height:265px;overflow:auto;padding-bottom:22px;scrollbar-width:thin;scrollbar-color:var(--ho-line) transparent;mask-image:linear-gradient(to bottom,#000 88%,transparent)}.ho-card{border:1px solid var(--ho-line);border-radius:10px;background:var(--ho-card);overflow:hidden;animation:ho-arrive .3s both}.ho-card.picked{outline:1px solid var(--ho-link);opacity:.6}.ho-card[draggable=true]{cursor:grab}.ho-card-toggle{display:block;width:100%;padding:10px 11px;border:0;background:none;text-align:left}.ho-card-title{display:flex;align-items:center;gap:7px;min-width:0}.ho-card-title strong{font-weight:500;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ho-card-summary{font-size:11px;color:var(--ho-muted);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:3px 0 8px 20px}.ho-card-state{display:flex;align-items:center;gap:7px;font-size:10px;color:var(--ho-muted);margin-left:20px}.ho-card-state>i{width:6px;height:6px;border-radius:50%;background:#60b391}.ho-card-state.warning>i{background:#c4a166}.ho-expanded{border-top:1px solid var(--ho-line);padding:9px 11px 12px}.ho-expanded ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}.ho-item{display:flex;gap:7px;align-items:center;font-size:11px;color:var(--ho-muted);line-height:16px}.ho-lost-button{display:flex;align-items:center;justify-content:space-between;gap:7px;border:0;background:none;padding:0;text-align:left;width:100%;font-size:11px!important;color:var(--ho-muted)!important}.ho-lost-button>span{text-decoration:line-through}.ho-lost-button small{font-size:9px;color:#b99966}.ho-loss-detail p{font-size:10px;color:var(--ho-muted);line-height:1.6;margin:7px 0}.ho-loss-detail button,.ho-move{padding:4px 7px;border-radius:5px;border:1px solid var(--ho-line);background:var(--ho-card);font-size:10px!important}.ho-move{margin-top:12px;width:100%}.ho-empty{font-size:10px;color:var(--ho-muted);padding:15px;text-align:center;margin:0}.ho-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.ho-pick-notice{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px;color:var(--ho-muted);margin-top:12px;padding:8px 10px;border-radius:6px;border:1px solid var(--ho-line)}.ho-pick-notice button{border:0;background:none;color:var(--ho-ink);font-size:11px}
@container handoff (max-width:760px){.ho-agent{padding:12px}.ho-agent-state{font-size:0;padding:3px}.ho-agent-state:not(.working){display:none}.ho-agent-head{gap:6px}.ho-cost{font-size:10px}.ho-identity strong{font-size:12px}.ho-description{font-size:11px}.ho-current-task{padding:6px}.ho-column>header{gap:3px;padding:7px 5px;font-size:9px}.ho-column>header .ho-avatar{display:none}.ho-card-toggle{padding:9px}.ho-card-title strong{font-size:11px}.ho-card-summary{margin-left:0}.ho-card-state{margin-left:0}}
@container handoff (max-width:619px){.ho-layout{display:flex;flex-direction:column;gap:32px}.ho-stages,.ho-columns{display:contents}.ho-stage{margin:0}.ho-column{margin:0 14px}.ho-agent-state{font-size:10px}.ho-agent-state:not(.working){display:flex}.ho-agent-head{gap:9px}.ho-identity strong{font-size:13px}.ho-description{min-height:0}.ho-agent{padding:14px}.ho-column>header{font-size:11px;padding:8px;gap:6px}.ho-column>header .ho-avatar{display:grid}.ho-cards{max-height:260px}.ho-pick-notice{order:999}.ho-card-title strong{font-size:12px}.ho-cost{font-size:11px}}
@keyframes ho-spin{to{transform:rotate(360deg)}}@keyframes ho-flow{from{stroke-dashoffset:1000;opacity:0}to{stroke-dashoffset:0;opacity:.85}}@keyframes ho-arrive{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}@media(prefers-reduced-motion:reduce){.ho-root *{animation:none!important;transition:none!important}}
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
                  note: "Working on this task",
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
