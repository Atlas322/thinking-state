"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type Contender = {
  id: string;
  name: string;
  icon?: React.ReactNode;
  meta?: string;
  output?: string;
  /** A line of code shown under the output. */
  code?: string;
};
export type Verdict = { winner: string; reason?: string; scores?: [number, number] };

export type JudgeBracketProps = {
  contenders?: Contender[];
  verdicts?: Record<string, Verdict>;
  judging?: string;
  judge?: string;
  task?: string;
  onPick?: (winner: Contender) => void;
  title?: string;
  className?: string;
};

const ico = (c: React.ReactNode) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    {c}
  </svg>
);
export const judgeIcons = {
  research: ico(
    <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="7" cy="7" r="4" />
      <path d="m10 10 3.5 3.5" />
    </g>,
  ),
  code: ico(<path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />),
  review: ico(<path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />),
  ops: ico(
    <g fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.8v2M8 12.2v2M1.8 8h2M12.2 8h2M3.6 3.6l1.4 1.4M11 11l1.4 1.4M3.6 12.4 5 11M11 5l1.4-1.4" strokeLinecap="round" />
    </g>,
  ),
};

const defaultContenders: Contender[] = [
  { id: "idem", name: "Давтагдашгүй түлхүүр", icon: judgeIcons.code, meta: "Кодын агент · +18 −4 · 3 файл · 42/42 тест", output: "Захиалга бүрт нэг түлхүүр илгээдэг тул дахин оролдоход төлбөрийн систем эхний гүйлгээг буцаана, хоёр дахийг үүсгэхгүй.", code: "payments.create(params, { idempotency_key: checkout.id })" },
  { id: "guard", name: "Давталтын хамгаалалт", icon: judgeIcons.research, meta: "Судлаач агент · +22 −3 · 2 файл · 40/42 тест", output: "Сүүлийн нэг минутад тухайн захиалгын төлбөр аль хэдийн байвал дахин оролдохгүй." },
  { id: "lock", name: "Мөрийн түгжээ", icon: judgeIcons.review, meta: "Шалгагч агент · +31 −6 · 4 файл · 42/42 тест", output: "Төлбөр авахаас өмнө захиалгын мөрийг түгждэг тул хоёр хүсэлт нэг захиалгаас давхар төлбөр авч чадахгүй.", code: "SELECT … FROM public.orders WHERE order_id = :order_id FOR UPDATE" },
  { id: "noretry", name: "Давталтгүй", icon: judgeIcons.ops, meta: "Үйл ажиллагааны агент · +2 −9 · 1 файл · 38/42 тест", output: "Төлбөрийн дуудлагын автомат давталтыг унтраана." },
  { id: "hook", name: "Давхар мэдэгдэл", icon: judgeIcons.code, meta: "Кодын агент · +26 −2 · 3 файл · 42/42 тест", output: "Аль хэдийн боловсруулсан үйл явдлын дугаартай гадны мэдэгдлийг хаяна." },
  { id: "state", name: "Төлөвийн машин", icon: judgeIcons.research, meta: "Судлаач агент · +64 −20 · 6 файл · 41/42 тест", output: "Захиалгыг хүлээгдэж буй, төлж буй, төлсөн төлөвөөр шилжүүлнэ; зөвхөн хүлээгдэж буй захиалгаас төлбөр авна." },
  { id: "debounce", name: "Товчны саатал", icon: judgeIcons.review, meta: "Шалгагч агент · +6 −1 · 1 файл · 36/42 тест", output: "Дарсны дараа төлөх товчийг хоёр секунд идэвхгүй болгоно." },
  { id: "refund", name: "Дараа буцаах", icon: judgeIcons.ops, meta: "Үйл ажиллагааны агент · +40 −0 · 2 файл · 39/42 тест", output: "Шөнө бүр давхар төлбөрийг олж, хоёр дахийг нь буцаана." },
];
const defaultVerdicts: Record<string, Verdict> = {
  "0:0": { winner: "idem", scores: [9.1, 6.2] },
  "0:1": { winner: "lock", scores: [8.3, 4.1] },
  "0:2": { winner: "hook", scores: [8.7, 7.2] },
  "0:3": { winner: "refund", scores: [3.8, 5.1] },
};

