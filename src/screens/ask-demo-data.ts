/**
 * The ac.me «үнийн бодлого» story as plain data (2026-11-17, screens.18): one question, three
 * sources, one cited answer. AskWindow, CitedAnswer, SourcePreview and ThinkingState demos all use
 * it, and each per-component entry exports its own demo from here, so a page that mounts one
 * component with its demo loads this small file, not the studio bundle. Types only; no components.
 * ac.me is a made-up company: every name and figure here is demo data.
 */
import type { CitedSegment, CitedAnswerProps } from "../library/cited-answer";
import type { ThinkingStep } from "../library/thinking-state";
import type { PreviewSource } from "../library/source-preview";
import type { AskSource } from "./ask-window";

export const askDemoThinking: ThinkingStep[] = [
    { kind: "search", label: "санах ой хайж байна…", completedLabel: "3 эх сурвалж", sources: [{ label: "Шийдвэр" }, { label: "Уулзалт" }, { label: "Slack" }] },
    { kind: "step", label: "эх сурвалж нэгтгэж байна…", completedLabel: "хариу бэлэн" },
  ];

export const askDemoAnswer: CitedSegment[] = [
    { text: "Үнийн шинэчлэлийг 10-р сарын багийн уулзалтаар шийдсэн.", cite: ["m"] },
    { text: " Шалтгааныг Slack дээрх хэлэлцүүлэгт,", cite: ["s"] },
    { text: " эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичсэн.", cite: ["d"] },
  ];

export const askDemoSources: AskSource[] = [
    { id: "d", kind: "decision", brand: "notion", title: "Үнийн бодлого", label: "Шийдвэр", date: "2026.10", quote: "Үнийг шинэчлэхээр шийдэв. Шалтгаан: зардал өссөн, өрсөлдөгчдийн үнэ өөрчлөгдсөн. Хэрэгжүүлэх: дараагийн улирлаас. Эзэн: борлуулалтын баг.", highlight: "Үнийг шинэчлэхээр шийдэв." },
    { id: "m", kind: "meeting", brand: "google-calendar", title: "Багийн уулзалт · 10-р сар", label: "Уулзалтын тэмдэглэл", date: "2026.10", quote: "Үнийн хоёр хувилбарыг харьцуулав. Харилцагчдад урьдчилан мэдэгдэхээр тохирлоо. Эцсийн шийдвэрийг «Үнийн бодлого» тэмдэглэлд бичнэ.", highlight: "урьдчилан мэдэгдэхээр" },
    { id: "s", kind: "message", brand: "slack", title: "#sales · үнийн хэлэлцүүлэг", label: "Slack thread", date: "2026.10", quote: "Зардал өссөнийг санхүүгийн баг мэдэгдэв. Борлуулалтын баг харилцагчийн хариуг хуваалцав. Уулзалтаар шийдэхээр тохирлоо.", highlight: "Зардал өссөнийг" },
  ];

export const citedAnswerDemo: CitedAnswerProps = {
  segments: askDemoAnswer,
  sources: askDemoSources.map((s) => ({ id: s.id, title: s.title, site: s.label, date: s.date, quote: s.quote, highlight: s.highlight })),
};

const preview = (s: AskSource): PreviewSource => ({ id: s.id, title: s.title, kind: s.kind, kindLabel: s.label, date: s.date, quote: s.quote, highlight: s.highlight, brand: s.brand });
export const sourcePreviewDemo: { source: PreviewSource } = { source: preview(askDemoSources[2]) };

export const thinkingStateDemo: { steps: ThinkingStep[]; loop: boolean } = { steps: askDemoThinking, loop: true };

// ── Answer with @mentions and numbered rows (screens.21; shape of web-app inai-home v31) ──
import { citedSegmentsFrom } from "../library/cited-answer";
import type { Mention } from "../library/entity-mention";
import type { AskWindowProps } from "./ask-window";

export const askDemoMentions: Mention[] = [
  { name: "Гүйцэтгэх захирал", type: "ажилтан", lines: ["Салбар 01", "Сүүлийн үйлдэл: үнийн бодлогыг батлав", "Төлөв: батлагдсан"], sourceNote: "Үнийн бодлого" },
  { name: "Онлайн захиалга", type: "борлуулалтын суваг", lines: ["Орлогын урсгал · ac.me Retail", "Хариуцагч: дэд захирал", "Төлөв: идэвхтэй"], sourceNote: "Бизнес загвар" },
  { name: "Салбар 07", type: "салбар", lines: ["Менежер: салбарын менежер", "Сүүлийн тайлан: 10-р сар", "Төлөв: туршилтын салбар"], sourceNote: "Салбарын бүртгэл" },
  { name: "Салбарын менежер", type: "ажилтан", lines: ["Салбар 07", "Хүлээгдэж буй: үнийн батлалт", "Төлөв: хүлээгдэж буй"], sourceNote: "Салбарын бүртгэл" },
];

/** The hero's ask with a direct answer, two numbered rows and the next step; names are @mentions. */
export const askWindowMentionsDemo: Pick<AskWindowProps, "question" | "answer" | "mentions"> = {
  question: "Үнийн шинэчлэлийг хэзээ, яагаад шийдсэн бэ?",
  answer: citedSegmentsFrom({
    direct: "10-р сарын удирдлагын уулзалтаар шийдсэн [2]; шийдвэрийг @Гүйцэтгэх захирал баталсан [1].",
    list: [
      { n: "01", text: "Дунд түвшний багц нэмнэ: @Онлайн захиалга сувагт эхэлж [1]." },
      { n: "02", text: "Дээд багцын үнэ хэвээр; @Салбар 07 туршина [3]." },
    ],
    next: "Шинэ үнийг @Салбарын менежер батлахыг хүлээж байна.",
  }, ["d", "m", "s"]),
  mentions: askDemoMentions,
};
