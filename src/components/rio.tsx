"use client";

import { useEffect, useRef } from "react";

/*
  El río: el fondo del programa impreso (ref/rio.py) llevado a la web.
  Un solo recorrido —una spline que serpentea— y alrededor una banda de color:
    · alfa = densidad · exp(-(d / ancho)^5): borde difuso pero definido
    · ancho y densidad varían a lo largo del recorrido
    · color según la posición en el recorrido (lila claro → azul gris → rosa →
      lila claro → rosa → melocotón), suavizado
    · grano fino solo dentro de la banda; el resto queda blanco limpio
  Se calcula en el navegador con las medidas reales: los puntos de control se
  definen por sección (x en fracción del ancho, y en fracción del alto de cada
  sección), así la curva se reacomoda en el celular en vez de achicarse.
*/

export type Punto = [x: number, seccion: number, y: number];

// Escritorio: entra por la derecha bajo la foto, baja por el costado del timer
// (lejos del texto centrado), cruza por el aire entre secciones y se afina
// detrás del título grande de "Qué es", sin tocar los textos en mono.
const ESCRITORIO: Punto[] = [
  [1.15, 0, 0.55],
  [0.96, 0, 0.92],
  [0.93, 1, 0.12],
  [0.9, 1, 0.42],
  [0.95, 1, 0.75],
  [0.88, 1, 1.0],
  [0.62, 2, 0.07],
  [0.42, 2, 0.13],
  [0.36, 2, 0.3],
  [0.3, 2, 0.44],
];

// Celular: más vertical y angosta. Pasa detrás del título del timer, sale por
// la izquierda para no tocar los rótulos de las cifras, vuelve por el aire
// bajo el botón y termina detrás del título de "Qué es".
const CELULAR: Punto[] = [
  [1.25, 0, 0.85],
  [0.95, 0, 1.0],
  [0.78, 1, 0.24],
  [0.2, 1, 0.33],
  [-0.28, 1, 0.47],
  [-0.28, 1, 0.74],
  [0.3, 1, 0.98],
  [0.8, 2, 0.03],
  [0.62, 2, 0.15],
  [0.48, 2, 0.2],
];

/* Paradas del degradé por nombre de variable: el color real sale de globals.css */
const PARADAS: [number, string][] = [
  [0, "--color-lila"],
  [0.3, "--color-azulgris"],
  [0.5, "--color-rosa"],
  [0.65, "--color-lila"],
  [0.8, "--color-rosa"],
  [1, "--color-melocoton"],
];
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
let RGB: (readonly [number, ...number[]])[] = [];
function leerParadas() {
  const css = getComputedStyle(document.documentElement);
  RGB = PARADAS.map(([p, v]) => [p, ...hex(css.getPropertyValue(v).trim())] as const);
}

function colorEn(s: number) {
  for (let i = 1; i < RGB.length; i++) {
    const [q, ...c2] = RGB[i];
    if (s <= q) {
      const [p, ...c1] = RGB[i - 1];
      const f = (s - p) / (q - p);
      return c1.map((v, k) => v * (1 - f) + c2[k] * f);
    }
  }
  return RGB[RGB.length - 1].slice(1) as number[];
}

