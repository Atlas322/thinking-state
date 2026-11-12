"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type DateRange = { start: Date; end: Date };
export type CompareMode = "off" | "previous" | "year";
export type DateRangePreset = { id: string; label: string; range: (today: Date) => DateRange };

export type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange, compare: DateRange | null, mode: CompareMode) => void;
  presets?: DateRangePreset[];
  compare?: boolean;
  defaultCompare?: CompareMode;
  weekStartsOn?: 0 | 1;
  min?: Date;
  max?: Date;
  defaultOpen?: boolean;
  today?: Date;
  className?: string;
};

const DAY = 86_400_000;
const strip = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getTime() === b.getTime();
const diffDays = (a: Date, b: Date) => Math.round((strip(b).getTime() - strip(a).getTime()) / DAY);
const MONTHS = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
const WEEKDAYS_LONG = ["ням", "даваа", "мягмар", "лхагва", "пүрэв", "баасан", "бямба"];
const pad = (n: number) => String(n).padStart(2, "0");
const dayLabel = (d: Date) => `${d.getFullYear()} оны ${d.getMonth() + 1}-р сарын ${d.getDate()}, ${WEEKDAYS_LONG[d.getDay()]} гараг`;
const short = (d: Date) => `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
const fmtRange = (r: DateRange) =>
  r.start.getFullYear() === r.end.getFullYear()
    ? same(r.start, r.end)
      ? `${r.start.getFullYear()}.${short(r.start)}`
      : `${r.start.getFullYear()}.${short(r.start)} – ${short(r.end)}`
    : `${r.start.getFullYear()}.${short(r.start)} – ${r.end.getFullYear()}.${short(r.end)}`;

export const defaultPresets: DateRangePreset[] = [
  { id: "today", label: "Өнөөдөр", range: (t) => ({ start: t, end: t }) },
  { id: "yesterday", label: "Өчигдөр", range: (t) => ({ start: addDays(t, -1), end: addDays(t, -1) }) },
  { id: "7d", label: "Сүүлийн 7 хоног", range: (t) => ({ start: addDays(t, -6), end: t }) },
  { id: "30d", label: "Сүүлийн 30 хоног", range: (t) => ({ start: addDays(t, -29), end: t }) },
  { id: "90d", label: "Сүүлийн 90 хоног", range: (t) => ({ start: addDays(t, -89), end: t }) },
  { id: "month", label: "Энэ сар", range: (t) => ({ start: new Date(t.getFullYear(), t.getMonth(), 1), end: t }) },
  {
    id: "lastmonth",
    label: "Өнгөрсөн сар",
    range: (t) => ({ start: new Date(t.getFullYear(), t.getMonth() - 1, 1), end: new Date(t.getFullYear(), t.getMonth(), 0) }),
  },
  { id: "quarter", label: "Энэ улирал", range: (t) => ({ start: new Date(t.getFullYear(), Math.floor(t.getMonth() / 3) * 3, 1), end: t }) },
  { id: "ytd", label: "Оны эхнээс", range: (t) => ({ start: new Date(t.getFullYear(), 0, 1), end: t }) },
];

const compareRange = (r: DateRange, mode: CompareMode): DateRange | null => {
  if (mode === "off") return null;
  if (mode === "year")
    return {
      start: new Date(r.start.getFullYear() - 1, r.start.getMonth(), r.start.getDate()),
      end: new Date(r.end.getFullYear() - 1, r.end.getMonth(), r.end.getDate()),
    };
  const len = diffDays(r.start, r.end) + 1;
  return { start: addDays(r.start, -len), end: addDays(r.start, -1) };
};

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  presets = defaultPresets,
  compare = true,
  defaultCompare = "previous",
  weekStartsOn = 1,
  min,
  max,
  defaultOpen = false,
  today: todayProp,
  className = "",
}: DateRangePickerProps) {
  const today = React.useMemo(() => strip(todayProp ?? new Date()), [todayProp]);
  const maxDay = max ? strip(max) : today;
  const minDay = min ? strip(min) : undefined;
  const [inner, setInner] = React.useState<DateRange>(() => defaultValue ?? { start: addDays(today, -29), end: today });
  const applied = value ?? inner;
  const [mode, setMode] = React.useState<CompareMode>(defaultCompare);
  const [appliedMode, setAppliedMode] = React.useState<CompareMode>(defaultCompare);
  const [open, setOpen] = React.useState(defaultOpen);
  const [draft, setDraft] = React.useState<{ start: Date; end: Date | null }>(applied);
  const [hover, setHover] = React.useState<Date | null>(null);
  const [focusDay, setFocusDay] = React.useState<Date>(applied.end);
  const [view, setView] = React.useState(() => new Date(applied.end.getFullYear(), applied.end.getMonth() - 1, 1));
  const [dir, setDir] = React.useState(0);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  const openPanel = () => {
    setDraft(applied);
    setMode(appliedMode);
    setFocusDay(applied.end);
    setView(new Date(applied.end.getFullYear(), applied.end.getMonth() - 1, 1));
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    setHover(null);
    if (refocus) triggerRef.current?.focus();
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  });

  const disabled = (d: Date) => d > maxDay || (!!minDay && d < minDay);

  const pick = (d: Date) => {
    if (disabled(d)) return;
    if (draft.end) setDraft({ start: d, end: null });
    else setDraft(d < draft.start ? { start: d, end: draft.start } : { start: draft.start, end: d });
    setFocusDay(d);
  };

  const shown: DateRange = draft.end
    ? { start: draft.start, end: draft.end }
    : hover
      ? hover < draft.start
        ? { start: hover, end: draft.start }
        : { start: draft.start, end: hover }
      : { start: draft.start, end: draft.start };
  const previewing = !draft.end;
  const cmp = draft.end ? compareRange(shown, mode) : null;
  const activePreset = draft.end
    ? presets.find((p) => {
        const r = p.range(today);
        return same(strip(r.start), shown.start) && same(strip(r.end), shown.end);
      })?.id
    : undefined;

  const moveView = (n: number) => {
    setDir(n);
    setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));
  };

  const moveFocus = (d: Date) => {
    setFocusDay(d);
    const first = view;
    const lastOfSecond = new Date(view.getFullYear(), view.getMonth() + 2, 0);
    if (d < first) moveView(-1);
    else if (d > lastOfSecond) moveView(1);
  };

  React.useEffect(() => {
    if (!open) return;
    const el = panelRef.current?.querySelector<HTMLButtonElement>(`[data-day="${focusDay.getTime()}"]`);
    if (el && panelRef.current?.contains(document.activeElement) && document.activeElement?.hasAttribute("data-day")) el.focus();
  }, [focusDay, open, view]);

  const onGridKey = (e: React.KeyboardEvent) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusDay, -1),
      ArrowRight: () => addDays(focusDay, 1),
      ArrowUp: () => addDays(focusDay, -7),
      ArrowDown: () => addDays(focusDay, 7),
      PageUp: () => new Date(focusDay.getFullYear(), focusDay.getMonth() - 1, focusDay.getDate()),
      PageDown: () => new Date(focusDay.getFullYear(), focusDay.getMonth() + 1, focusDay.getDate()),
      Home: () => addDays(focusDay, -((focusDay.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(focusDay, 6 - ((focusDay.getDay() - weekStartsOn + 7) % 7)),
    };
    if (map[e.key]) {
      e.preventDefault();
      const d = map[e.key]();
      moveFocus(d);
      if (!draft.end) setHover(d);
    }
  };

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"][(i + weekStartsOn) % 7],
  );

  const inR = (d: Date, r: DateRange | null) => !!r && d >= r.start && d <= r.end;

  const renderMonth = (m: Date, side: "left" | "right") => {
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const lead = (first.getDay() - weekStartsOn + 7) % 7;
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(m.getFullYear(), m.getMonth(), i + 1))];
    while (cells.length % 7) cells.push(null);
    const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
    const labelId = `${id}-${m.getFullYear()}-${m.getMonth()}`;
    return (
      <div className="drp-month" key={`${m.getFullYear()}-${m.getMonth()}`} style={{ ["--drp-dir" as string]: dir }}>
        <div className="drp-mhead">
          {side === "left" ? (
            <button type="button" className="drp-nav" aria-label="Өмнөх сар" onClick={() => moveView(-1)}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 4-4 4 4 4" /></svg>
            </button>
          ) : (
            <span className="drp-nav-sp" />
          )}
          <span id={labelId} aria-live="polite">
            {m.getFullYear()} оны {MONTHS[m.getMonth()]}
          </span>
          {side === "right" ? (
            <button type="button" className="drp-nav" aria-label="Дараах сар" onClick={() => moveView(1)}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
            </button>
          ) : (
            <span className="drp-nav-sp" />
          )}
        </div>
        <table className="drp-grid" role="grid" aria-labelledby={labelId} onKeyDown={onGridKey}>
          <thead>
            <tr>
              {weekdays.map((w) => (
                <th key={w} scope="col" abbr={w}>{w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, wi) => (
              <tr key={wi}>
                {w.map((d, di) => {
                  if (!d) return <td key={di} />;
                  const inBand = inR(d, shown);
                  const isStart = same(d, shown.start);
                  const isEnd = same(d, shown.end);
                  const prev = w[di - 1];
                  const next = w[di + 1];
                  const bandL = inBand && (isStart || !prev || di === 0);
                  const bandR = inBand && (isEnd || !next || di === 6);
                  const inCmp = inR(d, cmp);
                  const cmpL = inCmp && (same(d, cmp!.start) || !prev || di === 0);
                  const cmpR = inCmp && (same(d, cmp!.end) || !next || di === 6);
                  const off = disabled(d);
                  const focus = same(d, focusDay);
                  return (
                    <td
                      key={di}
                      className={[
                        inBand && "band",
                        bandL && "bl",
                        bandR && "br",
                        previewing && "pv",
                        inCmp && !inBand && "cmp",
                        cmpL && "cl",
                        cmpR && "cr",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <button
                        type="button"
                        data-day={d.getTime()}
                        tabIndex={focus ? 0 : -1}
                        className={`drp-day ${isStart || isEnd ? "end" : ""} ${off ? "off" : ""}`}
                        aria-label={dayLabel(d)}
                        aria-selected={inBand}
                        aria-disabled={off || undefined}
                        aria-current={same(d, today) ? "date" : undefined}
                        onClick={() => pick(d)}
                        onMouseEnter={() => !draft.end && !off && setHover(d)}
                        onFocus={() => setFocusDay(d)}
                      >
                        {d.getDate()}
                        {same(d, today) && <i className="drp-today" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const second = new Date(view.getFullYear(), view.getMonth() + 1, 1);
  const days = diffDays(shown.start, shown.end) + 1;

  return (
    <div ref={rootRef} className={`drp ${className}`}>
      <style>{css}</style>
      <button
        ref={triggerRef}
        type="button"
        className="drp-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? close() : openPanel())}
      >
        <svg className="drp-cal" viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="3.5" width="11" height="10" rx="1.6" />
          <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
        </svg>
        {fmtRange(applied)}
        <svg className="drp-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="m5 6.5 3 3 3-3" /></svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="drp-panel"
          role="dialog"
          aria-label="Огнооны хүрээ сонгох"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            }
          }}
        >
          <div className="drp-main">
            <div className="drp-presets" role="tablist" aria-label="Бэлэн хүрээ">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={activePreset === p.id}
                  className={activePreset === p.id ? "on" : ""}
                  onClick={() => {
                    const r = p.range(today);
                    const next = { start: strip(r.start), end: strip(r.end) };
                    setDraft(next);
                    setFocusDay(next.end);
                    setView(new Date(next.end.getFullYear(), next.end.getMonth() - 1, 1));
                  }}
                >
                  {p.label}
                </button>
              ))}
              <span className={`drp-custom ${draft.end && !activePreset ? "on" : ""}`}>Өөрөө сонгох</span>
            </div>
            <div className="drp-months" onMouseLeave={() => setHover(null)}>
              {renderMonth(view, "left")}
              {renderMonth(second, "right")}
            </div>
          </div>
          <div className="drp-foot">
            <div className="drp-sum">
              <div className="drp-range">
                <strong>{fmtRange(shown)}</strong>
                <span>{days} хоног</span>
              </div>
              {compare && (
                <div className="drp-compare" role="radiogroup" aria-label="Харьцуулах">
                  <span className="drp-clabel">Харьцуулах</span>
                  {(
                    [
                      ["off", "Үгүй"],
                      ["previous", "Өмнөх үе"],
                      ["year", "Өмнөх жил"],
                    ] as [CompareMode, string][]
                  ).map(([m, l]) => (
                    <button key={m} type="button" role="radio" aria-checked={mode === m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="drp-actions">
              <button type="button" className="drp-btn" onClick={() => close()}>Болих</button>
              <button
                type="button"
                className="drp-btn primary"
                disabled={!draft.end}
                onClick={() => {
                  const r = { start: draft.start, end: draft.end ?? draft.start };
                  if (value === undefined) setInner(r);
                  setAppliedMode(mode);
                  onChange?.(r, compareRange(r, mode), mode);
                  close();
                }}
              >
                Хэрэглэх
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
.drp{--drp-bg:#fff;--drp-fg:#18181b;--drp-muted:#65656d;--drp-faint:#65656d;--drp-line:#ececef;--drp-soft:#f4f4f5;--drp-band:#ececee;--drp-band-pv:#f4f4f6;--drp-end:#18181b;--drp-end-fg:#fff;--drp-blue:#3b82f6;--drp-cmp:#e6effd;position:relative;display:inline-block;color:var(--drp-fg);font:400 14px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .drp{--drp-bg:#1b1b1e;--drp-fg:#ececef;--drp-muted:#a1a1aa;--drp-faint:#9a9aa2;--drp-line:#2e2e33;--drp-soft:#26262a;--drp-band:#2c2c31;--drp-band-pv:#242428;--drp-end:#ececef;--drp-end-fg:#18181b;--drp-cmp:#1c2a40;color-scheme:dark}
.drp *{box-sizing:border-box}.drp button{font:inherit;color:inherit;cursor:pointer}
.drp-trigger{display:inline-flex;align-items:center;gap:9px;height:32px;padding:0 10px;border:1px solid var(--drp-line);border-radius:8px;background:var(--drp-bg);box-shadow:0 1px 2px #00000008;font-size:14px!important;white-space:nowrap}
.drp-trigger:hover{border-color:color-mix(in srgb,var(--drp-fg) 18%,var(--drp-line))}
.drp-cal{width:14px;height:14px;fill:none;stroke:var(--drp-muted);stroke-width:1.2;stroke-linecap:round}
.drp-chev{width:13px;height:13px;margin-left:6px;fill:none;stroke:var(--drp-muted);stroke-width:1.4;stroke-linecap:round;transition:transform .15s}
.drp-trigger[aria-expanded=true] .drp-chev{transform:rotate(180deg)}
.drp-panel{position:absolute;z-index:30;top:calc(100% + 6px);left:0;width:var(--ui-drpc-panel-width,min(652px,calc(100vw - 32px)));border:1px solid var(--drp-line);border-radius:10px;background:var(--drp-bg);box-shadow:0 12px 32px #0000001a,0 1px 3px #0000000a;transform-origin:top left;animation:drp-in .16s ease-out;overflow:hidden}
.drp-main{display:grid;grid-template-columns:140px minmax(0,1fr)}
.drp-presets{display:flex;flex-direction:column;gap:0;padding:4px;border-right:1px solid var(--drp-line)}
.drp-presets button,.drp-custom{display:block;width:100%;height:30px;padding:0 10px;border:0;border-radius:6px;background:none;text-align:left;font-size:14px;color:var(--drp-fg);line-height:30px;white-space:nowrap}
.drp-presets button:hover{background:var(--drp-soft)}
.drp-presets button.on{background:var(--drp-soft);font-weight:500}
.drp-custom{color:var(--drp-faint)}.drp-custom.on{color:var(--drp-fg);background:var(--drp-soft)}
.drp-months{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:10px 20px 14px}
.drp-month{min-width:0;animation:drp-slide .22s ease-out}
.drp-mhead{display:flex;align-items:center;justify-content:space-between;height:28px;margin-bottom:6px;font-weight:500}
.drp-nav,.drp-nav-sp{width:24px;height:24px}
.drp-nav{display:grid;place-items:center;padding:0;border:0;border-radius:6px;background:none;color:var(--drp-muted)}.drp-nav:hover{background:var(--drp-soft);color:var(--drp-fg)}
.drp-nav svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.drp-grid{width:100%;border-collapse:separate;border-spacing:0 6px;table-layout:fixed;margin-top:-6px}
.drp-grid th{height:22px;font-size:10.5px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--drp-muted)}
.drp-grid td{padding:0;height:28px;text-align:center}
.drp-grid td.band{background:var(--drp-band)}.drp-grid td.band.pv{background:var(--drp-band-pv)}
.drp-grid td.cmp{background:var(--drp-cmp)}
.drp-grid td.bl,.drp-grid td.cl{border-top-left-radius:6px;border-bottom-left-radius:6px}
.drp-grid td.br,.drp-grid td.cr{border-top-right-radius:6px;border-bottom-right-radius:6px}
.drp-grid td.cmp.cl{box-shadow:inset 1px 0 0 var(--drp-blue)}.drp-grid td.cmp.cr{box-shadow:inset -1px 0 0 var(--drp-blue)}
.drp-day{position:relative;display:inline-grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:none;font-size:14px;font-variant-numeric:tabular-nums;transition:background .12s,color .12s}
.drp-day:hover{background:color-mix(in srgb,var(--drp-fg) 8%,transparent)}
.drp-day.end{background:var(--drp-end);color:var(--drp-end-fg)!important;font-weight:500}
.drp-day.off{color:var(--drp-faint)!important;cursor:default}.drp-day.off:hover{background:none}
.drp-today{position:absolute;bottom:2px;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:var(--drp-blue)}
.drp-foot{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:12px 10px 10px 14px;border-top:1px solid var(--drp-line)}
.drp-range{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}
.drp-range strong{font-weight:500}.drp-range span{font-size:12.5px;color:var(--drp-muted)}
.drp-compare{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.drp-clabel{font-size:13px;color:var(--drp-muted);margin-right:4px}
.drp-compare button{height:28px;padding:0 9px;border:1px solid transparent;border-radius:6px;background:none;color:var(--drp-muted);font-size:14px}
.drp-compare button:hover{color:var(--drp-fg)}
.drp-compare button.on{background:var(--drp-soft);color:var(--drp-fg);border-color:var(--drp-line)}
.drp-compare button:not(.on){border-color:var(--drp-line)}
.drp-compare button:not(.on){border-color:transparent;box-shadow:inset 0 0 0 1px var(--drp-line)}
.drp-actions{display:flex;gap:6px;flex:none}
.drp-btn{height:30px;padding:0 10px;border:1px solid var(--drp-line);border-radius:7px;background:var(--drp-bg);font-weight:450}
.drp-btn:hover{background:var(--drp-soft)}
.drp-btn.primary{background:var(--drp-end);border-color:var(--drp-end);color:var(--drp-end-fg)!important}
.drp-btn:disabled{opacity:.45;cursor:not-allowed}
.drp :focus-visible{outline:2px solid var(--drp-blue);outline-offset:1px}
@keyframes drp-in{from{opacity:0;transform:scale(.97)}}
@keyframes drp-slide{from{opacity:.4;transform:translateX(calc(var(--drp-dir,0) * 10px))}}
@media(max-width:600px){.drp-main{grid-template-columns:minmax(0,1fr)}.drp-presets{flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid var(--drp-line)}.drp-presets button,.drp-custom{width:auto;flex:none}.drp-months{grid-template-columns:minmax(0,1fr);padding:10px 12px}.drp-month:first-child{display:none}.drp-month:last-child .drp-mhead .drp-nav-sp{display:none}.drp-foot{flex-direction:column;align-items:stretch}.drp-actions{justify-content:flex-end}}
@media(pointer:coarse){.drp-grid td{height:40px}.drp-day{width:40px;height:40px}.drp-btn{height:40px}}
@media(prefers-reduced-motion:reduce){.drp *{animation:none!important;transition:none!important}}
`;

export function Demo() {
  return (
    <div style={{ width: "100%", maxWidth: 652, minHeight: 440 }}>
      <DateRangePicker defaultCompare="off" />
    </div>
  );
}

export default Demo;
