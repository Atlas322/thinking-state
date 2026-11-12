import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type BreakdownItem = {
    id?: string;
    label: string;
    value: number;
    color?: string;
};
export type CompactBreakdownProps = {
    title?: string;
    items?: BreakdownItem[];
    periods?: {
        id: string;
        label: string;
    }[];
    period?: string;
    defaultPeriod?: string;
    onPeriodChange?: (id: string) => void;
    delta?: number;
    format?: (value: number) => string;
    totalLabel?: string;
    footer?: React.ReactNode | null;
    className?: string;
};
export declare function CompactBreakdown({ title, items: itemsProp, periods, period: periodProp, defaultPeriod, onPeriodChange, delta: deltaProp, format, totalLabel, footer, className, }: CompactBreakdownProps): React.JSX.Element;
export default function CompactBreakdownPreview(): React.JSX.Element;
