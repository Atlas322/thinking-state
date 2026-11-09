# Component Studio

A searchable, copyable React component library covering all **90 components** listed on [affectUI](https://www.affectui.com/components). The app includes a categorized menu, live previews, light/dark themes, favorites, source code, usage examples, and **Copy prompt**.

**23 components use the original MIT source**, with Clean and Classic styles. **67 are independent recreations** of public previews and documented behavior. They are not affectUI Pro source, and they do not all match the original appearance or API. See [VISUAL_REVIEW.md](./VISUAL_REVIEW.md) for the actual browser comparison and remaining differences.

The [architecture audit](./ARCHITECTURE_AUDIT.md) verifies how affectUI uses the shadcn registry and records the implementation gaps. The 67 independent recreations should not be treated as exact substitutes for affectUI Pro.

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
  return <AgentInbox defaultView="board" />;
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

The app loads the selected component on demand. The surrounding Component Studio interface is a custom catalog; it is not a clone of affectUI's entire website.
