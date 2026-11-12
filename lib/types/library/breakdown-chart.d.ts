import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type BreakdownRecord = Record<string, string | number>;
export type Dimension = {
    key: string;
    label: string;
    values: string[];
    colors?: Record<string, string>;
    icons?: Record<string, React.ReactNode>;
};
export type Measure = {
    key: string;
    label: string;
    unit?: string;
    field?: string;
};
export type BreakdownChartProps = {
    records?: BreakdownRecord[];
    dimensions?: Dimension[];
    measures?: Measure[];
    title?: string;
    defaultMeasure?: string;
    defaultSlice?: string;
    defaultSegment?: string;
    className?: string;
};
export declare function BreakdownChart({ records, dimensions, measures, title, defaultMeasure, defaultSlice, defaultSegment, className, }: BreakdownChartProps): React.JSX.Element;
export default BreakdownChart;
