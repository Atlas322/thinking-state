/**
 * One registry for every chat widget's data, in the spirit of the INAI
 * «Settings & Database» meta table: what each widget is for, which fields it
 * takes, and how those fields map to vault frontmatter and Notion properties.
 * Agents read it with `npm run chat:html -- --schema [slug]`.
 *
 * Shared conventions (all widgets):
 * - `owner` / `sharedWith` = vault `owner` / Notion Owner + Collabs. Every
 *   person has a full base; teams and companies only add sharing on top.
 * - `me` = the viewer. When set, an All / Mine switch shows only what `me`
 *   owns or is shared on (the Just.Notion «owner OR collaborator» view).
 * - `status`, `project`, `due` keep their vault names; statuses map onto each
 *   widget's own states (see `statusMap`).
 */

export type FieldSpec = {
  type: string;
  /** Vault frontmatter key, when the field comes from a note. */
  vault?: string;
  /** Notion property in the Just.Notion / INAI templates. */
  notion?: string;
  required?: boolean;
  note?: string;
};

export type WidgetSchema = {
  slug: string;
  name: string;
  /** Like INAI's «Feeds»: which board this widget stands in for. */
  feeds: string;
  role: "Report" | "Entity" | "Log";
  props: Record<string, FieldSpec>;
  items?: Record<string, Record<string, FieldSpec>>;
  statusMap?: Record<string, string[]>;
};

const shared: Record<string, FieldSpec> = {
  owner: { type: "string", vault: "owner", notion: "Owner" },
  sharedWith: { type: "string[]", notion: "Collabs", note: "Team / company sharing layer" },
};

