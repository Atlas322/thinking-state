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
            {expanded ? "Хураах" : `+${extra.length} бусад`}
          </button>
        </>
      )}
    </div>
  );
}

/** A timed, presentational thinking timeline. Remount with a new key to replay. */
export function ThinkingState({
  steps,
  doneLabel = "Бодож дууссан",
  stepMs = 1300,
  loop = false,
  collapseOnDone = false,
  onDone,
  className = "",
  variant = "classic",
}: ThinkingStateProps) {
  const [progress, setProgress] = useState({
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
  }, [steps.length, duration, loop]);

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
            `${progress.seconds} с ажилласан`
          ) : (
            <>
              <span className="thinking-shimmer">Бодож байна</span>{" "}
              <span className="thinking-time">{progress.seconds} с</span>
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
                  (step.kind === "search" && (step.label === "Searching" || step.label === "Хайж байна")
                    ? "Хайсан"
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
    label: "Хайж байна",
    sources: [
      {
        label: "Багийн чат – #аялал",
        href: "https://example.com/chat/team-trip",
        tooltip: "example.com/chat",
        icon: <ChatMark />,
      },
      {
        label: "Аяллын хөтөч – Хөвсгөл",
        href: "https://example.com/guide/khuvsgul",
        tooltip: "example.com/guide",
        icon: <LetterMark letter="А" />,
      },
      {
        label: "Баримтын сан – Аяллын төлөвлөгөө",
        href: "https://example.com/docs/team-trip",
        tooltip: "example.com/docs",
        icon: <DocMark />,
      },
      {
        label: "Нэвтэрхий толь – Хөвсгөл нуур",
        href: "https://example.com/wiki/khuvsgul",
        tooltip: "example.com/wiki",
        icon: <LetterMark letter="Н" />,
      },
    ],
    moreSources: [
      {
        label: "Нислэгийн хуваарь – Мөрөн",
        href: "https://example.com/flights/muren",
        tooltip: "example.com/flights",
      },
      {
        label: "Буудлын захиалга – Хатгал",
        href: "https://example.com/stays/khatgal",
        tooltip: "example.com/stays",
      },
      {
        label: "Жуулчны бааз – Ханх",
        href: "https://example.com/camps/khankh",
        tooltip: "example.com/camps",
      },
    ],
  },
  { kind: "step", label: "Аяллын тухай 7 эх сурвалж уншиж байна" },
  { kind: "step", label: "Нислэг, буудлыг харьцуулж байна" },
  { kind: "step", label: "Огноог багийн хуанлитай тулгаж байна" },
  { kind: "step", label: "Аяллын хөтөлбөрийн ноорог бичиж байна" },
];

function ChatMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path
        d="M2.5 3h11v8H6.5L3 13.5V11h-.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function DocMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path
        d="M4 1.8h5.5L12.5 5v9.2H4ZM6 8h4.5M6 10.5h4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LetterMark({ letter }: { letter: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <text x="8" y="11.4" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">
        {letter}
      </text>
    </svg>
  );
}

export default function Demo() {
  return <ThinkingState steps={steps} stepMs={1500} variant="classic" />;
}
