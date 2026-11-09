"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type Memory = {
  id: string;
  text: string;
  category: string;
  source?: string;
  date?: string;
  paused?: boolean;
};

export type MemoryPanelProps = {
  memories?: Memory[];
  onChange?: (memories: Memory[]) => void;
  onAdd?: (memory: Memory) => void;
  onEdit?: (id: string, text: string) => void;
  onPause?: (id: string, paused: boolean) => void;
  onForget?: (id: string) => void;
  onRestore?: (memory: Memory) => void;
  enabled?: boolean;
  defaultEnabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  categories?: string[];
  title?: string;
  maxHeight?: number;
  undoFor?: number;
  addedSource?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
};

const defaultMemories: Memory[] = [
  { id: "m1", text: "Prefers TypeScript examples over plain JavaScript", category: "Preferences", source: "From chat", date: "Oct 12" },
  { id: "m2", text: "Likes short answers first, details only when asked", category: "Preferences", source: "You added", date: "Oct 2", paused: true },
  { id: "m3", text: "Designs with Inter and a 4px spacing grid", category: "Preferences", source: "From Figma", date: "Oct 7" },
  { id: "m4", text: "Product designer and front-end developer at a small studio", category: "Work", source: "From chat", date: "Sep 28" },
  { id: "m5", text: "Ships with React, Vite and Tailwind; deploys on Vercel", category: "Work", source: "From chat", date: "Oct 3" },
  { id: "m6", text: "Sends release notes to clients every Friday", category: "Work", source: "From chat", date: "Oct 9" },
  { id: "m7", text: "Redesigning the onboarding flow for a fintech client, due Oct 24", category: "Projects", source: "From chat", date: "Oct 11" },
  { id: "m8", text: "Keeps design tokens in one tokens.json shared with the code", category: "Projects", source: "From chat", date: "Oct 5" },
];

const short = (t: string) => (t.length > 24 ? `${t.slice(0, 24)}…` : t);
const Ico = {
  edit: <svg viewBox="0 0 16 16"><path d="M10.5 3 13 5.5 6 12.5H3.5V10Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>,
  pause: <svg viewBox="0 0 16 16"><path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  play: <svg viewBox="0 0 16 16"><path d="M5 3.5v9l7-4.5Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>,
  trash: <svg viewBox="0 0 16 16"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  plus: <svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  search: <svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="m10.2 10.2 3.3 3.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
};

