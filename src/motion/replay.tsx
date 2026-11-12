/**
 * <MotionStyles/> — injects the loop keyframes once (React 19 dedupes by href).
 * <Replay/>       — ↺ replay + ⏸/▶ pause, the WCAG 2.2.2 control.
 * <LoopRegion/>   — a box whose loops play only in view, with <Replay/> on it.
 */
import * as React from "react";
import { motionCss } from "./loops";
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

export type ReplayLabels = { replay: string; pause: string; play: string };
export const replayLabelsMn: ReplayLabels = {
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

export type ReplayProps = {
  onReplay: () => void;
  paused: boolean;
  onTogglePause: () => void;
  /** Hide the pause button (for once-only motion shorter than 5 s). */
  showPause?: boolean;
  labels?: Partial<ReplayLabels>;
  className?: string;
};

export function Replay({ onReplay, paused, onTogglePause, showPause = true, labels, className = "" }: ReplayProps) {
  const l = { ...replayLabelsMn, ...labels };
  return (
    <div className={`ts-replay ${className}`} role="group" aria-label={l.replay}>
      <button type="button" className="ts-replay-btn" onClick={onReplay} aria-label={l.replay} title={l.replay}>
        {glyph(ROTATE)}
      </button>
      {showPause && (
        <button
          type="button"
          className="ts-replay-btn"
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
  /** Where the ↺ / ⏸ controls sit. "hover" shows them on hover / focus (always on touch). */
  controls?: "hover" | "always" | "none";
  labels?: Partial<ReplayLabels>;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "section" | "article" | "li";
  onStateChange?: (state: LoopState) => void;
};

export function LoopRegion({
  children,
  controls = "hover",
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
    <Tag ref={loop.ref as React.Ref<never>} className={`ts-loop-region ${className}`} style={style} {...loop.attrs} data-controls={controls}>
      <MotionStyles />
      <React.Fragment key={loop.epoch}>{children}</React.Fragment>
      {controls !== "none" && loop.state !== "reduced" && (
        <Replay onReplay={loop.replay} paused={loop.paused} onTogglePause={loop.togglePaused} labels={labels} />
      )}
    </Tag>
  );
}

const REPLAY_CSS = `
.ts-loop-region { position: relative; --ts-replay-bg: var(--ts-surface, #f7f5ee); --ts-replay-line: var(--ts-line, #d8d3c6); --ts-replay-fg: var(--ts-muted, #5e5a52); --ts-replay-hover: var(--ts-soft, #efebe1); --ts-replay-strong: var(--ts-fg, #080808); }
:where(.dark, [data-theme=dark]) .ts-loop-region { --ts-replay-bg: var(--ts-surface, #141416); --ts-replay-line: var(--ts-line, #2b2b30); --ts-replay-fg: var(--ts-muted, #a1a1aa); --ts-replay-hover: var(--ts-soft, #1e1e21); --ts-replay-strong: var(--ts-fg, #ececef); }
.ts-replay {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  display: inline-flex; gap: 2px; padding: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ts-replay-bg) 88%, transparent);
  border: 1px solid var(--ts-replay-line);
  color: var(--ts-replay-fg);
  backdrop-filter: blur(6px);
  transition: opacity var(--ts-motion-fast, 160ms) var(--ts-motion-ease-standard, ease);
}
.ts-replay-btn {
  all: unset; box-sizing: border-box; cursor: pointer;
  display: grid; place-items: center; width: 24px; height: 24px; border-radius: 999px;
}
.ts-replay-btn:hover { background: var(--ts-replay-hover); color: var(--ts-replay-strong); }
.ts-replay-btn:focus-visible { outline: 2px solid var(--ts-link, #1b5cff); outline-offset: 1px; }
.ts-replay-btn:active svg { transform: scale(0.88); }
.ts-replay-btn svg { transition: transform var(--ts-motion-spring-snappy-duration, 420ms) var(--ts-motion-spring-snappy, ease-out); }
.ts-loop-region[data-controls="hover"] > .ts-replay { opacity: 0; }
.ts-loop-region[data-controls="hover"]:is(:hover, :focus-within) > .ts-replay,
.ts-loop-region[data-controls="hover"][data-ts-loop="paused"] > .ts-replay { opacity: 1; }
@media (hover: none) { .ts-loop-region[data-controls="hover"] > .ts-replay { opacity: 1; } }
`;
