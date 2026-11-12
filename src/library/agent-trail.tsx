"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type TrailState = "done" | "running" | "pending" | "waiting" | "failed";

export type TrailSubstep = {
  id?: string;
  title: string;
  state?: "done" | "running" | "pending";
  detail?: string;
  /** A small coloured inline tag before the detail («Баримт», «Хувийн»). */
  tag?: string;
  /** Category colour of the tag (1–4, the --ts-cat palette). */
  tagTone?: 1 | 2 | 3 | 4;
};

export type TrailStep = {
  id: string;
  title: string;
  state: TrailState;
  /** ms as a number, or your own text. */
  duration?: number | string;
  status?: string;
  startedAt?: number;
  gate?: boolean;
  substeps?: TrailSubstep[];
};

export type AgentTrailLabels = {
  title: string;
  running: string;
  approval: string;
  waiting: string;
  failed: string;
  empty: string;
  untitled: string;
};

export type AgentTrailProps = {
  title?: string;
  steps?: TrailStep[];
  expanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  labels?: Partial<AgentTrailLabels>;
  className?: string;
};

const defaultLabels: AgentTrailLabels = {
  title: "Агентын алхмууд",
  running: "Ажиллаж байна",
  approval: "Батлалт",
  waiting: "Таны ээлж",
  failed: "Алдаатай",
  empty: "Алхам алга",
  untitled: "Нэргүй алхам",
};

const defaultSteps: TrailStep[] = [
  { id: "read", title: "Алдааны мэдээг уншсан", state: "done", duration: 8000 },
  { id: "repro", title: "Гацалтыг давтан үүсгэсэн", state: "done", duration: 34000 },
  {
    id: "patch",
    title: "Төлбөрийн маягтыг засах",
    state: "running",
    status: "Тестлэж байна",
    startedAt: -31000,
    substeps: [
      { title: "Хоосон сагсны тохиолдлыг олсон", detail: "cart.ts:142" },
      { title: "Хамгаалалт ба 2 тест нэмсэн", detail: "+18 −3" },
      { title: "Тестүүдийг ажиллуулж байна", state: "running", detail: "182/214" },
    ],
  },
  { id: "note", title: "Хувилбарын тэмдэглэл бичих", state: "pending" },
  { id: "pr", title: "PR нээх", state: "pending", gate: true },
];

export function formatDuration(v: number | string | undefined): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  const s = Math.max(0, Math.round(v / 1000));
  if (s < 60) return `${s} с`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} мин ${s % 60} с`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} цаг ${m % 60} мин`;
  return `${Math.floor(h / 24)} өдөр ${h % 24} цаг`;
}

