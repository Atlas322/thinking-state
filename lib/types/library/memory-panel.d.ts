import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type Memory = {
    id: string;
    text: string;
    category: string;
    source?: string;
    date?: string;
    paused?: boolean;
};
export type MemoryPanelProps = {
    memories?: Memory[];
    onChange?: (memories: Memory[]) => void;
    onAdd?: (memory: Memory) => void;
    onEdit?: (id: string, text: string) => void;
    onPause?: (id: string, paused: boolean) => void;
    onForget?: (id: string) => void;
    onRestore?: (memory: Memory) => void;
    enabled?: boolean;
    defaultEnabled?: boolean;
    onEnabledChange?: (enabled: boolean) => void;
    categories?: string[];
    title?: string;
    maxHeight?: number;
    undoFor?: number;
    addedSource?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
};
export declare function MemoryPanel({ memories: memoriesProp, onChange, onAdd, onEdit, onPause, onForget, onRestore, enabled: enabledProp, defaultEnabled, onEnabledChange, categories: categoriesProp, title, maxHeight, undoFor, addedSource, action, className, }: MemoryPanelProps): React.JSX.Element;
export default MemoryPanel;
