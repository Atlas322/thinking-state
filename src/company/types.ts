/**
 * The Company contract (TENET phase 1 ↔ 2, 2026-11-12). One shape for ac.me,
 * INAI and visitor companies; the company-schema session in inai-sh exports
 * data in exactly this form, and the renderer in this folder draws it.
 */

export type CompanySource = "acme" | "vault" | "visitor";
/** `area` = a vault area / sub-area (PARA), shown in the tree but not a level. */
/** "stream" = a direction inside a team (not a department), inai-sh #42. */
export type UnitKind = "company" | "team" | "department" | "institution" | "area" | "stream";

/** Free text, a list, or revenue streams with a share (0–1); never prices. */
export type ModelField = string | string[] | { stream: string; share?: number }[];

export type CompanyUnit = { id: string; name: string; kind: UnitKind; parentId?: string };
export type CvEntry = { period: string; title: string; org?: string };
export type PublicLink = { label: string; url: string };
export type CompanyPerson = {
  id: string;
  name: string;
  role: string;
  /** Last vault edit, YYYY-MM-DD. */
  updated?: string;
  unitId: string;
  /** Profile (read-only): a short about, career timeline and public links. */
  about?: string;
  cv?: CvEntry[];
  links?: PublicLink[];
};
export type CompanyAgent = {
  id: string;
  name: string;
  role: string;
  unitId: string;
  ownerId?: string;
  skills: string[];
  memory: string[];
};
export type WorkflowStep = { id: string; label: string; actorId: string; output: string };
export type CompanyWorkflow = { id: string; name: string; unitId: string; trigger: string; steps: WorkflowStep[] };

/** PMBOK: 5 process groups × 10 knowledge areas. */
export type PmPhase = "initiating" | "planning" | "executing" | "monitoring" | "closing";
export type PmKnowledgeArea =
  | "integration" | "scope" | "schedule" | "cost" | "quality"
  | "resource" | "communications" | "risk" | "procurement" | "stakeholder";
export const PM_PHASES: PmPhase[] = ["initiating", "planning", "executing", "monitoring", "closing"];
export const PM_AREAS: PmKnowledgeArea[] = ["integration", "scope", "schedule", "cost", "quality", "resource", "communications", "risk", "procurement", "stakeholder"];

/** Where an item sits and when (dates are ISO YYYY-MM-DD). */
type Placement = {
  area?: string;
  subArea?: string;
  due?: string;
  phase?: PmPhase | string;
  knowledgeArea?: PmKnowledgeArea | string;
  start?: string;
  end?: string;
};
export type TaskPriority = "high" | "medium" | "low";
export type CompanyTask = Placement & {
  /** Last vault edit, YYYY-MM-DD. */
  updated?: string;
  id: string;
  title: string;
  status: string;
  ownerId?: string;
  priority?: TaskPriority;
  /** Set on company-level tasks (Company.tasks) that still belong to a project. */
  projectId?: string;
  /** Task-level roles, same shape as the project's. */
  raci?: Raci;
  /** Tasks this one waits on (vault blocked_by; blocks read backwards). May point into another project. */
  dependsOn?: string[];
};
export type CompanyDecision = { id: string; title: string; date: string };
/** Who is Responsible, Accountable, Consulted, Informed (person or agent ids). */
export type Raci = { responsible: string[]; accountable?: string; consulted: string[]; informed: string[] };
export type CompanyProject = Placement & {
  /** Last vault edit, YYYY-MM-DD. */
  updated?: string;
  id: string;
  name: string;
  unitId: string;
  status: string;
  tasks: CompanyTask[];
  decisions: CompanyDecision[];
  raci?: Raci;
  priority?: TaskPriority;
};

export type Methodology = "bmc" | "pmbok" | "okr" | "lean-canvas";
export const METHODOLOGIES: Methodology[] = ["bmc", "pmbok", "okr", "lean-canvas"];

