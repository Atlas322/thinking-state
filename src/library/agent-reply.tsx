"use client";

import * as React from "react";

/**
 * Independent implementation. One agent reply format from Second Brain OS:
 * Summary · Findings · Proposal · Outputs · Your choice · Sources (folded).
 * Choice buttons post the answer back to the agent; an own-answer field sits beside them.
 *
 * In a host chat that already draws the message (avatar, name, time) pass `bare`; a host that parses the reply
 * itself passes `sections` (its own titles and rendered bodies) and puts its own output previews in `children`.
 */

export type ReplyOutput = {
  label: string;
  kind?: "site" | "file" | "doc" | "image";
  href?: string;
};

export type ReplySource = { label: string; href?: string };

export type ReplyTone = "blue" | "green" | "amber" | "muted";

/** A host-defined section: its title, and its body already rendered (markdown, links…). */
export type ReplySectionItem = {
  title: string;
  /** Written to `data-reply-section`. */
  kind?: string;
  tone?: ReplyTone;
  /** Shown beside the title while folded. */
  count?: number;
  folded?: boolean;
  content: React.ReactNode;
};

export type AgentReplyProps = {
  /** No avatar and no name/time row — the host chat draws them. */
  bare?: boolean;
  agent?: string;
  avatar?: React.ReactNode;
  time?: string;
  summary?: React.ReactNode;
  findings?: React.ReactNode[];
  proposal?: React.ReactNode;
  /** Host-defined sections, after findings and proposal, in the given order. */
  sections?: ReplySectionItem[];
  outputs?: ReplyOutput[];
  choices?: string[];
  sources?: ReplySource[];
  labels?: Partial<Record<
    "findings" | "proposal" | "outputs" | "choices" | "sources" | "open" | "own" | "send",
    string
  >> & { answered?: string | ((choice: string) => string) };
  /** Called with the chosen option or own answer. Omit for a read-only reply. */
  onChoose?: (choice: string) => void | Promise<unknown>;
  onOpenOutput?: (output: ReplyOutput) => void;
  /** Host content between the sections and the choices (e.g. the host's own output previews). */
  children?: React.ReactNode;
  className?: string;
};

const tones: Record<ReplyTone, string> = {
  blue: "var(--ar-blue)", green: "var(--ar-green)", amber: "var(--ar-amber)", muted: "var(--ar-mu)",
};

const defaultLabels = {
  findings: "Findings",
  proposal: "Proposal",
  outputs: "Outputs",
  choices: "Your choice",
  sources: "Sources",
  open: "Open",
  own: "Or: your own answer, an edit…",
  send: "Send",
  answered: "Answered — the agent continues.",
};

