"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type CommentAuthor = { name: string; avatar?: string; color?: string };
export type PanelComment = {
  id: string;
  author: CommentAuthor;
  /** Date, epoch ms, or a ready label like "2min ago". */
  createdAt: Date | number | string;
  text: string;
};

export type CommentsPanelProps = {
  comments?: PanelComment[];
  currentUser?: CommentAuthor;
  onRunEdit?: (comment: PanelComment) => Promise<void> | void;
  onAdd?: (comment: PanelComment) => void;
  onClose?: () => void;
  title?: string;
  className?: string;
};

type Filter = "all" | "questions" | "edits";

const ago = (m: number) => Date.now() - m * 60000;
const defaultComments: PanelComment[] = [
  { id: "1", author: { name: "Mara Lindqvist", color: "#c08457" }, createdAt: ago(2), text: "/edit Rename every “customers” to “members” on the pricing page." },
  { id: "2", author: { name: "Jonas Weber", color: "#5b6b7a" }, createdAt: ago(5), text: "Should we mention the launch discount in the hero too?" },
  { id: "3", author: { name: "Lena Hart", color: "#b0877a" }, createdAt: ago(11), text: "The new illustrations look great on mobile." },
  { id: "4", author: { name: "Theo Brandt", color: "#6d7f62" }, createdAt: ago(18), text: "/edit Shorten every FAQ answer to two sentences." },
  { id: "5", author: { name: "Sofia Marin", color: "#9a6a8e" }, createdAt: ago(26), text: "Can we ship this before Friday?" },
];

