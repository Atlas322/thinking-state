/**
 * Site chrome from the one design system: Wordmark, NavBar, Footer
 * (owner 2026-11-12: the site keeps only layout and content). Data comes
 * in as props — the inai.sh sitemap stays in inai-sh. Colours, type and
 * icons come from the --ts-* tokens and the system icon map.
 *
 * NavBar: links and mega menus (headed groups of icon rows + one featured
 * next step), an outbound «inside» link, an actions slot (theme toggle,
 * CTA); on phones the same map folds into one-column-at-a-time accordions.
 * Escape closes. Footer: brand block, the map's columns, and a bottom line
 * with the source and date of the site's numbers.
 */
import * as React from "react";
import { Icon, type IconName } from "../company/icons";
import { PrimitiveStyles } from "./primitives";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ───────── Wordmark ───────── */

/** «inai.» — the dot carries the brand colour (kept as is until owner decides). */
export function Wordmark({ href = "index.html", label = "INAI — Нүүр", size = 22, className }: { href?: string | null; label?: string; size?: number; className?: string }) {
  const body = (
    <>
      <SiteStyles />
      inai<span className="ts-wm-dot">.</span>
    </>
  );
  return href ? (
    <a className={cx("ts-wordmark", className)} href={href} aria-label={label} style={{ fontSize: size }}>
      {body}
    </a>
  ) : (
    <span className={cx("ts-wordmark", className)} aria-label={label} role="img" style={{ fontSize: size }}>
      {body}
    </span>
  );
}

/* ───────── NavBar ───────── */

export type NavLink = { label: string; href: string; icon: IconName; note?: string };
export type NavGroup = { label: string; links: NavLink[] };
export type NavFeature = { kicker: string; title: string; text: string; cta: string; href: string; icon: IconName };
export type NavItem =
  | { kind: "link"; label: string; href: string; icon?: IconName; match?: string[] }
  | { kind: "menu"; id: string; label: string; groups: NavGroup[]; feature?: NavFeature };

export type NavBarLabels = { main: string; mobile: string; open: string; close: string };
export const navBarLabelsMn: NavBarLabels = { main: "Үндсэн цэс", mobile: "Гар утасны цэс", open: "Цэс нээх", close: "Цэс хаах" };

export type NavBarProps = {
  items: NavItem[];
  /** Current page href (aria-current, «is-here» on its menu). */
  current?: string;
  brand?: React.ReactNode;
  /** One outbound link (e.g. «INAI-г дотроос нь ↗»). */
  inside?: { label: string; href: string };
  /** Right-hand controls: theme toggle, CTA button. */
  actions?: React.ReactNode;
  /** Open a menu (controlled; catalog demos). */
  openMenu?: string | null;
  onOpenMenuChange?: (id: string | null) => void;
  labels?: Partial<NavBarLabels>;
  sticky?: boolean;
  className?: string;
};

function NavRow({ l, current, onClick }: { l: NavLink; current?: string; onClick?: () => void }) {
  return (
    <a className="ts-nav-row" href={l.href} aria-current={current === l.href ? "page" : undefined} onClick={onClick}>
      <span className="ts-nav-ico">
        <Icon name={l.icon} size={16} />
      </span>
      <span className="ts-nav-txt">
        <b>{l.label}</b>
        {l.note && <small>{l.note}</small>}
      </span>
    </a>
  );
}

