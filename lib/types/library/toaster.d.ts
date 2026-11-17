import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type ToastId = string;
export type ToastType = "default" | "success" | "error" | "info" | "loading";
export type ToastOptions = {
    id?: ToastId;
    description?: React.ReactNode;
    action?: {
        label: string;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    };
    duration?: number;
    icon?: React.ReactNode;
    /** Only the Toaster with this id shows the toast. */
    toaster?: string;
    onDismiss?: (id: ToastId) => void;
};
export type ToastNotice = ToastOptions & {
    id: ToastId;
    title: React.ReactNode;
    type: ToastType;
    /** Bumped on every update so timers restart and text crossfades. */
    version: number;
};
type Message<T> = React.ReactNode | {
    title: React.ReactNode;
    description?: React.ReactNode;
} | ((value: T) => React.ReactNode | {
    title: React.ReactNode;
    description?: React.ReactNode;
});
type ToastFn = ((title: React.ReactNode, options?: ToastOptions) => ToastId) & {
    success: (title: React.ReactNode, options?: ToastOptions) => ToastId;
    error: (title: React.ReactNode, options?: ToastOptions) => ToastId;
    info: (title: React.ReactNode, options?: ToastOptions) => ToastId;
    loading: (title: React.ReactNode, options?: ToastOptions) => ToastId;
    promise: <T>(promise: Promise<T> | (() => Promise<T>), messages: {
        loading: Message<void>;
        success: Message<T>;
        error: Message<unknown>;
    }, options?: ToastOptions) => Promise<T>;
    dismiss: (id?: ToastId) => void;
};
export declare const toast: ToastFn;
/** @deprecated Use toast.dismiss(id). */
export declare const dismissToast: (id: string) => void;
export type ToasterProps = {
    position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
    inline?: boolean;
    id?: string;
    duration?: number;
    visibleToasts?: number;
    expand?: boolean;
    offset?: number;
    gap?: number;
    hotkey?: string | null;
    hairline?: boolean;
    closeButton?: boolean;
    label?: string;
    className?: string;
};
export declare function Toaster({ position, inline, id, duration, visibleToasts, expand, offset, gap, hotkey, hairline, closeButton, label, className, }: ToasterProps): React.JSX.Element;
/** Demo: a file card whose actions send toasts into an inline stack. */
export default function ToasterDemo(): React.JSX.Element;
export {};
