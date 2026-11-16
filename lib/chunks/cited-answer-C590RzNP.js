import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
const defaultSources = [
  {
    id: "tokenwise",
    title: "Промпт кэшлэх нь юу вэ",
    site: "tokenwise.dev",
    date: "2026-07-18",
    url: "https://example.com/tokenwise",
    quote: "Үйлчилгээ үзүүлэгч промптын боловсруулсан эхлэлийг дахин ашигладаг. 10 000-аас дээш токентой промпт дээр эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог.",
    highlight: "эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог"
  },
  {
    id: "latency",
    title: "Кэшэд ээлтэй промпт зохиох",
    site: "latencynotes.io",
    date: "2026-08-02",
    url: "https://example.com/latency",
    quote: "Тогтвортой хэсгийг – системийн промпт, хэрэгслийн тодорхойлолт, урт баримт бичгийг – хамгийн эхэнд байрлуулж, хүсэлт бүрт өөрчлөгддөг зүйлийг ард нь тавь. Эхэнд нэг тэмдэгт өөрчлөгдөхөд араас нь бүх зүйл хүчингүй болно.",
    highlight: "хамгийн эхэнд"
  },
  {
    id: "weekly",
    title: "Үйлдвэрлэлийн орчин дахь утгын кэш",
    site: "inferenceweekly.com",
    date: "2026-09-09",
    url: "https://example.com/weekly",
    quote: "Ойролцоо асуултад кэшээс 40 ms орчимд хариулж, түгээмэл асуултын урсгалын бараг гуравны нэгийг хамарсан.",
    highlight: "40 ms орчимд"
  }
];
const defaultSegments = [
  {
    text: "Хамгийн том хожил бол промпт кэшлэх: үйлчилгээ үзүүлэгч промптын боловсруулсан эхлэлийг дахин ашигладаг тул урт системийн промптыг дуудлага бүрт дахин тооцоолохгүй.",
    cite: ["tokenwise"]
  },
  { text: " 10 000-аас дээш токентой промпт дээр энэ нь эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог.", cite: ["tokenwise"] },
  {
    text: " Энэ нь эхлэл нь ижил байх үед л ажилладаг тул системийн промпт, хэрэгсэл, урт баримт бичгийг эхэнд, хүсэлт бүрт өөрчлөгддөг зүйлийг төгсгөлд нь тавь.",
    cite: ["latency", "tokenwise"]
  },
  {
    text: "Давтагддаг асуултад загварын өмнө утгын кэш нэм: ойролцоо асуултад хадгалсан хариултыг 40 ms орчимд өгнө,",
    cite: ["weekly"],
    paragraph: true
  },
  { text: " энэ нь нэг үйлдвэрлэлийн орчинд түгээмэл асуултын урсгалын бараг гуравны нэгийг хамарсан.", cite: ["weekly"] },
  { text: " Үлдсэнийг урсгалаар дамжуул, ингэснээр хариулт бичигдэж байх үед хүмүүс эхний үгсийг харна." }
];
function Mark({ quote, highlight }) {
  const i = highlight ? quote.indexOf(highlight) : -1;
  if (!highlight || i < 0) return /* @__PURE__ */ jsx(Fragment, { children: quote });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    quote.slice(0, i),
    /* @__PURE__ */ jsx("mark", { children: highlight }),
    quote.slice(i + highlight.length)
  ] });
}
function CitedAnswer({
  segments = defaultSegments,
  sources = defaultSources,
  pagesRead = 12,
  defaultOpen,
  onOpenSource,
  onPreviewChange,
  action = { label: "Үргэлжлүүлэн асуух", onClick: () => {
  } },
  theme,
  className = ""
}) {
  const [hover, setHover] = React.useState(null);
  const [open, setOpen] = React.useState(defaultOpen ?? null);
  const [copied, setCopied] = React.useState(false);
  const active = hover ?? open;
  const idx = (id) => sources.findIndex((s) => s.id === id);
  const openSrc = sources.find((s) => s.id === open);
  const activeSrc = sources.find((s) => s.id === active);
  const citedIn = (id) => segments.filter((s) => s.cite?.[0] === id || s.cite?.includes(id)).length;
  const toggle = (id) => {
    const next = open === id ? null : id;
    setOpen(next);
    onPreviewChange?.(next);
  };
  const paragraphs = [];
  segments.forEach((s, i) => {
    if (i === 0 || s.paragraph) paragraphs.push([]);
    paragraphs[paragraphs.length - 1].push(s);
  });
  const Badge = ({ id, size = "s" }) => {
    const n = idx(id);
    const src = sources[n];
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `ca-badge ca-badge-${size}`,
        "aria-hidden": "true",
        children: src?.icon ?? (src ? initial(src) : "?")
      }
    );
  };
  const initial = (s) => s.site.charAt(0).toUpperCase();
  return /* @__PURE__ */ jsxs("section", { className: `ca ${active ? "ca-focus" : ""} ${className}`, "data-theme": theme, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("div", { className: "ca-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "ca-head", children: [
        /* @__PURE__ */ jsx("span", { className: "ca-stack", children: sources.map((s) => /* @__PURE__ */ jsx("span", { className: "ca-badge ca-badge-s", children: s.icon ?? initial(s) }, s.id)) }),
        sources.length,
        " эх сурвалж",
        pagesRead ? ` · ${pagesRead} хуудас уншсан` : ""
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ca-prose", children: paragraphs.map((p, i) => /* @__PURE__ */ jsx("p", { children: p.map((s, j) => {
        const lit = !!active && !!s.cite?.includes(active);
        const lead = s.text.match(/^\s*/)?.[0] ?? "";
        const body = s.text.slice(lead.length);
        return /* @__PURE__ */ jsxs(React.Fragment, { children: [
          lead,
          /* @__PURE__ */ jsx("span", { className: `ca-seg ${lit ? "lit" : ""}`, children: body }),
          s.cite?.map((c) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `ca-num ${active === c ? "on" : ""}`,
              "aria-label": `Эх сурвалж ${idx(c) + 1}: ${sources[idx(c)]?.title ?? c}`,
              onMouseEnter: () => setHover(c),
              onMouseLeave: () => setHover(null),
              onFocus: () => setHover(c),
              onBlur: () => setHover(null),
              onClick: () => toggle(c),
              children: idx(c) + 1
            },
            c
          ))
        ] }, j);
      }) }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "ca-chips", children: sources.map((s, n) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: `ca-chip ${active === s.id ? "on" : ""}`,
          "aria-expanded": open === s.id,
          onMouseEnter: () => setHover(s.id),
          onMouseLeave: () => setHover(null),
          onFocus: () => setHover(s.id),
          onBlur: () => setHover(null),
          onClick: () => toggle(s.id),
          children: [
            /* @__PURE__ */ jsx("span", { className: "ca-badge ca-badge-s", children: s.icon ?? initial(s) }),
            s.site,
            /* @__PURE__ */ jsx("span", { className: "ca-chip-n", children: n + 1 })
          ]
        },
        s.id
      )) }),
      openSrc && /* @__PURE__ */ jsxs("div", { className: "ca-preview", role: "region", "aria-label": openSrc.title, children: [
        /* @__PURE__ */ jsxs("div", { className: "ca-pv-meta", children: [
          /* @__PURE__ */ jsx(Badge, { id: openSrc.id }),
          /* @__PURE__ */ jsx("span", { children: openSrc.site }),
          openSrc.date && /* @__PURE__ */ jsxs("span", { className: "ca-faint", children: [
            "· ",
            openSrc.date
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ca-pv-n", children: idx(openSrc.id) + 1 })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ca-pv-title", children: openSrc.title }),
        openSrc.quote && /* @__PURE__ */ jsx("p", { className: "ca-pv-quote", children: /* @__PURE__ */ jsx(Mark, { quote: openSrc.quote, highlight: openSrc.highlight }) }),
        /* @__PURE__ */ jsxs("div", { className: "ca-pv-actions", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: openSrc.url ?? "#",
              target: "_blank",
              rel: "noreferrer",
              onClick: (e) => {
                if (onOpenSource) {
                  e.preventDefault();
                  onOpenSource(openSrc);
                }
              },
              children: [
                "Эх сурвалжийг нээх",
                /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 3.5h6.5V10M12.5 3.5 4 12", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                navigator.clipboard?.writeText(openSrc.quote ?? "").catch(() => {
                });
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1400);
              },
              children: copied ? "Хуулсан" : "Ишлэл хуулах"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "ca-foot", children: [
      /* @__PURE__ */ jsx("span", { className: "ca-foot-l", children: activeSrc ? /* @__PURE__ */ jsxs(Fragment, { children: [
        activeSrc.site,
        /* @__PURE__ */ jsxs("span", { className: "ca-faint", children: [
          " · ",
          citedIn(activeSrc.id),
          " өгүүлбэрт иш татсан"
        ] })
      ] }) : /* @__PURE__ */ jsx("span", { className: "ca-faint", children: "Эх сурвалжийг харах бол дугаар дээр очно уу" }) }),
      action && /* @__PURE__ */ jsxs("button", { type: "button", className: "ca-action", onClick: action.onClick, children: [
        action.label,
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M3 8h10m-4-4 4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ] })
    ] })
  ] });
}
const css = `
.ca{--ca-bg:#fff;--ca-fg:#18181b;--ca-muted:#65656d;--ca-faint:#65656d;--ca-line:#ececef;--ca-chip:#f4f4f5;--ca-lit:#e8f1fd;--ca-accent:#3b82f6;--ca-mark:#fdf0b8;width:100%;max-width:442px;background:var(--ca-bg);color:var(--ca-fg);border:1px solid var(--ca-line);border-radius:var(--ts-radius,12px);box-shadow:0 1px 2px #0000000a;font:400 14px/1.57 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .ca,.ca[data-theme=dark]{--ca-bg:#1b1b1e;--ca-fg:#ececef;--ca-muted:#a1a1aa;--ca-faint:#9a9aa2;--ca-line:#2e2e33;--ca-chip:#2a2a2f;--ca-lit:#1d3150;--ca-accent:#6aa3ff;--ca-mark:#5a4a12;color-scheme:dark}
/* theme="light" (or a [data-theme=light] wrapper) keeps the card light inside a dark page */
:where(.dark,[data-theme=dark]) :where([data-theme=light]) .ca,.ca[data-theme=light]{--ca-bg:#fff;--ca-fg:#18181b;--ca-muted:#65656d;--ca-faint:#65656d;--ca-line:#ececef;--ca-chip:#f4f4f5;--ca-lit:#e8f1fd;--ca-accent:#3b82f6;--ca-mark:#fdf0b8;color-scheme:light}
.ca *{box-sizing:border-box}.ca button{font:inherit;color:inherit;cursor:pointer}
.ca-body{padding:14px 20px 16px}
.ca-head{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ca-muted);margin-bottom:12px}
.ca-stack{display:flex}.ca-stack .ca-badge{margin-right:-2px;box-shadow:0 0 0 1.5px var(--ca-bg)}
.ca-badge{display:inline-grid;place-items:center;width:20px;height:20px;box-sizing:border-box;border:1px solid var(--ca-faint);border-radius:var(--ts-radius,6px);background:var(--ca-chip);color:var(--ca-fg);font-size:11px;font-weight:600;flex:none}
.ca-badge svg{width:12px;height:12px;stroke-width:1.75}
.ca-prose p{margin:0 0 10px}.ca-prose p:last-child{margin:0}
.ca-seg{transition:color .2s,background .2s;border-radius:var(--ts-radius,3px)}
.ca-focus .ca-seg{color:var(--ca-faint)}
.ca-focus .ca-seg.lit{color:var(--ca-fg);background:var(--ca-lit);box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:1px 2px;margin:0 -2px}
.ca-num{display:inline-grid;place-items:center;min-width:15px;height:15px;margin:0 2px 0 3px;padding:0 3px;vertical-align:1px;border:0;border-radius:var(--ts-radius,3px);background:var(--ca-chip);font-size:10px!important;line-height:1;color:var(--ca-muted)!important;transition:background .15s}
.ca-num:hover,.ca-num.on{background:color-mix(in srgb,var(--ca-fg) 16%,transparent);color:var(--ca-fg)!important}
.ca-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:16px;margin-left:-6px}
.ca-chip{display:inline-flex;align-items:center;gap:7px;flex:none;white-space:nowrap;height:28px;padding:0 8px 0 6px;border:1px solid transparent;border-radius:var(--ts-radius,6px);background:none;font-size:12.5px!important;color:var(--ca-muted)!important;transition:background .15s,border-color .15s,color .15s}
.ca-focus .ca-chip{color:var(--ca-faint)!important}
.ca-chip:hover,.ca-chip.on,.ca-focus .ca-chip.on{background:var(--ca-chip);border-color:var(--ca-line);color:var(--ca-fg)!important}
.ca-chip-n{font-size:10.5px;color:var(--ca-faint)}
.ca-preview{margin-top:10px;padding:12px 14px;border:1px solid var(--ca-line);border-radius:var(--ts-radius,10px);background:color-mix(in srgb,var(--ca-chip) 45%,var(--ca-bg));animation:ca-in .2s both}
.ca-pv-meta{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ca-muted)}
.ca-pv-n{margin-left:auto;font-size:11px;color:var(--ca-faint)}
.ca-pv-title{font-weight:500;margin:6px 0 4px}
.ca-pv-quote{margin:0;font-size:13px;color:var(--ca-muted);line-height:1.55}
.ca-pv-quote mark{background:var(--ca-mark);color:var(--ca-fg);border-radius:var(--ts-radius,2px);padding:0 1px}
.ca-pv-actions{display:flex;gap:6px;margin-top:10px}
.ca-pv-actions a,.ca-pv-actions button{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;border:1px solid var(--ca-line);border-radius:var(--ts-radius,6px);background:var(--ca-bg);font-size:12px;color:var(--ca-fg);text-decoration:none}
.ca-pv-actions svg{width:12px;height:12px}
.ca-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 8px 8px 20px;border-top:1px solid var(--ca-line);font-size:12.5px}
.ca-foot-l{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ca-faint{color:var(--ca-faint)}
.ca-action{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 10px;border:1px solid var(--ca-line);border-radius:var(--ts-radius,7px);background:var(--ca-bg);font-size:13.5px!important;font-weight:500;box-shadow:0 1px 1px #00000008}
.ca-action:hover{background:var(--ca-chip)}.ca-action svg{width:14px;height:14px;color:var(--ca-muted)}
.ca :focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ca-bg),0 0 0 2px var(--ca-accent)}.ca-stack .ca-badge:focus-visible{box-shadow:0 0 0 1.5px var(--ca-bg),0 0 0 2.5px var(--ca-accent)}
@keyframes ca-in{from{opacity:0;transform:translateY(-3px)}}
@media(max-width:480px){.ca-body{padding:12px 16px 14px}.ca-foot{padding-left:16px}}
@media(prefers-reduced-motion:reduce){.ca *{animation:none!important;transition:none!important}}
.ca-action{white-space:nowrap;font-size:13px!important}
`;
export {
  CitedAnswer as C
};
//# sourceMappingURL=cited-answer-C590RzNP.js.map
