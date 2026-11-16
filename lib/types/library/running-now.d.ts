import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type RunningTaskState = "running" | "paused" | "needs-you" | "done";
export type RunningTask = {
    id: string;
    title: string;
    step: string;
    done: number;
    total: number;
    state: RunningTaskState;
};
export type RunningNowLabels = {
    title: string;
    running: string;
    needsYou: string;
    needsYouOne: string;
    needsYouBadge: string;
    paused: string;
    pausedCount: string;
    done: string;
    pause: string;
    resume: string;
    open: string;
    openAll: string;
    empty: string;
    idle: string;
};
export type RunningNowProps = {
    tasks?: RunningTask[];
    onPause?: (id: string) => void;
    onResume?: (id: string) => void;
    onOpen?: (id: string) => void;
    onOpenAll?: () => void;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    align?: "start" | "end";
    labels?: Partial<RunningNowLabels>;
    /** Left side of the demo header bar; pass null to render only the pill. */
    brand?: React.ReactNode;
    className?: string;
};
export declare function RunningNow({ tasks: tasksProp, onPause, onResume, onOpen, onOpenAll, defaultOpen, open: openProp, onOpenChange, align, labels: labelsProp, brand, className, }: RunningNowProps): React.JSX.Element;
export default RunningNow;
