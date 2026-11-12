import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type QueueJobKind = "llm" | "tool" | "agent" | "human";
export type QueueJob = {
    id: string;
    name: string;
    kind: QueueJobKind;
    status: "queued" | "running" | "done" | "failed";
    enqueuedAt: number;
    priority?: "high" | "normal" | "low";
    startedAt?: number;
    endedAt?: number;
    worker?: string;
    /** 0–1 while running. */
    progress?: number;
    /** Expected run time in ms. */
    estimate?: number;
    attempt?: number;
};
export type QueueWorker = {
    id: string;
    name: string;
    icon?: "claude" | "openai" | "gemini" | React.ReactNode;
};
export type AgentQueueProps = {
    jobs?: QueueJob[];
    workers?: QueueWorker[];
    now?: number;
    rateLimits?: {
        from: number;
        until: number;
        label?: string;
    }[];
    paused?: boolean;
    onPausedChange?: (paused: boolean) => void;
    onConcurrencyChange?: (workers: number) => void;
    minConcurrency?: number;
    maxConcurrency?: number;
    backpressure?: number;
    window?: number;
    totals?: {
        done?: number;
        failed?: number;
    };
    title?: string;
    name?: string;
    className?: string;
};
export declare function AgentQueue({ jobs: jobsProp, workers, now, rateLimits, paused: pausedProp, onPausedChange, onConcurrencyChange, minConcurrency, maxConcurrency, backpressure, totals, title, name, className, }: AgentQueueProps): React.JSX.Element;
export default AgentQueue;
