"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type Integration = {
  id: string;
  name: string;
  domain: string;
  category: string;
  description: string;
  features: string[];
  /** SVG path data drawn in white on the brand color (24×24 box). */
  path?: string;
  color?: string;
  icon?: React.ReactNode;
  connected?: boolean;
};

export type IntegrationPickerProps = {
  integrations?: Integration[];
  appName?: string;
  appIcon?: React.ReactNode;
  defaultSelected?: string;
  onToggle?: (id: string, connected: boolean) => void;
  onExplore?: (id: string) => void;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

const defaultIntegrations: Integration[] = [
  {
    id: "tasks", name: "Ажлын самбар", domain: "tasks.example.mn", category: "Төслийн удирдлага", color: "#5e6ad2", connected: true,
    description: "Чатан дахь хүсэлтийг даалгавар болгож, төлөвийг хоёр талд нь ижил байлгана.",
    features: ["Дурын мессежээс даалгавар үүсгэх", "Төлөвийг хоёр талд шинэчлэх", "Даалгаврыг харилцагчтай холбох"],
  },
  {
    id: "docs", name: "Баримтын сан", domain: "docs.example.mn", category: "Баримт ба вики", color: "#3f3f46", connected: true,
    description: "Ажлын орчноосоо хайж, хариултыг баг тань дараа олох хуудас болгон хадгална.",
    features: ["Хуудас ба хүснэгтээс хайх", "Хариултыг хуудас болгох", "Эрхийн тохиргоог хадгалах"],
  },
  {
    id: "payments", name: "Төлбөрийн систем", domain: "pay.example.mn", category: "Төлбөр", color: "#635bff", connected: true,
    description: "Харилцагч, нэхэмжлэл, захиалгыг ярианаас гаралгүй харна.",
    features: ["Харилцагч ба нэхэмжлэл хайх", "Зөвшөөрөлтэй буцаалт", "Орлогын тойм"],
  },
  {
    id: "design", name: "Дизайны файл", domain: "design.example.mn", category: "Дизайн", color: "#a259ff",
    description: "Фрейм, сэтгэгдлийг контекстэд татаж, шууд урьдчилан харагдах холбоос хуваалцана.",
    features: ["Фреймийг шууд харах", "Файлын сэтгэгдэл унших", "Фреймийг даалгавартай холбох"],
  },
  {
    id: "crm", name: "Харилцагчийн бүртгэл", domain: "crm.example.mn", category: "Борлуулалт", color: "#f97316",
    description: "Хүсэлт бүрийн хажууд харилцагч, гэрээг харж, дуудлагыг автоматаар бүртгэнэ.",
    features: ["Харилцагч ба гэрээ хайх", "Тэмдэглэл, дуудлага бүртгэх", "Хариуцагчийг ижилсгэх"],
  },
  {
    id: "shop", name: "Онлайн дэлгүүр", domain: "shop.example.mn", category: "Худалдаа", color: "#65a30d",
    description: "Захиалгын асуултад дэлгүүрийн бодит өгөгдлөөр хариулна.",
    features: ["Захиалга ба хүргэлтийн төлөв", "Бараа хайх", "Буцаалтын ноорог"],
  },
  {
    id: "data", name: "Өгөгдлийн сан", domain: "data.example.mn", category: "Өгөгдөл", color: "#0ea5e9",
    description: "Энгийн хүсэлтээр бичлэг уншиж, шинэчилнэ.",
    features: ["Дурын хүснэгтээс асуух", "Бичлэг нэмэх, засах", "Талбарын төрлийг баримтлах"],
  },
  {
    id: "site", name: "Вэб бүтээгч", domain: "site.example.mn", category: "Вэб сайт", color: "#146ef5",
    description: "Агуулгыг засаж, хянасны дараа сайтдаа нийтэлнэ.",
    features: ["Агуулгын цуглуулга засах", "Нийтлэхээс өмнө бэлтгэх", "Маягтын илгээлтүүд"],
  },
  {
    id: "cloud", name: "Үүлэн сервер", domain: "cloud.example.mn", category: "Хөгжүүлэлт", color: "#18181b",
    description: "Байршуулалтыг дагаж, лог уншиж, нэг дороос буцаана.",
    features: ["Байршуулалтын төлөв", "Ажиллагааны лог", "Шуурхай буцаалт"],
  },
  {
    id: "todo", name: "Даалгаврын жагсаалт", domain: "todo.example.mn", category: "Төслийн удирдлага", color: "#7b68ee",
    description: "Мессежээс даалгавар үүсгэж, жагсаалтыг багтайгаа ижил байлгана.",
    features: ["Мессежээс даалгавар", "Хариуцагч ба хугацаа", "Төлөвийг ижилсгэх"],
  },
];

const appMark = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6h7v4h5v8h-7v-4H6Z" fill="#fff" />
    <path d="M11 10h2v4h-2Z" fill="#000" />
  </svg>
);

