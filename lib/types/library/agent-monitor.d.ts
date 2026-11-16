import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type AgentRunState = "idle" | "running" | "waiting" | "paused" | "finished" | "failed" | "cancelled";
export type StepKind = "read" | "search" | "edit" | "run" | "think" | "web";
export type AgentRunStep = {
    id: string;
    label: string;
    kind?: StepKind;
    icon?: React.ReactNode;
    state: "queued" | "running" | "done" | "failed";
    since?: number;
    /** ms */
    took?: number;
    tool?: string;
    detail?: string;
    output?: string;
};
export type AgentMonitorProps = {
    state?: AgentRunState;
    agent?: {
        name: string;
        role?: string;
        mark?: React.ReactNode;
    };
    steps?: AgentRunStep[];
    current?: {
        label: string;
        kind?: StepKind;
        icon?: React.ReactNode;
    };
    since?: number;
    until?: number;
    pausedFor?: number;
    cost?: number;
    ask?: {
        title: string;
        command?: string;
        icon?: React.ReactNode;
    };
    outcome?: {
        added?: number;
        removed?: number;
        files?: number;
        note?: string;
    };
    error?: string;
    onAllow?: () => void;
    onDecline?: () => void;
    onPause?: () => void;
    onResume?: () => void;
    onCancel?: () => void;
    onRetry?: () => void;
    onOpenLog?: () => void;
    defaultFolded?: boolean;
    className?: string;
};
/** Neutral glyphs, no brand marks. Keys kept for API compatibility. */
export declare const monitorIcons: {
    claude: React.JSX.Element;
    notion: React.JSX.Element;
    github: React.JSX.Element;
    linear: React.JSX.Element;
    terminal: React.JSX.Element;
};
export declare function AgentMonitor({ state: stateProp, agent, steps, current, since, until, pausedFor, cost, ask, outcome, error, onAllow, onDecline, onPause, onResume, onCancel, onRetry, onOpenLog, defaultFolded, className, }: AgentMonitorProps): React.JSX.Element;
export default AgentMonitor;
