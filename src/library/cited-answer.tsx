"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type CitedSegment = { text: string; cite?: string[]; paragraph?: boolean };

export type CitedSource = {
  id: string;
  title: string;
  site: string;
  url?: string;
  date?: string;
  quote?: string;
  /** Words inside quote that match the answer. */
  highlight?: string;
  icon?: React.ReactNode;
};

export type CitedAnswerProps = {
  segments?: CitedSegment[];
  sources?: CitedSource[];
  pagesRead?: number;
  defaultOpen?: string;
  onOpenSource?: (source: CitedSource) => void;
  onPreviewChange?: (id: string | null) => void;
  action?: { label: string; onClick: () => void };
  className?: string;
};

const defaultSources: CitedSource[] = [
  {
    id: "tokenwise",
    title: "Промпт кэшлэх нь юу вэ",
    site: "tokenwise.dev",
    date: "2026-07-18",
    url: "https://example.com/tokenwise",
    quote:
      "Үйлчилгээ үзүүлэгч промптын боловсруулсан эхлэлийг дахин ашигладаг. 10K-аас дээш токентой промпт дээр эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог.",
    highlight: "эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог",
  },
  {
    id: "latency",
    title: "Кэшэд ээлтэй промпт зохиох",
    site: "latencynotes.io",
    date: "2026-08-02",
    url: "https://example.com/latency",
    quote:
      "Тогтвортой хэсгийг – системийн промпт, хэрэгслийн тодорхойлолт, урт баримт бичгийг – хамгийн эхэнд байрлуулж, хүсэлт бүрт өөрчлөгддөг зүйлийг ард нь тавь. Эхэнд нэг тэмдэгт өөрчлөгдөхөд араас нь бүх зүйл хүчингүй болно.",
    highlight: "хамгийн эхэнд",
  },
  {
    id: "weekly",
    title: "Үйлдвэрлэлийн орчин дахь утгын кэш",
    site: "inferenceweekly.com",
    date: "2026-09-09",
    url: "https://example.com/weekly",
    quote:
      "Ойролцоо асуултад кэшээс 40 ms орчимд хариулж, түгээмэл асуултын урсгалын бараг гуравны нэгийг хамарсан.",
    highlight: "40 ms орчимд",
  },
];

const defaultSegments: CitedSegment[] = [
  {
    text: "Хамгийн том хожил бол промпт кэшлэх: үйлчилгээ үзүүлэгч промптын боловсруулсан эхлэлийг дахин ашигладаг тул урт системийн промптыг дуудлага бүрт дахин тооцоолохгүй.",
    cite: ["tokenwise"],
  },
  { text: " 10K-аас дээш токентой промпт дээр энэ нь эхний токен хүртэлх хугацааг 80% хүртэл богиносгодог.", cite: ["tokenwise"] },
  {
    text: " Энэ нь эхлэл нь ижил байх үед л ажилладаг тул системийн промпт, хэрэгсэл, урт баримт бичгийг эхэнд, хүсэлт бүрт өөрчлөгддөг зүйлийг төгсгөлд нь тавь.",
    cite: ["latency", "tokenwise"],
  },
  {
    text: "Давтагддаг асуултад загварын өмнө утгын кэш нэм: ойролцоо асуултад хадгалсан хариултыг 40 ms орчимд өгнө,",
    cite: ["weekly"],
    paragraph: true,
  },
  { text: " энэ нь нэг үйлдвэрлэлийн орчинд түгээмэл асуултын урсгалын бараг гуравны нэгийг хамарсан.", cite: ["weekly"] },
  { text: " Үлдсэнийг урсгалаар дамжуул, ингэснээр хариулт бичигдэж байх үед хүмүүс эхний үгсийг харна." },
];

const tints = ["#eef0f3", "#e3f4e8", "#e6f1fb", "#fbefe3", "#f1e8fb"];
const inks = ["#5b5b63", "#166534", "#1d63b8", "#9a4f0c", "#6d3fb8"];

function Mark({ quote, highlight }: { quote: string; highlight?: string }) {
  const i = highlight ? quote.indexOf(highlight) : -1;
  if (!highlight || i < 0) return <>{quote}</>;
  return (
    <>
      {quote.slice(0, i)}
      <mark>{highlight}</mark>
      {quote.slice(i + highlight.length)}
    </>
  );
}

