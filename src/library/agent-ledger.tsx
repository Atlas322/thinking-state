"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type LedgerEntry = {
  id: string;
  action: string;
  target?: string;
  system: string;
  icon?: React.ReactNode;
  at: number;
  change?: [React.ReactNode, React.ReactNode];
  detail?: React.ReactNode;
  reversible?: boolean;
  dependsOn?: string[];
};
export type AgentLedgerProps = {
  entries?: LedgerEntry[];
  agent?: string;
  now?: number;
  undone?: string[];
  defaultUndone?: string[];
  onUndo?: (ids: string[]) => void | Promise<void>;
  onRedo?: (ids: string[]) => void | Promise<void>;
  pointAt?: string | null;
  title?: string;
  className?: string;
};

/** Neutral system glyphs keyed by the demo system names; no brand marks. */
const logos: Record<string, React.ReactNode> = {
  "Имэйл": (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.8" y="3.2" width="12.4" height="9.6" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="m2.4 4.2 5.6 4.4 5.6-4.4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  "Багийн чат": (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  "Харилцагчийн бүртгэл": (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 13.5c.8-2.4 2.7-3.5 5-3.5s4.2 1.1 5 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  "Баримтын сан": (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 1.8h6l3 3v9.4h-9Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5.5 8h5M5.5 10.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  "Төлбөрийн систем": (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.8" y="3.5" width="12.4" height="9" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.8 6.5h12.4M4.5 10h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  "Үүлэн сервер": (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 12.5a3 3 0 0 1-.3-6 4 4 0 0 1 7.7-.7 3.4 3.4 0 0 1-.4 6.7Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  "Хувилбарын хяналт": (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="4.5" cy="3.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="4.5" cy="12.5" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.5" cy="6" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 5v6M11.5 7.5c0 2-2 2.6-6 3.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
};

const T0 = Date.now();
const defaultEntries: LedgerEntry[] = [
  { id: "email", action: "Имэйл илгээсэн", target: "3,812 харилцагч", system: "Имэйл", at: T0 - 37000, detail: "Шинэ тариф ба LAUNCH20 код", dependsOn: ["coupon"], reversible: false },
  { id: "slack", action: "#launch сувагт нийтэлсэн", target: "Шинэ тариф идэвхжлээ", system: "Багийн чат", at: T0 - 62000, detail: "Тарифын хуудасны холбоостой", dependsOn: ["deploy"] },
  { id: "deals", action: "212 гэрээ шинэчилсэн", target: "4-р улирлын сунгалтууд", system: "Харилцагчийн бүртгэл", at: T0 - 70000, change: ["5 хэрэглэгчийн эрх", "10 хэрэглэгчийн эрх"], dependsOn: ["price"] },
  { id: "faq", action: "Хуудас шинэчилсэн", target: "Тарифын түгээмэл асуулт", system: "Баримтын сан", at: T0 - 80000, change: ["3 хариулт", "3 хариултыг дахин бичсэн"], dependsOn: ["price"] },
  { id: "coupon", action: "Купон үүсгэсэн", target: "LAUNCH20", system: "Төлбөрийн систем", at: T0 - 125000, detail: "Эхний жилд 20% хөнгөлөлт · 7 хоногийн дараа дуусна" },
  { id: "price", action: "Багцын хязгаар өөрчилсөн", target: "Про багц", system: "Төлбөрийн систем", at: T0 - 130000, change: ["сард 20 ажил", "сард 30 ажил"] },
  { id: "deploy", action: "Байршуулсан", target: "вэб сайт", system: "Үүлэн сервер", at: T0 - 185000, change: ["#481", "#483 үндсэн орчинд"], dependsOn: ["merge"] },
  { id: "merge", action: "#482 өөрчлөлтийг нэгтгэсэн", target: "Тарифын хуудас v2", system: "Хувилбарын хяналт", at: T0 - 190000, change: ["pricing-v2", "үндсэн салбар"] },
];

/** Dependency traversal follows ids, never the current display order. Cycles terminate. */
function ledgerDependents(entries: LedgerEntry[], id: string) {
  const affected = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const entry of entries) {
      if (!affected.has(entry.id) && entry.dependsOn?.some((parent) => affected.has(parent))) {
        affected.add(entry.id);
        changed = true;
      }
    }
  }
  return affected;
}

const UndoIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5.5 3.5 3 6l2.5 2.5M3.5 6h6a3.5 3.5 0 0 1 0 7H7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const RedoIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M10.5 3.5 13 6l-2.5 2.5M12.5 6h-6a3.5 3.5 0 0 0 0 7H9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function AgentLedger({
  entries = defaultEntries,
  agent = entries === defaultEntries ? "Нээлтийн агент" : undefined,
  now,
  undone,
  defaultUndone = [],
  onUndo,
  onRedo,
  pointAt,
  title = "Өөрчлөлтийн бүртгэл",
  className = "",
}: AgentLedgerProps) {
  const [internal, setInternal] = React.useState(defaultUndone);
  const removed = undone ?? internal;
  const [hover, setHover] = React.useState<string | null>(null);
  const [clock, setClock] = React.useState(Date.now);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [announcement, setAnnouncement] = React.useState("");
  const locked = React.useRef(false);
  const mounted = React.useRef(true);
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  React.useEffect(() => {
    if (now !== undefined) return;
    const timer = window.setInterval(() => setClock(Date.now()), 10000);
    return () => window.clearInterval(timer);
  }, [now]);
  const active = pointAt === undefined ? hover : pointAt;
  const affected = active ? ledgerDependents(entries, active) : new Set<string>();
  const sorted = [...entries].sort((a, b) => b.at - a.at);
  const titleId = React.useId();

  const perform = async (entry: LedgerEntry, redo: boolean) => {
    if (locked.current || entry.reversible === false) return;
    if (redo && entry.dependsOn?.some((id) => removed.includes(id))) return;
    const chain = ledgerDependents(entries, entry.id);
    const ids = entries
      .filter((v) => chain.has(v.id) && v.reversible !== false && removed.includes(v.id) === redo)
      .map((v) => v.id);
    if (!ids.length) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      await (redo ? onRedo : onUndo)?.(ids);
      if (!mounted.current) return;
      if (undone === undefined)
        setInternal((cur) => (redo ? cur.filter((id) => !ids.includes(id)) : [...new Set([...cur, ...ids])]));
      setAnnouncement(`${ids.length} өөрчлөлтийг ${redo ? "сэргээлээ" : "буцаалаа"}.`);
    } catch (failure) {
      if (mounted.current)
        setError(failure instanceof Error ? failure.message : "Эдгээр өөрчлөлтийг шинэчилж чадсангүй. Дахин оролдоно уу.");
    } finally {
      locked.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const relative = (at: number) => {
    const s = Math.max(0, Math.floor(((now ?? clock) - at) / 1000));
    return s < 60 ? `${s} с өмнө` : s < 3600 ? `${Math.floor(s / 60)} мин өмнө` : s < 86400 ? `${Math.floor(s / 3600)} цаг өмнө` : `${Math.floor(s / 86400)} өдрийн өмнө`;
  };

  return (
    <section className={`ldg ${className}`}>
      <style>{css}</style>
      <header className="ldg-bar">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="ldg-bar-ico">
          <rect x="2.5" y="2" width="11" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <span id={titleId} className="ldg-title">{title}</span>
        {agent && <span className="ldg-agent">{agent}</span>}
        <span className="ldg-count">
          <strong>{entries.length}</strong> өөрчлөлт
        </span>
      </header>
      <div className="ldg-card">
        {!entries.length ? (
          <p className="ldg-empty">Өөрчлөлт алга</p>
        ) : (
          <ol className="ldg-list" aria-labelledby={titleId} aria-busy={busy}>
            {sorted.map((entry) => {
              const isUndone = removed.includes(entry.id);
              const dependencyUndone = entry.dependsOn?.some((id) => removed.includes(id));
              const chain = ledgerDependents(entries, entry.id);
              const dependents = entries.filter(
                (v) => v.id !== entry.id && chain.has(v.id) && v.reversible !== false && !removed.includes(v.id),
              );
              const lit = affected.has(entry.id) && entry.id !== active;
              const flag =
                lit && entry.reversible === false
                  ? "kept"
                  : lit && !isUndone
                    ? "also"
                    : entry.reversible === false && dependencyUndone
                      ? "kept"
                      : null;
              return (
                <li
                  key={entry.id}
                  className="ldg-row"
                  data-undone={isUndone}
                  data-active={entry.id === active}
                  data-flag={flag ?? undefined}
                >
                  <span className="ldg-logo" aria-hidden="true">
                    {entry.icon ?? logos[entry.system] ?? entry.system.slice(0, 1)}
                  </span>
                  <div className="ldg-text">
                    <div className="ldg-l1">
                      <span className="ldg-action">{entry.action}</span>
                      {entry.target && <span className="ldg-target">{entry.target}</span>}
                    </div>
                    <div className="ldg-l2">
                      {entry.change ? (
                        <>
                          <s>{entry.change[0]}</s>
                          <span className="ldg-arrow" aria-label="болсон нь">
                            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9m-3-3 3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                          </span>
                          <span>{entry.change[1]}</span>
                        </>
                      ) : (
                        entry.detail
                      )}
                    </div>
                  </div>
                  <div className="ldg-slot">
                    {flag === "also" && <span className="ldg-flag ldg-also">Хамт буцна</span>}
                    {flag === "kept" && (
                      <span className="ldg-flag ldg-kept">
                        <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
                        Буцаах боломжгүй
                      </span>
                    )}
                    {!flag && (
                      <span className="ldg-time">
                        {relative(entry.at)}
                        <span className="ldg-sys"> · {entry.system}</span>
                      </span>
                    )}
                    {entry.reversible !== false && !flag && (
                      <button
                        type="button"
                        className="ldg-btn"
                        aria-label={`${isUndone ? "Дахин хийх" : "Буцаах"}: ${entry.action}${!isUndone && dependents.length ? `, хамааралтай ${dependents.length} өөрчлөлтийн хамт` : ""}`}
                        aria-disabled={busy || (isUndone && !!dependencyUndone)}
                        title={isUndone && dependencyUndone ? "Эхлээд хамаарлыг нь сэргээнэ үү" : undefined}
                        onMouseEnter={() => setHover(entry.id)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(entry.id)}
                        onBlur={() => setHover(null)}
                        onClick={() => void perform(entry, isUndone)}
                      >
                        {isUndone ? <RedoIcon /> : <UndoIcon />}
                        <span className="ldg-btn-label">{isUndone ? "Дахин хийх" : "Буцаах"}</span>
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
      {error && (
        <p role="alert" className="ldg-error">
          {error}
        </p>
      )}
      <span role="status" className="ldg-sr">
        {announcement}
      </span>
    </section>
  );
}

const css = `
.ldg{--ui-ldgc-bg:#fff;--ui-ldgc-fg:#18181b;--ui-ldgc-muted:#65656d;--ui-ldgc-faint:#65656d;--ui-ldgc-line:#ececef;--ui-ldgc-logo-bg:#fafafa;--ui-ldgc-accent:#4f7cf0;--ui-ldgc-also-bg:#eef3ff;--ui-ldgc-also-fg:#3b6be0;--ui-ldgc-kept-bg:#fdf3e2;--ui-ldgc-kept-fg:#b4741a;--ui-ldgc-red:#d14343;container:ldg/inline-size;width:100%;max-width:640px;color:var(--ui-ldgc-fg);font:400 12.5px/1.45 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .ldg{--ui-ldgc-bg:#1b1b1e;--ui-ldgc-fg:#ececef;--ui-ldgc-muted:#a1a1aa;--ui-ldgc-faint:#9a9aa2;--ui-ldgc-line:#2c2c31;--ui-ldgc-logo-bg:#232327;--ui-ldgc-accent:#7c9cff;--ui-ldgc-also-bg:#1f2a44;--ui-ldgc-also-fg:#8fb0ff;--ui-ldgc-kept-bg:#3a2c14;--ui-ldgc-kept-fg:#e7b35f;color-scheme:dark}
.ldg *{box-sizing:border-box}
.ldg-bar{display:flex;align-items:center;gap:8px;padding:0 2px 10px;font-size:13px}
.ldg-bar-ico{width:15px;height:15px;color:var(--ui-ldgc-accent)}
.ldg-title{font-weight:500}.ldg-agent{color:var(--ui-ldgc-muted)}
.ldg-count{margin-left:auto;font-size:12px;color:var(--ui-ldgc-muted)}.ldg-count strong{color:var(--ui-ldgc-fg);font-weight:600}
.ldg-card{background:var(--ui-ldgc-bg);border:1px solid var(--ui-ldgc-line);border-radius:10px;box-shadow:0 1px 2px #0000000a;overflow:hidden}
.ldg-list{list-style:none;margin:0;padding:0}
.ldg-row{position:relative;display:flex;align-items:center;gap:12px;height:56px;padding:0 16px 0 14px;border-bottom:1px solid var(--ui-ldgc-line);transition:background .18s;animation:ldg-in .35s both}
.ldg-row:last-child{border-bottom:0}
.ldg-row[data-active=true]{background:color-mix(in srgb,var(--ui-ldgc-fg) 3%,transparent)}
.ldg-row[data-flag=also]{background:var(--ui-ldgc-also-bg)}
.ldg-row[data-flag=kept]{background:var(--ui-ldgc-kept-bg)}
.ldg-logo{display:grid;place-items:center;flex:none;width:28px;height:28px;border:1px solid color-mix(in srgb,var(--ui-ldgc-line) 60%,transparent);border-radius:7px;background:var(--ui-ldgc-logo-bg);font-size:11px;font-weight:600;transition:filter .3s,opacity .3s}
.ldg-logo svg{width:15px;height:15px}
.ldg-text{flex:1;min-width:0}
.ldg-l1,.ldg-l2{display:flex;align-items:center;gap:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ldg-action{font-weight:500}.ldg-target{color:var(--ui-ldgc-muted);overflow:hidden;text-overflow:ellipsis}
.ldg-l2{font-size:11.5px;color:var(--ui-ldgc-muted);margin-top:1px}
.ldg-l2 s{color:var(--ui-ldgc-faint)}.ldg-l2>span:last-child{color:var(--ui-ldgc-fg)}
.ldg-arrow{display:inline-flex;color:var(--ui-ldgc-faint)!important}.ldg-arrow svg{width:12px;height:12px}
.ldg-slot{position:relative;display:flex;align-items:center;justify-content:flex-end;flex:none;min-width:120px;height:30px}
.ldg-time{font-size:12px;color:var(--ui-ldgc-muted);white-space:nowrap;transition:opacity .15s}
.ldg-btn{position:absolute;right:0;top:50%;transform:translateY(-50%);display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 10px;border:1px solid var(--ui-ldgc-line);border-radius:7px;background:var(--ui-ldgc-bg);color:var(--ui-ldgc-fg);font:500 12px/1 inherit;font-family:inherit;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .15s,background .15s}
.ldg-btn svg{width:14px;height:14px}
.ldg-btn:hover{background:color-mix(in srgb,var(--ui-ldgc-fg) 5%,var(--ui-ldgc-bg))}
.ldg-btn[aria-disabled=true]{opacity:.45!important;cursor:not-allowed}
.ldg-row:hover .ldg-btn,.ldg-btn:focus-visible,.ldg-row[data-undone=true] .ldg-btn{opacity:1;pointer-events:auto}
.ldg-row:hover .ldg-time,.ldg-row:focus-within .ldg-time,.ldg-row[data-undone=true] .ldg-time{opacity:0}
.ldg-flag{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 8px;border-radius:6px;font-size:11.5px;font-weight:500;white-space:nowrap}
.ldg-flag svg{width:12px;height:12px}
.ldg-also{color:var(--ui-ldgc-also-fg);background:color-mix(in srgb,var(--ui-ldgc-also-fg) 12%,transparent)}
.ldg-kept{color:var(--ui-ldgc-kept-fg);background:color-mix(in srgb,var(--ui-ldgc-kept-fg) 14%,transparent)}
.ldg-row[data-undone=true] .ldg-text{color:var(--ui-ldgc-faint)}
.ldg-row[data-undone=true] .ldg-text *{color:var(--ui-ldgc-faint)!important}
.ldg-row[data-undone=true] .ldg-logo{filter:grayscale(1);opacity:.55}
.ldg-row[data-undone=true]::after{content:"";position:absolute;left:54px;right:150px;top:50%;height:1px;background:var(--ui-ldgc-faint);transform-origin:left;animation:ldg-strike .4s both}
.ldg-empty{margin:0;padding:28px;text-align:center;color:var(--ui-ldgc-muted)}
.ldg-error{margin:8px 2px 0;color:var(--ui-ldgc-red);font-size:12px}
.ldg-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.ldg :focus-visible{outline:2px solid var(--ui-ldgc-accent);outline-offset:2px}
@keyframes ldg-in{from{opacity:0;transform:translateY(-4px)}}
@keyframes ldg-strike{from{transform:scaleX(0)}}
@media(hover:none){.ldg-btn{opacity:1;pointer-events:auto}.ldg-time{opacity:0}}
@container ldg (max-width:480px){.ldg-row{height:64px;padding:0 12px}.ldg-sys{display:none}.ldg-slot{min-width:56px}.ldg-btn{width:30px;padding:0;justify-content:center;border-radius:50%}.ldg-btn-label{display:none}.ldg-l2{flex-wrap:wrap}.ldg-row[data-undone=true]::after{right:70px}}
@media(prefers-reduced-motion:reduce){.ldg *,.ldg *::after,.ldg-row::after{animation:none!important;transition:none!important}}
`;

export default AgentLedger;
