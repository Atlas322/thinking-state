/**
 * AppShell (2026-11-17, screens.15): the app frame on PARA + GTD (owner decision: «Апп-ыг PARA + GTD
 * бүтцээр, бизнесийн үгээр»). Seven fixed places — Inbox · Өнөөдөр · Хүлээгдэж буй (GTD) and
 * Төсөл · Хүрээ · Нөөц · Архив (PARA) — whose labels come from the company's own vocabulary
 * (web-app app-para-vocab_v01); the generic name stays under each label so the structure is
 * the same in every company. Above them «Удирдлагын тойм» (CEO daily); below, the views.
 * Figma: «Second Brain» · 00 App shell · PARA + GTD (v02).
 */
import * as React from "react";
export type ParaKey = "inbox" | "today" | "waiting" | "projects" | "areas" | "resources" | "archive";
export type ParaVocab = Record<ParaKey, {
    label: string;
    line?: string;
}>;
export declare const PARA_KEYS: ParaKey[];
/** The generic names (app-para-vocab_v01 `base`). */
export declare const paraBaseMn: ParaVocab;
export type AppShellView = ParaKey | "ceo" | "calendar" | "agents";
export type AppShellProps = {
    company: {
        name: string;
        note?: string;
        initial?: string;
    };
    /** The company's words for the seven places; missing keys fall back to the generic name. */
    vocab?: Partial<ParaVocab>;
    counts?: Partial<Record<ParaKey, number>>;
    active?: AppShellView;
    onNavigate?: (view: AppShellView) => void;
    /** Right column (e.g. a meeting overview or «Хүний ээлж»). */
    aside?: React.ReactNode;
    children?: React.ReactNode;
    labels?: Partial<AppShellLabels>;
    className?: string;
};
export type AppShellLabels = {
    ceo: string;
    gtd: string;
    para: string;
    views: string;
    calendar: string;
    agents: string;
    nav: string;
};
export declare const appShellLabelsMn: AppShellLabels;
export declare function AppShell({ company, vocab, counts, active, onNavigate, aside, children, labels: labelsIn, className }: AppShellProps): React.JSX.Element;
/** ac.me vocabularies from web-app app-para-vocab_v01 (marketing team, logistics company). */
export declare const acmeParaVocab: Record<"marketing" | "logistics", ParaVocab>;
export default AppShell;
