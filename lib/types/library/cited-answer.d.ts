import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type CitedSegment = {
    text: string;
    cite?: string[];
    paragraph?: boolean;
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
    className?: string;
};
export declare function CitedAnswer({ segments, sources, pagesRead, defaultOpen, onOpenSource, onPreviewChange, action, className, }: CitedAnswerProps): React.JSX.Element;
export default CitedAnswer;
