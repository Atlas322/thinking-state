/**
 * Source Preview (Thinking State original, 2026-11-18) — a source chip that opens a file preview.
 * Chip: kind icon (document, calendar, message) or a brand logo, plus the title.
 * Popover: icon, title, kind, date, the quoted passage with the matching words marked, «Апп-д нээх».
 * Escape or a click outside closes it; focus returns to the chip. Radius = --ts-radius (6px fallback).
 */
import * as React from "react";

export type SourceKind = "document" | "calendar" | "message" | "brand";
export type PreviewSource = {
  id: string;
  title: string;
  kind: SourceKind;
  /** Shown under the title, e.g. «Баримт · Drive». Defaults to the kind's label. */
  kindLabel?: string;
  date?: string;
  quote?: string;
  /** Words inside quote to mark. */
  highlight?: string;
  /** Brand logo for kind="brand" (an <img> or <svg>); falls back to the first letter of brandName. */
  logo?: React.ReactNode;
  brandName?: string;
};
export type SourcePreviewLabels = { open: string; close: string; kinds: Record<SourceKind, string> };
export const sourcePreviewLabelsMn: SourcePreviewLabels = {
  open: "Апп-д нээх",
  close: "Хаах",
  kinds: { document: "Баримт", calendar: "Календарь", message: "Мессеж", brand: "Апп" },
};
export type SourcePreviewProps = {
  source?: PreviewSource;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** «Апп-д нээх»; omitted, the button is hidden. */
  onOpenInApp?: (source: PreviewSource) => void;
  /** Popover side relative to the chip. */
  placement?: "bottom" | "top";
  labels?: Partial<SourcePreviewLabels>;
  className?: string;
};

const demoSource: PreviewSource = {
  id: "retention",
  title: "Харилцагчийн хадгалалтын тайлан 2026",
  kind: "document",
  kindLabel: "Баримт · Судалгаа",
  date: "2026-11-02",
  quote: "Шинэ харилцагчдын 62% нь гурван сарын дотор багцаа ахиулсан. Ахиулалт ихэвчлэн хоёр дахь сард болдог.",
  highlight: "62% нь гурван сарын дотор",
};

const glyphs: Record<Exclude<SourceKind, "brand">, React.ReactNode> = {
  document: <><path d="M4 2h5.5L12 4.5V14H4Z" /><path d="M9.5 2v2.5H12M6 8.5h4M6 11h3" /></>,
  calendar: <><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" /></>,
  message: <path d="M3 3h10v7H8l-3 3v-3H3Z" />,
};

