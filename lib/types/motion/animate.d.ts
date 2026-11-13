/**
 * animateSpring — one-shot WAAPI animation on a named spring (enter, toggle,
 * peek open). Reduced motion or no WAAPI: jumps to the last keyframe.
 * Inside a LoopRegion it starts in the region's state (paused → finished).
 */
import type { SpringName } from "./spring";
export declare function prefersReducedMotion(): boolean;
export declare function animateSpring(el: Element, keyframes: Keyframe[], name?: SpringName, options?: {
    delay?: number;
    fill?: FillMode;
}): Animation | null;
