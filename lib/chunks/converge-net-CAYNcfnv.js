import { jsx } from "react/jsx-runtime";
import * as React from "react";
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
function ConvergeNet({ stage, groups = paraNetGroups, nodes = 72, seed = 7, tone = "electric", play = "loop", duration = 6e3, t, label = "Мэдээллийн урсгал захаас орж ирж, цэгүүд нэг сүлжээ болно", className = "", style }) {
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
      W = cv.clientWidth;
      H = cv.clientHeight;
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
      W = cv.clientWidth;
      H = cv.clientHeight;
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
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref,
      role: "img",
      "aria-label": label,
      "data-tone": tone,
      "data-stage": stage === void 0 ? void 0 : String(stage),
      className: `ts-converge-net ${className}`,
      style: { display: "block", width: "100%", height: "100%", minHeight: 240, color, background: bg, ...style }
    }
  );
}
const convergeNetStagesDemo = { stage: "loop", nodes: 64, seed: 11, tone: "cream", duration: 12e3, label: "Мэдээлэл захаас орж ирж, нэг note-ийн эргэн тойронд сүлжээ болж, PARA-гийн дөрвөн бүлэгт хуваагдан, тэнхлэгээ тойрон эргэх бөмбөрцөг болно" };
const convergeNetDemo = { nodes: 72, seed: 7, tone: "electric", play: "loop", duration: 6e3 };
export {
  ConvergeNet as C,
  convergeNetLayout as a,
  convergeNetStagesDemo as b,
  convergeNetDemo as c,
  convergeStagesLayout as d,
  drawConvergeNet as e,
  drawConvergeStages as f,
  paraNetGroups as p
};
//# sourceMappingURL=converge-net-CAYNcfnv.js.map
