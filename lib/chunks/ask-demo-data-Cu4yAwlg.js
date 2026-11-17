import { c as citedSegmentsFrom } from "./cited-answer-eJy9EKIh.js";
const askDemoThinking = [
  { kind: "search", label: "санах ой хайж байна…", completedLabel: "3 эх сурвалж", sources: [{ label: "Шийдвэр" }, { label: "Уулзалт" }, { label: "Slack" }] },
  { kind: "step", label: "эх сурвалж нэгтгэж байна…", completedLabel: "хариу бэлэн" }
];
const askDemoAnswer = [
  { text: "Үнийн шинэчлэлийг 10-р сарын багийн уулзалтаар шийдсэн.", cite: ["m"] },
  { text: " Шалтгааныг Slack дээрх хэлэлцүүлэгт,", cite: ["s"] },
  { text: " эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичсэн.", cite: ["d"] }
];
const askDemoSources = [
  { id: "d", kind: "decision", brand: "notion", title: "Үнийн бодлого", label: "Шийдвэр", date: "2026.10", quote: "Үнийг шинэчлэхээр шийдэв. Шалтгаан: зардал өссөн, өрсөлдөгчдийн үнэ өөрчлөгдсөн. Хэрэгжүүлэх: дараагийн улирлаас. Эзэн: борлуулалтын баг.", highlight: "Үнийг шинэчлэхээр шийдэв." },
  { id: "m", kind: "meeting", brand: "google-calendar", title: "Багийн уулзалт · 10-р сар", label: "Уулзалтын тэмдэглэл", date: "2026.10", quote: "Үнийн хоёр хувилбарыг харьцуулав. Харилцагчдад урьдчилан мэдэгдэхээр тохирлоо. Эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичнэ.", highlight: "урьдчилан мэдэгдэхээр" },
  { id: "s", kind: "message", brand: "slack", title: "#sales · үнийн хэлэлцүүлэг", label: "Slack thread", date: "2026.10", quote: "Зардал өссөнийг санхүүгийн баг мэдэгдэв. Борлуулалтын баг харилцагчийн хариуг хуваалцав. Уулзалтаар шийдэхээр тохирлоо.", highlight: "Зардал өссөнийг" }
];
const citedAnswerDemo = {
  segments: askDemoAnswer,
  sources: askDemoSources.map((s) => ({ id: s.id, title: s.title, site: s.label, date: s.date, quote: s.quote, highlight: s.highlight }))
};
const preview = (s) => ({ id: s.id, title: s.title, kind: s.kind, kindLabel: s.label, date: s.date, quote: s.quote, highlight: s.highlight, brand: s.brand });
const sourcePreviewDemo = { source: preview(askDemoSources[2]) };
const thinkingStateDemo = { steps: askDemoThinking, loop: true };
const askDemoMentions = [
  { name: "Гүйцэтгэх захирал", type: "ажилтан", lines: ["Салбар 01", "Сүүлийн үйлдэл: үнийн бодлогыг батлав", "Төлөв: батлагдсан"], sourceNote: "Үнийн бодлого" },
  { name: "Онлайн захиалга", type: "борлуулалтын суваг", lines: ["Орлогын урсгал · ac.me Retail", "Хариуцагч: дэд захирал", "Төлөв: идэвхтэй"], sourceNote: "Бизнес загвар" },
  { name: "Салбар 07", type: "салбар", lines: ["Менежер: салбарын менежер", "Сүүлийн тайлан: 10-р сар", "Төлөв: туршилтын салбар"], sourceNote: "Салбарын бүртгэл" },
  { name: "Салбарын менежер", type: "ажилтан", lines: ["Салбар 07", "Хүлээгдэж буй: үнийн батлалт", "Төлөв: хүлээгдэж буй"], sourceNote: "Салбарын бүртгэл" }
];
const askWindowMentionsDemo = {
  question: "Үнийн шинэчлэлийг хэзээ, яагаад шийдсэн бэ?",
  answer: citedSegmentsFrom({
    direct: "10-р сарын удирдлагын уулзалтаар шийдсэн [2]; шийдвэрийг @Гүйцэтгэх захирал баталсан [1].",
    list: [
      { n: "01", text: "Дунд түвшний багц нэмнэ: @Онлайн захиалга сувагт эхэлж [1]." },
      { n: "02", text: "Дээд багцын үнэ хэвээр; @Салбар 07 туршина [3]." }
    ],
    next: "Шинэ үнийг @Салбарын менежер батлахыг хүлээж байна."
  }, ["d", "m", "s"]),
  mentions: askDemoMentions
};
export {
  askDemoMentions as a,
  askWindowMentionsDemo as b,
  citedAnswerDemo as c,
  askDemoSources as d,
  askDemoAnswer as e,
  askDemoThinking as f,
  sourcePreviewDemo as s,
  thinkingStateDemo as t
};
//# sourceMappingURL=ask-demo-data-Cu4yAwlg.js.map
