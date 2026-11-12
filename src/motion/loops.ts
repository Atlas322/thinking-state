/**
 * Loop primitives: CSS keyframes built from the springs, transform and
 * opacity only (compositor, no layout or paint per frame).
 *
 * Each ambient loop is one impulse + a physical settle (`move`), then stillness
 * (`rest`), repeated `--ts-motion-loop-count` (3) times, then it rests. The
 * `.ts-loop-NAME` classes use the default rhythm (1.2 s + 4 s); per-icon
 * rhythms come from loopAnimation(name, { move, rest, spring }). Apply:
 *
 *   <svg class="ts-loop ts-loop-swing" style="--ts-loop-origin: 50% 8%">…
 *
 * Playback is driven by the nearest `[data-ts-loop]` region (useInViewLoop):
 *   running   → plays
 *   offscreen → frozen where it is (no work while scrolled away)
 *   paused / reduced → no animation at all: elements sit in their rest pose,
 *              which is also their final state.
 * `[data-ts-motion="off"]` on any ancestor and `prefers-reduced-motion`
 * do the same as paused.
 */
import { SPRINGS, springKeyframes, type SpringName } from "./spring";
import { EASINGS, LOOP, spring } from "./tokens";

export const LOOPS = [
  "bob",
  "swing",
  "breathe",
  "float",
  "spin",
  "pulse",
  "nudge",
  "pop",
  "shake",
] as const;
export type LoopName = (typeof LOOPS)[number];

/** What each loop means physically — used by the catalog and the icon map. */
export const LOOP_NOTES: Record<LoopName, string> = {
  bob: "Дээш хөөрөөд зөөлөн буцаж тогтоно (ирэх, хүлээн авах)",
  swing: "Бага зэрэг хазайгаад тэнцвэрээ олно (тэмдэг, шошго)",
  breathe: "Тэгш амьсгал, 1 → 1.06 (амьд, бодож байна)",
  float: "Аажуу хөөрч буцна (санаа, хүлээгдэж буй)",
  spin: "Нэг эргээд зөөлөн зогсоно (шинэчлэх, тохиргоо)",
  pulse: "Долгион тэлж бүдгэрнэ (шууд, идэвхтэй)",
  nudge: "Урагш түлхэгдээд буцна (дараагийн алхам)",
  pop: "Дарагдаад сэргэнэ (баталгаа, дуусгах)",
  shake: "Хүнд юм зөөлөн доргиод тогтоно (анхааруулга)",
};

/**
 * A loop's rhythm (🎨 motion language §2: «хөдөлгөөн + амрах» per icon).
 * `move` ms of motion, then `rest` ms still; `spring` sets the settle feel.
 * Default 1.2 s + 4 s.
 */
export type Rhythm = { move?: number; rest?: number; spring?: SpringName };

// Keyframes hold literal values only: a var() inside @keyframes (even in a
// per-keyframe timing function) moves the animation off the compositor onto
// the main thread. So spring timings are written twice — linear() inside
// @supports, cubic-bezier fallbacks outside.
type Timing = (name: SpringName) => string;
const LINEAR: Timing = (n) => spring(n).easing;
const FALLBACK: Timing = (n) => spring(n).fallback;

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Each loop is drawn on a "natural" timeline (kick + the spring's own settle
 * time), then fitted into `move`; the rest of the period stays still.
 */
type Shape = { natural: (s: SpringName) => number; spring: SpringName; frames: (t: Timing, at: (ms: number) => number, s: SpringName) => string[] };

const kickSettle = (rest: string, peak: string, kick: number, def: SpringName): Shape => ({
  spring: def,
  natural: (s) => kick + spring(s).duration,
  frames: (t, at, s) => [
    `0% { transform: ${rest}; animation-timing-function: ${EASINGS.enter}; }`,
    `${at(kick)}% { transform: ${peak}; animation-timing-function: ${t(s)}; }`,
    `${at(kick + spring(s).duration)}%, 100% { transform: ${rest}; }`,
  ],
});

