import * as React from "react";
import { CompanyView, type CompanyLayout } from "./company-view";
import { companyFixtures } from "./fixtures";
import type { Company } from "./types";

/** Catalog preview: pick a fixture company, then render it with a template. */
export function CompanyPreview({ template, companies = companyFixtures }: { template: CompanyLayout; companies?: Company[] }) {
  const [id, setId] = React.useState(companies[0]?.id);
  const company = companies.find((c) => c.id === id) ?? companies[0];
  if (!company) return null;
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="cv-picker" role="radiogroup" aria-label="Компани" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {companies.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={c.id === company.id}
            onClick={() => setId(c.id)}
            style={{
              height: 30,
              padding: "0 12px",
              borderRadius: 15,
              border: "1px solid var(--line, #ececef)",
              background: c.id === company.id ? "var(--fg, #18181b)" : "transparent",
              color: c.id === company.id ? "var(--page, #fff)" : "inherit",
              font: "500 13px Inter, system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>
      <CompanyView key={company.id} company={company} defaultLayout={template} />
    </div>
  );
}
