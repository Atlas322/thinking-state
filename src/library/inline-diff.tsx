"use client";

import * as React from "react";

/** Independent implementation. No affectUI Pro source is included. */

export type DiffSegment =
  | { type: "equal"; text: string }
  | { type: "change"; remove: string; insert: string };

export type InlineDiffHandle = {
  highlight: (index: number | null) => void;
  accept: (index: number) => void;
  reject: (index: number) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  undo: () => void;
  reset: () => void;
};

export type InlineDiffProps = {
  original?: string;
  suggested?: string;
  changes?: DiffSegment[];
  onChange?: (text: string) => void;
  onDone?: (text: string) => void;
  label?: string;
  className?: string;
};

type Decision = "pending" | "accepted" | "rejected";

const demoChanges: DiffSegment[] = [
  { type: "equal", text: "Hi everyone, " },
  { type: "change", remove: "we are very excited to announce that ", insert: "" },
  { type: "equal", text: "the new dashboard is now " },
  { type: "change", remove: "available", insert: "live" },
  { type: "equal", text: " for all users. It loads " },
  { type: "change", remove: "a lot faster than before", insert: "twice as fast" },
  { type: "equal", text: ", and you can now export any report to CSV " },
  { type: "change", remove: "with just a single", insert: "in one" },
  { type: "equal", text: " click. Let us know what you think!" },
];

/** Word-level diff (LCS over words and spaces), grouped into change segments. */
export function diffWords(a: string, b: string): DiffSegment[] {
  const x = a.split(/(\s+)/).filter(Boolean);
  const y = b.split(/(\s+)/).filter(Boolean);
  const n = x.length, m = y.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = x[i] === y[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffSegment[] = [];
  const push = (seg: DiffSegment) => {
    const last = out.at(-1);
    if (seg.type === "equal" && last?.type === "equal") last.text += seg.text;
    else if (seg.type === "change" && last?.type === "change") {
      last.remove += seg.remove;
      last.insert += seg.insert;
    } else out.push(seg);
  };
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && x[i] === y[j]) push({ type: "equal", text: x[i++] }), j++;
    else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) push({ type: "change", remove: "", insert: y[j++] });
    else push({ type: "change", remove: x[i++], insert: "" });
  }
  // A lone space between two edits reads better as part of the edit.
  return out;
}

