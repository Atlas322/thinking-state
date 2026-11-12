// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DecisionCard } from "./library/decision-card";

// Host mode (Second Brain app, 2026-11-12): the app's ask note is answered through the API; the host decides when the
// card goes away (after the request succeeds), shows busy/error, adds its own links, and can close an ask with a reason.
const ask = { id: "a", question: "Аль хувилбар?\nХоёр дахь мөр", task: "Inai", options: [{ id: "A", title: "A" }, { id: "B", title: "B" }] };

describe("DecisionCard in a host app", () => {
  afterEach(cleanup);

  it("host: stays after an answer (the host removes it) and keeps the full question", () => {
    const onDecide = vi.fn();
    const { container } = render(<DecisionCard host decisions={[ask]} onDecide={onDecide} />);
    fireEvent.click(screen.getByText("B"));
    expect(onDecide).toHaveBeenCalledWith("a", { option: "B" });
    expect(container.querySelector(".dc-card")).toBeTruthy();
    expect(container.querySelector(".dc-q")?.getAttribute("data-full")).toBe("true");
  });

  it("busy: choices do nothing", () => {
    const onDecide = vi.fn();
    render(<DecisionCard host busy decisions={[ask]} onDecide={onDecide} />);
    fireEvent.click(screen.getByText("A"));
    expect(onDecide).not.toHaveBeenCalled();
  });

  it("error and meta are shown", () => {
    render(<DecisionCard host error="Алдаа гарав" meta={<a href="#x">Яриаг нээх</a>} decisions={[ask]} />);
    expect(screen.getByText("Алдаа гарав")).toBeTruthy();
    expect(screen.getByText("Яриаг нээх")).toBeTruthy();
  });

  it("close: switches the field to a reason, Enter calls onClose; cancel returns", () => {
    const onClose = vi.fn();
    const onDecide = vi.fn();
    render(<DecisionCard host decisions={[ask]} onDecide={onDecide} onClose={onClose} labels={{ close: "Хаах", closeReason: "Яагаад?", cancel: "Болих" }} />);
    fireEvent.click(screen.getByText("Хаах"));
    const field = screen.getByPlaceholderText("Яагаад?");
    fireEvent.change(field, { target: { value: "хэрэггүй" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onClose).toHaveBeenCalledWith("a", "хэрэггүй");
    expect(onDecide).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Болих"));
    expect(screen.queryByPlaceholderText("Яагаад?")).toBeNull();
  });

  it("close with an empty reason: the confirm button closes", () => {
    const onClose = vi.fn();
    render(<DecisionCard host decisions={[ask]} onClose={onClose} labels={{ close: "Хаах", confirmClose: "Хаахыг батлах" }} />);
    fireEvent.click(screen.getByText("Хаах"));
    fireEvent.click(screen.getByText("Хаахыг батлах"));
    expect(onClose).toHaveBeenCalledWith("a", "");
  });
});