const tile = (i: Integration) =>
  i.icon ?? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="6" fill={i.color ?? "#71717a"} />
      {i.path ? <path d={i.path} fill="#fff" /> : <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">{i.name[0]}</text>}
    </svg>
  );

export function IntegrationPicker({
  integrations = defaultIntegrations,
  appName = "Манай апп",
  appIcon = appMark,
  defaultSelected,
  onToggle,
  onExplore,
  onBack,
  onClose,
  className = "",
}: IntegrationPickerProps) {
  const [conn, setConn] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(integrations.map((i) => [i.id, !!i.connected])),
  );
  const [selected, setSelected] = React.useState(defaultSelected ?? integrations[0]?.id);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  const q = query.trim().toLowerCase();
  const match = (i: Integration) => !q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
  const connected = integrations.filter((i) => conn[i.id] && match(i));
  const available = integrations.filter((i) => !conn[i.id] && match(i));
  const flat = [...connected, ...available];
  const current = integrations.find((i) => i.id === selected) ?? flat[0];
  const isOn = current ? !!conn[current.id] : false;
  const count = integrations.filter((i) => conn[i.id]).length;

  React.useEffect(() => {
    if (flat.length && !flat.some((i) => i.id === selected)) setSelected(flat[0].id);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    listRef.current?.querySelector(`[data-id="${selected}"]`)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (i: Integration) => {
    const next = !conn[i.id];
    setConn((c) => ({ ...c, [i.id]: next }));
    onToggle?.(i.id, next);
  };

  const row = (i: Integration) => (
    <div
      key={i.id}
      data-id={i.id}
      id={`${id}-${i.id}`}
      role="option"
      aria-selected={i.id === current?.id}
      className={`ip-row ${i.id === current?.id ? "on" : ""}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setSelected(i.id)}
    >
      <span className="ip-tile">{tile(i)}</span>
      <span className="ip-txt">
        <span className="ip-name">{i.name}</span>
        <span className="ip-cat">{i.category}</span>
      </span>
    </div>
  );

  return (
    <section className={`ip ${className}`} aria-label="Холболтууд">
      <style>{css}</style>
      <header className="ip-head">
        <button
          type="button"
          className="ip-back"
          aria-label="Буцах"
          onClick={() => onBack?.()}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 4-4 4 4 4" /></svg>
        </button>
        <span className="ip-crumb">Холболтууд</span>
        <input
          ref={inputRef}
          className="ip-search"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={current ? `${id}-${current.id}` : undefined}
          aria-label="Холболт хайх"
          placeholder="Холболт хайх"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            const idx = flat.findIndex((i) => i.id === current?.id);
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              if (!flat.length) return;
              const n = e.key === "ArrowDown" ? Math.min(flat.length - 1, idx + 1) : Math.max(0, idx - 1);
              setSelected(flat[n].id);
            } else if (e.key === "Enter" && current) {
              e.preventDefault();
              toggle(current);
            } else if (e.key === "Escape") {
              if (query) setQuery("");
              else onClose?.();
            } else if (e.key === "ArrowLeft" && !query && onBack) {
              onBack();
            }
          }}
        />
        <kbd className="ip-kbd">⌘/</kbd>
      </header>

      <div className="ip-body">
        <div className="ip-list" id={`${id}-list`} role="listbox" aria-label="Холболтууд" ref={listRef}>
          {connected.length > 0 && (
            <div role="group" aria-label="Холбогдсон">
              <div className="ip-group">Холбогдсон</div>
              {connected.map(row)}
            </div>
          )}
          {available.length > 0 && (
            <div role="group" aria-label="Боломжтой">
              <div className="ip-group">Боломжтой</div>
              {available.map(row)}
            </div>
          )}
          {!flat.length && <p className="ip-empty">“{query}”-д тохирох холболт алга</p>}
        </div>

        {current && (
          <div className="ip-detail" aria-live="polite">
            <div className={`ip-stage ${isOn ? "live" : ""}`}>
              <span className="ip-ring r1" aria-hidden="true" />
              <span className="ip-ring r2" aria-hidden="true" />
              <span className="ip-ring r3" aria-hidden="true" />
              <span className="ip-big app">{appIcon}</span>
              <svg className={`ip-arrows ${isOn ? "on" : ""}`} viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 6h9.5m-2-2 2 2-2 2M13 10H3.5m2-2-2 2 2 2" />
              </svg>
              <span className="ip-big" key={current.id}>{tile(current)}</span>
            </div>
            <div className="ip-info">
              <div className="ip-titlerow">
                <h3>
                  {appName} + {current.name}
                </h3>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isOn}
                  aria-label={`${current.name}: ${isOn ? "салгах" : "холбох"}`}
                  className="ip-switch"
                  onClick={() => toggle(current)}
                >
                  <span />
                </button>
              </div>
              <div className="ip-meta">
                {current.domain}
                {isOn && <span className="ip-badge">Холбогдсон</span>}
              </div>
              <p className="ip-desc">{current.description}</p>
              <ul className="ip-feats">
                {current.features.map((f) => (
                  <li key={f}>
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button type="button" className="ip-explore" onClick={() => onExplore?.(current.id)}>
                Дэлгэрэнгүй үзэх
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="ip-foot">
        <span className="ip-count">
          <i />
          {count}/{integrations.length} холбогдсон
        </span>
        <span className="ip-keys">
          <kbd>↑</kbd>
          <kbd>↓</kbd> шилжих <kbd>↵</kbd> сэлгэх
        </span>
      </footer>
    </section>
  );
}

const css = `
.ip{--ip-bg:#fff;--ip-fg:#18181b;--ip-muted:#71717a;--ip-faint:#a1a1aa;--ip-line:#ececef;--ip-soft:#f4f4f5;--ip-hover:#efeff1;--ip-stage:#f7f7f8;--ip-blue:#3b82f6;--ip-green:#15803d;--ip-green-bg:#e3f6e8;width:100%;max-width:660px;background:var(--ip-bg);color:var(--ip-fg);border:1px solid var(--ip-line);border-radius:12px;box-shadow:0 1px 3px #0000000d;font:400 14px/1.45 Inter,system-ui,sans-serif;overflow:hidden;container:ip/inline-size}
:where(.dark,[data-theme=dark]) .ip{--ip-bg:#1b1b1e;--ip-fg:#ececef;--ip-muted:#a1a1aa;--ip-faint:#71717a;--ip-line:#2e2e33;--ip-soft:#26262a;--ip-hover:#2a2a2f;--ip-stage:#222226;--ip-green:#4ade80;--ip-green-bg:#173323;color-scheme:dark}
.ip *{box-sizing:border-box}.ip button{font:inherit;color:inherit;cursor:pointer}
.ip-head{display:flex;align-items:center;gap:8px;height:46px;padding:0 12px 0 10px;border-bottom:1px solid var(--ip-line)}
.ip-back{display:grid;place-items:center;width:24px;height:24px;padding:0;border:0;border-radius:6px;background:none;color:var(--ip-muted)}.ip-back:hover{background:var(--ip-soft);color:var(--ip-fg)}
.ip-back svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}
.ip-crumb{padding:1px 6px;border-radius:5px;background:var(--ip-soft);font-size:12.5px;color:var(--ip-fg)}
.ip-search{flex:1;min-width:0;height:30px;border:0;outline:0;background:none;color:inherit;font:inherit;font-size:14px}
.ip .ip-search:focus-visible{outline:none}
.ip-search::placeholder{color:var(--ip-faint)}
.ip-kbd{font:500 10px/1 Inter,system-ui,sans-serif;padding:3px 4px;border:1px solid var(--ip-line);border-radius:4px;color:var(--ip-muted)}
.ip-body{display:grid;grid-template-columns:280px minmax(0,1fr);height:356px}
.ip-list{overflow:auto;padding:4px;border-right:1px solid var(--ip-line);scrollbar-width:thin}
.ip-group{padding:10px 8px 4px;font-size:10.5px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--ip-muted)}
.ip-row{display:flex;align-items:center;gap:10px;padding:4px 8px;height:44px;border-radius:7px;cursor:pointer}
.ip-row:hover{background:color-mix(in srgb,var(--ip-hover) 60%,transparent)}
.ip-row.on{background:var(--ip-hover)}
.ip-tile{display:grid;place-items:center;width:24px;height:24px;flex:none}.ip-tile svg{width:24px;height:24px;display:block}
.ip-txt{display:flex;flex-direction:column;min-width:0;line-height:1.3}
.ip-name{font-size:14px}
.ip-cat{font-size:12.5px;color:var(--ip-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ip-empty{padding:24px 10px;margin:0;text-align:center;color:var(--ip-muted);font-size:13px}
.ip-detail{display:flex;flex-direction:column;min-width:0;padding:8px;overflow:auto}
.ip-stage{position:relative;display:flex;align-items:center;justify-content:center;gap:26px;height:104px;border:1px solid var(--ip-line);border-radius:8px;background:var(--ip-stage);overflow:hidden;flex:none}
.ip-ring{position:absolute;left:50%;top:50%;border:1px solid var(--ip-line);border-radius:50%;transform:translate(-50%,-50%)}
.ip-ring.r1{width:68px;height:68px}.ip-ring.r2{width:150px;height:150px}.ip-ring.r3{width:236px;height:236px}
.ip-stage.live .ip-ring.r1{border-color:color-mix(in srgb,var(--ip-blue) 30%,var(--ip-line));animation:ip-ring 2.8s ease-out infinite}
.ip-big{position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:10px;box-shadow:0 2px 6px #00000014;animation:ip-swap .25s ease-out}
.ip-big svg{width:44px;height:44px;display:block;border-radius:10px}
.ip-big.app{background:#000;animation:none}.ip-big.app svg{width:28px;height:28px}
.ip-arrows{position:relative;width:16px;height:16px;fill:none;stroke:var(--ip-faint);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round;transition:transform .5s,stroke .2s}
.ip-arrows.on{stroke:var(--ip-blue);transform:rotate(180deg)}
.ip-info{padding:14px 8px 4px}
.ip-titlerow{display:flex;align-items:center;justify-content:space-between;gap:10px}
.ip-titlerow h3{margin:0;font-size:15px;font-weight:500;letter-spacing:-.005em}
.ip-switch{position:relative;width:32px;height:18px;flex:none;padding:0;border:0;border-radius:99px;background:color-mix(in srgb,var(--ip-fg) 18%,transparent);transition:background .2s}
.ip-switch span{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0003;transition:transform .2s}
.ip-switch[aria-checked=true]{background:var(--ip-blue)}.ip-switch[aria-checked=true] span{transform:translateX(14px)}
.ip-meta{display:flex;align-items:center;gap:7px;margin-top:1px;font-size:12.5px;color:var(--ip-muted)}
.ip-badge{padding:0 5px;border-radius:4px;background:var(--ip-green-bg);color:var(--ip-green);font-size:11.5px;line-height:17px}
.ip-desc{margin:10px 0 12px;color:var(--ip-fg);opacity:.85}
.ip-feats{list-style:none;margin:0 0 18px;padding:0;display:grid;gap:4px}
.ip-feats li{display:flex;align-items:center;gap:9px;color:var(--ip-fg);opacity:.85}
.ip-feats svg{width:14px;height:14px;fill:none;stroke:var(--ip-faint);stroke-width:1.5;stroke-linecap:round;flex:none}
.ip-explore{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border:1px solid var(--ip-line);border-radius:7px;background:var(--ip-bg);font-size:14px}
.ip-explore:hover{background:var(--ip-soft)}
.ip-explore svg{width:12px;height:12px;fill:none;stroke:var(--ip-muted);stroke-width:1.5;stroke-linecap:round}
.ip-foot{display:flex;align-items:center;justify-content:space-between;height:40px;padding:0 12px;border-top:1px solid var(--ip-line);font-size:12.5px;color:var(--ip-muted)}
.ip-count{display:flex;align-items:center;gap:8px}.ip-count i{width:6px;height:6px;border-radius:50%;background:#22c55e}
.ip-keys kbd{display:inline-grid;place-items:center;min-width:17px;height:17px;margin:0 2px;padding:0 3px;border:1px solid var(--ip-line);border-radius:4px;font:inherit;font-size:10px}
.ip :focus-visible{outline:2px solid var(--ip-blue);outline-offset:1px}
@keyframes ip-ring{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(3.4);opacity:0}}
@keyframes ip-swap{from{opacity:0;filter:blur(3px);transform:translateY(4px)}}
@container ip (max-width:560px){.ip-body{grid-template-columns:1fr;height:auto}.ip-list{max-height:220px;border-right:0;border-bottom:1px solid var(--ip-line)}.ip-keys{display:none}}
@container ip (max-width:400px){.ip-feats{display:none}}
@media(prefers-reduced-motion:reduce){.ip *{animation:none!important;transition:none!important}}
`;

export default IntegrationPicker;