/* Catmull-Rom centrípeta: curva suave que pasa por todos los puntos */
function spline(pts: [number, number][], porTramo = 60) {
  const out: [number, number][] = [];
  const P = [pts[0], ...pts, pts[pts.length - 1]];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const d = (a: [number, number], b: [number, number]) => Math.max(1e-3, Math.hypot(b[0] - a[0], b[1] - a[1]) ** 0.5);
    const t1 = d(p0, p1);
    const t2 = t1 + d(p1, p2);
    const t3 = t2 + d(p2, p3);
    for (let j = 0; j < porTramo; j++) {
      const t = t1 + ((t2 - t1) * j) / porTramo;
      const lerp = (a: [number, number], b: [number, number], ta: number, tb: number) =>
        [0, 1].map((k) => ((tb - t) / (tb - ta)) * a[k] + ((t - ta) / (tb - ta)) * b[k]) as [number, number];
      const A1 = lerp(p0, p1, 0, t1);
      const A2 = lerp(p1, p2, t1, t2);
      const A3 = lerp(p2, p3, t2, t3);
      const B1 = lerp(A1, A2, 0, t2);
      const B2 = lerp(A2, A3, t1, t3);
      out.push(lerp(B1, B2, t1, t2));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function dibujar(canvas: HTMLCanvasElement, secciones: HTMLElement[], celular: boolean, recorrido: { escritorio: Punto[]; celular: Punto[]; ancho: number; anchoCelular: number }) {
  leerParadas();
  const caja = canvas.parentElement!.getBoundingClientRect();
  const W = Math.round(caja.width);
  const H = Math.round(caja.height);
  if (!W || !H) return;
  const def = celular ? recorrido.celular : recorrido.escritorio;
  const tops = secciones.map((s) => s.getBoundingClientRect().top - caja.top);
  const altos = secciones.map((s) => s.getBoundingClientRect().height);
  const puntos = def.map(([x, k, y]) => [x * W, tops[k] + y * altos[k]] as [number, number]);
  const curva = spline(puntos);

  // Largo acumulado: s ∈ [0, 1] a lo largo del recorrido
  const largos = [0];
  for (let i = 1; i < curva.length; i++) largos.push(largos[i - 1] + Math.hypot(curva[i][0] - curva[i - 1][0], curva[i][1] - curva[i - 1][1]));
  const total = largos[largos.length - 1];

  // Ancho (radio de la banda) y densidad a lo largo del recorrido:
  // más ancha y densa al entrar, se afina y se apaga en el último tramo.
  const base = celular ? recorrido.anchoCelular * W : recorrido.ancho * W;
  const ancho = (s: number) => base * (1 + 0.45 * Math.exp(-((s / 0.18) ** 2))) * (1 - 0.7 * suave(0.7, 1, s));
  const densidad = (s: number) => (0.78 + 0.25 * Math.exp(-((s / 0.2) ** 2))) * (1 - suave(0.86, 1, s));

  // Grilla gruesa: cada muestra de la curva "estampa" su banda alrededor y cada
  // celda se queda con el tramo que más la pinta (no con el más cercano: así un
  // tramo angosto no corta a uno ancho que pasa cerca)
  const R = 3;
  const gw = Math.ceil(W / R) + 1;
  const gh = Math.ceil(H / R) + 1;
  const A = new Float32Array(gw * gh);
  const C = new Float32Array(gw * gh * 3);
  let ultimo = -1e9;
  for (let i = 0; i < curva.length; i++) {
    if (largos[i] - ultimo < R * 0.6 && i < curva.length - 1) continue;
    ultimo = largos[i];
    const [cx, cy] = curva[i];
    const s = largos[i] / total;
    const w = Math.max(1, ancho(s));
    const den = densidad(s);
    if (den < 0.01) continue;
    const c = colorEn(s);
    // El estampado cubre hasta 2.2 anchos y el halo llega a cero antes: sin bordes en escalera
    const alcance = Math.ceil((w * 2.2) / R);
    const gx = Math.round(cx / R);
    const gy = Math.round(cy / R);
    for (let y = Math.max(0, gy - alcance); y <= Math.min(gh - 1, gy + alcance); y++) {
      for (let x = Math.max(0, gx - alcance); x <= Math.min(gw - 1, gx + alcance); x++) {
        const d = Math.hypot(x * R - cx, y * R - cy) / w;
        const a = Math.min(0.95, den * Math.max(Math.exp(-(d ** 5)), 0.14 * Math.exp(-((d / 1.25) ** 2)) * (1 - suave(1.6, 2.1, d))));
        const k = y * gw + x;
        if (a > A[k]) {
          A[k] = a;
          C[k * 3] = c[0];
          C[k * 3 + 1] = c[1];
          C[k * 3 + 2] = c[2];
        }
      }
    }
  }

  // Ampliación bilineal a tamaño real, sobre blanco, con grano solo en la banda
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const px = img.data;
  let semilla = 7;
  const azar = () => {
    semilla = (semilla * 16807) % 2147483647;
    return semilla / 2147483647;
  };
  for (let y = 0; y < H; y++) {
    const fy = y / R;
    const y0 = Math.min(gh - 2, Math.floor(fy));
    const ty = fy - y0;
    for (let x = 0; x < W; x++) {
      const fx = x / R;
      const x0 = Math.min(gw - 2, Math.floor(fx));
      const tx = fx - x0;
      const k00 = y0 * gw + x0;
      const k10 = k00 + 1;
      const k01 = k00 + gw;
      const k11 = k01 + 1;
      const w00 = (1 - tx) * (1 - ty);
      const w10 = tx * (1 - ty);
      const w01 = (1 - tx) * ty;
      const w11 = tx * ty;
      const a = A[k00] * w00 + A[k10] * w10 + A[k01] * w01 + A[k11] * w11;
      const o = (y * W + x) * 4;
      if (a < 0.004) {
        px[o] = px[o + 1] = px[o + 2] = 255;
        px[o + 3] = 255;
        continue;
      }
      // Color ponderado por alfa para que no se ensucie hacia el blanco en los bordes
      const sa = a || 1;
      const ruido = (azar() - 0.5) * 2 * 7 * Math.min(1, a * 1.6);
      for (let c = 0; c < 3; c++) {
        const col = (C[k00 * 3 + c] * A[k00] * w00 + C[k10 * 3 + c] * A[k10] * w10 + C[k01 * 3 + c] * A[k01] * w01 + C[k11 * 3 + c] * A[k11] * w11) / sa;
        px[o + c] = Math.max(0, Math.min(255, 255 * (1 - a) + col * a + ruido));
      }
      px[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/* Capa del río: va detrás de las secciones que recorre (sus ids, en orden) */
export function Rio({
  secciones,
  escritorio = ESCRITORIO,
  celular = CELULAR,
  ancho: anchoBanda = 0.068,
  anchoCelular = 0.14,
}: {
  secciones: string[];
  /** Puntos de control: [x en fracción del ancho, índice de sección, y en fracción del alto de esa sección] */
  escritorio?: Punto[];
  celular?: Punto[];
  /** Radio de la banda en fracción del ancho de pantalla */
  ancho?: number;
  anchoCelular?: number;
}) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    let ancho = 0;
    let alto = 0;
    let t = 0;
    const redibujar = () => {
      const caja = canvas.parentElement!.getBoundingClientRect();
      // Solo si cambió el tamaño: el río no se recalcula al scrollear
      if (Math.round(caja.width) === ancho && Math.abs(caja.height - alto) < 2) return;
      ancho = Math.round(caja.width);
      alto = caja.height;
      const els = secciones.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      if (els.length !== secciones.length) return;
      dibujar(canvas, els, ancho < 768, { escritorio, celular, ancho: anchoBanda, anchoCelular });
    };
    const programar = () => {
      clearTimeout(t);
      t = window.setTimeout(redibujar, 120);
    };
    redibujar();
    document.fonts?.ready.then(() => {
      ancho = 0;
      redibujar();
    });
    const ro = new ResizeObserver(programar);
    ro.observe(canvas.parentElement!);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [secciones, escritorio, celular, anchoBanda, anchoCelular]);

  return <canvas ref={lienzo} aria-hidden className="pointer-events-none absolute inset-0 -z-10 block size-full" />;
}
