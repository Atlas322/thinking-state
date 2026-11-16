import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
const roleDashboardLabelsMn = {
  burning: "Юу шатаж байна",
  burningEmpty: "Одоогоор шатаж буй зүйл алга.",
  overdue: (d) => `${d} өдөр хоцорсон`,
  waiting: "Хүлээгдэж байна",
  soon: (d) => d === 0 ? "Өнөөдөр" : `${d} өдрийн дараа`,
  open: "Нээлттэй ажил",
  late: "Хоцорсон",
  waitingK: "Хүлээгдэж буй",
  agents: "Агент",
  decisions: "Шийдвэр · 30 хоног",
  approve: "Агент бэлдсэн — хүн батална",
  approveOthers: "Агент бэлдсэн — батлалт хүлээж буй",
  approveTitle: "Батлах алхам",
  yourStep: "Энэ албан тушаалын алхам",
  approveBtn: "Батлах",
  look: "Харах",
  noApprove: "Батлах алхамтай журам алга.",
  timeline: "Төслүүдийн хугацаа",
  brief: "Өглөөний товч",
  units: "Нэгжүүдийн байдал",
  unit: "Нэгж",
  model: "Орлого ба зардал (бизнес загвар)",
  share: "хувь",
  okr: "Зорилго ба гол үр дүн",
  scope: "Хамрах хүрээ",
  today: "Өнөөдөр",
  noTimeline: "Хугацаатай төсөл алга."
};
const DAY = 864e5;
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const days = (a, b) => Math.round(((/* @__PURE__ */ new Date(a + "T00:00:00Z")).getTime() - (/* @__PURE__ */ new Date(iso(b) + "T00:00:00Z")).getTime()) / DAY);
const isDone = (s) => /^(done|completed|closed|cancel)/i.test(s);
const isWaiting = (s) => /^(waiting|blocked|on-hold|hold)/i.test(s);
function subtree(units, root) {
  const out = /* @__PURE__ */ new Set([root]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const u of units) if (u.parentId && out.has(u.parentId) && !out.has(u.id)) {
      out.add(u.id);
      grew = true;
    }
  }
  return out;
}
function roleView(c, personId, today = /* @__PURE__ */ new Date()) {
  const person = c.people.find((p) => p.id === personId) ?? c.people[0];
  const unit = c.units.find((u) => u.id === person.unitId);
  const scope = subtree(c.units, person.unitId);
  const myAgents = new Set(c.agents.filter((a) => a.ownerId === person.id).map((a) => a.id));
  const projects = c.projects.filter((p) => scope.has(p.unitId) || p.raci?.accountable === person.id || p.raci?.responsible.includes(person.id));
  const rows = [];
  for (const p of c.projects) for (const t of p.tasks) {
    if (projects.includes(p) || t.ownerId === person.id || t.ownerId && myAgents.has(t.ownerId)) rows.push({ project: p, task: t });
  }
  const open = rows.filter((r) => !isDone(r.task.status));
  const dueOf = (r) => r.task.due ?? r.project.due;
  const late = open.filter((r) => dueOf(r) && days(dueOf(r), today) < 0);
  const waiting = open.filter((r) => isWaiting(r.task.status));
  const soon = open.filter((r) => {
    const d = dueOf(r);
    return d && days(d, today) >= 0 && days(d, today) <= 7;
  });
  const burnMap = /* @__PURE__ */ new Map();
  for (const r of late) burnMap.set(r.project.id + r.task.id, { ...r, kind: "late", days: -days(dueOf(r), today) });
  for (const r of waiting) if (!burnMap.has(r.project.id + r.task.id)) burnMap.set(r.project.id + r.task.id, { ...r, kind: "waiting", days: 0 });
  for (const r of soon) if (!burnMap.has(r.project.id + r.task.id)) burnMap.set(r.project.id + r.task.id, { ...r, kind: "soon", days: days(dueOf(r), today) });
  const order = { late: 0, waiting: 1, soon: 2 };
  const burning = [...burnMap.values()].sort((a, b) => order[a.kind] - order[b.kind] || (a.kind === "late" ? b.days - a.days : a.days - b.days));
  const agents = c.agents.filter((a) => scope.has(a.unitId) || myAgents.has(a.id));
  const decisions = projects.flatMap((p) => p.decisions.map((d) => ({ ...d, project: p.name }))).sort((a, b) => b.date.localeCompare(a.date));
  const recent = decisions.filter((d) => days(d.date, today) >= -30);
  const isHeadEarly = !!unit && (unit.kind === "institution" || unit.kind === "company") && c.units.some((u) => u.parentId === unit.id);
  const isPerson = (id) => c.people.some((p) => p.id === id);
  const approvals = c.workflows.flatMap((w) => {
    let i = w.steps.findIndex((s) => s.actorId === person.id);
    let mine = i >= 0;
    if (i < 0 && isHeadEarly && scope.has(w.unitId)) {
      i = w.steps.findIndex((s) => isPerson(s.actorId));
      mine = false;
    }
    if (i < 0) return [];
    const before = w.steps.slice(0, i).map((s) => ({ ...s, actor: c.agents.find((a) => a.id === s.actorId)?.name ?? c.people.find((p) => p.id === s.actorId)?.role ?? s.actorId }));
    return [{ workflow: w, step: w.steps[i], before, mine, approver: c.people.find((p) => p.id === w.steps[i].actorId)?.role ?? "" }];
  });
  const isHead = !!unit && (unit.kind === "institution" || unit.kind === "company") && c.units.some((u) => u.parentId === unit.id);
  const children = isHead ? c.units.filter((u) => u.parentId === unit.id) : [];
  const unitHealth = children.map((u) => {
    const set = subtree(c.units, u.id);
    const r = c.projects.filter((p) => set.has(p.unitId)).flatMap((p) => p.tasks.map((t) => ({ project: p, task: t })));
    const o = r.filter((x) => !isDone(x.task.status));
    return {
      unit: u,
      open: o.length,
      late: o.filter((x) => {
        const d = x.task.due ?? x.project.due;
        return d && days(d, today) < 0;
      }).length,
      waiting: o.filter((x) => isWaiting(x.task.status)).length,
      agents: c.agents.filter((a) => set.has(a.unitId)).length
    };
  });
  const finance = /санхүү/i.test(person.role);
  const okrs = (c.okrs ?? []).filter((o) => o.ownerId === person.id || isHead && unit?.kind === "institution");
  return { person, unit, projects, rows, open, late, waiting, soon, burning, agents, decisions, recent, approvals, isHead, unitHealth, finance, okrs };
}
const nameOf = (c, id) => id ? c.people.find((p) => p.id === id)?.name ?? c.agents.find((a) => a.id === id)?.name ?? id : "";
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
.rd-chip[data-k="late"]{color:var(--ts-red)}.rd-chip[data-k="waiting"]{color:var(--ts-status-needs-you-fg)}.rd-chip[data-k="soon"]{color:var(--ts-on-accent-soft)}
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
function findPerson(c, key) {
  if (!key) return void 0;
  const decode = (x) => {
    try {
      return decodeURIComponent(x);
    } catch {
      return x;
    }
  };
  const norm = (x) => decode(x).trim().toLowerCase().replace(/[\s_-]+/g, " ");
  const k = norm(key);
  return c.people.find((p) => p.id === key) ?? c.people.find((p) => norm(p.role) === k) ?? c.people.find((p) => norm(p.role).startsWith(k));
}
function RoleDashboard({ company: c, personId, onPersonChange, today = /* @__PURE__ */ new Date(), theme, bare = false, labels: labelsIn, className = "" }) {
  const L = { ...roleDashboardLabelsMn, ...labelsIn };
  const v = roleView(c, personId, today);
  const dark = theme === "dark";
  const [done, setDone] = React.useState(/* @__PURE__ */ new Set());
  const dues = v.projects.flatMap((p) => [p.due, ...p.tasks.map((t) => t.due)]).filter(Boolean);
  const lo = Math.min(-28, ...dues.map((d) => days(d, today))) - 3;
  const hi = Math.max(42, ...dues.map((d) => days(d, today))) + 3;
  const x = (d) => `${((typeof d === "number" ? d : days(d, today)) - lo) / (hi - lo) * 100}%`;
  const ticks = [-28, -14, 0, 14, 28, 42].filter((t) => t >= lo && t <= hi);
  const tick = (t) => {
    const d = new Date(today.getTime() + t * DAY);
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
  };
  const kindOf = (p, t) => isDone(t.status) ? "done" : isWaiting(t.status) ? "waiting" : (t.due ?? p.due) && days(t.due ?? p.due, today) < 0 ? "late" : "open";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `rd ${bare ? "rd-bare" : ""} ${dark ? "dark" : ""} ${className}`,
      "data-ts-theme": theme ? dark ? "dark" : "cream" : void 0,
      "data-theme": theme ? dark ? "dark" : "light" : void 0,
      children: [
        /* @__PURE__ */ jsx("style", { children: CSS }),
        !bare && /* @__PURE__ */ jsxs("div", { className: "rd-bar", children: [
          /* @__PURE__ */ jsxs("div", { className: "rd-dots", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx("i", {}),
            /* @__PURE__ */ jsx("i", {}),
            /* @__PURE__ */ jsx("i", {})
          ] }),
          /* @__PURE__ */ jsxs("b", { children: [
            c.name,
            " · ",
            v.person.role
          ] }),
          /* @__PURE__ */ jsxs("time", { dateTime: iso(today), children: [
            L.today,
            " · ",
            iso(today)
          ] })
        ] }),
        onPersonChange && /* @__PURE__ */ jsx("div", { className: "rd-roles", role: "group", "aria-label": L.scope, children: c.people.map((p) => /* @__PURE__ */ jsx("button", { type: "button", className: "rd-role", "aria-pressed": p.id === v.person.id, onClick: () => onPersonChange(p.id), children: p.role }, p.id)) }),
        /* @__PURE__ */ jsxs("div", { className: "rd-body", children: [
          /* @__PURE__ */ jsx("div", { className: "rd-head", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("span", { className: "rd-label", children: [
              L.scope,
              ": ",
              v.unit?.name
            ] }),
            /* @__PURE__ */ jsx("h2", { children: v.person.role }),
            /* @__PURE__ */ jsxs("p", { children: [
              v.person.name,
              " · ",
              v.projects.length,
              " төсөл · ",
              v.agents.length,
              " агент"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "rd-kpis", children: [
            /* @__PURE__ */ jsxs("div", { className: "rd-kpi", children: [
              /* @__PURE__ */ jsx("span", { className: "rd-label", children: L.open }),
              /* @__PURE__ */ jsx("b", { children: v.open.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rd-kpi", "data-tone": v.late.length ? "late" : void 0, children: [
              /* @__PURE__ */ jsx("span", { className: "rd-label", children: L.late }),
              /* @__PURE__ */ jsx("b", { children: v.late.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rd-kpi", "data-tone": v.waiting.length ? "wait" : void 0, children: [
              /* @__PURE__ */ jsx("span", { className: "rd-label", children: L.waitingK }),
              /* @__PURE__ */ jsx("b", { children: v.waiting.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rd-kpi", children: [
              /* @__PURE__ */ jsx("span", { className: "rd-label", children: L.agents }),
              /* @__PURE__ */ jsx("b", { children: v.agents.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rd-kpi", children: [
              /* @__PURE__ */ jsx("span", { className: "rd-label", children: L.decisions }),
              /* @__PURE__ */ jsx("b", { children: v.recent.length })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rd-grid", children: [
            /* @__PURE__ */ jsxs("section", { className: "rd-card", "aria-label": L.burning, children: [
              /* @__PURE__ */ jsxs("h3", { children: [
                L.burning,
                /* @__PURE__ */ jsx("span", { className: "rd-label", children: v.burning.length })
              ] }),
              v.burning.length ? /* @__PURE__ */ jsx("ul", { className: "rd-list", children: v.burning.slice(0, 6).map((b) => /* @__PURE__ */ jsxs("li", { className: "rd-burn", children: [
                /* @__PURE__ */ jsx("span", { className: "rd-dot", "data-k": b.kind, "aria-hidden": "true" }),
                /* @__PURE__ */ jsxs("span", { style: { minWidth: 0 }, children: [
                  /* @__PURE__ */ jsx("b", { children: b.task.title }),
                  /* @__PURE__ */ jsxs("small", { children: [
                    b.project.name,
                    " · ",
                    nameOf(c, b.task.ownerId)
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "rd-chip", "data-k": b.kind, children: b.kind === "late" ? L.overdue(b.days) : b.kind === "waiting" ? L.waiting : L.soon(b.days) })
              ] }, b.project.id + b.task.id)) }) : /* @__PURE__ */ jsx("p", { className: "rd-empty", children: L.burningEmpty })
            ] }),
            /* @__PURE__ */ jsxs("section", { className: "rd-card", "aria-label": L.approve, children: [
              /* @__PURE__ */ jsx("h3", { children: v.approvals.some((a) => a.mine) || !v.isHead ? L.approve : L.approveOthers }),
              v.approvals.length ? v.approvals.map((a) => {
                const k = a.workflow.id;
                return /* @__PURE__ */ jsxs("div", { className: "rd-appr", children: [
                  /* @__PURE__ */ jsx("b", { children: a.workflow.name }),
                  /* @__PURE__ */ jsx("span", { className: "rd-label", children: a.workflow.trigger }),
                  a.before.length > 0 && /* @__PURE__ */ jsx("ol", { children: a.before.map((s) => /* @__PURE__ */ jsxs("li", { children: [
                    /* @__PURE__ */ jsx("span", { children: s.actor }),
                    " — ",
                    s.output
                  ] }, s.id)) }),
                  /* @__PURE__ */ jsxs("div", { className: "rd-step", children: [
                    a.mine ? L.yourStep : a.approver,
                    ": ",
                    /* @__PURE__ */ jsx("b", { children: a.step.label }),
                    " → ",
                    a.step.output
                  ] }),
                  a.mine && /* @__PURE__ */ jsxs("div", { className: "rd-actions", children: [
                    /* @__PURE__ */ jsx("button", { type: "button", className: "rd-btn primary", disabled: done.has(k), onClick: () => setDone(new Set(done).add(k)), children: done.has(k) ? "✓" : L.approveBtn }),
                    /* @__PURE__ */ jsx("button", { type: "button", className: "rd-btn", children: L.look })
                  ] })
                ] }, k);
              }) : /* @__PURE__ */ jsx("p", { className: "rd-empty", children: L.noApprove })
            ] })
          ] }),
          v.isHead && /* @__PURE__ */ jsxs("section", { className: "rd-card", "aria-label": L.units, children: [
            /* @__PURE__ */ jsx("h3", { children: L.units }),
            /* @__PURE__ */ jsxs("table", { className: "rd-table", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { children: L.unit }),
                /* @__PURE__ */ jsx("th", { children: L.open }),
                /* @__PURE__ */ jsx("th", { children: L.late }),
                /* @__PURE__ */ jsx("th", { children: L.waitingK }),
                /* @__PURE__ */ jsx("th", { children: L.agents })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: v.unitHealth.map((u) => /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("td", { children: u.unit.name }),
                /* @__PURE__ */ jsx("td", { children: u.open }),
                /* @__PURE__ */ jsx("td", { "data-hot": u.late > 0, children: u.late }),
                /* @__PURE__ */ jsx("td", { children: u.waiting }),
                /* @__PURE__ */ jsx("td", { children: u.agents })
              ] }, u.unit.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rd-card", "aria-label": L.timeline, children: [
            /* @__PURE__ */ jsx("h3", { children: L.timeline }),
            v.projects.some((p) => p.due || p.tasks.some((t) => t.due)) ? /* @__PURE__ */ jsxs("div", { className: "rd-gantt", children: [
              /* @__PURE__ */ jsxs("div", { className: "rd-lane", children: [
                /* @__PURE__ */ jsx("span", {}),
                /* @__PURE__ */ jsx("div", { className: "rd-axis", children: ticks.map((t) => /* @__PURE__ */ jsx("span", { style: { left: x(t) }, children: t === 0 ? L.today : tick(t) }, t)) })
              ] }),
              v.projects.map((p) => {
                const ds = [p.due, ...p.tasks.map((t) => t.due)].filter(Boolean);
                const first = ds.length ? ds.reduce((m, d) => d < m ? d : m) : void 0;
                return /* @__PURE__ */ jsxs("div", { className: "rd-lane", children: [
                  /* @__PURE__ */ jsx("span", { title: p.name, children: p.name }),
                  /* @__PURE__ */ jsxs("div", { className: "rd-track", children: [
                    first && p.due && /* @__PURE__ */ jsx("i", { className: "rd-bar-p", style: { left: x(first), width: `calc(${x(p.due)} - ${x(first)})` } }),
                    /* @__PURE__ */ jsx("i", { className: "rd-now", style: { left: x(0) }, "aria-hidden": "true" }),
                    p.tasks.filter((t) => t.due).map((t) => /* @__PURE__ */ jsx("i", { className: "rd-pin", "data-k": kindOf(p, t), style: { left: x(t.due) }, title: `${t.title} · ${t.due}` }, t.id)),
                    p.due && /* @__PURE__ */ jsx("i", { className: "rd-pin", "data-k": "due", style: { left: x(p.due) }, title: `${p.name} · ${p.due}` })
                  ] })
                ] }, p.id);
              })
            ] }) : /* @__PURE__ */ jsx("p", { className: "rd-empty", children: L.noTimeline })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rd-grid", children: [
            /* @__PURE__ */ jsxs("section", { className: "rd-card", "aria-label": L.brief, children: [
              /* @__PURE__ */ jsx("h3", { children: L.brief }),
              /* @__PURE__ */ jsx("ul", { className: "rd-brief", children: v.decisions.slice(0, 4).map((d) => /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("time", { children: d.date.slice(5) }),
                /* @__PURE__ */ jsxs("span", { children: [
                  d.title,
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("small", { style: { color: "var(--ts-muted)" }, children: d.project })
                ] })
              ] }, d.project + d.id)) }),
              /* @__PURE__ */ jsx("div", { children: v.agents.map((a) => /* @__PURE__ */ jsxs("div", { className: "rd-agent", children: [
                /* @__PURE__ */ jsx("i", { "aria-hidden": "true", children: a.name.slice(0, 1) }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("b", { style: { fontWeight: 500 }, children: a.name }),
                  /* @__PURE__ */ jsxs("small", { children: [
                    a.role,
                    " · ",
                    a.skills.join(", ")
                  ] })
                ] })
              ] }, a.id)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 16 }, children: [
              v.okrs.length > 0 && /* @__PURE__ */ jsxs("section", { className: "rd-card", "aria-label": L.okr, children: [
                /* @__PURE__ */ jsx("h3", { children: L.okr }),
                v.okrs.map((o) => /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: 8 }, children: [
                  /* @__PURE__ */ jsx("b", { style: { fontSize: 14, fontWeight: 500 }, children: o.title }),
                  o.keyResults.map((k) => /* @__PURE__ */ jsxs("div", { className: "rd-kr", children: [
                    /* @__PURE__ */ jsx("span", { children: k.title }),
                    /* @__PURE__ */ jsx("span", { children: Number.isFinite(k.progress) ? `${k.progress}%` : "—" }),
                    /* @__PURE__ */ jsx("div", { className: "rd-meter", style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ jsx("i", { style: { width: `${Number.isFinite(k.progress) ? k.progress : 0}%` } }) })
                  ] }, k.id))
                ] }, o.id))
              ] }),
              v.finance && /* @__PURE__ */ jsxs("section", { className: "rd-card", "aria-label": L.model, children: [
                /* @__PURE__ */ jsx("h3", { children: L.model }),
                Array.isArray(c.model.revenue) && c.model.revenue.map((r) => typeof r === "object" && /* @__PURE__ */ jsxs("div", { className: "rd-kr", children: [
                  /* @__PURE__ */ jsx("span", { children: r.stream }),
                  /* @__PURE__ */ jsx("span", { children: r.share != null ? `${Math.round(r.share * 100)}%` : "—" }),
                  /* @__PURE__ */ jsx("div", { className: "rd-meter", style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ jsx("i", { style: { width: `${(r.share ?? 0) * 100}%` } }) })
                ] }, r.stream)),
                Array.isArray(c.model.costs) && /* @__PURE__ */ jsxs("p", { style: { margin: 0, fontSize: 13, color: "var(--ts-muted)" }, children: [
                  "Зардал: ",
                  c.model.costs.join(" · ")
                ] })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  RoleDashboard as R,
  roleView as a,
  findPerson as f,
  roleDashboardLabelsMn as r
};
//# sourceMappingURL=role-dashboard-CShmXzYY.js.map
