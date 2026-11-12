"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type UsagePart = { label: string; value: number; color?: string };
export type UsageLimit = { label: string; used: number; total?: number | null; unit?: string; decimals?: number };
export type UsagePeriod = { id: string; label: string };
export type UsageDay = { label: string; value: number | null };
export type UsageState = "ok" | "warn" | "limit";

export type UsageMeterProps = {
  total?: number;
  used?: UsagePart[];
  limits?: UsageLimit[];
  periods?: UsagePeriod[];
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (id: string) => void;
  /** Days until reset, or a date. */
  resetAt?: Date | string | number;
  daily?: UsageDay[];
  onUpgrade?: (state: UsageState) => void;
  title?: string;
  plan?: string;
  unit?: string;
  warnAt?: number;
  upgradeLabel?: string;
  topUpLabel?: string;
  className?: string;
};

const tints = ["#3b7be8", "#7ea7ec", "#aac6f2", "#d4e3f8", "#d4d4d8"];

const dailyBase = [180, 260, 250, 210, 330, 130, 150, 290, 290, 250, 320, 110, 140, 360, 380, 310, 260, 270, 170, 340, 230, 300];
const dailyScale = 7420 / dailyBase.reduce((n, v) => n + v, 0);
const dailyDemo: UsageDay[] = dailyBase.map((v, i) => ({ label: `${i + 1}-р өдөр`, value: Math.round(v * dailyScale) }));
for (let i = 0; i < 8; i++) dailyDemo.push({ label: `${23 + i}-р өдөр`, value: null });

const fmt = (n: number, d = 0) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

function daysUntil(r: UsageMeterProps["resetAt"]) {
  if (r == null) return null;
  if (typeof r === "number" && r < 1000) return r;
  const ms = new Date(r).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 864e5));
}

