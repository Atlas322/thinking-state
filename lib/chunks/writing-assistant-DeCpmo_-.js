import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const sample = (m) => {
  const t = m.toLowerCase();
  if (t.includes("богин"))
    return "Илүү товч хувилбар: «Мэдээлсэнд баярлалаа – ноорогийг өнөөдөр уншаад, баасан гаригт санал илгээнэ.» Үүнээс ч богиносгох уу?";
  if (t.includes("өнгө"))
    return "Эхлэлийг зөөлрүүлж, «аль болох хурдан» гэснийг тодорхой огноогоор сольсон. Одоо дулаахан ч шулуун сонсогдож байна – үлдсэн хэсэгт нь ч ингэх үү?";
  if (t.includes("хариу"))
    return "Сайн байна уу, Бат аа – илгээсэнд баярлалаа. Төлөвлөгөө сайн байна; дизайны баг оролцож болохоор хяналтыг пүрэв гараг руу л шилжүүлье. Дараа ярья!";
  if (t.includes("мэйл"))
    return "Мэндчилгээг цэгцэлж, илүүц хоёр өгүүлбэрийг хасаад, нэг тодорхой хүсэлтээр төгсгөсөн. И-мэйлээ буулгавал мөр мөрөөр нь өнгөлье.";
  return "Туслахад бэлэн. Ноорогоо буулгаад хэнд зориулсныг хэлээрэй – таны өнгө аясыг хадгалаад илүү ойлгомжтой болгоно.";
};
function WritingAssistant({
  name = "Үзэг",
  tagline = "Таны бичгийн туслах.",
  greeting = "Юу бичих вэ?",
  suggestions = ["И-мэйлээ сайжруулах", "Богиносгох", "Өнгө аясыг засах", "Хариу ноороглох"],
  placeholder = "Юу ч асуугаарай…",
  respond,
  speech = "auto",
  dictation = "Дизайны багт ажлаа цагтаа хүлээлгэн өгсөнд нь талархсан богино захидал бич.",
  className = "",
  initialMessages
}) {
  const [messages, setMessages] = React.useState(() => initialMessages ?? []);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(null);
  const [thinking, setThinking] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const timers = React.useRef([]);
  const rec = React.useRef(null);
  const listRef = React.useRef(null);
  const idRef = React.useRef(initialMessages?.reduce((max, m) => Math.max(max, m.id), 0) ?? 0);
  React.useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      rec.current?.stop();
    },
    []
  );
  React.useEffect(() => {
    if (!streaming || streaming.shown >= streaming.full.length) {
      if (streaming) {
        setMessages((m) => [...m, { id: streaming.id, role: "assistant", text: streaming.full }]);
        setStreaming(null);
      }
      return;
    }
    const t = window.setTimeout(() => setStreaming((s) => s && { ...s, shown: s.shown + 3 }), 18);
    return () => window.clearTimeout(t);
  }, [streaming]);
  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, streaming, thinking]);
  const send = async (text) => {
    const v = text.trim();
    if (!v || streaming || thinking) return;
    setMessages((m) => [...m, { id: ++idRef.current, role: "user", text: v }]);
    setInput("");
    setThinking(true);
    let reply;
    try {
      reply = respond ? await respond(v) : await new Promise((res) => {
        timers.current.push(window.setTimeout(() => res(sample(v)), 650));
      });
    } catch {
      reply = "Алдаа гарлаа – дахин оролдоно уу.";
    }
    setThinking(false);
    setStreaming({ id: ++idRef.current, full: reply, shown: 0 });
  };
  const dictate = () => {
    if (listening) {
      rec.current?.stop();
      timers.current.forEach((t) => window.clearTimeout(t));
      setListening(false);
      return;
    }
    setListening(true);
    const W = window;
    const Ctor = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (speech === "auto" && Ctor) {
      const r = new Ctor();
      r.lang = "mn-MN";
      r.interimResults = true;
      r.onresult = (e) => setInput(Array.from(e.results).map((x) => x[0].transcript).join(""));
      r.onend = () => setListening(false);
      rec.current = r;
      try {
        r.start();
        return;
      } catch {
      }
    }
    const words = dictation.split(" ");
    words.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setInput(words.slice(0, i + 1).join(" ")), 140 * (i + 1)));
    });
    timers.current.push(window.setTimeout(() => setListening(false), 140 * words.length + 200));
  };
  const empty = messages.length === 0 && !streaming && !thinking;
  return /* @__PURE__ */ jsxs("section", { className: `wra ${className}`, "aria-label": name, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "wra-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "wra-name", children: [
        /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("path", { d: "M6 2 7.2 5.5 10.5 6.5 7.2 7.5 6 11 4.8 7.5 1.5 6.5 4.8 5.5ZM12 9.5l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6Z", fill: "url(#wra-g)" }),
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "wra-g", x1: "0", y1: "0", x2: "1", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0", stopColor: "#d946ef" }),
            /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#6366f1" })
          ] }) })
        ] }),
        name
      ] }),
      /* @__PURE__ */ jsx("div", { className: "wra-tag", children: tagline })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "wra-stage", children: [
      /* @__PURE__ */ jsx("div", { className: `wra-glow${listening ? " is-listening" : ""}`, "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("div", { className: "wra-scroll", ref: listRef, "aria-live": "polite", children: empty ? /* @__PURE__ */ jsxs("div", { className: "wra-welcome", children: [
        /* @__PURE__ */ jsx("p", { className: "wra-greet", children: greeting }),
        /* @__PURE__ */ jsx("div", { className: "wra-chips", children: suggestions.map((s) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => send(s), children: s }, s)) })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "wra-thread", children: [
        messages.map((m) => /* @__PURE__ */ jsx("div", { className: `wra-msg is-${m.role}`, children: m.text }, m.id)),
        thinking && /* @__PURE__ */ jsxs("div", { className: "wra-msg is-assistant wra-dots", "aria-label": "Бичиж байна", children: [
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("i", {})
        ] }),
        streaming && /* @__PURE__ */ jsxs("div", { className: "wra-msg is-assistant", children: [
          streaming.full.slice(0, streaming.shown),
          /* @__PURE__ */ jsx("span", { className: "wra-caret" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          className: "wra-input",
          onSubmit: (e) => {
            e.preventDefault();
            send(input);
          },
          children: [
            /* @__PURE__ */ jsx("input", { "aria-label": "Мессеж", placeholder: listening ? "Сонсож байна…" : placeholder, value: input, onChange: (e) => setInput(e.target.value) }),
            input.trim() && !listening ? /* @__PURE__ */ jsx("button", { type: "submit", className: "wra-send", "aria-label": "Илгээх", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M8 12.5v-9M4.5 7 8 3.5 11.5 7", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) }) }) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `wra-mic${listening ? " is-on" : ""}`,
                "aria-label": listening ? "Дуут бичлэгийг зогсоох" : "Дуугаар бичих",
                "aria-pressed": listening,
                onClick: dictate,
                children: listening ? /* @__PURE__ */ jsxs("span", { className: "wra-bars", "aria-hidden": "true", children: [
                  /* @__PURE__ */ jsx("i", {}),
                  /* @__PURE__ */ jsx("i", {}),
                  /* @__PURE__ */ jsx("i", {}),
                  /* @__PURE__ */ jsx("i", {})
                ] }) : /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
                  /* @__PURE__ */ jsx("rect", { x: "6", y: "1.8", width: "4", height: "8", rx: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
                  /* @__PURE__ */ jsx("path", { d: "M3.8 7.5a4.2 4.2 0 0 0 8.4 0M8 11.7v2.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" })
                ] })
              }
            )
          ]
        }
      )
    ] })
  ] });
}
const css = `
.wra{--wra-bg:#fff;--wra-fg:#18181b;--wra-muted:#65656d;--wra-faint:#65656d;--wra-line:#ececef;--wra-chip:#f4f4f5;--wra-glow-a:#f0abfc;--wra-glow-b:#a5b4fc;--wra-glow-c:#c4b5fd;width:100%;max-width:380px;background:var(--wra-bg);color:var(--wra-fg);border:1px solid var(--wra-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.5 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .wra{--wra-bg:#1b1b1e;--wra-fg:#ececef;--wra-muted:#a1a1aa;--wra-faint:#9a9aa2;--wra-line:#2e2e33;--wra-chip:#2a2a2f;--wra-glow-a:#86198f;--wra-glow-b:#3730a3;--wra-glow-c:#5b21b6;color-scheme:dark}
.wra *{box-sizing:border-box}.wra button,.wra input{font:inherit;color:inherit}.wra button{cursor:pointer}
.wra-head{padding:14px 16px 12px;border-bottom:1px solid var(--wra-line)}
.wra-name{display:flex;align-items:center;gap:6px;font-weight:500}.wra-name svg{width:14px;height:14px}
.wra-tag{font-size:12px;color:var(--wra-muted)}
.wra-stage{position:relative;display:flex;flex-direction:column;height:340px;overflow:hidden}
.wra-glow{position:absolute;inset:auto -5% -20% -5%;height:80%;pointer-events:none;background:radial-gradient(40% 35% at 30% 45%,color-mix(in srgb,var(--wra-glow-a) 65%,transparent),transparent 70%),radial-gradient(45% 40% at 62% 62%,color-mix(in srgb,var(--wra-glow-c) 65%,transparent),transparent 70%),radial-gradient(45% 35% at 40% 85%,color-mix(in srgb,var(--wra-glow-b) 55%,transparent),transparent 70%);filter:blur(10px);animation:wra-drift 9s ease-in-out infinite alternate}
.wra-glow.is-listening{animation-duration:2.4s;opacity:1}
.wra-scroll{position:relative;flex:1;overflow-y:auto;display:flex;flex-direction:column;padding:16px 16px 4px}
.wra-welcome{margin-top:auto}
.wra-greet{margin:0 0 12px;font-size:15px;font-weight:500}
.wra-chips{display:flex;flex-wrap:wrap;gap:6px}
.wra-chips button{height:28px;padding:0 9px;border:0;border-radius:6px;background:color-mix(in srgb,var(--wra-bg) 80%,transparent);box-shadow:0 0 0 1px var(--wra-line);font-size:13.5px;color:color-mix(in srgb,var(--wra-fg) 85%,transparent);backdrop-filter:blur(6px);transition:background .15s}
.wra-chips button:hover{background:var(--wra-bg)}
.wra-thread{display:flex;flex-direction:column;gap:8px;margin-top:auto}
.wra-msg{max-width:88%;font-size:14px;animation:wra-in .25s both}
.wra-msg.is-user{align-self:flex-end;padding:6px 11px;border-radius:12px;background:var(--wra-chip)}
.wra-msg.is-assistant{align-self:flex-start}
.wra-caret{display:inline-block;width:6px;height:6px;margin-left:3px;border-radius:50%;background:var(--wra-fg);vertical-align:1px;animation:wra-blink 1s infinite}
.wra-dots{display:flex;gap:3px;padding:8px 0}.wra-dots i{width:5px;height:5px;border-radius:50%;background:var(--wra-faint);animation:wra-bounce 1s infinite}
.wra-dots i:nth-child(2){animation-delay:.15s}.wra-dots i:nth-child(3){animation-delay:.3s}
.wra-input{position:relative;display:flex;align-items:center;gap:8px;height:48px;padding:0 10px 0 16px}
.wra-input input{flex:1;min-width:0;border:0;background:none;outline:none;font-size:14px}.wra-input input::placeholder{color:var(--wra-faint)}
.wra-mic,.wra-send{display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:none;color:var(--wra-muted)}
.wra-mic:hover{background:color-mix(in srgb,var(--wra-fg) 7%,transparent);color:var(--wra-fg)}
.wra-mic svg,.wra-send svg{width:14px;height:14px}
.wra-send{background:var(--wra-fg);color:var(--wra-bg)}
.wra-mic.is-on{background:var(--wra-fg);color:var(--wra-bg)}
.wra-bars{display:flex;align-items:center;gap:2px;height:12px}.wra-bars i{width:2px;height:100%;border-radius:1px;background:currentColor;animation:wra-bar .8s ease-in-out infinite}
.wra-bars i:nth-child(2){animation-delay:.1s}.wra-bars i:nth-child(3){animation-delay:.2s}.wra-bars i:nth-child(4){animation-delay:.3s}
.wra :focus-visible{outline:2px solid #8b5cf6;outline-offset:2px}
@keyframes wra-drift{to{transform:translate(4%,-4%) scale(1.06)}}
@keyframes wra-in{from{opacity:0;transform:translateY(4px)}}
@keyframes wra-blink{50%{opacity:0}}
@keyframes wra-bounce{50%{transform:translateY(-3px)}}
@keyframes wra-bar{50%{transform:scaleY(.35)}}
@media(max-width:400px){.wra-stage{height:300px}.wra-scroll{padding:12px 12px 4px}}
@media(prefers-reduced-motion:reduce){.wra *{animation:none!important;transition:none!important}}
.wra-head{animation:wrahead .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.wra-head:nth-child(1){animation-delay:0ms}@keyframes wrahead{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.wra-head{animation:none}}.wra-stage{animation:wrastage .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.wra-stage:nth-child(1){animation-delay:160ms}@keyframes wrastage{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.wra-stage{animation:none}}
`;
export {
  WritingAssistant as W
};
//# sourceMappingURL=writing-assistant-DeCpmo_-.js.map
