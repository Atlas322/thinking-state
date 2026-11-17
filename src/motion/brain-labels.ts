/**
 * Label placement for BrainCover's named nodes (2026-11-17, screens.21). Pure, so it is tested
 * apart from WebGL. The site hero showed labels 2 and 3 on top of each other at 1440 and 390 px
 * («2 · Нийлүү…» / «3 · Салбар»): the old placer kept only 6 px vertically and, when no spot
 * fitted, fell back to the first one and clamped it — straight onto the previous label.
 *
 * Rule: every label stays inside `bounds` and at least `gap` px (default 16) from every label
 * placed before it — apart on x or on y. Try eight spots around the node (nearest first); if none
 * is free, slide down then up from the best spot in `gap` steps until one is.
 */
export type LabelBox = { x: number; y: number; w: number; h: number };
export type LabelNode = { nx: number; ny: number; w: number; h: number };
export type LabelBounds = { l: number; t: number; r: number; b: number };

/** True when the two boxes are at least `gap` apart on x or on y. */
export function labelsApart(a: LabelBox, b: LabelBox, gap = 16) {
  return a.x + a.w + gap <= b.x || b.x + b.w + gap <= a.x || a.y + a.h + gap <= b.y || b.y + b.h + gap <= a.y;
}

export function placeBrainLabels(nodes: LabelNode[], bounds: LabelBounds, gap = 16): LabelBox[] {
  const placed: LabelBox[] = [];
  const inside = (x: number, y: number, w: number, h: number) => x >= bounds.l && x + w <= bounds.r && y >= bounds.t && y + h <= bounds.b;
  const clampX = (x: number, w: number) => Math.min(Math.max(x, bounds.l), Math.max(bounds.l, bounds.r - w));
  const clampY = (y: number, h: number) => Math.min(Math.max(y, bounds.t), Math.max(bounds.t, bounds.b - h));
  const free = (box: LabelBox) => placed.every((p) => labelsApart(box, p, gap));
  for (const n of nodes) {
    const { nx, ny, w, h } = n;
    const spots: [number, number][] = [
      [nx + 12, ny - 12 - h], [nx - 12 - w, ny - 12 - h], [nx + 12, ny + 12], [nx - 12 - w, ny + 12],
      [nx + 14, ny - h / 2], [nx - 14 - w, ny - h / 2], [nx - w / 2, ny - 18 - h], [nx - w / 2, ny + 18],
    ];
    let box: LabelBox | undefined;
    for (const [x, y] of spots) {
      const cand = { x, y, w, h };
      if (inside(x, y, w, h) && free(cand)) { box = cand; break; }
    }
    if (!box) {
      // slide from the first spot (clamped inside) down, then up, in gap-sized steps
      const x0 = clampX(spots[0][0], w), y0 = clampY(spots[0][1], h);
      const step = h + gap;
      for (let k = 1; k <= 40 && !box; k++) {
        for (const dy of [k * step, -k * step]) {
          const y = y0 + dy;
          const cand = { x: x0, y, w, h };
          if (inside(x0, y, w, h) && free(cand)) { box = cand; break; }
        }
      }
      // no room at all (more labels than the canvas holds): keep it inside; the caller dims it
      box ??= { x: x0, y: y0, w, h };
    }
    placed.push(box);
  }
  return placed;
}
