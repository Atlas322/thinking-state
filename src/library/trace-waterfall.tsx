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
const toolMarks: Record<string, React.ReactNode> = {
  GitHub: (
    <svg viewBox="0 0 16 16" style={{ fill: "var(--trw-ink)", stroke: "none" }}>
      <path d="M8 1a7 7 0 0 0-2.2 13.6c.35.07.48-.15.48-.34v-1.2c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.03-.78-1.03-.64-.43.05-.42.05-.42.7.05 1.07.72 1.07.72.63 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.94-1.55-.18-3.19-.78-3.19-3.46 0-.76.27-1.39.72-1.88-.07-.18-.31-.89.07-1.85 0 0 .59-.19 1.92.72a6.6 6.6 0 0 1 3.5 0c1.34-.91 1.92-.72 1.92-.72.38.96.14 1.67.07 1.85.45.49.72 1.12.72 1.88 0 2.69-1.64 3.28-3.2 3.45.25.22.48.65.48 1.3v1.93c0 .19.13.41.48.34A7 7 0 0 0 8 1Z" />
    </svg>
  ),
  Stripe: (
    <svg viewBox="0 0 16 16" style={{ stroke: "none" }}>
      <rect x="1" y="1" width="14" height="14" rx="3" fill="#635bff" />
      <path d="M10.3 6c-.5-.4-1.2-.6-1.9-.6-1 0-1.6.5-1.6 1.1 0 1.6 3.6.9 3.6 3 0 .9-.8 1.6-2.1 1.6-.8 0-1.6-.3-2.1-.7" fill="none" stroke="#fff" strokeWidth="1.4" />
    </svg>
  ),
  Notion: (
    <svg viewBox="0 0 16 16">
      <rect x="2" y="2" width="12" height="12" rx="2" style={{ fill: "#fff" }} />
      <path d="M5.5 11.5v-7h1l3.5 7h1v-7" />
    </svg>
  ),
  Figma: (
    <svg viewBox="0 0 16 16" style={{ stroke: "none" }}>
      <path d="M6 1h2v4.5H6a2.25 2.25 0 0 1 0-4.5Z" fill="#f24e1e" />
      <path d="M8 1h2a2.25 2.25 0 0 1 0 4.5H8Z" fill="#ff7262" />
      <path d="M6 5.5h2V10H6a2.25 2.25 0 0 1 0-4.5Z" fill="#a259ff" />
      <circle cx="10" cy="7.75" r="2.25" fill="#1abcfe" />
      <path d="M6 10h2v2.25A2.25 2.25 0 1 1 6 10Z" fill="#0acf83" />
    </svg>
  ),
  Postgres: (
    <svg viewBox="0 0 16 16" style={{ stroke: "#336791" }}>
      <ellipse cx="8" cy="4" rx="5" ry="2" />
      <path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2" />
    </svg>
  ),
};
function toolMark(detail = "") {
  return (
    toolMarks[detail] ?? (
      <svg viewBox="0 0 16 16">
        <circle cx="6.5" cy="6.5" r="4" />
        <path d="m10 10 3 3" />
      </svg>
    )
  );
}
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
      style={{
        width: "1em",
        height: "1em",
        display: "block",
        stroke: "none",
        fill:
          brand === "claude"
            ? "#d97757"
            : brand === "googlegemini"
              ? "#4f65ff"
              : "var(--trw-ink)",
      }}
    >
      <path d={providerPaths[brand]} />
    </svg>
  );
}

