"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type PermissionScope = "once" | "timed" | "always";
export type PermissionDecision = { allow: boolean; scope: PermissionScope; at: number; until?: number };
export type PermissionPreviewItem = { id: string; label: string; meta?: string; icon?: React.ReactNode };

export type PermissionRequestProps = {
  agent?: { name: string; model?: string; avatar?: React.ReactNode };
  action?: string;
  target?: string;
  toolIcon?: React.ReactNode;
  risk?: "safe" | "risky" | "destructive";
  reason?: string;
  preview?: PermissionPreviewItem[];
  previewTitle?: string;
  previewLimit?: number;
  scopes?: PermissionScope[];
  scope?: PermissionScope;
  defaultScope?: PermissionScope;
  onScopeChange?: (scope: PermissionScope) => void;
  /** Minutes a timed grant holds. */
  duration?: number;
  decision?: PermissionDecision | null;
  defaultDecision?: PermissionDecision | null;
  onDecisionChange?: (decision: PermissionDecision | null) => void;
  now?: number;
  className?: string;
};

const Spark = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1c.5 3.6 3.4 6.5 7 7-3.6.5-6.5 3.4-7 7-.5-3.6-3.4-6.5-7-7 3.6-.5 6.5-3.4 7-7Z" fill="#3b82f6" />
  </svg>
);
const PaymentsIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <rect x="1.8" y="3.5" width="12.4" height="9" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.8 6.5h12.4M4.3 10h2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const Receipt = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 1.8h8v12.4l-1.3-.9-1.4.9-1.3-.9-1.3.9-1.4-.9L4 14.2Z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    <path d="M6 5h4M6 7.5h4M6 10h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const fmtLeft = (ms: number) => {
  const m = Math.max(0, Math.ceil(ms / 60000));
  return m >= 60 ? `${Math.floor(m / 60)} цаг ${m % 60} мин үлдсэн` : `${m} мин үлдсэн`;
};