/** A block set to null is not shown at all (the company chose not to publish it). */
export type ModelBlock = ModelField | null;
export type CompanyModel = {
  customers: ModelBlock;
  value: ModelBlock;
  channels: ModelBlock;
  revenue: ModelBlock;
  /** Business Model Canvas blocks beyond the core four. */
  partners?: ModelBlock;
  activities?: ModelBlock;
  resources?: ModelBlock;
  relationships?: ModelBlock;
  costs?: ModelBlock;
  /** Lean Canvas blocks. */
  problem?: ModelBlock;
  solution?: ModelBlock;
  metrics?: ModelBlock;
  advantage?: ModelBlock;
};
export type Okr = { id: string; title: string; ownerId?: string; keyResults: { id: string; title: string; progress: number }[] };
export type CompanyNote = { id: string; title: string; projectId?: string; date?: string };

/**
 * A vault `type` drawn as a database (Notion / Obsidian Bases style).
 * Fields are names (kinds are inferred from the values) or {name, kind}.
 */
export type FieldKind = "text" | "number" | "date" | "select" | "multi" | "status" | "priority" | "relation" | "checkbox" | "url" | "progress";
export type CollectionField = string | { name: string; kind?: FieldKind | string; label?: string };
export type CollectionValue = string | number | boolean | null | string[];
export type CollectionItem = { id: string; title: string; path?: string; props: Record<string, CollectionValue | undefined> };
export type Collection = { type: string; label?: string; fields: CollectionField[]; items: CollectionItem[] };

export type Company = {
  id: string;
  name: string;
  /** When the vault export was made (ISO) — the «as of» of every number shown. */
  exportedAt?: string;
  segment: string;
  /** Human label for the segment (e.g. «Agentic company team»). */
  segmentLabel?: string;
  source: CompanySource;
  /** The organisation's own management method; picks the default template. */
  methodology?: Methodology;
  model: CompanyModel;
  units: CompanyUnit[];
  people: CompanyPerson[];
  agents: CompanyAgent[];
  workflows: CompanyWorkflow[];
  projects: CompanyProject[];
  okrs?: Okr[];
  notes?: CompanyNote[];
  /** PMBOK Facts hub: key figures from one source (strings, shown as written). */
  facts?: { label: string; value: string }[];
  /** Tasks that live outside any project (or point at one via projectId). */
  tasks?: CompanyTask[];
  /** Every vault type as a read-only database. */
  collections?: Collection[];
};

/** Levels the renderer can zoom to; team covers departments too. */
export type CompanyLevel = "institution" | "company" | "team";
export const LEVELS: CompanyLevel[] = ["institution", "company", "team"];
export const kindsOf: Record<CompanyLevel, UnitKind[]> = {
  institution: ["institution"],
  company: ["company"],
  team: ["team", "department", "stream"],
};

/** Every unit id under (and including) `rootId`. Safe against parent cycles. */
export function subtreeIds(units: CompanyUnit[], rootId: string): Set<string> {
  const out = new Set<string>([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const u of units)
      if (u.parentId && out.has(u.parentId) && !out.has(u.id)) {
        out.add(u.id);
        grew = true;
      }
  }
  return out;
}

/** The part of a company that lives under one unit. */
export function scopeCompany(c: Company, rootId: string | null): Company {
  if (!rootId || !c.units.some((u) => u.id === rootId)) return c;
  const ids = subtreeIds(c.units, rootId);
  return {
    ...c,
    units: c.units.filter((u) => ids.has(u.id)),
    people: c.people.filter((p) => ids.has(p.unitId)),
    agents: c.agents.filter((a) => ids.has(a.unitId)),
    workflows: c.workflows.filter((w) => ids.has(w.unitId)),
    projects: c.projects.filter((p) => ids.has(p.unitId)),
    okrs: c.okrs?.filter((o) => !o.ownerId || [...c.people, ...c.agents].some((x) => x.id === o.ownerId && ids.has(x.unitId))),
    notes: c.notes?.filter((n) => !n.projectId || c.projects.some((p) => p.id === n.projectId && ids.has(p.unitId))),
  };
}

/** Top-level units: no parent, or a parent that is not in the list. */
export function rootsOf(units: CompanyUnit[]): CompanyUnit[] {
  const ids = new Set(units.map((u) => u.id));
  return units.filter((u) => !u.parentId || !ids.has(u.parentId));
}

