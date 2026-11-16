import * as React from "react";
export type ContextBlock = {
    id: string;
    label: string;
    kind: "system" | "tools" | "memory" | "file" | "chat" | "result" | "summary";
    tokens: number;
    detail?: string;
    icon?: React.ReactNode;
    items?: {
        label: string;
        icon?: React.ReactNode;
    }[];
};
export type ContextAgent = {
    id: string;
    name: string;
    limit: number;
    model?: string;
    modelIcon?: React.ReactNode;
};
export type ContextCompaction = {
    before: ContextBlock[];
    summarized?: string[];
    dropped?: string[];
    summary?: string;
};
export type ContextMapProps = {
    blocks?: ContextBlock[];
    limit?: number;
    model?: string;
    modelIcon?: React.ReactNode;
    agents?: ContextAgent[];
    agent?: string;
    onAgentChange?: (id: string) => void;
    compaction?: ContextCompaction | null;
    view?: "before" | "after";
    onViewChange?: (view: "before" | "after") => void;
    status?: string;
    onSelect?: (block: ContextBlock | null) => void;
    title?: string;
    className?: string;
};
export declare function ContextMap({ blocks, limit, model, modelIcon, agents, agent, onAgentChange, compaction, view, onViewChange, status, onSelect, title, className, }: ContextMapProps): React.JSX.Element;
export default ContextMap;
