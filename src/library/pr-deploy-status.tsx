"use client";

import * as React from "react";

/**
 * PR & Deploy Status — where the code is: open pull requests with their
 * checks and review, and each deploy's pipeline with the step it is stuck on.
 * A stuck or failed deploy shows a blocker card (what, since when, one
 * action) and an optional log that folds open.
 * Original Thinking State chat widget. Colours follow tokens/tokens.json.
 * Data comes in as plain JSON props.
 * With `me` set, an All / Mine switch keeps the pull requests `me` authored or
 * reviews (owner OR sharedWith).
 * Motion: rows arrive one after another, finished pipeline steps fill in,
 * the active step runs and the stuck step pulses; all of it is off under
 * prefers-reduced-motion.
 */

export type PdPrState = "open" | "draft" | "merged" | "closed";
export type PdReview = "approved" | "changes" | "pending";
export type PdDeployState = "live" | "building" | "queued" | "stuck" | "failed";
export type PdStepState = "done" | "active" | "stuck" | "failed" | "next";

export type PdPullRequest = {
  /** Author (vault `owner`). */
  owner?: string;
  /** Reviewers or co-authors. */
  sharedWith?: string[];
  number: number;
  title: string;
  state: PdPrState;
  branch?: string;
  checks?: { passed?: number; failed?: number; pending?: number };
  review?: PdReview;
  updated?: string;
  href?: string;
};

export type PdDeploy = {
  id: string;
  /** Environment name, e.g. "Preview" or "Production". */
  env: string;
  state: PdDeployState;
  /** What is deployed, e.g. a branch or "PR #41". */
  target?: string;
  updated?: string;
  href?: string;
  steps?: { label: string; state: PdStepState; time?: string }[];
  blocker?: {
    title: string;
    detail?: string;
    since?: string;
    /** Button label; the button sends "<action>: <title>" back to the chat. */
    action?: string;
    log?: string[];
  };
};

export type PrDeployStatusData = {
  repo?: string;
  /** The viewer; enables the All / Mine switch on pull requests. */
  me?: string;
  prs?: PdPullRequest[];
  deploys?: PdDeploy[];
};

export type PrDeployStatusLabels = {
  pullRequests: string;
  deploys: string;
  open: string;
  draft: string;
  merged: string;
  closed: string;
  approved: string;
  changes: string;
  pending: string;
  passed: string;
  failed: string;
  running: string;
  live: string;
  building: string;
  queued: string;
  stuck: string;
  deployFailed: string;
  since: string;
  showLog: string;
  hideLog: string;
  noPrs: string;
  noDeploys: string;
  scope: string;
  all: string;
  mine: string;
};

export type PrDeployStatusProps = PrDeployStatusData & {
  onPrClick?: (pr: PdPullRequest) => void;
  scope?: "all" | "mine";
  defaultScope?: "all" | "mine";
  onScopeChange?: (scope: "all" | "mine") => void;
  onBlockerAction?: (deploy: PdDeploy) => void;
  labels?: Partial<PrDeployStatusLabels>;
  className?: string;
};

const defaultLabels: PrDeployStatusLabels = {
  pullRequests: "Нэгтгэх хүсэлтүүд",
  deploys: "Байршуулалт",
  open: "Нээлттэй",
  draft: "Ноорог",
  merged: "Нэгтгэсэн",
  closed: "Хаагдсан",
  approved: "Батлагдсан",
  changes: "Засвар хүссэн",
  pending: "Хяналт хүлээж байна",
  passed: "амжилттай",
  failed: "алдаатай",
  running: "ажиллаж байна",
  live: "Шууд",
  building: "Бүтээж байна",
  queued: "Дараалалд",
  stuck: "Гацсан",
  deployFailed: "Алдаатай",
  since: "болоод",
  showLog: "Лог харах",
  hideLog: "Лог нуух",
  noPrs: "Нээлттэй нэгтгэх хүсэлт алга",
  noDeploys: "Байршуулалт хараахан алга",
  scope: "Харах",
  all: "Бүгд",
  mine: "Минийх",
};

