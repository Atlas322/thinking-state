import { type ReactNode } from "react";
export type ProfileMenuItem = {
    id: string;
    label: string;
    icon?: ReactNode;
    /** Small pill on the right, e.g. "New" */
    badge?: string;
    onSelect?: () => void;
};
export type ProfileSetup = {
    /** Steps finished so far */
    done: number;
    total: number;
    /** The next open step, shown as a shortcut under the bar */
    next?: string;
    onContinue?: () => void;
};
export type ProfileMenuProps = {
    name: string;
    email: string;
    /** Replaces the default avatar */
    avatar?: ReactNode;
    items?: ProfileMenuItem[];
    /** Profile setup progress under the actions – leave empty to hide */
    setup?: ProfileSetup;
    className?: string;
};
export declare function ProfileMenu({ name, email, avatar, items, setup, className, }: ProfileMenuProps): React.JSX.Element;
export declare const SettingsIcon: () => React.JSX.Element;
export declare const LanguageIcon: () => React.JSX.Element;
export declare const DocsIcon: () => React.JSX.Element;
export declare const AppsIcon: () => React.JSX.Element;
export declare const LogoutIcon: () => React.JSX.Element;
import * as React from "react";
/** Working example; use the named ProfileMenu export in your application. */
export default function Demo(): React.JSX.Element;
