"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type StreamAgent = {
  id: string;
  name: string;
  color: string;
  /** Nine 0/1 cells of the 3x3 mark, read row by row. */
  mark?: number[];
};

export type StreamFile = {
  name: string;
  kind?: "folder" | "file" | "figma" | "link";
};

export type StreamDetails = {
  meta?: [label: string, value: string][];
  items?: { title: string; detail?: string; kind?: StreamFile["kind"] | "tool" }[];
};

/** Inline message content: text or a brand mention. */
export type StreamPart = string | { brand: "figma" | "notion" | "stripe"; text: string } | { bold: string };

export type StreamMessage = {
  id: string;
  from: string;
  to?: string;
  time?: string;
  /** "event" renders a one-line system note; "writing" renders a live draft. */
  kind?: "message" | "handoff" | "question" | "event" | "writing";
  text?: StreamPart[] | string;
  /** The message this one answers, shown as a quote above the text. */
  quote?: string;
  files?: StreamFile[];
  tools?: string[];
  details?: StreamDetails;
};

export type CollaborationStreamProps = {
  agents?: StreamAgent[];
  messages?: StreamMessage[];
  /** Id of the person using the stream. */
  you?: string;
  live?: boolean;
  filter?: string;
  defaultFilter?: string;
  onFilterChange?: (filter: string) => void;
  onSend?: (message: { text: string; to?: string }) => void;
  onOpenFile?: (file: StreamFile, message: StreamMessage) => void;
  placeholder?: string;
  className?: string;
};

