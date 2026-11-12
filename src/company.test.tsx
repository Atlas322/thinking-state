// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { CompanyView } from "./company/company-view";
import { acmeGroup, inai, companyFixtures, pmbokProject } from "./company/fixtures";
import { dueBucket } from "./company/dashboard";
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
    expect(actorOf(inai, "saraa").kind).toBe("person");
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
    expect(lead.textContent).toContain("Saraa.D");
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

  it("reuses Session Board on the dashboard and opens a Project Report", () => {
    render(<CompanyView company={inai} defaultView="dashboard" today={new Date("2026-11-12")} />);
    const panel = screen.getByRole("tabpanel");
    expect(panel.querySelector('[data-cw-root="session-board"]')).toBeTruthy();
    fireEvent.click(within(panel).getByRole("button", { name: /^Thinking State/ }));
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
    const { container } = render(<CompanyView company={acmeGroup} onLayoutChange={onTemplateChange} />);
    expect(container.querySelector('[data-template="workspace"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Тайлан" }));
    expect(onTemplateChange).toHaveBeenCalledWith("brief");
    expect(container.querySelector('[data-template="brief"]')).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining("OKR"), expect.stringContaining("Workflow"), expect.stringContaining("RACI")]),
    );
  });

  it("moves between tabs with the arrow keys", () => {
    render(<CompanyView company={inai} />);
    const method = screen.getByRole("tab", { name: /BMC/ });
    fireEvent.keyDown(method, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: /Самбар/ }).getAttribute("aria-selected")).toBe("true");
  });

  it("picks a unit from the process tree", () => {
    render(<CompanyView company={acmeGroup} defaultView="structure" />);
    fireEvent.click(within(screen.getByRole("tabpanel")).getByRole("button", { name: /Терминал ба агуулах/ }));
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Терминал ба агуулах");
    expect(screen.getByRole("radio", { name: "Баг" }).getAttribute("aria-checked")).toBe("true");
  });
});

describe("review fixes", () => {
  it("level switch stays related to the current unit", () => {
    render(<CompanyView company={acmeGroup} defaultUnitId="logistics" />);
    fireEvent.click(screen.getByRole("radio", { name: "Баг" }));
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Тээврийн төлөвлөлт");
    fireEvent.click(screen.getByRole("radio", { name: "Компани" }));
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("ac.me Logistics");
  });

  it("module sources import only their folder and the library", async () => {
    const sources = import.meta.glob<string>(["./company/*.{ts,tsx}", "./library/company-*.tsx"], { query: "?raw", import: "default" });
    for (const [path, load] of Object.entries(sources)) {
      const src = await load();
      for (const m of src.matchAll(/from\s+["'](\.[^"']+)["']/g))
        expect(m[1], `${path} → ${m[1]}`).toMatch(/^\.\.?\/(company\/|library\/|[a-z-]+$)/);
    }
  });
});

const today = new Date("2026-11-12T09:00:00");

