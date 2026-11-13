import * as React from "react";
export type HandoffAgent = {
    id: string;
    name: string;
    model?: string;
    avatar?: React.ReactNode;
    description?: string;
    cost?: number;
};
export type HandoffItem = {
    id: string;
    label: string;
    kind?: "file" | "source" | "fact" | "decision" | "note";
    lost?: boolean;
    why?: string;
};
export type Handoff = {
    id: string;
    from: string;
    to: string;
    task: string;
    items: HandoffItem[];
};
export type HandoffTask = {
    id: string;
    title: string;
    logo?: React.ReactNode;
    status: "todo" | "working" | "done" | "warning";
    agent?: string;
    note?: string;
};
export type AgentHandoffProps = {
    agents?: HandoffAgent[];
    handoffs?: Handoff[];
    tasks?: HandoffTask[];
    onAssign?: (task: HandoffTask, agent: HandoffAgent) => void;
    onRestore?: (handoff: Handoff, item: HandoffItem) => void;
    className?: string;
};
export declare function AgentHandoff({ agents, handoffs, tasks, onAssign, onRestore, className, }: AgentHandoffProps): React.JSX.Element;
export default function Demo(): React.JSX.Element;
