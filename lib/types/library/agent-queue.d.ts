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
/**
 * Queue threshold. A number keeps the classic look (amber count, dashed line
 * on the chart). `true` or `{ at, label }` also shows a needs-you warning in
 * the header once the queue is at or over `at` (default 12). `false` turns
 * the threshold off.
 */
export type QueueBackpressure = number | boolean | {
    at: number;
    label?: string;
};
/** What the chart's horizontal axis means: `time` = queue length over the last seconds (default), `order` = each waiting job's wait, first in line to last. */
export type QueueAxis = "time" | "order";
/** Header counter overrides; a missing key falls back to the computed value. */
export type QueueTotals = {
    done?: number;
    failed?: number;
    queued?: number;
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
    /** See {@link QueueBackpressure}. Default 12. */
    backpressure?: QueueBackpressure;
    window?: number;
    /** Override the computed done / failed / queued counters. */
    totals?: QueueTotals;
    /** A number: how many waiting jobs to list before a «+N» row (default 3, no «+N» row). An array: recent queue-depth samples, drawn as a small sparkline in the header. */
    depth?: number | number[];
    /** See {@link QueueAxis}. Default `time`. An array gives custom tick labels under the chart. */
    axis?: QueueAxis | string[];
    title?: string;
    name?: string;
    className?: string;
};
export declare function AgentQueue({ jobs: jobsProp, workers, now, rateLimits, paused: pausedProp, onPausedChange, onConcurrencyChange, minConcurrency, maxConcurrency, backpressure, totals, depth: depthProp, axis, title, name, className, }: AgentQueueProps): React.JSX.Element;
export default AgentQueue;