export function InlineDiff({
  original,
  suggested,
  changes,
  onChange,
  onDone,
  label = "Suggested by AI · Make it shorter",
  className = "",
  ref,
}: InlineDiffProps & { ref?: React.Ref<InlineDiffHandle> }) {
  const segments = React.useMemo(
    () => changes ?? (original != null || suggested != null ? diffWords(original ?? "", suggested ?? "") : demoChanges),
    [changes, original, suggested],
  );
  const changeIdx = React.useMemo(
    () => segments.map((s, i) => (s.type === "change" ? i : -1)).filter((i) => i >= 0),
    [segments],
  );
  const total = changeIdx.length;
  const [decisions, setDecisions] = React.useState<Decision[]>(() => changeIdx.map(() => "pending"));
  const [history, setHistory] = React.useState<Decision[][]>([]);
  const [focus, setFocus] = React.useState<number | null>(null);
  const [announce, setAnnounce] = React.useState("");
  const btns = React.useRef<(HTMLButtonElement | null)[]>([]);
  const undoBtn = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setDecisions(changeIdx.map(() => "pending"));
    setHistory([]);
    setFocus(null);
  }, [changeIdx]);

  const textFor = (d: Decision[]) =>
    segments
      .map((s) => {
        if (s.type === "equal") return s.text;
        const k = changeIdx.indexOf(segments.indexOf(s));
        return d[k] === "accepted" ? s.insert : s.remove;
      })
      .join("");

  const pending = decisions.filter((d) => d === "pending").length;

  const apply = (next: Decision[], message: string, moveFrom?: number) => {
    setHistory((h) => [...h, decisions]);
    setDecisions(next);
    const left = next.filter((d) => d === "pending").length;
    setAnnounce(`${message}. ${left ? `${left} left` : "All changes reviewed"}.`);
    const text = textFor(next);
    onChange?.(text);
    if (!left) {
      onDone?.(text);
      setFocus(null);
      requestAnimationFrame(() => undoBtn.current?.focus());
    } else if (moveFrom != null) {
      const order = [...next.keys()];
      const after = order.slice(moveFrom + 1).concat(order.slice(0, moveFrom + 1));
      const target = after.find((k) => next[k] === "pending");
      if (target != null) {
        setFocus(target);
        requestAnimationFrame(() => btns.current[target]?.focus());
      }
    }
  };

  const decide = (k: number, d: Decision) => {
    if (decisions[k] !== "pending") return;
    const next = decisions.map((v, i) => (i === k ? d : v));
    apply(next, `${d === "accepted" ? "Accepted" : "Rejected"} suggestion ${k + 1}`, k);
  };
  const all = (d: Decision) => {
    if (!pending) return;
    apply(decisions.map((v) => (v === "pending" ? d : v)), d === "accepted" ? "Accepted all" : "Rejected all");
  };
  const undo = () => {
    const prev = history.at(-1);
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setDecisions(prev);
    setAnnounce(`Undone. ${prev.filter((d) => d === "pending").length} left.`);
    onChange?.(textFor(prev));
  };
  const step = (dir: 1 | -1) => {
    const open = decisions.map((d, i) => (d === "pending" ? i : -1)).filter((i) => i >= 0);
    if (!open.length) return;
    const cur = focus ?? (dir === 1 ? -1 : total);
    const nextK =
      dir === 1 ? open.find((i) => i > cur) ?? open[0] : [...open].reverse().find((i) => i < cur) ?? open.at(-1)!;
    const focusedChange = btns.current.includes(document.activeElement as HTMLButtonElement);
    setFocus(nextK);
    const el = btns.current[nextK];
    if (focusedChange) el?.focus();
    const r = el?.getBoundingClientRect();
    if (r && (r.top < 0 || r.bottom > window.innerHeight)) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      el?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
  };

  React.useImperativeHandle(ref, () => ({
    highlight: (index) => setFocus(index),
    accept: (index) => decide(index, "accepted"),
    reject: (index) => decide(index, "rejected"),
    acceptAll: () => all("accepted"),
    rejectAll: () => all("rejected"),
    undo,
    reset: () => {
      setDecisions(changeIdx.map(() => "pending"));
      setHistory([]);
      setFocus(null);
    },
  }));

  return (
    <section className={`idf-root ${className}`}>
      <style>{css}</style>
      {label && (
        <p className="idf-label">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6.5 2.5c.4 2.6 1.4 3.6 4 4-2.6.4-3.6 1.4-4 4-.4-2.6-1.4-3.6-4-4 2.6-.4 3.6-1.4 4-4Z" fill="#3d7be8" />
            <path d="M12 9.5c.2 1.2.6 1.6 1.8 1.8-1.2.2-1.6.6-1.8 1.8-.2-1.2-.6-1.6-1.8-1.8 1.2-.2 1.6-.6 1.8-1.8Z" fill="#8fb3f3" />
          </svg>
          {label}
        </p>
      )}
      <p className="idf-text">
        {segments.map((s, i) => {
          if (s.type === "equal") return <React.Fragment key={i}>{s.text}</React.Fragment>;
          const k = changeIdx.indexOf(i);
          const d = decisions[k] ?? "pending";
          const desc = s.remove && s.insert
            ? `replace “${s.remove.trim()}” with “${s.insert.trim()}”`
            : s.remove
              ? `remove “${s.remove.trim()}”`
              : `add “${s.insert.trim()}”`;
          if (d !== "pending")
            return (
              <span key={i} className={`idf-done ${d}`}>
                <del aria-hidden="true" className="idf-gone-del">{d === "accepted" ? s.remove : ""}</del>
                <span>{d === "accepted" ? s.insert : s.remove}</span>
                <ins aria-hidden="true" className="idf-gone-ins">{d === "rejected" ? s.insert : ""}</ins>
              </span>
            );
          const active = focus === k;
          return (
            <span key={i} className={`idf-change ${active ? "active" : ""}`}>
              <button
                type="button"
                ref={(el) => {
                  btns.current[k] = el;
                }}
                className="idf-hit"
                aria-label={`Suggestion ${k + 1} of ${total}: ${desc}. Press Y to accept, N to reject`}
                onFocus={() => setFocus(k)}
                onMouseEnter={() => setFocus(k)}
                onClick={() => setFocus(k)}
                onKeyDown={(e) => {
                  const key = e.key.toLowerCase();
                  if (key === "y" || key === "enter") {
                    e.preventDefault();
                    decide(k, "accepted");
                  } else if (key === "n" || key === "backspace") {
                    e.preventDefault();
                    decide(k, "rejected");
                  } else if (key === "escape") {
                    setFocus(null);
                    (e.target as HTMLElement).blur();
                  }
                }}
              >
                {s.remove && <del>{s.remove}</del>}
                {s.remove && s.insert && " "}
                {s.insert && <ins>{s.insert}</ins>}
              </button>
              {active && (
                <span className="idf-pop" role="group" aria-label={`Suggestion ${k + 1}`}>
                  <button type="button" tabIndex={-1} aria-label="Accept" onMouseDown={(e) => e.preventDefault()} onClick={() => decide(k, "accepted")}>
                    Accept <kbd>Y</kbd>
                  </button>
                  <button type="button" tabIndex={-1} aria-label="Reject" onMouseDown={(e) => e.preventDefault()} onClick={() => decide(k, "rejected")}>
                    Reject <kbd>N</kbd>
                  </button>
                </span>
              )}
            </span>
          );
        })}
      </p>
      <footer className="idf-bar">
        {pending ? (
          <div className="idf-tools" key="tools">
            <span className="idf-count">{pending}</span>
            <span className="idf-word">{pending === 1 ? "suggestion" : "suggestions"}</span>
            <button type="button" className="idf-arrow" aria-label="Previous suggestion" onClick={() => step(-1)}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" /></svg>
            </button>
            <button type="button" className="idf-arrow" aria-label="Next suggestion" onClick={() => step(1)}>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" /></svg>
            </button>
            <button type="button" className="idf-btn" onClick={() => all("rejected")}>Reject all</button>
            <button type="button" className="idf-btn primary" onClick={() => all("accepted")}>Accept all</button>
          </div>
        ) : (
          <div className="idf-tools done" key="done">
            <svg viewBox="0 0 16 16" aria-hidden="true" className="idf-check"><path d="m3.5 8.5 3 3 6-7" /></svg>
            <span className="idf-word">All changes reviewed</span>
            <button type="button" ref={undoBtn} className="idf-btn" disabled={!history.length} onClick={undo}>
              Undo
            </button>
          </div>
        )}
      </footer>
      <p className="idf-sr" role="status" aria-live="polite">{announce}</p>
    </section>
  );
}

