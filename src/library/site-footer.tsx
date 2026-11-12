// Module entry: the site Footer (src/ui/site.tsx) on cream and dark. The
// preview's story walks «you are here» through the map.
import { Footer, type FooterProps } from "../ui/site";
import { Button } from "../ui/primitives";
import { ScenarioRegion, type ScenarioStep } from "../motion";
import { DEMO_FOOTER, TwoThemes } from "../ui/site-demo";

/** The site footer: brand, the whole map, source and date of the numbers. */
export function SiteFooter(props: FooterProps) {
  return <Footer {...props} />;
}

const STORY: ScenarioStep<string>[] = ["#brain", "#team", "#glossary", "#contact"].map((h) => ({ state: h, hold: 1300 }));

export default function Preview() {
  return (
    <ScenarioRegion steps={STORY} rest={2400} controls="always" showSteps style={{ width: "100%" }}>
      {(current) => (
        <TwoThemes stack>
          {() => (
            <SiteFooter
              columns={DEMO_FOOTER}
              current={current}
              tagline="Байгууллага тань санаж, ажилладаг тархитай болно."
              cta={
                <Button size="sm" iconEnd="arrow-up-right" href="#contact">
                  Уулзалт товлох
                </Button>
              }
              email="hello@example.mn"
              owner="© 2026 Жишээ ХХК · Улаанбаатар"
              source={{ label: "эх: vault", updated: "2026-11-12" }}
              legal={[
                { label: "Нууцлал", href: "#privacy" },
                { label: "Сайтын бүтэц", href: "#sitemap" },
              ]}
            />
          )}
        </TwoThemes>
      )}
    </ScenarioRegion>
  );
}
