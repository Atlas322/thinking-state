import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type DiffSegment = {
    type: "equal";
    text: string;
} | {
    type: "change";
    remove: string;
    insert: string;
};
export type InlineDiffHandle = {
    highlight: (index: number | null) => void;
    accept: (index: number) => void;
    reject: (index: number) => void;
    acceptAll: () => void;
    rejectAll: () => void;
    undo: () => void;
    reset: () => void;
};
export type InlineDiffProps = {
    original?: string;
    suggested?: string;
    changes?: DiffSegment[];
    onChange?: (text: string) => void;
    onDone?: (text: string) => void;
    label?: string;
    className?: string;
};
/** Word-level diff (LCS over words and spaces), grouped into change segments. */
export declare function diffWords(a: string, b: string): DiffSegment[];
export declare function InlineDiff({ original, suggested, changes, onChange, onDone, label, className, ref, }: InlineDiffProps & {
    ref?: React.Ref<InlineDiffHandle>;
}): React.JSX.Element;
export default InlineDiff;
