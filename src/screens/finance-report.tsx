/**
 * FinanceReport (2026-11-17, screens.14): the monthly finance report an agent prepares from the
 * books, for the «Тооцоо ба тайлан» (/reports) solution page. ac.me Cargo demo, made-up numbers.
 *
 * One screen built from the library, no new components:
 *   KPI tiles · P&L (DataTable) · cash flow (KPIChart, --ts-series-*) · variance explained with
 *   numbered sources (CitedAnswer [n]) · how the agent prepared it (CostWaterfall) · the human
 *   sign-off (ApprovalCard). Every figure points at its source; the person approves, not the agent.
 */
import { DataTable, type DataColumn, type DataRow } from "../library/data-table";
import { KPIChart, type KpiSeries } from "../library/kpi-chart";
import { CitedAnswer, type CitedSegment, type CitedSource } from "../library/cited-answer";
import { CostWaterfall, type CostStep } from "../library/cost-waterfall";
import { ApprovalCard } from "../library/approval-card";
import { SourceIcon } from "../library/source-preview";
import { CashRiver, cashRiverDemo } from "./cash-river";

/** trend = direction of the change (arrow); good = whether that change is good news (colour). Never colour alone. */
export type FinanceKpi = { label: string; value: string; delta?: string; trend?: "up" | "down" | "flat"; good?: boolean; cite?: string };
export type FinanceLine = { id: string; line: string; now: number; prev: number; cite: string; total?: boolean };
export type FinanceReportData = {
  company: string;
  period: string;
  unit: string;
  kpis: FinanceKpi[];
  pnl: FinanceLine[];
  cash: { labels: string[]; series: KpiSeries[]; value: string; delta: number };
  variance: CitedSegment[];
  sources: CitedSource[];
  steps: CostStep[];
  approval: { title: string; description: string; details: { label: string; value: string }[] };
  note: string;
};
export type FinanceReportProps = Partial<FinanceReportData> & { theme?: "light" | "dark"; className?: string };

const mn = (n: number) => new Intl.NumberFormat("en-US").format(Math.abs(n)).replace(/,/g, " ");
const signed = (n: number) => (n > 0 ? `+${mn(n)}` : n < 0 ? `−${mn(n)}` : "0");
const doc = (size = 12) => <SourceIcon kind="document" size={size} tile={false} />;