export const chatWidgetSchemas: WidgetSchema[] = [
  {
    slug: "project-report",
    name: "Project Report",
    feeds: "Project Portfolio · Weekly GTD",
    role: "Report",
    props: {
      project: { type: "{ name, icon?, status?: { label, tone? }, owner?, sharedWith?, updated?, summary? }", required: true, vault: "project note frontmatter" },
      me: { type: "string", note: "Enables All / Mine" },
      kpis: { type: "{ label, value: number, unit?, note?, tone? }[]", note: "Counts only; no prices" },
      progress: { type: "{ value: 0–100, label?, milestones?: { at, label }[] }", notion: "Progress (formula)" },
      phases: { type: "Phase[]", notion: "Sub-projects / Roadmap & Milestone" },
      waiting: { type: "Waiting[]", vault: "GTD tasks with waiting_on: me" },
      view: { type: '"status" | "cards"' },
      labels: { type: "Partial<labels>", note: "Mongolian labels go here" },
    },
    items: {
      Phase: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        state: { type: '"done" | "active" | "blocked" | "next"' },
        status: { type: "string", vault: "status", notion: "Status", note: "Alias of state" },
        line: { type: "string" },
        date: { type: "string" },
        due: { type: "string", vault: "due", notion: "Date", note: "Alias of date" },
        progress: { type: "number 0–100" },
        ...shared,
      },
      Waiting: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        line: { type: "string" },
        action: { type: "string", note: "Button; sends «<action>: <title>» to the chat" },
        tone: { type: '"green" | "amber" | "blue" | "red" | "gray"' },
        ...shared,
      },
    },
    statusMap: {
      done: ["completed", "done", "cancelled"],
      active: ["in-progress"],
      blocked: ["waiting", "waiting-on", "stuck", "failed"],
      next: ["inbox", "planning", "next-action", "someday"],
    },
  },
  {
    slug: "pr-deploy-status",
    name: "PR & Deploy Status",
    feeds: "Delivery / PM",
    role: "Log",
    props: {
      repo: { type: "string", vault: "repo" },
      me: { type: "string", note: "Enables All / Mine on pull requests" },
      prs: { type: "PullRequest[]", note: "From gh pr list" },
      deploys: { type: "Deploy[]" },
    },
    items: {
      PullRequest: {
        number: { type: "number", required: true },
        title: { type: "string", required: true },
        state: { type: '"open" | "draft" | "merged" | "closed"', required: true },
        branch: { type: "string" },
        checks: { type: "{ passed?, failed?, pending? }" },
        review: { type: '"approved" | "changes" | "pending"' },
        updated: { type: "string" },
        href: { type: "string" },
        ...shared,
      },
      Deploy: {
        id: { type: "string", required: true },
        env: { type: "string", required: true },
        state: { type: '"live" | "building" | "queued" | "stuck" | "failed"', required: true },
        target: { type: "string" },
        steps: { type: '{ label, state: "done" | "active" | "stuck" | "failed" | "next", time? }[]' },
        blocker: { type: "{ title, detail?, since?, action?, log?: string[] }", note: "No vendor names" },
      },
    },
  },
  {
    slug: "decision-inbox-chat",
    name: "Decision Inbox · Chat",
    feeds: "GTD / My-Day",
    role: "Entity",
    props: {
      title: { type: "string" },
      me: { type: "string", note: "Enables All / Mine" },
      decisions: { type: "Decision[]", required: true, vault: "decision atoms (open questions)" },
      chosen: { type: "Record<id, optionId>" },
    },
    items: {
      Decision: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        context: { type: "string" },
        project: { type: "string", vault: "project", notion: "Projects" },
        due: { type: "string", vault: "due", notion: "Date" },
        urgent: { type: "boolean", notion: "Priority = High" },
        options: { type: "{ id, label, recommended? }[]", required: true },
        ...shared,
      },
    },
  },
  {
    slug: "session-board",
    name: "Session Board",
    feeds: "Project Portfolio · GTD",
    role: "Entity",
    props: {
      project: { type: "{ name, icon?, status?, owner?, stats?, links? }", required: true },
      me: { type: "string", note: "Enables All / Mine" },
      groups: { type: "{ id, label, defaultCollapsed? }[]", note: "PARA: projects, areas, resources, finance" },
      sessions: { type: "Session[]", required: true, note: "From list_sessions {linked: true}" },
      view: { type: '"groups" | "status" | "cards"' },
    },
    items: {
      Session: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        state: { type: '"running" | "waiting" | "done" | "idle"' },
        status: { type: "string", vault: "status", notion: "Status", note: "Alias of state" },
        line: { type: "string" },
        group: { type: "string", vault: "PARA folder", notion: "PARA" },
        parent: { type: "string", notion: "Parent project" },
        pr: { type: "number | { number, state? }" },
        ...shared,
      },
    },
    statusMap: {
      running: ["in-progress"],
      waiting: ["waiting", "waiting-on", "blocked"],
      done: ["completed", "done", "cancelled", "merged"],
      idle: ["inbox", "planning", "next-action", "someday"],
    },
  },
  {
    slug: "next-step-box",
    name: "Next-Step Box",
    feeds: "Turn wrap-up",
    role: "Report",
    props: {
      recap: { type: "string", required: true, note: "2–3 sentences: what is now true, what is not done or verified" },
      ask: { type: "string", note: "One decision, ≤100 chars; omit when nothing waits on the person" },
      actions: { type: '{ id, label, kind?: "app" | "reply" }[]', note: "1–2; the first is the agent pick (primary)" },
      blocked: { type: "boolean", note: "Work stops until answered" },
      state: { type: '"wrapping" | "ready" | "answered"' },
      chosen: { type: "string", note: "Action id once answered" },
    },
  },
  {
    slug: "session-offer",
    name: "Session Offer",
    feeds: "Side sessions",
    role: "Entity",
    props: {
      title: { type: "string", required: true },
      brief: { type: "string" },
      initiation: { type: '"offer" | "own_initiative" | "user_asked"', note: "offer = New session / Do it here; own_initiative = Start / Dismiss" },
      context: { type: '"fork" | "fresh"' },
      where: { type: "string", note: "Worktree branch, folder or cloud" },
      name: { type: "string", note: "Short session name once started" },
      state: { type: '"offered" | "starting" | "started" | "dismissed" | "here"' },
    },
    statusMap: {
      offered: ["proposed", "offered"],
      started: ["running", "in-progress"],
      dismissed: ["dismissed", "cancelled"],
    },
  },
  {
    slug: "side-sessions",
    name: "Side Sessions",
    feeds: "Session family (list_sessions {linked: true})",
    role: "Log",
    props: {
      sessions: { type: "SideSession[]", required: true },
    },
    items: {
      SideSession: {
        id: { type: "string", required: true },
        title: { type: "string", required: true },
        state: { type: '"needs" | "running" | "idle" | "done"', required: true },
        line: { type: "string", note: "Latest report or what it waits on" },
        branch: { type: "string" },
        pr: { type: "number" },
        steps: { type: '("check" | "update" | "archive")[]', note: "Close-out chain; archive only after check" },
      },
    },
    statusMap: {
      needs: ["waiting", "blocked", "needs-input"],
      running: ["working", "starting", "in-progress"],
      idle: ["idle", "paused"],
      done: ["completed", "done"],
    },
  },
];

export const schemaFor = (slug: string) => chatWidgetSchemas.find((s) => s.slug === slug);
