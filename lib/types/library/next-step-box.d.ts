import * as React from "react";
/**
 * Next-step box — the box an agent leaves at the end of a turn: a two- or
 * three-sentence recap of what is now true, and, when the next move is the
 * person's call, one short question with one or two answer buttons (the first
 * is the agent's pick, drawn as primary). `blocked` marks that the work waits
 * on the answer. Thinking State original; a visible chain-of-thought action.
 *
 * Scenario (demo, no props): wrapping up → recap → question → answered.
 * All motion is off under prefers-reduced-motion.
 */
export type NextStepAction = {
    id: string;
    label: string;
    /** "app" = an app action (commit, create PR …); "reply" = sends the label as the answer. */
    kind?: "app" | "reply";
};
export type NextStepState = "wrapping" | "ready" | "answered";
export type NextStepBoxLabels = {
    title: string;
    wrapping: string;
    blocked: string;
    waiting: string;
    answered: string;
    undo: string;
};
export type NextStepBoxProps = {
    recap?: string;
    ask?: string;
    actions?: NextStepAction[];
    blocked?: boolean;
    /** Controlled state. With no recap and no state the demo scenario plays. */
    state?: NextStepState;
    /** Id of the chosen action when answered. */
    chosen?: string;
    onAction?: (action: NextStepAction) => void;
    labels?: Partial<NextStepBoxLabels>;
    className?: string;
};
export declare const nextStepBoxDemo: {
    recap: string;
    ask: string;
    actions: NextStepAction[];
    blocked: boolean;
};
export declare function NextStepBox({ recap: recapProp, ask, actions, blocked, state: stateProp, chosen: chosenProp, onAction, labels: labelsProp, className, }: NextStepBoxProps): React.JSX.Element;
export default NextStepBox;
