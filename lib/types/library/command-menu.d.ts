import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type Command = {
    id: string;
    label: string;
    hint?: string;
    /** Brand logo for tool actions. */
    logo?: React.ReactNode;
    /** Plain icon for everyday commands. */
    icon?: React.ReactNode;
    keys?: string[];
    keywords?: string[];
};
export type CommandGroup = {
    id: string;
    label: string;
    commands: Command[];
};
export type CommandMenuProps = {
    groups?: CommandGroup[];
    placeholder?: string;
    onRun?: (id: string, query?: string) => void;
    onClose?: () => void;
    autoFocus?: boolean;
    className?: string;
};
export declare function CommandMenu({ groups, placeholder, onRun, onClose, autoFocus, className, }: CommandMenuProps): React.JSX.Element;
export default CommandMenu;
