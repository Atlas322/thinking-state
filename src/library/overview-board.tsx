/**
 * OverviewBoard (2026-11-17, screens.22): the first thing an Area or a Project shows — where it
 * stands, in one screen. One sentence, at most two actions, four numbers, one status bar, an
 * optional timeline (a project's plan as bars over weeks) and two short lists.
 *
 *   <OverviewBoard {...overviewBoardAreaDemo} />      // Хүрээ · Санхүү
 *   <OverviewBoard {...overviewBoardProjectDemo} />   // Төсөл · Үнийн шинэчлэл, with the timeline
 *
 * Every state is told by a word and a mark's shape as well as its colour (circle = running,
 * diamond = needs you, square = blocked, check = done, ring = not started). The timeline is a
 * list first: each row carries its name, owner, dates and state as text; the bars are a picture
 * of the same rows and fold away in a narrow container.
 * Colours come from the shared status tokens (--ts-status-*). Demo numbers are ac.me, a made-up company.
 */
import * as React from "react";

export type BoardTone = "running" | "needs-you" | "error" | "done" | "idle";

export type BoardKpi = { label: string; value: string; unit?: string; /** Change against the last period, signed: "+60", "−26". */ delta?: string; /** Is the change good news? Colours the delta; the sign still tells the direction. */ good?: boolean; note?: string };
export type BoardSegment = { tone: BoardTone; value: number; /** Overrides the tone's own word. */ label?: string };
export type BoardAction = { label: string; primary?: boolean; href?: string; onClick?: () => void };
export type BoardItem = { id?: string; title: string; meta?: string; tone?: BoardTone; tag?: string };
export type BoardList = { title: string; items: BoardItem[]; empty?: string };
export type BoardTimelineRow = { id?: string; label: string; owner?: string; /** Start and end in columns, fractions allowed (1.5 = the middle of the second column). */ start: number; end: number; tone: BoardTone; /** The dates as text: "11/12 – 11/19". */ when: string };
export type BoardTimeline = { title?: string; /** One label per column (weeks, months). */ ticks: string[]; /** Where today falls, in columns. */ today?: number; todayLabel?: string; rows: BoardTimelineRow[] };

export type OverviewBoardLabels = { tone: Record<BoardTone, string>; status: string; timeline: string; today: string; of: string };
export const overviewBoardLabelsMn: OverviewBoardLabels = {
  tone: { running: "Явж байна", "needs-you": "Таныг хүлээж байна", error: "Саатсан", done: "Дууссан", idle: "Эхлээгүй" },
  status: "Ажлын төлөв",
  timeline: "Төлөвлөгөө",
  today: "Өнөөдөр",
  of: "нийт",
};

export type OverviewBoardProps = {
  /** What this is and where it lives: «Хүрээ · Санхүү», «Төсөл · Борлуулалт». */
  eyebrow?: string;
  title: string;
  /** Where it stands, in one sentence. */
  sentence: string;
  /** At most two; the rest belongs in the views behind the board. */
  actions?: BoardAction[];
  /** Four numbers. */
  kpis?: BoardKpi[];
  statusTitle?: string;
  status?: BoardSegment[];
  timeline?: BoardTimeline;
  /** Two short lists. */
  lists?: BoardList[];
  /** Stop the bars' entrance (screenshots). Reduced motion stops it too. */
  still?: boolean;
  labels?: OverviewBoardLabels;
  className?: string;
};

const SHAPE: Record<BoardTone, string> = { running: "circle", "needs-you": "diamond", error: "square", done: "check", idle: "ring" };

function Mark({ tone }: { tone: BoardTone }) {
  return (
    <span className="ob-mark" data-tone={tone} data-shape={SHAPE[tone]} aria-hidden="true">
      {tone === "done" && <svg viewBox="0 0 8 8"><path d="M1.5 4.2 3.3 6l3.2-3.8" /></svg>}
    </span>
  );
}

