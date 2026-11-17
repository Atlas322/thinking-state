/**
 * CeoDaily (2026-11-17, screens.15): «Удирдлагын тойм», the CEO's day in the AppShell. the owner's
 * seven parts: KPI · өдрийн шугам · уулзалт (click → overview) · хүрээгээр бүлэглэсэн төслүүд ·
 * санхүүгийн зорилт · хянагдах гэрээ · агентын хянагч. Based on Goomnet's today/control pages.
 * Figma: «Second Brain» · 00 App shell · PARA + GTD v02 (component set 924:9078: Компани=Маркетинг|Логистик).
 * Meaning never rides on colour alone: deltas carry an arrow and words, over-budget is written.
 */
import * as React from "react";
import { AppShell, appShellDemo, appShellLogisticsDemo, type AppShellProps } from "./app-shell";
export { appShellDemo, appShellLogisticsDemo };

export type CeoKpi = { label: string; value: string; delta?: string; good?: boolean };
export type CeoDayItem = { id: string; time: string; title: string; meta?: string; kind: "meeting" | "task" | "agent" | "post" };
export type CeoMeeting = { id: string; title: string; when: string; prep: string[] };
export type CeoProject = { id: string; name: string; progress: number; state: "on-track" | "at-risk" | "late" };
export type CeoArea = { name: string; projects: CeoProject[] };
export type CeoGoal = { id: string; label: string; progress: number; value: string };
export type CeoContract = { id: string; title: string; check: string; due: string };
export type CeoAgent = { id: string; name: string; doing: string; state: "working" | "your-turn" | "done" | "scheduled" };
export type CeoDailyData = {
  title?: string;
  subtitle: string;
  kpis: CeoKpi[];
  day: CeoDayItem[];
  meetings: CeoMeeting[];
  areas: CeoArea[];
  goals: CeoGoal[];
  contracts: CeoContract[];
  agents: CeoAgent[];
  note?: string;
};
export type CeoDailyProps = CeoDailyData & { defaultMeeting?: string; onOpenMeeting?: (id: string) => void; className?: string };

const STATE_MN: Record<CeoProject["state"], string> = { "on-track": "явж байна", "at-risk": "эрсдэлтэй", late: "хоцорсон" };
const AGENT_MN: Record<CeoAgent["state"], string> = { working: "ажиллаж байна", "your-turn": "хүний ээлж", done: "дууссан", scheduled: "товлосон" };

