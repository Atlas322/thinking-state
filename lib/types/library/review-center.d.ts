import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type ReviewFlag = {
    text: string;
    note: string;
    source?: string;
};
export type ReviewText = string | (string | ReviewFlag)[];
export type ReviewItem = {
    id: string;
    title: string;
    agent: string;
    model?: string;
    icon?: React.ReactNode;
    type: string;
    risk: "high" | "medium" | "low";
    confidence: number;
    /** epoch ms */
    createdAt: number;
    reasoning?: string;
    fields?: {
        label: string;
        value: ReviewText;
    }[];
    body?: ReviewText;
    sources?: string[];
};
export type ReviewDecision = "approved" | "rejected";
export type ReviewResult = {
    decision: ReviewDecision;
    reason?: string;
    text?: string;
};
type Filter = "all" | "high" | "unsure";
export type ReviewCenterProps = {
    items?: ReviewItem[];
    onDecide?: (item: ReviewItem, result: ReviewResult) => void;
    onUndo?: (item: ReviewItem, result: ReviewResult) => void;
    onSkip?: (item: ReviewItem) => void;
    reviewed?: number;
    total?: number;
    sla?: number;
    now?: number;
    lowConfidence?: number;
    reasons?: string[];
    order?: "risk" | "oldest" | "given";
    filter?: Filter;
    defaultFilter?: Filter;
    onFilterChange?: (f: Filter) => void;
    title?: string;
    className?: string;
};
export declare const reviewIcons: {
    finance: React.JSX.Element;
    ops: React.JSX.Element;
    code: React.JSX.Element;
};
export declare function ReviewCenter({ items, onDecide, onUndo, onSkip, reviewed, total, sla, now: nowProp, lowConfidence, reasons, order, filter: filterProp, defaultFilter, onFilterChange, title, className, }: ReviewCenterProps): React.JSX.Element;
export default ReviewCenter;
