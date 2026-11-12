// Module entry: the site's NavBar (src/ui/site.tsx) on cream and dark. The
// preview's story opens each menu in turn and moves «you are here».
import { NavBar, Wordmark, type NavBarProps } from "../ui/site";
import { Button } from "../ui/primitives";
import { ScenarioRegion, type ScenarioStep } from "../motion";
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

export default function Preview() {
  return (
    <ScenarioRegion steps={STORY} rest={2400} controls="always" showSteps style={{ width: "100%" }}>
      {(s, sc) => (
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
      )}
    </ScenarioRegion>
  );
}
