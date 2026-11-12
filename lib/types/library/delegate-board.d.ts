import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type DelegateAgent = {
    id: string;
    name: string;
    model?: string;
    /** Optional role, shown as a small muted line under the name. */
    role?: string;
    avatar?: React.ReactNode;
    /** Minutes left on the task it runs now. */
    current?: number;
    /** Cost per minute of work. */
    rate?: number;
};
export type DelegateTask = {
    id: string;
    title: string;
    /** Minutes. Optional: when absent nothing is shown and totals skip it. */
    estimate?: number;
    tools?: React.ReactNode[];
    agentId?: string | null;
};
export type DelegateMode = "auto" | "manual";
export type DelegateBoardProps = {
    title?: string;
    agents?: DelegateAgent[];
    tasks?: DelegateTask[];
    onAssign?: (taskId: string, agentId: string | null) => void;
    mode?: DelegateMode;
    defaultMode?: DelegateMode;
    onModeChange?: (mode: DelegateMode) => void;
    suggestion?: {
        taskId: string;
        agentId: string;
    } | null;
    now?: number;
    formatCost?: (amount: number) => string;
    className?: string;
};
export declare function DelegateBoard({ title, agents, tasks: tasksProp, onAssign, mode: modeProp, defaultMode, onModeChange, suggestion, now: nowProp, formatCost, className, }: DelegateBoardProps): React.JSX.Element;
export default DelegateBoard;
