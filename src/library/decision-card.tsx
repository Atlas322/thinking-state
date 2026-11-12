"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type DecisionOption = {
  id: string;
  title: string;
  summary?: string;
  recommended?: boolean;
  preview?: React.ReactNode;
  blocks?: string[];
};
export type Decision = {
  id: string;
  question: string;
  task?: string;
  kind?: "decision" | "pick" | "approval";
  options?: DecisionOption[];
  facts?: { label: string; value: string }[];
};
export type DecisionAnswer = { option: string } | { text: string } | "approve" | "decline";
export type DecisionCardLabels = {
  needsYou: string;
  later: string;
  show: string;
  recommended: string;
  approve: string;
  decline: string;
  own: string;
  waiting: (n: number) => string;
  of: (i: number, n: number) => string;
  close: string;
  closeReason: string;
  confirmClose: string;
  cancel: string;
};
export type DecisionCardProps = {
  decisions?: Decision[];
  onDecide?: (id: string, answer: DecisionAnswer) => void;
  onLater?: (id: string) => void;
  defaultFolded?: boolean;
  reveal?: number;
  labels?: Partial<DecisionCardLabels>;
  className?: string;
  /** Host mode: the card stays after an answer (the host removes it when its request succeeds) and the question is not clamped. */
  host?: boolean;
  /** Host mode: a request is in flight — answers are ignored. */
  busy?: boolean;
  error?: React.ReactNode;
  /** Host content under the question (links, who asked). */
  meta?: React.ReactNode;
  /** Shows a close action; the field then takes an optional reason. */
  onClose?: (id: string, reason: string) => void;
};

const baseLabels: DecisionCardLabels = {
  needsYou: "Таны ээлж",
  later: "Дараа",
  show: "Харах",
  recommended: "Санал болгосон",
  approve: "Батлах",
  decline: "Татгалзах",
  own: "Өөр хариулт…",
  waiting: (n) => `${n} шийдвэр хүлээж байна`,
  of: (i, n) => `${i}/${n}`,
  close: "Хаах",
  closeReason: "Яагаад хаах вэ? (заавал биш)",
  confirmClose: "Хаах",
  cancel: "Болих",
};

const defaultDecisions: Decision[] = [
  {
    id: "weekly",
    kind: "approval",
    task: "Долоо хоногийн тайлан",
    question: "Долоо хоногийн тайланг Хойд салхи ХХК руу илгээх үү?",
    facts: [
      { label: "Хэнд", value: "Дулмаа Рэнцэн, Хойд салхи ХХК" },
      { label: "Гарчиг", value: "45-р долоо хоног: өгөгдөл татах ажил эхэлсэн, самбар хянагдаж байна" },
      { label: "Агуулга", value: "Өгөгдөл татах үйлчилгээ туршилтын орчинд ажиллаж, мягмар гарагийн оргил ачааллыг нэг ч үйл явдал алдалгүй даалаа. Самбарыг Дулмаагийн баг хянаж байна." },
    ],
  },
];

type Row = { key: string; title: string; summary?: string; recommended?: boolean; answer: DecisionAnswer };