export type TraceSpan = {
  id: string;
  name: string;
  kind: "agent" | "subagent" | "llm" | "tool";
  status: "running" | "done" | "failed";
  start: number;
  end?: number;
  detail?: string;
  icon?: React.ReactNode;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
  input?: string;
  output?: string;
  error?: string;
  children?: TraceSpan[];
};
export type TraceWaterfallProps = {
  root?: TraceSpan;
  now?: number;
  startedAt?: number;
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (ids: string[]) => void;
  openId?: string | null;
  defaultOpenId?: string | null;
  onOpenChange?: (id: string | null, span?: TraceSpan) => void;
  markSlowest?: boolean;
  minRange?: number;
  formatCost?: (value: number) => string;
  title?: string;
  className?: string;
};
type Row = { span: TraceSpan; depth: number; parent?: string };
const allSpans = (span: TraceSpan): TraceSpan[] => [
  span,
  ...(span.children ?? []).flatMap(allSpans),
];
const aggregate = (
  span: TraceSpan,
  key: "cost" | "tokensIn" | "tokensOut",
): number =>
  Math.max(0, span[key] ?? 0) +
  (span.children ?? []).reduce((sum, child) => sum + aggregate(child, key), 0);
const money = (value: number) =>
  `$${value < 0.01 ? value.toFixed(3) : value.toFixed(2)}`;
const duration = (value: number) =>
  value >= 60000
    ? `${Math.floor(value / 60000)}m ${Math.floor((value % 60000) / 1000)}s`
    : value >= 1000
      ? `${Number((value / 1000).toFixed(1))}s`
      : `${Math.round(value)}ms`;
const short = (value: number) =>
  value >= 1000 ? `${Number((value / 1000).toFixed(1))}k` : String(value);
function example(): TraceSpan {
  return {
    id: "run",
    name: "Orchestrator",
    detail: "Opus 5.5",
    kind: "agent",
    status: "running",
    start: 0,
    input: "Launch the new pricing page by Friday",
    children: [
      {
        id: "plan",
        name: "Plan the launch",
        detail: "Opus 5.5",
        model: "Opus 5.5",
        kind: "llm",
        status: "done",
        start: 900,
        end: 7800,
        tokensIn: 3240,
        tokensOut: 880,
        cost: 0.115,
        input: "Plan the launch of the new pricing page",
        output:
          "Research competitors, write the three plans, build and test checkout.",
      },
      {
        id: "research",
        name: "Researcher",
        detail: "Sonnet 5.5",
        kind: "subagent",
        status: "done",
        start: 8100,
        end: 38100,
        children: [
          {
            id: "linear",
            name: "web_search",
            detail: "Linear pricing",
            kind: "tool",
            status: "done",
            start: 9000,
            end: 14400,
            cost: 0.005,
            tokensIn: 1800,
            tokensOut: 2800,
            output: "Retrieved the pricing plans and feature comparison.",
          },
          {
            id: "notion",
            name: "web_search",
            detail: "Notion pricing",
            kind: "tool",
            status: "done",
            start: 9300,
            end: 16500,
            cost: 0.005,
            tokensIn: 2100,
            tokensOut: 3200,
          },
          {
            id: "query",
            name: "Query plan usage",
            detail: "Postgres",
            kind: "tool",
            status: "done",
            start: 9700,
            end: 13200,
            tokensIn: 800,
            tokensOut: 4200,
          },
          {
            id: "reviews",
            name: "Read G2 reviews",
            detail: "120 pages",
            kind: "tool",
            status: "done",
            start: 14800,
            end: 27800,
            cost: 0.02,
          },
          {
            id: "summary",
            name: "Summarize findings",
            detail: "Gemini 3.8 Flash",
            model: "Gemini 3.8 Flash",
            kind: "llm",
            status: "done",
            start: 28000,
            end: 37300,
            cost: 0.02,
            tokensIn: 9800,
            tokensOut: 1400,
            output: "Linear and Notion gate seats; Figma prices by editor.",
          },
        ],
      },
      {
        id: "writer",
        name: "Writer",
        detail: "Sonnet 5.5",
        kind: "subagent",
        status: "done",
        start: 11100,
        end: 48100,
        children: [
          {
            id: "voice",
            name: "Read brand voice",
            detail: "Notion",
            kind: "tool",
            status: "done",
            start: 11700,
            end: 15300,
            tokensIn: 1200,
            tokensOut: 4200,
          },
          {
            id: "figma",
            name: "Read pricing frames",
            detail: "Figma",
            kind: "tool",
            status: "done",
            start: 12000,
            end: 17100,
            tokensIn: 1800,
            tokensOut: 3900,
          },
          {
            id: "copy",
            name: "Draft plan copy",
            detail: "Sonnet 5.5",
            kind: "llm",
            status: "done",
            start: 17800,
            end: 40800,
            cost: 0.09,
            tokensIn: 1800,
            tokensOut: 900,
          },
          {
            id: "save",
            name: "Save draft",
            detail: "Notion",
            kind: "tool",
            status: "done",
            start: 41000,
            end: 44600,
          },
        ],
      },
      {
        id: "coder",
        name: "Coder",
        detail: "GPT-6 Sol",
        kind: "subagent",
        status: "running",
        start: 15400,
        children: [
          {
            id: "branch",
            name: "Create branch",
            detail: "GitHub",
            kind: "tool",
            status: "done",
            start: 16000,
            end: 18100,
            tokensIn: 80,
            tokensOut: 100,
          },
          {
            id: "build",
            name: "Write pricing page",
            detail: "GPT-6 Sol",
            kind: "llm",
            status: "done",
            start: 18400,
            end: 38400,
            cost: 0.16,
            tokensIn: 800,
            tokensOut: 900,
          },
          {
            id: "prices",
            name: "Create prices",
            detail: "Stripe",
            kind: "tool",
            status: "done",
            start: 38600,
            end: 41600,
          },
          {
            id: "tests",
            name: "Run checkout tests",
            detail: "GitHub",
            kind: "tool",
            status: "failed",
            start: 42800,
            end: 51200,
            input: "pnpm test checkout",
            error: "2 of 14 checkout tests fail – coupon codes aren't applied to seat prices",
          },
          {
            id: "fix",
            name: "Fix coupon handling",
            detail: "GPT-6 Sol",
            model: "GPT-6 Sol",
            kind: "llm",
            status: "running",
            start: 51400,
            cost: 0.05,
            tokensIn: 2100,
            tokensOut: 600,
          },
        ],
      },
    ],
  };
}

