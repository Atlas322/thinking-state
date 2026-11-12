/**
 * <MotionStyles/> — injects the loop keyframes once (React 19 dedupes by href).
 * <MotionControls/> — ↺ replay + ⏸/▶ pause, the WCAG 2.2.2 control.
 *                    (src/replay/replay.tsx's <Replay> is the simpler ↺-only wrapper.)
 * <LoopRegion/>   — a box whose loops play only in view, with <MotionControls/> on it.
 */
import * as React from "react";
import { loopAnimation, motionCss, type LoopName, type Rhythm } from "./loops";
import { useInViewLoop, type InViewLoopOptions, type LoopState } from "./use-in-view-loop";

let styles: { css: string; href: string } | undefined;
/** React 19 hoists and dedupes this by href; the hash keeps two package versions apart. */
export function MotionStyles() {
  if (!styles) {
    const css = motionCss() + REPLAY_CSS;
    let h = 0;
    for (let i = 0; i < css.length; i++) h = (Math.imul(h, 31) + css.charCodeAt(i)) | 0;
    styles = { css, href: `ts-motion-${(h >>> 0).toString(36)}` };
  }
  return (
    <style href={styles.href} precedence="default">
      {styles.css}
    </style>
  );
}

/**
 * A loop at its own rhythm: injects the keyframes once and returns the class
 * + inline style to put on the moving element.
 *   const l = useLoop("bob", { move: 900, rest: 4000, spring: "settle" });
 *   <>{l.keyframes}<span {...l.props}>…</span></>
 */
export function useLoop(loop: LoopName, rhythm: Rhythm = {}, style?: React.CSSProperties) {
  const a = loopAnimation(loop, rhythm);
  return {
    keyframes: (
      <style href={a.name} precedence="default">
        {a.css}
      </style>
    ),
    props: {
      className: `ts-loop ts-loop-${loop}`,
      style: { animationName: a.name, animationDuration: `${a.period}ms`, ...style } as React.CSSProperties,
    },
  };
}

export type MotionControlLabels = { replay: string; pause: string; play: string };
export const motionControlLabelsMn: MotionControlLabels = {
  replay: "Дахин тоглуулах",
  pause: "Хөдөлгөөнийг зогсоох",
  play: "Хөдөлгөөнийг үргэлжлүүлэх",
};

const glyph = (d: string[]) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </svg>
);
// Lucide rotate-ccw, pause, play (ISC).
const ROTATE = ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"];
const PAUSE = ["M14 4h4v16h-4z", "M6 4h4v16H6z"];
const PLAY = ["M6 3l14 9-14 9z"];

export type MotionControlsProps = {
  onReplay: () => void;
  paused: boolean;
  onTogglePause: () => void;
  /** Hide the pause button (for once-only motion shorter than 5 s). */
  showPause?: boolean;
  labels?: Partial<MotionControlLabels>;
  className?: string;
};

export function MotionControls({ onReplay, paused, onTogglePause, showPause = true, labels, className = "" }: MotionControlsProps) {
  const l = { ...motionControlLabelsMn, ...labels };
  return (
    <div className={`ts-motion-ctl ${className}`} role="group" aria-label={l.replay}>
      <button type="button" className="ts-motion-ctl-btn" onClick={onReplay} aria-label={l.replay} title={l.replay}>
        {glyph(ROTATE)}
      </button>
      {showPause && (
        <button
          type="button"
          className="ts-motion-ctl-btn"
          onClick={onTogglePause}
          aria-label={paused ? l.play : l.pause}
          aria-pressed={paused}
          title={paused ? l.play : l.pause}
        >
          {glyph(paused ? PLAY : PAUSE)}
        </button>
      )}
    </div>
  );
}

export type LoopRegionProps = InViewLoopOptions & {
  children: React.ReactNode;
  /**
   * Where the ↺ / ⏸ controls sit. "hover" shows them on hover / focus (always
   * on touch). Default "none" (web blocks): the loops then play one cycle
   * only, so the motion ends by itself (WCAG 2.2.2).
   */
  controls?: "hover" | "always" | "none";
  labels?: Partial<MotionControlLabels>;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "section" | "article" | "li";
  onStateChange?: (state: LoopState) => void;
};

