// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ConvergeNet, convergeNetLayout, convergeStagesLayout, convergeNetGraphDemo, paraNetGroups, pickNoteNodes } from "./motion/converge-net";
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

describe("ConvergeNet stage 2 with labels", () => {
  it("draws the centre and each note as a link with its preview, on distinct dots", () => {
    render(<ConvergeNet {...convergeNetGraphDemo} notes={[{ label: "Уулзалт", href: "/a", preview: "Хоёр хувилбар" }, { label: "Тайлан", href: "/b" }]} />);
    expect(screen.getByRole("link", { name: /Уулзалт/ }).getAttribute("href")).toBe("/a");
    expect(screen.getByRole("link", { name: /Тайлан/ })).toBeTruthy();
    expect(screen.getByText("Хоёр хувилбар")).toBeTruthy();
    expect(screen.getByText("Үнийн бодлого")).toBeTruthy();
    const picks = pickNoteNodes(convergeStagesLayout(64, 11), 7);
    expect(new Set(picks).size).toBe(7);
    expect(picks).not.toContain(0);
  });
  it("shows no labels while the graph moves (loop) or past stage 2", () => {
    const { container, rerender } = render(<ConvergeNet {...convergeNetGraphDemo} stage="loop" />);
    expect(container.querySelector(".cnl")).toBeNull();
    rerender(<ConvergeNet {...convergeNetGraphDemo} stage={3} />);
    expect(container.querySelector(".cnl")).toBeNull();
  });
});

describe("ConvergeNet sizing", () => {
  it("keeps 16:9 in a parent with no height, so the canvas never grows with its pixel buffer", () => {
    const { container } = render(<ConvergeNet {...convergeNetGraphDemo} />);
    expect((container.querySelector("canvas") as HTMLCanvasElement).style.aspectRatio).toBe("16 / 9");
  });
});

describe("BuildWizard with no props", () => {
  it("mounts with the ac.me demo recipe (no branch_key crash)", () => {
    const { container } = render(<BuildWizard />);
    expect(container.textContent?.length ?? 0).toBeGreaterThan(20);
  });
});

describe("BrainGraph (Obsidian маяг, 2026-11-19)", () => {
  const center = { label: "INAI онлайн орчин" };
  const notes = [{ label: "Судалгаа", href: "/research.html" }, { label: "Figma дизайн" }, { label: "Brand kit", href: "/brand.html" }];

  it("lays the same graph for the same seed; the centre links to every hub", async () => {
    const { brainGraphLayout } = await import("./motion/brain-graph");
    const a = brainGraphLayout(center, notes, 40, 11), b = brainGraphLayout(center, notes, 40, 11);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(brainGraphLayout(center, notes, 40, 12))).not.toBe(JSON.stringify(a));
    expect(a.nodes).toHaveLength(1 + notes.length + 40);
    for (let i = 1; i <= notes.length; i++) expect(a.links).toContainEqual([0, i]);
  });

  it("hubs carry more links than plain notes, so they draw bigger", async () => {
    const { brainGraphLayout } = await import("./motion/brain-graph");
    const g = brainGraphLayout(center, notes, 60, 11);
    const hubMin = Math.min(...g.degree.slice(1, notes.length + 1));
    const noteMax = Math.max(...g.degree.slice(notes.length + 1));
    expect(hubMin).toBeGreaterThan(noteMax);
  });

  it("ConvergeNet interactive renders the graph: an image with a description and real links", () => {
    render(<ConvergeNet interactive stage={2} tone="cream" center={center} notes={notes} />);
    const img = screen.getByRole("img", { name: /INAI онлайн орчин/ });
    expect(img.tagName).toBe("CANVAS");
    const links = screen.getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/research.html", "/brand.html"]);
  });

  it("without interactive the still stage-2 picture is unchanged", () => {
    render(<ConvergeNet stage={2} tone="cream" center={center} notes={notes} />);
    expect(screen.getByRole("img").getAttribute("data-stage")).toBe("2");
  });
});

describe("BrainGraph on touch screens", () => {
  it("lets a vertical swipe scroll the page instead of trapping it", async () => {
    const { BrainGraph } = await import("./motion/brain-graph");
    render(<BrainGraph center={{ label: "Төв" }} notes={[{ label: "А" }]} />);
    expect((screen.getByRole("img") as HTMLCanvasElement).style.touchAction).toBe("pan-y");
  });
});
