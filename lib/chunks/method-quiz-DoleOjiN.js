import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const methodQuizLabelsMn = {
  title: "Арга зүйн асуумж",
  step: (i, n) => `${i} / ${n}`,
  back: "Буцах",
  next: "Дараах",
  result: "Тохирох арга",
  restart: "Дахин эхлэх",
  cta: "Уулзалт товлох",
  match: "Арга бүрийн оноо",
  firstStep: "Эхний алхам:",
  points: (n) => `${n} оноо`
};
function scoreMethods(questions, answers) {
  const score = { bmc: 0, pmbok: 0, okr: 0, "lean-canvas": 0 };
  for (const q of questions) {
    const o = q.options.find((x) => x.id === answers[q.id]);
    if (o) for (const [m, w] of Object.entries(o.weights)) score[m] += w ?? 0;
  }
  return score;
}
const CSS = `
.mq{font-family:var(--ts-font,Inter,system-ui,sans-serif);background:var(--ts-surface);color:var(--ts-fg);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size}
.mq-bar{display:flex;align-items:center;gap:12px;height:44px;padding:0 14px;border-bottom:1px solid var(--ts-line);background:var(--ts-soft)}
.mq-dots{display:flex;gap:6px}.mq-dots i{width:10px;height:10px;border-radius:50%;background:var(--ts-line)}
.mq-title{font-weight:500;font-size:14px;color:var(--ts-muted)}
.mq-count{margin-left:auto;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint)}
.mq-split{display:flex;min-height:440px}
.mq-rail{width:240px;flex:none;border-right:1px solid var(--ts-line);background:var(--ts-soft);padding:16px 12px;margin:0;list-style:none;display:flex;flex-direction:column;gap:0}
.mq-rail li{position:relative;display:flex;gap:12px;align-items:flex-start;min-height:44px;padding:4px 6px;font-size:14px;color:var(--ts-faint)}
.mq-rail li:not(:last-child)::after{content:"";position:absolute;left:15px;top:30px;bottom:-6px;width:1.5px;background:var(--ts-line)}
.mq-rail li[data-state="done"]::after{background:var(--ts-electric)}
.mq-dot{position:relative;z-index:1;width:20px;height:20px;flex:none;border-radius:50%;border:1.5px solid var(--ts-line);background:var(--ts-surface);display:grid;place-items:center;margin-top:1px}
.mq-rail li[data-state="done"] .mq-dot{border-color:var(--ts-electric);background:var(--ts-electric);color:var(--ts-on-electric)}
.mq-rail li[data-state="now"] .mq-dot{border-color:var(--ts-electric);box-shadow:0 0 0 4px var(--ts-electric-soft)}
.mq-rail li[data-state="now"],.mq-rail li[data-state="done"]{color:var(--ts-fg)}
.mq-rail li[data-state="now"]{font-weight:600}
.mq-main{flex:1;min-width:0;padding:28px 32px;display:flex;flex-direction:column;gap:20px}
.mq-progress{height:4px;border-radius:4px;background:var(--ts-soft-2);overflow:hidden}
.mq-progress i{display:block;height:100%;background:var(--ts-electric);transition:width var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-standard,ease)}
.mq-q{font:400 24px/1.2 Spectral,Georgia,serif;margin:0}
.mq-help{margin:-8px 0 0;font-size:14px;color:var(--ts-muted)}
.mq-opts{display:grid;gap:8px;margin:0;padding:0;border:0}
.mq-opt{display:flex;gap:12px;align-items:flex-start;min-height:44px;padding:12px 14px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);cursor:pointer}
.mq-opt:hover{border-color:var(--ts-faint)}
.mq-opt:has(input:checked){border-color:var(--ts-electric);background:var(--ts-electric-soft)}
.mq-opt:has(input:focus-visible){outline:2px solid var(--ts-electric);outline-offset:2px}
.mq-opt input{appearance:none;width:18px;height:18px;flex:none;margin:1px 0 0;border-radius:50%;border:1.5px solid var(--ts-faint);background:var(--ts-surface);display:grid;place-items:center}
.mq-opt input:checked{border-color:var(--ts-electric)}
.mq-opt input:checked::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--ts-electric)}
.mq-opt b{display:block;font-weight:500;font-size:16px}
.mq-opt small{display:block;font-size:14px;color:var(--ts-muted);margin-top:2px}
.mq-nav{display:flex;gap:8px;justify-content:space-between;margin-top:auto}
.mq-btn{display:inline-flex;align-items:stretch;min-height:44px;border-radius:var(--ts-radius,6px);font:inherit;font-weight:500;font-size:15px;cursor:pointer;padding:0}
.mq-btn>em{font-style:normal;display:flex;align-items:center;padding:0 16px}
.mq-btn>span{display:grid;place-items:center;width:44px;border-left:1.5px solid color-mix(in srgb,currentColor 35%,transparent)}
.mq-btn.primary{border:0;background:var(--ts-electric);color:var(--ts-on-electric)}
.mq-btn.primary:disabled{opacity:.45;cursor:not-allowed}
.mq-btn.ghost{border:0;background:none;color:var(--ts-fg);text-decoration:underline;text-decoration-color:var(--ts-line);text-underline-offset:4px}
.mq-btn.ghost>em{padding:0 4px}
.mq-btn.ghost:disabled{visibility:hidden}
.mq-btn:focus-visible{outline:2px solid var(--ts-electric);outline-offset:2px}
.mq-res{border:1px solid var(--ts-electric);border-radius:var(--ts-radius,6px);background:var(--ts-electric-soft);padding:20px}
.mq-res h3{font:400 28px/1.15 Spectral,Georgia,serif;margin:6px 0 8px}
.mq-res p{margin:0 0 8px;font-size:16px;line-height:1.55}
.mq-label{font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.mq-bars{display:grid;gap:8px}
.mq-row{display:grid;grid-template-columns:120px 1fr 64px;gap:12px;align-items:center;font-size:14px}
.mq-row i{display:block;height:8px;border-radius:4px;background:var(--ts-soft-2);overflow:hidden}
.mq-row i b{display:block;height:100%;background:var(--ts-faint)}
.mq-row[data-top="true"] i b{background:var(--ts-electric)}
.mq-row span:last-child{font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint);text-align:right}
.mq-note{font-size:14px;color:var(--ts-muted);margin:8px 0 0}
.mq-bare{border:0;box-shadow:none;border-radius:0;background:transparent}
.mq-bare .mq-rail{display:none}
.mq-bare .mq-main{padding:0}
.mq-bare .mq-progress{display:none}
@container (max-width:680px){.mq-rail{display:none}.mq-main{padding:20px}}
`;
const check = /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M20 6 9 17l-5-5" }) });
const arrow = /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
  /* @__PURE__ */ jsx("path", { d: "m12 5 7 7-7 7" })
] });
function MethodQuiz({ questions, methods, defaultAnswers = {}, defaultStep = 0, theme = "light", onComplete, onCta, note, bare = false, labels: labelsIn, className = "" }) {
  const labels = { ...methodQuizLabelsMn, ...labelsIn };
  const [answers, setAnswers] = React.useState(defaultAnswers);
  const [step, setStep] = React.useState(defaultStep);
  const n = questions.length;
  const done = step >= n;
  const q = questions[Math.min(step, n - 1)];
  const score = scoreMethods(questions, answers);
  const ranked = [...methods].sort((a, b) => score[b.id] - score[a.id]);
  const max = Math.max(1, ...Object.values(score));
  const top = ranked[0];
  const dark = theme === "dark";
  const uid = React.useId();
  const next = () => {
    const s = step + 1;
    setStep(s);
    if (s === n && top) onComplete?.(top.id, answers);
  };
  return /* @__PURE__ */ jsxs("div", { className: `mq ${bare ? "mq-bare" : ""} ${dark ? "dark" : ""} ${className}`, "data-ts-theme": dark ? "dark" : "cream", "data-theme": dark ? "dark" : "light", children: [
    /* @__PURE__ */ jsx("style", { children: CSS }),
    !bare && /* @__PURE__ */ jsxs("div", { className: "mq-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "mq-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {})
      ] }),
      /* @__PURE__ */ jsx("span", { className: "mq-title", children: labels.title }),
      /* @__PURE__ */ jsx("span", { className: "mq-count", children: done ? labels.result : labels.step(step + 1, n) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mq-split", children: [
      /* @__PURE__ */ jsxs("ol", { className: "mq-rail", children: [
        questions.map((x, i) => /* @__PURE__ */ jsxs("li", { "data-state": i < step ? "done" : i === step ? "now" : "todo", children: [
          /* @__PURE__ */ jsx("span", { className: "mq-dot", children: i < step ? check : null }),
          x.title
        ] }, x.id)),
        /* @__PURE__ */ jsxs("li", { "data-state": done ? "now" : "todo", children: [
          /* @__PURE__ */ jsx("span", { className: "mq-dot" }),
          labels.result
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mq-main", children: [
        /* @__PURE__ */ jsx("div", { className: "mq-progress", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": n, "aria-valuenow": Math.min(step, n), children: /* @__PURE__ */ jsx("i", { style: { width: `${Math.min(step, n) / n * 100}%` } }) }),
        !done ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("h3", { className: "mq-q", id: `${uid}-${q.id}`, children: q.title }),
          q.help && /* @__PURE__ */ jsx("p", { className: "mq-help", children: q.help }),
          /* @__PURE__ */ jsx("fieldset", { className: "mq-opts", "aria-labelledby": `${uid}-${q.id}`, children: q.options.map((o) => /* @__PURE__ */ jsxs("label", { className: "mq-opt", children: [
            /* @__PURE__ */ jsx("input", { type: "radio", name: `${uid}-${q.id}`, value: o.id, checked: answers[q.id] === o.id, onChange: () => setAnswers({ ...answers, [q.id]: o.id }), onKeyDown: (e) => {
              if (e.key === "Enter" && answers[q.id]) next();
            } }),
            /* @__PURE__ */ jsxs("span", { children: [
              /* @__PURE__ */ jsx("b", { children: o.label }),
              o.hint && /* @__PURE__ */ jsx("small", { children: o.hint })
            ] })
          ] }, o.id)) }),
          /* @__PURE__ */ jsxs("div", { className: "mq-nav", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "mq-btn ghost", disabled: step === 0, onClick: () => setStep(step - 1), children: /* @__PURE__ */ jsx("em", { children: labels.back }) }),
            /* @__PURE__ */ jsxs("button", { type: "button", className: "mq-btn primary", disabled: !answers[q.id], onClick: next, children: [
              /* @__PURE__ */ jsx("em", { children: labels.next }),
              /* @__PURE__ */ jsx("span", { children: arrow })
            ] })
          ] })
        ] }) : top ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "mq-res", role: "status", children: [
            /* @__PURE__ */ jsx("span", { className: "mq-label", children: labels.result }),
            /* @__PURE__ */ jsx("h3", { children: top.name }),
            /* @__PURE__ */ jsx("p", { children: top.why }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("b", { children: labels.firstStep }),
              " ",
              top.firstStep
            ] }),
            note && /* @__PURE__ */ jsx("p", { className: "mq-note", children: note })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mq-bars", "aria-label": labels.match, children: ranked.map((m) => /* @__PURE__ */ jsxs("div", { className: "mq-row", "data-top": m.id === top.id, children: [
            /* @__PURE__ */ jsx("span", { children: m.short }),
            /* @__PURE__ */ jsx("i", { children: /* @__PURE__ */ jsx("b", { style: { width: `${score[m.id] / max * 100}%` } }) }),
            /* @__PURE__ */ jsx("span", { children: labels.points(score[m.id]) })
          ] }, m.id)) }),
          /* @__PURE__ */ jsxs("div", { className: "mq-nav", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "mq-btn ghost", onClick: () => {
              setAnswers({});
              setStep(0);
            }, children: /* @__PURE__ */ jsx("em", { children: labels.restart }) }),
            /* @__PURE__ */ jsxs("button", { type: "button", className: "mq-btn primary", onClick: () => onCta?.(top.id), children: [
              /* @__PURE__ */ jsx("em", { children: labels.cta }),
              /* @__PURE__ */ jsx("span", { children: arrow })
            ] })
          ] })
        ] }) : null
      ] })
    ] })
  ] });
}
const methodQuizDemo = {
  questions: [
    { id: "goal", title: "Юуг шийдэх вэ?", help: "Хамгийн ойрыг нь сонго.", options: [
      { id: "model", label: "Бизнесийн загвараа ойлгомжтой болгох", hint: "Хэнд, юу, яаж үнэ цэн өгөхөө", weights: { bmc: 3, "lean-canvas": 1 } },
      { id: "deliver", label: "Том төслийг хугацаанд нь дуусгах", hint: "Хүрээ, хуваарь, эрсдэл", weights: { pmbok: 3 } },
      { id: "focus", label: "Багийг нэг зорилгод нэгтгэх", hint: "Улирлын үр дүн, хэмжүүр", weights: { okr: 3 } },
      { id: "test", label: "Шинэ санааг хурдан турших", hint: "Таамаглал, туршилт", weights: { "lean-canvas": 3, bmc: 1 } }
    ] },
    { id: "stage", title: "Байгууллага ямар шатанд байна?", options: [
      { id: "idea", label: "Санаа, эхний харилцагч", weights: { "lean-canvas": 2 } },
      { id: "grow", label: "Өсөж байгаа, баг нэмэгдэж байна", weights: { okr: 2, bmc: 1 } },
      { id: "steady", label: "Тогтвортой, олон төсөлтэй", weights: { pmbok: 2, bmc: 1 } }
    ] },
    { id: "team", title: "Хэдэн хүн оролцох вэ?", options: [
      { id: "s", label: "1–5", weights: { "lean-canvas": 1, bmc: 1 } },
      { id: "m", label: "6–30", weights: { okr: 2 } },
      { id: "l", label: "30-аас дээш", weights: { pmbok: 2, okr: 1 } }
    ] },
    { id: "horizon", title: "Үр дүнг хэзээ харах вэ?", options: [
      { id: "weeks", label: "Хэдэн долоо хоногт", weights: { "lean-canvas": 2 } },
      { id: "quarter", label: "Улиралд", weights: { okr: 2 } },
      { id: "year", label: "Жил ба түүнээс урт", weights: { pmbok: 2, bmc: 1 } }
    ] }
  ],
  methods: [
    { id: "bmc", name: "Business Model Canvas", short: "BMC", why: "Үнэ цэн, харилцагч, орлогын урсгалаа нэг хуудсанд харуулна.", firstStep: "Есөн блокийг багтайгаа нэг цагт бөглөнө." },
    { id: "pmbok", name: "PMBOK", short: "PMBOK", why: "Хүрээ, хуваарь, эрсдэлийг тодорхой хариуцлагатай удирдана.", firstStep: "Төслийн дүрэм ба хүрээний баримтыг гаргана." },
    { id: "okr", name: "OKR", short: "OKR", why: "Нэг улирлын зорилгод багийг нэгтгэж, хэмжүүрээр явцаа харна.", firstStep: "Улирлын 1–3 зорилго, тус бүрт 3 хэмжүүр тавина." },
    { id: "lean-canvas", name: "Lean Canvas", short: "Lean", why: "Таамаглалаа жижиг туршилтаар хурдан шалгана.", firstStep: "Хамгийн эрсдэлтэй таамаглалыг нэрлээд туршилт товлоно." }
  ]
};
export {
  MethodQuiz as M,
  methodQuizLabelsMn as a,
  methodQuizDemo as m,
  scoreMethods as s
};
//# sourceMappingURL=method-quiz-DoleOjiN.js.map
