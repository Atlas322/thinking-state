"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type KpiSeries = { label: string; color: string; values: number[] };

export type KPIChartProps = {
  title?: string;
  value?: string;
  delta?: number;
  labels?: string[];
  tooltipLabels?: string[];
  series?: KpiSeries[];
  format?: (n: number) => string;
  footer?: string;
  defaultIndex?: number;
  emptyText?: string;
  className?: string;
};

const compact = (n: number) => {
  const a = Math.abs(n);
  const s = a >= 1e6 ? `${+(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `${+(a / 1e3).toFixed(1)}k` : `${Math.round(a)}`;
  return `${n < 0 ? "-" : ""}${s}`;
};

const days = ["3/3", "3/4", "3/5", "3/6", "3/7", "3/8", "3/9"];
const weekdays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"];

const defaultSeries: KpiSeries[] = [
  { label: "Хайлт", color: "#3b82f6", values: [4200, 4600, 3900, 4500, 5100, 4900, 5800] },
  { label: "Зар сурталчилгаа", color: "#ec4899", values: [3600, 3300, 4300, 4600, 3900, 4300, 4100] },
  { label: "Санал болголт", color: "#8b5cf6", values: [1800, 2300, 2000, 1500, 2400, 2200, 2700] },
  { label: "Имэйл", color: "#10b981", values: [1200, 1100, 1700, 2100, 1600, 1300, 1500] },
  { label: "Шууд", color: "#a1a1aa", values: [600, 900, 700, 800, 1000, 1400, 1100] },
];

const niceMax = (v: number) => {
  if (v <= 0) return 1;
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  const m = [1, 1.5, 2, 3, 4, 5, 6, 8, 10].find((k) => k * step >= v) ?? 10;
  return m * step;
};

export function KPIChart({
  title = "Зочилсон хүн",
  value = "96.4k",
  delta = 7900,
  labels = days,
  tooltipLabels = days.map((d, i) => `${weekdays[i]}, ${d}`),
  series = defaultSeries,
  format = compact,
  footer = "Шилдэг 5 суваг",
  defaultIndex,
  emptyText = "Одоогоор өгөгдөл алга",
  className = "",
}: KPIChartProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const idx = hover ?? defaultIndex ?? null;

  const W = 400;
  const H = 140;
  const n = labels.length;
  const all = series.flatMap((s) => s.values);
  const empty = !all.length || all.every((v) => !v);
  const max = niceMax(Math.max(0, ...all));
  const x = (i: number) => (n <= 1 ? W / 2 : (i / (n - 1)) * W);
  const y = (v: number) => H - (v / max) * H;
  const ticks = [max, max / 2, 0];
  const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");

  const pick = (clientX: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r || n < 1) return;
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setHover(Math.round(p * (n - 1)));
  };

  const axisIdx = n > 2 ? [0, Math.floor((n - 1) / 2), n - 1] : labels.map((_, i) => i);
  const sortedAt = (i: number) => [...series].sort((a, b) => (b.values[i] ?? 0) - (a.values[i] ?? 0));

  return (
    <section className={`kpc ${className}`} aria-label={title}>
      <style>{css}</style>
      <div className="kpc-body">
        <div className="kpc-title">{title}</div>
        <div className="kpc-value">
          <span>{value}</span>
          {delta !== undefined && (
            <span className={`kpc-delta${delta < 0 ? " is-down" : ""}`}>
              {delta < 0 ? "" : "+"}
              {format(delta)}
            </span>
          )}
        </div>
        <div className="kpc-chart">
          <div className="kpc-y" aria-hidden="true">
            {ticks.map((t) => (
              <span key={t}>{format(t)}</span>
            ))}
          </div>
          <div className="kpc-plot">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={`${title}, сувгаар: ${series.map((s) => s.label).join(", ")}`}
              tabIndex={0}
              onMouseMove={(e) => pick(e.clientX)}
              onMouseLeave={() => setHover(null)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setHover(Math.min(n - 1, (idx ?? -1) + 1));
                if (e.key === "ArrowLeft") setHover(Math.max(0, (idx ?? n) - 1));
                if (e.key === "Escape") setHover(null);
              }}
              onBlur={() => setHover(null)}
            >
              {ticks.map((t) => (
                <line key={t} className="kpc-grid" x1="0" x2={W} y1={y(t)} y2={y(t)} vectorEffect="non-scaling-stroke" />
              ))}
              {!empty &&
                series.map((s) => (
                  <path
                    key={s.label}
                    d={path(s.values)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className={`kpc-line${idx !== null ? " is-active" : ""}`}
                  />
                ))}
              {idx !== null && !empty && <line className="kpc-cross" x1={x(idx)} x2={x(idx)} y1="0" y2={H} vectorEffect="non-scaling-stroke" />}
            </svg>
            {idx !== null &&
              !empty &&
              series.map((s) => (
                <span
                  key={s.label}
                  className="kpc-dot"
                  style={{ left: `${(x(idx) / W) * 100}%`, top: `${(y(s.values[idx] ?? 0) / H) * 100}%`, background: s.color }}
                />
              ))}
            {empty && <div className="kpc-empty">{emptyText}</div>}
            {idx !== null && !empty && (
              <div
                className={`kpc-tip${idx > (n - 1) / 2 ? " is-left" : ""}`}
                style={{ left: `${(x(idx) / W) * 100}%` }}
                role="status"
              >
                <div className="kpc-tip-h">{tooltipLabels[idx] ?? labels[idx]}</div>
                {sortedAt(idx).map((s) => (
                  <div key={s.label} className="kpc-tip-row">
                    <i style={{ background: s.color }} />
                    <span>{s.label}</span>
                    <b>{format(s.values[idx] ?? 0)}</b>
                  </div>
                ))}
              </div>
            )}
            <div className="kpc-x" aria-hidden="true">
              {axisIdx.map((i) => (
                <span key={i} style={{ left: `${(x(i) / W) * 100}%` }} className={i === 0 ? "is-first" : i === n - 1 ? "is-last" : ""}>
                  {labels[i]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {footer && <footer className="kpc-foot">{footer}</footer>}
    </section>
  );
}

const css = `
.kpc{--kpc-bg:#fff;--kpc-fg:#18181b;--kpc-muted:#65656d;--kpc-faint:#65656d;--kpc-line:#ececef;--kpc-grid:#f0f0f2;--kpc-up:#16a34a;--kpc-up-bg:#e9f8ee;--kpc-down:#dc2626;--kpc-down-bg:#fdecec;width:100%;max-width:440px;background:var(--kpc-bg);color:var(--kpc-fg);border:1px solid var(--kpc-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:visible}
:where(.dark,[data-theme=dark]) .kpc{--kpc-bg:#1b1b1e;--kpc-fg:#ececef;--kpc-muted:#a1a1aa;--kpc-faint:#9a9aa2;--kpc-line:#2e2e33;--kpc-grid:#26262b;--kpc-up:#4ade80;--kpc-up-bg:#16301f;--kpc-down:#f87171;--kpc-down-bg:#3a1d1f;color-scheme:dark}
.kpc *{box-sizing:border-box}
.kpc-body{padding:16px 16px 12px}
.kpc-title{font-size:15px;font-weight:500}
.kpc-value{display:flex;align-items:center;gap:8px;margin-top:4px}
.kpc-value>span:first-child{font-size:24px;font-weight:500;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.kpc-delta{height:20px;padding:0 5px;border-radius:5px;background:var(--kpc-up-bg);color:var(--kpc-up);font-size:12px;font-weight:500;line-height:20px}
.kpc-delta.is-down{background:var(--kpc-down-bg);color:var(--kpc-down)}
.kpc-chart{display:flex;gap:10px;margin-top:14px}
.kpc-y{display:flex;flex-direction:column;justify-content:space-between;height:140px;margin:-7px 0 0;font-size:11px;color:var(--kpc-muted);text-align:right;font-variant-numeric:tabular-nums}
.kpc-y span{line-height:14px}
.kpc-plot{position:relative;flex:1;min-width:0}
.kpc-plot svg{display:block;width:100%;height:140px;overflow:visible;outline:none;cursor:crosshair}
.kpc-plot svg:focus-visible{box-shadow:0 0 0 2px #3b82f655;border-radius:4px}
.kpc-grid{stroke:var(--kpc-grid);stroke-width:1}
.kpc-line{transition:opacity .15s}
.kpc-cross{stroke:var(--kpc-faint);stroke-width:1;stroke-dasharray:3 3}
.kpc-dot{position:absolute;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;border:1.5px solid var(--kpc-bg);box-shadow:0 0 0 .5px #0002;pointer-events:none}
.kpc-x{position:relative;height:16px;margin-top:6px;font-size:11px;color:var(--kpc-muted)}
.kpc-x span{position:absolute;transform:translateX(-50%);white-space:nowrap}.kpc-x .is-first{transform:none}.kpc-x .is-last{transform:translateX(-100%)}
.kpc-empty{position:absolute;inset:0 0 22px;display:grid;place-items:center;font-size:13px;color:var(--kpc-faint)}
.kpc-tip{position:absolute;top:-6px;z-index:3;min-width:150px;margin-left:12px;padding:8px 10px;border:1px solid var(--kpc-line);border-radius:8px;background:var(--kpc-bg);box-shadow:0 6px 20px #0000001a;font-size:12px;pointer-events:none;animation:kpc-in .15s both}
.kpc-tip.is-left{transform:translateX(calc(-100% - 24px))}
.kpc-tip-h{margin-bottom:4px;color:var(--kpc-muted)}
.kpc-tip-row{display:flex;align-items:center;gap:7px;line-height:20px}.kpc-tip-row i{width:8px;height:2px;border-radius:1px}
.kpc-tip-row span{flex:1}.kpc-tip-row b{font-weight:500;font-variant-numeric:tabular-nums}
.kpc-foot{padding:10px 16px;border-top:1px solid var(--kpc-line);font-size:12px;color:var(--kpc-muted)}
@keyframes kpc-in{from{opacity:0}}
@media(max-width:360px){.kpc-body{padding:14px 12px 10px}.kpc-tip{min-width:130px}}
@media(prefers-reduced-motion:reduce){.kpc *{animation:none!important;transition:none!important}}
`;

export default KPIChart;
