export type FilterOption = {
    id: string;
    label: string;
};
export type FilterGroup = {
    id: string;
    label: string;
    options: FilterOption[];
    /** Put in front of the option on its chip, e.g. "Score: " → "Score: 80–90" */
    chipPrefix?: string;
};
/** Picked option ids per group id */
export type FilterValue = Record<string, string[]>;
export type FilterMenuProps = {
    groups: FilterGroup[];
    /** Controlled value */
    value?: FilterValue;
    /** Starting value when uncontrolled */
    defaultValue?: FilterValue;
    onChange?: (value: FilterValue) => void;
    /** Groups that start open – by default the first one */
    defaultOpen?: string[];
    title?: string;
    /** Show the keyboard hints as the last row of the card */
    hints?: boolean;
    className?: string;
};
export declare function FilterMenu({ groups: rawGroups, value, defaultValue, onChange, defaultOpen, title, hints, className, }: FilterMenuProps): import("react").JSX.Element;
export default function Demo(): import("react").JSX.Element;
