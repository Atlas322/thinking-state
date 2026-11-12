// Module entry: AgentConsent (src/ui/agent-consent.tsx) — an agent asks for a
// scoped, timed grant and a person decides, on cream and dark.
import { AgentConsent, type AgentConsentProps } from "../ui/agent-consent";
import { TwoThemes } from "../ui/site-demo";

/** Request → scope → waiting → decision → folded result, as a loop. */
export function AgentConsentCard(props: AgentConsentProps) {
  return <AgentConsent {...props} />;
}

export default function Preview() {
  return (
    <TwoThemes>
      {(theme) => (
        <div style={{ padding: 16 }}>
          <AgentConsentCard
            agent={{ name: "Санхүүгийн туслах" }}
            action="цалингийн бүртгэл унших"
            target="Цалингийн систем"
            risk="risky"
            reason="Сарын хаалтын тайланд хэлтсийн цалингийн нийлбэр хэрэгтэй."
            preview={[
              { label: "Хэлтсийн нийлбэр", meta: "11-р сар", icon: "table" },
              { label: "Хувь хүний цалин харагдахгүй", icon: "shield-check" },
            ]}
            duration={60}
            demo={theme === "cream" ? { allow: true, scope: "timed" } : { allow: false, scope: "once" }}
          />
        </div>
      )}
    </TwoThemes>
  );
}
