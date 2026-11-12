"use client";
import * as React from "react";

// Neutral marks: tools by kind of system, model calls by one generic glyph.
const toolMarks: Record<string, React.ReactNode> = {
  "хувилбарын хяналт": (
    <svg viewBox="0 0 16 16">
      <circle cx="5" cy="3.5" r="1.6" />
      <circle cx="5" cy="12.5" r="1.6" />
      <circle cx="11" cy="6" r="1.6" />
      <path d="M5 5.1v5.8M11 7.6c0 2-2 2.4-6 3.3" />
    </svg>
  ),
  "төлбөрийн систем": (
    <svg viewBox="0 0 16 16">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.8" />
      <path d="M1.5 6.5h13M4 10h3" />
    </svg>
  ),
  "баримтын сан": (
    <svg viewBox="0 0 16 16">
      <path d="M4 1.8h5.5L12.5 5v9.2H4Z" />
      <path d="M6 7.5h4.5M6 10h4.5" />
    </svg>
  ),
  "дизайны файл": (
    <svg viewBox="0 0 16 16">
      <rect x="2" y="2" width="12" height="12" rx="2" />
      <path d="M2 6h12M6 6v8" />
    </svg>
  ),
  "өгөгдлийн сан": (
    <svg viewBox="0 0 16 16">
      <ellipse cx="8" cy="4" rx="5" ry="2" />
      <path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2" />
    </svg>
  ),
};
function toolMark(detail = "") {
  return (
    toolMarks[detail] ?? (
      <svg viewBox="0 0 16 16">
        <circle cx="6.5" cy="6.5" r="4" />
        <path d="m10 10 3 3" />
      </svg>
    )
  );
}
function ProviderMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ width: "1em", height: "1em", display: "block", stroke: "none", fill: "currentColor" }}
    >
      <path d="M8 1.5c.4 3.3 3.2 6.1 6.5 6.5-3.3.4-6.1 3.2-6.5 6.5-.4-3.3-3.2-6.1-6.5-6.5 3.3-.4 6.1-3.2 6.5-6.5Z" />
    </svg>
  );
}

export type TraceSpan = {
  id: string;
  name: string;
  kind: "agent" | "subagent" | "llm" | "tool";
  status: "running" | "done" | "failed";
  start: number;
  end?: number;
  detail?: string;
  icon?: React.ReactNode;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
  input?: string;
  output?: string;
  error?: string;
  children?: TraceSpan[];
};
export type TraceWaterfallProps = {
  root?: TraceSpan;
  now?: number;
  startedAt?: number;
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (ids: string[]) => void;
  openId?: string | null;
  defaultOpenId?: string | null;
  onOpenChange?: (id: string | null, span?: TraceSpan) => void;
  markSlowest?: boolean;
  minRange?: number;
  formatCost?: (value: number) => string;
  title?: string;
  className?: string;
};
type Row = { span: TraceSpan; depth: number; parent?: string };
const allSpans = (span: TraceSpan): TraceSpan[] => [
  span,
  ...(span.children ?? []).flatMap(allSpans),
];
const aggregate = (
  span: TraceSpan,
  key: "cost" | "tokensIn" | "tokensOut",
): number =>
  Math.max(0, span[key] ?? 0) +
  (span.children ?? []).reduce((sum, child) => sum + aggregate(child, key), 0);
const money = (value: number) =>
  `$${value < 0.01 ? value.toFixed(3) : value.toFixed(2)}`;
const duration = (value: number) =>
  value >= 60000
    ? `${Math.floor(value / 60000)} мин ${Math.floor((value % 60000) / 1000)} с`
    : value >= 1000
      ? `${Number((value / 1000).toFixed(1))} с`
      : `${Math.round(value)} ms`;
const KIND_LABEL: Record<TraceSpan["kind"], string> = { agent: "агент", subagent: "дэд агент", llm: "LLM", tool: "хэрэгсэл" };
const STATUS_LABEL: Record<TraceSpan["status"], string> = { running: "ажиллаж байна", done: "дууссан", failed: "алдаатай" };
const FIELD_LABEL = { input: "Оролт", output: "Гаралт", error: "Алдаа" } as const;
const short = (value: number) =>
  value >= 1000 ? `${Number((value / 1000).toFixed(1))}k` : String(value);