const css = `
.ar{--ar-tx:#18181b;--ar-mu:#71717a;--ar-dim:#a1a1aa;--ar-bd:#e4e4e7;--ar-s1:#fafafa;--ar-s2:#f4f4f5;
--ar-blue:#2563eb;--ar-green:#16a34a;--ar-amber:#d97706;--ar-red:#dc2626;
font:14px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;color:var(--ar-tx);display:flex;gap:12px;max-width:680px}
:where(.dark,[data-theme=dark]) .ar{--ar-tx:#f4f4f5;--ar-mu:#a1a1aa;--ar-dim:#71717a;--ar-bd:#27272a;--ar-s1:#111113;--ar-s2:#18181b;
--ar-blue:#60a5fa;--ar-green:#4ade80;--ar-amber:#f59e0b;--ar-red:#f87171}
.ar-av{flex:none;width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:var(--ar-s2);border:1px solid var(--ar-bd);font-size:14px}
.ar-main{min-width:0;flex:1;display:flex;flex-direction:column;gap:10px}
.ar-head{display:flex;align-items:baseline;gap:8px}
.ar-name{font-weight:600}.ar-time{font:11px ui-monospace,monospace;color:var(--ar-dim)}
.ar-sum{margin:0}
.ar-sec{display:flex;flex-direction:column;gap:4px}
.ar-h{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:4px;align-self:flex-start;font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--tone)}
.ar-h:focus-visible{outline:2px solid var(--tone);outline-offset:2px;border-radius:4px}
.ar-h svg{width:13px;height:13px;transition:transform .15s}.ar-h[aria-expanded=true] svg{transform:rotate(90deg)}
.ar-n{font:10px ui-monospace,monospace;color:var(--ar-dim);text-transform:none}
.ar-body{border-left:2px solid var(--ar-bd);padding-left:12px;font-size:13.5px}
.ar-body>ul{margin:0;padding-left:18px}.ar-body>ul>li+li{margin-top:2px}.ar-body>p{margin:0}
.ar-outs{display:flex;flex-wrap:wrap;gap:6px}
.ar-out{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;max-width:100%;padding:6px 10px;border:1px solid var(--ar-bd);border-radius:8px;background:var(--ar-s1);font-size:12.5px;transition:border-color .15s,background .15s}
.ar-out:hover,.ar-out:focus-visible{border-color:var(--ar-blue);background:var(--ar-s2)}
.ar-out svg{width:14px;height:14px;flex:none;color:var(--ar-blue)}
.ar-out span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ar-out em{font-style:normal;font-size:11px;color:var(--ar-blue)}
.ar-ch{display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:10px;border:1px solid color-mix(in srgb,var(--ar-amber) 40%,transparent);background:color-mix(in srgb,var(--ar-amber) 6%,transparent)}
.ar-ch>b{font-size:11.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--ar-amber)}
.ar-opts{display:flex;flex-wrap:wrap;gap:6px}
.ar-opt{all:unset;cursor:pointer;padding:4px 12px;border-radius:999px;border:1px solid var(--ar-amber);font-size:12.5px;transition:background .15s,opacity .15s}
.ar-opt:hover:not(:disabled){background:color-mix(in srgb,var(--ar-amber) 16%,transparent)}
.ar-opt:focus-visible{outline:2px solid var(--ar-amber);outline-offset:2px}
.ar-opt[aria-pressed=true]{background:var(--ar-amber);color:#000}
.ar-opt:disabled{cursor:default}.ar-opt.dim{opacity:.4}
.ar-own{display:flex;gap:6px}
.ar-own input{flex:1;min-width:0;padding:4px 12px;border-radius:999px;border:1px solid var(--ar-bd);background:transparent;color:inherit;font:inherit;font-size:12.5px;outline:none}
.ar-own input:focus{border-color:var(--ar-amber)}
.ar-own button{all:unset;cursor:pointer;padding:4px 12px;border-radius:999px;border:1px solid var(--ar-amber);font-size:12.5px}
.ar-own button:disabled{opacity:.4;cursor:default}
.ar-ok{font-size:11.5px;color:var(--ar-green)}.ar-err{font-size:11.5px;color:var(--ar-red)}
.ar-src a{color:var(--ar-mu)}
@media (prefers-reduced-motion:reduce){.ar *{transition:none!important}}
`;

const Chevron = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const outIcon: Record<NonNullable<ReplyOutput["kind"]>, React.ReactNode> = {
  site: <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>,
  file: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.5h5l3 3v10H4z M9 1.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  doc: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.5h8v13H4z M6 5h4M6 8h4M6 11h2" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>,
  image: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="m3 12 4-4 3 3 2-2 2 2" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>,
};

