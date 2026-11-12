/**
 * useScenario / <ScenarioRegion> — the Thinking State standard for a living
 * component (owner 2026-11-12): every component plays its own meaningful
 * story — 3–5 states (e.g. request → waiting → approved → result), spring
 * transitions between them, a rest, then the loop again.
 *
 *  - Steps come from data (props): `{ state, hold }` — `hold` ms on that state.
 *  - Plays only while the region is in view and the tab is visible
 *    (useInViewLoop); at most `loops` cycles (default 3, --ts-motion-loop-count),
 *    then it rests on the last state until it re-enters view or ↺.
 *  - ↺ restarts from the first step, ⏸ / ▶ pauses on the current state
 *    (WCAG 2.2.2) — <MotionControls> on the region.
 *  - prefers-reduced-motion: the last (final) state, no timers.
 *
 * The component renders `state`; spring transitions come from CSS on the
 * changed parts (e.g. `transition: … var(--ts-motion-spring-soft)` or a
 * `ts-enter` keyed on the step). The region carries data-ts-step="<index>".
 */
import * as React from "react";
import { MotionControls, MotionStyles, type MotionControlLabels } from "./controls";
import { LOOP } from "./tokens";
import { useInViewLoop, type InViewLoopOptions, type LoopState } from "./use-in-view-loop";

export type ScenarioStep<S> = { state: S; /** ms to stay on this state */ hold: number };

export type ScenarioOptions = InViewLoopOptions & {
  /** ms of stillness after the last step before the next cycle. Default LOOP.rest (4 s). */
  rest?: number;
  /** Cycles before it rests on the last state. Default LOOP.count (3). Infinity = always. */
  loops?: number;
};

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
  attrs: { "data-ts-loop": LoopState; "data-ts-step": number };
};

export function useScenario<S, T extends Element = HTMLDivElement>(steps: ScenarioStep<S>[], options: ScenarioOptions = {}): Scenario<S, T> {
  const { rest = LOOP.rest, loops = LOOP.count, ...view } = options;
  const loop = useInViewLoop<T>(view);
  const last = Math.max(0, steps.length - 1);
  const [index, setIndex] = React.useState(0);
  const [cycle, setCycle] = React.useState(0);
  // Steps by ref: an inline steps array must not restart the hold timer on every parent render.
  const stepsRef = React.useRef(steps);
  stepsRef.current = steps;
  const reduced = loop.state === "reduced";
  const running = loop.state === "running";

  // Coming back into view after the cycles ran out starts the story again.
  const prev = React.useRef(loop.state);
  React.useEffect(() => {
    if (running && (prev.current === "offscreen" || prev.current === "hidden") && cycle >= loops) {
      setIndex(0);
      setCycle(0);
    }
    prev.current = loop.state;
  }, [loop.state, running, cycle, loops]);

  React.useEffect(() => {
    if (!running || last < 1 || cycle >= loops) return;
    const atEnd = index >= last;
    const wait = (stepsRef.current[index]?.hold ?? 1000) + (atEnd ? rest : 0);
    const t = setTimeout(() => {
      if (!atEnd) setIndex(index + 1);
      else if (cycle + 1 < loops) {
        setIndex(0);
        setCycle(cycle + 1);
      } else setCycle(loops); // done: rest on the final state
    }, wait);
    return () => clearTimeout(t);
  }, [running, index, cycle, loops, last, rest]);

  const shown = reduced ? last : Math.min(index, last);
  const replay = React.useCallback(() => {
    setIndex(0);
    setCycle(0);
    loop.replay();
  }, [loop]);

  return {
    state: steps[shown]?.state as S,
    index: shown,
    total: steps.length,
    cycle,
    loopState: loop.state,
    playing: running && cycle < loops,
    paused: loop.paused,
    togglePaused: loop.togglePaused,
    replay,
    ref: loop.ref,
    attrs: { "data-ts-loop": loop.state, "data-ts-step": shown },
  };
}

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

/** A region that plays its scenario, with ↺ / ⏸ on top. */
export function ScenarioRegion<S>({
  steps,
  children,
  controls = "hover",
  labels,
  className = "",
  style,
  as: Tag = "div",
  showSteps = false,
  ...options
}: ScenarioRegionProps<S>) {
  const sc = useScenario<S, HTMLElement>(steps, options);
  return (
    <Tag ref={sc.ref as React.Ref<never>} className={`ts-loop-region ts-scenario ${className}`} style={style} {...sc.attrs} data-controls={controls}>
      <MotionStyles />
      {children(sc.state, sc)}
      {controls !== "none" && sc.loopState !== "reduced" && (
        <MotionControls onReplay={sc.replay} paused={sc.paused} onTogglePause={sc.togglePaused} labels={labels} />
      )}
      {showSteps && (
        <span className="ts-scenario-steps" aria-hidden="true">
          {steps.map((_, i) => (
            <i key={i} data-on={i === sc.index || undefined} />
          ))}
        </span>
      )}
    </Tag>
  );
}
