"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type TagTone = "blue" | "violet" | "pink" | "green" | "amber" | "gray";

export type DataColumn = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  width?: number | string;
  type?: "title" | "tag" | "link" | "number" | "text";
  editable?: boolean;
  options?: string[];
  format?: (value: number) => string;
};

export type DataRow = {
  id: string;
  logo?: React.ReactNode;
  [key: string]: unknown;
};

export type DataTableProps = {
  title?: string;
  icon?: React.ReactNode;
  columns?: DataColumn[];
  rows?: DataRow[];
  tagTones?: Record<string, TagTone>;
  editable?: boolean;
  onRowsChange?: (rows: DataRow[]) => void;
  onSelectionChange?: (ids: string[]) => void;
  className?: string;
};

const ico = (d: string) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" className="dt-ico">
    <path d={d} />
  </svg>
);

const defaultColumns: DataColumn[] = [
  { key: "tool", label: "Хэрэгсэл", type: "title", icon: ico("M3 4.5h10M3 8h10M3 11.5h6"), width: "34%" },
  {
    key: "category",
    label: "Ангилал",
    type: "tag",
    icon: ico("M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z"),
    options: ["Дизайн", "Ажил хянах", "Байршуулалт", "Вэб сайт", "Видео"],
    width: "25%",
  },
  {
    key: "website",
    label: "Холбоос",
    type: "link",
    icon: ico("M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1"),
    width: "20%",
  },
  { key: "renews", label: "Сунгах", type: "text", icon: ico("M3 4.5h10v8.5H3zM3 7h10M6 3v2.5M10 3v2.5") },
];

/** Neutral first-letter mark (no brand logos). */
const mark = (ch: string, fill: string) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <rect x="1" y="1" width="14" height="14" rx="4" fill={fill} />
    <text x="8" y="11.5" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#fff" fontFamily="Inter,system-ui,sans-serif">
      {ch}
    </text>
  </svg>
);

const defaultRows: DataRow[] = [
  { id: "design", logo: mark("Д", "#8b5cf6"), tool: "Дизайны файл", category: "Дизайн", website: "design.example.mn", renews: "2026.03.12" },
  { id: "tasks", logo: mark("А", "#5e6ad2"), tool: "Ажлын самбар", category: "Ажил хянах", website: "tasks.example.mn", renews: "2026.01.04" },
  { id: "cloud", logo: mark("Ү", "#52525b"), tool: "Үүлэн сервер", category: "Байршуулалт", website: "cloud.example.mn", renews: "2026.08.21" },
  { id: "site", logo: mark("В", "#db2777"), tool: "Вэб бүтээгч", category: "Вэб сайт", website: "site.example.mn", renews: "2026.05.02" },
  { id: "video", logo: mark("Б", "#16a34a"), tool: "Бичлэгийн сан", category: "Видео", website: "video.example.mn", renews: "2026.11.18" },
];

const defaultTones: Record<string, TagTone> = {
  Дизайн: "violet",
  "Ажил хянах": "blue",
  Байршуулалт: "gray",
  "Вэб сайт": "pink",
  Видео: "green",
};

type Pos = { r: number; c: number };
type Sort = { key: string; dir: "asc" | "desc" } | null;

const numberFormat = (n: number) => new Intl.NumberFormat("en-US").format(n).replace("-", "−");
const text = (v: unknown) => (v == null ? "" : String(v));

