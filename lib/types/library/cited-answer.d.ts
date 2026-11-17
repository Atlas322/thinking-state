import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
/** `n` («01», «02») starts a numbered row of the answer (screens.21). */
export type CitedSegment = {
    text: string;
    cite?: string[];
    paragraph?: boolean;
    n?: string;
};
export type CitedSource = {
    id: string;
    title: string;
    site: string;
    url?: string;
    date?: string;
    quote?: string;
    /** Words inside quote that match the answer. */
    highlight?: string;
    icon?: React.ReactNode;
};
export type CitedAnswerProps = {
    segments?: CitedSegment[];
    sources?: CitedSource[];
    pagesRead?: number;
    defaultOpen?: string;
    onOpenSource?: (source: CitedSource) => void;
    onPreviewChange?: (id: string | null) => void;
    action?: {
        label: string;
        onClick: () => void;
    };
    /** Force the card light or dark regardless of the page theme. */
    theme?: "light" | "dark";
    className?: string;
    /** Renders each piece of text, e.g. «@Нэр» → a mention chip with a card (screens.21; AskWindow passes withMentions). */
    renderText?: (text: string) => React.ReactNode;
};
/**
 * An answer written as {direct, list, next} (web-app inai-home v31) → segments. «[2]» marks cite the
 * source at that number (1-based, `sourceIds` in order); list rows keep their «01», «02».
 */
export type AnswerParts = {
    direct: string;
    list?: {
        n: string;
        text: string;
    }[];
    next?: string;
};
export declare function citedSegmentsFrom(parts: AnswerParts, sourceIds: string[]): CitedSegment[];
export declare function CitedAnswer({ segments, sources, pagesRead, defaultOpen, onOpenSource, onPreviewChange, action, theme, className, renderText, }: CitedAnswerProps): React.JSX.Element;
export default CitedAnswer;
