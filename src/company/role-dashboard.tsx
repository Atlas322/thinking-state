/**
 * Role Dashboard (2026-11-17) — one company seen from one position. Built from the Company contract only:
 * every number is counted from the data, nothing is invented. Patterns from the saved references:
 * - what is burning comes first, data second (ikramsakib, real-estate manager board);
 * - the agent proposes with its reasons, the person approves once (Threshold, Bosun);
 * - projects on a time axis (gr8rstudio Gantt);
 * - the morning brief: decisions and agents at work (Sean Purvis, «agents meet at 6»);
 * - units → agents as one map (SkillTree, 35 agents in 7 departments).
 * Lens by position: the head of an institution/company sees its units; finance sees the revenue model.
 */
import * as React from "react";
import type { Company, CompanyProject, CompanyTask, CompanyUnit } from "./types";

export type RoleDashboardLabels = {
  burning: string; burningEmpty: string; overdue: (d: number) => string; waiting: string; soon: (d: number) => string;
  open: string; late: string; waitingK: string; agents: string; decisions: string;
  approve: string; approveOthers: string; approveTitle: string; yourStep: string; approveBtn: string; look: string; noApprove: string;
  timeline: string; brief: string; units: string; unit: string; model: string; share: string; okr: string; scope: string; today: string; noTimeline: string;
};
export const roleDashboardLabelsMn: RoleDashboardLabels = {
  burning: "Юу шатаж байна",
  burningEmpty: "Одоогоор шатаж буй зүйл алга.",
  overdue: (d) => `${d} өдөр хоцорсон`,
  waiting: "Хүлээгдэж байна",
  soon: (d) => (d === 0 ? "Өнөөдөр" : `${d} өдрийн дараа`),
  open: "Нээлттэй ажил",
  late: "Хоцорсон",
  waitingK: "Хүлээгдэж буй",
  agents: "Агент",
  decisions: "Шийдвэр · 30 хоног",
  approve: "Агент бэлдсэн — та батална",
  approveOthers: "Агент бэлдсэн — батлалт хүлээж буй",
  approveTitle: "Таны батлах алхам",
  yourStep: "Таны алхам",
  approveBtn: "Батлах",
  look: "Харах",
  noApprove: "Таны батлах алхамтай журам алга.",
  timeline: "Төслүүдийн хугацаа",
  brief: "Өглөөний товч",
  units: "Нэгжүүдийн байдал",
  unit: "Нэгж",
  model: "Орлого ба зардал (бизнес загвар)",
  share: "хувь",
  okr: "Зорилго ба гол үр дүн",
  scope: "Хамрах хүрээ",
  today: "Өнөөдөр",
  noTimeline: "Хугацаатай төсөл алга.",
};
export type RoleDashboardProps = {
  company: Company;
  personId: string;
  /** Lets the viewer switch position (shows the position pills). */
  onPersonChange?: (id: string) => void;
  today?: Date;
  /** Light or dark; left out, the board follows the host page's theme. */
  theme?: "light" | "dark";
  /** Inside another window (CompanyView): no own frame or title bar. */
  bare?: boolean;
  labels?: Partial<RoleDashboardLabels>;
  className?: string;
};

const DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const days = (a: string, b: Date) => Math.round((new Date(a + "T00:00:00Z").getTime() - new Date(iso(b) + "T00:00:00Z").getTime()) / DAY);
const isDone = (s: string) => /^(done|completed|closed|cancel)/i.test(s);
const isWaiting = (s: string) => /^(waiting|blocked|on-hold|hold)/i.test(s);

function subtree(units: CompanyUnit[], root: string): Set<string> {
  const out = new Set([root]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const u of units) if (u.parentId && out.has(u.parentId) && !out.has(u.id)) { out.add(u.id); grew = true; }
  }
  return out;
}

type Row = { project: CompanyProject; task: CompanyTask };
export type RoleView = ReturnType<typeof roleView>;

