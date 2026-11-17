/**
 * ContentPipeline (2026-11-17, screens.16): every output comes out of the brain, is run by the app
 * and lands in a work app. One row per step: «эх note → агент/хүн → хэрэгсэл → гаралт», with the
 * human approval points marked. The source and the output are SourcePreview chips, so a reader
 * goes from any output back to the note it came from. Tools show their official marks (BRAND_LOGO).
 * The smallest new piece: a row layout around existing SourcePreview / SourceIcon.
 */
import { type PreviewSource } from "../library/source-preview";
export type PipelineActor = {
    name: string;
    kind: "agent" | "human";
};
export type PipelineStep = {
    id: string;
    title: string;
    source: PreviewSource;
    actor: PipelineActor;
    /** BRAND_LOGO key (word: microsoft-word, sheets: google-sheets, meta, figma, elevenlabs, adobe-premiere, threads …). */
    tool: string;
    output: PreviewSource;
    /** A human signs this step off before the next one starts. */
    approval?: boolean;
    state?: "done" | "active" | "waiting";
};
export type ContentPipelineProps = {
    title?: string;
    subtitle?: string;
    steps: PipelineStep[];
    note?: string;
    className?: string;
};
export declare function ContentPipeline({ title, subtitle, steps, note, className }: ContentPipelineProps): import("react").JSX.Element;
/** ac.me Маркетинг: one reel from research to the scheduled post. */
export declare const contentPipelineDemo: ContentPipelineProps;
export default ContentPipeline;
