# Catalog baseline review — batch 2 (2026-11-09)

**Coverage:** 30 components, Agent Handoff through KPI Chart in the reference sidebar order (zero-based indices 25–54). All 30 now have populated reference and local captures; Away Summary and Integration Settings were recaptured after initially empty extraction. **No component in this report is marked matched.**

Evidence consists of the parent’s live browser snapshots, initial DOM control inventories, computed styles and rendered SVGs under `review/live/catalog`. This delegated pass reads those artifacts; it does not execute additional browser actions or modify component implementations. The reference is Clean/light for these captures. Desktop host widths and demo clocks are not normalized: width/height differences below describe the captured state, not a pixel-diff result. Controls can be present in folded/hidden DOM or mounted only after hover; an inventory difference alone does not prove an action is unavailable. Every component still needs matching sample state, exercised interactions, keyboard, narrow/dark and reduced-motion checks before completion.

A recurring concrete gap is the generic local `.st-ui` panel: white background, 1px border, 14px corners and 13px/20.15px type. Many reference components use a flat root, 10px/12px card corners or a much smaller intended content width. This is visible in the per-component metrics; it is not resolved by passing render tests.

## 26. Agent Handoff

[Reference capture](live/catalog/agent-handoff-reference.json) · [Local capture](live/catalog/agent-handoff-local.json). Captured roots: reference **804.0 × 452.0px**; local **720.0 × 452.0px**.

**Data / demo state:** Latest baseline shows Researcher idle with Changelog v2 +3 up next; local starts a working churn task. API-release context text differs; onboarding is clean in the reference baseline but loses a quote locally.

**Presentation / controls / next check:** Measured outer height is 452px on both; desktop width differs with the host. Reference DOM retains item buttons within folded cards; local mounts them only when expanded. Use the dedicated Handoff review for measured corrections; full demo timing, all loss/assignment states and scroll fade remain open.

## 27. Agent Inbox

[Reference capture](live/catalog/agent-inbox-reference.json) · [Local capture](live/catalog/agent-inbox-local.json). Captured roots: reference **718.0 × 350.0px**; local **720.0 × 350.0px**.

**Data / demo state:** The five task titles, Board/List views and 350px overall height correspond closely. Running/done labels differ in the control text: reference says Running / Done in; local accessible names expose only durations for those cards.

**Presentation / controls / next check:** Reference DOM contains Reject/Approve/Retry/Open at baseline; local only contains the five card buttons before hover/focus. This is a mounting/visibility difference, not proof that actions are missing. Check pointer and keyboard reveal, status announcements and the full action matrix against the dedicated Inbox review.

## 28. Agent Lanes

[Reference capture](live/catalog/agent-lanes-reference.json) · [Local capture](live/catalog/agent-lanes-local.json). Captured roots: reference **760.0 × 292.4px**; local **680.0 × 373.3px**.

**Data / demo state:** Reference has four agents, six task blocks and a Last 30m axis; local has three agents and a 0:00 / 0:30 / 1:00 / Now axis with different tasks.

**Presentation / controls / next check:** Reference root is flat/transparent; local uses the generic bordered 14px card. Reference capture contains 18 SVGs, local none. Task overlap, handoff connectors, approval on the block and task detail interactions need rebuilding/verification; baseline alone does not test them.

## 29. Agent Ledger

[Reference capture](live/catalog/agent-ledger-reference.json) · [Local capture](live/catalog/agent-ledger-local.json). Captured roots: reference **640.0 × 100.0px**; local **720.0 × 370.0px**.

**Data / demo state:** Reference is at the first live event: one Merged PR #482 change for Launch agent. Local starts with several unrelated CRM/price changes, including a dependent-undo example.

**Presentation / controls / next check:** Root font is 13px/20px in the reference versus inherited 16px/normal locally, a concrete typography error independent of event timing. Both expose Undo, but transitive undo, redo and failure behavior cannot be judged from this initial pair. Align sample state before comparing row geometry.

## 30. Agent Monitor

[Reference capture](live/catalog/agent-monitor-reference.json) · [Local capture](live/catalog/agent-monitor-local.json). Captured roots: reference **340.0 × 158.0px**; local **680.0 × 389.6px**.

**Data / demo state:** Reference starts a six-step Release agent run with model Opus 5.5, $0.000 and a compact clock. Local shows Assistant, $0.120, three textual steps and an inline build command.

