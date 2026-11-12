"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type RadarAgent = {
  id: string;
  name: string;
  model?: string;
  branch?: string;
  icon?: "claude" | "openai" | "grok" | React.ReactNode;
  working?: boolean;
};

export type RadarEdit = {
  agent: string;
  lines: [number, number];
  writing?: boolean;
  /** For conflicts: this agent's way, in one sentence. */
  way?: string;
};

export type RadarFile = { path: string; edits: RadarEdit[] };

export type ConflictRadarProps = {
  agents?: RadarAgent[];
  files?: RadarFile[];
  title?: string;
  resolved?: Record<string, string>;
  onResolve?: (path: string, agentId: string) => void;
  onMerge?: () => void;
  className?: string;
};

// Neutral agent glyphs (circle, square, triangle) – no vendor marks. The "claude" | "openai" | "grok"
// keys are kept for API compatibility and only pick a shape.
const Circle = (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="8" cy="8" r="5.5" />
  </svg>
);
const Square = (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="3" y="3" width="10" height="10" rx="2" />
  </svg>
);
const Triangle = (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
    <path d="M8 2.5 13.5 13h-11Z" />
  </svg>
);
const iconOf = (i: RadarAgent["icon"]) => (i === "openai" ? Square : i === "grok" ? Triangle : i === "claude" || !i ? Circle : i);

const defaultAgents: RadarAgent[] = [
  { id: "checkout", name: "Төлбөрийн агент", model: "Кодын агент", branch: "fix/flaky-checkout", icon: "claude" },
  { id: "payments", name: "Шинэ API агент", model: "Кодын агент", branch: "chore/payments-v2", icon: "openai", working: true },
  { id: "retries", name: "Давталтын агент", model: "Шалгагч агент", branch: "feat/payment-retry", icon: "grok", working: true },
];
const defaultFiles: RadarFile[] = [
  {
    path: "src/checkout/payment.ts",
    edits: [
      { agent: "checkout", lines: [40, 68], way: "Баримт гарахаас өмнө төлбөр баталгаажихыг хүлээнэ" },
      { agent: "payments", lines: [52, 80], writing: true, way: "Төлбөрийн системийн шинэ API руу давхардлаас хамгаалах түлхүүртэй шилжинэ" },
      { agent: "retries", lines: [44, 58], writing: true, way: "Төлбөрийг хойшлуулалттай гурван удаа дахин оролдоно" },
    ],
  },
  { path: "src/checkout/receipt.tsx", edits: [{ agent: "checkout", lines: [12, 30] }] },
  {
    path: "tests/checkout.spec.ts",
    edits: [
      { agent: "checkout", lines: [8, 40], way: "Захиалга төлөгдтөл шалгаж, дараа нь баримтыг шалгана" },
      { agent: "retries", lines: [20, 52], way: "Татгалзсан картын тохиолдол нэмж, гурван оролдлого хүлээнэ" },
    ],
  },
  { path: "src/lib/payments.ts", edits: [{ agent: "payments", lines: [1, 64], writing: true }] },
  { path: "src/lib/retry.ts", edits: [{ agent: "retries", lines: [1, 40] }] },
  { path: "package.json", edits: [{ agent: "payments", lines: [14, 16] }] },
];

const isConflict = (f: RadarFile) => f.edits.filter((e) => e.way).length > 1;

