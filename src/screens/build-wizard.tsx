/**
 * Build Wizard (2026-11-17) — the build page's «Бүтээх горим»: four steps (company · method · core picture ·
 * where knowledge lives) and a draft Company for the visitor's own Thinking State.
 * The recipe is data (web-app's build-asuumj JSON, same shape); MethodQuiz opens inside step 2 for «Мэдэхгүй байна».
 * Rules from the recipe: one step per screen, every question skippable except the method, no numbers filled in.
 * Tokens only (--ts-*), radius --ts-radius, 44px targets.
 */
import * as React from "react";
import type { Company, Methodology, PmPhase } from "../company/types";
import { MethodQuiz, type MethodQuizProps } from "./method-quiz";

// ── Recipe (mirrors build-asuumj JSON) ─────────────────────────────────────────
export type WizardOption = string | { value: string; label: string; hint?: string; short?: string; text?: string; fits?: string };
export type WizardField = {
  key: string;
  label?: string;
  type?: "text" | "choice" | "cards" | "multi" | "list";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: WizardOption[];
  max?: number;
  /** key_results: one list per objective. */
  per?: "objective";
  unsure?: { label: string; text?: string; fallback?: Methodology };
};
export type WizardStep = { id: string; title: string; lead?: string; fields?: WizardField[]; by_methodology?: Partial<Record<Methodology, WizardField[]>> };
export type WizardRecipe = {
  intro?: { eyebrow?: string; title?: string; lead?: string; time?: string; privacy?: string };
  steps: WizardStep[];
  result: { title: string; lead?: string; ctas?: { label: string; variant?: "primary" | "secondary"; href?: string }[] };
};
export type WizardAnswers = Record<string, string | string[] | Record<string, string[]>>;

export type BuildWizardLabels = { title: string; back: string; next: string; skip: string; finish: string; addItem: string; result: string; required: string; quizDone: string; quizBack: string; draft: string; empty: string };
export const buildWizardLabelsMn: BuildWizardLabels = {
  title: "Бүтээх горим",
  back: "Буцах",
  next: "Дараах",
  skip: "Алгасах",
  finish: "Ноорог гаргах",
  addItem: "Нэмэх",
  result: "Ноорог",
  required: "Заавал",
  quizDone: "Энэ аргаар үргэлжлүүлэх",
  quizBack: "Аргуудыг харах",
  draft: "Ноорог",
  empty: "Хоосон — дараа нь бөглөнө",
};
export type BuildWizardProps = {
  recipe: WizardRecipe;
  /** MethodQuiz content (method-quiz JSON); without it «Мэдэхгүй байна» picks the fallback method. */
  quiz?: Pick<MethodQuizProps, "questions" | "methods" | "note">;
  defaultAnswers?: WizardAnswers;
  defaultStep?: number;
  theme?: "light" | "dark";
  /** Fires on the result step with the answers and the draft Company (save it, open company.html?c=draft). */
  onComplete?: (answers: WizardAnswers, draft: Company) => void;
  onCta?: (href: string | undefined, draft: Company) => void;
  labels?: Partial<BuildWizardLabels>;
  className?: string;
};

const opt = (o: WizardOption) => (typeof o === "string" ? { value: o, label: o } : o);
const PHASES: PmPhase[] = ["initiating", "planning", "executing", "monitoring", "closing"];
const listOf = (v: WizardAnswers[string] | undefined) => (Array.isArray(v) ? v.filter((x) => x.trim()) : []);
const textOf = (v: WizardAnswers[string] | undefined) => (typeof v === "string" ? v.trim() : "");

