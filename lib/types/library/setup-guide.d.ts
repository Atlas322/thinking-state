import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type SetupTask = {
    id: string;
    label: string;
    done?: boolean;
};
export type SetupGroup = {
    id: string;
    title: string;
    tasks: SetupTask[];
};
export type SetupGuideProps = {
    groups?: SetupGroup[];
    title?: string;
    onEdit?: () => void;
    onClose?: () => void;
    onChange?: (done: string[]) => void;
    className?: string;
};
export declare function SetupGuide({ groups, title, onEdit, onClose, onChange, className, }: SetupGuideProps): React.JSX.Element | null;
export default SetupGuide;
