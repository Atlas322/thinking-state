/**
 * useScenario / <ScenarioRegion> — the Thinking State standard for a living
 * component (2026-11-12): every component plays its own meaningful
 * story — 3–5 states (e.g. request → waiting → approved → result), spring
 * transitions between them, a rest, then the loop again.
 *
 *  - Steps come from data (props): `{ state, hold }` — `hold` ms on that state.
 *  - Plays only while the region is in view and the tab is visible
 *    (useInViewLoop); at most `loops` cycles (default 3, --ts-motion-loop-count),
 *    then it rests on the last state until it re-enters view or ↺.
 *  - ↺ restarts from the first step, ⏸ / ▶ pauses on the current state
 *    (WCAG 2.2.2) — <MotionControls> on the region.
 *  - No controls (the default since 2026-11-13: ↺ / ⏸ belong to the chat
 *    detail components only — ScenarioChat, ThinkingState, AgentConsent,
 *    ToolCall, AgentLanes, the CompanyView board): the story plays once and
 *    settles on its final state within 5 s (`maxMs`), so no control is needed
 *    under WCAG 2.2.2.
 *  - prefers-reduced-motion: the last (final) state, no timers.
 *
 * The component renders `state`; spring transitions come from CSS on the
 * changed parts (e.g. `transition: … var(--ts-motion-spring-soft)` or a
 * `ts-enter` keyed on the step). The region carries data-ts-step="<index>".
 */
import * as React from "react";
import { type MotionControlLabels } from "./controls";
import { type InViewLoopOptions, type LoopState } from "./use-in-view-loop";
export type ScenarioStep<S> = {
    state: S; /** ms to stay on this state */
    hold: number;
};
export type ScenarioOptions = InViewLoopOptions & {
    /** ms of stillness after the last step before the next cycle. Default LOOP.rest (4 s). */
    rest?: number;
    /** Cycles before it rests on the last state. Default LOOP.count (3). Infinity = always. */
    loops?: number;
    /** Settle on the final state after this many ms of playing (WCAG 2.2.2 when there are no controls). */
    maxMs?: number;
};
/** WCAG 2.2.2: moving content without a pause control stops within 5 s. */
export declare const UNCONTROLLED_MAX_MS = 5000;
export type Scenario<S, T extends Element> = {
    state: S;
    index: number;
    total: number;
    /** Which cycle (0-based). */
    cycle: number;
    loopState: LoopState;
    playing: boolean;
    paused: boolean;
    togglePaused: () => void;
    /** ↺ — first step, first cycle. */
    replay: () => void;
    ref: React.RefCallback<T>;
    attrs: {
        "data-ts-loop": LoopState;
        "data-ts-step": number;
    };
};
export declare function useScenario<S, T extends Element = HTMLDivElement>(steps: ScenarioStep<S>[], options?: ScenarioOptions): Scenario<S, T>;
export type ScenarioRegionProps<S> = ScenarioOptions & {
    steps: ScenarioStep<S>[];
    children: (state: S, scenario: Scenario<S, HTMLElement>) => React.ReactNode;
    controls?: "hover" | "always" | "none";
    labels?: Partial<MotionControlLabels>;
    className?: string;
    style?: React.CSSProperties;
    as?: "div" | "section" | "article" | "li";
    /** Show "2 / 4" step dots under the controls (catalog previews). */
    showSteps?: boolean;
};
/**
 * A region that plays its scenario. Without controls (default) it plays once
 * and settles within 5 s; pass controls="hover" | "always" for ↺ / ⏸ (chat
 * detail components) and the usual 3 cycles.
 */
export declare function ScenarioRegion<S>({ steps, children, controls, labels, className, style, as: Tag, showSteps, ...options }: ScenarioRegionProps<S>): React.JSX.Element;
