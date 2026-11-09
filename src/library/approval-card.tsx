"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

const shieldIcon = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1.8 13 3.6v4c0 3-2.1 5.4-5 6.6-2.9-1.2-5-3.6-5-6.6v-4Z" />
  </svg>
);

const mailIcon = (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
    <path d="m2.5 4.5 5.5 4 5.5-4" />
  </svg>
);

export type ApprovalStatus = "pending" | "approved" | "denied";
export type ApprovalCardProps = {
  title?: string;
  description?: React.ReactNode;
  risk?: "low" | "medium" | "high";
  icon?: React.ReactNode;
  details?: { label: string; value: React.ReactNode }[];
  preview?: React.ReactNode;
  children?: React.ReactNode;
  status?: ApprovalStatus;
  defaultStatus?: ApprovalStatus;
  onApprove?: (details: { always: boolean }) => void | Promise<void>;
  onDeny?: (details: { reason: "user" | "timeout" }) => void;
  onEdit?: () => void;
  expiresIn?: number;
  onExpire?: () => void;
  allowAlways?: boolean;
  alwaysLabel?: string;
  approveLabel?: string;
  denyLabel?: string;
  editLabel?: string;
  shortcuts?: boolean;
  label?: React.ReactNode;
  actions?: "tray" | "card";
  className?: string;
};

