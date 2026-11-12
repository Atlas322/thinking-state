// Module entry: Thinking State primitives on both themes (cream · dark).
// The tokens come from src/lib/tokens.css, inlined for the preview only.
import * as React from "react";
import tokensCss from "../lib/tokens.css?inline";
import { Badge, Button, Card, IconTile, Pill, SplitCTA, STATUSES, Tabs, Text } from "../ui/primitives";
import { Stack } from "../layout/stack";
import type { IconName } from "../company/icons";
import { ScenarioRegion, type ScenarioStep } from "../motion";

/** The primitives on one surface — what a page assembles from. */
type Demo = { tab: "search" | "flow" | "proof"; view: "table" | "board" | "calendar"; chips: string[]; status: (typeof STATUSES)[number] };
/** The preview's story: the user moves through the system — tab, view, filters — while an agent's status changes. */
export const PRIMITIVES_SCENARIO: ScenarioStep<Demo>[] = [
  { state: { tab: "search", view: "table", chips: ["Төсөл"], status: "idle" }, hold: 1400 },
  { state: { tab: "flow", view: "table", chips: ["Төсөл"], status: "running" }, hold: 1400 },
  { state: { tab: "flow", view: "board", chips: ["Төсөл", "Шийдвэр"], status: "running" }, hold: 1400 },
  { state: { tab: "proof", view: "board", chips: ["Шийдвэр"], status: "needs-you" }, hold: 1600 },
  { state: { tab: "proof", view: "calendar", chips: ["Шийдвэр", "Атом"], status: "done" }, hold: 1800 },
];

export function TsPrimitives({
  theme = "cream",
  demo,
  onTouch,
}: {
  theme?: "cream" | "dark";
  /** drive the controls from a scenario step (catalog) */
  demo?: Demo;
  /** the user took over a control — the host pauses the story */
  onTouch?: () => void;
}) {
  const [tab, setTabOwn] = React.useState<Demo["tab"]>("search");
  const [view, setViewOwn] = React.useState<Demo["view"]>("table");
  const [chipsOwn, setChips] = React.useState<string[]>(["Төсөл"]);
  // A scenario step wins until the user touches a control (the host then pauses and clears `demo`).
  const [touched, setTouchedOwn] = React.useState(false);
  const setTouched = (t: boolean) => {
    // take over from where the story is, so nothing jumps
    if (t && demo && !touched) (setTabOwn(demo.tab), setViewOwn(demo.view), setChips(demo.chips));
    setTouchedOwn(t);
    if (t) onTouch?.();
  };
  React.useEffect(() => {
    if (demo) setTouchedOwn(false);
  }, [demo]);
  const live = demo && !touched ? demo : undefined;
  const setTab = (v: Demo["tab"]) => (setTouched(true), setTabOwn(v));
  const setView = (v: Demo["view"]) => (setTouched(true), setViewOwn(v));
  const chips = live?.chips ?? chipsOwn;
  const status = live?.status ?? "running";
  const toggle = (c: string) => (setTouched(true), setChips((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c])));
  return (
    <div data-ts-theme={theme} data-theme={theme === "dark" ? "dark" : "light"} className="tsp-panel">
      <Stack gap="stack-lg">
        <Stack gap="stack-sm">
          <Text variant="label">[00] Палитр</Text>
          <div className="tsp-swatches">
            {NEUTRALS.map(([v, n]) => (
              <div key={v} className="tsp-sw">
                <span style={{ background: `var(${v})` }} />
                <Text variant="caption">{n}</Text>
              </div>
            ))}
          </div>
          <Stack direction="row" gap="stack-sm" wrap align="center">
            <Text variant="caption">Агент:</Text>
            <Badge key={status} tone={status} className="ts-enter">
              {STATUS_MN[status]}
            </Badge>
          </Stack>
          <Stack direction="row" gap="stack-sm" wrap>
            {STATUSES.map((st) => (
              <Badge key={st} tone={st}>
                {STATUS_MN[st]}
              </Badge>
            ))}
          </Stack>
          <Stack direction="row" gap="stack-sm" wrap align="center">
            {/* tiles come in one by one (~120 ms apart, spring); the agent's tile follows its status */}
            {TILES.map(([icon, tone, label, size], i) => (
              <span key={i} className="ts-enter" style={{ display: "inline-flex", animationDelay: `${i * 120}ms` }}>
                <IconTile icon={icon} tone={tone} label={label} size={size} />
              </span>
            ))}
            <span key={status} className="ts-enter" style={{ display: "inline-flex" }}>
              <IconTile icon={STATUS_ICON[status]} tone={status} label={STATUS_MN[status]} />
            </span>
          </Stack>
        </Stack>

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
          <Text variant="label">[03] Таб ба сегмент</Text>
          <Tabs
            label="Арга зүй"
            value={live?.tab ?? tab}
            onChange={setTab}
            items={[
              { value: "search", label: "Баримтын хайлт", icon: "search-x" },
              { value: "flow", label: "Агентын урсгал", icon: "workflow" },
              { value: "proof", label: "Нотолгооны шат", icon: "layers", count: 3 },
            ]}
          />
          <Text variant="body" tone="muted">
            Табын доор хамгийн багадаа 16px (var(--ts-gap-control)), зайг эцэг {"<Stack>"} өгнө.
          </Text>
          <Tabs
            variant="segmented"
            label="Харагдац"
            value={live?.view ?? view}
            onChange={setView}
            items={[
              { value: "table", label: "Хүснэгт", icon: "table" },
              { value: "board", label: "Самбар", icon: "kanban" },
              { value: "calendar", label: "Хуанли", icon: "calendar" },
            ]}
          />
        </Stack>

        <Stack gap="stack-sm">
          <Text variant="label">[04] Чип ба тэмдэг</Text>
          <Stack direction="row" gap="stack-sm" wrap>
            {["Төсөл", "Даалгавар", "Шийдвэр", "Атом"].map((c, i) => (
              <Pill key={c} icon={CHIP_ICON[c]} selected={chips.includes(c)} count={[4, 11, 3, 5][i]} onClick={() => toggle(c)}>
                {c}
              </Pill>
            ))}
          </Stack>
          <Stack direction="row" gap="stack-sm" wrap>
            <Badge tone="cat-1" icon="layout-grid">Арга зүй</Badge>
            <Badge tone="cat-2" icon="bot">Технологи</Badge>
            <Badge tone="cat-3" icon="briefcase">Бизнес</Badge>
            <Badge tone="cat-4" icon="box">Бүтээгдэхүүн</Badge>
            <Badge tone="green" icon="check">Дууссан</Badge>
            <Badge tone="amber" icon="hourglass">Хүлээгдэж буй</Badge>
            <Badge icon="pencil">Ноорог</Badge>
          </Stack>
        </Stack>

        <Stack gap="stack-sm">
          <Text variant="label">[05] Карт</Text>
          <div className="tsp-cards">
            <Card>
              <Stack gap="stack-sm">
                <Text variant="h3">Энгийн карт</Text>
                <Text variant="small" tone="muted">гадаргуу · 1px зураас · 12px булан</Text>
              </Stack>
            </Card>
            <Card interactive tabIndex={0}>
              <Stack gap="stack-sm">
                <Text variant="h3">Дарагддаг</Text>
                <Text variant="small" tone="muted">хулганаар заахад 1px өргөгдөнө</Text>
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
                <Text variant="small" tone="muted">булангүй (блок байрлал)</Text>
              </Stack>
            </Card>
          </div>
        </Stack>
      </Stack>
    </div>
  );
}

