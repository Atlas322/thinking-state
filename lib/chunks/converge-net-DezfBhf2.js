import { jsx } from "react/jsx-runtime";
import * as React from "react";
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
function ConvergeNet({ nodes = 72, seed = 7, tone = "electric", play = "loop", duration = 6e3, t, label = "Мэдээллийн урсгал захаас орж ирж, цэгүүд нэг сүлжээ болно", className = "", style }) {
  const ref = React.useRef(null);
  const net = React.useMemo(() => convergeNetLayout(nodes, seed), [nodes, seed]);
  React.useEffect(() => {
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
  }, [net, tone, play, duration, t]);
  const color = tone === "cream" ? "var(--ts-electric,#1b5cff)" : "var(--ts-on-electric,#fff)";
  const bg = tone === "cream" ? "var(--ts-page,#f0ede4)" : "var(--ts-electric,#1b5cff)";
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref,
      role: "img",
      "aria-label": label,
      "data-tone": tone,
      className: `ts-converge-net ${className}`,
      style: { display: "block", width: "100%", height: "100%", minHeight: 240, color, background: bg, ...style }
    }
  );
}
const convergeNetDemo = { nodes: 72, seed: 7, tone: "electric", play: "loop", duration: 6e3 };
export {
  ConvergeNet as C,
  convergeNetLayout as a,
  convergeNetDemo as c,
  drawConvergeNet as d
};
//# sourceMappingURL=converge-net-DezfBhf2.js.map
