import * as React from "react";
export type ExplainerSlideProps = {
    n: number;
    title: string;
    page: number;
    total: number;
    kicker?: string;
    lede: string;
    figure?: React.ReactNode;
    points?: string[];
    rule?: {
        label: string;
        text: string;
    };
    next?: string;
    handle?: string;
    steps?: number;
    /** "dark" (default) or "editorial": paper, ink hairlines, dimension-drawing marks, serif titles. */
    theme?: ExplainerTheme;
    /** Magazine folio line (editorial), e.g. "GEN AI · №01 · 2026.11". */
    folio?: string;
    /** "3x4" (default, 1080×1440) or "4x5" (1080×1350, IG feed). */
    format?: ExplainerFormat;
    /** Show the mini step staircase beside the kicker (default true). */
    stairs?: boolean;
};
export type ExplainerFormat = "3x4" | "4x5";
export type ExplainerTheme = "dark" | "editorial";
export declare function ExplainerSlide(p: ExplainerSlideProps): React.JSX.Element;
export type StairCoverProps = {
    kicker: string;
    title: [string, string];
    sub: React.ReactNode;
    steps: string[];
    top: string;
    bottom: string;
    cta: string;
    note: string;
    handle?: string;
    page?: string;
    theme?: ExplainerTheme;
    folio?: string;
};
export declare function StairCover(p: StairCoverProps): React.JSX.Element;
export declare function RulesSheet({ title, rules, page, cta, handle, theme, folio, }: {
    title: string;
    rules: {
        name: string;
        rule: string;
    }[];
    page: string;
    cta: string;
    handle?: string;
    theme?: ExplainerTheme;
    folio?: string;
}): React.JSX.Element;
export type StatementSlideProps = {
    kicker?: string;
    /** Line 1 upright, line 2 italic accent. */
    title: [string, string?];
    sub?: React.ReactNode;
    /** Optional marked list, e.g. caveats: { mark: "⚠", text }. */
    items?: {
        mark: string;
        text: React.ReactNode;
    }[];
    /** Dimension label drawn under the title (editorial). */
    dim?: string;
    cta?: string;
    note?: string;
    page?: string;
    handle?: string;
    theme?: ExplainerTheme;
    folio?: string;
    format?: ExplainerFormat;
};
export declare function StatementSlide(p: StatementSlideProps): React.JSX.Element;
/** Integer count-up in pure CSS (@property), so frame-accurate capture can seek it via getAnimations(). */
export declare function CountUp({ to, prefix, suffix, delay }: {
    to: number;
    prefix?: string;
    suffix?: string;
    delay?: number;
}): React.JSX.Element;
/** Big numbers with labels; optional hatched bar (value as % of 100) that draws on. */
export declare function StatRows({ rows, foot, }: {
    rows: {
        value: number;
        prefix?: string;
        suffix?: string;
        label: string;
        bar?: boolean;
        hot?: boolean;
    }[];
    foot?: string;
}): React.JSX.Element;
/** Schematic divergence: one line rises, one falls (no data values — labelled as a schematic). */
export declare function Divergence({ up, down, from, to, foot, }: {
    up: string;
    down: string;
    from: string;
    to: string;
    foot: string;
}): React.JSX.Element;
/** Ruled lines that draw on one by one — a fill-in habit sheet. */
export declare function Ledger({ rows, foot }: {
    rows: {
        k: string;
        text: string;
    }[];
    foot?: string;
}): React.JSX.Element;
export declare function FigureCard({ title, children }: {
    title?: string;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function TokenChips({ sentence, hint, rows, total, note, bars, barsTitle, }: {
    sentence: string;
    hint: string;
    rows: {
        t: string;
        id: number;
        hl?: boolean;
    }[][];
    total: string;
    note: string;
    bars: {
        label: string;
        value: number;
    }[];
    barsTitle: string;
}): React.JSX.Element;
export declare function Scatter({ question, you, points, foot, }: {
    question: string;
    you: string;
    points: {
        label: string;
        score: string;
        note: string;
        x: number;
        y: number;
        near?: boolean;
    }[];
    foot: string;
}): React.JSX.Element;
export declare function ScoreBars({ head, options, foot, verdict, sub, }: {
    head: string;
    options: {
        label: string;
        value: number;
    }[];
    foot: string;
    verdict: string;
    sub: string;
}): React.JSX.Element;
export declare function BudgetStack({ ghost, head, parts, warn, }: {
    ghost: string;
    head: string;
    parts: {
        label: string;
        tokens: number;
        hot?: boolean;
    }[];
    warn: [string, string];
}): React.JSX.Element;
export declare function Sequence({ lanes, steps, foot, }: {
    lanes: [string, string, string];
    steps: {
        from: 0 | 1 | 2;
        text: string;
        code?: boolean;
    }[];
    foot: [string, string];
}): React.JSX.Element;
export declare function HubSpoke({ left, right, hub, head, sub, listTitle, list, }: {
    left: string[];
    right: string[];
    hub: string;
    head: string;
    sub: string;
    listTitle: string;
    list: {
        tag: string;
        value: string;
    }[];
}): React.JSX.Element;
export declare function ChunkCards({ question, chunks, simLabel, prompt, answer, answerNote, }: {
    question: string;
    chunks: {
        name: string;
        text: string;
        score: number;
        best?: boolean;
    }[];
    simLabel: string;
    prompt: {
        tag: string;
        text: string;
    }[];
    answer: string;
    answerNote: string;
}): React.JSX.Element;
export declare function LoopRing({ nodes, center, caption, dots, ends, big, bigLabel, foot, }: {
    nodes: [string, string, string];
    center: string;
    caption: string;
    dots: number;
    ends: [string, string];
    big: string;
    bigLabel: string;
    foot: string;
}): React.JSX.Element;
export declare function PassFailGrid({ title, cells, stats, legend, foot, }: {
    title: string;
    cells: ("p" | "f" | "m")[];
    stats: {
        label: string;
        value: string;
        head?: boolean;
    }[];
    legend: [string, string];
    foot: string;
}): React.JSX.Element;
export declare function Venn3({ title, labels }: {
    title: string;
    labels: [string, string, string];
}): React.JSX.Element;
export default function ExplainerCarouselDemo(): React.JSX.Element;
