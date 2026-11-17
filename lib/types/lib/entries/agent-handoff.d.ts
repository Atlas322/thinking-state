import { type HandoffAgent, type AgentHandoffProps } from "../../library/agent-handoff";
export * from "../../library/agent-handoff";
/** Gives every agent a role avatar read from its role line (screens.22). The card draws the tile and names the agent, so the avatar is bare and decorative. */
export declare function withHandoffRoleAvatars(agents: HandoffAgent[]): HandoffAgent[];
/** Demo props: researcher, writer and reviewer with role avatars instead of initials. */
export declare const agentHandoffDemo: AgentHandoffProps;
