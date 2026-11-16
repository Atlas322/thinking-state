/**
 * Second Brain app screens — one screen library for inai.sh, social and Journal.
 * A glass window (CSS backdrop-filter) holding six screens built from Thinking State
 * components. Data comes in as props (ScreenData); `acmeDemo` is the made-up ACME case.
 *
 *   <AppScreen screen="chat" theme="day" variant="tabs" data={acmeDemo} />
 *
 * `still` freezes motion (MotionProvider paused + no CSS animation) for screenshots.
 */
import * as React from "react";
import { AgentPlan } from "../library/agent-plan";
import { CitedAnswer } from "../library/cited-answer";
import { DecisionCard } from "../library/decision-card";
import { RunningNow } from "../library/running-now";
import { MemoryPanel } from "../library/memory-panel";
import { SessionBoard } from "../library/session-board";
import { MotionProvider } from "../motion";
import type { CaptureKind, ScreenData } from "./acme";

export type ScreenKey = "inbox" | "note" | "project" | "chat" | "memory" | "team";
export type ScreenTheme = "day" | "night";
export type WindowVariant = "tabs" | "sidebar";

export type AppScreenLabels = Record<ScreenKey, string> & { brand: string; search: string; next: string };
export const appScreenLabelsMn: AppScreenLabels = {
  inbox: "Inbox",
  note: "Тэмдэглэл",
  project: "Төсөл",
  chat: "Чат",
  memory: "Санах ой",
  team: "Баг",
  brand: "Second Brain",
  search: "Хайх эсвэл асуух…",
  next: "NEXT ACTION",
};
export const SCREENS: ScreenKey[] = ["inbox", "note", "project", "chat", "memory", "team"];

