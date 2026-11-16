/**
 * AgentConsent — an agent asks for a scoped, timed grant; a person decides
 * (2026-11-12, the «Эрхийн хүсэлт» card held to the scenario
 * standard). Data in props: agent, action, target, risk, reason, what it
 * will see (preview), scopes, duration. The decision is controlled or
 * internal; `onDecide` reports it.
 *
 * Story (catalog / marketing, `demo`), with Agent Trail's detail
 * (2026-11-13): the request arrives with its trail — «Ажлыг эхлүүлсэн» →
 * «Хэрэгцээт эрхийг тодорхойлов» (what it will see enters as tagged
 * sub-rows, one by one) → «Таны шийдвэр» (a gate, waiting) — and a «2/3»
 * counter; the scope is chosen → waiting on the person (the allow button
 * pulses) → allowed (or declined): the gate ticks, then the folded result
 * («Зөвшөөрлөө · … · Өөрчлөх») → rest → loop. Without `demo` it is a
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
    /** The trail above the decision. */
    trail: {
        title: string;
        started: string;
        scoped: string;
        decide: string;
        reading: string;
    };
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
