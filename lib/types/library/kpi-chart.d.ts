import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type KpiSeries = {
    label: string;
    color: string;
    values: number[];
};
export type KPIChartProps = {
    title?: string;
    value?: string;
    delta?: number;
    labels?: string[];
    tooltipLabels?: string[];
    series?: KpiSeries[];
    format?: (n: number) => string;
    footer?: string;
    defaultIndex?: number;
    emptyText?: string;
    className?: string;
};
export declare function KPIChart({ title, value, delta, labels, tooltipLabels, series, format, footer, defaultIndex, emptyText, className, }: KPIChartProps): React.JSX.Element;
export default KPIChart;
