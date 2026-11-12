/**
 * animateSpring — one-shot WAAPI animation on a named spring (enter, toggle,
 * peek open). Reduced motion or no WAAPI: jumps to the last keyframe.
 * Inside a LoopRegion it starts in the region's state (paused → finished).
 */
import type { SpringName } from "./spring";
import { spring } from "./tokens";
import { regionState, syncAnimation } from "./use-in-view-loop";

const supportsLinear = () =>
  typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("animation-timing-function", "linear(0, 1)");

export function prefersReducedMotion() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateSpring(
  el: Element,
  keyframes: Keyframe[],
  name: SpringName = "soft",
  options: { delay?: number; fill?: FillMode } = {},
): Animation | null {
  const last = keyframes[keyframes.length - 1] ?? {};
  const target = el as HTMLElement;
  const region = regionState(el);
  if (prefersReducedMotion() || region === "reduced" || typeof target.animate !== "function") {
    for (const [k, v] of Object.entries(last)) if (k !== "offset" && v != null) target.style.setProperty(k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`), String(v));
    return null;
  }
  const e = spring(name);
  const a = target.animate(keyframes, {
    duration: e.duration,
    easing: supportsLinear() ? e.easing : e.fallback,
    delay: options.delay ?? 0,
    fill: options.fill ?? "both",
  });
  // Started inside a paused / offscreen LoopRegion: follow it like the region's own animations.
  if (region && region !== "running") syncAnimation(a, region);
  return a;
}
