# Agent Inbox live review — 2026-11-09

Status: **partially inspected and corrected; not matched**. This pass concerns the Clean preview. The root agent captured the reference browser because child agents have no browser inventory. Child access failed with `Browser is not available: iab`, not a permission denial; no other browser or network route was used by the child.

## Evidence

- `live/agent-inbox-reference-dark-board.json`: rendered DOM attributes, computed styles and rectangles at a 718px component width.
- `live/agent-inbox-reference-dark-list.json`: the same reference after selecting List.
- `live/agent-inbox-reference-dark-expanded.json`: CRM task expanded in List.
- `live/agent-inbox-reference-light.json` and `live/agent-inbox-reference-light-390.json`: light List at desktop and 390px viewport (326px component).
- `live/agent-inbox-reference-extra.json`: all descendant SVG geometry and computed styles, including metadata and timelines.
- The parent observed List selection, CRM expansion, then Escape from Retry closing the card and restoring focus to the CRM card button.

The captured board was already past an approval/demo transition: Needs you contained CRM, Running contained three tasks. It must not be compared to the untouched local five-task demo as if the status distributions were equal. Live clocks and transition timing also differ between captures.

## Measured differences corrected

| Element | Previous local value | Observed reference / correction |
| --- | --- | --- |
| Header and card title | 13px | 14px / 20px, weight 500 |
| State and count text | 10px | 12.5px state; 12px counts |
| Board gaps / lane padding | 9px / 3px | 8px / 4px |
| Lane radius / card spacing | 13px / 4px | 14px / 6px |
| Card edge | 1px border | No layout border; 1px shadow edge |
| Card main | block, 11px top padding | grid with 6px gap; 12px 14px 12px 12px padding |
| Board/List switch | 12px text, 9px outer radius | 12.5px weight 500, 10px radius; 26px button height, 7px inner radius |
| Dark palette | gray text/card values approximated | Title #ededed; body #b6b6bd; muted #85858d; card #1e1e21; lane #161618; edge #2c2c31 |
| List description / metadata indentation | 20px | 26px |
| Extra footer | visible status and total | Reference has only a visually hidden polite status summary; local summary is now visually hidden |
| Expanded agent / Retry | decorative spark / Unicode retry arrow | Plain text, as observed |
| Expanded actions | 11px text, 5px radius | 12.5px weight 500; 28px height; 8px radius |

Further measured corrections:

- Light palette: title #1c1c1f, body #55555c, muted #8e8e96, lane #f4f4f5, edge #e9e9ec; blue #2f6bff, green #22a05a, red #e5484d. Dark equivalents remain separately scoped.
- At a 326px component width, the reference removes the 26px desktop List indentation and reduces the header to 20px. The local narrow rules now do this as well.
- Rendered SVG inspection showed a curved spark with a separate small dot, 13px Board/List icons, 12px search/wrench icons, a filled error circle, a 12px spinner and a 6.8px visible done dot. These measured shapes replaced the generic glyphs. The reference has no card chevron; the extra local chevron was removed.
- Spinner cycle: 0.9s linear, replacing 1s. The exact status-pop keyframe shape is still unverified.
- Metadata icon/text gap: 5px; horizontal padding 9px with no final right padding. Timeline text and time: 12.5px / 18px, with 10px between columns.

These are independently authored changes based on public rendered measurements. No Pro source was accessed.

## Keyboard regression

A local test reproduced focus falling to `document.body` after each fallback Approve, Reject and Retry removed the focused action button. The component now restores focus to that task's main button after its move/collapse. Three regression cases failed before the fix and pass after it. Existing Escape, callback ownership, controlled view and millisecond-clock tests continue passing.

Validation: `npm test -- src/agent-inbox.test.tsx` — 11 tests pass; `npm run typecheck` — pass. Tests do not establish design parity.

## Remaining verification

- Local post-change computed-style comparison against the captured reference at equal width/theme/data.
- Post-change light/narrow comparison, touch layouts, 300px minimum width and full keyboard traversal.
- Waiting-state icon and amber color (the captured demo had already advanced beyond waiting), plus any hover-only artwork. Other visible SVGs were measured and corrected.
- Exact open/close, in-place status transition, movement and clock timing; current FLIP movement has not been matched to reference timing.
- Full Approve/Reject/Retry/Open demo transitions, external callback updates and reduced-motion browser behavior.
- Classic preview comparison, if an additional Classic recreation is added in future.
