import * as React from "react";
/**
 * Session Board — one project's agent sessions, PRs and deploys at a glance.
 * A header card (icon, name, status, owner, four counters that count up, link
 * chips) over collapsible groups (Projects / Areas / Resources / Finance /
 * ungrouped). Each session row has a state dot (running pulses), title, one
 * line, PR and state tags, and a running line under live sessions; child
 * sessions sit indented under their parent and fold away with it.
 * Three views of the same data: by group, by state (tabs) and as cards.
 * With `me` set, an All / Mine switch keeps the sessions `me` owns or is
 * shared on (owner OR sharedWith, as in the Just.Notion «my projects» view).
 * Input sessions may carry a vault/Notion `status` (in-progress, waiting,
 * completed, inbox, planning…) instead of `state`.
 * Original Thinking State component. Colours follow tokens/tokens.json
 * (bg, surface/2, border/default, text/*, accent/*, status/*).
 * Motion: rows arrive one after another, groups fold smoothly, counters count
 * up; all of it is off under prefers-reduced-motion.
 */
export type SessionState = "running" | "waiting" | "done" | "idle";
export type SessionPrState = "open" | "draft" | "merged" | "closed";
export type SessionBoardView = "groups" | "status" | "cards";
export type SessionTone = "green" | "amber" | "blue" | "red" | "gray";
export type SessionBoardSession = {
    id: string;
    title: string;
    /** One-line description of where the session is. */
    line?: string;
    state: SessionState;
    /** Group id; a missing or unknown id lands in the ungrouped group. */
    group?: string;
    /** Parent session id; the row is indented under its parent. */
    parent?: string;
    pr?: number | {
        number: number;
        state?: SessionPrState;
    };
    /** Vault `owner`; shown as initials. */
    owner?: string;
    /** Who else works on it (team / company sharing layer). */
    sharedWith?: string[];
};
/** What callers pass: `state`, or a vault/Notion `status` that maps onto it. */
export type SessionBoardInput = Omit<SessionBoardSession, "state"> & {
    state?: SessionState;
    status?: string;
};
/** Maps vault / Notion statuses onto the four session states. */
export declare function toSessionState(value?: string): SessionState;
export type SessionBoardGroup = {
    id: string;
    label: string;
    defaultCollapsed?: boolean;
};
export type SessionBoardLink = {
    label: string;
    href: string;
    kind?: "repo" | "prod" | "figma" | "link";
};
export type SessionBoardProject = {
    name: string;
    /** Emoji, letter or a node; defaults to the first letter of the name. */
    icon?: React.ReactNode;
    status?: {
        label: string;
        tone?: SessionTone;
    };
    owner?: string;
    stats?: {
        tasks?: number;
        decisions?: number;
        pages?: number;
        prs?: number;
    };
    links?: SessionBoardLink[];
};
export type SessionBoardLabels = {
    owner: string;
    tasks: string;
    decisions: string;
    pages: string;
    prs: string;
    ungrouped: string;
    sessions: string;
    session: string;
    empty: string;
    running: string;
    waiting: string;
    done: string;
    idle: string;
    links: string;
    pr: string;
    open: string;
    draft: string;
    merged: string;
    closed: string;
    view: string;
    groupsView: string;
    statusView: string;
    cardsView: string;
    subItem: string;
    subItems: string;
    collapseKids: string;
    expandKids: string;
    inParent: string;
    scope: string;
    all: string;
    mine: string;
    sharedWith: string;
};
export type SessionBoardProps = {
    project?: SessionBoardProject;
    groups?: SessionBoardGroup[];
    sessions?: SessionBoardInput[];
    /** The viewer; enables the All / Mine switch. */
    me?: string;
    scope?: "all" | "mine";
    defaultScope?: "all" | "mine";
    onScopeChange?: (scope: "all" | "mine") => void;
    onSessionClick?: (session: SessionBoardSession) => void;
    /** Controlled selection (highlighted row); defaults to the last clicked row. */
    selectedId?: string | null;
    /** Controlled view: by group, by state (tabs) or as cards. */
    view?: SessionBoardView;
    defaultView?: SessionBoardView;
    onViewChange?: (view: SessionBoardView) => void;
    /** Which views the switch offers (default all three); one view hides the switch. */
    views?: SessionBoardView[];
    labels?: Partial<SessionBoardLabels>;
    className?: string;
};
export declare const defaultSessionGroups: SessionBoardGroup[];
/** Demo data as plain JSON props (used by the catalog's data editor and chat export). */
export declare const sessionBoardDemo: {
    project: SessionBoardProject;
    groups: SessionBoardGroup[];
    sessions: SessionBoardSession[];
    me: string;
};
export declare function SessionBoard({ project, groups, sessions: sessionsIn, me, scope: scopeProp, defaultScope, onScopeChange, onSessionClick, selectedId: selectedProp, view: viewProp, defaultView, onViewChange, views, labels: labelsProp, className, }: SessionBoardProps): React.JSX.Element;
export default SessionBoard;
