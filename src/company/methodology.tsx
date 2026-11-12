import * as React from "react";
import { toPhaseState } from "../library/project-report";
import {
  PM_AREAS,
  PM_PHASES,
  actorOf,
  modelLines,
  toPmArea,
  toPmPhase,
  type Company,
  type CompanyModel,
  type CompanyProject,
  type CompanyTask,
  type Methodology,
  type PmKnowledgeArea,
  type PmPhase,
} from "./types";
import { Avatar, Lines } from "./ui";
import { Empty } from "./collection";

/**
 * Methodology templates — the same company core drawn the way the
 * organisation manages itself (2026-11-12 decision: Thinking State follows
 * the organisation's own method).
 *  - bmc: Business Model Canvas, then projects → tasks → notes under it
 *  - lean-canvas: problem → solution → key metrics → unfair advantage
 *  - okr: objectives with key-result progress
 *  - pmbok: 5 process groups × 10 knowledge areas, Facts hub, Gantt
 */

export const methodologyName: Record<Methodology, string> = {
  bmc: "Бизнес загварын канвас",
  "lean-canvas": "Лийн канвас",
  okr: "OKR",
  pmbok: "PMBOK",
};
export const methodologyShort: Record<Methodology, string> = { bmc: "BMC", "lean-canvas": "Лийн", okr: "OKR", pmbok: "PMBOK" };

type Block = { key: keyof CompanyModel; area: string; title: string; hint: string };

const BMC: Block[] = [
  { key: "partners", area: "kp", title: "Гол түнш", hint: "Хэнтэй хамтрах вэ" },
  { key: "activities", area: "ka", title: "Гол үйл ажиллагаа", hint: "Юу хийх вэ" },
  { key: "resources", area: "kr", title: "Гол нөөц", hint: "Юу хэрэгтэй вэ" },
  { key: "value", area: "vp", title: "Үнэ цэнийн санал", hint: "Ямар үнэ цэнэ өгөх вэ" },
  { key: "relationships", area: "cr", title: "Харилцагчтай харилцаа", hint: "Хэрхэн харилцах вэ" },
  { key: "channels", area: "ch", title: "Суваг", hint: "Хэрхэн хүрэх вэ" },
  { key: "customers", area: "cs", title: "Үйлчлүүлэгчийн сегмент", hint: "Хэнд зориулах вэ" },
  { key: "costs", area: "co", title: "Зардлын бүтэц", hint: "Юунд зарцуулах вэ" },
  { key: "revenue", area: "rv", title: "Орлогын урсгал", hint: "Юугаар орлого олох вэ" },
];
const LEAN: Block[] = [
  { key: "problem", area: "kp", title: "Асуудал", hint: "Ямар асуудал вэ" },
  { key: "solution", area: "ka", title: "Шийдэл", hint: "Хэрхэн шийдэх вэ" },
  { key: "metrics", area: "kr", title: "Гол хэмжүүр", hint: "Юугаар хэмжих вэ" },
  { key: "value", area: "vp", title: "Өвөрмөц санал", hint: "Яагаад биднийг сонгох вэ" },
  { key: "advantage", area: "cr", title: "Өрсөлдөхүйц давуу тал", hint: "Юугаар давуу вэ" },
  { key: "channels", area: "ch", title: "Суваг", hint: "Хэрхэн хүрэх вэ" },
  { key: "customers", area: "cs", title: "Үйлчлүүлэгчийн сегмент", hint: "Хэнд зориулах вэ" },
  { key: "costs", area: "co", title: "Зардлын бүтэц", hint: "Юунд зарцуулах вэ" },
  { key: "revenue", area: "rv", title: "Орлогын урсгал", hint: "Юугаар орлого олох вэ" },
];

function Canvas({ c, blocks, label, hideEmpty = false }: { c: Company; blocks: Block[]; label: string; hideEmpty?: boolean }) {
  // null = not published: always hidden. Unfilled blocks only with hideEmpty.
  const shown = blocks.filter((b) => c.model[b.key] !== null && (!hideEmpty || modelLines(c.model[b.key]).length > 0));
  // Missing blocks break the 5-column canvas areas, so the rest flows instead.
  const flow = shown.length < blocks.length;
  if (!shown.length) return null;
  return (
    <div className={`cv-bmc${flow ? " is-flow" : ""}`} role="group" aria-label={label}>
      {shown.map((b, i) => (
        <section key={b.key} className={`cv-bmc-cell is-${b.area}`} style={{ gridArea: flow ? undefined : b.area, "--i": i } as React.CSSProperties} aria-label={b.title}>
          <h4>
            {b.title}
            <small>{b.hint}</small>
          </h4>
          <Lines f={c.model[b.key]} empty="Бөглөөгүй" />
        </section>
      ))}
    </div>
  );
}

