/**
 * Label placement for BrainCover's named nodes (2026-11-17, screens.21). Pure, so it is tested
 * apart from WebGL. The site hero showed labels 2 and 3 on top of each other at 1440 and 390 px
 * («2 · Нийлүү…» / «3 · Салбар»): the old placer kept only 6 px vertically and, when no spot
 * fitted, fell back to the first one and clamped it — straight onto the previous label.
 *
 * Rule: every label stays inside `bounds` and at least `gap` px (default 16) from every label
 * placed before it — apart on x or on y. Try eight spots around the node (nearest first); if none
 * is free, slide down then up from the best spot in `gap` steps until one is.
 */
export type LabelBox = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export type LabelNode = {
    nx: number;
    ny: number;
    w: number;
    h: number;
};
export type LabelBounds = {
    l: number;
    t: number;
    r: number;
    b: number;
};
/** True when the two boxes are at least `gap` apart on x or on y. */
export declare function labelsApart(a: LabelBox, b: LabelBox, gap?: number): boolean;
export declare function placeBrainLabels(nodes: LabelNode[], bounds: LabelBounds, gap?: number): LabelBox[];
