/**
 * useInViewLoop — loops play only while they can be seen.
 *
 * One shared IntersectionObserver for the whole page (not one per loop), plus
 * the tab's visibility, `prefers-reduced-motion`, a page-wide pause from
 * <MotionProvider> and this region's own pause. The result lands on the
 * element as `data-ts-loop="running|offscreen|hidden|paused|reduced"`, which
 * the CSS in loops.ts reads, and WAAPI animations inside are paused/played
 * to match. Nothing runs per frame.
 */
import * as React from "react";

export type LoopState = "running" | "offscreen" | "hidden" | "paused" | "reduced";

type MotionContextValue = { paused: boolean; setPaused: (paused: boolean) => void };
export const MotionContext = React.createContext<MotionContextValue>({ paused: false, setPaused: () => {} });

/** Page-wide pause for every loop below it (WCAG 2.2.2 «бүгдийг зогсоох»). */
export function MotionProvider({
  children,
  paused: controlled,
  onPausedChange,
  defaultPaused = false,
}: {
  children: React.ReactNode;
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  defaultPaused?: boolean;
}) {
  const [own, setOwn] = React.useState(defaultPaused);
  const paused = controlled ?? own;
  const value = React.useMemo(
    () => ({
      paused,
      setPaused: (p: boolean) => {
        if (controlled === undefined) setOwn(p);
        onPausedChange?.(p);
      },
    }),
    [paused, controlled, onPausedChange],
  );
  return React.createElement(MotionContext.Provider, { value }, children);
}

export const useMotion = () => React.useContext(MotionContext);

const REDUCED = "(prefers-reduced-motion: reduce)";

/** Live `prefers-reduced-motion: reduce`. */
export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof matchMedia !== "function") return () => {};
      const mq = matchMedia(REDUCED);
      mq.addEventListener?.("change", cb);
      return () => mq.removeEventListener?.("change", cb);
    },
    () => (typeof matchMedia === "function" ? matchMedia(REDUCED).matches : false),
    () => false,
  );
}

function usePageVisible() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof document === "undefined") return () => {};
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => (typeof document === "undefined" ? true : document.visibilityState !== "hidden"),
    () => true,
  );
}

// ── one IntersectionObserver per (rootMargin, threshold) ─────────────────────
type Watch = (visible: boolean) => void;
const observers = new Map<string, { io: IntersectionObserver; watchers: Map<Element, Set<Watch>> }>();

function observe(el: Element, rootMargin: string, threshold: number, cb: Watch) {
  if (typeof IntersectionObserver === "undefined") {
    cb(true); // no observer (old browser, tests): treat as visible
    return () => {};
  }
  const key = `${rootMargin}|${threshold}`;
  let entry = observers.get(key);
  if (!entry) {
    const watchers = new Map<Element, Set<Watch>>();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          // A region taller than the screen can never show `threshold` of itself,
          // so half a screen of it counts as visible too.
          const screenful = r.rootBounds ? r.intersectionRect.height >= r.rootBounds.height * 0.5 : false;
          const visible = r.isIntersecting && (r.intersectionRatio >= Math.min(threshold, 0.999) || screenful);
          for (const w of watchers.get(r.target) ?? []) w(visible);
        }
      },
      { rootMargin, threshold: [...new Set([0, 0.02, 0.05, 0.1, threshold, 0.25, 0.5])].sort((a, b) => a - b) },
    );
    entry = { io, watchers };
    observers.set(key, entry);
  }
  let set = entry.watchers.get(el);
  if (!set) entry.watchers.set(el, (set = new Set()));
  else entry.io.unobserve(el); // re-observe so the new watcher gets the current state too
  set.add(cb);
  entry.io.observe(el);
  const e = entry;
  return () => {
    const ws = e.watchers.get(el);
    ws?.delete(cb);
    if (ws && ws.size) return;
    e.io.unobserve(el);
    e.watchers.delete(el);
    if (!e.watchers.size) {
      e.io.disconnect();
      observers.delete(key);
    }
  };
}

export type InViewLoopOptions = {
  /** Share of the element that must be visible to play. Default 0.15. */
  threshold?: number;
  /** Grow/shrink the viewport for the test, CSS margin syntax. Default "0px". */
  rootMargin?: string;
  /** Start paused (the user presses ▶). Default false. */
  defaultPaused?: boolean;
};