function BmcView({ c, scoped, hideEmpty = false }: { c: Company; scoped: Company; hideEmpty?: boolean }) {
  const notes = scoped.notes ?? [];
  return (
    <div className="cv-method">
      <Canvas c={c} blocks={BMC} label="Бизнес загварын канвас" hideEmpty={hideEmpty} />
      <div className="cv-below">
        <section className="cv-below-col" aria-label="Төсөл ба даалгавар">
          <h4 className="cv-below-h">Төсөл → даалгавар</h4>
          {scoped.projects.length ? (
            <ul className="cv-plist">
              {scoped.projects.map((p) => {
                const done = p.tasks.filter((t) => toPhaseState(t.status) === "done").length;
                return (
                  <li key={p.id}>
                    <span className="cv-plist-top">
                      <i className={`cv-dot is-${toPhaseState(p.status)}`} aria-hidden="true" />
                      <strong>{p.name}</strong>
                      <span className="cv-plist-n">
                        {done}/{p.tasks.length}
                      </span>
                    </span>
                    {p.tasks.length > 0 && (
                      <ul className="cv-tlist">
                        {p.tasks.map((t) => (
                          <li key={t.id} className={`is-${toPhaseState(t.status)}`}>
                            {t.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="cv-none">Төсөл алга.</p>
          )}
        </section>
        <section className="cv-below-col" aria-label="Нот">
          <h4 className="cv-below-h">Нот</h4>
          {notes.length ? (
            <ul className="cv-notes">
              {notes.map((n) => (
                <li key={n.id}>
                  <span className="cv-note-title">{n.title}</span>
                  <span className="cv-note-meta">
                    {[n.projectId ? c.projects.find((p) => p.id === n.projectId)?.name : null, n.date].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cv-none">Нот алга.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function OkrView({ c, scoped }: { c: Company; scoped: Company }) {
  const okrs = scoped.okrs ?? [];
  if (!okrs.length) return <Empty text="OKR бүртгэгдээгүй." icon="layout-template" />;
  return (
    <div className="cv-okrs">
      {okrs.map((o, i) => {
        const avg = o.keyResults.length ? Math.round(o.keyResults.reduce((n, k) => n + Math.max(0, Math.min(100, k.progress)), 0) / o.keyResults.length) : 0;
        const owner = o.ownerId ? actorOf(c, o.ownerId) : null;
        return (
          <article key={o.id} className="cv-okr" style={{ "--i": i } as React.CSSProperties} aria-label={o.title}>
            <header>
              <span className="cv-okr-o">O{i + 1}</span>
              <strong>{o.title}</strong>
              <span className="cv-okr-pct">{avg}%</span>
            </header>
            {owner && (
              <span className="cv-okr-owner">
                <Avatar actor={owner} size={18} /> {owner.name}
              </span>
            )}
            <ul>
              {o.keyResults.map((k, j) => (
                <li key={k.id}>
                  <span className="cv-kr-t">
                    <span className="cv-okr-k">KR{j + 1}</span>
                    {k.title}
                  </span>
                  <span className="cv-kr-bar" role="progressbar" aria-label={k.title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(k.progress)}>
                    <span style={{ width: `${Math.max(0, Math.min(100, k.progress))}%` }} />
                  </span>
                  <span className="cv-kr-n">{Math.round(k.progress)}%</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

const PHASE_NAME: Record<PmPhase, string> = {
  initiating: "Эхлүүлэх",
  planning: "Төлөвлөх",
  executing: "Гүйцэтгэх",
  monitoring: "Хянах",
  closing: "Хаах",
};
const AREA_NAME: Record<PmKnowledgeArea, string> = {
  integration: "Нэгтгэл",
  scope: "Хамрах хүрээ",
  schedule: "Хуваарь",
  cost: "Зардал",
  quality: "Чанар",
  resource: "Нөөц",
  communications: "Харилцаа",
  risk: "Эрсдэл",
  procurement: "Худалдан авалт",
  stakeholder: "Оролцогч",
};

type PmItem = { p: CompanyProject; t: CompanyTask; phase: PmPhase | null; area: PmKnowledgeArea | null; start: number | null; end: number | null };
const ts = (d?: string) => {
  if (!d) return null;
  const n = Date.parse(d.length === 10 ? `${d}T00:00:00` : d);
  return Number.isFinite(n) ? n : null;
};

function PmbokView({ c, scoped, today }: { c: Company; scoped: Company; today: Date }) {
  const [cell, setCell] = React.useState<string | null>(null);
  const items: PmItem[] = scoped.projects.flatMap((p) =>
    p.tasks.map((t) => ({
      p,
      t,
      phase: toPmPhase(t.phase ?? p.phase),
      area: toPmArea(t.knowledgeArea ?? p.knowledgeArea),
      start: ts(t.start ?? p.start),
      end: ts(t.end ?? t.due ?? p.end),
    })),
  );
  const at = (ph: PmPhase, ar: PmKnowledgeArea) => items.filter((x) => x.phase === ph && x.area === ar);
  const max = Math.max(1, ...PM_PHASES.flatMap((ph) => PM_AREAS.map((ar) => at(ph, ar).length)));
  const picked = cell ? items.filter((x) => `${x.phase}|${x.area}` === cell) : [];

  // Facts hub: figures computed from one source, plus the company's own facts.
  const done = items.filter((x) => toPhaseState(x.t.status) === "done").length;
  const live = PM_PHASES.map((ph) => ({ ph, n: items.filter((x) => x.phase === ph && toPhaseState(x.t.status) === "active").length })).sort((a, b) => b.n - a.n)[0];
  const starts = items.map((x) => x.start).filter((n): n is number => n != null);
  const ends = items.map((x) => x.end).filter((n): n is number => n != null);
  // Local calendar date (toISOString would shift local midnight across UTC).
  const fmt = (n: number) => {
    const d = new Date(n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const facts = [
    { label: "Даалгавар", value: String(items.length) },
    { label: "Гүйцэтгэл", value: items.length ? `${Math.round((done / items.length) * 100)}%` : "0%" },
    { label: "Идэвхтэй бүлэг", value: live && live.n ? PHASE_NAME[live.ph] : "Алга" },
    { label: "Хугацаа", value: starts.length && ends.length ? `${fmt(Math.min(...starts))} → ${fmt(Math.max(...ends))}` : "Тодорхойгүй" },
    { label: "Шийдвэр", value: String(scoped.projects.reduce((n, p) => n + p.decisions.length, 0)) },
    ...(c.facts ?? []),
  ];

  // Gantt over the tasks that have dates.
  const dated = items.filter((x) => x.start != null && x.end != null).sort((a, b) => a.start! - b.start!);
  const lo = dated.length ? Math.min(...dated.map((x) => x.start!)) : 0;
  const hi = dated.length ? Math.max(...dated.map((x) => x.end!)) : 1;
  const span = Math.max(1, hi - lo);
  const pct = (n: number) => ((n - lo) / span) * 100;
  const months: { at: number; label: string }[] = [];
  if (dated.length) {
    const d = new Date(lo);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    for (let guard = 0; d.getTime() < hi && guard < 36; guard++) {
      // Short labels so they fit on phones: the year only on its first month.
      const m = String(d.getMonth() + 1).padStart(2, "0");
      months.push({ at: pct(d.getTime()), label: d.getMonth() === 0 || !months.length ? `${d.getFullYear()}.${m}` : m });
      d.setMonth(d.getMonth() + 1);
    }
  }
  const now = today.getTime();

  return (
    <div className="cv-method">
      <section className="cv-facts" aria-label="Баримтын төв">
        <h4 className="cv-below-h">Баримтын төв</h4>
        <dl>
          {facts.map((f, i) => (
            <div key={f.label + i} style={{ "--i": i } as React.CSSProperties}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Процессын бүлэг × мэдлэгийн чиглэл">
        <h4 className="cv-below-h">5 процессын бүлэг × 10 мэдлэгийн чиглэл</h4>
        <div className="cv-pm-scroll" tabIndex={0} role="region" aria-label="PMBOK матриц">
          <table className="cv-pm">
            <thead>
              <tr>
                <th scope="col" />
                {PM_PHASES.map((ph) => (
                  <th key={ph} scope="col">
                    {PHASE_NAME[ph]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PM_AREAS.map((ar) => (
                <tr key={ar}>
                  <th scope="row">{AREA_NAME[ar]}</th>
                  {PM_PHASES.map((ph) => {
                    const list = at(ph, ar);
                    const key = `${ph}|${ar}`;
                    const finished = list.filter((x) => toPhaseState(x.t.status) === "done").length;
                    return (
                      <td key={ph}>
                        {list.length ? (
                          <button
                            type="button"
                            className="cv-pm-cell"
                            aria-pressed={cell === key}
                            style={{ "--a": list.length / max, "--d": finished / list.length } as React.CSSProperties}
                            onClick={() => setCell(cell === key ? null : key)}
                            title={list.map((x) => x.t.title).join("\n")}
                          >
                            {list.length}
                            <span className="cv-sr">
                              {" "}
                              даалгавар, {AREA_NAME[ar]} · {PHASE_NAME[ph]}
                            </span>
                          </button>
                        ) : (
                          <span className="cv-raci-dot" aria-hidden="true" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {picked.length > 0 && (
          <ul className="cv-pm-picked">
            {picked.map((x) => (
              <li key={x.p.id + x.t.id}>
                <i className={`cv-dot is-${toPhaseState(x.t.status)}`} aria-hidden="true" />
                {x.t.title}
                {x.t.ownerId && <small>{actorOf(c, x.t.ownerId).name}</small>}
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && items.every((x) => !x.phase || !x.area) && <p className="cv-none">Даалгавруудад үе шат, мэдлэгийн чиглэл бүртгэгдээгүй.</p>}
      </section>

      <section aria-label="Гант график">
        <h4 className="cv-below-h">Гант график</h4>
        {dated.length ? (
          <div className="cv-gantt">
            <div className="cv-gantt-scale" aria-hidden="true">
              {months.map((m) => (
                <span key={m.label} style={{ left: `${m.at}%` }}>
                  {m.label}
                </span>
              ))}
            </div>
            <ol className="cv-gantt-rows">
              {dated.map((x, i) => {
                const s = toPhaseState(x.t.status);
                return (
                  <li key={x.p.id + x.t.id} style={{ "--i": i } as React.CSSProperties}>
                    <span className="cv-gantt-label">{x.t.title}</span>
                    <span className="cv-gantt-track">
                      {months.map((m) => (
                        <i key={m.label} className="cv-gantt-grid" style={{ left: `${m.at}%` }} />
                      ))}
                      <span
                        className={`cv-gantt-bar is-${s}`}
                        style={{ left: `${pct(x.start!)}%`, width: `${Math.max(1.2, pct(x.end!) - pct(x.start!))}%` }}
                        title={`${fmt(x.start!)} → ${fmt(x.end!)}`}
                      />
                      {now >= lo && now <= hi && <i className="cv-gantt-today" style={{ left: `${pct(now)}%` }} />}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="cv-legend">
              <span className="cv-gantt-key is-done" /> Дууссан <span className="cv-gantt-key is-active" /> Явж байна <span className="cv-gantt-key is-blocked" /> Хүлээгдэж байна{" "}
              <span className="cv-gantt-key is-next" /> Дараа <span className="cv-gantt-key is-today" /> Өнөөдөр
            </p>
          </div>
        ) : (
          <p className="cv-none">Эхлэх, дуусах огноотой даалгавар алга.</p>
        )}
      </section>
    </div>
  );
}

export function MethodologyView({
  c,
  scoped,
  methodology,
  today = new Date(),
  hideEmpty = false,
}: {
  c: Company;
  scoped: Company;
  methodology: Methodology;
  today?: Date;
  /** Public pages: show only filled canvas blocks; the rest flows in an auto-fill grid. */
  hideEmpty?: boolean;
}) {
  if (methodology === "pmbok") return <PmbokView c={c} scoped={scoped} today={today} />;
  if (methodology === "okr") return <OkrView c={c} scoped={scoped} />;
  if (methodology === "lean-canvas")
    return (
      <div className="cv-method">
        <Canvas c={c} blocks={LEAN} label="Лийн канвас" hideEmpty={hideEmpty} />
      </div>
    );
  return <BmcView c={c} scoped={scoped} hideEmpty={hideEmpty} />;
}

export const methodologyCss = `
.cv-method{display:flex;flex-direction:column;gap:18px;container:cv/inline-size}
.cv-bmc{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-areas:"kp ka vp cr cs" "kp kr vp ch cs" "co co co rv rv";gap:6px}
.cv-bmc.is-flow{grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr));grid-template-areas:none}
.cv-bmc-cell{min-width:0;padding:12px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 40ms)}
.cv-bmc-cell h4{display:flex;flex-direction:column;gap:1px;margin:0 0 8px;font:600 11px/1.3 var(--ts-font-mono,ui-monospace,SFMono-Regular,Menlo,monospace);letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-bmc-cell h4 small{font-size:10.5px;font-weight:400;letter-spacing:.03em;color:var(--cv-faint)}
.cv-bmc-cell .cv-model-text{font-size:15px;font-weight:500}
.cv-bmc-cell .cv-model-list{gap:0}
.cv-bmc-cell .cv-model-list li{padding:7px 0;font-size:15px;font-weight:500;line-height:1.35;border-bottom:1px solid var(--cv-line)}
.cv-bmc-cell .cv-model-list li:last-child{border-bottom:0}
.cv-bmc-cell.is-vp{background:linear-gradient(160deg,var(--cv-accent-soft),var(--cv-bg) 75%);border-color:color-mix(in srgb,var(--cv-accent) 35%,var(--cv-line))}
.cv-bmc-cell.is-vp .cv-model-text{font-family:var(--ts-font-display,inherit);font-size:19px;font-weight:500;line-height:1.4}
.cv-none.cv-model-text{color:var(--cv-faint);font-size:13px}
.cv-below{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:12px}
.cv-below-col{min-width:0;padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cv-below-h{margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--cv-muted)}
.cv-plist,.cv-notes{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.cv-plist-top{display:flex;align-items:center;gap:8px}
.cv-plist-top strong{flex:1;min-width:0;font-weight:600}
.cv-plist-n{font-size:12px;color:var(--cv-muted);font-variant-numeric:tabular-nums}
.cv-tlist{margin:4px 0 0 15px;padding:0 0 0 12px;border-left:1.5px solid var(--cv-line);list-style:none;font-size:13px;color:var(--cv-muted)}
.cv-tlist li{padding:2px 0}
.cv-tlist li.is-done{text-decoration:line-through;text-decoration-color:var(--cv-faint)}
.cv-tlist li.is-active{color:var(--cv-fg)}
.cv-notes li{display:flex;flex-direction:column;padding:8px 10px;border-radius:8px;background:var(--cv-soft)}
.cv-note-title{font-size:13.5px}
.cv-note-meta{font-size:12px;color:var(--cv-muted)}
.cv-okrs{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}
.cv-okr{display:flex;flex-direction:column;gap:8px;padding:14px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg);animation:cv-in .34s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 60ms)}
.cv-okr header{display:flex;align-items:flex-start;gap:8px}
.cv-okr header strong{flex:1;font-weight:600;line-height:1.35}
.cv-okr-o{flex:none;padding:2px 6px;border-radius:5px;background:var(--cv-violet-soft);color:color-mix(in srgb,var(--cv-violet) 80%,var(--cv-fg));font-size:11.5px;font-weight:700}
.cv-okr-pct{font-weight:650;font-variant-numeric:tabular-nums}
.cv-okr-owner{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--cv-muted)}
.cv-okr ul{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.cv-okr li{display:grid;grid-template-columns:minmax(0,1fr) 80px 36px;align-items:center;gap:8px;font-size:13px}
.cv-kr-t{min-width:0}
.cv-okr-k{margin-right:6px;font-size:11px;font-weight:600;color:var(--cv-faint)}
.cv-kr-bar{position:relative;height:6px;border-radius:3px;background:var(--cv-soft);overflow:hidden}
.cv-kr-bar span{position:absolute;inset:0 auto 0 0;border-radius:3px;background:var(--cv-accent);transform-origin:left;animation:cv-grow .8s cubic-bezier(.2,.8,.3,1) .2s both}
.cv-kr-n{text-align:right;font-variant-numeric:tabular-nums;color:var(--cv-muted)}
.cv-facts dl{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px;margin:0}
.cv-facts dl>div{display:flex;flex-direction:column-reverse;padding:10px 12px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);animation:cv-in .3s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 40ms)}
.cv-facts dt{font-size:12px;color:var(--cv-muted)}
.cv-facts dd{margin:0;font-size:15px;font-weight:600;font-variant-numeric:tabular-nums}
.cv-pm-scroll{overflow-x:auto;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cv-pm{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px}
.cv-pm th,.cv-pm td{padding:6px 8px;border-bottom:1px solid var(--cv-line);text-align:center}
.cv-pm tbody tr:last-child>*{border-bottom:0}
.cv-pm thead th{font-size:11.5px;font-weight:600;color:var(--cv-muted);white-space:nowrap}
.cv-pm th[scope=row]{position:sticky;left:0;background:var(--cv-bg);text-align:left;font-weight:600;white-space:nowrap;border-right:1px solid var(--cv-line)}
.cv-pm-cell{position:relative;min-width:34px;height:30px;padding:0 8px;border:1px solid color-mix(in srgb,var(--cv-accent) 30%,var(--cv-line));border-radius:7px;background:color-mix(in srgb,var(--cv-accent) calc(var(--a,0) * 32%),var(--cv-bg));font-weight:650;font-variant-numeric:tabular-nums;overflow:hidden}
.cv-pm-cell::after{content:"";position:absolute;left:0;bottom:0;height:3px;width:calc(var(--d,0) * 100%);background:var(--cv-green)}
.cv-pm-cell[aria-pressed=true]{outline:2px solid var(--cv-accent);outline-offset:1px}
.cv-pm-picked{display:flex;flex-direction:column;gap:4px;margin:8px 0 0;padding:0;list-style:none}
.cv-pm-picked li{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:8px;background:var(--cv-soft);font-size:13px}
.cv-pm-picked small{margin-left:auto;color:var(--cv-muted)}
.cv-gantt{display:flex;flex-direction:column;gap:6px;padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cv-gantt-scale{position:relative;height:16px;margin-left:var(--gl,200px);font-size:11px;color:var(--cv-faint)}
.cv-gantt-scale span{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
.cv-gantt-rows{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.cv-gantt-rows li{display:grid;grid-template-columns:var(--gl,200px) minmax(0,1fr);align-items:center;min-height:26px;animation:cv-in .3s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 30ms)}
.cv-gantt-label{padding-right:10px;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-gantt-track{position:relative;height:20px}
.cv-gantt-grid{position:absolute;top:-3px;bottom:-3px;width:1px;background:var(--cv-line)}
.cv-gantt-bar{position:absolute;top:4px;height:12px;border-radius:4px;background:var(--cv-faint);transform-origin:left;animation:cv-grow .6s cubic-bezier(.2,.8,.3,1) .1s both}
.cv-gantt-bar.is-done,.cv-gantt-key.is-done{background:var(--cv-green)}
.cv-gantt-bar.is-active,.cv-gantt-key.is-active{background:var(--cv-accent)}
.cv-gantt-bar.is-blocked,.cv-gantt-key.is-blocked{background:var(--cv-amber)}
.cv-gantt-bar.is-next,.cv-gantt-key.is-next{background:color-mix(in srgb,var(--cv-faint) 55%,var(--cv-bg))}
.cv-gantt-today{position:absolute;top:-4px;bottom:-4px;width:2px;margin-left:-1px;background:var(--cv-red,#dc2626);opacity:.75}
.cv-gantt-key{display:inline-block;width:12px;height:8px;margin-left:6px;border-radius:2px}
.cv-gantt-key.is-today{width:2px;height:12px;background:var(--cv-red,#dc2626)}
@container cv (max-width:900px){.cv-bmc{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-areas:"vp vp" "cs cr" "ch ka" "kr kp" "rv co"}.cv-below{grid-template-columns:minmax(0,1fr)}}
@container cv (max-width:560px){.cv-bmc{grid-template-columns:minmax(0,1fr);grid-template-areas:"vp" "cs" "cr" "ch" "ka" "kr" "kp" "rv" "co"}.cv-gantt{--gl:0px}.cv-gantt-rows li{grid-template-columns:minmax(0,1fr)}.cv-gantt-label{padding:4px 0 0}.cv-okr li{grid-template-columns:minmax(0,1fr) 60px 34px}}
`;
