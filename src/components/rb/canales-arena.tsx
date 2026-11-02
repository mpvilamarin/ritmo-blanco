"use client";

import { useEffect, useRef, useState } from "react";
import { Signo } from "../signos";
import { iniciarArenaViva } from "@/lib/arena-viva";
import { generarGranosCanal } from "@/lib/granos-canal";
import { CANALES, type CanalId } from "@/lib/programa";
import { estaQuieto } from "@/lib/movimiento";
import { CANAL } from "@/lib/rb";

/* La arena dibuja el signo de cada canal, uno por vez; abajo a la derecha, qué canal es. */
export function CanalesArena() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [indice, setIndice] = useState(0);
  useEffect(() => {
    if (!canvas.current) return;
    return iniciarArenaViva(canvas.current, {
      perfil: CANALES[0], perfiles: [...CANALES], semilla: 1411,
      particulas: 32000, tintas: ["--color-vino", "--color-magenta", "--color-rosa"],
      centro: [.5, .5], pausado: estaQuieto, reposo: 3200, transicion: 1800, grano: .6,
      generarPatron: (total, semilla, perfil) => generarGranosCanal(total, semilla, perfil as CanalId),
      alCambiar: setIndice,
    });
  }, []);
  const c = CANALES[indice];
  return (
    <figure className="rb-concepto-visual" aria-label="La arena dibuja, uno por vez, los signos de Tumbao, Pulso y Sinte">
      <canvas ref={canvas} aria-hidden />
      <figcaption key={c} className="rb-concepto-canal-actual" aria-hidden>
        <span className="rotulo flex items-center gap-1.5">
          <Signo canal={c} className="size-3" />
          Canal {CANAL[c].nombre}
        </span>
        <span className="t-chico">{CANAL[c].que}</span>
      </figcaption>
    </figure>
  );
}