function KindIcon({ source, size = 16 }: { source: PreviewSource; size?: number }) {
  if (source.kind === "brand") {
    return (
      <span className="sp-logo" style={{ width: size + 4, height: size + 4 }} aria-hidden="true">
        {source.logo ?? (source.brandName ?? source.title).slice(0, 1)}
      </span>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {glyphs[source.kind]}
    </svg>
  );
}

function Marked({ text, mark }: { text: string; mark?: string }) {
  const i = mark ? text.indexOf(mark) : -1;
  if (!mark || i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{mark}</mark>{text.slice(i + mark.length)}</>;
}

const CSS = `
.sp{position:relative;display:inline-block;font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg,#141412)}
.sp-chip{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border:1px solid var(--ts-line,#cfcabe);border-radius:var(--ts-radius,6px);background:var(--ts-surface,#f7f5ef);color:inherit;font-weight:500;font-size:14px;line-height:1;cursor:pointer;max-width:280px}
.sp-chip>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sp-chip:hover{border-color:var(--ts-faint,#5c5a55)}
.sp-chip[aria-expanded="true"]{border-color:var(--ts-electric,#1b5cff);color:var(--ts-electric-fg,#1b5cff)}
.sp-chip:focus-visible,.sp-open:focus-visible,.sp-x:focus-visible{outline:2px solid var(--ts-electric,#1b5cff);outline-offset:2px}
.sp-pop{position:absolute;left:0;z-index:20;width:340px;max-width:calc(100vw - 32px);padding:16px;border:1px solid var(--ts-line,#cfcabe);border-radius:var(--ts-radius,6px);background:var(--ts-surface,#f7f5ef);box-shadow:0 12px 32px -8px rgb(20 20 18/.22);animation:sp-in .16s ease-out both}
.sp-pop[data-placement="bottom"]{top:calc(100% + 8px)}.sp-pop[data-placement="top"]{bottom:calc(100% + 8px)}
@keyframes sp-in{from{opacity:0;transform:translateY(4px)}}
@media (prefers-reduced-motion:reduce){.sp-pop{animation:none}}
.sp-head{display:grid;grid-template-columns:36px 1fr auto;gap:12px;align-items:start}
.sp-ico{width:36px;height:36px;display:grid;place-items:center;border-radius:var(--ts-radius,6px);background:var(--ts-soft,#efebe1);color:var(--ts-muted,#5c5a55)}
.sp-logo{display:grid;place-items:center;border-radius:var(--ts-radius,6px);background:#1b5cff;color:#fff;font-weight:600;font-size:12px;line-height:1;overflow:hidden}
.sp-logo img,.sp-logo svg{width:100%;height:100%;object-fit:contain}
.sp-title{font-weight:600;font-size:16px;line-height:1.3;margin:0}
.sp-meta{font:400 12px/1.4 var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint,#5c5a55);margin-top:4px}
.sp-x{width:28px;height:28px;display:grid;place-items:center;border:0;border-radius:var(--ts-radius,6px);background:none;color:var(--ts-muted,#5c5a55);cursor:pointer}
.sp-x:hover{background:var(--ts-soft,#efebe1)}
.sp-quote{margin:14px 0 0;padding:0 0 0 12px;border-left:2px solid var(--ts-line,#cfcabe);font-weight:400;font-size:14px;line-height:1.55;color:var(--ts-muted,#5c5a55)}
.sp-quote mark{background:var(--ts-electric-soft,#dce5ff);color:var(--ts-fg,#141412);padding:0 2px;border-radius:2px}
.sp-foot{display:flex;justify-content:flex-end;margin-top:14px}
.sp-open{display:inline-flex;align-items:stretch;min-height:44px;border:0;border-radius:var(--ts-radius,6px);background:#1b5cff;color:#fff;font-weight:500;font-size:14px;line-height:1;cursor:pointer;padding:0 0 0 16px}
.sp-open>em{font-style:normal;display:flex;align-items:center}
.sp-open>span{display:grid;place-items:center;width:44px;margin-left:16px;border-left:1.5px solid rgb(255 255 255/.4)}
.sp-open:hover{background:#2a69ff}
`;

export function SourcePreview({
  source = demoSource,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onOpenInApp,
  placement = "bottom",
  labels: labelsIn,
  className = "",
}: SourcePreviewProps) {
  const labels = { ...sourcePreviewLabelsMn, ...labelsIn, kinds: { ...sourcePreviewLabelsMn.kinds, ...labelsIn?.kinds } };
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const setOpen = (v: boolean) => { if (openProp === undefined) setInner(v); onOpenChange?.(v); };
  const root = React.useRef<HTMLDivElement>(null);
  const chip = React.useRef<HTMLButtonElement>(null);
  const popId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); chip.current?.focus(); } };
    const onDown = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  });

  const kindText = source.kindLabel ?? labels.kinds[source.kind];
  return (
    <div ref={root} className={`sp ${className}`}>
      <style>{CSS}</style>
      <button ref={chip} type="button" className="sp-chip" aria-expanded={open} aria-controls={popId} onClick={() => setOpen(!open)}>
        <KindIcon source={source} size={14} />
        <span>{source.title}</span>
      </button>
      {open && (
        <div id={popId} className="sp-pop" role="dialog" aria-label={source.title} data-placement={placement}>
          <div className="sp-head">
            <span className="sp-ico"><KindIcon source={source} /></span>
            <div>
              <p className="sp-title">{source.title}</p>
              <div className="sp-meta">{kindText}{source.date ? ` · ${source.date}` : ""}</div>
            </div>
            <button type="button" className="sp-x" aria-label={labels.close} onClick={() => { setOpen(false); chip.current?.focus(); }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
            </button>
          </div>
          {source.quote && <blockquote className="sp-quote"><Marked text={source.quote} mark={source.highlight} /></blockquote>}
          {onOpenInApp && (
            <div className="sp-foot">
              <button type="button" className="sp-open" onClick={() => onOpenInApp(source)}>
                <em>{labels.open}</em>
                <span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Catalog demo: the three kinds and a brand, the first one open. */
export default function SourcePreviewDemo() {
  const others: PreviewSource[] = [
    { id: "cal", title: "Үнийн хурал", kind: "calendar", kindLabel: "Календарь", date: "2026-11-14 · 10:00", quote: "Дунд түвшин нэмэх эсэхийг шийднэ." },
    { id: "msg", title: "Борлуулалтын суваг", kind: "message", date: "2026-11-15", quote: "Хямд багцаас ахиулах хүсэлт энэ сард 40 гаруй ирлээ.", highlight: "40 гаруй" },
    { id: "brand", title: "Үнийн ноорог", kind: "brand", brandName: "Самбар", kindLabel: "Апп · Самбар", date: "2026-11-16" },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px 8px 240px" }}>
      <SourcePreview defaultOpen onOpenInApp={() => {}} />
      {others.map((s) => <SourcePreview key={s.id} source={s} onOpenInApp={() => {}} />)}
    </div>
  );
}
