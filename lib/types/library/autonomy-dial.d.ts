import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type AutonomyLevel = 0 | 1 | 2;
export type AgentAction = {
    id: string;
    label: string;
    detail?: string;
    risk: "safe" | "risky" | "destructive";
    icon?: React.ReactNode;
};
export type AutonomyDialProps = {
    actions?: AgentAction[];
    level?: AutonomyLevel;
    defaultLevel?: AutonomyLevel;
    onLevelChange?: (level: AutonomyLevel) => void;
    pinned?: string[];
    defaultPinned?: string[];
    onPinnedChange?: (pinned: string[]) => void;
    title?: string;
    subtitle?: string;
    className?: string;
};
export declare const autonomyIcons: {
    notion: React.JSX.Element;
    gmail: React.JSX.Element;
    hubspot: React.JSX.Element;
    drive: React.JSX.Element;
    stripe: React.JSX.Element;
};
export declare function AutonomyDial({ actions, level, defaultLevel, onLevelChange, pinned, defaultPinned, onPinnedChange, title, subtitle, className, }: AutonomyDialProps): React.JSX.Element;
export default AutonomyDial;
