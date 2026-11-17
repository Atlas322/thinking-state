/**
 * Role Dashboard (2026-11-17) — one company seen from one position. Built from the Company contract only:
 * every number is counted from the data, nothing is invented. Patterns from the saved references:
 * - what is burning comes first, data second (ikramsakib, real-estate manager board);
 * - the agent proposes with its reasons, the person approves once (Threshold, Bosun);
 * - projects on a time axis (gr8rstudio Gantt);
 * - the morning brief: decisions and agents at work (Sean Purvis, «agents meet at 6»);
 * - units → agents as one map (SkillTree, 35 agents in 7 departments).
 * Lens by position: the head of an institution/company sees its units; finance sees the revenue model.
 */
import * as React from "react";
import type { Company, CompanyProject, CompanyTask, CompanyUnit } from "./types";
export type RoleDashboardLabels = {
    burning: string;
    burningEmpty: string;
    overdue: (d: number) => string;
    waiting: string;
    soon: (d: number) => string;
    open: string;
    late: string;
    waitingK: string;
    agents: string;
    decisions: string;
    approve: string;
    approveOthers: string;
    approveTitle: string;
    yourStep: string;
    approveBtn: string;
    look: string;
    noApprove: string;
    timeline: string;
    brief: string;
    units: string;
    unit: string;
    model: string;
    share: string;
    okr: string;
    scope: string;
    today: string;
    noTimeline: string;
};
export declare const roleDashboardLabelsMn: RoleDashboardLabels;
export type RoleDashboardProps = {
    company: Company;
    personId: string;
    /** Lets the viewer switch position (shows the position pills). */
    onPersonChange?: (id: string) => void;
    today?: Date;
    /** Light or dark; left out, the board follows the host page's theme. */
    theme?: "light" | "dark";
    /** Inside another window (CompanyView): no own frame or title bar. */
    bare?: boolean;
    labels?: Partial<RoleDashboardLabels>;
    className?: string;
};
type Row = {
    project: CompanyProject;
    task: CompanyTask;
};
export type RoleView = ReturnType<typeof roleView>;
/** Everything the dashboard shows for one position — pure, testable. */
export declare function roleView(c: Company, personId: string, today?: Date): {
    person: import("./types").CompanyPerson;
    unit: CompanyUnit | undefined;
    projects: CompanyProject[];
    rows: Row[];
    open: Row[];
    late: Row[];
    waiting: Row[];
    soon: Row[];
    burning: (Row & {
        kind: "late" | "waiting" | "soon";
        days: number;
    })[];
    agents: import("./types").CompanyAgent[];
    decisions: {
        project: string;
        id: string;
        title: string;
        date: string;
    }[];
    recent: {
        project: string;
        id: string;
        title: string;
        date: string;
    }[];
    approvals: {
        workflow: import("./types").CompanyWorkflow;
        step: import("./types").WorkflowStep;
        before: {
            actor: string;
            id: string;
            label: string;
            actorId: string;
            output: string;
        }[];
        mine: boolean;
        approver: string;
    }[];
    isHead: boolean;
    unitHealth: {
        unit: CompanyUnit;
        open: number;
        late: number;
        waiting: number;
        agents: number;
    }[];
    finance: boolean;
    okrs: import("./types").Okr[];
};
/** A person by id, by role name or by its URL form (`?role=Санхүүгийн-захирал`, any case). */
export declare function findPerson(c: Company, key?: string | null): import("./types").CompanyPerson | undefined;
export declare function RoleDashboard({ company: c, personId, onPersonChange, today, theme, bare, labels: labelsIn, className }: RoleDashboardProps): React.JSX.Element;
export {};
