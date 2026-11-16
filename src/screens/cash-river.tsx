/**
 * CashRiver (2026-11-17, screens.14): «Мөнгөний гол» from the Second Brain Figma (06 Санхүү ·
 * Мөнгөний гол + Хэрэв… горим). The account balance across a month drawn as a river: its width is
 * the balance, money in joins from above, money out leaves below, the day it runs under the safety
 * line turns red. A scenario switches planned payments on and off and shows the river it would be,
 * over the dashed outline of the current one, with the agent's suggestion.
 *
 * Text never carries meaning by colour alone: every pin has its amount, the danger day is named.
 */
import * as React from "react";

export type CashEvent = { id: string; day: number; label: string; amount: number; pending?: boolean };
export type CashToggle = { id: string; label: string; detail?: string; day: number; amount: number; on?: boolean };
export type CashRiverProps = {
  title?: string;
  /** Balance at the start of day 1. */
  opening: number;
  days?: number;
  today?: number;
  /** Safety line: below it the river turns red. */
  floor: number;
  events: CashEvent[];
  /** «Хэрэв…» mode: planned payments that can be switched on or off. */
  scenario?: CashToggle[];
  suggestion?: string;
  unit?: string;
  className?: string;
};

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(Math.abs(n))).replace(/,/g, " ");

function balances(opening: number, days: number, events: { day: number; amount: number }[]) {
  const out: number[] = [];
  let b = opening;
  for (let d = 1; d <= days; d++) {
    for (const e of events) if (e.day === d) b += e.amount;
    out.push(b);
  }
  return out;
}

const W = 960, H = 320, MID = 160, PAD = 24, HALF = 64;

