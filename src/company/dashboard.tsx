import * as React from "react";
import { SessionBoard, toSessionState, type SessionBoardInput } from "../library/session-board";
import { ProjectReport, toPhaseState, type ProjectReportPhase } from "../library/project-report";
import { actorOf, type Company, type CompanyProject, type CompanyTask } from "./types";
import { initials, phaseLabel, phaseTone } from "./ui";

/**
 * Dashboard — the company's projects and tasks grouped by area → sub-area,
 * like a Notion linked view of the vault: read-only, filter and group only.
 * Each area is a Session Board (sub-areas as groups, projects as parent rows,
 * tasks under them); a project row opens its Project Report beside it.
 */

export type DueFilter = "all" | "overdue" | "soon" | "none";
export type StatusFilter = "all" | "running" | "waiting" | "done" | "idle";

const NO_AREA = "__none";
const DAY = 86_400_000;

const sbLabels = {
  owner: "Эзэн",
  tasks: "Нээлттэй task",
  decisions: "Шийдвэр",
  pages: "Хуудас",
  prs: "PR",
  ungrouped: "Дэд area-гүй",
  sessions: "мөр",
  session: "мөр",
  empty: "Тохирох мөр алга",
  running: "Явж байна",
  waiting: "Хүлээж байна",
  done: "Дууссан",
  idle: "Эхлээгүй",
  view: "Харагдац",
  groupsView: "Дэд area",
  statusView: "Төлвөөр",
  cardsView: "Карт",
  subItem: "task",
  subItems: "task",
  collapseKids: "Task нуух",
  expandKids: "Task харуулах",
  inParent: "төсөл:",
};

const parse = (d?: string) => {
  if (!d) return null;
  const t = Date.parse(d.length === 10 ? `${d}T00:00:00` : d);
  return Number.isFinite(t) ? t : null;
};

export function dueBucket(due: string | undefined, done: boolean, today: Date): Exclude<DueFilter, "all"> | "later" {
  const t = parse(due);
  if (t == null) return "none";
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (t < start) return done ? "later" : "overdue";
  return t <= start + 14 * DAY ? "soon" : "later";
}

/** Read-only Project Report for one contract project (also used by the Projects tab). */
export function ProjectReportFor({ c, p, decisionsLabel = "Шийдвэр" }: { c: Company; p: CompanyProject; decisionsLabel?: string }) {
  const unit = c.units.find((u) => u.id === p.unitId);
  const states = p.tasks.map((t) => toPhaseState(t.status));
  const done = states.filter((s) => s === "done").length;
  const active = states.filter((s) => s === "active").length;
  const state = toPhaseState(p.status);
  const accountable = p.raci?.accountable ? actorOf(c, p.raci.accountable).name : undefined;
  const phases: ProjectReportPhase[] = p.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    due: t.due,
    owner: t.ownerId ? actorOf(c, t.ownerId).name : undefined,
    line: t.ownerId ? actorOf(c, t.ownerId).role : undefined,
  }));
  return (
    <ProjectReport
      project={{
        name: p.name,
        icon: initials(p.name).charAt(0),
        status: { label: phaseLabel[state], tone: phaseTone[state] },
        owner: accountable ?? unit?.name,
        updated: p.due,
        summary: [p.area, p.subArea].filter(Boolean).join(" › ") || unit?.name,
      }}
      kpis={[
        { label: "Task", value: p.tasks.length },
        { label: "Дууссан", value: done, tone: "green" },
        { label: "Явж байна", value: active, tone: "blue" },
        { label: decisionsLabel, value: p.decisions.length },
      ]}
      progress={{ value: p.tasks.length ? (done / p.tasks.length) * 100 : 0, label: "Явц" }}
      phases={phases}
      waiting={p.tasks
        .filter((t) => toPhaseState(t.status) === "blocked")
        .map((t) => ({ id: t.id, title: t.title, line: t.ownerId ? actorOf(c, t.ownerId).name : undefined, tone: "amber" as const }))}
      labels={{
        owner: "Хариуцагч",
        updated: "Хугацаа",
        progress: "Явц",
        phases: "Task",
        waiting: "Хүлээгдэж буй",
        nothingWaiting: "Хүлээгдэж буй зүйл алга.",
        view: "Харагдац",
        status: "Жагсаалт",
        cards: "Карт",
        done: "Дууссан",
        active: "Явж байна",
        blocked: "Хүлээгдэж байна",
        next: "Дараа",
        sharedWith: "Хамт",
      }}
    />
  );
}