export function ApprovalCard({
  title = "Send campaign email",
  description = "October product update · Newsletter",
  risk,
  icon = shieldIcon,
  details,
  preview,
  children,
  status,
  defaultStatus = "pending",
  onApprove,
  onDeny,
  onEdit,
  expiresIn,
  onExpire,
  allowAlways = true,
  alwaysLabel = "Always allow this action",
  approveLabel = "Approve",
  denyLabel = "Deny",
  editLabel = "Edit",
  shortcuts = true,
  label,
  actions = "card",
  className = "",
}: ApprovalCardProps) {
  const [internal, setInternal] = React.useState<ApprovalStatus>(defaultStatus);
  const state = status ?? internal;
  const [always, setAlways] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [remaining, setRemaining] = React.useState(expiresIn);
  const locked = React.useRef(false);
  const expired = React.useRef(false);
  const mounted = React.useRef(true);
  const root = React.useRef<HTMLDivElement>(null);
  const resolved = React.useRef<HTMLDivElement>(null);
  const hadFocus = React.useRef(false);
  const id = React.useId();
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  React.useEffect(() => {
    setRemaining(expiresIn);
    expired.current = false;
    if (state === "pending") {
      setError("");
      setAlways(false);
    } else if (
      hadFocus.current ||
      root.current?.contains(document.activeElement)
    )
      resolved.current?.focus();
    hadFocus.current = false;
  }, [state, expiresIn]);
  React.useEffect(() => {
    if (
      state !== "pending" ||
      expiresIn == null ||
      hovered ||
      focused ||
      busy ||
      expired.current
    )
      return;
    const timer = window.setInterval(
      () => setRemaining((value) => Math.max(0, (value ?? expiresIn) - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [state, expiresIn, hovered, focused, busy]);
  const finish = (next: ApprovalStatus) => {
    hadFocus.current = !!root.current?.contains(document.activeElement);
    if (status === undefined) setInternal(next);
  };
  const deny = (reason: "user" | "timeout") => {
    if (locked.current || state !== "pending") return;
    try {
      if (reason === "timeout") onExpire?.();
      onDeny?.({ reason });
      finish("denied");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Could not deny this request. Try again.",
      );
    }
  };
  const denyRef = React.useRef(deny);
  denyRef.current = deny;
  React.useEffect(() => {
    if (state === "pending" && remaining === 0 && !expired.current && !busy) {
      expired.current = true;
      denyRef.current("timeout");
    }
  }, [remaining, state, busy]);
  const approve = async () => {
    if (locked.current || state !== "pending") return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      await onApprove?.({ always });
      if (mounted.current) finish("approved");
    } catch (failure) {
      if (mounted.current)
        setError(
          failure instanceof Error
            ? failure.message
            : "Approval failed. Try again.",
        );
    } finally {
      locked.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const kbdApprove = "\u2318\u21b5";
  const buttons = (
    <div className="apv-actions">
      {onEdit && (
        <button
          type="button"
          className="apv-btn apv-ghost"
          aria-disabled={busy}
          onClick={() => {
            if (!busy) onEdit();
          }}
        >
          {editLabel}
        </button>
      )}
      <button
        type="button"
        className="apv-btn apv-ghost"
        aria-disabled={busy}
        aria-keyshortcuts="Escape"
        onClick={() => deny("user")}
      >
        {denyLabel}
        {shortcuts && (
          <kbd className="apv-kbd" aria-hidden="true">
            Esc
          </kbd>
        )}
      </button>
      <button
        type="button"
        className="apv-btn apv-primary"
        aria-disabled={busy}
        aria-keyshortcuts="Meta+Enter Control+Enter"
        onClick={() => void approve()}
      >
        {busy ? "Approving…" : approveLabel}
        {busy ? (
          <span className="apv-spin" aria-hidden="true" />
        ) : (
          shortcuts && (
            <kbd className="apv-kbd" aria-hidden="true">
              {kbdApprove}
            </kbd>
          )
        )}
      </button>
    </div>
  );
  const expiry =
    remaining != null ? (
      <>
        <span id={`${id}-expiry`} className="apv-hidden">
          Expires in {remaining} seconds unless approved. Paused while hovered or focused.
        </span>
        <span className={`apv-expiry ${remaining <= 10 ? "warn" : ""}`} aria-hidden="true">
          Expires in {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
        </span>
      </>
    ) : null;
  const tray = actions === "tray" || !!label;
  return (
    <div
      ref={root}
      className={`apv ${tray ? "apv-has-tray" : ""} ${className}`}
      role="group"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description${remaining == null ? "" : ` ${id}-expiry`}`}
      aria-busy={busy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (state !== "pending") return;
        if (event.key === "Escape") {
          event.preventDefault();
          deny("user");
        }
        if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          void approve();
        }
      }}
    >
      <style>{css}</style>
      {label && <div className="apv-label">{label}</div>}
      {state === "pending" ? (
        <>
          <div className="apv-card">
            <div className="apv-head">
              <span className="apv-icon">{icon}</span>
              <div className="apv-titles">
                <h3 id={`${id}-title`}>{title}</h3>
                <div id={`${id}-description`} className="apv-desc">
                  {description}
                </div>
              </div>
              {risk && (
                <span className={`apv-risk ${risk}`}>
                  {risk[0].toUpperCase() + risk.slice(1)}
                  <span className="apv-risk-word"> risk</span>
                </span>
              )}
            </div>
            {((preview ?? children) || !!details?.length) && (
              <div className="apv-body">
                {(preview ?? children) && <div className="apv-preview">{preview ?? children}</div>}
                {!!details?.length && (
                  <dl className="apv-details">
                    {details.map((detail, index) => (
                      <div key={`${detail.label}-${index}`}>
                        <dt>{detail.label}</dt>
                        <dd>{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}
            {error && (
              <p role="alert" className="apv-error">
                {error}
              </p>
            )}
            <div className="apv-foot">
              {allowAlways && (
                <label className="apv-check">
                  <input
                    type="checkbox"
                    checked={always}
                    aria-disabled={busy}
                    onChange={(event) => {
                      if (!busy) setAlways(event.target.checked);
                    }}
                  />
                  <span className="apv-box" aria-hidden="true">
                    <svg viewBox="0 0 12 12"><path d="m2.5 6.2 2.3 2.3 4.7-5" /></svg>
                  </span>
                  {alwaysLabel}
                </label>
              )}
              {!tray && expiry}
              {!tray && buttons}
            </div>
          </div>
          {tray && (
            <div className="apv-tray">
              {expiry}
              {buttons}
            </div>
          )}
        </>
      ) : (
        <div ref={resolved} tabIndex={-1} className="apv-resolved">
          <span className={`apv-mark ${state}`} aria-hidden="true">
            <svg viewBox="0 0 16 16">
              {state === "approved" ? <path d="m3.5 8.4 3 3 6-6.6" /> : <path d="m4.5 4.5 7 7m0-7-7 7" />}
            </svg>
          </span>
          <strong id={`${id}-title`}>{title}</strong>
          <span id={`${id}-description`} className="apv-state">
            {state === "approved" ? "Approved" : "Denied"}
          </span>
        </div>
      )}
      <span className="apv-hidden" role="status">
        {state !== "pending" ? `${state === "approved" ? "Approved" : "Denied"}: ${title}` : ""}
      </span>
    </div>
  );
}

const css = `
.apv{--apv-bg:#fff;--apv-fg:#18181b;--apv-muted:#71717a;--apv-faint:#a1a1aa;--apv-line:#ececef;--apv-soft:#f4f4f5;--apv-amber:#a16207;--apv-amber-bg:#fdf3d7;--apv-red:#c2410c;--apv-red-bg:#fde8e3;--apv-green:#16a34a;--apv-accent:#4f7cf0;width:100%;max-width:420px;color:var(--apv-fg);font:400 14px/1.45 Inter,system-ui,sans-serif;container:apv/inline-size}
:where(.dark,[data-theme=dark]) .apv{--apv-bg:#1b1b1e;--apv-fg:#ececef;--apv-muted:#a1a1aa;--apv-faint:#71717a;--apv-line:#2e2e33;--apv-soft:#242428;--apv-amber:#fbbf24;--apv-amber-bg:#3a2f12;--apv-red:#fb923c;--apv-red-bg:#3a1e18;color-scheme:dark}
.apv *{box-sizing:border-box}.apv button{font:inherit;cursor:pointer}
.apv.apv-has-tray{background:var(--apv-soft);border-radius:16px;padding:4px}
.apv-label{padding:6px 10px 8px;font-size:12px;color:var(--apv-muted)}
.apv-card{background:var(--apv-bg);border:1px solid var(--apv-line);border-radius:14px;box-shadow:0 1px 3px #0000000a;padding:16px 15px 15px;animation:apv-in .25s ease-out}
.apv-head{display:flex;align-items:flex-start;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--apv-line)}
.apv-icon{display:grid;place-items:center;width:32px;height:32px;flex:none;border:1px solid var(--apv-line);border-radius:8px;color:var(--apv-fg)}
.apv-icon svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round}
.apv-titles{flex:1;min-width:0}
.apv-titles h3{margin:0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.apv-desc{color:var(--apv-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
.apv-risk{flex:none;padding:0 7px;border-radius:5px;font-size:12.5px;line-height:21px;background:var(--apv-soft);color:var(--apv-muted)}
.apv-risk.medium{background:var(--apv-amber-bg);color:var(--apv-amber)}.apv-risk.high{background:var(--apv-red-bg);color:var(--apv-red)}
.apv-body{padding:14px 0;border-bottom:1px solid var(--apv-line);display:grid;gap:10px}
.apv-details{margin:0;display:grid;gap:6px}
.apv-details>div{display:grid;grid-template-columns:62px minmax(0,1fr);gap:0}
.apv-details dt{color:var(--apv-muted)}.apv-details dd{margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.apv-error{margin:10px 0 0;color:var(--apv-red);font-size:13px}
.apv-foot{display:flex;align-items:center;gap:10px;padding-top:14px}
.apv-check{position:relative;display:flex;font-size:13.5px;align-items:center;gap:8px;color:var(--apv-faint);cursor:pointer;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:auto}
.apv-check input{position:absolute;opacity:0;width:16px;height:16px;margin:0;cursor:pointer}
.apv-box{display:grid;place-items:center;width:16px;height:16px;flex:none;border:1px solid var(--apv-line);border-radius:4px;background:var(--apv-bg);transition:background .15s,border-color .15s}
.apv-box svg{width:11px;height:11px;fill:none;stroke:var(--apv-bg);stroke-width:1.8;stroke-linecap:round;transform:scale(0);transition:transform .15s}
.apv-check input:checked+.apv-box{background:var(--apv-fg);border-color:var(--apv-fg)}.apv-check input:checked+.apv-box svg{transform:scale(1)}
.apv-check input:checked~*{color:var(--apv-fg)}
.apv-check input:focus-visible+.apv-box{outline:2px solid var(--apv-accent);outline-offset:2px}
.apv-expiry{font-size:13px;color:var(--apv-faint);white-space:nowrap;font-variant-numeric:tabular-nums}.apv-expiry.warn{color:var(--apv-amber)}
.apv-actions{display:flex;align-items:center;gap:4px;flex:none}
.apv-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:34px;padding:0 11px;border-radius:8px;border:0;font-weight:500;transition:transform .12s,background .15s}
.apv-btn:active{transform:scale(.97)}.apv-btn[aria-disabled=true]{cursor:wait;opacity:.75}
.apv-ghost{background:none;color:var(--apv-muted)}.apv-ghost:hover{background:var(--apv-soft);color:var(--apv-fg)}
.apv-primary{background:var(--apv-fg);color:var(--apv-bg)}.apv-primary:hover{filter:brightness(1.15)}
.apv-kbd{font:500 10px/1 Inter,system-ui,sans-serif;padding:3px 5px;border-radius:4px;background:var(--apv-soft);color:var(--apv-faint)}
.apv-primary .apv-kbd{background:color-mix(in srgb,var(--apv-bg) 16%,transparent);color:color-mix(in srgb,var(--apv-bg) 70%,transparent)}
.apv-spin{width:13px;height:13px;border:1.6px solid currentColor;border-right-color:transparent;border-radius:50%;animation:apv-spin .8s linear infinite}
.apv-tray{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:8px 6px 4px 10px}
.apv-tray .apv-expiry{margin-right:auto}
.apv-resolved{display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--apv-bg);border:1px solid var(--apv-line);border-radius:12px;outline:none;animation:apv-in .3s ease-out}
.apv-resolved strong{font-weight:500;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.apv-mark{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:color-mix(in srgb,var(--apv-green) 14%,transparent);color:var(--apv-green)}
.apv-mark.denied{background:var(--apv-soft);color:var(--apv-muted)}
.apv-mark svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:20;animation:apv-draw .4s ease-out}
.apv-state{color:var(--apv-muted);font-size:13px}
.apv-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.apv-people{display:flex;align-items:center;gap:8px;min-width:0}
.apv-avs{display:flex}.apv-avs span{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;border:2px solid var(--apv-bg);margin-left:-6px;font-size:10px;font-weight:600;color:#3f3f46}.apv-avs span:first-child{margin-left:0}
.apv-people em{font-style:normal;color:var(--apv-muted)}
.apv :focus-visible{outline:2px solid var(--apv-accent);outline-offset:2px}
@keyframes apv-in{from{opacity:0;filter:blur(2px);transform:translateY(3px)}}
@keyframes apv-spin{to{transform:rotate(360deg)}}
@keyframes apv-draw{from{stroke-dashoffset:20}}
@container apv (max-width:400px){.apv-foot{flex-wrap:wrap}.apv-actions{width:100%}.apv-actions .apv-btn{flex:1}.apv-kbd{display:none}}
@container apv (max-width:340px){.apv-risk-word{display:none}}
@media(pointer:coarse){.apv-kbd{display:none}}
@media(prefers-reduced-motion:reduce){.apv *{animation:none!important;transition:none!important}.apv-spin{animation:apv-spin 2s linear infinite!important}}
`;

const people = [
  { n: "M", c: "#e9e3fb" },
  { n: "J", c: "#dfeafc" },
  { n: "S", c: "#fbe6dc" },
  { n: "A", c: "#ddf3e6" },
];

export function Demo() {
  const [key, setKey] = React.useState(0);
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <style>{`.apv-demo-ask{display:flex;align-items:center;gap:10px;margin:0 0 12px -36px;font:400 14px/1.45 Inter,system-ui,sans-serif;color:#18181b}.apv-demo-ask i{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#18181b;color:#fff;flex:none}.apv-demo-ask p{margin:0;padding:7px 13px;border-radius:12px;background:#f0f0f2}:where(.dark,[data-theme=dark]) .apv-demo-ask{color:#ececef}:where(.dark,[data-theme=dark]) .apv-demo-ask i{background:#ececef;color:#18181b}:where(.dark,[data-theme=dark]) .apv-demo-ask p{background:#2a2a2f}@media(max-width:520px){.apv-demo-ask{margin-left:0}}`}</style>
      <div className="apv-demo-ask">
        <i aria-hidden="true">
          <svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 2c.4 3.2 2.8 5.6 6 6-3.2.4-5.6 2.8-6 6-.4-3.2-2.8-5.6-6-6 3.2-.4 5.6-2.8 6-6Z" fill="currentColor" /></svg>
        </i>
        <p>I drafted the October newsletter. Ready to send?</p>
      </div>
      <ApprovalCard
        key={key}
        icon={mailIcon}
        risk="medium"
        preview={
          <div className="apv-people">
            <span className="apv-avs">
              {people.map((p) => (
                <span key={p.n} style={{ background: p.c }}>{p.n}</span>
              ))}
            </span>
            <span>Mia, Jonas, Sara, Alex</span>
            <em>+38 more</em>
          </div>
        }
        details={[
          { label: "Subject", value: "What's new in October" },
          { label: "Send", value: "Today, 9:00 AM" },
        ]}
        onApprove={() => new Promise((resolve) => window.setTimeout(resolve, 900))}
        onDeny={() => window.setTimeout(() => setKey((value) => value + 1), 1800)}
      />
    </div>
  );
}

export default Demo;
