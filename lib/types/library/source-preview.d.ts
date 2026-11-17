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
    /** App the source lives in, e.g. "figma"; its mark shows when BRAND_MARK has it, else the kind icon. */
    brand?: string;
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
/**
 * App logos for sources that live in an app (2026-11-17): the official marks from svgl.app
 * (https://svgl.app, MIT for the collection), unmodified — colour and shape as published — embedded as
 * data URIs. GitHub has a dark-theme variant. The marks are trademarks of their owners and only say where a
 * cited source lives. Microsoft and Google Workspace marks were added on the project owner's decision
 * (2026-11-17); Adobe marks are left out and keep the line icon of their kind. Keys are lowercase app names.
 */
export declare const BRAND_LOGO: Record<string, {
    light: string;
    dark?: string;
}>;
/** Display names for screen readers and the trademark note. */
export declare const BRAND_NAME: Record<string, string>;
/** @deprecated use BRAND_LOGO */
export declare const BRAND_MARK: Record<string, {
    light: string;
    dark?: string;
}>;
export declare const brandTrademarkNoteMn = "Slack, Notion, Google Calendar, Gmail, Google Drive, Google Sheets, Google Slides, Google Meet, Meta, Threads, ElevenLabs, Adobe Premiere Pro, Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Microsoft Outlook, Microsoft Teams, Microsoft OneDrive, Obsidian, Figma, GitHub, Linear \u043D\u044C \u044D\u0437\u044D\u043C\u0448\u0438\u0433\u0447\u0434\u0438\u0439\u043D\u0445\u044D\u044D \u0431\u04AF\u0440\u0442\u0433\u044D\u043B\u0442\u044D\u0439 \u0431\u0430\u0440\u0430\u0430\u043D\u044B \u0442\u044D\u043C\u0434\u044D\u0433. \u041B\u043E\u0433\u043E \u043D\u044C \u0437\u04E9\u0432\u0445\u04E9\u043D \u043C\u044D\u0434\u044D\u044D\u043B\u043B\u0438\u0439\u043D \u044D\u0445 \u0441\u0443\u0440\u0432\u0430\u043B\u0436\u0438\u0439\u0433 \u0437\u0430\u0430\u043D\u0430; \u0442\u04AF\u043D\u0448\u043B\u044D\u043B, \u0434\u044D\u043C\u0436\u043B\u044D\u0433\u0438\u0439\u0433 \u0438\u043B\u044D\u0440\u0445\u0438\u0439\u043B\u044D\u0445\u0433\u04AF\u0439.";
/** The source-kind icon on its tile: token background, token border, currentColor glyph — the same in both themes. */
export declare function SourceIcon({ kind, size, tile, logo, brand }: {
    kind: SourceKind;
    size?: number;
    tile?: boolean;
    logo?: React.ReactNode;
    brand?: string;
}): React.JSX.Element;
export declare function SourcePreview({ source, open: openProp, defaultOpen, onOpenChange, onOpenInApp, placement, labels: labelsIn, className, }: SourcePreviewProps): React.JSX.Element;
/** Catalog demo: the three kinds and a brand, the first one open. */
export default function SourcePreviewDemo(): React.JSX.Element;
