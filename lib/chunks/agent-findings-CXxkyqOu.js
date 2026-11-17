import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const ClaudeIcon = /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2M5 2.2l6 11.6M11 2.2 5 13.8M2.2 5l11.6 6M13.8 5 2.2 11", stroke: "#d97757", strokeWidth: "1.2", strokeLinecap: "round" }) });
const OpenAIIcon = /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: "1.1", children: [
  /* @__PURE__ */ jsx("path", { d: "M6.2 2.3a3 3 0 0 1 4.9 1.6 3 3 0 0 1 2.5 4.4 3 3 0 0 1-2.4 4.5 3 3 0 0 1-5 .9 3 3 0 0 1-3.7-3.1 3 3 0 0 1-.3-5.3 3 3 0 0 1 4-3Z" }),
  /* @__PURE__ */ jsx("path", { d: "M6 4.8v5.4l4.5 2.4M10 3.6 5.4 6.2v5.2M3 6.2l4.6 2.6 4.6-2.6M13 9.8 8.4 7.2 3.8 9.8" })
] });
const GeminiIcon = /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 1c.5 3.7 3.3 6.5 7 7-3.7.5-6.5 3.3-7 7-.5-3.7-3.3-6.5-7-7 3.7-.5 6.5-3.3 7-7Z", fill: "#3b7cf6" }) });
const iconFor = (i) => i === "claude" ? ClaudeIcon : i === "openai" ? OpenAIIcon : i === "gemini" ? GeminiIcon : i ?? ClaudeIcon;
function SevGlyph({ severity, muted }) {
  const on = severity === "critical" ? [1, 1, 1, 1] : severity === "warning" ? [1, 0, 1, 1] : [1, 0, 0, 1];
  return /* @__PURE__ */ jsx("svg", { className: `afc-sev afc-${muted ? "none" : severity}`, viewBox: "0 0 10 10", "aria-hidden": "true", children: [
    [0, 0],
    [5.5, 0],
    [0, 5.5],
    [5.5, 5.5]
  ].map(([x, y], i) => /* @__PURE__ */ jsx("rect", { x, y, width: "4.5", height: "4.5", rx: ".8", opacity: on[i] ? 1 : 0.35 }, i)) });
}
const sevLabel = { critical: "Ноцтой", warning: "Анхааруулга", note: "Тэмдэглэл" };
const T0 = Date.now();
const defaultAgents = [
  { id: "auditor", name: "Шалгагч", step: "Гаргалтын эрхийн хяналтыг шалгаж байна", done: 10, total: 24, icon: "claude" },
  { id: "fuzzer", name: "Санамсаргүй тест", step: "Унасан дарааллыг дахин тоглуулж байна", done: 7, total: 18, icon: "openai" },
  { id: "prover", name: "Нотлогч", step: "Үлдэгдлийн тэнцвэрийг шалгаж байна", done: 4, total: 12, icon: "gemini" },
  { id: "gas", name: "Зардлын хяналт", step: "Бүтцийн талбаруудыг нягтруулж байна", done: 6, total: 10, icon: "claude" }
];
const defaultFindings = [
  { id: "f1", title: "Эзэмшигч хязгааргүй гаргаж чадна", severity: "warning", agent: "auditor", location: "Token.sol:31", at: T0 - 1e3 },
  { id: "f2", title: "Давталт алхам бүрт санах ой уншина", severity: "note", agent: "gas", location: "Pool.sol:61", at: T0 - 2e3 },
  { id: "f3", title: "Шилжүүлгийн буцах утгыг шалгаагүй", severity: "warning", agent: "fuzzer", location: "Token.sol:88", at: T0 - 6e3 },
  { id: "f4", title: "withdraw() дахин нэвтрэлтэд өртөмтгий", severity: "critical", agent: "auditor", location: "Vault.sol:142", at: T0 - 9e3 }
];
const queued = [
  { id: "q1", title: "Тогтмолыг өөрчлөгдөхгүй болгож болно", severity: "note", agent: "gas", location: "Pool.sol:12" },
  { id: "q2", title: "Шагналын тооцоонд шалгаагүй хөрвүүлэлт", severity: "warning", agent: "prover", location: "Rewards.sol:57" }
];
const ago = (ms) => {
  const s = Math.max(0, Math.round(ms / 1e3));
  if (s < 3) return "одоо";
  if (s < 60) return `${s} с`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m} мин` : `${Math.floor(m / 60)} цаг`;
};
function AgentFindings({
  agents: agentsProp,
  findings: findingsProp,
  title = "Баталгаажуулалт",
  rows = 4,
  now,
  onOpen,
  className = "",
  simulate
}) {
  const demo = simulate ?? (agentsProp === void 0 && findingsProp === void 0);
  const [agents, setAgents] = React.useState(agentsProp ?? defaultAgents);
  const [findings, setFindings] = React.useState(findingsProp ?? defaultFindings);
  const [clock, setClock] = React.useState(() => Date.now());
  const [filter, setFilter] = React.useState(null);
  React.useEffect(() => {
    if (agentsProp) setAgents(agentsProp);
  }, [agentsProp]);
  React.useEffect(() => {
    if (findingsProp) setFindings(findingsProp);
  }, [findingsProp]);
  React.useEffect(() => {
    if (now !== void 0) return;
    const id = window.setInterval(() => setClock(Date.now()), 1e3);
    return () => window.clearInterval(id);
  }, [now]);
  React.useEffect(() => {
    if (!demo) return;
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      setAgents((as) => as.map((a, i) => (n + i) % 3 === 0 && a.done < a.total ? { ...a, done: a.done + 1 } : a));
      if (n % 4 === 0) {
        const q = queued[(n / 4 - 1) % queued.length];
        setFindings((fs) => [{ ...q, id: `${q.id}-${n}`, at: Date.now() }, ...fs].slice(0, 12));
      }
    }, 1400);
    return () => window.clearInterval(id);
  }, [demo]);
  const t = now ?? clock;
  const checked = agents.reduce((n, a) => n + a.done, 0);
  const total = agents.reduce((n, a) => n + a.total, 0);
  const count = (sev, agent) => findings.filter((f) => f.severity === sev && (!agent || f.agent === agent)).length;
  const crit = count("critical");
  const warn = count("warning");
  const feed = [...findings].filter((f) => !filter || f.agent === filter).sort((a, b) => b.at - a.at).slice(0, rows);
  const nameOf = (id) => agents.find((a) => a.id === id)?.name ?? id;
  return /* @__PURE__ */ jsxs("section", { className: `ui-afc afc ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "afc-bar", children: [
      /* @__PURE__ */ jsx("span", { className: "afc-spark", children: GeminiIcon }),
      /* @__PURE__ */ jsx("strong", { children: title }),
      /* @__PURE__ */ jsxs("span", { className: "afc-muted", children: [
        checked,
        "/",
        total,
        " шалгалт"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "afc-tally", children: [
        crit > 0 && /* @__PURE__ */ jsxs("span", { className: "afc-critical", children: [
          /* @__PURE__ */ jsx("i", {}),
          crit,
          " ноцтой"
        ] }),
        warn > 0 && /* @__PURE__ */ jsxs("span", { className: "afc-warning", children: [
          /* @__PURE__ */ jsx("i", {}),
          warn,
          " анхааруулга"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "afc-agents", children: agents.map((a) => {
      const done = (a.status ?? (a.done >= a.total ? "done" : "running")) === "done";
      const c = count("critical", a.id);
      const w = count("warning", a.id);
      return /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "afc-agent",
          "aria-pressed": filter === a.id,
          onClick: () => setFilter((f) => f === a.id ? null : a.id),
          children: [
            /* @__PURE__ */ jsx("span", { className: "afc-ico", children: iconFor(a.icon) }),
            /* @__PURE__ */ jsxs("span", { className: "afc-who", children: [
              /* @__PURE__ */ jsx("span", { className: "afc-name", children: a.name }),
              /* @__PURE__ */ jsx("span", { className: "afc-step", children: done ? "Дууссан" : a.step })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "afc-track", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { style: { width: `${a.done / a.total * 100}%` }, className: done ? "is-done" : "" }) }),
            /* @__PURE__ */ jsxs("span", { className: "afc-num", children: [
              a.done,
              "/",
              a.total
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `afc-cnt ${c ? "afc-critical" : ""}`, children: [
              /* @__PURE__ */ jsx(SevGlyph, { severity: "critical", muted: !c }),
              c,
              /* @__PURE__ */ jsx("span", { className: "afc-sr", children: " ноцтой" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `afc-cnt ${w ? "afc-warning" : ""}`, children: [
              /* @__PURE__ */ jsx(SevGlyph, { severity: "warning", muted: !w }),
              w,
              /* @__PURE__ */ jsx("span", { className: "afc-sr", children: " анхааруулга" })
            ] })
          ]
        },
        a.id
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "afc-feed", children: [
      /* @__PURE__ */ jsxs("div", { className: "afc-h", children: [
        "Сүүлийн илрүүлэлт",
        filter && /* @__PURE__ */ jsxs(Fragment, { children: [
          " · ",
          nameOf(filter)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("ul", { "aria-live": "polite", children: [
        feed.map((f) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { type: "button", className: "afc-finding", onClick: () => onOpen?.(f), children: [
          /* @__PURE__ */ jsx(SevGlyph, { severity: f.severity }),
          /* @__PURE__ */ jsxs("span", { className: "afc-sr", children: [
            sevLabel[f.severity],
            ":"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "afc-title", children: f.title }),
          /* @__PURE__ */ jsxs("span", { className: "afc-meta", children: [
            nameOf(f.agent),
            f.location && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "afc-dot", children: "·" }),
              /* @__PURE__ */ jsx("code", { children: f.location })
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "afc-time", children: ago(t - f.at) })
        ] }) }, f.id)),
        feed.length === 0 && /* @__PURE__ */ jsx("li", { className: "afc-empty", children: "Илрүүлэлт алга" })
      ] })
    ] })
  ] });
}
const css = `
.afc{--afc-bg:#fff;--afc-fg:#18181b;--afc-muted:#65656d;--afc-faint:#65656d;--afc-line:#ececef;--afc-hover:#f6f6f7;--afc-track:#ececef;--afc-bar:#9fb8ea;--afc-crit:#dc2626;--afc-warn:#c2410c;--afc-note:#5b8def;--afc-accent:#3b7cf6;width:100%;max-width:640px;background:var(--afc-bg);color:var(--afc-fg);border:1px solid var(--afc-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .afc{--afc-bg:#1b1b1e;--afc-fg:#ececef;--afc-muted:#a1a1aa;--afc-faint:#9a9aa2;--afc-line:#2c2c31;--afc-hover:#24242a;--afc-track:#2e2e34;--afc-bar:#5b7fc6;--afc-crit:#f87171;--afc-warn:#fb923c;--afc-note:#6b8fd0;color-scheme:dark}
.afc *{box-sizing:border-box}.afc button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;text-align:left}
.afc-bar{display:flex;align-items:center;gap:8px;padding:14px 16px 13px 18px;border-bottom:1px solid var(--afc-line)}
.afc-bar strong{font-weight:500}.afc-spark svg{width:12px;height:12px;display:block}
.afc-muted{color:var(--afc-muted);font-size:13px;margin-left:2px}
.afc-tally{margin-left:auto;display:flex;gap:12px;font-size:13px}.afc-tally span{display:inline-flex;align-items:center;gap:6px}
.afc-tally i{width:6px;height:6px;border-radius:50%;background:currentColor}
.afc-critical{color:var(--afc-crit)}.afc-warning{color:var(--afc-warn)}
.afc-agents{padding:4px 0;border-bottom:1px solid var(--afc-line)}
.afc-agent{display:grid;grid-template-columns:26px minmax(0,1fr) 128px 40px 26px 26px;align-items:center;gap:0 10px;width:100%;padding:7px 10px 7px 9px;transition:background .15s}
.afc-agent:hover{background:var(--afc-hover)}.afc-agent[aria-pressed=true]{background:var(--afc-hover)}
.afc-ico{display:grid;place-items:center;width:24px;height:24px;border:1px solid var(--afc-line);border-radius:6px;background:var(--afc-bg)}.afc-ico svg{width:13px;height:13px}
.afc-who{display:flex;flex-direction:column;min-width:0;padding-left:2px}
.afc-name{font-size:14px;line-height:1.3}.afc-step{font-size:12.5px;color:var(--afc-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.afc-track{height:4px;border-radius:4px;background:var(--afc-track);overflow:hidden}
.afc-track span{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,color-mix(in srgb,var(--afc-bar) 55%,transparent),var(--afc-bar));transition:width .6s cubic-bezier(.2,.7,.2,1)}
.afc-track span.is-done{background:#22c55e}
.afc-num{text-align:right;font-size:13px;color:var(--afc-muted);font-variant-numeric:tabular-nums}
.afc-cnt{display:inline-flex;align-items:center;gap:4px;font-size:12.5px;color:var(--afc-faint);font-variant-numeric:tabular-nums}
.afc-cnt.afc-critical{color:var(--afc-crit)}.afc-cnt.afc-warning{color:var(--afc-warn)}
.afc-sev{width:10px;height:10px;flex:none;fill:currentColor}
.afc-sev.afc-critical{color:var(--afc-crit)}.afc-sev.afc-warning{color:var(--afc-warn)}.afc-sev.afc-note{color:var(--afc-note)}.afc-sev.afc-none{color:var(--afc-faint)}
.afc-feed{padding:12px 0 6px}
.afc-h{padding:0 16px 8px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--afc-muted)}
.afc-feed ul{list-style:none;margin:0;padding:0}
.afc-feed li{animation:afc-in .35s cubic-bezier(.2,.7,.2,1) both}
.afc-finding{display:flex;align-items:center;gap:8px;width:100%;padding:11px 10px;min-height:40px;transition:background .15s}
.afc-finding:hover{background:var(--afc-hover)}
.afc-title{flex:none;max-width:60%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.afc-meta{flex:1;min-width:0;display:block;font-size:12.5px;color:var(--afc-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-left:2px}
.afc-meta>*{margin-left:6px}.afc-meta code{font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--afc-muted)}
.afc-dot{color:var(--afc-faint)}
.afc-time{margin-left:auto;font-size:12.5px;color:var(--afc-faint);font-variant-numeric:tabular-nums}
.afc-empty{padding:10px 16px;color:var(--afc-muted);font-size:13px}
.afc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.afc :focus-visible{outline:2px solid var(--afc-accent);outline-offset:-2px;border-radius:6px}
@keyframes afc-in{from{opacity:0;transform:translateY(-6px)}}
@media(max-width:480px){.afc-agent{grid-template-columns:26px minmax(0,1fr) 72px 26px 26px}.afc-num,.afc-meta code,.afc-meta .afc-dot{display:none}.afc-muted{display:none}}
@media(prefers-reduced-motion:reduce){.afc *{animation:none!important;transition:none!important}}
`;
export {
  AgentFindings as A
};
//# sourceMappingURL=agent-findings-CXxkyqOu.js.map
