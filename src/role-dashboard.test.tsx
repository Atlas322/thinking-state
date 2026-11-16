// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RoleDashboard, roleView } from "./company/role-dashboard";
import { acmeGroup } from "./company/fixtures";
afterEach(cleanup);
const today = new Date("2026-11-17T00:00:00Z");

describe("RoleDashboard", () => {
  it("the group head sees every unit, counted from the data", () => {
    const v = roleView(acmeGroup, "p-khongorzul", today);
    expect(v.isHead).toBe(true);
    expect(v.unitHealth.map((u) => u.unit.id)).toEqual(["g-strategy", "g-finance", "g-it", "retail", "logistics"]);
    const all = acmeGroup.projects.flatMap((p) => p.tasks).filter((t) => !/^(done|completed)/.test(t.status)).length;
    expect(v.open.length).toBe(all);
  });
  it("burning: late first (most days late first), then waiting, then due within 7 days", () => {
    const v = roleView(acmeGroup, "p-khongorzul", today);
    const kinds = v.burning.map((b) => b.kind);
    expect(kinds.indexOf("waiting")).toBeGreaterThan(kinds.lastIndexOf("late"));
    expect(v.burning.find((b) => b.task.title === "Хэрэглэгчийн сургалт")).toMatchObject({ kind: "late", days: 9 });
  });
  it("finance sees its approval step with the agents' outputs as reasons", () => {
    const v = roleView(acmeGroup, "p-oyunaa", today);
    expect(v.finance).toBe(true);
    expect(v.approvals[0].step.label).toBe("Хаалтыг батлах");
    expect(v.approvals[0].before.map((s) => s.output)).toEqual(["Тулгалтын хүснэгт", "Зөрүүний тэмдэглэл"]);
  });
  it("a store manager sees only the store unit", () => {
    const v = roleView(acmeGroup, "p-munkh", today);
    expect(v.isHead).toBe(false);
    expect(v.projects.map((p) => p.id)).toEqual(["pr-branch"]);
  });
  it("switching position redraws the board", () => {
    let id = "p-khongorzul";
    const { rerender } = render(<RoleDashboard company={acmeGroup} personId={id} today={today} onPersonChange={(x) => (id = x)} />);
    fireEvent.click(screen.getByRole("button", { name: "Санхүүгийн захирал" }));
    rerender(<RoleDashboard company={acmeGroup} personId={id} today={today} onPersonChange={(x) => (id = x)} />);
    expect(screen.getByRole("heading", { name: "Санхүүгийн захирал" })).toBeTruthy();
    expect(screen.getByText("Хаалтыг батлах")).toBeTruthy();
  });
});

import { CompanyView } from "./company/company-view";
import { findPerson } from "./company/role-dashboard";
describe("CompanyView «Албан тушаалаар»", () => {
  it("finds a position by id, role name or URL form", () => {
    expect(findPerson(acmeGroup, "p-oyunaa")?.role).toBe("Санхүүгийн захирал");
    expect(findPerson(acmeGroup, "санхүүгийн-захирал")?.id).toBe("p-oyunaa");
    expect(findPerson(acmeGroup, encodeURIComponent("Дэлгүүрийн менежер"))?.id).toBe("p-munkh");
    expect(findPerson(acmeGroup, "байхгүй")).toBeUndefined();
  });
  it("role= opens the tab on that position", () => {
    render(<CompanyView company={acmeGroup} role="Санхүүгийн захирал" today={today} />);
    expect(screen.getByRole("tab", { name: /Албан тушаалаар/, selected: true })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Санхүүгийн захирал" })).toBeTruthy();
  });
});
