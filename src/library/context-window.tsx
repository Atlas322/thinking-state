"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type ContextItem = { id: string; label: string; tokens: number };
export type ContextPart = {
  id: string;
  label: string;
  tokens?: number;
  items?: ContextItem[];
  locked?: boolean;
  /** Share the part shrinks to when compacted (0–1), or true for 0.25. */
  compact?: boolean | number;
  color?: string;
};

export type ContextWindowProps = {
  parts?: ContextPart[];
  limit?: number;
  title?: string;
  model?: string;
  modelIcon?: React.ReactNode;
  onRemoveItem?: (partId: string, itemId: string) => void;
  onCompact?: (partId: string) => void | Promise<void>;
  action?: { label: string; onClick: () => void };
  warnAt?: number;
  cells?: number;
  columns?: number;
  /** Tokens saved so far, shown in the last row. */
  saved?: number;
  className?: string;
};

const palette = ["#3b76e6", "#86a8ef", "#c3d4f6", "#7a6fe0", "#4cb87a", "#e0a03b", "#e06f8b"];

const defaultParts: ContextPart[] = [
  { id: "system", label: "Системийн заавар", tokens: 4200, locked: true },
  { id: "tools", label: "Хэрэгслүүд", tokens: 12800, locked: true },
  {
    id: "files",
    label: "Файлууд",
    items: [
      { id: "billing", label: "plans.ts", tokens: 21300 },
      { id: "notes", label: "meeting-notes.md", tokens: 15400 },
    ],
  },
  { id: "conversation", label: "Яриа", tokens: 30400, compact: true },
  { id: "memory", label: "Санах ой", tokens: 3900 },
];

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${Math.round(n)}`);
const fmtShort = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);
const partTokens = (p: ContextPart) => p.tokens ?? p.items?.reduce((s, i) => s + i.tokens, 0) ?? 0;

// Neutral agent glyph – no vendor marks.
const AgentGlyph = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="2.5" y="2.5" width="11" height="11" rx="3" />
    <circle cx="8" cy="8" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export function ContextWindow({
  parts: partsProp,
  limit = 200_000,
  title = "Контекстийн цонх",
  model = "Бичигч агент",
  modelIcon = <AgentGlyph />,
  onRemoveItem,
  onCompact,
  action = { label: "Шинэ яриа", onClick: () => {} },
  warnAt = 0.8,
  cells = 216,
  columns = 36,
  saved: savedProp,
  className = "",
}: ContextWindowProps) {
  const [own, setOwn] = React.useState(partsProp ?? defaultParts);
  const parts = onRemoveItem && partsProp ? partsProp : own;
  const [open, setOpen] = React.useState<Record<string, boolean>>({ files: true });
  const [hover, setHover] = React.useState<string | null>(null);
  const [compacting, setCompacting] = React.useState<string | null>(null);
  const [justDone, setJustDone] = React.useState<string | null>(null);
  const [compacted, setCompacted] = React.useState<Record<string, number>>(
    partsProp ? {} : { conversation: 30400 },
  );
  const [saved, setSaved] = React.useState(savedProp ?? (partsProp ? 0 : 78200));
  const [caption, setCaption] = React.useState("");

  const used = parts.reduce((s, p) => s + partTokens(p), 0);
  const share = used / limit;
  const warn = share >= warnAt;
  const full = share >= 0.95;

  // Cells per part, in order.
  const fill: (number | null)[] = [];
  parts.forEach((p, i) => {
    const n = Math.round((partTokens(p) / limit) * cells);
    for (let k = 0; k < n && fill.length < cells; k++) fill.push(i);
  });
  while (fill.length < cells) fill.push(null);

  const hovered = parts.find((p) => p.id === hover);
  const big = hovered ? partTokens(hovered) : used;

  const removeItem = (partId: string, itemId: string) => {
    if (onRemoveItem) return onRemoveItem(partId, itemId);
    setOwn((ps) => ps.map((p) => (p.id === partId ? { ...p, items: p.items?.filter((i) => i.id !== itemId) } : p)));
  };

  const compact = async (p: ContextPart) => {
    setCompacting(p.id);
    setCaption("Шахаж байна…");
    const before = partTokens(p);
    if (onCompact) await onCompact(p.id);
    else await new Promise((r) => window.setTimeout(r, 1400));
    const ratio = typeof p.compact === "number" ? p.compact : 0.25;
    const after = Math.round(before * ratio);
    if (!onCompact) setOwn((ps) => ps.map((x) => (x.id === p.id ? { ...x, tokens: after } : x)));
    setSaved((s) => s + (before - after));
    setCompacted((c) => ({ ...c, [p.id]: after }));
    setCompacting(null);
    setJustDone(p.id);
    setCaption(`${fmt(before - after)} токен хэмнэлээ`);
    window.setTimeout(() => setJustDone(null), 1600);
  };

  return (
    <section className={`cw ${className}`} role="group" aria-label={title}>
      <style>{css}</style>
      <header className="cw-head">
        <strong>{title}</strong>
        {model && (
          <span className="cw-model">
            {modelIcon && <span className="cw-mi">{modelIcon}</span>}
            {model}
          </span>
        )}
      </header>
      <div className="cw-num">
        <span className="cw-big" aria-hidden="true">{fmt(big)}</span>
        <span className="cw-of" aria-hidden="true">
          {hovered ? hovered.label.toLowerCase() : `/ ${fmtShort(limit)} токен`}
        </span>
        <span className={`cw-pct ${warn ? "cw-warn" : ""}`} aria-hidden="true">{Math.round(share * 100)}%</span>
        <span className="cw-sr">
          {fmtShort(limit)} токеноос {fmtShort(used)} ашигласан, {Math.round(share * 100)} хувь
        </span>
      </div>
      <div className="cw-field" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${columns},1fr)` }}>
        {fill.map((pi, i) => {
          const p = pi == null ? null : parts[pi];
          const color = p ? p.color ?? palette[pi! % palette.length] : undefined;
          const dim = hover && p?.id !== hover;
          return (
            <span
              key={i}
              className={`cw-cell ${p && compacting === p.id ? "cw-shim" : ""}`}
              style={{
                background: color,
                opacity: dim ? 0.25 : 1,
                transitionDelay: `${(i % columns) * 6}ms`,
                animationDelay: `${(i % columns) * 25}ms`,
              }}
              onMouseEnter={() => p && setHover(p.id)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </div>
      <ul className="cw-parts">
        {parts.map((p, i) => {
          const color = p.color ?? palette[i % palette.length];
          const t = partTokens(p);
          const hasItems = !!p.items?.length;
          const canCompact = p.compact && !p.locked && !(p.id in compacted && compacted[p.id] >= t);
          const label = (
            <>
              <i className="cw-dot" style={{ background: color }} />
              <span className="cw-label">{p.label}</span>
              {hasItems && (
                <svg className={`cw-chev ${open[p.id] ? "cw-up" : ""}`} viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m5 10 3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              )}
            </>
          );
          return (
            <li key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}>
              <div className="cw-row">
                {hasItems ? (
                  <button
                    type="button"
                    className="cw-toggle"
                    aria-expanded={!!open[p.id]}
                    onClick={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))}
                  >
                    {label}
                  </button>
                ) : (
                  <span className="cw-toggle">{label}</span>
                )}
                {(canCompact || justDone === p.id) && (
                  <button
                    type="button"
                    className={`cw-compact ${justDone === p.id ? "cw-ok" : ""}`}
                    disabled={!!compacting || justDone === p.id}
                    onClick={() => compact(p)}
                  >
                    {justDone === p.id ? (
                      <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    ) : (
                      <svg viewBox="0 0 16 16"><path d="M5 2.5 8 5.5l3-3M5 13.5l3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                    <span>{justDone === p.id ? "Шахсан" : "Шахах"}</span>
                  </button>
                )}
                <span className="cw-tok">{fmt(t)}</span>
              </div>
              {hasItems && (
                <div className={`cw-items ${open[p.id] ? "cw-open" : ""}`} inert={!open[p.id] ? true : undefined}>
                  <ul>
                    {p.items!.map((it) => (
                      <li key={it.id}>
                        <span className="cw-ilabel">{it.label}</span>
                        <span className="cw-itok">{fmt(it.tokens)}</span>
                        <button type="button" aria-label={`Хасах: ${it.label}`} onClick={() => removeItem(p.id, it.id)}>
                          <svg viewBox="0 0 16 16"><path d="m5 5 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <footer className="cw-foot">
        <span className={`cw-cap ${compacting ? "cw-capshim" : ""} ${warn ? "cw-capwarn" : ""}`} aria-live="polite">
          {compacting
            ? "Шахаж байна…"
            : full
              ? "Контекстийн цонх дүүрсэн"
              : warn
                ? `${fmt(limit - used)} токен үлдсэн`
                : saved > 0
                  ? `${fmt(saved)} токен хэмнэсэн`
                  : caption}
        </span>
        {action && (
          <button type="button" className="cw-action" onClick={action.onClick}>
            {action.label}
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </footer>
    </section>
  );
}

const css = `
.cw{--cw-bg:#fff;--cw-fg:#18181b;--cw-muted:#65656d;--cw-faint:#65656d;--cw-line:#ececef;--cw-chip:#f3f3f5;--cw-empty:#ececef;--cw-ok:#16a34a;--cw-warn:#d97706;width:100%;max-width:360px;background:var(--cw-bg);color:var(--cw-fg);border:1px solid var(--cw-line);border-radius:12px;box-shadow:0 1px 3px #0000000d;font:400 14px/1.4 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .cw{--cw-bg:#1b1b1e;--cw-fg:#ececef;--cw-muted:#a1a1aa;--cw-faint:#9a9aa2;--cw-line:#2e2e33;--cw-chip:#2a2a2f;--cw-empty:#2c2c31;--cw-ok:#4ade80;--cw-warn:#fbbf24;color-scheme:dark}
.cw *{box-sizing:border-box}.cw button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;padding:0}
.cw-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px 0}
.cw-head strong{font-weight:500}
.cw-model{display:inline-flex;align-items:center;gap:6px;padding:2px 6px;border-radius:5px;background:var(--cw-chip);font-size:12px;color:var(--cw-fg);font-variant-numeric:tabular-nums}
.cw-mi{display:grid;place-items:center;width:12px;height:12px}.cw-mi svg{width:12px;height:12px}
.cw-num{display:flex;align-items:baseline;gap:8px;padding:8px 16px 12px}
.cw-big{font-size:24px;font-weight:500;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.cw-of{font-size:12px;color:var(--cw-muted)}
.cw-pct{margin-left:auto;align-self:center;padding:1px 6px;border-radius:5px;background:var(--cw-chip);font-size:12px;font-variant-numeric:tabular-nums}
.cw-warn{background:color-mix(in srgb,var(--cw-warn) 16%,transparent);color:var(--cw-warn)}
.cw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.cw-field{display:grid;gap:2.5px;padding:0 16px 14px}
.cw-cell{aspect-ratio:1;border-radius:1.5px;background:var(--cw-empty);transition:background .25s,opacity .2s}
.cw-shim{animation:cw-shim 1s ease-in-out infinite}
.cw-parts{list-style:none;margin:0;padding:4px 0 10px}
.cw-row{display:flex;align-items:center;gap:8px;padding:0 16px;height:32px}
.cw-toggle{display:flex;align-items:center;gap:10px;flex:1;min-width:0;text-align:left}
.cw-dot{width:8px;height:8px;border-radius:2px;flex:none}
.cw-chev{width:14px;height:14px;color:var(--cw-muted);margin-left:-4px;transform:rotate(180deg);transition:transform .2s}.cw-chev.cw-up{transform:none}
.cw-tok{font-variant-numeric:tabular-nums;color:var(--cw-fg)}
.cw-compact{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 8px;border:1px solid var(--cw-line)!important;border-radius:6px;font-size:12px!important;color:var(--cw-muted)!important;transition:all .25s}
.cw-compact svg{width:12px;height:12px}.cw-compact:hover{color:var(--cw-fg)!important}
.cw-ok{border-color:transparent!important;background:color-mix(in srgb,var(--cw-ok) 14%,transparent)!important;color:var(--cw-ok)!important;animation:cw-fade 1.6s forwards}
.cw-items{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s}.cw-items>ul{overflow:hidden;list-style:none;margin:0;padding:0 0 0 34px}
.cw-items.cw-open{grid-template-rows:1fr}
.cw-items li{display:flex;align-items:center;gap:8px;height:28px;padding-right:12px;font-size:12px;color:var(--cw-muted)}
.cw-ilabel{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cw-itok{font-variant-numeric:tabular-nums;color:var(--cw-faint);margin-right:6px}
.cw-items button{display:grid;place-items:center;width:20px;height:20px;border-radius:5px;color:var(--cw-faint)}.cw-items button:hover{color:var(--cw-fg);background:var(--cw-chip)}
.cw-items svg{width:12px;height:12px}
.cw-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 8px 8px 16px;border-top:1px solid var(--cw-line);min-height:44px}
.cw-cap{font-size:12px;color:var(--cw-ok)}.cw-capwarn{color:var(--cw-warn)}
.cw-capshim{color:var(--cw-muted);animation:cw-shim 1.2s infinite}
.cw-action{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 10px!important;border:1px solid var(--cw-line)!important;border-radius:7px;background:var(--cw-bg)!important;box-shadow:0 1px 2px #0000000a;font-size:14px}
.cw-action svg{width:14px;height:14px;color:var(--cw-muted)}.cw-action:hover{background:var(--cw-chip)!important}
.cw :focus-visible{outline:2px solid #3b76e6;outline-offset:2px}
@keyframes cw-shim{50%{opacity:.4}}
@keyframes cw-fade{0%,70%{opacity:1}100%{opacity:0}}
@media(max-width:310px){.cw-field{grid-template-columns:repeat(24,1fr)!important}.cw-compact span{display:none}}
@media(pointer:coarse){.cw-row{height:40px}.cw-items li{height:36px}.cw-action{height:36px}}
@media(prefers-reduced-motion:reduce){.cw *{animation:none!important;transition:none!important}}
`;

export default ContextWindow;