export function CitedAnswer({
  segments = defaultSegments,
  sources = defaultSources,
  pagesRead = 12,
  defaultOpen,
  onOpenSource,
  onPreviewChange,
  action = { label: "Үргэлжлүүлэн асуух", onClick: () => {} },
  className = "",
}: CitedAnswerProps) {
  const [hover, setHover] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<string | null>(defaultOpen ?? null);
  const [copied, setCopied] = React.useState(false);
  const active = hover ?? open;
  const idx = (id: string) => sources.findIndex((s) => s.id === id);
  const openSrc = sources.find((s) => s.id === open);
  const activeSrc = sources.find((s) => s.id === active);
  const citedIn = (id: string) => segments.filter((s) => s.cite?.[0] === id || s.cite?.includes(id)).length;

  const toggle = (id: string) => {
    const next = open === id ? null : id;
    setOpen(next);
    onPreviewChange?.(next);
  };

  const paragraphs: CitedSegment[][] = [];
  segments.forEach((s, i) => {
    if (i === 0 || s.paragraph) paragraphs.push([]);
    paragraphs[paragraphs.length - 1].push(s);
  });

  const Badge = ({ id, size = "s" }: { id: string; size?: "s" | "m" }) => {
    const n = idx(id);
    const src = sources[n];
    return (
      <span
        className={`ca-badge ca-badge-${size}`}
        style={{ background: tints[n % tints.length], color: inks[n % inks.length] }}
        aria-hidden="true"
      >
        {src?.icon ?? (src ? initial(src) : "?")}
      </span>
    );
  };

  const initial = (s: CitedSource) => s.site.charAt(0).toUpperCase();

  return (
    <section className={`ca ${active ? "ca-focus" : ""} ${className}`}>
      <style>{css}</style>
      <div className="ca-body">
        <div className="ca-head">
          <span className="ca-stack">
            {sources.map((s, n) => (
              <span key={s.id} className="ca-badge ca-badge-s" style={{ background: tints[n % tints.length], color: inks[n % inks.length] }}>
                {s.icon ?? initial(s)}
              </span>
            ))}
          </span>
          {sources.length} эх сурвалж{pagesRead ? ` · ${pagesRead} хуудас уншсан` : ""}
        </div>
        <div className="ca-prose">
          {paragraphs.map((p, i) => (
            <p key={i}>
              {p.map((s, j) => {
                const lit = !!active && !!s.cite?.includes(active);
                const lead = s.text.match(/^\s*/)?.[0] ?? "";
                const body = s.text.slice(lead.length);
                return (
                  <React.Fragment key={j}>
                    {lead}
                    <span className={`ca-seg ${lit ? "lit" : ""}`}>{body}</span>
                    {s.cite?.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`ca-num ${active === c ? "on" : ""}`}
                        aria-label={`Эх сурвалж ${idx(c) + 1}: ${sources[idx(c)]?.title ?? c}`}
                        onMouseEnter={() => setHover(c)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(c)}
                        onBlur={() => setHover(null)}
                        onClick={() => toggle(c)}
                      >
                        {idx(c) + 1}
                      </button>
                    ))}
                  </React.Fragment>
                );
              })}
            </p>
          ))}
        </div>
        <div className="ca-chips">
          {sources.map((s, n) => (
            <button
              key={s.id}
              type="button"
              className={`ca-chip ${active === s.id ? "on" : ""}`}
              aria-expanded={open === s.id}
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(s.id)}
              onBlur={() => setHover(null)}
              onClick={() => toggle(s.id)}
            >
              <span className="ca-badge ca-badge-s" style={{ background: tints[n % tints.length], color: inks[n % inks.length] }}>
                {s.icon ?? initial(s)}
              </span>
              {s.site}
              <span className="ca-chip-n">{n + 1}</span>
            </button>
          ))}
        </div>
        {openSrc && (
          <div className="ca-preview" role="region" aria-label={openSrc.title}>
            <div className="ca-pv-meta">
              <Badge id={openSrc.id} />
              <span>{openSrc.site}</span>
              {openSrc.date && <span className="ca-faint">· {openSrc.date}</span>}
              <span className="ca-pv-n">{idx(openSrc.id) + 1}</span>
            </div>
            <div className="ca-pv-title">{openSrc.title}</div>
            {openSrc.quote && (
              <p className="ca-pv-quote">
                <Mark quote={openSrc.quote} highlight={openSrc.highlight} />
              </p>
            )}
            <div className="ca-pv-actions">
              <a
                href={openSrc.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  if (onOpenSource) {
                    e.preventDefault();
                    onOpenSource(openSrc);
                  }
                }}
              >
                Эх сурвалжийг нээх
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5h6.5V10M12.5 3.5 4 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(openSrc.quote ?? "").catch(() => {});
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1400);
                }}
              >
                {copied ? "Хуулсан" : "Ишлэл хуулах"}
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="ca-foot">
        <span className="ca-foot-l">
          {activeSrc ? (
            <>
              {activeSrc.site}
              <span className="ca-faint"> · {citedIn(activeSrc.id)} өгүүлбэрт иш татсан</span>
            </>
          ) : (
            <span className="ca-faint">Эх сурвалжийг харах бол дугаар дээр очно уу</span>
          )}
        </span>
        {action && (
          <button type="button" className="ca-action" onClick={action.onClick}>
            {action.label}
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </footer>
    </section>
  );
}

