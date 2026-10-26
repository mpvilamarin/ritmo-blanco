"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Actividad } from "./actividad";
import { Encabezado } from "./recursos";
import { nombreCanal } from "./canal";
import { FotoPendiente, Modo, Signo } from "./signos";
import { Titulo } from "./titulo";
import { alternarFiltro, limpiarFiltros, useCanal, useFiltros, type Filtros } from "@/lib/estado";
import {
  CANALES,
  MODALIDADES,
  TIPOS,
  diaSemana,
  fechaCorta,
  ordenarActividades,
  partirHorario,
  programa,
  sitio,
  type Actividad as A,
  type Dia,
} from "@/lib/programa";

function cumple(a: A, f: Filtros) {
  return (
    (!f.zona.length || f.zona.includes(a.zona)) &&
    (!f.tipo.length || f.tipo.includes(a.tipo)) &&
    (!f.modalidad.length || f.modalidad.includes(a.modalidad))
  );
}

const sinSuscripcion = () => () => {};

/* Si hoy es un día del festival, el programa abre en ese día */
function diaDeHoy() {
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  return Math.max(0, programa.dias.findIndex((d) => d.fecha === hoy));
}

export function Programa() {
  const dias = programa.dias;
  const [elegido, setActual] = useState<number | null>(null);
  const hoy = useSyncExternalStore(sinSuscripcion, diaDeHoy, () => 0);
  const actual = elegido ?? hoy;
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);

  const teclas = (e: React.KeyboardEvent) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const j = (actual + delta + dias.length) % dias.length;
    setActual(j);
    pestanas.current[j]?.focus();
  };

  return (
    <section id="programa" aria-labelledby="programa-titulo" className="reticula gap-y-10 pt-24 md:pt-32">
      <Encabezado id="programa-titulo" rotulo={sitio.programa.rotulo} titulo={sitio.programa.titulo} />

      <div role="tablist" aria-label="Jornadas" className="col-span-full grid grid-cols-3 border border-vino">
        {dias.map((d, i) => {
          const elegido = i === actual;
          return (
            <button
              key={d.numero}
              ref={(b) => {
                pestanas.current[i] = b;
              }}
              id={`pestana-${d.numero}`}
              role="tab"
              type="button"
              aria-selected={elegido}
              aria-controls={`dia-${d.numero}`}
              tabIndex={elegido ? 0 : -1}
              onClick={() => setActual(i)}
              onKeyDown={teclas}
              className={`flex flex-col items-start gap-1 px-3 py-2.5 text-left transition-colors md:px-4 ${
                i > 0 ? "border-l border-vino" : ""
              } ${elegido ? "bg-vino text-blanco" : "hover:bg-rosa"}`}
            >
              <span className="rotulo">Día {d.numero}</span>
              <span className="font-display text-lg leading-none font-bold uppercase md:text-2xl">
                {d.nombre[0]}
              </span>
              <span className="rotulo">{fechaCorta(d.fecha)}</span>
            </button>
          );
        })}
      </div>

      {dias.map((d, i) => (
        <div
          key={d.numero}
          id={`dia-${d.numero}`}
          role="tabpanel"
          aria-labelledby={`pestana-${d.numero}`}
          hidden={i !== actual}
          className="col-span-full"
        >
          <Jornada dia={d} activa={i === actual} />
        </div>
      ))}
    </section>
  );
}

function Jornada({ dia, activa }: { dia: Dia; activa: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6">
      <Cabecera dia={dia} />
      <LineUp dia={dia} />
      <Cierre dia={dia} />
      <Actividades dia={dia} activa={activa} />
    </div>
  );
}

/* Número gigante en rosa detrás del nombre de la jornada */
function Cabecera({ dia }: { dia: Dia }) {
  return (
    <header className="relative grid gap-6 pt-6 md:grid-cols-2 lg:col-span-12 lg:grid-cols-12">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 right-0 font-display text-[16rem] leading-none font-bold text-rosa select-none md:right-auto md:left-[38%] md:text-[20rem] lg:-top-10"
      >
        {dia.numero}
      </span>
      <div className="relative lg:col-span-5">
        <p className="rotulo mb-3">
          {diaSemana(dia.fecha)} {fechaCorta(dia.fecha)} · {dia.horario.replace("–", " a ")}
        </p>
        <div className="w-[80%] md:w-full">
          <Titulo as="h3" fuerte={dia.nombre[0]} suave={dia.nombre[1]} max={150} className="text-7xl" />
        </div>
      </div>
      <div className="relative self-end filete pt-3 lg:col-span-5 lg:col-start-8">
        <p className="font-display text-xl leading-tight font-medium">{dia.generos}</p>
        <p className="mt-2">{dia.frase}</p>
      </div>
    </header>
  );
}

