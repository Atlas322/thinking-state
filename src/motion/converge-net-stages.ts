/**
 * ConvergeNet four stages (2026-11-17, screens.17), ported from web-builder's prototype
 * (site-recipes motifs/converge-net-4.html, 83f5c9c; Figma INAI Branding 56:86567):
 * 1 streams come in from the edges · 2 Obsidian local graph around one note · 3 PARA groups,
 * each its own shape and token colour · 4 a Fibonacci sphere turns around an axis.
 * `t` runs 0..4; 4 is the finished sphere (reduced motion shows it).
 */
export type NetShape = "circle" | "square" | "triangle" | "diamond";
export type NetGroup = { label: string; shape: NetShape; color: string };
/** A labelled note on the stage-2 local graph: a link, with an optional short preview. */
export type NetNote = { label: string; href?: string; preview?: string };

/**
 * Which dots carry the labelled notes: `count` dots on the graph ring (radius .14–.34), spread by
 * angle so the labels do not crowd; returns node indices (deterministic for a layout).
 */
export function pickNoteNodes(net: ReturnType<typeof convergeStagesLayout>, count: number): number[] {
  const ring = net.nodes.map((n, i) => ({ i, dx: n.graph[0] - 0.5, dy: n.graph[1] - 0.5 })).filter((v) => v.i > 0).map((v) => ({ ...v, r: Math.hypot(v.dx / 1.2, v.dy), a: Math.atan2(v.dy, v.dx) })).filter((v) => v.r > 0.14 && v.r < 0.34);
  const out: number[] = [];
  for (let k = 0; k < count; k++) {
    const target = -Math.PI + ((k + 0.5) * 2 * Math.PI) / count;
    const best = ring.filter((v) => !out.includes(v.i)).sort((a, b) => Math.abs(Math.atan2(Math.sin(a.a - target), Math.cos(a.a - target))) - Math.abs(Math.atan2(Math.sin(b.a - target), Math.cos(b.a - target))))[0];
    if (best) out.push(best.i);
  }
  return out;
}

/** PARA groups: Төсөл · Хүрээ · Нөөц · Архив, colours as token names. */
export const paraNetGroups: NetGroup[] = [
  { label: "Төсөл", shape: "circle", color: "--ts-electric" },
  { label: "Хүрээ", shape: "square", color: "--ts-fg" },
  { label: "Нөөц", shape: "triangle", color: "--ts-amber" },
  { label: "Архив", shape: "diamond", color: "--ts-green" },
];

type P2 = [number, number];
type StageNode = { g: number; from: P2; graph: P2; cl: P2; sph: [number, number, number]; d: number; z: number };

export function convergeStagesLayout(n: number, seed: number, groups = 4) {
  let s = Math.max(1, Math.floor(seed)) % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const G = Math.max(1, groups);
  const nodes: StageNode[] = [];
  for (let i = 0; i < n; i++) {
    const g = i % G, side = Math.floor(rnd() * 4), e = rnd();
    const from: P2 = side === 0 ? [e, -0.1] : side === 1 ? [1.1, e] : side === 2 ? [e, 1.1] : [-0.1, e];
    const a = rnd() * 6.283, r = 0.08 + Math.pow(rnd(), 0.7) * 0.3;
    const graph: P2 = i === 0 ? [0.5, 0.5] : [0.5 + Math.cos(a) * r * 1.2, 0.5 + Math.sin(a) * r];
    const ga = (g * 2 * Math.PI) / G + Math.PI / 4, gc: P2 = [0.5 + Math.cos(ga) * 0.22, 0.5 + Math.sin(ga) * 0.2];
    const cl: P2 = i === 0 ? [0.5, 0.5] : [gc[0] + (rnd() - 0.5) * 0.14, gc[1] + (rnd() - 0.5) * 0.16];
    const th = Math.acos(1 - 2 * ((i + 0.5) / n)), ph = i * 2.39996;
    nodes.push({ g, from, graph, cl, sph: [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)], d: rnd() * 0.3, z: 0 });
  }
  const links: P2[] = [];
  for (let i = 1; i < n; i++) { links.push([0, i]); const j = 1 + Math.floor(rnd() * (n - 1)); if (j !== i && i % 3 === 0) links.push([i, j]); }
  return { nodes, links };
}

