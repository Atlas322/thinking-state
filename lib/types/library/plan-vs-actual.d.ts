import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type PlanStep = {
    id: string;
    title: string;
    /** Planned duration in ms. */
    plan: number;
    /** Ids of the steps that have to finish first. */
    deps?: string[];
    /** Real start and end in ms from the start of the run. */
    start?: number;
    end?: number;
    icon?: React.ReactNode;
};
export type PlanVsActualProps = {
    steps?: PlanStep[];
    /** Where the run is, in ms from its start. Omit to let the demo run. */
    now?: number;
    task?: string;
    title?: string;
    /** Spent and budgeted cost shown in the header. */
    cost?: [spent: number, budget: number];
    formatTime?: (ms: number) => string;
    className?: string;
};
export declare function PlanVsActual({ steps, now: nowProp, task, title, cost, formatTime, className, }: PlanVsActualProps): React.JSX.Element;
export default PlanVsActual;
