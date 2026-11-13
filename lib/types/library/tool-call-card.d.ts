import { type ReactNode } from "react";
export type ToolCallStatus = "running" | "success" | "error";
export type ToolCallCardProps = {
    /** Tool name as the agent calls it, shown in mono – e.g. "search_web" */
    name: string;
    /** Short human summary – e.g. "Searched the web for 'CRM pricing 2026'" */
    summary?: ReactNode;
    /** Icon in the tile on the left – defaults to a wrench */
    icon?: ReactNode;
    status: ToolCallStatus;
    /** Arguments the tool was called with – objects are pretty-printed, JSON strings parsed */
    args?: unknown;
    /** What the tool returned – objects are pretty-printed, JSON strings parsed, other text shown as is */
    result?: unknown;
    /** Error message, shown when status is "error" */
    error?: string;
    /** When the call started (ms since epoch, e.g. Date.now()) – the live timer counts from here */
    startedAt?: number;
    /** Final duration in ms – otherwise measured while the card shows "running" */
    duration?: number;
    /** Start expanded (uncontrolled) */
    defaultOpen?: boolean;
    /** Expanded state (controlled) */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Opens the card when the call fails and closes it again on the next run, unless someone toggled it */
    openOnError?: boolean;
    /** Shows a Retry button next to the error */
    onRetry?: () => void;
    /** Height in px after which arguments and result are capped with a fade and "Show all" */
    maxCodeHeight?: number;
    className?: string;
};
export type ToolCallGroupProps = {
    /** ToolCallCard elements – the group reads their name, icon, status and duration */
    children: ReactNode;
    /** Label once all calls are done – defaults to "Used 3 tools" */
    label?: string;
    /** Label while any call is running */
    runningLabel?: string;
    /** Total duration in ms – otherwise the sum of the cards' durations, or the time measured while running */
    duration?: number;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
};
export declare function ToolCallCard({ name, summary, icon, status, args, result, error, startedAt, duration, defaultOpen, open: openProp, onOpenChange, openOnError, onRetry, maxCodeHeight, className, }: ToolCallCardProps): import("react").JSX.Element;
export declare function ToolCallGroup({ children, label, runningLabel, duration, defaultOpen, open: openProp, onOpenChange, className, }: ToolCallGroupProps): import("react").JSX.Element;
export default function Demo(): import("react").JSX.Element;
