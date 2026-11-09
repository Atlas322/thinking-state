"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type StepperValues = {
  name: string;
  url: string;
  invites: string[];
  plan: string;
};

export type StepperFormProps = {
  initialValues?: Partial<StepperValues>;
  initialStep?: number;
  step?: number;
  onStepChange?: (step: number) => void;
  submitLabel?: string;
  submittingLabel?: string;
  onComplete?: (values: StepperValues) => void | Promise<void>;
  className?: string;
};

const STEPS = [
  { id: "workspace", title: "Workspace", heading: "Name your workspace", description: "This is where your team's projects live." },
  { id: "team", title: "Team", heading: "Invite your team", description: "They get an email with a link to join. You can skip this." },
  { id: "plan", title: "Plan", heading: "Pick a plan", description: "You can change it any time from settings." },
  { id: "review", title: "Review", heading: "Check and create", description: "Everything look right?" },
];

const PLANS = [
  { value: "Free", title: "Free", aside: "$0", description: "Up to 3 members and 2 projects." },
  { value: "Pro", title: "Pro", aside: "$12 / seat", description: "Unlimited projects, guests and history.", badge: "Popular" },
  { value: "Business", title: "Business", aside: "$24 / seat", description: "SSO, audit log and priority support." },
];

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const emailOk = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

