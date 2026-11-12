/**
 * Demo data and the two-theme frame for the catalog previews of the site
 * components (catalog only — not exported from the package). Fictional
 * content; no vault data.
 */
import * as React from "react";
import tokensCss from "../lib/tokens.css?inline";
import type { ChatScenario } from "./scenario-chat";
import type { FooterColumn, NavItem } from "./site";

export const DEMO_NAV: NavItem[] = [
  {
    kind: "menu",
    id: "product",
    label: "Бүтээгдэхүүн",
    groups: [
      {
        label: "Тархи",
        links: [
          { label: "Second Brain", href: "#brain", icon: "sparkles", note: "Байгууллагын санах ой нэг дор" },
          { label: "Эх сурвалжтай хариулт", href: "#answers", icon: "search", note: "Хариулт бүр баримт руу заана" },
        ],
      },
      {
        label: "Агент",
        links: [
          { label: "Агентын урсгал", href: "#flow", icon: "workflow", note: "Алхам, хэн, хэн батлах" },
          { label: "Эрх ба батлалт", href: "#consent", icon: "shield-check", note: "Хүн батлах хаалга" },
        ],
      },
    ],
    featured: { icon: "layers", eyebrow: "Шинэ", title: "Thinking State", body: "Компанийн тархийг апп болгон хар.", cta: "Үзэх", href: "#ts" },
  },
  {
    kind: "menu",
    id: "solutions",
    label: "Шийдэл",
    groups: [
      {
        label: "Хэмжээгээр",
        links: [
          { label: "Хувь хүн", href: "#personal", icon: "user" },
          { label: "Баг", href: "#team", icon: "users" },
          { label: "Компани", href: "#company", icon: "building-2" },
          { label: "Институц", href: "#institution", icon: "landmark" },
        ],
      },
    ],
    featured: { icon: "users", eyebrow: "Жишээ", title: "Багийн тархи 30 хоногт", body: "5 хүнтэй баг нэг сан, нэг самбартай болсон түүх.", cta: "Кейс унших", href: "#case" },
  },
  { kind: "link", label: "Үнэ", href: "#pricing", icon: "tag" },
  { kind: "link", label: "Нөөц", href: "#resources", icon: "book-open" },
];

export const DEMO_FOOTER: FooterColumn[] = [
  { id: "product", label: "Бүтээгдэхүүн", groups: [{ label: "", links: [{ label: "Second Brain", href: "#brain" }, { label: "Агентын урсгал", href: "#flow" }, { label: "Эрх ба батлалт", href: "#consent" }] }] },
  { id: "solutions", label: "Шийдэл", groups: [{ label: "", links: [{ label: "Хувь хүн", href: "#personal" }, { label: "Баг", href: "#team" }, { label: "Компани", href: "#company" }] }] },
  { id: "resources", label: "Нөөц", groups: [{ label: "", links: [{ label: "Уншвар", href: "#reading" }, { label: "Нэр томьёо", href: "#glossary" }, { label: "Шинэчлэл", href: "#changelog" }] }] },
  { id: "company", label: "Компани", groups: [{ label: "", links: [{ label: "Бидний тухай", href: "#about" }, { label: "Холбоо барих", href: "#contact" }] }] },
];

export const DEMO_SCENARIOS: ChatScenario[] = [
  {
    id: "s1",
    role: "Санхүүч",
    group: "Сарын хаалт",
    question: "Энэ сарын зардал төсвөөс хэтэрсэн үү, аль хэлтэс дээр?",
    sources: [
      { type: "register", title: "Зардлын бүртгэл · 11-р сар", date: "2026-11-10", size: "412 мөр" },
      { type: "document", title: "2026 оны төсөв", date: "2026-01-15", size: "18 х" },
      { type: "decision", title: "Маркетингийн нэмэлт төсөв", date: "2026-10-02", size: "1 шийдвэр" },
    ],
    steps: ["Бүртгэлийг хэлтсээр бүлэглэв", "Төсөвтэй харьцуулав", "Батлагдсан нэмэлтийг хасав"],
    answer: "Нийт зардал төсвийн 96% дотор. Маркетинг 8%-иар хэтэрсэн ч 10-р сард батлагдсан нэмэлт төсөв үүнийг нөхөж байна.",
    guard: "role-access",
  },
  {
    id: "s2",
    role: "Санхүүч",
    group: "Төлбөр",
    question: "Нийлүүлэгчийн 3 нэхэмжлэхийг өнөөдөр төлөх үү?",
    sources: [
      { type: "register", title: "Нэхэмжлэхийн дараалал", date: "2026-11-12", size: "3 мөр" },
      { type: "note", title: "Гэрээний нөхцөл · хугацаа", date: "2026-09-20", size: "4 х" },
    ],
    steps: ["Хугацаа тулсныг ялгав", "Мөнгөн урсгалд нөлөөг тооцов"],
    answer: "Хоёрын хугацаа маргааш дуусна; гурав дахь нь 14 хоногийн хөнгөлөлттэй. Хоёрыг өнөөдөр төлөхийг санал болгож байна.",
    guard: "human-approval",
  },
  {
    id: "s3",
    role: "Удирдлага",
    group: "Тойм",
    question: "Энэ долоо хоногт надаас юу хүлээгдэж байна?",
    sources: [{ type: "decision", title: "Нээлттэй шийдвэр · 3", date: "2026-11-11" }],
    steps: ["Таны батлах ёстойг цуглуулав"],
    answer: "Гурван шийдвэр: шинэ ажилтны санал, төлбөрийн хуваарь, нийлүүлэгчийн гэрээ.",
    guard: "human-approval",
  },
];

/** Cream and dark side by side, tokens inlined for the catalog. */
export function TwoThemes({ children, stack = false }: { children: (theme: "cream" | "dark") => React.ReactNode; stack?: boolean }) {
  return (
    <div className={`tsd${stack ? " is-stack" : ""}`}>
      <style>{tokensCss + CSS}</style>
      {(["cream", "dark"] as const).map((t) => (
        <div key={t} className="tsd-panel" data-ts-theme={t} data-theme={t === "dark" ? "dark" : "light"}>
          {children(t)}
        </div>
      ))}
    </div>
  );
}

const CSS = `
.tsd{width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:16px}
.tsd.is-stack{grid-template-columns:minmax(0,1fr)}
.tsd-panel{position:relative;min-width:0;border-radius:14px;overflow:hidden;padding:0}
`;
