import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const PARA_KEYS = ["inbox", "today", "waiting", "projects", "areas", "resources", "archive"];
const paraBaseMn = {
  inbox: { label: "Inbox", line: "Ирсэн бүхэн нэг хаалгаар орж ангилагдана" },
  today: { label: "Өнөөдөр", line: "Өнөөдөр хийх дараагийн алхмууд" },
  waiting: { label: "Хүлээгдэж буй", line: "Хэн нэгний хариу, батламж хүлээж буй ажил" },
  projects: { label: "Төсөл", line: "Дуусах хугацаатай ажил" },
  areas: { label: "Хүрээ", line: "Тогтмол хариуцдаг чиглэл" },
  resources: { label: "Нөөц", line: "Дахин ашиглах материал" },
  archive: { label: "Архив", line: "Дууссан, хадгалах зүйл" }
};
const appShellLabelsMn = { ceo: "Удирдлагын тойм", gtd: "GTD", para: "PARA", views: "Харагдац", calendar: "Хуанли", agents: "Агентууд", nav: "Апп-ын цэс" };
const CSS = `
.ash *,.ash *::before{box-sizing:border-box}
.ash{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-page);display:grid;grid-template-columns:232px minmax(0,1fr);min-height:640px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);overflow:hidden}
.ash.has-aside{grid-template-columns:232px minmax(0,1fr) 300px}
.ash-nav{background:var(--ts-soft);padding:16px 8px;display:flex;flex-direction:column;gap:2px;min-width:0}
.ash-ws{display:flex;align-items:center;gap:10px;padding:0 8px 14px}
.ash-ws b{width:28px;height:28px;border-radius:var(--ts-radius-tile,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:13px;font-weight:600;flex:none}
.ash-ws span{display:grid;line-height:1.25;min-width:0}.ash-ws strong{font-weight:500;font-size:14px}.ash-ws small{font-size:11px;color:var(--ts-faint)}
.ash-h{font:500 10.5px/1 var(--ts-font-mono);letter-spacing:.06em;color:var(--ts-faint);margin:12px 10px 6px}
.ash-it{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 8px;width:100%;padding:6px 10px;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);background:none;text-align:left;cursor:pointer;min-height:40px}
.ash-it:hover{background:color-mix(in srgb,var(--ts-fg) 5%,transparent)}
.ash-it[aria-current="page"]{background:var(--ts-surface);border-color:var(--ts-line)}
.ash-it span{font-size:13px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-it[aria-current="page"] span{font-weight:600}
.ash-it small{grid-column:1;font-size:10.5px;color:var(--ts-faint);line-height:1.2}
.ash-it em{grid-row:1/span 2;grid-column:2;font-style:normal;font-size:11px;color:var(--ts-faint);font-variant-numeric:tabular-nums}
.ash-it.is-ceo span{font-weight:600}.ash-it.is-ceo em{color:var(--ts-electric-fg);font:500 10px/1 var(--ts-font-mono)}
.ash-it:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-soft),0 0 0 2px var(--ts-electric)}
.ash-main{min-width:0;padding:24px 28px}
.ash-aside{border-left:1px solid var(--ts-line);background:var(--ts-surface);padding:20px;min-width:0}
@media (max-width:1100px){.ash.has-aside{grid-template-columns:232px minmax(0,1fr)}.ash-aside{grid-column:1/-1;border-left:0;border-top:1px solid var(--ts-line)}}
@media (max-width:720px){.ash,.ash.has-aside{grid-template-columns:minmax(0,1fr)}
.ash-nav{flex-direction:row;overflow-x:auto;gap:4px;padding:10px;scrollbar-width:none}
.ash-ws,.ash-h,.ash-it small{display:none}.ash-it{width:auto;flex:none;min-height:36px}
.ash-main{padding:16px}}
`;
function AppShell({ company, vocab, counts = {}, active = "ceo", onNavigate, aside, children, labels: labelsIn, className = "" }) {
  const L = { ...appShellLabelsMn, ...labelsIn };
  const [own, setOwn] = React.useState(active);
  const current = onNavigate ? active : own;
  const go = (v) => onNavigate ? onNavigate(v) : setOwn(v);
  const word = (k) => ({ ...paraBaseMn[k], ...vocab?.[k] });
  const item = (v, label, base, count, cls = "") => /* @__PURE__ */ jsxs("button", { type: "button", className: `ash-it ${cls}`, "aria-current": current === v ? "page" : void 0, onClick: () => go(v), title: base && base !== label ? `${label} · ${base}` : label, children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    base && base !== label && /* @__PURE__ */ jsx("small", { children: base }),
    count ? /* @__PURE__ */ jsx("em", { "aria-label": `${count} зүйл`, children: count }) : cls === "is-ceo" ? /* @__PURE__ */ jsx("em", { children: "CEO" }) : null
  ] }, v);
  return /* @__PURE__ */ jsxs("div", { className: `ash ${aside ? "has-aside" : ""} ${className}`, children: [
    /* @__PURE__ */ jsx("style", { children: CSS }),
    /* @__PURE__ */ jsxs("nav", { className: "ash-nav", "aria-label": L.nav, children: [
      /* @__PURE__ */ jsxs("div", { className: "ash-ws", children: [
        /* @__PURE__ */ jsx("b", { "aria-hidden": "true", children: company.initial ?? company.name.replace(/^ac\.me\s*/i, "").slice(0, 1).toUpperCase() }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("strong", { children: company.name }),
          company.note && /* @__PURE__ */ jsx("small", { children: company.note })
        ] })
      ] }),
      item("ceo", L.ceo, void 0, void 0, "is-ceo"),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.gtd }),
      ["inbox", "today", "waiting"].map((k) => item(k, word(k).label, paraBaseMn[k].label, counts[k])),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.para }),
      ["projects", "areas", "resources", "archive"].map((k) => item(k, word(k).label, paraBaseMn[k].label, counts[k])),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.views }),
      item("calendar", L.calendar),
      item("agents", L.agents)
    ] }),
    /* @__PURE__ */ jsx("main", { className: "ash-main", children }),
    aside && /* @__PURE__ */ jsx("aside", { className: "ash-aside", children: aside })
  ] });
}
const acmeParaVocab = {
  marketing: {
    inbox: { label: "Бриф, санаа", line: "Ирсэн бриф, контентын санаа, comment" },
    today: { label: "Өнөөдрийн пост", line: "Өнөөдөр нийтлэх, хариулах зүйл" },
    waiting: { label: "Батламж хүлээж", line: "Брэнд, хууль, харилцагчийн батламж" },
    projects: { label: "Кампанит ажил", line: "Хугацаатай кампанит ажил, influencer гэрээ" },
    areas: { label: "Брэнд ба суваг", line: "Брэнд, social суваг, CRM" },
    resources: { label: "Контентын сан", line: "Судалгаа, загвар, зураг, өмнөх пост" },
    archive: { label: "Дууссан кампанит ажил", line: "Хаагдсан кампанит ажил, гэрээ" }
  },
  logistics: {
    inbox: { label: "Ачааны хүсэлт", line: "Охин компани, гадны харилцагчаас ирсэн тээврийн захиалга" },
    today: { label: "Өнөөдрийн ачилт", line: "Өнөөдөр гарах вагон, машин, жолооч" },
    waiting: { label: "Гааль, хил дээр", line: "Зөвшөөрөл, бичиг баримт хүлээж буй ачаа" },
    projects: { label: "Маршрут, гэрээ", line: "Шинэ маршрут нээх, тарифын гэрээ" },
    areas: { label: "Парк ба агуулах", line: "Төмөр зам, авто парк, агуулахын тогтмол хариуцлага" },
    resources: { label: "Тариф, журам", line: "Тарифын хүснэгт, аюулгүй байдлын журам" },
    archive: { label: "Хүргэгдсэн ачаа", line: "Хаагдсан тээвэр, баримт" }
  }
};
export {
  AppShell as A,
  PARA_KEYS as P,
  acmeParaVocab as a,
  appShellLabelsMn as b,
  paraBaseMn as p
};
//# sourceMappingURL=app-shell-dMtc0PML.js.map
