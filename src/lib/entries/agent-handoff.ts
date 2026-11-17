// @inai/thinking-state/agent-handoff — one component per entry, so a page loads only what it mounts (screens.19).
import * as React from "react";
import { handoffDemoAgents, type HandoffAgent, type AgentHandoffProps } from "../../library/agent-handoff";
import { AgentAvatar, agentRoleFrom } from "../../library/agent-avatar";

export * from "../../library/agent-handoff";

/** Gives every agent a role avatar read from its role line (screens.22). The card draws the tile and names the agent, so the avatar is bare and decorative. */
export function withHandoffRoleAvatars(agents: HandoffAgent[]): HandoffAgent[] {
  return agents.map((a) => ({ ...a, avatar: React.createElement(AgentAvatar, { role: agentRoleFrom(a.model ?? a.name), size: 24, bare: true, decorative: true }) }));
}

/** Demo props: researcher, writer and reviewer with role avatars instead of initials. */
export const agentHandoffDemo: AgentHandoffProps = { agents: withHandoffRoleAvatars(handoffDemoAgents) };
