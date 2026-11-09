"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type ToastId = string;
export type ToastType = "default" | "success" | "error" | "info" | "loading";

export type ToastOptions = {
  id?: ToastId;
  description?: React.ReactNode;
  action?: { label: string; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void };
  duration?: number;
  icon?: React.ReactNode;
  /** Only the Toaster with this id shows the toast. */
  toaster?: string;
  onDismiss?: (id: ToastId) => void;
};

export type ToastNotice = ToastOptions & {
  id: ToastId;
  title: React.ReactNode;
  type: ToastType;
  /** Bumped on every update so timers restart and text crossfades. */
  version: number;
};

type Message<T> = React.ReactNode | { title: React.ReactNode; description?: React.ReactNode } | ((value: T) => React.ReactNode | { title: React.ReactNode; description?: React.ReactNode });

let store: ToastNotice[] = [];
const listeners = new Set<() => void>();
let seq = 0;
const emit = () => listeners.forEach((fn) => fn());

function show(title: React.ReactNode, type: ToastType, options: ToastOptions = {}): ToastId {
  const id = options.id ?? `toast-${++seq}`;
  const existing = store.find((t) => t.id === id);
  const next: ToastNotice = { ...existing, ...options, id, title, type, version: (existing?.version ?? 0) + 1 };
  store = existing ? store.map((t) => (t.id === id ? next : t)) : [next, ...store];
  emit();
  return id;
}

function dismiss(id?: ToastId) {
  const gone = id ? store.filter((t) => t.id === id) : store;
  store = id ? store.filter((t) => t.id !== id) : [];
  gone.forEach((t) => t.onDismiss?.(t.id));
  emit();
}

function resolveMessage<T>(message: Message<T>, value: T) {
  const m = typeof message === "function" ? (message as (v: T) => unknown)(value) : message;
  if (m && typeof m === "object" && "title" in (m as object))
    return m as { title: React.ReactNode; description?: React.ReactNode };
  return { title: m as React.ReactNode, description: undefined };
}

type ToastFn = ((title: React.ReactNode, options?: ToastOptions) => ToastId) & {
  success: (title: React.ReactNode, options?: ToastOptions) => ToastId;
  error: (title: React.ReactNode, options?: ToastOptions) => ToastId;
  info: (title: React.ReactNode, options?: ToastOptions) => ToastId;
  loading: (title: React.ReactNode, options?: ToastOptions) => ToastId;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    messages: { loading: Message<void>; success: Message<T>; error: Message<unknown> },
    options?: ToastOptions,
  ) => Promise<T>;
  dismiss: (id?: ToastId) => void;
};

export const toast: ToastFn = Object.assign(
  (title: React.ReactNode, options?: ToastOptions) => show(title, "default", options),
  {
    success: (title: React.ReactNode, options?: ToastOptions) => show(title, "success", options),
    error: (title: React.ReactNode, options?: ToastOptions) => show(title, "error", options),
    info: (title: React.ReactNode, options?: ToastOptions) => show(title, "info", options),
    loading: (title: React.ReactNode, options?: ToastOptions) => show(title, "loading", { duration: Infinity, ...options }),
    promise: <T,>(
      promise: Promise<T> | (() => Promise<T>),
      messages: { loading: Message<void>; success: Message<T>; error: Message<unknown> },
      options: ToastOptions = {},
    ) => {
      const l = resolveMessage(messages.loading, undefined);
      const id = show(l.title, "loading", { ...options, description: l.description, duration: Infinity });
      const p = typeof promise === "function" ? promise() : promise;
      p.then(
        (value) => {
          const m = resolveMessage(messages.success, value);
          show(m.title, "success", { ...options, id, description: m.description, duration: options.duration });
        },
        (err) => {
          const m = resolveMessage(messages.error, err);
          show(m.title, "error", { ...options, id, description: m.description, duration: options.duration });
        },
      );
      return p;
    },
    dismiss,
  },
);

/** @deprecated Use toast.dismiss(id). */
export const dismissToast = (id: string) => dismiss(id);

export type ToasterProps = {
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  inline?: boolean;
  id?: string;
  duration?: number;
  visibleToasts?: number;
  expand?: boolean;
  offset?: number;
  gap?: number;
  hotkey?: string | null;
  hairline?: boolean;
  closeButton?: boolean;
  label?: string;
  className?: string;
};

