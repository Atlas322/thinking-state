/**
 * site.css — the same Thinking State tokens for a whole page (the marketing site),
 * generated from tokens.css so there is one source:
 *  - cream on :root, dark (Чиглэл 2) on :root[data-theme="dark"] / :root.dark,
 *    with no wrapper element needed; data-ts-theme still works;
 *  - a stable alias layer (--ts-color-*, --ts-font-*) that the site uses, so
 *    internal token renames never reach it;
 *  - body background, text colour and font.
 * Regenerate with `npm run tokens:site` (src/lib/site.test.ts checks it).
 * No imports: scripts/site-css.mjs runs this file with Node's type stripping.
 */

const CREAM = ':where(.ts-theme-cream, [data-ts-theme="cream"]) {';
const DARK = ':where(.ts-theme-dark, [data-ts-theme="dark"], .ts-theme-manage, [data-ts-theme="manage"]) {';

/** Stable names for sites: semantic role → Thinking State token. */
export const SITE_ALIASES: Record<string, string> = {
  "--ts-color-bg": "--ts-page",
  "--ts-color-side": "--ts-side",
  "--ts-color-rail": "--ts-rail",
  "--ts-color-surface": "--ts-surface",
  "--ts-color-raised": "--ts-raised",
  "--ts-color-tile": "--ts-tile-ochre",
  "--ts-color-line": "--ts-line",
  "--ts-color-text": "--ts-fg",
  "--ts-color-text-muted": "--ts-muted",
  "--ts-color-text-faint": "--ts-faint",
  "--ts-color-accent": "--ts-accent",
  "--ts-color-accent-text": "--ts-accent-fg",
  "--ts-color-accent-soft": "--ts-accent-soft",
  "--ts-color-electric": "--ts-electric",
  "--ts-color-accent-strong": "--ts-accent-strong",
  "--ts-color-folder": "--ts-folder",
  "--ts-color-link": "--ts-link",
  "--ts-color-amber": "--ts-amber",
  "--ts-color-amber-soft": "--ts-amber-soft",
  "--ts-color-green": "--ts-green",
  "--ts-color-red": "--ts-red",
  "--ts-shadow": "--ts-elevation",
  "--ts-font-heading": "--ts-font-display",
  "--ts-font-text": "--ts-font",
  "--ts-font-label": "--ts-font-mono",
};

export function siteCss(tokens: string): string {
  tokens = tokens.split("\r\n").join("\n");
  if (!tokens.includes(CREAM) || !tokens.includes(DARK)) throw new Error("tokens.css theme selectors changed: update src/lib/site-css.ts");
  const body = tokens
    .replace(CREAM, ':where(:root, .ts-theme-cream, [data-ts-theme="cream"]) {')
    .replace(DARK, ':where(:root[data-theme="dark"], :root.dark, .ts-theme-dark, [data-ts-theme="dark"], .ts-theme-manage, [data-ts-theme="manage"]) {');
  const aliases = Object.entries(SITE_ALIASES)
    .map(([k, v]) => `  ${k}: var(${v});`)
    .join("\n");
  return `/*
 * @inai/thinking-state/site.css — GENERATED from tokens.css (npm run tokens:site).
 * Thinking State tokens for a whole page: cream on :root, dark (Чиглэл 2) on
 * :root[data-theme="dark"]; one Electric accent; status triads --ts-status-*.
 * Use the --ts-color-* / --ts-font-heading|text|label names below: they are the stable contract.
 */
${body.replace(/^\/\*[\s\S]*?\*\/\n/, "")}
/* Stable aliases (declared wherever a theme or mode is, so they follow it). */
:where(:root, [data-theme="dark"], [data-ts-theme], [data-ts-mode]) {
${aliases}
}

:where(body) {
  background: var(--ts-page);
  color: var(--ts-fg);
  font-family: var(--ts-font);
}
`;
}
