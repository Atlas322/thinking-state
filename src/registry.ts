import { lazy } from "react";
import data from "./catalog.json";

export type CatalogEntry = (typeof data)[number];
export const catalog: CatalogEntry[] = data;
export const categories = [
  "Chat widgets",
  "Agents",
  "Chat",
  "Inputs",
  "Data display",
  "Navigation",
  "Feedback",
  "Cards",
  "Buttons",
  "Social",
];
/** Social = content output (not chat UI). Subtypes: Post · Carousel · Thumbnail · Story/Poster. */
export const socialSubtypes = ["Post", "Carousel", "Thumbnail", "Story/Poster"] as const;
const modules = import.meta.glob<{ default: React.ComponentType }>(
  "./library/*.tsx",
);
const sourceModules = import.meta.glob<string>("./library/*.tsx", {
  query: "?raw",
  import: "default",
});
const previews = Object.fromEntries(
  Object.entries(modules).map(([path, loader]) => [path, lazy(loader)]),
);
export function hasClassic(entry: CatalogEntry) {
  return !entry.pro || entry.slug === "thinking-state";
}
export function fileFor(entry: CatalogEntry, style: string) {
  return `${entry.slug}${style === "classic" && hasClassic(entry) ? "-classic" : ""}.tsx`;
}
export function previewFor(entry: CatalogEntry, style: string) {
  return previews[`./library/${fileFor(entry, style)}`];
}
export async function sourceFor(entry: CatalogEntry, style: string) {
  return sourceModules[`./library/${fileFor(entry, style)}`]();
}
export function usageFor(entry: CatalogEntry, style: string) {
  return entry.usage.replaceAll(
    `./${entry.slug}"`,
    `./${fileFor(entry, style).replace(".tsx", "")}"`,
  );
}
export function buildPrompt(
  entry: CatalogEntry,
  style: string,
  source: string,
) {
  return `Add the ${entry.name} React component to my project using the complete source below.\n\nWhat it does: ${entry.description}\n\nImplementation instructions:\n- Save this as ${fileFor(entry, style)} in the appropriate components folder.\n- Requires React 19 and TypeScript. CSS is included in the file; no Tailwind or animation package is required.\n- Keep the component’s visual design, keyboard interactions, dark mode, and reduced-motion behavior.\n- Use the named ${entry.exportName} export for application integration. The default export is a working example where provided.\n- Replace demo data with my application data and connect callbacks to real handlers. UI demonstrations do not execute backend actions by themselves.\n- Use an ancestor with className="dark" or data-theme="dark" for dark mode. Inter is optional; system fonts are supported.\n- Preserve any MIT license notice included in this source.\n- ${"origin" in entry ? "This is an original Component Studio component; colours follow the Studio tokens (tokens/tokens.json)." : "source" in entry ? `Source: ${entry.source} (MIT + Commons Clause). Keep its license notice; install the npm dependency named in the file header.` : entry.pro ? "This is an independent recreation based on public behavior, not the paid affectUI source. Its API and details may differ from the original." : "This includes the original MIT-licensed affectUI component plus a local example."}\n- Ask only for missing product requirements; do not require access to a private repository or an affectUI Pro key.\n\nExample usage:\n\n\`\`\`tsx\n${usageFor(entry, style)}\n\`\`\`\n\nComplete component source:\n\n\`\`\`tsx\n${source}\n\`\`\`\n`;
}
