import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type GateDecision = "approved" | "edited" | "rejected";
export type DiffLine = {
    type: "add" | "remove" | "same";
    text: string;
};
export type ApprovalGate = {
    id: string;
    agent: string;
    avatar?: React.ReactNode;
    kind: "tool" | "file" | "agent" | "message";
    action: string;
    reason: string;
    status: "open" | GateDecision;
    at?: string;
    input?: string;
    diff?: {
        file: string;
        lines: DiffLine[];
    }[];
    files?: string[];
    context?: string[];
    holds?: string[];
    note?: string;
    /** Who the agent is, e.g. "Sub-agent". */
    role?: string;
    blocking?: boolean;
};
export type ApprovalGatesProps = {
    gates?: ApprovalGate[];
    task?: string;
    live?: boolean;
    onDecide?: (id: string, decision: GateDecision, value?: string) => void;
    title?: string;
    className?: string;
};
export declare function ApprovalGates({ gates: gatesProp, task, live, onDecide, title, className, }: ApprovalGatesProps): React.JSX.Element;
export default ApprovalGates;
