"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type ProjectTask = { id: string; label: string; done?: boolean; assignee?: string };
export type ProjectTone = "red" | "amber" | "green" | "blue" | "violet" | "gray";
export type ProjectOption = { id: string; label: string; tone?: ProjectTone; icon?: React.ReactNode };
export type ProjectMember = { name: string; avatar?: string };

export type ProjectCardProps = {
  title?: string;
  tasks?: ProjectTask[];
  onTasksChange?: (tasks: ProjectTask[]) => void;
  status?: string;
  statuses?: ProjectOption[];
  onStatusChange?: (id: string) => void;
  due?: string;
  members?: ProjectMember[];
  action?: { label: string; onClick: () => void };
  hint?: React.ReactNode;
  trigger?: "hover" | "click";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const defaultStatuses: ProjectOption[] = [
  { id: "todo", label: "Хийх", tone: "gray" },
  { id: "progress", label: "Хийгдэж байна", tone: "amber" },
  { id: "review", label: "Хяналтад", tone: "violet" },
  { id: "done", label: "Дууссан", tone: "green" },
];

const defaultTasks: ProjectTask[] = [
  { id: "1", label: "Угтах дэлгэц", done: true, assignee: "Мөнхзул" },
  { id: "2", label: "Ажлын орчин тохируулах", done: true, assignee: "Жаргал" },
  { id: "3", label: "Багийнхныг урих", done: true, assignee: "Мөнхзул" },
  { id: "4", label: "Эхний ажиллуулалтын жагсаалт", assignee: "Пүрэвсүрэн" },
  { id: "5", label: "Харилцагчийн имэйлүүд", assignee: "Жаргал" },
];

const defaultMembers: ProjectMember[] = [{ name: "Мөнхзул" }, { name: "Жаргал" }, { name: "Пүрэвсүрэн" }];

const softColors = ["#dcf3e3", "#e7e3fb", "#dfe7fb", "#fbe6dc", "#fdf0c8", "#fde2ea"];
const inkColors = ["#2f7d4a", "#6b4fc8", "#3d63c9", "#b8572e", "#9a7208", "#b23a62"];

function StatusIcon({ tone = "gray" }: { tone?: ProjectTone }) {
  if (tone === "green")
    return (
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="currentColor" />
        <path d="m3.8 6.1 1.5 1.5 2.9-3.1" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  if (tone === "red")
    return (
      <svg viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="currentColor" />
        <path d="M6 3.4v3M6 8.2v.1" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  const fill = tone === "amber" ? "M6 2.5a3.5 3.5 0 0 1 0 7Z" : tone === "violet" || tone === "blue" ? "M6 2.5a3.5 3.5 0 1 1-3.5 3.5H6Z" : "";
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray={tone === "gray" ? "2 1.6" : undefined} />
      {fill && <path d={fill} fill="currentColor" />}
    </svg>
  );
}

function Ring({ tasks, hot, dim }: { tasks: ProjectTask[]; hot: string | null; dim: (t: ProjectTask) => boolean }) {
  const n = Math.max(1, tasks.length);
  const r = 13;
  const c = 2 * Math.PI * r;
  const gap = n > 1 ? 3 : 0;
  const seg = c / n - gap;
  const done = tasks.filter((t) => t.done).length;
  return (
    <span className="pc-ring">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        {tasks.map((t, i) => (
          <circle
            key={t.id}
            cx="16"
            cy="16"
            r={r}
            className={`${t.done ? "done" : ""} ${hot === t.id ? "hot" : ""} ${dim(t) ? "dim" : ""}`}
            strokeDasharray={`${seg} ${c - seg}`}
            strokeDashoffset={-(i * (c / n)) - gap / 2}
            transform="rotate(-90 16 16)"
          />
        ))}
      </svg>
      <b key={done}>{done}</b>
    </span>
  );
}

export function ProjectCard({
  title = "Танилцуулах урсгал",
  tasks: tasksProp,
  onTasksChange,
  status: statusProp,
  statuses = defaultStatuses,
  onStatusChange,
  due,
  members = defaultMembers,
  action,
  hint,
  trigger = "hover",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className = "",
}: ProjectCardProps) {
  const [innerTasks, setInnerTasks] = React.useState<ProjectTask[]>(tasksProp ?? defaultTasks);
  const tasks = onTasksChange && tasksProp ? tasksProp : innerTasks;
  React.useEffect(() => {
    if (tasksProp && !onTasksChange) setInnerTasks(tasksProp);
  }, [tasksProp, onTasksChange]);

  const [innerStatus, setInnerStatus] = React.useState(statusProp ?? statuses[0]?.id);
  const status = statusProp ?? innerStatus;
  const current = statuses.find((s) => s.id === status) ?? statuses[0];

  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const open = openProp ?? innerOpen;
  const setOpen = (v: boolean) => {
    if (openProp === undefined) setInnerOpen(v);
    onOpenChange?.(v);
  };

  const [statusOpen, setStatusOpen] = React.useState(false);
  const [hotTask, setHotTask] = React.useState<string | null>(null);
  const [hoverPerson, setHoverPerson] = React.useState<string | null>(null);
  const [pinPerson, setPinPerson] = React.useState<string | null>(null);
  const person = hoverPerson ?? pinPerson;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const headRef = React.useRef<HTMLButtonElement>(null);
  const bodyId = React.useId();

  const done = tasks.filter((t) => t.done).length;
  const left = tasks.length - done;
  const memberIndex = (name?: string) => Math.max(0, members.findIndex((m) => m.name === name));
  const dim = (t: ProjectTask) => !!person && t.assignee !== person;

  const toggleTask = (id: string) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    if (onTasksChange) onTasksChange(next);
    else setInnerTasks(next);
  };

  const hotT = tasks.find((t) => t.id === hotTask);
  const line: React.ReactNode = hotT
    ? hotT.assignee
      ? `${hotT.assignee} · ${hotT.done ? "дууссан" : "нээлттэй"}`
      : hotT.done
        ? "Дууссан"
        : "Нээлттэй"
    : person
      ? `${person} · ${tasks.filter((t) => t.assignee === person && !t.done).length} үлдсэн`
      : hint ?? (left ? `${left} үлдсэн` : "Бүгд дууссан");

  const toneOf = (o?: ProjectOption) => o?.tone ?? "gray";

  const avatar = (m: ProjectMember, small = false) => {
    const i = memberIndex(m.name) % softColors.length;
    return m.avatar ? (
      <img className={`pc-av ${small ? "sm" : ""}`} src={m.avatar} alt="" />
    ) : (
      <span className={`pc-av ${small ? "sm" : ""}`} style={{ background: softColors[i], color: inkColors[i] }}>
        {m.name[0]}
      </span>
    );
  };

  return (
    <div
      ref={rootRef}
      className={`pc ${open ? "open" : ""} ${className}`}
      onMouseEnter={() => trigger === "hover" && window.matchMedia?.("(hover: hover)").matches && setOpen(true)}
      onMouseLeave={() => {
        if (trigger === "hover" && window.matchMedia?.("(hover: hover)").matches) {
          setOpen(false);
          setStatusOpen(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          if (statusOpen) setStatusOpen(false);
          else {
            setOpen(false);
            headRef.current?.focus();
          }
        }
      }}
    >
      <style>{css}</style>
      <div className="pc-head">
        <button
          ref={headRef}
          type="button"
          className="pc-headbtn"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={`${title}, ${done}/${tasks.length} дууссан, ${current?.label ?? ""}${due ? `, хугацаа ${due}` : ""}`}
          onClick={() => setOpen(!open)}
        />
        <Ring tasks={tasks} hot={hotTask} dim={dim} />
        <div className="pc-titles">
          <div className="pc-title">{title}</div>
          <div className="pc-meta">
            <span className="pc-status-wrap">
              <button
                type="button"
                className={`pc-status ${toneOf(current)}`}
                aria-expanded={statusOpen}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  if (!open) setOpen(true);
                  setStatusOpen((s) => !s);
                }}
              >
                {current?.icon ?? <StatusIcon tone={toneOf(current)} />}
                {current?.label}
              </button>
            </span>
            {due && (
              <span className="pc-due">
                <span className="pc-due-w">Хугацаа </span>
                {due}
              </span>
            )}
          </div>
        </div>
        <div className="pc-people">
          {members.map((m) => (
            <button
              key={m.name}
              type="button"
              className={`pc-person ${person === m.name ? "on" : ""} ${person && person !== m.name ? "dim" : ""}`}
              aria-pressed={pinPerson === m.name}
              aria-label={`Зөвхөн ${m.name}: дэд даалгаврууд`}
              tabIndex={open ? 0 : -1}
              onMouseEnter={() => setHoverPerson(m.name)}
              onMouseLeave={() => setHoverPerson(null)}
              onFocus={() => setHoverPerson(m.name)}
              onBlur={() => setHoverPerson(null)}
              onClick={() => setPinPerson((p) => (p === m.name ? null : m.name))}
            >
              {avatar(m)}
            </button>
          ))}
        </div>
      </div>

      <div className="pc-fold" id={bodyId} inert={!open || undefined} aria-hidden={!open}>
        <div className="pc-fold-in">
          {statusOpen ? (
            <div className="pc-options" role="radiogroup" aria-label="Төлөв">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={s.id === status}
                  className={`pc-opt ${toneOf(s)}`}
                  onClick={() => {
                    if (statusProp === undefined) setInnerStatus(s.id);
                    onStatusChange?.(s.id);
                    setStatusOpen(false);
                  }}
                >
                  <span className={`pc-opt-ico ${toneOf(s)}`}>{s.icon ?? <StatusIcon tone={toneOf(s)} />}</span>
                  {s.label}
                  {s.id === status && (
                    <svg className="pc-tick" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <ul className="pc-tasks">
              {tasks.map((t) => {
                const m = members.find((x) => x.name === t.assignee);
                return (
                  <li key={t.id} className={`${t.done ? "done" : ""} ${dim(t) ? "dim" : ""}`}>
                    <label
                      onMouseEnter={() => setHotTask(t.id)}
                      onMouseLeave={() => setHotTask(null)}
                    >
                      <input
                        type="checkbox"
                        value={t.id}
                        checked={!!t.done}
                        onChange={() => toggleTask(t.id)}
                        onFocus={() => setHotTask(t.id)}
                        onBlur={() => setHotTask(null)}
                      />
                      <span className="pc-check" aria-hidden="true">
                        <svg viewBox="0 0 12 12"><path d="m3.2 6.2 1.9 1.9 3.7-4" /></svg>
                      </span>
                      <span className="pc-label">{t.label}</span>
                      {m && <span className="pc-assignee">{avatar(m, true)}</span>}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="pc-foot">
            <span className="pc-hint" key={String(hotTask) + String(person)} aria-live="polite">{line}</span>
            {action && (
              <button type="button" className="pc-action" onClick={action.onClick}>
                {action.label}
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9m-3.5-3.5L12.5 8 9 11.5" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
.pc{--pc-bg:#fff;--pc-fg:#18181b;--pc-muted:#65656d;--pc-faint:#65656d;--pc-line:#ececef;--pc-soft:#f4f4f5;--pc-blue:#3b82f6;--pc-seg:#e4e4e7;--pc-amber:#b45309;--pc-amber-bg:#fdf3d7;--pc-green:#15803d;--pc-green-bg:#e3f6e8;--pc-red:#dc2626;--pc-red-bg:#fde8e8;--pc-violet:#7c3aed;--pc-violet-bg:#efe9fd;--pc-blue-bg:#e3edfd;--pc-gray-bg:#f1f1f3;position:relative;width:100%;max-width:320px;background:var(--pc-bg);color:var(--pc-fg);border:1px solid var(--pc-line);border-radius:12px;box-shadow:0 1px 3px #0000000a;font:400 14px/1.4 Inter,system-ui,sans-serif;container:pc/inline-size;transition:box-shadow .2s}
.pc.open{box-shadow:0 6px 22px #0000000f,0 1px 3px #0000000a}
:where(.dark,[data-theme=dark]) .pc{--pc-bg:#1b1b1e;--pc-fg:#ececef;--pc-muted:#a1a1aa;--pc-faint:#9a9aa2;--pc-line:#2e2e33;--pc-soft:#26262a;--pc-seg:#3a3a40;--pc-amber:#fbbf24;--pc-amber-bg:#3a2f12;--pc-green:#4ade80;--pc-green-bg:#173323;--pc-red:#f87171;--pc-red-bg:#3a1c1c;--pc-violet:#a78bfa;--pc-violet-bg:#2a2140;--pc-blue-bg:#1c2a40;--pc-gray-bg:#2a2a2f;color-scheme:dark}
.pc *{box-sizing:border-box}.pc button{font:inherit;color:inherit;cursor:pointer}
.pc-head{position:relative;display:flex;align-items:center;gap:10px;padding:12px 12px 12px 12px}
.pc-headbtn{position:absolute;inset:0;width:100%;border:0;background:none;border-radius:12px;padding:0}
.pc-ring,.pc-titles,.pc-people{position:relative;pointer-events:none}
.pc-status,.pc-person{pointer-events:auto}
.pc-ring{display:grid;place-items:center;width:30px;height:30px;flex:none}
.pc-ring svg{position:absolute;inset:0;width:30px;height:30px}
.pc-ring circle{fill:none;stroke:var(--pc-seg);stroke-width:2.2;transition:stroke .2s,stroke-width .15s,opacity .2s}
.pc-ring circle.done{stroke:var(--pc-blue)}
.pc-ring circle.hot{stroke-width:3.6}
.pc-ring circle.dim{opacity:.25}
.pc-ring b{font-size:12px;font-weight:500;animation:pc-pop .25s ease-out}
.pc-titles{flex:1;min-width:0}
.pc-title{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-meta{display:flex;align-items:center;gap:6px;margin-top:2px;font-size:12.5px;color:var(--pc-muted);white-space:nowrap}
.pc-status{display:inline-flex;align-items:center;gap:5px;height:19px;padding:0 6px;border:0;border-radius:4px;font-size:12.5px!important}
.pc-status svg,.pc-opt-ico svg{width:11px;height:11px}
.pc-status.amber{background:var(--pc-amber-bg);color:var(--pc-amber)!important}
.pc-status.green{background:var(--pc-green-bg);color:var(--pc-green)!important}
.pc-status.red{background:var(--pc-red-bg);color:var(--pc-red)!important}
.pc-status.violet{background:var(--pc-violet-bg);color:var(--pc-violet)!important}
.pc-status.blue{background:var(--pc-blue-bg);color:var(--pc-blue)!important}
.pc-status.gray{background:var(--pc-gray-bg);color:var(--pc-muted)!important}
.pc:not(.open) .pc-status{pointer-events:none}
.pc-people{display:flex;flex:none;padding-left:4px}
.pc-person{display:grid;place-items:center;padding:0;margin-left:-5px;border:0;border-radius:50%;background:none;transition:opacity .2s,transform .15s}
.pc:not(.open) .pc-person{pointer-events:none}
.pc-person.dim{opacity:.35}.pc-person.on .pc-av{box-shadow:0 0 0 2px var(--pc-bg),0 0 0 3px var(--pc-fg)}
.pc-av{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;border:2px solid var(--pc-bg);font-size:9px;font-weight:600;object-fit:cover;box-sizing:content-box}
.pc-av.sm{width:16px;height:16px;border-width:0;font-size:8px}
.pc-fold{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s cubic-bezier(.2,.8,.2,1)}
.pc.open .pc-fold{grid-template-rows:1fr}
.pc-fold-in{overflow:hidden;opacity:0;transition:opacity .2s}
.pc.open .pc-fold-in{opacity:1}
.pc-tasks{list-style:none;margin:0;padding:8px 6px;border-top:1px solid var(--pc-line)}
.pc-tasks li{transition:opacity .2s}.pc-tasks li.dim{opacity:.3}
.pc-tasks label{position:relative;display:flex;align-items:center;gap:10px;height:32px;padding:0 8px;border-radius:7px;cursor:pointer}
.pc-tasks label:hover{background:var(--pc-soft)}
.pc-tasks input{position:absolute;opacity:0;width:14px;height:14px;margin:0;left:8px;cursor:pointer}
.pc-check{display:grid;place-items:center;width:14px;height:14px;flex:none;border:1px solid color-mix(in srgb,var(--pc-fg) 25%,transparent);border-radius:50%;transition:background .15s,border-color .15s}
.pc-check svg{width:10px;height:10px;fill:none;stroke:#fff;stroke-width:1.6;stroke-linecap:round;stroke-dasharray:10;stroke-dashoffset:10;transition:stroke-dashoffset .25s}
.pc-tasks li.done .pc-check{background:var(--pc-blue);border-color:var(--pc-blue)}
.pc-tasks li.done .pc-check svg{stroke-dashoffset:0}
.pc-tasks input:focus-visible+.pc-check{outline:2px solid var(--pc-blue);outline-offset:2px}
.pc-label{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-tasks li.done .pc-label{color:var(--pc-muted)}
.pc-assignee{opacity:0;transition:opacity .15s}
.pc-tasks label:hover .pc-assignee,.pc-tasks label:focus-within .pc-assignee{opacity:1}
.pc-options{padding:6px;border-top:1px solid var(--pc-line);display:grid}
.pc-opt{display:flex;align-items:center;gap:10px;height:32px;padding:0 8px;border:0;border-radius:7px;background:none;text-align:left}
.pc-opt:hover{background:var(--pc-soft)}
.pc-opt-ico{display:grid;place-items:center}
.pc-opt-ico.amber{color:var(--pc-amber)}.pc-opt-ico.green{color:var(--pc-green)}.pc-opt-ico.red{color:var(--pc-red)}.pc-opt-ico.violet{color:var(--pc-violet)}.pc-opt-ico.blue{color:var(--pc-blue)}.pc-opt-ico.gray{color:var(--pc-muted)}
.pc-tick{width:14px;height:14px;margin-left:auto;fill:none;stroke:var(--pc-blue);stroke-width:1.7;stroke-linecap:round}
.pc-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:44px;padding:6px 8px 6px 12px;border-top:1px solid var(--pc-line)}
.pc-hint{font-size:12.5px;color:var(--pc-muted);animation:pc-rise .2s ease-out;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pc-action{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 10px;border:0;border-radius:7px;background:var(--pc-fg);color:var(--pc-bg)!important;font-weight:500}
.pc-action svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.pc :focus-visible{outline:2px solid var(--pc-blue);outline-offset:2px}
@keyframes pc-pop{from{transform:scale(.6);opacity:0}}
@keyframes pc-rise{from{transform:translateY(4px);opacity:0}}
@container pc (max-width:290px){.pc-due-w{display:none}.pc-person{margin-left:-7px}}
@media(pointer:coarse){.pc-tasks label,.pc-opt{height:44px}.pc-assignee{opacity:1}}
@media(prefers-reduced-motion:reduce){.pc *{animation:none!important;transition:none!important}}
`;

export function Demo() {
  const [status, setStatus] = React.useState("progress");
  return (
    <div style={{ width: "100%", maxWidth: 320, minHeight: 290 }}>
      <ProjectCard
        due="10-р сарын 24"
        status={status}
        onStatusChange={setStatus}
        defaultOpen
        action={{ label: "Нээх", onClick: () => {} }}
      />
    </div>
  );
}

export default Demo;
