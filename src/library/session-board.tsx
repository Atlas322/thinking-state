"use client";

import * as React from "react";

/**
 * Session Board — one project's agent sessions, PRs and deploys at a glance.
 * A header card (icon, name, status, owner, four counters that count up, link
 * chips) over collapsible groups (Projects / Areas / Resources / Finance /
 * ungrouped). Each session row has a state dot (running pulses), title, one
 * line, PR and state tags, and a running line under live sessions; child
 * sessions sit indented under their parent and fold away with it.
 * Three views of the same data: by group, by state (tabs) and as cards.
 * With `me` set, an All / Mine switch keeps the sessions `me` owns or is
 * shared on (owner OR sharedWith, as in the Just.Notion «my projects» view).
 * Input sessions may carry a vault/Notion `status` (in-progress, waiting,
 * completed, inbox, planning…) instead of `state`.
 * Original Component Studio component. Colours follow tokens/tokens.json
 * (bg, surface/2, border/default, text/*, accent/*, status/*).
 * Motion: rows arrive one after another, groups fold smoothly, counters count
 * up; all of it is off under prefers-reduced-motion.
 */

export type SessionState = "running" | "waiting" | "done" | "idle";
export type SessionPrState = "open" | "draft" | "merged" | "closed";
export type SessionBoardView = "groups" | "status" | "cards";
export type SessionTone = "green" | "amber" | "blue" | "red" | "gray";

export type SessionBoardSession = {
  id: string;
  title: string;
  /** One-line description of where the session is. */
  line?: string;
  state: SessionState;
  /** Group id; a missing or unknown id lands in the ungrouped group. */
  group?: string;
  /** Parent session id; the row is indented under its parent. */
  parent?: string;
  pr?: number | { number: number; state?: SessionPrState };
  /** Vault `owner`; shown as initials. */
  owner?: string;
  /** Who else works on it (team / company sharing layer). */
  sharedWith?: string[];
};

/** What callers pass: `state`, or a vault/Notion `status` that maps onto it. */
export type SessionBoardInput = Omit<SessionBoardSession, "state"> & { state?: SessionState; status?: string };

/** Maps vault / Notion statuses onto the four session states. */
export function toSessionState(value?: string): SessionState {
  const v = (value ?? "").toLowerCase().replace(/[\s_]+/g, "-");
  if (v === "running" || v === "waiting" || v === "done" || v === "idle") return v;
  if (["in-progress", "active", "doing"].includes(v)) return "running";
  if (["waiting-on", "blocked"].includes(v)) return "waiting";
  if (["completed", "complete", "cancelled", "canceled", "merged"].includes(v)) return "done";
  return "idle"; // inbox, planning, next-action, someday, unknown
}

export type SessionBoardGroup = { id: string; label: string; defaultCollapsed?: boolean };

export type SessionBoardLink = {
  label: string;
  href: string;
  kind?: "repo" | "prod" | "figma" | "link";
};

export type SessionBoardProject = {
  name: string;
  /** Emoji, letter or a node; defaults to the first letter of the name. */
  icon?: React.ReactNode;
  status?: { label: string; tone?: SessionTone };
  owner?: string;
  stats?: { tasks?: number; decisions?: number; pages?: number; prs?: number };
  links?: SessionBoardLink[];
};

export type SessionBoardLabels = {
  owner: string;
  tasks: string;
  decisions: string;
  pages: string;
  prs: string;
  ungrouped: string;
  sessions: string;
  session: string;
  empty: string;
  running: string;
  waiting: string;
  done: string;
  idle: string;
  links: string;
  pr: string;
  open: string;
  draft: string;
  merged: string;
  closed: string;
  view: string;
  groupsView: string;
  statusView: string;
  cardsView: string;
  subItem: string;
  subItems: string;
  collapseKids: string;
  expandKids: string;
  inParent: string;
  scope: string;
  all: string;
  mine: string;
  sharedWith: string;
};

