// Post: «Gen AI: тэгээс оргил хүртэл» — 12 слайдтай carousel (IG Dfi8JnfmM3G-ийн inspired remake).
// Бүх слайд Component Library-ийн explainer-carousel компонентоор угсрагдана. ?s=1..12 нэг слайд, ?static=1 хөдөлгөөнгүй.
import { createRoot } from "react-dom/client";
import {
  ExplainerSlide,
  StairCover,
  RulesSheet,
  TokenChips,
  Scatter,
  ScoreBars,
  BudgetStack,
  Sequence,
  HubSpoke,
  ChunkCards,
  LoopRing,
  PassFailGrid,
  Venn3,
} from "../src/library/explainer-carousel";

const H = "@studio";
const T = 12;
const k = (n: number, m: number) => `АЛХАМ ${n} / 10 · МОДУЛЬ ${m}`;

const rules = [
  { name: "Токен", rule: "Эхлээд өөрийн хэлний токеныг тоол." },
  { name: "Вектор", rule: "Embedding олно. Cross-encoder эрэмбэлнэ." },
  { name: "Дараагийн токен", rule: "Шийдвэрт бага температур ашигла." },
  { name: "Контекст цонх", rule: "Цонх бол төсөв, хувин биш." },
  { name: "Хэрэгсэл дуудах", rule: "Хэрэгслийн тайлбар өөрөө заавар." },
  { name: "MCP", rule: "Нийтийн серверийг итгэлгүй код гэж үз." },
  { name: "RAG", rule: "Хэсэг бүрт контекстыг нь өг." },
  { name: "Агент", rule: "Цөөн алхам сайн алхмаас илүү." },
  { name: "Үнэлгээ", rule: "Түүхий тохирол биш, kappa-г тайлагна." },
  { name: "Аюулгүй байдал", rule: "Гурвуулаа байвал хүний баталгаа нэм." },
];
const R = (i: number) => ({ label: "Дүрэм:", text: rules[i].rule });

const cells = Array.from({ length: 40 }, (_, i) => ([5, 11, 18, 25, 33, 38].includes(i) ? "f" : "p") as "p" | "f");

