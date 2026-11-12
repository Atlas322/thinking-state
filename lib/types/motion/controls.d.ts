/**
 * <MotionStyles/> — injects the loop keyframes once (React 19 dedupes by href).
 * <MotionControls/> — ↺ replay + ⏸/▶ pause, the WCAG 2.2.2 control.
 *                    (src/replay/replay.tsx's <Replay> is the simpler ↺-only wrapper.)
 * <LoopRegion/>   — a box whose loops play only in view, with <MotionControls/> on it.
 */
import * as React from "react";
import { type LoopName, type Rhythm } from "./loops";
import { type InViewLoopOptions, type LoopState } from "./use-in-view-loop";
/** React 19 hoists and dedupes this by href; the hash keeps two package versions apart. */
export declare function MotionStyles(): React.JSX.Element;
/**
 * A loop at its own rhythm: injects the keyframes once and returns the class
 * + inline style to put on the moving element.
 *   const l = useLoop("bob", { move: 900, rest: 4000, spring: "settle" });
 *   <>{l.keyframes}<span {...l.props}>…</span></>
 */
export declare function useLoop(loop: LoopName, rhythm?: Rhythm, style?: React.CSSProperties): {
    keyframes: React.JSX.Element;
    props: {
        className: string;
        style: React.CSSProperties;
    };
};
export type MotionControlLabels = {
    replay: string;
    pause: string;
    play: string;
};
export declare const motionControlLabelsMn: MotionControlLabels;
export type MotionControlsProps = {
    onReplay: () => void;
    paused: boolean;
    onTogglePause: () => void;
    /** Hide the pause button (for once-only motion shorter than 5 s). */
    showPause?: boolean;
    labels?: Partial<MotionControlLabels>;
    className?: string;
};
export declare function MotionControls({ onReplay, paused, onTogglePause, showPause, labels, className }: MotionControlsProps): React.JSX.Element;
export type LoopRegionProps = InViewLoopOptions & {
    children: React.ReactNode;
    /** Where the ↺ / ⏸ controls sit. "hover" shows them on hover / focus (always on touch). */
    controls?: "hover" | "always" | "none";
    labels?: Partial<MotionControlLabels>;
    className?: string;
    style?: React.CSSProperties;
    as?: "div" | "section" | "article" | "li";
    onStateChange?: (state: LoopState) => void;
};
export declare function LoopRegion({ children, controls, labels, className, style, as: Tag, onStateChange, ...options }: LoopRegionProps): React.JSX.Element;
