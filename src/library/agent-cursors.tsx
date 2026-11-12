"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type CursorAgent = {
  id: string;
  name: string;
  color?: string;
  cost?: number;
  avatar?: React.ReactNode;
};

export type DocSuggestion = {
  id: string;
  agent: string;
  block: string;
  at: number;
  remove?: string;
  insert?: string;
  note?: string;
};

export type DocBlock = {
  id: string;
  kind?: "title" | "heading" | "paragraph" | "item" | "code" | "image";
  text?: string;
  float?: "left" | "right";
};

export type AgentCursor = { block: string; at?: number; doing?: string; typing?: boolean } | null;

export type DocComment = { id: string; agent: string; block: string; text: string };

export type AgentCursorsProps = {
  title?: string;
  agents?: CursorAgent[];
  blocks?: DocBlock[];
  suggestions?: DocSuggestion[];
  cursors?: Record<string, AgentCursor>;
  comments?: DocComment[];
  tabs?: { id: string; label: string }[];
  tab?: string;
  onTabChange?: (id: string) => void;
  following?: string | null;
  onFollowingChange?: (id: string | null) => void;
  onAccept?: (s: DocSuggestion) => void;
  onReject?: (s: DocSuggestion) => void;
  onAcceptAll?: () => void;
  onResolveComment?: (c: DocComment) => void;
  formatCost?: (n: number) => string;
  height?: number;
  className?: string;
};

/** Neutral role glyphs, no brand marks. */
const marks: Record<string, React.ReactNode> = {
  researcher: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="#e8703c" strokeWidth="1.6" />
      <path d="m10.2 10.2 3.6 3.6" stroke="#e8703c" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  designer: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2 14 13H2Z" fill="none" stroke="#5b8def" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  coder: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4" fill="none" stroke="#f2a33a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  writer: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 13l1-3.5 7-7 2.5 2.5-7 7Z M9.5 4l2.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
};

/** `cost` is spend in thousands of tokens. */
const defaultAgents: CursorAgent[] = [
  { id: "researcher", name: "Судлаач", cost: 36 },
  { id: "designer", name: "Дизайнер", cost: 23 },
  { id: "coder", name: "Кодлогч", cost: 23 },
  { id: "writer", name: "Бичигч", cost: 10 },
];

const defaultBlocks: DocBlock[] = [
  { id: "title", kind: "title", text: "Пульс 2.0 – нээлтийн товчоо" },
  {
    id: "lede",
    kind: "paragraph",
    text: "Багууд долоо хоногийнхоо 38%-ийг явцын тайланд зарцуулдаг. Пульс энэ ажлыг өдөр бүрийн богино товчоо болгож, хэн ч бичих шаардлагагүй болгоно.",
  },
  { id: "img", kind: "image", float: "left" },
  {
    id: "hero",
    kind: "paragraph",
    text: "Гол дүр нь товчоо өөрөө: багийн ахлагч даваа гарагийн өглөө уншдаг нэг тайван дэлгэц. Богино, шинэлэг, ажлаас нь бичигдсэн тул долоо хоног явцын хуралгүй эхэлнэ.",
  },
  { id: "rollout", kind: "heading", text: "Нэвтрүүлэлт" },
  {
    id: "code",
    kind: "code",
    text: "const rollout = {\n  waitlist: \"11/3\",\n  everyone: \"11-р сарын хоёр дахь долоо хоног\",\n};",
  },
  { id: "launch", kind: "paragraph", text: "Нээлтийн долоо хоног: нэг богино пост, демо бичлэг, хүлээлгийн жагсаалт руу имэйл." },
  { id: "ships", kind: "heading", text: "Юу гарах вэ" },
  { id: "i1", kind: "item", text: "Төсөл бүрт өдөр тутмын товчоо, ажлаас нь шууд бичигдэнэ" },
  { id: "i2", kind: "item", text: "Даалгавар удаан чимээгүй байвал сануулга" },
];

