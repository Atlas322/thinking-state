/**
 * Ask Window (2026-11-17, variant B of three) — the site hero's Ask block as one app window:
 * title bar (dots, title, view/edit tabs) · a narrow sidebar (workspace, sources) · Ask · source chips
 * (SourcePreview) · the cited answer (CitedAnswer). Tokens only (--ts-*), radius --ts-radius, 44px targets.
 *
 *   <AskWindow question="…" answer={segments} sources={sources} onAsk={(q) => …} onOpenSource={(s) => …} />
 */
import * as React from "react";
import { CitedAnswer, type CitedSegment, type CitedSource } from "../library/cited-answer";
import { SourceIcon, SourcePreview, type PreviewSource, type SourceKind } from "../library/source-preview";

export type AskSource = {
  id: string;
  title: string;
  kind: SourceKind;
  /** Short type label shown in the sidebar and preview, e.g. «Шийдвэр». */
  label: string;
  date?: string;
  quote?: string;
  highlight?: string;
  logo?: React.ReactNode;
};
export type AskWindowLabels = { title: string; view: string; edit: string; sources: string; send: string; placeholder: string; pagesRead: (n: number) => string };
export const askWindowLabelsMn: AskWindowLabels = {
  title: "INAI · Thinking State",
  view: "Үзэх",
  edit: "Засах",
  sources: "Эх сурвалж",
  send: "Асуух",
  placeholder: "Асуух зүйлээ бич…",
  pagesRead: (n) => `${n} хуудас уншсан`,
};
export type AskWindowProps = {
  question: string;
  answer: CitedSegment[];
  sources: AskSource[];
  /** Workspace shown at the top of the sidebar, e.g. { name: "ACME", note: "демо" }. */
  workspace?: { name: string; note?: string };
  /** Light (default) or dark window; works inside any page theme. */
  theme?: "light" | "dark";
  /** The chip whose preview starts open (screenshots, the hero's first frame). */
  openSource?: string;
  /** Hide the sidebar (narrow screens hide it automatically below 720px). */
  sidebar?: boolean;
  onAsk?: (question: string) => void;
  onOpenSource?: (source: AskSource) => void;
  labels?: Partial<AskWindowLabels>;
  className?: string;
};

