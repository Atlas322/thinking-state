import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type FanoutStatus = "queued" | "running" | "retrying" | "done" | "failed";
export type FanoutTask = {
    id: string;
    label: string;
    status: FanoutStatus;
    worker?: string;
    start?: number;
    end?: number;
    cost?: number;
    attempts?: number;
    result?: string;
    error?: string;
};
export type FanoutGridProps = {
    tasks?: FanoutTask[];
    job?: string;
    workers?: number;
    now?: number;
    onRetry?: (ids: string[]) => void;
    onSelect?: (task: FanoutTask | null) => void;
    formatCost?: (amount: number) => string;
    title?: string;
    icon?: React.ReactNode;
    className?: string;
};
export declare function FanoutGrid({ tasks: tasksIn, job, workers, now: nowIn, onRetry, onSelect, formatCost, title, icon, className, }: FanoutGridProps): React.JSX.Element;
export { FanoutGrid as FanOutGrid };
export default FanoutGrid;
