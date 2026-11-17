import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const steps3 = [{ title: "a" }, { title: "b" }, { title: "c" }];
const defaultAgents = [
  {
    id: "launch",
    name: "Нээлтийн ахлагч",
    model: "Төлөвлөгч агент",
    avatar: "anthropic",
    tools: ["slack", "notion", "github"],
    status: "running",
    task: "Шинэ тарифын хуудсыг баасан гараг гэхэд нээх",
    took: 850,
    children: [
      { id: "l1", name: "Бичвэр", model: "Бичигч агент", avatar: "anthropic", tools: ["notion"], status: "running", task: "Тарифын хуудасны бичвэрийг бичих", cost: 42, took: 380, steps: steps3 },
      { id: "l2", name: "Дизайн", model: "Дизайны агент", avatar: "anthropic", tools: ["figma"], status: "waiting", task: "Нүүр хэсгийн загварыг сонгох", cost: 88, took: 420, ask: "Аль загварыг сонгох вэ?" },
      { id: "l3", name: "Хөгжүүлэлт", model: "Кодын агент", avatar: "anthropic", tools: ["github"], status: "running", task: "Хуудсыг тугийн ард гаргах", cost: 75, took: 600 }
    ]
  },
  {
    id: "support",
    name: "Тусламжийн ахлагч",
    model: "Тусламжийн агент",
    avatar: "anthropic",
    tools: ["zendesk", "slack"],
    status: "running",
    task: "Дараалалд буй 48 хүсэлтэд хариулах",
    took: 1570,
    children: [
      { id: "s1", name: "Төлбөр", model: "Тусламжийн агент", avatar: "anthropic", status: "running", task: "Төлбөрийн хүсэлтүүд", cost: 30, took: 600 },
      { id: "s2", name: "Алдаа", model: "Тусламжийн агент", avatar: "anthropic", status: "running", task: "Алдааны мэдэгдлүүд", cost: 33, took: 700 },
      { id: "s3", name: "Эрх", model: "Тусламжийн агент", avatar: "anthropic", status: "done", task: "Эрхийн хүсэлтүүд", cost: 20, took: 300 },
      { id: "s4", name: "Буцаалт", model: "Тусламжийн агент", avatar: "anthropic", status: "done", task: "Буцаалтууд", cost: 30, took: 400 }
    ]
  },
  {
    id: "release",
    name: "Хувилбарын менежер",
    model: "Үйл ажиллагааны агент",
    avatar: "openai",
    tools: ["github", "slack"],
    status: "running",
    task: "2.4 хувилбарыг апп дэлгүүрт гаргах",
    cost: 33,
    took: 2290,
    children: [
      { id: "r1", name: "Өөрчлөлтийн жагсаалт", model: "Бичигч агент", avatar: "anthropic", tools: ["github", "notion"], status: "done", task: "42 коммитоос хувилбарын тэмдэглэл бичих", cost: 9, took: 240, steps: steps3 },
      { id: "r2", name: "Утасны хувилбар", model: "Кодын агент", avatar: "openai", tools: ["github"], status: "failed", task: "Утасны хувилбарыг гарын үсэг зурж байршуулах", cost: 6, took: 180, error: "Гарын үсгийн гэрчилгээ хугацаа дууссан" },
      { id: "r3", name: "Дэлгэцийн зураг", model: "Дизайны агент", avatar: "gemini", tools: ["figma"], status: "done", task: "Дэлгүүрийн дэлгэцийн зургийг 8 хэлээр гаргах", cost: 15, took: 480, steps: steps3 }
    ]
  },
  {
    id: "market",
    name: "Зах зээлийн шинжээч",
    model: "Судлаач агент",
    avatar: "gemini",
    tools: ["notion", "slack"],
    status: "done",
    task: "Өрсөлдөгчийн долоо хоногийн тайлан бичих",
    took: 2520,
    children: [
      { id: "m1", name: "Цуглуулах", status: "done", task: "Цуглуулах", cost: 30, avatar: "gemini" },
      { id: "m2", name: "Харьцуулах", status: "done", task: "Харьцуулах", cost: 30, avatar: "gemini" },
      { id: "m3", name: "Бичих", status: "done", task: "Бичих", cost: 22, avatar: "gemini" },
      { id: "m4", name: "График", status: "done", task: "График", cost: 0, avatar: "gemini" }
    ]
  }
];
const avatars = {
  anthropic: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5", fill: "none", stroke: "#d97757", strokeWidth: "1.6" }) }),
  openai: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("rect", { x: "2.8", y: "2.8", width: "10.4", height: "10.4", rx: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }) }),
  gemini: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 2.2 13.8 13H2.2Z", fill: "none", stroke: "#3b7bf6", strokeWidth: "1.5", strokeLinejoin: "round" }) })
};
const toolMarks = {
  github: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("circle", { cx: "4.5", cy: "3.5", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("circle", { cx: "4.5", cy: "12.5", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("circle", { cx: "11.5", cy: "6", r: "1.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("path", { d: "M4.5 5v6M11.5 7.5c0 2-2 2.6-6 3.4", fill: "none", stroke: "currentColor", strokeWidth: "1.3" })
  ] }),
  notion: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("path", { d: "M3.5 1.8h6l3 3v9.4h-9Z", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M5.5 8h5M5.5 10.5h5", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" })
  ] }),
  slack: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", children: /* @__PURE__ */ jsx("path", { d: "M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2Z", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinejoin: "round" }) }),
  figma: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "12", height: "12", rx: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.3" }),
    /* @__PURE__ */ jsx("path", { d: "M2 6h12M6 6v8", stroke: "currentColor", strokeWidth: "1.3" })
  ] }),
  linear: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("path", { d: "M5.5 4h8M5.5 8h8M5.5 12h8", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("circle", { cx: "2.6", cy: "4", r: ".9", fill: "currentColor" }),
    /* @__PURE__ */ jsx("circle", { cx: "2.6", cy: "8", r: ".9", fill: "currentColor" }),
    /* @__PURE__ */ jsx("circle", { cx: "2.6", cy: "12", r: ".9", fill: "currentColor" })
  ] }),
  zendesk: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", children: [
    /* @__PURE__ */ jsx("path", { d: "M3 9a5 5 0 0 1 10 0v2.5M3 9v2.5", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("rect", { x: "2", y: "9", width: "2.6", height: "4", rx: "1", fill: "currentColor" }),
    /* @__PURE__ */ jsx("rect", { x: "11.4", y: "9", width: "2.6", height: "4", rx: "1", fill: "currentColor" })
  ] })
};
const fmtTime = (s = 0) => `${Math.floor(s / 60)} мин ${String(Math.round(s % 60)).padStart(2, "0")} с`;
const fmtCost = (n) => `${Math.round(n)}k токен`;
const branchCost = (a) => (a.cost ?? 0) + (a.children ?? []).reduce((n, c) => n + branchCost(c), 0);
function Pill({ status }) {
  const label = { queued: "Дараалалд", running: "Ажиллаж байна", waiting: "Таны ээлж", done: "Дууссан", failed: "Алдаатай", stopped: "Зогсоосон" }[status];
  return /* @__PURE__ */ jsxs("span", { className: `af-pill af-${status}`, children: [
    status === "running" && /* @__PURE__ */ jsx("span", { className: "af-spin", "aria-hidden": "true" }),
    status === "done" && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m3.5 8.5 3 3 6-7", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }) }),
    status === "failed" && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 2.5 14 13H2Z M8 6.5v3 M8 11.3v.2", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinejoin: "round", strokeLinecap: "round" }) }),
    label
  ] });
}
function Head({ a }) {
  const av = typeof a.avatar === "string" || !a.avatar ? avatars[a.avatar ?? "anthropic"] : a.avatar;
  return /* @__PURE__ */ jsxs("div", { className: "af-head", children: [
    /* @__PURE__ */ jsx("span", { className: "af-av", children: av }),
    /* @__PURE__ */ jsxs("span", { className: "af-name", children: [
      /* @__PURE__ */ jsx("strong", { children: a.name }),
      a.model && /* @__PURE__ */ jsx("small", { children: a.model })
    ] }),
    /* @__PURE__ */ jsx(Pill, { status: a.status })
  ] });
}
function Task({ a }) {
  return /* @__PURE__ */ jsxs("div", { className: "af-task", children: [
    a.tools && a.tools.length > 0 && /* @__PURE__ */ jsx("span", { className: "af-tools", children: a.tools.map((t) => /* @__PURE__ */ jsx("span", { className: "af-tool", children: toolMarks[t] }, t)) }),
    /* @__PURE__ */ jsx("span", { className: "af-task-t", children: a.task })
  ] });
}
function summary(a) {
  const c = a.children ?? [];
  const waiting = c.filter((x) => x.status === "waiting").length;
  const failed = c.filter((x) => x.status === "failed").length;
  const running = c.filter((x) => x.status === "running").length;
  if (waiting) return { kind: "wait", text: `${waiting} таны ээлж` };
  if (failed) return { kind: "fail", text: `${failed} алдаатай` };
  if (running) return { kind: "run", text: `${running}/${c.length} ажиллаж байна` };
  return { kind: "done", text: `Бүгд дууссан (${c.filter((x) => x.cost).length})` };
}
function AgentFleet({
  agents = defaultAgents,
  open,
  defaultOpen,
  onOpenChange,
  onResolve,
  onSelect,
  title = "Агентын баг",
  className = ""
}) {
  const [inner, setInner] = React.useState(defaultOpen === void 0 ? agents.find((a) => a.id === "release")?.id ?? agents[0]?.id ?? null : defaultOpen);
  const openId = open !== void 0 ? open : inner;
  const setOpen = (id) => {
    if (open === void 0) setInner(id);
    onOpenChange?.(id);
  };
  const opened = agents.find((a) => a.id === openId) ?? null;
  const subs = agents.reduce((n, a) => n + (a.children?.length ?? 0), 0);
  const all = agents.flatMap((a) => [a, ...a.children ?? []]);
  const running = all.filter((a) => a.status === "running").length;
  const needs = all.filter((a) => a.status === "waiting").length;
  const total = agents.reduce((n, a) => n + branchCost(a), 0);
  const kids = opened?.children ?? [];
  return /* @__PURE__ */ jsxs("section", { className: `af ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "af-bar", children: [
      /* @__PURE__ */ jsxs("span", { className: "af-title", children: [
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 1.5 7.2 5 10.5 6 7.2 7 6 10.5 4.8 7 1.5 6 4.8 5ZM12 9l.7 1.8 1.8.7-1.8.7L12 14l-.7-1.8-1.8-.7 1.8-.7Z", fill: "currentColor" }) }),
        title
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "af-stats", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          agents.length,
          " агент / ",
          subs,
          " дэд агент"
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          running,
          " ажиллаж байна"
        ] }),
        needs > 0 && /* @__PURE__ */ jsxs("span", { children: [
          needs,
          " таны ээлж"
        ] }),
        /* @__PURE__ */ jsx("strong", { children: fmtCost(total) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "af-grid", children: [
      /* @__PURE__ */ jsx("div", { className: "af-col", children: agents.map((a) => {
        const s = summary(a);
        const isOpen = a.id === openId;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: `af-card${isOpen ? " is-open" : opened ? " is-dim" : ""}`,
            "aria-expanded": isOpen,
            onClick: () => setOpen(isOpen ? null : a.id),
            children: [
              /* @__PURE__ */ jsx(Head, { a }),
              /* @__PURE__ */ jsx(Task, { a }),
              /* @__PURE__ */ jsxs("div", { className: "af-foot", children: [
                /* @__PURE__ */ jsxs("span", { className: `af-sum af-sum-${s.kind}`, children: [
                  /* @__PURE__ */ jsx("span", { className: "af-dot", "aria-hidden": "true" }),
                  s.text
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "af-meta", children: [
                  /* @__PURE__ */ jsx("strong", { children: fmtCost(branchCost(a)) }),
                  " · ",
                  fmtTime(a.took)
                ] })
              ] })
            ]
          },
          a.id
        );
      }) }),
      opened && kids.length > 0 && /* @__PURE__ */ jsx("div", { className: "af-tree", style: { marginTop: Math.max(0, agents.indexOf(opened) * 96 + 44 - (kids.length * 96 - 8) / 2) }, children: /* @__PURE__ */ jsx("div", { className: "af-kids", children: kids.map((k) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `af-card af-kid af-k-${k.status}`,
          role: onSelect ? "button" : void 0,
          tabIndex: onSelect ? 0 : void 0,
          onClick: () => onSelect?.(k),
          children: [
            /* @__PURE__ */ jsx(Head, { a: k }),
            /* @__PURE__ */ jsx(Task, { a: k }),
            /* @__PURE__ */ jsxs("div", { className: "af-foot", children: [
              /* @__PURE__ */ jsxs("span", { className: "af-meta", children: [
                /* @__PURE__ */ jsx("strong", { children: fmtCost(k.cost ?? 0) }),
                " · ",
                fmtTime(k.took)
              ] }),
              k.status === "failed" || k.status === "waiting" ? /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "af-resolve",
                  onClick: (e) => {
                    e.stopPropagation();
                    onResolve?.(k, k.status === "failed" ? "retry" : "approve");
                  },
                  children: k.status === "failed" ? "Шийдэх" : "Хариулах"
                }
              ) : k.steps?.length ? /* @__PURE__ */ jsxs("span", { className: "af-tasks", children: [
                k.steps.length,
                " даалгавар"
              ] }) : null
            ] })
          ]
        },
        k.id
      )) }) })
    ] })
  ] });
}
const css = `
.af{--af-bg:#fff;--af-fg:#18181b;--af-muted:#65656d;--af-faint:#65656d;--af-line:#ececef;--af-chip:#f4f4f5;--af-blue:#2563eb;--af-blue-bg:#eaf2ff;--af-green:#15803d;--af-green-bg:#e9f8ee;--af-red:#c62828;--af-red-bg:#fdecec;--af-amber:#b45309;--af-amber-bg:#fff4e0;--af-conn:#93b8f5;width:100%;max-width:590px;color:var(--af-fg);font:400 13px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .af{--af-bg:#1b1b1e;--af-fg:#ececef;--af-muted:#a1a1aa;--af-faint:#9a9aa2;--af-line:#2e2e33;--af-chip:#2a2a2f;--af-blue:#60a5fa;--af-blue-bg:#1d2a44;--af-green:#4ade80;--af-green-bg:#16301f;--af-red:#f87171;--af-red-bg:#3a1c1e;--af-amber:#fbbf24;--af-amber-bg:#3a2a12;--af-conn:#3f5f99;color-scheme:dark}
.af *{box-sizing:border-box}.af button{font:inherit;color:inherit;cursor:pointer}
.af-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 4px 12px}
.af-title{display:flex;align-items:center;gap:8px;font-weight:500;font-size:14px}.af-title svg{width:14px;height:14px;color:var(--af-blue)}
.af-stats{display:flex;gap:10px;align-items:center;color:var(--af-muted);font-size:12.5px}.af-stats strong{color:var(--af-fg);font-weight:500;margin-left:10px}
.af-grid{display:flex;align-items:flex-start}
.af-col{display:flex;flex-direction:column;gap:8px;width:290px;flex:none}
.af-card{display:block;width:100%;text-align:left;background:var(--af-bg);border:1px solid var(--af-line);border-radius:8px;padding:9px 10px 8px;box-shadow:0 1px 2px #0000000a;transition:opacity .2s,border-color .15s}
.af-card:hover{border-color:color-mix(in srgb,var(--af-fg) 18%,transparent)}
.af-card.is-dim{--af-fg:var(--af-muted);background:var(--af-chip);border-color:transparent;box-shadow:none}.af-card.is-dim:hover{--af-fg:inherit;background:var(--af-bg);border-color:var(--af-line)}
.af-head{display:flex;align-items:flex-start;gap:8px}
.af-av{display:grid;place-items:center;width:22px;height:22px;flex:none;margin-top:3px;color:var(--af-fg)}.af-av svg{width:15px;height:15px}
.af-name{display:flex;flex-direction:column;min-width:0;flex:1}.af-name strong{font-weight:500;font-size:13px}.af-name small{font-size:11px;color:var(--af-faint)}
.af-pill{display:inline-flex;align-items:center;gap:4px;height:18px;padding:0 6px;border-radius:4px;font-size:11px;font-weight:500;flex:none}
.af-pill svg{width:10px;height:10px}
.af-running{color:var(--af-blue);background:var(--af-blue-bg)}.af-done{color:var(--af-green);background:var(--af-green-bg)}.af-failed{color:var(--af-red);background:var(--af-red-bg)}.af-waiting{color:var(--af-amber);background:var(--af-amber-bg)}.af-queued,.af-stopped{color:var(--af-muted);background:var(--af-chip)}
.af-spin{width:8px;height:8px;border-radius:50%;border:1.5px solid currentColor;border-right-color:transparent;animation:af-spin 1s linear infinite}
.af-task{display:flex;align-items:center;gap:7px;margin:5px 0 7px;min-width:0;font-size:12.5px}
.af-tools{display:flex;flex:none}.af-tool{display:grid;place-items:center;width:13px;height:13px;margin-right:-2px}.af-tool svg{width:12px;height:12px;color:var(--af-fg)}
.af-task-t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--af-fg)}
.af-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11.5px;color:var(--af-muted);min-height:20px}
.af-sum{display:flex;align-items:center;gap:6px}
.af-dot{width:9px;height:9px;border-radius:50%;border:1.5px solid var(--af-faint)}
.af-sum-fail .af-dot{background:var(--af-faint);border-color:var(--af-faint)}.af-sum-done .af-dot{background:var(--af-faint)}
.af-meta strong{color:var(--af-fg);font-weight:500}
.af-tasks{color:var(--af-muted)}
.af-resolve{height:20px;padding:0 8px;border:1px solid var(--af-line);border-radius:5px;background:var(--af-bg);font-size:11px!important;font-weight:500}
.af-resolve:hover{background:var(--af-chip)}
.af-tree{position:relative;flex:none;width:294px;padding-left:54px;animation:af-in .25s both}
.af-kids{position:relative;display:flex;flex-direction:column;gap:8px}
.af-kids::before{content:"";position:absolute;left:-26px;top:22px;bottom:22px;border-left:1.5px solid var(--af-conn)}
.af-kid{position:relative}
.af-kid::before{content:"";position:absolute;left:-27px;top:21px;width:27px;border-top:1.5px solid var(--af-conn)}
.af-tree::before{content:"";position:absolute;left:0;top:var(--af-y,50%);width:28px;border-top:1.5px solid var(--af-conn)}
.af-tree::after{content:"";position:absolute;left:-4px;top:calc(50% - 4px);width:7px;height:7px;border-radius:50%;background:var(--af-bg);border:1.5px solid var(--af-conn)}
.af-kid .af-task{margin:5px 0 7px}
.af-kid.af-k-queued,.af-kid.af-k-stopped{--af-fg:var(--af-muted);background:var(--af-chip);border-color:transparent;box-shadow:none}
.af :focus-visible{outline:2px solid var(--af-blue);outline-offset:2px}
@keyframes af-spin{to{transform:rotate(360deg)}}
@keyframes af-in{from{opacity:0;transform:translateX(-6px)}}
@media(max-width:640px){.af-grid{flex-direction:column}.af-col{width:100%}.af-tree{margin:12px 0 0;padding-left:28px;width:100%}.af-tree::before,.af-tree::after{display:none}.af-stats span:nth-child(2),.af-stats span:nth-child(3){display:none}}
@media(prefers-reduced-motion:reduce){.af *,.af *::before{animation:none!important;transition:none!important}}
.af-card{animation:afcardrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.af-card:nth-child(1){animation-delay:0ms}.af-card:nth-child(2){animation-delay:110ms}.af-card:nth-child(3){animation-delay:220ms}.af-card:nth-child(4){animation-delay:330ms}.af-card:nth-child(5){animation-delay:440ms}.af-card:nth-child(6){animation-delay:550ms}.af-card:nth-child(7){animation-delay:660ms}.af-card:nth-child(8){animation-delay:770ms}.af-card:nth-child(9){animation-delay:880ms}.af-card:nth-child(10){animation-delay:990ms}.af-card:nth-child(11){animation-delay:1100ms}.af-card:nth-child(12){animation-delay:1210ms}@keyframes afcardrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.af-card{animation:none}}
`;
const agentFleetDemo = {};
export {
  AgentFleet as A,
  agentFleetDemo as a
};
//# sourceMappingURL=agent-fleet-sLn0F61_.js.map
