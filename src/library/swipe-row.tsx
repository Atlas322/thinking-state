// @ts-nocheck — ported from React Bits (JavaScript + CSS variant) with minimal changes.
"use client";

/**
 * Swipe Row — source: React Bits (https://reactbits.dev), MIT + Commons Clause.
 * Changes: CSS inlined through <style>, the Hugeicons delete glyph replaced by an inline SVG
 * (no icon package needed), named export added, local example appended. Dependency: motion.
 */

import * as React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

export type SwipeAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  dismiss?: boolean;
  onSelect?: () => void;
};
export type SwipeRowProps = {
  children?: React.ReactNode;
  actions?: SwipeAction[];
  actionColor?: string;
  drawerColor?: string;
  rowColor?: string;
  textColor?: string;
  height?: number;
  radius?: number;
  actionWidth?: number;
  direction?: "left" | "right";
  snapBounce?: number;
  resistance?: number;
  collapseMs?: number;
  commitAt?: number;
  fullSwipe?: boolean;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (action: SwipeAction) => void;
  onCommit?: (action: SwipeAction) => void;
  closeOnAction?: boolean;
  haptic?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

const css = `
.swipe-row{--sr-h:64px;--sr-r:16px;--sr-a:80px;--sr-row:#27272a;--sr-text:#f5f5f5;--sr-drawer:#3f3f46;--sr-on-drawer:#fff;--sr-action:#e5484d;--sr-on-action:#fff;--sr-collapse:200ms;--sr-ease-out:cubic-bezier(0.23,1,0.32,1);position:relative;height:var(--sr-h);overflow:hidden;opacity:1;transition:height var(--sr-collapse) var(--sr-ease-out),margin-bottom var(--sr-collapse) var(--sr-ease-out),opacity var(--sr-collapse) var(--sr-ease-out)}
.swipe-row[data-phase='collapsing']{height:0!important;margin-bottom:0!important;opacity:0}
.swipe-row[data-disabled]{opacity:.55;pointer-events:none}
.swipe-row__clip{position:relative;height:var(--sr-h);border-radius:var(--sr-r);overflow:hidden;background:var(--sr-row)}
.swipe-row__rail{position:absolute;inset:0;background:var(--sr-drawer)}
.swipe-row__action{position:absolute;top:0;display:grid;place-items:center;width:var(--sr-a);height:100%;margin:0;padding:0;border:0;background:var(--sr-drawer);color:var(--sr-on-drawer);font:inherit;cursor:pointer;outline:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.swipe-row__action:focus-visible{box-shadow:inset 0 0 0 2px currentColor}
.swipe-row__action::after{content:'';position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
@media (hover:hover) and (pointer:fine){.swipe-row__action::after{transition:opacity 150ms ease}.swipe-row__action:hover::after{opacity:.08}}
.swipe-row__glyph{display:grid;justify-items:center;gap:4px;font-size:11px;font-weight:500;letter-spacing:.01em;line-height:1;transition:transform 160ms var(--sr-ease-out)}
.swipe-row__icon{display:inline-flex}
.swipe-row__action:active .swipe-row__glyph{transform:scale(.97)}
.swipe-row__block{position:absolute;top:0;width:100%;height:100%;background:var(--sr-action)}
.swipe-row[data-direction='left'] .swipe-row__block{left:calc(100% - var(--sr-a))}
.swipe-row[data-direction='right'] .swipe-row__block{right:calc(100% - var(--sr-a))}
.swipe-row__action--commit{background:transparent;color:var(--sr-on-action)}
.swipe-row[data-direction='left'] .swipe-row__action--commit{left:0}
.swipe-row[data-direction='right'] .swipe-row__action--commit{right:0}
.swipe-row__surface{position:relative;z-index:1;display:flex;align-items:center;gap:12px;height:100%;padding:0 16px;background:var(--sr-row);color:var(--sr-text);touch-action:pan-y;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
@media (hover:hover) and (pointer:fine){.swipe-row__surface{cursor:grab}.swipe-row[data-dragging] .swipe-row__surface{cursor:grabbing}}
@media (pointer:coarse){.swipe-row__surface{user-select:none;-webkit-user-select:none}}
.swipe-row[data-dragging] .swipe-row__surface,.swipe-row[data-dragging] .swipe-row__surface *{user-select:none;-webkit-user-select:none}
.swipe-row__toggle{position:absolute;top:50%;width:1px;height:1px;margin:0;padding:0;border:0;overflow:hidden;clip-path:inset(50%);background:transparent;color:var(--sr-text);font:inherit;outline:none}
.swipe-row[data-direction='left'] .swipe-row__toggle{right:12px}
.swipe-row[data-direction='right'] .swipe-row__toggle{left:12px}
.swipe-row__toggle:focus-visible{width:auto;height:24px;padding:0 10px;border-radius:12px;overflow:visible;clip-path:none;background:color-mix(in srgb,var(--sr-text) 12%,transparent);font-size:12px;white-space:nowrap;transform:translateY(-50%)}
.swipe-row__sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){.swipe-row__action:active .swipe-row__glyph{transform:none}}
`;

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </svg>
);

