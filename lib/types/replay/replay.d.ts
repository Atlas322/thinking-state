import * as React from "react";
/**
 * Replay — wrap any component to give it a ↺ button (top right) that
 * re-mounts it, so its entry animation and state start over. One source for
 * the catalog preview and inai.sh.
 * - Accessible: a real button, `aria-label="Дахин тоглуулах"`, focus ring,
 *   works with Enter / Space.
 * - Reduced motion: the button stays, and the child shows its final state
 *   straight away (animations and transitions inside are switched off).
 * - Theme: reads --ts-* tokens (cream, manage) with neutral fallbacks.
 */
export type ReplayProps = {
    children: React.ReactNode;
    /** Accessible name and tooltip. */
    label?: string;
    /** Called after each replay (e.g. to reset outside state). */
    onReplay?: () => void;
    /** Hide the button without removing the wrapper. */
    showButton?: boolean;
    /**
     * "inside" (default): ↺ floats over the top-right corner.
     * "outside": a 38 px strip is kept above the content for ↺, so it never
     * covers the component's own top-right controls (e.g. CompanyView's methodology switch).
     */
    placement?: "inside" | "outside";
    className?: string;
    style?: React.CSSProperties;
};
export declare function Replay({ children, label, onReplay, showButton, placement, className, style }: ReplayProps): React.JSX.Element;
/** HOC form: `const ReplayableCard = withReplay(Card)`. */
export declare function withReplay<P extends object>(Component: React.ComponentType<P>, options?: Omit<ReplayProps, "children">): {
    (props: P): React.JSX.Element;
    displayName: string;
};
export default Replay;
