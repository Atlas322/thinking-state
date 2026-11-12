# Thinking State

Thinking State is the engine that shows an agent's work as live widgets — the product layer of INAI, live at [thinkstate.site](https://thinkstate.site). This repository is its component library (formerly called Component Studio): a searchable, copyable React component library covering all **90 components** listed on [affectUI](https://www.affectui.com/components). The app includes a categorized menu, live previews, light/dark themes, favorites, source code, usage examples, and **Copy prompt**.

**23 components use the original MIT source**, with Clean and Classic styles. **67 are independent recreations** of public previews and documented behavior. They are not affectUI Pro source, and they do not all match the original appearance or API. See [VISUAL_REVIEW.md](./VISUAL_REVIEW.md) for the actual browser comparison and remaining differences.

The [architecture audit](./ARCHITECTURE_AUDIT.md) verifies how affectUI uses the shadcn registry and records the implementation gaps. The 67 independent recreations should not be treated as exact substitutes for affectUI Pro.

[COMPONENT_REVIEW.md](./COMPONENT_REVIEW.md) tracks each of the 90 components separately. Ten independent components were substantially rebuilt, with a later cached-reference review correcting Agent Inbox integration and Agent Graph edge cases. Agent Graph was revised from the user's reference screenshots; the new render still awaits a screenshot comparison. Browser permissions currently block both the reference site and local preview, so the full visual audit is unfinished.

## Start locally

Use Node.js 22.12+.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. The default page is Thinking State; use the left menu or `/` to search. On small screens, open the menu with the top-left button. Each component has a direct `#/component-name` URL.

## Copy into your project

- **Copy code** copies the complete standalone `.tsx` file, including styles.
- **Copy prompt** copies installation instructions, usage, and the full source. Paste it into ChatGPT, Codex, Claude, Cursor, or another coding assistant. The recipient does not need access to this private repository.
- **Download component** saves the selected file.
- **Take the library with you** downloads all 114 source variants and their usage examples as a ZIP.

Requires React 19 and TypeScript. No Tailwind, icon package, or animation library is required. Inter is optional. All copied components support a `.dark` or `data-theme="dark"` ancestor. Source files live in `src/library`; usage examples are shown in the app and included in the ZIP.

```tsx
import { AgentInbox } from "./components/agent-inbox";

export function Dashboard() {
  return (
    <AgentInbox
      defaultView="board"
      tasks={[{
        id: "review",
        title: "Review release notes",
        agent: "Writer",
        status: "done",
        elapsed: 80_000,
      }]}
    />
  );
}
```

Named exports accept application data and callbacks. Default exports render a working example. Review the exported TypeScript prop types before integrating: the independent implementations can have different APIs from affectUI. UI demos do not execute real searches, run agents, approve production changes, or send messages. Connect their callbacks to your application.

When copying an original MIT component, retain the license notice included at the top of its file. Attribution and details are in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Validate and build

```sh
npm test
npm run check:copy
npm run build
npm run preview
```

`check:copy` creates a temporary standalone copy of all 114 variants and compiles each with its usage example. The test suite renders every variant and exercises key state changes and callbacks. GitHub Actions runs these checks on pushes and pull requests.

`npm run package:library` regenerates `public/component-library.zip`. This also runs before development and production builds, so downloaded files stay aligned with the preview source. ZIP packaging uses Node's built-in libraries; no extra tooling is required.

## Structure

- `src/library/` — 114 standalone component files, including 24 Classic variants.
- `src/catalog.json` — 90 entries with category, provenance, export name, and usage.
- `src/registry.ts` — lazy preview/source loading and complete prompt generation.
- `src/App.tsx` and `src/demo.css` — browsing and copy interface.
- `src/components/` — the initial two-file Thinking State implementation, kept for compatibility.
- `scripts/` — reproducible ZIP packaging and isolated copy validation.

The app loads the selected component on demand. The surrounding Thinking State interface is a custom catalog; it is not a clone of affectUI's entire website.

## Deploy notifications (Railway → Resend)

`server.mjs` serves `dist/` and exposes `POST /api/railway-webhook`. Railway calls it on
deployment status changes and the server emails a summary through Resend.

Service variables (Railway → service → Variables):

| Variable | Purpose |
|----------|---------|
| `WEBHOOK_TOKEN` | Shared secret; Railway sends it as `Authorization: Bearer <token>` |
| `RESEND_API_KEY` | Resend API key (`re_...`) |
| `NOTIFY_EMAIL_TO` | Recipient(s), comma-separated |
| `NOTIFY_EMAIL_FROM` | Sender, e.g. `Deploys <deploys@thinkstate.site>` (domain must be verified in Resend) |
| `NOTIFY_STATUSES` | Statuses to email, default `SUCCESS,FAILED,CRASHED` |
| `NOTIFY_TEST_COOLDOWN_MS` | Min interval between website test-button emails, default 30000 |
| `NOTIFY_ON_START` | Set to `false` to disable the startup self-report (default on) |

The topbar "Test notification" button calls `POST /api/notify-test`, which emails the
configured recipient (rate limited). On every successful deploy the new container also emails on its own (using Railway's
`RAILWAY_GIT_*` / `RAILWAY_DEPLOYMENT_ID` variables, deduplicated via Resend's Idempotency-Key),
so `SUCCESS` mails need no webhook. For `FAILED`/`CRASHED` mails add the webhook:
Railway → Project Settings → Webhooks → URL `https://www.thinkstate.site/api/railway-webhook`,
header `Authorization: Bearer <WEBHOOK_TOKEN>`, events: deployment status changes.
