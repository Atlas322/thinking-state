/**
 * Method Quiz (2026-11-17) — the build page's questionnaire as an app window: a few questions, one per
 * step, and a recommended management method (BMC · PMBOK · OKR · Lean Canvas) with the reason.
 * Content (questions, options, weights, method texts) is data: the site passes its own. Tokens only,
 * radius --ts-radius, 44px targets, keyboard: arrows move between options, Enter goes on.
 */
import * as React from "react";
import type { Methodology } from "../company/types";
export type QuizOption = {
    id: string;
    label: string;
    hint?: string; /** Points per method. */
    weights: Partial<Record<Methodology, number>>;
};
export type QuizQuestion = {
    id: string;
    title: string;
    help?: string;
    options: QuizOption[];
};
export type QuizMethod = {
    id: Methodology;
    name: string;
    short: string;
    why: string;
    firstStep: string;
};
export type MethodQuizLabels = {
    title: string;
    step: (i: number, n: number) => string;
    back: string;
    next: string;
    result: string;
    restart: string;
    cta: string;
    match: string;
    firstStep: string;
    points: (n: number) => string;
};
export declare const methodQuizLabelsMn: MethodQuizLabels;
export type MethodQuizProps = {
    questions: QuizQuestion[];
    methods: QuizMethod[];
    /** Pre-filled answers (question id → option id), e.g. for a screenshot of the result. */
    defaultAnswers?: Record<string, string>;
    defaultStep?: number;
    theme?: "light" | "dark";
    onComplete?: (method: Methodology, answers: Record<string, string>) => void;
    onCta?: (method: Methodology) => void;
    /** One line under the result, e.g. «Дараа нь сольж болно». */
    note?: string;
    /** Hide the window chrome (title bar) when the quiz sits inside another window. */
    bare?: boolean;
    labels?: Partial<MethodQuizLabels>;
    className?: string;
};
export declare function scoreMethods(questions: QuizQuestion[], answers: Record<string, string>): Record<Methodology, number>;
export declare function MethodQuiz({ questions, methods, defaultAnswers, defaultStep, theme, onComplete, onCta, note, bare, labels: labelsIn, className }: MethodQuizProps): React.JSX.Element;
/**
 * Demo content (placeholder until the site's own questions arrive). ACME is made up; weights are demo values.
 */
export declare const methodQuizDemo: Pick<MethodQuizProps, "questions" | "methods">;
