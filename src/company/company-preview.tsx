import * as React from "react";
import { ScenarioRegion, type ScenarioStep } from "../motion";
import { CompanyView, type CompanyLayout, type CompanyViewKey } from "./company-view";
import { companyFixtures } from "./fixtures";
import type { Company } from "./types";

/**
 * The catalog story (the board is a chat-detail component, so it carries ↺ / ⏸):
 * the stats count up on the model tab, the tab moves to the dashboard, and one
 * task walks through GTD — inbox → next action → in progress → waiting →
 * completed — so the task list's pill, colour and due state change in front of
 * you (website · t3 of the first fixture). Touching the board pauses the story.
 */
type Beat = { view: CompanyViewKey; status: string };
export const BOARD_STORY: ScenarioStep<Beat>[] = [
  { state: { view: "method", status: "inbox" }, hold: 1800 },
  { state: { view: "dashboard", status: "inbox" }, hold: 1400 },
  { state: { view: "dashboard", status: "next-action" }, hold: 1300 },
  { state: { view: "dashboard", status: "in-progress" }, hold: 1500 },
  { state: { view: "dashboard", status: "waiting" }, hold: 1400 },
  { state: { view: "dashboard", status: "completed" }, hold: 2200 },
];
const withTaskStatus = (c: Company, status: string): Company => ({
  ...c,
  projects: c.projects.map((p) => (p.id === "website" ? { ...p, tasks: p.tasks.map((t) => (t.id === "t3" ? { ...t, status } : t)) } : p)),
});

/** Catalog preview: pick a fixture company, then render it with a template. */
export function CompanyPreview({ template, companies = companyFixtures }: { template: CompanyLayout; companies?: Company[] }) {
  const [id, setId] = React.useState(companies[0]?.id);
  const found = companies.find((c) => c.id === id) ?? companies[0];
  if (!found) return null;
  return (
    <ScenarioRegion steps={BOARD_STORY} controls="hover" rest={3000} style={{ width: "100%" }}>
      {(beat, sc) => {
        // the user took over: the story pauses on what is on screen; their own tab clicks win
        // (CompanyView only follows `view` when it changes)
        const touch = () => !sc.paused && sc.playing && sc.togglePaused();
        const status = beat.status;
        const company = found.projects.some((p) => p.id === "website") ? withTaskStatus(found, status) : found;
        return (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }} onPointerDownCapture={touch} onKeyDownCapture={touch}>
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
                    background: c.id === company.id ? "var(--ts-selected-bg, #0a7acb)" : "transparent",
                    color: c.id === company.id ? "var(--ts-on-selected, #fff)" : "inherit",
                    font: "500 13px Inter, system-ui, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <CompanyView key={company.id} company={company} defaultLayout={template} view={beat.view} />
          </div>
        );
      }}
    </ScenarioRegion>
  );
}