function Card({
  agent = { name: "Үйл ажиллагааны агент" },
  action = "2 захиалгын төлбөрийг буцаах",
  target = "Төлбөрийн систем · бодит горим",
  toolIcon = <PaymentsIcon />,
  risk = "risky",
  reason,
  preview = [],
  previewTitle = "Юу болох вэ",
  previewLimit = 3,
  scopes = ["once", "timed", "always"],
  scope: scopeIn,
  defaultScope = "once",
  onScopeChange,
  duration = 60,
  decision: decisionIn,
  defaultDecision = null,
  onDecisionChange,
  now: nowIn,
  className = "",
}: PermissionRequestProps) {
  const avail = risk === "destructive" ? scopes.filter((s) => s !== "always") : scopes;
  const [scopeLocal, setScopeLocal] = React.useState<PermissionScope>(defaultScope);
  const scope = avail.includes(scopeIn ?? scopeLocal) ? (scopeIn ?? scopeLocal) : avail[0] ?? "once";
  const [decLocal, setDecLocal] = React.useState<PermissionDecision | null>(defaultDecision);
  const decision = decisionIn !== undefined ? decisionIn : decLocal;
  const [showAll, setShowAll] = React.useState(false);
  const [tick, setTick] = React.useState(() => Date.now());
  const now = nowIn ?? tick;
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (nowIn != null || !decision?.until) return;
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [nowIn, decision?.until]);

  const decide = (d: PermissionDecision | null) => {
    if (decisionIn === undefined) setDecLocal(d);
    onDecisionChange?.(d);
  };
  const setScope = (s: PermissionScope) => {
    if (scopeIn === undefined) setScopeLocal(s);
    onScopeChange?.(s);
  };
  const allow = () => {
    const at = Date.now();
    decide({ allow: true, scope, at, until: scope === "timed" ? at + duration * 60000 : undefined });
  };
  const deny = () => decide({ allow: false, scope: "once", at: Date.now() });

  const label = (s: PermissionScope) =>
    s === "once" ? "Зөвхөн энэ удаа" : s === "timed" ? (duration % 60 === 0 ? `${duration / 60} цаг` : `${duration} мин`) : "Үргэлж";
  const allowLabel = scope === "once" ? "Нэг удаа зөвшөөрөх" : scope === "timed" ? `${label("timed")} зөвшөөрөх` : "Үргэлж зөвшөөрөх";

  const expired = decision?.until != null && now >= decision.until;
  if (decision && !expired) {
    return (
      <section className={`pr pr-folded ${className}`}>
        <span className={`pr-fico ${decision.allow ? "ok" : "no"}`}>
          {decision.allow ? (
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="m5.5 8.2 1.8 1.7 3.3-3.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="m6 6 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          )}
        </span>
        <span className="pr-ftext">
          <span>
            <strong>{decision.allow ? "Зөвшөөрсөн" : "Татгалзсан"}</strong>
            <span className="pr-muted"> · {action}</span>
          </span>
          <span className="pr-muted pr-small">
            {decision.allow
              ? decision.scope === "always"
                ? `${agent.name} одооноос эхлэн үүнийг хийж болно`
                : decision.until
                  ? `${agent.name} · ${fmtLeft(decision.until - now)}`
                  : `${agent.name} зөвхөн энэ удаа хийж болно`
              : `Татгалзсан тул ${agent.name} үүнийг хийхгүй`}
          </span>
        </span>
        <button type="button" className="pr-link" onClick={() => decide(null)}>
          {decision.allow && decision.scope !== "once" ? "Цуцлах" : "Өөрчлөх"}
        </button>
      </section>
    );
  }

  const rows = showAll ? preview : preview.slice(0, previewLimit);
  const destructive = risk === "destructive";

  return (
    <section
      ref={ref}
      className={`pr ${destructive ? "pr-destructive" : ""} ${className}`}
      aria-label={`${agent.name}: ${action} зөвшөөрөл хүсэж байна`}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          deny();
        } else if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "BUTTON") {
          e.preventDefault();
          allow();
        }
      }}
    >
      <div className="pr-top">
        <span className="pr-av">{agent.avatar ?? (agent.name.match(/(?<![\p{L}\p{N}])[\p{L}\p{N}]/gu) ?? []).slice(0, 2).join("")}</span>
        <div className="pr-who">
          <div className="pr-title">
            <strong>{agent.name}</strong> <strong>{action}</strong> <span className="pr-muted">зөвшөөрөл хүсэж байна</span>
          </div>
          {target && (
            <div className="pr-target">
              {toolIcon && <span className="pr-tool">{toolIcon}</span>}
              {target}
            </div>
          )}
        </div>
        {risk !== "safe" && (
          <span className={`pr-risk pr-risk-${risk}`}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" /><path d="M8 5v3.5M8 10.8v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            {destructive ? "Буцаах боломжгүй" : "Эрсдэлтэй"}
          </span>
        )}
      </div>
      {reason && <blockquote className="pr-reason">{reason}</blockquote>}
      {preview.length > 0 && (
        <div className="pr-preview">
          <div className="pr-ph">
            {previewTitle} <span className="pr-count">{preview.length}</span>
          </div>
          <ul>
            {rows.map((p) => (
              <li key={p.id}>
                <span className="pr-pico">{p.icon ?? <Receipt />}</span>
                <span className="pr-plabel">{p.label}</span>
                {p.meta && <span className="pr-meta">{p.meta}</span>}
              </li>
            ))}
          </ul>
          {preview.length > previewLimit && (
            <button type="button" className="pr-more" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Хураах" : `Бусад ${preview.length - previewLimit}`}
            </button>
          )}
        </div>
      )}
      <div className="pr-actions">
        {avail.length > 1 && (
          <div className="pr-scopes" role="radiogroup" aria-label="Хэр удаан">
            {avail.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={scope === s} onClick={() => setScope(s)}>
                {label(s)}
              </button>
            ))}
          </div>
        )}
        {destructive && scopes.includes("always") && <p className="pr-note">Буцаах боломжгүй үйлдлийг үргэлж зөвшөөрөх боломжгүй</p>}
        <div className="pr-btns">
          <button type="button" className="pr-deny" onClick={deny}>
            Татгалзах <kbd>ESC</kbd>
          </button>
          <button type="button" className="pr-allow" onClick={allow}>
            {allowLabel} <kbd>↵</kbd>
          </button>
        </div>
      </div>
    </section>
  );
}