export function UsageMeter({
  total = 10000,
  used = [
    { label: "Чат", value: 3980 },
    { label: "Хайлт", value: 1640 },
    { label: "Зураг", value: 1120 },
    { label: "API", value: 680 },
  ],
  limits = [
    { label: "Суудал", used: 8, total: 10 },
    { label: "Хадгалах сан", used: 3.2, total: 5, unit: "GB", decimals: 1 },
    { label: "Төсөл", used: 12, total: null },
  ],
  periods = [
    { id: "month", label: "Энэ сар" },
    { id: "last", label: "Өнгөрсөн сар" },
    { id: "7d", label: "7 хоног" },
  ],
  period,
  defaultPeriod,
  onPeriodChange,
  resetAt = 9,
  daily = dailyDemo,
  onUpgrade,
  title = "AI туслах",
  plan = "Про багц",
  unit = "кредит",
  warnAt = 0.8,
  upgradeLabel = "Багц ахиулах",
  topUpLabel = "Кредит нэмэх",
  className = "",
}: UsageMeterProps) {
  const [inner, setInner] = React.useState(defaultPeriod ?? periods[0]?.id);
  const active = period ?? inner;
  const [hover, setHover] = React.useState<number | null>(null);
  const [day, setDay] = React.useState<number | null>(null);
  const sum = used.reduce((n, p) => n + p.value, 0);
  const share = total ? sum / total : 0;
  const state: UsageState = share >= 1 ? "limit" : share >= warnAt ? "warn" : "ok";
  const maxDay = Math.max(1, ...daily.map((d) => d.value ?? 0));
  const real = daily.filter((d) => d.value != null) as { label: string; value: number }[];
  const avg = real.length ? Math.round(real.reduce((n, d) => n + d.value, 0) / real.length) : 0;
  const days = daysUntil(resetAt);
  const pick = (id: string) => {
    setInner(id);
    onPeriodChange?.(id);
  };

  return (
    <section className={`um um-${state} ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="um-head">
        <div className="um-title">
          <h3>{title}</h3>
          <p>
            {plan}
            {plan && days != null && <span className="um-dot">·</span>}
            {days != null && `${days} хоногийн дараа шинэчлэгдэнэ`}
          </p>
        </div>
        {periods.length > 0 && (
          <div className="um-switch" role="radiogroup" aria-label="Хугацаа">
            {periods.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={p.id === active}
                tabIndex={p.id === active ? 0 : -1}
                onClick={() => pick(p.id)}
                onKeyDown={(e) => {
                  const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!d) return;
                  e.preventDefault();
                  const n = periods[(i + d + periods.length) % periods.length];
                  pick(n.id);
                  (e.currentTarget.parentElement?.children[(i + d + periods.length) % periods.length] as HTMLElement)?.focus();
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="um-big">
        <strong>{fmt(sum)}</strong>
        <span>
          / {fmt(total)} {unit}
        </span>
        <em className="um-share">{Math.round(share * 100)}%</em>
      </div>
      <div
        className="um-bar"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={sum}
        aria-valuetext={`${fmt(sum)} / ${fmt(total)} ${unit}`}
        tabIndex={0}
        onMouseLeave={() => setHover(null)}
      >
        {used.map((p, i) => (
          <span
            key={p.label}
            className={hover != null && hover !== i ? "is-dim" : ""}
            style={{ width: `${(p.value / total) * 100}%`, background: p.color ?? tints[Math.min(i, tints.length - 1)] }}
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </div>

      <ul className="um-legend">
        {used.map((p, i) => (
          <li
            key={p.label}
            className={hover === i ? "is-on" : hover != null ? "is-dim" : ""}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <i style={{ background: p.color ?? tints[Math.min(i, tints.length - 1)] }} />
            <span className="um-l">{p.label}</span>
            <span className="um-v">{fmt(p.value)}</span>
            <span className="um-p">{sum ? Math.round((p.value / sum) * 100) : 0}%</span>
          </li>
        ))}
      </ul>

      {daily.length > 0 && (
        <div className="um-daily">
          <div className="um-daily-h">
            <span>Өдөрт</span>
            <span>
              {day != null && daily[day].value != null ? (
                <>
                  {daily[day].label} <b>{fmt(daily[day].value as number)}</b>
                </>
              ) : (
                <>
                  Дундаж <b>{fmt(avg)}</b> / өдөр
                </>
              )}
            </span>
          </div>
          <div className="um-spark" onMouseLeave={() => setDay(null)}>
            {daily.map((d, i) => (
              <span
                key={i}
                className={d.value == null ? "is-future" : day === i ? "is-on" : ""}
                style={{ height: d.value == null ? 2 : `${Math.max(8, (d.value / maxDay) * 100)}%` }}
                onMouseEnter={() => setDay(i)}
              />
            ))}
          </div>
        </div>
      )}

      {limits.length > 0 && (
        <div className="um-limits">
          {limits.map((l) => {
            const s = l.total ? l.used / l.total : 0;
            const warn = l.total != null && s >= warnAt;
            return (
              <div key={l.label} className={`um-limit ${warn ? "is-warn" : ""} ${l.total == null ? "is-inf" : ""}`}>
                <span className="um-limit-l">
                  {l.label}
                  {warn && <i className="um-warn-dot" aria-label="Дуусах дөхсөн" />}
                </span>
                <span className="um-limit-v">
                  <b>{fmt(l.used, l.decimals ?? 0)}</b> / {l.total == null ? "∞" : fmt(l.total, 0)}
                  {l.unit ? ` ${l.unit}` : ""}
                </span>
                <span
                  className="um-track"
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={l.total ?? undefined}
                  aria-valuenow={l.used}
                  aria-label={l.label}
                >
                  {l.total != null && <span style={{ width: `${Math.min(100, s * 100)}%` }} />}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <footer className="um-foot">
        <span>
          {state === "limit" ? "Кредит дууссан" : `${fmt(Math.max(0, total - sum))} ${unit} үлдсэн`}
        </span>
        <button type="button" className={state === "ok" ? "" : "is-dark"} onClick={() => onUpgrade?.(state)}>
          {state === "ok" ? upgradeLabel : topUpLabel}
        </button>
      </footer>
    </section>
  );
}

const css = `
.um{--um-bg:#fff;--um-fg:#18181b;--um-muted:#65656d;--um-faint:#65656d;--um-line:#ececef;--um-chip:#f1f1f3;--um-track:#ececef;--um-spark:#e4e4e7;--um-amber:#e8a10c;--um-blue:#3b7be8;width:100%;max-width:460px;background:var(--um-bg);color:var(--um-fg);border:1px solid var(--um-line);border-radius:14px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums}
:where(.dark,[data-theme=dark]) .um{--um-bg:#1b1b1e;--um-fg:#ececef;--um-muted:#a1a1aa;--um-faint:#9a9aa2;--um-line:#2e2e33;--um-chip:#2a2a2f;--um-track:#2e2e33;--um-spark:#3a3a40;color-scheme:dark}
.um *{box-sizing:border-box}.um button{font:inherit;color:inherit;cursor:pointer}
.um-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:16px 16px 0}
.um-title h3{margin:0;font-size:15px;font-weight:500;letter-spacing:-.01em}
.um-title p{margin:2px 0 0;font-size:12px;color:var(--um-muted)}.um-dot{margin:0 6px;color:var(--um-faint)}
.um-switch{display:flex;gap:6px;flex:none}
.um-switch button{height:28px;padding:0 10px;border:1px solid var(--um-line);border-radius:7px;background:var(--um-bg);font-size:13px;color:var(--um-muted);transition:background .15s,color .15s}
.um-switch button[aria-checked=true]{background:var(--um-chip);border-color:var(--um-chip);color:var(--um-fg)}
.um-big{display:flex;align-items:baseline;gap:8px;padding:14px 16px 0}
.um-big strong{font-size:26px;font-weight:500;letter-spacing:-.02em}.um-big span{font-size:12px;color:var(--um-muted)}
.um-share{margin-left:auto;font-style:normal;font-size:12px;padding:1px 6px;border-radius:5px;background:var(--um-chip);color:var(--um-muted)}
.um-warn .um-share{background:#fdf1d6;color:#a16207}.um-limit .um-share{background:#fde2e2;color:#b91c1c}
.um-bar{display:flex;gap:2px;height:8px;margin:12px 16px 0;border-radius:3px;background:var(--um-track);overflow:hidden;outline-offset:3px}
.um-bar span{height:100%;transition:opacity .15s,width .4s}.um-bar .is-dim{opacity:.35}
.um-legend{list-style:none;margin:14px 0 0;padding:0 16px}
.um-legend li{display:grid;grid-template-columns:14px 1fr auto 46px;align-items:center;height:32px;transition:opacity .15s}
.um-legend li.is-dim{opacity:.45}
.um-legend i{width:7px;height:7px;border-radius:2px}
.um-v{text-align:right}.um-p{text-align:right;font-size:12px;color:var(--um-faint)}
.um-daily{padding:12px 16px 0}
.um-daily-h{display:flex;justify-content:space-between;font-size:11px;color:var(--um-muted)}
.um-daily-h>span:first-child{text-transform:uppercase;letter-spacing:.04em}.um-daily-h b{font-weight:500;color:var(--um-fg)}
.um-spark{display:flex;align-items:flex-end;gap:2px;height:32px;margin-top:8px}
.um-spark span{flex:1;background:var(--um-spark);border-radius:1px;transition:background .15s}
.um-spark span.is-on{background:var(--um-blue)}.um-spark span.is-future{background:var(--um-track)}
.um-limits{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:14px 16px 0;padding:14px 0 18px;border-top:1px solid var(--um-line)}
.um-limit{display:flex;flex-direction:column;gap:1px;min-width:0}
.um-limit-l{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--um-muted)}
.um-warn-dot{width:5px;height:5px;border-radius:50%;background:var(--um-amber)}
.um-limit-v{font-size:14px;color:var(--um-muted);white-space:nowrap}.um-limit-v b{font-weight:400;color:var(--um-fg)}
.um-track{display:block;height:4px;margin-top:6px;border-radius:2px;background:var(--um-track);overflow:hidden}
.um-track span{display:block;height:100%;border-radius:2px;background:var(--um-blue)}
.um-limit.is-warn .um-track span{background:var(--um-amber)}
.um-limit.is-inf .um-track{background:repeating-linear-gradient(-45deg,var(--um-track) 0 4px,transparent 4px 7px)}
.um-foot{display:flex;align-items:center;justify-content:space-between;padding:8px 8px 8px 16px;border-top:1px solid var(--um-line);font-size:12px;color:var(--um-muted)}
.um-foot button{height:32px;padding:0 11px;border:0;border-radius:8px;background:var(--um-bg);box-shadow:0 0 0 1px var(--um-line),0 1px 2px #0000000f;font-size:14px;font-weight:500;color:var(--um-fg);transition:background .2s,color .2s}
.um-foot button.is-dark{background:var(--um-fg);color:var(--um-bg);box-shadow:none}
.um :focus-visible{outline:2px solid var(--um-blue);outline-offset:2px}
@media(max-width:400px){.um-head{flex-direction:column}.um-limits{grid-template-columns:minmax(0,1fr)}}
@media(prefers-reduced-motion:reduce){.um *{transition:none!important;animation:none!important}}
`;

export default UsageMeter;
