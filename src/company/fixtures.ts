import type { Company } from "./types";

/**
 * Fixtures in the Company contract until the company-schema session's export
 * lands. Read-only data, as the app only views a vault.
 * - ac.me Group (OKR): from the ac.me world (inai-sh/acme/out).
 * - INAI (BMC): the vault's Business Model Canvas and team. Clients and
 *   vendors appear by type only; people by name with public links only.
 * - «PMBOK төсөл» (PMBOK): structure only — no client name, no figures.
 * Some fields are left out on purpose so empty states stay visible.
 */

export const acmeGroup: Company = {
  id: "acme-group",
  name: "ac.me Group",
  segment: "institutional",
  source: "acme",
  methodology: "okr",
  model: {
    customers: ["Охин компаниуд", "Хувь хэрэглэгч, 3 хот (Retail)", "Холдинг доторх ба гадны тээвэр (Logistics)"],
    value: "Стратеги, санхүү, хяналт, нэгдсэн бодлогыг нэг төвөөс; охин компаниуд өөрсдийн зах зээлд төвлөрнө.",
    channels: ["Удирдах зөвлөл", "Нэгдсэн IT ба өгөгдөл", "Охин компанийн удирдлага"],
    revenue: [
      { stream: "Охин компаниудын ногдол ашиг", share: 0.8 },
      { stream: "Нэгдсэн үйлчилгээний төлбөр", share: 0.2 },
    ],
    costs: ["Төвийн цалин", "Аудит, зөвлөх", "Нэгдсэн IT"],
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
    {
      id: "p-khongorzul", name: "Ч.Хонгорзул", role: "Гүйцэтгэх захирал", unitId: "group",
      about: "Холдингийг үүсгэснээс хойш удирдаж байна; охин компаниудын стратеги, нэгдсэн бодлогыг хариуцна.",
      cv: [
        { period: "2006 – одоо", title: "Гүйцэтгэх захирал", org: "ac.me Group" },
        { period: "1999 – 2006", title: "Санхүүгийн захирал", org: "ac.me Retail" },
      ],
    },
    { id: "p-temuulen", name: "Б.Тэмүүлэн", role: "Стратегийн менежер", unitId: "g-strategy" },
    { id: "p-oyunaa", name: "Д.Оюунаа", role: "Санхүүгийн захирал", unitId: "g-finance", about: "Охин компаниудын сарын хаалт, нэгдсэн тайлагналыг удирдана.", cv: [{ period: "2015 – одоо", title: "Санхүүгийн захирал", org: "ac.me Group" }] },
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
      id: "pr-erp", name: "Нэгдсэн ERP шилжилт", unitId: "g-it", status: "in-progress", area: "Үйл ажиллагаа", subArea: "Өгөгдөл", due: "2026-12-20",
      raci: { responsible: ["a-data", "p-erdene"], accountable: "p-oyunaa", consulted: ["p-saruul", "p-zolboo"], informed: ["p-khongorzul"] },
      tasks: [
        { id: "t1", title: "Дансны төлөвлөгөө нэгтгэх", status: "completed", ownerId: "p-oyunaa", due: "2026-10-30" },
        { id: "t2", title: "Retail-ийн өгөгдөл шилжүүлэх", status: "in-progress", ownerId: "a-data", due: "2026-11-20" },
        { id: "t3", title: "Logistics-ийн өгөгдөл шилжүүлэх", status: "planning", ownerId: "a-data", due: "2026-12-10" },
        { id: "t4", title: "Хэрэглэгчийн сургалт", status: "waiting", ownerId: "p-erdene", due: "2026-11-08" },
      ],
      decisions: [
        { id: "d1", title: "Шилжилтийг охин компани тус бүрээр үе шаттай хийнэ", date: "2026-10-14" },
        { id: "d2", title: "Хуучин системийг 3 сар зэрэгцүүлж ажиллуулна", date: "2026-11-02" },
      ],
    },
    {
      id: "pr-branch", name: "15 дахь салбар нээх", unitId: "retail", status: "in-progress", area: "Өсөлт", subArea: "Салбарын сүлжээ", due: "2026-12-01",
      raci: { responsible: ["p-munkh", "a-shift"], accountable: "p-saruul", consulted: ["p-bilguun"], informed: ["p-khongorzul", "p-oyunaa"] },
      tasks: [
        { id: "t1", title: "Байршлын судалгаа", status: "completed", ownerId: "p-saruul" },
        { id: "t2", title: "Шөнийн сменийн баг бүрдүүлэх", status: "in-progress", ownerId: "a-shift", due: "2026-11-18" },
        { id: "t3", title: "Анхны нөөцийн захиалга", status: "inbox", ownerId: "a-restock", due: "2026-11-25" },
      ],
      decisions: [{ id: "d1", title: "Шинэ салбар 24 цагаар ажиллана", date: "2026-11-08" }],
    },
    {
      id: "pr-fleet", name: "Флотын маршрут оновчлол", unitId: "l-planning", status: "planning", area: "Үйл ажиллагаа", subArea: "Тээвэр",
      tasks: [
        { id: "t1", title: "Өнгөрсөн улирлын маршрут шинжлэх", status: "in-progress", ownerId: "a-route" },
        { id: "t2", title: "Терминалын ачилтын цагийг тохируулах", status: "waiting", ownerId: "p-ganaa", due: "2026-11-30" },
      ],
      decisions: [],
    },
  ],
  okrs: [
    {
      id: "o1", title: "Нэг өгөгдлийн сангаар удирдана", ownerId: "p-oyunaa",
      keyResults: [
        { id: "k1", title: "Охин компани бүр ERP-д шилжсэн", progress: 40 },
        { id: "k2", title: "Сарын хаалт 5 ажлын өдөрт", progress: 70 },
      ],
    },
    {
      id: "o2", title: "Retail-ийн сүлжээг тэлнэ", ownerId: "p-saruul",
      keyResults: [
        { id: "k1", title: "15 дахь салбар нээгдсэн", progress: 55 },
        { id: "k2", title: "Шөнийн смен бүх салбарт", progress: 30 },
      ],
    },
    { id: "o3", title: "Тээврийн ачааллыг тэнцвэржүүлнэ", ownerId: "p-nomin", keyResults: [{ id: "k1", title: "Хоосон явалт хоёр дахин цөөрсөн", progress: 20 }] },
  ],
};

