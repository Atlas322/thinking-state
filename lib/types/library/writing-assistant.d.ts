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
};
export declare function WritingAssistant({ name, tagline, greeting, suggestions, placeholder, respond, speech, dictation, className, }: WritingAssistantProps): React.JSX.Element;
export default WritingAssistant;
