import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type ComboboxOption = {
    value: string;
    label: string;
    hint?: string;
    /** Image URL, or true for initials. */
    avatar?: string | boolean;
    color?: string;
    icon?: React.ReactNode;
    group?: string;
    keywords?: string[];
};
export type ComboboxProps = {
    options?: ComboboxOption[];
    multiple?: boolean;
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[], options: ComboboxOption[]) => void;
    placeholder?: string;
    creatable?: boolean;
    onCreate?: (text: string) => ComboboxOption | void;
    createLabel?: (text: string) => string;
    maxVisibleTags?: number;
    label?: string;
    defaultOpen?: boolean;
    emptyText?: string;
    className?: string;
};
export declare function Combobox({ options: optionsProp, multiple, value: valueProp, defaultValue, onChange, placeholder, creatable, onCreate, createLabel, maxVisibleTags, label, defaultOpen, emptyText, className, }: ComboboxProps): React.JSX.Element;
export declare function Demo(): React.JSX.Element;
export default Demo;