const CSS = `
.aw{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:14px;line-height:1.5;background:var(--ts-surface);color:var(--ts-fg);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);box-shadow:0 24px 48px -16px rgb(8 12 40/.4),0 8px 16px -8px rgb(8 12 40/.3);overflow:hidden;container-type:inline-size;max-width:720px}
.aw-bar{display:flex;align-items:center;gap:10px;height:32px;padding:0 10px;border-bottom:1px solid var(--ts-line);background:var(--ts-soft)}
.aw-dots{display:flex;gap:5px}.aw-dots i{width:9px;height:9px;border-radius:50%;background:var(--ts-line)}
.aw-title{font-weight:500;font-size:12px;color:var(--ts-muted)}
.aw-tabs{margin-left:auto;display:flex;gap:2px;padding:2px;border-radius:var(--ts-radius,6px);background:var(--ts-soft-2)}
.aw-tabs button{position:relative;border:0;background:none;font:inherit;font-weight:500;font-size:12px;height:22px;padding:0 8px;border-radius:calc(var(--ts-radius,6px) - 2px);color:var(--ts-muted);cursor:pointer}
.aw-tabs button[aria-pressed="true"]{background:var(--ts-surface);color:var(--ts-fg);box-shadow:var(--ts-elevation)}
/* Compact controls keep a 44px hit area through an invisible halo. */
.aw-tabs button::after,.aw-item::after,.aw-send::after{content:"";position:absolute;inset:50% auto auto 50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}
.aw *{box-sizing:border-box}
.aw-split{display:flex;min-height:340px}
.aw-side{width:200px;flex:none;border-right:1px solid var(--ts-line);background:var(--ts-soft);padding:10px 8px;display:flex;flex-direction:column;gap:1px}
.aw-side h6{font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;color:var(--ts-faint);margin:10px 6px 4px;text-transform:uppercase}
.aw-item{position:relative;display:flex;align-items:center;gap:8px;height:30px;padding:0 6px;border:0;border-radius:var(--ts-radius,6px);background:none;font:inherit;font-weight:500;font-size:13px;color:var(--ts-muted);text-align:left;cursor:pointer;width:100%}
.aw-item:hover{background:var(--ts-soft-2)}
.aw-item[aria-current="true"]{background:var(--ts-surface);color:var(--ts-fg);box-shadow:var(--ts-elevation)}
.aw-item small{margin-left:auto;font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint)}
.aw-ws{cursor:default}
.aw-main{flex:1;min-width:0;padding:12px 16px 16px;display:flex;flex-direction:column;gap:10px}
.aw-ask{display:flex;align-items:center;gap:8px;padding:0 0 0 10px;height:40px;border:1px solid var(--ts-electric);border-radius:var(--ts-radius,6px);background:var(--ts-page);box-shadow:0 0 0 3px var(--ts-electric-soft)}
.aw-ask>svg{color:var(--ts-electric-fg);flex:none;width:16px;height:16px}
.aw-ask input{flex:1;min-width:0;border:0;background:none;outline:0;font:inherit;font-weight:500;font-size:14px;color:var(--ts-fg)}
.aw-ask input::placeholder{color:var(--ts-faint)}
.aw-send{position:relative;display:grid;place-items:center;flex:none;width:32px;height:32px;margin:3px;border:0;border-radius:calc(var(--ts-radius,6px) - 2px);background:var(--ts-electric);color:var(--ts-on-electric);cursor:pointer}
.aw-send svg{width:16px;height:16px}
.aw-send:focus-visible,.aw-item:focus-visible,.aw-tabs button:focus-visible{outline:2px solid var(--ts-electric);outline-offset:2px}
.aw-chips{position:relative;display:flex;flex-wrap:wrap;gap:6px}
.aw .sp-chip{position:relative;min-height:28px;height:28px;padding:0 8px;font-size:13px}
.aw .sp-chip::after{content:"";position:absolute;inset:50% auto auto 50%;width:100%;height:44px;transform:translate(-50%,-50%)}
.aw .sp-pop{width:300px;padding:12px}.aw .sp-title{font-size:14px}.aw .sp-quote{margin-top:10px;font-size:13px}.aw .sp-foot{margin-top:10px}.aw .sp-open{position:relative;min-height:32px;font-size:13px}.aw .sp-open>span{width:32px}.aw .sp-open::after{content:"";position:absolute;inset:50% 0 auto 0;height:44px;transform:translateY(-50%)}.aw .sp-x{position:relative}.aw .sp-x::after{content:"";position:absolute;inset:50% auto auto 50%;width:44px;height:44px;transform:translate(-50%,-50%)}
.aw .ca{max-width:none;border:0;box-shadow:none;background:transparent;font-size:14px;line-height:1.55}
.aw .ca-body{padding:0}
.aw .ca-head{font-size:12px}
.aw .ca-chips,.aw .ca-foot{display:none}
@container (max-width:600px){.aw-side{display:none}.aw .sp{position:static}.aw .sp-pop{left:0;right:0;width:auto;max-width:none}}
`;

const spark = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z" /></svg>;
const arrow = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const building = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4M10 10h4M10 14h4M10 18h4" /></svg>;

