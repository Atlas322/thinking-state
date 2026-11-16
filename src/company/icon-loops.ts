/**
 * Meaning loops for the Lucide icons (2026-11-17, owner decision: «each icon needs the animation that
 * says what it is — the brain has a dot running through it»). <Icon animate="loop"> plays the
 * icon's own loop forever: the Lucide paths are never changed, only animated with stroke-dash,
 * transform and opacity, plus a few small overlay marks (a dot, bubbles, a day cell).
 *
 * Rules: calm (2.4–3.6 s, 1–2 px travel), every icon on its own phase (derived from its name,
 * so a menu never moves in step), static under prefers-reduced-motion. Every icon in SHAPES
 * must have an entry here — src/icon-loops.test.ts fails otherwise.
 *
 * A rule is [children, keyframe, delay in s?, extra css?]. Children are 1-based positions in the
 * icon's SHAPES list ("*" = the whole icon, "o1".."o3" = overlay marks).
 */
export type LoopRule = [children: (number | "*" | "o1" | "o2" | "o3")[], keyframe: Keyframe, delay?: number, extra?: string];
export type Keyframe =
  | "draw" | "blink" | "pulse" | "bob" | "nudge" | "nudge-up" | "nudge-down" | "spin" | "spin-slow" | "turn"
  | "swing" | "breathe" | "run" | "rise" | "hop" | "slide" | "orbit" | "cursor" | "grow" | "wave";
export type Overlay = { kind: "dot-run"; path: string } | { kind: "bubbles" } | { kind: "day" } | { kind: "waves" };
export type IconLoop = { dur: number; rules: LoopRule[]; overlay?: Overlay[] };

const BRAIN_L = "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z";
const BRAIN_R = "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z";
// The thought's route inside each half (between the folds, clear of the outline strokes).
const THOUGHT_L = "M9.2 6.8C7 8 8.6 10.4 7 11.6S6.4 15.4 8.6 16.4";
const THOUGHT_R = "M14.8 6.8C17 8 15.4 10.4 17 11.6S17.6 15.4 15.4 16.4";

/** New Lucide shapes for the loops (ISC): brain, flask, code, file, megaphone. */
export const LOOP_SHAPES = {
  brain: [
    BRAIN_L,
    BRAIN_R,
    "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",
    "M17.599 6.5a3 3 0 0 0 .399-1.375",
    "M6.003 5.125A3 3 0 0 0 6.401 6.5",
    "M3.477 10.896a4 4 0 0 1 .585-.396",
    "M19.938 10.5a4 4 0 0 1 .585.396",
    "M6 18a4 4 0 0 1-1.967-.516",
    "M19.967 17.484A4 4 0 0 1 18 18",
  ],
  "flask-conical": [
    "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
    "M6.453 15h11.094",
    "M8.5 2h7",
  ],
  "code-xml": ["m18 16 4-4-4-4", "m6 8-4 4 4 4", "m14.5 4-5 16"],
  file: ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4"],
  // Lucide megaphone (ISC), for «Маркетинг ба контент» (2026-11-17)
  megaphone: ["m3 11 18-5v12L3 14v-3z", "M11.6 16.8a3 3 0 1 1-5.8-1.6"],
} as const;

const L = (dur: number, ...rules: LoopRule[]): IconLoop => ({ dur, rules });
const draw = (dur: number, ...kids: number[]): IconLoop => L(dur, [kids, "draw"]);
const seq = (dur: number, kf: Keyframe, kids: number[], step = 0.25): IconLoop => L(dur, ...kids.map((k, i): LoopRule => [[k], kf, i * step]));

