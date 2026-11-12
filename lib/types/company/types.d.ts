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
export type ModelField = string | string[] | {
    stream: string;
    share?: number;
}[];
export type CompanyUnit = {
    id: string;
    name: string;
    kind: UnitKind;
    parentId?: string;
};
export type CvEntry = {
    period: string;
    title: string;
    org?: string;
};
export type PublicLink = {
    label: string;
    url: string;
};
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
export type WorkflowStep = {
    id: string;
    label: string;
    actorId: string;
    output: string;
};
export type CompanyWorkflow = {
    id: string;
    name: string;
    unitId: string;
    trigger: string;
    steps: WorkflowStep[];
};
/** PMBOK: 5 process groups × 10 knowledge areas. */
export type PmPhase = "initiating" | "planning" | "executing" | "monitoring" | "closing";
export type PmKnowledgeArea = "integration" | "scope" | "schedule" | "cost" | "quality" | "resource" | "communications" | "risk" | "procurement" | "stakeholder";
export declare const PM_PHASES: PmPhase[];
export declare const PM_AREAS: PmKnowledgeArea[];
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
export type CompanyDecision = {
    id: string;
    title: string;
    date: string;
};
/** Who is Responsible, Accountable, Consulted, Informed (person or agent ids). */
export type Raci = {
    responsible: string[];
    accountable?: string;
    consulted: string[];
    informed: string[];
};
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
export declare const METHODOLOGIES: Methodology[];
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
export type Okr = {
    id: string;
    title: string;
    ownerId?: string;
    keyResults: {
        id: string;
        title: string;
        progress: number;
    }[];
};
export type CompanyNote = {
    id: string;
    title: string;
    projectId?: string;
    date?: string;
};
/**
 * A vault `type` drawn as a database (Notion / Obsidian Bases style).
 * Fields are names (kinds are inferred from the values) or {name, kind}.
 */
export type FieldKind = "text" | "number" | "date" | "select" | "multi" | "status" | "priority" | "relation" | "checkbox" | "url" | "progress";
export type CollectionField = string | {
    name: string;
    kind?: FieldKind | string;
    label?: string;
};
export type CollectionValue = string | number | boolean | null | string[];
export type CollectionItem = {
    id: string;
    title: string;
    path?: string;
    props: Record<string, CollectionValue | undefined>;
};
export type Collection = {
    type: string;
    label?: string;
    fields: CollectionField[];
    items: CollectionItem[];
};
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
    facts?: {
        label: string;
        value: string;
    }[];
    /** Tasks that live outside any project (or point at one via projectId). */
    tasks?: CompanyTask[];
    /** Every vault type as a read-only database. */
    collections?: Collection[];
};
/** Levels the renderer can zoom to; team covers departments too. */
export type CompanyLevel = "institution" | "company" | "team";
export declare const LEVELS: CompanyLevel[];
export declare const kindsOf: Record<CompanyLevel, UnitKind[]>;
/** Every unit id under (and including) `rootId`. Safe against parent cycles. */
export declare function subtreeIds(units: CompanyUnit[], rootId: string): Set<string>;
/** The part of a company that lives under one unit. */
export declare function scopeCompany(c: Company, rootId: string | null): Company;
/** Top-level units: no parent, or a parent that is not in the list. */
export declare function rootsOf(units: CompanyUnit[]): CompanyUnit[];
export type Actor = {
    id: string;
    name: string;
    role: string;
    kind: "person" | "agent" | "unknown";
};
export declare function actorOf(c: Company, id: string | undefined): Actor;
/** Normalises any ModelField into display lines. */
export declare function modelLines(f: ModelField | null | undefined): {
    text: string;
    share?: number;
}[];
/** Every id a project names in its RACI, in R, A, C, I order. */
export declare function raciOf(p: CompanyProject, id: string): ("R" | "A" | "C" | "I")[];
/** Normalises a PMBOK phase / knowledge area written in any case or language-neutral form. */
export declare function toPmPhase(v?: string): PmPhase | null;
export declare function toPmArea(v?: string): PmKnowledgeArea | null;
export type TaskRef = {
    project?: CompanyProject;
    task: CompanyTask;
};
/** Every task by the ids an export may use: "t4", "<project>-t4", "<project>:t4". */
export declare function taskIndex(c: Company): Map<string, TaskRef>;
/**
 * What a task waits on (its dependsOn, resolved; ids inside the task's own
 * project win over same-named ids elsewhere) and what waits on it (the
 * reverse, computed here). Unknown ids are skipped.
 */
export declare function dependenciesOf(c: Company, project: CompanyProject | undefined, task: CompanyTask, index?: Map<string, TaskRef>): {
    waitsOn: TaskRef[];
    blocks: TaskRef[];
};
export {};
