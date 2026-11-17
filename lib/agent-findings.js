import { A } from "./chunks/agent-findings-CXxkyqOu.js";
const agentFindingsDemo = {};
const T0 = Date.UTC(2026, 10, 18, 2, 0, 0);
const agentFindingsMarketingDemo = {
  title: "Өвлийн аяны судалгаа",
  now: T0,
  simulate: false,
  agents: [
    { id: "trend", name: "Чиг хандлагын агент", step: "Хайлтын өгөгдлийг 11-р сараар харьцуулж байна", done: 9, total: 12 },
    { id: "rival", name: "Өрсөлдөгчийн агент", step: "Гурван дэлгүүрийн хямдралын нөхцөлийг уншиж байна", done: 6, total: 8 },
    { id: "voice", name: "Сэтгэгдлийн агент", step: "Сүүлийн 30 хоногийн сэтгэгдлийг ангилж байна", done: 14, total: 14, status: "done" }
  ],
  findings: [
    { id: "f1", title: "Reel-ийн эхний гурван секундэд үзэгчдийн тал нь гардаг", severity: "critical", agent: "trend", location: "Instagram тайлан · 10-р сар", at: T0 - 4e4 },
    { id: "f2", title: "Гурван өрсөлдөгч хүргэлтийг үнэгүй болгосон", severity: "warning", agent: "rival", location: "Өрсөлдөгчийн хуудас · 11/17", at: T0 - 95e3 },
    { id: "f3", title: "Сэтгэгдэлд хэмжээний асуулт хамгийн их давтагдсан", severity: "warning", agent: "voice", location: "Сэтгэгдэл · 212 мөр", at: T0 - 18e4 },
    { id: "f4", title: "«Өвлийн гутал» хайлт 11-р сарын эхнээс өссөн", severity: "note", agent: "trend", location: "Хайлтын тайлан", at: T0 - 26e4 }
  ]
};
export {
  A as AgentFindings,
  agentFindingsDemo,
  agentFindingsMarketingDemo
};
//# sourceMappingURL=agent-findings.js.map
