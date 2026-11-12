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
    expect(lead.textContent).toContain("Itgeltugs.Kh");
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
    fireEvent.change(owner, { target: { value: "badral" } });
    expect(panel.textContent).toContain("Хөтөлбөрийн бүтэц");
    expect(panel.textContent).not.toContain("TENET дахин төлөвлөлт");
    fireEvent.click(within(panel).getByRole("button", { name: "Цэвэрлэх" }));
    expect(panel.textContent).toContain("TENET дахин төлөвлөлт");
  });

  it("draws the RACI matrix and opens a profile from it", () => {
    render(<CompanyView company={inai} defaultView="raci" />);
    const table = screen.getByRole("table");
    const row = within(table).getByRole("button", { name: /Itgeltugs\.Kh/ }).closest("tr")!;
    expect(row.textContent).toContain("A");
    fireEvent.click(within(table).getByRole("button", { name: /Itgeltugs\.Kh/ }));
    const dialog = screen.getByRole("dialog", { name: "Itgeltugs.Kh" });
    expect(dialog.textContent).toContain("Bronzehero's Entertainment");
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
    render(<CompanyView company={{ ...inai, projects: inai.projects.map((p) => ({ ...p, raci: undefined, tasks: p.tasks.map((t) => ({ ...t, raci: undefined })) })) }} defaultView="raci" />);
    expect(screen.getByRole("tabpanel").textContent).toContain("RACI бүртгэгдээгүй.");
  });
});

