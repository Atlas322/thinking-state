import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type CommentAuthor = {
    name: string;
    avatar?: string;
    color?: string;
};
export type PanelComment = {
    id: string;
    author: CommentAuthor;
    /** Date, epoch ms, or a ready label like "2 мин өмнө". */
    createdAt: Date | number | string;
    text: string;
};
export type CommentsPanelProps = {
    comments?: PanelComment[];
    currentUser?: CommentAuthor;
    onRunEdit?: (comment: PanelComment) => Promise<void> | void;
    onAdd?: (comment: PanelComment) => void;
    onClose?: () => void;
    title?: string;
    className?: string;
};
export declare function CommentsPanel({ comments, currentUser, onRunEdit, onAdd, onClose, title, className, }: CommentsPanelProps): React.JSX.Element;
export default CommentsPanel;
