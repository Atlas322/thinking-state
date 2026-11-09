# Live review checkpoint — 2026-11-09

The requested complete 90-component fidelity audit is **not finished**. No component is newly certified matched.

## What was actually inspected

- All **90 reference pages and 90 local previews** were opened in the browser. `live/catalog/` contains paired initial DOM snapshots, representative computed styles, visible/hidden control inventories and rendered SVG geometry. `catalog-order.json` records the actual reference navigation order.
- The first representative of a CSS class is recorded, not every state. Button's hidden compact examples were detected and supplemented by `live/button-reference-detail.json`. Empty lazy-load captures were replaced after the preview mounted. Toaster's initial notification stack is genuinely empty; triggering toasts remains pending.
- This is **initial desktop Clean/light coverage**, not 90 complete interaction reviews. Demo data, clocks and host widths are not normalized. The 23 MIT Clean/Classic source bodies were left untouched.
- Detailed additional DOM/style inspections were performed for **Agent Graph, Agent Inbox, Agent Tree and Agent Handoff**, including light/dark and narrow samples. Actual actions exercised are recorded in `live/browser-checks.json`. The other 86 implementations were not changed.

## Corrections and remaining work

| Component | Corrections | Still unresolved |
| --- | --- | --- |
| Agent Graph | Uniform 1.5px Clean connectors; one-bend orthogonal routes, shared-side 8/6px ports, same reversed route for answers; guard removed in-flight edges; 56/46/34px desktop and 42/34/28px narrow tiles; measured radius/type/light-dark surfaces; 640px demo positions; card hierarchy/latest 4 calls; incident-call labels; narrow header; keyboard dialog verified. | Full dynamic demo sequence (six/seven tools, costs/statuses), exact logos/tails/ripple/shine, general collision-free routing, exit animations, matching all widths/theme states and Classic. Collinear paths can still intersect an intermediate tile; routing is best-effort. |
| Agent Inbox | Measured typography, spacing, surfaces, layout controls, icon geometry, timeline and narrow list; action-focus regression fixed. | Full waiting/reject/approve/retry/open matrix, delayed column transfer/FLIP timing, touch and minimum-width checks. |
| Agent Tree | Measured card geometry, hierarchy spacing, connectors, light/dark/narrow typography/icons; whole-card selection, fresh dialog data, safe button types. | Header resolution interactions, full dynamic retry demo, exact exits, equal-width settled comparison and Classic. |
| Agent Handoff | Measured agent/history cards, connectors, light/dark/narrow layout and SVGs; newest-first history, focus restoration, safe buttons, incoming/outgoing pulse. | Full demo sequence, drag/touch/keyboard assignment and restore matrix, scroll fade/clipping and exact motion phase. |

Detailed component evidence: [Graph](AGENT_GRAPH.md), [Inbox](AGENT_INBOX.md), [Tree](AGENT_TREE.md), [Handoff](AGENT_HANDOFF.md).

All 90 initial findings, including concrete remaining mismatches: [first25](CATALOG_BATCH_1.md), [next30](CATALOG_BATCH_2.md), [last35](CATALOG_BATCH_3.md). These reports separate data differences from geometry and do not infer missing functionality solely from a collapsed DOM.

## Verification

- 193 automated tests pass; 114 standalone component+usage compilations pass; production build passes.
- Browser: local Code/Usage tabs, Copy code (source read back from clipboard), Copy prompt, mobile navigation, and ZIP download succeeded. Downloaded ZIP contains 241 entries; its Agent Graph source contains current uniform-link implementation.
- Automated checks establish runtime/copy integrity, not design fidelity.
- Initial Playwright launch could not find Google Chrome. The normal in-app browser successfully opened both origins; no Deny was encountered or bypassed. Child sessions had no browser inventory, so the parent captured UI evidence and subagents reviewed those files.
- Temporary browser width overrides were reset. The retained local preview remains available.

The screenshots are supplementary only. Their simulation phases/tool counts differ; they are not a pixel-difference pass. `live/agent-graph-local-final.png` shows the revised 640px component; JSON provides the actual measurement evidence.