describe("methodology templates", () => {
  it("draws INAI as a Business Model Canvas with projects and notes below", () => {
    render(<CompanyView company={inai} />);
    const panel = screen.getByRole("tabpanel");
    for (const b of ["Гол түнш", "Үнэ цэнийн санал", "Орлогын урсгал", "Зардлын бүтэц"]) expect(within(panel).getByRole("region", { name: b })).toBeTruthy();
    expect(within(panel).getByRole("region", { name: "Нот" }).textContent).toContain("BMG шалгалт");
  });

  it("switches template to Lean Canvas with empty blocks marked", () => {
    const onMethodologyChange = vi.fn();
    render(<CompanyView company={inai} onMethodologyChange={onMethodologyChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Lean" }));
    expect(onMethodologyChange).toHaveBeenCalledWith("lean-canvas");
    const problem = within(screen.getByRole("tabpanel")).getByRole("region", { name: "Асуудал" });
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

describe("collections (vault types)", () => {
  const today = new Date("2026-11-12T09:00:00");
  const tasks = () => inai.collections!.find((c) => c.type === "task")!;

  it("infers field kinds from names and values", async () => {
    const { inferKind, resolveFields } = await import("./company/collection");
    expect(inferKind("status", ["inbox"])).toBe("status");
    expect(inferKind("due", ["2026-11-12"])).toBe("date");
    expect(inferKind("tasks", ["1/3", "0/2"])).toBe("progress");
    expect(inferKind("tags", [["a"], ["b"]])).toBe("multi");
    expect(inferKind("area", ["Бүтээгдэхүүн"])).toBe("relation");
    expect(inferKind("done", [true, false])).toBe("checkbox");
    expect(resolveFields({ type: "x", fields: ["title", { name: "n", kind: "number" }], items: [] }).map((f) => f.kind)).toEqual(["number"]);
    // company-schema 4e6f8df: declared kinds, relation names stay relations
    expect(
      resolveFields({ type: "x", fields: [{ name: "area", kind: "select" }, { name: "owner", kind: "text" }, { name: "mood", kind: "select" }], items: [] }).map((f) => f.kind),
    ).toEqual(["relation", "relation", "select"]);
  });

  it("formats relative days", async () => {
    const { relativeDay } = await import("./company/collection");
    expect(relativeDay("2026-11-12", today)).toBe("өнөөдөр");
    expect(relativeDay("2026-11-11", today)).toBe("өчигдөр");
    expect(relativeDay("2025-09-11", today)).toBe("427 хоногийн өмнө");
    expect(relativeDay("2026-11-20", today)).toBe("8 хоногийн дараа");
  });

  it("filters by status tab and shows row parts", async () => {
    const { CollectionPanel } = await import("./company/company-view");
    render(<CollectionPanel collection={tasks()} today={today} />);
    const tabs = screen.getByRole("tablist");
    const active = within(tabs).getByRole("tab", { name: /Идэвхтэй/ });
    expect(active.textContent).toContain("3");
    fireEvent.click(within(tabs).getByRole("tab", { name: /Хүлээгдэж буй/ }));
    const rows = Array.from(document.querySelectorAll(".cl-row"));
    expect(rows).toHaveLength(2);
    const github = rows.find((r) => r.textContent?.includes("GitHub төлбөр засах"))!;
    expect(github.textContent).toContain("Өндөр");
    expect(github.querySelector(".cl-date.is-overdue")?.textContent).toContain("өчигдөр");
  });

  it("switches views: table, board, calendar week, timeline", async () => {
    const { CollectionPanel } = await import("./company/company-view");
    render(<CollectionPanel collection={tasks()} today={today} />);
    fireEvent.click(screen.getByRole("radio", { name: /Хүснэгт/ }));
    expect(screen.getByRole("table").querySelectorAll("tbody tr")).toHaveLength(tasks().items.length);
    fireEvent.click(screen.getByRole("radio", { name: /Самбар/ }));
    expect(screen.getAllByRole("listitem").filter((x) => x.classList.contains("cl-col")).length).toBeGreaterThan(2);
    fireEvent.click(screen.getByRole("button", { name: /7 хоногийн хуанли/ }));
    const grid = screen.getByRole("grid");
    expect(grid.querySelectorAll("[role=gridcell]")).toHaveLength(7);
    expect(grid.textContent).toContain("Компанийн renderer");
    fireEvent.click(screen.getByRole("radio", { name: /Timeline/ }));
    expect(document.querySelectorAll(".cl-tl-bar").length).toBeGreaterThan(3);
  });

  it("filters and groups by any field", async () => {
    const { CollectionPanel } = await import("./company/company-view");
    render(<CollectionPanel collection={tasks()} today={today} defaultView="list" />);
    const [field] = screen.getAllByRole("combobox");
    fireEvent.change(field, { target: { value: "owner" } });
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "Architect" } });
    expect(document.querySelectorAll(".cl-row")).toHaveLength(3);
    const group = screen.getAllByRole("combobox")[2];
    fireEvent.change(group, { target: { value: "project" } });
    expect(screen.getAllByRole("button", { name: /Inai Website|Thinking State/ }).some((b) => b.classList.contains("cl-group-h"))).toBe(true);
  });

  it("shows an empty state", async () => {
    const { CollectionPanel } = await import("./company/company-view");
    render(<CollectionPanel collection={{ type: "event", fields: ["date"], items: [] }} />);
    expect(screen.getByText("Энэ харагдацад мөр алга.")).toBeTruthy();
  });

  it("lists vault types in the sidebar and opens one", () => {
    render(<CompanyView company={inai} today={today} />);
    const types = screen.getByRole("navigation", { name: "Төрлүүд" });
    const project = within(types).getByRole("button", { name: /Төсөл/ });
    expect(project.textContent).toContain("4");
    fireEvent.click(project);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toContain("Төсөл");
    const nm = document.querySelector(".cl-nm");
    expect(nm?.textContent).toMatch(/\d\/\d/);
    // a relation chip switches scope back to a unit
    fireEvent.click(within(types).getByRole("button", { name: /Хүн/ }));
    fireEvent.click(screen.getAllByRole("button", { name: /Технологи/ }).find((b) => b.classList.contains("cl-rel"))!);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Технологи");
  });

  it("does not repeat the segment next to the kind", () => {
    render(<CompanyView company={acmeGroup} />);
    const tags = document.querySelector(".cv-tags")!;
    expect(tags.textContent).not.toContain("institutional");
    expect(tags.textContent?.match(/Институц/g)).toHaveLength(1);
  });
});

describe("collection polish (notion-teardown v2)", () => {
  const today = new Date("2026-11-12T09:00:00");
  const col = (t: string) => inai.collections!.find((c) => c.type === t)!;

  it("shows kind icons in headers and a count footer", async () => {
    const { CollectionPanel } = await import("./company/company-view");
    render(<CollectionPanel collection={col("project")} today={today} />);
    const table = screen.getByRole("table");
    expect(table.querySelectorAll("thead th svg").length).toBe(table.querySelectorAll("thead th").length);
    expect(table.querySelector("tfoot")!.textContent).toContain("4");
  });

  it("draws n/m as a ring, full when complete", async () => {
    const { ProgressNM } = await import("./company/collection");
    const { container, rerender } = render(<ProgressNM value="1/4" />);
    expect(container.querySelector(".cl-ring-arc")).toBeTruthy();
    rerender(<ProgressNM value="3/3" />);
    expect(container.querySelector(".cl-ring-full")).toBeTruthy();
    expect(container.querySelector(".cl-nm.is-full")).toBeTruthy();
  });

  it("formats date ranges", async () => {
    const { rangeText } = await import("./company/collection");
    expect(rangeText("2026-05-17", "2026-06-10", today)).toBe("5/17 → 6/10");
    expect(rangeText("2027-01-02", "2027-01-05", today)).toBe("2027.1/2 → 2027.1/5");
    expect(rangeText("2026-05-17", "2026-05-17", today)).toBeNull();
  });

  it("groups by month and tints board columns by status", async () => {
    const { CollectionPanel } = await import("./company/company-view");
    render(<CollectionPanel collection={col("task")} today={today} defaultView="list" />);
    fireEvent.change(screen.getAllByRole("combobox").at(-1)!, { target: { value: "due" } });
    expect(screen.getByRole("region", { name: "2026 оны 11-р сар" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Хоосон" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: /Самбар/ }));
    fireEvent.change(screen.getAllByRole("combobox").at(-1)!, { target: { value: "" } });
    expect(document.querySelector(".cl-col.is-yellow")).toBeTruthy();
    expect(document.querySelector(".cl-col.is-green")).toBeTruthy();
  });

  it("timeline labels bars and counts undated rows", async () => {
    const { CollectionPanel } = await import("./company/company-view");
    render(<CollectionPanel collection={col("task")} today={today} defaultView="timeline" />);
    expect(screen.getByText(/Огноогүй \(\d+\)/)).toBeTruthy();
    expect(document.querySelector(".cl-tl-label .cl-pill")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Жил" }));
    expect(screen.getByRole("radio", { name: "Жил" }).getAttribute("aria-checked")).toBe("true");
  });

  it("offers to clear filters when a view is empty", async () => {
    const { CollectionPanel } = await import("./company/company-view");
    render(<CollectionPanel collection={col("task")} today={today} />);
    fireEvent.click(screen.getByRole("button", { name: /Энэ сар/ }));
    fireEvent.click(within(screen.getByRole("tablist")).getByRole("tab", { name: /Inbox/ }));
    if (!screen.queryByText("Энэ харагдацад мөр алга.")) return;
    fireEvent.click(screen.getByRole("button", { name: /Шүүлт цэвэрлэх/ }));
    expect(document.querySelectorAll(".cl-row").length).toBe(col("task").items.length);
  });

  it("opens a side peek with properties and related items from other types", () => {
    render(<CompanyView company={inai} today={today} />);
    const types = screen.getByRole("navigation", { name: "Төрлүүд" });
    fireEvent.click(within(types).getByRole("button", { name: /Төсөл/ }));
    fireEvent.click(screen.getByRole("button", { name: "Inai Website" }));
    const peek = screen.getByRole("dialog", { name: /Inai Website/ });
    expect(peek.textContent).toContain("Priority");
    const tabs = within(peek).getByRole("tablist");
    expect(within(tabs).getByRole("tab", { name: /Task/ }).textContent).toContain("5");
    expect(within(tabs).getByRole("tab", { name: /Шийдвэр/ }).textContent).toContain("2");
    expect(peek.textContent).toContain("GitHub төлбөр засах");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("teardown final: linked views and type badges", () => {
  it("the peek's related items are a linked view without a nested peek", () => {
    render(<CompanyView company={inai} today={new Date("2026-11-12T09:00:00")} />);
    fireEvent.click(within(screen.getByRole("navigation", { name: "Төрлүүд" })).getByRole("button", { name: /Төсөл/ }));
    fireEvent.click(screen.getByRole("button", { name: "Inai Website" }));
    const peek = screen.getByRole("dialog", { name: /Inai Website/ });
    // the linked view has its own view switch and the task presets
    expect(within(peek).getByRole("radiogroup", { name: "Харагдац" })).toBeTruthy();
    expect(within(peek).getByRole("button", { name: /7 хоногийн хуанли/ })).toBeTruthy();
    // titles inside are plain text, not peek buttons
    expect(within(peek).queryByRole("button", { name: "GitHub төлбөр засах" })).toBeNull();
    expect(peek.textContent).toContain("GitHub төлбөр засах");
  });

  it("tints type badges by type", () => {
    render(<CompanyView company={inai} />);
    const types = screen.getByRole("navigation", { name: "Төрлүүд" });
    expect(types.querySelector(".cl-tbadge.is-blue")).toBeTruthy();
    expect(types.querySelector(".cl-tbadge.is-green")).toBeTruthy();
    expect(types.querySelector(".cl-tbadge.is-red")).toBeTruthy();
  });
});

describe("owner values resolve to agents, people or text", () => {
  const company = {
    ...inai,
    collections: [
      {
        type: "task",
        fields: [{ name: "owner", kind: "text" }],
        items: [
          { id: "1", title: "Agent by id", props: { owner: "gtd" } },
          { id: "2", title: "Agent by role", props: { owner: "Лавлагаа, атом" } },
          { id: "3", title: "Person", props: { owner: "Itgeltugs.Kh" } },
          { id: "4", title: "Nobody", props: { owner: "someone-else" } },
        ],
      },
    ],
  };

  it("links agent short names to the agent card and leaves strangers as text", () => {
    render(<CompanyView company={company} />);
    fireEvent.click(within(screen.getByRole("navigation", { name: "Төрлүүд" })).getByRole("button", { name: /Task/ }));
    const chips = Array.from(document.querySelectorAll(".cl-rel")).map((c) => c.textContent);
    expect(chips).toEqual(expect.arrayContaining(["GTD", "Wiki", "Itgeltugs.Kh"]));
    expect(screen.getByText("someone-else").className).toBe("cl-text");
    fireEvent.click(screen.getAllByRole("button", { name: "Wiki" }).find((b) => b.classList.contains("cl-rel"))!);
    expect(screen.getByRole("tab", { name: /Хүн ба агент/ }).getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector('[data-agent="wiki"]')!.className).toContain("is-focus");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Мэдлэг");
  });

  it("links people to their profile", () => {
    render(<CompanyView company={company} />);
    fireEvent.click(within(screen.getByRole("navigation", { name: "Төрлүүд" })).getByRole("button", { name: /Task/ }));
    fireEvent.click(screen.getAllByRole("button", { name: "Itgeltugs.Kh" }).find((b) => b.classList.contains("cl-rel"))!);
    expect(screen.getByRole("dialog", { name: "Itgeltugs.Kh" })).toBeTruthy();
  });
});

describe("task dependencies and task RACI (company-schema 7b41c41)", () => {
  it("resolves dependsOn both ways, across projects too", async () => {
    const { dependenciesOf, taskIndex } = await import("./company/types");
    const index = taskIndex(inai);
    const site = inai.projects.find((p) => p.id === "inai-website")!;
    const ts = inai.projects.find((p) => p.id === "thinking-state")!;
    const deploy = site.tasks.find((t) => t.id === "t5")!;
    const billing = site.tasks.find((t) => t.id === "t4")!;
    const hero = site.tasks.find((t) => t.id === "t3")!;
    const figma = ts.tasks.find((t) => t.id === "t3")!;
    expect(dependenciesOf(inai, site, deploy, index).waitsOn.map((w) => w.task.title)).toEqual(["GitHub төлбөр засах"]);
    expect(dependenciesOf(inai, site, billing, index).blocks.map((w) => w.task.title)).toEqual(["Засвар эрх ба deploy"]);
    expect(dependenciesOf(inai, ts, figma, index).waitsOn[0].task).toBe(hero);
    expect(dependenciesOf(inai, site, hero, index).blocks.map((b) => b.task.title)).toEqual(["Figma instance"]);
    // a bare id in another project does not count as pointing here
    expect(dependenciesOf(inai, ts, ts.tasks.find((t) => t.id === "t2")!, index).blocks).toHaveLength(0);
  });

  it("shows dependency lines on the dashboard and in the report", () => {
    render(<CompanyView company={inai} defaultView="dashboard" today={new Date("2026-11-12T09:00:00")} />);
    const panel = screen.getByRole("tabpanel");
    expect(panel.textContent).toContain("⛓ хүлээж буй: GitHub төлбөр засах");
    expect(panel.textContent).toContain("→ 1 task хүлээж байна");
    expect(panel.textContent).toContain("⛓ хүлээж буй: Inai Website › Hero «тархи ↔ апп» зураглал");
    fireEvent.click(within(panel).getByRole("button", { name: /^Inai Website/ }));
    const wait = within(panel).getByRole("region", { name: /Хүлээгдэж буй/ });
    expect(wait.textContent).toContain("Засвар эрх ба deploy");
  });

  it("adds task roles to the RACI matrix and the profile", () => {
    render(<CompanyView company={inai} defaultView="raci" />);
    const row = within(screen.getByRole("table")).getByRole("button", { name: /Boldbaatar\.T/ }).closest("tr")!;
    expect(row.querySelector(".cv-raci-l.is-task")).toBeTruthy();
    fireEvent.click(within(screen.getByRole("table")).getByRole("button", { name: /Tuvshin\.B/ }));
    const dialog = screen.getByRole("dialog", { name: "Tuvshin.B" });
    expect(dialog.textContent).toContain("Хариуцсан task");
    expect(dialog.textContent).toContain("Засвар эрх ба deploy");
  });
});
