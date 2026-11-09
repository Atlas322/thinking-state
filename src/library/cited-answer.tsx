"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type CitedSegment = { text: string; cite?: string[]; paragraph?: boolean };

export type CitedSource = {
  id: string;
  title: string;
  site: string;
  url?: string;
  date?: string;
  quote?: string;
  /** Words inside quote that match the answer. */
  highlight?: string;
  icon?: React.ReactNode;
};

export type CitedAnswerProps = {
  segments?: CitedSegment[];
  sources?: CitedSource[];
  pagesRead?: number;
  defaultOpen?: string;
  onOpenSource?: (source: CitedSource) => void;
  onPreviewChange?: (id: string | null) => void;
  action?: { label: string; onClick: () => void };
  className?: string;
};

const defaultSources: CitedSource[] = [
  {
    id: "tokenwise",
    title: "Prompt caching, explained",
    site: "tokenwise.dev",
    date: "Jul 18, 2026",
    url: "https://example.com/tokenwise",
    quote:
      "Providers reuse the processed prefix of a prompt. On prompts over 10K tokens that can cut time to first token by up to 80%.",
    highlight: "cut time to first token by up to 80%",
  },
  {
    id: "latency",
    title: "Designing cache-friendly prompts",
    site: "latencynotes.io",
    date: "Aug 2, 2026",
    url: "https://example.com/latency",
    quote:
      "Keep the stable part – system prompt, tool definitions, long documents – at the very start, and put anything that changes per request after it. A single changed character early on invalidates everything behind it.",
    highlight: "at the very start",
  },
  {
    id: "weekly",
    title: "Semantic caches in production",
    site: "inferenceweekly.com",
    date: "Sep 9, 2026",
    url: "https://example.com/weekly",
    quote:
      "Close matches were answered from the cache in about 40 ms, covering nearly a third of FAQ-style traffic.",
    highlight: "about 40 ms",
  },
];

const defaultSegments: CitedSegment[] = [
  {
    text: "The biggest win is prompt caching: the provider reuses the processed start of your prompt, so a long system prompt isn't recomputed on every call.",
    cite: ["tokenwise"],
  },
  { text: " On prompts over 10K tokens that can cut time to first token by up to 80%.", cite: ["tokenwise"] },
  {
    text: " It only works while that start stays identical, so put the system prompt, tools and long documents first and anything that changes per request last.",
    cite: ["latency", "tokenwise"],
  },
  {
    text: "For repeated questions, add a semantic cache in front of the model: close matches get a stored answer in about 40 ms,",
    cite: ["weekly"],
    paragraph: true,
  },
  { text: " which covered nearly a third of FAQ-style traffic in one production setup.", cite: ["weekly"] },
  { text: " Stream the rest, so people see the first words while the answer is still being written." },
];

const tints = ["#eef0f3", "#e3f4e8", "#e6f1fb", "#fbefe3", "#f1e8fb"];
const inks = ["#71717a", "#2f8a4d", "#3b7dc4", "#b8701f", "#7a4fc0"];

function Mark({ quote, highlight }: { quote: string; highlight?: string }) {
  const i = highlight ? quote.indexOf(highlight) : -1;
  if (!highlight || i < 0) return <>{quote}</>;
  return (
    <>
      {quote.slice(0, i)}
      <mark>{highlight}</mark>
      {quote.slice(i + highlight.length)}
    </>
  );
}

