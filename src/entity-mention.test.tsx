// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CitedAnswer, citedSegmentsFrom } from "./library/cited-answer";
import { EntityMention, entityMentionDemo, withMentions } from "./library/entity-mention";
import { askDemoMentions, askWindowMentionsDemo, citedAnswerDemo } from "./screens/ask-demo-data";

afterEach(cleanup);

describe("EntityMention (screens.21)", () => {
  it("opens its card on focus and on tap, shows type, lines and the note; Escape closes", () => {
    render(<p>Туршилт <EntityMention {...entityMentionDemo} /> хийнэ.</p>);
    const chip = screen.getByRole("button", { name: /Салбар 07/ });
    fireEvent.focus(chip);
    return new Promise<void>((done) => setTimeout(() => {
      const card = screen.getByRole("dialog", { name: "Салбар 07" });
      expect(card.textContent).toContain("салбар");
      expect(card.textContent).toContain("Эх: Салбарын бүртгэл");
      expect(card.querySelectorAll(".em-lines > span")).toHaveLength(3);
      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.queryByRole("dialog")).toBeNull();
      done();
    }, 10));
  });
  it("the card is spans only, so it sits inside a sentence as valid HTML", () => {
    const { container } = render(<p><EntityMention {...entityMentionDemo} /></p>);
    fireEvent.click(screen.getByRole("button", { name: /Салбар 07/ }));
    return new Promise<void>((done) => setTimeout(() => {
      expect(container.querySelector("p div, p blockquote, p p")).toBeNull();
      done();
    }, 10));
  });
});

describe("CitedAnswer with mentions and numbered rows", () => {
  it("turns «@Нэр» into chips and keeps «01», «02» rows", () => {
    const { container } = render(<CitedAnswer segments={askWindowMentionsDemo.answer} sources={citedAnswerDemo.sources} renderText={(t) => withMentions(t, askDemoMentions)} />);
    expect(screen.getAllByRole("button", { name: /· ажилтан|· салбар|· борлуулалтын суваг/ })).toHaveLength(4);
    expect([...container.querySelectorAll(".ca-n")].map((n) => n.textContent)).toEqual(["01", "02"]);
    expect(container.textContent).not.toContain("[1]");
  });
  it("citedSegmentsFrom maps [n] to the source ids in order", () => {
    const segs = citedSegmentsFrom({ direct: "А [2]; Б [1].", list: [{ n: "01", text: "В [3]." }], next: "Г." }, ["d", "m", "s"]);
    expect(segs.map((s) => s.cite?.[0] ?? null)).toEqual(["m", "d", "s", null]);
    expect(segs.find((s) => s.n === "01")?.text).toContain("В");
    expect(segs[segs.length - 1].paragraph).toBe(true);
  });
});
