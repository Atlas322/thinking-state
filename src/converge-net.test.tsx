// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ConvergeNet, convergeNetLayout } from "./motion/converge-net";
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

describe("BuildWizard with no props", () => {
  it("mounts with the ac.me demo recipe (no branch_key crash)", () => {
    const { container } = render(<BuildWizard />);
    expect(container.textContent?.length ?? 0).toBeGreaterThan(20);
  });
});
