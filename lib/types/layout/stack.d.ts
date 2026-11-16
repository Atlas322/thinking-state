/**
 * Stack — the one place vertical (or horizontal) rhythm comes from.
 *
 * Rule (2026-11-12, after a segmented control sat 4 px above its
 * caption): controls — segmented controls, tab rows, chip groups — carry no
 * outer margin. Space between blocks comes from the parent's `gap`, i.e. a
 * Stack, using the --ts-space-* / --ts-gap-* tokens (tokens.css):
 *   space 1…10 = 4 8 12 16 24 32 48 64 72 96 px
 *   gap  stack-sm 8 · stack-md 16 · stack-lg 24 · control 16 (min under a
 *        control) · section 72 (Figma «Нүүр v02»)
 *
 *   <Stack gap="control">
 *     <SegmentedControl … />
 *     <p>caption</p>
 *   </Stack>
 */
import * as React from "react";
export declare const SPACE: readonly [4, 8, 12, 16, 24, 32, 48, 64, 72, 96];
export declare const GAPS: {
    readonly "stack-sm": 8;
    readonly "stack-md": 16;
    readonly "stack-lg": 24;
    readonly control: 16;
    readonly section: 72;
};
export type GapName = keyof typeof GAPS;
export type SpaceStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
/** CSS value for a gap name or a space step, with the token's px as fallback. */
export declare function gapVar(gap: GapName | SpaceStep): string;
export type StackProps = React.HTMLAttributes<HTMLElement> & {
    /** Space between children. Default "stack-md" (16 px). */
    gap?: GapName | SpaceStep;
    /** "column" (default) or "row". */
    direction?: "column" | "row";
    align?: React.CSSProperties["alignItems"];
    justify?: React.CSSProperties["justifyContent"];
    wrap?: boolean;
    as?: "div" | "section" | "header" | "footer" | "main" | "nav" | "ul" | "ol" | "li" | "article" | "aside";
};
export declare function Stack({ gap, direction, align, justify, wrap, as: Tag, style, className, ...rest }: StackProps): React.JSX.Element;
