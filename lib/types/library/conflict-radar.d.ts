import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type RadarAgent = {
    id: string;
    name: string;
    model?: string;
    branch?: string;
    icon?: "claude" | "openai" | "grok" | React.ReactNode;
    working?: boolean;
};
export type RadarEdit = {
    agent: string;
    lines: [number, number];
    writing?: boolean;
    /** For conflicts: this agent's way, in one sentence. */
    way?: string;
};
export type RadarFile = {
    path: string;
    edits: RadarEdit[];
};
export type ConflictRadarProps = {
    agents?: RadarAgent[];
    files?: RadarFile[];
    title?: string;
    resolved?: Record<string, string>;
    onResolve?: (path: string, agentId: string) => void;
    onMerge?: () => void;
    className?: string;
};
export declare function ConflictRadar({ agents, files, title, resolved: resolvedProp, onResolve, onMerge, className, }: ConflictRadarProps): React.JSX.Element;
export default ConflictRadar;
