"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type AutonomyLevel = 0 | 1 | 2;
export type AgentAction = {
  id: string;
  label: string;
  detail?: string;
  risk: "safe" | "risky" | "destructive";
  icon?: React.ReactNode;
};

export type AutonomyDialProps = {
  actions?: AgentAction[];
  level?: AutonomyLevel;
  defaultLevel?: AutonomyLevel;
  onLevelChange?: (level: AutonomyLevel) => void;
  pinned?: string[];
  defaultPinned?: string[];
  onPinnedChange?: (pinned: string[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
};

const svg = (c: React.ReactNode) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    {c}
  </svg>
);
export const autonomyIcons = {
  notion: svg(
    <>
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="#fff" stroke="#111" strokeWidth="1.3" />
      <path d="M5 11.5v-7h1.1l3.8 7H11v-7" fill="none" stroke="#111" strokeWidth="1.3" />
    </>,
  ),
  gmail: svg(
    <>
      <path d="M1.5 4.5v8h2.5V7l4 3 4-3v5.5h2.5v-8L12.5 3 8 6.4 3.5 3Z" fill="#ea4335" />
      <path d="M1.5 4.5 4 6.5v6H1.5Z" fill="#4285f4" />
      <path d="M14.5 4.5 12 6.5v6h2.5Z" fill="#34a853" />
    </>,
  ),
  hubspot: svg(
    <>
      <circle cx="10" cy="9.5" r="2.6" fill="none" stroke="#ff7a59" strokeWidth="1.6" />
      <path d="M10 6.9V3.5M7.9 8 3.5 4.5M8 11.4l-3 2.6" stroke="#ff7a59" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="3.3" cy="4.2" r="1.3" fill="#ff7a59" />
    </>,
  ),
  drive: svg(
    <>
      <path d="M5.5 2h5l4.5 8h-5Z" fill="#fbbc04" />
      <path d="M5.5 2 1 10l2.5 4.2L8 6.3Z" fill="#0f9d58" />
      <path d="M3.5 14.2h9L15 10H6Z" fill="#4285f4" />
    </>,
  ),
  stripe: svg(
    <>
      <rect x="1" y="1" width="14" height="14" rx="3" fill="#635bff" />
      <path d="M10.2 5.6c-.6-.4-1.3-.6-2-.6-1.1 0-1.8.5-1.8 1.3 0 1.7 3.6 1.1 3.6 3.3 0 1-.9 1.6-2.1 1.6-.8 0-1.6-.3-2.2-.7" fill="none" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
    </>,
  ),
};

const defaultActions: AgentAction[] = [
  { id: "read", label: "Файл, баримт унших", risk: "safe", icon: autonomyIcons.notion },
  { id: "draft", label: "Имэйлийн ноорог бичих", risk: "safe", icon: autonomyIcons.gmail },
  { id: "crm", label: "CRM бичлэг шинэчлэх", risk: "risky", icon: autonomyIcons.hubspot },
  { id: "send", label: "Имэйл илгээх", risk: "risky", icon: autonomyIcons.gmail },
  { id: "delete", label: "Файл устгах", risk: "destructive", icon: autonomyIcons.drive },
  { id: "spend", label: "Мөнгө зарцуулах", risk: "destructive", icon: autonomyIcons.stripe },
];

const levels = ["Үргэлж асуух", "Эрсдэлтэй бол", "Бүрэн автомат"] as const;
const meaning = [
  "Үйлдэл бүр таныг хүлээнэ",
  "Аюулгүй үйлдэл ажиллана, эрсдэлтэй нь таныг хүлээнэ",
  "Таны түгжсэнээс бусад нь бүгд ажиллана",
];

const Lock = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <rect x="3.5" y="7" width="9" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d={open ? "M5.5 7V5a2.5 2.5 0 0 1 4.9-.7" : "M5.5 7V5a2.5 2.5 0 0 1 5 0v2"} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="10.5" r=".9" fill="currentColor" />
  </svg>
);

