/**
 * AgentConsent — an agent asks for a scoped, timed grant; a person decides
 * (2026-11-12, the «Эрхийн хүсэлт» card held to the scenario
 * standard). Data in props: agent, action, target, risk, reason, what it
 * will see (preview), scopes, duration. The decision is controlled or
 * internal; `onDecide` reports it.
 *
 * Story (catalog / marketing, `demo`), with Agent Trail's detail
 * (2026-11-13): the request arrives with its trail — «Ажлыг эхлүүлсэн» →
 * «Хэрэгцээт эрхийг тодорхойлов» (what it will see enters as tagged
 * sub-rows, one by one) → «Таны шийдвэр» (a gate, waiting) — and a «2/3»
 * counter; the scope is chosen → waiting on the person (the allow button
 * pulses) → allowed (or declined): the gate ticks, then the folded result
 * («Зөвшөөрлөө · … · Өөрчлөх») → rest → loop. Without `demo` it is a
 * plain interactive card. Destructive actions never offer «always».
 */
import * as React from "react";
import { Icon, type IconName } from "../company/icons";
import { useScenario, MotionControls, MotionStyles, type ScenarioStep } from "../motion";
import { Badge, Button, IconTile, PrimitiveStyles, Tabs, type StatusTone } from "./primitives";
import { AgentTrail, type TrailStep } from "../library/agent-trail";

export type ConsentScope = "once" | "timed" | "always";
export type ConsentDecision = { allow: boolean; scope: ConsentScope; until?: string };
export type ConsentRisk = "safe" | "risky" | "destructive";

export type AgentConsentLabels = {
  title: string;
  preview: string;
  reason: string;
  allow: (scope: ConsentScope, durationLabel: string) => string;
  deny: string;
  change: string;
  allowed: string;
  denied: string;
  waiting: string;
  scopes: Record<ConsentScope, string>;
  risk: Record<ConsentRisk, string>;
  scopeLabel: string;
  /** The trail above the decision. */
  trail: { title: string; started: string; scoped: string; decide: string; reading: string };
};
export const agentConsentLabelsMn: AgentConsentLabels = {
  title: "Эрхийн хүсэлт",
  preview: "Юу харагдах вэ",
  reason: "Яагаад",
  allow: (s, d) => (s === "once" ? "Нэг удаа зөвшөөрөх" : s === "timed" ? `${d} зөвшөөрөх` : "Үргэлж зөвшөөрөх"),
  deny: "Татгалзах",
  change: "Өөрчлөх",
  allowed: "Зөвшөөрлөө",
  denied: "Татгалзлаа",
  waiting: "Таны шийдвэрийг хүлээж байна",
  scopes: { once: "Нэг удаа", timed: "Хугацаатай", always: "Үргэлж" },
  risk: { safe: "Аюулгүй", risky: "Эрсдэлтэй", destructive: "Буцаахгүй" },
  scopeLabel: "Хамрах хүрээ",
  trail: { title: "Агентын явц", started: "Ажлыг эхлүүлсэн", scoped: "Хэрэгцээт эрхийг тодорхойлов", decide: "Таны шийдвэр", reading: "Шалгаж байна" },
};

const RISK_TONE: Record<ConsentRisk, StatusTone> = { safe: "done", risky: "needs-you", destructive: "error" };

export type AgentConsentProps = {
  agent: { name: string; icon?: IconName };
  action: string;
  target: string;
  targetIcon?: IconName;
  risk?: ConsentRisk;
  reason?: string;
  preview?: { label: string; meta?: string; icon?: IconName }[];
  scopes?: ConsentScope[];
  /** Minutes a timed grant holds. */
  duration?: number;
  decision?: ConsentDecision | null;
  defaultDecision?: ConsentDecision | null;
  onDecide?: (d: ConsentDecision | null) => void;
  /** Play the story with this outcome (catalog, marketing). */
  demo?: { allow: boolean; scope: ConsentScope };
  labels?: Partial<AgentConsentLabels>;
  className?: string;
};

type Stage = "request" | "scope" | "waiting" | "decided";
const STORY: ScenarioStep<Stage>[] = [
  { state: "request", hold: 1400 },
  { state: "scope", hold: 1200 },
  { state: "waiting", hold: 1300 },
  { state: "decided", hold: 2200 },
];

