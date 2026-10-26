"use client";

import { Encabezado, Foto } from "./base";
import { Modo, Signo } from "../signos";
import { cambiarPrograma, usePrograma } from "@/lib/estado-programa";
import { ACTIVIDADES, CANAL, DIAS, FORMA_TIPO, SHOWS, capital, tipoLindo } from "@/lib/rb";
import { CANALES, MODALIDADES, NOMBRE_MODALIDAD, TIPOS, programa, type Tipo } from "@/lib/programa";

/* Signo de cada tipo de actividad: forma chica en el color del diseño */
function FormaTipo({ tipo }: { tipo: Tipo }) {
  const f = FORMA_TIPO[tipo];
  return <span aria-hidden className="inline-block shrink-0" style={{ width: f.w / 2, height: f.h / 2, borderRadius: f.r, background: f.c }} />;
}

const chip = (on: boolean) =>
  `rotulo inline-flex cursor-pointer items-center gap-2 border border-vino px-3 py-2 transition-colors ${
    on ? "bg-vino text-blanco" : "hover:bg-crema"
  }`;

export function Programa() {
  const e = usePrograma();
  const shows = SHOWS.filter((s) => s.dia === e.dia);
  const delDia = ACTIVIDADES.filter((a) => a.dia === e.dia);
  const filtradas = delDia
    .filter((a) => (!e.tipo || a.tipo === e.tipo) && (!e.modalidad || a.modalidad === e.modalidad) && (!e.zona || a.zona === e.zona))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
  const destacada = filtradas.find((a) => a.destacado);
  const resto = filtradas.filter((a) => a !== destacada);
  const cierre = shows.find((s) => s.cierre)!;
  const franjas = [...new Set(shows.filter((s) => !s.cierre).map((s) => s.inicio))];
  const escenario = programa.dias[0].lineup.escenario;

  return (
    <section id="programa" aria-labelledby="programa-titulo" className="banda contenido scroll-mt-4">
      <Encabezado
        id="programa-titulo"
        rotulo={`Programa · ${DIAS.length} días`}
        titulo="Programa"
        texto={<p>Elegí un día. Los shows suenan de 16 a 23 en el {escenario}; los talleres, charlas y clases arrancan a las 14.</p>}
      />

      {/* Días: tres celdas de la grilla */}
      <div role="tablist" aria-label="Días" className="mt-12 grid grid-cols-3 border-y border-vino">
        {DIAS.map((d, i) => {
          const on = e.dia === d.numero;
          return (
            <button
              key={d.numero}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => cambiarPrograma({ dia: d.numero, abierta: null })}
              className={`flex cursor-pointer flex-col items-start gap-1 p-3 text-left transition-colors md:p-5 ${i > 0 ? "border-l border-vino" : ""} ${
                on ? "bg-vino text-blanco" : "hover:bg-crema"
              }`}
            >
              <span className="rotulo">{d.etiqueta}</span>
              <span className="t-2">{d.fecha}</span>
              <span className="t-3">{d.nombre}</span>
            </button>
          );
        })}
      </div>

      <div role="tablist" aria-label="Vista" className="mt-6 flex gap-6 border-b border-vino/20">
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
              className={`rotulo -mb-px cursor-pointer border-b-2 py-3 ${on ? "border-vino" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              {label} · {n}
            </button>
          );
        })}
      </div>

      {e.vista === "lineup" && (
        <div className="mt-8">
          <div className="hidden grid-cols-[8rem_repeat(3,minmax(0,1fr))] gap-6 border-b border-vino pb-3 md:grid">
            <span className="rotulo">{escenario}</span>
            {CANALES.map((c) => (
              <span key={c} className="rotulo flex items-center gap-2">
                <Signo canal={c} className="size-3.5" />
                {CANAL[c].nombre} · {CANAL[c].que}
              </span>
            ))}
          </div>
          {franjas.map((inicio) => {
            const celdas = CANALES.map((c) => shows.find((s) => s.inicio === inicio && s.canal === c)!);
            return (
              <div key={inicio} className="grid gap-4 border-b border-vino py-6 md:grid-cols-[8rem_repeat(3,minmax(0,1fr))] md:gap-6">
                <p>
                  <span className="t-2 block">{inicio}</span>
                  <span className="rotulo mt-1 block">hasta {celdas[0].fin}</span>
                </p>
                {celdas.map((a, k) => (
                  <div key={a.slug} className="flex gap-3">
                    <Signo canal={CANALES[k]} className="mt-1 size-4 md:hidden" />
                    <div>
                      <p className="t-3">{a.nombre}</p>
                      <p className="t-chico mt-1">
                        <span className="md:hidden">{CANAL[CANALES[k]].nombre} · </span>
                        {a.que}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          <div className="mt-8 grid gap-4 bg-vino p-6 text-blanco md:grid-cols-[8rem_1fr] md:gap-6 md:p-8">
            <p>
              <span className="t-2 block">{cierre.inicio}</span>
              <span className="rotulo mt-1 block text-rosa">hasta {cierre.fin}</span>
            </p>
            <div>
              <p className="rotulo flex items-center gap-2 text-rosa">
                <span className="flex gap-1">
                  {CANALES.map((c) => (
                    <Signo key={c} canal={c} className="size-3.5" />
                  ))}
                </span>
                Cierre · los 3 canales a la vez
              </p>
              <p className="t-1 mt-3">{cierre.nombre}</p>
              <p className="t-cuerpo mt-2 text-melocoton">{capital(cierre.que)}</p>
            </div>
          </div>
        </div>
      )}

      {e.vista === "actividades" && (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-[auto_1fr] md:gap-x-6">
            <p className="rotulo md:pt-2.5">Tipo</p>
            <div role="group" aria-label="Tipo" className="flex flex-wrap gap-1.5">
              <button type="button" aria-pressed={!e.tipo} onClick={() => cambiarPrograma({ tipo: null, abierta: null })} className={chip(!e.tipo)}>
                Todo
              </button>
              {TIPOS.map((t) => (
                <button key={t} type="button" aria-pressed={e.tipo === t} onClick={() => cambiarPrograma({ tipo: t, abierta: null })} className={chip(e.tipo === t)}>
                  <FormaTipo tipo={t} />
                  {tipoLindo(t)}
                </button>
              ))}
            </div>
            <p className="rotulo md:pt-2.5">Modalidad</p>
            <div role="group" aria-label="Modalidad" className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                aria-pressed={!e.modalidad}
                onClick={() => cambiarPrograma({ modalidad: null, abierta: null })}
                className={chip(!e.modalidad)}
              >
                Todas
              </button>
              {MODALIDADES.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={e.modalidad === m}
                  onClick={() => cambiarPrograma({ modalidad: m, abierta: null })}
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
          </div>

          {destacada && (
            <div className="mt-8 grid bg-rosa md:grid-cols-2">
              <Foto texto="[FOTO] Actividad destacada" className="min-h-[220px]" />
              <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
                <p className="rotulo">Destacado del día</p>
                <p className="t-2">{destacada.titulo}</p>
                <p className="rotulo">
                  {destacada.inicio} — {destacada.fin} · {tipoLindo(destacada.tipo)} · {destacada.zona} · {NOMBRE_MODALIDAD[destacada.modalidad]}
                </p>
                <p className="t-cuerpo">{destacada.descripcion}</p>
              </div>
            </div>
          )}

          <ul className="mt-8 border-t border-vino">
            {resto.map((a) => {
              const abierta = e.abierta === a.clave;
              const z = programa.zonas[a.zona];
              return (
                <li key={a.clave} className="border-b border-vino/25">
                  <button
                    type="button"
                    aria-expanded={abierta}
                    onClick={() => cambiarPrograma({ abierta: abierta ? null : a.clave })}
                    className="grid w-full cursor-pointer grid-cols-[4.5rem_minmax(0,1fr)_1.5rem] items-start gap-4 py-5 text-left hover:bg-crema/40 md:grid-cols-[8rem_minmax(0,1fr)_1.5rem] md:gap-6"
                  >
                    <span>
                      <span className="t-3 block">{a.inicio}</span>
                      <span className="rotulo mt-1 block">hasta {a.fin}</span>
                    </span>
                    <span className="flex min-w-0 flex-col gap-2">
                      <span className="t-3">{a.titulo}</span>
                      <span className="rotulo flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <span className="inline-flex items-center gap-1.5">
                          <FormaTipo tipo={a.tipo} />
                          {tipoLindo(a.tipo)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="size-2.5" style={{ background: z.color, boxShadow: "0 0 0 1px #692136" }} />
                          {a.zona}
                        </span>
                        <Modo modalidad={a.modalidad} conTexto />
                        <span className="opacity-70">{a.duracion}</span>
                      </span>
                    </span>
                    <span aria-hidden className={`t-3 text-right transition-transform ${abierta ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {abierta && (
                    <div className="grid gap-4 pb-6 md:grid-cols-[8rem_minmax(0,1fr)_12rem] md:gap-6">
                      <span className="hidden md:block" />
                      <p className="t-cuerpo max-w-[40rem]">{a.descripcion}</p>
                      <Foto className="aspect-[4/3]" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {filtradas.length === 0 && <p className="t-3 py-10 text-center">Nada con esos filtros este día.</p>}
        </>
      )}
    </section>
  );
}
