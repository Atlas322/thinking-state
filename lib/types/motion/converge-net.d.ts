/**
 * ConvergeNet (2026-11-17, screens.15): information streams in from the edges and the dots join
 * into one network. White geometric vector links on Electric (or Electric on a light surface).
 * Ported from web-builder's prototype (site-recipes motifs/converge-net.html, 2fb7204) for the
 * home v6 interlude hero. Canvas, deterministic seed, loops; prefers-reduced-motion and
 * `play="static"` show the final network; `t` (0..1.4) freezes one frame (Figma, screenshots).
 * Colours come from the tokens: --ts-on-electric on Electric, --ts-electric on cream.
 */
import * as React from "react";
import { type NetGroup, type NetNote } from "./converge-net-stages";
export { paraNetGroups, convergeStagesLayout, drawConvergeStages, pickNoteNodes, type NetGroup, type NetShape, type NetNote } from "./converge-net-stages";
export type ConvergeNetProps = {
    /** How many dots (default 72). */
    nodes?: number;
    /** Seed for the layout: the same seed draws the same network. */
    seed?: number;
    /** "electric": white links on Electric · "cream": Electric links on the page surface. */
    tone?: "electric" | "cream";
    /** "loop" (default) plays and repeats; "once" plays to the end and stays; "static" shows the end. */
    play?: "loop" | "once" | "static";
    /** One pass, ms (default 6000). Sizing: the canvas fills a parent with a height; in a parent with
     *  height:auto it keeps 16:9 (aspect-ratio), so it never grows with its own pixel buffer. */
    duration?: number;
    /** Freeze one frame (0 = start, 1.4 = the finished network). */
    t?: number;
    /**
     * Four-stage mode (screens.17): edges → local graph → groups → turning sphere with an axis.
     * A number 0..4 freezes that moment; "loop" plays 0→4 and repeats; "scroll" follows the page
     * scroll while the canvas crosses the viewport. Reduced motion shows stage 4.
     */
    stage?: number | "loop" | "scroll";
    /**
     * Stage 2 (local graph) with labels: the note in the centre and up to ~8 linked notes. Each is a
     * link; hover or focus lights its dot and shows the short preview. Drawn only while the graph
     * stands still at stage 1.5–2 (a number), so labels never chase moving dots.
     */
    center?: {
        label: string;
        href?: string;
    };
    notes?: NetNote[];
    /** Stage 3–4 groups (label, shape, colour token). Default: PARA (paraNetGroups). */
    groups?: NetGroup[];
    /** Accessible description; the canvas is an image of it. */
    label?: string;
    className?: string;
    style?: React.CSSProperties;
};
type Node = {
    to: [number, number];
    from: [number, number];
    d: number;
    sz: number;
};
/** The network for a seed: same seed, same dots and links. */
export declare function convergeNetLayout(n: number, seed: number): {
    nodes: Node[];
    links: [number, number, number][];
};
/** Draws one frame `t` (0..1.4) of the network into a 2D context of W×H CSS px. */
export declare function drawConvergeNet(x: CanvasRenderingContext2D, W: number, H: number, t: number, net: ReturnType<typeof convergeNetLayout>, fg: string): void;
export declare function ConvergeNet({ stage, center, notes, groups, nodes, seed, tone, play, duration, t, label, className, style }: ConvergeNetProps): React.JSX.Element;
/** Four stages, PARA groups, on the page surface (home v6 interlude). */
export declare const convergeNetStagesDemo: ConvergeNetProps;
/** Stage 2 with labels: the home interlude's local graph (web-builder, t≈1.9 of converge-net-4). */
export declare const convergeNetGraphDemo: ConvergeNetProps;
export declare const convergeNetDemo: ConvergeNetProps;
export default ConvergeNet;
