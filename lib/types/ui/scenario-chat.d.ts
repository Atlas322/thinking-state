/**
 * ScenarioChat — a role's own questions answered from the company's data,
 * with sources (2026-11-12: «гол нь бүтэцлэгдсэн байдал ба эх
 * сурвалж»). Data is the Company contract's `scenarios` (inai-sh #48):
 * question, sources (type · title · date), steps, answer, guard — passed
 * as props; the ac.me scenario text stays in inai-sh.
 *
 * Story per question — the motion of ThinkingState / AgentReply / Agent
 * Trail, reusing AgentTrail itself (2026-11-13): the question → «Бодож
 * байна» shimmer → «Санах ойгоос хайв» with each source entering as a
 * tagged sub-row (spring, one by one) → every step spinner → check with a
 * live time and a «2/5» counter → the answer written out word by word → the
 * guard badge (human approval pulses when it lands) → rest → the next
 * question. Source chips open a popover; steps open their details; any use
 * pauses the story and it comes back after a quiet spell. Plays in view
 * only, at most `loops` questions, ↺ / ⏸, reduced motion shows the whole
 * answer. Picking a question shows that answer in full.
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
    /** `size`: how much of it was read («12 мөр», «3 х»), shown on the chip and in its popover. */
    sources?: {
        type: ChatSourceType | string;
        title: string;
        date?: string;
        size?: string;
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
    /** The first trail step and its live status. */
    understand: string;
    thinking: string;
    /** The trail's title while it works, and once the answer is in (its «2/5» counter sits beside it). */
    trail: string;
    trailDone: string;
    /** Source type names, shown as the coloured tag on each found source. */
    sourceTypes: Record<string, string>;
    /** The human-approval gate as a trail step. */
    approval: string;
    close: string;
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
