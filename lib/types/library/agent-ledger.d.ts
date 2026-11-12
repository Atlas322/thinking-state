import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type LedgerEntry = {
    id: string;
    action: string;
    target?: string;
    system: string;
    icon?: React.ReactNode;
    at: number;
    change?: [React.ReactNode, React.ReactNode];
    detail?: React.ReactNode;
    reversible?: boolean;
    dependsOn?: string[];
};
export type AgentLedgerProps = {
    entries?: LedgerEntry[];
    agent?: string;
    now?: number;
    undone?: string[];
    defaultUndone?: string[];
    onUndo?: (ids: string[]) => void | Promise<void>;
    onRedo?: (ids: string[]) => void | Promise<void>;
    pointAt?: string | null;
    title?: string;
    className?: string;
};
export declare function AgentLedger({ entries, agent, now, undone, defaultUndone, onUndo, onRedo, pointAt, title, className, }: AgentLedgerProps): React.JSX.Element;
export default AgentLedger;
