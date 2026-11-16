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
import { type SpringName } from "./spring";
export declare const LOOPS: readonly ["bob", "swing", "breathe", "float", "spin", "pulse", "nudge", "pop", "shake"];
export type LoopName = (typeof LOOPS)[number];
/** What each loop means physically — used by the catalog and the icon map. */
export declare const LOOP_NOTES: Record<LoopName, string>;
/**
 * A loop's rhythm (🎨 motion language §2: «хөдөлгөөн + амрах» per icon).
 * `move` ms of motion, then `rest` ms still; `spring` sets the settle feel.
 * Default 1.2 s + 4 s.
 */
export type Rhythm = {
    move?: number;
    rest?: number;
    spring?: SpringName;
};
export type LoopAnimation = {
    /** The @keyframes name (unique per loop + rhythm). */
    name: string;
    /** Period in ms (move + rest) — use as animation-duration. */
    period: number;
    /** The @keyframes CSS (linear() springs with a cubic-bezier fallback). */
    css: string;
};
/**
 * Keyframes for one loop at one rhythm. The default rhythm is the plain
 * `.ts-loop-NAME` class; any other rhythm gets its own keyframes name —
 * inject `css` once (e.g. <LoopKeyframes/>) and set `animation-name` /
 * `animation-duration` inline.
 */
export declare function loopAnimation(loop: LoopName, rhythm?: Rhythm): LoopAnimation;
/** All default keyframes + playback rules. Injected once by <MotionStyles/>. */
export declare function motionCss(): string;
