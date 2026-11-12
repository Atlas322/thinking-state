"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type PlanStepStatus = "pending" | "active" | "done" | "failed";

export type PlanStep = {
  id: string;
  title: string;
  detail?: string;
  tool?: string;
  status?: PlanStepStatus;
  /** Seconds, e.g. 1.3 */
  duration?: number;
  error?: string;
};

export type AgentPlanProps = {
  title?: string;
  steps?: PlanStep[];
  defaultSteps?: PlanStep[];
  /** "draft" lets people edit; omitted, the demo shows a run that stopped on a failed step. */
  status?: "draft" | "running" | "done";
  estimate?: string;
  /** Milliseconds each simulated step takes while running. */
  stepMs?: number;
  onChange?: (steps: PlanStep[]) => void;
  onRun?: (steps: PlanStep[]) => void;
  onCancel?: () => void;
  onRetry?: (stepId: string) => void;
  onAction?: (action: "run" | "cancel" | "retry" | "add" | "remove", value?: string) => void;
  className?: string;
};

const demoSteps: PlanStep[] = [
  { id: "pull", title: "3-р улирлын орлого, жилийн давтагдах орлогыг татах", detail: "Сарын орлого, давтагдах орлого, цэвэр хадгалалт", tool: "payments.query", status: "done", duration: 1.3 },
  { id: "launches", title: "Бүтээгдэхүүний нээлтүүдийг товчлох", detail: "Гарсан төслүүд ба хэрэглээ", tool: "issues.search", status: "done", duration: 1.1 },
  { id: "memo", title: "ТУЗ-ийн танилцуулга ноороглох", detail: "Нэг хуудас: амжилт, эрсдэл, хүсэлт", tool: "docs.write", status: "done", duration: 1.3 },
  { id: "slides", title: "Гол үзүүлэлтийн слайд бэлтгэх", detail: "ТУЗ-ийн загварт зургаан график", tool: "slides.create", status: "failed", error: "Слайдын API 30 секундэд хариу өгсөнгүй" },
  { id: "send", title: "Ноорогийг Сараад хянуулахаар илгээх", tool: "mail.draft", status: "pending" },
];

type Phase = "draft" | "running" | "done" | "stopped";

