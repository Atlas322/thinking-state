import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { C as CitedAnswer } from "./cited-answer-C590RzNP.js";
import { c as SourceIcon, d as SourcePreview } from "./source-preview-BedfD0w3.js";
import { T as ThinkingState } from "./thinking-state-8FczN4L4.js";
import { L as LOOP, E as EASINGS, s as spring, e as springKeyframes, S as SPRINGS, A as AppShell, m as motionVar } from "./app-shell-CHp_ZidI.js";
import { a as askDemoSources, b as askDemoAnswer, d as askDemoThinking } from "./ask-demo-data-ojpKMDnP.js";
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
const MotionContext = React.createContext({ paused: false, setPaused: () => {
} });
function MotionProvider({
  children,
  paused: controlled,
  onPausedChange,
  defaultPaused = false
}) {
  const [own, setOwn] = React.useState(defaultPaused);
  const paused = controlled ?? own;
  const value = React.useMemo(
    () => ({
      paused,
      setPaused: (p) => {
        if (controlled === void 0) setOwn(p);
        onPausedChange?.(p);
      }
    }),
    [paused, controlled, onPausedChange]
  );
  return React.createElement(MotionContext.Provider, { value }, children);
}
const useMotion = () => React.useContext(MotionContext);
const REDUCED = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof matchMedia !== "function") return () => {
      };
      const mq = matchMedia(REDUCED);
      mq.addEventListener?.("change", cb);
      return () => mq.removeEventListener?.("change", cb);
    },
    () => typeof matchMedia === "function" ? matchMedia(REDUCED).matches : false,
    () => false
  );
}
function usePageVisible() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof document === "undefined") return () => {
      };
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => typeof document === "undefined" ? true : document.visibilityState !== "hidden",
    () => true
  );
}
const observers = /* @__PURE__ */ new Map();
function observe(el, rootMargin, threshold, cb) {
  if (typeof IntersectionObserver === "undefined") {
    cb(true);
    return () => {
    };
  }
  const key = `${rootMargin}|${threshold}`;
  let entry = observers.get(key);
  if (!entry) {
    const watchers = /* @__PURE__ */ new Map();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          const screenful = r.rootBounds ? r.intersectionRect.height >= r.rootBounds.height * 0.5 : false;
          const visible = r.isIntersecting && (r.intersectionRatio >= Math.min(threshold, 0.999) || screenful);
          for (const w of watchers.get(r.target) ?? []) w(visible);
        }
      },
      { rootMargin, threshold: [.../* @__PURE__ */ new Set([0, 0.02, 0.05, 0.1, threshold, 0.25, 0.5])].sort((a, b) => a - b) }
    );
    entry = { io, watchers };
    observers.set(key, entry);
  }
  let set = entry.watchers.get(el);
  if (!set) entry.watchers.set(el, set = /* @__PURE__ */ new Set());
  else entry.io.unobserve(el);
  set.add(cb);
  entry.io.observe(el);
  const e = entry;
  return () => {
    const ws = e.watchers.get(el);
    ws?.delete(cb);
    if (ws && ws.size) return;
    e.io.unobserve(el);
    e.watchers.delete(el);
    if (!e.watchers.size) {
      e.io.disconnect();
      observers.delete(key);
    }
  };
}
function isScripted(a) {
  if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) return false;
  if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) return false;
  return true;
}
function syncAnimation(a, state) {
  if (state === "running") a.play();
  else if (state === "paused" || state === "reduced") {
    const end = a.effect?.getComputedTiming().endTime;
    if (typeof end === "number" && Number.isFinite(end)) a.finish();
    else a.cancel();
  } else a.pause();
}
function regionState(el) {
  return el.closest("[data-ts-loop]")?.getAttribute("data-ts-loop") ?? null;
}
function useInViewLoop(options = {}) {
  const { threshold = 0.15, rootMargin = "0px", defaultPaused = false } = options;
  const [el, setEl] = React.useState(null);
  const [inView, setInView] = React.useState(false);
  const [own, setOwn] = React.useState(defaultPaused ? true : null);
  const [epoch, setEpoch] = React.useState(0);
  const page = useMotion();
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisible();
  const pagePaused = page.paused;
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setOwn(null);
  }, [pagePaused]);
  React.useEffect(() => {
    if (!el) return;
    return observe(el, rootMargin, threshold, setInView);
  }, [el, rootMargin, threshold]);
  const paused = own ?? pagePaused;
  const state = reduced ? "reduced" : paused ? "paused" : !visible ? "hidden" : inView ? "running" : "offscreen";
  React.useEffect(() => {
    const node = el;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true })) if (isScripted(a)) syncAnimation(a, state);
  }, [el, state]);
  const wake = React.useCallback(() => {
    const node = el;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true }))
      if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation && a.playState === "finished") a.currentTime = 0;
  }, [el]);
  const prev = React.useRef(state);
  React.useEffect(() => {
    if (state === "running" && (prev.current === "offscreen" || prev.current === "hidden")) wake();
    prev.current = state;
  }, [state, wake]);
  const replay = React.useCallback(() => {
    if (paused) {
      setOwn(false);
      return;
    }
    const node = el;
    if (node?.getAnimations) {
      for (const a of node.getAnimations({ subtree: true })) {
        if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) continue;
        a.currentTime = 0;
        if (isScripted(a)) a.play();
      }
      return;
    }
    setEpoch((n) => n + 1);
  }, [el, paused]);
  return {
    ref: setEl,
    state,
    playing: state === "running",
    paused,
    setPaused: (p) => setOwn(p),
    togglePaused: () => setOwn(!paused),
    replay,
    wake,
    epoch,
    attrs: { "data-ts-loop": state }
  };
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
const askWindowLabelsMn = {
  title: "Second Brain",
  send: "Асуух",
  placeholder: "Тархинаасаа асуу…",
  chats: "Тархины чатууд",
  newChat: "Шинэ чат",
  brain: "Тархи",
  pagesRead: (n) => `${n} хуудас уншсан`
};
const askNavMn = [
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "today", label: "Өнөөдөр", icon: "today" },
  { id: "projects", label: "Төслүүд", icon: "projects" },
  { id: "areas", label: "Хүрээ", icon: "areas" },
  { id: "resources", label: "Нөөц", icon: "resources" },
  { id: "agents", label: "Агентууд", icon: "agents" }
];
const I = (d, size) => /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { width: size, height: size, strokeWidth: "var(--ts-icon-stroke,1.25)" }, children: d });
const upIcon = I(/* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "m5 12 7-7 7 7" }),
  /* @__PURE__ */ jsx("path", { d: "M12 19V5" })
] }), 16);
const CSS = `
.aw{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;line-height:1.5;font-weight:400;color:var(--ts-fg);max-width:720px}
.aw *{box-sizing:border-box}
.aw .ash-main{padding:0;display:flex;overflow:hidden;background:var(--ts-surface)}.aw .ash-view{flex:1;display:flex;min-width:0;min-height:0}
.aw-new{color:var(--ts-fg)}
/* Compact controls keep a 44px hit area through an invisible halo. */
.aw-item::after,.aw-send::after,.aw .sp-chip::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}
.aw-main{flex:1;min-width:0;display:flex;flex-direction:column}
.aw-thread{flex:1;min-height:0;overflow:auto;padding:18px 28px 8px;display:flex;flex-direction:column;gap:14px}
.aw-q{align-self:flex-end;max-width:82%;padding:7px 12px;border-radius:calc(var(--ts-radius,6px) + 4px);background:color-mix(in srgb,var(--ts-fg) 6%,transparent);font-size:13px}
.aw-chips{position:relative;display:flex;flex-wrap:wrap;gap:6px}
.aw .sp-chip{position:relative;min-height:24px;height:24px;padding:0 8px;font-size:12px;border-color:color-mix(in srgb,var(--ts-line) 80%,transparent);background:transparent}
.aw .sp-chip svg{width:12px;height:12px}
.aw .sp-pop{width:280px;padding:12px}.aw .sp-title{font-size:13px}.aw .sp-quote{margin-top:10px;font-size:13px}.aw .sp-foot{margin-top:10px}
.aw .sp-open{position:relative;min-height:30px;font-size:12px}.aw .sp-open>span{width:30px}
.aw .sp-open::after,.aw .sp-x::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}.aw .sp-x{position:relative}
.aw .ca{max-width:none;border:0;box-shadow:none;background:transparent;font:400 15px/1.6 var(--ts-font,Inter,system-ui,sans-serif)}
.aw .ca-body{padding:0}
.aw .ca-head{font:400 11px var(--ts-font,Inter,sans-serif);color:var(--ts-faint);margin-bottom:6px}
.aw .ca-chips,.aw .ca-foot{display:none}
.aw-compose{margin:8px 20px 16px;display:flex;align-items:flex-end;gap:8px;padding:8px 8px 8px 12px;border:1px solid color-mix(in srgb,var(--ts-line) 90%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);background:var(--ts-page);box-shadow:0 1px 2px rgb(8 12 40/.05)}
.aw-compose:focus-within{border-color:var(--ts-faint)}
.aw-compose input{flex:1;min-width:0;height:26px;border:0;background:none;outline:0;font:inherit;font-size:13px;color:var(--ts-fg)}
.aw-compose input::placeholder{color:var(--ts-faint)}
.aw-send{position:relative;display:grid;place-items:center;flex:none;width:26px;height:26px;border:0;border-radius:var(--ts-radius,6px);background:var(--ts-electric);color:var(--ts-on-electric);cursor:pointer}
.aw-send:focus-visible,.aw-item:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.aw .ts-think,.aw [class*="thinking"]{font-size:13px}
.aw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.aw-in{animation:aw-in ${motionVar.duration("md")} ${motionVar.easing("enter")} both}
.aw-chips .aw-in{animation-delay:calc(var(--i,0) * ${LOOP.stagger}ms)}
@keyframes aw-in{from{opacity:0;transform:translateY(4px)}}
.aw-q.aw-typing::after{content:"";display:inline-block;width:1px;height:1em;margin-left:2px;vertical-align:-2px;background:currentColor;animation:aw-caret var(--ts-motion-dur-xl,900ms) steps(1) infinite}
@keyframes aw-caret{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.aw-in,.aw-q.aw-typing::after{animation:none}}
@container (max-width:560px){.aw-side{display:none}.aw-thread{padding:14px 14px 6px}.aw-compose{margin:6px 10px 10px}.aw .sp{position:static}.aw .sp-pop{left:0;right:0;width:auto;max-width:none}}
`;
function AskWindow({
  question,
  answer,
  sources,
  workspace,
  nav = askNavMn,
  chats = [],
  activeChat,
  theme = "light",
  openSource,
  sidebar = true,
  onAsk,
  onOpenSource,
  onNavigate,
  thinking = [],
  play = "auto",
  phase,
  onPhase,
  labels: labelsIn,
  className = ""
}) {
  const labels = { ...askWindowLabelsMn, ...labelsIn };
  const [text, setText] = React.useState("");
  const [focus, setFocus] = React.useState(openSource ?? null);
  const frames = React.useMemo(() => {
    const out = [];
    const T = thinking.length, C = sources.length, A = answer.length;
    out.push({ state: { phase: "ask", typed: 0.45, steps: 0, chips: 0, segs: 0 }, hold: 260 });
    out.push({ state: { phase: "ask", typed: 1, steps: 0, chips: 0, segs: 0 }, hold: 420 });
    for (let i = 1; i <= T; i++) out.push({ state: { phase: "think", typed: 1, steps: i, chips: 0, segs: 0 }, hold: 650 });
    out.push({ state: { phase: "sources", typed: 1, steps: T, chips: C, segs: 0 }, hold: 300 + C * 140 });
    for (let i = 1; i <= A; i++) out.push({ state: { phase: "answer", typed: 1, steps: T, chips: C, segs: i }, hold: 480 });
    out.push({ state: { phase: "done", typed: 1, steps: T, chips: C, segs: A }, hold: 1e3 });
    return out;
  }, [thinking.length, sources.length, answer.length]);
  const run = useScenario(frames, { loops: 1, rest: 0 });
  const finished = React.useRef(false);
  const finishedFor = React.useRef(frames);
  if (finishedFor.current !== frames) {
    finishedFor.current = frames;
    finished.current = false;
  }
  const last = frames[frames.length - 1].state;
  if (run.state?.phase === "done") finished.current = true;
  const frozen = phase ? [...frames].reverse().find((x) => x.state.phase === phase)?.state : void 0;
  const f = frozen ?? (play === "static" || run.loopState === "paused" || finished.current ? last : run.state ?? last);
  const animate = f !== last || run.playing;
  const onPhaseRef = React.useRef(onPhase);
  onPhaseRef.current = onPhase;
  React.useEffect(() => {
    onPhaseRef.current?.(f.phase);
  }, [f.phase]);
  const shownQuestion = f.typed >= 1 ? question : question.slice(0, Math.ceil(question.length * f.typed));
  const [current, setCurrent] = React.useState(activeChat ?? chats[0]?.id);
  const dark = theme === "dark";
  const cited = sources.map((s) => ({ id: s.id, title: s.title, site: s.label, date: s.date, quote: s.quote, highlight: s.highlight, icon: /* @__PURE__ */ jsx(SourceIcon, { kind: s.kind, size: 12, tile: false, logo: s.logo, brand: s.brand }) }));
  const preview = (s) => ({ id: s.id, title: s.title, kind: s.kind, kindLabel: s.label, date: s.date, quote: s.quote, highlight: s.highlight, logo: s.logo, brand: s.brand });
  const submit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAsk?.(text.trim());
      setText("");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `aw ${dark ? "dark" : ""} ${className}`, "data-ts-theme": dark ? "dark" : "cream", "data-theme": dark ? "dark" : "light", children: [
    /* @__PURE__ */ jsx("style", { children: CSS }),
    /* @__PURE__ */ jsx(
      AppShell,
      {
        company: { name: workspace?.name ?? labels.title, note: workspace?.note ? `${labels.brain} · ${workspace.note}` : labels.brain },
        counts: { inbox: nav.find((n) => n.id === "inbox")?.count },
        active: "ask",
        nav: sidebar,
        height: 400,
        title: labels.title,
        onNavigate: (v) => onNavigate?.(v),
        onAsk: () => onNavigate?.("new"),
        navExtra: /* @__PURE__ */ jsxs(Fragment, { children: [
          chats.length > 0 && /* @__PURE__ */ jsx("p", { className: "ash-h", children: labels.chats }),
          chats.map((c) => /* @__PURE__ */ jsx("button", { type: "button", className: "ash-it", "aria-current": current === c.id ? "page" : void 0, onClick: () => {
            setCurrent(c.id);
            onNavigate?.(`chat:${c.id}`);
          }, children: /* @__PURE__ */ jsx("span", { children: c.title }) }, c.id))
        ] }),
        children: /* @__PURE__ */ jsxs("div", { className: "aw-main", children: [
          /* @__PURE__ */ jsxs("div", { className: "aw-thread", ref: run.ref, ...run.attrs, "data-phase": f.phase, children: [
            /* @__PURE__ */ jsxs("div", { className: `aw-q ${f.typed < 1 ? "aw-typing" : ""}`, children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": f.typed < 1, children: shownQuestion }),
              f.typed < 1 && /* @__PURE__ */ jsx("span", { className: "aw-sr", children: question })
            ] }),
            thinking.length > 0 && f.steps > 0 && /* @__PURE__ */ jsx("div", { className: animate ? "aw-in" : void 0, children: /* @__PURE__ */ jsx(ThinkingState, { steps: thinking.slice(0, f.steps), live: { done: f.phase !== "think", seconds: f.steps }, collapseOnDone: true, workedLabel: (ms) => `Бодсон ${Math.max(1, Math.round(ms / 1e3))} с` }) }),
            f.chips > 0 && /* @__PURE__ */ jsx("div", { className: "aw-chips", children: sources.slice(0, f.chips).map((s, i) => /* @__PURE__ */ jsx("span", { className: animate ? "aw-in" : void 0, style: { ["--i"]: i }, children: /* @__PURE__ */ jsx(
              SourcePreview,
              {
                source: preview(s),
                open: focus === s.id,
                onOpenChange: (o) => setFocus(o ? s.id : null),
                onOpenInApp: onOpenSource ? () => onOpenSource(s) : void 0
              }
            ) }, s.id)) }),
            f.segs > 0 && /* @__PURE__ */ jsx("div", { "aria-live": "polite", "aria-busy": f.phase !== "done", children: /* @__PURE__ */ jsx(CitedAnswer, { theme, segments: answer.slice(0, f.segs), sources: cited, pagesRead: sources.length }) })
          ] }),
          /* @__PURE__ */ jsxs("form", { className: "aw-compose", onSubmit: submit, children: [
            /* @__PURE__ */ jsx("input", { value: text, onChange: (e) => setText(e.target.value), placeholder: labels.placeholder, "aria-label": labels.placeholder }),
            /* @__PURE__ */ jsx("button", { type: "submit", className: "aw-send", "aria-label": labels.send, children: upIcon })
          ] })
        ] })
      }
    )
  ] });
}
const askWindowDemoNote = "ac.me — жишээ өгөгдөл, бодит харилцагч биш";
const askWindowMicroMn = [
  "санах ой хайж байна…",
  "шийдвэр олдлоо · Үнийн бодлого",
  "уулзалтын тэмдэглэл · 10-р сар",
  "Slack · хэлэлцүүлэг холбогдлоо",
  "эх сурвалж нэгтгэж байна…",
  "хариу бэлэн"
];
const askWindowDemo = {
  question: "Өнгөрсөн сард үнийн талаар ямар шийдвэр гаргасан бэ?",
  workspace: { name: "ACME", note: "демо" },
  nav: askNavMn.map((n) => n.id === "inbox" ? { ...n, count: 4 } : n),
  chats: [
    { id: "price", title: "Үнийн бодлого" },
    { id: "stock", title: "Нийлүүлэлтийн хоцролт" },
    { id: "onb", title: "Шинэ ажилтны чиглүүлэг" }
  ],
  activeChat: "price",
  thinking: askDemoThinking,
  answer: askDemoAnswer,
  sources: askDemoSources
};
export {
  AskWindow as A,
  LOOPS as L,
  MotionStyles as M,
  ScenarioRegion as S,
  UNCONTROLLED_MAX_MS as U,
  askNavMn as a,
  askWindowDemo as b,
  askWindowDemoNote as c,
  askWindowLabelsMn as d,
  askWindowMicroMn as e,
  MotionControls as f,
  MotionProvider as g,
  LOOP_NOTES as h,
  LoopRegion as i,
  MotionContext as j,
  motionCss as k,
  loopAnimation as l,
  motionControlLabelsMn as m,
  useInViewLoop as n,
  useLoop as o,
  useMotion as p,
  usePrefersReducedMotion as q,
  regionState as r,
  syncAnimation as s,
  useScenario as u
};
//# sourceMappingURL=ask-window-BRnvqkTT.js.map
