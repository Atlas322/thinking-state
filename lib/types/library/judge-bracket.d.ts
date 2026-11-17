import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type Contender = {
    id: string;
    name: string;
    icon?: React.ReactNode;
    meta?: string;
    output?: string;
    /** A line of code shown under the output. */
    code?: string;
};
export type Verdict = {
    winner: string;
    reason?: string;
    scores?: [number, number];
};
export type JudgeBracketProps = {
    contenders?: Contender[];
    verdicts?: Record<string, Verdict>;
    judging?: string;
    judge?: string;
    task?: string;
    onPick?: (winner: Contender) => void;
    title?: string;
    className?: string;
};
export declare const judgeIcons: {
    research: React.JSX.Element;
    code: React.JSX.Element;
    review: React.JSX.Element;
    ops: React.JSX.Element;
};
export declare function JudgeBracket({ contenders, verdicts, judging, judge, task, onPick, title, className, }: JudgeBracketProps): React.JSX.Element;
export default JudgeBracket;
