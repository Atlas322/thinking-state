/**
 * BrainGraph (2026-11-19): the knowledge graph as Obsidian's graph view shows it — a force-balanced
 * network you can touch (site request 2026-11-19: the knowledge graph should feel like Obsidian).
 *
 * - Layout: forces, not a starburst. Notes push apart, links pull, groups form their own clusters.
 * - Size = links: a node's radius grows with its degree, so the hubs stand out by themselves.
 * - Labels: hubs always; every other note on hover, as a neighbour of the hovered one, or zoomed in.
 *   Labels that would overlap one already drawn are skipped (higher degree wins).
 * - Hover: the node and its neighbours light in Electric, the rest fade. Click a hub with href → go.
 *   Touch has no hover: the first tap lights the node, a second tap on it goes; a vertical swipe
 *   still scrolls the page (touch-action: pan-y).
 * - Drag a node; drag the background to pan; ⌘/Ctrl + wheel or a trackpad pinch to zoom. A plain
 *   wheel scrolls the page — a website section must not trap the scroll.
 * - Colours come only from tokens (--ts-fg, --ts-faint, --ts-ink-muted, --ts-electric, --ts-line),
 *   re-read when <html data-theme> changes, so Өдөр and Шөнө both read correctly.
 * - The simulation stops once it settles (no idle CPU) and wakes on drag. Reduced motion lays the
 *   graph out up front and never animates.
 * - The canvas is an image with a description; the hubs are also a real list of links for
 *   keyboards and screen readers.
 */
import * as React from "react";
export type BrainGraphNote = {
    label: string;
    href?: string;
};
export type BrainGraphProps = {
    /** The note in the middle (the brain itself). */
    center: BrainGraphNote;
    /** The hubs around it — each gets its own cluster of notes. */
    notes: BrainGraphNote[];
    /** Unlabelled notes spread over the hubs (default 56). */
    extra?: number;
    /** Same seed, same graph. */
    seed?: number;
    /** Accessible description of the picture. */
    label?: string;
    className?: string;
    style?: React.CSSProperties;
};
export type GraphNode = {
    id: number;
    label: string;
    href?: string;
    hub: boolean;
    group: number;
};
export type GraphLayout = {
    nodes: GraphNode[];
    links: [number, number][];
    degree: number[];
};
/** The graph for a centre, hubs and a seed: same input, same nodes and links. */
export declare function brainGraphLayout(center: BrainGraphNote, notes: BrainGraphNote[], extra?: number, seed?: number): GraphLayout;
export declare function BrainGraph({ center, notes, extra, seed, label, className, style }: BrainGraphProps): React.JSX.Element;
export declare const brainGraphDemo: BrainGraphProps;
