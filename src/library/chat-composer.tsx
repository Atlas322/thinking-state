"use client";

import * as React from "react";

/** Independent implementation of the documented public behavior. */
export type ChatModel = {
  id: string;
  name: string;
  description?: string;
  logo?: React.ReactNode;
};
export type ChatApp = { id: string; name: string; logo?: React.ReactNode };
export type ChatComposerProps = {
  placeholder?: string;
  models?: ChatModel[];
  loadMs?: number;
  dictation?: string;
  onSend?: (message: string, details: { model: string }) => void;
  onModelChange?: (model: ChatModel) => void;
  onAttach?: () => void;
  onRequestApproval?: () => void | Promise<void>;
  folders?: string[];
  folder?: string;
  onFolderChange?: (folder: string | null) => void;
  apps?: ChatApp[];
  connectedApps?: string[];
  onAppsChange?: (connected: string[]) => void;
  className?: string;
};
const defaultModels: ChatModel[] = [
  { id: "auto", name: "Автомат", description: "Даалгаварт тохирох загварыг сонгоно" },
  {
    id: "claude",
    name: "Нягт загвар",
    description: "Гүнзгий бодож, сайн бичнэ",
  },
  {
    id: "chatgpt",
    name: "Түргэн загвар",
    description: "Өдөр тутмын ажилд уян хатан",
  },
];
const defaultApps: ChatApp[] = [
  { id: "gmail", name: "Имэйл" },
  { id: "slack", name: "Багийн чат" },
  { id: "clickup", name: "Даалгаврын самбар" },
];
const defaultFolders = ["Хувийн", "Бүтээгдэхүүн", "Маркетинг", "Хөгжүүлэлт"];
const initialConnections = ["gmail"];

type GlyphName =
  | "plus"
  | "down"
  | "arrow"
  | "mic"
  | "check"
  | "close"
  | "folder"
  | "hand"
  | "bolt"
  | "wave";
