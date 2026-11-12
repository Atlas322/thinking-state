import * as React from "react";
/**
 * PR & Deploy Status — where the code is: open pull requests with their
 * checks and review, and each deploy's pipeline with the step it is stuck on.
 * A stuck or failed deploy shows a blocker card (what, since when, one
 * action) and an optional log that folds open.
 * Original Thinking State chat widget. Colours follow tokens/tokens.json.
 * Data comes in as plain JSON props.
 * With `me` set, an All / Mine switch keeps the pull requests `me` authored or
 * reviews (owner OR sharedWith).
 * Motion: rows arrive one after another, finished pipeline steps fill in,
 * the active step runs and the stuck step pulses; all of it is off under
 * prefers-reduced-motion.
 */
export type PdPrState = "open" | "draft" | "merged" | "closed";
export type PdReview = "approved" | "changes" | "pending";
export type PdDeployState = "live" | "building" | "queued" | "stuck" | "failed";
export type PdStepState = "done" | "active" | "stuck" | "failed" | "next";
export type PdPullRequest = {
    /** Author (vault `owner`). */
    owner?: string;
    /** Reviewers or co-authors. */
    sharedWith?: string[];
    number: number;
    title: string;
    state: PdPrState;
    branch?: string;
    checks?: {
        passed?: number;
        failed?: number;
        pending?: number;
    };
    review?: PdReview;
    updated?: string;
    href?: string;
};
export type PdDeploy = {
    id: string;
    /** Environment name, e.g. "Preview" or "Production". */
    env: string;
    state: PdDeployState;
    /** What is deployed, e.g. a branch or "PR #41". */
    target?: string;
    updated?: string;
    href?: string;
    steps?: {
        label: string;
        state: PdStepState;
        time?: string;
    }[];
    blocker?: {
        title: string;
        detail?: string;
        since?: string;
        /** Button label; the button sends "<action>: <title>" back to the chat. */
        action?: string;
        log?: string[];
    };
};
export type PrDeployStatusData = {
    repo?: string;
    /** The viewer; enables the All / Mine switch on pull requests. */
    me?: string;
    prs?: PdPullRequest[];
    deploys?: PdDeploy[];
};
export type PrDeployStatusLabels = {
    pullRequests: string;
    deploys: string;
    open: string;
    draft: string;
    merged: string;
    closed: string;
    approved: string;
    changes: string;
    pending: string;
    passed: string;
    failed: string;
    running: string;
    live: string;
    building: string;
    queued: string;
    stuck: string;
    deployFailed: string;
    since: string;
    showLog: string;
    hideLog: string;
    noPrs: string;
    noDeploys: string;
    scope: string;
    all: string;
    mine: string;
};
export type PrDeployStatusProps = PrDeployStatusData & {
    onPrClick?: (pr: PdPullRequest) => void;
    scope?: "all" | "mine";
    defaultScope?: "all" | "mine";
    onScopeChange?: (scope: "all" | "mine") => void;
    onBlockerAction?: (deploy: PdDeploy) => void;
    labels?: Partial<PrDeployStatusLabels>;
    className?: string;
};
export declare const prDeployStatusDemo: PrDeployStatusData;
export declare function PrDeployStatus({ repo, me: meProp, scope: scopeProp, defaultScope, onScopeChange, prs, deploys, onPrClick, onBlockerAction, labels: labelsProp, className, }: PrDeployStatusProps): React.JSX.Element;
export default PrDeployStatus;