/** Answers → a draft Company (contract unchanged; nothing invented: empty answers stay out). */
export function toDraftCompany(recipe: WizardRecipe, a: WizardAnswers): Company {
  const method = (textOf(a.methodology) || "bmc") as Methodology;
  const modelStep = recipe.steps.find((s) => s.by_methodology);
  const model: Record<string, string | null> = {};
  for (const f of modelStep?.by_methodology?.[method] ?? []) {
    if (f.type === "list" || f.type === "choice") continue;
    const v = textOf(a[f.key]);
    if (v && ["customers", "value", "channels", "revenue", "partners", "activities", "resources", "relationships", "costs", "problem", "solution", "metrics", "advantage"].includes(f.key)) model[f.key] = v;
  }
  const phaseIdx = (() => {
    const f = modelStep?.by_methodology?.pmbok?.find((x) => x.key === "phase");
    const i = (f?.options ?? []).map((o) => opt(o).value).indexOf(textOf(a.phase));
    return i >= 0 ? PHASES[i] : undefined;
  })();
  const objectives = listOf(a.objectives);
  const krs = (typeof a.key_results === "object" && !Array.isArray(a.key_results) ? a.key_results : {}) as Record<string, string[]>;
  const name = textOf(a.name) || "Ноорог";
  const unitId = "u-draft";
  return {
    id: "draft",
    name,
    segment: textOf(a.size) || "team",
    source: "visitor",
    methodology: method,
    model: model as unknown as Company["model"],
    units: [{ id: unitId, name, kind: "company" }],
    people: [],
    agents: [],
    workflows: [],
    projects: method === "pmbok" ? listOf(a.projects).map((p, i) => ({ id: `p${i + 1}`, name: p, unitId, status: "active", tasks: [], decisions: [], phase: phaseIdx })) : [],
    okrs: method === "okr" ? objectives.map((o, i) => ({ id: `o${i + 1}`, title: o, keyResults: listOf(krs[String(i)]).map((k, j) => ({ id: `o${i + 1}k${j + 1}`, title: k, progress: Number.NaN })) })) : undefined,
    // Risks and decision makers have no own field: tasks tagged with the PMBOK knowledge area.
    tasks: method === "pmbok" ? [
      ...(textOf(a.risks) ? [{ id: "risk-1", title: textOf(a.risks), status: "open", knowledgeArea: "risk" }] : []),
      ...(textOf(a.stakeholders) ? [{ id: "stake-1", title: textOf(a.stakeholders), status: "open", knowledgeArea: "stakeholder" }] : []),
    ] : undefined,
    notes: textOf(a.first_question) ? [{ id: "q-1", title: textOf(a.first_question) }] : undefined,
    facts: [
      ...(textOf(a.line) ? [{ label: "Юу хийдэг", value: textOf(a.line) }] : []),
      ...(listOf(a.tools).length ? [{ label: "Хэрэгсэл", value: listOf(a.tools).join(", ") }] : []),
      ...(textOf(a.pain) ? [{ label: "Мэдлэг алдагддаг газар", value: textOf(a.pain) }] : []),
    ],
  };
}

