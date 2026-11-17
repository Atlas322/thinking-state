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
export declare const AGENT_ROLES: AgentRole[];
export type AgentAvatarLabels = {
    roles: Record<AgentRole, string>;
    status: Record<AgentAvatarStatus, string>;
};
export declare const agentAvatarLabelsMn: AgentAvatarLabels;
export type AgentAvatarProps = {
    role?: AgentRole;
    status?: AgentAvatarStatus;
    /** Tile edge in px (default 26). The icon is 60% of it. */
    size?: number;
    /** The row already names the agent and its status: hide the avatar from assistive tech. */
    decorative?: boolean;
    /** The slot already draws a tile (AgentHandoff, AgentLanes): no border or surface of its own. */
    bare?: boolean;
    labels?: AgentAvatarLabels;
    className?: string;
};
export declare function AgentAvatar({ role, status, size, decorative, bare, labels, className }: AgentAvatarProps): React.JSX.Element;
/** A role line such as «Кодын агент» → the role; anything else is a generic agent. */
export declare function agentRoleFrom(label: string | undefined): AgentRole;
/** A run status as the agent cards name it (queued, running, waiting, done, failed, stopped) → the five shared states. */
export declare function agentStatusFrom(status: string | undefined): AgentAvatarStatus;
/** Demo: a writer agent at work. */
export declare const agentAvatarDemo: AgentAvatarProps;
/** Catalog preview: every role, then every status. */
export default function AgentAvatarDemo(): React.JSX.Element;
