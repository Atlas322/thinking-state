import { type ReactNode, type Ref } from "react";
export type TagInputProps = {
    /** The chips – makes it controlled */
    value?: string[];
    defaultValue?: string[];
    onChange?: (tags: string[]) => void;
    /** Shown above the field and tied to it */
    label?: ReactNode;
    /** A quiet line under the field – a message takes its place while there is one */
    hint?: ReactNode;
    /** Marks the field invalid and shows this under it */
    error?: ReactNode;
    /** "Optional" next to the label */
    optional?: boolean;
    placeholder?: string;
    /** Checks a value before it becomes a chip: true to accept, or a message that says what's wrong */
    validate?: (tag: string) => true | string;
    /** Cleans a value before it's checked, e.g. trims and lowercases an email (default: trim) */
    normalize?: (tag: string) => string;
    /** Also split on spaces – right for emails and single words, wrong for names with spaces */
    splitOnSpace?: boolean;
    /** At most this many chips */
    max?: number;
    /** A small circle with the first letter on every chip, e.g. for people */
    avatar?: boolean;
    disabled?: boolean;
    /** Sends the chips with a form, as one hidden input per chip */
    name?: string;
    id?: string;
    className?: string;
    "aria-label"?: string;
    ref?: Ref<HTMLInputElement>;
};
export declare function TagInput({ value, defaultValue, onChange, label, hint, error, optional, placeholder, validate, normalize, splitOnSpace, max, avatar, disabled, name, id, className, "aria-label": ariaLabel, ref, }: TagInputProps): import("react").JSX.Element;
/** Working example; use the named TagInput export in your application. */
export default function Demo(): import("react").JSX.Element;
