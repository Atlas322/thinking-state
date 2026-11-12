import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type DecisionFlag = {
    text: string;
    note: string;
    source?: string;
};
export type DecisionText = string | (string | DecisionFlag)[];
export type DecisionFollowUp = {
    question: string;
    options: DecisionOption[];
};
export type DecisionOption = {
    label: string;
    icon?: React.ReactNode;
    effects?: DecisionText[];
    apps?: React.ReactNode[];
    pick?: boolean;
    next?: DecisionFollowUp;
};
export type Decision = {
    id: string;
    question: string;
    context?: string;
    agent: string;
    model?: string;
    icon?: React.ReactNode;
    risk?: "high" | "medium" | "low";
    options: DecisionOption[];
};
export type DecisionChoice = {
    index: number;
    option: DecisionOption;
    then?: DecisionOption;
} | {
    other: string;
};
export type DecisionTreeProps = {
    decisions?: Decision[];
    onChoose?: (decision: Decision, choice: DecisionChoice) => string | void | Promise<string | void>;
    allowOther?: boolean;
    title?: string;
    className?: string;
};
export declare const decisionIcons: {
    agent: React.JSX.Element;
    crm: React.JSX.Element;
    payments: React.JSX.Element;
    chat: React.JSX.Element;
    status: React.JSX.Element;
};
export declare function DecisionTree({ decisions, onChoose, allowOther, title, className, }: DecisionTreeProps): React.JSX.Element;
export default DecisionTree;