export type InViewLoop<T extends Element> = {
  /** Put on the region's root element. */
  ref: React.RefCallback<T>;
  state: LoopState;
  /** True while the loops actually move. */
  playing: boolean;
  /** This region's own pause (separate from the page-wide one). */
  paused: boolean;
  setPaused: (paused: boolean) => void;
  togglePaused: () => void;
  /** ↺ — restart every animation in the region from its first frame. */
  replay: () => void;
  /** Restart loops that rested after their cycles (hover, re-entering view). */
  wake: () => void;
  /** Bumps on replay when the browser cannot restart animations itself; use as a React key. */
  epoch: number;
  /** Spread on the root: `data-ts-loop`. */
  attrs: { "data-ts-loop": LoopState };
};

type AnimatableEl = Element & { getAnimations?: (o?: { subtree?: boolean }) => Animation[] };

/** element.animate() animations only — CSS animations follow data-ts-loop, CSS transitions are left alone. */
export function isScripted(a: Animation) {
  if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) return false;
  if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) return false;
  return true;
}

/** Bring one WAAPI animation in line with a loop state. */
export function syncAnimation(a: Animation, state: LoopState) {
  if (state === "running") a.play();
  else if (state === "paused" || state === "reduced") {
    // finish() throws on infinite animations; cancel() drops them back to the rest pose.
    const end = a.effect?.getComputedTiming().endTime;
    if (typeof end === "number" && Number.isFinite(end)) a.finish();
    else a.cancel();
  } else a.pause();
}

/** The loop state of the region `el` sits in, read from the nearest data-ts-loop. */
export function regionState(el: Element): LoopState | null {
  return (el.closest("[data-ts-loop]")?.getAttribute("data-ts-loop") as LoopState | null) ?? null;
}

export function useInViewLoop<T extends Element = HTMLDivElement>(options: InViewLoopOptions = {}): InViewLoop<T> {
  const { threshold = 0.15, rootMargin = "0px", defaultPaused = false } = options;
  const [el, setEl] = React.useState<T | null>(null);
  const [inView, setInView] = React.useState(false);
  // This region's own choice: true = paused, false = playing (even under a page-wide pause), null = follow the page.
  const [own, setOwn] = React.useState<boolean | null>(defaultPaused ? true : null);
  const [epoch, setEpoch] = React.useState(0);
  const page = useMotion();
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisible();

  // A new page-wide choice overrides what single regions chose before it.
  const pagePaused = page.paused;
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setOwn(null);
  }, [pagePaused]);

  React.useEffect(() => {
    if (!el) return;
    return observe(el, rootMargin, threshold, setInView);
  }, [el, rootMargin, threshold]);

  const paused = own ?? pagePaused;
  const state: LoopState = reduced ? "reduced" : paused ? "paused" : !visible ? "hidden" : inView ? "running" : "offscreen";

  // WAAPI animations (element.animate) follow the same state as CSS ones.
  // Ones started later should use animateSpring(), which reads the region state itself.
  React.useEffect(() => {
    const node = el as AnimatableEl | null;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true })) if (isScripted(a)) syncAnimation(a, state);
  }, [el, state]);

  // Loops stop after --ts-motion-loop-count cycles. Coming back into view
  // (or `wake()` on hover) starts the rested ones again.
  const wake = React.useCallback(() => {
    const node = el as AnimatableEl | null;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true }))
      if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation && a.playState === "finished") a.currentTime = 0;
  }, [el]);
  const prev = React.useRef(state);
  React.useEffect(() => {
    if (state === "running" && (prev.current === "offscreen" || prev.current === "hidden")) wake();
    prev.current = state;
  }, [state, wake]);

  const replay = React.useCallback(() => {
    // Paused regions have no animations; playing again re-applies them from frame 0.
    // Only this region resumes — the page-wide pause stays for everything else.
    if (paused) {
      setOwn(false);
      return;
    }
    const node = el as AnimatableEl | null;
    if (node?.getAnimations) {
      for (const a of node.getAnimations({ subtree: true })) {
        if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) continue;
        // Seek only: calling play() on a CSS animation would make it ignore
        // animation-play-state from then on, so offscreen pausing would stop working.
        a.currentTime = 0;
        if (isScripted(a)) a.play();
      }
      return;
    }
    setEpoch((n) => n + 1);
  }, [el, paused]);

  return {
    ref: setEl as React.RefCallback<T>,
    state,
    playing: state === "running",
    paused,
    setPaused: (p) => setOwn(p),
    togglePaused: () => setOwn(!paused),
    replay,
    wake,
    epoch,
    attrs: { "data-ts-loop": state },
  };
}
