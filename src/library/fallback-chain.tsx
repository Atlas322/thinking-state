"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type FallbackStatus = "waiting" | "trying" | "failed" | "answered" | "skipped";
export type FallbackAttempt = {
  id: string;
  /** Optional when `name` is given. */
  model?: string;
  provider?: string;
  logo?: React.ReactNode;
  status: FallbackStatus;
  /** Why it failed, e.g. "Rate limited · 429". */
  reason?: string;
  tokens?: number;
  /** Seconds spent. */
  took?: number;
  cost?: number;
  startedAt?: number;
  /** Display name shown instead of the model name. */
  name?: string;
  /** Muted one-line note under the attempt. */
  note?: string;
};
export type ChainEnd = { name?: string; logo?: React.ReactNode; text?: string; details?: string[] };

export type FallbackChainProps = {
  attempts?: FallbackAttempt[];
  title?: string;
  route?: string;
  request?: ChainEnd;
  response?: ChainEnd;
  now?: number;
  onRetry?: () => void;
  className?: string;
};

const defaultAttempts: FallbackAttempt[] = [
  { id: "a1", model: "Судлаач агент", provider: "Үүлэн сервер А", status: "failed", reason: "Хязгаар хэтэрсэн · 429", took: 1.6, cost: 0 },
  { id: "a2", model: "Бичигч агент", provider: "Үүлэн сервер Б", status: "failed", reason: "Хугацаа хэтэрсэн", took: 5.0, cost: 0.0006 },
  { id: "a3", model: "Шалгагч агент", provider: "Үүлэн сервер В", status: "answered", tokens: 412, took: 1.9, cost: 0.0021 },
  { id: "a4", model: "Кодын агент", provider: "Дотоод сервер", status: "skipped" },
];

/** Usage credits (кр), not money. */
const money = (n: number) => (n === 0 ? "0 кр" : `${n.toFixed(4)} кр`);
const ROW = 60;
const GAP = 10;
const NOTE = 16;

function statusText(a: FallbackAttempt) {
  switch (a.status) {
    case "failed":
      return a.reason ?? "Алдаатай";
    case "answered":
      return `Хариулсан${a.tokens ? ` · ${a.tokens} токен` : ""}`;
    case "trying":
      return "Оролдож байна…";
    case "skipped":
      return "Шаардлагагүй";
    default:
      return "Хүлээж байна";
  }
}

