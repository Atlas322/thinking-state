/**
 * Source Preview (Thinking State original, 2026-11-18) — a source chip that opens a file preview.
 * Chip: kind icon (document, calendar, message) or a brand logo, plus the title.
 * Popover: icon, title, kind, date, the quoted passage with the matching words marked, «Апп-д нээх».
 * Escape or a click outside closes it; focus returns to the chip. Radius = --ts-radius (6px fallback).
 */
import * as React from "react";

export type SourceKind = "document" | "calendar" | "message" | "decision" | "meeting" | "note" | "link" | "brand";
export type PreviewSource = {
  id: string;
  title: string;
  kind: SourceKind;
  /** Shown under the title, e.g. «Баримт · Drive». Defaults to the kind's label. */
  kindLabel?: string;
  date?: string;
  quote?: string;
  /** Words inside quote to mark. */
  highlight?: string;
  /** App the source lives in, e.g. "figma"; its mark shows when BRAND_MARK has it, else the kind icon. */
  brand?: string;
  /** Brand logo for kind="brand" (an <img> or <svg>); without it the document icon is shown. */
  logo?: React.ReactNode;
  brandName?: string;
};
export type SourcePreviewLabels = { open: string; close: string; kinds: Record<SourceKind, string> };
export const sourcePreviewLabelsMn: SourcePreviewLabels = {
  open: "Апп-д нээх",
  close: "Хаах",
  kinds: { document: "Баримт", calendar: "Календарь", message: "Мессеж", decision: "Шийдвэр", meeting: "Уулзалт", note: "Тэмдэглэл", link: "Холбоос", brand: "Апп" },
};
export type SourcePreviewProps = {
  source?: PreviewSource;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** «Апп-д нээх»; omitted, the button is hidden. */
  onOpenInApp?: (source: PreviewSource) => void;
  /** Popover side relative to the chip. */
  placement?: "bottom" | "top";
  labels?: Partial<SourcePreviewLabels>;
  className?: string;
};

// Demo data: ACME is a made-up company — 62% and every other figure here are demo numbers, not real data.
const demoSource: PreviewSource = {
  id: "retention",
  title: "Харилцагчийн хадгалалтын тайлан 2026",
  kind: "document",
  kindLabel: "Баримт · Судалгаа",
  date: "2026-11-02",
  quote: "Шинэ харилцагчдын 62% нь гурван сарын дотор багцаа ахиулсан. Ахиулалт ихэвчлэн хоёр дахь сард болдог.",
  highlight: "62% нь гурван сарын дотор",
};

/**
 * One icon per source kind. Shapes are copied from the Thinking State icon set (src/company/icons.tsx,
 * Lucide, ISC): file-text, calendar-days, message-circle, git-branch, users-round, pencil, link.
 * Stroke 1.5, currentColor — the tile and the theme give the colour.
 */
export const SOURCE_ICON: Record<Exclude<SourceKind, "brand">, React.ReactNode> = {
  document: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>,
  calendar: <><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></>,
  message: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  decision: <><path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></>,
  meeting: <><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></>,
  note: <><path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" /><path d="m15 5 4 4" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
};

/**
 * App logos for sources that live in an app (2026-11-17): the official marks from svgl.app
 * (https://svgl.app, MIT for the collection), unmodified — colour and shape as published — embedded as
 * data URIs. GitHub has a dark-theme variant. The marks are trademarks of their owners and only say where a
 * cited source lives. Microsoft and Adobe marks are left out (their guidelines forbid this use); those
 * sources keep the line icon of their kind. Keys are lowercase app names.
 */