export function Dashboard({ c, scoped, today = new Date(), empty }: { c: Company; scoped: Company; today?: Date; empty: string }) {
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [owner, setOwner] = React.useState("all");
  const [due, setDue] = React.useState<DueFilter>("all");
  const [pick, setPick] = React.useState<string | null>(null);
  const uid = React.useId();

  const taskDue = (p: CompanyProject, t: CompanyTask) => t.due ?? p.due;
  const isDone = (s: string) => toSessionState(s) === "done";
  const passes = (p: CompanyProject, t: CompanyTask) =>
    (status === "all" || toSessionState(t.status) === status) &&
    (owner === "all" || t.ownerId === owner) &&
    (due === "all" || dueBucket(taskDue(p, t), isDone(t.status), today) === due);
  const filtering = status !== "all" || owner !== "all" || due !== "all";

  const owners = Array.from(new Set(scoped.projects.flatMap((p) => p.tasks.map((t) => t.ownerId).filter(Boolean) as string[])))
    .map((id) => actorOf(c, id))
    .sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "person" ? -1 : 1));

  const allTasks = scoped.projects.flatMap((p) => p.tasks.map((t) => ({ p, t })));
  const summary = [
    { k: "Төсөл", v: scoped.projects.length },
    { k: "Нээлттэй task", v: allTasks.filter(({ t }) => !isDone(t.status)).length },
    { k: "Хугацаа хэтэрсэн", v: allTasks.filter(({ p, t }) => dueBucket(taskDue(p, t), isDone(t.status), today) === "overdue").length, tone: "amber" },
    { k: "14 хоногт", v: allTasks.filter(({ p, t }) => dueBucket(taskDue(p, t), isDone(t.status), today) === "soon").length },
  ];

  const areas = new Map<string, CompanyProject[]>();
  for (const p of scoped.projects) {
    const key = p.area?.trim() || NO_AREA;
    areas.set(key, [...(areas.get(key) ?? []), p]);
  }
  const picked = scoped.projects.find((p) => p.id === pick) ?? null;

  if (!scoped.projects.length) return <p className="cv-empty">{empty}</p>;

  return (
    <div className="cv-dash">
      <dl className="cv-stats cv-dash-stats">
        {summary.map((s, i) => (
          <div key={s.k} className={`cv-stat${s.tone ? ` is-${s.tone}` : ""}`} style={{ "--i": i } as React.CSSProperties}>
            <dt>{s.k}</dt>
            <dd>{s.v}</dd>
          </div>
        ))}
      </dl>
      <div className="cv-filters" role="group" aria-label="Шүүлт">
        <label>
          <span>Төлөв</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} id={`${uid}-st`}>
            <option value="all">Бүгд</option>
            <option value="running">Явж байна</option>
            <option value="waiting">Хүлээж байна</option>
            <option value="idle">Эхлээгүй</option>
            <option value="done">Дууссан</option>
          </select>
        </label>
        <label>
          <span>Эзэн</span>
          <select value={owner} onChange={(e) => setOwner(e.target.value)}>
            <option value="all">Бүгд</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.kind === "agent" ? "✦ " : ""}
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Хугацаа</span>
          <select value={due} onChange={(e) => setDue(e.target.value as DueFilter)}>
            <option value="all">Бүгд</option>
            <option value="overdue">Хэтэрсэн</option>
            <option value="soon">14 хоногт</option>
            <option value="none">Хугацаагүй</option>
          </select>
        </label>
        {filtering && (
          <button
            type="button"
            className="cv-clear"
            onClick={() => {
              setStatus("all");
              setOwner("all");
              setDue("all");
            }}
          >
            Цэвэрлэх
          </button>
        )}
      </div>
      <div className={`cv-dash-body${picked ? " has-pick" : ""}`}>
        <div className="cv-areas">
          {[...areas.entries()].map(([area, projects]) => {
            const sessions: SessionBoardInput[] = [];
            const subs = new Map<string, string>();
            for (const p of projects) {
              const tasks = p.tasks.filter((t) => passes(p, t));
              if (filtering && !tasks.length) continue;
              const sub = p.subArea?.trim() || "";
              if (sub) subs.set(sub, sub);
              const done = p.tasks.filter((t) => isDone(t.status)).length;
              const acc = p.raci?.accountable ? actorOf(c, p.raci.accountable) : null;
              sessions.push({
                id: p.id,
                title: p.name,
                status: p.status,
                group: sub || undefined,
                owner: acc?.name,
                line: [`${done}/${p.tasks.length} task`, p.due ? `хугацаа ${p.due}` : ""].filter(Boolean).join(" · "),
              });
              for (const t of tasks) {
                const o = t.ownerId ? actorOf(c, t.ownerId) : null;
                const d = taskDue(p, t);
                const bucket = dueBucket(d, isDone(t.status), today);
                sessions.push({
                  id: `${p.id}:${t.id}`,
                  title: t.title,
                  status: t.status,
                  group: sub || undefined,
                  parent: p.id,
                  owner: o?.name,
                  line: [o?.name, d ? `${bucket === "overdue" ? "⚠ хэтэрсэн " : ""}${d}` : ""].filter(Boolean).join(" · ") || undefined,
                });
              }
            }
            const projectRows = sessions.filter((s) => !s.parent);
            return (
              <section key={area} className="cv-area" aria-label={area === NO_AREA ? "Area-гүй" : area}>
                <h4 className="cv-area-h">
                  <span className="cv-area-mark" aria-hidden="true" />
                  {area === NO_AREA ? "Area-гүй" : area}
                  <span className="cv-count">{projectRows.length}</span>
                </h4>
                {projectRows.length === 0 ? (
                  <p className="cv-empty cv-empty-sm">Шүүлтэд тохирох зүйл алга.</p>
                ) : (
                  <SessionBoard
                    project={{
                      name: area === NO_AREA ? "Area-гүй" : area,
                      icon: area === NO_AREA ? "·" : initials(area).charAt(0),
                      stats: { tasks: sessions.filter((s) => s.parent && toSessionState(s.status) !== "done").length },
                    }}
                    groups={[...subs.keys()].map((s) => ({ id: s, label: s }))}
                    sessions={sessions}
                    labels={sbLabels}
                    selectedId={pick}
                    onSessionClick={(s) => setPick(s.parent ?? s.id)}
                  />
                )}
              </section>
            );
          })}
        </div>
        {picked && (
          <aside className="cv-pick" aria-label={picked.name}>
            <div className="cv-pick-bar">
              <span>Сонгосон төсөл</span>
              <button type="button" onClick={() => setPick(null)} aria-label="Хаах">
                ×
              </button>
            </div>
            <ProjectReportFor c={c} p={picked} key={picked.id} />
          </aside>
        )}
      </div>
    </div>
  );
}

