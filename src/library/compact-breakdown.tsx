"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type BreakdownItem = { id?: string; label: string; value: number; color?: string };

export type CompactBreakdownProps = {
  title?: string;
  items?: BreakdownItem[];
  periods?: { id: string; label: string }[];
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (id: string) => void;
  delta?: number;
  format?: (value: number) => string;
  totalLabel?: string;
  footer?: React.ReactNode | null;
  className?: string;
};

const demo: Record<string, { items: BreakdownItem[]; delta: number }> = {
  "7d": {
    delta: 12.4,
    items: [
      { label: "Шууд", value: 4820 },
      { label: "Хайлт", value: 3910 },
      { label: "Холбоос", value: 2240 },
      { label: "Сошиал", value: 1680 },
      { label: "Имэйл", value: 940 },
    ],
  },
  "30d": {
    delta: 8.1,
    items: [
      { label: "Шууд", value: 18450 },
      { label: "Хайлт", value: 19870 },
      { label: "Холбоос", value: 8120 },
      { label: "Сошиал", value: 6340 },
      { label: "Имэйл", value: 4210 },
    ],
  },
  "90d": {
    delta: -3.2,
    items: [
      { label: "Шууд", value: 52300 },
      { label: "Хайлт", value: 58900 },
      { label: "Холбоос", value: 21400 },
      { label: "Сошиал", value: 22800 },
      { label: "Имэйл", value: 13100 },
    ],
  },
};

const ramp = ["#3b82f6", "#7aa7f5", "#a8c5fa", "#cfdffc", "#dcdce0", "#e8e8eb"];

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function useRolled(value: number) {
  const [shown, setShown] = React.useState(value);
  const from = React.useRef(value);
  React.useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 450);
      const v = a + (value - a) * (1 - Math.pow(1 - p, 3));
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value]);
  return shown;
}

