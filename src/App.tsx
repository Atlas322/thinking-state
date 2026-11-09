import { useState } from 'react';
import { ThinkingState, type ThinkingStep } from './components/thinking-state';

const steps: ThinkingStep[] = [
  {
    kind: 'search',
    label: 'Searching',
    sources: [
      { label: 'Slack – #team-offsite', href: 'https://slack.com/', tooltip: 'slack.com', icon: <SlackMark /> },
      { label: 'X – @lisbonguide', href: 'https://x.com/', tooltip: 'x.com', icon: <XMark /> },
      { label: 'Notion – Offsite plan', href: 'https://notion.so/', tooltip: 'notion.so', icon: <NotionMark /> },
      { label: 'Wikipedia – Lisbon', href: 'https://en.wikipedia.org/wiki/Lisbon', tooltip: 'en.wikipedia.org/wiki/Lisbon', icon: <WikipediaMark /> },
    ],
    moreSources: [
      { label: 'Google Flights – LIS', href: 'https://www.google.com/travel/flights', tooltip: 'google.com/travel/flights' },
      { label: 'Booking.com – Lisbon', href: 'https://www.booking.com', tooltip: 'booking.com' },
      { label: 'Airbnb – Alfama', href: 'https://www.airbnb.com', tooltip: 'airbnb.com' },
    ],
  },
  { kind: 'step', label: 'Reading 7 sources about the trip' },
  { kind: 'step', label: 'Comparing flights and hotels' },
  { kind: 'step', label: 'Checking dates against the team calendar' },
  { kind: 'step', label: 'Drafting the offsite agenda' },
];

export default function App() {
  const [dark, setDark] = useState(false);
  const [run, setRun] = useState(0);
  const [loop, setLoop] = useState(false);
  const [variant, setVariant] = useState<'clean' | 'classic'>('clean');

  return (
    <div className="demo" data-theme={dark ? 'dark' : 'light'}>
      <main className="demo-main">
        <header className="demo-heading">
          <div>
            <p className="demo-eyebrow">COMPONENT PREVIEW</p>
            <h1>Thinking State</h1>
            <p className="demo-description">A little clarity while your assistant works.</p>
          </div>
          <button className="demo-icon-button" type="button" onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        <section className="demo-preview" aria-label="Thinking state preview">
          <div className="demo-toolbar">
            <div className="demo-variants" role="group" aria-label="Component style">
              <button type="button" aria-pressed={variant === 'clean'} onClick={() => setVariant('clean')}>Clean</button>
              <button type="button" aria-pressed={variant === 'classic'} onClick={() => setVariant('classic')}>Classic</button>
            </div>
            <div className="demo-actions">
              <label className="demo-loop"><input type="checkbox" checked={loop} onChange={(event) => { setLoop(event.target.checked); setRun((value) => value + 1); }} />Loop</label>
              <button type="button" className="demo-replay" onClick={() => setRun((value) => value + 1)}><ReplayIcon />Replay</button>
            </div>
          </div>
          <div className="demo-stage">
            <ThinkingState key={run} steps={steps} loop={loop} stepMs={1500} variant={variant} />
          </div>
        </section>
        <p className="demo-note">Click the heading to collapse. Explore the sources as each step appears.</p>
      </main>
      <footer className="demo-footer">React component · Inspired by <a href="https://www.affectui.com/components/thinking-state" target="_blank" rel="noreferrer">affectUI</a></footer>
    </div>
  );
}

function ReplayIcon() {
  return <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></svg>;
}

function SlackMark() {
  return <svg aria-hidden="true" viewBox="0 0 16 16"><rect x="1" y="5" width="7" height="3" rx="1.5" fill="#36c5f0" /><circle cx="6.5" cy="2.5" r="1.5" fill="#36c5f0" /><rect x="8" y="1" width="3" height="7" rx="1.5" fill="#2eb67d" /><circle cx="13.5" cy="6.5" r="1.5" fill="#2eb67d" /><rect x="8" y="8" width="7" height="3" rx="1.5" fill="#ecb22e" /><circle cx="9.5" cy="13.5" r="1.5" fill="#ecb22e" /><rect x="5" y="8" width="3" height="7" rx="1.5" fill="#e01e5a" /><circle cx="2.5" cy="9.5" r="1.5" fill="#e01e5a" /></svg>;
}
function XMark() {
  return <svg aria-hidden="true" viewBox="0 0 16 16"><rect width="16" height="16" rx="3" fill="#111" /><path d="m4 3 8 10h-2L2 3h2Zm0 10L12 3" transform="translate(1 0)" fill="none" stroke="white" strokeWidth="1" /></svg>;
}
function NotionMark() {
  return <svg aria-hidden="true" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" rx="1.5" fill="white" stroke="#111" strokeWidth="1.2" /><path d="M4 12V4h1.5l5 8H12V4M3 4h4m2 0h4M3 12h4" fill="none" stroke="#111" strokeWidth="1.2" /></svg>;
}
function WikipediaMark() {
  return <svg aria-hidden="true" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="white" /><path d="m2 4 3.5 8L8 6l2.5 6L14 4M1 4h4m1 0h4m2 0h3" fill="none" stroke="#111" strokeWidth="1" /></svg>;
}
function MoonIcon() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 13a8.7 8.7 0 0 1-9.5-9.5A8.8 8.8 0 1 0 20.5 13Z" /></svg>;
}
function SunIcon() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="3.8" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
}
