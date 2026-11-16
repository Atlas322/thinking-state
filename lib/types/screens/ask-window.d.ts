/**
 * Ask Window (2026-11-17, v3 «lightweight») — the site hero's Ask block as one Second Brain app window,
 * with the proportions of a calm chat app: thin lines, a quiet grey side, generous white space, small
 * icons, one accent.
 * - Side: the brain's own menu (PARA: Inbox · Өнөөдөр · Төслүүд · Хүрээ · Нөөц · Агентууд) and the
 *   brain's recent chats, one of them open. Sources are not in the side; they sit under the answer as chips.
 * - Main: the question as a sent message, source chips (SourcePreview), the cited answer in serif for
 *   reading, and the composer at the bottom.
 * Tokens only (--ts-*), radius --ts-radius; compact controls keep a 44px hit area.
 *
 *   <AskWindow question="…" answer={segments} sources={sources} onAsk={(q) => …} onOpenSource={(s) => …} />
 */
import * as React from "react";
import { type CitedSegment } from "../library/cited-answer";
import { type SourceKind } from "../library/source-preview";
import { type ThinkingStep } from "../library/thinking-state";
export type AskSource = {
    id: string;
    title: string;
    kind: SourceKind;
    /** Short type label shown in the preview, e.g. «Шийдвэр». */
    label: string;
    date?: string;
    quote?: string;
    highlight?: string;
    logo?: React.ReactNode;
    /** App the source lives in, e.g. "figma" — shows its mark where its guidelines allow (BRAND_MARK). */
    brand?: string;
};
export type AskNavItem = {
    id: string;
    label: string;
    icon: "inbox" | "today" | "projects" | "areas" | "resources" | "agents";
    count?: number;
};
export type AskChat = {
    id: string;
    title: string;
};
export type AskWindowLabels = {
    title: string;
    send: string;
    placeholder: string;
    chats: string;
    newChat: string;
    brain: string;
    pagesRead: (n: number) => string;
};
export declare const askWindowLabelsMn: AskWindowLabels;
export declare const askNavMn: AskNavItem[];
export type AskWindowProps = {
    question: string;
    answer: CitedSegment[];
    sources: AskSource[];
    /** The brain this window shows, e.g. { name: "ACME", note: "демо" }. */
    workspace?: {
        name: string;
        note?: string;
    };
    /** The brain's menu (PARA). */
    nav?: AskNavItem[];
    /** Recent chats of the brain; `activeChat` is the open one. */
    chats?: AskChat[];
    activeChat?: string;
    /** Light (default) or dark window; works inside any page theme. */
    theme?: "light" | "dark";
    /** The chip whose preview starts open (screenshots, the hero's first frame). */
    openSource?: string;
    /** Hide the side (narrow windows hide it on their own). */
    sidebar?: boolean;
    onAsk?: (question: string) => void;
    onOpenSource?: (source: AskSource) => void;
    onNavigate?: (id: string) => void;
    /** The visible chain of thought shown before the answer (plan, search, tool calls). */
    thinking?: ThinkingStep[];
    /** "auto" (default): plays the run once when it comes into view — question, thinking, sources light up,
     * the answer streams in with its citations. "static": the finished state. Reduced motion is always static. */
    play?: "auto" | "static";
    /** Each phase of the run as it starts — for syncing e.g. the hero's brain pulse. */
    onPhase?: (phase: AskPhase) => void;
    labels?: Partial<AskWindowLabels>;
    className?: string;
};
export type AskPhase = "ask" | "think" | "sources" | "answer" | "done";
export declare function AskWindow({ question, answer, sources, workspace, nav, chats, activeChat, theme, openSource, sidebar, onAsk, onOpenSource, onNavigate, thinking, play, onPhase, labels: labelsIn, className, }: AskWindowProps): React.JSX.Element;
/** ACME demo (made-up company; every figure is a demo number). */
export declare const askWindowDemo: AskWindowProps;