export const BRAND_LOGO: Record<string, { light: string; dark?: string }> = {
  "slack": { light: "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNDQ3LjYgMjQ1Mi41IiB2aWV3Qm94PSIwIDAgMjQ0Ny42IDI0NTIuNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiA+PGcgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im04OTcuNCAwYy0xMzUuMy4xLTI0NC44IDEwOS45LTI0NC43IDI0NS4yLS4xIDEzNS4zIDEwOS41IDI0NS4xIDI0NC44IDI0NS4yaDI0NC44di0yNDUuMWMuMS0xMzUuMy0xMDkuNS0yNDUuMS0yNDQuOS0yNDUuMy4xIDAgLjEgMCAwIDBtMCA2NTRoLTY1Mi42Yy0xMzUuMy4xLTI0NC45IDEwOS45LTI0NC44IDI0NS4yLS4yIDEzNS4zIDEwOS40IDI0NS4xIDI0NC43IDI0NS4zaDY1Mi43YzEzNS4zLS4xIDI0NC45LTEwOS45IDI0NC44LTI0NS4yLjEtMTM1LjQtMTA5LjUtMjQ1LjItMjQ0LjgtMjQ1LjN6IiBmaWxsPSIjMzZjNWYwIiAvPjxwYXRoIGQ9Im0yNDQ3LjYgODk5LjJjLjEtMTM1LjMtMTA5LjUtMjQ1LjEtMjQ0LjgtMjQ1LjItMTM1LjMuMS0yNDQuOSAxMDkuOS0yNDQuOCAyNDUuMnYyNDUuM2gyNDQuOGMxMzUuMy0uMSAyNDQuOS0xMDkuOSAyNDQuOC0yNDUuM3ptLTY1Mi43IDB2LTY1NGMuMS0xMzUuMi0xMDkuNC0yNDUtMjQ0LjctMjQ1LjItMTM1LjMuMS0yNDQuOSAxMDkuOS0yNDQuOCAyNDUuMnY2NTRjLS4yIDEzNS4zIDEwOS40IDI0NS4xIDI0NC43IDI0NS4zIDEzNS4zLS4xIDI0NC45LTEwOS45IDI0NC44LTI0NS4zeiIgZmlsbD0iIzJlYjY3ZCIgLz48cGF0aCBkPSJtMTU1MC4xIDI0NTIuNWMxMzUuMy0uMSAyNDQuOS0xMDkuOSAyNDQuOC0yNDUuMi4xLTEzNS4zLTEwOS41LTI0NS4xLTI0NC44LTI0NS4yaC0yNDQuOHYyNDUuMmMtLjEgMTM1LjIgMTA5LjUgMjQ1IDI0NC44IDI0NS4yem0wLTY1NC4xaDY1Mi43YzEzNS4zLS4xIDI0NC45LTEwOS45IDI0NC44LTI0NS4yLjItMTM1LjMtMTA5LjQtMjQ1LjEtMjQ0LjctMjQ1LjNoLTY1Mi43Yy0xMzUuMy4xLTI0NC45IDEwOS45LTI0NC44IDI0NS4yLS4xIDEzNS40IDEwOS40IDI0NS4yIDI0NC43IDI0NS4zeiIgZmlsbD0iI2VjYjIyZSIgLz48cGF0aCBkPSJtMCAxNTUzLjJjLS4xIDEzNS4zIDEwOS41IDI0NS4xIDI0NC44IDI0NS4yIDEzNS4zLS4xIDI0NC45LTEwOS45IDI0NC44LTI0NS4ydi0yNDUuMmgtMjQ0LjhjLTEzNS4zLjEtMjQ0LjkgMTA5LjktMjQ0LjggMjQ1LjJ6bTY1Mi43IDB2NjU0Yy0uMiAxMzUuMyAxMDkuNCAyNDUuMSAyNDQuNyAyNDUuMyAxMzUuMy0uMSAyNDQuOS0xMDkuOSAyNDQuOC0yNDUuMnYtNjUzLjljLjItMTM1LjMtMTA5LjQtMjQ1LjEtMjQ0LjctMjQ1LjMtMTM1LjQgMC0yNDQuOSAxMDkuOC0yNDQuOCAyNDUuMSAwIDAgMCAuMSAwIDAiIGZpbGw9IiNlMDFlNWEiIC8+PC9nPjwvc3ZnPg==" },
  "notion": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjY4IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgdmlld0JveD0iMCAwIDI1NiAyNjgiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xNi4wOTIgMTEuNTM4IDE2NC4wOS42MDhjMTguMTc5LTEuNTYgMjIuODUtLjUwOCAzNC4yOCA3LjgwMWw0Ny4yNDMgMzMuMjgyQzI1My40MDYgNDcuNDE0IDI1NiA0OC45NzUgMjU2IDU1LjIwN3YxODIuNTI3YzAgMTEuNDM5LTQuMTU1IDE4LjIwNS0xOC42OTYgMTkuMjRMNjUuNDQgMjY3LjM3OGMtMTAuOTEzLjUxNy0xNi4xMS0xLjA0My0yMS44MjUtOC4zMjdMOC44MjYgMjEzLjgxNEMyLjU4NiAyMDUuNDg3IDAgMTk5LjI1NCAwIDE5MS45N1YyOS43MjZjMC05LjM1MiA0LjE1NS0xNy4xNTMgMTYuMDkyLTE4LjE4OFoiLz48cGF0aCBkPSJNMTY0LjA5LjYwOCAxNi4wOTIgMTEuNTM4QzQuMTU1IDEyLjU3MyAwIDIwLjM3NCAwIDI5LjcyNnYxNjIuMjQ1YzAgNy4yODQgMi41ODUgMTMuNTE2IDguODI2IDIxLjg0M2wzNC43ODkgNDUuMjM3YzUuNzE1IDcuMjg0IDEwLjkxMiA4Ljg0NCAyMS44MjUgOC4zMjdsMTcxLjg2NC0xMC40MDRjMTQuNTMyLTEuMDM1IDE4LjY5Ni03LjgwMSAxOC42OTYtMTkuMjRWNTUuMjA3YzAtNS45MTEtMi4zMzYtNy42MTQtOS4yMS0xMi42NmwtMS4xODUtLjg1NkwxOTguMzcgOC40MDlDMTg2Ljk0LjEgMTgyLjI3LS45NTIgMTY0LjA5LjYwOFpNNjkuMzI3IDUyLjIyYy0xNC4wMzMuOTQ1LTE3LjIxNiAxLjE1OS0yNS4xODYtNS4zMjNMMjMuODc2IDMwLjc3OGMtMi4wNi0yLjA4Ni0xLjAyNi00LjY5IDQuMTYzLTUuMjA3bDE0Mi4yNzQtMTAuMzk1YzExLjk0Ny0xLjA0MyAxOC4xNyAzLjEyIDIyLjg0MiA2Ljc1OGwyNC40MDEgMTcuNjhjMS4wNDMuNTI1IDMuNjM4IDMuNjM3LjUxNyAzLjYzN0w3MS4xNDYgNTIuMDk1bC0xLjgxOS4xMjVabS0xNi4zNiAxODMuOTU0VjgxLjIyMmMwLTYuNzY3IDIuMDc3LTkuODg3IDguMy0xMC40MTNMMjMwLjAyIDYwLjkzYzUuNzI0LS41MTcgOC4zMSAzLjEyIDguMzEgOS44Nzl2MTUzLjkxN2MwIDYuNzY3LTEuMDQ0IDEyLjQ5LTEwLjM4NyAxMy4wMDhsLTE2MS40ODcgOS4zNjFjLTkuMzQzLjUxNy0xMy40ODktMi41OTQtMTMuNDg5LTEwLjkyMVpNMjEyLjM3NyA4OS41M2MxLjAzNCA0LjY4MSAwIDkuMzYyLTQuNjgxIDkuODk3bC03Ljc4MyAxLjU0MnYxMTQuNDA0Yy02Ljc1OCAzLjYzNy0xMi45ODEgNS43MTUtMTguMTggNS43MTUtOC4zMDggMC0xMC4zODYtMi42MDQtMTYuNjA5LTEwLjM5NmwtNTAuODk4LTgwLjA3OXY3Ny40NzZsMTYuMSAzLjY0NnMwIDkuMzYyLTEyLjk4OSA5LjM2MmwtMzUuODE0IDIuMDc3Yy0xLjA0My0yLjA4NiAwLTcuMjg0IDMuNjMtOC4zMThsOS4zNTEtMi41OTVWMTA5LjgyM2wtMTIuOTgtMS4wNTJjLTEuMDQ0LTQuNjggMS41NS0xMS40MzkgOC44MjYtMTEuOTY1bDM4LjQyNi0yLjU4NSA1Mi45NTggODEuMTEzdi03MS43NmwtMTMuNDk4LTEuNTUyYy0xLjA0My01LjczMyAzLjExMS05Ljg5NiA4LjMtMTAuNDA0bDM1Ljg0LTIuMDg3WiIvPjwvc3ZnPg==" },
  "google-calendar": { light: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzUwNzJfMzc2NikiPjxwYXRoIGQ9Ik0zOTAuNzM2IDEyMS4yNjRIMTIxLjI2NFYzOTAuNzM2SDM5MC43MzZWMTIxLjI2NFoiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTM5MC43MzYgNTEyTDUxMiAzOTAuNzM2TDQ1MS4zNjggMzgwLjM5MkwzOTAuNzM2IDM5MC43MzZMMzc5LjY3IDQ0Ni4xOTZMMzkwLjczNiA1MTJaIiBmaWxsPSIjRUE0MzM1Ii8+PHBhdGggZD0iTTAgMzkwLjczNlY0NzEuNTc4QzAgNDkzLjkxMiAxOC4wODggNTEyIDQwLjQyIDUxMkgxMjEuMjY0TDEzMy43MTQgNDUxLjM2OEwxMjEuMjY0IDM5MC43MzZMNTUuMTk4IDM4MC4zOTJMMCAzOTAuNzM2WiIgZmlsbD0iIzE4ODAzOCIvPjxwYXRoIGQ9Ik01MTIgMTIxLjI2NFY0MC40MkM1MTIgMTguMDg4IDQ5My45MTIgMCA0NzEuNTggMEgzOTAuNzM2QzM4My4zNiAzMC4wNzIgMzc5LjY3MSA1Mi4yMDI3IDM3OS42NyA2Ni4zOTJDMzc5LjY3IDgwLjU4IDM4My4zNTkgOTguODcwNyAzOTAuNzM2IDEyMS4yNjRDNDE3LjU1NiAxMjguOTQ0IDQzNy43NjcgMTMyLjc4NCA0NTEuMzY4IDEzMi43ODRDNDY0Ljk2OSAxMzIuNzg0IDQ4NS4xOCAxMjguOTQ1IDUxMiAxMjEuMjY0WiIgZmlsbD0iIzE5NjdEMiIvPjxwYXRoIGQ9Ik01MTIgMTIxLjI2NEgzOTAuNzM2VjM5MC43MzZINTEyVjEyMS4yNjRaIiBmaWxsPSIjRkJCQzA0Ii8+PHBhdGggZD0iTTM5MC43MzYgMzkwLjczNkgxMjEuMjY0VjUxMkgzOTAuNzM2VjM5MC43MzZaIiBmaWxsPSIjMzRBODUzIi8+PHBhdGggZD0iTTM5MC43MzYgMEg0MC40MjJDMTguMDg4IDAgMCAxOC4wODggMCA0MC40MlYzOTAuNzM2SDEyMS4yNjRWMTIxLjI2NEgzOTAuNzM2VjBaIiBmaWxsPSIjNDI4NUY0Ii8+PHBhdGggZD0iTTE3Ni41NCAzMzAuMzA4QzE2Ni40NjggMzIzLjUwNCAxNTkuNDk0IDMxMy41NjggMTU1LjY4OCAzMDAuNDI4TDE3OS4wNjYgMjkwLjc5NkMxODEuMTg2IDI5OC44OCAxODQuODkxIDMwNS4xNDUgMTkwLjE4MiAzMDkuNTkyQzE5NS40MzYgMzE0LjAzOCAyMDEuODM2IDMxNi4yMjggMjA5LjMxNCAzMTYuMjI4QzIxNi45NTkgMzE2LjIyOCAyMjMuNTI3IDMxMy45MDMgMjI5LjAxOCAzMDkuMjU0QzIzNC41MSAzMDQuNjA2IDIzNy4yNzIgMjk4LjY3OCAyMzcuMjcyIDI5MS41MDRDMjM3LjI3MiAyODQuMTYgMjM0LjM3NSAyNzguMTY0IDIyOC41ODIgMjczLjUxNkMyMjIuNzg4IDI2OC44NjggMjE1LjUxMiAyNjYuNTQ0IDIwNi44MjIgMjY2LjU0NEgxOTMuMzE0VjI0My40MDRIMjA1LjQ0QzIxMi45MTcgMjQzLjQwNCAyMTkuMjE2IDI0MS4zODIgMjI0LjMzNiAyMzcuMzM4QzIyOS40NTYgMjMzLjI5OCAyMzIuMDE2IDIyNy43NzIgMjMyLjAxNiAyMjAuNzMyQzIzMi4wMTYgMjE0LjQ2OCAyMjkuNzI2IDIwOS40ODIgMjI1LjE0NiAyMDUuNzQ0QzIyMC41NjYgMjAyLjAwNCAyMTQuNzcgMjAwLjExOCAyMDcuNzMgMjAwLjExOEMyMDAuODU4IDIwMC4xMTggMTk1LjQwMiAyMDEuOTM4IDE5MS4zNiAyMDUuNjA4QzE4Ny4zMTkgMjA5LjI4OSAxODQuMjgyIDIxMy45MzcgMTgyLjUzNCAyMTkuMTE2TDE1OS4zOTQgMjA5LjQ4MkMxNjIuNDU4IDIwMC43OTIgMTY4LjA4NCAxOTMuMTEyIDE3Ni4zMzYgMTg2LjQ3NkMxODQuNTg4IDE3OS44NCAxOTUuMTMyIDE3Ni41MDYgMjA3LjkzMiAxNzYuNTA2QzIxNy4zOTggMTc2LjUwNiAyMjUuOTIgMTc4LjMyNiAyMzMuNDY2IDE4MS45OTZDMjQxLjAxIDE4NS42NjggMjQ2LjkzOCAxOTAuNzU0IDI1MS4yMTYgMTk3LjIyMkMyNTUuNDk2IDIwMy43MjIgMjU3LjYxNiAyMTAuOTk4IDI1Ny42MTYgMjE5LjA4MkMyNTcuNjE2IDIyNy4zMzQgMjU1LjYzIDIzNC4zMDggMjUxLjY1NiAyNDAuMDM0QzI0Ny42ODIgMjQ1Ljc2IDI0Mi43OTYgMjUwLjEzOCAyMzcuMDAyIDI1My4yMDRWMjU0LjU4NEMyNDQuNDgzIDI1Ny42NjkgMjUwLjk4MiAyNjIuNzM1IDI1NS43OTggMjY5LjIzOEMyNjAuNjgyIDI3NS44MDYgMjYzLjE0MiAyODMuNjU0IDI2My4xNDIgMjkyLjgxOEMyNjMuMTQyIDMwMS45NzggMjYwLjgxNiAzMTAuMTY0IDI1Ni4xNjggMzE3LjMzOEMyNTEuNTIgMzI0LjUxNCAyNDUuMDg4IDMzMC4xNzIgMjM2LjkzNCAzMzQuMjgyQzIyOC43NSAzMzguMzkyIDIxOS41NTQgMzQwLjQ4MiAyMDkuMzQ4IDM0MC40ODJDMTk3LjUyNCAzNDAuNTE0IDE4Ni42MTIgMzM3LjExMiAxNzYuNTQgMzMwLjMwOFpNMzIwLjEzMiAyMTQuMjk4TDI5NC40NjYgMjMyLjg1OEwyODEuNjMyIDIxMy4zOUwzMjcuNjc4IDE4MC4xNzZIMzQ1LjMyOFYzMzYuODQySDMyMC4xMzJWMjE0LjI5OFoiIGZpbGw9IiM0Mjg1RjQiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMF81MDcyXzM3NjYiPjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSJ3aGl0ZSIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==" },
  "gmail": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgNDkuNCA1MTIgMzk5LjQyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGwtcnVsZT0ibm9uemVybyI+PHBhdGggZmlsbD0iIzQyODVmNCIgZD0iTTM0LjkxIDQ0OC44MThoODEuNDU0VjI1MUwwIDE2My43MjdWNDEzLjkxYzAgMTkuMjg3IDE1LjYyMiAzNC45MSAzNC45MSAzNC45MXoiLz48cGF0aCBmaWxsPSIjMzRhODUzIiBkPSJNMzk1LjYzNiA0NDguODE4aDgxLjQ1NWMxOS4yODcgMCAzNC45MDktMTUuNjIyIDM0LjkwOS0zNC45MDlWMTYzLjcyN0wzOTUuNjM2IDI1MXoiLz48cGF0aCBmaWxsPSIjZmJiYzA0IiBkPSJNMzk1LjYzNiA5OS43MjdWMjUxTDUxMiAxNjMuNzI3di00Ni41NDVjMC00My4xNDItNDkuMjUtNjcuNzgyLTgzLjc4Mi00MS44OTF6Ii8+PC9nPjxwYXRoIGZpbGw9IiNlYTQzMzUiIGQ9Ik0xMTYuMzY0IDI1MVY5OS43MjdMMjU2IDIwNC40NTUgMzk1LjYzNiA5OS43MjdWMjUxTDI1NiAzNTUuNzI3eiIvPjxwYXRoIGZpbGw9IiNjNTIyMWYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTAgMTE3LjE4MnY0Ni41NDVMMTE2LjM2NCAyNTFWOTkuNzI3TDgzLjc4MiA3NS4yOTFDNDkuMjUgNDkuNCAwIDc0LjA0IDAgMTE3LjE4eiIvPjwvZz48L3N2Zz4=" },
  "google-drive": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4Ny4zIDc4Ij48cGF0aCBmaWxsPSIjMDA2NmRhIiBkPSJtNi42IDY2Ljg1IDMuODUgNi42NWMuOCAxLjQgMS45NSAyLjUgMy4zIDMuM0wyNy41IDUzSDBjMCAxLjU1LjQgMy4xIDEuMiA0LjV6Ii8+PHBhdGggZmlsbD0iIzAwYWM0NyIgZD0iTTQzLjY1IDI1IDI5LjkgMS4yYy0xLjM1LjgtMi41IDEuOS0zLjMgMy4zbC0yNS40IDQ0QTkuMDYgOS4wNiAwIDAgMCAwIDUzaDI3LjV6Ii8+PHBhdGggZmlsbD0iI2VhNDMzNSIgZD0iTTczLjU1IDc2LjhjMS4zNS0uOCAyLjUtMS45IDMuMy0zLjNsMS42LTIuNzVMODYuMSA1Ny41Yy44LTEuNCAxLjItMi45NSAxLjItNC41SDU5Ljc5OGw1Ljg1MiAxMS41eiIvPjxwYXRoIGZpbGw9IiMwMDgzMmQiIGQ9Ik00My42NSAyNSA1Ny40IDEuMkM1Ni4wNS40IDU0LjUgMCA1Mi45IDBIMzQuNGMtMS42IDAtMy4xNS40NS00LjUgMS4yeiIvPjxwYXRoIGZpbGw9IiMyNjg0ZmMiIGQ9Ik01OS44IDUzSDI3LjVMMTMuNzUgNzYuOGMxLjM1LjggMi45IDEuMiA0LjUgMS4yaDUwLjhjMS42IDAgMy4xNS0uNDUgNC41LTEuMnoiLz48cGF0aCBmaWxsPSIjZmZiYTAwIiBkPSJtNzMuNCAyNi41LTEyLjctMjJjLS44LTEuNC0xLjk1LTIuNS0zLjMtMy4zTDQzLjY1IDI1IDU5LjggNTNoMjcuNDVjMC0xLjU1LS40LTMuMS0xLjItNC41eiIvPjwvc3ZnPg==" },
  "obsidian": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMzMyIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgdmlld0JveD0iMCAwIDI1NiAzMzIiPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjcyLjgxOSUiIGN5PSI5Ni45MzQlIiByPSIxNjMuNzkzJSIgZng9IjcyLjgxOSUiIGZ5PSI5Ni45MzQlIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC0xMDQgMTExNDEuMzIyIDApIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii40Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImIiIGN4PSI1Mi45MTclIiBjeT0iOTAuNjMyJSIgcj0iMTkwLjM2MSUiIGZ4PSI1Mi45MTclIiBmeT0iOTAuNjMyJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSgtODIgMTA3NDYuNzUgMCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjEiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjMxLjE3NCUiIGN5PSI5Ny4xMzglIiByPSIxNzguNzE0JSIgZng9IjMxLjE3NCUiIGZ5PSI5Ny4xMzglIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKC03NyAxMDcyNC42MDYgMCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjgiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjQiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZCIgY3g9IjcxLjgxMyUiIGN5PSI5OS45OTQlIiByPSI5Mi4wODYlIiBmeD0iNzEuODEzJSIgZnk9Ijk5Ljk5NCUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAyMjI1MTgzOS42NTgpIHNrZXdZKC05MCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjMiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3Atb3BhY2l0eT0iLjMiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZSIgY3g9IjExNy4wMTMlIiBjeT0iMzQuNzY5JSIgcj0iMzI4LjcyOSUiIGZ4PSIxMTcuMDEzJSIgZnk9IjM0Ljc2OSUiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoMTAyIC0xMDA0LjQ0MyAwKSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4yIi8+PC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9ImYiIGN4PSItOS40MzElIiBjeT0iOC43MTIlIiByPSIxNTMuNDkyJSIgZng9Ii05LjQzMSUiIGZ5PSI4LjcxMiUiIGdyYWRpZW50VHJhbnNmb3JtPSJyb3RhdGUoNDUgMTY3NC4zOTcgMCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjQiLz48L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0iZyIgY3g9IjEwMy45MDIlIiBjeT0iLTIyLjE3MiUiIHI9IjM5NC43NzElIiBmeD0iMTAzLjkwMiUiIGZ5PSItMjIuMTcyJSIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg4MCAzNzU3LjUyMiAwKSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuMSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIuMyIvPjwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJoIiBjeD0iOTkuMzQ4JSIgY3k9Ijg5LjE5MyUiIHI9IjIwMy44MjQlIiBmeD0iOTkuMzQ4JSIgZnk9Ijg5LjE5MyUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMzg3ODMyNDYuNTQ4KSBza2V3WSgtOTApIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZGIiBzdG9wLW9wYWNpdHk9Ii4yIi8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkYiIHN0b3Atb3BhY2l0eT0iLjMiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsLW9wYWNpdHk9Ii4zIiBkPSJNMjA5LjA1NiAzMDguMzA1Yy0yLjA0MyAxNC45My0xNi43MzggMjYuNjM4LTMxLjQzMiAyMi41NTItMjAuODIzLTUuNjU4LTQ0Ljk0Ni0xNC42MTYtNjYuNjM0LTE2LjI2NmwtMzMuMzE3LTIuNTE1YTIyLjAwMiAyMi4wMDIgMCAwIDEtMTQuMTQ0LTYuNTIyTDYuMTY3IDI0Ni43NzhhMjEuNzY2IDIxLjc2NiAwIDAgMS00LjI0NC0yNC4xMjRzMzUuMzYtNzcuNDc4IDM2Ljc3NS04MS40ODVjMS4yNTctNC4wMDggNi4xMy0zOS4yMTEgOC45NTgtNTguMDdhMjIuMDAyIDIyLjAwMiAwIDAgMSA3LjA3Mi0xMi45NjVMMTIyLjQ2MiA5LjQ3YTIyLjAwMiAyMi4wMDIgMCAwIDEgMzEuOTAzIDIuNjcybDU3LjA0OCA3MS45NzhhMjMuMTggMjMuMTggMCAwIDEgNC44NzIgMTQuMzhjMCAxMy41OTQgMS4xNzkgNDEuNjQ2IDguOCA1OS43MmEyMzYuNzU2IDIzNi43NTYgMCAwIDAgMjcuOTc0IDQ1LjczMiAxMS4wMDEgMTEuMDAxIDAgMCAxIC43ODYgMTIuMjU4Yy00Ljk1IDguNDA4LTE0Ljg1MSAyNC41OTUtMjguNzYgNDUuMjZhMTExLjczOCAxMTEuNzM4IDAgMCAwLTE2LjEwOCA0Ni44MzRoLjA3OVoiLz48cGF0aCBmaWxsPSIjNkMzMUUzIiBkPSJNMjA5LjYwNiAzMDUuNzljLTIuMDQzIDE1LjAwOS0xNi43MzcgMjYuNzE3LTMxLjQzMiAyMi43MS0yMC43NDQtNS43MzctNDQuNzktMTQuNjk1LTY2LjU1NS0xNi4zNDVMNzguMzggMzA5LjY0YTIxLjkyMyAyMS45MjMgMCAwIDEtMTQuMTQ0LTYuNkw2Ljg3NCAyNDQuMTA2YTIxLjkyMyAyMS45MjMgMCAwIDEtNC4yNDMtMjQuMzZzMzUuNDM4LTc3Ljc5MiAzNi43NzQtODEuODc4YzEuMzM2LTQuMDA3IDYuMTMtMzkuMjg5IDguOTU4LTU4LjMwNWEyMi4wMDIgMjIuMDAyIDAgMCAxIDcuMDcyLTEzLjA0NEwxMjMuMTcgNS42MjFhMjIuMDAyIDIyLjAwMiAwIDAgMSAzMS45MDIgMi43NWw1Ni45NyA3Mi4yOTJhMjMuMzM4IDIzLjMzOCAwIDAgMSA0Ljg3MSAxNC4zOGMwIDEzLjY3MyAxLjE4IDQxLjgwNCA4LjcyMyA1OS45NTVhMjM4LjA5MiAyMzguMDkyIDAgMCAwIDI3Ljk3NCA0NS45NjkgMTEuMDAxIDExLjAwMSAwIDAgMSAuODY0IDEyLjMzNmMtNS4wMyA4LjQ4Ny0xNC44NTEgMjQuNjc0LTI4LjgzOCA0NS40OTdhMTEyLjYwMyAxMTIuNjAzIDAgMCAwLTE2LjAzIDQ2Ljk5WiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik03MC4zNjUgMzA3LjQ0YzI2LjYzOC01My45ODMgMjUuOTMtOTIuNzIyIDE0LjUzNy0xMjAuMjI1LTEwLjM3Mi0yNS40NTktMjkuNzgxLTQxLjQ4OS00NS4wMjUtNTEuNDY4YTE5LjIzMyAxOS4yMzMgMCAwIDEtMS40MTUgNC4yNDNMMi42MzEgMjE5Ljc0N2EyMS45MjMgMjEuOTIzIDAgMCAwIDQuMzIxIDI0LjM2bDU3LjI4NCA1OC45MzNhMjMuNzYyIDIzLjc2MiAwIDAgMCA2LjEyOSA0LjRaIi8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTE0Mi44MTQgMTk3LjkwMmE4Ni4wMjUgODYuMDI1IDAgMCAxIDIxLjA2IDQuNzkzYzIxLjg0NCA4LjE3MiA0MS43MjQgMjYuNTYgNTguMTQ3IDYxLjk5OSAxLjE3OS0yLjA0MyAyLjM1Ny00LjAwOCAzLjYxNS01Ljg5NGE5NjAuMjI2IDk2MC4yMjYgMCAwIDAgMjguODM4LTQ1LjQ5NyAxMS4wMDEgMTEuMDAxIDAgMCAwLS43ODYtMTIuMzM2IDIzOC4wOTIgMjM4LjA5MiAwIDAgMS0yOC4wNTItNDUuOTY5Yy03LjU0NC0xOC4wNzMtOC42NDQtNDYuMjgyLTguNzIzLTU5Ljk1NSAwLTUuMTg2LTEuNjUtMTAuMjk0LTQuODcxLTE0LjM4bC01Ni45Ny03Mi4yOTItLjk0My0xLjE3OGM0LjE2NSAxMy43NSAzLjkzIDI0Ljc1MiAxLjMzNiAzNC43MzEtMi4zNTcgOS4yNzItNi43NTcgMTcuNjgtMTEuMzk0IDI2LjU2LTEuNTcxIDIuOTg2LTMuMTQzIDYuMDUtNC42MzYgOS4xOTNhMTEwLjAxIDExMC4wMSAwIDAgMC0xMi40MTUgNDUuNTc2Yy0uNzg2IDE5LjAxNiAzLjA2NCA0Mi44MjUgMTUuNzE2IDc0LjY1aC4wNzhaIi8+PHBhdGggZmlsbD0idXJsKCNjKSIgZD0iTTE0Mi43MzYgMTk3LjkwMmMtMTIuNjUyLTMxLjgyNC0xNi41MDItNTUuNjMzLTE1LjcxNi03NC42NS43ODYtMTguODU4IDYuMjg2LTMzLjAwMiAxMi40MTUtNDUuNTc1bDQuNzE1LTkuMTkzYzQuNTU4LTguODggOC44OC0xNy4yODggMTEuMzE1LTI2LjU2YTYxLjY4NCA2MS42ODQgMCAwIDAtMS4zMzYtMzQuNzMxYy04LjEzNi04Ljk0LTIxLjk2LTkuNjQyLTMwLjk2LTEuNTcyTDU1LjQzNiA2Ni41MTlhMjIuMDAyIDIyLjAwMiAwIDAgMC03LjA3MiAxMy4wNDRsLTguMjUgNTQuNjljMCAuNTUtLjE1OCAxLjAyMi0uMjM2IDEuNTcyIDE1LjI0NCA5LjkwMSAzNC41NzQgMjUuOTMxIDQ1LjAyNSA1MS4zMTIgMi4wNDMgNS4wMjkgMy43NzIgMTAuMjk0IDUuMDI5IDE2LjAzYTE1Ny4xNTcgMTU3LjE1NyAwIDAgMSA1Mi44MDUtNS4zNDN2LjA3OFoiLz48cGF0aCBmaWxsPSJ1cmwoI2QpIiBkPSJNMTc4LjI1MyAzMjguNWMxNC42MTYgNC4wMDcgMjkuMzEtNy43MDEgMzEuMzUzLTIyLjc4OWExMjAuMjI1IDEyMC4yMjUgMCAwIDEgMTIuNDk0LTQxLjAxN2MtMTYuNTAyLTM1LjQ0LTM2LjM4Mi01My44MjctNTguMTQ4LTYxLjk5OS0yMy4xOC04LjY0My00OC40MDQtNS43MzYtNzQuMDIxLjQ3MiA1LjczNiAyNi4wMSAyLjM1NyA2MC4wMzQtMTkuNDg3IDEwNC4yNzMgMi40MzYgMS4yNTcgNS4xODYgMS45NjUgNy45MzYgMi4ybDM0LjQ5NiAyLjU5M2MxOC43MDEgMS4zMzYgNDYuNTk3IDExLjAwMSA2NS4zNzcgMTYuMjY2WiIvPjxwYXRoIGZpbGw9InVybCgjZSkiIGQ9Ik0xMjcuMTc3IDEyMi4wNzRjLS44NjQgMTguODU5IDEuNDkzIDQwLjM5IDE0LjE0NCA3Mi4xMzVsLTMuOTI5LS4zOTNjLTExLjM5NC0zMy4wODEtMTMuOTA4LTUwLjA1NC0xMy4wNDQtNjkuMTQ5Ljc4Ni0xOS4wOTQgNi45OTQtMzMuNzg5IDEzLjEyMy00Ni4zNjEgMS41NzEtMy4xNDMgNS4xODYtOS4wMzcgNi43NTgtMTIuMDIzIDQuNTU3LTguODc5IDcuNjIyLTEzLjUxNSAxMC4yMTUtMjEuNjA5IDMuNzcyLTExLjMxNSAyLjk4Ni0xNi42NTggMi41MTQtMjIuMDAxIDIuOTA4IDE5LjI1MS04LjE3MiAzNS45ODgtMTYuNTAxIDUzLjA0YTExMy45MzkgMTEzLjkzOSAwIDAgMC0xMy4zNTggNDYuMzYxaC4wNzhaIi8+PHBhdGggZmlsbD0idXJsKCNmKSIgZD0iTTg4LjY3NCAxODguNTUxYzEuNTcxIDMuNDU4IDIuOTA3IDYuMjg3IDMuODUgMTAuNjA4bC0zLjM3OS43ODZjLTEuMzM2LTUuMDI5LTIuMzU3LTguNjQzLTQuMzIyLTEyLjk2NS0xMS40NzItMjYuOTUzLTI5Ljg2LTQwLjg2MS00NC43OS01MS4wNzYgMTguMDc0IDkuNzQ0IDM2LjY5NyAyNS4wNjYgNDguNjQgNTIuNjQ3WiIvPjxwYXRoIGZpbGw9InVybCgjZykiIGQ9Ik05Mi42ODEgMjAyLjYxN2M2LjI4NiAyOS40NjctLjc4NiA2Ni45NDgtMjEuNjA5IDEwMy40MDkgMTcuNDQ1LTM2LjE0NiAyNS45MzEtNzAuOCAxOC44NTktMTAyLjkzOGwyLjc1LS41NXYuMDc5WiIvPjxwYXRoIGZpbGw9InVybCgjaCkiIGQ9Ik0xNjQuNjU5IDE5OS44NjdjMzQuMTgxIDEyLjgwOCA0Ny4zODMgNDAuODYgNTcuMjA1IDY0LjM1NS0xMi4xOC0yNC41MTYtMjkuMDc0LTUxLjYyNi01OC40NjItNjEuNjg0LTIyLjMxNy03LjctNDEuMTc1LTYuNzU4LTczLjQ3MS41NWwtLjcwNy0zLjE0M2MzNC4yNi03Ljg1OCA1Mi4xNzYtOC44IDc1LjQzNSAwdi0uMDc4WiIvPjwvc3ZnPg==" },
  "figma": { light: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTQiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA1NCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfOTEyXzMpIj48cGF0aCBkPSJNMTMuMzMzMyA4MC4wMDAyQzIwLjY5MzMgODAuMDAwMiAyNi42NjY3IDc0LjAyNjggMjYuNjY2NyA2Ni42NjY4VjUzLjMzMzVIMTMuMzMzM0M1Ljk3MzMzIDUzLjMzMzUgMCA1OS4zMDY4IDAgNjYuNjY2OEMwIDc0LjAyNjggNS45NzMzMyA4MC4wMDAyIDEzLjMzMzMgODAuMDAwMloiIGZpbGw9IiMwQUNGODMiLz48cGF0aCBkPSJNMCAzOS45OTk4QzAgMzIuNjM5OCA1Ljk3MzMzIDI2LjY2NjUgMTMuMzMzMyAyNi42NjY1SDI2LjY2NjdWNTMuMzMzMkgxMy4zMzMzQzUuOTczMzMgNTMuMzMzMiAwIDQ3LjM1OTggMCAzOS45OTk4WiIgZmlsbD0iI0EyNTlGRiIvPjxwYXRoIGQ9Ik0wIDEzLjMzMzNDMCA1Ljk3MzMzIDUuOTczMzMgMCAxMy4zMzMzIDBIMjYuNjY2N1YyNi42NjY3SDEzLjMzMzNDNS45NzMzMyAyNi42NjY3IDAgMjAuNjkzMyAwIDEzLjMzMzNaIiBmaWxsPSIjRjI0RTFFIi8+PHBhdGggZD0iTTI2LjY2NjcgMEg0MC4wMDAxQzQ3LjM2MDEgMCA1My4zMzM0IDUuOTczMzMgNTMuMzMzNCAxMy4zMzMzQzUzLjMzMzQgMjAuNjkzMyA0Ny4zNjAxIDI2LjY2NjcgNDAuMDAwMSAyNi42NjY3SDI2LjY2NjdWMFoiIGZpbGw9IiNGRjcyNjIiLz48cGF0aCBkPSJNNTMuMzMzNCAzOS45OTk4QzUzLjMzMzQgNDcuMzU5OCA0Ny4zNjAxIDUzLjMzMzIgNDAuMDAwMSA1My4zMzMyQzMyLjY0MDEgNTMuMzMzMiAyNi42NjY3IDQ3LjM1OTggMjYuNjY2NyAzOS45OTk4QzI2LjY2NjcgMzIuNjM5OCAzMi42NDAxIDI2LjY2NjUgNDAuMDAwMSAyNi42NjY1QzQ3LjM2MDEgMjYuNjY2NSA1My4zMzM0IDMyLjYzOTggNTMuMzMzNCAzOS45OTk4WiIgZmlsbD0iIzFBQkNGRSIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImNsaXAwXzkxMl8zIj48cmVjdCB3aWR0aD0iNTMuMzMzMyIgaGVpZ2h0PSI4MCIgZmlsbD0id2hpdGUiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=" },
  "github": { light: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9Im5vbmUiPjxwYXRoIGZpbGw9IiMxYjFmMjMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTUxMiAwQzIyOS4xMiAwIDAgMjI5LjEyIDAgNTEyYzAgMjI2LjU2IDE0Ni41NiA0MTcuOTIgMzUwLjA4IDQ4NS43NiAyNS42IDQuNDggMzUuMi0xMC44OCAzNS4yLTI0LjMyIDAtMTIuMTYtLjY0LTUyLjQ4LS42NC05NS4zNi0xMjguNjQgMjMuNjgtMTYxLjkyLTMxLjM2LTE3Mi4xNi02MC4xNi01Ljc2LTE0LjcyLTMwLjcyLTYwLjE2LTUyLjQ4LTcyLjMyLTE3LjkyLTkuNi00My41Mi0zMy4yOC0uNjQtMzMuOTIgNDAuMzItLjY0IDY5LjEyIDM3LjEyIDc4LjcyIDUyLjQ4IDQ2LjA4IDc3LjQ0IDExOS42OCA1NS42OCAxNDkuMTIgNDIuMjQgNC40OC0zMy4yOCAxNy45Mi01NS42OCAzMi42NC02OC40OC0xMTMuOTItMTIuOC0yMzIuOTYtNTYuOTYtMjMyLjk2LTI1Mi44IDAtNTUuNjggMTkuODQtMTAxLjc2IDUyLjQ4LTEzNy42LTUuMTItMTIuOC0yMy4wNC02NS4yOCA1LjEyLTEzNS42OCAwIDAgNDIuODgtMTMuNDQgMTQwLjggNTIuNDggNDAuOTYtMTEuNTIgODQuNDgtMTcuMjggMTI4LTE3LjI4czg3LjA0IDUuNzYgMTI4IDE3LjI4Yzk3LjkyLTY2LjU2IDE0MC44LTUyLjQ4IDE0MC44LTUyLjQ4IDI4LjE2IDcwLjQgMTAuMjQgMTIyLjg4IDUuMTIgMTM1LjY4IDMyLjY0IDM1Ljg0IDUyLjQ4IDgxLjI4IDUyLjQ4IDEzNy42IDAgMTk2LjQ4LTExOS42OCAyNDAtMjMzLjYgMjUyLjggMTguNTYgMTYgMzQuNTYgNDYuNzIgMzQuNTYgOTQuNzIgMCA2OC40OC0uNjQgMTIzLjUyLS42NCAxNDAuOCAwIDEzLjQ0IDkuNiAyOS40NCAzNS4yIDI0LjMyQzg3Ny40NCA5MjkuOTIgMTAyNCA3MzcuOTIgMTAyNCA1MTIgMTAyNCAyMjkuMTIgNzk0Ljg4IDAgNTEyIDAiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==", dark: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOCAwQzMuNTggMCAwIDMuNTggMCA4QzAgMTEuNTQgMi4yOSAxNC41MyA1LjQ3IDE1LjU5QzUuODcgMTUuNjYgNi4wMiAxNS40MiA2LjAyIDE1LjIxQzYuMDIgMTUuMDIgNi4wMSAxNC4zOSA2LjAxIDEzLjcyQzQgMTQuMDkgMy40OCAxMy4yMyAzLjMyIDEyLjc4QzMuMjMgMTIuNTUgMi44NCAxMS44NCAyLjUgMTEuNjVDMi4yMiAxMS41IDEuODIgMTEuMTMgMi40OSAxMS4xMkMzLjEyIDExLjExIDMuNTcgMTEuNyAzLjcyIDExLjk0QzQuNDQgMTMuMTUgNS41OSAxMi44MSA2LjA1IDEyLjZDNi4xMiAxMi4wOCA2LjMzIDExLjczIDYuNTYgMTEuNTNDNC43OCAxMS4zMyAyLjkyIDEwLjY0IDIuOTIgNy41OEMyLjkyIDYuNzEgMy4yMyA1Ljk5IDMuNzQgNS40M0MzLjY2IDUuMjMgMy4zOCA0LjQxIDMuODIgMy4zMUMzLjgyIDMuMzEgNC40OSAzLjEgNi4wMiA0LjEzQzYuNjYgMy45NSA3LjM0IDMuODYgOC4wMiAzLjg2QzguNyAzLjg2IDkuMzggMy45NSAxMC4wMiA0LjEzQzExLjU1IDMuMDkgMTIuMjIgMy4zMSAxMi4yMiAzLjMxQzEyLjY2IDQuNDEgMTIuMzggNS4yMyAxMi4zIDUuNDNDMTIuODEgNS45OSAxMy4xMiA2LjcgMTMuMTIgNy41OEMxMy4xMiAxMC42NSAxMS4yNSAxMS4zMyA5LjQ3IDExLjUzQzkuNzYgMTEuNzggMTAuMDEgMTIuMjYgMTAuMDEgMTMuMDFDMTAuMDEgMTQuMDggMTAgMTQuOTQgMTAgMTUuMjFDMTAgMTUuNDIgMTAuMTUgMTUuNjcgMTAuNTUgMTUuNTlDMTMuNzEgMTQuNTMgMTYgMTEuNTMgMTYgOEMxNiAzLjU4IDEyLjQyIDAgOCAwWiIgdHJhbnNmb3JtPSJzY2FsZSg2NCkiIGZpbGw9IiNmZmZmIi8+PC9zdmc+" },
  "linear": { light: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0iIzVFNkFEMiIgZD0iTTEuMjI1IDYxLjUyM2MtLjIyMi0uOTQ5LjkwOC0xLjU0NiAxLjU5Ny0uODU3bDM2LjUxMiAzNi41MTJjLjY5LjY5LjA5MiAxLjgyLS44NTcgMS41OTctMTguNDI1LTQuMzIzLTMyLjkzLTE4LjgyNy0zNy4yNTItMzcuMjUyWk0uMDAyIDQ2Ljg4OWEuOTkuOTkgMCAwIDAgLjI5Ljc2TDUyLjM1IDk5LjcxYy4yMDEuMi40NzguMzA3Ljc2LjI5IDIuMzctLjE0OSA0LjY5NS0uNDYgNi45NjMtLjkyNy43NjUtLjE1NyAxLjAzLTEuMDk2LjQ3OC0xLjY0OEwyLjU3NiAzOS40NDhjLS41NTItLjU1MS0xLjQ5MS0uMjg2LTEuNjQ4LjQ3OWE1MC4wNjcgNTAuMDY3IDAgMCAwLS45MjYgNi45NjJaTTQuMjEgMjkuNzA1YS45ODguOTg4IDAgMCAwIC4yMDggMS4xbDY0Ljc3NiA2NC43NzZjLjI4OS4yOS43MjYuMzc1IDEuMS4yMDhhNDkuOTA4IDQ5LjkwOCAwIDAgMCA1LjE4NS0yLjY4NC45ODEuOTgxIDAgMCAwIC4xODMtMS41NEw4LjQzNiAyNC4zMzZhLjk4MS45ODEgMCAwIDAtMS41NDEuMTgzIDQ5Ljg5NiA0OS44OTYgMCAwIDAtMi42ODQgNS4xODVabTguNDQ4LTExLjYzMWEuOTg2Ljk4NiAwIDAgMS0uMDQ1LTEuMzU0QzIxLjc4IDYuNDYgMzUuMTExIDAgNDkuOTUyIDAgNzcuNTkyIDAgMTAwIDIyLjQwNyAxMDAgNTAuMDQ4YzAgMTQuODQtNi40NiAyOC4xNzItMTYuNzIgMzcuMzM4YS45ODYuOTg2IDAgMCAxLTEuMzU0LS4wNDVMMTIuNjU5IDE4LjA3NFoiLz48L3N2Zz4=" },
};
/** Display names for screen readers and the trademark note. */
export const BRAND_NAME: Record<string, string> = { slack: "Slack", notion: "Notion", "google-calendar": "Google Calendar", gmail: "Gmail", "google-drive": "Google Drive", obsidian: "Obsidian", figma: "Figma", github: "GitHub", linear: "Linear" };
/** @deprecated use BRAND_LOGO */
export const BRAND_MARK = BRAND_LOGO;
export const brandTrademarkNoteMn =
  "Slack, Notion, Google Calendar, Gmail, Google Drive, Obsidian, Figma, GitHub, Linear нь эзэмшигчдийнхээ бүртгэлтэй барааны тэмдэг. Лого нь зөвхөн мэдээллийн эх сурвалжийг заана; түншлэл, дэмжлэгийг илэрхийлэхгүй.";

const BRAND_THEME_CSS = `.ts-brand-swap .ts-brand-d{display:none!important}:where(.dark,[data-theme=dark]) .ts-brand-swap .ts-brand-l{display:none!important}:where(.dark,[data-theme=dark]) .ts-brand-swap .ts-brand-d{display:block!important}`;

/** The source-kind icon on its tile: token background, token border, currentColor glyph — the same in both themes. */
export function SourceIcon({ kind, size = 16, tile = true, logo, brand }: { kind: SourceKind; size?: number; tile?: boolean; logo?: React.ReactNode; brand?: string }) {
  // A brand shows its logo; without one (demos may not name brands) it falls back to the document line icon.
  const brandKey = brand ? brand.toLowerCase().replace(/\s+/g, "-") : "";
  const found = brandKey ? BRAND_LOGO[brandKey] : undefined;
  if (found) {
    const img = (src: string, cls: string) => <img className={cls} src={src} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: "contain", flex: "none" }} />;
    const logo = (
      <span className={found.dark ? "ts-brand ts-brand-swap" : "ts-brand"} role="img" aria-label={BRAND_NAME[brandKey] ?? brand} style={{ display: "inline-grid", placeItems: "center", width: size, height: size, flex: "none" }}>
        {found.dark && <style>{BRAND_THEME_CSS}</style>}
        {img(found.light, "ts-brand-l")}
        {found.dark && img(found.dark, "ts-brand-d")}
      </span>
    );
    if (!tile) return logo;
    return <span className="sp-tile" style={{ display: "inline-grid", placeItems: "center", flex: "none", boxSizing: "border-box", width: size + 12, height: size + 12, border: "1px solid var(--ts-faint)", borderRadius: "var(--ts-radius, 6px)", background: "var(--ts-soft)" }}>{logo}</span>;
  }
  const glyph = kind === "brand" && logo
    ? <span className="sp-letter" style={{ display: "grid", placeItems: "center", width: size, height: size, flex: "none", overflow: "hidden" }}>{logo}</span>
    : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{SOURCE_ICON[kind === "brand" ? "document" : kind]}</svg>;
  if (!tile) return glyph;
  return (
    <span
      className="sp-tile"
      style={{ display: "inline-grid", placeItems: "center", flex: "none", boxSizing: "border-box", width: size + 12, height: size + 12, border: "1px solid var(--ts-faint)", borderRadius: "var(--ts-radius, 6px)", background: "var(--ts-soft)", color: "var(--ts-fg)" }}
      aria-hidden="true"
    >
      {glyph}
    </span>
  );
}

function KindIcon({ source, size = 16 }: { source: PreviewSource; size?: number }) {
  return <SourceIcon kind={source.kind} size={size} tile={false} logo={source.logo} brand={source.brand} />;
}

function Marked({ text, mark }: { text: string; mark?: string }) {
  const i = mark ? text.indexOf(mark) : -1;
  if (!mark || i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{mark}</mark>{text.slice(i + mark.length)}</>;
}

const CSS = `
.sp{position:relative;display:inline-block;font-family:var(--ts-font,Inter,system-ui,sans-serif);color:var(--ts-fg)}
.sp-chip{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:inherit;font-weight:500;font-size:14px;line-height:1;cursor:pointer;max-width:280px}
.sp-chip>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sp-chip:hover{border-color:var(--ts-faint)}
.sp-chip[aria-expanded="true"]{border-color:var(--ts-electric);color:var(--ts-electric-fg)}
.sp-chip:focus-visible,.sp-open:focus-visible,.sp-x:focus-visible{outline:2px solid var(--ts-electric);outline-offset:2px}
.sp-pop{position:absolute;left:0;z-index:20;width:340px;max-width:calc(100vw - 32px);padding:16px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);box-shadow:var(--ts-elevation);animation:sp-in .16s ease-out both}
.sp-pop[data-placement="bottom"]{top:calc(100% + 8px)}.sp-pop[data-placement="top"]{bottom:calc(100% + 8px)}
@keyframes sp-in{from{opacity:0;transform:translateY(4px)}}
@media (prefers-reduced-motion:reduce){.sp-pop{animation:none}}
.sp-head{display:grid;grid-template-columns:30px 1fr auto;gap:12px;align-items:start}
.sp-tile{display:inline-grid;place-items:center;flex:none;box-sizing:border-box;border:1px solid var(--ts-faint);border-radius:var(--ts-radius,6px);background:var(--ts-soft);color:var(--ts-fg)}
.sp-letter{display:grid;place-items:center;width:100%;height:100%;font-weight:600;font-size:12px;line-height:1}
.sp-letter img,.sp-letter svg{width:100%;height:100%;object-fit:contain}
.sp-title{font-weight:600;font-size:16px;line-height:1.3;margin:0}
.sp-meta{font:400 12px/1.4 var(--ts-mono,"IBM Plex Mono",monospace);letter-spacing:.04em;text-transform:uppercase;color:var(--ts-faint);margin-top:4px}
.sp-x{width:28px;height:28px;display:grid;place-items:center;border:0;border-radius:var(--ts-radius,6px);background:none;color:var(--ts-muted);cursor:pointer}
.sp-x:hover{background:var(--ts-soft)}
.sp-quote{margin:14px 0 0;padding:0 0 0 12px;border-left:2px solid var(--ts-line);font-weight:400;font-size:14px;line-height:1.55;color:var(--ts-muted)}
.sp-quote mark{background:var(--ts-electric-soft);color:var(--ts-fg);padding:0 2px;border-radius:2px}
.sp-foot{display:flex;justify-content:flex-end;margin-top:14px}
.sp-open{display:inline-flex;align-items:stretch;min-height:44px;border:0;border-radius:var(--ts-radius,6px);background:var(--ts-electric);color:var(--ts-on-electric);font-weight:500;font-size:14px;line-height:1;cursor:pointer;padding:0 0 0 16px}
.sp-open>em{font-style:normal;display:flex;align-items:center}
.sp-open>span{display:grid;place-items:center;width:44px;margin-left:16px;border-left:1.5px solid color-mix(in srgb,var(--ts-on-electric) 40%,transparent)}
.sp-open:hover{background:color-mix(in srgb,var(--ts-electric) 88%,var(--ts-on-electric))}
`;

export function SourcePreview({
  source = demoSource,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onOpenInApp,
  placement = "bottom",
  labels: labelsIn,
  className = "",
}: SourcePreviewProps) {
  const labels = { ...sourcePreviewLabelsMn, ...labelsIn, kinds: { ...sourcePreviewLabelsMn.kinds, ...labelsIn?.kinds } };
  const [inner, setInner] = React.useState(defaultOpen);
  const open = openProp ?? inner;
  const setOpen = (v: boolean) => { if (openProp === undefined) setInner(v); onOpenChange?.(v); };
  const root = React.useRef<HTMLDivElement>(null);
  const chip = React.useRef<HTMLButtonElement>(null);
  const popId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); chip.current?.focus(); } };
    const onDown = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  });

  const kindText = source.kindLabel ?? labels.kinds[source.kind];
  return (
    <div ref={root} className={`sp ${className}`}>
      <style>{CSS}</style>
      <button ref={chip} type="button" className="sp-chip" aria-expanded={open} aria-controls={popId} onClick={() => setOpen(!open)}>
        <KindIcon source={source} size={14} />
        <span>{source.title}</span>
      </button>
      {open && (
        <div id={popId} className="sp-pop" role="dialog" aria-label={source.title} data-placement={placement}>
          <div className="sp-head">
            <SourceIcon kind={source.kind} size={18} logo={source.logo} brand={source.brand} />
            <div>
              <p className="sp-title">{source.title}</p>
              <div className="sp-meta">{kindText}{source.date ? ` · ${source.date}` : ""}</div>
            </div>
            <button type="button" className="sp-x" aria-label={labels.close} onClick={() => { setOpen(false); chip.current?.focus(); }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
            </button>
          </div>
          {source.quote && <blockquote className="sp-quote"><Marked text={source.quote} mark={source.highlight} /></blockquote>}
          {onOpenInApp && (
            <div className="sp-foot">
              <button type="button" className="sp-open" onClick={() => onOpenInApp(source)}>
                <em>{labels.open}</em>
                <span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg></span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Catalog demo: the three kinds and a brand, the first one open. */
export default function SourcePreviewDemo() {
  const others: PreviewSource[] = [
    { id: "cal", title: "Үнийн хурал", kind: "calendar", kindLabel: "Календарь", date: "2026-11-14 · 10:00", quote: "Дунд түвшин нэмэх эсэхийг шийднэ." },
    { id: "msg", title: "Борлуулалтын суваг", kind: "message", date: "2026-11-15", quote: "Хямд багцаас ахиулах хүсэлт энэ сард 40 гаруй ирлээ.", highlight: "40 гаруй" },
    { id: "brand", title: "Үнийн ноорог", kind: "brand", brandName: "Самбар", kindLabel: "Апп · Самбар", date: "2026-11-16" },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px 8px 240px" }}>
      <SourcePreview defaultOpen onOpenInApp={() => {}} />
      {others.map((s) => <SourcePreview key={s.id} source={s} onOpenInApp={() => {}} />)}
    </div>
  );
}
