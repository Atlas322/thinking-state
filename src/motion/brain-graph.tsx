/**
 * BrainGraph (2026-11-19): the knowledge graph as Obsidian's graph view shows it — a force-balanced
 * network you can touch (site request 2026-11-19: the knowledge graph should feel like Obsidian).
 *
 * - Layout: forces, not a starburst. Notes push apart, links pull, groups form their own clusters.
 * - Size = links: a node's radius grows with its degree, so the hubs stand out by themselves.
 * - Labels: hubs always; every other note on hover, as a neighbour of the hovered one, or zoomed in.
 *   Labels that would overlap one already drawn are skipped (higher degree wins).
 * - Hover: the node and its neighbours light in Electric, the rest fade. Click a hub with href → go.
 *   Touch has no hover: the first tap lights the node, a second tap on it goes; a vertical swipe
 *   still scrolls the page (touch-action: pan-y).
 * - Drag a node; drag the background to pan; ⌘/Ctrl + wheel or a trackpad pinch to zoom. A plain
 *   wheel scrolls the page — a website section must not trap the scroll.
 * - Colours come only from tokens (--ts-fg, --ts-faint, --ts-ink-muted, --ts-electric, --ts-line),
 *   re-read when <html data-theme> changes, so Өдөр and Шөнө both read correctly.
 * - The simulation stops once it settles (no idle CPU) and wakes on drag. Reduced motion lays the
 *   graph out up front and never animates.
 * - The canvas is an image with a description; the hubs are also a real list of links for
 *   keyboards and screen readers.
 */
import * as React from "react";

export type BrainGraphNote = { label: string; href?: string };

