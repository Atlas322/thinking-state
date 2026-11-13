import { type ReactNode } from "react";
export type ProgressStep = {
    id: string;
    label: string;
    done?: boolean;
    /** Small icon on the right, e.g. the app the step belongs to */
    icon?: ReactNode;
};
export type ProgressTrackerProps = {
    title?: string;
    steps: ProgressStep[];
    /** Ticks the open steps one after another, then starts over – stops as soon as someone interacts */
    autoPlay?: boolean;
    /** Pause between two automatic steps, in ms */
    interval?: number;
    onChange?: (steps: ProgressStep[]) => void;
    className?: string;
};
export declare function ProgressTracker({ title, steps: initial, autoPlay, interval, onChange, className, }: ProgressTrackerProps): import("react").JSX.Element;
/** Working example; use the named ProgressTracker export in your application. */
export default function Demo(): import("react").JSX.Element;