export function FallbackChain({
  attempts = defaultAttempts,
  title = "Дэмжлэгийн хүсэлтийг хураангуйлах",
  route = "автомат чиглүүлэлт",
  request,
  response,
  now,
  onRetry,
  className = "",
}: FallbackChainProps) {
  const [clock, setClock] = React.useState(() => Date.now());
  const trying = attempts.find((a) => a.status === "trying");
  React.useEffect(() => {
    if (!trying || now != null) return;
    const id = window.setInterval(() => setClock(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [trying, now]);
  const t = now ?? clock;
  const tookOf = (a: FallbackAttempt) =>
    a.status === "trying" && a.startedAt ? (t - a.startedAt) / 1000 : a.took ?? 0;

  const answered = attempts.find((a) => a.status === "answered");
  const allFailed = attempts.length > 0 && attempts.every((a) => a.status === "failed");
  const totalTime = attempts.reduce((s, a) => s + tookOf(a), 0);
  const totalCost = attempts.reduce((s, a) => s + (a.cost ?? 0), 0);
  const maxTime = Math.max(5, ...attempts.map(tookOf));
  const n = attempts.length;
  // A note adds one line to every row, so the wires still meet the rows' centers
  const row = attempts.some((a) => a.note) ? ROW + NOTE : ROW;
  const H = n * row + (n - 1) * GAP;
  const cy = (i: number) => i * (row + GAP) + row / 2;
  const idx = trying ? attempts.indexOf(trying) + 1 : 0;

  const summary = answered
    ? { cls: "ok", text: "Хариулсан" }
    : allFailed
      ? { cls: "bad", text: "Бүх загвар алдаатай" }
      : { cls: "run", text: `Оролдлого ${idx || 1}/${n}` };

  const lineClass = (a: FallbackAttempt) =>
    a.status === "answered" ? "fc-l-ok" : a.status === "failed" ? "fc-l-bad" : a.status === "trying" ? "fc-l-run" : "fc-l-idle";

  return (
    <section className={`fc ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="fc-head" role="status">
        <strong>{title}</strong>
        <span className={`fc-sum fc-${summary.cls}`}>
          <i />
          {summary.text}
        </span>
        <span className="fc-meta">
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M8 5v3l2 1.3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          {totalTime.toFixed(1)} с
        </span>
        <span className="fc-meta fc-cost">{money(totalCost)}</span>
      </header>

      <div className="fc-canvas">
        <div className="fc-grid" style={{ height: H }}>
          <div className="fc-end" tabIndex={0} title={request?.text}>
            <span className="fc-ico fc-req">
              {request?.logo ?? (
                <svg viewBox="0 0 16 16"><path d="M3 5.5h6.5a2.5 2.5 0 0 1 0 5H6M6 8.5 4 10.5l2 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </span>
            <span className="fc-end-t">
              <b>{request?.name ?? "Хүсэлт"}</b>
              {route && <code>{route}</code>}
            </span>
          </div>

          <svg className="fc-wire" viewBox={`0 0 48 ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {attempts.map((a, i) => (
              <path key={a.id} className={lineClass(a)} d={`M0 ${H / 2} C24 ${H / 2} 24 ${cy(i)} 48 ${cy(i)}`} />
            ))}
          </svg>

          <ol className="fc-models" aria-label="Нөөц дарааллаарх загварууд">
            {attempts.map((a, i) => {
              const took = tookOf(a);
              const frac = Math.min(1, took / maxTime);
              return (
                <li
                  key={a.id}
                  className={`fc-m fc-m-${a.status}`}
                  tabIndex={0}
                  style={row === ROW ? { animationDelay: `${i * 70}ms` } : { animationDelay: `${i * 70}ms`, height: row }}
                >
                  <span className="fc-logo">
                    {a.logo ?? <b>{(a.name ?? a.model ?? "?")[0]}</b>}
                    <span className="fc-n">{i + 1}</span>
                  </span>
                  <span className="fc-body">
                    <span className="fc-top">
                      <span className="fc-name">
                        {a.name ?? a.model ?? "Нөөц загвар"} {a.provider && <small>{a.provider}</small>}
                      </span>
                      <span className="fc-t">{a.status === "skipped" || a.status === "waiting" ? "–" : `${took.toFixed(1)}s`}</span>
                    </span>
                    <span className="fc-top">
                      <span className="fc-st">{statusText(a)}</span>
                      <span className="fc-c">{a.cost != null && a.status !== "skipped" ? money(a.cost) : ""}</span>
                    </span>
                    {a.status !== "skipped" && a.status !== "waiting" && (
                      <span className="fc-bar">
                        <span style={{ width: `${(a.status === "failed" && (a.reason?.includes("Timed") || a.reason?.includes("Хугацаа")) ? 1 : frac) * 100}%` }} />
                      </span>
                    )}
                    {a.note && (
                      <span className="fc-note" title={a.note}>
                        {a.note}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>

          <svg className="fc-wire" viewBox={`0 0 48 ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {attempts.map((a, i) => (
              <path
                key={a.id}
                className={a.status === "answered" ? "fc-l-ok" : "fc-l-idle"}
                d={`M0 ${cy(i)} C24 ${cy(i)} 24 ${H / 2} 48 ${H / 2}`}
              />
            ))}
          </svg>

          <div className={`fc-end ${answered ? "fc-end-ok" : ""}`} tabIndex={0} title={response?.text}>
            <span className="fc-ico fc-res">
              {response?.logo ?? (
                <svg viewBox="0 0 16 16"><path d="M3 3.5h10v7H7l-3 2.5v-2.5H3Z" fill="currentColor" /><path d="M6 6.5h4M6 8.3h2.5" stroke="#fff" strokeWidth="1" strokeLinecap="round" /></svg>
              )}
            </span>
            <span className="fc-end-t">
              <b>{response?.name ?? "Хариу"}</b>
              <em>{answered ? `${answered.tokens ?? ""} токен` : allFailed ? "Хариу алга" : "Хүлээж байна"}</em>
            </span>
          </div>
        </div>
        {allFailed && onRetry && (
          <button type="button" className="fc-retry" onClick={onRetry}>
            Дахин оролдох
          </button>
        )}
      </div>
    </section>
  );
}

const css = `
.fc{--fc-bg:#fff;--fc-fg:#18181b;--fc-muted:#65656d;--fc-faint:#65656d;--fc-line:#e7e7ea;--fc-canvas:#fafafa;--fc-dot:#e4e4e7;--fc-ok:#15803d;--fc-okbar:#86c79c;--fc-bad:#dc2626;--fc-badbar:#f19a9a;--fc-run:#2563eb;--fc-on:#fff;width:100%;max-width:740px;color:var(--fc-fg);font:400 13px/1.35 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .fc{--fc-bg:#1b1b1e;--fc-fg:#ececef;--fc-muted:#a1a1aa;--fc-faint:#9a9aa2;--fc-line:#2e2e33;--fc-canvas:#151517;--fc-dot:#2a2a2f;--fc-ok:#4ade80;--fc-okbar:#2f7a4a;--fc-bad:#f87171;--fc-badbar:#8a3434;--fc-run:#60a5fa;--fc-on:#1b1b1e;color-scheme:dark}
.fc *{box-sizing:border-box}.fc button{font:inherit;cursor:pointer}
.fc-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;padding:0 2px 14px}
.fc-head strong{font-weight:500;font-size:14px;flex:1 1 200px;min-width:0}
.fc-sum{display:inline-flex;align-items:center;gap:6px;font-size:13px}.fc-sum i{width:6px;height:6px;border-radius:50%;background:currentColor}
.fc-ok{color:var(--fc-ok)}.fc-bad{color:var(--fc-bad)}.fc-run{color:var(--fc-run)}
.fc-meta{display:inline-flex;align-items:center;gap:5px;padding-left:12px;border-left:1px solid var(--fc-line);font-variant-numeric:tabular-nums}
.fc-meta svg{width:13px;height:13px;color:var(--fc-muted)}
.fc-canvas{padding:22px 14px;border:1px solid var(--fc-line);border-radius:10px;background:var(--fc-canvas) radial-gradient(var(--fc-dot) 1px,transparent 1.2px) 0 0/12px 12px}
.fc-grid{display:grid;grid-template-columns:148px 44px minmax(0,1fr) 44px 142px;align-items:center}
.fc-wire{width:100%;height:100%;overflow:visible}
.fc-wire path{fill:none;stroke-width:1.3;vector-effect:non-scaling-stroke}
.fc-l-ok{stroke:var(--fc-ok)}.fc-l-bad{stroke:var(--fc-badbar);stroke-dasharray:4 3}.fc-l-idle{stroke:var(--fc-dot);stroke-dasharray:3 3}
.fc-l-run{stroke:var(--fc-run);stroke-dasharray:5 4;animation:fc-dash .6s linear infinite}
.fc-end{display:flex;align-items:center;gap:10px;height:54px;padding:0 10px;border:1px solid var(--fc-line);border-radius:8px;background:var(--fc-bg);box-shadow:0 1px 2px #0000000a}
.fc-end-ok{border-color:var(--fc-okbar);box-shadow:0 0 0 1px color-mix(in srgb,var(--fc-ok) 20%,transparent)}
.fc-ico{display:grid;place-items:center;width:22px;height:22px;border-radius:6px;flex:none}.fc-ico svg{width:14px;height:14px}
.fc-req{background:color-mix(in srgb,var(--fc-run) 12%,transparent);color:var(--fc-run)}
.fc-res{background:color-mix(in srgb,var(--fc-ok) 12%,transparent);color:var(--fc-ok)}
.fc-end-t{display:flex;flex-direction:column;min-width:0}.fc-end-t b{font-weight:500}
.fc-end-t code{font:11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--fc-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fc-end-t em{font-style:normal;font-size:12px;color:var(--fc-ok)}
.fc-models{list-style:none;margin:0;padding:0;display:grid;gap:${GAP}px}
.fc-m{display:flex;align-items:center;gap:10px;height:${ROW}px;padding:0 12px 0 10px;border:1px solid var(--fc-line);border-radius:8px;background:var(--fc-bg);box-shadow:0 1px 2px #0000000a;animation:fc-in .35s both}
.fc-m-answered{border-color:var(--fc-okbar);box-shadow:0 0 0 1px color-mix(in srgb,var(--fc-ok) 20%,transparent)}
.fc-m-skipped,.fc-m-waiting{color:var(--fc-faint)}
.fc-logo{position:relative;display:grid;place-items:center;width:22px;height:22px;flex:none}.fc-logo svg{width:15px;height:15px}
.fc-n{position:absolute;right:-5px;bottom:-5px;display:grid;place-items:center;width:13px;height:13px;border-radius:50%;font-size:9px;font-weight:600;color:var(--fc-on);background:var(--fc-faint);border:1.5px solid var(--fc-bg)}
.fc-m-failed .fc-n{background:var(--fc-bad)}.fc-m-answered .fc-n{background:var(--fc-ok)}.fc-m-trying .fc-n{background:var(--fc-run)}
.fc-m-skipped .fc-n{background:none;color:var(--fc-faint)}
.fc-m-skipped .fc-logo svg{opacity:.6}
.fc-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
.fc-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.fc-name{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fc-m-skipped .fc-name{font-weight:400}
.fc-name small{font-size:11px;font-weight:400;color:var(--fc-faint);margin-left:4px}
.fc-t,.fc-c{font-variant-numeric:tabular-nums;font-size:12px}.fc-c{color:var(--fc-muted)}
.fc-st{font-size:12px}.fc-m-failed .fc-st{color:var(--fc-bad)}.fc-m-answered .fc-st{color:var(--fc-ok)}.fc-m-trying .fc-st{color:var(--fc-run)}
.fc-bar{position:relative;display:block;height:4px;margin-top:5px;background:repeating-linear-gradient(90deg,var(--fc-dot) 0 4px,transparent 4px 6px)}
.fc-bar span{position:absolute;inset:0 auto 0 0;background:repeating-linear-gradient(90deg,currentColor 0 4px,transparent 4px 6px);transition:width .4s}
.fc-m-failed .fc-bar span{color:var(--fc-badbar)}.fc-m-answered .fc-bar span{color:var(--fc-okbar)}
.fc-m-trying .fc-bar span{color:var(--fc-run);animation:fc-pulse 1s ease-in-out infinite}
.fc-note{margin-top:3px;font-size:11px;line-height:13px;color:var(--fc-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fc-retry{display:block;margin:14px auto 0;padding:6px 14px;border:1px solid var(--fc-line);border-radius:7px;background:var(--fc-bg);color:var(--fc-fg)}
.fc :focus-visible{outline:2px solid var(--fc-run);outline-offset:2px}
@keyframes fc-in{from{opacity:0;transform:translateX(-6px)}}
@keyframes fc-dash{to{stroke-dashoffset:-9}}
@keyframes fc-pulse{50%{opacity:.5}}
@media(max-width:680px){.fc-name small{display:none}.fc-grid{grid-template-columns:110px 28px minmax(0,1fr) 28px 110px}}
@media(max-width:520px){.fc-grid{grid-template-columns:1fr;height:auto!important;gap:10px}.fc-wire{display:none}.fc-models{padding-left:14px;border-left:1px dashed var(--fc-faint)}}
@media(prefers-reduced-motion:reduce){.fc *{animation:none!important;transition:none!important}}
`;

export default FallbackChain;
