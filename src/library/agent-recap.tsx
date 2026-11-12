"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type RecapKind = "needs" | "failed" | "done";
export type RecapLogo = "slack" | "github" | "drive" | "linear" | React.ReactNode;

export type RecapEvent = {
  id: string;
  at: Date | string | number;
  kind: RecapKind;
  title: string;
  detail?: string;
  logo?: RecapLogo;
  count?: number;
  /** Main action label – Approve, Merge, Retry … */
  action?: string;
  doneLabel?: string;
};

/** Labels under the chart's two ends. A missing key falls back to the window's clock time. */
export type RecapAxis = { start?: React.ReactNode; end?: React.ReactNode };

export type AgentRecapProps = {
  events?: RecapEvent[];
  /** Start of the recap window (chart's left edge, header «…-аас хойш»). */
  since?: Date | string | number;
  /** End of the recap window (chart's right edge). */
  until?: Date | string | number;
  /** When true, events outside `since`…`until` are left out of the chart, lanes and counts. Default false (all events shown). */
  clip?: boolean;
  /** Override the time-axis labels; see {@link RecapAxis}. */
  axis?: RecapAxis | [string, string];
  /** A line under the title (replaces the «… -аас хойш N цаг» line). */
  subtitle?: React.ReactNode;
  onAction?: (event: RecapEvent, action: "primary" | "review") => void | Promise<unknown>;
  onUndo?: (event: RecapEvent) => void;
  onRedo?: (event: RecapEvent) => void;
  limit?: number;
  replay?: number;
  title?: string;
  locale?: string;
  className?: string;
};

const d = (h: number, m: number, day = 14) => new Date(2026, 0, day, h, m);

const defaultEvents: RecapEvent[] = [
  { id: "refund", at: d(2, 14, 15), kind: "needs", title: "Харилцагчид буцаалт олгох", detail: "Тусламжийн агент · автомат зөвшөөрлийн хязгаараас 20% давсан", logo: "slack", action: "Батлах", doneLabel: "Батлагдсан" },
  { id: "merge", at: d(4, 37, 15), kind: "needs", title: "Төлбөрийн засварыг нэгтгэх", detail: "212 тест бүгд амжилттай · кодын эзэн хэрэгтэй", logo: "github", action: "Нэгтгэх", doneLabel: "Нэгтгэсэн" },
  { id: "sync", at: d(3, 2, 15), kind: "failed", title: "Харилцагчийн бүртгэл рүү синк хийх", detail: "3,900-аас 1,284 харилцагчийн дараа токен хүчингүй болсон", logo: "drive", action: "Дахин оролдох", doneLabel: "Дахин оролдсон" },
  { id: "tickets", at: d(19, 5), kind: "done", title: "Тусламжийн хүсэлтэд хариулсан", detail: "эхний хариу 2 минутад", logo: "slack", count: 38 },
  { id: "prs", at: d(20, 10), kind: "done", title: "Хуучирсан хүсэлтүүдийг хаасан", logo: "github", count: 6 },
  { id: "issues", at: d(22, 30), kind: "done", title: "Шинэ асуудлуудыг ангилсан", detail: "4 нь яаралтай", logo: "linear", count: 17 },
];

/** Neutral glyphs (no brand marks): chat, branch, folder, list. Keys stay for API compatibility. */
const logos: Record<string, React.ReactNode> = {
  slack: <svg viewBox="0 0 16 16"><path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  github: <svg viewBox="0 0 16 16"><circle cx="4.5" cy="3.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" /><circle cx="4.5" cy="12.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" /><circle cx="11.5" cy="6" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M4.5 5.1v5.8M11.5 7.6c0 2-2 2.6-6 3.4" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>,
  drive: <svg viewBox="0 0 16 16"><path d="M1.8 4.2v8.3h12.4V5.6H7.6L6.2 4.2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
  linear: <svg viewBox="0 0 16 16"><path d="M5.5 4h8M5.5 8h8M5.5 12h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="2.6" cy="4" r=".9" fill="currentColor" /><circle cx="2.6" cy="8" r=".9" fill="currentColor" /><circle cx="2.6" cy="12" r=".9" fill="currentColor" /></svg>,
};

