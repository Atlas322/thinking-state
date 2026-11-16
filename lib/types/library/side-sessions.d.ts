import * as React from "react";
/**
 * Side Sessions — the panel beside a chat that lists the sessions this one
 * started, by state: Needs you, Running, Idle, Done. A finished session's
 * report is not proof, so each Done row carries the close-out chain
 * «check → update → archive»; a row can be archived only once checked.
 * Thinking State original; a visible chain-of-thought action.
 *
 * Scenario (demo, no props): a running session finishes, gets checked,
 * updated and archived. Motion is off under prefers-reduced-motion.
 */
export type SideSessionState = "needs" | "running" | "idle" | "done";
export type SideSessionStep = "check" | "update" | "archive";
export type SideSession = {
    id: string;
    title: string;
    state: SideSessionState;
    /** One line: its latest report, or what it waits on. */
    line?: string;
    branch?: string;
    pr?: number;
    /** Close-out steps already taken (Done rows). */
    steps?: SideSessionStep[];
};
export type SideSessionsLabels = {
    title: string;
    needs: string;
    running: string;
    idle: string;
    done: string;
    check: string;
    update: string;
    archive: string;
    archived: string;
    empty: string;
};
export type SideSessionsProps = {
    sessions?: SideSession[];
    onOpen?: (s: SideSession) => void;
    onStep?: (s: SideSession, step: SideSessionStep) => void;
    labels?: Partial<SideSessionsLabels>;
    className?: string;
};
export declare const sideSessionsDemo: {
    sessions: SideSession[];
};
export declare function SideSessions({ sessions: sessionsProp, onOpen, onStep, labels: labelsProp, className }: SideSessionsProps): React.JSX.Element;
export default SideSessions;
