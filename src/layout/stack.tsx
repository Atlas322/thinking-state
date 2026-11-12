/**
 * Stack — the one place vertical (or horizontal) rhythm comes from.
 *
 * Rule (owner 2026-11-12, after a segmented control sat 4 px above its
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

export const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 72, 96] as const;
export const GAPS = { "stack-sm": 8, "stack-md": 16, "stack-lg": 24, control: 16, section: 72 } as const;
export type GapName = keyof typeof GAPS;
export type SpaceStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** CSS value for a gap name or a space step, with the token's px as fallback. */
export function gapVar(gap: GapName | SpaceStep): string {
  return typeof gap === "number" ? `var(--ts-space-${gap}, ${SPACE[gap - 1]}px)` : `var(--ts-gap-${gap}, ${GAPS[gap]}px)`;
}

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

export function Stack({ gap = "stack-md", direction = "column", align, justify, wrap = false, as: Tag = "div", style, className = "", ...rest }: StackProps) {
  return (
    <Tag
      {...rest}
      className={`ts-stack ${className}`.trim()}
      data-gap={gap}
      style={{
        display: "flex",
        flexDirection: direction,
        gap: gapVar(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : undefined,
        minWidth: 0,
        ...style,
      }}
    />
  );
}
