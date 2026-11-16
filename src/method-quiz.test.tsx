// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MethodQuiz, methodQuizDemo, scoreMethods } from "./screens/method-quiz";
afterEach(cleanup);

describe("MethodQuiz", () => {
  it("scores answers by option weights", () => {
    const s = scoreMethods(methodQuizDemo.questions, { goal: "focus", stage: "grow", team: "m", horizon: "quarter" });
    expect(Object.entries(s).sort((a, b) => b[1] - a[1])[0][0]).toBe("okr");
  });
  it("needs an answer before Next, then walks to the result and reports it", () => {
    const onComplete = vi.fn();
    render(<MethodQuiz {...methodQuizDemo} onComplete={onComplete} />);
    const next = () => screen.getByRole("button", { name: /Дараах/ }) as HTMLButtonElement;
    expect(next().disabled).toBe(true);
    for (const label of ["Том төслийг хугацаанд нь дуусгах", "Тогтвортой, олон төсөлтэй", "30-аас дээш", "Жил ба түүнээс урт"]) {
      fireEvent.click(screen.getByLabelText(new RegExp(label)));
      fireEvent.click(next());
    }
    expect(screen.getByRole("status").textContent).toContain("PMBOK");
    expect(onComplete).toHaveBeenCalledWith("pmbok", expect.objectContaining({ goal: "deliver" }));
  });
  it("goes back and keeps the earlier answer", () => {
    render(<MethodQuiz {...methodQuizDemo} />);
    fireEvent.click(screen.getByLabelText(/Шинэ санааг хурдан турших/));
    fireEvent.click(screen.getByRole("button", { name: /Дараах/ }));
    fireEvent.click(screen.getByRole("button", { name: "Буцах" }));
    expect((screen.getByLabelText(/Шинэ санааг хурдан турших/) as HTMLInputElement).checked).toBe(true);
  });
});

describe("MethodQuiz on one page twice", () => {
  it("keeps each quiz's answer (radio groups do not collide)", () => {
    render(<><MethodQuiz {...methodQuizDemo} defaultAnswers={{ goal: "focus" }} /><MethodQuiz {...methodQuizDemo} defaultAnswers={{ goal: "deliver" }} /></>);
    const checked = [...document.querySelectorAll<HTMLInputElement>("input:checked")].map((x) => x.value);
    expect(checked).toEqual(["focus", "deliver"]);
  });
});
