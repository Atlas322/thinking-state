// Thinking State motion foundation — springs, tokens, loops, in-view playback, replay.
export { SPRINGS, dampingRatio, springAt, springDuration, springEasing, springKeyframes } from "./spring";
export type { Spring, SpringEasing, SpringName } from "./spring";
export { DURATIONS, EASINGS, motionTokensCss, motionVar, spring } from "./tokens";
export type { DurationName, EasingName } from "./tokens";
export { LOOPS, LOOP_NOTES, motionCss } from "./loops";
export type { LoopName } from "./loops";
export { MotionContext, MotionProvider, useInViewLoop, useMotion, usePrefersReducedMotion } from "./use-in-view-loop";
export type { InViewLoop, InViewLoopOptions, LoopState } from "./use-in-view-loop";
export { LoopRegion, MotionControls, MotionStyles, motionControlLabelsMn } from "./controls";
export type { LoopRegionProps, MotionControlLabels, MotionControlsProps } from "./controls";
export { animateSpring, prefersReducedMotion } from "./animate";