**Presentation / controls / next check:** Reference compact root is 340×158px; local is 680×389.6px. Reference has Fold away/Pause/Cancel/Log controls; local has Collapse/Pause/Cancel/Finish demo and no Log in baseline. Model/tool SVG marks are absent locally. Run-state, permission and folded variants still need actual actions.

## 31. Agent Queue

[Reference capture](live/catalog/agent-queue-reference.json) · [Local capture](live/catalog/agent-queue-local.json). Captured roots: reference **756.0 × 540.0px**; local **680.0 × 525.8px**.

**Data / demo state:** Reference exposes queue/worker/throughput/p95 statistics and six current job controls, with three named model workers. Local shows its own generic job dataset.

**Presentation / controls / next check:** Reference has a 12px root corner and worker-minus/plus controls; local has 14px corners and + Add job instead. No SVGs occur locally versus 18 in reference. Worker scaling, pause, job inspection, priority, retry and live movement are untested by this capture.

## 32. Agent Recap

[Reference capture](live/catalog/agent-recap-reference.json) · [Local capture](live/catalog/agent-recap-local.json). Captured roots: reference **804.0 × 532.0px**; local **680.0 × 434.9px**.

**Data / demo state:** Reference groups two decisions, one failure and three completed activities. Local has one refund, one CRM failure and one completed ticket summary, plus 24 inspect-hour buttons.

**Presentation / controls / next check:** Reference includes Review/Merge and individual Undo actions; local baseline has only Approve/Retry. Generic local framing also loses the reference 16/16/12px root inset and event SVG artwork. Verify timeline selection and all board actions after matching the event data.

## 33. Agent Steering

[Reference capture](live/catalog/agent-steering-reference.json) · [Local capture](live/catalog/agent-steering-local.json). Captured roots: reference **460.0 × 344.2px**; local **680.0 × 403.8px**.

**Data / demo state:** Reference is a five-step users-table migration at step 2, with a labeled multiline steering field. Local shows a different run with a single-line input.

**Presentation / controls / next check:** Reference is a flat 460px panel; local is a bordered 680px card. Reference offers Pause and Queue for the next step; local adds Interrupt now. The different editor element, naming and action placement are concrete gaps; queued-message removal, interruption and keyboard sending remain untested.

## 34. Agent Trail

[Reference capture](live/catalog/agent-trail-reference.json) · [Local capture](live/catalog/agent-trail-local.json). Captured roots: reference **360.0 × 262.0px**; local **680.0 × 574.1px**.

**Data / demo state:** Reference has five steps for Fix the checkout crash and shows editing details within the active patch step. Local has four steps, a Testing state and an approval step.

**Presentation / controls / next check:** Reference is 360px wide with 12px corners and 4/8/10px padding; local is 680px, 14px corners and generic framing. Reference baseline focuses the active Editing step; local exposes every step as a button. Compare step expansion, details, gate actions and time changes in synchronized states.

## 35. Agent Tree

[Reference capture](live/catalog/agent-tree-reference.json) · [Local capture](live/catalog/agent-tree-local.json). Captured roots: reference **760.0 × 148.0px**; local **720.0 × 548.0px**.

**Data / demo state:** Reference snapshot was taken at the beginning: one running orchestrator. Local already has seven agents and three expanded parent toggles. This cannot support a claim that the reference lacks children or that the 148px/548px height difference is a design defect.

**Presentation / controls / next check:** Both roots are flat and use the same 13px/20px typography. Use the separate Tree live-state review for multi-agent geometry. Initial baseline still cannot certify dynamic spawn/removal, folding, waiting/error details, motion or arbitrary input data.

## 36. Approval Gates

[Reference capture](live/catalog/approval-gates-reference.json) · [Local capture](live/catalog/approval-gates-local.json). Captured roots: reference **720.0 × 564.5px**; local **680.0 × 408.5px**.

**Data / demo state:** Reference shows a queued approval deck (two waiting, one decided), an email request, and an approved migration. Local shows a different single action flow.

**Presentation / controls / next check:** Reference has Full context, Ask for changes and previous/next request controls absent from local baseline; local substitutes Edit first. Flat 720px reference layout differs from the generic 680px local card. Verify deck navigation, context details and all decisions, not just Approve/Reject buttons.

## 37. Autonomy Dial

