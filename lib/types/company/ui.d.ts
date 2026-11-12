import * as React from "react";
import { type Actor, type ModelField } from "./types";
/** Two-letter initials for any script (Mongolian "Ч.Хонгорзул" → "ЧХ"). */
export declare const initials: (name: string) => string;
export declare const phaseTone: {
    readonly done: "green";
    readonly active: "blue";
    readonly blocked: "amber";
    readonly next: "gray";
};
export declare const phaseLabel: {
    readonly done: "Дууссан";
    readonly active: "Явж байна";
    readonly blocked: "Хүлээгдэж байна";
    readonly next: "Төлөвлөж буй";
};
/** Round initials for people, a rounded square with ✦ for agents. */
export declare function Avatar({ actor, size }: {
    actor: Pick<Actor, "name" | "kind">;
    size?: number;
}): React.JSX.Element;
/** A model field as text, a list, or streams with share bars; «Бөглөөгүй» when empty. */
export declare function Lines({ f, empty }: {
    f: ModelField | null | undefined;
    empty?: string;
}): React.JSX.Element;
