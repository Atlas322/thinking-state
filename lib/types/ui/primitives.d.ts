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
import { type IconName } from "../company/icons";
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
export type ButtonProps = ButtonOwn & Omit<React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwn>;
export declare function Button({ variant, size, icon, iconEnd, href, block, className, children, type, ...rest }: ButtonProps): React.JSX.Element;
export type SplitCTAProps = {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    /** "primary" = Electric label + darker ↗ cell; "ghost" = 1 px frame. */
    variant?: "primary" | "ghost";
    icon?: IconName;
    className?: string;
};
export declare function SplitCTA({ children, href, onClick, variant, icon, className }: SplitCTAProps): React.JSX.Element;
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
export declare function Pill({ children, selected, count, icon, onClick, size, className, title }: PillProps): React.JSX.Element;
export type TabItem<V extends string> = {
    value: V;
    label: React.ReactNode;
    icon?: IconName;
    count?: number | string;
    disabled?: boolean;
};
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
export declare function Tabs<V extends string>({ items, value, onChange, variant, label, className, size }: TabsProps<V>): React.JSX.Element;
export type StatusTone = "running" | "needs-you" | "error" | "done" | "idle";
export type BadgeTone = "neutral" | "blue" | "green" | "amber" | "red" | "violet" | "cat-1" | "cat-2" | "cat-3" | "cat-4" | StatusTone;
/** Status badges show their icon unless one is given (icon coverage rule). */
export declare const STATUS_ICON: Record<StatusTone, IconName>;
export declare function Badge({ children, tone, icon, className }: {
    children: React.ReactNode;
    tone?: BadgeTone;
    icon?: IconName;
    className?: string;
}): React.JSX.Element;
export type IconTileTone = "neutral" | "accent" | "electric" | "cat-1" | "cat-2" | "cat-3" | "cat-4" | "folder" | StatusTone;
/**
 * Coloured rounded square with an icon — menus, cards, side peek, collections
 * (owner 2026-11-12). Colour comes from the category / status tokens; one
 * radius token (--ts-radius-tile). tone="folder" shows the solid yellow folder.
 */
export declare function IconTile({ icon, tone, size, label, className, }: {
    icon: IconName;
    tone?: IconTileTone;
    size?: "S" | "M" | "L" | 16 | 20 | 24 | 32;
    label?: string;
    className?: string;
}): React.JSX.Element;
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
export declare function Card({ as: Tag, padding, interactive, selected, block, className, children, ...rest }: CardProps): React.JSX.Element;
export type TextVariant = "display" | "h1" | "h2" | "h3" | "body-lg" | "body" | "small" | "label" | "mono" | "caption";
export declare function Text({ variant, as, tone, className, children, ...rest }: React.HTMLAttributes<HTMLElement> & {
    variant?: TextVariant;
    as?: keyof React.JSX.IntrinsicElements;
    tone?: "default" | "muted" | "faint" | "accent";
}): React.JSX.Element;
import { PRIMITIVES_CSS, STATUSES } from "./primitives-css";
export { PRIMITIVES_CSS, STATUSES };
/** Injects PRIMITIVES_CSS once (React 19 hoists and dedupes by href). */
export declare function PrimitiveStyles(): React.JSX.Element;
