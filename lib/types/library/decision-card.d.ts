import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type DecisionOption = {
    id: string;
    title: string;
    summary?: string;
    recommended?: boolean;
    preview?: React.ReactNode;
    blocks?: string[];
};
export type Decision = {
    id: string;
    question: string;
    task?: string;
    kind?: "decision" | "pick" | "approval";
    options?: DecisionOption[];
    facts?: {
        label: string;
        value: string;
    }[];
};
export type DecisionAnswer = {
    option: string;
} | {
    text: string;
} | "approve" | "decline";
export type DecisionCardLabels = {
    needsYou: string;
    later: string;
    show: string;
    recommended: string;
    approve: string;
    decline: string;
    own: string;
    waiting: (n: number) => string;
    of: (i: number, n: number) => string;
    close: string;
    closeReason: string;
    confirmClose: string;
    cancel: string;
};
export type DecisionCardProps = {
    decisions?: Decision[];
    onDecide?: (id: string, answer: DecisionAnswer) => void;
    onLater?: (id: string) => void;
    defaultFolded?: boolean;
    reveal?: number;
    labels?: Partial<DecisionCardLabels>;
    className?: string;
    /** Host mode: the card stays after an answer (the host removes it when its request succeeds) and the question is not clamped. */
    host?: boolean;
    /** Host mode: a request is in flight — answers are ignored. */
    busy?: boolean;
    error?: React.ReactNode;
    /** Host content under the question (links, who asked). */
    meta?: React.ReactNode;
    /** Shows a close action; the field then takes an optional reason. */
    onClose?: (id: string, reason: string) => void;
};
export declare function DecisionCard({ decisions, onDecide, onLater, defaultFolded, reveal, labels: labelsProp, className, host, busy, error, meta, onClose, }: DecisionCardProps): React.JSX.Element;
/** Demo: the card sitting just above a chat composer. */
export declare function DecisionCardDemo(): React.JSX.Element;
export default DecisionCardDemo;
