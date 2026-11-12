import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  catalog,
  categories,
  previewFor,
  sourceFor,
  fileFor,
  usageFor,
  buildPrompt,
  hasClassic,
} from "./registry";
import { ChatDataEditor, ChatPreview, useChatWidget } from "./chat/chat-tools";
import { Replay } from "./replay/replay";

const symbols: Record<string, string> = {
  "Компани": "◈",
  "Chat widgets": "✦",
  Agents: "⌘",
  Chat: "◌",
  Inputs: "⊞",
  "Data display": "▤",
  Navigation: "↗",
  Feedback: "◉",
  Cards: "▢",
  Buttons: "↵",
  Social: "◫",
};
const read = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};
function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V4H4v12h4" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10Z" />,
    reset: (
      <>
        <path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    check: <path d="m5 12 4 4L19 6" />,
    code: (
      <>
        <path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.code}
    </svg>
  );
}
class PreviewBoundary extends Component<
  { children: ReactNode },
  { error: string }
> {
  state = { error: "" };
  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }
  render() {
    return this.state.error ? (
      <div className="empty-state">
        <h3>Preview could not load</h3>
        <p>{this.state.error}</p>
        <p>The source remains available in the Code tab.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}
function initialRoute() {
  const slug = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
  return catalog.some((x) => x.slug === slug) || slug === "overview"
    ? slug
    : "thinking-state";
}

function NotifyTestButton() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [detail, setDetail] = useState("");
  useEffect(() => {
    if (state !== "sent" && state !== "error") return;
    const timer = setTimeout(() => setState("idle"), 4000);
    return () => clearTimeout(timer);
  }, [state]);
  const send = async () => {
    setState("sending");
    try {
      const res = await fetch("/api/notify-test", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
      setDetail(`Sent to ${body.to?.join(", ") ?? "inbox"}`);
      setState("sent");
    } catch (err) {
      setDetail(err instanceof Error ? err.message : "Failed");
      setState("error");
    }
  };
  const label =
    state === "sending"
      ? "Sending…"
      : state === "sent"
        ? "Sent ✓"
        : state === "error"
          ? "Failed ✕"
          : "Test notification";
  return (
    <button
      type="button"
      className={`notify-button ${state}`}
      onClick={send}
      disabled={state === "sending"}
      title={state === "idle" ? "Send a test email notification" : detail}
      aria-live="polite"
    >
      <span aria-hidden="true">🔔</span> {label}
    </button>
  );
}

export default function App() {
  const [route, setRoute] = useState(initialRoute);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(() => read("studio-theme", "light"));
  const [style, setStyle] = useState("clean");
  const [tab, setTab] = useState("preview");
  const [run, setRun] = useState(0);
  const [code, setCode] = useState("");
  const [sourceError, setSourceError] = useState("");
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");
  const [manualText, setManualText] = useState("");
  const [mobile, setMobile] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(read("studio-favorites", "[]"));
    } catch {
      return [];
    }
  });
  const search = useRef<HTMLInputElement>(null);
  const manual = useRef<HTMLTextAreaElement>(null);
  const entry = catalog.find((x) => x.slug === route);
  const matches = catalog.filter(
    (x) =>
      (!favoriteOnly || favorites.includes(x.slug)) &&
      `${x.name} ${x.category} ${x.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const Preview = entry ? previewFor(entry, style) : null;
  const chat = useChatWidget(entry?.slug);
  useEffect(() => {
    const fn = () => setRoute(initialRoute());
    addEventListener("hashchange", fn);
    return () => removeEventListener("hashchange", fn);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("studio-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    try {
      localStorage.setItem("studio-favorites", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        e.preventDefault();
        setMobile(true);
        search.current?.focus();
      }
      if (e.key === "Escape") {
        setMobile(false);
        setManualText("");
      }
    };
    addEventListener("keydown", fn);
    return () => removeEventListener("keydown", fn);
  }, []);
  useEffect(() => {
    setCode("");
    setSourceError("");
    setCopied("");
    setCopyError("");
    if (!entry) return;
    let alive = true;
    sourceFor(entry, style)
      .then((value) => {
        if (alive) setCode(value);
      })
      .catch(() => {
        if (alive)
          setSourceError("Could not load the source. Refresh to try again.");
      });
    return () => {
      alive = false;
    };
  }, [entry, style]);
  useEffect(() => {
    if (manualText) {
      manual.current?.focus();
      manual.current?.select();
    }
  }, [manualText]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(""), 2200);
    return () => clearTimeout(timer);
  }, [copied]);
  const navigate = (slug: string) => {
    location.hash = "/" + slug;
    setRoute(slug);
    setMobile(false);
    setTab("preview");
    setRun((n) => n + 1);
    setNarrow(false);
    document.querySelector(".workspace")?.scrollTo(0, 0);
  };
  const toggleFavorite = (slug: string) =>
    setFavorites((s) =>
      s.includes(slug) ? s.filter((v) => v !== slug) : [...s, slug],
    );
  const copy = async (kind: string, text: string) => {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
    } catch {
      setCopyError(
        "Clipboard access is unavailable. Copy the selected text below.",
      );
      setManualText(text);
    }
  };
  const download = () => {
    if (!entry || !code) return;
    const url = URL.createObjectURL(
      new Blob([code], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = fileFor(entry, style);
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="studio-shell">
      {mobile && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "is-open" : ""}`}>
        <button
          className="brand"
          onClick={() => navigate("overview")}
          aria-label="Thinking State home"
        >
          <span className="brand-mark">
            t<span aria-hidden="true">·</span>
          </span>
          <span>
            thinking<span className="brand-light">state</span>
          </span>
          <span className="brand-version">01</span>
        </button>
        <div className="sidebar-search">
          <Icon name="search" />
          <input
            ref={search}
            placeholder="Find a component…"
            aria-label="Search components"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>/</kbd>
        </div>
        <button
          className={`overview-link ${route === "overview" ? "active" : ""}`}
          onClick={() => navigate("overview")}
        >
          <span>▦</span> All components <span className="count">{catalog.length}</span>
        </button>
        <button
          className={`favorites-filter ${favoriteOnly ? "active" : ""}`}
          aria-pressed={favoriteOnly}
          onClick={() => setFavoriteOnly((s) => !s)}
        >
          <Icon name="star" /> Favorites{" "}
          <span className="count">{favorites.length}</span>
        </button>
        <nav aria-label="Components" className="component-navigation">
          {categories.map((category) => {
            const list = matches.filter((x) => x.category === category);
            if (!list.length) return null;
            return (
              <div className="nav-group" key={category}>
                <div className="nav-category">
                  <span>{symbols[category]}</span>
                  {category}
                  <small>{list.length}</small>
                </div>
                {list.map((x) => (
                  <button
                    key={x.slug}
                    className={`nav-item ${route === x.slug ? "active" : ""}`}
                    aria-current={route === x.slug ? "page" : undefined}
                    onClick={() => navigate(x.slug)}
                  >
                    <span>{x.name}</span>
                    {"subtype" in x && <small className="nav-subtype">{String(x.subtype)}</small>}
                    {favorites.includes(x.slug) && (
                      <span className="nav-star">✦</span>
                    )}
                    {route === x.slug && <span className="active-dot" />}
                  </button>
                ))}
              </div>
            );
          })}
          {!matches.length && (
            <div className="nav-empty">
              No components found.
              <button
                onClick={() => {
                  setQuery("");
                  setFavoriteOnly(false);
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </nav>
        <a className="sidebar-download" href="/component-library.zip" download>
          <span className="download-tile">
            <Icon name="download" />
          </span>
          <span>
            <strong>Take the library with you</strong>
            <small>All source files · ZIP download</small>
          </span>
          <span>↗</span>
        </a>
        <div className="sidebar-footer">
          <span className="live-dot" />
          {catalog.length} components. Yours to build with.
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobile((s) => !s)}
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">
            <button onClick={() => navigate("overview")}>Library</button>
            <span>/</span>
            {entry ? (
              <>
                <span>{entry.category}</span>
                <span>/</span>
                <strong>{entry.name}</strong>
              </>
            ) : (
              <strong>All components</strong>
            )}
          </div>
          <div className="topbar-actions">
            <NotifyTestButton />
            <span className="toolbar-divider" />
            <a
              href="https://github.com/Atlas322/thinking-state"
              target="_blank"
              rel="noreferrer"
              className="repo-link"
            >
              GitHub ↗
            </a>
            <span className="toolbar-divider" />
            <button
              className="icon-button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} />
            </button>
          </div>
        </header>
        <main className="main-content">
          {!entry ? (
            <>
              <section className="library-hero">
                <div className="eyebrow">
                  <span className="live-dot" />
                  THINKING STATE · THE ENGINE
                </div>
                <h1>
                  Good interfaces.
                  <br />
                  <span>A better starting point.</span>
                </h1>
                <p>
                  Thinking State is the engine that shows an agent’s work as live
                  widgets. {catalog.length} interactive components for agents,
                  conversations, and the rest of your product. Explore, copy, and
                  make them yours.
                </p>
                <div className="collection-stats">
                  <span>
                    <strong>{catalog.length}</strong> components
                  </span>
                  <span>
                    <strong>23</strong> MIT originals
                  </span>
                  <span>
                    <strong>67</strong> independent recreations
                  </span>
                  <span>
                    <strong>{catalog.filter((e) => "origin" in e).length}</strong> Thinking State originals
                  </span>
                </div>
              </section>
              <div className="gallery-header">
                <h2>
                  {query
                    ? `Results for “${query}”`
                    : favoriteOnly
                      ? "Your favorites"
                      : "Explore the collection"}
                </h2>
                <span>{matches.length} components</span>
              </div>
              <div className="catalog-grid">
                {matches.map((x, i) => (
                  <button
                    className="catalog-card"
                    key={x.slug}
                    onClick={() => navigate(x.slug)}
                  >
                    <div className={`card-art art-${i % 5}`}>
                      <span className="mini-window">
                        <span className="mini-dots">···</span>
                        <span className="mini-row">
                          <i />
                          <b />
                          <em />
                        </span>
                        <span className="mini-row">
                          <i />
                          <b />
                          <em />
                        </span>
                        <span className="mini-row">
                          <i />
                          <b />
                          <em />
                        </span>
                      </span>
                      <span className="art-symbol">{symbols[x.category]}</span>
                    </div>
                    <div className="catalog-card-info">
                      <small>{x.category}</small>
                      <h3>
                        {x.name}
                        <span>↗</span>
                      </h3>
                      <p>{x.description}</p>
                      <span className={`origin ${"origin" in x ? "original" : x.pro ? "recreated" : "mit"}`}>
                        {"origin" in x ? "Thinking State" : "source" in x ? x.source : x.pro ? "Recreated" : "MIT original"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {!matches.length && (
                <div className="empty-state">
                  <h3>No components match</h3>
                  <button
                    className="action-button"
                    onClick={() => {
                      setQuery("");
                      setFavoriteOnly(false);
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="component-heading">
                <div className="eyebrow">
                  {entry.category.toUpperCase()} <span> / </span> COMPONENT{" "}
                  {String(catalog.indexOf(entry) + 1).padStart(2, "0")}
                </div>
                <div className="heading-title">
                  <h1>{entry.name}</h1>
                  <button
                    className={`favorite-button ${favorites.includes(entry.slug) ? "saved" : ""}`}
                    aria-label={`${favorites.includes(entry.slug) ? "Remove from" : "Add to"} favorites`}
                    aria-pressed={favorites.includes(entry.slug)}
                    onClick={() => toggleFavorite(entry.slug)}
                  >
                    <Icon name="star" />
                  </button>
                </div>
                <p>{entry.description}</p>
                <div className="component-meta">
                  <span className={`origin ${"origin" in entry ? "original" : entry.pro ? "recreated" : "mit"}`}>
                    <span className="origin-dot" />
                    {"origin" in entry
                      ? entry.origin
                      : "source" in entry
                      ? `Source · ${entry.source}`
                      : entry.pro
                      ? "Independent recreation"
                      : "Original · MIT license"}
                  </span>
                  <span>React 19</span>
                  <span>TypeScript</span>
                  <span>Self-contained</span>
                </div>
              </div>
              <section
                className="showcase"
                aria-label={`${entry.name} showcase`}
              >
                <div className="showcase-toolbar">
                  <div
                    className="view-tabs"
                    role="tablist"
                    aria-label="Component view"
                  >
                    {(chat.isChat ? ["preview", "data", "code", "usage"] : ["preview", "code", "usage"]).map((t) => (
                      <button
                        role="tab"
                        aria-selected={tab === t}
                        aria-controls="component-panel"
                        id={`tab-${t}`}
                        key={t}
                        onClick={() => setTab(t)}
                      >
                        {t === "preview" ? (
                          <span>◉</span>
                        ) : t === "data" ? (
                          <span>{"{}"}</span>
                        ) : t === "code" ? (
                          <Icon name="code" />
                        ) : (
                          <span>↗</span>
                        )}
                        {t[0].toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="preview-options">
                    {tab === "preview" && (
                      <>
                        {hasClassic(entry) && (
                          <div
                            className="style-switch"
                            role="group"
                            aria-label="Component style"
                          >
                            <button
                              aria-pressed={style === "clean"}
                              onClick={() => setStyle("clean")}
                            >
                              Clean
                            </button>
                            <button
                              aria-pressed={style === "classic"}
                              onClick={() => setStyle("classic")}
                            >
                              Classic
                            </button>
                          </div>
                        )}
                        <button
                          className={`icon-button ${narrow ? "selected" : ""}`}
                          aria-label={
                            narrow ? "Use wide preview" : "Use narrow preview"
                          }
                          aria-pressed={narrow}
                          onClick={() => setNarrow((s) => !s)}
                        >
                          <span style={{ fontSize: 17 }}>▯</span>
                        </button>
                      </>
                    )}
                    {tab !== "preview" && (
                      <span className="filename">
                        {tab === "code" ? fileFor(entry, style) : tab === "data" ? "props.json" : "usage.tsx"}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  id="component-panel"
                  role="tabpanel"
                  aria-labelledby={`tab-${tab}`}
                  className={tab === "preview" ? "preview-stage" : "code-stage"}
                >
                  {tab === "preview" ? (
                    <div
                      className={`preview-container ${narrow ? "narrow" : ""} ${"module" in entry && !narrow ? "wide" : ""}`}
                    >
                      <Replay key={`${entry.slug}-${style}-${run}`}>
                      <PreviewBoundary key={`${entry.slug}-${style}${chat.isChat ? `-${chat.json.length}-${chat.json.slice(-24)}` : ""}`}>
                        <Suspense
                          fallback={
                            <div className="preview-loading">
                              <span className="loading-mark" />
                              Loading component…
                            </div>
                          }
                        >
                          {chat.isChat ? <ChatPreview chat={chat} /> : Preview && <Preview />}
                        </Suspense>
                      </PreviewBoundary>
                      </Replay>
                    </div>
                  ) : tab === "data" && chat.isChat ? (
                    <ChatDataEditor chat={chat} />
                  ) : (
                    <pre tabIndex={0}>
                      <code>
                        {tab === "usage"
                          ? usageFor(entry, style)
                          : sourceError || code || "Loading source…"}
                      </code>
                    </pre>
                  )}
                </div>
                <div className="showcase-footer">
                  <span>
                    <span className="live-dot" />
                    {tab === "preview"
                      ? "Interactive preview — try it out"
                      : tab === "code"
                        ? "Complete source, including styles"
                        : tab === "data"
                          ? "The JSON an agent sends to show this widget"
                          : "A starting point for your application"}
                  </span>
                  <span>
                    {tab === "preview"
                      ? "No backend connected"
                      : tab === "data"
                        ? chat.error ? "Invalid JSON" : "Valid JSON"
                      : code
                        ? `${code.split("\n").length} lines`
                        : ""}
                  </span>
                </div>
              </section>
              <div className="copy-bar">
                <div>
                  <span className="copy-bar-icon">
                    <Icon name="code" />
                  </span>
                  <div>
                    <strong>Make it part of your project.</strong>
                    <p>
                      Copy the source, or give an AI assistant the complete
                      prompt.
                    </p>
                  </div>
                </div>
                <div className="copy-actions">
                  {chat.isChat && (
                    <button
                      className="action-button chat-export"
                      disabled={!chat.ready || chat.busy || !!chat.error}
                      onClick={() =>
                        chat
                          .exportHtml()
                          .then(() => setCopied("chat"))
                          .catch((e) =>
                            setCopyError(
                              `Could not export: ${e instanceof Error ? e.message : String(e)}`,
                            ),
                          )
                      }
                      title="One-file HTML with the current data, ready for an agent's chat"
                    >
                      <span aria-hidden="true">✦</span>
                      {copied === "chat" ? "HTML saved!" : "Use in chat"}
                    </button>
                  )}
                  <button
                    className="action-button"
                    disabled={!code}
                    onClick={download}
                    aria-label="Download component file"
                  >
                    <Icon name="download" />
                  </button>
                  <button
                    className="action-button"
                    disabled={!code}
                    onClick={() => copy("code", code)}
                  >
                    <Icon name={copied === "code" ? "check" : "copy"} />
                    {copied === "code" ? "Copied!" : "Copy code"}
                  </button>
                  <button
                    className="action-button primary"
                    disabled={!code}
                    onClick={() =>
                      copy("prompt", buildPrompt(entry, style, code))
                    }
                  >
                    <span>✦</span>
                    {copied === "prompt" ? "Prompt copied!" : "Copy prompt"}
                    <Icon name="arrow" />
                  </button>
                </div>
              </div>
              <div className="copy-feedback" role="status" aria-live="polite">
                {copied === "prompt"
                  ? "Ready to paste into ChatGPT, Claude, Cursor, or another coding assistant."
                  : copied === "chat"
                    ? `${entry.slug}.html saved: one file with the widget, its data and a small script. Show it in chat or open it in a browser.`
                  : copied === "code"
                    ? "Complete component source copied."
                    : sourceError}
              </div>
              <div className="component-notes">
                <section>
                  <h3>Copy. Paste. Build.</h3>
                  <ol>
                    <li>
                      Copy the code or download the <code>.tsx</code> file.
                    </li>
                    <li>
                      Add it to your React 19 project. Styles are already
                      included.
                    </li>
                    <li>
                      Pass your data and connect the callbacks to your
                      application.
                    </li>
                  </ol>
                  <button
                    className="text-button"
                    onClick={() => setTab("usage")}
                  >
                    See usage example <Icon name="arrow" />
                  </button>
                </section>
                {"origin" in entry ? (
                <section>
                  <h3>{entry.category === "Chat widgets" ? "Made for an agent's chat" : "An original component"}</h3>
                  <p>
                    {entry.category === "Chat widgets"
                      ? "An original component that an agent shows in its chat. It takes plain JSON props (see the Data tab); Use in chat saves one HTML file with the widget, its data and a small script for theme, motion and actions. Agents can render the same file with npm run chat:html."
                      : "An original component built on the shared tokens (tokens/tokens.json). The code here is fully available to copy and customize."}
                  </p>
                </section>
                ) : (
                <section>
                  <h3>
                    {"source" in entry
                      ? `From ${entry.source}`
                      : entry.pro
                      ? "About this recreation"
                      : "From the open-source collection"}
                  </h3>
                  <p>
                    {"source" in entry
                      ? `Ported from ${entry.source} (MIT + Commons Clause) with its CSS inlined. It needs the npm package named in the file header.`
                      : entry.pro
                      ? "Independently built from the public preview and documented behavior. Visual details and APIs may differ from affectUI Pro. The code here is fully available to copy and customize."
                      : "The original affectUI component under the MIT license, with a local working example. The license notice is included when you copy or download the code."}
                  </p>
                  <a
                    href={"source" in entry ? "https://reactbits.dev" : `https://www.affectui.com/components/${entry.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View original reference ↗
                  </a>
                </section>
                )}
              </div>
              <section className="related">
                <div className="gallery-header">
                  <h2>Keep exploring</h2>
                  <button
                    className="text-button"
                    onClick={() => navigate("overview")}
                  >
                    View all {catalog.length} <Icon name="arrow" />
                  </button>
                </div>
                <div className="related-grid">
                  {catalog
                    .filter(
                      (x) =>
                        x.category === entry.category && x.slug !== entry.slug,
                    )
                    .slice(0, 3)
                    .map((x) => (
                      <button key={x.slug} onClick={() => navigate(x.slug)}>
                        <span>{symbols[x.category]}</span>
                        <div>
                          <small>{x.category}</small>
                          <strong>{x.name}</strong>
                        </div>
                        <span>↗</span>
                      </button>
                    ))}
                </div>
              </section>
            </>
          )}
          <footer className="main-footer">
            <span>
              Thinking State <span className="footer-dot">·</span> Built to be
              used.
            </span>
            <a
              href="https://github.com/Atlas322/thinking-state"
              target="_blank"
              rel="noreferrer"
            >
              Source repository ↗
            </a>
          </footer>
        </main>
      </div>
      {manualText && (
        <div className="modal-backdrop">
          <section
            className="copy-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Copy manually"
          >
            <h2>Copy manually</h2>
            <p>{copyError}</p>
            <textarea
              ref={manual}
              value={manualText}
              readOnly
              aria-label="Text to copy"
            />
            <button className="action-button" onClick={() => setManualText("")}>
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
