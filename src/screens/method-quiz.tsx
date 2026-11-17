/**
 * Method Quiz (2026-11-17) — the build page's questionnaire as an app window: a few questions, one per
 * step, and a recommended management method (BMC · PMBOK · OKR · Lean Canvas) with the reason.
 * Content (questions, options, weights, method texts) is data: the site passes its own. Tokens only,
 * radius --ts-radius, 44px targets, keyboard: arrows move between options, Enter goes on.
 */
import * as React from "react";
import type { Methodology } from "../company/types";

export type QuizOption = { id: string; label: string; hint?: string; /** Points per method. */ weights: Partial<Record<Methodology, number>> };
export type QuizQuestion = { id: string; title: string; help?: string; options: QuizOption[] };
export type QuizMethod = { id: Methodology; name: string; short: string; why: string; firstStep: string };
export type MethodQuizLabels = { title: string; step: (i: number, n: number) => string; back: string; next: string; result: string; restart: string; cta: string; match: string; firstStep: string; points: (n: number) => string };
export const methodQuizLabelsMn: MethodQuizLabels = {
  title: "Арга зүйн асуумж",
  step: (i, n) => `${i} / ${n}`,
  back: "Буцах",
  next: "Дараах",
  result: "Тохирох арга",
  restart: "Дахин эхлэх",
  cta: "Уулзалт товлох",
  match: "Арга бүрийн оноо",
  firstStep: "Эхний алхам:",
  points: (n) => `${n} оноо`,
};
export type MethodQuizProps = {
  questions: QuizQuestion[];
  methods: QuizMethod[];
  /** Pre-filled answers (question id → option id), e.g. for a screenshot of the result. */
  defaultAnswers?: Record<string, string>;
  defaultStep?: number;
  theme?: "light" | "dark";
  onComplete?: (method: Methodology, answers: Record<string, string>) => void;
  onCta?: (method: Methodology) => void;
  /** One line under the result, e.g. «Дараа нь сольж болно». */
  note?: string;
  /** Hide the window chrome (title bar) when the quiz sits inside another window. */
  bare?: boolean;
  labels?: Partial<MethodQuizLabels>;
  className?: string;
};

export function scoreMethods(questions: QuizQuestion[], answers: Record<string, string>): Record<Methodology, number> {
  const score = { bmc: 0, pmbok: 0, okr: 0, "lean-canvas": 0 } as Record<Methodology, number>;
  for (const q of questions) {
    const o = q.options.find((x) => x.id === answers[q.id]);
    if (o) for (const [m, w] of Object.entries(o.weights)) score[m as Methodology] += w ?? 0;
  }
  return score;
}

