import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type Repeat = "once" | "monthly" | "quarterly" | "yearly";
export type CatalogItem = {
    name: string;
    repeat: Repeat;
    price: number;
};
export type ScheduleLine = {
    id: string;
    kind: "product";
    name: string;
    repeat: Repeat;
    price: number;
    timing?: "advance" | "arrears";
} | {
    id: string;
    kind: "discount";
    percent: number;
} | {
    id: string;
    kind: "minimum";
    amount: number;
};
export type BillingScheduleValue = {
    phase: string;
    start: string;
    duration: string;
    lines: ScheduleLine[];
};
export type BillingScheduleProps = {
    title?: string;
    phase?: string;
    currency?: string;
    catalog?: CatalogItem[];
    defaultLines?: ScheduleLine[];
    defaultStart?: string;
    onChange?: (schedule: BillingScheduleValue) => void;
    className?: string;
};
export declare function BillingSchedule({ title, phase: phaseProp, currency, catalog, defaultLines, defaultStart, onChange, className, }: BillingScheduleProps): React.JSX.Element;
/** Catalog preview: amounts are plain units with no currency sign. */
export default function BillingSchedulePreview(): React.JSX.Element;
