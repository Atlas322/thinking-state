"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type ComboboxOption = {
  value: string;
  label: string;
  hint?: string;
  /** Image URL, or true for initials. */
  avatar?: string | boolean;
  color?: string;
  icon?: React.ReactNode;
  group?: string;
  keywords?: string[];
};

export type ComboboxProps = {
  options?: ComboboxOption[];
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[], options: ComboboxOption[]) => void;
  placeholder?: string;
  creatable?: boolean;
  onCreate?: (text: string) => ComboboxOption | void;
  createLabel?: (text: string) => string;
  maxVisibleTags?: number;
  label?: string;
  defaultOpen?: boolean;
  emptyText?: string;
  className?: string;
};

const defaultOptions: ComboboxOption[] = [
  { value: "maya", label: "Maya Chen", hint: "Product Designer", avatar: true, group: "Design" },
  { value: "jonas", label: "Jonas Weber", hint: "Design Lead", avatar: true, group: "Design" },
  { value: "priya", label: "Priya Raman", hint: "Brand Designer", avatar: true, group: "Design" },
  { value: "sara", label: "Sara Okafor", hint: "Staff Engineer", avatar: true, group: "Engineering" },
  { value: "leo", label: "Leo Martins", hint: "Frontend", avatar: true, group: "Engineering" },
  { value: "nina", label: "Nina Petrova", hint: "Backend", avatar: true, group: "Engineering" },
  { value: "tom", label: "Tom Becker", hint: "iOS", avatar: true, group: "Engineering" },
  { value: "ava", label: "Ava Lindqvist", hint: "Product Manager", avatar: true, group: "Product" },
  { value: "omar", label: "Omar Haddad", hint: "Product Analyst", avatar: true, group: "Product" },
];

const initials = (s: string) =>
  s
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function Avatar({ o }: { o: ComboboxOption }) {
  if (o.icon) return <span className="cb-ico">{o.icon}</span>;
  if (typeof o.avatar === "string") return <img className="cb-av" src={o.avatar} alt="" />;
  if (o.avatar) return <span className="cb-av" style={{ background: o.color }}>{initials(o.label)}</span>;
  if (o.color) return <span className="cb-dot" style={{ background: o.color }} />;
  return null;
}

