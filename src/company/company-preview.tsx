import * as React from "react";
import { CompanyView, type CompanyLayout } from "./company-view";
import { companyFixtures } from "./fixtures";
import type { Company } from "./types";

/**
 * The catalog story: one task walks through GTD — inbox → next action → in
 * progress → waiting → completed — so the task list's pill, colour and due
 * state change in front of you (website · t3 of the first fixture).
 */
const GTD_STORY: { state: string; hold: number }[] = [
  { state: "inbox", hold: 1600 },
  { state: "next-action", hold: 1600 },
  { state: "in-progress", hold: 2000 },
  { state: "waiting", hold: 1800 },
  { state: "completed", hold: 2600 },
];
const withTaskStatus = (c: Company, status: string): Company => ({
  ...c,
  projects: c.projects.map((p) => (p.id === "website" ? { ...p, tasks: p.tasks.map((t) => (t.id === "t3" ? { ...t, status } : t)) } : p)),
});

/** The scenario-loop rules without the motion module (company modules stay self-contained):
 *  3 cycles then rest on the last state; reduced motion shows the last state. */
function useStory<S>(steps: { state: S; hold: number }[], loops = 3) {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [i, setI] = React.useState(reduced ? steps.length - 1 : 0);
  const cycle = React.useRef(0);
  React.useEffect(() => {
    if (reduced) return;
    const last = steps.length - 1;
    if (i === last && cycle.current >= loops - 1) return;
    const t = window.setTimeout(() => {
      if (i === last) cycle.current += 1;
      setI(i === last ? 0 : i + 1);
    }, steps[i].hold + (i === last ? 4000 : 0));
    return () => window.clearTimeout(t);
  }, [i, reduced, steps, loops]);
  return steps[i].state;
}

/** Catalog preview: pick a fixture company, then render it with a template. */
export function CompanyPreview({ template, companies = companyFixtures }: { template: CompanyLayout; companies?: Company[] }) {
  const [id, setId] = React.useState(companies[0]?.id);
  const found = companies.find((c) => c.id === id) ?? companies[0];
  const status = useStory(GTD_STORY);
  if (!found) return null;
  const company = found.projects.some((p) => p.id === "website") ? withTaskStatus(found, status) : found;
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
