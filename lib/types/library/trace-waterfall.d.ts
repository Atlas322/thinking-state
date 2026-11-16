import * as React from "react";
export type TraceSpan = {
    id: string;
    name: string;
    kind: "agent" | "subagent" | "llm" | "tool";
    status: "running" | "done" | "failed";
    start: number;
    end?: number;
    detail?: string;
    icon?: React.ReactNode;
    model?: string;
    tokensIn?: number;
    tokensOut?: number;
    cost?: number;
    input?: string;
    output?: string;
    error?: string;
    children?: TraceSpan[];
};
export type TraceWaterfallProps = {
    root?: TraceSpan;
    now?: number;
    startedAt?: number;
    collapsed?: string[];
    defaultCollapsed?: string[];
    onCollapsedChange?: (ids: string[]) => void;
    openId?: string | null;
    defaultOpenId?: string | null;
    onOpenChange?: (id: string | null, span?: TraceSpan) => void;
    markSlowest?: boolean;
    minRange?: number;
    formatCost?: (value: number) => string;
    title?: string;
    className?: string;
};
export declare function TraceWaterfall({ root, now, startedAt, collapsed, defaultCollapsed, onCollapsedChange, openId, defaultOpenId, onOpenChange, markSlowest, minRange, formatCost, title, className, }: TraceWaterfallProps): React.JSX.Element;
/** Catalog example: the demo trace carries no money, so the cost column shows a dash. */
export default function TraceWaterfallDemo(): React.JSX.Element;
