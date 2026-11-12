"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type BreakdownRecord = Record<string, string | number>;
export type Dimension = {
  key: string;
  label: string;
  values: string[];
  colors?: Record<string, string>;
  icons?: Record<string, React.ReactNode>;
};
export type Measure = { key: string; label: string; unit?: string; field?: string };

export type BreakdownChartProps = {
  records?: BreakdownRecord[];
  dimensions?: Dimension[];
  measures?: Measure[];
  title?: string;
  defaultMeasure?: string;
  defaultSlice?: string;
  defaultSegment?: string;
  className?: string;
};

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const statusIcons: Record<string, React.ReactNode> = {
  "Нөөцөд": <svg viewBox="0 0 16 16" {...stroke}><path d="M2.5 9.5 4 4h8l1.5 5.5V12a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1Z M2.5 9.5h3.2l.8 1.2h3l.8-1.2h3.2" /></svg>,
  "Хийх": <svg viewBox="0 0 16 16" {...stroke}><rect x="2.8" y="2.8" width="10.4" height="10.4" rx="2" /></svg>,
  "Хийгдэж байна": <svg viewBox="0 0 16 16" {...stroke} style={{ color: "#4f8ef7" }}><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.3" /></svg>,
  "Хянагдаж байна": <svg viewBox="0 0 16 16" {...stroke} style={{ color: "#5b5bd6" }}><path d="M1.8 8S4 3.8 8 3.8 14.2 8 14.2 8 12 12.2 8 12.2 1.8 8 1.8 8Z" /><circle cx="8" cy="8" r="1.8" /></svg>,
  "Дууссан": <svg viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="11" height="11" rx="2.2" fill="#2f7cf6" /><path d="m5.3 8.2 1.8 1.8 3.6-3.8" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  "Цуцалсан": <svg viewBox="0 0 16 16" {...stroke}><circle cx="8" cy="8" r="5.5" /><path d="m4.2 11.8 7.6-7.6" /></svg>,
};

const statuses = ["Нөөцөд", "Хийх", "Хийгдэж байна", "Хянагдаж байна", "Дууссан", "Цуцалсан"];
const priorities = ["Яаралтай", "Өндөр", "Дунд", "Бага", "Тодорхойгүй"];
const matrix = [
  [3, 6, 6, 8, 3],
  [1, 7, 12, 11, 5],
  [1, 9, 12, 7, 5],
  [0, 1, 6, 4, 2],
  [7, 14, 23, 25, 27],
  [0, 1, 3, 1, 2],
];
const people = ["Анар", "Бат", "Чимэг", "Дулам"];
const types = ["Шинэ боломж", "Алдаа", "Ажил"];

const defaultRecords: BreakdownRecord[] = (() => {
  const out: BreakdownRecord[] = [];
  let n = 0;
  matrix.forEach((row, si) =>
    row.forEach((c, pi) => {
      for (let i = 0; i < c; i++, n++)
        out.push({ status: statuses[si], priority: priorities[pi], assignee: people[n % 4], type: types[(n * 7) % 3], points: [1, 2, 3, 5, 8][(n * 3) % 5] });
    }),
  );
  return out;
})();

const defaultDimensions: Dimension[] = [
  { key: "status", label: "Төлөв", values: statuses, icons: statusIcons },
  { key: "priority", label: "Ач холбогдол", values: priorities, colors: { "Яаралтай": "#e5484d", "Өндөр": "#e8a20c", "Дунд": "#3b82f6", "Бага": "#a9c8f5", "Тодорхойгүй": "#d9d9de" } },
  { key: "assignee", label: "Хариуцагч", values: people },
  { key: "type", label: "Төрөл", values: types },
];

const defaultMeasures: Measure[] = [
  { key: "count", label: "Даалгаврын тоо", unit: "даалгавар" },
  { key: "points", label: "Оноо", unit: "оноо", field: "points" },
];

const palette = ["#3b82f6", "#e8a20c", "#16a34a", "#a855f7", "#e5484d", "#14b8a6"];

