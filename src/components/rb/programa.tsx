"use client";

import { useState } from "react";
import { LineaActividades } from "./actividades";
import { Modo, Signo } from "../signos";
import { BoldLight } from "../sistema";
import { cambiarPrograma, usePrograma } from "@/lib/estado-programa";
import { ACTIVIDADES, CANAL, DIAS, FECHAS, SHOWS, capital, tipoLindo } from "@/lib/rb";
import { CANALES, MODALIDADES, NOMBRE_MODALIDAD, TIPOS, programa } from "@/lib/programa";

/* Pestañas: las flechas (e Inicio/Fin) eligen la de al lado y le pasan el foco */
function flechas(e: React.KeyboardEvent<HTMLButtonElement>, i: number, total: number, elegir: (j: number) => void) {
  const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: total - 1 }[e.key];
  if (j === undefined) return;
  e.preventDefault();
  const destino = (j + total) % total;
  elegir(destino);
  (e.currentTarget.parentElement?.children[destino] as HTMLElement | undefined)?.focus();
}

const chip = (on: boolean) =>
  `rotulo inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border border-vino px-3 py-2 transition-colors ${
    on ? "bg-vino text-blanco" : "hover:bg-crudo"
  }`;

/* Día, tipo de propuesta y filtros; las vistas generales quedan como opción secundaria. */
export function Programa() {
  const e = usePrograma();
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
  // Entre el último set y el cierre el escenario descansa: esa franja la llenan las actividades del predio
  const finSets = shows.find((s) => s.inicio === franjas.at(-1))!.fin;
  const entreSets = delDia.filter((a) => a.inicio >= finSets && a.inicio < cierre.inicio).sort((a, b) => a.zona.localeCompare(b.zona));
  const hora = (t: string) => t.replace(":00", "");
  const VISTAS = [
    ["lineup", "Line-up", shows.length],
    ["actividades", "Talleres, charlas y clases", delDia.length],
  ] as const;

  // Disposición y descarga: arriba en la cuadrícula; en la vista por día, al lado de las pestañas
  const opciones = (
    <details className={cuadricula ? "border-b border-vino/25 pb-4" : "self-center"}>
      <summary className="t-chico flex min-h-11 w-fit cursor-pointer items-center underline underline-offset-4">
        Todas las jornadas o PDF
      </summary>
      {/* Disposición y descarga */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Disposición" className="flex">
          {(
            [
              ["pantalla", "Por día"],
              ["cuadricula", "Cuadrícula"],
            ] as const
          ).map(([v, t]) => (
            <button
              key={v}
              type="button"
              aria-pressed={disposicion === v}
              onClick={() => setDisposicion(v)}
              className={`${chip(disposicion === v)} -ml-px first:ml-0`}
            >
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
    </details>
  );

  return (
    <section id="programa" aria-labelledby="programa-titulo" className="pantalla scroll-mt-4 bg-blanco">
      <div className="contenido">
        <header className="encabezado">
          <p className="rotulo">{FECHAS.larga} · 14:00 a 23:00</p>
          <BoldLight id="programa-titulo" fuerte="Programa" suave={`${DIAS.length === 4 ? "cuatro" : DIAS.length} jornadas`} />
          <p className="bajada">
            Shows de {hora(franjas[0])} a {hora(finSets)} y cierre a las {cierre.inicio} en el {escenario}. Talleres, charlas y clases desde
            las 14.
          </p>
        </header>

        <div className="flex flex-col gap-6 lg:gap-3">
          {cuadricula && opciones}

          {/* Todas las jornadas, una debajo de la otra, como en el impreso */}
          {cuadricula &&
            DIAS.map((d) => (
              <div key={d.numero} className="flex flex-col gap-5 border-t border-vino pt-6">
                <Jornada numero={d.numero} />
                <LineaActividades lista={ACTIVIDADES.filter((a) => a.dia === d.numero)} etiqueta={`Actividades del ${d.etiqueta}`} />
              </div>
            ))}

          {!cuadricula && (
            <>
              {/* Días */}
              <div
                role="tablist"
                aria-label="Días"
                className="grid border-y border-vino"
                style={{ gridTemplateColumns: `repeat(${DIAS.length}, minmax(0, 1fr))` }}
              >
                {DIAS.map((d, i) => {
                  const on = e.dia === d.numero;
                  return (
                    <button
                      key={d.numero}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => cambiarPrograma({ dia: d.numero, abierta: null })}
                      onKeyDown={(ev) => flechas(ev, i, DIAS.length, (j) => cambiarPrograma({ dia: DIAS[j].numero, abierta: null }))}
                      className={`flex cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors lg:flex-row lg:items-baseline lg:gap-4 lg:px-5 lg:py-2 ${
                        i > 0 ? "border-l border-vino" : ""
                      } ${on ? "bg-vino text-blanco" : "hover:bg-crudo"}`}
                    >
                      <span className="t-2">{d.fecha}</span>
                      <span className="font-display text-[length:var(--tx-cuerpo)] leading-tight uppercase lg:whitespace-nowrap">
                        <b className="font-black">{programa.dias[i].nombre[0]}</b>{" "}
                        <span className="font-normal">{programa.dias[i].nombre[1]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <Jornada numero={e.dia} />

              {/* Vista */}
              <div className="flex flex-wrap items-end justify-between gap-x-6 border-b border-vino/20">
                <div role="tablist" aria-label="Vista" className="flex gap-6">
                  {VISTAS.map(([v, label, n], i) => {
                    const on = e.vista === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        tabIndex={on ? 0 : -1}
                        onClick={() => cambiarPrograma({ vista: v })}
                        onKeyDown={(ev) => flechas(ev, i, VISTAS.length, (j) => cambiarPrograma({ vista: VISTAS[j][0] }))}
                        className={`rotulo -mb-px min-h-11 cursor-pointer border-b-[3px] py-2.5 ${on ? "border-vino font-bold" : "border-transparent font-normal hover:border-vino/40"}`}
                      >
                        {label} · {n}
                      </button>
                    );
                  })}
                </div>
                {opciones}
              </div>

              {e.vista === "lineup" && (
                <div>
                  {/* Cabecera de canales: solo en escritorio */}
                  <div className="hidden grid-cols-[7rem_repeat(3,minmax(0,1fr))] gap-6 pb-1 lg:grid">
                    <span className="rotulo">Escenario</span>
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
                      <div
                        key={inicio}
                        className="grid grid-cols-[4rem_1fr] gap-x-4 border-t border-vino py-3 lg:grid-cols-[7rem_repeat(3,minmax(0,1fr))] lg:gap-6 lg:py-2.5"
                      >
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
                                <span className="t-3 block">{a.nombre}</span>
                                <span className="t-chico hidden lg:block">{a.que}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  {entreSets.length > 0 && (
                    <div className="grid grid-cols-[4rem_1fr] gap-x-4 border-t border-vino py-3 lg:grid-cols-[7rem_1fr] lg:gap-6">
                      <p>
                        <span className="t-3 block">{finSets}</span>
                        <span className="rotulo mt-0.5 block">a {cierre.inicio}</span>
                      </p>
                      {/* Una sola línea: el detalle de cada actividad está en la pestaña de al lado */}
                      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 self-center">
                        <p className="rotulo">El escenario descansa · en el predio</p>
                        <ul className="contents">
                          {entreSets.map((a) => (
                            <li key={a.clave} className="t-cuerpo">
                              <b className="font-semibold">{a.titulo}</b> · {a.zona}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-[4rem_1fr] gap-x-4 bg-vino px-0 py-4 text-blanco lg:grid-cols-[7rem_1fr] lg:gap-6 lg:py-3">
                    <p className="pl-3 lg:pl-4">
                      <span className="t-3 block">{cierre.inicio}</span>
                      <span className="rotulo mt-0.5 block text-lila-palido">a {cierre.fin}</span>
                    </p>
                    <div className="flex flex-wrap items-end justify-between gap-x-6 pr-3 lg:pr-4">
                      <div>
                        <p className="rotulo flex items-center gap-2 text-lila-palido">
                          <span className="flex gap-1">
                            {CANALES.map((c) => (
                              <Signo key={c} canal={c} className="size-3" />
                            ))}
                          </span>
                          Cierre · los 3 canales a la vez
                        </p>
                        <p className="t-2 mt-1">{cierre.nombre}</p>
                      </div>
                      <p className="t-chico text-blanco/80 lg:pb-1">{capital(cierre.que)}</p>
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
                      <button
                        key={t}
                        type="button"
                        aria-pressed={e.tipo === t}
                        onClick={() => cambiarPrograma({ tipo: t })}
                        className={chip(e.tipo === t)}
                      >
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

                  {/* Cajas como en el impreso, sobre la línea horaria del día */}
                  {filtradas.length ? (
                    <LineaActividades lista={filtradas} etiqueta={`Actividades del ${DIAS[e.dia - 1].etiqueta}`} />
                  ) : (
                    <p className="t-3 py-10">Nada con esos filtros este día.</p>
                  )}
                  <p className="rotulo" aria-live="polite">
                    {filtradas.length} de {delDia.length} actividades · {ACTIVIDADES.length} en las {DIAS.length} jornadas · Tocá una caja
                    para ver de qué se trata
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
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
      <div className="relative isolate min-h-[clamp(4rem,6vw,4.75rem)] pt-[clamp(1rem,2vw,1.5rem)] pl-[clamp(1rem,2.5vw,2rem)]">
        <span aria-hidden className="t-cifra absolute top-0 left-0 -z-10 text-[clamp(5rem,8vw,6.5rem)] leading-[0.75] text-rosa">
          {d.numero}
        </span>
        <BoldLight as="h3" fuerte={d.nombre[0]} suave={d.nombre[1]} max={96} className="rb-titulo-linea" />
      </div>
      <div className="flex flex-col gap-1 md:border-l md:border-vino md:pl-6">
        <p className="rotulo">
          {DIAS[numero - 1].etiqueta} · {DIAS[numero - 1].fecha} · {d.horario}
        </p>
        <p className="t-3">{d.generos.replace(/\.$/, "")}</p>
        <p className="t-chico">{d.frase}</p>
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
