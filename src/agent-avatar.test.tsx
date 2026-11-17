// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { AgentAvatar, agentRoleFrom, agentStatusFrom, AGENT_ROLES } from "./library/agent-avatar";
import { agentFleetDemo } from "./lib/entries/agent-fleet";

afterEach(cleanup);

describe("AgentAvatar (screens.22)", () => {
  it("draws one role icon per role and names the role and the status in words", () => {
    for (const role of AGENT_ROLES) {
      const { container, unmount } = render(<AgentAvatar role={role} status="running" />);
      const el = container.querySelector(".aav") as HTMLElement;
      expect(el.getAttribute("data-role")).toBe(role);
      expect(el.querySelectorAll("svg.aav-icon")).toHaveLength(1);
      expect(el.getAttribute("aria-label")).toMatch(/ажиллаж байна/);
      unmount();
    }
  });
  it("the status mark differs by shape, not only by colour", () => {
    const shape = (s: Parameters<typeof AgentAvatar>[0]["status"]) => {
      const { container, unmount } = render(<AgentAvatar role="writer" status={s} />);
      const v = container.querySelector(".aav-dot")?.getAttribute("data-shape");
      unmount();
      return v;
    };
    const shapes = [shape("running"), shape("needs-you"), shape("error"), shape("done")];
    expect(new Set(shapes).size).toBe(4);
    const { container } = render(<AgentAvatar role="writer" />);
    expect(container.querySelector(".aav-dot")).toBeNull();
  });
  it("is decorative when the row already names the agent", () => {
    const { container } = render(<AgentAvatar role="coder" status="done" decorative />);
    const el = container.querySelector(".aav") as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.hasAttribute("aria-label")).toBe(false);
  });
  it("reads the role from a Mongolian role line and falls back to a generic agent", () => {
    expect(agentRoleFrom("Төлөвлөгч агент")).toBe("planner");
    expect(agentRoleFrom("Бичигч агент")).toBe("writer");
    expect(agentRoleFrom("Дизайны агент")).toBe("designer");
    expect(agentRoleFrom("Кодын агент")).toBe("coder");
    expect(agentRoleFrom("Тусламжийн агент")).toBe("support");
    expect(agentRoleFrom("Судлаач агент")).toBe("research");
    expect(agentRoleFrom("Үйл ажиллагааны агент")).toBe("ops");
    expect(agentRoleFrom("Үнийн агент")).toBe("finance");
    expect(agentRoleFrom(undefined)).toBe("agent");
    expect(agentRoleFrom("Өөр")).toBe("agent");
  });
  it("maps a fleet status to the five shared states", () => {
    expect(agentStatusFrom("running")).toBe("running");
    expect(agentStatusFrom("waiting")).toBe("needs-you");
    expect(agentStatusFrom("failed")).toBe("error");
    expect(agentStatusFrom("done")).toBe("done");
    expect(agentStatusFrom("queued")).toBe("idle");
    expect(agentStatusFrom("stopped")).toBe("idle");
  });
  it("the AgentFleet entry demo gives every agent, lead and sub-agent, a role avatar", () => {
    const all = (list: NonNullable<typeof agentFleetDemo.agents>): typeof list => list.flatMap((a) => [a, ...all(a.children ?? [])]);
    const agents = all(agentFleetDemo.agents ?? []);
    expect(agents.length).toBeGreaterThan(4);
    for (const a of agents) expect(typeof a.avatar === "object" && a.avatar !== null).toBe(true);
    render(<>{agents.slice(0, 3).map((a) => <span key={a.id}>{a.avatar as React.ReactNode}</span>)}</>);
    expect(document.querySelectorAll(".aav[aria-hidden=true]")).toHaveLength(3);
  });
});
