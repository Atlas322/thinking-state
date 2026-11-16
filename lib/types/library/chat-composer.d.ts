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
    /** Host mode (Second Brain app, 2026-11-13): the host owns the text, files, menus and send. No approval button,
     * voice, folders or apps; the model picker shows only when `models` is passed. */
    host?: boolean;
    /** Controlled text (host mode). */
    value?: string;
    onValueChange?: (text: string, caret: number) => void;
    textareaRef?: React.Ref<HTMLTextAreaElement>;
    /** Extra props for the textarea (onKeyDown runs first; preventDefault skips the built-in Enter send). */
    textareaProps?: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange" | "ref">;
    /** Inside the card, above the field: attachment chips, mention chips, pop-up menus. */
    above?: React.ReactNode;
    /** Toolbar, after the attach button: e.g. a ModelPicker or run controls. */
    tools?: React.ReactNode;
    /** Send allowed (host mode: text or files). Default: text is not empty. */
    canSend?: boolean;
    /** Sending: the button spins and is disabled. */
    busy?: boolean;
    /** Files are being dragged over (highlight the card). */
    dragging?: boolean;
    disabled?: boolean;
    labels?: {
        field?: string;
        send?: string;
        attach?: string;
    };
};
export declare function ChatComposer({ placeholder, models: modelsProp, loadMs, dictation, onSend, onModelChange, onAttach, onRequestApproval, folders, folder, onFolderChange, apps, connectedApps, onAppsChange, className, host, value, onValueChange, textareaRef, textareaProps, above, tools, canSend, busy, dragging, disabled, labels, }: ChatComposerProps): React.JSX.Element;
export default ChatComposer;
