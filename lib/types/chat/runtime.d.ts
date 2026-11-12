/**
 * The small script that ships inside a chat widget's one-file HTML export.
 * React renders the widget once to static markup; this script gives that
 * markup its behaviour back, using only data attributes the widgets render:
 *
 *   [data-cw-root]            widget root; its parent gets .dark from prefers-color-scheme
 *                             (unless data-cw-theme="light|dark" pins it)
 *   [data-cw-count]           number counts up from 0 (skipped on reduced motion)
 *   [data-cw-view-btn=v]      view switch inside [data-cw-views]; shows the
 *                             matching [data-cw-view-panel=v]
 *   [data-cw-toggle]          button with aria-controls; flips aria-expanded
 *                             and the target's hidden; swaps [data-cw-label].
 *                             With a value (a class name) it toggles that
 *                             class on the closest [data-cw-scope] and makes
 *                             the target inert instead.
 *   [data-cw-scope-btn=v]     All / Mine switch: sets data-scope=v on the
 *                             widget root; CSS hides [data-cw-other] under "mine"
 *   [data-cw-choose=label]    picks an option in its [data-cw-item]
 *   [data-cw-undo]            clears that pick
 *   [data-cw-prompt=text]     sends text back to the chat via window.sendPrompt
 *                             when the host provides it
 *
 * Keep it dependency-free and ES2017: it is serialised with toString().
 */
export declare function chatRuntime(): void;
export declare const chatRuntimeSource: string;
