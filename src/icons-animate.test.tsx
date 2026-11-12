// @vitest-environment jsdom
// B: <Icon name animate> (Lucide shapes, lucide-animated motions) and the footer link icon.
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Icon } from "./company/icons";
import { Footer } from "./ui/site";

afterEach(cleanup);

describe("<Icon animate>", () => {
  it("is still by default", () => {
    const { container } = render(<Icon name="arrow-right" />);
    expect(container.querySelector("svg")?.hasAttribute("data-anim")).toBe(false);
  });
  it("gets its family's motion on hover, or once on mount", () => {
    const { container } = render(
      <>
        <Icon name="arrow-right" animate />
        <Icon name="rotate-ccw" animate="once" />
        <Icon name="database" animate />
      </>,
    );
    const [a, b, c] = container.querySelectorAll("svg");
    expect([a.dataset.anim, a.dataset.animOn]).toEqual(["nudge", "hover"]);
    expect([b.dataset.anim, b.dataset.animOn]).toEqual(["spin-back", "once"]);
    expect(c.dataset.anim).toBe("pop");
  });
});

describe("Footer link icon", () => {
  it("draws an animated icon before the label", () => {
    const { container } = render(
      <Footer owner="©" columns={[{ id: "c", label: "Нөөц", groups: [{ label: "", links: [{ label: "Уншвар", href: "#r", icon: "book-open" }, { label: "Шинэчлэл", href: "#c" }] }] }]} />,
    );
    const [withIcon, plain] = container.querySelectorAll(".ts-footer-col a");
    expect(withIcon.querySelector("svg[data-anim-on=hover]")).not.toBeNull();
    expect(plain.querySelector("svg")).toBeNull();
  });
});
