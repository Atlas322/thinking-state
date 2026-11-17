/**
 * CashRiver (2026-11-17, screens.14): «Мөнгөний гол» from the Second Brain Figma (06 Санхүү ·
 * Мөнгөний гол + Хэрэв… горим). The account balance across a month drawn as a river: its width is
 * the balance, money in joins from above, money out leaves below, the day it runs under the safety
 * line turns red. A scenario switches planned payments on and off and shows the river it would be,
 * over the dashed outline of the current one, with the agent's suggestion.
 *
 * Text never carries meaning by colour alone: every pin has its amount, the danger day is named.
 */
import * as React from "react";
export type CashEvent = {
    id: string;
    day: number;
    label: string;
    amount: number;
    pending?: boolean;
};
export type CashToggle = {
    id: string;
    label: string;
    detail?: string;
    day: number;
    amount: number;
    on?: boolean;
};
export type CashRiverProps = {
    title?: string;
    /** Balance at the start of day 1. */
    opening: number;
    days?: number;
    today?: number;
    /** Safety line: below it the river turns red. */
    floor: number;
    events: CashEvent[];
    /** «Хэрэв…» mode: planned payments that can be switched on or off. */
    scenario?: CashToggle[];
    suggestion?: string;
    unit?: string;
    className?: string;
};
export declare function CashRiver({ title, opening, days, today, floor, events, scenario, suggestion, unit, className }: CashRiverProps): React.JSX.Element;
export declare const cashRiverDemo: CashRiverProps;
export default CashRiver;
