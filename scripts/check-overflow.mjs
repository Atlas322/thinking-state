// Layout check for every catalog preview at phone and desktop widths
// (owner 2026-11-12). Mongolian labels run longer than the English ones they
// replaced, so this flags text that no longer fits:
//   overflow  text runs past its own box (and may cover a neighbour)
//   clipped   text is cut by an overflow:hidden/clip ancestor with no ellipsis
//             or line clamp to show that it was cut
//             or past a card, chip or panel further up that does not clip it
//   broken    a word is split across two lines mid-word
// Layout does not change with the theme, so only the light theme is scanned.
//
//   npm run dev     (another terminal; or pass --url)
//   node scripts/check-overflow.mjs [--url http://127.0.0.1:5173] [--only a,b] [--widths 390,1440] [--shell] [--selftest]
// --shell also scans the catalog chrome (sidebar, header) once per width.
import { arg, launch, openSlug, setTheme, slugs, wait } from "./cdp.mjs";

const base = arg("url", "http://127.0.0.1:5173");
const widths = arg("widths", "390,1440").split(",").map(Number);

const SCAN = (selector, exclude = "") => `(() => {
  const exclude = ${JSON.stringify(exclude)};
  const root = document.querySelector(${JSON.stringify(selector)});
  if (!root) return [];
  const TOL = 1.5, TOL_Y = 4;
  const out = new Set();
  const label = (el) => el.tagName.toLowerCase() + "." + String(el.className.baseVal ?? el.className).split(" ")[0];
  const unionOf = (rects) => {
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (const x of rects) if (x.width > 0 && x.height > 0) { l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom); }
    return r > l ? { left: l, top: t, right: r, bottom: b } : null;
  };
  // An element that shows it was cut: one-line ellipsis or a line clamp.
  const marksCut = (s) => s.textOverflow === "ellipsis" || (s.webkitLineClamp && s.webkitLineClamp !== "none");
  const hidden = (el) => {
    for (let e = el; e && e !== root.parentElement; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden" || +s.opacity === 0) return true;
      if (e.getAttribute("aria-hidden") === "true" && e.tagName !== "svg") return true;
    }
    return false;
  };
  const SKIP = /[-\\u2010-\\u2015\\/_.:@]/; // words allowed to break at punctuation
  for (const el of root.querySelectorAll("*")) {
    if (exclude && el.closest(exclude)) continue;
    // the body of a closed <details> keeps a layout box but is never painted
    const shut = el.closest("details:not([open])");
    if (shut && !el.closest("summary")) continue;
    if (el.closest("svg, pre, code, textarea, input, [contenteditable=true], .sr-only, .visually-hidden")) continue;
    const nodes = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    if (!nodes.length) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    if (hidden(el)) continue;
    const s = getComputedStyle(el);
    const text = nodes.map((n) => n.textContent.trim()).join(" ").replace(/\\s+/g, " ");
    const range = document.createRange();
    const rects = [];
    for (const n of nodes) { range.selectNodeContents(n); rects.push(...range.getClientRects()); }
    if (!/[\\p{L}\\p{N}]/u.test(text)) continue; // glyph-only spans (icons, dividers)
    const ink = unionOf(rects);
    if (!ink) continue;
    const tag = label(el) + " «" + text.slice(0, 40) + "»";
    const cutShown = marksCut(s);
    // 1. cut by an ancestor that hides overflow
    let cutByAncestor = false;
    if (!cutShown) {
      for (let a = el.parentElement; a && a !== root.parentElement; a = a.parentElement) {
        const as = getComputedStyle(a);
        if (/auto|scroll/.test(as.overflowX + as.overflowY)) break; // scrolled into view, not cut
        const clipX = /hidden|clip/.test(as.overflowX), clipY = /hidden|clip/.test(as.overflowY);
        if (!clipX && !clipY) continue;
        if (marksCut(as)) break;
        const ab = a.getBoundingClientRect();
        if (ab.width < 2 || ab.height < 2) break;
        const cut = (clipX && (ink.right - ab.right > TOL || ab.left - ink.left > TOL)) || (clipY && (ink.bottom - ab.bottom > TOL_Y || ab.top - ink.top > TOL_Y));
        // a box fully outside its clip is a slide/carousel item that is off stage, not cut text
        const outside = ink.left >= ab.right || ink.right <= ab.left || ink.top >= ab.bottom || ink.bottom <= ab.top;
        if (cut && !outside) out.add("clipped " + tag + " by " + label(a)), (cutByAncestor = true);
        break;
      }
    }
    // 2. past its own box (horizontal; vertical only when the box is a fixed height)
    const overX = ink.right - box.right > TOL || box.left - ink.left > TOL;
    // glyph ink may sit a few px outside a tight line box; that only matters where it is cut
    const overY = s.display !== "inline" && s.overflowY !== "visible" && (ink.bottom - box.bottom > TOL_Y || box.top - ink.top > TOL_Y);
    if ((overX || overY) && !cutShown && !cutByAncestor) {
      const clipsSelf = s.overflowX !== "visible" || s.overflowY !== "visible";
      const scrolls = /auto|scroll/.test(s.overflowX + s.overflowY);
      if (!scrolls) out.add((clipsSelf ? "clipped " : "overflow ") + tag + " (" + Math.round(Math.max(ink.right - box.right, box.left - ink.left, ink.bottom - box.bottom, 0)) + "px)");
    }
    // 3. past a visible box (card, chip, panel) further up, with nothing clipping it:
    //    a nowrap chip that runs out of its card, a row wider than its panel
    if (!cutShown && !cutByAncestor) {
      const painted = (cs) => {
        const bg = cs.backgroundColor;
        return (bg && bg !== "transparent" && !/rgba\\([^)]*,\\s*0\\)$/.test(bg)) || parseFloat(cs.borderLeftWidth) > 0 || parseFloat(cs.borderRightWidth) > 0 || (cs.boxShadow && cs.boxShadow !== "none");
      };
      for (let a = el; a && a !== root; a = a.parentElement) {
        const as = getComputedStyle(a);
        if (/auto|scroll/.test(as.overflowX)) break;
        if (painted(as)) {
          const ab = a.getBoundingClientRect();
          const outside = ink.left >= ab.right || ink.right <= ab.left;
          if (!outside && (ink.right - ab.right > TOL || ab.left - ink.left > TOL)) {
            if (a !== el) out.add("overflow " + tag + " out of " + label(a) + " (" + Math.round(Math.max(ink.right - ab.right, ab.left - ink.left)) + "px)");
            break;
          }
        }
        if (/absolute|fixed/.test(as.position)) break; // popovers and badges sit outside their parent on purpose
      }
    }
    // 4. words split across lines
    for (const n of nodes) {
      const re = /\\S+/g;
      let m;
      while ((m = re.exec(n.textContent))) {
        const w = m[0];
        if (w.length < 3 || SKIP.test(w)) continue;
        range.setStart(n, m.index);
        range.setEnd(n, m.index + w.length);
        const tops = new Set([...range.getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.top)));
        if (tops.size > 1) out.add("broken " + label(el) + " «" + w + "»");
      }
    }
  }
  return [...out];
})()`;

