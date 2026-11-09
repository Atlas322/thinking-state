"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type ReviewFlag = { text: string; note: string; source?: string };
export type ReviewText = string | (string | ReviewFlag)[];
export type ReviewItem = {
  id: string;
  title: string;
  agent: string;
  model?: string;
  icon?: React.ReactNode;
  type: string;
  risk: "high" | "medium" | "low";
  confidence: number;
  /** epoch ms */
  createdAt: number;
  reasoning?: string;
  fields?: { label: string; value: ReviewText }[];
  body?: ReviewText;
  sources?: string[];
};
export type ReviewDecision = "approved" | "rejected";
export type ReviewResult = { decision: ReviewDecision; reason?: string; text?: string };
type Filter = "all" | "high" | "unsure";

export type ReviewCenterProps = {
  items?: ReviewItem[];
  onDecide?: (item: ReviewItem, result: ReviewResult) => void;
  onUndo?: (item: ReviewItem, result: ReviewResult) => void;
  onSkip?: (item: ReviewItem) => void;
  reviewed?: number;
  total?: number;
  sla?: number;
  now?: number;
  lowConfidence?: number;
  reasons?: string[];
  order?: "risk" | "oldest" | "given";
  filter?: Filter;
  defaultFilter?: Filter;
  onFilterChange?: (f: Filter) => void;
  title?: string;
  className?: string;
};

const ico = (c: React.ReactNode) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    {c}
  </svg>
);
export const reviewIcons = {
  gemini: ico(<path d="M8 1.5c.4 3.6 2.9 6.1 6.5 6.5-3.6.4-6.1 2.9-6.5 6.5C7.6 10.9 5.1 8.4 1.5 8 5.1 7.6 7.6 5.1 8 1.5Z" fill="#3b7cf6" />),
  claude: ico(
    <g stroke="#d97757" strokeWidth="1.4" strokeLinecap="round">
      <path d="M8 2v12M2 8h12M3.8 3.8l8.4 8.4M12.2 3.8l-8.4 8.4M5.2 2.6l5.6 10.8M10.8 2.6 5.2 13.4" />
    </g>,
  ),
  openai: ico(
    <g fill="none" stroke="currentColor" strokeWidth="1.1">
      <path d="M8 2.2a2.8 2.8 0 0 1 4.6 2.6 2.8 2.8 0 0 1 .4 5A2.8 2.8 0 0 1 8.5 13a2.8 2.8 0 0 1-4.7-2.4 2.8 2.8 0 0 1-.6-5A2.8 2.8 0 0 1 8 2.2Z" />
      <path d="M6 4.4v5l2 1.2 2-1.2V5.3M4 8.2l4-2.3 4 2.3" />
    </g>,
  ),
};

const T0 = Date.now();
const m = (n: number) => T0 - n * 60000;
const defaultItems: ReviewItem[] = [
  {
    id: "inv",
    title: "Pay INV-2207 from Acme Logistics",
    agent: "Finance agent",
    model: "Gemini 3.8 Pro",
    icon: reviewIcons.gemini,
    type: "Invoice",
    risk: "high",
    confidence: 0.62,
    createdAt: m(0),
    reasoning: "Amount and line items match PO-118. The bank details differ from the last six payments to Acme.",
    fields: [
      { label: "Amount", value: "$12,480.00" },
      { label: "Due", value: "Oct 24" },
      {
        label: "IBAN",
        value: [{ text: "DE89 •••• 3000", note: "New IBAN – changed by email two days ago. Confirm it by phone before paying.", source: "Email from billing@acme-logistics.co" }],
      },
    ],
    sources: ["INV-2207.pdf", "PO-118", "Vendor email"],
  },
  { id: "mig", title: "Split customers.name into first and last name", agent: "Data agent", model: "Claude Opus 5.5", icon: reviewIcons.claude, type: "Migration", risk: "medium", confidence: 0.81, createdAt: m(14), reasoning: "Adds two columns and backfills them from the existing name; the old column stays until the app is updated.", fields: [{ label: "Rows", value: "48,210" }, { label: "Downtime", value: "None" }], sources: ["0042_split_name.sql"] },
  { id: "keys", title: "Rotate the Stripe API keys", agent: "Ops agent", model: "Claude Opus 5.5", icon: reviewIcons.claude, type: "Plan", risk: "medium", confidence: 0.66, createdAt: m(11), reasoning: "The live key is 14 months old. Rotation needs a deploy of the checkout service right after.", sources: ["Runbook – key rotation"] },
  { id: "ref", title: "Refund order #4821 for Maya Chen", agent: "Support agent", model: "Claude Sonnet 5", icon: reviewIcons.claude, type: "Refund", risk: "low", confidence: 0.92, createdAt: m(9), reasoning: "The parcel was returned and scanned at the warehouse yesterday.", fields: [{ label: "Amount", value: "$84.00" }, { label: "Method", value: "Original card" }] },
  { id: "tag", title: "Tag 14 tickets as Billing", agent: "Support agent", model: "Claude Sonnet 5", icon: reviewIcons.claude, type: "Triage", risk: "low", confidence: 0.88, createdAt: m(6), reasoning: "All 14 mention an invoice, a charge or a refund in the first message." },
  { id: "bump", title: "Bump @stripe/stripe-js to 4.2.1", agent: "Code agent", model: "GPT-6", icon: reviewIcons.openai, type: "Code change", risk: "low", confidence: 0.64, createdAt: m(4), reasoning: "Patch release; the changelog lists only bug fixes. Tests pass." },
  { id: "post", title: "Post release notes to #announcements", agent: "Comms agent", model: "GPT-6", icon: reviewIcons.openai, type: "Slack message", risk: "low", confidence: 0.9, createdAt: m(2), reasoning: "Summarises the 3.2 release in four bullets with a link to the changelog." },
];

