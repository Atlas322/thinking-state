/**
 * Loop primitives: CSS keyframes built from the springs, transform and
 * opacity only (compositor, no layout or paint per frame).
 *
 * Each ambient loop is one impulse + a physical settle + rest, repeated every
 * `--ts-motion-loop-period` (5 s), `--ts-motion-loop-count` (3) times, then
 * rests. Keyframe offsets are fixed against 5 s, so
 * `--ts-loop-period` scales the whole loop — springs included — and is meant
 * for gentle tempo changes (≈ 0.8–1.5×), not for a different physics. Apply:
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

const pct = (ms: number) => Math.min(100, Math.round((ms / LOOP.period) * 1000) / 10);

// Keyframes hold literal values only: a var() inside @keyframes (even in a
// per-keyframe timing function) moves the animation off the compositor onto
// the main thread. So they are written twice — linear() springs inside
// @supports, cubic-bezier fallbacks outside.
type Timing = (name: SpringName) => string;

/** keyframes where the impulse is drawn by hand and the settle is one spring segment. */
function kickSettle(t: Timing, name: string, rest: string, peak: string, kickMs: number, settle: SpringName) {
  const k = pct(kickMs);
  const s = pct(kickMs + spring(settle).duration);
  return `@keyframes ts-loop-${name} {
  0% { transform: ${rest}; animation-timing-function: ${EASINGS.enter}; }
  ${k}% { transform: ${peak}; animation-timing-function: ${t(settle)}; }
  ${s}%, 100% { transform: ${rest}; }
}`;
}

/** keyframes sampled point by point from a spring (motion that crosses rest). */
function sampled(name: string, value: (v: number) => string, amplitude: number, kickMs: number, settle: SpringName) {
  const k = pct(kickMs);
  const dur = spring(settle).duration;
  const frames = springKeyframes(SPRINGS[settle], amplitude, 0, 28)
    .map((f) => `  ${Math.round((k + (f.offset * dur * 100) / LOOP.period) * 10) / 10}% { transform: ${value(f.value)}; }`)
    .join("\n");
  const end = pct(kickMs + dur);
  return `@keyframes ts-loop-${name} {
  0% { transform: ${value(0)}; animation-timing-function: ${EASINGS.enter}; }
${frames}
  ${end}%, 100% { transform: ${value(0)}; }
}`;
}

/** The keyframes that use a spring timing function (written once per timing set). */
function springKeyframesCss(t: Timing) {
  return [
    kickSettle(t, "bob", "translateY(0)", "translateY(-14%)", 180, "settle"),
    `@keyframes ts-loop-spin {
  0% { transform: rotate(0deg); animation-timing-function: ${t("soft")}; }
  ${pct(spring("soft").duration * 1.6)}%, 100% { transform: rotate(360deg); }
}`,
    kickSettle(t, "nudge", "translateX(0)", "translateX(20%)", 200, "settle"),
    kickSettle(t, "pop", "scale(1)", "scale(0.88)", 140, "settle"),
  ].join("\n");
}

let css: string | undefined;
/** All keyframes + playback rules (≈ 6 KB). Injected once by <MotionStyles/>. */
export function motionCss() {
  if (css) return css;
  const keyframes = [
    springKeyframesCss((n) => spring(n).fallback),
    `@supports (animation-timing-function: linear(0, 1)) {
${springKeyframesCss((n) => spring(n).easing)}
}`,
    sampled("swing", (v) => `rotate(${v}deg)`, 14, 200, "settle"),
    `@keyframes ts-loop-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }`,
    `@keyframes ts-loop-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8%); } }`,
    `@keyframes ts-loop-pulse {
  0% { transform: scale(0.7); opacity: 0.55; animation-timing-function: ${EASINGS.enter}; }
  ${pct(1400)}%, 100% { transform: scale(1.7); opacity: 0; }
}`,
    sampled("shake", (v) => `translateX(${v}%)`, 10, 120, "heavy"),
    `@keyframes ts-enter {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
}`,
  ];
  const loops = LOOPS.map((n) => `.ts-loop-${n} { animation-name: ts-loop-${n}; }`).join("\n");
  css = `${keyframes.join("\n")}
.ts-loop {
  animation-duration: var(--ts-loop-period, var(--ts-motion-loop-period, ${LOOP.period}ms));
  animation-delay: var(--ts-loop-delay, 0ms);
  animation-iteration-count: var(--ts-loop-count, var(--ts-motion-loop-count, ${LOOP.count}));
  animation-timing-function: linear;
  transform-box: fill-box;
  transform-origin: var(--ts-loop-origin, 50% 50%);
}
.ts-loop-breathe, .ts-loop-float { animation-timing-function: ${EASINGS.loop}; }
.ts-loop-pulse { animation-fill-mode: both; }
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
