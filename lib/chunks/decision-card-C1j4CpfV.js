import { jsxs, jsx } from "react/jsx-runtime";
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
      /* @__PURE__ */ jsx("style", { children: css }),
      /* @__PURE__ */ jsx("span", { role: "status", "aria-live": "polite", className: "dc-sr", children: said })
    ] });
  if (folded)
    return /* @__PURE__ */ jsxs("div", { className: `dc ${className}`, children: [
      /* @__PURE__ */ jsx("style", { children: css }),
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
    /* @__PURE__ */ jsx("style", { children: css }),
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
const css = `
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
export {
  DecisionCard as D
};
//# sourceMappingURL=decision-card-C1j4CpfV.js.map
