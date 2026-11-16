export type Decision = {
    id: string;
    title: string;
    /** Short context under the title */
    detail?: string;
    /** Main answer, shown as the dark button */
    primary: string;
    /** Other answer, shown as the light button */
    secondary: string;
    /** Starts folded to one muted line – click to open */
    collapsed?: boolean;
};
export type DecisionInboxProps = {
    decisions: Decision[];
    /** Called with the decision and the chosen answer */
    onDecide?: (decision: Decision, answer: "primary" | "secondary") => void;
    className?: string;
};
export declare function DecisionInbox({ decisions, onDecide, className, }: DecisionInboxProps): import("react").JSX.Element;
/** Working example; use the named DecisionInbox export in your application. */
export default function Demo(): import("react").JSX.Element;
