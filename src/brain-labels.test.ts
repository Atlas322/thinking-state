// BrainCover label placement: ≥16 px apart and inside the canvas, for 4–5 labels at the site's
// hero widths (1440 and 390), including nodes that sit almost on top of each other.
import { describe, expect, it } from "vitest";
import { labelsApart, placeBrainLabels, type LabelNode } from "./motion/brain-labels";

const allApart = (boxes: ReturnType<typeof placeBrainLabels>) => boxes.every((a, i) => boxes.every((b, j) => i === j || labelsApart(a, b, 16)));

describe("placeBrainLabels", () => {
  it.each([
    ["1440, 4 labels, two nodes close (the hero case)", 1440, 420, [[700, 160], [760, 150], [790, 170], [900, 220]]],
    ["1440, 5 labels on one arc", 1440, 420, [[560, 240], [640, 170], [720, 140], [800, 170], [880, 240]]],
    ["390, 4 labels, nodes crowded", 390, 300, [[150, 120], [190, 110], [210, 130], [250, 170]]],
    ["390, 5 labels", 390, 300, [[110, 180], [160, 120], [200, 100], [240, 120], [280, 180]]],
  ] as const)("%s: every label ≥16px from the others and inside", (_n, W, H, pts) => {
    const nodes: LabelNode[] = pts.map(([nx, ny], k) => ({ nx, ny, w: [132, 118, 96, 140, 110][k], h: 22 }));
    const bounds = { l: 8, t: 8, r: W - 8, b: H - 8 };
    const boxes = placeBrainLabels(nodes, bounds);
    expect(allApart(boxes)).toBe(true);
    for (const b of boxes) {
      expect(b.x).toBeGreaterThanOrEqual(bounds.l);
      expect(b.x + b.w).toBeLessThanOrEqual(bounds.r);
      expect(b.y).toBeGreaterThanOrEqual(bounds.t);
      expect(b.y + b.h).toBeLessThanOrEqual(bounds.b);
    }
  });
  it("the old 6px rule would have let two labels touch; the new one keeps 16px", () => {
    expect(labelsApart({ x: 0, y: 0, w: 100, h: 22 }, { x: 0, y: 30, w: 100, h: 22 }, 16)).toBe(false);
    expect(labelsApart({ x: 0, y: 0, w: 100, h: 22 }, { x: 0, y: 38, w: 100, h: 22 }, 16)).toBe(true);
  });
});
