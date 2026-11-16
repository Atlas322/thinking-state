import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type DateRange = {
    start: Date;
    end: Date;
};
export type CompareMode = "off" | "previous" | "year";
export type DateRangePreset = {
    id: string;
    label: string;
    range: (today: Date) => DateRange;
};
export type DateRangePickerProps = {
    value?: DateRange;
    defaultValue?: DateRange;
    onChange?: (range: DateRange, compare: DateRange | null, mode: CompareMode) => void;
    presets?: DateRangePreset[];
    compare?: boolean;
    defaultCompare?: CompareMode;
    weekStartsOn?: 0 | 1;
    min?: Date;
    max?: Date;
    defaultOpen?: boolean;
    today?: Date;
    className?: string;
};
export declare const defaultPresets: DateRangePreset[];
export declare function DateRangePicker({ value, defaultValue, onChange, presets, compare, defaultCompare, weekStartsOn, min, max, defaultOpen, today: todayProp, className, }: DateRangePickerProps): React.JSX.Element;
export declare function Demo(): React.JSX.Element;
export default Demo;
