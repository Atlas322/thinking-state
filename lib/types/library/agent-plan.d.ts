import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type PlanStepStatus = "pending" | "active" | "done" | "failed";
export type PlanStep = {
    id: string;
    title: string;
    detail?: string;
    tool?: string;
    status?: PlanStepStatus;
    /** Seconds, e.g. 1.3 */
    duration?: number;
    error?: string;
};
export type AgentPlanProps = {
    title?: string;
    steps?: PlanStep[];
    defaultSteps?: PlanStep[];
    /** "draft" lets people edit; omitted, the demo shows a run that stopped on a failed step. */
    status?: "draft" | "running" | "done";
    estimate?: string;
    /** Milliseconds each simulated step takes while running. */
    stepMs?: number;
    onChange?: (steps: PlanStep[]) => void;
    onRun?: (steps: PlanStep[]) => void;
    onCancel?: () => void;
    onRetry?: (stepId: string) => void;
    onAction?: (action: "run" | "cancel" | "retry" | "add" | "remove", value?: string) => void;
    className?: string;
};
export declare function AgentPlan({ title, steps: stepsProp, defaultSteps, status, estimate, stepMs, onChange, onRun, onCancel, onRetry, onAction, className, }: AgentPlanProps): React.JSX.Element;
export default AgentPlan;
