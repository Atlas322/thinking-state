/**
 * AgentAvatar (2026-11-17, screens.22): who an agent is, at a glance — a role icon in a small tile
 * and, when a status is given, a mark on its corner. One avatar for every agent card (AgentFleet,
 * AgentLanes, AgentHandoff, AgentQueue, AppShell · Агентууд), so an agent looks the same everywhere.
 *
 * The role is told by the icon, the status by the mark's shape as well as its colour (circle =
 * running, diamond = needs you, square = error, check = done, ring = idle) and by the label.
 * Colours come from the shared status tokens (--ts-status-*); the tile is the neutral surface.
 *
 *   <AgentAvatar role="writer" status="running" />
 *   <AgentAvatar role={agentRoleFrom("Кодын агент")} status={agentStatusFrom("failed")} decorative />
 *
 * Icons: Lucide (ISC), drawn at the system stroke (--ts-icon-stroke, 1.5).
 */
import * as React from "react";

export type AgentRole = "agent" | "planner" | "writer" | "designer" | "coder" | "support" | "research" | "ops" | "finance" | "sales";
export type AgentAvatarStatus = "running" | "needs-you" | "error" | "done" | "idle";
export const AGENT_ROLES: AgentRole[] = ["agent", "planner", "writer", "designer", "coder", "support", "research", "ops", "finance", "sales"];

export type AgentAvatarLabels = { roles: Record<AgentRole, string>; status: Record<AgentAvatarStatus, string> };
export const agentAvatarLabelsMn: AgentAvatarLabels = {
  roles: { agent: "Агент", planner: "Төлөвлөгч агент", writer: "Бичигч агент", designer: "Дизайны агент", coder: "Кодын агент", support: "Тусламжийн агент", research: "Судлаач агент", ops: "Үйл ажиллагааны агент", finance: "Санхүүгийн агент", sales: "Борлуулалтын агент" },
  status: { running: "ажиллаж байна", "needs-you": "таныг хүлээж байна", error: "алдаатай", done: "дууссан", idle: "зогссон" },
};

export type AgentAvatarProps = {
  role?: AgentRole;
  status?: AgentAvatarStatus;
  /** Tile edge in px (default 26). The icon is 60% of it. */
  size?: number;
  /** The row already names the agent and its status: hide the avatar from assistive tech. */
  decorative?: boolean;
  labels?: AgentAvatarLabels;
  className?: string;
};

/** Lucide paths (viewBox 24). One icon per role. */
const ICON: Record<AgentRole, React.ReactNode> = {
  agent: <><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></>,
  planner: <><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></>,
  writer: <><path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" /></>,
  designer: <><path d="M22 6H2" /><path d="M22 18H2" /><path d="M6 2v20" /><path d="M18 2v20" /></>,
  coder: <><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>,
  support: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><path d="m4.93 4.93 4.24 4.24" /><path d="m14.83 9.17 4.24-4.24" /><path d="m14.83 14.83 4.24 4.24" /><path d="m9.17 14.83-4.24 4.24" /></>,
  research: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  ops: <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />,
  finance: <><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01" /><path d="M18 12h.01" /></>,
  sales: <><path d="M22 7 13.5 15.5l-5-5L2 17" /><path d="M16 7h6v6" /></>,
};

const SHAPE: Record<AgentAvatarStatus, string> = { running: "circle", "needs-you": "diamond", error: "square", done: "check", idle: "ring" };