const SLOT = 40;
const GAP = 4;
const BLOCK = 100;
const COLW = 208;
const COLGAP = 28;

const roundName = (r: number, rounds: number) => {
  const left = rounds - r;
  return left === 1 ? "Финал" : left === 2 ? "Хагас финал" : left === 3 ? "Шөвгийн найм" : `${r + 1}-р шат`;
};

export function JudgeBracket({
  contenders = defaultContenders,
  verdicts = defaultVerdicts,
  judging = "1:0",
  judge = "Шүүгч агент",
  task = "Засвар: төлбөрийг дахин оролдоход харилцагчаас давхар төлбөр авч байна",
  onPick,
  title = "Шүүгч",
  className = "",
}: JudgeBracketProps) {
  const rounds = Math.max(1, Math.round(Math.log2(contenders.length)));
  // entrants[r] = the contenders standing in round r (null = not decided yet)
  const entrants = React.useMemo(() => {
    const out: (Contender | null)[][] = [contenders];
    for (let r = 0; r < rounds; r++) {
      const prev = out[r];
      const next: (Contender | null)[] = [];
      for (let m = 0; m < prev.length / 2; m++) {
        const v = verdicts[`${r}:${m}`];
        next.push(v ? contenders.find((c) => c.id === v.winner) ?? null : null);
      }
      out.push(next);
    }
    return out;
  }, [contenders, verdicts, rounds]);

  const totalMatches = contenders.length - 1;
  const decidedCount = Object.keys(verdicts).length;
  const champion = entrants[rounds][0];
  const [sel, setSel] = React.useState<string | null>(null);
  const shown = sel ?? judging ?? `${rounds - 1}:0`;
  const [sr, sm] = shown.split(":").map(Number);
  const pair = [entrants[sr]?.[sm * 2], entrants[sr]?.[sm * 2 + 1]];
  const shownVerdict = verdicts[shown];
  const jr = judging ? Number(judging.split(":")[0]) : rounds - 1;

  const winPath = React.useMemo(() => {
    const s = new Set<string>();
    if (!champion) return s;
    for (let r = 0; r <= rounds; r++) s.add(`${r}:${champion.id}`);
    return s;
  }, [champion, rounds]);

  // vertical center of slot i in round r (round r has contenders.length / 2^r slots)
  const center = (r: number, i: number): number => {
    if (r === 0) {
      const m = Math.floor(i / 2);
      return m * BLOCK + (i % 2) * (SLOT + GAP) + SLOT / 2;
    }
    return (center(r - 1, i * 2) + center(r - 1, i * 2 + 1)) / 2;
  };
  const height = (contenders.length / 2) * BLOCK - (BLOCK - (SLOT * 2 + GAP));
  const cols = rounds;
  const width = cols * COLW + (cols - 1) * COLGAP;

  const slot = (r: number, i: number) => {
    const c = entrants[r][i];
    const m = Math.floor(i / 2);
    const key = `${r}:${m}`;
    const v = r < rounds ? verdicts[key] : undefined;
    const lost = v && c && v.winner !== c.id;
    const won = v && c && v.winner === c.id;
    const isJudging = judging === key && r < rounds;
    const score = v?.scores?.[i % 2];
    const top = center(r, i) - SLOT / 2;
    const left = r * (COLW + COLGAP);
    const finalSlot = r === rounds - 1 && !!won;
    if (!c)
      return <div key={`${r}-${i}`} className="jb-slot is-empty" style={{ top, left }} aria-hidden="true" />;
    return (
      <button
        key={`${r}-${i}`}
        type="button"
        className={`jb-slot ${lost ? "is-lost" : ""} ${won ? "is-won" : ""} ${isJudging ? "is-judging" : ""} ${winPath.has(`${r}:${c.id}`) ? "is-path" : ""} ${sel === key ? "is-sel" : ""}`}
        style={{ top, left }}
        aria-label={
          r < rounds
            ? `${roundName(r, rounds)} ${m + 1}: ${entrants[r][m * 2]?.name ?? "Тодорхойгүй"} ба ${entrants[r][m * 2 + 1]?.name ?? "Тодорхойгүй"}${v ? `, ${contenders.find((x) => x.id === v.winner)?.name} хожсон` : isJudging ? ", шүүгдэж байна" : ""}`
            : `Ялагч: ${c.name}`
        }
        onClick={() => r < rounds && setSel(sel === key ? null : key)}
      >
        <span className="jb-ico">{c.icon}</span>
        <span className="jb-name">{c.name}</span>
        {finalSlot ? (
          <svg className="jb-cup" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.5h7v3a3.5 3.5 0 0 1-7 0Zm0 1.2H2.5a2 2 0 0 0 2 2.3M11.5 3.7h2a2 2 0 0 1-2 2.3M8 9v3M5.5 13.5h5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
        ) : score != null ? (
          <span className="jb-score">{score.toFixed(1)}</span>
        ) : null}
      </button>
    );
  };

  const lines: React.ReactNode[] = [];
  for (let r = 0; r < rounds - 1; r++) {
    for (let i = 0; i < entrants[r].length; i++) {
      const c = entrants[r][i];
      const m = Math.floor(i / 2);
      const v = verdicts[`${r}:${m}`];
      const y1 = center(r, i);
      const y2 = center(r + 1, m);
      const x1 = r * (COLW + COLGAP) + COLW;
      const xm = x1 + COLGAP / 2;
      const x2 = x1 + COLGAP;
      const lost = v && c && v.winner !== c.id;
      const path = c && winPath.has(`${r + 1}:${c.id}`);
      lines.push(
        <path
          key={`${r}-${i}`}
          d={`M${x1} ${y1}H${xm - 4}Q${xm} ${y1} ${xm} ${y1 + Math.sign(y2 - y1) * 4}V${y2 - Math.sign(y2 - y1) * 4}Q${xm} ${y2} ${xm + 4} ${y2}H${x2}`}
          className={`${lost || !v ? "is-dash" : ""} ${path ? "is-path" : ""}`}
        />,
      );
    }
  }

  const cardFor = (c: Contender | null | undefined, idx: number) =>
    c ? (
      <div className={`jb-ans ${shownVerdict && shownVerdict.winner !== c.id ? "is-lost" : ""}`}>
        <div className="jb-ans-h">
          <span className="jb-ico">{c.icon}</span>
          <strong>{c.name}</strong>
          {shownVerdict?.scores && <span className="jb-score">{shownVerdict.scores[idx].toFixed(1)}</span>}
        </div>
        {c.meta && <div className="jb-meta">{c.meta}</div>}
        {c.output && <p>{c.output}</p>}
        {c.code && <code>{c.code}</code>}
      </div>
    ) : (
      <div className="jb-ans is-tbd">Өмнөх тоглолтыг хүлээж байна</div>
    );

  return (
    <section className={`jb ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="jb-bar">
        <svg viewBox="0 0 16 16" className="jb-mark" aria-hidden="true">
          <path d="M2 3.5h3v3H2M2 9.5h3v3H2M5 5v6M5 8h3" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="11" cy="8" r="2.3" fill="currentColor" />
        </svg>
        <strong>{title}</strong>
        {task && <span className="jb-task">{task}</span>}
        <span className={`jb-state ${champion ? "is-done" : ""}`}>
          {champion ? (
            <>Ялагч · {champion.name}</>
          ) : (
            <>
              <span className="jb-spin" aria-hidden="true" />
              Шүүж байна
            </>
          )}
        </span>
        <span className="jb-round">
          {champion ? "Финал" : roundName(jr, rounds)} · {decidedCount}/{totalMatches}
        </span>
      </header>
      <div className="jb-scroll">
        <div className="jb-heads" style={{ width }}>
          {Array.from({ length: rounds }, (_, r) => (
            <span key={r} style={{ left: r * (COLW + COLGAP) }}>
              {roundName(r, rounds)}
            </span>
          ))}
        </div>
        <div className="jb-tree" style={{ width, height }}>
          <svg className="jb-lines" width={width} height={height} aria-hidden="true">
            {lines}
          </svg>
          {entrants.slice(0, rounds).map((list, r) => list.map((_, i) => slot(r, i)))}
        </div>
      </div>
      <div className="jb-detail" aria-live="polite">
        <div className="jb-detail-h">
          <strong>
            {roundName(sr, rounds)} {entrants[sr].length > 2 ? sm + 1 : ""}
          </strong>
          <span>
            {shownVerdict
              ? `${judge} сонгосон: ${contenders.find((c) => c.id === shownVerdict.winner)?.name}${shownVerdict.reason ? ` – ${shownVerdict.reason}` : ""}`
              : shown === judging
                ? `${judge} харьцуулж байна…`
                : "Хараахан шүүгээгүй"}
          </span>
        </div>
        <div className="jb-pair">
          {cardFor(pair[0], 0)}
          {cardFor(pair[1], 1)}
        </div>
        {champion && onPick && sr === rounds - 1 && (
          <button type="button" className="jb-use" onClick={() => onPick(champion)}>
            Ашиглах: {champion.name}
          </button>
        )}
      </div>
    </section>
  );
}

const css = `
.jb{--jb-bg:#fff;--jb-fg:#18181b;--jb-muted:#65656d;--jb-faint:#65656d;--jb-line:#ececef;--jb-wire:#d4d4d8;--jb-chip:#f4f4f5;--jb-blue:#3b82f6;--jb-link:#82bcff;width:100%;max-width:${3 * COLW + 2 * COLGAP}px;color:var(--jb-fg);font:400 13px/1.45 Inter,system-ui,sans-serif;font-variant-numeric:tabular-nums}
:where(.dark,[data-theme=dark]) .jb{--jb-bg:#1b1b1e;--jb-fg:#ececef;--jb-muted:#a1a1aa;--jb-faint:#9a9aa2;--jb-line:#2e2e33;--jb-wire:#3f3f46;--jb-chip:#26262a;color-scheme:dark}
.jb *{box-sizing:border-box}.jb button{font:inherit;color:inherit;cursor:pointer}
.jb-bar{display:flex;align-items:center;gap:8px;white-space:nowrap}
.jb-mark{width:14px;height:14px;color:var(--jb-muted);flex:none}
.jb-bar strong{font-size:14px;font-weight:500}
.jb-task{color:var(--jb-muted);overflow:hidden;text-overflow:ellipsis;min-width:0;font-size:13px}
.jb-state{display:inline-flex;align-items:center;gap:5px;margin-left:auto;padding:1px 6px;border-radius:4px;background:#e8f0fe;color:#2563eb;font-size:11px;font-weight:500}
.jb-state.is-done{background:#dcfce7;color:#15803d}
.jb-spin{width:9px;height:9px;border:1.4px solid #93c5fd;border-top-color:#2563eb;border-radius:50%;animation:jb-spin .8s linear infinite}
.jb-round{margin-left:28px;color:var(--jb-muted);font-size:12px}
.jb-scroll{overflow-x:auto;margin-top:12px}
.jb-heads{position:relative;height:22px}
.jb-heads span{position:absolute;top:0;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--jb-faint)}
.jb-tree{position:relative}
.jb-lines{position:absolute;inset:0;overflow:visible}
.jb-lines path{fill:none;stroke:var(--jb-wire);stroke-width:1.2}
.jb-lines .is-dash{stroke-dasharray:2 3}.jb-lines .is-path{stroke:var(--jb-link);stroke-width:1.6;stroke-dasharray:none}
.jb-slot{position:absolute;display:flex;align-items:center;gap:10px;width:${COLW}px;height:${SLOT}px;padding:0 10px 0 12px;border:0;border-radius:8px;background:var(--jb-bg);box-shadow:0 0 0 1px var(--jb-line),0 1px 2px #0000000a;text-align:left;transition:opacity .2s,box-shadow .15s}
.jb-slot:hover{box-shadow:0 0 0 1px var(--jb-wire),0 1px 3px #00000014}
.jb-slot.is-lost{background:color-mix(in srgb,var(--jb-chip) 60%,var(--jb-bg));box-shadow:0 0 0 1px var(--jb-line)}
.jb-slot.is-lost .jb-name,.jb-slot.is-lost .jb-score,.jb-slot.is-lost .jb-ico{opacity:.6;color:var(--jb-muted)}
.jb-slot.is-lost .jb-ico{filter:grayscale(1)}
.jb-slot.is-sel{box-shadow:0 0 0 1.5px var(--jb-link)}
.jb-slot.is-path{box-shadow:0 0 0 1.5px var(--jb-link)}
.jb-slot.is-judging .jb-name{background:linear-gradient(90deg,var(--jb-fg) 35%,var(--jb-faint) 50%,var(--jb-fg) 65%) 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:jb-shim 1.6s linear infinite}
.jb-slot.is-empty{background:none;border:1px dashed var(--jb-wire);box-shadow:none}
.jb-ico{display:grid;place-items:center;width:14px;height:14px;flex:none}.jb-ico svg{width:12px;height:12px}
.jb-name{flex:1;min-width:0;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.jb-score{font-size:11px;color:var(--jb-fg)}
.jb-cup{width:15px;height:15px;color:#d97706}
.jb-detail{margin-top:18px;padding:14px;border:1px solid var(--jb-line);border-radius:12px;background:var(--jb-bg);box-shadow:0 1px 2px #0000000a}
.jb-detail-h{display:flex;justify-content:space-between;gap:12px;margin-bottom:12px}
.jb-detail-h strong{font-size:14px;font-weight:500}.jb-detail-h span{color:var(--jb-muted);font-size:12px;text-align:right}
.jb-pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.jb-ans{padding:10px 10px 10px 10px;border:1px solid var(--jb-line);border-radius:8px;background:color-mix(in srgb,var(--jb-chip) 50%,var(--jb-bg));transition:opacity .2s}
.jb-ans.is-lost{opacity:.55}.jb-ans.is-tbd{display:grid;place-items:center;min-height:90px;color:var(--jb-faint)}
.jb-ans-h{display:flex;align-items:center;gap:10px}.jb-ans-h strong{font-weight:500}.jb-ans-h .jb-score{margin-left:auto}
.jb-meta{margin-top:4px;font-size:11px;color:var(--jb-faint)}
.jb-ans p{margin:6px 0 0;font-size:12px;color:var(--jb-fg);opacity:.82}
.jb-ans code{display:block;margin-top:2px;font:12px/1.5 Inter,system-ui,sans-serif;color:var(--jb-fg);opacity:.82;word-break:break-word}
.jb-use{margin-top:12px;height:30px;padding:0 12px;border:0;border-radius:7px;background:var(--jb-fg);color:var(--jb-bg)!important;font-weight:500}
.jb :focus-visible{outline:2px solid var(--jb-blue);outline-offset:2px}
@keyframes jb-spin{to{transform:rotate(1turn)}}@keyframes jb-shim{to{background-position:-250% 0}}
@media(max-width:560px){.jb-task,.jb-round{display:none}.jb-pair{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.jb *{animation:none!important;transition:none!important}}
`;

export default JudgeBracket;
