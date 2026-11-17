export type BrainSource = {
    id: string;
    label?: string;
};
export type BrainAnchor = {
    x: number;
    y: number;
    z: number;
    visible: boolean;
};
export type BrainApi = {
    /** A→B: pulse travels node to node along the network (multi-hop). `to` may be a DOM element: the pulse leaves the brain toward it. */
    pulse(from: string, to: string | Element, opts?: {
        ms?: number;
    }): Promise<void>;
    /** Viewport (client) position of a node, updated every frame — for HTML labels or an SVG line that continues outside the canvas. */
    anchor(id: string): BrainAnchor | null;
    /** Node ids: "hub", the source ids, "n0".."nN". */
    ids(): string[];
    /** Light a node (0..1); sources hold their light, plain nodes fade. */
    light(id: string, v?: number): void;
};
export declare function BrainCover({ tone, canvasOnly, center, runKey, still, sources, ambient, api, }?: {
    tone?: "deep" | "ink" | "white";
    canvasOnly?: boolean;
    /** true: the brain sits in the middle of the canvas (hero stage); false keeps the old right-hand offset on wide screens */
    center?: boolean;
    runKey?: number;
    still?: boolean;
    sources?: BrainSource[];
    /** background traffic between plain nodes; quiets for a few seconds after each pulse() call */
    ambient?: boolean;
    api?: (h: BrainApi | null) => void;
}): import("react").JSX.Element;
/** The home hero (web-builder, inai-home v31): four named sources over the brain, on Electric. */
export declare const brainCoverDemo: Parameters<typeof BrainCover>[0];
