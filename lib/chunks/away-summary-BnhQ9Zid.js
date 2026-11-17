import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const defaultLabels = {
  title: "Таныг байхгүй үед",
  needsYou: "таны ээлж",
  failed: "алдаатай",
  done: "дууссан",
  decide: "Шийдэх",
  retry: "Дахин оролдох",
  open: "Нээх",
  showMore: (n) => `Дахиад ${n}-г харах`,
  showLess: "Хураах",
  gotIt: "Ойлголоо",
  divider: (s) => s
};
const defaultItems = [
  { id: "ingest", title: "Өгөгдөл татах шугам", kind: "done", detail: "Хариулт: мэдээллийн дараалал · туршилтын орчинд байршуулж байна" },
  { id: "report", title: "Долоо хоногийн тайлан", kind: "done", detail: "Хариулт: бүх баг · илгээсэн" },
  { id: "billing", title: "Төлбөрийн синк", kind: "done", detail: "Дахин оролдсон · 3,900 нэхэмжлэх бүгдийг синк хийсэн" },
  { id: "auth", title: "Нэвтрэлтийн бүтцийн засвар", kind: "done", detail: "#482 хүсэлт нээсэн · туршилтын орчинд" },
  { id: "usage", title: "Хэрэглээний хуудас", kind: "done", detail: "Харилцагчид хүргэсэн" },
  { id: "docs", title: "Үнэлгээний баримт бичиг", kind: "done", detail: "14 хуудас нийтэлсэн" },
  { id: "load", title: "Ачааллын тест", kind: "done", detail: "Минутад 20 мянган үйлдэлд тэсвэрлэсэн" },
  { id: "flaky", title: "Тогтворгүй тестүүд", kind: "done", detail: "Төлбөрийн хэсгийн 3 тестийг тусгаарласан" }
];
const order = { "needs-you": 0, failed: 1, done: 2 };
const fmtDuration = (ms) => {
  const m = Math.max(0, Math.round(ms / 6e4));
  const h = Math.floor(m / 60);
  return h ? `${h} цаг ${m % 60} мин` : `${m} мин`;
};
const Mark = ({ kind }) => /* @__PURE__ */ jsx("span", { className: `aws-mark is-${kind}`, "aria-hidden": "true", children: kind === "done" ? /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
  /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "7", fill: "currentColor" }),
  /* @__PURE__ */ jsx("path", { d: "m5 8.2 2 2 4-4.4", fill: "none", stroke: "#fff", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" })
] }) : kind === "failed" ? /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
  /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "7", fill: "currentColor" }),
  /* @__PURE__ */ jsx("path", { d: "M8 4.5v4.2M8 11.2v.1", stroke: "#fff", strokeWidth: "1.7", strokeLinecap: "round" })
] }) : /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
  /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "6.2", fill: "none", stroke: "currentColor", strokeWidth: "1.6" }),
  /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "2.4", fill: "currentColor" })
] }) });
function AwaySummary({
  since,
  now,
  items = defaultItems,
  limit = 5,
  timeStyle = "duration",
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  onAction,
  onDismiss,
  labels: labelsProp,
  thread = true,
  className = ""
}) {
  const L = { ...defaultLabels, ...labelsProp };
  const [collapsedState, setCollapsed] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? collapsedState;
  const setC = (c) => {
    setCollapsed(c);
    onCollapsedChange?.(c);
  };
  const [expanded, setExpanded] = React.useState(false);
  const [busy, setBusy] = React.useState(null);
  const [reply, setReply] = React.useState("");
  const nowMs = now !== void 0 ? +new Date(now) : Date.now();
  const sinceMs = since === void 0 ? nowMs - 134 * 6e4 : typeof since === "number" && since < 1e7 ? nowMs - since * 6e4 : +new Date(since);
  const away = timeStyle === "clock" ? `${new Date(sinceMs).toLocaleTimeString("mn-MN", { hour: "numeric", minute: "2-digit" })}-аас хойш` : fmtDuration(nowMs - sinceMs);
  const sorted = [...items].sort((a, b) => order[a.kind] - order[b.kind]);
  const shown = expanded ? sorted : sorted.slice(0, limit);
  const hidden = sorted.length - shown.length;
  const counts = ["needs-you", "failed", "done"].map((k) => ({ k, n: items.filter((i) => i.kind === k).length })).filter((c) => c.n);
  const countText = (k, n) => `${n} ${k === "needs-you" ? L.needsYou : k === "failed" ? L.failed : L.done}`;
  const summary = counts.map((c) => countText(c.k, c.n)).join(" · ");
  const run = async (item) => {
    const r = onAction?.(item.id, item);
    if (r && typeof r.then === "function") {
      setBusy(item.id);
      try {
        await r;
      } finally {
        setBusy(null);
      }
    }
  };
  const card = collapsed ? /* @__PURE__ */ jsxs("button", { type: "button", className: "aws-divider", "aria-expanded": false, onClick: () => setC(false), children: [
    /* @__PURE__ */ jsx("span", {}),
    L.divider(`${L.title} · ${away} · ${summary}`),
    /* @__PURE__ */ jsx("span", {})
  ] }) : /* @__PURE__ */ jsxs("section", { className: "aws-card", "aria-label": `${L.title}, ${away}`, children: [
    /* @__PURE__ */ jsxs("header", { className: "aws-head", children: [
      /* @__PURE__ */ jsxs("span", { className: "aws-title", children: [
        L.title,
        /* @__PURE__ */ jsxs("span", { className: "aws-time", children: [
          " · ",
          away
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "aws-counts", children: counts.map((c) => /* @__PURE__ */ jsxs("span", { className: `aws-count is-${c.k}`, children: [
        /* @__PURE__ */ jsx("i", {}),
        countText(c.k, c.n)
      ] }, c.k)) })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "aws-list", children: shown.map((item) => {
      const label = item.action === false ? null : item.action ?? (item.kind === "needs-you" ? L.decide : item.kind === "failed" ? L.retry : L.open);
      return /* @__PURE__ */ jsxs("li", { className: `aws-row is-${item.kind}`, children: [
        /* @__PURE__ */ jsx(Mark, { kind: item.kind }),
        /* @__PURE__ */ jsxs("span", { className: "aws-sr", children: [
          item.kind === "needs-you" ? L.needsYou : item.kind === "failed" ? L.failed : L.done,
          ": "
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "aws-text", children: [
          /* @__PURE__ */ jsx("div", { className: "aws-name", children: item.title }),
          item.detail && /* @__PURE__ */ jsx("div", { className: "aws-detail", children: item.detail })
        ] }),
        label && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: `aws-act${item.kind === "needs-you" ? " is-primary" : ""}`,
            disabled: busy === item.id,
            "aria-busy": busy === item.id,
            onClick: () => run(item),
            children: [
              busy === item.id ? /* @__PURE__ */ jsx("span", { className: "aws-spin", "aria-hidden": "true" }) : null,
              label
            ]
          }
        )
      ] }, item.id);
    }) }),
    /* @__PURE__ */ jsxs("footer", { className: "aws-foot", children: [
      (hidden > 0 || expanded) && sorted.length > limit ? /* @__PURE__ */ jsxs("button", { type: "button", className: "aws-more", "aria-expanded": expanded, onClick: () => setExpanded(!expanded), children: [
        expanded ? L.showLess : L.showMore(hidden),
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", style: { transform: expanded ? "rotate(180deg)" : void 0 }, children: /* @__PURE__ */ jsx("path", { d: "m4.5 6.5 3.5 3.5 3.5-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" }) })
      ] }) : /* @__PURE__ */ jsx("span", {}),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "aws-got",
          onClick: () => {
            setC(true);
            onDismiss?.();
          },
          children: [
            /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m3.5 8.5 3 3 6-7", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) }),
            L.gotIt
          ]
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: `aws ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    thread && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "aws-user", children: "Өгөгдөл татах шугамыг өнөөдөр туршилтын орчинд гаргаарай – хэрэгтэй бол надад хэлээрэй." }),
      /* @__PURE__ */ jsxs("div", { className: "aws-agent", children: [
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [0, 1, 2].flatMap(
          (r) => [0, 1, 2].map((c) => /* @__PURE__ */ jsx("rect", { x: 1.5 + c * 4.7, y: 1.5 + r * 4.7, width: "3.3", height: "3.3", rx: ".6", fill: (r + c) % 2 ? "#c4b5fd" : "#8b5cf6", opacity: r === 1 && c === 1 ? 0 : 1 }, `${r}${c}`))
        ) }),
        "Ойлголоо. Даалгавруудад хувааж, таныг байхгүй үед үргэлжлүүлнэ."
      ] })
    ] }),
    card,
    thread && /* @__PURE__ */ jsxs(
      "form",
      {
        className: "aws-reply",
        onSubmit: (e) => {
          e.preventDefault();
          setReply("");
        },
        children: [
          /* @__PURE__ */ jsx("input", { "aria-label": "Агентад хариулах", placeholder: "Агентад хариулах…", value: reply, onChange: (e) => setReply(e.target.value) }),
          /* @__PURE__ */ jsx("button", { type: "submit", "aria-label": "Илгээх", disabled: !reply.trim(), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M8 12.5v-9M4.5 7 8 3.5 11.5 7", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) }) })
        ]
      }
    )
  ] });
}
const css = `
.aws{--aws-bg:#fff;--aws-fg:#18181b;--aws-muted:#65656d;--aws-faint:#65656d;--aws-line:#ececef;--aws-chip:#f1f1f3;--aws-blue:#3b82f6;--aws-red:#e5484d;--aws-amber:#f59e0b;display:flex;flex-direction:column;gap:14px;width:100%;max-width:600px;color:var(--aws-fg);font:400 14px/1.45 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .aws{--aws-bg:#1b1b1e;--aws-fg:#ececef;--aws-muted:#a1a1aa;--aws-faint:#9a9aa2;--aws-line:#2e2e33;--aws-chip:#2a2a2f;--aws-blue:#5b9cff;--aws-red:#ff6b6f;color-scheme:dark}
.aws *{box-sizing:border-box}.aws button,.aws input{font:inherit;color:inherit}.aws button{cursor:pointer}
.aws-user{align-self:flex-end;max-width:85%;padding:6px 12px;border-radius:12px;background:var(--aws-chip);font-size:14px}
.aws-agent{display:flex;align-items:center;gap:10px;font-size:14px;margin-top:-4px}.aws-agent svg{width:18px;height:18px;flex:none}
.aws-card{background:var(--aws-bg);border:1px solid var(--aws-line);border-radius:10px;box-shadow:0 1px 2px #0000000a;overflow:hidden;animation:aws-in .25s both}
.aws-head{display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--aws-line)}
.aws-title{flex:1;min-width:0;font-weight:500}.aws-time{font-weight:400;color:var(--aws-muted)}
.aws-counts{display:flex;gap:10px;font-size:12px;color:var(--aws-muted)}
.aws-count{display:inline-flex;align-items:center;gap:6px}.aws-count i{width:6px;height:6px;border-radius:50%;background:var(--aws-blue)}
.aws-count.is-failed i{background:var(--aws-red)}.aws-count.is-needs-you i{background:var(--aws-amber)}
.aws-list{list-style:none;margin:0;padding:6px 0}
.aws-row{display:flex;align-items:center;gap:10px;padding:7px 14px;animation:aws-in .25s both}
.aws-mark{align-self:flex-start;display:grid;place-items:center;width:14px;height:14px;margin-top:3px;flex:none;color:var(--aws-blue)}
.aws-mark svg{width:14px;height:14px}.aws-mark.is-failed{color:var(--aws-red)}.aws-mark.is-needs-you{color:var(--aws-amber)}
.aws-text{flex:1;min-width:0}.aws-name{font-size:14px}.aws-detail{font-size:12px;color:var(--aws-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aws-act{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:0;border-radius:6px;background:none;font-size:12.5px}
.aws-act:hover{background:var(--aws-chip)}
.aws-act.is-primary{background:var(--aws-fg);color:var(--aws-bg)}
.aws-spin{width:11px;height:11px;border-radius:50%;border:1.5px solid currentColor;border-right-color:transparent;animation:aws-rot .7s linear infinite}
.aws-foot{display:flex;align-items:center;justify-content:space-between;padding:6px 8px 6px 6px;border-top:1px solid var(--aws-line)}
.aws-more,.aws-got{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 8px;border:0;border-radius:6px;background:none;font-size:12.5px;color:var(--aws-muted)}
.aws-more{color:var(--aws-fg)}.aws-more:hover,.aws-got:hover{background:var(--aws-chip)}
.aws-more svg,.aws-got svg{width:13px;height:13px;color:var(--aws-faint);transition:transform .2s}
.aws-divider{display:flex;align-items:center;gap:12px;width:100%;padding:4px 0;border:0;background:none;font-size:12px;color:var(--aws-muted);white-space:nowrap}
.aws-divider span{flex:1;height:1px;background:var(--aws-line)}.aws-divider:hover{color:var(--aws-fg)}
.aws-reply{display:flex;align-items:center;gap:8px;height:48px;padding:0 10px 0 14px;border:1px solid var(--aws-line);border-radius:10px;background:var(--aws-bg);box-shadow:0 1px 2px #0000000a}
.aws-reply input{flex:1;min-width:0;border:0;background:none;outline:none;font-size:14px}.aws-reply input::placeholder{color:var(--aws-faint)}
.aws-reply button{display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:var(--aws-fg);color:var(--aws-bg)}
.aws-reply button:disabled{background:color-mix(in srgb,var(--aws-fg) 22%,transparent);cursor:default}.aws-reply svg{width:14px;height:14px}
.aws-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.aws :focus-visible{outline:2px solid var(--aws-blue);outline-offset:2px}
@keyframes aws-in{from{opacity:0;transform:translateY(3px)}}
@keyframes aws-rot{to{transform:rotate(360deg)}}
@media(max-width:480px){.aws-detail{white-space:normal}.aws-head{flex-wrap:wrap}}
@media(prefers-reduced-motion:reduce){.aws *{animation:none!important;transition:none!important}}
.aws-row{animation:awsrowrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.aws-row:nth-child(1){animation-delay:0ms}.aws-row:nth-child(2){animation-delay:120ms}.aws-row:nth-child(3){animation-delay:240ms}.aws-row:nth-child(4){animation-delay:360ms}.aws-row:nth-child(5){animation-delay:480ms}.aws-row:nth-child(6){animation-delay:600ms}.aws-row:nth-child(7){animation-delay:720ms}.aws-row:nth-child(8){animation-delay:840ms}.aws-row:nth-child(9){animation-delay:960ms}.aws-row:nth-child(10){animation-delay:1080ms}.aws-row:nth-child(11){animation-delay:1200ms}.aws-row:nth-child(12){animation-delay:1320ms}@keyframes awsrowrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.aws-row{animation:none}}
`;
export {
  AwaySummary as A
};
//# sourceMappingURL=away-summary-BnhQ9Zid.js.map
