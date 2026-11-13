import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type AwayItemKind = "needs-you" | "failed" | "done";
export type AwayItem = {
    id: string;
    title: string;
    kind: AwayItemKind;
    detail?: string;
    /** Button label; false leaves the row without one. */
    action?: string | false;
};
export type AwaySummaryLabels = {
    title: string;
    needsYou: string;
    failed: string;
    done: string;
    decide: string;
    retry: string;
    open: string;
    showMore: (n: number) => string;
    showLess: string;
    gotIt: string;
    divider: (summary: string) => string;
};
export type AwaySummaryProps = {
    /** Minutes away, or when the person left. */
    since?: Date | number | string;
    now?: Date | number;
    items?: AwayItem[];
    limit?: number;
    timeStyle?: "duration" | "clock";
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    onAction?: (id: string, item: AwayItem) => void | Promise<unknown>;
    onDismiss?: () => void;
    labels?: Partial<AwaySummaryLabels>;
    /** Show the demo chat around the card. */
    thread?: boolean;
    className?: string;
};
export declare function AwaySummary({ since, now, items, limit, timeStyle, collapsed: collapsedProp, defaultCollapsed, onCollapsedChange, onAction, onDismiss, labels: labelsProp, thread, className, }: AwaySummaryProps): React.JSX.Element;
export default AwaySummary;
