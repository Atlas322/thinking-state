import { type ReactNode } from "react";
export type SegmentOption<T extends string = string> = {
    value: T;
    label?: ReactNode;
    icon?: ReactNode;
    /** A small gray number after the label, e.g. unread items */
    count?: number | string;
    /** A small tinted tag after the label, e.g. "Save 20%" */
    badge?: ReactNode;
    disabled?: boolean;
    /** Accessible name – needed when the option only shows an icon */
    ariaLabel?: string;
    /** With kind="tabs": the id of the panel this tab shows */
    controls?: string;
};
export type SegmentedControlProps<T extends string = string> = {
    options: SegmentOption<T>[];
    /** Controlled value */
    value?: T;
    /** Starting value when uncontrolled – defaults to the first enabled option */
    defaultValue?: T;
    onChange?: (value: T) => void;
    size?: "sm" | "md" | "lg";
    /** "buttons" = separate chips, the active one filled; "tray" = light track with a raised pill; "underline" = text tabs with a sliding line */
    variant?: "buttons" | "tray" | "underline";
    /** Fill the container with equal segments */
    fullWidth?: boolean;
    /** "radio" (a radiogroup, the default) or "tabs" (a tablist that switches panels) */
    kind?: "radio" | "tabs";
    disabled?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    className?: string;
};
export declare function SegmentedControl<T extends string = string>({ options: rawOptions, value, defaultValue, onChange, size: sizeProp, variant: variantProp, fullWidth, kind, disabled, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, className, }: SegmentedControlProps<T>): React.JSX.Element;
import * as React from "react";
export default function Demo(): React.JSX.Element;
