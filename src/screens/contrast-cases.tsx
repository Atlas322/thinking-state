// Contrast cases for the screens that are not in the catalog (2026-11-17): every screen in both
// themes, on a light and a dark host page, and AskWindow at every phase of its run. Served at
// /contrast.html; scripts/check-contrast.mjs scans each [data-contrast-case] after the catalog.
// The dark-page × light-window cases catch a light island picking up the page's dark colours
// (the collapsed «Бодсон 3 с» line, screens.8).
import * as React from "react";
import { createRoot } from "react-dom/client";
import "../lib/tokens.css";
import { MotionProvider } from "../motion";
import { AskWindow, askWindowDemo, type AskPhase } from "./ask-window";
import { BuildWizard } from "./build-wizard";
import { MethodQuiz, methodQuizDemo } from "./method-quiz";
import { buildRecipeDemo } from "./build-recipe-demo";
import { AppScreen, SCREENS } from "./app-screens";
import { FinanceReport } from "./finance-report";
import { acmeDemo } from "./acme";
import { RoleDashboard } from "../company/role-dashboard";
import { acmeGroup } from "../company/fixtures";

type Theme = "light" | "dark";
const PHASES: AskPhase[] = ["ask", "think", "sources", "answer", "done"];
const THEMES: Theme[] = ["light", "dark"];

function Host({ page, id, children }: { page: Theme; id: string; children: React.ReactNode }) {
  const dark = page === "dark";
  return (
    <section
      data-contrast-case={`page-${page} ${id}`}
      className={dark ? "dark" : undefined}
      data-theme={dark ? "dark" : "light"}
      data-ts-theme={dark ? "dark" : "cream"}
      style={{ padding: 24, background: "var(--ts-page)" }}
    >
      {children}
    </section>
  );
}

function Cases() {
  const today = new Date("2026-11-17T09:00:00");
  return (
    <MotionProvider paused>
      {THEMES.map((page) =>
        THEMES.map((win) => (
          <React.Fragment key={page + win}>
            {PHASES.map((ph) => (
              <Host key={ph} page={page} id={`ask-window ${win} ${ph}`}>
                <AskWindow {...askWindowDemo} theme={win} phase={ph} openSource={ph === "done" ? "m" : undefined} />
              </Host>
            ))}
            <Host page={page} id={`build-wizard ${win}`}><BuildWizard recipe={buildRecipeDemo} theme={win} /></Host>
            <Host page={page} id={`finance-report ${win}`}><FinanceReport theme={win} /></Host>
            <Host page={page} id={`method-quiz ${win}`}><MethodQuiz {...methodQuizDemo} theme={win} /></Host>
            <Host page={page} id={`role-dashboard ${win}`}><RoleDashboard company={acmeGroup} personId={acmeGroup.people[0].id} theme={win} today={today} /></Host>
            {SCREENS.map((s) => (
              <Host key={s} page={page} id={`app-screen ${s} ${win}`}><AppScreen screen={s} data={acmeDemo} theme={win === "dark" ? "night" : "day"} still /></Host>
            ))}
          </React.Fragment>
        )),
      )}
    </MotionProvider>
  );
}

createRoot(document.getElementById("root")!).render(<Cases />);
