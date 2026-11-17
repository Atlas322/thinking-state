import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { K as KPIChart } from "./kpi-chart-CFFA-uQv.js";
import { C as CitedAnswer } from "./cited-answer-eJy9EKIh.js";
import { C as CostWaterfall } from "./cost-waterfall-CkG2kw_k.js";
import { A as ApprovalCard } from "./approval-card-ZzPi1LU_.js";
import { c as SourceIcon } from "./source-preview-BedfD0w3.js";
import { C as CashRiver, c as cashRiverDemo } from "./cash-river-C9XN9BMF.js";
const ico = (d) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: "dt-ico", children: /* @__PURE__ */ jsx("path", { d }) });
const defaultColumns = [
  { key: "tool", label: "Хэрэгсэл", type: "title", icon: ico("M3 4.5h10M3 8h10M3 11.5h6"), width: "34%" },
  {
    key: "category",
    label: "Ангилал",
    type: "tag",
    icon: ico("M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z"),
    options: ["Дизайн", "Ажил хянах", "Байршуулалт", "Вэб сайт", "Видео"],
    width: "25%"
  },
  {
    key: "website",
    label: "Холбоос",
    type: "link",
    icon: ico("M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1"),
    width: "20%"
  },
  { key: "renews", label: "Сунгах", type: "text", icon: ico("M3 4.5h10v8.5H3zM3 7h10M6 3v2.5M10 3v2.5") }
];
const mark = (ch, fill) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("rect", { x: "1", y: "1", width: "14", height: "14", rx: "4", fill }),
  /* @__PURE__ */ jsx("text", { x: "8", y: "11.5", textAnchor: "middle", fontSize: "9.5", fontWeight: "600", fill: "#fff", fontFamily: "Inter,system-ui,sans-serif", children: ch })
] });
const defaultRows = [
  { id: "design", logo: mark("Д", "#8b5cf6"), tool: "Дизайны файл", category: "Дизайн", website: "design.example.mn", renews: "2026.03.12" },
  { id: "tasks", logo: mark("А", "#5e6ad2"), tool: "Ажлын самбар", category: "Ажил хянах", website: "tasks.example.mn", renews: "2026.01.04" },
  { id: "cloud", logo: mark("Ү", "#52525b"), tool: "Үүлэн сервер", category: "Байршуулалт", website: "cloud.example.mn", renews: "2026.08.21" },
  { id: "site", logo: mark("В", "#db2777"), tool: "Вэб бүтээгч", category: "Вэб сайт", website: "site.example.mn", renews: "2026.05.02" },
  { id: "video", logo: mark("Б", "#16a34a"), tool: "Бичлэгийн сан", category: "Видео", website: "video.example.mn", renews: "2026.11.18" }
];
const defaultTones = {
  Дизайн: "violet",
  "Ажил хянах": "blue",
  Байршуулалт: "gray",
  "Вэб сайт": "pink",
  Видео: "green"
};
const numberFormat = (n) => new Intl.NumberFormat("en-US").format(n).replace("-", "−");
const text = (v) => v == null ? "" : String(v);
function DataTable({
  title = "Багийн хэрэгслүүд",
  icon,
  columns = defaultColumns,
  rows: initialRows = defaultRows,
  tagTones = defaultTones,
  editable = true,
  onRowsChange,
  onSelectionChange,
  className = ""
}) {
  const [rows, setRows] = React.useState(initialRows);
  const [past, setPast] = React.useState([]);
  const [future, setFuture] = React.useState([]);
  const [checked, setChecked] = React.useState([]);
  const [active, setActive] = React.useState(null);
  const [anchor, setAnchor] = React.useState(null);
  const [editing, setEditing] = React.useState(null);
  const [sort, setSort] = React.useState(null);
  const grid = React.useRef(null);
  const counter = React.useRef(0);
  const view = React.useMemo(() => {
    if (!sort) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return text(x).localeCompare(text(y), void 0, { numeric: true }) * dir;
    });
  }, [rows, sort]);
  const commit = (next) => {
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
  const setCells = (cells) => {
    if (!editable) return;
    const byId = new Map(rows.map((row) => [row.id, { ...row }]));
    for (const { r, c, value } of cells) {
      const row = view[r], col = columns[c];
      if (!row || !col || col.editable === false) continue;
      const target = byId.get(row.id);
      target[col.key] = col.type === "number" && value.trim() !== "" && !isNaN(+value.replace(/[,−]/g, (m) => m === "−" ? "-" : "")) ? +value.replace(/[,−]/g, (m) => m === "−" ? "-" : "") : value;
    }
    commit(rows.map((row) => byId.get(row.id)));
  };
  const range = React.useMemo(() => {
    if (!active) return null;
    const a = anchor ?? active;
    return {
      r0: Math.min(a.r, active.r),
      r1: Math.max(a.r, active.r),
      c0: Math.min(a.c, active.c),
      c1: Math.max(a.c, active.c)
    };
  }, [active, anchor]);
  const inRange = (r, c) => !!range && r >= range.r0 && r <= range.r1 && c >= range.c0 && c <= range.c1;
  const toggleRow = (id) => {
    const next = checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id];
    setChecked(next);
    onSelectionChange?.(next);
  };
  const toggleAll = () => {
    const next = checked.length === rows.length ? [] : rows.map((r) => r.id);
    setChecked(next);
    onSelectionChange?.(next);
  };
  const startEdit = (pos, value) => {
    const col = columns[pos.c];
    if (!editable || col.editable === false) return;
    setEditing({ pos, value: value ?? text(view[pos.r]?.[col.key]) });
  };
  const finishEdit = (save, move = 0) => {
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
    const row = { id: `row-${Date.now()}-${counter.current}` };
    columns.forEach((c) => row[c.key] = "");
    commit([...rows, row]);
    const pos = { r: view.length, c: 0 };
    setActive(pos);
    setAnchor(null);
    setSort(null);
    setTimeout(() => setEditing({ pos, value: "" }));
  };
  const selectionText = () => {
    if (!range) return "";
    const lines = [];
    for (let r = range.r0; r <= range.r1; r++) {
      const cells = [];
      for (let c = range.c0; c <= range.c1; c++) cells.push(text(view[r]?.[columns[c].key]));
      lines.push(cells.join("	"));
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
  const onKey = (e) => {
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
    const move = (r, c) => {
      const next = { r: Math.max(0, Math.min(lastR, r)), c: Math.max(0, Math.min(lastC, c)) };
      if (e.shiftKey) setAnchor((a) => a ?? active);
      else setAnchor(null);
      setActive(next);
    };
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        return move(mod ? 0 : active.r - 1, active.c);
      case "ArrowDown":
        e.preventDefault();
        return move(mod ? lastR : active.r + 1, active.c);
      case "ArrowLeft":
        e.preventDefault();
        return move(active.r, mod ? 0 : active.c - 1);
      case "ArrowRight":
        e.preventDefault();
        return move(active.r, mod ? lastC : active.c + 1);
      case "Tab": {
        e.preventDefault();
        setAnchor(null);
        const i = active.r * columns.length + active.c + (e.shiftKey ? -1 : 1);
        const clamped = Math.max(0, Math.min(view.length * columns.length - 1, i));
        setActive({ r: Math.floor(clamped / columns.length), c: clamped % columns.length });
        return;
      }
      case "Enter":
      case "F2":
        e.preventDefault();
        return startEdit(active);
      case "Escape":
        return setAnchor(null);
      case "Delete":
      case "Backspace":
        e.preventDefault();
        return clearRange();
    }
    if (e.key.length === 1 && !mod && !e.altKey) {
      e.preventDefault();
      startEdit(active, e.key);
    }
  };
  const onCopy = (e, cut = false) => {
    if (editing || !range) return;
    e.preventDefault();
    e.clipboardData.setData("text/plain", selectionText());
    if (cut) clearRange();
  };
  const onPaste = (e) => {
    if (editing || !active || !editable) return;
    e.preventDefault();
    const data = e.clipboardData.getData("text/plain").replace(/\r/g, "").replace(/\n$/, "");
    const cells = [];
    data.split("\n").forEach(
      (line, dr) => line.split("	").forEach((value, dc) => cells.push({ r: active.r + dr, c: active.c + dc, value }))
    );
    setCells(cells);
  };
  const header = (col) => {
    const dir = sort?.key === col.key ? sort.dir : null;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "dt-sort",
        "aria-label": `Эрэмбэлэх: ${col.label}${dir ? `, ${dir === "asc" ? "өсөхөөр" : "буурахаар"} эрэмбэлсэн` : ""}`,
        onClick: () => setSort(dir === null ? { key: col.key, dir: "asc" } : dir === "asc" ? { key: col.key, dir: "desc" } : null),
        children: [
          col.icon,
          col.label,
          dir && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", className: `dt-arrow ${dir}`, children: /* @__PURE__ */ jsx("path", { d: "M8 3.5v9M4.5 9 8 12.5 11.5 9" }) })
        ]
      }
    );
  };
  const cellContent = (row, col) => {
    const value = row[col.key];
    if (col.type === "title")
      return /* @__PURE__ */ jsxs("span", { className: "dt-title", children: [
        row.logo && /* @__PURE__ */ jsx("span", { className: "dt-logo", children: row.logo }),
        text(value)
      ] });
    if (col.type === "tag")
      return value ? /* @__PURE__ */ jsx("span", { className: `dt-tag ${tagTones[text(value)] ?? "gray"}`, children: text(value) }) : null;
    if (col.type === "link")
      return value ? /* @__PURE__ */ jsx("a", { className: "dt-link", href: `https://${text(value)}`, target: "_blank", rel: "noreferrer", tabIndex: -1, children: text(value) }) : null;
    if (col.type === "number" && typeof value === "number")
      return /* @__PURE__ */ jsx("span", { className: "dt-num", children: (col.format ?? numberFormat)(value) });
    return text(value);
  };
  const allChecked = rows.length > 0 && checked.length === rows.length;
  const someChecked = checked.length > 0 && !allChecked;
  const template = `36px ${columns.map((c) => c.width ? typeof c.width === "number" ? `${c.width}px` : `minmax(0,${c.width})` : "minmax(0,1fr)").join(" ")}`;
  return /* @__PURE__ */ jsxs("section", { className: `dt-root ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "dt-head", children: [
      /* @__PURE__ */ jsx("span", { className: "dt-head-icon", children: icon ?? /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("rect", { x: "1.5", y: "1.5", width: "13", height: "13", rx: "3", fill: "#2f6fed" }),
        /* @__PURE__ */ jsx("path", { d: "M4.8 5.5h6.4M4.8 8h6.4M4.8 10.5h4", stroke: "#fff", strokeWidth: "1.3", strokeLinecap: "round" })
      ] }) }),
      /* @__PURE__ */ jsx("h3", { children: title }),
      /* @__PURE__ */ jsxs("div", { className: "dt-history", children: [
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Буцаах", disabled: !past.length, onClick: undo, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 4 3 7l3 3M3 7h6.5a3.5 3.5 0 0 1 0 7H8" }) }) }),
        /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Дахин хийх", disabled: !future.length, onClick: redo, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m10 4 3 3-3 3m3-3H6.5a3.5 3.5 0 0 0 0 7H8" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "dt-scroll", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "dt-grid",
        role: "grid",
        "aria-label": title,
        "aria-multiselectable": "true",
        "aria-rowcount": view.length + 1,
        tabIndex: 0,
        ref: grid,
        onKeyDown: onKey,
        onCopy: (e) => onCopy(e),
        onCut: (e) => onCopy(e, true),
        onPaste,
        onFocus: (e) => {
          if (e.target === grid.current && !active && view.length) setActive({ r: 0, c: 0 });
        },
        style: { ["--dt-cols"]: template },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "dt-row dt-hrow", role: "row", children: [
            /* @__PURE__ */ jsx("span", { className: "dt-check", role: "columnheader", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                value: "",
                "aria-label": "Бүх мөрийг сонгох",
                checked: allChecked,
                ref: (el) => {
                  if (el) el.indeterminate = someChecked;
                },
                onChange: toggleAll
              }
            ) }),
            columns.map((col) => /* @__PURE__ */ jsx(
              "span",
              {
                role: "columnheader",
                className: "dt-th",
                "aria-sort": sort?.key === col.key ? sort.dir === "asc" ? "ascending" : "descending" : "none",
                children: header(col)
              },
              col.key
            ))
          ] }),
          view.map((row, r) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `dt-row ${checked.includes(row.id) ? "checked" : ""}`,
              role: "row",
              "aria-selected": checked.includes(row.id),
              children: [
                /* @__PURE__ */ jsx("span", { className: "dt-check", role: "gridcell", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    value: "",
                    "aria-label": `Сонгох: ${text(row[columns[0].key]) || "мөр"}`,
                    checked: checked.includes(row.id),
                    onChange: () => toggleRow(row.id)
                  }
                ) }),
                columns.map((col, c) => {
                  const isActive = active?.r === r && active?.c === c;
                  const isEditing = editing?.pos.r === r && editing.pos.c === c;
                  const label = `${text(row[columns[0].key]) || "Шинэ мөр"} ${col.label}`;
                  return /* @__PURE__ */ jsx(
                    "span",
                    {
                      role: "gridcell",
                      "aria-selected": inRange(r, c),
                      className: `dt-td ${inRange(r, c) ? "in-range" : ""} ${isActive ? "active" : ""} ${col.type ?? "text"}`,
                      onMouseDown: (e) => {
                        if (isEditing) return;
                        e.preventDefault();
                        grid.current?.focus();
                        if (e.shiftKey && active) setAnchor((a) => a ?? active);
                        else setAnchor(null);
                        setActive({ r, c });
                        setEditing(null);
                      },
                      onMouseEnter: (e) => {
                        if (e.buttons === 1 && active && !editing) {
                          setAnchor((a) => a ?? active);
                          setActive({ r, c });
                        }
                      },
                      onDoubleClick: () => startEdit({ r, c }),
                      children: isEditing ? col.type === "tag" && col.options ? /* @__PURE__ */ jsx("span", { className: "dt-picker", role: "listbox", "aria-label": label, children: col.options.map((o) => /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          role: "option",
                          "aria-selected": editing.value === o,
                          autoFocus: editing.value === o,
                          onMouseDown: (e) => e.stopPropagation(),
                          onKeyDown: (e) => {
                            if (e.key === "Escape") finishEdit(false);
                          },
                          onClick: () => {
                            setCells([{ r, c, value: o }]);
                            setEditing(null);
                            grid.current?.focus();
                          },
                          children: /* @__PURE__ */ jsx("span", { className: `dt-tag ${tagTones[o] ?? "gray"}`, children: o })
                        },
                        o
                      )) }) : /* @__PURE__ */ jsx(
                        "input",
                        {
                          className: "dt-input",
                          "aria-label": label,
                          autoFocus: true,
                          value: editing.value,
                          onMouseDown: (e) => e.stopPropagation(),
                          onChange: (e) => setEditing({ ...editing, value: e.target.value }),
                          onBlur: () => finishEdit(true),
                          onKeyDown: (e) => {
                            e.stopPropagation();
                            if (e.key === "Enter") finishEdit(true, 1);
                            if (e.key === "Escape") finishEdit(false);
                            if (e.key === "Tab") {
                              e.preventDefault();
                              finishEdit(true);
                            }
                          }
                        }
                      ) : cellContent(row, col)
                    },
                    col.key
                  );
                })
              ]
            },
            row.id
          ))
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("footer", { className: "dt-foot", children: [
      editable && /* @__PURE__ */ jsxs("button", { type: "button", className: "dt-add", onClick: addRow, children: [
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 3.5v9M3.5 8h9" }) }),
        "Мөр нэмэх"
      ] }),
      /* @__PURE__ */ jsx("span", { children: checked.length ? `${checked.length} сонгосон` : editable ? "Засах бол нүдэн дээр давхар дарна уу" : "" })
    ] })
  ] });
}
const css = `
.dt-root{--dt-fg:#1f1f1f;--dt-muted:#65656d;--dt-card:#fff;--dt-line:#ededed;--dt-soft:#f6f6f6;--dt-blue:#2f6fed;--dt-sel:#2f6fed14;width:100%;max-width:720px;margin:0 auto;background:var(--dt-card);border:1px solid var(--dt-line);border-radius:12px;color:var(--dt-fg);font:400 13px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;text-align:left;box-shadow:0 1px 2px #00000008;overflow:hidden}
:where(.dark,[data-theme=dark]) .dt-root{--dt-fg:#ececec;--dt-muted:#9a9aa2;--dt-card:#1b1b1e;--dt-line:#2b2b30;--dt-soft:#242428;--dt-blue:#5b8cff;--dt-sel:#5b8cff22;color-scheme:dark}
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
.dt-tag.blue{background:#2f6fed14;color:#2563d8}.dt-tag.violet{background:#8b5cf618;color:#7c3aed}.dt-tag.pink{background:#ec489914;color:#be185d}.dt-tag.green{background:#16a34a14;color:#15803d}.dt-tag.amber{background:#f59e0b18;color:#b45309}.dt-tag.gray{background:#0000000d;color:#555}
:where(.dark,[data-theme=dark]) .dt-tag.gray{background:#ffffff12;color:#bbb}
:where(.dark,[data-theme=dark]) .dt-tag.blue{color:#7cb4ff}:where(.dark,[data-theme=dark]) .dt-tag.violet{color:#b9a2ff}:where(.dark,[data-theme=dark]) .dt-tag.pink{color:#f472b6}:where(.dark,[data-theme=dark]) .dt-tag.green{color:#4ade80}:where(.dark,[data-theme=dark]) .dt-tag.amber{color:#fbbf24}
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
.dt-row{animation:dtrowrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.dt-row:nth-child(1){animation-delay:0ms}.dt-row:nth-child(2){animation-delay:70ms}.dt-row:nth-child(3){animation-delay:140ms}.dt-row:nth-child(4){animation-delay:210ms}.dt-row:nth-child(5){animation-delay:280ms}.dt-row:nth-child(6){animation-delay:350ms}.dt-row:nth-child(7){animation-delay:420ms}.dt-row:nth-child(8){animation-delay:490ms}.dt-row:nth-child(9){animation-delay:560ms}.dt-row:nth-child(10){animation-delay:630ms}.dt-row:nth-child(11){animation-delay:700ms}.dt-row:nth-child(12){animation-delay:770ms}@keyframes dtrowrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.dt-row{animation:none}}
`;
const mn = (n) => new Intl.NumberFormat("en-US").format(Math.abs(n)).replace(/,/g, " ");
const signed = (n) => n > 0 ? `+${mn(n)}` : n < 0 ? `−${mn(n)}` : "0";
const doc = (size = 12) => /* @__PURE__ */ jsx(SourceIcon, { kind: "document", size, tile: false });
const financeReportDemo = {
  company: "ac.me Cargo",
  period: "2026 оны 10-р сар",
  unit: "сая ₮",
  kpis: [
    { label: "Орлого", value: "1 240", delta: "+60 өмнөх сараас", trend: "up", good: true, cite: "2" },
    { label: "Зардал", value: "800", delta: "+86 өмнөх сараас", trend: "up", good: false, cite: "1" },
    { label: "Цэвэр ашиг", value: "440", delta: "−26 өмнөх сараас", trend: "down", good: false, cite: "1" },
    { label: "Мөнгөн үлдэгдэл", value: "1 615", delta: "+230 өмнөх сараас", trend: "up", good: true, cite: "2" }
  ],
  pnl: [
    { id: "rev", line: "Тээврийн орлого", now: 1240, prev: 1180, cite: "[2]" },
    { id: "fuel", line: "Түлш", now: -312, prev: -268, cite: "[4]" },
    { id: "pay", line: "Цалин", now: -285, prev: -280, cite: "[1]" },
    { id: "rep", line: "Засвар үйлчилгээ", now: -96, prev: -54, cite: "[3]" },
    { id: "rent", line: "Агуулахын түрээс", now: -60, prev: -60, cite: "[1]" },
    { id: "oth", line: "Бусад зардал", now: -47, prev: -52, cite: "[1]" },
    { id: "net", line: "Цэвэр ашиг", now: 440, prev: 466, cite: "[1]", total: true }
  ],
  cash: {
    labels: ["5-р", "6-р", "7-р", "8-р", "9-р", "10-р"],
    series: [
      { label: "Орох мөнгө", color: "var(--ts-series-1)", values: [980, 1040, 1110, 1150, 1180, 1240] },
      { label: "Гарах мөнгө", color: "var(--ts-series-2)", values: [760, 780, 820, 850, 890, 1010] }
    ],
    value: "1 615 сая",
    delta: 230
  },
  variance: [
    { text: "Цэвэр ашиг 440 сая төгрөг болж, өмнөх сараас 26 саяар буурсан.", cite: ["1"] },
    { text: " Хоёр ачааны машины их засвар зардлыг 42 саяар нэмсэн.", cite: ["3"] },
    { text: " Түлшний зардал 44 саяар өссөн: литрийн үнэ 4%, маршрутын тоо 6% нэмэгдсэн.", cite: ["4"] },
    { text: " Орлогын 60 саяын өсөлт банкны хуулгатай таарч байна.", cite: ["2"] }
  ],
  sources: [
    { id: "1", title: "Ерөнхий журнал · 10-р сар", site: "Нягтлан бодох бүртгэл", date: "2026.10", quote: "1 284 гүйлгээ, 10-р сарын хаалт. Зардлын нийт дүн 800 сая төгрөг.", highlight: "800 сая", icon: doc() },
    { id: "2", title: "Банкны хуулга · 10-р сар", site: "Банк", date: "2026.10", quote: "Орсон гүйлгээ 1 240 сая, гарсан 1 010 сая; сарын эцсийн үлдэгдэл 1 615 сая.", highlight: "1 240 сая", icon: doc() },
    { id: "3", title: "Засварын нэхэмжлэх №2026-118", site: "Нийлүүлэгч", date: "2026.10.21", quote: "Хоёр ачааны машины хөдөлгүүрийн их засвар, нийт 42 сая төгрөг.", highlight: "их засвар", icon: doc() },
    { id: "4", title: "Түлшний картын тайлан", site: "Түлшний карт", date: "2026.10", quote: "Литрийн дундаж үнэ 4% өссөн, маршрутын тоо 6% нэмэгдсэн.", highlight: "4% өссөн", icon: doc() }
  ],
  steps: [
    { id: "read", tokensIn: 18400, tokensOut: 620, name: "Ерөнхий журнал уншив", kind: "tool", status: "done", detail: "1 284 гүйлгээ", duration: 6200, cost: 420 },
    { id: "bank", tokensIn: 9200, tokensOut: 310, name: "Банкны хуулгатай тулгав", kind: "tool", status: "done", detail: "зөрүү 0", duration: 3400, cost: 260 },
    {
      id: "var",
      tokensIn: 14800,
      tokensOut: 1900,
      name: "Зөрүүг тайлбарлав",
      kind: "agent",
      status: "done",
      detail: "4 эх сурвалж",
      duration: 8100,
      cost: 910,
      children: [
        { id: "inv", tokensIn: 2600, tokensOut: 180, name: "Засварын нэхэмжлэх олов", kind: "tool", status: "done", duration: 1600, cost: 120 },
        { id: "fuelc", tokensIn: 3900, tokensOut: 240, name: "Түлшний картын тайлан уншив", kind: "tool", status: "done", duration: 2200, cost: 150 }
      ]
    },
    { id: "draft", tokensIn: 6100, tokensOut: 2400, name: "Тайлангийн ноорог бичив", kind: "agent", status: "done", detail: "батлалтад илгээв", duration: 4500, cost: 380 }
  ],
  approval: {
    title: "10-р сарын тайланг батлах",
    description: "Агент бэлдсэн — менежер батална",
    details: [
      { label: "Цэвэр ашиг", value: "440 сая ₮" },
      { label: "Өмнөх сараас", value: "−26 сая ₮ (−5.6%)" },
      { label: "Эх сурвалж", value: "4 баримт, бүгд тулгагдсан" }
    ]
  },
  note: "ac.me — жишээ өгөгдөл, бодит харилцагч биш"
};
const CSS = `
.fr{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);display:grid;gap:var(--ts-space-4,16px)}
.fr-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:var(--ts-space-2,8px)}
.fr-head h2{margin:0;font:var(--ts-head-weight,600) 22px/1.2 var(--ts-font-head,var(--ts-font));letter-spacing:-.02em}
.fr-head p{margin:0;color:var(--ts-muted);font-size:13px}
.fr-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--ts-space-3,12px)}
.fr-kpi{background:var(--ts-surface);border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);padding:var(--ts-space-3,12px) var(--ts-space-4,16px);display:grid;gap:4px}
.fr-kpi small{font:500 11px/1.3 var(--ts-font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.fr-kpi b{font:var(--ts-head-weight,600) 28px/1.1 var(--ts-font-head,var(--ts-font));font-variant-numeric:tabular-nums}
.fr-kpi span{font-size:12px;color:var(--ts-muted);font-variant-numeric:tabular-nums}
.fr-kpi span[data-good=true]{color:var(--ts-status-done-fg)}.fr-kpi span[data-good=false]{color:var(--ts-status-error-fg)}
.fr-kpi sup{font-size:10px;color:var(--ts-electric-fg);margin-left:2px}
.fr-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:var(--ts-space-4,16px);align-items:start}
.fr-row>*{min-width:0;max-width:none}
.fr-wide{min-width:0}
.fr-note{margin:0;font:500 11px/1.4 var(--ts-font-mono);color:var(--ts-faint)}
@media (max-width:860px){.fr-row{grid-template-columns:minmax(0,1fr)}}
`;
function FinanceReport({ theme, className = "", ...data }) {
  const d = { ...financeReportDemo, ...data };
  const dark = theme === "dark";
  const columns = [
    { key: "line", label: "Мөр", type: "title", width: "2.8fr" },
    { key: "now", label: `${d.period.replace(/^\d+ оны /, "")}, ${d.unit}`, type: "number", format: signed },
    { key: "prev", label: "Өмнөх сар", type: "number", format: signed },
    { key: "diff", label: "Зөрүү", type: "number", format: signed },
    { key: "cite", label: "Эх", type: "tag", width: "0.7fr" }
  ];
  const rows = d.pnl.map((l) => ({ id: l.id, line: l.line, now: l.now, prev: l.prev, diff: l.now - l.prev, cite: l.cite }));
  const tagTones = Object.fromEntries(d.pnl.map((l) => [l.cite, "blue"]));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `fr ${dark ? "dark" : ""} ${className}`,
      "data-ts-theme": theme ? dark ? "dark" : "cream" : void 0,
      "data-theme": theme,
      children: [
        /* @__PURE__ */ jsx("style", { children: CSS }),
        /* @__PURE__ */ jsxs("header", { className: "fr-head", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h2", { children: [
              "Санхүүгийн тайлан · ",
              d.period
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              d.company,
              " · Агент эх өгөгдлөөс бэлдсэн, тоо бүр эх сурвалжтай"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "fr-note", children: d.note })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "fr-kpis", "aria-label": "Гол үзүүлэлт", children: d.kpis.map((k) => /* @__PURE__ */ jsxs("div", { className: "fr-kpi", children: [
          /* @__PURE__ */ jsxs("small", { children: [
            k.label,
            ", ",
            d.unit
          ] }),
          /* @__PURE__ */ jsxs("b", { children: [
            k.value,
            k.cite && /* @__PURE__ */ jsxs("sup", { children: [
              "[",
              k.cite,
              "]"
            ] })
          ] }),
          k.delta && /* @__PURE__ */ jsxs("span", { "data-trend": k.trend, "data-good": k.good === void 0 ? void 0 : String(k.good), children: [
            k.trend === "up" ? "▲ " : k.trend === "down" ? "▼ " : "",
            k.delta
          ] })
        ] }, k.label)) }),
        /* @__PURE__ */ jsxs("div", { className: "fr-row", children: [
          /* @__PURE__ */ jsx(DataTable, { title: "Ашиг, алдагдлын тайлан", columns, rows, tagTones, editable: false }),
          /* @__PURE__ */ jsx(CitedAnswer, { segments: d.variance, sources: d.sources, theme })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "fr-row", children: [
          /* @__PURE__ */ jsx(KPIChart, { title: "Мөнгөн урсгал · үлдэгдэл", value: d.cash.value, delta: d.cash.delta, labels: d.cash.labels, tooltipLabels: d.cash.labels.map((l) => `${l} сар`), series: d.cash.series, format: (n) => mn(n), footer: "Орох ба гарах мөнгө, сүүлийн 6 сар, сая ₮" }),
          /* @__PURE__ */ jsx(ApprovalCard, { title: d.approval.title, description: d.approval.description, risk: "medium", details: d.approval.details })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "fr-wide", children: /* @__PURE__ */ jsx(CashRiver, { ...cashRiverDemo, title: "Мөнгөний гол · 10-р сар" }) }),
        /* @__PURE__ */ jsx("div", { className: "fr-wide", children: /* @__PURE__ */ jsx(CostWaterfall, { title: "Агент тайланг хэрхэн бэлдсэн", task: `Санхүүгийн тайлан · ${d.period}`, steps: d.steps, status: "done", defaultCollapsed: [], formatCost: (n) => `${mn(n)} ₮` }) })
      ]
    }
  );
}
const financeReport = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FinanceReport,
  financeReportDemo
}, Symbol.toStringTag, { value: "Module" }));
export {
  DataTable as D,
  FinanceReport as F,
  financeReport as a,
  financeReportDemo as f
};
//# sourceMappingURL=finance-report-D1-QQdVK.js.map
