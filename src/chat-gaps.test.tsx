// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { NextStepBox } from "./library/next-step-box";
import { SessionOffer } from "./library/session-offer";
import { SideSessions } from "./library/side-sessions";
import { ChapterDivider } from "./library/chapter-divider";

beforeEach(() =>
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((q: string) => ({ matches: q.includes("reduce"), media: q, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  }),
);
afterEach(cleanup);

describe("NextStepBox", () => {
  it("draws the first action as primary, marks blocked and returns the answer", () => {
    const onAction = vi.fn();
    const { container } = render(
      <NextStepBox recap="Done." ask="Ship it?" blocked actions={[{ id: "y", label: "Yes" }, { id: "n", label: "No" }]} onAction={onAction} />,
    );
    expect(container.querySelector(".nsb")!.className).toContain("is-blocked");
    const yes = screen.getByRole("button", { name: "Yes" });
    expect(yes.className).toContain("is-primary");
    expect(screen.getByRole("button", { name: "No" }).className).not.toContain("is-primary");
    fireEvent.click(yes);
    expect(onAction).toHaveBeenCalledWith({ id: "y", label: "Yes" });
    expect(screen.getByRole("status").textContent).toContain("Yes");
    expect(container.querySelector(".nsb")!.className).not.toContain("is-blocked");
  });

  it("shows the recap alone when nothing waits on the person", () => {
    render(<NextStepBox recap="All merged." ask="" actions={[]} />);
    expect(screen.getByText("All merged.")).toBeTruthy();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});

describe("SessionOffer", () => {
  it("offers New session / Do it here and settles on the choice", () => {
    const onChoose = vi.fn();
    render(<SessionOffer title="Fix contrast" initiation="offer" onChoose={onChoose} />);
    fireEvent.click(screen.getByRole("button", { name: "Энд хийх" }));
    expect(onChoose).toHaveBeenCalledWith("here");
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toContain("Энэ сешнд");
  });

  it("an own proposal can be started or dismissed", () => {
    render(<SessionOffer title="Docs" initiation="own_initiative" state="offered" />);
    expect(screen.getByRole("button", { name: "Эхлүүлэх" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Хэрэггүй" })).toBeTruthy();
  });
});

describe("SideSessions", () => {
  it("groups sessions by state and archives only after check and update", () => {
    const onStep = vi.fn();
    render(
      <SideSessions
        onStep={onStep}
        sessions={[
          { id: "a", title: "Alpha", state: "running" },
          { id: "b", title: "Beta", state: "done", steps: [] },
          { id: "c", title: "Gamma", state: "needs" },
        ]}
      />,
    );
    const regions = screen.getAllByRole("region").map((r) => r.getAttribute("aria-label"));
    expect(regions).toEqual(["Таны ээлж", "Ажиллаж байна", "Дууссан"]);
    // only the next step of the chain is a button
    expect(screen.getByRole("button", { name: "Шалгах" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Архивлах" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Шалгах" }));
    expect(onStep).toHaveBeenCalledWith(expect.objectContaining({ id: "b" }), "check");
  });

  it("walks the close-out chain in its own state", () => {
    render(<SideSessions />);
    fireEvent.click(screen.getByRole("button", { name: "Шинэчлэх" }));
    fireEvent.click(screen.getByRole("button", { name: "Архивлах" }));
    expect(screen.getByText(/архивласан/)).toBeTruthy();
  });
});

describe("ChapterDivider", () => {
  it("marks the current chapter and jumps on click", () => {
    const onJump = vi.fn();
    render(<ChapterDivider chapters={[{ id: "a", title: "Explore" }, { id: "b", title: "Build" }]} onJump={onJump} />);
    expect(screen.getByRole("separator").textContent).toContain("Build");
    fireEvent.click(screen.getByRole("button", { name: /Explore/ }));
    expect(onJump).toHaveBeenCalledWith({ id: "a", title: "Explore" });
    expect(screen.getByRole("separator").textContent).toContain("Explore");
    expect(screen.getByRole("button", { name: /Explore/ }).getAttribute("aria-current")).toBe("step");
  });
});
