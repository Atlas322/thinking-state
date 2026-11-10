// Post: «Metacognition — AI-ийн үеийн гол чадвар» — 9 слайдтай IG motion carousel (1080×1350, editorial).
// Эх: vault 04-Resources/references/Metacognition - AI-ийн үеийн гол чадвар (Aalto, MIT, Nord Anglia судалгаа).md
// Бүх слайд Component Library-ийн explainer-carousel-оор. ?s=1..9 нэг слайд, ?static=1 хөдөлгөөнгүй.
import { createRoot } from "react-dom/client";
import {
  ExplainerSlide,
  StatementSlide,
  StatRows,
  Divergence,
  Ledger,
  FigureCard,
} from "../src/library/explainer-carousel";

const H = "@studio";
const T = 9;
const F = "METACOGNITION · №012 · 2026.11";
const base = { handle: H, theme: "editorial" as const, folio: F, format: "4x5" as const, total: T, steps: 6 };

const slides = [
  <StatementSlide
    {...base}
    page={`01 / ${T}`}
    kicker="AI-ИЙН ҮЕИЙН ГОЛ ЧАДВАР"
    title={["AI таныг ухаалаг болгож байна.", "Харин мэргэн биш."]}
    dim="ГҮЙЦЭТГЭЛ ↑ · ӨӨРИЙГӨӨ ҮНЭЛЭХ ↓"
    sub={
      <>
        Гурван судалгаа нэг зүйлийг сануулж байна: бодох ажлыг AI-д өгөх тусам <b>өөрийгөө шалгах</b> чадвар сулардаг.
      </>
    }
    cta="Гүйлгээд үз"
    note="Сүүлд нь өдөр бүрийн 3 мөрийн дадал."
  />,
  <ExplainerSlide
    {...base}
    n={1}
    page={2}
    title="Metacognition гэж юу вэ"
    kicker="ТОДОРХОЙЛОЛТ"
    lede="Өөрийгөө ажиглаж шалгах чадвар. AI бодох ажлыг хийх тусам хүнд үлдэх гол чадвар энэ."
    figure={
      <Ledger
        rows={[
          { k: "?", text: "Би үнэхээр ойлгосон уу?" },
          { k: "?", text: "Энэ хариу зөв үү?" },
        ]}
        foot="өөрөөсөө асуух хоёр асуулт"
      />
    }
    points={["Гэвч AI ашиглах үед яг энэ чадвар хамгийн их суларч байна."]}
    next="Үүнийг хэрхэн хэмжсэн бэ?"
  />,
  <ExplainerSlide
    {...base}
    n={2}
    page={3}
    title="Aalto: оноо өсөв"
    kicker="AALTO · 2025 · N = 452"
    lede="~500 хүн LSAT-ийн логикийн даалгавар хийв. Тал нь ChatGPT-4o-той ажилласан."
    figure={
      <Divergence
        up="гүйцэтгэл"
        down="өөрийгөө үнэлэх нь"
        from="AI-гүй"
        to="AI-тай"
        foot="бүдүүвч · тоон утга биш"
      />
    }
    points={["AI-тай хүмүүсийн оноо өссөн.", "Гэвч өөрийгөө хэт өндөр үнэлсэн."]}
    rule={{ label: "Эх:", text: "Fernandes, Welsch нар · Computers in Human Behavior" }}
  />,
  <ExplainerSlide
    {...base}
    n={3}
    page={4}
    title="Бүгд буруу дүгнэв"
    kicker="AALTO · 2025"
    lede="AI-тай ажиллахад Даннинг–Крюгерийн эффект алга болж, бүгд өөрийгөө буруу дүгнэв."
    figure={
      <FigureCard>
        <p className="xc-small">хамгийн хэт итгэлтэй нь</p>
        <p className="xc-big">AI-ийн мэдлэг өндөр хүмүүс</p>
        <p className="xc-mid orange">ганц prompt → хариуг шууд авсан</p>
      </FigureCard>
    }
    points={["AI-ийн мэдлэг өндөр хүмүүс бүр илүү хэт итгэлтэй байв.", "Ихэнх нь ганц prompt өгөөд хариуг шууд авсан."]}
    next="Тархинд юу болдог вэ?"
  />,
  <ExplainerSlide
    {...base}
    n={4}
    page={5}
    title="MIT: тархины оролцоо"
    kicker="MIT MEDIA LAB · 2025 · EEG"
    lede="Хүмүүс эссэ бичихэд тархины идэвхийг EEG-ээр хэмжсэн."
    figure={
      <StatRows
        rows={[
          { value: 54, label: "хүн оролцсон" },
          { value: 32, label: "тархины бүсийг хэмжсэн", hot: true },
        ]}
        foot="Your Brain on ChatGPT"
      />
    }
    points={["ChatGPT-ийн бүлгийн тархины оролцоо хамгийн бага.", "Давтахад үр дүн муудсан."]}
    rule={{ label: "Анхаар:", text: "Түүвэр жижиг, peer review-гүй, Microsoft хэсэгчлэн санхүүжүүлсэн." }}
  />,
  <ExplainerSlide
    {...base}
    n={5}
    page={6}
    title="Өдөр бүрийн дадал"
    kicker="NORD ANGLIA × BOSTON COLLEGE · 2026"
    lede="20 улсын 29 сургууль, 12 000+ сурагч, 5 000 багш өдөр бүр «сэтгэлгээний дадал» хийв."
    figure={
      <StatRows
        rows={[
          { value: 72, prefix: "+", suffix: "%", label: "хамтын ажиллагаа", bar: true, hot: true },
          { value: 70, prefix: "+", suffix: "%", label: "сониуч зан", bar: true },
          { value: 69, prefix: "+", suffix: "%", label: "бүтээлч байдал", bar: true },
          { value: 68, prefix: "+", suffix: "%", label: "шүүмжлэлт сэтгэлгээ", bar: true },
        ]}
        foot="багшийн өөрийн үнэлгээ"
      />
    }
    rule={{ label: "Анхаар:", text: "Багш өөрөө үнэлсэн, сүлжээ өөрөө санхүүжүүлсэн." }}
  />,
  <StatementSlide
    {...base}
    page={`07 / ${T}`}
    kicker="ШУДАРГААР ХЭЛЭХЭД"
    title={["Хүчтэй таамаглал.", "Нотолгоо биш."]}
    items={[
      { mark: "01", text: "«Хамгийн чухал чадвар» гэдгийг нотолсон бие даасан, хянан магадлагдсан судалгаа хараахан алга." },
      { mark: "02", text: "MIT: түүвэр жижиг, peer review-гүй." },
      { mark: "03", text: "Nord Anglia: багшийн өөрийн үнэлгээ, өөрөө санхүүжүүлсэн." },
      { mark: "04", text: "Оюутнууд metacognition-ийг ганц өснө гэж үзсэн. Энэ бол хүлээлт, хэмжилт биш." },
    ]}
  />,
  <ExplainerSlide
    {...base}
    n={6}
    page={8}
    title="3 мөрийн дадал"
    kicker="AI-ТАЙ АЖИЛЛАСАН БҮРТ"
    lede="Нэг prompt-оор зогсохгүй. Олон удаа асууж, хариугаа шалга. Үүнийг 3 мөрөөр бич."
    figure={
      <Ledger
        rows={[
          { k: "01", text: "Би юу гэж бодсон?" },
          { k: "02", text: "AI юу гэв?" },
          { k: "03", text: "Би юуг шалгав?" },
        ]}
        foot="хариугаа шууд авахаас өмнө"
      />
    }
    rule={{ label: "Арга:", text: "Хариуг шууд биш, шалгаад ав." }}
  />,
  <StatementSlide
    {...base}
    page={`09 / ${T}`}
    kicker="ХАДГАЛААД АВ"
    title={["AI бодно.", "Шалгах нь таны ажил."]}
    dim="ЮУ ГЭЖ БОДСОН · AI ЮУ ГЭВ · БИ ЮУГ ШАЛГАВ"
    sub="Дараагийн удаа AI-тай ажиллахдаа энэ 3 мөрийг бич. Хэн нэгэнд хэрэгтэй бол хуваалц."
    cta="Хадгал"
    note="Эх сурвалж caption-д."
  />,
];

const q = new URLSearchParams(location.search);
const s = Number(q.get("s") || 0);
if (q.get("static")) document.body.classList.add("xc-static");
createRoot(document.getElementById("root")!).render(
  s ? slides[s - 1] : <div style={{ display: "grid", gap: 40, padding: 40 }}>{slides}</div>,
);