function Section({ title, tone, count, folded, kind, children }: {
  title: string; tone: string; count?: number; folded?: boolean; kind?: string; children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(!folded);
  const id = React.useId();
  return (
    <div className="ar-sec" data-reply-section={kind} style={{ "--tone": tone } as React.CSSProperties}>
      <button type="button" className="ar-h" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        <Chevron />{title}
        {!open && count ? <span className="ar-n">{count}</span> : null}
      </button>
      {open && <div className="ar-body" id={id}>{children}</div>}
    </div>
  );
}

export function AgentReply({
  bare, agent = "Agent", avatar = "◆", time, summary, findings = [], proposal, sections = [], outputs = [],
  choices = [], sources = [], labels, onChoose, onOpenOutput, children, className,
}: AgentReplyProps) {
  const L = { ...defaultLabels, ...labels };
  const [picked, setPicked] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [own, setOwn] = React.useState("");
  const choose = async (c: string) => {
    if (!onChoose || busy || picked) return;
    setBusy(true); setErr("");
    try { await onChoose(c); setPicked(c); }
    catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };
  return (
    <article className={`ar${className ? ` ${className}` : ""}`} data-agent-reply>
      <style>{css}</style>
      {!bare && <div className="ar-av" aria-hidden="true">{avatar}</div>}
      <div className="ar-main">
        {!bare && <div className="ar-head"><span className="ar-name">{agent}</span>{time && <span className="ar-time">{time}</span>}</div>}
        {summary && <div className="ar-sum">{summary}</div>}
        {findings.length > 0 && (
          <Section title={L.findings} tone="var(--ar-blue)" count={findings.length} folded={findings.length > 6}>
            <ul>{findings.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </Section>
        )}
        {proposal && <Section title={L.proposal} tone="var(--ar-green)"><p>{proposal}</p></Section>}
        {sections.map((s, i) => (
          <Section key={`${i}-${s.title}`} title={s.title} kind={s.kind} tone={tones[s.tone ?? "muted"]} count={s.count} folded={s.folded}>
            {s.content}
          </Section>
        ))}
        {outputs.length > 0 && (
          <div className="ar-sec">
            <b className="ar-h" style={{ "--tone": "var(--ar-blue)", cursor: "default" } as React.CSSProperties}>{L.outputs}</b>
            <div className="ar-outs">
              {outputs.map((o) => (
                <button key={o.label} type="button" className="ar-out" title={o.href ?? o.label} onClick={() => onOpenOutput?.(o)}>
                  {outIcon[o.kind ?? "file"]}<span>{o.label}</span><em>{L.open}</em>
                </button>
              ))}
            </div>
          </div>
        )}
        {children}
        {choices.length > 0 && (
          <div className="ar-ch" role="group" aria-label={L.choices}>
            <b>{L.choices}</b>
            <div className="ar-opts">
              {choices.map((c) => (
                <button key={c} type="button" className={`ar-opt${picked && picked !== c ? " dim" : ""}`}
                  aria-pressed={picked === c} disabled={!onChoose || busy || !!picked} onClick={() => void choose(c)}>{c}</button>
              ))}
            </div>
            {!picked && onChoose && (
              <form className="ar-own" onSubmit={(e) => { e.preventDefault(); if (own.trim()) void choose(own.trim()); }}>
                <input value={own} onChange={(e) => setOwn(e.target.value)} disabled={busy} placeholder={L.own} aria-label={L.own} />
                <button type="submit" disabled={busy || !own.trim()}>{L.send}</button>
              </form>
            )}
            {picked && <span className="ar-ok" role="status">✓ «{picked}» — {typeof L.answered === "function" ? L.answered(picked) : L.answered}</span>}
            {err && <span className="ar-err" role="alert">{err}</span>}
          </div>
        )}
        {sources.length > 0 && (
          <Section title={L.sources} tone="var(--ar-mu)" count={sources.length} folded>
            <ul className="ar-src">{sources.map((s) => <li key={s.label}>{s.href ? <a href={s.href}>{s.label}</a> : s.label}</li>)}</ul>
          </Section>
        )}
      </div>
    </article>
  );
}

export default function Demo() {
  return (
    <AgentReply
      agent="Project agent"
      avatar="📁"
      time="03:07"
      summary={<>Hero direction is written into the project note. You picked <b>v4a</b> earlier, but the <b>v4c</b> task is still open — which one is final?</>}
      findings={[
        <>v4a keeps the hero on a dark field with a pale accent <code>#E4E9F5</code> on the headline.</>,
        <>v4c (brand tokens, paper background) was logged as decided in <code>Inai Website.md</code>, and a worker still has it claimed.</>,
        <>The sources <code>platform.html</code> and <code>site.css</code> are unchanged.</>,
      ]}
      proposal="Close the v4c task and ship v4a; keep v4c tokens as the light theme for later."
      outputs={[
        { label: "page.html", kind: "site" },
        { label: "Hero direction.md", kind: "doc" },
        { label: "hero-v4a@2x.png", kind: "image" },
      ]}
      choices={["Make v4a final", "Keep v4c"]}
      sources={[
        { label: "projects/website/brief.md" },
        { label: "projects/website/output/page.html" },
      ]}
      onChoose={() => new Promise((r) => setTimeout(r, 400))}
    />
  );
}
