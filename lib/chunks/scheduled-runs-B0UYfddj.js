import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" };
const statIcons = {
  file: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...s, children: /* @__PURE__ */ jsx("path", { d: "M4 2h5l3 3v9H4Z M9 2v3h3" }) }),
  pr: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", ...s, children: [
    /* @__PURE__ */ jsx("circle", { cx: "4.5", cy: "3.5", r: "1.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "4.5", cy: "12.5", r: "1.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "11.5", cy: "12.5", r: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M4.5 5v6M11.5 11V6.5a2 2 0 0 0-2-2H7m1.5-1.5L7 4.5 8.5 6" })
  ] }),
  check: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", ...s, children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "m5.6 8.2 1.7 1.6 3.1-3.2" })
  ] }),
  comment: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...s, children: /* @__PURE__ */ jsx("path", { d: "M2.5 3.5h11v7.5H6l-3.5 2.5Z" }) }),
  link: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...s, children: /* @__PURE__ */ jsx("path", { d: "M6.5 9.5 9.5 6.5M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1" }) })
};
const logos = {
  github: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", ...s, children: [
    /* @__PURE__ */ jsx("circle", { cx: "5", cy: "3.5", r: "1.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "5", cy: "12.5", r: "1.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "6", r: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M5 5v6M11 7.5c0 2-2 2.4-6 3.4" })
  ] }),
  notion: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...s, children: /* @__PURE__ */ jsx("path", { d: "M4 2h5l3 3v9H4Z M6 8h4M6 10.5h4" }) }),
  slack: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...s, children: /* @__PURE__ */ jsx("path", { d: "M2.5 3.5h11v7.5H6l-3.5 2.5Z M5.5 6.5h5M5.5 8.5h3" }) }),
  linear: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", ...s, children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "M8 5v3l2 1.5" })
  ] }),
  drive: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...s, children: /* @__PURE__ */ jsx("path", { d: "M2 4.5h4l1.5 1.5H14v6.5H2Z" }) })
};
const agentLogos = {
  "Кодын агент": /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...s, children: /* @__PURE__ */ jsx("path", { d: "m5.5 5-3 3 3 3M10.5 5l3 3-3 3" }) }),
  "Шалгагч агент": /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 16 16", ...s, children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.6" }),
    /* @__PURE__ */ jsx("path", { d: "m5.6 8.2 1.7 1.6 3.1-3.2" })
  ] }),
  "Бичигч агент": /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", ...s, children: /* @__PURE__ */ jsx("path", { d: "M3 13h3l7-7-3-3-7 7Z" }) })
};
const defaultTasks = [
  { id: "react", title: "Фреймворкийг шинэ хувилбарт шилжүүлэх", agent: "Кодын агент", detail: "Бүх багцыг шинэчилж, эвдэрсэн өөрчлөлтүүдийг засна", logo: "github", usage: 30, stats: [{ icon: "file", value: 48 }, { icon: "pr", value: 1 }], at: { day: 0, session: 0 } },
  { id: "triage", title: "Нээлттэй 120 асуудлыг ангилах", agent: "Шалгагч агент", detail: "30 хоногоос дээш хугацаатай асуудал бүрийг шошголж, хуваарилна", logo: "linear", usage: 25, stats: [{ icon: "check", value: 120 }], at: { day: 1, session: 0 } },
  { id: "ship", title: "3.0 хувилбарыг гаргах", agent: "Кодын агент", detail: "Өөрчлөлтийн жагсаалт, шошго, нийтлэл", logo: "github", usage: 60, stats: [{ icon: "pr", value: 14 }, { icon: "file", value: 22 }], at: { day: 2, session: 0 } },
  { id: "q4", title: "4-р улирлын үзүүлэлтийн тайлан", agent: "Бичигч агент", detail: "Бүртгэл, хэрэглэгчийн алдагдал, багц тус бүрийн өсөлт", logo: "drive", usage: 40, stats: [{ icon: "file", value: 6 }, { icon: "comment", value: 3 }], at: { day: 0, session: 1 } },
  { id: "help", title: "Тусламжийн төвийн хайлтыг шинэчлэх", agent: "Бичигч агент", detail: "340 нийтлэлийг шинэ индексээр дахин бүртгэнэ", logo: "notion", usage: 20, stats: [{ icon: "file", value: 340 }, { icon: "link", value: 50 }], at: { day: 1, session: 2 } },
  { id: "oauth", title: "Нэвтрэлтийг шинэ протоколд шилжүүлэх", agent: "Кодын агент", detail: "Бүх нэвтрэлтийг шилжүүлж, хуучин токенуудыг ажиллуулсаар байна", logo: "github", usage: 140, stats: [{ icon: "file", value: 63 }, { icon: "check", value: 210 }] },
  { id: "apiref", title: "Нээлттэй API-ийн лавлах", agent: "Бичигч агент", detail: "Төгсгөлийн цэг бүрт дуудлагын жишээ", logo: "notion", usage: 45, stats: [{ icon: "file", value: 38 }, { icon: "link", value: 52 }] },
  { id: "flaky", title: "Тогтворгүй төлбөрийн тестийг засах", agent: "Шалгагч агент", detail: "12 тест яагаад хорин удаад нэг унадгийг олж засна", logo: "github", usage: 35, stats: [{ icon: "check", value: 12 }, { icon: "pr", value: 1 }] },
  { id: "themes", title: "10-р сарын хүсэлтийн сэдвүүд", agent: "Бичигч агент", detail: "480 хүсэлтийг сэдвээр бүлэглэж, иш татна", logo: "slack", usage: 25, stats: [{ icon: "comment", value: 480 }] },
  { id: "billing", title: "Нэхэмжлэлийг тусдаа сервис болгох", agent: "Кодын агент", detail: "Нэхэмжлэл, хэрэглээ, мэдэгдлийг үндсэн системээс салгана", logo: "linear", usage: 90, stats: [{ icon: "file", value: 112 }, { icon: "pr", value: 3 }] },
  { id: "changelog", title: "11-р сарын өөрчлөлтийн жагсаалт", agent: "Бичигч агент", detail: "11-р сарын 1-нээс хойш нэгтгэсэн бүх өөрчлөлт, бүлгээр", logo: "notion", usage: 20, stats: [{ icon: "pr", value: 46 }] }
];
function Card({ t, usage, part, parts, past, dim, chip, onKey, draggable, onDragStart }) {
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      className: `sr-card${past ? " is-past" : ""}${dim ? " is-dim" : ""}${chip ? " is-chip" : ""}`,
      "aria-label": `${t.title}, ${usage}%${parts && parts > 1 ? `, хэсэг ${part}/${parts}` : ""}${past ? ", өнгөрсөн – зөөх боломжгүй" : ""}`,
      "aria-expanded": open,
      draggable: draggable && !past,
      onDragStart,
      onClick: () => setOpen(!open),
      onKeyDown: (e) => {
        if (e.key === "Enter") setOpen(!open);
        if (e.key === "Escape") setOpen(false);
        onKey?.(e);
      },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "sr-c-top", children: [
          /* @__PURE__ */ jsx("span", { className: "sr-logo", children: typeof t.logo === "string" || !t.logo ? logos[t.logo ?? "github"] : t.logo }),
          /* @__PURE__ */ jsx("strong", { children: t.title })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "sr-c-sub", children: [
          t.agent,
          t.detail ? ` · ${t.detail}` : ""
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "sr-c-foot", children: [
          t.stats?.map((st, i) => /* @__PURE__ */ jsxs("span", { className: "sr-stat", children: [
            statIcons[st.icon],
            st.value
          ] }, i)),
          /* @__PURE__ */ jsxs("span", { className: "sr-use", children: [
            parts && parts > 1 ? `${part}/${parts} · ` : "",
            usage,
            "%"
          ] })
        ] }),
        open && /* @__PURE__ */ jsxs("div", { className: "sr-details", children: [
          /* @__PURE__ */ jsx("p", { children: t.detail }),
          /* @__PURE__ */ jsxs("span", { children: [
            t.agent,
            " · сешний ",
            t.usage,
            "%",
            parts && parts > 1 ? ` · ${parts} хэсэгт хуваасан` : ""
          ] })
        ] })
      ]
    }
  );
}
function ScheduledRuns({
  tasks = defaultTasks,
  days = [{ name: "Мя", date: 27 }, { name: "Лх", date: 28 }, { name: "Пү", date: 29 }],
  sessions = ["07:00", "12:00", "17:00"],
  now = { day: 0, session: 1 },
  limit = 100,
  minPiece = 15,
  agents,
  defaultMode = "auto",
  autoRun = false,
  title = "Энэ долоо хоног",
  note = "5 цагийн сешн",
  onScheduled,
  onPlace,
  onMove,
  className = ""
}) {
  const initial = () => tasks.filter((t) => t.at).map((t) => ({ task: t, day: t.at.day, session: t.at.session, usage: t.usage, part: 1, parts: 1, booked: true }));
  const [placed, setPlaced] = React.useState(initial);
  const [mode, setMode] = React.useState(defaultMode);
  const [agent, setAgent] = React.useState(null);
  const [over, setOver] = React.useState(null);
  const [live, setLive] = React.useState("");
  const drag = React.useRef(null);
  const agentList = agents ?? Array.from(new Set(tasks.map((t) => t.agent).filter(Boolean))).map((name) => ({ name, logo: agentLogos[name] }));
  const stack = tasks.filter((t) => !placed.some((p) => p.task.id === t.id));
  const isPast = (d, ss) => d < now.day || d === now.day && ss < now.session;
  const used = (d, ss, list = placed) => list.filter((p) => p.day === d && p.session === ss).reduce((n, p) => n + p.usage, 0);
  const slots = React.useMemo(() => {
    const out = [];
    days.forEach((_, d) => sessions.forEach((__, ss) => {
      if (!isPast(d, ss)) out.push({ day: d, session: ss });
    }));
    return out.sort((a, b) => a.day - b.day || a.session - b.session);
  }, [days.length, sessions.length, now.day, now.session]);
  const fit = (t, list, from) => {
    let left = t.usage;
    const parts = [];
    const start = from ? slots.findIndex((x) => x.day === from.day && x.session === from.session) : 0;
    if (start < 0) return null;
    for (const sl of slots.slice(start)) {
      const room = limit - used(sl.day, sl.session, [...list, ...parts]);
      if (room < Math.min(minPiece, left)) {
        if (from && parts.length === 0) return null;
        continue;
      }
      let take = Math.min(room, left);
      if (left - take > 0 && left - take < minPiece) take = left - minPiece;
      if (take < Math.min(minPiece, left)) continue;
      parts.push({ task: t, day: sl.day, session: sl.session, usage: take, part: parts.length + 1, booked: false });
      left -= take;
      if (left <= 0) break;
    }
    if (left > 0) return null;
    return parts.map((p) => ({ ...p, parts: parts.length }));
  };
  const autoSort = React.useCallback(() => {
    setPlaced((cur) => {
      let list = cur;
      const rest = tasks.filter((t) => !cur.some((p) => p.task.id === t.id));
      for (const t of rest) {
        const parts = fit(t, list);
        if (parts) list = [...list, ...parts];
      }
      onScheduled?.(list.map(({ booked: _b, ...p }) => p));
      return list;
    });
    setLive("Даалгавруудыг долоо хоногт хуваарилсан");
  }, [tasks, slots, limit, minPiece]);
  const switchMode = (m) => {
    setMode(m);
    if (m === "auto") autoSort();
    else setPlaced((cur) => cur.filter((p) => p.booked));
  };
  React.useEffect(() => {
    if (!autoRun || mode !== "auto") return;
    const t = window.setTimeout(autoSort, typeof autoRun === "number" ? autoRun : 800);
    return () => window.clearTimeout(t);
  }, []);
  const drop = (d, ss) => {
    const g = drag.current;
    drag.current = null;
    setOver(null);
    if (!g || isPast(d, ss)) return;
    if (g.kind === "stack") {
      const t = tasks.find((x) => x.id === g.id);
      if (!t) return;
      const parts = fit(t, placed, { day: d, session: ss });
      if (!parts) {
        setLive(`Тэнд зай алга: «${t.title}»`);
        return;
      }
      const next = [...placed, ...parts.map((p) => ({ ...p, booked: true }))];
      setPlaced(next);
      onPlace?.(t, parts);
      setLive(`«${t.title}» байрлуулсан`);
    } else {
      const p = placed[g.index];
      if (!p || used(d, ss) + p.usage > limit) {
        setLive("Тэнд зай алга");
        return;
      }
      const next = placed.map((x, i) => i === g.index ? { ...x, day: d, session: ss, booked: true } : x);
      setPlaced(next);
      onMove?.(p, { day: d, session: ss });
      setLive(`«${p.task.title}» зөөсөн`);
    }
  };
  const dayName = (x) => typeof x === "string" ? { name: x, date: void 0 } : x;
  const nowTop = now.session;
  return /* @__PURE__ */ jsxs("section", { className: `sr ${className}`, "aria-label": title, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("header", { className: "sr-head", children: [
      /* @__PURE__ */ jsxs("h3", { children: [
        title,
        note && /* @__PURE__ */ jsx("small", { children: note })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sr-tools", children: [
        /* @__PURE__ */ jsx("span", { className: `sr-agents${agent ? " is-fanned" : ""}`, children: agentList.map((a) => /* @__PURE__ */ jsxs("button", { type: "button", "aria-pressed": agent === a.name, "aria-label": a.name, title: a.name, onClick: () => setAgent(agent === a.name ? null : a.name), children: [
          a.logo ?? a.name[0],
          agent === a.name && /* @__PURE__ */ jsx("span", { children: a.name })
        ] }, a.name)) }),
        /* @__PURE__ */ jsxs("span", { className: "sr-count", children: [
          tasks.length,
          " даалгавар"
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "sr-mode",
            role: "radiogroup",
            "aria-label": "Хуваарилах горим",
            onKeyDown: (e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") switchMode(mode === "auto" ? "manual" : "auto");
            },
            children: ["auto", "manual"].map((m) => /* @__PURE__ */ jsxs("button", { type: "button", role: "radio", "aria-checked": mode === m, tabIndex: mode === m ? 0 : -1, onClick: () => switchMode(m), children: [
              m === "auto" && /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 1.5 7.2 5 10.5 6 7.2 7 6 10.5 4.8 7 1.5 6 4.8 5ZM12 9l.7 1.8 1.8.7-1.8.7L12 14l-.7-1.8-1.8-.7 1.8-.7Z", fill: "currentColor" }) }),
              m === "auto" ? "Автомат" : "Гараар"
            ] }, m))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "sr-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "sr-stack", children: [
        /* @__PURE__ */ jsxs("div", { className: "sr-stack-h", children: [
          "Хуваарилах",
          /* @__PURE__ */ jsx("span", { children: stack.length })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "sr-stack-list", children: [
          stack.length === 0 && /* @__PURE__ */ jsx("p", { className: "sr-empty", children: "Бүгд хуваарьтай" }),
          stack.map((t) => /* @__PURE__ */ jsx(
            Card,
            {
              t,
              usage: t.usage,
              dim: !!agent && t.agent !== agent,
              draggable: true,
              onDragStart: (e) => {
                drag.current = { kind: "stack", id: t.id };
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", t.id);
              }
            },
            t.id
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sr-week", role: "grid", "aria-label": "Долоо хоног", style: { gridTemplateColumns: `40px repeat(${days.length}, minmax(120px, 1fr))` }, children: [
        /* @__PURE__ */ jsx("span", {}),
        days.map((x, d) => {
          const n = dayName(x);
          return /* @__PURE__ */ jsxs("div", { role: "columnheader", className: "sr-day", children: [
            n.name.toUpperCase(),
            " ",
            /* @__PURE__ */ jsx("b", { children: n.date })
          ] }, d);
        }),
        sessions.map((label, ss) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsx("div", { role: "rowheader", className: "sr-time", children: label }),
          days.map((_, d) => {
            const past = isPast(d, ss);
            const u = used(d, ss);
            const k = `${d}-${ss}`;
            const items = placed.map((p, i) => ({ p, i })).filter(({ p }) => p.day === d && p.session === ss);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                role: "gridcell",
                className: `sr-cell${past ? " is-past" : ""}${over === k ? past ? " is-no" : " is-over" : ""}${d === now.day && ss === nowTop ? " is-now" : ""}`,
                onDragOver: (e) => {
                  e.preventDefault();
                  setOver(k);
                },
                onDragLeave: () => setOver((o) => o === k ? null : o),
                onDrop: (e) => {
                  e.preventDefault();
                  drop(d, ss);
                },
                children: [
                  d === now.day && ss === nowTop && /* @__PURE__ */ jsx("span", { className: "sr-now", "aria-hidden": "true" }),
                  /* @__PURE__ */ jsx("div", { className: "sr-cell-cards", children: items.map(({ p, i }) => /* @__PURE__ */ jsx(
                    Card,
                    {
                      t: p.task,
                      usage: p.usage,
                      part: p.part,
                      parts: p.parts,
                      past,
                      dim: !!agent && p.task.agent !== agent,
                      chip: !p.booked || items.length > 1,
                      draggable: true,
                      onDragStart: (e) => {
                        drag.current = { kind: "part", index: i };
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", p.task.id);
                      }
                    },
                    `${p.task.id}-${p.part}`
                  )) }),
                  /* @__PURE__ */ jsx("span", { className: "sr-fill", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { style: { width: `${Math.min(100, u / limit * 100)}%` } }) })
                ]
              },
              k
            );
          })
        ] }, ss))
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "sr-live", "aria-live": "polite", children: live })
  ] });
}
const css = `
.sr{--sr-bg:#fff;--sr-fg:#18181b;--sr-muted:#65656d;--sr-faint:#65656d;--sr-line:#ececef;--sr-well:#f4f4f5;--sr-red:#e5484d;--sr-blue:#3b82f6;width:100%;max-width:820px;color:var(--sr-fg);font:400 12px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .sr{--sr-bg:#1f1f23;--sr-fg:#ececef;--sr-muted:#a1a1aa;--sr-faint:#9a9aa2;--sr-line:#2e2e33;--sr-well:#18181b;color-scheme:dark}
.sr *{box-sizing:border-box}.sr button{font:inherit;color:inherit;cursor:pointer}
.sr-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.sr h3{margin:0;font-size:15px;font-weight:500;display:flex;align-items:baseline;gap:8px}.sr h3 small{font-size:12.5px;font-weight:400;color:var(--sr-muted)}
.sr-tools{display:flex;align-items:center;gap:12px}
.sr-agents{display:flex;align-items:center;height:26px;padding:0 4px;border:1px solid var(--sr-line);border-radius:7px;background:var(--sr-bg)}
.sr-agents button{display:flex;align-items:center;gap:5px;height:20px;margin-left:-3px;padding:0 2px;border:0;border-radius:5px;background:none;transition:margin .2s,opacity .2s}
.sr-agents button:first-child{margin-left:0}.sr-agents button svg{width:13px;height:13px}
.sr-agents.is-fanned button{margin-left:2px}.sr-agents.is-fanned button[aria-pressed=false]{opacity:.45}
.sr-agents button span{font-size:11.5px;white-space:nowrap;animation:sr-in .2s both}
.sr-count{color:var(--sr-muted);font-size:12.5px}
.sr-mode{display:flex;padding:2px;border-radius:7px;background:var(--sr-well)}
.sr-mode button{display:flex;align-items:center;gap:5px;height:24px;padding:0 10px;border:0;border-radius:5px;background:none;font-size:12.5px!important;color:var(--sr-muted)!important}
.sr-mode button svg{width:11px;height:11px}
.sr-mode button[aria-checked=true]{background:var(--sr-bg);color:var(--sr-fg)!important;box-shadow:0 1px 2px #00000014}
.sr-body{display:grid;grid-template-columns:220px minmax(0,1fr);gap:10px;align-items:start}
.sr-stack{background:var(--sr-well);border-radius:8px;padding:4px}
.sr-stack-h{display:flex;justify-content:space-between;align-items:center;padding:4px 6px 6px 8px;font-size:12px;color:var(--sr-muted)}
.sr-stack-h span{min-width:18px;height:17px;padding:0 5px;display:grid;place-items:center;border-radius:4px;background:#e4e4e7;color:var(--sr-fg);font-size:11px}
:where(.dark,[data-theme=dark]) .sr-stack-h span{background:#2e2e33}
.sr-stack-list{display:flex;flex-direction:column;gap:8px}
.sr-empty{margin:10px 8px;color:var(--sr-faint)}
.sr-card{position:relative;padding:7px 9px 6px;background:var(--sr-bg);border-radius:6px;box-shadow:0 0 0 1px var(--sr-line),0 1px 2px #0000000a;cursor:grab;transition:opacity .2s,box-shadow .15s;animation:sr-in .3s both;outline:0}
.sr-card:hover{box-shadow:0 0 0 1px color-mix(in srgb,var(--sr-fg) 18%,transparent),0 2px 6px #00000010}
.sr-card:focus-visible{box-shadow:0 0 0 2px var(--sr-blue)}
.sr-card.is-dim,.sr-card.is-past{--sr-fg:var(--sr-muted);background:transparent;box-shadow:0 0 0 1px var(--sr-line)}.sr-card.is-past{cursor:default}
.sr-c-top{display:flex;align-items:center;gap:7px;min-width:0}
.sr-c-top strong{font-weight:500;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sr-logo{display:grid;place-items:center;width:13px;flex:none}.sr-logo svg{width:12px;height:12px}
.sr-c-sub{margin:3px 0 0 20px;font-size:11px;color:var(--sr-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sr-c-foot{display:flex;flex-wrap:wrap;align-items:center;gap:2px 10px;margin:4px 0 0 20px;font-size:11px;color:var(--sr-muted)}
.sr-stat{display:flex;align-items:center;gap:4px}.sr-stat svg{width:11px;height:11px}
.sr-use{margin-left:auto;white-space:nowrap;padding:0 5px;border-radius:4px;background:var(--sr-well);color:var(--sr-fg);font-variant-numeric:tabular-nums}
.sr-details{margin:8px 0 2px;padding-top:7px;border-top:1px solid var(--sr-line);font-size:11.5px}.sr-details p{margin:0 0 4px;color:var(--sr-fg);line-height:1.45}.sr-details span{color:var(--sr-muted)}
.sr-week{display:grid;gap:4px;overflow-x:auto}
.sr-day{height:24px;display:flex;align-items:center;gap:4px;padding:0 8px;border-radius:5px;background:var(--sr-well);font-size:11.5px;letter-spacing:.04em;color:var(--sr-muted)}.sr-day b{font-weight:500;color:var(--sr-fg);letter-spacing:0;font-size:12.5px}
.sr-time{padding-top:6px;font-size:11px;color:var(--sr-faint)}
.sr-cell{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-width:0;min-height:150px;padding:3px;border-radius:6px;background:var(--sr-well);transition:background .15s,box-shadow .15s}
.sr-cell.is-over{box-shadow:inset 0 0 0 1.5px var(--sr-blue);background:color-mix(in srgb,var(--sr-blue) 6%,var(--sr-well))}
.sr-cell.is-no{background:repeating-linear-gradient(135deg,var(--sr-well) 0 6px,color-mix(in srgb,var(--sr-fg) 6%,var(--sr-well)) 6px 7px)}
.sr-cell-cards{display:flex;flex-direction:column;gap:4px;min-width:0}.sr-cell .sr-card{min-width:0;overflow:hidden}
.sr-fill{display:block;height:3px;margin:8px 5px 3px;border-radius:2px;background:color-mix(in srgb,var(--sr-fg) 7%,transparent);overflow:hidden}
.sr-fill span{display:block;height:100%;border-radius:2px;background:var(--sr-faint);transition:width .4s cubic-bezier(.2,.8,.2,1)}
.sr-now{position:absolute;left:0;right:0;top:-3px;height:2px;background:var(--sr-red);z-index:2}
.sr-now::before{content:"";position:absolute;left:-3px;top:-2px;width:6px;height:6px;border-radius:50%;background:var(--sr-red)}
.sr-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.sr :focus-visible{outline:2px solid var(--sr-blue);outline-offset:2px}
@keyframes sr-in{from{opacity:0;transform:translateY(-3px) scale(.98)}}
@media(max-width:720px){.sr-body{grid-template-columns:minmax(0,1fr)}.sr-head{flex-wrap:wrap}.sr-agents{display:none}}
@media(prefers-reduced-motion:reduce){.sr *{animation:none!important;transition:none!important}}
.sr-card{animation:srcardrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.sr-card:nth-child(1){animation-delay:0ms}.sr-card:nth-child(2){animation-delay:80ms}.sr-card:nth-child(3){animation-delay:160ms}.sr-card:nth-child(4){animation-delay:240ms}.sr-card:nth-child(5){animation-delay:320ms}.sr-card:nth-child(6){animation-delay:400ms}.sr-card:nth-child(7){animation-delay:480ms}.sr-card:nth-child(8){animation-delay:560ms}.sr-card:nth-child(9){animation-delay:640ms}.sr-card:nth-child(10){animation-delay:720ms}.sr-card:nth-child(11){animation-delay:800ms}.sr-card:nth-child(12){animation-delay:880ms}@keyframes srcardrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.sr-card{animation:none}}
`;
export {
  ScheduledRuns as S
};
//# sourceMappingURL=scheduled-runs-B0UYfddj.js.map