function riverPath(vals: number[], max: number) {
  const n = vals.length;
  const x = (i: number) => PAD + (i * (W - 2 * PAD)) / (n - 1);
  const half = (v: number) => Math.max(3, (Math.max(v, 0) / max) * HALF);
  const top = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${(MID - half(v)).toFixed(1)}`).join(" ");
  const bottom = vals.map((_, i) => `L${x(n - 1 - i).toFixed(1)} ${(MID + half(vals[n - 1 - i])).toFixed(1)}`).join(" ");
  return { d: `${top} ${bottom} Z`, x, half };
}

const CSS = `
.cr{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-surface);border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);padding:var(--ts-space-4,16px);display:grid;gap:var(--ts-space-3,12px);min-width:0}
.cr-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px}
.cr-head h3{margin:0;font:var(--ts-head-weight,600) 16px/1.3 var(--ts-font-head,var(--ts-font))}
.cr-head p{margin:0;font-size:12px;color:var(--ts-muted)}
.cr-body{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--ts-space-4,16px)}
.cr-body.has-side{grid-template-columns:minmax(0,1fr) 260px}
.cr svg{display:block;width:100%;height:auto;overflow:visible}
.cr-band{fill:color-mix(in srgb,var(--ts-series-3) 55%,var(--ts-surface))}
.cr-was{fill:none;stroke:var(--ts-muted);stroke-width:1.2;stroke-dasharray:4 4}
.cr-mid{stroke:color-mix(in srgb,var(--ts-surface) 60%,transparent);stroke-width:1}
.cr-danger{fill:var(--ts-status-error-fg)}
.cr-today{stroke:var(--ts-electric);stroke-width:1.5}
.cr-pin{stroke:var(--ts-muted);stroke-width:1}
.cr-dot{fill:var(--ts-fg)}
.cr-lbl{font-size:11px;fill:var(--ts-fg)}.cr-amt{font-size:10.5px;fill:var(--ts-muted);font-variant-numeric:tabular-nums}
.cr-day{font-size:10px;fill:var(--ts-faint);font-variant-numeric:tabular-nums}
.cr-side{display:grid;gap:10px;align-content:start;font-size:13px}
.cr-tog{color:inherit;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-control,8px);background:var(--ts-page);cursor:pointer;text-align:left;width:100%}
.cr-tog[aria-pressed=true]{border-color:var(--ts-status-needs-you-border);background:var(--ts-status-needs-you-bg)}
.cr-tog small{display:block;color:var(--ts-muted);font-size:11.5px}
.cr-tog i{flex:none;width:30px;height:18px;border-radius:9px;background:var(--ts-soft-2);position:relative}
.cr-tog i::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--ts-surface);box-shadow:0 0 0 1px var(--ts-line);transition:left var(--ts-motion-dur-xs,120ms)}
.cr-tog[aria-pressed=true] i{background:var(--ts-status-needs-you-fg)}.cr-tog[aria-pressed=true] i::after{left:14px}
.cr-tog:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.cr-out{display:grid;gap:2px;padding:10px 12px;border-radius:var(--ts-radius-control,8px);background:var(--ts-soft)}
.cr-out b{font-variant-numeric:tabular-nums}.cr-out .is-bad{color:var(--ts-status-error-fg)}
.cr-agent{padding:10px 12px;border-radius:var(--ts-radius-control,8px);border:1px solid var(--ts-status-done-border);background:var(--ts-status-done-bg);color:var(--ts-fg);font-size:12.5px;line-height:1.5}
.cr-agent small{display:block;font:500 10.5px/1.4 var(--ts-font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-status-done-fg)}
@media (max-width:760px){.cr-body.has-side{grid-template-columns:minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){.cr *{transition:none!important}}
`;

export function CashRiver({ title = "Мөнгөний гол", opening, days = 31, today, floor, events, scenario, suggestion, unit = "сая ₮", className = "" }: CashRiverProps) {
  const [on, setOn] = React.useState<Record<string, boolean>>(() => Object.fromEntries((scenario ?? []).map((t) => [t.id, !!t.on])));
  const base = balances(opening, days, events);
  const extra = (scenario ?? []).filter((t) => on[t.id]).map((t) => ({ day: t.day, amount: t.amount }));
  const vals = scenario ? balances(opening, days, [...events, ...extra]) : base;
  const max = Math.max(...base, ...vals, floor) * 1.05;
  const river = riverPath(vals, max);
  const was = scenario && extra.length ? riverPath(base, max) : null;
  const danger = vals.map((v, i) => (v < floor ? i : -1)).filter((i) => i >= 0);
  const minIdx = vals.indexOf(Math.min(...vals));
  const dangerDays = danger.length;
  const baseDanger = base.filter((v) => v < floor).length;
  const x = river.x;
  const pins = [...events.map((e) => ({ ...e, scen: false })), ...(scenario ?? []).filter((t) => on[t.id]).map((t) => ({ id: t.id, day: t.day, label: t.label, amount: t.amount, pending: true, scen: true }))];
  let up = 0, down = 0;
  return (
    <section className={`cr ${className}`} aria-label={title}>
      <style>{CSS}</style>
      <header className="cr-head">
        <h3>{title}</h3>
        <p>Голын өргөн = дансны үлдэгдэл · дээрээс орлого, доошоо зарлага · {unit}</p>
      </header>
      <div className={`cr-body ${scenario ? "has-side" : ""}`}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}: эхэнд ${fmt(opening)}, хамгийн бага ${fmt(vals[minIdx])} (${minIdx + 1}-нд), аюулгүйн хязгаар ${fmt(floor)} ${unit}${dangerDays ? `, ${dangerDays} өдөр хязгаараас доош` : ""}`}>
          <path className="cr-band" d={river.d} />
          {was && <path className="cr-was" d={was.d} />}
          <line className="cr-mid" x1={PAD} x2={W - PAD} y1={MID} y2={MID} />
          {danger.map((i) => (
            <rect key={i} className="cr-danger" x={x(i) - 4} y={MID - river.half(vals[i]) - 2} width={8} height={river.half(vals[i]) * 2 + 4} rx={2} />
          ))}
          {today && <line className="cr-today" x1={x(today - 1)} x2={x(today - 1)} y1={MID - HALF - 6} y2={MID + HALF + 6} />}
          {today && <text className="cr-day" x={x(today - 1)} y={H - 18} textAnchor="middle" style={{ fill: "var(--ts-electric-fg)" }}>Өнөөдөр</text>}
          {pins.map((p) => {
            const above = p.amount > 0;
            const slot = above ? up++ : down++;
            const px = x(p.day - 1);
            const edge = above ? MID - river.half(vals[p.day - 1]) : MID + river.half(vals[p.day - 1]);
            const ty = above ? 16 + (slot % 3) * 24 : MID + HALF + 22 + (slot % 3) * 24;
            return (
              <g key={p.id}>
                <line className="cr-pin" x1={px} x2={px} y1={edge} y2={above ? ty + 14 : ty - 11} strokeDasharray={p.pending ? "2 2" : undefined} />
                <circle className="cr-dot" cx={px} cy={edge} r={2.5} />
                <text className="cr-lbl" x={px + 4} y={above ? ty : ty}>{p.label}{p.pending ? " ?" : ""}</text>
                <text className="cr-amt" x={px + 4} y={above ? ty + 12 : ty + 12}>{p.amount > 0 ? "+" : "−"}{fmt(p.amount)}</text>
              </g>
            );
          })}
          {Array.from({ length: days }, (_, i) => (i + 1) % 5 === 1 || i + 1 === days ? (
            <text key={i} className="cr-day" x={x(i)} y={H - 2} textAnchor="middle">{i + 1}</text>
          ) : null)}
        </svg>
        {scenario && (
          <aside className="cr-side" aria-label="Хэрэв… горим">
            <small style={{ font: "500 10.5px/1.4 var(--ts-font-mono)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ts-faint)" }}>Хэрэв…</small>
            {scenario.map((t) => (
              <button key={t.id} type="button" className="cr-tog" aria-pressed={!!on[t.id]} onClick={() => setOn((o) => ({ ...o, [t.id]: !o[t.id] }))}>
                <span>{t.label}<small>{t.detail ?? `${t.day}-нд · ${t.amount > 0 ? "+" : "−"}${fmt(t.amount)} ${unit}`}</small></span>
                <i aria-hidden="true" />
              </button>
            ))}
            <div className="cr-out" aria-live="polite">
              <span>Хамгийн бага үлдэгдэл: <b className={vals[minIdx] < floor ? "is-bad" : undefined}>{fmt(vals[minIdx])} {unit}</b> ({minIdx + 1}-нд)</span>
              <span>Аюултай өдөр: <b className={dangerDays ? "is-bad" : undefined}>{baseDanger} → {dangerDays}</b></span>
            </div>
            {suggestion && <p className="cr-agent"><small>Агентын санал</small>{suggestion}</p>}
          </aside>
        )}
      </div>
    </section>
  );
}

