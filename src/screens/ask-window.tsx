/**
 * Ask Window (2026-11-17, v3 «lightweight») — the site hero's Ask block as one Second Brain app window,
 * with the proportions of a calm chat app: thin lines, a quiet grey side, generous white space, small
 * icons, one accent.
 * - Side: the brain's own menu (PARA: Inbox · Өнөөдөр · Төслүүд · Хүрээ · Нөөц · Агентууд) and the
 *   brain's recent chats, one of them open. Sources are not in the side; they sit under the answer as chips.
 * - Main: the question as a sent message, source chips (SourcePreview), the cited answer in serif for
 *   reading, and the composer at the bottom.
 * Tokens only (--ts-*), radius --ts-radius; compact controls keep a 44px hit area.
 *
 *   <AskWindow question="…" answer={segments} sources={sources} onAsk={(q) => …} onOpenSource={(s) => …} />
 */
import * as React from "react";
import { CitedAnswer, type CitedSegment, type CitedSource } from "../library/cited-answer";
import { SourceIcon, SourcePreview, type PreviewSource, type SourceKind } from "../library/source-preview";
import { ThinkingState, type ThinkingStep } from "../library/thinking-state";
import { APP_FRAME_CSS } from "./app-frame";
import { LOOP, motionVar, useScenario, type ScenarioStep } from "../motion";

export type AskSource = {
  id: string;
  title: string;
  kind: SourceKind;
  /** Short type label shown in the preview, e.g. «Шийдвэр». */
  label: string;
  date?: string;
  quote?: string;
  highlight?: string;
  logo?: React.ReactNode;
  /** App the source lives in, e.g. "figma" — shows its mark where its guidelines allow (BRAND_MARK). */
  brand?: string;
};
export type AskNavItem = { id: string; label: string; icon: "inbox" | "today" | "projects" | "areas" | "resources" | "agents"; count?: number };
export type AskChat = { id: string; title: string };
export type AskWindowLabels = { title: string; send: string; placeholder: string; chats: string; newChat: string; brain: string; pagesRead: (n: number) => string };
export const askWindowLabelsMn: AskWindowLabels = {
  title: "Second Brain",
  send: "Асуух",
  placeholder: "Тархинаасаа асуу…",
  chats: "Тархины чатууд",
  newChat: "Шинэ чат",
  brain: "Тархи",
  pagesRead: (n) => `${n} хуудас уншсан`,
};
export const askNavMn: AskNavItem[] = [
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "today", label: "Өнөөдөр", icon: "today" },
  { id: "projects", label: "Төслүүд", icon: "projects" },
  { id: "areas", label: "Хүрээ", icon: "areas" },
  { id: "resources", label: "Нөөц", icon: "resources" },
  { id: "agents", label: "Агентууд", icon: "agents" },
];
export type AskWindowProps = {
  question: string;
  answer: CitedSegment[];
  sources: AskSource[];
  /** The brain this window shows, e.g. { name: "ACME", note: "демо" }. */
  workspace?: { name: string; note?: string };
  /** The brain's menu (PARA). */
  nav?: AskNavItem[];
  /** Recent chats of the brain; `activeChat` is the open one. */
  chats?: AskChat[];
  activeChat?: string;
  /** Light (default) or dark window; works inside any page theme. */
  theme?: "light" | "dark";
  /** The chip whose preview starts open (screenshots, the hero's first frame). */
  openSource?: string;
  /** Hide the side (narrow windows hide it on their own). */
  sidebar?: boolean;
  onAsk?: (question: string) => void;
  onOpenSource?: (source: AskSource) => void;
  onNavigate?: (id: string) => void;
  /** The visible chain of thought shown before the answer (plan, search, tool calls). */
  thinking?: ThinkingStep[];
  /** "auto" (default): plays the run once when it comes into view — question, thinking, sources light up,
   * the answer streams in with its citations. "static": the finished state. Reduced motion is always static. */
  play?: "auto" | "static";
  /** Freeze the window at one phase of the run (docs, screenshots, the contrast check). Overrides play. */
  phase?: AskPhase;
  /** Each phase of the run as it starts — for syncing e.g. the hero's brain pulse. */
  onPhase?: (phase: AskPhase) => void;
  labels?: Partial<AskWindowLabels>;
  className?: string;
};
export type AskPhase = "ask" | "think" | "sources" | "answer" | "done";

