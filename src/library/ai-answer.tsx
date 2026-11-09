"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type AnswerSource = {
  id: string;
  provider: string;
  title: string;
  url?: string;
  icon?: React.ReactNode;
};

/** Inline answer content: plain text, bold, or a citation chip. */
export type AnswerPart =
  | string
  | { bold: string }
  | { cite: string[] };

export type AnswerBlock =
  | { kind: "p"; parts: AnswerPart[] }
  | { kind: "list"; items: AnswerPart[][] };

export type AIAnswerProps = {
  question?: string;
  sources?: AnswerSource[];
  answer?: AnswerBlock[];
  related?: string[];
  /** Seconds shown in the footer once streaming ends. */
  answeredIn?: number;
  /** Characters revealed per tick while streaming. */
  speed?: number;
  className?: string;
  onAction?: (
    action: "copy" | "regenerate" | "like" | "dislike" | "related" | "source",
    value?: string,
  ) => void;
};

const icons: Record<string, React.ReactNode> = {
  Notion: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="#fff" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 11.5v-7h1.2l3.6 7H11v-7" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  Slack: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="5" width="7" height="3" rx="1.5" fill="#36c5f0" />
      <rect x="8" y="1" width="3" height="7" rx="1.5" fill="#2eb67d" />
      <rect x="8" y="8" width="7" height="3" rx="1.5" fill="#ecb22e" />
      <rect x="5" y="8" width="3" height="7" rx="1.5" fill="#e01e5a" />
    </svg>
  ),
  Wikipedia: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m2 4 3.5 8L8 6l2.5 6L14 4M1 4h3m2 0h4m2 0h3" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
};

const defaultSources: AnswerSource[] = [
  { id: "notion", provider: "Notion", title: "Offsite plan – shortlist and budget" },
  { id: "slack", provider: "Slack", title: "#team-offsite – who can make which dates" },
  { id: "wiki", provider: "Wikipedia", title: "Alfama – the oldest district of Lisbon" },
  { id: "airbnb", provider: "Airbnb", title: "Two linked houses in Alfama" },
  { id: "hotel", provider: "Booking", title: "Hotel quote for 12 guests" },
  { id: "flights", provider: "Google Flights", title: "Berlin and Munich to Lisbon" },
];

const defaultAnswer: AnswerBlock[] = [
  {
    kind: "p",
    parts: [
      { bold: "Alfama" },
      " is the best fit for the 12-person offsite: walkable, quiet in the mornings and inside the budget you set ",
      { cite: ["notion", "wiki"] },
      ".",
    ],
  },
  {
    kind: "list",
    items: [
      [{ bold: "Dates:" }, " 14–16 May works for everyone, Jonas joins on day two ", { cite: ["slack"] }, "."],
      [
        { bold: "Stay:" },
        " two linked houses in Alfama come to €2,880 for three nights, about 20% less than the hotel ",
        { cite: ["airbnb", "hotel"] },
        ".",
      ],
      [
        { bold: "Flights:" },
        " direct flights from Berlin and Munich land before 10:30, so day one can start after lunch ",
        { cite: ["flights"] },
        ".",
      ],
    ],
  },
  {
    kind: "p",
    parts: ["Book the houses this week – only one May weekend is still free ", { cite: ["airbnb"] }, "."],
  },
];

const partLength = (p: AnswerPart) =>
  typeof p === "string" ? p.length : "bold" in p ? p.bold.length : 1;

