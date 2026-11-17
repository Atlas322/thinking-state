/**
 * CeoDaily (2026-11-17, screens.15): «Удирдлагын тойм», the CEO's day in the AppShell. the owner's
 * seven parts: KPI · өдрийн шугам · уулзалт (click → overview) · хүрээгээр бүлэглэсэн төслүүд ·
 * санхүүгийн зорилт · хянагдах гэрээ · агентын хянагч. Based on Goomnet's today/control pages.
 * Figma: «Second Brain» · 00 App shell · PARA + GTD v02 (component set 924:9078: Компани=Маркетинг|Логистик).
 * Meaning never rides on colour alone: deltas carry an arrow and words, over-budget is written.
 */
import * as React from "react";
import { appShellDemo, appShellLogisticsDemo, type AppShellProps } from "./app-shell";
export { appShellDemo, appShellLogisticsDemo };
export type CeoKpi = {
    label: string;
    value: string;
    delta?: string;
    good?: boolean;
};
export type CeoDayItem = {
    id: string;
    time: string;
    title: string;
    meta?: string;
    kind: "meeting" | "task" | "agent" | "post";
};
export type CeoMeeting = {
    id: string;
    title: string;
    when: string;
    prep: string[];
};
export type CeoProject = {
    id: string;
    name: string;
    progress: number;
    state: "on-track" | "at-risk" | "late";
};
export type CeoArea = {
    name: string;
    projects: CeoProject[];
};
export type CeoGoal = {
    id: string;
    label: string;
    progress: number;
    value: string;
};
export type CeoContract = {
    id: string;
    title: string;
    check: string;
    due: string;
};
export type CeoAgent = {
    id: string;
    name: string;
    doing: string;
    state: "working" | "your-turn" | "done" | "scheduled";
};
export type CeoDailyData = {
    title?: string;
    subtitle: string;
    kpis: CeoKpi[];
    day: CeoDayItem[];
    meetings: CeoMeeting[];
    areas: CeoArea[];
    goals: CeoGoal[];
    contracts: CeoContract[];
    agents: CeoAgent[];
    note?: string;
};
export type CeoDailyProps = CeoDailyData & {
    defaultMeeting?: string;
    onOpenMeeting?: (id: string) => void;
    className?: string;
};
/** The main column of «Удирдлагын тойм»; pair it with <CeoMeetingOverview> in the AppShell aside. */
export declare function CeoDaily({ title, subtitle, kpis, day, meetings, areas, goals, contracts, agents, note, defaultMeeting, onOpenMeeting, className }: CeoDailyProps): React.JSX.Element;
export declare function CeoMeetingOverview({ meetings, id }: {
    meetings: CeoMeeting[];
    id?: string;
}): React.JSX.Element;
/** «Удирдлагын тойм» inside the AppShell, the meeting overview in the aside. */
export declare function CeoDailyScreen({ shell, daily }: {
    shell: Omit<AppShellProps, "children" | "aside">;
    daily: CeoDailyProps;
}): React.JSX.Element;
export declare const ceoDailyDemo: CeoDailyProps;
export declare const ceoDailyLogisticsDemo: CeoDailyProps;
export declare const ceoDailyScreenDemo: {
    shell: Omit<AppShellProps, "children">;
    daily: CeoDailyProps;
};
export default CeoDaily;
