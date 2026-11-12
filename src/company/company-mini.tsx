import * as React from "react";
import { Empty, ProgressNM, TypeBadge, parseDay } from "./collection";
import { Icon, type IconName } from "./icons";
import { TaskRow, gtdOf } from "./methodology";
import { actorOf, type Company, type CompanyTask } from "./types";
import { Avatar } from "./ui";

/**
 * CompanyView at preview density (2026-11-13: the home-page hero board
 * was «too crowded, make it small»). One header line, up to 3 small tabs, a
 * 3-tile stat row and 3–4 task rows, ~360 px tall, 12–13 px text. Fully
 * interactive like any catalog component: every tab clicks. A story walks the
 * tabs and moves one task through GTD; it pauses while someone is using it,
 * comes back after a quiet spell, and ⏸ / ↺ control it.
 */

export type CompanyMiniLabels = {
  overview: string;
  projects: string;
  agents: string;
  statProjects: string;
  statActive: string;
  statWaiting: string;
  noTasks: string;
  noProjects: string;
  noAgents: string;
  updated: string;
  pause: string;
  play: string;
  replay: string;
  tabs: string;
};
export const companyMiniLabelsMn: CompanyMiniLabels = {
  overview: "Тойм",
  projects: "Төсөл",
  agents: "Агент",
  statProjects: "Төсөл",
  statActive: "Хийж байна",
  statWaiting: "Таны ээлж",
  noTasks: "Даалгавар алга",
  noProjects: "Төсөл алга",
  noAgents: "Агент алга",
  updated: "Шинэчлэгдсэн",
  pause: "Түр зогсоох",
  play: "Үргэлжлүүлэх",
  replay: "Дахин тоглуулах",
  tabs: "Харагдац",
};

type Tab = "overview" | "projects" | "agents";
const TABS: { key: Tab; icon: IconName }[] = [
  { key: "overview", icon: "layout-dashboard" },
  { key: "projects", icon: "folder" },
  { key: "agents", icon: "bot" },
];

/** The story: tab to show and the GTD state of the moving task. */
const STORY: { tab: Tab; status: string; hold: number }[] = [
  { tab: "overview", status: "next-action", hold: 2200 },
  { tab: "overview", status: "in-progress", hold: 2400 },
  { tab: "projects", status: "in-progress", hold: 2600 },
  { tab: "agents", status: "waiting", hold: 2600 },
  { tab: "overview", status: "waiting", hold: 2000 },
  { tab: "overview", status: "completed", hold: 2800 },
];
/** Quiet time after the last touch before the story resumes. */
const IDLE_MS = 8000;

/** Most telling tasks first: in progress, waiting, then the nearest due. */
function pickTasks(c: Company, n: number): { t: CompanyTask; key: string }[] {
  const rank = (t: CompanyTask) => {
    const g = gtdOf(t.status).tone;
    return g === "running" ? 0 : g === "needs-you" ? 1 : g === "idle" ? 2 : 3;
  };
  return c.projects
    .flatMap((p) => p.tasks.map((t) => ({ t, key: `${p.id}:${t.id}` })))
    .sort((a, b) => rank(a.t) - rank(b.t) || (parseDay(a.t.due) ?? Infinity) - (parseDay(b.t.due) ?? Infinity))
    .slice(0, n);
}

