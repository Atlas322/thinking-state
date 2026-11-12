"use client";

import * as React from "react";
import { DecisionInboxChat, type DecisionChatItem } from "../library/decision-inbox-chat";
import { Dashboard, dashboardCss } from "./dashboard";
import { MethodologyView, methodologyCss, methodologyName, methodologyShort } from "./methodology";
import { PersonProfile, RaciView, raciCss } from "./raci";
import {
  LEVELS,
  actorOf,
  kindsOf,
  modelLines,
  rootsOf,
  scopeCompany,
  type Company,
  type CompanyLevel,
  METHODOLOGIES,
  type Methodology,
  type CompanyUnit,
  type ModelField,
  type UnitKind,
} from "./types";
import { Avatar, Lines, initials } from "./ui";
import { CollectionView, Empty, collectionCss, type Relation } from "./collection";
import { Icon, UNIT_ICON, typeIcon, typeLabel, type IconName } from "./icons";

/**
 * Company View — draws any company in the Company contract: business model,
 * process (unit tree), people ↔ agents, workflows, projects and decisions.
 * Zoom by level (institution / company / team): the view then shows only the
 * chosen unit's subtree. Read-only: it views a vault, it never writes.
 * The template is the organisation's own method (BMC, PMBOK, OKR, Lean
 * Canvas); the layout is one of two shells over the same data:
 *  - "workspace": the Second Brain OS app shell (unit tree on the side,
 *    breadcrumb header, tabs), after the 2026 Figma draft
 *  - "brief": one scrolling page with numbered sections, for reading
 * Projects reuse Session Board and Project Report; decisions reuse
 * Decision Inbox · Chat. Light and dark; motion off under reduced motion.
 */

export type CompanyLayout = "workspace" | "brief";
export type CompanyViewKey = "method" | "dashboard" | "structure" | "agents" | "workflows" | "raci" | "decisions";
export const COMPANY_VIEWS: CompanyViewKey[] = ["method", "dashboard", "structure", "agents", "workflows", "raci", "decisions"];

export type CompanyViewLabels = Record<CompanyViewKey | CompanyLevel | UnitKind | "model", string> & {
  customers: string;
  value: string;
  channels: string;
  revenue: string;
  units: string;
  people: string;
  agents_n: string;
  workflows_n: string;
  projects_n: string;
  level: string;
  views: string;
  layout: string;
  methodology: string;
  workspace: string;
  brief: string;
  noOwner: string;
  ownedBy: string;
  memory: string;
  trigger: string;
  approval: string;
  sequence: string;
  allProjects: string;
  empty: string;
  person: string;
  agent: string;
  types: string;
  source: Record<string, string>;
  segment: Record<string, string>;
};

export const companyLabelsMn: CompanyViewLabels = {
  method: "Арга зүй",
  model: "Бизнес загвар",
  dashboard: "Самбар",
  raci: "RACI",
  structure: "Процесс",
  agents: "Хүн ба агент",
  workflows: "Workflow",
  decisions: "Шийдвэр",
  institution: "Институц",
  company: "Компани",
  team: "Баг",
  department: "Хэлтэс",
  area: "Area",
  types: "Төрлүүд",
  customers: "Үйлчлүүлэгч",
  value: "Үнэ цэнэ",
  channels: "Суваг",
  revenue: "Орлогын урсгал",
  units: "Нэгж",
  people: "Хүн",
  agents_n: "Агент",
  workflows_n: "Workflow",
  projects_n: "Төсөл",
  level: "Түвшин",
  views: "Харагдац",
  layout: "Харагдац",
  methodology: "Арга зүй",
  workspace: "Ажлын орчин",
  brief: "Тайлан",
  noOwner: "Нэгжийн агент",
  ownedBy: "Эзэн",
  memory: "санах ой",
  trigger: "Эхлэх нөхцөл",
  approval: "хүний батламж",
  sequence: "дараалал",
  allProjects: "Бүгд",
  empty: "Энэ түвшинд мэдээлэл алга.",
  person: "Хүн",
  agent: "Агент",
  source: { acme: "ac.me ертөнц", vault: "Тэмдэглэлийн сан", visitor: "Зочин" },
  segment: { personal: "Хувь", team: "Баг", company: "Компани", institutional: "Институц" },
};

export type CompanyViewProps = {
  company: Company;
  /** Shell: app workspace or one scrolling brief. */
  layout?: CompanyLayout;
  defaultLayout?: CompanyLayout;
  onLayoutChange?: (l: CompanyLayout) => void;
  showLayoutSwitch?: boolean;
  /** Template = the organisation's method; defaults to company.methodology, then BMC. */
  methodology?: Methodology;
  onMethodologyChange?: (m: Methodology) => void;
  showMethodologySwitch?: boolean;
  /** "Today" for due-date filters and the Gantt marker. */
  today?: Date;
  defaultLevel?: CompanyLevel;
  /** Unit to open first; its kind decides the level. */
  defaultUnitId?: string;
  defaultView?: CompanyViewKey;
  onScopeChange?: (scope: { level: CompanyLevel; unitId: string | null }) => void;
  labels?: Partial<CompanyViewLabels>;
  className?: string;
};

const levelOfKind = (k: UnitKind): CompanyLevel => (k === "institution" ? "institution" : k === "company" ? "company" : "team");
const TAB_ICON: Record<CompanyViewKey, IconName> = {
  method: "layout-template",
  dashboard: "layout-dashboard",
  structure: "network",
  agents: "bot",
  workflows: "workflow",
  raci: "grid-3x3",
  decisions: "git-branch",
};
/* ───────────── views ───────────── */

function ModelView({ c, scoped, L }: { c: Company; scoped: Company; L: CompanyViewLabels }) {
  const stats = [
    { k: L.units, v: scoped.units.length },
    { k: L.people, v: scoped.people.length },
    { k: L.agents_n, v: scoped.agents.length },
    { k: L.workflows_n, v: scoped.workflows.length },
    { k: L.projects_n, v: scoped.projects.length },
  ];
  const cells: [string, ModelField][] = [
    [L.customers, c.model.customers],
    [L.value, c.model.value],
    [L.channels, c.model.channels],
    [L.revenue, c.model.revenue],
  ];
  return (
    <div className="cv-model">
      <dl className="cv-stats">
        {stats.map((s, i) => (
          <div key={s.k} className="cv-stat" style={{ "--i": i } as React.CSSProperties}>
            <dt>{s.k}</dt>
            <dd>{s.v}</dd>
          </div>
        ))}
      </dl>
      <div className="cv-canvas">
        {cells.map(([k, f], i) => (
          <section key={k} className={`cv-cell cv-cell-${i}`} style={{ "--i": i } as React.CSSProperties}>
            <h4>{k}</h4>
            <Lines f={f} />
          </section>
        ))}
      </div>
    </div>
  );
}

