const acmeGroup = {
  id: "acme-group",
  name: "ac.me групп",
  segment: "institutional",
  source: "acme",
  methodology: "okr",
  model: {
    customers: ["Охин компаниуд", "Хувь хэрэглэгч, 3 хот (ритейл)", "Холдинг доторх ба гадны тээвэр (логистик)"],
    value: "Стратеги, санхүү, хяналт, нэгдсэн бодлогыг нэг төвөөс; охин компаниуд өөрсдийн зах зээлд төвлөрнө.",
    channels: ["Удирдах зөвлөл", "Нэгдсэн IT ба өгөгдөл", "Охин компанийн удирдлага"],
    revenue: [
      { stream: "Охин компаниудын ногдол ашиг", share: 0.8 },
      { stream: "Нэгдсэн үйлчилгээний төлбөр", share: 0.2 }
    ],
    costs: ["Төвийн цалин", "Аудит, зөвлөх", "Нэгдсэн IT"]
  },
  units: [
    { id: "group", name: "ac.me групп", kind: "institution" },
    { id: "g-strategy", name: "Стратеги ба хөрөнгө оруулалт", kind: "department", parentId: "group" },
    { id: "g-finance", name: "Санхүү", kind: "department", parentId: "group" },
    { id: "g-it", name: "Нэгдсэн IT ба өгөгдөл", kind: "department", parentId: "group" },
    { id: "retail", name: "ac.me ритейл", kind: "company", parentId: "group" },
    { id: "r-stores", name: "Дэлгүүрийн үйл ажиллагаа", kind: "department", parentId: "retail" },
    { id: "r-night", name: "Шөнийн смена", kind: "team", parentId: "r-stores" },
    { id: "r-buying", name: "Худалдан авалт", kind: "department", parentId: "retail" },
    { id: "logistics", name: "ac.me логистик", kind: "company", parentId: "group" },
    { id: "l-planning", name: "Тээврийн төлөвлөлт", kind: "department", parentId: "logistics" },
    { id: "l-terminal", name: "Терминал ба агуулах", kind: "department", parentId: "logistics" }
  ],
  people: [
    {
      id: "p-khongorzul",
      name: "Ч.Хонгорзул",
      role: "Гүйцэтгэх захирал",
      unitId: "group",
      about: "Холдингийг үүсгэснээс хойш удирдаж байна; охин компаниудын стратеги, нэгдсэн бодлогыг хариуцна.",
      cv: [
        { period: "2006 – одоо", title: "Гүйцэтгэх захирал", org: "ac.me групп" },
        { period: "1999 – 2006", title: "Санхүүгийн захирал", org: "ac.me ритейл" }
      ]
    },
    { id: "p-temuulen", name: "Б.Тэмүүлэн", role: "Стратегийн менежер", unitId: "g-strategy" },
    { id: "p-oyunaa", name: "Д.Оюунаа", role: "Санхүүгийн захирал", unitId: "g-finance", about: "Охин компаниудын сарын хаалт, нэгдсэн тайлагналыг удирдана.", cv: [{ period: "2015 – одоо", title: "Санхүүгийн захирал", org: "ac.me групп" }] },
    { id: "p-erdene", name: "Г.Эрдэнэ", role: "Өгөгдлийн инженер", unitId: "g-it" },
    { id: "p-saruul", name: "Н.Саруул", role: "Ритейлийн захирал", unitId: "retail" },
    { id: "p-munkh", name: "О.Мөнх", role: "Дэлгүүрийн менежер", unitId: "r-stores" },
    { id: "p-anar", name: "Т.Анар", role: "Шөнийн ахлах", unitId: "r-night" },
    { id: "p-bilguun", name: "С.Билгүүн", role: "Худалдан авалтын ахлах", unitId: "r-buying" },
    { id: "p-zolboo", name: "Ж.Золбоо", role: "Логистикийн захирал", unitId: "logistics" },
    { id: "p-nomin", name: "Э.Номин", role: "Тээврийн төлөвлөгч", unitId: "l-planning" },
    { id: "p-ganaa", name: "Р.Ганаа", role: "Терминалын менежер", unitId: "l-terminal" }
  ],
  agents: [
    { id: "a-close", name: "Хаалтын агент", role: "Сарын санхүүгийн хаалт", unitId: "g-finance", ownerId: "p-oyunaa", skills: ["Тулгалт", "Зөрүүний шинжилгээ", "Тайлан"], memory: ["2026-10 хаалтын тэмдэглэл", "Охин компанийн дансны жагсаалт"] },
    { id: "a-board", name: "Удирдлагын товчоо", role: "Өдрийн товч мэдээ", unitId: "group", ownerId: "p-khongorzul", skills: ["Товч мэдээ", "Эрсдэлийн дохио"], memory: ["Удирдах зөвлөлийн шийдвэрүүд"] },
    { id: "a-data", name: "Өгөгдлийн агент", role: "Нэгдсэн өгөгдлийн чанар", unitId: "g-it", ownerId: "p-erdene", skills: ["ETL хяналт", "Схемийн өөрчлөлт"], memory: ["ERP шилжилтийн зураглал"] },
    { id: "a-restock", name: "Нөөцийн агент", role: "Нөөц нөхөх захиалга", unitId: "r-buying", ownerId: "p-bilguun", skills: ["Эрэлтийн таамаг", "Захиалгын төсөл"], memory: ["14 салбарын борлуулалтын хэв маяг"] },
    { id: "a-shift", name: "Сменийн агент", role: "Шөнийн сменийн хуваарь", unitId: "r-night", ownerId: "p-anar", skills: ["Хуваарь", "Ирц"], memory: ["Сменийн солилцооны дүрэм"] },
    { id: "a-route", name: "Маршрутын агент", role: "Ачааны маршрут", unitId: "l-planning", ownerId: "p-nomin", skills: ["Маршрут", "Ачааллын төлөвлөлт"], memory: ["Улирлын замын нөхцөл"] },
    { id: "a-dock", name: "Агуулахын агент", role: "Хүлээн авалт, ачилт", unitId: "l-terminal", skills: ["Хүлээн авалт", "Үлдэгдэл"], memory: [] }
  ],
  workflows: [
    {
      id: "w-close",
      name: "Сарын санхүүгийн хаалт",
      unitId: "g-finance",
      trigger: "Сарын сүүлийн ажлын өдөр",
      steps: [
        { id: "s1", label: "Охин компаниудын данс татах", actorId: "a-close", output: "Тулгалтын хүснэгт" },
        { id: "s2", label: "Зөрүүг тайлбарлах", actorId: "a-close", output: "Зөрүүний тэмдэглэл" },
        { id: "s3", label: "Хаалтыг батлах", actorId: "p-oyunaa", output: "Батлагдсан хаалт" },
        { id: "s4", label: "Удирдлагад тайлагнах", actorId: "a-board", output: "Товч мэдээ" }
      ]
    },
    {
      id: "w-restock",
      name: "Нөөц нөхөх захиалга",
      unitId: "r-buying",
      trigger: "Үлдэгдэл доод хязгаарт хүрэхэд",
      steps: [
        { id: "s1", label: "Эрэлтийг таамаглах", actorId: "a-restock", output: "7 хоногийн таамаг" },
        { id: "s2", label: "Захиалгын төсөл гаргах", actorId: "a-restock", output: "Захиалгын жагсаалт" },
        { id: "s3", label: "Захиалга батлах", actorId: "p-bilguun", output: "Илгээсэн захиалга" },
        { id: "s4", label: "Тээвэр товлох", actorId: "a-route", output: "Хүргэлтийн цонх" }
      ]
    },
    {
      id: "w-route",
      name: "Өдрийн маршрут",
      unitId: "l-planning",
      trigger: "Өдөр бүр 06:00",
      steps: [
        { id: "s1", label: "Ачаа нэгтгэх", actorId: "a-dock", output: "Ачааны жагсаалт" },
        { id: "s2", label: "Маршрут төлөвлөх", actorId: "a-route", output: "Маршрутын зураг" },
        { id: "s3", label: "Жолоочид хуваарилах", actorId: "p-nomin", output: "Өдрийн хуваарь" }
      ]
    }
  ],
  projects: [
    {
      id: "pr-erp",
      name: "Нэгдсэн ERP шилжилт",
      unitId: "g-it",
      status: "in-progress",
      area: "Үйл ажиллагаа",
      subArea: "Өгөгдөл",
      due: "2026-12-20",
      raci: { responsible: ["a-data", "p-erdene"], accountable: "p-oyunaa", consulted: ["p-saruul", "p-zolboo"], informed: ["p-khongorzul"] },
      tasks: [
        { id: "t1", title: "Дансны төлөвлөгөө нэгтгэх", status: "completed", ownerId: "p-oyunaa", due: "2026-10-30" },
        { id: "t2", title: "Ритейлийн өгөгдөл шилжүүлэх", status: "in-progress", ownerId: "a-data", due: "2026-11-20" },
        { id: "t3", title: "Логистикийн өгөгдөл шилжүүлэх", status: "planning", ownerId: "a-data", due: "2026-12-10" },
        { id: "t4", title: "Хэрэглэгчийн сургалт", status: "waiting", ownerId: "p-erdene", due: "2026-11-08" }
      ],
      decisions: [
        { id: "d1", title: "Шилжилтийг охин компани тус бүрээр үе шаттай хийнэ", date: "2026-10-14" },
        { id: "d2", title: "Хуучин системийг 3 сар зэрэгцүүлж ажиллуулна", date: "2026-11-02" }
      ]
    },
    {
      id: "pr-branch",
      name: "15 дахь салбар нээх",
      unitId: "retail",
      status: "in-progress",
      area: "Өсөлт",
      subArea: "Салбарын сүлжээ",
      due: "2026-12-01",
      raci: { responsible: ["p-munkh", "a-shift"], accountable: "p-saruul", consulted: ["p-bilguun"], informed: ["p-khongorzul", "p-oyunaa"] },
      tasks: [
        { id: "t1", title: "Байршлын судалгаа", status: "completed", ownerId: "p-saruul" },
        { id: "t2", title: "Шөнийн сменийн баг бүрдүүлэх", status: "in-progress", ownerId: "a-shift", due: "2026-11-18" },
        { id: "t3", title: "Анхны нөөцийн захиалга", status: "inbox", ownerId: "a-restock", due: "2026-11-25" }
      ],
      decisions: [{ id: "d1", title: "Шинэ салбар 24 цагаар ажиллана", date: "2026-11-08" }]
    },
    {
      id: "pr-fleet",
      name: "Флотын маршрут оновчлол",
      unitId: "l-planning",
      status: "planning",
      area: "Үйл ажиллагаа",
      subArea: "Тээвэр",
      tasks: [
        { id: "t1", title: "Өнгөрсөн улирлын маршрут шинжлэх", status: "in-progress", ownerId: "a-route" },
        { id: "t2", title: "Терминалын ачилтын цагийг тохируулах", status: "waiting", ownerId: "p-ganaa", due: "2026-11-30" }
      ],
      decisions: []
    }
  ],
  okrs: [
    {
      id: "o1",
      title: "Нэг өгөгдлийн сангаар удирдана",
      ownerId: "p-oyunaa",
      keyResults: [
        { id: "k1", title: "Охин компани бүр ERP-д шилжсэн", progress: 40 },
        { id: "k2", title: "Сарын хаалт 5 ажлын өдөрт", progress: 70 }
      ]
    },
    {
      id: "o2",
      title: "Ритейлийн сүлжээг тэлнэ",
      ownerId: "p-saruul",
      keyResults: [
        { id: "k1", title: "15 дахь салбар нээгдсэн", progress: 55 },
        { id: "k2", title: "Шөнийн смен бүх салбарт", progress: 30 }
      ]
    },
    { id: "o3", title: "Тээврийн ачааллыг тэнцвэржүүлнэ", ownerId: "p-nomin", keyResults: [{ id: "k1", title: "Хоосон явалт хоёр дахин цөөрсөн", progress: 20 }] }
  ]
};
const roleDashboardDemo = { company: acmeGroup, personId: acmeGroup.people[0]?.id ?? "", today: /* @__PURE__ */ new Date("2026-11-17T09:00:00+08:00") };
export {
  acmeGroup as a,
  roleDashboardDemo as r
};
//# sourceMappingURL=role-dashboard-demo-BSJXEHoJ.js.map
