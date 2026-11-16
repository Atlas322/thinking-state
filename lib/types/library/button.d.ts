import { type ComponentPropsWithRef, type ReactNode } from "react";
export type ButtonProps = ComponentPropsWithRef<"button"> & {
    /** primary: a dark chip · secondary: white with a hairline shadow · ghost: text only · destructive: a light red fill, for deleting */
    variant?: "primary" | "secondary" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
    /** Shows a shimmer over the label and blocks clicks */
    loading?: boolean;
    /** Icon before the label, e.g. an inline SVG */
    icon?: ReactNode;
    /** Icon after the label */
    iconRight?: ReactNode;
};
export declare function Button({ variant, size, loading, icon, iconRight, children, className, disabled, onClick, onPointerEnter, type, ref, ...rest }: ButtonProps): React.JSX.Element;
import * as React from "react";
/** Working example; use the named Button export in your application. */
export default function Demo(): React.JSX.Element;
