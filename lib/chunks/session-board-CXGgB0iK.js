import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
function toSessionState(value) {
  const v = (value ?? "").toLowerCase().replace(/[\s_]+/g, "-");
  if (v === "running" || v === "waiting" || v === "done" || v === "idle") return v;
  if (["in-progress", "active", "doing"].includes(v)) return "running";
  if (["waiting-on", "blocked"].includes(v)) return "waiting";
  if (["completed", "complete", "cancelled", "canceled", "merged"].includes(v)) return "done";
  return "idle";
}
const defaultLabels = {
  owner: "Эзэн",
  tasks: "Нээлттэй даалгавар",
  decisions: "Шийдвэр",
  pages: "Хуудас",
  prs: "Нээлттэй PR",
  ungrouped: "Бүлэггүй",
  sessions: "сешн",
  session: "сешн",
  empty: "Сешн алга",
  running: "Ажиллаж байна",
  waiting: "Хүлээж байна",
  done: "Дууссан",
  idle: "Сул",
  links: "Холбоос",
  pr: "PR",
  open: "нээлттэй",
  draft: "ноорог",
  merged: "нэгтгэсэн",
  closed: "хаагдсан",
  view: "Харагдац",
  groupsView: "Бүлгүүд",
  statusView: "Төлөв",
  cardsView: "Карт",
  subItem: "дэд сешн",
  subItems: "дэд сешн",
  collapseKids: "Дэд сешнийг нуух",
  expandKids: "Дэд сешнийг харуулах",
  inParent: "Харьяа:",
  scope: "Харуулах",
  all: "Бүгд",
  mine: "Минийх",
  sharedWith: "ба"
};
const defaultSessionGroups = [
  { id: "projects", label: "Төслүүд" },
  { id: "areas", label: "Хүрээ" },
  { id: "resources", label: "Нөөц" },
  { id: "finance", label: "Санхүү" }
];
const UNGROUPED = "__ungrouped";
const demoProject = {
  name: "ac.me вэбсайт",
  icon: "A",
  status: { label: "Идэвхтэй", tone: "green" },
  owner: "Төслийн агент",
  stats: { tasks: 12, decisions: 4, pages: 38, prs: 3 },
  links: [
    { label: "acme/website", href: "https://example.com/acme/website", kind: "repo" },
    { label: "ac.me", href: "https://example.com/", kind: "prod" },
    { label: "дизайны файл", href: "https://example.com/design/acme", kind: "figma" }
  ]
};
const demoSessions = [
  { id: "relaunch", title: "Вэбсайтыг шинэчлэх", line: "Тарифын хуудсыг шинэ сүлжээн дээр дахин бүтээж байна", state: "running", group: "projects", pr: { number: 21, state: "open" }, owner: "Ану", sharedWith: ["Бат"] },
  { id: "hero", title: "Нүүр хэсгийн текст", line: "Гурван гарчгийн хувилбар урьдчилан харахад гарлаа", state: "done", group: "projects", parent: "relaunch", pr: { number: 22, state: "merged" }, owner: "Цэцэг" },
  { id: "pricing", title: "Тарифын хүснэгт", line: "Багцын сонголтыг өгөгдөлтэй холбож байна", state: "running", group: "projects", parent: "relaunch", owner: "Бат" },
  { id: "promote", title: "Урьдчилсан хувилбарыг нийтлэх", line: "Нийтлэхээс өмнө таны зөвшөөрөл хэрэгтэй", state: "waiting", group: "projects", parent: "relaunch", pr: { number: 23, state: "draft" }, owner: "Ану" },
  { id: "brand", title: "Брэндийн шинэчлэл", line: "Текст тогтох хүртэл сэтгэгдлийн самбарыг түр зогсоосон", state: "idle", group: "projects" },
  { id: "triage", title: "Ирсэн зүйлсийг ангилах", line: "14 тэмдэглэл ангилж, 3 даалгавар үүсгэлээ", state: "done", group: "areas" },
  { id: "weekly", title: "Долоо хоногийн тойм", line: "Ноорог бэлэн; 2 шийдвэр таныг хүлээж байна", state: "waiting", group: "areas", owner: "Ану" },
  { id: "glossary", title: "Нэр томьёоны сан", line: "Давхардсан 6 атомыг нэгтгэж байна", state: "running", group: "resources", owner: "Цэцэг", sharedWith: ["Ану"] },
  { id: "bills", title: "Сарын төлбөрийн шалгалт", line: "9 төлбөр бүгд бүртгэгдсэн", state: "done", group: "finance" },
  { id: "tokens", title: "Токены аудит", line: "Ноорог тэмдэглэл, эзэнгүй", state: "idle" }
];
const sessionBoardDemo = { project: demoProject, groups: defaultSessionGroups, sessions: demoSessions, me: "Ану" };
const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
function useCountUp(target, delay) {
  const [value, setValue] = React.useState(target);
  const shown = React.useRef(0);
  useIsoLayoutEffect(() => {
    if (reducedMotion() || typeof requestAnimationFrame === "undefined") {
      shown.current = target;
      setValue(target);
      return;
    }
    const from = shown.current;
    setValue(from);
    let raf = 0;
    let start = 0;
    const duration = from === 0 ? 900 : 400;
    const wait = from === 0 ? delay : 0;
    const tick = (t) => {
      if (!start) start = t + wait;
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      shown.current = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      setValue(shown.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delay]);
  return value;
}
function Stat({ value, label, index }) {
  const shown = useCountUp(value, index * 90);
  return /* @__PURE__ */ jsxs("div", { className: "sb-stat", children: [
    /* @__PURE__ */ jsx("dt", { children: label }),
    /* @__PURE__ */ jsxs("dd", { children: [
      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", "data-cw-count": value, "data-cw-delay": index * 90, children: shown }),
      /* @__PURE__ */ jsx("span", { className: "sb-sr", children: value })
    ] })
  ] });
}
function LinkIcon({ kind = "link" }) {
  const p = kind === "repo" ? /* @__PURE__ */ jsx("path", { d: "m6 5-3 3 3 3m4-6 3 3-3 3" }) : kind === "prod" ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "5.5" }),
    /* @__PURE__ */ jsx("path", { d: "M2.5 8h11M8 2.5c-2.2 2.6-2.2 8.4 0 11m0-11c2.2 2.6 2.2 8.4 0 11" })
  ] }) : kind === "figma" ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "10", height: "10", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M3 6.5h10M6.5 6.5V13" })
  ] }) : /* @__PURE__ */ jsx("path", { d: "M7 9.5 9.5 7m-4 .5-1 1a2.1 2.1 0 0 0 3 3l1-1m1-4 1-1a2.1 2.1 0 0 0-3-3l-1 1" });
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round", children: p });
}
function orderRows(list, folded = {}) {
  const ids = new Set(list.map((s) => s.id));
  const kids = /* @__PURE__ */ new Map();
  for (const s of list)
    if (s.parent && ids.has(s.parent) && s.parent !== s.id) kids.set(s.parent, [...kids.get(s.parent) ?? [], s]);
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const walk = (s, depth, show) => {
    if (seen.has(s.id)) return;
    seen.add(s.id);
    const ch = kids.get(s.id) ?? [];
    if (show) out.push({ s, depth, kids: ch.length });
    for (const c of ch) walk(c, Math.min(depth + 1, 3), show && !folded[s.id]);
  };
  for (const s of list) if (!s.parent || !ids.has(s.parent)) walk(s, 0, true);
  for (const s of list) walk(s, 0, true);
  return out;
}
const prOf = (pr) => pr == null ? null : typeof pr === "number" ? { number: pr, state: "open" } : { number: pr.number, state: pr.state ?? "open" };
const STATES = ["running", "waiting", "done", "idle"];
const VIEWS = ["groups", "status", "cards"];
function Seg({
  kind,
  label,
  value,
  options,
  onChange,
  panelId
}) {
  const refs = React.useRef([]);
  const at = Math.max(0, options.findIndex((o) => o.value === value));
  const go = (i) => {
    const n = (i + options.length) % options.length;
    onChange(options[n].value);
    refs.current[n]?.focus();
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "sb-seg",
      role: kind === "tab" ? "tablist" : "radiogroup",
      "aria-label": label,
      onKeyDown: (e) => {
        const k = e.key;
        if (k === "ArrowRight" || k === "ArrowDown") {
          e.preventDefault();
          go(at + 1);
        }
        if (k === "ArrowLeft" || k === "ArrowUp") {
          e.preventDefault();
          go(at - 1);
        }
        if (k === "Home") {
          e.preventDefault();
          go(0);
        }
        if (k === "End") {
          e.preventDefault();
          go(-1);
        }
      },
      children: options.map((o, i) => {
        const on = i === at;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            ref: (el) => {
              refs.current[i] = el;
            },
            type: "button",
            role: kind,
            "aria-checked": kind === "radio" ? on : void 0,
            "aria-selected": kind === "tab" ? on : void 0,
            "aria-controls": kind === "tab" ? panelId : void 0,
            tabIndex: on ? 0 : -1,
            className: "sb-seg-opt",
            "data-active": on || void 0,
            onClick: () => onChange(o.value),
            children: [
              o.label,
              o.count != null && /* @__PURE__ */ jsx("span", { className: "sb-seg-count", children: o.count })
            ]
          },
          o.value
        );
      })
    }
  );
}
function SessionBoard({
  project = demoProject,
  groups = defaultSessionGroups,
  sessions: sessionsIn = demoSessions,
  me = sessionsIn === demoSessions ? sessionBoardDemo.me : void 0,
  scope: scopeProp,
  defaultScope = "all",
  onScopeChange,
  onSessionClick,
  selectedId: selectedProp,
  view: viewProp,
  defaultView = "groups",
  onViewChange,
  views = VIEWS,
  labels: labelsProp,
  className = ""
}) {
  const L = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const sessions = sessionsIn.map((s) => ({ ...s, state: s.state ?? toSessionState(s.status) }));
  const [scopeOwn, setScopeOwn] = React.useState(defaultScope);
  const scope = me ? scopeProp ?? scopeOwn : "all";
  const other = (s) => me && s.owner !== me && !(s.sharedWith ?? []).includes(me) ? "" : void 0;
  const rootRef = React.useRef(null);
  const [collapsed, setCollapsed] = React.useState({});
  const [folded, setFolded] = React.useState({});
  const [selectedOwn, setSelectedOwn] = React.useState(null);
  const selected = selectedProp !== void 0 ? selectedProp : selectedOwn;
  const [viewOwn, setViewOwn] = React.useState(defaultView);
  const view = viewProp ?? viewOwn;
  const setView = (v) => {
    setViewOwn(v);
    onViewChange?.(v);
  };
  const [tab, setTab] = React.useState(() => STATES.find((st) => sessions.some((s) => s.state === st)) ?? "running");
  const known = new Set(groups.map((g) => g.id));
  const byId = new Map(sessions.map((s) => [s.id, s]));
  const groupLabel = (s) => groups.find((g) => g.id === s.group)?.label ?? L.ungrouped;
  const buckets = [
    ...groups.map((g) => ({ ...g, list: sessions.filter((s) => s.group === g.id) })),
    { id: UNGROUPED, label: L.ungrouped, defaultCollapsed: false, list: sessions.filter((s) => !s.group || !known.has(s.group)) }
  ].filter((g) => g.id !== UNGROUPED || g.list.length > 0);
  const stats = project.stats ?? {};
  const statList = [
    { key: "tasks", label: L.tasks, value: stats.tasks },
    { key: "decisions", label: L.decisions, value: stats.decisions },
    { key: "pages", label: L.pages, value: stats.pages },
    { key: "prs", label: L.prs, value: stats.prs }
  ].filter((x) => typeof x.value === "number");
  const moveFocus = (from, step) => {
    const all = Array.from(rootRef.current?.querySelectorAll("[data-sb-nav]") ?? []).filter(
      (b) => !b.closest("[inert]")
    );
    if (!all.length) return;
    const i = all.indexOf(from);
    const next = step === "first" ? 0 : step === "last" ? all.length - 1 : Math.min(all.length - 1, Math.max(0, i + step));
    all[next]?.focus();
  };
  const navKeys = (e, s, kids = 0) => {
    const k = e.key;
    if (k === "ArrowDown" || k === "ArrowUp" || k === "Home" || k === "End") {
      e.preventDefault();
      moveFocus(e.currentTarget, k === "ArrowDown" ? 1 : k === "ArrowUp" ? -1 : k === "Home" ? "first" : "last");
    }
    if (s && kids && (k === "ArrowLeft" || k === "ArrowRight")) {
      e.preventDefault();
      setFolded((f) => ({ ...f, [s.id]: k === "ArrowLeft" }));
    }
  };
  const open = (s) => {
    setSelectedOwn(s.id);
    onSessionClick?.(s);
  };
  const tags = (s, group) => {
    const pr = prOf(s.pr);
    return /* @__PURE__ */ jsxs("span", { className: "sb-tags", children: [
      group && /* @__PURE__ */ jsx("span", { className: "sb-tag sb-grp", children: groupLabel(s) }),
      pr && /* @__PURE__ */ jsxs("span", { className: `sb-tag sb-pr-${pr.state}`, children: [
        /* @__PURE__ */ jsxs("span", { "aria-hidden": "true", children: [
          "#",
          pr.number
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "sb-sr", children: [
          L.pr,
          " ",
          pr.number,
          ", ",
          L[pr.state]
        ] })
      ] }),
      s.owner && /* @__PURE__ */ jsxs("span", { className: "sb-who", title: s.sharedWith?.length ? `${s.owner} ${L.sharedWith} ${s.sharedWith.join(", ")}` : s.owner, children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: s.owner.trim().split(/\s+/).map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase() }),
        s.sharedWith?.length ? /* @__PURE__ */ jsxs("span", { className: "sb-who-more", "aria-hidden": "true", children: [
          "+",
          s.sharedWith.length
        ] }) : null,
        /* @__PURE__ */ jsxs("span", { className: "sb-sr", children: [
          s.owner,
          s.sharedWith?.length ? ` ${L.sharedWith} ${s.sharedWith.join(", ")}` : ""
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "sb-tag sb-st", children: L[s.state] })
    ] });
  };
  let order = 0;
  const renderRows = (rows, opts = {}) => /* @__PURE__ */ jsx("ul", { className: "sb-list", children: rows.map(({ s, depth, kids }) => {
    const i = order++;
    const isFolded = !!folded[s.id];
    const parent = opts.crumbs && !depth && s.parent ? byId.get(s.parent) : void 0;
    return /* @__PURE__ */ jsxs(
      "li",
      {
        className: `sb-row is-${s.state}${depth ? " is-child" : ""}${kids ? " is-parent" : ""}`,
        "data-cw-other": other(s),
        style: { "--i": i, "--d": depth },
        children: [
          kids > 0 ? /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "sb-fold",
              "aria-expanded": !isFolded,
              "aria-label": `${isFolded ? L.expandKids : L.collapseKids}: ${s.title} (${kids})`,
              onClick: () => setFolded((f) => ({ ...f, [s.id]: !isFolded })),
              children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m6 4 4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) })
            }
          ) : /* @__PURE__ */ jsx("span", { className: "sb-fold-gap", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "sb-row-btn",
              "data-sb-nav": "",
              "aria-current": selected === s.id ? "true" : void 0,
              "aria-expanded": kids ? !isFolded : void 0,
              onClick: () => open(s),
              onKeyDown: (e) => navKeys(e, s, kids),
              children: [
                /* @__PURE__ */ jsx("span", { className: "sb-dot", "data-s": s.state, "aria-hidden": "true" }),
                /* @__PURE__ */ jsxs("span", { className: "sb-text", children: [
                  /* @__PURE__ */ jsxs("span", { className: "sb-title", children: [
                    s.title,
                    kids > 0 && isFolded && /* @__PURE__ */ jsxs("span", { className: "sb-kids", children: [
                      "+",
                      kids
                    ] })
                  ] }),
                  (s.line || parent) && /* @__PURE__ */ jsxs("span", { className: "sb-line", children: [
                    parent && /* @__PURE__ */ jsxs("span", { className: "sb-crumb", children: [
                      L.inParent,
                      " ",
                      parent.title,
                      s.line ? " · " : ""
                    ] }),
                    s.line
                  ] })
                ] }),
                tags(s),
                s.state === "running" && /* @__PURE__ */ jsx("span", { className: "sb-run", "aria-hidden": "true" })
              ]
            }
          )
        ]
      },
      s.id
    );
  }) });
  const icon = project.icon ?? project.name.trim().charAt(0).toUpperCase();
  const shownViews = views.filter((v) => VIEWS.includes(v));
  const viewLabel = { groups: L.groupsView, status: L.statusView, cards: L.cardsView };
  const panelId = `${uid}-panel`;
  return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: `sb ${className}`, "data-cw-root": "session-board", "data-scope": scope, children: [
    /* @__PURE__ */ jsx("style", { children: css }),
    /* @__PURE__ */ jsxs("section", { className: "sb-head", "aria-labelledby": `${uid}-name`, children: [
      /* @__PURE__ */ jsxs("div", { className: "sb-id", children: [
        /* @__PURE__ */ jsx("span", { className: "sb-icon", "aria-hidden": "true", children: icon }),
        /* @__PURE__ */ jsxs("div", { className: "sb-titles", children: [
          /* @__PURE__ */ jsx("h2", { id: `${uid}-name`, className: "sb-name", children: project.name }),
          project.owner && /* @__PURE__ */ jsxs("p", { className: "sb-owner", children: [
            L.owner,
            " · ",
            project.owner
          ] })
        ] }),
        project.status && /* @__PURE__ */ jsx("span", { className: `sb-status sb-tone-${project.status.tone ?? "gray"}`, children: project.status.label })
      ] }),
      statList.length > 0 && /* @__PURE__ */ jsx("dl", { className: "sb-stats", children: statList.map((x, i) => /* @__PURE__ */ jsx(Stat, { value: x.value, label: x.label, index: i }, x.key)) }),
      project.links && project.links.length > 0 && /* @__PURE__ */ jsx("ul", { className: "sb-links", "aria-label": L.links, children: project.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { className: "sb-chip", href: l.href, target: "_blank", rel: "noreferrer noopener", children: [
        /* @__PURE__ */ jsx(LinkIcon, { kind: l.kind }),
        l.label
      ] }) }, l.href + l.label)) })
    ] }),
    (shownViews.length > 1 || !!me) && /* @__PURE__ */ jsxs("div", { className: "sb-bar", children: [
      shownViews.length > 1 && /* @__PURE__ */ jsx(
        Seg,
        {
          kind: "radio",
          label: L.view,
          value: view,
          options: shownViews.map((v) => ({ value: v, label: viewLabel[v] })),
          onChange: setView
        }
      ),
      me && /* @__PURE__ */ jsx("div", { className: "sb-seg sb-scope", role: "group", "aria-label": L.scope, children: ["all", "mine"].map((v) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          "aria-pressed": scope === v,
          className: "sb-seg-opt",
          "data-active": scope === v || void 0,
          "data-cw-scope-btn": v,
          onClick: () => {
            setScopeOwn(v);
            onScopeChange?.(v);
          },
          children: v === "all" ? L.all : L.mine
        },
        v
      )) })
    ] }),
    view === "groups" && /* @__PURE__ */ jsx("div", { className: "sb-groups sb-view", children: buckets.map((g) => {
      const isCollapsed = collapsed[g.id] ?? !!g.defaultCollapsed;
      const rows = orderRows(g.list, folded);
      const bodyId = `${uid}-${g.id}`;
      const live = g.list.filter((s) => s.state === "running").length;
      return /* @__PURE__ */ jsxs("section", { className: `sb-group${isCollapsed ? " is-collapsed" : ""}`, "aria-labelledby": `${bodyId}-h`, "data-cw-scope": "", "data-cw-other": me && g.list.every((x) => other(x) !== void 0) ? "" : void 0, children: [
        /* @__PURE__ */ jsx("h3", { className: "sb-gh", children: /* @__PURE__ */ jsxs(
          "button",
          {
            id: `${bodyId}-h`,
            type: "button",
            className: "sb-gbtn",
            "aria-expanded": !isCollapsed,
            "aria-controls": bodyId,
            "data-cw-toggle": "is-collapsed",
            onClick: () => setCollapsed((c) => ({ ...c, [g.id]: !isCollapsed })),
            children: [
              /* @__PURE__ */ jsx("svg", { className: "sb-chev", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m6 4 4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) }),
              /* @__PURE__ */ jsx("span", { className: "sb-glabel", children: g.label }),
              live > 0 && /* @__PURE__ */ jsx("i", { className: "sb-glive", "aria-hidden": "true" }),
              /* @__PURE__ */ jsxs("span", { className: "sb-gcount", children: [
                /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: g.list.length }),
                /* @__PURE__ */ jsxs("span", { className: "sb-sr", children: [
                  ", ",
                  g.list.length,
                  " ",
                  g.list.length === 1 ? L.session : L.sessions
                ] })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { id: bodyId, className: "sb-body", inert: isCollapsed || void 0, children: /* @__PURE__ */ jsx("div", { className: "sb-clip", children: rows.length === 0 ? /* @__PURE__ */ jsx("p", { className: "sb-empty", children: L.empty }) : renderRows(rows) }) })
      ] }, g.id);
    }) }, "groups"),
    view === "status" && /* @__PURE__ */ jsxs("div", { className: "sb-group sb-view sb-status-view", children: [
      /* @__PURE__ */ jsx("div", { className: "sb-tabs", children: /* @__PURE__ */ jsx(
        Seg,
        {
          kind: "tab",
          label: L.statusView,
          value: tab,
          panelId,
          options: STATES.map((st) => ({ value: st, label: L[st], count: sessions.filter((s) => s.state === st).length })),
          onChange: setTab
        }
      ) }),
      /* @__PURE__ */ jsx("div", { id: panelId, role: "tabpanel", "aria-label": L[tab], className: "sb-panel", children: (() => {
        const list = sessions.filter((s) => s.state === tab);
        return list.length === 0 ? /* @__PURE__ */ jsx("p", { className: "sb-empty", children: L.empty }) : renderRows(orderRows(list, folded), { crumbs: true });
      })() }, tab)
    ] }, "status"),
    view === "cards" && /* @__PURE__ */ jsx("ul", { className: "sb-cards sb-view", children: orderRows(sessions).filter((r) => r.depth === 0).map(({ s, kids }) => {
      const i = order++;
      const children = sessions.filter((c) => c.parent === s.id && c.id !== s.id);
      const isFolded = !!folded[s.id];
      const listId = `${uid}-kids-${s.id}`;
      return /* @__PURE__ */ jsxs("li", { className: `sb-card is-${s.state}`, style: { "--i": i }, "data-cw-other": other(s), children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "sb-card-btn",
            "data-sb-nav": "",
            "aria-current": selected === s.id ? "true" : void 0,
            onClick: () => open(s),
            onKeyDown: (e) => navKeys(e, s, kids),
            children: [
              /* @__PURE__ */ jsxs("span", { className: "sb-card-top", children: [
                /* @__PURE__ */ jsx("span", { className: "sb-dot", "data-s": s.state, "aria-hidden": "true" }),
                /* @__PURE__ */ jsx("span", { className: "sb-title", children: s.title })
              ] }),
              s.line && /* @__PURE__ */ jsx("span", { className: "sb-line", children: s.line }),
              tags(s, true),
              s.state === "running" && /* @__PURE__ */ jsx("span", { className: "sb-run", "aria-hidden": "true" })
            ]
          }
        ),
        children.length > 0 && /* @__PURE__ */ jsxs("div", { className: "sb-card-kids", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              className: "sb-kids-btn",
              "aria-expanded": !isFolded,
              "aria-controls": listId,
              onClick: () => setFolded((f) => ({ ...f, [s.id]: !isFolded })),
              children: [
                /* @__PURE__ */ jsx("svg", { className: "sb-chev", viewBox: "0 0 16 16", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "m6 4 4 4-4 4", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round" }) }),
                children.length,
                " ",
                children.length === 1 ? L.subItem : L.subItems
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { id: listId, className: `sb-body${isFolded ? " is-folded" : ""}`, inert: isFolded || void 0, children: /* @__PURE__ */ jsx("div", { className: "sb-clip", children: /* @__PURE__ */ jsx("ul", { className: "sb-mini", children: children.map((c) => /* @__PURE__ */ jsx("li", { className: `is-${c.state}`, children: /* @__PURE__ */ jsxs("button", { type: "button", className: "sb-mini-btn", "data-sb-nav": "", "aria-current": selected === c.id ? "true" : void 0, onClick: () => open(c), onKeyDown: (e) => navKeys(e), children: [
            /* @__PURE__ */ jsx("span", { className: "sb-dot", "data-s": c.state, "aria-hidden": "true" }),
            /* @__PURE__ */ jsx("span", { className: "sb-title", children: c.title }),
            /* @__PURE__ */ jsxs("span", { className: "sb-sr", children: [
              ", ",
              L[c.state]
            ] })
          ] }) }, c.id)) }) }) })
        ] })
      ] }, s.id);
    }) }, "cards")
  ] });
}
const css = `
.sb{--sb-bg:var(--ts-surface,#fff);--sb-fg:var(--ts-fg,#18181b);--sb-muted:var(--ts-muted,#65656d);--sb-faint:var(--ts-faint,#65656d);--sb-line:var(--ts-line,#ececef);--sb-soft:var(--ts-soft,#f4f4f5);--sb-soft-2:var(--ts-soft-2,#f1f1f3);--sb-accent:var(--ts-accent,#4f7cf0);--sb-accent-soft:var(--ts-accent-soft,#e8f1fe);--sb-green:var(--ts-green,#16a34a);--sb-green-soft:var(--ts-green-soft,#e9f8ee);--sb-amber:var(--ts-amber,#c2620a);--sb-amber-soft:var(--ts-amber-soft,#fff4e0);--sb-red:var(--ts-red,#dc2626);--sb-red-soft:var(--ts-red-soft,#fdecec);--sb-violet:var(--ts-violet,#7c3aed);--sb-violet-soft:var(--ts-violet-soft,#f1ebfd);--sb-seg-on:var(--ts-seg-on,#fff);--sb-ink:color-mix(in srgb,var(--sb-fg) 35%,transparent);position:relative;width:100%;max-width:640px;display:flex;flex-direction:column;gap:var(--ts-gap-control,16px);color:var(--sb-fg);font:400 14px/1.4 var(--ts-font,Inter,system-ui,sans-serif);container:sb/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .sb{--sb-bg:var(--ts-surface,#1b1b1e);--sb-fg:var(--ts-fg,#ececef);--sb-muted:var(--ts-muted,#a1a1aa);--sb-faint:var(--ts-faint,#9a9aa2);--sb-line:var(--ts-line,#2e2e33);--sb-soft:var(--ts-soft,#26262a);--sb-soft-2:var(--ts-soft-2,#2a2a2f);--sb-accent:var(--ts-accent,#7c9cff);--sb-accent-soft:var(--ts-accent-soft,#1b2a44);--sb-green:var(--ts-green,#4ade80);--sb-green-soft:var(--ts-green-soft,#16301f);--sb-amber:var(--ts-amber,#eba659);--sb-amber-soft:var(--ts-amber-soft,#3a2a12);--sb-red:var(--ts-red,#f87171);--sb-red-soft:var(--ts-red-soft,#3a1d1f);--sb-violet:var(--ts-violet,#a78bfa);--sb-violet-soft:var(--ts-violet-soft,#2a2140);--sb-seg-on:var(--ts-seg-on,#3a3a40);color-scheme:dark}
.sb *{box-sizing:border-box}
.sb-name{font-family:var(--ts-font-display,inherit)}:where(.sb) button{font:inherit;color:inherit;cursor:pointer}
.sb-head,.sb-group{background:var(--sb-bg);border:1px solid var(--sb-line);border-radius:12px;box-shadow:0 1px 2px #0000000a}
.sb-head{padding:14px 14px 12px;animation:sb-in .36s cubic-bezier(.2,.8,.3,1) both}
.sb-id{display:flex;align-items:center;gap:10px;min-width:0}
.sb-icon{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:9px;background:var(--sb-fg);color:var(--sb-bg);font-size:16px;font-weight:600;line-height:1}
.sb-icon svg{width:20px;height:20px}
.sb-titles{flex:1;min-width:0}
.sb-name{margin:0;font-size:15px;font-weight:600;line-height:1.3;letter-spacing:-.005em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-owner{margin:1px 0 0;font-size:12.5px;color:var(--sb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-status{flex:none;display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 8px;border-radius:6px;font-size:12px;font-weight:500}
.sb-status::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.sb-tone-green{background:var(--sb-green-soft);color:color-mix(in srgb,var(--sb-green) 78%,var(--sb-fg))}
.sb-tone-amber{background:var(--sb-amber-soft);color:color-mix(in srgb,var(--sb-amber) 82%,var(--sb-fg))}
.sb-tone-blue{background:var(--sb-accent-soft);color:color-mix(in srgb,var(--sb-accent) 72%,var(--sb-fg))}
.sb-tone-red{background:var(--sb-red-soft);color:color-mix(in srgb,var(--sb-red) 82%,var(--sb-fg))}
.sb-tone-gray{background:var(--sb-soft);color:var(--sb-muted)}
.sb-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:12px 0 0;padding:0}
.sb-stat{display:flex;flex-direction:column-reverse;gap:1px;padding:8px 10px;border-radius:8px;background:var(--sb-soft)}
.sb-stat dt{font-size:12px;color:var(--sb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-stat dd{margin:0;font-size:20px;font-weight:600;line-height:1.2;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.sb-links{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0;padding:0;list-style:none}
.sb-chip{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px 0 7px;border:1px solid var(--sb-line);border-radius:7px;color:var(--sb-fg);font-size:12.5px;text-decoration:none;transition:background .15s,border-color .15s}
.sb-chip:hover{background:var(--sb-soft);border-color:color-mix(in srgb,var(--sb-line) 60%,var(--sb-faint))}
.sb-chip svg{width:14px;height:14px;color:var(--sb-muted)}
.sb-groups{display:flex;flex-direction:column;gap:8px}
.sb-group{overflow:hidden}
.sb-gh{margin:0;font-size:inherit;font-weight:inherit}
.sb-gbtn{display:flex;align-items:center;gap:7px;width:100%;min-height:40px;padding:8px 12px 8px 10px;border:0;background:none;text-align:left;font-weight:500;transition:background .15s}
.sb-gbtn:hover{background:var(--sb-soft)}
.sb-chev{width:14px;height:14px;flex:none;color:var(--sb-faint);transform:rotate(90deg);transition:transform .22s cubic-bezier(.2,.8,.3,1)}
.sb-group.is-collapsed .sb-chev{transform:none}
.sb-glabel{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-glive{width:6px;height:6px;border-radius:50%;background:var(--sb-accent);flex:none}
.sb-gcount{margin-left:auto;min-width:22px;height:20px;padding:0 7px;border-radius:10px;background:var(--sb-soft);color:var(--sb-muted);font-size:12px;font-weight:500;line-height:20px;text-align:center;font-variant-numeric:tabular-nums}
.sb-body{display:grid;grid-template-rows:1fr;transition:grid-template-rows .28s cubic-bezier(.2,.8,.3,1),opacity .2s}
.sb-group.is-collapsed .sb-body{grid-template-rows:0fr;opacity:0}
.sb-clip{min-height:0;overflow:hidden}
.sb-list{list-style:none;margin:0;padding:0 4px 4px;border-top:1px solid var(--sb-line)}
.sb-group.is-collapsed .sb-list{border-top-color:transparent}
.sb-empty{margin:0;padding:10px 14px 12px 33px;border-top:1px solid var(--sb-line);color:var(--sb-muted);font-size:13px}
.sb-row{position:relative;display:flex;align-items:center;margin-top:4px;padding-left:calc(var(--d,0) * 18px);animation:sb-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 45ms + 120ms)}
.sb-row.is-child::before{content:"";position:absolute;left:calc(var(--d) * 18px - 7px);top:-4px;bottom:0;width:1px;background:var(--sb-line)}
.sb-row-btn{position:relative;flex:1;min-width:0;display:flex;align-items:center;gap:10px;min-height:44px;padding:7px 8px 7px 4px;border:0;border-radius:8px;background:none;text-align:left;overflow:hidden;transition:background .15s}
.sb-row-btn:hover{background:var(--sb-soft)}
.sb-row-btn[aria-current=true]{background:var(--sb-accent-soft)}
.sb-dot{position:relative;flex:none;width:8px;height:8px;border-radius:50%;background:var(--sb-faint)}
.sb-dot[data-s=running]{background:var(--sb-accent)}
.sb-dot[data-s=running]::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px solid var(--sb-accent);opacity:0;animation:sb-pulse 1.6s ease-out infinite}
.sb-dot[data-s=waiting]{background:var(--sb-amber)}
.sb-dot[data-s=done]{background:var(--sb-green)}
.sb-dot[data-s=idle]{background:none;border:1.5px solid var(--sb-faint)}
.sb-text{flex:1;min-width:0;display:flex;flex-direction:column}
.sb-title{font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-row:not(.is-child) .sb-title{font-weight:500}
.sb-row.is-parent .sb-title{font-weight:600}
.sb-row.is-child .sb-title{color:var(--sb-fg)}
.sb-line{font-size:12.5px;color:var(--sb-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-row.is-idle .sb-title,.sb-row.is-idle .sb-line{color:var(--sb-muted)}
.sb-tags{flex:none;display:flex;align-items:center;gap:5px}
.sb-tag{display:inline-flex;align-items:center;height:20px;padding:0 6px;border-radius:5px;font-size:11.5px;font-weight:500;white-space:nowrap;font-variant-numeric:tabular-nums}
.sb-pr-open{background:var(--sb-accent-soft);color:color-mix(in srgb,var(--sb-accent) 70%,var(--sb-fg))}
.sb-pr-draft{background:var(--sb-soft);color:var(--sb-muted)}
.sb-pr-merged{background:var(--sb-violet-soft);color:color-mix(in srgb,var(--sb-violet) 80%,var(--sb-fg))}
.sb-pr-closed{background:var(--sb-red-soft);color:color-mix(in srgb,var(--sb-red) 82%,var(--sb-fg))}
.sb-st{border:1px solid var(--sb-line);color:var(--sb-muted);font-weight:400}
.is-running .sb-st{border-color:color-mix(in srgb,var(--sb-accent) 40%,var(--sb-line));color:color-mix(in srgb,var(--sb-accent) 70%,var(--sb-fg))}
.is-waiting .sb-st{border-color:color-mix(in srgb,var(--sb-amber) 45%,var(--sb-line));color:color-mix(in srgb,var(--sb-amber) 82%,var(--sb-fg))}
.sb-run{position:absolute;left:22px;right:10px;bottom:3px;height:2px;border-radius:2px;background:color-mix(in srgb,var(--sb-accent) 16%,transparent);overflow:hidden}
.sb-run::after{content:"";position:absolute;top:0;bottom:0;left:0;width:34%;border-radius:2px;background:var(--sb-accent);animation:sb-run 1.8s cubic-bezier(.45,0,.35,1) infinite}
.sb-fold,.sb-fold-gap{flex:none;width:22px;height:28px}
.sb-fold{display:grid;place-items:center;padding:0;border:0;border-radius:6px;background:none;color:var(--sb-faint);transition:background .15s,color .15s}
.sb-fold:hover{background:var(--sb-soft);color:var(--sb-fg)}
.sb-fold svg,.sb-kids-btn .sb-chev{width:14px;height:14px;transform:rotate(90deg);transition:transform .22s cubic-bezier(.2,.8,.3,1)}
.sb-fold[aria-expanded=false] svg,.sb-kids-btn[aria-expanded=false] .sb-chev{transform:none}
.sb-kids{margin-left:6px;font-size:11.5px;font-weight:500;color:var(--sb-muted)}
.sb-crumb{color:var(--sb-faint)}
.sb-grp{background:var(--sb-soft);color:var(--sb-muted);font-weight:400}
.sb-bar{display:flex;gap:8px;min-width:0}
.sb-scope{margin-left:auto}
.sb[data-scope=mine] [data-cw-other]{display:none!important}
.sb-who{display:inline-flex;align-items:center;gap:2px;height:20px}
.sb-who>span:first-child{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--sb-soft);border:1px solid var(--sb-line);color:var(--sb-muted);font-size:9.5px;font-weight:600}
.sb-who-more{font-size:11px;color:var(--sb-faint)}
.sb-seg{display:inline-flex;gap:2px;max-width:100%;padding:2px;border-radius:8px;background:var(--sb-soft);overflow-x:auto;scrollbar-width:none}
.sb-seg::-webkit-scrollbar{display:none}
.sb-seg-opt{display:inline-flex;align-items:center;justify-content:center;gap:6px;flex:none;height:28px;padding:0 10px;border:0;border-radius:6px;background:none;color:var(--sb-muted); font-size:13px; font-weight:500; white-space:nowrap;transition:color .09s,background .15s,box-shadow .15s}
.sb-seg-opt:hover{color:var(--sb-fg)}
.sb-seg-opt[data-active]{background:var(--sb-seg-on);color:var(--sb-fg); box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
.sb-seg-count{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--sb-soft-2);font-size:11.5px;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
.sb-seg-opt[data-active] .sb-seg-count{background:var(--sb-soft)}
.sb-view{animation:sb-fade .22s ease both}
.sb-tabs{padding:8px;border-bottom:1px solid var(--sb-line)}
.sb-tabs .sb-seg{display:flex;width:100%}.sb-tabs .sb-seg-opt{flex:1 0 auto}
.sb-panel{animation:sb-fade .2s ease both}
.sb-panel .sb-list{border-top:0}.sb-panel .sb-empty{border-top:0;padding-left:14px}
.sb-cards{display:grid;align-items:start;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;margin:0;padding:0;list-style:none}
.sb-card{position:relative;display:flex;flex-direction:column;background:var(--sb-bg);border:1px solid var(--sb-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;overflow:hidden;animation:sb-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 45ms + 60ms)}
.sb-card-btn{position:relative;flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:100%;padding:12px 12px 14px;border:0;background:none;text-align:left;transition:background .15s}
.sb-card-btn:hover{background:var(--sb-soft)}.sb-card-btn[aria-current=true]{background:var(--sb-accent-soft)}
.sb-card-top{display:flex;align-items:center;gap:9px;width:100%;min-width:0}
.sb-card .sb-title{font-weight:600}.sb-card.is-idle .sb-card-btn .sb-title{color:var(--sb-muted)}
.sb-card .sb-line{white-space:normal;padding-left:17px}
.sb-card .sb-tags{flex-wrap:wrap;margin-top:2px;padding-left:17px}
.sb-card .sb-run{left:12px;right:12px;bottom:5px}
.sb-card-kids{padding:4px;border-top:1px solid var(--sb-line)}
.sb-kids-btn{display:flex;align-items:center;gap:6px;width:100%;height:32px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--sb-muted);font-size:12.5px;text-align:left}
.sb-kids-btn:hover{background:var(--sb-soft);color:var(--sb-fg)}
.sb-body.is-folded{grid-template-rows:0fr;opacity:0}
.sb-mini{margin:0;padding:0 0 2px;list-style:none}
.sb-mini-btn{display:flex;align-items:center;gap:8px;width:100%;min-height:32px;padding:4px 8px 4px 28px;border:0;border-radius:6px;background:none;text-align:left;font-size:13px}
.sb-mini-btn:hover{background:var(--sb-soft)}.sb-mini-btn[aria-current=true]{background:var(--sb-accent-soft)}
.sb-mini .sb-dot{width:6px;height:6px}.sb-mini .sb-title{font-weight:400}
@keyframes sb-fade{from{opacity:0}}
.sb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sb :focus-visible{outline:2px solid var(--sb-accent);outline-offset:-2px}
.sb-chip:focus-visible{outline-offset:1px}
@keyframes sb-in{from{opacity:0;transform:translateY(6px)}}
@keyframes sb-pulse{0%{opacity:.7;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
@keyframes sb-run{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
@container sb (max-width:480px){.sb-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.is-done .sb-st,.is-idle .sb-st{position:absolute;width:1px;height:1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
@container sb (max-width:420px){.sb-tabs .sb-seg-opt{flex:1 1 0;min-width:0;gap:4px;padding:0 6px;font-size:12.5px}.sb-tabs .sb-seg-count{min-width:0;padding:0;background:none}.sb-tabs .sb-seg-opt[data-active] .sb-seg-count{background:none}}
@container sb (max-width:380px){.sb-line{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}}
@media(prefers-reduced-motion:reduce){.sb *,.sb{animation:none!important;transition:none!important}.sb-run::after{width:100%;opacity:.55}}
`;
export {
  SessionBoard,
  defaultSessionGroups,
  sessionBoardDemo,
  toSessionState
};
//# sourceMappingURL=session-board-CXGgB0iK.js.map
