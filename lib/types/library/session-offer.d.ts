import * as React from "react";
/**
 * Session Offer — the card an agent shows when a piece of work should run in
 * its own session: title, a short brief, the context it starts with (a fork of
 * this chat, or fresh) and where it runs. As an offer it asks «New session /
 * Do it here»; as the agent's own proposal it is a task card the person may
 * start or dismiss. States: offered → starting → started, or dismissed / here.
 * Thinking State original; a visible chain-of-thought action.
 */
export type SessionOfferState = "offered" | "starting" | "started" | "dismissed" | "here";
export type SessionOfferInitiation = "offer" | "own_initiative" | "user_asked";
export type SessionOfferChoice = "new" | "here" | "dismiss";
export type SessionOfferLabels = {
    offer: string;
    proposal: string;
    asked: string;
    fork: string;
    fresh: string;
    newSession: string;
    doHere: string;
    start: string;
    dismiss: string;
    starting: string;
    started: string;
    dismissed: string;
    here: string;
    open: string;
};
export type SessionOfferProps = {
    title?: string;
    brief?: string;
    initiation?: SessionOfferInitiation;
    context?: "fork" | "fresh";
    /** Where it runs: a worktree branch, a folder, «cloud» … */
    where?: string;
    /** Short name the new session gets once started. */
    name?: string;
    /** Controlled state. With no title and no state the demo scenario plays. */
    state?: SessionOfferState;
    onChoose?: (choice: SessionOfferChoice) => void;
    onOpen?: () => void;
    labels?: Partial<SessionOfferLabels>;
    className?: string;
};
export declare const sessionOfferDemo: {
    title: string;
    brief: string;
    initiation: SessionOfferInitiation;
    context: "fresh";
    where: string;
    name: string;
};
export declare function SessionOffer({ title: titleProp, brief, initiation, context, where, name, state: stateProp, onChoose, onOpen, labels: labelsProp, className, }: SessionOfferProps): React.JSX.Element;
export default SessionOffer;
