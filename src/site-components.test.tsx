// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AgentConsent, Footer, NavBar, ScenarioChat } from "./lib/index";
import { DEMO_FOOTER, DEMO_NAV, DEMO_SCENARIOS } from "./ui/site-demo";

afterEach(cleanup);

describe("NavBar", () => {
  it("opens a menu, marks the current page and closes on Escape", () => {
    render(<NavBar items={DEMO_NAV} current="#answers" />);
    const trigger = screen.getByRole("button", { name: /Бүтээгдэхүүн/ });
    expect(trigger.className).toContain("is-here");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const panel = document.getElementById(trigger.getAttribute("aria-controls")!)!;
    expect(within(panel).getByRole("link", { name: /Эх сурвалжтай хариулт/ }).getAttribute("aria-current")).toBe("page");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("the phone menu folds the same map, one column at a time", () => {
    render(<NavBar items={DEMO_NAV} />);
    // the toggle is display:none above 860 px and jsdom applies the CSS, so its
    // accessible name computes empty: find it by class, check the label directly
    const toggle = document.querySelector<HTMLButtonElement>(".ts-nav-toggle")!;
    expect(toggle.getAttribute("aria-label")).toBe("Цэс нээх");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-label")).toBe("Цэс хаах");
    const mobile = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(mobile.hidden).toBe(false);
    const col = [...mobile.querySelectorAll<HTMLButtonElement>(".ts-mobile-h")].find((b) => b.textContent?.includes("Шийдэл"))!;
    fireEvent.click(col);
    expect(col.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("Footer", () => {
  it("prints the map, the source line and marks the current page", () => {
    render(<Footer columns={DEMO_FOOTER} owner="© 2026" source={{ label: "эх: vault", updated: "2026-11-12" }} current="#team" />);
    expect(screen.getByRole("navigation", { name: "Шийдэл" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Баг" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByText(/шинэчлэгдсэн 2026-11-12/)).toBeTruthy();
    expect(document.body.textContent).not.toContain("—");
  });
});

describe("ScenarioChat", () => {
  it("picking a question shows its whole answer with sources and guard", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<ScenarioChat scenarios={DEMO_SCENARIOS} />);
    fireEvent.click(screen.getByRole("button", { name: /3 нэхэмжлэхийг/ }));
    expect(screen.getByRole("button", { name: /3 нэхэмжлэхийг/ }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("Нэхэмжлэхийн дараалал")).toBeTruthy();
    expect(screen.getByText("Хүн батална")).toBeTruthy(); // manual = final state, guard confirmed
    vi.unstubAllGlobals();
  });
});

describe("AgentConsent", () => {
  it("decides, folds to the result and can change it", () => {
    const onDecide = vi.fn();
    render(<AgentConsent agent={{ name: "Туслах" }} action="файл унших" target="Drive" duration={60} onDecide={onDecide} />);
    fireEvent.click(screen.getByRole("radio", { name: /1 цаг/ }));
    fireEvent.click(screen.getByRole("button", { name: "1 цаг зөвшөөрөх" }));
    expect(onDecide).toHaveBeenCalledWith({ allow: true, scope: "timed" });
    expect(screen.getByText("Зөвшөөрлөө")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Өөрчлөх" }));
    expect(screen.getByRole("button", { name: "Татгалзах" })).toBeTruthy();
  });

  it("destructive actions never offer «always»", () => {
    render(<AgentConsent agent={{ name: "Туслах" }} action="бүртгэл устгах" target="CRM" risk="destructive" />);
    expect(screen.queryByRole("radio", { name: /Үргэлж/ })).toBeNull();
  });
});

describe("ScenarioChat on narrow screens", () => {
  it("folds the other questions behind «Бусад асуулт (n)»", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<ScenarioChat scenarios={DEMO_SCENARIOS} />);
    const more = document.querySelector<HTMLButtonElement>(".ts-sc-more")!;
    expect(more.textContent).toContain("Бусад асуулт (2)");
    fireEvent.click(more);
    expect(more.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(more.getAttribute("aria-controls")!)?.hasAttribute("data-open")).toBe(true);
    vi.unstubAllGlobals();
  });
});