export function MemoryPanel({
  memories: memoriesProp,
  onChange,
  onAdd,
  onEdit,
  onPause,
  onForget,
  onRestore,
  enabled: enabledProp,
  defaultEnabled = true,
  onEnabledChange,
  categories: categoriesProp,
  title = "Memory",
  maxHeight = 360,
  undoFor = 5000,
  addedSource = "You added",
  action,
  className = "",
}: MemoryPanelProps) {
  const [own, setOwn] = React.useState<Memory[]>(memoriesProp ?? defaultMemories);
  const list = onChange && memoriesProp ? memoriesProp : own;
  const [enabledState, setEnabledState] = React.useState(defaultEnabled);
  const enabled = enabledProp ?? enabledState;
  const [filter, setFilter] = React.useState("All");
  const [query, setQuery] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const [newCat, setNewCat] = React.useState("");
  const [undo, setUndo] = React.useState<{ memory: Memory; index: number } | null>(null);
  const chipRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const noteId = React.useId();

  const categories = React.useMemo(() => {
    const seen = categoriesProp ? [...categoriesProp] : [];
    list.forEach((m) => !seen.includes(m.category) && seen.push(m.category));
    return seen;
  }, [list, categoriesProp]);

  React.useEffect(() => {
    if (!undo) return;
    const id = window.setTimeout(() => setUndo(null), undoFor);
    return () => window.clearTimeout(id);
  }, [undo, undoFor]);

  const commit = (next: Memory[]) => {
    if (!(onChange && memoriesProp)) setOwn(next);
    onChange?.(next);
  };
  const setEnabled = (v: boolean) => {
    setEnabledState(v);
    onEnabledChange?.(v);
  };

  const q = query.trim().toLowerCase();
  const matches = (m: Memory) => (filter === "All" || m.category === filter) && (!q || m.text.toLowerCase().includes(q));
  const paused = list.filter((m) => m.paused).length;
  const chips = ["All", ...categories];
  const count = (c: string) => (c === "All" ? list.length : list.filter((m) => m.category === c).length);

  const saveEdit = (m: Memory) => {
    const text = draft.trim();
    if (text && text !== m.text) {
      commit(list.map((x) => (x.id === m.id ? { ...x, text } : x)));
      onEdit?.(m.id, text);
    }
    setEditing(null);
  };
  const saveNew = () => {
    const text = draft.trim();
    if (!text) return;
    const memory: Memory = {
      id: `m${Date.now()}`,
      text,
      category: newCat || (filter !== "All" ? filter : categories[0] ?? "General"),
      source: addedSource,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    commit([...list, memory]);
    onAdd?.(memory);
    setAdding(false);
    setDraft("");
  };
  const forget = (m: Memory) => {
    const index = list.findIndex((x) => x.id === m.id);
    commit(list.filter((x) => x.id !== m.id));
    setUndo({ memory: m, index });
    onForget?.(m.id);
  };
  const restore = () => {
    if (!undo) return;
    const next = [...list];
    next.splice(Math.min(undo.index, next.length), 0, undo.memory);
    commit(next);
    onRestore?.(undo.memory);
    setUndo(null);
  };

  return (
    <section className={`mp ${enabled ? "" : "is-off"} ${className}`} role="group" aria-label={title}>
      <style>{css}</style>
      <header className="mp-head">
        <div className="mp-top">
          <h3>{title}</h3>
          <span className="mp-count">{list.length}</span>
          <label className="mp-use">
            Use memory
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-controls={noteId}
              className="mp-switch"
              onClick={() => setEnabled(!enabled)}
            >
              <i />
            </button>
          </label>
        </div>
        <div className="mp-note" id={noteId} data-open={!enabled}>
          <p>The assistant won't use or save memories in new chats. Nothing here is deleted.</p>
        </div>
        <div className="mp-filters">
          {searching ? (
            <input
              className="mp-search"
              autoFocus
              placeholder="Search memories"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  setSearching(false);
                }
              }}
            />
          ) : (
            <div className="mp-chips" role="radiogroup" aria-label="Category">
              {chips.map((c, i) => (
                <button
                  key={c}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={filter === c}
                  tabIndex={filter === c ? 0 : -1}
                  className="mp-chip"
                  onClick={() => setFilter(c)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                    e.preventDefault();
                    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + chips.length) % chips.length;
                    setFilter(chips[n]);
                    chipRefs.current[n]?.focus();
                  }}
                >
                  {c}
                  <span>{count(c)}</span>
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className="mp-icon"
            aria-label={searching ? "Close search" : "Search memories"}
            onClick={() => {
              setSearching(!searching);
              setQuery("");
            }}
          >
            {searching ? <svg viewBox="0 0 16 16"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg> : Ico.search}
          </button>
        </div>
      </header>

      <div className="mp-list" style={{ maxHeight }}>
        {categories.map((cat) => {
          const rows = list.filter((m) => m.category === cat);
          const visible = rows.filter(matches);
          return (
            <section key={cat} className="mp-group" data-hidden={visible.length === 0} aria-label={cat} inert={visible.length === 0 ? true : undefined}>
              <div className="mp-gh">{cat}</div>
              {rows.map((m) => {
                const show = matches(m);
                return (
                  <div key={m.id} className={`mp-row ${m.paused ? "is-paused" : ""}`} data-hidden={!show} inert={!show ? true : undefined}>
                    <div className="mp-inner">
                      {editing === m.id ? (
                        <textarea
                          className="mp-edit"
                          autoFocus
                          value={draft}
                          rows={2}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={() => saveEdit(m)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              saveEdit(m);
                            }
                            if (e.key === "Escape") setEditing(null);
                          }}
                        />
                      ) : (
                        <p className="mp-text">{m.text}</p>
                      )}
                      <div className="mp-meta">
                        {m.source}
                        {m.source && m.date && " · "}
                        {m.date}
                        {m.paused && <span className="mp-tag">Paused</span>}
                      </div>
                      <div className="mp-acts">
                        <button type="button" aria-label={`Edit “${short(m.text)}”`} onClick={() => { setEditing(m.id); setDraft(m.text); }}>
                          {Ico.edit}
                        </button>
                        <button
                          type="button"
                          aria-label={`${m.paused ? "Resume" : "Pause"} “${short(m.text)}”`}
                          onClick={() => {
                            commit(list.map((x) => (x.id === m.id ? { ...x, paused: !x.paused } : x)));
                            onPause?.(m.id, !m.paused);
                          }}
                        >
                          {m.paused ? Ico.play : Ico.pause}
                        </button>
                        <button type="button" aria-label={`Forget “${short(m.text)}”`} onClick={() => forget(m)}>
                          {Ico.trash}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
        {list.filter(matches).length === 0 && <p className="mp-empty">No memories here</p>}
      </div>

      <div className="mp-new">
        {adding ? (
          <div className="mp-editor">
            <textarea
              autoFocus
              rows={2}
              placeholder="Something the assistant should remember"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  saveNew();
                }
                if (e.key === "Escape") setAdding(false);
              }}
            />
            <div className="mp-ed-row">
              <div className="mp-chips" role="radiogroup" aria-label="Category of the new memory">
                {categories.map((c) => {
                  const cur = newCat || (filter !== "All" ? filter : categories[0]);
                  return (
                    <button key={c} type="button" role="radio" aria-checked={cur === c} className="mp-chip" onClick={() => setNewCat(c)}>
                      {c}
                    </button>
                  );
                })}
              </div>
              <button type="button" className="mp-btn" onClick={() => setAdding(false)}>Cancel</button>
              <button type="button" className="mp-btn mp-primary" disabled={!draft.trim()} onClick={saveNew}>Save</button>
            </div>
          </div>
        ) : (
          <button type="button" className="mp-add" onClick={() => { setAdding(true); setDraft(""); setNewCat(""); }}>
            {Ico.plus}
            New memory
          </button>
        )}
      </div>

      <footer className="mp-foot">
        <span role="status" key={undo ? "undo" : "count"} className="mp-status">
          {undo ? (
            <>Forgot “{short(undo.memory.text)}”</>
          ) : (
            <>
              <b>{list.length}</b> {list.length === 1 ? "memory" : "memories"}
              {paused > 0 && <> · {paused} paused</>}
            </>
          )}
        </span>
        {undo ? (
          <button type="button" className="mp-btn" onClick={restore}>Undo</button>
        ) : (
          action && <button type="button" className="mp-btn" onClick={action.onClick}>{action.label}</button>
        )}
      </footer>
    </section>
  );
}

const css = `
.mp{--mp-bg:#fff;--mp-fg:#18181b;--mp-muted:#71717a;--mp-faint:#a1a1aa;--mp-line:#ececef;--mp-soft:#f4f4f5;--mp-chip:#ededef;--mp-accent:#3b82f6;width:100%;max-width:400px;background:var(--mp-bg);color:var(--mp-fg);border:1px solid var(--mp-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .mp{--mp-bg:#1b1b1e;--mp-fg:#ececef;--mp-muted:#a1a1aa;--mp-faint:#5c5c64;--mp-line:#2c2c31;--mp-soft:#232328;--mp-chip:#2c2c32;--mp-accent:#7aa2ff;color-scheme:dark}
.mp *{box-sizing:border-box}.mp button,.mp input,.mp textarea{font:inherit;color:inherit}.mp button{cursor:pointer}
.mp-head{padding:15px 15px 12px;border-bottom:1px solid var(--mp-line)}
.mp-top{display:flex;align-items:center;gap:8px}
.mp-top h3{margin:0;font-size:16px;font-weight:500;letter-spacing:-.01em}
.mp-count{padding:0 6px;border-radius:4px;background:var(--mp-chip);font-size:11.5px;line-height:17px;color:var(--mp-muted)}
.mp-use{margin-left:auto;display:inline-flex;align-items:center;gap:8px;font-size:14px;color:var(--mp-muted)}
.mp-switch{position:relative;width:26px;height:16px;padding:0;border:0;border-radius:9px;background:var(--mp-faint);transition:background .2s}
.mp-switch[aria-checked=true]{background:var(--mp-accent)}
.mp-switch i{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:6px;background:#fff;transition:transform .2s cubic-bezier(.3,1.3,.5,1)}
.mp-switch[aria-checked=true] i{transform:translateX(10px);width:10px;border-radius:3px}
.mp-note{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s}
.mp-note[data-open=true]{grid-template-rows:1fr}
.mp-note p{overflow:hidden;margin:0;font-size:12.5px;color:var(--mp-muted)}.mp-note[data-open=true] p{padding-top:8px}
.mp-filters{display:flex;align-items:center;gap:6px;margin-top:12px}
.mp-chips{display:flex;gap:4px;flex-wrap:wrap;flex:1;min-width:0}
.mp-chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:1px solid var(--mp-line);border-radius:5px;background:var(--mp-bg);font-size:14px;transition:background .15s}
.mp-chip span{font-size:12px;color:var(--mp-muted)}
.mp-chip:hover{background:var(--mp-soft)}
.mp-chip[aria-checked=true]{background:var(--mp-chip);border-color:var(--mp-chip)}
.mp-icon{display:grid;place-items:center;width:28px;height:28px;margin-left:auto;border:0;border-radius:6px;background:none;color:var(--mp-muted)}
.mp-icon:hover{background:var(--mp-soft);color:var(--mp-fg)}.mp-icon svg{width:15px;height:15px}
.mp-search{flex:1;height:28px;padding:0 9px;border:1px solid var(--mp-line);border-radius:6px;background:var(--mp-bg);outline:0}
.mp-search:focus{border-color:var(--mp-accent)}
.mp-list{overflow-y:auto;padding:4px 0 6px;transition:opacity .25s}
.mp.is-off .mp-list{opacity:.45}
.mp-group{display:grid;grid-template-rows:1fr;transition:opacity .25s}
.mp-group[data-hidden=true]{display:none}
.mp-gh{padding:12px 15px 2px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mp-muted)}
.mp-row{display:grid;grid-template-rows:1fr;transition:grid-template-rows .3s,opacity .3s}
.mp-row[data-hidden=true]{grid-template-rows:0fr;opacity:0}
.mp-inner{position:relative;overflow:hidden;padding:8px 15px 7px;min-height:0}
.mp-row[data-hidden=true] .mp-inner{padding-top:0;padding-bottom:0}
.mp-inner:hover,.mp-inner:focus-within{background:var(--mp-soft)}
.mp-text{margin:0;padding-right:4px}
.mp-row.is-paused .mp-text{color:var(--mp-faint)}
.mp-meta{display:flex;align-items:center;gap:4px;margin-top:2px;font-size:12.5px;color:var(--mp-muted);white-space:pre}
.mp-tag{margin-left:6px;padding:0 6px;border-radius:4px;background:var(--mp-chip);font-size:11.5px;animation:mp-fade .25s both}
.mp-acts{position:absolute;right:10px;bottom:5px;display:flex;gap:1px;padding:2px;border-radius:7px;background:var(--mp-bg);border:1px solid var(--mp-line);opacity:0;transition:opacity .15s}
.mp-inner:hover .mp-acts,.mp-inner:focus-within .mp-acts{opacity:1}
.mp-acts button{display:grid;place-items:center;width:24px;height:22px;border:0;border-radius:5px;background:none;color:var(--mp-muted)}
.mp-acts button:hover{background:var(--mp-soft);color:var(--mp-fg)}.mp-acts svg{width:13px;height:13px}
.mp-edit,.mp-editor textarea{display:block;width:100%;resize:none;padding:6px 8px;border:1px solid var(--mp-accent);border-radius:6px;background:var(--mp-bg);outline:0}
.mp-empty{margin:0;padding:18px 15px;color:var(--mp-muted);font-size:13px}
.mp-new{border-top:1px solid var(--mp-line)}
.mp-add{display:flex;align-items:center;gap:9px;width:100%;height:44px;padding:0 15px;border:0;background:none;text-align:left}
.mp-add svg{width:14px;height:14px;color:var(--mp-muted)}.mp-add:hover{background:var(--mp-soft)}
.mp-editor{padding:10px 15px;animation:mp-fade .2s both}
.mp-ed-row{display:flex;align-items:center;gap:6px;margin-top:8px}
.mp-ed-row .mp-chip{height:24px;font-size:12.5px;padding:0 7px}
.mp-btn{height:28px;padding:0 10px;border:1px solid var(--mp-line);border-radius:6px;background:var(--mp-bg);font-size:13px!important}
.mp-btn:hover{background:var(--mp-soft)}.mp-btn:disabled{opacity:.5;cursor:default}
.mp-primary{background:var(--mp-fg);border-color:var(--mp-fg);color:var(--mp-bg)!important}.mp-primary:hover{background:var(--mp-fg);opacity:.9}
.mp-foot{display:flex;align-items:center;justify-content:space-between;min-height:43px;padding:6px 10px 6px 15px;border-top:1px solid var(--mp-line);font-size:12.5px;color:var(--mp-muted)}
.mp-foot b{font-weight:500;color:var(--mp-fg)}
.mp-status{animation:mp-fade .25s both}
.mp :focus-visible{outline:2px solid var(--mp-accent);outline-offset:1px}
@keyframes mp-fade{from{opacity:0}}
@media(max-width:420px){.mp-chip span{display:none}.mp-use{font-size:0;gap:0}}
@media(prefers-reduced-motion:reduce){.mp *{animation:none!important;transition:none!important}}
`;

export default MemoryPanel;
