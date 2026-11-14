"use client";

import * as React from "react";

/**
 * Session Offer — the card an agent shows when a piece of work should run in
 * its own session: title, a short brief, the context it starts with (a fork of
 * this chat, or fresh) and where it runs. As an offer it asks «New session /
 * Do it here»; as the agent's own proposal it is a task card the person may
 * start or dismiss. States: offered → starting → started, or dismissed / here.
 * Thinking State original; a visible chain-of-thought action.
 */

export type SessionOfferState = "offered" | "starting" | "started" | "dismissed" | "here";
export type SessionOfferInitiation = "offer" | "own_initiative" | "user_asked";
export type SessionOfferChoice = "new" | "here" | "dismiss";

export type SessionOfferLabels = {
  offer: string;
  proposal: string;
  asked: string;
  fork: string;
  fresh: string;
  newSession: string;
  doHere: string;
  start: string;
  dismiss: string;
  starting: string;
  started: string;
  dismissed: string;
  here: string;
  open: string;
};

export type SessionOfferProps = {
  title?: string;
  brief?: string;
  initiation?: SessionOfferInitiation;
  context?: "fork" | "fresh";
  /** Where it runs: a worktree branch, a folder, «cloud» … */
  where?: string;
  /** Short name the new session gets once started. */
  name?: string;
  /** Controlled state. With no title and no state the demo scenario plays. */
  state?: SessionOfferState;
  onChoose?: (choice: SessionOfferChoice) => void;
  onOpen?: () => void;
  labels?: Partial<SessionOfferLabels>;
  className?: string;
};

const defaultLabels: SessionOfferLabels = {
  offer: "Шинэ сешн санал",
  proposal: "Санал болгож буй ажил",
  asked: "Шинэ сешн",
  fork: "Энэ чатаас салбарлана",
  fresh: "Шинээр эхэлнэ",
  newSession: "Шинэ сешн",
  doHere: "Энд хийх",
  start: "Эхлүүлэх",
  dismiss: "Хэрэггүй",
  starting: "Сешн эхэлж байна…",
  started: "Эхэлсэн",
  dismissed: "Цуцалсан",
  here: "Энэ сешнд хийнэ",
  open: "Нээх",
};

export const sessionOfferDemo = {
  title: "Харанхуй горимын тодролыг засах",
  brief: "Дараагийн алхмын хайрцаг ба хажуугийн самбарын харанхуй горимын өнгийг AA түвшинд хүргэ. Шинэ салбар үүсгээд PR нээ.",
  initiation: "offer" as SessionOfferInitiation,
  context: "fresh" as const,
  where: "тусдаа хуулбар · fix/dark-contrast",
  name: "dark-contrast",
};

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function SessionOffer({
  title: titleProp,
  brief = sessionOfferDemo.brief,
  initiation = sessionOfferDemo.initiation,
  context = sessionOfferDemo.context,
  where = sessionOfferDemo.where,
  name = sessionOfferDemo.name,
  state: stateProp,
  onChoose,
  onOpen,
  labels: labelsProp,
  className = "",
}: SessionOfferProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const title = titleProp ?? sessionOfferDemo.title;
  const demo = titleProp === undefined && stateProp === undefined;
  const [own, setOwn] = React.useState<SessionOfferState>("offered");
  const state = stateProp ?? own;
  const uid = React.useId();
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (!demo || reducedMotion()) return;
    const ts = [
      window.setTimeout(() => setOwn("starting"), 3200),
      window.setTimeout(() => setOwn("started"), 4800),
      window.setTimeout(() => setOwn("offered"), 8400),
    ];
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [demo]);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (c: SessionOfferChoice) => {
    onChoose?.(c);
    if (stateProp) return;
    if (c === "new") {
      setOwn("starting");
      timer.current = window.setTimeout(() => setOwn("started"), reducedMotion() ? 0 : 1200);
    } else setOwn(c === "here" ? "here" : "dismissed");
  };

  const kind = initiation === "offer" ? L.offer : initiation === "own_initiative" ? L.proposal : L.asked;
  const settled = state === "dismissed" || state === "here";

  return (
    <article className={`so is-${state} ${className}`} data-cw-root="session-offer" aria-labelledby={`${uid}-t`} data-cw-item="">
      <style>{css}</style>
      <header className="so-head">
        <span className="so-kind">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v6a3 3 0 003 3h3M11 9l2 3-2 3" /><circle cx="5" cy="3" r="1.5" /></svg>
          {kind}
        </span>
        <span className="so-state" role="status">
          {state === "starting" && <><i className="so-spin" aria-hidden="true" />{L.starting}</>}
          {state === "started" && <><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>{L.started}</>}
          {state === "dismissed" && L.dismissed}
          {state === "here" && L.here}
        </span>
      </header>
      <h3 id={`${uid}-t`} className="so-title">{title}</h3>
      {!settled && <p className="so-brief">{brief}</p>}
      {!settled && (
        <ul className="so-meta">
          <li>
            <svg viewBox="0 0 16 16" aria-hidden="true">{context === "fork" ? <path d="M5 3v10M5 8c4 0 6-2 6-5" /> : <path d="M8 3v10M3 8h10" />}</svg>
            {context === "fork" ? L.fork : L.fresh}
          </li>
          {where && (
            <li>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 4.5h4l1.5 1.5h5.5v6.5h-11z" /></svg>
              {where}
            </li>
          )}
          {state === "started" && name && (
            <li className="so-name">
              <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3" /></svg>
              {name}
            </li>
          )}
        </ul>
      )}
      {state === "offered" && (
        <div className="so-actions">
          {initiation === "offer" ? (
            <>
              <button type="button" className="so-btn is-primary" onClick={() => choose("new")} data-cw-choose={L.newSession} data-cw-prompt={`${L.newSession}: ${title}`}>{L.newSession}</button>
              <button type="button" className="so-btn" onClick={() => choose("here")} data-cw-choose={L.doHere} data-cw-prompt={`${L.doHere}: ${title}`}>{L.doHere}</button>
            </>
          ) : (
            <>
              <button type="button" className="so-btn is-primary" onClick={() => choose("new")} data-cw-choose={L.start} data-cw-prompt={`${L.start}: ${title}`}>{L.start}</button>
              <button type="button" className="so-btn" onClick={() => choose("dismiss")} data-cw-choose={L.dismiss} data-cw-prompt={`${L.dismiss}: ${title}`}>{L.dismiss}</button>
            </>
          )}
        </div>
      )}
      {state === "started" && onOpen && (
        <div className="so-actions">
          <button type="button" className="so-btn" onClick={onOpen}>{L.open}</button>
        </div>
      )}
    </article>
  );
}