function Icon({ type }: { type: ToastType }) {
  if (type === "loading") return <i className="tst-spin" aria-hidden="true" />;
  if (type === "default") return null;
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`tst-icon ${type}`}>
      <circle cx="8" cy="8" r="6.25" className="ring" />
      {type === "success" && <path d="m5.4 8.2 1.8 1.8 3.4-3.6" className="mark" />}
      {type === "error" && <path d="M6 6l4 4m0-4-4 4" className="mark" />}
      {type === "info" && <path d="M8 7.3v3.4M8 5.2v.1" className="mark" />}
    </svg>
  );
}

function ToastItem({
  t,
  index,
  front,
  expanded,
  paused,
  duration,
  hairline,
  closeButton,
  top,
  offsetY,
  onHeight,
}: {
  t: ToastNotice;
  index: number;
  front: boolean;
  expanded: boolean;
  paused: boolean;
  duration: number;
  hairline: boolean;
  closeButton: boolean;
  top: boolean;
  offsetY: number;
  onHeight: (id: string, h: number) => void;
}) {
  const el = React.useRef<HTMLLIElement>(null);
  const life = t.duration ?? (t.type === "loading" ? Infinity : duration);
  const remaining = React.useRef(life);
  const [leaving, setLeaving] = React.useState(false);
  const [dx, setDx] = React.useState(0);
  const drag = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    remaining.current = life;
  }, [t.version, life]);

  React.useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return;
    const started = Date.now();
    const id = window.setTimeout(() => close(), remaining.current);
    return () => {
      window.clearTimeout(id);
      remaining.current -= Date.now() - started;
    };
  });

  React.useLayoutEffect(() => {
    const node = el.current;
    if (!node) return;
    const measure = () => onHeight(t.id, node.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [t.id, onHeight]);

  const close = () => {
    setLeaving(true);
    window.setTimeout(() => dismiss(t.id), 200);
  };

  const scale = expanded ? 1 : 1 - index * 0.05;
  const peek = expanded ? offsetY : index * 10;
  const y = (top ? 1 : -1) * peek;

  return (
    <li
      ref={el}
      tabIndex={0}
      data-toast-id={t.id}
      className={`tst-toast ${t.type} ${leaving ? "leaving" : ""} ${front ? "front" : ""}`}
      aria-label={typeof t.title === "string" ? t.title : undefined}
      style={{
        transform: `translate(${dx}px, ${y}px) scale(${scale})`,
        zIndex: 100 - index,
        opacity: !expanded && index > 2 ? 0 : leaving ? 0 : dx ? Math.max(0.2, 1 - Math.abs(dx) / 220) : 1,
        transition: drag.current ? "none" : undefined,
        transformOrigin: top ? "center bottom" : "center top",
        [top ? "top" : "bottom"]: 0,
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          const next = (e.currentTarget.nextElementSibling ?? e.currentTarget.previousElementSibling) as HTMLElement | null;
          close();
          next?.focus();
        }
      }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        drag.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        setDx(e.clientX - drag.current.x);
      }}
      onPointerUp={() => {
        if (!drag.current) return;
        drag.current = null;
        if (Math.abs(dx) > 70) {
          setDx(dx > 0 ? 420 : -420);
          close();
        } else setDx(0);
      }}
    >
      <div className="tst-body" key={`body-${t.version}`}>
        {(t.icon ?? t.type !== "default") && <span className="tst-lead">{t.icon ?? <Icon type={t.type} />}</span>}
        <div className="tst-text">
          <strong>{t.title}</strong>
          {t.description && <span>{t.description}</span>}
        </div>
        {t.action && (
          <button
            type="button"
            className="tst-action"
            onClick={(e) => {
              t.action!.onClick(e);
              if (!e.defaultPrevented) close();
            }}
          >
            {t.action.label}
          </button>
        )}
      </div>
      {closeButton && (
        <button type="button" className="tst-close" aria-label="Close notification" onClick={close}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7" /></svg>
        </button>
      )}
      {hairline && Number.isFinite(life) && (
        <i
          key={`hair-${t.version}`}
          className="tst-hair"
          aria-hidden="true"
          style={{ animationDuration: `${life}ms`, animationPlayState: paused ? "paused" : "running" }}
        />
      )}
    </li>
  );
}