const HYST = 10;
const FLICK = 110;
const DECEL = 0.998;
const VMAX = 1500;
const EASE_OUT = [0.23, 1, 0.32, 1];
const SPRING_UI = { type: "spring", duration: 0.3, bounce: 0 };
const DEFAULT_ACTIONS = [{ id: "delete", label: "Устгах" }];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const rubber = (o, dim, c) => (o * dim * c) / (dim + c * Math.abs(o));
const unrubber = (y, dim, c) => (y * dim) / (c * Math.max(1, dim - Math.abs(y)));
const project = (v) => ((v / 1000) * DECEL) / (1 - DECEL);
const velocityOf = (hist) => {
  if (hist.length < 2) return 0;
  const a = hist[0];
  const b = hist[hist.length - 1];
  return ((b[1] - a[1]) / Math.max(1, b[0] - a[0])) * 1000;
};
const onColor = (hex) => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#ffffff";
  const h = m[1].length === 3 ? [...m[1]].map((ch) => ch + ch).join("") : m[1];
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 150 ? "#111111" : "#ffffff";
};
const watchWindow = (live) => {
  const onMove = (e) => {
    if (e.isTrusted) live.current.move(e);
  };
  const onUp = (e) => {
    if (e.isTrusted) live.current.up(e);
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
  };
};

