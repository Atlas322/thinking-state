import * as React from "react";
/**
 * Use Case Run — one business use case shown as the full INAI cycle in a
 * single card: the input that started it, what the agent found in Agent
 * Memory (each finding with its source chip), the method it followed, the
 * steps it took, the human approval and the artifact that goes back to the
 * vault. Until a person approves, the artifact stays a draft; «Approve» turns
 * it into a saved artifact, «Revise» sends a note back to the agent.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 * Data comes in as plain JSON props; scenarios live in the inai-sh `acme/`
 * data. Motion: stages arrive one after another; off under reduced motion.
 */
export type UseCaseSource = {
    id: string;
    /** Short label for the chip, e.g. the note title. */
    label: string;
    /** Where it lives: vault path, table or system. */
    where?: string;
    /** The line the agent relied on. */
    quote?: string;
};
export type UseCaseStep = {
    id: string;
    label: string;
    /** Source ids this step used. */
    uses?: string[];
    state?: "done" | "active" | "next";
};
export type UseCaseRunData = {
    /** Use case name. */
    title: string;
    /** Customer segment, e.g. «Сургалтын төв». */
    segment?: string;
    /** Fictional ac.me company the example runs on. */
    company?: string;
    /** The agent that does the work. */
    agent?: string;
    /** What started the run: a message, a form, a ticket. */
    input: {
        channel?: string;
        text: string;
    };
    /** Method the agent follows (BMC, PMBOK, Lean Canvas…). */
    method?: string;
    sources: UseCaseSource[];
    steps: UseCaseStep[];
    approval: {
        question: string;
        who?: string;
    };
    artifact: {
        kind: string;
        title: string;
        path?: string;
        lines?: string[];
    };
};
export type UseCaseRunLabels = {
    input: string;
    memory: string;
    method: string;
    steps: string;
    approval: string;
    artifact: string;
    approve: string;
    revise: string;
    approved: string;
    draft: string;
    saved: string;
    revising: string;
    undo: string;
};
export type UseCaseRunProps = Partial<UseCaseRunData> & {
    /** Controlled approval state. */
    status?: "pending" | "approved" | "revise";
    onDecide?: (status: "pending" | "approved" | "revise") => void;
    labels?: Partial<UseCaseRunLabels>;
    className?: string;
};
export declare const useCaseRunDemo: UseCaseRunData;
export declare function UseCaseRun({ status: statusProp, onDecide, labels: labelsProp, className, ...data }: UseCaseRunProps): React.JSX.Element;
export default UseCaseRun;
