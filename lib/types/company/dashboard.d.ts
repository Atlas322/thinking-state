import * as React from "react";
import { type Company, type CompanyProject, type CompanyTask } from "./types";
/** "⛓ хүлээж буй: A, B" and "→ 2 task хүлээж байна" for a task's dependency links. */
export declare function dependencyText(c: Company, p: CompanyProject | undefined, t: CompanyTask, index?: Map<string, import("./types").TaskRef>): string;
/** area / subArea may be a unit id («area-fac9e1b8f9», kind "area") or a plain name: show the name. */
export declare const areaLabel: (c: Company, v?: string) => string;
/** True when the task waits on something that is not done yet. */
export declare function isHeld(c: Company, p: CompanyProject | undefined, t: CompanyTask, index?: Map<string, import("./types").TaskRef>): boolean;
/**
 * Dashboard — the company's projects and tasks grouped by area → sub-area,
 * like a Notion linked view of the vault: read-only, filter and group only.
 * Each area is a Session Board (sub-areas as groups, projects as parent rows,
 * tasks under them); a project row opens its Project Report beside it.
 */
export type DueFilter = "all" | "overdue" | "soon" | "none";
export type StatusFilter = "all" | "running" | "waiting" | "done" | "idle";
export declare function dueBucket(due: string | undefined, done: boolean, today: Date): Exclude<DueFilter, "all"> | "later";
/** Read-only Project Report for one contract project (also used by the Projects tab). */
export declare function ProjectReportFor({ c, p, decisionsLabel }: {
    c: Company;
    p: CompanyProject;
    decisionsLabel?: string;
}): React.JSX.Element;
export declare function Dashboard({ c, scoped, today, empty }: {
    c: Company;
    scoped: Company;
    today?: Date;
    empty: string;
}): React.JSX.Element;
export declare const dashboardCss = "\n.cv-dash{display:flex;flex-direction:column;gap:12px}\n.cv-dash-stats{grid-template-columns:repeat(4,minmax(0,1fr))}\n.cv-stat.is-amber dd{color:color-mix(in srgb,var(--cv-amber) 85%,var(--cv-fg))}\n.cv-people{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:1px}\n.cv-people button{flex:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px 0 4px;border:1px solid var(--cv-line);border-radius:15px;background:var(--cv-bg);font-size:13px;white-space:nowrap}\n.cv-people button[aria-pressed=true]{border-color:var(--cv-accent);background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 70%,var(--cv-fg));font-weight:500}\n.cv-filters{display:flex;flex-wrap:wrap;align-items:flex-end;gap:8px}\n.cv-filters label{display:flex;flex-direction:column;gap:3px;font-size:11.5px;font-weight:500;color:var(--cv-muted)}\n.cv-filters select{height:32px;min-width:140px;padding:0 28px 0 10px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);color:var(--cv-fg);font:inherit;font-size:13px}\n.cv-clear{height:32px;padding:0 12px;border:0;border-radius:8px;background:var(--cv-soft);color:var(--cv-fg);font-size:13px}\n.cv-dash-body{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:start}\n.cv-dash-body.has-pick{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}\n.cv-areas{display:flex;flex-direction:column;gap:16px;min-width:0}\n.cv-area-h{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:14px;font-weight:600}\n.cv-area-mark{width:10px;height:10px;border-radius:3px;background:var(--cv-accent)}\n.cv-area .sb,.cv-pick .rp{max-width:none}\n.cv-empty-sm{padding:12px;font-size:13px}\n.cv-pick{position:sticky;top:8px;display:flex;flex-direction:column;gap:8px;min-width:0;animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both}\n.cv-pick-bar{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--cv-muted)}\n.cv-pick-bar button{width:28px;height:28px;border:0;border-radius:7px;background:var(--cv-soft);font-size:16px;line-height:1}\n@container cv (max-width:1000px){.cv-dash-body.has-pick{grid-template-columns:minmax(0,1fr)}.cv-pick{position:static;order:-1}}\n@container cv (max-width:560px){.cv-dash-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.cv-filters label{flex:1 1 40%}.cv-filters select{min-width:0;width:100%}}\n";
