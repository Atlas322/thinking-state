// @inai/thinking-state/writing-assistant — one component per entry, so a page loads only what it mounts (screens.23).
export * from "../../library/writing-assistant";
/** No props: the component draws its own built-in ac.me demo. */
export const writingAssistantDemo = {};

import type { WritingAssistantProps } from "../../library/writing-assistant";
/** Role demo · marketing (ac.me Retail): a draft checked against the brand's tone rules. */
export const writingAssistantMarketingDemo: WritingAssistantProps = {
  name: "Бичгийн туслах",
  tagline: "Брэндийн дүрмээр шалгана.",
  suggestions: ["Богиносгох", "Гарчиг санал болгох", "Имэйлд тааруулах"],
  initialMessages: [
    { id: 1, role: "user", text: "Ноорог: «Манай өвлийн цуглуулга супер хямдарлаа!!! Яараарай»" },
    { id: 2, role: "assistant", text: "Брэндийн дүрмээр гурван засвар байна. 1) «Супер» ба гурван анхаарлын тэмдэг дуу хоолойд таарахгүй. 2) Хямдралыг тоогоор: 20% хүртэл (үнийн хүснэгт, 11-р сар). 3) Нэг дараагийн алхам нэмье. Санал: «Өвлийн цуглуулга 20% хүртэл хямдарлаа. 11-р сарын 30 хүртэл.»" },
  ],
};
