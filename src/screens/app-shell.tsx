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

/** Lucide paths (ISC), viewBox 24: one icon per place in the menu, so the menu reads at a glance. */
const ICON: Record<AppShellView | "search" | "switch" | "sep", React.ReactNode> = {
  ceo: <><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></>,
  inbox: <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>,
  today: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>,
  waiting: <><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></>,
  projects: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
  areas: <><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></>,
  resources: <><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></>,
  archive: <><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></>,
  calendar: <><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>,
  agents: <><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></>,
  ask: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  switch: <><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></>,
  sep: <path d="m9 18 6-6-6-6" />,
};
const Ic = ({ k }: { k: keyof typeof ICON }) => <svg className="ash-ic" viewBox="0 0 24 24" aria-hidden="true">{ICON[k]}</svg>;

const CSS = `
.ash-win{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;color:var(--ts-fg);background:var(--ts-page);border:1px solid var(--ts-line);border-radius:calc(var(--ts-radius,6px) + 4px);box-shadow:var(--ts-elevation);overflow:hidden;container-type:inline-size;display:flex;flex-direction:column}
.ash-win *,.ash-win *::before{box-sizing:border-box}
.ash-ic{width:16px;height:16px;flex:none;fill:none;stroke:currentColor;stroke-width:var(--ts-icon-stroke,1.5);stroke-linecap:round;stroke-linejoin:round}
.ash-bar{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,auto) minmax(0,1fr);align-items:center;gap:12px;height:40px;padding:0 12px;border-bottom:1px solid var(--ts-line);background:var(--ts-side);flex:none}
.ash-lead{display:flex;align-items:center;gap:14px;min-width:0}
.ash-dots{display:flex;gap:6px;flex:none}.ash-dots i{width:10px;height:10px;border-radius:50%;background:color-mix(in srgb,var(--ts-faint) 30%,transparent)}
.ash-title{display:flex;align-items:center;gap:4px;min-width:0;font-size:12.5px;color:var(--ts-faint);white-space:nowrap}
.ash-title .ash-ic{width:13px;height:13px}
.ash-title b{font-weight:500;color:var(--ts-fg);overflow:hidden;text-overflow:ellipsis}
.ash-ask{display:inline-flex;align-items:center;gap:8px;width:300px;max-width:100%;height:28px;padding:0 6px 0 9px;border:1px solid var(--ts-line);border-radius:var(--ts-radius-control,8px);background:var(--ts-surface);color:var(--ts-faint);font:inherit;font-size:12.5px;cursor:pointer;white-space:nowrap;min-width:0;transition:border-color ${motionVar.duration("xs")},color ${motionVar.duration("xs")}}
.ash-ask span{flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis}
.ash-ask .ash-ic{width:14px;height:14px}
.ash-ask kbd{font:500 10.5px/1 var(--ts-font-mono);padding:3px 5px;border-radius:4px;background:var(--ts-soft);color:var(--ts-muted)}
.ash-ask:hover,.ash-ask[aria-pressed="true"]{border-color:var(--ts-electric);color:var(--ts-electric-fg,var(--ts-electric))}
.ash-ask:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 2px var(--ts-electric)}
.ash-me{justify-self:end;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--ts-electric-soft);color:var(--ts-on-accent-soft,var(--ts-electric-fg));font-size:11px;font-weight:600}
.ash *,.ash *::before{box-sizing:border-box}
.ash{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;color:var(--ts-fg);background:var(--ts-page);display:grid;grid-template-columns:216px minmax(0,1fr);min-height:560px;min-width:0;flex:1}
.ash.no-nav{grid-template-columns:minmax(0,1fr)}
.ash.is-bare{border:1px solid var(--ts-line);border-radius:var(--ts-radius-card,12px);overflow:hidden;container-type:inline-size}
.ash.has-aside{grid-template-columns:216px minmax(0,1fr) 300px}
.ash-nav{background:var(--ts-side);padding:10px 8px;display:flex;flex-direction:column;gap:1px;min-width:0;border-right:1px solid var(--ts-line);overflow:auto;scrollbar-width:none}
.ash-ws{display:flex;align-items:center;gap:8px;margin:0 0 8px;padding:6px 8px;border-radius:var(--ts-radius-control,8px);color:var(--ts-muted)}
.ash-ws b{width:22px;height:22px;border-radius:var(--ts-radius-tile,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:11.5px;font-weight:600;flex:none}
.ash-ws span{display:grid;line-height:1.25;min-width:0;flex:1}.ash-ws strong{font-weight:600;font-size:13px;color:var(--ts-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ash-ws small{font-size:11px;color:var(--ts-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ash-ws .ash-ic{width:14px;height:14px;color:var(--ts-faint)}
.ash-h{font:500 11px/1 var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-faint);margin:14px 8px 6px}
.ash-it{display:grid;grid-template-columns:16px minmax(0,1fr) auto;align-items:center;gap:0 9px;width:100%;padding:0 8px;border:0;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted);font:inherit;text-align:left;cursor:pointer;min-height:32px;transition:background ${motionVar.duration("xs")},color ${motionVar.duration("xs")}}
.ash-it:hover{background:color-mix(in srgb,var(--ts-fg) 5%,transparent);color:var(--ts-fg)}
.ash-it[aria-current="page"]{background:color-mix(in srgb,var(--ts-fg) 8%,transparent);color:var(--ts-fg)}
.ash-it[aria-current="page"] .ash-ic{color:var(--ts-electric-fg,var(--ts-electric))}
.ash-it span{font-size:13px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ash-it[aria-current="page"] span{font-weight:500}
.ash-it small{grid-column:2;font-size:10.5px;color:var(--ts-faint);line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-bottom:5px}
.ash-it em{grid-row:1;grid-column:3;font-style:normal;min-width:20px;padding:1px 6px;border-radius:999px;background:color-mix(in srgb,var(--ts-fg) 7%,transparent);font-size:11px;line-height:16px;text-align:center;color:var(--ts-muted);font-variant-numeric:tabular-nums}
.ash-it:focus-visible{outline:1px solid transparent;box-shadow:0 0 0 1px var(--ts-side),0 0 0 2px var(--ts-electric)}
.ash-extra{margin-top:8px;min-width:0}
.ash.is-fixed{flex:none;overflow:auto;align-items:start}.ash.is-fixed>.ash-nav{position:sticky;top:0;z-index:2;align-self:stretch;max-height:100%}.ash.is-fixed>.ash-main{overflow:visible}
.ash-main{min-width:0;min-height:0;padding:20px 24px;overflow:auto}
.ash-view{animation:ash-view-in ${motionVar.duration("md")} ${motionVar.easing("enter")} both}
@keyframes ash-view-in{from{opacity:0;transform:translateY(6px)}}
@media (prefers-reduced-motion:reduce){.ash-view{animation:none}.ash-it,.ash-ask{transition:none}}
.ash-aside{border-left:1px solid var(--ts-line);background:var(--ts-surface);padding:16px;min-width:0}
@container (max-width:1100px){.ash.has-aside{grid-template-columns:200px minmax(0,1fr)}.ash-aside{grid-column:2;border-left:0;border-top:1px solid var(--ts-line)}}
@container (max-width:860px){.ash,.ash.has-aside{grid-template-columns:176px minmax(0,1fr)}.ash.no-nav{grid-template-columns:minmax(0,1fr)}.ash-it small{display:none}.ash-main{padding:16px 18px}.ash-ask{width:220px}}
@container (max-width:600px){.ash,.ash.has-aside{grid-template-columns:minmax(0,1fr)}.ash-aside{grid-column:1}
.ash-nav{flex-direction:row;overflow-x:auto;gap:4px;padding:6px 8px;border-right:0;border-bottom:1px solid var(--ts-line)}
.ash-ws,.ash-h,.ash-it small,.ash-extra{display:none}.ash-it{width:auto;flex:none;min-height:36px}
.ash-main{padding:14px}.ash-title,.ash-me{display:none}.ash-bar{grid-template-columns:auto minmax(0,1fr)}.ash-ask{width:100%}}
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
      <Ic k={v} />
      <span>{label}</span>
      {count ? <em aria-label={`${count} зүйл`}>{count}</em> : null}
      {base && base !== label && <small>{base}</small>}
    </button>
  );
  const shell = (
    <div className={`ash ${aside ? "has-aside" : ""} ${nav ? "" : "no-nav"} ${height ? "is-fixed" : ""} ${frame ? "" : `is-bare ${className}`}`} style={height ? { height, minHeight: 0 } : undefined}>
      <style>{CSS}</style>
      {nav && (
        <nav className="ash-nav" aria-label={L.nav}>
          <div className="ash-ws"><b aria-hidden="true">{company.initial ?? company.name.replace(/^ac\.me\s*/i, "").slice(0, 1).toUpperCase()}</b><span><strong>{company.name}</strong>{company.note && <small>{company.note}</small>}</span><Ic k="switch" /></div>
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
  // where am I: the app's name, then the place that is open (the menu's own word for it)
  const place = current === "ceo" ? L.ceo : current === "calendar" ? L.calendar : current === "agents" ? L.agents : current === "ask" ? L.ask : word(current).label;
  return (
    <div className={`ash-win ts-surface-app ${className}`}>
      <div className="ash-bar">
        <div className="ash-lead">
          <div className="ash-dots" aria-hidden="true"><i /><i /><i /></div>
          <span className="ash-title"><span>{title ?? L.title}</span><Ic k="sep" /><b>{place}</b></span>
        </div>
        <button type="button" className="ash-ask" aria-pressed={current === "ask"} onClick={() => (onAsk ? onAsk() : go("ask"))}><Ic k="search" /><span>{L.ask}</span><kbd>⌘K</kbd></button>
        <span className="ash-me" aria-hidden="true">{(company.initial ?? company.name.replace(/^ac\.me\s*/i, "").slice(0, 1) ?? "A").toUpperCase() || "A"}</span>
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
