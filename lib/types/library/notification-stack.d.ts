export type NoticePattern = "orbit" | "grid" | "rays";
export type Notice = {
    id: string;
    /** Small label in the pill, e.g. "Notice" */
    badge?: string;
    title: string;
    text: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
        external?: boolean;
    };
    /** Line art in the top-right corner */
    pattern?: NoticePattern;
};
export type NotificationStackProps = {
    notices: Notice[];
    /** Called after a notice was dismissed */
    onDismiss?: (notice: Notice) => void;
    className?: string;
};
export declare function NotificationStack({ notices, onDismiss, className, }: NotificationStackProps): import("react").JSX.Element;
/** Working example; use the named NotificationStack export in your application. */
export default function Demo(): import("react").JSX.Element;
