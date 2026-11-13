import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type SteerNote = {
    id: string;
    text: string;
    picked?: "next" | "now";
};
export type SteerStep = {
    id: string;
    title: React.ReactNode;
    status?: "done" | "active" | "pending";
    /** Seconds, or a preformatted label. */
    duration?: number | string;
    startedAt?: number | Date;
    notes?: SteerNote[];
};
export type AgentSteeringProps = {
    title?: string;
    agent?: string;
    steps?: SteerStep[];
    queue?: SteerNote[];
    status?: "running" | "paused" | "done";
    startedAt?: number | Date;
    onQueue?: (text: string) => void;
    onInterrupt?: (text: string, queuedId?: string) => void;
    onRemove?: (id: string) => void;
    onPause?: () => void;
    onResume?: () => void;
    draft?: string;
    onDraftChange?: (text: string) => void;
    placeholder?: string;
    className?: string;
};
export declare function AgentSteering({ title, agent, steps: stepsProp, queue: queueProp, status: statusProp, startedAt, onQueue, onInterrupt, onRemove, onPause, onResume, draft: draftProp, onDraftChange, placeholder, className, }: AgentSteeringProps): React.JSX.Element;
export default AgentSteering;
