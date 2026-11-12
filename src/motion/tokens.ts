/**
 * Motion tokens — the JS side of the `--ts-motion-*` variables in tokens.css.
 * Components use the CSS variables (with these values as fallbacks), so the
 * tokens stay optional exactly like the colour tokens.
 */
import { SPRINGS, springEasing, type SpringName } from "./spring";

/**
 * Durations in ms (🎨 motion language §1): xs hover, chip, focus · sm toggle,
 * pill, tab · md card enter, sheet, tooltip · lg page, section change · xl hero,
 * diagram links.
 */
export const DURATIONS = {
  xs: 120,
  sm: 200,
  md: 320,
  lg: 560,
  xl: 900,
} as const;

/**
 * Default loop rhythm: `move` ms of motion, then `rest` ms still (icons set
 * their own, 0.9–3 s + 2–6 s); at most `count` cycles, then the rest pose
 * until hover or the region re-enters the viewport. `stagger` between
 * siblings, top layer first.
 */
export const LOOP = { move: 1200, rest: 4000, count: 3, stagger: 100 } as const;

/** Bezier easings. */
export const EASINGS = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  /** Enter: decelerates to rest. */
  enter: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  /** Exit: accelerates away. */
  exit: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  /** Icon loops — an even breath. */
  loop: "cubic-bezier(0.45, 0, 0.55, 1)",
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
  duration: (n: DurationName) => `var(--ts-motion-dur-${n}, ${DURATIONS[n]}ms)`,
  easing: (n: EasingName) => `var(--ts-motion-ease-${n}, ${EASINGS[n]})`,
  spring: (n: SpringName) => `var(--ts-motion-spring-${n}, ${spring(n).fallback})`,
  springDuration: (n: SpringName) => `var(--ts-motion-spring-${n}-duration, ${spring(n).duration}ms)`,
};

/** The tokens.css block, generated — package.test checks tokens.css matches it. */
export function motionTokensCss() {
  const lines: string[] = [];
  for (const [n, v] of Object.entries(DURATIONS)) lines.push(`  --ts-motion-dur-${n}: ${v}ms;`);
  lines.push(`  --ts-motion-loop-move: ${LOOP.move}ms;`, `  --ts-motion-loop-rest: ${LOOP.rest}ms;`, `  --ts-motion-loop-period: ${LOOP.move + LOOP.rest}ms;`, `  --ts-motion-loop-count: ${LOOP.count};`, `  --ts-motion-stagger: ${LOOP.stagger}ms;`);
  for (const [n, v] of Object.entries(EASINGS)) lines.push(`  --ts-motion-ease-${n}: ${v};`);
  for (const n of Object.keys(SPRINGS) as SpringName[]) {
    const e = spring(n);
    lines.push(`  --ts-motion-spring-${n}: ${e.easing};`);
    lines.push(`  --ts-motion-spring-${n}-duration: ${e.duration}ms;`);
  }
  return lines.join("\n");
}