export function Toaster({
  position = "bottom-right",
  inline = false,
  id,
  duration = 4000,
  visibleToasts = 3,
  expand = false,
  offset,
  gap = 10,
  hotkey = "F8",
  hairline = true,
  closeButton = true,
  label = "Notifications",
  className = "",
}: ToasterProps) {
  const [all, setAll] = React.useState(store);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const list = React.useRef<HTMLOListElement>(null);
  const returnTo = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const fn = () => setAll([...store]);
    listeners.add(fn);
    fn();
    return () => {
      listeners.delete(fn);
    };
  }, []);

  React.useEffect(() => {
    const vis = () => setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  React.useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== hotkey && e.code !== hotkey) return;
      const first = list.current?.querySelector<HTMLElement>(".tst-toast");
      if (!first) return;
      e.preventDefault();
      returnTo.current = document.activeElement as HTMLElement;
      first.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  const onHeight = React.useCallback((tid: string, h: number) => {
    setHeights((prev) => (prev[tid] === h ? prev : { ...prev, [tid]: h }));
  }, []);

  const toasts = all.filter((t) => (t.toaster ?? undefined) === id);
  const visible = toasts.slice(0, visibleToasts);
  const queued = toasts.length - visible.length;
  const expanded = expand || hovered || focused;
  const paused = hovered || focused || hidden;
  const top = position.startsWith("top");
  const edge = offset ?? (inline ? 20 : 24);
  const frontHeight = heights[visible[0]?.id] ?? 64;
  const stackHeight = expanded
    ? visible.reduce((n, t) => n + (heights[t.id] ?? 64) + gap, -gap)
    : frontHeight + Math.min(2, visible.length - 1) * 10;

  React.useEffect(() => {
    if (!toasts.length && returnTo.current) {
      returnTo.current.focus?.();
      returnTo.current = null;
    }
  }, [toasts.length]);

  let acc = 0;
  const offsets = visible.map((t) => {
    const o = acc;
    acc += (heights[t.id] ?? 64) + gap;
    return o;
  });

  const errors = visible.filter((t) => t.type === "error");
  return (
    <section
      className={`tst-region ${inline ? "inline" : ""} ${position} ${className}`}
      aria-label={`${label}${hotkey ? ` (${hotkey})` : ""}`}
      style={{ ["--tst-edge" as string]: `${edge}px` }}
    >
      <style>{css}</style>
      <ol
        ref={list}
        className="tst-list"
        style={{ height: visible.length ? stackHeight : 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
        }}
      >
        {visible.map((t, i) => (
          <ToastItem
            key={t.id}
            t={t}
            index={i}
            front={i === 0}
            expanded={expanded}
            paused={paused || false}
            duration={duration}
            hairline={hairline}
            closeButton={closeButton}
            top={top}
            offsetY={offsets[i]}
            onHeight={onHeight}
          />
        ))}
      </ol>
      <p className="tst-sr" role="status" aria-live="polite">
        {visible.filter((t) => t.type !== "error").map((t) => (typeof t.title === "string" ? t.title : "")).join(". ")}
        {queued > 0 ? `. ${queued} more waiting` : ""}
      </p>
      <p className="tst-sr" role="alert">
        {errors.map((t) => (typeof t.title === "string" ? t.title : "")).join(". ")}
      </p>
    </section>
  );
}

const fileIcon = (d: string) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d={d} />
  </svg>
);

