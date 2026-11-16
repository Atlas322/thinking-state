import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type UsagePart = {
    label: string;
    value: number;
    color?: string;
};
export type UsageLimit = {
    label: string;
    used: number;
    total?: number | null;
    unit?: string;
    decimals?: number;
};
export type UsagePeriod = {
    id: string;
    label: string;
};
export type UsageDay = {
    label: string;
    value: number | null;
};
export type UsageState = "ok" | "warn" | "limit";
export type UsageMeterProps = {
    total?: number;
    used?: UsagePart[];
    limits?: UsageLimit[];
    periods?: UsagePeriod[];
    period?: string;
    defaultPeriod?: string;
    onPeriodChange?: (id: string) => void;
    /** Days until reset, or a date. */
    resetAt?: Date | string | number;
    daily?: UsageDay[];
    onUpgrade?: (state: UsageState) => void;
    title?: string;
    plan?: string;
    unit?: string;
    warnAt?: number;
    upgradeLabel?: string;
    topUpLabel?: string;
    className?: string;
};
export declare function UsageMeter({ total, used, limits, periods, period, defaultPeriod, onPeriodChange, resetAt, daily, onUpgrade, title, plan, unit, warnAt, upgradeLabel, topUpLabel, className, }: UsageMeterProps): React.JSX.Element;
export default UsageMeter;
