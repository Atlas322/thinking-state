/**
 * EntityMention (2026-11-17, screens.21): an @mention inside an answer — a person, a branch, a
 * channel — with a small card on hover or keyboard focus, and on tap on a phone. The card follows
 * SourcePreview's popover (same surface, line, radius, elevation, and the bottom sheet under
 * 480 px), but is built from spans so it sits inside a sentence (<p>) as valid HTML.
 * Card: name, type, 2–3 lines, and the brain note it comes from.
 *
 *   <EntityMention mention={{ name: "Салбар 07", type: "салбар", lines: ["Менежер: …"], sourceNote: "Салбарын бүртгэл" }} />
 */
import * as React from "react";
import { createPortal } from "react-dom";

export type Mention = {
  name: string;
  /** What it is, e.g. «ажилтан», «салбар», «борлуулалтын суваг». */
  type: string;
  /** Two or three short lines: role, last action, state. */
  lines?: string[];
  /** The brain note it comes from. */
  sourceNote?: string;
};
export type EntityMentionProps = { mention: Mention; onOpenNote?: (m: Mention) => void; className?: string };

const CSS = `
.em{position:relative;display:inline}
.em-chip{display:inline;padding:1px 5px;margin:0 1px;border:0;border-radius:var(--ts-radius,6px);background:var(--ts-electric-soft,color-mix(in srgb,var(--ts-electric) 12%,transparent));color:var(--ts-electric-fg,var(--ts-electric));font:inherit;font-weight:500;line-height:inherit;cursor:pointer;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.em-chip:hover,.em-chip[aria-expanded="true"]{background:color-mix(in srgb,var(--ts-electric) 20%,transparent)}
.em-chip:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.em-pop{position:fixed;z-index:1000;display:block;width:280px;max-width:calc(100vw - 32px);padding:14px 16px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);box-shadow:var(--ts-elevation);color:var(--ts-fg);font:400 13px/1.45 var(--ts-font,Inter,system-ui,sans-serif);text-align:left;white-space:normal;animation:em-in var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-enter,ease) both}
@keyframes em-in{from{opacity:0;transform:translateY(4px)}}
.em-pop>span{display:block}
.em-name{font-weight:600;font-size:15px;line-height:1.3}
.em-type{margin-top:2px;font:400 11px/1.4 var(--ts-font-mono,monospace);letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint)}
.em-lines{margin-top:10px;color:var(--ts-muted)}.em-lines>span{display:block}
.em-note{margin-top:10px;padding-top:8px;border-top:1px solid var(--ts-line);font-size:12px;color:var(--ts-faint)}
.em-note button{border:0;background:none;padding:0;font:inherit;color:var(--ts-electric-fg,var(--ts-electric));cursor:pointer;text-decoration:underline;text-underline-offset:2px}
@media (max-width:480px){.em-pop{left:16px!important;right:16px;bottom:16px;top:auto!important;width:auto;max-width:none}}
@media (prefers-reduced-motion:reduce){.em-pop{animation:none}}
`;

export function EntityMention({ mention = entityMentionDemo.mention, onOpenNote, className = "" }: Partial<EntityMentionProps>) {
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLSpanElement>(null);
  const chip = React.useRef<HTMLButtonElement>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const id = React.useId();
  const hold = (v: boolean, ms = 0) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setOpen(v), ms); };
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); chip.current?.focus(); } };
    const onDown = (e: PointerEvent) => { const t = e.target as Node; if (root.current && !root.current.contains(t) && !document.getElementById(id)?.contains(t)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open, id]);
  const mouse = (e: React.PointerEvent) => e.pointerType === "mouse";
  // The card goes to <body> (a portal) so no scroll box or container query clips it; it keeps the
  // page theme of the chip and sits under the chip, inside the viewport (16px gutter).
  const [pos, setPos] = React.useState<{ left: number; top: number; theme?: string; dark: boolean } | null>(null);
  React.useLayoutEffect(() => {
    if (!open || !chip.current) return;
    const place = () => {
      const r = chip.current!.getBoundingClientRect();
      const host = chip.current!.closest("[data-ts-theme]");
      setPos({ left: Math.max(16, Math.min(r.left, window.innerWidth - 296)), top: r.bottom + 6, theme: host?.getAttribute("data-ts-theme") ?? undefined, dark: !!chip.current!.closest(".dark,[data-theme=dark]") });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => { window.removeEventListener("scroll", place, true); window.removeEventListener("resize", place); };
  }, [open]);
  return (
    <span ref={root} className={`em ${className}`} onPointerEnter={(e) => mouse(e) && hold(true, 120)} onPointerLeave={(e) => mouse(e) && hold(false, 160)}>
      <style>{CSS}</style>
      <button ref={chip} type="button" className="em-chip" aria-expanded={open} aria-controls={id} aria-label={`${mention.name} · ${mention.type}`}
        onFocus={() => hold(true)} onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) hold(false, 100); }} onClick={() => hold(!open)}>
        @{mention.name}
      </button>
      {open && pos && createPortal(
        <span className={pos.dark ? "dark" : undefined} data-ts-theme={pos.theme} data-theme={pos.dark ? "dark" : undefined} onPointerEnter={() => hold(true)} onPointerLeave={() => hold(false, 160)}>
        <style>{CSS}</style>
        <span id={id} className="em-pop" role="dialog" aria-label={mention.name} style={{ left: pos.left, top: pos.top }}>
          <span className="em-name">{mention.name}</span>
          <span className="em-type">{mention.type}</span>
          {mention.lines?.length ? <span className="em-lines">{mention.lines.slice(0, 3).map((l) => <span key={l}>{l}</span>)}</span> : null}
          {mention.sourceNote && (
            <span className="em-note">Эх: {onOpenNote ? <button type="button" onClick={() => onOpenNote(mention)}>{mention.sourceNote}</button> : mention.sourceNote}</span>
          )}
        </span>
        </span>,
        document.body,
      )}
    </span>
  );
}

/** Splits text at "@Name" for the given mentions (longest names first) and renders the chips. */
export function withMentions(text: string, mentions: Mention[] | undefined, onOpenNote?: (m: Mention) => void): React.ReactNode {
  if (!mentions?.length || !text.includes("@")) return text;
  const byName = new Map(mentions.map((m) => [m.name, m]));
  const names = [...byName.keys()].sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`@(${names.join("|")})`, "g");
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push(<EntityMention key={`${m.index}-${m[1]}`} mention={byName.get(m[1])!} onOpenNote={onOpenNote} />);
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** ac.me demo: a branch and its manager (made-up company and names). */
export const entityMentionDemo: EntityMentionProps & { mention: Mention } = {
  mention: { name: "Салбар 07", type: "салбар", lines: ["Менежер: салбарын менежер", "Сүүлийн тайлан: 10-р сар", "Төлөв: туршилтын салбар"], sourceNote: "Салбарын бүртгэл" },
};

/** Catalog preview: a sentence with one mention. */
export default function EntityMentionDemo() {
  return <p style={{ fontFamily: "var(--ts-font)", fontSize: 15, color: "var(--ts-fg)" }}>Дээд багцын үнэ хэвээр; <EntityMention {...entityMentionDemo} /> туршина.</p>;
}
