/**
 * Second Brain app screens — one screen library for inai.sh, social and Journal.
 * A glass window (CSS backdrop-filter) holding six screens built from Thinking State
 * components. Data comes in as props (ScreenData); `acmeDemo` is the made-up ACME case.
 *
 *   <AppScreen screen="chat" theme="day" variant="tabs" data={acmeDemo} />
 *
 * `still` freezes motion (MotionProvider paused + no CSS animation) for screenshots.
 */
import * as React from "react";
import { type AppShellView } from "./app-shell";
import type { ScreenData } from "./acme";
export type ScreenKey = "inbox" | "note" | "project" | "chat" | "memory" | "team";
export type ScreenTheme = "day" | "night";
export type WindowVariant = "tabs" | "sidebar";
export type AppScreenLabels = Record<ScreenKey, string> & {
    brand: string;
    search: string;
    next: string;
};
export declare const appScreenLabelsMn: AppScreenLabels;
export declare const SCREENS: ScreenKey[];
export type AppWindowProps = {
    screen: ScreenKey;
    variant?: WindowVariant;
    labels?: AppScreenLabels;
    counts?: Partial<Record<ScreenKey, number>>;
    onSelect?: (k: ScreenKey) => void;
    children: React.ReactNode;
};
/** AppScreen keys ↔ AppShell places (screens.20: the six tabs are views of the one shell). */
export declare const SCREEN_VIEW: Record<ScreenKey, AppShellView>;
/**
 * The window = AppShell (screens.20, CONTEXT v15): the one Second Brain app with the PARA + GTD
 * menu and ⌘K ask. Kept under its old name for callers; `variant` no longer changes anything.
 */
export declare function AppWindow({ screen, company, counts, onSelect, children }: AppWindowProps & {
    company?: string;
}): React.JSX.Element;
export declare function InboxScreen({ data, labels }: {
    data: ScreenData;
    labels?: AppScreenLabels;
}): React.JSX.Element;
export declare function NoteScreen({ data }: {
    data: ScreenData;
}): React.JSX.Element;
export declare function ProjectScreen({ data, labels }: {
    data: ScreenData;
    labels?: AppScreenLabels;
}): React.JSX.Element;
export declare function ChatScreen({ data }: {
    data: ScreenData;
}): React.JSX.Element;
export declare function MemoryScreen({ data }: {
    data: ScreenData;
}): React.JSX.Element;
export declare function TeamScreen({ data }: {
    data: ScreenData;
}): React.JSX.Element;
export type AppScreenProps = {
    screen: ScreenKey;
    data: ScreenData;
    theme?: ScreenTheme;
    variant?: WindowVariant;
    /** Freeze motion for screenshots. */
    still?: boolean;
    labels?: AppScreenLabels;
    onSelect?: (k: ScreenKey) => void;
    className?: string;
};
/** One screen in its glass window on a themed stage. */
export declare function AppScreen({ screen, data, theme, variant, still, labels, onSelect, className }: AppScreenProps): React.JSX.Element;