const css = `
.idf-root{--idf-fg:#1f1f1f;--idf-muted:#7d7d7d;--idf-card:#fff;--idf-line:#ececec;--idf-soft:#f3f3f3;--idf-del:#c4555a;--idf-del-bg:#e5484d12;--idf-ins:#18794e;--idf-ins-bg:#30a46c1c;--idf-blue:#3d7be8;width:100%;max-width:520px;margin:0 auto;background:var(--idf-card);font-size:14.5px;border:1px solid var(--idf-line);border-radius:12px;color:var(--idf-fg);font:400 15px/1.67 Inter,ui-sans-serif,system-ui,sans-serif;text-align:left;box-shadow:0 1px 2px #00000008;position:relative}
:where(.dark,[data-theme=dark]) .idf-root{--idf-fg:#ededed;--idf-muted:#8f8f94;--idf-card:#1b1b1e;--idf-line:#2c2c31;--idf-soft:#26262a;--idf-del:#ff6b70;--idf-del-bg:#ff6b7020;--idf-ins:#4cc38a;--idf-ins-bg:#4cc38a22;color-scheme:dark}
.idf-root *{box-sizing:border-box}
.idf-root :where(button){font:inherit;color:inherit;cursor:pointer}
.idf-label{display:flex;align-items:center;gap:8px;margin:0;padding:16px 20px 0;font-size:13px;color:color-mix(in srgb,var(--idf-fg) 75%,transparent)}
.idf-label svg{width:14px;height:14px}
.idf-text{margin:0;padding:6px 18px 16px 18px;font-size:15px;line-height:25px}
.idf-change{position:relative}
.idf-hit{display:inline;border:0;background:none;padding:0;margin:0;text-align:inherit;font:inherit!important;border-radius:3px}
.idf-hit:focus-visible{outline:2px solid var(--idf-blue);outline-offset:2px}
.idf-text del{color:var(--idf-del);background:var(--idf-del-bg);text-decoration:line-through;text-decoration-color:color-mix(in srgb,var(--idf-del) 60%,transparent);padding:1px 2px;border-radius:3px;box-decoration-break:clone;-webkit-box-decoration-break:clone;opacity:.75}
.idf-text ins{color:var(--idf-fg);background:var(--idf-ins-bg);text-decoration:none;padding:1px 2px;border-radius:3px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.idf-change.active del{background:color-mix(in srgb,var(--idf-del) 20%,transparent)}
.idf-change.active ins{background:color-mix(in srgb,var(--idf-ins) 26%,transparent)}
.idf-pop{position:absolute;left:0;bottom:calc(100% + 4px);display:flex;gap:2px;padding:3px;background:var(--idf-card);border:1px solid var(--idf-line);border-radius:8px;box-shadow:0 6px 20px #0000001c;z-index:4;white-space:nowrap;animation:idf-up .14s ease-out}
.idf-pop button{display:flex;align-items:center;gap:6px;border:0;background:none;border-radius:5px;padding:2px 8px;font-size:12px!important;line-height:20px}
.idf-pop button:hover{background:var(--idf-soft)}
.idf-pop kbd{font:inherit;font-size:10px;color:var(--idf-muted);border:1px solid var(--idf-line);border-radius:4px;padding:0 4px;line-height:15px}
.idf-done>span{animation:idf-fade .3s ease-out}
.idf-gone-del,.idf-gone-ins{display:none}
.idf-bar{border-top:1px solid var(--idf-line);padding:8px 8px 8px 18px}
.idf-tools{display:flex;align-items:center;gap:6px;min-height:32px;animation:idf-fade .25s ease-out}
.idf-count{display:inline-grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:5px;background:var(--idf-soft);font-size:13px;font-variant-numeric:tabular-nums}
.idf-word{font-size:15px;color:color-mix(in srgb,var(--idf-fg) 80%,transparent);margin-left:4px;margin-right:auto}
.idf-arrow{width:30px;height:30px;display:grid;place-items:center;border:0;background:none;border-radius:6px;color:var(--idf-muted)!important}
.idf-arrow:hover{background:var(--idf-soft);color:var(--idf-fg)!important}
.idf-arrow svg,.idf-check{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.idf-check{color:var(--idf-ins);stroke-dasharray:16;animation:idf-draw .4s ease-out both}
.idf-btn{height:32px;padding:0 12px;border:1px solid var(--idf-line);background:var(--idf-card);border-radius:7px;font-size:15px!important;box-shadow:0 1px 2px #0000000a}
.idf-btn:hover{background:var(--idf-soft)}
.idf-btn.primary{background:var(--idf-fg);border-color:var(--idf-fg);color:var(--idf-card)!important}
.idf-btn.primary:hover{opacity:.88}
.idf-btn:disabled{opacity:.5;cursor:default}
.idf-root button:focus-visible{outline:2px solid var(--idf-blue);outline-offset:2px}
.idf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);margin:0}
@keyframes idf-up{from{opacity:0;transform:translateY(3px)}}
@keyframes idf-fade{from{opacity:0}}
@keyframes idf-draw{from{stroke-dashoffset:16}to{stroke-dashoffset:0}}
@media (prefers-reduced-motion:reduce){.idf-root *{animation:none!important;transition:none!important}}
@media (max-width:360px){.idf-arrow{display:none}.idf-text{padding:6px 14px 14px}}
@media (pointer:coarse){.idf-pop button{padding:6px 12px}.idf-pop kbd{display:none}}
`;

export default InlineDiff;
