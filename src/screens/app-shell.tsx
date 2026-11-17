/**
 * AppShell (2026-11-17, screens.15): the app frame on PARA + GTD (owner decision: «Апп-ыг PARA + GTD
 * бүтцээр, бизнесийн үгээр»). Seven fixed places — Inbox · Өнөөдөр · Хүлээгдэж буй (GTD) and
 * Төсөл · Хүрээ · Нөөц · Архив (PARA) — whose labels come from the company's own vocabulary
 * (web-app app-para-vocab_v01); the generic name stays under each label so the structure is
 * the same in every company. Above them «Удирдлагын тойм» (CEO daily); below, the views.
 * Figma: «Second Brain» · 00 App shell · PARA + GTD (v02).
 */
import * as React from "react";
import { motionVar } from "../motion/tokens";

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

export type AppShellView = ParaKey | "ceo" | "calendar" | "agents" | "ask";
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
  /**
   * The window (screens.20, CONTEXT v15 «нэг апп, нэг AppShell»): dots, the app title and the ⌘K
   * ask button over the menu. Default on: every app picture on the site is this one window.
   * `false` draws the bare shell for a host that has its own frame.
   */
  frame?: boolean;
  /** Title in the window bar (default «Second Brain»). */
  title?: string;
  /** ⌘K «Тархинаасаа асуу»: opens the ask view; highlighted while `active` is "ask". */
  onAsk?: () => void;
  /** More in the menu, under the views (e.g. the brain's recent chats). */
  navExtra?: React.ReactNode;
  /** Show the menu (default true). */
  nav?: boolean;
  /** Fixed body height in px (e.g. a hero window); default grows with the view, min 560. */
  height?: number;
};
export type AppShellLabels = { ceo: string; gtd: string; para: string; views: string; calendar: string; agents: string; nav: string; title: string; ask: string };
export const appShellLabelsMn: AppShellLabels = { ceo: "Удирдлагын тойм", gtd: "GTD", para: "PARA", views: "Харагдац", calendar: "Хуанли", agents: "Агентууд", nav: "Апп-ын цэс", title: "Second Brain", ask: "Тархинаасаа асуу" };

