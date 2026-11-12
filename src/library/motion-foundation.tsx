// Motion foundation preview: springs, loop primitives, in-view playback,
// ↺ / ⏸ and a frame-rate meter for the many-loops stress test.
import * as React from "react";
import {
  LOOPS,
  LOOP_NOTES,
  LoopRegion,
  MotionProvider,
  MotionStyles,
  SPRINGS,
  dampingRatio,
  spring,
  springAt,
  useMotion,
  usePrefersReducedMotion,
  type LoopName,
  type SpringName,
} from "../motion";
import { Icon, type IconName } from "../company/icons";

/** A LoopRegion: loops inside play only in view, with ↺ / ⏸ on top. */
export function MotionFoundation(props: React.ComponentProps<typeof LoopRegion>) {
  return <LoopRegion {...props} />;
}

const DEMO_ICON: Record<LoopName, IconName> = {
  bob: "inbox",
  swing: "flag",
  breathe: "sparkles",
  float: "message-circle",
  spin: "asterisk",
  pulse: "circle-dot",
  nudge: "arrow-right",
  pop: "circle-check",
  shake: "triangle-alert",
};
const ORIGIN: Partial<Record<LoopName, string>> = { swing: "20% 90%" };
/** Mongolian display names; the keys stay the API names */
const LOOP_MN: Record<LoopName, string> = { bob: "дүүлэх", swing: "савлах", breathe: "амьсгалах", float: "хөвөх", spin: "эргэх", pulse: "лугших", nudge: "түлхэх", pop: "товших", shake: "доргих" };
const SPRING_MN: Record<SpringName, string> = { soft: "зөөлөн", settle: "тогтох", heavy: "хүнд" };

function Curve({ name }: { name: SpringName }) {
  const e = spring(name);
  const w = 168;
  const h = 72;
  const pts = Array.from({ length: 61 }, (_, i) => {
    const p = i / 60;
    const x = springAt(SPRINGS[name], (p * e.duration) / 1000);
    return `${(p * w).toFixed(1)},${(h - 12 - x * (h - 30)).toFixed(1)}`;
  }).join(" ");
  return (
    <figure className="mf-curve">
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
        <line x1="0" x2={w} y1={h - 12 - (h - 30)} y2={h - 12 - (h - 30)} className="mf-rest" />
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.75" />
      </svg>
      <figcaption>
        <b>{SPRING_MN[name]}</b>
        <span>
          ζ {dampingRatio(SPRINGS[name]).toFixed(2)} · {e.duration} ms · {e.overshoot ? `+${Math.round(e.overshoot * 100)}%` : "0%"}
        </span>
      </figcaption>
    </figure>
  );
}

/** Stagger: the 9 primitives 100 ms apart; stress-test tiles spread over the whole 5.2 s period. */
const delay = (i: number) => (i < LOOPS.length ? `${i * 100}ms` : `${(i * 541) % 5200}ms`);

function LoopTile({ name, i = 0 }: { name: LoopName; i?: number }) {
  return (
    <div className="mf-tile">
      <span className="mf-glyph">
        {name === "pulse" && <span className="mf-ring ts-loop ts-loop-pulse" style={{ ["--ts-loop-delay" as string]: delay(i) }} />}
        <span
          className={`mf-icon ts-loop ts-loop-${name === "pulse" ? "breathe" : name}`}
          style={{ ["--ts-loop-origin" as string]: ORIGIN[name] ?? "50% 50%", ["--ts-loop-delay" as string]: delay(i) }}
        >
          <Icon name={DEMO_ICON[name]} size={20} />
        </span>
      </span>
      <span className="mf-name">{LOOP_MN[name]}</span>
    </div>
  );
}

type Fps = { avg: number; worst: number; janky: number; frames: number };

