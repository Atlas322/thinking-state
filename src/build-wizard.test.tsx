// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BuildWizard, toDraftCompany } from "./screens/build-wizard";
import { buildRecipeDemo, methodQuizRecipeDemo } from "./screens/build-recipe-demo";
afterEach(cleanup);
const next = () => fireEvent.click(screen.getByRole("button", { name: /Дараах|Ноорог гаргах/ }));

describe("BuildWizard", () => {
  it("needs a company name, then the method; other steps can be skipped", () => {
    render(<BuildWizard recipe={buildRecipeDemo} />);
    const nextBtn = () => screen.getByRole("button", { name: /Дараах/ }) as HTMLButtonElement;
    expect(nextBtn().disabled).toBe(true);
    fireEvent.change(screen.getByLabelText(/Компанийн нэр/), { target: { value: "ACME" } });
    expect(nextBtn().disabled).toBe(false);
    next();
    expect(screen.queryByRole("button", { name: "Алгасах" })).toBeNull(); // the method is required
    expect(nextBtn().disabled).toBe(true);
    fireEvent.click(screen.getByLabelText(/Бизнес загварын канвас/));
    next();
    expect(screen.getByText("Хэнд зориулдаг вэ?")).toBeTruthy(); // BMC questions
    fireEvent.click(screen.getByRole("button", { name: "Алгасах" }));
    expect(screen.getByRole("heading", { name: "Танай мэдлэг хаана байна?" })).toBeTruthy();
  });

  it("«Мэдэхгүй байна» opens MethodQuiz; its result picks the method and goes on", () => {
    render(<BuildWizard recipe={buildRecipeDemo} quiz={methodQuizRecipeDemo} defaultAnswers={{ name: "ACME" }} defaultStep={1} />);
    fireEvent.click(screen.getByRole("button", { name: "Мэдэхгүй байна" }));
    for (const label of ["Багаа нэг зорилгод төвлөрүүлэх", "Өсөж, тэлж байна", "Нэг баг", "Улирлаар"]) {
      fireEvent.click(screen.getByLabelText(new RegExp(label)));
      fireEvent.click(screen.getByRole("button", { name: /Дараах/ }));
    }
    expect(screen.getByRole("status").textContent).toContain("Дараа нь сольж болно");
    fireEvent.click(screen.getByRole("button", { name: /Энэ аргаар үргэлжлүүлэх/ }));
    expect(screen.getByText("Энэ улиралд юунд хүрэхийг хүсэж байна вэ?")).toBeTruthy(); // OKR questions
  });

  it("builds a draft Company from the answers, inventing nothing", () => {
    const onComplete = vi.fn();
    render(<BuildWizard recipe={buildRecipeDemo} defaultAnswers={{ name: "ACME", methodology: "bmc", customers: "Хотын жижиг дэлгүүрүүд" }} defaultStep={3} onComplete={onComplete} />);
    next();
    const draft = onComplete.mock.calls[0][1];
    expect(draft.methodology).toBe("bmc");
    expect(draft.model).toEqual({ customers: "Хотын жижиг дэлгүүрүүд" });
    expect(screen.getByText("Танай тархины ноорог бэлэн.")).toBeTruthy();
    expect(screen.getAllByText(/Хоосон/).length).toBe(8); // the other BMC blocks stay empty
  });

  it("maps OKR and PMBOK answers into the contract (progress unknown, risks as tasks)", () => {
    const okr = toDraftCompany(buildRecipeDemo, { name: "A", methodology: "okr", objectives: ["Борлуулалт өсгөх", ""], key_results: { "0": ["Шинэ харилцагч"] } });
    expect(okr.okrs?.[0].title).toBe("Борлуулалт өсгөх");
    expect(okr.okrs?.length).toBe(1);
    expect(Number.isFinite(okr.okrs?.[0].keyResults[0].progress)).toBe(false);
    const pm = toDraftCompany(buildRecipeDemo, { name: "A", methodology: "pmbok", projects: ["Агуулах"], phase: "Гүйцэтгэх", risks: "Нийлүүлэлт хоцрох", stakeholders: "Захирал" });
    expect(pm.projects[0]).toMatchObject({ name: "Агуулах", phase: "executing" });
    expect(pm.tasks?.map((t) => t.knowledgeArea)).toEqual(["risk", "stakeholder"]);
  });
});
