import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const ico = (c) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: c });
const decisionIconBase = {
  agent: ico(
    /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.2", children: [
      /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.6" }),
      /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "1.8", fill: "currentColor", stroke: "none" })
    ] })
  ),
  crm: ico(
    /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "#0ea5e9", strokeWidth: "1.2", children: [
      /* @__PURE__ */ jsx("rect", { x: "2", y: "3", width: "12", height: "10", rx: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "6", cy: "7", r: "1.4" }),
      /* @__PURE__ */ jsx("path", { d: "M3.8 11c.4-1.2 1.2-1.8 2.2-1.8s1.8.6 2.2 1.8M9.5 6.5h3M9.5 9h2", strokeLinecap: "round" })
    ] })
  ),
  payments: ico(
    /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "#6366f1", strokeWidth: "1.2", children: [
      /* @__PURE__ */ jsx("rect", { x: "1.8", y: "3.5", width: "12.4", height: "9", rx: "2" }),
      /* @__PURE__ */ jsx("path", { d: "M1.8 6.5h12.4M4.5 10h2.5", strokeLinecap: "round" })
    ] })
  ),
  chat: ico(/* @__PURE__ */ jsx("path", { d: "M3 3.5h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7l-3 2.5v-2.5H3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z", fill: "none", stroke: "#a855f7", strokeWidth: "1.2", strokeLinejoin: "round" })),
  status: ico(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "6", fill: "#3fb950" }),
    /* @__PURE__ */ jsx("path", { d: "M5 8.5 7 10.5l4-4.5", fill: "none", stroke: "#fff", strokeWidth: "1.4", strokeLinecap: "round" })
  ] })),
  doc: ico(
    /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx("path", { d: "M4 1.8h5.2L12 4.6v9.6H4Z" }),
      /* @__PURE__ */ jsx("path", { d: "M9 1.8v3h3M6 8h4M6 10.5h4", strokeLinecap: "round" })
    ] })
  ),
  people: ico(
    /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", children: [
      /* @__PURE__ */ jsx("circle", { cx: "6", cy: "5.5", r: "2.1" }),
      /* @__PURE__ */ jsx("path", { d: "M2.2 13c.5-2.2 1.9-3.3 3.8-3.3s3.3 1.1 3.8 3.3" }),
      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "6", r: "1.7" }),
      /* @__PURE__ */ jsx("path", { d: "M10.8 9.7c1.6 0 2.6 1 3 2.8" })
    ] })
  ),
  check: ico(
    /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.8" }),
      /* @__PURE__ */ jsx("path", { d: "M5.3 8.2 7.2 10l3.5-3.8" })
    ] })
  ),
  money: ico(
    /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", children: [
      /* @__PURE__ */ jsx("rect", { x: "1.8", y: "4", width: "12.4", height: "8", rx: "1.4" }),
      /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "1.8" }),
      /* @__PURE__ */ jsx("path", { d: "M4 6.5v3M12 6.5v3" })
    ] })
  ),
  mail: ico(
    /* @__PURE__ */ jsxs("g", { fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx("rect", { x: "2", y: "3.5", width: "12", height: "9", rx: "1.4" }),
      /* @__PURE__ */ jsx("path", { d: "m2.5 4.5 5.5 4.3 5.5-4.3", strokeLinecap: "round" })
    ] })
  )
};
const decisionIcons = new Proxy(decisionIconBase, {
  get: (t, k) => typeof k === "string" && !(k in t) ? t.agent : Reflect.get(t, k)
});
const I = decisionIcons;
const defaultDecisions = [
  {
    id: "acme",
    agent: "Борлуулалтын агент",
    model: "Судлаач агент",
    icon: I.agent,
    risk: "medium",
    question: "Түнш компани 212 суудлын гэрээгээ 25% хөнгөлөлттэй сунгуулахыг хүсч байна, үгүй бол шилжинэ – яаж хариулах вэ?",
    context: "Сунгалт 9 хоногийн дараа · 212 суудал · өчигдрийн уулзалтаар хоёр удаа асуусан.",
    options: [
      {
        label: "Оронд нь 15% санал болгох",
        icon: I.crm,
        pick: true,
        next: {
          question: "Урт хугацааны гэрээтэй холбох уу?",
          options: [
            { label: "Зөвхөн 2 жилээр", pick: true, effects: ["2028 он хүртэл 15% хөнгөлөлт"], apps: [I.crm, I.payments] },
            { label: "Нэг жилээр", effects: ["Дараа жил хөнгөлөлтгүй сунгагдана"], apps: [I.crm] }
          ]
        }
      },
      {
        label: "Захиралаас асуух",
        icon: I.chat,
        next: {
          question: "Юу хавсаргах вэ?",
          options: [
            { label: "Уулзалтын тэмдэглэл", effects: ["Өчигдрийн уулзалтын хураангуй"], apps: [I.chat, I.crm] },
            { label: "Ашиглалт ба ашгийн хувь", effects: ["Ашгийн хувь 41% болж буурна"], apps: [I.chat, I.payments] }
          ]
        }
      },
      {
        label: "25%-ийг зөвшөөрөх",
        icon: I.payments,
        effects: [
          [
            {
              text: "Жилийн орлого 25%-иар буурна · батламж хэрэгтэй",
              note: "20%-иас дээш хөнгөлөлтийг үнийн санал илгээхээс өмнө борлуулалтын захирал батлах ёстой.",
              source: "Харилцагчийн бүртгэл · батлах дүрэм"
            }
          ]
        ],
        apps: [I.crm, I.payments]
      }
    ]
  },
  {
    id: "incident",
    agent: "Ослын агент",
    model: "Үйл ажиллагааны агент",
    icon: I.agent,
    risk: "high",
    question: "Төлбөрийн алдаа 12 минутын турш 4% байна – харилцагчдад одоо мэдэгдэх үү?",
    context: "14:02-ын байршуулалтын дараа эхэлсэн · буцаалт явагдаж байна.",
    options: [
      { label: "Төлөвийн хуудсанд нийтлэх", icon: I.status, pick: true, effects: ["Харилцагчид нэг минутын дотор «Шалгаж байна» гэж харна"], apps: [I.status] },
      { label: "Буцаалтыг хүлээх", icon: I.agent, effects: ["Ойролцоогоор 6 минут чимээгүй"] },
      { label: "Зөвхөн багт мэдэгдэх", icon: I.chat, effects: ["#осол суваг мэдээлэл авна"], apps: [I.chat] }
    ]
  }
];
function DecisionTree({
  decisions = defaultDecisions,
  onChoose,
  allowOther = true,
  title = "Шийдвэрүүд",
  className = ""
}) {
  const [doneIds, setDoneIds] = React.useState([]);
  const queue = decisions.filter((d2) => !doneIds.includes(d2.id));
  const [pos, setPos] = React.useState(0);
  const d = queue[Math.min(pos, Math.max(0, queue.length - 1))];
  const [hover, setHover] = React.useState(null);
  const [chosen, setChosen] = React.useState(null);
  const [outcome, setOutcome] = React.useState(null);
  const [other, setOther] = React.useState(null);
  const [note, setNote] = React.useState(null);
  const [live, setLive] = React.useState("");
  const timer = React.useRef(void 0);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const reset = () => {
    setChosen(null);
    setOutcome(null);
    setOther(null);
    setHover(null);
    setNote(null);
  };
  const finish = (msg) => {
    if (!d) return;
    setOutcome(msg);
    setLive(msg);
    timer.current = window.setTimeout(() => {
      setDoneIds((ids) => [...ids, d.id]);
      setPos(0);
      reset();
    }, 1800);
  };
  const choose = async (i, then) => {
    if (!d || outcome) return;
    const opt = d.options[i];
    if (opt.next && then == null) {
      setChosen(i);
      setLive(`${opt.label} – сонгосон. ${opt.next.question}`);
      return;
    }
    setChosen(i);
    const thenOpt = then != null ? opt.next?.options[then] : void 0;
    const r = await onChoose?.(d, { index: i, option: opt, then: thenOpt });
    finish(typeof r === "string" ? r : `${thenOpt ? `${opt.label} · ${thenOpt.label}` : opt.label} – сонгосон. ${d.agent} үргэлжлүүлнэ.`);
  };
  const sendOther = async () => {
    if (!d || !other?.trim()) return;
    const r = await onChoose?.(d, { other: other.trim() });
    finish(typeof r === "string" ? r : `Илгээсэн (${d.agent}): «${other.trim()}»`);
  };
  const go = (n) => {
    if (!queue.length) return;
    setPos((p) => (p + n + queue.length) % queue.length);
    reset();
  };
  const text = (t, key) => typeof t === "string" ? t : t.map(
    (p, i) => typeof p === "string" ? /* @__PURE__ */ jsx(React.Fragment, { children: p }, i) : /* @__PURE__ */ jsxs("span", { className: "dt-flagwrap", children: [
      /* @__PURE__ */ jsx(
        "mark",
        {
          tabIndex: 0,
          className: "dt-flag",
          "aria-describedby": note === `${key}${i}` ? `dt-note-${key}${i}` : void 0,
          onMouseEnter: () => setNote(`${key}${i}`),
          onMouseLeave: () => setNote(null),
          onFocus: () => setNote(`${key}${i}`),
          onBlur: () => setNote(null),
          children: p.text
        }
      ),
      note === `${key}${i}` && /* @__PURE__ */ jsxs("span", { role: "tooltip", id: `dt-note-${key}${i}`, className: "dt-note", children: [
        /* @__PURE__ */ jsxs("span", { className: "dt-note-h", children: [
          /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("path", { d: "M8 2.5 14 13H2Z", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" }),
            /* @__PURE__ */ jsx("path", { d: "M8 6.5v3M8 11.2v.1", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" })
          ] }),
          "Агентын тэмдэглэл"
        ] }),
        p.note,
        p.source && /* @__PURE__ */ jsx("span", { className: "dt-note-s", children: p.source })
      ] })
    ] }, i)
  );
  const flags = React.useMemo(() => {
    const out = [];
    d?.options.forEach((o, i) => o.effects?.forEach((e, j) => Array.isArray(e) && e.forEach((p, k) => typeof p !== "string" && out.push(`e${i}-${j}${k}`))));
    return out;
  }, [d]);
  const onKey = (e) => {
    if (!d) return;
    const t = e.target;
    if (t.tagName === "TEXTAREA") {
      if (e.key === "Enter" && !e.shiftKey) e.preventDefault(), sendOther();
      if (e.key === "Escape") setOther(null);
      return;
    }
    const n = Number(e.key);
    const max = d.options.length + (allowOther ? 1 : 0);
    if (n >= 1 && n <= max) {
      if (n === d.options.length + 1) setOther("");
      else if (chosen != null && d.options[chosen].next && !outcome) choose(chosen, n - 1);
      else choose(n - 1);
    } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "j") go(1);
    else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "k") go(-1);
    else if (e.key.toLowerCase() === "f" && flags.length) setNote((cur) => flags[(flags.indexOf(cur ?? "") + 1) % flags.length]);
    else if (e.key === "Escape") setNote(null), setOther(null);
  };
  const Apps = ({ apps }) => apps?.length ? /* @__PURE__ */ jsx("span", { className: "dt-apps", children: apps.map((a, i) => /* @__PURE__ */ jsx("span", { children: a }, i)) }) : null;
  return /* @__PURE__ */ jsxs("section", { className: `dt ${className}`, "aria-label": title, onKeyDown: onKey, tabIndex: -1, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "dt-bar", children: [
      /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", className: "dt-mark", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { cx: "3.5", cy: "8", r: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
        /* @__PURE__ */ jsx("circle", { cx: "12.5", cy: "3.5", r: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
        /* @__PURE__ */ jsx("circle", { cx: "12.5", cy: "12.5", r: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
        /* @__PURE__ */ jsx("path", { d: "M5.5 8h2.5M8 8c0-3 1-4.5 2.5-4.5M8 8c0 3 1 4.5 2.5 4.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3" })
      ] }),
      /* @__PURE__ */ jsx("strong", { children: title }),
      /* @__PURE__ */ jsx("span", { className: "dt-wait", children: queue.length ? `${queue.length} таныг хүлээж байна` : "Бүгд шийдэгдсэн" }),
      queue.length > 0 && /* @__PURE__ */ jsxs("span", { className: "dt-pager", children: [
        /* @__PURE__ */ jsx("span", { className: "dt-dots", "aria-hidden": "true", children: queue.map((q, i) => /* @__PURE__ */ jsx("i", { className: i === pos ? "is-on" : "" }, q.id)) }),
        pos + 1,
        "/",
        queue.length
      ] })
    ] }),
    d ? /* @__PURE__ */ jsxs("div", { className: `dt-tree ${outcome ? "is-done" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "dt-qcol", children: [
        d.risk && d.risk !== "low" && /* @__PURE__ */ jsx("span", { className: `dt-risk is-${d.risk}`, children: d.risk === "high" ? "Өндөр эрсдэл" : "Дунд эрсдэл" }),
        /* @__PURE__ */ jsxs("div", { className: "dt-q", children: [
          /* @__PURE__ */ jsxs("div", { className: "dt-agent", children: [
            /* @__PURE__ */ jsx("span", { className: "dt-agent-i", children: d.icon }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("strong", { children: d.agent }),
              d.model && /* @__PURE__ */ jsx("small", { children: d.model })
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "dt-question", children: d.question }),
          d.context && /* @__PURE__ */ jsx("p", { className: "dt-context", children: d.context })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("ol", { className: "dt-branches", children: [
        d.options.map((o, i) => {
          const state = chosen == null ? hover != null && hover !== i ? "is-back" : hover === i ? "is-hot" : "" : chosen === i ? "is-chosen" : "is-gone";
          return /* @__PURE__ */ jsxs("li", { className: `dt-branch ${state}`, onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null), children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: `dt-opt ${o.pick ? "is-pick" : ""}`,
                "aria-label": `${o.label}${o.pick ? ", агентын сонголт" : ""}`,
                "aria-keyshortcuts": String(i + 1),
                onClick: () => choose(i),
                disabled: !!outcome,
                children: [
                  /* @__PURE__ */ jsx("kbd", { children: i + 1 }),
                  o.icon && /* @__PURE__ */ jsx("span", { className: "dt-i", children: o.icon }),
                  /* @__PURE__ */ jsxs("span", { className: "dt-ol", children: [
                    o.label,
                    o.pick && /* @__PURE__ */ jsx("small", { children: "Агентын сонголт" })
                  ] })
                ]
              }
            ),
            o.next ? /* @__PURE__ */ jsxs("div", { className: `dt-next ${chosen === i ? "is-awake" : ""}`, children: [
              /* @__PURE__ */ jsx("div", { className: "dt-nq", children: o.next.question }),
              /* @__PURE__ */ jsx("ul", { className: "dt-subs", children: o.next.options.map((s, j) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "dt-card",
                  disabled: chosen !== i || !!outcome,
                  "aria-label": `${s.label}${s.pick ? ", агентын сонголт" : ""}`,
                  onClick: () => choose(i, j),
                  children: [
                    /* @__PURE__ */ jsxs("span", { className: "dt-card-t", children: [
                      s.label,
                      s.pick && /* @__PURE__ */ jsx("small", { children: "Агентын сонголт" })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "dt-card-e", children: [
                      /* @__PURE__ */ jsx("span", { children: s.effects?.map((e, k) => /* @__PURE__ */ jsx(React.Fragment, { children: text(e, `s${i}${j}-${k}`) }, k)) }),
                      /* @__PURE__ */ jsx(Apps, { apps: s.apps })
                    ] })
                  ]
                }
              ) }, j)) })
            ] }) : o.effects?.length ? /* @__PURE__ */ jsxs("div", { className: "dt-effect", children: [
              /* @__PURE__ */ jsx("span", { children: o.effects.map((e, k) => /* @__PURE__ */ jsx(React.Fragment, { children: text(e, `e${i}-${k}`) }, k)) }),
              /* @__PURE__ */ jsx(Apps, { apps: o.apps })
            ] }) : /* @__PURE__ */ jsx("span", {})
          ] }, i);
        }),
        allowOther && /* @__PURE__ */ jsxs("li", { className: `dt-branch ${chosen != null ? "is-gone" : ""}`, children: [
          other == null ? /* @__PURE__ */ jsxs("button", { type: "button", className: "dt-opt is-other", onClick: () => setOther(""), "aria-keyshortcuts": String(d.options.length + 1), disabled: !!outcome, children: [
            /* @__PURE__ */ jsx("kbd", { children: d.options.length + 1 }),
            /* @__PURE__ */ jsx("span", { className: "dt-ol", children: "Бусад…" })
          ] }) : /* @__PURE__ */ jsx(
            "textarea",
            {
              className: "dt-other",
              autoFocus: true,
              rows: 2,
              value: other,
              placeholder: `${d.agent}: юу хийхийг бичнэ үү`,
              "aria-label": "Өөрийн заавар",
              onChange: (e) => setOther(e.target.value)
            }
          ),
          /* @__PURE__ */ jsx("span", {})
        ] })
      ] })
    ] }, d.id) : /* @__PURE__ */ jsx("div", { className: "dt-empty", children: "Хүлээгдэж буй зүйл алга – агентууд үргэлжлүүлж байна." }),
    /* @__PURE__ */ jsx("footer", { className: "dt-foot", children: outcome ? /* @__PURE__ */ jsxs("span", { className: "dt-outcome", children: [
      /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m3.5 8.5 3 3 6-7", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round" }) }),
      outcome
    ] }) : d ? /* @__PURE__ */ jsxs(Fragment, { children: [
      "Салбар сонгох ",
      /* @__PURE__ */ jsx("kbd", { children: "1" }),
      " – ",
      /* @__PURE__ */ jsx("kbd", { children: d.options.length + (allowOther ? 1 : 0) }),
      /* @__PURE__ */ jsx("span", { className: "dt-sep", children: "·" }),
      /* @__PURE__ */ jsxs("button", { type: "button", className: "dt-nextbtn", onClick: () => go(1), disabled: queue.length < 2, children: [
        "дараах ",
        /* @__PURE__ */ jsx("kbd", { children: "→" })
      ] })
    ] }) : null }),
    /* @__PURE__ */ jsx("p", { className: "dt-sr", "aria-live": "polite", children: live })
  ] });
}
const css = `
.dt{--dt-bg:#fff;--dt-fg:#18181b;--dt-muted:#65656d;--dt-faint:#65656d;--dt-line:#ececef;--dt-wire:#dcdce0;--dt-chip:#f4f4f5;--dt-blue:#2563eb;--dt-link:#82bcff;--dt-amber:#fde7b0;width:100%;max-width:780px;color:var(--dt-fg);font:400 13px/1.45 Inter,system-ui,sans-serif;outline:none;container-type:inline-size}
:where(.dark,[data-theme=dark]) .dt{--dt-bg:#1b1b1e;--dt-fg:#ececef;--dt-muted:#a1a1aa;--dt-faint:#9a9aa2;--dt-line:#2e2e33;--dt-wire:#3f3f46;--dt-chip:#26262a;--dt-amber:#5a4410;--dt-blue:#60a5fa;color-scheme:dark}
.dt *{box-sizing:border-box}.dt button,.dt textarea{font:inherit;color:inherit}.dt button{cursor:pointer}
.dt-bar{display:flex;align-items:center;gap:8px}
.dt-mark{width:15px;height:15px;color:var(--dt-blue)}
.dt-bar strong{font-size:14px;font-weight:500}.dt-wait{font-size:12px;color:var(--dt-muted)}
.dt-pager{display:inline-flex;align-items:center;gap:10px;margin-left:auto;font-size:12px;color:var(--dt-muted)}
.dt-dots{display:flex;gap:3px}.dt-dots i{width:4px;height:4px;border-radius:50%;background:var(--dt-wire)}.dt-dots i.is-on{background:var(--dt-fg)}
.dt-tree{display:grid;grid-template-columns:205px 1fr;gap:28px;align-items:center;margin-top:44px;animation:dt-in .4s both}
.dt-qcol{position:relative}
.dt-qcol::after{content:"";position:absolute;right:-28px;top:50%;width:14px;border-top:1px solid var(--dt-wire)}
.dt-risk{position:absolute;top:-22px;left:0;padding:1px 6px;border-radius:4px;font-size:12px}
.dt-risk.is-medium{background:#fdf0d5;color:#9a4f0c}.dt-risk.is-high{background:#fde2e2;color:#b91c1c}
.dt-q{padding:14px 16px;border:1px solid var(--dt-line);border-radius:8px;background:var(--dt-bg);box-shadow:0 1px 2px #0000000a}
.dt-agent{display:flex;align-items:center;gap:10px}
.dt-agent-i{display:grid;place-items:center;width:28px;height:28px;border-radius:7px;box-shadow:0 0 0 1px var(--dt-line)}.dt-agent-i svg{width:15px;height:15px}
.dt-agent strong{display:block;font-weight:500;font-size:14px;line-height:1.2}.dt-agent small{font-size:12px;color:var(--dt-muted)}
.dt-question{margin:14px 0 0;font-size:14px;font-weight:500;line-height:1.45}
.dt-context{margin:12px 0 0;font-size:12px;color:var(--dt-muted)}
.dt-branches{list-style:none;margin:0;padding:0}
.dt-branch{position:relative;display:grid;grid-template-columns:185px 1fr;gap:22px;align-items:center;padding:6px 0 6px 14px;transition:opacity .25s}
.dt-branch::before{content:"";position:absolute;left:0;top:0;bottom:0;border-left:1px solid var(--dt-wire)}
.dt-branch:first-child::before{top:50%;border-top-left-radius:6px}.dt-branch:last-child::before{bottom:50%}
.dt-branch::after{content:"";position:absolute;left:0;top:50%;width:14px;border-top:1px solid var(--dt-wire)}
.dt-branch.is-back,.dt-branch.is-gone{opacity:.35}
.dt-branch.is-hot::after,.dt-branch.is-chosen::after{border-color:var(--dt-link)}
.dt-opt{position:relative;display:flex;align-items:center;gap:10px;width:100%;min-height:36px;padding:7px 12px;border:1px solid var(--dt-line);border-radius:7px;background:var(--dt-bg);box-shadow:0 1px 2px #0000000a;text-align:left;font-size:14px;transition:border-color .15s,box-shadow .15s}
.dt-opt::after{content:"";position:absolute;right:-23px;top:50%;width:22px;border-top:1px solid var(--dt-wire)}
.dt-opt:hover:not(:disabled){border-color:var(--dt-wire)}
.dt-opt.is-pick{border-color:var(--dt-link)}
.dt-opt.is-other{border-style:solid;color:var(--dt-muted);background:color-mix(in srgb,var(--dt-chip) 50%,var(--dt-bg));box-shadow:none}.dt-opt.is-other::after{display:none}
.dt-opt:disabled{cursor:default}
.dt kbd{display:inline-grid;place-items:center;min-width:16px;height:16px;padding:0 3px;border-radius:3px;background:var(--dt-chip);font:500 10px/1 Inter,system-ui,sans-serif;color:var(--dt-muted)}
.dt-i{display:grid;place-items:center;width:14px;height:14px}.dt-i svg{width:13px;height:13px}
.dt-ol{display:flex;flex-direction:column;line-height:1.3}.dt-ol small{font-size:12px;color:var(--dt-blue)}

.dt-nq{display:inline-block;padding:4px 10px;border:1px solid var(--dt-line);border-radius:7px;background:var(--dt-bg);font-size:13px}
.dt-subs{list-style:none;margin:6px 0 0;padding:0 0 0 14px;position:relative}
.dt-subs li{position:relative;padding:4px 0 4px 8px}
.dt-subs li::before{content:"";position:absolute;left:-14px;top:-6px;bottom:0;border-left:1px solid var(--dt-wire)}
.dt-subs li:last-child::before{bottom:50%}
.dt-subs li::after{content:"";position:absolute;left:-14px;top:50%;width:22px;border-top:1px solid var(--dt-wire)}
.dt-card{display:flex;flex-direction:column;align-items:stretch;gap:3px;width:100%;max-width:230px;padding:8px 10px;border:1px solid var(--dt-line);border-radius:7px;background:var(--dt-bg);text-align:left}
.dt-next.is-awake .dt-card{opacity:1;box-shadow:0 1px 2px #0000000d}
.dt-next.is-awake .dt-card:hover{border-color:var(--dt-link)}
.dt-card:disabled{cursor:default;opacity:1}
.dt-next:not(.is-awake) .dt-card{color:var(--dt-muted);box-shadow:none}
.dt-card-t{font-size:13px}.dt-card-t small{margin-left:8px;font-size:12px;color:var(--dt-blue)}
.dt-card-e,.dt-effect{display:flex;align-items:center;gap:12px;font-size:12px;color:var(--dt-muted)}
.dt-effect{max-width:240px;padding:8px 10px;border:1px solid var(--dt-line);border-radius:7px;background:color-mix(in srgb,var(--dt-chip) 40%,var(--dt-bg))}
.dt-apps{display:flex;gap:4px;margin-left:auto;flex:none}.dt-apps span{display:grid;place-items:center;width:14px;height:14px}.dt-apps svg{width:12px;height:12px}
.dt-flagwrap{position:relative}
.dt-flag{padding:1px 2px;background:var(--dt-amber);color:var(--dt-fg);border-bottom:1px solid #f59e0b;cursor:help;outline:none}
.dt-flag:focus-visible{box-shadow:0 0 0 2px var(--dt-blue)}
.dt-note{position:absolute;right:-20px;bottom:24px;z-index:3;display:block;width:300px;padding:10px 12px;border:1px solid var(--dt-line);border-radius:10px;background:var(--dt-bg);box-shadow:0 10px 30px #0000001f;font-size:13px;line-height:1.45;color:var(--dt-fg);animation:dt-pop .16s both}
.dt-note-h{display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:11px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:#d97706}.dt-note-h svg{width:12px;height:12px}
.dt-note-s{display:inline-block;margin-top:6px;padding:1px 6px;border-radius:4px;background:var(--dt-chip);font-size:12px;color:var(--dt-muted)}
.dt-other{display:block;width:100%;min-height:52px;max-height:76px;padding:7px 10px;border:1px solid var(--dt-wire);border-radius:7px;background:var(--dt-bg);resize:none;outline:none;font-size:13px}
.dt-other:focus{border-color:var(--dt-muted)}
.dt-empty{padding:60px 0;text-align:center;color:var(--dt-faint)}
.dt-foot{display:flex;align-items:center;gap:6px;margin-top:26px;font-size:12px;color:var(--dt-muted)}
.dt-sep{margin:0 4px;color:var(--dt-faint)}
.dt-nextbtn{display:inline-flex;align-items:center;gap:6px;border:0;background:none;padding:0;color:var(--dt-muted)}.dt-nextbtn:disabled{opacity:.5;cursor:default}
.dt-outcome{display:inline-flex;align-items:center;gap:6px;color:var(--dt-fg)}.dt-outcome svg{width:13px;height:13px;color:#16a34a}
.dt-tree.is-done{animation:dt-out .4s 1.4s both}
.dt-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.dt :focus-visible{outline:2px solid var(--dt-blue);outline-offset:2px}
@keyframes dt-in{from{opacity:0;transform:translateX(-6px)}}@keyframes dt-out{to{opacity:0}}@keyframes dt-pop{from{opacity:0;transform:scale(.97)}}
@container (max-width:640px){.dt-tree{grid-template-columns:minmax(0,1fr);gap:16px}.dt-qcol::after,.dt-opt::after{display:none}.dt-branch{grid-template-columns:minmax(0,1fr);gap:6px}.dt-next,.dt-effect{margin-left:12px}.dt-note{right:auto;left:0;width:240px}}
@media(prefers-reduced-motion:reduce){.dt *,.dt-tree{animation:none!important;transition:none!important}}
.dt-branch{animation:dtbranchrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.dt-branch:nth-child(1){animation-delay:0ms}.dt-branch:nth-child(2){animation-delay:130ms}.dt-branch:nth-child(3){animation-delay:260ms}.dt-branch:nth-child(4){animation-delay:390ms}.dt-branch:nth-child(5){animation-delay:520ms}.dt-branch:nth-child(6){animation-delay:650ms}.dt-branch:nth-child(7){animation-delay:780ms}.dt-branch:nth-child(8){animation-delay:910ms}.dt-branch:nth-child(9){animation-delay:1040ms}.dt-branch:nth-child(10){animation-delay:1170ms}.dt-branch:nth-child(11){animation-delay:1300ms}.dt-branch:nth-child(12){animation-delay:1430ms}@keyframes dtbranchrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.dt-branch{animation:none}}
`;
export {
  DecisionTree as D,
  decisionIcons as d
};
//# sourceMappingURL=decision-tree-tTQiCAod.js.map