export function PermissionRequest(props: PermissionRequestProps) {
  // With no request given, show the demo pair: a decided request and a waiting one.
  if (Object.keys(props).length === 0) {
    return (
      <div className="pr-stack">
        <style>{css}</style>
        <Card
          agent={{ name: "Борлуулалтын агент" }}
          action="40 имэйл илгээх"
          defaultDecision={{ allow: false, scope: "once", at: 0 }}
        />
        <Card
          agent={{ name: "Үйл ажиллагааны агент", avatar: <Spark /> }}
          action="2 захиалгын төлбөрийг буцаах"
          target="Төлбөрийн систем · бодит горим"
          risk="destructive"
          reason="Өнөө өглөөний тасалдлын дараа хоёр захиалгаас давхар төлбөр авсан."
          previewTitle="Буцаалт"
          preview={[
            { id: "4821", label: "Захиалга #4821 · Сараа Б.", meta: "2 удаа төлсөн" },
            { id: "4822", label: "Захиалга #4822 · Тэмүүлэн Г.", meta: "2 удаа төлсөн" },
          ]}
        />
      </div>
    );
  }
  return (
    <>
      <style>{css}</style>
      <Card {...props} />
    </>
  );
}

const css = `
.pr-stack{display:flex;flex-direction:column;gap:8px;width:100%;max-width:422px}
.pr{--pr-bg:#fff;--pr-fg:#18181b;--pr-muted:#65656d;--pr-faint:#65656d;--pr-line:#ececef;--pr-soft:#f4f4f5;--pr-accent:#18181b;--pr-red:#c2361a;--pr-red-bg:#fdecea;--pr-amber:#b45309;--pr-amber-bg:#fdf3dc;width:100%;max-width:422px;background:var(--pr-bg);color:var(--pr-fg);border:1px solid var(--pr-line);border-radius:12px;box-shadow:0 1px 3px #0000000d;font:400 14px/1.45 Inter,system-ui,sans-serif;outline:none}
:where(.dark,[data-theme=dark]) .pr{--pr-bg:#1b1b1e;--pr-fg:#ececef;--pr-muted:#a1a1aa;--pr-faint:#9a9aa2;--pr-line:#2e2e33;--pr-soft:#26262b;--pr-accent:#ececef;--pr-red:#f0603e;--pr-red-bg:#3d1a14;--pr-amber:#f2b04a;--pr-amber-bg:#3a2a10;color-scheme:dark}
.pr *{box-sizing:border-box}.pr button{font:inherit;color:inherit;cursor:pointer}
.pr-muted{color:var(--pr-muted)}.pr-small{font-size:13px}
.pr-folded{display:flex;align-items:center;gap:12px;padding:12px 14px 12px 16px}
.pr-fico{display:grid;place-items:center;width:18px;height:18px;flex:none}.pr-fico svg{width:18px;height:18px}
.pr-fico.no{color:var(--pr-red)}.pr-fico.ok{color:#2f9e5b}
.pr-ftext{display:flex;flex-direction:column;flex:1;min-width:0}
.pr-ftext strong{font-weight:500}
.pr-link{border:0;background:none;padding:6px 8px;border-radius:6px;font-weight:500;font-size:13.5px}
.pr-link:hover{background:var(--pr-soft)}
.pr-top{display:flex;align-items:flex-start;gap:10px;padding:16px 14px 0 16px}
.pr-av{display:grid;place-items:center;width:32px;height:32px;flex:none;border:1px solid var(--pr-line);border-radius:8px;background:var(--pr-bg);font-size:12px;font-weight:600;box-shadow:0 1px 2px #0000000a}
.pr-av svg{width:16px;height:16px}
.pr-who{flex:1;min-width:0}
.pr-title strong{font-weight:500}
.pr-target{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--pr-muted)}
.pr-tool{display:grid;width:12px;height:12px}.pr-tool svg{width:12px;height:12px}
.pr-risk{display:inline-flex;align-items:center;gap:4px;flex:none;height:20px;padding:0 6px;border-radius:5px;font-size:12.5px}
.pr-risk svg{width:11px;height:11px}
.pr-risk-destructive{background:var(--pr-red-bg);color:var(--pr-red)}
.pr-risk-risky{background:var(--pr-amber-bg);color:var(--pr-amber)}
.pr-reason{margin:12px 16px 0 58px;padding:0 0 0 12px;border-left:2px solid var(--pr-line);font-size:13px;color:var(--pr-muted);line-height:1.55}
.pr-preview{margin-top:16px;padding:12px 16px 8px;border-top:1px solid var(--pr-line)}
.pr-ph{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--pr-muted);margin-bottom:6px}
.pr-count{display:inline-grid;place-items:center;min-width:16px;height:16px;padding:0 4px;border:1px solid var(--pr-line);border-radius:4px;font-size:11px}
.pr-preview ul{list-style:none;margin:0;padding:0}
.pr-preview li{display:flex;align-items:center;gap:12px;height:33px}
.pr-pico{display:grid;width:16px;height:16px;color:var(--pr-faint);flex:none}.pr-pico svg{width:16px;height:16px}
.pr-plabel{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pr-meta{color:var(--pr-muted);font-variant-numeric:tabular-nums}
.pr-more{border:0;background:none;padding:4px 0;font-size:13px;color:var(--pr-muted)!important}
.pr-actions{padding:12px 16px 16px;border-top:1px solid var(--pr-line)}
.pr-scopes{display:flex;gap:8px}
.pr-scopes button{flex:1;height:26px;border:1px solid transparent;border-radius:6px;background:var(--pr-soft);font-size:13px;color:var(--pr-muted)}
.pr-scopes button[aria-checked=true]{background:var(--pr-bg);border-color:var(--pr-line);color:var(--pr-fg);box-shadow:0 1px 2px #0000000d}
.pr-note{margin:8px 0 0;font-size:12px;color:var(--pr-muted)}
.pr-btns{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}
.pr-btns button{display:inline-flex;align-items:center;gap:10px;height:30px;padding:0 6px 0 13px;border-radius:7px;font-size:14px;font-weight:500}
.pr-btns kbd{display:inline-grid;place-items:center;min-width:20px;height:18px;padding:0 4px;border-radius:4px;font:400 11px/1 Inter,system-ui,sans-serif}
.pr-deny{border:1px solid var(--pr-line);background:var(--pr-bg)}
.pr-deny kbd{background:var(--pr-soft);color:var(--pr-muted)}
.pr-deny:hover{background:var(--pr-soft)}
.pr-allow{border:1px solid var(--pr-accent);background:var(--pr-accent);color:var(--pr-bg)!important}
.pr-allow kbd{background:#ffffff38;color:inherit}
.pr-destructive .pr-allow kbd{background:none;box-shadow:inset 0 0 0 1px currentColor}
.pr-destructive .pr-allow{background:var(--pr-red);border-color:var(--pr-red);color:#fff!important}
/* dark: the red fill is light (#f0603e), so the label goes dark (5.3:1); white was 3.3:1 */
:where(.dark,[data-theme=dark]) .pr-destructive .pr-allow{color:var(--pr-bg)!important}
:where(.dark,[data-theme=dark]) .pr-destructive .pr-allow kbd{background:none;box-shadow:inset 0 0 0 1px currentColor}
.pr-allow:hover{filter:brightness(1.08)}
.pr :focus-visible{outline:2px solid #3b82f6;outline-offset:2px}
@media(max-width:440px){.pr-reason{margin-left:16px}.pr-btns button{flex:1;justify-content:center}}
@media(prefers-reduced-motion:reduce){.pr *{transition:none!important}}
`;

export default PermissionRequest;
