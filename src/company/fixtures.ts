import type { Company } from "./types";

/**
 * Fixtures in the Company contract until the company-schema session's export
 * lands. ac.me Group is drawn from the ac.me world (inai-sh/acme/out: group,
 * retail, logistics); INAI is a cleaned summary of the vault (roles = agents,
 * fm skills = workflows) with no investment, personal or client names.
 */

export const acmeGroup: Company = {
  id: "acme-group",
  name: "ac.me Group",
  segment: "institutional",
  source: "acme",
  model: {
    customers: ["Охин компаниуд", "Хувь хэрэглэгч, 3 хот (Retail)", "Холдинг доторх ба гадны тээвэр (Logistics)"],
    value: "Стратеги, санхүү, хяналт, нэгдсэн бодлогыг нэг төвөөс; охин компаниуд өөрсдийн зах зээлд төвлөрнө.",
    channels: ["Удирдах зөвлөл", "Нэгдсэн IT ба өгөгдөл", "Охин компанийн удирдлага"],
    revenue: [
      { stream: "Охин компаниудын ногдол ашиг", share: 0.8 },
      { stream: "Нэгдсэн үйлчилгээний төлбөр", share: 0.2 },
    ],
  },
  units: [
    { id: "group", name: "ac.me Group", kind: "institution" },
    { id: "g-strategy", name: "Стратеги ба хөрөнгө оруулалт", kind: "department", parentId: "group" },
    { id: "g-finance", name: "Санхүү", kind: "department", parentId: "group" },
    { id: "g-it", name: "Нэгдсэн IT ба өгөгдөл", kind: "department", parentId: "group" },
    { id: "retail", name: "ac.me Retail", kind: "company", parentId: "group" },
    { id: "r-stores", name: "Дэлгүүрийн үйл ажиллагаа", kind: "department", parentId: "retail" },
    { id: "r-night", name: "Шөнийн смена", kind: "team", parentId: "r-stores" },
    { id: "r-buying", name: "Худалдан авалт", kind: "department", parentId: "retail" },
    { id: "logistics", name: "ac.me Logistics", kind: "company", parentId: "group" },
    { id: "l-planning", name: "Тээврийн төлөвлөлт", kind: "department", parentId: "logistics" },
    { id: "l-terminal", name: "Терминал ба агуулах", kind: "department", parentId: "logistics" },
  ],
  people: [
    { id: "p-khongorzul", name: "Ч.Хонгорзул", role: "Гүйцэтгэх захирал", unitId: "group" },
    { id: "p-temuulen", name: "Б.Тэмүүлэн", role: "Стратегийн менежер", unitId: "g-strategy" },
    { id: "p-oyunaa", name: "Д.Оюунаа", role: "Санхүүгийн захирал", unitId: "g-finance" },
    { id: "p-erdene", name: "Г.Эрдэнэ", role: "Өгөгдлийн инженер", unitId: "g-it" },
    { id: "p-saruul", name: "Н.Саруул", role: "Retail-ийн захирал", unitId: "retail" },
    { id: "p-munkh", name: "О.Мөнх", role: "Дэлгүүрийн менежер", unitId: "r-stores" },
    { id: "p-anar", name: "Т.Анар", role: "Шөнийн ахлах", unitId: "r-night" },
    { id: "p-bilguun", name: "С.Билгүүн", role: "Худалдан авалтын ахлах", unitId: "r-buying" },
    { id: "p-zolboo", name: "Ж.Золбоо", role: "Logistics-ийн захирал", unitId: "logistics" },
    { id: "p-nomin", name: "Э.Номин", role: "Тээврийн төлөвлөгч", unitId: "l-planning" },
    { id: "p-ganaa", name: "Р.Ганаа", role: "Терминалын менежер", unitId: "l-terminal" },
  ],
  agents: [
    { id: "a-close", name: "Хаалтын агент", role: "Сарын санхүүгийн хаалт", unitId: "g-finance", ownerId: "p-oyunaa", skills: ["Тулгалт", "Зөрүүний шинжилгээ", "Тайлан"], memory: ["2026-10 хаалтын тэмдэглэл", "Охин компанийн дансны жагсаалт"] },
    { id: "a-board", name: "Удирдлагын товчоо", role: "Өдрийн товч мэдээ", unitId: "group", ownerId: "p-khongorzul", skills: ["Товч мэдээ", "Эрсдэлийн дохио"], memory: ["Удирдах зөвлөлийн шийдвэрүүд"] },
    { id: "a-data", name: "Өгөгдлийн агент", role: "Нэгдсэн өгөгдлийн чанар", unitId: "g-it", ownerId: "p-erdene", skills: ["ETL хяналт", "Схемийн өөрчлөлт"], memory: ["ERP шилжилтийн зураглал"] },
    { id: "a-restock", name: "Нөөцийн агент", role: "Нөөц нөхөх захиалга", unitId: "r-buying", ownerId: "p-bilguun", skills: ["Эрэлтийн таамаг", "Захиалгын төсөл"], memory: ["14 салбарын борлуулалтын хэв маяг"] },
    { id: "a-shift", name: "Сменийн агент", role: "Шөнийн сменийн хуваарь", unitId: "r-night", ownerId: "p-anar", skills: ["Хуваарь", "Ирц"], memory: ["Сменийн солилцооны дүрэм"] },
    { id: "a-route", name: "Маршрутын агент", role: "Ачааны маршрут", unitId: "l-planning", ownerId: "p-nomin", skills: ["Маршрут", "Ачааллын төлөвлөлт"], memory: ["Улирлын замын нөхцөл"] },
    { id: "a-dock", name: "Агуулахын агент", role: "Хүлээн авалт, ачилт", unitId: "l-terminal", skills: ["Хүлээн авалт", "Үлдэгдэл"], memory: [] },
  ],
  workflows: [
    {
      id: "w-close", name: "Сарын санхүүгийн хаалт", unitId: "g-finance", trigger: "Сарын сүүлийн ажлын өдөр",
      steps: [
        { id: "s1", label: "Охин компаниудын данс татах", actorId: "a-close", output: "Тулгалтын хүснэгт" },
        { id: "s2", label: "Зөрүүг тайлбарлах", actorId: "a-close", output: "Зөрүүний тэмдэглэл" },
        { id: "s3", label: "Хаалтыг батлах", actorId: "p-oyunaa", output: "Батлагдсан хаалт" },
        { id: "s4", label: "Удирдлагад тайлагнах", actorId: "a-board", output: "Товч мэдээ" },
      ],
    },
    {
      id: "w-restock", name: "Нөөц нөхөх захиалга", unitId: "r-buying", trigger: "Үлдэгдэл доод хязгаарт хүрэхэд",
      steps: [
        { id: "s1", label: "Эрэлтийг таамаглах", actorId: "a-restock", output: "7 хоногийн таамаг" },
        { id: "s2", label: "Захиалгын төсөл гаргах", actorId: "a-restock", output: "Захиалгын жагсаалт" },
        { id: "s3", label: "Захиалга батлах", actorId: "p-bilguun", output: "Илгээсэн захиалга" },
        { id: "s4", label: "Тээвэр товлох", actorId: "a-route", output: "Хүргэлтийн цонх" },
      ],
    },
    {
      id: "w-route", name: "Өдрийн маршрут", unitId: "l-planning", trigger: "Өдөр бүр 06:00",
      steps: [
        { id: "s1", label: "Ачаа нэгтгэх", actorId: "a-dock", output: "Ачааны жагсаалт" },
        { id: "s2", label: "Маршрут төлөвлөх", actorId: "a-route", output: "Маршрутын зураг" },
        { id: "s3", label: "Жолоочид хуваарилах", actorId: "p-nomin", output: "Өдрийн хуваарь" },
      ],
    },
  ],
  projects: [
    {
      id: "pr-erp", name: "Нэгдсэн ERP шилжилт", unitId: "g-it", status: "in-progress",
      tasks: [
        { id: "t1", title: "Дансны төлөвлөгөө нэгтгэх", status: "completed", ownerId: "p-oyunaa" },
        { id: "t2", title: "Retail-ийн өгөгдөл шилжүүлэх", status: "in-progress", ownerId: "a-data" },
        { id: "t3", title: "Logistics-ийн өгөгдөл шилжүүлэх", status: "planning", ownerId: "a-data" },
        { id: "t4", title: "Хэрэглэгчийн сургалт", status: "waiting", ownerId: "p-erdene" },
      ],
      decisions: [
        { id: "d1", title: "Шилжилтийг охин компани тус бүрээр үе шаттай хийнэ", date: "2026-10-14" },
        { id: "d2", title: "Хуучин системийг 3 сар зэрэгцүүлж ажиллуулна", date: "2026-11-02" },
      ],
    },
    {
      id: "pr-branch", name: "15 дахь салбар нээх", unitId: "retail", status: "in-progress",
      tasks: [
        { id: "t1", title: "Байршлын судалгаа", status: "completed", ownerId: "p-saruul" },
        { id: "t2", title: "Шөнийн сменийн баг бүрдүүлэх", status: "in-progress", ownerId: "a-shift" },
        { id: "t3", title: "Анхны нөөцийн захиалга", status: "inbox", ownerId: "a-restock" },
      ],
      decisions: [{ id: "d1", title: "Шинэ салбар 24 цагаар ажиллана", date: "2026-11-08" }],
    },
    {
      id: "pr-fleet", name: "Флотын маршрут оновчлол", unitId: "l-planning", status: "planning",
      tasks: [
        { id: "t1", title: "Өнгөрсөн улирлын маршрут шинжлэх", status: "in-progress", ownerId: "a-route" },
        { id: "t2", title: "Терминалын ачилтын цагийг тохируулах", status: "waiting", ownerId: "p-ganaa" },
      ],
      decisions: [],
    },
  ],
};

