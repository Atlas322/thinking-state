/* Ported into @inai/thinking-state (screens.21) from site-recipes motifs/brain-cover.tsx (af9f74a): labels
   now use placeBrainLabels (≥16px, tested); colours from tokens. The site imports it from the library.
 site-recipes: inai-sh v3-faq-47e470 @80cfc29 src/components/brain-cover.tsx-ээс хуулав.
   Өөрчлөлт: props {tone: deep|ink|white (v19 hero: Electric дээр цагаан), canvasOnly, runKey, still} — ink = цөцгий хуудсанд бэх өнгөтэй цэг (энгийн alpha холилт);
   runKey солигдоход тоосноос дахин цуглана (манифестын 5-р шат).
   v2 (Creative, 2026-11-17, эзэн «тархины зураглалыг сайжруул, мэдээлэл dot A→B аялна»):
   - Зураглал: хоёр хагасын завсар (longitudinal fissure), төв ба Сильвийн ховил, хоёр давхар нугалаа,
     гүний opacity/хэмжээ, хүрээний гэрэл (rim) — үүл биш, тархи гэж танигдана.
   - Сүлжээ: тодорхой node, edge (гадаргуугийн дээгүүр нумарсан зам); pulse A→B замаар сүүлтэй аялж,
     очсон node гэрэлтэнэ. Санамсаргүй оч биш — маршрут (BFS) дагуу дамжина.
   - API: sources=[{id,label}], api(handle) → pulse(from, to|Element), anchor(id), ids(), light(id).
     Мөн canvas дээр 'brain:ready' event (detail = handle), хэсэгт 'brain:pulse' {from,to} event сонсоно.
   v02 (QA 2-р давталт): ~30px сүүлтэй pulse, маршрут бүхэлдээ гэрэлтэнэ, эх сурвалжийн node том + шошго (sources[].label → DOM),
   дээрээс харах өнцөг (хагас, завсар тодорно), өргөн ховил, иш, node хүрээндээ.
   Шинэ сан нэмээгүй: raw WebGL хэвээр. */
import { useEffect, useRef } from "react";
import { placeBrainLabels } from "./brain-labels";

type V3 = [number, number, number];

