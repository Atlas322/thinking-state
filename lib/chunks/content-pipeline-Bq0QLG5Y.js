import { jsxs, jsx } from "react/jsx-runtime";
import { d as SourcePreview, c as SourceIcon, b as BRAND_NAME } from "./source-preview-BedfD0w3.js";
const STATE_MN = { done: "дууссан", active: "явж байна", waiting: "батлалт хүлээж" };
const CSS = `
.cpl{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-surface);border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);padding:16px;display:grid;gap:12px;min-width:0}
.cpl *,.cpl *::before{box-sizing:border-box}
.cpl-head h3{margin:0;font:var(--ts-head-weight,600) 16px/1.3 var(--ts-font-head,var(--ts-font))}.cpl-head p{margin:2px 0 0;font-size:12px;color:var(--ts-faint)}
.cpl-cols{display:grid;grid-template-columns:28px minmax(0,1.1fr) minmax(0,1fr) minmax(0,.9fr) minmax(0,1fr) auto;gap:10px;align-items:center;font:500 10.5px/1.2 var(--ts-font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint);padding:0 4px}
.cpl ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.cpl-row{display:grid;grid-template-columns:28px minmax(0,1.1fr) minmax(0,1fr) minmax(0,.9fr) minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 4px;border-top:1px solid var(--ts-line)}
.cpl-n{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:11.5px;font-weight:600;background:var(--ts-soft-2);color:var(--ts-muted)}
.cpl-row[data-state=done] .cpl-n{background:var(--ts-status-done-bg);color:var(--ts-status-done-fg)}
.cpl-row[data-state=active] .cpl-n{background:var(--ts-status-running-bg);color:var(--ts-status-running-fg)}
.cpl-row[data-state=waiting] .cpl-n{background:var(--ts-status-needs-you-bg);color:var(--ts-status-needs-you-fg)}
.cpl-step b{display:block;font-size:13px}.cpl-step small{font-size:11.5px;color:var(--ts-faint)}
.cpl-actor{display:inline-flex;align-items:center;gap:5px;margin-top:3px;font-size:11px;color:var(--ts-muted)}
.cpl-actor i{width:6px;height:6px;border-radius:50%;background:var(--ts-electric)}.cpl-actor[data-kind=human] i{background:var(--ts-status-needs-you-fg)}
.cpl-tool{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;min-width:0}
.cpl-tool span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cpl-ok{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:var(--ts-radius-pill,999px);font-size:11px;font-weight:500;white-space:nowrap;background:var(--ts-status-needs-you-bg);color:var(--ts-status-needs-you-fg)}
.cpl-st{font-size:11px;color:var(--ts-faint);white-space:nowrap}
.cpl-row>.sp{justify-self:start;min-width:0;max-width:100%}
.cpl .sp-chip{max-width:100%;font-size:13px}
.cpl-note{margin:0;font:500 11px/1.4 var(--ts-font-mono);color:var(--ts-faint)}
@media (max-width:860px){.cpl-cols{display:none}.cpl-row{grid-template-columns:28px minmax(0,1fr);row-gap:6px}.cpl-row>:nth-child(n+3){grid-column:2}}
`;
function ContentPipeline({ title = "Контентын урсгал", subtitle, steps, note: note2, className = "" }) {
  return /* @__PURE__ */ jsxs("section", { className: `cpl ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: CSS }),
    /* @__PURE__ */ jsxs("header", { className: "cpl-head", children: [
      /* @__PURE__ */ jsx("h3", { children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { children: subtitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cpl-cols", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("span", { children: "#" }),
      /* @__PURE__ */ jsx("span", { children: "Алхам · хэн" }),
      /* @__PURE__ */ jsx("span", { children: "Эх (тархинаас)" }),
      /* @__PURE__ */ jsx("span", { children: "Хэрэгсэл" }),
      /* @__PURE__ */ jsx("span", { children: "Гаралт" }),
      /* @__PURE__ */ jsx("span", {})
    ] }),
    /* @__PURE__ */ jsx("ol", { children: steps.map((s, i) => /* @__PURE__ */ jsxs("li", { className: "cpl-row", "data-state": s.state ?? "waiting", children: [
      /* @__PURE__ */ jsx("span", { className: "cpl-n", "aria-hidden": "true", children: i + 1 }),
      /* @__PURE__ */ jsxs("div", { className: "cpl-step", children: [
        /* @__PURE__ */ jsx("b", { children: s.title }),
        /* @__PURE__ */ jsxs("span", { className: "cpl-actor", "data-kind": s.actor.kind, children: [
          /* @__PURE__ */ jsx("i", { "aria-hidden": "true" }),
          s.actor.kind === "agent" ? "агент" : "хүн",
          " · ",
          s.actor.name
        ] })
      ] }),
      /* @__PURE__ */ jsx(SourcePreview, { source: s.source }),
      /* @__PURE__ */ jsxs("span", { className: "cpl-tool", children: [
        /* @__PURE__ */ jsx(SourceIcon, { kind: "brand", brand: s.tool, size: 14, tile: false }),
        /* @__PURE__ */ jsx("span", { children: BRAND_NAME[s.tool] ?? s.tool })
      ] }),
      /* @__PURE__ */ jsx(SourcePreview, { source: s.output }),
      s.approval ? /* @__PURE__ */ jsx("span", { className: "cpl-ok", children: "хүн батална" }) : /* @__PURE__ */ jsx("span", { className: "cpl-st", children: STATE_MN[s.state ?? "waiting"] })
    ] }, s.id)) }),
    note2 && /* @__PURE__ */ jsx("p", { className: "cpl-note", children: note2 })
  ] });
}
const note = (id, title, quote, extra = {}) => ({ id, title, kind: "note", kindLabel: "Тэмдэглэл · тархи", date: "2026.11", quote, ...extra });
const file = (id, title, brand, quote, kindLabel) => ({ id, title, kind: "document", brand, kindLabel, date: "2026.11", quote });
const contentPipelineDemo = {
  title: "Контентын урсгал · Reel №4",
  subtitle: "ac.me Маркетинг · тархинаас гарч, апп удирдаж, ажлын апп руу орно",
  steps: [
    {
      id: "s1",
      title: "Судалгаа",
      actor: { name: "Судалгааны агент", kind: "agent" },
      tool: "microsoft-word",
      state: "done",
      source: note("n1", "Брэнд ба суваг · үзэгчийн судалгаа", "Үзэгчдийн 62% нь 30 секундээс богино видео үздэг.", { highlight: "62%" }),
      output: file("o1", "Сэдвийн бриф", "microsoft-word", "Гол санаа: нэг асуулт, нэг хариулт, 25 секунд.", "Бриф · Word")
    },
    {
      id: "s2",
      title: "Зохиол",
      actor: { name: "Контент агент", kind: "agent" },
      tool: "microsoft-word",
      state: "done",
      approval: true,
      source: file("o1b", "Сэдвийн бриф", "microsoft-word", "Гол санаа: нэг асуулт, нэг хариулт, 25 секунд.", "Бриф · Word"),
      output: file("o2", "Reel №4 эх бичвэр", "microsoft-word", "Дэгээ: «Санах ой толгойноос гадна».", "Эх бичвэр · Word")
    },
    {
      id: "s3",
      title: "Дуу хоолой",
      actor: { name: "Дууны агент", kind: "agent" },
      tool: "elevenlabs",
      state: "done",
      source: file("o2b", "Reel №4 эх бичвэр", "microsoft-word", "Дэгээ: «Санах ой толгойноос гадна».", "Эх бичвэр · Word"),
      output: { id: "o3", title: "Дуу хоолой · 24 с", kind: "document", brand: "elevenlabs", kindLabel: "Аудио · ElevenLabs", date: "2026.11", quote: "Брэндийн дуу хоолойн загвараар уншсан." }
    },
    {
      id: "s4",
      title: "Дизайн",
      actor: { name: "Дизайнер", kind: "human" },
      tool: "figma",
      state: "done",
      source: note("n4", "Контентын сан · reel-ийн загвар", "10 кадр, cover-т нэг өгүүлбэр."),
      output: file("o4", "Cover ба 10 кадр", "figma", "Electric дэвсгэр, цагаан геометр холбоос.", "Дизайн · Figma")
    },
    {
      id: "s5",
      title: "Эвлүүлэг",
      actor: { name: "Видео редактор", kind: "human" },
      tool: "adobe-premiere",
      state: "active",
      source: file("o4b", "Cover ба 10 кадр", "figma", "Electric дэвсгэр, цагаан геометр холбоос.", "Дизайн · Figma"),
      output: file("o5", "Reel №4 · эвлүүлэг", "adobe-premiere", "Дуу, кадр, хөгжим нэг шугамд.", "Видео · Premiere")
    },
    {
      id: "s6",
      title: "Caption ба хуваарь",
      actor: { name: "Контент агент", kind: "agent" },
      tool: "google-sheets",
      state: "waiting",
      source: file("o5b", "Reel №4 · эвлүүлэг", "adobe-premiere", "Дуу, кадр, хөгжим нэг шугамд.", "Видео · Premiere"),
      output: file("o6", "Caption · 3 хувилбар", "google-sheets", "Хуваарь: Мягмар 19:00, Threads ба Instagram.", "Хүснэгт · Sheets")
    },
    {
      id: "s7",
      title: "Нийтлэх ба зар",
      actor: { name: "Брэнд менежер", kind: "human" },
      tool: "meta",
      state: "waiting",
      approval: true,
      source: file("o6b", "Caption · 3 хувилбар", "google-sheets", "Хуваарь: Мягмар 19:00, Threads ба Instagram.", "Хүснэгт · Sheets"),
      output: file("o7", "Товлосон пост + Meta зар", "meta", "Төсөв 300 000 ₮, 5 хоног.", "Пост · Meta")
    }
  ],
  note: "ac.me — жишээ өгөгдөл, бодит харилцагч биш"
};
export {
  ContentPipeline as C,
  contentPipelineDemo as c
};
//# sourceMappingURL=content-pipeline-Bq0QLG5Y.js.map
