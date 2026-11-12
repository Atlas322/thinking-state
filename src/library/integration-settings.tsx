"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type IntegrationValues = {
  enabled: boolean;
  siteUrl: string;
  timeZone: string;
  apiKey: string;
};
export type IntegrationSettingsProps = {
  name?: string;
  logo?: React.ReactNode;
  count?: number;
  meta?: string;
  defaultValues?: Partial<IntegrationValues>;
  siteHint?: string;
  timeZones?: string[];
  onGenerateKey?: () => string | Promise<string>;
  onSave?: (values: IntegrationValues) => void | Promise<void>;
  onToggle?: (enabled: boolean) => void;
  className?: string;
};

/** Neutral shop-bag glyph (no vendor logo). */
const ShopLogo = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="1" y="1" width="22" height="22" rx="6" fill="#65a30d" />
    <path d="M6.5 9h11l-1 9.5h-9Z" fill="#fff" />
    <path d="M9.5 9V7.5a2.5 2.5 0 0 1 5 0V9" fill="none" stroke="#fff" strokeWidth="1.5" />
  </svg>
);

const defaultZones = [
  "(GMT −08:00) Лос-Анжелес",
  "(GMT −05:00) Нью-Йорк",
  "(GMT +00:00) Лондон",
  "(GMT +01:00) Берлин",
  "(GMT +02:00) Афин",
  "(GMT +05:30) Колката",
  "(GMT +08:00) Улаанбаатар",
  "(GMT +09:00) Токио",
];

const validHost = (v: string) => /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+(\/\S*)?$/i.test(v.trim());
const randomKey = () =>
  "key_" + Array.from({ length: 28 }, () => "abcdef0123456789"[Math.floor(Math.random() * 16)]).join("");