type Tile = [IconName, React.ComponentProps<typeof IconTile>["tone"], string | undefined, React.ComponentProps<typeof IconTile>["size"]];
const TILES: Tile[] = [
  ["layout-grid", "cat-1", "Арга зүй", undefined],
  ["bot", "cat-2", "Технологи", undefined],
  ["briefcase", "cat-3", "Бизнес", undefined],
  ["box", "cat-4", "Бүтээгдэхүүн", undefined],
  ["folder", "folder", "Төсөл", undefined],
  ["arrow-up-right", "accent", undefined, undefined],
  ["folder", "folder", undefined, "S"],
  ["folder", "folder", undefined, "M"],
  ["folder", "folder", undefined, "L"],
  ["layout-grid", "electric", undefined, "S"],
  ["layout-grid", "electric", undefined, "M"],
  ["layout-grid", "electric", undefined, "L"],
];
const STATUS_ICON: Record<(typeof STATUSES)[number], IconName> = { idle: "hourglass", running: "play", "needs-you": "triangle-alert", error: "x", done: "check" };

/** Vault types → the system icon map (src/company/icons TYPE_ICON). */
const CHIP_ICON: Record<string, IconName> = { Төсөл: "folder", Даалгавар: "circle-check", Шийдвэр: "git-branch", Атом: "atom" };

const NEUTRALS: [string, string][] = [
  ["--ts-side", "Хажуу"],
  ["--ts-page", "Хуудас"],
  ["--ts-surface", "Гадаргуу"],
  ["--ts-raised", "Өргөгдсөн"],
  ["--ts-line", "Зураас"],
  ["--ts-faint", "Цайвар"],
  ["--ts-muted", "Бүдэг"],
  ["--ts-fg", "Текст"],
  ["--ts-accent-strong", "Үндсэн"],
  ["--ts-electric", "Цахилгаан"],
  ["--ts-selected", "Сонгосон"],
  ["--ts-folder", "Хавтас"],
];
const STATUS_MN: Record<(typeof STATUSES)[number], string> = {
  running: "Ажиллаж байна",
  "needs-you": "Таны ээлж",
  error: "Алдаа",
  done: "Дууссан",
  idle: "Хүлээгдэж буй",
};

export default function Preview() {
  return (
    <div className="tsp">
      <style>{tokensCss + CSS}</style>
      <ScenarioRegion steps={PRIMITIVES_SCENARIO} rest={2400} controls="always" showSteps className="tsp-both">
        {(step, sc) => {
          // Touching a control pauses the story (▶ or ↺ hands it back); paused = no demo.
          const demo = sc.paused ? undefined : step;
          const touch = () => !sc.paused && sc.togglePaused();
          return (
            <>
              <TsPrimitives theme="cream" demo={demo} onTouch={touch} />
              <TsPrimitives theme="dark" demo={demo} onTouch={touch} />
            </>
          );
        }}
      </ScenarioRegion>
    </div>
  );
}

const CSS = `
.tsp{width:100%}
.tsp-both{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:16px;padding-bottom:24px}
.tsp-panel{padding:24px;border-radius:14px;min-width:0}
.tsp-swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:8px}
.tsp-sw{display:flex;flex-direction:column;gap:4px}
.tsp-sw > span:first-child{height:36px;border-radius:6px;box-shadow:inset 0 0 0 1px var(--ts-line)}
.tsp-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,170px),1fr));gap:12px}
`;
