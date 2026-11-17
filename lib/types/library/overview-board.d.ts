/**
 * OverviewBoard (2026-11-17, screens.22): the first thing an Area or a Project shows — where it
 * stands, in one screen. One sentence, at most two actions, four numbers, one status bar, an
 * optional timeline (a project's plan as bars over weeks) and two short lists.
 *
 *   <OverviewBoard {...overviewBoardAreaDemo} />      // Хүрээ · Санхүү
 *   <OverviewBoard {...overviewBoardProjectDemo} />   // Төсөл · Үнийн шинэчлэл, with the timeline
 *
 * Every state is told by a word and a mark's shape as well as its colour (circle = running,
 * diamond = needs you, square = blocked, check = done, ring = not started). The timeline is a
 * list first: each row carries its name, owner, dates and state as text; the bars are a picture
 * of the same rows and fold away in a narrow container.
 * Colours come from the shared status tokens (--ts-status-*). Demo numbers are ac.me, a made-up company.
 */
import * as React from "react";
export type BoardTone = "running" | "needs-you" | "error" | "done" | "idle";
export type BoardKpi = {
    label: string;
    value: string;
    unit?: string; /** Change against the last period, signed: "+60", "−26". */
    delta?: string; /** Is the change good news? Colours the delta; the sign still tells the direction. */
    good?: boolean;
    note?: string;
};
export type BoardSegment = {
    tone: BoardTone;
    value: number; /** Overrides the tone's own word. */
    label?: string;
};
export type BoardAction = {
    label: string;
    primary?: boolean;
    href?: string;
    onClick?: () => void;
};
export type BoardItem = {
    id?: string;
    title: string;
    meta?: string;
    tone?: BoardTone;
    tag?: string;
};
export type BoardList = {
    title: string;
    items: BoardItem[];
    empty?: string;
};
export type BoardTimelineRow = {
    id?: string;
    label: string;
    owner?: string; /** Start and end in columns, fractions allowed (1.5 = the middle of the second column). */
    start: number;
    end: number;
    tone: BoardTone; /** The dates as text: "11/12 – 11/19". */
    when: string;
};
export type BoardTimeline = {
    title?: string; /** One label per column (weeks, months). */
    ticks: string[]; /** Where today falls, in columns. */
    today?: number;
    todayLabel?: string;
    rows: BoardTimelineRow[];
};
export type OverviewBoardLabels = {
    tone: Record<BoardTone, string>;
    status: string;
    timeline: string;
    today: string;
    of: string;
};
export declare const overviewBoardLabelsMn: OverviewBoardLabels;
export type OverviewBoardProps = {
    /** What this is and where it lives: «Хүрээ · Санхүү», «Төсөл · Борлуулалт». */
    eyebrow?: string;
    title: string;
    /** Where it stands, in one sentence. */
    sentence: string;
    /** At most two; the rest belongs in the views behind the board. */
    actions?: BoardAction[];
    /** Four numbers. */
    kpis?: BoardKpi[];
    statusTitle?: string;
    status?: BoardSegment[];
    timeline?: BoardTimeline;
    /** Two short lists. */
    lists?: BoardList[];
    /** Stop the bars' entrance (screenshots). Reduced motion stops it too. */
    still?: boolean;
    labels?: OverviewBoardLabels;
    className?: string;
};
export declare function OverviewBoard({ eyebrow, title, sentence, actions, kpis, statusTitle, status, timeline, lists, still, labels, className }: OverviewBoardProps): React.JSX.Element;
/** Demo · area: finance at ac.me Cargo, October (the same four numbers as the FinanceReport demo). */
export declare const overviewBoardAreaDemo: OverviewBoardProps;
/** Demo · project: the price update (the same tasks and owners as the AppScreen project demo). A column is a week. */
export declare const overviewBoardProjectDemo: OverviewBoardProps;
/** Demo · area: marketing at ac.me Retail. */
export declare const overviewBoardMarketingDemo: OverviewBoardProps;
/** Demo · project: logistics at ac.me Cargo, the warehouse move. A column is a week. */
export declare const overviewBoardLogisticsDemo: OverviewBoardProps;
/** Catalog preview: the project board with its timeline. */
export default function OverviewBoardDemo(): React.JSX.Element;