function example(): TraceSpan {
  return {
    id: "run",
    name: "Удирдагч агент",
    detail: "3 туслах",
    kind: "agent",
    status: "running",
    start: 0,
    input: "Шинэ тарифын хуудсыг баасан гараг гэхэд гаргах",
    children: [
      {
        id: "plan",
        name: "Ажлыг төлөвлөх",
        detail: "Удирдагч агент",
        model: "Удирдагч агент",
        kind: "llm",
        status: "done",
        start: 900,
        end: 7800,
        tokensIn: 3240,
        tokensOut: 880,
        input: "Шинэ тарифын хуудсыг гаргах ажлыг төлөвлө",
        output:
          "Өрсөлдөгчдийг судлах, гурван багцын текст бичих, хуудсыг хийж төлбөрийн урсгалыг шалгах.",
      },
      {
        id: "research",
        name: "Судлаач агент",
        detail: "5 алхам",
        kind: "subagent",
        status: "done",
        start: 8100,
        end: 38100,
        children: [
          {
            id: "rivals-a",
            name: "web_search",
            detail: "Өрсөлдөгч А-гийн багцууд",
            kind: "tool",
            status: "done",
            start: 9000,
            end: 14400,
            tokensIn: 1800,
            tokensOut: 2800,
            output: "Багцууд болон боломжуудын харьцуулалтыг татлаа.",
          },
          {
            id: "rivals-b",
            name: "web_search",
            detail: "Өрсөлдөгч Б-гийн багцууд",
            kind: "tool",
            status: "done",
            start: 9300,
            end: 16500,
            tokensIn: 2100,
            tokensOut: 3200,
          },
          {
            id: "query",
            name: "Багцын хэрэглээг татах",
            detail: "өгөгдлийн сан",
            kind: "tool",
            status: "done",
            start: 9700,
            end: 13200,
            tokensIn: 800,
            tokensOut: 4200,
          },
          {
            id: "reviews",
            name: "Хэрэглэгчийн сэтгэгдэл унших",
            detail: "120 хуудас",
            kind: "tool",
            status: "done",
            start: 14800,
            end: 27800,
          },
          {
            id: "summary",
            name: "Дүгнэлт гаргах",
            detail: "Судлаач агент",
            model: "Судлаач агент",
            kind: "llm",
            status: "done",
            start: 28000,
            end: 37300,
            tokensIn: 9800,
            tokensOut: 1400,
            output: "Хоёр өрсөлдөгч хэрэглэгчийн тоогоор, гурав дахь нь засварлагчийн тоогоор багцалдаг.",
          },
        ],
      },
      {
        id: "writer",
        name: "Бичигч агент",
        detail: "4 алхам",
        kind: "subagent",
        status: "done",
        start: 11100,
        end: 48100,
        children: [
          {
            id: "voice",
            name: "Брэндийн өнгө аяс унших",
            detail: "баримтын сан",
            kind: "tool",
            status: "done",
            start: 11700,
            end: 15300,
            tokensIn: 1200,
            tokensOut: 4200,
          },
          {
            id: "frames",
            name: "Хуудасны загвар унших",
            detail: "дизайны файл",
            kind: "tool",
            status: "done",
            start: 12000,
            end: 17100,
            tokensIn: 1800,
            tokensOut: 3900,
          },
          {
            id: "copy",
            name: "Багцын текст бичих",
            detail: "Бичигч агент",
            kind: "llm",
            status: "done",
            start: 17800,
            end: 40800,
            tokensIn: 1800,
            tokensOut: 900,
          },
          {
            id: "save",
            name: "Ноорог хадгалах",
            detail: "баримтын сан",
            kind: "tool",
            status: "done",
            start: 41000,
            end: 44600,
          },
        ],
      },
      {
        id: "coder",
        name: "Кодын агент",
        detail: "5 алхам",
        kind: "subagent",
        status: "running",
        start: 15400,
        children: [
          {
            id: "branch",
            name: "Салбар үүсгэх",
            detail: "хувилбарын хяналт",
            kind: "tool",
            status: "done",
            start: 16000,
            end: 18100,
            tokensIn: 80,
            tokensOut: 100,
          },
          {
            id: "build",
            name: "Тарифын хуудас бичих",
            detail: "Кодын агент",
            kind: "llm",
            status: "done",
            start: 18400,
            end: 38400,
            tokensIn: 800,
            tokensOut: 900,
          },
          {
            id: "prices",
            name: "Багцуудыг үүсгэх",
            detail: "төлбөрийн систем",
            kind: "tool",
            status: "done",
            start: 38600,
            end: 41600,
          },
          {
            id: "tests",
            name: "Төлбөрийн тест ажиллуулах",
            detail: "хувилбарын хяналт",
            kind: "tool",
            status: "failed",
            start: 42800,
            end: 51200,
            input: "src/checkout/ хавтасны тестүүдийг ажиллуулах",
            error: "14 тестээс 2 нь унав – купон багцын үнэд тооцогдохгүй байна",
          },
          {
            id: "fix",
            name: "Купоны алдааг засах",
            detail: "Кодын агент",
            model: "Кодын агент",
            kind: "llm",
            status: "running",
            start: 51400,
            tokensIn: 2100,
            tokensOut: 600,
          },
        ],
      },
    ],
  };
}

