/**
 * Build Wizard (2026-11-17, recipe v05) — the build page's «Бүтээх горим»: an adaptive questionnaire that
 * finds the shape of a Second Brain (areas · projects · routines/SOP · roles · knowledge · agents) and
 * draws a draft Company. The recipe is data (web-app's build-asuumj JSON, same shape):
 * - `branch_key` (segment) picks per-segment text through `by_segment`, and `show_if` hides steps/fields;
 * - the method card's «Мэдэхгүй байна» opens MethodQuiz inside the step;
 * - every step but the first can be skipped; nothing is invented (no numbers, no names — roles only).
 * Tokens only (--ts-*), radius --ts-radius, 44px targets.
 */
import * as React from "react";
import type { Collection, Company, Methodology } from "../company/types";
import { MethodQuiz, type MethodQuizProps } from "./method-quiz";

// ── Recipe (mirrors build-asuumj JSON) ─────────────────────────────────────────
export type WizardOption = string | { value: string; label: string; hint?: string; short?: string; text?: string; fits?: string };
export type ShowIf = Record<string, string | string[]>;
export type WizardField = {
  key: string;
  label?: string;
  type?: "text" | "choice" | "cards" | "multi" | "list" | "date";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: WizardOption[];
  max?: number;
  allow_custom?: boolean;
  show_if?: ShowIf;
  /** Per-segment overrides of label, options, placeholder, hint. */
  by_segment?: Record<string, Partial<Pick<WizardField, "label" | "options" | "placeholder" | "hint">>>;
  /** Where the answer goes; `facts` and `collections` are read from here. */
  maps_to?: string;
  fact_label?: string;
  collection?: string;
  /** key_results: one list per objective (older recipes). */
  per?: "objective";
  unsure?: { label: string; text?: string; fallback?: Methodology };
};
export type WizardStep = { id: string; title: string; lead?: string; show_if?: ShowIf; fields?: WizardField[]; by_methodology?: Partial<Record<Methodology, WizardField[]>> };
export type WizardRecipe = {
  branch_key?: string;
  intro?: { eyebrow?: string; title?: string; lead?: string; time?: string; time_by_segment?: Record<string, string>; privacy?: string };
  steps: WizardStep[];
  result: { title: string; lead?: string; sections?: { label: string; from: string }[]; empty?: string; ctas?: { label: string; variant?: "primary" | "secondary"; href?: string }[] };
};
export type WizardAnswers = Record<string, string | string[] | Record<string, string[]>>;

export type BuildWizardLabels = { title: string; back: string; next: string; skip: string; finish: string; addItem: string; addCustom: string; result: string; required: string; quizDone: string; quizBack: string; draft: string; empty: string; chooseMax: (n: number) => string };
export const buildWizardLabelsMn: BuildWizardLabels = {
  title: "Бүтээх горим",
  back: "Буцах",
  next: "Дараах",
  skip: "Алгасах",
  finish: "Ноорог гаргах",
  addItem: "Нэмэх",
  addCustom: "Өөрөө нэмэх",
  result: "Ноорог",
  required: "Заавал",
  quizDone: "Энэ аргаар үргэлжлүүлэх",
  quizBack: "Аргуудыг харах",
  draft: "Ноорог",
  empty: "Хоосон — дараа нь бөглөнө",
  chooseMax: (n) => `${n} хүртэл сонгоно`,
};
export type BuildWizardProps = {
  recipe: WizardRecipe;
  /** MethodQuiz content (method-quiz JSON); without it «Мэдэхгүй байна» picks the fallback method. */
  quiz?: Pick<MethodQuizProps, "questions" | "methods" | "note">;
  defaultAnswers?: WizardAnswers;
  /** Pre-picks the branch (segment), e.g. from `build.html?segment=team`. Unknown values are ignored;
   * aliases map other names onto a recipe option (institutional → company). */
  segment?: string | null;
  segmentAliases?: Record<string, string>;
  /** Index among the steps visible for the answers. */
  defaultStep?: number;
  theme?: "light" | "dark";
  /** Fires on the result with the answers and the draft Company (save it, open company.html?c=draft). */
  onComplete?: (answers: WizardAnswers, draft: Company) => void;
  onCta?: (href: string | undefined, draft: Company) => void;
  labels?: Partial<BuildWizardLabels>;
  className?: string;
};