export type BrainGraphProps = {
  /** The note in the middle (the brain itself). */
  center: BrainGraphNote;
  /** The hubs around it — each gets its own cluster of notes. */
  notes: BrainGraphNote[];
  /** Unlabelled notes spread over the hubs (default 56). */
  extra?: number;
  /** Same seed, same graph. */
  seed?: number;
  /** Accessible description of the picture. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

export type GraphNode = { id: number; label: string; href?: string; hub: boolean; group: number };
export type GraphLayout = { nodes: GraphNode[]; links: [number, number][]; degree: number[] };

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The graph for a centre, hubs and a seed: same input, same nodes and links. */
export function brainGraphLayout(center: BrainGraphNote, notes: BrainGraphNote[], extra = 56, seed = 11): GraphLayout {
  const R = rng(seed);
  const nodes: GraphNode[] = [{ id: 0, label: center.label, href: center.href, hub: true, group: -1 }];
  notes.forEach((n, i) => nodes.push({ id: nodes.length, label: n.label, href: n.href, hub: true, group: i }));
  const links: [number, number][] = notes.map((_, i) => [0, i + 1]);
  const H = Math.max(notes.length, 1), first = notes.length + 1;
  for (let k = 0; k < extra; k++) {
    const g = Math.floor(R() * H), id = nodes.length;
    nodes.push({ id, label: "", hub: false, group: g });
    links.push([notes.length ? g + 1 : 0, id]);                                     // its own hub
    if (R() < 0.35 && id > first) links.push([id, first + Math.floor(R() * (id - first))]); // a sibling
    if (notes.length && R() < 0.12) links.push([id, 1 + Math.floor(R() * H)]);       // a bridge
  }
  const degree = nodes.map(() => 0);
  for (const [a, b] of links) { degree[a]++; degree[b]++; }
  return { nodes, links, degree };
}

type P = { x: number; y: number; vx: number; vy: number; r: number; fixed: boolean };

export function BrainGraph({ center, notes, extra = 56, seed = 11, label, className = "", style }: BrainGraphProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const graph = React.useMemo(() => brainGraphLayout(center, notes, extra, seed), [center.label, notes.map((n) => n.label).join("|"), extra, seed]);
  const desc = label ?? `${center.label} — ${notes.map((n) => n.label).join(", ")} бүлгүүдтэй мэдлэгийн сүлжээ`;

  React.useEffect(() => {
    const cv = ref.current;
    const x = cv?.getContext?.("2d");
    if (!cv || !x) return;
    const { nodes, links, degree } = graph;
    const nbr = nodes.map(() => new Set<number>());
    for (const [a, b] of links) { nbr[a].add(b); nbr[b].add(a); }
    const R = rng(seed + 1);
    const P: P[] = nodes.map((_, i) => ({ x: (R() - 0.5) * 300, y: (R() - 0.5) * 300, vx: 0, vy: 0, r: i === 0 ? 11 : 3 + Math.sqrt(degree[i]) * 1.9, fixed: false }));

    let W = 0, H = 0, raf = 0, alpha = 1, hover = -1, drag = -1, pan: [number, number] | null = null, userCam = false;
    const cam = { x: 0, y: 0, k: 1 };
    let C = { fg: "", faint: "", dot: "", el: "", line: "", font: "" };
    const readTokens = () => {
      const cs = getComputedStyle(cv);
      const t = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
      C = { fg: t("--ts-fg", cs.color), faint: t("--ts-faint", cs.color), dot: t("--ts-ink-muted", cs.color), el: t("--ts-electric", cs.color), line: t("--ts-faint", cs.color), font: t("--ts-font", "Inter, system-ui, sans-serif") };
    };
    const size = () => {
      const D = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
      if (w === W && h === H) return; W = w; H = h;
      cv.width = Math.max(1, W * D); cv.height = Math.max(1, H * D); x.setTransform(D, 0, 0, D, 0, 0);
    };

    const step = () => {
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j]; let dx = b.x - a.x, dy = b.y - a.y; const d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2);
        const hubs = (nodes[i].hub ? 1 : 0) + (nodes[j].hub ? 1 : 0), q = hubs === 2 ? 7 : hubs === 1 ? 1.8 : 1;
        const f = (900 * q / d2) * alpha; dx /= d; dy /= d; a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
      }
      for (const [i, j] of links) {
        const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
        const L = i === 0 || j === 0 ? 190 : nodes[i].hub || nodes[j].hub ? 60 : 42, f = (d - L) * 0.012 * alpha;
        a.vx += (dx / d) * f; a.vy += (dy / d) * f; b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      }
      const gx = 0.002 * Math.min(1, (H || 1) / (W || 1) * 1.15);   // өргөн канвас → өргөн сүлжээ
      for (const p of P) { p.vx -= p.x * gx * alpha; p.vy -= p.y * 0.002 * alpha; const sp = Math.hypot(p.vx, p.vy); if (sp > 12) { p.vx *= 12 / sp; p.vy *= 12 / sp; }
        if (!p.fixed) { p.x += p.vx; p.y += p.vy; } p.vx *= 0.82; p.vy *= 0.82; }
      alpha = Math.max(alpha * 0.992, 0.02);
    };
    const fit = (ease: number) => {
      if (userCam || !W) return;
      const xs = P.map((p) => p.x).sort((a, b) => a - b), ys = P.map((p) => p.y).sort((a, b) => a - b);
      const q = (a: number[], f: number) => a[Math.min(a.length - 1, Math.max(0, Math.round(f * (a.length - 1))))];
      const x0 = q(xs, 0.04) - 24, x1 = q(xs, 0.96) + 24, y0 = q(ys, 0.04) - 16, y1 = q(ys, 0.96) + 30;
      const pad = 32, k = Math.min((W - pad * 2) / (x1 - x0), (H - pad * 2) / (y1 - y0), 1.4);
      cam.k += (k - cam.k) * ease; cam.x += (-(x0 + x1) / 2 - cam.x) * ease; cam.y += (-(y0 + y1) / 2 - cam.y) * ease;
    };
    const scr = (p: P): [number, number] => [W / 2 + (p.x + cam.x) * cam.k, H / 2 + (p.y + cam.y) * cam.k];
    const world = (sx: number, sy: number): [number, number] => [(sx - W / 2) / cam.k - cam.x, (sy - H / 2) / cam.k - cam.y];

    const draw = () => {
      x.clearRect(0, 0, W, H);
      const lit = hover >= 0 ? new Set([hover, ...nbr[hover]]) : null;
      x.lineWidth = 1;
      for (const [i, j] of links) {
        const on = !!lit && (i === hover || j === hover);
        x.strokeStyle = on ? C.el : C.line; x.globalAlpha = on ? 1 : lit ? 0.06 : 0.28; x.lineWidth = on ? 1.4 : 1;
        const [ax, ay] = scr(P[i]), [bx, by] = scr(P[j]); x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
      }
      const zoom = Math.max(0.6, Math.min(cam.k, 1.6));
      P.forEach((p, i) => {
        const on = lit ? lit.has(i) : true, [sx, sy] = scr(p);
        x.globalAlpha = on ? 1 : 0.15;
        x.fillStyle = i === hover || (lit && on) ? C.el : nodes[i].hub ? C.fg : C.dot;
        x.beginPath(); x.arc(sx, sy, p.r * zoom, 0, Math.PI * 2); x.fill();
      });
      // Labels last, highest degree first, skipping any that would overlap a drawn one.
      const boxes: [number, number, number, number][] = [];
      // Дараалал: hover → төв → бусад зангилаа (холбоосоор) → энгийн тэмдэглэл. Төвийн шошго хэзээ ч алгасагдахгүй.
      const rank = (i: number) => (i === hover ? 3e6 : i === 0 ? 2e6 : nodes[i].hub ? 1e6 + degree[i] : degree[i]);
      const order = P.map((_, i) => i).sort((a, b) => rank(b) - rank(a));
      for (const i of order) {
        const n = nodes[i], on = lit ? lit.has(i) : true;
        const show = n.label && (n.hub || i === hover || (lit && lit.has(i)) || cam.k > 1.7);
        if (!show || !on) continue;
        const [sx, sy] = scr(P[i]), size = i === 0 ? 14 : n.hub ? 13 : 12;
        x.font = `${i === 0 ? 600 : n.hub ? 500 : 400} ${size}px ${C.font}`;
        const tw = x.measureText(n.label).width, ty = sy + P[i].r * zoom + size + 2;
        const lx = Math.min(Math.max(sx, tw / 2 + 6), W - tw / 2 - 6);   // шошго canvas-аас гарч тасрахгүй
        const box: [number, number, number, number] = [lx - tw / 2 - 3, ty - size, lx + tw / 2 + 3, ty + 4];
        if (i !== hover && boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
        boxes.push(box);
        x.globalAlpha = 1; x.fillStyle = n.hub || i === hover ? C.fg : C.faint; x.textAlign = "center";
        x.fillText(n.label, lx, ty);
      }
      x.globalAlpha = 1;
    };

    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => { if (!reduce && alpha > 0.021) { step(); fit(0.08); } draw(); raf = alpha > 0.021 || drag >= 0 ? requestAnimationFrame(tick) : 0; };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    readTokens(); size();
    if (reduce) { for (let i = 0; i < 500; i++) step(); alpha = 0.02; fit(1); }
    wake();

    const pick = (sx: number, sy: number) => {
      const [wx, wy] = world(sx, sy); let best = -1, bd = 1e9;
      P.forEach((p, i) => { const d = Math.hypot(p.x - wx, p.y - wy); if (d < Math.max(p.r + 4, 10) / cam.k && d < bd) { bd = d; best = i; } });
      return best;
    };
    const at = (e: PointerEvent | WheelEvent): [number, number] => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    let moved = false;
    const onMove = (e: PointerEvent) => {
      const [sx, sy] = at(e);
      if (drag >= 0) { const [wx, wy] = world(sx, sy); P[drag].x = wx; P[drag].y = wy; alpha = Math.max(alpha, 0.3); moved = true; wake(); return; }
      if (pan) { cam.x += (sx - pan[0]) / cam.k; cam.y += (sy - pan[1]) / cam.k; pan = [sx, sy]; moved = true; draw(); return; }
      const h = pick(sx, sy);
      if (h !== hover) { hover = h; cv.style.cursor = h >= 0 ? (nodes[h].href ? "pointer" : "grab") : "grab"; draw(); }
    };
    const onDown = (e: PointerEvent) => {
      touch = e.pointerType !== "mouse";
      const [sx, sy] = at(e), i = pick(sx, sy); moved = false;
      if (touch && i < 0) { armed = -1; if (hover !== -1) { hover = -1; draw(); } return; }   // хоосон газар товшвол тодруулга арилна, гүйлгэлт хэвээр
      cv.setPointerCapture?.(e.pointerId);
      if (i >= 0) { drag = i; P[i].fixed = true; hover = i; } else { pan = [sx, sy]; userCam = true; }
    };
    let armed = -1, touch = false;
    const onUp = () => {
      if (drag >= 0) {
        const i = drag, n = nodes[i]; P[i].fixed = false;
        // Хулгана: дарвал шууд орно. Мэдрэгч: hover байхгүй тул эхлээд тодруулж, ижил цэгийг дахин товшвол орно.
        if (!moved && n.href && (!touch || armed === i)) window.location.href = n.href;
        else if (!moved && touch) { armed = i; hover = i; draw(); }
      }
      drag = -1; pan = null;
    };
    const onLeave = () => { onUp(); if (!touch && hover !== -1) { hover = -1; draw(); } };
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;                 // plain wheel scrolls the page
      e.preventDefault(); userCam = true;
      const [sx, sy] = at(e), [wx, wy] = world(sx, sy);
      cam.k = Math.min(3.5, Math.max(0.4, cam.k * Math.exp(-e.deltaY * 0.01)));
      const [nx, ny] = world(sx, sy); cam.x += nx - wx; cam.y += ny - wy; draw();
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("wheel", onWheel, { passive: false });
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => { size(); fit(1); draw(); }) : null;
    ro?.observe(cv);
    const mo = typeof MutationObserver === "function" ? new MutationObserver(() => { readTokens(); draw(); }) : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelAnimationFrame(raf); ro?.disconnect(); mo?.disconnect();
      cv.removeEventListener("pointermove", onMove); cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerup", onUp); cv.removeEventListener("pointerleave", onLeave); cv.removeEventListener("pointercancel", onUp); cv.removeEventListener("wheel", onWheel);
    };
  }, [graph, seed]);

  const linked = [center, ...notes].filter((n) => n.href);
  return (
    <div className={`ts-brain-graph ${className}`} style={{ position: "relative", ...style }}>
      <canvas
        ref={ref}
        role="img"
        aria-label={desc}
        style={{ display: "block", width: "100%", height: "100%", minHeight: 360, aspectRatio: "16 / 9", touchAction: "pan-y", cursor: "grab", background: "var(--ts-page)" }}
      />
      {linked.length > 0 && (
        <ul aria-label={desc} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", margin: -1, padding: 0 }}>
          {linked.map((n) => <li key={n.label}><a href={n.href}>{n.label}</a></li>)}
        </ul>
      )}
    </div>
  );
}

export const brainGraphDemo: BrainGraphProps = {
  center: { label: "INAI онлайн орчин" },
  notes: ["Судалгаа", "Батлагдсан код", "Figma дизайн", "Вэб дизайн", "Social пост", "Brand kit", "Newsletter"].map((label) => ({ label })),
  extra: 56,
  seed: 11,
};
