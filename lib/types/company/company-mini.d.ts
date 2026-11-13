import * as React from "react";
import { type Company } from "./types";
/**
 * CompanyView at preview density (2026-11-13: the home-page hero board
 * was «too crowded, make it small»). One header line, up to 3 small tabs, a
 * 3-tile stat row and 3–4 task rows, ~360 px tall, 12–13 px text. Fully
 * interactive like any catalog component: every tab clicks. A story walks the
 * tabs and moves one task through GTD; it pauses while someone is using it,
 * comes back after a quiet spell, and ⏸ / ↺ control it.
 */
export type CompanyMiniLabels = {
    overview: string;
    projects: string;
    agents: string;
    statProjects: string;
    statActive: string;
    statWaiting: string;
    noTasks: string;
    noProjects: string;
    noAgents: string;
    updated: string;
    pause: string;
    play: string;
    replay: string;
    tabs: string;
};
export declare const companyMiniLabelsMn: CompanyMiniLabels;
export declare function CompanyMini({ company, today, labels, story, badge, }: {
    company: Company;
    /** One header badge (CompanyView passes the segment). */
    badge?: string;
    today?: Date;
    labels?: Partial<CompanyMiniLabels>;
    /** Play the built-in story (tabs + one task moving through GTD). */
    story?: boolean;
}): React.JSX.Element;
export declare const companyMiniCss = "\n.cv-mini{display:flex;flex-direction:column;gap:8px;min-height:340px;max-height:380px;padding:12px;border:1px solid var(--cv-line);border-radius:14px;background:var(--cv-bg);font-size:13px;line-height:1.35;overflow:hidden}\n.cv-mini-h{display:flex;align-items:center;gap:8px;min-width:0}\n.cv-mini-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:600}\n.cv-mini-asof{display:inline-flex;align-items:center;gap:4px;margin-left:auto;color:var(--cv-muted);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}\n.cv-mini-ctl{display:inline-flex;gap:2px}\n.cv-mini-ctl button{display:grid;place-items:center;width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--cv-muted);cursor:pointer}\n.cv-mini-ctl button:hover{background:var(--cv-soft);color:var(--cv-fg)}\n.cv-mini-tabs{display:flex;gap:4px;padding:3px;border-radius:10px;background:var(--cv-soft)}\n.cv-mini-tabs button{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--cv-muted);font:inherit;font-size:12px;font-weight:500;cursor:pointer;transition:background .2s,color .2s}\n.cv-mini-tabs button[aria-selected=true]{background:var(--cv-bg);color:var(--cv-fg);box-shadow:0 1px 2px #0000001a}\n.cv-mini-tabs button:focus-visible,.cv-mini-ctl button:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:1px}\n.cv-mini-panel{display:flex;flex-direction:column;gap:8px;min-height:0;animation:cv-mini-in var(--ts-motion-dur-base,.32s) var(--ts-motion-ease-out,ease-out) both}\n@keyframes cv-mini-in{from{opacity:0;transform:translateY(4px)}}\n.cv-mini-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0}\n.cv-mini-stat{display:flex;flex-direction:column-reverse;gap:2px;padding:7px 9px;border:1px solid var(--cv-line);border-radius:9px}\n.cv-mini-stat dt{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--cv-muted)}\n.cv-mini-stat dd{margin:0;font-size:18px;font-weight:600;font-variant-numeric:tabular-nums}\n.cv-mini-stat.is-running dd{color:var(--ts-status-running-fg,#1d5fb8)}\n.cv-mini-stat.is-needs-you dd{color:var(--ts-status-needs-you-fg,#a33e0b)}\n:where(.dark,[data-theme=dark]) .cv-mini-stat.is-running dd{color:var(--ts-status-running-fg,#93c5fd)}\n:where(.dark,[data-theme=dark]) .cv-mini-stat.is-needs-you dd{color:var(--ts-status-needs-you-fg,#f0a46a)}\n.cv-mini-tasks{margin:0;padding:0;border:0;font-size:12.5px}\n.cv-mini-tasks .cv-trow{min-height:26px;padding:1px 0}\n.cv-mini-list{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}\n.cv-mini-list li{display:flex;align-items:center;gap:8px;min-height:36px;padding:4px 6px;border-radius:8px}\n.cv-mini-list li:hover{background:var(--cv-soft)}\n.cv-mini-list .cv-gtd{padding-inline:5px}\n.cv-mini-t{display:flex;flex-direction:column;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.cv-mini-t small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--cv-muted);font-size:12px}\n.cv-mini .cv-empty{padding:16px}\n@media (prefers-reduced-motion:reduce){.cv-mini-panel{animation:none}}\n.cv-mini-tasks .cv-trow{animation:cvmtrow .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.cv-mini-tasks .cv-trow:nth-child(1){animation-delay:200ms}.cv-mini-tasks .cv-trow:nth-child(2){animation-delay:310ms}.cv-mini-tasks .cv-trow:nth-child(3){animation-delay:420ms}.cv-mini-tasks .cv-trow:nth-child(4){animation-delay:530ms}.cv-mini-tasks .cv-trow:nth-child(5){animation-delay:640ms}.cv-mini-tasks .cv-trow:nth-child(6){animation-delay:750ms}.cv-mini-tasks .cv-trow:nth-child(7){animation-delay:860ms}.cv-mini-tasks .cv-trow:nth-child(8){animation-delay:970ms}@keyframes cvmtrow{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.cv-mini-tasks .cv-trow{animation:none}}\n";
