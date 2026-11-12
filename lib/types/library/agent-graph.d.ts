import * as React from "react";
/** Independent implementation of the public contract; no affectUI Pro source. */
export type GraphNode = {
    id: string;
    name: string;
    kind: "agent" | "tool" | "user";
    short?: string;
    icon?: React.ReactNode;
    detail?: string;
    doing?: string;
    status?: "idle" | "working" | "waiting" | "error" | "done";
    cost?: number;
    lead?: boolean;
    /** Optional normalized canvas position for a fixed composition (0–1). */
    position?: {
        x: number;
        y: number;
    };
};
export type GraphCall = {
    id: string;
    from: string;
    to: string;
    at: number;
    status?: "pending" | "ok" | "error";
    label?: string;
    ms?: number;
};
export type AgentGraphProps = {
    nodes?: GraphNode[];
    calls?: GraphCall[];
    edges?: [string, string][];
    now?: number;
    heatWindow?: number;
    onSelect?: (node: GraphNode | null) => void;
    height?: number;
    formatCost?: (amount: number) => string;
    title?: string;
    className?: string;
};
export declare function AgentGraph({ nodes, calls, edges, now, heatWindow, onSelect, height, formatCost, title, className, }: AgentGraphProps): React.JSX.Element;
declare const graphBrandPaths: {
    claude: string;
    openai: string;
    googlegemini: string;
    stripe: string;
    notion: string;
    github: string;
    hubspot: string;
};
export declare function GraphBrandIcon({ brand, }: {
    brand: keyof typeof graphBrandPaths | "slack" | "search" | "database" | "you";
}): React.JSX.Element;
export default function Demo(): React.JSX.Element;
export {};
