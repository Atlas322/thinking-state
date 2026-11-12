import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type FallbackStatus = "waiting" | "trying" | "failed" | "answered" | "skipped";
export type FallbackAttempt = {
    id: string;
    /** Optional when `name` is given. */
    model?: string;
    provider?: string;
    logo?: React.ReactNode;
    status: FallbackStatus;
    /** Why it failed, e.g. "Rate limited · 429". */
    reason?: string;
    tokens?: number;
    /** Seconds spent. */
    took?: number;
    cost?: number;
    startedAt?: number;
    /** Display name shown instead of the model name. */
    name?: string;
    /** Muted one-line note under the attempt. */
    note?: string;
};
export type ChainEnd = {
    name?: string;
    logo?: React.ReactNode;
    text?: string;
    details?: string[];
};
export type FallbackChainProps = {
    attempts?: FallbackAttempt[];
    title?: string;
    route?: string;
    request?: ChainEnd;
    response?: ChainEnd;
    now?: number;
    onRetry?: () => void;
    className?: string;
};
export declare function FallbackChain({ attempts, title, route, request, response, now, onRetry, className, }: FallbackChainProps): React.JSX.Element;
export default FallbackChain;
