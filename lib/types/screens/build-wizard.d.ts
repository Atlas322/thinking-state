/**
 * Build Wizard (2026-11-17, recipe v05) — the build page's «Бүтээх горим»: an adaptive questionnaire that
 * finds the shape of a Second Brain (areas · projects · routines/SOP · roles · knowledge · agents) and
 * draws a draft Company. The recipe is data (web-app's build-asuumj JSON, same shape):
 * - `branch_key` (segment) picks per-segment text through `by_segment`, and `show_if` hides steps/fields;
 * - the method card's «Мэдэхгүй байна» opens MethodQuiz inside the step;
 * - every step but the first can be skipped; nothing is invented (no numbers, no names — roles only).
 * Tokens only (--ts-*), radius --ts-radius, 44px targets.
 */
import * as React from "react";
import type { Company, Methodology } from "../company/types";
import { type MethodQuizProps } from "./method-quiz";
export type WizardOption = string | {
    value: string;
    label: string;
    hint?: string;
    short?: string;
    text?: string;
    fits?: string;
};
export type ShowIf = Record<string, string | string[]>;
export type WizardField = {
    key: string;
    label?: string;
    type?: "text" | "choice" | "cards" | "multi" | "list" | "date";
    required?: boolean;
    placeholder?: string;
    hint?: string;
    options?: WizardOption[];
    max?: number;
    allow_custom?: boolean;
    show_if?: ShowIf;
    /** Per-segment overrides of label, options, placeholder, hint. */
    by_segment?: Record<string, Partial<Pick<WizardField, "label" | "options" | "placeholder" | "hint">>>;
    /** Where the answer goes; `facts` and `collections` are read from here. */
    maps_to?: string;
    fact_label?: string;
    collection?: string;
    /** key_results: one list per objective (older recipes). */
    per?: "objective";
    unsure?: {
        label: string;
        text?: string;
        fallback?: Methodology;
    };
};
export type WizardStep = {
    id: string;
    title: string;
    lead?: string;
    show_if?: ShowIf;
    fields?: WizardField[];
    by_methodology?: Partial<Record<Methodology, WizardField[]>>;
};
export type WizardRecipe = {
    branch_key?: string;
    intro?: {
        eyebrow?: string;
        title?: string;
        lead?: string;
        time?: string;
        time_by_segment?: Record<string, string>;
        privacy?: string;
    };
    steps: WizardStep[];
    result: {
        title: string;
        lead?: string;
        sections?: {
            label: string;
            from: string;
        }[];
        empty?: string;
        ctas?: {
            label: string;
            variant?: "primary" | "secondary";
            href?: string;
        }[];
    };
};
export type WizardAnswers = Record<string, string | string[] | Record<string, string[]>>;
export type BuildWizardLabels = {
    title: string;
    back: string;
    next: string;
    skip: string;
    finish: string;
    addItem: string;
    addCustom: string;
    result: string;
    required: string;
    quizDone: string;
    quizBack: string;
    draft: string;
    empty: string;
    chooseMax: (n: number) => string;
};
export declare const buildWizardLabelsMn: BuildWizardLabels;
export type BuildWizardProps = {
    recipe: WizardRecipe;
    /** MethodQuiz content (method-quiz JSON); without it «Мэдэхгүй байна» picks the fallback method. */
    quiz?: Pick<MethodQuizProps, "questions" | "methods" | "note">;
    defaultAnswers?: WizardAnswers;
    /** Index among the steps visible for the answers. */
    defaultStep?: number;
    theme?: "light" | "dark";
    /** Fires on the result with the answers and the draft Company (save it, open company.html?c=draft). */
    onComplete?: (answers: WizardAnswers, draft: Company) => void;
    onCta?: (href: string | undefined, draft: Company) => void;
    labels?: Partial<BuildWizardLabels>;
    className?: string;
};
/** Does a step or field show for these answers? Values may be one value or a list of allowed values. */
export declare function shown(show: ShowIf | undefined, a: WizardAnswers): boolean;
/** The field as this segment sees it (label, options, placeholder from `by_segment`; the first branch before a choice). */
export declare function resolveField(f: WizardField, a: WizardAnswers, branchKey?: string): WizardField;
export declare function visibleSteps(recipe: WizardRecipe, a: WizardAnswers): WizardStep[];
/** Answers → a draft Company (contract unchanged). Empty answers stay out; people are roles, not names. */
export declare function toDraftCompany(recipe: WizardRecipe, a: WizardAnswers): Company;
export declare function BuildWizard({ recipe, quiz, defaultAnswers, defaultStep, theme, onComplete, onCta, labels: labelsIn, className }: BuildWizardProps): React.JSX.Element;
