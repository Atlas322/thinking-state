// Contrast for every catalog preview, both themes (owner 2026-11-12):
// text 4.5:1 (large text 3:1), icon glyphs 3:1, against the composited
// background under them. Gradients and images are skipped (not measurable).
//
//   npm run dev     (another terminal; or pass --url)
//   node scripts/check-contrast.mjs [--url http://127.0.0.1:5173] [--only a,b] [--width 1440] [--themes light,dark] [--shell]
// --shell also scans the catalog chrome (sidebar, header) once per theme.
import { arg, launch, openSlug, setTheme, slugs } from "./cdp.mjs";

const base = arg("url", "http://127.0.0.1:5173");
const width = Number(arg("width", "1440"));

const SCAN = (selector, exclude = "") => `(() => {
  const exclude = ${JSON.stringify(exclude)};
  const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const rgba = (c) => { cv.clearRect(0, 0, 1, 1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const d = cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = (a) => { const c = a.slice(0, 3).map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const mix = (top, bot) => [0, 1, 2].map((i) => top[i] * top[3] + bot[i] * (1 - top[3])).concat(1);
  const bgOf = (el) => {
    const stack = [];
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage && s.backgroundImage !== "none") return null;
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) { stack.push(c); if (c[3] >= 0.99) break; }
    }
    let b = rgba(getComputedStyle(document.body).backgroundColor);
    if (b[3] < 1) b = [255, 255, 255, 1];
    for (let i = stack.length - 1; i >= 0; i--) b = mix(stack[i], b);
    return b;
  };
  const opacityOf = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
  const hex = (a) => "#" + a.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const ratio = (fg, bg) => { const x = lum(fg), y = lum(bg); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const root = document.querySelector(${JSON.stringify(selector)});
  if (!root) return [];
  const out = new Set();
  const skipped = { invisible: 0 };
  const disabled = new Set();
  for (const el of root.querySelectorAll("*")) {
    if (exclude && el.closest(exclude)) continue;
    if (el.closest("[aria-hidden=true]:not(svg)") && el.tagName !== "svg") continue;
    const isSvg = el.tagName === "svg";
    const text = isSvg ? "" : [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(" ");
    if (!isSvg && !text) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none") continue;
    if (isSvg) {
      // only glyphs painted with currentColor carry the element colour
      const painted = [...el.querySelectorAll("path,circle,rect,line,polyline,polygon")].some((p) => { const ps = getComputedStyle(p); return ps.stroke === s.color || ps.fill === s.color; });
      if (!painted) continue;
    }
    // WCAG 1.4.3 exempts inactive controls: listed as exceptions, not counted
    const off = el.closest(":disabled, [aria-disabled=true], [data-disabled]:not([data-disabled=false])");
    const op = opacityOf(el);
    if (op < 0.35) continue; // deliberately faded (disabled, ghost): not measured
    const bg = bgOf(el);
    if (!bg) continue;
    let fg = rgba(s.color);
    // transparent text is painted another way (background-clip:text) or hidden on purpose
    if (fg[3] < 0.05) { skipped.invisible++; continue; }
    if (fg[3] < 1) fg = mix(fg, bg);
    if (op < 0.99) fg = mix([...fg.slice(0, 3), op], bg);
    const size = parseFloat(s.fontSize), weight = +s.fontWeight;
    const need = isSvg ? 3 : size >= 24 || (weight >= 700 && size >= 18.66) ? 3 : 4.5;
    const got = ratio(fg, bg);
    // Same colour as the background: nothing is painted where the scanner looks. Either the
    // state hides it (an unchecked tick) or the real backdrop is a sibling, pseudo-element or
    // image the ancestor walk cannot see. Counted, not reported; a human sees these at once.
    if (got < 1.1) { skipped.invisible++; continue; }
    if (got < need - 0.005 && off) disabled.add(got.toFixed(2) + " " + (isSvg ? "glyph" : "text") + " " + el.tagName.toLowerCase() + "." + String(el.className.baseVal ?? el.className).split(" ")[0] + (text ? " «" + text.slice(0, 32) + "»" : ""));
    else if (got < need - 0.005) out.add(got.toFixed(2) + " " + hex(fg) + "/" + hex(bg) + " " + (isSvg ? "glyph" : "text") + " " + el.tagName.toLowerCase() + "." + String(el.className.baseVal ?? el.className).split(" ")[0] + (text ? " «" + text.slice(0, 32) + "»" : ""));
  }
  return { hits: [...out], skipped, disabled: [...disabled] };
})()`;

const page = await launch();
const list = slugs();
await page.viewport(width);
let total = 0;
let invisible = 0;
const exceptions = [];
let current = "";
const scan = async (selector, exclude) => {
  const r = (await page.evaluate(SCAN(selector, exclude))) ?? { hits: [], skipped: { invisible: 0 }, disabled: [] };
  invisible += r.skipped.invisible;
  exceptions.push(...r.disabled.map((d) => `${current} ${d}`));
  return r.hits;
};
for (const theme of arg("themes", "light,dark").split(",")) {
  await setTheme(page, base, theme);
  for (const slug of list) {
    await openSlug(page, base, slug, theme);
    current = `${theme.padEnd(5)} ${slug}`;
    const hits = await scan(".preview-stage");
    if (process.argv.includes("--shell") && slug === list[0]) hits.push(...(await scan("body", ".preview-stage")).map((h) => "shell " + h));
    if (hits.length) {
      total += hits.length;
      console.log(`${theme.padEnd(5)} ${slug}`);
      for (const h of hits) console.log("      " + h);
    }
  }
}
if (exceptions.length) {
  console.log(`disabled controls below the bar (exempt, WCAG 1.4.3 "inactive user interface component"): ${exceptions.length}`);
  for (const e of exceptions) console.log("      " + e);
}
console.log(`contrast: ${total} below the bar (${invisible} invisible text/glyphs skipped: transparent, or the same colour as the measured background)`);
if (total) process.exitCode = 1;
await page.close();
