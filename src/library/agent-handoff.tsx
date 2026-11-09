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
  const gradientId = React.useId();
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
            ? `url(#${gradientId})`
            : "currentColor"
      }
      style={{ display: "block", stroke: "none" }}
    >
      {brand === "googlegemini" && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1C7DFF" />
            <stop offset="0.52" stopColor="#1C69FF" />
            <stop offset="1" stopColor="#B04DFF" />
          </linearGradient>
        </defs>
      )}
      <path d={providerPaths[brand]} />
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


// Brand artwork observed in the public demo: GitHub, Notion, Slack.
function TaskBrandMark({ brand }: { brand: "github" | "notion" | "slack" }) {
  if (brand === "github") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>;
  if (brand === "notion") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"></path></svg>;
  if (brand === "slack") return <svg viewBox="0 0 49.883 49.877" fill="none" aria-hidden="true"><g transform="translate(0 0)"><path d="M18.3549 10.4784C15.4713 10.4784 13.1157 8.12279 13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V10.4784H18.3549Z" fill="#36C5F0"></path><path d="M18.3575 13.12C21.2411 13.12 23.5967 15.4756 23.5967 18.3592C23.5967 21.2428 21.2411 23.5984 18.3575 23.5984H5.2392C2.35561 23.5984 0 21.2428 0 18.3592C0 15.4756 2.35561 13.12 5.2392 13.12H18.3575Z" fill="#36C5F0"></path></g><g transform="translate(26.28 0)"><path d="M13.1244 18.3592C13.1244 15.4756 15.48 13.12 18.3636 13.12C21.2472 13.12 23.6028 15.4756 23.6028 18.3592C23.6028 21.2428 21.2472 23.5984 18.3636 23.5984H13.1244V18.3592Z" fill="#2EB67D"></path><path d="M10.4785 18.3575C10.4785 21.2411 8.12286 23.5967 5.23927 23.5967C2.35568 23.5967 7.4362e-05 21.2411 7.4362e-05 18.3575V5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0C8.12286 0 10.4785 2.35561 10.4785 5.2392V18.3575Z" fill="#2EB67D"></path></g><g transform="translate(0 26.28)"><path d="M10.4784 5.2392C10.4784 8.12279 8.12279 10.4784 5.2392 10.4784C2.35561 10.4784 0 8.12279 0 5.2392C0 2.35561 2.35561 0 5.2392 0H10.4784V5.2392Z" fill="#E01E5A"></path><path d="M13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V18.3575C23.5941 21.2411 21.2385 23.5967 18.3549 23.5967C15.4713 23.5967 13.1157 21.2411 13.1157 18.3575V5.2392Z" fill="#E01E5A"></path></g><g transform="translate(26.28 26.28)"><path d="M5.23927 13.1157C8.12286 13.1157 10.4785 15.4713 10.4785 18.3549C10.4785 21.2385 8.12286 23.5941 5.23927 23.5941C2.35568 23.5941 7.4362e-05 21.2385 7.4362e-05 18.3549V13.1157H5.23927Z" fill="#ECB22E"></path><path d="M5.23927 10.4784C2.35568 10.4784 7.4362e-05 8.12279 7.4362e-05 5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0H18.3576C21.2412 0 23.5968 2.35561 23.5968 5.2392C23.5968 8.12279 21.2412 10.4784 18.3576 10.4784H5.23927Z" fill="#ECB22E"></path></g></svg>;
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
    logo: <TaskBrandMark brand="slack" />,
    title: "Reply to churned team",
    status: "working",
    agent: "research",
    note: "Reading the last conversations",
  },
  {
    id: "refunds",
    logo: <TaskBrandMark brand="slack" />,
    title: "Support macro for refunds",
    status: "done",
    agent: "review",
    note: "Looks good",
  },
  {
    id: "api",
    logo: <TaskBrandMark brand="github" />,
    title: "API release notes",
    status: "done",
    agent: "review",
    note: "Looks good",
  },
  {
    id: "onboarding",
    logo: <TaskBrandMark brand="notion" />,
    title: "Onboarding email",
    status: "warning",
    agent: "writer",
    note: "A user quote was left behind",
  },
  { id: "pricing", logo: <TaskBrandMark brand="notion" />, title: "Pricing page copy", status: "todo" },
];
const defaultHandoffs: Handoff[] = ([
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
    setNotice(`Choose an agent after ${agents[index].name} for ${task.title}.`);
    agentRefs.current.get(agents[index + 1]?.id)?.focus();
  };
  const cancelPickup = () => {
    setPicked(null);
    setNotice("Task move cancelled.");
    pickupOrigin.current?.focus();
    pickupOrigin.current = null;
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
                      {task && <HandoffSpinner />}
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
                        <span className="ho-task-logo">{task.logo ?? (
                          <span className="ho-task-icon" aria-hidden="true">
                            <HandoffIcon kind="file" />
                          </span>
                        )}</span>
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
                <span className="ho-arrow" aria-hidden="true"><HandoffIcon kind="arrow" /></span>
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
                                            type="button"
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
          <button type="button" onClick={cancelPickup}>Cancel</button>
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
