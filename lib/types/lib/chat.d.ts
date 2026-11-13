/**
 * @inai/thinking-state/chat — render a chat widget from JSON to one-file
 * HTML (static markup + CSS + data + a ~3 KB runtime). Uses react-dom/server.
 */
export { renderChatHtml } from "../chat/export";
export type { ChatHtmlOptions } from "../chat/export";
export { chatRuntime, chatRuntimeSource } from "../chat/runtime";
export { chatWidgets, chatWidgetFor } from "../chat/widgets";
export type { ChatWidget } from "../chat/widgets";
export { chatWidgetSchemas, schemaFor } from "../chat/schema";
export type { FieldSpec, WidgetSchema } from "../chat/schema";
