"use client";

import { useEffect, useRef } from "react";
import { useCanal } from "@/lib/estado";
import type { CanalId } from "@/lib/programa";

/*
  Arena de Chladni: el sonido hecho visible. La sal se junta donde la placa
  no vibra (las líneas nodales). Cada canal tiene su modo (n, m); al cambiar
  de canal la arena se sacude y vuelve a asentarse en otra figura: vibrar y
  volver al reposo. "todos" suma los tres modos, como el cierre de cada día.
  Una deformación suave del plano hace la figura orgánica, como en el afiche.

  forma="anillos": placa circular, como la arena del merch. La sal se ordena
  en anillos concéntricos con un temblor suave.

  Gesto de movimiento "la arena se ordena" (PROPUESTA, pendiente de
  confirmar): la sal arranca dispersa y quieta (silencio), salta cuando entra
  el sonido y se acomoda en la figura. Con prefers-reduced-motion se ve la
  versión quieta: la figura ya asentada, sin animación.
  Puntos sólidos, sin transparencia: la densidad la da la cantidad de puntos,
  igual que en la serigrafía.
*/

/* Duración del gesto en cuadros (~60 por segundo). Se ajusta con el ID animado. */
export const DURACION_GESTO = 140;
type Modo = [n: number, m: number, peso: number];
const MODOS: Record<CanalId | "ninguno" | "todos", Modo[]> = {
  ninguno: [
    [4, 7, 1],
    [2, 9, 0.5],
  ],
  tumbao: [
    [3, 8, 1],
    [5, 6, 0.5],
  ],
  pulso: [
    [4, 9, 1],
    [2, 7, 0.6],
  ],
  sinte: [
    [6, 9, 1],
    [3, 10, 0.5],
  ],
  todos: [
    [3, 8, 1],
    [4, 9, 0.8],
    [6, 9, 0.6],
  ],
};

const PI = Math.PI;
/* Azar fijo por partícula (no cambia entre cuadros) */
const azar = (i: number) => {
  const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);
};

function campo(modos: Modo[], x: number, y: number) {
  const wx = x + 0.11 * Math.sin(2.3 * PI * y + 1.1) + 0.05 * Math.sin(5.1 * PI * x);
  const wy = y + 0.1 * Math.sin(1.7 * PI * x + 0.4) + 0.05 * Math.sin(4.3 * PI * y + 2);
  let v = 0;
  for (const [n, m, p] of modos) {
    v += p * (Math.cos(n * PI * wx) * Math.cos(m * PI * wy) - Math.cos(m * PI * wx) * Math.cos(n * PI * wy));
  }
  return v;
}

type Props = {
  /** Si no se pasa, sigue al canal elegido */
  fijo?: CanalId | "todos";
  forma?: "placa" | "anillos";
  /** Centro de los anillos, en fracción del lienzo */
  centro?: [number, number];
  /** Cantidad de anillos en el radio mayor del lienzo */
  anillos?: number;
  /** Variables de color de las partículas, que se alternan: ["--color-vino", "--color-magenta"] */
  tintas?: string[];
  particulas?: number;
  className?: string;
};

/* Placa circular: anillos concéntricos con un temblor que los vuelve orgánicos */
function campoAnillos(k: number, cx: number, cy: number, x: number, y: number) {
  const dx = x - cx;
  const dy = y - cy;
  const r = Math.hypot(dx, dy);
  const t = Math.atan2(dy, dx);
  return Math.cos(k * PI * r + 0.22 * Math.sin(3 * t + 0.7) + 0.09 * Math.sin(7 * t + 2.1));
}

