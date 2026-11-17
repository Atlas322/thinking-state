import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { M as MethodQuiz } from "./method-quiz-DoleOjiN.js";
const buildRecipeDemo = {
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
        "rule": "delegate сонголт бүрээс нэг агент; never → memory талбарт хориг"
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
};
const methodQuizRecipeDemo = {
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
};
const buildWizardLabelsMn = {
  title: "Бүтээх горим",
  back: "Буцах",
  next: "Дараах",
  skip: "Алгасах",
  finish: "Ноорог гаргах",
  addItem: "Нэмэх",
  addCustom: "Өөрөө нэмэх",
  result: "Ноорог",
  required: "Заавал",
  quizDone: "Энэ аргаар үргэлжлүүлэх",
  quizBack: "Аргуудыг харах",
  draft: "Ноорог",
  empty: "Хоосон — дараа нь бөглөнө",
  chooseMax: (n) => `${n} хүртэл сонгоно`
};
const opt = (o) => typeof o === "string" ? { value: o, label: o } : o;
const listOf = (v) => Array.isArray(v) ? v.filter((x) => x.trim()) : [];
const textOf = (v) => typeof v === "string" ? v.trim() : "";
function shown(show, a) {
  if (!show) return true;
  return Object.entries(show).every(([k, want]) => {
    const v = textOf(a[k]);
    return Array.isArray(want) ? want.includes(v) : v === want;
  });
}
function resolveField(f, a, branchKey = "segment") {
  const seg = textOf(a[branchKey]);
  const o = seg && f.by_segment?.[seg] || (f.by_segment ? Object.values(f.by_segment)[0] : void 0);
  return o ? { ...f, ...o } : f;
}
function visibleSteps(recipe, a) {
  return recipe.steps.filter((s) => shown(s.show_if, a));
}
const fieldsFor = (s, a, branchKey) => {
  const method = textOf(a.methodology);
  const raw = s.fields ?? (method ? s.by_methodology?.[method] ?? [] : []);
  return raw.filter((f) => shown(f.show_if, a)).map((f) => resolveField(f, a, branchKey));
};
const MODEL_KEYS = ["customers", "channels", "revenue", "partners", "activities", "resources", "relationships", "costs", "problem", "solution", "metrics", "advantage"];
const SEGMENT_ALIASES = { institutional: "company", institution: "company", organization: "company", individual: "personal", solo: "personal" };
function resolveSegment(recipe, value, aliases = SEGMENT_ALIASES) {
  if (!value) return void 0;
  const key = recipe.branch_key ?? "segment";
  const field = recipe.steps.flatMap((s) => s.fields ?? []).find((f) => f.key === key);
  const options = (field?.options ?? []).map((o) => typeof o === "string" ? o : o.value);
  const v = value.trim().toLowerCase();
  if (options.includes(v)) return v;
  const alias = aliases[v];
  return alias && options.includes(alias) ? alias : void 0;
}
function segmentFromSearch(search) {
  return new URLSearchParams(search).get("segment");
}
function toDraftCompany(recipe, a) {
  const branchKey = recipe.branch_key ?? "segment";
  const fields = visibleSteps(recipe, a).flatMap((s) => fieldsFor(s, a, branchKey));
  const has = (k) => fields.some((f) => f.key === k);
  const method = textOf(a.methodology) || void 0;
  const name = textOf(a.name) || "Ноорог";
  const root = "u-root";
  const unitKind = textOf(a.unit_kind) || "area";
  const model = {};
  if (has("why") && textOf(a.why)) model.value = textOf(a.why);
  for (const f of fields) if (MODEL_KEYS.includes(f.key) && f.type !== "multi" && !f.collection && textOf(a[f.key])) model[f.key] = textOf(a[f.key]);
  const facts = fields.filter((f) => f.maps_to?.includes("facts")).map((f) => ({ label: f.fact_label ?? f.label ?? f.key, value: Array.isArray(a[f.key]) ? listOf(a[f.key]).join(", ") : textOf(a[f.key]) })).filter((x) => x.value);
  const collections = [];
  for (const f of fields.filter((x) => x.collection)) {
    const items = (Array.isArray(a[f.key]) ? listOf(a[f.key]) : textOf(a[f.key]) ? [textOf(a[f.key])] : []).filter((x) => x !== "Байхгүй");
    if (!items.length) continue;
    let c = collections.find((x) => x.type === f.collection);
    if (!c) {
      c = { type: f.collection, label: f.label, fields: [], items: [] };
      collections.push(c);
    }
    for (const t of items) c.items.push({ id: `${f.collection}-${c.items.length + 1}`, title: t, props: {} });
  }
  const areas = has("areas") ? listOf(a.areas) : [];
  const projects = has("projects") ? listOf(a.projects) : [];
  const due = has("project_due") ? textOf(a.project_due) : "";
  const done = has("project_done") ? textOf(a.project_done) : "";
  const sops = has("sops") ? listOf(a.sops) : [];
  const roles = has("roles") ? listOf(a.roles) : [];
  const delegate = has("delegate") ? listOf(a.delegate) : [];
  const never = has("never") ? textOf(a.never) : "";
  const goal = has("goal") ? textOf(a.goal) : "";
  const firstQ = has("first_question") ? textOf(a.first_question) : "";
  return {
    id: "draft",
    name,
    segment: textOf(a[branchKey]),
    source: "visitor",
    methodology: method,
    model,
    units: [{ id: root, name, kind: "company" }, ...areas.map((x, i) => ({ id: `u${i + 1}`, name: x, kind: unitKind, parentId: root }))],
    people: roles.map((r, i) => ({ id: `r${i + 1}`, name: r, role: r, unitId: root })),
    agents: delegate.map((d, i) => ({ id: `a${i + 1}`, name: d, role: d, unitId: root, skills: [], memory: never ? [`Хориг: ${never}`] : [] })),
    workflows: sops.map((x, i) => ({ id: `w${i + 1}`, name: x, unitId: root, trigger: i === 0 && has("sop_trigger") ? textOf(a.sop_trigger) : "", steps: [] })),
    projects: projects.map((p, i) => ({
      id: `p${i + 1}`,
      name: p,
      unitId: root,
      status: "active",
      end: i === 0 && due ? due : void 0,
      tasks: i === 0 && done ? [{ id: "p1-done", title: done, status: "todo" }] : [],
      decisions: []
    })),
    okrs: goal ? [{ id: "o1", title: goal, keyResults: [] }] : void 0,
    notes: firstQ ? [{ id: "q-1", title: firstQ }] : void 0,
    collections: collections.length ? collections : void 0,
    facts
  };
}
function sectionItems(from, d, methodName) {
  switch (from.replace("Company.", "")) {
    case "units":
      return d.units.filter((u) => u.kind !== "company").map((u) => u.name);
    case "projects":
      return d.projects.map((p) => p.name + (p.end ? ` · ${p.end}` : ""));
    case "workflows":
      return d.workflows.map((w) => w.name + (w.trigger ? ` · ${w.trigger}` : ""));
    case "agents":
      return d.agents.map((x) => x.role);
    case "methodology":
      return d.methodology ? [methodName(d.methodology)] : [];
    case "people":
      return d.people.map((p) => p.role);
    default:
      return [];
  }
}
const CSS = `
.bw{font-family:var(--ts-font,Inter,system-ui,sans-serif);background:var(--ts-surface);color:var(--ts-fg);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size}
.bw-bar{display:flex;align-items:center;gap:12px;height:44px;padding:0 14px;border-bottom:1px solid var(--ts-line);background:var(--ts-soft)}
.bw-dots{display:flex;gap:6px}.bw-dots i{width:10px;height:10px;border-radius:50%;background:var(--ts-line)}
.bw-title{font-weight:500;font-size:14px;color:var(--ts-muted)}
.bw-count{margin-left:auto;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint)}
.bw-split{display:flex;min-height:520px}
.bw-rail{width:240px;flex:none;border-right:1px solid var(--ts-line);background:var(--ts-soft);padding:16px 12px}
.bw-rail ol{margin:0;padding:0;list-style:none}
.bw-rail li{position:relative;display:flex;gap:12px;align-items:flex-start;min-height:44px;padding:4px 6px;font-size:14px;color:var(--ts-faint)}
.bw-rail li:not(:last-child)::after{content:"";position:absolute;left:15px;top:30px;bottom:-6px;width:1.5px;background:var(--ts-line)}
.bw-rail li[data-state="done"]::after{background:var(--ts-electric)}
.bw-dot{position:relative;z-index:1;width:20px;height:20px;flex:none;border-radius:50%;border:1.5px solid var(--ts-line);background:var(--ts-surface);display:grid;place-items:center;margin-top:1px}
.bw-rail li[data-state="done"] .bw-dot{border-color:var(--ts-electric);background:var(--ts-electric);color:var(--ts-on-electric)}
.bw-rail li[data-state="now"] .bw-dot{border-color:var(--ts-electric);box-shadow:0 0 0 4px var(--ts-electric-soft)}
.bw-rail li[data-state="now"],.bw-rail li[data-state="done"]{color:var(--ts-fg)}
.bw-rail li[data-state="now"]{font-weight:600}
.bw-time{margin:12px 6px 0;padding-top:12px;border-top:1px solid var(--ts-line);font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint);letter-spacing:.02em}
.bw-main{flex:1;min-width:0;padding:28px 32px;display:flex;flex-direction:column;gap:20px}
.bw-progress{height:4px;border-radius:4px;background:var(--ts-soft-2);overflow:hidden}
.bw-progress i{display:block;height:100%;background:var(--ts-electric);transition:width var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-standard,ease)}
.bw-intro{display:flex;flex-direction:column;gap:6px;padding-bottom:16px;border-bottom:1px solid var(--ts-line)}
.bw-intro span{font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;color:var(--ts-faint);text-transform:uppercase}
.bw-intro p{margin:0;font-size:15px;line-height:1.5;color:var(--ts-muted)}
.bw-intro small{font-size:13px;color:var(--ts-faint)}
.bw-h{font:400 24px/1.2 Spectral,Georgia,serif;margin:0}
.bw-lead{margin:-10px 0 0;font-size:14px;line-height:1.5;color:var(--ts-muted)}
.bw-field{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;border:0;min-width:0}
.bw-field>label,.bw-field>legend{font-weight:500;font-size:15px;padding:0}
.bw-req{margin-left:6px;font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-faint);letter-spacing:.04em}
.bw-hint{font-size:13px;color:var(--ts-muted);margin:0}
.bw-input{min-height:44px;box-sizing:border-box;width:100%;padding:10px 12px;border:1.5px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);color:var(--ts-fg);font:inherit;font-size:16px}
textarea.bw-input{min-height:72px;resize:vertical;line-height:1.5}
.bw-input::placeholder{color:var(--ts-faint)}
.bw-input:focus{outline:none;border-color:var(--ts-electric);box-shadow:0 0 0 3px var(--ts-electric-soft)}
.bw-choices{display:flex;flex-wrap:wrap;gap:8px}
.bw-pick{position:relative;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);cursor:pointer;font-size:15px}
.bw-pick small{color:var(--ts-muted);font-size:13px}
.bw-pick:hover{border-color:var(--ts-faint)}
.bw-pick:has(input:checked){border-color:var(--ts-electric);background:var(--ts-electric-soft)}
.bw-pick:has(input:disabled){opacity:.5;cursor:not-allowed}
.bw-pick:has(input:focus-visible),.bw-card:has(input:focus-visible){outline:2px solid var(--ts-electric);outline-offset:2px}
.bw-pick input,.bw-card input{position:absolute;opacity:0;width:1px;height:1px}
.bw-custom{display:flex;gap:8px;max-width:420px}
.bw-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.bw-card{position:relative;display:flex;flex-direction:column;gap:6px;padding:14px;min-height:44px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);cursor:pointer}
.bw-card:hover{border-color:var(--ts-faint)}
.bw-card:has(input:checked){border-color:var(--ts-electric);background:var(--ts-electric-soft)}
.bw-card b{font-weight:600;font-size:16px}
.bw-card .bw-short{font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);color:var(--ts-electric-fg);letter-spacing:.04em}
.bw-card p{margin:0;font-size:14px;line-height:1.45;color:var(--ts-muted)}
.bw-card small{font-size:13px;color:var(--ts-faint)}
.bw-unsure{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px dashed var(--ts-faint);border-radius:var(--ts-radius,6px)}
.bw-unsure p{margin:0;font-size:14px;color:var(--ts-muted)}
.bw-list{display:flex;flex-direction:column;gap:8px}
.bw-sub{padding:12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);display:flex;flex-direction:column;gap:8px}
.bw-sub b{font-weight:500;font-size:14px}
.bw-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 20px;align-items:start}
.bw-nav{display:flex;gap:8px;align-items:center;margin-top:auto}
.bw-nav .bw-sp{flex:1}
.bw-btn{display:inline-flex;align-items:stretch;min-height:44px;border-radius:var(--ts-radius,6px);font:inherit;font-weight:500;font-size:15px;cursor:pointer;padding:0;border:0;background:none;color:var(--ts-fg)}
.bw-btn>em{font-style:normal;display:flex;align-items:center;padding:0 16px;white-space:nowrap}
.bw-btn>span{display:grid;place-items:center;width:44px;border-left:1.5px solid color-mix(in srgb,currentColor 35%,transparent)}
.bw-btn.primary{background:var(--ts-electric);color:var(--ts-on-electric)}
.bw-btn.secondary{border:1.5px solid var(--ts-fg)}
.bw-btn.ghost{text-decoration:underline;text-decoration-color:var(--ts-line);text-underline-offset:4px}
.bw-btn.ghost>em{padding:0 8px}
.bw-btn:disabled{opacity:.45;cursor:not-allowed}
.bw-btn:focus-visible{outline:2px solid var(--ts-electric);outline-offset:2px}
.bw-draft{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.bw-block{padding:14px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-page);display:flex;flex-direction:column;gap:8px}
.bw-block>span{font:500 11px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-faint);display:flex;justify-content:space-between}
.bw-block ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.bw-block li{font-size:14px;line-height:1.4;padding-left:16px;position:relative}
.bw-block li::before{content:"";position:absolute;left:2px;top:7px;width:6px;height:6px;border-radius:50%;background:var(--ts-electric)}
.bw-block p{margin:0;font-size:14px;color:var(--ts-faint);font-style:italic}
.bw-tag{align-self:flex-start;font:500 12px var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;color:var(--ts-electric-fg);border:1px solid var(--ts-electric);border-radius:var(--ts-radius,6px);padding:3px 8px}
@container (max-width:680px){.bw-rail{display:none}.bw-main{padding:20px}.bw-cards,.bw-draft,.bw-grid{grid-template-columns:1fr}.bw-choices:not([data-multi]){flex-direction:column}.bw-choices:not([data-multi]) .bw-pick{justify-content:space-between}.bw-nav{flex-wrap:wrap}}
`;
const check = /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M20 6 9 17l-5-5" }) });
const arrow = /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
  /* @__PURE__ */ jsx("path", { d: "m12 5 7 7-7 7" })
] });
const plus = /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" }) });
function BuildWizard({ recipe = buildRecipeDemo, quiz = methodQuizRecipeDemo, defaultAnswers = {}, segment, segmentAliases = SEGMENT_ALIASES, defaultStep = 0, theme = "light", onComplete, onCta, labels: labelsIn, className = "" }) {
  const labels = { ...buildWizardLabelsMn, ...labelsIn };
  const uid = React.useId();
  const branchKey = recipe.branch_key ?? "segment";
  const [a, setA] = React.useState(() => {
    const seg2 = resolveSegment(recipe, segment, segmentAliases);
    return seg2 && !defaultAnswers[branchKey] ? { ...defaultAnswers, [branchKey]: seg2 } : defaultAnswers;
  });
  const [step, setStep] = React.useState(defaultStep);
  const [quizOpen, setQuizOpen] = React.useState(false);
  const [custom, setCustom] = React.useState({});
  const steps = visibleSteps(recipe, a);
  const n = steps.length;
  React.useEffect(() => {
    if (step > n) setStep(Math.max(0, n - 1));
  }, [step, n]);
  const done = step >= n;
  const s = steps[Math.min(step, n - 1)];
  const fields = s ? fieldsFor(s, a, branchKey) : [];
  const set = (k, v) => setA((x) => ({ ...x, [k]: v }));
  const dark = theme === "dark";
  const missing = fields.some((f) => f.required && !textOf(a[f.key]));
  const go = (to) => {
    setQuizOpen(false);
    setStep(to);
    if (to === n) onComplete?.(a, toDraftCompany(recipe, a));
  };
  const seg = textOf(a[branchKey]);
  const time = seg && recipe.intro?.time_by_segment?.[seg] || recipe.intro?.time;
  const addCustom = (f, cur) => {
    const v = (custom[f.key] ?? "").trim();
    if (v && !cur.includes(v)) set(f.key, [...cur, v]);
    setCustom({ ...custom, [f.key]: "" });
  };
  const renderField = (f) => {
    const id = `${uid}-${f.key}`;
    const req = f.required ? /* @__PURE__ */ jsx("span", { className: "bw-req", children: labels.required }) : null;
    const options = (f.options ?? []).map(opt);
    if (f.type === "cards") {
      return /* @__PURE__ */ jsxs("fieldset", { className: "bw-field", children: [
        f.label && /* @__PURE__ */ jsxs("legend", { children: [
          f.label,
          req
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bw-cards", children: options.map((o) => /* @__PURE__ */ jsxs("label", { className: "bw-card", children: [
          /* @__PURE__ */ jsx("input", { type: "radio", name: id, value: o.value, checked: a[f.key] === o.value, onChange: () => set(f.key, o.value) }),
          o.short && /* @__PURE__ */ jsx("span", { className: "bw-short", children: o.short }),
          /* @__PURE__ */ jsx("b", { children: o.label }),
          o.text && /* @__PURE__ */ jsx("p", { children: o.text }),
          o.fits && /* @__PURE__ */ jsx("small", { children: o.fits })
        ] }, o.value)) }),
        f.unsure && /* @__PURE__ */ jsxs("div", { className: "bw-unsure", children: [
          /* @__PURE__ */ jsx("p", { children: f.unsure.text ?? "" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "bw-btn secondary", onClick: () => quiz ? setQuizOpen(true) : set(f.key, f.unsure?.fallback ?? "bmc"), children: /* @__PURE__ */ jsx("em", { children: f.unsure.label }) })
        ] })
      ] }, f.key);
    }
    if (f.type === "choice" || f.type === "multi") {
      const multi = f.type === "multi";
      const cur = multi ? listOf(a[f.key]) : [textOf(a[f.key])];
      const extra = multi ? cur.filter((x) => !options.some((o) => o.value === x)) : [];
      const all = [...options, ...extra.map((x) => ({ value: x, label: x }))];
      const full = multi && f.max != null && cur.length >= f.max;
      return /* @__PURE__ */ jsxs("fieldset", { className: "bw-field", children: [
        /* @__PURE__ */ jsxs("legend", { children: [
          f.label,
          req
        ] }),
        (f.hint || multi && f.max) && /* @__PURE__ */ jsx("p", { className: "bw-hint", children: [f.hint, multi && f.max ? labels.chooseMax(f.max) : ""].filter(Boolean).join(" · ") }),
        /* @__PURE__ */ jsx("div", { className: "bw-choices", "data-multi": multi || void 0, children: all.map((o) => {
          const on = cur.includes(o.value);
          return /* @__PURE__ */ jsxs("label", { className: "bw-pick", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: multi ? "checkbox" : "radio",
                name: id,
                value: o.value,
                checked: on,
                disabled: full && !on,
                onChange: () => set(f.key, multi ? on ? cur.filter((x) => x !== o.value) : [...cur, o.value] : o.value)
              }
            ),
            o.label,
            o.hint && /* @__PURE__ */ jsx("small", { children: o.hint })
          ] }, o.value);
        }) }),
        multi && f.allow_custom && !full && /* @__PURE__ */ jsxs("div", { className: "bw-custom", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bw-input",
              "aria-label": `${f.label ?? f.key} — ${labels.addCustom}`,
              placeholder: labels.addCustom,
              value: custom[f.key] ?? "",
              onChange: (e) => setCustom({ ...custom, [f.key]: e.target.value }),
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom(f, cur);
                }
              }
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "button", className: "bw-btn secondary", "aria-label": labels.addCustom, onClick: () => addCustom(f, cur), children: /* @__PURE__ */ jsx("em", { children: plus }) })
        ] })
      ] }, f.key);
    }
    if (f.type === "list") {
      const listInputs = (values, onChange, label) => {
        const list = values.length ? values : [""];
        return /* @__PURE__ */ jsxs("div", { className: "bw-list", children: [
          list.map((v, i) => /* @__PURE__ */ jsx("input", { className: "bw-input", "aria-label": `${label} ${i + 1}`, placeholder: i === 0 ? f.placeholder : void 0, value: v, onChange: (e) => {
            const next = [...list];
            next[i] = e.target.value;
            onChange(next);
          } }, i)),
          list.length < (f.max ?? 5) && /* @__PURE__ */ jsx("button", { type: "button", className: "bw-btn ghost", style: { alignSelf: "flex-start" }, onClick: () => onChange([...list, ""]), children: /* @__PURE__ */ jsxs("em", { children: [
            plus,
            " ",
            labels.addItem
          ] }) })
        ] });
      };
      if (f.per === "objective") {
        const objectives = listOf(a.objectives);
        const map = typeof a[f.key] === "object" && !Array.isArray(a[f.key]) ? a[f.key] : {};
        if (!objectives.length) return null;
        return /* @__PURE__ */ jsxs("div", { className: "bw-field", children: [
          /* @__PURE__ */ jsxs("label", { children: [
            f.label,
            req
          ] }),
          objectives.map((o, i) => /* @__PURE__ */ jsxs("div", { className: "bw-sub", children: [
            /* @__PURE__ */ jsx("b", { children: o }),
            listInputs(map[String(i)] ?? [], (v) => set(f.key, { ...map, [String(i)]: v }), o)
          ] }, i))
        ] }, f.key);
      }
      return /* @__PURE__ */ jsxs("div", { className: "bw-field", children: [
        /* @__PURE__ */ jsxs("label", { children: [
          f.label,
          req
        ] }),
        f.hint && /* @__PURE__ */ jsx("p", { className: "bw-hint", children: f.hint }),
        listInputs(Array.isArray(a[f.key]) ? a[f.key] : [], (v) => set(f.key, v), f.label ?? f.key)
      ] }, f.key);
    }
    const long = !!s.by_methodology;
    return /* @__PURE__ */ jsxs("div", { className: "bw-field", children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: id, children: [
        f.label,
        req
      ] }),
      f.hint && /* @__PURE__ */ jsx("p", { className: "bw-hint", children: f.hint }),
      long ? /* @__PURE__ */ jsx("textarea", { id, className: "bw-input", placeholder: f.placeholder, value: a[f.key] ?? "", onChange: (e) => set(f.key, e.target.value) }) : /* @__PURE__ */ jsx("input", { id, type: f.type === "date" ? "date" : "text", className: "bw-input", placeholder: f.placeholder, value: a[f.key] ?? "", onChange: (e) => set(f.key, e.target.value), onKeyDown: (e) => {
        if (e.key === "Enter" && !missing) go(step + 1);
      }, style: f.type === "date" ? { maxWidth: 240 } : void 0 })
    ] }, f.key);
  };
  const draft = done ? toDraftCompany(recipe, a) : null;
  const methodName = (m) => {
    const f = recipe.steps.flatMap((x) => x.fields ?? []).find((x) => x.type === "cards");
    const o = (f?.options ?? []).map(opt).find((x) => x.value === m);
    return o ? `${o.short ? o.short + " · " : ""}${o.label}` : m ?? "";
  };
  const sections = recipe.result.sections ?? [];
  const empty = recipe.result.empty ?? labels.empty;
  return /* @__PURE__ */ jsxs("div", { className: `bw ${dark ? "dark" : ""} ${className}`, "data-ts-theme": dark ? "dark" : "cream", "data-theme": dark ? "dark" : "light", children: [
    /* @__PURE__ */ jsx("style", { children: CSS }),
    /* @__PURE__ */ jsxs("div", { className: "bw-bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "bw-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {})
      ] }),
      /* @__PURE__ */ jsx("span", { className: "bw-title", children: labels.title }),
      /* @__PURE__ */ jsx("span", { className: "bw-count", children: done ? labels.result : `${step + 1} / ${n}` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bw-split", children: [
      /* @__PURE__ */ jsxs("div", { className: "bw-rail", children: [
        /* @__PURE__ */ jsxs("ol", { children: [
          steps.map((x, i) => /* @__PURE__ */ jsxs("li", { "data-state": i < step ? "done" : i === step ? "now" : "todo", children: [
            /* @__PURE__ */ jsx("span", { className: "bw-dot", children: i < step ? check : null }),
            x.title
          ] }, x.id)),
          /* @__PURE__ */ jsxs("li", { "data-state": done ? "now" : "todo", children: [
            /* @__PURE__ */ jsx("span", { className: "bw-dot" }),
            labels.result
          ] })
        ] }),
        time && /* @__PURE__ */ jsx("p", { className: "bw-time", children: time })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bw-main", children: [
        /* @__PURE__ */ jsx("div", { className: "bw-progress", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": n, "aria-valuenow": Math.min(step, n), children: /* @__PURE__ */ jsx("i", { style: { width: `${Math.min(step, n) / n * 100}%` } }) }),
        !done && quizOpen && quiz ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "bw-btn ghost", style: { alignSelf: "flex-start" }, onClick: () => setQuizOpen(false), children: /* @__PURE__ */ jsxs("em", { children: [
            "← ",
            labels.quizBack
          ] }) }),
          /* @__PURE__ */ jsx(MethodQuiz, { ...quiz, bare: true, theme, labels: { cta: labels.quizDone }, onCta: (m) => {
            set("methodology", m);
            setQuizOpen(false);
          } })
        ] }) : !done ? /* @__PURE__ */ jsxs(Fragment, { children: [
          step === 0 && recipe.intro && /* @__PURE__ */ jsxs("div", { className: "bw-intro", children: [
            recipe.intro.eyebrow && /* @__PURE__ */ jsx("span", { children: recipe.intro.eyebrow }),
            recipe.intro.lead && /* @__PURE__ */ jsx("p", { children: recipe.intro.lead }),
            recipe.intro.privacy && /* @__PURE__ */ jsx("small", { children: recipe.intro.privacy })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "bw-h", children: s.title }),
          s.lead && /* @__PURE__ */ jsx("p", { className: "bw-lead", children: s.lead }),
          s.by_methodology ? /* @__PURE__ */ jsx("div", { className: "bw-grid", children: fields.map(renderField) }) : fields.map(renderField),
          /* @__PURE__ */ jsxs("div", { className: "bw-nav", children: [
            step > 0 && /* @__PURE__ */ jsx("button", { type: "button", className: "bw-btn ghost", onClick: () => go(step - 1), children: /* @__PURE__ */ jsx("em", { children: labels.back }) }),
            /* @__PURE__ */ jsx("span", { className: "bw-sp" }),
            step > 0 && !fields.some((f) => f.required) && /* @__PURE__ */ jsx("button", { type: "button", className: "bw-btn ghost", onClick: () => go(step + 1), children: /* @__PURE__ */ jsx("em", { children: labels.skip }) }),
            /* @__PURE__ */ jsxs("button", { type: "button", className: "bw-btn primary", disabled: missing, onClick: () => go(step + 1), children: [
              /* @__PURE__ */ jsx("em", { children: step === n - 1 ? labels.finish : labels.next }),
              /* @__PURE__ */ jsx("span", { children: arrow })
            ] })
          ] })
        ] }) : draft ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("span", { className: "bw-tag", children: [
            labels.draft,
            " · ",
            draft.name
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "bw-h", children: recipe.result.title }),
          recipe.result.lead && /* @__PURE__ */ jsx("p", { className: "bw-lead", children: recipe.result.lead }),
          /* @__PURE__ */ jsx("div", { className: "bw-draft", "aria-label": draft.name, children: sections.map((sec) => {
            const items = sectionItems(sec.from, draft, methodName);
            return /* @__PURE__ */ jsxs("div", { className: "bw-block", "data-empty": !items.length, children: [
              /* @__PURE__ */ jsxs("span", { children: [
                sec.label,
                items.length > 1 && /* @__PURE__ */ jsx("b", { style: { fontWeight: 500 }, children: items.length })
              ] }),
              items.length ? /* @__PURE__ */ jsx("ul", { children: items.map((t, i) => /* @__PURE__ */ jsx("li", { children: t }, i)) }) : /* @__PURE__ */ jsx("p", { children: empty })
            ] }, sec.label);
          }) }),
          /* @__PURE__ */ jsxs("div", { className: "bw-nav", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "bw-btn ghost", onClick: () => go(n - 1), children: /* @__PURE__ */ jsx("em", { children: labels.back }) }),
            /* @__PURE__ */ jsx("span", { className: "bw-sp" }),
            (recipe.result.ctas ?? []).slice().reverse().map((c) => /* @__PURE__ */ jsxs("button", { type: "button", className: `bw-btn ${c.variant === "primary" ? "primary" : "secondary"}`, onClick: () => onCta?.(c.href, draft), children: [
              /* @__PURE__ */ jsx("em", { children: c.label }),
              c.variant === "primary" && /* @__PURE__ */ jsx("span", { children: arrow })
            ] }, c.label))
          ] })
        ] }) : null
      ] })
    ] })
  ] });
}
const buildWizardDemo = { recipe: buildRecipeDemo, quiz: methodQuizRecipeDemo };
export {
  BuildWizard as B,
  SEGMENT_ALIASES as S,
  buildWizardLabelsMn as a,
  buildWizardDemo as b,
  resolveSegment as c,
  shown as d,
  resolveField as r,
  segmentFromSearch as s,
  toDraftCompany as t,
  visibleSteps as v
};
//# sourceMappingURL=build-wizard-DPQhzsOL.js.map
