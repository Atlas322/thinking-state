"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type GateDecision = "approved" | "edited" | "rejected";
export type DiffLine = { type: "add" | "remove" | "same"; text: string };
export type ApprovalGate = {
  id: string;
  agent: string;
  avatar?: React.ReactNode;
  kind: "tool" | "file" | "agent" | "message";
  action: string;
  reason: string;
  status: "open" | GateDecision;
  at?: string;
  input?: string;
  diff?: { file: string; lines: DiffLine[] }[];
  files?: string[];
  context?: string[];
  holds?: string[];
  note?: string;
  /** Who the agent is, e.g. "Sub-agent". */
  role?: string;
  blocking?: boolean;
};
export type ApprovalGatesProps = {
  gates?: ApprovalGate[];
  task?: string;
  live?: boolean;
  onDecide?: (id: string, decision: GateDecision, value?: string) => void;
  title?: string;
  className?: string;
};

const defaultGates: ApprovalGate[] = [
  {
    id: "migrate",
    agent: "Кодын агент",
    kind: "tool",
    action: "Өгөгдлийн сангийн шилжилт ажиллуулах",
    reason: "Багцын шинэ баганууд нэмнэ",
    status: "approved",
    at: "6 мин өмнө",
    input: "pnpm db:migrate --name add_plan_tiers",
  },
  {
    id: "prices",
    agent: "Кодын агент",
    kind: "file",
    action: "plans.ts дахь суудлын хязгаарыг өөрчлөх",
    reason: "Даваа гарагаас харилцагчийн багцын хязгаар өөрчлөгдөнө",
    status: "approved",
    at: "саяхан",
    diff: [
      {
        file: "src/plans/plans.ts",
        lines: [
          { type: "same", text: "export const plans = {" },
          { type: "remove", text: "  pro: { seats: 8, projects: 20 }," },
          { type: "add", text: "  pro: { seats: 10, projects: 20 }," },
          { type: "same", text: "};" },
        ],
      },
    ],
  },
  {
    id: "email",
    agent: "Өсөлтийн агент",
    kind: "message",
    action: "Туршилтын 1,284 хэрэглэгчид имэйл илгээх",
    reason: "Багаас гадуурх харилцагчид илгээнэ",
    status: "edited",
    at: "саяхан",
    note: "Гарчиг: Шинэ багц – таны нөхцөл хэвээр",
    input:
      "Гарчиг: Шинэ багц, таны нөхцөл хэвээр\n\nСайн байна уу, {first_name}. Даваа гарагаас багцуудаа шинэчилнэ. Туршилтын хэрэглэгчийн хувьд та өнөөдрийн нөхцөлөө нэг жил хадгална.",
  },
  {
    id: "browser",
    agent: "Судлаач агент",
    role: "Туслах агент",
    kind: "agent",
    action: "Хөтчийн агент эхлүүлэх",
    reason: "Өрсөлдөгчдийн туршилтад өөрөө бүртгүүлнэ",
    status: "open",
    at: "саяхан",
    blocking: true,
    input:
      "Гурван өрсөлдөгчийн үнэгүй туршилтад шинэ имэйлээр бүртгүүлж, төлбөрийн алхам бүр юу асуудгийг тэмдэглэ.",
    context: ["Өрсөлдөгчдийн үнийн бодлогыг хайсан", "3 үнийн хуудас уншсан"],
    holds: ["Төлбөрийн алхмуудыг харьцуулах"],
  },
];

const inputLabel = { tool: "Arguments", file: "Changes", agent: "Prompt", message: "Message" } as const;
const statusLabel = { approved: "Approved", edited: "Approved with changes", rejected: "Stopped the run" } as const;

const Chevron = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Lock = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
);