export type SessionBoardProps = {
  project?: SessionBoardProject;
  groups?: SessionBoardGroup[];
  sessions?: SessionBoardInput[];
  /** The viewer; enables the All / Mine switch. */
  me?: string;
  scope?: "all" | "mine";
  defaultScope?: "all" | "mine";
  onScopeChange?: (scope: "all" | "mine") => void;
  onSessionClick?: (session: SessionBoardSession) => void;
  /** Controlled selection (highlighted row); defaults to the last clicked row. */
  selectedId?: string | null;
  /** Controlled view: by group, by state (tabs) or as cards. */
  view?: SessionBoardView;
  defaultView?: SessionBoardView;
  onViewChange?: (view: SessionBoardView) => void;
  /** Which views the switch offers (default all three); one view hides the switch. */
  views?: SessionBoardView[];
  labels?: Partial<SessionBoardLabels>;
  className?: string;
};

const defaultLabels: SessionBoardLabels = {
  owner: "Owner",
  tasks: "Open tasks",
  decisions: "Decisions",
  pages: "Pages",
  prs: "Open PRs",
  ungrouped: "Ungrouped",
  sessions: "sessions",
  session: "session",
  empty: "No sessions",
  running: "Running",
  waiting: "Waiting",
  done: "Done",
  idle: "Idle",
  links: "Links",
  pr: "PR",
  open: "open",
  draft: "draft",
  merged: "merged",
  closed: "closed",
  view: "View",
  groupsView: "Groups",
  statusView: "Status",
  cardsView: "Cards",
  subItem: "sub-session",
  subItems: "sub-sessions",
  collapseKids: "Hide sub-sessions",
  expandKids: "Show sub-sessions",
  inParent: "in",
  scope: "Show",
  all: "All",
  mine: "Mine",
  sharedWith: "with",
};

export const defaultSessionGroups: SessionBoardGroup[] = [
  { id: "projects", label: "Projects" },
  { id: "areas", label: "Areas" },
  { id: "resources", label: "Resources" },
  { id: "finance", label: "Finance" },
];

const UNGROUPED = "__ungrouped";

const demoProject: SessionBoardProject = {
  name: "ac.me website",
  icon: "A",
  status: { label: "Active", tone: "green" },
  owner: "Project agent",
  stats: { tasks: 12, decisions: 4, pages: 38, prs: 3 },
  links: [
    { label: "acme/website", href: "https://example.com/acme/website", kind: "repo" },
    { label: "ac.me", href: "https://example.com/", kind: "prod" },
    { label: "Figma", href: "https://example.com/figma/acme", kind: "figma" },
  ],
};

const demoSessions: SessionBoardSession[] = [
  { id: "relaunch", title: "Website relaunch", line: "Rebuilding the pricing page on the new grid", state: "running", group: "projects", pr: { number: 21, state: "open" }, owner: "Anu", sharedWith: ["Bat"] },
  { id: "hero", title: "Hero copy pass", line: "Three headline options shipped to preview", state: "done", group: "projects", parent: "relaunch", pr: { number: 22, state: "merged" }, owner: "Tsetseg" },
  { id: "pricing", title: "Pricing table component", line: "Wiring plan toggles to the price data", state: "running", group: "projects", parent: "relaunch", owner: "Bat" },
  { id: "promote", title: "Promote preview to prod", line: "Needs your OK before the deploy goes live", state: "waiting", group: "projects", parent: "relaunch", pr: { number: 23, state: "draft" }, owner: "Anu" },
  { id: "brand", title: "Brand refresh", line: "Moodboard parked until the copy settles", state: "idle", group: "projects" },
  { id: "triage", title: "Inbox triage", line: "14 notes filed, 3 tasks created", state: "done", group: "areas" },
  { id: "weekly", title: "Weekly review", line: "Draft ready; 2 decisions wait for you", state: "waiting", group: "areas", owner: "Anu" },
  { id: "glossary", title: "Glossary sync", line: "Merging 6 duplicate atoms", state: "running", group: "resources", owner: "Tsetseg", sharedWith: ["Anu"] },
  { id: "bills", title: "Monthly bills check", line: "All 9 payments recorded", state: "done", group: "finance" },
  { id: "tokens", title: "Token audit", line: "Scratch notes, no owner yet", state: "idle" },
];

