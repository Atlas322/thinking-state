/**
 * AppShell (2026-11-17, screens.15): the app frame on PARA + GTD (owner decision: «Апп-ыг PARA + GTD
 * бүтцээр, бизнесийн үгээр»). Seven fixed places — Inbox · Өнөөдөр · Хүлээгдэж буй (GTD) and
 * Төсөл · Хүрээ · Нөөц · Архив (PARA) — whose labels come from the company's own vocabulary
 * (web-app app-para-vocab_v01); the generic name stays under each label so the structure is
 * the same in every company. Above them «Удирдлагын тойм» (CEO daily); below, the views.
 * Figma: «Second Brain» · 00 App shell · PARA + GTD (v02).
 */
import * as React from "react";

export type ParaKey = "inbox" | "today" | "waiting" | "projects" | "areas" | "resources" | "archive";
export type ParaVocab = Record<ParaKey, { label: string; line?: string }>;
export const PARA_KEYS: ParaKey[] = ["inbox", "today", "waiting", "projects", "areas", "resources", "archive"];

/** The generic names (app-para-vocab_v01 `base`). */
export const paraBaseMn: ParaVocab = {
  inbox: { label: "Inbox", line: "Ирсэн бүхэн нэг хаалгаар орж ангилагдана" },
  today: { label: "Өнөөдөр", line: "Өнөөдөр хийх дараагийн алхмууд" },
  waiting: { label: "Хүлээгдэж буй", line: "Хэн нэгний хариу, батламж хүлээж буй ажил" },
  projects: { label: "Төсөл", line: "Дуусах хугацаатай ажил" },
  areas: { label: "Хүрээ", line: "Тогтмол хариуцдаг чиглэл" },
  resources: { label: "Нөөц", line: "Дахин ашиглах материал" },
  archive: { label: "Архив", line: "Дууссан, хадгалах зүйл" },
};

export type AppShellView = ParaKey | "ceo" | "calendar" | "agents";
export type AppShellProps = {
  company: { name: string; note?: string; initial?: string };
  /** The company's words for the seven places; missing keys fall back to the generic name. */
  vocab?: Partial<ParaVocab>;
  counts?: Partial<Record<ParaKey, number>>;
  active?: AppShellView;
  onNavigate?: (view: AppShellView) => void;
  /** Right column (e.g. a meeting overview or «Хүний ээлж»). */
  aside?: React.ReactNode;
  children?: React.ReactNode;
  labels?: Partial<AppShellLabels>;
  className?: string;
};
export type AppShellLabels = { ceo: string; gtd: string; para: string; views: string; calendar: string; agents: string; nav: string };
export const appShellLabelsMn: AppShellLabels = { ceo: "Удирдлагын тойм", gtd: "GTD", para: "PARA", views: "Харагдац", calendar: "Хуанли", agents: "Агентууд", nav: "Апп-ын цэс" };

const CSS = `
.ash *,.ash *::before{box-sizing:border-box}
.ash{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-page);display:grid;grid-template-columns:232px minmax(0,1fr);min-height:640px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);overflow:hidden}
.ash.has-aside{grid-template-columns:232px minmax(0,1fr) 300px}
.ash-nav{background:var(--ts-soft);padding:16px 8px;display:flex;flex-direction:column;gap:2px;min-width:0}
.ash-ws{display:flex;align-items:center;gap:10px;padding:0 8px 14px}
.ash-ws b{width:28px;height:28px;border-radius:var(--ts-radius-tile,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:13px;font-weight:600;flex:none}
.ash-ws span{display:grid;line-height:1.25;min-width:0}.ash-ws strong{font-weight:500;font-size:14px}.ash-ws small{font-size:11px;color:var(--ts-faint)}
.ash-h{font:500 10.5px/1 var(--ts-font-mono);letter-spacing:.06em;color:var(--ts-faint);margin:12px 10px 6px}
.ash-it{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 8px;width:100%;padding:6px 10px;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);background:none;text-align:left;cursor:pointer;min-height:40px}
.ash-it:hover{background:color-mix(in srgb,var(--ts-fg) 5%,transparent)}
.ash-it[aria-current="page"]{background:var(--ts-surface);border-color:var(--ts-line)}
.ash-it span{font-size:13px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-it[aria-current="page"] span{font-weight:600}
.ash-it small{grid-column:1;font-size:10.5px;color:var(--ts-faint);line-height:1.2}
.ash-it em{grid-row:1/span 2;grid-column:2;font-style:normal;font-size:11px;color:var(--ts-faint);font-variant-numeric:tabular-nums}
.ash-it.is-ceo span{font-weight:600}.ash-it.is-ceo em{color:var(--ts-electric-fg);font:500 10px/1 var(--ts-font-mono)}
.ash-it:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-soft),0 0 0 2px var(--ts-electric)}
.ash-main{min-width:0;padding:24px 28px}
.ash-aside{border-left:1px solid var(--ts-line);background:var(--ts-surface);padding:20px;min-width:0}
@media (max-width:1100px){.ash.has-aside{grid-template-columns:232px minmax(0,1fr)}.ash-aside{grid-column:1/-1;border-left:0;border-top:1px solid var(--ts-line)}}
@media (max-width:720px){.ash,.ash.has-aside{grid-template-columns:minmax(0,1fr)}
.ash-nav{flex-direction:row;overflow-x:auto;gap:4px;padding:10px;scrollbar-width:none}
.ash-ws,.ash-h,.ash-it small{display:none}.ash-it{width:auto;flex:none;min-height:36px}
.ash-main{padding:16px}}
`;

