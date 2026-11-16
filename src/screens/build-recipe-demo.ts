/**
 * Demo content for BuildWizard — copied from web-app's recipes (Output/build-asuumj_v08.json,
 * Output/method-quiz_v02.json, 2026-11-17). The site passes its own JSON; this is for previews and tests.
 */
import type { WizardRecipe } from "./build-wizard";
import type { MethodQuizProps } from "./method-quiz";

export const buildRecipeDemo: WizardRecipe = {
 "branch_key": "segment",
 "intro": {
  "eyebrow": "Бүтээх",
  "title": "Ажил *нэг тархинд* хэрхэн буух вэ?",
  "lead": "Хэдэн асуултад хариулахад төсөл, хүрээ, давтагддаг ажил, агентад даатгах зүйл нэг ноорог болно.",
  "privacy": "Хариулт энэ хөтчид хадгалагдана. Уулзалт товлох үед л INAI руу илгээгдэнэ.",
  "time_by_segment": {
   "personal": "≈5 минут · 5 алхам",
   "team": "≈8 минут · 7 алхам",
   "company": "≈10 минут · 7 алхам"
  },
  "time_note": "Сегмент сонгомогц хугацаа ба алхмын тоо шинэчлэгдэнэ"
 },
 "steps": [
  {
   "id": "who",
   "title": "Эхлээд танилцъя",
   "fields": [
    {
     "key": "name",
     "label": "Компани эсвэл өөрийн нэр",
     "type": "text",
     "required": true,
     "maps_to": "Company.name"
    },
    {
     "key": "segment",
     "label": "Хэдүүлээ ажилладаг вэ?",
     "type": "choice",
     "required": true,
     "maps_to": "Company.segment",
     "options": [
      {
       "value": "personal",
       "label": "Ганцаараа",
       "hint": "Personal Brain — өөрийн ажил, амьдрал"
      },
      {
       "value": "team",
       "label": "Нэг баг",
       "hint": "Team Brain — 3-аас 60 орчим хүн"
      },
      {
       "value": "company",
       "label": "Олон хэлтэстэй байгууллага",
       "hint": "Company Brain"
      }
     ]
    },
    {
     "key": "line",
     "label": "Нэг өгүүлбэрээр юу хийдэг вэ?",
     "type": "text",
     "maps_to": "Company.facts[].value",
     "fact_label": "Юу хийдэг"
    },
    {
     "key": "why",
     "label": "Юуны төлөө үүнийг хийдэг вэ?",
     "type": "text",
     "maps_to": "Company.model.value"
    }
   ]
  },
  {
   "id": "areas",
   "title": "Тогтмол анхаардаг хүрээ",
   "lead": "Хүрээ гэдэг нь дуусдаггүй, тогтмол хариуцдаг зүйл. Төсөл дуусдаг, хүрээ үргэлжилдэг.",
   "fields": [
    {
     "key": "areas",
     "type": "multi",
     "allow_custom": true,
     "maps_to": "Company.units[].name kind: area",
     "by_segment": {
      "personal": {
       "label": "Ямар хүрээг тогтмол анхаардаг вэ?",
       "options": [
        "Ажил",
        "Эрүүл мэнд",
        "Гэр бүл",
        "Санхүү",
        "Суралцах",
        "Гэр орон"
       ]
      },
      "team": {
       "label": "Баг ямар чиглэлүүдийг тогтмол хариуцдаг вэ?",
       "options": [
        "Борлуулалт",
        "Маркетинг",
        "Бүтээгдэхүүн",
        "Харилцагчийн үйлчилгээ",
        "Санхүү",
        "Хүний нөөц"
       ]
      },
      "company": {
       "label": "Ямар хэлтэс, салбартай вэ?",
       "options": [
        "Удирдлага",
        "Борлуулалт",
        "Маркетинг",
        "Үйлдвэрлэл",
        "Санхүү",
        "Хүний нөөц",
        "IT",
        "Хууль"
       ]
      }
     }
    },
    {
     "key": "unit_kind",
     "label": "Эдгээр нь байгууллагад юу вэ?",
     "type": "choice",
     "show_if": {
      "segment": "company"
     },
     "maps_to": "Company.units[].kind",
     "options": [
      {
       "value": "department",
       "label": "Хэлтэс"
      },
      {
       "value": "team",
       "label": "Баг"
      },
      {
       "value": "institution",
       "label": "Тусдаа салбар, байгууллага"
      }
     ]
    },
    {
     "key": "area_standard",
     "label": "Хамгийн чухал хүрээнд «хэвийн байдал» юу вэ?",
     "type": "text",
     "placeholder": "Жишээ: Захиалга 24 цагт хариулагдана.",
     "maps_to": "Company.facts[].value"
    }
   ]
  },
  {
   "id": "projects",
   "title": "Одоо явж буй төслүүд",
   "fields": [
    {
     "key": "projects",
     "label": "Одоо ямар ажил явж байна? (3 хүртэл)",
     "type": "list",
     "max": 3,
     "maps_to": "Company.projects[].name"
    },
    {
     "key": "project_done",
     "label": "Хамгийн чухал нь дууссан гэдгийг юугаар мэдэх вэ?",
     "type": "text",
     "maps_to": "Company.projects[].tasks[].title"
    },
    {
     "key": "project_due",
     "label": "Хэзээ дуусах ёстой вэ?",
     "type": "date",
     "optional": true,
     "maps_to": "Company.projects[].end"
    },
    {
     "key": "project_tool",
     "label": "Төслөө одоо юугаар хөтөлдөг вэ?",
     "type": "choice",
     "show_if": {
      "segment": [
       "team",
       "company"
      ]
     },
     "maps_to": "Company.facts[].value",
     "options": [
      "Excel, хүснэгт",
      "Notion",
      "Trello, Jira гэх мэт",
      "Чат, имэйлээр",
      "Хөтөлдөггүй"
     ]
    },
    {
     "key": "methodology",
     "label": "Ажлаа ямар аргаар төлөвлөдөг вэ?",
     "type": "cards",
     "maps_to": "Company.methodology",
     "options": [
      {
       "value": "bmc",
       "label": "Бизнес загварын канвас",
       "short": "BMC"
      },
      {
       "value": "lean-canvas",
       "label": "Lean Canvas",
       "short": "Lean"
      },
      {
       "value": "okr",
       "label": "Зорилго ба гол үр дүн",
       "short": "OKR"
      },
      {
       "value": "pmbok",
       "label": "Төслийн удирдлага",
       "short": "PMBOK"
      }
     ],
     "unsure": {
      "label": "Мэдэхгүй байна",
      "fallback": "bmc"
     }
    }
   ]
  },
  {
   "id": "routines",
   "title": "Давтагддаг ажил ба дадал",
   "lead": "Давтагддаг ажил бүр стандарт журам (SOP) болж, дараа нь агентад даатгагдаж болно.",
   "fields": [
    {
     "key": "sops",
     "type": "list",
     "max": 3,
     "maps_to": "Company.workflows[].name",
     "by_segment": {
      "personal": {
       "label": "Долоо хоног бүр давтагддаг ямар ажил байна?",
       "placeholder": "Жишээ: Нэхэмжлэх илгээх"
      },
      "team": {
       "label": "Баг ямар ажлыг тогтмол давтдаг вэ?",
       "placeholder": "Жишээ: Шинэ харилцагч бүртгэх"
      },
      "company": {
       "label": "Хэлтэс хооронд ямар ажил тогтмол дамждаг вэ?",
       "placeholder": "Жишээ: Худалдан авалтын хүсэлт батлах"
      }
     }
    },
    {
     "key": "sop_trigger",
     "label": "Хамгийн их давтагддаг нь юунаас эхэлдэг вэ?",
     "type": "choice",
     "maps_to": "Company.workflows[].trigger",
     "options": [
      "Тодорхой цагт",
      "Имэйл, мессеж ирэхэд",
      "Хүсэлт ирэхэд",
      "Өөр ажил дуусахад"
     ]
    },
    {
     "key": "sop_written",
     "label": "Энэ ажлын журам бичигдсэн үү?",
     "type": "choice",
     "maps_to": "Company.facts[].value",
     "options": [
      "Тийм, баримт бий",
      "Хагас — толгойд л",
      "Үгүй"
     ]
    },
    {
     "key": "habits",
     "label": "Ямар дадлыг тогтмол барихыг хүсэж байна?",
     "type": "list",
     "max": 3,
     "show_if": {
      "segment": "personal"
     },
     "maps_to": "Company.collections[].items[].title",
     "collection": "habit"
    },
    {
     "key": "rituals",
     "label": "Баг ямар тогтмол уулзалт, тайлантай вэ?",
     "type": "multi",
     "show_if": {
      "segment": [
       "team",
       "company"
      ]
     },
     "maps_to": "Company.collections[].items[].title",
     "collection": "ritual",
     "options": [
      "Өдөр бүрийн товч уулзалт",
      "Долоо хоногийн тойм",
      "Сарын тайлан",
      "Улирлын төлөвлөлт",
      "Байхгүй"
     ]
    }
   ]
  },
  {
   "id": "people",
   "title": "Хэн юуг хариуцдаг вэ?",
   "show_if": {
    "segment": [
     "team",
     "company"
    ]
   },
   "fields": [
    {
     "key": "roles",
     "label": "Гол үүргүүдийг нэрлэнэ үү (нэргүйгээр, зөвхөн үүрэг)",
     "type": "list",
     "max": 6,
     "placeholder": "Жишээ: Борлуулалтын менежер",
     "maps_to": "Company.people[].role"
    },
    {
     "key": "decider",
     "label": "Чухал шийдвэрийг хэн гаргадаг вэ?",
     "type": "choice",
     "maps_to": "Company.facts[].value",
     "options": [
      "Нэг удирдагч",
      "Удирдлагын баг",
      "Хэлтэс бүр өөрөө",
      "Тодорхойгүй"
     ]
    },
    {
     "key": "handoff",
     "label": "Ажил хүнээс хүнд шилжихэд юу хамгийн их гээгддэг вэ?",
     "type": "choice",
     "maps_to": "Company.facts[].value",
     "options": [
      "Шийдвэрийн шалтгаан",
      "Харилцагчийн түүх",
      "Файл, баримт",
      "Дараагийн алхам"
     ]
    }
   ]
  },
  {
   "id": "knowledge",
   "title": "Мэдлэг хаана байна?",
   "fields": [
    {
     "key": "tools",
     "label": "Өдөр бүр ямар хэрэгсэл ашигладаг вэ?",
     "type": "multi",
     "maps_to": "Company.collections[].items[].title",
     "collection": "tool",
     "options": [
      "Word",
      "Excel",
      "Gmail",
      "Slack",
      "PowerPoint",
      "Photoshop",
      "Notion",
      "Figma",
      "Adobe",
      "Higgsfield",
      "Бусад"
     ]
    },
    {
     "key": "resources",
     "label": "Байнга эргэж хардаг нөөц юу вэ?",
     "type": "multi",
     "maps_to": "Company.collections[].items[].title",
     "collection": "resource",
     "options": [
      "Гэрээ, загвар баримт",
      "Үнийн жагсаалт",
      "Харилцагчийн жагсаалт",
      "Сургалтын материал",
      "Судалгаа, тайлан"
     ]
    },
    {
     "key": "pain",
     "label": "Мэдлэг хамгийн их хаана алдагддаг вэ?",
     "type": "choice",
     "maps_to": "Company.facts[].value",
     "options": [
      "Ажилтан солигдоход",
      "Уулзалтын дараа",
      "Чат, имэйлд будилж",
      "Файл олдохгүй",
      "Мэдэхгүй"
     ]
    },
    {
     "key": "first_question",
     "label": "Тархинаасаа хамгийн түрүүнд юу асуумаар байна?",
     "type": "text",
     "placeholder": "Жишээ: Өнгөрсөн сард үнийн талаар ямар шийдвэр гаргасан бэ?",
     "maps_to": "Company.notes[].title"
    }
   ],
   "show_if": {
    "segment": [
     "team",
     "company"
    ]
   }
  },
  {
   "id": "agents",
   "title": "Агентад юуг даатгах вэ?",
   "lead": "Агент байгууллагын журмаар ажиллаж, шийдвэрийг хүнд үлдээнэ.",
   "fields": [
    {
     "key": "delegate",
     "label": "Аль ажлыг хамгийн түрүүнд даатгамаар байна?",
     "type": "multi",
     "max": 3,
     "maps_to": "Company.agents[].role",
     "options": [
      "Ирсэн имэйл, хүсэлтийг ангилах",
      "Уулзалтын тэмдэглэл, дараагийн алхам",
      "Тайлан бэлтгэх",
      "Харилцагчийн асуултад хариулах",
      "Судалгаа, мэдээ цуглуулах",
      "Давтагддаг журмыг гүйцэтгэх"
     ]
    },
    {
     "key": "never",
     "label": "Юуг хэзээ ч агентад даатгахгүй вэ?",
     "type": "text",
     "placeholder": "Жишээ: Төлбөр батлах",
     "maps_to": "Company.agents[].memory"
    },
    {
     "key": "goal",
     "label": "Энэ улиралд юунд заавал хүрэх вэ?",
     "type": "text",
     "maps_to": "Company.okrs[].title"
    }
   ],
   "show_if": {
    "segment": [
     "team",
     "company"
    ]
   }
  },
  {
   "id": "knowledge-agents",
   "title": "Мэдлэг ба агент",
   "lead": "Мэдлэгээ хаана хадгалдаг, юуг агентад даатгах вэ.",
   "show_if": {
    "segment": "personal"
   },
   "fields": [
    {
     "key": "tools",
     "label": "Өдөр бүр ямар хэрэгсэл ашигладаг вэ?",
     "type": "multi",
     "maps_to": "Company.collections[].items[].title",
     "collection": "tool",
     "options": [
      "Word",
      "Excel",
      "Gmail",
      "Slack",
      "PowerPoint",
      "Photoshop",
      "Notion",
      "Figma",
      "Adobe",
      "Higgsfield",
      "Бусад"
     ]
    },
    {
     "key": "pain",
     "label": "Мэдлэг хамгийн их хаана алдагддаг вэ?",
     "type": "choice",
     "maps_to": "Company.facts[].value",
     "options": [
      "Ажилтан солигдоход",
      "Уулзалтын дараа",
      "Чат, имэйлд будилж",
      "Файл олдохгүй",
      "Мэдэхгүй"
     ]
    },
    {
     "key": "first_question",
     "label": "Тархинаасаа хамгийн түрүүнд юу асуумаар байна?",
     "type": "text",
     "placeholder": "Жишээ: Өнгөрсөн сард үнийн талаар ямар шийдвэр гаргасан бэ?",
     "maps_to": "Company.notes[].title"
    },
    {
     "key": "delegate",
     "label": "Аль ажлыг хамгийн түрүүнд даатгамаар байна?",
     "type": "multi",
     "max": 3,
     "maps_to": "Company.agents[].role",
     "options": [
      "Ирсэн имэйл, хүсэлтийг ангилах",
      "Уулзалтын тэмдэглэл, дараагийн алхам",
      "Тайлан бэлтгэх",
      "Харилцагчийн асуултад хариулах",
      "Судалгаа, мэдээ цуглуулах",
      "Давтагддаг журмыг гүйцэтгэх"
     ]
    },
    {
     "key": "never",
     "label": "Юуг хэзээ ч агентад даатгахгүй вэ?",
     "type": "text",
     "placeholder": "Жишээ: Төлбөр батлах",
     "maps_to": "Company.agents[].memory"
    },
    {
     "key": "goal",
     "label": "Энэ улиралд юунд заавал хүрэх вэ?",
     "type": "text",
     "maps_to": "Company.okrs[].title"
    }
   ]
  }
 ],
 "result": {
  "title": "Тархины ноорог бэлэн.",
  "lead": "Хариултаар зурсан хүрээ, төсөл, журам, агентын саналыг үзээд, засах зүйлээ уулзалтаар ярилцъя.",
  "sections": [
   {
    "label": "Хүрээ",
    "from": "Company.units"
   },
   {
    "label": "Төсөл",
    "from": "Company.projects"
   },
   {
    "label": "Журам (SOP)",
    "from": "Company.workflows"
   },
   {
    "label": "Агентын санал",
    "from": "Company.agents",
    "rule": "delegate сонголт бүрээс нэг агент; never → memory-д хориг"
   },
   {
    "label": "Арга зүй",
    "from": "Company.methodology"
   }
  ],
  "empty": "Хоосон — дараа нь бөглөнө",
  "ctas": [
   {
    "label": "Нооргоо үзэх",
    "variant": "primary",
    "href": "/company.html?c=draft"
   },
   {
    "label": "Уулзалт товлох",
    "variant": "secondary",
    "href": "/contact?topic=build"
   }
  ]
 }
} as WizardRecipe;