export const ICON_LOOP: Record<string, IconLoop> = {
  // what the menu shows first
  brain: { dur: 3.2, rules: [[[3], "pulse"]], overlay: [{ kind: "dot-run", path: THOUGHT_L }, { kind: "dot-run", path: THOUGHT_R }] }, // a thought runs through both halves
  "file-text": seq(3.2, "draw", [3, 4, 5], 0.35), // lines write themselves
  file: L(3, [["*"], "bob"]),
  megaphone: { dur: 2.8, rules: [[["*"], "swing", 0, "--ts-il-r:-6deg;transform-origin:20% 60%"]], overlay: [{ kind: "waves" }] }, // the horn tilts and sound waves go out
  bot: L(3.4, [[5, 6], "blink"], [[1], "pulse", 0.6]), // eyes blink, antenna glows
  "flask-conical": { dur: 2.8, rules: [[[2], "pulse"]], overlay: [{ kind: "bubbles" }] }, // bubbles rise
  workflow: seq(3, "pulse", [1, 2, 3], 0.45), // nodes connect in turn
  check: draw(2.6, 1),
  "circle-check": draw(2.8, 2),
  "square-check": draw(2.8, 2),
  "shield-check": draw(3, 2),
  "user-check": draw(2.8, 3),
  "code-xml": L(2.4, [[3], "cursor"], [[1], "nudge", 0.2], [[2], "nudge", 0.2, "--ts-il-x:-1px"]), // the slash blinks like a cursor
  search: L(3.2, [["*"], "orbit"]), // the lens scans around
  "search-x": L(3.2, [["*"], "orbit"], [[3, 4], "pulse"]),
  calendar: { dur: 3.6, rules: [], overlay: [{ kind: "day" }] }, // the day moves on
  "calendar-days": seq(3.6, "pulse", [5, 6, 7, 8, 9, 10], 0.3),
  "calendar-x": L(3, [[5, 6], "draw"]),
  // vault and work
  folder: L(3, [["*"], "bob"]),
  "folder-filled": L(3, [["*"], "bob"]), // <Icon name="folder" variant="filled" animate="loop">
  circle: L(3, [["*"], "breathe"]),
  "git-branch": L(3, [[4], "draw"], [[2, 3], "pulse", 0.4]),
  atom: L(3.6, [[2, 3], "spin-slow"], [[1], "pulse"]),
  user: L(3.2, [[2], "bob"]),
  users: L(3.2, [[2], "bob"], [[4, 3], "bob", 0.4]),
  "users-round": L(3.2, [[2], "bob"], [[3], "bob", 0.4]),
  "circle-user": L(3.2, [[2, 3], "bob"]),
  "layout-grid": seq(3.2, "pulse", [1, 2, 3, 4], 0.4),
  "layout-template": seq(3, "pulse", [1, 2, 3], 0.4),
  "layout-dashboard": seq(3.2, "pulse", [1, 2, 3, 4], 0.4),
  sparkles: L(2.8, [[1], "breathe"], [[2, 3, 4, 5], "pulse", 0.5]),
  sun: L(3.6, [[2, 3, 4, 5, 6, 7, 8, 9], "pulse"], [[1], "breathe"]),
  pencil: L(2.8, [["*"], "wave"]), // writes back and forth
  bookmark: L(3, [["*"], "nudge-down"]),
  flag: L(3, [[1], "swing"]),
  "circle-help": L(3, [[3], "blink"], [[2], "pulse", 0.5]),
  "triangle-alert": L(2.6, [[2, 3], "pulse"]),
  "book-open": L(3.4, [[1], "swing", 0, "--ts-il-r:-4deg;transform-origin:right center"], [[2], "swing", 0.3, "--ts-il-r:4deg;transform-origin:left center"]),
  box: L(3, [["*"], "hop"]),
  tag: L(3, [["*"], "swing"]),
  "git-commit-horizontal": L(2.8, [[1], "breathe"], [[2, 3], "draw", 0.3]),
  type: L(3, [[3], "draw"], [[1], "pulse", 0.4]),
  asterisk: L(3.6, [["*"], "spin-slow"]),
  "arrow-up-right": L(2.4, [["*"], "nudge-up"]),
  hash: seq(3, "draw", [1, 2, 3, 4], 0.25),
  "chart-pie": L(3, [[1], "hop"], [[2], "draw", 0.3]),
  "circle-dot": L(2.8, [[2], "breathe"], [[1], "pulse", 0.6]),
  "panel-right": L(3, [[2], "slide"]),
  "rotate-ccw": L(3, [["*"], "turn", 0, "animation-direction:reverse"]), // a full turn, so the arrow never snaps back
  landmark: seq(3.2, "grow", [2, 3, 4, 5], 0.25),
  "building-2": seq(3.2, "pulse", [4, 5, 6, 7], 0.35),
  briefcase: L(3, [["*"], "hop"]),
  network: L(3.2, [[4, 5], "draw"], [[1, 2, 3], "pulse", 0.4]),
  "grid-3x3": seq(3.2, "draw", [2, 4, 3, 5], 0.3),
  database: seq(3, "pulse", [1, 3, 2], 0.4),
  inbox: L(3, [[1], "nudge-down"]),
  play: L(2.4, [["*"], "nudge"]),
  pause: seq(2.4, "pulse", [1, 2], 0.4),
  "arrow-right": L(2.4, [["*"], "nudge"]),
  hourglass: L(3.6, [["*"], "spin-slow"]),
  "message-circle": L(3, [["*"], "bob"]),
  x: draw(2.8, 1, 2),
  archive: L(3, [[1], "hop"], [[3], "pulse", 0.4]),
  table: seq(3, "draw", [3, 4, 1], 0.3),
  list: seq(3.2, "draw", [6, 4, 5], 0.35),
  kanban: seq(3, "grow", [1, 2, 3], 0.3),
  "gantt-chart": seq(3.2, "draw", [4, 2, 3], 0.35),
  "signal-high": seq(2.8, "pulse", [2, 3, 4], 0.25),
  "signal-medium": seq(2.8, "pulse", [2, 3], 0.25),
  "signal-low": seq(2.8, "pulse", [2], 0.25),
  filter: L(3, [["*"], "nudge-down"]),
  layers: seq(3, "hop", [1, 2, 3], 0.3),
  link: L(3, [[1], "nudge", 0, "--ts-il-x:1px"], [[2], "nudge", 0, "--ts-il-x:-1px"]),
  clock: L(3.6, [[2], "spin", 0, "transform-box:view-box;transform-origin:12px 12px"]),
  "chevron-right": L(2.4, [["*"], "nudge"]),
  "chevron-left": L(2.4, [["*"], "nudge", 0, "--ts-il-x:-2px"]),
  "chevron-down": L(2.4, [["*"], "nudge-down"]),
  menu: seq(3, "draw", [2, 1, 3], 0.25),
  "key-round": L(3, [["*"], "swing"]),
  mail: L(3, [[2], "nudge-down"], [[1], "bob", 0.3]),
  ellipsis: seq(2.4, "pulse", [3, 1, 2], 0.25),
};

