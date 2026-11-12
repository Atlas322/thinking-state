// Module entry: the Collection view lives in src/company/ and shares the
// company tokens, so this file is not a single-file copy.
import * as React from "react";
import { CollectionPanel } from "../company/company-view";
import { studio } from "../company/fixtures";
import { Icon, typeIcon, typeLabel } from "../company/icons";
import { ScenarioRegion } from "../motion";

export function CompanyCollection(props: React.ComponentProps<typeof CollectionPanel>) {
  return <CollectionPanel {...props} />;
}

export default function Preview() {
  const collections = studio.collections ?? [];
  // The story: the type filter steps through the first three collections and settles (no controls, < 5 s).
  const steps = collections.slice(0, 3).map((c, i, a) => ({ state: c.type, hold: i === a.length - 1 ? 1000 : 1500 }));
  return (
    <ScenarioRegion steps={steps} style={{ width: "100%" }}>
      {(storyType) => <CollectionStory collections={collections} storyType={storyType} />}
    </ScenarioRegion>
  );
}

function CollectionStory({ collections, storyType }: { collections: NonNullable<typeof studio.collections>; storyType: string | undefined }) {
  // the user's pick wins over the story from the first touch on
  const [own, setOwn] = React.useState<string | undefined>(undefined);
  const type = own ?? storyType;
  const setType = (t: string) => setOwn(t);
  const current = collections.find((c) => c.type === type) ?? collections[0];
  if (!current) return null;
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }} onPointerDownCapture={() => own ?? setOwn(type)}>
      <div role="radiogroup" aria-label="Төрөл" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {collections.map((c) => (
          <button
            key={c.type}
            type="button"
            role="radio"
            aria-checked={c.type === current.type}
            onClick={() => setType(c.type)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 30,
              padding: "0 11px",
              borderRadius: 15,
              border: "1px solid var(--line, #ececef)",
              background: c.type === current.type ? "var(--ts-selected-bg, #0a7acb)" : "transparent",
              color: c.type === current.type ? "var(--ts-on-selected, #fff)" : "inherit",
              font: "500 13px Inter, system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            <Icon name={typeIcon(c.type)} size={14} />
            {typeLabel(c.type)} · {c.items.length}
          </button>
        ))}
      </div>
      <CompanyCollection key={current.type} collection={current} />
    </div>
  );
}
