// @inai/thinking-state/review-center — one component per entry, so a page loads only what it mounts (screens.23).
export * from "../../library/review-center";
/** No props: the component draws its own built-in ac.me demo. */
export const reviewCenterDemo = {};

import type { ReviewCenterProps } from "../../library/review-center";
const R0 = Date.UTC(2026, 10, 18, 2, 0, 0);
/** Role demo · marketing (ac.me Retail): drafts waiting for the manager before they are published. */
export const reviewCenterMarketingDemo: ReviewCenterProps = {
  title: "Нийтлэхийн өмнөх шалгалт",
  reviewed: 4,
  total: 7,
  now: R0,
  items: [
    {
      id: "post", title: "Өвлийн хямдралын нийтлэл", agent: "Бичигч агент", type: "Нийтлэл", risk: "high", confidence: 0.62, createdAt: R0 - 14 * 60_000,
      reasoning: "Хямдралын хувь үнийн хүснэгттэй зөрсөн тул хүн шалгах хэрэгтэй.",
      fields: [{ label: "Суваг", value: "Instagram" }, { label: "Нийтлэх", value: "11/19 · 10:00" }, { label: "Хямдрал", value: [{ text: "30% хүртэл", note: "Үнийн хүснэгтэд дээд хямдрал 20%", source: "Үнийн хүснэгт · 11-р сар" }] }],
      body: ["Өвлийн цуглуулга ", { text: "30% хүртэл", note: "Үнийн хүснэгтэд дээд хямдрал 20%", source: "Үнийн хүснэгт · 11-р сар" }, " хямдарлаа. Хүргэлт Улаанбаатарт үнэгүй, 11-р сарын 30 хүртэл."],
      sources: ["Үнийн хүснэгт · 11-р сар", "Аяны бриф"],
    },
    {
      id: "mail", title: "Имэйл: шинэ харилцагчид", agent: "Бичигч агент", type: "Имэйл", risk: "medium", confidence: 0.84, createdAt: R0 - 11 * 60_000,
      reasoning: "Брэндийн дуу хоолойд таарсан; гарчиг 52 тэмдэгт.",
      fields: [{ label: "Хүлээн авагч", value: "Сүүлийн 30 хоногт бүртгүүлсэн 412 хүн" }, { label: "Илгээх", value: "11/20 · 09:00" }],
      body: "Сайн байна уу. Анхны захиалгадаа 10% хөнгөлөлт аваарай. Хэмжээ тохирохгүй бол 14 хоногт үнэгүй солино.",
      sources: ["Аяны бриф", "Буцаалтын журам"],
    },
    {
      id: "reel", title: "Reel №3 · тайлбар бичвэр", agent: "Бичигч агент", type: "Тайлбар", risk: "low", confidence: 0.93, createdAt: R0 - 6 * 60_000,
      reasoning: "Эхний мөр асуултаар эхэлсэн; хэмжээний заавар руу холбосон.",
      fields: [{ label: "Суваг", value: "Instagram Reels" }, { label: "Нийтлэх", value: "11/18 · 15:00" }],
      body: "Гутлын хэмжээгээ яаж зөв сонгох вэ? Гурван алхам. Хэмжээний хүснэгт танилцуулгын холбоост.",
      sources: ["Хэмжээний хүснэгт"],
    },
  ],
};
