import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type CursorAgent = {
    id: string;
    name: string;
    color?: string;
    cost?: number;
    avatar?: React.ReactNode;
};
export type DocSuggestion = {
    id: string;
    agent: string;
    block: string;
    at: number;
    remove?: string;
    insert?: string;
    note?: string;
};
export type DocBlock = {
    id: string;
    kind?: "title" | "heading" | "paragraph" | "item" | "code" | "image";
    text?: string;
    float?: "left" | "right";
};
export type AgentCursor = {
    block: string;
    at?: number;
    doing?: string;
    typing?: boolean;
} | null;
export type DocComment = {
    id: string;
    agent: string;
    block: string;
    text: string;
};
export type AgentCursorsProps = {
    title?: string;
    agents?: CursorAgent[];
    blocks?: DocBlock[];
    suggestions?: DocSuggestion[];
    cursors?: Record<string, AgentCursor>;
    comments?: DocComment[];
    tabs?: {
        id: string;
        label: string;
    }[];
    tab?: string;
    onTabChange?: (id: string) => void;
    following?: string | null;
    onFollowingChange?: (id: string | null) => void;
    onAccept?: (s: DocSuggestion) => void;
    onReject?: (s: DocSuggestion) => void;
    onAcceptAll?: () => void;
    onResolveComment?: (c: DocComment) => void;
    formatCost?: (n: number) => string;
    height?: number;
    className?: string;
};
export declare function AgentCursors({ title, agents, blocks, suggestions: suggestionsProp, cursors, comments: commentsProp, tabs, tab: tabProp, onTabChange, following: followingProp, onFollowingChange, onAccept, onReject, onAcceptAll, onResolveComment, formatCost, height, className, }: AgentCursorsProps): React.JSX.Element;
export default AgentCursors;
