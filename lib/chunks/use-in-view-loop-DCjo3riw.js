import * as React from "react";
const MotionContext = React.createContext({ paused: false, setPaused: () => {
} });
function MotionProvider({
  children,
  paused: controlled,
  onPausedChange,
  defaultPaused = false
}) {
  const [own, setOwn] = React.useState(defaultPaused);
  const paused = controlled ?? own;
  const value = React.useMemo(
    () => ({
      paused,
      setPaused: (p) => {
        if (controlled === void 0) setOwn(p);
        onPausedChange?.(p);
      }
    }),
    [paused, controlled, onPausedChange]
  );
  return React.createElement(MotionContext.Provider, { value }, children);
}
const useMotion = () => React.useContext(MotionContext);
const REDUCED = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof matchMedia !== "function") return () => {
      };
      const mq = matchMedia(REDUCED);
      mq.addEventListener?.("change", cb);
      return () => mq.removeEventListener?.("change", cb);
    },
    () => typeof matchMedia === "function" ? matchMedia(REDUCED).matches : false,
    () => false
  );
}
function usePageVisible() {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof document === "undefined") return () => {
      };
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => typeof document === "undefined" ? true : document.visibilityState !== "hidden",
    () => true
  );
}
const observers = /* @__PURE__ */ new Map();
function observe(el, rootMargin, threshold, cb) {
  if (typeof IntersectionObserver === "undefined") {
    cb(true);
    return () => {
    };
  }
  const key = `${rootMargin}|${threshold}`;
  let entry = observers.get(key);
  if (!entry) {
    const watchers = /* @__PURE__ */ new Map();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          const screenful = r.rootBounds ? r.intersectionRect.height >= r.rootBounds.height * 0.5 : false;
          const visible = r.isIntersecting && (r.intersectionRatio >= Math.min(threshold, 0.999) || screenful);
          for (const w of watchers.get(r.target) ?? []) w(visible);
        }
      },
      { rootMargin, threshold: [.../* @__PURE__ */ new Set([0, 0.02, 0.05, 0.1, threshold, 0.25, 0.5])].sort((a, b) => a - b) }
    );
    entry = { io, watchers };
    observers.set(key, entry);
  }
  let set = entry.watchers.get(el);
  if (!set) entry.watchers.set(el, set = /* @__PURE__ */ new Set());
  else entry.io.unobserve(el);
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
function isScripted(a) {
  if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) return false;
  if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) return false;
  return true;
}
function syncAnimation(a, state) {
  if (state === "running") a.play();
  else if (state === "paused" || state === "reduced") {
    const end = a.effect?.getComputedTiming().endTime;
    if (typeof end === "number" && Number.isFinite(end)) a.finish();
    else a.cancel();
  } else a.pause();
}
function regionState(el) {
  return el.closest("[data-ts-loop]")?.getAttribute("data-ts-loop") ?? null;
}
function useInViewLoop(options = {}) {
  const { threshold = 0.15, rootMargin = "0px", defaultPaused = false } = options;
  const [el, setEl] = React.useState(null);
  const [inView, setInView] = React.useState(false);
  const [own, setOwn] = React.useState(defaultPaused ? true : null);
  const [epoch, setEpoch] = React.useState(0);
  const page = useMotion();
  const reduced = usePrefersReducedMotion();
  const visible = usePageVisible();
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
  const state = reduced ? "reduced" : paused ? "paused" : !visible ? "hidden" : inView ? "running" : "offscreen";
  React.useEffect(() => {
    const node = el;
    if (!node?.getAnimations) return;
    for (const a of node.getAnimations({ subtree: true })) if (isScripted(a)) syncAnimation(a, state);
  }, [el, state]);
  const wake = React.useCallback(() => {
    const node = el;
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
    if (paused) {
      setOwn(false);
      return;
    }
    const node = el;
    if (node?.getAnimations) {
      for (const a of node.getAnimations({ subtree: true })) {
        if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) continue;
        a.currentTime = 0;
        if (isScripted(a)) a.play();
      }
      return;
    }
    setEpoch((n) => n + 1);
  }, [el, paused]);
  return {
    ref: setEl,
    state,
    playing: state === "running",
    paused,
    setPaused: (p) => setOwn(p),
    togglePaused: () => setOwn(!paused),
    replay,
    wake,
    epoch,
    attrs: { "data-ts-loop": state }
  };
}
export {
  MotionProvider as M,
  MotionContext as a,
  useMotion as b,
  usePrefersReducedMotion as c,
  regionState as r,
  syncAnimation as s,
  useInViewLoop as u
};
//# sourceMappingURL=use-in-view-loop-DCjo3riw.js.map
