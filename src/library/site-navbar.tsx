// Module entry: the site's NavBar (src/ui/site.tsx) on cream and dark. The
// preview's story opens each menu in turn and moves «you are here».
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
  { state: { open: null, current: "#pricing" }, hold: 1200 },
  { state: { open: "product", current: "#pricing" }, hold: 1800 },
  { state: { open: "product", current: "#answers" }, hold: 1200 },
  { state: { open: "solutions", current: "#answers" }, hold: 1800 },
  { state: { open: null, current: "#team" }, hold: 1400 },
];

/** Quiet time after the visitor's last move before the story takes the menu back. */
const IDLE_MS = 8000;

/**
 * The visitor takes over: the first point, tap or focus pauses the story and
 * the bar runs on its own state (hover intent, pin, Escape all live). After
 * IDLE_MS without input the story resumes — unless ⏸ was pressed by hand.
 */
function useTakeOver(sc: Scenario<unknown, HTMLElement>) {
  const took = React.useRef(false);
  const latest = React.useRef(sc);
  latest.current = sc; // the timeout must see the current pause state
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const arm = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (took.current && latest.current.paused) latest.current.togglePaused();
      took.current = false;
    }, IDLE_MS);
  };
  const take = () => {
    if (!latest.current.paused) {
      took.current = true;
      latest.current.togglePaused();
    }
    if (took.current) arm();
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
              openMenu={sc.paused ? undefined : s.open}
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
    <ScenarioRegion steps={STORY} rest={2400} controls="always" showSteps style={{ width: "100%" }}>
      {(s, sc) => <Bars s={s} sc={sc} />}
    </ScenarioRegion>
  );
}
