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

// Demo brand SVGs observed in the public preview; Simple Icons paths are CC0.
function DemoTool({ kind }: { kind: "slack" | "notion" | "github" | "figma" | "stripe" | "hubspot" }) {
  switch (kind) {
    case "slack": return (<svg viewBox="0 0 49.883 49.877" fill="none" aria-hidden="true"><g transform="translate(0 0)"><path d="M18.3549 10.4784C15.4713 10.4784 13.1157 8.12279 13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V10.4784H18.3549Z" fill="#36C5F0"></path><path d="M18.3575 13.12C21.2411 13.12 23.5967 15.4756 23.5967 18.3592C23.5967 21.2428 21.2411 23.5984 18.3575 23.5984H5.2392C2.35561 23.5984 0 21.2428 0 18.3592C0 15.4756 2.35561 13.12 5.2392 13.12H18.3575Z" fill="#36C5F0"></path></g><g transform="translate(26.28 0)"><path d="M13.1244 18.3592C13.1244 15.4756 15.48 13.12 18.3636 13.12C21.2472 13.12 23.6028 15.4756 23.6028 18.3592C23.6028 21.2428 21.2472 23.5984 18.3636 23.5984H13.1244V18.3592Z" fill="#2EB67D"></path><path d="M10.4785 18.3575C10.4785 21.2411 8.12286 23.5967 5.23927 23.5967C2.35568 23.5967 7.4362e-05 21.2411 7.4362e-05 18.3575V5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0C8.12286 0 10.4785 2.35561 10.4785 5.2392V18.3575Z" fill="#2EB67D"></path></g><g transform="translate(0 26.28)"><path d="M10.4784 5.2392C10.4784 8.12279 8.12279 10.4784 5.2392 10.4784C2.35561 10.4784 0 8.12279 0 5.2392C0 2.35561 2.35561 0 5.2392 0H10.4784V5.2392Z" fill="#E01E5A"></path><path d="M13.1157 5.2392C13.1157 2.35561 15.4713 0 18.3549 0C21.2385 0 23.5941 2.35561 23.5941 5.2392V18.3575C23.5941 21.2411 21.2385 23.5967 18.3549 23.5967C15.4713 23.5967 13.1157 21.2411 13.1157 18.3575V5.2392Z" fill="#E01E5A"></path></g><g transform="translate(26.28 26.28)"><path d="M5.23927 13.1157C8.12286 13.1157 10.4785 15.4713 10.4785 18.3549C10.4785 21.2385 8.12286 23.5941 5.23927 23.5941C2.35568 23.5941 7.4362e-05 21.2385 7.4362e-05 18.3549V13.1157H5.23927Z" fill="#ECB22E"></path><path d="M5.23927 10.4784C2.35568 10.4784 7.4362e-05 8.12279 7.4362e-05 5.2392C7.4362e-05 2.35561 2.35568 0 5.23927 0H18.3576C21.2412 0 23.5968 2.35561 23.5968 5.2392C23.5968 8.12279 21.2412 10.4784 18.3576 10.4784H5.23927Z" fill="#ECB22E"></path></g></svg>);
    case "notion": return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"></path></svg>);
    case "github": return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>);
    case "figma": return (<svg viewBox="0 0 38 57" aria-hidden="true"><path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" fill="#1ABCFE"></path><path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" fill="#0ACF83"></path><path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" fill="#FF7262"></path><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" fill="#F24E1E"></path><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" fill="#A259FF"></path></svg>);
    case "stripe": return (<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#635BFF"></rect><path fill="#fff" transform="translate(5 5) scale(0.5833)" d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"></path></svg>);
    case "hubspot": return (<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#ff7a59" d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z"/></svg>);
  }
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
const treeDepth = (node: TreeAgent): number =>
  Math.max(0, ...(node.children ?? []).map((child) => 1 + treeDepth(child)));
const dollars = (value: number) => `$${value.toFixed(2)}`;
function sampleTree(): TreeAgent {
  const now = Date.now();
  return {
    id: "lead",
    name: "Orchestrator",
    tools: [<DemoTool key="slack" kind="slack" />, <DemoTool key="notion" kind="notion" />, <DemoTool key="github" kind="github" />],
    model: "Opus 5.5",
    task: "Launch the new pricing page by Friday",
    status: "running",
    cost: 0.42,
    started: now - 38000,
    children: [
      {
        id: "research",
        name: "Researcher",
    tools: [<DemoTool key="notion" kind="notion" />, <DemoTool key="slack" kind="slack" />],
        model: "Sonnet 5.5",
        task: "Compare the pricing of five competitors",
        status: "running",
        cost: 0.13,
        started: now - 32000,
        children: [
          {
            id: "scrape",
            name: "Scraper",
    tools: [<DemoTool key="notion" kind="notion" />],
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
    tools: [<DemoTool key="hubspot" kind="hubspot" />, <DemoTool key="notion" kind="notion" />],
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
    tools: [<DemoTool key="notion" kind="notion" />, <DemoTool key="figma" kind="figma" />],
        model: "Sonnet 5.5",
        task: "Write the copy for the three plans",
        status: "running",
        cost: 0.1,
        started: now - 27000,
      },
      {
        id: "coder",
        name: "Coder",
    tools: [<DemoTool key="github" kind="github" />, <DemoTool key="stripe" kind="stripe" />, <DemoTool key="figma" kind="figma" />],
        model: "GPT-6 Sol",
        task: "Build the page and wire up checkout",
        status: "running",
        cost: 0.13,
        started: now - 22000,
        children: [
          {
            id: "tester",
            name: "Tester",
    tools: [<DemoTool key="github" kind="github" />],
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
  title = "Agents",
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
          ? `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`
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
                aria-label={`${isFolded ? "Show" : "Hide"} ${children.length} sub-agents of ${agent.name}`}
                aria-expanded={!isFolded}
                onClick={() => toggle(agent.id)}
              >
                {isFolded
                  ? `${flatten(agent).length - 1} hidden`
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
                type="button"
                    className="agt-primary"
                    onClick={() => resolve("approve")}
                  >
                    Approve
                  </button>
                  <button type="button" onClick={() => resolve("reject")}>Reject</button>
                </>
              ) : (
                <>
                  <button
                type="button"
                    className="agt-primary"
                    onClick={() => resolve("retry")}
                  >
                    Retry
                  </button>
                  <button type="button" onClick={() => resolve("dismiss")}>Dismiss</button>
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
.agt-tree{--agt-ink:#000;--agt-muted:rgba(0,0,0,.61);--agt-subtle:rgba(0,0,0,.45);--agt-cost:rgba(0,0,0,.88);--agt-spark:rgba(0,96,226,.765);--agt-card:#fff;--agt-edge:#00000014;--agt-link:#82bcff;--agt-surface:#f8f8f8;--agt-shadow:0 0 0 .5px rgba(0,0,0,.06),0 1px 1px -1px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.05);--agt-run:rgba(0,109,203,.95);--agt-run-bg:#0088ff1a;--agt-done:rgba(0,125,46,.88);--agt-done-bg:rgba(0,164,51,.098);--agt-wait:#a87500;--agt-wait-bg:#ffa6001a;--agt-fail:rgba(215,36,0,.855);--agt-fail-bg:rgba(245,43,0,.094);width:100%;max-width:900px;font:400 13px/20px Inter,InterVariable,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--agt-muted);container-type:inline-size;position:relative;text-align:left;isolation:isolate}
.agt-tree:where(.dark,[data-theme=dark]),:where(.dark,[data-theme=dark]) .agt-tree{--agt-ink:#fff;--agt-cost:rgba(255,255,255,.9);--agt-spark:#5b9aff;--agt-muted:#ffffff9e;--agt-subtle:#ffffff73;--agt-card:#1c1c1f;--agt-edge:#ffffff1a;--agt-link:#4f8fdb;--agt-surface:#19191b;--agt-shadow:0 0 0 .5px #ffffff1a,0 1px 2px #0006;--agt-run:#70b8ff;--agt-run-bg:#0077ff3a;--agt-done:#3dd68c;--agt-done-bg:rgba(0,240,74,.12);--agt-wait:#ffcd73;--agt-wait-bg:#ffb30026;--agt-fail:#ff977d;--agt-fail-bg:#ff35232b;color-scheme:dark}
.agt-tree *{box-sizing:border-box}.agt-tree button{font:inherit;color:inherit;cursor:pointer}.agt-tree button:focus-visible,.agt-card[role=button]:focus-visible{outline:2px solid var(--agt-link);outline-offset:3px}.agt-tree svg{width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round;flex:none}
.agt-header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 16px;font-size:13px;min-height:20px}.agt-title{display:flex;gap:8px;align-items:center;font-size:13px;font-weight:500;color:var(--agt-ink)}.agt-title>span{display:grid;place-items:center;width:16px;height:14px;color:var(--agt-spark);font-size:16px}.agt-title>span svg{width:14px;height:14px;stroke:none}.agt-header>div{display:flex;align-items:center;gap:4px 10px;color:var(--agt-subtle);font-size:12px;line-height:16px;flex-wrap:wrap;justify-content:flex-end}.agt-header strong{font-weight:500;color:var(--agt-cost)}.agt-header .agt-running-text{color:var(--agt-run)}.agt-header .agt-waiting-text{color:var(--agt-wait)}.agt-header .agt-failed-text{color:var(--agt-fail)}
.agt-canvas{position:relative;--agt-card-width:calc((100% - (var(--agt-columns) - 1)*8px)/var(--agt-columns) - var(--agt-deep-indent))}.agt-connectors{position:absolute;inset:0;width:100%!important;height:100%!important;overflow:visible;pointer-events:none;z-index:0;color:var(--agt-link)}.agt-connectors path{stroke-width:1.5;animation:agt-link-in .42s cubic-bezier(.32,.72,.24,1) both}.agt-connectors .muted{opacity:.2}.agt-origin-dots{z-index:2}.agt-origin-dots circle{fill:var(--agt-card);stroke:var(--agt-link);stroke-width:1.5}.agt-branch{position:relative;min-width:0}.agt-card{width:var(--agt-card-width)}.agt-depth-root>.agt-card{margin:0 auto;left:calc(var(--agt-deep-indent)/-2)}.agt-first-level{display:grid;grid-template-columns:repeat(var(--agt-columns),minmax(0,1fr));gap:8px;margin-top:40px}.agt-first-level .agt-card{width:calc(100% - var(--agt-deep-indent))}.agt-children:not(.agt-first-level){display:grid;gap:12px;margin-top:12px;margin-left:32px}.agt-children:not(.agt-first-level) .agt-card{width:calc(100% - var(--agt-deep-indent) + var(--agt-depth)*32px - 32px)}
.agt-card{min-width:0;padding:10px 10px 8px;background:var(--agt-card);border:0;border-radius:8px;box-shadow:var(--agt-shadow);position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr);gap:6px;animation:agt-card-in .36s cubic-bezier(.32,.72,.24,1) both}.agt-card[role=button]{cursor:pointer}.agt-card.queued,.agt-card.stopped{--agt-opacity:.55;opacity:.55}.agt-card-head{display:flex;align-items:center;gap:8px;min-height:30px}.agt-avatar{display:grid;place-items:center;width:22px;height:22px;border-radius:6px;background:var(--agt-card);box-shadow:var(--agt-shadow);flex:none;font-size:16px}.agt-avatar>svg,.agt-avatar>img{width:16px;height:16px}.agt-avatar.claude{color:#d6916f}.agt-avatar.gemini{color:#7eafff}.agt-avatar.openai{color:var(--agt-ink)}.agt-identity{min-width:0;flex:1}.agt-identity strong{display:block;font-size:13px;font-weight:500;line-height:16px;color:var(--agt-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.agt-identity small{display:block;font-size:11px;color:var(--agt-subtle);line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.agt-status{display:inline-flex;align-items:center;gap:4px;border:0;white-space:nowrap;border-radius:4px;padding:0 6px 0 4px;font-size:11px!important;font-weight:500;line-height:16px;height:18px;color:var(--agt-subtle);background:var(--agt-surface);margin-left:auto}.agt-status.running{background:var(--agt-run-bg);color:var(--agt-run)}.agt-status.done{background:var(--agt-done-bg);color:var(--agt-done)}.agt-status.waiting{background:var(--agt-wait-bg);color:var(--agt-wait)}.agt-status.failed{background:var(--agt-fail-bg);color:var(--agt-fail)}.agt-status svg{width:12px;height:12px}.agt-spinner{display:block;width:12px;height:12px;animation:agt-spin .9s linear infinite}.agt-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
.agt-task{font-size:12px;color:var(--agt-muted);line-height:16px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:-2px -2px -3px;padding:2px 2px 3px}.agt-tools{display:inline-flex;vertical-align:top;margin-right:6px}.agt-tools>span{display:grid;place-items:center;width:16px;height:16px;border-radius:4px;background:var(--agt-card);box-shadow:var(--agt-shadow);margin-right:-4px}.agt-tools>span:last-child{margin-right:0}.agt-tools svg,.agt-tools img{width:12px;height:12px}.agt-tools svg{stroke:none;fill:currentColor;color:var(--agt-ink)}.agt-card-footer{display:flex;align-items:center;font-size:11px;line-height:16px;font-weight:500;gap:6px;font-variant-numeric:tabular-nums;min-height:20px;color:var(--agt-cost)}.agt-duration{color:var(--agt-subtle);font-weight:400}.agt-card-footer button{display:flex;align-items:center;gap:2px;border:0;border-radius:5px;background:none;color:var(--agt-subtle);font-size:11px;font-weight:500;line-height:20px;margin-left:auto;padding:0 4px 0 6px}.agt-card-footer button svg{transition:transform .25s}.agt-tree .agt-live-cost{background:linear-gradient(100deg,var(--agt-muted),var(--agt-ink),var(--agt-muted));background-size:250% 100%;background-clip:text;color:transparent;animation:agt-shimmer 2.7s linear infinite}
.agt-dialog-backdrop{position:absolute;inset:0;display:grid;place-items:center;background:#0002;z-index:20;border-radius:12px;padding:16px}.agt-dialog{width:320px;max-width:100%;background:var(--agt-card);border:1px solid var(--agt-edge);border-radius:12px;box-shadow:0 10px 45px #0003;padding:18px;animation:agt-card-in .2s both}.agt-dialog>div{display:flex;align-items:center;gap:8px}.agt-dialog strong{font-weight:500;font-size:13px}.agt-dialog p{font-size:12px;line-height:1.7;color:var(--agt-muted);margin:12px 0 18px}.agt-dialog-close{margin-left:auto;border:0;background:none;font-size:20px!important;color:var(--agt-muted)!important}.agt-dialog footer{display:flex;gap:7px}.agt-dialog footer button{border:1px solid var(--agt-edge);border-radius:6px;padding:5px 10px;background:none;font-size:11px}.agt-dialog footer button.agt-primary{background:var(--agt-ink);color:var(--agt-card);border-color:var(--agt-ink)}
@container(max-width:559px){.agt-canvas{--agt-card-width:calc(100% - var(--agt-max-depth)*32px)}.agt-depth-root>.agt-card{margin:0;left:0;width:var(--agt-card-width)}.agt-first-level{display:grid;grid-template-columns:1fr;gap:12px;margin:12px 0 0 32px}.agt-first-level .agt-card{width:calc(100% - (var(--agt-max-depth) - 1)*32px)}.agt-children:not(.agt-first-level) .agt-card{width:calc(100% - (var(--agt-max-depth) - var(--agt-depth))*32px)}.agt-header{flex-wrap:wrap}.agt-title{width:100%}.agt-header>div{margin-left:auto;gap:4px 10px}}
@keyframes agt-spin{to{transform:rotate(360deg)}}@keyframes agt-card-in{from{opacity:0;transform:translateY(5px)}to{opacity:var(--agt-opacity,1);transform:translateY(0)}}@keyframes agt-link-in{from{stroke-dasharray:1;stroke-dashoffset:1}to{stroke-dasharray:1;stroke-dashoffset:0}}@keyframes agt-shimmer{to{background-position:-250% 0}}@media(prefers-reduced-motion:reduce){.agt-tree *{animation:none!important;transition:none!important}.agt-tree .agt-live-cost{color:var(--agt-ink);background:none}}
`;
export default AgentTree;
