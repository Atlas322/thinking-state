import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type TrailState = "done" | "running" | "pending" | "waiting" | "failed";
export type TrailSubstep = {
    id?: string;
    title: string;
    state?: "done" | "running" | "pending";
    detail?: string;
};
export type TrailStep = {
    id: string;
    title: string;
    state: TrailState;
    /** ms as a number, or your own text. */
    duration?: number | string;
    status?: string;
    startedAt?: number;
    gate?: boolean;
    substeps?: TrailSubstep[];
};
export type AgentTrailLabels = {
    title: string;
    running: string;
    approval: string;
    waiting: string;
    failed: string;
    empty: string;
    untitled: string;
};
export type AgentTrailProps = {
    title?: string;
    steps?: TrailStep[];
    expanded?: string[];
    onExpandedChange?: (ids: string[]) => void;
    labels?: Partial<AgentTrailLabels>;
    className?: string;
};
export declare function formatDuration(v: number | string | undefined): string;
export declare function AgentTrail({ title, steps, expanded, onExpandedChange, labels: labelsIn, className, }: AgentTrailProps): React.JSX.Element;
export default AgentTrail;
