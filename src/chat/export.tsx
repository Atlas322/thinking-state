import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chatRuntimeSource } from "./runtime";
import { chatWidgetFor } from "./widgets";

export type ChatHtmlOptions = {
  /** "auto" follows prefers-color-scheme; "light" or "dark" pins it. */
  theme?: "auto" | "light" | "dark";
  /** Fragment (no doctype/html/head/body) for hosts that inject markup. */
  fragment?: boolean;
  title?: string;
};

const escapeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
const escapeText = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const shell = `.cw-wrap{padding:12px;display:flex;justify-content:center}.cw-wrap>*{margin:0 auto}`;

/**
 * Renders a chat widget to one self-contained HTML string: static markup,
 * the widget's own CSS, the JSON it was rendered from and a ~3 KB script
 * that restores theme, count-up, view switch, toggles and chat actions.
 */
export async function renderChatHtml(
  slug: string,
  props?: Record<string, unknown>,
  options: ChatHtmlOptions = {},
) {
  const widget = chatWidgetFor(slug);
  if (!widget) throw new Error(`Unknown chat widget: ${slug}`);
  const { Component, demo } = await widget.load();
  const data = props ?? demo;
  const markup = renderToStaticMarkup(
    createElement(Component, { ...data, ...widget.staticProps?.(data) }),
  );
  const theme = options.theme ?? "auto";
  const pinned = theme === "auto" ? "" : ` data-cw-theme="${theme}"`;
  const body =
    `<style>${shell}</style>` +
    `<div class="cw-wrap">${markup.replace(/data-cw-root="([^"]+)"/, `data-cw-root="$1"${pinned}`)}</div>` +
    `<script type="application/json" data-cw-props="${slug}">${escapeJson(data)}</script>` +
    `<script>${chatRuntimeSource}</script>`;
  if (options.fragment) return body;
  const title = escapeText(options.title ?? slug.replace(/-/g, " "));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="generator" content="Thinking State chat widget: ${slug}">
<title>${title}</title>
<style>html{color-scheme:${theme === "auto" ? "light dark" : theme}}body{margin:0;background:Canvas;font-family:Inter,system-ui,sans-serif}</style>
</head>
<body>
${body}
</body>
</html>
`;
}
