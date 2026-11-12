// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { ProjectReport } from "./library/project-report";
import { PrDeployStatus } from "./library/pr-deploy-status";
import { DecisionInboxChat } from "./library/decision-inbox-chat";
import { renderChatHtml } from "./chat/export";
import { chatRuntime } from "./chat/runtime";
import { chatWidgets } from "./chat/widgets";
import { catalog } from "./registry";

const mockMedia = (reduce: boolean, dark = false) =>
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: (reduce && q.includes("reduce")) || (dark && q.includes("dark")),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });

beforeEach(() => mockMedia(true));
afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  delete (window as { sendPrompt?: unknown }).sendPrompt;
});

/** Mounts an exported fragment and runs its runtime, as a chat host would. */
async function mountExport(slug: string, props?: Record<string, unknown>) {
  const html = await renderChatHtml(slug, props, { fragment: true });
  document.body.innerHTML = html;
  chatRuntime();
  return html;
}

describe("Chat widgets category", () => {
  it("lists every chat widget in the catalog under Chat widgets", () => {
    const inCategory = catalog.filter((x) => x.category === "Chat widgets").map((x) => x.slug).sort();
    expect(inCategory).toEqual(chatWidgets.map((w) => w.slug).sort());
    expect(inCategory).toContain("session-board");
  });

  for (const w of chatWidgets) {
    it(`${w.slug} exports one-file HTML with its data and runtime`, async () => {
      const html = await renderChatHtml(w.slug);
      expect(html.startsWith("<!doctype html>")).toBe(true);
      expect(html).toContain(`data-cw-root="${w.slug}"`);
      expect(html).toContain(`data-cw-props="${w.slug}"`);
      expect(html).toContain("prefers-reduced-motion");
      expect(html).toContain("__cwRuntime");
      expect(html).not.toMatch(/<script[^>]+src=/);
      const { demo } = await w.load();
      const json = html.match(/<script type="application\/json"[^>]*>(.*?)<\/script>/s)![1];
      expect(JSON.parse(json)).toEqual(JSON.parse(JSON.stringify(demo)));
    });
  }

  it("pins the theme when asked and follows the system otherwise", async () => {
    mockMedia(true, true);
    await mountExport("decision-inbox-chat");
    expect(document.querySelector("[data-cw-root]")!.parentElement!.classList.contains("dark")).toBe(true);
    document.body.innerHTML = await renderChatHtml("decision-inbox-chat", undefined, { fragment: true, theme: "light" });
    chatRuntime();
    expect(document.querySelector("[data-cw-root]")!.parentElement!.classList.contains("dark")).toBe(false);
  });

  it("escapes data so it cannot close the JSON script", async () => {
    const html = await renderChatHtml("decision-inbox-chat", {
      title: "</script><b>x</b>",
      decisions: [],
    });
    expect(html).not.toContain("</script><b>");
  });
});

