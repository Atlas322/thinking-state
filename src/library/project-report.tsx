"use client";

import * as React from "react";

/**
 * Project Report — one project's state as an agent reports it in chat.
 * A header card (icon, name, status, owner, updated, one-line summary), KPI
 * tiles that count up, a progress line with milestones, the phases (done,
 * active, blocked, next) and a «Waiting on you» block with one action each.
 * Two views of the same data: Status (timeline) and Cards.
 * Original Thinking State chat widget. Colours follow tokens/tokens.json.
 * Data comes in as plain JSON props, so the same object renders here, in a
 * one-file HTML export and in an agent's chat.
 * Motion: tiles count up, the progress bar grows, rows arrive one after
 * another, the active phase pulses; all of it is off under
 * prefers-reduced-motion.
 */

export type ReportTone = "green" | "amber" | "blue" | "red" | "gray";
export type ReportPhaseState = "done" | "active" | "blocked" | "next";
export type ProjectReportView = "status" | "cards";

export type ProjectReportKpi = {
  label: string;
  value: number;
  /** Shown after the number, e.g. "/52" or "%". */
  unit?: string;
  /** Small note under the number, e.g. "+6 this week". */
  note?: string;
  tone?: ReportTone;
};

export type ProjectReportPhase = {
  id: string;
  title: string;
  state: ReportPhaseState;
  line?: string;
  /** Date or period, shown as written. */
  date?: string;
  /** 0–100 for the active phase; done counts as 100. */
  progress?: number;
};

export type ProjectReportWaiting = {
  id: string;
  title: string;
  line?: string;
  /** Button label; the button sends "<action>: <title>" back to the chat. */
  action?: string;
  tone?: ReportTone;
};

export type ProjectReportData = {
  project: {
    name: string;
    icon?: string;
    status?: { label: string; tone?: ReportTone };
    owner?: string;
    updated?: string;
    summary?: string;
  };
  kpis?: ProjectReportKpi[];
  progress?: { value: number; label?: string; milestones?: { at: number; label: string }[] };
  phases?: ProjectReportPhase[];
  waiting?: ProjectReportWaiting[];
};

export type ProjectReportLabels = {
  owner: string;
  updated: string;
  progress: string;
  phases: string;
  waiting: string;
  nothingWaiting: string;
  view: string;
  status: string;
  cards: string;
  done: string;
  active: string;
  blocked: string;
  next: string;
};

export type ProjectReportProps = Partial<ProjectReportData> & {
  view?: ProjectReportView;
  defaultView?: ProjectReportView;
  onViewChange?: (view: ProjectReportView) => void;
  onWaitingAction?: (item: ProjectReportWaiting) => void;
  labels?: Partial<ProjectReportLabels>;
  className?: string;
};

const defaultLabels: ProjectReportLabels = {
  owner: "Owner",
  updated: "Updated",
  progress: "Progress",
  phases: "Phases",
  waiting: "Waiting on you",
  nothingWaiting: "Nothing waits on you right now.",
  view: "View",
  status: "Status",
  cards: "Cards",
  done: "Done",
  active: "In progress",
  blocked: "Blocked",
  next: "Next",
};