export function CitedAnswer({
  segments = defaultSegments,
  sources = defaultSources,
  pagesRead = 12,
  defaultOpen,
  onOpenSource,
  onPreviewChange,
  action = { label: "Follow up", onClick: () => {} },
  className = "",
}: CitedAnswerProps) {
  const [hover, setHover] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<string | null>(defaultOpen ?? null);
  const [copied, setCopied] = React.useState(false);
  const active = hover ?? open;
  const idx = (id: string) => sources.findIndex((s) => s.id === id);
  const openSrc = sources.find((s) => s.id === open);
  const activeSrc = sources.find((s) => s.id === active);
  const citedIn = (id: string) => segments.filter((s) => s.cite?.[0] === id || s.cite?.includes(id)).length;

  const toggle = (id: string) => {
    const next = open === id ? null : id;
    setOpen(next);
    onPreviewChange?.(next);
  };

  const paragraphs: CitedSegment[][] = [];
  segments.forEach((s, i) => {
    if (i === 0 || s.paragraph) paragraphs.push([]);
    paragraphs[paragraphs.length - 1].push(s);
  });

  const Badge = ({ id, size = "s" }: { id: string; size?: "s" | "m" }) => {
    const n = idx(id);
    const src = sources[n];
    return (
      <span
        className={`ca-badge ca-badge-${size}`}
        style={{ background: tints[n % tints.length], color: inks[n % inks.length] }}
        aria-hidden="true"
      >
        {src?.icon ?? src?.title.replace(/^.*?(\w).*$/, "$1") ?? "?"}
      </span>
    );
  };

  const initial = (s: CitedSource) => s.site.charAt(0).toUpperCase();

  return (
    <section className={`ca ${active ? "ca-focus" : ""} ${className}`}>
      <style>{css}</style>
      <div className="ca-body">
        <div className="ca-head">
          <span className="ca-stack">
            {sources.map((s, n) => (
              <span key={s.id} className="ca-badge ca-badge-s" style={{ background: tints[n % tints.length], color: inks[n % inks.length] }}>
                {s.icon ?? initial(s)}
              </span>
            ))}
          </span>
          {sources.length} sources{pagesRead ? ` · ${pagesRead} pages read` : ""}
        </div>
        <div className="ca-prose">
          {paragraphs.map((p, i) => (
            <p key={i}>
              {p.map((s, j) => {
                const lit = !!active && !!s.cite?.includes(active);
                const lead = s.text.match(/^\s*/)?.[0] ?? "";
                const body = s.text.slice(lead.length);
                return (
                  <React.Fragment key={j}>
                    {lead}
                    <span className={`ca-seg ${lit ? "lit" : ""}`}>{body}</span>
                    {s.cite?.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`ca-num ${active === c ? "on" : ""}`}
                        aria-label={`Source ${idx(c) + 1}: ${sources[idx(c)]?.title ?? c}`}
                        onMouseEnter={() => setHover(c)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(c)}
                        onBlur={() => setHover(null)}
                        onClick={() => toggle(c)}
                      >
                        {idx(c) + 1}
                      </button>
                    ))}
                  </React.Fragment>
                );
              })}
            </p>
          ))}
        </div>
        <div className="ca-chips">
          {sources.map((s, n) => (
            <button
              key={s.id}
              type="button"
              className={`ca-chip ${active === s.id ? "on" : ""}`}
              aria-expanded={open === s.id}
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(s.id)}
              onBlur={() => setHover(null)}
              onClick={() => toggle(s.id)}
            >
              <span className="ca-badge ca-badge-s" style={{ background: tints[n % tints.length], color: inks[n % inks.length] }}>
                {s.icon ?? initial(s)}
              </span>
              {s.site.replace(/\.(io|dev|com|org|net)$/, "").replace(/^(\w)/, (m) => m.toUpperCase()).replace("notes", " Notes").replace("weekly", " Weekly")}
              <span className="ca-chip-n">{n + 1}</span>
            </button>
          ))}
        </div>
        {openSrc && (
          <div className="ca-preview" role="region" aria-label={openSrc.title}>
            <div className="ca-pv-meta">
              <Badge id={openSrc.id} />
              <span>{openSrc.site}</span>
              {openSrc.date && <span className="ca-faint">· {openSrc.date}</span>}
              <span className="ca-pv-n">{idx(openSrc.id) + 1}</span>
            </div>
            <div className="ca-pv-title">{openSrc.title}</div>
            {openSrc.quote && (
              <p className="ca-pv-quote">
                <Mark quote={openSrc.quote} highlight={openSrc.highlight} />
              </p>
            )}
            <div className="ca-pv-actions">
              <a
                href={openSrc.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (onOpenSource) {
                    e.preventDefault();
                    onOpenSource(openSrc);
                  }
                }}
              >
                Open source
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5h6.5V10M12.5 3.5 4 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(openSrc.quote ?? "").catch(() => {});
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1400);
                }}
              >
                {copied ? "Copied" : "Copy quote"}
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="ca-foot">
        <span className="ca-foot-l">
          {activeSrc ? (
            <>
              {activeSrc.site.replace(/\.(io|dev|com)$/, "").replace(/^(\w)/, (m) => m.toUpperCase()).replace("notes", " Notes").replace("weekly", " Weekly")}
              <span className="ca-faint"> · cited in {citedIn(activeSrc.id)} sentence{citedIn(activeSrc.id) === 1 ? "" : "s"}</span>
            </>
          ) : (
            <span className="ca-faint">Hover a number to see its source</span>
          )}
        </span>
        {action && (
          <button type="button" className="ca-action" onClick={action.onClick}>
            {action.label}
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </footer>
    </section>
  );
}

