import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };
const statusIcons = {
  "Нөөцөд": /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...stroke, children: /* @__PURE__ */ jsx("path", { d: "M2.5 9.5 4 4h8l1.5 5.5V12a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1Z M2.5 9.5h3.2l.8 1.2h3l.8-1.2h3.2" }) }),
  "Хийх": /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...stroke, children: /* @__PURE__ */ jsx("rect", { x: "2.8", y: "2.8", width: "10.4", height: "10.4", rx: "2" }) }),
  "Хийгдэж байна": /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", ...stroke, style: { color: "#4f8ef7" }, children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "M8 5v3l2 1.3" })
  ] }),
  "Хянагдаж байна": /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", ...stroke, style: { color: "#5b5bd6" }, children: [
    /* @__PURE__ */ jsx("path", { d: "M1.8 8S4 3.8 8 3.8 14.2 8 14.2 8 12 12.2 8 12.2 1.8 8 1.8 8Z" }),
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "1.8" })
  ] }),
  "Дууссан": /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("rect", { x: "2.5", y: "2.5", width: "11", height: "11", rx: "2.2", fill: "#2f7cf6" }),
    /* @__PURE__ */ jsx("path", { d: "m5.3 8.2 1.8 1.8 3.6-3.8", fill: "none", stroke: "#fff", strokeWidth: "1.5", strokeLinecap: "round" })
  ] }),
  "Цуцалсан": /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", ...stroke, children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "m4.2 11.8 7.6-7.6" })
  ] })
};
const statuses = ["Нөөцөд", "Хийх", "Хийгдэж байна", "Хянагдаж байна", "Дууссан", "Цуцалсан"];
const priorities = ["Яаралтай", "Өндөр", "Дунд", "Бага", "Тодорхойгүй"];
const matrix = [
  [3, 6, 6, 8, 3],
  [1, 7, 12, 11, 5],
  [1, 9, 12, 7, 5],
  [0, 1, 6, 4, 2],
  [7, 14, 23, 25, 27],
  [0, 1, 3, 1, 2]
];
const people = ["Анар", "Бат", "Чимэг", "Дулам"];
const types = ["Шинэ боломж", "Алдаа", "Ажил"];
const defaultRecords = (() => {
  const out = [];
  let n = 0;
  matrix.forEach(
    (row, si) => row.forEach((c, pi) => {
      for (let i = 0; i < c; i++, n++)
        out.push({ status: statuses[si], priority: priorities[pi], assignee: people[n % 4], type: types[n * 7 % 3], points: [1, 2, 3, 5, 8][n * 3 % 5] });
    })
  );
  return out;
})();
const defaultDimensions = [
  { key: "status", label: "Төлөв", values: statuses, icons: statusIcons },
  { key: "priority", label: "Ач холбогдол", values: priorities, colors: { "Яаралтай": "#e5484d", "Өндөр": "#e8a20c", "Дунд": "#3b82f6", "Бага": "#a9c8f5", "Тодорхойгүй": "#d9d9de" } },
  { key: "assignee", label: "Хариуцагч", values: people },
  { key: "type", label: "Төрөл", values: types }
];
const defaultMeasures = [
  { key: "count", label: "Даалгаврын тоо", unit: "даалгавар" },
  { key: "points", label: "Оноо", unit: "оноо", field: "points" }
];
const palette = ["#3b82f6", "#e8a20c", "#16a34a", "#a855f7", "#e5484d", "#14b8a6"];
function Picker({ label, value, options, onChange }) {
  const id = React.useId();
  return /* @__PURE__ */ jsxs("label", { className: "bc-pick", htmlFor: id, children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsxs("span", { className: "bc-sel", children: [
      /* @__PURE__ */ jsx("select", { id, value, onChange: (e) => onChange(e.target.value), children: options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value)) }),
      /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m4.5 6.5 3.5 3.5 3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) })
    ] })
  ] });
}
function BreakdownChart({
  records = defaultRecords,
  dimensions = defaultDimensions,
  measures = defaultMeasures,
  title = "Спринт 24",
  defaultMeasure,
  defaultSlice,
  defaultSegment,
  className = ""
}) {
  const [mKey, setM] = React.useState(defaultMeasure ?? measures[0]?.key);
  const [sKey, setS] = React.useState(defaultSlice ?? dimensions[0]?.key);
  const [gKey, setG] = React.useState(defaultSegment ?? dimensions[1]?.key ?? "none");
  const [hidden, setHidden] = React.useState(/* @__PURE__ */ new Set());
  const [hot, setHot] = React.useState(null);
  const measure = measures.find((m) => m.key === mKey) ?? measures[0];
  const slice = dimensions.find((d) => d.key === sKey) ?? dimensions[0];
  const seg = dimensions.find((d) => d.key === gKey && d.key !== slice.key);
  const segValues = seg ? seg.values : ["Бүгд"];
  const colorOf = (v, i) => seg?.colors?.[v] ?? (seg ? palette[i % palette.length] : "#3b82f6");
  const val = (r) => measure.field ? Number(r[measure.field]) || 0 : 1;
  const table = slice.values.map((sv) => {
    const rs = records.filter((r) => String(r[slice.key]) === sv);
    const parts = segValues.map((gv) => rs.filter((r) => !seg || String(r[seg.key]) === gv).reduce((n, r) => n + val(r), 0));
    return { key: sv, parts, total: parts.reduce((a, b) => a + b, 0) };
  });
  const grand = table.reduce((n, r) => n + r.total, 0);
  const visTotal = (r) => r.parts.reduce((n, p, i) => n + (hidden.has(segValues[i]) ? 0 : p), 0);
  const peak = Math.max(1, ...table.map(visTotal));
  const step = Math.max(5, Math.ceil(peak / 5 / 5) * 5);
  const top = step * 5;
  const ticks = [5, 4, 3, 2, 1, 0].map((i) => i * step);
  const toggle = (v) => setHidden((s) => {
    const n = new Set(s);
    if (n.has(v)) n.delete(v);
    else n.add(v);
    return n;
  });
  const segOpts = [{ value: "none", label: "Үгүй" }, ...dimensions.filter((d) => d.key !== slice.key).map((d) => ({ value: d.key, label: d.label }))];
  return /* @__PURE__ */ jsxs("section", { className: `bc ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "bc-head", children: [
      /* @__PURE__ */ jsx("h3", { children: title }),
      /* @__PURE__ */ jsxs("span", { className: "bc-total", children: [
        /* @__PURE__ */ jsx("b", { children: grand }),
        " ",
        measure.unit ?? ""
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-picks", children: [
      /* @__PURE__ */ jsx(Picker, { label: "Хэмжүүр", value: measure.key, options: measures.map((m) => ({ value: m.key, label: m.label })), onChange: setM }),
      /* @__PURE__ */ jsx(Picker, { label: "Ангилал", value: slice.key, options: dimensions.map((d) => ({ value: d.key, label: d.label })), onChange: (v) => {
        setS(v);
        if (v === gKey) setG("none");
      } }),
      /* @__PURE__ */ jsx(Picker, { label: "Хэсэглэх", value: seg ? seg.key : "none", options: segOpts, onChange: setG })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-plot", children: [
      /* @__PURE__ */ jsxs("div", { className: "bc-area", children: [
        ticks.map((t) => /* @__PURE__ */ jsx("span", { className: "bc-grid", style: { bottom: `${t / top * 100}%` } }, t)),
        /* @__PURE__ */ jsx("div", { className: "bc-bars", children: table.map((r) => {
          const t = visTotal(r);
          return /* @__PURE__ */ jsxs("div", { className: "bc-col", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "bc-bar",
                "aria-label": `${r.key}: ${t} ${measure.unit ?? ""}`,
                onMouseEnter: () => setHot(r.key),
                onMouseLeave: () => setHot(null),
                onFocus: () => setHot(r.key),
                onBlur: () => setHot(null),
                style: { height: `${t / top * 100}%` },
                children: r.parts.map(
                  (p, i) => hidden.has(segValues[i]) || p === 0 ? null : /* @__PURE__ */ jsx("span", { style: { flexGrow: p, background: colorOf(segValues[i], i) } }, i)
                )
              }
            ),
            hot === r.key && /* @__PURE__ */ jsxs("div", { className: "bc-tip", role: "tooltip", children: [
              /* @__PURE__ */ jsxs("strong", { children: [
                r.key,
                /* @__PURE__ */ jsx("b", { children: t })
              ] }),
              seg && r.parts.map((p, i) => hidden.has(segValues[i]) ? null : /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx("i", { style: { background: colorOf(segValues[i], i) } }),
                segValues[i],
                /* @__PURE__ */ jsx("b", { children: p })
              ] }, i))
            ] })
          ] }, r.key);
        }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bc-y", children: ticks.map((t) => /* @__PURE__ */ jsx("span", { style: { bottom: `${t / top * 100}%` }, children: t }, t)) }),
      /* @__PURE__ */ jsx("div", { className: "bc-x", children: table.map((r) => /* @__PURE__ */ jsx("span", { title: r.key, className: hot === r.key ? "is-hot" : "", children: slice.icons?.[r.key] ?? /* @__PURE__ */ jsx("em", { children: r.key }) }, r.key)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bc-table-wrap", children: /* @__PURE__ */ jsxs("table", { className: "bc-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: slice.label }),
        /* @__PURE__ */ jsx("th", { className: "num", children: measure.label }),
        seg && segValues.map((v, i) => /* @__PURE__ */ jsxs("th", { className: "num", children: [
          /* @__PURE__ */ jsx("i", { style: { background: colorOf(v, i) } }),
          v
        ] }, v))
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: table.map((r) => /* @__PURE__ */ jsxs("tr", { className: hot === r.key ? "is-hot" : "", onMouseEnter: () => setHot(r.key), onMouseLeave: () => setHot(null), children: [
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("span", { className: "bc-name", children: [
          slice.icons?.[r.key] && /* @__PURE__ */ jsx("span", { className: "bc-ico", children: slice.icons[r.key] }),
          r.key
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "num", children: r.total }),
        seg && r.parts.map((p, i) => /* @__PURE__ */ jsx("td", { className: "num", children: p }, i))
      ] }, r.key)) })
    ] }) }),
    seg && /* @__PURE__ */ jsx("div", { className: "bc-legend", children: segValues.map((v, i) => /* @__PURE__ */ jsxs("button", { type: "button", "aria-pressed": !hidden.has(v), onClick: () => toggle(v), children: [
      /* @__PURE__ */ jsx("i", { style: { background: colorOf(v, i) } }),
      v
    ] }, v)) })
  ] });
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
@media(max-width:560px){.bc-picks{grid-template-columns:minmax(0,1fr)}.bc-table{font-size:12.5px}}
@media(prefers-reduced-motion:reduce){.bc *{transition:none!important}}
.bc-col{animation:bccolrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.bc-col:nth-child(1){animation-delay:0ms}.bc-col:nth-child(2){animation-delay:70ms}.bc-col:nth-child(3){animation-delay:140ms}.bc-col:nth-child(4){animation-delay:210ms}.bc-col:nth-child(5){animation-delay:280ms}.bc-col:nth-child(6){animation-delay:350ms}.bc-col:nth-child(7){animation-delay:420ms}.bc-col:nth-child(8){animation-delay:490ms}.bc-col:nth-child(9){animation-delay:560ms}.bc-col:nth-child(10){animation-delay:630ms}.bc-col:nth-child(11){animation-delay:700ms}.bc-col:nth-child(12){animation-delay:770ms}@keyframes bccolrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.bc-col{animation:none}}
`;
export {
  BreakdownChart as B
};
//# sourceMappingURL=breakdown-chart-Zy4yxOg5.js.map
