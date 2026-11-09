> **Current update (2026-11-09):** Browser access now works. All 90 components have paired initial desktop DOM/style/SVG captures and per-component findings; Graph, Inbox, Tree and Handoff received detailed partial corrections. 193 tests, 114 copy compilations and build pass. Full 90-component interaction/visual parity is still incomplete; none is newly marked matched. See [live checkpoint](review/LIVE_REVIEW_2026-11-09.md). Statements below about blocked browser access describe the earlier session.

# Browser comparison — 2026-11-09

The actual affectUI website was opened in a browser and compared with the running local app. This is a qualitative comparison, not a pixel-difference certification.

## Observed and corrected

| Component      | Finding                                                                                                                 | Change                                                                                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent Inbox    | The first recreation used filter tabs and a plain list. The live reference uses a three-column board and a list switch. | Rebuilt the preview around Needs you / Running / Done, matching sample tasks, expandable timelines, status metadata, Board/List, approval/retry callbacks, moving cards, and a narrow-container list. |
| Thinking State | The catalog demo had fewer source chips and steps than the reference, and a wrapper overrode its intended width.        | Restored four branded source chips, three additional sources, all five steps, a 7-second run, the 440px width, and the correct Classic variant.                                                       |
| Checkbox       | The imported component source was original, but the catalog demo showed different example content.                      | Rebuilt the example with a mixed Everything checkbox, three nested options, retention card, and an error state to match the visible reference.                                                        |

## Coverage and limitations

- The 90 catalog entries were checked against the actual site's component navigation.
- All 23 free components use MIT source from the public affectUI repository; Clean and Classic are included. Except for the specifically reviewed examples above, their demo content may differ from the website.
- All 67 Pro-listed components have independent implementations. Most were created from public descriptions, and their detailed layouts, interactions, and animations have **not** all been individually compared or matched in a browser.
- Agent Inbox and Thinking State are closer after the review but are still not guaranteed pixel-identical; API and animation details can differ.
- No paid component source was accessed or copied. A functioning preview and a passing render test do not establish visual equivalence.

A later attempt to revisit affectui.com was blocked by a saved browser permission setting. Further live comparisons were stopped at that point.

## Reuse verification

All 114 standalone source variants and their usage examples compile independently. Every variant is rendered in the automated suite. Browser checks additionally cover navigation, theme/preview controls, source and prompt copying, and downloads. The ZIP is generated from the same source files as the live previews.

## Subsequent individual review

See [COMPONENT_REVIEW.md](./COMPONENT_REVIEW.md) for all 90 entries. Ten independent components were rebuilt from public documentation; four additionally used cached official demo frames. Agent Graph was revised again after the user supplied screenshots demonstrating incorrect icons, node shapes, connector routing and layout. Those concrete findings are recorded in [review/AGENT_GRAPH.md](./review/AGENT_GRAPH.md).

No post-change browser screenshot was obtained for these ten components. The reference site remained denied by the browser origin gate after renewed user authorization. Local preview access was also denied. The screenshot audit remains unfinished; passing 164 automated tests, 114 standalone copy compilations and the production build does not close it.
