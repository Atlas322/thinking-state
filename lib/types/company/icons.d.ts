/**
 * One icon set for Thinking State's company views: Lucide shapes (ISC
 * licence, see THIRD_PARTY_NOTICES.md), drawn inline so no package is
 * needed. One style everywhere, shared with the inai.sh Figma icon map
 * («09 Icon map»): 24-unit grid, currentColor, stroke 2 (1.75 below 16 px),
 * rendered at 14 / 16 / 20 px. Colour only ever comes from status or
 * priority; type icons stay in the text colour.
 *
 * Shape codes: "c:cx,cy,r" circle · "r:x,y,w,h,rx" rect · "e:cx,cy,rx,ry"
 * ellipse · "p:points" polygon · anything else is a path.
 */
declare const SHAPES: {
    readonly folder: readonly ["M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"];
    readonly circle: readonly ["c:12,12,10"];
    readonly "circle-check": readonly ["c:12,12,10", "m9 12 2 2 4-4"];
    readonly "git-branch": readonly ["M6 3v12", "c:18,6,3", "c:6,18,3", "M18 9a9 9 0 0 1-9 9"];
    readonly atom: readonly ["c:12,12,1", "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z", "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"];
    readonly user: readonly ["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "c:12,7,4"];
    readonly users: readonly ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "c:9,7,4", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"];
    readonly "layout-grid": readonly ["r:3,3,7,7,1", "r:14,3,7,7,1", "r:14,14,7,7,1", "r:3,14,7,7,1"];
    readonly sparkles: readonly ["M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z", "M20 3v4", "M22 5h-4", "M4 17v2", "M5 18H3"];
    readonly calendar: readonly ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18"];
    readonly "calendar-days": readonly ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18", "M8 14h.01", "M12 14h.01", "M16 14h.01", "M8 18h.01", "M12 18h.01", "M16 18h.01"];
    readonly sun: readonly ["c:12,12,4", "M12 2v2", "M12 20v2", "m4.93 4.93 1.41 1.41", "m17.66 17.66 1.41 1.41", "M2 12h2", "M20 12h2", "m6.34 17.66-1.41 1.41", "m19.07 4.93-1.41 1.41"];
    readonly "file-text": readonly ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4", "M10 9H8", "M16 13H8", "M16 17H8"];
    readonly pencil: readonly ["M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z", "m15 5 4 4"];
    readonly bookmark: readonly ["m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"];
    readonly "users-round": readonly ["M18 21a8 8 0 0 0-16 0", "c:10,8,5", "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"];
    readonly flag: readonly ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"];
    readonly "circle-help": readonly ["c:12,12,10", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"];
    readonly "triangle-alert": readonly ["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", "M12 9v4", "M12 17h.01"];
    readonly "book-open": readonly ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"];
    readonly box: readonly ["M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", "m3.3 7 8.7 5 8.7-5", "M12 22V12"];
    readonly tag: readonly ["M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z", "c:7.5,7.5,.5"];
    readonly "git-commit-horizontal": readonly ["c:12,12,3", "M3 12h6", "M15 12h6"];
    readonly type: readonly ["M4 7V4h16v3", "M9 20h6", "M12 4v16"];
    readonly asterisk: readonly ["M12 6v12", "M17.2 9 6.8 15", "m6.8 9 10.4 6"];
    readonly "arrow-up-right": readonly ["M7 7h10v10", "M7 17 17 7"];
    readonly hash: readonly ["M4 9h16", "M4 15h16", "M10 3 8 21", "M16 3l-2 18"];
    readonly "square-check": readonly ["r:3,3,18,18,2", "m9 12 2 2 4-4"];
    readonly "chart-pie": readonly ["M21 12c.55 0 1-.45.95-1A10 10 0 0 0 13 2.05c-.55-.05-1 .4-1 .95v8a1 1 0 0 0 1 1z", "M21.21 15.89A10 10 0 1 1 8 2.83"];
    readonly "circle-dot": readonly ["c:12,12,10", "c:12,12,1"];
    readonly "panel-right": readonly ["r:3,3,18,18,2", "M15 3v18"];
    readonly "calendar-x": readonly ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18", "m14 14-4 4", "m10 14 4 4"];
    readonly landmark: readonly ["M3 22h18", "M6 18v-7", "M10 18v-7", "M14 18v-7", "M18 18v-7", "p:12,2 20,7 4,7"];
    readonly "building-2": readonly ["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", "M10 6h4", "M10 10h4", "M10 14h4", "M10 18h4"];
    readonly briefcase: readonly ["M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", "r:2,6,20,14,2"];
    readonly bot: readonly ["M12 8V4H8", "r:4,8,16,12,2", "M2 14h2", "M20 14h2", "M15 13v2", "M9 13v2"];
    readonly "layout-template": readonly ["r:3,3,18,7,1", "r:3,14,9,7,1", "r:16,14,5,7,1"];
    readonly "layout-dashboard": readonly ["r:3,3,7,9,1", "r:14,3,7,5,1", "r:14,12,7,9,1", "r:3,16,7,5,1"];
    readonly network: readonly ["r:16,16,6,6,1", "r:2,16,6,6,1", "r:9,2,6,6,1", "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", "M12 12V8"];
    readonly workflow: readonly ["r:3,3,8,8,2", "M7 11v4a2 2 0 0 0 2 2h4", "r:13,13,8,8,2"];
    readonly "grid-3x3": readonly ["r:3,3,18,18,2", "M3 9h18", "M3 15h18", "M9 3v18", "M15 3v18"];
    readonly database: readonly ["e:12,5,9,3", "M3 5V19A9 3 0 0 0 21 19V5", "M3 12A9 3 0 0 0 21 12"];
    readonly inbox: readonly ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"];
    readonly play: readonly ["p:6,3 20,12 6,21"];
    readonly "arrow-right": readonly ["M5 12h14", "m12 5 7 7-7 7"];
    readonly hourglass: readonly ["M5 22h14", "M5 2h14", "M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22", "M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"];
    readonly "message-circle": readonly ["M7.9 20A9 9 0 1 0 4 16.1L2 22Z"];
    readonly check: readonly ["M20 6 9 17l-5-5"];
    readonly x: readonly ["M18 6 6 18", "m6 6 12 12"];
    readonly archive: readonly ["r:2,3,20,5,1", "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", "M10 12h4"];
    readonly table: readonly ["M12 3v18", "r:3,3,18,18,2", "M3 9h18", "M3 15h18"];
    readonly list: readonly ["M3 12h.01", "M3 18h.01", "M3 6h.01", "M8 12h13", "M8 18h13", "M8 6h13"];
    readonly kanban: readonly ["M6 5v11", "M12 5v6", "M18 5v14"];
    readonly "gantt-chart": readonly ["M3 3v16a2 2 0 0 0 2 2h16", "M7 11h8", "M7 16h12", "M7 6h3"];
    readonly "circle-user": readonly ["c:12,12,10", "c:12,10,3", "M7 20.66V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.66"];
    readonly "signal-high": readonly ["M2 20h.01", "M7 20v-4", "M12 20v-8", "M17 20V8"];
    readonly "signal-medium": readonly ["M2 20h.01", "M7 20v-4", "M12 20v-8"];
    readonly "signal-low": readonly ["M2 20h.01", "M7 20v-4"];
    readonly filter: readonly ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"];
    readonly layers: readonly ["M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z", "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65", "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"];
    readonly link: readonly ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"];
    readonly clock: readonly ["c:12,12,10", "M12 6v6l4 2"];
    readonly "search-x": readonly ["c:11,11,8", "m21 21-4.3-4.3", "m13.5 8.5-5 5", "m8.5 8.5 5 5"];
    readonly "chevron-right": readonly ["m9 18 6-6-6-6"];
    readonly "chevron-left": readonly ["m15 18-6-6 6-6"];
    readonly ellipsis: readonly ["c:12,12,1", "c:19,12,1", "c:5,12,1"];
};
export type IconName = keyof typeof SHAPES;
export declare function Icon({ name, size, className, label }: {
    name: IconName;
    size?: 14 | 16 | 20 | number;
    className?: string;
    label?: string;
}): import("react").JSX.Element;
export declare const TYPE_ICON: Record<string, IconName>;
export declare const TYPE_LABEL: Record<string, string>;
/** Page-level badge tint per type (Notion: Projects blue, Tasks green, Calendar red). */
export declare const TYPE_TONE: Record<string, "blue" | "green" | "red" | "violet" | "teal" | "amber" | "yellow" | "gray">;
export declare const typeIcon: (type: string) => IconName;
export declare const typeLabel: (type: string) => string;
export declare const UNIT_ICON: Record<string, IconName>;
export type StatusGroup = "inbox" | "planning" | "active" | "waiting" | "someday" | "done" | "canceled" | "archived";
export declare const STATUS_ORDER: StatusGroup[];
export declare const STATUS: Record<StatusGroup, {
    label: string;
    icon: IconName;
    tone: "gray" | "yellow" | "blue" | "green" | "red";
}>;
/** Maps any vault / Notion status value onto one of the status groups. */
export declare function statusGroup(value: unknown): StatusGroup | null;
export type Priority = "high" | "medium" | "low";
export declare const PRIORITY: Record<Priority, {
    label: string;
    icon: IconName;
    tone: "red" | "yellow" | "gray";
}>;
export declare function priorityOf(value: unknown): Priority | null;
/** Property-kind icons for column headers and the side peek (Notion-style). */
export declare const FIELD_ICON: Record<string, IconName>;
export {};
