> **Current update (2026-11-09):** Browser access now works. All 90 components have paired initial desktop DOM/style/SVG captures and per-component findings; Graph, Inbox, Tree and Handoff received detailed partial corrections. 193 tests, 114 copy compilations and build pass. Full 90-component interaction/visual parity is still incomplete; none is newly marked matched. See [live checkpoint](review/LIVE_REVIEW_2026-11-09.md). Statements below about blocked browser access describe the earlier session.

# affectUI architecture audit

This audit distinguishes verified component source from website bootstrap hints and public Pro documentation. It does not treat a screenshot, a registry command, or a passing render test as evidence of the underlying implementation.

## Verified source

Reference: [flohoeller/affectui at d690056](https://github.com/flohoeller/affectui/tree/d690056c08395f7d1a00d26cd4f5144d2b609386).

A TypeScript AST scan of all **46 component source files** (23 components, Clean and Classic) found exactly one external import module: **`react`**, used by all 46 files. These files contain no imports of shadcn/ui components, Radix, Tailwind helpers, or animation libraries.

The [upstream README](https://github.com/flohoeller/affectui/blob/d690056c08395f7d1a00d26cd4f5144d2b609386/README.md#install) confirms that shadcn is the **installation/registry interface**. The CLI copies a standalone TSX source file into the consuming project. That does not make the copied component an implementation built on shadcn/ui primitives.

Examples verified directly in source:

- [Checkbox](https://github.com/flohoeller/affectui/blob/d690056c08395f7d1a00d26cd4f5144d2b609386/components/checkbox-clean.tsx): native checkbox input, custom SVG tick/dash, React hooks, scoped CSS in a style element. React 19 style precedence deduplicates the CSS.
- [Select](https://github.com/flohoeller/affectui/blob/d690056c08395f7d1a00d26cd4f5144d2b609386/components/select-clean.tsx): custom listbox behavior, keyboard handling and positioning, with scoped CSS variables and keyframe animations.
- [Segmented Control](https://github.com/flohoeller/affectui/blob/d690056c08395f7d1a00d26cd4f5144d2b609386/components/segmented-control-clean.tsx): its own measurements, state and animated indicator. No shared shadcn dependency.

Representative design values in the Clean source include Inter at 13px / 20px, translucent neutral colors, fine shadow edges, and per-component easing variables. Matching the library requires preserving those concrete values and behaviors; adopting a framework alone would not reproduce them.

## Website application: limited evidence

The previously retrieved component-index HTML loads chunks named `react`, `jsx-runtime`, `rolldown-runtime`, `HugeiconsIcon`, `supabase`, and a site stylesheet. Its theme bootstrap explicitly mentions the `.dark` shadcn convention.

These are bootstrap observations, not a complete dependency inventory. They do not prove that the website shell uses or does not use shadcn/ui, and do not reveal the internals of Pro components. No later site bundles were fetched or inspected. A saved browser permission blocked further access to affectui.com during the review.

## Current recreation gaps

The 23 MIT components preserve the actual implementation, with appended local demos. The other 67 were independently implemented from public descriptions. The first pass generalized too much and is **not a faithful replacement for the original Pro collection**.

[REFERENCE_API_AUDIT.csv](./REFERENCE_API_AUDIT.csv) compares public prop names with each named component's destructured parameters. The scan excludes documented per-item fields and splits grouped prop names. **55 of the 67** still have at least one unmatched name. This is a name-level diagnostic, not an API or design certification. Nested data shapes, callback signatures, visual states and motion need separate checks.

The subsequent pass rebuilt **Chat Composer, Agent Tree, Agent Handoff, Context Map, Trace Waterfall, Agent Graph, Approval Card, Agent Ledger, Dropzone and Prompt Library**. These ten now expose the documented root prop names. Chat Composer uses the documented two-argument `onSend(message, details)` contract and includes model/folder/app selectors, approval loading/failure, and simulated dictation. The other rebuilt components have focused behavioral tests; details are in [COMPONENT_REVIEW.md](./COMPONENT_REVIEW.md).

A subsequent delegated review used only already-cached references. Agent Inbox now accepts the documented optional task fields, millisecond timestamps/durations and header action, and follows the documented callback/fallback ownership rules. Its legacy `elapsedSeconds` input remains supported. This closes the remaining root prop-name gap for that component; it does not establish exact motion or visual parity.

The 46 imported Clean/Classic implementations were compared with the pinned upstream source using normalized TypeScript ASTs, excluding appended demos and formatting-only differences. All 46 matched; [MIT_SOURCE_VERIFICATION.json](./MIT_SOURCE_VERIFICATION.json) records the evidence. This does not certify that the local example content is identical to the website's examples.

The user's Agent Graph screenshots exposed a concrete failure of the description-only approach: the initial orbit rebuild still had circular letter avatars and sweeping curved links, while the reference has branded rounded-square nodes and orthogonal links with rounded corners. The implementation was revised from those screenshots. The resulting local render has **not yet been captured or compared** because browser access is blocked. It must not be called visually matched.

## Required fidelity work

For each independent component, compare the actual public preview and record its geometry, typography, colors, states, menus, keyboard behavior, callbacks, transitions and responsive changes. Then implement and verify against that record. Keep imported MIT components intact and change their demo wrappers only when necessary.

The completed render/copy/build checks prove that the files work in isolation. They do not establish visual or behavioral parity with affectUI. Browser access is currently denied for both `https://www.affectui.com` and `http://127.0.0.1:5173`. Further screenshot comparison requires access to those origins; paid source access is neither assumed nor bypassed.
