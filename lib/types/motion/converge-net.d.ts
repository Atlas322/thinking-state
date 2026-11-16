/**
 * ConvergeNet (2026-11-17, screens.15): information streams in from the edges and the dots join
 * into one network. White geometric vector links on Electric (or Electric on a light surface).
 * Ported from web-builder's prototype (site-recipes motifs/converge-net.html, 2fb7204) for the
 * home v6 interlude hero. Canvas, deterministic seed, loops; prefers-reduced-motion and
 * `play="static"` show the final network; `t` (0..1.4) freezes one frame (Figma, screenshots).
 * Colours come from the tokens: --ts-on-electric on Electric, --ts-electric on cream.
 */
import * as React from "react";
export type ConvergeNetProps = {
    /** How many dots (default 72). */
    nodes?: number;
    /** Seed for the layout: the same seed draws the same network. */
    seed?: number;
    /** "electric": white links on Electric · "cream": Electric links on the page surface. */
    tone?: "electric" | "cream";
    /** "loop" (default) plays and repeats; "once" plays to the end and stays; "static" shows the end. */
    play?: "loop" | "once" | "static";
    /** One pass, ms (default 6000). */
    duration?: number;
    /** Freeze one frame (0 = start, 1.4 = the finished network). */
    t?: number;
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
export declare function ConvergeNet({ nodes, seed, tone, play, duration, t, label, className, style }: ConvergeNetProps): React.JSX.Element;
export declare const convergeNetDemo: ConvergeNetProps;
export default ConvergeNet;