function Glyph({ name }: { name: GlyphName }) {
  const paths: Record<GlyphName, React.ReactNode> = {
    plus: <path d="M8 3v10M3 8h10" />,
    down: <path d="m5 6 3 3 3-3" />,
    arrow: <path d="M8 13V3m-4 4 4-4 4 4" />,
    mic: (
      <>
        <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
        <path d="M3 7v.5a5 5 0 0 0 10 0V7M8 12.5v2M5.5 14.5h5" />
      </>
    ),
    check: <path d="m3 8 3 3 7-7" />,
    close: <path d="m4 4 8 8m0-8-8 8" />,
    folder: (
      <path d="M2 4.5V3a1 1 0 0 1 1-1h3l2 2h5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z" />
    ),
    hand: (
      <path d="M4 8V4.5a1 1 0 0 1 2 0V7 2.5a1 1 0 0 1 2 0V7 2a1 1 0 0 1 2 0v5-3a1 1 0 0 1 2 0v5l1-1a1.1 1.1 0 0 1 1.5 1.6L11 14H6L2 9a1.1 1.1 0 0 1 1.7-1.4L5 9" />
    ),
    bolt: <path d="m9 1-6 8h4l-1 6 7-9H9Z" />,
    wave: <path d="M2 6v4m3-7v10m3-8v6m3-9v12m3-8v4" />,
  };
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
function AppMark({ app }: { app: ChatApp }) {
  if (app.logo) return <span className="cc-app-mark">{app.logo}</span>;
  const colors: Record<string, string> = {
    gmail: "#e66b63",
    slack: "#6da9a6",
    clickup: "#a080da",
  };
  return (
    <span
      className="cc-app-mark"
      style={{ color: colors[app.id] ?? "var(--cc-muted)" }}
      aria-hidden="true"
    >
      {app.id === "gmail" ? (
        <svg viewBox="0 0 16 16">
          <path d="M1.5 4.2v8.3h2.6V7.3L8 10.2l3.9-2.9v5.2h2.6V4.2L8 9Z" fill="#ea4335" />
          <path d="M1.5 4.2 4.1 6.1v6.4H1.5Z" fill="#4285f4" /><path d="M14.5 4.2 11.9 6.1v6.4h2.6Z" fill="#34a853" />
          <path d="M11.9 3.2 14.5 4.2 11.9 6.1Z" fill="#fbbc04" />
        </svg>
      ) : app.id === "slack" ? (
        <svg viewBox="0 0 16 16">
          <rect x="1" y="6" width="6" height="2.4" rx="1.2" fill="#36c5f0" />
          <rect x="6.6" y="1" width="2.4" height="6" rx="1.2" fill="#2eb67d" />
          <rect x="9" y="7.6" width="6" height="2.4" rx="1.2" fill="#ecb22e" />
          <rect x="7" y="9" width="2.4" height="6" rx="1.2" fill="#e01e5a" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16">
          <path d="m3 6.5 5-4 5 4" stroke="#ff4f8b" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 10.5q5 5 10 0" stroke="#7b68ee" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

type MenuItem = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
};
function Picker({
  label,
  children,
  items,
  multiple = false,
  align = "left",
  onPick,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  items: MenuItem[];
  multiple?: boolean;
  align?: "left" | "right";
  onPick: (id: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);
  const [below, setBelow] = React.useState(false);
  const button = React.useRef<HTMLButtonElement>(null);
  const popup = React.useRef<HTMLDivElement>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const id = React.useId();
  const close = (restore = true) => {
    setOpen(false);
    if (restore) button.current?.focus();
  };
  const show = (last = false) => {
    const rect = button.current?.getBoundingClientRect();
    const height = Math.min(items.length * 48 + 16, 280);
    setBelow(
      Boolean(
        rect &&
        rect.top < height &&
        window.innerHeight - rect.bottom > rect.top,
      ),
    );
    setHighlight(
      last
        ? Math.max(0, items.length - 1)
        : Math.max(
            0,
            items.findIndex((item) => item.selected),
          ),
    );
    setOpen(true);
  };
  React.useEffect(() => {
    if (open) popup.current?.focus();
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        close(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  const choose = (index: number) => {
    const item = items[index];
    if (!item) return;
    onPick(item.id);
    if (!multiple) close();
  };
  return (
    <div
      className={`cc-picker ${className}`}
      ref={root}
      data-align={align}
      data-below={below}
    >
      <button
        ref={button}
        type="button"
        className="cc-picker-trigger"
        aria-label={label}
        aria-haspopup={multiple ? "menu" : "listbox"}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            show(event.key === "ArrowUp");
          }
        }}
      >
        {children}
      </button>
      {open && (
        <div
          ref={popup}
          id={id}
          role={multiple ? "menu" : "listbox"}
          aria-label={label}
          aria-activedescendant={
            items.length ? `${id}-${highlight}` : undefined
          }
          className="cc-menu"
          tabIndex={0}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              close(false);
          }}
          onKeyDown={(event) => {
            const max = items.length - 1;
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              setHighlight((current) =>
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? max
                    : event.key === "ArrowDown"
                      ? (current + 1) % Math.max(1, items.length)
                      : (current - 1 + items.length) %
                        Math.max(1, items.length),
              );
            }
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              choose(highlight);
            }
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              close();
            }
            if (event.key === "Tab") {
              close();
            }
          }}
        >
          <span className="cc-menu-heading">{label}</span>
          {items.map((item, index) => (
            <div
              key={item.id}
              id={`${id}-${index}`}
              role={multiple ? "menuitemcheckbox" : "option"}
              aria-checked={multiple ? Boolean(item.selected) : undefined}
              aria-selected={!multiple ? Boolean(item.selected) : undefined}
              className="cc-menu-row"
              data-highlighted={highlight === index}
              onPointerMove={() => setHighlight(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              {item.icon}
              <span>
                <strong>{item.label}</strong>
                {item.description && <small>{item.description}</small>}
              </span>
              {item.selected && <Glyph name="check" />}
            </div>
          ))}
          {!items.length && (
            <p className="cc-menu-empty">Сонголт алга</p>
          )}
        </div>
      )}
    </div>
  );
}

export function ChatComposer({
  placeholder = "Бичиж эхлээрэй…",
  models = defaultModels,
  loadMs = 1300,
  dictation = "Энэ долоо хоногт юу гаргасан тухай багт товч мэдээ бичээрэй.",
  onSend,
  onModelChange,
  onAttach,
  onRequestApproval,
  folders = defaultFolders,
  folder,
  onFolderChange,
  apps = defaultApps,
  connectedApps = initialConnections,
  onAppsChange,
  className = "",
}: ChatComposerProps) {
  const [message, setMessage] = React.useState("");
  const [modelId, setModelId] = React.useState(models[0]?.id ?? "auto");
  const [currentFolder, setCurrentFolder] = React.useState<string | null>(
    folder ?? null,
  );
  const [connections, setConnections] = React.useState(connectedApps);
  const [approval, setApproval] = React.useState<
    "idle" | "loading" | "granted"
  >("idle");
  const [approvalError, setApprovalError] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const [wordsHeard, setWordsHeard] = React.useState(0);
  const [files, setFiles] = React.useState<File[]>([]);
  const [notice, setNotice] = React.useState("");
  const textarea = React.useRef<HTMLTextAreaElement>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const voiceButton = React.useRef<HTMLButtonElement>(null);
  const mounted = React.useRef(true);
  const approvalTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const words = React.useMemo(
    () => dictation.trim().split(/\s+/).filter(Boolean),
    [dictation],
  );
  const selectedModel =
    models.find((model) => model.id === modelId) ?? models[0];
  React.useEffect(() => {
    setCurrentFolder(folder ?? null);
  }, [folder]);
  React.useEffect(() => {
    setConnections(connectedApps);
  }, [connectedApps]);
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (approvalTimer.current) clearTimeout(approvalTimer.current);
    };
  }, []);
  React.useEffect(() => {
    if (!recording) return;
    const timer = setInterval(
      () => setWordsHeard((count) => Math.min(words.length, count + 1)),
      260,
    );
    return () => clearInterval(timer);
  }, [recording, words.length]);
  React.useLayoutEffect(() => {
    const field = textarea.current;
    if (field) {
      field.style.height = "auto";
      field.style.height = `${Math.max(48, Math.min(220, field.scrollHeight))}px`;
    }
  }, [message]);
  const send = () => {
    if (!message.trim() || recording) return;
    const text = message.trim();
    onSend?.(text, { model: selectedModel?.id ?? "auto" });
    setNotice(onSend ? "Мессеж илгээгдлээ" : `Мессеж бэлэн: ${text}`);
    setMessage("");
    setFiles([]);
    textarea.current?.focus();
  };
  const requestApproval = async () => {
    if (approval !== "idle") return;
    setApproval("loading");
    setApprovalError("");
    try {
      await Promise.all([
        Promise.resolve(onRequestApproval?.()),
        new Promise<void>((resolve) => {
          approvalTimer.current = setTimeout(resolve, Math.max(0, loadMs));
        }),
      ]);
      if (mounted.current) {
        setApproval("granted");
        setNotice("Хязгааргүй эрх сонгогдлоо");
      }
    } catch {
      if (approvalTimer.current) {
        clearTimeout(approvalTimer.current);
        approvalTimer.current = null;
      }
      if (mounted.current) {
        setApproval("idle");
        setApprovalError("Зөвшөөрөл авч чадсангүй. Дахин оролдоно уу.");
      }
    }
  };
  const finishVoice = (confirm: boolean) => {
    if (confirm) {
      const transcript = words.slice(0, wordsHeard).join(" ");
      setMessage(
        (text) => `${text}${text && transcript ? " " : ""}${transcript}`,
      );
      setNotice("Дуут бичвэр ноорогт нэмэгдлээ");
    } else setNotice("Бичлэгийг устгалаа");
    setRecording(false);
    setWordsHeard(0);
    (confirm ? textarea.current : voiceButton.current)?.focus();
  };
  return (
    <section
      className={`cc-composer ${className}`}
      aria-label="Мессеж бичих хэсэг"
      onKeyDown={(event) => {
        if (event.key === "Escape" && recording) {
          event.preventDefault();
          finishVoice(false);
        }
      }}
    >
      <style>{css}</style>
      <div
        className="cc-card"
        onClick={(event) => {
          if (event.target === event.currentTarget) textarea.current?.focus();
        }}
      >
        <div className="cc-input-area">
          {recording ? (
            <div
              className="cc-transcript"
              aria-label="Шууд бичвэр"
              aria-live="polite"
            >
              {words.slice(0, wordsHeard).map((word, index) => (
                <span key={index}>{word} </span>
              ))}
              {wordsHeard === 0 && <span>Сонсож байна…</span>}
            </div>
          ) : (
            <textarea
              ref={textarea}
              aria-label="Мессеж"
              rows={1}
              placeholder={placeholder}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  send();
                }
              }}
            />
          )}
        </div>
        {files.length > 0 && (
          <div className="cc-attachments">
            {files.map((file, index) => (
              <span key={`${file.name}-${index}`}>
                {file.name}
                <button
                  type="button"
                  aria-label={`Хасах: ${file.name}`}
                  onClick={() =>
                    setFiles((old) => old.filter((_, i) => i !== index))
                  }
                >
                  <Glyph name="close" />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          ref={fileInput}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            setFiles((old) => [
              ...old,
              ...Array.from(event.target.files ?? []),
            ]);
            event.target.value = "";
          }}
        />
        <div className="cc-toolbar">
          <button
            type="button"
            className="cc-icon-button"
            aria-label="Файл хавсаргах"
            onClick={() => (onAttach ? onAttach() : fileInput.current?.click())}
          >
            <Glyph name="plus" />
          </button>
          {!recording && (
            <button
              type="button"
              className={`cc-approval ${approval}`}
              aria-busy={approval === "loading"}
              disabled={approval !== "idle"}
              onClick={requestApproval}
            >
              <Glyph name={approval === "granted" ? "bolt" : "hand"} />
              <span>
                {approval === "loading"
                  ? "Зөвшөөрөл хүсэж байна…"
                  : approval === "granted"
                    ? "Хязгааргүй эрх"
                    : "Зөвшөөрөл хүсэх"}
              </span>
            </button>
          )}
          <div className="cc-toolbar-space" />
          {recording ? (
            <div className="cc-recording-controls">
              <span className="cc-audio" aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => (
                  <i
                    key={index}
                    style={{
                      animationDelay: `${index * -70}ms`,
                      height: `${5 + ((index * 7) % 15)}px`,
                    }}
                  />
                ))}
              </span>
              <span className="cc-recording-label">Туршилтын дуут бичвэр</span>
              <button
                type="button"
                className="cc-icon-button"
                aria-label="Бичлэгийг устгах"
                onClick={() => finishVoice(false)}
              >
                <Glyph name="close" />
              </button>
              <button
                type="button"
                className="cc-send"
                aria-label="Дуут бичвэрийг ашиглах"
                onClick={() => finishVoice(true)}
              >
                <Glyph name="check" />
              </button>
            </div>
          ) : (
            <>
              <Picker
                label="Загвар сонгох"
                items={models.map((model) => ({
                  id: model.id,
                  label: model.name,
                  description: model.description,
                  selected: model.id === selectedModel?.id,
                  icon: model.logo ?? <Glyph name="bolt" />,
                }))}
                onPick={(id) => {
                  const model = models.find((item) => item.id === id);
                  if (model) {
                    setModelId(id);
                    onModelChange?.(model);
                    setNotice(`${model.name} сонгогдлоо`);
                  }
                }}
              >
                {selectedModel?.logo && <span>{selectedModel.logo}</span>}
                <span>{selectedModel?.name ?? "Автомат"}</span>
                <Glyph name="down" />
              </Picker>
              <button
                type="button"
                ref={voiceButton}
                className="cc-icon-button"
                aria-label="Дуугаар оруулах"
                onClick={() => {
                  setRecording(true);
                  setWordsHeard(0);
                }}
              >
                <Glyph name="mic" />
              </button>
              <button
                type="button"
                className="cc-send"
                aria-label="Мессеж илгээх"
                disabled={!message.trim()}
                onClick={send}
              >
                <Glyph name="arrow" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="cc-bottom-row">
        {folders.length > 0 && (
          <Picker
            label="Хавтас сонгох"
            className="cc-folders"
            items={folders.map((name) => ({
              id: name,
              label: name,
              selected: name === currentFolder,
              icon: <Glyph name="folder" />,
            }))}
            onPick={(name) => {
              const next = name === currentFolder ? null : name;
              setCurrentFolder(next);
              onFolderChange?.(next);
              setNotice(next ? `Хавтас: ${next}` : "Хавтаснаас гарлаа");
            }}
          >
            <span className="cc-folder-ico" aria-hidden="true">
              <svg viewBox="0 0 16 16"><path d="M1.5 4.2c0-.9.7-1.6 1.6-1.6h3l1.4 1.5h5.4c.9 0 1.6.7 1.6 1.6v6.4c0 .9-.7 1.6-1.6 1.6H3.1c-.9 0-1.6-.7-1.6-1.6Z" fill="#3aa0f0" /><path d="M1.5 6.3h13v5.8c0 .9-.7 1.6-1.6 1.6H3.1c-.9 0-1.6-.7-1.6-1.6Z" fill="#5cb8ff" /></svg>
            </span>
            <span className="cc-folder-name" title={currentFolder ?? undefined}>
              {currentFolder ?? "Хавтсанд ажиллах"}
            </span>
          </Picker>
        )}
        {apps.length > 0 && (
          <Picker
            label="Апп холбох"
            className="cc-apps"
            align="right"
            multiple
            items={apps.map((app) => ({
              id: app.id,
              label: app.name,
              description: connections.includes(app.id)
                ? "Холбогдсон"
                : "Холбогдоогүй",
              selected: connections.includes(app.id),
              icon: <AppMark app={app} />,
            }))}
            onPick={(id) => {
              const next = connections.includes(id)
                ? connections.filter((item) => item !== id)
                : [...connections, id];
              setConnections(next);
              onAppsChange?.(next);
              setNotice(
                `${apps.find((app) => app.id === id)?.name ?? id} ${next.includes(id) ? "холбогдлоо" : "салгагдлаа"}`,
              );
            }}
          >
            <span>Апп холбох</span>
            <span className="cc-app-logos">
              {apps.slice(0, 3).map((app) => (
                <AppMark key={app.id} app={app} />
              ))}
            </span>
          </Picker>
        )}
      </div>
      {approvalError && (
        <p role="alert" className="cc-error">
          {approvalError}
        </p>
      )}
      <p role="status" className="cc-notice" aria-live="polite">
        {notice}
      </p>
    </section>
  );
}

const css = `
.cc-composer{--cc-ink:rgba(0,0,0,.88);--cc-tray:#f4f4f5;--cc-muted:rgba(0,0,0,.6);--cc-bg:#fff;--cc-edge:rgba(0,0,0,.08);--cc-hover:rgba(0,0,0,.04);--cc-focus:#5587e9;--cc-shadow:0 0 0 .5px rgba(0,0,0,.08),0 1px 1px -1px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.05);width:100%;max-width:680px;min-width:0;background:var(--cc-tray);border-radius:20px;box-shadow:0 0 0 1px var(--cc-edge);font:400 15px/22px Inter,system-ui,sans-serif;color:var(--cc-ink);container-type:inline-size;text-align:left;isolation:isolate}
:where(.dark,[data-theme=dark]) .cc-composer{--cc-ink:rgba(255,255,255,.88);--cc-tray:#1c1c1e;--cc-muted:rgba(255,255,255,.6);--cc-bg:#252527;--cc-edge:rgba(255,255,255,.08);--cc-hover:rgba(255,255,255,.06);--cc-shadow:0 0 0 .5px rgba(255,255,255,.1),0 1px 3px #0002;color-scheme:dark}
.cc-composer *{box-sizing:border-box}.cc-composer svg{display:block;width:16px;height:16px;flex:none}.cc-composer button,.cc-composer textarea{font:inherit;color:inherit}.cc-composer button{cursor:pointer}.cc-composer button:disabled{cursor:default}.cc-composer :focus-visible{outline:2px solid var(--cc-focus);outline-offset:3px}.cc-card{background:var(--cc-bg);border-radius:20px;box-shadow:0 0 0 1px var(--cc-edge),0 1px 3px rgba(0,0,0,.05);padding:16px 12px 10px;position:relative;cursor:text;transition:box-shadow .2s}.cc-input-area{min-height:48px;padding:0 5px}.cc-input-area textarea{width:100%;min-height:48px;field-sizing:content;max-height:220px;resize:none;background:none;border:0;outline:none;padding:0;line-height:1.65;display:block;caret-color:var(--cc-ink)}.cc-input-area textarea:focus-visible{outline:none}.cc-input-area textarea::placeholder{color:var(--cc-muted)}.cc-toolbar{display:flex;align-items:center;gap:6px;margin-top:6px;min-width:0;cursor:default}.cc-toolbar-space{flex:1;min-width:3px}.cc-icon-button,.cc-send{display:grid;place-items:center;border:0;background:none;border-radius:8px;width:30px;height:30px;padding:0;flex:none;color:var(--cc-muted)!important;transition:background .16s,transform .16s}.cc-icon-button:hover{background:var(--cc-hover);color:var(--cc-ink)!important}.cc-icon-button:active,.cc-send:active{transform:scale(.94)}.cc-send{background:var(--cc-ink);color:var(--cc-bg)!important;border-radius:8px;width:34px;height:34px;margin-left:4px}.cc-send:disabled{background:var(--cc-tray);color:var(--cc-muted)!important;box-shadow:0 0 0 1px var(--cc-edge)}.cc-approval{display:flex;align-items:center;gap:7px;padding:5px 8px;font-size:15px!important;border:0;background:none;border-radius:7px;white-space:nowrap;color:var(--cc-muted)!important;transition:background .2s,color .2s}.cc-approval:hover{background:var(--cc-hover)}.cc-approval svg{width:18px;height:18px}.cc-approval.loading svg{animation:cc-wave .6s ease-in-out infinite}.cc-approval.granted{background:var(--cc-hover);color:var(--cc-ink)!important;animation:cc-appear .25s both}.cc-bottom-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 10px 8px;min-width:0}.cc-picker{position:relative;min-width:0}.cc-picker-trigger{display:flex;align-items:center;gap:6px;border:0;border-radius:7px;background:none;padding:5px 7px;font-size:15px!important;white-space:nowrap;min-width:0;color:var(--cc-muted)!important;max-width:100%}.cc-picker-trigger:hover,.cc-picker-trigger[aria-expanded=true]{background:var(--cc-hover);color:var(--cc-ink)!important}.cc-picker-trigger>span:first-child>svg{width:14px;height:14px}.cc-picker-trigger>svg:last-child{width:14px;height:14px;opacity:.65}.cc-toolbar .cc-picker-trigger{color:var(--cc-ink)!important}.cc-folder-ico svg{width:18px;height:18px}.cc-bottom-row .cc-picker-trigger{font-size:14.5px!important}.cc-folders{flex:1;min-width:0}.cc-folder-name{overflow:hidden;text-overflow:ellipsis}.cc-apps{margin-left:auto;flex:none}.cc-menu{position:absolute;bottom:calc(100% + 9px);left:0;width:max-content;min-width:190px;max-width:min(280px,calc(100cqw - 20px));max-height:280px;overflow:auto;background:var(--cc-bg);border:1px solid var(--cc-edge);box-shadow:var(--cc-shadow),0 10px 30px #0002;border-radius:12px;padding:5px;z-index:30;outline:none!important;animation:cc-menu-in .18s cubic-bezier(.22,1,.36,1);transform-origin:bottom left;cursor:default}.cc-picker[data-align=right] .cc-menu{left:auto;right:0;transform-origin:bottom right}.cc-picker[data-below=true] .cc-menu{bottom:auto;top:calc(100% + 9px);transform-origin:top left}.cc-picker[data-below=true][data-align=right] .cc-menu{transform-origin:top right}.cc-menu-heading{display:block;padding:5px 8px;font-size:10px;color:var(--cc-muted)}.cc-menu-row{display:flex;align-items:center;gap:9px;padding:8px;border-radius:7px;cursor:pointer;min-height:34px;transition:background .12s}.cc-menu-row[data-highlighted=true]{background:var(--cc-hover)}.cc-menu-row>span:not(.cc-app-mark){flex:1;min-width:0}.cc-menu-row strong{display:block;font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis}.cc-menu-row small{display:block;color:var(--cc-muted);font-size:10px;margin-top:1px}.cc-menu-row>svg:last-child{width:13px;height:13px}.cc-menu-row>svg:first-child{color:var(--cc-muted)}.cc-menu-empty{font-size:11px;padding:8px;color:var(--cc-muted)}.cc-app-logos{display:flex;align-items:center;gap:6px;margin-left:4px}.cc-app-mark{display:grid;place-items:center;width:17px;height:17px;flex:none;border-radius:4px}.cc-app-mark>svg,.cc-app-mark>img{width:17px;height:17px}.cc-attachments{display:flex;flex-wrap:wrap;gap:5px;margin:8px 5px}.cc-attachments>span{display:flex;align-items:center;gap:6px;font-size:11px;background:var(--cc-hover);border:1px solid var(--cc-edge);padding:3px 6px;border-radius:5px;max-width:100%;overflow-wrap:anywhere}.cc-attachments button{border:0;background:none;padding:2px}.cc-attachments svg{width:12px;height:12px}.cc-transcript{min-height:48px;color:var(--cc-muted);line-height:1.65}.cc-transcript>span{animation:cc-appear .25s both}.cc-recording-controls{display:flex;align-items:center;gap:6px;min-width:0}.cc-recording-label{font-size:10px;color:var(--cc-muted);white-space:nowrap}.cc-audio{display:flex;align-items:center;gap:2px;height:22px;overflow:hidden;color:var(--cc-muted);margin-right:5px}.cc-audio i{width:2px;border-radius:2px;background:currentColor;animation:cc-audio .7s ease-in-out infinite alternate}.cc-error{color:#c62828;font-size:11px;margin:9px 6px 0}.cc-notice{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;margin:0}
@container(max-width:430px){.cc-card{padding:14px 10px 10px}.cc-toolbar{gap:2px}.cc-picker-trigger{padding:5px;font-size:11px!important;gap:4px}.cc-approval{font-size:10px!important;gap:3px;padding:5px}.cc-approval svg{width:12px;height:12px}.cc-icon-button{width:26px}.cc-bottom-row{gap:8px;padding:10px 0 0}.cc-app-logos{gap:0}.cc-app-mark{width:14px;height:14px}.cc-app-mark>svg{width:13px;height:13px}.cc-recording-label{display:none}}
@container(max-width:330px){.cc-approval>span{max-width:74px;overflow:hidden;text-overflow:ellipsis}.cc-app-logos .cc-app-mark:nth-child(n+2){display:none}.cc-toolbar .cc-picker-trigger>span:first-child{display:none}.cc-audio{max-width:35px}}
@keyframes cc-wave{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(15deg)}}@keyframes cc-appear{from{opacity:0;filter:blur(2px)}to{opacity:1;filter:blur(0)}}@keyframes cc-menu-in{from{opacity:0;transform:translateY(3px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes cc-audio{from{transform:scaleY(.35)}to{transform:scaleY(1)}}@media(prefers-reduced-motion:reduce){.cc-composer *{animation:none!important;transition:none!important}}
`;

export default ChatComposer;