export function SwipeRow({
  children,
  actions = DEFAULT_ACTIONS,
  actionColor = "#e5484d",
  drawerColor = "#3f3f46",
  rowColor = "#27272a",
  textColor = "#f5f5f5",
  height = 64,
  radius = 16,
  actionWidth = 80,
  direction = "left",
  snapBounce = 0.2,
  resistance = 0.55,
  collapseMs = 200,
  commitAt = 0.6,
  fullSwipe = true,
  disabled = false,
  open: openProp,
  onOpenChange,
  onAction,
  onCommit,
  closeOnAction = true,
  haptic = true,
  label = "Жагсаалтын мөр",
  className = "",
  style,
}: SwipeRowProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const s = direction === "left" ? -1 : 1;
  const A = actionWidth;
  const n = actions.length;
  const D = n * A;
  const c = clamp(resistance, 0.05, 1);
  const primary = actions[0];
  const [openState, setOpenState] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [say, setSay] = useState("");
  const open = openProp ?? openState;

  const root = useRef(null);
  const surface = useRef(null);
  const w = useRef(360);
  const grip = useRef(null);
  const unwatch = useRef(null);
  const live = useRef({});
  const foldTimer = useRef(undefined);
  const heading = useRef(null);

  const x = useMotionValue(0);
  const spread = useMotionValue(0);
  const landed = useMotionValue(0);
  const commitPoint = () => Math.max(commitAt * w.current, D + A / 2);
  const canCommit = () => fullSwipe && n > 0 && commitPoint() <= w.current;
  const exposed = useTransform(x, (v) => s * v);
  const surfaceXf = useTransform(x, (v) => `translateX(${v}px)`);
  const railXf = useTransform(exposed, (e) => `translateX(${-s * Math.max(0, D - e)}px)`);
  const shift = useTransform([exposed, spread], ([e, p]) => p * Math.max(0, e - A));
  const blockXf = useTransform(shift, (v) => `translateX(${s * v}px)`);
  const glyphXf = useTransform([shift, landed], ([v, l]) => `translateX(${-s * l * (v - (w.current - A) / 2)}px)`);

  const map = (raw) => {
    const W = w.current;
    if (raw < 0) return rubber(raw, W, c);
    if (raw <= D) return raw;
    if (!canCommit()) return D + rubber(raw - D, W, c);
    const C = commitPoint();
    const knee = D + (C - D) / c;
    return raw <= knee ? D + c * (raw - D) : C + rubber(raw - knee, W, c);
  };
  const inv = (ex) => {
    const W = w.current;
    if (ex < 0) return unrubber(ex, W, c);
    if (ex <= D) return ex;
    if (!canCommit()) return D + unrubber(ex - D, W, c);
    const C = commitPoint();
    const knee = D + (C - D) / c;
    return ex <= C ? D + (ex - D) / c : knee + unrubber(ex - C, W, c);
  };

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    w.current = el.offsetWidth || w.current;
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) w.current = width;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(
    () => () => {
      clearTimeout(foldTimer.current);
      unwatch.current?.();
    },
    [],
  );

  const setOpen = (next) => {
    if (next === open) return;
    setOpenState(next);
    onOpenChange?.(next);
  };
  const settle = (target, v = 0) => {
    heading.current = target;
    if (reduce) {
      animate(x, s * target, { duration: 0.2, ease: EASE_OUT });
      return;
    }
    const flick = Math.abs(v) >= FLICK;
    animate(
      x,
      s * target,
      flick
        ? { type: "spring", duration: 0.4, bounce: snapBounce, velocity: s * clamp(v, -VMAX, VMAX) }
        : { ...SPRING_UI, velocity: s * v },
    );
  };
  const setSpread = (on) => {
    if ((spread.get() === 1) === on) return;
    if (reduce) spread.set(on ? 1 : 0);
    else animate(spread, on ? 1 : 0, SPRING_UI);
    if (on && primary) {
      setSay(`Тавьвал: ${primary.label}`);
      if (haptic && grip.current?.touch) navigator.vibrate?.(8);
    }
  };
  const commit = (a, viaKey, v = 0) => {
    const leap = a === primary;
    setPhase("committing");
    setSay(a.label);
    setOpen(false);
    const fold = () => {
      setPhase("collapsing");
      foldTimer.current = setTimeout(() => {
        onCommit?.(a);
        a.onSelect?.();
      }, collapseMs);
    };
    if (viaKey || reduce) {
      if (leap) {
        spread.set(1);
        landed.set(1);
      }
      if (viaKey) {
        x.set(s * w.current);
        fold();
      } else animate(x, s * w.current, { duration: 0.2, ease: EASE_OUT }).then(fold);
      return;
    }
    if (leap) {
      if (spread.get() < 1) animate(spread, 1, SPRING_UI);
      animate(landed, 1, SPRING_UI);
    }
    animate(x, s * w.current, { ...SPRING_UI, velocity: s * v }).then(fold);
  };
  useEffect(() => {
    if (openProp === undefined || grip.current || phase !== "idle") return;
    const target = open ? D : 0;
    if (heading.current === target) return;
    if (Math.abs(exposed.get() - target) > 0.5) settle(target);
  }, [open, D]);

  const down = (e) => {
    if (disabled || n === 0 || phase !== "idle" || grip.current || e.button !== 0) return;
    x.stop();
    heading.current = null;
    grip.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, grab: null, moved: false, hist: [], touch: e.pointerType === "touch" };
    try {
      surface.current?.setPointerCapture(e.pointerId);
    } catch {}
    unwatch.current?.();
    unwatch.current = watchWindow(live);
  };
  const move = (e) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    if (g.grab === null) {
      const dx = e.clientX - g.x0;
      const dy = e.clientY - g.y0;
      if (Math.abs(dx) < HYST || Math.abs(dx) < Math.abs(dy)) return;
      g.grab = s * (g.x0 + Math.sign(dx) * HYST) - inv(exposed.get());
      g.moved = true;
      root.current?.setAttribute("data-dragging", "");
    }
    const ex = map(s * e.clientX - g.grab);
    x.set(s * ex);
    g.hist.push([performance.now(), ex]);
    if (g.hist.length > 4) g.hist.shift();
    setSpread(canCommit() && ex >= commitPoint());
  };
  const up = (e) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    grip.current = null;
    unwatch.current?.();
    unwatch.current = null;
    root.current?.removeAttribute("data-dragging");
    try {
      surface.current?.releasePointerCapture(e.pointerId);
    } catch {}
    const ex = exposed.get();
    const v = velocityOf(g.hist);
    if (!g.moved) {
      if (open) {
        setOpen(false);
        settle(0);
      }
      return;
    }
    if (primary && canCommit() && ex >= commitPoint()) {
      commit(primary, false, v);
      return;
    }
    const target = Math.abs(v) >= FLICK ? (v > 0 ? D : 0) : ex + project(v) > D / 2 ? D : 0;
    setSpread(false);
    setOpen(target === D);
    settle(target, v);
  };
  live.current = { move, up };

  const act = (a, e) => {
    if (phase !== "idle") return;
    onAction?.(a);
    if (a === primary || a.dismiss) {
      commit(a, e.detail === 0);
      return;
    }
    a.onSelect?.();
    if (!closeOnAction) return;
    setOpen(false);
    if (e.detail === 0) {
      heading.current = 0;
      x.set(0);
    } else settle(0);
  };
  const openNow = () => {
    heading.current = D;
    x.set(s * D);
    setOpen(true);
    setSay(`${n} үйлдэл нээгдлээ`);
  };
  const closeNow = () => {
    heading.current = 0;
    x.set(0);
    setOpen(false);
  };
  const onToggleKey = (e) => {
    if (disabled || phase !== "idle" || n === 0) return;
    const openKey = s < 0 ? "ArrowLeft" : "ArrowRight";
    const closeKey = s < 0 ? "ArrowRight" : "ArrowLeft";
    const toggle = e.key === "Enter" || e.key === " ";
    if (e.key === openKey || (toggle && !open)) {
      e.preventDefault();
      openNow();
    } else if (e.key === closeKey || e.key === "Escape" || (toggle && open)) {
      e.preventDefault();
      closeNow();
    } else if ((e.key === "Delete" || e.key === "Backspace") && open && primary && canCommit()) {
      e.preventDefault();
      commit(primary, true);
    }
  };
  const onToggleClick = (e) => {
    if (e.detail !== 0 || disabled || phase !== "idle" || n === 0) return;
    if (open) closeNow();
    else openNow();
  };

  const railId = `${uid}-rail`;
  return (
    <div
      ref={root}
      role="group"
      aria-label={label}
      className={`swipe-row${className ? ` ${className}` : ""}`}
      data-direction={direction}
      data-open={open ? "" : undefined}
      data-phase={phase}
      data-disabled={disabled ? "" : undefined}
      style={{
        "--sr-h": `${height}px`,
        "--sr-r": `${radius}px`,
        "--sr-a": `${A}px`,
        "--sr-row": rowColor,
        "--sr-text": textColor,
        "--sr-drawer": drawerColor,
        "--sr-on-drawer": onColor(drawerColor),
        "--sr-action": actionColor,
        "--sr-on-action": onColor(actionColor),
        "--sr-collapse": `${collapseMs}ms`,
        ...style,
      }}
    >
      <style>{css}</style>
      <div className="swipe-row__clip">
        <motion.div id={railId} className="swipe-row__rail" style={{ transform: railXf }} inert={!open || undefined} aria-hidden={!open}>
          {actions.slice(1).map((a, i) => (
            <button
              key={a.id}
              type="button"
              className="swipe-row__action"
              onClick={(e) => act(a, e)}
              style={
                s < 0
                  ? { right: (i + 1) * A, background: a.color ?? drawerColor, color: onColor(a.color ?? drawerColor) }
                  : { left: (i + 1) * A, background: a.color ?? drawerColor, color: onColor(a.color ?? drawerColor) }
              }
            >
              <span className="swipe-row__glyph">
                {a.icon ? <span className="swipe-row__icon">{a.icon}</span> : null}
                <span>{a.label}</span>
              </span>
            </button>
          ))}
          {primary ? (
            <motion.div className="swipe-row__block" style={{ transform: blockXf }}>
              <motion.button type="button" className="swipe-row__action swipe-row__action--commit" style={{ transform: glyphXf }} onClick={(e) => act(primary, e)}>
                <span className="swipe-row__glyph">
                  <span className="swipe-row__icon">{primary.icon ?? <TrashIcon />}</span>
                  <span>{primary.label}</span>
                </span>
              </motion.button>
            </motion.div>
          ) : null}
        </motion.div>
        <motion.div ref={surface} className="swipe-row__surface" style={{ transform: surfaceXf }} onPointerDown={down}>
          {children}
          <button
            type="button"
            className="swipe-row__toggle"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={open}
            aria-controls={railId}
            aria-keyshortcuts={s < 0 ? "ArrowLeft" : "ArrowRight"}
            onKeyDown={onToggleKey}
            onClick={onToggleClick}
          >
            {n} үйлдэл
          </button>
        </motion.div>
      </div>
      <span className="swipe-row__sr" aria-live="polite">
        {say}
      </span>
    </div>
  );
}

const ArchiveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 4h18v4H3zM5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4" />
  </svg>
);

const SEED = [
  { id: "1", title: "Судлаач агент", note: "Товчоо бэлэн · 12 эх сурвалж" },
  { id: "2", title: "Дизайны хяналтын тэмдэглэл", note: "Нүүр хэсгийн v4a дээр 3 сэтгэгдэл" },
  { id: "3", title: "Туршилтын орчинд байршуулах", note: "Зөвшөөрөл хүлээж байна" },
];

export default function Demo() {
  const [rows, setRows] = useState(SEED);
  return (
    <div style={{ width: "min(420px, 100%)", font: "14px Inter, system-ui, sans-serif" }}>
      {rows.map((row) => (
        <SwipeRow
          key={row.id}
          label={row.title}
          actions={[
            { id: "delete", label: "Устгах" },
            { id: "archive", label: "Архивлах", icon: <ArchiveIcon />, dismiss: true },
          ]}
          onCommit={() => setRows((r) => r.filter((x) => x.id !== row.id))}
          style={{ marginBottom: 8 }}
        >
          <span style={{ display: "grid", gap: 2 }}>
            <b style={{ fontWeight: 500 }}>{row.title}</b>
            <small style={{ opacity: 0.6 }}>{row.note}</small>
          </span>
        </SwipeRow>
      ))}
      {rows.length === 0 && (
        <button type="button" onClick={() => setRows(SEED)} style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid #d4d4d8", background: "transparent", cursor: "pointer" }}>
          Мөрүүдийг сэргээх

        </button>
      )}
    </div>
  );
}