const isEdit = (t: string) => /^\/edit\b/i.test(t.trim());
const isQuestion = (t: string) => !isEdit(t) && t.trim().endsWith("?");
const when = (c: PanelComment["createdAt"]) => {
  if (typeof c === "string") return c;
  const m = Math.max(0, Math.round((Date.now() - new Date(c).getTime()) / 60000));
  if (m < 1) return "now";
  if (m < 60) return `${m}min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

function Avatar({ a, size = 20 }: { a: CommentAuthor; size?: number }) {
  return a.avatar ? (
    <img className="cp-av" src={a.avatar} alt="" width={size} height={size} />
  ) : (
    <span className="cp-av" style={{ width: size, height: size, background: a.color ?? "#8b8b93" }} aria-hidden="true">
      {a.name[0]}
    </span>
  );
}

export function CommentsPanel({
  comments = defaultComments,
  currentUser = { name: "You", color: "#a07a5f" },
  onRunEdit,
  onAdd,
  onClose = () => {},
  title = "Comments",
  className = "",
}: CommentsPanelProps) {
  const [list, setList] = React.useState(comments);
  const [filter, setFilter] = React.useState<Filter>("all");
  const [newest, setNewest] = React.useState(true);
  const [menu, setMenu] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [state, setState] = React.useState<Record<string, "running" | "done">>({});
  React.useEffect(() => setList(comments), [comments]);

  const edits = list.filter((c) => isEdit(c.text)).length;
  const shown = list
    .filter((c) => (filter === "edits" ? isEdit(c.text) : filter === "questions" ? isQuestion(c.text) : true))
    .slice()
    .sort((a, b) => {
      const ta = typeof a.createdAt === "string" ? 0 : new Date(a.createdAt).getTime();
      const tb = typeof b.createdAt === "string" ? 0 : new Date(b.createdAt).getTime();
      return newest ? tb - ta : ta - tb;
    });

  const run = async (c: PanelComment) => {
    setState((s) => ({ ...s, [c.id]: "running" }));
    try {
      await (onRunEdit ? onRunEdit(c) : new Promise((r) => setTimeout(r, 900)));
    } finally {
      setState((s) => ({ ...s, [c.id]: "done" }));
    }
  };
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const c: PanelComment = { id: `c${Date.now()}`, author: currentUser, createdAt: Date.now(), text };
    setList((l) => [c, ...l]);
    setDraft("");
    onAdd?.(c);
  };

  const tabs: [Filter, string, number?][] = [
    ["all", "All"],
    ["questions", "Questions"],
    ["edits", "Edits", edits],
  ];

  return (
    <section className={`cp ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="cp-head">
        <h3>{title}</h3>
        {onClose && (
          <button type="button" className="cp-icon" aria-label="Close comments" onClick={onClose}>
            <svg viewBox="0 0 16 16"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </button>
        )}
      </header>
      <div className="cp-bar">
        <div className="cp-tabs" role="tablist" aria-label="Filter comments">
          {tabs.map(([id, label, n]) => (
            <button key={id} type="button" role="tab" aria-selected={filter === id} onClick={() => setFilter(id)}>
              {label}
              {n ? <span className="cp-n">{n}</span> : null}
            </button>
          ))}
        </div>
        <div className="cp-sort">
          <button type="button" className="cp-icon" aria-label="Sort" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <svg viewBox="0 0 16 16"><path d="M3 4.5h10M5 8h6M7 11.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </button>
          {menu && (
            <div className="cp-menu" role="menu">
              {[true, false].map((v) => (
                <button key={String(v)} type="button" role="menuitemradio" aria-checked={newest === v} onClick={() => { setNewest(v); setMenu(false); }}>
                  {v ? "Newest first" : "Oldest first"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <ol className="cp-list">
        {shown.map((c) => {
          const edit = isEdit(c.text);
          const st = state[c.id];
          return (
            <li key={c.id} className="cp-item">
              <div className="cp-meta">
                <Avatar a={c.author} />
                <strong>{c.author.name}</strong>
                <time>{when(c.createdAt)}</time>
              </div>
              <p className="cp-text">
                {edit ? (
                  <>
                    <span className="cp-cmd">/Edit</span>
                    {c.text.trim().slice(5)}
                  </>
                ) : (
                  c.text
                )}
              </p>
              {edit && (
                <button type="button" className={`cp-run ${st ?? ""}`} disabled={!!st} onClick={() => run(c)}>
                  {st === "running" ? (
                    <span className="cp-spin" aria-hidden="true" />
                  ) : st === "done" ? (
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  ) : (
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7-4.5Z" fill="currentColor" /></svg>
                  )}
                  {st === "running" ? "Running…" : st === "done" ? "Applied" : "Run edit"}
                </button>
              )}
            </li>
          );
        })}
        {shown.length === 0 && <li className="cp-empty">Nothing here yet</li>}
      </ol>
      <form
        className="cp-compose"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <Avatar a={currentUser} />
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a comment or /edit..." aria-label="Add a comment" />
        <button type="submit" className="cp-send" aria-label="Send" disabled={!draft.trim()}>
          <svg viewBox="0 0 16 16"><path d="M8 12.5v-9m-4 4 4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </form>
    </section>
  );
}

const css = `
.cp{--cp-bg:#fff;--cp-fg:#18181b;--cp-muted:#71717a;--cp-faint:#a1a1aa;--cp-line:#ececef;--cp-chip:#f1f1f3;--cp-accent:#3b82f6;width:100%;max-width:400px;display:flex;flex-direction:column;background:var(--cp-bg);color:var(--cp-fg);border:1px solid var(--cp-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .cp{--cp-bg:#1b1b1e;--cp-fg:#ececef;--cp-muted:#a1a1aa;--cp-faint:#71717a;--cp-line:#2e2e33;--cp-chip:#2a2a2f;color-scheme:dark}
.cp *{box-sizing:border-box}.cp button,.cp input{font:inherit;color:inherit}.cp button{cursor:pointer}
.cp-head{display:flex;align-items:center;justify-content:space-between;padding:14px 12px 0 16px}
.cp-head h3{margin:0;font-size:15px;font-weight:500}
.cp-icon{display:grid;place-items:center;width:26px;height:26px;border:0;border-radius:6px;background:none;color:var(--cp-muted)}
.cp-icon:hover{background:var(--cp-chip);color:var(--cp-fg)}.cp-icon svg{width:15px;height:15px}
.cp-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 12px 12px 16px;border-bottom:1px solid var(--cp-line)}
.cp-tabs{display:flex;gap:8px}
.cp-tabs button{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:1px solid var(--cp-line);border-radius:7px;background:var(--cp-bg);font-size:14px;color:var(--cp-muted)}
.cp-tabs button[aria-selected=true]{background:var(--cp-chip);border-color:var(--cp-chip);color:var(--cp-fg);font-weight:500}
.cp-n{display:inline-grid;place-items:center;min-width:16px;height:16px;padding:0 4px;border-radius:4px;background:var(--cp-chip);font-size:11px;color:var(--cp-muted)}
.cp-sort{position:relative}
.cp-menu{position:absolute;right:0;top:30px;z-index:2;min-width:140px;padding:4px;border:1px solid var(--cp-line);border-radius:9px;background:var(--cp-bg);box-shadow:0 8px 24px #0000001a;animation:cp-in .15s both}
.cp-menu button{display:block;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;text-align:left;font-size:13px}
.cp-menu button:hover,.cp-menu button[aria-checked=true]{background:var(--cp-chip)}
.cp-list{list-style:none;margin:0;padding:0;max-height:250px;overflow:auto}
.cp-item{padding:12px 16px 14px;border-bottom:1px solid var(--cp-line);animation:cp-in .25s both}
.cp-meta{display:flex;align-items:center;gap:8px}
.cp-meta strong{font-weight:500;font-size:14px}.cp-meta time{margin-left:auto;font-size:12px;color:var(--cp-faint)}
.cp-av{display:inline-grid;place-items:center;flex:none;border-radius:50%;color:#fff;font-size:10px;font-weight:600;object-fit:cover}
.cp-text{margin:6px 0 0 28px;font-size:14px;line-height:1.45}
.cp-cmd{color:var(--cp-muted)}
.cp-run{display:inline-flex;align-items:center;gap:8px;margin:10px 0 0 28px;height:30px;padding:0 10px 0 12px;border:0;border-radius:7px;background:var(--cp-bg);box-shadow:0 0 0 1px var(--cp-line),0 1px 2px #0000000d;font-size:14px;font-weight:500}
.cp-run svg{width:13px;height:13px;color:var(--cp-muted)}.cp-run.done svg{color:#16a34a}.cp-run:disabled{cursor:default;color:var(--cp-muted)}
.cp-spin{width:12px;height:12px;border:1.5px solid var(--cp-line);border-top-color:var(--cp-muted);border-radius:50%;animation:cp-spin .7s linear infinite}
.cp-empty{padding:24px 16px;text-align:center;color:var(--cp-faint);font-size:13px}
.cp-compose{display:flex;align-items:center;gap:8px;padding:8px 8px 8px 16px;border-top:1px solid var(--cp-line)}
.cp-compose input{flex:1;min-width:0;height:28px;border:0;background:none;outline:none;font-size:14px}
.cp-compose input::placeholder{color:var(--cp-faint)}
.cp-send{display:grid;place-items:center;width:28px;height:28px;border:0;border-radius:7px;background:var(--cp-fg);color:var(--cp-bg)}
.cp-send:disabled{background:#c4c4c9;color:#fff;cursor:default}.cp-send svg{width:14px;height:14px}
.cp :focus-visible{outline:2px solid var(--cp-accent);outline-offset:2px}
@keyframes cp-in{from{opacity:0;transform:translateY(-3px)}}@keyframes cp-spin{to{transform:rotate(1turn)}}
@media(max-width:380px){.cp-tabs button{padding:0 7px;font-size:13px}.cp-text,.cp-run{margin-left:0}}
@media(prefers-reduced-motion:reduce){.cp *{animation:none!important;transition:none!important}}
`;

export default CommentsPanel;
