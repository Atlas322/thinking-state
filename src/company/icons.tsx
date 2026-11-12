import * as React from "react";

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
const SHAPES = {
  // vault types
  folder: ["M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"],
  circle: ["c:12,12,10"],
  "circle-check": ["c:12,12,10", "m9 12 2 2 4-4"],
  "git-branch": ["M6 3v12", "c:18,6,3", "c:6,18,3", "M18 9a9 9 0 0 1-9 9"],
  atom: [
    "c:12,12,1",
    "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",
    "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",
  ],
  user: ["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "c:12,7,4"],
  users: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "c:9,7,4", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  "layout-grid": ["r:3,3,7,7,1", "r:14,3,7,7,1", "r:14,14,7,7,1", "r:3,14,7,7,1"],
  sparkles: [
    "M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z",
    "M20 3v4",
    "M22 5h-4",
    "M4 17v2",
    "M5 18H3",
  ],
  calendar: ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18"],
  "calendar-days": ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18", "M8 14h.01", "M12 14h.01", "M16 14h.01", "M8 18h.01", "M12 18h.01", "M16 18h.01"],
  sun: ["c:12,12,4", "M12 2v2", "M12 20v2", "m4.93 4.93 1.41 1.41", "m17.66 17.66 1.41 1.41", "M2 12h2", "M20 12h2", "m6.34 17.66-1.41 1.41", "m19.07 4.93-1.41 1.41"],
  "file-text": ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4", "M10 9H8", "M16 13H8", "M16 17H8"],
  pencil: ["M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z", "m15 5 4 4"],
  bookmark: ["m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"],
  "users-round": ["M18 21a8 8 0 0 0-16 0", "c:10,8,5", "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"],
  flag: ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  "circle-help": ["c:12,12,10", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"],
  "triangle-alert": ["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", "M12 9v4", "M12 17h.01"],
  "book-open": ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
  box: ["M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", "m3.3 7 8.7 5 8.7-5", "M12 22V12"],
  tag: ["M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z", "c:7.5,7.5,.5"],
  "git-commit-horizontal": ["c:12,12,3", "M3 12h6", "M15 12h6"],
  type: ["M4 7V4h16v3", "M9 20h6", "M12 4v16"],
  asterisk: ["M12 6v12", "M17.2 9 6.8 15", "m6.8 9 10.4 6"],
  "arrow-up-right": ["M7 7h10v10", "M7 17 17 7"],
  hash: ["M4 9h16", "M4 15h16", "M10 3 8 21", "M16 3l-2 18"],
  "square-check": ["r:3,3,18,18,2", "m9 12 2 2 4-4"],
  "chart-pie": ["M21 12c.55 0 1-.45.95-1A10 10 0 0 0 13 2.05c-.55-.05-1 .4-1 .95v8a1 1 0 0 0 1 1z", "M21.21 15.89A10 10 0 1 1 8 2.83"],
  "circle-dot": ["c:12,12,10", "c:12,12,1"],
  "panel-right": ["r:3,3,18,18,2", "M15 3v18"],
  "calendar-x": ["M8 2v4", "M16 2v4", "r:3,4,18,18,2", "M3 10h18", "m14 14-4 4", "m10 14 4 4"],
  "rotate-ccw": ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"],
  // units
  landmark: ["M3 22h18", "M6 18v-7", "M10 18v-7", "M14 18v-7", "M18 18v-7", "p:12,2 20,7 4,7"],
  "building-2": ["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", "M10 6h4", "M10 10h4", "M10 14h4", "M10 18h4"],
  briefcase: ["M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", "r:2,6,20,14,2"],
  bot: ["M12 8V4H8", "r:4,8,16,12,2", "M2 14h2", "M20 14h2", "M15 13v2", "M9 13v2"],
  // tabs
  "layout-template": ["r:3,3,18,7,1", "r:3,14,9,7,1", "r:16,14,5,7,1"],
  "layout-dashboard": ["r:3,3,7,9,1", "r:14,3,7,5,1", "r:14,12,7,9,1", "r:3,16,7,5,1"],
  network: ["r:16,16,6,6,1", "r:2,16,6,6,1", "r:9,2,6,6,1", "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", "M12 12V8"],
  workflow: ["r:3,3,8,8,2", "M7 11v4a2 2 0 0 0 2 2h4", "r:13,13,8,8,2"],
  "grid-3x3": ["r:3,3,18,18,2", "M3 9h18", "M3 15h18", "M9 3v18", "M15 3v18"],
  database: ["e:12,5,9,3", "M3 5V19A9 3 0 0 0 21 19V5", "M3 12A9 3 0 0 0 21 12"],
  // status groups
  inbox: ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"],
  play: ["p:6,3 20,12 6,21"],
  pause: ["M8 5v14", "M16 5v14"],
  "arrow-right": ["M5 12h14", "m12 5 7 7-7 7"],
  hourglass: ["M5 22h14", "M5 2h14", "M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22", "M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"],
  "message-circle": ["M7.9 20A9 9 0 1 0 4 16.1L2 22Z"],
  check: ["M20 6 9 17l-5-5"],
  x: ["M18 6 6 18", "m6 6 12 12"],
  archive: ["r:2,3,20,5,1", "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", "M10 12h4"],
  // views and actions
  table: ["M12 3v18", "r:3,3,18,18,2", "M3 9h18", "M3 15h18"],
  list: ["M3 12h.01", "M3 18h.01", "M3 6h.01", "M8 12h13", "M8 18h13", "M8 6h13"],
  kanban: ["M6 5v11", "M12 5v6", "M18 5v14"],
  "gantt-chart": ["M3 3v16a2 2 0 0 0 2 2h16", "M7 11h8", "M7 16h12", "M7 6h3"],
  "circle-user": ["c:12,12,10", "c:12,10,3", "M7 20.66V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.66"],
  "signal-high": ["M2 20h.01", "M7 20v-4", "M12 20v-8", "M17 20V8"],
  "signal-medium": ["M2 20h.01", "M7 20v-4", "M12 20v-8"],
  "signal-low": ["M2 20h.01", "M7 20v-4"],
  filter: ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  layers: [
    "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
    "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",
    "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",
  ],
  link: ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
  clock: ["c:12,12,10", "M12 6v6l4 2"],
  "search-x": ["c:11,11,8", "m21 21-4.3-4.3", "m13.5 8.5-5 5", "m8.5 8.5 5 5"],
  "chevron-right": ["m9 18 6-6-6-6"],
  "chevron-left": ["m15 18-6-6 6-6"],
  // site + consent (Lucide, ISC)
  menu: ["M4 12h16", "M4 6h16", "M4 18h16"],
  "chevron-down": ["m6 9 6 6 6-6"],
  "shield-check": [
    "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
    "m9 12 2 2 4-4",
  ],
  "key-round": [
    "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
    "c:16.5,7.5,.5",
  ],
  mail: ["r:2,4,20,16,2", "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"],
  search: ["c:11,11,8", "m21 21-4.3-4.3"],
  "user-check": ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "c:9,7,4", "m16 11 2 2 4-4"],
  ellipsis: ["c:12,12,1", "c:19,12,1", "c:5,12,1"],
} as const;

export type IconName = keyof typeof SHAPES;

function shape(s: string, i: number) {
  const [kind, rest] = s.length > 2 && s[1] === ":" ? [s[0], s.slice(2)] : ["d", s];
  if (kind === "c") {
    const [cx, cy, r] = rest.split(",");
    return <circle key={i} cx={cx} cy={cy} r={r} />;
  }
  if (kind === "r") {
    const [x, y, w, h, rx] = rest.split(",");
    return <rect key={i} x={x} y={y} width={w} height={h} rx={rx} />;
  }
  if (kind === "e") {
    const [cx, cy, rx, ry] = rest.split(",");
    return <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} />;
  }
  if (kind === "p") return <polygon key={i} points={rest} />;
  return <path key={i} d={rest} />;
}

