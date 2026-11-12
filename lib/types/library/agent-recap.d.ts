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
export type AgentRecapProps = {
    events?: RecapEvent[];
    since?: Date | string | number;
    until?: Date | string | number;
    onAction?: (event: RecapEvent, action: "primary" | "review") => void | Promise<unknown>;
    onUndo?: (event: RecapEvent) => void;
    onRedo?: (event: RecapEvent) => void;
    limit?: number;
    replay?: number;
    title?: string;
    locale?: string;
    className?: string;
};
export declare function AgentRecap({ events, since, until, onAction, onUndo, onRedo, limit, replay, title, locale, className, }: AgentRecapProps): React.JSX.Element;
export default AgentRecap;
