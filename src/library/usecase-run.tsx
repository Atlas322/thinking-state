"use client";

import * as React from "react";

/**
 * Use Case Run — one business use case shown as the full INAI cycle in a
 * single card: the input that started it, what the agent found in Agent
 * Memory (each finding with its source chip), the method it followed, the
 * steps it took, the human approval and the artifact that goes back to the
 * vault. Until a person approves, the artifact stays a draft; «Approve» turns
 * it into a saved artifact, «Revise» sends a note back to the agent.
 * Original Thinking State component. Colours follow tokens/tokens.json.
 * Data comes in as plain JSON props; scenarios live in the inai-sh `acme/`
 * data. Motion: stages arrive one after another; off under reduced motion.
 */

export type UseCaseSource = {
  id: string;
  /** Short label for the chip, e.g. the note title. */
  label: string;
  /** Where it lives: vault path, table or system. */
  where?: string;
  /** The line the agent relied on. */
  quote?: string;
};

export type UseCaseStep = {
  id: string;
  label: string;
  /** Source ids this step used. */
  uses?: string[];
  state?: "done" | "active" | "next";
};

export type UseCaseRunData = {
  /** Use case name. */
  title: string;
  /** Customer segment, e.g. «Сургалтын төв». */
  segment?: string;
  /** Fictional ac.me company the example runs on. */
  company?: string;
  /** The agent that does the work. */
  agent?: string;
  /** What started the run: a message, a form, a ticket. */
  input: { channel?: string; text: string };
  /** Method the agent follows (BMC, PMBOK, Lean Canvas…). */
  method?: string;
  sources: UseCaseSource[];
  steps: UseCaseStep[];
  approval: { question: string; who?: string };
  artifact: { kind: string; title: string; path?: string; lines?: string[] };
};

export type UseCaseRunLabels = {
  input: string;
  memory: string;
  method: string;
  steps: string;
  approval: string;
  artifact: string;
  approve: string;
  revise: string;
  approved: string;
  draft: string;
  saved: string;
  revising: string;
  undo: string;
};

export type UseCaseRunProps = Partial<UseCaseRunData> & {
  /** Controlled approval state. */
  status?: "pending" | "approved" | "revise";
  onDecide?: (status: "pending" | "approved" | "revise") => void;
  labels?: Partial<UseCaseRunLabels>;
  className?: string;
};

const defaultLabels: UseCaseRunLabels = {
  input: "Оролт",
  memory: "Санах ойгоос олсон",
  method: "Арга зүй",
  steps: "Thinking State",
  approval: "Хүн батлах",
  artifact: "Үр дүн",
  approve: "Батлах",
  revise: "Засуулах",
  approved: "Батлагдсан",
  draft: "Ноорог",
  saved: "Vault-д хадгалагдсан",
  revising: "Агент засаж байна",
  undo: "Буцаах",
};

export const useCaseRunDemo: UseCaseRunData = {
  title: "Элсэлтийн асуултад эх сурвалжтай хариу",
  segment: "Боловсрол · сургалтын төв",
  company: "ac.me Студи (зохиомол)",
  agent: "Элсэлтийн агент",
  input: {
    channel: "Вэбийн чат",
    text: "Сайн байна уу, 12-р сарын бүлэгт ажил хийнгээ суралцаж болох уу? Төлбөрөө хувааж төлж болох уу?",
  },
  method: "Сургалтын хөтөлбөрийн бодлого → хариултын загвар",
  sources: [
    { id: "s1", label: "Хөтөлбөр 2026-12", where: "02-Projects/Сургалт/Хөтөлбөр.md", quote: "Хичээл долоо хоногт 2 орой, 19:00-өөс." },
    { id: "s2", label: "Төлбөрийн бодлого", where: "03-Areas/Санхүү/Төлбөр.md", quote: "Хоёр хуваан төлөх боломжтой; эхний хэсэг бүртгэлээр." },
    { id: "s3", label: "Өмнөх 4 ижил асуулт", where: "Inbox · 11-р сар" },
  ],
  steps: [
    { id: "a", label: "Асуултыг хоёр сэдэвт хуваав: цагийн хуваарь, төлбөр", state: "done" },
    { id: "b", label: "Хуваарь, бодлогоос эх сурвалжтай хариу олов", uses: ["s1", "s2"], state: "done" },
    { id: "c", label: "Өмнөх хариултын өнгө аясаар ноорог бичив", uses: ["s3"], state: "done" },
    { id: "d", label: "Бүртгэлийн холбоосыг хавсаргахаар хүлээж байна", state: "active" },
  ],
  approval: { question: "Энэ хариуг илгээж, асуултыг FAQ-д нэмэх үү?", who: "Элсэлтийн менежер" },
  artifact: {
    kind: "Хариу + FAQ мөр",
    title: "Ажил хийнгээ суралцах ба хуваан төлөх",
    path: "04-Resources/FAQ/Элсэлт.md",
    lines: ["Хичээл долоо хоногт 2 орой, 19:00-өөс тул ажлын дараа сууж болно.", "Төлбөрийг хоёр хувааж, эхний хэсгийг бүртгэлийн үед төлнө."],
  },
};