/** Everything the dashboard shows for one position — pure, testable. */
export function roleView(c: Company, personId: string, today = new Date()) {
  const person = c.people.find((p) => p.id === personId) ?? c.people[0];
  const unit = c.units.find((u) => u.id === person.unitId);
  const scope = subtree(c.units, person.unitId);
  const myAgents = new Set(c.agents.filter((a) => a.ownerId === person.id).map((a) => a.id));
  const projects = c.projects.filter((p) => scope.has(p.unitId) || p.raci?.accountable === person.id || p.raci?.responsible.includes(person.id));
  const rows: Row[] = [];
  for (const p of c.projects) for (const t of p.tasks) {
    if (projects.includes(p) || t.ownerId === person.id || (t.ownerId && myAgents.has(t.ownerId))) rows.push({ project: p, task: t });
  }
  const open = rows.filter((r) => !isDone(r.task.status));
  const dueOf = (r: Row) => r.task.due ?? r.project.due;
  const late = open.filter((r) => dueOf(r) && days(dueOf(r)!, today) < 0);
  const waiting = open.filter((r) => isWaiting(r.task.status));
  const soon = open.filter((r) => { const d = dueOf(r); return d && days(d, today) >= 0 && days(d, today) <= 7; });
  type Burn = Row & { kind: "late" | "waiting" | "soon"; days: number };
  const burnMap = new Map<string, Burn>();
  for (const r of late) burnMap.set(r.project.id + r.task.id, { ...r, kind: "late", days: -days(dueOf(r)!, today) });
  for (const r of waiting) if (!burnMap.has(r.project.id + r.task.id)) burnMap.set(r.project.id + r.task.id, { ...r, kind: "waiting", days: 0 });
  for (const r of soon) if (!burnMap.has(r.project.id + r.task.id)) burnMap.set(r.project.id + r.task.id, { ...r, kind: "soon", days: days(dueOf(r)!, today) });
  const order = { late: 0, waiting: 1, soon: 2 } as const;
  const burning = [...burnMap.values()].sort((a, b) => order[a.kind] - order[b.kind] || (a.kind === "late" ? b.days - a.days : a.days - b.days));

  const agents = c.agents.filter((a) => scope.has(a.unitId) || myAgents.has(a.id));
  const decisions = projects.flatMap((p) => p.decisions.map((d) => ({ ...d, project: p.name }))).sort((a, b) => b.date.localeCompare(a.date));
  const recent = decisions.filter((d) => days(d.date, today) >= -30);
  // Workflows where this person holds a step: the agents' outputs before it are the reasons (Threshold/Bosun).
  const isHeadEarly = !!unit && (unit.kind === "institution" || unit.kind === "company") && c.units.some((u) => u.parentId === unit.id);
  const isPerson = (id: string) => c.people.some((p) => p.id === id);
  // Own approval steps; a head also sees the human steps waiting in the units below (read-only, with who approves).
  const approvals = c.workflows.flatMap((w) => {
    let i = w.steps.findIndex((s) => s.actorId === person.id);
    let mine = i >= 0;
    if (i < 0 && isHeadEarly && scope.has(w.unitId)) { i = w.steps.findIndex((s) => isPerson(s.actorId)); mine = false; }
    if (i < 0) return [];
    const before = w.steps.slice(0, i).map((s) => ({ ...s, actor: c.agents.find((a) => a.id === s.actorId)?.name ?? c.people.find((p) => p.id === s.actorId)?.role ?? s.actorId }));
    return [{ workflow: w, step: w.steps[i], before, mine, approver: c.people.find((p) => p.id === w.steps[i].actorId)?.role ?? "" }];
  });
  const isHead = !!unit && (unit.kind === "institution" || unit.kind === "company") && c.units.some((u) => u.parentId === unit.id);
  const children = isHead ? c.units.filter((u) => u.parentId === unit!.id) : [];
  const unitHealth = children.map((u) => {
    const set = subtree(c.units, u.id);
    const r = c.projects.filter((p) => set.has(p.unitId)).flatMap((p) => p.tasks.map((t) => ({ project: p, task: t })));
    const o = r.filter((x) => !isDone(x.task.status));
    return {
      unit: u,
      open: o.length,
      late: o.filter((x) => { const d = x.task.due ?? x.project.due; return d && days(d, today) < 0; }).length,
      waiting: o.filter((x) => isWaiting(x.task.status)).length,
      agents: c.agents.filter((a) => set.has(a.unitId)).length,
    };
  });
  const finance = /санхүү/i.test(person.role);
  const okrs = (c.okrs ?? []).filter((o) => o.ownerId === person.id || (isHead && unit?.kind === "institution"));
  return { person, unit, projects, rows, open, late, waiting, soon, burning, agents, decisions, recent, approvals, isHead, unitHealth, finance, okrs };
}

const nameOf = (c: Company, id?: string) => (id ? c.people.find((p) => p.id === id)?.name ?? c.agents.find((a) => a.id === id)?.name ?? id : "");

