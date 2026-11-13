import { type ComponentPropsWithRef, type ReactNode } from "react";
export type TextFieldProps = Omit<ComponentPropsWithRef<"input">, "size" | "prefix"> & {
    /** Shown above the field and tied to it */
    label?: ReactNode;
    /** A quiet line under the field – the error takes its place while there is one */
    hint?: ReactNode;
    /** Marks the field invalid and shows this under it, in place of the hint */
    error?: ReactNode;
    /** Text or an icon inside the field, before the value – e.g. "https://" or a search icon */
    prefix?: ReactNode;
    /** Text or an icon inside the field, after the value – e.g. ".acme.app" or "USD" */
    suffix?: ReactNode;
    /** sm 28 · md 32 · lg 36 high */
    size?: "sm" | "md" | "lg";
    /** "Optional" next to the label */
    optional?: boolean;
    /** A small × that empties the field while it has a value */
    clearable?: boolean;
    /** A copy button – for API keys, links and IDs, usually with readOnly */
    copyable?: boolean;
    /** Shows "12/40" under the field; needs maxLength */
    counter?: boolean;
    /** Called after the × emptied the field (onChange fires too) */
    onClear?: () => void;
    /** Extra class on the input itself; className goes on the wrapper */
    inputClassName?: string;
};
export declare function TextField({ label, hint, error, prefix, suffix, size, optional, clearable, copyable, counter, onClear, onKeyDown, className, inputClassName, id, type, value, defaultValue, onChange, disabled, readOnly, maxLength, ref, "aria-describedby": describedBy, ...rest }: TextFieldProps): import("react").JSX.Element;
/** Working example; use the named TextField export in your application. */
export default function Demo(): import("react").JSX.Element;
