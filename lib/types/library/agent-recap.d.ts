import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type RecapKind = "needs" | "failed" | "done";
export type RecapLogo = "slack" | "github" | "drive" | "linear" | React.ReactNode;
export type RecapEvent = {
    id: string;
    at: Date | string | number;
    kind: RecapKind;
    title: string;
    detail?: string;
    logo?: RecapLogo;
    count?: number;
    /** Main action label – Approve, Merge, Retry … */
    action?: string;
    doneLabel?: string;
};
/** Labels under the chart's two ends. A missing key falls back to the window's clock time. */
export type RecapAxis = {
    start?: React.ReactNode;
    end?: React.ReactNode;
};
export type AgentRecapProps = {
    events?: RecapEvent[];
    /** Start of the recap window (chart's left edge, header «…-аас хойш»). */
    since?: Date | string | number;
    /** End of the recap window (chart's right edge). */
    until?: Date | string | number;
    /** When true, events outside `since`…`until` are left out of the chart, lanes and counts. Default false (all events shown). */
    clip?: boolean;
    /** Override the time-axis labels; see {@link RecapAxis}. */
    axis?: RecapAxis | [string, string];
    /** A line under the title (replaces the «… -аас хойш N цаг» line). */
    subtitle?: React.ReactNode;
    onAction?: (event: RecapEvent, action: "primary" | "review") => void | Promise<unknown>;
    onUndo?: (event: RecapEvent) => void;
    onRedo?: (event: RecapEvent) => void;
    limit?: number;
    replay?: number;
    title?: string;
    locale?: string;
    className?: string;
};
export declare function AgentRecap({ events: eventsProp, since, until, clip, axis, subtitle, onAction, onUndo, onRedo, limit, replay, title, locale, className, }: AgentRecapProps): React.JSX.Element;
export default AgentRecap;