export function DecisionCard({
  decisions = defaultDecisions,
  onDecide,
  onLater,
  defaultFolded = false,
  reveal,
  labels: labelsProp,
  className = "",
  host = false,
  busy = false,
  error,
  meta,
  onClose,
}: DecisionCardProps) {
  const L = { ...baseLabels, ...labelsProp };
  const [answered, setAnswered] = React.useState<string[]>([]);
  const open = decisions.filter((d) => !answered.includes(d.id));
  const [page, setPage] = React.useState(0);
  const [folded, setFolded] = React.useState(defaultFolded);
  const [focus, setFocus] = React.useState(0);
  const [text, setText] = React.useState("");
  const [said, setSaid] = React.useState("");
  const [pulse, setPulse] = React.useState(0);
  const [closing, setClosing] = React.useState(false);
  const rowsRef = React.useRef<(HTMLElement | null)[]>([]);
  const fieldRef = React.useRef<HTMLInputElement>(null);
  const showRef = React.useRef<HTMLButtonElement>(null);
  const qid = React.useId();
  const idx = Math.min(page, Math.max(0, open.length - 1));
  const d = open[idx];

  React.useEffect(() => {
    if (reveal === undefined) return;
    setFolded(false);
    setPulse((p) => p + 1);
    window.setTimeout(() => rowsRef.current[focus]?.focus(), 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal]);

  const rows: Row[] = !d
    ? []
    : d.kind === "approval"
      ? [
          { key: "approve", title: L.approve, answer: "approve" },
          { key: "decline", title: L.decline, answer: "decline" },
        ]
      : (d.options ?? []).map((o) => ({ key: o.id, title: o.title, summary: o.summary, recommended: o.recommended, answer: { option: o.id } }));

  const answer = (a: DecisionAnswer) => {
    if (!d || busy) return;
    if (host) {
      setText("");
      onDecide?.(d.id, a);
      return;
    }
    const left = open.length - 1;
    const what = a === "approve" ? L.approve : a === "decline" ? L.decline : "text" in a ? a.text : rows.find((r) => typeof r.answer === "object" && "option" in r.answer && r.answer.option === a.option)?.title;
    setAnswered((s) => [...s, d.id]);
    setText("");
    setFocus(0);
    setSaid(left ? `Хариулт бүртгэгдлээ: ${what}. ${L.waiting(left)}.` : "Хариулт бүртгэгдлээ");
    onDecide?.(d.id, a);
    window.setTimeout(() => (left ? rowsRef.current[0]?.focus() : undefined), 30);
  };

  const later = () => {
    if (!d) return;
    setFolded(true);
    setSaid(`${L.later}. ${L.waiting(open.length)}.`);
    onLater?.(d.id);
    window.setTimeout(() => showRef.current?.focus(), 30);
  };

  const n = rows.length;
  const move = (to: number) => {
    const t = Math.max(0, Math.min(n, to));
    setFocus(t);
    (t === n ? fieldRef.current : rowsRef.current[t])?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const inField = e.target === fieldRef.current;
    if (e.key === "Escape") {
      e.preventDefault();
      later();
      return;
    }
    if (!inField && /^[1-5]$/.test(e.key)) {
      const k = Number(e.key) - 1;
      if (k < n) answer(rows[k].answer);
      else if (k === n) move(n);
      e.preventDefault();
      return;
    }
    if (inField) {
      if (e.key === "ArrowUp" && !text) {
        e.preventDefault();
        move(n - 1);
      }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowRight") (e.preventDefault(), move(focus + 1));
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") (e.preventDefault(), move(focus - 1));
    else if (e.key === "Home") (e.preventDefault(), move(0));
    else if (e.key === "End") (e.preventDefault(), move(n - 1));
    else if ((e.key === "Enter" || e.key === " ") && focus < n) (e.preventDefault(), answer(rows[focus].answer));
  };

  if (!open.length)
    return (
      <div className={`dc dc-gone ${className}`}>
        <style>{css}</style>
        <span role="status" aria-live="polite" className="dc-sr">{said}</span>
      </div>
    );

  if (folded)
    return (
      <div className={`dc ${className}`}>
        <style>{css}</style>
        <div className="dc-folded">
          <span className="dc-pill">{L.needsYou}</span>
          <span>{L.waiting(open.length)}</span>
          <span className="dc-dot">·</span>
          <button ref={showRef} type="button" className="dc-link" onClick={() => { setFolded(false); window.setTimeout(() => rowsRef.current[0]?.focus(), 30); }}>
            {L.show}
          </button>
        </div>
        <span role="status" aria-live="polite" className="dc-sr">{said}</span>
      </div>
    );

  const isPick = d.kind === "pick";
  return (
    <div className={`dc ${className}`}>
      <style>{css}</style>
      <section key={`${d.id}-${pulse}`} className="dc-card" data-pulse={pulse > 0} role="group" aria-labelledby={qid} onKeyDown={onKey}>
        <header className="dc-head">
          <span className="dc-pill">{L.needsYou}</span>
          {d.task && <span className="dc-task">{d.task}</span>}
          <span className="dc-spacer" />
          {open.length > 1 && (
            <span className="dc-pager">
              <button type="button" aria-label="Өмнөх шийдвэр" disabled={idx === 0} onClick={() => setPage(idx - 1)}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 4-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </button>
              {L.of(idx + 1, open.length)}
              <button type="button" aria-label="Дараах шийдвэр" disabled={idx === open.length - 1} onClick={() => setPage(idx + 1)}>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </button>
            </span>
          )}
          {onClose && !closing && <button type="button" className="dc-later" disabled={busy} onClick={() => { setClosing(true); window.setTimeout(() => fieldRef.current?.focus(), 30); }}>{L.close}</button>}
          <button type="button" className="dc-later" aria-keyshortcuts="Escape" disabled={busy} onClick={later}>{L.later}</button>
        </header>
        <h3 id={qid} className="dc-q" data-full={host || undefined}>{d.question}</h3>
        {meta && <div className="dc-meta">{meta}</div>}
        {d.facts && (
          <dl className="dc-facts">
            {d.facts.map((f) => (
              <React.Fragment key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </React.Fragment>
            ))}
          </dl>
        )}
        <div className={isPick ? "dc-tiles" : "dc-rows"} role="listbox" aria-labelledby={qid}>
          {rows.map((r, i) => {
            const opt = d.options?.find((o) => o.id === r.key);
            return (
              <div
                key={r.key}
                ref={(el) => { rowsRef.current[i] = el; }}
                role="option"
                aria-selected={focus === i}
                aria-keyshortcuts={String(i + 1)}
                tabIndex={focus === i ? 0 : -1}
                aria-disabled={busy || undefined}
                className={isPick ? "dc-tile" : "dc-row"}
                onFocus={() => setFocus(i)}
                onClick={() => answer(r.answer)}
              >
                {isPick && opt?.preview && <div className="dc-preview">{opt.preview}</div>}
                <span className="dc-num" aria-hidden="true">{i + 1}</span>
                <span className="dc-body">
                  <span className="dc-title">
                    {r.title}
                    {r.recommended && <span className="dc-rec">{L.recommended}</span>}
                  </span>
                  {r.summary && <span className="dc-sum">{r.summary}</span>}
                </span>
              </div>
            );
          })}
        </div>
        <label className="dc-row dc-own">
          <span className="dc-num" aria-hidden="true">{n + 1}</span>
          <input
            ref={fieldRef}
            value={text}
            aria-label={L.own.replace("…", "")}
            aria-keyshortcuts={String(n + 1)}
            placeholder={closing ? L.closeReason : L.own}
            onFocus={() => setFocus(n)}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              if (closing) {
                e.preventDefault();
                if (!busy && d) onClose?.(d.id, text.trim());
              } else if (text.trim()) {
                e.preventDefault();
                answer({ text: text.trim() });
              }
            }}
          />
          {!closing && text.trim() && (
            <button type="button" className="dc-send" aria-label="Хариулт илгээх" onClick={() => answer({ text: text.trim() })}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M4 7.5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
        </label>
        {closing && (
          <div className="dc-closebar">
            <button type="button" className="dc-danger" disabled={busy} onClick={() => d && onClose?.(d.id, text.trim())}>{L.confirmClose}</button>
            <button type="button" className="dc-later" onClick={() => setClosing(false)}>{L.cancel}</button>
          </div>
        )}
        {error && <p className="dc-error" role="alert">{error}</p>}
      </section>
      <span role="status" aria-live="polite" className="dc-sr">{said}</span>
    </div>
  );
}

/** Demo: the card sitting just above a chat composer. */
export function DecisionCardDemo() {
  return (
    <div className="dc-demo">
      <p className="dc-status">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          {[2, 7, 12].flatMap((x, i) => [2, 7, 12].map((y, j) => (
            <rect key={`${i}${j}`} x={x} y={y} width="3" height="3" rx=".6" fill={(i + j) % 2 ? "#c084fc" : "#8b5cf6"} opacity={(i + j) % 3 === 1 ? 0.45 : 1} />
          )))}
        </svg>
        Тохиргооны жагсаалт – ажиллаж байна.
      </p>
      <DecisionCard />
      <div className="dc-composer">
        <div className="dc-ph">Юу ч хамаагүй асуу…</div>
        <div className="dc-tools">
          <span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </span>
          <span className="dc-req">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 8V3.8a1 1 0 0 1 2 0V7.5m0-.5V2.8a1 1 0 0 1 2 0V7.5m0-.3V3.8a1 1 0 0 1 2 0V9c0 3-1.6 4.5-4 4.5-2 0-3-1-4.2-3L2.6 8.6a1 1 0 0 1 1.6-1.1L5.5 9" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>
            Зөвшөөрөл хүсэх
          </span>
          <span className="dc-spacer" />
          <span className="dc-auto">Автомат <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg></span>
          <span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="6" y="2" width="4" height="7.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M4 8a4 4 0 0 0 8 0M8 12v2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </span>
          <span className="dc-sendbox">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3.5M4 7.5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </div>
    </div>
  );
}

const css = `
.dc,.dc-demo{--dc-bg:#fff;--dc-fg:#18181b;--dc-muted:#71717a;--dc-faint:#a1a1aa;--dc-line:#ececef;--dc-soft:#f4f4f5;--dc-hl:#f6f6f7;--dc-accent:#4f7cf0;--dc-amber:#c2620a;--dc-amber-bg:#fdefdc;--dc-red:#dc2626;font:400 12.5px/1.45 Inter,system-ui,sans-serif;color:var(--dc-fg)}
:where(.dark,[data-theme=dark]) :is(.dc,.dc-demo){--dc-bg:#1b1b1e;--dc-fg:#ececef;--dc-muted:#a1a1aa;--dc-faint:#71717a;--dc-line:#2c2c31;--dc-soft:#28282d;--dc-hl:#232327;--dc-accent:#7c9cff;--dc-amber:#eba659;--dc-amber-bg:#3a2a16;--dc-red:#f87171;color-scheme:dark}
.dc{width:100%}.dc *,.dc-demo *{box-sizing:border-box}.dc button{font:inherit;color:inherit;cursor:pointer}
.dc-card{background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:12px;box-shadow:0 1px 2px #0000000a,0 4px 14px -6px #0000001a;padding:10px 12px 10px;animation:dc-in .25s both}
.dc-card[data-pulse=true]{animation:dc-pulse .7s both}
.dc-head{display:flex;align-items:center;gap:8px;font-size:12px}
.dc-pill{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:5px;background:var(--dc-amber-bg);color:var(--dc-amber);font-size:11px;font-weight:500;white-space:nowrap}
.dc-task{color:var(--dc-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dc-spacer{flex:1}
.dc-later{border:0;background:none;padding:2px 4px;border-radius:5px;font-size:12px}.dc-later:hover{background:var(--dc-hl)}
.dc-pager{display:inline-flex;align-items:center;gap:2px;color:var(--dc-muted);font-size:12px}
.dc-pager button{display:grid;place-items:center;width:22px;height:22px;border:0;border-radius:5px;background:none}.dc-pager button:hover:not(:disabled){background:var(--dc-hl)}.dc-pager button:disabled{opacity:.35;cursor:default}.dc-pager svg{width:13px;height:13px}
.dc-q{margin:12px 0 8px;font-size:14px;font-weight:500;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dc-q[data-full=true]{display:block;-webkit-line-clamp:none;overflow:visible;white-space:pre-wrap}
.dc-meta{display:flex;flex-wrap:wrap;align-items:center;gap:2px 10px;margin:-2px 0 8px;color:var(--dc-muted);font-size:11.5px}.dc-meta a,.dc-meta button{color:var(--dc-accent);border:0;background:none;padding:0;text-decoration:none}.dc-meta a:hover,.dc-meta button:hover{text-decoration:underline}
.dc-closebar{display:flex;align-items:center;gap:8px;margin-top:6px}
.dc-danger{border:0;border-radius:6px;padding:3px 10px;background:var(--dc-red);color:#fff!important;font-size:12px;font-weight:500}
.dc-error{margin:6px 0 0;color:var(--dc-red);font-size:12px}
.dc [aria-disabled=true],.dc button:disabled{opacity:.5;cursor:default}
.dc-facts{display:grid;grid-template-columns:auto 1fr;gap:3px 20px;margin:0 0 8px}
.dc-facts dt{color:var(--dc-muted)}.dc-facts dd{margin:0;min-width:0;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
.dc-rows{display:flex;flex-direction:column;margin:0 -6px}
.dc-row{display:flex;align-items:center;gap:10px;min-height:36px;padding:4px 6px;border-radius:8px;cursor:pointer;outline:none;transition:background .12s}
.dc-rows .dc-row:hover,.dc-rows .dc-row:focus-visible{background:var(--dc-hl)}
.dc-rows .dc-row:focus-visible{box-shadow:inset 0 0 0 1.5px var(--dc-accent)}
.dc-num{display:grid;place-items:center;flex:none;width:22px;height:22px;border-radius:5px;background:var(--dc-soft);color:var(--dc-muted);font-size:11.5px;font-variant-numeric:tabular-nums}
.dc-body{display:flex;flex-direction:column;min-width:0}
.dc-title{display:flex;align-items:center;gap:8px}
.dc-rec{height:17px;padding:0 5px;border-radius:4px;background:color-mix(in srgb,var(--dc-accent) 12%,transparent);color:var(--dc-accent);font-size:10.5px;font-weight:500;line-height:17px}
.dc-sum{color:var(--dc-muted);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dc-own{margin:4px -6px 0;cursor:text}
.dc-own input{flex:1;min-width:0;height:28px;border:0;background:none;outline:none;color:var(--dc-fg);font:inherit;border-bottom:1px solid transparent}
.dc-own input::placeholder{color:var(--dc-faint)}.dc-own input:focus{border-bottom-color:var(--dc-line)}
.dc-send{display:grid;place-items:center;width:26px;height:26px;border:0;border-radius:7px;background:var(--dc-fg);color:var(--dc-bg)!important}.dc-send svg{width:13px;height:13px}
.dc-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.dc-tile{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;padding:8px;border:1px solid var(--dc-line);border-radius:9px;cursor:pointer;outline:none}
.dc-tile:hover,.dc-tile:focus-visible{border-color:var(--dc-accent)}
.dc-preview{grid-column:1/-1;aspect-ratio:16/10;border-radius:6px;background:var(--dc-soft);overflow:hidden}
.dc-folded{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:12px;color:var(--dc-muted);font-size:12.5px;animation:dc-in .2s both}
.dc-dot{color:var(--dc-faint)}.dc-link{border:0;background:none;padding:0;color:var(--dc-fg)!important;font-weight:500}
.dc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.dc :focus-visible{outline:2px solid var(--dc-accent);outline-offset:2px}.dc .dc-row:focus-visible{outline:none}
.dc-demo{width:100%;max-width:600px;display:flex;flex-direction:column;gap:8px}
.dc-status{display:flex;align-items:center;gap:8px;margin:0 0 4px 12px;color:var(--dc-muted)}.dc-status svg{width:18px;height:18px}
.dc-composer{background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:12px;padding:14px 10px 10px 14px}
.dc-ph{color:var(--dc-faint);height:40px}
.dc-tools{display:flex;align-items:center;gap:12px;color:var(--dc-muted)}.dc-tools svg{width:15px;height:15px;display:block}
.dc-req,.dc-auto{display:inline-flex;align-items:center;gap:6px}.dc-auto{color:var(--dc-fg)}.dc-auto svg{width:12px;height:12px;color:var(--dc-faint)}
.dc-sendbox{display:grid;place-items:center;width:28px;height:28px;border-radius:7px;background:var(--dc-soft);color:var(--dc-faint)}
@keyframes dc-in{from{opacity:0;transform:translateY(4px)}}
@keyframes dc-pulse{0%{background:var(--dc-soft)}100%{background:var(--dc-bg)}}
@media(max-width:420px){.dc-tiles{grid-template-columns:1fr}.dc-preview{display:none}}
@media(hover:none){.dc-row{min-height:44px}}
@media(prefers-reduced-motion:reduce){.dc *,.dc-card{animation:none!important;transition:none!important}}
`;

export default DecisionCardDemo;
