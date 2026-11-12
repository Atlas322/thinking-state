"use client";
import * as React from "react";

// Neutral maker mark: the first letter of the model label, no brand logos.
function ProviderMark({ model = "" }: { model?: string }) {
  return (
    <span aria-hidden="true" style={{ display: "block", fontSize: 12, fontWeight: 600, lineHeight: "16px" }}>
      {(model.trim()[0] ?? "А").toUpperCase()}
    </span>
  );
}

export type ContextBlock = {
  id: string;
  label: string;
  kind: "system" | "tools" | "memory" | "file" | "chat" | "result" | "summary";
  tokens: number;
  detail?: string;
  icon?: React.ReactNode;
  items?: { label: string; icon?: React.ReactNode }[];
};
export type ContextAgent = {
  id: string;
  name: string;
  limit: number;
  model?: string;
  modelIcon?: React.ReactNode;
};
export type ContextCompaction = {
  before: ContextBlock[];
  summarized?: string[];
  dropped?: string[];
  summary?: string;
};
export type ContextMapProps = {
  blocks?: ContextBlock[];
  limit?: number;
  model?: string;
  modelIcon?: React.ReactNode;
  agents?: ContextAgent[];
  agent?: string;
  onAgentChange?: (id: string) => void;
  compaction?: ContextCompaction | null;
  view?: "before" | "after";
  onViewChange?: (view: "before" | "after") => void;
  status?: string;
  onSelect?: (block: ContextBlock | null) => void;
  title?: string;
  className?: string;
};
const defaults: ContextBlock[] = [
  { id: "system", label: "Системийн заавар", kind: "system", tokens: 6200 },
  {
    id: "tools",
    label: "Хэрэгслийн тодорхойлолт",
    kind: "tools",
    tokens: 14800,
    items: [
      { label: "search_web" },
      { label: "read_file" },
      { label: "run_tests" },
    ],
  },
  { id: "memory", label: "Төслийн санах ой", kind: "memory", tokens: 9400 },
  {
    id: "spec",
    label: "checkout.spec.ts",
    kind: "file",
    tokens: 8200,
    detail: "0:09-д уншсан",
  },
  { id: "payment", label: "payment.ts", kind: "file", tokens: 17600 },
  { id: "chat", label: "Яриа", kind: "chat", tokens: 30200 },
  {
    id: "tests",
    label: "Тест ажиллуулалт · 20×",
    kind: "result",
    tokens: 22400,
    detail: "npm test, төлбөрийн алхмыг засах явцад 20 удаа",
  },
  {
    id: "payments",
    label: "payments.ts (туршилтын)",
    kind: "file",
    tokens: 11800,
  },
  { id: "search", label: "Хайлтын үр дүн", kind: "result", tokens: 15600 },
  { id: "receipt", label: "receipt.tsx", kind: "file", tokens: 23800 },
];
const compactNumber = (value: number) =>
  value >= 1000000
    ? `${(value / 1000000).toFixed(value % 1000000 ? 1 : 0)}m`
    : value >= 1000
      ? `${(value / 1000).toFixed(value % 1000 ? 1 : 0)}k`
      : String(Math.round(value));