export const inai: Company = {
  id: "inai",
  name: "INAI",
  segment: "team",
  source: "vault",
  methodology: "bmc",
  model: {
    partners: ["Курсын түнш (сургалтын байгууллага)", "AI загварын нийлүүлэгч (6 agent-ийн тархи)", "Дизайн, монтажийн хэрэгслийн bridge", "Drive, Notion (sync, багийн толь)", "Клиент брэндүүд"],
    activities: ["Судалгаа", "Брэндинг", "Агуулга", "Дизайн", "Хөгжүүлэлт", "Сургалт бэлтгэх, заах (санал)"],
    resources: ["Vault (2 000+ файл, PARA)", "6 agent", "Figma · Framer bridge", "Бичлэгийн студи", "founder-matrix-os repo"],
    value: "«Бизнесээ системд шилжүүл.» Нэг ажил гурван газар ажиллана: клиентэд үр дүн, бидэнд чадамж, зах зээлд нотолгоо.",
    relationships: ["Cohort (Season 1 → 2)", "1:1 coaching", "Community (санал)", "Найз, танилын сүлжээ"],
    channels: ["Хувийн сүлжээ, санал", "Вэбсайтын төслүүд (15 кейс)", "Пост, reels", "Курс", "Бичлэг"],
    customers: ["SMB ба founder-ууд", "Сурагчид (Second Brain + AI)", "Клиент брэндүүд", "Сургалтын байгууллага"],
    costs: ["Хэрэгслийн захиалга", "Цаг (баг + agent-ийн ачаалал)"],
    revenue: ["Consulting", "Paper2Digit (санал)", "Automation & Marketing", "Product", "Course"],
  },
  units: [
    { id: "inai", name: "INAI", kind: "company" },
    { id: "lead", name: "Удирдлага", kind: "team", parentId: "inai" },
    { id: "tech", name: "Технологи", kind: "team", parentId: "inai" },
    { id: "gtm", name: "Маркетинг", kind: "team", parentId: "inai" },
    { id: "ai-team", name: "AI баг", kind: "team", parentId: "inai" },
    { id: "studio", name: "Бүтээл", kind: "team", parentId: "ai-team" },
    { id: "knowledge", name: "Мэдлэг", kind: "team", parentId: "ai-team" },
  ],
  people: [
    {
      id: "tuvshin", name: "Tuvshin.B", role: "Co-Founder & CEO", unitId: "lead",
      about: "Хамтран үүсгэн байгуулагч. 10+ жил enterprise технологийн борлуулалт, төслийн удирдлагаар ажилласан; стратеги, үйл ажиллагаа, бизнес хөгжлийг хариуцна.",
      cv: [
        { period: "2026.04 – одоо", title: "Co-Founder & CEO", org: "INAI" },
        { period: "2022 – 2023", title: "Business Development Manager", org: "Teltonika Asia & CA" },
        { period: "2019 – 2022", title: "Senior Project Manager", org: "Total Technology" },
        { period: "2016 – 2018", title: "Marketing Manager", org: "Air Trans" },
      ],
      links: [{ label: "GitHub", url: "https://github.com/tuvshinbmgl-dna" }],
    },
    {
      id: "itge", name: "Itgeltugs.Kh", role: "Chief Product Officer", unitId: "lead",
      about: "itge.e. Банкны санхүү → бүтээгдэхүүн → бүтээлч агентлаг → ecommerce гэсэн замаар ирсэн. Second Brain, Thinking State-ийн бүтээгдэхүүнийг удирдана.",
      cv: [
        { period: "2023 – 2024", title: "Business Developer", org: "Hobbyzone" },
        { period: "2018 – 2023", title: "Creative Agency Co-Founder", org: "Bronzehero's Entertainment" },
        { period: "2017 – 2018", title: "Product manager, Data analyst", org: "TDB" },
        { period: "2015 – 2017", title: "Стартап эрхлэгч", org: "PlayFood, Play VR" },
      ],
    },
    {
      id: "boldbaatar", name: "Boldbaatar.T", role: "Chief Technology Officer", unitId: "tech",
      about: "Go хэл дээр production backend бичдэг; хамгийн хүчтэй тал нь core banking — ledger, аудит, алдаа гаргаж болохгүй системүүд.",
      cv: [{ period: "2022 – одоо", title: "Backend Developer", org: "Tanasoft" }],
    },
    {
      id: "byambadalai", name: "Byambadalai.S", role: "Back-end Engineer · Security", unitId: "tech",
      about: "Мэдээллийн аюулгүй байдал ба backend. tsaaguur.mn-ийг барьсан.",
      cv: [
        { period: "2022 – 2024", title: "Мэдээллийн аюулгүй байдлын администратор", org: "Khan Bank" },
        { period: "2022", title: "Эмзэг байдлын шинжээч", org: "InfoSec+" },
      ],
      links: [
        { label: "GitHub", url: "https://github.com/ByamB4" },
        { label: "tsaaguur.mn", url: "https://tsaaguur.mn" },
      ],
    },
    {
      id: "badral", name: "Badral.S", role: "Chief Marketing Officer", unitId: "gtm",
      about: "«Соёл». AI-First Marketing Strategist — маркетингийг системтэй болгоно; AI кодын туслах, Obsidian, Notion стекийг өөрөө ашигладаг.",
      cv: [
        { period: "2026 – одоо", title: "CMO", org: "INAI" },
        { period: "2025 – 2026", title: "Marketing Specialist", org: "Asian Pacific Investments Group" },
        { period: "2023 – 2025", title: "CMO", org: "Fontana IL Crystalo" },
      ],
      links: [{ label: "GitHub", url: "https://github.com/so20xyz" }],
    },
  ],
  agents: [
    { id: "project", name: "Project", role: "Төслийн ганц цонх", unitId: "lead", ownerId: "itge", skills: ["sync", "brief", "Session Board"], memory: ["TENET дахин төлөвлөлт", "Сешн удирдах дүрэм"] },
    { id: "gtd", name: "GTD", role: "Inbox, task, өдөр", unitId: "lead", ownerId: "itge", skills: ["inbox", "task", "weekly review"], memory: ["Task hygiene дүрэм"] },
    { id: "architect", name: "Architect", role: "Код, skill, хэрэгсэл", unitId: "studio", ownerId: "boldbaatar", skills: ["skill бичих", "debug", "Thinking State"], memory: ["Chat widgets", "Company гэрээ"] },
    { id: "creative", name: "Creative", role: "Брэнд, дизайн, пост", unitId: "studio", ownerId: "badral", skills: ["fm:post", "fm:figma", "moodboard"], memory: ["inai.sh v4 дизайн"] },
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
        { id: "s4", label: "Нийтлэх", actorId: "badral", output: "Нийтэлсэн пост" },
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
      id: "inai-website", name: "Inai Website", unitId: "lead", status: "in-progress", area: "Бүтээгдэхүүн", subArea: "inai.sh", due: "2026-12-15",
      raci: { responsible: ["project", "architect", "creative"], accountable: "itge", consulted: ["badral", "tuvshin"], informed: ["boldbaatar"] },
      tasks: [
        { id: "t1", title: "TENET дахин төлөвлөлт", status: "completed", ownerId: "project", due: "2026-11-12" },
        { id: "t2", title: "Нэг schema + INAI экспорт", status: "in-progress", ownerId: "architect", due: "2026-11-16" },
        { id: "t3", title: "Hero «тархи ↔ апп» зураглал", status: "planning", ownerId: "creative", due: "2026-11-24" },
        { id: "t4", title: "GitHub төлбөр засах", status: "waiting", ownerId: "itge", due: "2026-11-11" },
      ],
      decisions: [
        { id: "d1", title: "inai.sh бол Thinking State апп", date: "2026-11-12" },
        { id: "d2", title: "Brain-ийг хэмжээгээр биш, хүн бүрт бүтэн суурь", date: "2026-11-12" },
      ],
    },
    {
      id: "thinking-state", name: "Thinking State", unitId: "studio", status: "in-progress", area: "Бүтээгдэхүүн", subArea: "Engine",
      raci: { responsible: ["architect"], accountable: "itge", consulted: ["boldbaatar"], informed: ["tuvshin", "badral"] },
      tasks: [
        { id: "t1", title: "Chat widgets", status: "completed", ownerId: "architect" },
        { id: "t2", title: "Компанийн renderer", status: "in-progress", ownerId: "architect", due: "2026-11-14" },
        { id: "t3", title: "Figma instance", status: "inbox", ownerId: "creative" },
      ],
      decisions: [{ id: "d1", title: "Thinking State бол бүтээгдэхүүн ба engine", date: "2026-11-12" }],
    },
    {
      id: "season-2", name: "Season 2 курс", unitId: "gtm", status: "planning", area: "Сургалт", subArea: "Cohort",
      raci: { responsible: ["badral"], accountable: "tuvshin", consulted: ["itge"], informed: [] },
      tasks: [
        { id: "t1", title: "Хөтөлбөрийн бүтэц", status: "in-progress", ownerId: "badral", due: "2026-11-28" },
        { id: "t2", title: "Бүртгэлийн хуудас", status: "inbox" },
      ],
      decisions: [],
    },
    {
      id: "security", name: "Аюулгүй байдлын аудит", unitId: "tech", status: "inbox", area: "Платформ",
      tasks: [{ id: "t1", title: "Нууцлалын бодлогын төсөл", status: "inbox", ownerId: "byambadalai" }],
      decisions: [],
    },
  ],
  notes: [
    { id: "n1", title: "Business Model Canvas — 9 блок, нотолгоо", projectId: "inai-website", date: "2026-10-11" },
    { id: "n2", title: "BMG шалгалт: гол зардал цаг, орлого нэг удаагийн", date: "2026-11-12" },
    { id: "n3", title: "Thinking State нь байгууллагын арга зүйгээр", projectId: "thinking-state", date: "2026-11-12" },
  ],
};