describe("dashboard, RACI, profiles", () => {
  it("buckets due dates against today", () => {
    expect(dueBucket("2026-11-11", false, today)).toBe("overdue");
    expect(dueBucket("2026-11-11", true, today)).toBe("later");
    expect(dueBucket("2026-11-20", false, today)).toBe("soon");
    expect(dueBucket("2027-01-20", false, today)).toBe("later");
    expect(dueBucket(undefined, false, today)).toBe("none");
  });

  it("groups by area and filters by owner and due date", () => {
    render(<CompanyView company={inai} defaultView="dashboard" today={today} />);
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getAllByRole("region").map((r) => r.getAttribute("aria-label"))).toEqual(
      expect.arrayContaining(["Бүтээгдэхүүн", "Сургалт", "Платформ"]),
    );
    const [, owner, due] = within(panel).getAllByRole("combobox");
    fireEvent.change(due, { target: { value: "overdue" } });
    expect(panel.textContent).toContain("GitHub төлбөр засах");
    expect(panel.textContent).not.toContain("Hero «тархи ↔ апп» зураглал");
    fireEvent.change(due, { target: { value: "all" } });
    fireEvent.change(owner, { target: { value: "bilguun" } });
    expect(panel.textContent).toContain("Хөтөлбөрийн бүтэц");
    expect(panel.textContent).not.toContain("TENET дахин төлөвлөлт");
    fireEvent.click(within(panel).getByRole("button", { name: "Цэвэрлэх" }));
    expect(panel.textContent).toContain("TENET дахин төлөвлөлт");
  });

  it("draws the RACI matrix and opens a profile from it", () => {
    render(<CompanyView company={inai} defaultView="raci" />);
    const table = screen.getByRole("table");
    const row = within(table).getByRole("button", { name: /Saraa\.Kh/ }).closest("tr")!;
    expect(row.textContent).toContain("A");
    fireEvent.click(within(table).getByRole("button", { name: /Saraa\.Kh/ }));
    const dialog = screen.getByRole("dialog", { name: "Saraa.D" });
    expect(dialog.textContent).toContain("Нар агентлаг");
    expect(dialog.textContent).toContain("Нийтийн холбоос алга.");
    expect(dialog.textContent).toContain("Inai Website");
    expect(dialog.textContent).toContain("Project");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens a profile from the process tree with empty states", () => {
    render(<CompanyView company={acmeGroup} defaultView="structure" />);
    fireEvent.click(screen.getByRole("button", { name: /Б\.Тэмүүлэн — профайл/ }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Тухай мэдээлэл бүртгэгдээгүй.");
    expect(dialog.textContent).toContain("CV бүртгэгдээгүй.");
    expect(dialog.textContent).toContain("R эсвэл A үүрэгтэй төсөл алга.");
  });

  it("shows an empty RACI state", () => {
    render(<CompanyView company={{ ...inai, projects: inai.projects.map((p) => ({ ...p, raci: undefined })) }} defaultView="raci" />);
    expect(screen.getByRole("tabpanel").textContent).toContain("RACI бүртгэгдээгүй.");
  });
});

describe("methodology templates", () => {
  it("draws INAI as a Business Model Canvas with projects and notes below", () => {
    render(<CompanyView company={inai} />);
    const panel = screen.getByRole("tabpanel");
    for (const b of ["Key Partners", "Value Propositions", "Revenue Streams", "Cost Structure"]) expect(within(panel).getByRole("region", { name: b })).toBeTruthy();
    expect(within(panel).getByRole("region", { name: "Нот" }).textContent).toContain("BMG шалгалт");
  });

  it("switches template to Lean Canvas with empty blocks marked", () => {
    const onMethodologyChange = vi.fn();
    render(<CompanyView company={inai} onMethodologyChange={onMethodologyChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Lean" }));
    expect(onMethodologyChange).toHaveBeenCalledWith("lean-canvas");
    const problem = within(screen.getByRole("tabpanel")).getByRole("region", { name: "Problem" });
    expect(problem.textContent).toContain("Бөглөөгүй");
  });

  it("draws PMBOK as a 5 × 10 matrix with Facts hub and Gantt", () => {
    render(<CompanyView company={pmbokProject} today={today} />);
    const panel = screen.getByRole("tabpanel");
    const matrix = within(panel).getByRole("region", { name: "PMBOK матриц" });
    expect(matrix.querySelectorAll("thead th")).toHaveLength(6);
    expect(matrix.querySelectorAll("tbody tr")).toHaveLength(10);
    const cell = within(matrix).getByRole("button", { name: /Procurement · Planning/ });
    fireEvent.click(cell);
    expect(panel.textContent).toContain("Худалдан авалтын төлөвлөгөө");
    const facts = within(panel).getByRole("region", { name: "Facts hub" });
    expect(facts.textContent).toContain("Planning");
    expect(facts.textContent).toContain("2026-09-01 → 2027-03-31");
    expect(panel.querySelectorAll(".cv-gantt-bar")).toHaveLength(14);
    expect(panel.querySelector(".cv-gantt-today")).toBeTruthy();
  });

  it("draws OKR with key-result progress and the business model under it", () => {
    render(<CompanyView company={acmeGroup} />);
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByRole("article", { name: "Нэг өгөгдлийн сангаар удирдана" }).textContent).toContain("55%");
    expect(within(panel).getByRole("progressbar", { name: "Сарын хаалт 5 ажлын өдөрт" }).getAttribute("aria-valuenow")).toBe("70");
    expect(within(panel).getByRole("region", { name: "Бизнес загвар" })).toBeTruthy();
  });
});
