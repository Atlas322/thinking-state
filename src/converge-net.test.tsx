// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ConvergeNet, convergeNetLayout, convergeStagesLayout, paraNetGroups } from "./motion/converge-net";
import { BuildWizard } from "./screens/build-wizard";

afterEach(cleanup);
vi.setConfig({ testTimeout: 30_000 });

describe("ConvergeNet", () => {
  it("is an image with a description and a token colour per tone", () => {
    render(<ConvergeNet play="static" tone="cream" />);
    const c = screen.getByRole("img", { name: /нэг сүлжээ болно/ });
    expect(c.getAttribute("data-tone")).toBe("cream");
    expect((c as HTMLCanvasElement).style.color).toContain("--ts-electric");
  });
  it("the same seed draws the same network (deterministic), another seed another one", () => {
    expect(JSON.stringify(convergeNetLayout(72, 7))).toBe(JSON.stringify(convergeNetLayout(72, 7)));
    expect(JSON.stringify(convergeNetLayout(72, 8))).not.toBe(JSON.stringify(convergeNetLayout(72, 7)));
    const net = convergeNetLayout(72, 7);
    expect(net.nodes).toHaveLength(72);
    expect(net.links.length).toBeGreaterThan(72);
  });
});

describe("ConvergeNet four stages", () => {
  it("takes a stage, defaults to the PARA groups, each its own shape and token colour", () => {
    render(<ConvergeNet stage={2} label="дөрвөн үе" />);
    expect(screen.getByRole("img", { name: "дөрвөн үе" }).getAttribute("data-stage")).toBe("2");
    expect(paraNetGroups.map((g) => g.label)).toEqual(["Төсөл", "Хүрээ", "Нөөц", "Архив"]);
    expect(new Set(paraNetGroups.map((g) => g.shape)).size).toBe(4);
    for (const g of paraNetGroups) expect(g.color).toMatch(/^--ts-/);
  });
  it("lays out one centre note, a group per node and a unit sphere (deterministic)", () => {
    const a = convergeStagesLayout(64, 11), b = convergeStagesLayout(64, 11);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.nodes[0].graph).toEqual([0.5, 0.5]);
    expect(new Set(a.nodes.map((n) => n.g)).size).toBe(4);
    for (const n of a.nodes) expect(Math.hypot(...n.sph)).toBeCloseTo(1, 5);
  });
});

describe("BuildWizard with no props", () => {
  it("mounts with the ac.me demo recipe (no branch_key crash)", () => {
    const { container } = render(<BuildWizard />);
    expect(container.textContent?.length ?? 0).toBeGreaterThan(20);
  });
});
