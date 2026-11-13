import * as React from "react";
/** Independently implemented from the public preview. No affectUI Pro source. */
export type AgentTask = {
    id: string;
    title: string;
    description?: string;
    agent: string;
    status: "waiting" | "running" | "done" | "failed";
    /** Unix timestamp in milliseconds; running and waiting clocks tick from it. */
    startedAt?: number;
    /** Finished duration in milliseconds. */
    elapsed?: number;
    /** @deprecated Use startedAt or elapsed. Retained for existing consumers. */
    elapsedSeconds?: number;
    sources?: number;
    tools?: number;
    steps?: {
        label: string;
        time?: string;
    }[];
};
export type AgentInboxView = "board" | "list";
export type AgentInboxProps = {
    tasks?: AgentTask[];
    title?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    view?: AgentInboxView;
    defaultView?: AgentInboxView;
    onViewChange?: (view: AgentInboxView) => void;
    onApprove?: (task: AgentTask) => void;
    onReject?: (task: AgentTask) => void;
    onRetry?: (task: AgentTask) => void;
    onOpen?: (task: AgentTask) => void;
    className?: string;
};
export declare function AgentInbox({ tasks, title, action, view, defaultView, onViewChange, onApprove, onReject, onRetry, onOpen, className, }: AgentInboxProps): React.JSX.Element;
export default AgentInbox;