const css = `
.ca{--ca-bg:#fff;--ca-fg:#18181b;--ca-muted:#71717a;--ca-faint:#a1a1aa;--ca-line:#ececef;--ca-chip:#f4f4f5;--ca-lit:#e8f1fd;--ca-accent:#3b82f6;--ca-mark:#fdf0b8;width:100%;max-width:442px;background:var(--ca-bg);color:var(--ca-fg);border:1px solid var(--ca-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.57 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .ca{--ca-bg:#1b1b1e;--ca-fg:#ececef;--ca-muted:#a1a1aa;--ca-faint:#71717a;--ca-line:#2e2e33;--ca-chip:#2a2a2f;--ca-lit:#1d3150;--ca-accent:#6aa3ff;--ca-mark:#5a4a12;color-scheme:dark}
.ca *{box-sizing:border-box}.ca button{font:inherit;color:inherit;cursor:pointer}
.ca-body{padding:14px 20px 16px}
.ca-head{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ca-muted);margin-bottom:12px}
.ca-stack{display:flex}.ca-stack .ca-badge{margin-right:-2px;box-shadow:0 0 0 1.5px var(--ca-bg)}
.ca-badge{display:inline-grid;place-items:center;width:14px;height:14px;border-radius:3px;font-size:8.5px;font-weight:600;flex:none}
.ca-prose p{margin:0 0 10px}.ca-prose p:last-child{margin:0}
.ca-seg{transition:color .2s,background .2s;border-radius:3px}
.ca-focus .ca-seg{color:var(--ca-faint)}
.ca-focus .ca-seg.lit{color:var(--ca-fg);background:var(--ca-lit);box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:1px 2px;margin:0 -2px}
.ca-num{display:inline-grid;place-items:center;min-width:15px;height:15px;margin:0 2px 0 3px;padding:0 3px;vertical-align:1px;border:0;border-radius:3px;background:var(--ca-chip);font-size:10px!important;line-height:1;color:var(--ca-muted)!important;transition:background .15s}
.ca-num:hover,.ca-num.on{background:color-mix(in srgb,var(--ca-fg) 16%,transparent);color:var(--ca-fg)!important}
.ca-chips{display:flex;flex-wrap:nowrap;gap:4px;margin-top:16px;margin-left:-6px;overflow:hidden}
.ca-chip{display:inline-flex;align-items:center;gap:7px;flex:0 1 auto;min-width:0;white-space:nowrap;height:28px;padding:0 8px 0 6px;border:1px solid transparent;border-radius:6px;background:none;font-size:12.5px!important;color:var(--ca-muted)!important;transition:background .15s,border-color .15s,color .15s}
.ca-focus .ca-chip{color:var(--ca-faint)!important}
.ca-chip:hover,.ca-chip.on,.ca-focus .ca-chip.on{background:var(--ca-chip);border-color:var(--ca-line);color:var(--ca-fg)!important}
.ca-chip-n{font-size:10.5px;color:var(--ca-faint)}
.ca-preview{margin-top:10px;padding:12px 14px;border:1px solid var(--ca-line);border-radius:10px;background:color-mix(in srgb,var(--ca-chip) 45%,var(--ca-bg));animation:ca-in .2s both}
.ca-pv-meta{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ca-muted)}
.ca-pv-n{margin-left:auto;font-size:11px;color:var(--ca-faint)}
.ca-pv-title{font-weight:500;margin:6px 0 4px}
.ca-pv-quote{margin:0;font-size:13px;color:var(--ca-muted);line-height:1.55}
.ca-pv-quote mark{background:var(--ca-mark);color:var(--ca-fg);border-radius:2px;padding:0 1px}
.ca-pv-actions{display:flex;gap:6px;margin-top:10px}
.ca-pv-actions a,.ca-pv-actions button{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;border:1px solid var(--ca-line);border-radius:6px;background:var(--ca-bg);font-size:12px;color:var(--ca-fg);text-decoration:none}
.ca-pv-actions svg{width:12px;height:12px}
.ca-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 8px 8px 20px;border-top:1px solid var(--ca-line);font-size:12.5px}
.ca-foot-l{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ca-faint{color:var(--ca-faint)}
.ca-action{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 10px;border:1px solid var(--ca-line);border-radius:7px;background:var(--ca-bg);font-size:13.5px!important;font-weight:500;box-shadow:0 1px 1px #00000008}
.ca-action:hover{background:var(--ca-chip)}.ca-action svg{width:14px;height:14px;color:var(--ca-muted)}
.ca :focus-visible{outline:2px solid var(--ca-accent);outline-offset:2px}
@keyframes ca-in{from{opacity:0;transform:translateY(-3px)}}
@media(max-width:480px){.ca-body{padding:12px 16px 14px}.ca-foot{padding-left:16px}}
@media(prefers-reduced-motion:reduce){.ca *{animation:none!important;transition:none!important}}
`;

export default CitedAnswer;