const CSS = `
.ob{--ob-bg:var(--ts-surface,#fff);--ob-fg:var(--ts-fg,#18181b);--ob-muted:var(--ts-muted,#52525b);--ob-faint:var(--ts-faint,#5c5c66);--ob-line:var(--ts-line,#e4e4e7);--ob-soft:var(--ts-soft,#f4f4f5);--ob-strong:var(--ts-accent-strong,#1b5cff);--ob-good:var(--ts-status-done-fg,#3f5e41);--ob-bad:var(--ts-status-error-fg,#b4232a);
--ob-running:var(--ts-status-running-fg,#1d5fb8);--ob-running-bg:var(--ts-status-running-bg,#e3effd);--ob-running-line:var(--ts-status-running-border,#b8d3f6);
--ob-needs-you:var(--ts-status-needs-you-fg,#a33e0b);--ob-needs-you-bg:var(--ts-status-needs-you-bg,#fdebd6);--ob-needs-you-line:var(--ts-status-needs-you-border,#f2c597);
--ob-error:var(--ts-status-error-fg,#b4232a);--ob-error-bg:var(--ts-status-error-bg,#fde4e4);--ob-error-line:var(--ts-status-error-border,#f4b4b6);
--ob-done:var(--ts-status-done-fg,#3f5e41);--ob-done-bg:var(--ts-status-done-bg,#e3eadf);--ob-done-line:var(--ts-status-done-border,#bfd2bb);
--ob-idle:var(--ts-status-idle-fg,#45433f);--ob-idle-bg:var(--ts-status-idle-bg,#efebe1);--ob-idle-line:var(--ts-status-idle-border,#d8d3c6);
container:ob / inline-size;display:grid;gap:16px;width:100%;box-sizing:border-box;color:var(--ob-fg);font:400 14px/1.5 var(--ts-font,Inter,system-ui,sans-serif);text-align:left}
:where(.dark,[data-theme=dark]) .ob{--ob-bg:var(--ts-surface,#1b1b1e);--ob-fg:var(--ts-fg,#ececef);--ob-muted:var(--ts-muted,#a1a1aa);--ob-faint:var(--ts-faint,#9a9aa2);--ob-line:var(--ts-line,#303036);--ob-soft:var(--ts-soft,#26262a);--ob-good:var(--ts-status-done-fg,#8fcf96);--ob-bad:var(--ts-status-error-fg,#f2777b);
--ob-running:var(--ts-status-running-fg,#7fb0f5);--ob-running-bg:var(--ts-status-running-bg,#1d2b40);--ob-running-line:var(--ts-status-running-border,#2c4a72);
--ob-needs-you:var(--ts-status-needs-you-fg,#f0883e);--ob-needs-you-bg:var(--ts-status-needs-you-bg,#3a2717);--ob-needs-you-line:var(--ts-status-needs-you-border,#6b4220);
--ob-error:var(--ts-status-error-fg,#f2777b);--ob-error-bg:var(--ts-status-error-bg,#3a1e20);--ob-error-line:var(--ts-status-error-border,#6e3033);
--ob-done:var(--ts-status-done-fg,#8fcf96);--ob-done-bg:var(--ts-status-done-bg,#1f2d22);--ob-done-line:var(--ts-status-done-border,#355238);
--ob-idle:var(--ts-status-idle-fg,#a1a1aa);--ob-idle-bg:var(--ts-status-idle-bg,#26262a);--ob-idle-line:var(--ts-status-idle-border,#4e4d49)}
.ob *{box-sizing:border-box}
.ob-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 16px;align-items:start}
.ob-eyebrow{grid-column:1/-1;margin:0;font-size:12px;font-weight:500;letter-spacing:.02em;color:var(--ob-faint)}
.ob-title{margin:0;font:600 24px/1.2 var(--ts-font-head,var(--ts-font,Inter,system-ui,sans-serif));letter-spacing:-.01em;text-wrap:balance}
.ob-lede{grid-column:1;margin:0;max-width:62ch;font-size:15px;line-height:1.5;color:var(--ob-muted);text-wrap:pretty}
.ob-actions{grid-column:2;grid-row:2/4;display:flex;gap:8px;align-self:start}
.ob-btn{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:0 14px;border:1px solid var(--ts-btn-line,var(--ob-line));border-radius:var(--ts-radius-control,8px);background:var(--ts-btn-bg,var(--ob-bg));color:var(--ts-btn-fg,var(--ob-fg));font:inherit;font-size:13px;font-weight:500;white-space:nowrap;text-decoration:none;cursor:pointer;transition:background var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-xs,120ms)}
.ob-btn:hover{background:var(--ob-soft)}
.ob-btn:active{transform:scale(.97)}
.ob-btn.is-primary{border-color:var(--ob-strong);background:var(--ob-strong);color:#fff}
.ob-btn.is-primary:hover{background:color-mix(in srgb,var(--ob-strong) 88%,#000)}
.ob :focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ob-bg),0 0 0 2px var(--ob-strong)}
.ob-kpis{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.ob-kpi{display:grid;gap:2px;padding:12px 14px;border:1px solid var(--ob-line);border-radius:var(--ts-radius-card,12px);background:var(--ob-bg);min-width:0}
.ob-kpi-l{font-size:12px;color:var(--ob-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ob-kpi-v{font:600 22px/1.2 var(--ts-font-head,var(--ts-font,Inter,system-ui,sans-serif));font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.ob-kpi-v small{margin-left:4px;font:400 12px/1 var(--ts-font,Inter,system-ui,sans-serif);color:var(--ob-faint);letter-spacing:0}
.ob-kpi-d{font-size:12px;font-variant-numeric:tabular-nums;color:var(--ob-muted)}
.ob-kpi-d b{font-weight:600}
.ob-kpi-d[data-good=true] b{color:var(--ob-good)}
.ob-kpi-d[data-good=false] b{color:var(--ob-bad)}
.ob-card{padding:14px 16px;border:1px solid var(--ob-line);border-radius:var(--ts-radius-card,12px);background:var(--ob-bg);min-width:0}
.ob-h{margin:0 0 10px;display:flex;align-items:baseline;justify-content:space-between;gap:12px;font-size:13px;font-weight:600}
.ob-h small{font-size:12px;font-weight:400;color:var(--ob-faint);font-variant-numeric:tabular-nums}
.ob-bar{display:flex;gap:2px;height:10px;border-radius:5px;overflow:hidden;background:var(--ob-soft)}
.ob-bar i{display:block;min-width:4px;background:var(--c);transform-origin:left;animation:ob-grow var(--ts-motion-dur-lg,560ms) var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}
.ob-bar i[data-tone=idle]{background:var(--ob-idle-line)}
.ob-legend{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12.5px;color:var(--ob-muted)}
.ob-legend li{display:inline-flex;align-items:center;gap:6px}
.ob-legend b{font-weight:600;color:var(--ob-fg);font-variant-numeric:tabular-nums}
.ob-mark{position:relative;display:inline-grid;place-items:center;flex:none;width:10px;height:10px;background:var(--c);color:var(--ob-bg)}
.ob-mark[data-shape=circle],.ob-mark[data-shape=check]{border-radius:50%}
.ob-mark[data-shape=diamond]{width:9px;height:9px;transform:rotate(45deg);border-radius:1px}
.ob-mark[data-shape=square]{border-radius:1px}
.ob-mark[data-shape=ring]{border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px var(--c)}
.ob-mark svg{width:6px;height:6px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.ob [data-tone=running]{--c:var(--ob-running);--cb:var(--ob-running-bg);--cl:var(--ob-running-line)}
.ob [data-tone=needs-you]{--c:var(--ob-needs-you);--cb:var(--ob-needs-you-bg);--cl:var(--ob-needs-you-line)}
.ob [data-tone=error]{--c:var(--ob-error);--cb:var(--ob-error-bg);--cl:var(--ob-error-line)}
.ob [data-tone=done]{--c:var(--ob-done);--cb:var(--ob-done-bg);--cl:var(--ob-done-line)}
.ob [data-tone=idle]{--c:var(--ob-idle);--cb:var(--ob-idle-bg);--cl:var(--ob-idle-line)}
.ob-tl{--cols:4;--side:minmax(180px,38%)}
.ob-tl .ob-legend{margin-bottom:14px}
.ob-tl-ticks,.ob-tl-row{display:grid;grid-template-columns:var(--side) minmax(0,1fr);gap:12px;align-items:center}
.ob-tl-ticks>div{display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));font:500 11px/1.6 var(--ts-font-mono,ui-monospace,monospace);color:var(--ob-faint)}
.ob-tl-ticks>div span{padding-left:6px;border-left:1px solid var(--ob-line)}
.ob-tl ol{list-style:none;margin:0;padding:0;position:relative}
.ob-tl-row{min-height:38px;border-top:1px solid var(--ob-line)}
.ob-tl-name{display:grid;gap:0;min-width:0;padding:4px 0;line-height:1.35}
.ob-tl-name b{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;min-width:0}
.ob-tl-name b span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ob-tl-name small{padding-left:18px;font-size:12px;color:var(--ob-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ob-tl-track{position:relative;height:38px;background:repeating-linear-gradient(to right,var(--ob-line) 0 1px,transparent 1px calc(100%/var(--cols)))}
.ob-tl-bar{position:absolute;top:9px;height:20px;left:calc(var(--s)/var(--cols)*100%);width:calc((var(--e) - var(--s))/var(--cols)*100%);min-width:10px;border:1px solid var(--cl);border-radius:6px;background:var(--cb);transform-origin:left;animation:ob-grow var(--ts-motion-dur-lg,560ms) var(--ts-motion-ease-enter,cubic-bezier(.05,.7,.1,1)) both}
.ob-tl-bar[data-tone=running]::after{content:"";position:absolute;inset:-1px auto -1px -1px;width:55%;border-radius:6px 0 0 6px;background:color-mix(in srgb,var(--c) 30%,transparent)}
.ob-tl-bar[data-tone=done]{background:color-mix(in srgb,var(--c) 30%,var(--cb))}
.ob-tl-bar[data-tone=idle]{border-style:dashed}
.ob-tl-today{position:absolute;top:0;bottom:0;left:calc(var(--side-w) + 12px + (100% - var(--side-w) - 12px)*var(--t)/var(--cols));width:0;border-left:1.5px solid var(--ob-strong);pointer-events:none}
.ob-tl-today span{position:absolute;top:-19px;left:0;transform:translateX(-50%);padding:0 6px;border-radius:4px;background:var(--ob-strong);color:#fff;font-size:10.5px;line-height:16px;font-weight:500;white-space:nowrap}
.ob-lists{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.ob-list ul{list-style:none;margin:0;padding:0}
.ob-list li{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;min-height:40px;padding:6px 0;border-top:1px solid var(--ob-line)}
.ob-list li:first-child{border-top:0}
.ob-list li>span:nth-child(2){display:grid;min-width:0}
.ob-list b{font-size:13px;font-weight:500;line-height:1.35;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.ob-list small{font-size:12px;color:var(--ob-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ob-tag{padding:1px 8px;border:1px solid var(--cl,var(--ob-line));border-radius:999px;background:var(--cb,var(--ob-soft));color:var(--c,var(--ob-muted));font-size:11.5px;font-weight:500;white-space:nowrap}
.ob-empty{margin:0;font-size:13px;color:var(--ob-faint)}
.ob-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.ob[data-still] .ob-bar i,.ob[data-still] .ob-tl-bar{animation:none}
@keyframes ob-grow{from{transform:scaleX(0)}}
@media (prefers-reduced-motion:reduce){.ob-bar i,.ob-tl-bar{animation:none}.ob-btn{transition:none}}
@container ob (max-width:720px){.ob-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.ob-lists{grid-template-columns:minmax(0,1fr)}.ob-head{grid-template-columns:minmax(0,1fr)}.ob-actions{grid-column:1;grid-row:auto;flex-wrap:wrap}}
@container ob (max-width:560px){.ob-tl-ticks,.ob-tl-track,.ob-tl-today{display:none}.ob-tl-row{grid-template-columns:minmax(0,1fr)}.ob-title{font-size:21px}}
`;