/**
 * Filled variants (2026-11-12): projects, folders and groups use a
 * solid yellow folder (--ts-folder #E8B931) instead of Lucide's outline.
 */
const FILLED: Partial<Record<IconName, (size: number) => React.ReactNode>> = {
  folder: () => (
    <>
      <path
        d="M2.5 6.2A2.2 2.2 0 0 1 4.7 4h3.6c.6 0 1.2.25 1.6.7l1.2 1.3h8.2a2.2 2.2 0 0 1 2.2 2.2v9.6a2.2 2.2 0 0 1-2.2 2.2H4.7a2.2 2.2 0 0 1-2.2-2.2Z"
        fill="var(--ts-folder,#e8b931)"
      />
      <path d="M2.5 9.2h19v8.6a2.2 2.2 0 0 1-2.2 2.2H4.7a2.2 2.2 0 0 1-2.2-2.2Z" fill="var(--ts-folder,#e8b931)" />
      <path d="M2.5 9.2h19" stroke="color-mix(in srgb,var(--ts-folder,#e8b931) 70%,#000)" strokeOpacity=".35" strokeWidth="1" fill="none" />
    </>
  ),
};

export function Icon({
  name,
  size = 16,
  className = "",
  label,
  variant = "line",
  animate = false,
}: {
  name: IconName;
  size?: 14 | 16 | 20 | number;
  className?: string;
  label?: string;
  /** "filled" draws the solid variant where one exists (folder); other icons stay line. */
  variant?: "line" | "filled";
  /**
   * Animated Lucide (lucide-animated, MIT): true / "hover" plays the icon's
   * motion when it or its link / button is hovered or focused; "once" plays it
   * when it mounts. Transform, opacity and stroke only; off under reduced motion.
   */
  animate?: boolean | "hover" | "once";
}) {
  const filled = variant === "filled" ? FILLED[name] : undefined;
  const anim = animate ? { "data-anim": ANIM_OF[name] ?? "pop", "data-anim-on": animate === "once" ? "once" : "hover" } : undefined;
  const animStyle = animate ? (
    <style href="ts-icon-anim" precedence="default">
      {ICON_ANIM_CSS}
    </style>
  ) : null;
  if (filled)
    return (
      <>
      {animStyle}
      <svg
        {...anim}
        className={`cv-icon is-filled ${className}`}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
      >
        {filled(size)}
      </svg>
      </>
    );
  return (
    <>
    {animStyle}
    <svg
      {...anim}
      className={`cv-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={size < 16 ? 1.75 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {SHAPES[name].map(shape)}
    </svg>
    </>
  );
}

/* ───────── animated Lucide: one motion per icon family (lucide-animated, MIT) ───────── */

type Anim = "draw" | "nudge" | "nudge-up" | "nudge-down" | "spin" | "spin-back" | "bob" | "swing" | "pop";
const ANIM_OF: Partial<Record<IconName, Anim>> = {
  check: "draw",
  "circle-check": "draw",
  "square-check": "draw",
  "shield-check": "draw",
  "user-check": "draw",
  "arrow-right": "nudge",
  "arrow-up-right": "nudge-up",
  "chevron-right": "nudge",
  "chevron-left": "nudge",
  "chevron-down": "nudge-down",
  "rotate-ccw": "spin-back",
  sun: "spin",
  sparkles: "pop",
  atom: "spin",
  bot: "bob",
  play: "nudge",
  mail: "bob",
  "message-circle": "swing",
  "triangle-alert": "swing",
  flag: "swing",
  calendar: "swing",
  "calendar-days": "swing",
  hourglass: "spin",
  search: "swing",
  link: "swing",
  folder: "bob",
  workflow: "bob",
  "key-round": "swing",
};
const ICON_ANIM_CSS = `
@keyframes ts-ia-nudge{40%{transform:translateX(3px)}}
@keyframes ts-ia-nudge-up{40%{transform:translate(2px,-2px)}}
@keyframes ts-ia-nudge-down{40%{transform:translateY(2px)}}
@keyframes ts-ia-spin{to{transform:rotate(180deg)}}
@keyframes ts-ia-spin-back{to{transform:rotate(-360deg)}}
@keyframes ts-ia-bob{40%{transform:translateY(-2px)}}
@keyframes ts-ia-swing{25%{transform:rotate(-12deg)}75%{transform:rotate(10deg)}}
@keyframes ts-ia-pop{40%{transform:scale(1.18)}}
.cv-icon[data-anim]{transform-box:fill-box;transform-origin:center}
:is(a,button,[role=button],[role=tab],[role=radio],[role=menuitem]):is(:hover,:focus-visible) .cv-icon[data-anim-on=hover],.cv-icon[data-anim-on=hover]:hover,.cv-icon[data-anim-on=once]{animation:var(--ts-ia) var(--ts-motion-spring-soft-duration,600ms) var(--ts-motion-spring-soft,cubic-bezier(.2,.8,.3,1)) both}
.cv-icon[data-anim=draw]{--ts-ia:ts-ia-pop}
.cv-icon[data-anim=nudge]{--ts-ia:ts-ia-nudge}.cv-icon[data-anim=nudge-up]{--ts-ia:ts-ia-nudge-up}.cv-icon[data-anim=nudge-down]{--ts-ia:ts-ia-nudge-down}
.cv-icon[data-anim=spin]{--ts-ia:ts-ia-spin}.cv-icon[data-anim=spin-back]{--ts-ia:ts-ia-spin-back}
.cv-icon[data-anim=bob]{--ts-ia:ts-ia-bob}.cv-icon[data-anim=swing]{--ts-ia:ts-ia-swing}.cv-icon[data-anim=pop]{--ts-ia:ts-ia-pop}
@media (prefers-reduced-motion:reduce){.cv-icon[data-anim]{animation:none!important}}
`;

/* ───────── maps: one place for type → icon and status → icon + tone ───────── */

export const TYPE_ICON: Record<string, IconName> = {
  project: "folder",
  task: "circle",
  "session-decision": "git-branch",
  decision: "git-branch",
  atomic: "atom",
  person: "user",
  area: "layout-grid",
  skill: "sparkles",
  event: "calendar",
  daily: "sun",
  note: "pencil",
  reference: "book-open",
  resource: "book-open",
  glossary: "book-open",
  agent: "bot",
  "ai-worker": "bot",
  workflow: "sparkles",
  meeting: "users-round",
  milestone: "flag",
  ask: "circle-help",
  risk: "triangle-alert",
  product: "box",
  release: "tag",
  commit: "git-commit-horizontal",
  output: "file-text",
  company: "building-2",
  inbox: "inbox",
};
export const TYPE_LABEL: Record<string, string> = {
  project: "Төсөл",
  task: "Даалгавар",
  "session-decision": "Шийдвэр",
  decision: "Шийдвэр",
  atomic: "Атом",
  person: "Хүн",
  area: "Чиглэл",
  skill: "Ур чадвар",
  event: "Үйл явдал",
  daily: "Өдрийн тэмдэглэл",
  note: "Нот",
  reference: "Лавлагаа",
  resource: "Лавлагаа",
  agent: "Агент",
  "ai-worker": "AI ажилтан",
  workflow: "Ажлын урсгал",
  meeting: "Уулзалт",
  milestone: "Чухал үе",
  ask: "Асуулт",
  risk: "Эрсдэл",
  glossary: "Нэр томьёо",
  product: "Бүтээгдэхүүн",
  release: "Хувилбар",
  commit: "Коммит",
  output: "Гаралт",
  company: "Компани",
  inbox: "Ирсэн",
};
/** Page-level badge tint per type (Notion: Projects blue, Tasks green, Calendar red). */
export const TYPE_TONE: Record<string, "blue" | "green" | "red" | "violet" | "teal" | "amber" | "yellow" | "gray"> = {
  project: "blue",
  task: "green",
  "session-decision": "violet",
  decision: "violet",
  atomic: "teal",
  person: "violet",
  area: "gray",
  skill: "amber",
  event: "red",
  meeting: "red",
  daily: "yellow",
  note: "gray",
  reference: "gray",
  resource: "gray",
  glossary: "gray",
  agent: "blue",
  "ai-worker": "blue",
  milestone: "red",
  risk: "red",
  product: "teal",
  company: "blue",
};
export const typeIcon = (type: string): IconName => TYPE_ICON[type] ?? "file-text";
export const typeLabel = (type: string) => TYPE_LABEL[type] ?? type;

export const UNIT_ICON: Record<string, IconName> = {
  institution: "landmark",
  company: "building-2",
  department: "briefcase",
  team: "users",
  area: "layout-grid",
  stream: "workflow",
};

export type StatusGroup = "inbox" | "planning" | "active" | "waiting" | "someday" | "done" | "canceled" | "archived";
export const STATUS_ORDER: StatusGroup[] = ["inbox", "planning", "active", "waiting", "someday", "done", "canceled", "archived"];
export const STATUS: Record<StatusGroup, { label: string; icon: IconName; tone: "gray" | "yellow" | "blue" | "green" | "red" }> = {
  inbox: { label: "Ирсэн", icon: "inbox", tone: "gray" },
  planning: { label: "Төлөвлөж буй", icon: "hourglass", tone: "gray" },
  active: { label: "Идэвхтэй", icon: "arrow-right", tone: "yellow" },
  waiting: { label: "Хүлээгдэж буй", icon: "hourglass", tone: "blue" },
  someday: { label: "Хэзээ нэгэн цагт", icon: "message-circle", tone: "gray" },
  done: { label: "Дууссан", icon: "check", tone: "green" },
  canceled: { label: "Цуцалсан", icon: "x", tone: "red" },
  archived: { label: "Архив", icon: "archive", tone: "gray" },
};

/** Maps any vault / Notion status value onto one of the status groups. */
export function statusGroup(value: unknown): StatusGroup | null {
  if (value == null || value === "") return null;
  const v = String(value).toLowerCase().trim().replace(/[\s_]+/g, "-");
  if (["inbox", "new", "todo", "to-do", "not-started"].includes(v)) return "inbox";
  if (["planning", "plan", "next-action", "next", "backlog", "idea"].includes(v)) return "planning";
  if (["in-progress", "active", "doing", "running", "ongoing", "started", "wip"].includes(v)) return "active";
  if (["waiting", "waiting-on", "blocked", "stuck", "on-hold", "paused", "review"].includes(v)) return "waiting";
  if (["someday", "maybe", "someday-maybe", "someday-/-maybe"].includes(v)) return "someday";
  if (["done", "completed", "complete", "finished", "merged", "closed"].includes(v)) return "done";
  if (["canceled", "cancelled", "dropped", "abandoned"].includes(v)) return "canceled";
  if (["archived", "archive"].includes(v)) return "archived";
  return null;
}

export type Priority = "high" | "medium" | "low";
export const PRIORITY: Record<Priority, { label: string; icon: IconName; tone: "red" | "yellow" | "gray" }> = {
  high: { label: "Өндөр", icon: "signal-high", tone: "red" },
  medium: { label: "Дунд", icon: "signal-medium", tone: "yellow" },
  low: { label: "Бага", icon: "signal-low", tone: "gray" },
};
export function priorityOf(value: unknown): Priority | null {
  const v = String(value ?? "").toLowerCase().trim();
  if (["high", "h", "p1", "urgent", "өндөр"].includes(v)) return "high";
  if (["medium", "med", "m", "p2", "normal", "дунд"].includes(v)) return "medium";
  if (["low", "l", "p3", "бага"].includes(v)) return "low";
  return null;
}

/** Property-kind icons for column headers and the side peek (Notion-style). */
export const FIELD_ICON: Record<string, IconName> = {
  title: "type",
  text: "type",
  status: "asterisk",
  date: "calendar-days",
  relation: "arrow-up-right",
  priority: "signal-medium",
  select: "circle-dot",
  multi: "tag",
  number: "hash",
  checkbox: "square-check",
  url: "link",
  progress: "chart-pie",
};
