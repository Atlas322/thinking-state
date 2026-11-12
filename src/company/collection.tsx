import * as React from "react";
import type { Collection, CollectionItem, CollectionValue, FieldKind } from "./types";
import {
  Icon,
  PRIORITY,
  STATUS,
  STATUS_ORDER,
  priorityOf,
  statusGroup,
  typeIcon,
  typeLabel,
  type IconName,
  type StatusGroup,
} from "./icons";

/**
 * Collection — any vault `type` (project, task, decision, atomic, person,
 * area, skill, event, daily …) drawn like a Notion database / Obsidian Base.
 * Read-only: view, filter, group. Columns come from `fields` (kinds inferred
 * from values when only names are given). Views: table, board, calendar,
 * timeline, list. Status saved-view tabs (Inbox · Идэвхтэй · Хүлээгдэж буй ·
 * Дууссан · Архив) with icons and counts; tasks also get This month /
 * Recent / Weekly calendar presets.
 */

export type ResolvedField = { name: string; kind: FieldKind; label: string };
export type CollectionViewKind = "table" | "board" | "calendar" | "timeline" | "list";
export type Relation = { label: string; icon?: IconName; onClick?: () => void };

const VIEW_META: Record<CollectionViewKind, { label: string; icon: IconName }> = {
  table: { label: "Хүснэгт", icon: "table" },
  board: { label: "Самбар", icon: "kanban" },
  calendar: { label: "Хуанли", icon: "calendar-days" },
  timeline: { label: "Timeline", icon: "gantt-chart" },
  list: { label: "Жагсаалт", icon: "list" },
};
const VIEWS: CollectionViewKind[] = ["table", "board", "calendar", "timeline", "list"];

const FIELD_LABEL: Record<string, string> = {
  status: "Төлөв",
  priority: "Priority",
  area: "Area",
  subArea: "Дэд area",
  project: "Төсөл",
  owner: "Эзэн",
  due: "Хугацаа",
  date: "Огноо",
  start: "Эхлэх",
  end: "Дуусах",
  role: "Үүрэг",
  unit: "Нэгж",
  company: "Компани",
  tasks: "Task",
  tags: "Шошго",
  updated: "Шинэчилсэн",
  created: "Үүсгэсэн",
  confidence: "Итгэл",
};
const DATE_NAMES = ["due", "date", "start", "end", "deadline", "created", "updated", "day"];
const RELATION_NAMES = ["area", "subarea", "project", "company", "unit", "owner", "assignee", "person", "people", "up", "related", "agent", "manager"];
const ISO = /^\d{4}-\d{2}-\d{2}/;
const DAY = 86_400_000;

/* ───────── field kinds ───────── */

export function resolveFields(c: Collection): ResolvedField[] {
  const out: ResolvedField[] = [];
  for (const f of c.fields) {
    const name = typeof f === "string" ? f : f.name;
    if (!name || name === "title" || name === "path" || out.some((x) => x.name === name)) continue;
    const declared = typeof f === "string" ? undefined : f.kind;
    const kind = (["text", "number", "date", "select", "multi", "status", "priority", "relation", "checkbox", "url", "progress"] as string[]).includes(declared ?? "")
      ? (declared as FieldKind)
      : inferKind(name, c.items.map((i) => i.props[name]));
    out.push({ name, kind, label: (typeof f !== "string" && f.label) || FIELD_LABEL[name] || name });
  }
  return out;
}

