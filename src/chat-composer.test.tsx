// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { ChatComposer } from "./library/chat-composer";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Chat Composer documented behavior", () => {
  it("selects a model with the keyboard and sends the documented callback shape", () => {
    const onSend = vi.fn(),
      onModelChange = vi.fn();
    render(<ChatComposer onSend={onSend} onModelChange={onModelChange} />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Загвар сонгох" }), {
      key: "ArrowDown",
    });
    const menu = screen.getByRole("listbox", { name: "Загвар сонгох" });
    fireEvent.keyDown(menu, { key: "End" });
    fireEvent.keyDown(menu, { key: "Enter" });
    expect(onModelChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: "chatgpt" }),
    );
    const field = screen.getByRole("textbox", { name: "Мессеж" });
    fireEvent.change(field, { target: { value: "Draft our launch update" } });
    fireEvent.keyDown(field, { key: "Enter", shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
    fireEvent.keyDown(field, { key: "Enter", isComposing: true });
    expect(onSend).not.toHaveBeenCalled();
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onSend).toHaveBeenCalledWith("Draft our launch update", {
      model: "chatgpt",
    });
    expect(field).toHaveProperty("value", "");
  });
  it("selects and leaves a folder and reports app connections", () => {
    const onFolderChange = vi.fn(),
      onAppsChange = vi.fn();
    render(
      <ChatComposer
        onFolderChange={onFolderChange}
        onAppsChange={onAppsChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Хавтас сонгох" }));
    fireEvent.click(screen.getByRole("option", { name: "Бүтээгдэхүүн" }));
    expect(onFolderChange).toHaveBeenLastCalledWith("Бүтээгдэхүүн");
    fireEvent.click(screen.getByRole("button", { name: "Хавтас сонгох" }));
    fireEvent.click(screen.getByRole("option", { name: "Бүтээгдэхүүн" }));
    expect(onFolderChange).toHaveBeenLastCalledWith(null);
    fireEvent.click(screen.getByRole("button", { name: "Апп холбох" }));
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /Багийн чат/ }));
    expect(onAppsChange).toHaveBeenLastCalledWith(["gmail", "slack"]);
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: /Имэйл/ }));
    expect(onAppsChange).toHaveBeenLastCalledWith(["slack"]);
    const menu = screen.getByRole("menu", { name: "Апп холбох" });
    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Апп холбох" }),
    );
  });
  it("keeps approval busy until both the callback and minimum duration finish", async () => {
    vi.useFakeTimers();
    let complete!: () => void;
    const onRequestApproval = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve;
        }),
    );
    render(<ChatComposer loadMs={300} onRequestApproval={onRequestApproval} />);
    fireEvent.click(screen.getByRole("button", { name: "Зөвшөөрөл хүсэх" }));
    expect(onRequestApproval).toHaveBeenCalledOnce();
    await act(async () => vi.advanceTimersByTime(500));
    expect(
      screen
        .getByRole("button", { name: "Зөвшөөрөл хүсэж байна…" })
        .getAttribute("aria-busy"),
    ).toBe("true");
    await act(async () => complete());
    expect(
      screen
        .getByRole("button", { name: "Хязгааргүй эрх" })
        .getAttribute("aria-busy"),
    ).toBe("false");
  });
  it("shows an approval error instead of granting access when the callback fails", async () => {
    const onRequestApproval = vi.fn(async () => {
      throw new Error("denied");
    });
    render(<ChatComposer onRequestApproval={onRequestApproval} />);
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: "Зөвшөөрөл хүсэх" })),
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "авч чадсангүй",
    );
    expect(
      screen.getByRole("button", { name: "Зөвшөөрөл хүсэх" }),
    ).toHaveProperty("disabled", false);
    expect(
      screen.queryByRole("button", { name: "Хязгааргүй эрх" }),
    ).toBeNull();
  });
  it("confirms simulated dictation and discards a second recording with Escape", () => {
    vi.useFakeTimers();
    render(<ChatComposer dictation="Hello from our team" />);
    fireEvent.click(screen.getByRole("button", { name: "Дуугаар оруулах" }));
    act(() => vi.advanceTimersByTime(780));
    fireEvent.click(screen.getByRole("button", { name: "Дуут бичвэрийг ашиглах" }));
    expect(screen.getByRole("textbox", { name: "Мессеж" })).toHaveProperty(
      "value",
      "Hello from our",
    );
    fireEvent.click(screen.getByRole("button", { name: "Дуугаар оруулах" }));
    act(() => vi.advanceTimersByTime(1040));
    fireEvent.keyDown(screen.getByRole("region", { name: "Мессеж бичих хэсэг" }), {
      key: "Escape",
    });
    expect(screen.getByRole("textbox", { name: "Мессеж" })).toHaveProperty(
      "value",
      "Hello from our",
    );
    expect(screen.queryByLabelText("Шууд бичвэр")).toBeNull();
  });
  it("uses custom attachment handling and omits empty folder/app lists", () => {
    const onAttach = vi.fn();
    render(<ChatComposer onAttach={onAttach} folders={[]} apps={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Файл хавсаргах" }));
    expect(onAttach).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "Хавтас сонгох" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Апп холбох" })).toBeNull();
  });
  it("cleans up the dictation and approval timers on unmount", async () => {
    vi.useFakeTimers({
      toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"],
    });
    const { unmount } = render(<ChatComposer />);
    fireEvent.click(screen.getByRole("button", { name: "Зөвшөөрөл хүсэх" }));
    fireEvent.click(screen.getByRole("button", { name: "Дуугаар оруулах" }));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    await act(async () => unmount());
    expect(vi.getTimerCount()).toBe(0);
  });
});
