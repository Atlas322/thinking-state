"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type Repeat = "once" | "monthly" | "quarterly" | "yearly";

export type CatalogItem = { name: string; repeat: Repeat; price: number };

export type ScheduleLine =
  | { id: string; kind: "product"; name: string; repeat: Repeat; price: number; timing?: "advance" | "arrears" }
  | { id: string; kind: "discount"; percent: number }
  | { id: string; kind: "minimum"; amount: number };

export type BillingScheduleValue = { phase: string; start: string; duration: string; lines: ScheduleLine[] };

export type BillingScheduleProps = {
  title?: string;
  phase?: string;
  currency?: string;
  catalog?: CatalogItem[];
  defaultLines?: ScheduleLine[];
  defaultStart?: string;
  onChange?: (schedule: BillingScheduleValue) => void;
  className?: string;
};

const durations: { label: string; months: number }[] = [
  { label: "Нэг удаагийн", months: 0 },
  { label: "1 сар", months: 1 },
  { label: "3 сар", months: 3 },
  { label: "6 сар", months: 6 },
  { label: "12 сар", months: 12 },
];
const repeatMonths: Record<Repeat, number> = { once: 0, monthly: 1, quarterly: 3, yearly: 12 };
const repeatLabel: Record<Repeat, string> = { once: "Нэг удаа", monthly: "Сар бүр", quarterly: "Улирал бүр", yearly: "Жил бүр" };
const per: Record<Repeat, string> = { once: "нэг удаа", monthly: "сар", quarterly: "улирал", yearly: "жил" };

const defaultCatalog: CatalogItem[] = [
  { name: "Платформын лиценз", repeat: "monthly", price: 1200 },
  { name: "Нэмэлт дэмжлэг", repeat: "monthly", price: 450 },
  { name: "Танилцуулах сургалт", repeat: "once", price: 2500 },
  { name: "Өгөгдлийг дотоодод хадгалах нэмэлт", repeat: "yearly", price: 6000 },
];

let uid = 0;
const nid = () => `l${++uid}`;

