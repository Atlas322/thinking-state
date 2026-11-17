import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const baseLabels = {
  needsYou: "Таны ээлж",
  later: "Дараа",
  show: "Харах",
  recommended: "Санал болгосон",
  approve: "Батлах",
  decline: "Татгалзах",
  own: "Өөр хариулт…",
  waiting: (n) => `${n} шийдвэр хүлээж байна`,
  of: (i, n) => `${i}/${n}`,
  close: "Хаах",
  closeReason: "Яагаад хаах вэ? (заавал биш)",
  confirmClose: "Хаах",
  cancel: "Болих"
};
const defaultDecisions = [
  {
    id: "weekly",
    kind: "approval",
    task: "Долоо хоногийн тайлан",
    question: "Долоо хоногийн тайланг Хойд салхи ХХК руу илгээх үү?",
    facts: [
      { label: "Хэнд", value: "Дулмаа Рэнцэн, Хойд салхи ХХК" },
      { label: "Гарчиг", value: "45-р долоо хоног: өгөгдөл татах ажил эхэлсэн, самбар хянагдаж байна" },
      { label: "Агуулга", value: "Өгөгдөл татах үйлчилгээ туршилтын орчинд ажиллаж, мягмар гарагийн оргил ачааллыг нэг ч үйл явдал алдалгүй даалаа. Самбарыг Дулмаагийн баг хянаж байна." }
    ]
  }
];
function DecisionCard({
  decisions = defaultDecisions,
  onDecide,
  onLater,
  defaultFolded = false,
  reveal,
  labels: labelsProp,
  className = "",
  host = false,
  busy = false,
  error,
  meta,
  onClose
}) {
  const L = { ...baseLabels, ...labelsProp };
  const [answered, setAnswered] = React.useState([]);
  const open = decisions.filter((d2) => !answered.includes(d2.id));
  const [page, setPage] = React.useState(0);
  const [folded, setFolded] = React.useState(defaultFolded);
  const [focus, setFocus] = React.useState(0);
  const [text, setText] = React.useState("");
  const [said, setSaid] = React.useState("");
  const [pulse, setPulse] = React.useState(0);
  const [closing, setClosing] = React.useState(false);
  const rowsRef = React.useRef([]);
  const fieldRef = React.useRef(null);
  const showRef = React.useRef(null);
  const qid = React.useId();
  const idx = Math.min(page, Math.max(0, open.length - 1));
  const d = open[idx];
  React.useEffect(() => {
    if (reveal === void 0) return;
    setFolded(false);
    setPulse((p) => p + 1);
    window.setTimeout(() => rowsRef.current[focus]?.focus(), 30);
  }, [reveal]);
  const rows = !d ? [] : d.kind === "approval" ? [
    { key: "approve", title: L.approve, answer: "approve" },
    { key: "decline", title: L.decline, answer: "decline" }
  ] : (d.options ?? []).map((o) => ({ key: o.id, title: o.title, summary: o.summary, recommended: o.recommended, answer: { option: o.id } }));
  const answer = (a) => {
    if (!d || busy) return;
    if (host) {
      setText("");
      onDecide?.(d.id, a);
      return;
    }
    const left = open.length - 1;
    const what = a === "approve" ? L.approve : a === "decline" ? L.decline : "text" in a ? a.text : rows.find((r) => typeof r.answer === "object" && "option" in r.answer && r.answer.option === a.option)?.title;
    setAnswered((s) => [...s, d.id]);
    setText("");
    setFocus(0);
    setSaid(left ? `Хариулт бүртгэгдлээ: ${what}. ${L.waiting(left)}.` : "Хариулт бүртгэгдлээ");
    onDecide?.(d.id, a);
    window.setTimeout(() => left ? rowsRef.current[0]?.focus() : void 0, 30);
  };
  const later = () => {
    if (!d) return;
    setFolded(true);
    setSaid(`${L.later}. ${L.waiting(open.length)}.`);
    onLater?.(d.id);
    window.setTimeout(() => showRef.current?.focus(), 30);
  };
  const n = rows.length;
  const move = (to) => {
    const t = Math.max(0, Math.min(n, to));
    setFocus(t);
    (t === n ? fieldRef.current : rowsRef.current[t])?.focus();
  };
  const onKey = (e) => {
    const inField = e.target === fieldRef.current;
    if (e.key === "Escape") {
      e.preventDefault();
      later();
      return;
    }
    if (!inField && /^[1-5]$/.test(e.key)) {
      const k = Number(e.key) - 1;
      if (k < n) answer(rows[k].answer);
      else if (k === n) move(n);
      e.preventDefault();
      return;
    }
    if (inField) {
      if (e.key === "ArrowUp" && !text) {
        e.preventDefault();
        move(n - 1);
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowRight") e.preventDefault(), move(focus + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") e.preventDefault(), move(focus - 1);
    else if (e.key === "Home") e.preventDefault(), move(0);
    else if (e.key === "End") e.preventDefault(), move(n - 1);
    else if ((e.key === "Enter" || e.key === " ") && focus < n) e.preventDefault(), answer(rows[focus].answer);
  };
  if (!open.length)
    return /* @__PURE__ */ jsxs("div", { className: `dc dc-gone ${className}`, children: [
      /* @__PURE__ */ jsx("style", { children: css$2 }),
      /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", className: "dc-sr", children: said })
    ] });
  if (folded)
    return /* @__PURE__ */ jsxs("div", { className: `dc ${className}`, children: [
      /* @__PURE__ */ jsx("style", { children: css$2 }),
      /* @__PURE__ */ jsxs("div", { className: "dc-folded", children: [
        /* @__PURE__ */ jsx("span", { className: "dc-pill", children: L.needsYou }),
        /* @__PURE__ */ jsx("span", { children: L.waiting(open.length) }),
        /* @__PURE__ */ jsx("span", { className: "dc-dot", children: "·" }),
        /* @__PURE__ */ jsx("button", { ref: showRef, type: "button", className: "dc-link", onClick: () => {
          setFolded(false);
          window.setTimeout(() => rowsRef.current[0]?.focus(), 30);
        }, children: L.show })
      ] }),
      /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", className: "dc-sr", children: said })
    ] });
  const isPick = d.kind === "pick";
  return /* @__PURE__ */ jsxs("div", { className: `dc ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css$2 }),
    /* @__PURE__ */ jsxs("section", { className: "dc-card", "data-pulse": pulse > 0, role: "group", "aria-labelledby": qid, onKeyDown: onKey, children: [
      /* @__PURE__ */ jsxs("header", { className: "dc-head", children: [
        /* @__PURE__ */ jsx("span", { className: "dc-pill", children: L.needsYou }),
        d.task && /* @__PURE__ */ jsx("span", { className: "dc-task", children: d.task }),
        /* @__PURE__ */ jsx("span", { className: "dc-spacer" }),
        open.length > 1 && /* @__PURE__ */ jsxs("span", { className: "dc-pager", children: [
          /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Өмнөх шийдвэр", disabled: idx === 0, onClick: () => setPage(idx - 1), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m10 4-4 4 4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }) }),
          L.of(idx + 1, open.length),
          /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Дараах шийдвэр", disabled: idx === open.length - 1, onClick: () => setPage(idx + 1), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m6 4 4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }) })
        ] }),
        onClose && !closing && /* @__PURE__ */ jsx("button", { type: "button", className: "dc-later", disabled: busy, onClick: () => {
          setClosing(true);
          window.setTimeout(() => fieldRef.current?.focus(), 30);
        }, children: L.close }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "dc-later", "aria-keyshortcuts": "Escape", disabled: busy, onClick: later, children: L.later })
      ] }),
      /* @__PURE__ */ jsx("h3", { id: qid, className: "dc-q", "data-full": host || void 0, children: d.question }),
      meta && /* @__PURE__ */ jsx("div", { className: "dc-meta", children: meta }),
      d.facts && /* @__PURE__ */ jsx("dl", { className: "dc-facts", children: d.facts.map((f) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsx("dt", { children: f.label }),
        /* @__PURE__ */ jsx("dd", { children: f.value })
      ] }, f.label)) }),
      /* @__PURE__ */ jsx("div", { className: isPick ? "dc-tiles" : "dc-rows", role: "listbox", "aria-labelledby": qid, children: rows.map((r, i) => {
        const opt = d.options?.find((o) => o.id === r.key);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            ref: (el) => {
              rowsRef.current[i] = el;
            },
            role: "option",
            "aria-selected": focus === i,
            "aria-keyshortcuts": String(i + 1),
            tabIndex: focus === i ? 0 : -1,
            "aria-disabled": busy || void 0,
            className: isPick ? "dc-tile" : "dc-row",
            onFocus: () => setFocus(i),
            onClick: () => answer(r.answer),
            children: [
              isPick && opt?.preview && /* @__PURE__ */ jsx("div", { className: "dc-preview", children: opt.preview }),
              /* @__PURE__ */ jsx("span", { className: "dc-num", "aria-hidden": "true", children: i + 1 }),
              /* @__PURE__ */ jsxs("span", { className: "dc-body", children: [
                /* @__PURE__ */ jsxs("span", { className: "dc-title", children: [
                  r.title,
                  r.recommended && /* @__PURE__ */ jsx("span", { className: "dc-rec", children: L.recommended })
                ] }),
                r.summary && /* @__PURE__ */ jsx("span", { className: "dc-sum", children: r.summary })
              ] })
            ]
          },
          r.key
        );
      }) }),
      /* @__PURE__ */ jsxs("label", { className: "dc-row dc-own", children: [
        /* @__PURE__ */ jsx("span", { className: "dc-num", "aria-hidden": "true", children: n + 1 }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fieldRef,
            value: text,
            "aria-label": L.own.replace("…", ""),
            "aria-keyshortcuts": String(n + 1),
            placeholder: closing ? L.closeReason : L.own,
            onFocus: () => setFocus(n),
            onChange: (e) => setText(e.target.value),
            onKeyDown: (e) => {
              if (e.key !== "Enter") return;
              if (closing) {
                e.preventDefault();
                if (!busy && d) onClose?.(d.id, text.trim());
              } else if (text.trim()) {
                e.preventDefault();
                answer({ text: text.trim() });
              }
            }
          }
        ),
        !closing && text.trim() && /* @__PURE__ */ jsx("button", { type: "button", className: "dc-send", "aria-label": "Хариулт илгээх", onClick: () => answer({ text: text.trim() }), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 13V3.5M4 7.5l4-4 4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
      ] }),
      closing && /* @__PURE__ */ jsxs("div", { className: "dc-closebar", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "dc-danger", disabled: busy, onClick: () => d && onClose?.(d.id, text.trim()), children: L.confirmClose }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "dc-later", onClick: () => setClosing(false), children: L.cancel })
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "dc-error", role: "alert", children: error })
    ] }, `${d.id}-${pulse}`),
    /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", className: "dc-sr", children: said })
  ] });
}
const css$2 = `
.dc,.dc-demo{--dc-bg:#fff;--dc-fg:#18181b;--dc-muted:#65656d;--dc-faint:#65656d;--dc-line:#ececef;--dc-soft:#f4f4f5;--dc-hl:#f6f6f7;--dc-accent:#4f7cf0;--dc-amber:#9a4f0c;--dc-amber-bg:#fdefdc;--dc-red:#dc2626;font:400 12.5px/1.45 Inter,system-ui,sans-serif;color:var(--dc-fg)}
:where(.dark,[data-theme=dark]) :is(.dc,.dc-demo){--dc-bg:#1b1b1e;--dc-fg:#ececef;--dc-muted:#a1a1aa;--dc-faint:#9a9aa2;--dc-line:#2c2c31;--dc-soft:#28282d;--dc-hl:#232327;--dc-accent:#7c9cff;--dc-amber:#eba659;--dc-amber-bg:#3a2a16;--dc-red:#f87171;color-scheme:dark}
.dc{width:100%}.dc *,.dc-demo *{box-sizing:border-box}.dc button{font:inherit;color:inherit;cursor:pointer}
.dc-card{background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:var(--ts-radius,12px);box-shadow:0 1px 2px #0000000a,0 4px 14px -6px #0000001a;padding:10px 12px 10px;animation:dc-in .25s both}
.dc-card[data-pulse=true]{animation:dc-pulse .7s both}
.dc-head{display:flex;align-items:center;gap:8px;font-size:12px}
.dc-pill{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:var(--ts-radius,5px);background:var(--dc-amber-bg);color:var(--dc-amber);font-size:11px;font-weight:500;white-space:nowrap}
.dc-task{color:var(--dc-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dc-spacer{flex:1}
.dc-later{border:0;background:none;padding:2px 4px;border-radius:var(--ts-radius,5px);font-size:12px}.dc-later:hover{background:var(--dc-hl)}
.dc-pager{display:inline-flex;align-items:center;gap:2px;color:var(--dc-muted);font-size:12px}
.dc-pager button{display:grid;place-items:center;width:22px;height:22px;border:0;border-radius:var(--ts-radius,5px);background:none}.dc-pager button:hover:not(:disabled){background:var(--dc-hl)}.dc-pager button:disabled{opacity:.35;cursor:default}.dc-pager svg{width:13px;height:13px}
.dc-q{margin:12px 0 8px;font-size:14px;font-weight:500;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dc-q[data-full=true]{display:block;-webkit-line-clamp:none;overflow:visible;white-space:pre-wrap}
.dc-meta{display:flex;flex-wrap:wrap;align-items:center;gap:2px 10px;margin:-2px 0 8px;color:var(--dc-muted);font-size:11.5px}.dc-meta a,.dc-meta button{color:var(--dc-accent);border:0;background:none;padding:0;text-decoration:none}.dc-meta a:hover,.dc-meta button:hover{text-decoration:underline}
.dc-closebar{display:flex;align-items:center;gap:8px;margin-top:6px}
.dc-danger{border:0;border-radius:var(--ts-radius,6px);padding:3px 10px;background:var(--dc-red);color:#fff!important;font-size:12px;font-weight:500}
.dc-error{margin:6px 0 0;color:var(--dc-red);font-size:12px}
.dc [aria-disabled=true],.dc button:disabled{opacity:.5;cursor:default}
.dc-facts{display:grid;grid-template-columns:auto 1fr;gap:3px 20px;margin:0 0 8px}
.dc-facts dt{color:var(--dc-muted)}.dc-facts dd{margin:0;min-width:0;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
.dc-rows{display:flex;flex-direction:column;margin:0 -6px}
.dc-row{display:flex;align-items:center;gap:10px;min-height:36px;padding:4px 6px;border-radius:var(--ts-radius,8px);cursor:pointer;outline:none;transition:background .12s}
.dc-rows .dc-row:hover,.dc-rows .dc-row:focus-visible{background:var(--dc-hl)}
.dc-rows .dc-row:focus-visible{box-shadow:inset 0 0 0 1.5px var(--dc-accent)}
.dc-num{display:grid;place-items:center;flex:none;width:22px;height:22px;border-radius:var(--ts-radius,5px);background:var(--dc-soft);color:var(--dc-muted);font-size:11.5px;font-variant-numeric:tabular-nums}
.dc-body{display:flex;flex-direction:column;min-width:0}
.dc-title{display:flex;align-items:center;gap:8px}
.dc-rec{height:17px;padding:0 5px;border-radius:var(--ts-radius,4px);background:color-mix(in srgb,var(--dc-accent) 12%,transparent);color:color-mix(in srgb,var(--dc-accent) 65%,var(--dc-fg));font-size:10.5px;font-weight:500;line-height:17px}
.dc-sum{color:var(--dc-muted);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dc-own{margin:4px -6px 0;cursor:text}
.dc-own input{flex:1;min-width:0;height:28px;border:0;background:none;outline:none;color:var(--dc-fg);font:inherit;border-bottom:1px solid transparent}
.dc-own input::placeholder{color:var(--dc-faint)}.dc-own input:focus{border-bottom-color:var(--dc-line)}
.dc-send{display:grid;place-items:center;width:26px;height:26px;border:0;border-radius:var(--ts-radius,7px);background:var(--dc-fg);color:var(--dc-bg)!important}.dc-send svg{width:13px;height:13px}
.dc-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.dc-tile{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;padding:8px;border:1px solid var(--dc-line);border-radius:var(--ts-radius,9px);cursor:pointer;outline:none}
.dc-tile:hover,.dc-tile:focus-visible{border-color:var(--dc-accent)}
.dc-preview{grid-column:1/-1;aspect-ratio:16/10;border-radius:var(--ts-radius,6px);background:var(--dc-soft);overflow:hidden}
.dc-folded{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:var(--ts-radius,12px);color:var(--dc-muted);font-size:12.5px;animation:dc-in .2s both}
.dc-dot{color:var(--dc-faint)}.dc-link{border:0;background:none;padding:0;color:var(--dc-fg)!important;font-weight:500}
.dc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.dc :focus-visible{outline:2px solid var(--dc-accent);outline-offset:2px}.dc .dc-row:focus-visible{outline:none}
.dc-demo{width:100%;max-width:600px;display:flex;flex-direction:column;gap:8px}
.dc-status{display:flex;align-items:center;gap:8px;margin:0 0 4px 12px;color:var(--dc-muted)}.dc-status svg{width:18px;height:18px}
.dc-composer{background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:var(--ts-radius,12px);padding:14px 10px 10px 14px}
.dc-ph{color:var(--dc-faint);height:40px}
.dc-tools{display:flex;align-items:center;gap:12px;color:var(--dc-muted)}.dc-tools svg{width:15px;height:15px;display:block}
.dc-req,.dc-auto{display:inline-flex;align-items:center;gap:6px}.dc-auto{color:var(--dc-fg)}.dc-auto svg{width:12px;height:12px;color:var(--dc-faint)}
.dc-sendbox{display:grid;place-items:center;width:28px;height:28px;border-radius:var(--ts-radius,7px);background:var(--dc-soft);color:var(--dc-faint)}
@keyframes dc-in{from{opacity:0;transform:translateY(4px)}}
@keyframes dc-pulse{0%{background:var(--dc-soft)}100%{background:var(--dc-bg)}}
@media(max-width:420px){.dc-tiles{grid-template-columns:minmax(0,1fr)}.dc-preview{display:none}}
@media(hover:none){.dc-row{min-height:44px}}
@media(prefers-reduced-motion:reduce){.dc *,.dc-card{animation:none!important;transition:none!important}}
`;
const defaultLabels = {
  title: "Арын даалгаврууд",
  running: "ажиллаж байна",
  needsYou: "хүний ээлж",
  needsYouOne: "хүний ээлж",
  needsYouBadge: "Хүний ээлж",
  paused: "Түр зогссон",
  pausedCount: "түр зогссон",
  done: "Дууссан",
  pause: "Түр зогсоох",
  resume: "Үргэлжлүүлэх",
  open: "Нээх",
  openAll: "Бүх даалгаврыг нээх",
  empty: "Ажиллаж буй зүйл алга",
  idle: "Ажиллаж буй даалгавар алга"
};
const defaultTasks = [
  { id: "ingest", title: "Өгөгдөл оруулах урсгал", step: "Хэсгүүдийг вектор болгож байна", done: 2, total: 4, state: "running" },
  { id: "refund", title: "Буцаалтын хяналт", step: "Буцаалт батлахыг хүлээж байна", done: 3, total: 5, state: "needs-you" },
  { id: "seo", title: "SEO шалгалт", step: "214 хуудас уншиж байна", done: 1, total: 6, state: "running" },
  { id: "digest", title: "Долоо хоногийн тойм", step: "Хураангуйн ноорог бичиж байна", done: 2, total: 5, state: "running" }
];
const ringColor = (t) => {
  if (t.state === "done") return "var(--rn-blue)";
  const p = t.done / Math.max(1, t.total);
  return p < 0.34 ? "var(--rn-orange)" : p < 0.67 ? "var(--rn-amber)" : "var(--rn-teal)";
};
function Ring({ task }) {
  const p = task.state === "done" ? 1 : task.done / Math.max(1, task.total);
  const r = 5;
  const c = 2 * Math.PI * r;
  return /* @__PURE__ */ jsxs("svg", { className: "rn-ring", viewBox: "0 0 16 16", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "6.5", fill: "none", stroke: "var(--rn-line)", strokeWidth: "1" }),
    /* @__PURE__ */ jsx(
      "circle",
      {
        cx: "8",
        cy: "8",
        r,
        fill: "none",
        stroke: ringColor(task),
        strokeWidth: "3",
        strokeDasharray: `${c * p} ${c}`,
        transform: "rotate(-90 8 8)",
        style: { transition: "stroke-dasharray .5s, stroke .5s" }
      }
    )
  ] });
}
function RunningNow({
  tasks: tasksProp,
  onPause,
  onResume,
  onOpen,
  onOpenAll,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  align = "end",
  labels: labelsProp,
  brand,
  className = ""
}) {
  const L = { ...defaultLabels, ...labelsProp };
  const [own, setOwn] = React.useState(tasksProp ?? defaultTasks);
  const tasks = tasksProp ?? own;
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp ?? openState;
  const [announce, setAnnounce] = React.useState("");
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const rowRefs = React.useRef([]);
  const popId = React.useId();
  const setOpen = (v) => {
    setOpenState(v);
    onOpenChange?.(v);
  };
  React.useEffect(() => {
    if (tasksProp) return;
    const id = window.setInterval(() => {
      setOwn(
        (ts) => ts.map((t) => {
          if (t.state !== "running") return t;
          const done = t.done + 1;
          if (done >= t.total) {
            setAnnounce(`${t.title} дууслаа`);
            return { ...t, done: t.total, state: "done", step: "Дууссан" };
          }
          return { ...t, done };
        })
      );
    }, 7e3);
    return () => window.clearInterval(id);
  }, [tasksProp]);
  React.useEffect(() => {
    if (!open) return;
    const down = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [open]);
  const running = tasks.filter((t) => t.state === "running").length;
  const waiting = tasks.filter((t) => t.state === "needs-you").length;
  const paused = tasks.filter((t) => t.state === "paused").length;
  const summary = running || waiting ? [running && `${running} ${L.running}`, waiting && `${waiting} ${waiting === 1 ? L.needsYouOne : L.needsYou}`].filter(Boolean).join(", ") : paused ? `${paused} ${L.pausedCount}` : L.idle;
  const setState = (id, state) => {
    if (!tasksProp) setOwn((ts) => ts.map((t) => t.id === id ? { ...t, state } : t));
  };
  const focusRow = (i) => rowRefs.current[(i + tasks.length) % tasks.length]?.focus();
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `rn ${brand === null ? "rn-bare" : ""} ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css$1 }),
    brand !== null && /* @__PURE__ */ jsx("div", { className: "rn-brand", children: brand ?? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { className: "rn-logo", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
        /* @__PURE__ */ jsx("rect", { x: "1", y: "1", width: "14", height: "14", rx: "3", fill: "currentColor" }),
        /* @__PURE__ */ jsx("path", { d: "M5 5h4v2H7v4H5Z", fill: "var(--rn-bg)" }),
        /* @__PURE__ */ jsx("rect", { x: "8", y: "8", width: "3", height: "3", fill: "var(--rn-bg)" })
      ] }) }),
      /* @__PURE__ */ jsx("span", { className: "rn-crumb", children: "Thinking State" }),
      /* @__PURE__ */ jsx("span", { className: "rn-sep", children: "/" }),
      /* @__PURE__ */ jsx("span", { children: "Агентууд" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "rn-anchor", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          ref: triggerRef,
          type: "button",
          className: "rn-pill",
          "aria-haspopup": "dialog",
          "aria-expanded": open,
          "aria-controls": popId,
          "aria-label": `${L.title}: ${summary}`,
          onClick: () => {
            setOpen(!open);
            if (!open) window.setTimeout(() => focusRow(0), 0);
          },
          onKeyDown: (e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              setOpen(true);
              window.setTimeout(() => focusRow(e.key === "ArrowDown" ? 0 : -1), 0);
            }
          },
          children: [
            running || waiting ? /* @__PURE__ */ jsxs(Fragment, { children: [
              running > 0 && /* @__PURE__ */ jsxs("span", { className: "rn-part", children: [
                /* @__PURE__ */ jsx("i", { className: "rn-live" }),
                /* @__PURE__ */ jsx("b", { children: running }, running),
                " ",
                L.running
              ] }),
              running > 0 && waiting > 0 && /* @__PURE__ */ jsx("span", { className: "rn-dot", children: "·" }),
              waiting > 0 && /* @__PURE__ */ jsxs("span", { className: "rn-part", children: [
                /* @__PURE__ */ jsx("i", { className: "rn-wait" }),
                /* @__PURE__ */ jsx("b", { children: waiting }, waiting),
                " ",
                waiting === 1 ? L.needsYouOne : L.needsYou
              ] })
            ] }) : /* @__PURE__ */ jsx("span", { className: "rn-part", children: summary }),
            /* @__PURE__ */ jsx("svg", { className: "rn-chev", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m5 6.5 3 3 3-3", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }) })
          ]
        }
      ),
      open && /* @__PURE__ */ jsxs(
        "div",
        {
          id: popId,
          role: "dialog",
          "aria-label": L.title,
          className: `rn-pop rn-${align}`,
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              setOpen(false);
              triggerRef.current?.focus();
            }
          },
          onBlur: (e) => {
            if (!rootRef.current?.contains(e.relatedTarget) && e.relatedTarget) setOpen(false);
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "rn-ph", children: [
              /* @__PURE__ */ jsx("span", { children: L.title }),
              /* @__PURE__ */ jsx("span", { className: "rn-pc", children: summary })
            ] }),
            tasks.length === 0 ? /* @__PURE__ */ jsx("p", { className: "rn-empty", children: L.empty }) : /* @__PURE__ */ jsx("ul", { className: "rn-list", children: tasks.map((t, i) => /* @__PURE__ */ jsxs("li", { className: `rn-row is-${t.state}`, children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  ref: (el) => {
                    rowRefs.current[i] = el;
                  },
                  type: "button",
                  className: "rn-main",
                  "aria-label": `${t.title} – ${t.state === "needs-you" ? L.needsYouBadge.toLowerCase() : t.state === "running" ? L.running : t.state === "paused" ? L.pausedCount : L.done.toLowerCase()}. ${t.step}. ${t.done}/${t.total} алхам`,
                  onClick: () => onOpen?.(t.id),
                  onKeyDown: (e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      focusRow(i + 1);
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      focusRow(i - 1);
                    }
                    if (e.key === "Home") {
                      e.preventDefault();
                      focusRow(0);
                    }
                    if (e.key === "End") {
                      e.preventDefault();
                      focusRow(-1);
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsx(Ring, { task: t }),
                    /* @__PURE__ */ jsxs("span", { className: "rn-text", children: [
                      /* @__PURE__ */ jsxs("span", { className: "rn-title", children: [
                        t.title,
                        t.state === "needs-you" && /* @__PURE__ */ jsx("span", { className: "rn-badge", children: L.needsYouBadge }),
                        t.state === "paused" && /* @__PURE__ */ jsx("span", { className: "rn-badge rn-muted", children: L.paused })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "rn-step", children: t.state === "done" ? L.done : t.step }, t.step)
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "rn-count", children: [
                      t.done,
                      "/",
                      t.total
                    ] })
                  ]
                }
              ),
              t.state === "running" && /* @__PURE__ */ jsx("button", { type: "button", className: "rn-act", "aria-label": `${t.title}: ${L.pause.toLowerCase()}`, onClick: () => {
                setState(t.id, "paused");
                onPause?.(t.id);
              }, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M6 4v8M10 4v8", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }) }),
              t.state === "paused" && /* @__PURE__ */ jsx("button", { type: "button", className: "rn-act", "aria-label": `${t.title}: ${L.resume.toLowerCase()}`, onClick: () => {
                setState(t.id, "running");
                onResume?.(t.id);
              }, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M5.5 4v8l6.5-4Z", fill: "currentColor" }) }) }),
              t.state === "needs-you" && /* @__PURE__ */ jsx("button", { type: "button", className: "rn-open", "aria-label": `${t.title}: ${L.open.toLowerCase()} – ${L.needsYouBadge.toLowerCase()}`, onClick: () => onOpen?.(t.id), children: L.open })
            ] }, t.id)) }),
            onOpenAll && /* @__PURE__ */ jsxs("button", { type: "button", className: "rn-all", onClick: onOpenAll, children: [
              L.openAll,
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3.5 8h9M9 4.5 12.5 8 9 11.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }) })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("span", { role: "status", className: "rn-sr", children: announce })
  ] });
}
const css$1 = `
.rn{--rn-bg:#fff;--rn-fg:#18181b;--rn-muted:#65656d;--rn-faint:#65656d;--rn-line:#ececef;--rn-soft:#f6f6f7;--rn-teal:#14b8a6;--rn-amber:#eab308;--rn-orange:#f97316;--rn-blue:#3b82f6;--rn-wait:#e5a000;position:relative;display:flex;align-items:center;gap:12px;width:100%;max-width:722px;height:50px;padding:0 9px 0 14px;background:var(--rn-bg);color:var(--rn-fg);border:1px solid var(--rn-line);border-radius:var(--ts-radius,10px);box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .rn{--rn-bg:#1b1b1e;--rn-fg:#ececef;--rn-muted:#a1a1aa;--rn-faint:#9a9aa2;--rn-line:#2c2c31;--rn-soft:#24242a;--rn-wait:#facc15;color-scheme:dark}
.rn.rn-bare{display:inline-flex;width:auto;height:auto;padding:0;border:0;box-shadow:none;background:none}
.rn *{box-sizing:border-box}.rn button{font:inherit;color:inherit;cursor:pointer}
.rn-brand{display:flex;align-items:center;gap:6px;min-width:0}
.rn-logo{display:grid;place-items:center;width:16px;height:16px;margin-right:4px;color:var(--rn-fg)}.rn-logo svg{width:16px;height:16px}
.rn-crumb{color:var(--rn-muted)}.rn-sep{color:var(--rn-faint);margin:0 -2px}
.rn-anchor{position:relative;margin-left:auto}
.rn-pill{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 9px 0 10px;border:1px solid var(--rn-line);border-radius:var(--ts-radius,7px);background:var(--rn-bg);font-size:12.5px;color:var(--rn-muted);transition:background .15s}
.rn-pill:hover,.rn-pill[aria-expanded=true]{background:var(--rn-soft)}
.rn-part{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.rn-part b{font-weight:500;color:var(--rn-fg);display:inline-block;animation:rn-roll .3s both}
.rn-part i{width:7px;height:7px;margin-right:5px;border-radius:50%}
.rn-live{border:1.5px solid var(--rn-teal)}
.rn-wait{background:var(--rn-wait)}
.rn-dot{color:var(--rn-faint);margin:0 1px}
.rn-chev{width:13px;height:13px;color:var(--rn-faint);transition:transform .2s}.rn-pill[aria-expanded=true] .rn-chev{transform:rotate(180deg)}
.rn-pop{position:absolute;z-index:20;top:calc(100% + 8px);width:340px;background:var(--rn-bg);border:1px solid var(--rn-line);border-radius:var(--ts-radius,11px);box-shadow:0 12px 32px #00000018,0 2px 6px #0000000a;overflow:hidden;animation:rn-pop .18s cubic-bezier(.2,.8,.3,1) both}
.rn-end{right:0;transform-origin:top right}.rn-start{left:0;transform-origin:top left}
.rn-ph{display:flex;justify-content:space-between;align-items:baseline;padding:11px 14px 9px;border-bottom:1px solid var(--rn-line);font-weight:500}
.rn-pc{font-size:12.5px;font-weight:400;color:var(--rn-muted)}
.rn-list{list-style:none;margin:0;padding:4px}
.rn-row{display:flex;align-items:center;gap:4px;border-radius:var(--ts-radius,7px)}
.rn-row:hover{background:var(--rn-soft)}
.rn-main{flex:1;min-width:0;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 9px;border:0;background:none;text-align:left;border-radius:var(--ts-radius,7px)}
.rn-ring{width:16px;height:16px;flex:none}
.rn-text{flex:1;min-width:0;display:flex;flex-direction:column}
.rn-title{display:flex;align-items:center;gap:6px;white-space:nowrap}
.rn-badge{padding:0 6px;border-radius:var(--ts-radius,4px);background:color-mix(in srgb,var(--rn-wait) 16%,transparent);color:color-mix(in srgb,var(--rn-wait) 70%,var(--rn-fg));font-size:11.5px;line-height:18px}
.rn-badge.rn-muted{background:var(--rn-soft);color:var(--rn-muted)}
.rn-step{font-size:12.5px;color:var(--rn-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;animation:rn-roll .3s both}
.rn-row.is-paused .rn-title,.rn-row.is-paused .rn-step{color:var(--rn-faint)}
.rn-count{font-size:12px;color:var(--rn-faint);font-variant-numeric:tabular-nums}
.rn-act{display:grid;place-items:center;width:28px;height:28px;margin-right:4px;border:0;border-radius:var(--ts-radius,6px);background:none;color:var(--rn-muted)}
.rn-act:hover{background:var(--rn-bg);color:var(--rn-fg)}.rn-act svg{width:14px;height:14px}
.rn-open{height:26px;margin-right:5px;padding:0 9px;border:1px solid var(--rn-line);border-radius:var(--ts-radius,6px);background:var(--rn-bg);font-size:12.5px}
.rn-open:hover{background:var(--rn-soft)}
.rn-empty{margin:0;padding:16px 14px;color:var(--rn-muted)}
.rn-all{display:flex;align-items:center;justify-content:space-between;width:100%;padding:10px 14px;border:0;border-top:1px solid var(--rn-line);background:none;text-align:left}
.rn-all:hover{background:var(--rn-soft)}.rn-all svg{width:14px;height:14px;color:var(--rn-muted)}
.rn-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rn :focus-visible{outline:2px solid var(--rn-blue);outline-offset:1px}
@keyframes rn-pop{from{opacity:0;transform:scale(.96) translateY(-4px)}}
@keyframes rn-roll{from{opacity:0;transform:translateY(4px)}}
@media(max-width:480px){.rn-pop{width:calc(100vw - 32px);max-width:340px}.rn-crumb,.rn-sep{display:none}}
@media(prefers-reduced-motion:reduce){.rn *{animation:none!important;transition:none!important}}
.rn-pill{max-width:100%;min-width:0;gap:6px;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rn-brand{animation:rnbrand .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.rn-brand:nth-child(1){animation-delay:0ms}@keyframes rnbrand{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.rn-brand{animation:none}}.rn-anchor{animation:rnanchor .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.rn-anchor:nth-child(1){animation-delay:160ms}@keyframes rnanchor{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.rn-anchor{animation:none}}
`;
const defaultMemories = [
  { id: "m1", text: "Эхлээд товч хариулт, дэлгэрэнгүйг асуухад нь өгнө", category: "Шийдвэр", source: "Чатаас", date: "10/12" },
  { id: "m2", text: "Шинэ хувилбарыг зөвхөн Мягмар гарагт гаргана", category: "Шийдвэр", source: "Гараар нэмсэн", date: "10/2", paused: true },
  { id: "m3", text: "Дизайнд 4px-ийн торон систем ашиглана", category: "Шийдвэр", source: "Дизайны файлаас", date: "10/7" },
  { id: "m4", text: "Баасан гараг бүр харилцагчдад шинэчлэлийн тойм илгээх", category: "Даалгавар", source: "Чатаас", date: "10/9" },
  { id: "m5", text: "Бүртгэлийн урсгалыг 10/24-нөөс өмнө шинэчлэх", category: "Даалгавар", source: "Чатаас", date: "10/11" },
  { id: "m6", text: "Сараа бүтээгдэхүүний дизайныг хариуцдаг", category: "Хүмүүс", source: "Чатаас", date: "9/28" },
  { id: "m7", text: "Болд урьдчилан мэдэгдсэн уулзалтыг илүүд үздэг", category: "Хүмүүс", source: "Багийн чатаас", date: "10/3" },
  { id: "m8", text: "Дизайны токенуудын тухай нийтлэлийг дуусгах", category: "Унших", source: "Чатаас", date: "10/5" }
];
const ALL_LABEL = "Бүгд";
const glyph = (d, cls) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", className: cls, "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", children: d });
const catPaths = {
  All: /* @__PURE__ */ jsx("path", { d: "M8 2.5 14 5.5 8 8.5 2 5.5ZM2 8.5l6 3 6-3M2 11l6 3 6-3" }),
  Шийдвэр: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "m5.6 8.2 1.7 1.7 3.2-3.4" })
  ] }),
  Даалгавар: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "2.8", y: "2.8", width: "10.4", height: "10.4", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M5.5 6h5M5.5 8.5h5M5.5 11h3" })
  ] }),
  Хүмүүс: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "6", cy: "5.8", r: "2.3" }),
    /* @__PURE__ */ jsx("path", { d: "M2.2 13c.4-2.2 1.9-3.4 3.8-3.4s3.4 1.2 3.8 3.4M10.6 3.8a2.2 2.2 0 0 1 0 4.2M11.6 9.8c1.2.4 2 1.4 2.2 3.2" })
  ] }),
  Унших: /* @__PURE__ */ jsx("path", { d: "M2.5 3.5c2 0 4 .5 5.5 1.8v8c-1.5-1.3-3.5-1.8-5.5-1.8ZM13.5 3.5c-2 0-4 .5-5.5 1.8v8c1.5-1.3 3.5-1.8 5.5-1.8Z" })
};
const tagPath = /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M2.5 8.2V3.2a.7.7 0 0 1 .7-.7h5l5.3 5.3a.9.9 0 0 1 0 1.3l-4 4a.9.9 0 0 1-1.3 0Z" }),
  /* @__PURE__ */ jsx("circle", { cx: "5.4", cy: "5.4", r: ".9" })
] });
const catIcon = (c, cls) => glyph(catPaths[c] ?? tagPath, cls);
const memoryIcon = glyph(/* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "M8 13.5V7" }),
  /* @__PURE__ */ jsx("path", { d: "M8 7c0-2.5 1.5-4.2 4-4.5.2 2.6-1.4 4.4-4 4.5ZM8 9C8 7 6.7 5.6 4.5 5.4 4.3 7.5 5.7 8.9 8 9Z" })
] }), "mp-count-icon");
const chipLabel = (c) => c === "All" ? ALL_LABEL : c;
const short = (t) => t.length > 24 ? `${t.slice(0, 24)}…` : t;
const Ico = {
  edit: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M10.5 3 13 5.5 6 12.5H3.5V10Z", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }) }),
  pause: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M5.5 3.5v9M10.5 3.5v9", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) }),
  play: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M5 3.5v9l7-4.5Z", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round" }) }),
  trash: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
  plus: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }) }),
  search: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "4.3", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
    /* @__PURE__ */ jsx("path", { d: "m10.2 10.2 3.3 3.3", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })
  ] })
};
function MemoryPanel({
  memories: memoriesProp,
  onChange,
  onAdd,
  onEdit,
  onPause,
  onForget,
  onRestore,
  enabled: enabledProp,
  defaultEnabled = true,
  onEnabledChange,
  categories: categoriesProp,
  title = "Санах ой",
  maxHeight = 360,
  undoFor = 5e3,
  addedSource = "Гараар нэмсэн",
  action,
  className = ""
}) {
  const [own, setOwn] = React.useState(memoriesProp ?? defaultMemories);
  const list = onChange && memoriesProp ? memoriesProp : own;
  const [enabledState, setEnabledState] = React.useState(defaultEnabled);
  const enabled = enabledProp ?? enabledState;
  const [filter, setFilter] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const [newCat, setNewCat] = React.useState("");
  const [undo, setUndo] = React.useState(null);
  const chipRefs = React.useRef([]);
  const noteId = React.useId();
  const categories = React.useMemo(() => {
    const seen = categoriesProp ? [...categoriesProp] : [];
    list.forEach((m) => !seen.includes(m.category) && seen.push(m.category));
    return seen;
  }, [list, categoriesProp]);
  React.useEffect(() => {
    if (!undo) return;
    const id = window.setTimeout(() => setUndo(null), undoFor);
    return () => window.clearTimeout(id);
  }, [undo, undoFor]);
  const commit = (next) => {
    if (!(onChange && memoriesProp)) setOwn(next);
    onChange?.(next);
  };
  const setEnabled = (v) => {
    setEnabledState(v);
    onEnabledChange?.(v);
  };
  const q = query.trim().toLowerCase();
  const matches = (m) => (filter === "All" || m.category === filter) && (!q || m.text.toLowerCase().includes(q));
  const paused = list.filter((m) => m.paused).length;
  const chips = ["All", ...categories];
  const count = (c) => c === "All" ? list.length : list.filter((m) => m.category === c).length;
  const saveEdit = (m) => {
    const text = draft.trim();
    if (text && text !== m.text) {
      commit(list.map((x) => x.id === m.id ? { ...x, text } : x));
      onEdit?.(m.id, text);
    }
    setEditing(null);
  };
  const saveNew = () => {
    const text = draft.trim();
    if (!text) return;
    const memory = {
      id: `m${Date.now()}`,
      text,
      category: newCat || (filter !== "All" ? filter : categories[0] ?? "Ерөнхий"),
      source: addedSource,
      date: `${(/* @__PURE__ */ new Date()).getMonth() + 1}/${(/* @__PURE__ */ new Date()).getDate()}`
    };
    commit([...list, memory]);
    onAdd?.(memory);
    setAdding(false);
    setDraft("");
  };
  const forget = (m) => {
    const index = list.findIndex((x) => x.id === m.id);
    commit(list.filter((x) => x.id !== m.id));
    setUndo({ memory: m, index });
    onForget?.(m.id);
  };
  const restore = () => {
    if (!undo) return;
    const next = [...list];
    next.splice(Math.min(undo.index, next.length), 0, undo.memory);
    commit(next);
    onRestore?.(undo.memory);
    setUndo(null);
  };
  return /* @__PURE__ */ jsxs("section", { className: `mp ${enabled ? "" : "is-off"} ${className}`, role: "group", "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "mp-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "mp-top", children: [
        /* @__PURE__ */ jsx("h3", { children: title }),
        /* @__PURE__ */ jsxs("span", { className: "mp-count", children: [
          memoryIcon,
          list.length
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "mp-use", children: [
          "Санах ой ашиглах",
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": enabled,
              "aria-controls": noteId,
              className: "mp-switch",
              onClick: () => setEnabled(!enabled),
              children: /* @__PURE__ */ jsx("i", {})
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mp-note", id: noteId, "data-open": !enabled, children: /* @__PURE__ */ jsx("p", { children: "Туслах шинэ чатад санах ойг ашиглахгүй, хадгалахгүй. Энд байгаа зүйл устахгүй." }) }),
      /* @__PURE__ */ jsxs("div", { className: "mp-filters", children: [
        searching ? /* @__PURE__ */ jsx(
          "input",
          {
            className: "mp-search",
            autoFocus: true,
            placeholder: "Санах ойгоос хайх",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Escape") {
                setQuery("");
                setSearching(false);
              }
            }
          }
        ) : /* @__PURE__ */ jsx("div", { className: "mp-chips", role: "radiogroup", "aria-label": "Ангилал", children: chips.map((c, i) => /* @__PURE__ */ jsxs(
          "button",
          {
            ref: (el) => {
              chipRefs.current[i] = el;
            },
            type: "button",
            role: "radio",
            "aria-checked": filter === c,
            tabIndex: filter === c ? 0 : -1,
            className: "mp-chip",
            onClick: () => setFilter(c),
            onKeyDown: (e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const n = (i + (e.key === "ArrowRight" ? 1 : -1) + chips.length) % chips.length;
              setFilter(chips[n]);
              chipRefs.current[n]?.focus();
            },
            children: [
              catIcon(c, "mp-chip-icon"),
              chipLabel(c),
              /* @__PURE__ */ jsx("span", { children: count(c) })
            ]
          },
          c
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "mp-icon",
            "aria-label": searching ? "Хайлт хаах" : "Санах ойгоос хайх",
            onClick: () => {
              setSearching(!searching);
              setQuery("");
            },
            children: searching ? /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "m4.5 4.5 7 7m0-7-7 7", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" }) }) : Ico.search
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mp-list", style: { maxHeight }, children: [
      categories.map((cat) => {
        const rows = list.filter((m) => m.category === cat);
        const visible = rows.filter(matches);
        return /* @__PURE__ */ jsxs("section", { className: "mp-group", "data-hidden": visible.length === 0, "aria-label": cat, inert: visible.length === 0 ? true : void 0, children: [
          /* @__PURE__ */ jsxs("div", { className: "mp-gh", children: [
            catIcon(cat, "mp-gh-icon"),
            cat
          ] }),
          rows.map((m) => {
            const show = matches(m);
            return /* @__PURE__ */ jsx("div", { className: `mp-row ${m.paused ? "is-paused" : ""}`, "data-hidden": !show, inert: !show ? true : void 0, children: /* @__PURE__ */ jsxs("div", { className: "mp-inner", children: [
              catIcon(m.category, "mp-row-icon"),
              editing === m.id ? /* @__PURE__ */ jsx(
                "textarea",
                {
                  className: "mp-edit",
                  autoFocus: true,
                  value: draft,
                  rows: 2,
                  onChange: (e) => setDraft(e.target.value),
                  onBlur: () => saveEdit(m),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      saveEdit(m);
                    }
                    if (e.key === "Escape") setEditing(null);
                  }
                }
              ) : /* @__PURE__ */ jsx("p", { className: "mp-text", children: m.text }),
              /* @__PURE__ */ jsxs("div", { className: "mp-meta", children: [
                m.source,
                m.source && m.date && " · ",
                m.date,
                m.paused && /* @__PURE__ */ jsx("span", { className: "mp-tag", children: "Түр зогссон" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mp-acts", children: [
                /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `Засах “${short(m.text)}”`, onClick: () => {
                  setEditing(m.id);
                  setDraft(m.text);
                }, children: Ico.edit }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": `${m.paused ? "Үргэлжлүүлэх" : "Түр зогсоох"} “${short(m.text)}”`,
                    onClick: () => {
                      commit(list.map((x) => x.id === m.id ? { ...x, paused: !x.paused } : x));
                      onPause?.(m.id, !m.paused);
                    },
                    children: m.paused ? Ico.play : Ico.pause
                  }
                ),
                /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `Мартах “${short(m.text)}”`, onClick: () => forget(m), children: Ico.trash })
              ] })
            ] }) }, m.id);
          })
        ] }, cat);
      }),
      list.filter(matches).length === 0 && /* @__PURE__ */ jsx("p", { className: "mp-empty", children: "Энд санах ой алга" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mp-new", children: adding ? /* @__PURE__ */ jsxs("div", { className: "mp-editor", children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          autoFocus: true,
          rows: 2,
          placeholder: "Туслахын санах ёстой зүйл",
          value: draft,
          onChange: (e) => setDraft(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              saveNew();
            }
            if (e.key === "Escape") setAdding(false);
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mp-ed-row", children: [
        /* @__PURE__ */ jsx("div", { className: "mp-chips", role: "radiogroup", "aria-label": "Шинэ санах ойн ангилал", children: categories.map((c) => {
          const cur = newCat || (filter !== "All" ? filter : categories[0]);
          return /* @__PURE__ */ jsxs("button", { type: "button", role: "radio", "aria-checked": cur === c, className: "mp-chip", onClick: () => setNewCat(c), children: [
            catIcon(c, "mp-chip-icon"),
            c
          ] }, c);
        }) }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "mp-btn", onClick: () => setAdding(false), children: "Болих" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "mp-btn mp-primary", disabled: !draft.trim(), onClick: saveNew, children: "Хадгалах" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("button", { type: "button", className: "mp-add", onClick: () => {
      setAdding(true);
      setDraft("");
      setNewCat("");
    }, children: [
      Ico.plus,
      "Шинэ санах ой"
    ] }) }),
    /* @__PURE__ */ jsxs("footer", { className: "mp-foot", children: [
      /* @__PURE__ */ jsx("span", { role: "status", className: "mp-status", children: undo ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Мартсан: “",
        short(undo.memory.text),
        "”"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        memoryIcon,
        /* @__PURE__ */ jsx("b", { children: list.length }),
        " санах ой",
        paused > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          " · ",
          paused,
          " түр зогссон"
        ] })
      ] }) }, undo ? "undo" : "count"),
      undo ? /* @__PURE__ */ jsx("button", { type: "button", className: "mp-btn", onClick: restore, children: "Буцаах" }) : action && /* @__PURE__ */ jsx("button", { type: "button", className: "mp-btn", onClick: action.onClick, children: action.label })
    ] })
  ] });
}
const css = `
.mp{--mp-bg:#fff;--mp-fg:#18181b;--mp-muted:#65656d;--mp-faint:#65656d;--mp-line:#ececef;--mp-soft:#f4f4f5;--mp-chip:#ededef;--mp-accent:#3b82f6;width:100%;max-width:400px;background:var(--mp-bg);color:var(--mp-fg);border:1px solid var(--mp-line);border-radius:var(--ts-radius,12px);box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .mp{--mp-bg:#1b1b1e;--mp-fg:#ececef;--mp-muted:#a1a1aa;--mp-faint:#9a9aa2;--mp-line:#2c2c31;--mp-soft:#232328;--mp-chip:#2c2c32;--mp-accent:#7aa2ff;color-scheme:dark}
.mp *{box-sizing:border-box}.mp button,.mp input,.mp textarea{font:inherit;color:inherit}.mp button{cursor:pointer}
.mp-head{padding:15px 15px 12px;border-bottom:1px solid var(--mp-line)}
.mp-top{display:flex;align-items:center;gap:8px}
.mp-top h3{margin:0;font-size:16px;font-weight:500;letter-spacing:-.01em}
.mp-count{display:inline-flex;align-items:center;gap:4px;padding:0 6px;border-radius:var(--ts-radius,4px);background:var(--mp-chip);font-size:11.5px;line-height:17px;color:var(--mp-muted)}
.mp-use{margin-left:auto;display:inline-flex;align-items:center;gap:8px;font-size:14px;color:var(--mp-muted)}
.mp-switch{position:relative;width:26px;height:16px;padding:0;border:0;border-radius:var(--ts-radius,9px);background:var(--mp-faint);transition:background .2s}
.mp-switch[aria-checked=true]{background:var(--mp-accent)}
.mp-switch i{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:var(--ts-radius,6px);background:#fff;transition:transform .2s cubic-bezier(.3,1.3,.5,1)}
.mp-switch[aria-checked=true] i{transform:translateX(10px);width:10px;border-radius:var(--ts-radius,3px)}
.mp-note{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s}
.mp-note[data-open=true]{grid-template-rows:1fr}
.mp-note p{overflow:hidden;margin:0;font-size:12.5px;color:var(--mp-muted)}.mp-note[data-open=true] p{padding-top:8px}
.mp-filters{display:flex;align-items:center;gap:6px;margin-top:12px}
.mp-chips{display:flex;gap:4px;flex-wrap:wrap;flex:1;min-width:0}
.mp-chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:1px solid var(--mp-line);border-radius:var(--ts-radius,5px);background:var(--mp-bg);font-size:14px;transition:background .15s}
.mp-chip span{font-size:12px;color:var(--mp-muted)}
.mp-count-icon,.mp-chip-icon,.mp-gh-icon,.mp-row-icon{flex:none;width:13px;height:13px;color:var(--mp-muted)}
.mp-status{display:inline-flex;align-items:center;gap:5px}
.mp-gh{display:flex;align-items:center;gap:6px}
.mp-chip:hover{background:var(--mp-soft)}
.mp-chip[aria-checked=true]{background:var(--mp-chip);border-color:var(--mp-chip)}
.mp-icon{display:grid;place-items:center;width:28px;height:28px;margin-left:auto;border:0;border-radius:var(--ts-radius,6px);background:none;color:var(--mp-muted)}
.mp-icon:hover{background:var(--mp-soft);color:var(--mp-fg)}.mp-icon svg{width:15px;height:15px}
.mp-search{flex:1;height:28px;padding:0 9px;border:1px solid var(--mp-line);border-radius:var(--ts-radius,6px);background:var(--mp-bg);outline:0}
.mp-search:focus{border-color:var(--mp-accent)}
.mp-list{overflow-y:auto;padding:4px 0 6px;transition:opacity .25s}
.mp.is-off .mp-list{opacity:.45}
.mp-group{display:grid;grid-template-rows:1fr;transition:opacity .25s}
.mp-group[data-hidden=true]{display:none}
.mp-gh{padding:12px 15px 2px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mp-muted)}
.mp-row{display:grid;grid-template-rows:1fr;transition:grid-template-rows .3s,opacity .3s}
.mp-row[data-hidden=true]{grid-template-rows:0fr;opacity:0}
.mp-inner{position:relative;overflow:hidden;padding:8px 15px 7px 37px;min-height:0}
.mp-row-icon{position:absolute;left:15px;top:11px;width:14px;height:14px}
.mp-row.is-paused .mp-row-icon{color:var(--mp-faint)}
.mp-row[data-hidden=true] .mp-inner{padding-top:0;padding-bottom:0}
.mp-row[data-hidden=true] .mp-row-icon{top:3px}
.mp-inner:hover,.mp-inner:focus-within{background:var(--mp-soft)}
.mp-text{margin:0;padding-right:4px}
.mp-row.is-paused .mp-text{color:var(--mp-faint)}
.mp-meta{display:flex;align-items:center;gap:4px;margin-top:2px;font-size:12.5px;color:var(--mp-muted);white-space:pre}
.mp-tag{margin-left:6px;padding:0 6px;border-radius:var(--ts-radius,4px);background:var(--mp-chip);font-size:11.5px;animation:mp-fade .25s both}
.mp-acts{position:absolute;right:10px;bottom:5px;display:flex;gap:1px;padding:2px;border-radius:var(--ts-radius,7px);background:var(--mp-bg);border:1px solid var(--mp-line);opacity:0;transition:opacity .15s}
.mp-inner:hover .mp-acts,.mp-inner:focus-within .mp-acts{opacity:1}
.mp-acts button{display:grid;place-items:center;width:24px;height:22px;border:0;border-radius:var(--ts-radius,5px);background:none;color:var(--mp-muted)}
.mp-acts button:hover{background:var(--mp-soft);color:var(--mp-fg)}.mp-acts svg{width:13px;height:13px}
.mp-edit,.mp-editor textarea{display:block;width:100%;resize:none;padding:6px 8px;border:1px solid var(--mp-accent);border-radius:var(--ts-radius,6px);background:var(--mp-bg);outline:0}
.mp-empty{margin:0;padding:18px 15px;color:var(--mp-muted);font-size:13px}
.mp-new{border-top:1px solid var(--mp-line)}
.mp-add{display:flex;align-items:center;gap:9px;width:100%;height:44px;padding:0 15px;border:0;background:none;text-align:left}
.mp-add svg{width:14px;height:14px;color:var(--mp-muted)}.mp-add:hover{background:var(--mp-soft)}
.mp-editor{padding:10px 15px;animation:mp-fade .2s both}
.mp-ed-row{display:flex;align-items:center;gap:6px;margin-top:8px}
.mp-ed-row .mp-chip{height:24px;font-size:12.5px;padding:0 7px}
.mp-btn{height:28px;padding:0 10px;border:1px solid var(--mp-line);border-radius:var(--ts-radius,6px);background:var(--mp-bg);font-size:13px!important}
.mp-btn:hover{background:var(--mp-soft)}.mp-btn:disabled{opacity:.5;cursor:default}
.mp-primary{background:var(--mp-fg);border-color:var(--mp-fg);color:var(--mp-bg)!important}.mp-primary:hover{background:var(--mp-fg);opacity:.9}
.mp-foot{display:flex;align-items:center;justify-content:space-between;min-height:43px;padding:6px 10px 6px 15px;border-top:1px solid var(--mp-line);font-size:12.5px;color:var(--mp-muted)}
.mp-foot b{font-weight:500;color:var(--mp-fg)}
.mp-status{animation:mp-fade .25s both}
.mp :focus-visible{outline:2px solid var(--mp-accent);outline-offset:1px}
@keyframes mp-fade{from{opacity:0}}
@media(max-width:420px){.mp-chip span{display:none}.mp-use{font-size:0;gap:0}}
@media(prefers-reduced-motion:reduce){.mp *{animation:none!important;transition:none!important}}
.mp-group{animation:mpgrouprise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.mp-group:nth-child(1){animation-delay:0ms}.mp-group:nth-child(2){animation-delay:110ms}.mp-group:nth-child(3){animation-delay:220ms}.mp-group:nth-child(4){animation-delay:330ms}.mp-group:nth-child(5){animation-delay:440ms}.mp-group:nth-child(6){animation-delay:550ms}.mp-group:nth-child(7){animation-delay:660ms}.mp-group:nth-child(8){animation-delay:770ms}.mp-group:nth-child(9){animation-delay:880ms}.mp-group:nth-child(10){animation-delay:990ms}.mp-group:nth-child(11){animation-delay:1100ms}.mp-group:nth-child(12){animation-delay:1210ms}@keyframes mpgrouprise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.mp-group{animation:none}}
`;
export {
  DecisionCard as D,
  MemoryPanel as M,
  RunningNow as R
};
//# sourceMappingURL=memory-panel-D4swCRd_.js.map
