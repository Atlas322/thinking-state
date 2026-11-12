// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChatComposer } from "./library/chat-composer";
import { ModelPicker } from "./library/model-picker";

// Host mode (Second Brain app, 2026-11-13): the app owns the text, uploads, «@»/«[[» menus and the send path; the
// composer is the surface. The model picker sits in its toolbar with the app's models and effort ("" = role default).

describe("ChatComposer in a host app", () => {
  afterEach(cleanup);

  it("host: controlled text, no approval, voice, folders or apps", () => {
    const onValueChange = vi.fn();
    render(<ChatComposer host value="сайн" onValueChange={onValueChange} />);
    const field = screen.getByLabelText("Мессеж") as HTMLTextAreaElement;
    expect(field.value).toBe("сайн");
    fireEvent.change(field, { target: { value: "сайн уу" } });
    expect(onValueChange).toHaveBeenCalledWith("сайн уу", expect.any(Number));
    expect(screen.queryByText("Зөвшөөрөл хүсэх")).toBeNull();
    expect(screen.queryByLabelText("Дуугаар оруулах")).toBeNull();
    expect(screen.queryByLabelText("Хавтас сонгох")).toBeNull();
    expect(screen.queryByLabelText("Загвар сонгох")).toBeNull();
  });

  it("canSend lets files-only send; Enter sends and the host keeps its text", () => {
    const onSend = vi.fn();
    render(<ChatComposer host value="" canSend onSend={onSend} labels={{ send: "Илгээх" }} />);
    fireEvent.click(screen.getByLabelText("Илгээх"));
    expect(onSend).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByLabelText("Мессеж"), { key: "Enter" });
    expect(onSend).toHaveBeenCalledTimes(2);
  });

  it("host onKeyDown runs first; preventDefault skips the built-in send", () => {
    const onSend = vi.fn();
    render(<ChatComposer host value="x" onSend={onSend} textareaProps={{ onKeyDown: (e) => e.preventDefault() }} />);
    fireEvent.keyDown(screen.getByLabelText("Мессеж"), { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("busy and disabled block send; slots render; attach calls the host", () => {
    const onSend = vi.fn();
    const onAttach = vi.fn();
    const { rerender } = render(
      <ChatComposer host value="x" busy onSend={onSend} onAttach={onAttach} above={<b>чип</b>} tools={<i>хэрэгсэл</i>} />,
    );
    expect((screen.getByLabelText("Мессеж илгээх") as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("чип")).toBeTruthy();
    expect(screen.getByText("хэрэгсэл")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("Файл хавсаргах"));
    expect(onAttach).toHaveBeenCalled();
    rerender(<ChatComposer host value="x" disabled onSend={onSend} />);
    expect((screen.getByLabelText("Мессеж") as HTMLTextAreaElement).disabled).toBe(true);
  });

  it("textareaRef reaches the field; dragging marks the card", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    const { container } = render(<ChatComposer host value="" textareaRef={ref} dragging />);
    expect(ref.current?.tagName).toBe("TEXTAREA");
    expect(container.querySelector(".cc-card")?.hasAttribute("data-drag")).toBe(true);
  });

  it("without host it still shows the demo controls", () => {
    render(<ChatComposer />);
    expect(screen.getByText("Зөвшөөрөл хүсэх")).toBeTruthy();
    expect(screen.getByLabelText("Загвар сонгох")).toBeTruthy();
  });
});

describe("ModelPicker in a host app", () => {
  afterEach(cleanup);
  const models = [
    { id: "", name: "Анхдагч (Opus 5.5)" },
    { id: "claude-sonnet-5-5", name: "Sonnet 5.5" },
  ];

  it("host: only trigger and menu; picks a model", () => {
    const onChange = vi.fn();
    const { container } = render(<ModelPicker host models={models} value="" effort="" effortAuto="Анхдагч" onChange={onChange} />);
    expect(container.querySelector("textarea")).toBeNull();
    expect(screen.queryByLabelText("Илгээх")).toBeNull();
    expect(screen.queryByText("Вэб хайлт")).toBeNull();
    expect(screen.queryByRole("switch")).toBeNull();
    fireEvent.click(screen.getByRole("option", { name: /Sonnet 5.5/ }));
    expect(onChange).toHaveBeenCalledWith("claude-sonnet-5-5");
  });

  it("effortAuto adds a default choice; picking effort reports it", () => {
    const onEffortChange = vi.fn();
    render(<ModelPicker host models={models} value="" effort="" effortAuto="Анхдагч" onEffortChange={onEffortChange} />);
    const radios = screen.getAllByRole("radio");
    expect(radios.map((r) => r.textContent)).toEqual(["Анхдагч", "Бага", "Дунд", "Өндөр"]);
    expect(radios[0].getAttribute("aria-checked")).toBe("true");
    fireEvent.click(radios[3]);
    expect(onEffortChange).toHaveBeenCalledWith("high");
  });

  it("trigger shows the effort tag", () => {
    render(<ModelPicker host models={models} value="claude-sonnet-5-5" effort="low" />);
    expect(screen.getByRole("button", { name: /Sonnet 5.5, хүчин чармайлт: Бага/ })).toBeTruthy();
  });
});