function GateBody({ gate }: { gate: ApprovalGate }) {
  if (gate.diff)
    return (
      <>
        <div className="gate-label">{inputLabel.file}</div>
        {gate.diff.map((d) => (
          <div key={d.file} className="gate-diff">
            <div className="gate-file">{d.file}</div>
            {d.lines.map((l, i) => (
              <div key={i} className={`gate-dl gate-${l.type}`}>
                <span aria-hidden="true">{l.type === "add" ? "+" : l.type === "remove" ? "−" : " "}</span>
                {l.type !== "same" && <span className="gate-sr">{l.type === "add" ? "Added:" : "Removed:"}</span>}
                <code>{l.text}</code>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  if (!gate.input) return null;
  return (
    <>
      <div className="gate-label">{inputLabel[gate.kind]}</div>
      <div className="gate-input" tabIndex={0}>{gate.input}</div>
    </>
  );
}

export function ApprovalGates({
  gates: gatesProp = defaultGates,
  task = gatesProp === defaultGates ? "Шинэ үнийн хуудсыг нээх" : undefined,
  live = false,
  onDecide,
  title = "Approvals",
  className = "",
}: ApprovalGatesProps) {
  const [local, setLocal] = React.useState<Record<string, { status: GateDecision; note?: string; order: number }>>({});
  const gates = gatesProp.map((g) => (local[g.id] ? { ...g, status: local[g.id].status, note: local[g.id].note ?? g.note, at: "саяхан" } : g));
  const open = gates.filter((g) => g.status === "open");
  const decided = gates
    .filter((g) => g.status !== "open")
    .sort((a, b) => (local[b.id]?.order ?? -1) - (local[a.id]?.order ?? -1) || gates.indexOf(b) - gates.indexOf(a));
  const [top, setTop] = React.useState(0);
  const idx = Math.min(top, Math.max(0, open.length - 1));
  const gate = open[idx];
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [ctxOpen, setCtxOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [leaving, setLeaving] = React.useState<GateDecision | null>(null);
  const [said, setSaid] = React.useState("");
  const approveRef = React.useRef<HTMLButtonElement>(null);
  const editRef = React.useRef<HTMLButtonElement>(null);
  const orderRef = React.useRef(0);

  const decide = (decision: GateDecision, value?: string) => {
    if (!gate || leaving) return;
    const g = gate;
    setLeaving(decision);
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      setLocal((s) => ({ ...s, [g.id]: { status: decision, note: decision === "edited" ? value : undefined, order: ++orderRef.current } }));
      setLeaving(null);
      setEditing(false);
      setCtxOpen(false);
      const left = open.length - 1;
      setSaid(`${statusLabel[decision]}: ${g.action}. ${left} request${left === 1 ? "" : "s"} left.`);
      onDecide?.(g.id, decision, value);
      window.setTimeout(() => approveRef.current?.focus(), 30);
    }, reduce ? 0 : decision === "rejected" ? 520 : 320);
  };

  const holds = gate?.holds ?? [];
  const decidedCount = gates.length - open.length;
  const runText = open.length
    ? `Paused – ${open.reduce((n, g) => n + (g.holds?.length ?? 0), 0) || 1} step waits on ${open.length} gate${open.length === 1 ? "" : "s"}`
    : live
      ? "Running"
      : "Done";

  return (
    <section className={`gate ${className}`}>
      <style>{css}</style>
      <div className="gate-block">
        <header className="gate-head">
          <svg viewBox="0 0 16 16" aria-hidden="true" className="gate-head-ico">
            <path d="M2 6.5 3.5 3h9L14 6.5V12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12Z" fill="currentColor" opacity=".55" />
            <path d="M2 6.5h12" stroke="var(--gate-bg)" strokeWidth="1" />
          </svg>
          <strong>{title}</strong>
          {task && <span className="gate-task">{task}</span>}
          <span className={`gate-pill ${open.length ? "gate-wait" : "gate-ok"}`}>
            <i />
            {open.length ? "Waiting on you" : live ? "Running" : "All decided"}
          </span>
        </header>
        <dl className="gate-stats">
          <div><dt>Waiting on you</dt><dd>{open.length}</dd></div>
          <div><dt>Decided</dt><dd>{decidedCount}/{gates.length}</dd></div>
          <div><dt>Run</dt><dd>{runText}</dd></div>
        </dl>
      </div>

      {gate ? (
        <div
          className="gate-stack"
          role="group"
          aria-label={`${open.length} request${open.length === 1 ? "" : "s"} waiting, on top: ${gate.action}`}
          data-depth={Math.min(open.length, 3)}
          onKeyDown={(e) => {
            if (editing || (e.target as HTMLElement).tagName === "TEXTAREA") return;
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              setTop((t) => (Math.min(t, open.length - 1) + (e.key === "ArrowRight" ? 1 : -1) + open.length) % open.length);
              window.setTimeout(() => approveRef.current?.focus(), 0);
            }
          }}
        >
          <article key={gate.id} className="gate-card" data-leaving={leaving ?? undefined}>
            <div className="gate-who">
              <span className="gate-av" aria-hidden="true">
                {gate.avatar ?? (
                  <svg viewBox="0 0 16 16"><path d="M8 1.5 9.3 6.7 14.5 8 9.3 9.3 8 14.5 6.7 9.3 1.5 8 6.7 6.7Z" fill="currentColor" /></svg>
                )}
              </span>
              <span>
                <b>{gate.agent}</b>
                {gate.role && ` · ${gate.role}`}
                {gate.at && ` · ${gate.at}`}
              </span>
              {(gate.blocking ?? !!gate.holds?.length) && (
                <span className="gate-pill gate-wait gate-block-pill"><Lock />Blocking</span>
              )}
            </div>
            <h3 className="gate-action">{gate.action}</h3>
            <p className="gate-reason">{gate.reason}</p>
            {editing ? (
              <>
                <div className="gate-label">{inputLabel[gate.kind]}</div>
                <textarea
                  className="gate-edit"
                  autoFocus
                  value={draft}
                  aria-label={`Edit ${inputLabel[gate.kind].toLowerCase()}`}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      decide("edited", draft);
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setEditing(false);
                      window.setTimeout(() => editRef.current?.focus(), 0);
                    }
                  }}
                />
              </>
            ) : (
              <GateBody gate={gate} />
            )}
            {gate.context && gate.context.length > 0 && (
              <div className="gate-ctx">
                <button type="button" aria-expanded={ctxOpen} onClick={() => setCtxOpen((v) => !v)}>
                  Full context <Chevron />
                </button>
                {ctxOpen && (
                  <div className="gate-ctx-body">
                    <div className="gate-label">Before this</div>
                    <ul>{gate.context.map((c) => <li key={c}>{c}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
            <footer className="gate-foot">
              {editing ? (
                <button type="button" className="gate-ghost" onClick={() => setEditing(false)}>Cancel</button>
              ) : (
                <button
                  ref={editRef}
                  type="button"
                  className="gate-ghost"
                  onClick={() => {
                    setDraft(gate.input ?? gate.diff?.map((d) => d.lines.filter((l) => l.type !== "remove").map((l) => l.text).join("\n")).join("\n") ?? "");
                    setEditing(true);
                  }}
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 2.5 13.5 5.5 6 13H3v-3Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
                  Edit
                </button>
              )}
              {open.length > 1 && <span className="gate-pos">{idx + 1} of {open.length}</span>}
              <span className="gate-spacer" />
              <button type="button" className="gate-btn" onClick={() => decide("rejected")}>Reject</button>
              <button
                ref={approveRef}
                type="button"
                className="gate-btn gate-primary"
                onClick={() => (editing ? decide("edited", draft) : decide("approved"))}
              >
                {editing ? "Approve with changes" : "Approve"}
              </button>
            </footer>
          </article>
        </div>
      ) : null}

      {holds.length > 0 && (
        <p className="gate-holds">
          <Lock />
          <b>Holds {holds.length} step{holds.length === 1 ? "" : "s"}:</b> {holds.join(", ")}
        </p>
      )}

      {decided.length > 0 && (
        <div className="gate-decided">
          <div className="gate-label">Decided</div>
          {decided.map((g) => {
            const isOpen = expanded === g.id;
            return (
              <div key={g.id} className="gate-row" data-open={isOpen} data-status={g.status}>
                <button type="button" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : g.id)}>
                  <span className="gate-check" aria-hidden="true">
                    {g.status === "rejected" ? (
                      <svg viewBox="0 0 16 16"><path d="m5 5 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    ) : (
                      <svg viewBox="0 0 16 16"><path d="m4 8.5 2.5 2.5L12 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </span>
                  <span className="gate-row-t">{g.action}</span>
                  <span className="gate-row-a">{g.agent}</span>
                  <span className="gate-row-s">{statusLabel[g.status as GateDecision]}</span>
                  {g.at && <span className="gate-row-at"> · {g.at}</span>}
                  <Chevron />
                </button>
                {isOpen && (
                  <div className="gate-row-body">
                    <p className="gate-reason">{g.reason}</p>
                    {g.note && <p className="gate-note">Changed to: {g.note}</p>}
                    <GateBody gate={g} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <span role="status" aria-live="polite" className="gate-sr">{said}</span>
    </section>
  );
}

const css = `
.gate{--ui-gatec-w:560px;--gate-bg:#fff;--gate-fg:#18181b;--gate-muted:#71717a;--gate-faint:#a1a1aa;--gate-line:#ececef;--gate-soft:#f6f6f7;--gate-accent:#4f7cf0;--gate-amber:#c2620a;--gate-amber-bg:#fdf1e3;--gate-green:#2f8a5b;--gate-red:#cc4747;--gate-add:#e9f7ef;--gate-del:#fdecec;width:100%;max-width:var(--ui-gatec-w);color:var(--gate-fg);font:400 13px/1.5 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .gate{--gate-bg:#1b1b1e;--gate-fg:#ececef;--gate-muted:#a1a1aa;--gate-faint:#71717a;--gate-line:#2c2c31;--gate-soft:#232327;--gate-accent:#7c9cff;--gate-amber:#eba659;--gate-amber-bg:#3a2a16;--gate-green:#6cc596;--gate-red:#f08585;--gate-add:#16301f;--gate-del:#3a1c1c;color-scheme:dark}
.gate *{box-sizing:border-box}.gate button{font:inherit;color:inherit;cursor:pointer}
.gate-block,.gate-card{background:var(--gate-bg);border:1px solid var(--gate-line);border-radius:10px;box-shadow:0 1px 2px #0000000a}
.gate-head{display:flex;align-items:center;gap:8px;padding:9px 10px 9px 12px;border-bottom:1px solid var(--gate-line)}
.gate-head-ico{width:16px;height:16px;color:var(--gate-muted)}
.gate-head strong{font-weight:500}.gate-task{color:var(--gate-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gate-pill{margin-left:auto;display:inline-flex;align-items:center;gap:5px;height:20px;padding:0 6px;border-radius:5px;font-size:11.5px;font-weight:500;white-space:nowrap}
.gate-pill i{width:5px;height:5px;border-radius:50%;background:currentColor}
.gate-pill svg{width:11px;height:11px}
.gate-wait{color:var(--gate-amber);background:var(--gate-amber-bg)}
.gate-ok{color:var(--gate-green);background:color-mix(in srgb,var(--gate-green) 12%,transparent)}
.gate-stats{display:grid;grid-template-columns:auto auto 1fr;margin:0}
.gate-stats>div{padding:9px 12px 10px;border-left:1px solid var(--gate-line);min-width:0}.gate-stats>div:first-child{border-left:0;padding-right:28px}.gate-stats>div:nth-child(2){padding-right:38px}
.gate-stats dt,.gate-label{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--gate-muted)}
.gate-stats dd{margin:3px 0 0;font-size:13px}
.gate-stack{position:relative;margin-top:36px;padding-bottom:0}
.gate-stack[data-depth="2"],.gate-stack[data-depth="3"]{margin-bottom:12px}
.gate-stack[data-depth="2"]::before,.gate-stack[data-depth="3"]::before{content:"";position:absolute;left:12px;right:12px;bottom:-6px;height:20px;border:1px solid var(--gate-line);border-radius:10px;background:var(--gate-bg);z-index:0}
.gate-stack[data-depth="3"]::after{content:"";position:absolute;left:24px;right:24px;bottom:-12px;height:20px;border:1px solid var(--gate-line);border-radius:10px;background:var(--gate-bg);z-index:-1}
.gate-card{position:relative;z-index:1;padding:14px 16px 12px;box-shadow:0 1px 2px #0000000a,0 6px 20px -8px #0000001f;animation:gate-rise .32s cubic-bezier(.2,.8,.2,1) both}
.gate-card[data-leaving=approved],.gate-card[data-leaving=edited]{animation:gate-drop .32s ease-in both}
.gate-card[data-leaving=rejected]{animation:gate-shake .2s ease both,gate-drop .3s .22s ease-in both}
.gate-who{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--gate-muted)}
.gate-who b{font-weight:400;color:var(--gate-fg)}
.gate-av{display:grid;place-items:center;width:20px;height:20px;border-radius:6px;color:var(--gate-accent)}.gate-av svg{width:13px;height:13px}
.gate-action{margin:10px 0 0;font-size:15px;font-weight:500;letter-spacing:-.005em}
.gate-reason{margin:10px 0 0;color:color-mix(in srgb,var(--gate-fg) 78%,var(--gate-bg))}
.gate-label{margin:12px 0 6px}
.gate-input{padding:9px 11px;border:1px solid var(--gate-line);border-radius:8px;background:var(--gate-soft);font-size:12.5px;white-space:pre-wrap;max-height:140px;overflow:auto}
.gate-edit{display:block;width:100%;min-height:86px;padding:9px 11px;border:1px solid var(--gate-accent);border-radius:8px;background:var(--gate-bg);color:var(--gate-fg);font:inherit;font-size:12.5px;resize:vertical;outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--gate-accent) 15%,transparent)}
.gate-diff{border:1px solid var(--gate-line);border-radius:8px;overflow:hidden;font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace}
.gate-file{padding:6px 10px;background:var(--gate-soft);border-bottom:1px solid var(--gate-line);font-family:Inter,system-ui,sans-serif;color:var(--gate-muted)}
.gate-dl{display:flex;gap:8px;padding:0 10px;white-space:pre}.gate-dl>span:first-child{width:8px;color:var(--gate-faint)}
.gate-add{background:var(--gate-add)}.gate-add>span:first-child{color:var(--gate-green)}
.gate-remove{background:var(--gate-del)}.gate-remove>span:first-child{color:var(--gate-red)}
.gate-ctx{margin-top:12px}
.gate-ctx>button{display:inline-flex;align-items:center;gap:4px;padding:0;border:0;background:none;color:var(--gate-fg);font-size:12.5px}
.gate-ctx>button svg{width:12px;height:12px;color:var(--gate-faint);transition:transform .2s}.gate-ctx>button[aria-expanded=true] svg{transform:rotate(180deg)}
.gate-ctx-body ul{margin:0;padding-left:16px;color:var(--gate-muted)}.gate-ctx-body li{margin:2px 0}
.gate-foot{display:flex;align-items:center;gap:8px;margin-top:72px}
.gate-spacer{flex:1}.gate-pos{font-size:12px;color:var(--gate-faint)}
.gate-ghost{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 8px;border:0;border-radius:7px;background:none;color:var(--gate-muted)!important;font-size:13px}
.gate-ghost:hover{background:var(--gate-soft);color:var(--gate-fg)!important}.gate-ghost svg{width:14px;height:14px}
.gate-btn{height:30px;padding:0 12px;border:1px solid var(--gate-line);border-radius:7px;background:var(--gate-bg);font-size:13px;font-weight:500;transition:background .15s,transform .1s}
.gate-btn:hover{background:var(--gate-soft)}.gate-btn:active{transform:scale(.97)}
.gate-primary{background:var(--gate-fg);border-color:var(--gate-fg);color:var(--gate-bg)!important}.gate-primary:hover{background:color-mix(in srgb,var(--gate-fg) 86%,var(--gate-bg))}
.gate-holds{display:flex;align-items:center;gap:6px;margin:14px 2px 0;font-size:12px;color:var(--gate-muted)}
.gate-holds svg{width:12px;height:12px;color:var(--gate-amber)}.gate-holds b{font-weight:400;color:var(--gate-amber)}
.gate-decided{margin-top:14px}.gate-decided>.gate-label{margin:0 0 6px}
.gate-row{margin-bottom:4px;background:var(--gate-bg);border:1px solid var(--gate-line);border-radius:8px;overflow:hidden;animation:gate-in .3s both}
.gate-row>button{display:flex;align-items:center;gap:8px;width:100%;height:32px;padding:0 10px;border:0;background:none;text-align:left;font-size:12px;white-space:nowrap}
.gate-row>button:hover{background:var(--gate-soft)}
.gate-check{display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:var(--gate-soft);color:var(--gate-muted);flex:none}.gate-check svg{width:11px;height:11px}
.gate-row[data-status=rejected] .gate-check{color:var(--gate-red)}
.gate-row-t{font-size:12.5px;overflow:hidden;text-overflow:ellipsis;min-width:0}
.gate-row-a{margin-left:auto;color:var(--gate-muted)}.gate-row-s{margin-left:4px}.gate-row-at{color:var(--gate-faint);margin-left:-4px}
.gate-row[data-status=rejected] .gate-row-s{color:var(--gate-red)}
.gate-row>button>svg{width:13px;height:13px;color:var(--gate-faint);margin-left:4px;transition:transform .2s;flex:none}
.gate-row[data-open=true]>button>svg{transform:rotate(180deg)}
.gate-row-body{padding:0 12px 12px 34px}.gate-row-body .gate-reason{margin-top:4px}
.gate-note{margin:6px 0 0;color:var(--gate-accent);font-size:12.5px}
.gate-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.gate :focus-visible{outline:2px solid var(--gate-accent);outline-offset:2px}
@keyframes gate-rise{from{opacity:0;transform:translateY(10px) scale(.98)}}
@keyframes gate-drop{to{opacity:0;transform:translateY(40px) scale(.97)}}
@keyframes gate-shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@keyframes gate-in{from{opacity:0;transform:translateY(-4px)}}
@media(max-width:520px){.gate-stats{grid-template-columns:1fr 1fr}.gate-stats>div:nth-child(3){grid-column:1/-1;border-left:0;border-top:1px solid var(--gate-line)}.gate-row-a{display:none}.gate-row-s{margin-left:auto}.gate-card{padding:12px}.gate-foot{margin-top:24px}}
@media(prefers-reduced-motion:reduce){.gate *,.gate *::before,.gate *::after{animation:none!important;transition:none!important}}
`;

export default ApprovalGates;
