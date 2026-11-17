import { type ComponentPropsWithRef, type ReactNode } from "react";
export type TextAreaProps = Omit<ComponentPropsWithRef<"textarea">, "rows"> & {
    /** Shown above the field and tied to it */
    label?: ReactNode;
    /** A quiet line under the field – the error takes its place while there is one */
    hint?: ReactNode;
    /** Marks the field invalid and shows this under it, in place of the hint */
    error?: ReactNode;
    /** "Заавал биш" next to the label */
    optional?: boolean;
    /** Shows "120/2000" under the field; needs maxLength */
    counter?: boolean;
    /** Height when empty, in lines */
    minRows?: number;
    /** It grows with the text up to this many lines, then scrolls */
    maxRows?: number;
    /** A small button in the corner that gives the field more room (expandedRows) and back */
    expandable?: boolean;
    /** Lines while expanded */
    expandedRows?: number;
    /** Controls the expanded state from outside */
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    /** ⌘/Ctrl+Enter – e.g. save or send without leaving the keyboard */
    onSubmitShortcut?: (value: string) => void;
    /** Extra class on the textarea itself; className goes on the wrapper */
    inputClassName?: string;
};
export declare function TextArea({ label, hint, error, optional, counter, minRows, maxRows, expandable, expandedRows, expanded: expandedProp, onExpandedChange, onSubmitShortcut, className, inputClassName, id, value, defaultValue, onChange, onKeyDown, disabled, readOnly, maxLength, ref, "aria-describedby": describedBy, ...rest }: TextAreaProps): import("react").JSX.Element;
/** Working example; use the named TextArea export in your application. */
export default function Demo(): import("react").JSX.Element;
