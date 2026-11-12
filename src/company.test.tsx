// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { CompanyView } from "./company/company-view";
import { acmeGroup, inai, companyFixtures } from "./company/fixtures";
import { actorOf, modelLines, scopeCompany, subtreeIds, type Company } from "./company/types";

beforeEach(() =>
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  }),
);
afterEach(cleanup);

describe("Company contract helpers", () => {
  it("fixtures keep every reference inside the company", () => {
    for (const c of companyFixtures) {
      const units = new Set(c.units.map((u) => u.id));
      const actors = new Set([...c.people.map((p) => p.id), ...c.agents.map((a) => a.id)]);
      for (const u of c.units) if (u.parentId) expect(units.has(u.parentId), `${c.id}:${u.id}`).toBe(true);
      for (const x of [...c.people, ...c.agents, ...c.workflows, ...c.projects]) expect(units.has(x.unitId), `${c.id}:${x.id}`).toBe(true);
      for (const a of c.agents) if (a.ownerId) expect(actors.has(a.ownerId)).toBe(true);
      for (const w of c.workflows) for (const s of w.steps) expect(actors.has(s.actorId), `${w.id}:${s.id}`).toBe(true);
      for (const p of c.projects) for (const t of p.tasks) if (t.ownerId) expect(actors.has(t.ownerId)).toBe(true);
    }
  });

  it("scopes a company to a unit's subtree and survives cycles", () => {
    const retail = scopeCompany(acmeGroup, "retail");
    expect(retail.units.map((u) => u.id)).toEqual(["retail", "r-stores", "r-night", "r-buying"]);
    expect(retail.agents.every((a) => ["retail", "r-stores", "r-night", "r-buying"].includes(a.unitId))).toBe(true);
    expect(retail.projects.map((p) => p.id)).toEqual(["pr-branch"]);
    const cyclic: Company = { ...inai, units: [{ id: "a", name: "A", kind: "team", parentId: "b" }, { id: "b", name: "B", kind: "team", parentId: "a" }] };
    expect([...subtreeIds(cyclic.units, "a")].sort()).toEqual(["a", "b"]);
    expect(scopeCompany(acmeGroup, "nope")).toBe(acmeGroup);
  });

  it("reads model fields and actors in any shape", () => {
    expect(modelLines("x")).toEqual([{ text: "x" }]);
    expect(modelLines(["a", "b"])).toHaveLength(2);
    expect(modelLines([{ stream: "s", share: 0.8 }])[0].share).toBe(0.8);
    expect(actorOf(inai, "itge").kind).toBe("person");
    expect(actorOf(inai, "wiki").kind).toBe("agent");
    expect(actorOf(inai, "ghost").kind).toBe("unknown");
  });
});

describe("CompanyView", () => {
  it("opens at the highest level and zooms to a company", () => {
    render(<CompanyView company={acmeGroup} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("ac.me Group");
    expect(screen.getByRole("radio", { name: "Институц" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByRole("radio", { name: "Компани" }));
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("ac.me Retail");
    // stats follow the scope: 4 units under Retail
    const units = screen.getByText("Нэгж").closest(".cv-stat")!;
    expect(units.textContent).toContain("4");
  });

  it("disables levels a company does not have", () => {
    render(<CompanyView company={inai} />);
    expect((screen.getByRole("radio", { name: "Институц" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("radio", { name: "Компани" }).getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByRole("radio", { name: "Баг" }));
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Удирдлага");
  });

  it("draws people next to their agents and loose agents per unit", () => {
    render(<CompanyView company={inai} defaultView="agents" />);
    const panel = screen.getByRole("tabpanel");
    const lead = within(panel).getByRole("region", { name: "Удирдлага" });
    expect(lead.textContent).toContain("itge.e");
    expect(lead.textContent).toContain("Project");
    const knowledge = within(panel).getByRole("region", { name: "Мэдлэг" });
    expect(knowledge.textContent).toContain("Нэгжийн агент");
    expect(knowledge.textContent).toContain("Context Engineer");
  });

  it("shows workflow steps with person and agent actors", () => {
    render(<CompanyView company={inai} defaultView="workflows" />);
    const flow = screen.getByRole("article", { name: "Чатын widget → компонент" });
    const steps = flow.querySelectorAll(".cv-step");
    expect(steps).toHaveLength(4);
    expect(steps[0].className).toContain("is-agent");
    expect(steps[1].className).toContain("is-person");
    expect(steps[0].className).toContain("gate-next");
  });

  it("reuses Session Board for projects and opens a Project Report", () => {
    render(<CompanyView company={inai} defaultView="projects" />);
    const panel = screen.getByRole("tabpanel");
    expect(panel.querySelector('[data-cw-root="session-board"]')).toBeTruthy();
    fireEvent.click(within(panel.querySelector(".cv-chips") as HTMLElement).getByRole("button", { name: /Thinking State/ }));
    expect(panel.querySelector('[data-cw-root="project-report"]')).toBeTruthy();
    expect(within(panel).getByRole("progressbar").getAttribute("aria-valuenow")).toBe("33");
  });

  it("lists decisions through Decision Inbox, all recorded", () => {
    render(<CompanyView company={acmeGroup} defaultView="decisions" />);
    const panel = screen.getByRole("tabpanel");
    expect(panel.querySelector('[data-cw-root="decision-inbox-chat"]')).toBeTruthy();
    expect(panel.querySelectorAll("[data-chosen]")).toHaveLength(3);
    expect(panel.textContent).toContain("Бүх шийдвэр бүртгэгдсэн.");
  });

  it("switches template over the same data", () => {
    const onTemplateChange = vi.fn();
    const { container } = render(<CompanyView company={acmeGroup} onTemplateChange={onTemplateChange} />);
    expect(container.querySelector('[data-template="workspace"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Тайлан" }));
    expect(onTemplateChange).toHaveBeenCalledWith("brief");
    expect(container.querySelector('[data-template="brief"]')).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining("Бизнес загвар"), expect.stringContaining("Workflow")]),
    );
  });

  it("moves between tabs with the arrow keys", () => {
    render(<CompanyView company={inai} />);
    const model = screen.getByRole("tab", { name: /Бизнес загвар/ });
    fireEvent.keyDown(model, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Процесс/ }).getAttribute("aria-selected")).toBe("true");
  });

  it("picks a unit from the process tree", () => {
    render(<CompanyView company={acmeGroup} defaultView="structure" />);
    fireEvent.click(within(screen.getByRole("tabpanel")).getByRole("button", { name: /Терминал ба агуулах/ }));
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Терминал ба агуулах");
    expect(screen.getByRole("radio", { name: "Баг" }).getAttribute("aria-checked")).toBe("true");
  });
});
