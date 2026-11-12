// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AgentReply } from "./library/agent-reply";

// Host mode (Second Brain app, 2026-11-10): the chat already draws the avatar, the name and the time, parses the
// reply into its own sections (markdown bodies) and has its own output previews. The component supplies the look
// and the choice interaction; the host supplies the content.
describe("AgentReply in a host chat", () => {
  afterEach(cleanup);

  it("bare: no avatar and no header of its own", () => {
    const { container } = render(<AgentReply bare summary="Товч" />);
    expect(container.querySelector(".ar-av")).toBeNull();
    expect(container.querySelector(".ar-head")).toBeNull();
    expect(screen.getByText("Товч")).toBeTruthy();
  });

  it("summary takes block content (not wrapped in a paragraph)", () => {
    const { container } = render(<AgentReply bare summary={<p>блок</p>} />);
    expect(container.querySelector("p p")).toBeNull();
    expect(container.querySelector(".ar-sum")?.tagName).toBe("DIV");
  });

  it("sections: host-defined, in order, folded ones show a count and open on click", () => {
    const { container } = render(
      <AgentReply
        bare
        sections={[
          { kind: "findings", title: "Олдвор", tone: "blue", content: <span>нэг</span> },
          { kind: "sources", title: "Эх сурвалж", tone: "muted", count: 4, folded: true, content: <span>зам</span> },
        ]}
      />,
    );
    const heads = [...container.querySelectorAll(".ar-h")];
    expect(heads.map((h) => h.textContent)).toEqual(["Олдвор", "Эх сурвалж4"]);
    expect(container.querySelectorAll("[data-reply-section]")).toHaveLength(2);
    expect(container.querySelector("[data-reply-section=sources]")).toBeTruthy();
    expect(screen.getByText("нэг")).toBeTruthy();
    expect(screen.queryByText("зам")).toBeNull();
    fireEvent.click(heads[1]);
    expect(screen.getByText("зам")).toBeTruthy();
    expect(heads[1].textContent).toBe("Эх сурвалж");
  });

  it("children sit between the sections and the choices", () => {
    const { container } = render(
      <AgentReply bare sections={[{ title: "Санал", content: "а" }]} choices={["Тийм"]} onChoose={() => {}}>
        <div data-host-outputs />
      </AgentReply>,
    );
    const main = container.querySelector(".ar-main")!;
    const order = [...main.children].map((c) =>
      c.matches("[data-host-outputs]") ? "host" : c.matches(".ar-ch") ? "choices" : c.matches(".ar-sec") ? "section" : "?",
    );
    expect(order).toEqual(["section", "host", "choices"]);
  });

  it("answered label can depend on the choice; onChoose gets the choice", async () => {
    const onChoose = vi.fn(() => Promise.resolve());
    render(
      <AgentReply
        bare
        choices={["v4b-г сонгох", "Өөр"]}
        onChoose={onChoose}
        labels={{ answered: (c) => (c.startsWith("v4b") ? "бүртгэгдлээ." : "үргэлжлүүлнэ.") }}
      />,
    );
    fireEvent.click(screen.getByText("v4b-г сонгох"));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("бүртгэгдлээ."));
    expect(onChoose).toHaveBeenCalledWith("v4b-г сонгох");
    expect(screen.getByText("Өөр").hasAttribute("disabled")).toBe(true);
  });

  it("own answer is trimmed and sent", async () => {
    const onChoose = vi.fn(() => Promise.resolve());
    render(<AgentReply bare choices={["А"]} onChoose={onChoose} labels={{ own: "Өөрөөр" }} />);
    fireEvent.change(screen.getByPlaceholderText("Өөрөөр"), { target: { value: "  миний хариу " } });
    fireEvent.submit(screen.getByPlaceholderText("Өөрөөр").closest("form")!);
    await waitFor(() => expect(onChoose).toHaveBeenCalledWith("миний хариу"));
  });

  it("a failed send shows the error and keeps the buttons live", async () => {
    render(<AgentReply bare choices={["А"]} onChoose={() => Promise.reject(new Error("сүлжээ"))} />);
    fireEvent.click(screen.getByText("А"));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("сүлжээ"));
    expect(screen.getByText("А").hasAttribute("disabled")).toBe(false);
  });
});
