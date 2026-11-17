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
export type Keyframe = "draw" | "blink" | "pulse" | "bob" | "nudge" | "nudge-up" | "nudge-down" | "spin" | "spin-slow" | "turn" | "swing" | "breathe" | "run" | "rise" | "hop" | "slide" | "orbit" | "cursor" | "grow" | "wave";
export type Overlay = {
    kind: "dot-run";
    path: string;
} | {
    kind: "bubbles";
} | {
    kind: "day";
} | {
    kind: "waves";
};
export type IconLoop = {
    dur: number;
    rules: LoopRule[];
    overlay?: Overlay[];
};
/** New Lucide shapes for the loops (ISC): brain, flask, code, file, megaphone. */
export declare const LOOP_SHAPES: {
    readonly brain: readonly ["M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z", "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z", "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4", "M17.599 6.5a3 3 0 0 0 .399-1.375", "M6.003 5.125A3 3 0 0 0 6.401 6.5", "M3.477 10.896a4 4 0 0 1 .585-.396", "M19.938 10.5a4 4 0 0 1 .585.396", "M6 18a4 4 0 0 1-1.967-.516", "M19.967 17.484A4 4 0 0 1 18 18"];
    readonly "flask-conical": readonly ["M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2", "M6.453 15h11.094", "M8.5 2h7"];
    readonly "code-xml": readonly ["m18 16 4-4-4-4", "m6 8-4 4 4 4", "m14.5 4-5 16"];
    readonly file: readonly ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4"];
    readonly megaphone: readonly ["m3 11 18-5v12L3 14v-3z", "M11.6 16.8a3 3 0 1 1-5.8-1.6"];
};
export declare const ICON_LOOP: Record<string, IconLoop>;
/** The CSS for every loop: one rule per icon child, phases from --ts-il-phase. */
export declare function iconLoopCss(): string;
/** A stable phase per icon name, so icons side by side never move in step. */
export declare function loopPhase(name: string): string;
