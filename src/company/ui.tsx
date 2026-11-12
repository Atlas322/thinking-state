import * as React from "react";
import { modelLines, type Actor, type ModelField } from "./types";

/** Two-letter initials for any script (Mongolian "Ч.Хонгорзул" → "ЧХ"). */
export const initials = (name: string) =>
  name.replace(/[^\p{L}\p{N}\s.]/gu, "").trim().split(/[\s.]+/).filter(Boolean).map((w) => w.charAt(0)).join("").slice(0, 2).toUpperCase() || "?";

export const phaseTone = { done: "green", active: "blue", blocked: "amber", next: "gray" } as const;
export const phaseLabel = { done: "Дууссан", active: "Явж байна", blocked: "Хүлээгдэж байна", next: "Төлөвлөж буй" } as const;

/** Round initials for people, a rounded square with ✦ for agents. */
export function Avatar({ actor, size = 22 }: { actor: Pick<Actor, "name" | "kind">; size?: number }) {
  return (
    <span className={`cv-ava is-${actor.kind}`} style={{ "--s": `${size}px` } as React.CSSProperties} aria-hidden="true">
      {actor.kind === "agent" ? "✦" : initials(actor.name)}
    </span>
  );
}

/** A model field as text, a list, or streams with share bars; «Бөглөөгүй» when empty. */
export function Lines({ f, empty = "Бөглөөгүй" }: { f: ModelField | null | undefined; empty?: string }) {
  const lines = modelLines(f);
  if (!lines.length) return <p className="cv-model-text cv-none">{empty}</p>;
  if (lines.length === 1 && lines[0].share == null) return <p className="cv-model-text">{lines[0].text}</p>;
  return (
    <ul className="cv-model-list">
      {lines.map((l, i) => (
        <li key={l.text + i} style={{ "--i": i } as React.CSSProperties}>
          <span>{l.text}</span>
          {l.share != null && (
            <span className="cv-share">
              <span className="cv-share-bar" aria-hidden="true">
                <span style={{ width: `${Math.round(Math.max(0, Math.min(1, l.share)) * 100)}%` }} />
              </span>
              <span className="cv-share-n">{Math.round(l.share * 100)}%</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