function Marker({ step }: { step: TrailStep }) {
  if (step.state === "done")
    return (
      <span className="atr-mk atr-mk-done">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4.5 8.3 2.3 2.2 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  if (step.state === "running") return <span className="atr-mk atr-mk-run" />;
  if (step.state === "failed")
    return (
      <span className="atr-mk atr-mk-fail">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="m5.5 5.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    );
  if (step.gate || step.state === "waiting") return <span className="atr-mk atr-mk-gate" />;
  return <span className="atr-mk atr-mk-pend" />;
}

export function AgentTrail({
  title = "Төлбөрийн гацалтыг засах",
  steps = defaultSteps,
  expanded,
  onExpandedChange,
  labels: labelsIn,
  className = "",
}: AgentTrailProps) {
  const labels = { ...defaultLabels, ...labelsIn };
  // Demo: negative startedAt means "this many ms ago" from mount.
  const [mountedAt] = React.useState(() => Date.now());
  const [now, setNow] = React.useState(() => Date.now());
  const hasRunning = steps.some((s) => s.state === "running" && s.startedAt != null);
  React.useEffect(() => {
    if (!hasRunning) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [hasRunning]);

  const [openLocal, setOpenLocal] = React.useState<string[]>(() =>
    steps.filter((s) => s.state === "running").map((s) => s.id),
  );
  const open = expanded ?? openLocal;
  const toggle = (id: string) => {
    const next = open.includes(id) ? open.filter((x) => x !== id) : [...open, id];
    if (!expanded) setOpenLocal(next);
    onExpandedChange?.(next);
  };

  const doneCount = steps.filter((s) => s.state === "done").length;
  const started = (s: TrailStep) =>
    s.startedAt == null ? undefined : s.startedAt < 0 ? mountedAt + s.startedAt : s.startedAt;

  return (
    <section className={`atr ${className}`} aria-label={title ?? labels.title}>
      <style>{css}</style>
      {title && (
        <header className="atr-head">
          <span className="atr-title">{title}</span>
          <span className="atr-count">
            {doneCount}/{steps.length}
          </span>
        </header>
      )}
      {steps.length === 0 ? (
        <p className="atr-empty">{labels.empty}</p>
      ) : (
        <ol className="atr-list">
          {steps.map((s, i) => {
            const next = steps[i + 1];
            const subs = s.substeps ?? [];
            const isOpen = subs.length > 0 && open.includes(s.id);
            const t0 = started(s);
            const right =
              s.state === "done"
                ? formatDuration(s.duration)
                : s.state === "running" && t0 != null
                  ? formatDuration(now - t0)
                  : s.state === "running"
                    ? formatDuration(s.duration)
                    : "";
            const lineOn = s.state === "done" && next && next.state !== "pending";
            return (
              <li key={s.id} className={`atr-step atr-${s.state}`}>
                <div className="atr-row">
                  <span className="atr-rail">
                    <Marker step={s} />
                    {next && <span className={`atr-line ${lineOn ? "on" : ""}`} />}
                  </span>
                  {subs.length > 0 ? (
                    <button
                      type="button"
                      className="atr-name atr-btn"
                      aria-expanded={isOpen}
                      onClick={() => toggle(s.id)}
                    >
                      {s.title || labels.untitled}
                    </button>
                  ) : (
                    <span className="atr-name">{s.title || labels.untitled}</span>
                  )}
                  {s.state === "running" && (
                    <span className="atr-status">{s.status ?? labels.running}</span>
                  )}
                  {s.state === "waiting" && <span className="atr-pill atr-pill-wait">{labels.waiting}</span>}
                  {s.state === "pending" && s.gate && <span className="atr-pill">{labels.approval}</span>}
                  {s.state === "failed" && <span className="atr-failed">{labels.failed}</span>}
                  {right && <span className="atr-time">{right}</span>}
                </div>
                {isOpen && (
                  <ul className="atr-subs">
                    {subs.map((sub, j) => (
                      <li key={sub.id ?? j} className={`atr-sub atr-sub-${sub.state ?? "done"}`}>
                        <span className="atr-dot" />
                        <span className="atr-sub-t">{sub.title}</span>
                        {sub.tag && <span className={`atr-tag is-c${sub.tagTone ?? 1}`}>{sub.tag}</span>}
                        {sub.detail && <span className="atr-sub-d">{sub.detail}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

const css = `
.atr{--atr-bg:#fff;--atr-fg:#18181b;--atr-muted:#65656d;--atr-faint:#65656d;--atr-line:#ececef;--atr-accent:#0a84ff;--atr-amber:#e0a106;--atr-amber-bg:#fdf3c8;--atr-amber-fg:#8a6100;--atr-red:#e5484d;width:100%;max-width:360px;background:var(--atr-bg);color:var(--atr-fg);border:1px solid var(--atr-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;padding:14px 16px 12px;font:400 14px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .atr{--atr-bg:#1b1b1e;--atr-fg:#ececef;--atr-muted:#a1a1aa;--atr-faint:#9a9aa2;--atr-line:#2e2e33;--atr-accent:#4ea1ff;--atr-amber-bg:#3a2f0e;--atr-amber-fg:#f5c84b;color-scheme:dark}
.atr *{box-sizing:border-box}
.atr-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.atr-title{font-weight:500}.atr-count{font-size:13px;color:var(--atr-muted);font-variant-numeric:tabular-nums}
.atr-list{list-style:none;margin:0;padding:0}
.atr-row{display:flex;align-items:center;gap:10px;min-height:32px}
.atr-rail{position:relative;align-self:stretch;width:16px;display:flex;justify-content:center;align-items:center;flex:none}
.atr-line{position:absolute;left:7.5px;top:calc(50% + 9px);height:calc(100% - 18px + 0px);width:1.5px;background:var(--atr-line)}
.atr-line.on{background:var(--atr-accent)}
.atr-mk{display:grid;place-items:center;width:15px;height:15px;border-radius:50%;flex:none}
.atr-mk svg{width:13px;height:13px}
.atr-mk-done{background:color-mix(in srgb,var(--atr-accent) 14%,transparent);color:var(--atr-accent)}
.atr-mk-run{border:1.5px solid var(--atr-line);border-top-color:var(--atr-accent);animation:atr-spin 1s linear infinite}
.atr-mk-pend{border:1.5px solid var(--atr-line)}
.atr-mk-gate{border:1.5px dashed var(--atr-amber)}
.atr-mk-fail{background:color-mix(in srgb,var(--atr-red) 14%,transparent);color:var(--atr-red)}
.atr-name{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--atr-muted)}
.atr-running .atr-name{color:var(--atr-fg)}
.atr-btn{border:0;background:none;padding:0;font:inherit;text-align:left;cursor:pointer}
.atr-status{font-size:13px;color:var(--atr-accent);background:linear-gradient(90deg,var(--atr-accent) 40%,color-mix(in srgb,var(--atr-accent) 40%,transparent) 50%,var(--atr-accent) 60%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:atr-shim 2.2s linear infinite}
.atr-time{font-size:13px;color:var(--atr-faint);font-variant-numeric:tabular-nums;min-width:22px;text-align:right}
.atr-pill{font-size:12.5px;padding:1px 7px;border-radius:5px;background:var(--atr-amber-bg);color:var(--atr-amber-fg)}
.atr-failed{font-size:13px;color:var(--atr-red)}
.atr-subs{list-style:none;margin:0 0 4px;padding:0 0 0 13px;position:relative}
.atr-subs::before{content:"";position:absolute;left:21.5px;top:0;bottom:12px;width:1.5px;background:var(--atr-line);border-radius:1px}
.atr-sub{position:relative;display:flex;align-items:center;gap:8px;min-height:24px;padding-left:20px;font-size:12.5px;color:var(--atr-muted)}
.atr-dot{position:absolute;left:6.5px;width:5px;height:5px;border-radius:50%;background:var(--atr-faint)}
.atr-sub-running{color:var(--atr-fg)}.atr-sub-running .atr-dot{background:var(--atr-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--atr-accent) 18%,transparent)}
.atr-sub-pending .atr-dot{background:none;border:1px solid var(--atr-faint)}
.atr-sub-t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.atr-sub-d{font-size:11.5px;color:var(--atr-faint);font-variant-numeric:tabular-nums;max-width:45%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.atr-tag{flex:none;padding:0 6px;border-radius:4px;font-size:11.5px;line-height:18px;font-weight:500}
.atr-tag.is-c1{background:var(--ts-cat-1-bg,#fdf3c8);color:var(--ts-cat-1-fg,#7a5600)}
.atr-tag.is-c2{background:var(--ts-cat-2-bg,#e3eefd);color:var(--ts-cat-2-fg,#1d5fb8)}
.atr-tag.is-c3{background:var(--ts-cat-3-bg,#e1f3e6);color:var(--ts-cat-3-fg,#1d6b3a)}
.atr-tag.is-c4{background:var(--ts-cat-4-bg,#efe7fd);color:var(--ts-cat-4-fg,#5b35b5)}
:where(.dark,[data-theme=dark]) .atr-tag.is-c1{background:#3a2f0e;color:#f5c84b}
:where(.dark,[data-theme=dark]) .atr-tag.is-c2{background:#1d2b40;color:#93c5fd}
:where(.dark,[data-theme=dark]) .atr-tag.is-c3{background:#173a25;color:#86d6a0}
:where(.dark,[data-theme=dark]) .atr-tag.is-c4{background:#2c2347;color:#c4b5fd}
.atr-sub{animation:atr-sub-in var(--ts-motion-spring-settle-duration,.5s) var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both}
@keyframes atr-sub-in{from{opacity:0;transform:translateY(4px)}}
.atr-empty{margin:4px 0;color:var(--atr-muted);font-size:13px}
.atr :focus-visible{outline:2px solid var(--atr-accent);outline-offset:2px;border-radius:4px}
@keyframes atr-spin{to{transform:rotate(360deg)}}
@keyframes atr-shim{from{background-position:100% 0}to{background-position:-150% 0}}
@media(max-width:420px){.atr{padding:12px}.atr-sub-d{display:none}}
@media(prefers-reduced-motion:reduce){.atr *{animation:none!important;transition:none!important}}
`;

export default AgentTrail;
