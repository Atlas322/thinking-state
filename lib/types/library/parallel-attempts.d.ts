import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type Attempt = {
    id: string;
    name: string;
    approach: string;
    model?: string;
    icon?: React.ReactNode;
    status: "running" | "done" | "failed";
    progress?: number;
    step?: string;
    score?: number;
    note?: string;
    took?: string;
    cost?: number;
};
export type ParallelAttemptsProps = {
    attempts?: Attempt[];
    task?: string;
    picked?: string | null;
    onPick?: (attempt: Attempt) => void;
    formatCost?: (amount: number) => string;
    title?: string;
    className?: string;
};
export declare function ParallelAttempts({ attempts: attemptsProp, task, picked: pickedProp, onPick, formatCost, title, className, }: ParallelAttemptsProps): React.JSX.Element;
export default ParallelAttempts;
