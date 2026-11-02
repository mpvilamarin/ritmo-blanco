"use client";

import { useState } from "react";
import Image from "next/image";
import { Encabezado, Flecha, boton } from "./base";
import { Signo } from "../signos";
import { BotonPrograma } from "./boton-programa";
import { ACTIVIDADES, DIAS, PALETA, SHOWS } from "@/lib/rb";
import { programa } from "@/lib/programa";

/* Coordenadas sobre public/fotos/Mapa@2x.png, según el plano marcado. */
const UBICACION: Record<string, { x: number; y: number; w: number }> = {
  "Escenario Mudo": { x: 70, y: 62, w: 16 },
  "Domo Callado": { x: 23, y: 55, w: 15 },
  "Usina Bailable": { x: 59.5, y: 75, w: 19 },
  "Pantalla Muda": { x: 36, y: 68, w: 12 },
  "Instalación central": { x: 49.5, y: 61, w: 10 },
};
const ZONAS = Object.keys(UBICACION).filter((n) => programa.zonas[n]);

const SERVICIOS = [
  {
    id: "acceso",
    letra: "A",
    label: "Accesos",
    pts: [
      [37, 86],
      [70.5, 95],
    ],
  },
  {
    id: "agua",
    letra: "B",
    label: "Hidratación libre",
    pts: [
      [30.5, 28.5],
      [65, 44],
    ],
  },
  { id: "aux", letra: "C", label: "Primeros auxilios", pts: [[75.5, 72]] },
  { id: "auri", letra: "D", label: "Auriculares (con DNI)", pts: [[44, 75]] },
  { id: "banos", letra: "E", label: "Baños", pts: [[82, 79.5]] },
  { id: "bici", letra: "F", label: "Bicicleteros", pts: [[32.3, 76.5]] },
];

