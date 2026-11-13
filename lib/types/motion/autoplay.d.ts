/**
 * <Autoplay script> — catalog preview driver (2026-11-13). Plays a short,
 * scripted "user" story on a component that otherwise renders still: clicks,
 * hovers, typing, key presses, each step a real UI state with the component's
 * own spring transitions. It rides on useScenario, so it plays only while in
 * view and visible, once, finishes inside UNCONTROLLED_MAX_MS (WCAG 2.2.2) and
 * under prefers-reduced-motion shows the untouched component.
 *
 * The component itself is not modified — it stays a single self-contained file.
 */
import * as React from "react";
export type AutoTarget = string | {
    sel: string;
    text?: string;
    nth?: number;
};
export type AutoStep = {
    /** ms to stay on this state after the action. */
    wait: number;
    click?: AutoTarget;
    hover?: AutoTarget;
    type?: {
        target: AutoTarget;
        text: string;
    };
    key?: {
        target?: AutoTarget;
        key: string;
    };
    /** Hide every match (they fade in later via `show`). */
    hide?: string;
    /** Reveal the next `count` still-hidden matches in DOM order, springing in. */
    show?: {
        sel: string;
        count?: number;
    };
    /** Choose option `index` of a native <select>. */
    pick?: {
        target: AutoTarget;
        index: number;
    };
};
export type AutoScript = AutoStep[];
export declare function Autoplay({ script, children }: {
    script: AutoScript;
    children: React.ReactNode;
}): React.JSX.Element;