export function StepperForm({
  initialValues,
  initialStep = 0,
  step: stepIn,
  onStepChange,
  submitLabel = "Create workspace",
  submittingLabel = "Creating…",
  onComplete,
  className = "",
}: StepperFormProps) {
  const [values, setValues] = React.useState<StepperValues>(() => {
    const name = initialValues?.name ?? "Northwind Studio";
    return { name, url: initialValues?.url ?? slug(name), invites: initialValues?.invites ?? [], plan: initialValues?.plan ?? "Pro" };
  });
  const [urlTouched, setUrlTouched] = React.useState(!!initialValues?.url);
  const [stepLocal, setStepLocal] = React.useState(initialStep);
  const step = stepIn ?? stepLocal;
  const [dir, setDir] = React.useState(1);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [shake, setShake] = React.useState(0);
  const [draft, setDraft] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const goTo = (n: number) => {
    setDir(n > step ? 1 : -1);
    setErrors({});
    if (stepIn === undefined) setStepLocal(n);
    onStepChange?.(n);
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!values.name.trim()) e.name = "Give your workspace a name.";
      if (!values.url) e.url = "Pick a URL for your workspace.";
      else if (!/^[a-z0-9-]+$/.test(values.url)) e.url = "Use lowercase letters, numbers and dashes.";
    }
    if (step === 1 && draft.trim() && !emailOk(draft.trim())) e.invites = "That doesn't look like an email address.";
    return e;
  };

  const addInvites = (raw: string) => {
    const parts = raw.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean);
    const good = parts.filter((p) => emailOk(p) && !values.invites.includes(p));
    const bad = parts.filter((p) => !emailOk(p));
    if (good.length) setValues((v) => ({ ...v, invites: [...v.invites, ...good] }));
    setDraft(bad.join(", "));
    setErrors(bad.length ? { invites: "That doesn't look like an email address." } : {});
  };

  const next = async () => {
    if (step === 1 && draft.trim()) addInvites(draft);
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      setShake((n) => n + 1);
      return;
    }
    if (step < STEPS.length - 1) return goTo(step + 1);
    setBusy(true);
    try {
      await onComplete?.(values);
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setValues({ name: "", url: "", invites: [], plan: "Pro" });
    setUrlTouched(false);
    setDone(false);
    goTo(0);
  };

  const s = STEPS[step];
  const field = (name: string, label: string, control: React.ReactNode, hint?: string) => (
    <div className="sf-field">
      <label htmlFor={`sf-${name}`}>{label}</label>
      <div key={errors[name] ? shake : 0} className={errors[name] ? "sf-bad" : ""}>
        {control}
      </div>
      {errors[name] ? (
        <p className="sf-err" role="alert" id={`sf-${name}-err`}>
          {errors[name]}
        </p>
      ) : (
        hint && <p className="sf-hint">{hint}</p>
      )}
    </div>
  );

  return (
    <section className={`sf ${className}`} aria-label="Create a workspace">
      <style>{css}</style>
      {done ? (
        <div className="sf-success">
          <span className="sf-check">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.5 12.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <h3>{values.name} is ready</h3>
          <p>
            affect.app/{values.url}
            {values.invites.length ? ` · ${values.invites.length} invite${values.invites.length > 1 ? "s" : ""} sent` : ""}
          </p>
          <button type="button" className="sf-btn sf-ghost" onClick={reset}>
            Start over
          </button>
        </div>
      ) : (
        <>
          <ol className="sf-steps">
            {STEPS.map((st, i) => (
              <li key={st.id} className={i < step ? "done" : i === step ? "cur" : ""} aria-current={i === step ? "step" : undefined}>
                <button type="button" disabled={i >= step} onClick={() => goTo(i)}>
                  <span className="sf-n">
                    {i < step ? (
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 8.3 2.6 2.5L12 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  {st.title}
                </button>
              </li>
            ))}
          </ol>
          <div className="sf-body" key={step} style={{ ["--sf-dir" as string]: dir }}>
            <h3 className="sf-h">{s.heading}</h3>
            <p className="sf-d">{s.description}</p>
            {step === 0 && (
              <>
                {field(
                  "name",
                  "Workspace name",
                  <input
                    id="sf-name"
                    className="sf-input"
                    value={values.name}
                    aria-invalid={!!errors.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setValues((v) => ({ ...v, name, url: urlTouched ? v.url : slug(name) }));
                    }}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                  />,
                )}
                {field(
                  "url",
                  "Workspace URL",
                  <div className="sf-input sf-prefixed">
                    <span>affect.app/</span>
                    <input
                      id="sf-url"
                      value={values.url}
                      aria-invalid={!!errors.url}
                      onChange={(e) => {
                        setUrlTouched(true);
                        setValues((v) => ({ ...v, url: e.target.value }));
                      }}
                      onKeyDown={(e) => e.key === "Enter" && next()}
                    />
                  </div>,
                  "Lowercase letters, numbers and dashes",
                )}
              </>
            )}
            {step === 1 &&
              field(
                "invites",
                "Email addresses",
                <div className="sf-input sf-tags">
                  {values.invites.map((em) => (
                    <span key={em} className="sf-tag">
                      {em}
                      <button
                        type="button"
                        aria-label={`Remove ${em}`}
                        onClick={() => setValues((v) => ({ ...v, invites: v.invites.filter((x) => x !== em) }))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    id="sf-invites"
                    value={draft}
                    placeholder={values.invites.length ? "" : "name@company.com"}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/[,\s]$/.test(v)) addInvites(v);
                      else setDraft(v);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      addInvites(draft + e.clipboardData.getData("text"));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (draft.trim()) addInvites(draft);
                        else next();
                      } else if (e.key === "Backspace" && !draft && values.invites.length) {
                        setValues((v) => ({ ...v, invites: v.invites.slice(0, -1) }));
                      }
                    }}
                  />
                </div>,
                "Press Enter or comma to add. Paste a list to add several.",
              )}
            {step === 2 && (
              <div className="sf-choices" role="radiogroup" aria-label="Plan">
                {PLANS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    role="radio"
                    aria-checked={values.plan === p.value}
                    className="sf-choice"
                    onClick={() => setValues((v) => ({ ...v, plan: p.value }))}
                  >
                    <span className="sf-radio" />
                    <span className="sf-ct">
                      <span className="sf-ctop">
                        <strong>{p.title}</strong>
                        {p.badge && <span className="sf-badge">{p.badge}</span>}
                        <span className="sf-aside">{p.aside}</span>
                      </span>
                      <span className="sf-cd">{p.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
            {step === 3 && (
              <dl className="sf-review">
                {[
                  ["Workspace", values.name, 0],
                  ["URL", `affect.app/${values.url}`, 0],
                  ["Team", values.invites.length ? values.invites.join(", ") : "Just you for now", 1],
                  ["Plan", values.plan, 2],
                ].map(([k, v, st]) => (
                  <div key={k as string}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                    <button type="button" className="sf-edit" aria-label={`Edit ${k}`} onClick={() => goTo(st as number)}>
                      Edit
                    </button>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <footer className="sf-foot">
            {step > 0 && (
              <button type="button" className="sf-btn sf-ghost" onClick={() => goTo(step - 1)}>
                Back
              </button>
            )}
            <button type="button" className="sf-btn sf-primary" disabled={busy} onClick={next}>
              {step === STEPS.length - 1 ? (busy ? submittingLabel : submitLabel) : step === 1 && !values.invites.length && !draft ? "Skip" : "Continue"}
            </button>
          </footer>
        </>
      )}
    </section>
  );
}

const css = `
.sf{--sf-bg:#fff;--sf-fg:#18181b;--sf-muted:#52525b;--sf-faint:#8b8b93;--sf-line:#ececef;--sf-field:#fff;--sf-accent:#3b82f6;--sf-red:#e5484d;--sf-green:#22a356;--sf-btn:#18181b;--sf-btn-fg:#fff;width:100%;max-width:482px;background:var(--sf-bg);color:var(--sf-fg);border:1px solid var(--sf-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .sf{--sf-bg:#1b1b1e;--sf-fg:#ececef;--sf-muted:#a1a1aa;--sf-faint:#71717a;--sf-line:#2e2e33;--sf-field:#202024;--sf-accent:#6aa3ff;--sf-btn:#ececef;--sf-btn-fg:#18181b;color-scheme:dark}
.sf *{box-sizing:border-box}.sf button{font:inherit;color:inherit;cursor:pointer}
.sf-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:0;padding:16px 20px 0;list-style:none}
.sf-steps li{border-top:2px solid var(--sf-line);transition:border-color .3s}
.sf-steps li.cur,.sf-steps li.done{border-color:var(--sf-accent)}
.sf-steps button{display:flex;align-items:center;gap:8px;width:100%;padding:8px 0 0;border:0;background:none;font-size:10.5px!important;letter-spacing:.07em;text-transform:uppercase;color:var(--sf-faint)!important;text-align:left}
.sf-steps button:disabled{cursor:default}
.sf-steps li.cur button{color:var(--sf-fg)!important;font-weight:500}
.sf-steps li.done button{color:var(--sf-muted)!important}.sf-steps li.done button:hover{color:var(--sf-fg)!important}
.sf-n{display:inline-grid;place-items:center;min-width:10px;font-size:10.5px;color:var(--sf-faint)}
.sf-steps li.cur .sf-n,.sf-steps li.done .sf-n{color:var(--sf-accent)}
.sf-n svg{width:11px;height:11px}
.sf-body{padding:20px 20px 22px;animation:sf-slide .28s cubic-bezier(.2,.8,.2,1) both}
.sf-h{margin:0;font-size:16px;font-weight:500;letter-spacing:-.005em}
.sf-d{margin:2px 0 16px;color:var(--sf-muted)}
.sf-field{margin-top:12px}
.sf-field>label{display:block;margin:0 0 6px 2px;font-size:13px;color:var(--sf-muted)}
.sf-input{display:flex;align-items:center;width:100%;min-height:34px;padding:0 10px;border:1px solid var(--sf-line);border-radius:8px;background:var(--sf-field);font:inherit;color:inherit;box-shadow:0 1px 1px #00000005;transition:border-color .15s,box-shadow .15s}
input.sf-input{outline:none}
.sf-input:focus-within,input.sf-input:focus{border-color:color-mix(in srgb,var(--sf-accent) 60%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--sf-accent) 15%,transparent)}
.sf-input input{flex:1;min-width:0;height:32px;border:0;background:none;outline:none;font:inherit;color:inherit;padding:0}
.sf-prefixed span{color:var(--sf-faint)}
.sf-bad .sf-input,.sf-bad input.sf-input{border-color:var(--sf-red)}
.sf-bad{animation:sf-shake .32s both}
.sf-hint{margin:6px 0 0 2px;font-size:12px;color:var(--sf-faint)}
.sf-err{margin:6px 0 0 2px;font-size:12px;color:var(--sf-red)}
.sf-tags{flex-wrap:nowrap;gap:6px;overflow-x:auto;scrollbar-width:none}
.sf-tag{display:inline-flex;align-items:center;gap:4px;flex:none;height:22px;padding:0 4px 0 8px;border-radius:5px;background:color-mix(in srgb,var(--sf-fg) 7%,transparent);font-size:12.5px}
.sf-tag button{border:0;background:none;padding:0 3px;color:var(--sf-faint)!important;font-size:14px!important;line-height:1}
.sf-choices{display:flex;flex-direction:column;gap:8px}
.sf-choice{display:flex;gap:10px;align-items:flex-start;padding:11px 12px;border:1px solid var(--sf-line);border-radius:9px;background:var(--sf-field);text-align:left;transition:background .15s,border-color .15s}
.sf-choice[aria-checked=true]{background:color-mix(in srgb,var(--sf-accent) 6%,var(--sf-field));border-color:color-mix(in srgb,var(--sf-accent) 45%,transparent)}
.sf-radio{width:14px;height:14px;margin-top:3px;border-radius:50%;border:1px solid var(--sf-faint);flex:none}
.sf-choice[aria-checked=true] .sf-radio{border:4px solid var(--sf-accent)}
.sf-ct{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
.sf-ctop{display:flex;align-items:center;gap:8px}.sf-ctop strong{font-weight:500}
.sf-badge{font-size:11px;padding:0 6px;border-radius:4px;background:color-mix(in srgb,var(--sf-accent) 12%,transparent);color:var(--sf-accent)}
.sf-aside{margin-left:auto;font-size:13px;color:var(--sf-muted)}
.sf-cd{font-size:13px;color:var(--sf-muted)}
.sf-review{margin:0;border:1px solid var(--sf-line);border-radius:9px}
.sf-review>div{display:flex;align-items:baseline;gap:12px;padding:9px 12px}
.sf-review>div+div{border-top:1px solid var(--sf-line)}
.sf-review dt{width:84px;flex:none;color:var(--sf-muted);font-size:13px}
.sf-review dd{margin:0;flex:1;min-width:0;overflow-wrap:anywhere}
.sf-edit{border:0;background:none;padding:0;font-size:13px!important;color:var(--sf-accent)!important}
.sf-foot{display:flex;justify-content:flex-end;gap:8px;padding:10px 12px;border-top:1px solid var(--sf-line)}
.sf-btn{height:28px;padding:0 10px;border-radius:6px;font-size:14px!important;border:1px solid transparent}
.sf-primary{background:var(--sf-btn);color:var(--sf-btn-fg)!important}
.sf-primary:disabled{opacity:.6;cursor:progress}
.sf-ghost{background:var(--sf-bg);border-color:var(--sf-line)}.sf-ghost:hover{background:color-mix(in srgb,var(--sf-fg) 5%,var(--sf-bg))}
.sf-success{display:flex;flex-direction:column;align-items:center;text-align:center;padding:36px 24px 28px}
.sf-check{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--sf-green);color:#fff;animation:sf-pop .45s cubic-bezier(.3,1.6,.5,1) both}
.sf-check svg{width:24px;height:24px}
.sf-success h3{margin:14px 0 2px;font-size:16px;font-weight:500}.sf-success p{margin:0 0 18px;color:var(--sf-muted)}
.sf :focus-visible{outline:2px solid var(--sf-accent);outline-offset:2px}
@keyframes sf-slide{from{opacity:0;transform:translateX(calc(var(--sf-dir,1) * 14px))}}
@keyframes sf-shake{20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}
@keyframes sf-pop{from{transform:scale(.4);opacity:0}}
@media(max-width:480px){.sf-steps{padding:14px 14px 0;gap:6px}.sf-steps button{font-size:0!important;gap:0}.sf-n{font-size:11px}.sf-body{padding:16px 14px 18px}}
@media(prefers-reduced-motion:reduce){.sf *,.sf-body{animation:none!important;transition:none!important}}
`;

export default StepperForm;