const opt = (o: WizardOption) => (typeof o === "string" ? { value: o, label: o } : o);
const listOf = (v: WizardAnswers[string] | undefined) => (Array.isArray(v) ? v.filter((x) => x.trim()) : []);
const textOf = (v: WizardAnswers[string] | undefined) => (typeof v === "string" ? v.trim() : "");

/** Does a step or field show for these answers? Values may be one value or a list of allowed values. */
export function shown(show: ShowIf | undefined, a: WizardAnswers): boolean {
  if (!show) return true;
  return Object.entries(show).every(([k, want]) => {
    const v = textOf(a[k]);
    return Array.isArray(want) ? want.includes(v) : v === want;
  });
}
/** The field as this segment sees it (label, options, placeholder from `by_segment`; the first branch before a choice). */
export function resolveField(f: WizardField, a: WizardAnswers, branchKey = "segment"): WizardField {
  const seg = textOf(a[branchKey]);
  const o = (seg && f.by_segment?.[seg]) || (f.by_segment ? Object.values(f.by_segment)[0] : undefined);
  return o ? { ...f, ...o } : f;
}
export function visibleSteps(recipe: WizardRecipe, a: WizardAnswers) {
  return recipe.steps.filter((s) => shown(s.show_if, a));
}
const fieldsFor = (s: WizardStep, a: WizardAnswers, branchKey?: string): WizardField[] => {
  const method = textOf(a.methodology) as Methodology;
  const raw = s.fields ?? (method ? s.by_methodology?.[method] ?? [] : []);
  return raw.filter((f) => shown(f.show_if, a)).map((f) => resolveField(f, a, branchKey));
};
const MODEL_KEYS = ["customers", "channels", "revenue", "partners", "activities", "resources", "relationships", "costs", "problem", "solution", "metrics", "advantage"];

/** Other names a link may use for a segment; the recipe's own option values win. */
export const SEGMENT_ALIASES: Record<string, string> = { institutional: "company", institution: "company", organization: "company", individual: "personal", solo: "personal" };

/** A segment from a link (`?segment=`) → one of the recipe's branch options, or undefined. */
export function resolveSegment(recipe: WizardRecipe, value?: string | null, aliases: Record<string, string> = SEGMENT_ALIASES): string | undefined {
  if (!value) return undefined;
  const key = recipe.branch_key ?? "segment";
  const field = recipe.steps.flatMap((s) => s.fields ?? []).find((f) => f.key === key);
  const options = (field?.options ?? []).map((o) => (typeof o === "string" ? o : o.value));
  const v = value.trim().toLowerCase();
  if (options.includes(v)) return v;
  const alias = aliases[v];
  return alias && options.includes(alias) ? alias : undefined;
}

/** Reads `?segment=` from a URL search string (the host passes it on). */
export function segmentFromSearch(search: string): string | null {
  return new URLSearchParams(search).get("segment");
}

