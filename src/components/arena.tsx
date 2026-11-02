"use client";

import { useEffect, useRef } from "react";
import { useCanal } from "@/lib/estado";
import { generarGranos, type Grano } from "@/lib/chladni";
import { iniciarArenaViva } from "@/lib/arena-viva";
import type { CanalId } from "@/lib/programa";

type Props = {
  fijo?: CanalId | "todos";
  forma?: "placa" | "anillos";
  centro?: [number, number];
  anillos?: number;
  tintas?: string[];
  particulas?: number;
  semilla?: number;
  /** Las muestras pequeñas se presentan ya asentadas. */
  animado?: boolean;
  evolucion?: boolean;
  detenido?: boolean;
  className?: string;
};

export function Arena({ fijo, forma = "placa", centro = [0.5, 0.5], anillos = 5, tintas = ["--color-blanco"], particulas = 24000, semilla = 1411, animado = true, evolucion = false, detenido = false, className = "" }: Props) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const pausa = useRef(detenido);
  useEffect(() => { pausa.current = detenido; }, [detenido]);
  const elegido = useCanal();
  const perfil = fijo ?? elegido ?? "ninguno";
  const [fx, fy] = centro;
  const listaTintas = tintas.join(",");

  useEffect(() => {
    const canvas = lienzo.current;
    if (canvas && evolucion) {
      const limpiar = iniciarArenaViva(canvas, { perfil, semilla, particulas, tintas: listaTintas.split(","), centro: [fx, fy], pausado: () => pausa.current });
      if (limpiar) return limpiar;
    }
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const movimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
    let granos: Grano[] = [];
    let ancho = 0, alto = 0, raf = 0, tiempo = 0, anterior = 0;
    let visible = false;
    let aspectoAnterior = 0;
    let colores: string[] = [];
    const duracion = 1600;
    let ultimoDibujo = 0;

    const pintarGranos = () => {
      ctx.clearRect(0, 0, ancho, alto);
      const radio = Math.min(ancho, alto) * 0.5;
      const t = !animado || movimiento.matches ? 1 : Math.min(1, tiempo / duracion);
      const progreso = 1 - (1 - t) ** 3;
      const escalaGrano = Math.min(1.3, Math.max(0.6, radio / 270));
      // Un velo de pigmento debajo y seis depósitos de grano encima.
      // Las pasadas separadas acumulan tinta en las zonas de mayor densidad.
      for (let pasada = -1; pasada < 6; pasada++) {
        ctx.globalAlpha = pasada < 0 ? 0.12 : 0.60;
        ctx.filter = pasada < 0 ? "blur(3px)" : "none";
        colores.forEach((color, c) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          for (let i = 0; i < granos.length; i++) {
            if (pasada >= 0 && i % 6 !== pasada) continue;
            const g = granos[i];
            if (Math.min(colores.length - 1, Math.floor(g.tinta * colores.length)) !== c) continue;
            const x = (g.origenX + (g.x - g.origenX) * progreso) * radio + ancho * fx;
            const y = (g.origenY + (g.y - g.origenY) * progreso) * radio + alto * fy;
            const r = (g.radio + (pasada < 0 ? 1.8 : 0)) * escalaGrano;
            ctx.moveTo(x + r, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
          }
          ctx.fill();
        });
      }
      ctx.filter = "none";
      ctx.globalAlpha = 1;
    };
    const dibujar = pintarGranos;
    const cuadro = (ahora: number) => {
      if (!pausa.current) tiempo += anterior ? Math.min(ahora - anterior, 50) : 0;
      anterior = ahora;
      if (!pausa.current && ahora - ultimoDibujo >= 1000 / 30) { dibujar(); ultimoDibujo = ahora; }
      raf = evolucion || tiempo < duracion ? requestAnimationFrame(cuadro) : 0;
    };
    const activar = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      anterior = 0;
      if (!visible || document.hidden || !ancho || !alto) return;
      dibujar();
      if ((animado || evolucion) && !movimiento.matches && (evolucion || tiempo < duracion)) raf = requestAnimationFrame(cuadro);
    };
    const medir = () => {
      ancho = canvas.clientWidth;
      alto = canvas.clientHeight;
      if (!ancho || !alto) { cancelAnimationFrame(raf); raf = 0; return; }
      const dpr = Math.min(window.devicePixelRatio || 1, evolucion ? 1.5 : 2);
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const css = getComputedStyle(canvas);
      colores = listaTintas.split(",").map(v => css.getPropertyValue(v).trim());
      // Densidad por superficie: las miniaturas no calculan una placa de portada.
      const total = Math.min(particulas, Math.max(700, Math.round(ancho * alto * 0.24)));
      if (!visible) return;
      const aspecto = ancho / alto;
      if (granos.length !== total || aspectoAnterior !== aspecto) {
        granos = generarGranos(total, semilla, perfil, forma === "anillos" ? anillos : undefined, aspecto);
        aspectoAnterior = aspecto;

      }
      activar();
    };
    const tamano = new ResizeObserver(medir);
    const interseccion = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting;
      if (visible && !granos.length) medir();
      activar();
    });
    tamano.observe(canvas);
    interseccion.observe(canvas);
    movimiento.addEventListener("change", medir);
    document.addEventListener("visibilitychange", activar);
    return () => {
      cancelAnimationFrame(raf);
      tamano.disconnect();
      interseccion.disconnect();
      movimiento.removeEventListener("change", medir);
      document.removeEventListener("visibilitychange", activar);
    };
  }, [perfil, forma, anillos, fx, fy, listaTintas, particulas, semilla, animado, evolucion]);

  return <canvas ref={lienzo} aria-hidden className={`block size-full ${className}`} />;
}
