import * as React from "react";
import { f as fleetDemoAgents } from "./chunks/agent-fleet-B9SFZqAH.js";
import { A } from "./chunks/agent-fleet-B9SFZqAH.js";
import { A as AgentAvatar, a as agentStatusFrom, b as agentRoleFrom } from "./chunks/agent-avatar-BKy99-dK.js";
import { c } from "./chunks/agent-avatar-BKy99-dK.js";
function withRoleAvatars(agents, inherit) {
  return agents.map((a) => ({
    ...a,
    avatar: React.createElement(AgentAvatar, { role: agentRoleFrom(a.model ?? inherit), status: agentStatusFrom(a.status), size: 22, decorative: true }),
    children: a.children ? withRoleAvatars(a.children, a.model ?? inherit) : void 0
  }));
}
const agentFleetDemo = { agents: withRoleAvatars(fleetDemoAgents) };
export {
  AgentAvatar,
  A as AgentFleet,
  c as agentAvatarLabelsMn,
  agentFleetDemo,
  agentRoleFrom,
  agentStatusFrom,
  fleetDemoAgents,
  withRoleAvatars
};
//# sourceMappingURL=agent-fleet.js.map
