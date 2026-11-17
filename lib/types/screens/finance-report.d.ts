import { type KpiSeries } from "../library/kpi-chart";
import { type CitedSegment, type CitedSource } from "../library/cited-answer";
import { type CostStep } from "../library/cost-waterfall";
/** trend = direction of the change (arrow); good = whether that change is good news (colour). Never colour alone. */
export type FinanceKpi = {
    label: string;
    value: string;
    delta?: string;
    trend?: "up" | "down" | "flat";
    good?: boolean;
    cite?: string;
};
export type FinanceLine = {
    id: string;
    line: string;
    now: number;
    prev: number;
    cite: string;
    total?: boolean;
};
export type FinanceReportData = {
    company: string;
    period: string;
    unit: string;
    kpis: FinanceKpi[];
    pnl: FinanceLine[];
    cash: {
        labels: string[];
        series: KpiSeries[];
        value: string;
        delta: number;
    };
    variance: CitedSegment[];
    sources: CitedSource[];
    steps: CostStep[];
    approval: {
        title: string;
        description: string;
        details: {
            label: string;
            value: string;
        }[];
    };
    note: string;
};
export type FinanceReportProps = Partial<FinanceReportData> & {
    theme?: "light" | "dark";
    className?: string;
};
export declare const financeReportDemo: FinanceReportData;
export declare function FinanceReport({ theme, className, ...data }: FinanceReportProps): import("react").JSX.Element;
export default FinanceReport;
