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
import { type IconName } from "../company/icons";
/** «inai.» — the dot carries the brand colour (kept as is until owner decides). */
export declare function Wordmark({ href, label, size, className }: {
    href?: string | null;
    label?: string;
    size?: number;
    className?: string;
}): React.JSX.Element;
export type NavLink = {
    label: string;
    href: string;
    icon: IconName;
    note?: string;
};
export type NavGroup = {
    label: string;
    links: NavLink[];
};
export type NavFeature = {
    kicker: string;
    title: string;
    text: string;
    cta: string;
    href: string;
    icon: IconName;
};
export type NavItem = {
    kind: "link";
    label: string;
    href: string;
    icon?: IconName;
    match?: string[];
} | {
    kind: "menu";
    id: string;
    label: string;
    groups: NavGroup[];
    feature?: NavFeature;
};
export type NavBarLabels = {
    main: string;
    mobile: string;
    open: string;
    close: string;
};
export declare const navBarLabelsMn: NavBarLabels;
export type NavBarProps = {
    items: NavItem[];
    /** Current page href (aria-current, «is-here» on its menu). */
    current?: string;
    brand?: React.ReactNode;
    /** One outbound link (e.g. «INAI-г дотроос нь ↗»). */
    inside?: {
        label: string;
        href: string;
    };
    /** Right-hand controls: theme toggle, CTA button. */
    actions?: React.ReactNode;
    /** Open a menu (controlled; catalog demos). */
    openMenu?: string | null;
    onOpenMenuChange?: (id: string | null) => void;
    labels?: Partial<NavBarLabels>;
    sticky?: boolean;
    className?: string;
};
export declare function NavBar({ items, current, brand, inside, actions, openMenu, onOpenMenuChange, labels, sticky, className }: NavBarProps): React.JSX.Element;
export type FooterColumn = {
    id: string;
    label: string;
    groups: {
        label: string;
        links: {
            label: string;
            href: string;
        }[];
    }[];
};
export type FooterProps = {
    brand?: React.ReactNode;
    tagline?: React.ReactNode;
    /** The one action every page ends on. */
    cta?: React.ReactNode;
    email?: string;
    columns: FooterColumn[];
    owner: string;
    /** Where the site's numbers come from and when (never «—»: omit when unknown). */
    source?: {
        label: string;
        updated?: string;
    };
    legal?: {
        label: string;
        href: string;
    }[];
    /** Right end of the bottom line (theme toggle). */
    end?: React.ReactNode;
    /** Current page href — marked «you are here» in the map. */
    current?: string;
    className?: string;
};
export declare function Footer({ brand, tagline, cta, email, columns, owner, source, legal, end, current, className }: FooterProps): React.JSX.Element;
export declare const SITE_CSS = "\n.ts-wordmark{display:inline-flex;align-items:baseline;font:600 1em/1 var(--ts-font-head,Inter,system-ui,sans-serif);letter-spacing:-.03em;color:var(--ts-fg,#080808);text-decoration:none}\n.ts-wm-dot{color:var(--ts-red,#c2362f)}\n.ts-navbar{position:relative;z-index:40;background:color-mix(in srgb,var(--ts-page,#f0ede4) 88%,transparent);border-bottom:1px solid var(--ts-line,#d8d3c6);backdrop-filter:blur(10px);font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg,#080808)}\n.ts-navbar.is-sticky{position:sticky;top:0}\n.ts-nav-inner{position:relative;display:flex;align-items:center;gap:var(--ts-space-5,24px);min-height:60px;max-width:var(--ts-page-max,1200px);margin:0 auto;padding:0 var(--ts-space-5,24px)}\n.ts-nav-brand{flex:none}\n.ts-nav-desktop{display:flex;align-items:center;gap:2px;flex:1;min-width:0}\n.ts-nav-link,.ts-mega-trigger{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border:0;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted,#5e5a52);font:500 14px var(--ts-font,Inter,system-ui,sans-serif);text-decoration:none;white-space:nowrap;cursor:pointer;transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms)}\n.ts-nav-link:hover,.ts-mega-trigger:hover,.ts-mega-trigger[aria-expanded=true],.ts-mega-trigger.is-here{background:var(--ts-soft,#efebe1);color:var(--ts-fg,#080808)}\n.ts-nav-link[aria-current=page]{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}\n.ts-nav-link.is-inside{margin-left:auto;color:var(--ts-accent-fg,#1b5cff)}\n.ts-mega-trigger .cv-icon{transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-ease-standard,ease)}\n.ts-mega-trigger[aria-expanded=true] .cv-icon{transform:rotate(180deg)}\n.ts-mega{position:static}\n.ts-mega-panel{position:absolute;top:100%;left:0;right:0;z-index:50;display:flex;align-items:stretch;border:1px solid var(--ts-line,#d8d3c6);border-top:0;border-radius:0 0 var(--ts-radius-card,12px) var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee);box-shadow:0 24px 48px -24px rgb(0 0 0 / .3);animation:ts-mega-in var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out) both}\n.ts-mega-panel[hidden]{display:none}\n.ts-mega-panel::before{content:\"\";position:absolute;left:0;right:0;top:-8px;height:8px}\n@keyframes ts-mega-in{from{opacity:0;transform:translateY(-6px)}}\n.ts-mega-groups{flex:1;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);padding:20px 8px 20px 16px;min-width:0}\n.ts-mega-group{display:grid;align-content:start;gap:2px;min-width:0;padding:0 16px}\n.ts-mega-group+.ts-mega-group{border-left:1px solid var(--ts-line,#d8d3c6)}\n.ts-mega-h{display:block;margin:0 0 6px;padding:0 8px 8px;border-bottom:1px solid var(--ts-line,#d8d3c6);font:600 11px/1.3 var(--ts-font-mono,\"IBM Plex Mono\",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-fg,#080808)}\n.ts-nav-row{display:grid;grid-template-columns:32px minmax(0,1fr);gap:12px;align-items:center;padding:8px;border-radius:var(--ts-radius-control,8px);color:var(--ts-fg,#080808);text-decoration:none;transition:background var(--ts-motion-dur-xs,120ms)}\n.ts-nav-ico{display:grid;place-items:center;width:32px;height:32px;border-radius:var(--ts-radius-tile,6px);background:var(--ts-soft,#efebe1);color:var(--ts-muted,#5e5a52);transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}\n.ts-nav-ico.is-accent{background:var(--ts-accent-strong,#1b5cff);color:#fff}\n.ts-nav-txt{display:grid;gap:2px;min-width:0}\n.ts-nav-txt b{font-size:14px;font-weight:600;line-height:1.3}\n.ts-nav-txt small{font-size:13px;line-height:1.35;color:var(--ts-muted,#5e5a52)}\n.ts-nav-row:hover,.ts-nav-row[aria-current=page]{background:var(--ts-soft,#efebe1)}\n.ts-nav-row:hover .ts-nav-ico{transform:scale(1.06)}\n.ts-nav-row[aria-current=page] .ts-nav-ico{background:var(--ts-selected-bg,#0a7acb);color:var(--ts-on-selected,#fff)}\n.ts-mega-feature{display:flex;flex-direction:column;align-items:flex-start;gap:6px;width:300px;flex:none;padding:24px;border-left:1px solid var(--ts-line,#d8d3c6);background:var(--ts-page,#f0ede4);color:var(--ts-fg,#080808);text-decoration:none;border-radius:0 0 var(--ts-radius-card,12px) 0}\n.ts-mega-feature .ts-nav-ico{margin-bottom:8px}\n.ts-mega-k{font-size:12px;font-weight:600;color:var(--ts-accent-fg,#1b5cff)}\n.ts-mega-feature b{font-size:16px;line-height:1.3}\n.ts-mega-feature small{font-size:13px;line-height:1.5;color:var(--ts-muted,#5e5a52)}\n.ts-mega-cta{display:inline-flex;align-items:center;gap:6px;margin-top:auto;padding-top:12px;font-size:14px;font-weight:600}\n.ts-mega-feature:hover .ts-mega-cta .cv-icon{transform:translateX(2px)}\n.ts-mega-cta .cv-icon{transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}\n.ts-nav-actions{display:flex;align-items:center;gap:8px;flex:none;margin-left:auto}\n.ts-nav-toggle{display:none;place-items:center;width:40px;height:40px;border:0;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-fg,#080808);cursor:pointer}\n.ts-nav-toggle:hover{background:var(--ts-soft,#efebe1)}\n.ts-nav-mobile{padding:0 var(--ts-space-4,16px) var(--ts-space-4,16px);max-height:calc(100dvh - 60px);overflow-y:auto;overscroll-behavior:contain}\n.ts-nav-mobile[hidden]{display:none}\n.ts-mobile-col{border-top:1px solid var(--ts-line,#d8d3c6)}\n.ts-mobile-h{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:0 4px;border:0;background:none;color:var(--ts-fg,#080808);font:600 16px var(--ts-font,Inter,system-ui,sans-serif);text-align:left;text-decoration:none;cursor:pointer}\n.ts-mobile-h .cv-icon{color:var(--ts-muted,#5e5a52);transition:transform var(--ts-motion-dur-sm,200ms)}\n.ts-mobile-h[aria-expanded=true] .cv-icon{transform:rotate(180deg)}\n.ts-mobile-body{display:grid;gap:8px;padding-bottom:12px}\n.ts-mobile-body[hidden]{display:none}\n.ts-nav-mobile .ts-mega-group{padding:0}\n.ts-nav-mobile .ts-mega-group+.ts-mega-group{border-left:0}\n.ts-nav-mobile .ts-nav-link.is-inside{margin:8px 0}\n.ts-nav-link:focus-visible,.ts-mega-trigger:focus-visible,.ts-nav-row:focus-visible,.ts-mega-feature:focus-visible,.ts-nav-toggle:focus-visible,.ts-mobile-h:focus-visible,.ts-footer a:focus-visible{outline:2px solid var(--ts-selected,#0c8ce9);outline-offset:2px}\n@media (max-width:1080px){.ts-mega-feature{display:none}}\n@media (max-width:860px){.ts-nav-desktop{display:none}.ts-nav-toggle{display:grid}.ts-nav-inner{padding:0 var(--ts-space-4,16px)}}\n\n.ts-footer{border-top:1px solid var(--ts-line,#d8d3c6);background:var(--ts-page,#f0ede4);color:var(--ts-fg,#080808);font-family:var(--ts-font,Inter,system-ui,sans-serif)}\n.ts-footer-grid{display:grid;grid-template-columns:minmax(0,1.4fr) repeat(auto-fit,minmax(140px,1fr));gap:40px 0;max-width:var(--ts-page-max,1200px);margin:0 auto;padding:var(--ts-space-7,48px) var(--ts-space-5,24px) 0}\n.ts-footer-brand{display:grid;align-content:start;justify-items:start;gap:var(--ts-space-4,16px);padding-right:24px}\n.ts-footer-brand p{margin:0;max-width:260px;font-size:14px;line-height:1.6;color:var(--ts-muted,#5e5a52)}\n.ts-footer-mail{display:inline-flex;align-items:center;gap:6px;font-size:14px;color:var(--ts-accent-fg,#1b5cff);text-decoration:none}\n.ts-footer-col{display:grid;align-content:start;gap:12px;padding:0 24px;border-left:1px solid var(--ts-line,#d8d3c6)}\n.ts-footer-h{padding-bottom:10px;border-bottom:1px solid var(--ts-line,#d8d3c6);font-size:14px;font-weight:600}\n.ts-footer-group{display:grid;justify-items:start}\n.ts-footer-sub{padding:10px 0 6px;font:600 11px var(--ts-font-mono,\"IBM Plex Mono\",monospace);letter-spacing:.06em;text-transform:uppercase}\n.ts-footer-group a,.ts-footer-legal a{display:inline-flex;align-items:center;min-height:32px;font-size:14px;color:var(--ts-muted,#5e5a52);text-decoration:none}\n.ts-footer-group a:hover,.ts-footer-legal a:hover{color:var(--ts-fg,#080808);text-decoration:underline;text-underline-offset:3px}\n.ts-footer-group a{position:relative;transition:color var(--ts-motion-dur-sm,200ms),padding var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out)}\n.ts-footer-group a[aria-current=page]{padding-left:12px;color:var(--ts-fg,#080808);font-weight:600}\n.ts-footer-group a[aria-current=page]::before{content:\"\";position:absolute;left:0;top:50%;width:4px;height:4px;margin-top:-2px;border-radius:2px;background:var(--ts-selected,#0c8ce9)}\n.ts-footer-bottom{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 24px;max-width:var(--ts-page-max,1200px);margin:var(--ts-space-7,48px) auto 0;padding:16px var(--ts-space-5,24px) 24px;border-top:1px solid var(--ts-line,#d8d3c6);font-size:13px;color:var(--ts-muted,#5e5a52)}\n.ts-footer-source{display:inline-flex;align-items:center;gap:6px;font-family:var(--ts-font-mono,\"IBM Plex Mono\",monospace);font-size:12px}\n.ts-footer-legal{display:flex;flex-wrap:wrap;align-items:center;gap:4px 20px}\n.ts-footer-legal a{font-size:13px}\n.ts-footer-end{display:inline-flex;align-items:center;gap:8px;padding-left:20px;border-left:1px solid var(--ts-line,#d8d3c6)}\n@media (max-width:1000px){.ts-footer-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.ts-footer-brand{grid-column:1/-1}.ts-footer-col:nth-of-type(3n+1){padding-left:0;border-left:0}}\n@media (max-width:640px){.ts-footer-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 0;padding:var(--ts-space-6,32px) var(--ts-space-4,16px) 0}.ts-footer-col{padding:0 16px}.ts-footer-col:nth-of-type(2n+1){padding-left:0;border-left:0}.ts-footer-bottom{flex-direction:column;align-items:flex-start;padding:16px var(--ts-space-4,16px) 24px}.ts-footer-end{padding-left:0;border-left:0}}\n@media (pointer:coarse){.ts-footer-group a,.ts-footer-legal a{min-height:44px}}\n@media (prefers-reduced-motion:reduce){.ts-mega-panel{animation:none}.ts-nav-ico,.ts-mega-cta .cv-icon,.ts-mega-trigger .cv-icon{transition:none}}\n";
