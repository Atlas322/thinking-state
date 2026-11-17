import * as React from "react";
/**
 * Brain field — the shared base of Brain Map and Brain Growth: a seeded
 * layout (clusters of memory dots, links inside and between clusters) and one
 * SVG renderer driven by a single `progress` value (0–1). Every dot and link
 * has its own threshold, so the same picture can be scrubbed by scroll or
 * played by itself. The layout is a pure function of the seed: server and
 * client draw the same picture.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 */
export type BrainTone = "core" | "branch" | "leaf";
export type BrainCluster = {
    id: string;
    /** Centre in the 400-wide view box. */
    x: number;
    y: number;
    /** Radius the dots spread over. */
    r: number;
    /** Number of memory dots (1 = a single marker dot). */
    n: number;
    tone?: BrainTone;
    /** Progress at which the first dot shows… */
    at?: number;
    /** …and how long until the last one does. */
    span?: number;
};
export type BrainLink = {
    from: string;
    to: string;
    /** Progress at which the link shows. */
    at?: number;
    /** Strands drawn dot to dot; 0 draws one line edge to edge. */
    strands?: number;
};
/** `g` = the branch a dot or a link belongs to (the cluster id before «:»); the core is its own group. */
type Dot = {
    key: string;
    x: number;
    y: number;
    at: number;
    tone: BrainTone;
    g: string;
};
type Line = {
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    at: number;
    cross: boolean;
    g: string;
};
/** Small deterministic PRNG (mulberry32). */
export declare function seeded(seed: number): () => number;
/** Dots and links for a set of clusters — pure, seeded, SSR-stable. */
export declare function layoutBrain(clusters: BrainCluster[], links: BrainLink[], seed?: number): {
    dots: Dot[];
    lines: Line[];
};
/**
 * Progress from outside (scroll, 0–1) or, when none is given, a short
 * self-played run: `steps` ticks within `duration` ms (≤5 s), then it rests
 * at 1. Reduced motion: the final state at once.
 */
export declare function useBrainProgress(progress: number | undefined, duration?: number, steps?: number): number;
export type BrainFieldProps = {
    clusters: BrainCluster[];
    links: BrainLink[];
    progress: number;
    seed?: number;
    /** View box height (width is 400). */
    height?: number;
    /** Accessible description of the picture. */
    label: string;
    className?: string;
    /** A branch id: its dots and links stay bright, the rest steps back. The core always stays. */
    active?: string | null;
    /** Idle life once the picture is drawn: dots breathe, pulses travel the links from the core out. Off under reduced motion. */
    alive?: boolean;
};
/** The SVG: links under dots; each element shows once progress reaches it. */
export declare function BrainField({ clusters, links, progress, seed, height, label, className, active, alive }: BrainFieldProps): React.JSX.Element;
/** Counts of what is visible — «санамж» (dots) and «холбоо» (links). */
export declare function brainCounts(clusters: BrainCluster[], links: BrainLink[], progress: number, seed?: number): {
    memories: number;
    links: number;
};
export declare const brainFieldCss = "\n.bf{display:block;width:100%;height:auto;overflow:visible}\n.bf line{stroke-width:1;vector-effect:non-scaling-stroke;opacity:0;transition:opacity .5s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}\n.bf .bf-in{stroke:var(--bf-link,var(--ts-muted,#65656d))}\n.bf .bf-cross{stroke:var(--bf-cross,var(--ts-accent,#4f7cf0))}\n.bf line[data-on]{opacity:.32}\n.bf .bf-cross[data-on]{opacity:.6}\n.bf circle{opacity:0;transform-box:fill-box;transform-origin:center;transform:scale(.4);transition:opacity .45s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)),transform .45s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1))}\n.bf circle[data-on]{opacity:1;transform:none}\n.bf .bf-core{fill:var(--bf-core,var(--ts-accent,#4f7cf0))}\n.bf .bf-branch{fill:var(--bf-branch,var(--ts-fg,#18181b))}\n.bf .bf-branch[data-on]{opacity:.7}\n.bf .bf-leaf{fill:var(--bf-surface,var(--ts-surface,#fff));stroke:var(--bf-core,var(--ts-accent,#4f7cf0));stroke-width:2;vector-effect:non-scaling-stroke}\n.bf[data-active] line:not([data-hot]){opacity:.1}\n.bf[data-active] circle:not([data-hot]){opacity:.22}\n.bf[data-active] .bf-cross[data-hot]{opacity:1;stroke-width:1.6}\n.bf[data-alive] circle[data-on]:not(.bf-pulse){animation:bf-breathe var(--ts-motion-loop-period,5200ms) var(--ts-motion-ease-loop,ease-in-out) infinite;animation-delay:calc(var(--i,0) * -173ms)}\n.bf .bf-pulse{fill:var(--bf-cross,var(--ts-accent,#4f7cf0));opacity:0;transform:none;animation:bf-travel calc(var(--ts-motion-loop-move,1200ms) * 2) var(--ts-motion-ease-standard,ease-in-out) infinite;animation-delay:calc(var(--i,0) * 310ms)}\n.bf[data-active] .bf-pulse:not([data-hot]){animation:none;opacity:0}\n@keyframes bf-breathe{50%{transform:scale(1.22)}}\n@keyframes bf-travel{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}70%{opacity:.9}100%{transform:translate(var(--dx),var(--dy));opacity:0}}\n@media(prefers-reduced-motion:reduce){.bf line,.bf circle{transition:none}.bf[data-alive] circle,.bf .bf-pulse{animation:none!important}.bf .bf-pulse{display:none}}\n";
export {};
