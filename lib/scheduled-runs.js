import { S } from "./chunks/scheduled-runs-B0UYfddj.js";
const scheduledRunsDemo = {};
const scheduledRunsRetailDemo = {
  title: "Энэ долоо хоног",
  note: "Давтагдах ажил агентын сешнд хуваарилагдана; илгээхийг хүн батална.",
  agents: [{ name: "Тайлангийн агент" }, { name: "Нөөцийн агент" }, { name: "Харилцагчийн агент" }],
  tasks: [
    { id: "weekly", title: "Долоо хоногийн борлуулалтын тайлан", usage: 30, agent: "Тайлангийн агент", detail: "Даваа бүр · салбар бүрээр, өмнөх долоо хоногтой харьцуулна", logo: "drive", stats: [{ icon: "file", value: 4 }] },
    { id: "stock", title: "Нөөц дуусах барааны жагсаалт", usage: 20, agent: "Нөөцийн агент", detail: "Өдөр бүр · 9 хоногоос бага нөөцтэй бараа", stats: [{ icon: "check", value: 12 }] },
    { id: "price", title: "Үнийн шошгыг үнийн хүснэгттэй тулгах", usage: 25, agent: "Нөөцийн агент", detail: "Лхагва бүр · зөрсөн шошгыг тэмдэглэнэ", stats: [{ icon: "check", value: 3 }] },
    { id: "reviews", title: "Харилцагчийн сэтгэгдэлд хариу бэлдэх", usage: 35, agent: "Харилцагчийн агент", detail: "Өдөр бүр · ноорог бэлдэнэ, илгээхийг хүн батална", logo: "slack", stats: [{ icon: "comment", value: 18 }] },
    { id: "supplier", title: "Нийлүүлэгчийн хоцролтын тойм", usage: 15, agent: "Тайлангийн агент", detail: "Баасан бүр · хоцорсон нийлүүлэлт, шалтгаан", stats: [{ icon: "link", value: 5 }] }
  ]
};
export {
  S as ScheduledRuns,
  scheduledRunsDemo,
  scheduledRunsRetailDemo
};
//# sourceMappingURL=scheduled-runs.js.map
