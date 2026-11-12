/**
 * One registry for every chat widget's data, in the spirit of the INAI
 * «Settings & Database» meta table: what each widget is for, which fields it
 * takes, and how those fields map to vault frontmatter and Notion properties.
 * Agents read it with `npm run chat:html -- --schema [slug]`.
 *
 * Shared conventions (all widgets):
 * - `owner` / `sharedWith` = vault `owner` / Notion Owner + Collabs. Every
 *   person has a full base; teams and companies only add sharing on top.
 * - `me` = the viewer. When set, an All / Mine switch shows only what `me`
 *   owns or is shared on (the Just.Notion «owner OR collaborator» view).
 * - `status`, `project`, `due` keep their vault names; statuses map onto each
 *   widget's own states (see `statusMap`).
 */
export type FieldSpec = {
    type: string;
    /** Vault frontmatter key, when the field comes from a note. */
    vault?: string;
    /** Notion property in the Just.Notion / INAI templates. */
    notion?: string;
    required?: boolean;
    note?: string;
};
export type WidgetSchema = {
    slug: string;
    name: string;
    /** Like INAI's «Feeds»: which board this widget stands in for. */
    feeds: string;
    role: "Report" | "Entity" | "Log";
    props: Record<string, FieldSpec>;
    items?: Record<string, Record<string, FieldSpec>>;
    statusMap?: Record<string, string[]>;
};
export declare const chatWidgetSchemas: WidgetSchema[];
export declare const schemaFor: (slug: string) => WidgetSchema | undefined;
