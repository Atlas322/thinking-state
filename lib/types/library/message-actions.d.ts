import { type ReactNode } from "react";
export type MessageActionKey = "copy" | "regenerate" | "feedback" | "speak";
export type FeedbackKind = "up" | "down";
export type MessageActionsProps = {
    /** The message text – copied to the clipboard by Copy and used to time Read aloud */
    text?: string;
    /** Which actions to show, in this order */
    actions?: MessageActionKey[];
    /** All versions of the message, or just how many there are. From 2 on the version switcher shows */
    versions?: number | string[];
    /** Controlled version (0-based index) */
    version?: number;
    /** Starting version when uncontrolled – defaults to the newest */
    defaultVersion?: number;
    /** Called with the version index picked in the switcher */
    onVersionChange?: (index: number) => void;
    /** Called after Copy, with `text` */
    onCopy?: (text?: string) => void;
    /** Called when Regenerate is pressed – add a version and the switcher jumps to it */
    onRegenerate?: () => void;
    /** Keeps the regenerate arrow spinning while a new version is written */
    regenerating?: boolean;
    /** "up" or "down" when a thumb is pressed, null when it is taken back, and "down" with a reason when the feedback row is sent */
    onFeedback?: (kind: FeedbackKind | null, reason?: string) => void;
    /** Quick reasons in the feedback row. «Бусад» opens a small text field */
    reasons?: string[];
    /** Called with true when Read aloud starts and false when it stops */
    onSpeak?: (playing: boolean) => void;
    /** Controlled playing state, e.g. tied to your speech player */
    speaking?: boolean;
    /** How long an uncontrolled read aloud plays, in ms – defaults to an estimate from `text` */
    speakDuration?: number;
    /** Faded until the message is hovered (default true). Put data-ui-message on the message wrapper */
    quiet?: boolean;
    /** Accessible name of the bar */
    label?: string;
    className?: string;
};
/**
 * The message itself, crossfading when `version` changes: the old text fades out underneath while the new one fades in,
 * and the block eases to its new height.
 */
export declare function MessageText({ version, children, className, }: {
    version: string | number;
    children: ReactNode;
    className?: string;
}): React.JSX.Element;
export declare function MessageActions({ text, actions: actionsProp, versions, version, defaultVersion, onVersionChange, onCopy, onRegenerate, regenerating, onFeedback, reasons, onSpeak, speaking, speakDuration, quiet, label, className, }: MessageActionsProps): React.JSX.Element;
import * as React from "react";
export default function Demo(): React.JSX.Element;