export function ConflictRadar({
  agents = defaultAgents,
  files = defaultFiles,
  title = "Зэрэгцээ ажил",
  resolved: resolvedProp,
  onResolve,
  onMerge,
  className = "",
}: ConflictRadarProps) {
  const [own, setOwn] = React.useState<Record<string, string>>({});
  const resolved = resolvedProp ?? own;
  const conflicts = files.filter(isConflict);
  const firstOpen = conflicts.find((f) => !resolved[f.path]) ?? conflicts[0];
  const [focus, setFocus] = React.useState<string | undefined>(firstOpen?.path);
  const open = conflicts.filter((f) => !resolved[f.path]).length;
  const allDone = open === 0 && agents.every((a) => !a.working);
  const current = files.find((f) => f.path === focus && isConflict(f));

  const pick = (path: string, agent: string) => {
    if (!resolvedProp) setOwn((r) => ({ ...r, [path]: agent }));
    onResolve?.(path, agent);
    const next = conflicts.find((f) => f.path !== path && !resolved[f.path]);
    if (next) window.setTimeout(() => setFocus(next.path), 500);
  };

  const split = (p: string) => {
    const i = p.lastIndexOf("/");
    return i < 0 ? ["", p] : [p.slice(0, i + 1), p.slice(i + 1)];
  };
  const maxLine = (f: RadarFile) => Math.max(80, ...f.edits.map((e) => e.lines[1]));
  const agentStats = (id: string) => {
    const touched = files.filter((f) => f.edits.some((e) => e.agent === id));
    const c = touched.filter((f) => isConflict(f) && !resolved[f.path] && f.edits.some((e) => e.agent === id && e.way)).length;
    const k = touched.filter((f) => resolved[f.path] === id).length;
    return `${touched.length} files · ${c} ${c === 1 ? "conflict" : "conflicts"} · ${k} kept`;
  };

  return (
    <section className={`ui-cr cr ${className}`}>
      <style>{css}</style>
      <header className="cr-bar">
        <svg className="cr-logo" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="8" cy="8" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="m8 8 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <strong>{title}</strong>
        {open > 0 ? (
          <span className="cr-pill">
            {open} {open === 1 ? "conflict" : "conflicts"} to settle
          </span>
        ) : (
          <button type="button" className="cr-merge" disabled={!allDone} onClick={onMerge}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3v10M5 6c0 3 6 2 6 6M11 12v1" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="5" cy="3" r="1.4" fill="currentColor" />
            </svg>
            {allDone ? "Merge" : "Waiting for agents"}
          </button>
        )}
      </header>

      <table className="cr-grid">
        <thead>
          <tr>
            <th className="cr-legend">
              <span className="cr-sr">File</span>
              <span><i className="cr-k-changed" />Changed</span>
              <span><i className="cr-k-conflict" />Conflict</span>
              <span><i className="cr-k-kept" />Kept</span>
            </th>
            {agents.map((a) => (
              <th key={a.id} className="cr-agent" title={`${[a.model, a.branch].filter(Boolean).join(" · ")}\n${agentStats(a.id)}`}>
                <span className="cr-aico">{iconOf(a.icon)}</span>
                {a.name}
                {a.working && <i className="cr-working" aria-label="working" />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {files.map((f) => {
            const [dir, base] = split(f.path);
            const c = isConflict(f);
            const kept = resolved[f.path];
            const max = maxLine(f);
            const cols = agents.map((a) => f.edits.find((e) => e.agent === a.id));
            const idx = cols.map((e, i) => (e?.way ? i : -1)).filter((i) => i >= 0);
            return (
              <tr key={f.path} className={`${c && !kept ? "is-conflict" : ""} ${focus === f.path ? "is-focus" : ""}`}>
                <th scope="row" className="cr-file">
                  {c ? (
                    <button type="button" onClick={() => setFocus(f.path)} aria-pressed={focus === f.path}>
                      <i className={kept ? "cr-dot cr-dot-kept" : "cr-dot cr-dot-c"} />
                      <span className="cr-sr">{kept ? "Settled:" : "Conflict:"}</span>
                      <span className="cr-dir">{dir}</span>
                      {base}
                    </button>
                  ) : (
                    <span>
                      <i className="cr-dot" />
                      <span className="cr-dir">{dir}</span>
                      {base}
                    </span>
                  )}
                </th>
                {cols.map((e, i) => {
                  const state = !e ? "" : kept ? (kept === e.agent ? "kept" : "dropped") : c && e.way ? "conflict" : "changed";
                  const left = e ? (e.lines[0] / max) * 100 : 0;
                  const w = e ? Math.max(14, ((e.lines[1] - e.lines[0]) / max) * 100) : 0;
                  const linkL = c && idx.length > 1 && i > idx[0] && i <= idx[idx.length - 1];
                  return (
                    <td key={agents[i].id} className="cr-cell">
                      {linkL && !kept && <span className="cr-link" />}
                      {e ? (
                        <span
                          className={`cr-barline cr-${state} ${e.writing ? "is-writing" : ""}`}
                          style={{ left: `${Math.min(left, 100 - w) * 0.7 + 15}%`, width: `${w * 0.7}%` }}
                          title={`${agents[i].name} · lines ${e.lines[0]}–${e.lines[1]}${state ? ` · ${state}` : ""}`}
                        />
                      ) : (
                        <i className="cr-empty" aria-label="untouched" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {current && (
        <div className="cr-pick" aria-live="polite">
          <div className="cr-ph">
            <strong>{resolved[current.path] ? "Kept" : "Pick a way"}</strong>
            <span>
              {split(current.path)[1]} · lines {Math.min(...current.edits.filter((e) => e.way).map((e) => e.lines[0]))}–
              {Math.max(...current.edits.filter((e) => e.way).map((e) => e.lines[1]))}
            </span>
          </div>
          <div className="cr-ways" role="radiogroup" aria-label={`Ways to settle ${current.path}`}>
            {current.edits
              .filter((e) => e.way)
              .map((e) => {
                const a = agents.find((x) => x.id === e.agent);
                const on = resolved[current.path] === e.agent;
                return (
                  <button
                    key={e.agent}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className="cr-way"
                    onClick={() => pick(current.path, e.agent)}
                  >
                    <span className="cr-wh">
                      <span className="cr-aico">{iconOf(a?.icon)}</span>
                      {a?.name ?? e.agent}
                      {on && (
                        <svg className="cr-check" viewBox="0 0 16 16" aria-hidden="true">
                          <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                    <span className="cr-wt">{e.way}</span>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </section>
  );
}

const css = `
.cr{--cr-bg:#fff;--cr-fg:#18181b;--cr-muted:#71717a;--cr-faint:#a1a1aa;--cr-line:#ececef;--cr-soft:#f7f7f8;--cr-changed:#dbe8fb;--cr-changed-edge:#a9c6f2;--cr-conflict:#f8d3bd;--cr-conflict-edge:#eaa47c;--cr-hot:#fdf3ec;--cr-dot:#dc4a12;--cr-kept:#cdebd6;--cr-kept-edge:#86c99b;--cr-accent:#3b82f6;width:100%;max-width:560px;background:var(--cr-bg);color:var(--cr-fg);border:1px solid var(--cr-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .cr{--cr-bg:#1b1b1e;--cr-fg:#ececef;--cr-muted:#a1a1aa;--cr-faint:#5c5c64;--cr-line:#2c2c31;--cr-soft:#232328;--cr-changed:#22344f;--cr-changed-edge:#3d5d8c;--cr-conflict:#4a2c1c;--cr-conflict-edge:#a8603a;--cr-hot:#2a1f19;--cr-dot:#fb7a45;--cr-kept:#1d3a27;--cr-kept-edge:#3f8a57;--cr-accent:#7aa2ff;color-scheme:dark}
.cr *{box-sizing:border-box}.cr button{font:inherit;color:inherit;cursor:pointer}
.cr-bar{display:flex;align-items:center;gap:10px;height:52px;padding:0 10px 0 16px;border-bottom:1px solid var(--cr-line)}
.cr-logo{width:15px;height:15px;color:var(--cr-accent)}.cr-bar strong{font-weight:500}
.cr-pill{margin-left:auto;padding:3px 8px;border:1px solid var(--cr-line);border-radius:6px;font-size:12.5px;color:var(--cr-muted)}
.cr-merge{margin-left:auto;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px;border:0;border-radius:7px;background:var(--cr-fg);color:var(--cr-bg)!important;font-weight:500;animation:cr-pop .25s both}
.cr-merge svg{width:14px;height:14px}.cr-merge:disabled{background:var(--cr-soft);color:var(--cr-muted)!important;cursor:default}
.cr-grid{width:100%;border-collapse:collapse;table-layout:fixed}
.cr-grid thead th{height:32px;font-size:12.5px;font-weight:400;color:var(--cr-muted);border-bottom:1px solid var(--cr-line)}
.cr-legend{width:46%;text-align:left;padding:0 0 0 16px;font-size:11px!important}
.cr-legend span:not(.cr-sr){display:inline-flex;align-items:center;gap:5px;margin-right:12px}
.cr-legend i{width:12px;height:5px;border-radius:3px;border:1px solid}
.cr-k-changed{background:var(--cr-changed);border-color:var(--cr-changed-edge)!important}.cr-k-conflict{background:var(--cr-conflict);border-color:var(--cr-conflict-edge)!important}.cr-k-kept{background:var(--cr-kept);border-color:var(--cr-kept-edge)!important}
.cr-agent{border-left:1px solid var(--cr-line);white-space:nowrap}
.cr-aico{display:inline-grid;place-items:center;width:14px;height:14px;margin-right:7px;vertical-align:-2px}.cr-aico svg{width:12px;height:12px}
.cr-working{display:inline-block;width:5px;height:5px;margin-left:5px;border-radius:50%;background:var(--cr-accent);vertical-align:2px;animation:cr-pulse 1.4s infinite}
.cr-grid tbody tr{height:36px;border-bottom:1px solid var(--cr-line);transition:background .2s}
.cr-grid tbody tr.is-conflict.is-focus{background:var(--cr-hot)}
.cr-file{text-align:left;font-weight:400;padding:0 0 0 14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cr-file button,.cr-file>span{display:inline-flex;align-items:center;border:0;background:none;padding:0;text-align:left;font-size:14px}
.cr-dot{width:5px;height:5px;margin-right:11px;border-radius:50%;background:var(--cr-line);flex:none}
.cr-dot-c{background:var(--cr-dot)}.cr-dot-kept{background:var(--cr-kept-edge)}
.cr-dir{color:var(--cr-faint)}
.cr-cell{position:relative;border-left:1px solid var(--cr-line)}
.cr-empty{position:absolute;left:50%;top:50%;width:3px;height:3px;margin:-1.5px;border-radius:50%;background:var(--cr-line)}
.cr-barline{position:absolute;top:50%;height:7px;margin-top:-3.5px;border-radius:4px;border:1px solid;z-index:1;transform-origin:left;animation:cr-grow .5s cubic-bezier(.2,.7,.2,1) both;overflow:hidden}
.cr-changed{background:var(--cr-changed);border-color:var(--cr-changed-edge)}
.cr-conflict{background:var(--cr-conflict);border-color:var(--cr-conflict-edge)}
.cr-kept{background:var(--cr-kept);border-color:var(--cr-kept-edge)}
.cr-dropped{background:var(--cr-soft);border-color:var(--cr-line);opacity:.7}
.cr-barline.is-writing::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,#ffffffb0,transparent);animation:cr-sheen 1.6s infinite}
.cr-link{position:absolute;top:50%;left:-50%;right:50%;height:1px;background:color-mix(in srgb,var(--cr-muted) 60%,transparent);z-index:0}
.cr-link::after{content:"";position:absolute;inset:-1px 0;background:linear-gradient(90deg,transparent,var(--cr-conflict-edge),transparent);background-size:40% 100%;background-repeat:no-repeat;animation:cr-run 2s linear infinite}
.cr-pick{padding:14px 12px 12px;animation:cr-fade .25s both}
.cr-ph{display:flex;align-items:baseline;gap:7px;padding:0 4px 10px}.cr-ph strong{font-weight:500}.cr-ph span{font-size:12.5px;color:var(--cr-muted)}
.cr-ways{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
.cr-way{display:flex;flex-direction:column;gap:8px;padding:12px 12px 11px;text-align:left;border:1px solid var(--cr-line);border-radius:8px;background:var(--cr-soft);transition:border-color .15s,background .15s}
.cr-way:hover{border-color:color-mix(in srgb,var(--cr-fg) 20%,transparent)}
.cr-way[aria-checked=true]{border-color:var(--cr-kept-edge);background:color-mix(in srgb,var(--cr-kept) 50%,var(--cr-bg))}
.cr-wh{display:flex;align-items:center;font-weight:500}.cr-wh .cr-aico{width:18px;height:18px;margin-right:8px;border-radius:5px;background:var(--cr-bg);border:1px solid var(--cr-line)}
.cr-check{width:14px;height:14px;margin-left:auto;color:#16a34a}
.cr-wt{font-size:12.5px;line-height:1.45;color:var(--cr-muted)}
.cr-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.cr :focus-visible{outline:2px solid var(--cr-accent);outline-offset:2px;border-radius:4px}
@keyframes cr-grow{from{transform:scaleX(0)}}
@keyframes cr-sheen{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
@keyframes cr-run{from{background-position:-40% 0}to{background-position:140% 0}}
@keyframes cr-pulse{50%{opacity:.3}}
@keyframes cr-fade{from{opacity:0;transform:translateY(3px)}}
@keyframes cr-pop{from{opacity:0;transform:scale(.95)}}
@media(max-width:520px){.cr-legend span:not(.cr-sr){display:none}.cr-legend{width:42%}.cr-dir{display:none}.cr-agent{font-size:0!important}.cr-agent .cr-aico{margin:0}}
@media(prefers-reduced-motion:reduce){.cr *,.cr *::after{animation:none!important;transition:none!important}}
`;

export default ConflictRadar;
