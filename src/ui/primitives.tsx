/**
 * Thinking State primitives — the one design system for the app and the site
 * (owner 2026-11-12: «дизайн систем нэг л байна, тэр нь Thinking State»).
 * Button, SplitCTA, Pill, Tabs (tabs | segmented), Badge, Card, Text.
 *
 * Styling: classes `ts-*` from PRIMITIVES_CSS, read from --ts-* tokens with
 * fallbacks, so they work with or without tokens.css. The CSS is injected
 * once by <PrimitiveStyles/> (each component renders it; React 19 dedupes by
 * href) and also ships as @inai/thinking-state/ts.css for sites.
 * Selected state = --ts-selected #0C8CE9 with white text on both themes.
 * Controls carry no outer margin — space them with <Stack>.
 */
import * as React from "react";
import { Icon, type IconName } from "../company/icons";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/* ───────── Button ───────── */

export type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonOwn = {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  iconEnd?: IconName;
  /** Render as a link. */
  href?: string;
  block?: boolean;
};
export type ButtonProps = ButtonOwn &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwn>;

export function Button({ variant = "primary", size = "md", icon, iconEnd, href, block, className, children, type, ...rest }: ButtonProps) {
  const cls = cx("ts-btn", `is-${variant}`, `is-${size}`, block && "is-block", className);
  const iconSize = size === "sm" ? 14 : 16;
  const inner = (
    <>
      <PrimitiveStyles />
      {icon && <Icon name={icon} size={iconSize} />}
      {children != null && <span className="ts-btn-label">{children}</span>}
      {iconEnd && <Icon name={iconEnd} size={iconSize} />}
    </>
  );
  return href ? (
    <a href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {inner}
    </a>
  ) : (
    <button type={type ?? "button"} className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}

/* ───────── SplitCTA: label + separate ↗ cell (block layout) ───────── */

export type SplitCTAProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** "primary" = Electric label + darker ↗ cell; "ghost" = 1 px frame. */
  variant?: "primary" | "ghost";
  icon?: IconName;
  className?: string;
};

export function SplitCTA({ children, href, onClick, variant = "primary", icon = "arrow-up-right", className }: SplitCTAProps) {
  const body = (
    <>
      <PrimitiveStyles />
      <span className="ts-cta-label">{children}</span>
      <span className="ts-cta-arrow" aria-hidden="true">
        <Icon name={icon} size={16} />
      </span>
    </>
  );
  const cls = cx("ts-cta", `is-${variant}`, className);
  return href ? (
    <a href={href} className={cls} onClick={onClick}>
      {body}
    </a>
  ) : (
    <button type="button" className={cls} onClick={onClick}>
      {body}
    </button>
  );
}

/* ───────── Pill / Chip ───────── */

export type PillProps = {
  children: React.ReactNode;
  selected?: boolean;
  /** A count shown as a sub-pill (white 20 % when selected). */
  count?: number | string;
  icon?: IconName;
  /** Makes it a toggle button (aria-pressed). Without it the pill is static. */
  onClick?: () => void;
  size?: "sm" | "md";
  className?: string;
  title?: string;
};

export function Pill({ children, selected = false, count, icon, onClick, size = "md", className, title }: PillProps) {
  const cls = cx("ts-pill", `is-${size}`, selected && "is-selected", onClick && "is-interactive", className);
  const inner = (
    <>
      <PrimitiveStyles />
      {icon && <Icon name={icon} size={14} />}
      <span>{children}</span>
      {count != null && <span className="ts-pill-n">{count}</span>}
    </>
  );
  return onClick ? (
    <button type="button" className={cls} aria-pressed={selected} onClick={onClick} title={title}>
      {inner}
    </button>
  ) : (
    <span className={cls} title={title}>
      {inner}
    </span>
  );
}

/* ───────── Tabs (tabs | segmented) ───────── */

export type TabItem<V extends string> = { value: V; label: React.ReactNode; icon?: IconName; count?: number | string; disabled?: boolean };
export type TabsProps<V extends string> = {
  items: TabItem<V>[];
  value: V;
  onChange: (value: V) => void;
  /** "tabs" = tablist (switches a view), "segmented" = radiogroup (picks an option). */
  variant?: "tabs" | "segmented";
  label: string;
  className?: string;
  size?: "sm" | "md";
};

