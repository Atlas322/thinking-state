// In-page layout audit for one rendered catalog component.
// Paste into the browser (or run via Playwright page.evaluate) with the component on screen.
// Returns { wraps, overflow, scale, rows, align } — each a list of problems.
// Used by hand during catalog QA; scripts/check-layout.mjs runs the static half in CI.
(function audit(root = document.querySelector(".preview-container") || document.querySelector(".preview-stage") || document.body) {
  const out = { wraps: [], overflow: [], scale: [], rows: [], align: [] };
  const name = (el) =>
    (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase()) +
    " «" + (el.textContent || "").trim().slice(0, 28) + "»";
  const lineHeight = (cs) => (cs.lineHeight === "normal" ? parseFloat(cs.fontSize) * 1.25 : parseFloat(cs.lineHeight));
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05;
  };
  const controls = [...root.querySelectorAll("button, [role=button], [role=tab], .chip, [class*=chip], [class*=pill], [class*=tag]:not(input)")].filter((el) => el.matches("button, [role=button], [role=tab]") || [...el.classList].some((c) => /(^|[-_])(chip|pill|tag|badge)$/.test(c))).filter((el) => !el.closest(".ts-replay-btn, .preview-options")).filter(visible);

  // 1. Text wrapping inside buttons / chips.
  for (const el of controls) {
    const text = (el.innerText || "").trim();
    if (!text || text.includes("\n")) continue;
    const cs = getComputedStyle(el);
    if (cs.display.startsWith("inline") && !cs.display.includes("flex") && !/flex|grid/.test(getComputedStyle(el.parentElement).display)) continue; // inline controls inside running text wrap with it
    // Count text lines from text nodes only (icons sit on their own box and would look like a second line).
    const lines = new Set();
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode()); ) {
      if (!n.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 1) lines.add(Math.round((r.top + r.height / 2) / 10));
    }
    if (lines.size > 1) out.wraps.push(name(el));
    if (el.scrollWidth > el.clientWidth + 1 && cs.overflow !== "visible" && cs.textOverflow !== "ellipsis") out.wraps.push(name(el) + " (clipped)");
  }

  // 2. Overflow: elements wider than their scroll container / the stage.
  const box = root.getBoundingClientRect();
  for (const el of root.querySelectorAll("*:not(svg *):not(.tst-sr):not(.ts-replay-btn)")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.position === "fixed") continue;
    // Intentional horizontal scrollers (tab strips, carousels) may extend past the stage.
    let scroller = false;
    for (let p = el.parentElement; p && p !== root; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") { scroller = true; break; }
    }
    if (scroller) continue;
    if (r.right > box.right + 1 || r.left < box.left - 8) {
      if (![...el.querySelectorAll("*")].some((c) => c.getBoundingClientRect().right > box.right + 1 && c !== el))
        out.overflow.push(name(el) + ` (${Math.round(r.left - box.left)}…${Math.round(r.right - box.left)} / ${Math.round(box.width)})`);
    }
  }

  // 3. Type scale: control text must not be larger than the nearest heading.
  const size = (el) => parseFloat(getComputedStyle(el).fontSize);
  const heads = [...root.querySelectorAll("h1,h2,h3,h4,strong,b,[class*=title]")].filter(visible).filter((h) => !h.closest("button") && size(h) >= 13);
  for (const el of controls) {
    const card = el.parentElement?.closest("section, article, li, [class*=card], [class*=panel], div");
    const head = heads.find((h) => card && card.contains(h));
    if (head && size(el) > size(head)) out.scale.push(`${name(el)} ${size(el)}px > ${name(head)} ${size(head)}px`);
  }

  // 4. Equal height of controls sharing a row.
  const byRow = new Map();
  for (const el of controls) {
    if (el.closest("li[role=option]")) continue;
    const parent = el.parentElement;
    const r = el.getBoundingClientRect();
    const key = parent;
    if (!byRow.has(key)) byRow.set(key, []);
    byRow.get(key).push({ el, r });
  }
  for (const [, items] of byRow) {
    const rows = new Map();
    for (const it of items) {
      const k = Math.round(it.r.top / 4) + "|" + (it.el.className || it.el.tagName) + JSON.stringify({ ...it.el.dataset });
      (rows.get(k) || rows.set(k, []).get(k)).push(it);
    }
    for (const [, row] of rows) {
      if (row.length < 2) continue;
      const hs = row.map((x) => Math.round(x.r.height));
      if (Math.max(...hs) - Math.min(...hs) > 1) out.rows.push(row.map((x) => name(x.el) + " " + Math.round(x.r.height)).join(" | "));
    }
  }

  // 5. Icon / text vertical axis inside controls.
  for (const el of controls) {
    const icon = el.querySelector(":scope > svg, :scope > i, :scope > span > svg");
    if (!icon) continue;
    // Only single-line controls have one axis; stacked cards (icon beside a title + caption) are laid out on purpose.
    const ecs = getComputedStyle(el);
    if (ecs.flexDirection === "column" || el.getBoundingClientRect().height > lineHeight(ecs) * 2.2) continue;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let t;
    while ((t = walker.nextNode()) && !t.textContent.trim());
    if (!t || t.parentElement.getBoundingClientRect().width < 4) continue; // visually-hidden label
    const range = document.createRange();
    range.selectNodeContents(t);
    if (range.getClientRects().length > 1) continue; // multi-line text: icon sits on the first line by design
    const tr = range.getClientRects()[0];
    const ir = icon.getBoundingClientRect();
    if (!tr || tr.width < 4) continue; // visually-hidden label
    const d = Math.abs(tr.top + tr.height / 2 - (ir.top + ir.height / 2));
    if (d > 1.5 && d < 20) out.align.push(`${name(el)} Δ${d.toFixed(1)}px`);
  }
  return out;
})();
