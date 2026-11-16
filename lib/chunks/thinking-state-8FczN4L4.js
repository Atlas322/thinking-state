import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useId, useRef, useEffect } from "react";
function SearchIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M12 21a9 9 0 1 1 9-9M3.5 8h17M3 13h9M12 3c-4 4-4 12 0 18M12 3c2 2 3 4 3 7" }),
        /* @__PURE__ */ jsx("circle", { cx: "17", cy: "17", r: "4" }),
        /* @__PURE__ */ jsx("path", { d: "m20 20 3 3" })
      ]
    }
  );
}
function CheckIcon() {
  return /* @__PURE__ */ jsxs("svg", { className: "thinking-check", viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "7", fill: "currentColor" }),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "m4.8 8.1 2.1 2.1 4.3-4.3",
        fill: "none",
        stroke: "white",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    )
  ] });
}
function Chevron() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsx("path", { d: "m4.5 6.25 3.5 3.5 3.5-3.5" })
    }
  );
}
function SourceChip({
  source,
  index
}) {
  const tooltipId = useId();
  const tip = source.tooltip ?? source.href?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    source.icon && /* @__PURE__ */ jsx("span", { className: "thinking-source-icon", "aria-hidden": "true", children: source.icon }),
    /* @__PURE__ */ jsx("span", { className: "thinking-source-label", dir: "auto", children: source.label }),
    tip && /* @__PURE__ */ jsx("span", { id: tooltipId, role: "tooltip", className: "thinking-tooltip", children: tip })
  ] });
  const props = {
    className: "thinking-source",
    "aria-label": source.label,
    style: { "--chip-delay": `${120 + index * 160}ms` },
    "aria-describedby": tip ? tooltipId : void 0
  };
  return source.href ? /* @__PURE__ */ jsx("a", { ...props, href: source.href, target: "_blank", rel: "noopener noreferrer", children: content }) : /* @__PURE__ */ jsx("span", { ...props, tabIndex: tip ? 0 : void 0, children: content });
}
function Sources({ step }) {
  const [expanded, setExpanded] = useState(false);
  const extraId = useId();
  const sources = step.sources ?? [];
  const extra = step.moreSources ?? [];
  if (!sources.length && !extra.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "thinking-sources", children: [
    sources.map((source, i) => /* @__PURE__ */ jsx(SourceChip, { source, index: i }, `${source.label}-${i}`)),
    extra.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          id: extraId,
          className: "thinking-extra-sources",
          hidden: !expanded,
          children: expanded && extra.map((source, i) => /* @__PURE__ */ jsx(
            SourceChip,
            {
              source,
              index: i
            },
            `${source.label}-${i}`
          ))
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "thinking-source thinking-more",
          "aria-expanded": expanded,
          "aria-controls": extraId,
          style: {
            "--chip-delay": `${120 + sources.length * 160}ms`
          },
          onClick: () => setExpanded((value) => !value),
          children: expanded ? "Хураах" : `+${extra.length} бусад`
        }
      )
    ] })
  ] });
}
function ThinkingState({
  steps: steps2,
  doneLabel = "Бодож дууссан",
  stepMs = 1300,
  loop = false,
  collapseOnDone = false,
  onDone,
  workedLabel,
  className = "",
  variant = "clean",
  live,
  labels,
  doneIcon
}) {
  const isLive = live !== void 0;
  const liveDone = live?.done ?? false;
  const liveSeconds = live?.seconds ?? 0;
  const [timed, setProgress] = useState({
    visible: Math.min(1, steps2.length),
    seconds: 0,
    ms: 0,
    done: steps2.length === 0,
    cycle: 0
  });
  const [expanded, setExpanded] = useState(
    () => !(live?.done && collapseOnDone)
  );
  const bodyId = useId();
  const doneCallback = useRef(onDone);
  const autoCollapse = useRef(collapseOnDone);
  useEffect(() => {
    doneCallback.current = onDone;
    autoCollapse.current = collapseOnDone;
  }, [onDone, collapseOnDone]);
  const duration = Number.isFinite(stepMs) ? Math.max(1, stepMs) : 1300;
  useEffect(() => {
    if (isLive) return;
    let started = performance.now();
    let completedAt = null;
    let cycle = 0;
    let lastVisible = -1;
    let lastSeconds = -1;
    const tick = () => {
      const now = performance.now();
      if (completedAt !== null) {
        if (!loop || steps2.length === 0 || now - completedAt < 2600) return;
        cycle += 1;
        started = now;
        completedAt = null;
        lastVisible = -1;
        lastSeconds = -1;
        setExpanded(true);
      }
      const elapsed = now - started;
      const seconds = Math.floor(elapsed / 1e3);
      const visible = Math.min(
        steps2.length,
        Math.floor(elapsed / duration) + 1
      );
      const done = elapsed >= steps2.length * duration;
      if (visible !== lastVisible || seconds !== lastSeconds || done) {
        setProgress({ visible, seconds, ms: elapsed, done, cycle });
        lastVisible = visible;
        lastSeconds = seconds;
      }
      if (done) {
        completedAt = now;
        if (!loop || steps2.length === 0) window.clearInterval(timer);
        if (autoCollapse.current) setExpanded(false);
        doneCallback.current?.(seconds);
      }
    };
    const timer = window.setInterval(tick, 50);
    const initialTick = window.setTimeout(tick, 0);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, [steps2.length, duration, loop, isLive]);
  useEffect(() => {
    if (!isLive || !liveDone) return;
    if (autoCollapse.current) setExpanded(false);
    doneCallback.current?.(liveSeconds);
  }, [isLive, liveDone]);
  const progress = isLive ? {
    visible: steps2.length,
    seconds: liveSeconds,
    ms: liveSeconds * 1e3,
    done: liveDone,
    cycle: 0
  } : timed;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `thinking-state ${className}`.trim(),
      "data-variant": variant,
      "data-done": progress.done,
      children: [
        /* @__PURE__ */ jsx("style", { children: ".thinking-state {\n  --thinking-fg: rgb(0 0 0 / 88%);\n  --thinking-muted: rgb(0 0 0 / 61%);\n  --thinking-line: rgb(0 0 0 / 8%);\n  --thinking-dot: rgb(0 0 0 / 25%);\n  --thinking-blue: #4d80ed;\n  --thinking-chip: #fff;\n  --thinking-hover: #f4f4f5;\n  --thinking-tip: #fff;\n  --thinking-shadow: 0 0 0 .5px rgb(0 0 0 / 6%), 0 1px 1px -1px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 5%);\n  width: 100%; max-width: 440px; color: var(--thinking-fg);\n  font: 400 13px/20px Inter, InterVariable, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;\n  -webkit-font-smoothing: antialiased;\n}\n:where(.dark, [data-theme='dark']) .thinking-state,\n.thinking-state:where(.dark, [data-theme='dark']) {\n  --thinking-fg: rgb(255 255 255 / 90%);\n  --thinking-muted: rgb(255 255 255 / 62%);\n  --thinking-line: rgb(255 255 255 / 8%);\n  --thinking-dot: rgb(255 255 255 / 30%);\n  --thinking-blue: #608df4;\n  --thinking-chip: #1c1c1e;\n  --thinking-hover: #29292c;\n  --thinking-tip: #232326;\n  --thinking-shadow: 0 0 0 .5px rgb(255 255 255 / 7%), 0 1px 2px rgb(0 0 0 / 15%);\n}\n/* A light island (data-theme=light, e.g. a light AskWindow) inside a dark page keeps light colours. */\n:where(.dark, [data-theme='dark']) :where([data-theme='light'], .light) .thinking-state,\n.thinking-state:where([data-theme='light'], .light) {\n  --thinking-fg: rgb(0 0 0 / 88%);\n  --thinking-muted: rgb(0 0 0 / 61%);\n  --thinking-line: rgb(0 0 0 / 8%);\n  --thinking-dot: rgb(0 0 0 / 25%);\n  --thinking-blue: #4d80ed;\n  --thinking-chip: #fff;\n  --thinking-hover: #f4f4f5;\n  --thinking-tip: #fff;\n  --thinking-shadow: 0 0 0 .5px rgb(0 0 0 / 6%), 0 1px 1px -1px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 5%);\n}\n.thinking-state *, .thinking-state *::before, .thinking-state *::after { box-sizing: border-box; }\n.thinking-state button { font: inherit; cursor: pointer; }\n.thinking-header { display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 0 8px; border: 0; border-radius: 8px; background: none; color: inherit; text-align: start; }\n.thinking-heading { display: flex; align-items: baseline; gap: 8px; font-weight: 500; }\n.thinking-time { color: var(--thinking-muted); font-variant-numeric: tabular-nums; font-weight: 400; }\n.thinking-mark { width: 16px; height: 16px; display: grid; grid-template: repeat(3, 1fr) / repeat(3, 1fr); gap: 1.5px; padding: 1.5px; flex: none; }\n.thinking-mark i { background: var(--thinking-blue); border-radius: .5px; animation: thinking-twinkle 1.4s ease-in-out infinite; }\n[data-done='true'] .thinking-mark i { animation: none; opacity: .75; }\n.thinking-chevron { display: grid; width: 16px; height: 16px; margin-left: -4px; color: var(--thinking-muted); opacity: 0; transition: opacity .15s, transform .25s; }\n.thinking-header:hover .thinking-chevron, .thinking-header:focus-visible .thinking-chevron { opacity: 1; }\n.thinking-header[aria-expanded='false'] .thinking-chevron { transform: rotate(-90deg); }\n.thinking-body { display: grid; grid-template-rows: 1fr; transition: grid-template-rows .32s cubic-bezier(.22,1,.36,1), opacity .2s; }\n.thinking-body[data-open='false'] { grid-template-rows: 0fr; opacity: 0; }\n.thinking-clip { min-height: 0; }\n.thinking-body[data-open='false'] .thinking-clip { overflow: hidden; }\n.thinking-list { list-style: none; margin: 0; padding: 8px 8px 0; }\n.thinking-item { position: relative; display: grid; grid-template-columns: 16px minmax(0,1fr); column-gap: 10px; padding: 0 0 12px; animation: thinking-enter .52s cubic-bezier(.22,1,.36,1) both; }\n.thinking-item:not(:last-child)::before { content: ''; position: absolute; top: 22px; bottom: 2px; left: 7px; width: 2px; background: var(--thinking-line); transform-origin: top; animation: thinking-line .45s ease-out both; }\n.thinking-item[data-kind='step']::before { background: repeating-linear-gradient(to bottom, var(--thinking-line) 0 5px, transparent 5px 9px); }\n.thinking-node { display: grid; place-items: center; width: 16px; height: 20px; color: var(--thinking-muted); }\n.thinking-node svg { display: block; width: 16px; height: 16px; }\n.thinking-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--thinking-dot); }\n.thinking-item[data-active='true'] .thinking-dot { width: 6px; height: 6px; border-radius: 1px; background: var(--thinking-blue); animation: thinking-pulse 1.3s ease-in-out infinite; }\n.thinking-content { min-width: 0; }\n.thinking-label { color: var(--thinking-muted); overflow-wrap: anywhere; }\n.thinking-shimmer { background: linear-gradient(100deg,var(--thinking-muted) 20%,var(--thinking-fg) 45%,var(--thinking-muted) 70%); background-size: 250% 100%; background-clip: text; -webkit-background-clip: text; color: transparent; animation: thinking-shimmer 2.3s linear infinite; }\n.thinking-sources { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; padding: 1px 0 2px; }\n.thinking-source { position: relative; display: inline-flex; align-items: center; gap: 6px; max-width: 100%; min-height: 26px; padding: 0 8px 0 6px; border: 0; border-radius: 6px; color: var(--thinking-fg); background: var(--thinking-chip); box-shadow: var(--thinking-shadow); font: 400 12px/16px Inter, InterVariable, ui-sans-serif, system-ui, sans-serif; text-decoration: none; animation: thinking-chip .42s cubic-bezier(.22,1,.36,1) var(--chip-delay,0ms) both; transition: background .15s; }\n.thinking-source:hover, .thinking-source:focus-visible { background: var(--thinking-hover); z-index: 2; }\n.thinking-source-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.thinking-source-icon { display: grid; place-items: center; width: 14px; height: 14px; border-radius: 4px; overflow: hidden; flex: none; }\n.thinking-source-icon svg, .thinking-source-icon img { width: 100%; height: 100%; display: block; }\n.thinking-tooltip { position: absolute; bottom: calc(100% + 8px); left: 0; z-index: 5; max-width: min(300px,75vw); width: max-content; padding: 4px 8px; border-radius: 6px; box-shadow: var(--thinking-shadow), 0 4px 16px rgb(0 0 0 / 8%); background: var(--thinking-tip); color: var(--thinking-muted); opacity: 0; visibility: hidden; transform: translateY(3px); transition: .15s; pointer-events: none; overflow-wrap: anywhere; }\n.thinking-source:hover .thinking-tooltip, .thinking-source:focus-visible .thinking-tooltip { opacity: 1; visibility: visible; transform: translateY(0); }\n.thinking-state .thinking-more { background: transparent; box-shadow: inset 0 0 0 .5px var(--thinking-line); color: var(--thinking-muted); font-size: 12px; line-height: 16px; padding: 0 8px; }\n.thinking-state .thinking-more:hover, .thinking-state .thinking-more[aria-expanded='true'] { background: var(--thinking-line); color: var(--thinking-fg); }\n.thinking-extra-sources { display: contents; }\n.thinking-extra-sources[hidden] { display: none; }\n.thinking-finished { color: var(--thinking-fg); }\n.thinking-node .thinking-check { color: var(--thinking-blue); animation: thinking-check-in .46s cubic-bezier(.34,1.56,.64,1) both; }\n.thinking-check path { stroke-dasharray: 10; stroke-dashoffset: 10; animation: thinking-tick .3s .18s ease-out forwards; }\n.thinking-state :focus-visible { outline: 2px solid var(--thinking-blue); outline-offset: 3px; }\n.thinking-state[data-variant='classic'] { font-size: 14px; }\n[data-variant='classic'] .thinking-mark { display: none; }\n[data-variant='classic'] .thinking-chevron { order: -1; margin: 0; opacity: 1; }\n[data-variant='classic'] .thinking-heading { font-weight: 400; color: var(--thinking-muted); }\n[data-variant='classic'] .thinking-item { column-gap: 14px; }\n[data-variant='classic'] .thinking-dot { width: 7px; height: 7px; }\n[data-variant='classic'] .thinking-source { font-size: 13px; min-height: 28px; background: var(--thinking-line); box-shadow: none; }\n[data-variant='classic'] .thinking-more { background: transparent; }\n[data-variant='classic'] .thinking-item[data-kind='step']::before { background: var(--thinking-line); }\n@keyframes thinking-enter { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }\n@keyframes thinking-chip { from { opacity: 0; transform: translateY(4px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }\n@keyframes thinking-twinkle { 0%,100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1); } }\n@keyframes thinking-pulse { 0%,100% { opacity: .45; box-shadow: 0 0 0 0 transparent; } 50% { opacity: 1; box-shadow: 0 0 0 3px color-mix(in srgb,var(--thinking-blue) 12%,transparent); } }\n@keyframes thinking-shimmer { from { background-position: 180% 0; } to { background-position: -80% 0; } }\n@keyframes thinking-line { from { transform: scaleY(0); } to { transform: scaleY(1); } }\n@keyframes thinking-check-in { from { opacity: 0; transform: scale(.5); } to { opacity: 1; transform: scale(1); } }\n@keyframes thinking-tick { to { stroke-dashoffset: 0; } }\n@media (pointer: coarse) { .thinking-header { min-height: 44px; } .thinking-source { min-height: 32px; } }\n@media (prefers-reduced-motion: reduce) {\n  .thinking-state *, .thinking-state *::before { animation: none !important; transition: none !important; }\n  .thinking-shimmer { background: none; color: var(--thinking-muted); }\n  .thinking-check path { stroke-dashoffset: 0; }\n}\n" }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "thinking-header",
            "aria-expanded": expanded,
            "aria-controls": bodyId,
            onClick: () => setExpanded((value) => !value),
            children: [
              /* @__PURE__ */ jsx("span", { className: "thinking-mark", "aria-hidden": "true", children: Array.from({ length: 9 }, (_, i) => /* @__PURE__ */ jsx(
                "i",
                {
                  style: {
                    animationDelay: `${(Math.floor(i / 3) + i % 3) * 120}ms`
                  }
                },
                i
              )) }),
              /* @__PURE__ */ jsx("span", { className: "thinking-heading", children: progress.done ? (typeof workedLabel === "function" ? workedLabel(progress.ms) : workedLabel) ?? labels?.worked?.(progress.seconds) ?? `${progress.seconds} с ажилласан` : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("span", { className: "thinking-shimmer", children: labels?.thinking ?? "Бодож байна" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "thinking-time", children: labels?.time?.(progress.seconds) ?? `${progress.seconds} с` })
              ] }) }),
              /* @__PURE__ */ jsx("span", { className: "thinking-chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsx(Chevron, {}) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            id: bodyId,
            className: "thinking-body",
            "data-open": expanded,
            inert: !expanded,
            "aria-hidden": !expanded,
            children: /* @__PURE__ */ jsx("div", { className: "thinking-clip", children: /* @__PURE__ */ jsxs(
              "ol",
              {
                className: "thinking-list",
                "aria-live": "polite",
                "aria-relevant": "additions text",
                children: [
                  steps2.slice(0, progress.visible).map((step, i) => {
                    const active = !progress.done && i === progress.visible - 1;
                    const label = !active ? step.completedLabel ?? (step.kind === "search" && (step.label === "Searching" || step.label === "Хайж байна") ? "Хайсан" : step.label) : step.label;
                    return /* @__PURE__ */ jsxs(
                      "li",
                      {
                        className: "thinking-item",
                        "data-active": active,
                        "data-kind": step.kind,
                        children: [
                          /* @__PURE__ */ jsx("span", { className: "thinking-node", "aria-hidden": "true", children: step.kind === "search" ? /* @__PURE__ */ jsx(SearchIcon, {}) : /* @__PURE__ */ jsx("span", { className: "thinking-dot" }) }),
                          /* @__PURE__ */ jsxs("div", { className: "thinking-content", children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: `thinking-label${active ? " thinking-shimmer" : ""}`,
                                dir: "auto",
                                children: label
                              }
                            ),
                            /* @__PURE__ */ jsx(Sources, { step })
                          ] })
                        ]
                      },
                      i
                    );
                  }),
                  progress.done && /* @__PURE__ */ jsxs("li", { className: "thinking-item thinking-finished", children: [
                    /* @__PURE__ */ jsx("span", { className: "thinking-node", "aria-hidden": "true", children: doneIcon ?? /* @__PURE__ */ jsx(CheckIcon, {}) }),
                    /* @__PURE__ */ jsx("span", { children: doneLabel })
                  ] })
                ]
              },
              progress.cycle
            ) })
          }
        )
      ]
    }
  );
}
export {
  ThinkingState as T
};
//# sourceMappingURL=thinking-state-8FczN4L4.js.map
