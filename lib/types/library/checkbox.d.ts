import { type ComponentPropsWithRef, type ReactNode } from "react";
export type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "type" | "size"> & {
    /** Shown next to the box; clicking it toggles */
    label?: ReactNode;
    /** A quiet second line under the label */
    description?: ReactNode;
    /** "Some of them" – a dash instead of the check, e.g. for Select all */
    indeterminate?: boolean;
    /** Marks it invalid and shows this under it */
    error?: ReactNode;
    /** plain: the box and its text · card: a bordered row that is clickable as a whole and lights up when checked */
    variant?: "plain" | "card";
};
export declare function Checkbox({ label, description, indeterminate, error, variant, className, id, disabled, ref, "aria-describedby": describedBy, ...rest }: CheckboxProps): React.JSX.Element;
import * as React from "react";
/** Working example; use the named Checkbox export in your application. */
export default function Demo(): React.JSX.Element;
