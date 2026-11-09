# Thinking State

A standalone React + TypeScript recreation of the public [affectUI Thinking State preview](https://www.affectui.com/components/thinking-state), with a runnable Vite demo.

This is an independently written implementation based on the visible preview and documented behavior. It does not contain affectUI's paid source code and is not an official affectUI distribution. It aims for a close visual match; it is not a byte-for-byte or guaranteed pixel-perfect copy.

## Run

Requires Node.js 22.12+ or a supported newer release.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The demo has light/dark themes, Clean/Classic styles, replay, and an optional loop.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

## Use in another React project

Copy `src/components/thinking-state.tsx` and `src/components/thinking-state.css` together into your project. The component imports its stylesheet and has no runtime dependency beyond React. The demo bundles Inter locally through `@fontsource/inter`; the component falls back to system fonts when Inter is unavailable.

```tsx
import { ThinkingState, type ThinkingStep } from './components/thinking-state';

const steps: ThinkingStep[] = [
  {
    kind: 'search',
    label: 'Searching',
    sources: [{ label: 'Example', href: 'https://example.com' }],
    moreSources: [{ label: 'React', href: 'https://react.dev' }],
  },
  { kind: 'step', label: 'Reading the sources' },
  { kind: 'step', label: 'Preparing an answer' },
];

export function AssistantMessage() {
  return <ThinkingState steps={steps} onDone={(seconds) => console.log(seconds)} />;
}
```

| Prop | Default | Purpose |
| --- | --- | --- |
| `steps` | required | Ordered search/action rows |
| `stepMs` | `1300` | Time per step in milliseconds |
| `doneLabel` | `Finished thinking` | Completion row text |
| `loop` | `false` | Replay after a 2.6 second pause |
| `collapseOnDone` | `false` | Fold the timeline on completion |
| `onDone` | — | Receives elapsed whole seconds once per run |
| `className` | — | Extra root CSS class |
| `variant` | `clean` | `clean` or `classic` appearance |

A step has `kind`, `label`, optional `completedLabel`, `sources`, and `moreSources`. A source has a `label` and optional `href`, `tooltip`, and `icon` (React node). If no tooltip is supplied, the link's hostname and path are shown. The default search label changes from “Searching” to “Searched” when that step finishes.

Use `.dark` or `data-theme="dark"` on an ancestor for dark mode. Override the `--thinking-*` CSS variables for custom colors. Change the component's React `key` to start a fresh run. Changes to the step count, interval, or loop setting also restart its clock; changing an inline callback does not.

## Behavior and accessibility

- Live timer, staggered source chips, shimmering active text, animated timeline, and completion check.
- Header and additional sources are real buttons with `aria-expanded` and `aria-controls`.
- Collapsed content is inert and hidden from assistive technology.
- Sources support keyboard focus and tooltips; newly revealed steps use a polite live region.
- `prefers-reduced-motion` disables decorative animation while retaining the timed progression.
- No external network requests are made by the component. Links open only when clicked.

This is a timed presentation component. It does not execute searches or connect to an AI service; connect your application data separately when using it in a real product.