export const prDeployStatusDemo: PrDeployStatusData = {
  repo: "acme/box-web",
  me: "Бат",
  prs: [
    { number: 41, title: "Өвлийн хайрцгийн нүүр хуудас", state: "open", branch: "feat/winter-landing", checks: { passed: 12 }, review: "approved", updated: "18 мин өмнө", owner: "Ану", sharedWith: ["Бат"] },
    { number: 42, title: "Захиалгыг түр зогсоох урсгал", state: "open", branch: "feat/pause-flow", checks: { passed: 10, failed: 1, pending: 1 }, review: "changes", updated: "1 цаг өмнө", owner: "Бат" },
    { number: 43, title: "Дарханы хүргэлтийн цагууд", state: "draft", branch: "feat/darkhan-slots", checks: { pending: 3 }, review: "pending", updated: "2 цаг өмнө", owner: "Цэцэг" },
    { number: 39, title: "Хаягийн маягтын шалгалт", state: "merged", branch: "fix/address-form", checks: { passed: 12 }, updated: "өчигдөр", owner: "Бат" },
  ],
  deploys: [
    {
      id: "preview",
      env: "Туршилтын орчин",
      state: "live",
      target: "PR #41",
      updated: "16 мин өмнө",
      steps: [
        { label: "Дараалал", state: "done", time: "4 с" },
        { label: "Бүтээх", state: "done", time: "1 мин 52 с" },
        { label: "Шалгалт", state: "done", time: "38 с" },
        { label: "Шууд", state: "done" },
      ],
    },
    {
      id: "production",
      env: "Үндсэн орчин",
      state: "stuck",
      target: "үндсэн салбар",
      updated: "38 мин өмнө",
      steps: [
        { label: "Дараалал", state: "done", time: "6 с" },
        { label: "Бүтээх", state: "stuck" },
        { label: "Шалгалт", state: "next" },
        { label: "Шууд", state: "next" },
      ],
      blocker: {
        title: "Тохиргоо дутуу тул бүтээлт хүлээж байна",
        detail: "Үндсэн орчинд хүргэлтийн бүсийн тохиргоо хийгдээгүй тул бүтээлт эхлэхээсээ өмнө зогслоо.",
        since: "38 мин",
        action: "Тохиргоо нэмэх",
        log: [
          "12:42:08  үндсэн салбараас бүтээлт эхэллээ",
          "12:42:11  төслийн тохиргоог уншиж байна",
          "12:42:11  DELIVERY_ZONES тохируулаагүй байна",
          "12:42:11  тохиргоог хүлээж байна, бүтээлт түр зогслоо",
        ],
      },
    },
  ],
};

const STEP_DONE: PdStepState[] = ["done"];
const STEP_LABEL: Record<PdStepState, string> = { done: "дууссан", active: "ажиллаж байна", stuck: "гацсан", failed: "алдаатай", next: "дараагийнх" };

function Checks({ c, L }: { c: NonNullable<PdPullRequest["checks"]>; L: PrDeployStatusLabels }) {
  const passed = c.passed ?? 0;
  const failed = c.failed ?? 0;
  const pending = c.pending ?? 0;
  const total = passed + failed + pending;
  if (!total) return null;
  const state = failed ? "failed" : pending ? "pending" : "passed";
  return (
    <span className={`pd-checks is-${state}`}>
      <span className="pd-ring" aria-hidden="true" style={{ "--ok": `${(passed / total) * 100}%`, "--bad": `${((passed + failed) / total) * 100}%` } as React.CSSProperties} />
      <span aria-hidden="true">
        {passed}/{total}
      </span>
      <span className="pd-sr">
        {passed} {L.passed}
        {failed ? `, ${failed} ${L.failed}` : ""}
        {pending ? `, ${pending} ${L.running}` : ""}
      </span>
    </span>
  );
}

