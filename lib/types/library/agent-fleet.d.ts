import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type FleetStatus = "queued" | "running" | "waiting" | "done" | "failed" | "stopped";
export type FleetTool = "github" | "notion" | "slack" | "figma" | "linear" | "zendesk";
export type FleetStep = {
    title: string;
    status?: FleetStatus;
    tool?: FleetTool;
    took?: string;
};
export type FleetAgent = {
    id: string;
    name: string;
    task: string;
    model?: string;
    avatar?: "anthropic" | "openai" | "gemini" | React.ReactNode;
    tools?: FleetTool[];
    status: FleetStatus;
    steps?: FleetStep[];
    cost?: number;
    /** Elapsed seconds. */
    took?: number;
    ask?: string;
    error?: string;
    children?: FleetAgent[];
};
export type AgentFleetProps = {
    agents?: FleetAgent[];
    open?: string | null;
    defaultOpen?: string | null;
    onOpenChange?: (id: string | null) => void;
    onResolve?: (agent: FleetAgent, action: "approve" | "reject" | "retry" | "dismiss") => void;
    onSelect?: (agent: FleetAgent) => void;
    title?: string;
    className?: string;
};
/** `cost` is spend in thousands of tokens. `model` holds a generic agent role. */
/** The built-in ac.me demo team (made-up). Exported so an entry can decorate it, e.g. with role avatars. */
export declare const fleetDemoAgents: FleetAgent[];
export declare function AgentFleet({ agents, open, defaultOpen, onOpenChange, onResolve, onSelect, title, className, }: AgentFleetProps): React.JSX.Element;
export default AgentFleet;
/** Demo props (screens.19): the built-in ac.me defaults are the demo, so it is empty on purpose. */
export declare const agentFleetDemo: React.ComponentProps<typeof AgentFleet>;
