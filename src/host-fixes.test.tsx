// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MethodologyView } from "./company/methodology";
import { acmeGroup } from "./company/fixtures";
import { Replay } from "./replay/replay";
import type { Company } from "./company/types";

afterEach(cleanup);

// ac.me with two unpublished (null) and two unfilled blocks.
const company: Company = {
  ...acmeGroup,
  model: { ...acmeGroup.model, partners: null, costs: null, activities: "", resources: [] },
};

const titles = (container: HTMLElement) => [...container.querySelectorAll(".cv-bmc-cell")].map((s) => s.getAttribute("aria-label"));

describe("canvas blocks (inai-sh public pages)", () => {
  it("never shows null blocks; shows unfilled ones as «Бөглөөгүй» by default", () => {
    const { container } = render(<MethodologyView c={company} scoped={company} methodology="bmc" />);
    const t = titles(container);
    expect(t).not.toContain("Гол түнш");
    expect(t).not.toContain("Зардлын бүтэц");
    expect(t).toContain("Гол үйл ажиллагаа");
    expect(container.textContent).toContain("Бөглөөгүй");
    expect(container.querySelector(".cv-bmc")?.classList.contains("is-flow")).toBe(true);
  });

  it("hideEmpty keeps only filled blocks in a flowing grid", () => {
    const { container } = render(<MethodologyView c={company} scoped={company} methodology="bmc" hideEmpty />);
    const t = titles(container);
    expect(t).not.toContain("Гол үйл ажиллагаа");
    expect(t).not.toContain("Гол нөөц");
    expect(container.textContent).not.toContain("Бөглөөгүй");
    const cells = container.querySelectorAll<HTMLElement>(".cv-bmc-cell");
    expect([...cells].every((c) => !c.style.gridArea)).toBe(true);
  });

  it("a full canvas keeps the classic 5-column areas", () => {
    const full: Company = { ...acmeGroup, model: { ...acmeGroup.model, partners: "a", activities: "b", resources: "c", relationships: "d", costs: "e" } };
    const { container } = render(<MethodologyView c={full} scoped={full} methodology="bmc" hideEmpty />);
    expect(container.querySelector(".cv-bmc")?.classList.contains("is-flow")).toBe(false);
  });
});

describe("<Replay placement>", () => {
  it("outside reserves a strip above the content for ↺", () => {
    const { container } = render(
      <Replay placement="outside">
        <p>x</p>
      </Replay>,
    );
    expect(container.querySelector(".ts-replay")?.getAttribute("data-placement")).toBe("outside");
    expect(screen.getByRole("button", { name: "Дахин тоглуулах" })).toBeTruthy();
  });
});