[Reference capture](live/catalog/autonomy-dial-reference.json) · [Local capture](live/catalog/autonomy-dial-local.json). Captured roots: reference **432.0 × 400.0px**; local **680.0 × 547.8px**.

**Data / demo state:** Reference has six actions including Update CRM records; local has five. The reference selector is a three-choice radio group (Always ask / If risky / Full auto); local uses an input labeled Autonomy level.

**Presentation / controls / next check:** Reference is a flat 432px panel; local a 680px bordered card. Action-lock controls have different accessible labels and no local SVG icons. Test arrow keys, pin/unpin and mode effects after implementing the reference control structure.

## 38. Away Summary

[Reference capture](live/catalog/away-summary-reference.json) · [Local capture](live/catalog/away-summary-local.json). Captured roots: reference **600.0 × 326.0px**; local **680.0 × 352.0px**.

**Data / demo state:** Recaptured reference is populated: 8 updates with 2 needs-you, 1 failed and 5 done; local has three summary rows. Reference includes a collapsed-summary trigger and Show 3 more.

**Presentation / controls / next check:** Reference root is a flat 600×326px region; local a 680×352px bordered card. Local baseline lacks the reference expansion/show-more controls. Decide/Retry/Open/Got it exist in differing arrangements; their state changes and dismissal behavior still need execution.

## 39. Cited Answer

[Reference capture](live/catalog/cited-answer-reference.json) · [Local capture](live/catalog/cited-answer-local.json). Captured roots: reference **440.0 × 422.0px**; local **680.0 × 423.8px**.

**Data / demo state:** Reference answers prompt-caching with three named sources and 12 pages read. Local answers a Lisbon question with two sources.

**Presentation / controls / next check:** Reference is a 440px, 10px-radius card; local 680px/14px. Reference citation buttons have descriptive source titles; local inline buttons are only [1]/[2] plus separate source rows. Follow up appears only in reference baseline. Citation hover, source preview/opening and keyboard behavior are unverified.

## 40. Collaboration Stream

[Reference capture](live/catalog/collaboration-stream-reference.json) · [Local capture](live/catalog/collaboration-stream-local.json). Captured roots: reference **756.0 × 636.0px**; local **680.0 × 668.3px**.

**Data / demo state:** Reference shows the pricing-launch conversation, agent routing, tool attachments and participant filtering. Local has a different short collaboration transcript and two markdown attachments.

**Presentation / controls / next check:** Reference includes Everyone/You/Researcher/Writer filters, reply-jump controls, a multiline composer and Name an agent; local baseline contains none of those and uses a single-line message input. SVG brand/tool artwork is absent locally. Test routing, mention selection, attachment opening and send behavior after aligning the structure.

## 41. Compact Breakdown

[Reference capture](live/catalog/compact-breakdown-reference.json) · [Local capture](live/catalog/compact-breakdown-local.json). Captured roots: reference **360.0 × 348.0px**; local **680.0 × 505.5px**.

**Data / demo state:** Reference offers 7d/30d/90d and changing revenue totals; local offers This month/Last month with a different channel ranking and $9,500 total.

**Presentation / controls / next check:** Reference root 360px and 10px corners versus local 680px and 14px. Radio-group period selection is replaced by ordinary pressed buttons. The total was captured during number animation, so do not treat its transient value as a calculation error. Reordering, period keyboard controls and value transitions remain untested.

## 42. Conflict Radar

[Reference capture](live/catalog/conflict-radar-reference.json) · [Local capture](live/catalog/conflict-radar-local.json). Captured roots: reference **560.0 × 464.0px**; local **680.0 × 587.7px**.

**Data / demo state:** Reference begins with three working coding agents and zero file/conflict/kept counts. Local starts two already-resolvable product-text disagreements.

**Presentation / controls / next check:** Reference is a flat 560px parallel-work view with status/model SVGs; local uses generic 680px framing and no SVG. Local choice buttons do not demonstrate the reference file-by-agent conflict matrix. Compare after conflicts actually arrive, then exercise per-conflict resolution and merge.

## 43. Context Map

[Reference capture](live/catalog/context-map-reference.json) · [Local capture](live/catalog/context-map-local.json). Captured roots: reference **680.0 × 342.0px**; local **720.0 × 381.0px**.

**Data / demo state:** Reference begins with System prompt/Tools/Memory only (30.4k of 200k), while local adds files and chat (66.5k total). The block area and free-space differences are partly this data/time mismatch.

