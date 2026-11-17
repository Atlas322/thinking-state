import { type ReactNode } from "react";
export type Tip = {
    id: string;
    title: string;
    /** Short explanation – may contain a <Kbd> */
    description: ReactNode;
    /** Button text */
    action: string;
    /** Text after the action was taken, e.g. "Enabled" */
    doneLabel?: string;
    /** Shows the action as the dark button – use once for the most important tip */
    primary?: boolean;
    onAction?: () => void;
};
export type TipsPanelProps = {
    title?: string;
    tips: Tip[];
    /** Shows the Close button in the footer */
    onClose?: () => void;
    closeLabel?: string;
    className?: string;
};
export declare function TipsPanel({ title, tips, onClose, closeLabel, className, }: TipsPanelProps): import("react").JSX.Element;
/** Keyboard key for tip descriptions, e.g. <Kbd>⌘K</Kbd> */
export declare const Kbd: ({ children }: {
    children: ReactNode;
}) => import("react").JSX.Element;
export default function Demo(): import("react").JSX.Element;
