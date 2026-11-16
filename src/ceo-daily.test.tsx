// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { AppShell, PARA_KEYS, acmeParaVocab, paraBaseMn } from "./screens/app-shell";
import { CeoDailyScreen, ceoDailyDemo, ceoDailyLogisticsDemo, ceoDailyScreenDemo, appShellLogisticsDemo } from "./screens/ceo-daily";

afterEach(cleanup);
vi.setConfig({ testTimeout: 30_000 });

describe("AppShell (PARA + GTD)", () => {
  it("seven places in GTD then PARA order, labels from the company vocabulary, the generic name under each", () => {
    render(<AppShell company={{ name: "ac.me Логистик" }} vocab={acmeParaVocab.logistics} />);
    const nav = screen.getByRole("navigation", { name: "Апп-ын цэс" });
    const labels = within(nav).getAllByRole("button").map((b) => b.querySelector("span")?.textContent);
    expect(labels).toEqual(["Удирдлагын тойм", ...PARA_KEYS.map((k) => acmeParaVocab.logistics[k].label), "Хуанли", "Агентууд"]);
    expect(within(nav).getByText("Гааль, хил дээр").nextSibling?.textContent).toBe(paraBaseMn.waiting.label);
  });
  it("falls back to the generic names, and marks the current place", () => {
    render(<AppShell company={{ name: "ac.me" }} active="today" onNavigate={() => {}} />);
    expect(screen.getByRole("button", { name: /Өнөөдөр/ }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByText("Хүлээгдэж буй")).toBeTruthy();
  });
  it("every ac.me vocabulary covers all seven keys", () => {
    for (const v of Object.values(acmeParaVocab)) expect(Object.keys(v).sort()).toEqual([...PARA_KEYS].sort());
  });
});

describe("CeoDaily (Удирдлагын тойм)", () => {
  it("has the owner's seven parts", () => {
    render(<CeoDailyScreen {...ceoDailyScreenDemo} />);
    for (const name of ["Гол үзүүлэлт", "Өдрийн шугам", "Хянагдахаар хүлээгдэж буй гэрээ", "Төслүүд · хүрээгээр", "Санхүүгийн зорилт", "Агентууд · хэн юуг хийж байна"]) expect(screen.getByRole("region", { name })).toBeTruthy();
    expect(screen.getByText("Уулзалтын тойм")).toBeTruthy();
  });
  it("clicking a meeting on the day line opens its overview in the aside", () => {
    render(<CeoDailyScreen {...ceoDailyScreenDemo} />);
    fireEvent.click(screen.getByRole("button", { name: /Багийн standup/ }));
    expect(screen.getByRole("button", { name: /Багийн standup/ }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Өчигдрийн 3 пост: хүрэлт 41k")).toBeTruthy();
  });
  it("over-budget goals are written, not only red", () => {
    render(<CeoDailyScreen shell={appShellLogisticsDemo} daily={ceoDailyLogisticsDemo} />);
    expect(screen.getByText(/Зорилтоос давсан: 104%/)).toBeTruthy();
  });
  it("demo copy has no second-person address and no mixed-script words", () => {
    const text = JSON.stringify([ceoDailyDemo, ceoDailyLogisticsDemo, acmeParaVocab]);
    expect(text).not.toMatch(/(^|[^А-Яа-яӨөҮү])(та|танай|таны|танд)([^А-Яа-яӨөҮү]|$)/i);
    expect(text).not.toMatch(/[A-Za-z]-?[А-Яа-яӨөҮү]|[А-Яа-яӨөҮү]-?[A-Za-z]/);
  });
});