function LineUp({ dia }: { dia: Dia }) {
  const canal = useCanal();
  const orden = canal ? [canal, ...CANALES.filter((c) => c !== canal)] : CANALES;
  return (
    <section aria-labelledby={`lineup-${dia.numero}`} className="lg:col-span-7">
      <div className="flex items-center gap-4">
        <h4 id={`lineup-${dia.numero}`} className="shrink-0 font-display text-xl uppercase">
          Line-up · {dia.lineup.escenario}
        </h4>
        <span className="h-px flex-1 bg-vino" />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1" aria-label="Canales">
        {CANALES.map((c) => (
          <li key={c} className="rotulo flex items-center gap-1.5">
            <Signo canal={c} className="size-3.5" /> Canal {nombreCanal(c)}
          </li>
        ))}
      </ul>
      {dia.lineup.sets.map((set) => {
        const [desde, hasta] = partirHorario(set.horario);
        return (
          <div key={set.horario} className="mt-6 flex gap-4 filete pt-4">
            <p
              className="shrink-0 font-display text-4xl leading-none font-bold [writing-mode:vertical-rl] rotate-180"
              aria-label={`De ${desde} a ${hasta}`}
            >
              {desde}
            </p>
            <ul className="grid flex-1 gap-4 md:grid-cols-3">
              {orden.map((c) => {
                const { artista, descripcion } = set.canales[c];
                const tuyo = canal === c;
                return (
                  <li key={c} className={`flex gap-2.5 ${tuyo ? "md:col-span-3" : ""}`}>
                    <Signo canal={c} className={tuyo ? "mt-1 size-6" : "mt-0.5 size-4"} />
                    <div>
                      <p
                        className={`font-display leading-tight font-bold uppercase ${
                          tuyo ? "text-3xl md:text-4xl" : "text-lg"
                        }`}
                      >
                        {artista}
                      </p>
                      <p className="text-[0.8125rem]">
                        {descripcion}
                        <span className="sr-solo"> · Canal {nombreCanal(c)}</span>
                      </p>
                      {tuyo && <p className="rotulo mt-1">Tu canal · hasta {hasta}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

/* El momento central del día: los tres canales, el mismo artista */
function Cierre({ dia }: { dia: Dia }) {
  const c = dia.lineup.cierre;
  const [desde, hasta] = partirHorario(c.horario);
  return (
    <section aria-label="Cierre" className="flex flex-col lg:col-span-5">
      <FotoPendiente texto="[FOTO DE PRENSA]" className="aspect-[16/7] lg:aspect-[16/9]" />
      <div className="flex flex-1 flex-col gap-3 bg-rosa p-4">
        <p className="rotulo">
          Cierre · {desde} a {hasta}
        </p>
        <p className="font-display text-4xl leading-[0.95] font-bold uppercase md:text-5xl">{c.artista}</p>
        <p>{c.descripcion}</p>
        {c.todos_los_canales && (
          <p className="mt-auto flex items-center gap-3 filete pt-3">
            <span className="relative h-7 w-14" aria-hidden>
              {CANALES.map((k, i) => (
                <span key={k} className="absolute top-0 size-7" style={{ left: `${i * 14}px` }}>
                  <Signo canal={k} className="size-7" />
                </span>
              ))}
            </span>
            <span className="rotulo">{sitio.programa.cierre_rotulo}</span>
          </p>
        )}
      </div>
    </section>
  );
}

function Actividades({ dia, activa }: { dia: Dia; activa: boolean }) {
  const filtros = useFiltros();
  const lista = ordenarActividades(dia.actividades).filter((a) => cumple(a, filtros));
  const activos = filtros.zona.length + filtros.tipo.length + filtros.modalidad.length;
  const otros = programa.dias
    .filter((d) => d.numero !== dia.numero)
    .map((d) => ({ d, n: d.actividades.filter((a) => cumple(a, filtros)).length }))
    .filter((x) => x.n > 0);

  return (
    <section id={activa ? "actividades" : undefined} aria-labelledby={`act-${dia.numero}`} className="scroll-mt-6 lg:col-span-12 lg:scroll-mt-24">
      <div className="flex items-center gap-4">
        <h4 id={`act-${dia.numero}`} className="shrink-0 font-display text-xl uppercase">
          Actividades
        </h4>
        <span className="h-px flex-1 bg-vino" />
        <span className="rotulo shrink-0" aria-live="polite">
          {lista.length} de {dia.actividades.length}
        </span>
      </div>

      <PanelFiltros activos={activos} />

      {lista.length ? (
        <div className="mt-6 grid items-start gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((a) => (
            <Actividad key={a.titulo} a={a} zona={programa.zonas[a.zona]} />
          ))}
        </div>
      ) : (
        <div className="mt-6 filete pt-4">
          <p className="font-display text-2xl font-bold uppercase">Nada con esos filtros este día.</p>
          <p className="mt-2">
            {otros.length
              ? `Hay ${otros.map(({ d, n }) => `${n} el día ${d.numero}`).join(" y ")}. Cambiá de día o sacá algún filtro.`
              : "Sacá algún filtro para ver más."}
          </p>
        </div>
      )}
    </section>
  );
}

function PanelFiltros({ activos }: { activos: number }) {
  const filtros = useFiltros();
  const panel = useRef<HTMLDetailsElement>(null);

  // En escritorio los filtros arrancan abiertos; en el celular, plegados
  useEffect(() => {
    if (panel.current && window.matchMedia("(min-width: 64rem)").matches) panel.current.open = true;
  }, []);

  // Si el mapa elige una zona, el panel se abre para mostrarla
  useEffect(() => {
    if (panel.current && filtros.zona.length) panel.current.open = true;
  }, [filtros.zona]);

  const boton = (activo: boolean) =>
    `rotulo flex items-center gap-1.5 border border-vino px-2 py-1.5 transition-colors ${
      activo ? "bg-vino text-blanco" : "hover:bg-rosa"
    }`;

  return (
    <details ref={panel} className="group mt-4">
      <summary className="rotulo flex cursor-pointer list-none items-center gap-2 py-1 [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="inline-block transition-transform group-open:rotate-90">
          ›
        </span>
        Filtrar por zona, tipo y modalidad
        {activos > 0 && <span className="bg-rosa px-1.5">{activos} activos</span>}
      </summary>
      <div className="mt-3 grid gap-4 md:grid-cols-[2fr_1fr_1fr] md:gap-6">
        <fieldset>
          <legend className="rotulo mb-2">Zona</legend>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(programa.zonas).map(([nombre, z]) => {
              const activo = filtros.zona.includes(nombre);
              return (
                <button key={nombre} type="button" aria-pressed={activo} onClick={() => alternarFiltro("zona", nombre)} className={boton(activo)}>
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0"
                    style={{ background: z.color, boxShadow: `inset 0 0 0 1px ${z.borde ?? (activo ? "#fff" : z.color)}` }}
                  />
                  {nombre}
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="rotulo mb-2">Tipo</legend>
          <div className="flex flex-wrap gap-1.5">
            {TIPOS.map((t) => {
              const activo = filtros.tipo.includes(t);
              return (
                <button key={t} type="button" aria-pressed={activo} onClick={() => alternarFiltro("tipo", t)} className={boton(activo)}>
                  {t}
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="rotulo mb-2">Modalidad</legend>
          <div className="flex flex-wrap gap-1.5">
            {MODALIDADES.map((m) => {
              const activo = filtros.modalidad.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => alternarFiltro("modalidad", m)}
                  className={boton(activo)}
                >
                  <Modo modalidad={m} conTexto />
                </button>
              );
            })}
          </div>
        </fieldset>
        {activos > 0 && (
          <button type="button" onClick={limpiarFiltros} className="rotulo justify-self-start underline underline-offset-4 md:col-span-3">
            Sacar filtros
          </button>
        )}
      </div>
    </details>
  );
}
