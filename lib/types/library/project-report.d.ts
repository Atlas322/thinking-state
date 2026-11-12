import * as React from "react";
/**
 * Project Report — one project's state as an agent reports it in chat.
 * A header card (icon, name, status, owner, updated, one-line summary), KPI
 * tiles that count up, a progress line with milestones, the phases (done,
 * active, blocked, next) and a «Waiting on you» block with one action each.
 * Two views of the same data: Status (timeline) and Cards. With `me` set, an
 * All / Mine switch shows only what `me` owns or shares (owner OR
 * sharedWith, the Just.Notion «owner or collaborator» filter).
 * Field names follow the vault frontmatter: `status` and `due` work as
 * aliases of `state` and `date`, and vault/Notion statuses (in-progress,
 * waiting, completed, inbox, planning…) map onto the four phase states.
 * Original Thinking State chat widget. Colours follow tokens/tokens.json.
 * Data comes in as plain JSON props, so the same object renders here, in a
 * one-file HTML export and in an agent's chat.
 * Motion: tiles count up, the progress bar grows, rows arrive one after
 * another, the active phase pulses; all of it is off under
 * prefers-reduced-motion.
 */
export type ReportTone = "green" | "amber" | "blue" | "red" | "gray";
export type ReportPhaseState = "done" | "active" | "blocked" | "next";
export type ProjectReportView = "status" | "cards";
export type ProjectReportScope = "all" | "mine";
/** Who owns an item and who it is shared with (vault `owner`, Notion Owner / Collabs). */
export type ReportShared = {
    owner?: string;
    sharedWith?: string[];
};
export type ProjectReportKpi = {
    label: string;
    value: number;
    /** Shown after the number, e.g. "/52" or "%". */
    unit?: string;
    /** Small note under the number, e.g. "+6 this week". */
    note?: string;
    tone?: ReportTone;
};
export type ProjectReportPhase = ReportShared & {
    id: string;
    title: string;
    /** done | active | blocked | next; vault/Notion names also work via `status`. */
    state?: ReportPhaseState;
    /** Vault/Notion status alias: in-progress, waiting, completed, inbox, planning… */
    status?: string;
    line?: string;
    /** Date or period, shown as written. */
    date?: string;
    /** Vault alias of `date`. */
    due?: string;
    /** 0–100 for the active phase; done counts as 100. */
    progress?: number;
};
export type ProjectReportWaiting = ReportShared & {
    id: string;
    title: string;
    line?: string;
    /** Button label; the button sends "<action>: <title>" back to the chat. */
    action?: string;
    tone?: ReportTone;
};
export type ProjectReportData = {
    project: {
        name: string;
        icon?: string;
        status?: {
            label: string;
            tone?: ReportTone;
        };
        owner?: string;
        /** People the project is shared with (team / company layer). */
        sharedWith?: string[];
        updated?: string;
        summary?: string;
    };
    /** The viewer; enables the All / Mine switch. */
    me?: string;
    kpis?: ProjectReportKpi[];
    progress?: {
        value: number;
        label?: string;
        milestones?: {
            at: number;
            label: string;
        }[];
    };
    phases?: ProjectReportPhase[];
    waiting?: ProjectReportWaiting[];
};
export type ProjectReportLabels = {
    owner: string;
    updated: string;
    progress: string;
    phases: string;
    waiting: string;
    nothingWaiting: string;
    view: string;
    status: string;
    cards: string;
    scope: string;
    all: string;
    mine: string;
    sharedWith: string;
    done: string;
    active: string;
    blocked: string;
    next: string;
};
export type ProjectReportProps = Partial<ProjectReportData> & {
    view?: ProjectReportView;
    defaultView?: ProjectReportView;
    scope?: ProjectReportScope;
    defaultScope?: ProjectReportScope;
    onScopeChange?: (scope: ProjectReportScope) => void;
    onViewChange?: (view: ProjectReportView) => void;
    onWaitingAction?: (item: ProjectReportWaiting) => void;
    labels?: Partial<ProjectReportLabels>;
    className?: string;
};
export declare const projectReportDemo: ProjectReportData;
/** Maps vault / Notion statuses onto the four phase states. */
export declare function toPhaseState(value?: string): ReportPhaseState;
export declare function ProjectReport({ project, kpis, progress, phases, waiting, me: meProp, view: viewProp, defaultView, onViewChange, scope: scopeProp, defaultScope, onScopeChange, onWaitingAction, labels: labelsProp, className, }: ProjectReportProps): React.JSX.Element;
export default ProjectReport;