export function Mapa() {
  const [zona, setZona] = useState("Escenario Mudo");
  const [servicio, setServicio] = useState<string | null>(null);

  const items = [
    ...ACTIVIDADES.map((a) => ({ dia: a.dia, inicio: a.inicio, titulo: a.titulo, zona: a.zona, show: false })),
    ...SHOWS.map((s) => ({ dia: s.dia, inicio: s.inicio, titulo: s.nombre, zona: programa.dias[0].lineup.escenario, show: true })),
  ]
    .filter((i) => i.zona === zona)
    .sort((a, b) => a.dia - b.dia || a.inicio.localeCompare(b.inicio));
  const z = programa.zonas[zona];
  const esEscenario = zona === programa.dias[0].lineup.escenario;
  // Shows y actividades se cuentan por separado: el escenario también tiene charlas
  const nShows = items.filter((i) => i.show).length;
  const nActividades = items.length - nShows;
  const conteo = [
    nShows && `${nShows} ${nShows === 1 ? "show" : "shows"}`,
    nActividades && `${nActividades} ${nActividades === 1 ? "actividad" : "actividades"}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section id="mapa" aria-labelledby="mapa-titulo" className="pantalla scroll-mt-4 bg-blanco">
      <div className="contenido">
        <Encabezado
          id="mapa-titulo"
          rotulo="Cómo moverte en el bosque"
          titulo={["Mapa", "del predio"]}
          texto={<p>Tocá una zona para ver qué pasa ahí, o un servicio para encontrarlo en el mapa.</p>}
        />

        <div role="group" aria-label="Servicios" className="flex flex-wrap gap-2">
          {SERVICIOS.map((s) => {
            const on = servicio === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                onClick={() => setServicio(on ? null : s.id)}
                className={`rotulo inline-flex min-h-11 cursor-pointer items-center gap-2 border border-vino px-3 ${on ? "bg-vino text-blanco" : "hover:bg-crudo"}`}
              >
                <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-vino text-blanco">
                  {s.letra}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* En escritorio la zona se elige en el plano o en la leyenda */}
        <div className="mt-6 flex flex-wrap items-center gap-3 lg:hidden">
          <label htmlFor="mapa-zona" className="t-chico font-semibold">
            Elegí una zona
          </label>
          <select
            id="mapa-zona"
            value={zona}
            onChange={(e) => {
              setZona(e.target.value);
              setServicio(null);
            }}
            className="t-chico min-h-11 max-w-full border border-vino bg-blanco px-3"
          >
            {ZONAS.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
          <p id="mapa-ayuda" className="t-chico lg:hidden">
            Deslizá el mapa hacia los costados para recorrerlo.
          </p>
        </div>
        <div className="mt-6 grid gap-6 lg:mt-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex min-w-0 flex-col gap-1">
            <div
              tabIndex={0}
              role="region"
              aria-label="Mapa del predio"
              aria-describedby="mapa-ayuda"
              className="min-w-0 self-start overflow-x-auto border border-vino"
            >
              <div className="relative aspect-[1684/790] min-w-[800px] bg-blanco">
                <Image
                  src="/fotos/Mapa@2x.png"
                  alt="Plano del predio con lagunas, arboledas y senderos entre las zonas del festival."
                  width={1684}
                  height={790}
                  unoptimized
                  className="absolute inset-0 size-full"
                />
                {ZONAS.map((nombre) => {
                  const u = UBICACION[nombre];
                  const zz = programa.zonas[nombre];
                  const on = zona === nombre && !servicio;
                  return (
                    <button
                      key={nombre}
                      type="button"
                      aria-pressed={on}
                      aria-label={`${nombre}: ${zz.uso}`}
                      onClick={() => {
                        setZona(nombre);
                        setServicio(null);
                      }}
                      className={`absolute flex min-h-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-sm px-1 py-2 text-vino transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vino ${on ? "bg-blanco/75 ring-1 ring-vino" : "hover:bg-blanco/60"}`}
                      style={{ left: `${u.x}%`, top: `${u.y}%`, width: `${u.w}%`, opacity: servicio ? 0.4 : 1 }}
                    >
                      <span style={{ color: zz.color }}>
                        <Signo canal="tumbao" className="size-6" />
                      </span>
                      <span className="max-w-[12ch] text-center font-sans text-[13px] leading-none font-bold">{nombre}</span>
                    </button>
                  );
                })}
                {SERVICIOS.flatMap((s) =>
                  s.pts.map(([x, y]) => (
                    <button
                      key={`${s.id}-${x}`}
                      type="button"
                      aria-label={`${s.letra}: ${s.label}`}
                      aria-pressed={servicio === s.id}
                      onClick={() => setServicio(servicio === s.id ? null : s.id)}
                      className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full font-mono text-[0.875rem] font-bold text-blanco transition-[opacity,scale] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vino"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        scale: servicio === s.id ? 1.3 : 1,
                        opacity: servicio && servicio !== s.id ? 0.25 : 1,
                      }}
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-vino">{s.letra}</span>
                    </button>
                  )),
                )}
              </div>
            </div>
            {/* Leyenda bajo el plano: cada zona con su color, en una grilla de tres */}
            <div className="grid grid-cols-2 items-center gap-x-4 sm:grid-cols-3">
              <p className="rotulo">Zonas</p>
              <ul className="contents">
                {ZONAS.map((nombre) => {
                  const zz = programa.zonas[nombre];
                  return (
                    <li key={nombre}>
                      <button
                        type="button"
                        onClick={() => {
                          setZona(nombre);
                          setServicio(null);
                        }}
                        className={`t-chico flex min-h-11 cursor-pointer items-center gap-2 ${zona === nombre ? "font-semibold underline underline-offset-4" : ""}`}
                      >
                        {/* Muestra de color sin texto encima: el vino chico no pasa sobre lila vivo */}
                        <span
                          aria-hidden
                          className="size-4 shrink-0"
                          style={{ background: zz.color, boxShadow: zz.borde ? `inset 0 0 0 1px ${zz.borde}` : undefined }}
                        />
                        {nombre}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col border-t border-vino pt-5 lg:border-t-0 lg:pt-0" aria-live="polite">
            <p className="rotulo flex items-center gap-2">
              <span className="size-3" style={{ background: z.color, boxShadow: `inset 0 0 0 1px ${PALETA.vino}` }} />
              {conteo}
            </p>
            <h3 className="t-2 mt-2">{zona}</h3>
            <p className="t-cuerpo mt-2">{z.uso}</p>
            <ul className="mt-4 border-t border-vino/25">
              {items.slice(0, 5).map((it) => (
                <li
                  key={`${it.dia}-${it.titulo}`}
                  className="t-chico grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 border-b border-vino/25 py-2"
                >
                  <span className="font-semibold">
                    {DIAS[it.dia - 1].fecha} · {it.inicio}
                  </span>
                  <span>{it.titulo}</span>
                </li>
              ))}
            </ul>
            {/* La lista muestra 5: el link dice cuántos hay en total */}
            <BotonPrograma
              filtro={esEscenario ? { vista: "lineup" } : { vista: "actividades", zona, tipo: null, modalidad: null, abierta: null }}
              className={`${boton("vino")} mt-5 self-start`}
            >
              {items.length > 5 ? `Ver los ${items.length} en el programa` : "Buscalo en el programa"}
              <Flecha />
            </BotonPrograma>
          </div>
        </div>
      </div>
    </section>
  );
}