const CSS = `
.mq{font-family:var(--ts-font,Inter,system-ui,sans-serif);background:var(--ts-surface);color:var(--ts-fg);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size}
.mq-bar{display:flex;align-items:center;gap:12px;height:44px;padding:0 14px;border-bottom:1px solid var(--ts-line);background:var(--ts-soft)}
.mq-dots{display:flex;gap:6px}.mq-dots i{width:10px;height:10px;border-radius:50%;background:var(--ts-line)}
.mq-title{font-weight:500;font-size:14px;color:var(--ts-muted)}
.mq-count{margin-left:auto;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint)}
.mq-split{display:flex;min-height:440px}
.mq-rail{width:240px;flex:none;border-right:1px solid var(--ts-line);background:var(--ts-soft);padding:16px 12px;margin:0;list-style:none;display:flex;flex-direction:column;gap:0}
.mq-rail li{position:relative;display:flex;gap:12px;align-items:flex-start;min-height:44px;padding:4px 6px;font-size:14px;color:var(--ts-faint)}
.mq-rail li:not(:last-child)::after{content:"";position:absolute;left:15px;top:30px;bottom:-6px;width:1.5px;background:var(--ts-line)}
.mq-rail li[data-state="done"]::after{background:var(--ts-electric)}
.mq-dot{position:relative;z-index:1;width:20px;height:20px;flex:none;border-radius:50%;border:1.5px solid var(--ts-line);background:var(--ts-surface);display:grid;place-items:center;margin-top:1px}
.mq-rail li[data-state="done"] .mq-dot{border-color:var(--ts-electric);background:var(--ts-electric);color:var(--ts-on-electric)}
.mq-rail li[data-state="now"] .mq-dot{border-color:var(--ts-electric);box-shadow:0 0 0 4px var(--ts-electric-soft)}
.mq-rail li[data-state="now"],.mq-rail li[data-state="done"]{color:var(--ts-fg)}
.mq-rail li[data-state="now"]{font-weight:600}
.mq-main{flex:1;min-width:0;padding:28px 32px;display:flex;flex-direction:column;gap:20px}
.mq-progress{height:4px;border-radius:4px;background:var(--ts-soft-2);overflow:hidden}
.mq-progress i{display:block;height:100%;background:var(--ts-electric);transition:width var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-standard,ease)}
.mq-q{font:400 24px/1.2 Spectral,Georgia,serif;margin:0}
.mq-help{margin:-8px 0 0;font-size:14px;color:var(--ts-muted)}
.mq-opts{display:grid;gap:8px;margin:0;padding:0;border:0}
.mq-opt{display:flex;gap:12px;align-items:flex-start;min-height:44px;padding:12px 14px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);cursor:pointer}
.mq-opt:hover{border-color:var(--ts-faint)}
.mq-opt:has(input:checked){border-color:var(--ts-electric);background:var(--ts-electric-soft)}
.mq-opt:has(input:focus-visible){outline:2px solid var(--ts-electric);outline-offset:2px}
.mq-opt input{appearance:none;width:18px;height:18px;flex:none;margin:1px 0 0;border-radius:50%;border:1.5px solid var(--ts-faint);background:var(--ts-surface);display:grid;place-items:center}
.mq-opt input:checked{border-color:var(--ts-electric)}
.mq-opt input:checked::after{content:"";width:8px;height:8px;border-radius:50%;background:var(--ts-electric)}
.mq-opt b{display:block;font-weight:500;font-size:16px}
.mq-opt small{display:block;font-size:14px;color:var(--ts-muted);margin-top:2px}
.mq-nav{display:flex;gap:8px;justify-content:space-between;margin-top:auto}
.mq-btn{display:inline-flex;align-items:stretch;min-height:44px;border-radius:var(--ts-radius,6px);font:inherit;font-weight:500;font-size:15px;cursor:pointer;padding:0}
.mq-btn>em{font-style:normal;display:flex;align-items:center;padding:0 16px}
.mq-btn>span{display:grid;place-items:center;width:44px;border-left:1.5px solid color-mix(in srgb,currentColor 35%,transparent)}
.mq-btn.primary{border:0;background:var(--ts-electric);color:var(--ts-on-electric)}
.mq-btn.primary:disabled{opacity:.45;cursor:not-allowed}
.mq-btn.ghost{border:0;background:none;color:var(--ts-fg);text-decoration:underline;text-decoration-color:var(--ts-line);text-underline-offset:4px}
.mq-btn.ghost>em{padding:0 4px}
.mq-btn.ghost:disabled{visibility:hidden}
.mq-btn:focus-visible{outline:2px solid var(--ts-electric);outline-offset:2px}
.mq-res{border:1px solid var(--ts-electric);border-radius:var(--ts-radius,6px);background:var(--ts-electric-soft);padding:20px}
.mq-res h3{font:400 28px/1.15 Spectral,Georgia,serif;margin:6px 0 8px}
.mq-res p{margin:0 0 8px;font-size:16px;line-height:1.55}
.mq-label{font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.mq-bars{display:grid;gap:8px}
.mq-row{display:grid;grid-template-columns:120px 1fr 64px;gap:12px;align-items:center;font-size:14px}
.mq-row i{display:block;height:8px;border-radius:4px;background:var(--ts-soft-2);overflow:hidden}
.mq-row i b{display:block;height:100%;background:var(--ts-faint)}
.mq-row[data-top="true"] i b{background:var(--ts-electric)}
.mq-row span:last-child{font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint);text-align:right}
.mq-note{font-size:14px;color:var(--ts-muted);margin:8px 0 0}
.mq-bare{border:0;box-shadow:none;border-radius:0;background:transparent}
.mq-bare .mq-rail{display:none}
.mq-bare .mq-main{padding:0}
.mq-bare .mq-progress{display:none}
@container (max-width:680px){.mq-rail{display:none}.mq-main{padding:20px}}
`;
const check = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
const arrow = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;