export function TraceWaterfall({
  root,
  now,
  startedAt,
  collapsed,
  defaultCollapsed = [],
  onCollapsedChange,
  openId,
  defaultOpenId = null,
  onOpenChange,
  markSlowest = true,
  minRange = 10000,
  formatCost = money,
  title = "Мөрдөлт",
  className = "",
}: TraceWaterfallProps) {
  const [demo] = React.useState(example),
    data = root ?? demo;
  const all = allSpans(data);
  const live = all.some((span) => span.status === "running");
  const maxKnown = Math.max(0, ...all.map((span) => span.end ?? span.start));
  const epoch = React.useRef(Date.now() - (root ? maxKnown : 55000));
  const [clock, setClock] = React.useState(
    () => Date.now() - (startedAt ?? epoch.current),
  );
  const time = now ?? (live ? clock : maxKnown);
  const [folded, setFolded] = React.useState(
    root || defaultCollapsed.length ? defaultCollapsed : ["research", "writer"],
  );
  const hidden = collapsed ?? folded;
  const [open, setOpen] = React.useState<string | null>(
    root || defaultOpenId !== null ? defaultOpenId : "tests",
  );
  const activeId = openId === undefined ? open : openId;
  const selected = all.find((span) => span.id === activeId);
  const [focus, setFocus] = React.useState(data.id);
  const rows = React.useMemo(() => {
    const result: Row[] = [];
    const walk = (span: TraceSpan, depth: number, parent?: string) => {
      result.push({ span, depth, parent });
      if (!hidden.includes(span.id))
        span.children?.forEach((child) => walk(child, depth + 1, span.id));
    };
    walk(data, 0);
    return result;
  }, [data, hidden]);
  const rowRefs = React.useRef(new Map<string, HTMLDivElement>());
  const popup = React.useRef<HTMLDivElement>(null);
  const longest = Math.max(Math.max(1, minRange), time, maxKnown);
  const tickSize =
    longest <= 30000
      ? 10000
      : longest <= 120000
        ? 20000
        : longest <= 600000
          ? 60000
          : Math.pow(10, Math.floor(Math.log10(longest))) / 2;
  const range = Math.ceil(longest / tickSize) * tickSize;
  const ticks = Array.from(
    { length: Math.floor(range / tickSize) + 1 },
    (_, index) => index * tickSize,
  );
  const finished = all.filter(
    (span) =>
      (span.kind === "llm" || span.kind === "tool") && span.end !== undefined,
  );
  const slowest = finished.reduce<TraceSpan | undefined>(
    (best, span) =>
      !best || span.end! - span.start > best.end! - best.start ? span : best,
    undefined,
  );
  const totalDuration = Math.max(0, (data.end ?? time) - data.start);
  React.useEffect(() => {
    if (now !== undefined || !live) return;
    const tick = () => setClock(Date.now() - (startedAt ?? epoch.current));
    tick();
    const timer = setInterval(tick, 100);
    return () => clearInterval(timer);
  }, [now, live, startedAt]);
  React.useEffect(() => {
    if (!rows.some((row) => row.span.id === focus))
      setFocus(rows[0]?.span.id ?? data.id);
  }, [rows, focus, data.id]);
  const lastOpen = React.useRef(selected?.id);
  React.useEffect(() => {
    if (lastOpen.current === selected?.id) return;
    lastOpen.current = selected?.id;
    if (selected)
      popup.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [selected?.id]);
  const fold = (span: TraceSpan) => {
    const next = hidden.includes(span.id)
      ? hidden.filter((value) => value !== span.id)
      : [...hidden, span.id];
    setFolded(next);
    onCollapsedChange?.(next);
  };
  const openSpan = (span: TraceSpan | null) => {
    const next = span?.id ?? null;
    setOpen(next);
    if (span) onOpenChange?.(next, span);
    else onOpenChange?.(null);
    if (!span && activeId) rowRefs.current.get(activeId)?.focus();
  };
  const move = (index: number) => {
    const next = rows[Math.max(0, Math.min(rows.length - 1, index))];
    if (next) {
      setFocus(next.span.id);
      rowRefs.current.get(next.span.id)?.focus();
    }
  };
  const key = (event: React.KeyboardEvent, index: number, row: Row) => {
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "Enter",
        " ",
      ].includes(event.key)
    )
      event.preventDefault();
    if (event.key === "ArrowDown") move(index + 1);
    if (event.key === "ArrowUp") move(index - 1);
    if (event.key === "Home") move(0);
    if (event.key === "End") move(rows.length - 1);
    if (event.key === "ArrowRight" && row.span.children?.length) {
      if (hidden.includes(row.span.id)) fold(row.span);
      else move(index + 1);
    }
    if (event.key === "ArrowLeft") {
      if (row.span.children?.length && !hidden.includes(row.span.id))
        fold(row.span);
      else if (row.parent)
        move(rows.findIndex((item) => item.span.id === row.parent));
    }
    if (event.key === "Enter" || event.key === " ")
      openSpan(activeId === row.span.id ? null : row.span);
    if (event.key === "Escape") openSpan(null);
  };
  const detailTop = selected
    ? Math.min(
        130 +
          Math.max(
            0,
            rows.findIndex((row) => row.span.id === selected.id),
          ) *
            31,
        Math.max(130, rows.length * 31 - 100),
      )
    : 130;
  return (
    <section className={`trw-root ${className}`} aria-label={title}>
      <style>{css}</style>
      <header className="trw-header">
        <span className="trw-title">
          <i aria-hidden="true">✦</i>
          {title}
        </span>
        <span className="trw-description">{data.input ?? data.name}</span>
        <span className={`trw-state ${data.status}`} role="status">
          {data.status === "running"
            ? "• Шууд"
            : data.status === "failed"
              ? "Алдаатай"
              : "✓ Дууссан"}
        </span>
      </header>
      <dl className="trw-totals">
        {[
          ["Хугацаа", duration(totalDuration)],
          ["Зардал", formatCost(aggregate(data, "cost"))],
          [
            "Токен",
            short(aggregate(data, "tokensIn") + aggregate(data, "tokensOut")),
          ],
          [
            "LLM дуудлага",
            String(all.filter((span) => span.kind === "llm").length),
          ],
          [
            "Хэрэгслийн дуудлага",
            String(all.filter((span) => span.kind === "tool").length),
          ],
          [
            "Алдаа",
            String(all.filter((span) => span.status === "failed").length),
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd
              className={
                live && ["Хугацаа", "Зардал", "Токен"].includes(label)
                  ? "trw-shimmer"
                  : label === "Алдаа" && value !== "0"
                    ? "trw-err"
                    : ""
              }
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="trw-axis" aria-hidden="true">
        <span>Алхам</span>
        <div>
          {ticks.map((tick) => (
            <span key={tick} style={{ left: `${(tick / range) * 100}%` }}>
              {duration(tick)}
            </span>
          ))}
        </div>
      </div>
      <div className="trw-rows" role="tree" aria-label="Мөрдөлтийн алхмууд">
        {rows.map((row, index) => {
          const span = row.span;
          const end = span.end ?? time;
          const spanDuration = Math.max(0, end - span.start);
          const cost = aggregate(span, "cost");
          const left = Math.max(0, Math.min(100, (span.start / range) * 100));
          const width = Math.max(
            0.6,
            Math.min(100 - left, (spanDuration / range) * 100),
          );
          return (
            <div
              key={span.id}
              ref={(element) => {
                if (element) rowRefs.current.set(span.id, element);
                else rowRefs.current.delete(span.id);
              }}
              role="treeitem"
              aria-level={row.depth + 1}
              aria-expanded={
                span.children?.length ? !hidden.includes(span.id) : undefined
              }
              aria-label={`${span.name}, ${KIND_LABEL[span.kind] ?? span.kind}, ${STATUS_LABEL[span.status] ?? span.status}, ${duration(spanDuration)}, ${formatCost(cost)}`}
              tabIndex={focus === span.id ? 0 : -1}
              className={`trw-row ${activeId === span.id ? "selected" : ""}`}
              onFocus={() => setFocus(span.id)}
              onKeyDown={(event) => key(event, index, row)}
              onClick={() => openSpan(activeId === span.id ? null : span)}
            >
              <div
                className="trw-name"
                style={{ paddingLeft: 12 + row.depth * 16 }}
              >
                {row.depth > 0 && (
                  <span
                    className="trw-indent"
                    style={{ left: row.depth * 16 - 1 }}
                    aria-hidden="true"
                  />
                )}
                {span.children?.length ? (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`${span.name}: ${hidden.includes(span.id) ? "дэлгэх" : "хураах"}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      fold(span);
                      setFocus(span.id);
                      rowRefs.current.get(span.id)?.focus();
                    }}
                  >
                    <svg
                      viewBox="0 0 16 16"
                      style={{
                        transform: hidden.includes(span.id)
                          ? "rotate(-90deg)"
                          : undefined,
                      }}
                    >
                      <path d="m5 6 3 3 3-3" />
                    </svg>
                  </button>
                ) : (
                  <span className="trw-spacer" />
                )}
                <span className={`trw-icon ${span.kind}`}>
                  {span.icon ??
                    (span.kind === "tool" ? (
                      toolMark(span.detail)
                    ) : (
                      <ProviderMark />
                    ))}
                </span>
                <strong>{span.name}</strong>
                {span.detail && <small>{span.detail}</small>}
                {hidden.includes(span.id) && span.children?.length ? (
                  <em className="trw-count">+{span.children.length}</em>
                ) : null}
                {span.status === "running" && (
                  <i className="trw-spinner" aria-hidden="true" />
                )}
              </div>
              <div className="trw-timeline">
                {ticks.map((tick) => (
                  <i
                    key={tick}
                    className="trw-grid-line"
                    style={{ left: `${(tick / range) * 100}%` }}
                    aria-hidden="true"
                  />
                ))}
                {live && (
                  <i
                    className="trw-now"
                    style={{ left: `${Math.min(100, (time / range) * 100)}%` }}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`trw-bar ${span.kind} ${span.status}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  {hidden.includes(span.id) &&
                    span.children?.map((child) => (
                      <i
                        key={child.id}
                        style={{
                          left: `${Math.max(0, ((child.start - span.start) / Math.max(1, spanDuration)) * 100)}%`,
                        }}
                      />
                    ))}
                </span>
                <span
                  className="trw-value"
                  style={{ left: `${Math.min(100, left + width)}%` }}
                >
                  {duration(spanDuration)}
                  {cost > 0 ? ` · ${formatCost(cost)}` : ""}
                  {markSlowest && slowest?.id === span.id && <b>Хамгийн удаан</b>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {selected && (
        <div
          ref={popup}
          className="trw-detail"
          role="dialog"
          aria-label={selected.name}
          style={{ top: detailTop }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              openSpan(null);
            }
          }}
        >
          <header>
            <span className={`trw-kind-dot ${selected.kind}`} />
            <strong>{selected.name}</strong>
            <button
              aria-label="Алхмын дэлгэрэнгүйг хаах"
              onClick={() => openSpan(null)}
            >
              ×
            </button>
          </header>
          <p>
            {KIND_LABEL[selected.kind] ?? selected.kind} <span>·</span> {STATUS_LABEL[selected.status] ?? selected.status} <span>·</span>{" "}
            {duration(Math.max(0, (selected.end ?? time) - selected.start))}
          </p>
          <dl>
            <div>
              <dt>Зардал</dt>
              <dd>{formatCost(aggregate(selected, "cost"))}</dd>
            </div>
            <div>
              <dt>Оролтын токен</dt>
              <dd>{aggregate(selected, "tokensIn").toLocaleString()}</dd>
            </div>
            <div>
              <dt>Гаралтын токен</dt>
              <dd>{aggregate(selected, "tokensOut").toLocaleString()}</dd>
            </div>
          </dl>
          {selected.model && <p>{selected.model}</p>}
          {(["input", "output", "error"] as const).map((field) =>
            selected[field] ? (
              <div className={`trw-preview ${field}`} key={field}>
                <h4>{FIELD_LABEL[field]}</h4>
                <pre>{selected[field]}</pre>
              </div>
            ) : null,
          )}
        </div>
      )}
    </section>
  );
}
const css = `
.trw-root{--trw-bg:#fff;--trw-ink:#29292c;--trw-muted:#65656d;--trw-line:#e9e9eb;--trw-hover:#f7f7f8;--trw-agent:#88889820;--trw-agent-edge:#88889840;--trw-llm:#8e7be62b;--trw-llm-edge:#8e7be655;--trw-tool:#39a4b123;--trw-tool-edge:#39a4b14f;--trw-blue:#1d4ed8;--trw-green:#15803d;--trw-red:#c62828;--trw-agent-ink:#c2410c;--trw-tool-ink:#0e7490;width:100%;max-width:950px;border:1px solid var(--trw-line);border-radius:12px;background:var(--trw-bg);color:var(--trw-ink);font:400 12.5px/18px Inter,system-ui,sans-serif;position:relative;container:trw / inline-size;text-align:left;isolation:isolate}:where(.dark,[data-theme=dark]) .trw-root{--trw-bg:#202022;--trw-ink:#e4e4e7;--trw-muted:#9a9aa2;--trw-line:#2b2b2f;--trw-hover:#242427;--trw-blue:#6896c5;--trw-green:#62aa87;--trw-red:#f87171;--trw-agent-ink:#d59373;--trw-tool-ink:#72a8b3;color-scheme:dark}.trw-root *{box-sizing:border-box}.trw-root button{font:inherit;color:inherit;cursor:pointer}.trw-root :focus-visible{outline:2px solid #82bcff;outline-offset:-2px}.trw-root svg{width:12px;height:12px;stroke:currentColor;stroke-width:1.2;fill:none;stroke-linecap:round;stroke-linejoin:round}.trw-header{display:flex;align-items:center;gap:9px;padding:13px 17px;border-bottom:1px solid var(--trw-line);min-width:0}.trw-title{display:flex;gap:10px;align-items:center;font-size:13px;font-weight:500;white-space:nowrap}.trw-title i{font-size:14px;font-style:normal;color:#80b4ee}.trw-description{color:var(--trw-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}.trw-state{font-size:11.5px;line-height:18px;white-space:nowrap;padding:0 6px;border-radius:4px;color:var(--trw-blue);background:#5e9cdb18;margin-left:auto}.trw-state.done{color:var(--trw-green);background:#62aa8718}.trw-state.failed{color:var(--trw-red);background:#d0788218}.trw-totals{display:grid;grid-template-columns:repeat(6,1fr);padding:13px 8px;margin:0;border-bottom:1px solid var(--trw-line)}.trw-totals>div{padding:0 13px;border-left:1px solid var(--trw-line)}.trw-totals>div:first-child{border-left:0}.trw-totals dt{font-size:10px;text-transform:uppercase;letter-spacing:.7px;color:var(--trw-muted);white-space:nowrap}.trw-totals dd{font-size:15px;line-height:21px;margin:4px 0 0;font-variant-numeric:tabular-nums}.trw-axis{display:grid;grid-template-columns:34% 1fr;height:30px;border-bottom:1px solid var(--trw-line);font-size:12px;color:var(--trw-muted)}.trw-axis>span{padding:6px 15px;text-transform:uppercase;font-size:10px;letter-spacing:.7px}.trw-axis>div{position:relative;margin-right:40px;border-left:1px solid var(--trw-line)}.trw-axis>div>span{position:absolute;top:6px;transform:translateX(4px);white-space:nowrap}.trw-axis>div>span:last-child{transform:translateX(-100%)}.trw-rows{padding:3px 0 12px;overflow:hidden;border-radius:0 0 12px 12px}.trw-row{display:grid;grid-template-columns:34% 1fr;min-height:30px;cursor:pointer;outline:none;animation:trw-row-in .2s both}.trw-row:hover,.trw-row.selected{background:var(--trw-hover)}.trw-name{display:flex;align-items:center;gap:7px;min-width:0;padding:6px 10px 6px 12px;position:relative}.trw-name strong{font-size:13px;font-weight:400;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0;max-width:75%}.trw-name small{font-size:12px;color:var(--trw-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.trw-name>button{border:0;background:none;padding:0;width:10px;height:16px;flex:none;color:var(--trw-muted)}.trw-name>button svg{transition:transform .2s;width:10px}.trw-spacer{width:10px;flex:none}.trw-indent{position:absolute;top:0;bottom:0;width:1px;background:var(--trw-line)}.trw-icon{width:14px;height:14px;display:grid;place-items:center;flex:none;color:var(--trw-agent-ink)}.trw-icon svg,.trw-icon img{width:13px!important;height:13px!important;max-width:13px;max-height:13px}.trw-err{color:var(--trw-red)}.trw-count{flex:none;margin-left:auto;font-style:normal;font-size:11px;line-height:16px;padding:0 5px;border-radius:4px;background:var(--trw-hover);border:1px solid var(--trw-line);color:var(--trw-muted)}.trw-icon.tool{color:var(--trw-tool-ink)}.trw-spinner{margin-left:auto;flex:none;width:8px;height:8px;border:1px solid #81afdf44;border-top-color:#81afdf;border-radius:50%;animation:trw-spin 1s linear infinite}.trw-timeline{position:relative;min-width:0;border-left:1px solid var(--trw-line);margin-right:40px}.trw-grid-line{position:absolute;top:0;bottom:0;width:1px;background:var(--trw-line);pointer-events:none}.trw-now{position:absolute;top:-2px;bottom:-2px;width:1px;background:#679ddd88;pointer-events:none;z-index:2;transition:left .2s linear}.trw-row:first-child .trw-now:before{content:'';position:absolute;top:-6px;left:-2px;width:5px;height:5px;border-radius:50%;background:#8ab8f2}.trw-bar{position:absolute;top:9px;height:12px;border-radius:3px;background:var(--trw-agent);border:1px solid var(--trw-agent-edge);transition:left .4s,width .4s;min-width:2px;overflow:hidden}.trw-bar.llm{background:var(--trw-llm);border-color:var(--trw-llm-edge)}.trw-bar.tool{background:var(--trw-tool);border-color:var(--trw-tool-edge)}.trw-bar.failed{background:#c45c6d24;border-color:#c45c6d55}.trw-bar.running:after{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 20%,#ffffff0b 50%,transparent 80%);background-size:220% 100%;animation:trw-shine 2.5s linear infinite}.trw-bar>i{position:absolute;top:1px;bottom:1px;width:2px;background:var(--trw-muted);opacity:.45}.trw-value{position:absolute;top:5px;padding-left:6px;white-space:nowrap;font-size:12px;color:var(--trw-muted);font-variant-numeric:tabular-nums;line-height:20px;transition:left .4s;pointer-events:none}.trw-value b{font-size:9.5px;text-transform:uppercase;letter-spacing:.3px;color:#c9945d;background:#a56b2918;padding:1px 4px;border-radius:2px;margin-left:7px;font-weight:500}.trw-shimmer{background:linear-gradient(100deg,var(--trw-muted),var(--trw-ink),var(--trw-muted));background-size:220% 100%;background-clip:text;color:transparent;animation:trw-shine 3s linear infinite}.trw-detail{position:absolute;right:16px;width:310px;max-width:calc(100% - 32px);max-height:390px;overflow:auto;padding:15px;background:var(--trw-bg);border:1px solid var(--trw-line);border-radius:10px;box-shadow:0 10px 35px #0003;z-index:20;animation:trw-pop .18s both}.trw-detail header{display:flex;gap:7px;align-items:center}.trw-detail header strong{font-weight:500;font-size:13px}.trw-detail header button{margin-left:auto;font-size:20px;line-height:20px;padding:0 3px;border:0;background:none;color:var(--trw-muted)}.trw-detail>p{font-size:12px;color:var(--trw-muted);margin:8px 0}.trw-detail>p span{padding:0 4px}.trw-detail dl{display:grid;grid-template-columns:repeat(3,1fr);border-block:1px solid var(--trw-line);padding:10px 0;margin:12px 0}.trw-detail dt{font-size:10px;color:var(--trw-muted)}.trw-detail dd{margin:3px 0 0;font-size:13px}.trw-preview h4{margin:10px 0 5px;text-transform:uppercase;letter-spacing:.06em;font-size:10px;font-weight:500}.trw-preview pre{background:var(--trw-hover);padding:9px;border-radius:6px;font:11.5px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--trw-muted);margin:0}.trw-preview.error pre{color:var(--trw-red)}.trw-kind-dot{width:7px;height:7px;border-radius:2px;background:#9797a7}.trw-kind-dot.llm{background:#a292df}.trw-kind-dot.tool{background:#6cabb3}
@container trw (max-width:559px){.trw-totals{grid-template-columns:repeat(3,1fr);gap:12px 0}.trw-totals>div:nth-child(4){border-left:0}.trw-header{padding:12px}.trw-description{font-size:10px}.trw-axis{grid-template-columns:minmax(0,1fr);height:25px}.trw-axis>span{display:none}.trw-axis>div{margin:0 90px 0 15px;border:0}.trw-row{grid-template-columns:minmax(0,1fr);min-height:55px}.trw-name{padding-top:5px;padding-bottom:2px}.trw-name strong{max-width:68%}.trw-timeline{margin:0 90px 0 15px;min-height:25px;border-left:0}.trw-bar{top:4px;height:12px}.trw-value{top:0;font-size:9px}.trw-now,.trw-grid-line{top:-20px}.trw-row:first-child .trw-now:before{display:none}.trw-value b{display:none}.trw-detail{top:110px!important;right:12px;max-width:calc(100% - 24px)}}@container trw (max-width:359px){.trw-name small{display:none}.trw-description{display:none}.trw-totals>div{padding:0 9px}.trw-totals dt{font-size:8px}}
@keyframes trw-shine{to{background-position:-220% 0}}@keyframes trw-spin{to{transform:rotate(360deg)}}@keyframes trw-row-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}@keyframes trw-pop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}@media(prefers-reduced-motion:reduce){.trw-root *{animation:none!important;transition:none!important}.trw-shimmer{background:none;color:var(--trw-ink)}}
.trw-detail header button{font-size:13px;line-height:1}
`;
/** Catalog example: the demo trace carries no money, so the cost column shows a dash. */
export default function TraceWaterfallDemo() {
  return <TraceWaterfall formatCost={(v) => `${v.toFixed(2)} кр`} />;
}