export const financeReportDemo: FinanceReportData = {
  company: "ac.me Cargo",
  period: "2026 оны 10-р сар",
  unit: "сая ₮",
  kpis: [
    { label: "Орлого", value: "1 240", delta: "+60 өмнөх сараас", trend: "up", good: true, cite: "2" },
    { label: "Зардал", value: "800", delta: "+86 өмнөх сараас", trend: "up", good: false, cite: "1" },
    { label: "Цэвэр ашиг", value: "440", delta: "−26 өмнөх сараас", trend: "down", good: false, cite: "1" },
    { label: "Мөнгөн үлдэгдэл", value: "1 615", delta: "+230 өмнөх сараас", trend: "up", good: true, cite: "2" },
  ],
  pnl: [
    { id: "rev", line: "Тээврийн орлого", now: 1240, prev: 1180, cite: "[2]" },
    { id: "fuel", line: "Түлш", now: -312, prev: -268, cite: "[4]" },
    { id: "pay", line: "Цалин", now: -285, prev: -280, cite: "[1]" },
    { id: "rep", line: "Засвар үйлчилгээ", now: -96, prev: -54, cite: "[3]" },
    { id: "rent", line: "Агуулахын түрээс", now: -60, prev: -60, cite: "[1]" },
    { id: "oth", line: "Бусад зардал", now: -47, prev: -52, cite: "[1]" },
    { id: "net", line: "Цэвэр ашиг", now: 440, prev: 466, cite: "[1]", total: true },
  ],
  cash: {
    labels: ["5-р", "6-р", "7-р", "8-р", "9-р", "10-р"],
    series: [
      { label: "Орох мөнгө", color: "var(--ts-series-1)", values: [980, 1040, 1110, 1150, 1180, 1240] },
      { label: "Гарах мөнгө", color: "var(--ts-series-2)", values: [760, 780, 820, 850, 890, 1010] },
    ],
    value: "1 615 сая",
    delta: 230,
  },
  variance: [
    { text: "Цэвэр ашиг 440 сая төгрөг болж, өмнөх сараас 26 саяар буурсан.", cite: ["1"] },
    { text: " Хоёр ачааны машины их засвар зардлыг 42 саяар нэмсэн.", cite: ["3"] },
    { text: " Түлшний зардал 44 саяар өссөн: литрийн үнэ 4%, маршрутын тоо 6% нэмэгдсэн.", cite: ["4"] },
    { text: " Орлогын 60 саяын өсөлт банкны хуулгатай таарч байна.", cite: ["2"] },
  ],
  sources: [
    { id: "1", title: "Ерөнхий журнал · 10-р сар", site: "Нягтлан бодох бүртгэл", date: "2026.10", quote: "1 284 гүйлгээ, 10-р сарын хаалт. Зардлын нийт дүн 800 сая төгрөг.", highlight: "800 сая", icon: doc() },
    { id: "2", title: "Банкны хуулга · 10-р сар", site: "Банк", date: "2026.10", quote: "Орсон гүйлгээ 1 240 сая, гарсан 1 010 сая; сарын эцсийн үлдэгдэл 1 615 сая.", highlight: "1 240 сая", icon: doc() },
    { id: "3", title: "Засварын нэхэмжлэх №2026-118", site: "Нийлүүлэгч", date: "2026.10.21", quote: "Хоёр ачааны машины хөдөлгүүрийн их засвар, нийт 42 сая төгрөг.", highlight: "их засвар", icon: doc() },
    { id: "4", title: "Түлшний картын тайлан", site: "Түлшний карт", date: "2026.10", quote: "Литрийн дундаж үнэ 4% өссөн, маршрутын тоо 6% нэмэгдсэн.", highlight: "4% өссөн", icon: doc() },
  ],
  steps: [
    { id: "read", tokensIn: 18400, tokensOut: 620, name: "Ерөнхий журнал уншив", kind: "tool", status: "done", detail: "1 284 гүйлгээ", duration: 6200, cost: 420 },
    { id: "bank", tokensIn: 9200, tokensOut: 310, name: "Банкны хуулгатай тулгав", kind: "tool", status: "done", detail: "зөрүү 0", duration: 3400, cost: 260 },
    { id: "var", tokensIn: 14800, tokensOut: 1900, name: "Зөрүүг тайлбарлав", kind: "agent", status: "done", detail: "4 эх сурвалж", duration: 8100, cost: 910,
      children: [
        { id: "inv", tokensIn: 2600, tokensOut: 180, name: "Засварын нэхэмжлэх олов", kind: "tool", status: "done", duration: 1600, cost: 120 },
        { id: "fuelc", tokensIn: 3900, tokensOut: 240, name: "Түлшний картын тайлан уншив", kind: "tool", status: "done", duration: 2200, cost: 150 },
      ] },
    { id: "draft", tokensIn: 6100, tokensOut: 2400, name: "Тайлангийн ноорог бичив", kind: "agent", status: "done", detail: "батлалтад илгээв", duration: 4500, cost: 380 },
  ],
  approval: {
    title: "10-р сарын тайланг батлах",
    description: "Агент бэлдсэн — менежер батална",
    details: [
      { label: "Цэвэр ашиг", value: "440 сая ₮" },
      { label: "Өмнөх сараас", value: "−26 сая ₮ (−5.6%)" },
      { label: "Эх сурвалж", value: "4 баримт, бүгд тулгагдсан" },
    ],
  },
  note: "ac.me — жишээ өгөгдөл, бодит харилцагч биш",
};

