import * as React from "react";
/** Independent implementation of the documented public behavior. */
export type ChatModel = {
    id: string;
    name: string;
    description?: string;
    logo?: React.ReactNode;
};
export type ChatApp = {
    id: string;
    name: string;
    logo?: React.ReactNode;
};
export type ChatComposerProps = {
    placeholder?: string;
    models?: ChatModel[];
    loadMs?: number;
    dictation?: string;
    onSend?: (message: string, details: {
        model: string;
    }) => void;
    onModelChange?: (model: ChatModel) => void;
    onAttach?: () => void;
    onRequestApproval?: () => void | Promise<void>;
    folders?: string[];
    folder?: string;
    onFolderChange?: (folder: string | null) => void;
    apps?: ChatApp[];
    connectedApps?: string[];
    onAppsChange?: (connected: string[]) => void;
    className?: string;
};
export declare function ChatComposer({ placeholder, models, loadMs, dictation, onSend, onModelChange, onAttach, onRequestApproval, folders, folder, onFolderChange, apps, connectedApps, onAppsChange, className, }: ChatComposerProps): React.JSX.Element;
export default ChatComposer;