const CSS = `
.ash-win{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-page);border:1px solid color-mix(in srgb,var(--ts-line) 80%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size;display:flex;flex-direction:column;min-width:0}
.ash-win *,.ash-win *::before{box-sizing:border-box}
.ash-bar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;height:36px;padding:0 10px;border-bottom:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);background:var(--ts-soft);flex:none}
.ash-dots{display:flex;gap:5px}.ash-dots i{width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--ts-faint) 35%,transparent)}
.ash-title{font-weight:500;font-size:12px;color:var(--ts-faint);white-space:nowrap}
.ash-ask{justify-self:end;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 6px 0 10px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:var(--ts-muted);font:inherit;font-size:12px;cursor:pointer;white-space:nowrap;min-width:0}
.ash-ask kbd{font:500 10.5px/1 var(--ts-font-mono);padding:3px 5px;border-radius:4px;background:var(--ts-soft-2);color:var(--ts-muted)}
.ash-ask:hover,.ash-ask[aria-pressed="true"]{border-color:var(--ts-electric);color:var(--ts-electric-fg,var(--ts-electric))}
.ash-ask:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 2px var(--ts-electric)}
.ash *,.ash *::before{box-sizing:border-box}
.ash{font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg);background:var(--ts-page);display:grid;grid-template-columns:220px minmax(0,1fr);min-height:560px;min-width:0;flex:1}
.ash.no-nav{grid-template-columns:minmax(0,1fr)}
.ash.is-bare{border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);overflow:hidden;container-type:inline-size}
.ash.has-aside{grid-template-columns:220px minmax(0,1fr) 300px}
.ash-nav{background:var(--ts-soft);padding:14px 8px;display:flex;flex-direction:column;gap:2px;min-width:0;border-right:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);overflow:auto;scrollbar-width:none}
.ash-ws{display:flex;align-items:center;gap:10px;padding:0 8px 12px}
.ash-ws b{width:28px;height:28px;border-radius:var(--ts-radius-tile,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:13px;font-weight:600;flex:none}
.ash-ws span{display:grid;line-height:1.25;min-width:0}.ash-ws strong{font-weight:500;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ash-ws small{font-size:11px;color:var(--ts-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ash-h{font:500 10.5px/1 var(--ts-font-mono);letter-spacing:.06em;color:var(--ts-faint);margin:12px 10px 6px}
.ash-it{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 8px;width:100%;padding:6px 10px;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);background:none;color:inherit;font:inherit;text-align:left;cursor:pointer;min-height:40px}
.ash-it:hover{background:color-mix(in srgb,var(--ts-fg) 5%,transparent)}
.ash-it[aria-current="page"]{background:var(--ts-surface);border-color:var(--ts-line)}
.ash-it span{font-size:13px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-it[aria-current="page"] span{font-weight:600}
.ash-it small{grid-column:1;font-size:10.5px;color:var(--ts-faint);line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-it em{grid-row:1/span 2;grid-column:2;font-style:normal;font-size:11px;color:var(--ts-faint);font-variant-numeric:tabular-nums}
.ash-it[aria-current="page"] em{color:var(--ts-muted)}
.ash-it.is-ceo span{font-weight:600}.ash-it.is-ceo em{color:var(--ts-muted);font:500 10px/1 var(--ts-font-mono)}
.ash-it:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-soft),0 0 0 2px var(--ts-electric)}
.ash-extra{margin-top:8px;min-width:0}
.ash-main{min-width:0;min-height:0;padding:24px 28px;overflow:auto}
.ash-view{animation:ash-view-in ${motionVar.duration("md")} ${motionVar.easing("enter")} both}
@keyframes ash-view-in{from{opacity:0;transform:translateY(6px)}}
@media (prefers-reduced-motion:reduce){.ash-view{animation:none}}
.ash-aside{border-left:1px solid var(--ts-line);background:var(--ts-surface);padding:20px;min-width:0}
@container (max-width:1100px){.ash.has-aside{grid-template-columns:200px minmax(0,1fr)}.ash-aside{grid-column:2;border-left:0;border-top:1px solid var(--ts-line)}}
@container (max-width:860px){.ash,.ash.has-aside{grid-template-columns:168px minmax(0,1fr)}.ash.no-nav{grid-template-columns:minmax(0,1fr)}.ash-it small{display:none}.ash-it{min-height:34px}.ash-main{padding:18px 20px}}
@container (max-width:600px){.ash,.ash.has-aside{grid-template-columns:minmax(0,1fr)}.ash-aside{grid-column:1}
.ash-nav{flex-direction:row;overflow-x:auto;gap:4px;padding:8px;border-right:0;border-bottom:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent)}
.ash-ws,.ash-h,.ash-it small,.ash-extra{display:none}.ash-it{width:auto;flex:none;min-height:36px}
.ash-main{padding:14px}.ash-title{display:none}.ash-bar{grid-template-columns:auto 1fr}}
`;

export function AppShell({ company, vocab, counts = {}, active = "ceo", onNavigate, aside, children, labels: labelsIn, className = "", frame = true, title, onAsk, navExtra, nav = true, height }: AppShellProps) {
  const L = { ...appShellLabelsMn, ...labelsIn };
  const [own, setOwn] = React.useState<AppShellView>(active);
  React.useEffect(() => setOwn(active), [active]);
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
  const shell = (
    <div className={`ash ${aside ? "has-aside" : ""} ${nav ? "" : "no-nav"} ${frame ? "" : `is-bare ${className}`}`} style={height ? { height, minHeight: 0 } : undefined}>
      <style>{CSS}</style>
      {nav && (
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
          {navExtra && <div className="ash-extra">{navExtra}</div>}
        </nav>
      )}
      <main className="ash-main"><div className="ash-view" key={current}>{children}</div></main>
      {aside && <aside className="ash-aside">{aside}</aside>}
    </div>
  );
  if (!frame) return shell;
  return (
    <div className={`ash-win ${className}`}>
      <div className="ash-bar">
        <div className="ash-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="ash-title">{title ?? L.title}</span>
        <button type="button" className="ash-ask" aria-pressed={current === "ask"} onClick={() => (onAsk ? onAsk() : go("ask"))}>{L.ask}<kbd>⌘K</kbd></button>
      </div>
      {shell}
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