/** Structure of a real PMBOK vault, without the client: names are roles, no figures. */
export const pmbokProject: Company = {
  id: "pmbok",
  name: "PMBOK төсөл",
  segment: "company",
  source: "vault",
  methodology: "pmbok",
  model: {
    customers: "Захиалагч байгууллага",
    value: "Төслийг PMBOK-ийн 5 процессын бүлэг, 10 мэдлэгийн чиглэлээр удирдаж, гол тоог нэг эх (Facts hub)-ээс авна.",
    channels: ["Төслийн удирдах хороо", "Долоо хоногийн тайлан"],
    revenue: "Гэрээт ажил",
  },
  units: [
    { id: "pm", name: "PMBOK төсөл", kind: "company" },
    { id: "pmo", name: "Төслийн удирдлага", kind: "team", parentId: "pm" },
    { id: "eng", name: "Инженерчлэл", kind: "team", parentId: "pm" },
    { id: "proc", name: "Худалдан авалт", kind: "team", parentId: "pm" },
  ],
  people: [
    { id: "pm-lead", name: "Төслийн менежер", role: "PM", unitId: "pmo" },
    { id: "sponsor", name: "Захиалагчийн төлөөлөгч", role: "Sponsor", unitId: "pm" },
    { id: "planner", name: "Төлөвлөгч", role: "Хуваарь, зардал", unitId: "pmo" },
    { id: "engineer", name: "Ахлах инженер", role: "Техникийн шийдэл", unitId: "eng" },
    { id: "qa", name: "Чанарын хянагч", role: "Чанар", unitId: "eng" },
    { id: "buyer", name: "Худалдан авалтын ажилтан", role: "Гэрээ, нийлүүлэлт", unitId: "proc" },
  ],
  agents: [
    { id: "facts", name: "Facts hub агент", role: "Гол тоог нэг эхээс", unitId: "pmo", ownerId: "pm-lead", skills: ["Тоо нэгтгэх", "Зөрүү илрүүлэх"], memory: ["Charter", "PMP"] },
    { id: "schedule", name: "Хуваарийн агент", role: "Gantt, critical path", unitId: "pmo", ownerId: "planner", skills: ["Хуваарь", "Хоцролтын дохио"], memory: ["Baseline хуваарь"] },
    { id: "risk", name: "Эрсдэлийн агент", role: "Эрсдэлийн бүртгэл", unitId: "pmo", skills: ["Эрсдэлийн үнэлгээ"], memory: [] },
  ],
  workflows: [
    {
      id: "w-change", name: "Өөрчлөлтийн хүсэлт", unitId: "pmo", trigger: "Хамрах хүрээ өөрчлөгдөхөд",
      steps: [
        { id: "s1", label: "Нөлөөллийг тооцох", actorId: "schedule", output: "Нөлөөллийн тайлан" },
        { id: "s2", label: "Эрсдэл шинэчлэх", actorId: "risk", output: "Эрсдэлийн бүртгэл" },
        { id: "s3", label: "Хороонд танилцуулах", actorId: "pm-lead", output: "Өөрчлөлтийн хүсэлт" },
        { id: "s4", label: "Батлах", actorId: "sponsor", output: "Шийдвэр" },
      ],
    },
  ],
  projects: [
    {
      id: "pm-main", name: "PMBOK төсөл", unitId: "pmo", status: "in-progress", phase: "planning", area: "Төсөл", subArea: "Удирдлага", start: "2026-09-01", end: "2027-03-31",
      raci: { responsible: ["pm-lead", "planner", "facts"], accountable: "sponsor", consulted: ["engineer", "qa"], informed: ["buyer"] },
      tasks: [
        { id: "c1", title: "Project Charter", status: "completed", ownerId: "pm-lead", phase: "initiating", knowledgeArea: "integration", start: "2026-09-01", end: "2026-09-12" },
        { id: "c2", title: "Оролцогчдын бүртгэл", status: "completed", ownerId: "pm-lead", phase: "initiating", knowledgeArea: "stakeholder", start: "2026-09-08", end: "2026-09-19" },
        { id: "p1", title: "Хамрах хүрээ, WBS", status: "completed", ownerId: "engineer", phase: "planning", knowledgeArea: "scope", start: "2026-09-15", end: "2026-10-03" },
        { id: "p2", title: "Хуваарь, baseline", status: "completed", ownerId: "schedule", phase: "planning", knowledgeArea: "schedule", start: "2026-09-29", end: "2026-10-17" },
        { id: "p3", title: "Зардлын төлөвлөгөө", status: "in-progress", ownerId: "planner", phase: "planning", knowledgeArea: "cost", start: "2026-10-06", end: "2026-11-21" },
        { id: "p4", title: "Чанарын төлөвлөгөө", status: "in-progress", ownerId: "qa", phase: "planning", knowledgeArea: "quality", start: "2026-10-20", end: "2026-11-28" },
        { id: "p5", title: "Нөөцийн төлөвлөгөө", status: "planning", ownerId: "pm-lead", phase: "planning", knowledgeArea: "resource", start: "2026-11-03", end: "2026-12-05" },
        { id: "p6", title: "Харилцааны төлөвлөгөө", status: "completed", ownerId: "pm-lead", phase: "planning", knowledgeArea: "communications", start: "2026-10-13", end: "2026-10-24" },
        { id: "p7", title: "Эрсдэлийн бүртгэл", status: "in-progress", ownerId: "risk", phase: "planning", knowledgeArea: "risk", start: "2026-10-20", end: "2026-12-12" },
        { id: "p8", title: "Худалдан авалтын төлөвлөгөө", status: "waiting", ownerId: "buyer", phase: "planning", knowledgeArea: "procurement", start: "2026-11-10", end: "2026-12-19" },
        { id: "e1", title: "Нийлүүлэгч сонгох", status: "inbox", ownerId: "buyer", phase: "executing", knowledgeArea: "procurement", start: "2027-01-05", end: "2027-02-06" },
        { id: "e2", title: "Багийг бүрдүүлэх", status: "inbox", ownerId: "pm-lead", phase: "executing", knowledgeArea: "resource", start: "2027-01-05", end: "2027-01-23" },
        { id: "m1", title: "Явцын тайлан", status: "in-progress", ownerId: "facts", phase: "monitoring", knowledgeArea: "integration", start: "2026-10-01", end: "2027-03-26" },
        { id: "x1", title: "Хүлээлгэн өгөх, сургамж", status: "inbox", ownerId: "pm-lead", phase: "closing", knowledgeArea: "integration", start: "2027-03-15", end: "2027-03-31" },
      ],
      decisions: [
        { id: "d1", title: "Charter батлагдсан", date: "2026-09-12" },
        { id: "d2", title: "Хуваарийн baseline тогтоосон", date: "2026-10-17" },
      ],
    },
  ],
  facts: [
    { label: "Арга зүй", value: "PMBOK · 5 бүлэг × 10 чиглэл" },
    { label: "Эх сурвалж", value: "Charter, PMP, Facts hub" },
  ],
};

export const companyFixtures: Company[] = [inai, acmeGroup, pmbokProject];
