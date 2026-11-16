export type ChatHtmlOptions = {
    /** "auto" follows prefers-color-scheme; "light" or "dark" pins it. */
    theme?: "auto" | "light" | "dark";
    /** Fragment (no doctype/html/head/body) for hosts that inject markup. */
    fragment?: boolean;
    title?: string;
};
/**
 * Renders a chat widget to one self-contained HTML string: static markup,
 * the widget's own CSS, the JSON it was rendered from and a ~3 KB script
 * that restores theme, count-up, view switch, toggles and chat actions.
 */
export declare function renderChatHtml(slug: string, props?: Record<string, unknown>, options?: ChatHtmlOptions): Promise<string>;
