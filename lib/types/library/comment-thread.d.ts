import { type ReactNode } from "react";
export type ThreadAuthor = {
    name: string;
    avatar?: ReactNode | string;
    assistant?: boolean;
};
export type ThreadMessage = {
    id: string;
    author: ThreadAuthor;
    createdAt: Date | number;
    text: string;
    /** Assistant replies: a short status line that folds open to show these details */
    status?: string;
    details?: string[];
};
export type CommentThreadProps = {
    title?: string;
    messages: ThreadMessage[];
    currentUser: ThreadAuthor;
    /** The assistant that answers – used for the thinking state */
    assistant?: ThreadAuthor;
    /**
     * Called with every new reply. Return a message (or a promise of one) to let the assistant answer;
     * return nothing to just post the reply.
     */
    onReply?: (text: string) => ThreadMessage | Promise<ThreadMessage | void> | void;
    onClose?: () => void;
    className?: string;
};
export declare function CommentThread({ title, messages: initial, currentUser, assistant, onReply, onClose, className, }: CommentThreadProps): import("react").JSX.Element;
/** A simple assistant mark: a full circle with a blue-to-violet gradient – pass your own logo as `avatar` instead */
export declare function AssistantMark(): import("react").JSX.Element;
export default function Demo(): import("react").JSX.Element;
