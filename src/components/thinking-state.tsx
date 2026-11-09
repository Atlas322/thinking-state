"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './thinking-state.css';

export interface ThinkingSource {
  label: string;
  href?: string;
  tooltip?: string;
  icon?: ReactNode;
}

export interface ThinkingStep {
  kind: 'search' | 'step';
  label: string;
  /** Optional label after this step has finished. */
  completedLabel?: string;
  sources?: ThinkingSource[];
  moreSources?: ThinkingSource[];
}

export interface ThinkingStateProps {
  steps: ThinkingStep[];
  doneLabel?: string;
  stepMs?: number;
  loop?: boolean;
  collapseOnDone?: boolean;
  onDone?: (seconds: number) => void;
  className?: string;
  variant?: 'clean' | 'classic';
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 1 9-9M3.5 8h17M3 13h9M12 3c-4 4-4 12 0 18M12 3c2 2 3 4 3 7" /><circle cx="17" cy="17" r="4" /><path d="m20 20 3 3" /></svg>;
}

function CheckIcon() {
  return <svg className="thinking-check" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="m4.8 8.1 2.1 2.1 4.3-4.3" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Chevron() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4.5 6.25 3.5 3.5 3.5-3.5" /></svg>;
}

function SourceChip({ source, index }: { source: ThinkingSource; index: number }) {
  const tooltipId = useId();
  const tip = source.tooltip ?? source.href?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const content = <>
    {source.icon && <span className="thinking-source-icon" aria-hidden="true">{source.icon}</span>}
    <span className="thinking-source-label" dir="auto">{source.label}</span>
    {tip && <span id={tooltipId} role="tooltip" className="thinking-tooltip">{tip}</span>}
  </>;
  const props = {
    className: 'thinking-source',
    'aria-label': source.label,
    style: { '--chip-delay': `${120 + index * 160}ms` } as CSSProperties,
    'aria-describedby': tip ? tooltipId : undefined,
  };
  return source.href
    ? <a {...props} href={source.href} target="_blank" rel="noopener noreferrer">{content}</a>
    : <span {...props} tabIndex={tip ? 0 : undefined}>{content}</span>;
}

function Sources({ step }: { step: ThinkingStep }) {
  const [expanded, setExpanded] = useState(false);
  const extraId = useId();
  const sources = step.sources ?? [];
  const extra = step.moreSources ?? [];
  if (!sources.length && !extra.length) return null;
  return <div className="thinking-sources">
    {sources.map((source, i) => <SourceChip key={`${source.label}-${i}`} source={source} index={i} />)}
    {extra.length > 0 && <>
      <span id={extraId} className="thinking-extra-sources" hidden={!expanded}>
        {expanded && extra.map((source, i) => <SourceChip key={`${source.label}-${i}`} source={source} index={i} />)}
      </span>
      <button type="button" className="thinking-source thinking-more" aria-expanded={expanded} aria-controls={extraId}
        style={{ '--chip-delay': `${120 + sources.length * 160}ms` } as CSSProperties}
        onClick={() => setExpanded(value => !value)}>
        {expanded ? 'Show less' : `+${extra.length} more`}
      </button>
    </>}
  </div>;
}

/** A timed, presentational thinking timeline. Remount with a new key to replay. */
export function ThinkingState({ steps, doneLabel = 'Finished thinking', stepMs = 1300, loop = false,
  collapseOnDone = false, onDone, className = '', variant = 'clean' }: ThinkingStateProps) {
  const [progress, setProgress] = useState({ visible: Math.min(1, steps.length), seconds: 0, done: steps.length === 0, cycle: 0 });
  const [expanded, setExpanded] = useState(true);
  const bodyId = useId();
  const doneCallback = useRef(onDone);
  const autoCollapse = useRef(collapseOnDone);
  useEffect(() => { doneCallback.current = onDone; autoCollapse.current = collapseOnDone; }, [onDone, collapseOnDone]);
  const duration = Number.isFinite(stepMs) ? Math.max(1, stepMs) : 1300;
  // The clock depends on the length, not array identity, so inline data and callback updates don't restart it.
  useEffect(() => {
    let started = performance.now();
    let completedAt: number | null = null;
    let cycle = 0;
    let lastVisible = -1;
    let lastSeconds = -1;
    const tick = () => {
      const now = performance.now();
      if (completedAt !== null) {
        if (!loop || steps.length === 0 || now - completedAt < 2600) return;
        cycle += 1;
        started = now;
        completedAt = null;
        lastVisible = -1;
        lastSeconds = -1;
        setExpanded(true);
      }
      const elapsed = now - started;
      const seconds = Math.floor(elapsed / 1000);
      const visible = Math.min(steps.length, Math.floor(elapsed / duration) + 1);
      const done = elapsed >= steps.length * duration;
      if (visible !== lastVisible || seconds !== lastSeconds || done) {
        setProgress({ visible, seconds, done, cycle });
        lastVisible = visible;
        lastSeconds = seconds;
      }
      if (done) {
        completedAt = now;
        if (!loop || steps.length === 0) window.clearInterval(timer);
        if (autoCollapse.current) setExpanded(false);
        doneCallback.current?.(seconds);
      }
    };
    const timer = window.setInterval(tick, 50);
    // Deferring the initial tick keeps StrictMode's effect replay from duplicating
    // completion callbacks for an empty timeline.
    const initialTick = window.setTimeout(tick, 0);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, [steps.length, duration, loop]);

  return <div className={`thinking-state ${className}`.trim()} data-variant={variant} data-done={progress.done}>
    <button type="button" className="thinking-header" aria-expanded={expanded} aria-controls={bodyId}
      onClick={() => setExpanded(value => !value)}>
      <span className="thinking-mark" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ animationDelay: `${(Math.floor(i / 3) + i % 3) * 120}ms` }} />)}
      </span>
      <span className="thinking-heading">
        {progress.done ? `Worked for ${progress.seconds}s` : <><span className="thinking-shimmer">Thinking</span>{' '}<span className="thinking-time">{progress.seconds}s</span></>}
      </span>
      <span className="thinking-chevron" aria-hidden="true"><Chevron /></span>
    </button>
    <div id={bodyId} className="thinking-body" data-open={expanded} inert={!expanded} aria-hidden={!expanded}>
      <div className="thinking-clip">
        <ol className="thinking-list" aria-live="polite" aria-relevant="additions text" key={progress.cycle}>
          {steps.slice(0, progress.visible).map((step, i) => {
            const active = !progress.done && i === progress.visible - 1;
            const label = !active ? (step.completedLabel ?? (step.kind === 'search' && step.label === 'Searching' ? 'Searched' : step.label)) : step.label;
            return <li key={i} className="thinking-item" data-active={active} data-kind={step.kind}>
              <span className="thinking-node" aria-hidden="true">{step.kind === 'search' ? <SearchIcon /> : <span className="thinking-dot" />}</span>
              <div className="thinking-content">
                <span className={`thinking-label${active ? ' thinking-shimmer' : ''}`} dir="auto">{label}</span>
                <Sources step={step} />
              </div>
            </li>;
          })}
          {progress.done && <li className="thinking-item thinking-finished">
            <span className="thinking-node" aria-hidden="true"><CheckIcon /></span>
            <span>{doneLabel}</span>
          </li>}
        </ol>
      </div>
    </div>
  </div>;
}
