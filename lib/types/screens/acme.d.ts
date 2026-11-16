/**
 * ACME — a made-up company for the Second Brain app screens (inai.sh, social, Journal).
 * Fictional case only: no real people, no client data. Roles and agents stand in for names.
 * Every figure (62%, 8–11%, 58% …) is a demo number, not real data.
 */
import type { PlanStep } from "../library/agent-plan";
import type { CitedSegment, CitedSource } from "../library/cited-answer";
import type { Decision } from "../library/decision-card";
import type { RunningTask } from "../library/running-now";
import type { Memory } from "../library/memory-panel";
import type { SessionBoardGroup, SessionBoardProject, SessionBoardSession } from "../library/session-board";
export type CaptureKind = "link" | "voice" | "idea" | "file" | "mail";
export type InboxItem = {
    id: string;
    kind: CaptureKind;
    title: string;
    /** Where it came from and when, e.g. «Утаснаас · 08:40». */
    meta: string;
    /** Where the agent suggests it goes (PARA). */
    suggest: string;
    /** A concrete next physical action, shown as the orange chip. */
    next?: string;
    processed?: boolean;
};
export type NoteLink = {
    id: string;
    title: string;
    kind: "decision" | "knowledge" | "project" | "source";
    why: string;
};
export type AtomNote = {
    title: string;
    kind: string;
    date: string;
    body: string[];
    source: string;
    tags: string[];
    links: NoteLink[];
    backlinks: number;
};
export type ProjectTask = {
    id: string;
    title: string;
    status: "todo" | "doing" | "waiting" | "done";
    owner: string;
    due?: string;
};
export type AppProject = {
    name: string;
    area: string;
    why: string;
    done: number;
    total: number;
    next: {
        title: string;
        context: string;
        owner: string;
    };
    tasks: ProjectTask[];
    truth: string[];
};
export type ScreenData = {
    company: string;
    inbox: InboxItem[];
    note: AtomNote;
    project: AppProject;
    chat: {
        question: string;
        plan: PlanStep[];
        segments: CitedSegment[];
        sources: CitedSource[];
        decisions: Decision[];
        running: RunningTask[];
    };
    memories: Memory[];
    memoryCategories: string[];
    team: {
        project: SessionBoardProject;
        groups: SessionBoardGroup[];
        sessions: SessionBoardSession[];
        me: string;
    };
};
export declare const acmeDemo: ScreenData;
