import * as React from "react";
/**
 * Independent implementation. One agent reply format from Second Brain OS:
 * Summary · Findings · Proposal · Outputs · Your choice · Sources (folded).
 * Choice buttons post the answer back to the agent; an own-answer field sits beside them.
 *
 * In a host chat that already draws the message (avatar, name, time) pass `bare`; a host that parses the reply
 * itself passes `sections` (its own titles and rendered bodies) and puts its own output previews in `children`.
 */
export type ReplyOutput = {
    label: string;
    kind?: "site" | "file" | "doc" | "image";
    href?: string;
};
export type ReplySource = {
    label: string;
    href?: string;
};
export type ReplyTone = "blue" | "green" | "amber" | "muted";
/** A host-defined section: its title, and its body already rendered (markdown, links…). */
export type ReplySectionItem = {
    title: string;
    /** Written to `data-reply-section`. */
    kind?: string;
    tone?: ReplyTone;
    /** Shown beside the title while folded. */
    count?: number;
    folded?: boolean;
    content: React.ReactNode;
};
export type AgentReplyProps = {
    /** No avatar and no name/time row — the host chat draws them. */
    bare?: boolean;
    agent?: string;
    avatar?: React.ReactNode;
    time?: string;
    summary?: React.ReactNode;
    findings?: React.ReactNode[];
    proposal?: React.ReactNode;
    /** Host-defined sections, after findings and proposal, in the given order. */
    sections?: ReplySectionItem[];
    outputs?: ReplyOutput[];
    choices?: string[];
    sources?: ReplySource[];
    labels?: Partial<Record<"findings" | "proposal" | "outputs" | "choices" | "sources" | "open" | "own" | "send", string>> & {
        answered?: string | ((choice: string) => string);
    };
    /** Called with the chosen option or own answer. Omit for a read-only reply. */
    onChoose?: (choice: string) => void | Promise<unknown>;
    onOpenOutput?: (output: ReplyOutput) => void;
    /** Host content between the sections and the choices (e.g. the host's own output previews). */
    children?: React.ReactNode;
    className?: string;
};
export declare function AgentReply({ bare, agent, avatar, time, summary, findings, proposal, sections, outputs, choices, sources, labels, onChoose, onOpenOutput, children, className, }: AgentReplyProps): React.JSX.Element;
export default function Demo(): React.JSX.Element;