const CSS = `
.ceo *,.ceo *::before{box-sizing:border-box}
.ceo{display:grid;gap:16px;font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);min-width:0}
.ceo-head h2{margin:0;font:var(--ts-head-weight,600) 24px/1.2 var(--ts-font-head,var(--ts-font));letter-spacing:-.02em}
.ceo-head p{margin:4px 0 0;font-size:12px;color:var(--ts-faint)}
.ceo-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
.ceo-kpi,.ceo-card{background:var(--ts-surface);border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);min-width:0}
.ceo-kpi{padding:12px 14px;display:grid;gap:2px}
.ceo-kpi small{font:500 10.5px/1.3 var(--ts-font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.ceo-kpi b{font:var(--ts-head-weight,600) 24px/1.15 var(--ts-font-head,var(--ts-font));font-variant-numeric:tabular-nums}
.ceo-kpi span{font-size:11.5px;font-weight:500;color:var(--ts-muted)}.ceo-kpi span[data-good=true]{color:var(--ts-status-done-fg)}.ceo-kpi span[data-good=false]{color:var(--ts-status-error-fg)}
.ceo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.ceo-card{padding:14px 16px;display:grid;gap:10px;align-content:start}
.ceo-card>header{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.ceo-card h3{margin:0;font-size:14px;font-weight:600}.ceo-card header small{font-size:11.5px;color:var(--ts-faint)}
.ceo-day{display:grid;grid-template-columns:44px minmax(0,1fr);gap:6px 10px;align-items:center;margin:0;padding:0;list-style:none}
.ceo-day time{font-size:12px;font-weight:500;color:var(--ts-faint);font-variant-numeric:tabular-nums}
.ceo-ev{display:grid;gap:1px;padding:7px 10px;border-radius:var(--ts-radius-control,8px);background:var(--ts-soft-2);border:1px solid transparent;text-align:left;width:100%;min-height:40px}
.ceo-ev[data-kind=meeting]{background:var(--ts-electric-soft);cursor:pointer}.ceo-ev[data-kind=agent]{background:var(--ts-status-done-bg)}
.ceo-ev[aria-expanded=true]{border-color:var(--ts-electric)}
.ceo-ev b{font-size:12.5px;font-weight:500}.ceo-ev small{font-size:11px;color:var(--ts-faint)}
.ceo-ev:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-surface),0 0 0 2px var(--ts-electric)}
.ceo-chip{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:var(--ts-radius-pill,999px);font-size:11px;font-weight:500;white-space:nowrap;background:var(--ts-status-idle-bg);color:var(--ts-status-idle-fg)}
.ceo-chip[data-tone=warn]{background:var(--ts-status-needs-you-bg);color:var(--ts-status-needs-you-fg)}
.ceo-chip[data-tone=ok]{background:var(--ts-status-done-bg);color:var(--ts-status-done-fg)}
.ceo-chip[data-tone=run]{background:var(--ts-status-running-bg);color:var(--ts-status-running-fg)}
.ceo-chip[data-tone=bad]{background:var(--ts-status-error-bg);color:var(--ts-status-error-fg)}
.ceo-area h4{margin:4px 0 6px;font:500 11px/1.3 var(--ts-font-mono);letter-spacing:.04em;color:var(--ts-faint)}
.ceo-pr{display:grid;grid-template-columns:minmax(0,1fr) 120px 40px auto;align-items:center;gap:10px;font-size:12.5px;padding:4px 0}
.ceo-pr>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ceo-bar{display:block;height:8px;border-radius:4px;background:var(--ts-soft-2);overflow:hidden}
.ceo-bar>i{display:block;height:100%;border-radius:4px;background:var(--ts-series-1)}
.ceo-bar>i[data-tone=warn]{background:var(--ts-series-2)}.ceo-bar>i[data-tone=bad]{background:var(--ts-status-error-fg)}.ceo-bar>i[data-tone=ok]{background:var(--ts-series-3)}
.ceo-pr em{font-style:normal;font-size:11.5px;color:var(--ts-faint);font-variant-numeric:tabular-nums}
.ceo-goal{display:grid;gap:6px}.ceo-goal div{display:flex;justify-content:space-between;gap:8px;font-size:12.5px}.ceo-goal div span:last-child{color:var(--ts-faint);font-variant-numeric:tabular-nums}
.ceo-goal p{margin:0;font-size:11px;font-weight:500;color:var(--ts-status-error-fg)}
.ceo-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.ceo-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-control,8px);background:var(--ts-page)}
.ceo-row b{display:block;font-size:13px;font-weight:500}.ceo-row small{font-size:11.5px;color:var(--ts-faint)}
.ceo-agents{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.ceo-agent{display:grid;gap:6px;padding:12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-control,8px);background:var(--ts-page)}
.ceo-agent b{font-size:13px}.ceo-agent p{margin:0;font-size:12px;color:var(--ts-muted)}
.ceo-meet h3{margin:4px 0 2px;font-size:16px}.ceo-meet small{font-size:12px;color:var(--ts-faint)}
.ceo-meet ul{margin:10px 0 0;padding-left:16px;display:grid;gap:8px;font-size:12.5px;line-height:1.45}
.ceo-meet .ceo-k{font:500 10.5px/1.3 var(--ts-font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.ceo-meet .ceo-by{margin-top:14px;font-size:11px;font-weight:500;color:var(--ts-status-done-fg)}
.ceo-note{margin:0;font:500 11px/1.4 var(--ts-font-mono);color:var(--ts-faint)}
.ceo-wide{grid-column:1/-1}
@media (max-width:860px){.ceo-grid{grid-template-columns:minmax(0,1fr)}.ceo-pr{grid-template-columns:minmax(0,1fr) 80px 36px}.ceo-pr .ceo-chip{grid-column:1/-1;justify-self:start}}
`;

