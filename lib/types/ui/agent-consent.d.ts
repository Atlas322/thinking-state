/**
 * AgentConsent — an agent asks for a scoped, timed grant; a person decides
 * (owner 2026-11-12, the «Эрхийн хүсэлт» card held to the scenario
 * standard). Data in props: agent, action, target, risk, reason, what it
 * will see (preview), scopes, duration. The decision is controlled or
 * internal; `onDecide` reports it.
 *
 * Story (catalog / marketing, `demo`): request arrives → the scope is
 * chosen → waiting on the person → allowed (or declined) → the folded
 * result («Зөвшөөрлөө · … · Өөрчлөх») → rest → loop. Without `demo` it is a
 * plain interactive card. Destructive actions never offer «always».
 */
import * as React from "react";
import { type IconName } from "../company/icons";
export type ConsentScope = "once" | "timed" | "always";
export type ConsentDecision = {
    allow: boolean;
    scope: ConsentScope;
    until?: string;
};
export type ConsentRisk = "safe" | "risky" | "destructive";
export type AgentConsentLabels = {
    title: string;
    preview: string;
    reason: string;
    allow: (scope: ConsentScope, durationLabel: string) => string;
    deny: string;
    change: string;
    allowed: string;
    denied: string;
    waiting: string;
    scopes: Record<ConsentScope, string>;
    risk: Record<ConsentRisk, string>;
    scopeLabel: string;
};
export declare const agentConsentLabelsMn: AgentConsentLabels;
export type AgentConsentProps = {
    agent: {
        name: string;
        icon?: IconName;
    };
    action: string;
    target: string;
    targetIcon?: IconName;
    risk?: ConsentRisk;
    reason?: string;
    preview?: {
        label: string;
        meta?: string;
        icon?: IconName;
    }[];
    scopes?: ConsentScope[];
    /** Minutes a timed grant holds. */
    duration?: number;
    decision?: ConsentDecision | null;
    defaultDecision?: ConsentDecision | null;
    onDecide?: (d: ConsentDecision | null) => void;
    /** Play the story with this outcome (catalog, marketing). */
    demo?: {
        allow: boolean;
        scope: ConsentScope;
    };
    labels?: Partial<AgentConsentLabels>;
    className?: string;
};
export declare function AgentConsent({ agent, action, target, targetIcon, risk, reason, preview, scopes, duration, decision: decisionIn, defaultDecision, onDecide, demo, labels, className, }: AgentConsentProps): React.JSX.Element;
