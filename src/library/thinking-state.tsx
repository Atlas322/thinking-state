"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export interface ThinkingSource {
  label: string;
  href?: string;
  tooltip?: string;
  icon?: ReactNode;
}

export interface ThinkingStep {
  kind: "search" | "step";
  label: string;
  /** Optional label after this step has finished. */
  completedLabel?: string;
  sources?: ThinkingSource[];
  moreSources?: ThinkingSource[];
}

export interface ThinkingStateProps {
  steps: ThinkingStep[];
  doneLabel?: string;
  stepMs?: number;
  loop?: boolean;
  collapseOnDone?: boolean;
  onDone?: (seconds: number) => void;
  className?: string;
  variant?: "clean" | "classic";
  /**
   * Live mode: a real run owns the progress. Every step in `steps` is shown, the last one is active until
   * `done`, and the header shows the host's `seconds`. The built-in demo timer does not run.
   */
  live?: { done: boolean; seconds: number };
  /** Header text, for other languages: "Thinking" and "Worked for 7s". */
  labels?: { thinking?: string; worked?: (seconds: number) => string };
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21a9 9 0 1 1 9-9M3.5 8h17M3 13h9M12 3c-4 4-4 12 0 18M12 3c2 2 3 4 3 7" />
      <circle cx="17" cy="17" r="4" />
      <path d="m20 20 3 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="thinking-check" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path
        d="m4.8 8.1 2.1 2.1 4.3-4.3"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4.5 6.25 3.5 3.5 3.5-3.5" />
    </svg>
  );
}