const theme = (new URLSearchParams(location.search).get("theme") ?? "dark") as "dark" | "editorial";
const F = "GEN AI · ТЭГЭЭС ОРГИЛД · 2026.11";
const slides = [
  <StairCover
    page={`1/${T}`}
    kicker="10 АЛХАМ · 10 ДҮРЭМ · БОДИТ ТОО"
    title={["Gen AI:", "тэгээс оргилд"]}
    sub={
      <>
        AI-г <b>хэрэглэх</b>, AI-аар <b>бүтээх</b> хоёрын хоорондох 10 санаа.
      </>
    }
    steps={rules.map((r) => r.name)}
    top="ОРГИЛ"
    bottom="ТЭГ"
    cta="Гүйлгээд өгс"
    note="10 дүрэм бүгд сүүлийн слайдад. Хадгалаад ав."
    handle={H} theme={theme} folio={F}
  />,
  <ExplainerSlide
    n={1} title="Токен" page={2} total={T} kicker={k(1, 1)} handle={H} theme={theme} folio={F}
    lede="Загвар таны үгийг уншдаггүй. Токен гэх дугаарласан хэсгүүдийг уншдаг."
    figure={
      <TokenChips
        sentence="The policy holder must submit the claim form within thirty days of the incident."
        hint="токен болгон хуваасан, тус бүр өөрийн дугаартай"
        rows={[
          [
            { t: "The", id: 976 }, { t: "policy", id: 7562 }, { t: "holder", id: 17632 }, { t: "must", id: 2884 },
            { t: "submit", id: 14114 }, { t: "the", id: 290, hl: true }, { t: "claim", id: 6445 },
          ],
          [
            { t: "form", id: 1625 }, { t: "within", id: 3518 }, { t: "thirty", id: 37658 }, { t: "days", id: 3376 },
            { t: "of", id: 328 }, { t: "the", id: 290, hl: true }, { t: "incident", id: 28934 }, { t: ".", id: 13 },
          ],
        ]}
        total="15 токен"
        note="«the» хоёр удаа: ижил хэсэг, ижил дугаар (290)"
        barsTitle="ижил утга 3 хэлээр, шаардсан токен (o200k)"
        bars={[{ label: "Англи", value: 15 }, { label: "Хинди", value: 20 }, { label: "Малаялам", value: 27 }]}
      />
    }
    points={[
      "Бичвэрийг үг, үгийн хэсэг, цэг тэмдгээр хэрчинэ.",
      "Хэсэг бүр дугаартай. Ижил хэсэг, ижил дугаар.",
      "Зардал, хурд, контекстын хязгаар бүгд токеноор тоологдоно.",
    ]}
    rule={R(0)}
    next="Тэгвэл эдгээр токен юу болж хувирдаг вэ?"
  />,
  <ExplainerSlide
    n={2} title="Вектор (embedding)" page={3} total={T} kicker={k(2, 1)} handle={H} theme={theme} folio={F}
    lede="Embedding бичвэрийг тоо болгоно: утгын орон зай дахь нэг цэг. Ойролцоо утга ойрхон байрлана."
    figure={
      <Scatter
        question="Жирэмсний хамгаалалт хэзээнээс эхлэх вэ?"
        you="таны асуулт"
        points={[
          { label: "хэсэг a", score: "0.459", note: "эхэлснээс 36 сар", x: 44, y: 10 },
          { label: "хэсэг b", score: "0.603", note: "тасралтгүй 24 сарын хамгаалалт", x: 42, y: 46, near: true },
          { label: "хэсэг c", score: "0.365", note: "хураамж төлөх өдрөөс 30 хоног", x: 46, y: 78 },
        ]}
        foot="ойр = илүү төстэй утга"
      />
    }
    points={[
      "Загвар бичвэрийг вектор буюу тооны жагсаалт болгоно.",
      "Косинус төстэй байдал хоёр векторын өнцгийг хэмжинэ.",
      "Өнцөг бага байх тусам утга ойр, оноо өндөр.",
    ]}
    rule={R(1)}
    next="Тэгвэл дараагийн үгийг яаж сонгодог вэ?"
  />,
  <ExplainerSlide
    n={3} title="Дараагийн токен" page={4} total={T} kicker={k(3, 1)} handle={H} theme={theme} folio={F}
    lede="Хэлний загвар ганцхан зүйл хийнэ: дараагийн токеныг таана. Сонголтуудад оноо өгч, нэгийг сонгоод давтана."
    figure={
      <ScoreBars
        head="Нэхэмжлэлийг ___"
        options={[
          { label: "баталсан", value: 0.49 },
          { label: "татгалзсан", value: 0.34 },
          { label: "шийдсэн", value: 0.11 },
          { label: "хүлээгдэж буй", value: 0.06 },
        ]}
        foot="температур магадлалыг өөрчилнө"
        verdict="температур 0.2: нэг тод ялагч"
        sub="шийдвэрт бага температур, ноорогт өндөр"
      />
    }
    points={[
      "Боломжит дараагийн токен бүрт оноо өгнө.",
      "Оноо магадлал болж, нэг токен сонгогдоно.",
      "Сонгосон нь бичвэрт нэмэгдэж, давталт үргэлжилнэ.",
    ]}
    rule={R(2)}
    next="Тэгвэл нэг дор хэр ихийг харж чаддаг вэ?"
  />,
  <ExplainerSlide
    n={4} title="Контекст цонх" page={5} total={T} kicker={k(4, 3)} handle={H} theme={theme} folio={F}
    lede="Контекст цонх бол загварын нэг дор харж чадах бүх зүйл. Багтаагүй нь байхгүйтэй адил."
    figure={
      <BudgetStack
        ghost="Хуучин чатын түүх · багтсангүй"
        head="контекст цонх · 4,850 токен"
        parts={[
          { label: "Системийн заавар", tokens: 1200 },
          { label: "Чатын түүх", tokens: 800 },
          { label: "Олдсон баримт", tokens: 2500, hot: true },
          { label: "Хариулт", tokens: 350 },
        ]}
        warn={["Олдсон баримт цонхны 52%-ийг эзэлж байна.", "Багтаагүйг загвар хэзээ ч харахгүй."]}
      />
    }
    points={[
      "Заавар, түүх, баримт, хариулт нэг цонхыг хуваана.",
      "Токеноор хэмжинэ, бүгдэд нь төлнө.",
      "Хэсэг бүрийн төсвийг урьдчилан тогтоож, кодоор барь.",
    ]}
    rule={R(3)}
    next="Одоо загвар яаж үйлдэл хийдэг вэ?"
  />,
  <ExplainerSlide
    n={5} title="Хэрэгсэл дуудах" page={6} total={T} kicker={k(5, 2)} handle={H} theme={theme} folio={F}
    lede="Загвар өөрөө үйлдэл хийж чадахгүй. Хэрэгслийн хүсэлт бичнэ, таны код ажиллуулна, үр дүн буцаж орно."
    figure={
      <Sequence
        lanes={["Та", "Загвар", "Таны код"]}
        steps={[
          { from: 0, text: "«POL-448210 хүчинтэй юу?»" },
          { from: 1, text: 'lookup_policy("POL-448210")', code: true },
          { from: 2, text: "хайлтыг ажиллуулна" },
          { from: 2, text: "status: lapsed, 2026-03-14", code: true },
          { from: 1, text: "«Тэр гэрээ 2026-03-14-нд хүчингүй болсон.»" },
        ]}
        foot={["Загвар юу ч ажиллуулдаггүй.", "Хүсэлтийг бичнэ. Таны код ажиллуулна."]}
      />
    }
    points={[
      "Хэрэгсэл бүрийг тайлбарла: нэр, зорилго, оролт.",
      "Загвар бичвэрийн оронд хэрэгслийн хүсэлтээр хариулна.",
      "Таны код ажиллуулна. Загвар үр дүнг уншаад хариулна.",
    ]}
    rule={R(4)}
    next="Тэгвэл хэрэгсэл олон болбол яах вэ?"
  />,
  <ExplainerSlide
    n={6} title="MCP" page={7} total={T} kicker={k(6, 7)} handle={H} theme={theme} folio={F}
    lede="MCP бол агент ба хэрэгслийн хоорондох стандарт залгуур. Хэрэгслээ нэг удаа бүтээхэд MCP-тэй ямар ч агент ашиглана."
    figure={
      <HubSpoke
        left={["Таны агент", "Чат апп", "IDE туслах"]}
        right={["Нэхэмжлэлийн сан", "Гэрээний баримт", "Имэйл"]}
        hub="MCP"
        head="нэг стандарт залгуур: 3 + 3 холболт"
        sub="хэрэгслээ нэг удаа бүтээ, MCP-тэй апп бүр ашиглана"
        listTitle="нэг MCP сервер юу нээдэг"
        list={[
          { tag: "ХЭРЭГСЭЛ", value: "lookup_claim" },
          { tag: "НӨӨЦ", value: "policy://plan/clause-14b" },
          { tag: "ЗААВАР", value: "explain_rejection" },
        ]}
      />
    }
    points={[
      "Сервер хэрэгсэл, нөөц, зааврыг нээнэ.",
      "Ямар ч агент түүнд ижил аргаар холбогдоно.",
      "Хэрэгсэл бүрийн эрхийг хязгаарла, бүгдийг бүү нээ.",
    ]}
    rule={R(5)}
    next="Тэгвэл баримтууд чинь хаанаас ирэх вэ?"
  />,
  <ExplainerSlide
    n={7} title="RAG" page={8} total={T} kicker={k(7, 5)} handle={H} theme={theme} folio={F}
    lede="Загвар таны баримтыг хэзээ ч хараагүй. RAG асуулт ирэхэд зөв хуудсыг олж, загварт хуулж өгнө."
    figure={
      <ChunkCards
        question="Жирэмсний хамгаалалт хэзээнээс эхлэх вэ?"
        chunks={[
          { name: "хэсэг a", text: "Хүлээх хугацаа нь эхэлснээс 36 сар.", score: 0.459 },
          { name: "хэсэг b", text: "Хүлээх хугацаа нь тасралтгүй 24 сарын хамгаалалт.", score: 0.603, best: true },
          { name: "хэсэг c", text: "Хугацаа нь хураамж төлөх өдрөөс 30 хоног.", score: 0.365 },
        ]}
        simLabel="асуулттай төстэй байдал"
        prompt={[
          { tag: "асуулт", text: "Жирэмсний хамгаалалт хэзээнээс эхлэх вэ?" },
          { tag: "хэсэг b", text: "тасралтгүй 24 сарын хамгаалалт" },
          { tag: "хэсэг a", text: "эхэлснээс 36 сар" },
        ]}
        answer="Тасралтгүй 24 сарын хамгаалалт."
        answerNote="хариултыг хэсэг b-ээс бүтээв"
      />
    }
    points={[
      "Баримтыг хэсэгчил. Хэсэг бүрийг нэг удаа вектор болго.",
      "Асуултыг вектор болгож, хамгийн ойр хэсгүүдийг ав.",
      "Тэдгээрийг заавартаа хийнэ. Загвар тэднээс хариулна.",
    ]}
    rule={R(6)}
    next="Одоо бүгдийг нэг давталтад оруулъя."
  />,
  <ExplainerSlide
    n={8} title="Агент" page={9} total={T} kicker={k(8, 6)} handle={H} theme={theme} folio={F}
    lede="Агент бол давталт дахь загвар: шийд, хэрэгслээр үйлдэл хий, үр дүнг унш, дуустал давт."
    figure={
      <LoopRing
        nodes={["Шийдэх", "Ажиглах", "Үйлдэх"]}
        center="алхам 5"
        caption="алхам бүр 95% ажилладаг"
        dots={20}
        ends={["алхам 1", "алхам 20"]}
        big="35.85%"
        bigLabel="20 алхамт ажил дуусах магадлал"
        foot="0.95-ыг 20 удаа үржүүлэв: алхам бүр алдах дахин нэг боломж"
      />
    }
    points={[
      "Загвар үйлдлээ сонгоно, эсвэл дууссан бол хариулна.",
      "Таны код хэрэгслийг ажиллуулж, үр дүнг буцааж өгнө.",
      "Алхмын хязгаар төгсгөлгүй давталтыг зогсооно.",
    ]}
    rule={R(7)}
    next="Тэгвэл алхам ажилласныг яаж мэдэх вэ?"
  />,
  <ExplainerSlide
    n={9} title="Үнэлгээ (eval)" page={10} total={T} kicker={k(9, 8)} handle={H} theme={theme} folio={F}
    lede="Үнэлгээ бол AI-ийн тест. Хариу нь мэдэгдэж буй асуултаар системээ ажиллуулж, үр дүн бүрийг дүгнэнэ."
    figure={
      <PassFailGrid
        title="Хүний дүгнэсэн 40 хариулт"
        cells={cells}
        stats={[
          { label: "жинхэнэ шүүгч", value: "", head: true },
          { label: "тохирол", value: "0.90" },
          { label: "kappa", value: "+0.61" },
          { label: "барьсан", value: "6-аас 4" },
        ]}
        legend={["34 тэнцсэн", "6 унасан"]}
        foot="kappa санамсаргүй тохирлыг хасна"
      />
    }
    points={[
      "Бодит асуулт цуглуулж, сайн хариулт гэж юу болохыг тогтоо.",
      "Хүн эсвэл шүүгч загвар хариулт бүрийг тэнцсэн, унасан гэж тэмдэглэнэ.",
      "Шүүгчийг хүнтэй тохирлоор биш, kappa-аар шалга.",
    ]}
    rule={R(8)}
    next="Тэгвэл оролт өөрөө хортой байвал яах вэ?"
  />,
  <ExplainerSlide
    n={10} title="Аюулгүй байдал" page={11} total={T} kicker={k(10, 9)} handle={H} theme={theme} folio={F}
    lede="Хувийн өгөгдөлтэй, итгэлгүй контент уншдаг, өгөгдөл гадагш илгээж чаддаг AI аппыг булаан авч болно."
    figure={<Venn3 title="халдагчид юу хэрэгтэй" labels={["Хувийн өгөгдөл", "Итгэлгүй контент", "Гадагш гарц"]} />}
    points={[
      "Хувийн өгөгдөл: халдагчийн харах ёсгүй бүх зүйл.",
      "Итгэлгүй контент: халдагчийн бичиж чадах бүх зүйл.",
      "Гадагш холбоо: өгөгдөл илгээх ямар ч зам.",
    ]}
    rule={{ label: "Дүрэм:", text: "Гурвуулаа байна уу? Хүний баталгаа нэм." }}
    next="Бүх алхам дууслаа. Одоо дүрмүүд"
  />,
  <RulesSheet title="10 дүрэм, нэг хуудсанд" page={`12/${T}`} rules={rules} cta="Хадгалаад дараагийн бүтээлдээ ашигла." handle={H} theme={theme} folio={F} />,
];

const q = new URLSearchParams(location.search);
const s = Number(q.get("s") || 0);
if (q.get("static")) document.body.classList.add("xc-static");
createRoot(document.getElementById("root")!).render(
  s ? slides[s - 1] : <div style={{ display: "grid", gap: 40, padding: 40 }}>{slides}</div>,
);
