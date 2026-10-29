"use client";

import { useState } from "react";
import { Encabezado, Foto, boton } from "./base";
import { Signo } from "../signos";
import { CANAL, DIAS, SHOWS, type Show } from "@/lib/rb";
import { CANALES, type CanalId } from "@/lib/programa";

type Columna = { grande: Show } | { par: Show[] };

/* Ritmo del carrusel: un círculo grande y dos chicos apilados; los cierres, siempre grandes */
function columnas(lista: Show[]) {
  const cols: Columna[] = [];
  for (let i = 0, g = 0; i < lista.length; g++) {
    if (g % 3 === 0 || lista[i].cierre) {
      cols.push({ grande: lista[i] });
      i++;
    } else {
      const par = lista.slice(i, i + 2);
      if (par[1]?.cierre) {
        cols.push({ grande: par[0] });
        i++;
      } else {
        cols.push({ par });
        i += par.length;
      }
    }
  }
  return cols;
}

const anillo = (s: Show) => (s.canal === "todos" ? "#ffffff" : CANAL[s.canal].color);
const canalDe = (s: Show) => (s.canal === "todos" ? "Cierre" : CANAL[s.canal].nombre);

function Artista({ s, grande }: { s: Show; grande: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-3 text-center ${grande ? "w-[min(46vw,24svh)] lg:w-[min(20vw,30svh)]" : "w-[min(28vw,10svh)] lg:w-[min(10vw,13svh)]"}`}>
      <div className={`aspect-square w-full rounded-full ${grande ? "p-1.5" : "p-1"}`} style={{ background: anillo(s) }}>
        <Foto circulo texto="[FOTO DE PRENSA]" className="size-full" />
      </div>
      <div>
        <p className="t-3">{s.nombre}</p>
        {grande && <p className="t-chico mt-1 text-rosa">{s.que}</p>}
        <p className="rotulo mt-1.5 text-lila">
          {DIAS[s.dia - 1].fecha} · {grande ? `${s.inicio} · ` : ""}
          {canalDe(s)}
        </p>
      </div>
    </div>
  );
}

export function LineUp() {
  const [canal, setCanal] = useState<CanalId | null>(null);
  const lista = SHOWS.filter((s) => !canal || s.canal === canal || s.canal === "todos");
  const cols = columnas(lista);
  // Se repite hasta llenar la pista y se duplica para que el loop no tenga corte
  let base = cols;
  while (base.length < 8) base = base.concat(cols);

  const pista = (copia: boolean) => (
    <ul aria-hidden={copia || undefined} className="flex flex-none items-center">
      {base.map((c, i) => (
        <li key={i} className="flex flex-none flex-col gap-4 px-3 lg:px-5">
          {"grande" in c ? <Artista s={c.grande} grande /> : c.par.map((s) => <Artista key={s.slug} s={s} grande={false} />)}
        </li>
      ))}
    </ul>
  );

  return (
    // Todo en una pantalla: el carrusel toma el alto que queda
    <section id="lineup" aria-labelledby="lineup-titulo" className="flex min-h-[100svh] scroll-mt-0 flex-col justify-center gap-[2.5svh] overflow-hidden bg-vino py-[3.5svh] lg:gap-[3svh] lg:py-[5svh] text-blanco lg:h-[100svh] lg:min-h-[640px]">
      <div className="contenido">
        <Encabezado
          centrado
          id="lineup-titulo"
          rotulo={`${SHOWS.length} artistas · 3 canales · ${DIAS.length} días`}
          titulo="Line-up"
          claro
          texto={<p className="text-melocoton">Cada artista suena en un canal. En el cierre de cada noche, los tres canales transmiten lo mismo.</p>}
        />
        <div role="group" aria-label="Filtrar por canal" className="mt-[2.5svh] flex flex-wrap justify-center gap-2">
          {[null, ...CANALES].map((c) => {
            const on = canal === c;
            return (
              <button
                key={c ?? "todos"}
                type="button"
                aria-pressed={on}
                onClick={() => setCanal(c)}
                className={`rotulo inline-flex cursor-pointer items-center gap-2 border px-3 py-2 lg:px-4 lg:py-2.5 ${
                  on ? "border-rosa bg-rosa text-vino" : "border-blanco/40 hover:border-blanco"
                }`}
              >
                {c && <Signo canal={c} className="size-3.5" />}
                {c ? CANAL[c].nombre : "Todos"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pasa sola y se frena al pasar el mouse; con movimiento reducido se recorre a mano */}
      <div className="rb-carrusel-pausa sin-barra overflow-hidden" tabIndex={0} aria-label="Artistas">
        <div key={canal ?? "todos"} className="rb-carrusel flex w-max" style={{ ["--duracion" as string]: `${base.length * 4}s` }}>
          {pista(false)}
          {pista(true)}
        </div>
      </div>

      <div className="contenido flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-blanco/20 pt-4">
        <ul className="hidden flex-wrap gap-x-6 gap-y-2 lg:flex">
          {CANALES.map((c) => (
            <li key={c} className="rotulo inline-flex items-center gap-2">
              <Signo canal={c} className="size-3.5 text-rosa" />
              {CANAL[c].nombre} · {CANAL[c].que}
            </li>
          ))}
        </ul>
        <a href="#programa" className={boton("rosa")}>
          Ver horarios en el programa
        </a>
      </div>
    </section>
  );
}
