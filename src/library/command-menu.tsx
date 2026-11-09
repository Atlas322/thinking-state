"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type Command = {
  id: string;
  label: string;
  hint?: string;
  /** Brand logo for tool actions. */
  logo?: React.ReactNode;
  /** Plain icon for everyday commands. */
  icon?: React.ReactNode;
  keys?: string[];
  keywords?: string[];
};
export type CommandGroup = { id: string; label: string; commands: Command[] };
export type CommandMenuProps = {
  groups?: CommandGroup[];
  placeholder?: string;
  onRun?: (id: string, query?: string) => void;
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
};

const s = (d: React.ReactNode) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">{d}</svg>
);
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const L = {
  gmail: s(<><path d="M2 4.5v7.5h2.5V7.2L8 9.8l3.5-2.6V12H14V4.5l-1-.8L8 7.3 3 3.7Z" fill="#ea4335" /><path d="M2 4.5 3 3.7v8.3H2Z" fill="#4285f4" /><path d="M14 4.5 13 3.7v8.3h1Z" fill="#34a853" /></>),
  spark: s(<path d="M8 1.5 9.3 6.7 14.5 8 9.3 9.3 8 14.5 6.7 9.3 1.5 8 6.7 6.7Z" fill="#4f7cf0" />),
  clickup: s(<><path d="m3 10.5 2-1.5c1 1.4 1.9 2 3 2s2-.6 3-2l2 1.5c-1.5 2-3 3-5 3s-3.5-1-5-3Z" fill="#7b68ee" /><path d="m4 6.5 4-3.5 4 3.5-1.4 1.4L8 5.7 5.4 7.9Z" fill="#fc4d8f" /></>),
  hubspot: s(<><circle cx="10" cy="9.5" r="2.3" fill="none" stroke="#ff7a59" strokeWidth="1.5" /><path d="M10 7V3.7M4 4.2l4.3 3.6M8 11.6 5.6 13.4" stroke="#ff7a59" strokeWidth="1.5" strokeLinecap="round" /><circle cx="3.7" cy="3.8" r="1.1" fill="#ff7a59" /></>),
  gcal: s(<><rect x="2" y="2" width="12" height="12" rx="2" fill="#4285f4" /><rect x="4.5" y="4.5" width="7" height="7" rx=".5" fill="#fff" /><path d="M6.3 7h3.4M6.3 9h3.4" stroke="#4285f4" strokeWidth="1" /></>),
  slack: s(<><rect x="2" y="6" width="5" height="2" rx="1" fill="#36c5f0" /><rect x="8" y="2" width="2" height="5" rx="1" fill="#2eb67d" /><rect x="9" y="8" width="5" height="2" rx="1" fill="#ecb22e" /><rect x="6" y="9" width="2" height="5" rx="1" fill="#e01e5a" /></>),
  notion: s(<><rect x="2" y="2" width="12" height="12" rx="2" fill="#fff" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 11.5v-7h1l3.5 7h1v-7" {...line} /></>),
};
const I = {
  doc: s(<><path d="M4 2h5l3 3v9H4Z" {...line} /><path d="M9 2v3h3" {...line} /></>),
  user: s(<><circle cx="6.5" cy="5.5" r="2.5" {...line} /><path d="M2 13.5c.6-2.3 2.3-3.5 4.5-3.5s3.9 1.2 4.5 3.5M12.5 5v4M10.5 7h4" {...line} /></>),
  upload: s(<path d="M8 10.5V2.5M5 5.5l3-3 3 3M2.5 10v3.5h11V10" {...line} />),
  moon: s(<path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5Z" {...line} />),
  home: s(<path d="M2.5 7 8 2.5 13.5 7v6.5h-4v-4h-3v4h-4Z" {...line} />),
  inbox: s(<><path d="M2.5 9 4 3h8l1.5 6v4.5h-11Z" {...line} /><path d="M2.5 9h3l1 1.5h3l1-1.5h3" {...line} /></>),
  chart: s(<path d="M2.5 13.5h11M4.5 11V8M8 11V4.5M11.5 11V6.5" {...line} />),
  gear: s(<><circle cx="8" cy="8" r="2" {...line} /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" {...line} /></>),
  search: s(<><circle cx="7" cy="7" r="4.5" {...line} /><path d="m10.5 10.5 3 3" {...line} /></>),
};

const defaultGroups: CommandGroup[] = [
  {
    id: "suggestions",
    label: "Suggestions",
    commands: [
      { id: "email", label: "Write an email", hint: "Gmail", logo: L.gmail, keywords: ["mail", "send"] },
      { id: "ask", label: "Ask assistant", hint: "Summaries, drafts, answers", logo: L.spark, keywords: ["ai", "chat"] },
      { id: "task", label: "Create a task", hint: "ClickUp", logo: L.clickup, keywords: ["todo"] },
      { id: "contact", label: "Add contact to CRM", hint: "HubSpot", logo: L.hubspot, keywords: ["lead"] },
      { id: "meeting", label: "Schedule a meeting", hint: "Google Calendar", logo: L.gcal, keywords: ["calendar", "event"] },
    ],
  },
  {
    id: "share",
    label: "Share",
    commands: [
      { id: "post", label: "Post an update", hint: "#team-updates", logo: L.slack },
      { id: "page", label: "Save as page", hint: "Notion · Meeting notes", logo: L.notion },
    ],
  },
  {
    id: "general",
    label: "General",
    commands: [
      { id: "new-doc", label: "New document", icon: I.doc, keys: ["N"] },
      { id: "invite", label: "Invite teammates", icon: I.user, keys: ["I"] },
      { id: "upload", label: "Upload files", icon: I.upload, keys: ["U"] },
      { id: "theme", label: "Switch to dark mode", icon: I.moon, keys: ["⇧", "D"] },
    ],
  },
  {
    id: "goto",
    label: "Go to",
    commands: [
      { id: "home", label: "Home", icon: I.home, keys: ["G", "H"] },
      { id: "inbox", label: "Inbox", icon: I.inbox, keys: ["G", "I"] },
      { id: "reports", label: "Reports", icon: I.chart, keys: ["G", "R"] },
      { id: "settings", label: "Settings", icon: I.gear, keys: ["G", "S"] },
    ],
  },
];

const matches = (c: Command, q: string) => {
  if (!q) return true;
  const hay = [c.label, c.hint ?? "", ...(c.keywords ?? [])].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
};

export function CommandMenu({
  groups = defaultGroups,
  placeholder = "Type a command or search…",
  onRun,
  onClose,
  autoFocus,
  className = "",
}: CommandMenuProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [ran, setRan] = React.useState<{ label: string; key: number } | null>(null);
  const [pressed, setPressed] = React.useState<string | null>(null);
  const [hoverOut, setHoverOut] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  const visible = groups
    .map((g) => ({ ...g, commands: g.commands.filter((c) => matches(c, query.trim())) }))
    .filter((g) => g.commands.length);
  const flat = visible.flatMap((g) => g.commands.map((c) => ({ c, g })));
  const fallback = query.trim() && !flat.length;
  const idx = Math.min(active, Math.max(0, flat.length - 1));
  const current = flat[idx];

  React.useEffect(() => setActive(0), [query]);
  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${idx}"]`);
    el?.scrollIntoView?.({ block: "nearest" });
  }, [idx]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (c: Command | null, q?: string) => {
    const label = c ? c.label : `Ask “${q}”`;
    if (c) {
      setPressed(c.id);
      window.setTimeout(() => setPressed(null), 160);
    }
    setRan({ label, key: Date.now() });
    onRun?.(c ? c.id : "ask", c ? undefined : q);
  };

  const suggestions = groups.find((g) => g.id === "suggestions")?.commands.slice(0, 5) ?? [];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && /^[1-5]$/.test(e.key)) {
      const c = suggestions[Number(e.key) - 1];
      if (c) {
        e.preventDefault();
        run(c);
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setHoverOut(false);
      if (!flat.length) return;
      setActive((a) => (Math.min(a, flat.length - 1) + (e.key === "ArrowDown" ? 1 : -1) + flat.length) % flat.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (fallback) run(null, query.trim());
      else if (current) run(current.c);
    } else if (e.key === "Tab" && visible.length > 1) {
      e.preventDefault();
      const gi = visible.findIndex((g) => g.id === current?.g.id);
      const next = (gi + (e.shiftKey ? -1 : 1) + visible.length) % visible.length;
      setActive(flat.findIndex((f) => f.g.id === visible[next].id));
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (query) setQuery("");
      else onClose?.();
    }
  };

  let n = -1;
  return (
    <div className={`cmdk ${className}`} onKeyDown={onKeyDown}>
      <style>{css}</style>
      <div className="cmdk-field">
        <span className="cmdk-search">{I.search}</span>
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={current && !fallback ? `${id}-${current.c.id}` : undefined}
          aria-autocomplete="list"
          autoFocus={autoFocus}
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
        />
        <kbd className="cmdk-enter" aria-hidden="true">↵</kbd>
      </div>
      <div
        className="cmdk-list"
        id={`${id}-list`}
        role="listbox"
        ref={listRef}
        data-out={hoverOut}
        onMouseLeave={() => setHoverOut(true)}
      >
        {fallback && (
          <div className="cmdk-group">
            <button
              type="button"
              role="option"
              aria-selected="true"
              className="cmdk-row"
              data-active="true"
              onClick={() => run(null, query.trim())}
            >
              <span className="cmdk-ico">{L.spark}</span>
              <span className="cmdk-label">Ask assistant</span>
              <span className="cmdk-hint">“{query.trim()}”</span>
            </button>
          </div>
        )}
        {visible.map((g) => (
          <div key={g.id} className="cmdk-group" role="group" aria-labelledby={`${id}-g-${g.id}`}>
            <div className="cmdk-glabel" id={`${id}-g-${g.id}`}>{g.label}</div>
            {g.commands.map((c) => {
              n += 1;
              const i = n;
              const num = g.id === "suggestions" ? suggestions.indexOf(c) : -1;
              const keys = num >= 0 ? ["⌘", String(num + 1)] : c.keys;
              return (
                <button
                  key={c.id}
                  id={`${id}-${c.id}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={i === idx}
                  data-idx={i}
                  data-active={i === idx && !hoverOut}
                  data-pressed={pressed === c.id}
                  className="cmdk-row"
                  onMouseMove={() => {
                    setHoverOut(false);
                    if (active !== i) setActive(i);
                  }}
                  onClick={() => run(c)}
                >
                  <span className={`cmdk-ico ${c.logo ? "cmdk-logo" : ""}`}>{c.logo ?? c.icon}</span>
                  <span className="cmdk-label">{c.label}</span>
                  {c.hint && <span className="cmdk-hint">{c.hint}</span>}
                  {keys && (
                    <span className="cmdk-keys" aria-hidden="true">
                      {keys.map((k, j) => <kbd key={j}>{k}</kbd>)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="cmdk-foot">
        {ran ? (
          <span key={ran.key} className="cmdk-ran">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {ran.label}
          </span>
        ) : (
          <span><kbd>Tab</kbd> to jump between sections</span>
        )}
        <span className="cmdk-open"><kbd>⌘</kbd><kbd>K</kbd> to open</span>
      </div>
      <span role="status" aria-live="polite" className="cmdk-sr">{ran ? `Ran ${ran.label}` : ""}</span>
    </div>
  );
}

const css = `
.cmdk{--cmdk-bg:#fff;--cmdk-fg:#18181b;--cmdk-muted:#71717a;--cmdk-faint:#a1a1aa;--cmdk-line:#ececef;--cmdk-hl:#f1f1f3;--cmdk-accent:#4f7cf0;--cmdk-green:#2f8a5b;width:100%;max-width:600px;display:flex;flex-direction:column;background:var(--cmdk-bg);color:var(--cmdk-fg);border:1px solid var(--cmdk-line);border-radius:12px;box-shadow:0 1px 2px #0000000a,0 12px 32px -12px #00000024;font:400 12.5px/1.4 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .cmdk{--cmdk-bg:#1b1b1e;--cmdk-fg:#ececef;--cmdk-muted:#a1a1aa;--cmdk-faint:#71717a;--cmdk-line:#2c2c31;--cmdk-hl:#2a2a2f;--cmdk-accent:#7c9cff;--cmdk-green:#6cc596;color-scheme:dark}
.cmdk *{box-sizing:border-box}
.cmdk-field{display:flex;align-items:center;gap:10px;height:48px;padding:0 12px 0 16px;border-bottom:1px solid var(--cmdk-line)}
.cmdk-search{display:grid;color:var(--cmdk-muted)}.cmdk-search svg{width:15px;height:15px}
.cmdk-field input{flex:1;min-width:0;height:100%;border:0;background:none;outline:none;color:var(--cmdk-fg);font:inherit;font-size:13.5px}
.cmdk-field input::placeholder{color:var(--cmdk-faint)}
.cmdk kbd{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border:1px solid var(--cmdk-line);border-radius:5px;background:var(--cmdk-bg);color:var(--cmdk-muted);font:400 11px/1 Inter,system-ui,sans-serif}
.cmdk-list{max-height:356px;overflow-y:auto;padding:4px 4px 6px;scroll-padding:28px 0 6px}
.cmdk-glabel{padding:10px 8px 6px;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--cmdk-muted)}
.cmdk-row{display:flex;align-items:center;gap:10px;width:100%;height:36px;padding:0 8px;border:0;border-radius:7px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .12s,transform .12s}
.cmdk-row[data-active=true]{background:var(--cmdk-hl)}
.cmdk-list[data-out=true] .cmdk-row{background:transparent}
.cmdk-row[data-pressed=true]{transform:scale(.985)}
.cmdk-ico{display:grid;place-items:center;width:16px;height:16px;flex:none;color:var(--cmdk-muted)}.cmdk-ico svg{width:15px;height:15px}
.cmdk-label{white-space:nowrap}
.cmdk-hint{color:var(--cmdk-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.cmdk-keys{display:flex;gap:4px;margin-left:auto;padding-left:12px}
.cmdk-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;height:40px;padding:0 12px;border-top:1px solid var(--cmdk-line);font-size:12px;color:var(--cmdk-muted)}
.cmdk-foot kbd{margin-right:6px}.cmdk-open kbd{margin-right:4px}.cmdk-open kbd:nth-child(2){margin-right:6px}
.cmdk-ran{display:inline-flex;align-items:center;gap:6px;color:var(--cmdk-fg);animation:cmdk-in .25s both}.cmdk-ran svg{width:14px;height:14px;color:var(--cmdk-green)}
.cmdk-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.cmdk :focus-visible{outline:none}
@keyframes cmdk-in{from{opacity:0;transform:translateY(3px)}}
@media(max-width:520px){.cmdk-keys,.cmdk-hint,.cmdk-open{display:none}}
@media(prefers-reduced-motion:reduce){.cmdk *{animation:none!important;transition:none!important}}
`;

export default CommandMenu;