export const projectReportDemo: ProjectReportData = {
  project: {
    name: "ac.me Box · Winter box launch",
    icon: "B",
    status: { label: "On track", tone: "green" },
    owner: "Project agent",
    updated: "12 Nov, 14:20",
    summary: "Landing page and pause flow are in review; production deploy waits on one setting.",
  },
  kpis: [
    { label: "Tasks done", value: 34, unit: "/52", note: "+6 this week", tone: "green" },
    { label: "Open PRs", value: 3, note: "1 failing check", tone: "amber" },
    { label: "Decisions", value: 2, note: "wait for you", tone: "amber" },
    { label: "Days to launch", value: 9, tone: "blue" },
  ],
  progress: {
    value: 65,
    label: "Build phase, week 3 of 4",
    milestones: [
      { at: 20, label: "Brief" },
      { at: 45, label: "Design" },
      { at: 80, label: "Preview" },
      { at: 100, label: "Launch" },
    ],
  },
  phases: [
    { id: "research", title: "Customer research", state: "done", line: "27 interviews, 4 themes", date: "Oct 6" },
    { id: "design", title: "Box and landing design", state: "done", line: "Approved in review", date: "Oct 24" },
    { id: "build", title: "Landing page and pause flow", state: "active", line: "2 of 3 PRs green", date: "Nov 14", progress: 70 },
    { id: "deploy", title: "Production deploy", state: "blocked", line: "Waits on one missing setting", date: "Nov 15" },
    { id: "launch", title: "Launch and first shipments", state: "next", line: "Darkhan and Ulaanbaatar", date: "Nov 21" },
  ],
  waiting: [
    { id: "copy", title: "Approve the landing copy", line: "Three headline options, one recommended", action: "Review" },
    { id: "promote", title: "Promote preview to production", line: "Goes live once the setting is added", action: "Approve", tone: "amber" },
  ],
};

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Shows the final number in static markup; counts up from 0 once mounted. */
function useCountUp(target: number, delay: number) {
  const [value, setValue] = React.useState(target);
  const shown = React.useRef(0);
  useIsoLayoutEffect(() => {
    if (reducedMotion() || typeof requestAnimationFrame === "undefined") {
      shown.current = target;
      setValue(target);
      return;
    }
    const from = shown.current;
    setValue(from);
    let raf = 0;
    let start = 0;
    const duration = from === 0 ? 900 : 400;
    const wait = from === 0 ? delay : 0;
    const tick = (t: number) => {
      if (!start) start = t + wait;
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      shown.current = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      setValue(shown.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delay]);
  return value;
}

function Kpi({ k, index }: { k: ProjectReportKpi; index: number }) {
  const shown = useCountUp(k.value, index * 90);
  return (
    <div className={`rp-kpi rp-kt-${k.tone ?? "gray"}`} style={{ "--i": index } as React.CSSProperties}>
      <dt>{k.label}</dt>
      <dd>
        <span className="rp-num">
          <span aria-hidden="true" data-cw-count={k.value} data-cw-delay={index * 90}>
            {shown}
          </span>
          <span className="rp-sr">{k.value}</span>
          {k.unit && <span className="rp-unit">{k.unit}</span>}
        </span>
        {k.note && <span className="rp-note">{k.note}</span>}
      </dd>
    </div>
  );
}

const clamp = (n: number | undefined) => Math.max(0, Math.min(100, Number.isFinite(n) ? Number(n) : 0));

function Marker({ state }: { state: ReportPhaseState }) {
  return (
    <span className="rp-mark" data-s={state} aria-hidden="true">
      {state === "done" && (
        <svg viewBox="0 0 16 16">
          <path d="m4.5 8.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === "blocked" && (
        <svg viewBox="0 0 16 16">
          <path d="M8 4.5v4.2M8 11.2v.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export function ProjectReport({
  project = projectReportDemo.project,
  kpis = projectReportDemo.kpis,
  progress = projectReportDemo.progress,
  phases = projectReportDemo.phases,
  waiting = projectReportDemo.waiting,
  view: viewProp,
  defaultView = "status",
  onViewChange,
  onWaitingAction,
  labels: labelsProp,
  className = "",
}: ProjectReportProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const [viewOwn, setViewOwn] = React.useState<ProjectReportView>(defaultView);
  const view = viewProp ?? viewOwn;
  const setView = (v: ProjectReportView) => {
    setViewOwn(v);
    onViewChange?.(v);
  };
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const views: ProjectReportView[] = ["status", "cards"];
  const icon = project.icon ?? project.name.trim().charAt(0).toUpperCase();
  const pct = clamp(progress?.value);
  const phaseList = phases ?? [];
  const waitList = waiting ?? [];
  const stateLabel = (s: ReportPhaseState) => L[s];

  const phaseProgress = (p: ProjectReportPhase) => (p.state === "done" ? 100 : p.state === "next" ? 0 : clamp(p.progress));

  return (
    <div className={`rp ${className}`} data-cw-root="project-report" data-cw-views="">
      <style>{css}</style>
      <section className="rp-head" aria-labelledby={`${uid}-name`}>
        <div className="rp-id">
          <span className="rp-icon" aria-hidden="true">
            {icon}
          </span>
          <div className="rp-titles">
            <h2 id={`${uid}-name`} className="rp-name">
              {project.name}
            </h2>
            {(project.owner || project.updated) && (
              <p className="rp-meta">
                {project.owner && (
                  <span>
                    {L.owner} · {project.owner}
                  </span>
                )}
                {project.updated && (
                  <span>
                    {L.updated} {project.updated}
                  </span>
                )}
              </p>
            )}
          </div>
          {project.status && <span className={`rp-status rp-tone-${project.status.tone ?? "gray"}`}>{project.status.label}</span>}
        </div>
        {project.summary && <p className="rp-summary">{project.summary}</p>}
        {kpis && kpis.length > 0 && (
          <dl className="rp-kpis">
            {kpis.map((k, i) => (
              <Kpi key={k.label + i} k={k} index={i} />
            ))}
          </dl>
        )}
        {progress && (
          <div className="rp-progress">
            <div className="rp-progress-top">
              <span className="rp-progress-label">{progress.label ?? L.progress}</span>
              <span className="rp-progress-pct">{Math.round(pct)}%</span>
            </div>
            <div
              className="rp-track"
              role="progressbar"
              aria-label={L.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
            >
              <span className="rp-fill" style={{ width: `${pct}%` }} />
              {(progress.milestones ?? []).map((m) => (
                <i key={m.label + m.at} className={`rp-tick${clamp(m.at) <= pct ? " is-past" : ""}`} style={{ left: `${clamp(m.at)}%` }} />
              ))}
            </div>
            {progress.milestones && progress.milestones.length > 0 && (
              <ol className="rp-miles" aria-label={L.progress}>
                {progress.milestones.map((m) => (
                  <li
                    key={m.label + m.at}
                    className={clamp(m.at) <= pct ? "is-past" : ""}
                    style={{ left: `${clamp(m.at)}%` } as React.CSSProperties}
                    data-edge={clamp(m.at) < 8 ? "start" : clamp(m.at) > 92 ? "end" : undefined}
                  >
                    {m.label}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </section>

      {phaseList.length > 0 && (
        <div className="rp-bar">
          <h3 className="rp-h">{L.phases}</h3>
          <div
            className="rp-seg"
            role="radiogroup"
            aria-label={L.view}
            onKeyDown={(e) => {
              const k = e.key;
              if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(k)) return;
              e.preventDefault();
              const at = views.indexOf(view);
              const n = (at + (k === "ArrowRight" || k === "ArrowDown" ? 1 : -1) + views.length) % views.length;
              setView(views[n]);
              refs.current[n]?.focus();
            }}
          >
            {views.map((v, i) => (
              <button
                key={v}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={view === v}
                tabIndex={view === v ? 0 : -1}
                className="rp-seg-opt"
                data-active={view === v || undefined}
                data-cw-view-btn={v}
                onClick={() => setView(v)}
              >
                {v === "status" ? L.status : L.cards}
              </button>
            ))}
          </div>
        </div>
      )}

      {phaseList.length > 0 && (
        <>
          <ol className="rp-phases rp-view" data-cw-view-panel="status" hidden={view !== "status"}>
            {phaseList.map((p, i) => (
              <li key={p.id} className={`rp-phase is-${p.state}`} style={{ "--i": i } as React.CSSProperties}>
                <Marker state={p.state} />
                <div className="rp-ptext">
                  <span className="rp-ptitle">{p.title}</span>
                  {p.line && <span className="rp-pline">{p.line}</span>}
                  {p.state === "active" && (
                    <span className="rp-mini" aria-hidden="true">
                      <span style={{ width: `${phaseProgress(p)}%` }} />
                    </span>
                  )}
                </div>
                <div className="rp-pside">
                  <span className="rp-ptag">{stateLabel(p.state)}</span>
                  {p.date && <span className="rp-pdate">{p.date}</span>}
                </div>
              </li>
            ))}
          </ol>
          <ul className="rp-cards rp-view" data-cw-view-panel="cards" hidden={view !== "cards"}>
            {phaseList.map((p, i) => (
              <li key={p.id} className={`rp-card is-${p.state}`} style={{ "--i": i } as React.CSSProperties}>
                <span className="rp-card-top">
                  <Marker state={p.state} />
                  <span className="rp-ptag">{stateLabel(p.state)}</span>
                  {p.date && <span className="rp-pdate">{p.date}</span>}
                </span>
                <span className="rp-ptitle">{p.title}</span>
                {p.line && <span className="rp-pline">{p.line}</span>}
                <span className="rp-mini" aria-hidden="true">
                  <span style={{ width: `${phaseProgress(p)}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <section className={`rp-wait${waitList.length ? "" : " is-empty"}`} aria-labelledby={`${uid}-wait`}>
        <h3 id={`${uid}-wait`} className="rp-wait-h">
          <span className="rp-wait-dot" aria-hidden="true" />
          {L.waiting}
          {waitList.length > 0 && <span className="rp-wait-count">{waitList.length}</span>}
        </h3>
        {waitList.length === 0 ? (
          <p className="rp-wait-empty">{L.nothingWaiting}</p>
        ) : (
          <ul className="rp-wait-list">
            {waitList.map((w, i) => (
              <li key={w.id} className={`rp-witem rp-wt-${w.tone ?? "blue"}`} style={{ "--i": i } as React.CSSProperties}>
                <span className="rp-wtext">
                  <span className="rp-wtitle">{w.title}</span>
                  {w.line && <span className="rp-wline">{w.line}</span>}
                </span>
                {w.action && (
                  <button
                    type="button"
                    className="rp-wbtn"
                    data-cw-prompt={`${w.action}: ${w.title}`}
                    onClick={() => onWaitingAction?.(w)}
                  >
                    {w.action}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const css = `
.rp{--rp-bg:#fff;--rp-fg:#18181b;--rp-muted:#71717a;--rp-faint:#a1a1aa;--rp-line:#ececef;--rp-soft:#f4f4f5;--rp-accent:#4f7cf0;--rp-accent-soft:#e8f1fe;--rp-green:#16a34a;--rp-green-soft:#e9f8ee;--rp-amber:#c2620a;--rp-amber-soft:#fff4e0;--rp-red:#dc2626;--rp-red-soft:#fdecec;--rp-seg-on:#fff;position:relative;width:100%;max-width:640px;display:flex;flex-direction:column;gap:12px;color:var(--rp-fg);font:400 14px/1.4 Inter,system-ui,sans-serif;container:rp/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .rp{--rp-bg:#1b1b1e;--rp-fg:#ececef;--rp-muted:#a1a1aa;--rp-faint:#71717a;--rp-line:#2e2e33;--rp-soft:#26262a;--rp-accent:#7c9cff;--rp-accent-soft:#1b2a44;--rp-green:#4ade80;--rp-green-soft:#16301f;--rp-amber:#eba659;--rp-amber-soft:#3a2a12;--rp-red:#f87171;--rp-red-soft:#3a1d1f;--rp-seg-on:#3a3a40;color-scheme:dark}
.rp *{box-sizing:border-box}:where(.rp) button{font:inherit;color:inherit;cursor:pointer}
.rp [hidden]{display:none!important}
.rp-head,.rp-phases,.rp-wait,.rp-card{background:var(--rp-bg);border:1px solid var(--rp-line);border-radius:12px;box-shadow:0 1px 2px #0000000a}
.rp-head{padding:14px;animation:rp-in .36s cubic-bezier(.2,.8,.3,1) both}
.rp-id{display:flex;align-items:center;gap:10px;min-width:0}
.rp-icon{display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:9px;background:var(--rp-fg);color:var(--rp-bg);font-size:16px;font-weight:600;line-height:1}
.rp-titles{flex:1;min-width:0}
.rp-name{margin:0;font-size:15px;font-weight:600;line-height:1.3;letter-spacing:-.005em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rp-meta{display:flex;flex-wrap:wrap;gap:0 10px;margin:1px 0 0;font-size:12.5px;color:var(--rp-muted)}
.rp-status{flex:none;display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 8px;border-radius:6px;font-size:12px;font-weight:500;white-space:nowrap}
.rp-status::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
.rp-tone-green{background:var(--rp-green-soft);color:color-mix(in srgb,var(--rp-green) 78%,var(--rp-fg))}
.rp-tone-amber{background:var(--rp-amber-soft);color:color-mix(in srgb,var(--rp-amber) 82%,var(--rp-fg))}
.rp-tone-blue{background:var(--rp-accent-soft);color:color-mix(in srgb,var(--rp-accent) 72%,var(--rp-fg))}
.rp-tone-red{background:var(--rp-red-soft);color:color-mix(in srgb,var(--rp-red) 82%,var(--rp-fg))}
.rp-tone-gray{background:var(--rp-soft);color:var(--rp-muted)}
.rp-summary{margin:10px 0 0;color:var(--rp-fg);font-size:13.5px;line-height:1.45}
.rp-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:12px 0 0;padding:0}
.rp-kpi{display:flex;flex-direction:column-reverse;justify-content:flex-end;gap:1px;padding:8px 10px;border-radius:8px;background:var(--rp-soft);animation:rp-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms + 80ms)}
.rp-kpi dt{font-size:12px;color:var(--rp-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rp-kpi dd{margin:0;display:flex;flex-direction:column}
.rp-num{font-size:20px;font-weight:600;line-height:1.2;letter-spacing:-.01em;font-variant-numeric:tabular-nums;white-space:nowrap}
.rp-unit{margin-left:1px;font-size:13px;font-weight:500;color:var(--rp-muted)}
.rp-note{order:2;font-size:11.5px;color:var(--rp-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rp-kt-green .rp-note{color:color-mix(in srgb,var(--rp-green) 75%,var(--rp-fg))}
.rp-kt-amber .rp-note{color:color-mix(in srgb,var(--rp-amber) 82%,var(--rp-fg))}
.rp-kt-red .rp-note{color:color-mix(in srgb,var(--rp-red) 82%,var(--rp-fg))}
.rp-kt-blue .rp-note{color:color-mix(in srgb,var(--rp-accent) 72%,var(--rp-fg))}
.rp-progress{margin-top:14px}
.rp-progress-top{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:6px;font-size:12.5px}
.rp-progress-label{color:var(--rp-muted);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rp-progress-pct{font-weight:600;font-variant-numeric:tabular-nums}
.rp-track{position:relative;height:8px;border-radius:4px;background:var(--rp-soft)}
.rp-fill{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--rp-accent);transform-origin:left;animation:rp-grow .9s cubic-bezier(.2,.8,.3,1) .15s both}
.rp-fill::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(90deg,transparent,#ffffff59,transparent);background-size:40% 100%;background-repeat:no-repeat;animation:rp-sheen 2.4s ease-in-out 1.2s infinite}
.rp-tick{position:absolute;top:-3px;width:2px;height:14px;margin-left:-1px;border-radius:1px;background:var(--rp-line)}
.rp-tick.is-past{background:color-mix(in srgb,var(--rp-accent) 55%,var(--rp-bg))}
.rp-tick:last-child{margin-left:-2px}
.rp-miles{position:relative;height:18px;margin:6px 0 0;padding:0;list-style:none;font-size:11.5px;color:var(--rp-faint)}
.rp-miles li{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
.rp-miles li[data-edge=start]{transform:none}.rp-miles li[data-edge=end]{transform:translateX(-100%)}
.rp-miles li.is-past{color:var(--rp-muted)}
.rp-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0;padding:0 2px}
.rp-h{margin:0;font-size:13px;font-weight:600;color:var(--rp-muted)}
.rp-seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:var(--rp-soft)}
.rp-seg-opt{height:28px;padding:0 10px;border:0;border-radius:6px;background:none;color:var(--rp-muted);font-size:13px;font-weight:500;white-space:nowrap;transition:color .09s,background .15s,box-shadow .15s}
.rp-seg-opt:hover{color:var(--rp-fg)}
.rp-seg-opt[data-active]{background:var(--rp-seg-on);color:var(--rp-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
.rp-view{animation:rp-fade .22s ease both}
.rp-phases{margin:0;padding:6px 4px;list-style:none}
.rp-phase{position:relative;display:flex;align-items:flex-start;gap:10px;padding:8px 10px 8px 8px;border-radius:8px;animation:rp-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms + 120ms)}
.rp-phase:not(:last-child)::after{content:"";position:absolute;left:17px;top:30px;bottom:-8px;width:2px;border-radius:1px;background:var(--rp-line)}
.rp-phase.is-done:not(:last-child)::after{background:color-mix(in srgb,var(--rp-green) 45%,var(--rp-line))}
.rp-phase.is-active{background:color-mix(in srgb,var(--rp-accent-soft) 70%,transparent)}
.rp-phase.is-blocked{background:color-mix(in srgb,var(--rp-red-soft) 70%,transparent)}
.rp-mark{position:relative;z-index:1;display:grid;place-items:center;flex:none;width:20px;height:20px;margin-top:1px;border-radius:50%;border:1.5px solid var(--rp-faint);background:var(--rp-bg);color:#fff}
.rp-mark svg{width:14px;height:14px}
.rp-mark[data-s=done]{border-color:var(--rp-green);background:var(--rp-green)}
:where(.dark,[data-theme=dark]) .rp-mark[data-s=done],:where(.dark,[data-theme=dark]) .rp-mark[data-s=blocked]{color:#111}
.rp-mark[data-s=active]{border-color:var(--rp-accent);background:var(--rp-bg)}
.rp-mark[data-s=active]::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--rp-accent)}
.rp-mark[data-s=active]::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px solid var(--rp-accent);opacity:0;animation:rp-pulse 1.6s ease-out infinite}
.rp-mark[data-s=blocked]{border-color:var(--rp-red);background:var(--rp-red)}
.rp-ptext{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
.rp-ptitle{font-weight:500;line-height:1.35}
.is-next .rp-ptitle{color:var(--rp-muted);font-weight:400}
.rp-pline{font-size:12.5px;color:var(--rp-muted)}
.rp-pside{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.rp-ptag{display:inline-flex;align-items:center;height:20px;padding:0 6px;border-radius:5px;border:1px solid var(--rp-line);color:var(--rp-muted);font-size:11.5px;font-weight:500;white-space:nowrap}
.is-done .rp-ptag{border-color:transparent;background:var(--rp-green-soft);color:color-mix(in srgb,var(--rp-green) 78%,var(--rp-fg))}
.is-active .rp-ptag{border-color:transparent;background:var(--rp-accent-soft);color:color-mix(in srgb,var(--rp-accent) 72%,var(--rp-fg))}
.is-blocked .rp-ptag{border-color:transparent;background:var(--rp-red-soft);color:color-mix(in srgb,var(--rp-red) 82%,var(--rp-fg))}
.rp-pdate{font-size:12px;color:var(--rp-faint);font-variant-numeric:tabular-nums;white-space:nowrap}
.rp-mini{display:block;position:relative;height:4px;margin-top:6px;border-radius:2px;background:color-mix(in srgb,var(--rp-fg) 8%,transparent);overflow:hidden}
.rp-mini>span{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--rp-accent);transform-origin:left;animation:rp-grow .8s cubic-bezier(.2,.8,.3,1) .3s both}
.is-done .rp-mini>span{background:var(--rp-green)}.is-blocked .rp-mini>span{background:var(--rp-red)}
.rp-phase .rp-mini{max-width:220px}
.rp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin:0;padding:0;list-style:none}
.rp-card{display:flex;flex-direction:column;gap:4px;padding:12px;animation:rp-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 50ms + 60ms)}
.rp-card-top{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.rp-card-top .rp-mark{margin:0}
.rp-card-top .rp-pdate{margin-left:auto}
.rp-card .rp-ptitle{font-weight:600}
.rp-card.is-blocked{border-color:color-mix(in srgb,var(--rp-red) 35%,var(--rp-line))}
.rp-card.is-active{border-color:color-mix(in srgb,var(--rp-accent) 35%,var(--rp-line))}
.rp-card .rp-mini{margin-top:auto;padding-top:0}
.rp-card .rp-pline{margin-bottom:8px}
.rp-wait{padding:12px;border-color:color-mix(in srgb,var(--rp-amber) 30%,var(--rp-line));background:color-mix(in srgb,var(--rp-amber-soft) 45%,var(--rp-bg));animation:rp-in .36s cubic-bezier(.2,.8,.3,1) .2s both}
.rp-wait.is-empty{border-color:var(--rp-line);background:var(--rp-bg)}
.rp-wait-h{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:13.5px;font-weight:600}
.rp-wait.is-empty .rp-wait-h{margin:0}
.rp-wait-dot{width:8px;height:8px;border-radius:50%;background:var(--rp-amber);box-shadow:0 0 0 3px color-mix(in srgb,var(--rp-amber) 22%,transparent)}
.rp-wait.is-empty .rp-wait-dot{background:var(--rp-green);box-shadow:none}
.rp-wait-count{min-width:20px;height:20px;padding:0 6px;border-radius:10px;background:var(--rp-amber-soft);color:color-mix(in srgb,var(--rp-amber) 82%,var(--rp-fg));font-size:12px;line-height:20px;text-align:center;font-variant-numeric:tabular-nums}
.rp-wait-empty{margin:4px 0 0 16px;color:var(--rp-muted);font-size:13px}
.rp-wait-list{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}
.rp-witem{display:flex;align-items:center;gap:10px;padding:9px 10px 9px 12px;border-radius:9px;background:var(--rp-bg);border:1px solid var(--rp-line);animation:rp-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 60ms + 280ms)}
.rp-wtext{flex:1;min-width:0;display:flex;flex-direction:column}
.rp-wtitle{font-weight:500}
.rp-wline{font-size:12.5px;color:var(--rp-muted)}
.rp-wbtn{flex:none;height:30px;padding:0 12px;border:0;border-radius:7px;background:var(--rp-fg);color:var(--rp-bg)!important;font-size:13px;font-weight:500;transition:transform .12s,opacity .15s}
.rp-wbtn:hover{opacity:.88}.rp-wbtn:active{transform:scale(.97)}
.rp-wt-amber .rp-wbtn{background:var(--rp-amber);color:#fff!important}
:where(.dark,[data-theme=dark]) .rp-wt-amber .rp-wbtn{color:#1b1b1e!important}
.rp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.rp :focus-visible{outline:2px solid var(--rp-accent);outline-offset:1px}
@keyframes rp-in{from{opacity:0;transform:translateY(6px)}}
@keyframes rp-fade{from{opacity:0}}
@keyframes rp-grow{from{transform:scaleX(0)}}
@keyframes rp-sheen{0%{background-position:-60% 0}60%,100%{background-position:160% 0}}
@keyframes rp-pulse{0%{opacity:.7;transform:scale(.7)}100%{opacity:0;transform:scale(1.45)}}
@container rp (max-width:520px){.rp-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container rp (max-width:400px){.rp-id{align-items:flex-start}.rp-name{white-space:normal}.rp-pside .rp-ptag{display:none}.rp-witem{flex-wrap:wrap}.rp-wbtn{margin-left:auto}.rp-miles li:not(.is-past):not(:last-child){visibility:hidden}}
@media(prefers-reduced-motion:reduce){.rp *,.rp{animation:none!important;transition:none!important}}
`;

export default ProjectReport;