export function OverviewBoard({ eyebrow, title, sentence, actions = [], kpis = [], statusTitle, status = [], timeline, lists = [], still = false, labels = overviewBoardLabelsMn, className = "" }: OverviewBoardProps) {
  const total = status.reduce((n, s) => n + s.value, 0);
  const word = (s: BoardSegment) => s.label ?? labels.tone[s.tone];
  const hasStatus = status.length > 0 && total > 0;
  const hasTimeline = !!timeline && timeline.rows.length > 0;
  const sideRef = React.useRef<HTMLDivElement>(null);
  const [sideW, setSideW] = React.useState(0);
  // the today line sits over the tracks; the name column's width is measured, not guessed
  React.useEffect(() => {
    const el = sideRef.current;
    if (!el) return;
    const read = () => setSideW(el.getBoundingClientRect().width);
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [timeline?.rows.length]);
  return (
    <section className={`ob ${className}`.trim()} data-still={still ? "" : undefined} aria-label={title}>
      <style>{CSS}</style>
      <header className="ob-head">
        {eyebrow && <p className="ob-eyebrow">{eyebrow}</p>}
        <h2 className="ob-title">{title}</h2>
        <p className="ob-lede">{sentence}</p>
        {actions.length > 0 && (
          <div className="ob-actions">
            {actions.slice(0, 2).map((a) =>
              a.href ? (
                <a key={a.label} className={`ob-btn${a.primary ? " is-primary" : ""}`} href={a.href} onClick={a.onClick}>{a.label}</a>
              ) : (
                <button key={a.label} type="button" className={`ob-btn${a.primary ? " is-primary" : ""}`} onClick={a.onClick}>{a.label}</button>
              ),
            )}
          </div>
        )}
      </header>

      {kpis.length > 0 && (
        <ul className="ob-kpis">
          {kpis.slice(0, 4).map((k) => (
            <li key={k.label} className="ob-kpi">
              <span className="ob-kpi-l">{k.label}</span>
              <span className="ob-kpi-v">{k.value}{k.unit && <small>{k.unit}</small>}</span>
              {(k.delta || k.note) && (
                <span className="ob-kpi-d" data-good={k.good === undefined ? undefined : String(k.good)}>
                  {k.delta && <b>{k.delta}</b>}{k.delta && k.note ? " " : ""}{k.note}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {(hasStatus || hasTimeline) && (
        <div className={`ob-card${hasTimeline ? " ob-tl" : ""}`} style={hasTimeline ? ({ "--cols": timeline!.ticks.length, "--side-w": `${sideW}px` } as React.CSSProperties) : undefined}>
          {/* a board with a plan shows its status as the plan's legend: one card, not two */}
          <h3 className="ob-h">{hasTimeline ? timeline!.title ?? labels.timeline : statusTitle ?? labels.status}{hasStatus && <small>{labels.of} {total}</small>}</h3>
          {hasStatus && (
            <>
              <div className="ob-bar" aria-hidden="true">
                {status.filter((s) => s.value > 0).map((s) => <i key={s.tone} data-tone={s.tone} style={{ flex: `${s.value} 0 0` }} />)}
              </div>
              <ul className="ob-legend">
                {status.map((s) => (
                  <li key={s.tone} data-tone={s.tone}><Mark tone={s.tone} /><b>{s.value}</b> {word(s)}</li>
                ))}
              </ul>
            </>
          )}
          {hasTimeline && (
            <>
              <div className="ob-tl-ticks" aria-hidden="true">
                <div ref={sideRef} />
                <div>{timeline!.ticks.map((t) => <span key={t}>{t}</span>)}</div>
              </div>
              <ol>
                {timeline!.rows.map((r) => (
                  <li key={r.id ?? r.label} className="ob-tl-row" data-tone={r.tone}>
                    <div className="ob-tl-name">
                      <b><Mark tone={r.tone} /><span>{r.label}</span></b>
                      <small>{r.owner ? `${r.owner} · ` : ""}{r.when} · {labels.tone[r.tone]}</small>
                    </div>
                    <div className="ob-tl-track" aria-hidden="true">
                      <i className="ob-tl-bar" data-tone={r.tone} style={{ "--s": r.start, "--e": r.end } as React.CSSProperties} />
                    </div>
                  </li>
                ))}
                {timeline!.today !== undefined && sideW > 0 && (
                  <li className="ob-tl-today" aria-hidden="true" style={{ "--t": timeline!.today } as React.CSSProperties}><span>{timeline!.todayLabel ?? labels.today}</span></li>
                )}
              </ol>
            </>
          )}
        </div>
      )}

      {lists.length > 0 && (
        <div className="ob-lists">
          {lists.slice(0, 2).map((l) => (
            <div key={l.title} className="ob-card ob-list">
              <h3 className="ob-h">{l.title}<small>{l.items.length}</small></h3>
              {l.items.length === 0 ? (
                <p className="ob-empty">{l.empty ?? "—"}</p>
              ) : (
                <ul>
                  {l.items.map((it) => (
                    <li key={it.id ?? it.title} data-tone={it.tone}>
                      {it.tone ? <Mark tone={it.tone} /> : <span />}
                      <span><b>{it.title}</b>{it.meta && <small>{it.meta}</small>}</span>
                      {it.tag ? <span className="ob-tag">{it.tag}</span> : it.tone ? <span className="ob-sr">{labels.tone[it.tone]}</span> : <span />}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Demo · Хүрээ: ac.me Cargo-ийн санхүү, 10-р сар (тоо нь FinanceReport-ийн демотой ижил). */
export const overviewBoardAreaDemo: OverviewBoardProps = {
  eyebrow: "Хүрээ · ac.me Cargo · демо",
  title: "Санхүү",
  sentence: "10-р сард цэвэр ашиг 440 сая төгрөг болж өмнөх сараас 26 саяар буурсан: хоёр ачааны машины их засвар зардлыг нэмсэн.",
  actions: [{ label: "Тархинаас асуух" }, { label: "Сарын тайлан", primary: true }],
  kpis: [
    { label: "Орлого", value: "1 240", unit: "сая ₮", delta: "+60", good: true, note: "өмнөх сараас" },
    { label: "Зардал", value: "800", unit: "сая ₮", delta: "+86", good: false, note: "өмнөх сараас" },
    { label: "Цэвэр ашиг", value: "440", unit: "сая ₮", delta: "−26", good: false, note: "өмнөх сараас" },
    { label: "Мөнгөн үлдэгдэл", value: "1 615", unit: "сая ₮", delta: "+230", good: true, note: "өмнөх сараас" },
  ],
  statusTitle: "Энэ сарын ажил",
  status: [
    { tone: "done", value: 11 },
    { tone: "running", value: 4 },
    { tone: "needs-you", value: 2 },
    { tone: "error", value: 1 },
  ],
  lists: [
    {
      title: "Таны шийдвэр хүлээж буй",
      items: [
        { title: "Засварын төсвийг 42 саяар нэмэх", meta: "Санхүүгийн агент · өнөөдөр", tone: "needs-you", tag: "Батлах" },
        { title: "Түлшний гэрээг шинэчлэх", meta: "Худалдан авалт · 11/21 хүртэл", tone: "needs-you", tag: "Батлах" },
      ],
    },
    {
      title: "Энэ хүрээний төсөл",
      items: [
        { title: "Сарын тайланг автоматжуулах", meta: "7/9 алхам", tone: "running" },
        { title: "Нэхэмжлэхийн тулгалт", meta: "Банкны хуулга дутуу", tone: "error" },
        { title: "Татварын тайлан, 3-р улирал", meta: "Илгээсэн", tone: "done" },
      ],
    },
  ],
};

/** Demo · Төсөл: «Үнийн шинэчлэл» (AppScreen-ий төслийн демотой ижил ажил, эзэд). Багана = долоо хоног. */
export const overviewBoardProjectDemo: OverviewBoardProps = {
  eyebrow: "Төсөл · Борлуулалт · ac.me · демо",
  title: "Үнийн шинэчлэл",
  sentence: "9 алхмын 5 нь дууссан; гурван түвшний хүснэгтийн ноорог 11/19-нд гарч, дунд түвшний үнийг та шийднэ.",
  actions: [{ label: "Тархинаас асуух" }, { label: "Шийдвэр гаргах", primary: true }],
  kpis: [
    { label: "Явц", value: "5/9", note: "алхам дууссан" },
    { label: "Дуусах огноо", value: "11/26", note: "8 хоног үлдсэн" },
    { label: "Таныг хүлээж буй", value: "1", note: "шийдвэр" },
    { label: "Ажиллаж буй агент", value: "4" },
  ],
  status: [
    { tone: "done", value: 5 },
    { tone: "running", value: 1 },
    { tone: "needs-you", value: 1 },
    { tone: "idle", value: 2 },
  ],
  timeline: {
    ticks: ["11/03", "11/10", "11/17", "11/24"],
    today: 15 / 7,
    rows: [
      { id: "t1", label: "Одоогийн багцын хэрэглээг задлах", owner: "Судлаач агент", start: 0, end: 4 / 7, tone: "done", when: "11/03 – 11/07" },
      { id: "t2", label: "Өрсөлдөгчийн үнийг харьцуулах", owner: "Судлаач агент", start: 2 / 7, end: 9 / 7, tone: "done", when: "11/05 – 11/12" },
      { id: "t3", label: "Гурван түвшний хүснэгтийн ноорог", owner: "Үнийн агент", start: 9 / 7, end: 16 / 7, tone: "running", when: "11/12 – 11/19" },
      { id: "t4", label: "Санхүүгийн нөлөөллийн тооцоо", owner: "Санхүү", start: 14 / 7, end: 18 / 7, tone: "needs-you", when: "11/17 – 11/21" },
      { id: "t5", label: "Үнийн хуудсыг сайтад шинэчлэх", owner: "Вэб агент", start: 18 / 7, end: 23 / 7, tone: "idle", when: "11/21 – 11/26" },
    ],
  },
  lists: [
    {
      title: "Дараагийн алхам",
      items: [
        { title: "Гурван түвшний хүснэгтийн ноорог гаргах", meta: "Үнийн агент · 11/19", tone: "running" },
        { title: "Дунд түвшний үнийг шийдэх", meta: "Та · 11/21", tone: "needs-you", tag: "Шийдэх" },
      ],
    },
    {
      title: "Эрсдэл",
      items: [
        { title: "Санхүүгийн тооцоо хоцорвол нийтлэх өдөр хойшилно", meta: "Санхүү · 11/21", tone: "needs-you" },
        { title: "Өрсөлдөгчийн үнэ 11-р сард шинэчлэгдэж магадгүй", meta: "Судлаач агент ажиглаж байна", tone: "idle" },
      ],
    },
  ],
};

/** Demo · Хүрээ: маркетинг (ac.me Retail). */
export const overviewBoardMarketingDemo: OverviewBoardProps = {
  eyebrow: "Хүрээ · ac.me Retail · демо",
  title: "Маркетинг",
  sentence: "11-р сарын аяны 12 контентын 7 нь нийтлэгдсэн; хоёр ноорог таны зөвшөөрлийг хүлээж байна.",
  actions: [{ label: "Тархинаас асуух" }, { label: "Ноорог шалгах", primary: true }],
  kpis: [
    { label: "Нийтэлсэн контент", value: "7/12", note: "энэ сард" },
    { label: "Шинэ хүсэлт", value: "38", delta: "+9", good: true, note: "өмнөх сараас" },
    { label: "Зарцуулсан төсөв", value: "64", unit: "%", note: "сарын төсвөөс" },
    { label: "Хариу өгөх хугацаа", value: "2.4", unit: "цаг", delta: "−0.6", good: true, note: "өмнөх сараас" },
  ],
  statusTitle: "Аяны контент",
  status: [
    { tone: "done", value: 7, label: "Нийтэлсэн" },
    { tone: "running", value: 2, label: "Бичиж байна" },
    { tone: "needs-you", value: 2, label: "Таны зөвшөөрлийг хүлээж байна" },
    { tone: "idle", value: 1, label: "Эхлээгүй" },
  ],
  lists: [
    {
      title: "Таны зөвшөөрлийг хүлээж буй",
      items: [
        { title: "Өвлийн хямдралын нийтлэл", meta: "Бичигч агент · 11/19", tone: "needs-you", tag: "Шалгах" },
        { title: "Имэйл: шинэ харилцагчид", meta: "Бичигч агент · 11/20", tone: "needs-you", tag: "Шалгах" },
      ],
    },
    {
      title: "Энэ долоо хоногт",
      items: [
        { title: "Бүтээгдэхүүний зураг авалт", meta: "Дизайны агент · 11/19", tone: "running" },
        { title: "Хямдралын хуудас", meta: "Вэб агент · 11/21", tone: "idle" },
        { title: "Долоо хоногийн тайлан", meta: "Судлаач агент · Баасан", tone: "done" },
      ],
    },
  ],
};

/** Demo · Төсөл: логистик (ac.me Cargo) — агуулахын шилжилт. Багана = долоо хоног. */
export const overviewBoardLogisticsDemo: OverviewBoardProps = {
  eyebrow: "Төсөл · Үйл ажиллагаа · ac.me Cargo · демо",
  title: "Агуулахын шилжилт",
  sentence: "Шинэ агуулах руу нүүх ажил хуваарьтаа явж байна; тавиурын нийлүүлэлт таван хоног хоцорч, нэг шийдвэр таныг хүлээж байна.",
  actions: [{ label: "Тархинаас асуух" }, { label: "Шийдвэр гаргах", primary: true }],
  kpis: [
    { label: "Явц", value: "6/11", note: "алхам дууссан" },
    { label: "Нүүх өдөр", value: "12/01", note: "13 хоног үлдсэн" },
    { label: "Саатсан", value: "1", note: "нийлүүлэлт" },
    { label: "Төсвийн гүйцэтгэл", value: "71", unit: "%" },
  ],
  status: [
    { tone: "done", value: 6 },
    { tone: "running", value: 2 },
    { tone: "needs-you", value: 1 },
    { tone: "error", value: 1 },
    { tone: "idle", value: 1 },
  ],
  timeline: {
    ticks: ["11/03", "11/10", "11/17", "11/24"],
    today: 15 / 7,
    rows: [
      { label: "Барааны тооллого", owner: "Үйл ажиллагааны агент", start: 0, end: 6 / 7, tone: "done", when: "11/03 – 11/09" },
      { label: "Тавиурын нийлүүлэлт", owner: "Худалдан авалт", start: 5 / 7, end: 19 / 7, tone: "error", when: "11/08 – 11/22" },
      { label: "Тээврийн хуваарь", owner: "Төлөвлөгч агент", start: 10 / 7, end: 17 / 7, tone: "running", when: "11/13 – 11/20" },
      { label: "Нүүлгэх зардлыг батлах", owner: "Санхүү", start: 14 / 7, end: 17 / 7, tone: "needs-you", when: "11/17 – 11/20" },
      { label: "Нүүлгэлт", owner: "Үйл ажиллагаа", start: 21 / 7, end: 28 / 7, tone: "idle", when: "11/24 – 12/01" },
    ],
  },
  lists: [
    {
      title: "Дараагийн алхам",
      items: [
        { title: "Нүүлгэх зардлыг батлах", meta: "Та · 11/20", tone: "needs-you", tag: "Батлах" },
        { title: "Тээврийн хуваарийг эцэслэх", meta: "Төлөвлөгч агент · 11/20", tone: "running" },
      ],
    },
    {
      title: "Эрсдэл",
      items: [
        { title: "Тавиур 11/22-оос хойш ирвэл нүүх өдөр хойшилно", meta: "Худалдан авалт", tone: "error" },
        { title: "Нүүх долоо хоногт захиалга ихэсдэг", meta: "Борлуулалтын агент ажиглаж байна", tone: "idle" },
      ],
    },
  ],
};

/** Catalog preview: the project board with its timeline. */
export default function OverviewBoardDemo() {
  return <OverviewBoard {...overviewBoardProjectDemo} />;
}
