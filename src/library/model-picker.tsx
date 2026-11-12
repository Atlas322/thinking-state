"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type PickerModel = {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  speed?: number;
  quality?: number;
  cost?: number;
  latencyMs?: number;
  pricePerM?: number;
};
export type Effort = "low" | "medium" | "high";

export type ModelPickerProps = {
  models?: PickerModel[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  thinking?: boolean;
  defaultThinking?: boolean;
  onThinkingChange?: (on: boolean) => void;
  webSearch?: boolean;
  defaultWebSearch?: boolean;
  onWebSearchChange?: (on: boolean) => void;
  effort?: Effort;
  defaultEffort?: Effort;
  onEffortChange?: (effort: Effort) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "end";
  side?: "bottom" | "top";
  placeholder?: string;
  className?: string;
};

const defaultModels: PickerModel[] = [
  { id: "auto", name: "Автомат", description: "Мессеж бүрт тохирох агентыг сонгоно" },
  { id: "fast", name: "Хурдан агент", description: "Богино асуултад хамгийн хурдан", speed: 5, quality: 3, cost: 1, latencyMs: 300 },
  { id: "balanced", name: "Бичигч агент", description: "Өдөр тутмын ажилд ухаалаг, хурдан", speed: 4, quality: 4, cost: 3, latencyMs: 800 },
  { id: "deep", name: "Судлаач агент", description: "Хэцүү ажилд хамгийн гүн бодно", speed: 2, quality: 5, cost: 5, latencyMs: 1900 },
];

const efforts: Effort[] = ["low", "medium", "high"];
const effortLabel: Record<Effort, string> = { low: "Бага", medium: "Дунд", high: "Өндөр" };
const effortMul: Record<Effort, number> = { low: 1.6, medium: 2.6, high: 4.2 };

function useRoll(target: number, ms = 300) {
  const [v, setV] = React.useState(target);
  const cur = React.useRef(target);
  React.useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = cur.current;
    if (reduce || from === target) { cur.current = target; setV(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      cur.current = from + (target - from) * (1 - Math.pow(1 - k, 3));
      setV(cur.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Bars({ n, lit }: { n?: number; lit?: boolean }) {
  return (
    <span className={`mp-bars${lit ? " is-lit" : ""}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={n != null && i <= n ? "on" : ""} style={{ transitionDelay: `${i * 30}ms` }} />)}
    </span>
  );
}

const Bulb = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12.5h4M6.5 14.5h3M8 1.8a4.2 4.2 0 0 0-2.5 7.6c.4.3.6.8.6 1.3v.3h3.8v-.3c0-.5.2-1 .6-1.3A4.2 4.2 0 0 0 8 1.8Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="mp-switch" onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

export function ModelPicker({
  models = defaultModels,
  value,
  defaultValue = "balanced",
  onChange,
  thinking,
  defaultThinking = true,
  onThinkingChange,
  webSearch,
  defaultWebSearch = false,
  onWebSearchChange,
  effort,
  defaultEffort = "medium",
  onEffortChange,
  open,
  defaultOpen = false,
  onOpenChange,
  align = "start",
  side = "bottom",
  placeholder = "Юу ч асуу…",
  className = "",
}: ModelPickerProps) {
  const [inId, setInId] = React.useState(models.some((m) => m.id === defaultValue) ? defaultValue : models[0]?.id);
  const [inThink, setInThink] = React.useState(defaultThinking);
  const [inWeb, setInWeb] = React.useState(defaultWebSearch);
  const [inEffort, setInEffort] = React.useState<Effort>(defaultEffort);
  const [inOpen, setInOpen] = React.useState(defaultOpen);
  const [active, setActive] = React.useState<string | null>(null);
  const [text, setText] = React.useState("");
  const id = value ?? inId;
  const think = thinking ?? inThink;
  const web = webSearch ?? inWeb;
  const eff = effort ?? inEffort;
  const isOpen = open ?? inOpen;
  const model = models.find((m) => m.id === id) ?? models[0];
  const shown = models.find((m) => m.id === active) ?? model;
  const listId = React.useId();
  const trigRef = React.useRef<HTMLButtonElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const setOpen = (o: boolean) => {
    if (open === undefined) setInOpen(o);
    onOpenChange?.(o);
    if (!o) setActive(null);
  };
  const pick = (mid: string) => {
    if (value === undefined) setInId(mid);
    onChange?.(mid);
    setOpen(false);
    trigRef.current?.focus();
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const away = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const latency = (shown.latencyMs ?? 900) * (think ? effortMul[eff] : 1) / 1000;
  const rLat = useRoll(latency);
  const routed = shown.speed == null && shown.quality == null && shown.cost == null;
  const initial = (m: PickerModel) => m.icon ?? <span className="mp-ini">{m.name[0]}</span>;

  const onListKey = (e: React.KeyboardEvent) => {
    const i = models.findIndex((m) => m.id === (active ?? id));
    let n = i;
    if (e.key === "ArrowDown") n = Math.min(models.length - 1, i + 1);
    else if (e.key === "ArrowUp") n = Math.max(0, i - 1);
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = models.length - 1;
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(models[i].id); return; }
    else return;
    e.preventDefault();
    setActive(models[n].id);
  };

  return (
    <div className={`mp ${className}`} ref={rootRef} onKeyDown={(e) => { if (e.key === "Escape" && isOpen) { setOpen(false); trigRef.current?.focus(); } }}>
      <style>{css}</style>
      <textarea className="mp-input" rows={1} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} aria-label="Мессеж" />
      <div className="mp-bar">
        <div className="mp-anchor">
          <button
            ref={trigRef}
            type="button"
            className="mp-trigger"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-label={`Загвар: ${model.name}${think ? ", гүн бодолт асаалттай" : ""}`}
            onClick={() => { setOpen(!isOpen); if (!isOpen) requestAnimationFrame(() => listRef.current?.focus()); }}
            onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); requestAnimationFrame(() => listRef.current?.focus()); } }}
          >
            {initial(model)}
            <span key={model.id} className="mp-name">{model.name}</span>
            <span className={`mp-bulb${think ? " is-on" : ""}`}><Bulb /></span>
            <svg className="mp-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </button>
          <div className={`mp-menu mp-${side} mp-${align}${isOpen ? " is-open" : ""}`} inert={!isOpen ? true : undefined}>
            <div className="mp-head" aria-hidden="true"><span>Загвар</span><span>Хурд</span><span>Чанар</span><span>Зардал</span></div>
            <div
              ref={listRef}
              id={listId}
              role="listbox"
              tabIndex={0}
              aria-label="Загварууд"
              aria-activedescendant={`${listId}-${active ?? id}`}
              className={`mp-list${active ? " has-active" : ""}`}
              onKeyDown={onListKey}
              onMouseLeave={() => setActive(null)}
            >
              {models.map((m) => {
                const r = m.speed == null && m.quality == null && m.cost == null;
                return (
                  <div
                    key={m.id}
                    id={`${listId}-${m.id}`}
                    role="option"
                    aria-selected={m.id === id}
                    className={`mp-opt${m.id === active ? " is-active" : ""}`}
                    onMouseEnter={() => setActive(m.id)}
                    onClick={() => pick(m.id)}
                  >
                    <span className="mp-opt-main">
                      {initial(m)}
                      <span>
                        <strong>{m.name}{m.id === id && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>}</strong>
                        {m.description && <small>{m.description}</small>}
                      </span>
                    </span>
                    {r ? (
                      <span className="mp-varies">Өөр өөр</span>
                    ) : (
                      <>
                        <Bars n={m.speed} lit={m.id === (active ?? id)} />
                        <Bars n={m.quality} lit={m.id === (active ?? id)} />
                        <Bars n={m.cost} lit={m.id === (active ?? id)} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mp-sep" />
            <div className="mp-set">
              <span className="mp-set-l"><Bulb /><span>Гүн бодолт<small>Хариулахаасаа өмнө бодно</small></span></span>
              <Switch on={think} label="Гүн бодолт" onChange={(v) => { if (thinking === undefined) setInThink(v); onThinkingChange?.(v); }} />
            </div>
            <div className={`mp-effort-wrap${think ? " is-open" : ""}`}>
              <div className="mp-effort-in">
                <div
                  className="mp-effort"
                  role="radiogroup"
                  aria-label="Хүчин чармайлт"
                  onKeyDown={(e) => {
                    const i = efforts.indexOf(eff);
                    const n = e.key === "ArrowRight" ? Math.min(2, i + 1) : e.key === "ArrowLeft" ? Math.max(0, i - 1) : i;
                    if (n !== i) { if (effort === undefined) setInEffort(efforts[n]); onEffortChange?.(efforts[n]); }
                  }}
                >
                  <span className="mp-eff-thumb" style={{ transform: `translateX(${efforts.indexOf(eff) * 100}%)` }} />
                  {efforts.map((x) => (
                    <button key={x} type="button" role="radio" aria-checked={x === eff} tabIndex={x === eff ? 0 : -1} onClick={() => { if (effort === undefined) setInEffort(x); onEffortChange?.(x); }}>
                      {effortLabel[x]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mp-set">
              <span className="mp-set-l">
                <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M2 8h12M8 2c-2.2 2.4-2.2 9.6 0 12M8 2c2.2 2.4 2.2 9.6 0 12" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg>
                <span>Вэб хайлт<small>Шаардлагатай үед хайж олно</small></span>
              </span>
              <Switch on={web} label="Вэб хайлт" onChange={(v) => { if (webSearch === undefined) setInWeb(v); onWebSearchChange?.(v); }} />
            </div>
            <div className="mp-tray">
              <span>Эхний хариу <b>{routed ? "өөр өөр" : `~${rLat.toFixed(1)} с`}</b></span>
              <span>Зардал <b>{routed || shown.cost == null ? "өөр өөр" : `${shown.cost}/5`}</b></span>
            </div>
          </div>
        </div>
        <button type="button" className="mp-send" aria-label="Илгээх" disabled={!text.trim()}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

const css = `
.mp{--mp-bg:#fff;--mp-fg:#18181b;--mp-muted:#65656d;--mp-faint:#65656d;--mp-line:#ececef;--mp-soft:#f4f4f5;--mp-seg:#e4e4e7;--mp-blue:#3b82f6;position:relative;width:100%;max-width:360px;background:var(--mp-bg);color:var(--mp-fg);border:1px solid var(--mp-line);border-radius:10px;box-shadow:0 1px 2px #0000000a;font:400 13px/1.4 Inter,system-ui,sans-serif}
:where(.dark,[data-theme=dark]) .mp{--mp-bg:#1b1b1e;--mp-fg:#ececef;--mp-muted:#a1a1aa;--mp-faint:#9a9aa2;--mp-line:#2e2e33;--mp-soft:#26262b;--mp-seg:#38383e;color-scheme:dark}
.mp *{box-sizing:border-box}.mp button{font:inherit;color:inherit;cursor:pointer}
.mp-input{display:block;width:100%;resize:none;border:0;outline:0;background:none;color:var(--mp-fg);font:inherit;font-size:13.5px;padding:14px 14px 6px}
.mp-input::placeholder{color:var(--mp-faint)}
.mp-bar{display:flex;align-items:center;justify-content:space-between;padding:6px 10px 10px 14px}
.mp-anchor{position:relative}
.mp-trigger{display:flex;align-items:center;gap:7px;height:26px;margin-left:-6px;padding:0 6px;border:0;border-radius:6px;background:none;font-size:13.5px!important}
.mp-trigger:hover,.mp-trigger[aria-expanded=true]{background:var(--mp-soft)}
.mp-ini{display:grid;place-items:center;width:18px;height:18px;border:1px solid var(--mp-line);border-radius:5px;font-size:10px;font-weight:600;flex:none;background:var(--mp-bg)}
.mp-name{animation:mp-fade .25s both}
.mp-bulb{display:grid;place-items:center;width:0;overflow:hidden;color:var(--mp-blue);transition:width .2s}.mp-bulb.is-on{width:14px}.mp-bulb svg{width:14px;height:14px;flex:none}
.mp-chev{width:13px;height:13px;color:var(--mp-muted)}
.mp-send{display:grid;place-items:center;width:28px;height:28px;border:0;border-radius:7px;background:var(--mp-fg);color:var(--mp-bg)!important}.mp-send svg{width:15px;height:15px}.mp-send:disabled{cursor:default;opacity:1}
.mp-menu{position:absolute;z-index:20;width:380px;padding:6px;background:var(--mp-bg);border:1px solid var(--mp-line);border-radius:10px;box-shadow:0 12px 36px #0000001f;opacity:0;transform:scale(.97);pointer-events:none;transition:opacity .14s,transform .14s}
.mp-menu.is-open{opacity:1;transform:none;pointer-events:auto}
.mp-bottom{top:calc(100% + 6px)}.mp-top{bottom:calc(100% + 6px)}
.mp-start{left:-6px;transform-origin:top left}.mp-end{right:0;transform-origin:top right}.mp-top.mp-start{transform-origin:bottom left}
.mp-head,.mp-opt{display:grid;grid-template-columns:minmax(0,1fr) 40px 40px 40px;gap:8px;align-items:center}
.mp-head{padding:4px 8px 6px;font-size:11px;color:var(--mp-faint)}.mp-head span:not(:first-child){text-align:center}
.mp-list{outline:0}
.mp-opt{padding:7px 8px;border-radius:6px;cursor:pointer;transition:opacity .15s,background .15s}
.mp-list.has-active .mp-opt:not(.is-active){opacity:.55}
.mp-opt.is-active{background:var(--mp-soft)}
.mp-list:focus-visible .mp-opt.is-active{box-shadow:inset 0 0 0 2px var(--mp-blue)}
.mp-opt-main{display:flex;align-items:center;gap:9px;min-width:0}
.mp-opt-main>span:last-child{display:flex;flex-direction:column;min-width:0}
.mp-opt strong{display:flex;align-items:center;gap:5px;font-weight:500}.mp-opt strong svg{width:12px;height:12px;color:var(--mp-blue)}
.mp-opt small{font-size:11.5px;color:var(--mp-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-bars{display:flex;gap:2px;justify-content:center}
.mp-bars i{width:5px;height:10px;border-radius:1.5px;background:var(--mp-seg);transition:background .2s}
.mp-bars i.on{background:var(--mp-faint)}.mp-bars.is-lit i.on{background:var(--mp-blue)}
.mp-varies{grid-column:2/5;text-align:center;font-size:11.5px;color:var(--mp-faint)}
.mp-sep{height:1px;margin:6px 2px;background:var(--mp-line)}
.mp-set{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 8px}
.mp-set-l{display:flex;align-items:center;gap:9px}.mp-set-l>svg{width:15px;height:15px;color:var(--mp-muted);flex:none}
.mp-set-l>span{display:flex;flex-direction:column}.mp-set-l small{font-size:11.5px;color:var(--mp-muted)}
.mp-switch{position:relative;width:30px;height:18px;padding:0;border:0;border-radius:9px;background:var(--mp-seg);transition:background .2s;flex:none}
.mp-switch span{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0003;transition:transform .2s}
.mp-switch[aria-checked=true]{background:var(--mp-blue)}.mp-switch[aria-checked=true] span{transform:translateX(12px)}
.mp-effort-wrap{display:grid;grid-template-rows:0fr;transition:grid-template-rows .22s}.mp-effort-wrap.is-open{grid-template-rows:1fr}
.mp-effort-in{overflow:hidden;min-height:0}
.mp-effort{position:relative;display:flex;margin:2px 8px 6px 32px;padding:2px;border-radius:7px;background:var(--mp-soft)}
.mp-eff-thumb{position:absolute;top:2px;bottom:2px;left:2px;width:calc((100% - 4px)/3);border-radius:5px;background:var(--mp-bg);box-shadow:0 1px 2px #00000014;transition:transform .18s}
.mp-effort button{position:relative;flex:1;height:22px;border:0;background:none;font-size:12px!important;color:var(--mp-muted)!important}.mp-effort button[aria-checked=true]{color:var(--mp-fg)!important;font-weight:500}
.mp-tray{display:flex;justify-content:space-between;margin:6px -6px -6px;padding:9px 14px;border-top:1px solid var(--mp-line);border-radius:0 0 10px 10px;background:var(--mp-soft);font-size:12px;color:var(--mp-muted);font-variant-numeric:tabular-nums}
.mp-tray b{color:var(--mp-fg);font-weight:500}
.mp :focus-visible{outline:2px solid var(--mp-blue);outline-offset:2px}
@keyframes mp-fade{from{opacity:0}}
@media(max-width:480px){.mp-menu{width:calc(100vw - 32px);max-width:380px}.mp-opt small{display:none}}
@media(prefers-reduced-motion:reduce){.mp *{animation:none!important;transition:none!important}}
`;

export default ModelPicker;
