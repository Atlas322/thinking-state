/**
 * The small script that ships inside a chat widget's one-file HTML export.
 * React renders the widget once to static markup; this script gives that
 * markup its behaviour back, using only data attributes the widgets render:
 *
 *   [data-cw-root]            widget root; its parent gets .dark from prefers-color-scheme
 *                             (unless data-cw-theme="light|dark" pins it)
 *   [data-cw-count]           number counts up from 0 (skipped on reduced motion)
 *   [data-cw-view-btn=v]      view switch inside [data-cw-views]; shows the
 *                             matching [data-cw-view-panel=v]
 *   [data-cw-toggle]          button with aria-controls; flips aria-expanded
 *                             and the target's hidden; swaps [data-cw-label].
 *                             With a value (a class name) it toggles that
 *                             class on the closest [data-cw-scope] and makes
 *                             the target inert instead.
 *   [data-cw-scope-btn=v]     All / Mine switch: sets data-scope=v on the
 *                             widget root; CSS hides [data-cw-other] under "mine"
 *   [data-cw-choose=label]    picks an option in its [data-cw-item]
 *   [data-cw-undo]            clears that pick
 *   [data-cw-prompt=text]     sends text back to the chat via window.sendPrompt
 *                             when the host provides it
 *
 * Keep it dependency-free and ES2017: it is serialised with toString().
 */