/** rAF frame meter over a rolling 2 s window; also exposed as window.__tsFps. */
function useFps(active: boolean) {
  const [fps, setFps] = React.useState<Fps | null>(null);
  React.useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    let deltas: number[] = [];
    let shown = last;
    const tick = (now: number) => {
      deltas.push(now - last);
      last = now;
      if (now - shown > 1000) {
        shown = now;
        deltas = deltas.slice(-240);
        const total = deltas.reduce((a, b) => a + b, 0);
        const r: Fps = {
          avg: Math.round((deltas.length / total) * 1000 * 10) / 10,
          worst: Math.round(Math.max(...deltas) * 10) / 10,
          janky: deltas.filter((d) => d > 25).length,
          frames: deltas.length,
        };
        (window as unknown as { __tsFps?: Fps }).__tsFps = r;
        setFps(r);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return fps;
}

function PageControls({ stress, setStress }: { stress: boolean; setStress: (s: boolean) => void }) {
  const motion = useMotion();
  const reduced = usePrefersReducedMotion();
  const fps = useFps(stress);
  return (
    <div className="mf-bar">
      <button type="button" className="mf-btn" aria-pressed={motion.paused} onClick={() => motion.setPaused(!motion.paused)}>
        {motion.paused ? "▶ Бүх хөдөлгөөнийг үргэлжлүүлэх" : "⏸ Бүх хөдөлгөөнийг зогсоох"}
      </button>
      <button type="button" className="mf-btn" aria-pressed={stress} onClick={() => setStress(!stress)}>
        {stress ? "Стресс тест: 96 давталт ✓" : "Стресс тест: 96 давталт"}
      </button>
      {reduced && <span className="mf-note">Хөдөлгөөн багасгах тохиргоо асаалттай: эцсийн төлөв</span>}
      {stress && fps && (
        <output className="mf-fps" aria-live="off">
          {fps.avg} кадр/с · хамгийн урт кадр {fps.worst} ms · 25 ms-ээс урт {fps.janky}/{fps.frames}
        </output>
      )}
    </div>
  );
}

export default function Preview() {
  const [stress, setStress] = React.useState(false);
  return (
    <MotionProvider>
      <MotionStyles />
      <style>{CSS}</style>
      <div className="mf">
        <PageControls stress={stress} setStress={setStress} />
        <section className="mf-section">
          <h3>Пүрш</h3>
          <div className="mf-curves">
            {(Object.keys(SPRINGS) as SpringName[]).map((n) => (
              <Curve key={n} name={n} />
            ))}
          </div>
        </section>
        <LoopRegion as="section" className="mf-section" controls="always">
          <h3>Давталт</h3>
          <div className="mf-grid">
            {LOOPS.map((n) => (
              <div key={n} className="mf-cell" title={LOOP_NOTES[n]}>
                <LoopTile name={n} i={LOOPS.indexOf(n)} />
                <p>{LOOP_NOTES[n]}</p>
              </div>
            ))}
          </div>
        </LoopRegion>
        <LoopRegion as="section" className="mf-section" controls="always">
          <h3>Нэг удаа (орох) · ↺</h3>
          <div className="mf-enter">
            {["Шийдвэр", "Төсөл", "Даалгавар", "Атом"].map((t, i) => (
              <div key={t} className="mf-card ts-enter" style={{ ["--ts-enter-delay" as string]: `${i * 70}ms` }}>
                {t}
              </div>
            ))}
          </div>
        </LoopRegion>
        {stress && (
          <LoopRegion as="section" className="mf-section" controls="always">
            <h3>96 давталт зэрэг</h3>
            <div className="mf-stress">
              {Array.from({ length: 96 }, (_, i) => (
                <LoopTile key={i} name={LOOPS[i % LOOPS.length]} i={i + LOOPS.length} />
              ))}
            </div>
          </LoopRegion>
        )}
      </div>
    </MotionProvider>
  );
}

const CSS = `
.mf { --mf-fg: var(--ts-fg, #080808); --mf-muted: var(--ts-muted, #5e5a52); --mf-faint: var(--ts-faint, #8f8a80); --mf-line: var(--ts-line, #d8d3c6); --mf-surface: var(--ts-surface, #f7f5ee); --mf-soft: var(--ts-soft, #efebe1); --mf-accent: var(--ts-accent, #3a4e8c); --mf-ink: var(--ts-ink, #262522); }
:where(.dark, [data-theme=dark]) .mf { --mf-fg: var(--ts-fg, #ececef); --mf-muted: var(--ts-muted, #a1a1aa); --mf-faint: var(--ts-faint, #9a9aa2); --mf-line: var(--ts-line, #2b2b30); --mf-surface: var(--ts-surface, #141416); --mf-soft: var(--ts-soft, #1e1e21); --mf-accent: var(--ts-accent, #9fb0e6); --mf-ink: var(--ts-ink, #2a2926); }
.mf { width: 100%; display: flex; flex-direction: column; gap: 16px; font-family: var(--ts-font, Inter, system-ui, sans-serif); color: var(--mf-fg); }
.mf h3 { margin: 0 0 10px; font: 600 13px/1.3 var(--ts-font, Inter, system-ui, sans-serif); color: var(--mf-muted); letter-spacing: .02em; }
.mf-section { padding: 14px; border: 1px solid var(--mf-line); border-radius: 14px; background: var(--mf-surface); }
.mf-bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.mf-btn { font: 500 12px/1 var(--ts-font, Inter, sans-serif); padding: 8px 12px; border-radius: 999px; border: 1px solid var(--mf-line); background: var(--mf-surface); color: var(--mf-fg); cursor: pointer; }
.mf-btn[aria-pressed="true"] { background: var(--mf-ink); color: #f7f5ee; border-color: transparent; }
.mf-note, .mf-fps { font: 500 12px/1.3 var(--ts-font-mono, ui-monospace, monospace); color: var(--mf-muted); }
.mf-curves { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.mf-curve { margin: 0; color: var(--mf-accent); }
.mf-curve svg { display: block; width: 100%; height: auto; background: var(--mf-soft); border-radius: 10px; }
.mf-rest { stroke: var(--mf-line); stroke-dasharray: 3 3; }
.mf-curve figcaption { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; font: 500 11px/1.3 var(--ts-font-mono, ui-monospace, monospace); color: var(--mf-muted); }
.mf-curve b { color: var(--mf-fg); font-weight: 600; }
.mf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap: 10px; }
.mf-cell { display: flex; gap: 10px; align-items: center; padding: 8px; border-radius: 10px; background: var(--mf-soft); }
.mf-cell p { margin: 0; font-size: 12px; line-height: 1.35; color: var(--mf-muted); }
.mf-tile { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: none; }
.mf-glyph { position: relative; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; background: var(--mf-surface); color: var(--mf-fg); }
.mf-icon { display: grid; place-items: center; will-change: transform; }
.mf-ring { position: absolute; inset: 6px; border-radius: 999px; border: 1.5px solid var(--mf-accent); }
.mf-name { font: 500 10px/1 var(--ts-font-mono, ui-monospace, monospace); color: var(--mf-faint); }
.mf-enter { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
.mf-card { padding: 16px 12px; border-radius: 12px; background: var(--mf-ink); color: #f7f5ee; font-size: 13px; font-weight: 500; }
.mf-stress { display: grid; grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); gap: 6px; }
`;