const I = (d: React.ReactNode, size = 16) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const icons: Record<ScreenKey | CaptureKind | "search" | "arrow" | "check" | "spark", React.ReactNode> = {
  inbox: I(<><path d="M2 9h3.5l1 2h3l1-2H14" /><path d="M3.5 3h9L14 9v4H2V9Z" /></>),
  note: I(<><path d="M4 2h6l3 3v9H4Z" /><path d="M10 2v3h3M6 8h5M6 11h4" /></>),
  project: I(<><rect x="2" y="3" width="12" height="10" rx="2" /><path d="M2 6.5h12M6 3v3.5" /></>),
  chat: I(<><path d="M3 3h10v7H8l-3 3v-3H3Z" /></>),
  memory: I(<><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" /></>),
  team: I(<><circle cx="5.5" cy="6" r="2" /><circle cx="11" cy="6.5" r="1.6" /><path d="M2 13c.5-2 2-3 3.5-3S8.5 11 9 13M9.5 13c.3-1.4 1.2-2.2 2.3-2.2 1 0 1.8.8 2.2 2.2" /></>),
  link: I(<><path d="M7 9a2.5 2.5 0 0 0 3.5 0l2-2A2.5 2.5 0 0 0 9 3.5L8.4 4" /><path d="M9 7a2.5 2.5 0 0 0-3.5 0l-2 2A2.5 2.5 0 0 0 7 12.5l.6-.5" /></>),
  voice: I(<><rect x="6" y="2" width="4" height="7.5" rx="2" /><path d="M3.5 8a4.5 4.5 0 0 0 9 0M8 12.5V14" /></>),
  idea: I(<><path d="M5.5 10.5a4 4 0 1 1 5 0V12h-5Z" /><path d="M6.5 14h3" /></>),
  file: I(<><path d="M4 2h5.5L12 4.5V14H4Z" /><path d="M6 9h4M6 11.5h3" /></>),
  mail: I(<><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="m2.5 4.5 5.5 4 5.5-4" /></>),
  search: I(<><circle cx="7" cy="7" r="4" /><path d="m10 10 3 3" /></>),
  arrow: I(<path d="M3 8h10M9 4l4 4-4 4" />),
  check: I(<path d="m3.5 8.5 3 3 6-7" />),
  spark: I(<path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2" />),
};

const CSS = `
.aps-stage{position:relative;overflow:hidden;padding:56px;min-height:100%;box-sizing:border-box;background:var(--ts-page,#f0ede4);font-family:Inter,system-ui,sans-serif;color:var(--ts-fg,#080808)}
.aps-stage::before,.aps-stage::after{content:"";position:absolute;border-radius:50%;filter:blur(40px);pointer-events:none}
.aps-stage::before{width:520px;height:520px;left:-120px;top:-140px;background:radial-gradient(circle,#1b5cff 0%,transparent 68%);opacity:.32}
.aps-stage::after{width:460px;height:460px;right:-80px;bottom:-160px;background:radial-gradient(circle,#ff7a1a 0%,transparent 68%);opacity:.30}
[data-ts-theme="dark"] .aps-stage::before{opacity:.42}[data-ts-theme="dark"] .aps-stage::after{opacity:.26}
.aps-win{position:relative;z-index:1;display:flex;flex-direction:column;height:760px;max-width:1240px;margin:0 auto;border-radius:22px;overflow:hidden;
 background:color-mix(in srgb,var(--ts-surface,#f7f5ee) 62%,transparent);backdrop-filter:blur(28px) saturate(1.4);-webkit-backdrop-filter:blur(28px) saturate(1.4);
 border:1px solid color-mix(in srgb,#fff 55%,transparent);box-shadow:0 1px 0 rgb(255 255 255/.5) inset,0 30px 80px -20px rgb(8 8 8/.28)}
[data-ts-theme="dark"] .aps-win{border-color:rgb(255 255 255/.10);box-shadow:0 1px 0 rgb(255 255 255/.06) inset,0 30px 80px -20px rgb(0 0 0/.6)}
.aps-bar{display:flex;align-items:center;gap:14px;height:52px;padding:0 16px;border-bottom:1px solid color-mix(in srgb,var(--ts-line,#d8d3c6) 70%,transparent);flex:none}
.aps-dots{display:flex;gap:7px}.aps-dots i{width:11px;height:11px;border-radius:50%;background:var(--ts-line,#d8d3c6)}
.aps-brand{font-weight:600;letter-spacing:-.02em;font-size:14px;display:flex;align-items:center;gap:8px}
.aps-logo{width:22px;height:22px;border-radius:7px;background:#1b5cff;color:#fff;display:grid;place-items:center;font-size:12px;font-weight:700}
.aps-tabs{display:flex;gap:2px;padding:3px;border-radius:12px;background:color-mix(in srgb,var(--ts-soft,#efebe1) 80%,transparent);margin:0 auto}
.aps-tab{display:flex;align-items:center;gap:6px;border:0;background:none;color:var(--ts-muted,#45433f);font:500 13px Inter,sans-serif;padding:6px 12px;border-radius:9px;cursor:pointer}
.aps-tab[aria-current="page"]{background:var(--ts-surface,#f7f5ee);color:var(--ts-fg,#080808);box-shadow:var(--ts-elevation)}
.aps-search{display:flex;align-items:center;gap:8px;width:220px;height:32px;padding:0 10px;border-radius:10px;font-size:13px;color:var(--ts-faint,#5c5a55);background:color-mix(in srgb,var(--ts-soft,#efebe1) 80%,transparent)}
.aps-body{display:flex;flex:1;min-height:0}
.aps-side{width:208px;flex:none;padding:14px 10px;display:flex;flex-direction:column;gap:2px;border-right:1px solid color-mix(in srgb,var(--ts-line,#d8d3c6) 70%,transparent)}
.aps-side .aps-tab{justify-content:flex-start;padding:8px 10px;font-size:13.5px}
.aps-side h6{font:500 11px "IBM Plex Mono",monospace;letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint);margin:14px 10px 6px}
.aps-count{margin-left:auto;font:500 11px "IBM Plex Mono",monospace;color:var(--ts-faint)}
.aps-main{flex:1;min-width:0;overflow:auto;padding:26px 30px}
.aps-h1{font-weight:600;letter-spacing:-.02em;font-size:24px;margin:0 0 4px}
.aps-sub{color:var(--ts-muted);font-size:14px;margin:0 0 20px}
.aps-label{font:500 11px "IBM Plex Mono",monospace;letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint)}
.aps-card{background:color-mix(in srgb,var(--ts-surface,#f7f5ee) 82%,transparent);border:1px solid color-mix(in srgb,var(--ts-line,#d8d3c6) 80%,transparent);border-radius:14px}
.aps-next{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:999px;background:#ff7a1a;color:#1a0d00;font:600 10.5px "IBM Plex Mono",monospace;letter-spacing:.04em}
.aps-next span{font:500 12px Inter,sans-serif;letter-spacing:0}
.aps-chip{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;border-radius:999px;font-size:12px;color:var(--ts-muted);background:var(--ts-soft,#efebe1)}
.aps-chip.e{color:var(--ts-electric-fg,#1b5cff);background:var(--ts-electric-soft,#dce5ff)}
.aps-capture{display:flex;align-items:center;gap:10px;padding:14px 16px;margin-bottom:18px}
.aps-capture input{flex:1;border:0;background:none;font:15px Inter,sans-serif;color:var(--ts-fg);outline:0}
.aps-key{font:500 11px "IBM Plex Mono",monospace;color:var(--ts-faint);border:1px solid var(--ts-line);border-radius:6px;padding:2px 6px}
.aps-list{display:flex;flex-direction:column}
.aps-row{display:grid;grid-template-columns:34px 1fr auto;gap:12px;align-items:start;padding:14px 16px;border-top:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent)}
.aps-row:first-child{border-top:0}
.aps-row.done{opacity:.55}
.aps-ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:var(--ts-soft);color:var(--ts-muted)}
.aps-row b{font-weight:500;font-size:14.5px;display:block;margin-bottom:3px}
.aps-meta{font-size:12.5px;color:var(--ts-faint);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.aps-row .aps-next{margin-top:8px}
.aps-grid{display:grid;grid-template-columns:1fr 300px;gap:22px;align-items:start}
.aps-note{padding:26px 28px}
.aps-note p{font-size:16px;line-height:1.6;margin:0 0 12px}
.aps-note h2{font-size:28px;font-weight:600;letter-spacing:-.02em;line-height:1.2;margin:10px 0 16px}
.aps-src{margin-top:18px;padding-top:14px;border-top:1px dashed var(--ts-line);font-size:13px;color:var(--ts-muted)}
.aps-link{display:flex;gap:10px;padding:12px 14px;border-top:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent)}
.aps-link:first-of-type{border-top:0}
.aps-dot{width:8px;height:8px;border-radius:50%;margin-top:6px;flex:none}
.aps-link b{font-weight:500;font-size:13.5px;display:block}
.aps-link small{font-size:12px;color:var(--ts-faint)}
.aps-progress{height:6px;border-radius:9px;background:var(--ts-soft-2,#e8e3d6);overflow:hidden;margin:10px 0 4px}
.aps-progress i{display:block;height:100%;background:#1b5cff;border-radius:9px}
.aps-nextcard{padding:18px 20px;margin:18px 0;border-color:#ff7a1a;background:color-mix(in srgb,#ff7a1a 9%,var(--ts-surface))}
.aps-nextcard h3{font-size:19px;font-weight:600;letter-spacing:-.02em;margin:10px 0 6px}
.aps-task{display:grid;grid-template-columns:18px 1fr auto auto;gap:12px;align-items:center;padding:11px 16px;border-top:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);font-size:14px}
.aps-task:first-child{border-top:0}
.aps-st{width:14px;height:14px;border-radius:50%;border:1.5px solid var(--ts-faint)}
.aps-st.done{background:var(--ts-green,#5e7a5f);border-color:var(--ts-green)}
.aps-st.doing{border-color:#1b5cff;border-right-color:transparent}
.aps-st.waiting{border-color:#ff7a1a;border-style:dashed}
.aps-task.done span:nth-child(2){text-decoration:line-through;color:var(--ts-faint)}
.aps-truth{padding:16px 18px}.aps-truth li{font-size:13.5px;margin:8px 0;color:var(--ts-muted)}.aps-truth ul{padding-left:18px;margin:8px 0 0}
.aps-chatgrid{display:grid;grid-template-columns:1fr 400px;gap:24px;align-items:start}
.aps-chat{min-width:0;display:flex;flex-direction:column;gap:16px}
.aps-q{align-self:flex-end;max-width:70%;padding:12px 16px;border-radius:16px 16px 4px 16px;background:#1b5cff;color:#fff;font-size:15px;line-height:1.45}
.aps-composer{display:flex;align-items:center;gap:10px;padding:12px 14px;margin-top:4px}
.aps-composer>span:not(.aps-send){flex:1;color:var(--ts-faint);font-size:14.5px}
.aps-send{width:32px;height:32px;border-radius:10px;background:#1b5cff;color:#fff;display:grid;place-items:center}
.aps-head{display:flex;align-items:center;justify-content:space-between;gap:16px}
.aps-still *,.aps-still *::before,.aps-still *::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}
`;

function Tab({ k, on, labels, onSelect, count }: { k: ScreenKey; on: boolean; labels: AppScreenLabels; onSelect?: (k: ScreenKey) => void; count?: number }) {
  return (
    <button type="button" className="aps-tab" aria-current={on ? "page" : undefined} onClick={() => onSelect?.(k)}>
      {icons[k]}{labels[k]}{count != null && <span className="aps-count">{count}</span>}
    </button>
  );
}

export type AppWindowProps = {
  screen: ScreenKey;
  variant?: WindowVariant;
  labels?: AppScreenLabels;
  counts?: Partial<Record<ScreenKey, number>>;
  onSelect?: (k: ScreenKey) => void;
  children: React.ReactNode;
};

/** The glass window: traffic dots, brand, tabs (variant A) or a side menu (variant B). */
export function AppWindow({ screen, variant = "tabs", labels = appScreenLabelsMn, counts = {}, onSelect, children }: AppWindowProps) {
  return (
    <div className="aps-win" data-variant={variant}>
      <div className="aps-bar">
        <div className="aps-dots"><i /><i /><i /></div>
        <div className="aps-brand"><span className="aps-logo">S</span>{labels.brand}</div>
        {variant === "tabs" ? (
          <nav className="aps-tabs" aria-label={labels.brand}>
            {SCREENS.map((k) => <Tab key={k} k={k} on={k === screen} labels={labels} onSelect={onSelect} />)}
          </nav>
        ) : <div style={{ flex: 1 }} />}
        <div className="aps-search">{icons.search}{labels.search}<span className="aps-key" style={{ marginLeft: "auto" }}>⌘K</span></div>
      </div>
      <div className="aps-body">
        {variant === "sidebar" && (
          <nav className="aps-side" aria-label={labels.brand}>
            {SCREENS.slice(0, 3).map((k) => <Tab key={k} k={k} on={k === screen} labels={labels} onSelect={onSelect} count={counts[k]} />)}
            <h6>Thinking State</h6>
            {SCREENS.slice(3).map((k) => <Tab key={k} k={k} on={k === screen} labels={labels} onSelect={onSelect} count={counts[k]} />)}
          </nav>
        )}
        <main className="aps-main">{children}</main>
      </div>
    </div>
  );
}

const linkColor = { decision: "#1b5cff", knowledge: "#5e7a5f", project: "#ff7a1a", source: "#6b47c9" } as const;
const linkKind = { decision: "Шийдвэр", knowledge: "Мэдлэг", project: "Төсөл", source: "Эх сурвалж" } as const;
const statusLabel = { todo: "Хийх", doing: "Хийж байна", waiting: "Хүлээгдэж", done: "Дууссан" } as const;

export function InboxScreen({ data, labels = appScreenLabelsMn }: { data: ScreenData; labels?: AppScreenLabels }) {
  const open = data.inbox.filter((i) => !i.processed).length;
  return (
    <>
      <h1 className="aps-h1">{labels.inbox}</h1>
      <p className="aps-sub">{open} шинэ зүйл. Агент газрыг нь санал болгосон — та батална.</p>
      <div className="aps-card aps-capture">{icons.spark}<input readOnly value="" placeholder="Санаа, холбоос, файл… бүгдийг энд хая" aria-label="Цуглуулах" /><span className="aps-key">⌘⇧Space</span></div>
      <div className="aps-card aps-list">
        {data.inbox.map((i) => (
          <div key={i.id} className={"aps-row" + (i.processed ? " done" : "")}>
            <span className="aps-ico">{icons[i.kind]}</span>
            <div>
              <b>{i.title}</b>
              <div className="aps-meta">{i.meta}<span className="aps-chip e">→ {i.suggest}</span></div>
              {i.next && <div className="aps-next">{labels.next} <span>{i.next}</span></div>}
            </div>
            {i.processed ? <span className="aps-chip">{icons.check}Ангилсан</span> : <span className="aps-chip">Батлах</span>}
          </div>
        ))}
      </div>
    </>
  );
}

export function NoteScreen({ data }: { data: ScreenData }) {
  const n = data.note;
  return (
    <div className="aps-grid">
      <article className="aps-card aps-note">
        <div className="aps-meta"><span className="aps-chip e">{n.kind}</span>{n.date}{n.tags.map((t) => <span key={t}>#{t}</span>)}</div>
        <h2>{n.title}</h2>
        {n.body.map((p, i) => <p key={i}>{p}</p>)}
        <div className="aps-src"><span className="aps-label">Эх сурвалж</span><br />{n.source}</div>
      </article>
      <aside>
        <div className="aps-label" style={{ margin: "4px 2px 8px" }}>Холбоос · яагаад</div>
        <div className="aps-card">
          {n.links.map((l) => (
            <div key={l.id} className="aps-link">
              <span className="aps-dot" style={{ background: linkColor[l.kind] }} />
              <div><b>{l.title}</b><small>{linkKind[l.kind]} · {l.why}</small></div>
            </div>
          ))}
        </div>
        <p className="aps-meta" style={{ margin: "12px 2px" }}>← {n.backlinks} тэмдэглэл энд холбогдсон</p>
      </aside>
    </div>
  );
}

export function ProjectScreen({ data, labels = appScreenLabelsMn }: { data: ScreenData; labels?: AppScreenLabels }) {
  const p = data.project;
  return (
    <div className="aps-grid">
      <div>
        <div className="aps-meta"><span className="aps-chip">{p.area}</span>{p.done}/{p.total} алхам</div>
        <h1 className="aps-h1" style={{ marginTop: 8 }}>{p.name}</h1>
        <p className="aps-sub" style={{ marginBottom: 0 }}>{p.why}</p>
        <div className="aps-progress"><i style={{ width: `${(p.done / p.total) * 100}%` }} /></div>
        <div className="aps-card aps-nextcard">
          <span className="aps-next">{labels.next}</span>
          <h3>{p.next.title}</h3>
          <div className="aps-meta">{p.next.context}<span>·</span>{p.next.owner}</div>
        </div>
        <div className="aps-card">
          {p.tasks.map((t) => (
            <div key={t.id} className={"aps-task " + t.status}>
              <span className={"aps-st " + t.status} />
              <span>{t.title}</span>
              <span className="aps-meta">{t.owner}</span>
              <span className="aps-chip">{t.due ?? statusLabel[t.status]}</span>
            </div>
          ))}
        </div>
      </div>
      <aside className="aps-card aps-truth">
        <span className="aps-label">Одоогийн үнэн</span>
        <ul>{p.truth.map((t) => <li key={t}>{t}</li>)}</ul>
      </aside>
    </div>
  );
}

export function ChatScreen({ data }: { data: ScreenData }) {
  const c = data.chat;
  return (
    <div className="aps-chatgrid">
      <div className="aps-chat">
        <div className="aps-q">{c.question}</div>
        <CitedAnswer segments={c.segments} sources={c.sources} pagesRead={3} />
        <div className="aps-card aps-composer">{icons.spark}<span>Дараагийн асуултаа бич…</span><span className="aps-send">{icons.arrow}</span></div>
      </div>
      <aside className="aps-chat">
        <div className="aps-head"><span className="aps-label">Thinking State</span><RunningNow tasks={c.running} brand={null} align="end" /></div>
        <AgentPlan title="Хариулахаас өмнөх төлөвлөгөө" defaultSteps={c.plan} status="done" estimate="~5 с" />
        <DecisionCard decisions={c.decisions} host />
      </aside>
    </div>
  );
}

export function MemoryScreen({ data }: { data: ScreenData }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <h1 className="aps-h1">Санах ой</h1>
      <p className="aps-sub">Агент юуг санаж байгааг та харж, засаж, мартуулна. Бүгд эх сурвалжтай.</p>
      <MemoryPanel memories={data.memories} categories={data.memoryCategories} title={`${data.company}-ийн санах ой`} maxHeight={520} />
    </div>
  );
}

export function TeamScreen({ data }: { data: ScreenData }) {
  const t = data.team;
  return (
    <>
      <h1 className="aps-h1">Нэг тархитай баг</h1>
      <p className="aps-sub">Хүн бүр, агент бүр нэг санах ойгоос уншиж, нэг самбар дээр ажиллана.</p>
      <SessionBoard project={t.project} groups={t.groups} sessions={t.sessions} me={t.me} />
    </>
  );
}

export type AppScreenProps = {
  screen: ScreenKey;
  data: ScreenData;
  theme?: ScreenTheme;
  variant?: WindowVariant;
  /** Freeze motion for screenshots. */
  still?: boolean;
  labels?: AppScreenLabels;
  onSelect?: (k: ScreenKey) => void;
  className?: string;
};

/** One screen in its glass window on a themed stage. */
export function AppScreen({ screen, data, theme = "day", variant = "tabs", still = false, labels = appScreenLabelsMn, onSelect, className = "" }: AppScreenProps) {
  const dark = theme === "night";
  const body = {
    inbox: <InboxScreen data={data} labels={labels} />,
    note: <NoteScreen data={data} />,
    project: <ProjectScreen data={data} labels={labels} />,
    chat: <ChatScreen data={data} />,
    memory: <MemoryScreen data={data} />,
    team: <TeamScreen data={data} />,
  }[screen];
  const counts = { inbox: data.inbox.filter((i) => !i.processed).length, project: data.project.total - data.project.done, memory: data.memories.length };
  return (
    <MotionProvider paused={still}>
      <div
        className={`${dark ? "dark " : ""}${still ? "aps-still " : ""}${className}`}
        data-ts-theme={dark ? "dark" : "cream"}
        data-theme={dark ? "dark" : "light"}
        style={{ height: "100%" }}
      >
        <style>{CSS}</style>
        <div className="aps-stage">
          <AppWindow screen={screen} variant={variant} labels={labels} counts={counts} onSelect={onSelect}>{body}</AppWindow>
        </div>
      </div>
    </MotionProvider>
  );
}
