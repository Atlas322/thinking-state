"use client";

import * as React from "react";

/**
 * Explainer Carousel — 1080×1440 education slides (cover with a step staircase,
 * numbered step slides with a figure, rule pill and next-slide hook, rules sheet)
 * plus figure primitives: TokenChips, ScoreBars, BudgetStack, Scatter, Sequence,
 * HubSpoke, ChunkCards, LoopRing, PassFailGrid, Venn3, RulesSheet.
 * Independent implementation. Fonts: Montserrat + Lora (Cyrillic Ө Ү).
 * Add className "xc-static" on an ancestor to render the final state without motion (export).
 */

const C = {
  bg: "#0B0B0C",
  ink: "#FFFFFF",
  mut: "#9A9AA2",
  dim: "#5E5E66",
  blue: "#3B82F6",
  blueSoft: "#93B8FA",
  orange: "#F5A524",
  green: "#22C55E",
  red: "#EF4444",
  line: "rgba(255,255,255,.10)",
  card: "rgba(255,255,255,.035)",
};

/* ---------- slide shells ---------- */

export type ExplainerSlideProps = {
  n: number;
  title: string;
  page: number;
  total: number;
  kicker?: string;
  lede: string;
  figure?: React.ReactNode;
  points?: string[];
  rule?: { label: string; text: string };
  next?: string;
  handle?: string;
  steps?: number;
  /** "dark" (default) or "editorial": paper, ink hairlines, dimension-drawing marks, serif titles. */
  theme?: ExplainerTheme;
  /** Magazine folio line (editorial), e.g. "GEN AI · №01 · 2026.11". */
  folio?: string;
  /** "3x4" (default, 1080×1440) or "4x5" (1080×1350, IG feed). */
  format?: ExplainerFormat;
  /** Show the mini step staircase beside the kicker (default true). */
  stairs?: boolean;
};

export type ExplainerFormat = "3x4" | "4x5";
const fmt = (f?: ExplainerFormat) => (f === "4x5" ? " xc-45" : "");

export type ExplainerTheme = "dark" | "editorial";
const th = (t?: ExplainerTheme) => (t === "editorial" ? " xc-ed" : "");

function Folio({ text, page }: { text?: string; page: string }) {
  return (
    <div className="xc-folio">
      <span>{text}</span>
      <span>{page}</span>
    </div>
  );
}

