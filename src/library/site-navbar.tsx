// Module entry: the site's NavBar (src/ui/site.tsx) on cream and dark. The
// preview's story opens each menu in turn and moves «you are here», then
// settles within 5 s (a web block: no ↺ / ⏸).
import { NavBar, Wordmark, type NavBarProps } from "../ui/site";
import { Button } from "../ui/primitives";
import * as React from "react";
import { ScenarioRegion, type Scenario, type ScenarioStep } from "../motion";
import { DEMO_NAV, TwoThemes } from "../ui/site-demo";

/** The site header: links, mega menus, phone accordion, actions slot. */
export function SiteNavBar(props: NavBarProps) {
  return <NavBar {...props} />;
}

const STORY: ScenarioStep<{ open: string | null; current: string }>[] = [
  { state: { open: null, current: "#pricing" }, hold: 700 },
  { state: { open: "product", current: "#pricing" }, hold: 1300 },
  { state: { open: "product", current: "#answers" }, hold: 900 },
  { state: { open: "solutions", current: "#answers" }, hold: 1300 },
  { state: { open: null, current: "#team" }, hold: 600 },
];

/**
 * The visitor takes over: the first point, tap or focus stops the story and
 * the bar runs on its own state (hover intent, pin, Escape all live).
 */
function useTakeOver(sc: Scenario<unknown, HTMLElement>) {
  const latest = React.useRef(sc);
  latest.current = sc;
  const take = () => {
    if (!latest.current.paused && latest.current.playing) latest.current.togglePaused();
  };
  return { onPointerMove: take, onPointerDown: take, onFocus: take, onKeyDown: take };
}

function Bars({ s, sc }: { s: { open: string | null; current: string }; sc: Scenario<{ open: string | null; current: string }, HTMLElement> }) {
  const take = useTakeOver(sc as Scenario<unknown, HTMLElement>);
  return (
    <div {...take}>
      <TwoThemes stack>
        {(theme) => (
          <div style={{ minHeight: 380 }}>
            <SiteNavBar
              items={DEMO_NAV}
              current={s.current}
              openMenu={sc.playing && !sc.paused ? s.open : undefined}
              sticky={false}
              brand={<Wordmark href="#" />}
              inside={{ label: "Апп руу", href: "#app" }}
              actions={
                <Button size="sm" iconEnd="arrow-up-right" href="#contact">
                  Уулзалт товлох
                </Button>
              }
              labels={theme === "dark" ? { main: "Үндсэн цэс (бараан)" } : undefined}
            />
          </div>
        )}
      </TwoThemes>
    </div>
  );
}

export default function Preview() {
  return (
    <ScenarioRegion steps={STORY} style={{ width: "100%" }}>
      {(s, sc) => <Bars s={s} sc={sc} />}
    </ScenarioRegion>
  );
}
