import { type ReactNode } from "react";
export interface ThinkingSource {
    label: string;
    href?: string;
    tooltip?: string;
    icon?: ReactNode;
}
export interface ThinkingStep {
    kind: "search" | "step";
    label: string;
    /** Optional label after this step has finished. */
    completedLabel?: string;
    sources?: ThinkingSource[];
    moreSources?: ThinkingSource[];
}
export interface ThinkingStateProps {
    steps: ThinkingStep[];
    doneLabel?: string;
    stepMs?: number;
    loop?: boolean;
    collapseOnDone?: boolean;
    onDone?: (seconds: number) => void;
    className?: string;
    variant?: "clean" | "classic";
    /**
     * Live mode: a real run owns the progress. Every step in `steps` is shown, the last one is active until
     * `done`, and the header shows the host's `seconds`. The built-in demo timer does not run.
     */
    live?: {
        done: boolean;
        seconds: number;
    };
    /** Header text, for other languages: defaults «Бодож байна» and «7 с ажилласан». */
    labels?: {
        thinking?: string;
        worked?: (seconds: number) => string;
        /** Running clock next to the header – defaults to «42 с». */
        time?: (seconds: number) => string;
    };
    /** Replaces the check mark on the finished row – e.g. a cross when the run failed. */
    doneIcon?: ReactNode;
}
/** A timed, presentational thinking timeline. Remount with a new key to replay. */
export declare function ThinkingState({ steps, doneLabel, stepMs, loop, collapseOnDone, onDone, className, variant, live, labels, doneIcon, }: ThinkingStateProps): import("react").JSX.Element;
export default function Demo(): import("react").JSX.Element;