export function CompanyMini({
  company,
  today = new Date(),
  labels,
  story = true,
  badge,
}: {
  company: Company;
  /** One header badge (CompanyView passes the segment). */
  badge?: string;
  today?: Date;
  labels?: Partial<CompanyMiniLabels>;
  /** Play the built-in story (tabs + one task moving through GTD). */
  story?: boolean;
}) {
  const L = { ...companyMiniLabelsMn, ...labels };
  const uid = React.useId();
  const reduced = typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [step, setStep] = React.useState(0);
  const [tab, setTab] = React.useState<Tab>("overview");
  const [paused, setPaused] = React.useState(false); // ⏸ by hand
  const [busyUntil, setBusyUntil] = React.useState(0); // someone is using it
  const [, tick] = React.useState(0);
  const [cycles, setCycles] = React.useState(0);
  /** Scenario standard: 3 cycles, then it rests on the last state (↺ starts again). */
  const rested = cycles >= 3;
  const playing = story && !reduced && !paused && !rested && Date.now() >= busyUntil;

  // the story clock
  React.useEffect(() => {
    if (!playing) return;
    const last = step === STORY.length - 1;
    if (last && cycles >= 2) {
      const t = window.setTimeout(() => setCycles(3), STORY[step].hold);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      const next = last ? 0 : step + 1;
      if (last) setCycles((n) => n + 1);
      setStep(next);
      setTab(STORY[next].tab);
    }, STORY[step].hold + (last ? 4000 : 0));
    return () => window.clearTimeout(t);
  }, [playing, step, cycles]);
  // wake up after a quiet spell
  React.useEffect(() => {
    if (!busyUntil) return;
    const t = window.setTimeout(() => tick((n) => n + 1), Math.max(0, busyUntil - Date.now()) + 20);
    return () => window.clearTimeout(t);
  }, [busyUntil]);

  const touch = () => setBusyUntil(Date.now() + IDLE_MS);
  const pickTab = (k: Tab) => {
    touch();
    setTab(k);
  };
  const replay = () => {
    setPaused(false);
    setBusyUntil(0);
    setCycles(0);
    setStep(0);
    setTab(STORY[0].tab);
  };

  // the moving task: the first non-finished task of the first project
  const mover = company.projects[0]?.tasks.find((t) => !["completed", "done", "cancelled"].includes(t.status)) ?? null;
  const c: Company =
    story && mover && !reduced
      ? { ...company, projects: company.projects.map((p, i) => (i ? p : { ...p, tasks: p.tasks.map((t) => (t === mover ? { ...t, status: STORY[step].status } : t)) })) }
      : company;

  const tasks = c.projects.flatMap((p) => p.tasks);
  const active = tasks.filter((t) => gtdOf(t.status).tone === "running").length;
  const waiting = tasks.filter((t) => gtdOf(t.status).tone === "needs-you").length;
  const stats = [
    { k: L.statProjects, v: c.projects.length, icon: "folder" as IconName, tone: "" },
    { k: L.statActive, v: active, icon: "play" as IconName, tone: "is-running" },
    { k: L.statWaiting, v: waiting, icon: "hourglass" as IconName, tone: waiting ? "is-needs-you" : "" },
  ];
  const label = (k: Tab) => L[k];

  return (
    <div className="cv-mini" onPointerDown={touch} onKeyDown={touch} onWheel={touch}>
      <header className="cv-mini-h">
        <TypeBadge type="company" size={24} />
        <strong className="cv-mini-name">{company.name}</strong>
        {badge && <span className="cv-tag">{badge}</span>}
        {company.exportedAt && (
          <span className="cv-mini-asof" title={`${L.updated}: ${company.exportedAt.slice(0, 10)}`}>
            <Icon name="clock" size={12} />
            <time dateTime={company.exportedAt}>{company.exportedAt.slice(0, 10)}</time>
          </span>
        )}
        {story && !reduced && (
          <span className="cv-mini-ctl">
            <button type="button" aria-label={paused ? L.play : L.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
              <Icon name={paused ? "play" : "pause"} size={12} />
            </button>
            <button type="button" aria-label={L.replay} onClick={replay}>
              <Icon name="rotate-ccw" size={12} />
            </button>
          </span>
        )}
      </header>

      <div className="cv-mini-tabs" role="tablist" aria-label={L.tabs}>
        {TABS.map(({ key, icon }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`${uid}-${key}`}
            aria-selected={tab === key}
            aria-controls={`${uid}-panel`}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => pickTab(key)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const i = TABS.findIndex((x) => x.key === tab);
              const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length].key;
              pickTab(next);
              (e.currentTarget.parentElement?.querySelector(`#${CSS.escape(`${uid}-${next}`)}`) as HTMLElement | null)?.focus();
            }}
          >
            <Icon name={icon} size={14} />
            {label(key)}
          </button>
        ))}
      </div>

      <div className="cv-mini-panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${tab}`} key={tab}>
        {tab === "overview" && (
          <>
            <dl className="cv-mini-stats">
              {stats.map((s) => (
                <div key={s.k} className={`cv-mini-stat ${s.tone}`}>
                  <dt>
                    <Icon name={s.icon} size={12} />
                    {s.k}
                  </dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
            {tasks.length ? (
              <ul className="cv-tlist cv-mini-tasks">
                {pickTasks(c, 4).map(({ t, key }) => (
                  <TaskRow key={key} c={c} t={t} today={today} />
                ))}
              </ul>
            ) : (
              <Empty text={L.noTasks} icon="square-check" />
            )}
          </>
        )}
        {tab === "projects" &&
          (c.projects.length ? (
            <ul className="cv-mini-list">
              {c.projects.slice(0, 4).map((p) => {
                const done = p.tasks.filter((t) => gtdOf(t.status).tone === "done").length;
                const g = gtdOf(p.status);
                return (
                  <li key={p.id}>
                    <span className={`cl-pill cv-gtd is-${g.tone}`} title={g.label}>
                      <Icon name={g.icon} size={12} />
                    </span>
                    <span className="cv-mini-t">{p.name}</span>
                    {p.tasks.length > 0 && <ProgressNM value={`${done}/${p.tasks.length}`} />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty text={L.noProjects} icon="folder" />
          ))}
        {tab === "agents" &&
          (c.agents.length ? (
            <ul className="cv-mini-list">
              {c.agents.slice(0, 4).map((a) => {
                const owner = a.ownerId ? actorOf(c, a.ownerId) : null;
                const busy = tasks.find((t) => t.ownerId === a.id && gtdOf(t.status).tone === "running");
                return (
                  <li key={a.id}>
                    <Avatar actor={{ name: a.name, kind: "agent" }} size={20} />
                    <span className="cv-mini-t">
                      {a.name}
                      <small>{busy ? busy.title : a.role}</small>
                    </span>
                    {owner && (
                      <span className="cl-rel" title={owner.name}>
                        <Avatar actor={owner} size={16} />
                        <span>{owner.name}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty text={L.noAgents} icon="bot" />
          ))}
      </div>
    </div>
  );
}

export const companyMiniCss = `
.cv-mini{display:flex;flex-direction:column;gap:8px;min-height:340px;max-height:380px;padding:12px;border:1px solid var(--cv-line);border-radius:14px;background:var(--cv-bg);font-size:13px;line-height:1.35;overflow:hidden}
.cv-mini-h{display:flex;align-items:center;gap:8px;min-width:0}
.cv-mini-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:600}
.cv-mini-asof{display:inline-flex;align-items:center;gap:4px;margin-left:auto;color:var(--cv-muted);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}
.cv-mini-ctl{display:inline-flex;gap:2px}
.cv-mini-ctl button{display:grid;place-items:center;width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--cv-muted);cursor:pointer}
.cv-mini-ctl button:hover{background:var(--cv-soft);color:var(--cv-fg)}
.cv-mini-tabs{display:flex;gap:4px;padding:3px;border-radius:10px;background:var(--cv-soft)}
.cv-mini-tabs button{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;height:28px;border:0;border-radius:7px;background:transparent;color:var(--cv-muted);font:inherit;font-size:12px;font-weight:500;cursor:pointer;transition:background .2s,color .2s}
.cv-mini-tabs button[aria-selected=true]{background:var(--cv-bg);color:var(--cv-fg);box-shadow:0 1px 2px #0000001a}
.cv-mini-tabs button:focus-visible,.cv-mini-ctl button:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:1px}
.cv-mini-panel{display:flex;flex-direction:column;gap:8px;min-height:0;animation:cv-mini-in var(--ts-motion-dur-base,.32s) var(--ts-motion-ease-out,ease-out) both}
@keyframes cv-mini-in{from{opacity:0;transform:translateY(4px)}}
.cv-mini-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0}
.cv-mini-stat{display:flex;flex-direction:column-reverse;gap:2px;padding:7px 9px;border:1px solid var(--cv-line);border-radius:9px}
.cv-mini-stat dt{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--cv-muted)}
.cv-mini-stat dd{margin:0;font-size:18px;font-weight:600;font-variant-numeric:tabular-nums}
.cv-mini-stat.is-running dd{color:var(--ts-status-running-fg,#1d5fb8)}
.cv-mini-stat.is-needs-you dd{color:var(--ts-status-needs-you-fg,#a33e0b)}
:where(.dark,[data-theme=dark]) .cv-mini-stat.is-running dd{color:var(--ts-status-running-fg,#93c5fd)}
:where(.dark,[data-theme=dark]) .cv-mini-stat.is-needs-you dd{color:var(--ts-status-needs-you-fg,#f0a46a)}
.cv-mini-tasks{margin:0;padding:0;border:0;font-size:12.5px}
.cv-mini-tasks .cv-trow{min-height:26px;padding:1px 0}
.cv-mini-list{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.cv-mini-list li{display:flex;align-items:center;gap:8px;min-height:36px;padding:4px 6px;border-radius:8px}
.cv-mini-list li:hover{background:var(--cv-soft)}
.cv-mini-list .cv-gtd{padding-inline:5px}
.cv-mini-t{display:flex;flex-direction:column;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-mini-t small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--cv-muted);font-size:12px}
.cv-mini .cv-empty{padding:16px}
@media (prefers-reduced-motion:reduce){.cv-mini-panel{animation:none}}
.cv-mini-tasks .cv-trow{animation:cvmtrow .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.cv-mini-tasks .cv-trow:nth-child(1){animation-delay:200ms}.cv-mini-tasks .cv-trow:nth-child(2){animation-delay:310ms}.cv-mini-tasks .cv-trow:nth-child(3){animation-delay:420ms}.cv-mini-tasks .cv-trow:nth-child(4){animation-delay:530ms}.cv-mini-tasks .cv-trow:nth-child(5){animation-delay:640ms}.cv-mini-tasks .cv-trow:nth-child(6){animation-delay:750ms}.cv-mini-tasks .cv-trow:nth-child(7){animation-delay:860ms}.cv-mini-tasks .cv-trow:nth-child(8){animation-delay:970ms}@keyframes cvmtrow{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.cv-mini-tasks .cv-trow{animation:none}}
`;