const waited = (ms: number) => {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h`;
};

export function ReviewCenter({
  items = defaultItems,
  onDecide,
  onUndo,
  onSkip,
  reviewed = 26,
  total,
  sla = 1800000,
  now: nowProp,
  lowConfidence = 0.7,
  reasons = ["Wrong info", "Tone", "Not allowed", "Other"],
  order = "given",
  filter: filterProp,
  defaultFilter = "all",
  onFilterChange,
  title = "Review center",
  className = "",
}: ReviewCenterProps) {
  const [tick, setTick] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (nowProp != null) return;
    const id = window.setInterval(() => setTick(Date.now()), 10000);
    return () => window.clearInterval(id);
  }, [nowProp]);
  const now = nowProp ?? tick;
  const [decided, setDecided] = React.useState<{ item: ReviewItem; result: ReviewResult }[]>([]);
  const [skipped, setSkipped] = React.useState<string[]>([]);
  const [innerFilter, setInnerFilter] = React.useState<Filter>(defaultFilter);
  const filter = filterProp ?? innerFilter;
  const [currentId, setCurrentId] = React.useState<string | null>(null);
  const [mode, setMode] = React.useState<"view" | "edit" | "reject">("view");
  const [draft, setDraft] = React.useState("");
  const [note, setNote] = React.useState<string | null>(null);
  const [announce, setAnnounce] = React.useState("");
  const rootRef = React.useRef<HTMLElement>(null);

  const gone = new Set(decided.map((d) => d.item.id));
  const waiting = items.filter((i) => !gone.has(i.id));
  const sorted =
    order === "given"
      ? waiting
      : waiting.slice().sort((a, b) => {
          if (order === "risk") {
            const r = { high: 0, medium: 1, low: 2 };
            if (r[a.risk] !== r[b.risk]) return r[a.risk] - r[b.risk];
          }
          return a.createdAt - b.createdAt;
        });
  const queue = sorted.filter((i) =>
    filter === "high" ? i.risk === "high" : filter === "unsure" ? i.confidence < lowConfidence : true,
  );
  const current = queue.find((i) => i.id === currentId) ?? queue[0];
  const done = reviewed + decided.length;
  const all = total ?? reviewed + items.length;
  const oldest = waiting.reduce((n, i) => Math.min(n, i.createdAt), now);
  const last = decided[decided.length - 1];

  const setFilter = (f: Filter) => {
    setInnerFilter(f);
    onFilterChange?.(f);
  };
  const go = (d: number) => {
    if (!current) return;
    const i = queue.indexOf(current);
    const n = queue[Math.max(0, Math.min(queue.length - 1, i + d))];
    if (n) setCurrentId(n.id);
    setMode("view");
    setNote(null);
  };
  const nextAfter = (id: string) => {
    const i = queue.findIndex((q) => q.id === id);
    const n = queue[i + 1] ?? queue[i - 1];
    setCurrentId(n && n.id !== id ? n.id : null);
  };
  const decide = (result: ReviewResult) => {
    if (!current) return;
    nextAfter(current.id);
    setDecided((d) => [...d, { item: current, result }]);
    setMode("view");
    setNote(null);
    onDecide?.(current, result);
    setAnnounce(`${result.decision === "approved" ? "Approved" : "Rejected"}: ${current.title}. ${done + 1} of ${all} reviewed.`);
  };
  const undo = () => {
    if (!last) return;
    setDecided((d) => d.slice(0, -1));
    setCurrentId(last.item.id);
    onUndo?.(last.item, last.result);
    setAnnounce(`Undone: ${last.item.title}`);
  };
  const skip = () => {
    if (!current) return;
    setSkipped((s) => [...s, current.id]);
    onSkip?.(current);
    go(1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (mode === "edit") {
      if (e.key === "Escape") setMode("view");
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) decide({ decision: "approved", text: draft });
      return;
    }
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
    const k = e.key.toLowerCase();
    if (mode === "reject") {
      const n = Number(e.key);
      if (n >= 1 && n <= reasons.length) decide({ decision: "rejected", reason: reasons[n - 1] });
      if (k === "escape") setMode("view");
      return;
    }
    if ((e.metaKey || e.ctrlKey) && k === "z") return (e.preventDefault(), undo());
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (k === "a") decide({ decision: "approved" });
    else if (k === "e" && current) (e.preventDefault(), setDraft(current.title), setMode("edit"));
    else if (k === "r") setMode("reject");
    else if (k === "s") skip();
    else if (k === "j" || e.key === "ArrowDown") (e.preventDefault(), go(1));
    else if (k === "k" || e.key === "ArrowUp") (e.preventDefault(), go(-1));
    else if (k === "z") undo();
    else if (k === "f") setNote((n) => (n ? null : "flag"));
    else if (k === "escape") setNote(null);
  };

  const renderText = (v: ReviewText) =>
    typeof v === "string"
      ? v
      : v.map((p, i) =>
          typeof p === "string" ? (
            <React.Fragment key={i}>{p}</React.Fragment>
          ) : (
            <span key={i} className="rc-flagwrap">
              <mark
                tabIndex={0}
                className="rc-flag"
                aria-describedby={note ? "rc-note" : undefined}
                onMouseEnter={() => setNote("flag")}
                onMouseLeave={() => setNote(null)}
                onFocus={() => setNote("flag")}
                onBlur={() => setNote(null)}
              >
                {p.text}
              </mark>
              {note && (
                <span id="rc-note" role="tooltip" className="rc-note">
                  <span className="rc-note-h">
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5 14 13H2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M8 6.5v3M8 11.2v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    Agent's note
                  </span>
                  {p.note}
                  {p.source && <span className="rc-note-s">{p.source}</span>}
                </span>
              )}
            </span>
          ),
        );

  const tabs: [Filter, string, number][] = [
    ["all", "All", waiting.length],
    ["high", "High risk", waiting.filter((i) => i.risk === "high").length],
    ["unsure", "Unsure", waiting.filter((i) => i.confidence < lowConfidence).length],
  ];

  return (
    <section ref={rootRef} className={`rc ${className}`} aria-label={title} onKeyDown={onKey} tabIndex={-1}>
      <style>{css}</style>
      <header className="rc-bar">
        <svg viewBox="0 0 16 16" className="rc-logo" aria-hidden="true">
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="m5.5 8.2 1.8 1.8 3.4-3.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <strong>{title}</strong>
        <span className="rc-prog" role="progressbar" aria-valuemin={0} aria-valuemax={all} aria-valuenow={done}>
          <span style={{ width: `${(done / Math.max(1, all)) * 100}%` }} />
        </span>
        <span className="rc-count">
          <b>{done}</b> of {all} reviewed
          <span className="rc-sep">·</span>
          oldest <b>{waited(now - oldest)}</b>
        </span>
        <span className="rc-last">
          {last && (
            <>
              {last.result.decision === "approved" ? (
                <svg viewBox="0 0 16 16" className="rc-ok" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" className="rc-no" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              )}
              {last.result.decision === "approved" ? (last.result.text ? "Approved with edits" : "Approved") : `Rejected · ${last.result.reason}`}
            </>
          )}
        </span>
        <button type="button" className="rc-undo" disabled={!last} onClick={undo} aria-keyshortcuts="Z">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.5-3.6M3 2.5V5h2.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Undo <kbd>Z</kbd>
        </button>
      </header>
      <div className="rc-main">
        <aside className="rc-queue">
          <div className="rc-tabs" role="tablist">
            {tabs.map(([id, label, n]) => (
              <button key={id} type="button" role="tab" aria-selected={filter === id} onClick={() => setFilter(id)}>
                {label} <span>{n}</span>
              </button>
            ))}
          </div>
          <ol className="rc-rows">
            {queue.map((i) => {
              const age = now - i.createdAt;
              return (
                <li key={i.id}>
                  <button
                    type="button"
                    aria-current={current?.id === i.id ? "true" : undefined}
                    aria-label={`${i.title}, ${i.type}, ${i.risk} risk, ${Math.round(i.confidence * 100)}% confident, waiting ${waited(age)}`}
                    className={skipped.includes(i.id) ? "is-skipped" : ""}
                    onClick={() => {
                      setCurrentId(i.id);
                      setMode("view");
                    }}
                  >
                    <span className="rc-ico">{i.icon}</span>
                    <span className="rc-rt">
                      <span className="rc-row-t">{i.title}</span>
                      <span className="rc-row-s">{i.type}</span>
                    </span>
                    <span className={`rc-age ${age > sla ? "is-late" : age > sla * 0.75 ? "is-warn" : ""}`}>{waited(age)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
        <div className="rc-item">
          {current ? (
            <div className="rc-scroll" key={current.id}>
              <div className="rc-agent">
                <span className="rc-agent-i">{current.icon}</span>
                <div>
                  <div className="rc-agent-n">
                    {current.agent}
                    {current.risk !== "low" && <span className={`rc-risk is-${current.risk}`}>{current.risk === "high" ? "High risk" : "Medium risk"}</span>}
                  </div>
                  {current.model && <div className="rc-model">{current.model}</div>}
                </div>
              </div>
              {mode === "edit" ? (
                <textarea className="rc-edit" value={draft} autoFocus onChange={(e) => setDraft(e.target.value)} aria-label="Edit proposal" />
              ) : (
                <h3 className="rc-title">{current.title}</h3>
              )}
              {current.reasoning && (
                <p className="rc-why">
                  <b>Why</b> {current.reasoning}
                </p>
              )}
              {current.fields && (
                <dl className="rc-fields">
                  {current.fields.map((f) => (
                    <div key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{renderText(f.value)}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {current.body && <p className="rc-body">{renderText(current.body)}</p>}
              {current.sources && (
                <div className="rc-sources">
                  {current.sources.map((s) => (
                    <span key={s}>
                      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 5.5-4 4a1.4 1.4 0 0 0 2 2l4.5-4.5a2.8 2.8 0 0 0-4-4L4 7.5a4.2 4.2 0 0 0 6 6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rc-empty">All caught up</div>
          )}
          <footer className="rc-actions">
            {mode === "reject" ? (
              <div className="rc-reasons" role="group" aria-label="Reason for rejecting">
                {reasons.map((r, i) => (
                  <button key={r} type="button" className="rc-btn" onClick={() => decide({ decision: "rejected", reason: r })}>
                    {r} <kbd>{i + 1}</kbd>
                  </button>
                ))}
                <button type="button" className="rc-btn" onClick={() => setMode("view")}>
                  Cancel <kbd>Esc</kbd>
                </button>
              </div>
            ) : (
              <>
                <button type="button" className="rc-btn is-primary" disabled={!current} aria-keyshortcuts="A" onClick={() => decide(mode === "edit" ? { decision: "approved", text: draft } : { decision: "approved" })}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  Approve <kbd>A</kbd>
                </button>
                <button type="button" className="rc-btn" disabled={!current} aria-keyshortcuts="E" onClick={() => { if (current) { setDraft(current.title); setMode(mode === "edit" ? "view" : "edit"); } }}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 3.5h-6v9h9v-6M6.5 9.5l.4-2L12 2.4l1.6 1.6-5.1 5.1Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                  Edit <kbd>E</kbd>
                </button>
                <button type="button" className="rc-btn" disabled={!current} aria-keyshortcuts="R" onClick={() => setMode("reject")}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                  Reject <kbd>R</kbd>
                </button>
                <button type="button" className="rc-btn" disabled={!current} aria-keyshortcuts="S" onClick={skip}>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                  Skip <kbd>S</kbd>
                </button>
              </>
            )}
          </footer>
        </div>
      </div>
      <p className="rc-sr" aria-live="polite">
        {announce}
      </p>
    </section>
  );
}

const css = `
.rc{--rc-bg:#fff;--rc-fg:#18181b;--rc-muted:#71717a;--rc-faint:#a1a1aa;--rc-line:#ececef;--rc-chip:#f4f4f5;--rc-blue:#3b82f6;--rc-amber:#fde68a;width:100%;max-width:760px;display:flex;flex-direction:column;background:var(--rc-bg);color:var(--rc-fg);border:1px solid var(--rc-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums;outline:none;container-type:inline-size}
:where(.dark,[data-theme=dark]) .rc{--rc-bg:#1b1b1e;--rc-fg:#ececef;--rc-muted:#a1a1aa;--rc-faint:#71717a;--rc-line:#2e2e33;--rc-chip:#26262a;--rc-amber:#6b5310;color-scheme:dark}
.rc *{box-sizing:border-box}.rc button,.rc textarea{font:inherit;color:inherit}.rc button{cursor:pointer}
.rc-bar{display:flex;align-items:center;gap:10px;height:48px;padding:0 16px;border-bottom:1px solid var(--rc-line);font-size:13px;white-space:nowrap}
.rc-logo{width:16px;height:16px;color:var(--rc-blue);flex:none}
.rc-bar strong{font-weight:500;font-size:14px}
.rc-prog{width:64px;height:4px;margin-left:2px;border-radius:2px;background:var(--rc-line);overflow:hidden;flex:none}
.rc-prog span{display:block;height:100%;border-radius:2px;background:linear-gradient(90deg,#bfdbfe,#60a5fa);transition:width .4s}
.rc-count{color:var(--rc-muted)}.rc-count b{font-weight:500;color:var(--rc-fg)}.rc-sep{margin:0 8px;color:var(--rc-faint)}
.rc-last{display:inline-flex;align-items:center;gap:6px;margin-left:auto;color:var(--rc-muted);overflow:hidden;text-overflow:ellipsis}
.rc-last svg{width:13px;height:13px;flex:none}.rc-ok{color:#16a34a}.rc-no{color:#dc2626}
.rc-undo{display:inline-flex;align-items:center;gap:6px;border:0;background:none;padding:0;font-weight:500}
.rc-undo:disabled{opacity:.4;cursor:default}.rc-undo svg{width:13px;height:13px}
.rc kbd{display:inline-grid;place-items:center;min-width:16px;height:16px;padding:0 3px;border-radius:3px;background:var(--rc-chip);font:500 10px/1 Inter,system-ui,sans-serif;color:var(--rc-muted)}
.rc-main{display:grid;grid-template-columns:268px 1fr;height:552px}
.rc-queue{display:flex;flex-direction:column;border-right:1px solid var(--rc-line);min-height:0}
.rc-tabs{display:flex;gap:4px;padding:10px 8px;border-bottom:1px solid var(--rc-line)}
.rc-tabs button{height:28px;padding:0 10px;border:0;border-radius:6px;background:none;font-size:13px;color:var(--rc-muted)}
.rc-tabs button span{margin-left:3px;font-size:11px;color:var(--rc-faint)}
.rc-tabs button[aria-selected=true]{background:var(--rc-bg);box-shadow:0 0 0 1px var(--rc-line),0 1px 2px #0000000d;color:var(--rc-fg);font-weight:500}
.rc-rows{list-style:none;margin:0;padding:6px 8px;overflow:auto;flex:1}
.rc-rows button{display:flex;align-items:flex-start;gap:12px;width:100%;height:56px;margin-bottom:2px;padding:10px 10px 0 10px;border:0;border-radius:8px;background:none;text-align:left;animation:rc-in .3s both}
.rc-rows button:hover{background:var(--rc-chip)}
.rc-rows button[aria-current=true]{background:var(--rc-bg);box-shadow:0 0 0 1px var(--rc-line),0 2px 6px #0000000f}
.rc-rows button.is-skipped .rc-row-t{color:var(--rc-muted)}
.rc-ico{display:grid;place-items:center;width:28px;height:28px;flex:none;border-radius:50%;box-shadow:0 0 0 1px var(--rc-line);margin-top:2px}.rc-ico svg{width:13px;height:13px}
.rc-rt{display:flex;flex-direction:column;min-width:0;flex:1}
.rc-row-t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
.rc-row-s{font-size:12px;color:var(--rc-muted)}
.rc-age{font-size:12px;color:var(--rc-faint);flex:none}.rc-age.is-warn{color:#d97706}.rc-age.is-late{color:#dc2626}
.rc-item{display:flex;flex-direction:column;min-width:0;min-height:0}
.rc-scroll{flex:1;overflow:auto;padding:18px 20px;animation:rc-up .3s both}
.rc-agent{display:flex;align-items:center;gap:12px}
.rc-agent-i{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;box-shadow:0 0 0 1px var(--rc-line),0 1px 2px #0000000d}.rc-agent-i svg{width:15px;height:15px}
.rc-agent-n{display:flex;align-items:center;gap:8px;font-weight:500}
.rc-model{font-size:12px;color:var(--rc-muted)}
.rc-risk{padding:1px 6px;border-radius:4px;font-size:13px;font-weight:400}
.rc-risk.is-high{background:#ffe8e3;color:#e5484d}.rc-risk.is-medium{background:#fff1dc;color:#c2580c}
.rc-title{margin:18px 0 0;font-size:16px;font-weight:500;letter-spacing:-.01em}
.rc-edit{display:block;width:100%;margin-top:14px;padding:8px 10px;border:1px solid var(--rc-blue);border-radius:8px;background:var(--rc-bg);font-size:15px;resize:vertical;outline:none}
.rc-why{margin:10px 0 0;color:var(--rc-muted);font-size:14px}.rc-why b{font-weight:500;color:var(--rc-fg)}
.rc-fields{display:flex;flex-wrap:wrap;gap:8px 36px;margin:18px 0 0}
.rc-fields dt{font-size:12px;color:var(--rc-muted)}.rc-fields dd{margin:0;font-size:14px}
.rc-flagwrap{position:relative}
.rc-flag{background:var(--rc-amber);color:inherit;padding:0 1px;border-bottom:1.5px solid #f59e0b;cursor:help;outline:none}
.rc-flag:focus-visible{box-shadow:0 0 0 2px var(--rc-blue)}
.rc-note{position:absolute;left:-80px;top:26px;z-index:3;display:block;width:290px;padding:10px 12px;border:1px solid var(--rc-line);border-radius:10px;background:var(--rc-bg);box-shadow:0 10px 30px #0000001f;font-size:13px;line-height:1.45;animation:rc-pop .16s both}
.rc-note-h{display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:#d97706}.rc-note-h svg{width:12px;height:12px}
.rc-note-s{display:inline-block;margin-top:6px;padding:1px 6px;border-radius:4px;background:var(--rc-chip);font-size:12px;color:var(--rc-muted)}
.rc-body{margin:14px 0 0}
.rc-sources{display:flex;flex-wrap:wrap;gap:16px;margin-top:20px;font-size:12px;color:var(--rc-muted)}
.rc-sources span{display:inline-flex;align-items:center;gap:6px}.rc-sources svg{width:12px;height:12px;color:var(--rc-faint)}
.rc-empty{flex:1;display:grid;place-items:center;color:var(--rc-faint)}
.rc-actions{display:flex;gap:8px;padding:12px 16px;border-top:1px solid var(--rc-line)}
.rc-reasons{display:flex;flex-wrap:wrap;gap:8px}
.rc-btn{display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 6px 0 8px;border:0;border-radius:7px;background:var(--rc-bg);box-shadow:0 0 0 1px var(--rc-line),0 1px 2px #0000000d;font-size:14px;font-weight:500;transition:background .15s}
.rc-btn:hover{background:var(--rc-chip)}.rc-btn:disabled{opacity:.45;cursor:default}
.rc-btn svg{width:13px;height:13px;color:var(--rc-muted)}
.rc-btn.is-primary{background:var(--rc-fg);color:var(--rc-bg);box-shadow:none}.rc-btn.is-primary svg{color:inherit}
.rc-btn.is-primary kbd{background:#ffffff26;color:#ffffffb3}
.rc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rc :focus-visible{outline:2px solid var(--rc-blue);outline-offset:2px}
@keyframes rc-in{from{opacity:0}}@keyframes rc-up{from{opacity:0;transform:translateY(6px)}}@keyframes rc-pop{from{opacity:0;transform:scale(.97)}}
@container (max-width:640px){.rc-main{grid-template-columns:1fr;grid-template-rows:auto 1fr;height:auto}.rc-queue{border-right:0;border-bottom:1px solid var(--rc-line)}.rc-rows{max-height:186px}.rc-count,.rc-prog,.rc-last{display:none}.rc-actions .rc-btn{flex:1;justify-content:center}}
@container (max-width:420px){.rc-btn svg{display:none}.rc-note{left:0;width:240px}}
@media(prefers-reduced-motion:reduce){.rc *{animation:none!important;transition:none!important}}
`;

export default ReviewCenter;
