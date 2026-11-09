"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type PromptTemplate = {
  id: string;
  title: string;
  category?: string;
  /** Badge color: "blue" | "violet" | "amber" | "green" | "gray". */
  tone?: string;
  body: string;
  variables?: Record<string, { description?: string; default?: string }>;
};
export type PromptLibraryProps = {
  templates?: PromptTemplate[];
  value?: string;
  defaultValue?: string;
  onSelect?: (id: string) => void;
  onUse?: (prompt: string, template: PromptTemplate, values: Record<string, string>) => void;
  onCopy?: (prompt: string) => void;
  title?: string;
  useLabel?: string;
  className?: string;
};

const promptExamples: PromptTemplate[] = [
  {
    id: "meeting",
    title: "Summarize a meeting",
    category: "Notes",
    tone: "blue",
    body: "Summarize the meeting below for {audience} in under {length}. List decisions first, then open questions with an owner.",
    variables: { length: { default: "150 words" } },
  },
  {
    id: "release",
    title: "Write release notes",
    category: "Product",
    tone: "violet",
    body: "Write release notes for {product} {version} for {audience}. Keep the tone {tone} and group the changes into New, Improved and Fixed.",
    variables: {
      product: { description: "Product name", default: "Relay" },
      version: { description: "Version", default: "2.4" },
      audience: { description: "Who reads it", default: "existing customers" },
      tone: { description: "Tone of voice", default: "friendly" },
    },
  },
  {
    id: "error",
    title: "Explain an error",
    category: "Debug",
    tone: "amber",
    body: "Explain this {language} error in plain words and suggest the smallest fix: {error}",
  },
  {
    id: "cold",
    title: "Draft a cold email",
    category: "Sales",
    tone: "green",
    body: "Draft a short cold email to {name} at {company} about {offer}. Under 120 words, one clear ask.",
  },
];

