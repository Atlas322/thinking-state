/**
 * Ask Window (2026-11-17, variant B of three) — the site hero's Ask block as one app window:
 * title bar (dots, title, view/edit tabs) · a narrow sidebar (workspace, sources) · Ask · source chips
 * (SourcePreview) · the cited answer (CitedAnswer). Tokens only (--ts-*), radius --ts-radius, 44px targets.
 *
 *   <AskWindow question="…" answer={segments} sources={sources} onAsk={(q) => …} onOpenSource={(s) => …} />
 */
import * as React from "react";
import { type CitedSegment } from "../library/cited-answer";
import { type SourceKind } from "../library/source-preview";
export type AskSource = {
    id: string;
    title: string;
    kind: SourceKind;
    /** Short type label shown in the sidebar and preview, e.g. «Шийдвэр». */
    label: string;
    date?: string;
    quote?: string;
    highlight?: string;
    logo?: React.ReactNode;
};
export type AskWindowLabels = {
    title: string;
    view: string;
    edit: string;
    sources: string;
    send: string;
    placeholder: string;
    pagesRead: (n: number) => string;
};
export declare const askWindowLabelsMn: AskWindowLabels;
export type AskWindowProps = {
    question: string;
    answer: CitedSegment[];
    sources: AskSource[];
    /** Workspace shown at the top of the sidebar, e.g. { name: "ACME", note: "демо" }. */
    workspace?: {
        name: string;
        note?: string;
    };
    /** Light (default) or dark window; works inside any page theme. */
    theme?: "light" | "dark";
    /** The chip whose preview starts open (screenshots, the hero's first frame). */
    openSource?: string;
    /** Hide the sidebar (narrow screens hide it automatically below 720px). */
    sidebar?: boolean;
    onAsk?: (question: string) => void;
    onOpenSource?: (source: AskSource) => void;
    labels?: Partial<AskWindowLabels>;
    className?: string;
};
export declare function AskWindow({ question, answer, sources, workspace, theme, openSource, sidebar, onAsk, onOpenSource, labels: labelsIn, className, }: AskWindowProps): React.JSX.Element;
/** ACME demo (made-up company; every figure is a demo number). */
export declare const askWindowDemo: AskWindowProps;