const CSS = `
.aav{position:relative;display:inline-grid;place-items:center;flex:none;width:var(--aav-size,26px);height:var(--aav-size,26px);border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:var(--ts-fg);vertical-align:middle}
.aav-icon{width:60%;height:60%;fill:none;stroke:currentColor;stroke-width:var(--ts-icon-stroke,1.5);stroke-linecap:round;stroke-linejoin:round}
.aav-dot{position:absolute;right:-3px;bottom:-3px;display:grid;place-items:center;width:10px;height:10px;box-sizing:border-box;border:1.5px solid var(--ts-surface);background:var(--aav-mark);color:var(--ts-surface)}
.aav-dot[data-shape="circle"]{border-radius:50%}
.aav-dot[data-shape="diamond"]{transform:rotate(45deg);border-radius:1px}
.aav-dot[data-shape="square"]{border-radius:1px}
.aav-dot[data-shape="check"]{border-radius:50%}
.aav-dot[data-shape="check"] svg{width:6px;height:6px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.aav-dot[data-shape="ring"]{border-radius:50%;background:var(--ts-surface);box-shadow:inset 0 0 0 1.5px var(--aav-mark)}
.aav[data-status="running"]{--aav-mark:var(--ts-status-running-fg)}
.aav[data-status="needs-you"]{--aav-mark:var(--ts-status-needs-you-fg)}
.aav[data-status="error"]{--aav-mark:var(--ts-status-error-fg)}
.aav[data-status="done"]{--aav-mark:var(--ts-status-done-fg)}
.aav[data-status="idle"]{--aav-mark:var(--ts-muted)}
.aav[data-status="running"] .aav-dot{animation:aav-pulse var(--ts-motion-loop-period,2.4s) var(--ts-motion-ease-loop,ease-in-out) infinite}
@keyframes aav-pulse{50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){.aav[data-status="running"] .aav-dot{animation:none}}
`;

export function AgentAvatar({ role = "agent", status, size, decorative = false, labels = agentAvatarLabelsMn, className = "" }: AgentAvatarProps) {
  const name = labels.roles[role] + (status ? ` · ${labels.status[status]}` : "");
  return (
    <span
      className={`aav ${className}`.trim()}
      data-role={role}
      data-status={status}
      style={size ? ({ "--aav-size": `${size}px` } as React.CSSProperties) : undefined}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": name, title: name })}
    >
      <style>{CSS}</style>
      <svg className="aav-icon" viewBox="0 0 24 24" aria-hidden="true">{ICON[role]}</svg>
      {status && (
        <span className="aav-dot" data-shape={SHAPE[status]}>
          {status === "done" && <svg viewBox="0 0 8 8" aria-hidden="true"><path d="M1.5 4.2 3.3 6l3.2-3.8" /></svg>}
        </span>
      )}
    </span>
  );
}

const ROLE_WORDS: [RegExp, AgentRole][] = [
  [/төлөвлө/i, "planner"], [/бичигч|бичвэр|контент/i, "writer"], [/дизайн/i, "designer"], [/код|хөгжүүл|вэб/i, "coder"],
  [/тусламж|харилцагч/i, "support"], [/судлаач|судалгаа|шинжээч/i, "research"], [/үйл ажиллагаа|хувилбар/i, "ops"],
  [/санхүү|үнийн|тооцоо|нягтлан/i, "finance"], [/борлуулалт|маркетинг/i, "sales"],
];
/** A role line such as «Кодын агент» → the role; anything else is a generic agent. */
export function agentRoleFrom(label: string | undefined): AgentRole {
  if (!label) return "agent";
  for (const [re, role] of ROLE_WORDS) if (re.test(label)) return role;
  return "agent";
}

/** A run status as the agent cards name it (queued, running, waiting, done, failed, stopped) → the five shared states. */
export function agentStatusFrom(status: string | undefined): AgentAvatarStatus {
  if (status === "running") return "running";
  if (status === "waiting" || status === "needs-you") return "needs-you";
  if (status === "failed" || status === "error") return "error";
  if (status === "done") return "done";
  return "idle";
}

/** Demo: a writer agent at work. */
export const agentAvatarDemo: AgentAvatarProps = { role: "writer", status: "running" };

/** Catalog preview: every role, then every status. */
export default function AgentAvatarDemo() {
  const st: AgentAvatarStatus[] = ["running", "needs-you", "error", "done", "idle"];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{AGENT_ROLES.map((r) => <AgentAvatar key={r} role={r} />)}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>{st.map((s) => <AgentAvatar key={s} role="writer" status={s} />)}</div>
    </div>
  );
}
