export type ReactionKey = "like" | "comment" | "repost" | "share";
export type ReactionState = {
    count: number;
    active?: boolean;
};
export type ReactionBarProps = {
    /** Starting counts and whether each action is already taken */
    reactions?: Partial<Record<ReactionKey, ReactionState>>;
    /** Called after an action was toggled, with its new state */
    onReact?: (key: ReactionKey, state: Required<ReactionState>) => void;
    /** Hide actions you don't need */
    actions?: ReactionKey[];
    className?: string;
};
export declare function ReactionBar({ reactions, onReact, actions: actionsProp, className, }: ReactionBarProps): import("react").JSX.Element | null;
/** Working example; use the named ReactionBar export in your application. */
export default function Demo(): import("react").JSX.Element;
