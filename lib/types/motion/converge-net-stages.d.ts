/**
 * ConvergeNet four stages (2026-11-17, screens.17), ported from web-builder's prototype
 * (site-recipes motifs/converge-net-4.html, 83f5c9c; Figma INAI Branding 56:86567):
 * 1 streams come in from the edges · 2 Obsidian local graph around one note · 3 PARA groups,
 * each its own shape and token colour · 4 a Fibonacci sphere turns around an axis.
 * `t` runs 0..4; 4 is the finished sphere (reduced motion shows it).
 */
export type NetShape = "circle" | "square" | "triangle" | "diamond";
export type NetGroup = {
    label: string;
    shape: NetShape;
    color: string;
};
/** PARA groups: Төсөл · Хүрээ · Нөөц · Архив, colours as token names. */
export declare const paraNetGroups: NetGroup[];
type P2 = [number, number];
type StageNode = {
    g: number;
    from: P2;
    graph: P2;
    cl: P2;
    sph: [number, number, number];
    d: number;
    z: number;
};
export declare function convergeStagesLayout(n: number, seed: number, groups?: number): {
    nodes: StageNode[];
    links: P2[];
};
/** One frame `t` (0..4). `accent` = stage 1–2 colour, `ink` = the axis, `colors[g]` = group colours. */
export declare function drawConvergeStages(x: CanvasRenderingContext2D, W: number, H: number, t: number, net: ReturnType<typeof convergeStagesLayout>, groups: NetGroup[], colors: string[], accent: string, ink: string): void;
export {};
