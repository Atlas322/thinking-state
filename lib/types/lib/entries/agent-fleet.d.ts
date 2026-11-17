import { type FleetAgent, type AgentFleetProps } from "../../library/agent-fleet";
export * from "../../library/agent-fleet";
export { AgentAvatar, agentRoleFrom, agentStatusFrom, agentAvatarLabelsMn, type AgentRole, type AgentAvatarStatus, type AgentAvatarProps } from "../../library/agent-avatar";
/** Gives every agent (lead and sub-agent) a role avatar read from its role line; the card names the agent, so the avatar is decorative. */
export declare function withRoleAvatars(agents: FleetAgent[], inherit?: string): FleetAgent[];
/** Demo props (screens.22): the ac.me team with role avatars instead of the three abstract marks. */
export declare const agentFleetDemo: AgentFleetProps;