const KEYFRAMES = `
@keyframes ts-il-draw{0%{stroke-dashoffset:1}40%,78%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}
@keyframes ts-il-blink{0%,42%,50%,100%{transform:scaleY(1)}46%{transform:scaleY(.1)}}
@keyframes ts-il-pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes ts-il-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.5px)}}
@keyframes ts-il-hop{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-1.5px)}}
@keyframes ts-il-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(var(--ts-il-x,2px))}}
@keyframes ts-il-nudge-up{0%,100%{transform:translate(0)}50%{transform:translate(1.5px,-1.5px)}}
@keyframes ts-il-nudge-down{0%,100%{transform:translateY(0)}50%{transform:translateY(1.5px)}}
@keyframes ts-il-spin{to{transform:rotate(360deg)}}
@keyframes ts-il-spin-slow{0%{transform:rotate(0)}40%,100%{transform:rotate(180deg)}}
@keyframes ts-il-turn{0%{transform:rotate(0)}45%,100%{transform:rotate(360deg)}}
@keyframes ts-il-swing{0%,100%{transform:rotate(0)}30%{transform:rotate(var(--ts-il-r,-8deg))}70%{transform:rotate(calc(var(--ts-il-r,-8deg) * -.7))}}
@keyframes ts-il-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes ts-il-grow{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.6)}}
@keyframes ts-il-slide{0%,100%{transform:translateX(0)}50%{transform:translateX(-2px)}}
@keyframes ts-il-wave{0%,100%{transform:translate(0) rotate(0)}50%{transform:translate(-1.5px,1px) rotate(-6deg)}}
@keyframes ts-il-orbit{0%,100%{transform:translate(0,0)}25%{transform:translate(1.2px,-.8px)}50%{transform:translate(0,-1.6px)}75%{transform:translate(-1.2px,-.8px)}}
@keyframes ts-il-cursor{0%,49%{opacity:1}50%,100%{opacity:.15}}
@keyframes ts-il-run{0%{offset-distance:0%;opacity:0}10%,85%{opacity:1}100%{offset-distance:100%;opacity:0}}
@keyframes ts-il-rise{0%{transform:translateY(0);opacity:0}25%{opacity:1}100%{transform:translateY(-6px);opacity:0}}
@keyframes ts-il-wave-out{0%{opacity:0;transform:translateX(-1px) scale(.8)}30%{opacity:1}100%{opacity:0;transform:translateX(2px) scale(1.15)}}
@keyframes ts-il-day{0%,22%{transform:translate(0,0)}25%,47%{transform:translate(4.5px,0)}50%,72%{transform:translate(9px,0)}75%,97%{transform:translate(0,4.5px)}100%{transform:translate(0,0)}}
`;