export function TraceWaterfall({
  root,
  now,
  startedAt,
  collapsed,
  defaultCollapsed = [],
  onCollapsedChange,
  openId,
  defaultOpenId = null,
  onOpenChange,
  markSlowest = true,
  minRange = 10000,
  formatCost = money,
  title = "Trace",
  className = "",
}: TraceWaterfallProps) {
  const [demo] = React.useState(example),
    data = root ?? demo;
  const all = allSpans(data);
  const live = all.some((span) => span.status === "running");
  const maxKnown = Math.max(0, ...all.map((span) => span.end ?? span.start));
  const epoch = React.useRef(Date.now() - (root ? maxKnown : 55000));
  const [clock, setClock] = React.useState(
    () => Date.now() - (startedAt ?? epoch.current),
  );
  const time = now ?? (live ? clock : maxKnown);
  const [folded, setFolded] = React.useState(
    root || defaultCollapsed.length ? defaultCollapsed : ["research", "writer"],
  );
  const hidden = collapsed ?? folded;
  const [open, setOpen] = React.useState<string | null>(
    root || defaultOpenId !== null ? defaultOpenId : "tests",
  );
  const activeId = openId === undefined ? open : openId;
  const selected = all.find((span) => span.id === activeId);
  const [focus, setFocus] = React.useState(data.id);
  const rows = React.useMemo(() => {
    const result: Row[] = [];
    const walk = (span: TraceSpan, depth: number, parent?: string) => {
      result.push({ span, depth, parent });
      if (!hidden.includes(span.id))
        span.children?.forEach((child) => walk(child, depth + 1, span.id));
    };
    walk(data, 0);
    return result;
  }, [data, hidden]);
  const rowRefs = React.useRef(new Map<string, HTMLDivElement>());
  const popup = React.useRef<HTMLDivElement>(null);
  const longest = Math.max(Math.max(1, minRange), time, maxKnown);
  const tickSize =
    longest <= 30000
      ? 10000
      : longest <= 120000
        ? 20000
        : longest <= 600000
          ? 60000
          : Math.pow(10, Math.floor(Math.log10(longest))) / 2;
  const range = Math.ceil(longest / tickSize) * tickSize;
  const ticks = Array.from(
    { length: Math.floor(range / tickSize) + 1 },
    (_, index) => index * tickSize,
  );
  const finished = all.filter(
    (span) =>
      (span.kind === "llm" || span.kind === "tool") && span.end !== undefined,
  );
  const slowest = finished.reduce<TraceSpan | undefined>(
    (best, span) =>
      !best || span.end! - span.start > best.end! - best.start ? span : best,
    undefined,
  );
  const totalDuration = Math.max(0, (data.end ?? time) - data.start);
  React.useEffect(() => {
    if (now !== undefined || !live) return;
    const tick = () => setClock(Date.now() - (startedAt ?? epoch.current));
    tick();
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [now, live, startedAt]);
  React.useEffect(() => {
    if (!rows.some((row) => row.span.id === focus))
      setFocus(rows[0]?.span.id ?? data.id);
  }, [rows, focus, data.id]);
  const lastOpen = React.useRef(selected?.id);
  React.useEffect(() => {
    if (lastOpen.current === selected?.id) return;
    lastOpen.current = selected?.id;
    if (selected)
      popup.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [selected?.id]);
  const fold = (span: TraceSpan) => {
    const next = hidden.includes(span.id)
      ? hidden.filter((value) => value !== span.id)
      : [...hidden, span.id];
    setFolded(next);
    onCollapsedChange?.(next);
  };
  const openSpan = (span: TraceSpan | null) => {
    const next = span?.id ?? null;
    setOpen(next);
    if (span) onOpenChange?.(next, span);
    else onOpenChange?.(null);
    if (!span && activeId) rowRefs.current.get(activeId)?.focus();
  };
  const move = (index: number) => {
    const next = rows[Math.max(0, Math.min(rows.length - 1, index))];
    if (next) {
      setFocus(next.span.id);
      rowRefs.current.get(next.span.id)?.focus();
    }
  };
  const key = (event: React.KeyboardEvent, index: number, row: Row) => {
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "Enter",
        " ",
      ].includes(event.key)
    )
      event.preventDefault();
    if (event.key === "ArrowDown") move(index + 1);
    if (event.key === "ArrowUp") move(index - 1);
    if (event.key === "Home") move(0);
    if (event.key === "End") move(rows.length - 1);
    if (event.key === "ArrowRight" && row.span.children?.length) {
      if (hidden.includes(row.span.id)) fold(row.span);
      else move(index + 1);
    }
    if (event.key === "ArrowLeft") {
      if (row.span.children?.length && !hidden.includes(row.span.id))
        fold(row.span);
      else if (row.parent)
        move(rows.findIndex((item) => item.span.id === row.parent));
    }
    if (event.key === "Enter" || event.key === " ")
      openSpan(activeId === row.span.id ? null : row.span);
    if (event.key === "Escape") openSpan(null);
  };
  const detailTop = selected
    ? Math.min(
        130 +
          Math.max(
            0,
            rows.findIndex((row) => row.span.id === selected.id),
          ) *
            31,
        Math.max(130, rows.length * 31 - 100),
      )
    : 130;
  return (
    <section className={`trw-root ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="trw-header">
        <span className="trw-title">
          <i aria-hidden="true">✦</i>
          {title}
        </span>
        <span className="trw-description">{data.input ?? data.name}</span>
        <span className={`trw-state ${data.status}`} role="status">
          {data.status === "running"
            ? "• Live"
            : data.status === "failed"
              ? "Failed"
              : "✓ Done"}
        </span>
      </header>
      <dl className="trw-totals">
        {[
          ["Duration", duration(totalDuration)],
          ["Cost", formatCost(aggregate(data, "cost"))],
          [
            "Tokens",
            short(aggregate(data, "tokensIn") + aggregate(data, "tokensOut")),
          ],
          [
            "LLM calls",
            String(all.filter((span) => span.kind === "llm").length),
          ],
          [
            "Tool calls",
            String(all.filter((span) => span.kind === "tool").length),
          ],
          [
            "Errors",
            String(all.filter((span) => span.status === "failed").length),
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd
              className={
                live && ["Duration", "Cost", "Tokens"].includes(label)
                  ? "trw-shimmer"
                  : label === "Errors" && value !== "0"
                    ? "trw-err"
                    : ""
              }
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="trw-axis" aria-hidden="true">
        <span>Span</span>
        <div>
          {ticks.map((tick) => (
            <span key={tick} style={{ left: `${(tick / range) * 100}%` }}>
              {duration(tick)}
            </span>
          ))}
        </div>
      </div>
      <div className="trw-rows" role="tree" aria-label="Trace spans">
        {rows.map((row, index) => {
          const span = row.span;
          const end = span.end ?? time;
          const spanDuration = Math.max(0, end - span.start);
          const cost = aggregate(span, "cost");
          const left = Math.max(0, Math.min(100, (span.start / range) * 100));
          const width = Math.max(
            0.6,
            Math.min(100 - left, (spanDuration / range) * 100),
          );
          return (
            <div
              key={span.id}
              ref={(element) => {
                if (element) rowRefs.current.set(span.id, element);
                else rowRefs.current.delete(span.id);
              }}
              role="treeitem"
              aria-level={row.depth + 1}
              aria-expanded={
                span.children?.length ? !hidden.includes(span.id) : undefined
              }
              aria-label={`${span.name}, ${span.kind}, ${span.status}, ${duration(spanDuration)}, ${formatCost(cost)}`}
              tabIndex={focus === span.id ? 0 : -1}
              className={`trw-row ${activeId === span.id ? "selected" : ""}`}
              onFocus={() => setFocus(span.id)}
              onKeyDown={(event) => key(event, index, row)}
              onClick={() => openSpan(activeId === span.id ? null : span)}
            >
              <div
                className="trw-name"
                style={{ paddingLeft: 12 + row.depth * 16 }}
              >
                {row.depth > 0 && (
                  <span
                    className="trw-indent"
                    style={{ left: row.depth * 16 - 1 }}
                    aria-hidden="true"
                  />
                )}
                {span.children?.length ? (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`${hidden.includes(span.id) ? "Expand" : "Collapse"} ${span.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      fold(span);
                      setFocus(span.id);
                      rowRefs.current.get(span.id)?.focus();
                    }}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      style={{
                        transform: hidden.includes(span.id)
                          ? "rotate(-90deg)"
                          : undefined,
                      }}
                    >
                      <path d="m5 6 3 3 3-3" />
                    </svg>
                  </button>
                ) : (
                  <span className="trw-spacer" />
                )}
                <span className={`trw-icon ${span.kind}`}>
                  {span.icon ??
                    (span.kind === "tool" ? (
                      toolMark(span.detail)
                    ) : (
                      <ProviderMark model={span.model ?? span.detail} />
                    ))}
                </span>
                <strong>{span.name}</strong>
                {span.detail && <small>{span.detail}</small>}
                {hidden.includes(span.id) && span.children?.length ? (
                  <em className="trw-count">+{span.children.length}</em>
                ) : null}
                {span.status === "running" && (
                  <i className="trw-spinner" aria-hidden="true" />
                )}
              </div>
              <div className="trw-timeline">
                {ticks.map((tick) => (
                  <i
                    key={tick}
                    className="trw-grid-line"
                    style={{ left: `${(tick / range) * 100}%` }}
                    aria-hidden="true"
                  />
                ))}
                {live && (
                  <i
                    className="trw-now"
                    style={{ left: `${Math.min(100, (time / range) * 100)}%` }}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`trw-bar ${span.kind} ${span.status}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  {hidden.includes(span.id) &&
                    span.children?.map((child) => (
                      <i
                        key={child.id}
                        style={{
                          left: `${Math.max(0, ((child.start - span.start) / Math.max(1, spanDuration)) * 100)}%`,
                        }}
                      />
                    ))}
                </span>
                <span
                  className="trw-value"
                  style={{ left: `${Math.min(100, left + width)}%` }}
                >
                  {duration(spanDuration)}
                  {cost > 0 ? ` · ${formatCost(cost)}` : ""}
                  {markSlowest && slowest?.id === span.id && <b>Slowest</b>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {selected && (
        <div
          ref={popup}
          className="trw-detail"
          role="dialog"
          aria-label={selected.name}
          style={{ top: detailTop }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              openSpan(null);
            }
          }}
        >
          <header>
            <span className={`trw-kind-dot ${selected.kind}`} />
            <strong>{selected.name}</strong>
            <button
              aria-label="Close span details"
              onClick={() => openSpan(null)}
            >
              ×
            </button>
          </header>
          <p>
            {selected.kind} <span>·</span> {selected.status} <span>·</span>{" "}
            {duration(Math.max(0, (selected.end ?? time) - selected.start))}
          </p>
          <dl>
            <div>
              <dt>Cost</dt>
              <dd>{formatCost(aggregate(selected, "cost"))}</dd>
            </div>
            <div>
              <dt>Input tokens</dt>
              <dd>{aggregate(selected, "tokensIn").toLocaleString()}</dd>
            </div>
            <div>
              <dt>Output tokens</dt>
              <dd>{aggregate(selected, "tokensOut").toLocaleString()}</dd>
            </div>
          </dl>
          {selected.model && <p>{selected.model}</p>}
          {(["input", "output", "error"] as const).map((field) =>
            selected[field] ? (
              <div className={`trw-preview ${field}`} key={field}>
                <h4>{field}</h4>
                <pre>{selected[field]}</pre>
              </div>
            ) : null,
          )}
        </div>
      )}
    </section>
  );
}
const css = `
.trw-root{--trw-bg:#fff;--trw-ink:#29292c;--trw-muted:#88888e;--trw-line:#e9e9eb;--trw-hover:#f7f7f8;--trw-agent:#88889820;--trw-agent-edge:#88889840;--trw-llm:#8e7be62b;--trw-llm-edge:#8e7be655;--trw-tool:#39a4b123;--trw-tool-edge:#39a4b14f;width:100%;max-width:950px;border:1px solid var(--trw-line);border-radius:12px;background:var(--trw-bg);color:var(--trw-ink);font:400 12.5px/18px Inter,system-ui,sans-serif;position:relative;container:trw / inline-size;text-align:left;isolation:isolate}:where(.dark,[data-theme=dark]) .trw-root{--trw-bg:#202022;--trw-ink:#e4e4e7;--trw-muted:#85858b;--trw-line:#2b2b2f;--trw-hover:#242427;color-scheme:dark}.trw-root *{box-sizing:border-box}.trw-root button{font:inherit;color:inherit;cursor:pointer}.trw-root :focus-visible{outline:2px solid #82bcff;outline-offset:-2px}.trw-root svg{width:12px;height:12px;stroke:currentColor;stroke-width:1.2;fill:none;stroke-linecap:round;stroke-linejoin:round}.trw-header{display:flex;align-items:center;gap:9px;padding:13px 17px;border-bottom:1px solid var(--trw-line);min-width:0}.trw-title{display:flex;gap:10px;align-items:center;font-size:13px;font-weight:500;white-space:nowrap}.trw-title i{font-size:14px;font-style:normal;color:#80b4ee}.trw-description{color:var(--trw-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}.trw-state{font-size:11.5px;line-height:18px;white-space:nowrap;padding:0 6px;border-radius:4px;color:#6896c5;background:#5e9cdb18;margin-left:auto}.trw-state.done{color:#62aa87;background:#62aa8718}.trw-state.failed{color:#d07882;background:#d0788218}.trw-totals{display:grid;grid-template-columns:repeat(6,1fr);padding:13px 8px;margin:0;border-bottom:1px solid var(--trw-line)}.trw-totals>div{padding:0 13px;border-left:1px solid var(--trw-line)}.trw-totals>div:first-child{border-left:0}.trw-totals dt{font-size:10px;text-transform:uppercase;letter-spacing:.7px;color:var(--trw-muted);white-space:nowrap}.trw-totals dd{font-size:15px;line-height:21px;margin:4px 0 0;font-variant-numeric:tabular-nums}.trw-axis{display:grid;grid-template-columns:34% 1fr;height:30px;border-bottom:1px solid var(--trw-line);font-size:12px;color:var(--trw-muted)}.trw-axis>span{padding:6px 15px;text-transform:uppercase;font-size:10px;letter-spacing:.7px}.trw-axis>div{position:relative;margin-right:40px;border-left:1px solid var(--trw-line)}.trw-axis>div>span{position:absolute;top:6px;transform:translateX(4px);white-space:nowrap}.trw-axis>div>span:last-child{transform:translateX(-100%)}.trw-rows{padding:3px 0 12px;overflow:hidden;border-radius:0 0 12px 12px}.trw-row{display:grid;grid-template-columns:34% 1fr;min-height:30px;cursor:pointer;outline:none;animation:trw-row-in .2s both}.trw-row:hover,.trw-row.selected{background:var(--trw-hover)}.trw-name{display:flex;align-items:center;gap:7px;min-width:0;padding:6px 10px 6px 12px;position:relative}.trw-name strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0;max-width:75%}.trw-name small{font-size:12px;color:var(--trw-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.trw-name>button{border:0;background:none;padding:0;width:10px;height:16px;flex:none;color:var(--trw-muted)}.trw-name>button svg{transition:transform .2s;width:10px}.trw-spacer{width:10px;flex:none}.trw-indent{position:absolute;top:0;bottom:0;width:1px;background:var(--trw-line)}.trw-icon{width:14px;height:14px;display:grid;place-items:center;flex:none;color:#d59373}.trw-icon svg,.trw-icon img{width:13px!important;height:13px!important;max-width:13px;max-height:13px}.trw-err{color:#d65c5c}.trw-count{flex:none;margin-left:auto;font-style:normal;font-size:11px;line-height:16px;padding:0 5px;border-radius:4px;background:var(--trw-hover);border:1px solid var(--trw-line);color:var(--trw-muted)}.trw-icon.tool{color:#72a8b3}.trw-spinner{margin-left:auto;flex:none;width:8px;height:8px;border:1px solid #81afdf44;border-top-color:#81afdf;border-radius:50%;animation:trw-spin 1s linear infinite}.trw-timeline{position:relative;min-width:0;border-left:1px solid var(--trw-line);margin-right:40px}.trw-grid-line{position:absolute;top:0;bottom:0;width:1px;background:var(--trw-line);pointer-events:none}.trw-now{position:absolute;top:-2px;bottom:-2px;width:1px;background:#679ddd88;pointer-events:none;z-index:2;transition:left .2s linear}.trw-row:first-child .trw-now:before{content:'';position:absolute;top:-6px;left:-2px;width:5px;height:5px;border-radius:50%;background:#8ab8f2}.trw-bar{position:absolute;top:9px;height:12px;border-radius:3px;background:var(--trw-agent);border:1px solid var(--trw-agent-edge);transition:left .4s,width .4s;min-width:2px;overflow:hidden}.trw-bar.llm{background:var(--trw-llm);border-color:var(--trw-llm-edge)}.trw-bar.tool{background:var(--trw-tool);border-color:var(--trw-tool-edge)}.trw-bar.failed{background:#c45c6d24;border-color:#c45c6d55}.trw-bar.running:after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 20%,#ffffff0b 50%,transparent 80%);background-size:220% 100%;animation:trw-shine 2.5s linear infinite}.trw-bar>i{position:absolute;top:1px;bottom:1px;width:2px;background:var(--trw-muted);opacity:.45}.trw-value{position:absolute;top:5px;padding-left:6px;white-space:nowrap;font-size:12px;color:var(--trw-muted);font-variant-numeric:tabular-nums;line-height:20px;transition:left .4s;pointer-events:none}.trw-value b{font-size:9.5px;text-transform:uppercase;letter-spacing:.3px;color:#c9945d;background:#a56b2918;padding:1px 4px;border-radius:2px;margin-left:7px;font-weight:500}.trw-shimmer{background:linear-gradient(100deg,var(--trw-muted),var(--trw-ink),var(--trw-muted));background-size:220% 100%;background-clip:text;color:transparent;animation:trw-shine 3s linear infinite}.trw-detail{position:absolute;right:16px;width:310px;max-width:calc(100% - 32px);max-height:390px;overflow:auto;padding:15px;background:var(--trw-bg);border:1px solid var(--trw-line);border-radius:10px;box-shadow:0 10px 35px #0003;z-index:20;animation:trw-pop .18s both}.trw-detail header{display:flex;gap:7px;align-items:center}.trw-detail header strong{font-weight:500;font-size:13px}.trw-detail header button{margin-left:auto;font-size:20px;line-height:20px;padding:0 3px;border:0;background:none;color:var(--trw-muted)}.trw-detail>p{font-size:12px;color:var(--trw-muted);margin:8px 0}.trw-detail>p span{padding:0 4px}.trw-detail dl{display:grid;grid-template-columns:repeat(3,1fr);border-block:1px solid var(--trw-line);padding:10px 0;margin:12px 0}.trw-detail dt{font-size:10px;color:var(--trw-muted)}.trw-detail dd{margin:3px 0 0;font-size:13px}.trw-preview h4{margin:10px 0 5px;text-transform:uppercase;letter-spacing:.06em;font-size:10px;font-weight:500}.trw-preview pre{background:var(--trw-hover);padding:9px;border-radius:6px;font:11.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--trw-muted);margin:0}.trw-preview.error pre{color:#d07882}.trw-kind-dot{width:7px;height:7px;border-radius:2px;background:#9797a7}.trw-kind-dot.llm{background:#a292df}.trw-kind-dot.tool{background:#6cabb3}
@container trw (max-width:559px){.trw-totals{grid-template-columns:repeat(3,1fr);gap:12px 0}.trw-totals>div:nth-child(4){border-left:0}.trw-header{padding:12px}.trw-description{font-size:10px}.trw-axis{grid-template-columns:1fr;height:25px}.trw-axis>span{display:none}.trw-axis>div{margin:0 90px 0 15px;border:0}.trw-row{grid-template-columns:1fr;min-height:55px}.trw-name{padding-top:5px;padding-bottom:2px}.trw-name strong{max-width:68%}.trw-timeline{margin:0 90px 0 15px;min-height:25px;border-left:0}.trw-bar{top:4px;height:12px}.trw-value{top:0;font-size:9px}.trw-now,.trw-grid-line{top:-20px}.trw-row:first-child .trw-now:before{display:none}.trw-value b{display:none}.trw-detail{top:110px!important;right:12px;max-width:calc(100% - 24px)}}@container trw (max-width:359px){.trw-name small{display:none}.trw-description{display:none}.trw-totals>div{padding:0 9px}.trw-totals dt{font-size:8px}}
@keyframes trw-shine{to{background-position:-220% 0}}@keyframes trw-spin{to{transform:rotate(360deg)}}@keyframes trw-row-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}@keyframes trw-pop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}@media(prefers-reduced-motion:reduce){.trw-root *{animation:none!important;transition:none!important}.trw-shimmer{background:none;color:var(--trw-ink)}}
`;
export default TraceWaterfall;