export function UseCaseRun({
  status: statusProp,
  onDecide,
  labels: labelsProp,
  className = "",
  ...data
}: UseCaseRunProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const d: UseCaseRunData = { ...useCaseRunDemo, ...(data.title ? data : {}) } as UseCaseRunData;
  const uid = React.useId();
  const [own, setOwn] = React.useState<"pending" | "approved" | "revise">("pending");
  const status = statusProp ?? own;
  const [hot, setHot] = React.useState<string | null>(null);
  const decide = (s: "pending" | "approved" | "revise") => {
    setOwn(s);
    onDecide?.(s);
  };
  const srcById = (id: string) => d.sources.find((s) => s.id === id);

  return (
    <section className={`ur ${className}`} data-status={status} aria-labelledby={`${uid}-h`}>
      <style>{css}</style>
      <header className="ur-head">
        <div className="ur-meta">
          {d.segment && <span className="ur-seg">{d.segment}</span>}
          {d.company && <span>{d.company}</span>}
          {d.agent && <span>{d.agent}</span>}
        </div>
        <h3 id={`${uid}-h`} className="ur-title">{d.title}</h3>
      </header>

      <ol className="ur-flow">
        <li className="ur-stage" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="ur-k">{L.input}{d.input.channel ? ` · ${d.input.channel}` : ""}</span>
          <p className="ur-input">{d.input.text}</p>
        </li>

        <li className="ur-stage" style={{ "--i": 1 } as React.CSSProperties}>
          <span className="ur-k">{L.memory}</span>
          <ul className="ur-chips">
            {d.sources.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="ur-chip"
                  aria-pressed={hot === s.id}
                  data-hot={hot === s.id || undefined}
                  onClick={() => setHot(hot === s.id ? null : s.id)}
                >
                  <span className="ur-n">{i + 1}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
          {hot && srcById(hot) && (
            <div className="ur-quote" role="note">
              {srcById(hot)!.quote && <p>«{srcById(hot)!.quote}»</p>}
              {srcById(hot)!.where && <code>{srcById(hot)!.where}</code>}
            </div>
          )}
        </li>

        {d.method && (
          <li className="ur-stage" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="ur-k">{L.method}</span>
            <p className="ur-method">{d.method}</p>
          </li>
        )}

        <li className="ur-stage" style={{ "--i": 3 } as React.CSSProperties}>
          <span className="ur-k">{L.steps}</span>
          <ul className="ur-steps">
            {d.steps.map((st) => {
              const state = status === "approved" ? "done" : st.state ?? "done";
              return (
                <li key={st.id} className={`ur-step is-${state}`}>
                  <span className="ur-dot" aria-hidden="true" />
                  <span className="ur-step-l">{st.label}</span>
                  {st.uses?.map((u) => {
                    const n = d.sources.findIndex((s) => s.id === u) + 1;
                    return n ? (
                      <button key={u} type="button" className="ur-ref" aria-label={`${L.memory} ${n}`} onClick={() => setHot(u)}>
                        {n}
                      </button>
                    ) : null;
                  })}
                </li>
              );
            })}
          </ul>
        </li>

        <li className="ur-stage ur-gate" style={{ "--i": 4 } as React.CSSProperties}>
          <span className="ur-k">{L.approval}{d.approval.who ? ` · ${d.approval.who}` : ""}</span>
          {status === "pending" ? (
            <>
              <p className="ur-q">{d.approval.question}</p>
              <div className="ur-acts">
                <button type="button" className="ur-btn is-primary" onClick={() => decide("approved")}>{L.approve}</button>
                <button type="button" className="ur-btn" onClick={() => decide("revise")}>{L.revise}</button>
              </div>
            </>
          ) : (
            <p className="ur-done" role="status">
              {status === "approved" ? L.approved : L.revising}
              <button type="button" className="ur-undo" onClick={() => decide("pending")}>{L.undo}</button>
            </p>
          )}
        </li>

        <li className="ur-stage ur-art" style={{ "--i": 5 } as React.CSSProperties}>
          <span className="ur-k">
            {L.artifact} · {d.artifact.kind}
            <span className={`ur-badge${status === "approved" ? " is-saved" : ""}`}>{status === "approved" ? L.saved : L.draft}</span>
          </span>
          <p className="ur-art-t">{d.artifact.title}</p>
          {d.artifact.lines?.map((l, i) => <p key={i} className="ur-art-l">{l}</p>)}
          {d.artifact.path && <code className="ur-path">{d.artifact.path}</code>}
        </li>
      </ol>
    </section>
  );
}

const css = `
.ur{--ur-bg:var(--ts-surface,#fff);--ur-fg:var(--ts-fg,#18181b);--ur-muted:var(--ts-muted,#65656d);--ur-line:var(--ts-line,#ececef);--ur-soft:var(--ts-soft,#f4f4f5);--ur-accent:var(--ts-accent,#4f7cf0);--ur-accent-soft:var(--ts-accent-soft,#e8f1fe);--ur-green:var(--ts-green,#16a34a);--ur-green-soft:var(--ts-green-soft,#e9f8ee);--ur-amber:var(--ts-amber,#c2620a);--ur-amber-soft:var(--ts-amber-soft,#fff4e0);width:100%;max-width:560px;color:var(--ur-fg);background:var(--ur-bg);border:1px solid var(--ur-line);border-radius:12px;font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);box-sizing:border-box;overflow:hidden}
:where(.dark,[data-theme=dark]) .ur{--ur-bg:var(--ts-surface,#1b1b1e);--ur-fg:var(--ts-fg,#ececef);--ur-muted:var(--ts-muted,#a1a1aa);--ur-line:var(--ts-line,#2e2e33);--ur-soft:var(--ts-soft,#26262a);--ur-accent:var(--ts-accent,#7c9cff);--ur-accent-soft:var(--ts-accent-soft,#1b2a44);--ur-green:var(--ts-green,#4ade80);--ur-green-soft:var(--ts-green-soft,#16301f);--ur-amber:var(--ts-amber,#eba659);--ur-amber-soft:var(--ts-amber-soft,#3a2a12);color-scheme:dark}
.ur *{box-sizing:border-box}
:where(.ur) button{font:inherit;color:inherit;cursor:pointer}
.ur-head{padding:12px 14px;border-bottom:1px solid var(--ur-line)}
.ur-meta{display:flex;flex-wrap:wrap;gap:0 8px;font-size:12px;color:var(--ur-muted)}
.ur-meta>span+span::before{content:"·";margin-right:8px}
.ur-seg{color:var(--ur-accent);font-weight:500}
.ur-title{margin:3px 0 0;font:600 15px/1.3 var(--ts-font-display,inherit)}
.ur-flow{margin:0;padding:6px 14px 12px;list-style:none}
.ur-stage{position:relative;padding:9px 0 9px 18px;animation:ur-in .4s cubic-bezier(.05,.7,.1,1) both;animation-delay:calc(var(--i,0) * 110ms)}
.ur-stage::before{content:"";position:absolute;left:4px;top:15px;bottom:-9px;width:1px;background:var(--ur-line)}
.ur-stage:last-child::before{display:none}
.ur-stage::after{content:"";position:absolute;left:0;top:11px;width:9px;height:9px;border-radius:50%;background:var(--ur-bg);border:2px solid var(--ur-accent)}
.ur-k{display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:600;letter-spacing:.02em;color:var(--ur-muted);text-transform:uppercase}
.ur-input{margin:5px 0 0;padding:8px 10px;border-radius:10px 10px 10px 3px;background:var(--ur-soft)}
.ur-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 0;padding:0;list-style:none}
.ur-chip{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:3px 9px 3px 4px;border:1px solid var(--ur-line);border-radius:14px;background:var(--ur-bg);font-size:12.5px;font-weight:500;transition:background .15s,border-color .15s}
.ur-chip:hover,.ur-chip[data-hot]{border-color:color-mix(in srgb,var(--ur-accent) 45%,var(--ur-line));background:var(--ur-accent-soft)}
.ur-n,.ur-ref{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:var(--ur-accent-soft);color:var(--ur-accent);font-size:11px;font-weight:600;border:0}
.ur-ref{margin-left:4px;flex:none}
.ur-quote{margin-top:6px;padding:7px 10px;border-left:2px solid var(--ur-accent);background:var(--ur-soft);border-radius:0 8px 8px 0;font-size:13px;animation:ur-in .25s ease both}
.ur-quote p{margin:0 0 3px}
.ur-quote code,.ur-path{font:500 11.5px/1.4 ui-monospace,monospace;color:var(--ur-muted);overflow-wrap:anywhere}
.ur-method{margin:4px 0 0;font-size:13px}
.ur-steps{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:5px}
.ur-step{display:flex;align-items:flex-start;gap:8px;font-size:13px}
.ur-step-l{flex:1;min-width:0}
.ur-dot{flex:none;width:8px;height:8px;margin-top:6px;border-radius:50%;background:var(--ur-green)}
.ur-step.is-active .ur-dot{background:var(--ur-amber);animation:ur-pulse 1.4s ease-in-out infinite}
.ur-step.is-next{color:var(--ur-muted)}.ur-step.is-next .ur-dot{background:var(--ur-line)}
.ur-gate::after{border-color:var(--ur-amber)}
.ur[data-status=approved] .ur-gate::after,.ur[data-status=approved] .ur-art::after{border-color:var(--ur-green);background:var(--ur-green)}
.ur-q{margin:5px 0 0;font-weight:500}
.ur-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.ur-btn{min-height:32px;padding:5px 12px;border:1px solid var(--ur-line);border-radius:8px;background:var(--ur-bg);font-size:13px;font-weight:500;transition:background .15s,transform .12s}
.ur-btn:hover{background:var(--ur-soft)}.ur-btn:active{transform:scale(.97)}
.ur-btn.is-primary{border-color:var(--ur-accent);background:var(--ur-accent);color:#fff}
:where(.dark,[data-theme=dark]) .ur-btn.is-primary{color:#111}
.ur-done{display:flex;align-items:center;gap:8px;margin:5px 0 0;font-weight:500;color:color-mix(in srgb,var(--ur-green) 70%,var(--ur-fg))}
.ur[data-status=revise] .ur-done{color:color-mix(in srgb,var(--ur-amber) 80%,var(--ur-fg))}
.ur-undo{height:24px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--ur-muted);font-size:12.5px;font-weight:400}
.ur-undo:hover{background:var(--ur-soft)}
.ur-badge{margin-left:auto;padding:1px 8px;border-radius:10px;background:var(--ur-amber-soft);color:color-mix(in srgb,var(--ur-amber) 82%,var(--ur-fg));font-size:11px;letter-spacing:0;text-transform:none}
.ur-badge.is-saved{background:var(--ur-green-soft);color:color-mix(in srgb,var(--ur-green) 70%,var(--ur-fg))}
.ur-art-t{margin:5px 0 2px;font-weight:600}
.ur-art-l{margin:0 0 2px;font-size:13px;color:var(--ur-muted)}
.ur-path{display:block;margin-top:4px}
.ur :focus-visible{outline:2px solid var(--ur-accent);outline-offset:1px}
@keyframes ur-in{from{opacity:0;transform:translateY(6px)}}
@keyframes ur-pulse{50%{opacity:.35}}
@media(prefers-reduced-motion:reduce){.ur,.ur *{animation:none!important;transition:none!important}}
`;

export default UseCaseRun;
