import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type CauseStatus = "open" | "checking" | "ruled-out" | "confirmed";
export type Cause = {
    id: string;
    title: string;
    icon?: React.ReactNode;
    files?: string[];
    gate?: "or" | "and";
    status?: CauseStatus;
    verdict?: string;
    evidence?: {
        kind: string;
        source?: string;
        content: string;
    };
    /** Milliseconds since the run started. */
    at?: number;
    children?: Cause[];
};
export type RootCauseTreeProps = {
    title?: string;
    failure?: Cause & {
        detail?: string;
    };
    onAction?: (cause: Cause, action: "fix" | "retry") => void;
    formatTime?: (ms: number) => string;
    className?: string;
};
export declare function RootCauseTree({ title, failure, onAction, formatTime, className }: RootCauseTreeProps): React.JSX.Element;
export default RootCauseTree;
