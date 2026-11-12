"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type CostStep = {
  id: string;
  name: string;
  kind: "llm" | "tool" | "agent";
  status: "running" | "done" | "failed";
  model?: string;
  detail?: string;
  icon?: React.ReactNode;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
  duration?: number;
  input?: string;
  output?: string;
  error?: string;
  children?: CostStep[];
};

export type CostMode = "cost" | "tokens";

export type CostWaterfallProps = {
  steps?: CostStep[];
  task?: string;
  title?: string;
  status?: "running" | "done" | "failed";
  mode?: CostMode;
  defaultMode?: CostMode;
  onModeChange?: (mode: CostMode) => void;
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (collapsed: string[]) => void;
  openId?: string | null;
  defaultOpenId?: string | null;
  onOpenChange?: (id: string | null, step?: CostStep) => void;
  maxHeight?: number;
  formatCost?: (amount: number) => string;
  className?: string;
};

const defaultSteps: CostStep[] = [
  { id: "plan", name: "Тайлангийн төлөвлөгөө", kind: "llm", status: "done", model: "Төлөвлөгч агент", tokensIn: 4100, tokensOut: 960, cost: 0.04, duration: 3000, input: "2026 оны зах зээлийн тойм тайланг төлөвлө.", output: "1. Эх сурвалж цуглуулах 2. Харьцуулах 3. Бичих" },
  {
    id: "research", name: "Судлаач", kind: "agent", status: "done", model: "Судлаач агент", duration: 8500,
    children: [
      { id: "ws1", name: "web_search", kind: "tool", status: "done", detail: "зах зээл 2026", cost: 0.01, duration: 1300 },
      { id: "ws2", name: "web_search", kind: "tool", status: "done", detail: "өрсөлдөгчид", cost: 0.01, duration: 1100 },
      { id: "fp", name: "fetch_pages", kind: "tool", status: "done", detail: "9 хуудас", duration: 2100 },
      { id: "sum", name: "Эх сурвалж нэгтгэх", kind: "llm", status: "done", model: "Судлаач агент", tokensIn: 38400, tokensOut: 1300, cost: 0.01, duration: 3600 },
    ],
  },
  { id: "write", name: "Тайлан бичих", kind: "llm", status: "done", model: "Бичигч агент", tokensIn: 21800, tokensOut: 5600, cost: 0.25, duration: 7500 },
  {
    id: "review", name: "Шалгагч", kind: "agent", status: "done", model: "Шалгагч агент", duration: 3300,
    children: [
      { id: "facts", name: "Баримт шалгах", kind: "llm", status: "done", model: "Шалгагч агент", tokensIn: 26000, tokensOut: 700, cost: 0.03, duration: 2000 },
      { id: "links", name: "check_links", kind: "tool", status: "failed", detail: "31 холбоос", duration: 1100, error: "3 холбоос 404 буцаалаа" },
    ],
  },
  { id: "apply", name: "Засвар оруулах", kind: "llm", status: "done", model: "Бичигч агент", tokensIn: 24500, tokensOut: 1900, cost: 0.1, duration: 2800 },
  { id: "save", name: "Тайлан хадгалах", kind: "tool", status: "running", detail: "баримтын сан", duration: 438 },
];

type Totals = { cost: number; tin: number; tout: number };
const sum = (s: CostStep): Totals =>
  s.children?.length
    ? s.children.reduce(
        (a, c) => {
          const t = sum(c);
          return { cost: a.cost + t.cost, tin: a.tin + t.tin, tout: a.tout + t.tout };
        },
        { cost: 0, tin: 0, tout: 0 },
      )
    : { cost: s.cost ?? 0, tin: s.tokensIn ?? 0, tout: s.tokensOut ?? 0 };