export function Tabs<V extends string>({ items, value, onChange, variant = "tabs", label, className, size = "md" }: TabsProps<V>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
  const move = (from: number, dir: 1 | -1 | "first" | "last") => {
    const pos = enabled.indexOf(from);
    const next =
      dir === "first" ? enabled[0] : dir === "last" ? enabled[enabled.length - 1] : enabled[(pos + (dir as number) + enabled.length) % enabled.length];
    if (next == null) return;
    onChange(items[next].value);
    refs.current[next]?.focus();
  };
  const seg = variant === "segmented";
  // Roving focus needs exactly one tabbable tab, even when `value` matches none (or a disabled one).
  const current = items.findIndex((it) => it.value === value && !it.disabled);
  const tabbable = current >= 0 ? current : (enabled[0] ?? -1);
  return (
    <div className={cx("ts-tabs", `is-${variant}`, `is-${size}`, className)} role={seg ? "radiogroup" : "tablist"} aria-label={label}>
      <PrimitiveStyles />
      {items.map((it, i) => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role={seg ? "radio" : "tab"}
            aria-checked={seg ? on : undefined}
            aria-selected={seg ? undefined : on}
            tabIndex={i === tabbable ? 0 : -1}
            disabled={it.disabled}
            className={cx("ts-tab", on && "is-selected")}
            onClick={() => onChange(it.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), move(i, 1));
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), move(i, -1));
              else if (e.key === "Home") (e.preventDefault(), move(i, "first"));
              else if (e.key === "End") (e.preventDefault(), move(i, "last"));
            }}
          >
            {it.icon && <Icon name={it.icon} size={14} />}
            <span>{it.label}</span>
            {it.count != null && <span className="ts-pill-n">{it.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ───────── Badge ───────── */

export type StatusTone = "running" | "needs-you" | "error" | "done" | "idle";
export type BadgeTone = "neutral" | "blue" | "green" | "amber" | "red" | "violet" | "cat-1" | "cat-2" | "cat-3" | "cat-4" | StatusTone;
/** Status badges show their icon unless one is given (icon coverage rule). */
export const STATUS_ICON: Record<StatusTone, IconName> = {
  running: "play",
  "needs-you": "circle-help",
  error: "x",
  done: "check",
  idle: "hourglass",
};

export function Badge({ children, tone = "neutral", icon, className }: { children: React.ReactNode; tone?: BadgeTone; icon?: IconName; className?: string }) {
  const glyph = icon ?? (tone in STATUS_ICON ? STATUS_ICON[tone as StatusTone] : undefined);
  return (
    <span className={cx("ts-badge", `is-${tone}`, className)}>
      <PrimitiveStyles />
      {glyph && <Icon name={glyph} size={14} />}
      {children}
    </span>
  );
}

/* ───────── IconTile ───────── */

export type IconTileTone = "neutral" | "accent" | "electric" | "cat-1" | "cat-2" | "cat-3" | "cat-4" | "folder" | StatusTone;
/** Figma IconTile (40:207752): S 22 / M 32 / L 48 with 14 / 18 / 26 px glyphs; 16 / 20 / 24 kept for dense rows. */
const TILE: Record<string, [number, number]> = { S: [22, 14], M: [32, 18], L: [48, 26], 16: [16, 11], 20: [20, 13], 24: [24, 15], 32: [32, 18] };
/**
 * Coloured rounded square with an icon — menus, cards, side peek, collections
 * (owner 2026-11-12). Colour comes from the category / status tokens; one
 * radius token (--ts-radius-tile). tone="folder" shows the solid yellow folder.
 */
export function IconTile({
  icon,
  tone = "neutral",
  size = 24,
  label,
  className,
}: {
  icon: IconName;
  tone?: IconTileTone;
  size?: "S" | "M" | "L" | 16 | 20 | 24 | 32;
  label?: string;
  className?: string;
}) {
  const folder = tone === "folder";
  const [px, glyph] = TILE[String(size)] ?? TILE.M;
  return (
    <span
      className={cx("ts-tile", `is-${tone}`, className)}
      style={{ ["--ts-tile-size" as string]: `${px}px` }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <PrimitiveStyles />
      <Icon name={folder ? "folder" : icon} variant={folder ? "filled" : "line"} size={folder ? px : glyph} />
    </span>
  );
}

/* ───────── Card ───────── */

export type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "section" | "li" | "a";
  href?: string;
  padding?: "none" | "sm" | "md" | "lg";
  /** Hover lift + pointer (for clickable cards). */
  interactive?: boolean;
  selected?: boolean;
  /** Square corners and no gap — the block layout's cell. */
  block?: boolean;
};
export function Card({ as: Tag = "div", padding = "md", interactive, selected, block, className, children, ...rest }: CardProps) {
  return (
    <Tag
      {...(rest as React.HTMLAttributes<HTMLElement>)}
      className={cx("ts-card", `is-pad-${padding}`, interactive && "is-interactive", selected && "is-selected", block && "is-block", className)}
    >
      <PrimitiveStyles />
      {children}
    </Tag>
  );
}

/* ───────── Text ───────── */

export type TextVariant = "display" | "h1" | "h2" | "h3" | "body-lg" | "body" | "small" | "label" | "mono" | "caption";
const TEXT_TAG: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  "body-lg": "p",
  body: "p",
  small: "p",
  label: "span",
  mono: "code",
  caption: "span",
};
export function Text({
  variant = "body",
  as,
  tone,
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { variant?: TextVariant; as?: keyof React.JSX.IntrinsicElements; tone?: "default" | "muted" | "faint" | "accent" }) {
  const Tag = (as ?? TEXT_TAG[variant]) as React.ElementType;
  return (
    <Tag {...rest} className={cx("ts-text", `is-${variant}`, tone && tone !== "default" && `is-${tone}`, className)}>
      <PrimitiveStyles />
      {children}
    </Tag>
  );
}

import { PRIMITIVES_CSS, STATUSES } from "./primitives-css";
export { PRIMITIVES_CSS, STATUSES };

let href: string | undefined;
/** Injects PRIMITIVES_CSS once (React 19 hoists and dedupes by href). */
export function PrimitiveStyles() {
  if (!href) {
    let h = 0;
    for (let i = 0; i < PRIMITIVES_CSS.length; i++) h = (Math.imul(h, 31) + PRIMITIVES_CSS.charCodeAt(i)) | 0;
    href = `ts-ui-${(h >>> 0).toString(36)}`;
  }
  return (
    <style href={href} precedence="default">
      {PRIMITIVES_CSS}
    </style>
  );
}
