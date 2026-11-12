/**
 * <Autoplay script> — catalog preview driver (2026-11-13). Plays a short,
 * scripted "user" story on a component that otherwise renders still: clicks,
 * hovers, typing, key presses, each step a real UI state with the component's
 * own spring transitions. It rides on useScenario, so it plays only while in
 * view and visible, once, finishes inside UNCONTROLLED_MAX_MS (WCAG 2.2.2) and
 * under prefers-reduced-motion shows the untouched component.
 *
 * The component itself is not modified — it stays a single self-contained file.
 */
import * as React from "react";
import { useScenario } from "./scenario";

export type AutoTarget = string | { sel: string; text?: string; nth?: number };
export type AutoStep = {
  /** ms to stay on this state after the action. */
  wait: number;
  click?: AutoTarget;
  hover?: AutoTarget;
  type?: { target: AutoTarget; text: string };
  key?: { target?: AutoTarget; key: string };
  /** Hide every match (they fade in later via `show`). */
  hide?: string;
  /** Reveal the next `count` still-hidden matches in DOM order, springing in. */
  show?: { sel: string; count?: number };
  /** Choose option `index` of a native <select>. */
  pick?: { target: AutoTarget; index: number };
};
export type AutoScript = AutoStep[];

const textOf = (el: Element) => (el.textContent || "").replace(/\s+/g, " ").trim();
function find(root: HTMLElement, t: AutoTarget): HTMLElement | null {
  const { sel, text, nth = 0 } = typeof t === "string" ? { sel: t } : t;
  const all = [...root.querySelectorAll<HTMLElement>(sel)].filter((e) => !text || textOf(e).includes(text));
  // portals (menus, popovers) live outside the region
  const outside = all.length || typeof document === "undefined" ? all : [...document.querySelectorAll<HTMLElement>(sel)].filter((e) => !text || textOf(e).includes(text));
  return outside[nth] ?? null;
}
function setValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
const hoverEvents = (el: HTMLElement, on: boolean) =>
  (on ? ["pointerover", "pointerenter", "mouseover", "mouseenter", "pointermove"] : ["pointerout", "pointerleave", "mouseout", "mouseleave"]).forEach((type) =>
    el.dispatchEvent(new MouseEvent(type, { bubbles: type !== "pointerenter" && type !== "mouseenter" && type !== "pointerleave" && type !== "mouseleave" })),
  );

function perform(root: HTMLElement, step: AutoStep, typing: React.MutableRefObject<number[]>) {
  if (step.hide) root.querySelectorAll<HTMLElement>(step.hide).forEach((el) => el.setAttribute("data-ts-hide", ""));
  if (step.show) {
    const hidden = [...root.querySelectorAll<HTMLElement>(step.show.sel)].filter((el) => el.hasAttribute("data-ts-hide"));
    hidden.slice(0, step.show.count ?? 1).forEach((el) => {
      el.setAttribute("data-ts-shown", "");
      el.removeAttribute("data-ts-hide");
    });
  }
  if (step.hover) {
    const el = find(root, step.hover);
    if (el) hoverEvents(el, true);
  }
  if (step.click) find(root, step.click)?.click();
  if (step.key) {
    const el = step.key.target ? find(root, step.key.target) : (document.activeElement as HTMLElement | null);
    el?.dispatchEvent(new KeyboardEvent("keydown", { key: step.key.key, bubbles: true }));
  }
  if (step.pick) {
    const el = find(root, step.pick.target) as HTMLSelectElement | null;
    const value = el?.options[step.pick.index]?.value;
    if (el && value != null) {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set?.call(el, value);
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
  if (step.type) {
    const el = find(root, step.type.target) as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) {
      el.focus({ preventScroll: true });
      const chars = [...step.type.text];
      const gap = Math.max(40, Math.min(110, (step.wait * 0.7) / Math.max(1, chars.length)));
      chars.forEach((_, i) => typing.current.push(window.setTimeout(() => setValue(el, chars.slice(0, i + 1).join("")), gap * (i + 1))));
    }
  }
}

export function Autoplay({ script, children }: { script: AutoScript; children: React.ReactNode }) {
  const steps = React.useMemo(() => script.map((s, i) => ({ state: i, hold: s.wait })), [script]);
  const sc = useScenario<number, HTMLDivElement>(steps, { loops: 1, rest: 0 });
  const root = React.useRef<HTMLDivElement | null>(null);
  const done = React.useRef(-1);
  const typing = React.useRef<number[]>([]);
  const ref = React.useCallback(
    (node: HTMLDivElement | null) => {
      root.current = node;
      sc.ref(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sc.ref],
  );
  React.useEffect(() => {
    if (!sc.playing || !root.current || done.current >= sc.index) return;
    done.current = sc.index;
    perform(root.current, script[sc.index], typing);
  }, [sc.playing, sc.index, script]);
  React.useEffect(() => () => typing.current.forEach(clearTimeout), []);
  return (
    <div ref={ref} className="ts-autoplay" {...sc.attrs} style={{ width: "100%", minWidth: 0 }}>
      <style>{css}</style>
      {children}
    </div>
  );
}

// Reveal choreography: opacity + a short rise on the soft spring (🎨 motion language), compositor-only.
const css = `
.ts-autoplay [data-ts-hide]{opacity:0;transform:translateY(8px);pointer-events:none}
.ts-autoplay [data-ts-hide],.ts-autoplay [data-ts-shown]{transition:opacity var(--ts-motion-dur-md,320ms) var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)),transform var(--ts-motion-spring-soft-duration,560ms) var(--ts-motion-spring-soft,cubic-bezier(.2,0,0,1))}
@media (prefers-reduced-motion:reduce){.ts-autoplay [data-ts-hide],.ts-autoplay [data-ts-shown]{transition:none}}
`;