const CSS = `
.rd{font-family:var(--ts-font,Inter,system-ui,sans-serif);background:var(--ts-surface);color:var(--ts-fg);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size}
.rd-bar{display:flex;align-items:center;gap:12px;min-height:44px;padding:0 14px;border-bottom:1px solid var(--ts-line);background:var(--ts-soft)}
.rd-dots{display:flex;gap:6px}.rd-dots i{width:10px;height:10px;border-radius:50%;background:var(--ts-line)}
.rd-bar b{font-weight:500;font-size:14px;color:var(--ts-muted)}
.rd-bar time{margin-left:auto;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint)}
.rd-roles{display:flex;gap:6px;padding:10px 14px;border-bottom:1px solid var(--ts-line);overflow-x:auto;scrollbar-width:thin}
.rd-role{flex:none;min-height:36px;padding:0 12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);color:var(--ts-muted);font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}
.rd-role[aria-pressed="true"]{border-color:var(--ts-electric);background:var(--ts-electric-soft);color:var(--ts-fg);font-weight:500}
.rd-role:focus-visible,.rd-btn:focus-visible{outline:2px solid var(--ts-electric);outline-offset:2px}
.rd-body{padding:24px;display:grid;gap:16px}
.rd-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}
.rd-head h2{font:400 28px/1.15 Spectral,Georgia,serif;margin:0}
.rd-head p{margin:4px 0 0;font-size:14px;color:var(--ts-muted)}
.rd-label{font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.rd-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.rd-kpi{padding:12px 14px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page)}
.rd-kpi b{display:block;font:400 30px/1 Spectral,Georgia,serif;margin-top:6px}
.rd-kpi[data-tone="late"] b{color:var(--ts-red)}
.rd-kpi[data-tone="wait"] b{color:var(--ts-amber)}
.rd-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:16px;align-items:start}
.rd-card{border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0}
.rd-card h3{margin:0;font-size:15px;font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:8px}
.rd-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
.rd-burn{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 0;border-top:1px solid var(--ts-line)}
.rd-burn:first-child{border-top:0;padding-top:0}
.rd-burn b{font-weight:500;font-size:14px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rd-burn small{font-size:12px;color:var(--ts-muted)}
.rd-dot{width:10px;height:10px;border-radius:50%}
.rd-dot[data-k="late"]{background:var(--ts-red)}.rd-dot[data-k="waiting"]{background:var(--ts-amber)}.rd-dot[data-k="soon"]{background:var(--ts-electric)}
.rd-chip{font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);padding:3px 8px;border-radius:var(--ts-radius,6px);white-space:nowrap;border:1px solid currentColor}
.rd-chip[data-k="late"]{color:var(--ts-red)}.rd-chip[data-k="waiting"]{color:var(--ts-amber)}.rd-chip[data-k="soon"]{color:var(--ts-electric-fg)}
.rd-empty{margin:0;font-size:14px;color:var(--ts-faint);font-style:italic}
.rd-appr{border:1px solid var(--ts-electric);border-radius:var(--ts-radius,6px);padding:12px;display:flex;flex-direction:column;gap:8px;background:color-mix(in srgb,var(--ts-electric-soft) 55%,var(--ts-page))}
.rd-appr b{font-size:14px;font-weight:600}
.rd-appr ol{margin:0;padding:0 0 0 18px;font-size:13px;color:var(--ts-muted);display:flex;flex-direction:column;gap:3px}
.rd-appr ol li span{color:var(--ts-fg)}
.rd-step{font-size:14px}
.rd-actions{display:flex;gap:8px}
.rd-btn{min-height:44px;padding:0 16px;border-radius:var(--ts-radius,6px);font:inherit;font-weight:500;font-size:14px;cursor:pointer;border:1.5px solid var(--ts-fg);background:none;color:var(--ts-fg)}
.rd-btn.primary{border-color:var(--ts-electric);background:var(--ts-electric);color:var(--ts-on-electric)}
.rd-gantt{display:grid;gap:8px}
.rd-axis{position:relative;height:18px;font:500 10px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint)}
.rd-axis span{position:absolute;transform:translateX(-50%)}
.rd-lane{display:grid;grid-template-columns:150px minmax(0,1fr);gap:10px;align-items:center;font-size:13px}
.rd-lane>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rd-track{position:relative;height:22px;border-radius:var(--ts-radius,6px);background:var(--ts-soft)}
.rd-bar-p{position:absolute;top:8px;height:6px;border-radius:3px;background:color-mix(in srgb,var(--ts-electric) 35%,transparent)}
.rd-pin{position:absolute;top:5px;width:12px;height:12px;border-radius:50%;transform:translateX(-50%);border:2px solid var(--ts-page)}
.rd-pin[data-k="done"]{background:var(--ts-green)}.rd-pin[data-k="late"]{background:var(--ts-red)}.rd-pin[data-k="waiting"]{background:var(--ts-amber)}.rd-pin[data-k="open"]{background:var(--ts-electric)}
.rd-pin[data-k="due"]{background:var(--ts-fg);border-radius:2px;transform:translateX(-50%) rotate(45deg);width:10px;height:10px;top:6px}
.rd-now{position:absolute;top:-4px;bottom:-4px;width:1.5px;background:var(--ts-red)}
.rd-table{width:100%;border-collapse:collapse;font-size:13px}
.rd-table th{font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint);text-align:right;padding:6px 8px;border-bottom:1px solid var(--ts-line)}
.rd-table th:first-child,.rd-table td:first-child{text-align:left}
.rd-table td{padding:8px;text-align:right;border-bottom:1px solid var(--ts-line);font-variant-numeric:tabular-nums}
.rd-table td[data-hot="true"]{color:var(--ts-red);font-weight:600}
.rd-brief{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none;font-size:13px}
.rd-brief li{display:flex;gap:10px}
.rd-brief time{font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint);flex:none;padding-top:2px}
.rd-agent{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px solid var(--ts-line);font-size:13px}
.rd-agent:first-child{border-top:0}
.rd-agent i{width:28px;height:28px;flex:none;border-radius:var(--ts-radius,6px);display:grid;place-items:center;background:var(--ts-electric-soft);color:var(--ts-electric-fg);font-style:normal;font-weight:600;font-size:12px}
.rd-agent small{display:block;color:var(--ts-muted)}
.rd-meter{height:6px;border-radius:3px;background:var(--ts-soft-2);overflow:hidden}
.rd-meter i{display:block;height:100%;background:var(--ts-electric)}
.rd-kr{display:grid;grid-template-columns:minmax(0,1fr) 44px;gap:4px 10px;align-items:center;font-size:13px}
.rd-kr span:nth-child(2){text-align:right;font-variant-numeric:tabular-nums;color:var(--ts-muted)}
.rd-bare{border:0;box-shadow:none;border-radius:0;background:transparent}.rd-bare .rd-body{padding:16px 0 0}.rd-bare .rd-roles{padding:0 0 10px}
@container (max-width:860px){.rd-grid{grid-template-columns:minmax(0,1fr)}.rd-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (max-width:520px){.rd-body{padding:16px}.rd-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.rd-lane{grid-template-columns:96px minmax(0,1fr)}}
`;

