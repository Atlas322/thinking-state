# Agent Handoff review — 2026-11-09

**Status: live-reference inspection and partial correction. Not visually matched.**

## Access and evidence

The delegated review attempted `cua.createBrowserTab("iab", "https://www.affectui.com/components/agent-handoff", { visible: false })`. It returned **“Browser is not available: iab”**. The subsequent browser inventory was empty (`browsers: []`). This is a missing browser surface in the child session, not an origin denial. No alternative browser, HTTP retrieval, or other access path was used.

The source review used the existing public documentation cached in `work/catalog.json` in the preceding workspace and the current independent implementation. It did not inspect paid source. The cached documentation states that new handoffs are appended, appear latest on top, lost items explain their reason on hover, and assignments move only forward from a handoff column.

The parent subsequently supplied live browser DOM/computed-style captures from its working session: [dark preview](live/agent-handoff-reference-dark.json), [expanded handoff](live/agent-handoff-reference-expanded-dark.json), and [expanded lost item](live/agent-handoff-reference-loss-dark.json). The viewport was 1280×720 and the component width was 804px. These are live read-only DOM observations, not copied implementation source.

Further captures cover [light desktop](live/agent-handoff-reference-light.json), [390px viewport / 334px component](live/agent-handoff-reference-light-390.json), and [rendered SVG artwork and animation styles](live/agent-handoff-reference-extra.json). Intermediate local captures are retained as `agent-handoff-local-dark-1440.json`, `agent-handoff-local-light-1440.json` and `agent-handoff-local-light-390.json`; those exposed remaining breakpoint typography and spacing differences, which were corrected afterwards. Their component widths differ from the reference (720px desktop / 324px narrow), so widths alone cannot establish a mismatch.

The final [desktop local capture](live/agent-handoff-local-final-light-1440.json) and [narrow local capture](live/agent-handoff-local-final-light-390.json) confirm the shared outer measurements: total heights 452px / 928px, agent height 144px and padding 14/14/12px, description size 12.5/18px, column heights 228px / 220px, card height 82px, and the light card surfaces/shadows. Column widths scale with the different container widths. A final small follow-up removed the extra 1px list inset, normalized avatar font/fill inheritance, and corrected current-task text color; those minor changes are covered by source inspection and tests but not this capture pair. Internal list boxes differ because this recreation places scrolling on the list itself; reference inner lists retain their full content height inside the clipped column. This needs an interaction/fade comparison, not an assertion of matching internals.

Observed interaction: opening “Reply to churned team” reveals its items; opening “3 user quotes” explains “Over the Writer’s 32k context budget – summarized away before the handoff.” and exposes Add back. The demo appended “Launch post” at the top of both handoff columns.

## Corrected

- Appending a handoff now puts it at the top of its column without reversing the caller's array.
- Lost-item buttons expose the supplied reason through their hover title as well as their existing expanded details.
- All action buttons explicitly use `type="button"`, preventing a standalone component embedded in a form from accidentally submitting that form.
- Cancelling a picked task with Escape or Cancel restores focus to its handoff card. Escape from nested loss details also returns focus to the card before the focused controls are removed.
- Measured Clean geometry: agent cards 144px high, 14px corners, 14px/14px/12px padding and 26px rounded logo tiles; 72px between agents and columns; columns 228px high; collapsed cards 82px high. Connector ports are 14px either side of the column center with 3.25px endpoint circles and 1.5px strokes.
- Typography follows the captured sizes: agent names 13px/16px, model labels 11px/14px, descriptions 12.5px/18px, card titles 13px/18px, card summaries 12px/17px and statuses 12px/20px.
- Dark surfaces now use the observed `#1c1c1f` cards, `#161618` wells, neutral alpha text, blue `#5b9aff` connectors and measured shadows. Lost-item explanation panels follow the observed light surface, 8px corners and 12px/17px text even in the dark preview.
- Light surfaces use white cards, `#f4f4f5` wells, `#1c1c1f` titles and `#55555c` summaries with the measured four-layer agent shadow.
- Narrow layouts keep the same card typography and 144px agent height. Below 620px the relay uses 12px gaps, 16px column insets and 220px columns; SVG connectors are hidden, as observed. Below 760px only the working status icon remains.
- Replaced placeholder task glyphs with the observed Slack, GitHub and Notion demo logos. Added the observed Gemini gradient and SVG marks for arrows, item kinds, lost items and the working spinner.
- New handoff IDs now send a short light down the incoming connector and then up the outgoing one. The observed streak timing is 1s with `cubic-bezier(.45,0,.55,1)`; the observed card entry is .42s with `cubic-bezier(.32,.72,.24,1)`. Repeated updates of an existing handoff ID do not replay a pulse. Reduced motion suppresses traveling light. The exact motion phases remain a recreation pending a timed live comparison.

## Verification

`npx vitest run src/agent-handoff.test.tsx src/fidelity.test.tsx`: **15 tests passed**. Four new regressions cover appended ordering without input mutation, cancellation focus without assignment, form-safe restoration / nested Escape focus, and new-ID pulse lifecycle without replay. Existing forward-assignment and controlled-restoration tests still pass.

`npm run typecheck` also passed. Tests verify these behaviors in a DOM test environment; the live captures independently supply the reference measurements. They do not establish a full visual or interaction match.

## Still required

- Paired live reference/local inspection at the same component width, theme and sample state.
- Remaining font metrics, SVG logos and task icons, post-correction layout measurements and the fade at the columns' foot.
- Pointer drag, double-tap, Enter/Space, hover details, forwarding and restored-item state in a real browser.
- The complete live demo sequence and sample content; the local demo still uses a simpler state sequence.
- Timed comparison of the new handoff light, card entry and drag motion; exact timing between incoming light, card insertion and outgoing light remains approximate.
- Responsive boundary widths around 760px and 620px, narrow touch targets, and actual reduced-motion browser behavior.

No complete browser comparison or visual match is claimed for Agent Handoff.
