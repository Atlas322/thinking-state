import * as React from "react";
export type ApprovalStatus = "pending" | "approved" | "denied";
export type ApprovalCardProps = {
    title?: string;
    description?: React.ReactNode;
    risk?: "low" | "medium" | "high";
    icon?: React.ReactNode;
    details?: {
        label: string;
        value: React.ReactNode;
    }[];
    preview?: React.ReactNode;
    children?: React.ReactNode;
    status?: ApprovalStatus;
    defaultStatus?: ApprovalStatus;
    onApprove?: (details: {
        always: boolean;
    }) => void | Promise<void>;
    onDeny?: (details: {
        reason: "user" | "timeout";
    }) => void;
    onEdit?: () => void;
    expiresIn?: number;
    onExpire?: () => void;
    allowAlways?: boolean;
    alwaysLabel?: string;
    approveLabel?: string;
    denyLabel?: string;
    editLabel?: string;
    shortcuts?: boolean;
    label?: React.ReactNode;
    actions?: "tray" | "card";
    className?: string;
};
export declare function ApprovalCard({ title, description, risk, icon, details, preview, children, status, defaultStatus, onApprove, onDeny, onEdit, expiresIn, onExpire, allowAlways, alwaysLabel, approveLabel, denyLabel, editLabel, shortcuts, label, actions, className, }: ApprovalCardProps): React.JSX.Element;
export declare function Demo(): React.JSX.Element;
export default Demo;