export function MethodQuiz({ questions, methods, defaultAnswers = {}, defaultStep = 0, theme = "light", onComplete, onCta, note, bare = false, labels: labelsIn, className = "" }: MethodQuizProps) {
  const labels = { ...methodQuizLabelsMn, ...labelsIn };
  const [answers, setAnswers] = React.useState<Record<string, string>>(defaultAnswers);
  const [step, setStep] = React.useState(defaultStep);
  const n = questions.length;
  const done = step >= n;
  const q = questions[Math.min(step, n - 1)];
  const score = scoreMethods(questions, answers);
  const ranked = [...methods].sort((a, b) => score[b.id] - score[a.id]);
  const max = Math.max(1, ...Object.values(score));
  const top = ranked[0];
  const dark = theme === "dark";
  const uid = React.useId();
  const next = () => {
    const s = step + 1;
    setStep(s);
    if (s === n && top) onComplete?.(top.id, answers);
  };

  return (
    <div className={`mq ${bare ? "mq-bare" : ""} ${dark ? "dark" : ""} ${className}`} data-ts-theme={dark ? "dark" : "cream"} data-theme={dark ? "dark" : "light"}>
      <style>{CSS}</style>
      {!bare && <div className="mq-bar">
        <div className="mq-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="mq-title">{labels.title}</span>
        <span className="mq-count">{done ? labels.result : labels.step(step + 1, n)}</span>
      </div>}
      <div className="mq-split">
        <ol className="mq-rail">
          {questions.map((x, i) => (
            <li key={x.id} data-state={i < step ? "done" : i === step ? "now" : "todo"}>
              <span className="mq-dot">{i < step ? check : null}</span>{x.title}
            </li>
          ))}
          <li data-state={done ? "now" : "todo"}><span className="mq-dot" />{labels.result}</li>
        </ol>
        <div className="mq-main">
          <div className="mq-progress" role="progressbar" aria-valuemin={0} aria-valuemax={n} aria-valuenow={Math.min(step, n)}><i style={{ width: `${(Math.min(step, n) / n) * 100}%` }} /></div>
          {!done ? (
            <>
              <h3 className="mq-q" id={`${uid}-${q.id}`}>{q.title}</h3>
              {q.help && <p className="mq-help">{q.help}</p>}
              <fieldset className="mq-opts" aria-labelledby={`${uid}-${q.id}`}>
                {q.options.map((o) => (
                  <label key={o.id} className="mq-opt">
                    <input type="radio" name={`${uid}-${q.id}`} value={o.id} checked={answers[q.id] === o.id} onChange={() => setAnswers({ ...answers, [q.id]: o.id })} onKeyDown={(e) => { if (e.key === "Enter" && answers[q.id]) next(); }} />
                    <span><b>{o.label}</b>{o.hint && <small>{o.hint}</small>}</span>
                  </label>
                ))}
              </fieldset>
              <div className="mq-nav">
                <button type="button" className="mq-btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}><em>{labels.back}</em></button>
                <button type="button" className="mq-btn primary" disabled={!answers[q.id]} onClick={next}><em>{labels.next}</em><span>{arrow}</span></button>
              </div>
            </>
          ) : top ? (
            <>
              <div className="mq-res" role="status">
                <span className="mq-label">{labels.result}</span>
                <h3>{top.name}</h3>
                <p>{top.why}</p>
                <p><b>{labels.firstStep}</b> {top.firstStep}</p>
                {note && <p className="mq-note">{note}</p>}
              </div>
              <div className="mq-bars" aria-label={labels.match}>
                {ranked.map((m) => (
                  <div key={m.id} className="mq-row" data-top={m.id === top.id}>
                    <span>{m.short}</span>
                    <i><b style={{ width: `${(score[m.id] / max) * 100}%` }} /></i>
                    <span>{labels.points(score[m.id])}</span>
                  </div>
                ))}
              </div>
              <div className="mq-nav">
                <button type="button" className="mq-btn ghost" onClick={() => { setAnswers({}); setStep(0); }}><em>{labels.restart}</em></button>
                <button type="button" className="mq-btn primary" onClick={() => onCta?.(top.id)}><em>{labels.cta}</em><span>{arrow}</span></button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Demo content (placeholder until the site's own questions arrive). ACME is made up; weights are demo values.
 */
export const methodQuizDemo: Pick<MethodQuizProps, "questions" | "methods"> = {
  questions: [
    { id: "goal", title: "Юуг шийдэх вэ?", help: "Хамгийн ойрыг нь сонго.", options: [
      { id: "model", label: "Бизнесийн загвараа ойлгомжтой болгох", hint: "Хэнд, юу, яаж үнэ цэн өгөхөө", weights: { bmc: 3, "lean-canvas": 1 } },
      { id: "deliver", label: "Том төслийг хугацаанд нь дуусгах", hint: "Хүрээ, хуваарь, эрсдэл", weights: { pmbok: 3 } },
      { id: "focus", label: "Багийг нэг зорилгод нэгтгэх", hint: "Улирлын үр дүн, хэмжүүр", weights: { okr: 3 } },
      { id: "test", label: "Шинэ санааг хурдан турших", hint: "Таамаглал, туршилт", weights: { "lean-canvas": 3, bmc: 1 } },
    ] },
    { id: "stage", title: "Байгууллага ямар шатанд байна?", options: [
      { id: "idea", label: "Санаа, эхний харилцагч", weights: { "lean-canvas": 2 } },
      { id: "grow", label: "Өсөж байгаа, баг нэмэгдэж байна", weights: { okr: 2, bmc: 1 } },
      { id: "steady", label: "Тогтвортой, олон төсөлтэй", weights: { pmbok: 2, bmc: 1 } },
    ] },
    { id: "team", title: "Хэдэн хүн оролцох вэ?", options: [
      { id: "s", label: "1–5", weights: { "lean-canvas": 1, bmc: 1 } },
      { id: "m", label: "6–30", weights: { okr: 2 } },
      { id: "l", label: "30-аас дээш", weights: { pmbok: 2, okr: 1 } },
    ] },
    { id: "horizon", title: "Үр дүнг хэзээ харах вэ?", options: [
      { id: "weeks", label: "Хэдэн долоо хоногт", weights: { "lean-canvas": 2 } },
      { id: "quarter", label: "Улиралд", weights: { okr: 2 } },
      { id: "year", label: "Жил ба түүнээс урт", weights: { pmbok: 2, bmc: 1 } },
    ] },
  ],
  methods: [
    { id: "bmc", name: "Business Model Canvas", short: "BMC", why: "Үнэ цэн, харилцагч, орлогын урсгалаа нэг хуудсанд харуулна.", firstStep: "Есөн блокийг багтайгаа нэг цагт бөглөнө." },
    { id: "pmbok", name: "PMBOK", short: "PMBOK", why: "Хүрээ, хуваарь, эрсдэлийг тодорхой хариуцлагатай удирдана.", firstStep: "Төслийн дүрэм ба хүрээний баримтыг гаргана." },
    { id: "okr", name: "OKR", short: "OKR", why: "Нэг улирлын зорилгод багийг нэгтгэж, хэмжүүрээр явцаа харна.", firstStep: "Улирлын 1–3 зорилго, тус бүрт 3 хэмжүүр тавина." },
    { id: "lean-canvas", name: "Lean Canvas", short: "Lean", why: "Таамаглалаа жижиг туршилтаар хурдан шалгана.", firstStep: "Хамгийн эрсдэлтэй таамаглалыг нэрлээд туршилт товлоно." },
  ],
};
