// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render } from "@testing-library/react";
import { WorkflowRun, workflowRunDemo } from "./screens/workflow-run";

afterEach(cleanup);

describe("WorkflowRun (screens.23)", () => {
  it("the finished state says every step's state in words, each with its own shape", () => {
    const { container } = render(<WorkflowRun {...workflowRunDemo} still />);
    const states = [...container.querySelectorAll(".wr-apps .wr-state")].map((x) => x.textContent);
    expect(states.filter((x) => x === "Бэлэн")).toHaveLength(5);
    expect(states).toContain("Дутуу");
    expect(states).toContain("Хүлээгдэж буй");
    expect(container.querySelector(".wr-sum")?.textContent).toBe("7 алхмын 5 бэлэн · 1 дутуу · 1 хүлээгдэж буй");
    const shapes = new Set([...container.querySelectorAll(".wr-apps .wr-mark")].map((x) => x.getAttribute("data-shape")));
    expect(shapes.size).toBe(3);
    expect(container.querySelector(".wr-back")?.getAttribute("data-on")).toBe("true");
    expect(workflowRunDemo.note).toMatch(/демо/);
  });
  it("the story plays in the order the work travels: sources, agents, apps one by one, outputs, then the loop closes", () => {
    vi.useFakeTimers();
    const { container } = render(<WorkflowRun {...workflowRunDemo} />);
    const seen: string[] = [];
    const snap = () => {
      const shown = (sel: string) => container.querySelectorAll(`${sel} .wr-card:not([data-hide="true"])`).length;
      const s = `${container.querySelectorAll('.wr-col:first-child .wr-card[data-on="true"]').length}/${shown(".wr-apps")}/${shown(".wr-col:last-child")}/${container.querySelector(".wr-back")?.getAttribute("data-on")}`;
      if (seen.at(-1) !== s) seen.push(s);
    };
    snap();
    for (let i = 0; i < 80; i++) { act(() => { vi.advanceTimersByTime(250); }); snap(); }
    expect(seen[0]).toBe("0/0/0/false");
    expect(seen).toContain("4/0/0/false"); // the folders light up before any app shows
    expect(seen).toContain("4/3/0/false"); // apps arrive one by one
    expect(seen).toContain("4/7/2/false"); // outputs only after every app
    expect(seen).toContain("4/7/4/true"); // the loop closes last
    const order = ["4/0/0/false", "4/3/0/false", "4/7/2/false", "4/7/4/true"].map((x) => seen.indexOf(x));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    vi.useRealTimers();
  });
});