export function chatRuntime() {
  const w = window as unknown as {
    __cwRuntime?: boolean;
    sendPrompt?: (text: string) => void;
  };
  const doc = document;
  const mq = (q: string) => (window.matchMedia ? window.matchMedia(q) : null);
  const reduce = !!mq("(prefers-reduced-motion: reduce)")?.matches;
  const dark = mq("(prefers-color-scheme: dark)");
  const roots = () => Array.prototype.slice.call(doc.querySelectorAll("[data-cw-root]")) as HTMLElement[];
  const theme = () => {
    roots().forEach((r) => {
      const pinned = r.getAttribute("data-cw-theme");
      const on = pinned ? pinned === "dark" : !!dark?.matches;
      // Widget CSS reads .dark from an ancestor, so mark the wrapper.
      (r.parentElement || r).classList.toggle("dark", on);
    });
  };

  // Every call: set up widgets that arrived since the last one.
  roots().forEach((r) => {
    if (r.hasAttribute("data-cw-ready")) return;
    r.setAttribute("data-cw-ready", "");
    if (reduce || typeof requestAnimationFrame !== "function") return;
    (Array.prototype.slice.call(r.querySelectorAll("[data-cw-count]")) as HTMLElement[]).forEach((el) => {
      const target = Number(el.getAttribute("data-cw-count")) || 0;
      const delay = Number(el.getAttribute("data-cw-delay")) || 0;
      let start = 0;
      el.textContent = "0";
      const tick = (t: number) => {
        if (!start) start = t + delay;
        const p = Math.min(1, Math.max(0, (t - start) / 900));
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });
  theme();

  // Once per page: listeners are delegated, so later widgets need nothing new.
  if (w.__cwRuntime) return;
  w.__cwRuntime = true;
  dark?.addEventListener?.("change", theme);

  const updateLeft = (root: Element | null) => {
    if (!root) return;
    const items = root.querySelectorAll("[data-cw-item]");
    let left = 0;
    for (let i = 0; i < items.length; i++) if (!items[i].hasAttribute("data-chosen")) left++;
    const n = root.querySelector("[data-cw-left-n]");
    if (n) n.textContent = String(left);
    root.querySelector("[data-cw-left]")?.classList.toggle("is-zero", left === 0);
    const done = root.querySelector("[data-cw-all-done]") as HTMLElement | null;
    if (done) done.hidden = left > 0;
  };

  // Arrow keys move the view switch, as in the React component.
  doc.addEventListener("keydown", (e) => {
    const t = e.target as Element | null;
    const btn = t && t.closest ? t.closest("[data-cw-view-btn]") : null;
    if (!btn) return;
    const k = e.key;
    if (k !== "ArrowRight" && k !== "ArrowLeft" && k !== "ArrowDown" && k !== "ArrowUp") return;
    const group = btn.closest("[data-cw-views]");
    if (!group) return;
    const all = Array.prototype.slice.call(group.querySelectorAll("[data-cw-view-btn]")) as HTMLElement[];
    const step = k === "ArrowRight" || k === "ArrowDown" ? 1 : -1;
    const next = all[(all.indexOf(btn as HTMLElement) + step + all.length) % all.length];
    e.preventDefault();
    next.click();
    next.focus();
  });

  doc.addEventListener("click", (e) => {
    const t = e.target as Element | null;
    if (!t || !t.closest) return;

    const scopeBtn = t.closest("[data-cw-scope-btn]");
    if (scopeBtn) {
      const root = scopeBtn.closest("[data-cw-root]");
      const v = scopeBtn.getAttribute("data-cw-scope-btn") || "all";
      if (root) {
        root.setAttribute("data-scope", v);
        root.querySelectorAll("[data-cw-scope-btn]").forEach((b) => {
          const on = b.getAttribute("data-cw-scope-btn") === v;
          b.setAttribute("aria-pressed", String(on));
          if (on) b.setAttribute("data-active", "");
          else b.removeAttribute("data-active");
        });
      }
    }

    const viewBtn = t.closest("[data-cw-view-btn]");
    if (viewBtn) {
      const group = viewBtn.closest("[data-cw-views]");
      const v = viewBtn.getAttribute("data-cw-view-btn");
      if (group) {
        group.querySelectorAll("[data-cw-view-btn]").forEach((b) => {
          const on = b === viewBtn;
          b.setAttribute("aria-checked", String(on));
          b.setAttribute("tabindex", on ? "0" : "-1");
          if (on) b.setAttribute("data-active", "");
          else b.removeAttribute("data-active");
        });
        group.querySelectorAll("[data-cw-view-panel]").forEach((p) => {
          (p as HTMLElement).hidden = p.getAttribute("data-cw-view-panel") !== v;
        });
      }
    }

    const toggle = t.closest("[data-cw-toggle]");
    if (toggle) {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      const id = toggle.getAttribute("aria-controls");
      const target = id ? doc.getElementById(id) : null;
      const cls = toggle.getAttribute("data-cw-toggle");
      if (cls) {
        // Class mode: the scope animates itself; the body only goes inert.
        toggle.closest("[data-cw-scope]")?.classList.toggle(cls, !open);
        if (target) {
          if (open) target.removeAttribute("inert");
          else target.setAttribute("inert", "");
        }
      } else if (target) target.hidden = !open;
      const label = toggle.querySelector("[data-cw-label]");
      const text = toggle.getAttribute(open ? "data-cw-open-label" : "data-cw-closed-label");
      if (label && text) label.textContent = text;
    }

    const choose = t.closest("[data-cw-choose]");
    if (choose) {
      const item = choose.closest("[data-cw-item]");
      if (item) {
        item.setAttribute("data-chosen", "");
        const text = item.querySelector("[data-cw-chosen-text]");
        if (text) text.textContent = choose.getAttribute("data-cw-choose");
        updateLeft(item.closest("[data-cw-root]"));
      }
    }

    const undo = t.closest("[data-cw-undo]");
    if (undo) {
      const item = undo.closest("[data-cw-item]");
      if (item) {
        item.removeAttribute("data-chosen");
        updateLeft(item.closest("[data-cw-root]"));
      }
    }

    const prompt = t.closest("[data-cw-prompt]");
    if (prompt && typeof w.sendPrompt === "function") {
      w.sendPrompt(prompt.getAttribute("data-cw-prompt") || "");
    }
  });
}

export const chatRuntimeSource = `(${chatRuntime.toString()})();`;