export function Combobox({
  options: optionsProp = defaultOptions,
  multiple = true,
  value: valueProp,
  defaultValue = [],
  onChange,
  placeholder = "Search…",
  creatable = false,
  onCreate,
  createLabel = (t) => `Create “${t}”`,
  maxVisibleTags,
  label,
  defaultOpen = false,
  emptyText = "No results",
  className = "",
}: ComboboxProps) {
  const [created, setCreated] = React.useState<ComboboxOption[]>([]);
  const options = React.useMemo(() => [...optionsProp, ...created], [optionsProp, created]);
  const [inner, setInner] = React.useState<string[]>(defaultValue);
  const value = valueProp ?? inner;
  const [open, setOpen] = React.useState(defaultOpen);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [hotChip, setHotChip] = React.useState(false);
  const [announce, setAnnounce] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();
  const listId = `${id}-list`;

  const q = query.trim().toLowerCase();
  const filtered = options.filter(
    (o) =>
      !q ||
      o.label.toLowerCase().includes(q) ||
      o.hint?.toLowerCase().includes(q) ||
      o.keywords?.some((k) => k.toLowerCase().includes(q)),
  );
  const showCreate = creatable && q.length > 0 && !options.some((o) => o.label.toLowerCase() === q);
  const rows: (ComboboxOption | "create")[] = [...filtered, ...(showCreate ? ["create" as const] : [])];

  const groups: { name?: string; items: { o: ComboboxOption; i: number }[] }[] = [];
  filtered.forEach((o, i) => {
    const g = groups.find((x) => x.name === o.group);
    if (g) g.items.push({ o, i });
    else groups.push({ name: o.group, items: [{ o, i }] });
  });
  // keep index order consistent with grouping
  const ordered = groups.flatMap((g) => g.items);
  const indexOf = (i: number) => ordered.findIndex((x) => x.i === i);

  const commit = (next: string[], msg: string) => {
    if (valueProp === undefined) setInner(next);
    onChange?.(next, next.map((v) => options.find((o) => o.value === v)).filter(Boolean) as ComboboxOption[]);
    setAnnounce(`${msg}. ${next.length} selected.`);
  };

  const toggle = (o: ComboboxOption) => {
    const has = value.includes(o.value);
    if (multiple) commit(has ? value.filter((v) => v !== o.value) : [...value, o.value], `${o.label} ${has ? "removed" : "added"}`);
    else {
      commit(has ? [] : [o.value], `${o.label} ${has ? "removed" : "selected"}`);
      setOpen(false);
    }
    setQuery("");
  };

  const create = () => {
    const text = query.trim();
    const made = onCreate?.(text) || { value: text, label: text, avatar: true, color: "#ececef" };
    setCreated((c) => [...c, made]);
    const next = multiple ? [...value, made.value] : [made.value];
    if (valueProp === undefined) setInner(next);
    onChange?.(next, [...options, made].filter((o) => next.includes(o.value)));
    setAnnounce(`${made.label} created. ${next.length} selected.`);
    setQuery("");
    if (!multiple) setOpen(false);
  };

  const pickActive = () => {
    const visualRow = active < ordered.length ? ordered[active]?.o : showCreate ? "create" : undefined;
    if (visualRow === "create") create();
    else if (visualRow) toggle(visualRow);
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  React.useEffect(() => setActive(0), [query]);

  const picked = value.map((v) => options.find((o) => o.value === v)).filter(Boolean) as ComboboxOption[];
  const limit = maxVisibleTags ?? 3;
  const shown = multiple ? picked.slice(0, limit) : [];
  const overflow = multiple ? picked.length - shown.length : 0;
  const single = !multiple ? picked[0] : undefined;
  const activeId = open && rows.length ? `${id}-opt-${active}` : undefined;

  return (
    <div ref={rootRef} className={`cb ${className}`}>
      <style>{css}</style>
      {label && (
        <label className="cb-label" htmlFor={`${id}-input`} id={`${id}-label`}>
          {label}
        </label>
      )}
      <div
        className={`cb-field ${open ? "open" : ""}`}
        onMouseDown={(e) => {
          if (e.target !== inputRef.current) e.preventDefault();
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        {shown.map((o, i) => (
          <span key={o.value} className={`cb-chip ${hotChip && i === shown.length - 1 && !overflow ? "hot" : ""}`}>
            <Avatar o={o} />
            <span className="cb-chip-t">{o.label}</span>
            <button
              type="button"
              tabIndex={-1}
              aria-label={`Remove ${o.label}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                toggle(o);
              }}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3.5 3.5 5 5m0-5-5 5" /></svg>
            </button>
          </span>
        ))}
        {overflow > 0 && <span className={`cb-chip cb-more ${hotChip ? "hot" : ""}`}>+{overflow}</span>}
        {single && !query && (
          <span className="cb-single">
            <Avatar o={single} />
            {single.label}
          </span>
        )}
        <input
          ref={inputRef}
          id={`${id}-input`}
          className="cb-input"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          aria-label={label ? undefined : placeholder}
          placeholder={picked.length ? "" : placeholder}
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => setHotChip(false)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHotChip(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              if (!open) return setOpen(true);
              const n = rows.length;
              if (!n) return;
              setActive((a) => (e.key === "ArrowDown" ? (a + 1) % n : (a - 1 + n) % n));
            } else if (e.key === "Enter") {
              if (open && rows.length) {
                e.preventDefault();
                pickActive();
              }
            } else if (e.key === "Escape") {
              if (open) setOpen(false);
              else setQuery("");
            } else if (e.key === "Tab") {
              setOpen(false);
            } else if (e.key === "Backspace" && !query && picked.length) {
              if (hotChip) {
                toggle(picked[picked.length - 1]);
                setHotChip(false);
              } else setHotChip(true);
            }
          }}
        />
        <svg className="cb-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="m5 6.5 3 3 3-3" /></svg>
      </div>

      {open && (
        <div className="cb-pop">
          <div
            id={listId}
            role="listbox"
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-label={label ? undefined : placeholder}
            aria-multiselectable={multiple || undefined}
            className="cb-list"
            onMouseDown={(e) => e.preventDefault()}
            onMouseLeave={() => setActive(-1)}
          >
            {groups.map((g, gi) => (
              <div role="group" key={g.name ?? gi} aria-label={g.name}>
                {g.name && <div className="cb-group">{g.name}</div>}
                {g.items.map(({ o, i }) => {
                  const idx = indexOf(i);
                  const sel = value.includes(o.value);
                  return (
                    <div
                      key={o.value}
                      id={`${id}-opt-${idx}`}
                      role="option"
                      aria-selected={sel}
                      className={`cb-opt ${idx === active ? "active" : ""}`}
                      onMouseMove={() => setActive(idx)}
                      onClick={() => toggle(o)}
                    >
                      <Avatar o={o} />
                      <span className="cb-opt-t">
                        <Highlight text={o.label} query={query} />
                      </span>
                      {o.hint && <span className="cb-hint">{o.hint}</span>}
                      <svg className={`cb-check ${sel ? "on" : ""}`} viewBox="0 0 16 16" aria-hidden="true">
                        <path d="m3.5 8.5 3 3 6-7" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            ))}
            {showCreate && (
              <div
                id={`${id}-opt-${ordered.length}`}
                role="option"
                aria-selected={false}
                className={`cb-opt cb-create ${active === ordered.length ? "active" : ""}`}
                onMouseMove={() => setActive(ordered.length)}
                onClick={create}
              >
                <span className="cb-ico">
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" /></svg>
                </span>
                {createLabel(query.trim())}
              </div>
            )}
            {!rows.length && <div className="cb-empty">{emptyText}</div>}
          </div>
          <div className="cb-count">
            <span>{multiple ? `${value.length} selected` : `${filtered.length} options`}</span>
            <span className="cb-keys">
              <kbd>↑</kbd><kbd>↓</kbd> to move <kbd>↵</kbd> to toggle
            </span>
          </div>
        </div>
      )}
      <span className="cb-sr" aria-live="polite">{announce}</span>
    </div>
  );
}

const css = `
.cb{--cb-bg:#fff;--cb-fg:#18181b;--cb-muted:#71717a;--cb-faint:#a1a1aa;--cb-line:#e7e7ea;--cb-soft:#f4f4f5;--cb-hover:#f1f1f3;--cb-accent:#3b82f6;--cb-mark:#fdf0b5;position:relative;width:100%;max-width:420px;color:var(--cb-fg);font:400 14px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .cb{--cb-bg:#1b1b1e;--cb-fg:#ececef;--cb-muted:#a1a1aa;--cb-faint:#71717a;--cb-line:#2e2e33;--cb-soft:#26262a;--cb-hover:#2a2a2f;--cb-accent:#60a5fa;--cb-mark:#5b4a12;color-scheme:dark}
.cb *{box-sizing:border-box}.cb button{font:inherit;color:inherit;cursor:pointer}
.cb-label{display:block;margin:0 0 6px 2px;font-size:12px;font-weight:500}
.cb-field{display:flex;align-items:center;gap:4px;min-height:34px;padding:3px 30px 3px 4px;border:1px solid var(--cb-line);border-radius:8px;background:var(--cb-bg);box-shadow:0 1px 2px #00000008;position:relative;cursor:text;overflow:hidden;transition:border-color .15s,box-shadow .15s}
.cb-field:focus-within{border-color:color-mix(in srgb,var(--cb-fg) 22%,var(--cb-line))}.cb-field:has(.cb-input:focus-visible){box-shadow:0 0 0 3px color-mix(in srgb,var(--cb-accent) 16%,transparent)}
.cb-input{flex:1;min-width:60px;height:26px;padding:0 6px;border:0;outline:0;background:none;color:inherit;font:inherit;font-size:13px}
.cb-input::placeholder{color:var(--cb-faint)}.cb .cb-input:focus,.cb .cb-input:focus-visible{outline:none;box-shadow:none}
.cb-chev{position:absolute;right:9px;top:50%;width:14px;height:14px;margin-top:-7px;fill:none;stroke:var(--cb-muted);stroke-width:1.4;stroke-linecap:round;transition:transform .15s}
.cb-field.open .cb-chev{transform:rotate(180deg)}
.cb-chip{display:inline-flex;align-items:center;gap:5px;flex:none;max-width:150px;height:24px;padding:0 3px 0 4px;border-radius:6px;background:var(--cb-soft);font-size:12.5px;animation:cb-pop .18s cubic-bezier(.3,1.4,.5,1)}
.cb-chip.hot{background:color-mix(in srgb,var(--cb-accent) 18%,var(--cb-bg))}
.cb-chip-t{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cb-chip button{display:grid;place-items:center;width:16px;height:16px;padding:0;border:0;border-radius:4px;background:none;color:var(--cb-muted)}
.cb-chip button:hover{background:color-mix(in srgb,var(--cb-fg) 10%,transparent);color:var(--cb-fg)}
.cb-chip button svg{width:10px;height:10px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.cb-more{padding:0 7px;color:var(--cb-muted)}
.cb-single{display:inline-flex;align-items:center;gap:7px;padding-left:6px;font-size:13px;flex:none}
.cb-av{display:grid;place-items:center;width:18px;height:18px;flex:none;border-radius:50%;background:var(--cb-soft);border:1px solid var(--cb-line);font-size:7.5px;font-weight:500;color:var(--cb-muted);object-fit:cover}
.cb-chip .cb-av{width:16px;height:16px;font-size:8px}
.cb-dot{width:8px;height:8px;border-radius:50%;flex:none}
.cb-ico{display:grid;place-items:center;width:18px;height:18px;flex:none;color:var(--cb-muted)}.cb-ico svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.cb-pop{position:absolute;z-index:20;left:0;right:0;top:calc(100% + 6px);border:1px solid var(--cb-line);border-radius:10px;background:var(--cb-bg);box-shadow:0 10px 30px #0000001a,0 1px 3px #0000000d;overflow:hidden;animation:cb-in .14s ease-out}
.cb-label+.cb-field+.cb-pop{top:calc(100% + 6px)}
.cb-list{max-height:300px;overflow:auto;padding:4px}
.cb-group{padding:10px 8px 4px;font-size:10.5px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--cb-muted)}
.cb-opt{display:flex;align-items:center;gap:9px;height:32px;padding:0 8px;border-radius:6px;cursor:pointer;font-size:13px;transition:background .08s}
.cb-opt.active{background:var(--cb-hover)}
.cb-opt-t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cb-opt mark{background:var(--cb-mark);color:inherit;border-radius:2px}
.cb-hint{color:var(--cb-muted);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cb-check{width:15px;height:15px;margin-left:auto;flex:none;fill:none;stroke:var(--cb-accent);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;opacity:0;transform:scale(.4);transition:opacity .15s,transform .25s cubic-bezier(.3,1.6,.5,1)}
.cb-check.on{opacity:1;transform:none}
.cb-create{color:var(--cb-muted)}
.cb-empty{padding:18px 8px;text-align:center;color:var(--cb-faint);font-size:13px}
.cb-count{display:flex;justify-content:space-between;align-items:center;padding:7px 12px;border-top:1px solid var(--cb-line);font-size:12px;color:var(--cb-muted)}
.cb-keys{color:var(--cb-faint)}.cb-keys kbd{font:inherit;font-size:10.5px;padding:0 4px;margin:0 1px;border:1px solid var(--cb-line);border-radius:4px}
.cb-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@keyframes cb-pop{from{transform:scale(.7);opacity:0}}
@keyframes cb-in{from{opacity:0;transform:translateY(-4px)}}
@media(pointer:coarse){.cb-opt{height:44px}.cb-input{font-size:16px}.cb-chip button{width:24px;height:24px}}
@media(max-width:480px){.cb-keys{display:none}.cb-chip{max-width:110px}}
@media(prefers-reduced-motion:reduce){.cb *{animation:none!important;transition:none!important}}
`;

export function Demo() {
  return (
    <div style={{ width: "100%", maxWidth: 420, minHeight: 390 }}>
      <Combobox
        label="Reviewers"
        placeholder="Add reviewers…"
        creatable
        createLabel={(t) => `Invite “${t}”`}
      />
    </div>
  );
}

export default Demo;
