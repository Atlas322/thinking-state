import * as React from "react";
/**
 * Decision Inbox · Chat — the compact version of the Decision Inbox for an
 * agent's chat. One card, a count, and one row per open decision: the
 * question, its project and due date, a short context line and the options
 * as buttons (the recommended one is marked). Choosing an option folds the
 * row to «Chosen: …» with an undo, and sends the answer back to the chat.
 * Original Thinking State chat widget. Colours follow tokens/tokens.json.
 * Data comes in as plain JSON props.
 * With `me` set, an All / Mine switch keeps only decisions `me` owns or is
 * shared on (owner OR sharedWith). Item fields follow the vault frontmatter
 * (project, due, owner).
 * Motion: rows arrive one after another, a chosen row settles with a check;
 * all of it is off under prefers-reduced-motion.
 */
export type DecisionChatOption = {
    id: string;
    label: string;
    /** Marks the agent's recommendation. */
    recommended?: boolean;
};
export type DecisionChatItem = {
    id: string;
    title: string;
    context?: string;
    project?: string;
    due?: string;
    urgent?: boolean;
    /** Who decides (vault `owner`). */
    owner?: string;
    /** Who else sees it (team / company sharing layer). */
    sharedWith?: string[];
    options: DecisionChatOption[];
};
export type DecisionInboxChatData = {
    title?: string;
    decisions?: DecisionChatItem[];
    /** The viewer; enables the All / Mine switch. */
    me?: string;
};
export type DecisionInboxChatLabels = {
    title: string;
    open: string;
    allDone: string;
    chosen: string;
    undo: string;
    recommended: string;
    urgent: string;
    due: string;
    scope: string;
    all: string;
    mine: string;
};
export type DecisionInboxChatProps = DecisionInboxChatData & {
    /** Controlled answers by decision id; defaults to internal state. */
    chosen?: Record<string, string>;
    scope?: "all" | "mine";
    defaultScope?: "all" | "mine";
    onScopeChange?: (scope: "all" | "mine") => void;
    onDecide?: (decision: DecisionChatItem, option: DecisionChatOption | null) => void;
    labels?: Partial<DecisionInboxChatLabels>;
    className?: string;
};
export declare const decisionInboxChatDemo: DecisionInboxChatData;
export declare function DecisionInboxChat({ title, decisions, chosen: chosenProp, me, scope: scopeProp, defaultScope, onScopeChange, onDecide, labels: labelsProp, className, }: DecisionInboxChatProps): React.JSX.Element;
export default DecisionInboxChat;