const css = `
.ca{--ca-bg:#fff;--ca-fg:#18181b;--ca-muted:#65656d;--ca-faint:#65656d;--ca-line:#ececef;--ca-chip:#f4f4f5;--ca-lit:#e8f1fd;--ca-accent:#3b82f6;--ca-mark:#fdf0b8;width:100%;max-width:442px;background:var(--ca-bg);color:var(--ca-fg);border:1px solid var(--ca-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.57 Inter,system-ui,sans-serif;overflow:hidden}
:where(.dark,[data-theme=dark]) .ca{--ca-bg:#1b1b1e;--ca-fg:#ececef;--ca-muted:#a1a1aa;--ca-faint:#9a9aa2;--ca-line:#2e2e33;--ca-chip:#2a2a2f;--ca-lit:#1d3150;--ca-accent:#6aa3ff;--ca-mark:#5a4a12;color-scheme:dark}
.ca *{box-sizing:border-box}.ca button{font:inherit;color:inherit;cursor:pointer}
.ca-body{padding:14px 20px 16px}
.ca-head{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ca-muted);margin-bottom:12px}
.ca-stack{display:flex}.ca-stack .ca-badge{margin-right:-2px;box-shadow:0 0 0 1.5px var(--ca-bg)}
.ca-badge{display:inline-grid;place-items:center;width:14px;height:14px;border-radius:3px;font-size:8.5px;font-weight:600;flex:none}
.ca-prose p{margin:0 0 10px}.ca-prose p:last-child{margin:0}
.ca-seg{transition:color .2s,background .2s;border-radius:3px}
.ca-focus .ca-seg{color:var(--ca-faint)}
.ca-focus .ca-seg.lit{color:var(--ca-fg);background:var(--ca-lit);box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:1px 2px;margin:0 -2px}
.ca-num{display:inline-grid;place-items:center;min-width:15px;height:15px;margin:0 2px 0 3px;padding:0 3px;vertical-align:1px;border:0;border-radius:3px;background:var(--ca-chip);font-size:10px!important;line-height:1;color:var(--ca-muted)!important;transition:background .15s}
.ca-num:hover,.ca-num.on{background:color-mix(in srgb,var(--ca-fg) 16%,transparent);color:var(--ca-fg)!important}
.ca-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:16px;margin-left:-6px}
.ca-chip{display:inline-flex;align-items:center;gap:7px;flex:none;white-space:nowrap;height:28px;padding:0 8px 0 6px;border:1px solid transparent;border-radius:6px;background:none;font-size:12.5px!important;color:var(--ca-muted)!important;transition:background .15s,border-color .15s,color .15s}
.ca-focus .ca-chip{color:var(--ca-faint)!important}
.ca-chip:hover,.ca-chip.on,.ca-focus .ca-chip.on{background:var(--ca-chip);border-color:var(--ca-line);color:var(--ca-fg)!important}
.ca-chip-n{font-size:10.5px;color:var(--ca-faint)}
.ca-preview{margin-top:10px;padding:12px 14px;border:1px solid var(--ca-line);border-radius:10px;background:color-mix(in srgb,var(--ca-chip) 45%,var(--ca-bg));animation:ca-in .2s both}
.ca-pv-meta{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ca-muted)}
.ca-pv-n{margin-left:auto;font-size:11px;color:var(--ca-faint)}
.ca-pv-title{font-weight:500;margin:6px 0 4px}
.ca-pv-quote{margin:0;font-size:13px;color:var(--ca-muted);line-height:1.55}
.ca-pv-quote mark{background:var(--ca-mark);color:var(--ca-fg);border-radius:2px;padding:0 1px}
.ca-pv-actions{display:flex;gap:6px;margin-top:10px}
.ca-pv-actions a,.ca-pv-actions button{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 9px;border:1px solid var(--ca-line);border-radius:6px;background:var(--ca-bg);font-size:12px;color:var(--ca-fg);text-decoration:none}
.ca-pv-actions svg{width:12px;height:12px}
.ca-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 8px 8px 20px;border-top:1px solid var(--ca-line);font-size:12.5px}
.ca-foot-l{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ca-faint{color:var(--ca-faint)}
.ca-action{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 10px;border:1px solid var(--ca-line);border-radius:7px;background:var(--ca-bg);font-size:13.5px!important;font-weight:500;box-shadow:0 1px 1px #00000008}
.ca-action:hover{background:var(--ca-chip)}.ca-action svg{width:14px;height:14px;color:var(--ca-muted)}
.ca :focus-visible{outline:2px solid var(--ca-accent);outline-offset:2px}
@keyframes ca-in{from{opacity:0;transform:translateY(-3px)}}
@media(max-width:480px){.ca-body{padding:12px 16px 14px}.ca-foot{padding-left:16px}}
@media(prefers-reduced-motion:reduce){.ca *{animation:none!important;transition:none!important}}
.ca-action{white-space:nowrap;font-size:13px!important}
`;

export default CitedAnswer;