export type Actor = { id: string; name: string; role: string; kind: "person" | "agent" | "unknown" };
export function actorOf(c: Company, id: string | undefined): Actor {
  const p = c.people.find((x) => x.id === id);
  if (p) return { id: p.id, name: p.name, role: p.role, kind: "person" };
  const a = c.agents.find((x) => x.id === id);
  if (a) return { id: a.id, name: a.name, role: a.role, kind: "agent" };
  return { id: id ?? "", name: id ?? "Тодорхойгүй", role: "", kind: "unknown" };
}

/** Normalises any ModelField into display lines. */
export function modelLines(f: ModelField | null | undefined): { text: string; share?: number }[] {
  if (f == null) return [];
  if (typeof f === "string") return f.trim() ? [{ text: f }] : [];
  return (f as (string | { stream: string; share?: number })[]).map((x) =>
    typeof x === "string" ? { text: x } : { text: x.stream, share: x.share },
  );
}

/** Every id a project names in its RACI, in R, A, C, I order. */
export function raciOf(p: CompanyProject, id: string): ("R" | "A" | "C" | "I")[] {
  const r = p.raci;
  if (!r) return [];
  const out: ("R" | "A" | "C" | "I")[] = [];
  if (r.responsible?.includes(id)) out.push("R");
  if (r.accountable === id) out.push("A");
  if (r.consulted?.includes(id)) out.push("C");
  if (r.informed?.includes(id)) out.push("I");
  return out;
}

/** Normalises a PMBOK phase / knowledge area written in any case or language-neutral form. */
export function toPmPhase(v?: string): PmPhase | null {
  const k = (v ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (k.startsWith("init")) return "initiating";
  if (k.startsWith("plan")) return "planning";
  if (k.startsWith("exec")) return "executing";
  if (k.startsWith("monit") || k.startsWith("control")) return "monitoring";
  if (k.startsWith("clos")) return "closing";
  return null;
}
export function toPmArea(v?: string): PmKnowledgeArea | null {
  const k = (v ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (!k) return null;
  if (k.startsWith("communic")) return "communications";
  if (k.startsWith("stakeholder")) return "stakeholder";
  return (PM_AREAS as string[]).find((a) => k.startsWith(a)) as PmKnowledgeArea | undefined ?? null;
}

export type TaskRef = { project?: CompanyProject; task: CompanyTask };

/** Every task by the ids an export may use: "t4", "<project>-t4", "<project>:t4". */
export function taskIndex(c: Company): Map<string, TaskRef> {
  const out = new Map<string, TaskRef>();
  const add = (ref: TaskRef) => {
    const ids = [ref.task.id];
    if (ref.project) ids.push(`${ref.project.id}-${ref.task.id}`, `${ref.project.id}:${ref.task.id}`);
    for (const id of ids) if (!out.has(id)) out.set(id, ref);
  };
  for (const p of c.projects) for (const t of p.tasks) add({ project: p, task: t });
  for (const t of c.tasks ?? []) add({ project: c.projects.find((p) => p.id === t.projectId), task: t });
  return out;
}

/**
 * What a task waits on (its dependsOn, resolved; ids inside the task's own
 * project win over same-named ids elsewhere) and what waits on it (the
 * reverse, computed here). Unknown ids are skipped.
 */
export function dependenciesOf(c: Company, project: CompanyProject | undefined, task: CompanyTask, index = taskIndex(c)) {
  const local = (id: string) => (project ? project.tasks.find((t) => t.id === id) : undefined);
  const waitsOn: TaskRef[] = [];
  for (const id of task.dependsOn ?? []) {
    const own = local(id);
    const ref = own ? { project, task: own } : index.get(id);
    if (ref && ref.task !== task && !waitsOn.some((w) => w.task === ref.task)) waitsOn.push(ref);
  }
  const blocks: TaskRef[] = [];
  for (const ref of new Set(index.values())) {
    if (ref.task === task) continue;
    const deps = ref.task.dependsOn ?? [];
    // Same rule as waitsOn: a bare id means the depending task's own project first,
    // otherwise whatever the index resolves it to (globally unique ids like
    // «task-17ba66c5f7» and «project-t4» / «project:t4» forms).
    const hit = deps.some((d) => {
      const own = ref.project?.tasks.find((t) => t.id === d);
      return own ? own === task : index.get(d)?.task === task;
    });
    if (hit && !blocks.some((b) => b.task === ref.task)) blocks.push(ref);
  }
  return { waitsOn, blocks };
}
