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
export declare function dampingRatio({ stiffness, damping, mass }: Spring): number;
/** Position x(t) of the spring at t seconds, going from 0 to 1. */
export declare function springAt(spring: Spring, t: number): number;
/**
 * How long the spring takes to settle (|x − 1| stays under `rest`), in ms.
 * Capped at 10 s so a mis-tuned spring cannot hang a loop.
 */
export declare function springDuration(spring: Spring, rest?: number): number;
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
export declare function springEasing(spring: Spring, tolerance?: number): SpringEasing;
/**
 * Sampled keyframe values of a spring going `from` → `to`, for motion that
 * must be drawn point by point (a pendulum swing, a wobble that crosses 0).
 * `frames` keyframes over the settle time; offsets are 0…1.
 */
export declare function springKeyframes(spring: Spring, from: number, to: number, frames?: number): {
    offset: number;
    value: number;
}[];
/**
 * The Thinking State springs — from the 🎨 motion language (TENET 3 ·
 * компонентын бүртгэл ба хөдөлгөөн §1, Figma 39:169513). Calm, never bouncy:
 * every spring keeps a damping ratio ≥ 0.7 (1–2 px of overshoot at most).
 *  - soft:   UI cards, chips — almost no overshoot (ζ ≈ 1).
 *  - settle: landing, coming to rest — inbox, cards (ζ ≈ 0.82).
 *  - heavy:  things with weight — hammer, archive, folder (m 1.6, ζ ≈ 0.83).
 */
export declare const SPRINGS: {
    readonly soft: {
        readonly stiffness: 170;
        readonly damping: 26;
        readonly mass: 1;
    };
    readonly settle: {
        readonly stiffness: 120;
        readonly damping: 18;
        readonly mass: 1;
    };
    readonly heavy: {
        readonly stiffness: 90;
        readonly damping: 20;
        readonly mass: 1.6;
    };
};
export type SpringName = keyof typeof SPRINGS;