const kinds = {
  system: "Системийн заавар",
  tools: "Хэрэгсэл",
  memory: "Санах ой",
  file: "Файл",
  chat: "Яриа",
  result: "Хэрэгслийн үр дүн",
  summary: "Хураангуй",
};
type Tile = {
  id: string;
  block: ContextBlock | null;
  tokens: number;
  x: number;
  y: number;
  width: number;
  height: number;
};
/** Ordered, area-proportional binary treemap. IDs remain stable across layouts. */
function layout(
  entries: { id: string; block: ContextBlock | null; tokens: number }[],
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  aspect = 2.2,
): Tile[] {
  if (!entries.length) return [];
  if (entries.length === 1) return [{ ...entries[0], x, y, width, height }];
  const total = entries.reduce((sum, item) => sum + item.tokens, 0);
  if (total <= 0) return [];
  let subtotal = 0,
    split = 1,
    best = Infinity;
  for (let i = 0; i < entries.length - 1; i++) {
    subtotal += entries[i].tokens;
    const distance = Math.abs(total / 2 - subtotal);
    if (distance < best) {
      best = distance;
      split = i + 1;
    }
  }
  const first = entries.slice(0, split),
    second = entries.slice(split),
    ratio = first.reduce((sum, item) => sum + item.tokens, 0) / total;
  if (width * aspect >= height)
    return [
      ...layout(first, x, y, width * ratio, height, aspect),
      ...layout(
        second,
        x + width * ratio,
        y,
        width * (1 - ratio),
        height,
        aspect,
      ),
    ];
  return [
    ...layout(first, x, y, width, height * ratio, aspect),
    ...layout(
      second,
      x,
      y + height * ratio,
      width,
      height * (1 - ratio),
      aspect,
    ),
  ];
}
export function ContextMap({
  blocks = defaults,
  limit = 200000,
  model = "Кодын агент",
  modelIcon,
  agents = [],
  agent,
  onAgentChange,
  compaction = null,
  view,
  onViewChange,
  status,
  onSelect,
  title = "Контекст",
  className = "",
}: ContextMapProps) {
  const [localView, setLocalView] = React.useState<"before" | "after">("after");
  const [localAgent, setLocalAgent] = React.useState(agent ?? agents[0]?.id);
  const [pinned, setPinned] = React.useState<string | null>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [aspect, setAspect] = React.useState(2.2);
  const map = React.useRef<HTMLDivElement>(null);
  const selectedAgent = agents.find(
    (item) => item.id === (agent ?? localAgent),
  );
  const capacity = Math.max(1, selectedAgent?.limit ?? limit);
  const currentView = view ?? localView;
  const visible =
    compaction && currentView === "before" ? compaction.before : blocks;
  const sanitized = visible
    .map((block) => ({
      ...block,
      tokens: Number.isFinite(block.tokens) ? Math.max(0, block.tokens) : 0,
    }))
    .filter((block) => block.tokens > 0);
  const used = sanitized.reduce((sum, block) => sum + block.tokens, 0);
  const free = Math.max(0, capacity - used);
  const entries = [
    ...sanitized.map((block) => ({
      id: block.id,
      block,
      tokens: block.tokens,
    })),
    ...(free > 0 ? [{ id: "__free", block: null, tokens: free }] : []),
  ];
  const tiles = layout(entries, 0, 0, 100, 100, aspect);
  const selected = tiles.find((tile) => tile.id === (pinned ?? hovered));
  const percent = Math.round((used / capacity) * 100);
  const beforeTotal =
    compaction?.before.reduce(
      (sum, block) => sum + Math.max(0, block.tokens),
      0,
    ) ?? 0;
  React.useLayoutEffect(() => {
    const element = map.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      if (rect.height > 0) setAspect(rect.width / rect.height);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    if (pinned && !entries.some((item) => item.id === pinned)) setPinned(null);
  }, [pinned, entries]);
  const changeView = (next: "before" | "after") => {
    setLocalView(next);
    onViewChange?.(next);
  };
  return (
    <section
      className={`cmp-map-root ${className}`}
      aria-label={title}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setPinned(null);
          setHovered(null);
        }
      }}
    >
      <style>{css}</style>
      <header className="cmp-header">
        <span className="cmp-title">
          <svg className="cmp-logo" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1.5" y="2" width="6" height="12" rx="1.5" fill="#3b82f6" />
            <rect x="9" y="2" width="5.5" height="5" rx="1.2" fill="#93c5fd" />
            <rect x="9" y="8.5" width="5.5" height="5.5" rx="1.2" fill="#bfdbfe" />
          </svg>
          {title}
        </span>
        <span className="cmp-model">
          {selectedAgent?.modelIcon ?? modelIcon ?? (
            <span className="cmp-maker" aria-hidden="true">
              <ProviderMark model={selectedAgent?.model ?? model} />
            </span>
          )}
          {agents.length ? (
            <select
              aria-label="Контекстийн агент сонгох"
              value={selectedAgent?.id ?? ""}
              onChange={(event) => {
                setLocalAgent(event.target.value);
                onAgentChange?.(event.target.value);
                setPinned(null);
              }}
            >
              {agents.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          ) : (
            <span>{model}</span>
          )}
          <small>{compactNumber(capacity)}</small>
          <svg className="cmp-chev" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <span className="cmp-count" data-warning={percent >= 85}>
          <strong>{compactNumber(used)}</strong>
          <span>/ {compactNumber(capacity)}</span>
          <b>{percent}%</b>
        </span>
        {status && <span className="cmp-status">{status}</span>}
        {compaction && (
          <span className="cmp-view" role="group" aria-label="Шахалтын харагдац">
            {(["before", "after"] as const).map((mode) => (
              <button
                key={mode}
                aria-pressed={mode === currentView}
                onClick={() => changeView(mode)}
              >
                {mode === "before" ? "Өмнө" : "Дараа"}
              </button>
            ))}
          </span>
        )}
      </header>
      <div
        ref={map}
        className="cmp-map"
        role="list"
        aria-label={`${title}: блокууд`}
        onPointerLeave={() => setHovered(null)}
      >
        {tiles.map((tile) => (
          <div
            key={tile.id}
            role="listitem"
            className={`cmp-tile ${tile.block?.kind ?? "free"}`}
            style={{
              left: `${tile.x}%`,
              top: `${tile.y}%`,
              width: `${tile.width}%`,
              height: `${tile.height}%`,
            }}
          >
            <button
              aria-label={`${tile.block?.label ?? "Сул зай"}, ${tile.block ? kinds[tile.block.kind] : "чөлөөтэй"}, ${tile.tokens.toLocaleString()} токен`}
              aria-pressed={pinned === tile.id}
              onPointerEnter={() => setHovered(tile.id)}
              onFocus={() => setHovered(tile.id)}
              onBlur={() => setHovered(null)}
              onClick={() => {
                setPinned(pinned === tile.id ? null : tile.id);
                onSelect?.(tile.block);
              }}
            >
              <span className="cmp-tile-label">
                {tile.block?.icon}
                {tile.block?.label ?? "Сул"}
              </span>
              <small>
                {compactNumber(tile.tokens)}
                {tile.width > 20 && tile.block
                  ? ` · ${kinds[tile.block.kind]}`
                  : ""}
              </small>
            </button>
          </div>
        ))}
      </div>
      <footer className="cmp-footer">
        {compaction ? (
          <>
            <span>
              {compactNumber(
                Math.max(
                  0,
                  beforeTotal -
                    blocks.reduce(
                      (sum, item) => sum + Math.max(0, item.tokens),
                      0,
                    ),
                ),
              )}{" "}
              токен чөлөөлсөн
            </span>
            <span>
              {compaction.summarized?.length ?? 0} хураангуйлсан <b>·</b>{" "}
              {compaction.dropped?.length ?? 0} хассан
              {compaction.summary ? ` · ${compaction.summary}` : ""}
            </span>
          </>
        ) : (
          <span>
            Одоохондоо шахаагүй. Шахсаны дараа өмнөх, дараах байдлыг энд харьцуулна.
          </span>
        )}
      </footer>
      {selected && (
        <aside
          className="cmp-detail"
          role={pinned ? "dialog" : "tooltip"}
          aria-label={`${selected.block?.label ?? "Сул зай"}: дэлгэрэнгүй`}
        >
          <header>
            <span>{selected.block?.icon}</span>
            <strong>{selected.block?.label ?? "Сул зай"}</strong>
            {pinned && (
              <button
                aria-label="Дэлгэрэнгүйг хаах"
                onClick={() => {
                  setPinned(null);
                  setHovered(null);
                }}
              >
                ×
              </button>
            )}
          </header>
          <p>
            {selected.tokens.toLocaleString()} токен{" "}
            <span>
              · цонхны {((selected.tokens / capacity) * 100).toFixed(1)}%
            </span>
          </p>
          {selected.block?.detail && <p>{selected.block.detail}</p>}
          {selected.block?.items && (
            <ul>
              {selected.block.items.map((item, index) => (
                <li key={index}>
                  {item.icon}
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </aside>
      )}
    </section>
  );
}
const css = `
.cmp-map-root{--cmp-ink:#303033;--cmp-muted:#838387;--cmp-surface:#fff;--cmp-line:#e5e5e8;width:100%;max-width:920px;color:var(--cmp-ink);font:400 13px/20px Inter,system-ui,sans-serif;position:relative;container:cmp / inline-size;text-align:left;isolation:isolate}:where(.dark,[data-theme=dark]) .cmp-map-root{--cmp-ink:#e2e2e5;--cmp-muted:#85858c;--cmp-surface:#202022;--cmp-line:#303034;color-scheme:dark}.cmp-map-root *{box-sizing:border-box}.cmp-map-root button,.cmp-map-root select{font:inherit;color:inherit;cursor:pointer}.cmp-map-root :focus-visible{outline:2px solid #82bcff;outline-offset:2px}.cmp-header{display:flex;align-items:center;gap:10px;padding:0 0 15px;flex-wrap:wrap}.cmp-title{display:flex;align-items:center;gap:7px;font-weight:500}.cmp-title>span{color:#82bcff}.cmp-model{display:flex;align-items:center;gap:7px;background:color-mix(in srgb,var(--cmp-ink) 3%,transparent);border:1px solid var(--cmp-line);border-radius:8px;padding:3px 7px;color:var(--cmp-muted);max-width:240px;min-width:0}.cmp-model>span:not(.cmp-maker){overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cmp-maker{color:#cf9073;font-size:18px;line-height:18px}.cmp-model>svg,.cmp-model>img{width:16px;height:16px}.cmp-model small{font-size:11px;line-height:17px;background:color-mix(in srgb,var(--cmp-ink) 5%,transparent);border-radius:3px;padding:0 5px;color:var(--cmp-ink);flex:none}.cmp-model select{border:0;outline:none;background:none;max-width:140px;font-size:12px;min-width:0}.cmp-model option{background:var(--cmp-surface)}.cmp-count{margin-left:auto;display:flex;gap:4px;font-size:12px;white-space:nowrap;color:var(--cmp-muted)}.cmp-count strong{font-weight:400;color:var(--cmp-ink);background:linear-gradient(110deg,var(--cmp-muted),var(--cmp-ink),var(--cmp-muted));background-size:220% 100%;background-clip:text;color:transparent;animation:cmp-shine 3s linear infinite}.cmp-count b{font-weight:400;color:var(--cmp-ink);margin-left:8px}.cmp-count[data-warning=true] b{color:#ce9863}.cmp-view{display:flex;gap:2px;border:1px solid var(--cmp-line);border-radius:6px;padding:2px}.cmp-view button{font-size:10px;border:0;background:none;color:var(--cmp-muted);padding:2px 6px;border-radius:3px}.cmp-view [aria-pressed=true]{background:color-mix(in srgb,var(--cmp-ink) 8%,transparent);color:var(--cmp-ink)}.cmp-status{font-size:10px;color:var(--cmp-muted)}.cmp-map{height:300px;width:100%;position:relative;border-radius:9px;isolation:isolate}.cmp-tile{position:absolute;padding:2px;transition:left .65s cubic-bezier(.22,1,.36,1),top .65s cubic-bezier(.22,1,.36,1),width .65s cubic-bezier(.22,1,.36,1),height .65s cubic-bezier(.22,1,.36,1);min-width:0;min-height:0;--tile-bg:rgba(130,130,140,.1);--tile-edge:rgba(140,140,150,.3);--tile-ink:var(--cmp-ink);animation:cmp-in .3s both}.cmp-tile button{display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:2px;width:100%;height:100%;padding:7px 9px;border:1px solid var(--tile-edge);border-radius:8px;background:var(--tile-bg);color:var(--tile-ink);overflow:hidden;text-align:left;container-type:size;transition:filter .15s,box-shadow .15s}.cmp-tile button:hover,.cmp-tile button[aria-pressed=true]{filter:brightness(1.1);box-shadow:inset 0 0 0 1px var(--tile-edge)}.cmp-tile-label{display:flex;align-items:center;gap:5px;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;font-size:12px}.cmp-tile-label svg,.cmp-tile-label img{width:13px;height:13px;display:inline-block;vertical-align:middle;margin-right:4px}.cmp-tile small{font-size:11px;opacity:.65;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}.cmp-tile.tools{--tile-bg:#39a4bc1c;--tile-edge:#4699ac55;--tile-ink:#4696ad}.cmp-tile.memory{--tile-bg:#7a65da24;--tile-edge:#8675c558;--tile-ink:#8b7cc4}.cmp-tile.file{--tile-bg:#4c7cdc24;--tile-edge:#6b91d455;--tile-ink:#628cc9}.cmp-tile.chat{--tile-bg:#b364ca20;--tile-edge:#ae72bb55;--tile-ink:#a274b6}.cmp-tile.result{--tile-bg:#48ae9222;--tile-edge:#61a18e55;--tile-ink:#4f9f86}.cmp-tile.summary{--tile-bg:#54ac6322;--tile-edge:#6aa77555;--tile-ink:#579666}.cmp-tile.free{--tile-ink:var(--cmp-muted)}.cmp-tile.free button{border:1px dashed var(--cmp-line);box-shadow:inset 0 0 0 3px color-mix(in srgb,var(--cmp-ink) 2%,transparent);background:repeating-linear-gradient(135deg,transparent 0 12px,color-mix(in srgb,var(--cmp-ink) 1.3%,transparent) 12px 13px)}:where(.dark,[data-theme=dark]) .cmp-tile.tools{--tile-ink:#80c8dc}:where(.dark,[data-theme=dark]) .cmp-tile.memory{--tile-ink:#b1a4f1}:where(.dark,[data-theme=dark]) .cmp-tile.file{--tile-ink:#9bbdf0}:where(.dark,[data-theme=dark]) .cmp-tile.chat{--tile-ink:#c3a1df}:where(.dark,[data-theme=dark]) .cmp-tile.result{--tile-ink:#8eceb9}:where(.dark,[data-theme=dark]) .cmp-tile.summary{--tile-ink:#96d0a1}.cmp-footer{display:flex;align-items:center;gap:8px;padding:12px 2px 0;margin-top:5px;border-top:1px solid var(--cmp-line);font-size:10px;color:var(--cmp-muted);min-height:32px;flex-wrap:wrap}.cmp-footer b{font-weight:400;padding:0 5px}.cmp-detail{position:absolute;z-index:10;bottom:45px;left:50%;transform:translateX(-50%);width:280px;max-width:calc(100% - 24px);background:var(--cmp-surface);border:1px solid var(--cmp-line);border-radius:10px;box-shadow:0 8px 30px #0002;padding:13px;animation:cmp-in .15s both}.cmp-detail[role=tooltip]{pointer-events:none}.cmp-detail header{display:flex;align-items:center;gap:6px}.cmp-detail strong{font-size:12px;font-weight:500}.cmp-detail header button{margin-left:auto;border:0;background:none;font-size:18px;color:var(--cmp-muted);padding:0 2px}.cmp-detail p{font-size:11px;color:var(--cmp-ink);margin:7px 0 0;line-height:1.6}.cmp-detail p span{color:var(--cmp-muted)}.cmp-detail ul{list-style:none;padding:8px 0 0;margin:0;display:grid;gap:6px;font-size:11px;color:var(--cmp-muted)}.cmp-detail li{display:flex;align-items:center;gap:6px}.cmp-detail svg,.cmp-detail img{width:14px;height:14px}
@container cmp (max-width:480px){.cmp-map{height:230px}.cmp-count{flex-basis:100%;margin-left:0}.cmp-header{gap:7px;padding-bottom:12px}.cmp-model{max-width:190px}.cmp-view{margin-left:auto}.cmp-tile button{padding:5px 6px}.cmp-tile-label{font-size:11px}.cmp-tile small{font-size:10px}}@container(width < 26px){.cmp-tile-label,.cmp-tile small{visibility:hidden}}@container(height < 12px){.cmp-tile-label,.cmp-tile small{visibility:hidden}}@keyframes cmp-shine{to{background-position:-220% 0}}@keyframes cmp-in{from{opacity:0}to{opacity:1}}@media(prefers-reduced-motion:reduce){.cmp-map-root *{animation:none!important;transition:none!important}.cmp-count strong{background:none;color:var(--cmp-ink)}}
.cmp-map-root{max-width:680px}
.cmp-title{font-size:13.5px}.cmp-logo{width:15px;height:15px}
.cmp-model{gap:6px;padding:2px 6px 2px 8px;height:28px;border-radius:7px;background:var(--cmp-surface);color:var(--cmp-ink);box-shadow:0 1px 1px #00000008}
.cmp-maker{font-size:13px;line-height:13px}.cmp-model small{font-size:10.5px;padding:0 5px;border-radius:4px}
.cmp-chev{width:12px!important;height:12px!important;color:var(--cmp-muted)}
.cmp-count{font-size:12px;align-items:center}.cmp-count strong{font-weight:500}
.cmp-count b{margin-left:8px;padding:1px 6px;border-radius:4px;background:color-mix(in srgb,var(--cmp-ink) 6%,transparent);font-size:11px}
.cmp-map{height:276px;border:1px solid var(--cmp-line);border-radius:10px;padding:2px;background:var(--cmp-surface)}
.cmp-map>.cmp-tile{padding:1.5px}
.cmp-tile button{border-radius:5px;padding:7px 9px;gap:1px}
.cmp-tile-label{font-size:12.5px;font-weight:400;line-height:16px}
.cmp-tile small{font-size:11px;opacity:.8}
.cmp-tile.system{--tile-bg:#f1f1f2;--tile-edge:#e4e4e7;--tile-ink:#3f3f46}
.cmp-tile.tools{--tile-bg:#e7f4f8;--tile-edge:#bfe0ea;--tile-ink:#0e7490}
.cmp-tile.memory{--tile-bg:#efecfb;--tile-edge:#d9d2f5;--tile-ink:#6d4fd8}
.cmp-tile.file{--tile-bg:#eaf2fd;--tile-edge:#c9dcf8;--tile-ink:#1d63d8}
.cmp-tile.chat{--tile-bg:#f5ecfa;--tile-edge:#e4d1f0;--tile-ink:#9441b8}
.cmp-tile.result{--tile-bg:#fff2dd;--tile-edge:#f6dbae;--tile-ink:#b45309}
.cmp-tile.summary{--tile-bg:#e8f6ec;--tile-edge:#c3e6cd;--tile-ink:#15803d}
.cmp-tile.free button{border:1px dashed var(--cmp-line);background:repeating-linear-gradient(135deg,transparent 0 6px,color-mix(in srgb,var(--cmp-ink) 4%,transparent) 6px 7px)}
:where(.dark,[data-theme=dark]) .cmp-tile.system{--tile-bg:#2a2a2e;--tile-edge:#38383d;--tile-ink:#d4d4d8}
:where(.dark,[data-theme=dark]) .cmp-tile.tools{--tile-bg:#13303a;--tile-edge:#1f4b59}
:where(.dark,[data-theme=dark]) .cmp-tile.memory{--tile-bg:#272044;--tile-edge:#3b3166}
:where(.dark,[data-theme=dark]) .cmp-tile.file{--tile-bg:#172a46;--tile-edge:#253f66}
:where(.dark,[data-theme=dark]) .cmp-tile.chat{--tile-bg:#2f1d3b;--tile-edge:#47305a}
:where(.dark,[data-theme=dark]) .cmp-tile.result{--tile-bg:#38290f;--tile-edge:#57401a;--tile-ink:#f2c27a}
:where(.dark,[data-theme=dark]) .cmp-tile.summary{--tile-bg:#15301e;--tile-edge:#22492e}
.cmp-footer{border-top:0;padding-top:8px;margin-top:4px;font-size:12px}
`;
export default ContextMap;