export const inai: Company = {
  id: "inai",
  name: "INAI",
  segment: "team",
  source: "vault",
  model: {
    customers: ["Хувь хүн (Personal Brain)", "Баг ба компани (Team · Company Brain)", "Институц (захиалгат)"],
    value: "Эх сурвалжтай агент: агент бүр өөрийн санах ойтой, ажлаа Thinking State-ийн widget-ээр харуулна.",
    channels: ["inai.sh", "Чат дахь widget", "Захиалгат хөгжүүлэлт"],
    revenue: ["Апп-ын захиалга", "Захиалгат хөгжүүлэлт", "Арга зүйн сургалт"],
  },
  units: [
    { id: "inai", name: "INAI", kind: "company" },
    { id: "lead", name: "Удирдлага", kind: "team", parentId: "inai" },
    { id: "ai-team", name: "AI баг", kind: "team", parentId: "inai" },
    { id: "studio", name: "Бүтээл", kind: "team", parentId: "ai-team" },
    { id: "knowledge", name: "Мэдлэг", kind: "team", parentId: "ai-team" },
  ],
  people: [{ id: "itge", name: "itge.e", role: "Үүсгэн байгуулагч", unitId: "lead" }],
  agents: [
    { id: "project", name: "Project", role: "Төслийн ганц цонх", unitId: "lead", ownerId: "itge", skills: ["sync", "brief", "Session Board"], memory: ["TENET дахин төлөвлөлт", "Сешн удирдах дүрэм"] },
    { id: "gtd", name: "GTD", role: "Inbox, task, өдөр", unitId: "lead", ownerId: "itge", skills: ["inbox", "task", "weekly review"], memory: ["Task hygiene дүрэм"] },
    { id: "architect", name: "Architect", role: "Код, skill, хэрэгсэл", unitId: "studio", ownerId: "itge", skills: ["skill бичих", "debug", "Thinking State"], memory: ["Chat widgets", "Company гэрээ"] },
    { id: "creative", name: "Creative", role: "Брэнд, дизайн, пост", unitId: "studio", ownerId: "itge", skills: ["fm:post", "fm:figma", "moodboard"], memory: ["inai.sh v4 дизайн"] },
    { id: "wiki", name: "Wiki", role: "Лавлагаа, атом", unitId: "knowledge", ownerId: "itge", skills: ["fm:save", "fact-check", "глоссари"], memory: ["Just.Notion загвар", "Second Brain гурван түвшин"] },
    { id: "context", name: "Context Engineer", role: "Eval, context аудит", unitId: "knowledge", skills: ["eval", "trace review"], memory: [] },
  ],
  workflows: [
    {
      id: "w-widget", name: "Чатын widget → компонент", unitId: "ai-team", trigger: "Чатад хэрэгцээ гарахад",
      steps: [
        { id: "s1", label: "Чатад widget зурах", actorId: "project", output: "Чатын widget" },
        { id: "s2", label: "Нэр өгч батлах", actorId: "itge", output: "Шийдвэрийн атом" },
        { id: "s3", label: "Компонент болгох", actorId: "architect", output: "Thinking State PR" },
        { id: "s4", label: "Merge хийх", actorId: "itge", output: "Каталогт шинэ компонент" },
      ],
    },
    {
      id: "w-post", name: "Пост бэлтгэх", unitId: "studio", trigger: "Brief ирэхэд",
      steps: [
        { id: "s1", label: "Дэгээ ба бүтэц", actorId: "creative", output: "10 слайдын бүтэц" },
        { id: "s2", label: "Figma-д зурах", actorId: "creative", output: "Слайдын зураг" },
        { id: "s3", label: "Contrast шалгах", actorId: "creative", output: "Шалгалтын тайлан" },
        { id: "s4", label: "Нийтлэх", actorId: "itge", output: "Нийтэлсэн пост" },
      ],
    },
    {
      id: "w-save", name: "Линкийг атом болгох", unitId: "knowledge", trigger: "Линк хадгалахад",
      steps: [
        { id: "s1", label: "Эх сурвалж унших", actorId: "wiki", output: "Лавлагааны нот" },
        { id: "s2", label: "Атом болгох", actorId: "wiki", output: "Атомын нот" },
        { id: "s3", label: "Давхардал нэгтгэх", actorId: "wiki", output: "Холбоос" },
      ],
    },
  ],
  projects: [
    {
      id: "inai-website", name: "Inai Website", unitId: "lead", status: "in-progress",
      tasks: [
        { id: "t1", title: "TENET дахин төлөвлөлт", status: "completed", ownerId: "project" },
        { id: "t2", title: "Нэг schema + INAI экспорт", status: "in-progress", ownerId: "architect" },
        { id: "t3", title: "Hero «тархи ↔ апп» зураглал", status: "planning", ownerId: "creative" },
        { id: "t4", title: "GitHub төлбөр засах", status: "waiting", ownerId: "itge" },
      ],
      decisions: [
        { id: "d1", title: "inai.sh бол Thinking State апп", date: "2026-11-12" },
        { id: "d2", title: "Brain-ийг хэмжээгээр биш, хүн бүрт бүтэн суурь", date: "2026-11-12" },
      ],
    },
    {
      id: "thinking-state", name: "Thinking State", unitId: "studio", status: "in-progress",
      tasks: [
        { id: "t1", title: "Chat widgets", status: "completed", ownerId: "architect" },
        { id: "t2", title: "Компанийн renderer", status: "in-progress", ownerId: "architect" },
        { id: "t3", title: "Figma instance", status: "inbox", ownerId: "creative" },
      ],
      decisions: [{ id: "d1", title: "Thinking State бол бүтээгдэхүүн ба engine", date: "2026-11-12" }],
    },
  ],
};

export const companyFixtures: Company[] = [acmeGroup, inai];
