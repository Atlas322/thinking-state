// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CashRiver, cashRiverDemo } from "./screens/cash-river";

afterEach(cleanup);

describe("CashRiver («Мөнгөний гол»)", () => {
  it("names the lowest balance and the danger days in text, not colour alone", () => {
    render(<CashRiver {...cashRiverDemo} />);
    expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(/хамгийн бага 782 \(25-нд\).*2 өдөр хязгаараас доош/);
    expect(screen.getByText(/Аюултай өдөр/).textContent).toMatch(/0 → 2/);
  });
  it("«Хэрэв…»: switching the planned payment off puts the river back above the floor", () => {
    render(<CashRiver {...cashRiverDemo} />);
    const truck = screen.getByRole("button", { name: /Шинэ машины урьдчилгаа/ });
    expect(truck.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(truck);
    expect(truck.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText(/Аюултай өдөр/).textContent).toMatch(/0 → 0/);
  });
  it("without a scenario it is a plain river (no side panel)", () => {
    const { container } = render(<CashRiver {...cashRiverDemo} scenario={undefined} suggestion={undefined} />);
    expect(container.querySelector(".cr-side")).toBeNull();
  });
});
