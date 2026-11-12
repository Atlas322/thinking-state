import type { ReactNode } from "react";
export type MetricChange = {
    label: string;
    /** What happened, in words, e.g. "Up 6.1% to 18.2K" */
    change: string;
    /** good: green arrow · bad: red arrow · neutral: gray dash */
    tone?: "good" | "bad" | "neutral";
    /** Direction of the arrow – defaults to up for good, down for bad */
    direction?: "up" | "down";
};
export type ChangeSummaryProps = {
    title?: string;
    /** Small text on the right of the heading, e.g. "This week" */
    period?: string;
    icon?: ReactNode;
    changes: MetricChange[];
    className?: string;
};
export declare function ChangeSummary({ title, period, icon, changes, className, }: ChangeSummaryProps): import("react").JSX.Element;
/** Working example; use the named ChangeSummary export in your application. */
export default function Demo(): import("react").JSX.Element;
