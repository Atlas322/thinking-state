import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { C as CitedAnswer } from "./cited-answer-eJy9EKIh.js";
import { w as withMentions } from "./entity-mention-D6hKnZFi.js";
import { c as SourceIcon, d as SourcePreview } from "./source-preview-BedfD0w3.js";
import { T as ThinkingState } from "./thinking-state-8FczN4L4.js";
import { A as AppShell } from "./app-shell-C_3YLmbU.js";
import { d as askDemoSources, e as askDemoAnswer, f as askDemoThinking } from "./ask-demo-data-Cu4yAwlg.js";
import { u as useScenario } from "./scenario-Dyt1dhWq.js";
import { L as LOOP, m as motionVar } from "./tokens-jmej6VeF.js";
const askWindowLabelsMn = {
  title: "Second Brain",
  send: "Асуух",
  placeholder: "Тархинаасаа асуу…",
  chats: "Тархины чатууд",
  newChat: "Шинэ чат",
  brain: "Тархи",
  pagesRead: (n) => `${n} хуудас уншсан`
};
const askNavMn = [
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "today", label: "Өнөөдөр", icon: "today" },
  { id: "projects", label: "Төслүүд", icon: "projects" },
  { id: "areas", label: "Хүрээ", icon: "areas" },
  { id: "resources", label: "Нөөц", icon: "resources" },
  { id: "agents", label: "Агентууд", icon: "agents" }
];
const I = (d, size) => /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { width: size, height: size, strokeWidth: "var(--ts-icon-stroke,1.25)" }, children: d });
const upIcon = I(/* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx("path", { d: "m5 12 7-7 7 7" }),
  /* @__PURE__ */ jsx("path", { d: "M12 19V5" })
] }), 16);
const CSS = `
.aw{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;line-height:1.5;font-weight:400;color:var(--ts-fg);max-width:720px}
.aw *{box-sizing:border-box}
.aw .ash-main{padding:0;display:flex;overflow:hidden;background:var(--ts-surface)}.aw .ash-view{flex:1;display:flex;min-width:0;min-height:0}
.aw-new{color:var(--ts-fg)}
/* Compact controls keep a 44px hit area through an invisible halo. */
.aw-item::after,.aw-send::after,.aw .sp-chip::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}
.aw-main{flex:1;min-width:0;display:flex;flex-direction:column}
.aw-thread{flex:1;min-height:0;overflow:auto;padding:18px 28px 8px;display:flex;flex-direction:column;gap:14px}
.aw-q{align-self:flex-end;max-width:82%;padding:7px 12px;border-radius:calc(var(--ts-radius,6px) + 4px);background:color-mix(in srgb,var(--ts-fg) 6%,transparent);font-size:13px}
.aw-chips{position:relative;display:flex;flex-wrap:wrap;gap:6px}
.aw .sp-chip{position:relative;min-height:24px;height:24px;padding:0 8px;font-size:12px;border-color:color-mix(in srgb,var(--ts-line) 80%,transparent);background:transparent}
.aw .sp-chip svg{width:12px;height:12px}
.aw .sp-pop{width:280px;padding:12px}.aw .sp-title{font-size:13px}.aw .sp-quote{margin-top:10px;font-size:13px}.aw .sp-foot{margin-top:10px}
.aw .sp-open{position:relative;min-height:30px;font-size:12px}.aw .sp-open>span{width:30px}
.aw .sp-open::after,.aw .sp-x::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}.aw .sp-x{position:relative}
.aw .ca{max-width:none;border:0;box-shadow:none;background:transparent;font:400 15px/1.6 var(--ts-font,Inter,system-ui,sans-serif)}
.aw .ca-body{padding:0}
.aw .ca-head{font:400 11px var(--ts-font,Inter,sans-serif);color:var(--ts-faint);margin-bottom:6px}
.aw .ca-chips,.aw .ca-foot{display:none}
.aw-compose{margin:8px 20px 16px;display:flex;align-items:flex-end;gap:8px;padding:8px 8px 8px 12px;border:1px solid color-mix(in srgb,var(--ts-line) 90%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);background:var(--ts-page);box-shadow:0 1px 2px rgb(8 12 40/.05)}
.aw-compose:focus-within{border-color:var(--ts-faint)}
.aw-compose input{flex:1;min-width:0;height:26px;border:0;background:none;outline:0;font:inherit;font-size:13px;color:var(--ts-fg)}
.aw-compose input::placeholder{color:var(--ts-faint)}
.aw-send{position:relative;display:grid;place-items:center;flex:none;width:26px;height:26px;border:0;border-radius:var(--ts-radius,6px);background:var(--ts-electric);color:var(--ts-on-electric);cursor:pointer}
.aw-send:focus-visible,.aw-item:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.aw .ts-think,.aw [class*="thinking"]{font-size:13px}
.aw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.aw-in{animation:aw-in ${motionVar.duration("md")} ${motionVar.easing("enter")} both}
.aw-chips .aw-in{animation-delay:calc(var(--i,0) * ${LOOP.stagger}ms)}
@keyframes aw-in{from{opacity:0;transform:translateY(4px)}}
.aw-q.aw-typing::after{content:"";display:inline-block;width:1px;height:1em;margin-left:2px;vertical-align:-2px;background:currentColor;animation:aw-caret var(--ts-motion-dur-xl,900ms) steps(1) infinite}
@keyframes aw-caret{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.aw-in,.aw-q.aw-typing::after{animation:none}}
@container (max-width:560px){.aw-side{display:none}.aw-thread{padding:14px 14px 6px}.aw-compose{margin:6px 10px 10px}.aw .sp{position:static}.aw .sp-pop{left:0;right:0;width:auto;max-width:none}}
`;
function AskWindow({
  question,
  answer,
  sources,
  workspace,
  nav = askNavMn,
  chats = [],
  activeChat,
  theme = "light",
  openSource,
  sidebar = true,
  onAsk,
  mentions,
  onOpenSource,
  onNavigate,
  thinking = [],
  play = "auto",
  phase,
  onPhase,
  labels: labelsIn,
  className = ""
}) {
  const labels = { ...askWindowLabelsMn, ...labelsIn };
  const [text, setText] = React.useState("");
  const [focus, setFocus] = React.useState(openSource ?? null);
  const frames = React.useMemo(() => {
    const out = [];
    const T = thinking.length, C = sources.length, A = answer.length;
    out.push({ state: { phase: "ask", typed: 0.45, steps: 0, chips: 0, segs: 0 }, hold: 260 });
    out.push({ state: { phase: "ask", typed: 1, steps: 0, chips: 0, segs: 0 }, hold: 420 });
    for (let i = 1; i <= T; i++) out.push({ state: { phase: "think", typed: 1, steps: i, chips: 0, segs: 0 }, hold: 650 });
    out.push({ state: { phase: "sources", typed: 1, steps: T, chips: C, segs: 0 }, hold: 300 + C * 140 });
    for (let i = 1; i <= A; i++) out.push({ state: { phase: "answer", typed: 1, steps: T, chips: C, segs: i }, hold: 480 });
    out.push({ state: { phase: "done", typed: 1, steps: T, chips: C, segs: A }, hold: 1e3 });
    return out;
  }, [thinking.length, sources.length, answer.length]);
  const run = useScenario(frames, { loops: 1, rest: 0 });
  const finished = React.useRef(false);
  const finishedFor = React.useRef(frames);
  if (finishedFor.current !== frames) {
    finishedFor.current = frames;
    finished.current = false;
  }
  const last = frames[frames.length - 1].state;
  const contentKey = `${question}|${answer.length}|${sources.map((x) => x.id).join(",")}`;
  const playedKey = React.useRef(contentKey);
  const fresh = playedKey.current !== contentKey;
  if (fresh) finished.current = false;
  else if (run.state?.phase === "done") finished.current = true;
  React.useEffect(() => {
    if (playedKey.current === contentKey) return;
    playedKey.current = contentKey;
    setFocus(null);
    run.replay();
  }, [contentKey]);
  const frozen = phase ? [...frames].reverse().find((x) => x.state.phase === phase)?.state : void 0;
  const f = frozen ?? (play === "static" ? last : fresh ? frames[0].state : run.loopState === "paused" || finished.current ? last : run.state ?? last);
  const animate = f !== last || run.playing;
  const onPhaseRef = React.useRef(onPhase);
  onPhaseRef.current = onPhase;
  React.useEffect(() => {
    onPhaseRef.current?.(f.phase);
  }, [f.phase]);
  const shownQuestion = f.typed >= 1 ? question : question.slice(0, Math.ceil(question.length * f.typed));
  const [current, setCurrent] = React.useState(activeChat ?? chats[0]?.id);
  React.useEffect(() => {
    if (activeChat) setCurrent(activeChat);
  }, [activeChat]);
  const dark = theme === "dark";
  const cited = sources.map((s) => ({ id: s.id, title: s.title, site: s.label, date: s.date, quote: s.quote, highlight: s.highlight, icon: /* @__PURE__ */ jsx(SourceIcon, { kind: s.kind, size: 12, tile: false, logo: s.logo, brand: s.brand }) }));
  const preview = (s) => ({ id: s.id, title: s.title, kind: s.kind, kindLabel: s.label, date: s.date, quote: s.quote, highlight: s.highlight, logo: s.logo, brand: s.brand });
  const submit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAsk?.(text.trim());
      setText("");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `aw ${dark ? "dark" : ""} ${className}`, "data-ts-theme": dark ? "dark" : "cream", "data-theme": dark ? "dark" : "light", children: [
    /* @__PURE__ */ jsx("style", { children: CSS }),
    /* @__PURE__ */ jsx(
      AppShell,
      {
        company: { name: workspace?.name ?? labels.title, note: workspace?.note ? `${labels.brain} · ${workspace.note}` : labels.brain },
        counts: { inbox: nav.find((n) => n.id === "inbox")?.count },
        active: "ask",
        nav: sidebar,
        height: 400,
        title: labels.title,
        onNavigate: (v) => onNavigate?.(v),
        onAsk: () => onNavigate?.("new"),
        navExtra: /* @__PURE__ */ jsxs(Fragment, { children: [
          chats.length > 0 && /* @__PURE__ */ jsx("p", { className: "ash-h", children: labels.chats }),
          chats.map((c) => /* @__PURE__ */ jsx("button", { type: "button", className: "ash-it", "aria-current": current === c.id ? "page" : void 0, onClick: () => {
            setCurrent(c.id);
            onNavigate?.(`chat:${c.id}`);
          }, children: /* @__PURE__ */ jsx("span", { children: c.title }) }, c.id))
        ] }),
        children: /* @__PURE__ */ jsxs("div", { className: "aw-main", children: [
          /* @__PURE__ */ jsxs("div", { className: "aw-thread", ref: run.ref, ...run.attrs, "data-phase": f.phase, children: [
            /* @__PURE__ */ jsxs("div", { className: `aw-q ${f.typed < 1 ? "aw-typing" : ""}`, children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": f.typed < 1, children: shownQuestion }),
              f.typed < 1 && /* @__PURE__ */ jsx("span", { className: "aw-sr", children: question })
            ] }),
            thinking.length > 0 && f.steps > 0 && /* @__PURE__ */ jsx("div", { className: animate ? "aw-in" : void 0, children: /* @__PURE__ */ jsx(ThinkingState, { steps: thinking.slice(0, f.steps), live: { done: f.phase !== "think", seconds: f.steps }, collapseOnDone: true, workedLabel: (ms) => `Бодсон ${Math.max(1, Math.round(ms / 1e3))} с` }) }),
            f.chips > 0 && /* @__PURE__ */ jsx("div", { className: "aw-chips", children: sources.slice(0, f.chips).map((s, i) => /* @__PURE__ */ jsx("span", { className: animate ? "aw-in" : void 0, style: { ["--i"]: i }, children: /* @__PURE__ */ jsx(
              SourcePreview,
              {
                source: preview(s),
                open: focus === s.id,
                onOpenChange: (o) => setFocus(o ? s.id : null),
                onOpenInApp: onOpenSource ? () => onOpenSource(s) : void 0
              }
            ) }, s.id)) }),
            f.segs > 0 && /* @__PURE__ */ jsx("div", { "aria-live": "polite", "aria-busy": f.phase !== "done", children: /* @__PURE__ */ jsx(CitedAnswer, { theme, segments: answer.slice(0, f.segs), sources: cited, pagesRead: sources.length, renderText: mentions?.length ? (t) => withMentions(t, mentions) : void 0 }) })
          ] }),
          /* @__PURE__ */ jsxs("form", { className: "aw-compose", onSubmit: submit, children: [
            /* @__PURE__ */ jsx("input", { value: text, onChange: (e) => setText(e.target.value), placeholder: labels.placeholder, "aria-label": labels.placeholder }),
            /* @__PURE__ */ jsx("button", { type: "submit", className: "aw-send", "aria-label": labels.send, children: upIcon })
          ] })
        ] })
      }
    )
  ] });
}
const askWindowDemoNote = "ac.me — жишээ өгөгдөл, бодит харилцагч биш";
const askWindowMicroMn = [
  "санах ой хайж байна…",
  "шийдвэр олдлоо · Үнийн бодлого",
  "уулзалтын тэмдэглэл · 10-р сар",
  "Slack · хэлэлцүүлэг холбогдлоо",
  "эх сурвалж нэгтгэж байна…",
  "хариу бэлэн"
];
const askWindowDemo = {
  question: "Өнгөрсөн сард үнийн талаар ямар шийдвэр гаргасан бэ?",
  workspace: { name: "ACME", note: "демо" },
  nav: askNavMn.map((n) => n.id === "inbox" ? { ...n, count: 4 } : n),
  chats: [
    { id: "price", title: "Үнийн бодлого" },
    { id: "stock", title: "Нийлүүлэлтийн хоцролт" },
    { id: "onb", title: "Шинэ ажилтны чиглүүлэг" }
  ],
  activeChat: "price",
  thinking: askDemoThinking,
  answer: askDemoAnswer,
  sources: askDemoSources
};
export {
  AskWindow as A,
  askNavMn as a,
  askWindowDemo as b,
  askWindowDemoNote as c,
  askWindowLabelsMn as d,
  askWindowMicroMn as e
};
//# sourceMappingURL=ask-window-DZY_69mX.js.map