export function AIAnswer({
  question = "Where should we hold the team offsite in Lisbon?",
  sources = defaultSources,
  answer = defaultAnswer,
  related = ["Compare the houses with the hotel", "Draft a three-day agenda"],
  answeredIn = 5.9,
  speed = 3,
  className = "",
  onAction,
}: AIAnswerProps) {
  const total = React.useMemo(
    () =>
      answer.reduce(
        (n, b) =>
          n +
          (b.kind === "p"
            ? b.parts.reduce((m, p) => m + partLength(p), 0)
            : b.items.reduce((m, it) => m + it.reduce((k, p) => k + partLength(p), 0), 0)),
        0,
      ),
    [answer],
  );
  const [shown, setShown] = React.useState(0);
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(null);
  const [copied, setCopied] = React.useState(false);
  const done = shown >= total;

  React.useEffect(() => {
    if (done) return;
    const id = window.setTimeout(() => setShown((n) => Math.min(total, n + speed)), 16);
    return () => window.clearTimeout(id);
  }, [shown, total, speed, done]);

  const byId = (id: string) => sources.find((s) => s.id === id);
  const visible = sources.slice(0, 3);
  const extra = sources.length - visible.length;

  let budget = shown;
  const renderParts = (parts: AnswerPart[]) =>
    parts.map((p, i) => {
      if (budget <= 0) return null;
      if (typeof p === "string" || "bold" in p) {
        const text = typeof p === "string" ? p : p.bold;
        const slice = text.slice(0, budget);
        budget -= text.length;
        return typeof p === "string" ? <React.Fragment key={i}>{slice}</React.Fragment> : <strong key={i}>{slice}</strong>;
      }
      budget -= 1;
      const first = byId(p.cite[0]);
      return (
        <button
          key={i}
          type="button"
          className="aa-cite"
          title={p.cite.map((c) => byId(c)?.title).filter(Boolean).join("\n")}
          onClick={() => onAction?.("source", p.cite[0])}
        >
          {first?.provider ?? p.cite[0]}
          {p.cite.length > 1 && ` +${p.cite.length - 1}`}
        </button>
      );
    });

  const plain = answer
    .map((b) =>
      (b.kind === "p" ? [b.parts] : b.items)
        .map((ps) => ps.map((p) => (typeof p === "string" ? p : "bold" in p ? p.bold : "")).join(""))
        .join("\n"),
    )
    .join("\n\n");

  return (
    <section className={`aa ${className}`}>
      <style>{css}</style>
      <div className="aa-body">
        <h3 className="aa-q">{question}</h3>
        <div className="aa-sources">
          {visible.map((s, i) => (
            <button key={s.id} type="button" className="aa-src" onClick={() => onAction?.("source", s.id)}>
              <span className="aa-src-top">
                <span className="aa-ico">{s.icon ?? icons[s.provider] ?? s.provider[0]}</span>
                {s.provider}
                <span className="aa-num">{i + 1}</span>
              </span>
              <span className="aa-src-title">{s.title}</span>
            </button>
          ))}
          {extra > 0 && (
            <button type="button" className="aa-src aa-more">
              <strong>+{extra}</strong>
              <span>more</span>
            </button>
          )}
        </div>
        <div className="aa-label">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 1.5 7.2 5 10.5 6 7.2 7 6 10.5 4.8 7 1.5 6 4.8 5ZM12 9l.7 1.8 1.8.7-1.8.7L12 14l-.7-1.8-1.8-.7 1.8-.7Z" fill="currentColor" />
          </svg>
          Answer
        </div>
        <div className="aa-prose" aria-busy={!done}>
          {answer.map((b, i) =>
            b.kind === "p" ? (
              budget > 0 ? <p key={i}>{renderParts(b.parts)}</p> : null
            ) : budget > 0 ? (
              <ul key={i}>
                {b.items.map((it, j) => (budget > 0 ? <li key={j}>{renderParts(it)}</li> : null))}
              </ul>
            ) : null,
          )}
        </div>
        {done && related.length > 0 && (
          <div className="aa-related">
            <div className="aa-related-h">Related</div>
            {related.map((r) => (
              <button key={r} type="button" onClick={() => onAction?.("related", r)}>
                {r}
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
      <footer className="aa-foot">
        <button
          type="button"
          aria-label={copied ? "Copied" : "Copy"}
          onClick={() => {
            navigator.clipboard?.writeText(plain).catch(() => {});
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
            onAction?.("copy");
          }}
        >
          {copied ? (
            <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 16 16"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="currentColor" /><path d="M3 10.5V3.5A1 1 0 0 1 4 2.5h6.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
          )}
        </button>
        <button type="button" aria-label="Regenerate" onClick={() => { setShown(0); setFeedback(null); onAction?.("regenerate"); }}>
          <svg viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        </button>
        <button type="button" aria-label="Good answer" aria-pressed={feedback === "like"} onClick={() => { setFeedback("like"); onAction?.("like"); }}>
          <svg viewBox="0 0 16 16"><path d="M2 7h2.5v7H2zM6 14h5.5a1.5 1.5 0 0 0 1.5-1.2l.9-4.3A1.5 1.5 0 0 0 12.4 6.7H9.5l.5-2.6A1.4 1.4 0 0 0 7.4 3.2L6 6.5Z" fill="currentColor" /></svg>
        </button>
        <button type="button" aria-label="Bad answer" aria-pressed={feedback === "dislike"} onClick={() => { setFeedback("dislike"); onAction?.("dislike"); }}>
          <svg viewBox="0 0 16 16" style={{ transform: "rotate(180deg)" }}><path d="M2 7h2.5v7H2zM6 14h5.5a1.5 1.5 0 0 0 1.5-1.2l.9-4.3A1.5 1.5 0 0 0 12.4 6.7H9.5l.5-2.6A1.4 1.4 0 0 0 7.4 3.2L6 6.5Z" fill="currentColor" /></svg>
        </button>
        <span className="aa-time">{done ? `Answered in ${answeredIn}s` : "Answering…"}</span>
      </footer>
    </section>
  );
}

const css = `
.aa{--aa-bg:#fff;--aa-fg:#18181b;--aa-muted:#71717a;--aa-faint:#a1a1aa;--aa-line:#e9e9ec;--aa-chip:#f1f1f3;--aa-accent:#4f7cf0;width:100%;max-width:730px;background:var(--aa-bg);color:var(--aa-fg);border:1px solid var(--aa-line);border-radius:14px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.6 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .aa{--aa-bg:#1b1b1e;--aa-fg:#ececef;--aa-muted:#a1a1aa;--aa-faint:#71717a;--aa-line:#2e2e33;--aa-chip:#2a2a2f;--aa-accent:#7c9cff;color-scheme:dark}
.aa *{box-sizing:border-box}.aa button{font:inherit;color:inherit;cursor:pointer}
.aa-body{padding:22px 26px 6px}
.aa-q{margin:0 0 14px;font-size:16px;font-weight:500;letter-spacing:-.01em}
.aa-sources{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) auto;gap:8px;margin-bottom:20px}
.aa-src{display:flex;flex-direction:column;gap:6px;text-align:left;padding:10px 12px;border:1px solid var(--aa-line);border-radius:10px;background:var(--aa-bg);box-shadow:0 1px 2px #00000008;transition:border-color .15s,transform .15s;min-width:0}
.aa-src:hover{border-color:color-mix(in srgb,var(--aa-fg) 22%,transparent)}
.aa-src-top{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--aa-muted)}
.aa-ico{display:grid;place-items:center;width:14px;height:14px;flex:none;font-size:10px;font-weight:600}.aa-ico svg{width:14px;height:14px}
.aa-num{margin-left:auto;font-size:12px;color:var(--aa-faint)}
.aa-src-title{font-size:14px;font-weight:500;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.aa-more{justify-content:space-between;min-width:66px}.aa-more strong{font-weight:500}.aa-more span{color:var(--aa-muted)}
.aa-label{display:flex;align-items:center;gap:8px;color:var(--aa-muted);margin-bottom:6px}.aa-label svg{width:17px;height:17px;color:var(--aa-accent)}
.aa-prose p{margin:0 0 10px}.aa-prose ul{margin:0 0 10px;padding-left:24px}.aa-prose li{margin:0 0 6px}.aa-prose li::marker{color:var(--aa-faint)}.aa-prose strong{font-weight:600}
.aa-cite{display:inline-flex;align-items:center;margin-left:4px;padding:0 7px;height:22px;vertical-align:1px;border:0;border-radius:6px;background:var(--aa-chip);font-size:12px!important;color:var(--aa-muted)!important;transition:background .15s}
.aa-cite:hover{background:color-mix(in srgb,var(--aa-fg) 12%,transparent)}
.aa-related{margin:16px 0 8px}.aa-related-h{font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--aa-muted);padding-bottom:6px;border-bottom:1px solid var(--aa-line)}
.aa-related button{display:flex;width:100%;align-items:center;justify-content:space-between;padding:10px 0;border:0;border-bottom:1px solid var(--aa-line);background:none;text-align:left;animation:aa-in .3s both}
.aa-related button:last-child{border-bottom:0}.aa-related svg{width:16px;height:16px;color:var(--aa-faint)}.aa-related button:hover svg{color:var(--aa-fg)}
.aa-foot{display:flex;align-items:center;gap:4px;padding:10px 14px;border-top:1px solid var(--aa-line)}
.aa-foot button{display:grid;place-items:center;width:30px;height:30px;border:0;border-radius:7px;background:none;color:var(--aa-muted)}
.aa-foot button:hover,.aa-foot button[aria-pressed=true]{background:var(--aa-chip);color:var(--aa-fg)}.aa-foot svg{width:16px;height:16px}
.aa-time{margin-left:auto;font-size:13px;color:var(--aa-muted)}
.aa :focus-visible{outline:2px solid var(--aa-accent);outline-offset:2px}
@keyframes aa-in{from{opacity:0;transform:translateY(4px)}}
@media(max-width:560px){.aa-body{padding:18px 16px 4px}.aa-sources{grid-template-columns:repeat(2,minmax(0,1fr))}.aa-more{display:none}}
@media(prefers-reduced-motion:reduce){.aa *{animation:none!important;transition:none!important}}
`;

export default AIAnswer;
