"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type ExperimentTone = "red" | "amber" | "green" | "blue" | "violet" | "gray";
export type ExperimentVariant = {
  id: string;
  key: string;
  name: string;
  values: Record<string, number>;
  control?: boolean;
  visitors?: number;
  confidence?: Record<string, number>;
  color?: string;
};
export type ExperimentMetric = {
  id: string;
  label: string;
  format?: (v: number) => string;
  lowerIsBetter?: boolean;
};

export type ExperimentCardProps = {
  title?: string;
  variants?: ExperimentVariant[];
  metrics?: ExperimentMetric[];
  metric?: string;
  defaultMetric?: string;
  onMetricChange?: (id: string) => void;
  winner?: string | null;
  defaultWinner?: string | null;
  onWinnerChange?: (id: string | null) => void;
  status?: { label: string; tone?: ExperimentTone };
  note?: string;
  action?: { label: string | ((v: ExperimentVariant) => string); onClick: (v: ExperimentVariant) => void };
  hint?: React.ReactNode;
  trigger?: "hover" | "click";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const pct = (v: number) => `${v.toFixed(1)}%`;
const defaultMetrics: ExperimentMetric[] = [
  { id: "conversion", label: "Хөрвүүлэлт", format: pct },
  { id: "revenue", label: "Хэрэглээ", format: (v) => `${v.toFixed(2)} мин` },
  { id: "bounce", label: "Гаралт", format: pct, lowerIsBetter: true },
];
const defaultVariants: ExperimentVariant[] = [
  { id: "a", key: "A", name: "Үнэгүй туршилт эхлэх", control: true, values: { conversion: 4.2, revenue: 1.84, bounce: 38.2 }, color: "#a1a1aa" },
  { id: "b", key: "B", name: "Үнэгүй туршаад үз", values: { conversion: 4.7, revenue: 2.03, bounce: 35.1 }, color: "#3b82f6" },
  { id: "c", key: "C", name: "Одоо эхлэх", values: { conversion: 4.0, revenue: 1.71, bounce: 40.6 }, color: "#6366f1" },
];

const useTween = (target: number, ms = 320) => {
  const [v, setV] = React.useState(target);
  const from = React.useRef(target);
  React.useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const start = from.current;
    if (reduce || start === target) { from.current = target; setV(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      const cur = start + (target - start) * e;
      from.current = cur;
      setV(cur);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
};

function Rolling({ value, format }: { value: number; format: (v: number) => string }) {
  return <>{format(useTween(value))}</>;
}

export function ExperimentCard({
  title = "Бүртгэлийн товчны бичвэр",
  variants = defaultVariants,
  metrics = defaultMetrics,
  metric,
  defaultMetric,
  onMetricChange,
  winner,
  defaultWinner = null,
  onWinnerChange,
  status = { label: "Явагдаж байна", tone: "green" },
  note = "14-өөс 9 дэх өдөр",
  action,
  hint = "Ялагчийг сонгох",
  trigger = "hover",
  open,
  defaultOpen = false,
  onOpenChange,
  className = "",
}: ExperimentCardProps) {
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const [innerMetric, setInnerMetric] = React.useState(defaultMetric ?? metrics[0]?.id);
  const [innerWinner, setInnerWinner] = React.useState<string | null>(defaultWinner);
  const [hot, setHot] = React.useState<string | null>(null);
  const isOpen = open ?? innerOpen;
  const mId = metric ?? innerMetric;
  const win = winner !== undefined ? winner : innerWinner;
  const m = metrics.find((x) => x.id === mId) ?? metrics[0];
  const fmt = m.format ?? ((v: number) => String(v));
  const control = variants.find((v) => v.control) ?? variants[0];
  const base = control.values[m.id] ?? 0;
  const delta = (v: ExperimentVariant) => (base ? ((v.values[m.id] - base) / base) * 100 : 0);
  const better = (v: ExperimentVariant) => (m.lowerIsBetter ? -delta(v) : delta(v));
  const leader = variants.filter((v) => v !== control).sort((a, b) => better(b) - better(a))[0];
  const max = Math.max(...variants.map((v) => v.values[m.id] ?? 0), 0.0001);
  const min = Math.min(...variants.map((v) => v.values[m.id] ?? 0));
  const headRef = React.useRef<HTMLButtonElement>(null);

  const setOpen = (o: boolean) => {
    if (open === undefined) setInnerOpen(o);
    onOpenChange?.(o);
  };
  const setMetric = (id: string) => {
    if (metric === undefined) setInnerMetric(id);
    onMetricChange?.(id);
  };
  const pick = (id: string) => {
    const next = win === id ? null : id;
    if (winner === undefined) setInnerWinner(next);
    onWinnerChange?.(next);
  };
  const winV = variants.find((v) => v.id === win);
  const sign = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}%`;
  const showLead = winV ?? leader;
  const leadDelta = showLead ? delta(showLead) : 0;
  const good = showLead ? better(showLead) >= 0 : true;

  return (
    <div
      className={`ec${isOpen ? " is-open" : ""} ${className}`}
      onMouseEnter={trigger === "hover" ? () => setOpen(true) : undefined}
      onMouseLeave={trigger === "hover" ? () => { setOpen(false); setHot(null); } : undefined}
      onKeyDown={(e) => { if (e.key === "Escape" && isOpen) { setOpen(false); headRef.current?.focus(); } }}
    >
      <style>{css}</style>
      <button
        ref={headRef}
        type="button"
        className="ec-head"
        aria-expanded={isOpen}
        aria-label={`${title}, ${status.label}${note ? `, ${note}` : ""}${showLead ? `, ${showLead.key} ${sign(leadDelta)}` : ""}`}
        onClick={() => setOpen(!isOpen)}
      >
        <span className="ec-chart" aria-hidden="true">
          {variants.map((v) => (
            <span
              key={v.id}
              className={hot && hot !== v.id ? "is-dim" : hot === v.id ? "is-hot" : ""}
              style={{ height: `${30 + 70 * (((v.values[m.id] ?? 0) - min) / Math.max(0.0001, max - min))}%`, background: v.color ?? "#3b82f6" }}
            />
          ))}
        </span>
        <span className="ec-titles">
          <strong>{title}</strong>
          <span className="ec-sub">
            <span className={`ec-tag ec-${status.tone ?? "gray"}`}><i />{status.label}</span>
            {note && <span className="ec-note">{note}</span>}
          </span>
        </span>
        {showLead && (
          <span className={`ec-lead ${good ? "is-up" : "is-down"}`}>
            {winV ? <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> : null}
            {showLead.key}
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d={leadDelta >= 0 ? "M2 11.5 6 7.5l2.5 2.5L14 4.5M10 4.5h4v4" : "M2 4.5 6 8.5l2.5-2.5L14 11.5M10 11.5h4v-4"} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {sign(leadDelta)}
          </span>
        )}
      </button>
      <div className="ec-body" inert={!isOpen ? true : undefined} aria-hidden={!isOpen}>
        <div className="ec-inner">
          {metrics.length > 1 && (
            <div
              className="ec-switch"
              role="radiogroup"
              aria-label="Metric"
              onKeyDown={(e) => {
                const i = metrics.findIndex((x) => x.id === m.id);
                if (e.key === "ArrowRight") setMetric(metrics[(i + 1) % metrics.length].id);
                if (e.key === "ArrowLeft") setMetric(metrics[(i - 1 + metrics.length) % metrics.length].id);
              }}
            >
              <span className="ec-thumb" style={{ width: `${100 / metrics.length}%`, transform: `translateX(${metrics.findIndex((x) => x.id === m.id) * 100}%)` }} />
              {metrics.map((x) => (
                <button key={x.id} type="button" role="radio" aria-checked={x.id === m.id} tabIndex={x.id === m.id ? 0 : -1} onClick={() => setMetric(x.id)}>
                  {x.label}
                </button>
              ))}
            </div>
          )}
          <div className="ec-rows" role="radiogroup" aria-label="Variants">
            {variants.map((v) => {
              const d = delta(v);
              const b = m.lowerIsBetter ? -d : d;
              const picked = win === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  aria-label={`${v.key} ${v.name}, ${fmt(v.values[m.id])}${v === control ? ", baseline" : `, ${sign(d)}`}`}
                  className={`ec-row${picked ? " is-picked" : ""}${win && !picked ? " is-other" : ""}`}
                  onMouseEnter={() => setHot(v.id)}
                  onMouseLeave={() => setHot(null)}
                  onFocus={() => setHot(v.id)}
                  onBlur={() => setHot(null)}
                  onClick={() => pick(v.id)}
                >
                  <span className="ec-key" style={{ ["--ec-c" as string]: v.color ?? "#3b82f6" }}>
                    {picked ? <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> : v.key}
                  </span>
                  <span className="ec-name">{v.name}</span>
                  <span className="ec-bar"><span style={{ width: `${((v.values[m.id] ?? 0) / max) * 100}%`, background: v.color ?? "#3b82f6" }} /></span>
                  <span className="ec-val"><Rolling value={v.values[m.id] ?? 0} format={fmt} /></span>
                  <span className={`ec-d${v === control ? "" : b >= 0 ? " is-up" : " is-down"}`}>{v === control ? "Base" : sign(d)}</span>
                </button>
              );
            })}
          </div>
          <div className="ec-last" aria-live="polite">
            {winV ? (
              <>
                <span>{winV.key} picked · {winV.name}</span>
                <button type="button" className="ec-action" onClick={() => action?.onClick(winV)}>
                  {action ? (typeof action.label === "function" ? action.label(winV) : action.label) : `Ship ${winV.key}`}
                </button>
              </>
            ) : (
              <span>{hot ? `${variants.find((v) => v.id === hot)?.name}` : hint}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
.ec{--ec-bg:#fff;--ec-fg:#18181b;--ec-muted:#71717a;--ec-faint:#a1a1aa;--ec-line:#ececef;--ec-soft:#f4f4f5;--ec-green:#16a34a;--ec-green-bg:#e8f7ee;--ec-red:#e5484d;--ec-red-bg:#fdecec;--ec-accent:#3b82f6;width:100%;max-width:340px;background:var(--ec-bg);color:var(--ec-fg);border:1px solid var(--ec-line);border-radius:10px;box-shadow:0 1px 2px #0000000a;font:400 13px/1.4 Inter,system-ui,sans-serif;transition:box-shadow .2s}
.ec.is-open{box-shadow:0 8px 28px #00000014}
:where(.dark,[data-theme=dark]) .ec{--ec-bg:#1b1b1e;--ec-fg:#ececef;--ec-muted:#a1a1aa;--ec-faint:#71717a;--ec-line:#2e2e33;--ec-soft:#26262b;--ec-green-bg:#16301f;--ec-red-bg:#3a1c1e;color-scheme:dark}
.ec *{box-sizing:border-box}.ec button{font:inherit;color:inherit;cursor:pointer}
.ec-head{display:flex;align-items:center;gap:10px;width:100%;padding:12px 12px 12px 12px;border:0;background:none;text-align:left;border-radius:10px}
.ec-chart{display:flex;align-items:flex-end;justify-content:center;gap:2px;width:36px;height:36px;padding:7px 6px;border:1px solid var(--ec-line);border-radius:7px;flex:none;background:var(--ec-bg)}
.ec-chart span{width:5px;border-radius:1px;transition:height .35s cubic-bezier(.2,.8,.2,1),opacity .2s,width .2s}
.ec-chart .is-dim{opacity:.3}.ec-chart .is-hot{width:7px}
.ec-titles{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.ec-titles strong{font-weight:500;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ec-sub{display:flex;align-items:center;gap:6px;font-size:12px}
.ec-tag{display:inline-flex;align-items:center;gap:5px;height:18px;padding:0 6px;border-radius:4px;font-weight:500;font-size:12px}
.ec-tag i{width:5px;height:5px;border-radius:50%;background:currentColor}
.ec-green{color:var(--ec-green);background:var(--ec-green-bg)}.ec-red{color:var(--ec-red);background:var(--ec-red-bg)}.ec-amber{color:#b45309;background:#fff4e0}.ec-blue{color:#2563eb;background:#eaf2ff}.ec-violet{color:#7c3aed;background:#f1ecfe}.ec-gray{color:var(--ec-muted);background:var(--ec-soft)}
.ec-note{color:var(--ec-muted)}
.ec-lead{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 7px;border-radius:5px;font-size:12px;font-weight:500;flex:none;font-variant-numeric:tabular-nums}
.ec-lead svg{width:12px;height:12px}
.ec-lead.is-up{color:var(--ec-green);background:var(--ec-green-bg)}.ec-lead.is-down{color:var(--ec-red);background:var(--ec-red-bg)}
.ec-body{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows .3s cubic-bezier(.2,.8,.2,1),opacity .25s}
.ec.is-open .ec-body{grid-template-rows:1fr;opacity:1}
.ec-inner{overflow:hidden;min-height:0}
.ec-switch{position:relative;display:flex;margin:0 12px 8px;padding:2px;border-radius:7px;background:var(--ec-soft)}
.ec-thumb{position:absolute;top:2px;bottom:2px;left:2px;max-width:calc(100% - 4px);border-radius:5px;background:var(--ec-bg);box-shadow:0 1px 2px #00000014;transition:transform .18s cubic-bezier(.2,.8,.2,1)}
.ec-switch button{position:relative;flex:1;height:24px;border:0;background:none;font-size:12px!important;color:var(--ec-muted)!important}
.ec-switch button[aria-checked=true]{color:var(--ec-fg)!important;font-weight:500}
.ec-rows{display:flex;flex-direction:column;padding:0 6px}
.ec-row{display:grid;grid-template-columns:20px minmax(0,1fr) 54px 42px 48px;align-items:center;gap:8px;height:34px;padding:0 6px;border:0;border-radius:6px;background:none;text-align:left;transition:background .15s,opacity .15s}
.ec-row:hover{background:var(--ec-soft)}.ec-row.is-other{opacity:.5}
.ec-key{display:grid;place-items:center;width:20px;height:20px;border-radius:5px;background:color-mix(in srgb,var(--ec-c) 14%,transparent);color:var(--ec-c);font-size:11px;font-weight:600}
.ec-row.is-picked .ec-key{background:var(--ec-c);color:#fff}.ec-key svg{width:12px;height:12px}
.ec-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ec-bar{height:4px;border-radius:2px;background:var(--ec-soft);overflow:hidden}.ec-bar span{display:block;height:100%;border-radius:2px;transition:width .35s cubic-bezier(.2,.8,.2,1)}
.ec-val{text-align:right;font-variant-numeric:tabular-nums;font-weight:500}
.ec-d{text-align:right;font-size:12px;color:var(--ec-faint);font-variant-numeric:tabular-nums}.ec-d.is-up{color:var(--ec-green)}.ec-d.is-down{color:var(--ec-red)}
.ec-last{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:44px;margin-top:6px;padding:8px 12px;border-top:1px solid var(--ec-line);font-size:12px;color:var(--ec-muted)}
.ec-action{height:26px;padding:0 10px;border:0;border-radius:6px;background:var(--ec-fg);color:var(--ec-bg)!important;font-size:12px!important;font-weight:500;animation:ec-pop .2s both}
.ec :focus-visible{outline:2px solid var(--ec-accent);outline-offset:2px}
@keyframes ec-pop{from{transform:scale(.85);opacity:0}}
@media(max-width:400px){.ec-row{grid-template-columns:20px minmax(0,1fr) 42px 46px}.ec-bar{display:none}}
@media(prefers-reduced-motion:reduce){.ec *,.ec{animation:none!important;transition:none!important}}
`;

export default ExperimentCard;