const page = await launch();

if (process.argv.includes("--selftest")) {
  // One case per kind (overflow twice: own box, and a chip out of its card), plus two that must pass (ellipsis, closed <details>).
  const html = `<div class="preview-stage" style="font:14px sans-serif">
    <div style="width:80px"><span style="display:block;white-space:nowrap">Хараахан ашиглаагүй</span></div>
    <div style="width:80px;overflow:hidden"><span style="display:block;white-space:nowrap">Тайлбаргүй тасалсан</span></div>
    <div style="width:80px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">Цэгээр тасалсан мөр</div>
    <div style="width:60px;word-break:break-all">Төлөвлөлт</div>
    <div style="width:100px;background:#eee"><span style="display:inline-block;white-space:nowrap;background:#fff">Тогтворгүй төлбөрийн тест</span></div>
    <details style="width:120px"><summary>Жагсаалт</summary><ul><li style="white-space:nowrap">Хаалттай байгаа маш урт мөр</li></ul></details>
  </div>`;
  await page.send("Page.navigate", { url: "data:text/html;charset=utf-8," + encodeURIComponent(html) });
  await wait(500);
  const hits = (await page.evaluate(SCAN(".preview-stage"))) ?? [];
  const kinds = hits.map((h) => h.split(" ")[0]).sort().join(",");
  for (const h of hits) console.log(h);
  await page.close();
  if (kinds !== "broken,clipped,overflow,overflow") throw new Error(`selftest: expected broken,clipped,overflow,overflow, got ${kinds || "nothing"}`);
  console.log("selftest: ok");
  process.exit(0);
}

const list = slugs();
let total = 0;
await setTheme(page, base, "light");
for (const width of widths) {
  await page.viewport(width);
  for (const slug of list) {
    await openSlug(page, base, slug, "light");
    const hits = (await page.evaluate(SCAN(".preview-stage"))) ?? [];
    if (process.argv.includes("--shell") && slug === list[0]) hits.push(...((await page.evaluate(SCAN("body", ".preview-stage"))) ?? []).map((h) => "shell " + h));
    if (hits.length) {
      total += hits.length;
      console.log(`${String(width).padEnd(5)} ${slug}`);
      for (const h of hits) console.log("      " + h);
    }
  }
}
console.log(`overflow: ${total} found`);
if (total) process.exitCode = 1;
await page.close();
await wait(0);
