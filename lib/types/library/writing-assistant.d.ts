import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type WritingMessage = {
    id: number;
    role: "user" | "assistant";
    text: string;
};
export type WritingAssistantProps = {
    name?: string;
    tagline?: string;
    greeting?: string;
    suggestions?: string[];
    placeholder?: string;
    respond?: (message: string) => string | Promise<string>;
    speech?: "auto" | "simulate";
    dictation?: string;
    className?: string;
    /** A ready conversation to start from instead of the empty welcome state. */
    initialMessages?: WritingMessage[];
};
export declare function WritingAssistant({ name, tagline, greeting, suggestions, placeholder, respond, speech, dictation, className, initialMessages, }: WritingAssistantProps): React.JSX.Element;
export default WritingAssistant;
