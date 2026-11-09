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

[REFERENCE_API_AUDIT.csv](./REFERENCE_API_AUDIT.csv) compares documented public prop names with each current named component's destructured parameters. **66 of the 67** have at least one unmatched reference prop name. This is an API compatibility diagnostic: a renamed prop can provide similar behavior, and matching names alone do not prove matching behavior. Nested data shapes, callback signatures, visual states and motion need separate checks.

For example, the current **Chat Composer** implements text input, attachments, a simple model selector and send. The public reference documents additional model configuration, voice/dictation states, approval loading and access states, folder selection, app connections, and related callbacks. Those are not covered by the current simplified component. Its callback shape also requires checking against the documented two-argument `onSend(message, details)` contract.

## Required fidelity work

For each independent component, compare the actual public preview and record its geometry, typography, colors, states, menus, keyboard behavior, callbacks, transitions and responsive changes. Then implement and verify against that record. Keep imported MIT components intact and change their demo wrappers only when necessary.

The completed render/copy/build checks prove that the files work in isolation. They do not establish visual or behavioral parity with affectUI. Further live comparison requires restoring browser access to the reference site; paid source access is neither assumed nor bypassed.