export const methodQuizRecipeDemo: Pick<MethodQuizProps, "questions" | "methods" | "note"> = {
 "questions": [
  {
   "id": "goal",
   "title": "Одоо хамгийн их юу хэрэгтэй байна?",
   "options": [
    {
     "id": "model",
     "label": "Бизнесээ нэг дор харах",
     "hint": "Хэнд, юу, яаж орлого олох",
     "weights": {
      "bmc": 3,
      "lean-canvas": 1
     }
    },
    {
     "id": "idea",
     "label": "Шинэ санаагаа шалгах",
     "hint": "Асуудал үнэхээр байна уу",
     "weights": {
      "lean-canvas": 3,
      "bmc": 1
     }
    },
    {
     "id": "growth",
     "label": "Багаа нэг зорилгод төвлөрүүлэх",
     "hint": "Улирлын зорилт",
     "weights": {
      "okr": 3
     }
    },
    {
     "id": "delivery",
     "label": "Төслөө хугацаанд нь дуусгах",
     "hint": "Хуваарь, эрсдэл, хариуцлага",
     "weights": {
      "pmbok": 3
     }
    }
   ]
  },
  {
   "id": "stage",
   "title": "Ажил аль шатандаа явж байна?",
   "options": [
    {
     "id": "early",
     "label": "Санаа, эхлэл",
     "weights": {
      "lean-canvas": 3,
      "bmc": 1
     }
    },
    {
     "id": "running",
     "label": "Тогтвортой ажиллаж байна",
     "weights": {
      "bmc": 3,
      "okr": 1
     }
    },
    {
     "id": "scaling",
     "label": "Өсөж, тэлж байна",
     "weights": {
      "okr": 3,
      "bmc": 1
     }
    },
    {
     "id": "projects",
     "label": "Төсөл, гэрээгээр ажилладаг",
     "weights": {
      "pmbok": 3
     }
    }
   ]
  },
  {
   "id": "team",
   "title": "Хэдүүлээ ажилладаг вэ?",
   "options": [
    {
     "id": "solo",
     "label": "Ганцаараа эсвэл цөөхүүлээ",
     "hint": "Personal Brain",
     "weights": {
      "lean-canvas": 2,
      "bmc": 2
     }
    },
    {
     "id": "team",
     "label": "Нэг баг",
     "hint": "Team Brain",
     "weights": {
      "okr": 2,
      "bmc": 1
     }
    },
    {
     "id": "org",
     "label": "Олон хэлтэс",
     "hint": "Company Brain",
     "weights": {
      "pmbok": 2,
      "okr": 2,
      "bmc": 1
     }
    }
   ]
  },
  {
   "id": "horizon",
   "title": "Ихэвчлэн ямар хугацаагаар төлөвлөдөг вэ?",
   "options": [
    {
     "id": "weeks",
     "label": "Хэдэн долоо хоногоор",
     "weights": {
      "lean-canvas": 2,
      "pmbok": 1
     }
    },
    {
     "id": "quarter",
     "label": "Улирлаар",
     "weights": {
      "okr": 3
     }
    },
    {
     "id": "year",
     "label": "Жилээр ба түүнээс урт",
     "weights": {
      "bmc": 2,
      "pmbok": 1
     }
    },
    {
     "id": "project",
     "label": "Төсөл бүрийн хугацаагаар",
     "weights": {
      "pmbok": 3
     }
    }
   ]
  }
 ],
 "methods": [
  {
   "id": "bmc",
   "name": "Бизнес загварын канвас",
   "short": "BMC",
   "why": "Хэнд үнэ цэнэ өгч, яаж орлого олохоо есөн блокоор нэг хуудсанд харна. Тогтвортой ажиллаж буй бизнест хамгийн ойлгомжтой эхлэл.",
   "firstStep": "Үйлчлүүлэгчийн сегмент ба үнэ цэнийн саналаа нэг өгүүлбэрээр бич."
  },
  {
   "id": "lean-canvas",
   "name": "Lean Canvas",
   "short": "Lean",
   "why": "Асуудал, шийдэл, хэмжүүрээ хурдан шалгахад зориулсан. Санаа эхэлж буй үед илүүдэл ажилгүй.",
   "firstStep": "Шийдэх гэж буй гурван асуудлаа хамгийн хурцаас нь эхлэн жагсаа."
  },
  {
   "id": "okr",
   "name": "Зорилго ба гол үр дүн",
   "short": "OKR",
   "why": "Багийг улирлын нэг зорилгод төвлөрүүлж, хүрснийг хэмжигдэхүйц үр дүнгээр шалгана.",
   "firstStep": "Энэ улирлын нэг зорилго, түүнд хүрснийг харуулах гурван үр дүнгээ бич."
  },
  {
   "id": "pmbok",
   "name": "Төслийн удирдлага",
   "short": "PMBOK",
   "why": "Төслийг үе шат, хуваарь, эрсдэл, хариуцлагаар удирдана. Гэрээ, хугацаатай ажилд найдвартай.",
   "firstStep": "Одоо явж буй гол төслөө сонгоод, аль шатандаа явж байгааг тэмдэглэ."
  }
 ],
 "note": "Дараа нь сольж болно — Thinking State аль ч аргаар зурагдана."
} as Pick<MethodQuizProps, "questions" | "methods" | "note">;
