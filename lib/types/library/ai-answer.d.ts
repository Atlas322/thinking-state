import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type AnswerSource = {
    id: string;
    provider: string;
    title: string;
    url?: string;
    icon?: React.ReactNode;
};
/** Inline answer content: plain text, bold, or a citation chip. */
export type AnswerPart = string | {
    bold: string;
} | {
    cite: string[];
};
export type AnswerBlock = {
    kind: "p";
    parts: AnswerPart[];
} | {
    kind: "list";
    items: AnswerPart[][];
};
export type AIAnswerProps = {
    question?: string;
    sources?: AnswerSource[];
    answer?: AnswerBlock[];
    related?: string[];
    /** Seconds shown in the footer once streaming ends. */
    answeredIn?: number;
    /** Characters revealed per tick while streaming. */
    speed?: number;
    className?: string;
    onAction?: (action: "copy" | "regenerate" | "like" | "dislike" | "related" | "source", value?: string) => void;
};
export declare function AIAnswer({ question, sources, answer, related, answeredIn, speed, className, onAction, }: AIAnswerProps): React.JSX.Element;
export default AIAnswer;