const ms = (v: Date | string | number) => new Date(v).getTime();
const W = 772, H = 96;

function Icon({ kind }: { kind: RecapKind | "user" }) {
  if (kind === "failed")
    return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5 14 13H2Z M8 6.5v3 M8 11.3v.2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" /></svg>;
  if (kind === "done")
    return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="m5.6 8.2 1.7 1.7 3.2-3.4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>;
  return <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.5" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M2.8 14a5.2 5.2 0 0 1 10.4 0" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>;
}

export function AgentRecap({
  events: eventsProp = defaultEvents,
  since = d(18, 40),
  until = d(8, 10, 15),
  clip = false,
  axis,
  subtitle,
  onAction,
  onUndo,
  onRedo,
  limit = 3,
  replay = 1800,
  title = "Таныг байхгүй үед",
  locale,
  className = "",
}: AgentRecapProps) {
  const t0 = ms(since);
  const t1 = ms(until ?? Date.now());
  const span = Math.max(1, t1 - t0);
  const time = (v: Date | string | number) => new Date(v).toLocaleTimeString(locale ?? "mn-MN", { hour: "numeric", minute: "2-digit" });
  const hours = Math.floor(span / 3.6e6);
  const mins = Math.round((span % 3.6e6) / 6e4);
  const events = clip ? eventsProp.filter((e) => ms(e.at) >= t0 && ms(e.at) <= t1) : eventsProp;

  const [acted, setActed] = React.useState<Record<string, "busy" | "done" | "undone">>({});
  const [hover, setHover] = React.useState<string | null>(null);
  const [live, setLive] = React.useState("");

  const sorted = [...events].sort((a, b) => ms(a.at) - ms(b.at));
  const x = (v: Date | string | number) => ((ms(v) - t0) / span) * W;

  const path = React.useMemo(() => {
    const sigma = W * 0.022;
    const pts: string[] = [];
    for (let i = 0; i <= 240; i++) {
      const px = (i / 240) * W;
      let y = 0;
      sorted.forEach((e, k) => {
        const h = 0.62 + ((k * 37) % 5) * 0.09;
        y += h * Math.exp(-((px - x(e.at)) ** 2) / (2 * sigma * sigma));
      });
      pts.push(`${px.toFixed(1)},${(H - 6 - Math.min(1, y) * (H - 18)).toFixed(1)}`);
    }
    return pts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, t0, span]);
  const peakY = (e: RecapEvent) => {
    const px = x(e.at);
    const i = Math.round((px / W) * 240);
    return Number(path[Math.max(0, Math.min(240, i))]?.split(",")[1] ?? H);
  };

  const lanes: { kind: RecapKind; label: string; icon: RecapKind | "user" }[] = [
    { kind: "needs", label: "Таны ээлж", icon: "user" },
    { kind: "failed", label: "Алдаатай", icon: "failed" },
    { kind: "done", label: "Дууссан", icon: "done" },
  ];
  const count = (k: RecapKind) => events.filter((e) => e.kind === k).length;

  const run = async (e: RecapEvent) => {
    setActed((s) => ({ ...s, [e.id]: "busy" }));
    try {
      await onAction?.(e, "primary");
      setActed((s) => ({ ...s, [e.id]: "done" }));
      setLive(`${e.action ?? "Дууссан"}: ${e.title}`);
    } catch {
      setActed((s) => { const n = { ...s }; delete n[e.id]; return n; });
    }
  };

  return (
    <section className={`ar ${className}`} aria-labelledby="ar-h" style={{ ["--ar-replay" as string]: `${replay}ms` }}>
      <style>{css}</style>
      <header className="ar-top">
        <div>
          <h3 id="ar-h">{title}</h3>
          {subtitle !== undefined ? <p>{subtitle}</p> : <p>{time(since)}-аас хойш <span className="ar-dur">{hours} цаг {mins} мин</span></p>}
        </div>
        <div className="ar-counts">
          <span><Icon kind="done" /><b>{count("done")}</b> дууссан</span>
          <span><Icon kind="user" /><b>{count("needs")}</b> таны ээлж</span>
          <span><Icon kind="failed" /><b>{count("failed")}</b> алдаатай</span>
        </div>
      </header>
      <div className="ar-chart" aria-hidden="true">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => <line key={i} x1={(i * W) / 11} x2={(i * W) / 11} y1="0" y2={H} className="ar-grid" />)}
          <line x1="0" x2={W} y1="0.5" y2="0.5" className="ar-grid" />
          <line x1="0" x2={W} y1={H - 0.5} y2={H - 0.5} className="ar-grid" />
          <defs>
            <linearGradient id="ar-fade" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".1" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,${H} L${path.join(" L")} L${W},${H} Z`} fill="url(#ar-fade)" className="ar-area" />
          <path d={`M${path.join(" L")}`} className="ar-line" pathLength={1} />
        </svg>
        {sorted.map((e, i) => (
          <span
            key={e.id}
            className={`ar-dot ar-dot-${e.kind}${hover === e.id ? " is-on" : ""}`}
            style={{ left: `${(x(e.at) / W) * 100}%`, top: peakY(e), animationDelay: `calc(var(--ar-replay) * ${x(e.at) / W})` }}
            data-i={i}
          />
        ))}
      </div>
      <div className="ar-axis"><span>{(Array.isArray(axis) ? axis[0] : axis?.start) ?? time(since)}</span><span>{(Array.isArray(axis) ? axis[1] : axis?.end) ?? time(until ?? Date.now())}</span></div>
      <div className="ar-lanes">
        {lanes.map((l) => {
          const items = sorted.filter((e) => e.kind === l.kind).slice(0, limit);
          return (
            <div key={l.kind} className="ar-lane" style={{ minHeight: 48 + limit * 94 }}>
              <h4><Icon kind={l.icon} />{l.label}<span className="ar-n">{count(l.kind)}</span></h4>
              {items.length === 0 && <p className="ar-empty">{l.kind === "done" ? "Дууссан зүйл алга" : l.kind === "failed" ? "Алдаа алга" : "Таны ээлж алга"}</p>}
              {items.map((e) => {
                const st = acted[e.id];
                const isDone = e.kind === "done" ? st !== "undone" : st === "done";
                return (
                  <article
                    key={e.id}
                    className="ar-card"
                    onMouseEnter={() => setHover(e.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(e.id)}
                    onBlur={() => setHover(null)}
                  >
                    <div className="ar-row">
                      <span className="ar-logo">{typeof e.logo === "string" || !e.logo ? logos[(e.logo as string) ?? "github"] : e.logo}</span>
                      <strong>{e.title}</strong>
                    </div>
                    <div className="ar-row ar-sub">
                      <span className={`ar-detail${e.kind === "failed" ? " ar-err" : ""}`}>{e.detail}</span>
                      {e.count != null && <span className="ar-count">{e.count}</span>}
                      <time dateTime={new Date(e.at).toISOString()}>{time(e.at)}</time>
                    </div>
                    <div className="ar-acts">
                      {isDone ? (
                        <>
                          <span className="ar-done">{e.doneLabel ?? (e.kind === "done" ? "Дууссан" : "Хийсэн")}</span>
                          {st === "undone" ? null : (
                            <button type="button" className="ar-ghost" aria-label={`Буцаах: ${e.title}`} onClick={() => { setActed((s) => ({ ...s, [e.id]: "undone" })); onUndo?.(e); }}>Буцаах</button>
                          )}
                        </>
                      ) : st === "undone" && e.kind === "done" ? (
                        <button type="button" className="ar-ghost" aria-label={`Дахин хийх: ${e.title}`} onClick={() => { setActed((s) => { const n = { ...s }; delete n[e.id]; return n; }); onRedo?.(e); }}>Дахин хийх</button>
                      ) : (
                        <>
                          {e.kind === "needs" && (
                            <button type="button" className="ar-ghost" aria-label={`Хянах: ${e.title}`} onClick={() => onAction?.(e, "review")}>Хянах</button>
                          )}
                          <button type="button" className="ar-btn" aria-label={`${e.action ?? "Дахин оролдох"}: ${e.title}`} disabled={st === "busy"} onClick={() => run(e)}>
                            {st === "busy" ? "Ажиллаж байна…" : e.action ?? "Дахин оролдох"}
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="ar-live" aria-live="polite">{live}</div>
    </section>
  );
}

const css = `
.ar{--ar-bg:#fff;--ar-fg:#18181b;--ar-muted:#65656d;--ar-faint:#65656d;--ar-line:#ececef;--ar-lane:#f4f4f5;--ar-chip:#ececee;--ar-red:#c62828;--ar-orange:#f05a28;--ar-green:#166534;--ar-green-bg:#e6f6ec;--ar-accent:#3b82f6;width:100%;max-width:806px;background:var(--ar-bg);color:var(--ar-fg);border:1px solid var(--ar-line);border-radius:12px;padding:16px 16px 14px;box-shadow:0 1px 2px #0000000a;font:400 13px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .ar{--ar-bg:#1b1b1e;--ar-fg:#ececef;--ar-muted:#a1a1aa;--ar-faint:#9a9aa2;--ar-line:#2e2e33;--ar-lane:#232327;--ar-chip:#2f2f35;--ar-red:#f87171;--ar-green:#4ade80;--ar-green-bg:#16301f;color-scheme:dark}
.ar *{box-sizing:border-box}.ar button{font:inherit;color:inherit;cursor:pointer}
.ar-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.ar h3{margin:0;font-size:15px;font-weight:500;letter-spacing:-.01em}
.ar-top p{margin:5px 0 0;color:var(--ar-muted);font-size:12.5px;display:flex;align-items:center;gap:6px}
.ar-dur{padding:1px 6px;border-radius:4px;background:var(--ar-lane);color:var(--ar-fg);font-size:11.5px;font-weight:500}
.ar-counts{display:flex;gap:14px;color:var(--ar-muted);font-size:12.5px}.ar-counts span{display:flex;align-items:center;gap:5px}.ar-counts b{color:var(--ar-fg);font-weight:500}.ar-counts svg{width:13px;height:13px}
.ar-chart{position:relative;height:96px;margin-top:14px;color:var(--ar-muted)}
.ar-chart svg{display:block;width:100%;height:100%;overflow:visible}
.ar-grid{stroke:var(--ar-line);stroke-width:1;vector-effect:non-scaling-stroke}
.ar-line{fill:none;stroke:#8a8a90;stroke-width:1.4;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:0;animation:ar-draw var(--ar-replay) ease-out both}
.ar-area{animation:ar-fade var(--ar-replay) ease-out both}
.ar-dot{position:absolute;width:5px;height:5px;margin:-2.5px 0 0 -2.5px;border-radius:50%;background:#52525b;animation:ar-pop .25s both;transition:transform .15s}
.ar-dot-needs,.ar-dot-failed{background:var(--ar-orange)}
.ar-dot.is-on{transform:scale(1.9);box-shadow:0 0 0 3px color-mix(in srgb,currentColor 18%,transparent)}
.ar-axis{display:flex;justify-content:space-between;margin:6px 0 12px;font-size:11px;color:var(--ar-faint)}
.ar-lanes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.ar-lane{background:var(--ar-lane);border-radius:8px;padding:0 4px 4px}
.ar-lane h4{display:flex;align-items:center;gap:7px;margin:0;padding:10px 10px 6px 12px;font-size:12px;font-weight:400;color:var(--ar-muted)}.ar-lane h4 svg{width:13px;height:13px}
.ar-n{margin-left:auto;min-width:18px;height:17px;padding:0 5px;display:grid;place-items:center;border-radius:4px;background:var(--ar-chip);color:var(--ar-fg);font-size:11px}
.ar-empty{margin:8px 12px;color:var(--ar-faint);font-size:12px}
.ar-card{background:var(--ar-bg);border-radius:6px;padding:10px 10px 8px 12px;margin-bottom:4px;box-shadow:0 1px 2px #0000000f;animation:ar-fade .4s both}
.ar-row{display:flex;align-items:center;gap:8px;min-width:0}.ar-row strong{font-weight:500;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ar-logo{display:grid;place-items:center;width:14px;flex:none}.ar-logo svg{width:12px;height:12px}
.ar-sub{margin:4px 0 0 22px;font-size:12px;color:var(--ar-muted)}
.ar-detail{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ar-err{color:var(--ar-red)}
.ar-count{padding:0 5px;border-radius:4px;background:var(--ar-lane);color:var(--ar-fg);font-size:11px}
.ar-sub time{color:var(--ar-faint);font-size:11.5px;flex:none}
.ar-acts{display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:8px}
.ar-btn,.ar-ghost{height:24px;padding:0 9px;border-radius:5px;font-size:12.5px!important}
.ar-btn{border:1px solid var(--ar-line);background:var(--ar-bg);box-shadow:0 1px 1px #0000000a}.ar-btn:hover{background:var(--ar-lane)}.ar-btn:disabled{opacity:.6}
.ar-ghost{border:0;background:none;color:var(--ar-muted)!important}.ar-ghost:hover{color:var(--ar-fg)!important;background:var(--ar-lane)}
.ar-done{margin-right:auto;padding:1px 6px;border-radius:4px;background:var(--ar-green-bg);color:var(--ar-green);font-size:11.5px;font-weight:500}
.ar-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.ar :focus-visible{outline:2px solid var(--ar-accent);outline-offset:2px}
@keyframes ar-draw{from{stroke-dashoffset:1}}
@keyframes ar-fade{from{opacity:0}}
@keyframes ar-pop{from{transform:scale(0)}}
@media(max-width:640px){.ar-lanes{grid-template-columns:1fr}.ar-lane{min-height:0!important}.ar-top{flex-direction:column}}
@media(prefers-reduced-motion:reduce){.ar *{animation:none!important;transition:none!important}}
.ar-card{animation:arcardrise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.ar-card:nth-child(1){animation-delay:0ms}.ar-card:nth-child(2){animation-delay:130ms}.ar-card:nth-child(3){animation-delay:260ms}.ar-card:nth-child(4){animation-delay:390ms}.ar-card:nth-child(5){animation-delay:520ms}.ar-card:nth-child(6){animation-delay:650ms}.ar-card:nth-child(7){animation-delay:780ms}.ar-card:nth-child(8){animation-delay:910ms}.ar-card:nth-child(9){animation-delay:1040ms}.ar-card:nth-child(10){animation-delay:1170ms}.ar-card:nth-child(11){animation-delay:1300ms}.ar-card:nth-child(12){animation-delay:1430ms}@keyframes arcardrise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.ar-card{animation:none}}
.ar-lane{animation:arlanerise .55s var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}.ar-lane:nth-child(1){animation-delay:0ms}.ar-lane:nth-child(2){animation-delay:150ms}.ar-lane:nth-child(3){animation-delay:300ms}.ar-lane:nth-child(4){animation-delay:450ms}.ar-lane:nth-child(5){animation-delay:600ms}.ar-lane:nth-child(6){animation-delay:750ms}.ar-lane:nth-child(7){animation-delay:900ms}.ar-lane:nth-child(8){animation-delay:1050ms}.ar-lane:nth-child(9){animation-delay:1200ms}.ar-lane:nth-child(10){animation-delay:1350ms}.ar-lane:nth-child(11){animation-delay:1500ms}.ar-lane:nth-child(12){animation-delay:1650ms}@keyframes arlanerise{from{opacity:0;transform:translateY(8px)}}@media(prefers-reduced-motion:reduce){.ar-lane{animation:none}}
`;

export default AgentRecap;