// Line icons follow the library tokens (--ts-icon-size, --ts-icon-stroke); a size argument overrides the size only.
const I = (d: React.ReactNode, size?: number) => (
  <svg width={size ?? 14} height={size ?? 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: size ?? "var(--ts-icon-size,14px)", height: size ?? "var(--ts-icon-size,14px)", strokeWidth: "var(--ts-icon-stroke,1.25)" }}>{d}</svg>
);
// Lucide shapes (ISC): inbox, sun, folder, circle-dot, book-open, bot, message-circle, square-pen, arrow-up.
const NAV_ICON: Record<AskNavItem["icon"], React.ReactNode> = {
  inbox: I(<><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>),
  today: I(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>),
  projects: I(<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />),
  areas: I(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1" /></>),
  resources: I(<><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></>),
  agents: I(<><path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M2 14h2M20 14h2M15 13v2M9 13v2" /></>),
};
const chatIcon = I(<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />, 14);
const newIcon = I(<><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></>, 14);
const upIcon = I(<><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>, 16);

const CSS = `
.aw-new{color:var(--ts-fg)}
/* Compact controls keep a 44px hit area through an invisible halo. */
.aw-item::after,.aw-send::after,.aw .sp-chip::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}
.aw-main{flex:1;min-width:0;display:flex;flex-direction:column}
.aw-thread{flex:1;min-height:0;overflow:auto;padding:18px 28px 8px;display:flex;flex-direction:column;gap:14px}
.aw-q{align-self:flex-end;max-width:82%;padding:7px 12px;border-radius:calc(var(--ts-radius,6px) + 4px);background:color-mix(in srgb,var(--ts-fg) 6%,transparent);font-size:13px}
.aw-chips{position:relative;display:flex;flex-wrap:wrap;gap:6px}
.aw .sp-chip{position:relative;min-height:24px;height:24px;padding:0 8px;font-size:12px;border-color:color-mix(in srgb,var(--ts-line) 80%,transparent);background:transparent}
.aw .sp-chip svg{width:12px;height:12px}
.aw .sp-pop{width:280px;padding:12px}.aw .sp-title{font-size:13px}.aw .sp-quote{margin-top:10px;font-size:13px}.aw .sp-foot{margin-top:10px}
.aw .sp-open{position:relative;min-height:30px;font-size:12px}.aw .sp-open>span{width:30px}
.aw .sp-open::after,.aw .sp-x::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}.aw .sp-x{position:relative}
.aw .ca{max-width:none;border:0;box-shadow:none;background:transparent;font:400 15px/1.6 var(--ts-font,Inter,system-ui,sans-serif)}
.aw .ca-body{padding:0}
.aw .ca-head{font:400 11px var(--ts-font,Inter,sans-serif);color:var(--ts-faint);margin-bottom:6px}
.aw .ca-chips,.aw .ca-foot{display:none}
.aw-compose{margin:8px 20px 16px;display:flex;align-items:flex-end;gap:8px;padding:8px 8px 8px 12px;border:1px solid color-mix(in srgb,var(--ts-line) 90%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);background:var(--ts-page);box-shadow:0 1px 2px rgb(8 12 40/.05)}
.aw-compose:focus-within{border-color:var(--ts-faint)}
.aw-compose input{flex:1;min-width:0;height:26px;border:0;background:none;outline:0;font:inherit;font-size:13px;color:var(--ts-fg)}
.aw-compose input::placeholder{color:var(--ts-faint)}
.aw-send{position:relative;display:grid;place-items:center;flex:none;width:26px;height:26px;border:0;border-radius:var(--ts-radius,6px);background:var(--ts-electric);color:var(--ts-on-electric);cursor:pointer}
.aw-send:focus-visible,.aw-item:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.aw .ts-think,.aw [class*="thinking"]{font-size:13px}
.aw-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.aw-in{animation:aw-in ${motionVar.duration("md")} ${motionVar.easing("enter")} both}
.aw-chips .aw-in{animation-delay:calc(var(--i,0) * ${LOOP.stagger}ms)}
@keyframes aw-in{from{opacity:0;transform:translateY(4px)}}
.aw-q.aw-typing::after{content:"";display:inline-block;width:1px;height:1em;margin-left:2px;vertical-align:-2px;background:currentColor;animation:aw-caret 1s steps(1) infinite}
@keyframes aw-caret{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.aw-in,.aw-q.aw-typing::after{animation:none}}
@container (max-width:560px){.aw-side{display:none}.aw-thread{padding:14px 14px 6px}.aw-compose{margin:6px 10px 10px}.aw .sp{position:static}.aw .sp-pop{left:0;right:0;width:auto;max-width:none}}
`;

export function AskWindow({
  question,
  answer,
  sources,
  workspace,
  nav = askNavMn,
  chats = [],
  activeChat,
  theme = "light",
  openSource,
  sidebar = true,
  onAsk,
  onOpenSource,
  onNavigate,
  thinking = [],
  play = "auto",
  phase,
  onPhase,
  labels: labelsIn,
  className = "",
}: AskWindowProps) {
  const labels = { ...askWindowLabelsMn, ...labelsIn };
  const [text, setText] = React.useState("");
  const [focus, setFocus] = React.useState<string | null>(openSource ?? null);
  // The run: ask (question types) → think (one step each) → sources (chips light up) → answer (segment by segment) → done.
  type Frame = { phase: AskPhase; typed: number; steps: number; chips: number; segs: number };
  const frames = React.useMemo<ScenarioStep<Frame>[]>(() => {
    const out: ScenarioStep<Frame>[] = [];
    const T = thinking.length, C = sources.length, A = answer.length;
    out.push({ state: { phase: "ask", typed: 0.45, steps: 0, chips: 0, segs: 0 }, hold: 260 });
    out.push({ state: { phase: "ask", typed: 1, steps: 0, chips: 0, segs: 0 }, hold: 420 });
    for (let i = 1; i <= T; i++) out.push({ state: { phase: "think", typed: 1, steps: i, chips: 0, segs: 0 }, hold: 650 });
    out.push({ state: { phase: "sources", typed: 1, steps: T, chips: C, segs: 0 }, hold: 300 + C * 140 });
    for (let i = 1; i <= A; i++) out.push({ state: { phase: "answer", typed: 1, steps: T, chips: C, segs: i }, hold: 480 });
    out.push({ state: { phase: "done", typed: 1, steps: T, chips: C, segs: A }, hold: 1000 });
    return out;
  }, [thinking.length, sources.length, answer.length]);
  const run = useScenario<Frame, HTMLDivElement>(frames, { loops: 1, rest: 0 });
  // Plays once: after the first finish it stays finished, even when the hero scrolls out and back in.
  // New content (a different question or answer) plays again.
  const finished = React.useRef(false);
  const finishedFor = React.useRef(frames);
  if (finishedFor.current !== frames) { finishedFor.current = frames; finished.current = false; }
  const last = frames[frames.length - 1].state;
  if (run.state?.phase === "done") finished.current = true;
  const frozen = phase ? [...frames].reverse().find((x) => x.state.phase === phase)?.state : undefined;
  const f = frozen ?? (play === "static" || run.loopState === "paused" || finished.current ? last : run.state ?? last);
  const animate = f !== last || run.playing;
  // The latest callback by ref: a new inline onPhase each render must not re-fire the same phase.
  const onPhaseRef = React.useRef(onPhase);
  onPhaseRef.current = onPhase;
  React.useEffect(() => { onPhaseRef.current?.(f.phase); }, [f.phase]);
  const shownQuestion = f.typed >= 1 ? question : question.slice(0, Math.ceil(question.length * f.typed));
  const [current, setCurrent] = React.useState<string | undefined>(activeChat ?? chats[0]?.id);
  const dark = theme === "dark";
  const cited: CitedSource[] = sources.map((s) => ({ id: s.id, title: s.title, site: s.label, date: s.date, quote: s.quote, highlight: s.highlight, icon: <SourceIcon kind={s.kind} size={12} tile={false} logo={s.logo} brand={s.brand} /> }));
  const preview = (s: AskSource): PreviewSource => ({ id: s.id, title: s.title, kind: s.kind, kindLabel: s.label, date: s.date, quote: s.quote, highlight: s.highlight, logo: s.logo, brand: s.brand });
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (text.trim()) { onAsk?.(text.trim()); setText(""); } };

  return (
    <div className={`aw ${dark ? "dark" : ""} ${className}`} data-ts-theme={dark ? "dark" : "cream"} data-theme={dark ? "dark" : "light"}>
      <style>{APP_FRAME_CSS + CSS}</style>
      <div className="aw-bar">
        <div className="aw-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="aw-title">{labels.title}</span>
      </div>
      <div className="aw-split">
        {sidebar && (
          <nav className="aw-side" aria-label={labels.title}>
            {workspace && (
              <div className="aw-ws">
                <b aria-hidden="true">{workspace.name.slice(0, 1)}</b>
                <span><strong>{workspace.name}</strong><small>{workspace.note ? `${labels.brain} · ${workspace.note}` : labels.brain}</small></span>
              </div>
            )}
            <button type="button" className="aw-item aw-new" onClick={() => onNavigate?.("new")}>{newIcon}<span>{labels.newChat}</span></button>
            {nav.map((n) => (
              <button key={n.id} type="button" className="aw-item" onClick={() => onNavigate?.(n.id)}>{NAV_ICON[n.icon]}<span>{n.label}</span>{n.count != null && <small>{n.count}</small>}</button>
            ))}
            {chats.length > 0 && <h6>{labels.chats}</h6>}
            {chats.map((c) => (
              <button key={c.id} type="button" className="aw-item" aria-current={current === c.id} onClick={() => { setCurrent(c.id); onNavigate?.(`chat:${c.id}`); }}>{chatIcon}<span>{c.title}</span></button>
            ))}
          </nav>
        )}
        <div className="aw-main">
          <div className="aw-thread" ref={run.ref} {...run.attrs} data-phase={f.phase}>
            <div className={`aw-q ${f.typed < 1 ? "aw-typing" : ""}`}><span aria-hidden={f.typed < 1}>{shownQuestion}</span>{f.typed < 1 && <span className="aw-sr">{question}</span>}</div>
            {thinking.length > 0 && f.steps > 0 && (
              <div className={animate ? "aw-in" : undefined}>
                <ThinkingState steps={thinking.slice(0, f.steps)} live={{ done: f.phase !== "think", seconds: f.steps }} collapseOnDone workedLabel={(ms) => `Бодсон ${Math.max(1, Math.round(ms / 1000))} с`} />
              </div>
            )}
            {f.chips > 0 && (
              <div className="aw-chips">
                {sources.slice(0, f.chips).map((s, i) => (
                  <span key={s.id} className={animate ? "aw-in" : undefined} style={{ ["--i" as string]: i } as React.CSSProperties}>
                    <SourcePreview
                      source={preview(s)}
                      open={focus === s.id}
                      onOpenChange={(o) => setFocus(o ? s.id : null)}
                      onOpenInApp={onOpenSource ? () => onOpenSource(s) : undefined}
                    />
                  </span>
                ))}
              </div>
            )}
            {f.segs > 0 && (
              <div aria-live="polite" aria-busy={f.phase !== "done"}>
                <CitedAnswer theme={theme} segments={answer.slice(0, f.segs)} sources={cited} pagesRead={sources.length} />
              </div>
            )}
          </div>
          <form className="aw-compose" onSubmit={submit}>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={labels.placeholder} aria-label={labels.placeholder} />
            <button type="submit" className="aw-send" aria-label={labels.send}>{upIcon}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/** ACME demo (made-up company; every figure is a demo number). */
// Demo copy from web-app's app-texts_vfinal.json (ask_window_demo). ACME is made up.
export const askWindowDemoNote = "ac.me — жишээ өгөгдөл, бодит харилцагч биш";
/** Six micro messages for a host's live line (e.g. the hero brain), in run order. */
export const askWindowMicroMn = [
  "санах ой хайж байна…",
  "шийдвэр олдлоо · Үнийн бодлого",
  "уулзалтын тэмдэглэл · 10-р сар",
  "Slack · хэлэлцүүлэг холбогдлоо",
  "эх сурвалж нэгтгэж байна…",
  "хариу бэлэн",
];
export const askWindowDemo: AskWindowProps = {
  question: "Өнгөрсөн сард үнийн талаар ямар шийдвэр гаргасан бэ?",
  workspace: { name: "ACME", note: "демо" },
  nav: askNavMn.map((n) => (n.id === "inbox" ? { ...n, count: 4 } : n)),
  chats: [
    { id: "price", title: "Үнийн бодлого" },
    { id: "stock", title: "Нийлүүлэлтийн хоцролт" },
    { id: "onb", title: "Шинэ ажилтны чиглүүлэг" },
  ],
  activeChat: "price",
  thinking: [
    { kind: "search", label: "санах ой хайж байна…", completedLabel: "3 эх сурвалж", sources: [{ label: "Шийдвэр" }, { label: "Уулзалт" }, { label: "Slack" }] },
    { kind: "step", label: "эх сурвалж нэгтгэж байна…", completedLabel: "хариу бэлэн" },
  ],
  answer: [
    { text: "Үнийн шинэчлэлийг 10-р сарын багийн уулзалтаар шийдсэн.", cite: ["m"] },
    { text: " Шалтгааныг Slack дээрх хэлэлцүүлэгт,", cite: ["s"] },
    { text: " эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичсэн.", cite: ["d"] },
  ],
  sources: [
    { id: "d", kind: "decision", brand: "notion", title: "Үнийн бодлого", label: "Шийдвэр", date: "2026.10", quote: "Үнийг шинэчлэхээр шийдэв. Шалтгаан: зардал өссөн, өрсөлдөгчдийн үнэ өөрчлөгдсөн. Хэрэгжүүлэх: дараагийн улирлаас. Эзэн: борлуулалтын баг.", highlight: "Үнийг шинэчлэхээр шийдэв." },
    { id: "m", kind: "meeting", brand: "google-calendar", title: "Багийн уулзалт · 10-р сар", label: "Уулзалтын тэмдэглэл", date: "2026.10", quote: "Үнийн хоёр хувилбарыг харьцуулав. Харилцагчдад урьдчилан мэдэгдэхээр тохирлоо. Эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичнэ.", highlight: "урьдчилан мэдэгдэхээр" },
    { id: "s", kind: "message", brand: "slack", title: "#sales · үнийн хэлэлцүүлэг", label: "Slack thread", date: "2026.10", quote: "Зардал өссөнийг санхүүгийн баг мэдэгдэв. Борлуулалтын баг харилцагчийн хариуг хуваалцав. Уулзалтаар шийдэхээр тохирлоо.", highlight: "Зардал өссөнийг" },
  ],
};
