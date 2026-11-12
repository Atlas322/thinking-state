import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type ProjectTask = {
    id: string;
    label: string;
    done?: boolean;
    assignee?: string;
};
export type ProjectTone = "red" | "amber" | "green" | "blue" | "violet" | "gray";
export type ProjectOption = {
    id: string;
    label: string;
    tone?: ProjectTone;
    icon?: React.ReactNode;
};
export type ProjectMember = {
    name: string;
    avatar?: string;
};
export type ProjectCardProps = {
    title?: string;
    tasks?: ProjectTask[];
    onTasksChange?: (tasks: ProjectTask[]) => void;
    status?: string;
    statuses?: ProjectOption[];
    onStatusChange?: (id: string) => void;
    due?: string;
    members?: ProjectMember[];
    action?: {
        label: string;
        onClick: () => void;
    };
    hint?: React.ReactNode;
    trigger?: "hover" | "click";
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
};
export declare function ProjectCard({ title, tasks: tasksProp, onTasksChange, status: statusProp, statuses, onStatusChange, due, members, action, hint, trigger, open: openProp, defaultOpen, onOpenChange, className, }: ProjectCardProps): React.JSX.Element;
export declare function Demo(): React.JSX.Element;
export default Demo;