const sampled = (value: (v: number) => string, amplitude: number, kick: number, def: SpringName): Shape => ({
  spring: def,
  natural: (s) => kick + spring(s).duration,
  frames: (_t, at, s) => {
    const dur = spring(s).duration;
    return [
      `0% { transform: ${value(0)}; animation-timing-function: ${EASINGS.enter}; }`,
      ...springKeyframes(SPRINGS[s], amplitude, 0, 28).map((f) => `${at(kick + f.offset * dur)}% { transform: ${value(f.value)}; }`),
      `${at(kick + dur)}%, 100% { transform: ${value(0)}; }`,
    ];
  },
});

const harmonic = (rest: string, peak: string): Shape => ({
  spring: "soft",
  natural: () => 2000,
  frames: (_t, at) => [
    `0% { transform: ${rest}; animation-timing-function: ${EASINGS.loop}; }`,
    `${at(1000)}% { transform: ${peak}; animation-timing-function: ${EASINGS.loop}; }`,
    `${at(2000)}%, 100% { transform: ${rest}; }`,
  ],
});

const SHAPES: Record<LoopName, Shape> = {
  bob: kickSettle("translateY(0)", "translateY(-14%)", 180, "settle"),
  swing: sampled((v) => `rotate(${v}deg)`, 14, 200, "settle"),
  breathe: harmonic("scale(1)", "scale(1.06)"),
  float: harmonic("translateY(0)", "translateY(-8%)"),
  spin: {
    spring: "soft",
    natural: (s) => spring(s).duration * 1.6,
    frames: (t, at, s) => [
      `0% { transform: rotate(0deg); animation-timing-function: ${t(s)}; }`,
      `${at(spring(s).duration * 1.6)}%, 100% { transform: rotate(360deg); }`,
    ],
  },
  pulse: {
    spring: "soft",
    natural: () => 1400,
    frames: (_t, at) => [
      `0% { transform: scale(0.7); opacity: 0.55; animation-timing-function: ${EASINGS.enter}; }`,
      `${at(1400)}%, 100% { transform: scale(1.7); opacity: 0; }`,
    ],
  },
  nudge: kickSettle("translateX(0)", "translateX(20%)", 200, "settle"),
  pop: kickSettle("scale(1)", "scale(0.88)", 140, "settle"),
  shake: sampled((v) => `translateX(${v}%)`, 10, 120, "heavy"),
};

export type LoopAnimation = {
  /** The @keyframes name (unique per loop + rhythm). */
  name: string;
  /** Period in ms (move + rest) — use as animation-duration. */
  period: number;
  /** The @keyframes CSS (linear() springs with a cubic-bezier fallback). */
  css: string;
};

const cacheAnim = new Map<string, LoopAnimation>();
/**
 * Keyframes for one loop at one rhythm. The default rhythm is the plain
 * `.ts-loop-NAME` class; any other rhythm gets its own keyframes name —
 * inject `css` once (e.g. <LoopKeyframes/>) and set `animation-name` /
 * `animation-duration` inline.
 */
export function loopAnimation(loop: LoopName, rhythm: Rhythm = {}): LoopAnimation {
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
  const at = (ms: number) => Math.min(100, r1(((ms * scale) / period) * 100));
  const block = (t: Timing) => `@keyframes ${name} {\n  ${shape.frames(t, at, s).join("\n  ")}\n}`;
  const usesSpring = shape.frames(LINEAR, at, s).join() !== shape.frames(FALLBACK, at, s).join();
  const css = usesSpring ? `${block(FALLBACK)}\n@supports (animation-timing-function: linear(0, 1)) {\n${block(LINEAR)}\n}` : block(FALLBACK);
  const out = { name, period, css };
  cacheAnim.set(name, out);
  return out;
}

let css: string | undefined;
/** All default keyframes + playback rules. Injected once by <MotionStyles/>. */
export function motionCss() {
  if (css) return css;
  const keyframes = [
    ...LOOPS.map((n) => loopAnimation(n).css),
    `@keyframes ts-enter {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
}`,
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
