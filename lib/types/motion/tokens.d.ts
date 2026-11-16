/**
 * Motion tokens — the JS side of the `--ts-motion-*` variables in tokens.css.
 * Components use the CSS variables (with these values as fallbacks), so the
 * tokens stay optional exactly like the colour tokens.
 */
import { type SpringName } from "./spring";
/**
 * Durations in ms (🎨 motion language §1): xs hover, chip, focus · sm toggle,
 * pill, tab · md card enter, sheet, tooltip · lg page, section change · xl hero,
 * diagram links.
 */
export declare const DURATIONS: {
    readonly xs: 120;
    readonly sm: 200;
    readonly md: 320;
    readonly lg: 560;
    readonly xl: 900;
};
/**
 * Default loop rhythm: `move` ms of motion, then `rest` ms still (icons set
 * their own, 0.9–3 s + 2–6 s); at most `count` cycles, then the rest pose
 * until hover or the region re-enters the viewport. `stagger` between
 * siblings, top layer first.
 */
export declare const LOOP: {
    readonly move: 1200;
    readonly rest: 4000;
    readonly count: 3;
    readonly stagger: 100;
};
/** Bezier easings. */
export declare const EASINGS: {
    readonly standard: "cubic-bezier(0.2, 0, 0, 1)";
    /** Enter: decelerates to rest. */
    readonly enter: "cubic-bezier(0.05, 0.7, 0.1, 1)";
    /** Exit: accelerates away. */
    readonly exit: "cubic-bezier(0.3, 0, 0.8, 0.15)";
    /** Icon loops — an even breath. */
    readonly loop: "cubic-bezier(0.45, 0, 0.55, 1)";
};
export type DurationName = keyof typeof DURATIONS;
export type EasingName = keyof typeof EASINGS;
/** Spring easing + settle duration for a named spring (memoised). */
export declare function spring(name: SpringName): import("./spring").SpringEasing;
/** `var(--ts-motion-…, fallback)` helpers for inline styles. */
export declare const motionVar: {
    duration: (n: DurationName) => string;
    easing: (n: EasingName) => string;
    spring: (n: SpringName) => string;
    springDuration: (n: SpringName) => string;
};
/** The tokens.css block, generated — package.test checks tokens.css matches it. */
export declare function motionTokensCss(): string;
