/**
 * Demo content for BuildWizard — copied from web-app's recipes (Output/build-asuumj_v02.json,
 * Output/method-quiz_v01.json, 2026-11-17). The site passes its own JSON; this is for previews and tests.
 */
import type { WizardRecipe } from "./build-wizard";
import type { MethodQuizProps } from "./method-quiz";

export const buildRecipeDemo: WizardRecipe = {
 "intro": {
  "eyebrow": "Бүтээх",
  "title": "Өөрийн компанийг *нэг тархинд* буулга.",
  "lead": "Хэдэн асуултад хариулахад танай компанийн Thinking State бэлэн болно. Дараа нь хамтдаа сайжруулна.",
  "time": "10 орчим минут",
  "privacy": "Хариулт таны хөтчид хадгалагдана. Уулзалт товлох үед л бидэнд ирнэ."
 },
 "steps": [
  {
   "id": "basics",
   "title": "Танай компани",
   "fields": [
    {
     "key": "name",
     "label": "Компанийн нэр",
     "type": "text",
     "required": true
    },
    {
     "key": "line",
     "label": "Нэг өгүүлбэрээр юу хийдэг вэ?",
     "type": "text",
     "placeholder": "Жишээ: Хотын жижиг дэлгүүрүүдэд бараа хүргэдэг."
    },
    {
     "key": "size",
     "label": "Хэдэн хүнтэй вэ?",
     "type": "choice",
     "options": [
      {
       "value": "personal",
       "label": "Ганцаараа эсвэл цөөхүүлээ",
       "hint": "Personal Brain"
      },
      {
       "value": "team",
       "label": "Баг",
       "hint": "Team Brain"
      },
      {
       "value": "company",
       "label": "Олон хэлтэстэй",
       "hint": "Company Brain"
      }
     ]
    }
   ]
  },
  {
   "id": "methodology",
   "title": "Танай арга зүй аль вэ?",
   "lead": "Thinking State танай өөрийн арга зүйгээр зурагдана. Аль нь ойр байна, тэрийгээ сонго — дараа нь сольж болно.",
   "fields": [
    {
     "key": "methodology",
     "type": "cards",
     "required": true,
     "options": [
      {
       "value": "bmc",
       "label": "Бизнес загварын канвас",
       "short": "BMC",
       "text": "Хэнд, ямар үнэ цэнэ өгч, яаж орлого олохоо нэг хуудсанд харна.",
       "fits": "Тогтвортой ажиллаж буй бизнес"
      },
      {
       "value": "lean-canvas",
       "label": "Lean Canvas",
       "short": "Lean",
       "text": "Асуудал, шийдэл, хэмжүүрээ хурдан шалгана.",
       "fits": "Шинэ санаа, гарааны бизнес"
      },
      {
       "value": "okr",
       "label": "Зорилго ба гол үр дүн",
       "short": "OKR",
       "text": "Улирлын зорилго, түүнд хүрснийг хэмжих үр дүн.",
       "fits": "Өсөлтөд төвлөрсөн баг"
      },
      {
       "value": "pmbok",
       "label": "Төслийн удирдлага",
       "short": "PMBOK",
       "text": "Төслийн үе шат, хуваарь, эрсдэл, хариуцлага.",
       "fits": "Төсөл, гэрээгээр ажилладаг байгууллага"
      }
     ],
     "unsure": {
      "label": "Мэдэхгүй байна",
      "text": "Дөрвөн богино асуултаар тохирох аргыг санал болгоно.",
      "fallback": "bmc"
     }
    }
   ]
  },
  {
   "id": "model",
   "title": "Гол зургаа",
   "lead": "Сонгосон арга зүйн блокоор асууна. Мэдэхгүй хэсгээ алгасаарай.",
   "by_methodology": {
    "bmc": [
     {
      "key": "customers",
      "label": "Хэнд зориулдаг вэ?"
     },
     {
      "key": "value",
      "label": "Тэдэнд ямар үнэ цэнэ өгдөг вэ?"
     },
     {
      "key": "channels",
      "label": "Тэдэнд хэрхэн хүрдэг вэ?"
     },
     {
      "key": "relationships",
      "label": "Харилцагчтайгаа хэрхэн харьцдаг вэ?"
     },
     {
      "key": "revenue",
      "label": "Юугаар орлого олдог вэ?"
     },
     {
      "key": "activities",
      "label": "Өдөр бүр хамгийн их юу хийдэг вэ?"
     },
     {
      "key": "resources",
      "label": "Юугүйгээр ажил зогсох вэ?"
     },
     {
      "key": "partners",
      "label": "Хэнтэй хамтардаг вэ?"
     },
     {
      "key": "costs",
      "label": "Мөнгө хамгийн их юунд зарцуулагддаг вэ?"
     }
    ],
    "lean-canvas": [
     {
      "key": "problem",
      "label": "Ямар асуудлыг шийддэг вэ?"
     },
     {
      "key": "customers",
      "label": "Тэр асуудал хэнд хамгийн их тулгардаг вэ?"
     },
     {
      "key": "solution",
      "label": "Хэрхэн шийддэг вэ?"
     },
     {
      "key": "value",
      "label": "Яагаад бусдыг биш, таныг сонгох вэ?"
     },
     {
      "key": "metrics",
      "label": "Ажил явж байгааг юугаар мэддэг вэ?"
     },
     {
      "key": "advantage",
      "label": "Бусад хуулж чадахгүй юу байна вэ?"
     },
     {
      "key": "channels",
      "label": "Хэрэглэгчид хэрхэн хүрдэг вэ?"
     },
     {
      "key": "revenue",
      "label": "Юугаар орлого олдог вэ?"
     },
     {
      "key": "costs",
      "label": "Гол зардал юу вэ?"
     }
    ],
    "okr": [
     {
      "key": "objectives",
      "label": "Энэ улиралд юунд хүрэхийг хүсэж байна вэ?",
      "type": "list",
      "max": 3
     },
     {
      "key": "key_results",
      "label": "Хүрснээ юугаар мэдэх вэ?",
      "type": "list",
      "per": "objective",
      "max": 3,
      "hint": "Тоо нь танай өөрийн зорилт — бид нөхөж бичихгүй."
     }
    ],
    "pmbok": [
     {
      "key": "projects",
      "label": "Одоо явж буй гол төслүүд аль вэ?",
      "type": "list",
      "max": 5
     },
     {
      "key": "phase",
      "label": "Тэд аль шатандаа явж байна вэ?",
      "type": "choice",
      "options": [
       "Эхлүүлэх",
       "Төлөвлөх",
       "Гүйцэтгэх",
       "Хянах",
       "Хаах"
      ]
     },
     {
      "key": "risks",
      "label": "Хамгийн их санаа зовоодог эрсдэл юу вэ?"
     },
     {
      "key": "stakeholders",
      "label": "Шийдвэрийг хэн гаргадаг вэ?"
     }
    ]
   }
  },
  {
   "id": "brain",
   "title": "Танай мэдлэг хаана байна?",
   "fields": [
    {
     "key": "tools",
     "label": "Өдөр бүр ямар хэрэгсэл ашигладаг вэ?",
     "type": "multi",
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
     "placeholder": "Жишээ: Өнгөрсөн сард үнийн талаар ямар шийдвэр гаргасан бэ?"
    }
   ]
  }
 ],
 "result": {
  "title": "Танай тархины ноорог бэлэн.",
  "lead": "Хариултаар зурсан Thinking State-ийг үзээд, засах зүйлээ уулзалтаар ярилцъя.",
  "preview": "CompanyView (methodology-ийн дагуу), draft",
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
   "title": "Танай ажил аль шатандаа явж байна?",
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
