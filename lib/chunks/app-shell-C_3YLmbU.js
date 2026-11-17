import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { m as motionVar } from "./tokens-jmej6VeF.js";
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
const appShellLabelsMn = { ceo: "Удирдлагын тойм", gtd: "GTD", para: "PARA", views: "Харагдац", calendar: "Хуанли", agents: "Агентууд", nav: "Апп-ын цэс", title: "Second Brain", ask: "Тархинаасаа асуу" };
const ICON = {
  ceo: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { width: "7", height: "9", x: "3", y: "3", rx: "1" }),
    /* @__PURE__ */ jsx("rect", { width: "7", height: "5", x: "14", y: "3", rx: "1" }),
    /* @__PURE__ */ jsx("rect", { width: "7", height: "9", x: "14", y: "12", rx: "1" }),
    /* @__PURE__ */ jsx("rect", { width: "7", height: "5", x: "3", y: "16", rx: "1" })
  ] }),
  inbox: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12" }),
    /* @__PURE__ */ jsx("path", { d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" })
  ] }),
  today: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "M12 2v2" }),
    /* @__PURE__ */ jsx("path", { d: "M12 20v2" }),
    /* @__PURE__ */ jsx("path", { d: "m4.93 4.93 1.41 1.41" }),
    /* @__PURE__ */ jsx("path", { d: "m17.66 17.66 1.41 1.41" }),
    /* @__PURE__ */ jsx("path", { d: "M2 12h2" }),
    /* @__PURE__ */ jsx("path", { d: "M20 12h2" }),
    /* @__PURE__ */ jsx("path", { d: "m6.34 17.66-1.41 1.41" }),
    /* @__PURE__ */ jsx("path", { d: "m19.07 4.93-1.41 1.41" })
  ] }),
  waiting: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M5 22h14" }),
    /* @__PURE__ */ jsx("path", { d: "M5 2h14" }),
    /* @__PURE__ */ jsx("path", { d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" }),
    /* @__PURE__ */ jsx("path", { d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" })
  ] }),
  projects: /* @__PURE__ */ jsx("path", { d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" }),
  areas: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" }),
    /* @__PURE__ */ jsx("path", { d: "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" }),
    /* @__PURE__ */ jsx("path", { d: "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" })
  ] }),
  resources: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M12 7v14" }),
    /* @__PURE__ */ jsx("path", { d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" })
  ] }),
  archive: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }),
    /* @__PURE__ */ jsx("path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }),
    /* @__PURE__ */ jsx("path", { d: "M10 12h4" })
  ] }),
  calendar: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M8 2v4" }),
    /* @__PURE__ */ jsx("path", { d: "M16 2v4" }),
    /* @__PURE__ */ jsx("rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M3 10h18" })
  ] }),
  agents: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M12 8V4H8" }),
    /* @__PURE__ */ jsx("rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M2 14h2" }),
    /* @__PURE__ */ jsx("path", { d: "M20 14h2" }),
    /* @__PURE__ */ jsx("path", { d: "M15 13v2" }),
    /* @__PURE__ */ jsx("path", { d: "M9 13v2" })
  ] }),
  ask: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
  ] }),
  search: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
    /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })
  ] }),
  switch: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "m7 15 5 5 5-5" }),
    /* @__PURE__ */ jsx("path", { d: "m7 9 5-5 5 5" })
  ] }),
  sep: /* @__PURE__ */ jsx("path", { d: "m9 18 6-6-6-6" })
};
const Ic = ({ k }) => /* @__PURE__ */ jsx("svg", { className: "ash-ic", viewBox: "0 0 24 24", "aria-hidden": "true", children: ICON[k] });
const CSS = `
.ash-win{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;color:var(--ts-fg);background:var(--ts-page);border:1px solid var(--ts-line);border-radius:calc(var(--ts-radius,6px) + 4px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size;display:flex;flex-direction:column}
.ash-win *,.ash-win *::before{box-sizing:border-box}
.ash-ic{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:var(--ts-icon-stroke,1.5);stroke-linecap:round;stroke-linejoin:round}
.ash-bar{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,auto) minmax(0,1fr);align-items:center;gap:12px;height:40px;padding:0 12px;border-bottom:1px solid var(--ts-line);background:var(--ts-side);flex:none}
.ash-lead{display:flex;align-items:center;gap:14px;min-width:0}
.ash-dots{display:flex;gap:6px;flex:none}.ash-dots i{width:10px;height:10px;border-radius:50%;background:color-mix(in srgb,var(--ts-faint) 30%,transparent)}
.ash-title{display:flex;align-items:center;gap:4px;min-width:0;font-size:12.5px;color:var(--ts-faint);white-space:nowrap}
.ash-title .ash-ic{width:13px;height:13px}
.ash-title b{font-weight:500;color:var(--ts-fg);overflow:hidden;text-overflow:ellipsis}
.ash-ask{display:inline-flex;align-items:center;gap:8px;width:300px;max-width:100%;height:28px;padding:0 6px 0 9px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-control,8px);background:var(--ts-surface);color:var(--ts-faint);font:inherit;font-size:12.5px;cursor:pointer;white-space:nowrap;min-width:0;transition:border-color ${motionVar.duration("xs")},color ${motionVar.duration("xs")}}
.ash-ask span{flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis}
.ash-ask .ash-ic{width:14px;height:14px}
.ash-ask kbd{font:500 10.5px/1 var(--ts-font-mono);padding:3px 5px;border-radius:4px;background:var(--ts-soft);color:var(--ts-muted)}
.ash-ask:hover,.ash-ask[aria-pressed="true"]{border-color:var(--ts-electric);color:var(--ts-electric-fg,var(--ts-electric))}
.ash-ask:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 2px var(--ts-electric)}
.ash-me{justify-self:end;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--ts-electric-soft);color:var(--ts-on-accent-soft,var(--ts-electric-fg));font-size:11px;font-weight:600}
.ash *,.ash *::before{box-sizing:border-box}
.ash{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;color:var(--ts-fg);background:var(--ts-page);display:grid;grid-template-columns:216px minmax(0,1fr);min-height:560px;min-width:0;flex:1}
.ash.no-nav{grid-template-columns:minmax(0,1fr)}
.ash.is-bare{border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);overflow:hidden;container-type:inline-size}
.ash.has-aside{grid-template-columns:216px minmax(0,1fr) 300px}
.ash-nav{background:var(--ts-side);padding:10px 8px;display:flex;flex-direction:column;gap:1px;min-width:0;border-right:1px solid var(--ts-line);overflow:auto;scrollbar-width:none}
.ash-ws{display:flex;align-items:center;gap:8px;margin:0 0 8px;padding:6px 8px;border-radius:var(--ts-radius-control,8px);color:var(--ts-muted)}
.ash-ws b{width:22px;height:22px;border-radius:var(--ts-radius-tile,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:11.5px;font-weight:600;flex:none}
.ash-ws span{display:grid;line-height:1.25;min-width:0;flex:1}.ash-ws strong{font-weight:600;font-size:13px;color:var(--ts-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ash-ws small{font-size:11px;color:var(--ts-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ash-ws .ash-ic{width:14px;height:14px;color:var(--ts-faint)}
.ash-h{font:500 11px/1 var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-faint);margin:14px 8px 6px}
.ash-it{display:grid;grid-template-columns:16px minmax(0,1fr) auto;align-items:center;gap:0 9px;width:100%;padding:0 8px;border:0;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted);font:inherit;text-align:left;cursor:pointer;min-height:32px;transition:background ${motionVar.duration("xs")},color ${motionVar.duration("xs")}}
.ash-it:hover{background:color-mix(in srgb,var(--ts-fg) 5%,transparent);color:var(--ts-fg)}
.ash-it[aria-current="page"]{background:color-mix(in srgb,var(--ts-fg) 8%,transparent);color:var(--ts-fg)}
.ash-it[aria-current="page"] .ash-ic{color:var(--ts-electric-fg,var(--ts-electric))}
.ash-it span{font-size:13px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-it[aria-current="page"] span{font-weight:500}
.ash-it small{grid-column:2;font-size:10.5px;color:var(--ts-faint);line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-bottom:5px}
.ash-it em{grid-row:1;grid-column:3;font-style:normal;min-width:20px;padding:1px 6px;border-radius:999px;background:color-mix(in srgb,var(--ts-fg) 7%,transparent);font-size:11px;line-height:16px;text-align:center;color:var(--ts-muted);font-variant-numeric:tabular-nums}
.ash-it:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-side),0 0 0 2px var(--ts-electric)}
.ash-extra{margin-top:8px;min-width:0}
.ash.is-fixed{flex:none;overflow:auto;align-items:start}.ash.is-fixed>.ash-nav{position:sticky;top:0;z-index:2;align-self:stretch;max-height:100%}.ash.is-fixed>.ash-main{overflow:visible}
.ash-main{min-width:0;min-height:0;padding:20px 24px;overflow:auto}
.ash-view{animation:ash-view-in ${motionVar.duration("md")} ${motionVar.easing("enter")} both}
@keyframes ash-view-in{from{opacity:0;transform:translateY(6px)}}
@media (prefers-reduced-motion:reduce){.ash-view{animation:none}.ash-it,.ash-ask{transition:none}}
.ash-aside{border-left:1px solid var(--ts-line);background:var(--ts-surface);padding:16px;min-width:0}
@container (max-width:1100px){.ash.has-aside{grid-template-columns:200px minmax(0,1fr)}.ash-aside{grid-column:2;border-left:0;border-top:1px solid var(--ts-line)}}
@container (max-width:860px){.ash,.ash.has-aside{grid-template-columns:176px minmax(0,1fr)}.ash.no-nav{grid-template-columns:minmax(0,1fr)}.ash-it small{display:none}.ash-main{padding:16px 18px}.ash-ask{width:220px}}
@container (max-width:600px){.ash,.ash.has-aside{grid-template-columns:minmax(0,1fr)}.ash-aside{grid-column:1}
.ash-nav{flex-direction:row;overflow-x:auto;gap:4px;padding:6px 8px;border-right:0;border-bottom:1px solid var(--ts-line)}
.ash-ws,.ash-h,.ash-it small,.ash-extra{display:none}.ash-it{width:auto;flex:none;min-height:36px}
.ash-main{padding:14px}.ash-title,.ash-me{display:none}.ash-bar{grid-template-columns:auto minmax(0,1fr)}.ash-ask{width:100%}}
`;
function AppShell({ company, vocab, counts = {}, active = "ceo", onNavigate, aside, children, labels: labelsIn, className = "", frame = true, title, onAsk, navExtra, nav = true, height }) {
  const L = { ...appShellLabelsMn, ...labelsIn };
  const [own, setOwn] = React.useState(active);
  React.useEffect(() => setOwn(active), [active]);
  const current = onNavigate ? active : own;
  const go = (v) => onNavigate ? onNavigate(v) : setOwn(v);
  const word = (k) => ({ ...paraBaseMn[k], ...vocab?.[k] });
  const item = (v, label, base, count, cls = "") => /* @__PURE__ */ jsxs("button", { type: "button", className: `ash-it ${cls}`, "aria-current": current === v ? "page" : void 0, onClick: () => go(v), title: base && base !== label ? `${label} · ${base}` : label, children: [
    /* @__PURE__ */ jsx(Ic, { k: v }),
    /* @__PURE__ */ jsx("span", { children: label }),
    count ? /* @__PURE__ */ jsx("em", { "aria-label": `${count} зүйл`, children: count }) : null,
    base && base !== label && /* @__PURE__ */ jsx("small", { children: base })
  ] }, v);
  const shell = /* @__PURE__ */ jsxs("div", { className: `ash ${aside ? "has-aside" : ""} ${nav ? "" : "no-nav"} ${height ? "is-fixed" : ""} ${frame ? "" : `is-bare ${className}`}`, style: height ? { height, minHeight: 0 } : void 0, children: [
    /* @__PURE__ */ jsx("style", { children: CSS }),
    nav && /* @__PURE__ */ jsxs("nav", { className: "ash-nav", "aria-label": L.nav, children: [
      /* @__PURE__ */ jsxs("div", { className: "ash-ws", children: [
        /* @__PURE__ */ jsx("b", { "aria-hidden": "true", children: company.initial ?? company.name.replace(/^ac\.me\s*/i, "").slice(0, 1).toUpperCase() }),
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("strong", { children: company.name }),
          company.note && /* @__PURE__ */ jsx("small", { children: company.note })
        ] }),
        /* @__PURE__ */ jsx(Ic, { k: "switch" })
      ] }),
      item("ceo", L.ceo, void 0, void 0, "is-ceo"),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.gtd }),
      ["inbox", "today", "waiting"].map((k) => item(k, word(k).label, paraBaseMn[k].label, counts[k])),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.para }),
      ["projects", "areas", "resources", "archive"].map((k) => item(k, word(k).label, paraBaseMn[k].label, counts[k])),
      /* @__PURE__ */ jsx("p", { className: "ash-h", children: L.views }),
      item("calendar", L.calendar),
      item("agents", L.agents),
      navExtra && /* @__PURE__ */ jsx("div", { className: "ash-extra", children: navExtra })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "ash-main", children: /* @__PURE__ */ jsx("div", { className: "ash-view", children }, current) }),
    aside && /* @__PURE__ */ jsx("aside", { className: "ash-aside", children: aside })
  ] });
  if (!frame) return shell;
  const place = current === "ceo" ? L.ceo : current === "calendar" ? L.calendar : current === "agents" ? L.agents : current === "ask" ? L.ask : word(current).label;
  return /* @__PURE__ */ jsxs("div", { className: `ash-win ts-surface-app ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "ash-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "ash-lead", children: [
        /* @__PURE__ */ jsxs("div", { className: "ash-dots", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("i", {})
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "ash-title", children: [
          /* @__PURE__ */ jsx("span", { children: title ?? L.title }),
          /* @__PURE__ */ jsx(Ic, { k: "sep" }),
          /* @__PURE__ */ jsx("b", { children: place })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { type: "button", className: "ash-ask", "aria-pressed": current === "ask", onClick: () => onAsk ? onAsk() : go("ask"), children: [
        /* @__PURE__ */ jsx(Ic, { k: "search" }),
        /* @__PURE__ */ jsx("span", { children: L.ask }),
        /* @__PURE__ */ jsx("kbd", { children: "⌘K" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "ash-me", "aria-hidden": "true", children: (company.initial ?? company.name.replace(/^ac\.me\s*/i, "").slice(0, 1) ?? "A").toUpperCase() || "A" })
    ] }),
    shell
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
const appShellDemo = {
  company: { name: "ac.me Маркетинг", note: "Маркетингийн баг" },
  vocab: acmeParaVocab.marketing,
  counts: { inbox: 7, waiting: 3 },
  active: "ceo"
};
const appShellLogisticsDemo = {
  company: { name: "ac.me Логистик", note: "Логистикийн компани" },
  vocab: acmeParaVocab.logistics,
  counts: { inbox: 9, waiting: 4 },
  active: "ceo"
};
export {
  AppShell as A,
  PARA_KEYS as P,
  acmeParaVocab as a,
  appShellDemo as b,
  appShellLabelsMn as c,
  appShellLogisticsDemo as d,
  paraBaseMn as p
};
//# sourceMappingURL=app-shell-C_3YLmbU.js.map
