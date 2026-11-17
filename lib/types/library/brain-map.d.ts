import * as React from "react";
/**
 * Brain Map — the hero picture: one brain in the middle, its branches
 * (memory · agents · thought) around it, and on each branch the agents with
 * the work they do written next to them. One idea, large and clean.
 * Built on the shared brain field (src/brain): the same seeded layout and
 * renderer as Brain Growth. Plays itself in ≤5 s (brain, then branches, then
 * agents); reduced motion shows the final picture.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 */
export type BrainMapAgent = {
    id: string;
    name: string;
    job: string;
};
export type BrainMapBranch = {
    id: string;
    label: string;
    agents: BrainMapAgent[];
};
export type BrainMapData = {
    title?: string;
    caption?: string;
    /** Label on the centre cluster. */
    core: string;
    /** 2–4 branches; three reads best. */
    branches: BrainMapBranch[];
};
export type BrainMapLabels = {
    picture: string;
};
export type BrainMapProps = Partial<BrainMapData> & {
    /** 0–1 from outside (scroll); omit to let it play by itself. */
    progress?: number;
    seed?: number;
    labels?: Partial<BrainMapLabels>;
    className?: string;
};
export declare const brainMapDemo: BrainMapData;
export declare function BrainMap({ progress: progressProp, seed, labels: labelsProp, className, ...data }: BrainMapProps): React.JSX.Element;
export default BrainMap;
