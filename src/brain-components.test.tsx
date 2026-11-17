// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { layoutBrain } from "./brain/field";
import { BrainMap, brainMapDemo } from "./library/brain-map";
import { BrainGrowth } from "./library/brain-growth";
import { ModuleScene, moduleSceneDemo } from "./library/module-scene";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const on = (c: HTMLElement, sel: string) => c.querySelectorAll(`${sel}[data-on]`).length;

describe("brain field", () => {
  it("is a pure function of the seed (same picture on server and client)", () => {
    const cl = [{ id: "a", x: 100, y: 100, r: 30, n: 20 }, { id: "b", x: 250, y: 100, r: 20, n: 10 }];
    const ln = [{ from: "a", to: "b", strands: 3 }];
    expect(layoutBrain(cl, ln, 5)).toEqual(layoutBrain(cl, ln, 5));
    expect(layoutBrain(cl, ln, 5)).not.toEqual(layoutBrain(cl, ln, 6));
    expect(renderToString(<BrainGrowth progress={0.5} />)).toBe(renderToString(<BrainGrowth progress={0.5} />));
  });
});

describe("Brain Map", () => {
  it("shows the brain, its branches and agents with their work", () => {
    const { container } = render(<BrainMap progress={1} />);
    expect(container.querySelectorAll(".bm-col")).toHaveLength(3);
    expect(container.querySelectorAll(".bm-agent[data-on]")).toHaveLength(6);
    expect(screen.getByText(brainMapDemo.branches[0].agents[0].job)).toBeTruthy();
    expect(container.textContent).not.toMatch(/\b(atom|vault|node)\b/i);
  });
  it("plays itself in sequence within 5 s", () => {
    vi.useFakeTimers();
    const { container } = render(<BrainMap />);
    expect(on(container, ".bm-agent")).toBe(0);
    act(() => void vi.advanceTimersByTime(1500));
    const mid = on(container, "circle");
    expect(mid).toBeGreaterThan(0);
    expect(on(container, ".bm-agent")).toBe(0);
    act(() => void vi.advanceTimersByTime(3500));
    expect(on(container, ".bm-agent")).toBe(6);
    expect(on(container, "circle")).toBeGreaterThan(mid);
  });
});

describe("Brain Growth", () => {
  it("follows outside scroll progress: links grow, stages advance", () => {
    const { container, rerender } = render(<BrainGrowth progress={0.2} />);
    expect(container.querySelector("[aria-current=step]")!.textContent).toContain("Хувийн тархи");
    const links0 = on(container, "line");
    rerender(<BrainGrowth progress={0.5} />);
    expect(container.querySelector("[aria-current=step]")!.textContent).toContain("Багийн тархи");
    rerender(<BrainGrowth progress={1} />);
    expect(container.querySelector("[aria-current=step]")!.textContent).toContain("Байгууллагын тархи");
    expect(on(container, "line")).toBeGreaterThan(links0);
  });
  it("shows the final state at once under reduced motion", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({ matches: true, media: q }) as MediaQueryList);
    const { container } = render(<BrainGrowth />);
    expect(container.querySelector("[aria-current=step]")!.textContent).toContain("Байгууллагын тархи");
    expect(on(container, "circle")).toBe(container.querySelectorAll("circle").length);
    vi.unstubAllGlobals();
  });
});

describe("Module Scene", () => {
  it("shows four departments wired to one brain, each with its agent at work", () => {
    vi.useFakeTimers();
    const { container } = render(<ModuleScene />);
    act(() => void vi.advanceTimersByTime(5000));
    expect(container.querySelectorAll(".ms-card[data-on]")).toHaveLength(4);
    expect(screen.getByText(moduleSceneDemo.modules[2].job)).toBeTruthy();
    expect(container.querySelectorAll(".ms-kpis[data-on] dd")).toHaveLength(12);
  });
  it("takes its own departments", () => {
    render(<ModuleScene modules={[{ id: "x", title: "Хүний нөөц", agent: "Сонгон шалгаруулагч", job: "Анкет ангилав", kpis: [{ value: "5", label: "ярилцлага" }] }]} />);
    expect(screen.getByText("Хүний нөөц")).toBeTruthy();
  });
});

describe("BrainMap answers the pointer (screens.23)", () => {
  it("a branch lights up on the picture and in its list column together; a tap pins it, a second tap lets go", () => {
    const { container } = render(<BrainMap progress={1} />);
    const marks = [...container.querySelectorAll("button.bm-mark")] as HTMLElement[];
    const cols = [...container.querySelectorAll(".bm-col")] as HTMLElement[];
    expect(marks).toHaveLength(3);
    expect(container.querySelector(".bm")?.hasAttribute("data-active")).toBe(false);
    fireEvent.click(cols[1].querySelector("button")!); // «Агентууд» in the list
    expect(marks[1].hasAttribute("data-hot")).toBe(true); // the same branch on the picture
    expect(cols[1].hasAttribute("data-hot")).toBe(true);
    expect(cols[0].hasAttribute("data-hot")).toBe(false);
    expect(container.querySelector(".bf")?.hasAttribute("data-active")).toBe(true);
    const hotDots = container.querySelectorAll(".bf-dots circle[data-hot]").length;
    const allDots = container.querySelectorAll(".bf-dots circle").length;
    expect(hotDots).toBeGreaterThan(40); // the core stays with the branch
    expect(hotDots).toBeLessThan(allDots);
    fireEvent.click(marks[1]);
    expect(container.querySelector(".bm")?.hasAttribute("data-active")).toBe(false);
  });
});