export type BrainSource = { id: string; label?: string };
export type BrainAnchor = { x: number; y: number; z: number; visible: boolean };
export type BrainApi = {
  /** A→B: pulse travels node to node along the network (multi-hop). `to` may be a DOM element: the pulse leaves the brain toward it. */
  pulse(from: string, to: string | Element, opts?: { ms?: number }): Promise<void>;
  /** Viewport (client) position of a node, updated every frame — for HTML labels or an SVG line that continues outside the canvas. */
  anchor(id: string): BrainAnchor | null;
  /** Node ids: "hub", the source ids, "n0".."nN". */
  ids(): string[];
  /** Light a node (0..1); sources hold their light, plain nodes fade. */
  light(id: string, v?: number): void;
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function unit(r: () => number): V3 {
  const g = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
  const x = g(), y = g(), z = g();
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

/* Gyri: a ridged field, two scales — large folds that read from afar, fine ones up close. */
function folds(x: number, y: number, z: number, f: number) {
  const a = Math.sin(x * f + Math.sin(y * f * 0.8) * 1.7);
  const b = Math.sin(y * f * 0.9 + Math.sin(z * f * 0.7) * 1.7);
  const c = Math.sin(z * f * 0.8 + Math.sin(x * f * 0.9) * 1.7);
  return Math.abs(a + b + c) / 3; // 0 = groove, 1 = ridge
}

type Part = { c: V3; r: V3; w: number; f: number; keep?: (d: V3, p: V3) => boolean; stripes?: boolean; cortex?: boolean };

/* Points + their outward normal (for depth and rim light). */
function brainPoints(n: number, r: () => number): { p: V3; n: V3; g: number }[] {
  const parts: Part[] = [];
  for (const s of [-1, 1]) {
    parts.push({
      c: [0.38 * s, 0.08, 0],
      r: [0.4, 0.62, 0.98],
      w: 0.36,
      f: 5.6,
      cortex: true,
      keep: (d, q) =>
        !(d[0] * s < -0.5 && r() > 0.12) && // the medial wall is all but empty
        !(q[1] < -0.12 && q[2] > -0.3 && d[0] * s > 0.15),
    });
    parts.push({ c: [0.44 * s, -0.33, 0.2], r: [0.3, 0.22, 0.5], w: 0.065, f: 10, keep: (d) => d[1] < 0.35 });
    parts.push({ c: [0.2 * s, -0.5, -0.62], r: [0.27, 0.19, 0.27], w: 0.06, f: 0, stripes: true });
  }
  const out: { p: V3; n: V3; g: number }[] = [];
  const stem = Math.round(n * 0.035);
  const W = parts.reduce((a, p) => a + p.w, 0);
  while (out.length < n - stem) {
    const pick = r() * W;
    let acc = 0;
    let p = parts[0];
    for (const q of parts) {
      acc += q.w;
      if (pick <= acc) { p = q; break; }
    }
    const d = unit(r);
    let x = p.c[0] + d[0] * p.r[0];
    let y = p.c[1] + d[1] * p.r[1];
    let z = p.c[2] + d[2] * p.r[2];
    if (p.keep && !p.keep(d, [x, y, z])) continue;
    // longitudinal fissure: an open gap between the hemispheres
    if (p.cortex && Math.abs(x) < 0.085 && y > -0.25) continue;
    // central sulcus and the parieto-occipital line: named landmarks the eye uses to read "brain"
    if (p.cortex && y > 0.0) {
      const cs = z - (0.08 - 0.32 * (y - 0.3)) + 0.06 * Math.sin(y * 9);
      if (Math.abs(cs) < 0.03) continue;
      const po = z + 0.62 - 0.18 * y;
      if (Math.abs(po) < 0.018 && y > 0.15) continue;
    }
    let ridge: number;
    if (p.stripes) ridge = Math.abs(Math.sin((y * 0.8 - z * 0.6) * 46));
    else ridge = 0.62 * folds(x, y, z, p.f) + 0.38 * folds(x + 3.1, y, z, p.f * 1.9);
    // sulci: an empty, sharp-edged line where the field falls low
    const keepP = p.stripes ? ridge : Math.min(1, Math.max(0, (ridge - 0.21) / 0.12));
    if (r() > keepP) continue;
    const sink = (1 - Math.min(1, ridge * 2)) * 0.05;
    x -= d[0] * sink;
    y -= d[1] * sink;
    z -= d[2] * sink;
    if (y < -0.34 && p.cortex) y = -0.34 + (y + 0.34) * 0.35; // flat base
    const j = (r() - 0.5) * 0.016;
    // normal of the ellipsoid
    const nx = d[0] / p.r[0], ny = d[1] / p.r[1], nz = d[2] / p.r[2];
    const nl = Math.hypot(nx, ny, nz) || 1;
    out.push({ p: [x + d[0] * j, y + d[1] * j, z + d[2] * j], n: [nx / nl, ny / nl, nz / nl], g: p.stripes ? 0.7 : Math.min(1, (ridge - 0.14) / 0.3) });
  }
  for (let i = 0; i < stem; i++) {
    const t = r();
    const a = r() * Math.PI * 2;
    const rad = 0.1 * (1 - 0.25 * t);
    out.push({ p: [Math.cos(a) * rad, -0.4 - t * 0.78, -0.22 + t * 0.12 + Math.sin(a) * rad], n: [Math.cos(a), 0, Math.sin(a)], g: 0.5 });
  }
  return out;
}

/* ---------- the network: named nodes, arched edges ---------- */
const d2 = (a: V3, b: V3) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

function pickNodes(pts: V3[], n: number, r: () => number): V3[] {
  const cand: V3[] = [];
  const step = Math.max(1, Math.floor(pts.length / 2600));
  for (let i = 0; i < pts.length; i += step) {
    const p = pts[i];
    if (p[1] > -0.28 && p[2] > -0.85 && p[2] < 0.85 && p[0] < -0.2) cand.push(p);
  }
  const out: V3[] = [cand[Math.floor(r() * cand.length)]];
  const dmin = cand.map((c) => d2(c, out[0]));
  while (out.length < n) {
    let bi = 0;
    for (let i = 1; i < cand.length; i++) if (dmin[i] > dmin[bi]) bi = i;
    const p = cand[bi];
    out.push(p);
    for (let i = 0; i < cand.length; i++) dmin[i] = Math.min(dmin[i], d2(cand[i], p));
  }
  // lift a hair off the cortex so the nodes sit on top of it
  return out.map((p) => [p[0] * 1.015, p[1] * 1.015, p[2] * 1.015]);
}

type Edge = { a: number; b: number; m: V3; len: number; glow: number; hold: number };

function buildEdges(nodes: V3[]): Edge[] {
  const seen = new Set<string>();
  const E: Edge[] = [];
  const add = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(k) || a === b) return;
    seen.add(k);
    const A = nodes[a], B = nodes[b];
    const mid: V3 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2];
    const len = Math.sqrt(d2(A, B));
    // arc over the surface, not through it; a mid point near the centre bends upward (over the fissure)
    const ml = Math.hypot(...mid);
    const dir: V3 = ml > 0.35 ? [mid[0] / ml, mid[1] / ml, mid[2] / ml] : [0, 1, 0];
    const lift = Math.max(ml, 0.62) - ml + 0.025 + 0.12 * len;
    const m: V3 = [mid[0] + dir[0] * lift, mid[1] + dir[1] * lift, mid[2] + dir[2] * lift];
    E.push({ a, b, m, len: len * 1.15, glow: 0, hold: 0 });
  };
  nodes.forEach((A, i) => {
    nodes
      .map((B, j) => [j, d2(A, B)] as const)
      .filter(([j, d]) => j !== i && d < 0.3 && Math.sign(nodes[j][0]) === Math.sign(A[0]))
      .sort((x, y) => x[1] - y[1])
      .slice(0, 3)
      .forEach(([j]) => add(i, j));
  });
  // join the islands so every node can reach every other
  const comp = () => {
    const c = new Array(nodes.length).fill(-1);
    let k = 0;
    for (let s = 0; s < nodes.length; s++) {
      if (c[s] >= 0) continue;
      const q = [s];
      c[s] = k;
      while (q.length) {
        const v = q.pop()!;
        for (const e of E) {
          const w = e.a === v ? e.b : e.b === v ? e.a : -1;
          if (w >= 0 && c[w] < 0) { c[w] = k; q.push(w); }
        }
      }
      k++;
    }
    return { c, k };
  };
  for (let guard = 0; guard < 40; guard++) {
    const { c, k } = comp();
    if (k <= 1) break;
    let best = [0, 0, 1e9];
    for (let i = 0; i < nodes.length; i++) for (let j = 0; j < nodes.length; j++)
      if (c[i] === 0 && c[j] !== 0) { const d = d2(nodes[i], nodes[j]); if (d < best[2]) best = [i, j, d]; }
    add(best[0], best[1]);
  }
  return E;
}

const bez = (a: V3, m: V3, b: V3, u: number): V3 => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * u * v * m[0] + u * u * b[0], v * v * a[1] + 2 * u * v * m[1] + u * u * b[1], v * v * a[2] + 2 * u * v * m[2] + u * u * b[2]];
};

/* ---------- shaders ---------- */
const VIEW = `
uniform float uT; uniform float uA; uniform float uTilt; uniform float uAspect;
uniform float uPx; uniform vec2 uOff; uniform float uScale;
vec3 rot(vec3 q){
  float ca = cos(uA), sa = sin(uA);
  q = vec3(ca*q.x + sa*q.z, q.y, -sa*q.x + ca*q.z);
  float cb = cos(uTilt), sb = sin(uTilt);
  return vec3(q.x, cb*q.y - sb*q.z, sb*q.y + cb*q.z);
}
vec3 view(vec3 p){ return rot(p + p * (0.012 * sin(uT*1.1 + p.y*3.0))) * uScale; }
vec4 clipOf(vec3 q){ float z = 3.2 - q.z; vec2 xy = q.xy / z * 2.2; return vec4(xy.x / uAspect + uOff.x, xy.y + uOff.y, 0.0, 1.0); }
float depthOf(vec3 q){ return clamp((q.z / uScale + 1.0) * 0.5, 0.0, 1.0); }`;

