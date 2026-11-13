/**
 * useInViewLoop — loops play only while they can be seen.
 *
 * One shared IntersectionObserver for the whole page (not one per loop), plus
 * the tab's visibility, `prefers-reduced-motion`, a page-wide pause from
 * <MotionProvider> and this region's own pause. The result lands on the
 * element as `data-ts-loop="running|offscreen|hidden|paused|reduced"`, which
 * the CSS in loops.ts reads, and WAAPI animations inside are paused/played
 * to match. Nothing runs per frame.
 */
import * as React from "react";
export type LoopState = "running" | "offscreen" | "hidden" | "paused" | "reduced";
type MotionContextValue = {
    paused: boolean;
    setPaused: (paused: boolean) => void;
};
export declare const MotionContext: React.Context<MotionContextValue>;
/** Page-wide pause for every loop below it (WCAG 2.2.2 «бүгдийг зогсоох»). */
export declare function MotionProvider({ children, paused: controlled, onPausedChange, defaultPaused, }: {
    children: React.ReactNode;
    paused?: boolean;
    onPausedChange?: (paused: boolean) => void;
    defaultPaused?: boolean;
}): React.FunctionComponentElement<React.ProviderProps<MotionContextValue>>;
export declare const useMotion: () => MotionContextValue;
/** Live `prefers-reduced-motion: reduce`. */
export declare function usePrefersReducedMotion(): boolean;
export type InViewLoopOptions = {
    /** Share of the element that must be visible to play. Default 0.15. */
    threshold?: number;
    /** Grow/shrink the viewport for the test, CSS margin syntax. Default "0px". */
    rootMargin?: string;
    /** Start paused (the user presses ▶). Default false. */
    defaultPaused?: boolean;
};
export type InViewLoop<T extends Element> = {
    /** Put on the region's root element. */
    ref: React.RefCallback<T>;
    state: LoopState;
    /** True while the loops actually move. */
    playing: boolean;
    /** This region's own pause (separate from the page-wide one). */
    paused: boolean;
    setPaused: (paused: boolean) => void;
    togglePaused: () => void;
    /** ↺ — restart every animation in the region from its first frame. */
    replay: () => void;
    /** Restart loops that rested after their cycles (hover, re-entering view). */
    wake: () => void;
    /** Bumps on replay when the browser cannot restart animations itself; use as a React key. */
    epoch: number;
    /** Spread on the root: `data-ts-loop`. */
    attrs: {
        "data-ts-loop": LoopState;
    };
};
/** element.animate() animations only — CSS animations follow data-ts-loop, CSS transitions are left alone. */
export declare function isScripted(a: Animation): boolean;
/** Bring one WAAPI animation in line with a loop state. */
export declare function syncAnimation(a: Animation, state: LoopState): void;
/** The loop state of the region `el` sits in, read from the nearest data-ts-loop. */
export declare function regionState(el: Element): LoopState | null;
export declare function useInViewLoop<T extends Element = HTMLDivElement>(options?: InViewLoopOptions): InViewLoop<T>;
export {};
