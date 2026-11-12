// Module entry: ScenarioChat (src/ui/scenario-chat.tsx) — a role's questions
// answered from the company's data with sources, on cream and dark.
import { ScenarioChat, type ScenarioChatProps } from "../ui/scenario-chat";
import { DEMO_SCENARIOS, TwoThemes } from "../ui/site-demo";

/** Questions → sources → steps → answer → who guards it, as a loop. */
export function ScenarioChatView(props: ScenarioChatProps) {
  return <ScenarioChat {...props} />;
}

export default function Preview() {
  return (
    <TwoThemes stack>
      {() => (
        <div style={{ padding: 16 }}>
          <ScenarioChatView scenarios={DEMO_SCENARIOS} labels={{ fiction: "Зохиомол жишээ" }} />
        </div>
      )}
    </TwoThemes>
  );
}
