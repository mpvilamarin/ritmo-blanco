"use client";

import "./actividades.css";
import type { CSSProperties } from "react";
import { Foto } from "./base";
import { Modo } from "../signos";
import { cambiarPrograma, usePrograma } from "@/lib/estado-programa";
import { ACTIVIDADES } from "@/lib/rb";
import { minutos, programa } from "@/lib/programa";

type Item = (typeof ACTIVIDADES)[number];

/* Línea de tiempo del impreso: franjas de media hora desde las 14 */
const DESDE = minutos("14:00");
const FRANJA = 30;
const HORAS = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
const franja = (hora: string) => (minutos(hora) - DESDE) / FRANJA + 1;

/* Cada actividad toma el primer carril libre: así se apilan como en el impreso */
function carriles(lista: Item[]) {
  const finales: number[] = [];
  return lista.map((a) => {
    let carril = finales.findIndex((fin) => fin <= minutos(a.inicio));
    if (carril < 0) carril = finales.length;
    finales[carril] = minutos(a.fin);
    return carril;
  });
}

/*
  Caja del impreso: franja con el color de la zona, hora, título y la zona en
  una etiqueta rellena; tipo y modalidad arriba a la derecha. Al tocarla se
  abre la descripción. La destacada del día va en rosa, con foto.
*/
export function CajaActividad({ a, style }: { a: Item; style?: CSSProperties }) {
  const { abierta } = usePrograma();
  const z = programa.zonas[a.zona];
  const abierto = abierta === a.clave;
  const id = `caja-${a.clave}`;
  return (
    <article
      className="rb-caja"
      data-destacado={a.destacado || undefined}
      data-casa={z.borde ? true : undefined}
      style={{ "--zona": z.borde ?? z.color, "--zona-etiqueta": z.etiqueta ?? z.color, "--zona-texto": z.texto, ...style } as CSSProperties}
    >
      {a.destacado && <Foto texto="[FOTO]" className="rb-caja-foto" />}
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => cambiarPrograma({ abierta: abierto ? null : a.clave })}
        className="rb-caja-cuerpo"
      >
        <span className="rb-caja-cabeza">
          <span className="rb-caja-hora">{a.inicio}</span>
          <span className="rb-caja-marcas">
            <span className="rb-caja-tipo">{a.tipo}</span>
            <Modo modalidad={a.modalidad} />
          </span>
        </span>
        <span className="rb-caja-titulo">{a.titulo}</span>
        {a.bajada && <span className="rb-caja-bajada">{a.bajada}</span>}
        <span className="rb-caja-zona">{a.zona}</span>
      </button>
      <div id={id} hidden={!abierto} className="rb-caja-detalle">
        <p className="rotulo">
          {a.inicio} a {a.fin} · {a.duracion}
        </p>
        <p className="t-cuerpo mt-2">{a.descripcion}</p>
      </div>
    </article>
  );
}

/* Un día: en escritorio, sobre la línea horaria; en pantallas chicas, en orden horario */
export function LineaActividades({ lista, etiqueta }: { lista: Item[]; etiqueta: string }) {
  const orden = [...lista].sort((a, b) => minutos(a.inicio) - minutos(b.inicio) || a.zona.localeCompare(b.zona));
  const fila = carriles(orden);
  // La hora es un filete que baja por todas las filas de cajas
  const hastaFila = Math.max(0, ...fila) + 3;
  return (
    <div className="rb-linea" role="list" aria-label={etiqueta}>
      {HORAS.map((h) => (
        <span key={h} aria-hidden className="rb-linea-hora" style={{ gridColumn: franja(h), gridRow: `1 / ${hastaFila}` }}>
          {h}
        </span>
      ))}
      {orden.map((a, i) => (
        <div
          key={a.clave}
          role="listitem"
          className="rb-linea-item"
          style={{ "--desde": franja(a.inicio), "--hasta": franja(a.fin), "--fila": fila[i] + 2 } as CSSProperties}
        >
          <CajaActividad a={a} />
        </div>
      ))}
    </div>
  );
}