export function LoopRegion({
  children,
  controls = "none",
  labels,
  className = "",
  style,
  as: Tag = "div",
  onStateChange,
  ...options
}: LoopRegionProps) {
  const loop = useInViewLoop<HTMLElement>(options);
  React.useEffect(() => onStateChange?.(loop.state), [loop.state, onStateChange]);
  return (
    <Tag
      ref={loop.ref as React.Ref<never>}
      className={`ts-loop-region ${className}`}
      style={controls === "none" ? ({ "--ts-motion-loop-count": 1, ...style } as React.CSSProperties) : style}
      {...loop.attrs}
      data-controls={controls}
      onPointerEnter={loop.wake}
    >
      <MotionStyles />
      <React.Fragment key={loop.epoch}>{children}</React.Fragment>
      {controls !== "none" && loop.state !== "reduced" && (
        <MotionControls onReplay={loop.replay} paused={loop.paused} onTogglePause={loop.togglePaused} labels={labels} />
      )}
    </Tag>
  );
}

const REPLAY_CSS = `
.ts-loop-region { position: relative; --ts-ctl-bg: var(--ts-surface, #f7f5ee); --ts-ctl-line: var(--ts-line, #d8d3c6); --ts-ctl-fg: var(--ts-muted, #5e5a52); --ts-ctl-hover: var(--ts-soft, #efebe1); --ts-ctl-strong: var(--ts-fg, #080808); }
:where(.dark, [data-theme=dark]) .ts-loop-region { --ts-ctl-bg: var(--ts-surface, #141416); --ts-ctl-line: var(--ts-line, #2b2b30); --ts-ctl-fg: var(--ts-muted, #a1a1aa); --ts-ctl-hover: var(--ts-soft, #1e1e21); --ts-ctl-strong: var(--ts-fg, #ececef); }
.ts-motion-ctl {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  display: inline-flex; gap: 2px; padding: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ts-ctl-bg) 88%, transparent);
  border: 1px solid var(--ts-ctl-line);
  color: var(--ts-ctl-fg);
  backdrop-filter: blur(6px);
  transition: opacity var(--ts-motion-dur-xs, 120ms) var(--ts-motion-ease-standard, ease);
}
.ts-motion-ctl-btn {
  all: unset; box-sizing: border-box; cursor: pointer;
  display: grid; place-items: center; width: 24px; height: 24px; border-radius: 999px;
}
.ts-motion-ctl-btn:hover { background: var(--ts-ctl-hover); color: var(--ts-ctl-strong); }
.ts-motion-ctl-btn:focus-visible { outline: 2px solid var(--ts-link, #1b5cff); outline-offset: 1px; }
.ts-motion-ctl-btn:active svg { transform: scale(0.88); }
.ts-motion-ctl-btn svg { transition: transform var(--ts-motion-dur-sm, 200ms) var(--ts-motion-ease-standard, ease-out); }
.ts-loop-region[data-controls="hover"] > .ts-motion-ctl { opacity: 0; }
.ts-loop-region[data-controls="hover"]:is(:hover, :focus-within) > .ts-motion-ctl,
.ts-loop-region[data-controls="hover"][data-ts-loop="paused"] > .ts-motion-ctl { opacity: 1; }
/* Inside a <Replay> wrapper (catalog, inai.sh) its ↺ owns the corner: sit beside it. */
.ts-replay-body .ts-loop-region > .ts-motion-ctl { right: 46px; }
.ts-scenario-steps { position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%); display: inline-flex; gap: 4px; pointer-events: none; }
.ts-scenario-steps i { width: 6px; height: 6px; border-radius: 3px; background: var(--ts-ctl-line); transition: width var(--ts-motion-dur-sm, 200ms) var(--ts-motion-ease-standard, ease), background var(--ts-motion-dur-sm, 200ms); }
.ts-scenario-steps i[data-on] { width: 16px; background: var(--ts-selected, #0c8ce9); }
@media (hover: none) { .ts-loop-region[data-controls="hover"] > .ts-motion-ctl { opacity: 1; } }
`;
