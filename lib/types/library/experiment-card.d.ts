import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type ExperimentTone = "red" | "amber" | "green" | "blue" | "violet" | "gray";
export type ExperimentVariant = {
    id: string;
    key: string;
    name: string;
    values: Record<string, number>;
    control?: boolean;
    visitors?: number;
    confidence?: Record<string, number>;
    color?: string;
};
export type ExperimentMetric = {
    id: string;
    label: string;
    format?: (v: number) => string;
    lowerIsBetter?: boolean;
};
export type ExperimentCardProps = {
    title?: string;
    variants?: ExperimentVariant[];
    metrics?: ExperimentMetric[];
    metric?: string;
    defaultMetric?: string;
    onMetricChange?: (id: string) => void;
    winner?: string | null;
    defaultWinner?: string | null;
    onWinnerChange?: (id: string | null) => void;
    status?: {
        label: string;
        tone?: ExperimentTone;
    };
    note?: string;
    action?: {
        label: string | ((v: ExperimentVariant) => string);
        onClick: (v: ExperimentVariant) => void;
    };
    hint?: React.ReactNode;
    trigger?: "hover" | "click";
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
};
export declare function ExperimentCard({ title, variants, metrics, metric, defaultMetric, onMetricChange, winner, defaultWinner, onWinnerChange, status, note, action, hint, trigger, open, defaultOpen, onOpenChange, className, }: ExperimentCardProps): React.JSX.Element;
export default ExperimentCard;
