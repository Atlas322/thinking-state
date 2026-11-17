import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type Checkpoint = {
    id: string;
    title: string;
    icon?: React.ReactNode;
    parent?: string;
    status?: "running" | "done" | "failed" | "stopped";
    /** ms since the run began */
    at?: number;
    files?: number;
    cost?: number;
};
export type AgentCheckpointsProps = {
    checkpoints?: Checkpoint[];
    head?: string;
    onRewind?: (checkpoint: Checkpoint) => void;
    task?: string;
    formatTime?: (ms: number) => string;
    formatCost?: (amount: number) => string;
    title?: string;
    className?: string;
};
/** Neutral glyphs, no brand marks. Keys kept for API compatibility. */
export declare const checkpointIcons: {
    slack: React.JSX.Element;
    github: React.JSX.Element;
    notion: React.JSX.Element;
    figma: React.JSX.Element;
    stripe: React.JSX.Element;
};
export declare function AgentCheckpoints({ checkpoints, head, onRewind, task, formatTime, formatCost, title, className, }: AgentCheckpointsProps): React.JSX.Element;
export default AgentCheckpoints;
