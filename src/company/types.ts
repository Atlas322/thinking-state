/**
 * The Company contract (TENET phase 1 ↔ 2, 2026-11-12). One shape for ac.me,
 * INAI and visitor companies; the company-schema session in inai-sh exports
 * data in exactly this form, and the renderer in this folder draws it.
 */

export type CompanySource = "acme" | "vault" | "visitor";
export type UnitKind = "company" | "team" | "department" | "institution";

/** Free text, a list, or revenue streams with a share (0–1); never prices. */
export type ModelField = string | string[] | { stream: string; share?: number }[];

export type CompanyUnit = { id: string; name: string; kind: UnitKind; parentId?: string };
export type CompanyPerson = { id: string; name: string; role: string; unitId: string };
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
export type CompanyTask = { id: string; title: string; status: string; ownerId?: string };
export type CompanyDecision = { id: string; title: string; date: string };
export type CompanyProject = {
  id: string;
  name: string;
  unitId: string;
  status: string;
  tasks: CompanyTask[];
  decisions: CompanyDecision[];
};

export type Company = {
  id: string;
  name: string;
  segment: string;
  source: CompanySource;
  model: { customers: ModelField; value: ModelField; channels: ModelField; revenue: ModelField };
  units: CompanyUnit[];
  people: CompanyPerson[];
  agents: CompanyAgent[];
  workflows: CompanyWorkflow[];
  projects: CompanyProject[];
};

/** Levels the renderer can zoom to; team covers departments too. */
export type CompanyLevel = "institution" | "company" | "team";
export const LEVELS: CompanyLevel[] = ["institution", "company", "team"];
export const kindsOf: Record<CompanyLevel, UnitKind[]> = {
  institution: ["institution"],
  company: ["company"],
  team: ["team", "department"],
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
  return { id: id ?? "", name: id ?? "—", role: "", kind: "unknown" };
}

/** Normalises any ModelField into display lines. */
export function modelLines(f: ModelField | undefined): { text: string; share?: number }[] {
  if (f == null) return [];
  if (typeof f === "string") return f.trim() ? [{ text: f }] : [];
  return (f as (string | { stream: string; share?: number })[]).map((x) =>
    typeof x === "string" ? { text: x } : { text: x.stream, share: x.share },
  );
}