export function AgentConsent({
  agent,
  action,
  target,
  targetIcon = "key-round",
  risk = "risky",
  reason,
  preview = [],
  scopes = ["once", "timed", "always"],
  duration = 60,
  decision: decisionIn,
  defaultDecision = null,
  onDecide,
  demo,
  labels,
  className = "",
}: AgentConsentProps) {
  const L = { ...agentConsentLabelsMn, ...labels };
  const avail = risk === "destructive" ? scopes.filter((s) => s !== "always") : scopes;
  const [scopeOwn, setScope] = React.useState<ConsentScope>(avail[0] ?? "once");
  const [own, setOwn] = React.useState<ConsentDecision | null>(defaultDecision);
  const [touched, setTouched] = React.useState(false);
  const sc = useScenario<Stage, HTMLElement>(demo ? STORY : [{ state: "request", hold: 1000 }], { rest: 2600 });
  const playing = !!demo && !touched;
  const stage: Stage = playing ? sc.state : "request";
  const durationLabel = duration % 60 === 0 ? `${duration / 60} цаг` : `${duration} мин`;
  const scope: ConsentScope = playing && stage !== "request" ? (avail.includes(demo!.scope) ? demo!.scope : avail[0]) : scopeOwn;
  const decision: ConsentDecision | null = playing
    ? stage === "decided"
      ? { allow: demo!.allow, scope }
      : null
    : decisionIn !== undefined
      ? decisionIn
      : own;
  const decide = (d: ConsentDecision | null) => {
    setTouched(true);
    if (decisionIn === undefined) setOwn(d);
    onDecide?.(d);
  };
  const scopeName = (s: ConsentScope) => (s === "timed" ? durationLabel : L.scopes[s]);

  // the trail: what the agent did before it asked, and the gate it waits on
  const began = React.useRef<Record<string, number>>({});
  if (!began.current[stage]) began.current[stage] = Date.now();
  const reading = playing && stage === "request";
  const trail: TrailStep[] = [
    { id: "start", title: L.trail.started, state: "done", duration: 4000 },
    {
      id: "scope",
      title: L.trail.scoped,
      state: reading ? "running" : "done",
      status: L.trail.reading,
      startedAt: reading ? began.current.request : undefined,
      duration: 1400,
      substeps: preview.map((p, i) => ({
        id: `${p.label}-${i}`,
        title: p.label,
        tag: L.scopes[scope],
        tagTone: (risk === "destructive" ? 4 : risk === "risky" ? 1 : 3) as 1 | 3 | 4,
        detail: p.meta,
      })),
    },
    {
      id: "decide",
      title: L.trail.decide,
      state: decision ? "done" : stage === "waiting" || !playing ? "waiting" : "pending",
      gate: true,
    },
  ];

  return (
    <section ref={sc.ref} className={`ts-loop-region ts-consent ${className}`} {...sc.attrs} data-controls="hover" data-stage={stage} aria-label={L.title}>
      <PrimitiveStyles />
      <MotionStyles />
      <style href="ts-agent-consent" precedence="default">
        {CSS}
      </style>
      {decision ? (
        <div className={`ts-consent-folded ts-enter ${decision.allow ? "is-ok" : "is-no"}`}>
          <IconTile icon={decision.allow ? "check" : "x"} tone={decision.allow ? "done" : "error"} size="M" />
          <span className="ts-consent-ftext">
            <span>
              <strong>{decision.allow ? L.allowed : L.denied}</strong>
              <span className="ts-consent-muted"> · {action}</span>
            </span>
            <span className="ts-consent-muted ts-consent-small">
              {agent.name}
              {decision.allow ? ` · ${scopeName(decision.scope)}` : ""}
            </span>
          </span>
          <Button size="sm" variant="ghost" icon="pencil" onClick={() => decide(null)}>
            {L.change}
          </Button>
        </div>
      ) : (
        <div className="ts-consent-card">
          <header className="ts-consent-head">
            <IconTile icon={agent.icon ?? "bot"} tone="electric" size="M" />
            <span className="ts-consent-who">
              <b>{agent.name}</b>
              <span className="ts-consent-muted">
                {action} · <Icon name={targetIcon} size={13} /> {target}
              </span>
            </span>
            <Badge tone={RISK_TONE[risk]}>{L.risk[risk]}</Badge>
          </header>
          <div className="ts-consent-trail">
            <AgentTrail title={L.trail.title} steps={trail} expanded={reading || !playing ? ["scope"] : []} />
          </div>
          {reason && (
            <p className="ts-consent-reason">
              <Icon name="circle-help" size={14} />
              <span>
                <b>{L.reason}:</b> {reason}
              </span>
            </p>
          )}
          {preview.length > 0 && (
            <div className="ts-consent-preview">
              <span className="ts-consent-h">
                <Icon name="search" size={13} />
                {L.preview}
              </span>
              <ul>
                {preview.map((p, i) => (
                  <li key={`${p.label}-${i}`} style={{ "--i": i } as React.CSSProperties}>
                    <Icon name={p.icon ?? "file-text"} size={14} />
                    <span>{p.label}</span>
                    {p.meta && <small>{p.meta}</small>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="ts-consent-scope" data-on={stage !== "request" || undefined}>
            <Tabs
              variant="segmented"
              size="sm"
              label={L.scopeLabel}
              value={scope}
              onChange={(v) => (setTouched(true), setScope(v))}
              items={avail.map((s) => ({ value: s, label: scopeName(s), icon: s === "once" ? "circle-dot" : s === "timed" ? "clock" : "shield-check" }))}
            />
          </div>
          <div className="ts-consent-actions">
            {stage === "waiting" && (
              <span className="ts-consent-wait" role="status">
                <span className="ts-loop ts-loop-breathe">
                  <Icon name="hourglass" size={14} />
                </span>
                {L.waiting}
              </span>
            )}
            <Button size="sm" variant="ghost" icon="x" onClick={() => decide({ allow: false, scope: "once" })}>
              {L.deny}
            </Button>
            <Button size="sm" icon="check" className={stage === "waiting" ? "ts-consent-pulse" : undefined} onClick={() => decide({ allow: true, scope })}>
              {L.allow(scope, durationLabel)}
            </Button>
          </div>
        </div>
      )}
      {demo && sc.loopState !== "reduced" && (
        <MotionControls
          onReplay={() => (setTouched(false), setOwn(null), sc.replay())}
          paused={sc.paused}
          onTogglePause={sc.togglePaused}
        />
      )}
    </section>
  );
}

const CSS = `
.ts-consent-trail .atr{max-width:none;padding:0;border:0;box-shadow:none;background:none;--atr-bg:transparent;--atr-fg:var(--ts-fg,#080808);--atr-muted:var(--ts-muted,#5e5a52);--atr-faint:var(--ts-muted,#5e5a52);--atr-line:var(--ts-line,#d8d3c6);--atr-accent:var(--ts-accent-fg,#1b5cff);font-family:inherit;font-size:13.5px}
.ts-consent-trail .atr-title{font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-consent-trail .atr-step{animation:ts-consent-row .42s var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both}
.ts-consent-trail .atr-step:nth-child(2){animation-delay:.12s}.ts-consent-trail .atr-step:nth-child(3){animation-delay:.24s}
.ts-consent-trail .atr-pending .atr-name{color:var(--ts-muted)}
.ts-consent-preview li{animation:ts-consent-row .42s var(--ts-motion-spring-settle,cubic-bezier(.34,1.56,.64,1)) both;animation-delay:calc(var(--i,0) * 120ms + .3s)}
@keyframes ts-consent-row{from{opacity:0;transform:translateY(4px)}}
@media (prefers-reduced-motion:reduce){.ts-consent-trail .atr-step,.ts-consent-preview li{animation:none}}
.ts-consent{max-width:520px;font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg,#080808)}
.ts-consent-card,.ts-consent-folded{border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee);box-shadow:var(--ts-elevation,none)}
.ts-consent-card{display:grid;gap:var(--ts-space-4,16px);padding:var(--ts-space-4,16px)}
.ts-consent[data-stage=request] .ts-consent-card{animation:ts-enter var(--ts-motion-spring-soft-duration,700ms) var(--ts-motion-spring-soft,ease-out) both}
.ts-consent-head{display:flex;align-items:center;gap:12px;min-width:0}
.ts-consent-who{display:grid;gap:2px;min-width:0;flex:1}
.ts-consent-who b{font-size:14px}
.ts-consent-who .ts-consent-muted{display:inline-flex;align-items:center;gap:4px;flex-wrap:wrap}
.ts-consent-muted{color:var(--ts-muted,#5e5a52);font-size:13px}
.ts-consent-small{font-size:12px}
.ts-consent-reason{display:flex;gap:8px;margin:0;font-size:13.5px;line-height:1.5;color:var(--ts-muted,#5e5a52)}
.ts-consent-reason .cv-icon{flex:none;margin-top:3px}
.ts-consent-reason b{color:var(--ts-fg,#080808);font-weight:600}
.ts-consent-preview{display:grid;gap:6px;padding:12px;border-radius:var(--ts-radius-control,8px);background:var(--ts-soft,#efebe1)}
.ts-consent-h{display:inline-flex;align-items:center;gap:6px;font:600 11px var(--ts-font-mono,"IBM Plex Mono",monospace);letter-spacing:.06em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-consent-preview ul{display:grid;gap:4px;margin:0;padding:0;list-style:none}
.ts-consent-preview li{display:flex;align-items:center;gap:8px;font-size:13px}
.ts-consent-preview small{margin-left:auto;font:500 11px var(--ts-font-mono,"IBM Plex Mono",monospace);color:var(--ts-muted,#5e5a52)}
.ts-consent-scope{transition:opacity var(--ts-motion-dur-sm,200ms)}
.ts-consent-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px}
.ts-consent-wait{display:inline-flex;align-items:center;gap:6px;margin-right:auto;font-size:12.5px;color:var(--ts-status-needs-you-fg,#a33e0b)}
.ts-consent-pulse{box-shadow:0 0 0 0 color-mix(in srgb,var(--ts-accent-strong,#1b5cff) 45%,transparent);animation:ts-consent-pulse 1.6s var(--ts-motion-ease-loop,ease-in-out) infinite}
@keyframes ts-consent-pulse{70%{box-shadow:0 0 0 8px transparent}100%{box-shadow:0 0 0 0 transparent}}
.ts-consent-folded{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 14px}
.ts-consent-ftext{display:grid;gap:2px;flex:1;min-width:0;font-size:14px}
@media (max-width:480px){.ts-consent-actions{justify-content:stretch}.ts-consent-actions .ts-btn{flex:1}.ts-consent-wait{flex-basis:100%}}
@media (prefers-reduced-motion:reduce){.ts-consent-pulse,.ts-consent[data-stage=request] .ts-consent-card{animation:none}}
`;
