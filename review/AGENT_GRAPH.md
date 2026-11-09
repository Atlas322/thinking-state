# Agent Graph live follow-up — 2026-11-09

Browser access succeeded in this session. The prior screenshot-only sections below are historical.

Live reference/local evidence is in `live/agent-graph-*.json`; all states have explicit viewport, DOM attributes, computed CSS and geometry. At640px, the reference stage is416px plus26px legend; lead center320/208, researcher398/150.7, analyst398/265.3, coder242/265.3, writer242/150.7. The revised demo uses these measured desktop positions. Reference narrow334px stage is600px; local324px labels were checked and none crossed the panel bounds.

Reference and local node cards were opened; Escape restored node focus. Local Enter and narrow Space activation were also checked. Card close receives focus. The current card follows the observed28px icon,13/16px name,11/14px detail,24px close control, latest4 calls and cost footer. The demo's call labels/content remain different.

The old heat-based stroke was wrong for Clean: the live reference uses a constant1.5px stroke regardless of heat. Routes now share8px ports (6px narrow), use one rounded bend where possible, and pulse answers follow the same route backwards. A regression test exposed a crash when an in-flight call's inferred edge disappeared; this is now guarded. Straight/bent port and orthogonality tests also pass. Routing remains best-effort for blocked/collinear paths and is not certified collision-free.

Measured tiles are56/46/34px desktop and42/34/28px narrow, with radius27% of tile size. Typography, panel/node colors and shadows, header and legend were corrected. The source API still retains heatWindow for compatibility. Reference observed default height differs from the public text: desktop stage is0.6×width+32px within observed range, narrow stage600px; this implementation follows the observed samples, but unseen breakpoints require validation.

**Still incomplete:** dynamic six/seven-tool sequence, exact SVG brands and UI badges, pulse tail shape on bends, shine/ripple/exit transitions, per-frame DOM performance, full equal-state responsive/theme/Classic matrix. The screenshot pair has different clock, tool-count and focus states and is not a visual match result. No match certification is made.

---

# Agent Graph: screenshot-based correction

The user supplied both screenshots below. The local screenshot is **before** the latest correction; it is retained as evidence of the discrepancy, not as the final result.

| Observed discrepancy                         | Change in the current source                                                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Circular letter avatars                      | Rounded-square node tiles, with embedded Claude, OpenAI, Gemini and tool SVG logos                                                 |
| 4 agents and different tools                 | Reference demo with Orchestrator, Writer, Researcher, Coder, Analyst; seven tools and You                                          |
| Different positions and label placement      | Reference-relative normalized positions; labels above the two top nodes; general graph still lays out arbitrary data automatically |
| Sweeping curved links                        | Horizontal/vertical connector segments with short rounded corners                                                                  |
| Strong blue links and dot-grid background    | Quiet neutral connectors and a flat canvas; blue/green/orange/red travelling call segments                                         |
| Header inside a bordered card, no tool count | Separate compact header with network icon, agents, tools, calls/min and summed cost                                                |
| “Live network” footer                        | Call / Answer / Needs you / Failed legend                                                                                          |
| Selecting a node invented extra calls        | Counts derive only from supplied call records                                                                                      |

The current file also handles selection dialogs, keyboard focus, missing nodes, call heat, reduced motion and offscreen/hidden animation pausing. API/state tests do not certify its visual appearance.

**Verification still required:** a screenshot of the revised local render, paired at the same width/theme/time with the reference. Current browser permissions block this capture. No pixel-identical claim is made. These supplied screenshots only establish the reference state shown; they do not establish all animation, popup or mobile states.

## Cached-reference follow-up

A separate local review corrected two source-level edge cases: pulse gradients now use each call's from/to coordinates (including vertical and reverse answers), and centered labels use the available space to both canvas edges. Five regression tests cover pulse direction, clock updates without replay, animation expiry, offscreen/reduced-motion behavior and label bounds at 320px/640px. These are logic/geometry checks, not browser screenshots. The gradient still spans a connection; the precise short tail around bends requires live comparison.

## User-supplied reference

![affectUI reference, cropped to the component](agent-graph-reference.png)

## User-supplied local render before correction

![Earlier local render; superseded by the current source](agent-graph-before.png)