const VERT = VIEW + `
attribute vec3 aT; attribute vec3 aS; attribute float aK; attribute vec3 aN; attribute float aR;
uniform vec2 uMouse; uniform float uHover;
varying float vB; varying float vK; varying float vM;
float ease(float x){ return 1.0 - pow(1.0 - x, 3.0); }
void main(){
  float delay = aK * 1.9;
  float e = ease(clamp((uT - 0.2 - delay) / 2.6, 0.0, 1.0));
  vec3 drift = vec3(sin(uT*0.6 + aK*40.0), cos(uT*0.5 + aK*23.0), sin(uT*0.55 + aK*17.0)) * 0.09 * (1.0 - e);
  vec3 q = view(mix(aS, aT, e) + drift);
  float z = 3.2 - q.z;
  vec4 c = clipOf(q);
  vec2 clip = c.xy;
  vec2 dm = clip - uMouse; dm.x *= uAspect;
  float m = exp(-dot(dm, dm) / 0.03) * uHover * e;
  float tw = 0.5 + 0.5*sin(uT*16.0 + aK*517.0);
  vec2 push = normalize(dm + 1e-4) * m * 0.04 * (0.5 + fract(aK*7.3));
  push.x /= uAspect;
  clip += push + vec2(sin(uT*9.0 + aK*91.0), cos(uT*8.0 + aK*67.0)) * 0.006 * m;
  gl_Position = vec4(clip, 0.0, 1.0);
  // depth: the far side is smaller and dimmer, so the volume reads; rim: the outline is lit
  float depth = mix(0.5, depthOf(q), e);
  float nz = rot(aN).z;
  float rim = mix(0.0, 1.0 - abs(nz), e);
  float face = mix(0.0, smoothstep(-0.2, 0.9, nz), e);
  float size = mix(1.0, 2.0, fract(aK*91.7)) * (0.6 + 0.6*depth) * mix(1.0, 0.75 + 0.4*aR, e);
  gl_PointSize = (size + m*tw*3.5) * uPx * (3.2 / max(z, 1.6));
  if (z < 1.2) gl_PointSize = 0.0; // dust right at the lens would read as a stray blob
  float wp = mod(uT*0.42, 3.8) - 1.9;
  float wd = (aT.x*0.85 + aT.y*0.5) - wp;
  float wave = exp(-wd*wd / 0.018) * e * step(aK, 0.999) * 0.5;
  vB = (0.3 + 0.7*e) * (0.2 + 0.8*pow(depth, 1.4)) * (0.75 + 0.6*rim + 0.15*face) * mix(1.0, 0.45 + 0.75*aR, e) + m*(0.5 + 1.8*tw) + wave*0.5;
  vK = aK;
  vM = m;
}`;

const FRAG = `
precision mediump float;
uniform float uInk;
varying float vB; varying float vK; varying float vM;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c);
  if (r2 > 0.25) discard;
  float a = exp(-r2 * 16.0);
  vec3 deep = vec3(0.16, 0.36, 1.0);
  vec3 pale = vec3(0.80, 0.87, 1.0);
  vec3 col = mix(deep, pale, 0.3 + 0.7*fract(vK*13.1));
  col = mix(col, vec3(1.0), clamp(vM, 0.0, 1.0) * 0.7);
  float k = a * vB * 0.8;
  if (uInk > 1.5) { float kw = clamp(k*2.1,0.0,1.0); gl_FragColor = vec4(vec3(1.0) * kw, kw); return; }
  if (uInk > 0.5) { vec3 ink = mix(vec3(0.08,0.08,0.07), vec3(0.106,0.361,1.0), step(0.97, fract(vK*53.3))); float ka = clamp(k*1.4,0.0,1.0); gl_FragColor = vec4(ink * ka, ka); return; }
  gl_FragColor = vec4(col * k, k);
}`;

/* edges: faint arcs, bright while a pulse runs on them */
const EDGE_VERT = VIEW + `
attribute vec3 aP; attribute float aG;
uniform float uNet;
varying float vA;
void main(){
  vec3 q = view(aP);
  gl_Position = clipOf(q);
  vA = uNet * (0.12 + 0.88*aG) * mix(0.3 + 0.7*depthOf(q), 1.0, aG);
}`;
const LINE_FRAG = `
precision mediump float;
uniform float uInk;
varying float vA;
void main(){
  vec3 col = uInk > 1.5 ? vec3(1.0) : uInk > 0.5 ? vec3(0.106,0.361,1.0) : vec3(0.62, 0.76, 1.0);
  gl_FragColor = vec4(col * vA, vA);
}`;

