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
