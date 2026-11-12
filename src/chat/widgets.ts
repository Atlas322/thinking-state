import type { ComponentType } from "react";

/**
 * Chat widgets: catalog components an agent shows directly in its chat.
 * Each one takes plain JSON props, so the same object drives the catalog
 * preview, the one-file HTML export («Use in chat») and the CLI
 * (`npm run chat:html -- <slug> data.json`).
 */
export type ChatWidget = {
  slug: string;
  load: () => Promise<{
    Component: ComponentType<Record<string, unknown>>;
    demo: Record<string, unknown>;
  }>;
  /** Props forced in static exports, where React state is not running. */
  staticProps?: (props: Record<string, unknown>) => Record<string, unknown>;
};

const as = <P,>(c: ComponentType<P>) => c as unknown as ComponentType<Record<string, unknown>>;

export const chatWidgets: ChatWidget[] = [
  {
    slug: "project-report",
    load: () =>
      import("../library/project-report").then((m) => ({
        Component: as(m.ProjectReport),
        demo: m.projectReportDemo,
      })),
  },
  {
    slug: "pr-deploy-status",
    load: () =>
      import("../library/pr-deploy-status").then((m) => ({
        Component: as(m.PrDeployStatus),
        demo: m.prDeployStatusDemo,
      })),
  },
  {
    slug: "decision-inbox-chat",
    load: () =>
      import("../library/decision-inbox-chat").then((m) => ({
        Component: as(m.DecisionInboxChat),
        demo: m.decisionInboxChatDemo,
      })),
  },
  {
    slug: "session-board",
    load: () =>
      import("../library/session-board").then((m) => ({
        Component: as(m.SessionBoard),
        demo: m.sessionBoardDemo,
      })),
    // The static export shows one view; the view switch needs React.
    staticProps: (p) => ({
      views: [(p.view as string) ?? (p.defaultView as string) ?? "groups"],
    }),
  },
];

export const chatWidgetFor = (slug: string) =>
  chatWidgets.find((w) => w.slug === slug);