/* nodes (aKind: 0 plain, 1 hub, 2 source, 5 page, 6 message, 7 date) and pulse heads/tails (aKind 3) share one point program */
const NODE_VERT = VIEW + `
attribute vec3 aP; attribute float aKind; attribute float aG;
uniform float uNet;
varying float vA; varying float vHot; varying float vKind;
void main(){
  vKind = aKind;
  vec3 q = view(aP);
  gl_Position = clipOf(q);
  float z = 3.2 - q.z;
  float dep = 0.35 + 0.65*depthOf(q);
  float base = aKind > 4.5 ? 9.0 : aKind > 2.5 ? 0.0 : aKind > 1.5 ? 11.0 : aKind > 0.5 ? 6.0 : 2.6;
  float sz = (aKind > 2.5 && aKind < 4.5) ? (1.8 + 5.2*aG) : base + (aKind > 4.5 ? 2.0 : 6.0)*aG;
  gl_PointSize = sz * uPx * (3.2 / z);
  float a0 = aKind > 4.5 ? 0.6 : aKind > 2.5 ? aG : aKind > 1.5 ? 1.0 : aKind > 0.5 ? 0.85 : 0.42;
  vA = uNet * clamp(a0 + 0.9*aG, 0.0, 1.0) * dep;
  vHot = (aKind > 2.5 && aKind < 4.5) ? 1.0 : clamp(aG + (aKind > 1.5 ? 0.35 : 0.0), 0.0, 1.0);
}`;
const NODE_FRAG = `
precision mediump float;
uniform float uInk;
varying float vA; varying float vHot; varying float vKind;
float box(vec2 p, vec2 a, vec2 b){ return step(a.x,p.x)*step(p.x,b.x)*step(a.y,p.y)*step(p.y,b.y); }
float frame(vec2 p, vec2 a, vec2 b, float w){ return box(p,a,b) - box(p,a+w,b-w); }
void main(){
  vec2 c = gl_PointCoord - 0.5; float r2 = dot(c, c);
  vec2 g = gl_PointCoord;
  float k;
  if (vKind > 4.5) {
    // tiny data marks: a page (5), a message (6), a date (7) — line icons, not dots
    float m;
    if (vKind < 5.5) m = frame(g, vec2(0.22,0.08), vec2(0.78,0.92), 0.12) + box(g, vec2(0.34,0.36), vec2(0.66,0.44)) + box(g, vec2(0.34,0.56), vec2(0.6,0.64));
    else if (vKind < 6.5) m = frame(g, vec2(0.08,0.2), vec2(0.92,0.72), 0.12) + box(g, vec2(0.16,0.72), vec2(0.32,0.9));
    else m = frame(g, vec2(0.12,0.14), vec2(0.88,0.88), 0.11) + box(g, vec2(0.12,0.14), vec2(0.88,0.34)) + box(g, vec2(0.3,0.5), vec2(0.42,0.62)) + box(g, vec2(0.56,0.5), vec2(0.68,0.62));
    k = clamp(m, 0.0, 1.0) * vA;
  } else {
    if (r2 > 0.25) discard;
    float core = smoothstep(0.09, 0.05, r2);
    float halo = exp(-r2 * 7.0) * 0.45 * vHot;
    k = (core + halo) * vA;
  }
  vec3 col = uInk > 1.5 ? vec3(1.0) : uInk > 0.5 ? mix(vec3(0.08,0.08,0.07), vec3(0.106,0.361,1.0), vHot) : mix(vec3(0.72,0.82,1.0), vec3(1.0), vHot);
  k = clamp(k, 0.0, 1.0);
  gl_FragColor = vec4(col * k, k);
}`;

/* exits: screen-space line + pulse from a node to an element outside the brain */
const EXIT_VERT = `
attribute vec2 aC; attribute float aG;
uniform float uPx;
varying float vA; varying float vHot;
void main(){ gl_Position = vec4(aC, 0.0, 1.0); gl_PointSize = (1.6 + 4.4*aG) * uPx; vA = aG; vHot = 1.0; }`;
const EXIT_LINE_FRAG = `
precision mediump float;
uniform float uInk;
varying float vA; varying float vHot;
void main(){ vec3 col = uInk > 1.5 ? vec3(1.0) : uInk > 0.5 ? vec3(0.106,0.361,1.0) : vec3(0.75,0.85,1.0); float k = vA*0.85; gl_FragColor = vec4(col*k, k); }`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

const TRAIL = 22;

const BC_CSS = `
.bc{position:relative;height:min(36svh,340px);min-height:240px;overflow:hidden;color:var(--ts-on-electric);background:radial-gradient(120% 100% at 50% 0%,color-mix(in srgb,var(--ts-electric) 45%,var(--ts-fg)) 0%,var(--ts-fg) 100%)}
.bc p,.bc a,.bc span{color:inherit}
.bc .bc-kicker,.bc .bc-label{color:color-mix(in srgb,var(--ts-on-electric) 70%,var(--ts-electric))}
.bc-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.bc-top,.bc-bottom{position:absolute;z-index:1}
.bc-top{top:28px;left:clamp(16px,4vw,56px);right:clamp(16px,4vw,56px);display:flex;justify-content:space-between;align-items:baseline;font-size:13px;letter-spacing:.24em}
.bc-mark{font-weight:600}
.bc-bottom{left:clamp(16px,4vw,56px);bottom:clamp(20px,4vh,36px);max-width:min(92vw,760px);opacity:0;animation:bc-in var(--ts-motion-dur-xl,900ms) var(--ts-motion-ease-enter,ease) 2.4s forwards}
.bc-kicker{display:flex;align-items:center;gap:14px;margin:0;font-size:12px;letter-spacing:.28em}
.bc-rule{display:inline-block;width:40px;height:1px;background:currentColor}
.bc-word{margin:4px 0 0;font-size:clamp(64px,10vw,150px);line-height:.9;font-weight:300;letter-spacing:-.04em}
.bc-line{margin:14px 0 0;font-size:clamp(17px,1.6vw,22px)}
@keyframes bc-in{to{opacity:1}}
@media (prefers-reduced-motion:reduce){.bc-bottom{animation:none;opacity:1}}
`;

