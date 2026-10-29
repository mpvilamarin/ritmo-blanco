"use client";

import { useRef, useState } from "react";
import { Cronograma } from "../cronograma";
import { Modo, Signo } from "../signos";
import { BoldLight } from "../sistema";
import { cambiarPrograma, usePrograma } from "@/lib/estado-programa";
import { ACTIVIDADES, CANAL, DIAS, FECHAS, SHOWS, capital, tipoLindo } from "@/lib/rb";
import { CANALES, MODALIDADES, NOMBRE_MODALIDAD, TIPOS, programa, type Tipo } from "@/lib/programa";

/* Tipo de actividad: cápsula con contorno, sin color (el color es de las zonas) */
function Capsula({ tipo }: { tipo: Tipo }) {
  return <span className="rotulo inline-flex shrink-0 border border-current px-1.5 py-0.5 leading-none">{tipo}</span>;
}

const chip = (on: boolean) =>
  `rotulo inline-flex shrink-0 cursor-pointer items-center gap-2 border border-vino px-3 py-1.5 transition-colors ${
    on ? "bg-vino text-blanco" : "hover:bg-crudo"
  }`;

/*
  Programa en una sola pantalla (100vh):
    · encabezado corto: rótulo, título y bajada en una línea
    · todas las jornadas como pestañas en una fila
    · dos vistas en el mismo lugar:
        line-up → grilla horaria: franjas en filas, canales en columnas, el cierre en vino
        actividades → filtros en una fila y un carrusel horizontal de tarjetas
*/
export function Programa() {
  const e = usePrograma();
  const pista = useRef<HTMLUListElement>(null);
  // "pantalla": un día por vez, en 100vh · "cuadricula": todas las jornadas como el cronograma impreso
  const [disposicion, setDisposicion] = useState<"pantalla" | "cuadricula">("pantalla");
  const cuadricula = disposicion === "cuadricula";
  const shows = SHOWS.filter((s) => s.dia === e.dia);
  const delDia = ACTIVIDADES.filter((a) => a.dia === e.dia);
  const filtradas = delDia
    .filter((a) => (!e.tipo || a.tipo === e.tipo) && (!e.modalidad || a.modalidad === e.modalidad) && (!e.zona || a.zona === e.zona))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  const cierre = shows.find((s) => s.cierre)!;
  const franjas = [...new Set(shows.filter((s) => !s.cierre).map((s) => s.inicio))];
  const escenario = programa.dias[0].lineup.escenario;

  const mover = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: quieto ? "auto" : "smooth" });
  };

  return (
    <section
      id="programa"
      aria-labelledby="programa-titulo"
      className={`contenido flex scroll-mt-0 flex-col gap-[2.5svh] py-[5svh] ${
        cuadricula ? "" : "min-h-[100svh] justify-center"
      }`}
    >
      <header>
        <p className="rotulo mb-3">{FECHAS.larga} · 14:00 a 23:00</p>
        <div className="w-full max-w-[44rem]">
          <BoldLight id="programa-titulo" fuerte="Programa" suave={`${DIAS.length === 4 ? "cuatro" : DIAS.length} jornadas`} max={132} />
        </div>
        <p className="t-cuerpo mt-3">
          Shows de 17 a 23 en el {escenario}. Talleres, charlas y clases desde las 14.
        </p>
        {/* Disposición y descarga */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Disposición" className="flex">
            {(
              [
                ["pantalla", "Por día"],
                ["cuadricula", "Cuadrícula"],
              ] as const
            ).map(([v, t]) => (
              <button key={v} type="button" aria-pressed={disposicion === v} onClick={() => setDisposicion(v)} className={`${chip(disposicion === v)} -ml-px first:ml-0`}>
                <IconoDisposicion tipo={v} />
                {t}
              </button>
            ))}
          </div>
          <a href="/ritmo-blanco-cronograma.pdf" download className={chip(false)}>
            <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11" />
            </svg>
            Descargá el PDF
          </a>
        </div>
      </header>

      {cuadricula && <Cronograma />}

      {!cuadricula && (
        <>
      {/* Días */}
      <div role="tablist" aria-label="Días" className="grid border-y border-vino" style={{ gridTemplateColumns: `repeat(${DIAS.length}, minmax(0, 1fr))` }}>
        {DIAS.map((d, i) => {
          const on = e.dia === d.numero;
          return (
            <button
              key={d.numero}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => cambiarPrograma({ dia: d.numero, abierta: null })}
              className={`flex cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors lg:flex-row lg:items-baseline lg:gap-4 lg:px-5 lg:py-3 ${
                i > 0 ? "border-l border-vino" : ""
              } ${on ? "bg-vino text-blanco" : "hover:bg-crudo"}`}
            >
              <span className="t-2">{d.fecha}</span>
              <span className="font-display text-sm leading-tight uppercase lg:text-base lg:whitespace-nowrap">
                <b className="font-black">{programa.dias[i].nombre[0]}</b> <span className="font-light">{programa.dias[i].nombre[1]}</span>
              </span>
            </button>
          );
        })}
      </div>

      <Jornada numero={e.dia} />

      {/* Vista */}
      <div role="tablist" aria-label="Vista" className="flex gap-6 border-b border-vino/20">
        {(
          [
            ["lineup", "Line-up", shows.length],
            ["actividades", "Talleres, charlas y clases", delDia.length],
          ] as const
        ).map(([v, label, n]) => {
          const on = e.vista === v;
          return (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => cambiarPrograma({ vista: v })}
              className={`rotulo -mb-px cursor-pointer border-b-2 py-2.5 ${on ? "border-vino" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              {label} · {n}
            </button>
          );
        })}
      </div>

      {e.vista === "lineup" && (
        <div>
          {/* Cabecera de canales: solo en escritorio */}
          <div className="hidden grid-cols-[7rem_repeat(3,minmax(0,1fr))] gap-6 pb-2 lg:grid">
            <span className="rotulo">{escenario}</span>
            {CANALES.map((c) => (
              <span key={c} className="rotulo flex items-center gap-2">
                <span className="grid size-6 place-items-center">
                  <Signo canal={c} className="size-3.5" />
                </span>
                {CANAL[c].nombre}
              </span>
            ))}
          </div>
          {franjas.map((inicio) => {
            const celdas = CANALES.map((c) => shows.find((s) => s.inicio === inicio && s.canal === c)!);
            return (
              <div key={inicio} className="grid grid-cols-[4rem_1fr] gap-x-4 border-t border-vino py-3 lg:grid-cols-[7rem_repeat(3,minmax(0,1fr))] lg:gap-6 lg:py-4">
                <p>
                  <span className="t-3 block">{inicio}</span>
                  <span className="rotulo mt-0.5 block">a {celdas[0].fin}</span>
                </p>
                <ul className="contents">
                  {celdas.map((a, k) => (
                    <li key={a.slug} className="col-start-2 flex items-center gap-3 py-1 lg:col-start-auto lg:block lg:py-0">
                      <span className="grid size-6 shrink-0 place-items-center lg:hidden">
                        <Signo canal={CANALES[k]} className="size-3" />
                      </span>
                      <span>
                        <span className="t-3 block text-[1rem] lg:text-[var(--tx-nombre)]">{a.nombre}</span>
                        <span className="t-chico hidden lg:block">{a.que}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="grid grid-cols-[4rem_1fr] gap-x-4 bg-vino px-0 py-4 text-blanco lg:grid-cols-[7rem_1fr] lg:gap-6 lg:py-5">
            <p className="pl-3 lg:pl-4">
              <span className="t-3 block">{cierre.inicio}</span>
              <span className="rotulo mt-0.5 block text-lila-palido">a {cierre.fin}</span>
            </p>
            <div className="pr-3">
              <p className="rotulo flex items-center gap-2 text-lila-palido">
                <span className="flex gap-1">
                  {CANALES.map((c) => (
                    <Signo key={c} canal={c} className="size-3" />
                  ))}
                </span>
                Cierre · los 3 canales a la vez
              </p>
              <p className="t-2 mt-2">{cierre.nombre}</p>
              <p className="t-chico mt-1 text-blanco/80">{capital(cierre.que)}</p>
            </div>
          </div>
        </div>
      )}

      {e.vista === "actividades" && (
        <div className="flex min-h-0 flex-col gap-4">
          {/* Filtros en una sola fila desplazable */}
          <div className="sin-barra flex items-center gap-1.5 overflow-x-auto">
            <button type="button" aria-pressed={!e.tipo} onClick={() => cambiarPrograma({ tipo: null })} className={chip(!e.tipo)}>
              Todo
            </button>
            {TIPOS.map((t) => (
              <button key={t} type="button" aria-pressed={e.tipo === t} onClick={() => cambiarPrograma({ tipo: t })} className={chip(e.tipo === t)}>
                {tipoLindo(t)}
              </button>
            ))}
            <span aria-hidden className="mx-2 h-5 w-px shrink-0 bg-vino/30" />
            {MODALIDADES.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={e.modalidad === m}
                onClick={() => cambiarPrograma({ modalidad: e.modalidad === m ? null : m })}
                className={chip(e.modalidad === m)}
              >
                <Modo modalidad={m} />
                {NOMBRE_MODALIDAD[m]}
              </button>
            ))}
            {e.zona && (
              <button type="button" onClick={() => cambiarPrograma({ zona: null })} className={chip(true)}>
                Zona: {e.zona} <span aria-hidden>✕</span>
                <span className="sr-solo">(sacar filtro)</span>
              </button>
            )}
          </div>

          {/* Carrusel de tarjetas rectas, en orden horario */}
          {filtradas.length ? (
            <ul ref={pista} tabIndex={0} aria-label="Actividades del día" className="sin-barra flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
              {filtradas.map((a) => {
                const z = programa.zonas[a.zona];
                return (
                  <li
                    key={a.clave}
                    className={`flex w-[78vw] shrink-0 snap-start flex-col border-y border-r border-vino p-4 pl-5 sm:w-[20rem] ${a.destacado ? "bg-crudo" : "bg-blanco"}`}
                    // Franja izquierda con el color de la zona; Desde Casa, solo contorno
                    style={{ borderLeft: z.borde ? `8px double ${z.borde}` : `8px solid ${z.color}` }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="t-2">{a.inicio}</span>
                      <span className="rotulo">
                        a {a.fin} · {a.duracion}
                      </span>
                    </div>
                    <p className="t-3 mt-3">{a.titulo}</p>
                    <p className="t-chico mt-2 line-clamp-3">{a.descripcion}</p>
                    <div className="rotulo mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-vino/25 pt-3">
                      <Capsula tipo={a.tipo} />
                      <Modo modalidad={a.modalidad} conTexto />
                      {/* El color de la zona ya está en la franja izquierda: acá solo el nombre */}
                      <span>
                        {a.zona}
                      </span>
                    </div>
                    {a.destacado && <span className="rotulo mt-3">Destacada del día</span>}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="t-3 py-10">Nada con esos filtros este día.</p>
          )}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => mover(-1)} aria-label="Actividades anteriores" className={chip(false)}>
              ←
            </button>
            <button type="button" onClick={() => mover(1)} aria-label="Actividades siguientes" className={chip(false)}>
              →
            </button>
            <span className="rotulo">
              {filtradas.length} de {delDia.length} actividades
            </span>
          </div>
        </div>
      )}
        </>
      )}
    </section>
  );
}

/*
  Jornada elegida: el número gigante rosa detrás del nombre (bold/light), como
  en el impreso y la remera. Los datos chicos van al costado, nunca encima del
  número; la frase es el guiño de la jornada.
*/
function Jornada({ numero }: { numero: number }) {
  const d = programa.dias[numero - 1];
  return (
    <div className="grid items-end gap-4 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-10">
      <div className="relative isolate pt-[clamp(1.5rem,4vw,3rem)] pl-[clamp(1rem,3vw,2.5rem)]">
        <span aria-hidden className="t-cifra absolute top-0 left-0 -z-10 text-[clamp(7rem,16vw,12rem)] leading-[0.75] text-rosa">
          {d.numero}
        </span>
        <BoldLight as="h3" fuerte={d.nombre[0]} suave={d.nombre[1]} max={96} />
      </div>
      <div className="flex flex-col gap-1.5 md:border-l md:border-vino md:pl-6">
        <p className="rotulo">
          {DIAS[numero - 1].etiqueta} · {DIAS[numero - 1].fecha} · {d.horario}
        </p>
        <p className="t-3">{d.generos.replace(/\.$/, "")}</p>
        <p className="t-chico max-w-[36rem]">{d.frase}</p>
      </div>
    </div>
  );
}

/* Íconos de disposición: una columna ancha (por día) o tres columnas (cuadrícula) */
function IconoDisposicion({ tipo }: { tipo: "pantalla" | "cuadricula" }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
      {tipo === "pantalla" ? <rect x="2" y="2.5" width="12" height="11" /> : <path d="M2 2.5h12v11H2zM6 2.5v11M10 2.5v11" />}
    </svg>
  );
}