const CSS = `
.bw{font-family:var(--ts-font,Inter,system-ui,sans-serif);background:var(--ts-surface);color:var(--ts-fg);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size}
.bw-bar{display:flex;align-items:center;gap:12px;height:44px;padding:0 14px;border-bottom:1px solid var(--ts-line);background:var(--ts-soft)}
.bw-dots{display:flex;gap:6px}.bw-dots i{width:10px;height:10px;border-radius:50%;background:var(--ts-line)}
.bw-title{font-weight:500;font-size:14px;color:var(--ts-muted)}
.bw-count{margin-left:auto;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint)}
.bw-split{display:flex;min-height:520px}
.bw-rail{width:240px;flex:none;border-right:1px solid var(--ts-line);background:var(--ts-soft);padding:16px 12px;margin:0;list-style:none}
.bw-rail li{position:relative;display:flex;gap:12px;align-items:flex-start;min-height:44px;padding:4px 6px;font-size:14px;color:var(--ts-faint)}
.bw-rail li:not(:last-child)::after{content:"";position:absolute;left:15px;top:30px;bottom:-6px;width:1.5px;background:var(--ts-line)}
.bw-rail li[data-state="done"]::after{background:var(--ts-electric)}
.bw-dot{position:relative;z-index:1;width:20px;height:20px;flex:none;border-radius:50%;border:1.5px solid var(--ts-line);background:var(--ts-surface);display:grid;place-items:center;margin-top:1px}
.bw-rail li[data-state="done"] .bw-dot{border-color:var(--ts-electric);background:var(--ts-electric);color:var(--ts-on-electric)}
.bw-rail li[data-state="now"] .bw-dot{border-color:var(--ts-electric);box-shadow:0 0 0 4px var(--ts-electric-soft)}
.bw-rail li[data-state="now"],.bw-rail li[data-state="done"]{color:var(--ts-fg)}
.bw-rail li[data-state="now"]{font-weight:600}
.bw-main{flex:1;min-width:0;padding:28px 32px;display:flex;flex-direction:column;gap:20px}
.bw-progress{height:4px;border-radius:4px;background:var(--ts-soft-2);overflow:hidden}
.bw-progress i{display:block;height:100%;background:var(--ts-electric);transition:width .25s ease}
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
.bw-pick{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);cursor:pointer;font-size:15px}
.bw-pick small{color:var(--ts-muted);font-size:13px}
.bw-pick:hover{border-color:var(--ts-faint)}
.bw-pick:has(input:checked){border-color:var(--ts-electric);background:var(--ts-electric-soft)}
.bw-pick:has(input:focus-visible),.bw-card:has(input:focus-visible){outline:2px solid var(--ts-electric);outline-offset:2px}
.bw-pick input,.bw-card input{position:absolute;opacity:0;width:1px;height:1px}
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
.bw-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 20px;align-items:start}
.bw-list{display:flex;flex-direction:column;gap:8px}
.bw-sub{padding:12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);display:flex;flex-direction:column;gap:8px}
.bw-sub b{font-weight:500;font-size:14px}
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
.bw-draft{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.bw-block{padding:12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);min-height:72px;display:flex;flex-direction:column;gap:6px}
.bw-block span{font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.bw-block p{margin:0;font-size:14px;line-height:1.45}
.bw-block[data-empty="true"] p{color:var(--ts-faint);font-style:italic}
.bw-tag{align-self:flex-start;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;color:var(--ts-electric-fg);border:1px solid var(--ts-electric);border-radius:var(--ts-radius,6px);padding:3px 8px}
@container (max-width:680px){.bw-rail{display:none}.bw-main{padding:20px}.bw-cards,.bw-draft,.bw-grid{grid-template-columns:1fr}.bw-choices:not([data-multi]){flex-direction:column}.bw-choices:not([data-multi]) .bw-pick{justify-content:space-between}.bw-nav{flex-wrap:wrap}}
`;
const check = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
const arrow = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const plus = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;

/** Model block labels for the draft preview (key → short Mongolian name). */
const BLOCK: Record<string, string> = {
  customers: "Харилцагч", value: "Үнэ цэнэ", channels: "Суваг", relationships: "Харилцаа", revenue: "Орлого", activities: "Үйл ажиллагаа",
  resources: "Нөөц", partners: "Түнш", costs: "Зардал", problem: "Асуудал", solution: "Шийдэл", metrics: "Хэмжүүр", advantage: "Давуу тал",
  objectives: "Зорилго", key_results: "Гол үр дүн", projects: "Төсөл", phase: "Шат", risks: "Эрсдэл", stakeholders: "Шийдвэр гаргагч",
};

