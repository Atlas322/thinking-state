import type { ComponentType } from "react";
/**
 * Chat widgets: catalog components an agent shows directly in its chat.
 * Each one takes plain JSON props, so the same object drives the catalog
 * preview, the one-file HTML export («Use in chat») and the CLI
 * (`npm run chat:html -- <slug> data.json`).
 */
export type ChatWidget = {
    slug: string;
    load: () => Promise<{
        Component: ComponentType<Record<string, unknown>>;
        demo: Record<string, unknown>;
    }>;
    /** Extra CSS for static exports, e.g. to hide controls that need React. */
    staticCss?: string;
    /** Props forced in static exports, where React state is not running. */
    staticProps?: (props: Record<string, unknown>) => Record<string, unknown>;
};
export declare const chatWidgets: ChatWidget[];
export declare const chatWidgetFor: (slug: string) => ChatWidget | undefined;