const fmtTok = (n: number) => (n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);
const fmtTokShort = (n: number) => (n >= 100000 ? `${Math.round(n / 1000)}k` : fmtTok(n));
const fmtTime = (ms?: number) => (ms == null ? "–" : ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)} с`);
/** Cost in usage credits (кр), not money. */
const dollars = (n: number) => `${n.toFixed(2)} кр`;

const Ico = {
  agent: (
    <svg viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="8" cy="8" r="5.5" /><circle cx="8" cy="8" r="1.6" fill="currentColor" stroke="none" /></g></svg>
  ),
  globe: (
    <svg viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="#3b82f6" strokeWidth="1.2"><circle cx="8" cy="8" r="5.5" /><path d="M2.5 8h11M8 2.5c-2.4 3-2.4 8 0 11M8 2.5c2.4 3 2.4 8 0 11" /></g></svg>
  ),
  doc: (
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h5l3 3v9H4Z M9 2v3h3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
  ),
  tool: (
    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2.5a3 3 0 0 0-2.8 4L2.8 11a1.2 1.2 0 0 0 1.7 1.7L9 8.3a3 3 0 0 0 4-3.6l-1.8 1.7-1.6-.4-.4-1.6Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
  ),
};

function iconFor(s: CostStep): React.ReactNode {
  if (s.icon) return s.icon;
  const m = (s.model ?? s.detail ?? "").toLowerCase();
  if (/агент|agent/.test(m)) return Ico.agent;
  if (/сан|doc/.test(m)) return Ico.doc;
  if (/search|fetch|link/.test(s.name)) return Ico.globe;
  return Ico.tool;
}

export function CostWaterfall({
  steps = defaultSteps,
  task = "2026 оны зах зээлийн тойм тайлан",
  title = "Ажиллагааны зардал",
  status,
  mode: modeIn,
  defaultMode = "cost",
  onModeChange,
  collapsed: collapsedIn,
  defaultCollapsed = ["research"],
  onCollapsedChange,
  openId: openIn,
  defaultOpenId = null,
  onOpenChange,
  maxHeight,
  formatCost = dollars,
  className = "",
}: CostWaterfallProps) {
  const [modeLocal, setModeLocal] = React.useState<CostMode>(defaultMode);
  const mode = modeIn ?? modeLocal;
  const [colLocal, setColLocal] = React.useState<string[]>(defaultCollapsed);
  const collapsed = collapsedIn ?? colLocal;
  const [openLocal, setOpenLocal] = React.useState<string | null>(defaultOpenId);
  const openId = openIn !== undefined ? openIn : openLocal;

  const setMode = (m: CostMode) => {
    if (modeIn === undefined) setModeLocal(m);
    onModeChange?.(m);
  };
  const toggleCol = (id: string) => {
    const next = collapsed.includes(id) ? collapsed.filter((x) => x !== id) : [...collapsed, id];
    if (collapsedIn === undefined) setColLocal(next);
    onCollapsedChange?.(next);
  };
  const toggleOpen = (s: CostStep) => {
    const next = openId === s.id ? null : s.id;
    if (openIn === undefined) setOpenLocal(next);
    onOpenChange?.(next, next ? s : undefined);
  };

  const total = steps.reduce(
    (a, s) => {
      const t = sum(s);
      return { cost: a.cost + t.cost, tin: a.tin + t.tin, tout: a.tout + t.tout };
    },
    { cost: 0, tin: 0, tout: 0 },
  );
  const running = status ? status === "running" : JSON.stringify(steps).includes('"running"');
  const failedRun = status === "failed";

  // most expensive top-level step
  const top = steps.reduce<CostStep | null>((best, s) => (!best || sum(s).cost > sum(best).cost ? s : best), null);

  const val = (t: Totals) => (mode === "cost" ? t.cost : t.tin + t.tout);
  const grand = mode === "cost" ? total.cost : total.tin + total.tout;
  const stepSize = mode === "cost" ? 0.2 : 50000;
  const axisMax = Math.max(stepSize, Math.ceil((grand * 1.08) / stepSize) * stepSize);
  const ticks = Array.from({ length: Math.round(axisMax / stepSize) }, (_, i) => i * stepSize);

  type Row = { s: CostStep; depth: number; start: number; t: Totals };
  const rows: Row[] = [];
  let acc = 0;
  const walk = (list: CostStep[], depth: number) => {
    for (const s of list) {
      const t = sum(s);
      const start = acc;
      rows.push({ s, depth, start, t });
      if (s.children?.length) {
        if (collapsed.includes(s.id)) acc += val(t);
        else walk(s.children, depth + 1);
      } else acc += val(t);
    }
  };
  walk(steps, 0);

  const pct = (v: number) => `${(v / axisMax) * 100}%`;

  return (
    <section className={`cw ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="cw-bar">
        <svg className="cw-spark" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 1.5 7.2 5 10.5 6 7.2 7 6 10.5 4.8 7 1.5 6 4.8 5ZM12 9l.7 1.8 1.8.7-1.8.7L12 14l-.7-1.8-1.8-.7 1.8-.7Z" fill="currentColor" />
        </svg>
        <strong>{title}</strong>
        <span className="cw-task">{task}</span>
        <div className="cw-seg" role="tablist" aria-label="Хэмжүүр">
          {(["cost", "tokens"] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => setMode(m)}>
              {m === "cost" ? "Зардал" : "Токен"}
            </button>
          ))}
        </div>
        <span className={`cw-state ${running ? "live" : failedRun ? "fail" : "done"}`}>
          <i />
          {running ? "Шууд" : failedRun ? "Алдаатай" : "Дууссан"}
        </span>
      </header>
      <div className="cw-stats">
        <div>
          <span className="cw-k">Нийт зардал</span>
          <span className="cw-v">{formatCost(total.cost)}</span>
        </div>
        <div>
          <span className="cw-k">Нийт токен</span>
          <span className="cw-v">
            {fmtTokShort(total.tin + total.tout)}
            <small>
              {fmtTokShort(total.tin)} оролт · {fmtTok(total.tout)} гаралт
            </small>
          </span>
        </div>
        <div>
          <span className="cw-k">Хамгийн их зардал</span>
          <span className="cw-v cw-v-name">
            {top?.name}
            <small>{top ? formatCost(sum(top).cost) : ""}</small>
          </span>
        </div>
      </div>
      <div className="cw-table" style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}>
        <div className="cw-row cw-th">
          <span className="cw-name">Алхам</span>
          <span className="cw-chart">
            {ticks.map((t) => (
              <span key={t} className="cw-tick" style={{ left: pct(t) }}>
                {mode === "cost" ? (t === 0 ? "0" : t.toFixed(2)) : t === 0 ? "0" : `${t / 1000}k`}
              </span>
            ))}
          </span>
          <span className="cw-num">Оролт</span>
          <span className="cw-num">Гаралт</span>
          <span className="cw-num">Зардал</span>
          <span className="cw-num">Хугацаа</span>
        </div>
        {rows.map(({ s, depth, start, t }) => {
          const hasKids = !!s.children?.length;
          const folded = hasKids && collapsed.includes(s.id);
          const own = val(t);
          const isTop = top?.id === s.id;
          const open = openId === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className={`cw-row cw-${s.status} ${hasKids ? "cw-parent" : ""} ${open ? "open" : ""}`}>
                <span className="cw-name" style={{ paddingLeft: 14 + depth * 14 }}>
                  {hasKids ? (
                    <button
                      type="button"
                      className="cw-caret"
                      aria-expanded={!folded}
                      aria-label={`${s.name}: ${folded ? "нээх" : "хураах"}`}
                      onClick={() => toggleCol(s.id)}
                    >
                      <svg viewBox="0 0 16 16" aria-hidden="true" style={{ transform: folded ? "none" : "rotate(90deg)" }}>
                        <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </button>
                  ) : (
                    <span className="cw-caret" />
                  )}
                  <span className="cw-ico">{iconFor(s)}</span>
                  <button type="button" className="cw-label" aria-expanded={open} onClick={() => toggleOpen(s)}>
                    <span className="cw-n">{s.name}</span>
                    <span className="cw-m">{s.model ?? s.detail}</span>
                  </button>
                  {folded && <span className="cw-tag">+{s.children!.length}</span>}
                  {isTop && <span className="cw-tag cw-top">TOP</span>}
                  {s.status === "failed" && (
                    <svg className="cw-warn" viewBox="0 0 16 16" aria-label="Алдаатай">
                      <path d="M8 2.5 14 13H2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                      <path d="M8 6.5v3M8 11.2v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  )}
                  {s.status === "running" && <span className="cw-spin" aria-label="Ажиллаж байна" />}
                </span>
                <span className="cw-chart">
                  {ticks.map((tk) => (
                    <span key={tk} className="cw-grid" style={{ left: pct(tk) }} />
                  ))}
                  <span
                    className={`cw-b ${own === 0 ? "zero" : ""} ${hasKids && !folded ? "group" : ""}`}
                    style={{ left: pct(start), width: own === 0 ? 1 : `max(4px, ${pct(own)})` }}
                  />
                </span>
                <span className="cw-num">{t.tin ? fmtTok(t.tin) : "–"}</span>
                <span className="cw-num">{t.tout ? fmtTok(t.tout) : "–"}</span>
                <span className="cw-num cw-cost">{t.cost ? formatCost(t.cost) : "–"}</span>
                <span className="cw-num cw-time">{fmtTime(s.duration)}</span>
              </div>
              {open && (
                <div className="cw-detail">
                  {s.error && <p className="cw-err">{s.error}</p>}
                  {s.input && (
                    <p>
                      <b>Оролт</b> {s.input}
                    </p>
                  )}
                  {s.output && (
                    <p>
                      <b>Гаралт</b> {s.output}
                    </p>
                  )}
                  {!s.error && !s.input && !s.output && <p className="cw-faint">Дэлгэрэнгүй бичигдээгүй.</p>}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

const css = `
.cw{--cw-bg:#fff;--cw-fg:#18181b;--cw-muted:#65656d;--cw-faint:#65656d;--cw-line:#ececef;--cw-soft:#f4f4f5;--cw-bar:#ecebfa;--cw-bar-b:#c9c6ee;--cw-accent:#3b82f6;--cw-red:#e5484d;--cw-top-bg:#fdf0d5;--cw-top-fg:#c2690c;width:100%;max-width:758px;background:var(--cw-bg);color:var(--cw-fg);border:1px solid var(--cw-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 13.5px/1.4 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .cw{--cw-bg:#1b1b1e;--cw-fg:#ececef;--cw-muted:#a1a1aa;--cw-faint:#9a9aa2;--cw-line:#2e2e33;--cw-soft:#26262b;--cw-bar:#2c2a4a;--cw-bar-b:#5a55a0;--cw-accent:#6aa3ff;--cw-top-bg:#3d2a10;--cw-top-fg:#f2a54a;color-scheme:dark}
.cw *{box-sizing:border-box}.cw button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;padding:0}
.cw-bar{display:flex;align-items:center;gap:8px;padding:10px 12px 10px 18px;border-bottom:1px solid var(--cw-line)}
.cw-spark{width:14px;height:14px;color:var(--cw-accent);flex:none}
.cw-bar strong{font-weight:500;font-size:14px}
.cw-task{flex:1;min-width:0;color:var(--cw-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
.cw-seg{display:flex;padding:2px;border-radius:8px;background:var(--cw-soft)}
.cw-seg button{height:24px;padding:0 10px;border-radius:6px;font-size:13px;color:var(--cw-muted)}
.cw-seg button[aria-selected=true]{background:var(--cw-bg);color:var(--cw-fg);box-shadow:0 0 0 1px var(--cw-line),0 1px 2px #0000000d}
.cw-state{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 7px;border-radius:5px;font-size:12.5px}
.cw-state i{width:5px;height:5px;border-radius:50%;background:currentColor}
.cw-state.live{background:color-mix(in srgb,var(--cw-accent) 12%,transparent);color:var(--cw-accent)}
.cw-state.live i{animation:cw-pulse 1.4s ease-in-out infinite}
.cw-state.done{background:var(--cw-soft);color:var(--cw-muted)}.cw-state.fail{background:color-mix(in srgb,var(--cw-red) 12%,transparent);color:var(--cw-red)}
.cw-stats{display:grid;grid-template-columns:1fr 1fr 1.4fr;border-bottom:1px solid var(--cw-line)}
.cw-stats>div{display:flex;flex-direction:column;gap:6px;padding:12px 22px 14px}
.cw-stats>div+div{border-left:1px solid var(--cw-line)}
.cw-k{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--cw-muted)}
.cw-v{font-size:15px;font-weight:500;font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:8px;white-space:nowrap}
.cw-v small{font-size:12px;font-weight:400;color:var(--cw-muted)}
.cw-row{display:grid;grid-template-columns:250px minmax(120px,1fr) 52px 48px 58px 58px;align-items:center;height:32px}
.cw-th{height:30px;border-bottom:1px solid var(--cw-line);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--cw-muted)}
.cw-th .cw-name{padding-left:16px}
.cw-th .cw-chart{text-transform:none;letter-spacing:0;font-size:12.5px}
.cw-tick{position:absolute;top:50%;transform:translateY(-50%);padding-left:6px;border-left:1px solid var(--cw-line);height:30px;line-height:30px}
.cw-name{display:flex;align-items:center;gap:6px;min-width:0;padding-right:10px;height:100%;border-right:1px solid var(--cw-line)}
.cw-th .cw-name{border-right:0}
.cw-caret{display:grid;place-items:center;width:12px;height:12px;flex:none;color:var(--cw-faint)}
.cw-caret svg{width:12px;height:12px;transition:transform .15s}
.cw-ico{display:grid;place-items:center;width:14px;height:14px;flex:none}.cw-ico svg{width:14px;height:14px}
.cw-label{display:flex;align-items:baseline;gap:6px;min-width:0;text-align:left}
.cw-n{white-space:nowrap;font-weight:400;color:var(--cw-fg)}
.cw-m{font-size:12.5px;color:var(--cw-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.cw-tag{flex:none;font-size:10.5px;padding:1px 4px;border-radius:4px;background:var(--cw-soft);color:var(--cw-muted)}
.cw-top{background:var(--cw-top-bg);color:var(--cw-top-fg);letter-spacing:.02em}
.cw-warn{width:13px;height:13px;color:var(--cw-red);margin-left:auto;flex:none}
.cw-spin{margin-left:auto;width:10px;height:10px;border-radius:50%;border:1.5px solid var(--cw-line);border-top-color:var(--cw-accent);animation:cw-spin .8s linear infinite;flex:none}
.cw-chart{position:relative;height:100%}
.cw-grid{position:absolute;top:0;bottom:0;width:1px;background:var(--cw-line)}
.cw-b{position:absolute;top:50%;height:12px;transform:translateY(-50%);border-radius:3px;background:var(--cw-bar);border:1px solid var(--cw-bar-b);transition:left .3s,width .3s}
.cw-b.group{background:var(--cw-soft);border-color:var(--cw-line)}
.cw-b.zero{background:none;border:0;border-left:1px solid var(--cw-faint);border-radius:0}
.cw-failed .cw-b.zero{border-left-color:var(--cw-red)}
.cw-running .cw-b{animation:cw-pulse 1.4s ease-in-out infinite}
.cw-num{text-align:right;padding-right:16px;font-variant-numeric:tabular-nums;color:var(--cw-muted);white-space:nowrap}
.cw-th .cw-num{padding-right:16px}
.cw-cost{color:var(--cw-fg)}.cw-th .cw-cost{color:var(--cw-muted)}
.cw-failed .cw-time{color:var(--cw-red)}
.cw-row:not(.cw-th):hover{background:color-mix(in srgb,var(--cw-soft) 60%,transparent)}
.cw-row.open{background:var(--cw-soft)}
.cw-detail{padding:8px 18px 12px 44px;border-top:1px solid var(--cw-line);border-bottom:1px solid var(--cw-line);font-size:12.5px;color:var(--cw-muted);animation:cw-in .18s both}
.cw-detail p{margin:4px 0}.cw-detail b{font-weight:500;color:var(--cw-fg);margin-right:6px}
.cw-err{color:var(--cw-red)}.cw-faint{color:var(--cw-faint)}
.cw :focus-visible{outline:2px solid var(--cw-accent);outline-offset:2px;border-radius:4px}
@keyframes cw-spin{to{transform:rotate(360deg)}}
@keyframes cw-pulse{50%{opacity:.45}}
@keyframes cw-in{from{opacity:0}}
@media(max-width:700px){.cw-row{grid-template-columns:minmax(0,1fr) 90px 54px 50px}.cw-row>.cw-num:nth-child(3),.cw-row>.cw-num:nth-child(4){display:none}.cw-stats{grid-template-columns:1fr 1fr}.cw-stats>div:nth-child(3){display:none}.cw-task{display:none}}
@media(prefers-reduced-motion:reduce){.cw *{animation:none!important;transition:none!important}}
`;

export default CostWaterfall;
