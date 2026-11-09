"use client";
import * as React from "react";

// Simple Icons brand paths (CC0): v16.37.0, OpenAI v14.0.0.
const providerPaths = {
  claude:
    "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  openai:
    "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  googlegemini:
    "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
};
function ProviderMark({ model = "" }: { model?: string }) {
  const brand = /GPT|OpenAI/i.test(model)
    ? "openai"
    : /Gemini/i.test(model)
      ? "googlegemini"
      : "claude";
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill={
        brand === "claude"
          ? "#d97757"
          : brand === "googlegemini"
            ? "#4f65ff"
            : "currentColor"
      }
      style={{ width: "1em", height: "1em", display: "block", stroke: "none" }}
    >
      <path d={providerPaths[brand]} />
    </svg>
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
  { id: "system", label: "System prompt", kind: "system", tokens: 6200 },
  {
    id: "tools",
    label: "Tool definitions",
    kind: "tools",
    tokens: 14800,
    items: [
      { label: "search_web" },
      { label: "read_file" },
      { label: "run_tests" },
    ],
  },
  { id: "memory", label: "Project memory", kind: "memory", tokens: 9400 },
  {
    id: "spec",
    label: "checkout.spec.ts",
    kind: "file",
    tokens: 8200,
    detail: "Read at 0:09",
  },
  { id: "payment", label: "payment.ts", kind: "file", tokens: 17600 },
  { id: "chat", label: "Chat", kind: "chat", tokens: 30200 },
  {
    id: "tests",
    label: "Test run · 20×",
    kind: "result",
    tokens: 22400,
    detail: "npm test, run 20 times while fixing the checkout",
  },
  {
    id: "stripe",
    label: "stripe.ts (mock)",
    kind: "file",
    tokens: 11800,
    icon: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect width="16" height="16" rx="3.5" fill="#635bff" />
        <path d="M8.4 6.3c-.9-.3-1.4-.5-1.4-.9 0-.3.3-.5.8-.5.9 0 1.9.4 2.5.7V3.9a6.6 6.6 0 0 0-2.5-.5C6 3.4 4.8 4.4 4.8 6c0 2.4 3.3 2 3.3 3.1 0 .4-.3.5-.9.5-.9 0-2-.4-2.7-.8v1.8c.8.4 1.7.5 2.7.5 1.9 0 3.1-.9 3.1-2.5 0-2.4-3.3-2-3.3-3" fill="#fff" />
      </svg>
    ),
  },
  { id: "search", label: "Search results", kind: "result", tokens: 15600 },
  { id: "receipt", label: "receipt.tsx", kind: "file", tokens: 23800 },
];
const compactNumber = (value: number) =>
  value >= 1000000
    ? `${(value / 1000000).toFixed(value % 1000000 ? 1 : 0)}m`
    : value >= 1000
      ? `${(value / 1000).toFixed(value % 1000 ? 1 : 0)}k`
      : String(Math.round(value));
const kinds = {
  system: "System prompt",
  tools: "Tools",
  memory: "Memory",
  file: "File",
  chat: "Chat",
  result: "Tool results",
  summary: "Summary",
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
  model = "Checkout fixer",
  modelIcon,
  agents = [],
  agent,
  onAgentChange,
  compaction = null,
  view,
  onViewChange,
  status,
  onSelect,
  title = "Context",
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
              aria-label="Select context agent"
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
          <span className="cmp-view" role="group" aria-label="Compaction view">
            {(["before", "after"] as const).map((mode) => (
              <button
                key={mode}
                aria-pressed={mode === currentView}
                onClick={() => changeView(mode)}
              >
                {mode === "before" ? "Before" : "After"}
              </button>
            ))}
          </span>
        )}
      </header>
      <div
        ref={map}
        className="cmp-map"
        role="list"
        aria-label={`${title} blocks`}
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
              aria-label={`${tile.block?.label ?? "Free space"}, ${tile.block ? kinds[tile.block.kind] : "available"}, ${tile.tokens.toLocaleString()} tokens`}
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
                {tile.block?.label ?? "Free"}
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
              tokens freed
            </span>
            <span>
              {compaction.summarized?.length ?? 0} summarized <b>·</b>{" "}
              {compaction.dropped?.length ?? 0} dropped
              {compaction.summary ? ` · ${compaction.summary}` : ""}
            </span>
          </>
        ) : (
          <span>
            Not compacted yet – once it is, compare before and after here.
          </span>
        )}
      </footer>
      {selected && (
        <aside
          className="cmp-detail"
          role={pinned ? "dialog" : "tooltip"}
          aria-label={`${selected.block?.label ?? "Free space"} details`}
        >
          <header>
            <span>{selected.block?.icon}</span>
            <strong>{selected.block?.label ?? "Free space"}</strong>
            {pinned && (
              <button
                aria-label="Unpin details"
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
            {selected.tokens.toLocaleString()} tokens{" "}
            <span>
              · {((selected.tokens / capacity) * 100).toFixed(1)}% of the window
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
