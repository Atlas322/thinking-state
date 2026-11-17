import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import "react";
import { A as AppShell, p as paraBaseMn } from "./app-shell-C_3YLmbU.js";
import { A as AgentPlan } from "./agent-plan-b0kdvPzG.js";
import { C as CitedAnswer } from "./cited-answer-eJy9EKIh.js";
import { D as DecisionCard } from "./decision-card-C1j4CpfV.js";
import { R as RunningNow } from "./running-now-DdYOBK_M.js";
import { M as MemoryPanel } from "./memory-panel-Bh1fv2Lf.js";
import { SessionBoard } from "./session-board-BKZ4o3Xs.js";
import { A as AgentAvatar, b as agentRoleFrom } from "./agent-avatar-BKy99-dK.js";
import { M as MotionProvider } from "./use-in-view-loop-DCjo3riw.js";
const appScreenLabelsMn = {
  inbox: "Inbox",
  note: "Тэмдэглэл",
  project: "Төсөл",
  chat: "Чат",
  memory: "Санах ой",
  team: "Баг",
  brand: "Second Brain",
  search: "Хайх эсвэл асуух…",
  next: "NEXT ACTION"
};
const SCREENS = ["inbox", "note", "project", "chat", "memory", "team"];
const I = (d, size = 16) => /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: d });
const icons = {
  inbox: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M2 9h3.5l1 2h3l1-2H14" }),
    /* @__PURE__ */ jsx("path", { d: "M3.5 3h9L14 9v4H2V9Z" })
  ] })),
  note: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M4 2h6l3 3v9H4Z" }),
    /* @__PURE__ */ jsx("path", { d: "M10 2v3h3M6 8h5M6 11h4" })
  ] })),
  project: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "3", width: "12", height: "10", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M2 6.5h12M6 3v3.5" })
  ] })),
  chat: I(/* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("path", { d: "M3 3h10v7H8l-3 3v-3H3Z" }) })),
  memory: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "M8 5v3l2 1.5" })
  ] })),
  team: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "5.5", cy: "6", r: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "6.5", r: "1.6" }),
    /* @__PURE__ */ jsx("path", { d: "M2 13c.5-2 2-3 3.5-3S8.5 11 9 13M9.5 13c.3-1.4 1.2-2.2 2.3-2.2 1 0 1.8.8 2.2 2.2" })
  ] })),
  link: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M7 9a2.5 2.5 0 0 0 3.5 0l2-2A2.5 2.5 0 0 0 9 3.5L8.4 4" }),
    /* @__PURE__ */ jsx("path", { d: "M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5l.6-.5" })
  ] })),
  voice: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "6", y: "2", width: "4", height: "7.5", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M3.5 8a4.5 4.5 0 0 0 9 0M8 12.5V14" })
  ] })),
  idea: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M5.5 10.5a4 4 0 1 1 5 0V12h-5Z" }),
    /* @__PURE__ */ jsx("path", { d: "M6.5 14h3" })
  ] })),
  file: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M4 2h5.5L12 4.5V14H4Z" }),
    /* @__PURE__ */ jsx("path", { d: "M6 9h4M6 11.5h3" })
  ] })),
  mail: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "3.5", width: "12", height: "9", rx: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "m2.5 4.5 5.5 4 5.5-4" })
  ] })),
  search: I(/* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "7", cy: "7", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "m10 10 3 3" })
  ] })),
  arrow: I(/* @__PURE__ */ jsx("path", { d: "M3 8h10M9 4l4 4-4 4" })),
  check: I(/* @__PURE__ */ jsx("path", { d: "m3.5 8.5 3 3 6-7" })),
  spark: I(/* @__PURE__ */ jsx("path", { d: "M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2" }))
};
const CSS = `
.aps-root{--ts-radius:6px;--aps-r:var(--ts-radius);--aps-r-shell:var(--ts-radius);--aps-sans:Inter,system-ui,sans-serif;--aps-serif:var(--aps-sans);--aps-mono:"IBM Plex Mono",monospace;
 --aps-h2:20px;--aps-h3:15px;--aps-lead:13.5px;--aps-body:13.5px;--aps-small:12.5px;--aps-label:11px;--aps-btn:32px;--aps-icon:16px;--aps-stroke:1.5}
.aps-stage{height:100%;font-family:var(--aps-sans);color:var(--ts-fg)}
.aps-count{margin-left:auto;font:500 var(--aps-label) var(--aps-mono);color:var(--ts-faint)}
.aps-win{height:100%}.aps-win .ash{min-height:0}.aps-win .ash-main{padding:28px 32px}
.aps-h1{font:600 var(--aps-h2)/1.25 var(--aps-sans);letter-spacing:-.01em;margin:0 0 4px}
.aps-sub{color:var(--ts-muted);font:400 var(--aps-lead)/1.5 var(--aps-sans);margin:0 0 16px}
.aps-label{font:500 var(--aps-label) var(--aps-mono);letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint)}
.aps-card{background:var(--ts-surface,#fff);border:1px solid var(--ts-line,#e2e1dc);border-radius:calc(var(--aps-r) + 2px)}
.aps-next{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:var(--aps-r);background:#ff7a1a;color:#1a0d00;font:600 var(--aps-label) var(--aps-mono);letter-spacing:.04em}
.aps-next span{font:500 12px var(--aps-sans);letter-spacing:0}
.aps-chip{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;border-radius:var(--aps-r);font-size:var(--aps-small);color:var(--ts-muted);background:var(--ts-soft,#efebe1)}
.aps-chip.e{color:var(--ts-on-accent-soft,#0f3fb8);background:var(--ts-electric-soft,#dce5ff)}
.aps-capture{display:flex;align-items:center;gap:10px;padding:14px 16px;margin-bottom:18px}
.aps-capture input{flex:1;border:0;background:none;font:15px var(--aps-sans);color:var(--ts-fg);outline:0}
.aps-key{font:500 var(--aps-label) var(--aps-mono);color:var(--ts-faint);border:1px solid var(--ts-line);border-radius:var(--aps-r);padding:2px 6px}
.aps-list{display:flex;flex-direction:column}
.aps-row{display:grid;grid-template-columns:40px 1fr auto;gap:14px;align-items:center;padding:18px 20px;border-top:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent)}
.aps-row:first-child{border-top:0}
/* A filed item steps back by colour, not opacity, so its text keeps 4.5:1. */
.aps-row.done b,.aps-row.done .aps-meta,.aps-row.done .aps-chip{color:var(--ts-muted)}.aps-row.done b{font-weight:400}
.aps-ico{width:40px;height:40px;align-self:start;border-radius:var(--aps-r);display:grid;place-items:center;background:var(--ts-soft);color:var(--ts-muted)}
.aps-row b{font-weight:500;font-size:var(--aps-body);display:block;margin-bottom:3px}
.aps-meta{font-size:var(--aps-small);color:var(--ts-faint);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.aps-row .aps-next{margin-top:8px}
.aps-grid{display:grid;grid-template-columns:1fr 300px;gap:22px;align-items:start}
.aps-note{padding:26px 28px}
.aps-note p{font-size:var(--aps-body);line-height:1.65;margin:0 0 12px}
.aps-note h2{font:400 var(--aps-h2)/1.08 var(--aps-serif);letter-spacing:-.01em;line-height:1.2;margin:10px 0 16px}
.aps-src{margin-top:18px;padding-top:14px;border-top:1px dashed var(--ts-line);font-size:var(--aps-body);color:var(--ts-muted)}
.aps-link{display:flex;gap:12px;padding:14px 16px;border-top:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent)}
.aps-link:first-of-type{border-top:0}
.aps-dot{position:relative;z-index:1;width:12px;height:12px;border-radius:50%;margin-top:5px;flex:none;box-shadow:0 0 0 4px var(--ts-surface)}
.aps-link b{font-weight:500;font-size:var(--aps-body);display:block}
.aps-link small{font-size:var(--aps-small);color:var(--ts-faint)}
.aps-progress{height:6px;border-radius:var(--aps-r);background:var(--ts-soft-2,#e8e3d6);overflow:hidden;margin:10px 0 4px}
.aps-progress i{display:block;height:100%;background:#1b5cff;border-radius:var(--aps-r)}
.aps-nextcard{padding:14px 16px;margin:14px 0;border-color:#ff7a1a;background:color-mix(in srgb,#ff7a1a 9%,var(--ts-surface))}
.aps-nextcard h3{font:600 var(--aps-h3)/1.3 var(--aps-sans);margin:8px 0 4px}
.aps-task{display:grid;grid-template-columns:18px 1fr auto auto;gap:10px;align-items:center;padding:8px 14px;min-height:38px;border-top:1px solid var(--ts-line);font-size:var(--aps-body)}
.aps-task:first-child{border-top:0}
.aps-st{width:14px;height:14px;border-radius:50%;border:1.5px solid var(--ts-faint)}
.aps-st.done{background:var(--ts-green,#5e7a5f);border-color:var(--ts-green)}
.aps-st.doing{border-color:#1b5cff;border-right-color:transparent}
.aps-st.waiting{border-color:#ff7a1a;border-style:dashed}
.aps-task.done span:nth-child(2){text-decoration:line-through;color:var(--ts-faint)}
.aps-truth{padding:12px 14px}.aps-truth li{font-size:var(--aps-body);margin:8px 0;color:var(--ts-muted)}.aps-truth ul{padding-left:18px;margin:8px 0 0}
.aps-chatgrid{display:grid;grid-template-columns:1fr 400px;gap:24px;align-items:start}
.aps-chat{min-width:0;display:flex;flex-direction:column;gap:16px}
.aps-q{align-self:flex-end;max-width:80%;padding:14px 18px;border-radius:var(--aps-r);background:#1b5cff;color:#fff;font-size:var(--aps-body);line-height:1.45}
.aps-composer{display:flex;align-items:center;gap:10px;padding:12px 14px;margin-top:4px}
.aps-composer>span:not(.aps-send){flex:1;color:var(--ts-faint);font-size:var(--aps-body)}
.aps-send{width:32px;height:32px;border-radius:var(--aps-r);background:#1b5cff;color:#fff;display:grid;place-items:center}
.aps-head{display:flex;align-items:center;justify-content:space-between;gap:16px}
.aps-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:var(--aps-btn);padding:0 16px;border-radius:var(--aps-r);font:500 var(--aps-body) var(--aps-sans);cursor:pointer;border:1px solid transparent;transition:background var(--ts-motion-dur-xs,120ms),border-color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-xs,120ms);white-space:nowrap}
.aps-btn:focus-visible,.aps-field:focus-within{outline:2px solid #1b5cff;outline-offset:2px}
.aps-btn:active{transform:translateY(1px)}
.aps-btn:disabled{opacity:.45;cursor:not-allowed}
.aps-btn.primary{background:#1b5cff;color:#fff}.aps-btn.primary:hover{background:#2a69ff}.aps-btn.primary:active{background:#1449cc}
.aps-btn.secondary{background:transparent;color:var(--ts-fg);border:1.5px solid var(--ts-fg)}.aps-btn.secondary:hover{border-color:var(--ts-faint)}
.aps-btn.ghost{background:none;color:var(--ts-fg);text-decoration:underline;text-decoration-color:var(--ts-line);text-underline-offset:4px}.aps-btn.ghost:hover{color:var(--ts-electric-fg);text-decoration-color:currentColor}
.aps-actions{display:flex;gap:8px;align-items:center}
.aps-btn.split{padding:0 0 0 16px;gap:0;align-items:stretch}.aps-btn.split>em{font-style:normal;display:flex;align-items:center}
.aps-cell{display:grid;place-items:center;width:var(--aps-btn);margin-left:16px;border-left:1.5px solid currentColor;opacity:.9;transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-standard,ease)}
.aps-btn.primary .aps-cell{border-left-color:rgb(255 255 255/.4)}.aps-btn.split:hover .aps-cell svg{transform:translateX(2px)}
.aps-btn.icon{padding:0;width:var(--aps-btn)}
.aps-fieldwrap{margin-bottom:22px}
.aps-fieldwrap label{display:block;font:500 var(--aps-body) var(--aps-sans);margin:0 0 8px}
.aps-field{display:flex;align-items:center;gap:10px;padding:8px 8px 8px 16px;border-radius:var(--aps-r);background:var(--ts-surface);border:1.5px solid var(--ts-line)}
.aps-field input{flex:1;min-width:0;border:0;background:none;font:var(--aps-body) var(--aps-sans);color:var(--ts-fg);outline:0;min-height:38px}
.aps-field input::placeholder{color:var(--ts-faint)}
.aps-help{font-size:var(--aps-small);color:var(--ts-faint);margin:8px 2px 0}
.aps-path{display:flex;align-items:center;font-size:var(--aps-small)}
.aps-path i{width:8px;height:8px;border-radius:50%;background:var(--ts-faint);flex:none}
.aps-path i.to{background:#1b5cff;box-shadow:0 0 0 3px var(--ts-electric-soft)}
.aps-path s{width:26px;height:1.5px;background:linear-gradient(90deg,var(--ts-faint),#1b5cff);margin:0 6px}
.aps-path b{color:var(--ts-electric-fg);font-weight:500;font-size:var(--aps-small);margin:0 0 0 8px;display:inline}
.aps-spine{position:relative}
.aps-spine::before{content:"";position:absolute;left:21px;top:26px;bottom:26px;width:1.5px;background:var(--ts-line)}
.aps-grid>*,.aps-chatgrid>*{min-width:0}
@container (max-width:980px){.aps-grid,.aps-chatgrid{grid-template-columns:minmax(0,1fr)}.aps-win .ash-main{padding:20px}}
@container (max-width:560px){.aps-win .ash-main{padding:14px}.aps-task{grid-template-columns:18px minmax(0,1fr) auto}.aps-task>:nth-child(3){display:none}}
.aps-still *,.aps-still *::before,.aps-still *::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}
`;
const SCREEN_VIEW = { inbox: "inbox", note: "resources", project: "projects", chat: "ask", memory: "resources", team: "agents" };
const VIEW_SCREEN = { inbox: "inbox", resources: "note", projects: "project", ask: "chat", agents: "team" };
function AppWindow({ screen, company = "ACME", counts = {}, onSelect, children, shell }) {
  return /* @__PURE__ */ jsx(
    AppShell,
    {
      className: "aps-win",
      company: { name: company, note: "Тархи · демо" },
      vocab: { resources: { label: screen === "memory" ? "Санах ой" : "Нөөц", line: paraBaseMn.resources.line } },
      counts: { inbox: counts.inbox, projects: counts.project, resources: counts.memory },
      active: SCREEN_VIEW[screen],
      onNavigate: (v) => {
        const k = VIEW_SCREEN[v];
        if (k) onSelect?.(k);
      },
      onAsk: () => onSelect?.("chat"),
      ...shell,
      children
    }
  );
}
const linkColor = { decision: "#1b5cff", knowledge: "#5e7a5f", project: "#ff7a1a", source: "#6b47c9" };
const linkKind = { decision: "Шийдвэр", knowledge: "Мэдлэг", project: "Төсөл", source: "Эх сурвалж" };
const statusLabel = { todo: "Хийх", doing: "Хийж байна", waiting: "Хүлээгдэж", done: "Дууссан" };
function InboxScreen({ data, labels = appScreenLabelsMn }) {
  const open = data.inbox.filter((i) => !i.processed).length;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { className: "aps-h1", children: labels.inbox }),
    /* @__PURE__ */ jsxs("p", { className: "aps-sub", children: [
      open,
      " шинэ зүйл. Агент газрыг нь санал болгосон — хүн батална."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "aps-fieldwrap", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "aps-capture", children: "Цуглуулах" }),
      /* @__PURE__ */ jsxs("div", { className: "aps-field", children: [
        icons.spark,
        /* @__PURE__ */ jsx("input", { id: "aps-capture", readOnly: true, value: "", placeholder: "Санаа, холбоос, файл…" }),
        /* @__PURE__ */ jsx("span", { className: "aps-key", children: "⌘⇧Space" }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "aps-btn primary split", children: [
          /* @__PURE__ */ jsx("em", { children: "Хадгалах" }),
          /* @__PURE__ */ jsx("span", { className: "aps-cell", children: icons.arrow })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "aps-help", children: "Агент Inbox дотор орсон зүйлийг ангилж, газрыг нь санал болгоно." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "aps-card aps-list", children: data.inbox.map((i) => /* @__PURE__ */ jsxs("div", { className: "aps-row" + (i.processed ? " done" : ""), children: [
      /* @__PURE__ */ jsx("span", { className: "aps-ico", children: icons[i.kind] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("b", { children: i.title }),
        /* @__PURE__ */ jsx("div", { className: "aps-meta", children: i.meta }),
        /* @__PURE__ */ jsxs("div", { className: "aps-path", style: { marginTop: 8 }, children: [
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("s", {}),
          /* @__PURE__ */ jsx("i", { className: "to" }),
          /* @__PURE__ */ jsx("b", { children: i.suggest })
        ] }),
        i.next && /* @__PURE__ */ jsxs("div", { className: "aps-next", children: [
          labels.next,
          " ",
          /* @__PURE__ */ jsx("span", { children: i.next })
        ] })
      ] }),
      i.processed ? /* @__PURE__ */ jsxs("span", { className: "aps-chip", children: [
        icons.check,
        "Ангилсан"
      ] }) : /* @__PURE__ */ jsxs("div", { className: "aps-actions", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "aps-btn ghost", children: "Өөрчлөх" }),
        /* @__PURE__ */ jsxs("button", { type: "button", className: "aps-btn secondary split", children: [
          /* @__PURE__ */ jsx("em", { children: "Батлах" }),
          /* @__PURE__ */ jsx("span", { className: "aps-cell", children: icons.check })
        ] })
      ] })
    ] }, i.id)) })
  ] });
}
function NoteScreen({ data }) {
  const n = data.note;
  return /* @__PURE__ */ jsxs("div", { className: "aps-grid", children: [
    /* @__PURE__ */ jsxs("article", { className: "aps-card aps-note", children: [
      /* @__PURE__ */ jsxs("div", { className: "aps-meta", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-chip e", children: n.kind }),
        n.date,
        n.tags.map((t) => /* @__PURE__ */ jsxs("span", { children: [
          "#",
          t
        ] }, t))
      ] }),
      /* @__PURE__ */ jsx("h2", { children: n.title }),
      n.body.map((p, i) => /* @__PURE__ */ jsx("p", { children: p }, i)),
      /* @__PURE__ */ jsxs("div", { className: "aps-src", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-label", children: "Эх сурвалж" }),
        /* @__PURE__ */ jsx("br", {}),
        n.source
      ] })
    ] }),
    /* @__PURE__ */ jsxs("aside", { children: [
      /* @__PURE__ */ jsx("div", { className: "aps-label", style: { margin: "4px 2px 8px" }, children: "Холбоос · яагаад" }),
      /* @__PURE__ */ jsx("div", { className: "aps-card aps-spine", children: n.links.map((l) => /* @__PURE__ */ jsxs("div", { className: "aps-link", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-dot", style: { background: linkColor[l.kind] } }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("b", { children: l.title }),
          /* @__PURE__ */ jsxs("small", { children: [
            linkKind[l.kind],
            " · ",
            l.why
          ] })
        ] })
      ] }, l.id)) }),
      /* @__PURE__ */ jsxs("p", { className: "aps-meta", style: { margin: "12px 2px" }, children: [
        "← ",
        n.backlinks,
        " тэмдэглэл энд холбогдсон"
      ] })
    ] })
  ] });
}
function ProjectScreen({ data, labels = appScreenLabelsMn }) {
  const p = data.project;
  return /* @__PURE__ */ jsxs("div", { className: "aps-grid", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "aps-meta", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-chip", children: p.area }),
        p.done,
        "/",
        p.total,
        " алхам"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "aps-h1", style: { marginTop: 8 }, children: p.name }),
      /* @__PURE__ */ jsx("p", { className: "aps-sub", style: { marginBottom: 0 }, children: p.why }),
      /* @__PURE__ */ jsx("div", { className: "aps-progress", children: /* @__PURE__ */ jsx("i", { style: { width: `${p.done / p.total * 100}%` } }) }),
      /* @__PURE__ */ jsxs("div", { className: "aps-card aps-nextcard", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-next", children: labels.next }),
        /* @__PURE__ */ jsx("h3", { children: p.next.title }),
        /* @__PURE__ */ jsxs("div", { className: "aps-meta", style: { justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxs("span", { children: [
            p.next.context,
            " · ",
            p.next.owner
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "aps-actions", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "aps-btn ghost", children: "Хойшлуулах" }),
            /* @__PURE__ */ jsxs("button", { type: "button", className: "aps-btn primary split", children: [
              /* @__PURE__ */ jsx("em", { children: "Эхлэх" }),
              /* @__PURE__ */ jsx("span", { className: "aps-cell", children: icons.arrow })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "aps-card", children: p.tasks.map((t) => /* @__PURE__ */ jsxs("div", { className: "aps-task " + t.status, children: [
        /* @__PURE__ */ jsx("span", { className: "aps-st " + t.status }),
        /* @__PURE__ */ jsx("span", { children: t.title }),
        /* @__PURE__ */ jsx("span", { className: "aps-meta", children: t.owner }),
        /* @__PURE__ */ jsx("span", { className: "aps-chip", children: t.due ?? statusLabel[t.status] })
      ] }, t.id)) })
    ] }),
    /* @__PURE__ */ jsxs("aside", { className: "aps-card aps-truth", children: [
      /* @__PURE__ */ jsx("span", { className: "aps-label", children: "Одоогийн үнэн" }),
      /* @__PURE__ */ jsx("ul", { children: p.truth.map((t) => /* @__PURE__ */ jsx("li", { children: t }, t)) })
    ] })
  ] });
}
function ChatScreen({ data }) {
  const c = data.chat;
  return /* @__PURE__ */ jsxs("div", { className: "aps-chatgrid", children: [
    /* @__PURE__ */ jsxs("div", { className: "aps-chat", children: [
      /* @__PURE__ */ jsx("div", { className: "aps-q", children: c.question }),
      /* @__PURE__ */ jsx(CitedAnswer, { segments: c.segments, sources: c.sources, pagesRead: 3 }),
      /* @__PURE__ */ jsxs("div", { className: "aps-field", children: [
        icons.spark,
        /* @__PURE__ */ jsx("input", { readOnly: true, value: "", placeholder: "Дараагийн асуултаа бич…", "aria-label": "Асуулт" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "aps-btn primary icon", "aria-label": "Илгээх", children: icons.arrow })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("aside", { className: "aps-chat", children: [
      /* @__PURE__ */ jsxs("div", { className: "aps-head", children: [
        /* @__PURE__ */ jsx("span", { className: "aps-label", children: "Thinking State" }),
        /* @__PURE__ */ jsx(RunningNow, { tasks: c.running, brand: null, align: "end" })
      ] }),
      /* @__PURE__ */ jsx(AgentPlan, { title: "Хариулахаас өмнөх төлөвлөгөө", defaultSteps: c.plan, status: "done", estimate: "~5 с" }),
      /* @__PURE__ */ jsx(DecisionCard, { decisions: c.decisions, host: true })
    ] })
  ] });
}
function MemoryScreen({ data }) {
  return /* @__PURE__ */ jsxs("div", { style: { maxWidth: 760, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsx("h2", { className: "aps-h1", children: "Санах ой" }),
    /* @__PURE__ */ jsx("p", { className: "aps-sub", children: "Агент юуг санаж байгааг хүн харж, засаж, мартуулна. Бүгд эх сурвалжтай." }),
    /* @__PURE__ */ jsx(MemoryPanel, { memories: data.memories, categories: data.memoryCategories, title: `${data.company}-ийн санах ой`, maxHeight: 520 })
  ] });
}
function TeamScreen({ data }) {
  const t = data.team;
  const sessions = t.sessions.map((x) => x.avatar || !x.owner ? x : { ...x, avatar: /* @__PURE__ */ jsx(AgentAvatar, { role: agentRoleFrom(x.owner), size: 20, decorative: true }) });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { className: "aps-h1", children: "Нэг тархитай баг" }),
    /* @__PURE__ */ jsx("p", { className: "aps-sub", children: "Хүн бүр, агент бүр нэг санах ойгоос уншиж, нэг самбар дээр ажиллана." }),
    /* @__PURE__ */ jsx(SessionBoard, { project: t.project, groups: t.groups, sessions, me: t.me })
  ] });
}
function AppScreen({ screen, data, theme = "day", variant = "tabs", still = false, labels = appScreenLabelsMn, onSelect, className = "", shell, lead }) {
  const dark = theme === "night";
  const body = {
    inbox: /* @__PURE__ */ jsx(InboxScreen, { data, labels }),
    note: /* @__PURE__ */ jsx(NoteScreen, { data }),
    project: /* @__PURE__ */ jsx(ProjectScreen, { data, labels }),
    chat: /* @__PURE__ */ jsx(ChatScreen, { data }),
    memory: /* @__PURE__ */ jsx(MemoryScreen, { data }),
    team: /* @__PURE__ */ jsx(TeamScreen, { data })
  }[screen];
  const counts = { inbox: data.inbox.filter((i) => !i.processed).length, project: data.project.total - data.project.done, memory: data.memories.length };
  return /* @__PURE__ */ jsx(MotionProvider, { paused: still, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `aps-root ${dark ? "dark " : "ts-surface-app "}${still ? "aps-still " : ""}${className}`,
      "data-ts-theme": dark ? "dark" : "cream",
      "data-theme": dark ? "dark" : "light",
      style: { height: "100%" },
      children: [
        /* @__PURE__ */ jsx("style", { children: CSS }),
        /* @__PURE__ */ jsx("div", { className: "aps-stage", children: /* @__PURE__ */ jsxs(AppWindow, { screen, variant, labels, counts, onSelect, company: data.company, shell, children: [
          lead,
          body
        ] }) })
      ]
    }
  ) });
}
export {
  AppScreen,
  AppWindow,
  ChatScreen,
  InboxScreen,
  MemoryScreen,
  NoteScreen,
  ProjectScreen,
  SCREENS,
  SCREEN_VIEW,
  TeamScreen,
  appScreenLabelsMn
};
//# sourceMappingURL=app-screens-4J_A8PaS.js.map