const varsOf = (body: string) => [...new Set([...body.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
const fill = (body: string, values: Record<string, string>) =>
  body.replace(/\{(\w+)\}/g, (_, k: string) => values[k]?.trim() || `{${k}}`);

export function PromptLibrary({
  templates = promptExamples,
  value,
  defaultValue,
  onSelect,
  onUse,
  onCopy,
  title = "Prompts",
  useLabel = "Use prompt",
  className = "",
}: PromptLibraryProps) {
  const [internal, setInternal] = React.useState(
    defaultValue ?? (templates === promptExamples ? "release" : templates[0]?.id),
  );
  const selected = value ?? internal;
  const t = templates.find((x) => x.id === selected) ?? templates[0];
  const [query, setQuery] = React.useState("");
  const [store, setStore] = React.useState<Record<string, Record<string, string>>>({});
  const [lit, setLit] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState("");
  const [said, setSaid] = React.useState("");
  const [pulse, setPulse] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const fieldRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
  const id = React.useId();

  const visible = templates.filter((x) =>
    `${x.title} ${x.category ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const names = t ? varsOf(t.body) : [];
  const values: Record<string, string> = Object.fromEntries(
    names.map((n) => [n, store[t!.id]?.[n] ?? t!.variables?.[n]?.default ?? ""]),
  );
  const filled = names.filter((n) => values[n].trim()).length;
  const ready = filled === names.length;
  const prompt = t ? fill(t.body, values) : "";
  const tokens = Math.max(1, Math.round(prompt.length / 4));

  const choose = (next: string, focus = false) => {
    if (next === selected) return;
    onSelect?.(next);
    if (value === undefined) setInternal(next);
    if (focus) window.setTimeout(() => listRef.current?.querySelector<HTMLElement>(`[data-id="${next}"]`)?.focus(), 0);
  };

  const setVal = (n: string, v: string) => {
    if (!t) return;
    const wasReady = ready;
    setStore((s) => ({ ...s, [t.id]: { ...values, ...s[t.id], [n]: v } }));
    setLit(n);
    const nowReady = names.every((k) => (k === n ? v : values[k]).trim());
    if (nowReady && !wasReady) {
      setPulse((p) => p + 1);
      setSaid("All variables filled");
    }
  };

  const use = () => {
    if (!t || !ready) {
      const first = names.find((n) => !values[n].trim());
      if (first) fieldRefs.current[first]?.focus();
      return;
    }
    onUse?.(prompt, t, values);
    setSaid("Prompt used");
  };

  const copy = async () => {
    setError("");
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setSaid("Prompt copied");
      onCopy?.(prompt);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setError("Couldn't reach the clipboard. Select and copy the preview instead.");
    }
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const i = visible.findIndex((x) => x.id === selected);
    let next = -1;
    if (e.key === "ArrowDown") next = Math.min(visible.length - 1, i + 1);
    else if (e.key === "ArrowUp") next = Math.max(0, i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = visible.length - 1;
    if (next >= 0 && visible[next]) {
      e.preventDefault();
      choose(visible[next].id, true);
    }
  };

  const parts = t ? t.body.split(/(\{\w+\})/g) : [];
  const seen = new Set<string>();

  return (
    <section className={`pl ${className}`} role="group" aria-labelledby={`${id}-title`}>
      <style>{css}</style>
      <aside className="pl-side">
        <div className="pl-side-head">
          <span id={`${id}-title`}>{title}</span>
          <span className="pl-n">{templates.length}</span>
        </div>
        <label className="pl-search">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          <input
            value={query}
            placeholder="Search templates"
            aria-label="Search templates"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
              if (e.key === "ArrowDown" && visible[0]) {
                e.preventDefault();
                const target = visible.some((x) => x.id === selected) ? selected : visible[0].id;
                choose(target);
                window.setTimeout(() => listRef.current?.querySelector<HTMLElement>(`[data-id="${target}"]`)?.focus(), 0);
              }
            }}
          />
        </label>
        <div className="pl-list" role="listbox" aria-labelledby={`${id}-title`} ref={listRef} onKeyDown={onListKey}>
          {visible.map((x) => (
            <div
              key={x.id}
              data-id={x.id}
              role="option"
              aria-label={x.title}
              aria-selected={x.id === selected}
              tabIndex={x.id === selected ? 0 : -1}
              className="pl-item"
              onClick={() => choose(x.id)}
            >
              <span className="pl-item-t">{x.title}</span>
              {x.category && <span className={`pl-badge pl-${x.tone ?? "gray"}`}>{x.category}</span>}
            </div>
          ))}
          {!visible.length && <p className="pl-none">No templates match</p>}
        </div>
      </aside>

      {t && (
        <div className="pl-main" key={t.id}>
          <header className="pl-head">
            <strong>{t.title}</strong>
            {t.category && <span className={`pl-badge pl-${t.tone ?? "gray"}`}>{t.category}</span>}
            {names.length > 0 && (
              <span className="pl-progress">
                <span className="pl-dots" aria-hidden="true">
                  {names.map((n) => <i key={n} data-on={!!values[n].trim()} />)}
                </span>
                {filled} of {names.length} filled
              </span>
            )}
          </header>
          <div className="pl-sentence">
            {parts.map((p, i) => {
              const m = p.match(/^\{(\w+)\}$/);
              if (!m) return <React.Fragment key={i}>{p}</React.Fragment>;
              const n = m[1];
              if (seen.has(n)) return <span key={i} className="pl-echo">{values[n] || n}</span>;
              seen.add(n);
              const desc = t.variables?.[n]?.description;
              return (
                <input
                  key={i}
                  ref={(el) => { fieldRefs.current[n] = el; }}
                  className="pl-var"
                  data-lit={lit === n}
                  data-empty={!values[n]}
                  aria-label={n}
                  aria-description={desc}
                  title={desc}
                  placeholder={n}
                  value={values[n]}
                  style={{ width: `calc(${Math.max(2, (values[n] || n).length) * 0.56}em + 12px)` }}
                  onChange={(e) => setVal(n, e.target.value)}
                  onBlur={() => setLit(null)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    const empty = names.find((k) => k !== n && !values[k].trim());
                    if (empty) fieldRefs.current[empty]?.focus();
                    else if (values[n].trim()) use();
                  }}
                />
              );
            })}
          </div>
          <div className="pl-label">Preview</div>
          <p className="pl-preview">
            {parts.map((p, i) => {
              const m = p.match(/^\{(\w+)\}$/);
              if (!m) return <React.Fragment key={i}>{p}</React.Fragment>;
              const v = values[m[1]]?.trim();
              return v ? <b key={i} data-lit={lit === m[1]}>{v}</b> : <span key={i} className="pl-missing">{p}</span>;
            })}
          </p>
        </div>
      )}

      <footer className="pl-foot">
        <span className="pl-tokens" key={tokens}>~{tokens} tokens</span>
        {!ready && <span className="pl-missing-n">{names.length - filled} to fill</span>}
        <span className="pl-spacer" />
        <button type="button" className="pl-btn" aria-label="Copy prompt" onClick={copy}>
          {copied ? (
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M3 10.5V3.5a1 1 0 0 1 1-1h6.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
          )}
          <span className="pl-copy-l">{copied ? "Copied" : "Copy"}</span>
        </button>
        <button key={pulse} type="button" className="pl-btn pl-primary" data-pulse={pulse > 0} aria-disabled={!ready} onClick={use}>
          {useLabel}
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5m-3.5-3.5L12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </footer>
      {error && <p role="alert" className="pl-error">{error}</p>}
      <span role="status" aria-live="polite" className="pl-sr">{said}</span>
    </section>
  );
}

const css = `
.pl{--pl-bg:#fff;--pl-fg:#18181b;--pl-muted:#71717a;--pl-faint:#a1a1aa;--pl-line:#ececef;--pl-soft:#f4f4f5;--pl-hl:#f1f1f3;--pl-accent:#3b6be0;--pl-red:#d14343;container:pl/inline-size;display:grid;grid-template-columns:220px minmax(0,1fr);width:100%;max-width:640px;background:var(--pl-bg);color:var(--pl-fg);border:1px solid var(--pl-line);border-radius:12px;box-shadow:0 1px 2px #0000000a,0 4px 14px -8px #00000014;font:400 12.5px/1.5 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .pl{--pl-bg:#1b1b1e;--pl-fg:#ececef;--pl-muted:#a1a1aa;--pl-faint:#71717a;--pl-line:#2c2c31;--pl-soft:#26262b;--pl-hl:#2a2a2f;--pl-accent:#7c9cff;--pl-red:#f08585;color-scheme:dark}
.pl *{box-sizing:border-box}.pl button{font:inherit;color:inherit;cursor:pointer}
.pl-side{padding:12px 8px 12px;border-right:1px solid var(--pl-line);min-width:0}
.pl-side-head{display:flex;align-items:center;gap:7px;padding:0 8px 10px;font-weight:500}.pl-n{color:var(--pl-faint);font-weight:400;font-size:12px}
.pl-search{display:flex;align-items:center;gap:7px;height:28px;margin:0 0 10px;padding:0 8px;border:1px solid var(--pl-line);border-radius:7px}
.pl-search svg{width:13px;height:13px;color:var(--pl-faint);flex:none}
.pl-search input{flex:1;min-width:0;border:0;background:none;outline:none;color:var(--pl-fg);font:inherit;font-size:12.5px}.pl-search input::placeholder{color:var(--pl-faint)}
.pl-search:focus-within{border-color:color-mix(in srgb,var(--pl-accent) 50%,var(--pl-line))}
.pl-list{display:flex;flex-direction:column;gap:2px}
.pl-item{display:flex;align-items:center;gap:8px;height:32px;padding:0 6px 0 8px;border-radius:7px;cursor:pointer;color:color-mix(in srgb,var(--pl-fg) 82%,var(--pl-bg));outline:none;transition:background .18s,color .18s}
.pl-item:hover{background:color-mix(in srgb,var(--pl-hl) 60%,transparent)}
.pl-item[aria-selected=true]{background:var(--pl-hl);color:var(--pl-fg)}
.pl-item:focus-visible{box-shadow:inset 0 0 0 1.5px var(--pl-accent)}
.pl-item-t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-badge{flex:none;height:18px;padding:0 6px;border-radius:5px;font-size:11px;line-height:18px;font-weight:500}
.pl-blue{color:#2f6bd8;background:#e9f1ff}.pl-violet{color:#6d4fd6;background:#efebff}.pl-amber{color:#b0640c;background:#fdf1df}.pl-green{color:#2a7d52;background:#e5f6ec}.pl-gray{color:var(--pl-muted);background:var(--pl-soft)}
:where(.dark,[data-theme=dark]) .pl .pl-blue{color:#8fb3ff;background:#1d2a44}:where(.dark,[data-theme=dark]) .pl .pl-violet{color:#b4a3ff;background:#2a2346}:where(.dark,[data-theme=dark]) .pl .pl-amber{color:#eba659;background:#3a2a16}:where(.dark,[data-theme=dark]) .pl .pl-green{color:#6cc596;background:#183024}
.pl-none{margin:8px;color:var(--pl-muted);font-size:12px}
.pl-main{padding:12px 16px 16px;min-width:0;animation:pl-fade .22s both}
.pl-head{display:flex;align-items:center;gap:8px;margin-bottom:12px}.pl-head strong{font-weight:500;margin-right:auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-progress{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--pl-faint);white-space:nowrap}
.pl-dots{display:inline-flex;gap:2px}.pl-dots i{width:6px;height:6px;border-radius:1.5px;background:var(--pl-line);transition:background .2s}.pl-dots i[data-on=true]{background:var(--pl-accent)}
.pl-sentence{line-height:28px}
.pl-var{display:inline-block;max-width:100%;height:22px;margin:0 2px;padding:0 6px;border:0;border-radius:5px;background:var(--pl-soft);color:var(--pl-fg);font:inherit;font-weight:500;vertical-align:baseline;outline:none;transition:background .4s,box-shadow .2s}
.pl-var::placeholder{color:var(--pl-faint);font-weight:400}
.pl-var[data-empty=true]{box-shadow:inset 0 0 0 1px var(--pl-line);background:transparent}
.pl-var:focus{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--pl-accent) 55%,transparent)}
.pl-var[data-lit=true]{background:color-mix(in srgb,var(--pl-accent) 14%,var(--pl-bg))}
.pl-echo{font-weight:500}
.pl-label{margin:16px 0 6px;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--pl-muted)}
.pl-preview{margin:0;padding:9px 12px;border:1px solid var(--pl-line);border-radius:8px;background:color-mix(in srgb,var(--pl-soft) 55%,var(--pl-bg));color:var(--pl-muted);font-size:12px;line-height:1.6}
.pl-preview b{font-weight:500;color:var(--pl-fg);border-radius:3px;transition:background .5s}.pl-preview b[data-lit=true]{background:color-mix(in srgb,var(--pl-accent) 14%,transparent)}
.pl-missing{color:var(--pl-faint)}
.pl-foot{grid-column:1/-1;display:flex;align-items:center;gap:8px;padding:8px 8px 8px 16px;border-top:1px solid var(--pl-line)}
.pl-tokens{font-size:12px;color:var(--pl-muted);font-variant-numeric:tabular-nums;animation:pl-roll .2s both}
.pl-missing-n{font-size:12px;color:var(--pl-faint)}
.pl-spacer{flex:1}
.pl-btn{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:1px solid var(--pl-line);border-radius:7px;background:var(--pl-bg);font-weight:500;transition:background .15s,transform .1s}
.pl-btn:hover{background:var(--pl-soft)}.pl-btn svg{width:14px;height:14px}
.pl-primary{background:var(--pl-fg);border-color:var(--pl-fg);color:var(--pl-bg)!important}.pl-primary:hover{background:color-mix(in srgb,var(--pl-fg) 86%,var(--pl-bg))}
.pl-primary[aria-disabled=true]{opacity:.4;cursor:not-allowed}
.pl-primary[data-pulse=true]{animation:pl-pulse .5s both}
.pl-error{grid-column:1/-1;margin:0;padding:0 16px 10px;color:var(--pl-red);font-size:12px}
.pl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.pl :focus-visible{outline:2px solid var(--pl-accent);outline-offset:2px}.pl .pl-item:focus-visible,.pl .pl-var:focus-visible{outline:none}
@keyframes pl-fade{from{opacity:0}}
@keyframes pl-roll{from{opacity:0;transform:translateY(3px)}}
@keyframes pl-pulse{40%{transform:scale(1.05)}}
@container pl (max-width:540px){.pl{grid-template-columns:1fr}.pl-side{border-right:0;border-bottom:1px solid var(--pl-line)}}
@container pl (max-width:360px){.pl-copy-l{display:none}}
@media(hover:none){.pl-item{height:40px}.pl-btn{height:34px}}
@media(prefers-reduced-motion:reduce){.pl *{animation:none!important;transition:none!important}}
`;

export default PromptLibrary;
