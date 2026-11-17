// @inai/thinking-state/away-summary — one component per entry, so a page loads only what it mounts (screens.23).
export * from "../../library/away-summary";
/** No props: the component draws its own built-in ac.me demo. */
export const awaySummaryDemo = {};

import type { AwaySummaryProps } from "../../library/away-summary";
/** Role demo · CEO (ac.me Group): what happened while the director was in meetings all morning. */
export const awaySummaryCeoDemo: AwaySummaryProps = {
  since: 190,
  thread: false,
  items: [
    { id: "price", title: "Дунд түвшний үнийг шийдэх", kind: "needs-you", detail: "Борлуулалт · санхүүгийн тооцоо бэлэн, гурван хувилбартай", action: "Шийдэх" },
    { id: "move", title: "Агуулах нүүлгэх зардлыг батлах", kind: "needs-you", detail: "Үйл ажиллагаа · 11/20 хүртэл", action: "Батлах" },
    { id: "shelf", title: "Тавиурын нийлүүлэлт таван хоног хоцорсон", kind: "failed", detail: "Худалдан авалт · нүүх өдөрт нөлөөлж магадгүй", action: "Нээх" },
    { id: "report", title: "10-р сарын санхүүгийн тайлан бэлэн болсон", kind: "done", detail: "Санхүүгийн агент · мөр бүр эх баримттай" },
    { id: "posts", title: "Өвлийн аяны гурван нийтлэл гарсан", kind: "done", detail: "Маркетинг · хуваарийн дагуу" },
  ],
};