export const cashRiverDemo: CashRiverProps = {
  opening: 1385,
  today: 7,
  floor: 900,
  events: [
    { id: "dom", day: 1, label: "Домэйн ба хэрэгсэл", amount: -40 },
    { id: "c3", day: 5, label: "Харилцагч №3", amount: 420 },
    { id: "pay", day: 10, label: "Цалин", amount: -285 },
    { id: "inv4", day: 12, label: "Нэхэмжлэх №4", amount: 310 },
    { id: "fuel", day: 15, label: "Түлш", amount: -312 },
    { id: "rep", day: 20, label: "Их засвар", amount: -96, pending: true },
    { id: "way", day: 22, label: "Нэхэмжлэх · Way", amount: 260 },
    { id: "rent", day: 25, label: "Агуулахын түрээс", amount: -60 },
    { id: "lease", day: 24, label: "Лизинг", amount: -380 },
    { id: "big", day: 26, label: "Гэрээт тээвэр", amount: 250 },
  ],
  scenario: [
    { id: "truck", label: "Шинэ машины урьдчилгаа", day: 23, amount: -420, on: true },
    { id: "store", label: "Хоёр дахь агуулахын барьцаа", day: 28, amount: -90 },
  ],
  suggestion: "Урьдчилгааг 26-нд гэрээт тээврийн орлого орсны дараа, 27-нд төлбөл үлдэгдэл аюулгүйн хязгаараас дээш үлдэнэ.",
};

export default CashRiver;
