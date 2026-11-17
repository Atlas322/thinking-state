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
export {
  askDemoSources as a,
  askDemoAnswer as b,
  citedAnswerDemo as c,
  askDemoThinking as d,
  sourcePreviewDemo as s,
  thinkingStateDemo as t
};
//# sourceMappingURL=ask-demo-data-ojpKMDnP.js.map