export function PrDeployStatus({
  repo = prDeployStatusDemo.repo,
  me: meProp,
  scope: scopeProp,
  defaultScope = "all",
  onScopeChange,
  prs = prDeployStatusDemo.prs,
  deploys = prDeployStatusDemo.deploys,
  onPrClick,
  onBlockerAction,
  labels: labelsProp,
  className = "",
}: PrDeployStatusProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const uid = React.useId();
  const [logOpen, setLogOpen] = React.useState<Record<string, boolean>>({});
  const prList = prs ?? [];
  // The demo viewer only goes with the demo data; real data passes its own `me`.
  const me = meProp ?? (prs === prDeployStatusDemo.prs ? prDeployStatusDemo.me : undefined);
  const [scopeOwn, setScopeOwn] = React.useState<"all" | "mine">(defaultScope);
  const scope = me ? (scopeProp ?? scopeOwn) : "all";
  const other = (p: PdPullRequest) => (me && p.owner !== me && !(p.sharedWith ?? []).includes(me) ? "" : undefined);
  const depList = deploys ?? [];
  const prState: Record<PdPrState, string> = { open: L.open, draft: L.draft, merged: L.merged, closed: L.closed };
  const depState: Record<PdDeployState, string> = { live: L.live, building: L.building, queued: L.queued, stuck: L.stuck, failed: L.deployFailed };
  const review: Record<PdReview, string> = { approved: L.approved, changes: L.changes, pending: L.pending };

  return (
    <div className={`pd ${className}`} data-cw-root="pr-deploy-status" data-scope={scope}>
      <style>{css}</style>
      <section className="pd-box" aria-labelledby={`${uid}-prs`}>
        <h3 className="pd-h" id={`${uid}-prs`}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="4.5" cy="3.5" r="1.6" />
            <circle cx="4.5" cy="12.5" r="1.6" />
            <circle cx="11.5" cy="12.5" r="1.6" />
            <path d="M4.5 5.1v5.8M11.5 10.9V7.5a2 2 0 0 0-2-2H7.5m0 0 1.6-1.6M7.5 5.5l1.6 1.6" />
          </svg>
          {L.pullRequests}
          {repo && <span className="pd-repo">{repo}</span>}
          {me && (
            <span className="pd-scope" role="group" aria-label={L.scope}>
              {(["all", "mine"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={scope === v}
                  data-active={scope === v || undefined}
                  data-cw-scope-btn={v}
                  onClick={() => {
                    setScopeOwn(v);
                    onScopeChange?.(v);
                  }}
                >
                  {v === "all" ? L.all : L.mine}
                </button>
              ))}
            </span>
          )}
          <span className="pd-count">{prList.filter((p) => p.state === "open" || p.state === "draft").length}</span>
        </h3>
        {prList.length === 0 ? (
          <p className="pd-empty">{L.noPrs}</p>
        ) : (
          <ul className="pd-prs">
            {prList.map((p, i) => {
              const body = (
                <>
                  <span className={`pd-pr-icon is-${p.state}`} aria-hidden="true" />
                  <span className="pd-pr-text">
                    <span className="pd-pr-title">
                      <span className="pd-num">#{p.number}</span> {p.title}
                    </span>
                    {(p.branch || p.updated) && (
                      <span className="pd-pr-line">
                        {p.branch && <code>{p.branch}</code>}
                        {p.owner && <span>{p.owner}</span>}
                        {p.updated && <span>{p.updated}</span>}
                      </span>
                    )}
                  </span>
                  <span className="pd-pr-side">
                    {p.checks && <Checks c={p.checks} L={L} />}
                    {p.review && p.state !== "merged" && p.state !== "closed" && (
                      <span className={`pd-review is-${p.review}`}>{review[p.review]}</span>
                    )}
                    <span className={`pd-tag is-${p.state}`}>{prState[p.state]}</span>
                  </span>
                </>
              );
              return (
                <li key={`${p.number}-${i}`} className={`pd-pr is-${p.state}`} style={{ "--i": i } as React.CSSProperties} data-cw-other={other(p)}>
                  {p.href ? (
                    <a className="pd-pr-btn" href={p.href} target="_blank" rel="noreferrer noopener" onClick={() => onPrClick?.(p)}>
                      {body}
                    </a>
                  ) : (
                    <div className="pd-pr-btn">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="pd-deploys" aria-labelledby={`${uid}-dep`}>
        <h3 className="pd-h pd-h-out" id={`${uid}-dep`}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 2.5c2.6 1.4 3.9 3.6 3.6 6.6L10 11H6L4.4 9.1C4.1 6.1 5.4 3.9 8 2.5Z" />
            <circle cx="8" cy="6.6" r="1.2" />
            <path d="M6.4 12.6 8 14l1.6-1.4" />
          </svg>
          {L.deploys}
        </h3>
        {depList.length === 0 && <p className="pd-empty pd-box">{L.noDeploys}</p>}
        {depList.map((d, i) => {
          const steps = d.steps ?? [];
          const doneCount = steps.filter((s) => STEP_DONE.includes(s.state)).length;
          const logId = `${uid}-log-${d.id}`;
          const isOpen = !!logOpen[d.id];
          return (
            <article key={d.id} className={`pd-box pd-dep is-${d.state}`} style={{ "--i": i } as React.CSSProperties} aria-label={`${d.env}: ${depState[d.state]}`}>
              <header className="pd-dep-head">
                <span className="pd-dot" data-s={d.state} aria-hidden="true" />
                <span className="pd-env">{d.env}</span>
                {d.target && <span className="pd-target">{d.target}</span>}
                <span className={`pd-dtag is-${d.state}`}>{depState[d.state]}</span>
                {d.updated && <span className="pd-updated">{d.updated}</span>}
              </header>
              {steps.length > 0 && (
                <ol className="pd-steps" style={{ "--n": steps.length, "--done": doneCount } as React.CSSProperties}>
                  {steps.map((s, j) => (
                    <li key={s.label + j} className={`pd-step is-${s.state}`} style={{ "--j": j } as React.CSSProperties}>
                      <span className="pd-node" aria-hidden="true" />
                      <span className="pd-slabel">{s.label}</span>
                      {s.time && <span className="pd-stime">{s.time}</span>}
                      <span className="pd-sr">, {STEP_LABEL[s.state] ?? s.state}</span>
                    </li>
                  ))}
                </ol>
              )}
              {d.blocker && (
                <div className="pd-block">
                  <div className="pd-block-top">
                    <span className="pd-block-icon" aria-hidden="true">
                      !
                    </span>
                    <span className="pd-block-text">
                      <strong>{d.blocker.title}</strong>
                      {d.blocker.detail && <span>{d.blocker.detail}</span>}
                    </span>
                  </div>
                  <div className="pd-block-bar">
                    {d.blocker.since && (
                      <span className="pd-since">
                        <span className="pd-since-dot" aria-hidden="true" />
                        {depState[d.state]} {L.since} {d.blocker.since}
                      </span>
                    )}
                    {d.blocker.log && d.blocker.log.length > 0 && (
                      <button
                        type="button"
                        className="pd-logbtn"
                        aria-expanded={isOpen}
                        aria-controls={logId}
                        data-cw-toggle=""
                        data-cw-open-label={L.hideLog}
                        data-cw-closed-label={L.showLog}
                        onClick={() => setLogOpen((o) => ({ ...o, [d.id]: !isOpen }))}
                      >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span data-cw-label="">{isOpen ? L.hideLog : L.showLog}</span>
                      </button>
                    )}
                    {d.blocker.action && (
                      <button
                        type="button"
                        className="pd-action"
                        data-cw-prompt={`${d.blocker.action}: ${d.env} — ${d.blocker.title}`}
                        onClick={() => onBlockerAction?.(d)}
                      >
                        {d.blocker.action}
                      </button>
                    )}
                  </div>
                  {d.blocker.log && d.blocker.log.length > 0 && (
                    <pre id={logId} className="pd-log" hidden={!isOpen}>
                      {d.blocker.log.join("\n")}
                    </pre>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

const css = `
.pd{--pd-bg:var(--ts-surface,#fff);--pd-fg:var(--ts-fg,#18181b);--pd-muted:var(--ts-muted,#71717a);--pd-faint:var(--ts-faint,#a1a1aa);--pd-line:var(--ts-line,#ececef);--pd-soft:var(--ts-soft,#f4f4f5);--pd-accent:var(--ts-accent,#4f7cf0);--pd-accent-soft:var(--ts-accent-soft,#e8f1fe);--pd-green:var(--ts-green,#16a34a);--pd-green-soft:var(--ts-green-soft,#e9f8ee);--pd-amber:var(--ts-amber,#c2620a);--pd-amber-soft:var(--ts-amber-soft,#fff4e0);--pd-red:var(--ts-red,#dc2626);--pd-red-soft:var(--ts-red-soft,#fdecec);--pd-violet:var(--ts-violet,#7c3aed);--pd-violet-soft:var(--ts-violet-soft,#f1ebfd);--pd-code:var(--ts-code,#f7f7f8);position:relative;width:100%;max-width:640px;display:flex;flex-direction:column;gap:12px;color:var(--pd-fg);font:400 14px/1.4 var(--ts-font,Inter,system-ui,sans-serif);container:pd/inline-size;box-sizing:border-box}
:where(.dark,[data-theme=dark]) .pd{--pd-bg:var(--ts-surface,#1b1b1e);--pd-fg:var(--ts-fg,#ececef);--pd-muted:var(--ts-muted,#a1a1aa);--pd-faint:var(--ts-faint,#71717a);--pd-line:var(--ts-line,#2e2e33);--pd-soft:var(--ts-soft,#26262a);--pd-accent:var(--ts-accent,#7c9cff);--pd-accent-soft:var(--ts-accent-soft,#1b2a44);--pd-green:var(--ts-green,#4ade80);--pd-green-soft:var(--ts-green-soft,#16301f);--pd-amber:var(--ts-amber,#eba659);--pd-amber-soft:var(--ts-amber-soft,#3a2a12);--pd-red:var(--ts-red,#f87171);--pd-red-soft:var(--ts-red-soft,#3a1d1f);--pd-violet:var(--ts-violet,#a78bfa);--pd-violet-soft:var(--ts-violet-soft,#2a2140);--pd-code:var(--ts-code,#141416);color-scheme:dark}
.pd *{box-sizing:border-box}:where(.pd) button{font:inherit;color:inherit;cursor:pointer}
.pd [hidden]{display:none!important}
.pd-box{background:var(--pd-bg);border:1px solid var(--pd-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;animation:pd-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 70ms)}
.pd-h{display:flex;align-items:center;gap:8px;margin:0;padding:11px 12px;font-size:13.5px;font-weight:600;border-bottom:1px solid var(--pd-line)}
.pd-h svg{width:16px;height:16px;flex:none;fill:none;stroke:var(--pd-muted);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.pd-h-out{padding:0 2px;border:0;color:var(--pd-muted);font-size:13px}
.pd-repo{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--pd-muted);font:500 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace}
.pd[data-scope=mine] [data-cw-other]{display:none!important}
.pd-scope{display:inline-flex;gap:2px;margin-left:auto;padding:2px;border-radius:8px;background:var(--pd-soft)}
.pd-scope button{height:22px;padding:0 8px;border:0;border-radius:6px;background:none;color:var(--pd-muted);font-size:12px;font-weight:500}
.pd-scope button[data-active]{background:var(--pd-bg);color:var(--pd-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
:where(.dark,[data-theme=dark]) .pd-scope button[data-active]{background:#3a3a40}
.pd-scope+.pd-count{margin-left:0}
.pd-count{margin-left:auto;min-width:22px;height:20px;padding:0 7px;border-radius:10px;background:var(--pd-soft);color:var(--pd-muted);font-size:12px;font-weight:500;line-height:20px;text-align:center;font-variant-numeric:tabular-nums}
.pd-empty{margin:0;padding:12px 14px;color:var(--pd-muted);font-size:13px}
.pd-prs{margin:0;padding:4px;list-style:none}
.pd-pr{animation:pd-in .32s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 45ms + 100ms)}
.pd-pr-btn{display:flex;align-items:center;gap:10px;min-height:48px;padding:7px 8px;border-radius:8px;color:inherit;text-decoration:none;transition:background .15s}
a.pd-pr-btn:hover{background:var(--pd-soft)}
.pd-pr-icon{position:relative;flex:none;width:16px;height:16px;border-radius:50%;border:1.5px solid var(--pd-green)}
.pd-pr-icon::after{content:"";position:absolute;inset:3px;border-radius:50%;background:var(--pd-green)}
.pd-pr-icon.is-draft{border-color:var(--pd-faint);border-style:dashed}.pd-pr-icon.is-draft::after{background:none}
.pd-pr-icon.is-merged{border-color:var(--pd-violet)}.pd-pr-icon.is-merged::after{background:var(--pd-violet)}
.pd-pr-icon.is-closed{border-color:var(--pd-red)}.pd-pr-icon.is-closed::after{background:var(--pd-red)}
.pd-pr-text{flex:1;min-width:0;display:flex;flex-direction:column}
.pd-pr-title{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pd-pr.is-merged .pd-pr-title,.pd-pr.is-closed .pd-pr-title{color:var(--pd-muted);font-weight:400}
.pd-num{color:var(--pd-muted);font-weight:500;font-variant-numeric:tabular-nums}
.pd-pr-line{display:flex;gap:8px;min-width:0;font-size:12px;color:var(--pd-muted);white-space:nowrap;overflow:hidden}
.pd-pr-line code{min-width:0;overflow:hidden;text-overflow:ellipsis;font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
.pd-pr-side{flex:none;display:flex;align-items:center;gap:6px}
.pd-tag,.pd-review,.pd-dtag{display:inline-flex;align-items:center;height:20px;padding:0 6px;border-radius:5px;font-size:11.5px;font-weight:500;white-space:nowrap}
.pd-tag.is-open{background:var(--pd-green-soft);color:color-mix(in srgb,var(--pd-green) 78%,var(--pd-fg))}
.pd-tag.is-draft{background:var(--pd-soft);color:var(--pd-muted)}
.pd-tag.is-merged{background:var(--pd-violet-soft);color:color-mix(in srgb,var(--pd-violet) 80%,var(--pd-fg))}
.pd-tag.is-closed{background:var(--pd-red-soft);color:color-mix(in srgb,var(--pd-red) 82%,var(--pd-fg))}
.pd-review{border:1px solid var(--pd-line);color:var(--pd-muted);font-weight:400}
.pd-review.is-approved{border-color:color-mix(in srgb,var(--pd-green) 40%,var(--pd-line));color:color-mix(in srgb,var(--pd-green) 78%,var(--pd-fg))}
.pd-review.is-changes{border-color:color-mix(in srgb,var(--pd-amber) 45%,var(--pd-line));color:color-mix(in srgb,var(--pd-amber) 82%,var(--pd-fg))}
.pd-checks{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--pd-muted);font-variant-numeric:tabular-nums}
.pd-checks.is-failed{color:color-mix(in srgb,var(--pd-red) 82%,var(--pd-fg))}
.pd-ring{width:14px;height:14px;border-radius:50%;background:conic-gradient(var(--pd-green) 0 var(--ok),var(--pd-red) var(--ok) var(--bad),var(--pd-line) var(--bad) 100%);-webkit-mask:radial-gradient(circle,transparent 3.6px,#000 4px);mask:radial-gradient(circle,transparent 3.6px,#000 4px)}
.pd-checks.is-pending .pd-ring{animation:pd-spin 1.4s linear infinite}
.pd-deploys{display:flex;flex-direction:column;gap:8px}
.pd-dep{padding:12px}
.pd-dep.is-stuck{border-color:color-mix(in srgb,var(--pd-amber) 40%,var(--pd-line))}
.pd-dep.is-failed{border-color:color-mix(in srgb,var(--pd-red) 40%,var(--pd-line))}
.pd-dep-head{display:flex;align-items:center;gap:8px;min-width:0;flex-wrap:wrap}
.pd-dot{position:relative;flex:none;width:8px;height:8px;border-radius:50%;background:var(--pd-faint)}
.pd-dot[data-s=live]{background:var(--pd-green)}
.pd-dot[data-s=building]{background:var(--pd-accent)}
.pd-dot[data-s=stuck]{background:var(--pd-amber)}
.pd-dot[data-s=failed]{background:var(--pd-red)}
.pd-dot[data-s=building]::after,.pd-dot[data-s=stuck]::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1.5px solid currentColor;color:var(--pd-accent);opacity:0;animation:pd-pulse 1.6s ease-out infinite}
.pd-dot[data-s=stuck]::after{color:var(--pd-amber)}
.pd-env{font-weight:600}
.pd-target{color:var(--pd-muted);font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace}
.pd-dtag.is-live{background:var(--pd-green-soft);color:color-mix(in srgb,var(--pd-green) 78%,var(--pd-fg))}
.pd-dtag.is-building,.pd-dtag.is-queued{background:var(--pd-accent-soft);color:color-mix(in srgb,var(--pd-accent) 72%,var(--pd-fg))}
.pd-dtag.is-stuck{background:var(--pd-amber-soft);color:color-mix(in srgb,var(--pd-amber) 82%,var(--pd-fg))}
.pd-dtag.is-failed{background:var(--pd-red-soft);color:color-mix(in srgb,var(--pd-red) 82%,var(--pd-fg))}
.pd-updated{margin-left:auto;font-size:12px;color:var(--pd-faint);white-space:nowrap}
.pd-steps{position:relative;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));margin:14px 0 2px;padding:0;list-style:none}
.pd-step{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;min-width:0}
.pd-step::before{content:"";position:absolute;top:6px;left:-50%;right:50%;height:2px;background:var(--pd-line)}
.pd-step:first-child::before{display:none}
.pd-step.is-done::before,.pd-step.is-active::before,.pd-step.is-stuck::before,.pd-step.is-failed::before{background:var(--pd-green);transform-origin:left;animation:pd-grow .4s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--j) * 160ms + 200ms)}
.pd-node{position:relative;z-index:1;width:14px;height:14px;border-radius:50%;border:2px solid var(--pd-line);background:var(--pd-bg)}
.pd-step.is-done .pd-node{border-color:var(--pd-green);background:var(--pd-green);animation:pd-pop .3s cubic-bezier(.2,.8,.3,1.4) both;animation-delay:calc(var(--j) * 160ms + 200ms)}
.pd-step.is-active .pd-node{border-color:var(--pd-accent);background:var(--pd-bg)}
.pd-step.is-active .pd-node::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid transparent;border-top-color:var(--pd-accent);animation:pd-spin 1s linear infinite}
.pd-step.is-stuck .pd-node{border-color:var(--pd-amber);background:var(--pd-amber)}
.pd-step.is-stuck .pd-node::after,.pd-step.is-failed .pd-node::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid var(--pd-amber);opacity:0;animation:pd-pulse 1.6s ease-out infinite}
.pd-step.is-failed .pd-node{border-color:var(--pd-red);background:var(--pd-red)}.pd-step.is-failed .pd-node::after{border-color:var(--pd-red)}
.pd-slabel{max-width:100%;font-size:12.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pd-step.is-next .pd-slabel{color:var(--pd-faint);font-weight:400}
.pd-step.is-stuck .pd-slabel{color:color-mix(in srgb,var(--pd-amber) 82%,var(--pd-fg))}
.pd-step.is-failed .pd-slabel{color:color-mix(in srgb,var(--pd-red) 82%,var(--pd-fg))}
.pd-stime{font-size:11.5px;color:var(--pd-faint);font-variant-numeric:tabular-nums}
.pd-block{margin-top:12px;padding:10px 10px 10px 12px;border-radius:9px;background:var(--pd-amber-soft);animation:pd-in .34s cubic-bezier(.2,.8,.3,1) .45s both}
.is-failed .pd-block{background:var(--pd-red-soft)}
.pd-block-top{display:flex;gap:10px;align-items:flex-start}
.pd-block-icon{display:grid;place-items:center;flex:none;width:20px;height:20px;margin-top:1px;border-radius:50%;background:var(--pd-amber);color:#fff;font-size:13px;font-weight:700;line-height:1}
.is-failed .pd-block-icon{background:var(--pd-red)}
:where(.dark,[data-theme=dark]) .pd-block-icon{color:#1b1b1e}
.pd-block-text{display:flex;flex-direction:column;gap:2px;min-width:0}
.pd-block-text strong{font-weight:600}
.pd-block-text span{font-size:13px;color:color-mix(in srgb,var(--pd-fg) 75%,var(--pd-amber-soft))}
.pd-block-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px;padding-left:30px}
.pd-since{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:color-mix(in srgb,var(--pd-amber) 82%,var(--pd-fg));font-variant-numeric:tabular-nums}
.is-failed .pd-since{color:color-mix(in srgb,var(--pd-red) 82%,var(--pd-fg))}
.pd-since-dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:pd-blink 1.6s ease-in-out infinite}
.pd-logbtn{display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 8px 0 6px;border:0;border-radius:6px;background:none;color:var(--pd-muted);font-size:12.5px;transition:background .15s,color .15s}
.pd-logbtn:hover{background:color-mix(in srgb,var(--pd-fg) 7%,transparent);color:var(--pd-fg)}
.pd-logbtn svg{width:14px;height:14px;transition:transform .2s cubic-bezier(.2,.8,.3,1)}
.pd-logbtn[aria-expanded=true] svg{transform:rotate(90deg)}
.pd-action{margin-left:auto;height:30px;padding:0 12px;border:0;border-radius:7px;background:var(--pd-fg);color:var(--pd-bg)!important;font-size:13px;font-weight:500;transition:opacity .15s,transform .12s}
.pd-action:hover{opacity:.88}.pd-action:active{transform:scale(.97)}
.pd-log{margin:10px 0 0;padding:10px 12px;border-radius:7px;background:var(--pd-code);color:var(--pd-muted);font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;word-break:break-word;animation:pd-fade .2s ease both}
.pd-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.pd :focus-visible{outline:2px solid var(--pd-accent);outline-offset:1px}
@keyframes pd-in{from{opacity:0;transform:translateY(6px)}}
@keyframes pd-fade{from{opacity:0}}
@keyframes pd-grow{from{transform:scaleX(0)}}
@keyframes pd-pop{from{transform:scale(.4)}}
@keyframes pd-spin{to{transform:rotate(360deg)}}
@keyframes pd-blink{50%{opacity:.35}}
@keyframes pd-pulse{0%{opacity:.75;transform:scale(.7)}100%{opacity:0;transform:scale(1.5)}}
@container pd (max-width:520px){.pd-review{display:none}.pd-pr-btn{align-items:flex-start}.pd-pr-side{flex-direction:column;align-items:flex-end;gap:4px}}
@container pd (max-width:400px){.pd-pr-line code{display:none}.pd-block-bar{padding-left:0}.pd-updated{width:100%;margin-left:16px}.pd-slabel{font-size:12px}}
@media(prefers-reduced-motion:reduce){.pd *,.pd{animation:none!important;transition:none!important}}
`;

export default PrDeployStatus;
