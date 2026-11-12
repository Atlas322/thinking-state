// Module entry: Thinking State primitives on both themes (cream · dark).
// The tokens come from src/lib/tokens.css, inlined for the preview only.
import * as React from "react";
import tokensCss from "../lib/tokens.css?inline";
import { Badge, Button, Card, Pill, SplitCTA, Tabs, Text } from "../ui/primitives";
import { Stack } from "../layout/stack";

/** The primitives on one surface — what a page assembles from. */
export function TsPrimitives({ theme = "cream" }: { theme?: "cream" | "dark" }) {
  const [tab, setTab] = React.useState<"search" | "flow" | "proof">("search");
  const [view, setView] = React.useState<"table" | "board" | "calendar">("table");
  const [chips, setChips] = React.useState<string[]>(["Төсөл"]);
  const toggle = (c: string) => setChips((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]));
  return (
    <div data-ts-theme={theme} data-theme={theme === "dark" ? "dark" : "light"} className="tsp-panel">
      <Stack gap="stack-lg">
        <Stack gap="stack-sm">
          <Text variant="label">[01] Үсэг</Text>
          <Text variant="display">Цэгүүдийг холбо.</Text>
          <Text variant="h2">Мэдээллээс үйлдэл рүү</Text>
          <Text variant="h3">Гурван шат</Text>
          <Text variant="body-lg" tone="muted">
            Баримтын хайлт, агентын урсгал, нотолгооны шат — системийн ард юу болдгийг шат шатаар нь харуулна.
          </Text>
          <Text variant="small" tone="faint">
            Шинэчлэгдсэн 2026-11-12 · эх сурвалж: vault
          </Text>
        </Stack>

        <Stack gap="stack-sm">
          <Text variant="label">[02] Товч</Text>
          <Stack direction="row" gap="stack-sm" wrap align="center">
            <Button>Эхлэх</Button>
            <Button variant="secondary" icon="calendar">Уулзалт товлох</Button>
            <Button variant="ghost" iconEnd="arrow-right">Дэлгэрэнгүй</Button>
            <Button size="sm" variant="secondary">Жижиг</Button>
          </Stack>
          <Stack direction="row" gap="stack-sm" wrap>
            <SplitCTA href="#contact">Холбогдох</SplitCTA>
            <SplitCTA href="#more" variant="ghost">Кейс үзэх</SplitCTA>
          </Stack>
        </Stack>

        <Stack gap="control">
          <Text variant="label">[03] Tab ба сегмент</Text>
          <Tabs
            label="Арга зүй"
            value={tab}
            onChange={setTab}
            items={[
              { value: "search", label: "Баримтын хайлт", icon: "search-x" },
              { value: "flow", label: "Агентын урсгал", icon: "workflow" },
              { value: "proof", label: "Нотолгооны шат", icon: "layers", count: 3 },
            ]}
          />
          <Text variant="body" tone="muted">
            Табын доор хамгийн багадаа 16px (--ts-gap-control) — эцгийн Stack өгнө.
          </Text>
          <Tabs
            variant="segmented"
            label="Харагдац"
            value={view}
            onChange={setView}
            items={[
              { value: "table", label: "Хүснэгт", icon: "table" },
              { value: "board", label: "Самбар", icon: "kanban" },
              { value: "calendar", label: "Хуанли", icon: "calendar" },
            ]}
          />
        </Stack>

        <Stack gap="stack-sm">
          <Text variant="label">[04] Chip ба badge</Text>
          <Stack direction="row" gap="stack-sm" wrap>
            {["Төсөл", "Task", "Шийдвэр", "Атом"].map((c, i) => (
              <Pill key={c} selected={chips.includes(c)} count={[4, 11, 3, 5][i]} onClick={() => toggle(c)}>
                {c}
              </Pill>
            ))}
          </Stack>
          <Stack direction="row" gap="stack-sm" wrap>
            <Badge tone="cat-1">Арга зүй</Badge>
            <Badge tone="cat-2">Технологи</Badge>
            <Badge tone="cat-3">Бизнес</Badge>
            <Badge tone="cat-4">Бүтээгдэхүүн</Badge>
            <Badge tone="green" icon="check">Дууссан</Badge>
            <Badge tone="amber">Хүлээгдэж буй</Badge>
            <Badge>Ноорог</Badge>
          </Stack>
        </Stack>

        <Stack gap="stack-sm">
          <Text variant="label">[05] Карт</Text>
          <div className="tsp-cards">
            <Card>
              <Stack gap="stack-sm">
                <Text variant="h3">Энгийн карт</Text>
                <Text variant="small" tone="muted">surface · 1px line · 12px булан</Text>
              </Stack>
            </Card>
            <Card interactive tabIndex={0}>
              <Stack gap="stack-sm">
                <Text variant="h3">Дарагддаг</Text>
                <Text variant="small" tone="muted">hover дээр 1px өргөгдөнө</Text>
              </Stack>
            </Card>
            <Card selected>
              <Stack gap="stack-sm">
                <Text variant="h3">Сонгосон</Text>
                <Text variant="small" tone="muted">#0C8CE9 хүрээ</Text>
              </Stack>
            </Card>
            <Card block>
              <Stack gap="stack-sm">
                <Text variant="h3">Блок</Text>
                <Text variant="small" tone="muted">булангүй (block layout)</Text>
              </Stack>
            </Card>
          </div>
        </Stack>
      </Stack>
    </div>
  );
}

export default function Preview() {
  return (
    <div className="tsp">
      <style>{tokensCss + CSS}</style>
      <TsPrimitives theme="cream" />
      <TsPrimitives theme="dark" />
    </div>
  );
}

const CSS = `
.tsp{width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:16px}
.tsp-panel{padding:24px;border-radius:14px;min-width:0}
.tsp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr));gap:12px}
`;
