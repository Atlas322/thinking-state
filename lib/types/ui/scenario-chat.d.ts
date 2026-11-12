/**
 * ScenarioChat — a role's own questions answered from the company's data,
 * with sources (owner 2026-11-12: «гол нь бүтэцлэгдсэн байдал ба эх
 * сурвалж»). Data is the Company contract's `scenarios` (inai-sh #48):
 * question, sources (type · title · date), steps, answer, guard — passed
 * as props; the ac.me scenario text stays in inai-sh.
 *
 * Story per question (the Thinking State scenario standard): the question
 * → sources found one by one («Санах ойгоос хайв») → steps ticked → the
 * answer → who guards it (human approval / role access) → rest → the next
 * question. Plays in view only, at most `loops` questions, ↺ / ⏸, reduced
 * motion shows the whole answer. Picking a question stops the autoplay and
 * shows that answer in full.
 */
import * as React from "react";
export type ChatSourceType = "document" | "register" | "decision" | "note";
export type ChatScenario = {
    id: string;
    role: string;
    personId?: string;
    function?: string;
    group?: string;
    question: string;
    doubt?: string;
    sources?: {
        type: ChatSourceType | string;
        title: string;
        date?: string;
    }[];
    steps?: string[];
    answer?: string;
    guard?: "role-access" | "human-approval" | string;
};
export type ScenarioChatLabels = {
    list: string;
    /** Narrow screens: the button that unfolds the other questions. */
    more: (n: number) => string;
    less: string;
    sources: string;
    steps: string;
    doubt: string;
    guards: Record<string, {
        label: string;
        pending: string;
        human: boolean;
    }>;
    fiction?: string;
};
export declare const scenarioChatLabelsMn: ScenarioChatLabels;
export type ScenarioChatProps = {
    scenarios: ChatScenario[];
    /** Names for scenario.personId («Санхүүч · Б. Номин»). */
    people?: {
        id: string;
        name: string;
    }[];
    /** Play the questions one after another. Default true. */
    autoplay?: boolean;
    /** Questions played before it rests on the last answer. Default 3. */
    loops?: number;
    defaultIndex?: number;
    onSelect?: (scenario: ChatScenario) => void;
    labels?: Partial<ScenarioChatLabels>;
    className?: string;
};
export declare function ScenarioChat({ scenarios, people, autoplay, loops, defaultIndex, onSelect, labels, className }: ScenarioChatProps): React.JSX.Element | null;
