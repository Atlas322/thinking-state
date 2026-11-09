# Agent Tree — live reference follow-up, 2026-11-09

**Partial review, not matched.** The parent browser session inspected the live Clean reference in dark and light themes, at desktop and 390px viewports, and folded Researcher. The delegated editor could not open a browser: `cua.createBrowserTab("iab", ...)` reported `Browser is not available: iab`, and the browser inventory was empty. This was an availability error, not an origin denial. No alternate access path was used.

## Evidence

- [Reference DOM, computed styles and SVG geometry](live/agent-tree-reference-dark.json), component width 760px.
- [Reference after folding Researcher](live/agent-tree-reference-dark-folded.json).
- [Light desktop measurements](live/agent-tree-reference-light.json), [settled 390px viewport](live/agent-tree-reference-light-390.json), and [visible SVG/motion measurements](live/agent-tree-reference-extra.json).
- [Local dark first post-change measurement](live/agent-tree-local-dark-1440.json), component width 720px rather than the reference's 760px. Its vertical card positions match 36/188/312/436px; widths cannot be compared directly until the component widths agree. Later light/icon refinements postdate this capture.
- [Final local desktop](live/agent-tree-local-final-light-1440.json) and [390px viewport](live/agent-tree-local-final-light-390.json): both contain the intended Agent Tree component. Card surface, radius, shadow, padding, font family and task font/line-height match the shared measured fields. Component widths are still 720/324px locally versus 760/334px in the reference, so card widths differ (202.67/260px versus216/270px).
- Previously cached public documentation: the earlier workspace `work/affectui-docs.txt`, Agent Tree section.

The 760px reference has 216×112px cards at every level, a root at x=256/y=36, first-level cards at x=0/256/512 and y=188, and deeper cards indented 32px. Its column gap is 8px, first-level vertical gap 40px, and deeper gap 12px. The card radius is 8px with a 0.5px outline shadow; provider marks sit in 22×22px tiles with 6px corners. Names are 13px/16px, model labels 11px/14px, task text 12px/16px, and footer text 11px/16px. Connectors use a 1.5px stroke and parent dots have radius 3.25px.

At a 390px viewport, the reference component is 334px wide with 270px cards, a 44px two-row header, and 32px indentation per level. Cards are naturally 96px or 112px high according to their one/two task lines. The capture was repeated after the resize transition settled.

## Corrections

- Replaced varying card widths and 24px branch indentation with shared widths, 32px indentation and measured gaps. Corrected the typography, card and avatar treatment, dark surface, header spacing, and connector stroke/dots. Centered root connectors now remain straight instead of backtracking through a zero-width rounded turn.
- Whole-card click and Enter now call `onSelect`; fold and resolution controls do not accidentally select the card. Previously only the name was clickable despite the public card-selection contract.
- Resolution dialogs follow the latest agent data by ID. A changed question updates in place without resetting keyboard focus, callbacks receive the current agent, and a question disappears when its agent finishes or is removed.
- Added the documented total-cost shimmer and zero-padded minute/second display.
- Corrected measured light surface/shadow/foreground colors and done/failed colors, narrow header wrapping and task-dependent height. Replaced title, check, loader, warning and chevron glyphs with observed SVG geometry and restored the demo's tool marks.
- Applied measured 0.9s loader, 0.36s card-entry and 0.42s connector-draw timings with 160ms child delay. Connectors are remeasured during entry and relocation; muted states remain muted after animation. Exact exit/stagger trajectories still require comparison.
- Explicit button types keep fold/resolution actions from submitting a surrounding consumer form.

## Verification and remaining work

`npx vitest run src/agent-tree.test.tsx src/fidelity.test.tsx`: 15 tests passed, including four new regressions for whole-card selection, live resolution data and host-form isolation. TypeScript compilation also passed. These are behavior checks, not browser-fidelity evidence.

Final local captures found a 0.7266px task/card height expansion from middle-aligned inline tool marks. A follow-up live computed-style inspection confirmed the reference uses `vertical-align: top`; this was corrected. The supplied desktop capture also includes the entry transition, so its fractional y positions are not a settled-layout comparison. A settled capture after the alignment fix at matching component widths remains pending. The demo is still static and omits the reference's later retry child; header waiting/failed summaries are text instead of the reference's interactive controls. Waiting icon/palette, provider logo contour equivalence, dialog presentation, live status sequence, and exact exit/stagger trajectories still need live comparison. Responsive cardinalities beyond the observed three-branch tree are not certified. Classic styling is not covered by this Clean reference pass. This component must remain marked incomplete.
