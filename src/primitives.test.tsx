// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Badge, Button, Card, Pill, PRIMITIVES_CSS, SplitCTA, Tabs, Text } from "./ui/primitives";
import { motionCss } from "./motion";
import * as pkg from "./lib/index";

afterEach(cleanup);

describe("Button / SplitCTA", () => {
  it("renders a button or a link with its variant", () => {
    render(
      <>
        <Button variant="secondary" icon="check">Хадгалах</Button>
        <Button href="/start">Эхлэх</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Хадгалах" }).className).toContain("is-secondary");
    expect(screen.getByRole("link", { name: "Эхлэх" }).getAttribute("href")).toBe("/start");
  });

  it("SplitCTA keeps the arrow cell out of the accessible name", () => {
    render(<SplitCTA href="/contact">Холбогдох</SplitCTA>);
    const link = screen.getByRole("link", { name: "Холбогдох" });
    expect(link.querySelector(".ts-cta-arrow")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Pill", () => {
  it("is a toggle with aria-pressed when clickable, static otherwise", () => {
    const onClick = vi.fn();
    render(
      <>
        <Pill selected count={4} onClick={onClick}>Төсөл</Pill>
        <Pill>Шошго</Pill>
      </>,
    );
    const b = screen.getByRole("button", { name: /Төсөл/ });
    expect(b.getAttribute("aria-pressed")).toBe("true");
    expect(b.className).toContain("is-selected");
    fireEvent.click(b);
    expect(onClick).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Шошго" })).toBeNull();
  });
});

describe("Tabs", () => {
  function Demo({ variant }: { variant: "tabs" | "segmented" }) {
    const [v, setV] = React.useState<"a" | "b" | "c">("a");
    return (
      <Tabs
        label="Харагдац"
        variant={variant}
        value={v}
        onChange={setV}
        items={[
          { value: "a", label: "Хүснэгт" },
          { value: "b", label: "Самбар", disabled: true },
          { value: "c", label: "Хуанли", count: 3 },
        ]}
      />
    );
  }

  it("tabs: tablist with roving focus that skips disabled tabs", () => {
    render(<Demo variant="tabs" />);
    expect(screen.getByRole("tablist", { name: "Харагдац" })).toBeTruthy();
    const first = screen.getByRole("tab", { name: "Хүснэгт" });
    expect(first.getAttribute("aria-selected")).toBe("true");
    expect(first.tabIndex).toBe(0);
    fireEvent.keyDown(first, { key: "ArrowRight" });
    const third = screen.getByRole("tab", { name: /Хуанли/ });
    expect(third.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(third);
    fireEvent.keyDown(third, { key: "Home" });
    expect(screen.getByRole("tab", { name: "Хүснэгт" }).getAttribute("aria-selected")).toBe("true");
  });

  it("segmented: radiogroup with aria-checked", () => {
    render(<Demo variant="segmented" />);
    expect(screen.getByRole("radiogroup", { name: "Харагдац" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: /Хуанли/ }));
    expect(screen.getByRole("radio", { name: /Хуанли/ }).getAttribute("aria-checked")).toBe("true");
  });
});

describe("Badge / Card / Text", () => {
  it("renders the right element and classes", () => {
    const { container } = render(
      <>
        <Badge tone="cat-2">Технологи</Badge>
        <Card interactive selected>Карт</Card>
        <Text variant="h2">Гарчиг</Text>
        <Text variant="label">[03] ҮЙЛЧИЛГЭЭ</Text>
      </>,
    );
    expect(container.querySelector(".ts-badge.is-cat-2")?.textContent).toBe("Технологи");
    expect(container.querySelector(".ts-card.is-interactive.is-selected")).not.toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Гарчиг" })).toBeTruthy();
    expect(container.querySelector("span.ts-text.is-label")).not.toBeNull();
  });
});

describe("styles", () => {
  it("selected state is #0C8CE9 with white text, controls have no outer margin", () => {
    expect(PRIMITIVES_CSS).toContain(".ts-pill.is-selected,.ts-tab.is-selected{border-color:transparent;background:var(--ts-selected,#0c8ce9);color:var(--ts-on-selected,#fff)}");
    for (const cls of [".ts-btn{", ".ts-pill{", ".ts-tabs{", ".ts-tab{", ".ts-cta{"]) {
      const rule = PRIMITIVES_CSS.slice(PRIMITIVES_CSS.indexOf(cls), PRIMITIVES_CSS.indexOf("}", PRIMITIVES_CSS.indexOf(cls)));
      expect(rule, cls).not.toMatch(/(^|[;{])margin/);
    }
  });

  it("ts.css = site.css + primitives + motion, and is fresh (npm run tokens:site)", async () => {
    const fs = (await import(/* @vite-ignore */ "node:" + "fs")) as { readFileSync: (p: string, e: string) => string };
    const ts = fs.readFileSync("src/lib/ts.css", "utf8").replace(/\r\n/g, "\n");
    const site = fs.readFileSync("src/lib/site.css", "utf8").replace(/\r\n/g, "\n");
    expect(ts).toContain(site);
    expect(ts).toContain(PRIMITIVES_CSS.trim());
    expect(ts).toContain(motionCss().trim());
  });

  it("is exported from the package", () => {
    expect(pkg.Button).toBe(Button);
    expect(pkg.Tabs).toBe(Tabs);
  });
});

describe("review fixes", () => {
  it("keeps one tab tabbable when value matches no enabled item", () => {
    render(<Tabs label="x" value={"z" as "a" | "b" | "z"} onChange={() => {}} items={[{ value: "a", label: "A", disabled: true }, { value: "b", label: "B" }]} />);
    expect(screen.getByRole("tab", { name: "B" }).tabIndex).toBe(0);
    expect(screen.getByRole("tab", { name: "A" }).tabIndex).toBe(-1);
  });
});