/** The main column of «Удирдлагын тойм»; pair it with <CeoMeetingOverview> in the AppShell aside. */
export function CeoDaily({ title = "Удирдлагын тойм", subtitle, kpis, day, meetings, areas, goals, contracts, agents, note, defaultMeeting, onOpenMeeting, className = "" }: CeoDailyProps) {
  const [open, setOpen] = React.useState<string | undefined>(defaultMeeting);
  const meetingOf = (title: string) => meetings.find((m) => m.title === title);
  return (
    <div className={`ceo ${className}`}>
      <style>{CSS}</style>
      <header className="ceo-head"><h2>{title}</h2><p>{subtitle}</p></header>
      <section className="ceo-kpis" aria-label="Гол үзүүлэлт">
        {kpis.map((k) => (
          <div key={k.label} className="ceo-kpi"><small>{k.label}</small><b>{k.value}</b>{k.delta && <span data-good={k.good === undefined ? undefined : String(k.good)}>{k.delta}</span>}</div>
        ))}
      </section>
      <div className="ceo-grid">
        <section className="ceo-card" aria-label="Өдрийн шугам">
          <header><h3>Өдрийн шугам</h3><small>уулзалт дээр дарвал тойм нээгдэнэ</small></header>
          <ol className="ceo-day">
            {day.map((d) => {
              const m = d.kind === "meeting" ? meetingOf(d.title) : undefined;
              return (
                <li key={d.id} style={{ display: "contents" }}>
                  <time>{d.time}</time>
                  {m ? (
                    <button type="button" className="ceo-ev" data-kind="meeting" aria-expanded={open === m.id} onClick={() => { setOpen(m.id); onOpenMeeting?.(m.id); }}>
                      <b>{d.title}</b>{d.meta && <small>{d.meta}</small>}
                    </button>
                  ) : (
                    <div className="ceo-ev" data-kind={d.kind}><b>{d.title}</b>{d.meta && <small>{d.meta}</small>}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
        <section className="ceo-card" aria-label="Хянагдахаар хүлээгдэж буй гэрээ">
          <header><h3>Хянагдахаар хүлээгдэж буй гэрээ</h3><small>юуг · хэзээ хүртэл</small></header>
          <ul className="ceo-list">
            {contracts.map((c) => (
              <li key={c.id} className="ceo-row"><span><b>{c.title}</b><small>{c.check}</small></span><span className="ceo-chip" data-tone="warn">{c.due} хүртэл</span></li>
            ))}
          </ul>
        </section>
        <section className="ceo-card" aria-label="Төслүүд · хүрээгээр">
          <header><h3>Төслүүд · хүрээгээр</h3><small>явц · төлөв</small></header>
          {areas.map((a) => (
            <div key={a.name} className="ceo-area">
              <h4>{a.name}</h4>
              {a.projects.map((p) => {
                const tone = p.state === "on-track" ? "ok" : p.state === "at-risk" ? "warn" : "bad";
                return (
                  <div key={p.id} className="ceo-pr">
                    <span>{p.name}</span>
                    <span className="ceo-bar" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.name}: ${p.progress}%`}><i style={{ width: `${Math.min(100, p.progress)}%` }} data-tone={tone === "ok" ? undefined : tone} /></span>
                    <em>{p.progress}%</em>
                    <span className="ceo-chip" data-tone={tone}>{STATE_MN[p.state]}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </section>
        <section className="ceo-card" aria-label="Санхүүгийн зорилт">
          <header><h3>Санхүүгийн зорилт</h3><small>энэ сар</small></header>
          {goals.map((g) => {
            const over = g.progress > 100;
            return (
              <div key={g.id} className="ceo-goal">
                <div><span>{g.label}</span><span>{g.value}</span></div>
                <span className="ceo-bar" role="progressbar" aria-valuenow={g.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${g.label}: ${g.progress}%`}><i style={{ width: `${Math.min(100, g.progress)}%` }} data-tone={over ? "bad" : "ok"} /></span>
                {over && <p>Зорилтоос давсан: {g.progress}%</p>}
              </div>
            );
          })}
        </section>
        <section className="ceo-card ceo-wide" aria-label="Агентууд · хэн юуг хийж байна">
          <header><h3>Агентууд · хэн юуг хийж байна</h3><small>ажлын урсгалын хянагч</small></header>
          <div className="ceo-agents">
            {agents.map((a) => (
              <div key={a.id} className="ceo-agent">
                <b>{a.name}</b><p>{a.doing}</p>
                <span className="ceo-chip" data-tone={a.state === "your-turn" ? "warn" : a.state === "done" ? "ok" : a.state === "working" ? "run" : undefined} style={{ justifySelf: "start" }}>{AGENT_MN[a.state]}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      {note && <p className="ceo-note">{note}</p>}
    </div>
  );
}

export function CeoMeetingOverview({ meetings, id }: { meetings: CeoMeeting[]; id?: string }) {
  const m = meetings.find((x) => x.id === id);
  if (!m) return <p className="ceo-note">Өдрийн шугамаас уулзалт сонгоход тойм энд нээгдэнэ.</p>;
  return (
    <div className="ceo-meet" aria-live="polite">
      <style>{CSS}</style>
      <span className="ceo-k">Уулзалтын тойм</span>
      <h3>{m.title}</h3>
      <small>{m.when}</small>
      <p className="ceo-by">Агент бэлдсэн</p>
      <ul>{m.prep.map((p) => <li key={p}>{p}</li>)}</ul>
    </div>
  );
}

/** «Удирдлагын тойм» inside the AppShell, the meeting overview in the aside. */
export function CeoDailyScreen({ shell, daily }: { shell: Omit<AppShellProps, "children" | "aside">; daily: CeoDailyProps }) {
  const [id, setId] = React.useState<string | undefined>(daily.defaultMeeting);
  return (
    <AppShell {...shell} active={shell.active ?? "ceo"} aside={<CeoMeetingOverview meetings={daily.meetings} id={id} />}>
      <CeoDaily {...daily} onOpenMeeting={(m) => { setId(m); daily.onOpenMeeting?.(m); }} />
    </AppShell>
  );
}

const NOTE = "ac.me — жишээ өгөгдөл, бодит харилцагч биш";
export const ceoDailyDemo: CeoDailyProps = {
  subtitle: "ac.me Маркетинг · Лхагва, 11-р сарын 18",
  kpis: [
    { label: "Хүрэлт · 7 хоног", value: "184k", delta: "▲ 12% өмнөх 7 хоногоос", good: true },
    { label: "Lead", value: "312", delta: "▲ 8%", good: true },
    { label: "Зардал / lead", value: "4 200 ₮", delta: "▼ 6% (сайжирсан)", good: true },
    { label: "Төсвийн гүйцэтгэл", value: "71%", delta: "▲ 9 нэгж, хурдан зарцуулж байна", good: false },
  ],
  day: [
    { id: "d1", time: "09:00", title: "Багийн standup", meta: "15 мин", kind: "meeting" },
    { id: "d2", time: "10:30", title: "Black Friday баннер · батлах", meta: "агент бэлдсэн", kind: "task" },
    { id: "d3", time: "13:00", title: "Influencer · Номин · уулзалт", meta: "45 мин · онлайн", kind: "meeting" },
    { id: "d4", time: "15:00", title: "IG reel №3 нийтлэх", meta: "товлосон", kind: "post" },
    { id: "d5", time: "17:00", title: "7 хоногийн тайлан", meta: "тайлан агент", kind: "agent" },
  ],
  meetings: [
    { id: "m1", title: "Багийн standup", when: "09:00 · 15 мин", prep: ["Өчигдрийн 3 пост: хүрэлт 41k", "Өнөөдөр батлах: Black Friday баннер"] },
    { id: "m3", title: "Influencer · Номин · уулзалт", when: "13:00 · 45 мин · онлайн", prep: ["Өмнөх уулзалт: 3 пост, 2 story тохирсон", "Гэрээний ноорог хуульд хянагдаж байна", "Асуух: тайлангийн давтамж, үнэ"] },
  ],
  areas: [
    { name: "Брэнд ба суваг", projects: [{ id: "bf", name: "Black Friday", progress: 70, state: "on-track" }, { id: "nc", name: "Шинэ цуглуулга", progress: 35, state: "at-risk" }] },
    { name: "CRM", projects: [{ id: "rc", name: "Хуучин харилцагч эргүүлэх", progress: 55, state: "on-track" }] },
  ],
  goals: [
    { id: "g1", label: "Сарын маркетингийн төсөв", progress: 71, value: "14.2 / 20 сая ₮" },
    { id: "g2", label: "Lead зорилт", progress: 62, value: "312 / 500" },
    { id: "g3", label: "Зардал / lead ≤ 4 500 ₮", progress: 93, value: "4 200 ₮" },
  ],
  contracts: [
    { id: "c1", title: "Influencer · Номин · 3 пост", check: "хууль · хянах", due: "11/19" },
    { id: "c2", title: "Хэвлэлийн газар · баннер", check: "үнэ · хянах", due: "11/21" },
    { id: "c3", title: "Meta зар · 12-р сар", check: "төсөв · батлах", due: "11/25" },
  ],
  agents: [
    { id: "a1", name: "Контент агент", doing: "IG reel №4-ийн ноорог бичиж байна", state: "working" },
    { id: "a2", name: "Comment агент", doing: "12 коммент хариулав, 4 нь батлалт хүлээж байна", state: "your-turn" },
    { id: "a3", name: "Тайлан агент", doing: "7 хоногийн тайлан 17:00-д", state: "scheduled" },
  ],
  defaultMeeting: "m3",
  note: NOTE,
};
export const ceoDailyLogisticsDemo: CeoDailyProps = {
  subtitle: "ac.me Логистик · Лхагва, 11-р сарын 18",
  kpis: [
    { label: "Өнөөдрийн ачилт", value: "23", delta: "▲ 3 өчигдрөөс", good: true },
    { label: "Цагтаа хүргэлт", value: "94%", delta: "▲ 2 нэгж", good: true },
    { label: "Хоосон явалт", value: "11%", delta: "▼ 4 нэгж (сайжирсан)", good: true },
    { label: "Түлшний зардал", value: "312 сая ₮", delta: "▲ 6%, төсвөөс давсан", good: false },
  ],
  day: [
    { id: "d1", time: "08:00", title: "Диспетчерийн өглөөний уулзалт", meta: "20 мин", kind: "meeting" },
    { id: "d2", time: "10:00", title: "Эрдэнэт рүү 3 ачаа гарах", meta: "агент товлосон", kind: "task" },
    { id: "d3", time: "12:00", title: "Гаалийн зуучлагч · уулзалт", meta: "30 мин · оффис", kind: "meeting" },
    { id: "d4", time: "14:00", title: "Агуулах 2 · тооллого", meta: "агент", kind: "agent" },
    { id: "d5", time: "16:30", title: "Шинэ маршрут · хэлэлцүүлэг", meta: "1 цаг", kind: "meeting" },
  ],
  meetings: [
    { id: "m1", title: "Диспетчерийн өглөөний уулзалт", when: "08:00 · 20 мин", prep: ["Өнөөдөр 23 ачилт, 2 нь хил дээр", "Жолооч 1 өвчтэй, орлох хүн товлогдсон"] },
    { id: "m3", title: "Гаалийн зуучлагч · уулзалт", when: "12:00 · 30 мин · оффис", prep: ["Хүлээгдэж буй 4 ачааны бичиг баримт", "Шинэ журам 12-р сараас", "Асуух: хурдасгах үйлчилгээний үнэ"] },
    { id: "m5", title: "Шинэ маршрут · хэлэлцүүлэг", when: "16:30 · 1 цаг", prep: ["Хойд чиглэлийг 40 км богиносгох санал", "Шинэ замын эвдрэлийн эрсдэл"] },
  ],
  areas: [
    { name: "Парк ба агуулах", projects: [{ id: "fl", name: "Авто паркийн шинэчлэл", progress: 40, state: "at-risk" }, { id: "wh", name: "Агуулах 2 · автоматжуулалт", progress: 65, state: "on-track" }] },
    { name: "Маршрут, гэрээ", projects: [{ id: "rt", name: "Хойд чиглэлийн маршрут", progress: 80, state: "on-track" }] },
  ],
  goals: [
    { id: "g1", label: "Сарын орлого", progress: 82, value: "1 016 / 1 240 сая ₮" },
    { id: "g2", label: "Түлшний төсөв ≤ 300 сая", progress: 104, value: "312 сая ₮" },
    { id: "g3", label: "Авлагын хугацаа ≤ 15 хоног", progress: 79, value: "19 хоног" },
  ],
  contracts: [
    { id: "c1", title: "Тарифын гэрээ · ac.me Retail", check: "үнэ · хянах", due: "11/20" },
    { id: "c2", title: "Лизинг · 2 ачааны машин", check: "нөхцөл · батлах", due: "11/22" },
    { id: "c3", title: "Гаалийн зуучлагч · жилийн", check: "хууль · хянах", due: "11/28" },
  ],
  agents: [
    { id: "a1", name: "Маршрут агент", doing: "Хойд чиглэлийг 40 км богиносгох санал бэлдсэн", state: "your-turn" },
    { id: "a2", name: "Баримт агент", doing: "4 гаалийн бичиг шалгаж байна", state: "working" },
    { id: "a3", name: "Санхүү агент", doing: "Түлшний зөрүүг тайлбарлав", state: "done" },
  ],
  defaultMeeting: "m3",
  note: NOTE,
};
export const ceoDailyScreenDemo = { shell: appShellDemo, daily: ceoDailyDemo };

export default CeoDaily;