export function AppShell({ company, vocab, counts = {}, active = "ceo", onNavigate, aside, children, labels: labelsIn, className = "" }: AppShellProps) {
  const L = { ...appShellLabelsMn, ...labelsIn };
  const [own, setOwn] = React.useState<AppShellView>(active);
  const current = onNavigate ? active : own;
  const go = (v: AppShellView) => (onNavigate ? onNavigate(v) : setOwn(v));
  const word = (k: ParaKey) => ({ ...paraBaseMn[k], ...vocab?.[k] });
  const item = (v: AppShellView, label: string, base?: string, count?: number, cls = "") => (
    <button key={v} type="button" className={`ash-it ${cls}`} aria-current={current === v ? "page" : undefined} onClick={() => go(v)} title={base && base !== label ? `${label} · ${base}` : label}>
      <span>{label}</span>
      {base && base !== label && <small>{base}</small>}
      {count ? <em aria-label={`${count} зүйл`}>{count}</em> : cls === "is-ceo" ? <em>CEO</em> : null}
    </button>
  );
  return (
    <div className={`ash ${aside ? "has-aside" : ""} ${className}`}>
      <style>{CSS}</style>
      <nav className="ash-nav" aria-label={L.nav}>
        <div className="ash-ws"><b aria-hidden="true">{company.initial ?? company.name.replace(/^ac\.me\s*/i, "").slice(0, 1).toUpperCase()}</b><span><strong>{company.name}</strong>{company.note && <small>{company.note}</small>}</span></div>
        {item("ceo", L.ceo, undefined, undefined, "is-ceo")}
        <p className="ash-h">{L.gtd}</p>
        {(["inbox", "today", "waiting"] as ParaKey[]).map((k) => item(k, word(k).label, paraBaseMn[k].label, counts[k]))}
        <p className="ash-h">{L.para}</p>
        {(["projects", "areas", "resources", "archive"] as ParaKey[]).map((k) => item(k, word(k).label, paraBaseMn[k].label, counts[k]))}
        <p className="ash-h">{L.views}</p>
        {item("calendar", L.calendar)}
        {item("agents", L.agents)}
      </nav>
      <main className="ash-main">{children}</main>
      {aside && <aside className="ash-aside">{aside}</aside>}
    </div>
  );
}

/** ac.me vocabularies from web-app app-para-vocab_v01 (marketing team, logistics company). */
export const acmeParaVocab: Record<"marketing" | "logistics", ParaVocab> = {
  marketing: {
    inbox: { label: "Бриф, санаа", line: "Ирсэн бриф, контентын санаа, comment" },
    today: { label: "Өнөөдрийн пост", line: "Өнөөдөр нийтлэх, хариулах зүйл" },
    waiting: { label: "Батламж хүлээж", line: "Брэнд, хууль, харилцагчийн батламж" },
    projects: { label: "Кампанит ажил", line: "Хугацаатай кампанит ажил, influencer гэрээ" },
    areas: { label: "Брэнд ба суваг", line: "Брэнд, social суваг, CRM" },
    resources: { label: "Контентын сан", line: "Судалгаа, загвар, зураг, өмнөх пост" },
    archive: { label: "Дууссан кампанит ажил", line: "Хаагдсан кампанит ажил, гэрээ" },
  },
  logistics: {
    inbox: { label: "Ачааны хүсэлт", line: "Охин компани, гадны харилцагчаас ирсэн тээврийн захиалга" },
    today: { label: "Өнөөдрийн ачилт", line: "Өнөөдөр гарах вагон, машин, жолооч" },
    waiting: { label: "Гааль, хил дээр", line: "Зөвшөөрөл, бичиг баримт хүлээж буй ачаа" },
    projects: { label: "Маршрут, гэрээ", line: "Шинэ маршрут нээх, тарифын гэрээ" },
    areas: { label: "Парк ба агуулах", line: "Төмөр зам, авто парк, агуулахын тогтмол хариуцлага" },
    resources: { label: "Тариф, журам", line: "Тарифын хүснэгт, аюулгүй байдлын журам" },
    archive: { label: "Хүргэгдсэн ачаа", line: "Хаагдсан тээвэр, баримт" },
  },
};

/** ac.me demo shells (moved here in screens.18 so the app-shell entry carries its own demo). */
export const appShellDemo: Omit<AppShellProps, "children"> = {
  company: { name: "ac.me Маркетинг", note: "Маркетингийн баг" },
  vocab: acmeParaVocab.marketing,
  counts: { inbox: 7, waiting: 3 },
  active: "ceo",
};
export const appShellLogisticsDemo: Omit<AppShellProps, "children"> = {
  company: { name: "ac.me Логистик", note: "Логистикийн компани" },
  vocab: acmeParaVocab.logistics,
  counts: { inbox: 9, waiting: 4 },
  active: "ceo",
};

export default AppShell;