**Presentation / controls / next check:** Reference baseline includes an agent/capacity selector; local instead has direct buttons for each treemap tile and no agent selector. Flat roots use 13px/20px on both, but token-area geometry, model selection, pinned details and compaction transitions need synchronized inputs.

## 44. Context Window

[Reference capture](live/catalog/context-window-reference.json) · [Local capture](live/catalog/context-window-local.json). Captured roots: reference **360.0 × 361.0px**; local **680.0 × 965.4px**.

**Data / demo state:** Reference shows claude-sonnet-5-5 at 175.6K/200K (88%) with three removable files. Local starts at 92% and models each token cell as a button.

**Presentation / controls / next check:** Reference 360px/10px compact card versus local 680px/14px and 965px tall. Reference has individual file removal and New chat; local only Remove files plus Compact conversation. The many cell tab stops are a keyboard-contract difference. Hover highlighting, per-file removal and compaction require actual comparison.

## 45. Cost Waterfall

[Reference capture](live/catalog/cost-waterfall-reference.json) · [Local capture](live/catalog/cost-waterfall-local.json). Captured roots: reference **756.0 × 207.0px**; local **680.0 × 469.5px**.

**Data / demo state:** Reference capture is the empty start of a live pricing report ($0 / zero tokens / waiting for first step); local already has four priced launch tasks.

**Presentation / controls / next check:** Both provide Cost/Tokens, but reference has a structured Step/In/Out/Cost/Tokens/Time header and 12px corners; local uses generic 14px framing and per-task buttons. Do not interpret the empty/reference height as missing rows. Wait for matching steps before comparing bar geometry, totals and row detail interaction.

## 46. Decision Card

[Reference capture](live/catalog/decision-card-reference.json) · [Local capture](live/catalog/decision-card-local.json). Captured roots: reference **600.0 × 288.0px**; local **680.0 × 426.8px**.

**Data / demo state:** Reference presents the first of three ingest-pipeline decisions with four queue options; local presents one migration decision with three choices.

**Presentation / controls / next check:** Reference options expose option roles and descriptive alternate-answer input; local choices are ordinary buttons and its input is unnamed in the control inventory. Previous/next controls occur only in reference. Reference capture also contains surrounding composer controls; exclude that demo shell when measuring component-only parity. Decision navigation and keyboard shortcuts remain untested.

## 47. Decision Tree

[Reference capture](live/catalog/decision-tree-reference.json) · [Local capture](live/catalog/decision-tree-local.json). Captured roots: reference **756.0 × 537.0px**; local **680.0 × 408.8px**.

**Data / demo state:** Reference is a branching incident response with three pending decisions, four first-level alternatives and nested follow-ups. Local has two migration strategy cards and a Choose this path button.

**Presentation / controls / next check:** Reference nested branch SVGs and per-node actions are absent from local baseline (16 SVGs versus zero). Flat 756px reference differs from the generic 680px card. This needs a tree structure, not only different demo copy; branch selection, follow-up confirmation and backtracking must be exercised.

## 48. Delegate Board

[Reference capture](live/catalog/delegate-board-reference.json) · [Local capture](live/catalog/delegate-board-local.json). Captured roots: reference **756.0 × 422.5px**; local **680.0 × 438.1px**.

**Data / demo state:** Reference has five unassigned tasks plus occupied agent cards and an Auto switch. Local has three tasks each using a native Assign select and an unlabeled input.

**Presentation / controls / next check:** The task-to-agent board and interaction surface differ materially. Reference is flat with 21 SVG marks; local is a generic card with no SVG. A select provides assignment functionality but does not reproduce the drag/keyboard pickup or auto-assignment experience. Real drag and keyboard movement are still untested.

## 49. Experiment Card

[Reference capture](live/catalog/experiment-card-reference.json) · [Local capture](live/catalog/experiment-card-local.json). Captured roots: reference **340.0 × 64.0px**; local **680.0 × 516.9px**.

**Data / demo state:** Reference starts as a collapsed 64px summary with three button-copy variants and Conversion/Revenue/Bounce metrics; local starts expanded with two onboarding-flow variants and Conversion/Retention/Revenue.