function StructureView({ scoped, L, onPick, onPerson, current }: { scoped: Company; L: CompanyViewLabels; onPick: (u: CompanyUnit) => void; onPerson: (id: string) => void; current: string | null }) {
  const kids = (id: string) => scoped.units.filter((u) => u.parentId === id && u.id !== id);
  let order = 0;
  const node = (u: CompanyUnit, depth: number, seen: Set<string>): React.ReactNode => {
    if (seen.has(u.id)) return null;
    seen.add(u.id);
    const people = scoped.people.filter((p) => p.unitId === u.id);
    const agents = scoped.agents.filter((a) => a.unitId === u.id);
    const flows = scoped.workflows.filter((w) => w.unitId === u.id).length;
    const ch = kids(u.id);
    const i = order++;
    return (
      <li key={u.id} className={`cv-node is-${u.kind}`} style={{ "--i": i, "--d": depth } as React.CSSProperties}>
        <div className="cv-node-card" aria-current={current === u.id ? "true" : undefined}>
          <button type="button" className="cv-node-pick" onClick={() => onPick(u)}>
            <span className="cv-node-top">
              <span className={`cv-kind is-${u.kind}`}>{L[u.kind]}</span>
              <span className="cv-node-name">{u.name}</span>
            </span>
          </button>
          <span className="cv-node-meta">
            <span className="cv-faces" role="group" aria-label={`${people.length} ${L.people}`}>
              {people.slice(0, 4).map((p) => (
                <button key={p.id} type="button" className="cv-face" onClick={() => onPerson(p.id)} aria-label={`${p.name} — профайл`} title={p.name}>
                  <Avatar actor={{ name: p.name, kind: "person" }} size={20} />
                </button>
              ))}
              {people.length > 4 && <span className="cv-more">+{people.length - 4}</span>}
            </span>
            {agents.length > 0 && (
              <span className="cv-pill">
                ✦ {agents.length} {L.agents_n.toLowerCase()}
              </span>
            )}
            {flows > 0 && (
              <span className="cv-pill">
                ↻ {flows} {L.workflows_n}
              </span>
            )}
          </span>
        </div>
        {ch.length > 0 && <ul className="cv-tree">{ch.map((k) => node(k, depth + 1, seen))}</ul>}
      </li>
    );
  };
  const seen = new Set<string>();
  const roots = rootsOf(scoped.units);
  if (!roots.length) return <Empty text={L.empty} icon="network" />;
  return <ul className="cv-tree cv-tree-root">{roots.map((r) => node(r, 0, seen))}</ul>;
}

