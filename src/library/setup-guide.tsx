"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type SetupTask = { id: string; label: string; done?: boolean };
export type SetupGroup = { id: string; title: string; tasks: SetupTask[] };

export type SetupGuideProps = {
  groups?: SetupGroup[];
  title?: string;
  onEdit?: () => void;
  onClose?: () => void;
  onChange?: (done: string[]) => void;
  className?: string;
};

const defaultGroups: SetupGroup[] = [
  {
    id: "workspace",
    title: "Ажлын орчноо тохируулах",
    tasks: [
      { id: "name", label: "Ажлын орчны нэр сонгох" },
      { id: "invite", label: "Багийн гишүүдээ хамтран ажиллахаар урих" },
      { id: "calendar", label: "Хуанлиа холбох" },
    ],
  },
  {
    id: "billing",
    title: "Төлбөрийн тохиргоо",
    tasks: [
      { id: "payment", label: "Төлбөрийн хэрэгсэл нэмэх" },
      { id: "plan", label: "Багц сонгох" },
    ],
  },
  { id: "verify", title: "Бүртгэлээ баталгаажуулах", tasks: [{ id: "email", label: "Имэйл хаягаа баталгаажуулах", done: true }] },
];

const Chevron = ({ up }: { up?: boolean }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true" style={{ transform: up ? "rotate(180deg)" : undefined }}>
    <path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function SetupGuide({
  groups = defaultGroups,
  title = "Тохиргооны заавар",
  onEdit = () => {},
  onClose = () => {},
  onChange,
  className = "",
}: SetupGuideProps) {
  const [done, setDone] = React.useState<Set<string>>(
    () => new Set(groups.flatMap((g) => g.tasks.filter((t) => t.done).map((t) => t.id))),
  );
  const groupDone = (g: SetupGroup) => g.tasks.every((t) => done.has(t.id));
  const [open, setOpen] = React.useState<string | null>(() => groups.find((g) => !groupDone(g))?.id ?? null);
  const [mini, setMini] = React.useState(false);
  const [closed, setClosed] = React.useState(false);

  const total = groups.reduce((n, g) => n + g.tasks.length, 0);
  const pct = total ? done.size / total : 0;

  const toggle = (g: SetupGroup, id: string) => {
    const next = new Set(done);
    next.has(id) ? next.delete(id) : next.add(id);
    setDone(next);
    onChange?.([...next]);
    if (g.tasks.every((t) => next.has(t.id))) {
      const following = groups.find((x) => x.id !== g.id && !x.tasks.every((t) => next.has(t.id)));
      window.setTimeout(() => setOpen(following?.id ?? null), 450);
    }
  };

  if (closed) return null;

  return (
    <section className={`sg ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="sg-head">
        <div className="sg-top">
          <strong>{title}</strong>
          {onEdit && (
            <button type="button" className="sg-edit" onClick={onEdit}>
              Засах
            </button>
          )}
          <button type="button" className="sg-ib" aria-label={mini ? "Дэлгэх" : "Хураах"} aria-expanded={!mini} onClick={() => setMini((m) => !m)}>
            <svg viewBox="0 0 16 16"><path d={mini ? "M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" : "M13 3 9.5 6.5M9.5 3v3.5H13M3 13l3.5-3.5M6.5 13V9.5H3"} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {onClose && (
            <button type="button" className="sg-ib" aria-label="Хаах" onClick={() => { setClosed(true); onClose(); }}>
              <svg viewBox="0 0 16 16"><path d="m4.5 4.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
        <div className="sg-prog">
          <div className="sg-bar" role="progressbar" aria-label="Тохиргооны явц" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)}>
            <span style={{ width: `${pct * 100}%` }} />
          </div>
          <span className="sg-count">
            {done.size}/{total}
          </span>
        </div>
      </header>
      <div className={`sg-fold ${mini ? "" : "sg-show"}`} inert={mini ? true : undefined}>
        <div className="sg-groups">
          {groups.map((g) => {
            const isOpen = open === g.id;
            const finished = groupDone(g);
            const firstOpen = g.tasks.findIndex((t) => !done.has(t.id));
            return (
              <div key={g.id} className={`sg-group ${isOpen ? "sg-open" : ""} ${finished ? "sg-finished" : ""}`}>
                <button type="button" className="sg-gh" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : g.id)}>
                  <span>{g.title}</span>
                  <Chevron up={isOpen} />
                </button>
                <div className="sg-panel" inert={!isOpen ? true : undefined}>
                  <ul>
                    {g.tasks.map((t, i) => {
                      const isDone = done.has(t.id);
                      const locked = !isDone && i > firstOpen && firstOpen !== -1;
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            className={`sg-task ${isDone ? "sg-done" : ""} ${locked ? "sg-locked" : ""}`}
                            aria-pressed={isDone}
                            disabled={locked}
                            onClick={() => toggle(g, t.id)}
                          >
                            <span className="sg-check">
                              {isDone && (
                                <svg viewBox="0 0 16 16"><path d="m4.5 8.3 2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              )}
                            </span>
                            <span className="sg-label">{t.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const css = `
.sg{--sg-bg:#fff;--sg-fg:#18181b;--sg-muted:#65656d;--sg-faint:#65656d;--sg-line:#ececef;--sg-soft:#f6f6f7;--sg-accent:#3b82f6;--sg-on-accent:#fff;--sg-track:#e9e9ec;width:100%;max-width:320px;background:var(--sg-bg);color:var(--sg-fg);border:1px solid var(--sg-line);border-radius:10px;box-shadow:0 1px 3px #0000000d;font:400 13.5px/1.4 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .sg{--sg-bg:#1b1b1e;--sg-fg:#ececef;--sg-muted:#a1a1aa;--sg-faint:#9a9aa2;--sg-line:#2e2e33;--sg-soft:#242428;--sg-accent:#60a5fa;--sg-on-accent:#1b1b1e;--sg-track:#2e2e33;color-scheme:dark}
.sg *{box-sizing:border-box}.sg button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;padding:0}
.sg-head{padding:14px 12px 12px 16px;border-bottom:1px solid var(--sg-line)}
.sg-top{display:flex;align-items:center;gap:4px}
.sg-top strong{flex:1;font-size:15px;font-weight:500}
.sg-edit{padding:3px 6px!important;border-radius:6px;font-size:13.5px}.sg-edit:hover{background:var(--sg-soft)}
.sg-ib{display:grid;place-items:center;width:26px;height:26px;border-radius:6px;color:var(--sg-muted)!important}.sg-ib:hover{background:var(--sg-soft);color:var(--sg-fg)!important}
.sg-ib svg{width:14px;height:14px}
.sg-prog{display:flex;align-items:center;gap:10px;margin-top:10px;padding-right:4px}
.sg-bar{flex:1;height:4px;border-radius:99px;background:var(--sg-track);overflow:hidden}
.sg-bar span{display:block;height:100%;border-radius:inherit;background:var(--sg-accent);transition:width .4s cubic-bezier(.2,.8,.2,1)}
.sg-count{font-size:12px;color:var(--sg-muted);font-variant-numeric:tabular-nums}
.sg-fold{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s}.sg-fold.sg-show{grid-template-rows:1fr}.sg-fold>div{overflow:hidden}
.sg-groups{padding:4px}
.sg-group{border-radius:8px;transition:background .25s}
.sg-group+.sg-group{margin-top:2px}
.sg-open{background:var(--sg-soft)}
.sg-gh{display:flex;align-items:center;justify-content:space-between;width:100%;height:36px;padding:0 10px 0 12px!important;text-align:left;font-weight:500}
.sg-gh svg{width:14px;height:14px;color:var(--sg-muted);transition:transform .25s}
.sg-finished .sg-gh span{text-decoration:line-through;color:var(--sg-muted);font-weight:400}
.sg-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s}.sg-open .sg-panel{grid-template-rows:1fr}
.sg-panel ul{overflow:hidden;list-style:none;margin:0;padding:0 8px 0}.sg-open .sg-panel ul{padding-bottom:6px}
.sg-task{display:flex;align-items:center;gap:10px;width:100%;height:32px;padding:0 4px!important;text-align:left;border-radius:6px}
.sg-check{display:grid;place-items:center;width:16px;height:16px;border-radius:50%;border:1.2px solid var(--sg-faint);flex:none;transition:all .2s}
.sg-check svg{width:12px;height:12px;animation:sg-pop .25s both}
.sg-done .sg-check{background:var(--sg-accent);border-color:var(--sg-accent);color:var(--sg-on-accent)}
.sg-done .sg-label{text-decoration:line-through;color:var(--sg-muted)}
.sg-locked{cursor:default!important;color:var(--sg-muted)!important;opacity:1!important}.sg-locked .sg-check{border-style:dashed;border-color:var(--sg-faint)}
.sg-task:not(:disabled):hover .sg-check{border-color:var(--sg-accent)}
.sg :focus-visible{outline:2px solid var(--sg-accent);outline-offset:1px}
@keyframes sg-pop{from{transform:scale(.3);opacity:0}}
@media(pointer:coarse){.sg-task{height:40px}.sg-gh{height:44px}.sg-ib{width:34px;height:34px}}
@media(prefers-reduced-motion:reduce){.sg *{animation:none!important;transition:none!important}}
`;

export default SetupGuide;
