// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

afterEach(cleanup);
import { UseCaseRun, useCaseRunDemo } from "./library/usecase-run";

describe("Use Case Run", () => {
  it("shows every stage of the cycle with numbered sources", () => {
    const { container } = render(<UseCaseRun />);
    expect(container.querySelectorAll(".ur-stage")).toHaveLength(6);
    expect(container.querySelectorAll(".ur-chip")).toHaveLength(useCaseRunDemo.sources.length);
    expect(container.querySelector(".ur-badge")!.textContent).toBe("Ноорог");
  });
  it("opens a source quote from a step reference", () => {
    render(<UseCaseRun />);
    fireEvent.click(screen.getAllByRole("button", { name: /Санах ойгоос олсон 2/ })[0]);
    expect(screen.getByRole("note").textContent).toContain("Түр зогсоолт хөнгөлөлтийг");
  });
  it("saves the artifact only after a person approves, and can undo", () => {
    const onDecide = vi.fn();
    const { container } = render(<UseCaseRun onDecide={onDecide} />);
    fireEvent.click(screen.getByRole("button", { name: "Батлах" }));
    expect(onDecide).toHaveBeenCalledWith("approved");
    expect(container.querySelector(".ur-badge")!.textContent).toBe("Vault-д хадгалагдсан");
    expect(container.querySelector(".ur-step.is-active")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Буцаах" }));
    expect(container.querySelector(".ur-badge")!.textContent).toBe("Ноорог");
  });
  it("takes its own scenario data", () => {
    render(
      <UseCaseRun
        title="Гомдлыг task болгох"
        input={{ text: "Хүргэлт хоцорлоо" }}
        sources={[{ id: "x", label: "SLA" }]}
        steps={[{ id: "a", label: "Ангилав", uses: ["x"] }]}
        approval={{ question: "Task нээх үү?" }}
        artifact={{ kind: "Task", title: "Хүргэлтийн хоцрогдол" }}
      />,
    );
    expect(screen.getByText("Гомдлыг task болгох")).toBeTruthy();
    expect(screen.getByText("Task нээх үү?")).toBeTruthy();
  });
});