const defaultSuggestions: DocSuggestion[] = [
  { id: "s1", agent: "writer", block: "title", at: 21, remove: "товчоо", insert: "төлөвлөгөө", note: "Нэвтрүүлэлтийн хэсэгт төлөвлөгөө гэдэг нь тохирно" },
  { id: "s2", agent: "coder", block: "code", at: 51, remove: "11-р сарын хоёр дахь долоо хоног", insert: "11/10", note: "Хүлээлгийн жагсаалтын огноотой ижил формат" },
];

const defaultComments: DocComment[] = [
  { id: "c1", agent: "coder", block: "rollout", text: 'Хүлээлгийн жагсаалт ба бүх хэрэглэгчид нэг огнооны формат хэрэглэх үү? Би хаа сайгүй "11/3" гэж бичье.' },
  { id: "c2", agent: "researcher", block: "lede", text: "3-р улирлын 1,240 багийн судалгаа: 40% биш, 38%." },
];

const defaultCursors: Record<string, AgentCursor> = {
  researcher: { block: "lede", at: 25, doing: "тоо шалгаж байна" },
  designer: { block: "img", doing: "хэмжээ өөрчилж байна" },
  coder: { block: "code", at: 86 },
  writer: { block: "title", at: 27, typing: true },
};

const Pointer = ({ agent, doing }: { agent: CursorAgent; doing?: string }) => (
  <span className="acu-ptr" aria-hidden="true" style={{ "--acu-c": agent.color ?? "var(--acu-ink)" } as React.CSSProperties}>
    <svg viewBox="0 0 16 16">
      <path d="M2.6 1.8c-.5-.2-1 .3-.8.8l4.3 11.2c.2.5.9.5 1.1 0l1.6-4.2 4.2-1.6c.5-.2.5-.9 0-1.1Z" fill="var(--acu-c)" stroke="var(--acu-bg)" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
    <span className="acu-flag">
      <span className="acu-flag-mark">{agent.avatar ?? marks[agent.id]}</span>
      {agent.name}
      {doing && <span className="acu-doing">{doing}</span>}
    </span>
  </span>
);

