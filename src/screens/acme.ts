/**
 * ACME — a made-up company for the Second Brain app screens (inai.sh, social, Journal).
 * Fictional case only: no real people, no client data. Roles and agents stand in for names.
 * Every figure (62%, 8–11%, 58% …) is a demo number, not real data.
 */
import type { PlanStep } from "../library/agent-plan";
import type { CitedSegment, CitedSource } from "../library/cited-answer";
import type { Decision } from "../library/decision-card";
import type { RunningTask } from "../library/running-now";
import type { Memory } from "../library/memory-panel";
import type { SessionBoardGroup, SessionBoardProject, SessionBoardSession } from "../library/session-board";

export type CaptureKind = "link" | "voice" | "idea" | "file" | "mail";
export type InboxItem = {
  id: string;
  kind: CaptureKind;
  title: string;
  /** Where it came from and when, e.g. «Утаснаас · 08:40». */
  meta: string;
  /** Where the agent suggests it goes (PARA). */
  suggest: string;
  /** A concrete next physical action, shown as the orange chip. */
  next?: string;
  processed?: boolean;
};

export type NoteLink = { id: string; title: string; kind: "decision" | "knowledge" | "project" | "source"; why: string };
export type AtomNote = {
  title: string;
  kind: string;
  date: string;
  body: string[];
  source: string;
  tags: string[];
  links: NoteLink[];
  backlinks: number;
};

export type ProjectTask = { id: string; title: string; status: "todo" | "doing" | "waiting" | "done"; owner: string; due?: string };
export type AppProject = {
  name: string;
  area: string;
  why: string;
  done: number;
  total: number;
  next: { title: string; context: string; owner: string };
  tasks: ProjectTask[];
  truth: string[];
};

export type ScreenData = {
  company: string;
  inbox: InboxItem[];
  note: AtomNote;
  project: AppProject;
  chat: {
    question: string;
    plan: PlanStep[];
    segments: CitedSegment[];
    sources: CitedSource[];
    decisions: Decision[];
    running: RunningTask[];
  };
  memories: Memory[];
  memoryCategories: string[];
  team: { project: SessionBoardProject; groups: SessionBoardGroup[]; sessions: SessionBoardSession[]; me: string };
};

