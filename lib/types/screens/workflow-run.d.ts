/**
 * WorkflowRun (2026-11-17, screens.23): one real piece of work followed from the brain to its outputs,
 * live — which folders it reads, which agents think, what each work app holds (ready, missing, waiting),
 * which outputs wait for a person, and how the result goes back into the brain.
 * Owner: «бүх зүйл апп-ууд руу орж юу болж байгааг, аль алхам бэлэн, аль нь дутуу байгааг харуулж амьдруул».
 *
 *   <WorkflowRun {...workflowRunDemo} />        // ac.me Retail · the spring campaign
 *
 * Four stages on a wide container (sources → agents → apps → outputs) and a return line under them;
 * a vertical stepper on a narrow one. The story plays step by step while in view (pause and replay
 * from the controls); reduced motion shows the finished state. Every state is a word and a mark's
 * shape as well as a colour. Brand logos come from the library's set (SourceIcon). Demo data is ac.me,
 * a made-up company.
 */
import * as React from "react";
export type RunAppState = "ready" | "missing" | "waiting";
export type RunOutputState = "approve" | "your-turn" | "waiting";
export type RunSource = {
    id: string;
    folder: string;
    name: string;
};
export type RunAgentRow = {
    id: string;
    name: string;
    line: string;
};
export type RunApp = {
    id: string;
    brand: string;
    name: string;
    line: string;
    state: RunAppState;
};
export type RunOutput = {
    id: string;
    label: string;
    line: string;
    state: RunOutputState;
};
export type WorkflowRunLabels = {
    sources: string;
    agents: string;
    apps: string;
    outputs: string;
    app: Record<RunAppState, string>;
    output: Record<RunOutputState, string>;
    summary: (ready: number, total: number, missing: number, waiting: number) => string;
    reading: string;
    idle: string;
};
export declare const workflowRunLabelsMn: WorkflowRunLabels;
export type WorkflowRunProps = {
    /** What is being made: «Хаврын хямдралын кампанит ажил». */
    title: string;
    /** Whose demo this is; say plainly that it is a demo. */
    note?: string;
    sources: RunSource[];
    /** One line under the agents: «агент бодно, хүн батална». */
    agentsLine?: string;
    agents: RunAgentRow[];
    apps: RunApp[];
    outputs: RunOutput[];
    /** The loop closing: what changed in the brain once the outputs are in. */
    back: string;
    /** Show the trademark note under the apps (default true: the logos belong to their owners). */
    trademark?: boolean;
    /** The finished state, no story (screenshots). Reduced motion does the same. */
    still?: boolean;
    labels?: Partial<WorkflowRunLabels>;
    className?: string;
};
export declare function WorkflowRun({ title, note, sources, agentsLine, agents, apps, outputs, back, trademark, still, labels: labelsIn, className }: WorkflowRunProps): React.JSX.Element;
/** Demo · ac.me Retail (a made-up company): the spring campaign, followed from the brain to its outputs. */
export declare const workflowRunDemo: WorkflowRunProps;
export default WorkflowRun;
