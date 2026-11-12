"use client";

import * as React from "react";

/**
 * Session Board — one project's agent sessions, PRs and deploys at a glance.
 * A header card (icon, name, status, owner, four counters that count up, link
 * chips) over collapsible groups (Projects / Areas / Resources / Finance /
 * ungrouped). Each session row has a state dot (running pulses), title, one
 * line, PR and state tags, and a running line under live sessions; child
 * sessions sit indented under their parent.
 * Original Component Studio component. Colours follow tokens/tokens.json
 * (bg, surface/2, border/default, text/*, accent/*, status/*).
 * Motion: rows arrive one after another, groups fold smoothly, counters count
 * up; all of it is off under prefers-reduced-motion.
 */

export type SessionState = "running" | "waiting" | "done" | "idle";
export type SessionPrState = "open" | "draft" | "merged" | "closed";
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
};

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
};

export type SessionBoardProps = {
  project?: SessionBoardProject;
  groups?: SessionBoardGroup[];
  sessions?: SessionBoardSession[];
  onSessionClick?: (session: SessionBoardSession) => void;
  /** Controlled selection (highlighted row); defaults to the last clicked row. */
  selectedId?: string | null;
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
  { id: "relaunch", title: "Website relaunch", line: "Rebuilding the pricing page on the new grid", state: "running", group: "projects", pr: { number: 21, state: "open" } },
  { id: "hero", title: "Hero copy pass", line: "Three headline options shipped to preview", state: "done", group: "projects", parent: "relaunch", pr: { number: 22, state: "merged" } },
  { id: "pricing", title: "Pricing table component", line: "Wiring plan toggles to the price data", state: "running", group: "projects", parent: "relaunch" },
  { id: "promote", title: "Promote preview to prod", line: "Needs your OK before the deploy goes live", state: "waiting", group: "projects", parent: "relaunch", pr: { number: 23, state: "draft" } },
  { id: "brand", title: "Brand refresh", line: "Moodboard parked until the copy settles", state: "idle", group: "projects" },
  { id: "triage", title: "Inbox triage", line: "14 notes filed, 3 tasks created", state: "done", group: "areas" },
  { id: "weekly", title: "Weekly review", line: "Draft ready; 2 decisions wait for you", state: "waiting", group: "areas" },
  { id: "glossary", title: "Glossary sync", line: "Merging 6 duplicate atoms", state: "running", group: "resources" },
  { id: "bills", title: "Monthly bills check", line: "All 9 payments recorded", state: "done", group: "finance" },
  { id: "tokens", title: "Token audit", line: "Scratch notes, no owner yet", state: "idle" },
];

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function useCountUp(target: number, delay: number) {
  const [value, setValue] = React.useState(0);
  const shown = React.useRef(0);
  React.useEffect(() => {
    if (reducedMotion() || typeof requestAnimationFrame === "undefined") {
      shown.current = target;
      setValue(target);
      return;
    }
    const from = shown.current;
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
        <span aria-hidden="true">{shown}</span>
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

type Row = { s: SessionBoardSession; depth: number; hasKids: boolean };

/** Orders a group's sessions so each child follows its parent. */
function orderRows(list: SessionBoardSession[]): Row[] {
  const ids = new Set(list.map((s) => s.id));
  const kids = new Map<string, SessionBoardSession[]>();
  for (const s of list)
    if (s.parent && ids.has(s.parent) && s.parent !== s.id) kids.set(s.parent, [...(kids.get(s.parent) ?? []), s]);
  const out: Row[] = [];
  const seen = new Set<string>();
  const walk = (s: SessionBoardSession, depth: number) => {
    if (seen.has(s.id)) return;
    seen.add(s.id);
    const ch = kids.get(s.id) ?? [];
    out.push({ s, depth, hasKids: ch.length > 0 });
    for (const c of ch) walk(c, Math.min(depth + 1, 3));
  };
  for (const s of list) if (!s.parent || !ids.has(s.parent)) walk(s, 0);
  for (const s of list) walk(s, 0); // parent cycles
  return out;
}

const prOf = (pr: SessionBoardSession["pr"]) =>
  pr == null ? null : typeof pr === "number" ? { number: pr, state: "open" as SessionPrState } : { number: pr.number, state: pr.state ?? "open" };

export function SessionBoard({
  project = demoProject,
  groups = defaultSessionGroups,
  sessions = demoSessions,
  onSessionClick,
  selectedId: selectedProp,
  labels: labelsProp,
  className = "",
}: SessionBoardProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});
  const [selectedOwn, setSelectedOwn] = React.useState<string | null>(null);
  const selected = selectedProp !== undefined ? selectedProp : selectedOwn;

  const known = new Set(groups.map((g) => g.id));
  const buckets = [
    ...groups.map((g) => ({ ...g, list: sessions.filter((s) => s.group === g.id) })),
    { id: UNGROUPED, label: L.ungrouped, defaultCollapsed: false, list: sessions.filter((s) => !s.group || !known.has(s.group)) },
  ].filter((g) => g.id !== UNGROUPED || g.list.length > 0);

  const stateLabel = (s: SessionState) => L[s];
  const stats = project.stats ?? {};
  const statList = [
    { key: "tasks", label: L.tasks, value: stats.tasks },
    { key: "decisions", label: L.decisions, value: stats.decisions },
    { key: "pages", label: L.pages, value: stats.pages },
    { key: "prs", label: L.prs, value: stats.prs },
  ].filter((x): x is { key: string; label: string; value: number } => typeof x.value === "number");

  const moveFocus = (from: HTMLElement, step: number | "first" | "last") => {
    const all = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>(".sb-row-btn") ?? []).filter(
      (b) => !b.closest("[inert]"),
    );
    if (!all.length) return;
    const i = all.indexOf(from as HTMLButtonElement);
    const next = step === "first" ? 0 : step === "last" ? all.length - 1 : Math.min(all.length - 1, Math.max(0, i + step));
    all[next]?.focus();
  };

  let order = 0;
  const icon = project.icon ?? project.name.trim().charAt(0).toUpperCase();

  return (
    <div ref={rootRef} className={`sb ${className}`}>
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

      <div className="sb-groups">
        {buckets.map((g) => {
          const isCollapsed = collapsed[g.id] ?? !!g.defaultCollapsed;
          const rows = orderRows(g.list);
          const bodyId = `${uid}-${g.id}`;
          const live = g.list.filter((s) => s.state === "running").length;
          return (
            <section key={g.id} className={`sb-group${isCollapsed ? " is-collapsed" : ""}`} aria-labelledby={`${bodyId}-h`}>
              <h3 className="sb-gh">
                <button
                  id={`${bodyId}-h`}
                  type="button"
                  className="sb-gbtn"
                  aria-expanded={!isCollapsed}
                  aria-controls={bodyId}
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
                <div className="sb-clip">
                  {rows.length === 0 ? (
                    <p className="sb-empty">{L.empty}</p>
                  ) : (
                    <ul className="sb-list">
                      {rows.map(({ s, depth, hasKids }) => {
                        const pr = prOf(s.pr);
                        const i = order++;
                        return (
                          <li
                            key={s.id}
                            className={`sb-row is-${s.state}${depth ? " is-child" : ""}${hasKids ? " is-parent" : ""}`}
                            style={{ "--i": i, "--d": depth } as React.CSSProperties}
                          >
                            <button
                              type="button"
                              className="sb-row-btn"
                              aria-current={selected === s.id ? "true" : undefined}
                              onClick={() => {
                                setSelectedOwn(s.id);
                                onSessionClick?.(s);
                              }}
                              onKeyDown={(e) => {
                                const k = e.key;
                                if (k === "ArrowDown" || k === "ArrowUp" || k === "Home" || k === "End") {
                                  e.preventDefault();
                                  moveFocus(e.currentTarget, k === "ArrowDown" ? 1 : k === "ArrowUp" ? -1 : k === "Home" ? "first" : "last");
                                }
                              }}
                            >
                              <span className="sb-dot" aria-hidden="true" />
                              <span className="sb-text">
                                <span className="sb-title">{s.title}</span>
                                {s.line && <span className="sb-line">{s.line}</span>}
                              </span>
                              <span className="sb-tags">
                                {pr && (
                                  <span className={`sb-tag sb-pr-${pr.state}`}>
                                    <span aria-hidden="true">#{pr.number}</span>
                                    <span className="sb-sr">
                                      {L.pr} {pr.number}, {L[pr.state]}
                                    </span>
                                  </span>
                                )}
                                <span className="sb-tag sb-st">{stateLabel(s.state)}</span>
                              </span>
                              {s.state === "running" && <span className="sb-run" aria-hidden="true" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const css = `
.sb{--sb-bg:#fff;--sb-fg:#18181b;--sb-muted:#71717a;--sb-faint:#a1a1aa;--sb-line:#ececef;--sb-soft:#f4f4f5;--sb-soft-2:#f1f1f3;--sb-accent:#4f7cf0;--sb-accent-soft:#e8f1fe;--sb-green:#16a34a;--sb-green-soft:#e9f8ee;--sb-amber:#c2620a;--sb-amber-soft:#fff4e0;--sb-red:#dc2626;--sb-red-soft:#fdecec;--sb-violet:#7c3aed;--sb-violet-soft:#f1ebfd;--sb-ink:color-mix(in srgb,var(--sb-fg) 35%,transparent);position:relative;width:100%;max-width:640px;display:flex;flex-direction:column;gap:12px;color:var(--sb-fg);font:400 14px/1.4 Inter,system-ui,sans-serif;container:sb/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .sb{--sb-bg:#1b1b1e;--sb-fg:#ececef;--sb-muted:#a1a1aa;--sb-faint:#71717a;--sb-line:#2e2e33;--sb-soft:#26262a;--sb-soft-2:#2a2a2f;--sb-accent:#7c9cff;--sb-accent-soft:#1b2a44;--sb-green:#4ade80;--sb-green-soft:#16301f;--sb-amber:#eba659;--sb-amber-soft:#3a2a12;--sb-red:#f87171;--sb-red-soft:#3a1d1f;--sb-violet:#a78bfa;--sb-violet-soft:#2a2140;color-scheme:dark}
.sb *{box-sizing:border-box}.sb button{font:inherit;color:inherit;cursor:pointer}
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
.sb-row{position:relative;margin-top:4px;animation:sb-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 45ms + 120ms)}
.sb-row.is-child::before{content:"";position:absolute;left:calc(var(--d) * 18px + 1px);top:-4px;bottom:0;width:1px;background:var(--sb-line)}
.sb-row-btn{position:relative;display:flex;align-items:center;gap:10px;width:100%;min-height:44px;padding:7px 8px 7px calc(10px + var(--d,0) * 18px);border:0;border-radius:8px;background:none;text-align:left;overflow:hidden;transition:background .15s}
.sb-row-btn:hover{background:var(--sb-soft)}
.sb-row-btn[aria-current=true]{background:var(--sb-accent-soft)}
.sb-dot{position:relative;flex:none;width:8px;height:8px;border-radius:50%;background:var(--sb-faint)}
.is-running .sb-dot{background:var(--sb-accent)}
.is-running .sb-dot::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px solid var(--sb-accent);opacity:0;animation:sb-pulse 1.6s ease-out infinite}
.is-waiting .sb-dot{background:var(--sb-amber)}
.is-done .sb-dot{background:var(--sb-green)}
.is-idle .sb-dot{background:none;border:1.5px solid var(--sb-faint)}
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
.sb-run{position:absolute;left:calc(28px + var(--d,0) * 18px);right:10px;bottom:3px;height:2px;border-radius:2px;background:color-mix(in srgb,var(--sb-accent) 16%,transparent);overflow:hidden}
.sb-run::after{content:"";position:absolute;top:0;bottom:0;left:0;width:34%;border-radius:2px;background:var(--sb-accent);animation:sb-run 1.8s cubic-bezier(.45,0,.35,1) infinite}
.sb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sb :focus-visible{outline:2px solid var(--sb-accent);outline-offset:-2px}
.sb-chip:focus-visible{outline-offset:1px}
@keyframes sb-in{from{opacity:0;transform:translateY(6px)}}
@keyframes sb-pulse{0%{opacity:.7;transform:scale(.6)}100%{opacity:0;transform:scale(1.5)}}
@keyframes sb-run{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
@container sb (max-width:480px){.sb-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.is-done .sb-st,.is-idle .sb-st{position:absolute;width:1px;height:1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
@container sb (max-width:380px){.sb-line{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}}
@media(prefers-reduced-motion:reduce){.sb *,.sb{animation:none!important;transition:none!important}.sb-run::after{width:100%;opacity:.55}}
`;

export default SessionBoard;
