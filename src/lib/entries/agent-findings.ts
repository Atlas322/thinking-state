// @inai/thinking-state/agent-findings — one component per entry, so a page loads only what it mounts (screens.23).
export * from "../../library/agent-findings";
/** No props: the component draws its own built-in ac.me demo. */
export const agentFindingsDemo = {};

import type { AgentFindingsProps } from "../../library/agent-findings";
const T0 = Date.UTC(2026, 10, 18, 2, 0, 0); // a fixed «now», so the ages read the same on every load
/** Role demo · marketing (ac.me Retail): what the research agents found for the winter campaign. */
export const agentFindingsMarketingDemo: AgentFindingsProps = {
  title: "Өвлийн аяны судалгаа",
  now: T0,
  simulate: false,
  agents: [
    { id: "trend", name: "Чиг хандлагын агент", step: "Хайлтын өгөгдлийг 11-р сараар харьцуулж байна", done: 9, total: 12 },
    { id: "rival", name: "Өрсөлдөгчийн агент", step: "Гурван дэлгүүрийн хямдралын нөхцөлийг уншиж байна", done: 6, total: 8 },
    { id: "voice", name: "Сэтгэгдлийн агент", step: "Сүүлийн 30 хоногийн сэтгэгдлийг ангилж байна", done: 14, total: 14, status: "done" },
  ],
  findings: [
    { id: "f1", title: "Reel-ийн эхний гурван секундэд үзэгчдийн тал нь гардаг", severity: "critical", agent: "trend", location: "Instagram тайлан · 10-р сар", at: T0 - 40_000 },
    { id: "f2", title: "Гурван өрсөлдөгч хүргэлтийг үнэгүй болгосон", severity: "warning", agent: "rival", location: "Өрсөлдөгчийн хуудас · 11/17", at: T0 - 95_000 },
    { id: "f3", title: "Сэтгэгдэлд хэмжээний асуулт хамгийн их давтагдсан", severity: "warning", agent: "voice", location: "Сэтгэгдэл · 212 мөр", at: T0 - 180_000 },
    { id: "f4", title: "«Өвлийн гутал» хайлт 11-р сарын эхнээс өссөн", severity: "note", agent: "trend", location: "Хайлтын тайлан", at: T0 - 260_000 },
  ],
};
