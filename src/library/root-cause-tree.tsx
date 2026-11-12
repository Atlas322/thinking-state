"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type CauseStatus = "open" | "checking" | "ruled-out" | "confirmed";

export type Cause = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  files?: string[];
  gate?: "or" | "and";
  status?: CauseStatus;
  verdict?: string;
  evidence?: { kind: string; source?: string; content: string };
  /** Milliseconds since the run started. */
  at?: number;
  children?: Cause[];
};

export type RootCauseTreeProps = {
  title?: string;
  failure?: Cause & { detail?: string };
  onAction?: (cause: Cause, action: "fix" | "retry") => void;
  formatTime?: (ms: number) => string;
  className?: string;
};

const card = (
  <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3.5" width="13" height="9" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M1.5 6.5h13M4 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
);
const branch = (
  <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5" cy="3.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" /><circle cx="5" cy="12.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" /><circle cx="11" cy="6" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M5 5.1v5.8M11 7.6c0 2-2 2.4-6 3.3" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
);
const db = (
  <svg viewBox="0 0 16 16" aria-hidden="true"><ellipse cx="8" cy="4" rx="5" ry="2" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
);
const flask = (
  <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M5 7h6M5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
);

const defaultFailure: Cause & { detail?: string } = {
  id: "checkout",
  title: "Төлбөрийн тестүүд унаж байна",
  icon: flask,
  files: ["checkout.test.ts"],
  detail: "12-оос 4",
  gate: "or",
  status: "checking",
  children: [
    {
      id: "coupon",
      title: "Купон тооцогдохгүй байна",
      icon: card,
      files: ["app/checkout/coupon.ts", "app/cart/total.ts"],
      gate: "and",
      status: "checking",
      children: [
        { id: "amount", title: "Дүн хэлбэрээр илгээгдэж байна", icon: card, files: ["coupon.ts"], status: "checking" },
        { id: "cart", title: "Сагс купоныг хаядаг", icon: branch, files: ["total.ts", "cart.ts"], status: "open" },
      ],
    },
    { id: "payments", title: "Төлбөрийн системийн алдаа", icon: card, files: ["payments.log"], status: "ruled-out", at: 177000, verdict: "Ажиллах хугацаанд 4xx, 5xx хариу ирээгүй." },
    { id: "fixtures", title: "Хуучирсан туршилтын өгөгдөл", icon: db, files: ["plans.json"], status: "ruled-out", at: 189000, verdict: "Туршилтын багцууд бодит орчинтой таарч байна." },
  ],
};

