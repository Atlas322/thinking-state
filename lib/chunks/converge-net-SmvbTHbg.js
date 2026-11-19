import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = s + 1831565813 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function brainGraphLayout(center, notes, extra = 56, seed = 11) {
  const R = rng(seed);
  const nodes = [{ id: 0, label: center.label, href: center.href, hub: true, group: -1 }];
  notes.forEach((n, i) => nodes.push({ id: nodes.length, label: n.label, href: n.href, hub: true, group: i }));
  const links = notes.map((_, i) => [0, i + 1]);
  const H = Math.max(notes.length, 1), first = notes.length + 1;
  for (let k = 0; k < extra; k++) {
    const g = Math.floor(R() * H), id = nodes.length;
    nodes.push({ id, label: "", hub: false, group: g });
    links.push([notes.length ? g + 1 : 0, id]);
    if (R() < 0.35 && id > first) links.push([id, first + Math.floor(R() * (id - first))]);
    if (notes.length && R() < 0.12) links.push([id, 1 + Math.floor(R() * H)]);
  }
  const degree = nodes.map(() => 0);
  for (const [a, b] of links) {
    degree[a]++;
    degree[b]++;
  }
  return { nodes, links, degree };
}
function BrainGraph({ center, notes, extra = 56, seed = 11, label, className = "", style }) {
  const ref = React.useRef(null);
  const graph = React.useMemo(() => brainGraphLayout(center, notes, extra, seed), [center.label, notes.map((n) => n.label).join("|"), extra, seed]);
  const desc = label ?? `${center.label} — ${notes.map((n) => n.label).join(", ")} бүлгүүдтэй мэдлэгийн сүлжээ`;
  React.useEffect(() => {
    const cv = ref.current;
    const x = cv?.getContext?.("2d");
    if (!cv || !x) return;
    const { nodes, links, degree } = graph;
    const nbr = nodes.map(() => /* @__PURE__ */ new Set());
    for (const [a, b] of links) {
      nbr[a].add(b);
      nbr[b].add(a);
    }
    const R = rng(seed + 1);
    const P = nodes.map((_, i) => ({ x: (R() - 0.5) * 300, y: (R() - 0.5) * 300, vx: 0, vy: 0, r: i === 0 ? 11 : 3 + Math.sqrt(degree[i]) * 1.9, fixed: false }));
    let W = 0, H = 0, raf = 0, alpha = 1, hover = -1, drag = -1, pan = null, userCam = false;
    const cam = { x: 0, y: 0, k: 1 };
    let C = { fg: "", faint: "", dot: "", el: "", line: "", font: "" };
    const readTokens = () => {
      const cs = getComputedStyle(cv);
      const t = (n, f) => cs.getPropertyValue(n).trim() || f;
      C = { fg: t("--ts-fg", cs.color), faint: t("--ts-faint", cs.color), dot: t("--ts-ink-muted", cs.color), el: t("--ts-electric", cs.color), line: t("--ts-faint", cs.color), font: t("--ts-font", "Inter, system-ui, sans-serif") };
    };
    const size = () => {
      const D = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
      if (w === W && h === H) return;
      W = w;
      H = h;
      cv.width = Math.max(1, W * D);
      cv.height = Math.max(1, H * D);
      x.setTransform(D, 0, 0, D, 0, 0);
    };
    const step = () => {
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        const d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2);
        const hubs = (nodes[i].hub ? 1 : 0) + (nodes[j].hub ? 1 : 0), q = hubs === 2 ? 7 : hubs === 1 ? 1.8 : 1;
        const f = 900 * q / d2 * alpha;
        dx /= d;
        dy /= d;
        a.vx -= dx * f;
        a.vy -= dy * f;
        b.vx += dx * f;
        b.vy += dy * f;
      }
      for (const [i, j] of links) {
        const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
        const L = i === 0 || j === 0 ? 190 : nodes[i].hub || nodes[j].hub ? 60 : 42, f = (d - L) * 0.012 * alpha;
        a.vx += dx / d * f;
        a.vy += dy / d * f;
        b.vx -= dx / d * f;
        b.vy -= dy / d * f;
      }
      const gx = 2e-3 * Math.min(1, (H || 1) / (W || 1) * 1.15);
      for (const p of P) {
        p.vx -= p.x * gx * alpha;
        p.vy -= p.y * 2e-3 * alpha;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 12) {
          p.vx *= 12 / sp;
          p.vy *= 12 / sp;
        }
        if (!p.fixed) {
          p.x += p.vx;
          p.y += p.vy;
        }
        p.vx *= 0.82;
        p.vy *= 0.82;
      }
      alpha = Math.max(alpha * 0.992, 0.02);
    };
    const fit = (ease2) => {
      if (userCam || !W) return;
      const xs = P.map((p) => p.x).sort((a, b) => a - b), ys = P.map((p) => p.y).sort((a, b) => a - b);
      const q = (a, f) => a[Math.min(a.length - 1, Math.max(0, Math.round(f * (a.length - 1))))];
      const x0 = q(xs, 0.04) - 24, x1 = q(xs, 0.96) + 24, y0 = q(ys, 0.04) - 16, y1 = q(ys, 0.96) + 30;
      const pad = 32, k = Math.min((W - pad * 2) / (x1 - x0), (H - pad * 2) / (y1 - y0), 1.4);
      cam.k += (k - cam.k) * ease2;
      cam.x += (-(x0 + x1) / 2 - cam.x) * ease2;
      cam.y += (-(y0 + y1) / 2 - cam.y) * ease2;
    };
    const scr = (p) => [W / 2 + (p.x + cam.x) * cam.k, H / 2 + (p.y + cam.y) * cam.k];
    const world = (sx, sy) => [(sx - W / 2) / cam.k - cam.x, (sy - H / 2) / cam.k - cam.y];
    const draw = () => {
      x.clearRect(0, 0, W, H);
      const lit = hover >= 0 ? /* @__PURE__ */ new Set([hover, ...nbr[hover]]) : null;
      x.lineWidth = 1;
      for (const [i, j] of links) {
        const on = !!lit && (i === hover || j === hover);
        x.strokeStyle = on ? C.el : C.line;
        x.globalAlpha = on ? 1 : lit ? 0.06 : 0.28;
        x.lineWidth = on ? 1.4 : 1;
        const [ax, ay] = scr(P[i]), [bx, by] = scr(P[j]);
        x.beginPath();
        x.moveTo(ax, ay);
        x.lineTo(bx, by);
        x.stroke();
      }
      const zoom = Math.max(0.6, Math.min(cam.k, 1.6));
      P.forEach((p, i) => {
        const on = lit ? lit.has(i) : true, [sx, sy] = scr(p);
        x.globalAlpha = on ? 1 : 0.15;
        x.fillStyle = i === hover || lit && on ? C.el : nodes[i].hub ? C.fg : C.dot;
        x.beginPath();
        x.arc(sx, sy, p.r * zoom, 0, Math.PI * 2);
        x.fill();
      });
      const boxes = [];
      const rank = (i) => i === hover ? 3e6 : i === 0 ? 2e6 : nodes[i].hub ? 1e6 + degree[i] : degree[i];
      const order = P.map((_, i) => i).sort((a, b) => rank(b) - rank(a));
      for (const i of order) {
        const n = nodes[i], on = lit ? lit.has(i) : true;
        const show = n.label && (n.hub || i === hover || lit && lit.has(i) || cam.k > 1.7);
        if (!show || !on) continue;
        const [sx, sy] = scr(P[i]), size2 = i === 0 ? 14 : n.hub ? 13 : 12;
        x.font = `${i === 0 ? 600 : n.hub ? 500 : 400} ${size2}px ${C.font}`;
        const tw = x.measureText(n.label).width, ty = sy + P[i].r * zoom + size2 + 2;
        const lx = Math.min(Math.max(sx, tw / 2 + 6), W - tw / 2 - 6);
        const box = [lx - tw / 2 - 3, ty - size2, lx + tw / 2 + 3, ty + 4];
        if (i !== hover && boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
        boxes.push(box);
        x.globalAlpha = 1;
        x.fillStyle = n.hub || i === hover ? C.fg : C.faint;
        x.textAlign = "center";
        x.fillText(n.label, lx, ty);
      }
      x.globalAlpha = 1;
    };
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      if (!reduce && alpha > 0.021) {
        step();
        fit(0.08);
      }
      draw();
      raf = alpha > 0.021 || drag >= 0 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    readTokens();
    size();
    if (reduce) {
      for (let i = 0; i < 500; i++) step();
      alpha = 0.02;
      fit(1);
    }
    wake();
    const pick = (sx, sy) => {
      const [wx, wy] = world(sx, sy);
      let best = -1, bd = 1e9;
      P.forEach((p, i) => {
        const d = Math.hypot(p.x - wx, p.y - wy);
        if (d < Math.max(p.r + 4, 10) / cam.k && d < bd) {
          bd = d;
          best = i;
        }
      });
      return best;
    };
    const at = (e) => {
      const r = cv.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    let moved = false;
    const onMove = (e) => {
      const [sx, sy] = at(e);
      if (drag >= 0) {
        const [wx, wy] = world(sx, sy);
        P[drag].x = wx;
        P[drag].y = wy;
        alpha = Math.max(alpha, 0.3);
        moved = true;
        wake();
        return;
      }
      if (pan) {
        cam.x += (sx - pan[0]) / cam.k;
        cam.y += (sy - pan[1]) / cam.k;
        pan = [sx, sy];
        moved = true;
        draw();
        return;
      }
      const h = pick(sx, sy);
      if (h !== hover) {
        hover = h;
        cv.style.cursor = h >= 0 ? nodes[h].href ? "pointer" : "grab" : "grab";
        draw();
      }
    };
    const onDown = (e) => {
      touch = e.pointerType !== "mouse";
      const [sx, sy] = at(e), i = pick(sx, sy);
      moved = false;
      if (touch && i < 0) {
        armed = -1;
        if (hover !== -1) {
          hover = -1;
          draw();
        }
        return;
      }
      cv.setPointerCapture?.(e.pointerId);
      if (i >= 0) {
        drag = i;
        P[i].fixed = true;
        hover = i;
      } else {
        pan = [sx, sy];
        userCam = true;
      }
    };
    let armed = -1, touch = false;
    const onUp = () => {
      if (drag >= 0) {
        const i = drag, n = nodes[i];
        P[i].fixed = false;
        if (!moved && n.href && (!touch || armed === i)) window.location.href = n.href;
        else if (!moved && touch) {
          armed = i;
          hover = i;
          draw();
        }
      }
      drag = -1;
      pan = null;
    };
    const onLeave = () => {
      onUp();
      if (!touch && hover !== -1) {
        hover = -1;
        draw();
      }
    };
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      userCam = true;
      const [sx, sy] = at(e), [wx, wy] = world(sx, sy);
      cam.k = Math.min(3.5, Math.max(0.4, cam.k * Math.exp(-e.deltaY * 0.01)));
      const [nx, ny] = world(sx, sy);
      cam.x += nx - wx;
      cam.y += ny - wy;
      draw();
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointerup", onUp);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointercancel", onUp);
    cv.addEventListener("wheel", onWheel, { passive: false });
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => {
      size();
      fit(1);
      draw();
    }) : null;
    ro?.observe(cv);
    const mo = typeof MutationObserver === "function" ? new MutationObserver(() => {
      readTokens();
      draw();
    }) : null;
    mo?.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      mo?.disconnect();
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerup", onUp);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointercancel", onUp);
      cv.removeEventListener("wheel", onWheel);
    };
  }, [graph, seed]);
  const linked = [center, ...notes].filter((n) => n.href);
  return /* @__PURE__ */ jsxs("div", { className: `ts-brain-graph ${className}`, style: { position: "relative", ...style }, children: [
    /* @__PURE__ */ jsx(
      "canvas",
      {
        ref,
        role: "img",
        "aria-label": desc,
        style: { display: "block", width: "100%", height: "100%", minHeight: 360, aspectRatio: "16 / 9", touchAction: "pan-y", cursor: "grab", background: "var(--ts-page)" }
      }
    ),
    linked.length > 0 && /* @__PURE__ */ jsx("ul", { "aria-label": desc, style: { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", margin: -1, padding: 0 }, children: linked.map((n) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: n.href, children: n.label }) }, n.label)) })
  ] });
}
const brainGraphDemo = {
  center: { label: "INAI онлайн орчин" },
  notes: ["Судалгаа", "Батлагдсан код", "Figma дизайн", "Вэб дизайн", "Social пост", "Brand kit", "Newsletter"].map((label) => ({ label })),
  extra: 56,
  seed: 11
};
function pickNoteNodes(net, count) {
  const ring = net.nodes.map((n, i) => ({ i, dx: n.graph[0] - 0.5, dy: n.graph[1] - 0.5 })).filter((v) => v.i > 0).map((v) => ({ ...v, r: Math.hypot(v.dx / 1.2, v.dy), a: Math.atan2(v.dy, v.dx) })).filter((v) => v.r > 0.14 && v.r < 0.34);
  const out = [];
  for (let k = 0; k < count; k++) {
    const target = -Math.PI + (k + 0.5) * 2 * Math.PI / count;
    const best = ring.filter((v) => !out.includes(v.i)).sort((a, b) => Math.abs(Math.atan2(Math.sin(a.a - target), Math.cos(a.a - target))) - Math.abs(Math.atan2(Math.sin(b.a - target), Math.cos(b.a - target))))[0];
    if (best) out.push(best.i);
  }
  return out;
}
const paraNetGroups = [
  { label: "Төсөл", shape: "circle", color: "--ts-electric" },
  { label: "Хүрээ", shape: "square", color: "--ts-fg" },
  { label: "Нөөц", shape: "triangle", color: "--ts-amber" },
  { label: "Архив", shape: "diamond", color: "--ts-green" }
];
function convergeStagesLayout(n, seed, groups = 4) {
  let s = Math.max(1, Math.floor(seed)) % 2147483647;
  const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
  const G = Math.max(1, groups);
  const nodes = [];
  for (let i = 0; i < n; i++) {
    const g = i % G, side = Math.floor(rnd() * 4), e = rnd();
    const from = side === 0 ? [e, -0.1] : side === 1 ? [1.1, e] : side === 2 ? [e, 1.1] : [-0.1, e];
    const a = rnd() * 6.283, r = 0.08 + Math.pow(rnd(), 0.7) * 0.3;
    const graph = i === 0 ? [0.5, 0.5] : [0.5 + Math.cos(a) * r * 1.2, 0.5 + Math.sin(a) * r];
    const ga = g * 2 * Math.PI / G + Math.PI / 4, gc = [0.5 + Math.cos(ga) * 0.22, 0.5 + Math.sin(ga) * 0.2];
    const cl = i === 0 ? [0.5, 0.5] : [gc[0] + (rnd() - 0.5) * 0.14, gc[1] + (rnd() - 0.5) * 0.16];
    const th = Math.acos(1 - 2 * ((i + 0.5) / n)), ph = i * 2.39996;
    nodes.push({ g, from, graph, cl, sph: [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)], d: rnd() * 0.3, z: 0 });
  }
  const links = [];
  for (let i = 1; i < n; i++) {
    links.push([0, i]);
    const j = 1 + Math.floor(rnd() * (n - 1));
    if (j !== i && i % 3 === 0) links.push([i, j]);
  }
  return { nodes, links };
}
const ease$1 = (t) => {
  t = Math.min(Math.max(t, 0), 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
function shape(x, px, py, s, r) {
  x.beginPath();
  if (s === "circle") x.arc(px, py, r, 0, 7);
  else if (s === "square") x.rect(px - r, py - r, 2 * r, 2 * r);
  else if (s === "triangle") {
    x.moveTo(px, py - r * 1.2);
    x.lineTo(px + r * 1.1, py + r * 0.8);
    x.lineTo(px - r * 1.1, py + r * 0.8);
    x.closePath();
  } else {
    x.moveTo(px, py - r * 1.3);
    x.lineTo(px + r * 1.3, py);
    x.lineTo(px, py + r * 1.3);
    x.lineTo(px - r * 1.3, py);
    x.closePath();
  }
}
function drawConvergeStages(x, W, H, t, net, groups, colors, accent, ink) {
  const { nodes, links } = net;
  x.clearRect(0, 0, W, H);
  const rot = t * 0.9, sc = Math.min(W, H) * 0.36;
  const k2 = ease$1(t - 1), k3 = ease$1(t - 2), k4 = ease$1(t - 3);
  const col = (g) => colors[g % colors.length] ?? accent;
  const shp = (g) => groups[g % groups.length]?.shape ?? "circle";
  const pos = nodes.map((n) => {
    let p = lerp(n.from, n.graph, ease$1((t - n.d) / 0.8));
    if (t > 1.6) p = lerp(p, n.cl, k3);
    if (t > 2.6) {
      const [sx, sy, sz] = n.sph;
      const cx = sx * Math.cos(rot) + sz * Math.sin(rot), cz = -sx * Math.sin(rot) + sz * Math.cos(rot);
      p = lerp(p, [0.5 + cx * sc / W, 0.5 + sy * sc / H], k4);
      n.z = cz;
    } else n.z = 0;
    return [p[0] * W, p[1] * H];
  });
  if (k4 > 0) {
    x.strokeStyle = ink;
    x.globalAlpha = 0.55 * k4;
    x.lineWidth = 1.2;
    x.setLineDash([6, 6]);
    x.beginPath();
    x.moveTo(W / 2, H / 2 - sc * 1.25 * k4);
    x.lineTo(W / 2, H / 2 + sc * 1.25 * k4);
    x.stroke();
    x.setLineDash([]);
    x.globalAlpha = 0.18 * k4;
    x.beginPath();
    x.ellipse(W / 2, H / 2, sc, sc * 0.28, 0, 0, 7);
    x.stroke();
    x.globalAlpha = 1;
  }
  x.lineWidth = 1;
  links.forEach(([a, b]) => {
    if (a === 0 && t > 2.6) return;
    let al = 0.45 * k2 * (t < 2.6 ? 1 : 1 - k4 * 0.6);
    if (t > 1.6 && (nodes[a].g !== nodes[b].g || a === 0)) al *= 1 - k3;
    if (al <= 0.01) return;
    x.strokeStyle = t > 1.8 && a !== 0 ? col(nodes[a].g) : accent;
    x.globalAlpha = al;
    x.beginPath();
    x.moveTo(...pos[a]);
    x.lineTo(...pos[b]);
    x.stroke();
  });
  if (k4 > 0) {
    for (let i = 1; i < nodes.length; i++) for (const j of [i + 1, i + 8]) if (j < nodes.length) {
      x.strokeStyle = col(nodes[i].g);
      x.globalAlpha = 0.28 * k4 * (0.5 + 0.25 * (nodes[i].z + 1));
      x.beginPath();
      x.moveTo(...pos[i]);
      x.lineTo(...pos[j]);
      x.stroke();
    }
  }
  x.globalAlpha = 1;
  if (t < 1.2) nodes.forEach((n, i) => {
    const k = ease$1((t - n.d) / 0.8);
    if (k <= 0 || k >= 1) return;
    x.strokeStyle = accent;
    x.globalAlpha = 0.3 * (1 - k);
    x.beginPath();
    x.moveTo(n.from[0] * W, n.from[1] * H);
    x.lineTo(...pos[i]);
    x.stroke();
    x.globalAlpha = 1;
  });
  nodes.map((n, i) => [n, i]).sort((a, b) => a[0].z - b[0].z).forEach(([n, i]) => {
    const [px, py] = pos[i];
    const depth = 0.55 + 0.45 * (n.z + 1) / 2;
    const r = i === 0 && t < 2.6 ? 7 * k2 + 3 : 3.2 * (t > 2.6 ? depth : 1);
    x.globalAlpha = t > 2.6 ? depth : 1;
    x.fillStyle = k3 > 0.5 ? col(n.g) : accent;
    shape(x, px, py, k3 > 0.5 ? shp(n.g) : "circle", r);
    x.fill();
    x.globalAlpha = 1;
    if (i === 0 && k2 > 0 && t < 2.6) {
      x.strokeStyle = accent;
      x.globalAlpha = 0.3 * k2;
      x.beginPath();
      x.arc(px, py, 18, 0, 7);
      x.stroke();
      x.globalAlpha = 1;
    }
  });
}
function convergeNetLayout(n, seed) {
  let s = Math.max(1, Math.floor(seed)) % 2147483647;
  const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
  const nodes = [];
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, r = Math.pow(rnd(), 0.6) * 0.36;
    const side = Math.floor(rnd() * 4), e = rnd();
    const from = side === 0 ? [e, -0.08] : side === 1 ? [1.08, e] : side === 2 ? [e, 1.08] : [-0.08, e];
    nodes.push({ to: [0.5 + Math.cos(a) * r * 1.25, 0.5 + Math.sin(a) * r], from, d: rnd() * 0.35, sz: 1.6 + rnd() * 2.6 });
  }
  const links = [];
  for (let i = 0; i < n; i++) {
    const near = nodes.map((m, j) => [j, Math.hypot(m.to[0] - nodes[i].to[0], (m.to[1] - nodes[i].to[1]) * 0.8)]).filter((v) => v[0] !== i).sort((a, b) => a[1] - b[1]);
    for (const [j] of near.slice(0, 3)) if (!links.some((l) => l[0] === j && l[1] === i)) links.push([i, j, rnd() * 0.25]);
  }
  return { nodes, links };
}
const ease = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
function drawConvergeNet(x, W, H, t, net, fg) {
  const { nodes, links } = net;
  x.clearRect(0, 0, W, H);
  const pos = nodes.map((n) => {
    const k = ease((t - n.d) / 0.45);
    return [(n.from[0] + (n.to[0] - n.from[0]) * k) * W, (n.from[1] + (n.to[1] - n.from[1]) * k) * H, k];
  });
  x.fillStyle = fg;
  x.strokeStyle = fg;
  x.lineWidth = 1;
  nodes.forEach((n, i) => {
    const [px, py, k] = pos[i];
    if (k <= 0 || k >= 1) return;
    x.globalAlpha = 0.35 * (1 - k);
    x.beginPath();
    x.moveTo(n.from[0] * W, n.from[1] * H);
    x.lineTo(px, py);
    x.stroke();
  });
  x.lineWidth = 1.2;
  links.forEach(([i, j, dl]) => {
    const k = ease((Math.min(pos[i][2], pos[j][2]) - 0.85 - dl * 0.4) / 0.15);
    if (k <= 0) return;
    const [ax, ay] = pos[i], [bx, by] = pos[j];
    x.globalAlpha = 0.55 * k;
    x.beginPath();
    x.moveTo(ax, ay);
    x.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k);
    x.stroke();
  });
  nodes.forEach((n, i) => {
    const [px, py, k] = pos[i];
    if (k <= 0) return;
    x.globalAlpha = 0.4 + 0.6 * k;
    x.beginPath();
    x.arc(px, py, n.sz * (k >= 1 ? 1.15 : 1), 0, 7);
    x.fill();
    if (k >= 1 && i % 7 === 0) {
      x.globalAlpha = 0.25;
      x.beginPath();
      x.arc(px, py, n.sz + 6, 0, 7);
      x.stroke();
    }
  });
  x.globalAlpha = 1;
}
function ConvergeNet(props) {
  if (props.interactive && props.center && props.notes?.length)
    return /* @__PURE__ */ jsx(BrainGraph, { center: props.center, notes: props.notes, seed: props.seed, label: props.label, className: props.className, style: props.style });
  return /* @__PURE__ */ jsx(ConvergeNetCanvas, { ...props });
}
function ConvergeNetCanvas({ stage, center, notes, groups = paraNetGroups, nodes = 72, seed = 7, tone = "electric", play = "loop", duration = 6e3, t, label = "Мэдээллийн урсгал захаас орж ирж, цэгүүд нэг сүлжээ болно", className = "", style }) {
  const ref = React.useRef(null);
  const net = React.useMemo(() => convergeNetLayout(nodes, seed), [nodes, seed]);
  const net4 = React.useMemo(() => stage === void 0 ? null : convergeStagesLayout(nodes, seed, groups.length), [stage === void 0, nodes, seed, groups.length]);
  React.useEffect(() => {
    if (!net4) return;
    const cv = ref.current;
    const x = cv?.getContext?.("2d");
    if (!cv || !x) return;
    const cs = getComputedStyle(cv);
    const tok = (n) => cs.getPropertyValue(n).trim() || cs.color;
    const colors = groups.map((g) => tok(g.color));
    const accent = cs.color, ink = tok("--ts-fg");
    let W = 0, H = 0, raf = 0;
    const size = () => {
      const D = window.devicePixelRatio || 1;
      const w = cv.clientWidth, h = cv.clientHeight;
      if (w === W && h === H) return;
      W = w;
      H = h;
      cv.width = Math.max(1, W * D);
      cv.height = Math.max(1, H * D);
      x.setTransform(D, 0, 0, D, 0, 0);
    };
    const draw = (tt) => drawConvergeStages(x, W, H, tt, net4, groups, colors, accent, ink);
    size();
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = typeof stage === "number" ? Math.min(Math.max(stage, 0), 4) : reduce ? 4 : void 0;
    const scrollT = () => {
      const r = cv.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      return Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1) * 4;
    };
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => {
      size();
      draw(still ?? (stage === "scroll" ? scrollT() : 4));
    }) : null;
    ro?.observe(cv);
    let onScroll = null;
    if (still !== void 0) draw(still);
    else if (stage === "scroll") {
      onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => draw(scrollT()));
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      draw(scrollT());
    } else {
      const T0 = performance.now();
      const loop = (now) => {
        draw(Math.min((now - T0) / duration * 5 % 5, 4));
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      if (onScroll) window.removeEventListener("scroll", onScroll);
    };
  }, [net4, stage, groups, duration, tone]);
  React.useEffect(() => {
    if (net4) return;
    const cv = ref.current;
    const x = cv?.getContext?.("2d");
    if (!cv || !x) return;
    const fg = getComputedStyle(cv).color || "white";
    let W = 0, H = 0, raf = 0;
    const size = () => {
      const D = window.devicePixelRatio || 1;
      const w = cv.clientWidth, h = cv.clientHeight;
      if (w === W && h === H) return;
      W = w;
      H = h;
      cv.width = Math.max(1, W * D);
      cv.height = Math.max(1, H * D);
      x.setTransform(D, 0, 0, D, 0, 0);
    };
    size();
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still = t !== void 0 ? t : play === "static" || reduce ? 1.4 : void 0;
    const draw = (tt) => drawConvergeNet(x, W, H, tt, net, fg);
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => {
      size();
      if (still !== void 0) draw(still);
    }) : null;
    ro?.observe(cv);
    if (still !== void 0) draw(still);
    else {
      const T0 = performance.now();
      const loop = (now) => {
        const p = (now - T0) / duration;
        const tt = play === "once" ? Math.min(p * 1.4, 1.4) : p % 1.25 * 1.4;
        draw(tt);
        if (play === "loop" || p * 1.4 < 1.4) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [net, net4, tone, play, duration, t]);
  const color = tone === "cream" ? "var(--ts-electric,#1b5cff)" : "var(--ts-on-electric,#fff)";
  const bg = tone === "cream" ? "var(--ts-page,#f0ede4)" : "var(--ts-electric,#1b5cff)";
  const labelled = net4 && typeof stage === "number" && stage >= 1.5 && stage <= 2 && (center || notes?.length);
  const picks = React.useMemo(() => labelled && net4 ? pickNoteNodes(net4, notes?.length ?? 0) : [], [labelled, net4, notes?.length]);
  const canvas = /* @__PURE__ */ jsx(
    "canvas",
    {
      ref,
      role: "img",
      "aria-label": label,
      "data-tone": tone,
      "data-stage": stage === void 0 ? void 0 : String(stage),
      className: `ts-converge-net ${className}`,
      style: { display: "block", width: "100%", height: "100%", minHeight: 240, aspectRatio: "16 / 9", color, background: bg, ...labelled ? {} : style }
    }
  );
  if (!labelled || !net4) return canvas;
  const at = (i) => ({ left: `${net4.nodes[i].graph[0] * 100}%`, top: `${net4.nodes[i].graph[1] * 100}%` });
  const side = (x) => x < 0.25 ? "r" : x < 0.5 ? "l" : x > 0.75 ? "l" : "r";
  const tag = (n, i, key, main = false) => {
    const body = /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("i", { "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("b", { children: n.label }),
      (n.preview || !main) && /* @__PURE__ */ jsxs("span", { role: "tooltip", children: [
        /* @__PURE__ */ jsx("em", { children: n.label }),
        n.preview
      ] })
    ] });
    return /* @__PURE__ */ jsx("li", { className: `cnl-n${main ? " is-center" : ""}`, style: at(i), "data-side": side(net4.nodes[i].graph[0]), "data-half": net4.nodes[i].graph[0] < 0.5 ? "l" : "r", children: n.href ? /* @__PURE__ */ jsx("a", { href: n.href, children: body }) : /* @__PURE__ */ jsx("span", { tabIndex: 0, children: body }) }, key);
  };
  return /* @__PURE__ */ jsxs("div", { className: `cnl ${className}`, "data-tone": tone, style: { position: "relative", ...style }, children: [
    /* @__PURE__ */ jsx("style", { children: CNL_CSS }),
    canvas,
    /* @__PURE__ */ jsxs("ul", { "aria-label": label, children: [
      center && tag(center, 0, "c", true),
      notes?.map((n, k) => picks[k] !== void 0 && tag(n, picks[k], `n${k}`))
    ] })
  ] });
}
const CNL_CSS = `
.cnl{container-type:inline-size}
.cnl ul{list-style:none;margin:0;padding:0;position:absolute;inset:0;pointer-events:none}
.cnl-n{position:absolute;transform:translate(-5px,-50%);pointer-events:auto}
.cnl-n[data-side=l]{transform:translate(calc(-100% + 5px),-50%)}
.cnl-n>a,.cnl-n>span{position:relative;display:flex;align-items:center;gap:8px;min-height:32px;padding:0 6px;border-radius:var(--ts-radius,6px);color:var(--ts-fg);text-decoration:none;font:500 13px/1.2 var(--ts-font,Inter,system-ui,sans-serif);outline:none}
.cnl-n[data-side=l]>a,.cnl-n[data-side=l]>span{flex-direction:row-reverse}
.cnl-n i{width:10px;height:10px;border-radius:50%;background:var(--ts-electric);box-shadow:0 0 0 3px var(--ts-page);flex:none;transition:transform .15s}
.cnl-n b{font-weight:500;white-space:nowrap;background:color-mix(in srgb,var(--ts-page) 86%,transparent);padding:2px 4px;border-radius:4px}
.cnl-n.is-center{transform:translate(-50%,-50%)}.cnl-n.is-center>*{flex-direction:column;gap:6px}
.cnl-n.is-center i{width:18px;height:18px}.cnl-n.is-center b{font-weight:600;font-size:14px}
.cnl-n>*:hover i,.cnl-n>*:focus-visible i{transform:scale(1.5)}
.cnl-n>*:hover b,.cnl-n>*:focus-visible b{color:var(--ts-electric-fg,var(--ts-electric))}
.cnl-n>*:focus-visible{box-shadow:0 0 0 2px var(--ts-electric)}
.cnl-n [role=tooltip]{position:absolute;top:calc(100% + 6px);left:0;z-index:2;width:220px;padding:10px 12px;border:1px solid var(--ts-line);border-radius:var(--ts-radius,6px);background:var(--ts-surface);color:var(--ts-muted);font-weight:400;font-size:12px;line-height:1.45;white-space:normal;box-shadow:var(--ts-elevation);opacity:0;visibility:hidden;transform:translateY(-4px);transition:opacity .15s,transform .15s,visibility .15s}
.cnl-n[data-half=r] [role=tooltip]{left:auto;right:0}
.cnl-n [role=tooltip] em{display:none;font-style:normal;font-weight:600;color:var(--ts-fg);margin-bottom:2px}
.cnl-n>*:hover [role=tooltip],.cnl-n>*:focus-visible [role=tooltip]{opacity:1;visibility:visible;transform:none}
@container (max-width:560px){.cnl-n:not(.is-center) b{display:none}.cnl-n [role=tooltip] em{display:block}.cnl-n [role=tooltip]{width:46cqw}}
@media (prefers-reduced-motion:reduce){.cnl-n i,.cnl-n [role=tooltip]{transition:none}}
`;
const convergeNetStagesDemo = { stage: "loop", nodes: 64, seed: 11, tone: "cream", duration: 12e3, label: "Мэдээлэл захаас орж ирж, нэг note-ийн эргэн тойронд сүлжээ болж, PARA-гийн дөрвөн бүлэгт хуваагдан, тэнхлэгээ тойрон эргэх бөмбөрцөг болно" };
const convergeNetGraphDemo = {
  stage: 2,
  nodes: 64,
  seed: 11,
  tone: "cream",
  label: "Нэг тэмдэглэлийн эргэн тойронд холбогдсон тэмдэглэлүүд",
  center: { label: "Үнийн бодлого" },
  notes: [
    { label: "Багийн уулзалт · 10-р сар", preview: "Үнийн хоёр хувилбарыг харьцуулав." },
    { label: "#sales хэлэлцүүлэг", preview: "Зардал өссөнийг санхүүгийн баг мэдэгдэв." },
    { label: "Зардлын тайлан", preview: "Түүхий эдийн үнэ 12% өсөв." },
    { label: "Харилцагчийн санал", preview: "Дунд багцыг тодорхой болгохыг хүссэн." },
    { label: "Өрсөлдөгчийн үнэ", preview: "Гурван өрсөлдөгчийн үнийг харьцуулав." },
    { label: "Санхүүгийн зорилт", preview: "Сарын давтагдах орлого +8%." },
    { label: "Үнийн хуудас", preview: "Сайтын үнийн хуудсыг 11/26-нд шинэчилнэ." }
  ]
};
const convergeNetDemo = { nodes: 72, seed: 7, tone: "electric", play: "loop", duration: 6e3 };
export {
  BrainGraph as B,
  ConvergeNet as C,
  brainGraphLayout as a,
  brainGraphDemo as b,
  convergeNetDemo as c,
  convergeNetGraphDemo as d,
  convergeNetLayout as e,
  convergeNetStagesDemo as f,
  convergeStagesLayout as g,
  drawConvergeNet as h,
  drawConvergeStages as i,
  pickNoteNodes as j,
  paraNetGroups as p
};
//# sourceMappingURL=converge-net-SmvbTHbg.js.map