/** Demo: a file card whose actions send toasts into an inline stack. */
export default function ToasterDemo() {
  React.useEffect(() => {
    const id = toast.success("Report uploaded", {
      id: "demo-upload",
      description: "Shared with 4 people in Finance",
      toaster: "demo",
      duration: 12000,
    });
    return () => toast.dismiss(id);
  }, []);
  const send = (fn: () => void) => () => fn();
  return (
    <div className="tst-demo">
      <style>{css}</style>
      <div className="tst-card">
        <div className="tst-file">
          <span className="tst-doc">{fileIcon("M4.5 2h4.8L12 4.7v8.8c0 .3-.2.5-.5.5h-7a.5.5 0 0 1-.5-.5V2.5c0-.3.2-.5.5-.5ZM6 8h4M6 10.5h4")}</span>
          <div>
            <strong>Q3 Board Report</strong>
            <span>Finance · edited 2 min ago</span>
          </div>
        </div>
        <div className="tst-actions">
          <button
            type="button"
            onClick={send(() => toast.success("Draft saved", { description: "Q3 Board Report", toaster: "demo" }))}
          >
            {fileIcon("M3 3.5c0-.3.2-.5.5-.5h7.3L13 5.2v7.3c0 .3-.2.5-.5.5h-9a.5.5 0 0 1-.5-.5ZM5.5 3v3h4V3M5 13V9.5h6V13")}
            Save draft
          </button>
          <button
            type="button"
            onClick={send(() =>
              toast("File moved to trash", {
                description: "Q3 Board Report",
                toaster: "demo",
                action: { label: "Undo", onClick: () => toast.success("File restored", { toaster: "demo" }) },
              }),
            )}
          >
            {fileIcon("M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5")}
            Delete file
          </button>
          <button
            type="button"
            onClick={send(() =>
              void toast.promise(
                new Promise((r) => setTimeout(r, 1800)),
                {
                  loading: { title: "Uploading report…", description: "Q3 Board Report.pdf" },
                  success: { title: "Report uploaded", description: "Shared with 4 people in Finance" },
                  error: "Upload failed",
                },
                { toaster: "demo" },
              ),
            )}
          >
            {fileIcon("M8 10.5V3M5 5.8 8 3l3 2.8M3 10.5V13h10v-2.5")}
            Upload report
          </button>
          <button
            type="button"
            onClick={send(() =>
              void toast
                .promise(
                  new Promise((_, reject) => setTimeout(() => reject(new Error("offline")), 1800)),
                  {
                    loading: "Syncing with Drive…",
                    success: "Synced",
                    error: { title: "Sync failed", description: "Drive didn't answer – try again in a minute" },
                  },
                  { toaster: "demo" },
                )
                .catch(() => {}),
            )}
          >
            {fileIcon("M12.5 6.5A4.6 4.6 0 0 0 4 5.2M3.5 9.5a4.6 4.6 0 0 0 8.5 1.3M4 2.8v2.6h2.6M12 13.2v-2.6H9.4")}
            Sync
          </button>
        </div>
      </div>
      <p className="tst-hint">
        Press <kbd>F8</kbd> to jump to notifications
      </p>
      <div className="tst-stage">
        <Toaster inline id="demo" position="top-center" offset={0} />
      </div>
    </div>
  );
}