export function NavBar({ items, current, brand, inside, actions, openMenu, onOpenMenuChange, labels, sticky = true, className }: NavBarProps) {
  const L = { ...navBarLabelsMn, ...labels };
  const [own, setOwn] = React.useState<string | null>(null);
  const menu = openMenu !== undefined ? openMenu : own;
  const setMenu = (id: string | null) => (openMenu === undefined && setOwn(id), onOpenMenuChange?.(id));
  const [phone, setPhone] = React.useState(false);
  const owner = items.find((i) => i.kind === "menu" && i.groups.some((g) => g.links.some((l) => l.href === current)));
  const [section, setSection] = React.useState<string | null>(owner && owner.kind === "menu" ? owner.id : null);
  const toggle = React.useRef<HTMLButtonElement>(null);
  const uid = React.useId(); // two bars on one page must not share ids
  React.useEffect(() => {
    if (!phone && !menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPhone(false);
      setMenu(null);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });
  return (
    <header className={cx("ts-navbar", sticky && "is-sticky", className)}>
      <SiteStyles />
      <div className="ts-nav-inner">
        <span className="ts-nav-brand">{brand ?? <Wordmark />}</span>
        <nav className="ts-nav-desktop" aria-label={L.main} onMouseLeave={() => setMenu(null)}>
          {items.map((item) =>
            item.kind === "link" ? (
              <a key={item.href} className="ts-nav-link" href={item.href} aria-current={item.href === current || item.match?.includes(current ?? "") ? "page" : undefined}>
                {item.icon && <Icon name={item.icon} size={14} />}
                {item.label}
              </a>
            ) : (
              <div key={item.id} className="ts-mega" onMouseEnter={() => setMenu(item.id)}>
                <button
                  type="button"
                  className={cx("ts-mega-trigger", owner === item && "is-here")}
                  aria-expanded={menu === item.id}
                  aria-controls={`${uid}-mega-${item.id}`}
                  onClick={() => setMenu(menu === item.id ? null : item.id)}
                >
                  {item.label} <Icon name="chevron-down" size={14} />
                </button>
                <div id={`${uid}-mega-${item.id}`} className="ts-mega-panel" hidden={menu !== item.id}>
                  <div className="ts-mega-groups">
                    {item.groups.map((g) => (
                      <div key={g.label} className="ts-mega-group">
                        <span className="ts-mega-h">{g.label}</span>
                        {g.links.map((l) => (
                          <NavRow key={l.href} l={l} current={current} />
                        ))}
                      </div>
                    ))}
                  </div>
                  {item.feature && (
                    <a className="ts-mega-feature" href={item.feature.href}>
                      <span className="ts-nav-ico is-accent">
                        <Icon name={item.feature.icon} size={18} />
                      </span>
                      <span className="ts-mega-k">{item.feature.kicker}</span>
                      <b>{item.feature.title}</b>
                      <small>{item.feature.text}</small>
                      <span className="ts-mega-cta">
                        {item.feature.cta} <Icon name="arrow-right" size={14} />
                      </span>
                    </a>
                  )}
                </div>
              </div>
            ),
          )}
          {inside && (
            <a className="ts-nav-link is-inside" href={inside.href}>
              {inside.label} <Icon name="arrow-up-right" size={14} />
            </a>
          )}
        </nav>
        <div className="ts-nav-actions">
          {actions}
          <button
            ref={toggle}
            type="button"
            className="ts-nav-toggle"
            aria-expanded={phone}
            aria-controls={`${uid}-mobile`}
            aria-label={phone ? L.close : L.open}
            onClick={() => setPhone(!phone)}
          >
            <Icon name={phone ? "x" : "menu"} size={20} />
          </button>
        </div>
      </div>
      <nav id={`${uid}-mobile`} className="ts-nav-mobile" aria-label={L.mobile} hidden={!phone}>
        {inside && (
          <a className="ts-nav-link is-inside" href={inside.href} onClick={() => setPhone(false)}>
            {inside.label} <Icon name="arrow-up-right" size={16} />
          </a>
        )}
        {items.map((item) =>
          item.kind === "link" ? (
            <a key={item.href} className="ts-mobile-h" href={item.href} onClick={() => setPhone(false)}>
              {item.label}
            </a>
          ) : (
            <div key={item.id} className="ts-mobile-col">
              <button
                type="button"
                className="ts-mobile-h"
                aria-expanded={section === item.id}
                aria-controls={`${uid}-mobile-${item.id}`}
                onClick={() => setSection(section === item.id ? null : item.id)}
              >
                {item.label} <Icon name="chevron-down" size={18} />
              </button>
              <div id={`${uid}-mobile-${item.id}`} className="ts-mobile-body" hidden={section !== item.id}>
                {item.groups.map((g) => (
                  <div key={g.label} className="ts-mega-group">
                    {item.groups.length > 1 && <span className="ts-mega-h">{g.label}</span>}
                    {g.links.map((l) => (
                      <NavRow key={l.href} l={l} current={current} onClick={() => setPhone(false)} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </nav>
    </header>
  );
}

/* ───────── Footer ───────── */

export type FooterColumn = { id: string; label: string; groups: { label: string; links: { label: string; href: string }[] }[] };
export type FooterProps = {
  brand?: React.ReactNode;
  tagline?: React.ReactNode;
  /** The one action every page ends on. */
  cta?: React.ReactNode;
  email?: string;
  columns: FooterColumn[];
  owner: string;
  /** Where the site's numbers come from and when (never «—»: omit when unknown). */
  source?: { label: string; updated?: string };
  legal?: { label: string; href: string }[];
  /** Right end of the bottom line (theme toggle). */
  end?: React.ReactNode;
  /** Current page href — marked «you are here» in the map. */
  current?: string;
  className?: string;
};

export function Footer({ brand, tagline, cta, email, columns, owner, source, legal = [], end, current, className }: FooterProps) {
  return (
    <footer className={cx("ts-footer", className)}>
      <SiteStyles />
      <div className="ts-footer-grid">
        <div className="ts-footer-brand">
          {brand ?? <Wordmark />}
          {tagline && <p>{tagline}</p>}
          {cta}
          {email && (
            <a className="ts-footer-mail" href={`mailto:${email}`}>
              <Icon name="mail" size={14} />
              {email}
            </a>
          )}
        </div>
        {columns.map((col) => (
          <nav key={col.id} className="ts-footer-col" aria-label={col.label}>
            <span className="ts-footer-h">{col.label}</span>
            {col.groups.map((g) =>
              g.links.length ? (
                <div key={g.label} className="ts-footer-group">
                  {col.groups.length > 1 && <span className="ts-footer-sub">{g.label}</span>}
                  {g.links.map((l) => (
                    <a key={l.href} href={l.href} aria-current={l.href === current ? "page" : undefined}>
                      {l.label}
                    </a>
                  ))}
                </div>
              ) : null,
            )}
          </nav>
        ))}
      </div>
      <div className="ts-footer-bottom">
        <span>{owner}</span>
        {source && (
          <span className="ts-footer-source">
            <Icon name="database" size={13} />
            {source.label}
            {source.updated && <time dateTime={source.updated}> · шинэчлэгдсэн {source.updated}</time>}
          </span>
        )}
        <span className="ts-footer-legal">
          {legal.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          {end && <span className="ts-footer-end">{end}</span>}
        </span>
      </div>
    </footer>
  );
}

/* ───────── CSS ───────── */

export const SITE_CSS = `
.ts-wordmark{display:inline-flex;align-items:baseline;font:600 1em/1 var(--ts-font-head,Inter,system-ui,sans-serif);letter-spacing:-.03em;color:var(--ts-fg,#080808);text-decoration:none}
.ts-wm-dot{color:var(--ts-red,#c2362f)}
.ts-navbar{position:relative;z-index:40;background:color-mix(in srgb,var(--ts-page,#f0ede4) 88%,transparent);border-bottom:1px solid var(--ts-line,#d8d3c6);backdrop-filter:blur(10px);font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg,#080808)}
.ts-navbar.is-sticky{position:sticky;top:0}
.ts-nav-inner{position:relative;display:flex;align-items:center;gap:var(--ts-space-5,24px);min-height:60px;max-width:var(--ts-page-max,1200px);margin:0 auto;padding:0 var(--ts-space-5,24px)}
.ts-nav-brand{flex:none}
.ts-nav-desktop{display:flex;align-items:center;gap:2px;flex:1;min-width:0}
.ts-nav-link,.ts-mega-trigger{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border:0;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted,#5e5a52);font:500 14px var(--ts-font,Inter,system-ui,sans-serif);text-decoration:none;white-space:nowrap;cursor:pointer;transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms)}
.ts-nav-link:hover,.ts-mega-trigger:hover,.ts-mega-trigger[aria-expanded=true],.ts-mega-trigger.is-here{background:var(--ts-soft,#efebe1);color:var(--ts-fg,#080808)}
.ts-nav-link[aria-current=page]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}
.ts-nav-link.is-inside{margin-left:auto;color:color-mix(in srgb,var(--ts-accent-fg,#1b5cff) 88%,var(--ts-fg,#080808))}
.ts-mega-trigger .cv-icon{transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-standard,ease)}
.ts-mega-trigger[aria-expanded=true] .cv-icon{transform:rotate(180deg)}
.ts-mega{position:static}
.ts-mega-panel{position:absolute;top:100%;left:0;right:0;z-index:50;display:flex;align-items:stretch;border:1px solid var(--ts-line,#d8d3c6);border-top:0;border-radius:0 0 var(--ts-radius-card,12px) var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee);box-shadow:0 24px 48px -24px rgb(0 0 0 / .3);animation:ts-mega-in var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out) both}
.ts-mega-panel[hidden]{display:none}
.ts-mega-panel::before{content:"";position:absolute;left:0;right:0;top:-8px;height:8px}
@keyframes ts-mega-in{from{opacity:0;transform:translateY(-6px)}}
.ts-mega-groups{flex:1;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);padding:20px 8px 20px 16px;min-width:0}
.ts-mega-group{display:grid;align-content:start;gap:2px;min-width:0;padding:0 16px}
.ts-mega-group+.ts-mega-group{border-left:1px solid var(--ts-line,#d8d3c6)}
.ts-mega-h{display:block;margin:0 0 6px;padding:0 8px 8px;border-bottom:1px solid var(--ts-line,#d8d3c6);font:600 11px/1.3 var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-fg,#080808)}
.ts-nav-row{display:grid;grid-template-columns:32px minmax(0,1fr);gap:12px;align-items:center;padding:8px;border-radius:var(--ts-radius-control,8px);color:var(--ts-fg,#080808);text-decoration:none;transition:background var(--ts-motion-dur-xs,120ms)}
.ts-nav-ico{display:grid;place-items:center;width:32px;height:32px;border-radius:var(--ts-radius-tile,6px);background:var(--ts-soft,#efebe1);color:var(--ts-muted,#5e5a52);transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-nav-ico.is-accent{background:var(--ts-accent-strong,#1b5cff);color:#fff}
.ts-nav-txt{display:grid;gap:2px;min-width:0}
.ts-nav-txt b{font-size:14px;font-weight:600;line-height:1.3}
.ts-nav-txt small{font-size:13px;line-height:1.35;color:var(--ts-muted,#5e5a52)}
.ts-nav-row:hover,.ts-nav-row[aria-current=page]{background:var(--ts-soft,#efebe1)}
.ts-nav-row:hover .ts-nav-ico{transform:scale(1.06)}
.ts-nav-row[aria-current=page] .ts-nav-ico{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}
.ts-mega-feature{display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:300px;flex:none;padding:24px;border-left:1px solid var(--ts-line,#d8d3c6);background:var(--ts-page,#f0ede4);color:var(--ts-fg,#080808);text-decoration:none;border-radius:0 0 var(--ts-radius-card,12px) 0}
.ts-mega-feature .ts-nav-ico{margin-bottom:8px}
.ts-mega-k{font-size:12px;font-weight:600;color:var(--ts-accent-fg,#1b5cff)}
.ts-mega-feature b{font-size:16px;line-height:1.3}
.ts-mega-feature small{font-size:13px;line-height:1.5;color:var(--ts-muted,#5e5a52)}
.ts-mega-cta{display:inline-flex;align-items:center;gap:6px;margin-top:auto;padding-top:12px;font-size:14px;font-weight:600}
.ts-mega-feature:hover .ts-mega-cta .cv-icon{transform:translateX(2px)}
.ts-mega-cta .cv-icon{transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-nav-actions{display:flex;align-items:center;gap:8px;flex:none;margin-left:auto}
.ts-nav-toggle{display:none;place-items:center;width:40px;height:40px;border:0;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-fg,#080808);cursor:pointer}
.ts-nav-toggle:hover{background:var(--ts-soft,#efebe1)}
.ts-nav-mobile{padding:0 var(--ts-space-4,16px) var(--ts-space-4,16px);max-height:calc(100dvh - 60px);overflow-y:auto;overscroll-behavior:contain}
.ts-nav-mobile[hidden]{display:none}
.ts-mobile-col{border-top:1px solid var(--ts-line,#d8d3c6)}
.ts-mobile-h{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:0 4px;border:0;background:none;color:var(--ts-fg,#080808);font:600 16px var(--ts-font,Inter,system-ui,sans-serif);text-align:left;text-decoration:none;cursor:pointer}
.ts-mobile-h .cv-icon{color:var(--ts-muted,#5e5a52);transition:transform var(--ts-motion-dur-sm,200ms)}
.ts-mobile-h[aria-expanded=true] .cv-icon{transform:rotate(180deg)}
.ts-mobile-body{display:grid;gap:8px;padding-bottom:12px}
.ts-mobile-body[hidden]{display:none}
.ts-nav-mobile .ts-mega-group{padding:0}
.ts-nav-mobile .ts-mega-group+.ts-mega-group{border-left:0}
.ts-nav-mobile .ts-nav-link.is-inside{margin:8px 0}
.ts-nav-link:focus-visible,.ts-mega-trigger:focus-visible,.ts-nav-row:focus-visible,.ts-mega-feature:focus-visible,.ts-nav-toggle:focus-visible,.ts-mobile-h:focus-visible,.ts-footer a:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:2px}
@media (max-width:1080px){.ts-mega-feature{display:none}}
@media (max-width:860px){.ts-nav-desktop{display:none}.ts-nav-toggle{display:grid}.ts-nav-inner{padding:0 var(--ts-space-4,16px)}}

.ts-footer{border-top:1px solid var(--ts-line,#d8d3c6);background:var(--ts-page,#f0ede4);color:var(--ts-fg,#080808);font-family:var(--ts-font,Inter,system-ui,sans-serif)}
.ts-footer-grid{display:grid;grid-template-columns:minmax(0,1.4fr) repeat(auto-fit,minmax(140px,1fr));gap:40px 0;max-width:var(--ts-page-max,1200px);margin:0 auto;padding:var(--ts-space-7,48px) var(--ts-space-5,24px) 0}
.ts-footer-brand{display:grid;align-content:start;justify-items:start;gap:var(--ts-space-4,16px);padding-right:24px}
.ts-footer-brand p{margin:0;max-width:260px;font-size:14px;line-height:1.6;color:var(--ts-muted,#5e5a52)}
.ts-footer-mail{display:inline-flex;align-items:center;gap:6px;font-size:14px;color:color-mix(in srgb,var(--ts-accent-fg,#1b5cff) 88%,var(--ts-fg,#080808));text-decoration:none}
.ts-footer-col{display:grid;align-content:start;gap:12px;padding:0 24px;border-left:1px solid var(--ts-line,#d8d3c6)}
.ts-footer-h{padding-bottom:10px;border-bottom:1px solid var(--ts-line,#d8d3c6);font-size:14px;font-weight:600}
.ts-footer-group{display:grid;justify-items:start}
.ts-footer-sub{padding:10px 0 6px;font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase}
.ts-footer-group a,.ts-footer-legal a{display:inline-flex;align-items:center;min-height:32px;font-size:14px;color:var(--ts-muted,#5e5a52);text-decoration:none}
.ts-footer-group a:hover,.ts-footer-legal a:hover{color:var(--ts-fg,#080808);text-decoration:underline;text-underline-offset:3px}
.ts-footer-group a{position:relative;transition:color var(--ts-motion-dur-sm,200ms),padding var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out)}
.ts-footer-group a[aria-current=page]{padding-left:12px;color:var(--ts-fg,#080808);font-weight:600}
.ts-footer-group a[aria-current=page]::before{content:"";position:absolute;left:0;top:50%;width:4px;height:4px;margin-top:-2px;border-radius:2px;background:var(--ts-selected,#0c8ce9)}
.ts-footer-bottom{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 24px;max-width:var(--ts-page-max,1200px);margin:var(--ts-space-7,48px) auto 0;padding:16px var(--ts-space-5,24px) 24px;border-top:1px solid var(--ts-line,#d8d3c6);font-size:13px;color:var(--ts-muted,#5e5a52)}
.ts-footer-source{display:inline-flex;align-items:center;gap:6px;font-family:var(--ts-font-mono,"IBM Plex Mono",monospace);font-size:12px}
.ts-footer-legal{display:flex;flex-wrap:wrap;align-items:center;gap:4px 20px}
.ts-footer-legal a{font-size:13px}
.ts-footer-end{display:inline-flex;align-items:center;gap:8px;padding-left:20px;border-left:1px solid var(--ts-line,#d8d3c6)}
@media (max-width:1000px){.ts-footer-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.ts-footer-brand{grid-column:1/-1}.ts-footer-col:nth-of-type(3n+1){padding-left:0;border-left:0}}
@media (max-width:640px){.ts-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 0;padding:var(--ts-space-6,32px) var(--ts-space-4,16px) 0}.ts-footer-col{padding:0 16px}.ts-footer-col:nth-of-type(2n+1){padding-left:0;border-left:0}.ts-footer-bottom{flex-direction:column;align-items:flex-start;padding:16px var(--ts-space-4,16px) 24px}.ts-footer-end{padding-left:0;border-left:0}}
@media (pointer:coarse){.ts-footer-group a,.ts-footer-legal a{min-height:44px}}
@media (prefers-reduced-motion:reduce){.ts-mega-panel{animation:none}.ts-nav-ico,.ts-mega-cta .cv-icon,.ts-mega-trigger .cv-icon{transition:none}}
`;

let href: string | undefined;
function SiteStyles() {
  if (!href) {
    let h = 0;
    for (let i = 0; i < SITE_CSS.length; i++) h = (Math.imul(h, 31) + SITE_CSS.charCodeAt(i)) | 0;
    href = `ts-site-${(h >>> 0).toString(36)}`;
  }
  return (
    <>
      <PrimitiveStyles />
      <style href={href} precedence="default">
        {SITE_CSS}
      </style>
    </>
  );
}
