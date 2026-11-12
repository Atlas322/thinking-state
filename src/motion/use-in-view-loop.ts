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
const observers = new Map<string, { io: IntersectionObserver; watchers: Map<Element, Watch> }>();

function observe(el: Element, rootMargin: string, threshold: number, cb: Watch) {
  if (typeof IntersectionObserver === "undefined") {
    cb(true); // no observer (old browser, tests): treat as visible
    return () => {};
  }
  const key = `${rootMargin}|${threshold}`;
  let entry = observers.get(key);
  if (!entry) {
    const watchers = new Map<Element, Watch>();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          // A region taller than the screen can never show `threshold` of itself,
          // so half a screen of it counts as visible too.
          const screenful = r.rootBounds ? r.intersectionRect.height >= r.rootBounds.height * 0.5 : false;
          watchers.get(r.target)?.(r.isIntersecting && (r.intersectionRatio >= Math.min(threshold, 0.999) || screenful));
        }
      },
      { rootMargin, threshold: [...new Set([0, 0.02, 0.05, 0.1, threshold, 0.25, 0.5])].sort((a, b) => a - b) },
    );
    entry = { io, watchers };
    observers.set(key, entry);
  }
  entry.watchers.set(el, cb);
  entry.io.observe(el);
  const e = entry;
  return () => {
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
  /** Bumps on replay when the browser cannot restart animations itself; use as a React key. */
  epoch: number;
  /** Spread on the root: `data-ts-loop`. */
  attrs: { "data-ts-loop": LoopState };
};

type AnimatableEl = Element & { getAnimations?: (o?: { subtree?: boolean }) => Animation[] };

export function useInViewLoop<T extends Element = HTMLDivElement>(options: InViewLoopOptions = {}): InViewLoop<T> {
  const { threshold = 0.15, rootMargin = "0px", defaultPaused = false } = options;
  const [el, setEl] = React.useState<T | null>(null);
  const [inView, setInView] = React.useState(false);
  const [paused, setPaused] = React.useState(defaultPaused);
  const [epoch, setEpoch] = React.useState(0);
  const page = useMotion();
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisible();

  React.useEffect(() => {
    if (!el) return;
    return observe(el, rootMargin, threshold, setInView);
  }, [el, rootMargin, threshold]);

  const state: LoopState = reduced
    ? "reduced"
    : paused || page.paused
      ? "paused"
      : !visible
        ? "hidden"
        : inView
          ? "running"
          : "offscreen";

  // WAAPI animations (element.animate) follow the same state as CSS ones.
  React.useEffect(() => {
    const node = el as AnimatableEl | null;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true })) {
      if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) continue; // CSS handles these
      if (state === "running") a.play();
      else if (state === "paused" || state === "reduced") a.finish?.();
      else a.pause();
    }
  }, [el, state]);

  const replay = React.useCallback(() => {
    // Paused regions have no animations; un-pausing re-applies them from frame 0.
    if (paused || page.paused) {
      setPaused(false);
      page.setPaused(false);
      return;
    }
    const node = el as AnimatableEl | null;
    if (node?.getAnimations) {
      for (const a of node.getAnimations({ subtree: true })) {
        a.currentTime = 0;
        a.play();
      }
      return;
    }
    setEpoch((n) => n + 1);
  }, [el, paused, page]);

  return {
    ref: setEl as React.RefCallback<T>,
    state,
    playing: state === "running",
    paused: paused || page.paused,
    setPaused: (p) => {
      setPaused(p);
      if (!p && page.paused) page.setPaused(false);
    },
    togglePaused: () => {
      const next = !(paused || page.paused);
      setPaused(next);
      if (!next && page.paused) page.setPaused(false);
    },
    replay,
    epoch,
    attrs: { "data-ts-loop": state },
  };
}
