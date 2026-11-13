import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const defaultLabels = {
  title: "Шийдвэрүүд",
  open: "нээлттэй",
  allDone: "Бүгд шийдэгдсэн. Агент үргэлжлүүлж байна.",
  chosen: "Сонгосон",
  undo: "Буцаах",
  recommended: "Санал болгосон",
  urgent: "Өнөөдөр",
  due: "Хугацаа",
  scope: "Харах",
  all: "Бүгд",
  mine: "Минийх"
};
const decisionInboxChatDemo = {
  title: "ac.me хайрцаг: шийдвэрүүд",
  me: "Ану",
  decisions: [
    {
      id: "hero",
      title: "Өвлийн хайрцгийн хуудсыг аль үндсэн зураг тэргүүлэх вэ?",
      context: "Хоёулаа сайн туршигдсан; үүдний зураг утсан дээр хурдан уншигдана.",
      project: "Өвлийн хайрцгийн нээлт",
      due: "өнөөдөр",
      urgent: true,
      owner: "Ану",
      options: [
        { id: "doorstep", label: "Цастай үүд", recommended: true },
        { id: "unboxing", label: "Хайрцаг задлах ойрын зураг" }
      ]
    },
    {
      id: "pause",
      title: "Түр зогсоох урсгалыг нээлтээс өмнө гаргах уу?",
      context: "Нэг шалгалт унасан хэвээр; засвар жижиг ч хянуулах хэрэгтэй.",
      project: "Өвлийн хайрцгийн нээлт",
      due: "11-р сарын 14",
      owner: "Бат",
      sharedWith: ["Ану"],
      options: [
        { id: "now", label: "Нээлтээс өмнө гаргах", recommended: true },
        { id: "later", label: "Нээлтийн дараа шууд" }
      ]
    },
    {
      id: "darkhan",
      title: "Дархан руу хүргэлт: долоо хоног бүр үү, хоёр долоо хоног тутам уу?",
      context: "Тэндхийн захиалга хүлээлгийн жагсаалтын 18% байна.",
      project: "Үйл ажиллагаа",
      owner: "Цэцэг",
      due: "11-р сарын 18",
      options: [
        { id: "weekly", label: "Долоо хоног бүр" },
        { id: "biweekly", label: "Хоёр долоо хоног тутам", recommended: true },
        { id: "ask", label: "Эхлээд хэрэглэгчдээс асуух" }
      ]
    }
  ]
};
function DecisionInboxChat({
  title,
  decisions = decisionInboxChatDemo.decisions,
  chosen: chosenProp,
  me = decisions === decisionInboxChatDemo.decisions ? decisionInboxChatDemo.me : void 0,
  scope: scopeProp,
  defaultScope = "all",
  onScopeChange,
  onDecide,
  labels: labelsProp,
  className = ""
}) {
  const L = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const list = decisions ?? [];
  const [own, setOwn] = React.useState({});
  const chosen = chosenProp ?? own;
  const pickOf = (d) => d.options.find((o) => o.id === chosen[d.id]);
  const left = list.filter((d) => !pickOf(d)).length;
  const [scopeOwn, setScopeOwn] = React.useState(defaultScope);
  const scope = me ? scopeProp ?? scopeOwn : "all";
  const mineOf = (d) => !!me && (d.owner === me || (d.sharedWith ?? []).includes(me));
  const heading = title ?? (decisions === decisionInboxChatDemo.decisions ? decisionInboxChatDemo.title : void 0) ?? L.title;
  const choose = (d, o) => {
    setOwn((c) => {
      const next = { ...c };
      if (o) next[d.id] = o.id;
      else delete next[d.id];
      return next;
    });
    onDecide?.(d, o);
  };
  return /* @__PURE__ */ jsxs("section", { className: `di ${className}`, "data-cw-root": "decision-inbox-chat", "data-scope": scope, "aria-labelledby": `${uid}-h`, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "di-head", children: [
      /* @__PURE__ */ jsx("h3", { id: `${uid}-h`, className: "di-title", children: heading }),
      me && /* @__PURE__ */ jsx("div", { className: "di-scope", role: "group", "aria-label": L.scope, children: ["all", "mine"].map((v) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-pressed": scope === v,
          "data-active": scope === v || void 0,
          "data-cw-scope-btn": v,
          onClick: () => {
            setScopeOwn(v);
            onScopeChange?.(v);
          },
          children: v === "all" ? L.all : L.mine
        },
        v
      )) }),
      /* @__PURE__ */ jsxs("span", { className: `di-left${left ? "" : " is-zero"}`, "data-cw-left": "", children: [
        /* @__PURE__ */ jsx("span", { "data-cw-left-n": "", children: left }),
        " ",
        L.open
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "di-done", "data-cw-all-done": "", hidden: left > 0, children: [
      /* @__PURE__ */ jsx("span", { className: "di-done-mark", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "m4.5 8.2 2.3 2.3 4.7-4.9", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
      L.allDone
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "di-list", children: list.map((d, i) => {
      const pick = pickOf(d);
      return /* @__PURE__ */ jsxs(
        "li",
        {
          className: `di-item${d.urgent ? " is-urgent" : ""}`,
          "data-cw-item": "",
          "data-cw-other": me && !mineOf(d) ? "" : void 0,
          "data-chosen": pick ? "" : void 0,
          style: { "--i": i },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "di-q", children: [
              /* @__PURE__ */ jsx("span", { className: "di-qtitle", children: d.title }),
              (d.project || d.due || d.owner) && /* @__PURE__ */ jsxs("span", { className: "di-meta", children: [
                d.urgent && /* @__PURE__ */ jsx("span", { className: "di-urgent", children: L.urgent }),
                d.project && /* @__PURE__ */ jsx("span", { children: d.project }),
                d.owner && /* @__PURE__ */ jsxs("span", { title: d.sharedWith?.length ? `${d.owner} + ${d.sharedWith.join(", ")}` : d.owner, children: [
                  d.owner,
                  d.sharedWith?.length ? ` +${d.sharedWith.length}` : ""
                ] }),
                d.due && !d.urgent && /* @__PURE__ */ jsxs("span", { children: [
                  L.due,
                  " ",
                  d.due
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "di-open", children: [
              d.context && /* @__PURE__ */ jsx("p", { className: "di-ctx", children: d.context }),
              /* @__PURE__ */ jsx("div", { className: "di-opts", role: "group", "aria-label": d.title, children: d.options.map((o) => /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: `di-opt${o.recommended ? " is-rec" : ""}`,
                  "data-cw-choose": o.label,
                  "data-cw-prompt": `${d.title} → ${o.label}`,
                  onClick: () => choose(d, o),
                  children: [
                    o.label,
                    o.recommended && /* @__PURE__ */ jsxs("span", { className: "di-rec", children: [
                      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "★" }),
                      /* @__PURE__ */ jsxs("span", { className: "di-sr", children: [
                        ", ",
                        L.recommended
                      ] })
                    ] })
                  ]
                },
                o.id
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "di-picked", role: pick ? "status" : void 0, children: [
              /* @__PURE__ */ jsx("span", { className: "di-check", "aria-hidden": "true", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "m4.5 8.2 2.3 2.3 4.7-4.9", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) }) }),
              /* @__PURE__ */ jsxs("span", { className: "di-picked-text", children: [
                L.chosen,
                ": ",
                /* @__PURE__ */ jsx("strong", { "data-cw-chosen-text": "", children: pick?.label ?? "" })
              ] }),
              /* @__PURE__ */ jsx("button", { type: "button", className: "di-undo", "data-cw-undo": "", onClick: () => choose(d, null), children: L.undo })
            ] })
          ]
        },
        d.id
      );
    }) })
  ] });
}
const css = `
.di{--di-bg:var(--ts-surface,#fff);--di-fg:var(--ts-fg,#18181b);--di-muted:var(--ts-muted,#65656d);--di-faint:var(--ts-faint,#65656d);--di-line:var(--ts-line,#ececef);--di-soft:var(--ts-soft,#f4f4f5);--di-accent:var(--ts-accent,#4f7cf0);--di-accent-soft:var(--ts-accent-soft,#e8f1fe);--di-green:var(--ts-green,#16a34a);--di-green-soft:var(--ts-green-soft,#e9f8ee);--di-amber:var(--ts-amber,#c2620a);--di-amber-soft:var(--ts-amber-soft,#fff4e0);position:relative;width:100%;max-width:560px;color:var(--di-fg);background:var(--di-bg);border:1px solid var(--di-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 var(--ts-font,Inter,system-ui,sans-serif);container:di/inline-size;box-sizing:border-box;overflow:hidden;animation:di-in .34s cubic-bezier(.2,.8,.3,1) both}
:where(.dark,[data-theme=dark]) .di{--di-bg:var(--ts-surface,#1b1b1e);--di-fg:var(--ts-fg,#ececef);--di-muted:var(--ts-muted,#a1a1aa);--di-faint:var(--ts-faint,#9a9aa2);--di-line:var(--ts-line,#2e2e33);--di-soft:var(--ts-soft,#26262a);--di-accent:var(--ts-accent,#7c9cff);--di-accent-soft:var(--ts-accent-soft,#1b2a44);--di-green:var(--ts-green,#4ade80);--di-green-soft:var(--ts-green-soft,#16301f);--di-amber:var(--ts-amber,#eba659);--di-amber-soft:var(--ts-amber-soft,#3a2a12);color-scheme:dark}
.di *{box-sizing:border-box}
.di-title{font-family:var(--ts-font-display,inherit)}:where(.di) button{font:inherit;color:inherit;cursor:pointer}
.di [hidden]{display:none!important}
.di-head{display:flex;align-items:center;gap:10px;padding:11px 12px;border-bottom:1px solid var(--di-line)}
.di[data-scope=mine] [data-cw-other]{display:none!important}
.di-scope{display:inline-flex;gap:2px;flex:none;padding:2px;border-radius:8px;background:var(--di-soft)}
.di-scope button{height:24px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--di-muted);font-size:12.5px;font-weight:500;transition:color .1s,background .15s}
.di-scope button[data-active]{background:var(--di-bg);color:var(--di-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
:where(.dark,[data-theme=dark]) .di-scope button[data-active]{background:#3a3a40}
.di-title{flex:1;min-width:0;margin:0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.di-left{flex:none;height:22px;padding:0 8px;border-radius:11px;background:var(--di-amber-soft);color:color-mix(in srgb,var(--di-amber) 82%,var(--di-fg));font-size:12px;font-weight:500;line-height:22px;font-variant-numeric:tabular-nums;transition:background .2s,color .2s}
.di-left.is-zero{background:var(--di-green-soft);color:color-mix(in srgb,var(--di-green) 70%,var(--di-fg))}
.di-done{display:flex;align-items:center;gap:8px;margin:0;padding:10px 12px;border-bottom:1px solid var(--di-line);background:var(--di-green-soft);color:color-mix(in srgb,var(--di-green) 70%,var(--di-fg));font-size:13px;font-weight:500;animation:di-fade .25s ease both}
.di-done-mark,.di-check{display:grid;place-items:center;flex:none;width:18px;height:18px;border-radius:50%;background:var(--di-green);color:#fff}
:where(.dark,[data-theme=dark]) .di-done-mark,:where(.dark,[data-theme=dark]) .di-check{color:#111}
.di-done-mark svg,.di-check svg{width:12px;height:12px}
.di-list{margin:0;padding:0;list-style:none}
.di-item{position:relative;padding:11px 12px 12px;animation:di-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 55ms + 90ms)}
.di-item+.di-item{border-top:1px solid var(--di-line)}
.di-item.is-urgent::before{content:"";position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:0 2px 2px 0;background:var(--di-amber)}
.di-q{display:flex;flex-direction:column;gap:2px}
.di-qtitle{font-weight:500;line-height:1.35}
.di-meta{display:flex;flex-wrap:wrap;align-items:center;gap:0 8px;font-size:12px;color:var(--di-muted)}
.di-meta>span+span::before{content:"·";margin-right:8px;color:var(--di-faint)}
.di-urgent{color:color-mix(in srgb,var(--di-amber) 82%,var(--di-fg));font-weight:500}
.di-ctx{margin:6px 0 0;font-size:13px;color:var(--di-muted)}
.di-opts{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.di-opt{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:5px 11px;border:1px solid var(--di-line);border-radius:8px;background:var(--di-bg);font-size:13px;font-weight:500;text-align:left;transition:background .15s,border-color .15s,transform .12s}
.di-opt:hover{background:var(--di-soft);border-color:color-mix(in srgb,var(--di-line) 50%,var(--di-faint))}
.di-opt:active{transform:scale(.97)}
.di-opt.is-rec{border-color:color-mix(in srgb,var(--di-accent) 45%,var(--di-line));background:var(--di-accent-soft);color:color-mix(in srgb,var(--di-accent) 60%,var(--di-fg))}
.di-opt.is-rec:hover{background:color-mix(in srgb,var(--di-accent-soft) 70%,var(--di-accent) 12%)}
.di-rec{font-size:11px;color:var(--di-accent)}
.di-picked{display:none;align-items:center;gap:8px;margin-top:8px;font-size:13px;color:var(--di-muted)}
.di-picked strong{color:var(--di-fg);font-weight:500}
.di-picked-text{flex:1;min-width:0}
.di-item[data-chosen] .di-open{display:none}
.di-item[data-chosen] .di-picked{display:flex;animation:di-in .26s cubic-bezier(.2,.8,.3,1) both}
.di-item[data-chosen] .di-check{animation:di-pop .3s cubic-bezier(.2,.8,.3,1.5) both}
.di-item[data-chosen] .di-qtitle{color:var(--di-muted)}
.di-item[data-chosen].is-urgent::before{background:var(--di-green)}
.di-undo{flex:none;height:26px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--di-muted);font-size:12.5px;transition:background .15s,color .15s}
.di-undo:hover{background:var(--di-soft);color:var(--di-fg)}
.di-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.di :focus-visible{outline:2px solid var(--di-accent);outline-offset:1px}
@keyframes di-in{from{opacity:0;transform:translateY(6px)}}
@keyframes di-fade{from{opacity:0}}
@keyframes di-pop{from{transform:scale(.3)}}
@container di (max-width:380px){.di-opts{flex-direction:column;align-items:stretch}.di-opt{justify-content:space-between}}
@media(prefers-reduced-motion:reduce){.di *,.di{animation:none!important;transition:none!important}}
.di-item{animation:diitemrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.di-item:nth-child(1){animation-delay:0ms}.di-item:nth-child(2){animation-delay:120ms}.di-item:nth-child(3){animation-delay:240ms}.di-item:nth-child(4){animation-delay:360ms}.di-item:nth-child(5){animation-delay:480ms}.di-item:nth-child(6){animation-delay:600ms}.di-item:nth-child(7){animation-delay:720ms}.di-item:nth-child(8){animation-delay:840ms}.di-item:nth-child(9){animation-delay:960ms}.di-item:nth-child(10){animation-delay:1080ms}.di-item:nth-child(11){animation-delay:1200ms}.di-item:nth-child(12){animation-delay:1320ms}@keyframes diitemrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.di-item{animation:none}}
`;
export {
  DecisionInboxChat,
  decisionInboxChatDemo
};
//# sourceMappingURL=decision-inbox-chat-D-7dji-J.js.map
