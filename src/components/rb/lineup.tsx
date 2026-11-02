"use client";

import { useState } from "react";
import { Foto, boton } from "./base";
import { BotonMovimiento } from "./hero";
import { Signo } from "../signos";
import { BoldLight } from "../sistema";
import { CANAL, DIAS, PALETA, SHOWS, type Show } from "@/lib/rb";
import { CANALES, type CanalId } from "@/lib/programa";
import { fotoArtista } from "@/lib/fotos";

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

/* Los canales se distinguen por signo, no por color: solo el cierre lleva anillo */
const anillo = (s: Show) => (s.canal === "todos" ? PALETA.vino : "transparent");
const canalDe = (s: Show) => (s.canal === "todos" ? "Cierre" : CANAL[s.canal].nombre);

function Artista({ s, grande }: { s: Show; grande: boolean }) {
  const foto = fotoArtista(s.slug);
  return (
    <div className={`rb-artista flex flex-col items-center text-center ${grande ? "rb-artista-grande" : "rb-artista-chico"}`}>
      <div className={`aspect-square w-full rounded-full ${grande ? "p-1.5" : "p-1"}`} style={{ background: anillo(s) }}>
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt={s.nombre} width={520} height={520} loading="lazy" className="size-full rounded-full object-cover" />
        ) : (
          <Foto circulo texto="[FOTO DE PRENSA]" className="size-full" />
        )}
      </div>
      <div>
        <p className="rb-artista-nombre">{s.nombre}</p>
        {grande && <p className="t-chico mt-1">{s.que}</p>}
        <p className="rb-artista-datos mt-1 inline-flex flex-wrap justify-center items-center gap-1">
          {DIAS[s.dia - 1].fecha} · {grande ? `${s.inicio} · ` : ""}
          {s.canal !== "todos" && <Signo canal={s.canal} className="size-3" />}
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
        <li key={i} className="flex flex-none flex-col gap-3 px-3 lg:px-5">
          {"grande" in c ? <Artista s={c.grande} grande /> : c.par.map((s) => <Artista key={s.slug} s={s} grande={false} />)}
        </li>
      ))}
    </ul>
  );

  return (
    // Todo en una pantalla: el carrusel toma el alto que queda
    <section id="lineup" aria-labelledby="lineup-titulo" className="rb-lineup scroll-mt-0 bg-blanco text-vino">
      <div className="contenido">
        <header className="encabezado">
          <p className="rotulo">{SHOWS.length} artistas · 3 canales · {DIAS.length} jornadas</p>
          <BoldLight id="lineup-titulo" fuerte="Line-up" suave="en tus auriculares" />
          <p className="bajada">Cada artista suena en un canal. En el cierre de cada noche, los tres canales transmiten lo mismo.</p>
        </header>
        <div role="group" aria-label="Filtrar por canal" className="flex flex-wrap gap-2">
          {[null, ...CANALES].map((c) => {
            const on = canal === c;
            return (
              <button
                key={c ?? "todos"}
                type="button"
                aria-pressed={on}
                onClick={() => setCanal(c)}
                className={`rotulo inline-flex min-h-11 cursor-pointer items-center gap-2 border px-3 lg:px-4 ${
                  on ? "border-vino bg-vino text-blanco" : "border-vino hover:bg-crudo"
                }`}
              >
                {c && <Signo canal={c} className="size-3.5" />}
                {c ? CANAL[c].nombre : "Todos"}
              </button>
            );
          })}
          <BotonMovimiento className="rotulo inline-flex min-h-11 items-center px-1 underline underline-offset-4 sm:ml-auto" />
        </div>
      </div>

      {/* Pasa sola y se frena con el mouse, el foco o la pausa; quieta, se recorre a mano */}
      <div className="rb-lineup-ventana rb-carrusel-pausa sin-barra" tabIndex={0} role="region" aria-label="Artistas">
        <div key={canal ?? "todos"} className="rb-carrusel flex w-max" style={{ ["--duracion" as string]: `${base.length * 4}s` }}>
          {pista(false)}
          {pista(true)}
        </div>
      </div>

      <div className="contenido flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-vino/25 pt-4">
        <ul className="hidden flex-wrap gap-x-6 gap-y-2 lg:flex">
          {CANALES.map((c) => (
            <li key={c} className="rotulo inline-flex items-center gap-2">
              <Signo canal={c} className="size-3.5" />
              {CANAL[c].nombre} · {CANAL[c].que}
            </li>
          ))}
        </ul>
        <a href="#programa" className={boton("vino")}>
          Mirá los horarios en el programa
        </a>
      </div>
    </section>
  );
}
