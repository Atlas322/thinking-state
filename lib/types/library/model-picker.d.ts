import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type PickerModel = {
    id: string;
    name: string;
    description?: string;
    icon?: React.ReactNode;
    speed?: number;
    quality?: number;
    cost?: number;
    latencyMs?: number;
    pricePerM?: number;
};
export type Effort = "low" | "medium" | "high";
export type ModelPickerProps = {
    models?: PickerModel[];
    value?: string;
    defaultValue?: string;
    onChange?: (id: string) => void;
    thinking?: boolean;
    defaultThinking?: boolean;
    onThinkingChange?: (on: boolean) => void;
    webSearch?: boolean;
    defaultWebSearch?: boolean;
    onWebSearchChange?: (on: boolean) => void;
    effort?: Effort;
    defaultEffort?: Effort;
    onEffortChange?: (effort: Effort) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    align?: "start" | "end";
    side?: "bottom" | "top";
    placeholder?: string;
    className?: string;
};
export declare function ModelPicker({ models, value, defaultValue, onChange, thinking, defaultThinking, onThinkingChange, webSearch, defaultWebSearch, onWebSearchChange, effort, defaultEffort, onEffortChange, open, defaultOpen, onOpenChange, align, side, placeholder, className, }: ModelPickerProps): React.JSX.Element;
export default ModelPicker;
