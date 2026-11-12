// Module entry: the renderer lives in src/company/ (contract, fixtures,
// views) and reuses the chat widgets, so this file is not a single-file copy.
import { CompanyView, type CompanyViewProps } from "../company/company-view";
import { studio } from "../company/fixtures";

/** CompanyView at preview density: a small, interactive board for a hero or a card. */
export function CompanyMini(props: Omit<CompanyViewProps, "density">) {
  return <CompanyView {...props} density="preview" />;
}

export default function Preview() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <CompanyMini company={studio} />
    </div>
  );
}
