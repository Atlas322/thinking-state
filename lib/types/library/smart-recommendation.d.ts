import { type ReactNode } from "react";
export type Recommendation = {
    id: string;
    /** Short name, used in the accept button, e.g. "Incremental sync" */
    label: string;
    /** One sentence why – shown in the card */
    reason: ReactNode;
    /** 0 = no signal, 1 = weak, 2 = good, 3 = strong */
    signal: 0 | 1 | 2 | 3;
};
export type SmartRecommendationProps = {
    title?: string;
    /** First entry is the recommendation, the rest are offered as alternatives */
    options: Recommendation[];
    onAccept?: (option: Recommendation) => void;
    onUndo?: (option: Recommendation) => void;
    defaultOpen?: boolean;
    className?: string;
};
export declare function SmartRecommendation({ title, options, onAccept, onUndo, defaultOpen, className, }: SmartRecommendationProps): import("react").JSX.Element | null;
/** Working example; use the named SmartRecommendation export in your application. */
export default function Demo(): import("react").JSX.Element;