export function IntegrationSettings({
  name = "Онлайн дэлгүүр",
  logo = ShopLogo,
  count = 128,
  meta = "2026.03.04-ний 09:12-д холбогдсон",
  defaultValues,
  siteHint = "Дэлгүүрийн үндсэн домэйн: Тохиргоо › Домэйн",
  timeZones = defaultZones,
  onGenerateKey,
  onSave,
  onToggle,
  className = "",
}: IntegrationSettingsProps) {
  const initial: IntegrationValues = {
    enabled: true,
    siteUrl: "shop.example.mn",
    timeZone: "(GMT +08:00) Улаанбаатар",
    apiKey: "",
    ...defaultValues,
  };
  const [saved, setSaved] = React.useState(initial);
  const [v, setV] = React.useState(initial);
  const [tzOpen, setTzOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<"key" | "save" | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [said, setSaid] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const id = React.useId();
  const tzRef = React.useRef<HTMLDivElement>(null);

  const host = v.siteUrl.replace(/^https?:\/\//, "");
  const invalid = host.length > 0 && !validHost(host);
  const dirty = v.siteUrl !== saved.siteUrl || v.timeZone !== saved.timeZone || v.apiKey !== saved.apiKey;

  React.useEffect(() => {
    if (!tzOpen) return;
    const close = (e: MouseEvent) => {
      if (!tzRef.current?.contains(e.target as Node)) setTzOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [tzOpen]);

  const toggle = () => {
    const enabled = !v.enabled;
    setV((s) => ({ ...s, enabled }));
    setSaved((s) => ({ ...s, enabled }));
    onToggle?.(enabled);
  };
  const generate = async () => {
    setBusy("key");
    try {
      const key = onGenerateKey ? await onGenerateKey() : randomKey();
      setV((s) => ({ ...s, apiKey: key }));
      setSaid("New API key generated. Copy it now – it won't be shown again.");
    } finally {
      setBusy(null);
    }
  };
  const save = async () => {
    if (invalid) return;
    setBusy("save");
    try {
      const next = { ...v, siteUrl: host };
      await onSave?.(next);
      setSaved(next);
      setV(next);
      setSaid("Settings saved");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className={`ist ${className}`}>
      <style>{css}</style>
      <header className="ist-head">
        <span className="ist-logo">{logo}</span>
        <div className="ist-name">
          <div className="ist-title">
            <strong>{name}</strong>
            {count !== undefined && <span className="ist-count">{count}</span>}
          </div>
          <div className="ist-meta">{v.enabled ? meta : "Paused – nothing syncs until you switch it back on"}</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={v.enabled}
          aria-label={`${name} enabled`}
          className="ist-switch"
          onClick={toggle}
        >
          <i />
        </button>
      </header>

      <div className="ist-fold" data-open={v.enabled} aria-hidden={!v.enabled}>
        <div className="ist-fold-in">
          <div className="ist-sec">
            <div className="ist-label">API key</div>
            {v.apiKey ? (
              <div className="ist-field ist-key">
                <code>{v.apiKey}</code>
                <button
                  type="button"
                  className="ist-ibtn"
                  aria-label={copied ? "Copied" : "Copy API key"}
                  tabIndex={v.enabled ? 0 : -1}
                  onClick={() => {
                    navigator.clipboard?.writeText(v.apiKey).catch(() => {});
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1400);
                  }}
                >
                  {copied ? (
                    <svg viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  ) : (
                    <svg viewBox="0 0 16 16"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M3 10.5V3.5a1 1 0 0 1 1-1h6.5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
                  )}
                </button>
                <button type="button" className="ist-ibtn" aria-label="Generate a new API key" tabIndex={v.enabled ? 0 : -1} onClick={generate}>
                  <svg viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                </button>
              </div>
            ) : (
              <button type="button" className="ist-field ist-gen" disabled={busy === "key"} tabIndex={v.enabled ? 0 : -1} onClick={generate}>
                {busy === "key" ? "Generating…" : "Generate a new API key"}
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="5" cy="11" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="m7 9 6-6m-2 2 1.5 1.5M9.5 6.5 11 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            )}
            {v.apiKey && v.apiKey !== saved.apiKey && <p className="ist-hint">Copy it now – it won't be shown again.</p>}
          </div>

          <div className="ist-sec">
            <label className="ist-label" htmlFor={`${id}-site`}>Site address</label>
            <div className="ist-field ist-url" data-invalid={invalid && touched}>
              <span className="ist-proto">https://</span>
              <input
                id={`${id}-site`}
                value={host}
                spellCheck={false}
                tabIndex={v.enabled ? 0 : -1}
                aria-invalid={invalid}
                aria-describedby={`${id}-hint`}
                placeholder="your-store.com"
                onBlur={() => setTouched(true)}
                onChange={(e) => setV((s) => ({ ...s, siteUrl: e.target.value.replace(/^https?:\/\//, "") }))}
              />
              {host && !invalid && (
                <svg className="ist-ok" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </div>
            <p id={`${id}-hint`} className="ist-hint" data-invalid={invalid && touched}>
              {invalid && touched ? "Enter a domain like your-store.com" : siteHint}
            </p>
          </div>

          <div className="ist-sec">
            <div className="ist-label" id={`${id}-tz`}>Time zone</div>
            <div className="ist-tz" ref={tzRef}>
              <button
                type="button"
                className="ist-field ist-select"
                aria-haspopup="listbox"
                aria-expanded={tzOpen}
                aria-labelledby={`${id}-tz`}
                tabIndex={v.enabled ? 0 : -1}
                onClick={() => setTzOpen((o) => !o)}
                onKeyDown={(e) => e.key === "Escape" && setTzOpen(false)}
              >
                {v.timeZone}
                <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M8 5v3.2l2 1.3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              </button>
              {tzOpen && (
                <ul className="ist-menu" role="listbox" aria-labelledby={`${id}-tz`} onKeyDown={(e) => e.key === "Escape" && setTzOpen(false)}>
                  {timeZones.map((z) => (
                    <li key={z}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={z === v.timeZone}
                        autoFocus={z === v.timeZone}
                        onClick={() => {
                          setV((s) => ({ ...s, timeZone: z }));
                          setTzOpen(false);
                        }}
                      >
                        {z}
                        {z === v.timeZone && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ist-save" data-open={dirty && v.enabled}>
        <div className="ist-save-in">
          <span>Unsaved changes</span>
          <button type="button" className="ist-btn" tabIndex={dirty ? 0 : -1} onClick={() => { setV(saved); setTouched(false); }}>Discard</button>
          <button type="button" className="ist-btn ist-primary" tabIndex={dirty ? 0 : -1} disabled={invalid || busy === "save"} onClick={save}>
            {busy === "save" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      <span role="status" aria-live="polite" className="ist-sr">{said}</span>
    </section>
  );
}

const css = `
.ist{--ist-bg:#fff;--ist-fg:#18181b;--ist-muted:#71717a;--ist-faint:#a1a1aa;--ist-line:#ececef;--ist-soft:#f4f4f5;--ist-accent:#3b82f6;--ist-green:#2f9e6a;--ist-red:#d14343;width:100%;max-width:560px;background:var(--ist-bg);color:var(--ist-fg);border:1px solid var(--ist-line);border-radius:12px;box-shadow:0 1px 2px #0000000a,0 4px 14px -8px #00000014;font:400 13px/1.45 Inter,system-ui,sans-serif;overflow:visible}
:where(.dark,[data-theme=dark]) .ist{--ist-bg:#1b1b1e;--ist-fg:#ececef;--ist-muted:#a1a1aa;--ist-faint:#71717a;--ist-line:#2c2c31;--ist-soft:#26262b;--ist-accent:#5b9bff;--ist-green:#6cc596;--ist-red:#f08585;color-scheme:dark}
.ist *{box-sizing:border-box}.ist button{font:inherit;color:inherit;cursor:pointer}
.ist-head{display:flex;align-items:center;gap:13px;padding:16px 18px;border-bottom:1px solid var(--ist-line)}
.ist-logo{display:grid;place-items:center;flex:none;width:46px;height:46px;border:1px solid var(--ist-line);border-radius:10px;background:#fff;box-shadow:0 1px 2px #0000000a}.ist-logo svg{width:26px;height:26px}
.ist-name{flex:1;min-width:0}
.ist-title{display:flex;align-items:center;gap:8px}.ist-title strong{font-size:15.5px;font-weight:500;letter-spacing:-.01em}
.ist-count{height:18px;padding:0 6px;border-radius:5px;background:var(--ist-soft);color:var(--ist-muted);font-size:11.5px;line-height:18px;font-variant-numeric:tabular-nums}
.ist-meta{margin-top:2px;color:var(--ist-muted);font-size:12.5px}
.ist-switch{position:relative;flex:none;width:32px;height:18px;padding:0;border:0;border-radius:99px;background:color-mix(in srgb,var(--ist-fg) 18%,transparent);transition:background .2s}
.ist-switch i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0003;transition:transform .2s cubic-bezier(.3,.7,.4,1)}
.ist-switch[aria-checked=true]{background:var(--ist-accent)}.ist-switch[aria-checked=true] i{transform:translateX(14px)}
.ist-fold{display:grid;grid-template-rows:1fr;transition:grid-template-rows .3s ease,opacity .25s}
.ist-fold[data-open=false]{grid-template-rows:0fr;opacity:0}
.ist-fold-in{min-height:0;overflow:hidden}.ist-fold[data-open=true] .ist-fold-in{overflow:visible}
.ist-sec{padding:16px 18px 18px;border-bottom:1px solid var(--ist-line)}.ist-sec:last-child{border-bottom:0}
.ist-label{display:block;margin-bottom:8px;font-size:13.5px;font-weight:500}
.ist-field{display:flex;align-items:center;gap:8px;width:100%;height:36px;padding:0 11px;border:1px solid var(--ist-line);border-radius:8px;background:var(--ist-bg);font-size:13.5px;text-align:left;transition:border-color .15s,box-shadow .15s}
.ist-field svg{width:15px;height:15px;flex:none;margin-left:auto;color:var(--ist-muted)}
.ist-gen{background:var(--ist-soft);border-color:var(--ist-line);color:var(--ist-muted)!important}.ist-gen:hover{color:var(--ist-fg)!important}
.ist-key code{flex:1;min-width:0;font:12.5px ui-monospace,SFMono-Regular,Menlo,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ist-ibtn{display:grid;place-items:center;width:26px;height:26px;padding:0;border:0;border-radius:6px;background:none;color:var(--ist-muted)!important}.ist-ibtn:hover{background:var(--ist-soft);color:var(--ist-fg)!important}.ist-ibtn svg{margin:0;width:14px;height:14px;color:inherit}
.ist-url{box-shadow:0 1px 2px #00000008}
.ist-url:focus-within{border-color:color-mix(in srgb,var(--ist-accent) 60%,var(--ist-line));box-shadow:0 0 0 3px color-mix(in srgb,var(--ist-accent) 14%,transparent)}
.ist-url[data-invalid=true]{border-color:var(--ist-red)}
.ist-proto{color:var(--ist-faint);margin-right:-8px}
.ist-url input{flex:1;min-width:0;height:100%;border:0;background:none;outline:none;color:var(--ist-fg);font:inherit;padding:0}
.ist-ok{color:var(--ist-green)!important}
.ist-hint{margin:8px 0 0;color:var(--ist-muted);font-size:12.5px}.ist-hint[data-invalid=true]{color:var(--ist-red)}
.ist-tz{position:relative}
.ist-select{box-shadow:0 1px 2px #00000008}.ist-select:hover{border-color:color-mix(in srgb,var(--ist-fg) 18%,var(--ist-line))}
.ist-menu{position:absolute;z-index:5;left:0;right:0;top:calc(100% + 4px);margin:0;padding:4px;list-style:none;background:var(--ist-bg);border:1px solid var(--ist-line);border-radius:9px;box-shadow:0 12px 32px -10px #00000033;max-height:220px;overflow:auto;animation:ist-in .15s both}
.ist-menu button{display:flex;align-items:center;width:100%;height:32px;padding:0 9px;border:0;border-radius:6px;background:none;text-align:left}
.ist-menu button:hover,.ist-menu button:focus-visible{background:var(--ist-soft);outline:none}
.ist-menu svg{width:14px;height:14px;margin-left:auto;color:var(--ist-accent)}
.ist-save{display:grid;grid-template-rows:0fr;transition:grid-template-rows .28s ease}
.ist-save[data-open=true]{grid-template-rows:1fr}
.ist-save-in{min-height:0;overflow:hidden;display:flex;align-items:center;gap:8px;padding:0 18px;border-top:1px solid transparent;background:var(--ist-soft);border-radius:0 0 12px 12px;color:var(--ist-muted)}
.ist-save[data-open=true] .ist-save-in{padding:10px 18px;border-top-color:var(--ist-line)}
.ist-save-in span{margin-right:auto}
.ist-btn{height:30px;padding:0 12px;border:1px solid var(--ist-line);border-radius:7px;background:var(--ist-bg);font-weight:500}.ist-btn:hover{background:color-mix(in srgb,var(--ist-fg) 4%,var(--ist-bg))}
.ist-primary{background:var(--ist-fg);border-color:var(--ist-fg);color:var(--ist-bg)!important}.ist-primary:hover{background:color-mix(in srgb,var(--ist-fg) 86%,var(--ist-bg))}.ist-primary:disabled{opacity:.45;cursor:not-allowed}
.ist-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.ist :focus-visible{outline:2px solid var(--ist-accent);outline-offset:2px}
@keyframes ist-in{from{opacity:0;transform:translateY(-3px)}}
@media(max-width:480px){.ist-head{padding:14px}.ist-sec{padding:14px}.ist-logo{width:40px;height:40px}.ist-meta{font-size:12px}}
@media(prefers-reduced-motion:reduce){.ist *{animation:none!important;transition:none!important}}
`;

export default IntegrationSettings;