export function AskWindow({
  question,
  answer,
  sources,
  workspace,
  theme = "light",
  openSource,
  sidebar = true,
  onAsk,
  onOpenSource,
  labels: labelsIn,
  className = "",
}: AskWindowProps) {
  const labels = { ...askWindowLabelsMn, ...labelsIn };
  const [mode, setMode] = React.useState<"view" | "edit">("view");
  const [text, setText] = React.useState(question);
  const [focus, setFocus] = React.useState<string | null>(openSource ?? null);
  const dark = theme === "dark";
  const cited: CitedSource[] = sources.map((s) => ({ id: s.id, title: s.title, site: s.label, date: s.date, quote: s.quote, highlight: s.highlight, icon: <SourceIcon kind={s.kind} size={12} tile={false} logo={s.logo} /> }));
  const preview = (s: AskSource): PreviewSource => ({ id: s.id, title: s.title, kind: s.kind, kindLabel: s.label, date: s.date, quote: s.quote, highlight: s.highlight, logo: s.logo });
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (text.trim()) onAsk?.(text.trim()); };

  return (
    <div className={`aw ${dark ? "dark" : ""} ${className}`} data-ts-theme={dark ? "dark" : "cream"} data-theme={dark ? "dark" : "light"}>
      <style>{CSS}</style>
      <div className="aw-bar">
        <div className="aw-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="aw-title">{labels.title}</span>
        <div className="aw-tabs">
          <button type="button" aria-pressed={mode === "view"} onClick={() => setMode("view")}>{labels.view}</button>
          <button type="button" aria-pressed={mode === "edit"} onClick={() => setMode("edit")}>{labels.edit}</button>
        </div>
      </div>
      <div className="aw-split">
        {sidebar && (
          <nav className="aw-side" aria-label={labels.sources}>
            {workspace && <div className="aw-item aw-ws" aria-current="true">{building}{workspace.name}{workspace.note && <small>{workspace.note}</small>}</div>}
            <h6>{labels.sources}</h6>
            {sources.map((s) => (
              <button key={s.id} type="button" className="aw-item" aria-current={focus === s.id} onClick={() => { setFocus(focus === s.id ? null : s.id); onOpenSource?.(s); }}>
                <SourceIcon kind={s.kind} size={14} logo={s.logo} />{s.label}{s.date && <small>{s.date}</small>}
              </button>
            ))}
          </nav>
        )}
        <div className="aw-main">
          <form className="aw-ask" onSubmit={submit}>
            {spark}
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={labels.placeholder} aria-label={labels.send} readOnly={mode === "view" && !onAsk} />
            <button type="submit" className="aw-send" aria-label={labels.send}>{arrow}</button>
          </form>
          <div className="aw-chips">
            {sources.map((s) => (
              <SourcePreview
                key={s.id}
                source={preview(s)}
                open={focus === s.id}
                onOpenChange={(o) => setFocus(o ? s.id : null)}
                onOpenInApp={onOpenSource ? () => onOpenSource(s) : undefined}
              />
            ))}
          </div>
          <CitedAnswer theme={theme} segments={answer} sources={cited} pagesRead={sources.length} />
        </div>
      </div>
    </div>
  );
}

/** ACME demo (made-up company; every figure is a demo number). */
export const askWindowDemo: AskWindowProps = {
  question: "Үнийн шинэчлэлийг хэзээ, яагаад шийдсэн бэ?",
  workspace: { name: "ACME", note: "демо" },
  answer: [
    { text: "Үнийн шинэчлэлийг 10-р сарын багийн уулзалтаар шийдсэн.", cite: ["m"] },
    { text: " Дунд түвшин нэмж, дээд багцын үнэ хэвээр үлдэнэ.", cite: ["d"] },
    { text: " Шалтгаан нь хямд багцаас ахиулах хүсэлт олширсон явдал.", cite: ["s"] },
  ],
  sources: [
    { id: "d", kind: "decision", title: "Үнийн бодлого", label: "Шийдвэр", date: "2026.10", quote: "Дунд түвшин нэмж, дээд багцын үнийг хэвээр үлдээнэ.", highlight: "Дунд түвшин нэмж" },
    { id: "m", kind: "meeting", title: "Багийн уулзалт · 10-р сар", label: "Уулзалт", date: "2026.10", quote: "Үнийн хоёр хувилбарыг харьцуулж, харилцагчдад урьдчилан мэдэгдэхээр тохирлоо.", highlight: "урьдчилан мэдэгдэх" },
    { id: "s", kind: "message", title: "Борлуулалтын суваг", label: "Мессеж", date: "2026.10", quote: "Хямд багцаас ахиулах хүсэлт энэ сард 40 гаруй ирлээ.", highlight: "40 гаруй" },
  ],
};