/** Answers → a draft Company (contract unchanged). Empty answers stay out; people are roles, not names. */
export function toDraftCompany(recipe: WizardRecipe, a: WizardAnswers): Company {
  const branchKey = recipe.branch_key ?? "segment";
  const fields = visibleSteps(recipe, a).flatMap((s) => fieldsFor(s, a, branchKey));
  const has = (k: string) => fields.some((f) => f.key === k);
  const method = (textOf(a.methodology) || undefined) as Methodology | undefined;
  const name = textOf(a.name) || "Ноорог";
  const root = "u-root";
  const unitKind = (textOf(a.unit_kind) || "area") as Company["units"][number]["kind"];

  const model: Record<string, string> = {};
  if (has("why") && textOf(a.why)) model.value = textOf(a.why);
  // Older recipes ask the model blocks per method (free text only).
  for (const f of fields) if (MODEL_KEYS.includes(f.key) && f.type !== "multi" && !f.collection && textOf(a[f.key])) model[f.key] = textOf(a[f.key]);

  const facts = fields
    .filter((f) => f.maps_to?.includes("facts"))
    .map((f) => ({ label: f.fact_label ?? f.label ?? f.key, value: Array.isArray(a[f.key]) ? listOf(a[f.key]).join(", ") : textOf(a[f.key]) }))
    .filter((x) => x.value);

  const collections: Collection[] = [];
  for (const f of fields.filter((x) => x.collection)) {
    const items = (Array.isArray(a[f.key]) ? listOf(a[f.key]) : textOf(a[f.key]) ? [textOf(a[f.key])] : []).filter((x) => x !== "Байхгүй");
    if (!items.length) continue;
    let c = collections.find((x) => x.type === f.collection);
    if (!c) {
      c = { type: f.collection!, label: f.label, fields: [], items: [] };
      collections.push(c);
    }
    for (const t of items) c.items.push({ id: `${f.collection}-${c.items.length + 1}`, title: t, props: {} });
  }

  const areas = has("areas") ? listOf(a.areas) : [];
  const projects = has("projects") ? listOf(a.projects) : [];
  const due = has("project_due") ? textOf(a.project_due) : "";
  const done = has("project_done") ? textOf(a.project_done) : "";
  const sops = has("sops") ? listOf(a.sops) : [];
  const roles = has("roles") ? listOf(a.roles) : [];
  const delegate = has("delegate") ? listOf(a.delegate) : [];
  const never = has("never") ? textOf(a.never) : "";
  const goal = has("goal") ? textOf(a.goal) : "";
  const firstQ = has("first_question") ? textOf(a.first_question) : "";

  return {
    id: "draft",
    name,
    segment: textOf(a[branchKey]),
    source: "visitor",
    methodology: method,
    model: model as unknown as Company["model"],
    units: [{ id: root, name, kind: "company" }, ...areas.map((x, i) => ({ id: `u${i + 1}`, name: x, kind: unitKind, parentId: root }))],
    people: roles.map((r, i) => ({ id: `r${i + 1}`, name: r, role: r, unitId: root })),
    agents: delegate.map((d, i) => ({ id: `a${i + 1}`, name: d, role: d, unitId: root, skills: [], memory: never ? [`Хориг: ${never}`] : [] })),
    workflows: sops.map((x, i) => ({ id: `w${i + 1}`, name: x, unitId: root, trigger: i === 0 && has("sop_trigger") ? textOf(a.sop_trigger) : "", steps: [] })),
    projects: projects.map((p, i) => ({
      id: `p${i + 1}`,
      name: p,
      unitId: root,
      status: "active",
      end: i === 0 && due ? due : undefined,
      tasks: i === 0 && done ? [{ id: "p1-done", title: done, status: "todo" }] : [],
      decisions: [],
    })),
    okrs: goal ? [{ id: "o1", title: goal, keyResults: [] }] : undefined,
    notes: firstQ ? [{ id: "q-1", title: firstQ }] : undefined,
    collections: collections.length ? collections : undefined,
    facts,
  };
}

/** What a result section lists, read from the draft (`from`: Company.units / projects / workflows / agents / methodology / people). */
function sectionItems(from: string, d: Company, methodName: (m?: string) => string): string[] {
  switch (from.replace("Company.", "")) {
    case "units": return d.units.filter((u) => u.kind !== "company").map((u) => u.name);
    case "projects": return d.projects.map((p) => p.name + (p.end ? ` · ${p.end}` : ""));
    case "workflows": return d.workflows.map((w) => w.name + (w.trigger ? ` · ${w.trigger}` : ""));
    case "agents": return d.agents.map((x) => x.role);
    case "methodology": return d.methodology ? [methodName(d.methodology)] : [];
    case "people": return d.people.map((p) => p.role);
    default: return [];
  }
}