const css = `
.so{--so-bg:var(--ts-surface,#fff);--so-fg:var(--ts-fg,#18181b);--so-muted:var(--ts-muted,#65656d);--so-line:var(--ts-line,#ececef);--so-soft:var(--ts-soft,#f4f4f5);--so-accent:var(--ts-accent,#1b5cff);--so-accent-soft:var(--ts-accent-soft,#e8f1fe);--so-green:var(--ts-green,#16a34a);--so-green-soft:var(--ts-green-soft,#e9f8ee);width:100%;max-width:480px;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--so-line);border-radius:14px;background:var(--so-bg);color:var(--so-fg);font:400 14px/1.45 var(--ts-font,Inter,system-ui,sans-serif);transition:opacity .25s,border-color .25s}
:where(.dark,[data-theme=dark]) .so{--so-bg:var(--ts-surface,#1b1b1e);--so-fg:var(--ts-fg,#ececef);--so-muted:var(--ts-muted,#a1a1aa);--so-line:var(--ts-line,#2e2e33);--so-soft:var(--ts-soft,#26262a);--so-accent:var(--ts-accent,#7c9cff);--so-accent-soft:var(--ts-accent-soft,#1b2a44);--so-green:var(--ts-green,#4ade80);--so-green-soft:var(--ts-green-soft,#16301f);color-scheme:dark}
.so svg{width:14px;height:14px;flex:none;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.so-head{display:flex;align-items:center;gap:8px;min-height:24px}
.so-kind{display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border-radius:999px;background:var(--so-accent-soft);color:var(--so-accent);font-size:12px;font-weight:500}
.so-state{margin-left:auto;display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--so-muted)}
.so.is-started .so-state{color:var(--so-green)}
.so-spin{width:10px;height:10px;border-radius:50%;border:2px solid var(--so-line);border-top-color:var(--so-accent);animation:so-spin .8s linear infinite}
.so-title{margin:0;font-size:15px;font-weight:600}
.so.is-dismissed .so-title{color:var(--so-muted);text-decoration:line-through}
.so.is-dismissed,.so.is-here{opacity:.75}
.so-brief{margin:0;color:var(--so-muted)}
.so-meta{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.so-meta li{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:8px;background:var(--so-soft);font-size:12px;color:var(--so-muted);animation:so-in .3s ease both}
.so-meta .so-name{background:var(--so-green-soft);color:var(--so-green)}
.so-actions{display:flex;flex-wrap:wrap;gap:8px;padding-top:4px}
.so-btn{min-height:36px;padding:0 14px;border-radius:10px;border:1px solid var(--so-line);background:var(--so-bg);color:var(--so-fg);font:inherit;font-weight:500;cursor:pointer}
.so-btn:hover{background:var(--so-soft)}
.so-btn.is-primary{background:var(--so-accent);border-color:var(--so-accent);color:#fff}
.so-btn:focus-visible{outline:2px solid var(--so-accent);outline-offset:2px}
@keyframes so-spin{to{transform:rotate(360deg)}}
@keyframes so-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.so,.so *{animation:none!important;transition:none!important}}
`;

export default SessionOffer;
