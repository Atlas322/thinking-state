/**
 * App frame (2026-11-17, screens.18): the ONE Second Brain window — the chrome of the approved
 * AskWindow v3 «lightweight» (thin bar with dots and a centred title, quiet grey side menu).
 * AskWindow and AppScreen both draw it, so the site shows one app, not two (owner: «нэг л байх
 * ёстой, animation хүртэл»). Tokens only.
 */
export const APP_FRAME_CSS = `
.aw{font-family:var(--ts-font,Inter,system-ui,sans-serif);font-size:13px;line-height:1.5;font-weight:400;background:var(--ts-surface);color:var(--ts-fg);border:1px solid color-mix(in srgb,var(--ts-line) 80%,transparent);border-radius:calc(var(--ts-radius,6px) + 4px);box-shadow:0 1px 2px rgb(8 12 40/.06),0 24px 56px -24px rgb(8 12 40/.45);overflow:hidden;container-type:inline-size;max-width:720px}
.aw *{box-sizing:border-box}
.aw-bar{display:flex;align-items:center;gap:10px;height:28px;padding:0 10px;border-bottom:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);background:var(--ts-soft)}
.aw-dots{display:flex;gap:5px}.aw-dots i{width:8px;height:8px;border-radius:50%;background:color-mix(in srgb,var(--ts-faint) 35%,transparent)}
.aw-title{flex:1;text-align:center;font-weight:500;font-size:12px;color:var(--ts-faint);margin-right:34px}
.aw-split{display:flex;height:400px}
.aw-side{width:164px;flex:none;border-right:1px solid color-mix(in srgb,var(--ts-line) 70%,transparent);background:var(--ts-soft);padding:var(--ts-space-2,8px);display:flex;flex-direction:column;gap:1px;overflow:hidden}
.aw-ws{display:flex;align-items:center;gap:var(--ts-space-2,8px);padding:2px 0 var(--ts-space-2,8px)}
.aw-ws b{width:22px;height:22px;border-radius:var(--ts-radius,6px);display:grid;place-items:center;background:var(--ts-fg);color:var(--ts-surface);font-size:11px;font-weight:600;flex:none}
.aw-ws span{display:flex;flex-direction:column;line-height:1.25;min-width:0}
.aw-ws strong{font-weight:500;font-size:13px}
.aw-ws small{font-size:11px;color:var(--ts-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aw-item{position:relative;display:flex;align-items:center;gap:6px;height:26px;padding:0 6px;border:0;border-radius:var(--ts-radius,6px);background:none;font:inherit;font-size:13px;color:var(--ts-muted);text-align:left;cursor:pointer;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aw-item svg{flex:none;color:var(--ts-faint)}
.aw-item:hover{background:color-mix(in srgb,var(--ts-fg) 6%,transparent);color:var(--ts-fg)}
.aw-item[aria-current="true"]{background:color-mix(in srgb,var(--ts-fg) 8%,transparent);color:var(--ts-fg);font-weight:500}
.aw-item[aria-current="true"] svg{color:var(--ts-electric-fg)}
.aw-item small{margin-left:auto;font-size:11px;color:var(--ts-faint)}
.aw-item[aria-current="true"] small{color:var(--ts-muted)}
.aw-item>span{overflow:hidden;text-overflow:ellipsis}
.aw-side h6{font-weight:500;font-size:11px;color:var(--ts-faint);margin:var(--ts-space-3,12px) 6px 2px}
@container (max-width:560px){.aw-side{display:none}}
`;