export const acmeDemo: ScreenData = {
  company: "ACME",
  inbox: [
    { id: "i1", kind: "voice", title: "Үнийн шинэ багцыг 3 түвшинтэй болгох санаа", meta: "Дуут тэмдэглэл · 08:40", suggest: "Төсөл · Үнийн шинэчлэл", next: "Гурван түвшний хүснэгтийн ноорог гаргах" },
    { id: "i2", kind: "link", title: "Харилцагчийн хадгалалтын тайлан 2026", meta: "Холбоос · 09:12", suggest: "Нөөц · Судалгаа" },
    { id: "i3", kind: "mail", title: "Нийлүүлэгч: 12-р сарын нийлүүлэлт 5 хоног хоцорно", meta: "Имэйл · 09:30", suggest: "Төсөл · Агуулахын шилжилт", next: "Борлуулалтад хоцролтыг мэдэгдэх" },
    { id: "i4", kind: "idea", title: "Шинэ ажилтны чиглүүлгийг нэг хуудас болгох", meta: "Санаа · 10:05", suggest: "Хариуцлагын хүрээ · Баг" },
    { id: "i5", kind: "file", title: "3-р улирлын борлуулалт.xlsx", meta: "Файл · 10:21", suggest: "Төсөл · Улирлын тайлан", processed: true },
    { id: "i6", kind: "link", title: "Өрсөлдөгчийн үнийн хуудас", meta: "Холбоос · Өчигдөр", suggest: "Нөөц · Зах зээл", processed: true },
  ],
  note: {
    title: "Үнийн багцыг гурван түвшинтэй болгоно",
    kind: "Шийдвэр",
    date: "2026-11-14",
    body: [
      "ACME-ийн шинэ харилцагчдын 62% нь хамгийн хямд багцыг сонгоод, гурван сарын дотор дээд багц руу шилждэг.",
      "Тиймээс дунд түвшин нэмж, шилжих алхмыг богиносгоно. Дээд багцын үнэ хэвээр.",
    ],
    source: "Харилцагчийн хадгалалтын тайлан 2026 · 3-р улирлын борлуулалт",
    tags: ["үнэ", "борлуулалт", "шийдвэр"],
    links: [
      { id: "l1", title: "Харилцагч гурван сард багцаа ахиулдаг", kind: "knowledge", why: "Шийдвэрийн үндэслэл" },
      { id: "l2", title: "Үнийн шинэчлэл", kind: "project", why: "Энэ шийдвэрийг хэрэгжүүлэх төсөл" },
      { id: "l3", title: "Өрсөлдөгчийн үнийн хуудас", kind: "source", why: "Зах зээлийн харьцуулалт" },
      { id: "l4", title: "Хямдралыг жилийн төлбөрт л өгнө", kind: "decision", why: "Хамааралтай өмнөх шийдвэр" },
    ],
    backlinks: 7,
  },
  project: {
    name: "Үнийн шинэчлэл",
    area: "Борлуулалт",
    why: "Шинэ харилцагч дээд багц руу хурдан шилжиж, сарын давтагдах орлого өснө.",
    done: 5,
    total: 9,
    next: { title: "Гурван түвшний хүснэгтийн ноорог гаргах", context: "@компьютер · 30 мин", owner: "Үнийн агент" },
    tasks: [
      { id: "t1", title: "Одоогийн багцын хэрэглээг задлах", status: "done", owner: "Судлаач агент" },
      { id: "t2", title: "Өрсөлдөгчийн үнийг харьцуулах", status: "done", owner: "Судлаач агент" },
      { id: "t3", title: "Гурван түвшний хүснэгтийн ноорог", status: "doing", owner: "Үнийн агент", due: "11/19" },
      { id: "t4", title: "Санхүүгийн нөлөөллийн тооцоо", status: "waiting", owner: "Санхүү", due: "11/21" },
      { id: "t5", title: "Үнийн хуудсыг сайтад шинэчлэх", status: "todo", owner: "Вэб агент", due: "11/26" },
    ],
    truth: ["Дунд түвшин нэмэхээр шийдсэн (11/14)", "Дээд багцын үнэ хэвээр", "Санхүүгийн тооцоог хүлээж байна"],
  },
  chat: {
    question: "Шинэ үнийн багц орлогод яаж нөлөөлөх вэ? Эх сурвалжтайгаар.",
    plan: [
      { id: "p1", title: "Санах ойгоос үнийн шийдвэрүүдийг татах", tool: "memory.search", status: "done", duration: 0.8 },
      { id: "p2", title: "3-р улирлын борлуулалтыг уншиж задлах", tool: "files.read", status: "done", duration: 1.4 },
      { id: "p3", title: "Хадгалалтын тайлантай тулгах", tool: "notes.link", status: "done", duration: 1.1 },
      { id: "p4", title: "Гурван хувилбарын орлогыг тооцох", tool: "sheet.model", status: "done", duration: 1.6 },
    ],
    segments: [
      { text: "Дунд түвшин нэмбэл сарын давтагдах орлого эхний улиралд ойролцоогоор 8–11% өснө.", cite: ["sales"] },
      { text: " Учир нь шинэ харилцагчдын 62% нь хямд багцаас гурван сарын дотор ахиулдаг бөгөөд дунд шат энэ алхмыг богиносгоно.", cite: ["retention"] },
      { text: "Эрсдэл: дээд багцын зарим харилцагч дунд түвшин рүү буух магадлалтай.", cite: ["decision"], paragraph: true },
    ],
    sources: [
      { id: "sales", title: "3-р улирлын борлуулалт", site: "Файл · Тэмдэглэл", date: "2026-10-31", quote: "Хямд багц 58%, дээд багц 31%, жилийн төлбөр 11%.", highlight: "Хямд багц 58%" },
      { id: "retention", title: "Харилцагчийн хадгалалтын тайлан 2026", site: "Нөөц · Судалгаа", date: "2026-11-02", quote: "Шинэ харилцагчдын 62% нь гурван сарын дотор багцаа ахиулсан.", highlight: "62%" },
      { id: "decision", title: "Үнийн багцыг гурван түвшинтэй болгоно", site: "Атом · Шийдвэр", date: "2026-11-14", quote: "Дунд түвшин нэмж, шилжих алхмыг богиносгоно.", highlight: "Дунд түвшин" },
    ],
    decisions: [
      {
        id: "d1",
        question: "Дунд түвшний үнийг аль хувилбараар тавих вэ?",
        task: "Үнийн шинэчлэл",
        kind: "decision",
        options: [
          { id: "a", title: "Дээд багцын 60%", summary: "Орлого +11%, буух эрсдэл дунд", recommended: true },
          { id: "b", title: "Дээд багцын 75%", summary: "Орлого +8%, буух эрсдэл бага" },
        ],
      },
    ],
    running: [
      { id: "r1", title: "Үнийн хүснэгтийн ноорог", step: "Хувилбаруудыг харьцуулж байна", done: 3, total: 5, state: "running" },
      { id: "r2", title: "Нийлүүлэлтийн хоцролт", step: "Таны шийдвэр хэрэгтэй", done: 2, total: 4, state: "needs-you" },
      { id: "r3", title: "Долоо хоногийн тойм", step: "Бэлэн", done: 4, total: 4, state: "done" },
    ],
  },
  memories: [
    { id: "m1", text: "Хямдралыг зөвхөн жилийн төлбөрт өгнө", category: "Шийдвэр", source: "Атомаас", date: "11/02" },
    { id: "m2", text: "Үнийн өөрчлөлтийг сарын 1-нд л зарлана", category: "Шийдвэр", source: "Чатаас", date: "11/10" },
    { id: "m3", text: "Дунд түвшин нэмэхээр шийдсэн", category: "Шийдвэр", source: "Атомаас", date: "11/14" },
    { id: "m4", text: "Баасан гараг бүр борлуулалтын тойм гаргана", category: "Хэмнэл", source: "Таны нэмсэн", date: "10/28" },
    { id: "m5", text: "Тайланг эхлээд нэг өгүүлбэрээр, дараа нь задална", category: "Хэв маяг", source: "Чатаас", date: "10/30" },
    { id: "m6", text: "Санхүүгийн тооцоог Санхүүгийн агент баталгаажуулна", category: "Баг", source: "Багийн самбараас", date: "11/05" },
    { id: "m7", text: "Нийлүүлэгчийн хоцролтыг 24 цагт мэдэгдэнэ", category: "Хэмнэл", source: "Имэйлээс", date: "11/17", paused: true },
  ],
  memoryCategories: ["Шийдвэр", "Хэмнэл", "Хэв маяг", "Баг"],
  team: {
    project: { name: "ACME · Нэг тархи", icon: "A", status: { label: "6 агент ажиллаж байна" }, owner: "Борлуулалт", stats: { tasks: 18, decisions: 7, pages: 42 } },
    groups: [
      { id: "projects", label: "Төслүүд" },
      { id: "areas", label: "Хариуцлагын хүрээ" },
    ],
    sessions: [
      { id: "price", title: "Үнийн шинэчлэл", line: "Гурван түвшний хүснэгтийг харьцуулж байна", state: "running", group: "projects", owner: "Борлуулалт", sharedWith: ["Санхүү"] },
      { id: "price-fin", title: "Санхүүгийн нөлөөлөл", line: "Таны шийдвэрийг хүлээж байна: дунд түвшний үнэ", state: "waiting", group: "projects", parent: "price", owner: "Санхүү" },
      { id: "price-web", title: "Үнийн хуудас", line: "Ноорог бэлэн, нийтлэхээс өмнө зөвшөөрөл", state: "done", group: "projects", parent: "price", owner: "Вэб" },
      { id: "stock", title: "Агуулахын шилжилт", line: "Нийлүүлэлтийн хоцролтыг төлөвлөгөөнд оруулж байна", state: "running", group: "projects", owner: "Үйл ажиллагаа" },
      { id: "onb", title: "Шинэ ажилтны чиглүүлэг", line: "Нэг хуудсын ноорог хүлээгдэж байна", state: "idle", group: "areas", owner: "Хүний нөөц" },
      { id: "weekly", title: "Долоо хоногийн тойм", line: "14 зүйл ангилж, 3 даалгавар үүсгэлээ", state: "done", group: "areas", owner: "Борлуулалт" },
    ],
    me: "Борлуулалт",
  },
};
