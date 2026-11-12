import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type PermissionScope = "once" | "timed" | "always";
export type PermissionDecision = {
    allow: boolean;
    scope: PermissionScope;
    at: number;
    until?: number;
};
export type PermissionPreviewItem = {
    id: string;
    label: string;
    meta?: string;
    icon?: React.ReactNode;
};
export type PermissionRequestProps = {
    agent?: {
        name: string;
        model?: string;
        avatar?: React.ReactNode;
    };
    action?: string;
    target?: string;
    toolIcon?: React.ReactNode;
    risk?: "safe" | "risky" | "destructive";
    reason?: string;
    preview?: PermissionPreviewItem[];
    previewTitle?: string;
    previewLimit?: number;
    scopes?: PermissionScope[];
    scope?: PermissionScope;
    defaultScope?: PermissionScope;
    onScopeChange?: (scope: PermissionScope) => void;
    /** Minutes a timed grant holds. */
    duration?: number;
    decision?: PermissionDecision | null;
    defaultDecision?: PermissionDecision | null;
    onDecisionChange?: (decision: PermissionDecision | null) => void;
    now?: number;
    className?: string;
};
export declare function PermissionRequest(props: PermissionRequestProps): React.JSX.Element;
export default PermissionRequest;