export function Arena({ fijo, forma = "placa", centro = [0.5, 0.5], anillos = 7, tintas = ["--color-blanco"], particulas = 22000, className = "" }: Props) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const estado = useRef<{ xs: Float32Array; ys: Float32Array; sacudir: number; cuadros: number } | null>(null);
  const elegido = useCanal();
  const clave = fijo ?? elegido ?? "ninguno";
  const [fx, fy] = centro;
  const listaTintas = tintas.join(",");

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chico = window.innerWidth < 768;
    const total = chico ? Math.round(particulas * 0.6) : particulas;

    let ancho = 0;
    let alto = 0;
    let escala = 1;
    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = canvas.clientWidth;
      alto = canvas.clientHeight;
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Una placa mide ~640 px: en lienzos grandes la figura se repite
      escala = Math.min(Math.max(ancho, alto), 640);
    };
    medir();

    if (!estado.current || estado.current.xs.length !== total) {
      const xs = new Float32Array(total);
      const ys = new Float32Array(total);
      for (let i = 0; i < total; i++) {
        xs[i] = Math.random() * (ancho / escala + 0.2) - 0.1;
        ys[i] = Math.random() * (alto / escala + 0.2) - 0.1;
      }
      estado.current = { xs, ys, sacudir: 0, cuadros: 0 };
    }
    const s = estado.current;
    s.sacudir = quieto ? 0 : 1;
    s.cuadros = 0;
    const modos = MODOS[clave];
    // Anillos: el centro y el radio se miden en unidades de placa
    const cx = (fx * ancho) / escala;
    const cy = (fy * alto) / escala;
    const radio = Math.max(Math.hypot(cx, cy), Math.hypot(ancho / escala - cx, alto / escala - cy));
    const kAnillos = anillos / radio;
    const f = forma === "anillos" ? (x: number, y: number) => campoAnillos(kAnillos, cx, cy, x, y) : (x: number, y: number) => campo(modos, x, y);

    const paso = () => {
      const h = 0.002;
      const ruido = 0.002 + s.sacudir * 0.02;
      for (let i = 0; i < s.xs.length; i++) {
        // Una de cada ocho queda suelta: polvo alrededor de la figura
        if (i % 8 === 0) continue;
        const x = s.xs[i];
        const y = s.ys[i];
        const v = f(x, y);
        const gx = (f(x + h, y) - v) / h;
        const gy = (f(x, y + h) - v) / h;
        const g2 = gx * gx + gy * gy + 1e-3;
        // Paso hacia la línea nodal (f = 0) + temblor proporcional a la vibración
        const k = 0.25 * (1 - s.sacudir);
        s.xs[i] = x - (k * v * gx) / g2 + (Math.random() - 0.5) * ruido * (0.3 + Math.abs(v));
        s.ys[i] = y - (k * v * gy) / g2 + (Math.random() - 0.5) * ruido * (0.3 + Math.abs(v));
      }
      s.sacudir *= 0.9;
      if (s.sacudir < 0.01) s.sacudir = 0;
    };

    const dibujar = () => {
      ctx.clearRect(0, 0, ancho, alto);
      const css = getComputedStyle(canvas);
      const colores = listaTintas.split(",").map((v) => css.getPropertyValue(v).trim());
      colores.forEach((color, c) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = c; i < s.xs.length; i += colores.length) {
          // Grano de arena, no vector: tamaño variable y un desvío fijo por partícula que ensancha y desdibuja el borde de la línea
          const a = azar(i);
          const b = azar(i + 0.5);
          const r = 0.5 + a * a * 1.3;
          const d = (b - 0.5) * (a < 0.7 ? 7 : 16);
          const x = s.xs[i] * escala + d * Math.cos(i);
          const y = s.ys[i] * escala + d * Math.sin(i);
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, 2 * PI);
        }
        ctx.fill();
      });
    };

    let raf = 0;
    if (quieto) {
      for (let i = 0; i < 120; i++) paso();
      dibujar();
    } else {
      const animar = () => {
        paso();
        dibujar();
        s.cuadros++;
        // Vuelve al reposo: después de asentarse, deja de calcular
        if (s.cuadros < DURACION_GESTO) raf = requestAnimationFrame(animar);
      };
      raf = requestAnimationFrame(animar);
    }

    const observador = new ResizeObserver(() => {
      medir();
      dibujar();
    });
    observador.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observador.disconnect();
    };
    }, [clave, particulas, forma, anillos, fx, fy, listaTintas]);

  return <canvas ref={lienzo} aria-hidden className={`block size-full ${className}`} />;
}
