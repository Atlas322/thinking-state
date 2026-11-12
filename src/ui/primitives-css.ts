/** Primitive styles (no imports: scripts/ts-css.mjs bundles this for ts.css). */

const SEL = "var(--ts-selected,#0c8ce9)";
const ON = "var(--ts-on-selected,#fff)";
const ON_SOFT = "var(--ts-on-selected-soft,rgb(255 255 255 / .2))";
const ACC = "var(--ts-accent,#1b5cff)";

export const PRIMITIVES_CSS = `
.ts-btn,.ts-cta,.ts-pill,.ts-tab{-webkit-tap-highlight-color:transparent;font-family:var(--ts-font,Inter,system-ui,sans-serif)}
.ts-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;box-sizing:border-box;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);font-weight:500;line-height:1;text-decoration:none;cursor:pointer;white-space:nowrap;transition:background var(--ts-motion-dur-xs,120ms),border-color var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-btn.is-sm{height:30px;padding:0 12px;font-size:13px}
.ts-btn.is-md{height:38px;padding:0 16px;font-size:14px}
.ts-btn.is-lg{height:48px;padding:0 22px;font-size:15px}
.ts-btn.is-block{display:flex;width:100%}
.ts-btn.is-primary{background:${ACC};color:#fff}
.ts-btn.is-primary:hover{background:color-mix(in srgb,${ACC} 88%,#000)}
.ts-btn.is-secondary{background:var(--ts-surface,#f7f5ee);border-color:var(--ts-line,#d8d3c6);color:var(--ts-fg,#080808)}
.ts-btn.is-secondary:hover{background:var(--ts-soft,#efebe1)}
.ts-btn.is-ghost{background:transparent;color:var(--ts-fg,#080808)}
.ts-btn.is-ghost:hover{background:var(--ts-soft,#efebe1)}
.ts-btn:active{transform:scale(.97)}
.ts-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.ts-btn:focus-visible,.ts-cta:focus-visible,.ts-pill:focus-visible,.ts-tab:focus-visible,.ts-card.is-interactive:focus-visible{outline:2px solid ${SEL};outline-offset:2px}

.ts-cta{display:inline-flex;align-items:stretch;height:48px;padding:0;border:0;border-radius:var(--ts-radius-block,0);background:none;font-size:15px;font-weight:500;text-decoration:none;cursor:pointer}
.ts-cta-label{display:inline-flex;align-items:center;padding:0 20px;background:var(--ts-electric,${ACC});color:#fff}
.ts-cta-arrow{display:inline-grid;place-items:center;width:48px;background:var(--ts-cta-arrow,#1550e0);color:#fff;transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-cta:hover .ts-cta-arrow svg{transform:translate(2px,-2px)}
.ts-cta-arrow svg{transition:transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-cta.is-ghost .ts-cta-label,.ts-cta.is-ghost .ts-cta-arrow{background:transparent;color:var(--ts-fg,#080808);border:1px solid var(--ts-line,#d8d3c6)}
.ts-cta.is-ghost .ts-cta-arrow{border-left:0}

.ts-pill{display:inline-flex;align-items:center;gap:6px;box-sizing:border-box;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-pill,999px);background:var(--ts-surface,#f7f5ee);color:var(--ts-fg,#080808);font-weight:500;white-space:nowrap;line-height:1}
.ts-pill.is-sm{height:24px;padding:0 9px;font-size:12px}
.ts-pill.is-md{height:30px;padding:0 12px;font-size:13px}
.ts-pill.is-interactive{cursor:pointer}
.ts-pill.is-interactive:hover:not(.is-selected){background:var(--ts-soft,#efebe1)}
.ts-pill.is-selected,.ts-tab.is-selected{border-color:transparent;background:${SEL};color:${ON}}
.ts-pill-n{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;box-sizing:border-box;border-radius:9px;background:var(--ts-soft,#efebe1);color:var(--ts-muted,#5e5a52);font-size:11px;font-variant-numeric:tabular-nums}
.is-selected>.ts-pill-n{background:${ON_SOFT};color:${ON}}

.ts-tabs{display:flex;gap:2px;max-width:100%;overflow-x:auto;scrollbar-width:none}
.ts-tabs.is-segmented{display:inline-flex;padding:3px;border-radius:calc(var(--ts-radius-control,8px) + 2px);background:var(--ts-soft,#efebe1)}
.ts-tabs.is-tabs{border-bottom:1px solid var(--ts-line,#d8d3c6);padding-bottom:4px}
.ts-tab{display:inline-flex;align-items:center;gap:6px;flex:none;box-sizing:border-box;border:1px solid transparent;border-radius:var(--ts-radius-control,8px);background:none;color:var(--ts-muted,#5e5a52);font-weight:500;white-space:nowrap;cursor:pointer;transition:background var(--ts-motion-dur-xs,120ms),color var(--ts-motion-dur-xs,120ms)}
.ts-tabs.is-md .ts-tab{height:32px;padding:0 12px;font-size:13.5px}
.ts-tabs.is-sm .ts-tab{height:26px;padding:0 9px;font-size:12.5px}
.ts-tab:hover:not(.is-selected):not(:disabled){color:var(--ts-fg,#080808);background:var(--ts-soft,#efebe1)}
.ts-tabs.is-segmented .ts-tab:hover:not(.is-selected):not(:disabled){background:var(--ts-surface,#f7f5ee)}
.ts-tab:disabled{opacity:.4;cursor:not-allowed}

.ts-badge{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;box-sizing:border-box;border-radius:6px;font-size:12px;font-weight:500;line-height:1;white-space:nowrap;background:var(--ts-soft,#efebe1);color:var(--ts-muted,#5e5a52)}
.ts-badge.is-blue{background:var(--ts-accent-soft,#e3e9fb);color:var(--ts-accent-fg,${ACC})}
.ts-badge.is-green{background:var(--ts-green-soft,#e3eadf);color:var(--ts-green,#5e7a5f)}
.ts-badge.is-amber{background:var(--ts-amber-soft,#f2e3cc);color:var(--ts-amber,#a85a12)}
.ts-badge.is-red{background:var(--ts-red-soft,#f4dad6);color:var(--ts-red,#c2362f)}
.ts-badge.is-violet{background:var(--ts-violet-soft,#e5ddf3);color:var(--ts-violet,#6b47c9)}
${[1, 2, 3, 4].map((i) => `.ts-badge.is-cat-${i}{background:var(--ts-cat-${i}-bg,var(--ts-soft,#efebe1));color:color-mix(in srgb,var(--ts-cat-${i},#888) 62%,var(--ts-fg,#080808))}`).join("\n")}

.ts-card{display:block;box-sizing:border-box;border:1px solid var(--ts-line,#d8d3c6);border-radius:var(--ts-radius-card,12px);background:var(--ts-surface,#f7f5ee);color:var(--ts-fg,#080808);box-shadow:var(--ts-elevation,none);text-decoration:none;min-width:0}
.ts-card.is-pad-sm{padding:12px}
.ts-card.is-pad-md{padding:16px}
.ts-card.is-pad-lg{padding:24px}
.ts-card.is-block{border-radius:var(--ts-radius-block,0)}
.ts-card.is-interactive{cursor:pointer;transition:border-color var(--ts-motion-dur-xs,120ms),transform var(--ts-motion-dur-sm,200ms) var(--ts-motion-spring-soft,ease-out)}
.ts-card.is-interactive:hover{border-color:color-mix(in srgb,var(--ts-fg,#080808) 25%,var(--ts-line,#d8d3c6));transform:translateY(-1px)}
.ts-card.is-selected{border-color:${SEL};box-shadow:0 0 0 1px ${SEL}}

.ts-text{margin:0;color:var(--ts-fg,#080808)}
.ts-text:is(.is-display,.is-h1,.is-h2,.is-h3){font-family:var(--ts-font-head,var(--ts-font-display,Inter,system-ui,sans-serif));font-weight:var(--ts-head-weight,600);letter-spacing:var(--ts-head-tracking,-.02em);text-wrap:balance}
.ts-text.is-display{font-size:clamp(36px,6vw,var(--ts-type-display,59px));line-height:1.05}
.ts-text.is-h1{font-size:clamp(28px,4.5vw,var(--ts-type-h1,36px));line-height:1.1}
.ts-text.is-h2{font-size:clamp(24px,4vw,var(--ts-type-h2,33px));line-height:1.15}
.ts-text.is-h3{font-size:var(--ts-type-h3,20px);line-height:1.25}
.ts-text:is(.is-body-lg,.is-body,.is-small){font-family:var(--ts-font,Inter,system-ui,sans-serif);text-wrap:pretty}
.ts-text.is-body-lg{font-size:18px;line-height:1.55}
.ts-text.is-body{font-size:15px;line-height:1.55}
.ts-text.is-small{font-size:13px;line-height:1.45}
.ts-text:is(.is-label,.is-mono,.is-caption){font-family:var(--ts-font-mono,"IBM Plex Mono",ui-monospace,monospace)}
.ts-text.is-label{font-size:12px;line-height:1.3;letter-spacing:.05em;text-transform:uppercase;color:var(--ts-muted,#5e5a52)}
.ts-text.is-mono{font-size:13px;line-height:1.4}
.ts-text.is-caption{font-size:11px;line-height:1.3;color:var(--ts-faint,#8f8a80)}
.ts-text.is-muted{color:var(--ts-muted,#5e5a52)}
.ts-text.is-faint{color:var(--ts-faint,#8f8a80)}
.ts-text.is-accent{color:var(--ts-accent-fg,${ACC})}

@media (prefers-reduced-motion:reduce){.ts-btn,.ts-card,.ts-cta-arrow,.ts-cta-arrow svg,.ts-tab{transition:none}.ts-btn:active{transform:none}}
`;

