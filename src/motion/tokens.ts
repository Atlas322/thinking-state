/**
 * Motion tokens — the JS side of the `--ts-motion-*` variables in tokens.css.
 * Components use the CSS variables (with these values as fallbacks), so the
 * tokens stay optional exactly like the colour tokens.
 */
import { SPRINGS, springEasing, type SpringName } from "./spring";

/** Durations in ms. `loop` is one cycle of an ambient loop (motion + rest). */
export const DURATIONS = {
  instant: 90,
  fast: 160,
  base: 240,
  slow: 420,
  loop: 3200,
} as const;

/** Bezier easings for non-physical changes (colour, opacity, fades). */
export const EASINGS = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  enter: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  exit: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  /** Harmonic (sine) in-out — breathing, floating, anything with no impact. */
  sine: "cubic-bezier(0.37, 0, 0.63, 1)",
} as const;

export type DurationName = keyof typeof DURATIONS;
export type EasingName = keyof typeof EASINGS;

const cache = new Map<SpringName, ReturnType<typeof springEasing>>();
/** Spring easing + settle duration for a named spring (memoised). */
export function spring(name: SpringName) {
  let e = cache.get(name);
  if (!e) cache.set(name, (e = springEasing(SPRINGS[name])));
  return e;
}

/** `var(--ts-motion-…, fallback)` helpers for inline styles. */
export const motionVar = {
  duration: (n: DurationName) => `var(--ts-motion-${n}, ${DURATIONS[n]}ms)`,
  easing: (n: EasingName) => `var(--ts-motion-ease-${n}, ${EASINGS[n]})`,
  spring: (n: SpringName) => `var(--ts-motion-spring-${n}, ${spring(n).fallback})`,
  springDuration: (n: SpringName) => `var(--ts-motion-spring-${n}-duration, ${spring(n).duration}ms)`,
};

/** The tokens.css block, generated — package.test checks tokens.css matches it. */
export function motionTokensCss() {
  const lines: string[] = [];
  for (const [n, v] of Object.entries(DURATIONS)) lines.push(`  --ts-motion-${n}: ${v}ms;`);
  for (const [n, v] of Object.entries(EASINGS)) lines.push(`  --ts-motion-ease-${n}: ${v};`);
  for (const n of Object.keys(SPRINGS) as SpringName[]) {
    const e = spring(n);
    lines.push(`  --ts-motion-spring-${n}: ${e.easing};`);
    lines.push(`  --ts-motion-spring-${n}-duration: ${e.duration}ms;`);
  }
  return lines.join("\n");
}