export function DataTable({
  title = "Багийн хэрэгслүүд",
  icon,
  columns = defaultColumns,
  rows: initialRows = defaultRows,
  tagTones = defaultTones,
  editable = true,
  onRowsChange,
  onSelectionChange,
  className = "",
}: DataTableProps) {
  const [rows, setRows] = React.useState(initialRows);
  const [past, setPast] = React.useState<DataRow[][]>([]);
  const [future, setFuture] = React.useState<DataRow[][]>([]);
  const [checked, setChecked] = React.useState<string[]>([]);
  const [active, setActive] = React.useState<Pos | null>(null);
  const [anchor, setAnchor] = React.useState<Pos | null>(null);
  const [editing, setEditing] = React.useState<{ pos: Pos; value: string } | null>(null);
  const [sort, setSort] = React.useState<Sort>(null);
  const grid = React.useRef<HTMLDivElement>(null);
  const counter = React.useRef(0);

  const view = React.useMemo(() => {
    if (!sort) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return text(x).localeCompare(text(y), undefined, { numeric: true }) * dir;
    });
  }, [rows, sort]);

  const commit = (next: DataRow[]) => {
    setPast((p) => [...p.slice(-99), rows]);
    setFuture([]);
    setRows(next);
    onRowsChange?.(next);
  };
  const undo = () => {
    const prev = past.at(-1);
    if (!prev) return;
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [rows, ...f]);
    setRows(prev);
    onRowsChange?.(prev);
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, rows]);
    setRows(next);
    onRowsChange?.(next);
  };

  const setCells = (cells: { r: number; c: number; value: string }[]) => {
    if (!editable) return;
    const byId = new Map(rows.map((row) => [row.id, { ...row }]));
    for (const { r, c, value } of cells) {
      const row = view[r], col = columns[c];
      if (!row || !col || col.editable === false) continue;
      const target = byId.get(row.id)!;
      target[col.key] = col.type === "number" && value.trim() !== "" && !isNaN(+value.replace(/[,−]/g, (m) => (m === "−" ? "-" : ""))) ? +value.replace(/[,−]/g, (m) => (m === "−" ? "-" : "")) : value;
    }
    commit(rows.map((row) => byId.get(row.id)!));
  };

  const range = React.useMemo(() => {
    if (!active) return null;
    const a = anchor ?? active;
    return {
      r0: Math.min(a.r, active.r),
      r1: Math.max(a.r, active.r),
      c0: Math.min(a.c, active.c),
      c1: Math.max(a.c, active.c),
    };
  }, [active, anchor]);
  const inRange = (r: number, c: number) =>
    !!range && r >= range.r0 && r <= range.r1 && c >= range.c0 && c <= range.c1;

  const toggleRow = (id: string) => {
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
    setChecked(next);
    onSelectionChange?.(next);
  };
  const toggleAll = () => {
    const next = checked.length === rows.length ? [] : rows.map((r) => r.id);
    setChecked(next);
    onSelectionChange?.(next);
  };

  const startEdit = (pos: Pos, value?: string) => {
    const col = columns[pos.c];
    if (!editable || col.editable === false) return;
    setEditing({ pos, value: value ?? text(view[pos.r]?.[col.key]) });
  };
  const finishEdit = (save: boolean, move = 0) => {
    if (!editing) return;
    if (save) setCells([{ ...editing.pos, value: editing.value }]);
    const pos = { r: Math.min(view.length - 1, editing.pos.r + move), c: editing.pos.c };
    setEditing(null);
    setActive(pos);
    setAnchor(null);
    requestAnimationFrame(() => grid.current?.focus());
  };

  const addRow = () => {
    counter.current += 1;
    const row: DataRow = { id: `row-${Date.now()}-${counter.current}` };
    columns.forEach((c) => (row[c.key] = ""));
    commit([...rows, row]);
    const pos = { r: view.length, c: 0 };
    setActive(pos);
    setAnchor(null);
    setSort(null);
    setTimeout(() => setEditing({ pos, value: "" }));
  };

  const selectionText = () => {
    if (!range) return "";
    const lines: string[] = [];
    for (let r = range.r0; r <= range.r1; r++) {
      const cells: string[] = [];
      for (let c = range.c0; c <= range.c1; c++) cells.push(text(view[r]?.[columns[c].key]));
      lines.push(cells.join("\t"));
    }
    return lines.join("\n");
  };
  const clearRange = () => {
    if (!range) return;
    const cells = [];
    for (let r = range.r0; r <= range.r1; r++)
      for (let c = range.c0; c <= range.c1; c++) cells.push({ r, c, value: "" });
    setCells(cells);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (editing) return;
    const mod = e.metaKey || e.ctrlKey;
    const lastR = view.length - 1, lastC = columns.length - 1;
    if (mod && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
      return;
    }
    if (mod && e.key.toLowerCase() === "a") {
      e.preventDefault();
      setAnchor({ r: 0, c: 0 });
      setActive({ r: lastR, c: lastC });
      return;
    }
    if (!active) {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        setActive({ r: 0, c: 0 });
      }
      return;
    }
    const move = (r: number, c: number) => {
      const next = { r: Math.max(0, Math.min(lastR, r)), c: Math.max(0, Math.min(lastC, c)) };
      if (e.shiftKey) setAnchor((a) => a ?? active);
      else setAnchor(null);
      setActive(next);
    };
    switch (e.key) {
      case "ArrowUp": e.preventDefault(); return move(mod ? 0 : active.r - 1, active.c);
      case "ArrowDown": e.preventDefault(); return move(mod ? lastR : active.r + 1, active.c);
      case "ArrowLeft": e.preventDefault(); return move(active.r, mod ? 0 : active.c - 1);
      case "ArrowRight": e.preventDefault(); return move(active.r, mod ? lastC : active.c + 1);
      case "Tab": {
        e.preventDefault();
        setAnchor(null);
        const i = active.r * columns.length + active.c + (e.shiftKey ? -1 : 1);
        const clamped = Math.max(0, Math.min(view.length * columns.length - 1, i));
        setActive({ r: Math.floor(clamped / columns.length), c: clamped % columns.length });
        return;
      }
      case "Enter":
      case "F2": e.preventDefault(); return startEdit(active);
      case "Escape": return setAnchor(null);
      case "Delete":
      case "Backspace": e.preventDefault(); return clearRange();
    }
    if (e.key.length === 1 && !mod && !e.altKey) {
      e.preventDefault();
      startEdit(active, e.key);
    }
  };

  const onCopy = (e: React.ClipboardEvent, cut = false) => {
    if (editing || !range) return;
    e.preventDefault();
    e.clipboardData.setData("text/plain", selectionText());
    if (cut) clearRange();
  };
  const onPaste = (e: React.ClipboardEvent) => {
    if (editing || !active || !editable) return;
    e.preventDefault();
    const data = e.clipboardData.getData("text/plain").replace(/\r/g, "").replace(/\n$/, "");
    const cells: { r: number; c: number; value: string }[] = [];
    data.split("\n").forEach((line, dr) =>
      line.split("\t").forEach((value, dc) => cells.push({ r: active.r + dr, c: active.c + dc, value })),
    );
    setCells(cells);
  };

  const header = (col: DataColumn) => {
    const dir = sort?.key === col.key ? sort.dir : null;
    return (
      <button
        type="button"
        className="dt-sort"
        aria-label={`Sort by ${col.label}${dir ? `, sorted ${dir === "asc" ? "ascending" : "descending"}` : ""}`}
        onClick={() =>
          setSort(dir === null ? { key: col.key, dir: "asc" } : dir === "asc" ? { key: col.key, dir: "desc" } : null)
        }
      >
        {col.icon}
        {col.label}
        {dir && (
          <svg viewBox="0 0 16 16" aria-hidden="true" className={`dt-arrow ${dir}`}>
            <path d="M8 3.5v9M4.5 9 8 12.5 11.5 9" />
          </svg>
        )}
      </button>
    );
  };

  const cellContent = (row: DataRow, col: DataColumn) => {
    const value = row[col.key];
    if (col.type === "title")
      return (
        <span className="dt-title">
          {row.logo && <span className="dt-logo">{row.logo}</span>}
          {text(value)}
        </span>
      );
    if (col.type === "tag")
      return value ? <span className={`dt-tag ${tagTones[text(value)] ?? "gray"}`}>{text(value)}</span> : null;
    if (col.type === "link")
      return value ? (
        <a className="dt-link" href={`https://${text(value)}`} target="_blank" rel="noreferrer" tabIndex={-1}>
          {text(value)}
        </a>
      ) : null;
    if (col.type === "number" && typeof value === "number")
      return <span className="dt-num">{(col.format ?? numberFormat)(value)}</span>;
    return text(value);
  };

  const allChecked = rows.length > 0 && checked.length === rows.length;
  const someChecked = checked.length > 0 && !allChecked;
  const template = `36px ${columns.map((c) => (c.width ? (typeof c.width === "number" ? `${c.width}px` : `minmax(0,${c.width})`) : "minmax(0,1fr)")).join(" ")}`;

  return (
    <section className={`dt-root ${className}`}>
      <style>{css}</style>
      <header className="dt-head">
        <span className="dt-head-icon">
          {icon ?? (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="#2f6fed" />
              <path d="M4.8 5.5h6.4M4.8 8h6.4M4.8 10.5h4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          )}
        </span>
        <h3>{title}</h3>
        <div className="dt-history">
          <button type="button" aria-label="Undo" disabled={!past.length} onClick={undo}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4 3 7l3 3M3 7h6.5a3.5 3.5 0 0 1 0 7H8" /></svg>
          </button>
          <button type="button" aria-label="Redo" disabled={!future.length} onClick={redo}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 4 3 3-3 3m3-3H6.5a3.5 3.5 0 0 0 0 7H8" /></svg>
          </button>
        </div>
      </header>
      <div className="dt-scroll">
        <div
          className="dt-grid"
          role="grid"
          aria-label={title}
          aria-multiselectable="true"
          aria-rowcount={view.length + 1}
          tabIndex={0}
          ref={grid}
          onKeyDown={onKey}
          onCopy={(e) => onCopy(e)}
          onCut={(e) => onCopy(e, true)}
          onPaste={onPaste}
          onFocus={(e) => {
            if (e.target === grid.current && !active && view.length) setActive({ r: 0, c: 0 });
          }}
          style={{ ["--dt-cols" as string]: template }}
        >
          <div className="dt-row dt-hrow" role="row">
            <span className="dt-check" role="columnheader">
              <input
                type="checkbox"
                aria-label="Select all rows"
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = someChecked;
                }}
                onChange={toggleAll}
              />
            </span>
            {columns.map((col) => (
              <span
                role="columnheader"
                key={col.key}
                className="dt-th"
                aria-sort={sort?.key === col.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
              >
                {header(col)}
              </span>
            ))}
          </div>
          {view.map((row, r) => (
            <div
              className={`dt-row ${checked.includes(row.id) ? "checked" : ""}`}
              role="row"
              key={row.id}
              aria-selected={checked.includes(row.id)}
            >
              <span className="dt-check" role="gridcell">
                <input
                  type="checkbox"
                  aria-label={`Select ${text(row[columns[0].key]) || "row"}`}
                  checked={checked.includes(row.id)}
                  onChange={() => toggleRow(row.id)}
                />
              </span>
              {columns.map((col, c) => {
                const isActive = active?.r === r && active?.c === c;
                const isEditing = editing?.pos.r === r && editing.pos.c === c;
                const label = `${text(row[columns[0].key]) || "New row"} ${col.label}`;
                return (
                  <span
                    key={col.key}
                    role="gridcell"
                    aria-selected={inRange(r, c)}
                    className={`dt-td ${inRange(r, c) ? "in-range" : ""} ${isActive ? "active" : ""} ${col.type ?? "text"}`}
                    onMouseDown={(e) => {
                      if (isEditing) return;
                      e.preventDefault();
                      grid.current?.focus();
                      if (e.shiftKey && active) setAnchor((a) => a ?? active);
                      else setAnchor(null);
                      setActive({ r, c });
                      setEditing(null);
                    }}
                    onMouseEnter={(e) => {
                      if (e.buttons === 1 && active && !editing) {
                        setAnchor((a) => a ?? active);
                        setActive({ r, c });
                      }
                    }}
                    onDoubleClick={() => startEdit({ r, c })}
                  >
                    {isEditing ? (
                      col.type === "tag" && col.options ? (
                        <span className="dt-picker" role="listbox" aria-label={label}>
                          {col.options.map((o) => (
                            <button
                              type="button"
                              role="option"
                              key={o}
                              aria-selected={editing.value === o}
                              autoFocus={editing.value === o}
                              onMouseDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") finishEdit(false);
                              }}
                              onClick={() => {
                                setCells([{ r, c, value: o }]);
                                setEditing(null);
                                grid.current?.focus();
                              }}
                            >
                              <span className={`dt-tag ${tagTones[o] ?? "gray"}`}>{o}</span>
                            </button>
                          ))}
                        </span>
                      ) : (
                        <input
                          className="dt-input"
                          aria-label={label}
                          autoFocus
                          value={editing.value}
                          onMouseDown={(e) => e.stopPropagation()}
                          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                          onBlur={() => finishEdit(true)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") finishEdit(true, 1);
                            if (e.key === "Escape") finishEdit(false);
                            if (e.key === "Tab") {
                              e.preventDefault();
                              finishEdit(true);
                            }
                          }}
                        />
                      )
                    ) : (
                      cellContent(row, col)
                    )}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <footer className="dt-foot">
        {editable && (
          <button type="button" className="dt-add" onClick={addRow}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" /></svg>
            Add row
          </button>
        )}
        <span>{checked.length ? `${checked.length} selected` : editable ? "Double-click a cell to edit" : ""}</span>
      </footer>
    </section>
  );
}

const css = `
.dt-root{--dt-fg:#1f1f1f;--dt-muted:#8b8b8b;--dt-card:#fff;--dt-line:#ededed;--dt-soft:#f6f6f6;--dt-blue:#2f6fed;--dt-sel:#2f6fed14;width:100%;max-width:720px;margin:0 auto;background:var(--dt-card);border:1px solid var(--dt-line);border-radius:12px;color:var(--dt-fg);font:400 13px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;text-align:left;box-shadow:0 1px 2px #00000008;overflow:hidden}
:where(.dark,[data-theme=dark]) .dt-root{--dt-fg:#ececec;--dt-muted:#8f8f94;--dt-card:#1b1b1e;--dt-line:#2b2b30;--dt-soft:#242428;--dt-blue:#5b8cff;--dt-sel:#5b8cff22;color-scheme:dark}
.dt-root *{box-sizing:border-box}
.dt-root :where(button){font:inherit;color:inherit;cursor:pointer}
.dt-root button:focus-visible{outline:2px solid var(--dt-blue);outline-offset:1px;border-radius:4px}
.dt-ico{width:12px;height:12px;flex:none;fill:none;stroke:currentColor;stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
.dt-head{display:flex;align-items:center;gap:10px;padding:14px 16px 13px 18px;border-bottom:1px solid var(--dt-line)}
.dt-head-icon{display:grid;place-items:center}
.dt-head-icon svg{width:15px;height:15px}
.dt-head h3{margin:0;font-size:15px;font-weight:500;letter-spacing:-.005em}
.dt-history{margin-left:auto;display:flex;gap:6px}
.dt-history button{width:24px;height:24px;display:grid;place-items:center;border:0;background:none;border-radius:6px;color:var(--dt-fg)}
.dt-history button:hover:not(:disabled){background:var(--dt-soft)}
.dt-history button:disabled{color:var(--dt-muted);opacity:.45;cursor:default}
.dt-history svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.dt-scroll{overflow-x:auto}
.dt-grid{min-width:560px;outline:none}
.dt-row{display:grid;grid-template-columns:var(--dt-cols);align-items:center;min-height:40px;border-bottom:1px solid var(--dt-line)}
.dt-hrow{min-height:36px}
.dt-row.checked{background:var(--dt-sel)}
.dt-check{display:grid;place-items:center;padding-left:6px;height:100%}
.dt-check input{appearance:none;width:14px;height:14px;margin:0;border:1px solid #d4d4d4;border-radius:4px;background:var(--dt-card);display:grid;place-items:center;cursor:pointer;transition:transform .15s}
.dt-check input:checked,.dt-check input:indeterminate{background:var(--dt-blue);border-color:var(--dt-blue)}
.dt-check input:checked::after{content:"";width:7px;height:4px;border:1.5px solid #fff;border-top:0;border-right:0;transform:rotate(-45deg) translate(1px,-1px)}
.dt-check input:indeterminate::after{content:"";width:7px;height:1.5px;background:#fff}
.dt-check input:active{transform:scale(.88)}
.dt-check input:focus-visible{outline:2px solid var(--dt-blue);outline-offset:2px}
.dt-th{min-width:0}
.dt-sort{display:flex;align-items:center;gap:7px;border:0;background:none;padding:0 12px;height:36px;width:100%;font-size:12px!important;color:color-mix(in srgb,var(--dt-fg) 75%,transparent)!important;text-align:left}
.dt-sort .dt-ico{color:var(--dt-muted)}
.dt-sort:hover{color:var(--dt-fg)!important}
.dt-arrow{width:11px;height:11px;fill:none;stroke:var(--dt-blue);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;transition:transform .2s}
.dt-arrow.asc{transform:rotate(180deg)}
.dt-td{position:relative;display:flex;align-items:center;height:100%;min-height:40px;padding:0 12px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:default;user-select:none;font-size:13px}
.dt-td.in-range{background:var(--dt-sel)}
.dt-td.active{box-shadow:inset 0 0 0 1.5px var(--dt-blue);border-radius:2px;overflow:visible}
.dt-td.text{color:color-mix(in srgb,var(--dt-fg) 82%,transparent)}
.dt-title{display:flex;align-items:center;gap:9px;font-weight:450;min-width:0}
.dt-logo{display:grid;place-items:center;width:16px;height:16px;flex:none}
.dt-logo svg{width:15px;height:15px}
.dt-tag{display:inline-block;font-size:12px;line-height:19px;padding:0 6px;border-radius:4px;white-space:nowrap}
.dt-tag.blue{background:#2f6fed14;color:#2563d8}.dt-tag.violet{background:#8b5cf618;color:#7c3aed}.dt-tag.pink{background:#ec489914;color:#db2777}.dt-tag.green{background:#16a34a14;color:#15803d}.dt-tag.amber{background:#f59e0b18;color:#b45309}.dt-tag.gray{background:#0000000d;color:#555}
:where(.dark,[data-theme=dark]) .dt-tag.gray{background:#ffffff12;color:#bbb}
.dt-link{color:color-mix(in srgb,var(--dt-fg) 82%,transparent);text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--dt-fg) 30%,transparent);text-underline-offset:3px}
.dt-link:hover{color:var(--dt-blue)}
.dt-num{margin-left:auto;font-variant-numeric:tabular-nums}
.dt-input{width:100%;border:0;outline:0;background:none;color:inherit;font:inherit;padding:0}
.dt-picker{position:absolute;z-index:5;left:6px;top:6px;display:grid;gap:2px;padding:4px;background:var(--dt-card);border:1px solid var(--dt-line);border-radius:8px;box-shadow:0 8px 24px #0000001f;animation:dt-drop .16s ease-out}
.dt-picker button{display:flex;border:0;background:none;padding:4px 6px;border-radius:5px;text-align:left}
.dt-picker button:hover,.dt-picker [aria-selected=true]{background:var(--dt-soft)}
.dt-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 16px 0 14px;height:44px;font-size:12px;color:var(--dt-muted)}
.dt-add{display:flex;align-items:center;gap:8px;border:0;background:none;padding:4px;border-radius:6px;font-size:13px!important;color:color-mix(in srgb,var(--dt-fg) 85%,transparent)!important}
.dt-add:hover{background:var(--dt-soft)}
.dt-add svg{width:13px;height:13px;fill:none;stroke:var(--dt-muted);stroke-width:1.3;stroke-linecap:round}
@keyframes dt-drop{from{opacity:0;transform:translateY(-4px)}}
@media (prefers-reduced-motion:reduce){.dt-root *{animation:none!important;transition:none!important}}
@media (pointer:coarse){.dt-check input{width:18px;height:18px}.dt-check{min-width:36px;min-height:36px}}
@media (max-width:560px){.dt-head{padding:12px 14px}.dt-foot span{display:none}}
`;

export default DataTable;
