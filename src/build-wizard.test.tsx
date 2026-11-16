// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BuildWizard, toDraftCompany, visibleSteps } from "./screens/build-wizard";
import { buildRecipeDemo, methodQuizRecipeDemo } from "./screens/build-recipe-demo";
afterEach(cleanup);
const heading = (name: string) => screen.getByRole("heading", { name });
const next = () => fireEvent.click(screen.getByRole("button", { name: /Дараах|Ноорог гаргах/ }));

describe("BuildWizard (recipe v05, adaptive)", () => {
  it("personal = 5 steps, team and company = 7; the time line follows the segment", () => {
    expect(visibleSteps(buildRecipeDemo, { segment: "personal" }).map((s) => s.id)).toEqual(["who", "areas", "projects", "routines", "knowledge-agents"]);
    expect(visibleSteps(buildRecipeDemo, { segment: "team" }).length).toBe(7);
    expect(visibleSteps(buildRecipeDemo, { segment: "company" }).length).toBe(7);
    render(<BuildWizard recipe={buildRecipeDemo} defaultAnswers={{ segment: "personal" }} />);
    expect(screen.getByText(/≈5 минут · 5 алхам/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText(/Нэг баг/));
    expect(screen.getByText(/≈8 минут · 7 алхам/)).toBeTruthy();
  });

  it("needs name and segment; then asks the segment's own question and hides others", () => {
    render(<BuildWizard recipe={buildRecipeDemo} />);
    const nextBtn = () => screen.getByRole("button", { name: /Дараах/ }) as HTMLButtonElement;
    expect(nextBtn().disabled).toBe(true);
    fireEvent.change(screen.getByLabelText(/Компани эсвэл өөрийн нэр/), { target: { value: "ACME" } });
    expect(nextBtn().disabled).toBe(true);
    fireEvent.click(screen.getByLabelText(/Олон хэлтэстэй байгууллага/));
    next();
    expect(screen.getByText("Ямар хэлтэс, салбартай вэ?")).toBeTruthy(); // by_segment: company
    expect(screen.getByText("Эдгээр нь танайд юу вэ?")).toBeTruthy(); // show_if: company
    fireEvent.click(screen.getByRole("button", { name: "Алгасах" }));
    expect(heading("Одоо явж буй төслүүд")).toBeTruthy();
  });

  it("adds an area of one's own (allow_custom)", () => {
    render(<BuildWizard recipe={buildRecipeDemo} defaultAnswers={{ name: "A", segment: "personal" }} defaultStep={1} />);
    fireEvent.change(screen.getByPlaceholderText("Өөрөө нэмэх"), { target: { value: "Уран зураг" } });
    fireEvent.click(screen.getByRole("button", { name: "Өөрөө нэмэх" }));
    expect((screen.getByLabelText("Уран зураг") as HTMLInputElement).checked).toBe(true);
  });

  it("«Мэдэхгүй байна» opens MethodQuiz; its answer picks the method card", () => {
    render(<BuildWizard recipe={buildRecipeDemo} quiz={methodQuizRecipeDemo} defaultAnswers={{ name: "A", segment: "team" }} defaultStep={2} />);
    fireEvent.click(screen.getByRole("button", { name: "Мэдэхгүй байна" }));
    for (const label of ["Багаа нэг зорилгод төвлөрүүлэх", "Өсөж, тэлж байна", "Нэг баг", "Улирлаар"]) {
      fireEvent.click(screen.getByLabelText(new RegExp(label)));
      fireEvent.click(screen.getByRole("button", { name: /Дараах/ }));
    }
    fireEvent.click(screen.getByRole("button", { name: /Энэ аргаар үргэлжлүүлэх/ }));
    expect((screen.getByLabelText(/Зорилго ба гол үр дүн/) as HTMLInputElement).checked).toBe(true);
  });

  it("draws the draft sections from the answers, inventing nothing", () => {
    const onComplete = vi.fn();
    const a = { name: "ACME", segment: "team", areas: ["Борлуулалт"], projects: ["Үнийн шинэчлэл"], sops: ["Шинэ харилцагч бүртгэх"], sop_trigger: "Хүсэлт ирэхэд", roles: ["Борлуулалтын менежер"], delegate: ["Тайлан бэлтгэх"], never: "Төлбөр батлах", methodology: "okr" };
    render(<BuildWizard recipe={buildRecipeDemo} defaultAnswers={a} defaultStep={6} onComplete={onComplete} />);
    next();
    const d = onComplete.mock.calls[0][1];
    expect(d.units.map((u: { name: string }) => u.name)).toEqual(["ACME", "Борлуулалт"]);
    expect(d.workflows[0]).toMatchObject({ name: "Шинэ харилцагч бүртгэх", trigger: "Хүсэлт ирэхэд" });
    expect(d.people[0]).toMatchObject({ role: "Борлуулалтын менежер" });
    expect(d.agents[0]).toMatchObject({ role: "Тайлан бэлтгэх", memory: ["Хориг: Төлбөр батлах"] });
    for (const t of ["Борлуулалт", "Үнийн шинэчлэл", "Шинэ харилцагч бүртгэх · Хүсэлт ирэхэд", "Тайлан бэлтгэх", "OKR · Зорилго ба гол үр дүн"]) expect(screen.getByText(t)).toBeTruthy();
  });

  it("drops answers of hidden steps (a team's roles are not a personal draft)", () => {
    const d = toDraftCompany(buildRecipeDemo, { name: "A", segment: "personal", roles: ["Менежер"], habits: ["Өглөө гүйх"], rituals: ["Сарын тайлан"] });
    expect(d.people).toEqual([]);
    expect(d.collections?.map((c) => c.type)).toEqual(["habit"]);
  });
});