const fmtDate = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};
const addMonths = (iso: string, m: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setMonth(d.getMonth() + m);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const Ico = {
  cal: <svg viewBox="0 0 16 16"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  chev: <svg viewBox="0 0 16 16"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  arrow: <svg viewBox="0 0 16 16"><path d="M3 8h9.5M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  repeat: <svg viewBox="0 0 16 16"><path d="M3 7V6a2 2 0 0 1 2-2h8m-2-2 2 2-2 2M13 9v1a2 2 0 0 1-2 2H3m2 2-2-2 2-2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  plus: <svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  pct: <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.1" /><path d="m5.8 10.2 4.4-4.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /><circle cx="6" cy="6.2" r=".8" fill="currentColor" /><circle cx="10" cy="9.8" r=".8" fill="currentColor" /></svg>,
  min: <svg viewBox="0 0 16 16"><path d="M8 2.5v6M5.5 6 8 8.5 10.5 6M3 11h10M4.5 13.5h7" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  x: <svg viewBox="0 0 16 16"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
};

export function BillingSchedule({
  title = "Төлбөрийн хуваарь үүсгэх",
  phase: phaseProp = "Нэвтрүүлэх үе шат",
  currency = "$",
  catalog = defaultCatalog,
  defaultLines,
  defaultStart = "2026-01-01",
  onChange,
  className = "",
}: BillingScheduleProps) {
  const [phase, setPhase] = React.useState(phaseProp);
  const [start, setStart] = React.useState(defaultStart);
  const [duration, setDuration] = React.useState("Нэг удаагийн");
  const [lines, setLines] = React.useState<ScheduleLine[]>(
    () => defaultLines ?? [{ id: nid(), kind: "product", name: "Суурилуулалт", repeat: "once", price: 4999, timing: "advance" }],
  );
  const [menu, setMenu] = React.useState<null | "duration" | "catalog">(null);
  const rootRef = React.useRef<HTMLElement>(null);

  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onChange?.({ phase, start, duration, lines });
  }, [phase, start, duration, lines, onChange]);

  React.useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".bs-menu-wrap")) setMenu(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const months = durations.find((d) => d.label === duration)?.months ?? 0;
  const money = (n: number) =>
    `${currency}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const products = lines.filter((l): l is Extract<ScheduleLine, { kind: "product" }> => l.kind === "product");
  const discount = lines.find((l) => l.kind === "discount") as Extract<ScheduleLine, { kind: "discount" }> | undefined;
  const minimum = lines.find((l) => l.kind === "minimum") as Extract<ScheduleLine, { kind: "minimum" }> | undefined;
  const factor = 1 - (discount?.percent ?? 0) / 100;
  const occurrences = (r: Repeat) => (r === "once" || months === 0 ? 1 : Math.max(1, Math.ceil(months / repeatMonths[r])));
  const firstInvoice = products.filter((p) => (p.timing ?? "advance") === "advance").reduce((n, p) => n + p.price, 0) * factor;
  const subtotal = products.reduce((n, p) => n + p.price * occurrences(p.repeat), 0) * factor;
  const total = Math.max(subtotal, minimum?.amount ?? 0);

  const update = (id: string, patch: Partial<ScheduleLine>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? ({ ...l, ...patch } as ScheduleLine) : l)));
  const remove = (id: string) => setLines((ls) => ls.filter((l) => l.id !== id));

  return (
    <section ref={rootRef} className={`bs ${className}`}>
      <style>{css}</style>
      <header className="bs-head">
        <h3>{title}</h3>
        <p className="bs-sum">
          <input className="bs-phase" aria-label="Үе шатын нэр" value={phase} size={Math.max(1, phase.length - 1)} onChange={(e) => setPhase(e.target.value)} />
          <span className="bs-dot">·</span>
          <span>{fmtDate(start)}</span>
          {Ico.arrow}
          <span key={duration + start} className="bs-end">
            {months ? fmtDate(addMonths(start, months)) : "Нэг удаагийн"}
          </span>
        </p>
      </header>

      <div className="bs-fields">
        <label className="bs-field">
          <span>Эхлэх огноо</span>
          <span className="bs-input">
            <input type="date" value={start} onChange={(e) => e.target.value && setStart(e.target.value)} aria-label="Эхлэх огноо" />
            <span className="bs-show">{start.replace(/-/g, ".")}</span>
            {Ico.cal}
          </span>
        </label>
        <div className="bs-field bs-menu-wrap">
          <span id="bs-dur">Хугацаа</span>
          <button
            type="button"
            className="bs-input bs-select"
            aria-haspopup="listbox"
            aria-expanded={menu === "duration"}
            aria-labelledby="bs-dur"
            onClick={() => setMenu(menu === "duration" ? null : "duration")}
          >
            <span>{duration}</span>
            {Ico.chev}
          </button>
          {menu === "duration" && (
            <ul className="bs-menu" role="listbox" aria-label="Хугацаа">
              {durations.map((d) => (
                <li
                  key={d.label}
                  role="option"
                  aria-selected={d.label === duration}
                  tabIndex={0}
                  onClick={() => {
                    setDuration(d.label);
                    setMenu(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setDuration(d.label);
                      setMenu(null);
                    }
                  }}
                >
                  {d.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bs-scroll">
      <table className="bs-table">
        <thead>
          <tr>
            <th>Нэр</th>
            <th>Давтамж</th>
            <th className="bs-r">Үнэ</th>
            <th aria-label="Хасах" />
          </tr>
        </thead>
        <tbody>
          {lines.map((l) =>
            l.kind === "product" ? (
              <tr key={l.id}>
                <td className="bs-name">{l.name}</td>
                <td>
                  <span className="bs-rep">
                    {Ico.repeat}
                    <select aria-label={`${l.name}: давтамж`} value={l.repeat} onChange={(e) => update(l.id, { repeat: e.target.value as Repeat })}>
                      {(Object.keys(repeatLabel) as Repeat[]).map((r) => (
                        <option key={r} value={r}>
                          {repeatLabel[r]}
                        </option>
                      ))}
                    </select>
                  </span>
                </td>
                <td className="bs-r">
                  <span className="bs-price">
                    <span className="bs-cur">{currency}</span>
                    <input
                      aria-label={`${l.name}: үнэ`}
                      inputMode="decimal"
                      value={l.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      size={Math.max(1, l.price.toLocaleString("en-US", { minimumFractionDigits: 2 }).length - 1)}
                      onChange={(e) => {
                        const n = Number(e.target.value.replace(/[^0-9.]/g, ""));
                        if (!Number.isNaN(n)) update(l.id, { price: n });
                      }}
                    />
                    <span className="bs-per">/ {per[l.repeat]}</span>
                  </span>
                  <select
                    className="bs-timing"
                    aria-label={`${l.name}: нэхэмжлэх хугацаа`}
                    value={l.timing ?? "advance"}
                    onChange={(e) => update(l.id, { timing: e.target.value as "advance" | "arrears" })}
                  >
                    <option value="advance">Урьдчилж нэхэмжилнэ</option>
                    <option value="arrears">Дараа нь нэхэмжилнэ</option>
                  </select>
                </td>
                <td className="bs-x">
                  <button type="button" aria-label={`Хасах: ${l.name}`} onClick={() => remove(l.id)}>
                    {Ico.x}
                  </button>
                </td>
              </tr>
            ) : l.kind === "discount" ? (
              <tr key={l.id}>
                <td className="bs-name">Хөнгөлөлт</td>
                <td className="bs-muted">Бүх бүтээгдэхүүн</td>
                <td className="bs-r">
                  <span className="bs-price">
                    <input aria-label="Хөнгөлөлтийн хувь" inputMode="decimal" value={l.percent} size={3} onChange={(e) => update(l.id, { percent: Math.min(100, Number(e.target.value.replace(/\D/g, "")) || 0) })} />
                    <span className="bs-per">% хөнгөлөлт</span>
                  </span>
                </td>
                <td className="bs-x">
                  <button type="button" aria-label="Хөнгөлөлт хасах" onClick={() => remove(l.id)}>{Ico.x}</button>
                </td>
              </tr>
            ) : (
              <tr key={l.id}>
                <td className="bs-name">Доод хэмжээ</td>
                <td className="bs-muted">Бүх үе шат</td>
                <td className="bs-r">
                  <span className="bs-price">
                    <span className="bs-cur">{currency}</span>
                    <input aria-label="Доод дүн" inputMode="decimal" value={l.amount} size={7} onChange={(e) => update(l.id, { amount: Number(e.target.value.replace(/[^0-9.]/g, "")) || 0 })} />
                  </span>
                </td>
                <td className="bs-x">
                  <button type="button" aria-label="Доод хэмжээ хасах" onClick={() => remove(l.id)}>{Ico.x}</button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      </div>

      <div className="bs-actions">
        <div className="bs-menu-wrap">
          <button type="button" className="bs-btn" aria-haspopup="listbox" aria-expanded={menu === "catalog"} onClick={() => setMenu(menu === "catalog" ? null : "catalog")}>
            {Ico.plus}
            Бүтээгдэхүүн нэмэх
          </button>
          {menu === "catalog" && (
            <ul className="bs-menu bs-up" role="listbox" aria-label="Бүтээгдэхүүн">
              {catalog.map((c) => (
                <li
                  key={c.name}
                  role="option"
                  aria-selected={false}
                  tabIndex={0}
                  onClick={() => {
                    setLines((ls) => [...ls, { id: nid(), kind: "product", name: c.name, repeat: c.repeat, price: c.price, timing: "advance" }]);
                    setMenu(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLElement).click()}
                >
                  <span>{c.name}</span>
                  <span className="bs-muted">
                    {money(c.price)} / {per[c.repeat]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="bs-grow" />
        <button type="button" className="bs-btn" disabled={!!discount} onClick={() => setLines((ls) => [...ls, { id: nid(), kind: "discount", percent: 10 }])}>
          {Ico.pct}
          Хөнгөлөлт нэмэх
        </button>
        <button type="button" className="bs-btn" disabled={!!minimum} onClick={() => setLines((ls) => [...ls, { id: nid(), kind: "minimum", amount: 10000 }])}>
          {Ico.min}
          Доод хэмжээ нэмэх
        </button>
      </div>

      <footer className="bs-foot" aria-live="polite">
        <span>
          Эхний нэхэмжлэх <b>{money(firstInvoice)}</b>
        </span>
        <span>
          Үе шатын нийт <b>{money(total)}</b>
        </span>
      </footer>
    </section>
  );
}

const css = `
.bs{--bs-bg:#fff;--bs-fg:#18181b;--bs-muted:#65656d;--bs-faint:#65656d;--bs-line:#ececef;--bs-soft:#f7f7f8;--bs-accent:#3b82f6;width:100%;max-width:604px;background:var(--bs-bg);color:var(--bs-fg);border:1px solid var(--bs-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .bs{--bs-bg:#1b1b1e;--bs-fg:#ececef;--bs-muted:#a1a1aa;--bs-faint:#9a9aa2;--bs-line:#2c2c31;--bs-soft:#232328;--bs-accent:#7aa2ff;color-scheme:dark}
.bs *{box-sizing:border-box}.bs button,.bs input,.bs select{font:inherit;color:inherit}
.bs-head{padding:17px 15px 0}
.bs-head h3{margin:0;font-size:16px;font-weight:500;letter-spacing:-.01em}
.bs-sum{display:flex;align-items:center;gap:7px;margin:5px 0 0;color:var(--bs-muted)}
.bs-sum svg{width:13px;height:13px;color:var(--bs-faint)}
.bs-phase{border:0;background:none;padding:0;font-weight:500;color:var(--bs-fg)!important;min-width:0;border-radius:4px}
.bs-phase:hover{background:var(--bs-soft)}
.bs-dot{color:var(--bs-faint);margin:0 1px 0 4px}.bs-end{animation:bs-fade .3s both}
.bs-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 15px 15px;border-bottom:1px solid var(--bs-line)}
.bs-field{position:relative;display:flex;flex-direction:column;gap:7px;font-size:13px;color:var(--bs-muted)}
.bs-input{position:relative;display:flex;align-items:center;justify-content:space-between;height:36px;padding:0 11px;border:1px solid var(--bs-line);border-radius:7px;background:var(--bs-bg);box-shadow:0 1px 2px #00000008;font-size:14px;color:var(--bs-fg);letter-spacing:.02em}
.bs-input svg{width:15px;height:15px;color:var(--bs-muted)}
.bs-input input[type=date]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}
.bs-select{cursor:pointer;text-align:left;letter-spacing:0;color:var(--bs-fg)!important}.bs-select:hover{border-color:color-mix(in srgb,var(--bs-fg) 20%,transparent)}
.bs-menu{position:absolute;z-index:5;top:calc(100% + 4px);left:0;right:0;margin:0;padding:4px;list-style:none;background:var(--bs-bg);border:1px solid var(--bs-line);border-radius:9px;box-shadow:0 8px 24px #0000001a;animation:bs-pop .16s both;transform-origin:top}
.bs-menu li{display:flex;justify-content:space-between;gap:12px;padding:7px 9px;border-radius:6px;color:var(--bs-fg);font-size:14px;cursor:pointer}
.bs-menu li:hover,.bs-menu li:focus-visible,.bs-menu li[aria-selected=true]{background:var(--bs-soft);outline:0}
.bs-up{top:calc(100% + 4px);right:auto;min-width:300px}
.bs-table{width:100%;border-collapse:collapse}
.bs-table th{padding:11px 15px 10px;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--bs-muted);text-align:left;border-bottom:1px solid var(--bs-line)}
.bs-table th:last-child,.bs-x{width:32px;padding:0 8px 0 0}
.bs-table td{padding:14px 15px 13px;border-bottom:1px solid var(--bs-line);vertical-align:middle}
.bs-table tbody tr{animation:bs-in .3s both}
.bs-r{text-align:right!important}
.bs-name{font-weight:500}.bs-muted{color:var(--bs-muted)}
.bs-rep{display:inline-flex;align-items:center;gap:10px;position:relative}.bs-rep svg{width:16px;height:16px;color:var(--bs-muted)}
.bs-rep select{appearance:none;border:0;background:none;padding:2px 0;cursor:pointer}
.bs-price{display:inline-flex;align-items:baseline;gap:0;font-variant-numeric:tabular-nums}
.bs-price input{border:0;background:none;text-align:right;padding:0;width:auto;font-variant-numeric:tabular-nums;font-size:14px;border-radius:4px}
.bs-price input:hover{background:var(--bs-soft)}
.bs-per{margin-left:6px;font-size:13px;color:var(--bs-muted)}
.bs-timing{display:block;margin:5px 0 0 auto;appearance:none;border:0;background:none;font-size:13px!important;color:var(--bs-muted)!important;text-align:right;cursor:pointer;padding:0}
.bs-x button{display:grid;place-items:center;width:24px;height:24px;border:0;border-radius:6px;background:none;color:var(--bs-faint);cursor:pointer;opacity:0;transition:opacity .15s}
.bs-x svg{width:13px;height:13px}.bs-table tr:hover .bs-x button,.bs-x button:focus-visible{opacity:1}.bs-x button:hover{background:var(--bs-soft);color:var(--bs-fg)}
.bs-actions{display:flex;align-items:center;gap:8px;padding:11px 15px;border-bottom:1px solid var(--bs-line)}
.bs-actions>.bs-menu-wrap{position:relative}.bs-grow{flex:1}
.bs-btn{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 11px;border:1px solid var(--bs-line);border-radius:7px;background:var(--bs-bg);box-shadow:0 1px 2px #00000008;font-weight:500;cursor:pointer;transition:background .15s}
.bs-btn svg{width:15px;height:15px;color:var(--bs-muted)}.bs-btn:hover{background:var(--bs-soft)}.bs-btn:disabled{opacity:.5;cursor:default}
.bs-foot{display:flex;justify-content:space-between;align-items:baseline;padding:13px 15px 15px;color:var(--bs-muted);font-size:13px}
.bs-foot b{margin-left:6px;font-size:17px;font-weight:500;color:var(--bs-fg);font-variant-numeric:tabular-nums}
.bs :focus-visible{outline:2px solid var(--bs-accent);outline-offset:2px}
@keyframes bs-in{from{opacity:0;transform:translateY(-4px)}}
@keyframes bs-pop{from{opacity:0;transform:scale(.97)}}
@keyframes bs-fade{from{opacity:0}}
@media(max-width:520px){.bs-fields{grid-template-columns:minmax(0,1fr)}.bs-table th:nth-child(2),.bs-table td:nth-child(2){display:none}.bs-actions{flex-wrap:wrap}.bs-grow{display:none}}
@media(prefers-reduced-motion:reduce){.bs *{animation:none!important;transition:none!important}}
.bs-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}.bs-table{min-width:300px}
`;

/** Catalog preview: amounts are plain units with no currency sign. */
export default function BillingSchedulePreview() {
  return <BillingSchedule currency="" />;
}