const CSS = `
.bw{font-family:var(--ts-font,Inter,system-ui,sans-serif);background:var(--ts-surface);color:var(--ts-fg);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size}
.bw-bar{display:flex;align-items:center;gap:12px;height:44px;padding:0 14px;border-bottom:1px solid var(--ts-line);background:var(--ts-soft)}
.bw-dots{display:flex;gap:6px}.bw-dots i{width:10px;height:10px;border-radius:50%;background:var(--ts-line)}
.bw-title{font-weight:500;font-size:14px;color:var(--ts-muted)}
.bw-count{margin-left:auto;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint)}
.bw-split{display:flex;min-height:520px}
.bw-rail{width:240px;flex:none;border-right:1px solid var(--ts-line);background:var(--ts-soft);padding:16px 12px}
.bw-rail ol{margin:0;padding:0;list-style:none}
.bw-rail li{position:relative;display:flex;gap:12px;align-items:flex-start;min-height:44px;padding:4px 6px;font-size:14px;color:var(--ts-faint)}
.bw-rail li:not(:last-child)::after{content:"";position:absolute;left:15px;top:30px;bottom:-6px;width:1.5px;background:var(--ts-line)}
.bw-rail li[data-state="done"]::after{background:var(--ts-electric)}
.bw-dot{position:relative;z-index:1;width:20px;height:20px;flex:none;border-radius:50%;border:1.5px solid var(--ts-line);background:var(--ts-surface);display:grid;place-items:center;margin-top:1px}
.bw-rail li[data-state="done"] .bw-dot{border-color:var(--ts-electric);background:var(--ts-electric);color:var(--ts-on-electric)}
.bw-rail li[data-state="now"] .bw-dot{border-color:var(--ts-electric);box-shadow:0 0 0 4px var(--ts-electric-soft)}
.bw-rail li[data-state="now"],.bw-rail li[data-state="done"]{color:var(--ts-fg)}
.bw-rail li[data-state="now"]{font-weight:600}
.bw-time{margin:12px 6px 0;padding-top:12px;border-top:1px solid var(--ts-line);font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint);letter-spacing:.02em}
.bw-main{flex:1;min-width:0;padding:28px 32px;display:flex;flex-direction:column;gap:20px}
.bw-progress{height:4px;border-radius:4px;background:var(--ts-soft-2);overflow:hidden}
.bw-progress i{display:block;height:100%;background:var(--ts-electric);transition:width .25s ease}
.bw-intro{display:flex;flex-direction:column;gap:6px;padding-bottom:16px;border-bottom:1px solid var(--ts-line)}
.bw-intro span{font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;color:var(--ts-faint);text-transform:uppercase}
.bw-intro p{margin:0;font-size:15px;line-height:1.5;color:var(--ts-muted)}
.bw-intro small{font-size:13px;color:var(--ts-faint)}
.bw-h{font:400 24px/1.2 Spectral,Georgia,serif;margin:0}
.bw-lead{margin:-10px 0 0;font-size:14px;line-height:1.5;color:var(--ts-muted)}
.bw-field{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;border:0;min-width:0}
.bw-field>label,.bw-field>legend{font-weight:500;font-size:15px;padding:0}
.bw-req{margin-left:6px;font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint);letter-spacing:.04em}
.bw-hint{font-size:13px;color:var(--ts-muted);margin:0}
.bw-input{min-height:44px;box-sizing:border-box;width:100%;padding:10px 12px;border:1.5px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);color:var(--ts-fg);font:inherit;font-size:16px}
textarea.bw-input{min-height:72px;resize:vertical;line-height:1.5}
.bw-input::placeholder{color:var(--ts-faint)}
.bw-input:focus{outline:none;border-color:var(--ts-electric);box-shadow:0 0 0 3px var(--ts-electric-soft)}
.bw-choices{display:flex;flex-wrap:wrap;gap:8px}
.bw-pick{position:relative;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);cursor:pointer;font-size:15px}
.bw-pick small{color:var(--ts-muted);font-size:13px}
.bw-pick:hover{border-color:var(--ts-faint)}
.bw-pick:has(input:checked){border-color:var(--ts-electric);background:var(--ts-electric-soft)}
.bw-pick:has(input:disabled){opacity:.5;cursor:not-allowed}
.bw-pick:has(input:focus-visible),.bw-card:has(input:focus-visible){outline:2px solid var(--ts-electric);outline-offset:2px}
.bw-pick input,.bw-card input{position:absolute;opacity:0;width:1px;height:1px}
.bw-custom{display:flex;gap:8px;max-width:420px}
.bw-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.bw-card{position:relative;display:flex;flex-direction:column;gap:6px;padding:14px;min-height:44px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);cursor:pointer}
.bw-card:hover{border-color:var(--ts-faint)}
.bw-card:has(input:checked){border-color:var(--ts-electric);background:var(--ts-electric-soft)}
.bw-card b{font-weight:600;font-size:16px}
.bw-card .bw-short{font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-electric-fg);letter-spacing:.04em}
.bw-card p{margin:0;font-size:14px;line-height:1.45;color:var(--ts-muted)}
.bw-card small{font-size:13px;color:var(--ts-faint)}
.bw-unsure{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px dashed var(--ts-faint);border-radius:var(--ts-radius,6px)}
.bw-unsure p{margin:0;font-size:14px;color:var(--ts-muted)}
.bw-list{display:flex;flex-direction:column;gap:8px}
.bw-sub{padding:12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);display:flex;flex-direction:column;gap:8px}
.bw-sub b{font-weight:500;font-size:14px}
.bw-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 20px;align-items:start}
.bw-nav{display:flex;gap:8px;align-items:center;margin-top:auto}
.bw-nav .bw-sp{flex:1}
.bw-btn{display:inline-flex;align-items:stretch;min-height:44px;border-radius:var(--ts-radius,6px);font:inherit;font-weight:500;font-size:15px;cursor:pointer;padding:0;border:0;background:none;color:var(--ts-fg)}
.bw-btn>em{font-style:normal;display:flex;align-items:center;padding:0 16px;white-space:nowrap}
.bw-btn>span{display:grid;place-items:center;width:44px;border-left:1.5px solid color-mix(in srgb,currentColor 35%,transparent)}
.bw-btn.primary{background:var(--ts-electric);color:var(--ts-on-electric)}
.bw-btn.secondary{border:1.5px solid var(--ts-fg)}
.bw-btn.ghost{text-decoration:underline;text-decoration-color:var(--ts-line);text-underline-offset:4px}
.bw-btn.ghost>em{padding:0 8px}
.bw-btn:disabled{opacity:.45;cursor:not-allowed}
.bw-btn:focus-visible{outline:2px solid var(--ts-electric);outline-offset:2px}
.bw-draft{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.bw-block{padding:14px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);display:flex;flex-direction:column;gap:8px}
.bw-block>span{font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint);display:flex;justify-content:space-between}
.bw-block ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.bw-block li{font-size:14px;line-height:1.4;padding-left:16px;position:relative}
.bw-block li::before{content:"";position:absolute;left:2px;top:7px;width:6px;height:6px;border-radius:50%;background:var(--ts-electric)}
.bw-block p{margin:0;font-size:14px;color:var(--ts-faint);font-style:italic}
.bw-tag{align-self:flex-start;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;color:var(--ts-electric-fg);border:1px solid var(--ts-electric);border-radius:var(--ts-radius,6px);padding:3px 8px}
@container (max-width:680px){.bw-rail{display:none}.bw-main{padding:20px}.bw-cards,.bw-draft,.bw-grid{grid-template-columns:1fr}.bw-choices:not([data-multi]){flex-direction:column}.bw-choices:not([data-multi]) .bw-pick{justify-content:space-between}.bw-nav{flex-wrap:wrap}}
`;
const check = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
const arrow = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const plus = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;