function Picker({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  const id = React.useId();
  return (
    <label className="bc-pick" htmlFor={id}>
      <span>{label}</span>
      <span className="bc-sel">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      </span>
    </label>
  );
}

export function BreakdownChart({
  records = defaultRecords,
  dimensions = defaultDimensions,
  measures = defaultMeasures,
  title = "Спринт 24",
  defaultMeasure,
  defaultSlice,
  defaultSegment,
  className = "",
}: BreakdownChartProps) {
  const [mKey, setM] = React.useState(defaultMeasure ?? measures[0]?.key);
  const [sKey, setS] = React.useState(defaultSlice ?? dimensions[0]?.key);
  const [gKey, setG] = React.useState(defaultSegment ?? dimensions[1]?.key ?? "none");
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  const [hot, setHot] = React.useState<string | null>(null);

  const measure = measures.find((m) => m.key === mKey) ?? measures[0];
  const slice = dimensions.find((d) => d.key === sKey) ?? dimensions[0];
  const seg = dimensions.find((d) => d.key === gKey && d.key !== slice.key);
  const segValues = seg ? seg.values : ["Бүгд"];
  const colorOf = (v: string, i: number) => seg?.colors?.[v] ?? (seg ? palette[i % palette.length] : "#3b82f6");
  const val = (r: BreakdownRecord) => (measure.field ? Number(r[measure.field]) || 0 : 1);

  const table = slice.values.map((sv) => {
    const rs = records.filter((r) => String(r[slice.key]) === sv);
    const parts = segValues.map((gv) => rs.filter((r) => !seg || String(r[seg.key]) === gv).reduce((n, r) => n + val(r), 0));
    return { key: sv, parts, total: parts.reduce((a, b) => a + b, 0) };
  });
  const grand = table.reduce((n, r) => n + r.total, 0);
  const visTotal = (r: (typeof table)[0]) => r.parts.reduce((n, p, i) => n + (hidden.has(segValues[i]) ? 0 : p), 0);
  const peak = Math.max(1, ...table.map(visTotal));
  const step = Math.max(5, Math.ceil(peak / 5 / 5) * 5);
  const top = step * 5;
  const ticks = [5, 4, 3, 2, 1, 0].map((i) => i * step);

  const toggle = (v: string) =>
    setHidden((s) => {
      const n = new Set(s);
      if (n.has(v)) n.delete(v);
      else n.add(v);
      return n;
    });

  const segOpts = [{ value: "none", label: "Үгүй" }, ...dimensions.filter((d) => d.key !== slice.key).map((d) => ({ value: d.key, label: d.label }))];

  return (
    <section className={`bc ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="bc-head">
        <h3>{title}</h3>
        <span className="bc-total"><b>{grand}</b> {measure.unit ?? ""}</span>
      </header>
      <div className="bc-picks">
        <Picker label="Хэмжүүр" value={measure.key} options={measures.map((m) => ({ value: m.key, label: m.label }))} onChange={setM} />
        <Picker label="Ангилал" value={slice.key} options={dimensions.map((d) => ({ value: d.key, label: d.label }))} onChange={(v) => { setS(v); if (v === gKey) setG("none"); }} />
        <Picker label="Хэсэглэх" value={seg ? seg.key : "none"} options={segOpts} onChange={setG} />
      </div>
      <div className="bc-plot">
        <div className="bc-area">
          {ticks.map((t) => <span key={t} className="bc-grid" style={{ bottom: `${(t / top) * 100}%` }} />)}
          <div className="bc-bars">
            {table.map((r) => {
              const t = visTotal(r);
              return (
                <div key={r.key} className="bc-col">
                  <button
                    type="button"
                    className="bc-bar"
                    aria-label={`${r.key}: ${t} ${measure.unit ?? ""}`}
                    onMouseEnter={() => setHot(r.key)}
                    onMouseLeave={() => setHot(null)}
                    onFocus={() => setHot(r.key)}
                    onBlur={() => setHot(null)}
                    style={{ height: `${(t / top) * 100}%` }}
                  >
                    {r.parts.map((p, i) =>
                      hidden.has(segValues[i]) || p === 0 ? null : (
                        <span key={i} style={{ flexGrow: p, background: colorOf(segValues[i], i) }} />
                      ),
                    )}
                  </button>
                  {hot === r.key && (
                    <div className="bc-tip" role="tooltip">
                      <strong>{r.key}<b>{t}</b></strong>
                      {seg && r.parts.map((p, i) => hidden.has(segValues[i]) ? null : (
                        <span key={i}><i style={{ background: colorOf(segValues[i], i) }} />{segValues[i]}<b>{p}</b></span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bc-y">{ticks.map((t) => <span key={t} style={{ bottom: `${(t / top) * 100}%` }}>{t}</span>)}</div>
        <div className="bc-x">
          {table.map((r) => (
            <span key={r.key} title={r.key} className={hot === r.key ? "is-hot" : ""}>
              {slice.icons?.[r.key] ?? <em>{r.key}</em>}
            </span>
          ))}
        </div>
      </div>
      <div className="bc-table-wrap">
        <table className="bc-table">
          <thead>
            <tr>
              <th>{slice.label}</th>
              <th className="num">{measure.label}</th>
              {seg && segValues.map((v, i) => <th key={v} className="num"><i style={{ background: colorOf(v, i) }} />{v}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.map((r) => (
              <tr key={r.key} className={hot === r.key ? "is-hot" : ""} onMouseEnter={() => setHot(r.key)} onMouseLeave={() => setHot(null)}>
                <td><span className="bc-name">{slice.icons?.[r.key] && <span className="bc-ico">{slice.icons[r.key]}</span>}{r.key}</span></td>
                <td className="num">{r.total}</td>
                {seg && r.parts.map((p, i) => <td key={i} className="num">{p}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {seg && (
        <div className="bc-legend">
          {segValues.map((v, i) => (
            <button key={v} type="button" aria-pressed={!hidden.has(v)} onClick={() => toggle(v)}>
              <i style={{ background: colorOf(v, i) }} />{v}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

const css = `
.bc{--bc-bg:#fff;--bc-fg:#18181b;--bc-muted:#65656d;--bc-faint:#65656d;--bc-line:#ececef;--bc-soft:#f4f4f5;--bc-accent:#3b82f6;width:100%;max-width:560px;background:var(--bc-bg);color:var(--bc-fg);border:1px solid var(--bc-line);border-radius:10px;box-shadow:0 1px 2px #0000000a;font:400 13px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .bc{--bc-bg:#1b1b1e;--bc-fg:#ececef;--bc-muted:#a1a1aa;--bc-faint:#9a9aa2;--bc-line:#2e2e33;--bc-soft:#26262b;color-scheme:dark}
.bc *{box-sizing:border-box}.bc button{font:inherit;color:inherit;cursor:pointer}
.bc-head{display:flex;justify-content:space-between;align-items:baseline;padding:16px 16px 10px}
.bc h3{margin:0;font-size:15px;font-weight:500}
.bc-total{color:var(--bc-muted);font-size:12px}.bc-total b{color:var(--bc-fg);font-size:15px;font-weight:500;margin-right:2px}
.bc-picks{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 16px}
.bc-pick{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--bc-muted)}
.bc-sel{position:relative;display:block}
.bc-sel select{appearance:none;-webkit-appearance:none;width:100%;height:30px;padding:0 28px 0 10px;border:1px solid var(--bc-line);border-radius:6px;background:var(--bc-bg);color:var(--bc-fg);font:inherit;font-size:13.5px;cursor:pointer;box-shadow:0 1px 1px #00000008}
.bc-sel select:hover{border-color:color-mix(in srgb,var(--bc-fg) 20%,transparent)}
.bc-sel svg{position:absolute;right:8px;top:8px;width:14px;height:14px;pointer-events:none;color:var(--bc-muted)}
.bc-plot{display:grid;grid-template-columns:1fr 44px;grid-template-rows:196px auto;padding:20px 0 0 16px}
.bc-area{position:relative;border-bottom:1px solid var(--bc-line)}
.bc-grid{position:absolute;left:0;right:0;border-top:1px solid var(--bc-line)}
.bc-bars{position:absolute;inset:0;display:flex}
.bc-col{position:relative;flex:1;display:flex;justify-content:center;align-items:flex-end;height:100%}
.bc-bar{display:flex;flex-direction:column-reverse;width:12px;padding:0;border:0;background:none;gap:1px;transition:height .35s cubic-bezier(.2,.8,.2,1),opacity .15s}
.bc-bar span{display:block;min-height:1px;transition:flex-grow .35s}
.bc-bar span:last-child{border-radius:2px 2px 0 0}
.bc-bars:hover .bc-bar:not(:hover){opacity:.55}
.bc-y{position:relative}.bc-y span{position:absolute;right:16px;transform:translateY(50%);font-size:10.5px;color:var(--bc-muted)}
.bc-x{display:flex;padding:8px 0 12px}.bc-x span{flex:1;display:flex;justify-content:center;color:var(--bc-faint)}.bc-x svg{width:13px;height:13px}.bc-x em{font-style:normal;font-size:11px;color:var(--bc-muted)}.bc-x .is-hot{color:var(--bc-fg)}
.bc-tip{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);z-index:3;min-width:140px;padding:8px 10px;border:1px solid var(--bc-line);border-radius:8px;background:var(--bc-bg);box-shadow:0 6px 20px #0000001a;font-size:12px;display:flex;flex-direction:column;gap:3px;pointer-events:none;bottom:auto;top:0}
.bc-tip strong{display:flex;justify-content:space-between;gap:12px;font-weight:500;margin-bottom:2px}
.bc-tip span{display:flex;align-items:center;gap:6px;color:var(--bc-muted)}.bc-tip b{margin-left:auto;color:var(--bc-fg);font-weight:500}
.bc i{display:inline-block;width:7px;height:7px;border-radius:2px;flex:none}
.bc-table-wrap{overflow-x:auto;border-top:1px solid var(--bc-line)}
.bc-table{width:100%;border-collapse:collapse;font-size:13.5px}
.bc-table th{height:32px;padding:0 16px 0 0;font-size:10.5px;font-weight:400;letter-spacing:.06em;text-transform:uppercase;color:var(--bc-muted);text-align:left;border-bottom:1px solid var(--bc-line);white-space:nowrap}
.bc-table th:first-child,.bc-table td:first-child{padding-left:16px}
.bc-table th i{margin-right:6px}
.bc-table td{height:36px;padding:0 16px 0 0;border-bottom:1px solid var(--bc-line);font-variant-numeric:tabular-nums}
.bc-table .num{text-align:right}
.bc-table tr.is-hot td{background:var(--bc-soft)}
.bc-name{display:flex;align-items:center;gap:10px}.bc-ico{display:grid;place-items:center;color:var(--bc-faint)}.bc-ico svg{width:14px;height:14px}
.bc-legend{display:flex;flex-wrap:wrap;gap:14px;padding:12px 16px 14px}
.bc-legend button{display:flex;align-items:center;gap:6px;border:0;background:none;padding:0;font-size:12.5px;color:var(--bc-muted)}
.bc-legend button[aria-pressed=false]{opacity:.4}.bc-legend button:hover{color:var(--bc-fg)}
.bc :focus-visible{outline:2px solid var(--bc-accent);outline-offset:2px}
@media(max-width:560px){.bc-picks{grid-template-columns:1fr}.bc-table{font-size:12.5px}}
@media(prefers-reduced-motion:reduce){.bc *{transition:none!important}}
.bc-col{animation:bccolrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.bc-col:nth-child(1){animation-delay:0ms}.bc-col:nth-child(2){animation-delay:70ms}.bc-col:nth-child(3){animation-delay:140ms}.bc-col:nth-child(4){animation-delay:210ms}.bc-col:nth-child(5){animation-delay:280ms}.bc-col:nth-child(6){animation-delay:350ms}.bc-col:nth-child(7){animation-delay:420ms}.bc-col:nth-child(8){animation-delay:490ms}.bc-col:nth-child(9){animation-delay:560ms}.bc-col:nth-child(10){animation-delay:630ms}.bc-col:nth-child(11){animation-delay:700ms}.bc-col:nth-child(12){animation-delay:770ms}@keyframes bccolrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.bc-col{animation:none}}
`;

export default BreakdownChart;
