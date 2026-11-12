import * as React from "react";
import { Icon } from "../company/icons";

/**
 * Replay — wrap any component to give it a ↺ button (top right) that
 * re-mounts it, so its entry animation and state start over. One source for
 * the catalog preview and inai.sh.
 * - Accessible: a real button, `aria-label="Дахин тоглуулах"`, focus ring,
 *   works with Enter / Space.
 * - Reduced motion: the button stays, and the child shows its final state
 *   straight away (animations and transitions inside are switched off).
 * - Theme: reads --ts-* tokens (cream, manage) with neutral fallbacks.
 */
export type ReplayProps = {
  children: React.ReactNode;
  /** Accessible name and tooltip. */
  label?: string;
  /** Called after each replay (e.g. to reset outside state). */
  onReplay?: () => void;
  /** Hide the button without removing the wrapper. */
  showButton?: boolean;
  /**
   * "inside" (default): ↺ floats over the top-right corner.
   * "outside": a 38 px strip is kept above the content for ↺, so it never
   * covers the component's own top-right controls (e.g. CompanyView's methodology switch).
   */
  placement?: "inside" | "outside";
  className?: string;
  style?: React.CSSProperties;
};

export function Replay({ children, label = "Дахин тоглуулах", onReplay, showButton = true, placement = "inside", className = "", style }: ReplayProps) {
  const [run, setRun] = React.useState(0);
  return (
    <div className={`ts-replay ${className}`} style={style} data-run={run} data-placement={showButton ? placement : undefined}>
      <style>{css}</style>
      {showButton && (
        <button
          type="button"
          className="ts-replay-btn"
          aria-label={label}
          title={label}
          onClick={() => {
            setRun((n) => n + 1);
            onReplay?.();
          }}
        >
          <Icon name="rotate-ccw" size={16} />
        </button>
      )}
      <div className="ts-replay-body" key={run}>
        {children}
      </div>
    </div>
  );
}

/** HOC form: `const ReplayableCard = withReplay(Card)`. */
export function withReplay<P extends object>(Component: React.ComponentType<P>, options: Omit<ReplayProps, "children"> = {}) {
  const Wrapped = (props: P) => (
    <Replay {...options}>
      <Component {...props} />
    </Replay>
  );
  Wrapped.displayName = `withReplay(${Component.displayName ?? Component.name ?? "Component"})`;
  return Wrapped;
}

const css = `
.ts-replay{position:relative;width:100%;min-width:0}
.ts-replay-body{min-width:0}
.ts-replay[data-placement=outside]{padding-top:38px}
.ts-replay[data-placement=outside]>.ts-replay-btn{top:0}
.ts-replay-btn{position:absolute;top:8px;right:8px;z-index:3;display:grid;place-items:center;width:30px;height:30px;padding:0;border:1px solid var(--ts-line,#e4e4e7);border-radius:8px;background:var(--ts-surface,#fff);color:var(--ts-muted,#71717a);box-shadow:0 1px 2px #0000000f;cursor:pointer;opacity:.82;transition:opacity .15s,color .15s,background .15s,transform .2s}
.ts-replay-btn:hover{opacity:1;color:var(--ts-fg,#18181b);background:var(--ts-soft,#f4f4f5)}
.ts-replay-btn:active .cv-icon{transform:rotate(-120deg)}
.ts-replay-btn .cv-icon{transition:transform .35s cubic-bezier(.2,.8,.3,1)}
.ts-replay-btn:focus-visible{outline:2px solid var(--ts-accent,#4f7cf0);outline-offset:2px;opacity:1}
:where(.dark,[data-theme=dark]) .ts-replay-btn{border-color:var(--ts-line,#2e2e33);background:var(--ts-surface,#1b1b1e);color:var(--ts-muted,#a1a1aa)}
:where(.dark,[data-theme=dark]) .ts-replay-btn:hover{color:var(--ts-fg,#ececef);background:var(--ts-soft,#26262a)}
@media (prefers-reduced-motion: reduce){
.ts-replay-body *,.ts-replay-body *::before,.ts-replay-body *::after{animation:none!important;transition:none!important}
.ts-replay-btn,.ts-replay-btn .cv-icon{transition:none}
}
`;

export default Replay;
