import { useEffect, useMemo, useState, type ComponentType } from "react";
import { chatWidgetFor } from "./widgets";

type Loaded = {
  Component: ComponentType<Record<string, unknown>>;
  demo: Record<string, unknown>;
};

/**
 * Catalog glue for chat widgets: loads the widget, keeps its JSON props as
 * editable text, and exports the current data as one-file HTML.
 */
export function useChatWidget(slug: string | undefined) {
  const widget = slug ? chatWidgetFor(slug) : undefined;
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [json, setJson] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setLoaded(null);
    setJson("");
    if (!widget) return;
    let alive = true;
    widget.load().then((m) => {
      if (!alive) return;
      setLoaded(m);
      setJson(JSON.stringify(m.demo, null, 2));
    });
    return () => {
      alive = false;
    };
  }, [widget]);
  const parsed = useMemo(() => {
    if (!json) return { data: null, error: "" };
    try {
      const data = JSON.parse(json);
      if (!data || typeof data !== "object" || Array.isArray(data))
        return { data: null, error: "Props must be a JSON object." };
      return { data: data as Record<string, unknown>, error: "" };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [json]);
  const [lastGood, setLastGood] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    if (parsed.data) setLastGood(parsed.data);
  }, [parsed.data]);
  useEffect(() => setLastGood(null), [slug]);

  const exportHtml = async () => {
    if (!widget || !slug) return;
    setBusy(true);
    try {
      const { renderChatHtml } = await import("./export");
      const html = await renderChatHtml(slug, parsed.data ?? lastGood ?? undefined, {
        title: slug.replace(/-/g, " "),
      });
      const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.html`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return html;
    } finally {
      setBusy(false);
    }
  };

  return {
    isChat: !!widget,
    ready: !!loaded,
    Component: loaded?.Component ?? null,
    props: parsed.data ?? lastGood ?? loaded?.demo ?? null,
    json,
    setJson,
    error: parsed.error,
    reset: () => loaded && setJson(JSON.stringify(loaded.demo, null, 2)),
    exportHtml,
    busy,
  };
}

export type ChatWidgetState = ReturnType<typeof useChatWidget>;

export function ChatPreview({ chat }: { chat: ChatWidgetState }) {
  const { Component, props } = chat;
  if (!Component || !props) return null;
  return <Component {...props} />;
}

export function ChatDataEditor({ chat }: { chat: ChatWidgetState }) {
  return (
    <div className="chat-data">
      <div className="chat-data-bar">
        <span>
          Props as JSON. Edit and switch to Preview, or export with{" "}
          <strong>Use in chat</strong>.
        </span>
        <button type="button" className="text-button" onClick={chat.reset}>
          Reset to demo
        </button>
      </div>
      <textarea
        className="chat-data-input"
        aria-label="Widget props as JSON"
        spellCheck={false}
        value={chat.json}
        onChange={(e) => chat.setJson(e.target.value)}
      />
      <div className="chat-data-status" role="status" aria-live="polite">
        {chat.error
          ? `JSON error: ${chat.error}. The preview keeps the last valid data.`
          : "Edits show in Preview and in the exported HTML."}
      </div>
    </div>
  );
}