/** A person by id, by role name or by its URL form (`?role=Санхүүгийн-захирал`, any case). */
export function findPerson(c: Company, key?: string | null) {
  if (!key) return undefined;
  const norm = (x: string) => decodeURIComponent(x).trim().toLowerCase().replace(/[\s_-]+/g, " ");
  const k = norm(key);
  return c.people.find((p) => p.id === key) ?? c.people.find((p) => norm(p.role) === k) ?? c.people.find((p) => norm(p.role).startsWith(k));
}

export function RoleDashboard({ company: c, personId, onPersonChange, today = new Date(), theme, bare = false, labels: labelsIn, className = "" }: RoleDashboardProps) {
  const L = { ...roleDashboardLabelsMn, ...labelsIn };
  const v = roleView(c, personId, today);
  const dark = theme === "dark";
  const [done, setDone] = React.useState<Set<string>>(new Set());
  // Time axis: from 4 weeks before today to 6 weeks after, or wider if a due date falls outside.
  const dues = v.projects.flatMap((p) => [p.due, ...p.tasks.map((t) => t.due)]).filter(Boolean) as string[];
  const lo = Math.min(-28, ...dues.map((d) => days(d, today))) - 3;
  const hi = Math.max(42, ...dues.map((d) => days(d, today))) + 3;
  const x = (d: string | number) => `${(((typeof d === "number" ? d : days(d, today)) - lo) / (hi - lo)) * 100}%`;
  const ticks = [-28, -14, 0, 14, 28, 42].filter((t) => t >= lo && t <= hi);
  const tick = (t: number) => { const d = new Date(today.getTime() + t * DAY); return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`; };
  const kindOf = (p: CompanyProject, t: CompanyTask) => isDone(t.status) ? "done" : isWaiting(t.status) ? "waiting" : (t.due ?? p.due) && days((t.due ?? p.due)!, today) < 0 ? "late" : "open";

  return (
    <div
      className={`rd ${bare ? "rd-bare" : ""} ${dark ? "dark" : ""} ${className}`}
      data-ts-theme={theme ? (dark ? "dark" : "cream") : undefined}
      data-theme={theme ? (dark ? "dark" : "light") : undefined}
    >
      <style>{CSS}</style>
      {!bare && <div className="rd-bar">
        <div className="rd-dots" aria-hidden="true"><i /><i /><i /></div>
        <b>{c.name} · {v.person.role}</b>
        <time dateTime={iso(today)}>{L.today} · {iso(today)}</time>
      </div>}
      {onPersonChange && (
        <div className="rd-roles" role="group" aria-label={L.scope}>
          {c.people.map((p) => (
            <button key={p.id} type="button" className="rd-role" aria-pressed={p.id === v.person.id} onClick={() => onPersonChange(p.id)}>{p.role}</button>
          ))}
        </div>
      )}
      <div className="rd-body">
        <div className="rd-head">
          <div>
            <span className="rd-label">{L.scope}: {v.unit?.name}</span>
            <h2>{v.person.role}</h2>
            <p>{v.person.name} · {v.projects.length} төсөл · {v.agents.length} агент</p>
          </div>
        </div>

        <div className="rd-kpis">
          <div className="rd-kpi"><span className="rd-label">{L.open}</span><b>{v.open.length}</b></div>
          <div className="rd-kpi" data-tone={v.late.length ? "late" : undefined}><span className="rd-label">{L.late}</span><b>{v.late.length}</b></div>
          <div className="rd-kpi" data-tone={v.waiting.length ? "wait" : undefined}><span className="rd-label">{L.waitingK}</span><b>{v.waiting.length}</b></div>
          <div className="rd-kpi"><span className="rd-label">{L.agents}</span><b>{v.agents.length}</b></div>
          <div className="rd-kpi"><span className="rd-label">{L.decisions}</span><b>{v.recent.length}</b></div>
        </div>

        <div className="rd-grid">
          <section className="rd-card" aria-label={L.burning}>
            <h3>{L.burning}<span className="rd-label">{v.burning.length}</span></h3>
            {v.burning.length ? (
              <ul className="rd-list">
                {v.burning.slice(0, 6).map((b) => (
                  <li key={b.project.id + b.task.id} className="rd-burn">
                    <span className="rd-dot" data-k={b.kind} aria-hidden="true" />
                    <span style={{ minWidth: 0 }}><b>{b.task.title}</b><small>{b.project.name} · {nameOf(c, b.task.ownerId)}</small></span>
                    <span className="rd-chip" data-k={b.kind}>{b.kind === "late" ? L.overdue(b.days) : b.kind === "waiting" ? L.waiting : L.soon(b.days)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="rd-empty">{L.burningEmpty}</p>}
          </section>

          <section className="rd-card" aria-label={L.approve}>
            <h3>{v.approvals.some((a) => a.mine) || !v.isHead ? L.approve : L.approveOthers}</h3>
            {v.approvals.length ? v.approvals.map((a) => {
              const k = a.workflow.id;
              return (
                <div key={k} className="rd-appr">
                  <b>{a.workflow.name}</b>
                  <span className="rd-label">{a.workflow.trigger}</span>
                  {a.before.length > 0 && <ol>{a.before.map((s) => <li key={s.id}><span>{s.actor}</span> — {s.output}</li>)}</ol>}
                  <div className="rd-step">{a.mine ? L.yourStep : a.approver}: <b>{a.step.label}</b> → {a.step.output}</div>
                  {a.mine && <div className="rd-actions">
                    <button type="button" className="rd-btn primary" disabled={done.has(k)} onClick={() => setDone(new Set(done).add(k))}>{done.has(k) ? "✓" : L.approveBtn}</button>
                    <button type="button" className="rd-btn">{L.look}</button>
                  </div>}
                </div>
              );
            }) : <p className="rd-empty">{L.noApprove}</p>}
          </section>
        </div>

        {v.isHead && (
          <section className="rd-card" aria-label={L.units}>
            <h3>{L.units}</h3>
            <table className="rd-table">
              <thead><tr><th>{L.unit}</th><th>{L.open}</th><th>{L.late}</th><th>{L.waitingK}</th><th>{L.agents}</th></tr></thead>
              <tbody>
                {v.unitHealth.map((u) => (
                  <tr key={u.unit.id}><td>{u.unit.name}</td><td>{u.open}</td><td data-hot={u.late > 0}>{u.late}</td><td>{u.waiting}</td><td>{u.agents}</td></tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="rd-card" aria-label={L.timeline}>
          <h3>{L.timeline}</h3>
          {v.projects.some((p) => p.due || p.tasks.some((t) => t.due)) ? (
            <div className="rd-gantt">
              <div className="rd-lane"><span /><div className="rd-axis">{ticks.map((t) => <span key={t} style={{ left: x(t) }}>{t === 0 ? L.today : tick(t)}</span>)}</div></div>
              {v.projects.map((p) => {
                const ds = [p.due, ...p.tasks.map((t) => t.due)].filter(Boolean) as string[];
                const first = ds.length ? ds.reduce((m, d) => (d < m ? d : m)) : undefined;
                return (
                  <div key={p.id} className="rd-lane">
                    <span title={p.name}>{p.name}</span>
                    <div className="rd-track">
                      {first && p.due && <i className="rd-bar-p" style={{ left: x(first), width: `calc(${x(p.due)} - ${x(first)})` }} />}
                      <i className="rd-now" style={{ left: x(0) }} aria-hidden="true" />
                      {p.tasks.filter((t) => t.due).map((t) => <i key={t.id} className="rd-pin" data-k={kindOf(p, t)} style={{ left: x(t.due!) }} title={`${t.title} · ${t.due}`} />)}
                      {p.due && <i className="rd-pin" data-k="due" style={{ left: x(p.due) }} title={`${p.name} · ${p.due}`} />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="rd-empty">{L.noTimeline}</p>}
        </section>

        <div className="rd-grid">
          <section className="rd-card" aria-label={L.brief}>
            <h3>{L.brief}</h3>
            <ul className="rd-brief">
              {v.decisions.slice(0, 4).map((d) => <li key={d.project + d.id}><time>{d.date.slice(5)}</time><span>{d.title}<br /><small style={{ color: "var(--ts-muted)" }}>{d.project}</small></span></li>)}
            </ul>
            <div>
              {v.agents.map((a) => (
                <div key={a.id} className="rd-agent"><i aria-hidden="true">{a.name.slice(0, 1)}</i><span><b style={{ fontWeight: 500 }}>{a.name}</b><small>{a.role} · {a.skills.join(", ")}</small></span></div>
              ))}
            </div>
          </section>

          <div style={{ display: "grid", gap: 16 }}>
            {v.okrs.length > 0 && (
              <section className="rd-card" aria-label={L.okr}>
                <h3>{L.okr}</h3>
                {v.okrs.map((o) => (
                  <div key={o.id} style={{ display: "grid", gap: 8 }}>
                    <b style={{ fontSize: 14, fontWeight: 500 }}>{o.title}</b>
                    {o.keyResults.map((k) => (
                      <div key={k.id} className="rd-kr">
                        <span>{k.title}</span>
                        <span>{Number.isFinite(k.progress) ? `${k.progress}%` : "—"}</span>
                        <div className="rd-meter" style={{ gridColumn: "1 / -1" }}><i style={{ width: `${Number.isFinite(k.progress) ? k.progress : 0}%` }} /></div>
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}
            {v.finance && (
              <section className="rd-card" aria-label={L.model}>
                <h3>{L.model}</h3>
                {Array.isArray(c.model.revenue) && c.model.revenue.map((r) => typeof r === "object" && (
                  <div key={r.stream} className="rd-kr">
                    <span>{r.stream}</span><span>{r.share != null ? `${Math.round(r.share * 100)}%` : "—"}</span>
                    <div className="rd-meter" style={{ gridColumn: "1 / -1" }}><i style={{ width: `${(r.share ?? 0) * 100}%` }} /></div>
                  </div>
                ))}
                {Array.isArray(c.model.costs) && <p style={{ margin: 0, fontSize: 13, color: "var(--ts-muted)" }}>Зардал: {(c.model.costs as string[]).join(" · ")}</p>}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
