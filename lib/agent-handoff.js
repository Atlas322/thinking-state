import * as React from "react";
import { h as handoffDemoAgents } from "./chunks/agent-handoff-Ds4fGI9z.js";
import { A } from "./chunks/agent-handoff-Ds4fGI9z.js";
import { A as AgentAvatar, b as agentRoleFrom } from "./chunks/agent-avatar-BKy99-dK.js";
function withHandoffRoleAvatars(agents) {
  return agents.map((a) => ({ ...a, avatar: React.createElement(AgentAvatar, { role: agentRoleFrom(a.model ?? a.name), size: 24, bare: true, decorative: true }) }));
}
const agentHandoffDemo = { agents: withHandoffRoleAvatars(handoffDemoAgents) };
export {
  A as AgentHandoff,
  agentHandoffDemo,
  handoffDemoAgents,
  withHandoffRoleAvatars
};
//# sourceMappingURL=agent-handoff.js.map