const CSS = `
.fr{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);display:grid;gap:var(--ts-space-4,16px)}
.fr-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:var(--ts-space-2,8px)}
.fr-head h2{margin:0;font:var(--ts-head-weight,600) 22px/1.2 var(--ts-font-head,var(--ts-font));letter-spacing:-.02em}
.fr-head p{margin:0;color:var(--ts-muted);font-size:13px}
.fr-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--ts-space-3,12px)}
.fr-kpi{background:var(--ts-surface);border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);padding:var(--ts-space-3,12px) var(--ts-space-4,16px);display:grid;gap:4px}
.fr-kpi small{font:500 11px/1.3 var(--ts-font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint)}
.fr-kpi b{font:var(--ts-head-weight,600) 28px/1.1 var(--ts-font-head,var(--ts-font));font-variant-numeric:tabular-nums}
.fr-kpi span{font-size:12px;color:var(--ts-muted);font-variant-numeric:tabular-nums}
.fr-kpi span[data-good=true]{color:var(--ts-status-done-fg)}.fr-kpi span[data-good=false]{color:var(--ts-status-error-fg)}
.fr-kpi sup{font-size:10px;color:var(--ts-electric-fg);margin-left:2px}
.fr-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:var(--ts-space-4,16px);align-items:start}
.fr-row>*{min-width:0;max-width:none}
.fr-wide{min-width:0}
.fr-note{margin:0;font:500 11px/1.4 var(--ts-font-mono);color:var(--ts-faint)}
@media (max-width:860px){.fr-row{grid-template-columns:minmax(0,1fr)}}
`;

export function FinanceReport({ theme, className = "", ...data }: FinanceReportProps) {
  const d = { ...financeReportDemo, ...data };
  const dark = theme === "dark";
  const columns: DataColumn[] = [
    { key: "line", label: "Мөр", type: "title", width: "2.8fr" },
    { key: "now", label: `${d.period.replace(/^\d+ оны /, "")}, ${d.unit}`, type: "number", format: signed },
    { key: "prev", label: "Өмнөх сар", type: "number", format: signed },
    { key: "diff", label: "Зөрүү", type: "number", format: signed },
    { key: "cite", label: "Эх", type: "tag", width: "0.7fr" },
  ];
  const rows: DataRow[] = d.pnl.map((l) => ({ id: l.id, line: l.line, now: l.now, prev: l.prev, diff: l.now - l.prev, cite: l.cite }));
  const tagTones = Object.fromEntries(d.pnl.map((l) => [l.cite, "blue" as const]));
  return (
    <div
      className={`fr ${dark ? "dark" : ""} ${className}`}
      data-ts-theme={theme ? (dark ? "dark" : "cream") : undefined}
      data-theme={theme}
    >
      <style>{CSS}</style>
      <header className="fr-head">
        <div>
          <h2>Санхүүгийн тайлан · {d.period}</h2>
          <p>{d.company} · Агент эх өгөгдлөөс бэлдсэн, тоо бүр эх сурвалжтай</p>
        </div>
        <p className="fr-note">{d.note}</p>
      </header>
      <section className="fr-kpis" aria-label="Гол үзүүлэлт">
        {d.kpis.map((k) => (
          <div key={k.label} className="fr-kpi">
            <small>{k.label}, {d.unit}</small>
            <b>{k.value}{k.cite && <sup>[{k.cite}]</sup>}</b>
            {k.delta && <span data-trend={k.trend} data-good={k.good === undefined ? undefined : String(k.good)}>{k.trend === "up" ? "▲ " : k.trend === "down" ? "▼ " : ""}{k.delta}</span>}
          </div>
        ))}
      </section>
      <div className="fr-row">
        <DataTable title="Ашиг, алдагдлын тайлан" columns={columns} rows={rows} tagTones={tagTones} editable={false} />
        <CitedAnswer segments={d.variance} sources={d.sources} theme={theme} />
      </div>
      <div className="fr-row">
        <KPIChart title="Мөнгөн урсгал · үлдэгдэл" value={d.cash.value} delta={d.cash.delta} labels={d.cash.labels} tooltipLabels={d.cash.labels.map((l) => `${l} сар`)} series={d.cash.series} format={(n) => mn(n)} footer="Орох ба гарах мөнгө, сүүлийн 6 сар, сая ₮" />
        <ApprovalCard title={d.approval.title} description={d.approval.description} risk="medium" details={d.approval.details} />
      </div>
      <div className="fr-wide">
        <CashRiver {...cashRiverDemo} title="Мөнгөний гол · 10-р сар" />
      </div>
      <div className="fr-wide">
        <CostWaterfall title="Агент тайланг хэрхэн бэлдсэн" task={`Санхүүгийн тайлан · ${d.period}`} steps={d.steps} status="done" defaultCollapsed={[]} formatCost={(n) => `${mn(n)} ₮`} />
      </div>
    </div>
  );
}

export default FinanceReport;
