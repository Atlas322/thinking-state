import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type FindingSeverity = "critical" | "warning" | "note";
export type FindingAgent = {
    id: string;
    name: string;
    /** What the agent is doing right now. */
    step: string;
    done: number;
    total: number;
    status?: "running" | "done";
    icon?: "claude" | "openai" | "gemini" | React.ReactNode;
};
export type Finding = {
    id: string;
    title: string;
    severity: FindingSeverity;
    /** Agent id that found it. */
    agent: string;
    location?: string;
    /** Epoch ms when it was found. */
    at: number;
};
export type AgentFindingsProps = {
    agents?: FindingAgent[];
    findings?: Finding[];
    title?: string;
    rows?: number;
    now?: number;
    onOpen?: (finding: Finding) => void;
    className?: string;
    /** Demo only: keeps ticking progress and dropping in queued findings. */
    simulate?: boolean;
};
export declare function AgentFindings({ agents: agentsProp, findings: findingsProp, title, rows, now, onOpen, className, simulate, }: AgentFindingsProps): React.JSX.Element;
export default AgentFindings;
