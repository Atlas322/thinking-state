/**
 * Source Preview (Thinking State original, 2026-11-18) — a source chip that opens a file preview.
 * Chip: kind icon (document, calendar, message) or a brand logo, plus the title.
 * Popover: icon, title, kind, date, the quoted passage with the matching words marked, «Апп-д нээх».
 * Escape or a click outside closes it; focus returns to the chip. Radius = --ts-radius (6px fallback).
 */
import * as React from "react";
export type SourceKind = "document" | "calendar" | "message" | "decision" | "meeting" | "note" | "link" | "brand";
export type PreviewSource = {
    id: string;
    title: string;
    kind: SourceKind;
    /** Shown under the title, e.g. «Баримт · Drive». Defaults to the kind's label. */
    kindLabel?: string;
    date?: string;
    quote?: string;
    /** Words inside quote to mark. */
    highlight?: string;
    /** Brand logo for kind="brand" (an <img> or <svg>); without it the document icon is shown. */
    logo?: React.ReactNode;
    brandName?: string;
};
export type SourcePreviewLabels = {
    open: string;
    close: string;
    kinds: Record<SourceKind, string>;
};
export declare const sourcePreviewLabelsMn: SourcePreviewLabels;
export type SourcePreviewProps = {
    source?: PreviewSource;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** «Апп-д нээх»; omitted, the button is hidden. */
    onOpenInApp?: (source: PreviewSource) => void;
    /** Popover side relative to the chip. */
    placement?: "bottom" | "top";
    labels?: Partial<SourcePreviewLabels>;
    className?: string;
};
/**
 * One icon per source kind. Shapes are copied from the Thinking State icon set (src/company/icons.tsx,
 * Lucide, ISC): file-text, calendar-days, message-circle, git-branch, users-round, pencil, link.
 * Stroke 1.5, currentColor — the tile and the theme give the colour.
 */
export declare const SOURCE_ICON: Record<Exclude<SourceKind, "brand">, React.ReactNode>;
/** The source-kind icon on its tile: token background, token border, currentColor glyph — the same in both themes. */
export declare function SourceIcon({ kind, size, tile, logo }: {
    kind: SourceKind;
    size?: number;
    tile?: boolean;
    logo?: React.ReactNode;
}): React.JSX.Element;
export declare function SourcePreview({ source, open: openProp, defaultOpen, onOpenChange, onOpenInApp, placement, labels: labelsIn, className, }: SourcePreviewProps): React.JSX.Element;
/** Catalog demo: the three kinds and a brand, the first one open. */
export default function SourcePreviewDemo(): React.JSX.Element;
