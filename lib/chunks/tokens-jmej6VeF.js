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
    const r1 = -zeta * w0 + s;
    const r2 = -zeta * w0 - s;
    const b = (v0 - r1 * x0) / (r2 - r1);
    const a = x0 - b;
    d = a * Math.exp(r1 * t) + b * Math.exp(r2 * t);
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
export {
  DURATIONS as D,
  EASINGS as E,
  LOOP as L,
  SPRINGS as S,
  springKeyframes as a,
  motionTokensCss as b,
  springAt as c,
  dampingRatio as d,
  springDuration as e,
  springEasing as f,
  motionVar as m,
  spring as s
};
//# sourceMappingURL=tokens-jmej6VeF.js.map
