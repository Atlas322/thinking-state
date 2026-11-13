import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type PromptTemplate = {
    id: string;
    title: string;
    category?: string;
    /** Badge color: "blue" | "violet" | "amber" | "green" | "gray". */
    tone?: string;
    body: string;
    variables?: Record<string, {
        description?: string;
        default?: string;
    }>;
};
export type PromptLibraryProps = {
    templates?: PromptTemplate[];
    value?: string;
    defaultValue?: string;
    onSelect?: (id: string) => void;
    onUse?: (prompt: string, template: PromptTemplate, values: Record<string, string>) => void;
    onCopy?: (prompt: string) => void;
    title?: string;
    useLabel?: string;
    className?: string;
};
export declare function PromptLibrary({ templates, value, defaultValue, onSelect, onUse, onCopy, title, useLabel, className, }: PromptLibraryProps): React.JSX.Element;
export default PromptLibrary;