const defaultAgents: StreamAgent[] = [
  { id: "you", name: "You", color: "#1f1f1f", mark: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { id: "researcher", name: "Researcher", color: "#8a63f3", mark: [1, 0, 1, 0, 1, 0, 1, 0, 1] },
  { id: "writer", name: "Writer", color: "#2b9fd8", mark: [1, 1, 1, 0, 0, 0, 1, 1, 1] },
  { id: "orchestrator", name: "Orchestrator", color: "#3d6ff0", mark: [0, 0, 0, 1, 1, 1, 1, 1, 1] },
  { id: "coder", name: "Coder", color: "#e2892f", mark: [1, 0, 1, 0, 1, 0, 1, 0, 1] },
];

const defaultMessages: StreamMessage[] = [
  {
    id: "m1",
    from: "you",
    to: "orchestrator",
    time: "14:02",
    text: "Launch the new pricing page by Friday – per-seat plans, keep a free tier.",
  },
  { id: "e1", from: "orchestrator", to: "researcher", kind: "event" },
  { id: "e2", from: "orchestrator", to: "writer", kind: "event" },
  {
    id: "m2",
    from: "researcher",
    to: "orchestrator",
    time: "14:04",
    quote: "Find out what Linear, Notion and Figma charge per seat, and what their free tiers allow.",
    text: [{ bold: "Linear $10" }, ", ", { brand: "notion", text: "Notion $12" }, ", ", { brand: "figma", text: "Figma $15" }, " per seat. All three keep a free tier."],
    tools: ["web_search ×6"],
    files: [{ name: "pricing-table.csv" }],
    details: {
      meta: [["Model", "Gemini 3.8 Flash"], ["Tokens", "41.2k"], ["Cost", "$0.02"], ["Took", "1m 48s"]],
      items: [
        { title: "web_search", detail: "6 searches – per-seat pricing 2026", kind: "tool" },
        { title: "notion.com/pricing", detail: "Plus $12 · Business $18 per seat", kind: "link" },
        { title: "figma.com/pricing", detail: "Professional $15 per editor", kind: "link" },
        { title: "linear.app/pricing", detail: "Basic $10 per user", kind: "link" },
      ],
    },
  },
  {
    id: "m3",
    from: "writer",
    to: "orchestrator",
    time: "14:04",
    kind: "question",
    quote: "Draft the copy for Free, Pro and Team – short, one line per plan.",
    text: "Do any of them cap seats on the free tier? I'd like to say ours doesn't.",
  },
  {
    id: "m4",
    from: "researcher",
    to: "writer",
    time: "14:05",
    text: ["None cap seats – ", { brand: "notion", text: "Notion" }, " limits guests to 10, Linear caps issues at 250."],
  },
  {
    id: "m5",
    from: "writer",
    to: "orchestrator",
    time: "14:06",
    quote: "Draft the copy for Free, Pro and Team – short, one line per plan.",
    text: ["Copy for the three plans is ready in ", { brand: "notion", text: "Notion" }, " – Free says “no seat limit”."],
    files: [{ name: "plans-copy.md" }],
  },
  { id: "e3", from: "orchestrator", to: "coder", kind: "event" },
  {
    id: "m6",
    from: "orchestrator",
    to: "coder",
    time: "14:06",
    kind: "handoff",
    text: ["Here's everything you need – copy, prices and the ", { brand: "figma", text: "Figma" }, " frames."],
    files: [
      { name: "src/billing/", kind: "folder" },
      { name: "plans-copy.md" },
      { name: "pricing-table.csv" },
      { name: "Pricing / Desktop", kind: "link" },
    ],
    details: {
      meta: [["From", "Orchestrator"], ["To", "Coder"], ["Context", "18.4k tokens"]],
      items: [
        { title: "Pricing / Desktop", detail: "Figma – 3 frames", kind: "figma" },
        { title: "plans-copy.md", detail: "Notion – Launch / Pricing copy", kind: "file" },
        { title: "feat/pricing-page", detail: "GitHub – branch to build on", kind: "folder" },
      ],
    },
  },
  {
    id: "m7",
    from: "coder",
    to: "writer",
    time: "14:09",
    text: "The Team line is two lines too long for its card – can you cut it?",
  },
  {
    id: "m8",
    from: "writer",
    to: "coder",
    time: "14:09",
    text: "“Everything, together – for teams of 3 and more.”",
  },
  {
    id: "m9",
    from: "coder",
    to: "you",
    kind: "writing",
    quote: "Launch the new pricing page by Friday – per-seat plans, keep a free tier.",
    details: {
      meta: [["Model", "Opus 5.5"], ["Waiting", "2m"], ["Holds", "Deploy"]],
      items: [
        { title: "price_team_12", detail: "Stripe – $12 per seat, test mode", kind: "file" },
        { title: "price_team_15", detail: "Stripe – $15 per seat, test mode", kind: "file" },
      ],
    },
  },
];

function Mark({ agent, size = 12 }: { agent?: StreamAgent; size?: number }) {
  const cells = agent?.mark ?? [1, 0, 1, 0, 1, 0, 1, 0, 1];
  return (
    <svg className="cs-mark" viewBox="0 0 12 12" width={size} height={size} aria-hidden="true">
      {cells.map((on, i) => (
        <rect
          key={i}
          x={(i % 3) * 4 + 0.5}
          y={Math.floor(i / 3) * 4 + 0.5}
          width="3"
          height="3"
          rx=".6"
          fill={agent?.color ?? "currentColor"}
          opacity={on ? 1 : 0.18}
        />
      ))}
    </svg>
  );
}

const brandIcon = {
  figma: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="cs-brand">
      <circle cx="10" cy="8" r="2.5" fill="#1abcfe" />
      <path d="M3.5 13A2.5 2.5 0 0 1 6 10.5h2.5V13a2.5 2.5 0 1 1-5 0Z" fill="#0acf83" />
      <path d="M3.5 8A2.5 2.5 0 0 1 6 5.5h2.5v5H6A2.5 2.5 0 0 1 3.5 8Z" fill="#a259ff" />
      <path d="M3.5 3A2.5 2.5 0 0 1 6 .5h2.5v5H6A2.5 2.5 0 0 1 3.5 3Z" fill="#f24e1e" />
      <path d="M8.5.5H11a2.5 2.5 0 0 1 0 5H8.5Z" fill="#ff7262" />
    </svg>
  ),
  notion: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="cs-brand">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="#fff" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 11.5v-7h1.2l3.6 7H11v-7" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="cs-brand">
      <rect x="1" y="1" width="14" height="14" rx="3" fill="#635bff" />
      <path d="M9.9 6.1c-.5-.3-1.1-.5-1.7-.5-.5 0-.8.2-.8.5 0 .9 3 .5 3 2.7 0 1.2-1 1.9-2.4 1.9-.7 0-1.4-.2-2-.5V8.9c.6.3 1.3.6 2 .6.5 0 .8-.2.8-.5 0-1-3-.6-3-2.7 0-1.1.9-1.9 2.3-1.9.6 0 1.2.1 1.8.4Z" fill="#fff" />
    </svg>
  ),
};

