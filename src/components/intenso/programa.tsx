"use client";

import { useState } from "react";
import { Arena } from "../arena";
import { nombreCanal } from "../canal";
import { Modo, Signo } from "../signos";
import { useCanal } from "@/lib/estado";
import { CANALES, diaSemana, fechaCorta, ordenarActividades, partirHorario, programa, type Dia } from "@/lib/programa";

/*
  Programa como lista de jornadas grandes (acordeón). El día abierto muestra
  el line-up por canal, el cierre como único bloque claro y las actividades.
*/
export function ProgramaIntenso() {
  const [abierto, setAbierto] = useState(0);

  return (
    <section id="programa" aria-labelledby="programa-titulo" className="scroll-mt-16 border-t border-blanco/10 py-24 md:py-36">
      <div className="mx-auto max-w-[80rem] px-5 md:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="rotulo text-rosa">Programa · {programa.fechas}</p>
            <h2 id="programa-titulo" className="mt-5 font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.88] font-bold tracking-[-0.03em] uppercase">
              Tres jornadas
            </h2>
          </div>
          <p className="max-w-[26rem] text-blanco/75 md:justify-self-end">
            Cada día cambia el carácter, no la importancia. A las 21:30 los tres canales transmiten al mismo artista.
          </p>
        </div>

        <ul className="mt-14 border-t border-blanco/25">
          {programa.dias.map((d, i) => {
            const activo = abierto === i;
            return (
              <li key={d.numero} className="border-b border-blanco/25">
                <h3>
                  <button
                    type="button"
                    aria-expanded={activo}
                    aria-controls={`jornada-${d.numero}`}
                    onClick={() => setAbierto(activo ? -1 : i)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-6 text-left md:grid-cols-[4rem_1fr_14rem_3rem] md:py-8"
                  >
                    <span className="rotulo text-rosa">0{d.numero}</span>
                    <span className="font-display text-[clamp(2.2rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.03em] uppercase transition-colors group-hover:text-rosa">
                      <b className="font-bold">{d.nombre[0]}</b> <span className="font-light">{d.nombre[1]}</span>
                    </span>
                    <span className="hidden text-right md:block">
                      <span className="rotulo block">
                        {diaSemana(d.fecha)} {fechaCorta(d.fecha)}
                      </span>
                      <span className="mt-1 block text-[0.8125rem] text-blanco/70">{d.generos}</span>
                    </span>
                    <span
                      aria-hidden
                      className={`justify-self-end font-display text-4xl font-light transition-transform duration-300 ${activo ? "rotate-45 text-rosa" : ""}`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div id={`jornada-${d.numero}`} hidden={!activo}>
                  {activo && <Jornada dia={d} />}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Jornada({ dia }: { dia: Dia }) {
  const canal = useCanal();
  const cierre = dia.lineup.cierre;
  const [desdeCierre, hastaCierre] = partirHorario(cierre.horario);

  return (
    <div className="pb-14">
      <p className="mb-10 max-w-[36rem] font-display text-2xl leading-tight md:hidden">{dia.generos}</p>
      <p className="mb-12 max-w-[40rem] text-lg text-blanco/80">{dia.frase}</p>

      {/* Line-up: una fila por artista, el dato chico al lado */}
      <div className="grid gap-10 lg:grid-cols-[10rem_1fr]">
        <p className="rotulo text-rosa">Line-up · {dia.lineup.escenario}</p>
        <div className="space-y-10">
          {dia.lineup.sets.map((set) => {
            const [desde, hasta] = partirHorario(set.horario);
            return (
              <div key={set.horario}>
                <p className="rotulo mb-3 text-blanco/70">
                  {desde} — {hasta}
                </p>
                <ul className="border-t border-blanco/15">
                  {CANALES.map((c) => {
                    const { artista, descripcion } = set.canales[c];
                    const tuyo = canal === c;
                    return (
                      <li
                        key={c}
                        className={`grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-blanco/15 py-4 ${tuyo ? "text-rosa" : ""}`}
                      >
                        <p className="font-display text-2xl leading-tight font-bold tracking-[-0.01em] uppercase md:text-4xl">
                          {artista}
                          <span className="mt-1 block font-mono text-[0.8125rem] font-normal tracking-normal text-blanco/65 normal-case md:mt-0 md:ml-4 md:inline">
                            / {descripcion}
                          </span>
                        </p>
                        <span className="rotulo flex items-center gap-2">
                          <Signo canal={c} className="size-4" />
                          <span className="hidden sm:inline">{nombreCanal(c)}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cierre: el único bloque claro, con el degradé y la arena del afiche */}
      <div
        className="con-grano relative mt-16 overflow-hidden text-vino"
        style={{
          background:
            "radial-gradient(70% 90% at 90% 0%, #fff0db 0%, #f8d9c4 25%, transparent 60%), radial-gradient(60% 80% at 0% 100%, #9195b4 0%, transparent 70%), linear-gradient(110deg, #b3a5ba, #e1b0c1 55%, #edcdb8)",
        }}
      >
        <div aria-hidden className="absolute inset-0 opacity-80">
          <Arena fijo="todos" particulas={9000} />
        </div>
        <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-end md:p-12">
          <div>
            <p className="rotulo flex flex-wrap items-center gap-2">
              Cierre · {desdeCierre} a {hastaCierre} · los tres canales
              <span className="flex gap-0.5">
                {CANALES.map((c) => (
                  <Signo key={c} canal={c} className="size-3.5" />
                ))}
              </span>
            </p>
            <p className="mt-4 font-display text-[clamp(2.8rem,9vw,7rem)] leading-[0.88] font-bold tracking-[-0.03em] uppercase">
              {cierre.artista}
            </p>
            <p className="mt-3 text-base">{cierre.descripcion}</p>
          </div>
          <p className="rotulo bg-blanco/75 px-3 py-2 md:justify-self-end">Todo el parque, el mismo artista</p>
        </div>
      </div>

      {/* Actividades */}
      <div className="mt-16 grid gap-10 lg:grid-cols-[10rem_1fr]">
        <p className="rotulo text-rosa">Actividades · {dia.actividades.length}</p>
        <ul className="border-t border-blanco/15">
          {ordenarActividades(dia.actividades).map((a) => {
            const z = programa.zonas[a.zona];
            return (
              <li
                key={a.titulo}
                className="grid grid-cols-[4.25rem_1fr] gap-x-4 gap-y-2 border-b border-blanco/15 py-5 md:grid-cols-[6rem_1fr_15rem]"
              >
                <time className="font-display text-2xl leading-none font-bold text-rosa md:text-3xl">{a.inicio}</time>
                <div>
                  <p className="font-display text-xl leading-tight font-bold md:text-2xl">
                    {a.titulo}
                    {a.destacado && <span className="rotulo ml-3 align-middle bg-rosa px-1.5 py-0.5 text-vino">Destacada</span>}
                  </p>
                  <p className="mt-1.5 max-w-[42rem] text-[0.8125rem] leading-relaxed text-blanco/70">{a.descripcion}</p>
                </div>
                <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:col-start-3 md:flex-col md:items-end md:text-right">
                  <span className="rotulo flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2.5 shrink-0"
                      style={{ background: z.color, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.5)" }}
                    />
                    {a.zona}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="rotulo border border-blanco/40 px-1.5 py-0.5">{a.tipo}</span>
                    <Modo modalidad={a.modalidad} conTexto />
                  </span>
                  <span className="rotulo text-blanco/60">
                    Hasta {a.fin} · {a.duracion}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
