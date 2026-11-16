import * as React from "react";
/**
 * Brain Growth — memories link up and the brain grows: a personal brain
 * (one cluster), then a team brain (clusters joined), then the organisation
 * brain (departments joined). Dots never get bigger; links get more.
 * Pass `progress` (0–1) from the page's scroll to scrub it; without it the
 * picture plays itself in ≤5 s. Reduced motion shows the final state. The
 * layout is seeded, so server and client draw the same picture.
 * Built on the shared brain field (src/brain), same as Brain Map.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 */
export type BrainGrowthStage = {
    id: string;
    label: string;
    caption: string;
};
export type BrainGrowthData = {
    title?: string;
    /** Exactly three stages: personal, team, organisation. */
    stages: [BrainGrowthStage, BrainGrowthStage, BrainGrowthStage];
};
export type BrainGrowthLabels = {
    memories: string;
    links: string;
    picture: string;
};
export type BrainGrowthProps = Partial<BrainGrowthData> & {
    /** 0–1 from outside (scroll progress); omit to let it play by itself. */
    progress?: number;
    seed?: number;
    labels?: Partial<BrainGrowthLabels>;
    className?: string;
};
export declare const brainGrowthDemo: BrainGrowthData;
/** Stage thresholds on the 0–1 progress line. */
export declare const brainGrowthStops: readonly [0, 0.34, 0.67];
export declare function BrainGrowth({ progress: progressProp, seed, labels: labelsProp, className, ...data }: BrainGrowthProps): React.JSX.Element;
export default BrainGrowth;