export function AgentCursors({
  title = "Бүтээгдэхүүн / Нээлтүүд",
  agents = defaultAgents,
  blocks = defaultBlocks,
  suggestions: suggestionsProp = defaultSuggestions,
  cursors = defaultCursors,
  comments: commentsProp = defaultComments,
  tabs = [
    { id: "doc", label: "Баримт" },
    { id: "table", label: "Хүснэгт" },
  ],
  tab: tabProp,
  onTabChange,
  following: followingProp,
  onFollowingChange,
  onAccept,
  onReject,
  onAcceptAll,
  onResolveComment,
  formatCost = (n) => `${Math.round(n)}k токен`,
  height = 560,
  className = "",
}: AgentCursorsProps) {
  const [tabState, setTab] = React.useState(tabs[0]?.id);
  const tab = tabProp ?? tabState;
  const [followState, setFollow] = React.useState<string | null>(null);
  const following = followingProp !== undefined ? followingProp : followState;
  const [suggestions, setSuggestions] = React.useState(suggestionsProp);
  const [comments, setComments] = React.useState(commentsProp);
  const [open, setOpen] = React.useState<string | null>(null);
  const [typed, setTyped] = React.useState(0);
  React.useEffect(() => setSuggestions(suggestionsProp), [suggestionsProp]);
  React.useEffect(() => setComments(commentsProp), [commentsProp]);

  // the first suggestion is "typed" letter by letter
  const firstInsert = suggestions[0]?.insert ?? "";
  React.useEffect(() => {
    if (typed >= firstInsert.length) return;
    const id = window.setTimeout(() => setTyped((n) => n + 1), 180);
    return () => window.clearTimeout(id);
  }, [typed, firstInsert]);

  const total = agents.reduce((n, a) => n + (a.cost ?? 0), 0);
  const byId = (id: string) => agents.find((a) => a.id === id);
  const toggleFollow = (id: string) => {
    const next = following === id ? null : id;
    setFollow(next);
    onFollowingChange?.(next);
  };
  const decide = (s: DocSuggestion, ok: boolean) => {
    setSuggestions((list) => list.filter((x) => x.id !== s.id));
    setOpen(null);
    (ok ? onAccept : onReject)?.(s);
  };

  const pointersFor = (blockId: string, at?: number) =>
    agents
      .filter((a) => {
        const c = cursors[a.id];
        return c && c.block === blockId && (at === undefined ? c.at === undefined : c.at === at);
      })
      .map((a) => (
        <span key={a.id} className={`acu-anchor${following && following !== a.id ? " is-dim" : ""}`}>
          <Pointer agent={a} doing={cursors[a.id]?.doing} />
        </span>
      ));

  const renderText = (b: DocBlock) => {
    const text = b.text ?? "";
    const sugs = suggestions.filter((s) => s.block === b.id).sort((x, y) => x.at - y.at);
    const cursorAts = agents.map((a) => cursors[a.id]).filter((c) => c && c.block === b.id && c.at !== undefined).map((c) => c!.at!);
    const cuts = Array.from(new Set([0, text.length, ...cursorAts, ...sugs.flatMap((s) => [s.at, s.at + (s.remove?.length ?? 0)])]))
      .filter((n) => n <= text.length)
      .sort((x, y) => x - y);
    const out: React.ReactNode[] = [];
    for (let i = 0; i < cuts.length; i++) {
      const at = cuts[i];
      out.push(<React.Fragment key={`p${at}`}>{pointersFor(b.id, at)}</React.Fragment>);
      const sug = sugs.find((s) => s.at === at);
      if (sug) {
        const a = byId(sug.agent);
        const ins = sug === suggestions[0] ? (sug.insert ?? "").slice(0, typed) : sug.insert;
        out.push(
          <span key={`s${sug.id}`} className="acu-sug-wrap">
            <span
              role="button"
              tabIndex={0}
              className="acu-sug"
              aria-label={`${a?.name ?? sug.agent} suggests ${sug.remove ? `replacing ${sug.remove} with` : "adding:"} ${sug.insert ?? ""}`}
              onClick={() => setOpen(open === sug.id ? null : sug.id)}
              onFocus={() => setOpen(sug.id)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(null)}
            >
              {sug.remove && <del>{sug.remove}</del>}
              {ins && <ins>{ins}</ins>}
            </span>
            {open === sug.id && (
              <span role="dialog" aria-label={`Suggestion from ${a?.name}`} className="acu-pop">
                <span className="acu-pop-who">
                  <span className="acu-face sm">{marks[sug.agent]}</span>
                  {a?.name}
                </span>
                {sug.note && <span className="acu-pop-note">{sug.note}</span>}
                <span className="acu-pop-act">
                  <button type="button" onClick={() => decide(sug, false)}>Reject</button>
                  <button type="button" className="is-dark" onClick={() => decide(sug, true)}>Accept</button>
                </span>
              </span>
            )}
          </span>,
        );
        continue;
      }
      const inside = sugs.some((s) => at > s.at && at < s.at + (s.remove?.length ?? 0));
      const next = cuts[i + 1];
      if (next !== undefined && !inside && !sugs.some((s) => at >= s.at && at < s.at + (s.remove?.length ?? 0)))
        out.push(<React.Fragment key={`t${at}`}>{text.slice(at, next)}</React.Fragment>);
    }
    return out;
  };

  const pinsFor = (blockId: string) =>
    comments
      .filter((c) => c.block === blockId)
      .map((c) => {
        const a = byId(c.agent);
        return (
          <span key={c.id} className="acu-pin" tabIndex={0} aria-label={`Comment from ${a?.name}: ${c.text}`}>
            <span className="acu-pin-mark">{marks[c.agent]}</span>
            <span className="acu-pin-card">
              <span className="acu-pin-head">
                <b>{a?.name}</b>
                <span>now</span>
                <button
                  type="button"
                  aria-label="Resolve"
                  onClick={() => {
                    setComments((l) => l.filter((x) => x.id !== c.id));
                    onResolveComment?.(c);
                  }}
                >
                  <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </button>
              </span>
              {c.text}
            </span>
          </span>
        );
      });

  const doc: React.ReactNode[] = [];
  let list: React.ReactNode[] = [];
  const flush = () => {
    if (list.length) doc.push(<ul key={`ul${doc.length}`}>{list}</ul>);
    list = [];
  };
  blocks.forEach((b) => {
    if (b.kind !== "item") flush();
    const pins = pinsFor(b.id);
    const body = renderText(b);
    switch (b.kind) {
      case "title":
        doc.push(<h2 key={b.id} className="acu-title">{pins}{body}</h2>);
        break;
      case "heading":
        doc.push(<h3 key={b.id} className="acu-h">{pins}{body}</h3>);
        break;
      case "code":
        doc.push(<pre key={b.id} className="acu-code">{pins}{body}</pre>);
        break;
      case "image":
        doc.push(
          <div key={b.id} className={`acu-img is-${b.float ?? "left"}`} role="img" aria-label="Image placeholder">
            {pointersFor(b.id)}
          </div>,
        );
        break;
      case "item":
        list.push(<li key={b.id}>{pins}{body}</li>);
        break;
      default:
        doc.push(<p key={b.id} className="acu-p">{pins}{body}</p>);
    }
  });
  flush();

  return (
    <div className={`acu ${className}`}>
      <style>{css}</style>
      {tabs.length > 1 && (
        <div className="acu-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id);
                onTabChange?.(t.id);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <section className="acu-card">
        <header className="acu-head">
          <svg className="acu-doc" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 1.8h5.2L12.5 5v9.2H4Z M9 2v3.3h3.3M6 8h4.5M6 10.5h4.5" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          </svg>
          <span className="acu-name">{title}</span>
          <span className="acu-faces">
            {agents.map((a) => (
              <button
                key={a.id}
                type="button"
                className="acu-face"
                aria-pressed={following === a.id}
                aria-label={`${a.name}${cursors[a.id]?.doing ? `, ${cursors[a.id]!.doing}` : ""}`}
                title={a.name}
                onClick={() => toggleFollow(a.id)}
              >
                {a.avatar ?? marks[a.id] ?? a.name[0]}
              </button>
            ))}
          </span>
          {suggestions.length > 0 && (
            <span className="acu-count">
              {suggestions.length} suggestion{suggestions.length === 1 ? "" : "s"}
            </span>
          )}
          <b className="acu-total">{formatCost(total)}</b>
          {suggestions.length > 1 && (
            <button
              type="button"
              className="acu-all"
              onClick={() => {
                setSuggestions([]);
                onAcceptAll?.();
              }}
            >
              Accept all
            </button>
          )}
        </header>
        <div className="acu-page" style={{ height }} aria-live="polite">
          {tab === tabs[0]?.id ? (
            doc
          ) : (
            <table className="acu-table">
              <thead>
                <tr><th>Agent</th><th>Doing</th><th>Cost</th></tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.id}>
                    <td><span className="acu-face sm">{marks[a.id]}</span>{a.name}</td>
                    <td>{cursors[a.id]?.doing ?? (cursors[a.id] ? "Editing" : "Away")}</td>
                    <td>{formatCost(a.cost ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

const css = `
.acu{--acu-bg:#fff;--acu-fg:#18181b;--acu-muted:#71717a;--acu-faint:#a1a1aa;--acu-line:#ececef;--acu-soft:#f4f4f5;--acu-ink:#18181b;--acu-flag:#18181b;--acu-flag-fg:#fafafa;--acu-edge:linear-gradient(90deg,#f472b6,#60a5fa);--acu-sug:#18181b;width:100%;max-width:700px;color:var(--acu-fg);font:400 14px/1.6 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .acu{--acu-bg:#1b1b1e;--acu-fg:#ececef;--acu-muted:#a1a1aa;--acu-faint:#71717a;--acu-line:#2e2e33;--acu-soft:#26262b;--acu-ink:#ececef;--acu-flag:#f4f4f5;--acu-flag-fg:#18181b;--acu-sug:#ececef;color-scheme:dark}
.acu *{box-sizing:border-box}.acu button{font:inherit;color:inherit;cursor:pointer}
.acu-tabs{display:flex;gap:6px;margin-bottom:8px}
.acu-tabs button{height:30px;padding:0 10px;border:1px solid transparent;border-radius:8px;background:var(--acu-soft);color:var(--acu-muted);font-size:14px}
.acu-tabs button[aria-selected=true]{background:var(--acu-bg);border-color:var(--acu-line);color:var(--acu-fg)}
.acu-card{background:var(--acu-bg);border:1px solid var(--acu-line);border-radius:12px;box-shadow:0 1px 2px #0000000a;overflow:hidden}
.acu-head{display:flex;align-items:center;gap:8px;height:44px;padding:0 6px 0 14px;border-bottom:1px solid var(--acu-line);font-size:14px}
.acu-doc{width:16px;height:16px;color:var(--acu-muted);flex:none}
.acu-name{color:var(--acu-muted);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acu-faces{display:flex;gap:2px}
.acu-face{position:relative;display:grid;place-items:center;width:24px;height:24px;padding:0;border:0;border-radius:50%;background:none;color:var(--acu-muted)}
.acu-face svg{width:13px;height:13px}.acu-face.sm{display:inline-grid;width:18px;height:18px;vertical-align:-4px;margin-right:6px}
.acu-face::after{content:"";position:absolute;inset:1px;border-radius:50%;border:1.5px solid transparent;border-top-color:currentColor;opacity:.35;animation:acu-spin 1.6s linear infinite}
.acu-face[aria-pressed=true]{background:var(--acu-soft)}
.acu-count{font-size:13px;color:var(--acu-muted);white-space:nowrap}
.acu-total{font-weight:500;font-size:13px}
.acu-all{height:30px;padding:0 10px;border:0;border-radius:7px;background:var(--acu-fg);color:var(--acu-bg)!important;font-size:14px}
.acu-page{position:relative;overflow:hidden;padding:34px 44px 0;-webkit-mask-image:linear-gradient(#000 70%,transparent);mask-image:linear-gradient(#000 70%,transparent)}
.acu-page::after{content:"";display:block;clear:both}
.acu-title{position:relative;margin:0 0 12px;font-size:20px;font-weight:500;letter-spacing:-.01em;line-height:1.4}
.acu-h{position:relative;margin:24px 0 8px;font-size:15px;font-weight:500;clear:both}
.acu-p{position:relative;margin:0 0 18px;font-size:14px;line-height:1.6}
.acu-img{position:relative;width:220px;height:88px;margin:0 24px 14px 0;border-radius:6px;background:linear-gradient(110deg,var(--acu-soft) 30%,color-mix(in srgb,var(--acu-soft) 50%,var(--acu-line)) 50%,var(--acu-soft) 70%);background-size:300% 100%;animation:acu-shimmer 2.4s linear infinite}
.acu-img.is-left{float:left}.acu-img.is-right{float:right;margin:0 0 14px 24px}
.acu-img .acu-anchor{position:absolute;right:-2px;bottom:-2px}
.acu-code{position:relative;margin:0 0 22px;padding:12px 14px;border:1px solid var(--acu-line);border-radius:6px;background:color-mix(in srgb,var(--acu-soft) 55%,var(--acu-bg));font:400 12.5px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap}
.acu ul{margin:0 0 16px;padding-left:20px;color:var(--acu-muted)}.acu li{position:relative;margin:0 0 4px}
.acu-sug-wrap{position:relative}
.acu-sug{cursor:pointer;border-radius:2px}.acu-sug:focus-visible{outline:2px solid var(--acu-sug);outline-offset:1px}
.acu-sug del{color:var(--acu-faint);text-decoration:line-through}
.acu-sug ins{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px;background:color-mix(in srgb,var(--acu-sug) 9%,transparent);color:var(--acu-sug);animation:acu-fade .3s both}
.acu-pop{position:absolute;left:0;top:calc(100% + 6px);z-index:5;display:flex;flex-direction:column;gap:6px;width:230px;padding:10px 12px;border:1px solid var(--acu-line);border-radius:10px;background:var(--acu-bg);box-shadow:0 8px 24px #0000001a;font:400 13px/1.45 Inter,system-ui,sans-serif;color:var(--acu-fg);white-space:normal}
.acu-pop-who{display:flex;align-items:center;font-weight:500}.acu-pop-note{color:var(--acu-muted)}
.acu-pop-act{display:flex;gap:6px;justify-content:flex-end}
.acu-pop-act button{height:26px;padding:0 9px;border:1px solid var(--acu-line);border-radius:6px;background:var(--acu-bg);font-size:12.5px}
.acu-pop-act .is-dark{background:var(--acu-fg);color:var(--acu-bg)!important;border-color:var(--acu-fg)}
.acu-anchor{position:relative;display:inline-block;width:0;height:1em;vertical-align:-.15em;transition:opacity .2s}
.acu-anchor.is-dim{opacity:.25}
.acu-anchor::before{content:"";position:absolute;left:-1px;top:-.1em;width:2px;height:1.25em;border-radius:1px;background:var(--acu-ink)}
.acu-ptr{position:absolute;left:0;top:.95em;z-index:3;display:flex;align-items:flex-start;pointer-events:none;animation:acu-pop .25s both}
.acu-ptr>svg{width:16px;height:16px;filter:drop-shadow(0 1px 1px #0003)}
.acu-flag{display:inline-flex;align-items:center;gap:5px;margin:12px 0 0 -2px;padding:2px 8px 2px 4px;border-radius:7px;background:var(--acu-flag);color:var(--acu-flag-fg);font:500 12px/18px Inter,system-ui,sans-serif;white-space:nowrap;box-shadow:inset 0 -2px 0 -0px transparent;position:relative;overflow:hidden}
.acu-flag::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--acu-edge)}
.acu-flag-mark{display:grid;place-items:center;width:14px;height:14px}.acu-flag-mark svg{width:12px;height:12px}
.acu-doing{opacity:.65;font-weight:400;animation:acu-slide .3s both}
.acu-pin{position:absolute;left:-40px;top:.2em;z-index:4;display:grid;place-items:center;width:28px;height:28px;border-radius:50% 50% 50% 4px;background:var(--acu-flag);font-size:13px;font-weight:400;line-height:1.45;letter-spacing:0;white-space:normal;cursor:default}
.acu-pin-mark{display:grid;place-items:center}.acu-pin-mark svg{width:14px;height:14px}
.acu-pin-card{position:absolute;left:0;top:0;display:none;width:240px;padding:10px 12px 12px;border-radius:10px;background:var(--acu-flag);color:var(--acu-flag-fg);box-shadow:0 10px 30px #0000002a;font-family:Inter,system-ui,sans-serif}
.acu-pin-card::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:0 0 10px 10px;background:var(--acu-edge)}
.acu-pin:hover .acu-pin-card,.acu-pin:focus-within .acu-pin-card{display:block;animation:acu-fade .2s both}
.acu-pin-head{display:flex;align-items:center;gap:6px;margin-bottom:4px}.acu-pin-head b{font-weight:500}.acu-pin-head span{opacity:.55;font-size:12px}
.acu-pin-head button{margin-left:auto;display:grid;place-items:center;width:22px;height:22px;padding:0;border:0;border-radius:50%;background:var(--acu-flag-fg);color:var(--acu-flag)!important}
.acu-pin-head svg{width:12px;height:12px}
.acu-table{width:100%;border-collapse:collapse;font-size:13.5px}
.acu-table th{text-align:left;font-weight:500;color:var(--acu-muted);padding:8px 10px;border-bottom:1px solid var(--acu-line)}
.acu-table td{padding:10px;border-bottom:1px solid var(--acu-line)}
.acu :focus-visible{outline:2px solid var(--acu-fg);outline-offset:2px}
@keyframes acu-spin{to{transform:rotate(360deg)}}
@keyframes acu-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}
@keyframes acu-fade{from{opacity:0}}
@keyframes acu-pop{from{opacity:0;transform:scale(.6)}}
@keyframes acu-slide{from{opacity:0;transform:translateX(-4px)}}
@media(max-width:520px){.acu-page{padding:24px 18px 0 44px}.acu-count{display:none}.acu-img{float:none!important;width:100%}}
@media(prefers-reduced-motion:reduce){.acu *,.acu *::after{animation:none!important;transition:none!important}}
`;

export default AgentCursors;