const css = `
.tst-region,.tst-demo{--tst-fg:#1f1f1f;--tst-muted:#7d7d7d;--tst-card:#fff;--tst-line:#ececec;--tst-soft:#f4f4f4;--tst-green:#2f9e66;--tst-red:#e5484d;--tst-blue:#3d7be8;font:400 13px/1.45 Inter,ui-sans-serif,system-ui,sans-serif;color:var(--tst-fg)}
:where(.dark,[data-theme=dark]) :is(.tst-region,.tst-demo){--tst-fg:#ececec;--tst-muted:#8f8f94;--tst-card:#1d1d20;--tst-line:#2d2d32;--tst-soft:#27272b;--tst-green:#4cc38a;--tst-red:#ff6b70;color-scheme:dark}
.tst-region *,.tst-demo *{box-sizing:border-box}
.tst-region :where(button),.tst-demo :where(button){font:inherit;color:inherit;cursor:pointer}
.tst-region{position:fixed;z-index:9999;width:356px;max-width:calc(100vw - 24px);pointer-events:none}
.tst-region.inline{position:absolute}
.tst-region.top-left,.tst-region.top-center,.tst-region.top-right{top:var(--tst-edge)}
.tst-region.bottom-left,.tst-region.bottom-center,.tst-region.bottom-right{bottom:var(--tst-edge)}
.tst-region.top-left,.tst-region.bottom-left{left:var(--tst-edge)}
.tst-region.top-right,.tst-region.bottom-right{right:var(--tst-edge)}
.tst-region.top-center,.tst-region.bottom-center{left:50%;transform:translateX(-50%)}
.tst-list{position:relative;list-style:none;margin:0;padding:0;transition:height .35s cubic-bezier(.22,1,.36,1)}
.tst-toast{position:absolute;left:0;right:0;pointer-events:auto;background:var(--tst-card);border:1px solid var(--tst-line);border-radius:10px;box-shadow:0 4px 16px #00000012,0 1px 2px #0000000a;padding:13px 16px 14px 14px;overflow:hidden;touch-action:pan-y;transition:transform .4s cubic-bezier(.22,1,.36,1),opacity .25s;animation:tst-in .4s cubic-bezier(.22,1,.36,1)}
.tst-region.top-left .tst-toast,.tst-region.top-center .tst-toast,.tst-region.top-right .tst-toast{animation-name:tst-in-top}
.tst-toast:focus-visible{outline:2px solid var(--tst-blue);outline-offset:2px}
.tst-toast.leaving{transform:translateY(6px)!important}
.tst-toast:not(.front) .tst-body{opacity:var(--tst-back,1)}
.tst-body{display:flex;align-items:flex-start;gap:10px;animation:tst-fade .25s ease-out}
.tst-lead{display:grid;place-items:center;width:14px;height:20px;flex:none}
.tst-text{display:grid;gap:1px;min-width:0;flex:1}
.tst-text strong{font-weight:500;font-size:14px;line-height:20px}
.tst-text span{color:color-mix(in srgb,var(--tst-fg) 72%,transparent);font-size:14px;line-height:21px}
.tst-icon{width:14px;height:14px;fill:none;stroke-linecap:round;stroke-linejoin:round}
.tst-icon .ring{stroke-width:1.1;opacity:.5}
.tst-icon .mark{stroke-width:1.5;stroke-dasharray:12;animation:tst-draw .35s .1s ease-out both}
.tst-icon.success{stroke:var(--tst-green)}.tst-icon.error{stroke:var(--tst-red)}.tst-icon.info{stroke:var(--tst-blue)}
.tst-spin{width:12px;height:12px;border-radius:50%;border:1.5px solid color-mix(in srgb,var(--tst-muted) 25%,transparent);border-top-color:var(--tst-muted);animation:tst-spin .8s linear infinite}
.tst-action{align-self:center;border:0;border-radius:6px;background:var(--tst-fg);color:var(--tst-card)!important;font-size:12px!important;padding:3px 10px;font-weight:500}
.tst-action:hover{opacity:.85}
.tst-close{position:absolute;top:6px;right:6px;width:20px;height:20px;display:grid;place-items:center;border:0;background:var(--tst-card);border-radius:5px;color:var(--tst-muted)!important;opacity:0;transition:opacity .15s}
.tst-toast:hover .tst-close,.tst-toast:focus-within .tst-close{opacity:1}
.tst-close:hover{background:var(--tst-soft)}
.tst-close svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.tst-hair{position:absolute;left:0;right:0;bottom:0;height:1px;background:color-mix(in srgb,var(--tst-fg) 22%,transparent);transform-origin:left;animation:tst-hair linear forwards}
.tst-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0}
.tst-region button:focus-visible,.tst-demo button:focus-visible{outline:2px solid var(--tst-blue);outline-offset:2px}
.tst-demo{width:356px;max-width:100%;margin:0 auto;display:grid;gap:0;text-align:left}
.tst-card{background:var(--tst-card);border:1px solid var(--tst-line);border-radius:12px;padding:12px;box-shadow:0 1px 2px #00000008}
.tst-file{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.tst-file>div{display:grid}
.tst-file strong{font-weight:500;font-size:14px;line-height:19px}
.tst-file span{color:var(--tst-muted);font-size:13px}
.tst-doc{width:36px;height:36px;display:grid;place-items:center;border:1px solid var(--tst-line);border-radius:8px;color:var(--tst-muted)}
.tst-doc svg,.tst-actions svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
.tst-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tst-actions button{display:flex;align-items:center;gap:8px;height:32px;padding:0 10px;border:1px solid var(--tst-line);border-radius:7px;background:var(--tst-card);font-size:14px!important;font-weight:500;box-shadow:0 1px 2px #00000008;transition:background .15s,transform .1s}
.tst-actions button svg{color:var(--tst-muted)}
.tst-actions button:hover{background:var(--tst-soft)}
.tst-actions button:active{transform:scale(.98)}
.tst-hint{margin:12px 0 0;text-align:center;font-size:13px;color:var(--tst-muted)}
.tst-hint kbd{font:inherit;font-size:12px;color:var(--tst-fg);border:1px solid var(--tst-line);border-radius:4px;padding:0 5px;margin:0 2px;background:var(--tst-card)}
.tst-stage{position:relative;height:180px;margin-top:14px}
.tst-stage .tst-region{width:100%}
@keyframes tst-in{from{opacity:0;transform:translateY(16px) scale(.98)}}
@keyframes tst-in-top{from{opacity:0;transform:translateY(-16px) scale(.98)}}
@keyframes tst-fade{from{opacity:0}}
@keyframes tst-spin{to{transform:rotate(360deg)}}
@keyframes tst-draw{from{stroke-dashoffset:12}to{stroke-dashoffset:0}}
@keyframes tst-hair{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@media (prefers-reduced-motion:reduce){:is(.tst-region,.tst-demo) *:not(.tst-spin){animation:none!important;transition:none!important}}
@media (max-width:600px){.tst-region:not(.inline){left:12px!important;right:12px!important;width:auto;transform:none!important;bottom:calc(12px + env(safe-area-inset-bottom))}}
@media (pointer:coarse){.tst-close{opacity:1;width:28px;height:28px}.tst-action{padding:6px 12px}}
`;