export function AutonomyDial({
  actions = defaultActions,
  level,
  defaultLevel = 1,
  onLevelChange,
  pinned,
  defaultPinned = ["spend"],
  onPinnedChange,
  title = "Борлуулалтын агент",
  subtitle = "Танаас асуухгүйгээр юу хийж болох вэ",
  className = "",
}: AutonomyDialProps) {
  const [innerLevel, setInnerLevel] = React.useState<AutonomyLevel>(defaultLevel);
  const [innerPinned, setInnerPinned] = React.useState<string[]>(defaultPinned);
  const lv = level ?? innerLevel;
  const pins = pinned ?? innerPinned;
  const setLevel = (l: AutonomyLevel) => {
    setInnerLevel(l);
    onLevelChange?.(l);
  };
  const togglePin = (id: string) => {
    const next = pins.includes(id) ? pins.filter((p) => p !== id) : [...pins, id];
    setInnerPinned(next);
    onPinnedChange?.(next);
  };
  const runs = (a: AgentAction) =>
    !pins.includes(a.id) && (lv === 2 || (lv === 1 && a.risk === "safe"));
  const own = actions.filter(runs);
  const ask = actions.filter((a) => !runs(a));
  const descId = React.useId();

  const row = (a: AgentAction) => {
    const locked = pins.includes(a.id);
    return (
      <li key={a.id} className="ad-row">
        <span className="ad-ico">{a.icon}</span>
        <span className="ad-label">{a.label}</span>
        {a.risk !== "safe" && (
          <span className={`ad-risk ad-${a.risk}`}>
            {a.risk === "risky" ? (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5 14 13H2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M8 6.5v3M8 11.2v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M8 5v3.5M8 10.8v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            )}
            {a.risk === "risky" ? "Эрсдэлтэй" : "Устгах"}
          </span>
        )}
        <button
          type="button"
          className={`ad-lock ${locked ? "is-on" : ""}`}
          aria-pressed={locked}
          aria-label={`${a.label}: ${locked ? "түгжээ тайлах" : "түгжих"}`}
          title={locked ? "Үргэлж асууна – дарж түгжээг тайлна" : "Үүнийг үргэлж асуух"}
          onClick={() => togglePin(a.id)}
        >
          <Lock open={!locked} />
        </button>
      </li>
    );
  };

  return (
    <section className={`ad ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="ad-head">
        <svg className="ad-spark" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 1.5c.4 3.6 2.9 6.1 6.5 6.5-3.6.4-6.1 2.9-6.5 6.5C7.6 10.9 5.1 8.4 1.5 8 5.1 7.6 7.6 5.1 8 1.5Z" fill="url(#ad-g)" />
          <defs>
            <linearGradient id="ad-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4285f4" />
              <stop offset="1" stopColor="#9b72cb" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </header>
      <div
        className="ad-levels"
        role="radiogroup"
        aria-label="Бие даалтын түвшин"
        aria-describedby={descId}
      >
        {levels.map((l, i) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={lv === i}
            tabIndex={lv === i ? 0 : -1}
            onClick={() => setLevel(i as AutonomyLevel)}
            onKeyDown={(e) => {
              const d = ["ArrowRight", "ArrowDown"].includes(e.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(e.key) ? -1 : 0;
              if (!d) return;
              e.preventDefault();
              const n = Math.max(0, Math.min(2, lv + d)) as AutonomyLevel;
              setLevel(n);
              (e.currentTarget.parentElement?.children[n] as HTMLElement)?.focus();
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <p id={descId} className="ad-sr">
        {meaning[lv]}
      </p>
      <div className="ad-body">
        <section aria-label="Өөрөө ажиллана">
          <h4>
            Өөрөө ажиллана <span className="ad-count">{own.length}</span>
          </h4>
          <ul>{own.map(row)}</ul>
        </section>
        <section aria-label="Эхлээд танаас асууна">
          <h4>
            Эхлээд танаас асууна <span className="ad-count">{ask.length}</span>
          </h4>
          <ul>{ask.map(row)}</ul>
        </section>
      </div>
      <p className="ad-sr" aria-live="polite">
        {levels[lv]}: {own.length} өөрөө, {ask.length} эхлээд асууна
      </p>
    </section>
  );
}

const css = `
.ad{--ad-bg:#fff;--ad-fg:#18181b;--ad-muted:#65656d;--ad-faint:#65656d;--ad-line:#ececef;--ad-chip:#efeff1;--ad-accent:#3b82f6;width:100%;max-width:432px;background:var(--ad-bg);color:var(--ad-fg);border:1px solid var(--ad-line);border-radius:14px;box-shadow:0 1px 2px #0000000a;font:400 14px/1.45 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .ad{--ad-bg:#1b1b1e;--ad-fg:#ececef;--ad-muted:#a1a1aa;--ad-faint:#9a9aa2;--ad-line:#2e2e33;--ad-chip:#2a2a2f;color-scheme:dark}
.ad *{box-sizing:border-box}.ad button{font:inherit;color:inherit;cursor:pointer}
.ad-head{display:flex;align-items:flex-start;gap:12px;padding:18px 18px 0}
.ad-spark{width:14px;height:14px;margin-top:12px;flex:none}
.ad-head h3{margin:0;font-size:14px;font-weight:500}.ad-head p{margin:1px 0 0;font-size:13px;color:var(--ad-muted)}
.ad-levels{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:16px 17px 19px;border-bottom:1px solid var(--ad-line)}
.ad-levels button{height:27px;border:0;border-radius:6px;background:var(--ad-chip);font-size:13px;color:var(--ad-muted);transition:background .2s,color .2s,box-shadow .2s}
.ad-levels button[aria-checked=true]{background:var(--ad-bg);color:var(--ad-fg);font-weight:500;box-shadow:0 0 0 1px var(--ad-line),0 1px 3px #00000014}
.ad-body{padding:12px 17px 10px}
.ad-body h4{display:flex;align-items:center;gap:8px;margin:4px 0 4px;font-size:13px;font-weight:400;color:var(--ad-muted)}
.ad-body section+section h4{margin-top:14px}
.ad-count{display:inline-grid;place-items:center;min-width:16px;height:16px;padding:0 4px;border-radius:4px;box-shadow:0 0 0 1px var(--ad-line);font-size:11px;color:var(--ad-fg)}
.ad-body ul{list-style:none;margin:0;padding:0}
.ad-row{display:flex;align-items:center;gap:12px;height:32px;animation:ad-in .3s both}
.ad-ico{display:grid;place-items:center;width:18px;height:18px;flex:none}.ad-ico svg{width:17px;height:17px}
.ad-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ad-risk{display:inline-flex;align-items:center;gap:3px;height:20px;padding:0 5px;border-radius:4px;font-size:12px;flex:none}
.ad-risk svg{width:12px;height:12px}
.ad-risky{background:#fff1dc;color:#9a3412}.ad-destructive{background:#ffe6e6;color:#b91c1c}
:where(.dark,[data-theme=dark]) .ad-risky{background:#3a2a12;color:#fdba74}:where(.dark,[data-theme=dark]) .ad-destructive{background:#3a1717;color:#fca5a5}
.ad-lock{display:grid;place-items:center;width:26px;height:26px;margin-left:auto;border:0;border-radius:6px;background:none;color:var(--ad-faint);opacity:0;transition:opacity .15s,background .15s}
.ad-row:hover .ad-lock,.ad-lock:focus-visible,.ad-lock.is-on{opacity:1}
.ad-lock:hover{background:var(--ad-chip);color:var(--ad-fg)}.ad-lock svg{width:16px;height:16px}
.ad-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ad :focus-visible{outline:2px solid var(--ad-accent);outline-offset:2px}
@keyframes ad-in{from{opacity:0;transform:translateY(4px)}}
@media(max-width:400px){.ad-levels{gap:6px;padding:14px}.ad-levels button{font-size:12px}.ad-risk{display:none}}
@media(prefers-reduced-motion:reduce){.ad *{animation:none!important;transition:none!important}}
`;

export default AutonomyDial;