export function ExplainerSlide(p: ExplainerSlideProps) {
  const steps = p.steps ?? 10;
  return (
    <section className={`xc xc-slide${th(p.theme)}${fmt(p.format)}`}>
      <style>{css}</style>
      {p.theme === "editorial" && <Folio text={p.folio} page={`${String(p.page).padStart(2, "0")} / ${p.total}`} />}
      <header className="xc-head">
        <span className="xc-num">{p.n}</span>
        <h2 className="xc-title">{p.title}</h2>
        <span className="xc-page">
          {p.page}/{p.total}
        </span>
      </header>
      <div className="xc-kick">
        {p.stairs !== false && <MiniStairs steps={steps} at={p.n} />}
        {p.kicker && <span>{p.kicker}</span>}
      </div>
      <p className="xc-lede">{p.lede}</p>
      <div className="xc-figure" data-fig={`FIG. ${String(p.n).padStart(2, "0")}`}>
        {p.theme === "editorial" && (
          <>
            <span className="xc-dim-h" aria-hidden><i>A</i></span>
            <span className="xc-dim-v" aria-hidden><i>B</i></span>
          </>
        )}
        {p.figure}
      </div>
      {p.points && (
        <ol className="xc-points">
          {p.points.map((t, i) => (
            <li key={i} style={{ animationDelay: `${0.9 + i * 0.15}s` }}>
              <b>{i + 1}</b>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      )}
      {p.rule && (
        <div className="xc-rule">
          <em>{p.rule.label}</em> {p.rule.text}
        </div>
      )}
      {p.next && <p className="xc-next">{p.next} →</p>}
      {p.handle && <p className="xc-handle">{p.handle}</p>}
    </section>
  );
}

function MiniStairs({ steps, at }: { steps: number; at: number }) {
  return (
    <svg width="132" height="34" viewBox="0 0 132 34" aria-hidden>
      {Array.from({ length: steps }, (_, i) => (
        <rect
          key={i}
          x={i * 13}
          y={30 - i * 2.8}
          width="10"
          height="2.4"
          rx="1"
          fill={i < at ? C.blue : C.dim}
        />
      ))}
      <circle cx={(at - 1) * 13 + 5} cy={30 - (at - 1) * 2.8 - 4} r="3.2" fill={C.orange} />
    </svg>
  );
}

export type StairCoverProps = {
  kicker: string;
  title: [string, string];
  sub: React.ReactNode;
  steps: string[];
  top: string;
  bottom: string;
  cta: string;
  note: string;
  handle?: string;
  page?: string;
  theme?: ExplainerTheme;
  folio?: string;
};

export function StairCover(p: StairCoverProps) {
  const n = p.steps.length;
  return (
    <section className={`xc xc-slide xc-cover${th(p.theme)}`}>
      <style>{css}</style>
      {p.theme === "editorial" && <Folio text={p.folio} page={p.page ?? ""} />}
      {p.page && <span className="xc-page xc-page-abs">{p.page}</span>}
      <div className="xc-kick-txt">{p.kicker}</div>
      <h1 className="xc-hero">
        {p.title[0]}
        <br />
        <span>{p.title[1]}</span>
      </h1>
      <p className="xc-sub">{p.sub}</p>
      <div className="xc-stairs">
        {p.steps.map((s, i) => (
          <div
            key={i}
            className="xc-stair"
            style={{
              left: 250 + i * 62,
              bottom: 50 + i * 46,
              animationDelay: `${0.2 + i * 0.12}s`,
            }}
          >
            <span className="xc-stair-lbl">
              {s} <b>{i + 1}</b>
            </span>
            <i />
            {p.theme === "editorial" && <small className="xc-stair-dim">h{(i + 1) * 46} · {String(i + 1).padStart(2, "0")}</small>}
          </div>
        ))}
        {p.theme === "editorial" && (
          <>
            <span className="xc-cdim-h" style={{ left: 250, width: (n - 1) * 62 + 120 }}><i>{n} АЛХАМ · {(n - 1) * 62 + 120} PX</i></span>
            <span className="xc-cdim-v" style={{ left: 250 + (n - 1) * 62 + 150, height: n * 46 + 4 }}><i>ТЭГ → ОРГИЛ</i></span>
          </>
        )}
        <div className="xc-stair-top" style={{ left: 250 + (n - 1) * 62 + 60, bottom: 50 + n * 46 + 6 }}>
          {p.top}
        </div>
        <div className="xc-stair-zero">{p.bottom}</div>
      </div>
      <footer className="xc-cover-foot">
        <b>{p.cta} →</b>
        <span>{p.note}</span>
      </footer>
      {p.handle && <p className="xc-handle">{p.handle}</p>}
    </section>
  );
}

export function RulesSheet({
  title,
  rules,
  page,
  cta,
  handle,
  theme,
  folio,
}: {
  title: string;
  rules: { name: string; rule: string }[];
  page: string;
  cta: string;
  handle?: string;
  theme?: ExplainerTheme;
  folio?: string;
}) {
  return (
    <section className={`xc xc-slide${th(theme)}`}>
      <style>{css}</style>
      {theme === "editorial" && <Folio text={folio} page={page} />}
      <header className="xc-head">
        <h2 className="xc-title">{title}</h2>
        <span className="xc-page">{page}</span>
      </header>
      <ol className="xc-sheet">
        {rules.map((r, i) => (
          <li key={i} style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
            <b>{i + 1}</b>
            <span className="xc-sheet-name">{r.name}</span>
            <span className="xc-sheet-rule">{r.rule}</span>
          </li>
        ))}
      </ol>
      <div className="xc-rule xc-rule-cta">{cta}</div>
      {handle && <p className="xc-handle">{handle}</p>}
    </section>
  );
}

/* ---------- statement slide (hook · caveat · CTA) ---------- */

export type StatementSlideProps = {
  kicker?: string;
  /** Line 1 upright, line 2 italic accent. */
  title: [string, string?];
  sub?: React.ReactNode;
  /** Optional marked list, e.g. caveats: { mark: "⚠", text }. */
  items?: { mark: string; text: React.ReactNode }[];
  /** Dimension label drawn under the title (editorial). */
  dim?: string;
  cta?: string;
  note?: string;
  page?: string;
  handle?: string;
  theme?: ExplainerTheme;
  folio?: string;
  format?: ExplainerFormat;
};

export function StatementSlide(p: StatementSlideProps) {
  return (
    <section className={`xc xc-slide xc-stmt${th(p.theme)}${fmt(p.format)}`}>
      <style>{css}</style>
      {p.theme === "editorial" && <Folio text={p.folio} page={p.page ?? ""} />}
      {p.kicker && <div className="xc-kick-txt">{p.kicker}</div>}
      <h1 className="xc-hero xc-stmt-hero">
        <span className="xc-l1">{p.title[0]}</span>
        {p.title[1] && (
          <>
            <br />
            <span className="xc-l2">{p.title[1]}</span>
          </>
        )}
      </h1>
      {p.dim && (
        <div className="xc-stmt-dim" aria-hidden>
          <i>{p.dim}</i>
        </div>
      )}
      {p.sub && <p className="xc-sub">{p.sub}</p>}
      {p.items && (
        <ul className="xc-items">
          {p.items.map((it, i) => (
            <li key={i} style={{ animationDelay: `${0.9 + i * 0.25}s` }}>
              <b>{it.mark}</b>
              <span>{it.text}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="xc-grow" />
      {(p.cta || p.note) && (
        <footer className="xc-cover-foot">
          {p.cta && <b>{p.cta} →</b>}
          {p.note && <span>{p.note}</span>}
        </footer>
      )}
      {p.handle && <p className="xc-handle">{p.handle}</p>}
    </section>
  );
}

/* ---------- motion primitives: count-up, draw-on ---------- */

/** Integer count-up in pure CSS (@property), so frame-accurate capture can seek it via getAnimations(). */
export function CountUp({ to, prefix, suffix, delay = 0.4 }: { to: number; prefix?: string; suffix?: string; delay?: number }) {
  return (
    <span className="xc-cnt">
      {prefix}
      <span className="xc-count" style={{ ["--to" as string]: to, animationDelay: `${delay}s` } as React.CSSProperties} />
      {suffix}
    </span>
  );
}

/** Big numbers with labels; optional hatched bar (value as % of 100) that draws on. */
export function StatRows({
  rows,
  foot,
}: {
  rows: { value: number; prefix?: string; suffix?: string; label: string; bar?: boolean; hot?: boolean }[];
  foot?: string;
}) {
  return (
    <FigureCard>
      <div className="xc-statrows">
        {rows.map((r, i) => (
          <div className={`xc-statrow${r.hot ? " hot" : ""}${r.bar ? " has-bar" : ""}`} key={i}>
            <em>
              <CountUp to={r.value} prefix={r.prefix} suffix={r.suffix} delay={0.4 + i * 0.2} />
            </em>
            <span>{r.label}</span>
            {r.bar && <i style={{ width: `${r.value}%`, animationDelay: `${0.4 + i * 0.2}s` }} />}
          </div>
        ))}
      </div>
      {foot && <p className="xc-small">{foot}</p>}
    </FigureCard>
  );
}

/** Schematic divergence: one line rises, one falls (no data values — labelled as a schematic). */
export function Divergence({
  up,
  down,
  from,
  to,
  foot,
}: {
  up: string;
  down: string;
  from: string;
  to: string;
  foot: string;
}) {
  return (
    <FigureCard>
      <svg className="xc-div" viewBox="0 0 800 400" aria-hidden>
        <line className="xc-axis" x1="60" y1="340" x2="760" y2="340" pathLength={1} />
        <line className="xc-axis" x1="60" y1="340" x2="60" y2="30" pathLength={1} />
        <path className="xc-div-up" d="M60 220 C 300 210, 520 120, 740 60" pathLength={1} />
        <path className="xc-div-dn" d="M60 200 C 300 210, 520 270, 740 310" pathLength={1} />
        <circle className="xc-div-dot up" cx="740" cy="60" r="7" />
        <circle className="xc-div-dot dn" cx="740" cy="310" r="7" />
      </svg>
      <div className="xc-div-lbl">
        <span className="up">↑ {up}</span>
        <span className="dn">↓ {down}</span>
      </div>
      <div className="xc-dots-ends">
        <span>{from}</span>
        <span>{to}</span>
      </div>
      <p className="xc-small">{foot}</p>
    </FigureCard>
  );
}

/** Ruled lines that draw on one by one — a fill-in habit sheet. */
export function Ledger({ rows, foot }: { rows: { k: string; text: string }[]; foot?: string }) {
  return (
    <FigureCard>
      <ol className="xc-ledger">
        {rows.map((r, i) => (
          <li key={i} style={{ animationDelay: `${0.3 + i * 0.5}s` }}>
            <b>{r.k}</b>
            <span>{r.text}</span>
            <i style={{ animationDelay: `${0.5 + i * 0.5}s` }} />
          </li>
        ))}
      </ol>
      {foot && <p className="xc-small">{foot}</p>}
    </FigureCard>
  );
}

/* ---------- figure primitives ---------- */

export function FigureCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="xc-card">
      {title && <div className="xc-card-title">{title}</div>}
      {children}
    </div>
  );
}

export function TokenChips({
  sentence,
  hint,
  rows,
  total,
  note,
  bars,
  barsTitle,
}: {
  sentence: string;
  hint: string;
  rows: { t: string; id: number; hl?: boolean }[][];
  total: string;
  note: string;
  bars: { label: string; value: number }[];
  barsTitle: string;
}) {
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <FigureCard>
      <p className="xc-quote">{sentence}</p>
      <p className="xc-small">{hint}</p>
      {rows.map((r, i) => (
        <div className="xc-chips" key={i}>
          {r.map((c, j) => (
            <span className={`xc-chip ${c.hl ? "hl" : ""}`} key={j}>
              <i>{c.t}</i>
              <small>{c.id}</small>
            </span>
          ))}
        </div>
      ))}
      <p className="xc-big orange">{total}</p>
      <p className="xc-small orange">{note}</p>
      <p className="xc-small left">{barsTitle}</p>
      {bars.map((b, i) => (
        <div className="xc-hbar" key={i}>
          <span>{b.label}</span>
          <i style={{ width: `${(b.value / max) * 58}%`, background: i === bars.length - 1 ? C.orange : C.blue }} />
          <b>{b.value}</b>
        </div>
      ))}
    </FigureCard>
  );
}

export function Scatter({
  question,
  you,
  points,
  foot,
}: {
  question: string;
  you: string;
  points: { label: string; score: string; note: string; x: number; y: number; near?: boolean }[];
  foot: string;
}) {
  return (
    <FigureCard>
      <p className="xc-quote orange">«{question}»</p>
      <div className="xc-space">
        <div className="xc-you" style={{ left: "16%", top: "48%" }}>
          <i />
          <span>{you}</span>
        </div>
        {points.map((pt, i) => (
          <div className={`xc-pt ${pt.near ? "near" : ""}`} key={i} style={{ left: `${pt.x}%`, top: `${pt.y}%` }}>
            <i />
            <div>
              <b>{pt.label}</b> <em>{pt.score}</em>
              <small>{pt.note}</small>
            </div>
          </div>
        ))}
      </div>
      <p className="xc-small left">{foot}</p>
    </FigureCard>
  );
}

export function ScoreBars({
  head,
  options,
  foot,
  verdict,
  sub,
}: {
  head: string;
  options: { label: string; value: number }[];
  foot: string;
  verdict: string;
  sub: string;
}) {
  return (
    <FigureCard>
      <p className="xc-big">{head}</p>
      {options.map((o, i) => (
        <div className={`xc-score ${i === 0 ? "win" : ""}`} key={i}>
          <span>{o.label}</span>
          <i style={{ width: `${o.value * 100}%` }} />
          <b>{o.value.toFixed(2)}</b>
        </div>
      ))}
      <p className="xc-small">{foot}</p>
      <p className="xc-mid orange">{verdict}</p>
      <p className="xc-small">{sub}</p>
    </FigureCard>
  );
}

export function BudgetStack({
  ghost,
  head,
  parts,
  warn,
}: {
  ghost: string;
  head: string;
  parts: { label: string; tokens: number; hot?: boolean }[];
  warn: [string, string];
}) {
  const sum = parts.reduce((a, b) => a + b.tokens, 0);
  return (
    <FigureCard>
      <div className="xc-ghost">{ghost}</div>
      <div className="xc-stack">
        <div className="xc-stack-head">● ● ● {head}</div>
        {parts.map((p, i) => (
          <div
            className={`xc-stack-row ${p.hot ? "hot" : ""}`}
            key={i}
            style={{ flexGrow: Math.max(p.tokens / sum, 0.09) }}
          >
            <span>{p.label}</span>
            <b>{p.tokens.toLocaleString("en-US")}</b>
          </div>
        ))}
      </div>
      <p className="xc-mid orange">{warn[0]}</p>
      <p className="xc-small red">{warn[1]}</p>
    </FigureCard>
  );
}

export function Sequence({
  lanes,
  steps,
  foot,
}: {
  lanes: [string, string, string];
  steps: { from: 0 | 1 | 2; text: string; code?: boolean }[];
  foot: [string, string];
}) {
  return (
    <FigureCard>
      <div className="xc-lanes">
        {lanes.map((l, i) => (
          <span key={i} className={i === 2 ? "on" : ""}>
            {l}
          </span>
        ))}
      </div>
      <div className="xc-seq">
        {steps.map((s, i) => (
          <div key={i} className={`xc-seq-row lane${s.from}`} style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
            <b>{i + 1}</b>
            <span className={s.code ? "code" : ""}>{s.text}</span>
          </div>
        ))}
      </div>
      <div className="xc-boxnote">
        <b>{foot[0]}</b>
        <span>{foot[1]}</span>
      </div>
    </FigureCard>
  );
}

export function HubSpoke({
  left,
  right,
  hub,
  head,
  sub,
  listTitle,
  list,
}: {
  left: string[];
  right: string[];
  hub: string;
  head: string;
  sub: string;
  listTitle: string;
  list: { tag: string; value: string }[];
}) {
  return (
    <FigureCard>
      <div className="xc-hub">
        <div className="xc-col">{left.map((l) => <span key={l}>{l}</span>)}</div>
        <div className="xc-hub-core">{hub}</div>
        <div className="xc-col">{right.map((l) => <span key={l}>{l}</span>)}</div>
      </div>
      <p className="xc-mid orange">{head}</p>
      <p className="xc-small">{sub}</p>
      <p className="xc-small left">{listTitle}</p>
      {list.map((r) => (
        <div className="xc-tagrow" key={r.tag}>
          <em>{r.tag}</em>
          <code>{r.value}</code>
        </div>
      ))}
    </FigureCard>
  );
}

export function ChunkCards({
  question,
  chunks,
  simLabel,
  prompt,
  answer,
  answerNote,
}: {
  question: string;
  chunks: { name: string; text: string; score: number; best?: boolean }[];
  simLabel: string;
  prompt: { tag: string; text: string }[];
  answer: string;
  answerNote: string;
}) {
  return (
    <FigureCard>
      <div className="xc-pill">«{question}»</div>
      <div className="xc-chunks">
        {chunks.map((c) => (
          <div className={`xc-chunk ${c.best ? "best" : ""}`} key={c.name}>
            <b>{c.name}</b>
            <p>«{c.text}»</p>
            <div>
              <i style={{ width: `${c.score * 100}%` }} />
              <em>{c.score.toFixed(3)}</em>
            </div>
          </div>
        ))}
      </div>
      <p className="xc-small">{simLabel}</p>
      <div className="xc-prompt">
        {prompt.map((r) => (
          <div key={r.tag}>
            <em>{r.tag}</em>
            <span>{r.text}</span>
          </div>
        ))}
      </div>
      <div className="xc-answer">↓ {answer}</div>
      <p className="xc-small">{answerNote}</p>
    </FigureCard>
  );
}

export function LoopRing({
  nodes,
  center,
  caption,
  dots,
  ends,
  big,
  bigLabel,
  foot,
}: {
  nodes: [string, string, string];
  center: string;
  caption: string;
  dots: number;
  ends: [string, string];
  big: string;
  bigLabel: string;
  foot: string;
}) {
  return (
    <FigureCard>
      <div className="xc-loop">
        <div className="xc-loop-ring" />
        <span className="xc-loop-n top">● {nodes[0]}</span>
        <span className="xc-loop-n l">{nodes[1]}</span>
        <span className="xc-loop-n r">{nodes[2]}</span>
        <b className="xc-loop-c">{center}</b>
      </div>
      <p className="xc-mid">{caption}</p>
      <div className="xc-dots">
        {Array.from({ length: dots }, (_, i) => (
          <i key={i} style={{ animationDelay: `${0.4 + i * 0.05}s` }} />
        ))}
      </div>
      <div className="xc-dots-ends">
        <span>{ends[0]}</span>
        <span>{ends[1]}</span>
      </div>
      <p className="xc-huge">{big}</p>
      <p className="xc-mid">{bigLabel}</p>
      <p className="xc-small">{foot}</p>
    </FigureCard>
  );
}

export function PassFailGrid({
  title,
  cells,
  stats,
  legend,
  foot,
}: {
  title: string;
  cells: ("p" | "f" | "m")[];
  stats: { label: string; value: string; head?: boolean }[];
  legend: [string, string];
  foot: string;
}) {
  return (
    <FigureCard title={title}>
      <div className="xc-gridwrap">
        <div className="xc-grid">
          {cells.map((c, i) => (
            <i key={i} className={c} style={{ animationDelay: `${0.2 + i * 0.03}s` }} />
          ))}
        </div>
        <div className="xc-stats">
          {stats.map((s) =>
            s.head ? (
              <b key={s.label} className="xc-stat-head">
                {s.label}
              </b>
            ) : (
              <div key={s.label}>
                <span>{s.label}</span>
                <em>{s.value}</em>
              </div>
            ),
          )}
        </div>
      </div>
      <div className="xc-legend">
        <span>
          <i className="p" /> {legend[0]}
        </span>
        <span>
          <i className="f" /> {legend[1]}
        </span>
      </div>
      <p className="xc-small">{foot}</p>
    </FigureCard>
  );
}

export function Venn3({ title, labels }: { title: string; labels: [string, string, string] }) {
  return (
    <FigureCard title={title}>
      <svg className="xc-venn" viewBox="0 0 600 470" aria-hidden>
        <circle cx="215" cy="175" r="140" fill="rgba(59,130,246,.10)" stroke={C.blue} strokeWidth="2" />
        <circle cx="385" cy="175" r="140" fill="rgba(239,68,68,.10)" stroke={C.red} strokeWidth="2" />
        <circle cx="300" cy="320" r="140" fill="rgba(245,165,36,.10)" stroke={C.orange} strokeWidth="2" />
        <text x="150" y="150" fill={C.blueSoft} fontSize="24" textAnchor="middle">{labels[0]}</text>
        <text x="450" y="150" fill="#F49A9A" fontSize="24" textAnchor="middle">{labels[1]}</text>
        <text x="300" y="420" fill={C.orange} fontSize="24" textAnchor="middle">{labels[2]}</text>
        <text x="300" y="232" fill={C.ink} fontSize="30" fontWeight="700" textAnchor="middle">!</text>
      </svg>
    </FigureCard>
  );
}

/* ---------- demo ---------- */

export default function ExplainerCarouselDemo() {
  return (
    <div style={{ transform: "scale(.5)", transformOrigin: "top left", width: 540, height: 720 }}>
      <ExplainerSlide
        n={4}
        title="Контекст цонх"
        page={5}
        total={12}
        kicker="АЛХАМ 4 / 10"
        lede="Контекст цонх бол загварын нэг дор харж чадах бүх зүйл. Багтаагүй нь байхгүйтэй адил."
        figure={
          <BudgetStack
            ghost="Хуучин чатын түүх — багтсангүй"
            head="контекст цонх · 4,850 токен"
            parts={[
              { label: "Системийн заавар", tokens: 1200 },
              { label: "Чатын түүх", tokens: 800 },
              { label: "Олдсон баримт", tokens: 2500, hot: true },
              { label: "Хариулт", tokens: 350 },
            ]}
            warn={["Баримтууд цонхны 52%-ийг эзэлж байна.", "Багтаагүйг загвар хэзээ ч харахгүй."]}
          />
        }
        points={["Заавар, түүх, баримт, хариулт нэг цонхыг хуваана.", "Токеноор хэмжинэ, бүгдэд нь төлнө.", "Хэсэг бүрийн төсвийг кодоор барь."]}
        rule={{ label: "Дүрэм:", text: "Цонх бол төсөв, сав биш." }}
        next="Тэгвэл загвар яаж үйлдэл хийдэг вэ?"
        handle="@itge.e"
      />
    </div>
  );
}

/* ---------- styles ---------- */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=JetBrains+Mono:wght@500&display=swap');
.xc{--xc-blue:${C.blue};font-family:Montserrat,system-ui,sans-serif;color:${C.ink};box-sizing:border-box}
.xc *{box-sizing:border-box}
.xc-slide{position:relative;width:1080px;height:1440px;padding:72px 72px 56px;overflow:hidden;display:flex;flex-direction:column;
  background:radial-gradient(900px 700px at 85% 0%,rgba(59,130,246,.16),transparent 60%),radial-gradient(800px 600px at 0% 100%,rgba(245,165,36,.10),transparent 60%),${C.bg}}
.xc-head{display:flex;align-items:center;gap:28px}
.xc-num{width:88px;height:88px;border-radius:20px;background:${C.blue};display:grid;place-items:center;font-size:48px;font-weight:700}
.xc-title{margin:0;font-size:64px;font-weight:800;letter-spacing:-.02em;flex:1;line-height:1.05}
.xc-page{font-size:26px;color:${C.mut};background:rgba(255,255,255,.06);padding:8px 18px;border-radius:30px}
.xc-page-abs{position:absolute;top:56px;right:72px}
.xc-kick{display:flex;align-items:flex-end;gap:16px;margin-top:22px;font-size:24px;font-weight:700;letter-spacing:.14em;color:${C.blue}}
.xc-lede{margin:12px 0 26px;font-size:33px;line-height:1.3;font-weight:600}
.xc-figure{flex:1;display:flex;min-height:0}
.xc-card{flex:1;border:1px solid ${C.line};background:${C.card};border-radius:28px;padding:34px 40px;display:flex;flex-direction:column;justify-content:center;gap:10px;animation:xcUp .5s both}
.xc-card-title{text-align:center;font-size:32px;font-weight:700;margin-bottom:8px}
.xc-points{list-style:none;margin:28px 0 0;padding:0;display:grid;gap:14px}
.xc-points li{display:flex;gap:18px;align-items:center;font-size:28px;color:#E6E6EA;animation:xcUp .4s both}
.xc-points b{width:36px;height:36px;flex:none;border-radius:50%;background:${C.blue};display:grid;place-items:center;font-size:20px}
.xc-rule{margin-top:26px;border:1.5px solid rgba(59,130,246,.55);background:rgba(59,130,246,.10);border-radius:20px;padding:20px 30px;font-size:32px;font-weight:700}
.xc-rule em{font-style:normal;color:${C.blue}}
.xc-next{margin:22px 0 0;font-size:30px;font-weight:700}
.xc-handle{margin:16px 0 0;text-align:center;font-size:24px;color:${C.mut}}
.xc-quote{text-align:center;font-size:30px;font-weight:600;margin:0}
.xc-small{text-align:center;font-size:22px;color:${C.mut};margin:0}
.xc-small.left{text-align:left;margin-top:12px}
.xc-big{text-align:center;font-size:52px;font-weight:800;margin:8px 0}
.xc-mid{text-align:center;font-size:30px;font-weight:700;margin:8px 0 0}
.xc-huge{text-align:center;font-size:120px;font-weight:800;margin:8px 0 0;color:${C.orange};line-height:1}
.orange{color:${C.orange}} .red{color:${C.red}}
.xc-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px}
.xc-chip{display:flex;flex-direction:column;align-items:center;gap:4px}
.xc-chip i{font-style:normal;font-size:26px;padding:6px 10px;border:1px solid ${C.line};border-radius:8px;background:rgba(255,255,255,.04)}
.xc-chip small{font-size:15px;color:${C.mut}}
.xc-chip.hl i{border-color:${C.orange};color:${C.orange}} .xc-chip.hl small{color:${C.orange}}
.xc-hbar{display:flex;align-items:center;gap:18px;font-size:24px}
.xc-hbar span{width:180px} .xc-hbar i{height:16px;border-radius:8px;animation:xcGrow .8s both} .xc-hbar b{color:${C.blueSoft}}
.xc-space{position:relative;flex:1;min-height:440px}
.xc-you{position:absolute;display:flex;flex-direction:column;align-items:center;gap:10px;color:${C.orange};font-size:24px;font-weight:600}
.xc-you i{width:30px;height:30px;border-radius:50%;background:${C.orange};box-shadow:0 0 40px ${C.orange}}
.xc-pt{position:absolute;display:flex;gap:14px;align-items:center}
.xc-pt i{width:16px;height:16px;border-radius:50%;background:${C.blueSoft}}
.xc-pt>div{border:1px solid ${C.line};border-radius:14px;padding:10px 16px;background:rgba(0,0,0,.3);font-size:24px}
.xc-pt em{font-style:normal;color:${C.blueSoft};margin-left:16px;font-weight:700}
.xc-pt small{display:block;font-size:17px;color:${C.mut}}
.xc-pt.near>div{border-color:${C.orange}} .xc-pt.near em{color:${C.orange}} .xc-pt.near i{background:${C.orange}}
.xc-score{display:grid;grid-template-columns:200px 1fr;align-items:center;gap:18px;font-size:30px;margin:6px 0;position:relative;padding:8px 12px;border-radius:12px}
.xc-score i{height:34px;border-radius:6px;background:${C.blue};grid-column:2;grid-row:1;animation:xcGrow .8s both}
.xc-score b{grid-column:2;grid-row:1;padding-left:16px;font-size:28px;z-index:1;position:relative;left:0}
.xc-score.win{border:1.5px solid ${C.orange}} .xc-score.win i{background:${C.orange}}
.xc-ghost{text-align:center;font-size:24px;color:${C.dim};border:1px dashed ${C.dim};border-radius:12px;padding:10px;margin:0 60px}
.xc-stack{flex:1;display:flex;flex-direction:column;gap:8px;border:1px solid ${C.line};border-radius:18px;padding:14px;margin:12px 60px;min-height:420px}
.xc-stack-head{font-size:20px;color:${C.mut};text-align:center}
.xc-stack-row{display:flex;justify-content:space-between;align-items:center;padding:0 22px;border-radius:10px;background:rgba(59,130,246,.55);font-size:26px;min-height:40px;animation:xcUp .5s both}
.xc-stack-row.hot{background:linear-gradient(180deg,#C77A1A,#8A4E12)}
.xc-lanes{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.xc-lanes span{text-align:center;border:1px solid ${C.line};border-radius:14px;padding:14px;font-size:26px;font-weight:700}
.xc-lanes span.on{border-color:${C.green};color:${C.green}}
.xc-seq{display:grid;gap:14px;margin:18px 0}
.xc-seq-row{display:flex;gap:12px;align-items:center;font-size:24px;animation:xcUp .4s both;width:70%}
.xc-seq-row b{width:30px;height:30px;flex:none;border-radius:50%;background:${C.blue};display:grid;place-items:center;font-size:17px}
.xc-seq-row.lane1{margin-left:15%} .xc-seq-row.lane1 b{background:${C.orange}}
.xc-seq-row.lane2{margin-left:30%} .xc-seq-row.lane2 b{background:${C.green}}
.xc-seq-row .code{font-family:'JetBrains Mono',monospace;font-size:21px;color:${C.orange}}
.xc-boxnote{border:1px solid rgba(245,165,36,.5);border-radius:14px;padding:16px;text-align:center;display:grid;gap:4px}
.xc-boxnote b{color:${C.orange};font-size:28px} .xc-boxnote span{font-size:22px;color:#D9D9DE}
.xc-hub{display:grid;grid-template-columns:1fr 150px 1fr;align-items:center;gap:30px;margin-bottom:10px}
.xc-col{display:grid;gap:22px} .xc-col span{border:1px solid ${C.line};border-radius:12px;padding:14px 18px;font-size:24px;font-weight:600;background:rgba(255,255,255,.03)}
.xc-hub-core{width:140px;height:140px;border-radius:50%;border:2px solid ${C.orange};display:grid;place-items:center;font-weight:800;font-size:30px;color:${C.orange};box-shadow:0 0 50px rgba(245,165,36,.35)}
.xc-tagrow{display:flex;gap:20px;align-items:center;font-size:22px}
.xc-tagrow em{font-style:normal;color:${C.orange};border:1px solid rgba(245,165,36,.5);border-radius:20px;padding:2px 14px;width:150px;text-align:center;font-size:17px;letter-spacing:.1em}
.xc-tagrow code{font-family:'JetBrains Mono',monospace;color:#E6E6EA}
.xc-pill{align-self:center;border:1px solid ${C.line};border-radius:30px;padding:10px 26px;font-size:26px;font-weight:600}
.xc-chunks{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:10px}
.xc-chunk{border:1px solid ${C.line};border-radius:14px;padding:14px;font-size:20px}
.xc-chunk b{font-size:22px} .xc-chunk p{margin:8px 0;color:#D9D9DE;min-height:110px}
.xc-chunk div{display:flex;align-items:center;gap:8px} .xc-chunk i{height:6px;border-radius:3px;background:${C.mut}} .xc-chunk em{font-style:normal;margin-left:auto;font-weight:700}
.xc-chunk.best{border-color:${C.orange}} .xc-chunk.best i{background:${C.orange}} .xc-chunk.best em{color:${C.orange}}
.xc-prompt{border:1px solid ${C.line};border-radius:14px;padding:14px 20px;display:grid;gap:10px;margin:8px 40px 0}
.xc-prompt div{display:flex;gap:16px;align-items:center;font-size:22px}
.xc-prompt em{font-style:normal;font-size:16px;border:1px solid rgba(59,130,246,.6);color:${C.blueSoft};border-radius:14px;padding:2px 12px;width:150px;text-align:center}
.xc-answer{align-self:center;border:1.5px solid ${C.orange};color:${C.orange};border-radius:30px;padding:12px 30px;font-size:28px;font-weight:700;margin-top:10px}
.xc-loop{position:relative;height:250px;margin:0 auto;width:440px}
.xc-loop-ring{position:absolute;inset:30px 90px;border:2px dashed ${C.dim};border-radius:50%;animation:xcSpin 12s linear infinite}
.xc-loop-n{position:absolute;border:1px solid ${C.line};background:#141418;border-radius:12px;padding:8px 22px;font-size:24px;font-weight:700}
.xc-loop-n.top{left:50%;top:0;transform:translateX(-50%);border-color:${C.orange}}
.xc-loop-n.l{left:0;bottom:30px} .xc-loop-n.r{right:0;bottom:30px}
.xc-loop-c{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);color:${C.orange};font-size:32px}
.xc-dots{display:flex;justify-content:space-between;margin:14px 10px 0}
.xc-dots i{width:24px;height:24px;border-radius:50%;background:${C.orange};opacity:.9;animation:xcPop .3s both}
.xc-dots-ends{display:flex;justify-content:space-between;font-size:20px;color:${C.mut};margin:4px 10px}
.xc-gridwrap{display:grid;grid-template-columns:auto 1fr;gap:40px;align-items:center;justify-content:center}
.xc-grid{display:grid;grid-template-columns:repeat(8,46px);gap:10px}
.xc-grid i{height:46px;border-radius:8px;animation:xcPop .3s both}
.xc-grid i.p{background:${C.green}} .xc-grid i.f{background:${C.red}} .xc-grid i.m{background:${C.green};outline:3px solid #fff}
.xc-stats{display:grid;gap:18px}
.xc-stat-head{color:${C.orange};font-size:30px}
.xc-stats div{display:flex;align-items:baseline;gap:18px;font-size:22px;color:${C.mut}}
.xc-stats em{font-style:normal;font-size:46px;font-weight:800;color:#fff}
.xc-stats div:last-child em{color:${C.orange}}
.xc-legend{display:flex;gap:30px;font-size:24px;margin-top:20px}
.xc-legend i{display:inline-block;width:20px;height:20px;border-radius:5px;vertical-align:-3px}
.xc-legend i.p{background:${C.green}} .xc-legend i.f{background:${C.red}}
.xc-venn{width:100%;max-height:560px;font-family:Montserrat,sans-serif}
.xc-cover .xc-kick-txt{font-size:26px;font-weight:700;letter-spacing:.14em;color:${C.blue};margin-top:20px}
.xc-hero{margin:18px 0 0;font-size:128px;line-height:1;font-weight:800;letter-spacing:-.03em}
.xc-hero span{font-size:104px;color:${C.blue};font-family:Lora,serif;font-style:italic;font-weight:600}
.xc-sub{font-size:34px;color:#D9D9DE;margin:28px 0 0}
.xc-sub b{color:#fff}
.xc-stairs{position:relative;flex:1}
.xc-stair{position:absolute;width:120px;animation:xcUp .45s both}
.xc-stair i{display:block;height:20px;border-radius:6px;background:linear-gradient(180deg,#6FA0F8,${C.blue});box-shadow:0 6px 20px rgba(59,130,246,.4)}
.xc-stair-lbl{position:absolute;right:130px;bottom:2px;white-space:nowrap;font-size:24px;font-weight:700}
.xc-stair-lbl b{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:${C.blue};font-size:15px;margin-left:6px}
.xc-stair-top{position:absolute;font-size:56px;font-weight:800;color:${C.orange};text-shadow:0 0 30px rgba(245,165,36,.6);transform:translateX(-80%)}
.xc-stair-zero{position:absolute;left:40px;bottom:0;font-size:22px;letter-spacing:.14em;color:${C.mut};font-weight:700}
.xc-cover-foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:20px}
.xc-cover-foot b{font-size:44px} .xc-cover-foot span{font-size:24px;color:${C.mut};text-align:right;max-width:340px}
.xc-sheet{list-style:none;padding:0;margin:40px 0 0;display:grid;gap:14px;flex:1}
.xc-sheet li{display:grid;grid-template-columns:56px 280px 1fr;gap:20px;align-items:center;border:1px solid ${C.line};border-radius:18px;padding:18px 24px;background:${C.card};animation:xcUp .4s both}
.xc-sheet b{width:52px;height:52px;border-radius:14px;background:${C.blue};display:grid;place-items:center;font-size:26px}
.xc-sheet-name{font-size:28px;font-weight:700}
.xc-sheet-rule{font-size:27px;color:#E6E6EA}
.xc-rule-cta{text-align:center}
/* ---------- editorial theme: paper × dimension drawing ---------- */
.xc-ed{--ink:#1A1814;--paper:#F3EFE6;--gray:#68635B;--hair:rgba(26,24,20,.22);--acc:#C2410C;color:var(--ink)!important;
  background:linear-gradient(rgba(26,24,20,.045) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(26,24,20,.045) 1px,transparent 1px) 0 0/24px 24px,var(--paper)!important}
.xc-ed *{box-shadow:none!important;text-shadow:none!important}
.xc-ed .xc-folio{display:flex;justify-content:space-between;font:500 18px 'JetBrains Mono',monospace;letter-spacing:.16em;color:var(--gray);border-bottom:1px solid var(--ink);padding-bottom:12px;margin-bottom:26px;text-transform:uppercase}
.xc-ed .xc-head{border-bottom:1px solid var(--hair);padding-bottom:18px}
.xc-ed .xc-num{background:none;border:1px solid var(--ink);border-radius:0;width:76px;height:76px;font:500 36px 'JetBrains Mono',monospace;color:var(--ink)}
.xc-ed .xc-title{font-family:Lora,serif;font-weight:600;font-size:70px;letter-spacing:-.01em}
.xc-ed .xc-page{display:none}
.xc-ed .xc-kick{color:var(--acc);font:500 20px 'JetBrains Mono',monospace;letter-spacing:.16em}
.xc-ed .xc-kick rect{fill:var(--ink)} .xc-ed .xc-kick circle{fill:var(--acc)}
.xc-ed .xc-lede{font-weight:400;font-size:31px;color:var(--ink)}
.xc-ed .xc-figure{position:relative;padding:34px 0 0 34px}
.xc-ed .xc-figure::before{content:attr(data-fig);position:absolute;right:0;top:0;font:500 18px 'JetBrains Mono',monospace;letter-spacing:.14em;color:var(--gray);background:var(--paper);padding-left:10px}
.xc-ed .xc-dim-h{position:absolute;left:34px;right:120px;top:14px;height:0;border-top:1px solid var(--ink)}
.xc-ed .xc-dim-h::before,.xc-ed .xc-dim-h::after{content:"";position:absolute;top:-8px;height:16px;border-left:1px solid var(--ink)}
.xc-ed .xc-dim-h::before{left:0} .xc-ed .xc-dim-h::after{right:0}
.xc-ed .xc-dim-v{position:absolute;left:14px;top:34px;bottom:0;width:0;border-left:1px solid var(--ink)}
.xc-ed .xc-dim-v::before,.xc-ed .xc-dim-v::after{content:"";position:absolute;left:-8px;width:16px;border-top:1px solid var(--ink)}
.xc-ed .xc-dim-v::before{top:0} .xc-ed .xc-dim-v::after{bottom:0}
.xc-ed .xc-dim-h i,.xc-ed .xc-dim-v i{position:absolute;font:500 18px 'JetBrains Mono',monospace;font-style:normal;background:var(--paper);color:var(--acc);border:1px solid var(--acc);border-radius:50%;width:30px;height:30px;display:grid;place-items:center}
.xc-ed .xc-dim-h i{left:50%;top:-15px} .xc-ed .xc-dim-v i{top:50%;left:-15px}
.xc-ed .xc-card{background:rgba(255,255,255,.35);border:1px solid var(--ink);border-radius:0}
.xc-ed .xc-card-title,.xc-ed .xc-big,.xc-ed .xc-mid{font-family:Lora,serif;font-weight:600}
.xc-ed .xc-quote{font-family:Lora,serif;font-style:italic;font-weight:600}
.xc-ed .xc-small{font:500 18px 'JetBrains Mono',monospace;letter-spacing:.06em;color:var(--gray);text-transform:uppercase}
.xc-ed .orange,.xc-ed .red,.xc-ed .xc-huge{color:var(--acc)!important}
.xc-ed .xc-huge{font-family:Lora,serif;font-weight:600}
.xc-ed .xc-points{border-top:1px solid var(--hair);padding-top:20px}
.xc-ed .xc-points li{color:var(--ink);font-weight:400}
.xc-ed .xc-points b{background:none;border-radius:0;color:var(--acc);font:500 20px "JetBrains Mono",monospace;width:40px;display:block;white-space:nowrap}
.xc-ed .xc-points b::before{content:"0"}
.xc-ed .xc-rule{background:none;border:0;border-left:3px solid var(--acc);border-radius:0;padding:10px 0 10px 24px;font-family:Lora,serif;font-weight:600;font-style:italic}
.xc-ed .xc-rule em{color:var(--acc);font:500 18px 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;font-style:normal;margin-right:10px}
.xc-ed .xc-next{font-weight:500;color:var(--ink)} .xc-ed .xc-handle{font:500 18px 'JetBrains Mono',monospace;color:var(--gray);letter-spacing:.12em}
.xc-ed .xc-chip i,.xc-ed .xc-col span,.xc-ed .xc-lanes span,.xc-ed .xc-chunk,.xc-ed .xc-prompt,.xc-ed .xc-pill,.xc-ed .xc-pt>div,.xc-ed .xc-loop-n,.xc-ed .xc-ghost,.xc-ed .xc-stack,.xc-ed .xc-boxnote,.xc-ed .xc-sheet li{background:transparent!important;border:1px solid var(--ink)!important;border-radius:0!important;color:var(--ink)}
.xc-ed .xc-chunk p,.xc-ed .xc-boxnote span,.xc-ed .xc-chunk b{color:var(--ink)}
.xc-ed .xc-chip small,.xc-ed .xc-pt small,.xc-ed .xc-stack-head,.xc-ed .xc-dots-ends,.xc-ed .xc-stats div{font-family:'JetBrains Mono',monospace;color:var(--gray)}
.xc-ed .xc-chip.hl i,.xc-ed .xc-chunk.best,.xc-ed .xc-pt.near>div,.xc-ed .xc-score.win,.xc-ed .xc-answer,.xc-ed .xc-loop-n.top,.xc-ed .xc-lanes span.on{border-color:var(--acc)!important;color:var(--acc)!important;background:transparent!important}
.xc-ed .xc-chip.hl small{color:var(--acc)}
.xc-ed .xc-answer{border-radius:0}
.xc-ed .xc-hbar i,.xc-ed .xc-score i,.xc-ed .xc-chunk i{background:repeating-linear-gradient(-45deg,var(--ink) 0 1px,transparent 1px 7px)!important;border:1px solid var(--ink);border-radius:0!important}
.xc-ed .xc-hbar:last-of-type i,.xc-ed .xc-score.win i,.xc-ed .xc-chunk.best i{background:repeating-linear-gradient(-45deg,var(--acc) 0 1.5px,transparent 1.5px 6px)!important;border-color:var(--acc)}
.xc-ed .xc-hbar b,.xc-ed .xc-score b,.xc-ed .xc-chunk em,.xc-ed .xc-pt em,.xc-ed .xc-stack-row b,.xc-ed .xc-stats em{font-family:'JetBrains Mono',monospace;color:var(--ink)}
.xc-ed .xc-score b{background:var(--paper);padding:0 8px;margin-left:8px;justify-self:start}
.xc-ed .xc-pt.near em{color:var(--acc)}
.xc-ed .xc-pt i,.xc-ed .xc-you i{border-radius:0;width:12px;height:12px;background:none;border:1px solid var(--ink);transform:rotate(45deg)}
.xc-ed .xc-you{color:var(--acc)} .xc-ed .xc-you i,.xc-ed .xc-pt.near i{border-color:var(--acc);background:var(--acc)}
.xc-ed .xc-stack-row{background:transparent!important;border:1px solid var(--ink);border-radius:0;color:var(--ink)}
.xc-ed .xc-stack-row.hot{border:1.5px solid var(--acc);color:var(--acc);background:repeating-linear-gradient(-45deg,rgba(194,65,12,.16) 0 1px,transparent 1px 8px)!important}
.xc-ed .xc-stack-row.hot b{color:var(--acc)}
.xc-ed .xc-seq-row b,.xc-ed .xc-seq-row.lane1 b,.xc-ed .xc-seq-row.lane2 b{background:none;border:1px solid var(--ink);color:var(--ink);font-family:'JetBrains Mono',monospace;border-radius:0}
.xc-ed .xc-seq-row .code,.xc-ed .xc-tagrow code{color:var(--ink)}
.xc-ed .xc-hub-core{border:1px solid var(--acc);color:var(--acc);font-family:'JetBrains Mono',monospace}
.xc-ed .xc-tagrow em,.xc-ed .xc-prompt em{border-radius:0;border-color:var(--ink);color:var(--ink);font-family:'JetBrains Mono',monospace}
.xc-ed .xc-loop-ring{border:1px dashed var(--ink);animation:none}
.xc-ed .xc-dots i{background:none;border:1px solid var(--acc);border-radius:0;width:20px;height:20px}
.xc-ed .xc-grid i{border-radius:0}
.xc-ed .xc-grid i.p{background:transparent;border:1px solid var(--ink)} .xc-ed .xc-grid i.f{background:var(--acc)}
.xc-ed .xc-legend i.p{background:none;border:1px solid var(--ink);border-radius:0} .xc-ed .xc-legend i.f{background:var(--acc);border-radius:0}
.xc-ed .xc-stat-head{color:var(--acc);font-family:Lora,serif}
.xc-ed .xc-venn circle{fill:none!important;stroke:var(--ink)!important;stroke-width:1px}
.xc-ed .xc-venn circle:nth-of-type(3){stroke:var(--acc)!important;stroke-dasharray:6 5}
.xc-ed .xc-venn text{fill:var(--ink)!important;font-family:'JetBrains Mono',monospace;font-size:19px}
.xc-ed .xc-venn text:last-child{fill:var(--acc)!important}
.xc-ed.xc-cover .xc-kick-txt{color:var(--acc);font:500 20px 'JetBrains Mono',monospace;letter-spacing:.16em;margin-top:0}
.xc-ed .xc-hero{font-family:Lora,serif;font-weight:600;font-size:132px;letter-spacing:-.02em}
.xc-ed .xc-hero span{color:var(--ink);font-style:italic;font-size:112px}
.xc-ed .xc-sub{color:var(--ink);font-weight:400;border-top:1px solid var(--ink);padding-top:22px}
.xc-ed .xc-sub b{color:var(--ink);font-weight:600}
.xc-ed .xc-stair i{background:none;border:1px solid var(--ink);border-radius:0;height:14px}
.xc-ed .xc-stair::before{content:"";position:absolute;left:0;top:14px;height:32px;border-left:1px dashed var(--ink);opacity:.4}
.xc-ed .xc-stair:nth-last-child(5) i{border-color:var(--acc);background:var(--acc)}
.xc-ed .xc-stair-lbl{font-weight:500;font-size:22px;color:var(--ink)}
.xc-ed .xc-stair-lbl b{background:none;border:1px solid var(--ink);border-radius:0;color:var(--ink);font-family:'JetBrains Mono',monospace}
.xc-ed .xc-stair-dim{position:absolute;left:6px;top:18px;font:500 12px 'JetBrains Mono',monospace;color:var(--gray);letter-spacing:.06em;white-space:nowrap}
.xc-ed .xc-stair-top{color:var(--acc);font-family:Lora,serif;font-style:italic;font-weight:600}
.xc-ed .xc-stair-zero{color:var(--gray);font-family:'JetBrains Mono',monospace}
.xc-ed .xc-cdim-h{position:absolute;bottom:14px;height:0;border-top:1px solid var(--ink)}
.xc-ed .xc-cdim-h::before,.xc-ed .xc-cdim-h::after{content:"";position:absolute;top:-8px;height:16px;border-left:1px solid var(--ink)}
.xc-ed .xc-cdim-h::before{left:0} .xc-ed .xc-cdim-h::after{right:0}
.xc-ed .xc-cdim-h i{position:absolute;left:50%;top:-10px;transform:translateX(-50%);background:var(--paper);padding:0 10px;font:500 15px 'JetBrains Mono',monospace;font-style:normal;letter-spacing:.12em;white-space:nowrap}
.xc-ed .xc-cdim-v{position:absolute;bottom:50px;width:0;border-left:1px solid var(--ink)}
.xc-ed .xc-cdim-v::before,.xc-ed .xc-cdim-v::after{content:"";position:absolute;left:-8px;width:16px;border-top:1px solid var(--ink)}
.xc-ed .xc-cdim-v::before{top:0} .xc-ed .xc-cdim-v::after{bottom:0}
.xc-ed .xc-cdim-v i{position:absolute;top:50%;left:0;transform:translate(-50%,-50%) rotate(-90deg);background:var(--paper);padding:0 10px;white-space:nowrap;font:500 15px 'JetBrains Mono',monospace;font-style:normal;letter-spacing:.12em}
.xc-ed .xc-cover-foot{border-top:1px solid var(--ink);padding-top:18px}
.xc-ed .xc-cover-foot b{font-family:Lora,serif;font-weight:600;font-style:italic}
.xc-ed .xc-cover-foot span{color:var(--gray)}
.xc-ed .xc-sheet{margin-top:20px}
.xc-ed .xc-sheet li{border-width:0 0 1px 0!important;padding:14px 0}
.xc-ed .xc-sheet li:first-child{border-top-width:1px!important}
.xc-ed .xc-sheet b{background:none;border-radius:0;color:var(--acc);font:500 22px 'JetBrains Mono',monospace}
.xc-ed .xc-sheet-name{font-family:Lora,serif;font-weight:600}
.xc-ed .xc-sheet-rule{color:var(--ink);font-weight:400}
.xc-ed .xc-rule-cta{text-align:left}
.xc-ed .xc-card>*{flex-shrink:0}
.xc-ed .xc-card{padding:24px 32px;gap:6px}
.xc-ed .xc-chip i{font-size:22px;padding:4px 8px}
.xc-ed .xc-big{font-size:44px;margin:2px 0}
.xc-ed .xc-hbar{font-size:21px}
.xc-ed .xc-figure .xc-quote{font-size:26px}
.xc-ed .xc-loop{height:210px}
.xc-ed .xc-loop-c,.xc-ed .xc-stats div:last-child em{color:var(--acc)}
.xc-ed .xc-huge{font-size:96px}
/* ---------- 4:5 format, statement slide, motion primitives ---------- */
.xc-45{height:1350px;padding:64px 72px 48px}
.xc-45 .xc-lede{margin:10px 0 18px}
.xc-45 .xc-points{margin-top:18px;gap:10px}
.xc-45 .xc-rule{margin-top:18px}
.xc-grow{flex:1}
.xc-stmt .xc-kick-txt{font-size:24px;font-weight:700;letter-spacing:.14em;color:${C.blue};margin-top:8px}
.xc-stmt-hero{font-size:112px;line-height:1.04}
.xc-stmt-hero .xc-l1{font:inherit;color:inherit;display:inline;animation:xcUp .6s .1s both}
.xc-stmt-hero .xc-l2{display:inline-block;animation:xcUp .6s .5s both}
.xc-stmt-dim{position:relative;height:0;border-top:1px solid currentColor;margin:34px 0 8px;transform-origin:left;animation:xcDrawX 1s .8s both}
.xc-stmt-dim::before,.xc-stmt-dim::after{content:"";position:absolute;top:-8px;height:16px;border-left:1px solid currentColor}
.xc-stmt-dim::before{left:0} .xc-stmt-dim::after{right:0}
.xc-stmt-dim i{position:absolute;left:50%;top:-11px;transform:translateX(-50%);padding:0 12px;font:500 18px 'JetBrains Mono',monospace;font-style:normal;letter-spacing:.14em;white-space:nowrap;background:${C.bg}}
.xc-items{list-style:none;margin:30px 0 0;padding:0;display:grid;gap:22px}
.xc-items li{display:grid;grid-template-columns:52px 1fr;gap:18px;align-items:start;font-size:31px;line-height:1.32;animation:xcUp .45s both}
.xc-items b{font:500 26px 'JetBrains Mono',monospace;color:${C.orange};padding-top:3px}
@property --xcn{syntax:'<integer>';inherits:false;initial-value:0}
.xc-count{--xcn:var(--to);counter-reset:xcn var(--xcn);animation:xcCount 1.6s cubic-bezier(.2,.7,.2,1) both}
.xc-count::after{content:counter(xcn)}
@keyframes xcCount{from{--xcn:0}to{--xcn:var(--to)}}
.xc-statrows{display:grid;gap:18px}
.xc-statrow{display:grid;grid-template-columns:230px 1fr;align-items:center;column-gap:24px;row-gap:8px}
.xc-statrow em{font-style:normal;font-size:84px;font-weight:800;line-height:1}
.xc-statrow>span{font-size:30px;line-height:1.25}
.xc-statrow i{grid-column:1 / -1;height:16px;background:${C.blue};transform-origin:left;animation:xcDrawX 1.4s both}
.xc-statrow.hot em{color:${C.orange}} .xc-statrow.hot i{background:${C.orange}}
.xc-div{width:100%;height:auto;max-height:330px}
.xc-div path,.xc-div line{fill:none;stroke-dasharray:1;stroke-dashoffset:0;animation:xcStroke 1.6s .3s both}
.xc-div .xc-axis{stroke:${C.mut};stroke-width:1.5;animation-duration:.8s;animation-delay:0s}
.xc-div-up{stroke:${C.blue};stroke-width:4}
.xc-div-dn{stroke:${C.orange};stroke-width:4;stroke-dasharray:1}
.xc-div-dot{transform-box:fill-box;transform-origin:center;animation:xcPop .3s 1.9s both} .xc-div-dot.up{fill:${C.blue}} .xc-div-dot.dn{fill:${C.orange}}
.xc-div-lbl{display:flex;justify-content:space-between;font-size:28px;font-weight:600;margin-top:6px}
.xc-div-lbl .up{color:${C.blueSoft}} .xc-div-lbl .dn{color:${C.orange}}
.xc-ledger{list-style:none;margin:0;padding:0;display:grid;gap:34px}
.xc-ledger li{display:grid;grid-template-columns:64px 1fr;gap:18px;align-items:baseline;position:relative;padding-bottom:20px;animation:xcUp .45s both}
.xc-ledger b{font:500 26px 'JetBrains Mono',monospace;color:${C.orange}}
.xc-ledger span{font-size:40px;font-weight:700;line-height:1.2}
.xc-ledger i{position:absolute;left:82px;right:0;bottom:0;height:0;border-top:1.5px dashed ${C.mut};transform-origin:left;animation:xcDrawX 1s both}
@keyframes xcDrawX{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes xcDrawY{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes xcStroke{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.xc-ed .xc-dim-h{transform-origin:left;animation:xcDrawX 1s .2s both}
.xc-ed .xc-dim-v{transform-origin:top;animation:xcDrawY 1s .2s both}
.xc-ed.xc-stmt .xc-kick-txt{color:var(--acc);font:500 20px 'JetBrains Mono',monospace;letter-spacing:.16em}
.xc-ed .xc-stmt-hero{font-size:124px}
.xc-ed.xc-stmt .xc-sub{font-size:38px;line-height:1.35}
.xc-ed .xc-stmt-hero .xc-l2{color:var(--acc);font-size:116px}
.xc-ed .xc-stmt-dim{color:var(--ink)} .xc-ed .xc-stmt-dim i{background:var(--paper);color:var(--gray)}
.xc-ed .xc-items li{font-family:Lora,serif;font-weight:400;color:var(--ink);border-bottom:1px solid var(--hair);padding-bottom:18px}
.xc-ed .xc-items b{color:var(--acc)}
.xc-ed .xc-statrow em{font-family:Lora,serif;font-weight:600;color:var(--ink)}
.xc-ed .xc-statrow.hot em{color:var(--acc)}
.xc-ed .xc-statrow i{background:repeating-linear-gradient(-45deg,var(--ink) 0 1px,transparent 1px 7px);border:1px solid var(--ink)}
.xc-ed .xc-statrow.hot i{background:repeating-linear-gradient(-45deg,var(--acc) 0 1.5px,transparent 1.5px 6px);border-color:var(--acc)}
.xc-ed .xc-div .xc-axis{stroke:var(--ink);stroke-width:1}
.xc-ed .xc-div-up{stroke:var(--ink);stroke-width:2.5}
.xc-ed .xc-div-dn{stroke:var(--acc);stroke-width:2.5}
.xc-ed .xc-div-dot.up{fill:var(--ink)} .xc-ed .xc-div-dot.dn{fill:var(--acc)}
.xc-ed .xc-div-lbl{font-family:Lora,serif} .xc-ed .xc-div-lbl .up{color:var(--ink)} .xc-ed .xc-div-lbl .dn{color:var(--acc)}
.xc-ed .xc-ledger b{color:var(--acc)} .xc-ed .xc-ledger span{font-family:Lora,serif;font-weight:600}
.xc-ed .xc-ledger i{border-top:1px solid var(--ink)}
@keyframes xcUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes xcGrow{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}
@keyframes xcPop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}
@keyframes xcSpin{to{transform:rotate(360deg)}}
.xc-static .xc *,.xc-static .xc{animation:none!important}
@media (prefers-reduced-motion:reduce){.xc *{animation:none!important}}
`;