export function BrainCover({
  tone = "deep",
  canvasOnly = false,
  center = false,
  runKey = 0,
  still = false,
  sources = [],
  ambient = true,
  api,
}: {
  tone?: "deep" | "ink" | "white";
  canvasOnly?: boolean;
  /** true: the brain sits in the middle of the canvas (hero stage); false keeps the old right-hand offset on wide screens */
  center?: boolean;
  runKey?: number;
  still?: boolean;
  sources?: BrainSource[];
  /** background traffic between plain nodes; quiets for a few seconds after each pulse() call */
  ambient?: boolean;
  api?: (h: BrainApi | null) => void;
} = {}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef(api);
  apiRef.current = api;
  const srcKey = sources.map((s) => s.id).join("|");

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true });
    if (!gl) return;

    const reduce = still || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 760;
    const r = rng(20261113);
    const pts = brainPoints(small ? 9000 : 24000, r);
    const brain = pts.map((q) => q.p);
    const dust = small ? 500 : 1100;
    const total = brain.length + dust;

    const data = new Float32Array(total * 11);
    for (let i = 0; i < total; i++) {
      let t: V3, s: V3, nn: V3, g = 0.5;
      if (i < brain.length) {
        t = brain[i];
        nn = pts[i].n;
        g = pts[i].g;
        const d = unit(r);
        const rad = 1.6 + r() * 2.6;
        s = [d[0] * rad * 1.6, d[1] * rad, d[2] * rad - 0.5];
      } else {
        const d = unit(r);
        const rad = 2.2 + r() * 2.2;
        t = s = [d[0] * rad * 1.8, d[1] * rad, d[2] * rad - 1.2];
        nn = [0, 0, 1];
      }
      data.set([...t, ...s, r(), ...nn, g], i * 11);
    }

    /* ---- network ---- */
    const N = small ? 28 : 56;
    const nodes = pickNodes(brain, N, r);
    const edges = buildEdges(nodes);
    const kind = new Float32Array(N); // 0 plain, 1 hub, 2 source
    const glow = new Float32Array(N);
    const held = new Float32Array(N); // a floor the glow decays to (sources, lit nodes)
    const ids = new Map<string, number>();
    nodes.forEach((_, i) => ids.set(`n${i}`, i));
    // hub: the top of the brain, where the question comes in
    let hub = 0;
    nodes.forEach((p, i) => { if (p[1] - 0.15 * Math.abs(p[0]) > nodes[hub][1] - 0.15 * Math.abs(nodes[hub][0])) hub = i; });
    kind[hub] = 1;
    ids.set("hub", hub);
    // sources: upper nodes spread back → front (left → right in the default view), so [1][2][3] read in order
    const upper = nodes.map((p, i) => [i, p] as const).filter(([i, p]) => i !== hub && p[1] > 0.05).sort((a, b) => a[1][2] - b[1][2]);
    // targets along an arc over the near side: occipital → parietal/top → frontal, so labels sit apart and in [1][2][3] order
    const used = new Set<number>([hub]);
    sources.forEach((s, k) => {
      if (!upper.length) return;
      const f = (k + 0.5) / sources.length;
      const tgt: V3 = [-0.4, 0.12 + 0.32 * Math.sin(Math.PI * f), -0.62 + 1.24 * f];
      let idx = -1;
      nodes.forEach((q, i) => { if (!used.has(i) && kind[i] === 0 && (idx < 0 || d2(q, tgt) < d2(nodes[idx], tgt))) idx = i; });
      if (idx < 0) return;
      used.add(idx);
      kind[idx] = 2;
      ids.set(s.id, idx);
    });
    // some plain nodes carry a tiny data mark (page, message, date): the brain holds things, not just dots
    nodes.forEach((_, i) => { if (kind[i] === 0 && i % 3 === 1) kind[i] = 5 + (i % 9 === 1 ? 0 : i % 9 === 4 ? 1 : 2); });
    const adj: number[][] = nodes.map(() => []);
    edges.forEach((e, k) => { adj[e.a].push(k); adj[e.b].push(k); });
    const route = (a: number, b: number): number[] => {
      const prev = new Array(N).fill(-1);
      prev[a] = a;
      const q = [a];
      while (q.length) {
        const v = q.shift()!;
        if (v === b) break;
        for (const k of adj[v]) {
          const w = edges[k].a === v ? edges[k].b : edges[k].a;
          if (prev[w] < 0) { prev[w] = v; q.push(w); }
        }
      }
      if (prev[b] < 0) return [a];
      const path = [b];
      while (path[path.length - 1] !== a) path.push(prev[path[path.length - 1]]);
      return path.reverse();
    };
    const edgeOf = (a: number, b: number) => adj[a].find((k) => edges[k].a === b || edges[k].b === b)!;

    const SEG = 12;
    const edgePos = new Float32Array(edges.length * SEG * 2 * 3);
    edges.forEach((e, k) => {
      for (let s = 0; s < SEG; s++) {
        const p0 = bez(nodes[e.a], e.m, nodes[e.b], s / SEG), p1 = bez(nodes[e.a], e.m, nodes[e.b], (s + 1) / SEG);
        edgePos.set([...p0, ...p1], (k * SEG + s) * 6);
      }
    });
    const edgeGlow = new Float32Array(edges.length * SEG * 2);
    const nodePos = new Float32Array(N * 3);
    nodes.forEach((p, i) => nodePos.set(p, i * 3));
    const MAXP = 48;
    const pulsePos = new Float32Array(MAXP * TRAIL * 3);
    const pulseKind = new Float32Array(MAXP * TRAIL).fill(3);
    const pulseGlow = new Float32Array(MAXP * TRAIL);
    const MAXX = 8;
    const exitPts = new Float32Array(MAXX * TRAIL * 2);
    const exitPtsG = new Float32Array(MAXX * TRAIL);
    const exitLine = new Float32Array(MAXX * 2 * 2);
    const exitLineG = new Float32Array(MAXX * 2);

    /* ---- GL plumbing ---- */
    const buf = (body: Float32Array, dyn = false) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, body, dyn ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
      return b;
    };
    type A = [name: string, b: WebGLBuffer, size: number, stride: number, off: number];
    const prog = (vs: string, fs: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      const cache = new Map<string, WebGLUniformLocation | null>();
      return { p, u: (n: string) => (cache.has(n) ? cache.get(n)! : (cache.set(n, gl.getUniformLocation(p, n)), cache.get(n)!)) };
    };
    type P = ReturnType<typeof prog>;
    const shared: Record<string, number[]> = {};
    const set = (n: string, ...v: number[]) => { shared[n] = v; };
    const bind = (pr: P, attrs: A[]) => {
      gl.useProgram(pr.p);
      for (let i = 0; i < 8; i++) gl.disableVertexAttribArray(i);
      for (const [name, b, size, stride, off] of attrs) {
        const loc = gl.getAttribLocation(pr.p, name);
        if (loc < 0) continue;
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, off * 4);
      }
      for (const [n, v] of Object.entries(shared)) {
        const loc = pr.u(n);
        if (!loc) continue;
        if (v.length === 1) gl.uniform1f(loc, v[0]);
        else gl.uniform2f(loc, v[0], v[1]);
      }
    };
    const upd = (b: WebGLBuffer, body: Float32Array) => { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferSubData(gl.ARRAY_BUFFER, 0, body); };

    const dotsP = prog(VERT, FRAG), edgeP = prog(EDGE_VERT, LINE_FRAG), nodeP = prog(NODE_VERT, NODE_FRAG);
    const exitLP = prog(EXIT_VERT, EXIT_LINE_FRAG), exitPP = prog(EXIT_VERT, NODE_FRAG);
    const bDots = buf(data);
    const bEdge = buf(edgePos), bEdgeG = buf(edgeGlow, true);
    const bNode = buf(nodePos), bKind = buf(kind, true), bGlow = buf(glow, true);
    const bPulse = buf(pulsePos, true), bPulseK = buf(pulseKind), bPulseG = buf(pulseGlow, true);
    const bExit = buf(exitPts, true), bExitG = buf(exitPtsG, true), bExitL = buf(exitLine, true), bExitLG = buf(exitLineG, true);

    gl.enable(gl.BLEND);
    if (tone === "ink" || tone === "white") gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); else gl.blendFunc(gl.ONE, gl.ONE);
    set("uInk", tone === "white" ? 2 : tone === "ink" ? 1 : 0);
    gl.clearColor(0, 0, 0, 0);

    /* ---- view state (mirrored in JS for anchors) ---- */
    let aspect = 1, scale = 1, offX = 0, offY = 0, T = 0, curA = 0, curTilt = 0, curScale = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = w / Math.max(h, 1);
      const wide = aspect > 1.1;
      set("uAspect", aspect);
      set("uPx", dpr);
      offX = wide && !center ? 0.3 : 0;
      offY = wide ? 0.02 : 0.16;
      set("uOff", offX, offY);
      scale = wide ? 0.95 : Math.max(aspect * 1.05, 0.55);
    };
    resize();
    window.addEventListener("resize", resize);

    const proj = (p: V3): [number, number, number] => {
      const br = 1 + 0.012 * Math.sin(T * 1.1 + p[1] * 3);
      let x = p[0] * br, y = p[1] * br, z = p[2] * br;
      const ca = Math.cos(curA), sa = Math.sin(curA);
      [x, z] = [ca * x + sa * z, -sa * x + ca * z];
      const cb = Math.cos(curTilt), sb = Math.sin(curTilt);
      [y, z] = [cb * y - sb * z, sb * y + cb * z];
      x *= curScale; y *= curScale; z *= curScale;
      const zz = 3.2 - z;
      return [(x / zz) * 2.2 / aspect + offX, (y / zz) * 2.2 + offY, z / curScale];
    };
    const toClient = (c: [number, number, number]): BrainAnchor => {
      const b = canvas.getBoundingClientRect();
      return { x: b.left + ((c[0] + 1) / 2) * b.width, y: b.top + ((1 - c[1]) / 2) * b.height, z: c[2], visible: c[2] > -0.35 };
    };
    const toClip = (el: Element): [number, number] => {
      const b = canvas.getBoundingClientRect(), e = el.getBoundingClientRect();
      // aim at the element's near edge: its bottom when it sits above the brain, its top when below
      const x = e.left + e.width / 2, y = e.bottom < b.top + b.height / 2 ? e.bottom : e.top;
      return [((x - b.left) / b.width) * 2 - 1, 1 - ((y - b.top) / b.height) * 2];
    };

    /* ---- pulses ---- */
    type Pulse = { hops: number[]; h: number; u: number; speed: number; wait: number; done?: () => void; api: boolean };
    type Exit = { from: number; el: Element; u: number; ms: number; done: () => void; fade: number };
    const pulses: Pulse[] = [];
    const exits: Exit[] = [];
    let ambientHold = 0;
    let netOn = reduce ? 1 : 0;

    const launch = (hops: number[], speed: number, isApi: boolean) =>
      new Promise<void>((res) => {
        if (hops.length < 2) { glow[hops[0]] = 1; res(); return; }
        if (pulses.length >= MAXP) pulses.shift()?.done?.();
        if (isApi) for (let i = 0; i + 1 < hops.length; i++) { const e = edges[edgeOf(hops[i], hops[i + 1])]; e.hold = Math.max(e.hold, 0.35); }
        pulses.push({ hops, h: 0, u: 0, speed, wait: 0, done: res, api: isApi });
      });

    const nodeIdx = (id: string) => ids.get(id);
    const handle: BrainApi = {
      pulse(from, to, opts = {}) {
        const a = nodeIdx(from);
        if (a === undefined) return Promise.resolve();
        ambientHold = T + 3.5;
        if (typeof to !== "string") {
          if (reduce) { glow[a] = 1; return Promise.resolve(); }
          return new Promise<void>((res) => {
            if (exits.length >= MAXX) exits.shift()?.done();
            exits.push({ from: a, el: to, u: 0, ms: opts.ms ?? 700, done: res, fade: 1 });
          });
        }
        const b = nodeIdx(to);
        if (b === undefined) return Promise.resolve();
        const hops = route(a, b);
        if (reduce) {
          hops.forEach((i) => (glow[i] = Math.max(glow[i], 0.8)));
          for (let i = 0; i + 1 < hops.length; i++) edges[edgeOf(hops[i], hops[i + 1])].glow = 0.8;
          held[b] = Math.max(held[b], 0.8);
          paintStill();
          return Promise.resolve();
        }
        let L = 0;
        for (let i = 0; i + 1 < hops.length; i++) L += edges[edgeOf(hops[i], hops[i + 1])].len;
        const speed = opts.ms ? (L / opts.ms) * 1000 : 1.5;
        return launch(hops, speed, true).then(() => { held[b] = Math.max(held[b], kind[b] === 2 ? 0.55 : 0); });
      },
      anchor(id) {
        const i = nodeIdx(id);
        return i === undefined ? null : toClient(proj(nodes[i]));
      },
      ids: () => [...ids.keys()],
      light(id, v = 1) {
        const i = nodeIdx(id);
        if (i === undefined) return;
        glow[i] = v;
        held[i] = kind[i] === 2 ? v * 0.6 : 0;
        if (reduce) paintStill();
      },
    };

    const spawnAmbient = () => {
      const a = Math.floor(r() * N);
      let b = Math.floor(r() * N);
      for (let k = 0; k < 6; k++) {
        const len = route(a, b).length;
        if (len >= 3 && len <= 6) break;
        b = Math.floor(r() * N);
      }
      launch(route(a, b), 0.55 + r() * 0.9, false);
    };
    let nextAmbient = 3.6;

    const step = (dt: number) => {
      netOn = Math.min(1, Math.max(0, (T - 3.0) / 1.4));
      for (const e of edges) { e.hold *= Math.exp(-dt * 0.45); e.glow = Math.max(e.hold, e.glow * Math.exp(-dt * 2.6)); }
      for (let i = 0; i < N; i++) glow[i] = held[i] + (glow[i] - held[i]) * Math.exp(-dt * 2.2);
      if (ambient && T > nextAmbient) {
        const quiet = T < ambientHold;
        const ambCount = pulses.filter((p) => !p.api).length;
        if (!quiet && ambCount < (small ? 3 : 6)) spawnAmbient();
        nextAmbient = T + (quiet ? 0.5 : 0.35 + r() * 0.7);
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const P = pulses[k];
        if (P.wait > 0) { P.wait -= dt; continue; }
        const e = edges[edgeOf(P.hops[P.h], P.hops[P.h + 1])];
        P.u += (dt * P.speed) / e.len;
        e.glow = Math.max(e.glow, P.api ? 1 : 0.55);
        if (P.api) e.hold = Math.max(e.hold, 0.75);
        if (P.u >= 1) {
          const at = P.hops[P.h + 1];
          glow[at] = Math.max(glow[at], P.api ? 1 : 0.7);
          P.h++;
          P.u = 0;
          P.wait = 0.0;
          if (P.h >= P.hops.length - 1) { pulses.splice(k, 1); P.done?.(); }
        }
      }
      for (let k = exits.length - 1; k >= 0; k--) {
        const X = exits[k];
        if (X.u < 1) {
          X.u = Math.min(1, X.u + (dt * 1000) / X.ms);
          glow[X.from] = Math.max(glow[X.from], 0.9);
          if (X.u >= 1) X.done();
        } else {
          X.fade -= dt / 3.0;
          if (X.fade <= 0) exits.splice(k, 1);
        }
      }
    };

    const writeDynamic = () => {
      edges.forEach((e, k) => edgeGlow.fill(e.glow, k * SEG * 2, (k + 1) * SEG * 2));
      pulseGlow.fill(0);
      pulses.forEach((P, k) => {
        if (P.wait > 0 || k >= MAXP) return;
        const a = P.hops[P.h], b = P.hops[P.h + 1];
        const e = edges[edgeOf(a, b)];
        const fwd = e.a === a;
        for (let t = 0; t < TRAIL; t++) {
          const u = P.u - (t * 0.0055) / e.len;
          if (u < 0) break;
          const p = bez(nodes[e.a], e.m, nodes[e.b], fwd ? u : 1 - u);
          pulsePos.set(p, (k * TRAIL + t) * 3);
          pulseGlow[k * TRAIL + t] = (t === 0 ? 1 : 0.75 * Math.pow(1 - t / TRAIL, 1.3)) * (P.api ? 1 : 0.7);
        }
      });
      exitPtsG.fill(0);
      exitLineG.fill(0);
      exits.forEach((X, k) => {
        const A = proj(nodes[X.from]);
        const B = toClip(X.el);
        const head = Math.pow(X.u, 0.85);
        const hx = A[0] + (B[0] - A[0]) * head, hy = A[1] + (B[1] - A[1]) * head;
        exitLine.set([A[0], A[1], hx, hy], k * 4);
        exitLineG[k * 2] = exitLineG[k * 2 + 1] = Math.min(1, X.fade);
        if (X.u < 1)
          for (let t = 0; t < TRAIL; t++) {
            const u = head - t * 0.006;
            if (u < 0) break;
            exitPts.set([A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u], (k * TRAIL + t) * 2);
            exitPtsG[k * TRAIL + t] = t === 0 ? 1 : 0.75 * Math.pow(1 - t / TRAIL, 1.3);
          }
      });
      upd(bEdgeG, edgeGlow);
      upd(bGlow, glow);
      upd(bPulse, pulsePos);
      upd(bPulseG, pulseGlow);
      upd(bExit, exitPts);
      upd(bExitG, exitPtsG);
      upd(bExitL, exitLine);
      upd(bExitLG, exitLineG);
    };

    /* pointer (unchanged): a gentle lean, glitter near the cursor */
    let px = 0, py = 0, lx = 0, ly = 0;
    let mx = 9, my = 9, sx = 9, sy = 9, hover = 0, lastMove = -1e9;
    const onMove = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      const b = canvas.getBoundingClientRect();
      if (e.clientY < b.top || e.clientY > b.bottom) return;
      mx = ((e.clientX - b.left) / b.width) * 2 - 1;
      my = 1 - ((e.clientY - b.top) / b.height) * 2;
      if (sx === 9) { sx = mx; sy = my; }
      lastMove = performance.now();
    };
    const onLeave = () => { lastMove = -1e9; };
    let scrollTilt = 0;
    const onScroll = () => { scrollTilt = Math.min(window.scrollY / Math.max(canvas.clientHeight, 1), 1); };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onMove);

    const base = Math.PI / 2; // side profile (sagittal): front to the right, reads as a brain in a glance
    const labelEls = labelsRef.current ? [...labelsRef.current.children] as HTMLElement[] : [];
    const placeLabels = () => {
      if (!labelEls.length) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      // ≥16px between labels, inside the canvas (8px inset) — placeBrainLabels (screens.21)
      const ox = canvas.offsetLeft, oy = canvas.offsetTop;
      const items = sources.map((src, k) => {
        const i = ids.get(src.id), el = labelEls[k];
        if (i === undefined || !el) return null;
        const c = proj(nodes[i]);
        return { el, c, node: { nx: ox + ((c[0] + 1) / 2) * w, ny: oy + ((1 - c[1]) / 2) * h, w: el.offsetWidth, h: el.offsetHeight } };
      }).filter((v): v is NonNullable<typeof v> => v !== null);
      const boxes = placeBrainLabels(items.map((v) => v.node), { l: ox + 8, t: oy + 8, r: ox + w - 8, b: oy + h - 8 });
      items.forEach(({ el, c }, k) => {
        el.style.transform = `translate(${boxes[k].x}px, ${boxes[k].y}px)`;
        el.style.opacity = String(netOn * (c[2] > -0.4 ? 1 : 0.35));
      });
    };
    const draw = (t: number) => {
      T = t;
      lx += (px - lx) * 0.04;
      ly += (py - ly) * 0.04;
      sx += (mx - sx) * 0.18;
      sy += (my - sy) * 0.18;
      const active = performance.now() - lastMove < 1400 ? 1 : 0;
      hover += (active - hover) * (active ? 0.12 : 0.03);
      curA = base + Math.sin(t * 0.13) * 0.12 + lx * 0.1; // ±10° at most
      curTilt = 0.06 + ly * 0.06 + scrollTilt * 0.1;
      curScale = scale * (1 + 0.018 * Math.sin(t * 0.9));
      set("uMouse", sx, sy);
      set("uHover", hover);
      set("uT", t);
      set("uA", curA);
      set("uTilt", curTilt);
      set("uScale", curScale);
      set("uNet", netOn);
      writeDynamic();
      gl.clear(gl.COLOR_BUFFER_BIT);
      bind(dotsP, [["aT", bDots, 3, 44, 0], ["aS", bDots, 3, 44, 3], ["aK", bDots, 1, 44, 6], ["aN", bDots, 3, 44, 7], ["aR", bDots, 1, 44, 10]]);
      gl.drawArrays(gl.POINTS, 0, total);
      bind(edgeP, [["aP", bEdge, 3, 12, 0], ["aG", bEdgeG, 1, 4, 0]]);
      gl.drawArrays(gl.LINES, 0, edges.length * SEG * 2);
      bind(exitLP, [["aC", bExitL, 2, 8, 0], ["aG", bExitLG, 1, 4, 0]]);
      gl.drawArrays(gl.LINES, 0, MAXX * 2);
      bind(nodeP, [["aP", bNode, 3, 12, 0], ["aKind", bKind, 1, 4, 0], ["aG", bGlow, 1, 4, 0]]);
      gl.drawArrays(gl.POINTS, 0, N);
      bind(nodeP, [["aP", bPulse, 3, 12, 0], ["aKind", bPulseK, 1, 4, 0], ["aG", bPulseG, 1, 4, 0]]);
      gl.drawArrays(gl.POINTS, 0, MAXP * TRAIL);
      bind(exitPP, [["aC", bExit, 2, 8, 0], ["aG", bExitG, 1, 4, 0]]);
      gl.drawArrays(gl.POINTS, 0, MAXX * TRAIL);
      placeLabels();
    };
    const paintStill = () => requestAnimationFrame(() => draw(12));

    // sources hold a faint light from the start, so they read as "named places"
    for (let i = 0; i < N; i++) if (kind[i] === 2) held[i] = glow[i] = reduce ? 0.6 : 0.25;

    const sec = canvas.closest("section") ?? canvas.parentElement;
    const onPulse = (ev: Event) => {
      const d = (ev as CustomEvent).detail || {};
      if (d.from && d.to) handle.pulse(d.from, d.to, d);
    };
    sec?.addEventListener("brain:pulse", onPulse);
    (canvas as unknown as { brain?: BrainApi }).brain = handle;
    apiRef.current?.(handle);
    canvas.dispatchEvent(new CustomEvent("brain:ready", { bubbles: true, detail: handle }));

    const cleanupBase = () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      sec?.removeEventListener("brain:pulse", onPulse);
      apiRef.current?.(null);
    };

    if (reduce) {
      draw(12);
      [400, 1200].forEach((ms) => setTimeout(() => requestAnimationFrame(() => { resize(); draw(12); }), ms)); // site-recipes: still screenshot
      return cleanupBase;
    }

    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    let last = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    function loop(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const t = (now - t0) / 1000;
      step(Math.min(0.05, Math.max(0, t - last)));
      last = t;
      draw(t);
      raf = requestAnimationFrame(loop);
    }
    const onVis = () => {
      if (!document.hidden && visible && !raf) { last = (performance.now() - t0) / 1000; raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cleanupBase();
    };
  }, [tone, runKey, still, srcKey, ambient, canvasOnly, center]);

  const labels = sources.some((s) => s.label) ? (
    <div ref={labelsRef} className="bc-labels" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {sources.map((s) => (
        <span key={s.id} className="bc-node-label" style={{ position: "absolute", left: 0, top: 0, opacity: 0, font: "500 12px/1 'IBM Plex Mono', ui-monospace, monospace", letterSpacing: "0.02em", whiteSpace: "nowrap", padding: "4px 8px", borderRadius: 6,
            // a solid pill so the label stays readable over the white points
            background: tone === "ink" ? "var(--ts-fg)" : tone === "white" ? "var(--ts-surface)" : "color-mix(in srgb, var(--ts-fg) 85%, transparent)", color: tone === "white" ? "var(--ts-electric)" : tone === "ink" ? "var(--ts-page)" : "var(--ts-on-electric)",
            boxShadow: tone === "white" ? "var(--ts-elevation)" : "none" }}>{s.label}</span>
      ))}
    </div>
  ) : null;
  if (canvasOnly) return <><style>{BC_CSS}</style><canvas ref={ref} className="bc-canvas" aria-hidden="true" />{labels}</>;
  return (
    <section className="bc" aria-label="INAI · Second Brain">
      <style>{BC_CSS}</style>
      <canvas ref={ref} className="bc-canvas" aria-hidden="true" />
      {labels}
      <div className="bc-top">
        <span className="bc-mark">INAI</span>
        <span className="bc-label">SECOND BRAIN</span>
      </div>
      <div className="bc-bottom">
        <p className="bc-kicker">
          <span className="bc-rule" aria-hidden="true" /> ЭХ СУРВАЛЖТАЙ АГЕНТ
        </p>
        <p className="bc-word">INAI</p>
      </div>
    </section>
  );
}

/** The home hero (web-builder, inai-home v31): four named sources over the brain, on Electric. */
export const brainCoverDemo: Parameters<typeof BrainCover>[0] = {
  canvasOnly: true,
  center: true,
  tone: "white",
  sources: [
    { id: "s1", label: "1 · Санхүүгийн тайлан" },
    { id: "s2", label: "2 · Нийлүүлэгчийн нэхэмжлэл" },
    { id: "s3", label: "3 · Салбарын борлуулалт" },
    { id: "s4", label: "4 · Багийн уулзалт" },
  ],
};
