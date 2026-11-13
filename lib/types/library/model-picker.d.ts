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
export type Effort = "low" | "medium" | "high" | "";
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
    /** Host mode (Second Brain app, 2026-11-13): only the trigger and the menu — no own field, send button, web search
     * or estimate tray; the host's composer holds them. The thinking switch goes, effort is always shown. */
    host?: boolean;
    /** Host mode: an extra first effort choice meaning «use the default» (value ""), e.g. "Анхдагч". */
    effortAuto?: string;
    /** Host mode: the trigger's short effort tag (default: the effort label when one is chosen). */
    effortTag?: string;
};
export declare function ModelPicker({ models, value, defaultValue, onChange, thinking, defaultThinking, onThinkingChange, webSearch, defaultWebSearch, onWebSearchChange, effort, defaultEffort, onEffortChange, open, defaultOpen, onOpenChange, align, side, placeholder, className, host, effortAuto, effortTag, }: ModelPickerProps): React.JSX.Element;
export default ModelPicker;