function FileIcon({ kind = "file" }: { kind?: string }) {
  if (kind === "figma") return brandIcon.figma;
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      {kind === "folder" ? (
        <path d="M2 4.5c0-.6.4-1 1-1h3l1.5 1.5H13c.6 0 1 .4 1 1V12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1Z" />
      ) : kind === "link" ? (
        <path d="M6.5 9.5 9.5 6.5M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      ) : kind === "tool" ? (
        <path d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm3.2 7.7 3.3 3.3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      ) : (
        <path d="M4 2h5l3 3v8.2c0 .4-.4.8-.8.8H4.8c-.4 0-.8-.4-.8-.8V2.8c0-.4.4-.8.8-.8Zm1.5 6h5m-5 2h5m-5 2h3" />
      )}
    </svg>
  );
}

function renderText(text: StreamMessage["text"]) {
  if (!text) return null;
  if (typeof text === "string") return text;
  return text.map((part, i) =>
    typeof part === "string" ? (
      <React.Fragment key={i}>{part}</React.Fragment>
    ) : "bold" in part ? (
      <b key={i}>{part.bold}</b>
    ) : (
      <span className="cs-mention" key={i}>
        {brandIcon[part.brand]}
        {part.text}
      </span>
    ),
  );
}

export function CollaborationStream({
  agents = defaultAgents,
  messages = defaultMessages,
  you = "you",
  live = true,
  filter,
  defaultFilter = "everyone",
  onFilterChange,
  onSend,
  onOpenFile,
  placeholder = "Message the agents – @ to name one",
  className = "",
}: CollaborationStreamProps) {
  const [localFilter, setLocalFilter] = React.useState(defaultFilter);
  const active = filter ?? localFilter;
  const [sent, setSent] = React.useState<StreamMessage[]>([]);
  const [open, setOpen] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [target, setTarget] = React.useState<string | undefined>();
  const [picking, setPicking] = React.useState(false);
  const scroller = React.useRef<HTMLDivElement>(null);
  const byId = (id?: string) => agents.find((a) => a.id === id);
  const all = React.useMemo(() => [...messages, ...sent], [messages, sent]);
  const shown =
    active === "everyone" ? all : all.filter((m) => m.from === active || m.to === active);

  React.useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown.length, active]);

  const choose = (id: string) => {
    setLocalFilter(id);
    onFilterChange?.(id);
  };

  const send = () => {
    const text = draft.replace(/@\w+\s?/g, "").trim();
    if (!text) return;
    onSend?.({ text, to: target });
    if (!onSend) {
      const now = new Date();
      setSent((list) => [
        ...list,
        {
          id: `sent-${list.length}`,
          from: you,
          to: target,
          time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
          text,
        },
      ]);
    }
    setDraft("");
    setTarget(undefined);
  };

  const others = agents.filter((a) => a.id !== you);
  const writing = all.filter((m) => m.kind === "writing").map((m) => byId(m.from)?.name);

  return (
    <section className={`cs-root ${className}`} aria-label="Collaboration stream">
      <style>{css}</style>
      <div className="cs-tabs" role="tablist" aria-label="Filter messages">
        <button type="button" role="tab" aria-selected={active === "everyone"} onClick={() => choose("everyone")}>
          Everyone
        </button>
        {agents.map((a) => (
          <button type="button" role="tab" key={a.id} aria-selected={active === a.id} onClick={() => choose(a.id)}>
            <Mark agent={a} />
            {a.name}
          </button>
        ))}
        {live && (
          <span className="cs-live">
            <i aria-hidden="true" />
            Live
          </span>
        )}
      </div>

      <div className="cs-stream" ref={scroller} role="log" aria-live="polite">
        {shown.map((m) => {
          const from = byId(m.from);
          const to = byId(m.to);
          if (m.kind === "event")
            return (
              <p className="cs-event" key={m.id}>
                <Mark agent={from} size={10} />
                {from?.name} started <Mark agent={to} size={10} />
                {to?.name}
              </p>
            );
          const isOpen = open === m.id;
          return (
            <article className={`cs-msg ${m.kind ?? "message"}`} key={m.id}>
              <span className="cs-gutter">
                <Mark agent={from} />
              </span>
              <div className="cs-card">
                <header>
                  <button
                    type="button"
                    className="cs-from"
                    aria-expanded={m.details ? isOpen : undefined}
                    disabled={!m.details}
                    onClick={() => setOpen(isOpen ? null : m.id)}
                  >
                    {from?.name ?? m.from}
                  </button>
                  {m.kind === "handoff" && <span className="cs-tag">Handoff</span>}
                  {m.kind === "question" && m.to === you && <span className="cs-tag q">Question for you</span>}
                  {m.time && <time>{m.time}</time>}
                </header>
                {to && !m.quote && (
                  <span className="cs-to">
                    <i>to</i> <Mark agent={to} size={10} /> {to.name}
                  </span>
                )}
                {m.quote && (
                  <div className="cs-quote">
                    <span>
                      to <Mark agent={to} size={10} /> <b>{to?.name}</b>
                    </span>
                    {m.quote}
                  </div>
                )}
                {m.kind === "writing" ? (
                  <p className="cs-writing">Writing…</p>
                ) : (
                  <p className="cs-text">{renderText(m.text)}</p>
                )}
                {(m.files?.length || m.tools?.length) && (
                  <div className="cs-files">
                    {m.tools?.map((t) => (
                      <span className="cs-chip tool" key={t}>
                        <FileIcon kind="tool" />
                        {t}
                      </span>
                    ))}
                    {m.files?.map((f) => (
                      <button type="button" className="cs-chip" key={f.name} onClick={() => onOpenFile?.(f, m)}>
                        <FileIcon kind={f.kind} />
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
                {isOpen && m.details && (
                  <div className="cs-details">
                    {m.details.meta && (
                      <dl>
                        {m.details.meta.map(([k, v]) => (
                          <div key={k}>
                            <dt>{k}</dt>
                            <dd>{v}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {m.details.items?.map((it) => (
                      <div className="cs-item" key={it.title}>
                        <FileIcon kind={it.kind} />
                        <span>
                          <b>{it.title}</b>
                          {it.detail && <small>{it.detail}</small>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <form
        className="cs-composer"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          aria-label="Message"
          rows={2}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => {
            setDraft(e.target.value);
            setPicking(/(^|\s)@\w*$/.test(e.target.value));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
            if (e.key === "Escape") setPicking(false);
          }}
        />
        {picking && (
          <div className="cs-picker" role="listbox" aria-label="Name an agent">
            {others.map((a) => (
              <button
                type="button"
                role="option"
                aria-selected={target === a.id}
                key={a.id}
                onClick={() => {
                  setTarget(a.id);
                  setDraft((d) => d.replace(/@\w*$/, `@${a.name} `));
                  setPicking(false);
                }}
              >
                <Mark agent={a} /> {a.name}
              </button>
            ))}
          </div>
        )}
        <footer>
          <button type="button" className="cs-at" aria-label="Name an agent" onClick={() => setPicking((p) => !p)}>
            @
          </button>
          <span className="cs-target">
            to {target ? <><Mark agent={byId(target)} size={10} /> {byId(target)?.name}</> : "everyone"}
          </span>
          <button type="submit" className="cs-send" aria-label="Send" disabled={!draft.trim()}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </footer>
      </form>
      <p className="cs-sr" role="status">
        {writing.length ? `${writing.join(", ")} writing` : ""}
      </p>
    </section>
  );
}

const css = `
.cs-root{--cs-fg:#1f1f1f;--cs-muted:#8a8a8a;--cs-card:#fff;--cs-soft:#f3f3f3;--cs-line:#ececec;--cs-blue:#3d7be8;--cs-amber:#b7791f;width:100%;max-width:770px;margin:0 auto;color:var(--cs-fg);font:400 13px/1.5 Inter,ui-sans-serif,system-ui,sans-serif;text-align:left;position:relative}
:where(.dark,[data-theme=dark]) .cs-root{--cs-fg:#ececec;--cs-muted:#8f8f94;--cs-card:#1d1d20;--cs-soft:#28282c;--cs-line:#2e2e33;color-scheme:dark}
.cs-root *{box-sizing:border-box}.cs-root :where(button){font:inherit;color:inherit;cursor:pointer}
.cs-root button:focus-visible,.cs-root textarea:focus-visible{outline:2px solid var(--cs-blue);outline-offset:2px}
.cs-mark{flex:none;display:block}
.cs-tabs{display:flex;align-items:center;gap:2px;margin-bottom:8px;overflow-x:auto;scrollbar-width:none}
.cs-tabs button{display:inline-flex;align-items:center;gap:7px;border:0;background:none;color:var(--cs-muted);padding:4px 8px;border-radius:6px;white-space:nowrap;font-size:13px}
.cs-tabs button:hover{color:var(--cs-fg)}
.cs-tabs [aria-selected=true]{background:var(--cs-soft);color:var(--cs-fg)}
.cs-live{margin-left:auto;display:inline-flex;align-items:center;gap:6px;color:var(--cs-muted);font-size:12px;padding-right:2px}
.cs-live i{width:5px;height:5px;border-radius:50%;background:var(--cs-blue);animation:cs-pulse 2s ease-in-out infinite}
.cs-stream{height:470px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:2px 2px 10px;scrollbar-width:thin;mask-image:linear-gradient(transparent,#000 14px)}
.cs-msg{display:flex;gap:14px;align-items:flex-start;animation:cs-in .3s ease-out both}
.cs-gutter{width:12px;padding-top:12px;flex:none}
.cs-card{max-width:min(520px,100%);min-width:0;background:var(--cs-card);border:1px solid var(--cs-line);border-radius:10px;padding:10px 12px;box-shadow:0 1px 2px #0000000a}
.cs-msg.handoff .cs-card{max-width:min(510px,100%)}
.cs-card header{display:flex;align-items:center;gap:8px;min-height:20px}
.cs-from{border:0;background:none;padding:0;font-weight:500;font-size:13px}
.cs-root .cs-from:disabled{cursor:default;color:var(--cs-fg);opacity:1}
.cs-from:not(:disabled):hover{text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--cs-line)}
.cs-tag{font-size:11px;line-height:17px;padding:0 5px;border-radius:4px;background:var(--cs-soft);color:color-mix(in srgb,var(--cs-fg) 75%,transparent)}
.cs-tag.q{background:#f6a93b1f;color:var(--cs-amber)}
.cs-card time{margin-left:auto;padding-left:24px;color:var(--cs-muted);font-size:12px;font-variant-numeric:tabular-nums}
.cs-to{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-size:12px;background:var(--cs-soft);border-radius:5px;padding:2px 8px;color:var(--cs-fg)}
.cs-to i{font-style:normal;color:var(--cs-muted);margin-right:4px}
.cs-quote{margin-top:6px;background:var(--cs-soft);border-radius:6px;padding:5px 8px;font-size:12px;line-height:18px;color:color-mix(in srgb,var(--cs-fg) 70%,transparent)}
.cs-quote span{display:flex;align-items:center;gap:6px;color:var(--cs-muted)}
.cs-quote b{font-weight:400;color:var(--cs-fg)}
.cs-text{margin:9px 0 0;font-size:13px;line-height:20px}
.cs-text b{font-weight:500}
.cs-writing{margin:9px 0 0;color:var(--cs-muted);background:linear-gradient(90deg,var(--cs-muted) 30%,var(--cs-fg) 50%,var(--cs-muted) 70%);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:cs-shine 2.4s linear infinite;width:max-content}
.cs-mention{display:inline-flex;align-items:center;gap:4px;font-weight:500;vertical-align:-1px}
.cs-brand{width:12px;height:12px;flex:none}
.cs-files{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.cs-chip{display:inline-flex;align-items:center;gap:6px;border:0;background:var(--cs-soft);border-radius:5px;padding:2px 8px;font-size:12px;line-height:18px;color:color-mix(in srgb,var(--cs-fg) 80%,transparent)}
.cs-chip:hover{background:color-mix(in srgb,var(--cs-soft) 70%,var(--cs-line))}
.cs-chip svg,.cs-item>svg{width:11px;height:11px;fill:currentColor;flex:none;opacity:.75}
.cs-chip svg path[stroke],.cs-item>svg path[stroke]{fill:none}
.cs-details{margin-top:10px;border-top:1px solid var(--cs-line);padding-top:10px;display:grid;gap:8px;animation:cs-in .2s ease-out}
.cs-details dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px;margin:0}
.cs-details dt{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--cs-muted)}
.cs-details dd{margin:0;font-size:12px}
.cs-item{display:flex;gap:8px;align-items:flex-start;font-size:12px}
.cs-item>svg{margin-top:4px}
.cs-item span{display:grid}.cs-item b{font-weight:500}.cs-item small{color:var(--cs-muted);font-size:11px}
.cs-event{display:flex;align-items:center;gap:6px;margin:2px 0 2px 26px;font-size:12px;color:var(--cs-muted)}
.cs-composer{position:relative;margin-top:14px;background:var(--cs-card);border:1px solid var(--cs-line);border-radius:12px;padding:12px 12px 8px 14px;box-shadow:0 1px 3px #0000000d}
.cs-composer textarea{display:block;width:100%;border:0;resize:none;background:none;color:var(--cs-fg);font:inherit;font-size:13px;line-height:20px;outline:none;min-height:40px}
.cs-composer textarea::placeholder{color:var(--cs-muted)}
.cs-composer footer{display:flex;align-items:center;gap:10px;margin-top:4px}
.cs-at{border:0;background:none;color:var(--cs-muted);font-size:14px!important;width:22px;height:22px;border-radius:5px;padding:0}
.cs-at:hover{background:var(--cs-soft)}
.cs-target{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--cs-muted)}
.cs-send{margin-left:auto;width:26px;height:26px;border-radius:50%;border:0;display:grid;place-items:center;background:var(--cs-fg);color:var(--cs-card)!important;transition:opacity .15s}
.cs-send:disabled{background:var(--cs-soft);color:var(--cs-muted)!important;cursor:default}
.cs-send svg{width:13px;height:13px}
.cs-picker{position:absolute;left:12px;bottom:calc(100% + 6px);background:var(--cs-card);border:1px solid var(--cs-line);border-radius:10px;box-shadow:0 8px 28px #0000001f;padding:4px;display:grid;min-width:180px;z-index:3}
.cs-picker button{display:flex;align-items:center;gap:8px;border:0;background:none;text-align:left;padding:6px 8px;border-radius:6px}
.cs-picker button:hover,.cs-picker [aria-selected=true]{background:var(--cs-soft)}
.cs-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0}
@keyframes cs-in{from{opacity:0;transform:translateY(4px)}}
@keyframes cs-pulse{50%{opacity:.35}}
@keyframes cs-shine{from{background-position:100% 0}to{background-position:-100% 0}}
@media (prefers-reduced-motion:reduce){.cs-root *{animation:none!important}.cs-writing{-webkit-text-fill-color:currentColor}}
@media (max-width:560px){.cs-stream{height:420px}.cs-msg{gap:8px}.cs-card time{padding-left:10px}.cs-details dl{grid-template-columns:1fr 1fr}}
`;

export default CollaborationStream;
