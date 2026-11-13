import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type RunLogo = "github" | "notion" | "slack" | "linear" | "drive" | React.ReactNode;
export type RunStat = {
    icon: "file" | "pr" | "check" | "comment" | "link";
    value: number;
};
export type ScheduledTask = {
    id: string;
    title: string;
    usage: number;
    agent?: string;
    detail?: string;
    logo?: RunLogo;
    stats?: RunStat[];
    at?: {
        day: number;
        session: number;
    };
};
export type ScheduledPart = {
    task: ScheduledTask;
    day: number;
    session: number;
    usage: number;
    part: number;
    parts: number;
};
export type RunAgent = {
    name: string;
    logo?: React.ReactNode;
};
export type ScheduledRunsProps = {
    tasks?: ScheduledTask[];
    days?: (string | {
        name: string;
        date?: string | number;
    })[];
    sessions?: string[];
    now?: {
        day: number;
        session: number;
    };
    limit?: number;
    minPiece?: number;
    agents?: RunAgent[];
    defaultMode?: "auto" | "manual";
    autoRun?: boolean | number;
    title?: string;
    note?: string;
    onScheduled?: (parts: ScheduledPart[]) => void;
    onPlace?: (task: ScheduledTask, parts: ScheduledPart[]) => void;
    onMove?: (part: ScheduledPart, to: {
        day: number;
        session: number;
    }) => void;
    className?: string;
};
export declare function ScheduledRuns({ tasks, days, sessions, now, limit, minPiece, agents, defaultMode, autoRun, title, note, onScheduled, onPlace, onMove, className, }: ScheduledRunsProps): React.JSX.Element;
export default ScheduledRuns;