export const dashboardCss = `
.cv-dash{display:flex;flex-direction:column;gap:12px}
.cv-dash-stats{grid-template-columns:repeat(4,minmax(0,1fr))}
.cv-stat.is-amber dd{color:color-mix(in srgb,var(--cv-amber) 85%,var(--cv-fg))}
.cv-filters{display:flex;flex-wrap:wrap;align-items:flex-end;gap:8px}
.cv-filters label{display:flex;flex-direction:column;gap:3px;font-size:11.5px;font-weight:500;color:var(--cv-muted)}
.cv-filters select{height:32px;min-width:140px;padding:0 28px 0 10px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);color:var(--cv-fg);font:inherit;font-size:13px}
.cv-clear{height:32px;padding:0 12px;border:0;border-radius:8px;background:var(--cv-soft);color:var(--cv-fg);font-size:13px}
.cv-dash-body{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:start}
.cv-dash-body.has-pick{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}
.cv-areas{display:flex;flex-direction:column;gap:16px;min-width:0}
.cv-area-h{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:14px;font-weight:600}
.cv-area-mark{width:10px;height:10px;border-radius:3px;background:var(--cv-accent)}
.cv-area .sb,.cv-pick .rp{max-width:none}
.cv-empty-sm{padding:12px;font-size:13px}
.cv-pick{position:sticky;top:8px;display:flex;flex-direction:column;gap:8px;min-width:0;animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both}
.cv-pick-bar{display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--cv-muted)}
.cv-pick-bar button{width:28px;height:28px;border:0;border-radius:7px;background:var(--cv-soft);font-size:16px;line-height:1}
@container cv (max-width:1000px){.cv-dash-body.has-pick{grid-template-columns:minmax(0,1fr)}.cv-pick{position:static;order:-1}}
@container cv (max-width:560px){.cv-dash-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.cv-filters label{flex:1 1 40%}.cv-filters select{min-width:0;width:100%}}
`;