const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}`;
const base = (f: string) => f.split("/").pop() ?? f;

const FileIco = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5h4l2 2v7H3Z" fill="currentColor" opacity=".55" /></svg>
);

const statusText: Record<CauseStatus, string> = { open: "Шалгаагүй", checking: "Шалгаж байна", "ruled-out": "Үгүйсгэсэн", confirmed: "Үндсэн шалтгаан" };
const gateText = { or: "эсвэл", and: "ба" } as const;

function count(c: Cause): { all: number; out: number } {
  return (c.children ?? []).reduce(
    (acc, k) => {
      const s = count(k);
      return { all: acc.all + 1 + s.all, out: acc.out + (k.status === "ruled-out" ? 1 : 0) + s.out };
    },
    { all: 0, out: 0 },
  );
}

export function RootCauseTree({ title = "Үндсэн шалтгаан", failure = defaultFailure, onAction, formatTime = fmt, className = "" }: RootCauseTreeProps) {
  const findFirst = (c: Cause): Cause | undefined => {
    for (const k of c.children ?? []) {
      if (k.status === "checking" || k.status === "confirmed") return k;
    }
    return c.children?.[0];
  };
  const [selected, setSelected] = React.useState<string | undefined>(() => findFirst(failure)?.id);
  const all: Cause[] = [];
  const walk = (c: Cause) => {
    all.push(c);
    c.children?.forEach(walk);
  };
  walk(failure);
  const sel = all.find((c) => c.id === selected);
  const { all: hyp, out } = count(failure);
  const confirmed = all.some((c) => c.status === "confirmed" && !c.children?.length);

  const card = (c: Cause, root = false) => {
    const st = c.status ?? "open";
    const files = c.files ?? [];
    return (
      <button
        type="button"
        className={`rct-card is-${st}${root ? " is-root" : ""}${selected === c.id ? " is-selected" : ""}`}
        aria-pressed={selected === c.id}
        onClick={() => setSelected(c.id)}
      >
        <span className="rct-title">
          {c.icon && <span className="rct-ico">{c.icon}</span>}
          <span className={st === "checking" ? "rct-shimmer" : ""}>{c.title}</span>
        </span>
        {files.length > 0 && (
          <span className="rct-files">
            <span className="rct-file"><FileIco />{base(files[0])}</span>
            {files.length > 1 && <span className="rct-plus">+{files.length - 1}</span>}
          </span>
        )}
        {root ? (
          <span className="rct-status">
            <svg className="rct-warn" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 14.5 13.5h-13Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M8 6.5v3M8 11.5v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            <span className="rct-failed">Алдаатай</span>
            {failure.detail && <span>{failure.detail}</span>}
            <span className="rct-right">{confirmed ? "Олдсон" : "Судалж байна"}</span>
          </span>
        ) : (
          <span className="rct-status">
            <span className={`rct-mark is-${st}`} aria-hidden="true" />
            {statusText[st]}
            {c.at !== undefined && st !== "checking" && st !== "open" && ` · ${formatTime(c.at)}`}
          </span>
        )}
      </button>
    );
  };

  const branch = (c: Cause, root = false): React.ReactNode => {
    const kids = c.children ?? [];
    return (
      <li key={c.id} className={`rct-node is-${c.status ?? "open"}`}>
        {card(c, root)}
        {kids.length > 0 && (
          <>
            <span className="rct-gate">{gateText[c.gate ?? "or"].toUpperCase()}</span>
            <ul className={`rct-kids${kids.length === 1 ? " is-single" : ""}`}>{kids.map((k) => branch(k))}</ul>
          </>
        )}
      </li>
    );
  };

  return (
    <section className={`rct ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="rct-bar">
        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="3.5" r="1.8" fill="currentColor" /><circle cx="3.5" cy="12.5" r="1.8" fill="currentColor" /><circle cx="12.5" cy="12.5" r="1.8" fill="currentColor" /><path d="M8 5.5v3M3.5 10.5V8.5h9v2" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
        <strong>{title}</strong>
        <span className={`rct-badge${confirmed ? " is-found" : ""}`}>
          {!confirmed && <span className="rct-spin" aria-hidden="true" />}
          {confirmed ? "Олдсон" : "Судалж байна"}
        </span>
        <span className="rct-count">
          {hyp} таамаглал · {out} үгүйсгэсэн
        </span>
      </header>
      <div className="rct-scroll">
        <ul className="rct-tree">{branch(failure, true)}</ul>
      </div>
      {sel && sel !== failure && (
        <div className="rct-evidence" aria-live="polite">
          <div className="rct-ev-head">
            <span className="rct-title">
              {sel.icon && <span className="rct-ico">{sel.icon}</span>}
              {sel.title}
            </span>
            <span className="rct-ev-st">{statusText[sel.status ?? "open"]}</span>
          </div>
          <p className="rct-ev-text">
            {sel.verdict ?? (sel.status === "checking" ? "Одоо шалгаж байна…" : sel.status === "open" ? "Хараахан шалгаагүй." : "")}
          </p>
          {sel.evidence && (
            <pre className="rct-ev-code">
              <span>{sel.evidence.kind}{sel.evidence.source ? ` · ${sel.evidence.source}` : ""}</span>
              {sel.evidence.content}
            </pre>
          )}
          {sel.files && (
            <div className="rct-files">
              {sel.files.map((f) => (
                <span key={f} className="rct-file"><FileIco />{f}</span>
              ))}
            </div>
          )}
          {onAction && sel.status === "confirmed" && (
            <div className="rct-ev-act">
              <button type="button" onClick={() => onAction(sel, "retry")}>Эндээс дахин оролдох</button>
              <button type="button" className="is-dark" onClick={() => onAction(sel, "fix")}>Засах</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

const css = `
.rct{--rct-bg:#fff;--rct-fg:#18181b;--rct-muted:#71717a;--rct-faint:#a1a1aa;--rct-line:#e6e6e9;--rct-chip:#f1f1f3;--rct-blue:#3b82f6;--rct-blue-soft:#e8f1fe;--rct-red:#e5484d;--rct-red-soft:#fdecec;--rct-green:#16a34a;width:100%;max-width:700px;color:var(--rct-fg);font:400 14px/1.45 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .rct{--rct-bg:#1b1b1e;--rct-fg:#ececef;--rct-muted:#a1a1aa;--rct-faint:#71717a;--rct-line:#2e2e33;--rct-chip:#2a2a2f;--rct-blue:#5b9cff;--rct-blue-soft:#1b2a44;--rct-red:#ff6b6f;--rct-red-soft:#3a1d1f;--rct-green:#4ade80;color-scheme:dark}
.rct *{box-sizing:border-box}.rct button{font:inherit;color:inherit;cursor:pointer}
.rct-bar{display:flex;align-items:center;gap:8px;padding:0 4px 14px}
.rct-bar>svg{width:14px;height:14px;color:var(--rct-muted)}.rct-bar strong{flex:1;font-weight:500}
.rct-badge{display:inline-flex;align-items:center;gap:4px;height:18px;padding:0 5px;border-radius:4px;background:var(--rct-blue-soft);color:var(--rct-blue);font-size:11px;font-weight:500}
.rct-badge.is-found{background:color-mix(in srgb,var(--rct-green) 14%,transparent);color:var(--rct-green)}
.rct-spin{width:8px;height:8px;border-radius:50%;border:1.3px solid color-mix(in srgb,currentColor 30%,transparent);border-top-color:currentColor;animation:rct-rot .9s linear infinite}
.rct-count{margin-left:8px;font-size:12px;color:var(--rct-muted)}
.rct-scroll{overflow-x:auto;padding-bottom:4px}
.rct-tree,.rct-kids{list-style:none;margin:0;padding:0;display:flex;justify-content:center}
.rct-node{position:relative;display:flex;flex-direction:column;align-items:center;padding:0 4px}
.rct-kids{position:relative;padding-top:14px}
.rct-kids>.rct-node{padding-top:14px}
.rct-kids>.rct-node::before{content:"";position:absolute;top:0;left:0;right:0;border-top:1.5px solid var(--rct-line)}
.rct-kids>.rct-node:first-child::before{left:50%}.rct-kids>.rct-node:last-child::before{right:50%}
.rct-kids.is-single>.rct-node::before{display:none}
.rct-kids>.rct-node::after{content:"";position:absolute;top:0;left:50%;height:14px;border-left:1.5px solid var(--rct-line)}
.rct-kids>.rct-node:first-child::after{border-top-left-radius:6px}
.rct-kids>.rct-node.is-ruled-out::before{border-top-style:dashed}.rct-kids>.rct-node.is-ruled-out::after{border-left-style:dashed}
.rct-kids>.rct-node:first-child::before{border-top-left-radius:6px}.rct-kids>.rct-node:last-child::before{border-top-right-radius:6px}
.rct-kids::before{content:"";position:absolute;top:0;left:50%;height:14px;border-left:1.5px solid var(--rct-line)}
.rct-gate{position:relative;z-index:1;margin-top:6px;margin-bottom:-14px;height:16px;padding:0 5px;border:1px solid var(--rct-line);border-radius:4px;background:var(--rct-bg);font-size:9.5px;font-weight:600;letter-spacing:.06em;line-height:14px;color:var(--rct-muted)}
.rct-gate+.rct-kids{padding-top:14px}
.rct-card{display:flex;flex-direction:column;align-items:flex-start;gap:5px;width:162px;padding:10px 10px 9px;border:1px solid var(--rct-line);border-radius:8px;background:var(--rct-bg);box-shadow:0 1px 2px #0000000a;text-align:left;transition:border-color .15s,opacity .2s;animation:rct-in .3s both}
.rct-card.is-root{width:204px}
.rct-card:hover{border-color:color-mix(in srgb,var(--rct-fg) 25%,transparent)}
.rct-card.is-selected{border-color:color-mix(in srgb,var(--rct-fg) 30%,transparent)}
.rct-card.is-ruled-out{box-shadow:none;background:color-mix(in srgb,var(--rct-bg) 55%,transparent)}.rct-card.is-ruled-out .rct-files,.rct-card.is-ruled-out .rct-status{opacity:.8}
.rct-card.is-ruled-out .rct-title{color:var(--rct-muted)}.rct-card.is-ruled-out .rct-ico{filter:grayscale(1);opacity:.6}
.rct-card.is-confirmed{border-color:var(--rct-green)}
.rct-title{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:400;line-height:1.3}
.rct-ico{display:grid;place-items:center;width:14px;height:14px;flex:none}.rct-ico svg{width:13px;height:13px}
.rct-shimmer{background:linear-gradient(90deg,var(--rct-fg) 40%,var(--rct-faint) 50%,var(--rct-fg) 60%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:rct-sh 2s linear infinite}
.rct-files{display:flex;flex-wrap:wrap;align-items:center;gap:4px}
.rct-file{display:inline-flex;align-items:center;gap:4px;height:18px;padding:0 5px;border-radius:4px;background:var(--rct-chip);font-size:11px;color:color-mix(in srgb,var(--rct-fg) 80%,transparent)}
.rct-file svg{width:9px;height:9px;color:var(--rct-faint)}
.rct-plus{font-size:11px;color:var(--rct-muted)}
.rct-status{display:flex;align-items:center;gap:6px;width:100%;font-size:11px;color:var(--rct-muted)}
.rct-right{margin-left:auto}
.rct-warn{width:12px;height:12px;color:var(--rct-red)}
.rct-failed{padding:0 4px;border-radius:3px;background:var(--rct-red-soft);color:var(--rct-red)}
.rct-mark{width:8px;height:8px;border-radius:50%;border:1.2px solid var(--rct-faint)}
.rct-mark.is-checking{border-color:color-mix(in srgb,var(--rct-muted) 30%,transparent);border-top-color:var(--rct-muted);animation:rct-rot .9s linear infinite}
.rct-mark.is-ruled-out{border:0;width:8px;height:8px;background:linear-gradient(45deg,transparent 44%,var(--rct-faint) 44% 56%,transparent 56%),linear-gradient(-45deg,transparent 44%,var(--rct-faint) 44% 56%,transparent 56%)}
.rct-mark.is-confirmed{border:0;background:var(--rct-green)}
.rct-evidence{margin-top:16px;padding:14px;border:1px solid var(--rct-line);border-radius:8px;background:var(--rct-bg);box-shadow:0 1px 2px #0000000a;animation:rct-in .25s both}
.rct-ev-head{display:flex;justify-content:space-between;align-items:center}
.rct-ev-st{font-size:12px;color:var(--rct-muted)}
.rct-ev-text{margin:6px 0 8px;font-size:13px;color:var(--rct-muted)}
.rct-ev-code{margin:0 0 8px;padding:8px 10px;border-radius:6px;background:var(--rct-chip);font:400 12px/1.5 ui-monospace,Menlo,monospace;white-space:pre-wrap}
.rct-ev-code span{display:block;margin-bottom:4px;font-family:Inter,system-ui,sans-serif;color:var(--rct-muted)}
.rct-ev-act{display:flex;gap:6px;justify-content:flex-end;margin-top:10px}
.rct-ev-act button{height:28px;padding:0 10px;border:1px solid var(--rct-line);border-radius:6px;background:var(--rct-bg);font-size:13px}
.rct-ev-act .is-dark{background:var(--rct-fg);border-color:var(--rct-fg);color:var(--rct-bg)}
.rct :focus-visible{outline:2px solid var(--rct-blue);outline-offset:2px}
@keyframes rct-in{from{opacity:0;transform:translateY(4px)}}
@keyframes rct-rot{to{transform:rotate(360deg)}}
@keyframes rct-sh{from{background-position:100% 0}to{background-position:-150% 0}}
@media(max-width:560px){.rct-card{width:140px}.rct-card.is-root{width:180px}.rct-count{display:none}}
@media(prefers-reduced-motion:reduce){.rct *{animation:none!important;transition:none!important}}
`;

export default RootCauseTree;