**Presentation / controls / next check:** Reference root is flat at 340px; local is a 680px bordered card. Reference uses radio roles for metrics and candidates; local ordinary buttons. Hidden reference controls appear in the DOM inventory, so their presence does not mean the collapsed panel is visually open. Test expansion, metric change and winner selection at matching states.

## 50. Fallback Chain

[Reference capture](live/catalog/fallback-chain-reference.json) · [Local capture](live/catalog/fallback-chain-local.json). Captured roots: reference **740.0 × 352.0px**; local **680.0 × 585.9px**.

**Data / demo state:** Reference begins Waiting on a HubSpot ticket routed through openrouter/auto; local already shows Provider A/B failures and Provider C success with a Replay request button.

**Presentation / controls / next check:** Reference has 16 SVGs for the request/model/response flow; local has none and presents a text list in a large bordered card. The starting status difference alone is timing/data, but missing flow geometry/provider marks is structural. Capture live failure and success phases before assessing animated branch routing.

## 51. Fan-out Grid

[Reference capture](live/catalog/fan-out-grid-reference.json) · [Local capture](live/catalog/fan-out-grid-local.json). Captured roots: reference **756.0 × 190.0px**; local **680.0 × 655.2px**.

**Data / demo state:** Reference starts enriching 240 leads with 16 running and four status-count filter buttons. Local exposes individual lead buttons plus Retry failed and Advance demo.

**Presentation / controls / next check:** Reference is a flat 756×190px dense view; local a 680×655px generic card. Different item counts and capture time affect height, but reference status filters are absent in the local baseline. Inspect task-hover details, filtering, retry and progress updates on matching data.

## 52. Integration Picker

[Reference capture](live/catalog/integration-picker-reference.json) · [Local capture](live/catalog/integration-picker-local.json). Captured roots: reference **660.0 × 444.0px**; local **680.0 × 492.0px**.

**Data / demo state:** Reference lists ten apps divided into Connected and Available, initially focused on Linear. Local has five apps and begins on Notion.

**Presentation / controls / next check:** Reference uses a labeled search combobox, option roles, a connection switch, Back and Explore integration. Local uses an unnamed input, ordinary initial-letter app buttons and Disconnect. Eighteen reference SVGs versus zero locally confirms missing logo artwork. Search keyboard navigation and details/connect states need actual execution.

## 53. Integration Settings

[Reference capture](live/catalog/integration-settings-reference.json) · [Local capture](live/catalog/integration-settings-local.json). Captured roots: reference **560.0 × 402.9px**; local **680.0 × 433.2px**.

**Data / demo state:** Recaptured reference is Shopify store settings with count 128, connected date, a new-key action, site domain and Berlin time zone. Local is a different integration form with an editable secret/show-key flow and Ulaanbaatar default.

**Presentation / controls / next check:** Reference 560px/10px-radius card has Generate a new API key, a custom time-zone button and Discard/Save. Local 680px/14px card has native select, Show key and Save changes but no Discard in baseline. Test unsaved-change handling, validation, generation and discard rather than treating two forms as equivalent.

## 54. Judge Bracket

[Reference capture](live/catalog/judge-bracket-reference.json) · [Local capture](live/catalog/judge-bracket-local.json). Captured roots: reference **680.0 × 643.0px**; local **680.0 × 320.2px**.

**Data / demo state:** Reference shows eight technical solutions in four quarterfinals, two semifinals and one final. Local shows one semifinal between two welcome-email drafts with Advance buttons.

**Presentation / controls / next check:** Both roots are 680px wide, so the 643px reference versus 320px local height is not merely host width. Reference has match buttons and SVG bracket artwork; local no SVG. The full tournament topology is not represented by the local baseline; match comparison dialogs, judge progression and winner-path animation remain unverified.

## 55. KPI Chart

[Reference capture](live/catalog/kpi-chart-reference.json) · [Local capture](live/catalog/kpi-chart-local.json). Captured roots: reference **440.0 × 292.5px**; local **680.0 × 443.6px**.

**Data / demo state:** Reference is daily revenue across five channels over Mar 3–9, with a total/delta and multi-series tooltip. Local presents 12 monthly revenue targets and only Organic/Paid ads controls.

**Presentation / controls / next check:** Reference compact card is 440px with 10px corners; local is 680px with 14px corners. Both contain an SVG, which does not establish equivalent chart geometry. Axis scale, daily stacked series, tooltip rows, keyboard chart inspection and responsive labels need matched data and interactions.