const sel = (name: string, c: LoopRule[0][number]) =>
  c === "*" ? `.cv-icon[data-loop="${name}"]` : typeof c === "number" ? `.cv-icon[data-loop="${name}"]>:nth-child(${c})` : `.cv-icon[data-loop="${name}"]>.ts-il-${c}`;

/** The CSS for every loop: one rule per icon child, phases from --ts-il-phase. */
export function iconLoopCss(): string {
  let css = KEYFRAMES;
  css += `.cv-icon[data-loop],.cv-icon[data-loop]>*{transform-box:fill-box;transform-origin:center}\n`;
  for (const [name, loop] of Object.entries(ICON_LOOP)) {
    for (const [kids, kf, delay = 0, extra = ""] of loop.rules) {
      const dash = kf === "draw" ? "stroke-dasharray:1;" : "";
      const timing = kf === "spin" || kf === "run" ? "linear" : "ease-in-out";
      css += `${kids.map((k) => sel(name, k)).join(",")}{${dash}animation:ts-il-${kf} ${loop.dur}s ${timing} calc(var(--ts-il-phase,0s) + ${delay}s) infinite;${extra}}\n`;
    }
    (loop.overlay ?? []).forEach((o, i) => {
      const s = sel(name, `o${i + 1}` as "o1");
      if (o.kind === "dot-run") css += `${s}{offset-path:path("${o.path}");offset-rotate:0deg;animation:ts-il-run ${loop.dur}s linear calc(var(--ts-il-phase,0s) + ${i * (loop.dur / 2)}s) infinite}\n`;
      if (o.kind === "bubbles") css += `${s} circle{animation:ts-il-rise ${loop.dur}s ease-out calc(var(--ts-il-phase,0s)) infinite}${s} circle+circle{animation-delay:calc(var(--ts-il-phase,0s) + ${loop.dur / 2}s)}\n`;
      if (o.kind === "waves") css += `${s} path{transform-box:fill-box;transform-origin:left center;animation:ts-il-wave-out ${loop.dur}s ease-out calc(var(--ts-il-phase,0s)) infinite}${s} path+path{animation-delay:calc(var(--ts-il-phase,0s) + ${loop.dur / 3}s)}
`;
      if (o.kind === "day") css += `${s}{transform-box:view-box;transform-origin:0 0;animation:ts-il-day ${loop.dur}s steps(1,end) var(--ts-il-phase,0s) infinite}\n`;
    });
  }
  css += `@media (prefers-reduced-motion:reduce){.cv-icon[data-loop],.cv-icon[data-loop] *{animation:none!important}.cv-icon[data-loop] [data-moving]{display:none}}\n`;
  // Without offset-path on SVG (Safari < 16) the running dots would sit at the corner: hide them.
  css += `@supports not (offset-path:path("M0 0")){.cv-icon[data-loop] [data-run]{display:none}}`;
  return css;
}

/** A stable phase per icon name, so icons side by side never move in step. */
export function loopPhase(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const dur = ICON_LOOP[name]?.dur ?? 3;
  return `${-((h % 97) / 97) * dur}s`;
}