describe("ProjectReport", () => {
  it("renders final KPI numbers in static markup", async () => {
    const html = await renderChatHtml("project-report", undefined, { fragment: true });
    expect(html).toMatch(/data-cw-count="34"[^>]*>34</);
  });

  it("switches between status and cards views", () => {
    const onViewChange = vi.fn();
    render(<ProjectReport onViewChange={onViewChange} />);
    const cards = screen.getByRole("radio", { name: "Cards" });
    const status = document.querySelector('[data-cw-view-panel="status"]') as HTMLElement;
    const grid = document.querySelector('[data-cw-view-panel="cards"]') as HTMLElement;
    expect(status.hidden).toBe(false);
    expect(grid.hidden).toBe(true);
    fireEvent.click(cards);
    expect(onViewChange).toHaveBeenCalledWith("cards");
    expect(status.hidden).toBe(true);
    expect(grid.hidden).toBe(false);
  });

  it("reports waiting actions and shows an empty state", () => {
    const onWaitingAction = vi.fn();
    const { unmount } = render(<ProjectReport onWaitingAction={onWaitingAction} />);
    const wait = screen.getByRole("region", { name: /Waiting on you/ });
    fireEvent.click(within(wait).getByRole("button", { name: "Approve" }));
    expect(onWaitingAction).toHaveBeenCalledWith(expect.objectContaining({ id: "promote" }));
    unmount();
    render(<ProjectReport waiting={[]} />);
    expect(screen.getByText("Nothing waits on you right now.")).toBeTruthy();
  });

  it("clamps progress and exposes it as a progressbar", () => {
    render(<ProjectReport progress={{ value: 140 }} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
  });

  it("view switch and actions work in the static export", async () => {
    const sendPrompt = vi.fn();
    (window as { sendPrompt?: unknown }).sendPrompt = sendPrompt;
    await mountExport("project-report");
    fireEvent.click(document.querySelector('[data-cw-view-btn="cards"]')!);
    expect((document.querySelector('[data-cw-view-panel="cards"]') as HTMLElement).hidden).toBe(false);
    expect((document.querySelector('[data-cw-view-panel="status"]') as HTMLElement).hidden).toBe(true);
    expect(document.querySelector('[data-cw-view-btn="cards"]')!.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Review" }));
    expect(sendPrompt).toHaveBeenCalledWith("Review: Approve the landing copy");
  });
});

describe("PrDeployStatus", () => {
  it("shows PR checks, deploy steps and the blocker", () => {
    const onBlockerAction = vi.fn();
    render(<PrDeployStatus onBlockerAction={onBlockerAction} />);
    expect(screen.getByText("Changes requested")).toBeTruthy();
    expect(screen.getByText(/10 passed, 1 failed, 1 running/)).toBeTruthy();
    const prod = screen.getByRole("article", { name: "Production: Stuck" });
    expect(within(prod).getByText("Build waits on a missing setting")).toBeTruthy();
    fireEvent.click(within(prod).getByRole("button", { name: "Add the setting" }));
    expect(onBlockerAction).toHaveBeenCalledWith(expect.objectContaining({ id: "production" }));
  });

  it("folds the log open in React and in the static export", async () => {
    render(<PrDeployStatus />);
    const btn = screen.getByRole("button", { name: "Show log" });
    const log = document.getElementById(btn.getAttribute("aria-controls")!)!;
    expect(log.hidden).toBe(true);
    fireEvent.click(btn);
    expect(log.hidden).toBe(false);
    expect(btn.textContent).toContain("Hide log");
    cleanup();
    await mountExport("pr-deploy-status");
    const sbtn = screen.getByRole("button", { name: "Show log" });
    const slog = document.getElementById(sbtn.getAttribute("aria-controls")!)!;
    fireEvent.click(sbtn);
    expect(slog.hidden).toBe(false);
    expect(sbtn.getAttribute("aria-expanded")).toBe("true");
    expect(sbtn.textContent).toContain("Hide log");
  });

  it("renders empty states", () => {
    render(<PrDeployStatus prs={[]} deploys={[]} />);
    expect(screen.getByText("No open pull requests")).toBeTruthy();
    expect(screen.getByText("No deploys yet")).toBeTruthy();
  });
});

describe("DecisionInboxChat", () => {
  it("chooses, counts down and undoes", () => {
    const onDecide = vi.fn();
    render(<DecisionInboxChat onDecide={onDecide} />);
    expect(document.querySelector("[data-cw-left-n]")!.textContent).toBe("3");
    fireEvent.click(screen.getByRole("button", { name: /Snowy doorstep/ }));
    expect(onDecide).toHaveBeenCalledWith(expect.objectContaining({ id: "hero" }), expect.objectContaining({ id: "doorstep" }));
    expect(document.querySelector("[data-cw-left-n]")!.textContent).toBe("2");
    expect(screen.getByText("Snowy doorstep", { selector: "strong" })).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Undo" })[0]);
    expect(onDecide).toHaveBeenLastCalledWith(expect.objectContaining({ id: "hero" }), null);
    expect(document.querySelector("[data-cw-left-n]")!.textContent).toBe("3");
  });

  it("shows the all-done line when nothing is open", () => {
    render(<DecisionInboxChat decisions={[{ id: "a", title: "A?", options: [{ id: "y", label: "Yes" }] }]} chosen={{ a: "y" }} />);
    expect((document.querySelector("[data-cw-all-done]") as HTMLElement).hidden).toBe(false);
  });

  it("chooses in the static export and sends the answer to the chat", async () => {
    const sendPrompt = vi.fn();
    (window as { sendPrompt?: unknown }).sendPrompt = sendPrompt;
    await mountExport("decision-inbox-chat");
    fireEvent.click(screen.getByRole("button", { name: /Weekly/ }));
    expect(sendPrompt).toHaveBeenCalledWith("Darkhan deliveries: weekly or every two weeks? → Weekly");
    const item = screen.getByText("Weekly", { selector: "strong" }).closest("[data-cw-item]")!;
    expect(item.hasAttribute("data-chosen")).toBe(true);
    expect(item.querySelector("[data-cw-chosen-text]")!.textContent).toBe("Weekly");
    expect(document.querySelector("[data-cw-left-n]")!.textContent).toBe("2");
    fireEvent.click(within(item as HTMLElement).getByRole("button", { name: "Undo" }));
    expect(document.querySelector("[data-cw-left-n]")!.textContent).toBe("3");
  });
});

describe("Session Board in chat", () => {
  it("exports one view and folds groups without React", async () => {
    await mountExport("session-board");
    expect(document.querySelector('[role="radiogroup"]')).toBeNull();
    const head = screen.getByRole("button", { name: /^Projects/ });
    const section = head.closest("section")!;
    fireEvent.click(head);
    expect(head.getAttribute("aria-expanded")).toBe("false");
    expect(section.classList.contains("is-collapsed")).toBe(true);
    expect(document.getElementById(head.getAttribute("aria-controls")!)!.hasAttribute("inert")).toBe(true);
  });
});

describe("review fixes", () => {
  it("counts a stale chosen id as still open", () => {
    render(<DecisionInboxChat decisions={[{ id: "a", title: "A?", options: [{ id: "y", label: "Yes" }] }]} chosen={{ a: "gone" }} />);
    expect(document.querySelector("[data-cw-left-n]")!.textContent).toBe("1");
  });

  it("moves the static view switch with arrow keys", async () => {
    await mountExport("project-report");
    const status = document.querySelector('[data-cw-view-btn="status"]') as HTMLElement;
    fireEvent.keyDown(status, { key: "ArrowRight" });
    expect((document.querySelector('[data-cw-view-panel="cards"]') as HTMLElement).hidden).toBe(false);
  });

  it("hides Session Board row-fold chevrons in the static export", async () => {
    const html = await renderChatHtml("session-board", undefined, { fragment: true });
    expect(html).toContain(".sb-fold{visibility:hidden");
  });
});

describe("owner, sharing and the Mine view", () => {
  it("every widget has a schema that covers its demo props", async () => {
    const { chatWidgetSchemas } = await import("./chat/schema");
    for (const w of chatWidgets) {
      const schema = chatWidgetSchemas.find((s) => s.slug === w.slug);
      expect(schema, w.slug).toBeTruthy();
      const { demo } = await w.load();
      for (const key of Object.keys(demo)) expect(Object.keys(schema!.props), `${w.slug}.${key}`).toContain(key);
    }
  });

  it("Project Report keeps only owned or shared items under Mine", () => {
    render(
      <ProjectReport
        me="Anu"
        phases={[
          { id: "a", title: "Mine", status: "in-progress", owner: "Anu" },
          { id: "b", title: "Shared", status: "completed", owner: "Bat", sharedWith: ["Anu"] },
          { id: "c", title: "Theirs", status: "inbox", owner: "Bat" },
        ]}
      />,
    );
    const root = document.querySelector("[data-cw-root]")!;
    expect(root.getAttribute("data-scope")).toBe("all");
    fireEvent.click(screen.getByRole("button", { name: "Mine" }));
    expect(root.getAttribute("data-scope")).toBe("mine");
    const status = document.querySelector('[data-cw-view-panel="status"]')!;
    const others = Array.from(status.querySelectorAll("[data-cw-other]")).map((li) => li.textContent);
    expect(others).toHaveLength(1);
    expect(others[0]).toContain("Theirs");
    // vault statuses map onto phase states
    expect(status.querySelector(".is-active")!.textContent).toContain("Mine");
    expect(status.querySelector(".is-done")!.textContent).toContain("Shared");
    expect(status.querySelector(".is-next")!.textContent).toContain("Theirs");
  });

  it("hides the switch without a viewer", () => {
    render(<ProjectReport phases={[{ id: "a", title: "A", state: "next" }]} />);
    expect(screen.queryByRole("button", { name: "Mine" })).toBeNull();
  });

  for (const slug of ["project-report", "pr-deploy-status", "decision-inbox-chat", "session-board"]) {
    it(`${slug} switches to Mine in the static export`, async () => {
      await mountExport(slug);
      const root = document.querySelector("[data-cw-root]")!;
      expect(root.querySelectorAll("[data-cw-other]").length).toBeGreaterThan(0);
      fireEvent.click(root.querySelector('[data-cw-scope-btn="mine"]')!);
      expect(root.getAttribute("data-scope")).toBe("mine");
      expect(root.querySelector('[data-cw-scope-btn="mine"]')!.getAttribute("aria-pressed")).toBe("true");
    });
  }

  it("Session Board takes vault statuses and shows the owner", async () => {
    const { SessionBoard } = await import("./library/session-board");
    render(<SessionBoard me="Anu" sessions={[{ id: "x", title: "Vault task", status: "waiting-on", group: "projects", owner: "Anu", sharedWith: ["Bat"] }]} />);
    const row = screen.getByRole("button", { name: /Vault task/ });
    expect(row.closest(".sb-row")!.className).toContain("is-waiting");
    expect(row.textContent).toContain("Anu with Bat");
  });
});
