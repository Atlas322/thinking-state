/**
 * Swipe Row — source: React Bits (https://reactbits.dev), MIT + Commons Clause.
 * Changes: CSS inlined through <style>, the Hugeicons delete glyph replaced by an inline SVG
 * (no icon package needed), named export added, local example appended. Dependency: motion.
 */
import * as React from "react";
export type SwipeAction = {
    id: string;
    label: string;
    icon?: React.ReactNode;
    color?: string;
    dismiss?: boolean;
    onSelect?: () => void;
};
export type SwipeRowProps = {
    children?: React.ReactNode;
    actions?: SwipeAction[];
    actionColor?: string;
    drawerColor?: string;
    rowColor?: string;
    textColor?: string;
    height?: number;
    radius?: number;
    actionWidth?: number;
    direction?: "left" | "right";
    snapBounce?: number;
    resistance?: number;
    collapseMs?: number;
    commitAt?: number;
    fullSwipe?: boolean;
    disabled?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAction?: (action: SwipeAction) => void;
    onCommit?: (action: SwipeAction) => void;
    closeOnAction?: boolean;
    haptic?: boolean;
    label?: string;
    className?: string;
    style?: React.CSSProperties;
};
export declare function SwipeRow({ children, actions, actionColor, drawerColor, rowColor, textColor, height, radius, actionWidth, direction, snapBounce, resistance, collapseMs, commitAt, fullSwipe, disabled, open: openProp, onOpenChange, onAction, onCommit, closeOnAction, haptic, label, className, style, }: SwipeRowProps): React.JSX.Element;
export default function Demo(): React.JSX.Element;