export function CompactBreakdown({
  title = "Сувгаар орлого",
  items: itemsProp,
  periods = [
    { id: "7d", label: "7 хоног" },
    { id: "30d", label: "30 хоног" },
    { id: "90d", label: "90 хоног" },
  ],
  period: periodProp,
  defaultPeriod,
  onPeriodChange,
  delta: deltaProp,
  format = money,
  totalLabel = "Нийт орлого",
  footer,
  className = "",
}: CompactBreakdownProps) {
  const [periodState, setPeriod] = React.useState(defaultPeriod ?? periods[0]?.id);
  const period = periodProp ?? periodState;
  const [hover, setHover] = React.useState<string | null>(null);
  const items = itemsProp ?? demo[period ?? "7d"]?.items ?? demo["7d"].items;
  const delta = deltaProp ?? (itemsProp ? undefined : demo[period ?? "7d"]?.delta);

  const keyed = items.map((it) => ({ ...it, key: it.id ?? it.label, color: it.color }));
  const ranked = [...keyed].sort((a, b) => b.value - a.value);
  const colorOf = (key: string) => keyed.find((k) => k.key === key)?.color ?? ramp[Math.min(ranked.findIndex((r) => r.key === key), ramp.length - 1)];
  const total = items.reduce((n, i) => n + i.value, 0);
  const hovered = ranked.find((r) => r.key === hover);
  const big = useRolled(hovered ? hovered.value : total);
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);

  return (
    <section className={`cbd ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="cbd-head">
        <h3>{title}</h3>
        {periods.length > 0 && (
          <div className="cbd-seg" role="radiogroup" aria-label="Хугацаа">
            {periods.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={period === p.id}
                onClick={() => {
                  setPeriod(p.id);
                  onPeriodChange?.(p.id);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </header>
      <div className="cbd-total" aria-hidden="true">
        <span className="cbd-big">{format(big)}</span>
        {delta !== undefined && !hovered && (
          <span className={`cbd-delta ${delta < 0 ? "is-down" : ""}`}>
            <svg viewBox="0 0 12 12">
              <path d={delta < 0 ? "M6 2.5v7M3 6.5l3 3 3-3" : "M6 9.5v-7M3 5.5l3-3 3 3"} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="cbd-sub" aria-hidden="true">{hovered ? `${hovered.label} · ${pct(hovered.value)}%` : totalLabel}</div>
      <p className="cbd-sr">
        {totalLabel}: {format(total)}
        {delta !== undefined && `, өмнөх үеэс ${Math.abs(delta)}% ${delta < 0 ? "буурсан" : "өссөн"}`}
      </p>
      <div className="cbd-bar" aria-hidden="true">
        {ranked.map((r) => (
          <span
            key={r.key}
            className={hover && hover !== r.key ? "is-dim" : ""}
            style={{ flexGrow: r.value, background: colorOf(r.key) }}
            onMouseEnter={() => setHover(r.key)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </div>
      <ul className="cbd-list">
        {ranked.map((r) => (
          <li
            key={r.key}
            tabIndex={0}
            className={hover && hover !== r.key ? "is-dim" : ""}
            onMouseEnter={() => setHover(r.key)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(r.key)}
            onBlur={() => setHover(null)}
          >
            <i style={{ background: colorOf(r.key) }} />
            <span className="cbd-label">{r.label}</span>
            <span className="cbd-val">{format(r.value)}</span>
            <span className="cbd-pct">{pct(r.value)}%</span>
          </li>
        ))}
      </ul>
      {footer !== null && (
        <footer className="cbd-foot">
          {footer ?? (
            <>
              <span>Хамгийн их:</span> {ranked[0]?.label}
            </>
          )}
        </footer>
      )}
    </section>
  );
}

const css = `
.cbd{--cbd-bg:#fff;--cbd-fg:#18181b;--cbd-muted:#65656d;--cbd-faint:#65656d;--cbd-line:#ececef;--cbd-chip:#f1f1f3;--cbd-up:#16a34a;--cbd-up-bg:#e9f8ee;--cbd-down:#dc2626;--cbd-down-bg:#fdecec;width:100%;max-width:360px;background:var(--cbd-bg);color:var(--cbd-fg);border:1px solid var(--cbd-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .cbd{--cbd-bg:#1b1b1e;--cbd-fg:#ececef;--cbd-muted:#a1a1aa;--cbd-faint:#9a9aa2;--cbd-line:#2e2e33;--cbd-chip:#2a2a2f;--cbd-up:#4ade80;--cbd-up-bg:#16301f;--cbd-down:#f87171;--cbd-down-bg:#3a1d1f;color-scheme:dark}
.cbd *{box-sizing:border-box}.cbd button{font:inherit;color:inherit;cursor:pointer}
.cbd-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px 0}
.cbd-head h3{margin:0;font-size:15px;font-weight:500}
.cbd-seg{display:flex;gap:4px}
.cbd-seg button{height:28px;min-width:34px;padding:0 9px;border:1px solid var(--cbd-line);border-radius:6px;background:var(--cbd-bg);font-size:13px;color:var(--cbd-muted)}
.cbd-seg button[aria-checked=true]{background:var(--cbd-chip);border-color:var(--cbd-chip);color:var(--cbd-fg)}
.cbd-total{display:flex;align-items:center;gap:8px;padding:12px 16px 0}
.cbd-big{font-size:26px;font-weight:500;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.15}
.cbd-delta{display:inline-flex;align-items:center;gap:2px;height:20px;padding:0 5px;border-radius:5px;background:var(--cbd-up-bg);color:var(--cbd-up);font-size:12px;font-weight:500}
.cbd-delta.is-down{background:var(--cbd-down-bg);color:var(--cbd-down)}.cbd-delta svg{width:11px;height:11px}
.cbd-sub{padding:2px 16px 0;font-size:12px;color:var(--cbd-muted)}
.cbd-bar{display:flex;gap:2px;height:6px;margin:16px 16px 10px}
.cbd-bar span{border-radius:1px;transition:flex-grow .45s cubic-bezier(.3,.7,.3,1),opacity .15s}
.cbd-list{list-style:none;margin:0;padding:0 16px 10px}
.cbd-list li{display:flex;align-items:center;gap:10px;height:32px;border-radius:4px;outline:none;transition:opacity .15s;animation:cbd-in .3s both}
.cbd-list li:focus-visible{box-shadow:0 0 0 2px var(--cbd-line)}
.cbd-list i{width:8px;height:8px;border-radius:2px;flex:none}
.cbd-label{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cbd-val{font-variant-numeric:tabular-nums}
.cbd-pct{width:34px;text-align:right;font-size:12px;color:var(--cbd-faint);font-variant-numeric:tabular-nums}
.is-dim{opacity:.4}
.cbd-foot{padding:11px 16px;border-top:1px solid var(--cbd-line);font-size:12px}.cbd-foot span{color:var(--cbd-muted)}
.cbd-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0}
.cbd :focus-visible{outline:2px solid #3b82f6;outline-offset:2px}
@keyframes cbd-in{from{opacity:0}}
@media(max-width:340px){.cbd-head{flex-wrap:wrap}.cbd-pct{display:none}}
@media(prefers-reduced-motion:reduce){.cbd *{animation:none!important;transition:none!important}}
.cbd-list>li{animation:cbdlistlirise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.cbd-list>li:nth-child(1){animation-delay:0ms}.cbd-list>li:nth-child(2){animation-delay:100ms}.cbd-list>li:nth-child(3){animation-delay:200ms}.cbd-list>li:nth-child(4){animation-delay:300ms}.cbd-list>li:nth-child(5){animation-delay:400ms}.cbd-list>li:nth-child(6){animation-delay:500ms}.cbd-list>li:nth-child(7){animation-delay:600ms}.cbd-list>li:nth-child(8){animation-delay:700ms}.cbd-list>li:nth-child(9){animation-delay:800ms}.cbd-list>li:nth-child(10){animation-delay:900ms}.cbd-list>li:nth-child(11){animation-delay:1000ms}.cbd-list>li:nth-child(12){animation-delay:1100ms}@keyframes cbdlistlirise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.cbd-list>li{animation:none}}
`;

/** Catalog preview: the demo counts visitors by channel, not money. */
const visitors = (n: number) => Math.round(n).toLocaleString("en-US");
export default function CompactBreakdownPreview() {
  return <CompactBreakdown title="Сувгаар ирсэн зочид" totalLabel="Нийт зочин" format={visitors} />;
}
