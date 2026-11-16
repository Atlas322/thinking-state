/**
 * Source Preview (Thinking State original, 2026-11-18) — a source chip that opens a file preview.
 * Chip: kind icon (document, calendar, message) or a brand logo, plus the title.
 * Popover: icon, title, kind, date, the quoted passage with the matching words marked, «Апп-д нээх».
 * Escape or a click outside closes it; focus returns to the chip. Radius = --ts-radius (6px fallback).
 */
import * as React from "react";

export type SourceKind = "document" | "calendar" | "message" | "decision" | "meeting" | "note" | "link" | "brand";
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
  /** Brand logo for kind="brand" (an <img> or <svg>); without it the document icon is shown. */
  logo?: React.ReactNode;
  brandName?: string;
};
export type SourcePreviewLabels = { open: string; close: string; kinds: Record<SourceKind, string> };
export const sourcePreviewLabelsMn: SourcePreviewLabels = {
  open: "Апп-д нээх",
  close: "Хаах",
  kinds: { document: "Баримт", calendar: "Календарь", message: "Мессеж", decision: "Шийдвэр", meeting: "Уулзалт", note: "Тэмдэглэл", link: "Холбоос", brand: "Апп" },
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

// Demo data: ACME is a made-up company — 62% and every other figure here are demo numbers, not real data.
const demoSource: PreviewSource = {
  id: "retention",
  title: "Харилцагчийн хадгалалтын тайлан 2026",
  kind: "document",
  kindLabel: "Баримт · Судалгаа",
  date: "2026-11-02",
  quote: "Шинэ харилцагчдын 62% нь гурван сарын дотор багцаа ахиулсан. Ахиулалт ихэвчлэн хоёр дахь сард болдог.",
  highlight: "62% нь гурван сарын дотор",
};

/**
 * One icon per source kind. Shapes are copied from the Thinking State icon set (src/company/icons.tsx,
 * Lucide, ISC): file-text, calendar-days, message-circle, git-branch, users-round, pencil, link.
 * Stroke 1.5, currentColor — the tile and the theme give the colour.
 */
export const SOURCE_ICON: Record<Exclude<SourceKind, "brand">, React.ReactNode> = {
  document: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>,
  calendar: <><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></>,
  message: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  decision: <><path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></>,
  meeting: <><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></>,
  note: <><path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" /><path d="m15 5 4 4" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
};

/** The source-kind icon on its tile: token background, token border, currentColor glyph — the same in both themes. */
export function SourceIcon({ kind, size = 16, tile = true, logo }: { kind: SourceKind; size?: number; tile?: boolean; logo?: React.ReactNode }) {
  // A brand shows its logo; without one (demos may not name brands) it falls back to the document line icon.
  const glyph = kind === "brand" && logo
    ? <span className="sp-letter" style={{ display: "grid", placeItems: "center", width: "100%", height: "100%" }}>{logo}</span>
    : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{SOURCE_ICON[kind === "brand" ? "document" : kind]}</svg>;
  if (!tile) return glyph;
  return (
    <span
      className="sp-tile"
      style={{ display: "inline-grid", placeItems: "center", flex: "none", boxSizing: "border-box", width: size + 12, height: size + 12, border: "1px solid var(--ts-faint)", borderRadius: "var(--ts-radius, 6px)", background: "var(--ts-soft)", color: "var(--ts-fg)" }}
      aria-hidden="true"
    >
      {glyph}
    </span>
  );
}

function KindIcon({ source, size = 16 }: { source: PreviewSource; size?: number }) {
  return <SourceIcon kind={source.kind} size={size} tile={false} logo={source.logo} />;
}

function Marked({ text, mark }: { text: string; mark?: string }) {
  const i = mark ? text.indexOf(mark) : -1;
  if (!mark || i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{mark}</mark>{text.slice(i + mark.length)}</>;
}

const CSS = `
.sp{position:relative;display:inline-block;font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg)}
.sp-chip{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:inherit;font-weight:500;font-size:14px;line-height:1;cursor:pointer;max-width:280px}
.sp-chip>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sp-chip:hover{border-color:var(--ts-faint)}
.sp-chip[aria-expanded="true"]{border-color:var(--ts-electric);color:var(--ts-electric-fg)}
.sp-chip:focus-visible,.sp-open:focus-visible,.sp-x:focus-visible{outline:2px solid var(--ts-electric);outline-offset:2px}
.sp-pop{position:absolute;left:0;z-index:20;width:340px;max-width:calc(100vw - 32px);padding:16px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);box-shadow:var(--ts-elevation);animation:sp-in .16s ease-out both}
.sp-pop[data-placement="bottom"]{top:calc(100% + 8px)}.sp-pop[data-placement="top"]{bottom:calc(100% + 8px)}
@keyframes sp-in{from{opacity:0;transform:translateY(4px)}}
@media (prefers-reduced-motion:reduce){.sp-pop{animation:none}}
.sp-head{display:grid;grid-template-columns:30px 1fr auto;gap:12px;align-items:start}
.sp-tile{display:inline-grid;place-items:center;flex:none;box-sizing:border-box;border:1px solid var(--ts-faint);border-radius:var(--ts-radius,6px);background:var(--ts-soft);color:var(--ts-fg)}
.sp-letter{display:grid;place-items:center;width:100%;height:100%;font-weight:600;font-size:12px;line-height:1}
.sp-letter img,.sp-letter svg{width:100%;height:100%;object-fit:contain}
.sp-title{font-weight:600;font-size:16px;line-height:1.3;margin:0}
.sp-meta{font:400 12px/1.4 var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint);margin-top:4px}
.sp-x{width:28px;height:28px;display:grid;place-items:center;border:0;border-radius:var(--ts-radius,6px);background:none;color:var(--ts-muted);cursor:pointer}
.sp-x:hover{background:var(--ts-soft)}
.sp-quote{margin:14px 0 0;padding:0 0 0 12px;border-left:2px solid var(--ts-line);font-weight:400;font-size:14px;line-height:1.55;color:var(--ts-muted)}
.sp-quote mark{background:var(--ts-electric-soft);color:var(--ts-fg);padding:0 2px;border-radius:2px}
.sp-foot{display:flex;justify-content:flex-end;margin-top:14px}
.sp-open{display:inline-flex;align-items:stretch;min-height:44px;border:0;border-radius:var(--ts-radius,6px);background:var(--ts-electric);color:var(--ts-on-electric);font-weight:500;font-size:14px;line-height:1;cursor:pointer;padding:0 0 0 16px}
.sp-open>em{font-style:normal;display:flex;align-items:center}
.sp-open>span{display:grid;place-items:center;width:44px;margin-left:16px;border-left:1.5px solid color-mix(in srgb,var(--ts-on-electric) 40%,transparent)}
.sp-open:hover{background:color-mix(in srgb,var(--ts-electric) 88%,var(--ts-on-electric))}
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
            <SourceIcon kind={source.kind} size={18} logo={source.logo} />
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
