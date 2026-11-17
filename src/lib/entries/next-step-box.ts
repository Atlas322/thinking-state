// @inai/thinking-state/next-step-box — one component per entry, so a page loads only what it mounts (screens.23).
export * from "../../library/next-step-box";

import type { NextStepBoxProps } from "../../library/next-step-box";
/** Role demo · sales manager (ac.me Market): the agent's work ends in one question for the person. */
export const nextStepBoxSalesDemo: NextStepBoxProps = {
  state: "ready",
  blocked: true,
  recap: "Түнш компанийн гэрээний сунгалтын санал бэлэн: 212 суудал, өмнөх нөхцөлөөр. Үнийн хүснэгт ба өнгөрсөн жилийн гэрээтэй тулгасан. Илгээгээгүй.",
  ask: "Саналыг харилцагч руу илгээх үү?",
  actions: [
    { id: "send", label: "Илгээх", kind: "app" },
    { id: "edit", label: "Эхлээд засъя", kind: "reply" },
  ],
};
