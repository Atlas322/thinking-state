"use client";

import * as React from "react";

/**
 * Chapter Divider — when an agent's work moves to a new phase (exploring →
 * building → checking) it marks a chapter: a divider line in the transcript,
 * and a small table of contents that lists the chapters and jumps to one.
 * Thinking State original; a visible chain-of-thought action.
 *
 * Scenario (demo, no props): chapters appear one by one and the current one
 * moves. Motion is off under prefers-reduced-motion.
 */

export type Chapter = {
  id: string;
  title: string;
  /** One-line summary, shown under the divider and as the TOC item's title. */
  summary?: string;
};

export type ChapterDividerLabels = { toc: string; chapter: string; current: string };

export type ChapterDividerProps = {
  chapters?: Chapter[];
  /** Id of the chapter being read; defaults to the last one. */
  current?: string;
  onJump?: (c: Chapter) => void;
  /** Show the divider of the current chapter (true) or only the TOC (false). */
  divider?: boolean;
  labels?: Partial<ChapterDividerLabels>;
  className?: string;
};

const defaultLabels: ChapterDividerLabels = { toc: "Бүлгүүд", chapter: "Бүлэг", current: "одоо" };

const demoChapters: Chapter[] = [
  { id: "explore", title: "Кодын санг судлах", summary: "Байгаа компонентуудыг чатын үйлдэлтэй тулгав" },
  { id: "build", title: "Компонент бичих", summary: "Дараагийн алхам, сешний санал, дэд сешнүүд" },
  { id: "verify", title: "Шалгалт", summary: "Тест, tsc, catalog бүртгэл" },
  { id: "ship", title: "PR нээх", summary: "feat/chat-gaps → main, merge хийхгүй" },
];

export const chapterDividerDemo = { chapters: demoChapters };

const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function ChapterDivider({
  chapters: chaptersProp,
  current: currentProp,
  onJump,
  divider = true,
  labels: labelsProp,
  className = "",
}: ChapterDividerProps) {
  const L = { ...defaultLabels, ...labelsProp };
  const [shown, setShown] = React.useState(chaptersProp ? chaptersProp.length : demoChapters.length);
  const [picked, setPicked] = React.useState<string | undefined>(undefined);
  const all = chaptersProp ?? demoChapters;
  const chapters = all.slice(0, shown);
  const currentId = currentProp ?? picked ?? chapters[chapters.length - 1]?.id;
  const idx = Math.max(0, chapters.findIndex((c) => c.id === currentId));
  const cur = chapters[idx];
  const uid = React.useId();

  React.useEffect(() => {
    if (chaptersProp || reducedMotion()) return;
    setShown(1);
    const ts = [2, 3, 4].map((n, i) => window.setTimeout(() => setShown(n), 1600 * (i + 1)));
    ts.push(window.setTimeout(() => setPicked("build"), 7000));
    ts.push(window.setTimeout(() => setPicked(undefined), 9000));
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [chaptersProp]);

  const jump = (c: Chapter) => {
    setPicked(c.id);
    onJump?.(c);
  };

  return (
    <div className={`cd ${className}`}>
      <style>{css}</style>
      {divider && cur && (
        <div className="cd-divider" role="separator" aria-labelledby={`${uid}-h`} key={cur.id}>
          <span className="cd-line" aria-hidden="true" />
          <div className="cd-label">
            <span className="cd-n">{L.chapter} {idx + 1}</span>
            <strong id={`${uid}-h`}>{cur.title}</strong>
            {cur.summary && <span className="cd-sum">{cur.summary}</span>}
          </div>
          <span className="cd-line" aria-hidden="true" />
        </div>
      )}
      <nav className="cd-toc" aria-label={L.toc}>
        <h4 className="cd-toc-h">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 4.5h10M3 8h10M3 11.5h6" /></svg>
          {L.toc}
        </h4>
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id} className={i === idx ? "is-current" : i < idx ? "is-past" : ""}>
              <button type="button" onClick={() => jump(c)} title={c.summary} aria-current={i === idx ? "step" : undefined}>
                <span className="cd-i">{i + 1}</span>
                <span className="cd-t">{c.title}</span>
                {i === idx && <span className="cd-now">{L.current}</span>}
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

const css = `
.cd{--cd-bg:var(--ts-surface,#fff);--cd-fg:var(--ts-fg,#18181b);--cd-muted:var(--ts-muted,#65656d);--cd-line:var(--ts-line,#ececef);--cd-soft:var(--ts-soft,#f4f4f5);--cd-accent:var(--ts-accent,#1b5cff);--cd-accent-soft:var(--ts-accent-soft,#e8f1fe);width:100%;max-width:560px;box-sizing:border-box;display:flex;flex-direction:column;gap:16px;color:var(--cd-fg);font:400 13px/1.4 var(--ts-font,Inter,system-ui,sans-serif)}
:where(.dark,[data-theme=dark]) .cd{--cd-bg:var(--ts-surface,#1b1b1e);--cd-fg:var(--ts-fg,#ececef);--cd-muted:var(--ts-muted,#a1a1aa);--cd-line:var(--ts-line,#2e2e33);--cd-soft:var(--ts-soft,#26262a);--cd-accent:var(--ts-accent,#7c9cff);--cd-accent-soft:var(--ts-accent-soft,#1b2a44);color-scheme:dark}
.cd svg{width:13px;height:13px;flex:none;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round}
.cd-divider{display:flex;align-items:center;gap:12px;animation:cd-in .4s ease both}
.cd-line{flex:1;height:1px;background:var(--cd-line)}
.cd-label{display:flex;flex-direction:column;align-items:center;text-align:center;max-width:70%}
.cd-n{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--cd-accent)}
.cd-label strong{font-size:14px;font-weight:600}
.cd-sum{color:var(--cd-muted);font-size:12px}
.cd-toc{align-self:flex-end;width:220px;max-width:100%;padding:10px;border:1px solid var(--cd-line);border-radius:12px;background:var(--cd-bg)}
.cd-toc-h{margin:0 0 6px;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--cd-muted)}
.cd-toc ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px}
.cd-toc li{animation:cd-in .3s ease both}
.cd-toc button{width:100%;display:flex;align-items:center;gap:8px;min-height:28px;padding:2px 6px;border:0;border-radius:7px;background:none;color:var(--cd-muted);font:inherit;text-align:left;cursor:pointer}
.cd-toc button:hover{background:var(--cd-soft)}
.cd-toc button:focus-visible{outline:2px solid var(--cd-accent);outline-offset:1px}
.cd-i{width:18px;height:18px;flex:none;display:grid;place-items:center;border-radius:50%;background:var(--cd-soft);font-size:11px;font-variant-numeric:tabular-nums}
.cd-toc .is-past .cd-t{color:var(--cd-fg)}
.cd-toc .is-current button{background:var(--cd-accent-soft);color:var(--cd-fg);font-weight:500}
.cd-toc .is-current .cd-i{background:var(--cd-accent);color:#fff}
.cd-t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cd-now{font-size:11px;color:var(--cd-accent)}
@keyframes cd-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.cd,.cd *{animation:none!important;transition:none!important}}
`;

export default ChapterDivider;