function SourceChip({
  source,
  index,
}: {
  source: ThinkingSource;
  index: number;
}) {
  const tooltipId = useId();
  const tip =
    source.tooltip ??
    source.href?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const content = (
    <>
      {source.icon && (
        <span className="thinking-source-icon" aria-hidden="true">
          {source.icon}
        </span>
      )}
      <span className="thinking-source-label" dir="auto">
        {source.label}
      </span>
      {tip && (
        <span id={tooltipId} role="tooltip" className="thinking-tooltip">
          {tip}
        </span>
      )}
    </>
  );
  const props = {
    className: "thinking-source",
    "aria-label": source.label,
    style: { "--chip-delay": `${120 + index * 160}ms` } as CSSProperties,
    "aria-describedby": tip ? tooltipId : undefined,
  };
  return source.href ? (
    <a {...props} href={source.href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <span {...props} tabIndex={tip ? 0 : undefined}>
      {content}
    </span>
  );
}

function Sources({ step }: { step: ThinkingStep }) {
  const [expanded, setExpanded] = useState(false);
  const extraId = useId();
  const sources = step.sources ?? [];
  const extra = step.moreSources ?? [];
  if (!sources.length && !extra.length) return null;
  return (
    <div className="thinking-sources">
      {sources.map((source, i) => (
        <SourceChip key={`${source.label}-${i}`} source={source} index={i} />
      ))}
      {extra.length > 0 && (
        <>
          <span
            id={extraId}
            className="thinking-extra-sources"
            hidden={!expanded}
          >
            {expanded &&
              extra.map((source, i) => (
                <SourceChip
                  key={`${source.label}-${i}`}
                  source={source}
                  index={i}
                />
              ))}
          </span>
          <button
            type="button"
            className="thinking-source thinking-more"
            aria-expanded={expanded}
            aria-controls={extraId}
            style={
              {
                "--chip-delay": `${120 + sources.length * 160}ms`,
              } as CSSProperties
            }
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Show less" : `+${extra.length} more`}
          </button>
        </>
      )}
    </div>
  );
}

/** A timed, presentational thinking timeline. Remount with a new key to replay. */
export function ThinkingState({
  steps,
  doneLabel = "Finished thinking",
  stepMs = 1300,
  loop = false,
  collapseOnDone = false,
  onDone,
  className = "",
  variant = "clean",
  live,
  labels,
}: ThinkingStateProps) {
  const isLive = live !== undefined;
  const liveDone = live?.done ?? false;
  const liveSeconds = live?.seconds ?? 0;
  const [timed, setProgress] = useState({
    visible: Math.min(1, steps.length),
    seconds: 0,
    done: steps.length === 0,
    cycle: 0,
  });
  const [expanded, setExpanded] = useState(true);
  const bodyId = useId();
  const doneCallback = useRef(onDone);
  const autoCollapse = useRef(collapseOnDone);
  useEffect(() => {
    doneCallback.current = onDone;
    autoCollapse.current = collapseOnDone;
  }, [onDone, collapseOnDone]);
  const duration = Number.isFinite(stepMs) ? Math.max(1, stepMs) : 1300;
  // The clock depends on the length, not array identity, so inline data and callback updates don't restart it.
  useEffect(() => {
    if (isLive) return;
    let started = performance.now();
    let completedAt: number | null = null;
    let cycle = 0;
    let lastVisible = -1;
    let lastSeconds = -1;
    const tick = () => {
      const now = performance.now();
      if (completedAt !== null) {
        if (!loop || steps.length === 0 || now - completedAt < 2600) return;
        cycle += 1;
        started = now;
        completedAt = null;
        lastVisible = -1;
        lastSeconds = -1;
        setExpanded(true);
      }
      const elapsed = now - started;
      const seconds = Math.floor(elapsed / 1000);
      const visible = Math.min(
        steps.length,
        Math.floor(elapsed / duration) + 1,
      );
      const done = elapsed >= steps.length * duration;
      if (visible !== lastVisible || seconds !== lastSeconds || done) {
        setProgress({ visible, seconds, done, cycle });
        lastVisible = visible;
        lastSeconds = seconds;
      }
      if (done) {
        completedAt = now;
        if (!loop || steps.length === 0) window.clearInterval(timer);
        if (autoCollapse.current) setExpanded(false);
        doneCallback.current?.(seconds);
      }
    };
    const timer = window.setInterval(tick, 50);
    // Deferring the initial tick keeps StrictMode's effect replay from duplicating
    // completion callbacks for an empty timeline.
    const initialTick = window.setTimeout(tick, 0);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, [steps.length, duration, loop, isLive]);
  // Live mode: completion comes from the host, once per run.
  useEffect(() => {
    if (!isLive || !liveDone) return;
    if (autoCollapse.current) setExpanded(false);
    doneCallback.current?.(liveSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, liveDone]);
  const progress = isLive
    ? { visible: steps.length, seconds: liveSeconds, done: liveDone, cycle: 0 }
    : timed;

  return (
    <div
      className={`thinking-state ${className}`.trim()}
      data-variant={variant}
      data-done={progress.done}
    >
      <style>
        {
          ".thinking-state {\n  --thinking-fg: rgb(0 0 0 / 88%);\n  --thinking-muted: rgb(0 0 0 / 61%);\n  --thinking-line: rgb(0 0 0 / 8%);\n  --thinking-dot: rgb(0 0 0 / 25%);\n  --thinking-blue: #4d80ed;\n  --thinking-chip: #fff;\n  --thinking-hover: #f4f4f5;\n  --thinking-tip: #fff;\n  --thinking-shadow: 0 0 0 .5px rgb(0 0 0 / 6%), 0 1px 1px -1px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 5%);\n  width: 100%; max-width: 440px; color: var(--thinking-fg);\n  font: 400 13px/20px Inter, InterVariable, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;\n  -webkit-font-smoothing: antialiased;\n}\n:where(.dark, [data-theme='dark']) .thinking-state,\n.thinking-state:where(.dark, [data-theme='dark']) {\n  --thinking-fg: rgb(255 255 255 / 90%);\n  --thinking-muted: rgb(255 255 255 / 62%);\n  --thinking-line: rgb(255 255 255 / 8%);\n  --thinking-dot: rgb(255 255 255 / 30%);\n  --thinking-blue: #608df4;\n  --thinking-chip: #1c1c1e;\n  --thinking-hover: #29292c;\n  --thinking-tip: #232326;\n  --thinking-shadow: 0 0 0 .5px rgb(255 255 255 / 7%), 0 1px 2px rgb(0 0 0 / 15%);\n}\n.thinking-state *, .thinking-state *::before, .thinking-state *::after { box-sizing: border-box; }\n.thinking-state button { font: inherit; cursor: pointer; }\n.thinking-header { display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 0 8px; border: 0; border-radius: 8px; background: none; color: inherit; text-align: start; }\n.thinking-heading { display: flex; align-items: baseline; gap: 8px; font-weight: 500; }\n.thinking-time { color: var(--thinking-muted); font-variant-numeric: tabular-nums; font-weight: 400; }\n.thinking-mark { width: 16px; height: 16px; display: grid; grid-template: repeat(3, 1fr) / repeat(3, 1fr); gap: 1.5px; padding: 1.5px; flex: none; }\n.thinking-mark i { background: var(--thinking-blue); border-radius: .5px; animation: thinking-twinkle 1.4s ease-in-out infinite; }\n[data-done='true'] .thinking-mark i { animation: none; opacity: .75; }\n.thinking-chevron { display: grid; width: 16px; height: 16px; margin-left: -4px; color: var(--thinking-muted); opacity: 0; transition: opacity .15s, transform .25s; }\n.thinking-header:hover .thinking-chevron, .thinking-header:focus-visible .thinking-chevron { opacity: 1; }\n.thinking-header[aria-expanded='false'] .thinking-chevron { transform: rotate(-90deg); }\n.thinking-body { display: grid; grid-template-rows: 1fr; transition: grid-template-rows .32s cubic-bezier(.22,1,.36,1), opacity .2s; }\n.thinking-body[data-open='false'] { grid-template-rows: 0fr; opacity: 0; }\n.thinking-clip { min-height: 0; }\n.thinking-body[data-open='false'] .thinking-clip { overflow: hidden; }\n.thinking-list { list-style: none; margin: 0; padding: 8px 8px 0; }\n.thinking-item { position: relative; display: grid; grid-template-columns: 16px minmax(0,1fr); column-gap: 10px; padding: 0 0 12px; animation: thinking-enter .52s cubic-bezier(.22,1,.36,1) both; }\n.thinking-item:not(:last-child)::before { content: ''; position: absolute; top: 22px; bottom: 2px; left: 7px; width: 2px; background: var(--thinking-line); transform-origin: top; animation: thinking-line .45s ease-out both; }\n.thinking-item[data-kind='step']::before { background: repeating-linear-gradient(to bottom, var(--thinking-line) 0 5px, transparent 5px 9px); }\n.thinking-node { display: grid; place-items: center; width: 16px; height: 20px; color: var(--thinking-muted); }\n.thinking-node svg { display: block; width: 16px; height: 16px; }\n.thinking-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--thinking-dot); }\n.thinking-item[data-active='true'] .thinking-dot { width: 6px; height: 6px; border-radius: 1px; background: var(--thinking-blue); animation: thinking-pulse 1.3s ease-in-out infinite; }\n.thinking-content { min-width: 0; }\n.thinking-label { color: var(--thinking-muted); overflow-wrap: anywhere; }\n.thinking-shimmer { background: linear-gradient(100deg,var(--thinking-muted) 20%,var(--thinking-fg) 45%,var(--thinking-muted) 70%); background-size: 250% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; animation: thinking-shimmer 2.3s linear infinite; }\n.thinking-sources { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; padding: 1px 0 2px; }\n.thinking-source { position: relative; display: inline-flex; align-items: center; gap: 6px; max-width: 100%; min-height: 26px; padding: 0 8px 0 6px; border: 0; border-radius: 6px; color: var(--thinking-fg); background: var(--thinking-chip); box-shadow: var(--thinking-shadow); font: 400 12px/16px Inter, InterVariable, ui-sans-serif, system-ui, sans-serif; text-decoration: none; animation: thinking-chip .42s cubic-bezier(.22,1,.36,1) var(--chip-delay,0ms) both; transition: background .15s; }\n.thinking-source:hover, .thinking-source:focus-visible { background: var(--thinking-hover); z-index: 2; }\n.thinking-source-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.thinking-source-icon { display: grid; place-items: center; width: 14px; height: 14px; border-radius: 4px; overflow: hidden; flex: none; }\n.thinking-source-icon svg, .thinking-source-icon img { width: 100%; height: 100%; display: block; }\n.thinking-tooltip { position: absolute; bottom: calc(100% + 8px); left: 0; z-index: 5; max-width: min(300px,75vw); width: max-content; padding: 4px 8px; border-radius: 6px; box-shadow: var(--thinking-shadow), 0 4px 16px rgb(0 0 0 / 8%); background: var(--thinking-tip); color: var(--thinking-muted); opacity: 0; visibility: hidden; transform: translateY(3px); transition: .15s; pointer-events: none; overflow-wrap: anywhere; }\n.thinking-source:hover .thinking-tooltip, .thinking-source:focus-visible .thinking-tooltip { opacity: 1; visibility: visible; transform: translateY(0); }\n.thinking-state .thinking-more { background: transparent; box-shadow: inset 0 0 0 .5px var(--thinking-line); color: var(--thinking-muted); font-size: 12px; line-height: 16px; padding: 0 8px; }\n.thinking-state .thinking-more:hover, .thinking-state .thinking-more[aria-expanded='true'] { background: var(--thinking-line); color: var(--thinking-fg); }\n.thinking-extra-sources { display: contents; }\n.thinking-extra-sources[hidden] { display: none; }\n.thinking-finished { color: var(--thinking-fg); }\n.thinking-node .thinking-check { color: var(--thinking-blue); animation: thinking-check-in .46s cubic-bezier(.34,1.56,.64,1) both; }\n.thinking-check path { stroke-dasharray: 10; stroke-dashoffset: 10; animation: thinking-tick .3s .18s ease-out forwards; }\n.thinking-state :focus-visible { outline: 2px solid var(--thinking-blue); outline-offset: 3px; }\n.thinking-state[data-variant='classic'] { font-size: 14px; }\n[data-variant='classic'] .thinking-mark { display: none; }\n[data-variant='classic'] .thinking-chevron { order: -1; margin: 0; opacity: 1; }\n[data-variant='classic'] .thinking-heading { font-weight: 400; color: var(--thinking-muted); }\n[data-variant='classic'] .thinking-item { column-gap: 14px; }\n[data-variant='classic'] .thinking-dot { width: 7px; height: 7px; }\n[data-variant='classic'] .thinking-source { font-size: 13px; min-height: 28px; background: var(--thinking-line); box-shadow: none; }\n[data-variant='classic'] .thinking-more { background: transparent; }\n[data-variant='classic'] .thinking-item[data-kind='step']::before { background: var(--thinking-line); }\n@keyframes thinking-enter { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }\n@keyframes thinking-chip { from { opacity: 0; transform: translateY(4px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }\n@keyframes thinking-twinkle { 0%,100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1); } }\n@keyframes thinking-pulse { 0%,100% { opacity: .45; box-shadow: 0 0 0 0 transparent; } 50% { opacity: 1; box-shadow: 0 0 0 3px color-mix(in srgb,var(--thinking-blue) 12%,transparent); } }\n@keyframes thinking-shimmer { from { background-position: 180% 0; } to { background-position: -80% 0; } }\n@keyframes thinking-line { from { transform: scaleY(0); } to { transform: scaleY(1); } }\n@keyframes thinking-check-in { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }\n@keyframes thinking-tick { to { stroke-dashoffset: 0; } }\n@media (pointer: coarse) { .thinking-header { min-height: 44px; } .thinking-source { min-height: 32px; } }\n@media (prefers-reduced-motion: reduce) {\n  .thinking-state *, .thinking-state *::before { animation: none !important; transition: none !important; }\n  .thinking-shimmer { background: none; color: var(--thinking-muted); }\n  .thinking-check path { stroke-dashoffset: 0; }\n}\n"
        }
      </style>
      <button
        type="button"
        className="thinking-header"
        aria-expanded={expanded}
        aria-controls={bodyId}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="thinking-mark" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <i
              key={i}
              style={{
                animationDelay: `${(Math.floor(i / 3) + (i % 3)) * 120}ms`,
              }}
            />
          ))}
        </span>
        <span className="thinking-heading">
          {progress.done ? (
            (labels?.worked?.(progress.seconds) ??
            `Worked for ${progress.seconds}s`)
          ) : (
            <>
              <span className="thinking-shimmer">
                {labels?.thinking ?? "Thinking"}
              </span>{" "}
              <span className="thinking-time">{progress.seconds}s</span>
            </>
          )}
        </span>
        <span className="thinking-chevron" aria-hidden="true">
          <Chevron />
        </span>
      </button>
      <div
        id={bodyId}
        className="thinking-body"
        data-open={expanded}
        inert={!expanded}
        aria-hidden={!expanded}
      >
        <div className="thinking-clip">
          <ol
            className="thinking-list"
            aria-live="polite"
            aria-relevant="additions text"
            key={progress.cycle}
          >
            {steps.slice(0, progress.visible).map((step, i) => {
              const active = !progress.done && i === progress.visible - 1;
              const label = !active
                ? (step.completedLabel ??
                  (step.kind === "search" && step.label === "Searching"
                    ? "Searched"
                    : step.label))
                : step.label;
              return (
                <li
                  key={i}
                  className="thinking-item"
                  data-active={active}
                  data-kind={step.kind}
                >
                  <span className="thinking-node" aria-hidden="true">
                    {step.kind === "search" ? (
                      <SearchIcon />
                    ) : (
                      <span className="thinking-dot" />
                    )}
                  </span>
                  <div className="thinking-content">
                    <span
                      className={`thinking-label${active ? " thinking-shimmer" : ""}`}
                      dir="auto"
                    >
                      {label}
                    </span>
                    <Sources step={step} />
                  </div>
                </li>
              );
            })}
            {progress.done && (
              <li className="thinking-item thinking-finished">
                <span className="thinking-node" aria-hidden="true">
                  <CheckIcon />
                </span>
                <span>{doneLabel}</span>
              </li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

const steps: ThinkingStep[] = [
  {
    kind: "search",
    label: "Searching",
    sources: [
      {
        label: "Slack – #team-offsite",
        href: "https://slack.com/",
        tooltip: "slack.com",
        icon: <SlackMark />,
      },
      {
        label: "X – @lisbonguide",
        href: "https://x.com/",
        tooltip: "x.com",
        icon: <XMark />,
      },
      {
        label: "Notion – Offsite plan",
        href: "https://notion.so/",
        tooltip: "notion.so",
        icon: <NotionMark />,
      },
      {
        label: "Wikipedia – Lisbon",
        href: "https://en.wikipedia.org/wiki/Lisbon",
        tooltip: "en.wikipedia.org/wiki/Lisbon",
        icon: <WikipediaMark />,
      },
    ],
    moreSources: [
      {
        label: "Google Flights – LIS",
        href: "https://www.google.com/travel/flights",
        tooltip: "google.com/travel/flights",
      },
      {
        label: "Booking.com – Lisbon",
        href: "https://www.booking.com",
        tooltip: "booking.com",
      },
      {
        label: "Airbnb – Alfama",
        href: "https://www.airbnb.com",
        tooltip: "airbnb.com",
      },
    ],
  },
  { kind: "step", label: "Reading 7 sources about the trip" },
  { kind: "step", label: "Comparing flights and hotels" },
  { kind: "step", label: "Checking dates against the team calendar" },
  { kind: "step", label: "Drafting the offsite agenda" },
];

function SlackMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
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
}
function XMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="3" fill="#111" />
      <path
        d="m4 3 8 10h-2L2 3h2Zm0 10L12 3"
        transform="translate(1 0)"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );
}
function NotionMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="1.5"
        fill="white"
        stroke="#111"
        strokeWidth="1.2"
      />
      <path
        d="M4 12V4h1.5l5 8H12V4M3 4h4m2 0h4M3 12h4"
        fill="none"
        stroke="#111"
        strokeWidth="1.2"
      />
    </svg>
  );
}
function WikipediaMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="2" fill="white" />
      <path
        d="m2 4 3.5 8L8 6l2.5 6L14 4M1 4h4m1 0h4m2 0h3"
        fill="none"
        stroke="#111"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function Demo() {
  return <ThinkingState steps={steps} stepMs={1500} variant="clean" />;
}