export function BuildWizard({ recipe, quiz, defaultAnswers = {}, segment, segmentAliases = SEGMENT_ALIASES, defaultStep = 0, theme = "light", onComplete, onCta, labels: labelsIn, className = "" }: BuildWizardProps) {
  const labels = { ...buildWizardLabelsMn, ...labelsIn };
  const uid = React.useId();
  const branchKey = recipe.branch_key ?? "segment";
  const [a, setA] = React.useState<WizardAnswers>(() => {
    const seg = resolveSegment(recipe, segment, segmentAliases);
    return seg && !defaultAnswers[branchKey] ? { ...defaultAnswers, [branchKey]: seg } : defaultAnswers;
  });
  const [step, setStep] = React.useState(defaultStep);
  const [quizOpen, setQuizOpen] = React.useState(false);
  const [custom, setCustom] = React.useState<Record<string, string>>({});
  const steps = visibleSteps(recipe, a);
  const n = steps.length;
  // A default step past the visible steps (e.g. a segment with fewer steps) lands on the last question.
  React.useEffect(() => { if (step > n) setStep(Math.max(0, n - 1)); }, [step, n]);
  const done = step >= n;
  const s = steps[Math.min(step, n - 1)];
  const fields = s ? fieldsFor(s, a, branchKey) : [];
  const set = (k: string, v: WizardAnswers[string]) => setA((x) => ({ ...x, [k]: v }));
  const dark = theme === "dark";
  const missing = fields.some((f) => f.required && !textOf(a[f.key]));
  const go = (to: number) => {
    setQuizOpen(false);
    setStep(to);
    if (to === n) onComplete?.(a, toDraftCompany(recipe, a));
  };
  const seg = textOf(a[branchKey]);
  const time = (seg && recipe.intro?.time_by_segment?.[seg]) || recipe.intro?.time;
  const addCustom = (f: WizardField, cur: string[]) => {
    const v = (custom[f.key] ?? "").trim();
    if (v && !cur.includes(v)) set(f.key, [...cur, v]);
    setCustom({ ...custom, [f.key]: "" });
  };

  const renderField = (f: WizardField) => {
    const id = `${uid}-${f.key}`;
    const req = f.required ? <span className="bw-req">{labels.required}</span> : null;
    const options = (f.options ?? []).map(opt);
    if (f.type === "cards") {
      return (
        <fieldset key={f.key} className="bw-field">
          {f.label && <legend>{f.label}{req}</legend>}
          <div className="bw-cards">
            {options.map((o) => (
              <label key={o.value} className="bw-card">
                <input type="radio" name={id} value={o.value} checked={a[f.key] === o.value} onChange={() => set(f.key, o.value)} />
                {o.short && <span className="bw-short">{o.short}</span>}
                <b>{o.label}</b>
                {o.text && <p>{o.text}</p>}
                {o.fits && <small>{o.fits}</small>}
              </label>
            ))}
          </div>
          {f.unsure && (
            <div className="bw-unsure">
              <p>{f.unsure.text ?? ""}</p>
              <button type="button" className="bw-btn secondary" onClick={() => (quiz ? setQuizOpen(true) : set(f.key, f.unsure?.fallback ?? "bmc"))}><em>{f.unsure.label}</em></button>
            </div>
          )}
        </fieldset>
      );
    }
    if (f.type === "choice" || f.type === "multi") {
      const multi = f.type === "multi";
      const cur = multi ? listOf(a[f.key]) : [textOf(a[f.key])];
      const extra = multi ? cur.filter((x) => !options.some((o) => o.value === x)) : [];
      const all = [...options, ...extra.map((x) => ({ value: x, label: x }))];
      const full = multi && f.max != null && cur.length >= f.max;
      return (
        <fieldset key={f.key} className="bw-field">
          <legend>{f.label}{req}</legend>
          {(f.hint || (multi && f.max)) && <p className="bw-hint">{[f.hint, multi && f.max ? labels.chooseMax(f.max) : ""].filter(Boolean).join(" · ")}</p>}
          <div className="bw-choices" data-multi={multi || undefined}>
            {all.map((o) => {
              const on = cur.includes(o.value);
              return (
                <label key={o.value} className="bw-pick">
                  <input
                    type={multi ? "checkbox" : "radio"}
                    name={id}
                    value={o.value}
                    checked={on}
                    disabled={full && !on}
                    onChange={() => set(f.key, multi ? (on ? cur.filter((x) => x !== o.value) : [...cur, o.value]) : o.value)}
                  />
                  {o.label}{(o as { hint?: string }).hint && <small>{(o as { hint?: string }).hint}</small>}
                </label>
              );
            })}
          </div>
          {multi && f.allow_custom && !full && (
            <div className="bw-custom">
              <input
                className="bw-input"
                aria-label={`${f.label ?? f.key} — ${labels.addCustom}`}
                placeholder={labels.addCustom}
                value={custom[f.key] ?? ""}
                onChange={(e) => setCustom({ ...custom, [f.key]: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(f, cur); } }}
              />
              <button type="button" className="bw-btn secondary" aria-label={labels.addCustom} onClick={() => addCustom(f, cur)}><em>{plus}</em></button>
            </div>
          )}
        </fieldset>
      );
    }
    if (f.type === "list") {
      const listInputs = (values: string[], onChange: (v: string[]) => void, label: string) => {
        const list = values.length ? values : [""];
        return (
          <div className="bw-list">
            {list.map((v, i) => (
              <input key={i} className="bw-input" aria-label={`${label} ${i + 1}`} placeholder={i === 0 ? f.placeholder : undefined} value={v} onChange={(e) => { const next = [...list]; next[i] = e.target.value; onChange(next); }} />
            ))}
            {list.length < (f.max ?? 5) && (
              <button type="button" className="bw-btn ghost" style={{ alignSelf: "flex-start" }} onClick={() => onChange([...list, ""])}><em>{plus}&nbsp;{labels.addItem}</em></button>
            )}
          </div>
        );
      };
      if (f.per === "objective") {
        const objectives = listOf(a.objectives);
        const map = (typeof a[f.key] === "object" && !Array.isArray(a[f.key]) ? a[f.key] : {}) as Record<string, string[]>;
        if (!objectives.length) return null;
        return (
          <div key={f.key} className="bw-field">
            <label>{f.label}{req}</label>
            {objectives.map((o, i) => <div key={i} className="bw-sub"><b>{o}</b>{listInputs(map[String(i)] ?? [], (v) => set(f.key, { ...map, [String(i)]: v }), o)}</div>)}
          </div>
        );
      }
      return (
        <div key={f.key} className="bw-field">
          <label>{f.label}{req}</label>
          {f.hint && <p className="bw-hint">{f.hint}</p>}
          {listInputs(Array.isArray(a[f.key]) ? (a[f.key] as string[]) : [], (v) => set(f.key, v), f.label ?? f.key)}
        </div>
      );
    }
    const long = !!s.by_methodology;
    return (
      <div key={f.key} className="bw-field">
        <label htmlFor={id}>{f.label}{req}</label>
        {f.hint && <p className="bw-hint">{f.hint}</p>}
        {long
          ? <textarea id={id} className="bw-input" placeholder={f.placeholder} value={(a[f.key] as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />
          : <input id={id} type={f.type === "date" ? "date" : "text"} className="bw-input" placeholder={f.placeholder} value={(a[f.key] as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !missing) go(step + 1); }} style={f.type === "date" ? { maxWidth: 240 } : undefined} />}
      </div>
    );
  };

  const draft = done ? toDraftCompany(recipe, a) : null;
  const methodName = (m?: string) => {
    const f = recipe.steps.flatMap((x) => x.fields ?? []).find((x) => x.type === "cards");
    const o = (f?.options ?? []).map(opt).find((x) => x.value === m);
    return o ? `${o.short ? o.short + " · " : ""}${o.label}` : m ?? "";
  };
  const sections = recipe.result.sections ?? [];
  const empty = recipe.result.empty ?? labels.empty;

  return (
    <div className={`bw ${dark ? "dark" : ""} ${className}`} data-ts-theme={dark ? "dark" : "cream"} data-theme={dark ? "dark" : "light"}>
      <style>{CSS}</style>
      <div className="bw-bar">
        <div className="bw-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="bw-title">{labels.title}</span>
        <span className="bw-count">{done ? labels.result : `${step + 1} / ${n}`}</span>
      </div>
      <div className="bw-split">
        <div className="bw-rail">
          <ol>
            {steps.map((x, i) => (
              <li key={x.id} data-state={i < step ? "done" : i === step ? "now" : "todo"}><span className="bw-dot">{i < step ? check : null}</span>{x.title}</li>
            ))}
            <li data-state={done ? "now" : "todo"}><span className="bw-dot" />{labels.result}</li>
          </ol>
          {time && <p className="bw-time">{time}</p>}
        </div>
        <div className="bw-main">
          <div className="bw-progress" role="progressbar" aria-valuemin={0} aria-valuemax={n} aria-valuenow={Math.min(step, n)}><i style={{ width: `${(Math.min(step, n) / n) * 100}%` }} /></div>
          {!done && quizOpen && quiz ? (
            <>
              <button type="button" className="bw-btn ghost" style={{ alignSelf: "flex-start" }} onClick={() => setQuizOpen(false)}><em>← {labels.quizBack}</em></button>
              <MethodQuiz {...quiz} bare theme={theme} labels={{ cta: labels.quizDone }} onCta={(m) => { set("methodology", m); setQuizOpen(false); }} />
            </>
          ) : !done ? (
            <>
              {step === 0 && recipe.intro && (
                <div className="bw-intro">
                  {recipe.intro.eyebrow && <span>{recipe.intro.eyebrow}</span>}
                  {recipe.intro.lead && <p>{recipe.intro.lead}</p>}
                  {recipe.intro.privacy && <small>{recipe.intro.privacy}</small>}
                </div>
              )}
              <h3 className="bw-h">{s.title}</h3>
              {s.lead && <p className="bw-lead">{s.lead}</p>}
              {s.by_methodology ? <div className="bw-grid">{fields.map(renderField)}</div> : fields.map(renderField)}
              <div className="bw-nav">
                {step > 0 && <button type="button" className="bw-btn ghost" onClick={() => go(step - 1)}><em>{labels.back}</em></button>}
                <span className="bw-sp" />
                {step > 0 && !fields.some((f) => f.required) && <button type="button" className="bw-btn ghost" onClick={() => go(step + 1)}><em>{labels.skip}</em></button>}
                <button type="button" className="bw-btn primary" disabled={missing} onClick={() => go(step + 1)}><em>{step === n - 1 ? labels.finish : labels.next}</em><span>{arrow}</span></button>
              </div>
            </>
          ) : draft ? (
            <>
              <span className="bw-tag">{labels.draft} · {draft.name}</span>
              <h3 className="bw-h">{recipe.result.title}</h3>
              {recipe.result.lead && <p className="bw-lead">{recipe.result.lead}</p>}
              <div className="bw-draft" aria-label={draft.name}>
                {sections.map((sec) => {
                  const items = sectionItems(sec.from, draft, methodName);
                  return (
                    <div key={sec.label} className="bw-block" data-empty={!items.length}>
                      <span>{sec.label}{items.length > 1 && <b style={{ fontWeight: 500 }}>{items.length}</b>}</span>
                      {items.length ? <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul> : <p>{empty}</p>}
                    </div>
                  );
                })}
              </div>
              <div className="bw-nav">
                <button type="button" className="bw-btn ghost" onClick={() => go(n - 1)}><em>{labels.back}</em></button>
                <span className="bw-sp" />
                {(recipe.result.ctas ?? []).slice().reverse().map((c) => (
                  <button key={c.label} type="button" className={`bw-btn ${c.variant === "primary" ? "primary" : "secondary"}`} onClick={() => onCta?.(c.href, draft)}>
                    <em>{c.label}</em>{c.variant === "primary" && <span>{arrow}</span>}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
