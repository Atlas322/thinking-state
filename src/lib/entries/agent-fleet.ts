// @inai/thinking-state/agent-fleet — one component per entry, so a page loads only what it mounts (screens.19).
import * as React from "react";
import { fleetDemoAgents, type FleetAgent, type AgentFleetProps } from "../../library/agent-fleet";
import { AgentAvatar, agentRoleFrom, agentStatusFrom } from "../../library/agent-avatar";

export * from "../../library/agent-fleet";
export { AgentAvatar, agentRoleFrom, agentStatusFrom, agentAvatarLabelsMn, type AgentRole, type AgentAvatarStatus, type AgentAvatarProps } from "../../library/agent-avatar";

/** Gives every agent (lead and sub-agent) a role avatar read from its role line; the card names the agent, so the avatar is decorative. */
export function withRoleAvatars(agents: FleetAgent[], inherit?: string): FleetAgent[] {
  return agents.map((a) => ({
    ...a,
    avatar: React.createElement(AgentAvatar, { role: agentRoleFrom(a.model ?? inherit), status: agentStatusFrom(a.status), size: 22, decorative: true }),
    children: a.children ? withRoleAvatars(a.children, a.model ?? inherit) : undefined,
  }));
}

/** Demo props (screens.22): the ac.me team with role avatars instead of the three abstract marks. */
export const agentFleetDemo: AgentFleetProps = { agents: withRoleAvatars(fleetDemoAgents) };
