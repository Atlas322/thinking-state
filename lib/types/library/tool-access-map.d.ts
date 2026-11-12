import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type ToolCall = {
    id: string;
    status: "running" | "done" | "failed";
    input: unknown;
    output?: unknown;
    error?: string;
    /** ms since the run started */
    at?: number;
    duration?: number;
    replay?: boolean;
};
export type AccessTool = {
    id: string;
    name: string;
    icon?: React.ReactNode;
    description?: string;
};
export type AgentTool = {
    id: string;
    calls?: ToolCall[];
};
export type MapAgent = {
    id: string;
    name: string;
    model?: string;
    avatar?: React.ReactNode;
    status: "queued" | "running" | "waiting" | "done" | "failed";
    task?: string;
    tools: AgentTool[];
};
export type ToolAccessMapProps = {
    agents?: MapAgent[];
    tools?: AccessTool[];
    agent?: string;
    defaultAgent?: string;
    onAgentChange?: (id: string) => void;
    onReplay?: (call: ToolCall, input: unknown, tool: AccessTool, agent: MapAgent) => void;
    formatTime?: (ms: number) => string;
    title?: string;
    className?: string;
};
export declare function ToolAccessMap({ agents, tools: toolsProp, agent: agentProp, defaultAgent, onAgentChange, onReplay, formatTime, title, className, }: ToolAccessMapProps): React.JSX.Element;
export declare function Demo(): React.JSX.Element;
export default Demo;