export function AgentPlan({
  title = "ТУЗ-д 3-р улирлын тайлан бэлтгэх",
  steps: stepsProp,
  defaultSteps = demoSteps,
  status,
  estimate = "~2 мин",
  stepMs = 1500,
  onChange,
  onRun,
  onCancel,
  onRetry,
  onAction,
  className = "",
}: AgentPlanProps) {
  const initialPhase: Phase = status ?? (defaultSteps.some((s) => s.status === "failed") ? "stopped" : "draft");
  const [phase, setPhase] = React.useState<Phase>(initialPhase);
  const [inner, setInner] = React.useState<PlanStep[]>(() =>
    initialPhase === "draft" ? defaultSteps.map((s) => ({ ...s, status: "pending", error: undefined, duration: undefined })) : defaultSteps,
  );
  const steps = stepsProp ?? inner;
  const [draft, setDraft] = React.useState("");
  const [elapsed, setElapsed] = React.useState(0);
  const [note, setNote] = React.useState("");
  const dragId = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (status) setPhase(status);
  }, [status]);

  const update = (next: PlanStep[]) => {
    if (!stepsProp) setInner(next);
    onChange?.(next);
  };

  // simulated run: one active step at a time
  const activeIndex = steps.findIndex((s) => s.status === "active");
  React.useEffect(() => {
    if (phase !== "running") return;
    const idx = activeIndex >= 0 ? activeIndex : steps.findIndex((s) => s.status !== "done");
    if (idx < 0) {
      setPhase("done");
      setNote(`Plan complete in ${Math.round(elapsed)}s`);
      return;
    }
    if (activeIndex < 0) {
      update(steps.map((s, i) => (i === idx ? { ...s, status: "active" } : s)));
      return;
    }
    const id = window.setTimeout(() => {
      const secs = Math.round((stepMs / 1000) * 10) / 10;
      update(steps.map((s, i) => (i === idx ? { ...s, status: "done", duration: secs } : s)));
      setElapsed((e) => e + secs);
      setNote(`Done: ${steps[idx].title}`);
    }, stepMs);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, steps, stepMs]);

  const editing = phase === "draft";
  const doneCount = steps.filter((s) => s.status === "done").length;
  const failed = steps.findIndex((s) => s.status === "failed");

  const move = (from: number, to: number) => {
    if (to < 0 || to >= steps.length || from === to) return;
    const next = [...steps];
    const [s] = next.splice(from, 1);
    next.splice(to, 0, s);
    update(next);
    setNote(`Moved "${s.title}" to position ${to + 1} of ${steps.length}`);
  };
  const remove = (i: number) => {
    const s = steps[i];
    update(steps.filter((_, j) => j !== i));
    setNote(`Removed "${s.title}"`);
    onAction?.("remove", s.id);
  };
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    update([...steps, { id: `step-${Date.now()}`, title: t, status: "pending" }]);
    setDraft("");
    setNote(`Added "${t}"`);
    onAction?.("add", t);
  };
  const run = () => {
    const fresh = steps.map((s) => ({ ...s, status: "pending" as const, error: undefined, duration: undefined }));
    update(fresh);
    setElapsed(0);
    setPhase("running");
    onRun?.(fresh);
    onAction?.("run");
  };
  const retry = (i: number) => {
    update(steps.map((s, j) => (j >= i ? { ...s, status: "pending", error: undefined, duration: undefined } : s)));
    setPhase("running");
    onRetry?.(steps[i].id);
    onAction?.("retry", steps[i].id);
  };

  return (
    <section className={`apl ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="apl-head">
        <div className="apl-meta">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2.5 4h1M2.5 8h1M2.5 12h1M6 4h7.5M6 8h7.5M6 12h7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Plan · {steps.length} step{steps.length === 1 ? "" : "s"}
          {editing && estimate && <span> · {estimate}</span>}
        </div>
        <h3 className="apl-title">{title}</h3>
      </header>

      <ol className="apl-list" aria-label={title}>
        {steps.map((s, i) => {
          const st = editing ? "pending" : s.status ?? "pending";
          const lineDone = st === "done" && steps[i + 1]?.status !== undefined;
          return (
            <li
              key={s.id}
              className={`apl-step is-${st}`}
              aria-current={st === "active" ? "step" : undefined}
              draggable={editing}
              onDragStart={() => (dragId.current = s.id)}
              onDragOver={(e) => {
                if (!editing || !dragId.current) return;
                e.preventDefault();
                const from = steps.findIndex((x) => x.id === dragId.current);
                if (from !== i) move(from, i);
              }}
              onDragEnd={() => (dragId.current = null)}
            >
              <span className="apl-rail" aria-hidden="true">
                <span className="apl-dot">
                  {st === "done" ? (
                    <svg viewBox="0 0 16 16"><path className="apl-check" d="m4.5 8.3 2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : st === "failed" ? (
                    "!"
                  ) : st === "active" ? (
                    <svg className="apl-spin" viewBox="0 0 16 16">
                      {Array.from({ length: 8 }, (_, k) => (
                        <rect key={k} x="7.3" y="1.5" width="1.4" height="3.5" rx=".7" fill="currentColor" opacity={0.25 + k * 0.1} transform={`rotate(${k * 45} 8 8)`} />
                      ))}
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                {i < steps.length - 1 && <span className={`apl-line${lineDone ? " is-done" : ""}`} />}
              </span>
              <div className="apl-main">
                <div className="apl-row">
                  {editing ? (
                    <input
                      className="apl-name"
                      aria-label={`Step ${i + 1}`}
                      value={s.title}
                      onChange={(e) => update(steps.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                      onKeyDown={(e) => {
                        if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); move(i, i - 1); }
                        if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); move(i, i + 1); }
                      }}
                    />
                  ) : (
                    <span className="apl-name">{s.title}</span>
                  )}
                  <span className="apl-sr">, {st === "done" ? "Done" : st === "failed" ? "Failed" : st === "active" ? "Running" : "Pending"}</span>
                  {!editing && s.duration !== undefined && st === "done" && <span className="apl-time"><span className="apl-sr">took </span>{s.duration}s</span>}
                  {editing && (
                    <button type="button" className="apl-x" aria-label={`Remove ${s.title}`} onClick={() => remove(i)}>
                      <svg viewBox="0 0 16 16"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                    </button>
                  )}
                </div>
                {(s.detail || s.tool) && (
                  <div className="apl-detail">
                    {s.detail && <span>{s.detail}</span>}
                    {s.tool && <code>{s.tool}</code>}
                  </div>
                )}
                {!editing && st === "failed" && (
                  <>
                    {s.error && <div className="apl-err">{s.error}</div>}
                    <button type="button" className="apl-retry" onClick={() => retry(i)}>
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                      Retry from here
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {editing && (
        <div className="apl-add">
          <span className="apl-plus" aria-hidden="true">+</span>
          <input
            aria-label="New step"
            placeholder="Add step"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          {draft && <button type="button" className="apl-btn" onClick={add}>Add</button>}
        </div>
      )}

      <footer className={`apl-foot is-${phase}`}>
        {phase === "draft" && (
          <>
            <span className="apl-hint">Drag to reorder</span>
            {onCancel && (
              <button type="button" className="apl-btn" onClick={() => { onCancel(); onAction?.("cancel"); }}>Cancel</button>
            )}
            <button type="button" className="apl-btn is-dark" onClick={run}>Run plan</button>
          </>
        )}
        {phase === "running" && (
          <span className="apl-shimmer">Running · {Math.min(doneCount + 1, steps.length)} of {steps.length}</span>
        )}
        {phase === "done" && (
          <>
            <span className="apl-ok">✓ Plan complete</span>
            <button type="button" className="apl-btn" onClick={run}>Run again</button>
          </>
        )}
        {phase === "stopped" && (
          <span className="apl-stop">
            <span className="apl-dot is-mini">!</span>
            Stopped · step {failed + 1} failed
          </span>
        )}
      </footer>
      <div className="apl-sr" aria-live="polite">
        {phase === "stopped" && failed >= 0 ? `Step ${failed + 1} failed: ${steps[failed].title}. ${steps[failed].error ?? ""}` : note}
      </div>
    </section>
  );
}

const css = `
.apl{--apl-bg:#fff;--apl-fg:#18181b;--apl-muted:#71717a;--apl-faint:#a1a1aa;--apl-line:#ececef;--apl-chip:#f1f1f3;--apl-blue:#3b82f6;--apl-red:#e5484d;--apl-red-soft:#fdecec;width:100%;max-width:440px;background:var(--apl-bg);color:var(--apl-fg);border:1px solid var(--apl-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .apl{--apl-bg:#1b1b1e;--apl-fg:#ececef;--apl-muted:#a1a1aa;--apl-faint:#71717a;--apl-line:#2e2e33;--apl-chip:#2a2a2f;--apl-blue:#5b9cff;--apl-red:#ff6b6f;--apl-red-soft:#3a1d1f;color-scheme:dark}
.apl *{box-sizing:border-box}.apl button,.apl input{font:inherit;color:inherit}.apl button{cursor:pointer}
.apl-head{padding:16px 16px 6px}
.apl-meta{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--apl-muted)}.apl-meta svg{width:14px;height:14px}
.apl-title{margin:4px 0 0;font-size:15px;font-weight:500;letter-spacing:-.005em}
.apl-list{list-style:none;margin:0;padding:8px 16px 4px}
.apl-step{position:relative;display:flex;gap:10px;animation:apl-in .25s both}
.apl-step[draggable=true]{cursor:grab}
.apl-rail{position:relative;display:flex;flex-direction:column;align-items:center;flex:none;width:20px;padding-top:2px}
.apl-dot{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;border:1px solid var(--apl-line);font-size:11px;color:var(--apl-muted);background:var(--apl-bg);flex:none;transition:background .2s,border-color .2s}
.apl-dot svg{width:14px;height:14px}
.is-done>.apl-rail .apl-dot{background:var(--apl-blue);border-color:var(--apl-blue);color:#fff}
.is-failed>.apl-rail .apl-dot,.apl-dot.is-mini{background:var(--apl-red-soft);border-color:transparent;color:var(--apl-red);font-weight:600}
.is-active>.apl-rail .apl-dot{border-color:transparent;color:var(--apl-blue)}
.apl-check{stroke-dasharray:12;animation:apl-draw .3s ease-out both}
.apl-spin{animation:apl-rot 1s steps(8) infinite}
.apl-line{flex:1;width:1.5px;margin:2px 0;background:var(--apl-line);min-height:12px}
.apl-line.is-done{background:var(--apl-blue)}
.apl-main{flex:1;min-width:0;padding-bottom:14px}
.apl-row{display:flex;align-items:center;gap:8px;min-height:22px}
.apl-name{flex:1;min-width:0;font-size:14px;font-weight:400;color:var(--apl-fg)}
input.apl-name{border:0;padding:0;margin:0;background:none;outline:none;border-radius:4px}
input.apl-name:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb,var(--apl-blue) 35%,transparent)}
.is-pending .apl-name{color:color-mix(in srgb,var(--apl-fg) 85%,transparent)}
.apl-time{font-size:12px;color:var(--apl-muted);font-variant-numeric:tabular-nums}
.apl-x{display:grid;place-items:center;width:22px;height:22px;padding:0;border:0;border-radius:5px;background:none;color:var(--apl-faint);opacity:0;transition:opacity .15s}
.apl-step:hover .apl-x,.apl-x:focus-visible{opacity:1}.apl-x:hover{background:var(--apl-chip);color:var(--apl-fg)}.apl-x svg{width:13px;height:13px}
@media(hover:none){.apl-x{opacity:1}}
.apl-detail{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:2px;font-size:12px;color:var(--apl-muted)}
.apl-detail code{padding:1px 5px;border-radius:4px;background:var(--apl-chip);font:400 11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:color-mix(in srgb,var(--apl-fg) 75%,transparent);white-space:nowrap}
.apl-err{margin-top:8px;font-size:12px;color:var(--apl-red)}
.apl-retry{display:inline-flex;align-items:center;gap:6px;margin-top:10px;height:30px;padding:0 10px;border:1px solid var(--apl-line);border-radius:7px;background:var(--apl-bg);font-size:13px}
.apl-retry:hover{background:var(--apl-chip)}.apl-retry svg{width:13px;height:13px;color:var(--apl-muted)}
.apl-add{display:flex;align-items:center;gap:10px;margin:0 16px 10px;padding:6px 0}
.apl-plus{display:grid;place-items:center;width:20px;height:20px;border:1px dashed var(--apl-faint);border-radius:50%;color:var(--apl-muted);font-size:13px;line-height:1}
.apl-add input{flex:1;min-width:0;border:0;background:none;outline:none;font-size:14px}.apl-add input::placeholder{color:var(--apl-faint)}
.apl-foot{display:flex;align-items:center;gap:8px;min-height:48px;padding:8px 16px;border-top:1px solid var(--apl-line);font-size:13px}
.apl-hint{flex:1;color:var(--apl-faint);font-size:12px}
.apl-btn{height:30px;padding:0 12px;border:1px solid var(--apl-line);border-radius:7px;background:var(--apl-bg);font-size:13px}
.apl-btn.is-dark{background:var(--apl-fg);border-color:var(--apl-fg);color:var(--apl-bg)}
.is-done .apl-ok,.apl-foot.is-done .apl-ok{flex:1;color:var(--apl-muted)}
.apl-stop{display:flex;align-items:center;gap:8px;color:var(--apl-red)}.apl-dot.is-mini{width:16px;height:16px;font-size:10px}
.apl-shimmer{color:var(--apl-muted);background:linear-gradient(90deg,var(--apl-muted) 30%,var(--apl-fg) 50%,var(--apl-muted) 70%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:apl-sh 1.6s linear infinite}
.apl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.apl :focus-visible{outline:2px solid var(--apl-blue);outline-offset:2px}
@keyframes apl-in{from{opacity:0;transform:translateY(4px)}}
@keyframes apl-draw{from{stroke-dashoffset:12}to{stroke-dashoffset:0}}
@keyframes apl-rot{to{transform:rotate(360deg)}}
@keyframes apl-sh{from{background-position:100% 0}to{background-position:-100% 0}}
@media(max-width:400px){.apl-hint{display:none}}
@media(max-width:340px){.apl-head,.apl-list{padding-left:12px;padding-right:12px}.apl-foot{padding:8px 12px}}
@media(prefers-reduced-motion:reduce){.apl *{animation:none!important;transition:none!important}}
`;

export default AgentPlan;
