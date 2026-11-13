import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type StreamAgent = {
    id: string;
    name: string;
    color: string;
    /** Nine 0/1 cells of the 3x3 mark, read row by row. */
    mark?: number[];
};
export type StreamFile = {
    name: string;
    kind?: "folder" | "file" | "figma" | "link";
};
export type StreamDetails = {
    meta?: [label: string, value: string][];
    items?: {
        title: string;
        detail?: string;
        kind?: StreamFile["kind"] | "tool";
    }[];
};
/** Inline message content: text or a brand mention. */
export type StreamPart = string | {
    brand: "figma" | "notion" | "stripe";
    text: string;
} | {
    bold: string;
};
export type StreamMessage = {
    id: string;
    from: string;
    to?: string;
    time?: string;
    /** "event" renders a one-line system note; "writing" renders a live draft. */
    kind?: "message" | "handoff" | "question" | "event" | "writing";
    text?: StreamPart[] | string;
    /** The message this one answers, shown as a quote above the text. */
    quote?: string;
    files?: StreamFile[];
    tools?: string[];
    details?: StreamDetails;
};
export type CollaborationStreamProps = {
    agents?: StreamAgent[];
    messages?: StreamMessage[];
    /** Id of the person using the stream. */
    you?: string;
    live?: boolean;
    filter?: string;
    defaultFilter?: string;
    onFilterChange?: (filter: string) => void;
    onSend?: (message: {
        text: string;
        to?: string;
    }) => void;
    onOpenFile?: (file: StreamFile, message: StreamMessage) => void;
    placeholder?: string;
    className?: string;
};
export declare function CollaborationStream({ agents, messages, you, live, filter, defaultFilter, onFilterChange, onSend, onOpenFile, placeholder, className, }: CollaborationStreamProps): React.JSX.Element;
export default CollaborationStream;
