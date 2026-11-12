/**
 * Spring physics for Thinking State motion — no dependencies.
 *
 * A spring is a damped harmonic oscillator (mass m, stiffness k, damping c)
 * pulled from 0 to 1. We solve it analytically, then hand the curve to the
 * browser as a CSS `linear()` easing, so every animation runs on the
 * compositor (transform / opacity) through plain CSS or WAAPI. No JS runs per
 * frame, which is what keeps dozens of loops at 60 fps on a phone.
 *
 * Browsers without `linear()` (Chrome < 113, Safari < 17.2, Firefox < 112)
 * get `fallback`, a cubic-bezier with the same character.
 */

export type Spring = {
  /** k — how hard the spring pulls (N/m). */
  stiffness: number;
  /** c — how fast the motion dies down (N·s/m). */
  damping: number;
  /** m — inertia (kg). Default 1. */
  mass?: number;
  /** Initial velocity in "distances per second" (a flick). Default 0. */
  velocity?: number;
};

/** Damping ratio ζ: < 1 overshoots and wobbles, 1 is critical, > 1 creeps. */
export function dampingRatio({ stiffness, damping, mass = 1 }: Spring) {
  return damping / (2 * Math.sqrt(stiffness * mass));
}

/** Position x(t) of the spring at t seconds, going from 0 to 1. */
export function springAt(spring: Spring, t: number): number {
  const { stiffness: k, damping: c, mass: m = 1, velocity = 0 } = spring;
  const w0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(k * m));
  // Displacement from rest is x0 = -1; v0 is the initial velocity.
  const x0 = -1;
  const v0 = velocity;
  let d: number;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    d = Math.exp(-zeta * w0 * t) * (x0 * Math.cos(wd * t) + ((v0 + zeta * w0 * x0) / wd) * Math.sin(wd * t));
  } else if (zeta === 1) {
    d = Math.exp(-w0 * t) * (x0 + (v0 + w0 * x0) * t);
  } else {
    const s = w0 * Math.sqrt(zeta * zeta - 1);
    const r1 = -zeta * w0 + s;
    const r2 = -zeta * w0 - s;
    const b = (v0 - r1 * x0) / (r2 - r1);
    const a = x0 - b;
    d = a * Math.exp(r1 * t) + b * Math.exp(r2 * t);
  }
  return 1 + d;
}

/**
 * How long the spring takes to settle (|x − 1| stays under `rest`), in ms.
 * Capped at 10 s so a mis-tuned spring cannot hang a loop.
 */
export function springDuration(spring: Spring, rest = 0.001): number {
  const step = 1 / 1000;
  let settledSince = -1;
  for (let i = 0; i <= 10000; i++) {
    const t = i * step;
    if (Math.abs(springAt(spring, t) - 1) < rest) {
      if (settledSince < 0) settledSince = i;
      // settled for 50 ms in a row
      if (i - settledSince >= 50) return Math.max(1, settledSince);
    } else settledSince = -1;
  }
  return 10000;
}

type Point = [t: number, x: number];

/** Ramer–Douglas–Peucker: drop points the eye cannot tell apart. */
function simplify(points: Point[], tolerance: number): Point[] {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [t, x] = points[i];
    const expected = a[1] + ((b[1] - a[1]) * (t - a[0])) / (b[0] - a[0] || 1);
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

const round = (n: number, digits: number) => {
  const p = 10 ** digits;
  const r = Math.round(n * p) / p;
  return Object.is(r, -0) ? 0 : r;
};

export type SpringEasing = {
  /** CSS `linear(…)` easing that traces the spring over `duration`. */
  easing: string;
  /** Settle time in ms — use as the animation duration. */
  duration: number;
  /** cubic-bezier for browsers without `linear()`. */
  fallback: string;
  /** Peak overshoot above 1 (0 for a critically damped spring). */
  overshoot: number;
};

/** Turn a spring into a CSS easing + duration (≈ 15–40 stops). */
export function springEasing(spring: Spring, tolerance = 0.004): SpringEasing {
  const duration = springDuration(spring);
  const samples = 200;
  const points: Point[] = [];
  let peak = 1;
  for (let i = 0; i <= samples; i++) {
    const p = i / samples;
    const x = i === samples ? 1 : springAt(spring, (p * duration) / 1000);
    peak = Math.max(peak, x);
    points.push([p, x]);
  }
  const kept = simplify(points, tolerance);
  const stops = kept.map(([p, x], i) =>
    i === 0 || i === kept.length - 1 ? `${round(x, 3)}` : `${round(x, 3)} ${round(p * 100, 1)}%`,
  );
  const zeta = dampingRatio(spring);
  const fallback =
    zeta >= 0.95
      ? "cubic-bezier(0.22, 1, 0.36, 1)"
      : zeta > 0.6
        ? "cubic-bezier(0.25, 1.2, 0.5, 1)"
        : "cubic-bezier(0.34, 1.56, 0.64, 1)";
  return { easing: `linear(${stops.join(", ")})`, duration, fallback, overshoot: round(peak - 1, 3) };
}

/**
 * Sampled keyframe values of a spring going `from` → `to`, for motion that
 * must be drawn point by point (a pendulum swing, a wobble that crosses 0).
 * `frames` keyframes over the settle time; offsets are 0…1.
 */
export function springKeyframes(spring: Spring, from: number, to: number, frames = 24) {
  const duration = springDuration(spring);
  return Array.from({ length: frames + 1 }, (_, i) => {
    const offset = i / frames;
    const x = i === frames ? 1 : springAt(spring, (offset * duration) / 1000);
    return { offset, value: round(from + (to - from) * x, 4) };
  });
}

/**
 * The Thinking State springs — from the 🎨 motion language (TENET 3 ·
 * компонентын бүртгэл ба хөдөлгөөн §1, Figma 39:169513). Calm, never bouncy:
 * every spring keeps a damping ratio ≥ 0.7 (1–2 px of overshoot at most).
 *  - soft:   UI cards, chips — almost no overshoot (ζ ≈ 1).
 *  - settle: landing, coming to rest — inbox, cards (ζ ≈ 0.82).
 *  - heavy:  things with weight — hammer, archive, folder (m 1.6, ζ ≈ 0.83).
 */
export const SPRINGS = {
  soft: { stiffness: 170, damping: 26, mass: 1 },
  settle: { stiffness: 120, damping: 18, mass: 1 },
  heavy: { stiffness: 90, damping: 20, mass: 1.6 },
} as const satisfies Record<string, Spring>;

export type SpringName = keyof typeof SPRINGS;