function AgentCard({ a, c, L, showOwner }: { a: Company["agents"][number]; c: Company; L: CompanyViewLabels; showOwner?: boolean }) {
  const owner = a.ownerId ? actorOf(c, a.ownerId) : null;
  return (
    <li className="cv-agent">
      <span className="cv-agent-top">
        <Avatar actor={{ name: a.name, kind: "agent" }} size={26} />
        <span className="cv-agent-id">
          <strong>{a.name}</strong>
          <span>{a.role}</span>
        </span>
      </span>
      {a.skills.length > 0 && (
        <span className="cv-skills">
          {a.skills.map((s) => (
            <span key={s} className="cv-skill">
              {s}
            </span>
          ))}
        </span>
      )}
      <span className="cv-agent-foot">
        {showOwner && owner && (
          <span>
            {L.ownedBy}: {owner.name}
          </span>
        )}
        {a.memory.length > 0 ? (
          <details className="cv-mem">
            <summary>
              {a.memory.length} {L.memory}
            </summary>
            <ul>
              {a.memory.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </details>
        ) : (
          <span className="cv-mem-none">0 {L.memory}</span>
        )}
      </span>
    </li>
  );
}

function AgentsView({ c, scoped, L, onPerson }: { c: Company; scoped: Company; L: CompanyViewLabels; onPerson: (id: string) => void }) {
  const inScope = new Set(scoped.people.map((p) => p.id));
  const sections = scoped.units
    .map((u) => {
      const people = scoped.people.filter((p) => p.unitId === u.id).map((p) => ({ p, agents: scoped.agents.filter((a) => a.ownerId === p.id) }));
      const loose = scoped.agents.filter((a) => a.unitId === u.id && !(a.ownerId && inScope.has(a.ownerId)));
      return { u, people, loose };
    })
    .filter((s) => s.people.length || s.loose.length);
  if (!sections.length) return <Empty text={L.empty} icon="bot" />;
  return (
    <div className="cv-agents">
      {sections.map(({ u, people, loose }, i) => (
        <section key={u.id} className="cv-unit-block" style={{ "--i": i } as React.CSSProperties} aria-label={u.name}>
          <h4 className="cv-unit-h">
            <span className={`cv-kind is-${u.kind}`}>{L[u.kind]}</span>
            {u.name}
          </h4>
          <ul className="cv-pairs">
            {people.map(({ p, agents }) => (
              <li key={p.id} className="cv-pair">
                <button type="button" className="cv-person" onClick={() => onPerson(p.id)} aria-label={`${p.name}, ${p.role} — профайл`}>
                  <Avatar actor={{ name: p.name, kind: "person" }} size={30} />
                  <span>
                    <strong>{p.name}</strong>
                    <span>{p.role}</span>
                  </span>
                </button>
                <span className={`cv-link${agents.length ? "" : " is-none"}`} aria-hidden="true" />
                <ul className="cv-agent-list">
                  {agents.map((a) => (
                    <AgentCard key={a.id} a={a} c={c} L={L} />
                  ))}
                </ul>
              </li>
            ))}
            {loose.length > 0 && (
              <li className="cv-pair is-loose">
                <span className="cv-person is-unit">
                  <span className="cv-ava is-unit" style={{ "--s": "30px" } as React.CSSProperties} aria-hidden="true">
                    ◇
                  </span>
                  <span>
                    <strong>{L.noOwner}</strong>
                    <span>{u.name}</span>
                  </span>
                </span>
                <span className="cv-link" aria-hidden="true" />
                <ul className="cv-agent-list">
                  {loose.map((a) => (
                    <AgentCard key={a.id} a={a} c={c} L={L} showOwner />
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}

function WorkflowView({ c, scoped, L }: { c: Company; scoped: Company; L: CompanyViewLabels }) {
  if (!scoped.workflows.length) return <Empty text={L.empty} icon="workflow" />;
  return (
    <div className="cv-flows">
      {scoped.workflows.map((w, i) => {
        const unit = c.units.find((u) => u.id === w.unitId);
        return (
          <article key={w.id} className="cv-flow" style={{ "--i": i } as React.CSSProperties} aria-label={w.name}>
            <header className="cv-flow-head">
              <strong>{w.name}</strong>
              {unit && <span className="cv-flow-unit">{unit.name}</span>}
              <span className="cv-trigger" title={L.trigger}>
                <span aria-hidden="true">⚡</span> {w.trigger}
              </span>
            </header>
            <ol className="cv-steps" style={{ "--n": w.steps.length } as React.CSSProperties}>
              {w.steps.map((s, j) => {
                const actor = actorOf(c, s.actorId);
                const next = w.steps[j + 1];
                const gate = next && actorOf(c, next.actorId).kind === "person";
                return (
                  <li key={s.id} className={`cv-step is-${actor.kind}${gate ? " gate-next" : ""}`} style={{ "--j": j } as React.CSSProperties}>
                    <span className="cv-step-n">{String(j + 1).padStart(2, "0")}</span>
                    <span className="cv-step-label">{s.label}</span>
                    <span className="cv-step-actor">
                      <Avatar actor={actor} size={20} />
                      <span>{actor.name}</span>
                      <span className="cv-sr">
                        , {actor.kind === "agent" ? L.agent : L.person}
                      </span>
                    </span>
                    <span className="cv-step-out">↳ {s.output}</span>
                  </li>
                );
              })}
            </ol>
          </article>
        );
      })}
      <p className="cv-legend" aria-hidden="true">
        <span className="cv-legend-line" /> {L.sequence}
        <span className="cv-legend-line is-gate" /> {L.approval}
        <span className="cv-ava is-person" style={{ "--s": "16px" } as React.CSSProperties}>
          А
        </span>{" "}
        {L.person}
        <span className="cv-ava is-agent" style={{ "--s": "16px" } as React.CSSProperties}>
          ✦
        </span>{" "}
        {L.agent}
      </p>
    </div>
  );
}

function DecisionsView({ scoped, L }: { scoped: Company; L: CompanyViewLabels }) {
  const decisions: DecisionChatItem[] = scoped.projects
    .flatMap((p) => p.decisions.map((d) => ({ id: `${p.id}:${d.id}`, title: d.title, project: p.name, due: d.date, options: [{ id: "made", label: "Шийдсэн" }] })))
    .sort((a, b) => (b.due ?? "").localeCompare(a.due ?? ""));
  if (!decisions.length) return <Empty text={L.empty} icon="git-branch" />;
  return (
    <div className="cv-decisions">
      <DecisionInboxChat
        title={`${L.decisions} · ${decisions.length}`}
        decisions={decisions}
        chosen={Object.fromEntries(decisions.map((d) => [d.id, "made"]))}
        labels={{ open: "нээлттэй", allDone: "Бүх шийдвэр бүртгэгдсэн.", chosen: "Төлөв", due: "Огноо", urgent: "Өнөөдөр", undo: "" }}
      />
    </div>
  );
}

/* ───────────── shell ───────────── */

export function CompanyView({
  company,
  layout: layoutProp,
  defaultLayout = "workspace",
  onLayoutChange,
  showLayoutSwitch = true,
  methodology: methodologyProp,
  onMethodologyChange,
  showMethodologySwitch = true,
  today,
  defaultLevel,
  defaultUnitId,
  defaultView = "method",
  onScopeChange,
  labels: labelsProp,
  className = "",
}: CompanyViewProps) {
  const L = { ...companyLabelsMn, ...labelsProp };
  const uid = React.useId();
  const available = LEVELS.filter((lv) => company.units.some((u) => kindsOf[lv].includes(u.kind)));
  const firstUnit = (lv: CompanyLevel) => company.units.find((u) => kindsOf[lv].includes(u.kind)) ?? null;
  const initial = (() => {
    const u = company.units.find((x) => x.id === defaultUnitId);
    if (u) return { level: levelOfKind(u.kind), unitId: u.id };
    const lv = defaultLevel && available.includes(defaultLevel) ? defaultLevel : (available[0] ?? "company");
    return { level: lv, unitId: firstUnit(lv)?.id ?? null };
  })();
  const [scope, setScopeState] = React.useState(initial);
  const [view, setView] = React.useState<CompanyViewKey>(defaultView);
  const [layoutOwn, setLayoutOwn] = React.useState<CompanyLayout>(defaultLayout);
  const layout = layoutProp ?? layoutOwn;
  const [methodOwn, setMethodOwn] = React.useState<Methodology>(company.methodology ?? "bmc");
  const methodology = methodologyProp ?? methodOwn;
  const [personId, setPersonId] = React.useState<string | null>(null);
  const [collectionType, setCollectionType] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tabsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const firstView = React.useRef(true);
  React.useEffect(() => {
    // keep the chosen tab visible in the scrolling tab strip (phones)
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    const tab = tabsRef.current[COMPANY_VIEWS.indexOf(view)];
    const strip = tab?.parentElement;
    if (tab && strip) strip.scrollTo?.({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [view]);

  React.useEffect(() => {
    setScopeState(initial);
    setMethodOwn(company.methodology ?? "bmc");
    setPersonId(null);
    setCollectionType(null);
    // a new company resets the scope and its method
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company.id]);

  const setScope = (next: { level: CompanyLevel; unitId: string | null }) => {
    setScopeState(next);
    onScopeChange?.(next);
  };
  const pickLevel = (lv: CompanyLevel) => {
    if (!available.includes(lv)) return;
    // Stay related to where you are: an ancestor of that kind first (zoom
    // out), then one inside the current unit (zoom in), then the first one.
    const kinds = kindsOf[lv];
    const byId = (id?: string) => company.units.find((u) => u.id === id);
    let up = byId(scope.unitId ?? undefined);
    for (let guard = 0; up && guard < 50 && !kinds.includes(up.kind); guard++) up = byId(up.parentId);
    const down = scopeCompany(company, scope.unitId).units.find((u) => kinds.includes(u.kind));
    setScope({ level: lv, unitId: (up && kinds.includes(up.kind) ? up : down ?? firstUnit(lv))?.id ?? null });
  };
  const pickUnit = (u: CompanyUnit) => {
    setCollectionType(null);
    setScope({ level: u.kind === "area" ? scope.level : levelOfKind(u.kind), unitId: u.id });
  };
  const setLayout = (l: CompanyLayout) => {
    setLayoutOwn(l);
    onLayoutChange?.(l);
  };
  const setMethodology = (m: Methodology) => {
    setMethodOwn(m);
    onMethodologyChange?.(m);
  };
  const closeProfile = React.useCallback(() => setPersonId(null), []);

  // A refreshed company may drop the unit in view: fall back to the start.
  React.useEffect(() => {
    if (scope.unitId && !company.units.some((u) => u.id === scope.unitId)) setScopeState(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company.units, scope.unitId]);
  const scoped = scopeCompany(company, scope.unitId);
  const unit = company.units.find((u) => u.id === scope.unitId) ?? null;
  const path: CompanyUnit[] = [];
  for (let u = unit, guard = 0; u && guard < 20; u = company.units.find((x) => x.id === u!.parentId) ?? null, guard++) path.unshift(u);
  const levelUnits = company.units.filter((u) => kindsOf[scope.level].includes(u.kind));
  const counts: Record<CompanyViewKey, number | null> = {
    method: null,
    dashboard: scoped.projects.length,
    structure: scoped.units.length,
    agents: scoped.agents.length,
    workflows: scoped.workflows.length,
    raci: scoped.projects.filter((p) => p.raci).length,
    decisions: scoped.projects.reduce((n, p) => n + p.decisions.length, 0),
  };
  const tabLabel = (v: CompanyViewKey) => (v === "method" ? methodologyShort[methodology] : L[v]);
  const person = company.people.find((p) => p.id === personId) ?? null;
  const collections = company.collections ?? [];
  const collection = collections.find((c) => c.type === collectionType) ?? null;
  /** Relation values (ids, names or [[links]]) → chip with icon; units switch scope, people open profiles. */
  const resolve = (field: string, raw: string): Relation | null => {
    const v = raw.replace(/^\[\[|\]\]$/g, "").split("|")[0].split("/").pop()?.replace(/\.md$/, "") ?? raw;
    const unitHit = company.units.find((u) => u.id === raw || u.name === v);
    if (unitHit)
      return { label: unitHit.name, icon: UNIT_ICON[unitHit.kind] ?? "layout-grid", onClick: () => pickUnit(unitHit) };
    const personHit = company.people.find((x) => x.id === raw || x.name === v);
    if (personHit) return { label: personHit.name, icon: "user", onClick: () => setPersonId(personHit.id) };
    const agentHit = company.agents.find((x) => x.id === raw || x.name === v);
    if (agentHit) return { label: agentHit.name, icon: "bot" };
    const projectHit = company.projects.find((x) => x.id === raw || x.name === v);
    if (projectHit) return { label: projectHit.name, icon: "folder" };
    const f = field.toLowerCase();
    if (f === "company") return { label: v, icon: "building-2" };
    if (f.includes("area")) return { label: v, icon: "layout-grid" };
    return null;
  };
  const segmentText = company.segmentLabel ?? L.segment[company.segment] ?? company.segment;
  const scopeName = unit?.name ?? company.name;

  const render = (v: CompanyViewKey) =>
    v === "method" ? (
      <>
        <MethodologyView c={company} scoped={scoped} methodology={methodology} today={today} />
        {methodology === "okr" && (
          <section className="cv-sub" aria-label={L.model}>
            <h4 className="cv-below-h">{L.model}</h4>
            <ModelView c={company} scoped={scoped} L={L} />
          </section>
        )}
      </>
    ) : v === "dashboard" ? (
      <Dashboard c={company} scoped={scoped} today={today} empty={L.empty} key={scope.unitId ?? "all"} />
    ) : v === "structure" ? (
      <StructureView scoped={scoped} L={L} onPick={pickUnit} onPerson={setPersonId} current={scope.unitId} />
    ) : v === "agents" ? (
      <AgentsView c={company} scoped={scoped} L={L} onPerson={setPersonId} />
    ) : v === "workflows" ? (
      <WorkflowView c={company} scoped={scoped} L={L} />
    ) : v === "raci" ? (
      <RaciView c={company} scoped={scoped} onPerson={setPersonId} empty="RACI бүртгэгдээгүй." />
    ) : (
      <DecisionsView scoped={scoped} L={L} />
    );

  const levelSwitch = (
    <div className="cv-seg" role="radiogroup" aria-label={L.level}>
      {LEVELS.map((lv) => (
        <button
          key={lv}
          type="button"
          role="radio"
          aria-checked={scope.level === lv}
          disabled={!available.includes(lv)}
          data-active={scope.level === lv || undefined}
          onClick={() => pickLevel(lv)}
        >
          {L[lv]}
        </button>
      ))}
    </div>
  );
  const methodSwitch = showMethodologySwitch && (
    <div className="cv-seg cv-method-switch" role="radiogroup" aria-label={L.methodology}>
      {METHODOLOGIES.map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={methodology === m}
          data-active={methodology === m || undefined}
          title={methodologyName[m]}
          onClick={() => setMethodology(m)}
        >
          {methodologyShort[m]}
        </button>
      ))}
    </div>
  );
  const layoutSwitch = showLayoutSwitch && (
    <div className="cv-seg cv-tpl" role="radiogroup" aria-label={L.layout}>
      {(["workspace", "brief"] as const).map((t) => (
        <button key={t} type="button" role="radio" aria-checked={layout === t} data-active={layout === t || undefined} onClick={() => setLayout(t)}>
          {L[t]}
        </button>
      ))}
    </div>
  );
  const switches = (
    <span className="cv-switches">
      {methodSwitch}
      {layoutSwitch}
    </span>
  );
  const profile = person && (
    <PersonProfile
      c={company}
      person={person}
      onClose={closeProfile}
      themeClass={rootRef.current?.closest(".dark,[data-theme=dark]") ? "dark" : ""}
    />
  );
  const unitChips = (
    <div className="cv-chips cv-unit-chips" role="group" aria-label={L[scope.level]}>
      {levelUnits.map((u) => (
        <button key={u.id} type="button" aria-pressed={u.id === scope.unitId} onClick={() => pickUnit(u)}>
          {u.name}
        </button>
      ))}
    </div>
  );
  const tags = (
    <span className="cv-tags">
      {unit && (
        <span className={`cv-kind is-${unit.kind}`}>
          <Icon name={UNIT_ICON[unit.kind] ?? "building-2"} size={14} />
          {L[unit.kind]}
        </span>
      )}
      {segmentText !== (unit ? L[unit.kind] : "") && <span className="cv-tag">{segmentText}</span>}
      <span className="cv-tag is-src">{L.source[company.source] ?? company.source}</span>
    </span>
  );

  if (layout === "brief") {
    return (
      <div ref={rootRef} className={`cv ${className}`} data-template="brief" data-methodology={methodology}>
        <style>{css}</style>
        <div className="cv-brief">
        <header className="cv-hero">
          <div className="cv-hero-top">
            <span className="cv-eyebrow">
              {company.name}
              {path.length > 1 && ` / ${path.slice(1).map((u) => u.name).join(" / ")}`}
            </span>
            {switches}
          </div>
          <h2 className="cv-hero-title">{scopeName}</h2>
          {tags}
          <p className="cv-hero-line">{modelLines(company.model.value)[0]?.text}</p>
          <div className="cv-hero-bar">
            {levelSwitch}
            {unitChips}
          </div>
        </header>
        {COMPANY_VIEWS.map((v, i) => (
          <section key={v} className="cv-section" aria-labelledby={`${uid}-${v}`} style={{ "--i": i } as React.CSSProperties}>
            <h3 id={`${uid}-${v}`} className="cv-section-h">
              <span className="cv-num">{String(i + 1).padStart(2, "0")}</span>
              <Icon name={TAB_ICON[v]} size={20} />
              {v === "method" ? methodologyName[methodology] : L[v]}
              {counts[v] != null && <span className="cv-count">{counts[v]}</span>}
            </h3>
            {render(v)}
          </section>
        ))}
        {collections.length > 0 && (
          <section className="cv-section" aria-labelledby={`${uid}-types`}>
            <h3 id={`${uid}-types`} className="cv-section-h">
              <span className="cv-num">{String(COMPANY_VIEWS.length + 1).padStart(2, "0")}</span>
              <Icon name="database" size={20} />
              {L.types}
              <span className="cv-count">{collections.length}</span>
            </h3>
            <div className="cv-chips cv-type-chips" role="group" aria-label={L.types}>
              {collections.map((c) => (
                <button key={c.type} type="button" aria-pressed={(collection ?? collections[0]).type === c.type} onClick={() => setCollectionType(c.type)}>
                  <Icon name={typeIcon(c.type)} size={14} />
                  {c.label ?? typeLabel(c.type)} <span>{c.items.length}</span>
                </button>
              ))}
            </div>
            <CollectionView key={(collection ?? collections[0]).type} collection={collection ?? collections[0]} today={today} resolve={resolve} />
          </section>
        )}
        </div>
        {profile}
      </div>
    );
  }

  const roots = rootsOf(company.units);
  const tree = (parent: string | undefined, depth: number, seen = new Set<string>()): React.ReactNode => {
    const list = (parent ? company.units.filter((u) => u.parentId === parent) : roots).filter((u) => !seen.has(u.id));
    if (!list.length) return null;
    return (
      <ul className="cv-nav-list">
        {list.map((u) => {
          seen.add(u.id);
          const inScope = scoped.units.some((x) => x.id === u.id);
          return (
            <li key={u.id}>
              <button
                type="button"
                className="cv-nav-item"
                style={{ "--d": depth } as React.CSSProperties}
                aria-current={u.id === scope.unitId && !collection ? "true" : undefined}
                data-in={inScope || undefined}
                onClick={() => pickUnit(u)}
              >
                <span className={`cv-nav-glyph is-${u.kind}`}>
                  <Icon name={UNIT_ICON[u.kind] ?? "building-2"} size={16} />
                </span>
                <span className="cv-nav-name">{u.name}</span>
              </button>
              {tree(u.id, depth + 1, seen)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div ref={rootRef} className={`cv ${className}`} data-template="workspace" data-methodology={methodology}>
      <style>{css}</style>
      <div className="cv-ws">
      <aside className="cv-side" aria-label={company.name}>
        <div className="cv-brand">
          <span className="cv-brand-mark" aria-hidden="true">
            {initials(company.name).charAt(0)}
          </span>
          <span className="cv-brand-text">
            <strong>{company.name}</strong>
            <small>
              {segmentText} · {L.source[company.source] ?? company.source}
            </small>
          </span>
        </div>
        <div className="cv-side-level">{levelSwitch}</div>
        <nav className="cv-nav" aria-label={L.units}>
          {tree(undefined, 0)}
        </nav>
        <div className="cv-side-chips">{unitChips}</div>
        {collections.length > 0 && (
          <nav className="cv-types" aria-label={L.types}>
            <h4 className="cv-types-h">
              <Icon name="database" size={14} />
              {L.types}
            </h4>
            <ul className="cv-nav-list">
              {collections.map((c) => (
                <li key={c.type}>
                  <button
                    type="button"
                    className="cv-nav-item"
                    aria-current={collectionType === c.type ? "true" : undefined}
                    onClick={() => setCollectionType(c.type)}
                  >
                    <span className="cv-nav-glyph">
                      <Icon name={typeIcon(c.type)} size={16} />
                    </span>
                    <span className="cv-nav-name">{c.label ?? typeLabel(c.type)}</span>
                    <span className="cv-nav-count">{c.items.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>
      <main className="cv-main">
        <header className="cv-head">
          <div className="cv-head-top">
            <nav className="cv-crumbs" aria-label={L.level}>
              {path.map((u, i) => (
                <React.Fragment key={u.id}>
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <button type="button" onClick={() => pickUnit(u)} aria-current={i === path.length - 1 && !collection ? "page" : undefined}>
                    {u.name}
                  </button>
                </React.Fragment>
              ))}
              {collection && (
                <>
                  <span aria-hidden="true">/</span>
                  <span>{L.types}</span>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page">{collection.label ?? typeLabel(collection.type)}</span>
                </>
              )}
            </nav>
            {switches}
          </div>
          <h2 className="cv-title">
            {collection ? (
              <>
                <Icon name={typeIcon(collection.type)} size={20} />
                {collection.label ?? typeLabel(collection.type)}
                <span className="cv-title-n">{collection.items.length}</span>
              </>
            ) : (
              scopeName
            )}
          </h2>
          {!collection && tags}
          <div
            className="cv-tabs"
            role="tablist"
            aria-label={L.views}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const at = COMPANY_VIEWS.indexOf(view);
              const n = (at + (e.key === "ArrowRight" ? 1 : -1) + COMPANY_VIEWS.length) % COMPANY_VIEWS.length;
              setView(COMPANY_VIEWS[n]);
              tabsRef.current[n]?.focus();
            }}
          >
            {COMPANY_VIEWS.map((v, i) => (
              <button
                key={v}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${v}`}
                aria-selected={view === v && !collection}
                aria-controls={`${uid}-panel`}
                tabIndex={view === v ? 0 : -1}
                onClick={() => {
                  setView(v);
                  setCollectionType(null);
                }}
              >
                <Icon name={TAB_ICON[v]} size={16} />
                {tabLabel(v)}
                {counts[v] != null && <span>{counts[v]}</span>}
              </button>
            ))}
          </div>
        </header>
        {collection ? (
          <section className="cv-panel" aria-label={collection.label ?? typeLabel(collection.type)} key={`collection-${collection.type}`}>
            <CollectionView collection={collection} today={today} resolve={resolve} />
          </section>
        ) : (
          <section id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${view}`} className="cv-panel" key={`${view}-${scope.unitId}`}>
            {render(view)}
          </section>
        )}
      </main>
      </div>
      {profile}
    </div>
  );
}

const baseCss = `
.cv{--cv-bg:#fff;--cv-page:#f7f7f8;--cv-fg:#18181b;--cv-muted:#71717a;--cv-faint:#a1a1aa;--cv-line:#ececef;--cv-soft:#f4f4f5;--cv-accent:#4f7cf0;--cv-accent-soft:#e8f1fe;--cv-green:#16a34a;--cv-green-soft:#e9f8ee;--cv-amber:#c2620a;--cv-amber-soft:#fff4e0;--cv-violet:#7c3aed;--cv-violet-soft:#f1ebfd;--cv-teal:#0f8a7e;--cv-teal-soft:#e2f6f3;--cv-yellow:#b58105;--cv-yellow-soft:#fdf6dc;--cv-red:#dc2626;--cv-red-soft:#fdecec;--cv-seg-on:#fff;position:relative;width:100%;color:var(--cv-fg);font:400 14px/1.45 Inter,system-ui,sans-serif;container:cv/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .cv{--cv-bg:#1b1b1e;--cv-page:#141416;--cv-fg:#ececef;--cv-muted:#a1a1aa;--cv-faint:#71717a;--cv-line:#2e2e33;--cv-soft:#26262a;--cv-accent:#7c9cff;--cv-accent-soft:#1b2a44;--cv-green:#4ade80;--cv-green-soft:#16301f;--cv-amber:#eba659;--cv-amber-soft:#3a2a12;--cv-violet:#a78bfa;--cv-violet-soft:#2a2140;--cv-teal:#5eead4;--cv-teal-soft:#123330;--cv-yellow:#e8c25a;--cv-yellow-soft:#352c10;--cv-red:#f87171;--cv-red-soft:#3a1d1f;--cv-seg-on:#3a3a40;color-scheme:dark}
.cv *{box-sizing:border-box}:where(.cv) button{font:inherit;color:inherit;cursor:pointer}
.cv :focus-visible{outline:2px solid var(--cv-accent);outline-offset:1px}
.cv-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* shared bits */
.cv-seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:var(--cv-soft);max-width:100%;overflow-x:auto;scrollbar-width:none}
.cv-seg button{flex:none;height:28px;padding:0 10px;border:0;border-radius:6px;background:none;color:var(--cv-muted);font-size:13px;font-weight:500;white-space:nowrap;transition:color .1s,background .15s,box-shadow .15s}
.cv-seg button:hover:not(:disabled){color:var(--cv-fg)}
.cv-seg button[data-active]{background:var(--cv-seg-on);color:var(--cv-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
.cv-seg button:disabled{opacity:.4;cursor:not-allowed}
.cv-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:1px}
.cv-chips::-webkit-scrollbar{display:none}
.cv-chips button{flex:none;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px;border:1px solid var(--cv-line);border-radius:15px;background:var(--cv-bg);font-size:13px;white-space:nowrap;transition:background .15s,border-color .15s}
.cv-chips button:hover{background:var(--cv-soft)}
.cv-chips button[aria-pressed=true]{border-color:color-mix(in srgb,var(--cv-accent) 50%,var(--cv-line));background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 65%,var(--cv-fg));font-weight:500}
.cv-chips button span{color:var(--cv-muted);font-size:12px}
.cv-dot{width:7px;height:7px;border-radius:50%;background:var(--cv-faint)}
.cv-dot.is-done{background:var(--cv-green)}.cv-dot.is-active{background:var(--cv-accent)}.cv-dot.is-blocked{background:var(--cv-amber)}
.cv-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.cv-tag,.cv-kind{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:5px;font-size:11.5px;font-weight:500;white-space:nowrap;background:var(--cv-soft);color:var(--cv-muted)}
.cv-tag.is-src{background:none;border:1px solid var(--cv-line)}
.cv-kind.is-institution{background:var(--cv-violet-soft);color:color-mix(in srgb,var(--cv-violet) 80%,var(--cv-fg))}
.cv-kind.is-company{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 70%,var(--cv-fg))}
.cv-kind.is-department{background:var(--cv-teal-soft);color:color-mix(in srgb,var(--cv-teal) 75%,var(--cv-fg))}
.cv-kind.is-team{background:var(--cv-amber-soft);color:color-mix(in srgb,var(--cv-amber) 82%,var(--cv-fg))}
.cv-ava{display:inline-grid;place-items:center;flex:none;width:var(--s,22px);height:var(--s,22px);border-radius:50%;background:var(--cv-soft);border:1px solid var(--cv-line);color:var(--cv-muted);font-size:calc(var(--s,22px) * .42);font-weight:600;line-height:1}
.cv-ava.is-agent{border-radius:28%;background:var(--cv-accent-soft);border-color:color-mix(in srgb,var(--cv-accent) 35%,var(--cv-line));color:var(--cv-accent)}
.cv-ava.is-unit{border-style:dashed;background:none}
.cv-ava.is-unknown{border-style:dashed}
.cv-empty{margin:0;padding:24px;border:1px dashed var(--cv-line);border-radius:12px;color:var(--cv-muted);text-align:center}
.cv-pill{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:10px;background:var(--cv-soft);color:var(--cv-muted);font-size:11.5px;white-space:nowrap}
.cv-more{margin-left:4px;font-size:11.5px;color:var(--cv-faint)}
/* model */
.cv-model{display:flex;flex-direction:column;gap:12px}
.cv-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:0}
.cv-stat{display:flex;flex-direction:column-reverse;padding:10px 12px;border-radius:10px;background:var(--cv-bg);border:1px solid var(--cv-line);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 45ms)}
.cv-stat dt{font-size:12px;color:var(--cv-muted)}
.cv-stat dd{margin:0;font-size:22px;font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.cv-canvas{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cv-cell{padding:14px;border-radius:12px;background:var(--cv-bg);border:1px solid var(--cv-line);animation:cv-in .36s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 60ms + 120ms)}
.cv-cell h4{margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--cv-muted)}
.cv-cell-1{background:linear-gradient(160deg,var(--cv-accent-soft),var(--cv-bg) 70%)}
.cv-model-text{margin:0;font-size:15px;line-height:1.5}
.cv-model-list{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}
.cv-model-list li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid var(--cv-line)}
.cv-model-list li:last-child{border-bottom:0}
.cv-share{display:inline-flex;align-items:center;gap:8px;flex:none}
.cv-share-bar{position:relative;width:72px;height:6px;border-radius:3px;background:var(--cv-soft);overflow:hidden}
.cv-share-bar span{position:absolute;inset:0 auto 0 0;border-radius:3px;background:var(--cv-accent);transform-origin:left;animation:cv-grow .8s cubic-bezier(.2,.8,.3,1) .3s both}
.cv-share-n{min-width:34px;text-align:right;font-weight:600;font-variant-numeric:tabular-nums}
/* structure */
.cv-tree{position:relative;margin:0;padding:0;list-style:none}
.cv-tree .cv-tree{margin-left:18px;padding-left:16px;border-left:1.5px solid var(--cv-line)}
.cv-node{position:relative;padding-top:8px;animation:cv-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 40ms)}
.cv-tree .cv-tree>.cv-node::before{content:"";position:absolute;left:-16px;top:30px;width:14px;height:1.5px;background:var(--cv-line)}
.cv-node-card{display:flex;flex-direction:column;gap:6px;width:min(100%,520px);padding:10px 12px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);text-align:left;transition:border-color .15s,box-shadow .15s}
.cv-node-pick{display:block;width:100%;padding:0;border:0;background:none;text-align:left}
.cv-face{display:inline-flex;padding:0;border:0;border-radius:50%;background:none}
.cv-face:hover .cv-ava{border-color:var(--cv-accent);color:var(--cv-fg)}
.cv-faces .cv-face+.cv-face{margin-left:-6px}
button.cv-person{width:100%;border:0;text-align:left;color:inherit;transition:background .15s}
button.cv-person:hover{background:color-mix(in srgb,var(--cv-accent-soft) 60%,var(--cv-soft))}
.cv-switches{display:inline-flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}
.cv-sub{margin-top:18px}
.cv-node-card:hover{border-color:color-mix(in srgb,var(--cv-accent) 40%,var(--cv-line))}
.cv-node-card[aria-current=true]{border-color:var(--cv-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--cv-accent) 18%,transparent)}
.cv-node-top{display:flex;align-items:center;gap:8px;min-width:0}
.cv-node-name{font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-node-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.cv-faces{display:inline-flex;align-items:center}
.cv-faces .cv-ava+.cv-ava,.cv-faces .cv-face+.cv-face{margin-left:-6px}
.cv-faces .cv-ava{box-shadow:0 0 0 2px var(--cv-bg)}
/* agents */
.cv-agents{display:flex;flex-direction:column;gap:10px}
.cv-unit-block{padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms)}
.cv-unit-h{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:14px;font-weight:600}
.cv-pairs{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.cv-pair{display:grid;grid-template-columns:minmax(150px,220px) 28px 1fr;align-items:start;gap:0}
.cv-person{display:flex;align-items:center;gap:9px;min-width:0;padding:8px 10px;border-radius:10px;background:var(--cv-soft)}
.cv-person>span:last-child{display:flex;flex-direction:column;min-width:0}
.cv-person strong{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-person span span{font-size:12px;color:var(--cv-muted)}
.cv-person.is-unit{background:none;border:1px dashed var(--cv-line)}
.cv-link{position:relative;height:46px}
.cv-link::before{content:"";position:absolute;left:2px;right:4px;top:50%;height:1.5px;background:color-mix(in srgb,var(--cv-accent) 55%,var(--cv-line))}
.cv-link::after{content:"";position:absolute;right:2px;top:calc(50% - 3.5px);border:4px solid transparent;border-left:6px solid color-mix(in srgb,var(--cv-accent) 55%,var(--cv-line));border-right:0}
.cv-link.is-none::before,.cv-link.is-none::after{opacity:0}
.cv-agent-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px;margin:0;padding:0;list-style:none}
.cv-agent{display:flex;flex-direction:column;gap:6px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--cv-accent) 22%,var(--cv-line));border-radius:10px;background:var(--cv-bg)}
.cv-agent-top{display:flex;align-items:center;gap:8px;min-width:0}
.cv-agent-id{display:flex;flex-direction:column;min-width:0}
.cv-agent-id strong{font-weight:600}
.cv-agent-id span{font-size:12px;color:var(--cv-muted)}
.cv-skills{display:flex;flex-wrap:wrap;gap:4px}
.cv-skill{height:20px;padding:0 6px;border-radius:5px;background:var(--cv-soft);font-size:11.5px;line-height:20px;color:var(--cv-fg)}
.cv-agent-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px;font-size:12px;color:var(--cv-muted)}
.cv-mem summary{cursor:pointer;color:var(--cv-accent);list-style:none}
.cv-mem summary::-webkit-details-marker{display:none}
.cv-mem summary::before{content:"◆ ";font-size:9px}
.cv-mem ul{margin:4px 0 0;padding-left:16px;color:var(--cv-fg)}
.cv-mem-none{color:var(--cv-faint)}
/* workflows */
.cv-flows{display:flex;flex-direction:column;gap:10px}
.cv-flow{padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 60ms)}
.cv-flow-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin-bottom:12px}
.cv-flow-head strong{font-size:14.5px;font-weight:600}
.cv-flow-unit{font-size:12.5px;color:var(--cv-muted)}
.cv-trigger{margin-left:auto;display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 9px;border-radius:12px;background:var(--cv-amber-soft);color:color-mix(in srgb,var(--cv-amber) 82%,var(--cv-fg));font-size:12px;font-weight:500}
.cv-steps{display:grid;grid-template-columns:repeat(var(--n,4),minmax(118px,1fr));gap:26px;margin:0;padding:2px 2px 4px;list-style:none;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}
.cv-step{position:relative;display:flex;flex-direction:column;gap:6px;padding:10px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-page);animation:cv-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--j,0) * 90ms + 120ms)}
.cv-step.is-person{border-color:color-mix(in srgb,var(--cv-amber) 35%,var(--cv-line))}
.cv-step:not(:last-child)::after{content:"";position:absolute;right:-24px;top:22px;width:22px;height:1.5px;background:var(--cv-faint)}
.cv-step:not(:last-child)::before{content:"";position:absolute;right:-25px;top:18.5px;border:4px solid transparent;border-left:6px solid var(--cv-faint);border-right:0}
.cv-step.gate-next::after{background:var(--cv-amber)}.cv-step.gate-next::before{border-left-color:var(--cv-amber)}
.cv-step-n{font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--cv-faint)}
.cv-step-label{font-weight:600;line-height:1.3}
.cv-step-actor{display:flex;align-items:center;gap:6px;font-size:12.5px;min-width:0}
.cv-step-actor>span:nth-child(2){white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-step-out{font-size:12px;color:var(--cv-muted)}
.cv-legend{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:0;font-size:12px;color:var(--cv-muted)}
.cv-legend-line{display:inline-block;width:22px;height:1.5px;margin-left:8px;background:var(--cv-faint)}
.cv-legend-line:first-child{margin-left:0}
.cv-legend-line.is-gate{background:var(--cv-amber)}
.cv-legend .cv-ava{margin-left:8px}
/* projects + decisions reuse widgets */
.cv-projects{display:flex;flex-direction:column;gap:10px}
.cv-projects .sb,.cv-projects .rp{max-width:none}
.cv-decisions .di{max-width:none}
.cv-decisions .di-undo{display:none}
/* workspace template */
.cv-ws{display:grid;grid-template-columns:260px minmax(0,1fr);min-height:560px;border:1px solid var(--cv-line);border-radius:14px;background:var(--cv-page);overflow:hidden}
.cv-side{display:flex;flex-direction:column;gap:12px;padding:14px 10px;border-right:1px solid var(--cv-line);background:var(--cv-bg)}
.cv-brand{display:flex;align-items:center;gap:10px;padding:0 4px}
.cv-brand-mark{display:grid;place-items:center;flex:none;width:32px;height:32px;border-radius:9px;background:var(--cv-accent);color:#fff;font-weight:700}
.cv-brand-text{display:flex;flex-direction:column;min-width:0}
.cv-brand-text strong{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-brand-text small{font-size:12px;color:var(--cv-muted)}
.cv-side-level .cv-seg{display:flex}.cv-side-level .cv-seg button{flex:1 0 auto}
.cv-nav-list{margin:0;padding:0;list-style:none}
.cv-nav-item{display:flex;align-items:center;gap:8px;width:100%;min-height:32px;padding:4px 8px 4px calc(8px + var(--d,0) * 14px);border:0;border-radius:7px;background:none;color:var(--cv-muted);text-align:left;font-size:13px;transition:background .15s,color .15s}
.cv-nav-item:hover{background:var(--cv-soft);color:var(--cv-fg)}
.cv-nav-item[data-in]{color:var(--cv-fg)}
.cv-nav-item[aria-current=true]{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 60%,var(--cv-fg));font-weight:500}
.cv-nav-glyph{display:inline-flex;flex:none;color:var(--cv-faint)}
.cv-nav-item[data-in] .cv-nav-glyph,.cv-nav-item[aria-current=true] .cv-nav-glyph{color:currentColor}
.cv-nav-count{margin-left:auto;font-size:11.5px;color:var(--cv-faint);font-variant-numeric:tabular-nums}
.cv-types{margin-top:4px;padding-top:10px;border-top:1px solid var(--cv-line)}
.cv-types-h{display:flex;align-items:center;gap:6px;margin:0 0 4px;padding:0 8px;font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-title{display:flex;align-items:center;gap:8px}
.cv-title .cv-icon{color:var(--cv-muted)}
.cv-title-n{font-size:14px;font-weight:500;color:var(--cv-muted)}
.cv-tabs button .cv-icon{color:var(--cv-faint)}
.cv-tabs button[aria-selected=true] .cv-icon{color:var(--cv-fg)}
.cv-section-h .cv-icon{align-self:center;color:var(--cv-muted)}
.cv-kind .cv-icon{margin-right:3px}
.cv-kind.is-area{background:var(--cv-soft);color:var(--cv-muted)}
.cv-type-chips{margin-bottom:10px}
.cv-nav-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cv-side-chips{display:none}
.cv-main{min-width:0;display:flex;flex-direction:column}
.cv-head{padding:16px 20px 0;background:var(--cv-bg);border-bottom:1px solid var(--cv-line)}
.cv-head-top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 10px;min-width:0}
.cv-crumbs{display:flex;align-items:center;gap:6px;min-width:0;overflow-x:auto;scrollbar-width:none;font-size:12.5px;color:var(--cv-faint)}
.cv-crumbs button{flex:none;padding:0;border:0;background:none;color:var(--cv-muted);font-size:12.5px;white-space:nowrap}
.cv-crumbs button:hover{color:var(--cv-fg)}
.cv-crumbs button[aria-current=page]{color:var(--cv-fg)}
.cv-title{margin:8px 0 0;font-size:22px;font-weight:600;letter-spacing:-.015em;line-height:1.2}
.cv-tabs{position:relative;display:flex;gap:2px;margin-top:14px;overflow-x:auto;scrollbar-width:none}
.cv-tabs::-webkit-scrollbar{display:none}
.cv-tabs button{position:relative;flex:none;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 10px;border:0;background:none;color:var(--cv-muted);font-size:13.5px;font-weight:500;white-space:nowrap}
.cv-tabs button span{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--cv-soft);font-size:11.5px;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
.cv-tabs button:hover{color:var(--cv-fg)}
.cv-tabs button[aria-selected=true]{color:var(--cv-fg)}
.cv-tabs button[aria-selected=true]::after{content:"";position:absolute;left:8px;right:8px;bottom:-1px;height:2px;border-radius:1px;background:var(--cv-accent);animation:cv-grow .25s ease both}
.cv-panel{padding:18px 20px 22px;animation:cv-fade .22s ease both}
/* brief template */
.cv-brief{display:flex;flex-direction:column;gap:22px}
.cv-hero{padding:22px;border-radius:16px;background:radial-gradient(120% 140% at 100% 0%,var(--cv-accent-soft),transparent 55%),var(--cv-bg);border:1px solid var(--cv-line);animation:cv-in .4s cubic-bezier(.2,.8,.3,1) both}
.cv-hero-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.cv-eyebrow{min-width:0;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--cv-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-hero-title{margin:12px 0 0;font-size:34px;font-weight:650;letter-spacing:-.025em;line-height:1.1}
.cv-hero-line{max-width:62ch;margin:12px 0 0;font-size:16px;line-height:1.5;color:color-mix(in srgb,var(--cv-fg) 82%,var(--cv-muted))}
.cv-hero-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:18px}
.cv-hero-bar .cv-unit-chips{flex:1;min-width:0}
.cv-section{animation:cv-in .4s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 70ms + 100ms)}
.cv-section-h{display:flex;align-items:baseline;gap:10px;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--cv-line);font-size:19px;font-weight:600;letter-spacing:-.01em}
.cv-num{font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--cv-accent)}
.cv-count{margin-left:auto;font-size:13px;font-weight:500;color:var(--cv-muted);font-variant-numeric:tabular-nums}
@keyframes cv-in{from{opacity:0;transform:translateY(6px)}}
@keyframes cv-fade{from{opacity:0}}
@keyframes cv-grow{from{transform:scaleX(0)}}
@container cv (max-width:820px){
.cv-types{width:100%;margin-top:0;padding-top:8px}
.cv-types-h{display:none}
.cv-types .cv-nav-list{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}
.cv-types .cv-nav-item{width:auto;min-height:30px;padding:0 10px;border:1px solid var(--cv-line);border-radius:15px;white-space:nowrap}
.cv-types .cv-nav-count{margin-left:2px}
.cv-ws{grid-template-columns:1fr}
.cv-side{flex-direction:row;flex-wrap:wrap;align-items:center;gap:10px;border-right:0;border-bottom:1px solid var(--cv-line)}
.cv-nav{display:none}
.cv-side-chips{display:block;width:100%;min-width:0}
.cv-side-level{margin-left:auto}
.cv-stats{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container cv (max-width:560px){
.cv-head{padding:14px 14px 0}.cv-panel{padding:14px}
.cv-side{padding:12px}
.cv-side-level{margin-left:0;width:100%}
.cv-tpl button{padding:0 8px;font-size:12.5px}
.cv-hero-bar .cv-unit-chips{flex-basis:100%}
.cv-hero-top{align-items:flex-start}
.cv-canvas{grid-template-columns:1fr}
.cv-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
.cv-model .cv-stat:last-child{grid-column:1/-1}
.cv-pair{grid-template-columns:1fr}
.cv-link{height:18px;width:2px;margin-left:24px}
.cv-link::before{left:0;right:auto;top:2px;bottom:4px;width:1.5px;height:auto}
.cv-link::after{left:-3.25px;right:auto;top:auto;bottom:0;border:4px solid transparent;border-top:6px solid color-mix(in srgb,var(--cv-accent) 55%,var(--cv-line));border-bottom:0}
.cv-link.is-none{display:none}
.cv-steps{grid-template-columns:1fr;gap:18px;overflow:visible}
.cv-step:not(:last-child)::after{right:auto;left:22px;top:auto;bottom:-17px;width:1.5px;height:15px}
.cv-step:not(:last-child)::before{right:auto;left:18.5px;top:auto;bottom:-19px;border:4px solid transparent;border-top:6px solid var(--cv-faint);border-bottom:0}
.cv-step.gate-next::before{border-top-color:var(--cv-amber);border-left-color:transparent}
.cv-trigger{margin-left:0}
.cv-hero{padding:16px}.cv-hero-title{font-size:26px}
.cv-tree .cv-tree{margin-left:10px;padding-left:12px}
.cv-tree .cv-tree>.cv-node::before{left:-12px;width:10px}
}
@media(prefers-reduced-motion:reduce){.cv *,.cv{animation:none!important;transition:none!important}}
`;

const css = baseCss + dashboardCss + raciCss + methodologyCss + collectionCss;

export default CompanyView;

/** The Collection view on its own (catalog, inai.sh pages): tokens + styles included. */
export function CollectionPanel({ className = "", ...props }: React.ComponentProps<typeof CollectionView> & { className?: string }) {
  return (
    <div className={`cv cv-standalone ${className}`}>
      <style>{css}</style>
      <CollectionView {...props} />
    </div>
  );
}
