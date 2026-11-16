import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type LaneAgent = {
    id: string;
    name: string;
    model?: string;
    avatar?: React.ReactNode;
};
/** Neutral keys: docs, chat, design, code, payments. The older vendor-named keys still work (same glyphs). */
export type LaneTool = "docs" | "chat" | "design" | "code" | "payments" | "notion" | "slack" | "figma" | "github" | "stripe";
export type LaneTask = {
    id: string;
    agentId: string;
    title: string;
    status: "done" | "running" | "waiting" | "failed";
    start: number;
    end?: number;
    handoffTo?: string;
    ask?: string;
    summary?: string;
    tools?: LaneTool[];
};
/** Every visible or spoken string. Defaults: `agentLanesLabelsMn`. */
export type AgentLanesLabels = {
    title: string;
    /** Header counter, e.g. «3 ажиллаж байна». */
    running: (n: number) => string;
    /** Header counter for tasks waiting on the user. */
    needsYou: (n: number) => string;
    /** Window chip built from `span`, e.g. «Сүүлийн 30 мин». */
    lastSpan: (minutes: number) => string;
    now: string;
    /** Tick label, e.g. «−25 мин». */
    tick: (minutes: number) => string;
    /** Agent tag when nothing runs. */
    idle: string;
    /** Status words; `waiting` is the «Таны ээлж» flag, tag and pill. */
    status: Record<LaneTask["status"], string>;
    approve: string;
    reject: string;
    open: string;
    /** Popover question when a waiting task has no `ask`. */
    defaultAsk: string;
    /** Popover text when a task has no `summary` (gets the status word). */
    popoverFallback: (status: string) => string;
    /** Screen-reader live line. */
    srWaiting: (n: number) => string;
    /** Relative start time. */
    ago: (minutes: number) => string;
    /** Lane block aria-label. */
    blockLabel: (agent: string, title: string, status: string, ago: string) => string;
};
export declare const agentLanesLabelsMn: AgentLanesLabels;
export type AgentLanesProps = {
    agents?: LaneAgent[];
    tasks?: LaneTask[];
    /** Visible window in ms. */
    span?: number;
    now?: number;
    /** Defaults to `labels.title`. */
    title?: string;
    /** Overrides for any label; the rest fall back to `agentLanesLabelsMn`. */
    labels?: Partial<AgentLanesLabels>;
    className?: string;
    onApprove?: (task: LaneTask) => void;
    onReject?: (task: LaneTask) => void;
    onOpen?: (task: LaneTask) => void;
};
export declare function AgentLanes({ agents, tasks: tasksProp, span, now: nowProp, title: titleProp, labels, className, onApprove, onReject, onOpen, }: AgentLanesProps): React.JSX.Element;
export default AgentLanes;
