import { FotoPendiente, Modo, TipoEtiqueta, ZonaEtiqueta } from "./signos";
import type { Actividad as A, Zona } from "@/lib/programa";

/*
  Una actividad como en la columna impresa: hora grande, tipo con contorno y
  la o de modalidad arriba a la derecha, recuadro de zona abajo. La destacada
  del día lleva foto y fondo rosa.
*/
export function Actividad({ a, zona, antes }: { a: A; zona: Zona; antes?: React.ReactNode }) {
  return (
    <article className={`flex flex-col ${a.destacado ? "bg-rosa md:row-span-2" : "filete pt-3"}`}>
      {a.destacado && <FotoPendiente className="aspect-[16/9]" />}
      <div className={`flex flex-1 flex-col ${a.destacado ? "p-3" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-4xl leading-none font-bold">
            {antes}
            <time>{a.inicio}</time>
          </p>
          <div className="flex items-center gap-2 pt-1">
            <TipoEtiqueta tipo={a.tipo} />
            <Modo modalidad={a.modalidad} />
          </div>
        </div>
        <h4 className="mt-2 font-display text-xl leading-tight font-medium">{a.titulo}</h4>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed">{a.descripcion}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <ZonaEtiqueta nombre={a.zona} zona={zona} />
          <span className="rotulo">
            Hasta {a.fin} · {a.duracion}
          </span>
        </div>
      </div>
    </article>
  );
}
