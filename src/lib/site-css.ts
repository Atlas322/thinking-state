/**
 * site.css — the same Theme А tokens for a whole page (the marketing site),
 * generated from tokens.css so there is one source:
 *  - cream on :root, warm night on :root[data-theme="dark"] / :root.dark,
 *    with no wrapper element needed; data-ts-theme / data-ts-mode still work;
 *  - a stable alias layer (--ts-color-*, --ts-font-*) that the site uses, so
 *    internal token renames never reach it;
 *  - body background, text colour and font.
 * Regenerate with `npm run tokens:site` (src/lib/site.test.ts checks it).
 * No imports: scripts/site-css.mjs runs this file with Node's type stripping.
 */

const CREAM = ':where(.ts-theme-cream, [data-ts-theme="cream"]) {';
const NIGHT = ':where(.ts-theme-night, [data-ts-theme="night"], [data-ts-theme="dark"], .ts-theme-manage, [data-ts-theme="manage"]) {';

/** Stable names for sites: semantic role → Thinking State token. */
export const SITE_ALIASES: Record<string, string> = {
  "--ts-color-bg": "--ts-page",
  "--ts-color-side": "--ts-side",
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
  "--ts-color-indigo": "--ts-indigo",
  "--ts-color-link": "--ts-link",
  "--ts-color-amber": "--ts-amber",
  "--ts-color-amber-soft": "--ts-amber-soft",
  "--ts-color-green": "--ts-green",
  "--ts-color-red": "--ts-red",
  "--ts-shadow": "--ts-elevation",
  "--ts-shadow-glow": "--ts-glow",
  "--ts-shadow-glow-amber": "--ts-glow-amber",
};

export function siteCss(tokens: string): string {
  tokens = tokens.split("\r\n").join("\n");
  if (!tokens.includes(CREAM) || !tokens.includes(NIGHT)) throw new Error("tokens.css theme selectors changed: update src/lib/site-css.ts");
  const body = tokens
    .replace(CREAM, ':where(:root, .ts-theme-cream, [data-ts-theme="cream"]) {')
    .replace(NIGHT, ':where(:root[data-theme="dark"], :root.dark, .ts-theme-night, [data-ts-theme="night"], [data-ts-theme="dark"], .ts-theme-manage, [data-ts-theme="manage"]) {');
  const aliases = Object.entries(SITE_ALIASES)
    .map(([k, v]) => `  ${k}: var(${v});`)
    .join("\n");
  return `/*
 * @inai/thinking-state/site.css — GENERATED from tokens.css (npm run tokens:site).
 * Theme А for a whole page: cream on :root, warm night on
 * :root[data-theme="dark"]; Удирдах accent with data-ts-mode="manage".
 * Use the --ts-color-* / --ts-font-* names below: they are the stable contract.
 */
${body.replace(/^\/\*[\s\S]*?\*\/\n/, "")}
/* Stable aliases (declared wherever a theme or mode is, so they follow it). */
:where(:root, [data-theme="dark"], [data-ts-theme], [data-ts-mode]) {
${aliases}
}

:where(body) {
  background: var(--ts-page);
  color: var(--ts-fg);
  font-family: var(--ts-font-body);
  font-size: var(--ts-fs-body);
  line-height: var(--ts-lh-body);
}
`;
}
