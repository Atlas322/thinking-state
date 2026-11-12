import { type ReactNode, type Ref } from "react";
export type SelectOption = {
    value: string;
    label: string;
    /** A quiet second line under the label */
    description?: string;
    /** A 16px icon before the label, e.g. an inline SVG */
    icon?: ReactNode;
    disabled?: boolean;
};
export type SelectProps = {
    options: SelectOption[];
    /** The chosen value – makes it controlled */
    value?: string | null;
    defaultValue?: string | null;
    onChange?: (value: string, option: SelectOption) => void;
    /** Shown while nothing is chosen */
    placeholder?: string;
    /** Shown above the field and tied to it */
    label?: ReactNode;
    /** A quiet line under the field – the error takes its place while there is one */
    hint?: ReactNode;
    /** Marks the field invalid and shows this under it, in place of the hint */
    error?: ReactNode;
    /** "Optional" next to the label */
    optional?: boolean;
    /** sm 28 · md 32 · lg 36 high */
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    /** Sends the value with a form, through a hidden input */
    name?: string;
    required?: boolean;
    id?: string;
    className?: string;
    "aria-label"?: string;
    ref?: Ref<HTMLButtonElement>;
};
export declare function Select({ options, value: valueProp, defaultValue, onChange, placeholder, label, hint, error, optional, size, disabled, name, required, id, className, "aria-label": ariaLabel, ref, }: SelectProps): import("react").JSX.Element;
export default function Demo(): import("react").JSX.Element;
