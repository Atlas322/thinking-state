/**
 * The ac.me «үнийн бодлого» story as plain data (2026-11-17, screens.18): one question, three
 * sources, one cited answer. AskWindow, CitedAnswer, SourcePreview and ThinkingState demos all use
 * it, and each per-component entry exports its own demo from here, so a page that mounts one
 * component with its demo loads this small file, not the studio bundle. Types only; no components.
 * ac.me is a made-up company: every name and figure here is demo data.
 */
import type { CitedSegment, CitedAnswerProps } from "../library/cited-answer";
import type { ThinkingStep } from "../library/thinking-state";
import type { PreviewSource } from "../library/source-preview";
import type { AskSource } from "./ask-window";
export declare const askDemoThinking: ThinkingStep[];
export declare const askDemoAnswer: CitedSegment[];
export declare const askDemoSources: AskSource[];
export declare const citedAnswerDemo: CitedAnswerProps;
export declare const sourcePreviewDemo: {
    source: PreviewSource;
};
export declare const thinkingStateDemo: {
    steps: ThinkingStep[];
    loop: boolean;
};
