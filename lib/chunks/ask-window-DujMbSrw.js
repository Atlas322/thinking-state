import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { C as CitedAnswer } from "./cited-answer-C590RzNP.js";
import { c as SourceIcon, d as SourcePreview } from "./source-preview-BedfD0w3.js";
import { T as ThinkingState } from "./thinking-state-8FczN4L4.js";
function dampingRatio({ stiffness, damping, mass = 1 }) {
  return damping / (2 * Math.sqrt(stiffness * mass));
}
function springAt(spring2, t) {
  const { stiffness: k, damping: c, mass: m = 1, velocity = 0 } = spring2;
  const w0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(k * m));
  const x0 = -1;
  const v0 = velocity;
  let d;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    d = Math.exp(-zeta * w0 * t) * (x0 * Math.cos(wd * t) + (v0 + zeta * w0 * x0) / wd * Math.sin(wd * t));
  } else if (zeta === 1) {
    d = Math.exp(-w0 * t) * (x0 + (v0 + w0 * x0) * t);
  } else {
    const s = w0 * Math.sqrt(zeta * zeta - 1);
    const r12 = -zeta * w0 + s;
    const r2 = -zeta * w0 - s;
    const b = (v0 - r12 * x0) / (r2 - r12);
    const a = x0 - b;
    d = a * Math.exp(r12 * t) + b * Math.exp(r2 * t);
  }
  return 1 + d;
}
function springDuration(spring2, rest = 1e-3) {
  const step = 1 / 1e3;
  let settledSince = -1;
  for (let i = 0; i <= 1e4; i++) {
    const t = i * step;
    if (Math.abs(springAt(spring2, t) - 1) < rest) {
      if (settledSince < 0) settledSince = i;
      if (i - settledSince >= 50) return Math.max(1, settledSince);
    } else settledSince = -1;
  }
  return 1e4;
}
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [t, x] = points[i];
    const expected = a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0] || 1);
    const err = Math.abs(x - expected);
    if (err > worst) {
      worst = err;
      index = i;
    }
  }
  if (worst <= tolerance) return [a, b];
  const left = simplify(points.slice(0, index + 1), tolerance);
  const right = simplify(points.slice(index), tolerance);
  return [...left.slice(0, -1), ...right];
}
const round = (n, digits) => {
  const p = 10 ** digits;
  const r = Math.round(n * p) / p;
  return Object.is(r, -0) ? 0 : r;
};
function springEasing(spring2, tolerance = 4e-3) {
  const duration = springDuration(spring2);
  const samples = 200;
  const points = [];
  let peak = 1;
  for (let i = 0; i <= samples; i++) {
    const p = i / samples;
    const x = i === samples ? 1 : springAt(spring2, p * duration / 1e3);
    peak = Math.max(peak, x);
    points.push([p, x]);
  }
  const kept = simplify(points, tolerance);
  const stops = kept.map(
    ([p, x], i) => i === 0 || i === kept.length - 1 ? `${round(x, 3)}` : `${round(x, 3)} ${round(p * 100, 1)}%`
  );
  const zeta = dampingRatio(spring2);
  const fallback = zeta >= 0.95 ? "cubic-bezier(0.22, 1, 0.36, 1)" : zeta > 0.6 ? "cubic-bezier(0.25, 1.2, 0.5, 1)" : "cubic-bezier(0.34, 1.56, 0.64, 1)";
  return { easing: `linear(${stops.join(", ")})`, duration, fallback, overshoot: round(peak - 1, 3) };
}
function springKeyframes(spring2, from, to, frames = 24) {
  const duration = springDuration(spring2);
  return Array.from({ length: frames + 1 }, (_, i) => {
    const offset = i / frames;
    const x = i === frames ? 1 : springAt(spring2, offset * duration / 1e3);
    return { offset, value: round(from + (to - from) * x, 4) };
  });
}
const SPRINGS = {
  soft: { stiffness: 170, damping: 26, mass: 1 },
  settle: { stiffness: 120, damping: 18, mass: 1 },
  heavy: { stiffness: 90, damping: 20, mass: 1.6 }
};
const DURATIONS = {
  xs: 120,
  sm: 200,
  md: 320,
  lg: 560,
  xl: 900
};
const LOOP = { move: 1200, rest: 4e3, count: 3, stagger: 100 };
const EASINGS = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  /** Enter: decelerates to rest. */
  enter: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  /** Exit: accelerates away. */
  exit: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  /** Icon loops — an even breath. */
  loop: "cubic-bezier(0.45, 0, 0.55, 1)"
};
const cache = /* @__PURE__ */ new Map();
function spring(name) {
  let e = cache.get(name);
  if (!e) cache.set(name, e = springEasing(SPRINGS[name]));
  return e;
}
const motionVar = {
  duration: (n) => `var(--ts-motion-dur-${n}, ${DURATIONS[n]}ms)`,
  easing: (n) => `var(--ts-motion-ease-${n}, ${EASINGS[n]})`,
  spring: (n) => `var(--ts-motion-spring-${n}, ${spring(n).fallback})`,
  springDuration: (n) => `var(--ts-motion-spring-${n}-duration, ${spring(n).duration}ms)`
};
function motionTokensCss() {
  const lines = [];
  for (const [n, v] of Object.entries(DURATIONS)) lines.push(`  --ts-motion-dur-${n}: ${v}ms;`);
  lines.push(`  --ts-motion-loop-move: ${LOOP.move}ms;`, `  --ts-motion-loop-rest: ${LOOP.rest}ms;`, `  --ts-motion-loop-period: ${LOOP.move + LOOP.rest}ms;`, `  --ts-motion-loop-count: ${LOOP.count};`, `  --ts-motion-stagger: ${LOOP.stagger}ms;`);
  for (const [n, v] of Object.entries(EASINGS)) lines.push(`  --ts-motion-ease-${n}: ${v};`);
  for (const n of Object.keys(SPRINGS)) {
    const e = spring(n);
    lines.push(`  --ts-motion-spring-${n}: ${e.easing};`);
    lines.push(`  --ts-motion-spring-${n}-duration: ${e.duration}ms;`);
  }
  return lines.join("\n");
}
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
const I = (d, size) => /* @__PURE__ */ jsx("svg", { width: size ?? 14, height: size ?? 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { width: size ?? "var(--ts-icon-size,14px)", height: size ?? "var(--ts-icon-size,14px)", strokeWidth: "var(--ts-icon-stroke,1.25)" }, children: d });
const NAV_ICON = {
  inbox: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M22 12h-6l-2 3h-4l-2-3H2" }),
    /* @__PURE__ */ jsx("path", { d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" })
  ] })),
  today: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" })
  ] })),
  projects: I(/* @__PURE__ */ jsx("path", { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" })),
  areas: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "1" })
  ] })),
  resources: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M12 7v14" }),
    /* @__PURE__ */ jsx("path", { d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" })
  ] })),
  agents: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M12 8V4H8" }),
    /* @__PURE__ */ jsx("rect", { x: "4", y: "8", width: "16", height: "12", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M2 14h2M20 14h2M15 13v2M9 13v2" })
  ] }))
};
const chatIcon = I(/* @__PURE__ */ jsx("path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }), 14);
const newIcon = I(/* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
  /* @__PURE__ */ jsx("path", { d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" })
] }), 14);
const upIcon = I(/* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "m5 12 7-7 7 7" }),
  /* @__PURE__ */ jsx("path", { d: "M12 19V5" })
] }), 16);
const CSS = `
.aw{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;line-height:1.5;font-weight:400;background:var(--ts-surface);color:var(--ts-fg);border:1px solid color-mix(in srgb,var(--ts-line) 80%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);box-shadow:0 1px 2px rgb(8 12 40/.06),0 24px 56px -24px rgb(8 12 40/.45);overflow:hidden;container-type:inline-size;max-width:720px}
.aw *{box-sizing:border-box}
.aw-bar{display:flex;align-items:center;gap:10px;height:28px;padding:0 10px;border-bottom:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);background:var(--ts-soft)}
.aw-dots{display:flex;gap:5px}.aw-dots i{width:8px;height:8px;border-radius:50%;background:color-mix(in srgb,var(--ts-faint) 35%,transparent)}
.aw-title{flex:1;text-align:center;font-weight:500;font-size:12px;color:var(--ts-faint);margin-right:34px}
.aw-split{display:flex;height:400px}
.aw-side{width:164px;flex:none;border-right:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);background:var(--ts-soft);padding:var(--ts-space-2,8px);display:flex;flex-direction:column;gap:1px;overflow:hidden}
.aw-ws{display:flex;align-items:center;gap:var(--ts-space-2,8px);padding:2px 0 var(--ts-space-2,8px)}
.aw-ws b{width:22px;height:22px;border-radius:var(--ts-radius,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:11px;font-weight:600;flex:none}
.aw-ws span{display:flex;flex-direction:column;line-height:1.25;min-width:0}
.aw-ws strong{font-weight:500;font-size:13px}
.aw-ws small{font-size:11px;color:var(--ts-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aw-item{position:relative;display:flex;align-items:center;gap:6px;height:26px;padding:0 6px;border:0;border-radius:var(--ts-radius,6px);background:none;font:inherit;font-size:13px;color:var(--ts-muted);text-align:left;cursor:pointer;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aw-item svg{flex:none;color:var(--ts-faint)}
.aw-item:hover{background:color-mix(in srgb,var(--ts-fg) 6%,transparent);color:var(--ts-fg)}
.aw-item[aria-current="true"]{background:color-mix(in srgb,var(--ts-fg) 8%,transparent);color:var(--ts-fg);font-weight:500}
.aw-item[aria-current="true"] svg{color:var(--ts-electric-fg)}
.aw-item small{margin-left:auto;font-size:11px;color:var(--ts-faint)}
.aw-item>span{overflow:hidden;text-overflow:ellipsis}
.aw-side h6{font-weight:500;font-size:11px;color:var(--ts-faint);margin:var(--ts-space-3,12px) 6px 2px}
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
.aw-q.aw-typing::after{content:"";display:inline-block;width:1px;height:1em;margin-left:2px;vertical-align:-2px;background:currentColor;animation:aw-caret 1s steps(1) infinite}
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
    /* @__PURE__ */ jsxs("div", { className: "aw-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "aw-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {})
      ] }),
      /* @__PURE__ */ jsx("span", { className: "aw-title", children: labels.title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "aw-split", children: [
      sidebar && /* @__PURE__ */ jsxs("nav", { className: "aw-side", "aria-label": labels.title, children: [
        workspace && /* @__PURE__ */ jsxs("div", { className: "aw-ws", children: [
          /* @__PURE__ */ jsx("b", { "aria-hidden": "true", children: workspace.name.slice(0, 1) }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: workspace.name }),
            /* @__PURE__ */ jsx("small", { children: workspace.note ? `${labels.brain} · ${workspace.note}` : labels.brain })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "aw-item aw-new", onClick: () => onNavigate?.("new"), children: [
          newIcon,
          /* @__PURE__ */ jsx("span", { children: labels.newChat })
        ] }),
        nav.map((n) => /* @__PURE__ */ jsxs("button", { type: "button", className: "aw-item", onClick: () => onNavigate?.(n.id), children: [
          NAV_ICON[n.icon],
          /* @__PURE__ */ jsx("span", { children: n.label }),
          n.count != null && /* @__PURE__ */ jsx("small", { children: n.count })
        ] }, n.id)),
        chats.length > 0 && /* @__PURE__ */ jsx("h6", { children: labels.chats }),
        chats.map((c) => /* @__PURE__ */ jsxs("button", { type: "button", className: "aw-item", "aria-current": current === c.id, onClick: () => {
          setCurrent(c.id);
          onNavigate?.(`chat:${c.id}`);
        }, children: [
          chatIcon,
          /* @__PURE__ */ jsx("span", { children: c.title })
        ] }, c.id))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "aw-main", children: [
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
    ] })
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
  thinking: [
    { kind: "search", label: "санах ой хайж байна…", completedLabel: "3 эх сурвалж", sources: [{ label: "Шийдвэр" }, { label: "Уулзалт" }, { label: "Slack" }] },
    { kind: "step", label: "эх сурвалж нэгтгэж байна…", completedLabel: "хариу бэлэн" }
  ],
  answer: [
    { text: "Үнийн шинэчлэлийг 10-р сарын багийн уулзалтаар шийдсэн.", cite: ["m"] },
    { text: " Шалтгааныг Slack дээрх хэлэлцүүлэгт,", cite: ["s"] },
    { text: " эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичсэн.", cite: ["d"] }
  ],
  sources: [
    { id: "d", kind: "decision", brand: "notion", title: "Үнийн бодлого", label: "Шийдвэр", date: "2026.10", quote: "Үнийг шинэчлэхээр шийдэв. Шалтгаан: зардал өссөн, өрсөлдөгчдийн үнэ өөрчлөгдсөн. Хэрэгжүүлэх: дараагийн улирлаас. Эзэн: борлуулалтын баг.", highlight: "Үнийг шинэчлэхээр шийдэв." },
    { id: "m", kind: "meeting", brand: "google-calendar", title: "Багийн уулзалт · 10-р сар", label: "Уулзалтын тэмдэглэл", date: "2026.10", quote: "Үнийн хоёр хувилбарыг харьцуулав. Харилцагчдад урьдчилан мэдэгдэхээр тохирлоо. Эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичнэ.", highlight: "урьдчилан мэдэгдэхээр" },
    { id: "s", kind: "message", brand: "slack", title: "#sales · үнийн хэлэлцүүлэг", label: "Slack thread", date: "2026.10", quote: "Зардал өссөнийг санхүүгийн баг мэдэгдэв. Борлуулалтын баг харилцагчийн хариуг хуваалцав. Уулзалтаар шийдэхээр тохирлоо.", highlight: "Зардал өссөнийг" }
  ]
};
export {
  AskWindow as A,
  useInViewLoop as B,
  useLoop as C,
  DURATIONS as D,
  EASINGS as E,
  useMotion as F,
  usePrefersReducedMotion as G,
  LOOP as L,
  MotionStyles as M,
  SPRINGS as S,
  UNCONTROLLED_MAX_MS as U,
  askNavMn as a,
  askWindowDemo as b,
  askWindowDemoNote as c,
  askWindowLabelsMn as d,
  askWindowMicroMn as e,
  syncAnimation as f,
  MotionControls as g,
  MotionProvider as h,
  LOOPS as i,
  LOOP_NOTES as j,
  LoopRegion as k,
  MotionContext as l,
  ScenarioRegion as m,
  dampingRatio as n,
  loopAnimation as o,
  motionControlLabelsMn as p,
  motionCss as q,
  regionState as r,
  spring as s,
  motionTokensCss as t,
  useScenario as u,
  motionVar as v,
  springAt as w,
  springDuration as x,
  springEasing as y,
  springKeyframes as z
};
//# sourceMappingURL=ask-window-DujMbSrw.js.map
