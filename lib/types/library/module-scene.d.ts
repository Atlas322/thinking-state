import * as React from "react";
/**
 * Module Scene — the ready-made solution as one scene: four departments
 * (sales, operations, finance, knowledge), each with its number, title, the
 * agent working there and what it is doing right now, and three example
 * figures — all wired to one brain at the top. Every card has the same build,
 * so they compare at a glance. Plays itself in ≤5 s (brain, wires, cards,
 * agents at work); reduced motion shows the final scene.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 */
export type ModuleSceneKpi = {
    value: string;
    label: string;
};
export type ModuleSceneModule = {
    id: string;
    title: string;
    agent: string;
    /** What the agent is doing now, one line. */
    job: string;
    kpis: ModuleSceneKpi[];
};
export type ModuleSceneData = {
    title?: string;
    /** Label on the brain. */
    core: string;
    modules: ModuleSceneModule[];
    /** Note under the figures, e.g. that they are examples. */
    note?: string;
};
export type ModuleSceneLabels = {
    working: string;
    picture: string;
};
export type ModuleSceneProps = Partial<ModuleSceneData> & {
    labels?: Partial<ModuleSceneLabels>;
    className?: string;
};
export declare const moduleSceneDemo: ModuleSceneData;
export declare function ModuleScene({ labels: labelsProp, className, ...data }: ModuleSceneProps): React.JSX.Element;
export default ModuleScene;