/** Demo data as plain JSON props (used by the catalog's data editor and chat export). */
export const sessionBoardDemo = { project: demoProject, groups: defaultSessionGroups, sessions: demoSessions, me: "Anu" };

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Shows the final number in static markup (chat export); counts up from 0 once mounted. */
function useCountUp(target: number, delay: number) {
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
    const tick = (t: number) => {
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

function Stat({ value, label, index }: { value: number; label: string; index: number }) {
  const shown = useCountUp(value, index * 90);
  return (
    <div className="sb-stat">
      <dt>{label}</dt>
      <dd>
        <span aria-hidden="true" data-cw-count={value} data-cw-delay={index * 90}>
          {shown}
        </span>
        <span className="sb-sr">{value}</span>
      </dd>
    </div>
  );
}

function LinkIcon({ kind = "link" }: { kind?: SessionBoardLink["kind"] }) {
  const p =
    kind === "repo" ? (
      <path d="m6 5-3 3 3 3m4-6 3 3-3 3" />
    ) : kind === "prod" ? (
      <>
        <circle cx="8" cy="8" r="5.5" />
        <path d="M2.5 8h11M8 2.5c-2.2 2.6-2.2 8.4 0 11m0-11c2.2 2.6 2.2 8.4 0 11" />
      </>
    ) : kind === "figma" ? (
      <>
        <rect x="3" y="3" width="10" height="10" rx="2" />
        <path d="M3 6.5h10M6.5 6.5V13" />
      </>
    ) : (
      <path d="M7 9.5 9.5 7m-4 .5-1 1a2.1 2.1 0 0 0 3 3l1-1m1-4 1-1a2.1 2.1 0 0 0-3-3l-1 1" />
    );
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      {p}
    </svg>
  );
}

type Row = { s: SessionBoardSession; depth: number; kids: number };

/** Orders sessions so each child follows its parent; skips children of folded parents. */
function orderRows(list: SessionBoardSession[], folded: Record<string, boolean> = {}): Row[] {
  const ids = new Set(list.map((s) => s.id));
  const kids = new Map<string, SessionBoardSession[]>();
  for (const s of list)
    if (s.parent && ids.has(s.parent) && s.parent !== s.id) kids.set(s.parent, [...(kids.get(s.parent) ?? []), s]);
  const out: Row[] = [];
  const seen = new Set<string>();
  const walk = (s: SessionBoardSession, depth: number, show: boolean) => {
    if (seen.has(s.id)) return;
    seen.add(s.id);
    const ch = kids.get(s.id) ?? [];
    if (show) out.push({ s, depth, kids: ch.length });
    for (const c of ch) walk(c, Math.min(depth + 1, 3), show && !folded[s.id]);
  };
  for (const s of list) if (!s.parent || !ids.has(s.parent)) walk(s, 0, true);
  for (const s of list) walk(s, 0, true); // parent cycles
  return out;
}

const prOf = (pr: SessionBoardSession["pr"]) =>
  pr == null ? null : typeof pr === "number" ? { number: pr, state: "open" as SessionPrState } : { number: pr.number, state: pr.state ?? "open" };

const STATES: SessionState[] = ["running", "waiting", "done", "idle"];
const VIEWS: SessionBoardView[] = ["groups", "status", "cards"];

/** Segmented control in the Studio SegmentedControl look: radios for a choice, tabs for panels. */
function Seg<T extends string>({
  kind,
  label,
  value,
  options,
  onChange,
  panelId,
}: {
  kind: "radio" | "tab";
  label: string;
  value: T;
  options: { value: T; label: string; count?: number }[];
  onChange: (v: T) => void;
  panelId?: string;
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const at = Math.max(0, options.findIndex((o) => o.value === value));
  const go = (i: number) => {
    const n = (i + options.length) % options.length;
    onChange(options[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div
      className="sb-seg"
      role={kind === "tab" ? "tablist" : "radiogroup"}
      aria-label={label}
      onKeyDown={(e) => {
        const k = e.key;
        if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); go(at + 1); }
        if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); go(at - 1); }
        if (k === "Home") { e.preventDefault(); go(0); }
        if (k === "End") { e.preventDefault(); go(-1); }
      }}
    >
      {options.map((o, i) => {
        const on = i === at;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role={kind}
            aria-checked={kind === "radio" ? on : undefined}
            aria-selected={kind === "tab" ? on : undefined}
            aria-controls={kind === "tab" ? panelId : undefined}
            tabIndex={on ? 0 : -1}
            className="sb-seg-opt"
            data-active={on || undefined}
            onClick={() => onChange(o.value)}
          >
            {o.label}
            {o.count != null && <span className="sb-seg-count">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function SessionBoard({
  project = demoProject,
  groups = defaultSessionGroups,
  sessions: sessionsIn = demoSessions,
  me = sessionsIn === demoSessions ? sessionBoardDemo.me : undefined,
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
  className = "",
}: SessionBoardProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const sessions: SessionBoardSession[] = sessionsIn.map((s) => ({ ...s, state: s.state ?? toSessionState(s.status) }));
  const [scopeOwn, setScopeOwn] = React.useState<"all" | "mine">(defaultScope);
  const scope = me ? (scopeProp ?? scopeOwn) : "all";
  const other = (s: SessionBoardSession) => (me && s.owner !== me && !(s.sharedWith ?? []).includes(me) ? "" : undefined);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const [folded, setFolded] = React.useState<Record<string, boolean>>({});
  const [selectedOwn, setSelectedOwn] = React.useState<string | null>(null);
  const selected = selectedProp !== undefined ? selectedProp : selectedOwn;
  const [viewOwn, setViewOwn] = React.useState<SessionBoardView>(defaultView);
  const view = viewProp ?? viewOwn;
  const setView = (v: SessionBoardView) => {
    setViewOwn(v);
    onViewChange?.(v);
  };
  const [tab, setTab] = React.useState<SessionState>(() => STATES.find((st) => sessions.some((s) => s.state === st)) ?? "running");

  const known = new Set(groups.map((g) => g.id));
  const byId = new Map(sessions.map((s) => [s.id, s]));
  const groupLabel = (s: SessionBoardSession) => groups.find((g) => g.id === s.group)?.label ?? L.ungrouped;
  const buckets = [
    ...groups.map((g) => ({ ...g, list: sessions.filter((s) => s.group === g.id) })),
    { id: UNGROUPED, label: L.ungrouped, defaultCollapsed: false, list: sessions.filter((s) => !s.group || !known.has(s.group)) },
  ].filter((g) => g.id !== UNGROUPED || g.list.length > 0);

  const stats = project.stats ?? {};
  const statList = [
    { key: "tasks", label: L.tasks, value: stats.tasks },
    { key: "decisions", label: L.decisions, value: stats.decisions },
    { key: "pages", label: L.pages, value: stats.pages },
    { key: "prs", label: L.prs, value: stats.prs },
  ].filter((x): x is { key: string; label: string; value: number } => typeof x.value === "number");

  const moveFocus = (from: HTMLElement, step: number | "first" | "last") => {
    const all = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-sb-nav]") ?? []).filter(
      (b) => !b.closest("[inert]"),
    );
    if (!all.length) return;
    const i = all.indexOf(from as HTMLButtonElement);
    const next = step === "first" ? 0 : step === "last" ? all.length - 1 : Math.min(all.length - 1, Math.max(0, i + step));
    all[next]?.focus();
  };
  const navKeys = (e: React.KeyboardEvent<HTMLButtonElement>, s?: SessionBoardSession, kids = 0) => {
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
  const open = (s: SessionBoardSession) => {
    setSelectedOwn(s.id);
    onSessionClick?.(s);
  };

  const tags = (s: SessionBoardSession, group?: boolean) => {
    const pr = prOf(s.pr);
    return (
      <span className="sb-tags">
        {group && <span className="sb-tag sb-grp">{groupLabel(s)}</span>}
        {pr && (
          <span className={`sb-tag sb-pr-${pr.state}`}>
            <span aria-hidden="true">#{pr.number}</span>
            <span className="sb-sr">
              {L.pr} {pr.number}, {L[pr.state]}
            </span>
          </span>
        )}
        {s.owner && (
          <span className="sb-who" title={s.sharedWith?.length ? `${s.owner} ${L.sharedWith} ${s.sharedWith.join(", ")}` : s.owner}>
            <span aria-hidden="true">
              {s.owner.trim().split(/\s+/).map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase()}
            </span>
            {s.sharedWith?.length ? <span className="sb-who-more" aria-hidden="true">+{s.sharedWith.length}</span> : null}
            <span className="sb-sr">
              {s.owner}
              {s.sharedWith?.length ? ` ${L.sharedWith} ${s.sharedWith.join(", ")}` : ""}
            </span>
          </span>
        )}
        <span className="sb-tag sb-st">{L[s.state]}</span>
      </span>
    );
  };

  let order = 0;
  const renderRows = (rows: Row[], opts: { crumbs?: boolean } = {}) => (
    <ul className="sb-list">
      {rows.map(({ s, depth, kids }) => {
        const i = order++;
        const isFolded = !!folded[s.id];
        const parent = opts.crumbs && !depth && s.parent ? byId.get(s.parent) : undefined;
        return (
          <li
            key={s.id}
            className={`sb-row is-${s.state}${depth ? " is-child" : ""}${kids ? " is-parent" : ""}`}
            data-cw-other={other(s)}
            style={{ "--i": i, "--d": depth } as React.CSSProperties}
          >
            {kids > 0 ? (
              <button
                type="button"
                className="sb-fold"
                aria-expanded={!isFolded}
                aria-label={`${isFolded ? L.expandKids : L.collapseKids}: ${s.title} (${kids})`}
                onClick={() => setFolded((f) => ({ ...f, [s.id]: !isFolded }))}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <span className="sb-fold-gap" aria-hidden="true" />
            )}
            <button
              type="button"
              className="sb-row-btn"
              data-sb-nav=""
              aria-current={selected === s.id ? "true" : undefined}
              aria-expanded={kids ? !isFolded : undefined}
              onClick={() => open(s)}
              onKeyDown={(e) => navKeys(e, s, kids)}
            >
              <span className="sb-dot" data-s={s.state} aria-hidden="true" />
              <span className="sb-text">
                <span className="sb-title">
                  {s.title}
                  {kids > 0 && isFolded && <span className="sb-kids">+{kids}</span>}
                </span>
                {(s.line || parent) && (
                  <span className="sb-line">
                    {parent && (
                      <span className="sb-crumb">
                        {L.inParent} {parent.title}
                        {s.line ? " · " : ""}
                      </span>
                    )}
                    {s.line}
                  </span>
                )}
              </span>
              {tags(s)}
              {s.state === "running" && <span className="sb-run" aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const icon = project.icon ?? project.name.trim().charAt(0).toUpperCase();
  const shownViews = views.filter((v) => VIEWS.includes(v));
  const viewLabel: Record<SessionBoardView, string> = { groups: L.groupsView, status: L.statusView, cards: L.cardsView };
  const panelId = `${uid}-panel`;

  return (
    <div ref={rootRef} className={`sb ${className}`} data-cw-root="session-board" data-scope={scope}>
      <style>{css}</style>
      <section className="sb-head" aria-labelledby={`${uid}-name`}>
        <div className="sb-id">
          <span className="sb-icon" aria-hidden="true">
            {icon}
          </span>
          <div className="sb-titles">
            <h2 id={`${uid}-name`} className="sb-name">
              {project.name}
            </h2>
            {project.owner && (
              <p className="sb-owner">
                {L.owner} · {project.owner}
              </p>
            )}
          </div>
          {project.status && <span className={`sb-status sb-tone-${project.status.tone ?? "gray"}`}>{project.status.label}</span>}
        </div>
        {statList.length > 0 && (
          <dl className="sb-stats">
            {statList.map((x, i) => (
              <Stat key={x.key} value={x.value} label={x.label} index={i} />
            ))}
          </dl>
        )}
        {project.links && project.links.length > 0 && (
          <ul className="sb-links" aria-label={L.links}>
            {project.links.map((l) => (
              <li key={l.href + l.label}>
                <a className="sb-chip" href={l.href} target="_blank" rel="noreferrer noopener">
                  <LinkIcon kind={l.kind} />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(shownViews.length > 1 || !!me) && (
        <div className="sb-bar">
          {shownViews.length > 1 && (
            <Seg<SessionBoardView>
              kind="radio"
              label={L.view}
              value={view}
              options={shownViews.map((v) => ({ value: v, label: viewLabel[v] }))}
              onChange={setView}
            />
          )}
          {me && (
            <div className="sb-seg sb-scope" role="group" aria-label={L.scope}>
              {(["all", "mine"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={scope === v}
                  className="sb-seg-opt"
                  data-active={scope === v || undefined}
                  data-cw-scope-btn={v}
                  onClick={() => {
                    setScopeOwn(v);
                    onScopeChange?.(v);
                  }}
                >
                  {v === "all" ? L.all : L.mine}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "groups" && (
        <div className="sb-groups sb-view" key="groups">
          {buckets.map((g) => {
            const isCollapsed = collapsed[g.id] ?? !!g.defaultCollapsed;
            const rows = orderRows(g.list, folded);
            const bodyId = `${uid}-${g.id}`;
            const live = g.list.filter((s) => s.state === "running").length;
            return (
              <section key={g.id} className={`sb-group${isCollapsed ? " is-collapsed" : ""}`} aria-labelledby={`${bodyId}-h`} data-cw-scope="" data-cw-other={me && g.list.every((x) => other(x) !== undefined) ? "" : undefined}>
                <h3 className="sb-gh">
                  <button
                    id={`${bodyId}-h`}
                    type="button"
                    className="sb-gbtn"
                    aria-expanded={!isCollapsed}
                    aria-controls={bodyId}
                    data-cw-toggle="is-collapsed"
                    onClick={() => setCollapsed((c) => ({ ...c, [g.id]: !isCollapsed }))}
                  >
                    <svg className="sb-chev" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="sb-glabel">{g.label}</span>
                    {live > 0 && <i className="sb-glive" aria-hidden="true" />}
                    <span className="sb-gcount">
                      <span aria-hidden="true">{g.list.length}</span>
                      <span className="sb-sr">
                        , {g.list.length} {g.list.length === 1 ? L.session : L.sessions}
                      </span>
                    </span>
                  </button>
                </h3>
                <div id={bodyId} className="sb-body" inert={isCollapsed || undefined}>
                  <div className="sb-clip">{rows.length === 0 ? <p className="sb-empty">{L.empty}</p> : renderRows(rows)}</div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {view === "status" && (
        <div className="sb-group sb-view sb-status-view" key="status">
          <div className="sb-tabs">
            <Seg<SessionState>
              kind="tab"
              label={L.statusView}
              value={tab}
              panelId={panelId}
              options={STATES.map((st) => ({ value: st, label: L[st], count: sessions.filter((s) => s.state === st).length }))}
              onChange={setTab}
            />
          </div>
          <div id={panelId} role="tabpanel" aria-label={L[tab]} className="sb-panel" key={tab}>
            {(() => {
              const list = sessions.filter((s) => s.state === tab);
              return list.length === 0 ? (
                <p className="sb-empty">{L.empty}</p>
              ) : (
                renderRows(orderRows(list, folded), { crumbs: true })
              );
            })()}
          </div>
        </div>
      )}

      {view === "cards" && (
        <ul className="sb-cards sb-view" key="cards">
          {orderRows(sessions)
            .filter((r) => r.depth === 0)
            .map(({ s, kids }) => {
              const i = order++;
              const children = sessions.filter((c) => c.parent === s.id && c.id !== s.id);
              const isFolded = !!folded[s.id];
              const listId = `${uid}-kids-${s.id}`;
              return (
                <li key={s.id} className={`sb-card is-${s.state}`} style={{ "--i": i } as React.CSSProperties} data-cw-other={other(s)}>
                  <button
                    type="button"
                    className="sb-card-btn"
                    data-sb-nav=""
                    aria-current={selected === s.id ? "true" : undefined}
                    onClick={() => open(s)}
                    onKeyDown={(e) => navKeys(e, s, kids)}
                  >
                    <span className="sb-card-top">
                      <span className="sb-dot" data-s={s.state} aria-hidden="true" />
                      <span className="sb-title">{s.title}</span>
                    </span>
                    {s.line && <span className="sb-line">{s.line}</span>}
                    {tags(s, true)}
                    {s.state === "running" && <span className="sb-run" aria-hidden="true" />}
                  </button>
                  {children.length > 0 && (
                    <div className="sb-card-kids">
                      <button
                        type="button"
                        className="sb-kids-btn"
                        aria-expanded={!isFolded}
                        aria-controls={listId}
                        onClick={() => setFolded((f) => ({ ...f, [s.id]: !isFolded }))}
                      >
                        <svg className="sb-chev" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {children.length} {children.length === 1 ? L.subItem : L.subItems}
                      </button>
                      <div id={listId} className={`sb-body${isFolded ? " is-folded" : ""}`} inert={isFolded || undefined}>
                        <div className="sb-clip">
                          <ul className="sb-mini">
                            {children.map((c) => (
                              <li key={c.id} className={`is-${c.state}`}>
                                <button type="button" className="sb-mini-btn" data-sb-nav="" aria-current={selected === c.id ? "true" : undefined} onClick={() => open(c)} onKeyDown={(e) => navKeys(e)}>
                                  <span className="sb-dot" data-s={c.state} aria-hidden="true" />
                                  <span className="sb-title">{c.title}</span>
                                  <span className="sb-sr">, {L[c.state]}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

const css = `
.sb{--sb-bg:#fff;--sb-fg:#18181b;--sb-muted:#71717a;--sb-faint:#a1a1aa;--sb-line:#ececef;--sb-soft:#f4f4f5;--sb-soft-2:#f1f1f3;--sb-accent:#4f7cf0;--sb-accent-soft:#e8f1fe;--sb-green:#16a34a;--sb-green-soft:#e9f8ee;--sb-amber:#c2620a;--sb-amber-soft:#fff4e0;--sb-red:#dc2626;--sb-red-soft:#fdecec;--sb-violet:#7c3aed;--sb-violet-soft:#f1ebfd;--sb-seg-on:#fff;--sb-ink:color-mix(in srgb,var(--sb-fg) 35%,transparent);position:relative;width:100%;max-width:640px;display:flex;flex-direction:column;gap:12px;color:var(--sb-fg);font:400 14px/1.4 Inter,system-ui,sans-serif;container:sb/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .sb{--sb-bg:#1b1b1e;--sb-fg:#ececef;--sb-muted:#a1a1aa;--sb-faint:#71717a;--sb-line:#2e2e33;--sb-soft:#26262a;--sb-soft-2:#2a2a2f;--sb-accent:#7c9cff;--sb-accent-soft:#1b2a44;--sb-green:#4ade80;--sb-green-soft:#16301f;--sb-amber:#eba659;--sb-amber-soft:#3a2a12;--sb-red:#f87171;--sb-red-soft:#3a1d1f;--sb-violet:#a78bfa;--sb-violet-soft:#2a2140;--sb-seg-on:#3a3a40;color-scheme:dark}
.sb *{box-sizing:border-box}:where(.sb) button{font:inherit;color:inherit;cursor:pointer}
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

export default SessionBoard;
