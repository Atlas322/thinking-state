import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type ContextItem = {
    id: string;
    label: string;
    tokens: number;
};
export type ContextPart = {
    id: string;
    label: string;
    tokens?: number;
    items?: ContextItem[];
    locked?: boolean;
    /** Share the part shrinks to when compacted (0–1), or true for 0.25. */
    compact?: boolean | number;
    color?: string;
};
export type ContextWindowProps = {
    parts?: ContextPart[];
    limit?: number;
    title?: string;
    model?: string;
    modelIcon?: React.ReactNode;
    onRemoveItem?: (partId: string, itemId: string) => void;
    onCompact?: (partId: string) => void | Promise<void>;
    action?: {
        label: string;
        onClick: () => void;
    };
    warnAt?: number;
    cells?: number;
    columns?: number;
    /** Tokens saved so far, shown in the last row. */
    saved?: number;
    className?: string;
};
export declare function ContextWindow({ parts: partsProp, limit, title, model, modelIcon, onRemoveItem, onCompact, action, warnAt, cells, columns, saved: savedProp, className, }: ContextWindowProps): React.JSX.Element;
export default ContextWindow;
