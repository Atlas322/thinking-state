import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { L as LOOP, E as EASINGS, s as spring, a as springKeyframes, S as SPRINGS } from "./tokens-jmej6VeF.js";
import { u as useInViewLoop } from "./use-in-view-loop-DCjo3riw.js";
const LOOPS = [
  "bob",
  "swing",
  "breathe",
  "float",
  "spin",
  "pulse",
  "nudge",
  "pop",
  "shake"
];
const LOOP_NOTES = {
  bob: "Дээш хөөрөөд зөөлөн буцаж тогтоно (ирэх, хүлээн авах)",
  swing: "Бага зэрэг хазайгаад тэнцвэрээ олно (тэмдэг, шошго)",
  breathe: "Тэгш амьсгал, 1 → 1.06 (амьд, бодож байна)",
  float: "Аажуу хөөрч буцна (санаа, хүлээгдэж буй)",
  spin: "Нэг эргээд зөөлөн зогсоно (шинэчлэх, тохиргоо)",
  pulse: "Долгион тэлж бүдгэрнэ (шууд, идэвхтэй)",
  nudge: "Урагш түлхэгдээд буцна (дараагийн алхам)",
  pop: "Дарагдаад сэргэнэ (баталгаа, дуусгах)",
  shake: "Хүнд юм зөөлөн доргиод тогтоно (анхааруулга)"
};
const LINEAR = (n) => spring(n).easing;
const FALLBACK = (n) => spring(n).fallback;
const r1 = (n) => Math.round(n * 10) / 10;
const kickSettle = (rest, peak, kick, def) => ({
  spring: def,
  natural: (s) => kick + spring(s).duration,
  frames: (t, at, s) => [
    `0% { transform: ${rest}; animation-timing-function: ${EASINGS.enter}; }`,
    `${at(kick)}% { transform: ${peak}; animation-timing-function: ${t(s)}; }`,
    `${at(kick + spring(s).duration)}%, 100% { transform: ${rest}; }`
  ]
});
const sampled = (value, amplitude, kick, def) => ({
  spring: def,
  natural: (s) => kick + spring(s).duration,
  frames: (_t, at, s) => {
    const dur = spring(s).duration;
    return [
      `0% { transform: ${value(0)}; animation-timing-function: ${EASINGS.enter}; }`,
      ...springKeyframes(SPRINGS[s], amplitude, 0, 28).map((f) => `${at(kick + f.offset * dur)}% { transform: ${value(f.value)}; }`),
      `${at(kick + dur)}%, 100% { transform: ${value(0)}; }`
    ];
  }
});
const harmonic = (rest, peak) => ({
  spring: "soft",
  natural: () => 2e3,
  frames: (_t, at) => [
    `0% { transform: ${rest}; animation-timing-function: ${EASINGS.loop}; }`,
    `${at(1e3)}% { transform: ${peak}; animation-timing-function: ${EASINGS.loop}; }`,
    `${at(2e3)}%, 100% { transform: ${rest}; }`
  ]
});
const SHAPES = {
  bob: kickSettle("translateY(0)", "translateY(-14%)", 180, "settle"),
  swing: sampled((v) => `rotate(${v}deg)`, 14, 200, "settle"),
  breathe: harmonic("scale(1)", "scale(1.06)"),
  float: harmonic("translateY(0)", "translateY(-8%)"),
  spin: {
    spring: "soft",
    natural: (s) => spring(s).duration * 1.6,
    frames: (t, at, s) => [
      `0% { transform: rotate(0deg); animation-timing-function: ${t(s)}; }`,
      `${at(spring(s).duration * 1.6)}%, 100% { transform: rotate(360deg); }`
    ]
  },
  pulse: {
    spring: "soft",
    natural: () => 1400,
    frames: (_t, at) => [
      `0% { transform: scale(0.7); opacity: 0.55; animation-timing-function: ${EASINGS.enter}; }`,
      `${at(1400)}%, 100% { transform: scale(1.7); opacity: 0; }`
    ]
  },
  nudge: kickSettle("translateX(0)", "translateX(20%)", 200, "settle"),
  pop: kickSettle("scale(1)", "scale(0.88)", 140, "settle"),
  shake: sampled((v) => `translateX(${v}%)`, 10, 120, "heavy")
};
const cacheAnim = /* @__PURE__ */ new Map();
function loopAnimation(loop, rhythm = {}) {
  const move = rhythm.move ?? LOOP.move;
  const rest = rhythm.rest ?? LOOP.rest;
  const shape = SHAPES[loop];
  const s = rhythm.spring ?? shape.spring;
  const isDefault = move === LOOP.move && rest === LOOP.rest && s === shape.spring;
  const name = isDefault ? `ts-loop-${loop}` : `ts-loop-${loop}-${move}-${rest}-${s}`;
  const hit = cacheAnim.get(name);
  if (hit) return hit;
  const period = move + rest;
  const scale = move / shape.natural(s);
  const at = (ms) => Math.min(100, r1(ms * scale / period * 100));
  const block = (t) => `@keyframes ${name} {
  ${shape.frames(t, at, s).join("\n  ")}
}`;
  const usesSpring = shape.frames(LINEAR, at, s).join() !== shape.frames(FALLBACK, at, s).join();
  const css2 = usesSpring ? `${block(FALLBACK)}
@supports (animation-timing-function: linear(0, 1)) {
${block(LINEAR)}
}` : block(FALLBACK);
  const out = { name, period, css: css2 };
  cacheAnim.set(name, out);
  return out;
}
let css;
function motionCss() {
  if (css) return css;
  const keyframes = [
    ...LOOPS.map((n) => loopAnimation(n).css),
    `@keyframes ts-enter {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
}`
  ];
  const loops = LOOPS.map((n) => `.ts-loop-${n} { animation-name: ts-loop-${n}; }`).join("\n");
  css = `${keyframes.join("\n")}
.ts-loop {
  animation-duration: var(--ts-loop-period, var(--ts-motion-loop-period, ${LOOP.move + LOOP.rest}ms));
  animation-delay: var(--ts-loop-delay, 0ms);
  animation-iteration-count: var(--ts-loop-count, var(--ts-motion-loop-count, ${LOOP.count}));
  animation-timing-function: linear;
  transform-box: fill-box;
  transform-origin: var(--ts-loop-origin, 50% 50%);
}
.ts-loop-pulse { animation-fill-mode: both; }
.ts-once { animation-iteration-count: 1; }
${loops}
.ts-enter {
  animation: ts-enter var(--ts-motion-spring-soft-duration, ${spring("soft").duration}ms) var(--ts-motion-spring-soft, ${spring("soft").fallback}) both;
  animation-delay: var(--ts-enter-delay, 0ms);
}
[data-ts-loop="offscreen"] :is(.ts-loop, .ts-enter),
[data-ts-loop="hidden"] :is(.ts-loop, .ts-enter) { animation-play-state: paused; }
[data-ts-loop="paused"] :is(.ts-loop, .ts-enter),
[data-ts-loop="reduced"] :is(.ts-loop, .ts-enter),
[data-ts-motion="off"] :is(.ts-loop, .ts-enter) { animation: none; }
@media (prefers-reduced-motion: reduce) {
  .ts-loop, .ts-enter { animation: none !important; }
}`;
  return css;
}
let styles;
function MotionStyles() {
  if (!styles) {
    const css2 = motionCss() + REPLAY_CSS;
    let h = 0;
    for (let i = 0; i < css2.length; i++) h = Math.imul(h, 31) + css2.charCodeAt(i) | 0;
    styles = { css: css2, href: `ts-motion-${(h >>> 0).toString(36)}` };
  }
  return /* @__PURE__ */ jsx("style", { href: styles.href, precedence: "default", children: styles.css });
}
function useLoop(loop, rhythm = {}, style) {
  const a = loopAnimation(loop, rhythm);
  return {
    keyframes: /* @__PURE__ */ jsx("style", { href: a.name, precedence: "default", children: a.css }),
    props: {
      className: `ts-loop ts-loop-${loop}`,
      style: { animationName: a.name, animationDuration: `${a.period}ms`, ...style }
    }
  };
}
const motionControlLabelsMn = {
  replay: "Дахин тоглуулах",
  pause: "Хөдөлгөөнийг зогсоох",
  play: "Хөдөлгөөнийг үргэлжлүүлэх"
};
const glyph = (d) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: d.map((p) => /* @__PURE__ */ jsx("path", { d: p }, p)) });
const ROTATE = ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"];
const PAUSE = ["M14 4h4v16h-4z", "M6 4h4v16H6z"];
const PLAY = ["M6 3l14 9-14 9z"];
function MotionControls({ onReplay, paused, onTogglePause, showPause = true, labels, className = "" }) {
  const l = { ...motionControlLabelsMn, ...labels };
  return /* @__PURE__ */ jsxs("div", { className: `ts-motion-ctl ${className}`, role: "group", "aria-label": l.replay, children: [
    /* @__PURE__ */ jsx("button", { type: "button", className: "ts-motion-ctl-btn", onClick: onReplay, "aria-label": l.replay, title: l.replay, children: glyph(ROTATE) }),
    showPause && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "ts-motion-ctl-btn",
        onClick: onTogglePause,
        "aria-label": paused ? l.play : l.pause,
        "aria-pressed": paused,
        title: paused ? l.play : l.pause,
        children: glyph(paused ? PLAY : PAUSE)
      }
    )
  ] });
}
function LoopRegion({
  children,
  controls = "none",
  labels,
  className = "",
  style,
  as: Tag = "div",
  onStateChange,
  ...options
}) {
  const loop = useInViewLoop(options);
  React.useEffect(() => onStateChange?.(loop.state), [loop.state, onStateChange]);
  return /* @__PURE__ */ jsxs(
    Tag,
    {
      ref: loop.ref,
      className: `ts-loop-region ${className}`,
      style: controls === "none" ? { "--ts-motion-loop-count": 1, ...style } : style,
      ...loop.attrs,
      "data-controls": controls,
      onPointerEnter: loop.wake,
      children: [
        /* @__PURE__ */ jsx(MotionStyles, {}),
        /* @__PURE__ */ jsx(React.Fragment, { children }, loop.epoch),
        controls !== "none" && loop.state !== "reduced" && /* @__PURE__ */ jsx(MotionControls, { onReplay: loop.replay, paused: loop.paused, onTogglePause: loop.togglePaused, labels })
      ]
    }
  );
}
const REPLAY_CSS = `
.ts-loop-region { position: relative; --ts-ctl-bg: var(--ts-surface, #f7f5ee); --ts-ctl-line: var(--ts-line, #d8d3c6); --ts-ctl-fg: var(--ts-muted, #5e5a52); --ts-ctl-hover: var(--ts-soft, #efebe1); --ts-ctl-strong: var(--ts-fg, #080808); }
:where(.dark, [data-theme=dark]) .ts-loop-region { --ts-ctl-bg: var(--ts-surface, #141416); --ts-ctl-line: var(--ts-line, #2b2b30); --ts-ctl-fg: var(--ts-muted, #a1a1aa); --ts-ctl-hover: var(--ts-soft, #1e1e21); --ts-ctl-strong: var(--ts-fg, #ececef); }
.ts-motion-ctl {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  display: inline-flex; gap: 2px; padding: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ts-ctl-bg) 88%, transparent);
  border: 1px solid var(--ts-ctl-line);
  color: var(--ts-ctl-fg);
  backdrop-filter: blur(6px);
  transition: opacity var(--ts-motion-dur-xs, 120ms) var(--ts-motion-ease-standard, ease);
}
.ts-motion-ctl-btn {
  all: unset; box-sizing: border-box; cursor: pointer;
  display: grid; place-items: center; width: 24px; height: 24px; border-radius: 999px;
}
.ts-motion-ctl-btn:hover { background: var(--ts-ctl-hover); color: var(--ts-ctl-strong); }
.ts-motion-ctl-btn:focus-visible { outline: 2px solid var(--ts-link, #1b5cff); outline-offset: 1px; }
.ts-motion-ctl-btn:active svg { transform: scale(0.88); }
.ts-motion-ctl-btn svg { transition: transform var(--ts-motion-dur-sm, 200ms) var(--ts-motion-ease-standard, ease-out); }
.ts-loop-region[data-controls="hover"] > .ts-motion-ctl { opacity: 0; }
.ts-loop-region[data-controls="hover"]:is(:hover, :focus-within) > .ts-motion-ctl,
.ts-loop-region[data-controls="hover"][data-ts-loop="paused"] > .ts-motion-ctl { opacity: 1; }
/* Inside a <Replay> wrapper (catalog, inai.sh) its ↺ owns the corner: sit beside it. */
.ts-replay-body .ts-loop-region > .ts-motion-ctl { right: 46px; }
.ts-scenario-steps { position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%); display: inline-flex; gap: 4px; pointer-events: none; }
.ts-scenario-steps i { width: 6px; height: 6px; border-radius: 3px; background: var(--ts-ctl-line); transition: width var(--ts-motion-dur-sm, 200ms) var(--ts-motion-ease-standard, ease), background var(--ts-motion-dur-sm, 200ms); }
.ts-scenario-steps i[data-on] { width: 16px; background: var(--ts-selected, #0c8ce9); }
@media (hover: none) { .ts-loop-region[data-controls="hover"] > .ts-motion-ctl { opacity: 1; } }
`;
const UNCONTROLLED_MAX_MS = 5e3;
function useScenario(steps, options = {}) {
  const { rest = LOOP.rest, loops = LOOP.count, maxMs, ...view } = options;
  const loop = useInViewLoop(view);
  const last = Math.max(0, steps.length - 1);
  const [index, setIndex] = React.useState(0);
  const [cycle, setCycle] = React.useState(0);
  const stepsRef = React.useRef(steps);
  stepsRef.current = steps;
  const reduced = loop.state === "reduced";
  const running = loop.state === "running";
  const prev = React.useRef(loop.state);
  React.useEffect(() => {
    if (running && (prev.current === "offscreen" || prev.current === "hidden") && cycle >= loops) {
      setIndex(0);
      setCycle(0);
    }
    prev.current = loop.state;
  }, [loop.state, running, cycle, loops]);
  React.useEffect(() => {
    if (!running || last < 1 || cycle >= loops) return;
    const atEnd = index >= last;
    const wait = (stepsRef.current[index]?.hold ?? 1e3) + (atEnd ? rest : 0);
    const t = setTimeout(() => {
      if (!atEnd) setIndex(index + 1);
      else if (cycle + 1 < loops) {
        setIndex(0);
        setCycle(cycle + 1);
      } else setCycle(loops);
    }, wait);
    return () => clearTimeout(t);
  }, [running, index, cycle, loops, last, rest]);
  const playedRef = React.useRef(0);
  React.useEffect(() => {
    if (!running || maxMs == null || cycle >= loops) return;
    const started = Date.now();
    const t = setTimeout(() => {
      setIndex(last);
      setCycle(loops);
    }, Math.max(0, maxMs - playedRef.current));
    return () => {
      clearTimeout(t);
      playedRef.current += Date.now() - started;
    };
  }, [running, maxMs, cycle, loops, last]);
  const shown = reduced ? last : Math.min(index, last);
  const replay = React.useCallback(() => {
    setIndex(0);
    setCycle(0);
    playedRef.current = 0;
    loop.replay();
  }, [loop]);
  return {
    state: steps[shown]?.state,
    index: shown,
    total: steps.length,
    cycle,
    loopState: loop.state,
    playing: running && cycle < loops,
    paused: loop.paused,
    togglePaused: loop.togglePaused,
    replay,
    ref: loop.ref,
    attrs: { "data-ts-loop": loop.state, "data-ts-step": shown }
  };
}
function ScenarioRegion({
  steps,
  children,
  controls = "none",
  labels,
  className = "",
  style,
  as: Tag = "div",
  showSteps = false,
  ...options
}) {
  const free = controls === "none";
  const sc = useScenario(steps, {
    ...options,
    loops: options.loops ?? (free ? 1 : void 0),
    maxMs: options.maxMs ?? (free ? UNCONTROLLED_MAX_MS : void 0)
  });
  return /* @__PURE__ */ jsxs(Tag, { ref: sc.ref, className: `ts-loop-region ts-scenario ${className}`, style, ...sc.attrs, "data-controls": controls, children: [
    /* @__PURE__ */ jsx(MotionStyles, {}),
    children(sc.state, sc),
    controls !== "none" && sc.loopState !== "reduced" && /* @__PURE__ */ jsx(MotionControls, { onReplay: sc.replay, paused: sc.paused, onTogglePause: sc.togglePaused, labels }),
    showSteps && /* @__PURE__ */ jsx("span", { className: "ts-scenario-steps", "aria-hidden": "true", children: steps.map((_, i) => /* @__PURE__ */ jsx("i", { "data-on": i === sc.index || void 0 }, i)) })
  ] });
}
export {
  LOOPS as L,
  MotionStyles as M,
  ScenarioRegion as S,
  UNCONTROLLED_MAX_MS as U,
  MotionControls as a,
  LOOP_NOTES as b,
  LoopRegion as c,
  motionCss as d,
  useLoop as e,
  loopAnimation as l,
  motionControlLabelsMn as m,
  useScenario as u
};
//# sourceMappingURL=scenario-Dyt1dhWq.js.map
