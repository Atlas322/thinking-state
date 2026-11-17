/**
 * EntityMention (2026-11-17, screens.21): an @mention inside an answer — a person, a branch, a
 * channel — with a small card on hover or keyboard focus, and on tap on a phone. The card follows
 * SourcePreview's popover (same surface, line, radius, elevation, and the bottom sheet under
 * 480 px), but is built from spans so it sits inside a sentence (<p>) as valid HTML.
 * Card: name, type, 2–3 lines, and the brain note it comes from.
 *
 *   <EntityMention mention={{ name: "Салбар 07", type: "салбар", lines: ["Менежер: …"], sourceNote: "Салбарын бүртгэл" }} />
 */
import * as React from "react";
export type Mention = {
    name: string;
    /** What it is, e.g. «ажилтан», «салбар», «борлуулалтын суваг». */
    type: string;
    /** Two or three short lines: role, last action, state. */
    lines?: string[];
    /** The brain note it comes from. */
    sourceNote?: string;
};
export type EntityMentionProps = {
    mention: Mention;
    onOpenNote?: (m: Mention) => void;
    className?: string;
};
export declare function EntityMention({ mention, onOpenNote, className }: Partial<EntityMentionProps>): React.JSX.Element;
/** Splits text at "@Name" for the given mentions (longest names first) and renders the chips. */
export declare function withMentions(text: string, mentions: Mention[] | undefined, onOpenNote?: (m: Mention) => void): React.ReactNode;
/** ac.me demo: a branch and its manager (made-up company and names). */
export declare const entityMentionDemo: EntityMentionProps & {
    mention: Mention;
};
/** Catalog preview: a sentence with one mention. */
export default function EntityMentionDemo(): React.JSX.Element;