export function inferKind(name: string, values: (CollectionValue | undefined)[]): FieldKind {
  const n = name.toLowerCase();
  const vals = values.filter((v) => v != null && v !== "");
  if (n === "status" || n === "state") return "status";
  if (n === "priority") return "priority";
  if (vals.length && vals.every((v) => typeof v === "boolean")) return "checkbox";
  if (vals.some((v) => Array.isArray(v))) return RELATION_NAMES.includes(n) ? "relation" : "multi";
  if (DATE_NAMES.includes(n) || (vals.length && vals.every((v) => typeof v === "string" && ISO.test(v)))) return "date";
  if (vals.length && vals.every((v) => typeof v === "string" && /^\d+\s*\/\s*\d+$/.test(v))) return "progress";
  if (vals.length && vals.every((v) => typeof v === "number")) return "number";
  if (vals.length && vals.every((v) => typeof v === "string" && /^https?:\/\//.test(v))) return "url";
  if (RELATION_NAMES.includes(n) || vals.some((v) => typeof v === "string" && v.startsWith("[["))) return "relation";
  const distinct = new Set(vals.map(String));
  return vals.length >= 3 && distinct.size <= Math.max(2, Math.min(8, vals.length / 2)) ? "select" : "text";
}

/** "[[02-Projects/Website/Inai Website|Site]]" → "Site"; paths → last segment. */
export const linkLabel = (v: string) => {
  const inner = v.replace(/^\[\[|\]\]$/g, "");
  const alias = inner.split("|")[1];
  return (alias ?? inner.split("/").pop() ?? inner).replace(/\.md$/, "");
};

const asList = (v: CollectionValue | undefined): string[] => (v == null || v === "" ? [] : Array.isArray(v) ? v.map(String) : [String(v)]);

const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
export const parseDay = (v: CollectionValue | undefined) => {
  if (typeof v !== "string" || !ISO.test(v)) return null;
  const t = Date.parse(`${v.slice(0, 10)}T00:00:00`);
  return Number.isFinite(t) ? t : null;
};
/** «өнөөдөр», «3 хоногийн өмнө», «12 хоногийн дараа». */
export function relativeDay(v: CollectionValue | undefined, today: Date) {
  const t = parseDay(v);
  if (t == null) return null;
  const days = Math.round((t - dayStart(today)) / DAY);
  if (days === 0) return "өнөөдөр";
  if (days === -1) return "өчигдөр";
  if (days === 1) return "маргааш";
  return days < 0 ? `${-days} хоногийн өмнө` : `${days} хоногийн дараа`;
}
const fmtDay = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/* ───────── row parts ───────── */

export function StatusPill({ value }: { value: CollectionValue | undefined }) {
  const g = statusGroup(value);
  if (!g) return value == null || value === "" ? null : <span className="cl-pill is-gray">{String(value)}</span>;
  const s = STATUS[g];
  return (
    <span className={`cl-pill is-${s.tone}`} title={String(value)}>
      <Icon name={s.icon} size={14} />
      {s.label}
    </span>
  );
}

export function PriorityBadge({ value }: { value: CollectionValue | undefined }) {
  const p = priorityOf(value);
  if (!p) return null;
  const m = PRIORITY[p];
  return (
    <span className={`cl-prio is-${m.tone}`} title={`Priority: ${m.label}`}>
      <Icon name={m.icon} size={14} />
      {m.label}
    </span>
  );
}

export function RelationChip({ rel }: { rel: Relation }) {
  const body = (
    <>
      {rel.icon && <Icon name={rel.icon} size={14} />}
      <span>{rel.label}</span>
    </>
  );
  return rel.onClick ? (
    <button type="button" className="cl-rel" onClick={rel.onClick}>
      {body}
    </button>
  ) : (
    <span className="cl-rel">{body}</span>
  );
}

export function ProgressNM({ value }: { value: CollectionValue | undefined }) {
  const m = typeof value === "string" ? value.match(/^(\d+)\s*\/\s*(\d+)$/) : null;
  if (!m) return null;
  const [done, total] = [Number(m[1]), Number(m[2])];
  return (
    <span className="cl-nm" title={`${done}/${total} task дууссан`}>
      <span className="cl-nm-bar" aria-hidden="true">
        <span style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </span>
      {done}/{total}
    </span>
  );
}

export function RelDate({ value, today, overdue }: { value: CollectionValue | undefined; today: Date; overdue?: boolean }) {
  const rel = relativeDay(value, today);
  if (!rel) return null;
  return (
    <time className={`cl-date${overdue ? " is-overdue" : ""}`} dateTime={String(value).slice(0, 10)} title={String(value).slice(0, 10)}>
      <Icon name={overdue ? "clock" : "calendar"} size={14} />
      {rel}
    </time>
  );
}

export function Empty({ text, icon = "search-x" }: { text: string; icon?: IconName }) {
  return (
    <div className="cv-empty">
      <Icon name={icon} size={20} />
      <span>{text}</span>
    </div>
  );
}

/* ───────── the view ───────── */

export type CollectionViewProps = {
  collection: Collection;
  today?: Date;
  /** Turns a relation value into a label, icon and optional scope change. */
  resolve?: (field: string, value: string) => Relation | null;
  defaultView?: CollectionViewKind;
};

type Preset = { id: string; label: string; icon: IconName; view: CollectionViewKind; range?: "month" | "recent"; calendar?: "week" | "month" };

export function CollectionView({ collection, today = new Date(), resolve, defaultView }: CollectionViewProps) {
  const fields = React.useMemo(() => resolveFields(collection), [collection]);
  const status = fields.find((f) => f.kind === "status");
  const priority = fields.find((f) => f.kind === "priority");
  const progress = fields.find((f) => f.kind === "progress");
  const dates = fields.filter((f) => f.kind === "date");
  const dateField = DATE_NAMES.map((n) => dates.find((f) => f.name.toLowerCase() === n)).find(Boolean) ?? dates[0];
  const startField = dates.find((f) => f.name.toLowerCase() === "start");
  const endField = dates.find((f) => ["end", "due", "deadline"].includes(f.name.toLowerCase()));
  const relations = fields.filter((f) => f.kind === "relation");
  const groupable = fields.filter((f) => ["status", "priority", "select", "relation", "checkbox", "multi"].includes(f.kind));

  const presets: Preset[] =
    collection.type === "task" && dateField
      ? [
          { id: "month", label: "Энэ сар", icon: "calendar", view: "list", range: "month" },
          { id: "recent", label: "Сүүлийн", icon: "clock", view: "list", range: "recent" },
          { id: "week", label: "7 хоногийн хуанли", icon: "calendar-days", view: "calendar", calendar: "week" },
        ]
      : [];
  const initialView: CollectionViewKind =
    defaultView ?? (["event", "daily"].includes(collection.type) && dateField ? "calendar" : collection.type === "project" && status ? "table" : status ? "list" : "table");

  const [view, setView] = React.useState<CollectionViewKind>(initialView);
  const [tab, setTab] = React.useState<StatusGroup | "all">("all");
  const [preset, setPreset] = React.useState<string | null>(null);
  const [filterField, setFilterField] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [groupBy, setGroupBy] = React.useState("");
  const [calMode, setCalMode] = React.useState<"month" | "week">("month");
  const [cursor, setCursor] = React.useState(() => dayStart(today));
  const [moreTabs, setMoreTabs] = React.useState(false);
  const [folded, setFolded] = React.useState<Record<string, boolean>>({});

  const isDone = (i: CollectionItem) => {
    const g = status ? statusGroup(i.props[status.name]) : null;
    return g === "done" || g === "canceled" || g === "archived";
  };
  const overdueOf = (i: CollectionItem) => {
    if (!endField || isDone(i)) return false;
    const t = parseDay(i.props[endField.name]);
    return t != null && t < dayStart(today);
  };

  // status saved-view tabs
  const counts = new Map<StatusGroup, number>();
  if (status) for (const i of collection.items) {
    const g = statusGroup(i.props[status.name]);
    if (g) counts.set(g, (counts.get(g) ?? 0) + 1);
  }
  const groupsPresent = STATUS_ORDER.filter((g) => counts.get(g));
  const visibleTabs = moreTabs ? groupsPresent : groupsPresent.slice(0, 4);

  const active = presets.find((p) => p.id === preset) ?? null;
  const items = collection.items.filter((i) => {
    if (status && tab !== "all" && statusGroup(i.props[status.name]) !== tab) return false;
    if (filterField && filterValue && !asList(i.props[filterField]).includes(filterValue)) return false;
    if (active?.range && dateField) {
      const t = parseDay(i.props[dateField.name]);
      if (t == null) return false;
      const now = new Date(dayStart(today));
      if (active.range === "month" && (new Date(t).getMonth() !== now.getMonth() || new Date(t).getFullYear() !== now.getFullYear())) return false;
      if (active.range === "recent" && (t > now.getTime() || now.getTime() - t > 14 * DAY)) return false;
    }
    return true;
  });
  if (active?.range === "recent" && dateField) items.sort((a, b) => (parseDay(b.props[dateField.name]) ?? 0) - (parseDay(a.props[dateField.name]) ?? 0));

  const rels = (i: CollectionItem, only?: string): Relation[] =>
    relations
      .filter((f) => !only || f.name === only)
      .flatMap((f) => asList(i.props[f.name]).map((v) => resolve?.(f.name, v) ?? { label: linkLabel(v), icon: f.name.toLowerCase().includes("area") ? ("layout-grid" as IconName) : ("link" as IconName) }));

  const itemIcon = (i: CollectionItem): IconName => (collection.type === "task" && isDone(i) ? "circle-check" : typeIcon(collection.type));

  const pickPreset = (p: Preset | null) => {
    setPreset(p?.id ?? null);
    if (p) {
      setView(p.view);
      if (p.calendar) setCalMode(p.calendar);
    }
  };

  const cell = (i: CollectionItem, f: { name: string; kind: FieldKind }) => {
    const v = i.props[f.name];
    switch (f.kind) {
      case "status":
        return <StatusPill value={v} />;
      case "priority":
        return <PriorityBadge value={v} />;
      case "progress":
        return <ProgressNM value={v} />;
      case "date":
        return <RelDate value={v} today={today} overdue={f.name === endField?.name && overdueOf(i)} />;
      case "relation":
        return (
          <span className="cl-rels">
            {rels(i, f.name).map((r, k) => (
              <RelationChip key={r.label + k} rel={r} />
            ))}
          </span>
        );
      case "multi":
        return (
          <span className="cl-rels">
            {asList(v).map((t) => (
              <span key={t} className="cl-tag">
                {t}
              </span>
            ))}
          </span>
        );
      case "checkbox":
        return v ? <Icon name="check" size={14} label="тийм" /> : null;
      case "url":
        return typeof v === "string" ? (
          <a className="cl-url" href={v} target="_blank" rel="noreferrer noopener">
            <Icon name="link" size={14} />
            {v.replace(/^https?:\/\//, "").slice(0, 32)}
          </a>
        ) : null;
      case "select":
        return v == null || v === "" ? null : <span className="cl-tag">{String(v)}</span>;
      default:
        return v == null || v === "" ? null : <span className="cl-text">{Array.isArray(v) ? v.join(", ") : String(v)}</span>;
    }
  };

  const title = (i: CollectionItem) => (
    <span className="cl-title">
      <Icon name={itemIcon(i)} size={16} className={collection.type === "task" && isDone(i) ? "is-done" : ""} />
      <span className="cl-title-t" title={i.path}>
        {i.title}
      </span>
    </span>
  );

  // grouping (table, list) and board columns
  const groupKey = (i: CollectionItem, f: ResolvedField) => {
    if (f.kind === "status") return statusGroup(i.props[f.name]) ?? "";
    if (f.kind === "priority") return priorityOf(i.props[f.name]) ?? "";
    const list = asList(i.props[f.name]);
    return list[0] ?? "";
  };
  const groupLabel = (f: ResolvedField, key: string) => {
    if (!key) return "Хоосон";
    if (f.kind === "status") return STATUS[key as StatusGroup]?.label ?? key;
    if (f.kind === "priority") return PRIORITY[key as keyof typeof PRIORITY]?.label ?? key;
    if (f.kind === "relation") return resolve?.(f.name, key)?.label ?? linkLabel(key);
    return key;
  };
  const groupsOf = (f: ResolvedField, list: CollectionItem[]) => {
    const keys: string[] = [];
    for (const i of list) {
      const k = groupKey(i, f);
      if (!keys.includes(k)) keys.push(k);
    }
    if (f.kind === "status") keys.sort((a, b) => STATUS_ORDER.indexOf(a as StatusGroup) - STATUS_ORDER.indexOf(b as StatusGroup));
    if (f.kind === "priority") keys.sort((a, b) => ["high", "medium", "low", ""].indexOf(a) - ["high", "medium", "low", ""].indexOf(b));
    return keys.map((k) => ({ key: k, items: list.filter((i) => groupKey(i, f) === k) }));
  };
  const groupHead = (f: ResolvedField, key: string, n: number, id: string) => (
    <button type="button" className="cl-group-h" aria-expanded={!folded[id]} onClick={() => setFolded((s) => ({ ...s, [id]: !s[id] }))}>
      <Icon name="chevron-right" size={14} className="cl-chev" />
      {f.kind === "status" && key ? <StatusPill value={key} /> : f.kind === "priority" && key ? <PriorityBadge value={key} /> : <span className="cl-group-t">{groupLabel(f, key)}</span>}
      <span className="cl-count">{n}</span>
    </button>
  );

  const shown = fields.filter((f) => f.kind !== "text" || fields.length <= 6).slice(0, 8);
  const table = (list: CollectionItem[]) => (
    <div className="cl-table-wrap" tabIndex={0} role="region" aria-label={`${typeLabel(collection.type)} хүснэгт`}>
      <table className="cl-table">
        <thead>
          <tr>
            <th scope="col">Нэр</th>
            {shown.map((f) => (
              <th key={f.name} scope="col">
                {f.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((i, k) => (
            <tr key={i.id} style={{ "--i": k } as React.CSSProperties}>
              <th scope="row">{title(i)}</th>
              {shown.map((f) => (
                <td key={f.name}>{cell(i, f)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  const row = (i: CollectionItem, k: number) => (
    <li key={i.id} className="cl-row" style={{ "--i": k } as React.CSSProperties}>
      {status && <StatusPill value={i.props[status.name]} />}
      {title(i)}
      <span className="cl-row-meta">
        {rels(i).map((r, j) => (
          <RelationChip key={r.label + j} rel={r} />
        ))}
        {priority && <PriorityBadge value={i.props[priority.name]} />}
        {progress && <ProgressNM value={i.props[progress.name]} />}
        {dateField && <RelDate value={i.props[(endField ?? dateField).name] ?? i.props[dateField.name]} today={today} overdue={overdueOf(i)} />}
      </span>
    </li>
  );
  const list = (l: CollectionItem[]) => <ul className="cl-list">{l.map(row)}</ul>;

  const grouped = (render: (l: CollectionItem[]) => React.ReactNode) => {
    const f = fields.find((x) => x.name === groupBy);
    if (!f) return render(items);
    return (
      <div className="cl-groups">
        {groupsOf(f, items).map((g) => {
          const id = `${f.name}:${g.key}`;
          return (
            <section key={id} className="cl-group" aria-label={groupLabel(f, g.key)}>
              {groupHead(f, g.key, g.items.length, id)}
              {!folded[id] && render(g.items)}
            </section>
          );
        })}
      </div>
    );
  };

  const board = () => {
    const f = fields.find((x) => x.name === groupBy) ?? status ?? groupable[0];
    if (!f) return <Empty text="Самбарт бүлэглэх талбар алга." icon="kanban" />;
    return (
      <div className="cl-board" role="list">
        {groupsOf(f, items).map((g) => (
          <section key={g.key} className="cl-col" role="listitem" aria-label={groupLabel(f, g.key)}>
            <header className="cl-col-h">
              {f.kind === "status" && g.key ? <StatusPill value={g.key} /> : <span className="cl-group-t">{groupLabel(f, g.key)}</span>}
              <span className="cl-count">{g.items.length}</span>
            </header>
            <ul className="cl-cards">
              {g.items.map((i, k) => (
                <li key={i.id} className="cl-card" style={{ "--i": k } as React.CSSProperties}>
                  {title(i)}
                  <span className="cl-row-meta">
                    {rels(i).map((r, j) => (
                      <RelationChip key={r.label + j} rel={r} />
                    ))}
                  </span>
                  <span className="cl-row-meta">
                    {priority && <PriorityBadge value={i.props[priority.name]} />}
                    {progress && <ProgressNM value={i.props[progress.name]} />}
                    {dateField && <RelDate value={i.props[(endField ?? dateField).name] ?? i.props[dateField.name]} today={today} overdue={overdueOf(i)} />}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  };

  const calendar = () => {
    if (!dateField) return <Empty text="Огнооны талбар алга." icon="calendar" />;
    const c = new Date(cursor);
    const start =
      calMode === "week"
        ? cursor - ((c.getDay() + 6) % 7) * DAY
        : (() => {
            const first = new Date(c.getFullYear(), c.getMonth(), 1);
            return first.getTime() - ((first.getDay() + 6) % 7) * DAY;
          })();
    const days = calMode === "week" ? 7 : 42;
    const cells = Array.from({ length: days }, (_, k) => dayStart(new Date(start + k * DAY + 3_600_000)));
    const byDay = new Map<number, CollectionItem[]>();
    for (const i of items) {
      const t = parseDay(i.props[dateField.name]);
      if (t != null) byDay.set(t, [...(byDay.get(t) ?? []), i]);
    }
    const shift = (n: number) => {
      const d = new Date(cursor);
      if (calMode === "week") setCursor(dayStart(new Date(cursor + n * 7 * DAY + 3_600_000)));
      else setCursor(new Date(d.getFullYear(), d.getMonth() + n, 1).getTime());
    };
    const title = calMode === "week" ? `${fmtDay(cells[0])} – ${fmtDay(cells[6])}` : `${c.getFullYear()} оны ${c.getMonth() + 1}-р сар`;
    return (
      <div className="cl-cal">
        <div className="cl-cal-bar">
          <button type="button" onClick={() => shift(-1)} aria-label="Өмнөх">
            <Icon name="chevron-left" size={16} />
          </button>
          <strong>{title}</strong>
          <button type="button" onClick={() => shift(1)} aria-label="Дараах">
            <Icon name="chevron-right" size={16} />
          </button>
          <button type="button" className="cl-today" onClick={() => setCursor(dayStart(today))}>
            Өнөөдөр
          </button>
          <span className="cl-seg" role="radiogroup" aria-label="Хуанлийн хүрээ">
            {(["month", "week"] as const).map((m) => (
              <button key={m} type="button" role="radio" aria-checked={calMode === m} data-active={calMode === m || undefined} onClick={() => setCalMode(m)}>
                {m === "month" ? "Сар" : "7 хоног"}
              </button>
            ))}
          </span>
        </div>
        <div className={`cl-cal-grid is-${calMode}`} role="grid" aria-label={title}>
          {["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"].map((d) => (
            <span key={d} className="cl-cal-dow" role="columnheader">
              {d}
            </span>
          ))}
          {cells.map((t) => {
            const list = byDay.get(t) ?? [];
            const inMonth = calMode === "week" || new Date(t).getMonth() === c.getMonth();
            return (
              <div key={t} role="gridcell" className={`cl-cal-cell${inMonth ? "" : " is-out"}${t === dayStart(today) ? " is-today" : ""}`} aria-label={`${fmtDay(t)}, ${list.length}`}>
                <span className="cl-cal-n">{new Date(t).getDate()}</span>
                {list.slice(0, calMode === "week" ? 8 : 3).map((i) => (
                  <span key={i.id} className={`cl-cal-item${status ? ` is-${STATUS[statusGroup(i.props[status.name]) ?? "inbox"].tone}` : ""}`} title={i.title}>
                    <Icon name={itemIcon(i)} size={14} />
                    {i.title}
                  </span>
                ))}
                {list.length > (calMode === "week" ? 8 : 3) && <span className="cl-cal-more">+{list.length - (calMode === "week" ? 8 : 3)}</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const timeline = () => {
    const from = startField ?? dateField;
    if (!from) return <Empty text="Огнооны талбар алга." icon="gantt-chart" />;
    const rows = items
      .map((i) => {
        const s = parseDay(i.props[from.name]);
        const e = endField ? parseDay(i.props[endField.name]) : null;
        return s != null ? { i, s, e: Math.max(s + DAY, e ?? s + DAY) } : e != null ? { i, s: e - DAY, e } : null;
      })
      .filter((x): x is { i: CollectionItem; s: number; e: number } => !!x)
      .sort((a, b) => a.s - b.s);
    if (!rows.length) return <Empty text="Эхлэх эсвэл дуусах огноотой мөр алга." icon="gantt-chart" />;
    const lo = Math.min(...rows.map((r) => r.s));
    const hi = Math.max(...rows.map((r) => r.e));
    const span = Math.max(DAY, hi - lo);
    const pct = (t: number) => ((t - lo) / span) * 100;
    const months: { at: number; label: string }[] = [];
    const d = new Date(lo);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    for (let g = 0; d.getTime() < hi && g < 36; g++) {
      const m = String(d.getMonth() + 1).padStart(2, "0");
      months.push({ at: pct(d.getTime()), label: d.getMonth() === 0 || !months.length ? `${d.getFullYear()}.${m}` : m });
      d.setMonth(d.getMonth() + 1);
    }
    const now = dayStart(today);
    return (
      <div className="cl-tl">
        <div className="cl-tl-scale" aria-hidden="true">
          {months.map((m) => (
            <span key={m.label + m.at} style={{ left: `${m.at}%` }}>
              {m.label}
            </span>
          ))}
        </div>
        <ol className="cl-tl-rows">
          {rows.map(({ i, s, e }, k) => {
            const g = status ? statusGroup(i.props[status.name]) : null;
            return (
              <li key={i.id} style={{ "--i": k } as React.CSSProperties}>
                <span className="cl-tl-label">{title(i)}</span>
                <span className="cl-tl-track">
                  {months.map((m) => (
                    <i key={m.label + m.at} className="cl-tl-grid" style={{ left: `${m.at}%` }} />
                  ))}
                  <span
                    className={`cl-tl-bar is-${g ? STATUS[g].tone : "gray"}${overdueOf(i) ? " is-overdue" : ""}`}
                    style={{ left: `${pct(s)}%`, width: `${Math.max(1.2, pct(e) - pct(s))}%` }}
                    title={`${fmtDay(s)} → ${fmtDay(e)}`}
                  />
                  {now >= lo && now <= hi && <i className="cl-tl-today" style={{ left: `${pct(now)}%` }} />}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  };

  const filterValues = filterField ? Array.from(new Set(collection.items.flatMap((i) => asList(i.props[filterField])))).sort() : [];
  const label = collection.label ?? typeLabel(collection.type);

  return (
    <div className="cl" data-type={collection.type}>
      {status && groupsPresent.length > 0 && (
        <div className="cl-tabs" role="tablist" aria-label={`${label} — төлөв`}>
          <button type="button" role="tab" aria-selected={tab === "all"} onClick={() => setTab("all")}>
            <Icon name="list" size={14} />
            Бүгд <span className="cl-count">{collection.items.length}</span>
          </button>
          {visibleTabs.map((g) => (
            <button key={g} type="button" role="tab" aria-selected={tab === g} onClick={() => setTab(g)} className={`is-${STATUS[g].tone}`}>
              <Icon name={STATUS[g].icon} size={14} />
              {STATUS[g].label} <span className="cl-count">{counts.get(g)}</span>
            </button>
          ))}
          {groupsPresent.length > 4 && (
            <button type="button" className="cl-more" aria-expanded={moreTabs} onClick={() => setMoreTabs((m) => !m)}>
              <Icon name="ellipsis" size={14} />
              {moreTabs ? "Цөөн" : `${groupsPresent.length - 4} more`}
            </button>
          )}
        </div>
      )}
      <div className="cl-bar">
        <span className="cl-seg cl-views" role="radiogroup" aria-label="Харагдац">
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              data-active={view === v || undefined}
              title={VIEW_META[v].label}
              onClick={() => {
                setView(v);
                setPreset(null);
              }}
            >
              <Icon name={VIEW_META[v].icon} size={16} />
              <span className="cl-vlabel">{VIEW_META[v].label}</span>
            </button>
          ))}
        </span>
        {presets.length > 0 && (
          <span className="cl-presets" role="group" aria-label="Бэлэн харагдац">
            {presets.map((p) => (
              <button key={p.id} type="button" aria-pressed={preset === p.id} onClick={() => pickPreset(preset === p.id ? null : p)}>
                <Icon name={p.icon} size={14} />
                {p.label}
              </button>
            ))}
          </span>
        )}
        <span className="cl-tools">
          <label className="cl-select">
            <Icon name="filter" size={14} />
            <span className="cv-sr">Шүүх талбар</span>
            <select
              value={filterField}
              onChange={(e) => {
                setFilterField(e.target.value);
                setFilterValue("");
              }}
            >
              <option value="">Шүүлтгүй</option>
              {fields
                .filter((f) => f.kind !== "text" && f.kind !== "url")
                .map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.label}
                  </option>
                ))}
            </select>
          </label>
          {filterField && (
            <label className="cl-select">
              <span className="cv-sr">Шүүх утга</span>
              <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                <option value="">Бүгд</option>
                {filterValues.map((v) => (
                  <option key={v} value={v}>
                    {linkLabel(v)}
                  </option>
                ))}
              </select>
            </label>
          )}
          {(view === "table" || view === "list" || view === "board") && (
            <label className="cl-select">
              <Icon name="layers" size={14} />
              <span className="cv-sr">Бүлэглэх</span>
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="">{view === "board" ? "Төлвөөр" : "Бүлэглэлгүй"}</option>
                {groupable.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </span>
      </div>
      <div className="cl-body" key={`${view}-${tab}-${preset}`}>
        {items.length === 0 ? (
          <Empty text="Энэ харагдацад мөр алга." />
        ) : view === "table" ? (
          grouped(table)
        ) : view === "list" ? (
          grouped(list)
        ) : view === "board" ? (
          board()
        ) : view === "calendar" ? (
          calendar()
        ) : (
          timeline()
        )}
      </div>
    </div>
  );
}

export const collectionCss = `
.cv-empty{display:flex;flex-direction:column;align-items:center;gap:8px}
.cv-empty .cv-icon{color:var(--cv-faint)}
.cv-icon{flex:none;vertical-align:-3px}
.cl{display:flex;flex-direction:column;gap:10px;min-width:0}
.cl-tabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid var(--cv-line)}
.cl-tabs::-webkit-scrollbar{display:none}
.cl-tabs button{position:relative;flex:none;display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 10px;border:0;background:none;color:var(--cv-muted);font-size:13px;font-weight:500;white-space:nowrap}
.cl-tabs button:hover{color:var(--cv-fg)}
.cl-tabs button[aria-selected=true]{color:var(--cv-fg)}
.cl-tabs button[aria-selected=true]::after{content:"";position:absolute;left:8px;right:8px;bottom:-1px;height:2px;border-radius:1px;background:var(--cv-fg)}
.cl-count{min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--cv-soft);color:var(--cv-muted);font-size:11.5px;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
.cl-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.cl-seg{display:inline-flex;gap:2px;padding:2px;border-radius:8px;background:var(--cv-soft)}
.cl-seg button{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:0;border-radius:6px;background:none;color:var(--cv-muted);font-size:12.5px;font-weight:500;white-space:nowrap}
.cl-seg button[data-active]{background:var(--cv-seg-on);color:var(--cv-fg);box-shadow:0 0 0 .5px #0000000f,0 1px 2px #0000000d}
.cl-presets{display:inline-flex;flex-wrap:wrap;gap:4px}
.cl-presets button{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 9px;border:1px solid var(--cv-line);border-radius:14px;background:var(--cv-bg);color:var(--cv-muted);font-size:12.5px}
.cl-presets button[aria-pressed=true]{border-color:var(--cv-fg);color:var(--cv-fg)}
.cl-tools{display:inline-flex;flex-wrap:wrap;gap:6px;margin-left:auto}
.cl-select{display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 4px 0 8px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);color:var(--cv-muted)}
.cl-select select{height:28px;max-width:150px;border:0;background:none;color:var(--cv-fg);font:inherit;font-size:12.5px}
.cl-body{animation:cv-fade .2s ease both}
.cl-pill{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 7px 0 5px;border-radius:11px;font-size:12px;font-weight:500;white-space:nowrap}
.cl-pill.is-gray{background:var(--cv-soft);color:var(--cv-muted)}
.cl-pill.is-yellow{background:var(--cv-yellow-soft);color:color-mix(in srgb,var(--cv-yellow) 80%,var(--cv-fg))}
.cl-pill.is-blue{background:var(--cv-accent-soft);color:color-mix(in srgb,var(--cv-accent) 72%,var(--cv-fg))}
.cl-pill.is-green{background:var(--cv-green-soft);color:color-mix(in srgb,var(--cv-green) 78%,var(--cv-fg))}
.cl-pill.is-red{background:var(--cv-red-soft);color:color-mix(in srgb,var(--cv-red) 82%,var(--cv-fg))}
.cl-prio{display:inline-flex;align-items:center;gap:3px;height:22px;padding:0 7px 0 5px;border-radius:6px;font-size:12px;font-weight:500;white-space:nowrap}
.cl-prio.is-red{background:var(--cv-red-soft);color:color-mix(in srgb,var(--cv-red) 82%,var(--cv-fg))}
.cl-prio.is-yellow{background:var(--cv-yellow-soft);color:color-mix(in srgb,var(--cv-yellow) 80%,var(--cv-fg))}
.cl-prio.is-gray{background:var(--cv-soft);color:var(--cv-muted)}
.cl-rels{display:inline-flex;flex-wrap:wrap;gap:4px}
.cl-rel{display:inline-flex;align-items:center;gap:4px;max-width:200px;height:22px;padding:0 7px 0 5px;border:0;border-radius:6px;background:none;color:var(--cv-fg);font-size:12.5px;text-decoration:underline;text-decoration-color:var(--cv-line);text-underline-offset:3px;white-space:nowrap}
.cl-rel span{overflow:hidden;text-overflow:ellipsis}
.cl-rel .cv-icon{color:var(--cv-muted)}
button.cl-rel:hover{background:var(--cv-soft);text-decoration-color:var(--cv-faint)}
.cl-tag{display:inline-flex;align-items:center;height:20px;padding:0 6px;border-radius:5px;background:var(--cv-soft);font-size:12px;white-space:nowrap}
.cl-nm{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--cv-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.cl-nm-bar{position:relative;width:44px;height:5px;border-radius:3px;background:var(--cv-soft);overflow:hidden}
.cl-nm-bar span{position:absolute;inset:0 auto 0 0;border-radius:3px;background:var(--cv-green)}
.cl-date{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--cv-muted);white-space:nowrap}
.cl-date.is-overdue{color:color-mix(in srgb,var(--cv-red) 85%,var(--cv-fg));font-weight:500}
.cl-url{display:inline-flex;align-items:center;gap:4px;color:var(--cv-accent);font-size:12.5px;text-decoration:none}
.cl-text{font-size:13px;color:var(--cv-fg)}
.cl-title{display:inline-flex;align-items:center;gap:8px;min-width:0}
.cl-title .cv-icon{color:var(--cv-muted)}
.cl-title .cv-icon.is-done{color:var(--cv-green)}
.cl-title-t{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}
.cl-table-wrap{overflow-x:auto;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cl-table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px}
.cl-table th,.cl-table td{padding:8px 10px;border-bottom:1px solid var(--cv-line);text-align:left;vertical-align:middle;white-space:nowrap}
.cl-table tbody tr:last-child>*{border-bottom:0}
.cl-table thead th{font-size:12px;font-weight:500;color:var(--cv-muted)}
.cl-table th[scope=row]{position:sticky;left:0;z-index:1;max-width:280px;background:var(--cv-bg);font-weight:400;border-right:1px solid var(--cv-line)}
.cl-table tbody tr{animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 25ms)}
.cl-table tbody tr:hover>*{background:color-mix(in srgb,var(--cv-soft) 60%,var(--cv-bg))}
.cl-list,.cl-cards{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}
.cl-row{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:8px 10px;border-radius:9px;animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 25ms)}
.cl-row:hover{background:var(--cv-soft)}
.cl-row .cl-title{flex:1 1 200px}
.cl-row-meta{display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px}
.cl-groups{display:flex;flex-direction:column;gap:10px}
.cl-group-h{display:flex;align-items:center;gap:8px;width:100%;height:34px;padding:0 6px;border:0;border-bottom:1px solid var(--cv-line);background:none;text-align:left}
.cl-chev{color:var(--cv-faint);transform:rotate(90deg);transition:transform .2s}
.cl-group-h[aria-expanded=false] .cl-chev{transform:none}
.cl-group-t{font-weight:600;font-size:13px}
.cl-group>.cl-table-wrap,.cl-group>.cl-list{margin-top:6px}
.cl-board{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);gap:10px;overflow-x:auto;padding-bottom:4px}
.cl-col{display:flex;flex-direction:column;gap:8px;min-width:0;padding:8px;border-radius:12px;background:var(--cv-soft)}
.cl-col-h{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 2px 0}
.cl-col .cl-count{background:var(--cv-bg)}
.cl-cards{gap:6px}
.cl-card{display:flex;flex-direction:column;gap:6px;padding:10px;border:1px solid var(--cv-line);border-radius:10px;background:var(--cv-bg);animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 35ms)}
.cl-card .cl-row-meta:empty{display:none}
.cl-cal{display:flex;flex-direction:column;gap:8px}
.cl-cal-bar{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.cl-cal-bar>button{display:inline-grid;place-items:center;height:30px;min-width:30px;padding:0 8px;border:1px solid var(--cv-line);border-radius:8px;background:var(--cv-bg);font-size:12.5px}
.cl-cal-bar strong{min-width:150px;text-align:center;font-size:14px}
.cl-cal-bar .cl-seg{margin-left:auto}
.cl-cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border:1px solid var(--cv-line);border-radius:12px;overflow:hidden;background:var(--cv-line);gap:1px}
.cl-cal-dow{padding:6px 8px;background:var(--cv-bg);font-size:11.5px;font-weight:600;color:var(--cv-muted)}
.cl-cal-cell{display:flex;flex-direction:column;gap:3px;min-height:92px;min-width:0;padding:6px;background:var(--cv-bg)}
.cl-cal-grid.is-week .cl-cal-cell{min-height:180px}
.cl-cal-cell.is-out{background:var(--cv-page);color:var(--cv-faint)}
.cl-cal-n{font-size:12px;font-weight:500;color:var(--cv-muted)}
.cl-cal-cell.is-today .cl-cal-n{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--cv-red);color:#fff}
.cl-cal-item{display:flex;align-items:center;gap:4px;min-width:0;padding:2px 5px;border-radius:5px;background:var(--cv-soft);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cl-cal-item .cv-icon{color:var(--cv-muted)}
.cl-cal-item.is-yellow{background:var(--cv-yellow-soft)}.cl-cal-item.is-blue{background:var(--cv-accent-soft)}.cl-cal-item.is-green{background:var(--cv-green-soft)}.cl-cal-item.is-red{background:var(--cv-red-soft)}
.cl-cal-more{font-size:11.5px;color:var(--cv-muted)}
.cl-tl{display:flex;flex-direction:column;gap:6px;padding:12px;border:1px solid var(--cv-line);border-radius:12px;background:var(--cv-bg)}
.cl-tl-scale{position:relative;height:16px;margin-left:var(--tl,220px);font-size:11px;color:var(--cv-faint)}
.cl-tl-scale span{position:absolute;transform:translateX(-50%);white-space:nowrap}
.cl-tl-rows{display:flex;flex-direction:column;gap:4px;margin:0;padding:0;list-style:none}
.cl-tl-rows li{display:grid;grid-template-columns:var(--tl,220px) 1fr;align-items:center;min-height:28px;animation:cv-in .28s cubic-bezier(.2,.8,.3,1) both;animation-delay:calc(var(--i,0) * 30ms)}
.cl-tl-label{min-width:0;padding-right:10px;font-size:13px}
.cl-tl-track{position:relative;height:20px}
.cl-tl-grid{position:absolute;top:-4px;bottom:-4px;width:1px;background:var(--cv-line)}
.cl-tl-bar{position:absolute;top:4px;height:12px;border-radius:4px;transform-origin:left;animation:cv-grow .5s cubic-bezier(.2,.8,.3,1) .1s both}
.cl-tl-bar.is-gray{background:color-mix(in srgb,var(--cv-faint) 60%,var(--cv-bg))}
.cl-tl-bar.is-yellow{background:var(--cv-yellow)}.cl-tl-bar.is-blue{background:var(--cv-accent)}.cl-tl-bar.is-green{background:var(--cv-green)}.cl-tl-bar.is-red{background:var(--cv-red)}
.cl-tl-bar.is-overdue{box-shadow:0 0 0 2px var(--cv-red-soft),inset 0 0 0 1.5px var(--cv-red)}
.cl-tl-today{position:absolute;top:-5px;bottom:-5px;width:2px;margin-left:-1px;background:var(--cv-red);opacity:.75}
@container cv (max-width:700px){.cl-vlabel{display:none}.cl-tools{margin-left:0}}
@container cv (max-width:560px){.cl-cal-cell{min-height:64px;padding:4px}.cl-cal-item{font-size:0;padding:3px}.cl-cal-item .cv-icon{width:12px;height:12px}.cl-cal-grid.is-week .cl-cal-item{font-size:11px}.cl-tl{--tl:0px}.cl-tl-rows li{grid-template-columns:1fr}.cl-board{grid-auto-columns:minmax(220px,85%)}}
`;
