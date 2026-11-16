import * as React from "react";
/**
 * Chapter Divider — when an agent's work moves to a new phase (exploring →
 * building → checking) it marks a chapter: a divider line in the transcript,
 * and a small table of contents that lists the chapters and jumps to one.
 * Thinking State original; a visible chain-of-thought action.
 *
 * Scenario (demo, no props): chapters appear one by one and the current one
 * moves. Motion is off under prefers-reduced-motion.
 */
export type Chapter = {
    id: string;
    title: string;
    /** One-line summary, shown under the divider and as the TOC item's title. */
    summary?: string;
};
export type ChapterDividerLabels = {
    toc: string;
    chapter: string;
    current: string;
};
export type ChapterDividerProps = {
    chapters?: Chapter[];
    /** Id of the chapter being read; defaults to the last one. */
    current?: string;
    onJump?: (c: Chapter) => void;
    /** Show the divider of the current chapter (true) or only the TOC (false). */
    divider?: boolean;
    labels?: Partial<ChapterDividerLabels>;
    className?: string;
};
export declare const chapterDividerDemo: {
    chapters: Chapter[];
};
export declare function ChapterDivider({ chapters: chaptersProp, current: currentProp, onJump, divider, labels: labelsProp, className, }: ChapterDividerProps): React.JSX.Element;
export default ChapterDivider;