export function BuildWizard({ recipe, quiz, defaultAnswers = {}, defaultStep = 0, theme = "light", onComplete, onCta, labels: labelsIn, className = "" }: BuildWizardProps) {
  const labels = { ...buildWizardLabelsMn, ...labelsIn };
  const uid = React.useId();
  const [a, setA] = React.useState<WizardAnswers>(defaultAnswers);
  const [step, setStep] = React.useState(defaultStep);
  const [quizOpen, setQuizOpen] = React.useState(false);
  const steps = recipe.steps;
  const n = steps.length;
  const done = step >= n;
  const s = steps[Math.min(step, n - 1)];
  const method = (textOf(a.methodology) || undefined) as Methodology | undefined;
  const set = (k: string, v: WizardAnswers[string]) => setA((x) => ({ ...x, [k]: v }));
  const dark = theme === "dark";

  const fieldsOf = (st: WizardStep): WizardField[] => st.fields ?? (method ? st.by_methodology?.[method] ?? [] : []);
  const missing = fieldsOf(s).some((f) => f.required && !textOf(a[f.key]));
  const go = (to: number) => {
    setQuizOpen(false);
    setStep(to);
    if (to === n) onComplete?.(a, toDraftCompany(recipe, a));
  };

  const renderField = (f: WizardField) => {
    const id = `${uid}-${f.key}`;
    const req = f.required ? <span className="bw-req">{labels.required}</span> : null;
    const hint = f.hint ? <p className="bw-hint">{f.hint}</p> : null;
    const options = (f.options ?? []).map(opt);
    if (f.type === "cards") {
      return (
        <fieldset key={f.key} className="bw-field">
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
              <p>{f.unsure.text}</p>
              <button type="button" className="bw-btn secondary" onClick={() => (quiz ? setQuizOpen(true) : set(f.key, f.unsure?.fallback ?? "bmc"))}><em>{f.unsure.label}</em></button>
            </div>
          )}
        </fieldset>
      );
    }
    if (f.type === "choice" || f.type === "multi") {
      const multi = f.type === "multi";
      const cur = multi ? listOf(a[f.key]) : [textOf(a[f.key])];
      return (
        <fieldset key={f.key} className="bw-field">
          <legend>{f.label}{req}</legend>
          {hint}
          <div className="bw-choices" data-multi={multi || undefined}>
            {options.map((o) => (
              <label key={o.value} className="bw-pick">
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={id}
                  value={o.value}
                  checked={cur.includes(o.value)}
                  onChange={() => set(f.key, multi ? (cur.includes(o.value) ? cur.filter((x) => x !== o.value) : [...cur, o.value]) : o.value)}
                />
                {o.label}{o.hint && <small>{o.hint}</small>}
              </label>
            ))}
          </div>
        </fieldset>
      );
    }
    if (f.type === "list") {
      const listInputs = (values: string[], onChange: (v: string[]) => void, label: string) => {
        const shown = values.length ? values : [""];
        return (
          <div className="bw-list">
            {shown.map((v, i) => (
              <input key={i} className="bw-input" aria-label={`${label} ${i + 1}`} value={v} onChange={(e) => { const next = [...shown]; next[i] = e.target.value; onChange(next); }} />
            ))}
            {shown.length < (f.max ?? 5) && (
              <button type="button" className="bw-btn ghost" style={{ alignSelf: "flex-start" }} onClick={() => onChange([...shown, ""])}><em>{plus}&nbsp;{labels.addItem}</em></button>
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
            {hint}
            {objectives.map((o, i) => (
              <div key={i} className="bw-sub"><b>{o}</b>{listInputs(map[String(i)] ?? [], (v) => set(f.key, { ...map, [String(i)]: v }), o)}</div>
            ))}
          </div>
        );
      }
      return (
        <div key={f.key} className="bw-field">
          <label>{f.label}{req}</label>
          {hint}
          {listInputs(listOf(a[f.key]).length ? (a[f.key] as string[]) : [], (v) => set(f.key, v), f.label ?? f.key)}
        </div>
      );
    }
    const long = !!s.by_methodology;
    return (
      <div key={f.key} className="bw-field">
        <label htmlFor={id}>{f.label}{req}</label>
        {hint}
        {long
          ? <textarea id={id} className="bw-input" placeholder={f.placeholder} value={textOf(a[f.key]) || (a[f.key] as string) || ""} onChange={(e) => set(f.key, e.target.value)} />
          : <input id={id} className="bw-input" placeholder={f.placeholder} value={(a[f.key] as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !missing) go(step + 1); }} />}
      </div>
    );
  };

  const draft = done ? toDraftCompany(recipe, a) : null;
  const draftBlocks = (() => {
    const st = steps.find((x) => x.by_methodology);
    return (method ? st?.by_methodology?.[method] ?? [] : []).map((f) => {
      const v = a[f.key];
      const text = f.per === "objective"
        ? Object.values((v ?? {}) as Record<string, string[]>).flat().filter((x) => x.trim()).join(" · ")
        : Array.isArray(v) ? listOf(v).join(" · ") : textOf(v);
      return { key: f.key, name: BLOCK[f.key] ?? f.label ?? f.key, text };
    });
  })();
  const methodLabel = (() => {
    const f = steps.flatMap((x) => x.fields ?? []).find((x) => x.type === "cards");
    const o = (f?.options ?? []).map(opt).find((x) => x.value === method);
    return o ? `${o.short ?? ""} · ${o.label}` : method ?? "";
  })();

  return (
    <div className={`bw ${dark ? "dark" : ""} ${className}`} data-ts-theme={dark ? "dark" : "cream"} data-theme={dark ? "dark" : "light"}>
      <style>{CSS}</style>
      <div className="bw-bar">
        <div className="bw-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="bw-title">{labels.title}</span>
        <span className="bw-count">{done ? labels.result : `${step + 1} / ${n}`}</span>
      </div>
      <div className="bw-split">
        <ol className="bw-rail">
          {steps.map((x, i) => (
            <li key={x.id} data-state={i < step ? "done" : i === step ? "now" : "todo"}><span className="bw-dot">{i < step ? check : null}</span>{x.title}</li>
          ))}
          <li data-state={done ? "now" : "todo"}><span className="bw-dot" />{labels.result}</li>
        </ol>
        <div className="bw-main">
          <div className="bw-progress" role="progressbar" aria-valuemin={0} aria-valuemax={n} aria-valuenow={Math.min(step, n)}><i style={{ width: `${(Math.min(step, n) / n) * 100}%` }} /></div>
          {!done && quizOpen && quiz ? (
            <>
            <button type="button" className="bw-btn ghost" style={{ alignSelf: "flex-start" }} onClick={() => setQuizOpen(false)}><em>← {labels.quizBack}</em></button>
            <MethodQuiz
              {...quiz}
              bare
              theme={theme}
              labels={{ cta: labels.quizDone }}
              onCta={(m) => { set("methodology", m); go(step + 1); }}
            />
            </>
          ) : !done ? (
            <>
              <h3 className="bw-h">{s.title}</h3>
              {s.lead && <p className="bw-lead">{s.lead}</p>}
              {s.by_methodology ? <div className="bw-grid">{fieldsOf(s).map(renderField)}</div> : fieldsOf(s).map(renderField)}
              <div className="bw-nav">
                {step > 0 && <button type="button" className="bw-btn ghost" onClick={() => go(step - 1)}><em>{labels.back}</em></button>}
                <span className="bw-sp" />
                {!fieldsOf(s).some((f) => f.required) && <button type="button" className="bw-btn ghost" onClick={() => go(step + 1)}><em>{labels.skip}</em></button>}
                <button type="button" className="bw-btn primary" disabled={missing} onClick={() => go(step + 1)}><em>{step === n - 1 ? labels.finish : labels.next}</em><span>{arrow}</span></button>
              </div>
            </>
          ) : draft ? (
            <>
              <span className="bw-tag">{labels.draft} · {methodLabel}</span>
              <h3 className="bw-h">{recipe.result.title}</h3>
              {recipe.result.lead && <p className="bw-lead">{recipe.result.lead}</p>}
              <div className="bw-draft" aria-label={draft.name}>
                {draftBlocks.map((b) => (
                  <div key={b.key} className="bw-block" data-empty={!b.text}><span>{b.name}</span><p>{b.text || labels.empty}</p></div>
                ))}
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