const ease = (t: number) => { t = Math.min(Math.max(t, 0), 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const lerp = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

function shape(x: CanvasRenderingContext2D, px: number, py: number, s: NetShape, r: number) {
  x.beginPath();
  if (s === "circle") x.arc(px, py, r, 0, 7);
  else if (s === "square") x.rect(px - r, py - r, 2 * r, 2 * r);
  else if (s === "triangle") { x.moveTo(px, py - r * 1.2); x.lineTo(px + r * 1.1, py + r * 0.8); x.lineTo(px - r * 1.1, py + r * 0.8); x.closePath(); }
  else { x.moveTo(px, py - r * 1.3); x.lineTo(px + r * 1.3, py); x.lineTo(px, py + r * 1.3); x.lineTo(px - r * 1.3, py); x.closePath(); }
}

/** One frame `t` (0..4). `accent` = stage 1–2 colour, `ink` = the axis, `colors[g]` = group colours. */
export function drawConvergeStages(x: CanvasRenderingContext2D, W: number, H: number, t: number, net: ReturnType<typeof convergeStagesLayout>, groups: NetGroup[], colors: string[], accent: string, ink: string) {
  const { nodes, links } = net;
  x.clearRect(0, 0, W, H);
  const rot = t * 0.9, sc = Math.min(W, H) * 0.36;
  const k2 = ease(t - 1), k3 = ease(t - 2), k4 = ease(t - 3);
  const col = (g: number) => colors[g % colors.length] ?? accent;
  const shp = (g: number) => groups[g % groups.length]?.shape ?? "circle";
  const pos = nodes.map((n) => {
    let p = lerp(n.from, n.graph, ease((t - n.d) / 0.8));
    if (t > 1.6) p = lerp(p, n.cl, k3);
    if (t > 2.6) {
      const [sx, sy, sz] = n.sph; const cx = sx * Math.cos(rot) + sz * Math.sin(rot), cz = -sx * Math.sin(rot) + sz * Math.cos(rot);
      p = lerp(p, [0.5 + (cx * sc) / W, 0.5 + (sy * sc) / H], k4); n.z = cz;
    } else n.z = 0;
    return [p[0] * W, p[1] * H] as P2;
  });
  if (k4 > 0) {
    x.strokeStyle = ink; x.globalAlpha = 0.55 * k4; x.lineWidth = 1.2; x.setLineDash([6, 6]);
    x.beginPath(); x.moveTo(W / 2, H / 2 - sc * 1.25 * k4); x.lineTo(W / 2, H / 2 + sc * 1.25 * k4); x.stroke(); x.setLineDash([]);
    x.globalAlpha = 0.18 * k4; x.beginPath(); x.ellipse(W / 2, H / 2, sc, sc * 0.28, 0, 0, 7); x.stroke(); x.globalAlpha = 1;
  }
  x.lineWidth = 1;
  links.forEach(([a, b]) => {
    if (a === 0 && t > 2.6) return;
    let al = 0.45 * k2 * (t < 2.6 ? 1 : 1 - k4 * 0.6);
    if (t > 1.6 && (nodes[a].g !== nodes[b].g || a === 0)) al *= 1 - k3;
    if (al <= 0.01) return;
    x.strokeStyle = t > 1.8 && a !== 0 ? col(nodes[a].g) : accent; x.globalAlpha = al;
    x.beginPath(); x.moveTo(...pos[a]); x.lineTo(...pos[b]); x.stroke();
  });
  if (k4 > 0) for (let i = 1; i < nodes.length; i++) for (const j of [i + 1, i + 8]) if (j < nodes.length) {
    x.strokeStyle = col(nodes[i].g); x.globalAlpha = 0.28 * k4 * (0.5 + 0.25 * (nodes[i].z + 1));
    x.beginPath(); x.moveTo(...pos[i]); x.lineTo(...pos[j]); x.stroke();
  }
  x.globalAlpha = 1;
  if (t < 1.2) nodes.forEach((n, i) => {
    const k = ease((t - n.d) / 0.8); if (k <= 0 || k >= 1) return;
    x.strokeStyle = accent; x.globalAlpha = 0.3 * (1 - k); x.beginPath(); x.moveTo(n.from[0] * W, n.from[1] * H); x.lineTo(...pos[i]); x.stroke(); x.globalAlpha = 1;
  });
  nodes.map((n, i) => [n, i] as const).sort((a, b) => a[0].z - b[0].z).forEach(([n, i]) => {
    const [px, py] = pos[i]; const depth = 0.55 + (0.45 * (n.z + 1)) / 2;
    const r = i === 0 && t < 2.6 ? 7 * k2 + 3 : 3.2 * (t > 2.6 ? depth : 1);
    x.globalAlpha = t > 2.6 ? depth : 1; x.fillStyle = k3 > 0.5 ? col(n.g) : accent;
    shape(x, px, py, k3 > 0.5 ? shp(n.g) : "circle", r); x.fill(); x.globalAlpha = 1;
    if (i === 0 && k2 > 0 && t < 2.6) { x.strokeStyle = accent; x.globalAlpha = 0.3 * k2; x.beginPath(); x.arc(px, py, 18, 0, 7); x.stroke(); x.globalAlpha = 1; }
  });
}
